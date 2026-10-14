"""Prepare the fixture variant used for dual production-building validation."""
from pathlib import Path

w = Path(__file__).resolve().parent
s = (w / 'mine_boot.js').read_text(encoding='utf-8').replace(
    "'dino.local.city.v11'", "'dino.local.city.v11.validation-20261012'"
)
assert "'dino.local.city.v11.validation-20261012'" in s
(w / 'mine_validation_boot.js').write_text(s, encoding='ascii')
b = (
    (w / 'build_mine.py')
    .read_text(encoding='utf-8')
    .replace("ROOT / 'dino-local-mine.apk'", "WORK / 'dino-mine-validation.apk'")
    .replace('mine_boot.js', 'mine_validation_boot.js')
)
(w / 'build_mine_validation.py').write_text(b, encoding='utf-8')
print('Prepared mine validation boot and builder')
