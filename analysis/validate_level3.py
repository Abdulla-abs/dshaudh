"""Validate level-3 economy upgrades plus nest/training level-2 upgrades."""
from pathlib import Path
import json
import sqlite3
import subprocess
import time

ROOT = Path(__file__).resolve().parent.parent
W = ROOT / 'analysis'
ADB = [r'F:\Android\Sdk\platform-tools\adb.exe', '-s', '127.0.0.1:21513']
PKG = 'com.netease.h1.qihoo'
KEY = 'dino.local.city.v5.validation-20261012'
DB = f'/data/data/{PKG}/databases/jsb.sqlite'
records = []
fixture = json.loads((W / 'level3-test-fixture.json').read_text(encoding='utf-8-sig'))

STORAGE = {
    '20101': (20000, 20000),
    '20102': (20000, 20000),
    '20103': (20000, 20000),
    '20301': (0, 5000),
    '20302': (0, 15000),
    '20303': (0, 25000),
    '20501': (5000, 0),
    '20502': (15000, 0),
    '20503': (25000, 0),
}


def adb(*args):
    p = subprocess.run(ADB + list(args), capture_output=True)
    if p.returncode:
        raise RuntimeError(str(args) + p.stderr.decode('utf-8', errors='replace'))
    return p.stdout


def tap(x, y, pause=0.8):
    adb('shell', 'input', 'tap', str(x), str(y))
    time.sleep(pause)


def shot(name):
    adb('shell', 'screencap', '-p', '/sdcard/level3-validation.png')
    adb('pull', '/sdcard/level3-validation.png', str(W / ('level3-verified-' + name + '.png')))


def capacity(state):
    gold = wood = 0
    for b in state['buildings']:
        g, w = STORAGE.get(b['type'], (0, 0))
        gold += g
        wood += w
    return gold, wood


def read_rows():
    # Unique folder each read avoids Windows file locks and stale -shm snapshots.
    folder = W / ('level3-db-tmp-' + str(time.time_ns()))
    folder.mkdir(parents=True, exist_ok=True)
    for suffix in ['', '-wal']:
        (folder / ('jsb.sqlite' + suffix)).write_bytes(
            adb('exec-out', 'cat', DB + suffix)
        )
    db = sqlite3.connect(folder / 'jsb.sqlite')
    try:
        return dict(db.execute('select key,value from data'))
    finally:
        db.close()


def write_state(state):
    adb('shell', 'am', 'force-stop', PKG)
    time.sleep(1)
    folder = W / 'level3-db-write'
    folder.mkdir(exist_ok=True)
    db_path = folder / 'jsb.sqlite'
    for suffix in ['', '-wal']:
        (folder / ('jsb.sqlite' + suffix)).write_bytes(
            adb('exec-out', 'cat', DB + suffix)
        )
    with sqlite3.connect(db_path) as db:
        db.execute('PRAGMA wal_checkpoint(FULL)')
        rows = dict(db.execute('select key,value from data'))
        for k, v in fixture['preserved'].items():
            assert rows.get(k) == v, ('Normal save changed before rewrite', k)
        encoded = json.dumps(state, separators=(',', ':'))
        db.execute('insert or replace into data(key,value) values(?,?)', (KEY, encoded))
        db.commit()
        db.execute('PRAGMA wal_checkpoint(FULL)')
    adb('push', str(db_path), '/data/local/tmp/jsb-level3.sqlite')
    adb('shell', 'cp', '/data/local/tmp/jsb-level3.sqlite', DB)
    adb('shell', 'rm', '-f', DB + '-wal', DB + '-shm')


def advance_job(state, index):
    """Keep original duration, move the job fully into the past."""
    next_state = json.loads(json.dumps(state))
    job = next_state['buildings'][index]['upgrade']
    duration = job['ends'] - job['started']
    now = int(time.time())
    job['ends'] = now - 5
    job['started'] = job['ends'] - duration
    next_state['revision'] += 1
    write_state(next_state)
    return next_state


def read(name):
    # Pause/kill so localStorage flushes into SQLite before we copy files.
    adb('shell', 'am', 'force-stop', PKG)
    time.sleep(1.5)
    rows = read_rows()
    for k, v in fixture['preserved'].items():
        assert rows.get(k) == v, ('Normal save changed', k)
    state = json.loads(rows[KEY])
    records.append({'step': name, 'state': state, 'capacity': capacity(state)})
    (W / 'level3-validation-progress.json').write_text(json.dumps(records, indent=2), encoding='utf-8')
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
    tap(1050, 694, pause=1.2)


def confirm_upgrade(name_prefix):
    """Two taps without an intervening DB read, so confirmUid stays in memory."""
    upgrade_click()
    shot(name_prefix + '-cost')
    upgrade_click()
    shot(name_prefix + '-start')
    return read(name_prefix + '-start')


adb('push', str(W / 'dino-level3-validation.apk'), '/data/local/tmp/dino-level3-validation.apk')
adb('shell', 'pm', 'install', '-r', '/data/local/tmp/dino-level3-validation.apk')
adb('shell', 'rm', '-f', '/data/local/tmp/dino-boot.js', '/data/local/tmp/dino-command.js')
adb('logcat', '-c')
start()
before = read('initial')
start()
shot('initial')
assert before['buildings'][0]['type'] == '20102'
assert before['buildings'][2]['type'] == '20302'
assert capacity(before) == (35000, 35000)

select(before['buildings'][7])
upgrade_click()
shot('unsupported-architect')
assert read('unsupported-architect') == before
start()

select(before['buildings'][2])
upgrade_click()
upgrade_click()
shot('store-need-city3')
assert read('store-need-city3') == before
start()

select(before['buildings'][0])
city = confirm_upgrade('city')
assert city['resources'] == {'gold': 16000, 'wood': 20000}
job = city['buildings'][0]['upgrade']
assert job['target'] == '20103' and job['ends'] - job['started'] == 3600
start()

select(city['buildings'][5])
upgrade_click()
upgrade_click()
shot('worker-busy')
assert read('worker-busy') == city

advance_job(city, 0)
start()
select(city['buildings'][0])
shot('city-complete')
city_done = read('city-complete')
assert city_done['buildings'][0]['type'] == '20103' and 'upgrade' not in city_done['buildings'][0]
assert capacity(city_done) == (35000, 35000)
start()

select(city_done['buildings'][1])
well = confirm_upgrade('well')
assert well['resources'] == {'gold': 14600, 'wood': 20000}
well_job = well['buildings'][1]['upgrade']
assert well_job['target'] == '20203' and well_job['ends'] - well_job['started'] == 900
# Upgrade freezes the live producer amount; natural growth since the fixture
# was written can raise it above the seeded 50.
assert 50 <= well['production']['building-1']['stored'] <= 1000

advance_job(well, 1)
start()
select(well['buildings'][1])
shot('well-complete')
well_done = read('well-complete')
assert well_done['buildings'][1]['type'] == '20203'
assert 'upgrade' not in well_done['buildings'][1]
start()

select(well_done['buildings'][2])
sun = confirm_upgrade('sun-store')
assert sun['resources'] == {'gold': 4600, 'wood': 20000}
sun_job = sun['buildings'][2]['upgrade']
assert sun_job['target'] == '20303' and sun_job['ends'] - sun_job['started'] == 1200

advance_job(sun, 2)
start()
select(sun['buildings'][2])
shot('sun-store-complete')
sun_done = read('sun-store-complete')
assert sun_done['buildings'][2]['type'] == '20303'
assert capacity(sun_done) == (35000, 45000)
start()

select(sun_done['buildings'][5])
nest = confirm_upgrade('nest')
assert nest['resources'] == {'gold': 4600, 'wood': 19001}
nest_job = nest['buildings'][5]['upgrade']
assert nest_job['target'] == '20602' and nest_job['ends'] - nest_job['started'] == 900

advance_job(nest, 5)
start()
select(nest['buildings'][5])
shot('nest-complete')
nest_done = read('nest-complete')
assert nest_done['buildings'][5]['type'] == '20602'
start()

select(nest_done['buildings'][4])
gold = confirm_upgrade('gold-store')
assert gold['resources'] == {'gold': 4600, 'wood': 9001}
gold_job = gold['buildings'][4]['upgrade']
assert gold_job['target'] == '20503' and gold_job['ends'] - gold_job['started'] == 1200

advance_job(gold, 4)
start()
select(gold['buildings'][4])
shot('gold-store-complete')
done = read('gold-store-complete')
assert done['buildings'][4]['type'] == '20503'
assert capacity(done) == (45000, 45000)
start()

select(done['buildings'][6])
train = confirm_upgrade('train')
assert train['resources'] == {'gold': 4600, 'wood': 6413}
train_job = train['buildings'][6]['upgrade']
assert train_job['target'] == '20702' and train_job['ends'] - train_job['started'] == 3600

advance_job(train, 6)
start()
select(train['buildings'][6])
shot('train-complete')
final = read('train-complete')
assert final['buildings'][6]['type'] == '20702'
assert capacity(final) == (45000, 45000)
start()

tap(55, 35)
tap(640, 470)
time.sleep(6)
assert read('reenter') == final

log = adb('logcat', '-d').decode('utf-8', errors='replace')
(W / 'level3-validation.log').write_text(log, encoding='utf-8')
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
(W / 'level3-validation.json').write_text(
    json.dumps(
        {
            'passed': True,
            'fixtureKey': KEY,
            'syntheticResources': True,
            'duration': (
                'original durations preserved; completion verified by rewriting '
                'started/ends into the past after force-stop (3600/900/1200/900/1200/3600)'
            ),
            'checks': [
                'architect unsupported',
                'storage needs city lv3',
                'city 2->3 gold debit 4000 / 3600s',
                'single worker',
                'well 2->3 gold debit 1400 / 900s',
                'sun store 2->3 gold debit 10000 / 1200s',
                'capacity wood 35000->45000',
                'nest 1->2 wood debit 999 / 900s',
                'gold store 2->3 wood debit 10000 / 1200s',
                'capacity gold 35000->45000',
                'training 1->2 wood debit 2588 / 3600s',
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
print('Level3 fixture validation passed', flush=True)
