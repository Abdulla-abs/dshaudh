"""Validate an editor JSON file, or apply an approved layout to the native adapter.

--check is read-only. --apply updates the layout contract and embedded registry;
it never builds, installs, changes device saves or unlocks a campaign stage.
"""
from pathlib import Path
import argparse
import json
import re

ROOT = Path(__file__).resolve().parent.parent
CATALOG = json.loads((ROOT / "analysis/layout-editor/catalog.json").read_text(encoding="utf-8"))
MAP = json.loads((ROOT / 'analysis/rpc-contracts/layout-map.json').read_text(encoding='utf-8'))
SCHEMA = "dino-pve-layout/v1"
START = "        // BEGIN USER AUTHORED PVE LAYOUTS"
END = "        // END USER AUTHORED PVE LAYOUTS"


def integer(value, low, high):
    return type(value) is int and low <= value <= high


def validate_layout_terrain(raw):
    variants = {v['typeid']: v for b in CATALOG['buildings'] for v in b['levels']}
    low, high = MAP['playableMin'], MAP['playableMax']
    for building in raw['buildings']:
        spec = variants[building['typeid']]
        x, y = building['x'], building['y']
        if not (low <= x - spec['width'] + 1 <= x <= high and
                low <= y - spec['height'] + 1 <= y <= high):
            raise ValueError(f"Building {building['id']} is outside playable terrain ({low}..{high})")
    for wall in raw['walls']:
        if not (low <= wall['x'] <= high and low <= wall['y'] <= high):
            raise ValueError(f'Wall is outside playable terrain ({low}..{high})')


def compile_guard_runes(runes):
    if not isinstance(runes, list) or len(runes) != 5:
        raise ValueError('Runes must have five slots')
    result = []
    for slot, rune in enumerate(runes):
        if rune is None:
            result.append(None)
            continue
        if not isinstance(rune, dict) or type(rune.get('typeid')) is not int or not any(
                r['typeid'] == rune['typeid'] and r['slot'] == slot for r in CATALOG['runes']['items']):
            raise ValueError('Rune type or slot mismatch')
        equip = {'typeid': rune['typeid'], 'slot': slot}
        for layer in ('base_attr', 'two_attr', 'three_attr'):
            attrs = rune.get(layer, [])
            if not isinstance(attrs, list) or len(attrs) > 11:
                raise ValueError('Invalid rune attribute list')
            seen = set()
            for aid in attrs:
                attribute = next((a for a in CATALOG['runes']['attributes']
                                  if type(aid) is int and a['id'] == aid and layer in a['layers']), None)
                if not attribute or attribute['stat'] in seen:
                    raise ValueError('Invalid or duplicate rune attribute')
                seen.add(attribute['stat'])
            equip[layer] = list(attrs)
        hero = rune.get('hero_attr', 0)
        if type(hero) is not int or (hero != 0 and not any(e['hero'] == hero for e in CATALOG['runes']['exclusive'])):
            raise ValueError('Invalid rune exclusive hero')
        equip['hero_attr'] = hero
        result.append(equip)
    return result


def validate_player_limits(raw):
    mode = raw.get('mode', 'free')
    if mode not in ('free', 'player'):
        raise ValueError('Invalid editor mode')
    base = raw.get('baseLevel')
    if base is not None and not integer(base, 1, 10):
        raise ValueError('Invalid base level')
    if mode != 'player':
        return
    if base is None:
        raise ValueError('Player mode requires baseLevel')
    rules = json.loads((ROOT / 'analysis/layout-editor/player-rules.json').read_text(encoding='utf-8'))['families']
    counts = {}
    for b in raw['buildings']:
        family = b['typeid'] // 100
        counts[family] = counts.get(family, 0) + 1
        rule = rules.get(str(family), {})
        required = rule.get('levels', {}).get(str(b['level']))
        if required is None or required > base or (family == 201 and b['level'] != base):
            raise ValueError(f'Player building level exceeds base limits: {b["id"]}')
    counts[211] = counts.get(211, 0) + len(raw['walls'])
    for family, count in counts.items():
        maximum = rules.get(str(family), {}).get('counts', [0] * 10)[base - 1]
        if count > maximum:
            raise ValueError(f'Player building count exceeds base limits: {family} {count}/{maximum}')
    if counts.get(201) != 1:
        raise ValueError('Player mode requires exactly one matching base')
    for wall in raw['walls']:
        required = rules['211']['levels'].get(str(wall['level']))
        if required is None or required > base:
            raise ValueError('Player wall level exceeds base limits')


def compile_layout(raw):
    if not isinstance(raw, dict) or raw.get("schema") != SCHEMA:
        raise ValueError("Unsupported layout schema")
    stage = raw.get("stage")
    if not integer(stage, 1, 999) or raw.get("map") != {"width": MAP['dataSize'], "height": MAP['dataSize']}:
        raise ValueError("Invalid stage or map bounds")
    buildings, walls, guards = (raw.get(name) for name in ("buildings", "walls", "guards"))
    if not all(isinstance(rows, list) for rows in (buildings, walls, guards)):
        raise ValueError("Missing building, wall or guard list")
    if not 1 <= len(buildings) <= (MAP['playableMax'] - MAP['playableMin'] + 1) ** 2 or len(walls) > 4096 or len(guards) > 128:
        raise ValueError("Invalid object count")
    variants = {v["typeid"]: v for b in CATALOG["buildings"] for v in b["levels"]}
    heroes = {g["typeid"] for g in CATALOG["guards"]}
    ids, occupied, compiled, anchors = set(), set(), [], {}

    def register_id(row):
        value = row.get("id")
        if not isinstance(value, str) or not value or len(value) > 80 or value in ids:
            raise ValueError("Duplicate or invalid object id")
        ids.add(value)
        return value

    for i, b in enumerate(buildings):
        if not isinstance(b, dict):
            raise ValueError("Invalid building record")
        bid = register_id(b)
        typeid, level, x, y = (b.get(k) for k in ("typeid", "level", "x", "y"))
        spec = variants.get(typeid) if type(typeid) is int else None
        if not spec or type(level) is not int or spec["level"] != level:
            raise ValueError(f"Unsupported building level: {bid}")
        if not integer(x, 0, 63) or not integer(y, 0, 63):
            raise ValueError(f"Invalid building coordinates: {bid}")
        for cx in range(x - spec["width"] + 1, x + 1):
            for cy in range(y - spec["height"] + 1, y + 1):
                if cx < 0 or cy < 0 or (cx, cy) in occupied:
                    raise ValueError(f"Building overlap or out of bounds: {bid}")
                occupied.add((cx, cy))
        sid = 100000 + stage * 1000 + i + 1
        compiled.append({"sid": sid, "typeid": typeid, "x": x, "y": y,
                         "localNativeStableSid": True})
        anchors[bid] = {"sid": sid, "family": typeid // 100, "x": x, "y": y}
    compiled_walls = []
    for w in walls:
        if not isinstance(w, dict):
            raise ValueError("Invalid wall record")
        x, y, level = (w.get(k) for k in ("x", "y", "level"))
        if not integer(x, 0, 63) or not integer(y, 0, 63) or not integer(level, 1, 10):
            raise ValueError("Invalid wall coordinates or level")
        if (x, y) in occupied:
            raise ValueError("Overlapping or duplicate wall")
        occupied.add((x, y))
        compiled_walls.append([level, x, y, 0])
    for i, g in enumerate(guards):
        if not isinstance(g, dict):
            raise ValueError("Invalid guard record")
        register_id(g)
        anchor = anchors.get(g.get("anchorId"))
        if not anchor or anchor["family"] not in (301, 505, 506, 507):
            raise ValueError("Guard anchor must be a flag or dragon bunker")
        if type(g.get("typeid")) is not int or g["typeid"] not in heroes or not integer(g.get("level"), 1, 100):
            raise ValueError("Unsupported hero or guard level")
        hero = next(h for h in CATALOG["guards"] if h["typeid"] == g["typeid"])
        evolution, reborn, mutate_id = (g.get(k, 0) for k in ("evolution", "reborn", "mutateId"))
        if not all(type(v) is int for v in (evolution, reborn, mutate_id)):
            raise ValueError("Invalid guard cultivation values")
        variant = next((v for v in hero["variants"] if v["evolution"] == evolution and v["reborn"] == reborn), None)
        mutation = next((m for m in CATALOG["mutations"] if m["id"] == mutate_id), None)
        if not variant or not mutation or not 0 <= mutate_id < len(variant["basics"]) or not variant["basics"][mutate_id]:
            raise ValueError("Unsupported evolution, promotion or mutation")
        extra_skills, seen_skills = g.get("skills", []), set()
        if not isinstance(extra_skills, list) or len(extra_skills) > 3:
            raise ValueError("Invalid fixed guard skills")
        for skill in extra_skills:
            if not integer(skill, 10001, 99999999):
                raise ValueError("Invalid fixed guard skill")
            family, skill_level = divmod(skill, 100)
            entry = next((s for s in hero["skills"] if s["id"] == family), None)
            if not entry or skill_level not in entry["levels"] or family in seen_skills:
                raise ValueError("Incompatible, duplicate or unsupported guard skill")
            seen_skills.add(family)
        actual_typeid = variant["typeid"]
        sid = 100000 + stage * 1000 + len(buildings) + i + 1
        compiled.append({"sid": sid, "id": sid, "typeid": actual_typeid,
                         "unit_type": actual_typeid // 100, "unit_level": actual_typeid % 100,
                         "unit_mutateid": mutate_id, "lv": g["level"], "xp": 0,
                         # Mobile heroes have no TileHolder. Stock _setupAllUnit
                         # positions them through did -> Unit.setAtDefensePos.
                         "state": 2,
                         "did": str(anchor["sid"]), "defense_id": str(anchor["sid"]),
                          "rct": 0, "aht": 0, "aidx": -1, "skills": list(dict.fromkeys(variant["basics"][mutate_id] + extra_skills)),
                         "localNativeStableSid": True, "localNativeGuard": True})
        if 'runes' in g:
            compiled[-1]['eqp'] = compile_guard_runes(g['runes'])
    validate_layout_terrain(raw)
    validate_player_limits(raw)
    return {"stage": stage, "name": str(raw.get("name", ""))[:80],
            "source": "user-authored-layout", "units": compiled, "walls": compiled_walls}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("layout", type=Path)
    modes = parser.add_mutually_exclusive_group()
    modes.add_argument("--check", action="store_true")
    modes.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    raw = json.loads(args.layout.read_text(encoding="utf-8-sig"))
    compiled = compile_layout(raw)
    if args.apply:
        folder = ROOT / "analysis/rpc-contracts/pve-layouts"
        registry = {}
        for file in sorted(folder.glob("stage-*.json")):
            other = compile_layout(json.loads(file.read_text(encoding="utf-8")))
            registry[str(other["stage"])] = other
        registry[str(compiled["stage"])] = compiled
        boot = ROOT / "analysis/native_boot.js"
        source = boot.read_text(encoding="utf-8")
        payload = json.dumps(registry, ensure_ascii=True, separators=(",", ":"))
        replacement = START + "\n        LocalNative.editorPveLayouts = " + payload + ";\n" + END
        pattern = re.escape(START) + r"[\s\S]*?" + re.escape(END)
        updated, count = re.subn(pattern, lambda _: replacement, source)
        if count != 1:
            raise ValueError("Native registry marker missing or duplicated; no files changed")
        folder.mkdir(parents=True, exist_ok=True)
        (folder / f"stage-{compiled['stage']}.json").write_text(
            json.dumps(raw, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        boot.write_text(updated, encoding="utf-8")
        print("Applied approved layout to contract and native registry. Build/install separately.")
    print(json.dumps({"stage": compiled["stage"], "buildings": len(raw["buildings"]),
                      "walls": len(raw["walls"]), "guards": len(raw["guards"]),
                      "valid": True, "applied": args.apply}, ensure_ascii=False))


if __name__ == "__main__":
    main()
