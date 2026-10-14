"""Validate storage-building upgrades and warehouse capacity changes."""
from pathlib import Path
import json
import sqlite3
import subprocess
import time

ROOT = Path(__file__).resolve().parent.parent
W = ROOT / 'analysis'
ADB = [r'F:\Android\Sdk\platform-tools\adb.exe', '-s', '127.0.0.1:21513']
PKG = 'com.netease.h1.qihoo'
KEY = 'dino.local.city.v4.validation-20261012'
records = []
fixture = json.loads((W / 'capacity-test-fixture.json').read_text(encoding='utf-8-sig'))

STORAGE = {
    '20101': (20000, 20000),
    '20102': (20000, 20000),
    '20301': (0, 5000),
    '20302': (0, 15000),
    '20501': (5000, 0),
    '20502': (15000, 0),
}


def adb(*args):
    p = subprocess.run(ADB + list(args), capture_output=True)
    if p.returncode:
        raise RuntimeError(str(args) + p.stderr.decode('utf-8', errors='replace'))
    return p.stdout


def tap(x, y):
    adb('shell', 'input', 'tap', str(x), str(y))
    time.sleep(0.5)


def shot(name):
    adb('shell', 'screencap', '-p', '/sdcard/capacity-validation.png')
    adb('pull', '/sdcard/capacity-validation.png', str(W / ('capacity-verified-' + name + '.png')))


def capacity(state):
    gold = wood = 0
    for b in state['buildings']:
        g, w = STORAGE.get(b['type'], (0, 0))
        gold += g
        wood += w
    return gold, wood


def read(name):
    folder = W / ('capacity-db-' + name)
    folder.mkdir(exist_ok=True)
    for suffix in ['', '-wal']:
        (folder / ('jsb.sqlite' + suffix)).write_bytes(
            adb('exec-out', 'cat', '/data/data/' + PKG + '/databases/jsb.sqlite' + suffix)
        )
    with sqlite3.connect(folder / 'jsb.sqlite') as db:
        rows = dict(db.execute('select key,value from data'))
    for k, v in fixture['preserved'].items():
        assert rows.get(k) == v, ('Normal save changed', k)
    state = json.loads(rows[KEY])
    records.append({'step': name, 'state': state, 'capacity': capacity(state)})
    (W / 'capacity-validation-progress.json').write_text(json.dumps(records, indent=2), encoding='utf-8')
    print(name, state['revision'], state['resources'], capacity(state), flush=True)
    return state


def start():
    adb('shell', 'am', 'force-stop', PKG)
    adb('shell', 'am', 'start', '-n', PKG + '/' + PKG + '.AdvanceDino')
    time.sleep(4)
    tap(640, 470)
    time.sleep(6)


def select(b):
    tap(
        round((b['x'] - 1916) * 0.45 * 1280 / 1136 + 640),
        round(360 - (b['y'] + 90 - 1406) * 0.45 * 720 / 639),
    )


def upgrade_click():
    tap(1050, 694)


def wait_until(end):
    while time.time() < end + 2:
        time.sleep(min(10, max(0.1, end + 2 - time.time())))
    time.sleep(2)


adb('push', str(W / 'dino-capacity-validation.apk'), '/data/local/tmp/dino-capacity-validation.apk')
adb('shell', 'pm', 'install', '-r', '/data/local/tmp/dino-capacity-validation.apk')
adb('shell', 'rm', '-f', '/data/local/tmp/dino-boot.js', '/data/local/tmp/dino-command.js')
adb('logcat', '-c')
start()
before = read('initial')
shot('initial')
assert before['buildings'][0]['type'] == '20102'
assert capacity(before) == (25000, 25000)

select(before['buildings'][5])
upgrade_click()
assert read('unsupported') == before

select(before['buildings'][2])
upgrade_click()
shot('sun-store-cost')
assert read('sun-store-confirmation') == before
upgrade_click()
shot('sun-store-start')
sun = read('sun-store-start')
assert sun['resources'] == {'gold': 4000, 'wood': 7000}
job = sun['buildings'][2]['upgrade']
assert job['target'] == '20302' and job['ends'] - job['started'] == 180
assert capacity(sun) == (25000, 25000)

select(sun['buildings'][4])
upgrade_click()
upgrade_click()
shot('worker-busy')
assert read('worker-busy') == sun

adb('shell', 'am', 'force-stop', PKG)
print('Waiting offline for the real 180-second sunshine dish upgrade', flush=True)
wait_until(job['ends'])
start()
select(sun['buildings'][2])
shot('sun-store-complete')
sun_done = read('sun-store-complete')
assert sun_done['buildings'][2]['type'] == '20302' and 'upgrade' not in sun_done['buildings'][2]
assert capacity(sun_done) == (25000, 35000)
assert sun_done['resources'] == sun['resources']

select(sun_done['buildings'][4])
upgrade_click()
upgrade_click()
shot('gold-store-start')
gold = read('gold-store-start')
assert gold['resources'] == {'gold': 4000, 'wood': 4000}
gold_job = gold['buildings'][4]['upgrade']
assert gold_job['target'] == '20502' and gold_job['ends'] - gold_job['started'] == 180

start()
assert read('gold-store-restart') == gold
adb('shell', 'am', 'force-stop', PKG)
print('Waiting offline for the real 180-second gold store upgrade', flush=True)
wait_until(gold_job['ends'])
start()
select(gold['buildings'][4])
shot('gold-store-complete')
done = read('gold-store-complete')
assert done['buildings'][4]['type'] == '20502' and 'upgrade' not in done['buildings'][4]
assert capacity(done) == (35000, 35000)
assert done['resources'] == gold['resources']

tap(55, 35)
tap(640, 470)
time.sleep(6)
assert read('reenter') == done

log = adb('logcat', '-d').decode('utf-8', errors='replace')
(W / 'capacity-validation.log').write_text(log, encoding='utf-8')
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
(W / 'capacity-validation.json').write_text(
    json.dumps(
        {
            'passed': True,
            'fixtureKey': KEY,
            'syntheticResources': True,
            'duration': 'real 180/180 seconds; no time acceleration',
            'checks': [
                'confirmation no mutation',
                'unsupported buildings',
                'gold debit for sunshine dish',
                'wood debit for gold store',
                'single worker',
                'offline completion',
                'capacity 25000->35000 wood then gold',
                'level-2 storage art',
                'reentry',
                'normal saves unchanged',
            ],
            'records': records,
        },
        ensure_ascii=False,
        indent=2,
    ),
    encoding='utf-8',
)
print('Capacity fixture validation passed', flush=True)
