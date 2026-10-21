"""Extract original arena scripts for a bounded feasibility audit."""
from pathlib import Path
import sys
import struct
import importlib

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools/jsc_decompiler"))
from parser import parse
from decompiler.decompiler import _decompile_func

SOURCES = (
    "Client/Components/Arena",
    "Client/UI/Arena",
    "Client/UI/BattleSelect",
    "Client/GameControllerBattle",
    "Client/MenuControllerBattle",
    "Client/ClientUnits/ClientPlayer",
    "Data/Common/arena_weekly_reward",
    "Data/Common/arena_monthly_reward",
    "Data/Common/itemshop_arena",
    "Client/GlobalDefine",
    "Client/ClientUnits/UnitData",
    "Data/Common/string_new",
    "Data/Common/pve_stage",
    "Data/Common/pve_controller",
    "Data/Common/period_control",
    "Data/Common/v_server_h1global",
    "Client/Components/CommonComponent",
    "Client/Components/HeroComponents",
    "Client/Components/PathSearchHelper",
    "Client/UI/BattleCard",
)


def main():
    out = ROOT / ".local/arena-audit"
    out.mkdir(parents=True, exist_ok=True)
    for name in SOURCES:
        src = ROOT / "analysis/decoded/script" / (name + ".jsc")
        target = out / (name.replace("/", "_") + ".js")
        parsed = parse(src.read_bytes())
        # The vendored parser stops at atoms longer than 500 characters.
        # Arena help contains long localized text. Read this root pool using
        # the declared length and file bounds, without changing the vendor.
        if name == "Data/Common/string_new":
            blob = src.read_bytes()
            header = importlib.import_module("parser.B973C051")
            _, _, code_end = header._parse_header(blob)
            offset = code_end + parsed.nsrc
            atoms = []
            for _ in range(parsed.natoms):
                length = struct.unpack_from("<I", blob, offset)[0]
                offset += 4
                end = offset + length * 2
                if end > len(blob):
                    raise ValueError("String atom exceeds bytecode file")
                atoms.append(blob[offset:end].decode("utf-16le"))
                offset = end
            parsed.atoms = atoms
        target.write_text(_decompile_func(parsed), encoding="utf-8")
        # Top-level pseudo-JS can omit nested closures. Recover each function
        # independently and retain bytecode for ambiguous expressions.
        recovered = []
        for index, child in enumerate(parsed.get_flat_children()):
            if child is not None:
                recovered.append(f"// function-index: {index}\n" + _decompile_func(child))
        target.with_suffix(".functions.js").write_text(
            "\n\n".join(recovered), encoding="utf-8")
        target.with_suffix(".disasm.txt").write_text(parsed.to_text(), encoding="utf-8")
        if name == "Client/Components/Arena":
            # Block-object sentinels can hide later sibling functions from the
            # root traversal. Independently parse candidates for parameter
            # evidence; never use these as a replacement game implementation.
            blob = src.read_bytes()
            header = importlib.import_module("parser.B973C051")
            found, offset, seen = [], 0, set()
            while True:
                offset = blob.find(b"\x00\x00\x00\x00\xff\xff\xff\xff", offset)
                if offset < 0:
                    break
                try:
                    candidates, _ = header._parse_objects(blob, offset, 1)
                    for child in candidates:
                        if child is None or not child.ops:
                            continue
                        first = child.ops[0]["off"]
                        if first not in seen:
                            seen.add(first)
                            found.append(child.to_text())
                except (ValueError, IndexError, struct.error, UnicodeDecodeError):
                    pass
                offset += 8
            target.with_suffix(".candidates.disasm.txt").write_text(
                "\n\n".join(found), encoding="utf-8")
        print(f"{name}: {target.relative_to(ROOT)} ({target.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
