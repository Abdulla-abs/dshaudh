"""Meaningful validation of editor JSON compilation and explicit application."""
from pathlib import Path
import importlib.util
import json
import sys
import unittest

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("layout_import", ROOT / "tools/import_pve_layout.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def valid():
    return {"schema": module.SCHEMA, "stage": 7, "name": "用户第七关", "map": {"width": 64, "height": 64},
            "buildings": [{"id": "main", "typeid": 20101, "level": 1, "x": 30, "y": 30},
                          {"id": "flag", "typeid": 50701, "level": 1, "x": 36, "y": 28}],
            "walls": [{"x": 25, "y": 23, "level": 2}],
            "guards": [{"id": "g1", "typeid": 10501, "level": 1, "anchorId": "flag"}]}


class LayoutTests(unittest.TestCase):
    def test_runes_compile_and_reject_bad_fields(self):
        raw = valid()
        rune = {'typeid': 7003, 'base_attr': [1201], 'two_attr': [1201], 'three_attr': [], 'hero_attr': 105}
        raw['guards'][0]['runes'] = [rune, {'typeid': 7043}, None, None, None]
        compiled = module.compile_layout(raw)['units'][-1]
        self.assertEqual(compiled['eqp'][0], dict(rune, slot=0))
        self.assertEqual(compiled['eqp'][1]['slot'], 1)
        self.assertIsNone(compiled['eqp'][2])
        self.assertNotIn('x', compiled)
        for change in [lambda g: g.update(runes=[]),
                       lambda g: g['runes'][0].update(typeid=7043),
                       lambda g: g['runes'][0].update(base_attr=[1201, 1201]),
                       lambda g: g['runes'][0].update(base_attr=[999999]),
                       lambda g: g['runes'][0].update(base_attr=None),
                       lambda g: g['runes'][0].update(hero_attr=True)]:
            bad = json.loads(json.dumps(raw))
            change(bad['guards'][0])
            with self.assertRaises(ValueError):
                module.compile_layout(bad)

    def test_all_map_decorations_compile(self):
        raw = valid()
        entries = [b for b in module.CATALOG['buildings'] if 601 <= b['family'] <= 629]
        self.assertEqual(len(entries), 29)
        for i, entry in enumerate(entries):
            variant = entry['levels'][0]
            raw['buildings'].append({'id': f'decor-{i}', 'typeid': variant['typeid'],
                                     'level': 1, 'x': 13 + i % 10 * 3, 'y': 13 + i // 10 * 3})
        units = module.compile_layout(raw)['units'][2:31]
        self.assertEqual([u['typeid'] for u in units], [e['levels'][0]['typeid'] for e in entries])
        self.assertTrue(all('x' in u and 'y' in u for u in units))
        raw['walls'].append({'x': raw['buildings'][-1]['x'], 'y': raw['buildings'][-1]['y'], 'level': 1})
        with self.assertRaises(ValueError):
            module.compile_layout(raw)

    def test_traps_compile_with_original_typeids(self):
        raw = valid()
        raw['buildings'].extend({'id': f'trap-{family}', 'typeid': family * 100 + level,
                                 'level': level, 'x': 15 + i, 'y': 15}
                                for i, (family, level) in enumerate([(401, 1), (402, 5), (403, 10)]))
        units = module.compile_layout(raw)['units']
        self.assertEqual([(u['typeid'], u['x'], u['y']) for u in units[2:5]],
                         [(40101, 15, 15), (40205, 16, 15), (40310, 17, 15)])

    def test_ids_guard_and_wall_contract(self):
        raw = valid()
        before = json.dumps(raw)
        out = module.compile_layout(raw)
        self.assertEqual(out["units"][2]["did"], str(out["units"][1]["sid"]))
        self.assertEqual(out["units"][2]["lv"], 1)
        self.assertNotIn("x", out["units"][2])
        self.assertNotIn("y", out["units"][2])
        self.assertEqual(out["walls"], [[2, 25, 23, 0]])
        self.assertEqual(before, json.dumps(raw))

    def test_reject_collision_unknown_level_orphan_and_bounds(self):
        changes = [lambda r: r["walls"].append({"x":30,"y":30,"level":1}),
                   lambda r: r["buildings"][0].update(x=1),
                   lambda r: r["buildings"][0].update(typeid=20199),
                   lambda r: r["guards"][0].update(anchorId="missing"),
                   lambda r: r.update(stage=True)]
        for mutate in changes:
            raw = valid()
            mutate(raw)
            with self.assertRaises(ValueError):
                module.compile_layout(raw)

    def test_fixed_guard_skill_and_rejections(self):
        raw = valid()
        raw["guards"][0].update(level=5, skills=[14801])
        guard = module.compile_layout(raw)["units"][2]
        self.assertEqual(guard["lv"], 5)
        self.assertEqual(guard["skills"], [10501, 14801])
        for skills in ([True], [14801, 14801], [10501], [0], "14801"):
            raw["guards"][0]["skills"] = skills
            with self.assertRaises(ValueError):
                module.compile_layout(raw)

    def test_cultivation_mapping_and_rejections(self):
        raw = valid()
        raw["guards"][0].update(level=70, evolution=2, reborn=19, mutateId=6, skills=[14810])
        guard = module.compile_layout(raw)["units"][2]
        self.assertEqual((guard["typeid"], guard["unit_level"], guard["unit_mutateid"], guard["lv"]), (10560, 60, 6, 70))
        self.assertEqual(guard["skills"], [10501, 14810])
        self.assertNotIn("x", guard)
        self.assertNotIn("y", guard)
        for field, value in [("evolution", 3), ("reborn", 20), ("mutateId", 16),
                             ("reborn", True), ("evolution", None), ("skills", [14801, 14802]),
                             ("skills", [16501]), ("skills", [14899])]:
            trial = json.loads(json.dumps(raw))
            trial["guards"][0][field] = value
            with self.assertRaises(ValueError, msg=(field, value)):
                module.compile_layout(trial)

    def test_all_original_guard_variants_and_mutations(self):
        for hero in module.CATALOG["guards"]:
            for variant in hero["variants"]:
                for mutation in module.CATALOG["mutations"]:
                    raw = valid()
                    raw["guards"][0].update(typeid=hero["typeid"], evolution=variant["evolution"],
                                           reborn=variant["reborn"], mutateId=mutation["id"])
                    if mutation["id"] >= len(variant["basics"]) or not variant["basics"][mutation["id"]]:
                        with self.assertRaises(ValueError):
                            module.compile_layout(raw)
                        continue
                    guard = module.compile_layout(raw)["units"][2]
                    self.assertEqual(guard["typeid"], variant["typeid"])
                    self.assertEqual(guard["skills"], variant["basics"][mutation["id"]])

    def test_apply_to_isolated_fixture_only(self):
        target = ROOT / ".local/layout-editor/apply-test"
        (target / "analysis").mkdir(parents=True, exist_ok=True)
        file = target / "approved.json"
        file.write_text(json.dumps(valid()), encoding="utf-8")
        boot = target / "analysis/native_boot.js"
        boot.write_text("before\n" + module.START + "\n        LocalNative.editorPveLayouts = {};\n" + module.END + "\nafter", encoding="utf-8")
        previous_root, previous_args = module.ROOT, sys.argv
        try:
            module.ROOT = target
            sys.argv = ["import_pve_layout.py", str(file), "--apply"]
            module.main()
            self.assertIn('"7":', boot.read_text(encoding="utf-8"))
            self.assertTrue((target / "analysis/rpc-contracts/pve-layouts/stage-7.json").is_file())
            first = boot.read_text(encoding="utf-8")
            module.main()
            self.assertEqual(boot.read_text(encoding="utf-8"), first)
        finally:
            module.ROOT, sys.argv = previous_root, previous_args


if __name__ == "__main__":
    unittest.main()
