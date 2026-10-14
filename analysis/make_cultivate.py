"""Generate the cultivate-info variant from the verified max-level boot script.

Adds read-only capacity display for 驯龙场 (egg/soldier) and 龙英巢
(hero attack slots from data.hero_number). Does not change the save key,
upgrade state machine, or call SoldierTrainer.train / HeroManager RPCs.
"""
from pathlib import Path

W = Path(__file__).resolve().parent
s = (W / 'max_boot.js').read_text(encoding='utf-8')


def replace(a, b):
    global s
    assert a in s, repr(a[:80])
    s = s.replace(a, b)


OLD_INFO = (
    "                }else if(!moving){\n"
    "                    var sc=data.unit_main[b.type];\n"
    "                    if(sc.wood_storage||sc.gold_storage)\n"
    "                        info='\\u4ed3\\u5e93\\u63d0\\u4f9b \\u65e5\\u5149 '+"
    "(sc.wood_storage||0)+' / \\u9f99\\u5e01 '+(sc.gold_storage||0);\n"
    "                }"
)

NEW_INFO = (
    "                }else if(!moving){\n"
    "                    var sc=data.unit_main[b.type];\n"
    "                    if(sc.wood_storage||sc.gold_storage)\n"
    "                        info='\\u4ed3\\u5e93\\u63d0\\u4f9b \\u65e5\\u5149 '+"
    "(sc.wood_storage||0)+' / \\u9f99\\u5e01 '+(sc.gold_storage||0);\n"
    "                    else if(String(b.type).indexOf('207')===0)\n"
    "                        info='\\u86cb\\u5bb9\\u91cf '+(sc.egg_storage||0)+"
    "' \\xb7 \\u5175\\u5bb9\\u91cf '+(sc.item_storage||0)+"
    "' \\xb7 \\u86cb\\u65f6 '+(sc.egg_time||0)+'\\u79d2'"
    "+(sc.villager_storage?(' \\xb7 \\u6751\\u6c11 '+(sc.villager_storage||0)):'');\n"
    "                    else if(String(b.type).indexOf('206')===0){\n"
    "                        var cityLv=data.unit_main[localState.buildings[0].type].lv;\n"
    "                        var hn=data.hero_number[cityLv]||data.hero_number[String(cityLv)]||{};\n"
    "                        info='\\u51fa\\u6218\\u680f '+(hn.hero_attack_num||0)+"
    "' \\xb7 \\u82f1\\u96c4\\u7b49\\u7ea7\\u4e0a\\u9650 '+(hn.hero_lv_max||0)+"
    "' \\xb7 \\u7ecf\\u9a8c '+(sc.hero_exp||0);\n"
    "                    }\n"
    "                }"
)

replace(OLD_INFO, NEW_INFO)
replace(
    "var status=label('\\u9009\\u62e9\\u65e5\\u5149\\u4e95\\u6216\\u9f99\\u94f6\\u77ff"
    "\\u53ef\\u91c7\\u96c6\\u8d44\\u6e90',size.width/2,59,19);",
    "var status=label('\\u9009\\u62e9\\u9a6f\\u9f99\\u573a\\u6216\\u9f99\\u82f1\\u5de2"
    "\\u53ef\\u67e5\\u770b\\u5bb9\\u91cf',size.width/2,59,19);",
)
replace("local-max-ready", "local-cultivate-ready")
replace(
    "\\u672c\\u5730\\u6ee1\\u7ea7\\u5347\\u7ea7\\u6d4b\\u8bd5",
    "\\u672c\\u5730\\u517b\\u6210\\u5bb9\\u91cf\\u6d4b\\u8bd5",
)

(W / 'cultivate_boot.js').write_text(
    s.encode('ascii', 'backslashreplace').decode('ascii'), encoding='ascii'
)
builder = (
    (W / 'build_max.py')
    .read_text(encoding='utf-8')
    .replace('dino-local-max.apk', 'dino-local-cultivate.apk')
    .replace('max_boot.js', 'cultivate_boot.js')
)
(W / 'build_cultivate.py').write_text(builder, encoding='utf-8')
print('Generated cultivate_boot.js and build_cultivate.py')
