from pathlib import Path
w=Path('analysis')
s=(w/'upgrade_boot.js').read_text().replace("'dino.local.city.v3'", "'dino.local.city.v3.validation-20261012'")
(w/'upgrade_validation_boot.js').write_text(s,encoding='ascii')
b=(w/'build_upgrade.py').read_text().replace("ROOT / 'dino-local-upgrade.apk'","WORK / 'dino-upgrade-validation.apk'").replace('upgrade_boot.js','upgrade_validation_boot.js')
(w/'build_upgrade_validation.py').write_text(b)
