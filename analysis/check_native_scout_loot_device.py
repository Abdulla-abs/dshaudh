"""Install the scout-loot build on instance 1 after backing up and comparing saves."""
import hashlib
import io
import json
from pathlib import Path
import subprocess
import tarfile
import zipfile
from datetime import datetime

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / '.local/scout-loot' / datetime.now().strftime('%Y%m%d-%H%M%S')
ADB = [r'F:\Android\Sdk\platform-tools\adb.exe', '-s', '127.0.0.1:21513']
PACKAGE = 'com.netease.h1.qihoo'


def adb(*args):
    return subprocess.check_output(ADB + list(args), stderr=subprocess.STDOUT)


def backup(label):
    raw = adb('exec-out', 'su', '-c',
              f'tar -cf - -C /data/data/{PACKAGE} databases shared_prefs files')
    (OUT / f'{label}.tar').write_bytes(raw)
    with tarfile.open(fileobj=io.BytesIO(raw)) as archive:
        return {entry.name: hashlib.sha256(archive.extractfile(entry).read()).hexdigest()
                for entry in archive.getmembers() if entry.isfile()}


def main():
    OUT.mkdir(parents=True, exist_ok=False)
    apk = ROOT / 'dino-local-native.apk'
    with zipfile.ZipFile(apk) as package:
        if package.read('assets/offline/boot.js') != (ROOT / 'analysis/native_boot.js').read_bytes():
            raise RuntimeError('APK boot.js does not match current source')
    adb('shell', 'am', 'force-stop', PACKAGE)
    before = backup('before')
    summary = {'path': str(OUT), 'apkSha256': hashlib.sha256(apk.read_bytes()).hexdigest(),
               'before': before}
    (OUT / 'verification.json').write_text(json.dumps(summary, indent=2), encoding='utf-8')
    # Known command-injection files are not game saves; match the normal launch script.
    adb('shell', 'rm', '-f', '/data/local/tmp/dino-boot.js', '/data/local/tmp/dino-command.js')
    adb('push', str(apk), '/data/local/tmp/dino-local-native.apk')
    installed = adb('shell', 'pm', 'install', '-r', '/data/local/tmp/dino-local-native.apk').decode()
    if 'Success' not in installed:
        raise RuntimeError(installed)
    after = backup('after')
    summary.update({'install': installed.strip(), 'after': after, 'savesEqual': before == after})
    (OUT / 'verification.json').write_text(json.dumps(summary, indent=2), encoding='utf-8')
    if before != after:
        raise RuntimeError(f'Save comparison failed; inspect backups in {OUT}')
    launch = adb('shell', 'am', 'start', '-W', '-n', f'{PACKAGE}/{PACKAGE}.AdvanceDino').decode()
    summary['launch'] = launch
    (OUT / 'verification.json').write_text(json.dumps(summary, indent=2), encoding='utf-8')
    print(json.dumps({'path': str(OUT), 'files': len(before), 'savesEqual': True,
                      'apkSha256': summary['apkSha256'], 'launch': launch.strip()}))


if __name__ == '__main__':
    main()
