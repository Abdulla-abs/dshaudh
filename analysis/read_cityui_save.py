import json, sqlite3, subprocess, time
from pathlib import Path

ADB = [r'F:\Android\Sdk\platform-tools\adb.exe', '-s', '127.0.0.1:21513']
PKG = 'com.netease.h1.qihoo'
DB = f'/data/data/{PKG}/databases/jsb.sqlite'
W = Path(__file__).resolve().parent


def adb(*args):
    p = subprocess.run(ADB + list(args), capture_output=True)
    if p.returncode:
        raise RuntimeError(str(args) + p.stderr.decode('utf-8', errors='replace'))
    return p.stdout


def read_rows():
    folder = W / ('cityui-db-tmp-' + str(time.time_ns()))
    folder.mkdir(parents=True, exist_ok=True)
    for suffix in ['', '-wal']:
        (folder / ('jsb.sqlite' + suffix)).write_bytes(adb('exec-out', 'cat', DB + suffix))
    db = sqlite3.connect(folder / 'jsb.sqlite')
    try:
        return dict(db.execute('select key,value from data'))
    finally:
        db.close()


rows = read_rows()
for k in sorted(rows):
    if 'dino.local' not in k:
        continue
    print('KEY', k, 'len', len(rows[k]))
    st = json.loads(rows[k])
    print(' version', st.get('version'), 'buildings', len(st.get('buildings', [])),
          'resources', st.get('resources'), 'rev', st.get('revision'))
    notes = st.get('migrationNotes')
    if notes:
        print(' migrationNotes', len(notes), json.dumps(notes[:3], ensure_ascii=False)[:400])
    for b in st.get('buildings', []):
        print(' ', b.get('uid'), b.get('type'),
              'xy', round(float(b.get('x', 0)), 1), round(float(b.get('y', 0)), 1),
              'tile', b.get('tilex'), b.get('tiley'),
              'up' if b.get('upgrade') else '', 'ct' if b.get('construct') else '')
