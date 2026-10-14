"""Decompiler: takes DisasmFunc → produces JavaScript source text."""

from disasm import DisasmFunc
from .decompile import DecompileEngine


class JSCDecompiler:
    def __init__(self, source=None, data=None, dump_bytecode=False):
        if isinstance(source, DisasmFunc):
            self.func = source
        elif data is not None:
            from parser import parse

            self.func = parse(data)
        else:
            self.func = DisasmFunc()
        self.dump_bytecode = dump_bytecode

    def run(self):
        return _decompile_func(self.func, self.dump_bytecode)

    @property
    def hdr(self):
        f = self.func
        return {
            "ver": 0,
            "nargs": f.nargs,
            "nbl": 0,
            "nvars": f.nvars,
            "codelen": f.codelen,
            "natoms": f.natoms,
            "nsrc": f.nsrc,
            "nconst": f.nconst,
            "nobj": f.nobj,
            "nreg": f.nreg,
            "ntry": f.ntry,
            "nblk": f.nblk,
            "sbits": f.sbits,
        }

    @property
    def atoms(self):
        return self.func.atoms

    @property
    def source_path(self):
        return self.func.source_path


def _decompile_func(func, dump_bytecode=False, parent_func=None):
    nested_results = []
    for child in func.children:
        if child is None:
            nested_results.append("")
            continue
        nested_results.append(_decompile_func(child, dump_bytecode, parent_func=func))

    engine = DecompileEngine(func, parent_func=parent_func, dump_bytecode=dump_bytecode)
    engine.run()
    body = engine.emit()

    result = body
    if getattr(func, "source_text", ""):
        src = func.source_text.rstrip("\x00")
        lines = src.split("\n")
        commented = "\n".join("// " + l for l in lines)
        result = commented + "\n\n" + result

    if nested_results:
        result = _assemble_output(func, nested_results, result)

    result = _resolve_av_placeholders(func, result, engine)
    result = _resolve_unresolved_markers(result)
    return result


def _assemble_output(func, nested_results, body):
    result = body
    max_passes = 10
    for _ in range(max_passes):
        found = False
        for idx, child in enumerate(func.children):
            if idx >= len(nested_results):
                break
            if child is None:
                continue
            child_body = nested_results[idx].replace("\n// source:", "")
            child_body = child_body.strip()
            if child_body.endswith(";"):
                child_body = child_body[:-1]
            args = ", ".join(child.argvs) if child.argvs else ""

            marker_f = f"__F_{idx}__"
            if marker_f in result:
                found = True
                indent_body = "\n".join("    " + l for l in child_body.split("\n"))
                result = result.replace(marker_f, indent_body)
                result = result.replace(f"__A_{idx}__", args)

            marker_l = f"__L_{idx}__"
            if marker_l in result:
                found = True
                is_gen = bool(child.sbits & (1 << 8)) or any(
                    op["nm"] == "yield" for op in child.ops
                )
                fn_kw = "function*" if is_gen else "function"
                wrapped = f"{fn_kw}({args}) {{\n{child_body}\n}}"
                import re

                if re.search(re.escape(marker_l) + r"\s*\(", result):
                    indent_fn = "\n".join("    " + l for l in wrapped.split("\n"))
                    result = result.replace(marker_l, "(" + indent_fn + ")")
                else:
                    indent_fn = "\n".join("    " + l for l in wrapped.split("\n"))
                    result = result.replace(marker_l, indent_fn)

        if not found:
            break
    return result


def _resolve_av_placeholders(func, text, engine=None):
    import re

    local_vars = engine._local_vars if engine else {}

    def _av_replace(m):
        slot = int(m.group(1))
        if slot < len(func.var_slot_names):
            name = func.var_slot_names[slot]
            if name:
                return name
        lv = local_vars.get(slot)
        if lv:
            return lv.name
        return m.group(0)

    text = re.sub(r"\b_av(\d+)\b", _av_replace, text)
    return text


def _resolve_unresolved_markers(text):
    """Replace any remaining __L_N__, __F_N__, __A_N__ markers.

    These appear when a lambda/deffun references a child function whose
    data is missing from the JSC file.  Replace with a placeholder so
    the output is valid JavaScript.
    """
    import re

    # __L_N__ — lambda body placeholder (appears as a function expression value)
    text = re.sub(r"__L_\d+__", "function(){/* missing */}", text)

    # __F_N__ — deffun body placeholder (appears inside function body)
    text = re.sub(r"__F_\d+__", "/* missing */", text)

    # __A_N__ — deffun args placeholder (appears in function parameter list)
    text = re.sub(r"__A_\d+__", "", text)

    return text
