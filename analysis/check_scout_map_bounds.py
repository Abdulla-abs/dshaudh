"""Verify scout terrain limits against the original TMX and reproduce the old overflow."""
import base64
import copy
import json
from pathlib import Path
import struct
import sys
import xml.etree.ElementTree as ET
import zlib

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tools'))
from build_scout_pool import validate_scout_terrain
from import_pve_layout import MAP, compile_layout

terrain = ET.parse(ROOT / 'analysis/apk/assets/res_ref/map/world1.tmx').getroot()
assert terrain.get('width') == terrain.get('height') == '60'
assert MAP['terrainSize'] == 60
assert (MAP['playableMin'], MAP['playableMax']) == (11, 48)
data = terrain.find("layer[@name='GameLogicLayer']/data")
gids = struct.unpack('<3600I', zlib.decompress(base64.b64decode(data.text)))
first = int(terrain.find('tileset').get('firstgid'))
buildable = {first + int(tile.get('id')) for tile in terrain.findall('tileset/tile')
             if tile.find("properties/property[@name='Building']").get('value') == '1'}
for y in range(60):
    for x in range(60):
        assert (gids[y * 60 + x] in buildable) == (11 <= x <= 48 and 11 <= y <= 48)

fixed = json.loads((ROOT / 'analysis/rpc-contracts/scout-layouts/alley-cat-8.json').read_text(encoding='utf-8'))
compile_layout(fixed)
validate_scout_terrain(fixed)
old = copy.deepcopy(fixed)
for row in old['buildings'] + old['walls']:
    row['x'] += 20
    row['y'] += 20
try:
    compile_layout(old)
except ValueError as error:
    assert 'outside playable terrain' in str(error)
else:
    raise AssertionError('Campaign importer accepted the original overflow')
try:
    validate_scout_terrain(old)
except ValueError as error:
    assert 'outside playable terrain' in str(error)
else:
    raise AssertionError('Original overflow was not rejected')

for coords, valid in [((11, 11), True), ((48, 48), True), ((10, 11), False), ((49, 48), False)]:
    fixture = {'buildings': [], 'walls': [{'x': coords[0], 'y': coords[1]}]}
    try:
        validate_scout_terrain(fixture)
    except ValueError:
        assert not valid
    else:
        assert valid
# An anchor inside the range is insufficient when its full footprint crosses the edge.
fixture = {'buildings': [{'id': 'hq', 'typeid': 20105, 'x': 11, 'y': 11}], 'walls': []}
try:
    validate_scout_terrain(fixture)
except ValueError:
    pass
else:
    raise AssertionError('Headquarters footprint outside terrain was accepted')
print('PASS: original TMX terrain, original overflow reproduction, translated layout, wall edges and full building footprints')
