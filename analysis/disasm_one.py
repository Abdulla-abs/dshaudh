"""Disassemble or decompile one decoded .jsc with the vendored B973C051 parser.

Requires prior decode: python analysis/decode_scripts.py
Tool: tools/jsc_decompiler (byzp/jsc_decompiler), magic 0xB973C051 = Cocos SM v22.
"""
from __future__ import annotations

import argparse
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CLI = ROOT / "tools" / "jsc_decompiler" / "cli.py"
OUT_DIR = ROOT / "analysis" / "disasm"
DECODED = ROOT / "analysis" / "decoded" / "script"


def resolve_input(name: str) -> pathlib.Path:
    path = pathlib.Path(name)
    if path.is_file():
        return path.resolve()
    candidates = [
        DECODED / name,
        DECODED / "Client" / name,
        DECODED / "Client" / f"{name}.jsc",
        DECODED / "Client" / f"{name}.js",
    ]
    # Allow Client/GameControllerBattle style relative paths
    candidates.insert(0, DECODED / pathlib.Path(name))
    for candidate in candidates:
        if candidate.suffix != ".jsc":
            jsc = candidate.with_suffix(".jsc")
            if jsc.is_file():
                return jsc
        if candidate.is_file():
            return candidate
    raise SystemExit(f"Input not found: {name}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "script",
        help="Path or short name, e.g. Client/GameControllerBattle or GameControllerBattle.jsc",
    )
    parser.add_argument(
        "--mode",
        choices=("disasm", "decompile"),
        default="disasm",
        help="disasm = opcode listing; decompile = pseudo-JS (+ optional bytecode comments)",
    )
    parser.add_argument(
        "--dump-bytecode",
        action="store_true",
        help="Only for decompile: embed opcode comments (slower, larger)",
    )
    args = parser.parse_args()

    if not CLI.is_file():
        raise SystemExit(f"Missing decompiler CLI: {CLI}")

    src = resolve_input(args.script)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    stem = src.stem
    if args.mode == "disasm":
        out = OUT_DIR / f"{stem}.disasm.txt"
        cmd = [sys.executable, str(CLI), "--disasm", str(src), str(out)]
    else:
        out = OUT_DIR / f"{stem}.decompiled.js"
        cmd = [sys.executable, str(CLI), str(src), str(out)]
        if args.dump_bytecode:
            cmd.append("--dump-bytecode")

    print("Running:", " ".join(cmd))
    subprocess.check_call(cmd)
    print(f"Wrote {out} ({out.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
