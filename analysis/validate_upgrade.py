"""Real touch and real duration validation, using ONLY a separate fixture key."""
from pathlib import Path
import subprocess,time,json,sqlite3
ROOT=Path(__file__).resolve().parent.parent
W=ROOT/'analysis'
ADB=[r'F:\Android\Sdk\platform-tools\adb.exe','-s','127.0.0.1:21513']
PKG='com.netease.h1.qihoo'
KEY='dino.local.city.v3.validation-20261012'
records=[]
fixture=json.loads((W/'upgrade-test-fixture.json').read_text())
def adb(*args):
    p=subprocess.run(ADB+list(args),capture_output=True)
    if p.returncode:raise RuntimeError(str(args)+p.stderr.decode('utf-8',errors='replace'))
    return p.stdout
def tap(x,y):
    adb('shell','input','tap',str(x),str(y));time.sleep(.5)
def shot(name):
    adb('shell','screencap','-p','/sdcard/upgrade-validation.png')
    adb('pull','/sdcard/upgrade-validation.png',str(W/('upgrade-verified-'+name+'.png')))
def read(name):
    folder=W/('upgrade-db-'+name);folder.mkdir(exist_ok=True)
    for suffix in ['','-wal']:
        (folder/('jsb.sqlite'+suffix)).write_bytes(adb('exec-out','cat','/data/data/'+PKG+'/databases/jsb.sqlite'+suffix))
    with sqlite3.connect(folder/'jsb.sqlite') as db:rows=dict(db.execute('select key,value from data'))
    for k,v in fixture['preserved'].items():assert rows[k]==v,('Normal save changed',k)
    state=json.loads(rows[KEY]);records.append({'step':name,'state':state})
    (W/'upgrade-validation-progress.json').write_text(json.dumps(records,indent=2))
    print(name,state['revision'],state['resources'],flush=True)
    return state
def start():
    adb('shell','am','force-stop',PKG)
    adb('shell','am','start','-n',PKG+'/'+PKG+'.AdvanceDino');time.sleep(4)
    tap(640,470);time.sleep(6)
def select(b):
    tap(round((b['x']-1916)*.45*1280/1136+640),round(360-(b['y']+90-1406)*.45*720/639))
def upgrade_click():tap(1050,694)
def wait_until(end):
    while time.time()<end+2:time.sleep(min(10,max(.1,end+2-time.time())))
    time.sleep(2)

adb('push',str(W/'dino-upgrade-validation.apk'),'/data/local/tmp/dino-upgrade-validation.apk')
adb('shell','pm','install','-r','/data/local/tmp/dino-upgrade-validation.apk')
adb('shell','rm','-f','/data/local/tmp/dino-boot.js','/data/local/tmp/dino-command.js')
adb('logcat','-c');start()
before=read('initial');shot('initial')
select(before['buildings'][1]);upgrade_click();shot('cost');assert read('confirmation')==before
upgrade_click();shot('base-required');assert read('base-required')==before
select(before['buildings'][2]);upgrade_click();assert read('unsupported')==before
select(before['buildings'][0]);upgrade_click();upgrade_click();shot('base-start')
base=read('base-start');assert base['resources']=={'gold':1000,'wood':2000}
job=base['buildings'][0]['upgrade'];assert job['ends']-job['started']==300
upgrade_click();upgrade_click();tap(230,694);tap(550,400)
assert read('repeated-and-move-rejected')==base
start();select(base['buildings'][0]);shot('base-restart');assert read('base-restart')==base
print('Waiting for the real 300-second base upgrade',flush=True)
wait_until(job['ends']);shot('base-complete');done=read('base-complete')
assert done['buildings'][0]['type']=='20102' and 'upgrade' not in done['buildings'][0]
assert done['resources']==base['resources']
select(done['buildings'][1]);upgrade_click();upgrade_click();shot('sun-start');sun=read('sun-start')
assert sun['resources']=={'gold':300,'wood':2000}
sun_job=sun['buildings'][1]['upgrade'];assert sun_job['ends']-sun_job['started']==180
tap(640,694);tap(230,694);assert read('sun-paused')==sun
select(sun['buildings'][3]);upgrade_click();upgrade_click();shot('worker-busy');assert read('worker-busy')==sun
select(sun['buildings'][1]);shot('sun-countdown');start();assert read('sun-restart')==sun
adb('shell','am','force-stop',PKG)
print('Waiting offline for the real 180-second sunshine upgrade',flush=True)
wait_until(sun_job['ends']);start();select(sun['buildings'][1]);shot('sun-complete');sun_done=read('sun-complete')
assert sun_done['buildings'][1]['type']=='20202' and 'upgrade' not in sun_done['buildings'][1]
assert sun_done['production']['building-1']['lastHour']==sun_job['ends']/3600
assert sun_done['production']['building-1']['stored']==sun['production']['building-1']['stored']
time.sleep(20);tap(640,694);shot('sun-collected');collected=read('sun-collected')
amount=collected['resources']['wood']-sun_done['resources']['wood']
expected=min(1000,int((time.time()/3600-sun_job['ends']/3600)*400+sun_done['production']['building-1']['stored']))
assert abs(amount-expected)<=2,(amount,expected)
assert collected['resources']['gold']==300
select(collected['buildings'][0]);upgrade_click();assert read('level-limit')==collected
select(collected['buildings'][3]);upgrade_click();upgrade_click();shot('mine-start');mine=read('mine-start')
assert mine['resources']['wood']==collected['resources']['wood']-700
assert mine['resources']['gold']==300
mine_job=mine['buildings'][3]['upgrade'];assert mine_job['ends']-mine_job['started']==180
adb('shell','am','force-stop',PKG)
print('Waiting offline for the real 180-second mine upgrade',flush=True)
wait_until(mine_job['ends']);start();select(mine['buildings'][3]);shot('mine-complete');mine_done=read('mine-complete')
assert mine_done['buildings'][3]['type']=='20402' and 'upgrade' not in mine_done['buildings'][3]
assert mine_done['production']['building-3']['lastHour']==mine_job['ends']/3600
tap(55,35);tap(640,470);time.sleep(6);assert read('reenter')==mine_done
adb('shell','input','keyevent','4');time.sleep(1);tap(640,470);time.sleep(6)
assert read('system-back-reenter')==mine_done
log=adb('logcat','-d').decode('utf-8',errors='replace');(W/'upgrade-validation.log').write_text(log,encoding='utf-8')
bad=[l for l in log.splitlines() if any(x in l for x in ['FATAL EXCEPTION','Fatal signal','TypeError:','ReferenceError:','DinoLocal save failed','DinoLocal update failed'])]
assert not bad,bad
(W/'upgrade-validation.json').write_text(json.dumps({'passed':True,'fixtureKey':KEY,'syntheticResources':True,'duration':'real 300/180/180 seconds; no time acceleration','checks':['confirmation no mutation','base requirement','unsupported buildings','gold/wood debit','single worker','no duplicate debit','no move or collect while upgrading','restart pending jobs','original level-2 art','offline completion','level-2 production','level limit','reentry','normal saves unchanged'],'records':records},ensure_ascii=False,indent=2),encoding='utf-8')
print('Upgrade fixture validation passed',flush=True)
