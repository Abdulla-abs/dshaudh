"""Set spirit fragment inventory to 60000 on the dedicated emulator instance."""
from pathlib import Path
import copy
import io
import json
import sqlite3
import subprocess
import tarfile

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / '.local/spirit-fragments-60000'
ADB = [r'F:\Android\Sdk\platform-tools\adb.exe', '-s', '127.0.0.1:21513']
KEY = 'dino.local.native.v1'
DEVICE_DB = '/data/data/com.netease.h1.qihoo/databases/jsb.sqlite'
if (OUT / 'verification.json').exists():
    raise SystemExit('Verified edit already completed; refusing to replay an old backup')
with sqlite3.connect(OUT / 'databases/jsb.sqlite') as source:
    before_rows = dict(source.execute('select key,value from data'))
    before = json.loads(before_rows[KEY])
    after = copy.deepcopy(before)
    matches = [item for bag in after['level']['player']['package'].values()
               for item in bag['item_dict'].values() if item['typeid'] == 1101]
    assert not matches, 'Expected current spirit fragment inventory to be empty'
    bag = after['level']['player']['package']['material']
    assert len(bag['item_dict']) < bag['capacity'], 'Material bag is full'
    oid = 'manual_spirit_fragments_60000'
    assert all(oid not in b['item_dict'] for b in after['level']['player']['package'].values())
    bag['item_dict'][oid] = {'oid': oid, 'typeid': 1101, 'num': 60000, 'is_new': False}
    restored = copy.deepcopy(after)
    del restored['level']['player']['package']['material']['item_dict'][oid]
    assert restored == before, 'Unexpected unrelated change'
    patched = OUT / 'patched.sqlite'
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

subprocess.run(ADB + ['push', str(patched), '/data/local/tmp/spirit-fragments-60000.sqlite'], check=True)
subprocess.run(ADB + ['shell', 'su -c "cat /data/local/tmp/spirit-fragments-60000.sqlite > ' + DEVICE_DB + '"'], check=True)
subprocess.run(ADB + ['shell', 'su -c "rm -f ' + DEVICE_DB + '-wal ' + DEVICE_DB + '-shm"'], check=True)
raw = subprocess.check_output(ADB + ['exec-out', 'su', '-c',
    'tar -cf - -C /data/data/com.netease.h1.qihoo databases'])
(OUT / 'after.tar').write_bytes(raw)
verify_dir = OUT / 'verified'
verify_dir.mkdir()
tarfile.open(fileobj=io.BytesIO(raw)).extractall(verify_dir, filter='data')
with sqlite3.connect(verify_dir / 'databases/jsb.sqlite') as db:
    assert dict(db.execute('select key,value from data')) == after_rows, 'Device readback mismatch'
    assert db.execute('pragma integrity_check').fetchone()[0] == 'ok'
summary = {'typeid': 1101, 'before': 0, 'after': 60000, 'other_data_unchanged': True,
           'device_readback_verified': True}
(OUT / 'verification.json').write_text(json.dumps(summary, indent=2), encoding='utf-8')
print(json.dumps(summary))
