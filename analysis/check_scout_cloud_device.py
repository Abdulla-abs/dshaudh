"""Read-only save/cache snapshot from dedicated MEmu instance 1."""
import argparse
import hashlib
import io
import json
from pathlib import Path
import sqlite3
import subprocess
import tarfile

ROOT = Path(__file__).resolve().parent.parent
ADB = [r'F:\Android\Sdk\platform-tools\adb.exe', '-s', '127.0.0.1:21513']

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--label', required=True)
    args = parser.parse_args()
    if not args.label.replace('-', '').isalnum():
        raise SystemExit('Use an alphanumeric snapshot label')
    folder = ROOT / '.local/scout-cloud' / args.label
    folder.mkdir(parents=True, exist_ok=False)
    raw = subprocess.check_output(ADB + ['exec-out','su','-c',
        'tar -cf - -C /data/data/com.netease.h1.qihoo databases shared_prefs files'])
    (folder / 'save.tar').write_bytes(raw)
    with tarfile.open(fileobj=io.BytesIO(raw)) as archive:
        archive.extractall(folder, filter='data')
    with sqlite3.connect(folder / 'databases/jsb.sqlite') as db:
        rows = dict(db.execute('SELECT key,value FROM data'))
    cloud_key = 'dino.local.scout.cloud.v1'
    snapshot = None
    pointer = json.loads(rows.get(cloud_key + '.commit', 'null'))
    if pointer:
        snapshot = json.loads(rows.get(cloud_key + '.' + pointer['slot'], 'null'))
    result = {
        'files': {str(p.relative_to(folder)):hashlib.sha256(p.read_bytes()).hexdigest()
                  for base in ['databases','shared_prefs','files']
                  for p in (folder/base).rglob('*') if p.is_file()},
        'playerSaveHash': hashlib.sha256(rows.get('dino.local.native.v1','').encode()).hexdigest(),
        'cloudStatus': json.loads(rows.get(cloud_key + '.status', 'null')),
        'cloudSnapshot': None if snapshot is None else {'revision':snapshot['revision'],
            'levels':[{'id':e['id'],'name':e['layout']['name'],'headquartersLevel':e['headquartersLevel'],
                       'units':len(e['layout']['units']),'walls':len(e['layout']['walls'])} for e in snapshot['levels']]}
    }
    (folder/'summary.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({k:v for k,v in result.items() if k!='files'},ensure_ascii=True))

if __name__ == '__main__':
    main()
