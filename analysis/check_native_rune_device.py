"""Read-only save backup and rune persistence summary for dedicated instance 1."""
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
    raise SystemExit('Use a simple evidence label')
root = Path(__file__).resolve().parent.parent
out = root / '.local/rune-persistence' / args.label
out.mkdir(parents=True, exist_ok=False)
adb = [r'F:\Android\Sdk\platform-tools\adb.exe', '-s', '127.0.0.1:21513']
raw = subprocess.check_output(adb + ['exec-out', 'su', '-c',
    'tar -cf - -C /data/data/com.netease.h1.qihoo databases shared_prefs files'])
(out / 'save.tar').write_bytes(raw)
with tarfile.open(fileobj=io.BytesIO(raw)) as archive:
    archive.extractall(out, filter='data')
hashes = {str(p.relative_to(out)): hashlib.sha256(p.read_bytes()).hexdigest()
          for folder in ['databases', 'shared_prefs', 'files']
          for p in (out / folder).rglob('*') if p.is_file()}
with sqlite3.connect(out / 'databases/jsb.sqlite') as db:
    rows = dict(db.execute('select key,value from data'))
summary = {'files': hashes, 'saves': {}}
for key in ['dino.local.native.v1', 'dino.local.native.v1.previous']:
    if key not in rows:
        continue
    level = json.loads(rows[key])['level']
    summary['saves'][key] = {
        'heroes': [{'sid': h.get('sid'), 'eqp': h.get('eqp')} for h in level.get('heros', [])],
        'runes': level.get('player', {}).get('package', {}).get('advanced_prop', {}).get('item_dict', {})}
status = json.loads(rows.get('dino.local.native.status', '{}'))
(out / 'summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf-8')
(out / 'status.json').write_text(json.dumps(status, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'path': str(out), 'fileCount': len(hashes),
                  'heroes': summary['saves'].get('dino.local.native.v1', {}).get('heroes'),
                  'step': status.get('step')}, ensure_ascii=False))
