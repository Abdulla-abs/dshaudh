"""Restore 破釜沉舟 on the level-61 小盗龙 so the seek-fix can be retested."""
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
PKG = 'com.netease.h1.qihoo'
NEW_SLOTS = [
    {'sid': 165, 'lv': 10, 'exp': 0},
    {'sid': 163, 'lv': 10, 'exp': 0},
    {'sid': 159, 'lv': 10, 'exp': 0},
]
NEW_SKILL_ID = NEW_SLOTS[0]['sid'] * 100 + NEW_SLOTS[0]['lv']

OUT.mkdir(parents=True, exist_ok=True)
subprocess.run(ADB + ['shell', 'am', 'force-stop', PKG], check=True)
time.sleep(1)
subprocess.run(ADB + ['shell', 'su -c "sqlite3 ' + DEVICE_DB +
                      ' \\\"pragma wal_checkpoint(truncate);\\\""'], check=False)
raw = subprocess.check_output(
    ADB + ['exec-out', 'su', '-c', 'tar -cf - -C /data/data/com.netease.h1.qihoo databases'])
(OUT / 'before-burn-boats-retest.tar').write_bytes(raw)
before_dir = OUT / 'before-burn-boats-retest'
if before_dir.exists():
    import shutil
    shutil.rmtree(before_dir)
before_dir.mkdir(parents=True)
tarfile.open(fileobj=io.BytesIO(raw)).extractall(before_dir, filter='data')
src_db = before_dir / 'databases' / 'jsb.sqlite'
assert src_db.exists() and src_db.stat().st_size > 0, 'empty pull'

patched = OUT / 'burn-boats-retest.sqlite'
with sqlite3.connect(src_db) as source:
    before_rows = dict(source.execute('select key,value from data'))
    before = json.loads(before_rows[KEY])
    after = copy.deepcopy(before)
    hero = next(h for h in after['level']['heros']
                if h.get('sid') == 'local_shop_hero_33')
    before_skills = copy.deepcopy(hero.get('skill_slots'))
    hero['skill_slots'] = copy.deepcopy(NEW_SLOTS)
    hero['skill_id'] = NEW_SKILL_ID
    with sqlite3.connect(patched) as target:
        source.backup(target)
        target.execute('update data set value=? where key=?',
                       (json.dumps(after, ensure_ascii=False, separators=(',', ':')), KEY))
        target.commit()
        target.execute('pragma wal_checkpoint(truncate)')
        assert target.execute('pragma integrity_check').fetchone()[0] == 'ok'

subprocess.run(ADB + ['push', str(patched), '/data/local/tmp/burn-boats.sqlite'], check=True)
subprocess.run(ADB + ['shell', 'su -c "cat /data/local/tmp/burn-boats.sqlite > ' + DEVICE_DB + '"'],
               check=True)
subprocess.run(ADB + ['shell', 'su -c "rm -f ' + DEVICE_DB + '-wal ' + DEVICE_DB + '-shm"'],
               check=True)
subprocess.run(ADB + ['pull', DEVICE_DB, str(OUT / 'burn-boats-readback.sqlite')], check=True)
with sqlite3.connect(OUT / 'burn-boats-readback.sqlite') as db:
    v = json.loads(dict(db.execute('select key,value from data'))[KEY])
    h = next(x for x in v['level']['heros'] if x['sid'] == 'local_shop_hero_33')
    assert h['skill_slots'] == NEW_SLOTS
summary = {
    'sid': 'local_shop_hero_33',
    'before': before_skills,
    'after': {'skill_slots': NEW_SLOTS, 'names': ['毒刃', '窃火者', '破釜沉舟']},
    'purpose': 'retest installActiveSkillSeekFix with friend-target active',
}
(OUT / 'burn-boats-retest.json').write_text(
    json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf-8')
subprocess.run(ADB + ['shell', 'monkey', '-p', PKG, '-c',
                      'android.intent.category.LAUNCHER', '1'], check=False)
print(json.dumps(summary, ensure_ascii=False, indent=2))
