"""Set the three screenshot-identified raptor fragment totals to 50 on instance 1."""
from pathlib import Path
import copy
import io
import json
import sqlite3
import subprocess
import tarfile

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / '.local/hero-fragments-50'
ADB = [r'F:\Android\Sdk\platform-tools\adb.exe', '-s', '127.0.0.1:21513']
KEY = 'dino.local.native.v1'
DEVICE_DB = '/data/data/com.netease.h1.qihoo/databases/jsb.sqlite'
if (OUT / 'verification.json').exists():
    raise SystemExit('Verified edit already completed; refusing to replay an old backup')
expected = {2025: ('光刃能量宝石碎片', 12), 2024: ('战斗背心碎片', 17), 2023: ('激光刀碎片', 8)}
changes = []
with sqlite3.connect(OUT / 'databases/jsb.sqlite') as source:
    before_rows = dict(source.execute('select key,value from data'))
    before = json.loads(before_rows[KEY])
    after = copy.deepcopy(before)
    for typeid, (name, old_total) in expected.items():
        matches = [(bagname, oid, item) for bagname, bag in after['level']['player']['package'].items()
                   for oid, item in bag['item_dict'].items() if item['typeid'] == typeid]
        assert len(matches) == 1, 'Expected a single existing stack for ' + name
        bagname, oid, item = matches[0]
        assert item['num'] == old_total, 'Unexpected starting quantity for ' + name
        item['num'] = 50
        changes.append({'name': name, 'typeid': typeid, 'bag': bagname, 'oid': oid, 'before': old_total, 'after': 50})
    restored = copy.deepcopy(after)
    for change in changes:
        restored['level']['player']['package'][change['bag']]['item_dict'][change['oid']]['num'] = change['before']
    assert restored == before, 'Unexpected non-quantity change'
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

subprocess.run(ADB + ['push', str(patched), '/data/local/tmp/hero-fragments-50.sqlite'], check=True)
subprocess.run(ADB + ['shell', 'su -c "cat /data/local/tmp/hero-fragments-50.sqlite > ' + DEVICE_DB + '"'], check=True)
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
summary = {'changes': changes, 'other_data_unchanged': True, 'device_readback_verified': True}
(OUT / 'verification.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(summary, ensure_ascii=False))
