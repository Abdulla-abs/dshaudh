"""Prepare the fixture variant used for local-construction validation."""
from pathlib import Path

w = Path(__file__).resolve().parent
s = (w / 'construct_boot.js').read_text(encoding='utf-8').replace(
    "'dino.local.city.v10'", "'dino.local.city.v10.validation-20261012'"
)
assert "'dino.local.city.v10.validation-20261012'" in s
(w / 'construct_validation_boot.js').write_text(s, encoding='ascii')
b = (
    (w / 'build_construct.py')
    .read_text(encoding='utf-8')
    .replace("ROOT / 'dino-local-construct.apk'", "WORK / 'dino-construct-validation.apk'")
    .replace('construct_boot.js', 'construct_validation_boot.js')
)
(w / 'build_construct_validation.py').write_text(b, encoding='utf-8')
print('Prepared construct validation boot and builder')
