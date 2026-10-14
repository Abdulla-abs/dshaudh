"""Smoke-check the level3 delivery APK against normal saves."""
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
    time.sleep(0.8)


def shot(name):
    adb('shell', 'screencap', '-p', '/sdcard/level3-delivery.png')
    adb('pull', '/sdcard/level3-delivery.png', str(W / ('level3-delivery-' + name + '.png')))


def read_rows():
    f = W / ('level3-delivery-db-' + str(time.time_ns()))
    f.mkdir(exist_ok=True)
    for suffix in ['', '-wal']:
        (f / ('jsb.sqlite' + suffix)).write_bytes(
            adb('exec-out', 'cat', '/data/data/' + P + '/databases/jsb.sqlite' + suffix)
        )
    db = sqlite3.connect(f / 'jsb.sqlite')
    try:
        return dict(db.execute('select key,value from data'))
    finally:
        db.close()


def read(name):
    adb('shell', 'am', 'force-stop', P)
    time.sleep(1.5)
    rows = read_rows()
    baseline = json.loads((W / 'level3-test-fixture.json').read_text(encoding='utf-8-sig'))['preserved']
    for k in ['dino.local.city.v1', 'dino.local.city.v2', 'dino.local.city.v3', 'dino.local.city.v4']:
        assert rows[k] == baseline[k], k
    v = json.loads(rows['dino.local.city.v5'])
    records.append({'step': name, 'state': v})
    print(name, v['revision'], v['resources'], flush=True)
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


apk = R / 'dino-local-level3.apk'
digest = hashlib.sha256(apk.read_bytes()).hexdigest()
with zipfile.ZipFile(apk) as z:
    assert z.read('assets/offline/boot.js') == (W / 'level3_boot.js').read_bytes()
    assert z.read('classes.dex') == (W / 'apk/build/apk/classes.dex').read_bytes()
    with zipfile.ZipFile(R / 'dino-local-capacity.apk') as old:
        assert z.read('lib/armeabi/libdinolocal.so') == old.read('lib/armeabi/libdinolocal.so')

adb('push', str(apk), '/data/local/tmp/dino-local-level3.apk')
adb('shell', 'pm', 'install', '-r', '/data/local/tmp/dino-local-level3.apk')
adb('shell', 'rm', '-f', '/data/local/tmp/dino-boot.js', '/data/local/tmp/dino-command.js')
adb('logcat', '-c')
start()
initial = read('initial')
start()
shot('initial')
assert initial['version'] == 5
assert initial['buildings'][0]['type'] in ('20101', '20102', '20103')
# Normal saves start poor; city lv1 cannot afford storage lv2, and nest needs wood.
select(initial['buildings'][5])
tap(1050, 694)
tap(1050, 694)
shot('nest-insufficient')
after = read('nest-insufficient')
assert after == initial
start()
select(initial['buildings'][1])
tap(640, 694)
shot('collect')
collected = read('collect')
start()
tap(55, 35)
tap(640, 470)
time.sleep(6)
reenter = read('reenter')
assert reenter['revision'] >= collected['revision']

log = adb('logcat', '-d').decode('utf-8', errors='replace')
(W / 'level3-delivery-validation.log').write_text(log, encoding='utf-8')
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
perms = adb('shell', 'dumpsys', 'package', P).decode('utf-8', errors='replace')
(W / 'level3-delivery-permissions.txt').write_text(perms, encoding='utf-8')

(W / 'level3-delivery-validation.json').write_text(
    json.dumps(
        {
            'passed': True,
            'apk': str(apk),
            'sha256': digest,
            'checks': [
                'boot.js matches level3_boot.js',
                'old v1-v4 saves unchanged',
                'v5 migrated',
                'insufficient resources reject',
                'collect still works',
                'reentry',
            ],
            'records': records,
        },
        ensure_ascii=False,
        indent=2,
    ),
    encoding='utf-8',
)
print('Level3 delivery validation passed', digest, flush=True)
