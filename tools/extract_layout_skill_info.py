"""Extract the original skill detail tables for the offline layout editor."""
from pathlib import Path
import importlib
import struct
import sys

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools/jsc_decompiler"))
parser = importlib.import_module("parser.B973C051")
from decompiler.decompiler import JSCDecompiler


def read_atoms(data, func, code_end):
    # The stock parser's 500-character cap stops at long translations and
    # leaves later skill strings empty. Validate lengths against file bounds.
    offset = code_end + func.nsrc
    atoms = []
    for _ in range(func.natoms):
        size = struct.unpack_from("<I", data, offset)[0] * 2
        offset += 4
        if offset + size > len(data):
            raise ValueError("Original string atom exceeds file bounds")
        atoms.append(data[offset:offset + size].decode("utf-16le"))
        offset += size
    func.atoms = atoms


def main():
    parser._parse_atoms = read_atoms
    output = ROOT / ".local/layout-editor/skill-info"
    output.mkdir(parents=True, exist_ok=True)
    for folder, name in [("Common", "string_data"), ("Client", "info_skill"), ("Client", "info_info_skill")]:
        source = ROOT / "analysis/decoded/script/Data" / folder / (name + ".jsc")
        code = JSCDecompiler(source=parser.parse(source.read_bytes())).run()
        (output / (name + ".js")).write_text(code, encoding="utf-8")
        print("Extracted", name)


if __name__ == "__main__":
    main()
