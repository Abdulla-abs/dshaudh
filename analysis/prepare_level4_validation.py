from pathlib import Path

w = Path(__file__).resolve().parent
s = (w / 'level4_boot.js').read_text(encoding='utf-8').replace(
    "'dino.local.city.v6'", "'dino.local.city.v6.validation-20261012'"
)
(w / 'level4_validation_boot.js').write_text(s, encoding='ascii')
b = (
    (w / 'build_level4.py')
    .read_text(encoding='utf-8')
    .replace("ROOT / 'dino-local-level4.apk'", "WORK / 'dino-level4-validation.apk'")
    .replace('level4_boot.js', 'level4_validation_boot.js')
)
(w / 'build_level4_validation.py').write_text(b, encoding='utf-8')
print('Prepared level4 validation boot and builder')
