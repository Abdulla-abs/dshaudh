"""Extract focused original seven-day signup functions into task-local output."""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools/jsc_decompiler"))
from parser import parse
from decompiler.decompiler import _decompile_func

OUT = ROOT / ".local/seven-day-check"
OUT.mkdir(parents=True, exist_ok=True)


def walk(func, name, trail="root", parent=None):
    if func is None:
        return
    needles = ("rookie_days", "sign_up_day_not_enough", "RookieSignInterface", "sevendays")
    if any(word in str(func.atoms) for word in needles):
        target = OUT / f"{name}-{trail}.js"
        target.write_text(_decompile_func(func, parent_func=parent), encoding="utf-8")
        print(target.name, str(func.atoms)[:120])
    for index, child in enumerate(func.children):
        walk(child, name, f"{trail}_{index}", func)


if __name__ == "__main__":
    for name in ("sevendays", "resource_input", "item_input", "item", "period_control"):
        func = parse((ROOT / f"analysis/decoded/script/Data/Common/{name}.jsc").read_bytes())
        (OUT / f"{name}.js").write_text(_decompile_func(func), encoding="utf-8")
    for name in ("input_event_client", "hero_input_client"):
        func = parse((ROOT / f"analysis/decoded/script/Data/Client/{name}.jsc").read_bytes())
        (OUT / f"{name}.js").write_text(_decompile_func(func), encoding="utf-8")
    for name, path in (
        ("Reward", "Client/UI/Reward"),
        ("GameEventsComponent", "Client/Components/GameEventsComponent"),
    ):
        walk(parse((ROOT / f"analysis/decoded/script/{path}.jsc").read_bytes()), name)
