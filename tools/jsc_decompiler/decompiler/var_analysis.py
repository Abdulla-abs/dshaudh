"""Cross-file variable definition and usage analysis.

Finds which files define which globals, and which files use globals
that are defined elsewhere. Generates /* global ... */ directives
for ESLint no-undef suppression.
"""

import os, re, json
from collections import Counter, defaultdict

_JS_KEYWORDS = frozenset(
    {
        "true",
        "false",
        "null",
        "undefined",
        "this",
        "if",
        "else",
        "for",
        "while",
        "do",
        "switch",
        "case",
        "default",
        "break",
        "continue",
        "return",
        "throw",
        "try",
        "catch",
        "finally",
        "new",
        "typeof",
        "instanceof",
        "in",
        "void",
        "delete",
        "var",
        "let",
        "const",
        "function",
        "arguments",
    }
)

_JS_BUILTINS = frozenset(
    {
        "NaN",
        "Infinity",
        "Array",
        "Object",
        "String",
        "Number",
        "Boolean",
        "Date",
        "Error",
        "RegExp",
        "parseFloat",
        "isNaN",
        "isFinite",
        "eval",
        "console",
        "window",
        "document",
        "global",
        "globalThis",
        "exports",
        "module",
        "process",
        "Buffer",
        "require",
        "setTimeout",
        "setInterval",
        "clearTimeout",
        "clearInterval",
        "requestAnimationFrame",
        "cancelAnimationFrame",
        "encodeURI",
        "decodeURI",
        "encodeURIComponent",
        "decodeURIComponent",
        "escape",
        "unescape",
        "atob",
        "btoa",
        "Promise",
        "Symbol",
        "Map",
        "Set",
        "WeakMap",
        "WeakSet",
        "Proxy",
        "Reflect",
        "Uint8Array",
        "Int8Array",
        "ArrayBuffer",
        "DataView",
        "Float32Array",
        "Float64Array",
        "Int16Array",
        "Int32Array",
        "Uint16Array",
        "Uint32Array",
        "BigInt",
        "BigInt64Array",
        "BigUint64Array",
        "Iterator",
        "Generator",
        "alert",
        "confirm",
        "prompt",
        "XMLHttpRequest",
        "FormData",
        "WebSocket",
        "Worker",
        "FileReader",
        "Blob",
        "File",
        "URL",
        "URLSearchParams",
        "Image",
        "navigator",
        "location",
        "history",
        "localStorage",
        "sessionStorage",
        "screen",
        "performance",
        "addEventListener",
        "removeEventListener",
        "dispatchEvent",
        "postMessage",
        "onmessage",
        "print",
        "apply",
        "call",
        "bind",
        "toString",
        "valueOf",
        "hasOwnProperty",
        "propertyIsEnumerable",
        "isPrototypeOf",
        "__defineGetter__",
        "__defineSetter__",
        "__lookupGetter__",
        "__lookupSetter__",
        "__proto__",
    }
)

_LOCAL_VAR_RE = re.compile(r"^([lv]_?\d+|_var_\d+|_[a-z][a-zA-Z0-9]*)$")
_ARG_VAR_RE = re.compile(r"^a\d+$")


def _strip_comments_strings(content):
    lines = content.split("\n")
    result = []
    for line in lines:
        c = re.sub(r"//.*$", " ", line)
        c = re.sub(r"/\*.*?\*/", " ", c)
        c = re.sub(r'"[^"]*"', '""', c)
        c = re.sub(r"'[^']*'", "''", c)
        result.append(c)
    return "\n".join(result)


def get_defines_uses(content):
    """Return (defined_set, used_set) of identifiers in code."""
    code = _strip_comments_strings(content)
    defined = set()
    used = set()

    for m in re.finditer(r"\bvar\s+(\w+)", code):
        defined.add(m.group(1))
    for m in re.finditer(r"\bfunction\s+(\w+)", code):
        defined.add(m.group(1))
    for m in re.finditer(r"(?<![,\{(.\[<!>=])\s*(\w{2,})\s*=", code):
        defined.add(m.group(1))
    for m in re.finditer(r"(\w+)\.prototype\.(\w+)\s*=", code):
        defined.add(m.group(1))

    for m in re.finditer(r"\b([a-zA-Z_$][\w$]*)\b", code):
        name = m.group(1)
        if name in defined:
            continue
        if _LOCAL_VAR_RE.match(name):
            continue
        if _ARG_VAR_RE.match(name):
            continue
        if name.startswith("#a") or name.startswith("__") or name.startswith("_av"):
            continue
        if name in _JS_BUILTINS:
            continue
        if len(name) <= 1:
            continue
        if name in (
            "nargs",
            "nvars",
            "code",
            "ver",
            "Version",
            "Decompiled",
            "jscz",
            "source",
            "atoms",
            "from",
            "References",
            "Res_ref",
            "Scripts",
            "End",
            "jscz",
        ):
            continue
        used.add(name)

    for m in re.finditer(r"function\s*\w*\s*\((.*?)\)", code):
        for arg in re.findall(r"\w+", m.group(1)):
            used.discard(arg)

    return defined, used


def build_global_map(decompiled_dir):
    """Build {filename: defined_globals} and {global_name: [defining_files]}."""
    file_defs = {}
    global_to_files = defaultdict(list)

    for root, dirs, filenames in os.walk(decompiled_dir):
        for fn in sorted(filenames):
            if not fn.endswith(".js"):
                continue
            fp = os.path.join(root, fn)
            rel = os.path.relpath(fp, decompiled_dir).replace("\\", "/")
            try:
                with open(fp, encoding="utf-8", errors="replace") as f:
                    content = f.read()
            except Exception:
                continue
            defined, used = get_defines_uses(content)

            exports = {
                d
                for d in defined
                if not _LOCAL_VAR_RE.match(d)
                and not _ARG_VAR_RE.match(d)
                and not d.startswith("_")
                and len(d) > 1
            }
            if exports:
                file_defs[rel] = exports
                for d in exports:
                    global_to_files[d].append(rel)

    return file_defs, global_to_files


def compute_file_globals(decompiled_dir):
    """For each .js file, compute the set of identifiers that need /* global */ declarations.

    Returns {filename: {name: 'writable'|'readonly', ...}}.
    - Any identifier that is assigned in the file is marked writable
    - Other identifiers are readonly
    """
    result = {}
    skip = _JS_KEYWORDS | _JS_BUILTINS

    for root, dirs, filenames in os.walk(decompiled_dir):
        for fn in sorted(filenames):
            if not fn.endswith(".js"):
                continue
            fp = os.path.join(root, fn)
            rel = os.path.relpath(fp, decompiled_dir).replace("\\", "/")
            try:
                with open(fp, encoding="utf-8", errors="replace") as f:
                    content = f.read()
            except Exception:
                continue

            code = _strip_comments_strings(content)
            all_ids = set()
            assigned_ids = set()

            for m in re.finditer(r"\b([a-zA-Z_$][\w$]*)\b", code):
                name = m.group(1)
                if name in skip:
                    continue
                if len(name) <= 0:
                    continue
                all_ids.add(name)

            for m in re.finditer(r"\bvar\s+(\w+)", code):
                assigned_ids.add(m.group(1))
            var_declared = set()
            for m in re.finditer(r"\bvar\s+(\w+)", code):
                var_declared.add(m.group(1))
            for m in re.finditer(r"\bfunction\s*\*?\s+(\w+)", code):
                var_declared.add(m.group(1))
            for m in re.finditer(r"\b([a-zA-Z_$][\w$]*)\s*=", code):
                after = code[m.end() : m.end() + 1] if m.end() < len(code) else ""
                if after != "=":
                    assigned_ids.add(m.group(1))
            for m in re.finditer(r"(\w+)\.prototype\.(\w+)\s*=", code):
                assigned_ids.add(m.group(1))
            for m in re.finditer(r"(\w+)\+\+", code):
                assigned_ids.add(m.group(1))
            for m in re.finditer(r"(\w+)--", code):
                assigned_ids.add(m.group(1))
            for m in re.finditer(r"\+\+(\w+)", code):
                assigned_ids.add(m.group(1))
            for m in re.finditer(r"--(\w+)", code):
                assigned_ids.add(m.group(1))
            for m in re.finditer(r"\bfor\s*\(\s*(\w+)\s+in\b", code):
                assigned_ids.add(m.group(1))
            for m in re.finditer(r"\bfor\s*\(\s*(\w+)\s+of\b", code):
                assigned_ids.add(m.group(1))

            globals_dict = {}
            for name in all_ids:
                if name in assigned_ids:
                    globals_dict[name] = "writable"
                elif name not in skip:
                    globals_dict[name] = "readonly"
            for name in assigned_ids:
                if name in skip and name not in globals_dict:
                    globals_dict[name] = "writable"
            result[rel] = globals_dict

    return result


def inject_globals(decompiled_dir):
    """Inject /* global ... */ directives into each decompiled JS file
    so that ESLint no-undef checks pass."""
    file_globals = compute_file_globals(decompiled_dir)

    updated = 0
    total_globals = 0
    for root, dirs, filenames in os.walk(decompiled_dir):
        for fn in sorted(filenames):
            if not fn.endswith(".js"):
                continue
            fp = os.path.join(root, fn)
            rel = os.path.relpath(fp, decompiled_dir).replace("\\", "/")
            try:
                with open(fp, "r", encoding="utf-8", errors="replace") as f:
                    content = f.read()
            except Exception:
                continue

            has_old_header = content.startswith("/* global ")
            globals_dict = file_globals.get(rel, {})

            if not globals_dict and not has_old_header:
                continue

            content = _strip_old_header(content)

            if globals_dict:
                parts = []
                for name in sorted(globals_dict):
                    if globals_dict[name] == "writable":
                        parts.append(name + ": writable")
                    else:
                        parts.append(name)
                global_decl = "/* global " + ", ".join(parts) + " */\n"
                new_content = global_decl + content
            else:
                new_content = content

            with open(fp, "w", encoding="utf-8") as f:
                f.write(new_content)
            updated += 1
            total_globals += len(globals_dict)

    return updated, total_globals


def _strip_old_header(content):
    if content.startswith("/* global "):
        nl = content.index("*/") + 2
        if nl < len(content) and content[nl] == "\n":
            nl += 1
        content = content[nl:]
    if content.startswith("// References:"):
        parts = content.split("\n// End References\n", 1)
        if len(parts) > 1:
            content = parts[1]
    return content


def find_missing_imports(decompiled_dir):
    file_defs, global_to_files = build_global_map(decompiled_dir)
    missing = {}

    for root, dirs, filenames in os.walk(decompiled_dir):
        for fn in sorted(filenames):
            if not fn.endswith(".js"):
                continue
            fp = os.path.join(root, fn)
            rel = os.path.relpath(fp, decompiled_dir).replace("\\", "/")
            try:
                with open(fp, encoding="utf-8", errors="replace") as f:
                    content = f.read()
            except Exception:
                continue

            defined, used = get_defines_uses(content)
            local_defs = file_defs.get(rel, set())

            needed = []
            for name in sorted(used):
                if name in local_defs:
                    continue
                if name not in global_to_files:
                    continue
                def_files = [f for f in global_to_files[name] if f != rel]
                if not def_files:
                    continue
                if len(name) <= 2:
                    continue
                if len(def_files) > 2:
                    continue
                if re.match(r"^[a-z]{1,3}\d*$", name):
                    continue
                needed.append((name, def_files))

            if needed:
                missing[rel] = needed

    return missing, file_defs, global_to_files


def generate_imports(missing, decompiled_dir):
    imports = {}
    for rel, needed in sorted(missing.items()):
        cur_dir = os.path.dirname(rel)
        lines = []
        seen_files = set()

        file_to_names = defaultdict(list)
        for name, def_files in needed:
            best = min(def_files, key=lambda f: _import_score(rel, f))
            file_to_names[best].append(name)

        for def_file, names in sorted(file_to_names.items()):
            if def_file in seen_files:
                continue
            seen_files.add(def_file)
            rel_path = os.path.relpath(def_file, cur_dir).replace("\\", "/")
            if not rel_path.startswith("."):
                rel_path = "./" + rel_path
            names_str = ", ".join(sorted(set(names))[:5])
            if len(names) > 5:
                names_str += ", ..."
            lines.append(
                '// require("{}")  // provides: {}'.format(rel_path, names_str)
            )

        if lines:
            imports[rel] = lines

    return imports


def _import_score(current, candidate):
    cur_parts = current.split("/")
    cand_parts = candidate.split("/")
    i = 0
    while i < min(len(cur_parts), len(cand_parts)) and cur_parts[i] == cand_parts[i]:
        i += 1
    return len(cand_parts) - i


def cli_inject(decompiled_dir):
    updated, total = inject_globals(decompiled_dir)
    print(
        "Injected /* global ... */ into {} files ({} total globals)".format(
            updated, total
        )
    )


def cli_show_missing(decompiled_dir):
    missing, file_defs, global_to_files = find_missing_imports(decompiled_dir)
    imports = generate_imports(missing, decompiled_dir)
    for rel, lines in sorted(imports.items())[:20]:
        print("\n## {}".format(rel))
        for line in lines:
            print("  {}".format(line))
