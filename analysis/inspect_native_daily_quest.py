"""Back up and inspect daily quest counters on the dedicated MEmu instance."""
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
out = ROOT / '.local/quest-progress' / args.label
out.mkdir(parents=True, exist_ok=True)
adb = [r'F:\Android\Sdk\platform-tools\adb.exe', '-s', '127.0.0.1:21513']
raw = subprocess.check_output(adb + ['exec-out', 'su', '-c',
    'tar -cf - -C /data/data/com.netease.h1.qihoo databases'])
(out / 'databases.tar').write_bytes(raw)
with tarfile.open(fileobj=io.BytesIO(raw)) as archive:
    archive.extractall(out, filter='data')
with sqlite3.connect(out / 'databases/jsb.sqlite') as db:
    saved = json.loads(db.execute('select value from data where key=?',
        ('dino.local.native.v1',)).fetchone()[0])
player = saved['level']['player']
summary = {'backup': str(out / 'databases.tar'),
    'pvp_stats': {key: player.get('achieve_raw', {}).get(key)
        for key in ('pvp_times', 'pvp_win_times')}, 'quests': []}
for group in player.get('event_counters', {}).values():
    for period, bucket in group.items():
        for quest, row in bucket.get('d', {}).get('current', {}).items():
            summary['quests'].append({'quest': quest, 'period': period,
                'counter': {key: value for key, value in row.items()
                    if key.startswith('mt_') or key == 'max'}})
(out / 'summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(summary, ensure_ascii=False))
