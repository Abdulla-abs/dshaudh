"""Check scout pool build validation and synchronization without changing files."""
import copy
import json
from pathlib import Path
import sys
from unittest.mock import patch

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tools'))
import build_scout_pool as builder

manifest = json.loads(builder.MANIFEST.read_text(encoding='utf-8'))
pool = builder.compile_pool(manifest)
source = (ROOT / 'analysis/native_boot.js').read_text(encoding='utf-8')
assert builder.render_pool(source, pool) == source


def rejects(value, message):
    try:
        builder.compile_pool(value)
    except ValueError as error:
        assert message in str(error), error
    else:
        raise AssertionError('Invalid manifest accepted')


bad = copy.deepcopy(manifest)
bad['levels'] = []
rejects(bad, 'at least one')
bad = copy.deepcopy(manifest)
bad['levels'].append(bad['levels'][0])
rejects(bad, 'Duplicate')
bad = copy.deepcopy(manifest)
bad['levels'][0]['layout'] = '../scout-pool.json'
rejects(bad, 'inside scout-layouts')
bad = copy.deepcopy(manifest)
bad['policy']['mode'] = 'unknown'
rejects(bad, 'Unknown')
for delta in (-1, True, 1.5):
    bad = copy.deepcopy(manifest)
    bad['policy']['headquartersDelta'] = delta
    rejects(bad, 'delta')
with patch.object(builder, 'compile_layout', return_value={'units': []}):
    rejects(manifest, 'exactly one headquarters')
with patch.object(builder, 'compile_layout', return_value={'units': [{'typeid': 20101}] * 2}):
    rejects(manifest, 'exactly one headquarters')
try:
    builder.render_pool('', pool)
except ValueError as error:
    assert 'marker' in str(error)
else:
    raise AssertionError('Missing native markers accepted')
print('PASS: real layouts, embedded synchronization, invalid manifests, headquarters and path validation')
