"""Decode the stock trader contract inputs to task-local output."""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tools/jsc_decompiler'))
from parser import parse
from decompiler.decompiler import _decompile_func

OUT = ROOT / '.local/trader'
OUT.mkdir(parents=True, exist_ok=True)
SOURCES = {
    'Client/UI/Trader': 'Trader',
    'Client/Components/TraderComponent': 'TraderComponent',
    'Client/Components/CommonComponent': 'CommonComponent',
    'Client/ClientUnits/ClientPlayer': 'ClientPlayer',
    'Client/ClientUnits/UnitData': 'UnitData',
}
for name in ['itemshop', 'itemshop_sell', 'itemshop_collect', 'itemshop_coin',
             'itemshop_require', 'item', 'item_input', 'input_event', 'period_control']:
    SOURCES['Data/Common/' + name] = name
for name in ['input_event_client', 'hero_input_client']:
    SOURCES['Data/Client/' + name] = name
for src, name in SOURCES.items():
    path = ROOT / ('analysis/decoded/script/' + src + '.jsc')
    if not path.exists():
        continue
    parsed = parse(path.read_bytes())
    (OUT / (name + '.js')).write_text(_decompile_func(parsed), encoding='utf-8')
print('Trader inputs decoded to .local/trader')
