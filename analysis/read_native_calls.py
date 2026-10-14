import json
import shutil
import sqlite3
from pathlib import Path

base = Path(r'f:\kdzlj\analysis')
src = base / 'jsb-native.sqlite'
dst = base / 'jsb-native-copy.sqlite'
shutil.copy2(src, dst)
for suf in ['-wal', '-shm']:
    p = base / ('jsb-native.sqlite' + suf)
    if p.exists():
        shutil.copy2(p, base / ('jsb-native-copy.sqlite' + suf))

con = sqlite3.connect(str(dst))
cur = con.cursor()
cur.execute('SELECT value FROM data WHERE key=?', ('dino.local.native.status',))
row = cur.fetchone()
obj = json.loads(row[0] if not isinstance(row[0], bytes) else row[0].decode('utf-8'))
for e in obj.get('log') or []:
    step = e.get('step') or ''
    if any(x in step for x in ('finish', 'build', 'ans-', 'callServer', 'complete', 'unhandled')):
        print(json.dumps(e, ensure_ascii=False)[:700])
con.close()
