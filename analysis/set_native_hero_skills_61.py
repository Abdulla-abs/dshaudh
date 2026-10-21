"""Set the level-61 小盗龙 skills to 毒刃/窃火者/破釜沉舟 at lv 10 on instance 1."""
from pathlib import Path
import copy
import io
import json
import sqlite3
import subprocess
import tarfile

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / '.local/hero-skills-61'
ADB = [r'F:\Android\Sdk\platform-tools\adb.exe', '-s', '127.0.0.1:21513']
KEY = 'dino.local.native.v1'
DEVICE_DB = '/data/data/com.netease.h1.qihoo/databases/jsb.sqlite'
# 毒刃 / 窃火者 / 破釜沉舟 — classic family-106 ordinary skills
NEW_SLOTS = [
    {'sid': 165, 'lv': 10, 'exp': 0},
    {'sid': 163, 'lv': 10, 'exp': 0},
    {'sid': 159, 'lv': 10, 'exp': 0},
]
NEW_SKILL_ID = NEW_SLOTS[0]['sid'] * 100 + NEW_SLOTS[0]['lv']

if (OUT / 'verification.json').exists():
    raise SystemExit('Verified edit already completed; refusing to replay an old backup')

patched = OUT / 'patched.sqlite'
with sqlite3.connect(OUT / 'databases/jsb.sqlite') as source:
    before_rows = dict(source.execute('select key,value from data'))
    before = json.loads(before_rows[KEY])
    after = copy.deepcopy(before)
    heroes = [h for h in after['level']['heros']
              if int(h['typeid']) // 100 == 106 and h.get('lv') == 61]
    assert len(heroes) == 1, 'Expected exactly one level-61 小盗龙'
    hero = heroes[0]
    assert hero['sid'] == 'local_shop_hero_33' and hero['level'] == 61
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

subprocess.run(ADB + ['push', str(patched), '/data/local/tmp/hero-skills-61.sqlite'], check=True)
subprocess.run(ADB + ['shell', 'su -c "cat /data/local/tmp/hero-skills-61.sqlite > ' + DEVICE_DB + '"'],
               check=True)
subprocess.run(ADB + ['shell', 'su -c "rm -f ' + DEVICE_DB + '-wal ' + DEVICE_DB + '-shm"'], check=True)
raw = subprocess.check_output(ADB + ['exec-out', 'su', '-c',
    'tar -cf - -C /data/data/com.netease.h1.qihoo databases'])
(OUT / 'after.tar').write_bytes(raw)
verify_dir = OUT / 'verified'
verify_dir.mkdir(exist_ok=True)
tarfile.open(fileobj=io.BytesIO(raw)).extractall(verify_dir, filter='data')
with sqlite3.connect(verify_dir / 'databases/jsb.sqlite') as db:
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
    'after': {'skill_id': NEW_SKILL_ID, 'skill_slots': NEW_SLOTS,
              'names': ['毒刃', '窃火者', '破釜沉舟']},
    'other_save_fields_unchanged': True,
    'other_database_values_unchanged': True,
    'device_readback_verified': True,
}
(OUT / 'verification.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(summary, ensure_ascii=False, indent=2))
