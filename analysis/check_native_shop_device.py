"""Capture read-only shop/save evidence from the dedicated MEmu instance."""
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
    raise SystemExit('Use a simple evidence label')
out = ROOT / '.local/shop-treasure' / args.label
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
state = level.get('localShop', {})
pending = state.get('pending') or {}
status = json.loads(rows.get('dino.local.native.status', '{}'))
summary = {'diamond': level['player'].get('diamond'),
    'spirit': level['player'].get('spirit'), 'exp': level['player'].get('exp'),
    'heroCount': len(level.get('heros', [])),
    'heroes': [{'sid': h.get('sid'), 'typeid': h.get('typeid')} for h in level.get('heros', [])],
    'pending': {'id': pending.get('id'), 'closed': pending.get('closed'),
        'cards': [{'sid': c['hero']['sid'], 'typeid': c['hero']['typeid'],
                   'status': c['status']} for c in pending.get('cards', [])]},
    'items': {name: [{k: item.get(k) for k in ('oid','typeid','num')}
                    for item in bag.get('item_dict', {}).values()]
              for name, bag in level['player'].get('package', {}).items()},
    'shopLog': [entry for entry in status.get('log', []) if str(entry.get('step','')).startswith('shop')][-8:]}
(out / 'summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(summary, ensure_ascii=False))
