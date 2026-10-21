"""Decode original reincarnation tables and callback functions into task-local output."""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tools/jsc_decompiler'))
from parser import parse
from decompiler.decompiler import _decompile_func

out = ROOT / '.local/hero-reincarnate'
out.mkdir(parents=True, exist_ok=True)
for name in ['Data/Common/hero_evolve', 'Data/Common/unit_main', 'Data/Common/unit_battle',
             'Data/Common/item', 'Client/Components/Components',
             'Client/Components/HeroComponents', 'Client/ClientUnits/Unit',
             'Client/ClientUnits/ClientPlayer', 'Client/UI/HeroReincarnation']:
    source = ROOT / 'analysis/decoded/script' / (name + '.jsc')
    (out / (source.stem + '.js')).write_text(_decompile_func(parse(source.read_bytes())), encoding='utf-8')
print('Decoded reincarnation evidence to .local/hero-reincarnate')
