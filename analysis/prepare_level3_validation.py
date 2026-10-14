from pathlib import Path

w = Path(__file__).resolve().parent
s = (w / 'level3_boot.js').read_text(encoding='utf-8').replace(
    "'dino.local.city.v5'", "'dino.local.city.v5.validation-20261012'"
)
(w / 'level3_validation_boot.js').write_text(s, encoding='ascii')
b = (
    (w / 'build_level3.py')
    .read_text(encoding='utf-8')
    .replace("ROOT / 'dino-local-level3.apk'", "WORK / 'dino-level3-validation.apk'")
    .replace('level3_boot.js', 'level3_validation_boot.js')
)
(w / 'build_level3_validation.py').write_text(b, encoding='utf-8')
print('Prepared level3 validation boot and builder')
