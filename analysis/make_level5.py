"""Generate the level-5 upgrade variant from the verified level-4 boot script."""
from pathlib import Path

W = Path(__file__).resolve().parent
s = (W / 'level4_boot.js').read_text(encoding='utf-8')


def replace(a, b):
    global s
    assert a in s, a
    s = s.replace(a, b)


replace(
    "var saveKey = 'dino.local.city.v6';\n"
    "        var upgradeTypes={"
    "'20101':'20102','20102':'20103','20103':'20104',"
    "'20201':'20202','20202':'20203','20203':'20204',"
    "'20301':'20302','20302':'20303','20303':'20304',"
    "'20401':'20402','20402':'20403','20403':'20404',"
    "'20501':'20502','20502':'20503','20503':'20504',"
    "'20601':'20602','20602':'20603',"
    "'20701':'20702','20702':'20703'};",
    "var saveKey = 'dino.local.city.v7';\n"
    "        var upgradeTypes={"
    "'20101':'20102','20102':'20103','20103':'20104','20104':'20105',"
    "'20201':'20202','20202':'20203','20203':'20204','20204':'20205',"
    "'20301':'20302','20302':'20303','20303':'20304','20304':'20305',"
    "'20401':'20402','20402':'20403','20403':'20404','20404':'20405',"
    "'20501':'20502','20502':'20503','20503':'20504','20504':'20505',"
    "'20601':'20602','20602':'20603','20603':'20604',"
    "'20701':'20702','20702':'20703','20703':'20704'};",
)
replace("value.version !== 6", "value.version !== 7")
replace(
    "var oldRaw=sys.localStorage.getItem('dino.local.city.v5') || "
    "sys.localStorage.getItem('dino.local.city.v4') || "
    "sys.localStorage.getItem('dino.local.city.v3') || "
    "sys.localStorage.getItem('dino.local.city.v2') || "
    "sys.localStorage.getItem('dino.local.city.v1');",
    "var oldRaw=sys.localStorage.getItem('dino.local.city.v6') || "
    "sys.localStorage.getItem('dino.local.city.v5') || "
    "sys.localStorage.getItem('dino.local.city.v4') || "
    "sys.localStorage.getItem('dino.local.city.v3') || "
    "sys.localStorage.getItem('dino.local.city.v2') || "
    "sys.localStorage.getItem('dino.local.city.v1');",
)
replace(
    "if(localState.version!==1 && localState.version!==2 && localState.version!==3 && localState.version!==4 && localState.version!==5)",
    "if(localState.version!==1 && localState.version!==2 && localState.version!==3 && localState.version!==4 && localState.version!==5 && localState.version!==6)",
)
replace(
    "localState.version=6;localState.resources=localState.resources||{gold:0,wood:0};"
    "localState.production=localState.production||{};",
    "localState.version=7;localState.resources=localState.resources||{gold:0,wood:0};"
    "localState.production=localState.production||{};",
)
replace(
    "if(!upgradeTypes[b.type]){confirmUid=null;status.setString("
    "'\\u672c\\u6b21\\u652f\\u6301\\u4e3b\\u57ce\\u3001\\u751f\\u4ea7\\u3001\\u4ed3\\u5e93"
    "\\u5347\\u5230\\u56db\\u7ea7\\uff0c\\u9f99\\u82f1\\u5de2\\u4e0e\\u9a6f\\u9f99\\u573a"
    "\\u5347\\u5230\\u4e09\\u7ea7');return;}",
    "if(!upgradeTypes[b.type]){confirmUid=null;status.setString("
    "'\\u672c\\u6b21\\u652f\\u6301\\u4e3b\\u57ce\\u3001\\u751f\\u4ea7\\u3001\\u4ed3\\u5e93"
    "\\u5347\\u5230\\u4e94\\u7ea7\\uff0c\\u9f99\\u82f1\\u5de2\\u4e0e\\u9a6f\\u9f99\\u573a"
    "\\u5347\\u5230\\u56db\\u7ea7');return;}",
)
replace("local-level4-ready", "local-level5-ready")
replace(
    "\\u672c\\u5730\\u56db\\u7ea7\\u5347\\u7ea7\\u6d4b\\u8bd5",
    "\\u672c\\u5730\\u4e94\\u7ea7\\u5347\\u7ea7\\u6d4b\\u8bd5",
)

(W / 'level5_boot.js').write_text(
    s.encode('ascii', 'backslashreplace').decode('ascii'), encoding='ascii'
)
builder = (
    (W / 'build_level4.py')
    .read_text(encoding='utf-8')
    .replace('dino-local-level4.apk', 'dino-local-level5.apk')
    .replace('level4_boot.js', 'level5_boot.js')
)
(W / 'build_level5.py').write_text(builder, encoding='utf-8')
print('Generated level5_boot.js and build_level5.py')
