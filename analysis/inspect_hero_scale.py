"""Extract original character scaling evidence; does not touch game or device."""
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'tools/jsc_decompiler'))
from parser import parse
from decompiler.decompiler import _decompile_func
out=ROOT/'.local/hero-scale'
out.mkdir(parents=True,exist_ok=True)
for name in ['Client/Components/BuffControll','Data/Client/buff_data']:
    source=ROOT/'analysis/decoded/script'/(name+'.jsc')
    parsed=parse(source.read_bytes())
    (out/(source.stem+'.js')).write_text(_decompile_func(parsed),encoding='utf-8')
    if source.stem=='BuffControll':
        (out/(source.stem+'.disasm.txt')).write_text(parsed.to_text(),encoding='utf-8')
print('Extracted original buff scale logic and tables into .local/hero-scale')
