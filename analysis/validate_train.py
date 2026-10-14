"""Validate the local training queue (fixture run).

Fixture key: dino.local.city.v9.validation-20261012
Normal key : dino.local.city.v9  (read before/after, must not change)

Covers:
  1. start training: cost deducted per the original 114-family table
  2. countdown equals the original train_time
  3. one job per barracks (egg slot busy)
  4. soldier capacity limit (207 item_storage)
  5. completion moves one soldier into soldiers[] on the same barracks
  6. offline completion across force-stop (duration kept, moved into the past)
  7. restart persistence of soldiers[] and an empty training queue
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
KEY = 'dino.local.city.v9.validation-20261012'
NORMAL = 'dino.local.city.v9'
DB = f'/data/data/{PKG}/databases/jsb.sqlite'
records = []

# Original table facts for the 114 family (analysis/train-native-configs.json).
TRAIN = {
    '11401': {'cost': 50, 'time': 20},
    '11402': {'cost': 100, 'time': 30},
    '11403': {'cost': 150, 'time': 40},
    '11404': {'cost': 200, 'time': 50},
    '11405': {'cost': 300, 'time': 60},
    '11406': {'cost': 400, 'time': 70},
    '11407': {'cost': 500, 'time': 80},
    '11408': {'cost': 600, 'time': 90},
    '11409': {'cost': 700, 'time': 100},
    '11410': {'cost': 800, 'time': 120},
}
ITEM_STORAGE = {
    '20701': 10, '20702': 15, '20703': 20, '20704': 25,
    '20705': 30, '20706': 35, '20707': 40, '20708': 45,
}
BAR = 6  # building-6 is the 207 barracks in the normal save
preserved_normal = None


def adb(*args):
    p = subprocess.run(ADB + list(args), capture_output=True)
    if p.returncode:
        raise RuntimeError(str(args) + p.stderr.decode('utf-8', errors='replace'))
    return p.stdout


def tap(x, y, pause=0.8):
    adb('shell', 'input', 'tap', str(x), str(y))
    time.sleep(pause)


def shot(name):
    adb('shell', 'screencap', '-p', '/sdcard/train-validation.png')
    adb('pull', '/sdcard/train-validation.png', str(W / ('train-verified-' + name + '.png')))


def read_rows():
    folder = W / ('train-db-tmp-' + str(time.time_ns()))
    folder.mkdir(parents=True, exist_ok=True)
    for suffix in ['', '-wal']:
        (folder / ('jsb.sqlite' + suffix)).write_bytes(adb('exec-out', 'cat', DB + suffix))
    db = sqlite3.connect(folder / 'jsb.sqlite')
    try:
        return dict(db.execute('select key,value from data'))
    finally:
        db.close()


def write_db(rows_update, check=True):
    adb('shell', 'am', 'force-stop', PKG)
    time.sleep(1)
    folder = W / 'train-db-write'
    folder.mkdir(exist_ok=True)
    db_path = folder / 'jsb.sqlite'
    for suffix in ['', '-wal']:
        (folder / ('jsb.sqlite' + suffix)).write_bytes(adb('exec-out', 'cat', DB + suffix))
    with sqlite3.connect(db_path) as db:
        db.execute('PRAGMA wal_checkpoint(FULL)')
        if check:
            rows = dict(db.execute('select key,value from data'))
            assert rows.get(NORMAL) == preserved_normal, 'normal save changed before rewrite'
        for k, v in rows_update.items():
            db.execute('insert or replace into data(key,value) values(?,?)', (k, v))
        db.commit()
        db.execute('PRAGMA wal_checkpoint(FULL)')
    adb('push', str(db_path), '/data/local/tmp/jsb-train.sqlite')
    adb('shell', 'cp', '/data/local/tmp/jsb-train.sqlite', DB)
    adb('shell', 'rm', '-f', DB + '-wal', DB + '-shm')


def write_state(state):
    write_db({KEY: json.dumps(state, separators=(',', ':'))})


def read(name):
    adb('shell', 'am', 'force-stop', PKG)
    time.sleep(1.5)
    rows = read_rows()
    if preserved_normal is not None:
        assert rows.get(NORMAL) == preserved_normal, 'normal save changed during fixture run'
    state = json.loads(rows[KEY])
    records.append({'step': name, 'state': state})
    (W / 'train-validation-progress.json').write_text(
        json.dumps(records, indent=2), encoding='utf-8')
    print('%-22s rev=%-4s wood=%-6s training=%s soldiers=%s' % (
        name, state['revision'], state['resources']['wood'],
        state.get('training'), state.get('soldiers')), flush=True)
    return state


def start():
    adb('shell', 'am', 'force-stop', PKG)
    adb('shell', 'am', 'start', '-n', PKG + '/' + PKG + '.AdvanceDino')
    time.sleep(4)
    tap(640, 470)
    time.sleep(6)


def select(b):
    tap(round((b['x'] - 1916) * 0.45 * 1280 / 1136 + 640),
        round(360 - (b['y'] + 90 - 1406) * 0.45 * 720 / 639))


def train_click():
    tap(1150, 697, pause=1.2)


def back():
    tap(55, 35, pause=1.0)


checks = []


def check(name, ok, detail=''):
    checks.append({'check': name, 'passed': bool(ok), 'detail': str(detail)})
    print(('  PASS ' if ok else '  FAIL ') + name + (' :: ' + str(detail) if detail else ''),
          flush=True)
    assert ok, (name, detail)


# ---------------------------------------------------------------- install
# 1. Launch the DELIVERY package once so it migrates v8 -> the normal v9 key.
adb('push', str(ROOT / 'dino-local-train.apk'), '/data/local/tmp/dino-local-train.apk')
adb('shell', 'pm', 'install', '-r', '/data/local/tmp/dino-local-train.apk')
adb('shell', 'rm', '-f', '/data/local/tmp/dino-boot.js', '/data/local/tmp/dino-command.js')
adb('logcat', '-c')
start()
rows = read_rows()
assert NORMAL in rows, 'delivery v9 save missing after first launch'
preserved_normal = rows[NORMAL]
initial = json.loads(preserved_normal)
records.append({'step': 'normal-baseline', 'state': initial})
barracks = initial['buildings'][BAR]

# 2. Switch to the fixture package and drop any fixture key left by an earlier
#    run, so migration starts from the normal save deterministically.
adb('push', str(W / 'dino-train-validation.apk'), '/data/local/tmp/dino-train-validation.apk')
adb('shell', 'pm', 'install', '-r', '/data/local/tmp/dino-train-validation.apk')
adb('shell', 'am', 'force-stop', PKG)
time.sleep(1)
folder = W / 'train-db-clean'
folder.mkdir(exist_ok=True)
db_path = folder / 'jsb.sqlite'
for suffix in ['', '-wal']:
    (folder / ('jsb.sqlite' + suffix)).write_bytes(adb('exec-out', 'cat', DB + suffix))
with sqlite3.connect(db_path) as db:
    db.execute('PRAGMA wal_checkpoint(FULL)')
    db.execute('delete from data where key = ?', (KEY,))
    db.commit()
    db.execute('PRAGMA wal_checkpoint(FULL)')
adb('push', str(db_path), '/data/local/tmp/jsb-train-clean.sqlite')
adb('shell', 'cp', '/data/local/tmp/jsb-train-clean.sqlite', DB)
adb('shell', 'rm', '-f', DB + '-wal', DB + '-shm')
check('barracks is 207 family', barracks['type'].startswith('207'), barracks['type'])
bar_lv = int(barracks['type'][3:])
check('barracks level matches fixture plan', bar_lv == 3, bar_lv)
cap = ITEM_STORAGE[barracks['type']]
start_typeid = '114%02d' % bar_lv
check('start soldier is table level 114%02d' % bar_lv, start_typeid in TRAIN, start_typeid)

# --------------------------------------------------- fixture: wood + empty queue
fx = json.loads(preserved_normal)
fx['resources']['wood'] = 5000
fx['resources']['gold'] = 1000
fx['training'] = {}
fx['soldiers'] = {}
fx['revision'] = 100
write_db({KEY: json.dumps(fx, separators=(',', ':'))}, check=True)

# ------------------------------------------------------- 1+2: start training
start()
select(barracks)
shot('train-selected')
train_click()
shot('train-started')
s1 = read('train-started')
job = s1['training'].get(barracks['uid'])
check('training job created', bool(job), s1['training'])
check('job typeid is table level '+start_typeid, job['typeid'] == start_typeid, job['typeid'])
spec = TRAIN[start_typeid]
check('cost deducted per original table',
      s1['resources']['wood'] == 5000 - spec['cost'],
      '%s -> %s (expected %s)' % (5000, s1['resources']['wood'], 5000 - spec['cost']))
check('countdown equals original train_time',
      job['ends'] - job['started'] == spec['time'],
      '%s vs %s' % (job['ends'] - job['started'], spec['time']))
check('revision advanced', s1['revision'] == 101, s1['revision'])

# --------------------------------------------- 3: one job per barracks (egg slot)
train_click()
s2 = read('train-second-click')
check('second click while busy is refused (single egg slot)',
      set(s2['training'].keys()) == {barracks['uid']}
      and s2['resources']['wood'] == s1['resources']['wood']
      and s2['revision'] == s1['revision'],
      'wood=%s rev=%s' % (s2['resources']['wood'], s2['revision']))

# ------------------------------------- 4: soldier capacity limit (item_storage)
capped = json.loads(json.dumps(s1))
capped['soldiers'] = {barracks['uid']: cap}
capped['training'] = {}
capped['resources']['wood'] = 5000
capped['revision'] += 1
write_state(capped)
start()
select(barracks)
shot('train-capacity-full')
train_click()
s3 = read('train-capacity-full')
check('training refused when soldiers reach item_storage',
      not s3['training'] and s3['resources']['wood'] == 5000
      and s3['revision'] == capped['revision'],
      'cap=%s wood=%s rev=%s' % (cap, s3['resources']['wood'], s3['revision']))

# ------------------------------------------ 5: completion into soldiers[]
done = json.loads(json.dumps(s1))
job = done['training'][barracks['uid']]
job['ends'] = int(time.time()) - 5
job['started'] = job['ends'] - spec['time']
done['soldiers'] = {barracks['uid']: 2}
done['revision'] += 1
write_state(done)
start()
s4 = read('train-complete')
check('job removed after completion', not s4['training'], s4['training'])
check('one soldier added on the same barracks',
      s4.get('soldiers', {}).get(barracks['uid']) == 3,
      s4.get('soldiers'))

# --------------------------------------- 6: offline completion across restart
off = json.loads(json.dumps(s1))
job = off['training'][barracks['uid']]
job['ends'] = int(time.time()) - 5
job['started'] = job['ends'] - spec['time']
off['soldiers'] = {}
off['revision'] += 1
write_state(off)
start()
shot('train-offline-complete')
s5 = read('train-offline-complete')
check('offline job completed after force-stop', not s5['training'], s5['training'])
check('offline completion credited one soldier',
      s5.get('soldiers', {}).get(barracks['uid']) == 1, s5.get('soldiers'))

# ------------------------------------------------- 7: restart persistence
start()
s6 = read('train-restart')
check('soldiers persist across restart',
      s6.get('soldiers', {}).get(barracks['uid']) == 1, s6.get('soldiers'))
check('training queue stays empty after restart', not s6['training'], s6['training'])

# ------------------------------------------------------- normal key untouched
adb('shell', 'am', 'force-stop', PKG)
time.sleep(1)
rows = read_rows()
check('normal delivery save unchanged by fixture run',
      rows.get(NORMAL) == preserved_normal, 'revision drift')

# ------------------------------------------------------------- logcat sanity
log = adb('logcat', '-d').decode('utf-8', errors='replace')
(W / 'train-validation.log').write_text(log, encoding='utf-8')
bad = [l for l in log.splitlines() if any(
    x in l for x in ['FATAL EXCEPTION', 'TypeError:', 'ReferenceError:',
                     'DinoLocal save failed'])]
# Only the game process matters: the emulator's own `cmd` helper periodically
# SIGSEGVs during pm/am calls and is unrelated to this build.
crash = [l for l in log.splitlines()
         if 'Fatal signal' in l and 'com.netease.h1.qihoo' in l]
check('no script crash in logcat', not bad, bad[:3])
check('no game process crash', not crash, crash[:2])
check('delivery status logged', 'local-train-ready' in log or 'local entry scene ready' in log)
# The status line must show training state, never the scheduler error text.
check('no scheduler error surfaced in UI',
      'DinoLocal update failed' not in log,
      [l for l in log.splitlines() if 'DinoLocal update failed' in l][:2])

report = {
    'passed': all(c['passed'] for c in checks),
    'apk': 'dino-train-validation.apk',
    'fixtureKey': KEY,
    'normalKey': NORMAL,
    'barracks': barracks,
    'soldierCapacity': cap,
    'startSoldier': start_typeid,
    'tableCost': spec['cost'],
    'tableTime': spec['time'],
    'checks': checks,
    'records': records,
}
(W / 'train-validation.json').write_text(
    json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print('\nTraining validation PASSED: %s checks' % len(checks))
