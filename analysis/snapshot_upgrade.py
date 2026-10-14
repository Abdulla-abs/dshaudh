"""Preserve reviewed sources and evidence after both validations succeed."""
from pathlib import Path
import zipfile,json,hashlib
R=Path(__file__).resolve().parent.parent;W=R/'analysis'
assert json.loads((W/'upgrade-validation.json').read_text(encoding='utf-8'))['passed']
assert json.loads((W/'upgrade-delivery-validation.json').read_text(encoding='utf-8'))['passed']
names=['docs/history/HANDOFF.md','docs/history/TECHNICAL-NOTES.md','README.md','docs/operations/LOCAL-UPGRADE.md','Launch-Upgrade.ps1','启动本地升级测试.cmd','dino-local-upgrade.apk.sha256']
names+=['analysis/'+n for n in ['economy_boot.js','make_upgrade.py','upgrade_boot.js','build_upgrade.py','local_hook.cpp','libdinolocal.so','prepare_upgrade_validation.py','build_upgrade_validation.py','upgrade_validation_boot.js','upgrade_seed_fixture.js','upgrade-test-fixture.json','validate_upgrade.py','validate_upgrade_delivery.py','check_upgrade_artifacts.py','upgrade-artifact-check.json','upgrade-native-configs.json','upgrade-native-timing.json','upgrade-validation.json','upgrade-validation.log','upgrade-delivery-validation.json','upgrade-delivery-validation.log','upgrade-delivery-permissions.txt','snapshot_upgrade.py']]
names+=['analysis/apk/build/apk/classes.dex','analysis/apk/AndroidManifest.xml','analysis/apk/smali/local/dino/LocalHook.smali','analysis/apk/smali/org/cocos2dx/lib/Cocos2dxRenderer.smali','analysis/apk/smali/com/netease/h1/qihoo/AdvanceDino.smali']
names += [str(p.relative_to(R)).replace('\\','/') for p in W.glob('upgrade-verified-*.png')]
names += [str(p.relative_to(R)).replace('\\','/') for p in W.glob('upgrade-delivery-*.png')]
for n in names:assert (R/n).is_file(),n
record={'date':'2026-10-12','delivery':'dino-local-upgrade.apk','scope':'local upgrades to level 2 for base and two producers; full gameplay incomplete','files':[]}
for n in names+['koudaizhuluoji.apk','dino-local-preview.apk','dino-local-economy.apk','dino-local-upgrade.apk']:
 p=R/n;record['files'].append({'path':n,'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
(R/'docs/baselines/UPGRADE-BASELINE.json').write_text(json.dumps(record,ensure_ascii=False,indent=2),encoding='utf-8')
dest=R/'handoff/upgrade-source-2026-10-12.zip'
with zipfile.ZipFile(dest,'w',zipfile.ZIP_DEFLATED) as z:
 for n in names+['docs/baselines/UPGRADE-BASELINE.json']:z.write(R/n,n)
print('Saved:',dest,'SHA256:',hashlib.sha256(dest.read_bytes()).hexdigest())
