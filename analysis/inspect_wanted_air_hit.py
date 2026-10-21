"""Extract only original attack, field and damage-buff evidence."""
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'tools/jsc_decompiler'))
from parser import parse
from decompiler.decompiler import _decompile_func
out=ROOT/'.local/wanted-air-hit';out.mkdir(parents=True,exist_ok=True)
for name in ['Client/Components/Skill','Client/Components/SkillCaster','Client/Components/MagicField','Client/Components/BuffControll','Data/Client/magic_field','Data/Client/buff_data']:
 p=ROOT/'analysis/decoded/script'/(name+'.jsc');obj=parse(p.read_bytes())
 (out/(p.stem+'.js')).write_text(_decompile_func(obj),encoding='utf-8')
 if '/Components/' in name:(out/(p.stem+'.disasm.txt')).write_text(obj.to_text(),encoding='utf-8')
print('Extracted attack/field/buff evidence to .local/wanted-air-hit')
