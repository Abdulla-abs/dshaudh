"""Validate level-5 economy upgrades plus nest/training level-4 upgrades."""
from pathlib import Path
import json
import sqlite3
import subprocess
import time

ROOT = Path(__file__).resolve().parent.parent
W = ROOT / 'analysis'
ADB = [r'F:\Android\Sdk\platform-tools\adb.exe', '-s', '127.0.0.1:21513']
PKG = 'com.netease.h1.qihoo'
KEY = 'dino.local.city.v7.validation-20261012'
DB = f'/data/data/{PKG}/databases/jsb.sqlite'
records = []
fixture = json.loads((W / 'level5-test-fixture.json').read_text(encoding='utf-8-sig'))

STORAGE = {
    '20101': (20000, 20000),
    '20102': (20000, 20000),
    '20103': (20000, 20000),
    '20104': (20000, 20000),
    '20105': (20000, 20000),
    '20301': (0, 5000),
    '20302': (0, 15000),
    '20303': (0, 25000),
    '20304': (0, 40000),
    '20305': (0, 60000),
    '20501': (5000, 0),
    '20502': (15000, 0),
    '20503': (25000, 0),
    '20504': (40000, 0),
    '20505': (60000, 0),
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
    adb('shell', 'screencap', '-p', '/sdcard/level5-validation.png')
    adb('pull', '/sdcard/level5-validation.png', str(W / ('level5-verified-' + name + '.png')))


def capacity(state):
    gold = wood = 0
    for b in state['buildings']:
        g, w = STORAGE.get(b['type'], (0, 0))
        gold += g
        wood += w
    return gold, wood


def read_rows():
    folder = W / ('level5-db-tmp-' + str(time.time_ns()))
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


def write_db(rows_update, check_preserved=True):
    adb('shell', 'am', 'force-stop', PKG)
    time.sleep(1)
    folder = W / 'level5-db-write'
    folder.mkdir(exist_ok=True)
    db_path = folder / 'jsb.sqlite'
    for suffix in ['', '-wal']:
        (folder / ('jsb.sqlite' + suffix)).write_bytes(
            adb('exec-out', 'cat', DB + suffix)
        )
    with sqlite3.connect(db_path) as db:
        db.execute('PRAGMA wal_checkpoint(FULL)')
        rows = dict(db.execute('select key,value from data'))
        if check_preserved:
            for k, v in fixture['preserved'].items():
                assert rows.get(k) == v, ('Normal save changed before rewrite', k)
        for k, v in rows_update.items():
            db.execute('insert or replace into data(key,value) values(?,?)', (k, v))
        db.commit()
        db.execute('PRAGMA wal_checkpoint(FULL)')
    adb('push', str(db_path), '/data/local/tmp/jsb-level5.sqlite')
    adb('shell', 'cp', '/data/local/tmp/jsb-level5.sqlite', DB)
    adb('shell', 'rm', '-f', DB + '-wal', DB + '-shm')


def write_state(state):
    write_db({KEY: json.dumps(state, separators=(',', ':'))}, check_preserved=True)


def seed_fixture():
    """Install preserved baseline keys and the validation fixture."""
    updates = dict(fixture['preserved'])
    updates[KEY] = json.dumps(fixture['fixture'], separators=(',', ':'))
    write_db(updates, check_preserved=False)


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
    adb('shell', 'am', 'force-stop', PKG)
    time.sleep(1.5)
    rows = read_rows()
    for k, v in fixture['preserved'].items():
        assert rows.get(k) == v, ('Normal save changed', k)
    state = json.loads(rows[KEY])
    records.append({'step': name, 'state': state, 'capacity': capacity(state)})
    (W / 'level5-validation-progress.json').write_text(json.dumps(records, indent=2), encoding='utf-8')
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
    upgrade_click()
    shot(name_prefix + '-cost')
    upgrade_click()
    shot(name_prefix + '-start')
    return read(name_prefix + '-start')


adb('push', str(W / 'dino-level5-validation.apk'), '/data/local/tmp/dino-level5-validation.apk')
adb('shell', 'pm', 'install', '-r', '/data/local/tmp/dino-level5-validation.apk')
adb('shell', 'rm', '-f', '/data/local/tmp/dino-boot.js', '/data/local/tmp/dino-command.js')
adb('logcat', '-c')
# Ensure the SQLite database exists, then inject the validation fixture.
start()
time.sleep(2)
adb('shell', 'am', 'force-stop', PKG)
time.sleep(1)
seed_fixture()
start()
before = read('initial')
start()
shot('initial')
assert before['buildings'][0]['type'] == '20104'
assert before['buildings'][2]['type'] == '20304'
assert before['buildings'][5]['type'] == '20603'
assert before['buildings'][6]['type'] == '20703'
assert capacity(before) == (60000, 60000)

select(before['buildings'][7])
upgrade_click()
shot('unsupported-architect')
assert read('unsupported-architect') == before
start()

select(before['buildings'][0])
city = confirm_upgrade('city')
assert city['resources'] == {'gold': 50000, 'wood': 160000}
job = city['buildings'][0]['upgrade']
assert job['target'] == '20105' and job['ends'] - job['started'] == 86400
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
assert city_done['buildings'][0]['type'] == '20105' and 'upgrade' not in city_done['buildings'][0]
assert capacity(city_done) == (60000, 60000)
start()

select(city_done['buildings'][1])
well = confirm_upgrade('well')
assert well['resources'] == {'gold': 43000, 'wood': 160000}
well_job = well['buildings'][1]['upgrade']
assert well_job['target'] == '20205' and well_job['ends'] - well_job['started'] == 14400
assert 50 <= well['production']['building-1']['stored'] <= 2500

advance_job(well, 1)
start()
select(well['buildings'][1])
shot('well-complete')
well_done = read('well-complete')
assert well_done['buildings'][1]['type'] == '20205'
assert 'upgrade' not in well_done['buildings'][1]
start()

select(well_done['buildings'][3])
mine = confirm_upgrade('mine')
assert mine['resources'] == {'gold': 43000, 'wood': 153000}
mine_job = mine['buildings'][3]['upgrade']
assert mine_job['target'] == '20405' and mine_job['ends'] - mine_job['started'] == 14400

advance_job(mine, 3)
start()
select(mine['buildings'][3])
shot('mine-complete')
mine_done = read('mine-complete')
assert mine_done['buildings'][3]['type'] == '20405'
start()

select(mine_done['buildings'][2])
sun = confirm_upgrade('sun-store')
assert sun['resources'] == {'gold': 13000, 'wood': 153000}
sun_job = sun['buildings'][2]['upgrade']
assert sun_job['target'] == '20305' and sun_job['ends'] - sun_job['started'] == 21600

advance_job(sun, 2)
start()
select(sun['buildings'][2])
shot('sun-store-complete')
sun_done = read('sun-store-complete')
assert sun_done['buildings'][2]['type'] == '20305'
assert capacity(sun_done) == (60000, 80000)
start()

select(sun_done['buildings'][5])
nest = confirm_upgrade('nest')
assert nest['resources'] == {'gold': 13000, 'wood': 134112}
nest_job = nest['buildings'][5]['upgrade']
assert nest_job['target'] == '20604' and nest_job['ends'] - nest_job['started'] == 7200

advance_job(nest, 5)
start()
select(nest['buildings'][5])
shot('nest-complete')
nest_done = read('nest-complete')
assert nest_done['buildings'][5]['type'] == '20604'
start()

select(nest_done['buildings'][4])
gold = confirm_upgrade('gold-store')
assert gold['resources'] == {'gold': 13000, 'wood': 104112}
gold_job = gold['buildings'][4]['upgrade']
assert gold_job['target'] == '20505' and gold_job['ends'] - gold_job['started'] == 21600

advance_job(gold, 4)
start()
select(gold['buildings'][4])
shot('gold-store-complete')
done = read('gold-store-complete')
assert done['buildings'][4]['type'] == '20505'
assert capacity(done) == (80000, 80000)
start()

select(done['buildings'][6])
train = confirm_upgrade('train')
assert train['resources'] == {'gold': 13000, 'wood': 4113}
train_job = train['buildings'][6]['upgrade']
assert train_job['target'] == '20704' and train_job['ends'] - train_job['started'] == 28800

advance_job(train, 6)
start()
select(train['buildings'][6])
shot('train-complete')
final = read('train-complete')
assert final['buildings'][6]['type'] == '20704'
assert capacity(final) == (80000, 80000)
start()

tap(55, 35)
tap(640, 470)
time.sleep(6)
assert read('reenter') == final

log = adb('logcat', '-d').decode('utf-8', errors='replace')
(W / 'level5-validation.log').write_text(log, encoding='utf-8')
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
(W / 'level5-validation.json').write_text(
    json.dumps(
        {
            'passed': True,
            'fixtureKey': KEY,
            'syntheticResources': True,
            'duration': (
                'original durations preserved; completion verified by rewriting '
                'started/ends into the past after force-stop '
                '(86400/14400/14400/21600/7200/21600/28800)'
            ),
            'checks': [
                'architect unsupported',
                'city 4->5 gold debit 150000 / 86400s',
                'single worker',
                'well 4->5 gold debit 7000 / 14400s',
                'mine 4->5 wood debit 7000 / 14400s',
                'sun store 4->5 gold debit 30000 / 21600s',
                'capacity wood 60000->80000',
                'nest 3->4 wood debit 18888 / 7200s',
                'gold store 4->5 wood debit 30000 / 21600s',
                'capacity gold 60000->80000',
                'training 3->4 wood debit 99999 / 28800s',
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
print('Level5 fixture validation passed', flush=True)
