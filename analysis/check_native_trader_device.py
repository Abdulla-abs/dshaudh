"""Back up and inspect only the dedicated instance, without changing its save."""
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
    raise SystemExit('Use an alphanumeric evidence label')
out = ROOT / '.local/trader' / args.label
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
saved = json.loads(rows['dino.local.native.v1'])
level = saved['level']
status = json.loads(rows.get('dino.local.native.status', '{}'))
def stored_resource(kind):
    total = 0
    for unit in level.get('units', []):
        storage = unit.get('sto') or {}
        value = storage[kind] if isinstance(storage, list) and len(storage) > kind else (
            storage.get(str(kind), 0) if isinstance(storage, dict) else 0)
        total += int(value or 0)
    return total

summary = {'diamond': level['player'].get('diamond'), 'exp': level['player'].get('exp'),
           'gold': stored_resource(2), 'sunshine': stored_resource(1),
           'heroCount': len(level.get('heros', [])), 'trader': level.get('localTrader'),
           'items': {str(item['typeid']): sum(
               int(other['num']) for bag in level['player'].get('package', {}).values()
               for other in bag.get('item_dict', {}).values() if other['typeid'] == item['typeid'])
               for bag in level['player'].get('package', {}).values()
               for item in bag.get('item_dict', {}).values()},
           'traderLog': [e for e in status.get('log', [])
                         if str(e.get('step', '')).startswith('trader')][-8:]}
(out / 'summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf-8')
(out / 'screen.png').write_bytes(subprocess.check_output(adb + ['exec-out', 'screencap', '-p']))
print(json.dumps(summary, ensure_ascii=False))
