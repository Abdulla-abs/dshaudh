"""Delivery validation for the mine build, using the NORMAL save key."""
from pathlib import Path
import json
import sqlite3
import subprocess
import time

ROOT = Path(__file__).resolve().parent.parent
W = ROOT / 'analysis'
ADB = [r'F:\Android\Sdk\platform-tools\adb.exe', '-s', '127.0.0.1:21513']
PKG = 'com.netease.h1.qihoo'
KEY = 'dino.local.city.v11'
DB = f'/data/data/{PKG}/databases/jsb.sqlite'
checks = []
records = []


def adb(*args):
    p = subprocess.run(ADB + list(args), capture_output=True)
    if p.returncode:
        raise RuntimeError(str(args) + p.stderr.decode('utf-8', errors='replace'))
    return p.stdout


def tap(x, y, pause=0.8):
    adb('shell', 'input', 'tap', str(x), str(y))
    time.sleep(pause)


def shot(name):
    adb('shell', 'screencap', '-p', '/sdcard/mine-delivery.png')
    adb('pull', '/sdcard/mine-delivery.png',
        str(W / ('mine-delivery-' + name + '.png')))


def read_rows():
    folder = W / ('mine-delivery-db-' + str(time.time_ns()))
    folder.mkdir(parents=True, exist_ok=True)
    for suffix in ['', '-wal']:
        (folder / ('jsb.sqlite' + suffix)).write_bytes(adb('exec-out', 'cat', DB + suffix))
    db = sqlite3.connect(folder / 'jsb.sqlite')
    try:
        return dict(db.execute('select key,value from data'))
    finally:
        db.close()


def read(name):
    adb('shell', 'am', 'force-stop', PKG)
    time.sleep(1.5)
    rows = read_rows()
    state = json.loads(rows[KEY])
    records.append({'step': name, 'state': state})
    return state


def start():
    adb('shell', 'am', 'force-stop', PKG)
    adb('shell', 'am', 'start', '-n', PKG + '/' + PKG + '.AdvanceDino')
    time.sleep(4)
    tap(640, 470)
    time.sleep(7)


def check(name, ok, detail=''):
    checks.append({'check': name, 'passed': bool(ok), 'detail': str(detail)})
    print(('  PASS ' if ok else '  FAIL ') + name + (' :: ' + str(detail) if detail else ''),
          flush=True)
    assert ok, (name, detail)


adb('push', str(ROOT / 'dino-local-mine.apk'),
    '/data/local/tmp/dino-local-mine.apk')
adb('shell', 'pm', 'install', '-r', '/data/local/tmp/dino-local-mine.apk')
adb('shell', 'rm', '-f', '/data/local/tmp/dino-boot.js', '/data/local/tmp/dino-command.js')
adb('logcat', '-c')
start()
shot('entry')
s1 = read('after-enter')
baseline = json.dumps(s1, separators=(',', ':'))
check('v11 save present', True, 'rev=%s buildings=%s' % (
    s1['revision'], len(s1['buildings'])))
check('version is 11', s1.get('version') == 11, s1.get('version'))

# Insufficient resources should refuse without mutating the save.
low = json.loads(baseline)
low['resources'] = {'gold': 0, 'wood': 0}
low['buildings'][0]['type'] = '20102'
# Keep only one well so build is offered; clear extras if any.
low['buildings'] = [b for b in low['buildings'] if int(b['uid'].split('-')[1]) < 8]
low['revision'] = s1['revision']

folder = W / 'mine-delivery-write'
folder.mkdir(exist_ok=True)
db_path = folder / 'jsb.sqlite'
for suffix in ['', '-wal']:
    (folder / ('jsb.sqlite' + suffix)).write_bytes(adb('exec-out', 'cat', DB + suffix))
with sqlite3.connect(db_path) as db:
    db.execute('PRAGMA wal_checkpoint(FULL)')
    db.execute('insert or replace into data(key,value) values(?,?)',
               (KEY, json.dumps(low, separators=(',', ':'))))
    db.commit()
    db.execute('PRAGMA wal_checkpoint(FULL)')
adb('push', str(db_path), '/data/local/tmp/jsb-mine-delivery.sqlite')
adb('shell', 'am', 'force-stop', PKG)
time.sleep(1)
adb('shell', 'cp', '/data/local/tmp/jsb-mine-delivery.sqlite', DB)
adb('shell', 'rm', '-f', DB + '-wal', DB + '-shm')
start()
tap(1152, 697, pause=1.2)
tap(round((1100 - 1916) * 0.45 * 1280 / 1136 + 640),
    round(360 - (1400 - 1406) * 0.45 * 720 / 639), pause=1.0)
shot('refuse-low-resource')
s2 = read('after-refuse')
check('low resource refuses construct',
      s2['revision'] == low['revision']
      and len(s2['buildings']) == len(low['buildings'])
      and s2['resources']['gold'] == 0 and s2['resources']['wood'] == 0,
      'rev=%s buildings=%s res=%s' % (
          s2['revision'], len(s2['buildings']), s2['resources']))

# Return to menu and re-enter.
adb('shell', 'input', 'keyevent', '4')
time.sleep(2)
tap(640, 470)
time.sleep(7)
shot('reenter')
s3 = read('after-reenter')
check('reenter keeps refuse state',
      s3['revision'] == s2['revision'] and s3['resources'] == s2['resources'])

log = adb('logcat', '-d').decode('utf-8', errors='replace')
(W / 'mine-delivery-validation.log').write_text(log, encoding='utf-8')
bad = [l for l in log.splitlines() if any(
    x in l for x in ['FATAL EXCEPTION', 'TypeError:', 'ReferenceError:',
                     'DinoLocal save failed', 'DinoLocal update failed'])]
crash = [l for l in log.splitlines()
         if 'Fatal signal' in l and 'com.netease.h1.qihoo' in l]
check('no script crash in logcat', not bad, bad[:3])
check('no game process crash', not crash, crash[:2])
check('delivery status logged', 'local-mine-ready' in log)

report = {
    'passed': all(c['passed'] for c in checks),
    'apk': 'dino-local-mine.apk',
    'key': KEY,
    'checks': checks,
    'records': records,
}
(W / 'mine-delivery-validation.json').write_text(
    json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print('\nMine delivery validation PASSED: %s checks' % len(checks))
