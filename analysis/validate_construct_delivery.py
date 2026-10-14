"""Delivery validation for the construct build, using the NORMAL save key."""
from pathlib import Path
import json
import sqlite3
import subprocess
import time

ROOT = Path(__file__).resolve().parent.parent
W = ROOT / 'analysis'
ADB = [r'F:\Android\Sdk\platform-tools\adb.exe', '-s', '127.0.0.1:21513']
PKG = 'com.netease.h1.qihoo'
KEY = 'dino.local.city.v10'
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
    adb('shell', 'screencap', '-p', '/sdcard/construct-delivery.png')
    adb('pull', '/sdcard/construct-delivery.png',
        str(W / ('construct-delivery-' + name + '.png')))


def read_rows():
    folder = W / ('construct-delivery-db-' + str(time.time_ns()))
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


adb('push', str(ROOT / 'dino-local-construct.apk'),
    '/data/local/tmp/dino-local-construct.apk')
adb('shell', 'pm', 'install', '-r', '/data/local/tmp/dino-local-construct.apk')
adb('shell', 'rm', '-f', '/data/local/tmp/dino-boot.js', '/data/local/tmp/dino-command.js')
adb('logcat', '-c')
start()
shot('entry')
s1 = read('after-enter')
baseline = json.dumps(s1, separators=(',', ':'))
check('v10 save present', s1['version'] == 10, s1['version'])
check('starter building count', len(s1['buildings']) >= 8, len(s1['buildings']))

# Without enough gold / city level, start construct should not change the save.
tap(1152, 697, pause=1.0)
tap(200, 400, pause=1.0)
shot('refused-or-placing')
s2 = read('after-build-tap')
check('insufficient/cap path did not invent a building',
      len(s2['buildings']) == len(s1['buildings'])
      and s2['resources']['gold'] == s1['resources']['gold'],
      'buildings=%s gold=%s' % (len(s2['buildings']), s2['resources']['gold']))

# Return and re-enter.
start()
shot('reenter')
s3 = read('reenter')
check('save stable across return',
      json.dumps(s3, separators=(',', ':')) == baseline
      or (s3['revision'] == s1['revision'] and s3['buildings'] == s1['buildings']),
      'rev=%s' % s3['revision'])

log = adb('logcat', '-d').decode('utf-8', errors='replace')
(W / 'construct-delivery-validation.log').write_text(log, encoding='utf-8')
bad = [l for l in log.splitlines() if any(
    x in l for x in ['FATAL EXCEPTION', 'TypeError:', 'ReferenceError:',
                     'DinoLocal save failed'])]
crash = [l for l in log.splitlines()
         if 'Fatal signal' in l and 'com.netease.h1.qihoo' in l]
check('no script crash', not bad, bad[:3])
check('no game process crash', not crash, crash[:2])
check('construct ready logged', 'local-construct-ready' in log)

report = {
    'passed': all(c['passed'] for c in checks),
    'apk': 'dino-local-construct.apk',
    'key': KEY,
    'checks': checks,
    'records': records,
}
(W / 'construct-delivery-validation.json').write_text(
    json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print('\nConstruct delivery validation PASSED: %s checks' % len(checks))
