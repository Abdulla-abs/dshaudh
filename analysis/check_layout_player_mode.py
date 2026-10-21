"""Validate player exports through the real campaign/scout layout compiler."""
import copy
import importlib.util
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('layout_import', ROOT / 'tools/import_pve_layout.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class PlayerModeTests(unittest.TestCase):
    def setUp(self):
        self.layout = json.loads((ROOT / '.local/layout-player-mode/browser/player-export.json').read_text(encoding='utf-8'))

    def test_real_browser_export(self):
        result = module.compile_layout(self.layout)
        self.assertEqual(len(result['walls']), 20)
        self.assertEqual(len(result['units']), 2)

    def test_reject_extra_resource_building_but_allow_free(self):
        other = copy.deepcopy(self.layout['buildings'][1])
        other.update(id='extra', x=38, y=30)
        self.layout['buildings'].append(other)
        with self.assertRaisesRegex(ValueError, 'count exceeds'):
            module.compile_layout(self.layout)
        self.layout['mode'] = 'free'
        self.assertEqual(len(module.compile_layout(self.layout)['units']), 3)

    def test_reject_wall_level_and_count(self):
        self.layout['walls'][0]['level'] = 2
        with self.assertRaisesRegex(ValueError, 'wall level'):
            module.compile_layout(self.layout)
        self.layout['walls'][0]['level'] = 1
        self.layout['walls'].append({'x': 12, 'y': 12, 'level': 1})
        with self.assertRaisesRegex(ValueError, 'count exceeds'):
            module.compile_layout(self.layout)

    def test_base_and_legacy_metadata(self):
        self.layout['baseLevel'] = 2
        with self.assertRaisesRegex(ValueError, 'building level'):
            module.compile_layout(self.layout)
        del self.layout['mode']
        del self.layout['baseLevel']
        self.assertEqual(len(module.compile_layout(self.layout)['units']), 2)


if __name__ == '__main__':
    unittest.main()
