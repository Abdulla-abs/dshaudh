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
cur.execute('SELECT key, length(value) FROM data')
print('KEYS:', cur.fetchall())
for key in ['dino.local.native.status', 'dino.local.native.v1']:
    cur.execute('SELECT value FROM data WHERE key=?', (key,))
    row = cur.fetchone()
    if not row:
        print('MISSING', key)
        continue
    raw = row[0]
    if isinstance(raw, bytes):
        raw = raw.decode('utf-8', 'replace')
    obj = json.loads(raw)
    if key.endswith('status'):
        print('=== STATUS latest ===')
        print(json.dumps(obj.get('latest'), ensure_ascii=False, indent=2)[:3000])
        log = obj.get('log') or []
        print('=== STATUS log (%d) ===' % len(log))
        for e in log:
            step = e.get('step') if isinstance(e, dict) else None
            # print interesting + last ones
            interesting = step and any(x in step for x in (
                'FirstMovie', 'beginRookie', 'initRookie', 'new-account',
                'seed-starter', 'initByServer', 'rpc_c_start', '_enterWorld',
                'placement', 'enableOK', 'callServer', 'ans-build', 'probe-301'
            ))
            if interesting:
                print(json.dumps(e, ensure_ascii=False)[:600])
        print('--- last 25 ---')
        for e in log[-25:]:
            print(json.dumps(e, ensure_ascii=False)[:500])
    else:
        print('=== STORE ===')
        print('version', obj.get('version'), 'source', obj.get('source'),
              'revision', obj.get('revision'),
              'starterResGranted', obj.get('starterResGranted'))
        lv = obj.get('level') or {}
        p = lv.get('player') or {}
        print('player', {k: p.get(k) for k in [
            'nickname', 'first_movie_played', 'level', 'exp']})
        print('units', [{k: u.get(k) for k in ['sid', 'typeid', 'x', 'y', 'state']}
                        for u in (lv.get('units') or [])])
        uc = lv.get('user_config') or {}
        print('user_config keys', list(uc.keys())[:50])
        print('user_config sample', json.dumps(uc, ensure_ascii=False)[:800])
con.close()
