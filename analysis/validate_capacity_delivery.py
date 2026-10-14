"""Smoke-check the capacity delivery APK against normal saves."""
from pathlib import Path
import hashlib
import json
import sqlite3
import subprocess
import time
import zipfile

R = Path(__file__).resolve().parent.parent
W = R / 'analysis'
A = [r'F:\Android\Sdk\platform-tools\adb.exe', '-s', '127.0.0.1:21513']
P = 'com.netease.h1.qihoo'
records = []


def adb(*a):
    return subprocess.run(A + list(a), capture_output=True, check=True).stdout


def tap(x, y):
    adb('shell', 'input', 'tap', str(x), str(y))
    time.sleep(0.5)


def shot(name):
    adb('shell', 'screencap', '-p', '/sdcard/capacity-delivery.png')
    adb('pull', '/sdcard/capacity-delivery.png', str(W / ('capacity-delivery-' + name + '.png')))


def read(name):
    f = W / ('capacity-delivery-db-' + name)
    f.mkdir(exist_ok=True)
    for suffix in ['', '-wal']:
        (f / ('jsb.sqlite' + suffix)).write_bytes(
            adb('exec-out', 'cat', '/data/data/' + P + '/databases/jsb.sqlite' + suffix)
        )
    with sqlite3.connect(f / 'jsb.sqlite') as db:
        rows = dict(db.execute('select key,value from data'))
    baseline = json.loads((W / 'capacity-test-fixture.json').read_text(encoding='utf-8-sig'))['preserved']
    for k in ['dino.local.city.v1', 'dino.local.city.v2', 'dino.local.city.v3']:
        assert rows[k] == baseline[k], k
    v = json.loads(rows['dino.local.city.v4'])
    records.append({'step': name, 'state': v})
    return v


def select(b):
    tap(
        round((b['x'] - 1916) * 0.45 * 1280 / 1136 + 640),
        round(360 - (b['y'] + 90 - 1406) * 0.45 * 720 / 639),
    )


def start():
    adb('shell', 'am', 'force-stop', P)
    adb('shell', 'am', 'start', '-n', P + '/' + P + '.AdvanceDino')
    time.sleep(4)
    tap(640, 470)
    time.sleep(6)


with zipfile.ZipFile(R / 'dino-local-capacity.apk') as z:
    assert z.read('assets/offline/boot.js') == (W / 'capacity_boot.js').read_bytes()
    assert z.read('classes.dex') == (W / 'apk/build/apk/classes.dex').read_bytes()
    with zipfile.ZipFile(R / 'dino-local-upgrade.apk') as old:
        assert z.read('lib/armeabi/libdinolocal.so') == old.read('lib/armeabi/libdinolocal.so')

adb('push', str(R / 'dino-local-capacity.apk'), '/data/local/tmp/dino-local-capacity.apk')
adb('shell', 'pm', 'install', '-r', '/data/local/tmp/dino-local-capacity.apk')
adb('shell', 'rm', '-f', '/data/local/tmp/dino-boot.js', '/data/local/tmp/dino-command.js')
adb('logcat', '-c')
start()
initial = read('initial')
shot('initial')
assert initial['version'] == 4
assert initial['buildings'][0]['type'] == '20101'
assert initial['resources']['gold'] < 1000
select(initial['buildings'][2])
tap(1050, 694)
shot('confirmation')
assert read('confirmation') == initial
tap(1050, 694)
shot('base-required')
assert read('base-required') == initial
select(initial['buildings'][0])
tap(1050, 694)
tap(1050, 694)
shot('insufficient')
assert read('insufficient') == initial
select(initial['buildings'][1])
tap(640, 694)
shot('collected')
collected = read('collected')
assert collected['resources']['wood'] > initial['resources']['wood']
assert collected['buildings'] == initial['buildings']
tap(55, 35)
tap(640, 470)
time.sleep(6)
assert read('reenter') == collected
start()
assert read('restart') == collected
adb('shell', 'input', 'keyevent', '4')
time.sleep(1)
tap(640, 470)
time.sleep(6)
assert read('system-back') == collected
select(collected['buildings'][2])
shot('final')
log = adb('logcat', '-d').decode('utf-8', errors='replace')
(W / 'capacity-delivery-validation.log').write_text(log, encoding='utf-8')
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
            'DinoLocal update failed',
        ]
    )
]
assert not bad, bad
permissions = subprocess.check_output(
    [r'F:\Android\Sdk\build-tools\35.0.0\aapt.exe', 'dump', 'permissions', str(R / 'dino-local-capacity.apk')]
).decode()
assert "name='android.permission.INTERNET'" not in permissions
(W / 'capacity-delivery-permissions.txt').write_text(permissions, encoding='utf-8')
digest = hashlib.sha256((R / 'dino-local-capacity.apk').read_bytes()).hexdigest()
(W / 'capacity-delivery-validation.json').write_text(
    json.dumps(
        {
            'passed': True,
            'sha256': digest,
            'syntheticResources': False,
            'checks': [
                'packaged source and delivery dex',
                'single-run JNI preserved',
                'migrated from v3',
                'old saves unchanged',
                'base level rejection for storage',
                'insufficient resource rejection',
                'natural resource collection',
                'reentry and restart',
                'system back',
                'no external scripts',
                'no INTERNET permission',
            ],
            'records': records,
        },
        ensure_ascii=False,
        indent=2,
    ),
    encoding='utf-8',
)
print('Capacity delivery validation passed:', digest)
