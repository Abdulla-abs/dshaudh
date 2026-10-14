"""Prepare the fixture variant used for training-queue validation.

The variant is identical to the delivery script except that it reads and writes
the dedicated key dino.local.city.v9.validation-20261012, so the normal
delivery save is never touched by the fixture run.
"""
from pathlib import Path

w = Path(__file__).resolve().parent
s = (w / 'train_boot.js').read_text(encoding='utf-8').replace(
    "'dino.local.city.v9'", "'dino.local.city.v9.validation-20261012'"
)
assert "'dino.local.city.v9.validation-20261012'" in s
(w / 'train_validation_boot.js').write_text(s, encoding='ascii')
b = (
    (w / 'build_train.py')
    .read_text(encoding='utf-8')
    .replace("ROOT / 'dino-local-train.apk'", "WORK / 'dino-train-validation.apk'")
    .replace('train_boot.js', 'train_validation_boot.js')
)
(w / 'build_train_validation.py').write_text(b, encoding='utf-8')
print('Prepared train validation boot and builder')
