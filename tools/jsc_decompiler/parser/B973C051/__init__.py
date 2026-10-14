"""Cocos51 (0xB973C051) parser — Cocos2d-x custom MozJS34 variant.

Handles: header parsing, code decoding, atom/const extraction,
nested object parsing. Returns DisasmFunc — no decompiler dependency.
"""

import struct
from ..utils import u32le
from .codegen import parse_code
import re as _re

from disasm import DisasmFunc
import re as _re

_ESCAPE_CLEANUP = _re.compile(r"\\([+=:;,.|/])")


def _clean_regex_source(src):
    src = _ESCAPE_CLEANUP.sub(r"\1", src)
    parts = []
    in_class = False
    for ch in src:
        if ch == "[" and not in_class:
            in_class = True
            parts.append(ch)
        elif ch == "]" and in_class:
            in_class = False
            parts.append(ch)
        elif ch == "/" and not in_class:
            parts.append("\\/")
        else:
            parts.append(ch)
    return "".join(parts)


def parse(data):
    func, code_start, code_end = _parse_header(data)
    if func.codelen > 0:
        func.ops = parse_code(data, code_start, code_end)
    _parse_atoms(data, func, code_end)
    if func.nobj > 0:
        try:
            atoms_end = _find_atoms_end(data, func, code_end)
            func.children, sub_off = _parse_objects(data, atoms_end, func.nobj)
            for _ch in func.children:
                if _ch is not None:
                    _ch.parent = func
        except Exception:
            sub_off = None
    else:
        sub_off = _find_atoms_end(data, func, code_end)
    if func.nreg > 0 and sub_off is not None:
        regexps = []
        o = sub_off
        for _ in range(func.nreg):
            if o + 4 > len(data):
                break
            rl = struct.unpack_from("<I", data, o)[0]
            o += 4
            if rl == 0:
                regexps.append("")
                continue
            sz = rl * 2
            if o + sz > len(data):
                regexps.append("")
                break
            try:
                src = data[o : o + sz].decode("utf-16le")
            except UnicodeDecodeError:
                src = ""
            o += sz
            if o + 4 > len(data):
                regexps.append(src)
                break
            flags = struct.unpack_from("<I", data, o)[0]
            o += 4
            suffix = ""
            if flags & 0x02:
                suffix += "g"
            if flags & 0x04:
                suffix += "i"
            if flags & 0x08:
                suffix += "m"
            if flags & 0x10:
                suffix += "y"
            regexps.append(f"/{_clean_regex_source(src)}/{suffix}")
        func.regexps = regexps
        sub_off = o
    # Root const pool sits after objects/regexps (like sub-functions), with
    # optional 12-byte try-note records before it.  Parse with validation.
    if func.nconst > 0 and sub_off is not None:
        candidates = []
        if 0 < func.ntry <= 100:
            candidates.append(sub_off + func.ntry * 12)
        candidates.append(sub_off)
        for cand in candidates:
            res = _parse_const_pool(data, cand, func.nconst)
            if res is not None:
                func.consts, sub_off = res
                break
    _restructure_children(func)
    return func


def _restructure_children(func):
    """Promote non-lambda-owned nested children to be siblings.

    In the Cocos51 binary, nobj counts ALL inner objects including
    BlockObject/WithObject. The parser places them all as children.
    But lambda/deffun idx only indexes JSFunction objects that are
    directly referenced by the parent's own lambda/deffun ops.

    Non-lambda-owned children (BlockObject etc.) should be promoted
    to be siblings at the parent level so that lambda idx correctly
    indexes only the lambda-owned children.
    """
    _restructure_recursive(func)


def _restructure_recursive(func):
    for child in func.children:
        if child is not None:
            _restructure_recursive(child)

    new_children = []
    for child in func.children:
        if child is None:
            new_children.append(child)
            continue
        lambda_indices = set()
        for op in child.ops:
            if op["nm"] in ("lambda", "deffun", "lambda_arrow"):
                lambda_indices.add(op["params"].get("idx", -1))
        lambda_owned_count = len(lambda_indices)
        if child.nobj > lambda_owned_count and lambda_owned_count < len(child.children):
            keep = child.children[:lambda_owned_count]
            promote = child.children[lambda_owned_count:]
            child.children = keep
            child.nobj = lambda_owned_count
            new_children.append(child)
            for p in promote:
                if p is not None:
                    p.parent = func
                new_children.append(p)
        else:
            new_children.append(child)
    func.children = new_children


def _parse_header(data):
    func = DisasmFunc()
    func.is_cocos = True

    ver = u32le(data, 0)

    path_start = 60
    nul = data.find(b"\x00", path_start)
    if nul >= 0 and nul > path_start and (nul - path_start) < 512:
        func.source_path = data[path_start:nul].decode("utf-8", errors="replace")
    else:
        func.source_path = ""
        nul = path_start

    func.codelen = u32le(data, 8)
    func.nvars = u32le(data, 12)
    func.natoms = u32le(data, 20)
    func.nsrc = u32le(data, 24)
    func.nobj = u32le(data, 32)
    func.nreg = u32le(data, 36)
    # Root nconst lives at offset 40 (verified against `double idx` usage);
    # offset 28 appears to be the try-note count.
    func.nconst = u32le(data, 40)
    func.ntry = u32le(data, 28)
    func.nblk = u32le(data, 44)
    func.sbits = u32le(data, 56) if u32le(data, 56) < 0x10000 else 0

    meta_start = nul + 1
    while meta_start < len(data) and data[meta_start] == 0:
        meta_start += 1
    meta_start = min(meta_start, nul + 5)
    code_start = meta_start + 12
    code_end = min(code_start + func.codelen, len(data))

    return func, code_start, code_end


def _is_sentinel(d, o):
    """Check if offset o contains the object sentinel 0x00000000+0xFFFFFFFF."""
    return (
        o + 8 <= len(d)
        and struct.unpack_from("<I", d, o)[0] == 0
        and struct.unpack_from("<I", d, o + 4)[0] == 0xFFFFFFFF
    )


def _find_next_sentinel(d, start_off, max_search=5000):
    for i in range(start_off, min(start_off + max_search, len(d) - 8)):
        if (
            struct.unpack_from("<I", d, i)[0] == 0
            and struct.unpack_from("<I", d, i + 4)[0] == 0xFFFFFFFF
        ):
            return i
    return None


def _skip_zero_padding(d, o):
    """Skip 4-byte zero padding, but stop before a sentinel pattern."""
    while o + 8 <= len(d) and struct.unpack_from("<I", d, o)[0] == 0:
        if struct.unpack_from("<I", d, o + 4)[0] == 0xFFFFFFFF:
            break  # sentinel — don't consume
        o += 4
    return o


def _parse_atoms(data, func, code_end):
    d = data
    o = code_end

    nsrc = func.nsrc
    o += nsrc

    natoms = func.natoms
    atoms = []
    for _ in range(natoms):
        if o + 4 > len(d):
            break
        raw_len = struct.unpack_from("<I", d, o)[0]
        o += 4
        if raw_len < 0 or raw_len > 500:
            atoms.append("")
            o -= 4
            continue
        if raw_len == 0:
            atoms.append("")
            continue
        sz = raw_len * 2
        if o + sz > len(d):
            break
        try:
            s = d[o : o + sz].decode("utf-16le")
            atoms.append(s)
        except UnicodeDecodeError:
            atoms.append("")
        o += sz
    func.atoms = atoms


def _find_atoms_end(data, func, code_end):
    d = data
    o = code_end + func.nsrc
    for _ in range(func.natoms):
        if o + 4 > len(d):
            break
        raw_len = struct.unpack_from("<I", d, o)[0]
        o += 4
        if raw_len < 0 or raw_len > 500:
            o -= 4
            continue
        if raw_len == 0:
            continue
        o += raw_len * 2
    return o


def _find_consts_end(data, func, atoms_end):
    d = data
    o = atoms_end
    for _ in range(func.nconst):
        if o >= len(d):
            break
        # Stop if we've hit a sentinel (object separator)
        if _is_sentinel(d, o):
            break
        ct = d[o]
        o += 1
        if ct == 0:
            o += 4
        elif ct == 1:
            o += 8
        elif ct == 2:
            if o + 4 <= len(d):
                rl = struct.unpack_from("<I", d, o)[0]
                o += 4
                o += rl * 2
        elif ct in (3, 4, 5, 7):
            pass
        else:
            break
    return o


def _parse_const_pool(d, off, n):
    """Parse n const-pool entries at off.  Entries are 4-byte LE type tag +
    payload: 0=int(4B), 1=double(8B), 2=string(len+utf16), 3/4/5/7=singleton
    values (no payload).  Returns (consts, end_off), or None if any entry is
    malformed — used to validate candidate pool locations."""
    consts = []
    o = off
    for _ in range(n):
        if o + 4 > len(d) or _is_sentinel(d, o):
            return None
        ct = struct.unpack_from("<I", d, o)[0]
        o += 4
        if ct == 0 and o + 4 <= len(d):
            consts.append(("int", struct.unpack_from("<I", d, o)[0]))
            o += 4
        elif ct == 1 and o + 8 <= len(d):
            consts.append(("double", struct.unpack_from("<d", d, o)[0]))
            o += 8
        elif ct == 2 and o + 4 <= len(d):
            rl = struct.unpack_from("<I", d, o)[0]
            o += 4
            if rl > 10000 or o + rl * 2 > len(d):
                return None
            consts.append(
                ("atom", d[o : o + rl * 2].decode("utf-16le", errors="replace"))
            )
            o += rl * 2
        elif ct in (3, 4, 5, 7):
            consts.append(("val", ct))
        else:
            return None
    return consts, o


def _parse_objects(data, start_off, nobj):
    d = data
    # Components.jsc has 594 inner functions. Bound the count by the input
    # size instead of silently dropping a valid large script's entire pool.
    if nobj <= 0 or nobj > len(data) // 8:
        return [], start_off

    o = start_off
    objects = []

    for obj_idx in range(nobj):
        sentinel_off = _find_next_sentinel(d, o)
        if sentinel_off is None:
            break
        o = sentinel_off + 8

        if o + 8 > len(d):
            break
        firstWord = u32le(d, o)
        has_atom = firstWord & 1
        o2 = o + 4

        atom_name = ""
        if has_atom:
            if o2 + 4 > len(d):
                break
            alen = u32le(d, o2)
            o2 += 4
            if alen == 0 or alen > 200:
                break
            if o2 + alen * 2 <= len(d):
                atom_name = d[o2 : o2 + alen * 2].decode("utf-16le", errors="replace")
            o2 += alen * 2

        if o2 + 4 > len(d):
            break
        o2 += 4  # flagsWord

        if o2 + 56 > len(d):
            break
        fields = [u32le(d, o2 + i * 4) for i in range(13)]
        codelen = fields[1]
        natoms_f = fields[4]
        nobjects_f = fields[7]

        if not (1 <= codelen <= 50000) or natoms_f > 500 or nobjects_f > 500:
            skip_end = o2 + 52
            while skip_end + 4 <= len(d):
                al = struct.unpack_from("<I", d, skip_end)[0]
                if al <= 0 or al > 500:
                    break
                sz = al * 2
                if skip_end + 4 + sz > len(d):
                    break
                try:
                    s = d[skip_end + 4 : skip_end + 4 + sz].decode("utf-16le")
                    if any(ord(c) > 0x7F for c in s):
                        break
                except:
                    break
                skip_end += 4 + sz
            slot_cnt = (skip_end - (o2 + 52)) // 6
            skip_end += slot_cnt + 16 + codelen
            if skip_end > o:
                o = skip_end
            continue

        hdr_end = o2 + 52
        var_slots_end = hdr_end
        slot_count = 0
        var_slot_names = []
        while var_slots_end + 4 <= len(d):
            al = struct.unpack_from("<I", d, var_slots_end)[0]
            if al <= 0 or al > 500:
                break
            sz = al * 2
            if var_slots_end + 4 + sz > len(d):
                break
            try:
                s = d[var_slots_end + 4 : var_slots_end + 4 + sz].decode("utf-16le")
                if any(ord(c) > 0x7F for c in s):
                    break
            except:
                break
            var_slot_names.append(s)
            var_slots_end += 4 + sz
            slot_count += 1
            if slot_count > 100:
                break
        aliased_flags = []
        for si in range(slot_count):
            if var_slots_end + si < len(d):
                aliased_flags.append(bool(d[var_slots_end + si] & 1))
            else:
                aliased_flags.append(False)
        var_slots_end += slot_count
        code_start = var_slots_end + 16
        if code_start + codelen > len(d):
            break

        nargs = (fields[0] >> 16) & 0xFFFF
        argvs = var_slot_names[:nargs] if nargs > 0 and var_slot_names else []

        nconst_f = fields[9]

        func = DisasmFunc()
        func.name = atom_name
        func.nargs = nargs
        func.nvars = 0
        func.codelen = codelen
        func.natoms = natoms_f
        func.nsrc = fields[5]
        func.nconst = nconst_f
        func.nobj = nobjects_f
        func.sbits = fields[12]
        func.argvs = argvs
        func.var_slot_names = var_slot_names
        func.aliased_flags = aliased_flags
        func.aliased_slot_offset = 2
        func.is_cocos = True

        if codelen > 0:
            func.ops = parse_code(d, code_start, code_start + codelen)

        atom_start = code_start + codelen + func.nsrc

        sub_atoms = []
        sub_off = atom_start
        for _ in range(natoms_f):
            if sub_off + 4 > len(d):
                break
            al = struct.unpack_from("<I", d, sub_off)[0]
            sub_off += 4
            if al < 0 or al > 500:
                sub_atoms.append("")
                sub_off -= 4
                continue
            if al == 0:
                sub_atoms.append("")
                continue
            sz = al * 2
            if sub_off + sz > len(d):
                break
            try:
                s = d[sub_off : sub_off + sz].decode("utf-16le")
            except:
                s = ""
            sub_atoms.append(s)
            sub_off += sz
        func.atoms = sub_atoms

        nregexp_f = fields[8] if len(fields) > 8 else 0

        # Child layout after atoms: nested objects → regexps → const pool.
        if nobjects_f > 0:
            sentinel_off = _find_next_sentinel(d, sub_off)
            if sentinel_off is not None:
                sub_off = sentinel_off
            func.children, sub_off = _parse_objects(d, sub_off, nobjects_f)
            for _ch in func.children:
                if _ch is not None:
                    _ch.parent = func

        if nregexp_f > 0:
            regexps = []
            for _ in range(nregexp_f):
                if sub_off + 4 > len(d):
                    break
                rl = struct.unpack_from("<I", d, sub_off)[0]
                sub_off += 4
                if rl == 0:
                    regexps.append("")
                    continue
                sz = rl * 2
                if sub_off + sz > len(d):
                    regexps.append("")
                    break
                try:
                    src = d[sub_off : sub_off + sz].decode("utf-16le")
                except UnicodeDecodeError:
                    src = ""
                sub_off += sz
                if sub_off + 4 > len(d):
                    regexps.append(src)
                    break
                flags = struct.unpack_from("<I", d, sub_off)[0]
                sub_off += 4
                suffix = ""
                if flags & 0x02:
                    suffix += "g"
                if flags & 0x04:
                    suffix += "i"
                if flags & 0x08:
                    suffix += "m"
                if flags & 0x10:
                    suffix += "y"
                regexps.append(f"/{_clean_regex_source(src)}/{suffix}")
            func.regexps = regexps

        # Try notes: fields[6] records of 12 bytes each (kind, stackDepth,
        # start, length) sit between regexps and the const pool.  Their exact
        # position varies, so parse the const pool with validation: prefer the
        # offset past the try notes, fall back to the current offset, and if
        # neither yields a clean pool leave sub_off untouched so sibling
        # object discovery (sentinel search) is not disturbed.
        ntry_f = fields[6]
        sub_consts = []
        if nconst_f > 0:
            candidates = []
            if 0 < ntry_f <= 100:
                candidates.append(sub_off + ntry_f * 12)
            candidates.append(sub_off)
            for cand in candidates:
                res = _parse_const_pool(d, cand, nconst_f)
                if res is not None:
                    sub_consts, sub_off = res
                    break
        func.consts = sub_consts

        objects.append(func)
        o = sub_off

    return objects, o
