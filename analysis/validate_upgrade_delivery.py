"""Smoke-check the final delivery, using normal state and no seeded resources."""
from pathlib import Path
import subprocess,time,sqlite3,json,zipfile,hashlib
R=Path(__file__).resolve().parent.parent;W=R/'analysis'
A=[r'F:\Android\Sdk\platform-tools\adb.exe','-s','127.0.0.1:21513'];P='com.netease.h1.qihoo'
records=[]
def adb(*a):
    p=subprocess.run(A+list(a),capture_output=True,check=True);return p.stdout
def tap(x,y):adb('shell','input','tap',str(x),str(y));time.sleep(.5)
def shot(name):
    adb('shell','screencap','-p','/sdcard/upgrade-delivery.png')
    adb('pull','/sdcard/upgrade-delivery.png',str(W/('upgrade-delivery-'+name+'.png')))
def read(name):
    f=W/('upgrade-delivery-db-'+name);f.mkdir(exist_ok=True)
    for suffix in ['','-wal']:(f/('jsb.sqlite'+suffix)).write_bytes(adb('exec-out','cat','/data/data/'+P+'/databases/jsb.sqlite'+suffix))
    with sqlite3.connect(f/'jsb.sqlite') as db:rows=dict(db.execute('select key,value from data'))
    baseline=json.loads((W/'upgrade-test-fixture.json').read_text())['preserved']
    for k in ['dino.local.city.v1','dino.local.city.v2']:assert rows[k]==baseline[k]
    v=json.loads(rows['dino.local.city.v3']);records.append({'step':name,'state':v});return v
def select(b):tap(round((b['x']-1916)*.45*1280/1136+640),round(360-(b['y']+90-1406)*.45*720/639))
def start():
    adb('shell','am','force-stop',P);adb('shell','am','start','-n',P+'/'+P+'.AdvanceDino');time.sleep(4)
    tap(640,470);time.sleep(6)
with zipfile.ZipFile(R/'dino-local-upgrade.apk') as z:
    assert z.read('assets/offline/boot.js')==(W/'upgrade_boot.js').read_bytes()
    assert z.read('classes.dex')==(W/'apk/build/apk/classes.dex').read_bytes()
    with zipfile.ZipFile(R/'dino-local-economy.apk') as old:
        assert z.read('lib/armeabi/libdinolocal.so')==old.read('lib/armeabi/libdinolocal.so')
adb('shell','rm','-f','/data/local/tmp/dino-boot.js','/data/local/tmp/dino-command.js')
adb('logcat','-c');start();initial=read('initial');shot('initial')
baseline=json.loads((W/'upgrade-test-fixture.json').read_text())['preserved']
assert initial==json.loads(baseline['dino.local.city.v3'])
assert initial['resources']['gold']<1000
select(initial['buildings'][0]);tap(1050,694);shot('confirmation');assert read('confirmation')==initial
tap(1050,694);shot('insufficient');assert read('insufficient')==initial
select(initial['buildings'][1]);tap(1050,694);tap(1050,694);shot('base-required');assert read('base-required')==initial
tap(230,694);tap(230,694);assert read('move-cancel')==initial
# Only naturally produced resources are collected in normal gameplay.
tap(640,694);shot('collected');collected=read('collected')
assert collected['resources']['wood']>initial['resources']['wood']
assert collected['resources']['gold']==initial['resources']['gold']
assert collected['buildings']==initial['buildings']
tap(55,35);tap(640,470);time.sleep(6);assert read('reenter')==collected
start();assert read('restart')==collected
tap(1220,35);adb('shell','input','swipe','600','420','730','380','450');tap(1000,35)
adb('shell','input','keyevent','4');time.sleep(1);tap(640,470);time.sleep(6)
assert read('system-back')==collected
select(collected['buildings'][1]);shot('final')
log=adb('logcat','-d').decode('utf-8',errors='replace');(W/'upgrade-delivery-validation.log').write_text(log,encoding='utf-8')
bad=[l for l in log.splitlines() if any(x in l for x in ['FATAL EXCEPTION','Fatal signal','TypeError:','ReferenceError:','DinoLocal save failed','DinoLocal update failed'])]
assert not bad,bad
permissions=subprocess.check_output([r'F:\Android\Sdk\build-tools\35.0.0\aapt.exe','dump','permissions',str(R/'dino-local-upgrade.apk')]).decode()
assert "name='android.permission.INTERNET'" not in permissions
(W/'upgrade-delivery-permissions.txt').write_text(permissions)
digest=hashlib.sha256((R/'dino-local-upgrade.apk').read_bytes()).hexdigest()
(W/'upgrade-delivery-validation.json').write_text(json.dumps({'passed':True,'sha256':digest,'syntheticResources':False,'checks':['packaged source and delivery dex','single-run JNI preserved','normal state preserved through fixture tests','old saves unchanged','insufficient resource rejection','base level rejection','move cancellation','natural resource collection','reentry and restart','zoom pan reset system back','no external scripts','no INTERNET permission'],'records':records},ensure_ascii=False,indent=2),encoding='utf-8')
print('Final delivery validation passed:',digest)
