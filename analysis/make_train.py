"""Generate the local training-queue variant from the verified cultivate boot script.

Adds a local training queue on 驯龙场 (family 207): pick a 114-family soldier,
pay the original table cost, wait the original train_time, and receive one
soldier into the local barracks. Egg storage from 207's `egg_storage` limits
the queue; `item_storage` limits the trained soldiers.

Does not call Comp.SoldierTrainer.train(), the server RPCs, or HeroManager.
The queue lives entirely in the local save under dino.local.city.v9.
"""
from pathlib import Path

W = Path(__file__).resolve().parent
s = (W / 'cultivate_boot.js').read_text(encoding='utf-8')


def replace(a, b):
    global s
    assert a in s, repr(a[:120])
    s = s.replace(a, b)


# ---------------------------------------------------------------- save v9
replace("var saveKey = 'dino.local.city.v8';", "var saveKey = 'dino.local.city.v9';")
replace("value.version !== 8", "value.version !== 9")
replace(
    "var oldRaw=sys.localStorage.getItem('dino.local.city.v7') || ",
    "var oldRaw=sys.localStorage.getItem('dino.local.city.v8') || "
    "sys.localStorage.getItem('dino.local.city.v7') || ",
)
replace(
    "if(localState.version!==1 && localState.version!==2 && localState.version!==3 && "
    "localState.version!==4 && localState.version!==5 && localState.version!==6 && "
    "localState.version!==7)throw Error('Invalid legacy save');",
    "if(localState.version!==1 && localState.version!==2 && localState.version!==3 && "
    "localState.version!==4 && localState.version!==5 && localState.version!==6 && "
    "localState.version!==7 && localState.version!==8)throw Error('Invalid legacy save');",
)
replace("localState.version=8;", "localState.version=9;")
replace(
    "localState.production=localState.production||{};",
    "localState.production=localState.production||{};localState.training=localState.training||{};",
)

# ------------------------------------------------- training config + validation
# TRAIN_TYPE_ID_LIST in the original is [114,120,101,102]. This build wires the
# 114 family only; the others still need per-family unlock checks.
TRAIN_BLOCK = (
    "        var TRAIN_FAMILY='114';\n"
    "        var trainTypes=(function(){\n"
    "            var ids=[];\n"
    "            for(var n=1;n<=10;n++){var id=TRAIN_FAMILY+('0'+n).slice(-2);"
    "if(data.unit_main[id])ids.push(id);}\n"
    "            return ids;\n"
    "        })();\n"
    "        var TRAIN_MAX_BUFFER=1;\n"
)

replace(
    "        var nowSec=function(){return DA.getSystemCurrentTimeSec();};",
    TRAIN_BLOCK + "        var nowSec=function(){return DA.getSystemCurrentTimeSec();};",
)

# Validate the new training field inside validate().
replace(
    "            var active=0;\n"
    "            for(var ui=0;ui<value.buildings.length;ui++){",
    "            var jobs=value.training||{};\n"
    "            for(var tk in jobs){\n"
    "                var jl=jobs[tk],jb=null;\n"
    "                if(!jl || typeof jl.typeid!=='string' || trainTypes.indexOf(jl.typeid)<0 ||\n"
    "                    typeof jl.started!=='number' || !isFinite(jl.started) || jl.started<0 ||\n"
    "                    typeof jl.ends!=='number' || !isFinite(jl.ends) ||\n"
    "                    jl.ends!==jl.started+data.unit_main[jl.typeid].train_time)\n"
    "                    throw Error('Invalid training job '+tk);\n"
    "                for(var bi2=0;bi2<value.buildings.length;bi2++)\n"
    "                    if(value.buildings[bi2].uid===tk)jb=value.buildings[bi2];\n"
    "                if(!jb || String(jb.type).indexOf('207')!==0) throw Error('Training on non-barracks '+tk);\n"
    "            }\n"
    "            var active=0;\n"
    "            for(var ui=0;ui<value.buildings.length;ui++){",
)

# Trained-soldier counts must be sane non-negative integers per barracks.
replace(
    "            if(typeof value.revision!=='number'",
    "            for(var si=0;si<value.buildings.length;si++){\n"
    "                var sb=value.buildings[si];\n"
    "                if(String(sb.type).indexOf('207')!==0)continue;\n"
    "                var held=(value.soldiers||{})[sb.uid];\n"
    "                if(held===undefined)continue;\n"
    "                if(typeof held!=='number' || !isFinite(held) || held<0 || Math.floor(held)!==held ||\n"
    "                    held>data.unit_main[sb.type].item_storage)\n"
    "                    throw Error('Invalid soldier count '+sb.uid);\n"
    "            }\n"
    "            if(typeof value.revision!=='number'",
)

# ------------------------------------------------------------- settle training
# Completing a job moves it from training[] into soldiers[] on the same barracks.
replace(
    "            if(next){next.revision++;persist(next);}\n"
    "            return changed;\n"
    "        };\n"
    "        settle();",
    "            var trainDone=[];\n"
    "            for(var tk2 in localState.training){\n"
    "                var tj=localState.training[tk2];\n"
    "                if(nowSec()<tj.ends)continue;\n"
    "                if(!next)next=JSON.parse(JSON.stringify(localState));\n"
    "                next.soldiers=next.soldiers||{};\n"
    "                next.soldiers[tk2]=(next.soldiers[tk2]||0)+1;\n"
    "                delete next.training[tk2];\n"
    "                trainDone.push(tk2);\n"
    "            }\n"
    "            if(next){next.revision++;persist(next);}\n"
    "            return {buildings:changed,training:trainDone};\n"
    "        };\n"
    "        settle();",
)

# settle() now returns an object; the scheduler and entry path read .buildings.
replace(
    "                    var changed=settle();\n"
    "                    for(var i=0;i<nodes.length;i++)if(changed.indexOf(nodes[i].uid)>=0)refreshItem(nodes[i]);\n"
    "                    if(changed.length || (++displayTicks%2===0 && selected && !moving))showSelected();",
    "                    var res=settle(),changed=res.buildings;\n"
    "                    for(var i=0;i<nodes.length;i++)if(changed.indexOf(nodes[i].uid)>=0)refreshItem(nodes[i]);\n"
    "                    if(changed.length)refreshSoldierBadges();\n"
    "                    if(res.training.length){\n"
    "                        refreshSoldierBadges();\n"
    "                        status.setString('\\u8bad\\u7ec3\\u5b8c\\u6210\\uff1a\\u5df2\\u5165\\u4f4f "
    "1 \\u540d\\u58eb\\u5175');\n"
    "                    }\n"
    "                    if(changed.length || res.training.length || "
    "(++displayTicks%2===0 && selected && !moving))showSelected();",
)
replace(
    "            settle();syncWallet();",
    "            settle();syncWallet();",
)

# ------------------------------------------------------------------ train logic
TRAIN_UI = (
    "            var soldiersOf=function(uid){return (localState.soldiers||{})[uid]||0;};\n"
    "            var barracksItem=function(){\n"
    "                if(!selected)return null;\n"
    "                return String(buildingOf(localState,selected.uid).type).indexOf('207')===0?selected:null;\n"
    "            };\n"
    "            var trainInfo=function(item){\n"
    "                var b=buildingOf(localState,item.uid),cfg=data.unit_main[b.type];\n"
    "                var job=localState.training[item.uid];\n"
    "                var held=soldiersOf(item.uid),cap=cfg.item_storage||0;\n"
    "                if(job){\n"
    "                    var left=Math.max(0,job.ends-nowSec());\n"
    "                    return '\\u8bad\\u7ec3\\u4e2d '+(data.unit_main[job.typeid]?"
    "data.unit_main[job.typeid].lv:0)+'\\u7ea7\\u5175 \\xb7 \\u5269\\u4f59 '"
    "+Math.ceil(left)+' \\u79d2 \\xb7 \\u5df2\\u5165\\u4f4f '+held+'/'+cap;\n"
    "                }\n"
    "                return '\\u58eb\\u5175 '+held+'/'+cap+' \\xb7 \\u86cb\\u4f4d '+"
    "(job?1:0)+'/'+TRAIN_MAX_BUFFER;\n"
    "            };\n"
    "            var nextTrainType=function(){\n"
    "                var lv=data.unit_main[buildingOf(localState,selected.uid).type].lv-1;\n"
    "                return trainTypes[Math.min(trainTypes.length-1,Math.max(0,lv))];\n"
    "            };\n"
    "            var trainCost=function(typeid){return data.unit_main[typeid].train_cost;};\n"
    "            var train=function(){\n"
    "                var item=barracksItem();\n"
    "                if(!item){status.setString('\\u8bf7\\u5148\\u9009\\u62e9\\u9a6f\\u9f99\\u573a');return;}\n"
    "                if(moving){status.setString('\\u8bf7\\u5148\\u7ed3\\u675f\\u79fb\\u52a8');return;}\n"
    "                var b=buildingOf(localState,item.uid);\n"
    "                if(b.upgrade){status.setString('\\u5347\\u7ea7\\u671f\\u95f4\\u4e0d\\u80fd\\u8bad\\u7ec3');return;}\n"
    "                if(localState.training[item.uid]){status.setString('\\u86cb\\u4f4d\\u5df2\\u6ee1\\uff0c"
    "\\u8bf7\\u7b49\\u5f85\\u5f53\\u524d\\u8bad\\u7ec3\\u5b8c\\u6210');return;}\n"
    "                var cfg=data.unit_main[b.type],held=soldiersOf(item.uid);\n"
    "                if(held+1>(cfg.item_storage||0)){status.setString('\\u58eb\\u5175\\u5df2\\u6ee1\\uff0c"
    "\\u8bf7\\u5148\\u817e\\u51fa\\u4f4d\\u7f6e');return;}\n"
    "                var typeid=nextTrainType(),tc=data.unit_main[typeid],cost=trainCost(typeid);\n"
    "                if(localState.resources.wood<cost){status.setString('\\u8d44\\u6e90\\u4e0d\\u8db3\\uff0c"
    "\\u9700\\u8981 '+cost+' \\u65e5\\u5149');return;}\n"
    "                var next=JSON.parse(JSON.stringify(localState)),start=nowSec();\n"
    "                next.resources.wood-=cost;\n"
    "                next.training[item.uid]={typeid:typeid,started:start,ends:start+tc.train_time};\n"
    "                next.revision++;\n"
    "                try{persist(next);}catch(e){status.setString('\\u4fdd\\u5b58\\u5931\\u8d25\\uff0c"
    "\\u8bad\\u7ec3\\u672a\\u5f00\\u59cb');cc.log('DinoLocal save failed: '+e);return;}\n"
    "                showSelected();status.setString('\\u5df2\\u5f00\\u59cb\\u8bad\\u7ec3 '+tc.lv+"
    "'\\u7ea7\\u5175 \\xb7 \\u6d88\\u8017 '+cost+' \\u65e5\\u5149 \\xb7 '+tc.train_time+' \\u79d2');\n"
    "            };\n"
)

replace(
    "            var upgrade=function(){",
    TRAIN_UI + "            var upgrade=function(){",
)

# Show training state in the selection line for barracks.
replace(
    "                    else if(String(b.type).indexOf('207')===0)\n"
    "                        info='\\u86cb\\u5bb9\\u91cf '+(sc.egg_storage||0)+",
    "                    else if(String(b.type).indexOf('207')===0)\n"
    "                        info='\\u86cb\\u5bb9\\u91cf '+(sc.egg_storage||0)+",
)
PRODUCER_INFO = (
    "                if(selected.producer && !moving)info="
    "'\\u5f85\\u91c7\\u96c6 '+producerAmount(selected)+'/'+selected.producer.maxStorage+"
    "' \\u00b7 '+selected.producer.produceSpeed+'/\\u5c0f\\u65f6';"
)
# NOTE: `b` is declared further down in showSelected(), so the barracks branch
# must live inside the existing `else if(!moving)` chain (which runs after `b`
# exists) rather than as a trailing else-if on the producer line.
ORIG_BARRACKS = (
    "                    else if(String(b.type).indexOf('207')===0)\n"
    "                        info='\\u86cb\\u5bb9\\u91cf '+(sc.egg_storage||0)+"
    "' \\xb7 \\u5175\\u5bb9\\u91cf '+(sc.item_storage||0)+"
    "' \\xb7 \\u86cb\\u65f6 '+(sc.egg_time||0)+'\\u79d2'"
    "+(sc.villager_storage?(' \\xb7 \\u6751\\u6c11 '+(sc.villager_storage||0)):'');\n"
)
assert ORIG_BARRACKS in s, 'barracks info branch not found'
# Replace (not append) so the branch stays reachable: a trailing else-if on the
# same condition would be dead code and the countdown would never display.
BARRACKS_WITH_TRAIN = (
    "                    else if(String(b.type).indexOf('207')===0)\n"
    "                        info=(localState.training[b.uid]||soldiersOf(b.uid))"
    "?trainInfo(selected):('\\u86cb\\u5bb9\\u91cf '+(sc.egg_storage||0)+"
    "' \\xb7 \\u5175\\u5bb9\\u91cf '+(sc.item_storage||0)+"
    "' \\xb7 \\u86cb\\u65f6 '+(sc.egg_time||0)+'\\u79d2'"
    "+(sc.villager_storage?(' \\xb7 \\u6751\\u6c11 '+(sc.villager_storage||0)):''));\n"
)
replace(ORIG_BARRACKS, BARRACKS_WITH_TRAIN)

# ------------------------------------------- soldier badge on each barracks node
# Reuse the marker label slot: show trained soldier counts above each barracks.
BADGE = (
    "            var refreshSoldierBadges=function(){\n"
    "                for(var i=0;i<nodes.length;i++){\n"
    "                    var n=nodes[i];\n"
    "                    if(String(buildingOf(localState,n.uid).type).indexOf('207')!==0){\n"
    "                        if(n.badge){n.badge.removeFromParent();n.badge=null;}\n"
    "                        continue;\n"
    "                    }\n"
    "                    if(!n.badge){n.badge=cc.LabelTTF.create('','Arial',22);map.addChild(n.badge,10000);}\n"
    "                    var cfg=data.unit_main[buildingOf(localState,n.uid).type];\n"
    "                    var txt=soldiersOf(n.uid)+'/'+(cfg.item_storage||0);\n"
    "                    if(localState.training[n.uid])txt+=' \\u23f3';\n"
    "                    n.badge.setString(txt);n.badge.setPosition(n.x,n.y+250);\n"
    "                }\n"
    "            };\n"
)
# Anchor on the end of upgrade(): the trailing showSelected() there is the one
# that runs on the main scene scope. The earlier showSelected() call inside
# upgrade() must stay untouched, so match the closing brace sequence.
UPGRADE_TAIL = (
    "                try{persist(next);}catch(e){status.setString("
    "'\\u4fdd\\u5b58\\u5931\\u8d25\\uff0c\\u5347\\u7ea7\\u672a\\u5b8c\\u6210');"
    "cc.log('DinoLocal save failed: '+e);return;}\n"
    "                showSelected();\n"
    "            };\n"
)
assert UPGRADE_TAIL in s, 'upgrade tail not found'
replace(UPGRADE_TAIL, UPGRADE_TAIL + BADGE)

# ------------------------------------------------------------ footer + buttons
# Shift the three footer actions left and add 训练士兵 on the right.
replace(
    "            var action=label('\\u79fb\\u52a8\\u5efa\\u7b51',size.width*.18,23,22);\n"
    "\n"
    "            var collectLabel=label('\\u91c7\\u96c6\\u8d44\\u6e90',size.width*.5,23,22);\n"
    "            var upgradeLabel=label('\\u5347\\u7ea7\\u5efa\\u7b51',size.width*.82,23,22);",
    "            var action=label('\\u79fb\\u52a8\\u5efa\\u7b51',size.width*.13,23,22);\n"
    "\n"
    "            var collectLabel=label('\\u91c7\\u96c6\\u8d44\\u6e90',size.width*.37,23,22);\n"
    "            var upgradeLabel=label('\\u5347\\u7ea7\\u5efa\\u7b51',size.width*.61,23,22);\n"
    "            var trainLabel=label('\\u8bad\\u7ec3\\u58eb\\u5175',size.width*.85,23,22);",
)

replace(
    "                collectLabel.setColor(selected.producer && !moving && !b.upgrade?"
    "{r:255,g:235,b:130}:{r:150,g:150,b:150});",
    "                collectLabel.setColor(selected.producer && !moving && !b.upgrade?"
    "{r:255,g:235,b:130}:{r:150,g:150,b:150});\n"
    "                var isBarracks=String(b.type).indexOf('207')===0;\n"
    "                trainLabel.setColor(isBarracks && !moving && !b.upgrade && "
    "!localState.training[b.uid]?{r:255,g:235,b:130}:{r:150,g:150,b:150});",
)

# Footer hit testing: 0-27 move, 27-49 collect, 49-71 upgrade, >71 train.
replace(
    "                if(p.y<86){\n"
    "                    if(p.x>size.width*.67){upgrade();return;}\n"
    "                    if(p.x>size.width*.33){collect();return;}\n"
    "                    confirmUid=null;",
    "                if(p.y<86){\n"
    "                    if(p.x>size.width*.73){train();return;}\n"
    "                    if(p.x>size.width*.49){upgrade();return;}\n"
    "                    if(p.x>size.width*.27){collect();return;}\n"
    "                    confirmUid=null;",
)

# Keep badges positioned after a building moves.
replace(
    "                selected.x=x;selected.y=y;selected.node.setPosition(x,y);"
    "selected.node.setZOrder(3000-y);\n"
    "                moving=false;showSelected();",
    "                selected.x=x;selected.y=y;selected.node.setPosition(x,y);"
    "selected.node.setZOrder(3000-y);\n"
    "                moving=false;refreshSoldierBadges();showSelected();",
)

# Draw badges initially.
replace(
    "            touch.enableTouchEvent();",
    "            touch.enableTouchEvent();\n            refreshSoldierBadges();",
)

# The hint line should mention training as well.
replace(
    "var status=label('\\u9009\\u62e9\\u9a6f\\u9f99\\u573a\\u6216\\u9f99\\u82f1\\u5de2"
    "\\u53ef\\u67e5\\u770b\\u5bb9\\u91cf',size.width/2,59,19);",
    "var status=label('\\u9009\\u62e9\\u9a6f\\u9f99\\u573a\\u53ef\\u8bad\\u7ec3\\u58eb\\u5175',"
    "size.width/2,59,19);",
)

# --------------------------------------------------------------- log/status id
replace("local-cultivate-ready", "local-train-ready")
replace(
    "\\u672c\\u5730\\u517b\\u6210\\u5bb9\\u91cf\\u6d4b\\u8bd5",
    "\\u672c\\u5730\\u8bad\\u7ec3\\u961f\\u5217\\u6d4b\\u8bd5",
)

(W / 'train_boot.js').write_text(
    s.encode('ascii', 'backslashreplace').decode('ascii'), encoding='ascii'
)
builder = (
    (W / 'build_cultivate.py')
    .read_text(encoding='utf-8')
    .replace('dino-local-cultivate.apk', 'dino-local-train.apk')
    .replace('cultivate_boot.js', 'train_boot.js')
)
(W / 'build_train.py').write_text(builder, encoding='utf-8')
print('Generated train_boot.js and build_train.py')
