"""Recover stock knowledge-tree contracts into task-local evidence."""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tools/jsc_decompiler'))
from parser import parse
from decompiler.decompiler import _decompile_func

out = ROOT / '.local/knowledge-tree'
out.mkdir(parents=True, exist_ok=True)
for name in ['Client/Components/TechComponent', 'Client/UI/Tech', 'Data/Common/tech']:
    source = ROOT / 'analysis/decoded/script' / (name + '.jsc')
    parsed = parse(source.read_bytes())
    (out / (source.stem + '.js')).write_text(_decompile_func(parsed), encoding='utf-8')
    if source.stem == 'TechComponent':
        (out / 'TechComponent.disasm.txt').write_text(parsed.to_text(), encoding='utf-8')
print('Recovered stock tech functions and table to .local/knowledge-tree')
