"""Recover stock swallow evidence, or back up dedicated instance 1."""
import argparse
import hashlib
import io
import json
from pathlib import Path
import sqlite3
import subprocess
import sys
import tarfile

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / '.local/hero-swallow'
parser = argparse.ArgumentParser()
parser.add_argument('--backup', metavar='LABEL')
args = parser.parse_args()
OUT.mkdir(parents=True, exist_ok=True)
if args.backup:
    if not args.backup.replace('-', '').isalnum():
        raise SystemExit('Invalid backup label')
    out = OUT / args.backup
    out.mkdir(exist_ok=False)
    adb = [r'F:\Android\Sdk\platform-tools\adb.exe', '-s', '127.0.0.1:21513']
    raw = subprocess.check_output(adb + ['exec-out', 'su', '-c',
        'tar -cf - -C /data/data/com.netease.h1.qihoo databases shared_prefs files'])
    (out / 'save.tar').write_bytes(raw)
    with tarfile.open(fileobj=io.BytesIO(raw)) as archive:
        archive.extractall(out, filter='data')
    with sqlite3.connect(out / 'databases/jsb.sqlite') as db:
        rows = dict(db.execute('select key,value from data'))
    store = json.loads(rows['dino.local.native.v1'])
    summary = {'files': {str(p.relative_to(out)): hashlib.sha256(p.read_bytes()).hexdigest()
                        for folder in ['databases', 'shared_prefs', 'files']
                        for p in (out / folder).rglob('*') if p.is_file()},
               'heros': [{k: h.get(k) for k in ['sid', 'typeid', 'lv', 'xp', 'gift']}
                         for h in store['level']['heros']]}
    (out / 'summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf-8')
    (out / 'status.json').write_text(rows.get('dino.local.native.status', '{}'), encoding='utf-8')
    print(json.dumps({'path': str(out), 'files': len(summary['files']), 'heros': summary['heros']}, ensure_ascii=False))
else:
    sys.path.insert(0, str(ROOT / 'tools/jsc_decompiler'))
    from parser import parse
    from decompiler.decompiler import _decompile_func
    for name in ['Client/UI/HeroSwallow', 'Client/Components/HeroComponents',
                 'Client/ClientUnits/UnitManager', 'Client/UI/Hero', 'Data/Common/gifted_attributelv']:
        path = ROOT / 'analysis/decoded/script' / (name + '.jsc')
        parsed = parse(path.read_bytes())
        (OUT / (path.stem + '.js')).write_text(_decompile_func(parsed), encoding='utf-8')
        if path.stem == 'HeroComponents':
            (OUT / 'HeroComponents.disasm.txt').write_text(parsed.to_text(), encoding='utf-8')
    print('Recovered swallow UI and component functions to .local/hero-swallow')
