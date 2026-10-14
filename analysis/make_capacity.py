"""Generate the capacity variant from the verified upgrade boot script."""
from pathlib import Path

W = Path(__file__).resolve().parent
s = (W / 'upgrade_boot.js').read_text(encoding='utf-8')


def replace(a, b):
    global s
    assert a in s, a
    s = s.replace(a, b)


replace(
    "var saveKey = 'dino.local.city.v3';\n"
    "        var upgradeTypes={'20101':'20102','20201':'20202','20401':'20402'};",
    "var saveKey = 'dino.local.city.v4';\n"
    "        var upgradeTypes={'20101':'20102','20201':'20202','20301':'20302',"
    "'20401':'20402','20501':'20502'};\n"
    "        var allowedTypes=function(base){\n"
    "            var out={},cur=base;out[cur]=true;\n"
    "            while(upgradeTypes[cur]){cur=upgradeTypes[cur];out[cur]=true;}\n"
    "            return out;\n"
    "        };",
)
replace("value.version !== 3", "value.version !== 4")
replace(
    "(b.type !== defaults[i][0] && b.type !== upgradeTypes[defaults[i][0]])",
    "!allowedTypes(defaults[i][0])[b.type]",
)
replace(
    "var oldRaw=sys.localStorage.getItem('dino.local.city.v2') || sys.localStorage.getItem('dino.local.city.v1');",
    "var oldRaw=sys.localStorage.getItem('dino.local.city.v3') || "
    "sys.localStorage.getItem('dino.local.city.v2') || "
    "sys.localStorage.getItem('dino.local.city.v1');",
)
replace(
    "if(localState.version!==1 && localState.version!==2)",
    "if(localState.version!==1 && localState.version!==2 && localState.version!==3)",
)
replace(
    "localState.version=3;localState.resources=localState.resources||{gold:0,wood:0};"
    "localState.production=localState.production||{};",
    "localState.version=4;localState.resources=localState.resources||{gold:0,wood:0};"
    "localState.production=localState.production||{};",
)
replace(
    "else if(confirmUid===b.uid)info='\\u5347\\u81f3\\u4e8c\\u7ea7\\uff1a'+builder.getRealCost()"
    "+(builder.resType===RES_TYPE_GOLD?' \\u9f99\\u5e01':' \\u65e5\\u5149')"
    "+' \\xb7 '+builder.buildTime+' \\u79d2 \\xb7 \\u518d\\u70b9\\u786e\\u8ba4';",
    "else if(confirmUid===b.uid){\n"
    "                    var targetLv=data.unit_main[upgradeTypes[b.type]].lv;\n"
    "                    info='\\u5347\\u81f3'+targetLv+'\\u7ea7\\uff1a'+builder.getRealCost()"
    "+(builder.resType===RES_TYPE_GOLD?' \\u9f99\\u5e01':' \\u65e5\\u5149')"
    "+' \\xb7 '+builder.buildTime+' \\u79d2 \\xb7 \\u518d\\u70b9\\u786e\\u8ba4';\n"
    "                }else if(!moving){\n"
    "                    var sc=data.unit_main[b.type];\n"
    "                    if(sc.wood_storage||sc.gold_storage)\n"
    "                        info='\\u4ed3\\u5e93\\u63d0\\u4f9b \\u65e5\\u5149 '+(sc.wood_storage||0)"
    "+' / \\u9f99\\u5e01 '+(sc.gold_storage||0);\n"
    "                }",
)
replace(
    "if(!upgradeTypes[b.type]){confirmUid=null;status.setString("
    "'\\u672c\\u6b21\\u652f\\u6301\\u9f99\\u9996\\u4e4b\\u57ce\\u3001\\u65e5\\u5149\\u4e95\\u548c"
    "\\u9f99\\u94f6\\u77ff\\u5347\\u5230\\u4e8c\\u7ea7');return;}",
    "if(!upgradeTypes[b.type]){confirmUid=null;status.setString("
    "'\\u672c\\u6b21\\u652f\\u6301\\u4e3b\\u57ce\\u3001\\u751f\\u4ea7\\u4e0e\\u4ed3\\u5e93"
    "\\u5efa\\u7b51\\u5347\\u5230\\u4e8c\\u7ea7');return;}",
)
replace("local-upgrade-ready", "local-capacity-ready")
replace(
    "\\u672c\\u5730\\u5efa\\u7b51\\u5347\\u7ea7\\u6d4b\\u8bd5",
    "\\u672c\\u5730\\u4ed3\\u5e93\\u5bb9\\u91cf\\u6d4b\\u8bd5",
)

(W / 'capacity_boot.js').write_text(
    s.encode('ascii', 'backslashreplace').decode('ascii'), encoding='ascii'
)
builder = (
    (W / 'build_upgrade.py')
    .read_text(encoding='utf-8')
    .replace('dino-local-upgrade.apk', 'dino-local-capacity.apk')
    .replace('upgrade_boot.js', 'capacity_boot.js')
)
(W / 'build_capacity.py').write_text(builder, encoding='utf-8')
print('Generated capacity_boot.js and build_capacity.py')
