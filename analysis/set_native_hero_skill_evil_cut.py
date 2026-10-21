"""A/B: replace 破釜沉舟 with 邪恶切割 on the level-61 小盗龙 (instance 1)."""
from pathlib import Path
import copy
import io
import json
import sqlite3
import subprocess
import tarfile
import time

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / '.local/hero-skill-stuck'
ADB = [r'F:\Android\Sdk\platform-tools\adb.exe', '-s', '127.0.0.1:21513']
KEY = 'dino.local.native.v1'
DEVICE_DB = '/data/data/com.netease.h1.qihoo/databases/jsb.sqlite'
# Keep 毒刃 / 窃火者; swap 破釜沉舟(159) -> 邪恶切割(9030), all lv 10
NEW_SLOTS = [
    {'sid': 165, 'lv': 10, 'exp': 0},
    {'sid': 163, 'lv': 10, 'exp': 0},
    {'sid': 9030, 'lv': 10, 'exp': 0},
]
NEW_SKILL_ID = NEW_SLOTS[0]['sid'] * 100 + NEW_SLOTS[0]['lv']
PKG = 'com.netease.h1.qihoo'

OUT.mkdir(parents=True, exist_ok=True)
if (OUT / 'evil-cut-verification.json').exists():
    raise SystemExit('evil-cut verification already done; refuse replay')

subprocess.run(ADB + ['shell', 'am', 'force-stop', PKG], check=True)
time.sleep(1)
subprocess.run(ADB + ['shell', 'su -c "sqlite3 ' + DEVICE_DB +
                      ' \\\"pragma wal_checkpoint(truncate);\\\""'], check=False)
raw = subprocess.check_output(
    ADB + ['exec-out', 'su', '-c', 'tar -cf - -C /data/data/com.netease.h1.qihoo databases'])
(OUT / 'before-evil-cut.tar').write_bytes(raw)
before_dir = OUT / 'before-evil-cut'
if before_dir.exists():
    import shutil
    shutil.rmtree(before_dir)
before_dir.mkdir(parents=True)
tarfile.open(fileobj=io.BytesIO(raw)).extractall(before_dir, filter='data')

src_db = before_dir / 'databases' / 'jsb.sqlite'
if not src_db.exists() or src_db.stat().st_size == 0:
    raise SystemExit('Pulled jsb.sqlite empty; check WAL on device')
patched = OUT / 'evil-cut-patched.sqlite'
with sqlite3.connect(src_db) as source:
    before_rows = dict(source.execute('select key,value from data'))
    before = json.loads(before_rows[KEY])
    after = copy.deepcopy(before)
    heroes = [h for h in after['level']['heros']
              if int(h['typeid']) // 100 == 106 and h.get('lv') == 61]
    assert len(heroes) == 1, 'Expected exactly one level-61 小盗龙'
    hero = heroes[0]
    assert hero['sid'] == 'local_shop_hero_33'
    before_skills = {
        'skill_id': hero.get('skill_id'),
        'skill_slots': copy.deepcopy(hero.get('skill_slots')),
    }
    hero['skill_slots'] = copy.deepcopy(NEW_SLOTS)
    hero['skill_id'] = NEW_SKILL_ID
    check = copy.deepcopy(after)
    restored = next(h for h in check['level']['heros'] if h['sid'] == hero['sid'])
    restored['skill_id'] = before_skills['skill_id']
    restored['skill_slots'] = copy.deepcopy(before_skills['skill_slots'])
    assert check == before, 'Unexpected non-skill change'
    with sqlite3.connect(patched) as target:
        source.backup(target)
        target.execute('update data set value=? where key=?',
                       (json.dumps(after, ensure_ascii=False, separators=(',', ':')), KEY))
        target.commit()
        after_rows = dict(target.execute('select key,value from data'))
        assert after_rows.keys() == before_rows.keys()
        assert all(after_rows[k] == before_rows[k] for k in before_rows if k != KEY)
        target.execute('pragma wal_checkpoint(truncate)')
        assert target.execute('pragma integrity_check').fetchone()[0] == 'ok'

subprocess.run(ADB + ['push', str(patched), '/data/local/tmp/evil-cut.sqlite'], check=True)
subprocess.run(ADB + ['shell', 'su -c "cat /data/local/tmp/evil-cut.sqlite > ' + DEVICE_DB + '"'],
               check=True)
subprocess.run(ADB + ['shell', 'su -c "rm -f ' + DEVICE_DB + '-wal ' + DEVICE_DB + '-shm"'],
               check=True)
raw_after = subprocess.check_output(
    ADB + ['exec-out', 'su', '-c', 'tar -cf - -C /data/data/com.netease.h1.qihoo databases'])
(OUT / 'after-evil-cut.tar').write_bytes(raw_after)
verify_dir = OUT / 'evil-cut-verified'
if verify_dir.exists():
    import shutil
    shutil.rmtree(verify_dir)
verify_dir.mkdir(parents=True)
tarfile.open(fileobj=io.BytesIO(raw_after)).extractall(verify_dir, filter='data')
with sqlite3.connect(verify_dir / 'databases' / 'jsb.sqlite') as db:
    actual_rows = dict(db.execute('select key,value from data'))
    assert actual_rows == after_rows, 'Device verification mismatch'
    assert db.execute('pragma integrity_check').fetchone()[0] == 'ok'
    verified = json.loads(actual_rows[KEY])
    vhero = next(h for h in verified['level']['heros'] if h['sid'] == hero['sid'])
    assert vhero['skill_slots'] == NEW_SLOTS
    assert vhero['skill_id'] == NEW_SKILL_ID
    assert vhero['lv'] == 61 and vhero['typeid'] == hero['typeid']

summary = {
    'sid': hero['sid'],
    'typeid': hero['typeid'],
    'lv': 61,
    'before': before_skills,
    'after': {
        'skill_id': NEW_SKILL_ID,
        'skill_slots': NEW_SLOTS,
        'names': ['毒刃', '窃火者', '邪恶切割'],
    },
    'other_save_fields_unchanged': True,
    'other_database_values_unchanged': True,
    'device_readback_verified': True,
}
(OUT / 'evil-cut-verification.json').write_text(
    json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf-8')
subprocess.run(ADB + ['shell', 'monkey', '-p', PKG, '-c',
                      'android.intent.category.LAUNCHER', '1'], check=False)
print(json.dumps(summary, ensure_ascii=False, indent=2))
