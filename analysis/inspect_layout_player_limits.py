"""Read stock construction rules and the dedicated instance save without modifying it."""
from pathlib import Path
import io
import json
import sqlite3
import subprocess
import sys
import tarfile
from datetime import datetime, timezone, timedelta

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / '.local/layout-player-mode'
OUT.mkdir(parents=True, exist_ok=True)
sys.path.insert(0, str(ROOT / 'tools/jsc_decompiler'))
from parser import parse
from decompiler.decompiler import _decompile_func

for name in ['Data/Common/build_number', 'Data/Common/unit_main',
             'Client/UI/Shop', 'Client/UI/BuildingAction']:
    source = ROOT / f'analysis/decoded/script/{name}.jsc'
    (OUT / (source.stem + '.js')).write_text(_decompile_func(parse(source.read_bytes())), encoding='utf-8')

adb = [r'F:\Android\Sdk\platform-tools\adb.exe', '-s', '127.0.0.1:21513']
raw = subprocess.check_output(adb + ['exec-out', 'su', '-c',
    'tar -cf - -C /data/data/com.netease.h1.qihoo databases'])
(OUT / 'databases.tar').write_bytes(raw)
with tarfile.open(fileobj=io.BytesIO(raw)) as archive:
    archive.extractall(OUT, filter='data')
with sqlite3.connect(OUT / 'databases/jsb.sqlite') as db:
    saved = json.loads(db.execute('select value from data where key=?', ('dino.local.native.v1',)).fetchone()[0])
(OUT / 'save.json').write_text(json.dumps(saved, ensure_ascii=False), encoding='utf-8')
(OUT / 'capture.json').write_text(json.dumps({'capturedAt': datetime.now(timezone(timedelta(hours=8))).isoformat(),
    'instance': 1, 'adb': '127.0.0.1:21513', 'access': 'read-only'}), encoding='utf-8')
level = saved['level']
print(json.dumps({'levelFields': list(level), 'buildingsType': type(level.get('buildings')).__name__}, ensure_ascii=False))
