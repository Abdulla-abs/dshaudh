"""Back up instance 1 and report only research-related save fields."""
import argparse
import hashlib
import io
import json
from pathlib import Path
import sqlite3
import subprocess
import tarfile

parser = argparse.ArgumentParser()
parser.add_argument('--label', required=True)
args = parser.parse_args()
if not args.label.replace('-', '').isalnum():
    raise SystemExit('Use an alphanumeric evidence label')
root = Path(__file__).resolve().parent.parent
out = root / '.local/knowledge-tree' / args.label
out.mkdir(parents=True, exist_ok=False)
adb = [r'F:\Android\Sdk\platform-tools\adb.exe', '-s', '127.0.0.1:21513']
raw = subprocess.check_output(adb + ['exec-out', 'su', '-c',
    'tar -cf - -C /data/data/com.netease.h1.qihoo databases shared_prefs files'])
(out / 'save.tar').write_bytes(raw)
with tarfile.open(fileobj=io.BytesIO(raw)) as archive:
    archive.extractall(out, filter='data')
with sqlite3.connect(out / 'databases/jsb.sqlite') as db:
    rows = dict(db.execute('select key,value from data'))
level = json.loads(rows['dino.local.native.v1'])['level']
status = json.loads(rows.get('dino.local.native.status', '{}'))
summary = {'files': {str(p.relative_to(out)): hashlib.sha256(p.read_bytes()).hexdigest()
                    for folder in ['databases', 'shared_prefs', 'files']
                    for p in (out / folder).rglob('*') if p.is_file()},
           'gained_techs': level['player'].get('gained_techs'),
           'trees': [{k: u.get(k) for k in ['sid', 'typeid', 'training_tech', 'last_train_tech_time', 'trained_time']}
                     for u in level['units'] if str(u.get('typeid', '')).startswith('210')],
           'tech_events': [e for e in status.get('log', []) if 'tech' in json.dumps(e).lower()]}
(out / 'summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf-8')
(out / 'status.json').write_text(json.dumps(status, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'path': str(out), **{k:v for k,v in summary.items() if k != 'files'}}, ensure_ascii=False))
