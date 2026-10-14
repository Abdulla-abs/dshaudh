from pathlib import Path
import zipfile,hashlib,json
r=Path('.');w=r/'analysis'
final=(w/'upgrade_boot.js').read_text()
test=(w/'upgrade_validation_boot.js').read_text().replace('dino.local.city.v3.validation-20261012','dino.local.city.v3')
old="status.setString('\\u8d44\\u6e90\\u751f\\u4ea7\\u4e2d\\uff0c\\u6bcf 18 \\u79d2\\u4ea7\\u51fa 1 \\u70b9')"
new="status.setString('\\u8d44\\u6e90\\u751f\\u4ea7\\u4e2d\\uff0c\\u6bcf '+(3600/selected.producer.produceSpeed)+' \\u79d2\\u4ea7\\u51fa 1 \\u70b9')"
assert test.replace(old,new)==final
baseline=json.load(open('docs/baselines/HANDOFF-BASELINE.json'))
for f in baseline['files']:
 if f['path'] in ['koudaizhuluoji.apk','dino-local-preview.apk','dino-local-startup.apk']:
  assert hashlib.sha256((r/f['path']).read_bytes()).hexdigest()==f['sha256']
assert hashlib.sha256((r/'dino-local-economy.apk').read_bytes()).hexdigest()=='ac911711f38f4031ea2087f8553ddbd936b3fc21345f37c67e79328109876c5b'
report={'originalAndPreviousAPKsUnchanged':True,'testVariantDifferences':['independent save key','final empty-storage text uses level-specific seconds per point'], 'upgradeSha256':hashlib.sha256((r/'dino-local-upgrade.apk').read_bytes()).hexdigest()}
(w/'upgrade-artifact-check.json').write_text(json.dumps(report,indent=2))
print(report)
