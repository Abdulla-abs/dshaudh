"""Decode only the original tables and UI functions needed for offline shop checks."""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tools/jsc_decompiler'))
from parser import parse
from decompiler.decompiler import _decompile_func

OUT = ROOT / '.local/shop-treasure'
OUT.mkdir(parents=True, exist_ok=True)
TABLES = {
    'Common': ['virtual_item', 'item', 'item_input', 'resource_input', 'unit_main',
               'unit_battle', 'skill_data', 'hero_to_skill', 'skill_to_hero', 'period_control'],
    'Client': ['input_event_client', 'hero_input_client'],
}
for folder, names in TABLES.items():
    for name in names:
        src = ROOT / f'analysis/decoded/script/Data/{folder}/{name}.jsc'
        (OUT / f'{name}.js').write_text(_decompile_func(parse(src.read_bytes())), encoding='utf-8')
print(f'Decoded {sum(map(len, TABLES.values()))} shop tables to {OUT}')
