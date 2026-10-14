"""MozJS34 (0xB973C02C) parser — rewritten to match the XDR serialization format.

Based on the PHP reference implementation (jsc-decompile-mozjs-34-master).

XDRScript layout:
  [16 x u32LE header fields (64 bytes)]
  [prolog: flag + optional source + metadata + path + 24-byte sub-header]
  [nargs+nvars atom+u8 pairs (variable names)]
  [bytecode]
  [srcnotes]
  [atoms]
  [consts]
  [objects (classKind-based, NOT sentinel-based)]
  [regexps]
  [trynotes]
  [scopenotes]
  [lazyScript]
"""

import struct
from ..utils import u32le
from .codegen import parse_code
from disasm import DisasmFunc
from .atoms import parse_atom

# Class kinds for object entries
_CK_BLOCK = 0
_CK_WITH = 1
_CK_JSFUNC = 2
_CK_JSOBJ = 3

# FirstWord flags for JSFunction
_FW_HAS_ATOM = 0x1
_FW_IS_STAR_GEN = 0x2
_FW_IS_LAZY = 0x4
_FW_HAS_SINGLETON = 0x8


class _Stream:
    """Byte-stream reader with position tracking."""

    __slots__ = ("data", "pos")

    def __init__(self, data, pos=0):
        self.data = data
        self.pos = pos

    def u8(self):
        v = self.data[self.pos]
        self.pos += 1
        return v

    def u16(self):
        v = struct.unpack_from("<H", self.data, self.pos)[0]
        self.pos += 2
        return v

    def u32(self):
        v = struct.unpack_from("<I", self.data, self.pos)[0]
        self.pos += 4
        return v

    def u64(self):
        v = int.from_bytes(self.data[self.pos : self.pos + 8], "little")
        self.pos += 8
        return v

    def f64(self):
        v = struct.unpack_from("<d", self.data, self.pos)[0]
        self.pos += 8
        return v

    def atom(self):
        """Parse one XDRAtom: u32(isLatin1_bit0 | charCount_bits1-31) + data."""
        raw = self.u32()
        is_lat = raw & 1
        length = raw >> 1
        if is_lat:
            s = self.data[self.pos : self.pos + length].decode(
                "latin-1", errors="replace"
            )
            self.pos += length
        else:
            sz = length * 2
            s = self.data[self.pos : self.pos + sz].decode("utf-16le", errors="replace")
            self.pos += sz
        return s

    def c_string(self):
        """Read null-terminated ASCII string."""
        start = self.pos
        while self.pos < len(self.data) and self.data[self.pos] != 0:
            self.pos += 1
        s = self.data[start : self.pos].decode("latin-1", errors="replace")
        if self.pos < len(self.data):
            self.pos += 1  # skip null
        return s

    def raw(self, n):
        v = self.data[self.pos : self.pos + n]
        self.pos += n
        return v


def parse(data):
    """Top-level entry: parse a MozJS34 JSC file into a DisasmFunc tree."""
    s = _Stream(data)
    func = _xdr_script(s, is_top_level=True)
    return func


def _xdr_script(s, is_top_level=False):
    """Parse one XDRScript — the recursive script/function format.

    Returns a DisasmFunc with ops, atoms, consts, children, etc.
    """
    func = DisasmFunc()
    func.is_cocos = False

    # ── Header (16 x u32) ──
    if is_top_level:
        s.pos = 4  # skip magic
    nargs = s.u16()
    nbl = s.u16()
    nvars = s.u32()
    clen = s.u32()
    prolog = s.u32()
    jsver = s.u32()
    natoms = s.u32()
    nsrc = s.u32()
    nconst = s.u32()
    nobj = s.u32()
    nregexp = s.u32()
    ntry = s.u32()
    nblk = s.u32()
    nts = s.u32()
    flen = s.u32()
    sbits = s.u32()

    func.nargs = nargs
    func.nvars = nvars
    func.codelen = clen
    func.natoms = natoms
    func.nsrc = nsrc
    func.nconst = nconst
    func.nobj = nobj
    func.nreg = nregexp  # nregexp stored as nreg
    func.ntry = ntry
    func.nblk = nblk
    func.sbits = sbits

    # ── Prolog ──
    if is_top_level:
        # Top-level script has prolog with optional source, metadata, path
        _parse_prolog(s, func, prolog, sbits)
    else:
        # Nested scripts: header is followed immediately by variable names
        # (no prolog section)
        pass

    # ── Variable names (nargs + nvars atoms + u8 pairs) ──
    name_count = nargs + nvars
    var_names = []
    for _ in range(name_count):
        var_names.append(s.atom())
    # One u8 per binding: bit0 = aliased (captured by inner closure, lives in
    # CallObject); bits1+ = BindingKind (0=FORMAL, 1=VAR, 2=CONST, 3=INTERNAL).
    # A function with any aliased binding materializes a scope object, which is
    # what the getaliasedvar/setaliasedvar `hops` count traverses.
    aliased_flags = []
    for _ in range(name_count):
        if s.pos < len(s.data):
            aliased_flags.append(bool(s.u8() & 1))
        else:
            aliased_flags.append(False)

    # Populate argvs and var_slot_names
    argvs = var_names[:nargs] if nargs > 0 else []
    var_slot_names = var_names if var_names else []
    func.argvs = argvs
    func.var_slot_names = var_slot_names
    func.aliased_flags = aliased_flags
    func.aliased_slot_offset = 2

    # ── Sub-header (only for non-top-level, if present) ──
    # For nested scripts, after var names there may be:
    # sourceStart, sourceEnd, lineno, column, nslots, staticLevel
    # But this depends on scriptBits. For simplicity, check if we need them.
    # Actually, the PHP implementation reads these for ALL scripts (top-level
    # reads them in the prolog, nested reads them after var names).
    # Let me check: in the PHP code, parserHeader always reads these at the end.
    # For nested scripts, they are also present.
    if not is_top_level:
        # Read 6 x u32 sub-header fields
        # sourceStart_, sourceEnd_, lineno, column, nslots, staticLevel
        if s.pos + 24 <= len(s.data):
            _source_start = s.u32()
            _source_end = s.u32()
            _lineno = s.u32()
            _column = s.u32()
            _nslots = s.u32()
            _static_level = s.u32()

    # ── Bytecode ──
    code_start = s.pos
    code_end = code_start + clen
    if clen > 0 and code_end <= len(s.data):
        func.ops = parse_code(s.data, code_start, code_end)
    s.pos = code_end

    # ── Source notes ──
    s.pos += nsrc

    # ── Atoms ──
    atoms = []
    for _ in range(natoms):
        atoms.append(s.atom())
    func.atoms = atoms

    # ── Consts ──
    consts = []
    for _ in range(nconst):
        c = _xdr_const(s)
        consts.append(c)
    func.consts = consts

    # ── Objects ──
    # All objects (including Block, With, JSObj) occupy an index slot.
    # lambda/deffun use the object-array index, so we must preserve
    # index alignment.  Non-JSFunction objects get a placeholder.
    children = []
    for _ in range(nobj):
        child = _xdr_object(s)
        if child is not None:
            child.parent = func
        children.append(child)  # may be None for non-JSFunction
    func.children = children

    # ── Regexps ──
    for _ in range(nregexp):
        s.atom()  # source
        s.u32()  # flagsword

    # ── Try notes ──
    for _ in range(ntry):
        s.u8()  # kind
        s.u32()  # stackDepth
        s.u32()  # start
        s.u32()  # length

    # ── Scope notes ──
    for _ in range(nblk):
        s.u32()  # index
        s.u32()  # start
        s.u32()  # length
        s.u32()  # parent

    # ── Lazy script ──
    # Check scriptBits for HasLazyScript
    _HAS_LAZY = 18  # bit index
    if sbits & (1 << _HAS_LAZY):
        s.u64()  # packedFields (8 bytes)
        # XDRLazyFreeVariables — skip atoms (numFreeVariables)
        # The count is embedded in packedFields; for now just skip

    return func


def _parse_prolog(s, func, prolog, sbits):
    """Parse the top-level script prolog (source, metadata, path, sub-header)."""
    # scriptBits determines what follows
    _OWN_SOURCE = 12  # bit index for OwnSource
    has_own_source = sbits & (1 << _OWN_SOURCE)

    if has_own_source:
        has_source = s.u8()
        retrievable = s.u8()
        if has_source and not retrievable:
            source_length = s.u32()
            compressed_length = s.u32()
            arguments_not_included = s.u8()
            # Skip source bytes
            byte_count = compressed_length if compressed_length else source_length * 2
            s.pos += byte_count

        has_source_map = s.u8()
        if has_source_map:
            map_len = s.u32()
            s.pos += map_len * 2  # UTF-16LE

        have_display_url = s.u8()
        if have_display_url:
            url_len = s.u32()
            s.pos += url_len

        have_filename = s.u8()
        if have_filename:
            func.source_path = s.c_string()

    # Sub-header (6 x u32 = 24 bytes)
    # sourceStart_, sourceEnd_, lineno, column, nslots, staticLevel
    if s.pos + 24 <= len(s.data):
        s.u32()  # sourceStart_
        s.u32()  # sourceEnd_
        s.u32()  # lineno
        s.u32()  # column
        s.u32()  # nslots
        s.u32()  # staticLevel


def _xdr_const(s):
    """Parse one constant value."""
    type_tag = s.u32()
    if type_tag == 0:
        return ("int", s.u32())
    elif type_tag == 1:
        return ("double", s.f64())
    elif type_tag == 2:
        return ("atom", s.atom())
    elif type_tag == 3:
        return ("bool", True)
    elif type_tag == 4:
        return ("bool", False)
    elif type_tag == 5:
        return ("null", None)
    elif type_tag == 6:
        # SCRIPT_OBJECT — parse inline JSObject
        _xdr_js_object(s)
        return ("object", None)
    elif type_tag == 7:
        return ("void", None)
    elif type_tag == 8:
        return ("hole", None)
    else:
        return ("unknown", type_tag)


def _xdr_js_object(s):
    """Parse a CK_JSObject (inline in constants)."""
    is_array = s.u32()
    s.u32()  # isArray ? length : kind
    capacity = s.u32()
    initialized = s.u32()
    for _ in range(initialized):
        _xdr_const(s)
    nslot = s.u32()
    for _ in range(nslot):
        id_type = s.u32()
        if id_type == 0:  # JSID_TYPE_STRING
            s.atom()
        else:
            s.u32()
        _xdr_const(s)
    s.u32()  # isSingletonTyped
    s.u32()  # frozen
    if is_array:
        s.u32()  # copyOnWrite


def _xdr_object(s):
    """Parse one object entry (classKind + type-specific data).

    For CK_JSFunction, this recursively parses a child script.
    Returns a DisasmFunc for CK_JSFunction, or None for other types.
    """
    ck = s.u32()

    if ck == _CK_JSFUNC:
        return _xdr_js_function(s)
    elif ck == _CK_BLOCK:
        _xdr_block_object(s)
        return None
    elif ck == _CK_WITH:
        s.u32()  # enclosingStaticScopeIndex
        return None
    elif ck == _CK_JSOBJ:
        _xdr_js_object(s)
        return None
    else:
        # Unknown class kind — can't continue reliably
        return None


def _xdr_block_object(s):
    """Parse CK_BlockObject."""
    s.u32()  # enclosingStaticScopeIndex
    count = s.u32()
    s.u32()  # offset
    for _ in range(count):
        s.atom()  # atom
        s.u32()  # aliased


def _xdr_js_function(s):
    """Parse CK_JSFunction → XDRInterpretedFunction.

    Reads funEnclosingScopeIndex, firstWord, optional atom name, flagsWord,
    then either a lazy script or a full recursive XDRScript.
    Returns a DisasmFunc.
    """
    _enc_scope = s.u32()  # funEnclosingScopeIndex

    firstword = s.u32()
    has_atom = firstword & _FW_HAS_ATOM
    is_star_gen = firstword & _FW_IS_STAR_GEN
    is_lazy = firstword & _FW_IS_LAZY

    atom_name = ""
    if has_atom:
        atom_name = s.atom()

    _flagsword = s.u32()

    if is_lazy:
        # XDRLazyScript: begin, end, lineno, column, packedFields(8 bytes)
        s.u32()  # begin
        s.u32()  # end
        s.u32()  # lineno
        s.u32()  # column
        s.u64()  # packedFields
        # Return a placeholder DisasmFunc for lazy scripts
        func = DisasmFunc()
        func.name = atom_name
        func.is_cocos = False
        func.sbits = 1 << 18  # HasLazyScript
        return func

    # Full script — recursive XDRScript
    child = _xdr_script(s, is_top_level=False)
    child.name = atom_name

    # Set generator flag if needed
    if is_star_gen:
        child.sbits |= 1 << 8  # IsStarGenerator bit

    return child
