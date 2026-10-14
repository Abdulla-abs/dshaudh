from pathlib import Path

w = Path(__file__).resolve().parent
s = (w / 'level5_boot.js').read_text(encoding='utf-8').replace(
    "'dino.local.city.v7'", "'dino.local.city.v7.validation-20261012'"
)
(w / 'level5_validation_boot.js').write_text(s, encoding='ascii')
b = (
    (w / 'build_level5.py')
    .read_text(encoding='utf-8')
    .replace("ROOT / 'dino-local-level5.apk'", "WORK / 'dino-level5-validation.apk'")
    .replace('level5_boot.js', 'level5_validation_boot.js')
)
(w / 'build_level5_validation.py').write_text(b, encoding='utf-8')
print('Prepared level5 validation boot and builder')
