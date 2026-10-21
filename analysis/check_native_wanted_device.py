"""Read-only wanted save/status snapshot from dedicated MEmu instance 1."""
from pathlib import Path
import argparse
import io
import json
import sqlite3
import subprocess
import tarfile

ROOT = Path(__file__).resolve().parent.parent
parser = argparse.ArgumentParser()
parser.add_argument('--label', required=True)
args = parser.parse_args()
if not args.label.replace('-', '').replace('_', '').isalnum():
    raise SystemExit('Use a simple snapshot label')
out = ROOT / '.local/wanted' / args.label
out.mkdir(parents=True, exist_ok=True)
adb = [r'F:\Android\Sdk\platform-tools\adb.exe', '-s', '127.0.0.1:21513']
raw = subprocess.check_output(adb + ['exec-out', 'su', '-c',
    'tar -cf - -C /data/data/com.netease.h1.qihoo databases'])
(out / 'databases.tar').write_bytes(raw)
with tarfile.open(fileobj=io.BytesIO(raw)) as archive:
    archive.extractall(out, filter='data')
with sqlite3.connect(out / 'databases/jsb.sqlite') as db:
    rows = dict(db.execute('select key,value from data where key in (?,?)',
        ('dino.local.native.v1', 'dino.local.native.status')))
level = json.loads(rows['dino.local.native.v1'])['level']
status = json.loads(rows.get('dino.local.native.status', '{}'))
summary = {'level': level['player'].get('level'),
           'wantedReward': level.get('localWantedReward'),
           'counters': {str(k): {str(i): v for i, v in group.items()
                       if str(i) in {'1005', '1006', '1007', '1020'}}
                       for k, group in level['player'].get('event_counters', {}).items()},
           'log': status.get('log', [])[-12:]}
(out / 'summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf-8')
(out / 'screen.png').write_bytes(subprocess.check_output(adb + ['exec-out', 'screencap', '-p']))
print(json.dumps(summary, ensure_ascii=False))
