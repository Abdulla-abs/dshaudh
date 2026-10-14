"""Generate the level-3 upgrade variant from the verified capacity boot script."""
from pathlib import Path

W = Path(__file__).resolve().parent
s = (W / 'capacity_boot.js').read_text(encoding='utf-8')


def replace(a, b):
    global s
    assert a in s, a
    s = s.replace(a, b)


replace(
    "var saveKey = 'dino.local.city.v4';\n"
    "        var upgradeTypes={'20101':'20102','20201':'20202','20301':'20302',"
    "'20401':'20402','20501':'20502'};",
    "var saveKey = 'dino.local.city.v5';\n"
    "        var upgradeTypes={"
    "'20101':'20102','20102':'20103',"
    "'20201':'20202','20202':'20203',"
    "'20301':'20302','20302':'20303',"
    "'20401':'20402','20402':'20403',"
    "'20501':'20502','20502':'20503',"
    "'20601':'20602','20701':'20702'};",
)
replace("value.version !== 4", "value.version !== 5")
replace(
    "var oldRaw=sys.localStorage.getItem('dino.local.city.v3') || "
    "sys.localStorage.getItem('dino.local.city.v2') || "
    "sys.localStorage.getItem('dino.local.city.v1');",
    "var oldRaw=sys.localStorage.getItem('dino.local.city.v4') || "
    "sys.localStorage.getItem('dino.local.city.v3') || "
    "sys.localStorage.getItem('dino.local.city.v2') || "
    "sys.localStorage.getItem('dino.local.city.v1');",
)
replace(
    "if(localState.version!==1 && localState.version!==2 && localState.version!==3)",
    "if(localState.version!==1 && localState.version!==2 && localState.version!==3 && localState.version!==4)",
)
replace(
    "localState.version=4;localState.resources=localState.resources||{gold:0,wood:0};"
    "localState.production=localState.production||{};",
    "localState.version=5;localState.resources=localState.resources||{gold:0,wood:0};"
    "localState.production=localState.production||{};",
)
replace(
    "if(!upgradeTypes[b.type]){confirmUid=null;status.setString("
    "'\\u672c\\u6b21\\u652f\\u6301\\u4e3b\\u57ce\\u3001\\u751f\\u4ea7\\u4e0e\\u4ed3\\u5e93"
    "\\u5efa\\u7b51\\u5347\\u5230\\u4e8c\\u7ea7');return;}",
    "if(!upgradeTypes[b.type]){confirmUid=null;status.setString("
    "'\\u672c\\u6b21\\u652f\\u6301\\u4e3b\\u57ce\\u3001\\u751f\\u4ea7\\u3001\\u4ed3\\u5e93"
    "\\u5347\\u5230\\u4e09\\u7ea7\\uff0c\\u9f99\\u82f1\\u5de2\\u4e0e\\u9a6f\\u9f99\\u573a"
    "\\u5347\\u5230\\u4e8c\\u7ea7');return;}",
)
replace("local-capacity-ready", "local-level3-ready")
replace(
    "\\u672c\\u5730\\u4ed3\\u5e93\\u5bb9\\u91cf\\u6d4b\\u8bd5",
    "\\u672c\\u5730\\u4e09\\u7ea7\\u5347\\u7ea7\\u6d4b\\u8bd5",
)

(W / 'level3_boot.js').write_text(
    s.encode('ascii', 'backslashreplace').decode('ascii'), encoding='ascii'
)
builder = (
    (W / 'build_capacity.py')
    .read_text(encoding='utf-8')
    .replace('dino-local-capacity.apk', 'dino-local-level3.apk')
    .replace('capacity_boot.js', 'level3_boot.js')
)
(W / 'build_level3.py').write_text(builder, encoding='utf-8')
print('Generated level3_boot.js and build_level3.py')
