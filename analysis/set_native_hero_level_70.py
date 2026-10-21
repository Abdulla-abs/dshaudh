"""Apply the requested 66 -> 70 change to the backed-up dedicated-instance save."""
from pathlib import Path
import copy
import io
import json
import sqlite3
import subprocess
import tarfile

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / '.local/hero-level-70'
ADB = [r'F:\Android\Sdk\platform-tools\adb.exe', '-s', '127.0.0.1:21513']
KEY = 'dino.local.native.v1'
DEVICE_DB = '/data/data/com.netease.h1.qihoo/databases/jsb.sqlite'
patched = OUT / 'patched.sqlite'
if (OUT / 'verification.json').exists():
    raise SystemExit('Verified edit already completed; refusing to replay an old backup')
with sqlite3.connect(OUT / 'databases/jsb.sqlite') as source:
    before_rows = dict(source.execute('select key,value from data'))
    before = json.loads(before_rows[KEY])
    after = copy.deepcopy(before)
    heroes = [h for h in after['level']['heros']
              if int(h['typeid']) // 100 == 106 and h.get('lv') == 66]
    assert len(heroes) == 1, 'Expected exactly one level-66 small raptor'
    hero = heroes[0]
    assert hero['sid'] == 'local_shop_hero_33' and hero['level'] == 66
    hero['lv'] = hero['level'] = 70
    check = copy.deepcopy(after)
    restored = next(h for h in check['level']['heros'] if h['sid'] == hero['sid'])
    restored['lv'] = restored['level'] = 66
    assert check == before, 'Unexpected non-level change'
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

subprocess.run(ADB + ['push', str(patched), '/data/local/tmp/hero-level-70.sqlite'], check=True)
subprocess.run(ADB + ['shell', 'su -c "cat /data/local/tmp/hero-level-70.sqlite > ' + DEVICE_DB + '"'], check=True)
subprocess.run(ADB + ['shell', 'su -c "rm -f ' + DEVICE_DB + '-wal ' + DEVICE_DB + '-shm"'], check=True)
raw = subprocess.check_output(ADB + ['exec-out', 'su', '-c',
    'tar -cf - -C /data/data/com.netease.h1.qihoo databases'])
(OUT / 'after.tar').write_bytes(raw)
verify_dir = OUT / 'verified'
verify_dir.mkdir()
tarfile.open(fileobj=io.BytesIO(raw)).extractall(verify_dir, filter='data')
with sqlite3.connect(verify_dir / 'databases/jsb.sqlite') as db:
    actual_rows = dict(db.execute('select key,value from data'))
    assert actual_rows == after_rows, 'Device verification mismatch'
    assert db.execute('pragma integrity_check').fetchone()[0] == 'ok'
summary = {'sid': hero['sid'], 'typeid': hero['typeid'],
           'changes': {'lv': [66, 70], 'level': [66, 70]},
           'xp_unchanged': hero['xp'], 'other_save_fields_unchanged': True,
           'other_database_values_unchanged': True, 'device_readback_verified': True}
(OUT / 'verification.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(summary, ensure_ascii=False))
