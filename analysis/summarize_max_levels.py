import json
from pathlib import Path

d = json.loads(Path(__file__).with_name('max-native-configs.json').read_text(encoding='utf-8'))
by = {c['id']: c for c in d['configs']}
print('upgradeTypes', len(d['upgradeTypes']))
print('--- summary per family max ---')
for fam, ids in d['chains'].items():
    last = by[ids[-1]]
    print(
        fam,
        'max',
        last['id'],
        'lv',
        last['lv'],
        'able',
        last.get('lv_up_able'),
        'wprod',
        last.get('wood_produce'),
        'gprod',
        last.get('gold_produce'),
        'temp',
        last.get('temp_storage'),
        'wst',
        last.get('wood_storage'),
        'gst',
        last.get('gold_storage'),
    )
print('--- remaining steps after previous level5 package ---')
for cur, nxt in sorted(d['upgradeTypes'].items()):
    lv = int(cur[-2:])
    if not (
        lv >= 5
        or (cur.startswith('206') and lv >= 4)
        or (cur.startswith('207') and lv >= 4)
    ):
        continue
    c = by[cur]
    n = by[nxt]
    print(
        f"{cur}->{nxt} cost={c.get('lv_up_cost')} ctype={c.get('lv_up_cost_type')} "
        f"time={c.get('lv_up_time')} rely={c.get('rely_base_lv')} "
        f"=> lv{n.get('lv')} wprod={n.get('wood_produce')} gprod={n.get('gold_produce')} "
        f"temp={n.get('temp_storage')} wst={n.get('wood_storage')} gst={n.get('gold_storage')}"
    )
wood = (by['20110'].get('wood_storage') or 0) + (by['20310'].get('wood_storage') or 0)
gold = (by['20110'].get('gold_storage') or 0) + (by['20510'].get('gold_storage') or 0)
print('max capacity gold', gold, 'wood', wood)
print(
    'max produce wood',
    by['20210'].get('wood_produce'),
    'gold',
    by['20410'].get('gold_produce'),
    'temp',
    by['20210'].get('temp_storage'),
)
