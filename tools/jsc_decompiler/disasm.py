"""Disassembly data model — the bridge between parser and decompiler.

Parser produces Disasm, decompiler consumes it.
Format is version-agnostic: both Cocos51 and MozJS34 produce the same Disasm.
"""

import json


class DisasmFunc:
    __slots__ = (
        "name",
        "nargs",
        "nvars",
        "codelen",
        "natoms",
        "nsrc",
        "nconst",
        "nobj",
        "nreg",
        "ntry",
        "nblk",
        "sbits",
        "argvs",
        "var_slot_names",
        "aliased_flags",
        "aliased_slot_offset",
        "atoms",
        "consts",
        "ops",
        "children",
        "flat_children",
        "source_path",
        "source_text",
        "is_cocos",
        "parent",
        "regexps",
    )

    def __init__(self):
        self.name = ""
        self.nargs = 0
        self.nvars = 0
        self.codelen = 0
        self.natoms = 0
        self.nsrc = 0
        self.nconst = 0
        self.nobj = 0
        self.nreg = 0
        self.ntry = 0
        self.nblk = 0
        self.sbits = 0
        self.argvs = []
        self.var_slot_names = []
        self.aliased_flags = []
        self.aliased_slot_offset = 0
        self.atoms = []
        self.consts = []
        self.ops = []
        self.children = []
        self.flat_children = None
        self.source_path = ""
        self.source_text = ""
        self.is_cocos = False
        self.parent = None
        self.regexps = []

    def get_flat_children(self):
        if self.flat_children is not None:
            return self.flat_children
        flat = []
        for child in self.children:
            flat.append(child)
            if child is not None:
                flat.extend(child.get_flat_children())
        self.flat_children = flat
        return flat

    def to_text(self):
        lines = []
        lines.append(f'.func "{_esc(self.name)}"')
        lines.append(
            f".meta nargs={self.nargs} nvars={self.nvars} codelen={self.codelen} "
            f"natoms={self.natoms} nsrc={self.nsrc} nconst={self.nconst} "
            f"nobj={self.nobj} nreg={self.nreg} ntry={self.ntry} "
            f"nblk={self.nblk} sbits={self.sbits} cocos={int(self.is_cocos)}"
        )
        if self.source_path:
            lines.append(f'.source "{_esc(self.source_path)}"')
        if self.argvs:
            lines.append(".argvs " + " ".join(f'"{_esc(a)}"' for a in self.argvs))
        if self.var_slot_names:
            parts = []
            for v in self.var_slot_names:
                parts.append(f'"{_esc(v)}"' if v else '""')
            lines.append(".varslots " + " ".join(parts))
        if self.aliased_flags and any(self.aliased_flags):
            lines.append(
                ".aliased " + " ".join("1" if a else "0" for a in self.aliased_flags)
            )
        if self.aliased_slot_offset:
            lines.append(f".aliased_offset {self.aliased_slot_offset}")
        for i, a in enumerate(self.atoms):
            lines.append(f'.atom {i} "{_esc(a)}"')
        for i, c in enumerate(self.consts):
            ct, cv = c
            if ct == "int":
                lines.append(f".const {i} int {cv}")
            elif ct == "double":
                lines.append(f".const {i} double {cv}")
            elif ct == "atom":
                lines.append(f'.const {i} atom "{_esc(cv)}"')
            elif ct == "bool":
                lines.append(f".const {i} bool {cv}")
            elif ct == "null":
                lines.append(f".const {i} null")
            elif ct == "void":
                lines.append(f".const {i} void")
            else:
                lines.append(f".const {i} {ct} {cv}")
        for op in self.ops:
            parts = [f'{op["off"]:06x}: {op["nm"]}']
            for k, v in op["params"].items():
                if k.startswith("_"):
                    continue
                parts.append(f"{k}={v}")
            lines.append(" ".join(parts))
        for child in self.children:
            lines.append("")
            if child is None:
                # Placeholder for non-JSFunction objects (Block, With, JSObj)
                lines.append(".nullchild")
                continue
            lines.append(".begin")
            lines.extend(child.to_text().splitlines())
            lines.append(".end")
        return "\n".join(lines)

    @staticmethod
    def from_text(text):
        func = DisasmFunc()
        children = []
        child_lines = []
        depth = 0
        for line in text.splitlines():
            stripped = line.strip()
            if stripped == ".nullchild" and depth == 0:
                children.append(None)
                continue
            if stripped == ".begin":
                depth += 1
                if depth == 1:
                    child_lines = []
                    continue
            if stripped == ".end":
                depth -= 1
                if depth == 0:
                    children.append(DisasmFunc.from_text("\n".join(child_lines)))
                    continue
            if depth > 0:
                child_lines.append(line)
                continue
            if stripped.startswith(".func "):
                func.name = _unesc(stripped[7:-1].strip('"'))
            elif stripped.startswith(".meta "):
                for part in stripped[6:].split():
                    k, v = part.split("=", 1)
                    v = int(v)
                    if k == "nargs":
                        func.nargs = v
                    elif k == "nvars":
                        func.nvars = v
                    elif k == "codelen":
                        func.codelen = v
                    elif k == "natoms":
                        func.natoms = v
                    elif k == "nsrc":
                        func.nsrc = v
                    elif k == "nconst":
                        func.nconst = v
                    elif k == "nobj":
                        func.nobj = v
                    elif k == "nreg":
                        func.nreg = v
                    elif k == "ntry":
                        func.ntry = v
                    elif k == "nblk":
                        func.nblk = v
                    elif k == "sbits":
                        func.sbits = v
                    elif k == "cocos":
                        func.is_cocos = bool(v)
            elif stripped.startswith(".source "):
                func.source_path = _unesc(stripped[9:-1].strip('"'))
            elif stripped.startswith(".argvs "):
                func.argvs = _parse_string_list(stripped[7:])
            elif stripped.startswith(".varslots "):
                func.var_slot_names = _parse_string_list(stripped[10:])
            elif stripped.startswith(".aliased "):
                func.aliased_flags = [p == "1" for p in stripped[9:].split()]
            elif stripped.startswith(".aliased_offset "):
                func.aliased_slot_offset = int(stripped[16:])
            elif stripped.startswith(".atom "):
                parts = stripped.split(None, 2)
                idx = int(parts[1])
                val = _unesc(stripped[stripped.index('"') + 1 : stripped.rindex('"')])
                while len(func.atoms) <= idx:
                    func.atoms.append("")
                func.atoms[idx] = val
            elif stripped.startswith(".const "):
                parts = stripped.split(None, 3)
                idx = int(parts[1])
                ct = parts[2]
                if ct == "int":
                    cv = int(parts[3])
                elif ct == "double":
                    cv = float(parts[3])
                elif ct == "atom":
                    cv = _unesc(
                        stripped[stripped.index('"') + 1 : stripped.rindex('"')]
                    )
                elif ct == "bool":
                    cv = parts[3] == "True"
                elif ct == "null":
                    cv = None
                elif ct == "void":
                    cv = None
                else:
                    cv = parts[3] if len(parts) > 3 else ""
                while len(func.consts) <= idx:
                    func.consts.append(("int", 0))
                func.consts[idx] = (ct, cv)
            elif ":" in stripped and not stripped.startswith("."):
                colon = stripped.index(":")
                off = int(stripped[:colon], 16)
                rest = stripped[colon + 1 :].strip()
                parts = rest.split()
                nm = parts[0]
                params = {}
                for p in parts[1:]:
                    if "=" in p:
                        pk, pv = p.split("=", 1)
                        try:
                            params[pk] = int(pv)
                        except ValueError:
                            params[pk] = pv
                func.ops.append({"off": off, "nm": nm, "params": params, "len": 0})
        func.children = children
        for child in children:
            if child is not None:
                child.parent = func
        return func


def _esc(s):
    return (
        s.replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\n", "\\n")
        .replace("\r", "\\r")
        .replace("\t", "\\t")
    )


def _unesc(s):
    result = []
    i = 0
    while i < len(s):
        if s[i] == "\\" and i + 1 < len(s):
            c = s[i + 1]
            if c == "n":
                result.append("\n")
                i += 2
            elif c == "r":
                result.append("\r")
                i += 2
            elif c == "t":
                result.append("\t")
                i += 2
            elif c == "\\":
                result.append("\\")
                i += 2
            elif c == '"':
                result.append('"')
                i += 2
            else:
                result.append(s[i])
                i += 1
        else:
            result.append(s[i])
            i += 1
    return "".join(result)


def _parse_string_list(s):
    result = []
    i = 0
    while i < len(s):
        while i < len(s) and s[i] != '"':
            i += 1
        if i >= len(s):
            break
        i += 1
        start = i
        while i < len(s):
            if s[i] == "\\" and i + 1 < len(s):
                i += 2
            elif s[i] == '"':
                break
            else:
                i += 1
        result.append(_unesc(s[start:i]))
        i += 1
    return result
