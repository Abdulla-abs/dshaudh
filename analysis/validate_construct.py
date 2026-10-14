"""Validate local new-construction of an extra 日光井 (fixture run).

Fixture key: dino.local.city.v10.validation-20261012
Normal key : dino.local.city.v10  (read before/after, must not change)

Covers:
  1. city hall lv1 refuses a second well (build_number cap)
  2. city hall lv2 + gold starts construction: cost 700 gold, 180 sec
  3. busy worker refuses a second construct
  4. offline completion creates production and clears construct
  5. after two wells, further builds are refused at city lv2
  6. normal delivery save unchanged
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
KEY = 'dino.local.city.v10.validation-20261012'
NORMAL = 'dino.local.city.v10'
DB = f'/data/data/{PKG}/databases/jsb.sqlite'
COST = 700
DURATION = 180
# Map→screen uses the same transform as building select. y≈2100 lands in the
# top bar and is ignored; keep placement near the visible map center.
PLACE = (1100, 1400)
PLACE2 = (2800, 1400)
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
    adb('shell', 'screencap', '-p', '/sdcard/construct-validation.png')
    adb('pull', '/sdcard/construct-validation.png',
        str(W / ('construct-verified-' + name + '.png')))


def read_rows():
    folder = W / ('construct-db-tmp-' + str(time.time_ns()))
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
    folder = W / 'construct-db-write'
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
    adb('push', str(db_path), '/data/local/tmp/jsb-construct.sqlite')
    adb('shell', 'cp', '/data/local/tmp/jsb-construct.sqlite', DB)
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
    (W / 'construct-validation-progress.json').write_text(
        json.dumps(records, indent=2), encoding='utf-8')
    extras = [b for b in state['buildings'] if not b['uid'].startswith('building-')
              or int(b['uid'].split('-')[1]) >= 8]
    print('%-22s rev=%-4s gold=%-6s buildings=%s extras=%s' % (
        name, state['revision'], state['resources']['gold'],
        len(state['buildings']),
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


def family(state, fam='202'):
    return [b for b in state['buildings'] if str(b['type']).startswith(fam)]


# ---------------------------------------------------------------- install
adb('push', str(ROOT / 'dino-local-construct.apk'),
    '/data/local/tmp/dino-local-construct.apk')
adb('shell', 'pm', 'install', '-r', '/data/local/tmp/dino-local-construct.apk')
adb('shell', 'rm', '-f', '/data/local/tmp/dino-boot.js', '/data/local/tmp/dino-command.js')
adb('logcat', '-c')
start()
rows = read_rows()
assert NORMAL in rows, 'delivery v10 save missing after first launch'
preserved_normal = rows[NORMAL]
initial = json.loads(preserved_normal)
records.append({'step': 'normal-baseline', 'state': initial})

adb('push', str(W / 'dino-construct-validation.apk'),
    '/data/local/tmp/dino-construct-validation.apk')
adb('shell', 'pm', 'install', '-r', '/data/local/tmp/dino-construct-validation.apk')
adb('shell', 'am', 'force-stop', PKG)
time.sleep(1)
folder = W / 'construct-db-clean'
folder.mkdir(exist_ok=True)
db_path = folder / 'jsb.sqlite'
for suffix in ['', '-wal']:
    (folder / ('jsb.sqlite' + suffix)).write_bytes(adb('exec-out', 'cat', DB + suffix))
with sqlite3.connect(db_path) as db:
    db.execute('PRAGMA wal_checkpoint(FULL)')
    db.execute('delete from data where key = ?', (KEY,))
    db.commit()
    db.execute('PRAGMA wal_checkpoint(FULL)')
adb('push', str(db_path), '/data/local/tmp/jsb-construct-clean.sqlite')
adb('shell', 'cp', '/data/local/tmp/jsb-construct-clean.sqlite', DB)
adb('shell', 'rm', '-f', DB + '-wal', DB + '-shm')

# --------------------------------------------- 1: city lv1 refuses second well
fx = json.loads(preserved_normal)
# Reset to the fixed starter 8 with city lv1 and one lv1 sunlight well.
defaults = [
    ('20101', 1900, 1400), ('20201', 1500, 1150), ('20301', 2400, 1300),
    ('20401', 2300, 950), ('20501', 1750, 800), ('20601', 1300, 1600),
    ('20701', 2500, 1750), ('21201', 1800, 1900),
]
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
shot('construct-city1-refuse')
build_click()
map_tap(*PLACE)
s0 = read('city1-refuse')
check('city lv1 refuses second sunlight well',
      len(family(s0)) == 1 and s0['resources']['gold'] == 5000
      and s0['revision'] == 100,
      'wells=%s gold=%s rev=%s' % (len(family(s0)), s0['resources']['gold'], s0['revision']))

# --------------------------------- 2: city lv2 starts construction via UI
fx2 = json.loads(json.dumps(fx))
fx2['buildings'][0]['type'] = '20102'
fx2['resources']['gold'] = 5000
fx2['revision'] = 200
write_state(fx2)
start()
shot('construct-ready')
build_click()
shot('construct-placing')
map_tap(*PLACE)
shot('construct-started')
s1 = read('construct-started')
extras = [b for b in s1['buildings'] if b['uid'] not in
          {'building-%d' % i for i in range(8)}]
check('extra building created', len(extras) == 1, extras)
extra = extras[0]
check('extra is 20201 under construction',
      extra['type'] == '20201' and bool(extra.get('construct')), extra)
job = extra['construct']
check('cost deducted 700 gold',
      s1['resources']['gold'] == 5000 - COST, s1['resources']['gold'])
check('countdown equals original lv_up_time',
      job['ends'] - job['started'] == DURATION,
      '%s vs %s' % (job['ends'] - job['started'], DURATION))
check('no production while constructing',
      extra['uid'] not in s1.get('production', {}), s1.get('production'))
check('revision advanced', s1['revision'] == 201, s1['revision'])

# --------------------------------------------- 3: busy worker refuses second
build_click()
map_tap(*PLACE2)
s2 = read('worker-busy')
check('second construct refused while worker busy',
      len([b for b in s2['buildings'] if b.get('construct')]) == 1
      and s2['resources']['gold'] == s1['resources']['gold']
      and s2['revision'] == s1['revision'],
      'gold=%s rev=%s count=%s' % (
          s2['resources']['gold'], s2['revision'],
          len([b for b in s2['buildings'] if b.get('construct')])))

# ------------------------------------------ 4: offline completion
done = json.loads(json.dumps(s1))
for b in done['buildings']:
    if b.get('construct'):
        b['construct']['ends'] = int(time.time()) - 5
        b['construct']['started'] = b['construct']['ends'] - DURATION
done['revision'] += 1
write_state(done)
start()
shot('construct-complete')
s3 = read('construct-complete')
finished = [b for b in s3['buildings'] if b['uid'] == extra['uid']][0]
check('construct field cleared', not finished.get('construct'), finished)
check('production created on completion',
      extra['uid'] in s3.get('production', {}), s3.get('production'))
check('two sunlight wells after completion', len(family(s3)) == 2, len(family(s3)))

# -------------------------------- 5: city lv2 cap refuses a third well
capped = json.loads(json.dumps(s3))
capped['resources']['gold'] = 5000
capped['revision'] += 1
write_state(capped)
start()
build_click()
map_tap(*PLACE2)
s4 = read('cap-refuse')
check('city lv2 refuses a third sunlight well',
      len(family(s4)) == 2 and s4['resources']['gold'] == 5000
      and s4['revision'] == capped['revision'],
      'wells=%s gold=%s' % (len(family(s4)), s4['resources']['gold']))

# ------------------------------------------------------- normal key untouched
adb('shell', 'am', 'force-stop', PKG)
time.sleep(1)
rows = read_rows()
check('normal delivery save unchanged by fixture run',
      rows.get(NORMAL) == preserved_normal, 'revision drift')

log = adb('logcat', '-d').decode('utf-8', errors='replace')
(W / 'construct-validation.log').write_text(log, encoding='utf-8')
bad = [l for l in log.splitlines() if any(
    x in l for x in ['FATAL EXCEPTION', 'TypeError:', 'ReferenceError:',
                     'DinoLocal save failed'])]
crash = [l for l in log.splitlines()
         if 'Fatal signal' in l and 'com.netease.h1.qihoo' in l]
check('no script crash in logcat', not bad, bad[:3])
check('no game process crash', not crash, crash[:2])
check('delivery status logged',
      'local-construct-ready' in log or 'local entry scene ready' in log)
check('no scheduler error surfaced',
      'DinoLocal update failed' not in log,
      [l for l in log.splitlines() if 'DinoLocal update failed' in l][:2])

report = {
    'passed': all(c['passed'] for c in checks),
    'apk': 'dino-construct-validation.apk',
    'fixtureKey': KEY,
    'normalKey': NORMAL,
    'cost': COST,
    'duration': DURATION,
    'checks': checks,
    'records': records,
}
(W / 'construct-validation.json').write_text(
    json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print('\nConstruct validation PASSED: %s checks' % len(checks))
