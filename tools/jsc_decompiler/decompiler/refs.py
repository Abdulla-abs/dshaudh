"""Reference analysis: extract require/imporpt dependencies between JS files."""

import os, re, json

# Patterns for extracting require calls
_RE_DIRECT = re.compile(r'require\s*\(\s*"([^"]+)"\s*\)')
_RE_VARPATH = re.compile(r'require\s*\(\s*\(\s*(\w+)\s*\+\s*"([^"]+)"\s*\)\s*\)')
_RE_LOG = re.compile(r'log\s*\(\s*"require\s+([^"]+)"\s*\)')
_RE_VAR_DEF = re.compile(r"^(\w+)\s*=\s*(?:\"\s*\+\s*)?\"([^\"]+)\"", re.MULTILINE)
_RE_VAR_DEF_EXPR = re.compile(
    r"^(\w+)\s*=\s*\((\w+)\s*\+\s*\"([^\"]+)\"\s*\)", re.MULTILINE
)
_RE_FUNC = re.compile(r"function\s+(\w+)")

_REQUIRE_NAMES = {"require", "log", "load"}


def analyze_decompiled(decompiled_dir):
    """Scan all .js files and build reference graph."""
    files = {}
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
            files[rel] = _analyze_file(rel, content, decompiled_dir)

    # Resolve paths
    for rel, info in files.items():
        resolved = []
        for ref in info["refs"]:
            if "/" not in ref:
                # Simple filename: find it in the directory tree
                found = _resolve_simple(rel, ref, files)
                resolved.append(found or ref)
            else:
                resolved.append(ref)
        info["resolved_refs"] = resolved

    return files


def _analyze_file(rel, content, base_dir):
    """Extract references from one file."""
    info = {
        "path": rel.replace("\\", "/"),
        "dir": os.path.dirname(rel.replace("\\", "/")),
        "name": os.path.basename(rel),
        "refs": [],
        "var_refs": [],  # (variable, suffix) tuples
        "log_refs": [],
        "variables": {},
        "functions": [],
    }

    # Direct require("path")
    for m in _RE_DIRECT.finditer(content):
        info["refs"].append(m.group(1))

    # require(var + "path")
    for m in _RE_VARPATH.finditer(content):
        var, suffix = m.group(1), m.group(2)
        info["var_refs"].append((var, suffix))

    # log("require path")
    for m in _RE_LOG.finditer(content):
        info["log_refs"].append(m.group(1))

    # Extract variable definitions (_script_xxx = "path/")
    for m in _RE_VAR_DEF.finditer(content):
        info["variables"][m.group(1)] = m.group(2)
    for m in _RE_VAR_DEF_EXPR.finditer(content):
        info["variables"][m.group(1)] = (m.group(2), m.group(3))  # (depends_on, suffix)

    # Extract function names
    for m in _RE_FUNC.finditer(content):
        name = m.group(1)
        if not name.startswith("_") and not name.startswith("l") and len(name) > 1:
            info["functions"].append(name)

    return info


def _resolve_path(current_rel, filename, files):
    """Find which file 'filename' maps to in the directory tree,
    stripping common prefixes like 'Scripts/'."""
    search = filename
    for prefix in ("Scripts/", ""):
        if filename.startswith(prefix):
            search = filename[len(prefix) :]
            break
    # Direct match
    if search in files:
        return search
    # Endswith match
    candidates = [rel for rel in files if rel == search or rel.endswith("/" + search)]
    if len(candidates) == 1:
        return candidates[0]
    elif candidates:
        cur_dir = os.path.dirname(current_rel)
        return min(
            candidates, key=lambda c: _path_distance(cur_dir, os.path.dirname(c))
        )
    return None


def _resolve_simple(current_rel, filename, files):
    """Find which file 'filename' maps to in the directory tree."""
    candidates = [
        rel for rel in files if rel.endswith("/" + filename) or rel == filename
    ]
    if len(candidates) == 1:
        return candidates[0]
    elif candidates:
        cur_dir = os.path.dirname(current_rel)
        best = min(
            candidates, key=lambda c: _path_distance(cur_dir, os.path.dirname(c))
        )
        return best
    return None


def _path_distance(a, b):
    parts_a = a.split("/")
    parts_b = b.split("/")
    i = 0
    while i < min(len(parts_a), len(parts_b)) and parts_a[i] == parts_b[i]:
        i += 1
    return len(parts_a) + len(parts_b) - 2 * i


def _resolve_var(global_vars, var, visited=None):
    """Resolve a variable to its path, following expression-based defs."""
    if visited is None:
        visited = set()
    if var in visited:
        return None
    visited.add(var)
    val = global_vars.get(var)
    if val is None:
        return None
    if isinstance(val, tuple):
        # val = (depends_on, suffix), e.g. ('_script_client', 'h3/')
        base = _resolve_var(global_vars, val[0], visited)
        if base:
            return base + val[1]
        return val[1]  # just the suffix
    return val  # direct string value


def resolve_var_refs(files):
    """Resolve var_refs using variable definitions from ALL files."""
    # Build global variable table with transitive resolution
    global_vars = {}
    for rel, info in files.items():
        for k, v in info["variables"].items():
            global_vars.setdefault(k, v)

    for rel, info in files.items():
        for var, suffix in info["var_refs"]:
            resolved_base = _resolve_var(global_vars, var)
            if resolved_base:
                resolved = resolved_base + suffix
                found = _resolve_path(rel, resolved, files)
                info["refs"].append(found or resolved)
            else:
                info["refs"].append(f'{var}+"{suffix}"')


def export_graph(files, format="text"):
    """Export dependency graph."""
    if format == "json":
        return json.dumps(files, indent=2, ensure_ascii=False)

    lines = []
    for rel, info in sorted(files.items()):
        refs = info["resolved_refs"] if info["resolved_refs"] else info["refs"]
        if refs or info["var_refs"]:
            lines.append(f"\n## {rel}")
            lines.append(f'  dir: {info["dir"]}')
            if info["functions"]:
                lines.append(f'  functions: {", ".join(info["functions"][:20])}')
            if info["variables"]:
                lines.append(f"  paths:")
                for k, v in sorted(info["variables"].items()):
                    lines.append(f'    {k} = "{v}"')
            if refs:
                lines.append(f"  requires ({len(refs)}):")
                for r in sorted(set(refs)):
                    lines.append(f"    -> {r}")
            if info["var_refs"]:
                lines.append(f"  var_refs:")
                for var, suf in info["var_refs"]:
                    lines.append(f'    {var} + "{suf}"')

    return "\n".join(lines)


def compute_imports(decompiled_dir):
    """Generate import statements that could go at the top of each file."""
    files = analyze_decompiled(decompiled_dir)
    resolve_var_refs(files)

    imports = {}
    for rel, info in sorted(files.items()):
        resolved = info["resolved_refs"]
        if not resolved:
            continue
        imp_lines = []
        for r in sorted(set(resolved)):
            if r and r != rel:
                imp_lines.append(f'// require "{r}"')
        if imp_lines:
            imports[rel] = imp_lines
    return imports


def cli_analyze(decompiled_dir, output_file=None, format="text"):
    """CLI entry point for reference analysis."""
    files = analyze_decompiled(decompiled_dir)
    resolve_var_refs(files)

    if format == "json":
        out_text = export_graph(files, "json")
    elif format == "imports":
        imports = compute_imports(decompiled_dir)
        lines = []
        for rel, imp_lines in sorted(imports.items()):
            lines.append(f"// {rel}")
            for imp in imp_lines:
                lines.append(imp)
            lines.append("")
        out_text = "\n".join(lines)
    elif format == "inject":
        _inject_refs(decompiled_dir, files)
        return  # no text output, files modified in-place
    else:
        out_text = "# Decompiled JS Reference Graph\n" + export_graph(files, "text")

    if output_file:
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(out_text)
        print(f"Reference graph written to {output_file}")
        return
    print(out_text)


def _inject_refs(decompiled_dir, all_files):
    """Inject // require comments into each decompiled JS file."""
    updated = 0
    for root, dirs, filenames in os.walk(decompiled_dir):
        for fn in sorted(filenames):
            if not fn.endswith(".js"):
                continue
            fp = os.path.join(root, fn)
            rel = os.path.relpath(fp, decompiled_dir).replace("\\", "/")
            info = all_files.get(rel)
            if not info or not info["refs"]:
                continue

            # Get references (use refs which includes var-resolved entries)
            resolved = info.get("refs", [])
            # Build relative import paths
            imports = []
            cur_dir = os.path.dirname(rel)
            for ref in sorted(set(resolved)):
                if not ref or ref.strip() == "" or ref == rel:
                    continue
                if ref in all_files:
                    rel_path = os.path.relpath(ref, cur_dir).replace(chr(92), "/")
                    imports.append('// require "./{}"'.format(rel_path))
                elif "+" in ref:
                    imports.append("// require({})".format(ref))
                else:
                    imports.append('// require "{}"'.format(ref))

            if not imports:
                continue

            try:
                with open(fp, "r", encoding="utf-8", errors="replace") as f:
                    content = f.read()
            except Exception:
                continue

            # Check if already has refs section
            if content.startswith("// References:"):
                content = (
                    content.split("\n// End References\n", 1)[-1]
                    if "// End References\n" in content
                    else content.split("\n", 1)[-1]
                )

            header = "// References:\n"
            for imp in imports:
                header += imp + "\n"
            header += "// End References\n\n"
            new_content = header + content

            with open(fp, "w", encoding="utf-8") as f:
                f.write(new_content)
            updated += 1

    print(f"Injected references into {updated} files")
