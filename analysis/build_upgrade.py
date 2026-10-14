"""Build the local-entry test APK from the preserved original and patched dex."""
from pathlib import Path
import hashlib
import subprocess
import zipfile

ROOT = Path(__file__).resolve().parent.parent
WORK = ROOT / 'analysis'
SDK = Path(r'F:\Android\Sdk')
JAVA = Path(r'C:\Users\ZoomLink\.jdks\ms-17.0.18\bin\java.exe')
CLANG = SDK / 'ndk/27.0.12077973/toolchains/llvm/prebuilt/windows-x86_64/bin/clang++.exe'
LIBRARY = WORK / 'libdinolocal.so'
OUTPUT = ROOT / 'dino-local-upgrade.apk'

subprocess.run([str(CLANG), '--target=armv7a-linux-androideabi21', '-shared', '-fPIC', '-static-libstdc++', '-O2', str(WORK / 'local_hook.cpp'), '-o', str(LIBRARY), '-ldl', '-llog', '-landroid'], check=True)
dex = WORK / 'apk/build/apk/classes.dex'
if not dex.exists():
    raise SystemExit('Missing patched classes.dex; see LOCAL-STARTUP.md for the apktool build step.')
unsigned = WORK / 'local-release-unsigned.apk'
with zipfile.ZipFile(ROOT / 'koudaizhuluoji.apk') as source, zipfile.ZipFile(unsigned, 'w', zipfile.ZIP_DEFLATED) as output:
    for entry in source.infolist():
        if entry.filename.startswith('META-INF/'):
            continue
        if entry.filename == 'classes.dex':
            data = dex.read_bytes()
        elif entry.filename == 'AndroidManifest.xml':
            with zipfile.ZipFile(WORK / 'rebuild.apk') as rebuilt:
                data = rebuilt.read('AndroidManifest.xml')
        else:
            data = source.read(entry.filename)
        output.writestr(entry, data)
    output.writestr('lib/armeabi/libdinolocal.so', LIBRARY.read_bytes())
    output.writestr('assets/offline/boot.js', (WORK / 'upgrade_boot.js').read_bytes())
subprocess.run([str(JAVA), '-jar', str(SDK / 'build-tools/35.0.0/lib/apksigner.jar'), 'sign', '--ks', str(Path.home() / '.android/debug.keystore'), '--ks-key-alias', 'androiddebugkey', '--ks-pass', 'pass:android', '--key-pass', 'pass:android', '--out', str(OUTPUT), str(unsigned)], check=True)
subprocess.run([str(JAVA), '-jar', str(SDK / 'build-tools/35.0.0/lib/apksigner.jar'), 'verify', str(OUTPUT)], check=True)
digest = hashlib.sha256(OUTPUT.read_bytes()).hexdigest()
OUTPUT.with_suffix('.apk.sha256').write_text(digest + '  ' + OUTPUT.name + '\n')
print('Built:', OUTPUT, 'SHA256:', digest)
