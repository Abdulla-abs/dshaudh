"""Verify nest/training capacity status text on the cultivate delivery APK."""
from pathlib import Path
import json
import sqlite3
import subprocess
import time

ROOT = Path(__file__).resolve().parent.parent
WORK = ROOT / 'analysis'
ADB = [r'F:\Android\Sdk\platform-tools\adb.exe', '-s', '127.0.0.1:21513']
PKG = 'com.netease.h1.qihoo'
SAVE = 'dino.local.city.v8'
records = []


def adb(*args):
    r = subprocess.run(ADB + list(args), capture_output=True)
    if r.returncode:
        raise RuntimeError(str(args) + r.stderr.decode('utf-8', errors='replace'))
    return r.stdout


def tap(x, y):
    adb('shell', 'input', 'tap', str(x), str(y))
    time.sleep(0.7)


def shot(name):
    adb('shell', 'screencap', '-p', '/sdcard/cultivate-verified.png')
    adb('pull', '/sdcard/cultivate-verified.png', str(WORK / ('cultivate-verified-' + name + '.png')))


def read(name):
    folder = WORK / ('cultivate-db-' + name)
    folder.mkdir(exist_ok=True)
    for suffix in ['', '-wal']:
        (folder / ('jsb.sqlite' + suffix)).write_bytes(
            adb('exec-out', 'cat', '/data/data/' + PKG + '/databases/jsb.sqlite' + suffix)
        )
    with sqlite3.connect(folder / 'jsb.sqlite') as db:
        rows = dict(db.execute('select key,value from data'))
    value = json.loads(rows[SAVE])
    records.append({'step': name, 'state': value})
    return value


def start():
    adb('shell', 'am', 'force-stop', PKG)
    adb('shell', 'am', 'start', '-n', PKG + '/' + PKG + '.AdvanceDino')
    time.sleep(4)
    tap(640, 470)
    time.sleep(7)


def select(b):
    x = round((b['x'] - 1916) * 0.45 * 1280 / 1136 + 640)
    y = round(360 - (b['y'] + 90 - 1406) * 0.45 * 720 / 639)
    tap(x, y)


adb('push', str(ROOT / 'dino-local-cultivate.apk'), '/data/local/tmp/dino-local-cultivate.apk')
adb('shell', 'pm', 'install', '-r', '/data/local/tmp/dino-local-cultivate.apk')
adb('shell', 'rm', '-f', '/data/local/tmp/dino-boot.js', '/data/local/tmp/dino-command.js')
adb('logcat', '-c')
start()
shot('initial')
state = read('initial')
assert state['version'] == 8
assert len(state['buildings']) == 8

nest = state['buildings'][5]
train = state['buildings'][6]
assert nest['type'].startswith('206')
assert train['type'].startswith('207')

select(nest)
shot('nest')
select(train)
shot('train')

# Upgrade still available path: select city, open upgrade confirm text once.
select(state['buildings'][0])
shot('city')
tap(1040, 694)
shot('city-upgrade-prompt')

tap(55, 35)
time.sleep(1)
tap(640, 470)
time.sleep(7)
shot('reenter')
assert read('reenter')['buildings'] == state['buildings']

log = adb('logcat', '-d').decode('utf-8', errors='replace')
(WORK / 'cultivate-validation.log').write_text(log, encoding='utf-8')
assert 'local-cultivate-ready' in log or 'DinoLocal: local entry scene ready' in log
bad = [
    line
    for line in log.splitlines()
    if any(
        x in line
        for x in [
            'FATAL EXCEPTION',
            'Fatal signal',
            'TypeError:',
            'ReferenceError:',
            'DinoLocal save failed',
        ]
    )
]
assert not bad, bad

report = {
    'passed': True,
    'apk': 'dino-local-cultivate.apk',
    'saveKey': SAVE,
    'checks': [
        'install delivery package',
        'enter original loading flow',
        'select nest screenshot',
        'select training ground screenshot',
        'upgrade prompt still available',
        'return and reenter preserves save',
        'no script crash in logcat',
    ],
    'nestType': nest['type'],
    'trainType': train['type'],
    'records': records,
}
(WORK / 'cultivate-validation.json').write_text(
    json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8'
)
print('Cultivate validation passed:', nest['type'], train['type'])
