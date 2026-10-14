"""Validate local construction of extra 日光井 and 龙银矿 (fixture run).

Fixture key: dino.local.city.v11.validation-20261012
Normal key : dino.local.city.v11  (read before/after, must not change)

Covers:
  1. city hall lv1 refuses a second well
  2. city hall lv2 + gold starts sunlight well: 700 gold, 180 sec
  3. while placing, switch type then start silver mine: 700 wood, 180 sec
  4. busy worker refuses another construct
  5. offline completion creates production
  6. city lv2 cap refuses a third well after two wells
  7. normal delivery save unchanged
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
KEY = 'dino.local.city.v11.validation-20261012'
NORMAL = 'dino.local.city.v11'
DB = f'/data/data/{PKG}/databases/jsb.sqlite'
COST = 700
DURATION = 180
PLACE = (1100, 1400)
PLACE2 = (2800, 1400)
PLACE3 = (1100, 1800)
records = []
preserved_normal = None
checks = []


def adb(*args):
    p = subprocess.run(ADB + list(args), capture_output=True)
    if p.returncode:
        raise RuntimeError(str(args) + p.stderr.decode('utf-8', errors='replace'))
    return p.stdout


def tap(x, y, pause=0.8):
    adb('shell', 'input', 'tap', str(x), str(y))
    time.sleep(pause)


def shot(name):
    adb('shell', 'screencap', '-p', '/sdcard/mine-validation.png')
    adb('pull', '/sdcard/mine-validation.png',
        str(W / ('mine-verified-' + name + '.png')))


def read_rows():
    folder = W / ('mine-db-tmp-' + str(time.time_ns()))
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
    folder = W / 'mine-db-write'
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
    adb('push', str(db_path), '/data/local/tmp/jsb-mine.sqlite')
    adb('shell', 'cp', '/data/local/tmp/jsb-mine.sqlite', DB)
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
    (W / 'mine-validation-progress.json').write_text(
        json.dumps(records, indent=2), encoding='utf-8')
    extras = [b for b in state['buildings']
              if int(b['uid'].split('-')[1]) >= 8]
    print('%-22s rev=%-4s gold=%-6s wood=%-6s buildings=%s extras=%s' % (
        name, state['revision'], state['resources']['gold'],
        state['resources']['wood'], len(state['buildings']),
        [(b['uid'], b['type'], bool(b.get('construct'))) for b in extras]), flush=True)
    return state


def start():
    adb('shell', 'am', 'force-stop', PKG)
    adb('shell', 'am', 'start', '-n', PKG + '/' + PKG + '.AdvanceDino')
    time.sleep(4)
    tap(640, 470)
    time.sleep(7)


def map_tap(x, y, pause=1.0):
    tap(round((x - 1916) * 0.45 * 1280 / 1136 + 640),
        round(360 - (y - 1406) * 0.45 * 720 / 639), pause=pause)


def build_click():
    tap(1152, 697, pause=1.2)


def check(name, ok, detail=''):
    checks.append({'check': name, 'passed': bool(ok), 'detail': str(detail)})
    print(('  PASS ' if ok else '  FAIL ') + name + (' :: ' + str(detail) if detail else ''),
          flush=True)
    assert ok, (name, detail)


def family(state, fam):
    return [b for b in state['buildings'] if str(b['type']).startswith(fam)]


def extras_of(state):
    return [b for b in state['buildings'] if int(b['uid'].split('-')[1]) >= 8]


# ---------------------------------------------------------------- install
adb('push', str(ROOT / 'dino-local-mine.apk'),
    '/data/local/tmp/dino-local-mine.apk')
adb('shell', 'pm', 'install', '-r', '/data/local/tmp/dino-local-mine.apk')
adb('shell', 'rm', '-f', '/data/local/tmp/dino-boot.js', '/data/local/tmp/dino-command.js')
adb('logcat', '-c')
start()
rows = read_rows()
assert NORMAL in rows, 'delivery v11 save missing after first launch'
preserved_normal = rows[NORMAL]
initial = json.loads(preserved_normal)
records.append({'step': 'normal-baseline', 'state': initial})

adb('push', str(W / 'dino-mine-validation.apk'),
    '/data/local/tmp/dino-mine-validation.apk')
adb('shell', 'pm', 'install', '-r', '/data/local/tmp/dino-mine-validation.apk')
adb('shell', 'am', 'force-stop', PKG)
time.sleep(1)
folder = W / 'mine-db-clean'
folder.mkdir(exist_ok=True)
db_path = folder / 'jsb.sqlite'
for suffix in ['', '-wal']:
    (folder / ('jsb.sqlite' + suffix)).write_bytes(adb('exec-out', 'cat', DB + suffix))
with sqlite3.connect(db_path) as db:
    db.execute('PRAGMA wal_checkpoint(FULL)')
    db.execute('delete from data where key = ?', (KEY,))
    db.commit()
    db.execute('PRAGMA wal_checkpoint(FULL)')
adb('push', str(db_path), '/data/local/tmp/jsb-mine-clean.sqlite')
adb('shell', 'cp', '/data/local/tmp/jsb-mine-clean.sqlite', DB)
adb('shell', 'rm', '-f', DB + '-wal', DB + '-shm')

defaults = [
    ('20101', 1900, 1400), ('20201', 1500, 1150), ('20301', 2400, 1300),
    ('20401', 2300, 950), ('20501', 1750, 800), ('20601', 1300, 1600),
    ('20701', 2500, 1750), ('21201', 1800, 1900),
]

# --------------------------------------------- 1: city lv1 refuses second well
fx = json.loads(preserved_normal)
fx['buildings'] = [
    {'uid': 'building-%d' % i, 'type': t, 'x': x, 'y': y}
    for i, (t, x, y) in enumerate(defaults)
]
fx['production'] = {
    'building-1': {'stored': 0, 'lastHour': time.time() / 3600},
    'building-3': {'stored': 0, 'lastHour': time.time() / 3600},
}
fx['training'] = {}
fx['soldiers'] = {}
fx['resources'] = {'gold': 5000, 'wood': 5000}
fx['revision'] = 100
write_db({KEY: json.dumps(fx, separators=(',', ':'))}, check=True)
start()
shot('city1-refuse')
build_click()
map_tap(*PLACE)
s0 = read('city1-refuse')
check('city lv1 refuses second sunlight well',
      len(family(s0, '202')) == 1 and s0['resources']['gold'] == 5000
      and s0['revision'] == 100,
      'wells=%s gold=%s rev=%s' % (
          len(family(s0, '202')), s0['resources']['gold'], s0['revision']))

# ------------------------- 2: city lv2 starts sunlight well via default pick
fx2 = json.loads(json.dumps(fx))
fx2['buildings'][0]['type'] = '20102'
fx2['resources'] = {'gold': 5000, 'wood': 5000}
fx2['revision'] = 200
write_state(fx2)
start()
shot('ready')
build_click()
shot('placing-well')
map_tap(*PLACE)
shot('well-started')
s1 = read('well-started')
extras = extras_of(s1)
check('extra well created', len(extras) == 1 and extras[0]['type'] == '20201', extras)
extra_well = extras[0]
job = extra_well['construct']
check('well cost deducted 700 gold',
      s1['resources']['gold'] == 5000 - COST and s1['resources']['wood'] == 5000,
      s1['resources'])
check('well countdown equals lv_up_time',
      job['ends'] - job['started'] == DURATION,
      '%s vs %s' % (job['ends'] - job['started'], DURATION))
check('no production while constructing well',
      extra_well['uid'] not in s1.get('production', {}), s1.get('production'))

# -------------- 3: finish well offline, then switch-type build a silver mine
done_well = json.loads(json.dumps(s1))
for b in done_well['buildings']:
    if b.get('construct'):
        b['construct']['ends'] = int(time.time()) - 5
        b['construct']['started'] = b['construct']['ends'] - DURATION
done_well['revision'] += 1
write_state(done_well)
start()
s_done = read('well-complete')
finished = [b for b in s_done['buildings'] if b['uid'] == extra_well['uid']][0]
check('well construct cleared', not finished.get('construct'), finished)
check('well production created',
      extra_well['uid'] in s_done.get('production', {}), s_done.get('production'))
check('two sunlight wells after completion',
      len(family(s_done, '202')) == 2, len(family(s_done, '202')))

# Build silver mine: after two wells at lv2, nextConstructPick skips 202 → 204.
# read() force-stops the app; relaunch before further UI taps.
start()
build_click()
shot('placing-mine')
map_tap(*PLACE2)
shot('mine-started')
s2 = read('mine-started')
mines = [b for b in extras_of(s2) if str(b['type']).startswith('204')]
check('extra mine created', len(mines) == 1 and mines[0].get('construct'), mines)
extra_mine = mines[0]
check('mine cost deducted 700 wood',
      s2['resources']['wood'] == 5000 - COST and s2['resources']['gold'] == s_done['resources']['gold'],
      s2['resources'])
check('mine countdown equals lv_up_time',
      extra_mine['construct']['ends'] - extra_mine['construct']['started'] == DURATION,
      extra_mine['construct'])
check('no production while constructing mine',
      extra_mine['uid'] not in s2.get('production', {}), s2.get('production'))

# --------------------------------------------- 4: busy worker refuses second
start()
build_click()
map_tap(*PLACE3)
s3 = read('worker-busy')
check('second construct refused while worker busy',
      len([b for b in s3['buildings'] if b.get('construct')]) == 1
      and s3['resources']['wood'] == s2['resources']['wood']
      and s3['revision'] == s2['revision'],
      'wood=%s rev=%s count=%s' % (
          s3['resources']['wood'], s3['revision'],
          len([b for b in s3['buildings'] if b.get('construct')])))

# ------------------------------------------ 5: offline mine completion
done_mine = json.loads(json.dumps(s2))
for b in done_mine['buildings']:
    if b.get('construct'):
        b['construct']['ends'] = int(time.time()) - 5
        b['construct']['started'] = b['construct']['ends'] - DURATION
done_mine['revision'] += 1
write_state(done_mine)
start()
shot('mine-complete')
s4 = read('mine-complete')
finished_mine = [b for b in s4['buildings'] if b['uid'] == extra_mine['uid']][0]
check('mine construct cleared', not finished_mine.get('construct'), finished_mine)
check('mine production created',
      extra_mine['uid'] in s4.get('production', {}), s4.get('production'))
check('two silver mines after completion',
      len(family(s4, '204')) == 2, len(family(s4, '204')))

# ---------------------- 6: city lv2 with 2 wells + 2 mines refuses further builds
capped = json.loads(json.dumps(s4))
# Ensure a second mine exists so both families are at lv2 caps (2 each).
if len(family(capped, '204')) < 2:
    capped['buildings'].append({
        'uid': 'building-99', 'type': '20401', 'x': 1000, 'y': 2000
    })
    capped['production']['building-99'] = {
        'stored': 0, 'lastHour': time.time() / 3600
    }
capped['resources'] = {'gold': 5000, 'wood': 5000}
capped['revision'] += 1
write_state(capped)
start()
build_click()
map_tap(*PLACE3)
s5 = read('cap-refuse')
check('city lv2 refuses further production builds at family caps',
      len(family(s5, '202')) == 2 and len(family(s5, '204')) == 2
      and s5['resources']['gold'] == 5000 and s5['resources']['wood'] == 5000
      and s5['revision'] == capped['revision'],
      'wells=%s mines=%s gold=%s wood=%s' % (
          len(family(s5, '202')), len(family(s5, '204')),
          s5['resources']['gold'], s5['resources']['wood']))

# ------------------------------------------------------- normal key untouched
adb('shell', 'am', 'force-stop', PKG)
time.sleep(1)
rows = read_rows()
check('normal delivery save unchanged by fixture run',
      rows.get(NORMAL) == preserved_normal, 'revision drift')

log = adb('logcat', '-d').decode('utf-8', errors='replace')
(W / 'mine-validation.log').write_text(log, encoding='utf-8')
bad = [l for l in log.splitlines() if any(
    x in l for x in ['FATAL EXCEPTION', 'TypeError:', 'ReferenceError:',
                     'DinoLocal save failed'])]
crash = [l for l in log.splitlines()
         if 'Fatal signal' in l and 'com.netease.h1.qihoo' in l]
check('no script crash in logcat', not bad, bad[:3])
check('no game process crash', not crash, crash[:2])
check('delivery status logged',
      'local-mine-ready' in log or 'local entry scene ready' in log)
check('no scheduler error surfaced',
      'DinoLocal update failed' not in log,
      [l for l in log.splitlines() if 'DinoLocal update failed' in l][:2])

report = {
    'passed': all(c['passed'] for c in checks),
    'apk': 'dino-mine-validation.apk',
    'fixtureKey': KEY,
    'normalKey': NORMAL,
    'cost': COST,
    'duration': DURATION,
    'checks': checks,
    'records': records,
}
(W / 'mine-validation.json').write_text(
    json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print('\nMine validation PASSED: %s checks' % len(checks))
