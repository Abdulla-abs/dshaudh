"""Command-line entry points: single file, batch mode, and refs analysis."""

import os
import sys
from decompiler.decompiler import JSCDecompiler


def _try_beautify(code):
    """Beautify JS code using jsbeautifier (Python) if installed."""
    try:
        import jsbeautifier
    except ImportError:
        print(
            "Note: jsbeautifier not installed, skipping beautification. Install with: pip install jsbeautifier"
        )
        return None
    try:
        opts = jsbeautifier.default_options()
        opts.indent_size = 4
        opts.preserve_newlines = True
        opts.keep_array_indentation = False
        return jsbeautifier.beautify(code, opts)
    except Exception:
        return None


def main():
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <input.jsc[z]> [output.js]")
        print(f"       {sys.argv[0]} --batch <input_dir> <output_dir>")
        print(f"       {sys.argv[0]} --disasm <input.jsc[z]> [output.disasm]")
        print(f"       {sys.argv[0]} --refs <decompiled_dir> [--json|--inject]")
        print(
            f"       {sys.argv[0]} --imports <decompiled_dir>   # variable-based analysis"
        )
        print(f"       add --dump-bytecode for disassembly comments")
        print(f"       add --ascii-escapes to emit \\uXXXX instead of raw Unicode")
        sys.exit(1)

    dump_bytecode = "--dump-bytecode" in sys.argv
    ascii_escapes = "--ascii-escapes" in sys.argv
    args = [a for a in sys.argv[1:] if a not in ("--dump-bytecode", "--ascii-escapes")]

    from decompiler.stack import set_unicode_mode

    set_unicode_mode(ascii_escapes)

    if args[0] == "--refs":
        _refs_mode(args[1:])
    elif args[0] == "--imports":
        _imports_mode(args[1:])
    elif args[0] == "--disasm":
        _disasm_mode(args[1:])
    elif args[0] == "--batch":
        _batch_mode(args[1], args[2], dump_bytecode)
    else:
        _single_mode(args, dump_bytecode)


def _disasm_mode(args):
    fn = args[0]
    with open(fn, "rb") as f:
        data = f.read()
    from parser import parse

    func = parse(data)
    result = func.to_text()
    if len(args) > 1:
        ofn = args[1]
        with open(ofn, "w", encoding="utf-8") as f:
            f.write(result + "\n")
        print(f"Written to {ofn}")
    else:
        print(result)


def _refs_mode(args):
    """Analyze references between decompiled JS files."""
    from decompiler.refs import cli_analyze

    decompiled_dir = args[0] if args else "decompiled_scripts"
    fmt = "text"
    if "--json" in args:
        fmt = "json"
    if "--inject" in args:
        fmt = "inject"
    out_file = None
    for a in args[1:]:
        if a not in ("--json", "--inject"):
            out_file = a
    cli_analyze(decompiled_dir, output_file=out_file, format=fmt)


def _imports_mode(args):
    """Analyze and inject variable-based imports."""
    from decompiler.var_analysis import cli_inject, cli_show_missing

    decompiled_dir = args[0] if args else "decompiled_scripts"
    if "--show" in args:
        cli_show_missing(decompiled_dir)
    else:
        cli_inject(decompiled_dir)


def _single_mode(args, dump_bytecode):
    fn = args[0]
    with open(fn, "rb") as f:
        data = f.read()
    dec = JSCDecompiler(data=data, dump_bytecode=dump_bytecode)
    result = dec.run()
    header = f'// Decompiled from: {os.path.basename(fn)}\n// Version: 0x{dec.hdr["ver"]:08x}\n'
    output = header + result + "\n"
    beautified = _try_beautify(output)
    if beautified is not None:
        output = beautified
    if len(args) > 1:
        ofn = args[1]
        with open(ofn, "w", encoding="utf-8") as f:
            f.write(output)
        print(f"Written to {ofn}")
    else:
        print(output)


def _batch_mode(indir, outdir, dump_bytecode, inject_refs=True):
    os.makedirs(outdir, exist_ok=True)
    count = 0
    errors = []
    beautify_available = True
    try:
        import jsbeautifier
    except ImportError:
        beautify_available = False
        print(
            "Note: jsbeautifier not installed, skipping beautification. Install with: pip install jsbeautifier"
        )

    for root, dirs, files in os.walk(indir):
        for fn in sorted(files):
            if not fn.endswith(".jscz") and not fn.endswith(".jsc"):
                continue
            fp = os.path.join(root, fn)
            rel = os.path.relpath(fp, indir)
            ofn = os.path.join(
                outdir, rel.replace(".jscz", ".js").replace(".jsc", ".js")
            )
            os.makedirs(os.path.dirname(ofn), exist_ok=True)
            try:
                with open(fp, "rb") as f:
                    data = f.read()
                if len(data) < 64:
                    print(f"  SKIP {rel}: too small")
                    continue
                dec = JSCDecompiler(data=data, dump_bytecode=dump_bytecode)
                result = dec.run()
                output = (
                    f"// Decompiled from: {os.path.basename(fn)}\n"
                    f'// Version: 0x{dec.hdr["ver"]:08x}\n'
                    f'// nargs={dec.hdr.get("nargs",0)} nvars={dec.hdr.get("nvars",0)}'
                    f' atoms={len(dec.atoms)} code={dec.hdr.get("codelen",0)}\n'
                    + result
                    + "\n"
                )
                if beautify_available:
                    beautified = _try_beautify(output)
                    if beautified is not None:
                        output = beautified
                with open(ofn, "w", encoding="utf-8") as f:
                    f.write(output)
                count += 1
            except Exception as e:
                errors.append((rel, str(e)))
                print(f"  ERR: {rel}: {e}")
    print(f"\nDone: {count} files decompiled")
    if errors:
        for rel, err in errors:
            print(f"  ERR: {rel}: {err}")

    # Inject variable-based references into decompiled files
    if inject_refs:
        from decompiler.var_analysis import inject_globals

        updated, total = inject_globals(outdir)
        print(
            "Injected /* global ... */ into {} files ({} total globals)".format(
                updated, total
            )
        )


if __name__ == "__main__":
    main()
