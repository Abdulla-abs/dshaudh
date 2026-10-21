"""Decode stock package expansion functions to task-local evidence."""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tools/jsc_decompiler'))
from parser import parse
from decompiler.decompiler import _decompile_func

OUT = ROOT / '.local/rune-purchase'
OUT.mkdir(parents=True, exist_ok=True)
for source, name in [('Components/Components', 'Components'), ('UI/Package', 'Package')]:
    path = ROOT / ('analysis/decoded/script/Client/' + source + '.jsc')
    (OUT / (name + '.js')).write_text(_decompile_func(parse(path.read_bytes())), encoding='utf-8')
print('Decoded stock package expansion to .local/rune-purchase')
