"""Verify production and collection with real time and packaged APK touch input."""
from pathlib import Path
import subprocess,time,json,sqlite3
ROOT=Path(__file__).resolve().parent.parent
WORK=ROOT/'analysis'
ADB=[r'F:\Android\Sdk\platform-tools\adb.exe','-s','127.0.0.1:21513']
PKG='com.netease.h1.qihoo'
records=[]
def adb(*args):
    r=subprocess.run(ADB+list(args),capture_output=True)
    if r.returncode:raise RuntimeError(str(args)+r.stderr.decode('utf-8',errors='replace'))
    return r.stdout
def tap(x,y):
    adb('shell','input','tap',str(x),str(y));time.sleep(.6)
def shot(name):
    adb('shell','screencap','-p','/sdcard/economy-verified.png')
    adb('pull','/sdcard/economy-verified.png',str(WORK/('economy-verified-'+name+'.png')))
def read(name):
    folder=WORK/('economy-db-'+name);folder.mkdir(exist_ok=True)
    for suffix in ['','-wal']:
        (folder/('jsb.sqlite'+suffix)).write_bytes(adb('exec-out','cat','/data/data/'+PKG+'/databases/jsb.sqlite'+suffix))
    with sqlite3.connect(folder/'jsb.sqlite') as db:
        rows=dict(db.execute('select key,value from data'))
    value=json.loads(rows['dino.local.city.v2'])
    records.append({'step':name,'state':value})
    return value,json.loads(rows['dino.local.city.v1'])
def start():
    adb('shell','am','force-stop',PKG)
    adb('shell','am','start','-n',PKG+'/'+PKG+'.AdvanceDino');time.sleep(4)
    tap(640,470);time.sleep(6)
def select(b):
    x=round((b['x']-1916)*.45*1280/1136+640)
    y=round(360-(b['y']+90-1406)*.45*720/639)
    tap(x,y)

adb('push',str(ROOT/'dino-local-economy.apk'),'/data/local/tmp/dino-local-economy.apk')
adb('shell','pm','install','-r','/data/local/tmp/dino-local-economy.apk')
adb('shell','rm','-f','/data/local/tmp/dino-boot.js','/data/local/tmp/dino-command.js')
adb('logcat','-c');start();shot('initial')
initial,legacy=read('initial')
assert initial['buildings']==legacy['buildings']
select(initial['buildings'][0]);tap(810,694);shot('non-producer')
assert read('non-producer')[0]==initial
select(initial['buildings'][1]);shot('producing')
time.sleep(20)
tap(810,694);shot('wood-collected')
wood=read('wood-collected')[0]
assert wood['resources']['wood']>initial['resources']['wood']
assert wood['resources']['gold']==initial['resources']['gold']
assert wood['buildings']==initial['buildings']
tap(810,694);shot('repeated')
assert read('repeated')[0]==wood
select(wood['buildings'][3]);tap(810,694);shot('gold-collected')
gold=read('gold-collected')[0]
assert gold['resources']['gold']>wood['resources']['gold']
assert gold['resources']['wood']==wood['resources']['wood']
tap(55,35);time.sleep(1);tap(640,470);time.sleep(6)
assert read('reenter')[0]==gold
start();shot('restart')
assert read('restart')[0]==gold
# Real offline time contributes production; do not seed resource grants.
adb('shell','am','force-stop',PKG);time.sleep(20);start()
select(gold['buildings'][1]);shot('offline-production');tap(810,694)
offline=read('offline-collected')[0];shot('final')
assert offline['resources']['wood']>gold['resources']['wood']
assert offline['resources']['gold']==gold['resources']['gold']
assert offline['buildings']==legacy['buildings']
log=adb('logcat','-d').decode('utf-8',errors='replace')
(WORK/'economy-validation.log').write_text(log,encoding='utf-8')
bad=[line for line in log.splitlines() if any(x in line for x in ['FATAL EXCEPTION','Fatal signal','TypeError:','ReferenceError:','DinoLocal save failed'])]
assert not bad,bad
(WORK/'economy-validation.json').write_text(json.dumps({'passed':True,'checks':['legacy positions preserved','non-producer rejected','real-time sunshine collection','repeat collection no duplication','coin collection','return reenter','force-stop restart','offline production'],'records':records},ensure_ascii=False,indent=2),encoding='utf-8')
print('Economy validation passed:',offline['resources'])
