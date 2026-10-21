"""Validate the predefined scout pool; --apply embeds it in native_boot.js."""
import argparse
import json
from pathlib import Path
import re

from import_pve_layout import compile_layout, validate_layout_terrain

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / 'analysis/rpc-contracts/scout-pool.json'
START = '        // BEGIN SCOUT LEVEL POOL'
END = '        // END SCOUT LEVEL POOL'


def validate_scout_terrain(raw):
    validate_layout_terrain(raw)


def compile_pool(manifest):
    if manifest.get('schema') != 'dino-scout-pool/v1':
        raise ValueError('Unsupported scout pool schema')
    policy = manifest.get('policy', {})
    if policy.get('mode') not in ('all', 'headquarters-range'):
        raise ValueError('Unknown scout matching policy')
    delta = policy.get('headquartersDelta')
    if type(delta) is not int or not 0 <= delta <= 99:
        raise ValueError('Invalid headquarters delta')
    entries = manifest.get('levels')
    if not isinstance(entries, list) or not entries:
        raise ValueError('Scout pool must contain at least one predefined level')
    levels, ids = [], set()
    for entry in entries:
        key = entry.get('id')
        if not isinstance(key, str) or not re.fullmatch(r'[a-z0-9][a-z0-9-]{0,79}', key) or key in ids:
            raise ValueError('Duplicate or invalid scout level id')
        ids.add(key)
        relative = entry.get('layout')
        if not isinstance(relative, str):
            raise ValueError('Missing scout layout path')
        path = (MANIFEST.parent / relative).resolve()
        if not path.is_relative_to((MANIFEST.parent / 'scout-layouts').resolve()):
            raise ValueError('Scout layouts must be inside scout-layouts/')
        raw = json.loads(path.read_text(encoding='utf-8-sig'))
        layout = compile_layout(raw)
        homes = [u for u in layout['units'] if u['typeid'] // 100 == 201]
        if len(homes) != 1:
            raise ValueError('Each scout layout must contain exactly one headquarters')
        validate_scout_terrain(raw)
        levels.append({'id': key, 'headquartersLevel': homes[0]['typeid'] % 100, 'layout': layout})
    return {'policy': policy, 'levels': levels}


def render_pool(source, pool):
    payload = json.dumps(pool, ensure_ascii=True, separators=(',', ':'))
    block = START + '\n        LocalNative.scoutLevelPool = ' + payload + ';\n' + END
    updated, count = re.subn(re.escape(START) + r'[\s\S]*?' + re.escape(END), lambda _: block, source)
    if count != 1:
        raise ValueError('Scout registry marker missing or duplicated')
    return updated


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    modes = parser.add_mutually_exclusive_group(required=True)
    modes.add_argument('--check', action='store_true')
    modes.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    pool = compile_pool(json.loads(MANIFEST.read_text(encoding='utf-8')))
    boot = ROOT / 'analysis/native_boot.js'
    source = boot.read_text(encoding='utf-8')
    updated = render_pool(source, pool)
    if args.apply:
        boot.write_text(updated, encoding='utf-8')
    elif updated != source:
        raise ValueError('Embedded scout pool is stale; run --apply')
    print(json.dumps({'valid': True, 'mode': pool['policy']['mode'],
                      'levels': [{'id': e['id'], 'headquartersLevel': e['headquartersLevel']}
                                 for e in pool['levels']], 'applied': args.apply}))


if __name__ == '__main__':
    main()
