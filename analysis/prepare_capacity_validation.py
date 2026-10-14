from pathlib import Path

w = Path(__file__).resolve().parent
s = (w / 'capacity_boot.js').read_text(encoding='utf-8').replace(
    "'dino.local.city.v4'", "'dino.local.city.v4.validation-20261012'"
)
(w / 'capacity_validation_boot.js').write_text(s, encoding='ascii')
b = (
    (w / 'build_capacity.py')
    .read_text(encoding='utf-8')
    .replace("ROOT / 'dino-local-capacity.apk'", "WORK / 'dino-capacity-validation.apk'")
    .replace('capacity_boot.js', 'capacity_validation_boot.js')
)
(w / 'build_capacity_validation.py').write_text(b, encoding='utf-8')
print('Prepared capacity validation boot and builder')
