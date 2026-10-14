"""Delivery validation for the training build, using the NORMAL save key.

No fixture injection: installs the delivery APK, enters the original loading
flow, confirms the barracks line, refuses training without enough wood, returns
and re-enters, and checks the save is preserved plus no script errors.
"""
from pathlib import Path
import json
import sqlite3
import subprocess
import time

ROOT = Path(__file__).resolve().parent.parent
W = ROOT / 'analysis'
ADB = [r'F:\Android\Sdk\platform-tools\adb.exe', '-s', '127.0.0.1:21513']
PKG = 'com.netease.h1.qihoo'
KEY = 'dino.local.city.v9'
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
    adb('shell', 'screencap', '-p', '/sdcard/train-delivery.png')
    adb('pull', '/sdcard/train-delivery.png', str(W / ('train-delivery-' + name + '.png')))


def read_rows():
    folder = W / ('train-delivery-db-' + str(time.time_ns()))
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


def select(b):
    tap(round((b['x'] - 1916) * 0.45 * 1280 / 1136 + 640),
        round(360 - (b['y'] + 90 - 1406) * 0.45 * 720 / 639))


def check(name, ok, detail=''):
    checks.append({'check': name, 'passed': bool(ok), 'detail': str(detail)})
    print(('  PASS ' if ok else '  FAIL ') + name + (' :: ' + str(detail) if detail else ''),
          flush=True)
    assert ok, (name, detail)


adb('push', str(ROOT / 'dino-local-train.apk'), '/data/local/tmp/dino-local-train.apk')
adb('shell', 'pm', 'install', '-r', '/data/local/tmp/dino-local-train.apk')
adb('shell', 'rm', '-f', '/data/local/tmp/dino-boot.js', '/data/local/tmp/dino-command.js')
adb('logcat', '-c')

start()
shot('entry')
before = read('normal-before')
check('normal save is version 9', before['version'] == 9, before['version'])
check('normal save has no student queue yet', not before.get('training'), before.get('training'))
barracks = before['buildings'][6]
check('barracks is 207 family', barracks['type'].startswith('207'), barracks['type'])

# The normal save has little wood, so training must be refused with a hint.
before_wood = before['resources']['wood']
select(barracks)
shot('barracks-selected')
tap(1150, 697, pause=1.2)
shot('insufficient-wood')
after_click = read('insufficient-wood')
check('training refused without enough wood',
      not after_click.get('training')
      and after_click['resources']['wood'] == before_wood
      and after_click['revision'] == before['revision'],
      'wood=%s rev=%s' % (after_click['resources']['wood'], after_click['revision']))
# The barracks is level 3, so the required soldier is 11403 costing 150 wood.
# The normal save holds 50, so training must be refused and nothing deducted.
SPEC_COST = {'20701': 50, '20702': 100, '20703': 150, '20704': 200,
             '20705': 300, '20706': 400, '20707': 500, '20708': 600}
need = SPEC_COST[barracks['type']]
check('wood below the required 114-family cost', before_wood < need,
      'wood=%s need=%s' % (before_wood, need))

# Return to the original entry and re-enter: loading flow still works.
tap(55, 35, pause=1.2)
shot('back-to-entry')
tap(640, 470, pause=1.0)
time.sleep(6)
shot('reenter')
after = read('reenter')
check('re-enter preserves the normal save', after == before, 'revision drift')
check('normal save untouched by delivery run',
      after['revision'] == before['revision'] and after['buildings'] == before['buildings'])

log = adb('logcat', '-d').decode('utf-8', errors='replace')
(W / 'train-delivery-validation.log').write_text(log, encoding='utf-8')
bad = [l for l in log.splitlines() if any(
    x in l for x in ['FATAL EXCEPTION', 'TypeError:', 'ReferenceError:',
                     'DinoLocal save failed', 'DinoLocal update failed'])]
check('no script error in logcat', not bad, bad[:3])
crash = [l for l in log.splitlines()
         if 'Fatal signal' in l and 'com.netease.h1.qihoo' in l]
check('no game process crash', not crash, crash[:2])
check('delivery status logged', 'local-train-ready' in log)

report = {
    'passed': all(c['passed'] for c in checks),
    'apk': 'dino-local-train.apk',
    'saveKey': KEY,
    'barracks': barracks,
    'woodAvailable': before_wood,
    'checks': checks,
    'records': records,
}
(W / 'train-delivery-validation.json').write_text(
    json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print('\nDelivery validation PASSED: %s checks' % len(checks))
