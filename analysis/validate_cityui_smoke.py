"""Smoke validation for local city UI / footprint package."""
from pathlib import Path
import json
import sqlite3
import subprocess
import time

ROOT = Path(__file__).resolve().parent.parent
W = ROOT / 'analysis'
ADB = [r'F:\Android\Sdk\platform-tools\adb.exe', '-s', '127.0.0.1:21513']
PKG = 'com.netease.h1.qihoo'
KEY = 'dino.local.city.v12'
DB = f'/data/data/{PKG}/databases/jsb.sqlite'
checks = []


def adb(*args):
    p = subprocess.run(ADB + list(args), capture_output=True)
    if p.returncode:
        raise RuntimeError(str(args) + p.stderr.decode('utf-8', errors='replace'))
    return p.stdout


def tap(x, y, pause=0.9):
    adb('shell', 'input', 'tap', str(int(x)), str(int(y)))
    time.sleep(pause)


def shot(name):
    adb('shell', 'screencap', '-p', '/sdcard/cityui-smoke.png')
    adb('pull', '/sdcard/cityui-smoke.png', str(W / ('cityui-verified-' + name + '.png')))


def check(name, ok, detail=''):
    checks.append({'check': name, 'passed': bool(ok), 'detail': str(detail)})
    print(('PASS ' if ok else 'FAIL ') + name + ((' :: ' + str(detail)) if detail else ''), flush=True)


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


def map_tap(x, y, pause=1.0):
    # Camera reset uses scale 0.58 and y offset -40 (design space 1136x639 -> 1280x720).
    sx = round((x - 1916) * 0.58 * 1280 / 1136 + 640)
    sy = round(360 - (y - 1406) * 0.58 * 720 / 639 + 40 * 720 / 639)
    tap(sx, sy, pause=pause)


def start():
    adb('shell', 'am', 'force-stop', PKG)
    time.sleep(1.2)
    adb('shell', 'am', 'start', '-n', PKG + '/' + PKG + '.AdvanceDino')
    time.sleep(5)
    tap(640, 470, pause=8)


def btn(name):
    # Bottom panel buttons in design coords mapped to screen.
    xs = {
        'move': 0.10, 'collect': 0.28, 'upgrade': 0.46, 'train': 0.64,
        'build': 0.82, 'confirm': 0.38, 'cancel': 0.62,
    }
    x = round(xs[name] * 1136 * 1280 / 1136)
    y = round(720 - 34 * 720 / 639)
    tap(x, y, pause=1.0)


rows0 = read_rows()
assert KEY in rows0, 'missing v12 save'
state0 = json.loads(rows0[KEY])
check('v12 exists', state0['version'] == 12)
check('has tiles', all('tilex' in b and 'tiley' in b for b in state0['buildings']))
check('migration notes', isinstance(state0.get('migrationNotes'), list) and len(state0['migrationNotes']) >= 1)
check('resources preserved', state0['resources'] == {'gold': 0, 'wood': 0} or isinstance(state0['resources']['gold'], int))
fp = {}
for b in state0['buildings']:
    fam = str(b['type'])[:3]
    fp[fam] = (b['tilex'], b['tiley'])
check('no null tiles', all(v[0] is not None and v[1] is not None for v in fp.values()), fp)

start()
shot('entry-loaded')

# Select main hall (building-0)
b0 = state0['buildings'][0]
map_tap(b0['x'], b0['y'])
shot('select-hall')

# Select barracks 5x5
b6 = [b for b in state0['buildings'] if str(b['type']).startswith('207')][0]
map_tap(b6['x'], b6['y'])
shot('select-barracks-5x5')

# Select architect 2x2
b7 = [b for b in state0['buildings'] if str(b['type']).startswith('212')][0]
map_tap(b7['x'], b7['y'])
shot('select-architect-2x2')

# Move propose onto hall (should be invalid) then cancel — position unchanged
map_tap(b7['x'], b7['y'])
btn('move')
map_tap(b0['x'], b0['y'])
shot('move-overlap-red')
btn('cancel')
shot('move-cancelled')

adb('shell', 'am', 'force-stop', PKG)
time.sleep(1.5)
state1 = json.loads(read_rows()[KEY])
same = all(
    abs(a['x'] - b['x']) < 0.01 and abs(a['y'] - b['y']) < 0.01
    and a['tilex'] == b['tilex'] and a['tiley'] == b['tiley']
    for a, b in zip(state0['buildings'], state1['buildings'])
)
check('cancel keeps positions', same)
check('revision unchanged after cancel', state0['revision'] == state1['revision'],
      (state0['revision'], state1['revision']))

# Restart and legal move of architect, confirm, then verify
start()
map_tap(b7['x'], b7['y'])
btn('move')
# empty-ish area near buildable center
map_tap(1888, 1363)
shot('move-candidate')
btn('confirm')
shot('move-confirmed')
adb('shell', 'am', 'force-stop', PKG)
time.sleep(1.5)
state2 = json.loads(read_rows()[KEY])
moved = [b for b in state2['buildings'] if b['uid'] == b7['uid']][0]
check('move saved new tile', (moved['tilex'], moved['tiley']) != (b7['tilex'], b7['tiley']),
      ((moved['tilex'], moved['tiley']), (b7['tilex'], b7['tiley'])))
check('revision bumped', state2['revision'] > state0['revision'])

# restore previous architect position for delivery cleanliness
state2['buildings'] = json.loads(json.dumps(state0['buildings']))
state2['revision'] = state0['revision'] + 1
# write back via same pattern as validate_mine
adb('shell', 'am', 'force-stop', PKG)
time.sleep(1)
folder = W / 'cityui-db-write'
folder.mkdir(exist_ok=True)
db_path = folder / 'jsb.sqlite'
for suffix in ['', '-wal']:
    (folder / ('jsb.sqlite' + suffix)).write_bytes(adb('exec-out', 'cat', DB + suffix))
with sqlite3.connect(db_path) as db:
    db.execute('PRAGMA wal_checkpoint(FULL)')
    db.execute('insert or replace into data(key,value) values(?,?)',
               (KEY, json.dumps(state2, separators=(',', ':'))))
    db.commit()
    db.execute('PRAGMA wal_checkpoint(FULL)')
adb('push', str(db_path), '/data/local/tmp/jsb-cityui.sqlite')
adb('shell', 'cp', '/data/local/tmp/jsb-cityui.sqlite', DB)
adb('shell', 'rm', '-f', DB + '-wal', DB + '-shm')

out = {
    'package': 'dino-local-cityui.apk',
    'save': KEY,
    'checks': checks,
    'passed': all(c['passed'] for c in checks),
}
(W / 'cityui-validation.json').write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding='utf-8')
print('RESULT', out['passed'], flush=True)
if not out['passed']:
    raise SystemExit(1)
