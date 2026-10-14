from pathlib import Path
import subprocess,time,json
ADB=['adb','-s','127.0.0.1:21513']
s=Path('analysis/query.js').read_text(encoding='utf-8')
wrapped='(function(){try{return JSON.stringify((function(){'+s+'})());}catch(e){return JSON.stringify({error:String(e),stack:e.stack});}})()\n//'+str(time.time())
p=Path('analysis/command.js');p.write_text(wrapped,encoding='utf-8')
subprocess.run(ADB+['push',str(p),'/data/local/tmp/dino-command.js'],capture_output=True,check=True)
time.sleep(2)
r=subprocess.run(ADB+['shell','cat','/data/data/com.netease.h1.qihoo/files/local-report.json'],capture_output=True,text=True,encoding='utf8')
print(r.stdout)
Path('analysis/last-report.json').write_text(r.stdout,encoding='utf8')
