"""Exercise the packaged APK through real Android touch input and inspect saves."""
from pathlib import Path
import subprocess, time, sqlite3, json

ROOT = Path(__file__).resolve().parent.parent
WORK = ROOT / 'analysis'
ADB = [r'F:\Android\Sdk\platform-tools\adb.exe', '-s', '127.0.0.1:21513']
PACKAGE = 'com.netease.h1.qihoo'
records = []

def adb(*args):
    r=subprocess.run(ADB+list(args),capture_output=True)
    if r.returncode: raise RuntimeError(str(args)+': '+r.stderr.decode('utf-8',errors='replace'))
    return r.stdout

def tap(x,y):
    adb('shell','input','tap',str(x),str(y)); time.sleep(.5)

def shot(name):
    adb('shell','screencap','-p','/sdcard/state-validation.png')
    adb('pull','/sdcard/state-validation.png',str(WORK/('state-verified-'+name+'.png')))

def read_save(name):
    folder=WORK/('state-db-'+name); folder.mkdir(exist_ok=True)
    # SQLite rebuilds shared memory from the copied WAL; Android blocks pulling shm.
    for suffix in ['', '-wal']:
        (folder/('jsb.sqlite'+suffix)).write_bytes(adb('exec-out','cat','/data/data/'+PACKAGE+'/databases/jsb.sqlite'+suffix))
    with sqlite3.connect(folder/'jsb.sqlite') as db:
        rows=db.execute('select * from data').fetchall()
    value=json.loads(next(row[1] for row in rows if row[0]=='dino.local.city.v1'))
    records.append({'step':name,'state':value}); return value

def start():
    adb('shell','am','force-stop',PACKAGE)
    adb('shell','am','start','-n',PACKAGE+'/'+PACKAGE+'.AdvanceDino'); time.sleep(4)
    tap(640,470); time.sleep(6)

adb('push',str(ROOT/'dino-local-state.apk'),'/data/local/tmp/dino-local-state.apk')
adb('shell','pm','install','-r','/data/local/tmp/dino-local-state.apk')
adb('shell','rm','-f','/data/local/tmp/dino-boot.js','/data/local/tmp/dino-command.js')
adb('logcat','-c')
start(); shot('initial')
before=read_save('initial')
# First building is at the position saved during the research smoke check.
b=before['buildings'][0]
sx=round((b['x']-1916)*.45*1280/1136+640)
sy=round(360-(b['y']+90-1406)*.45*720/639)
tap(sx,sy); tap(640,694); shot('move-mode')
# Try to place onto another existing building; storage must stay unchanged.
tap(835,590); shot('collision')
assert read_save('collision')==before
tap(640,694); shot('cancel')
assert read_save('cancel')==before
tap(640,694); tap(550,400); shot('moved')
after=read_save('moved')
assert after['revision']==before['revision']+1
assert after['buildings'][0]!=before['buildings'][0]
assert after['buildings'][1:]==before['buildings'][1:]
tap(55,35); time.sleep(1); shot('back')
tap(640,470); time.sleep(6); shot('reenter')
assert read_save('reenter')==after
start(); shot('restart')
assert read_save('restart')==after
# Existing zoom, pan and system-back controls should still work.
tap(1220,35); shot('zoom')
adb('shell','input','swipe','600','420','730','380','450'); shot('pan')
tap(1000,35); shot('reset')
adb('shell','input','keyevent','4'); time.sleep(1); shot('system-back')
tap(640,470); time.sleep(6); shot('final')
log=adb('logcat','-d').decode('utf-8',errors='replace')
(WORK/'state-validation.log').write_text(log,encoding='utf-8')
bad=[line for line in log.splitlines() if any(x in line for x in ['FATAL EXCEPTION','Fatal signal','TypeError:','ReferenceError:','DinoLocal save failed'])]
assert not bad, bad
(WORK/'state-validation.json').write_text(json.dumps({'passed':True,'checks':['collision rejected','cancel unchanged','move saved','other buildings unchanged','return and reenter','force-stop restart','zoom pan reset system-back'],'records':records},ensure_ascii=False,indent=2),encoding='utf-8')
print('Packaged APK validation passed:',after['buildings'][0])
