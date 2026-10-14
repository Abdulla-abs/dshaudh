"""Generate the dual production-building construction variant from construct_boot.js.

Extends the sunlight-well (202) local construction flow with 龙银矿 (204):
  - cost / time from BuildingBuilder on 20201 / 20401 (原表 lv_up_*)
  - count limits from data.build_number[202] and [204] by city hall level
  - resource type follows builder.resType (well=gold, mine=wood)
  - one shared worker with upgrades; tap build again while placing to switch type

Does not call Shop.buyBuilding / rpc_s_build. Save key bumps to v11.
"""
from pathlib import Path

W = Path(__file__).resolve().parent
s = (W / 'construct_boot.js').read_text(encoding='utf-8')


def replace(a, b):
    global s
    assert a in s, repr(a[:160])
    s = s.replace(a, b)


# ---------------------------------------------------------------- save v11
replace("var saveKey = 'dino.local.city.v10';", "var saveKey = 'dino.local.city.v11';")
replace("value.version !== 10", "value.version !== 11")
replace(
    "var oldRaw=sys.localStorage.getItem('dino.local.city.v9') || "
    "sys.localStorage.getItem('dino.local.city.v8') || ",
    "var oldRaw=sys.localStorage.getItem('dino.local.city.v10') || "
    "sys.localStorage.getItem('dino.local.city.v9') || "
    "sys.localStorage.getItem('dino.local.city.v8') || ",
)
replace(
    "if(localState.version!==1 && localState.version!==2 && localState.version!==3 && "
    "localState.version!==4 && localState.version!==5 && localState.version!==6 && "
    "localState.version!==7 && localState.version!==8 && localState.version!==9)"
    "throw Error('Invalid legacy save');",
    "if(localState.version!==1 && localState.version!==2 && localState.version!==3 && "
    "localState.version!==4 && localState.version!==5 && localState.version!==6 && "
    "localState.version!==7 && localState.version!==8 && localState.version!==9 && "
    "localState.version!==10)throw Error('Invalid legacy save');",
)
replace("localState.version=10;", "localState.version=11;")

# ---------------------------------------------- dual construct options
replace(
    "        var CONSTRUCT_TYPE='20201';\n"
    "        var CONSTRUCT_FAMILY='202';\n"
    "        var MAX_EXTRA=5;\n",
    "        var CONSTRUCT_OPTIONS=[\n"
    "            {type:'20201',family:'202',"
    "label:'\\u65e5\\u5149\\u4e95'},\n"
    "            {type:'20401',family:'204',"
    "label:'\\u9f99\\u94f6\\u77ff'}\n"
    "        ];\n"
    "        var MAX_EXTRA=10;\n"
    "        var constructPick=0;\n"
    "        var constructOption=function(){return CONSTRUCT_OPTIONS[constructPick];};\n"
    "        var extraAllowed=function(type){\n"
    "            for(var oi=0;oi<CONSTRUCT_OPTIONS.length;oi++)\n"
    "                if(allowedTypes(CONSTRUCT_OPTIONS[oi].type)[type])return true;\n"
    "            return false;\n"
    "        };\n"
    "        var nextConstructPick=function(state,from){\n"
    "            for(var i=0;i<CONSTRUCT_OPTIONS.length;i++){\n"
    "                var idx=(from+i)%CONSTRUCT_OPTIONS.length,opt=CONSTRUCT_OPTIONS[idx];\n"
    "                if(familyCount(state,opt.family)<maxFamily(state,opt.family))return idx;\n"
    "            }\n"
    "            return -1;\n"
    "        };\n"
    "        var constructResKey=function(builder){\n"
    "            return builder.resType===RES_TYPE_GOLD?'gold':'wood';\n"
    "        };\n"
    "        var constructResLabel=function(key){\n"
    "            return key==='gold'?'\\u9f99\\u5e01':'\\u65e5\\u5149';\n"
    "        };\n"
)

replace(
    "                    seenUid[eb.uid] || !allowedTypes(CONSTRUCT_TYPE)[eb.type] ||\n",
    "                    seenUid[eb.uid] || !extraAllowed(eb.type) ||\n",
)
replace(
    "            if(familyCount(value,CONSTRUCT_FAMILY)>maxFamily(value,CONSTRUCT_FAMILY))\n"
    "                throw Error('Too many family '+CONSTRUCT_FAMILY);\n",
    "            for(var fi2=0;fi2<CONSTRUCT_OPTIONS.length;fi2++){\n"
    "                var fam=CONSTRUCT_OPTIONS[fi2].family;\n"
    "                if(familyCount(value,fam)>maxFamily(value,fam))\n"
    "                    throw Error('Too many family '+fam);\n"
    "            }\n",
)

# -------------------------------------------------------------- build UI
replace(
    "            var build=function(){\n"
    "                if(placingNew){placingNew=false;showSelected();"
    "status.setString('\\u5df2\\u53d6\\u6d88\\u5efa\\u9020');return;}\n"
    "                if(moving){status.setString('\\u8bf7\\u5148\\u7ed3\\u675f\\u79fb\\u52a8');"
    "return;}\n"
    "                if(workerBusy(localState)){status.setString("
    "'\\u5efa\\u7b51\\u5e08\\u5fd9\\u788c\\uff0c\\u8bf7\\u7b49\\u5f85\\u5f53\\u524d"
    "\\u5efa\\u9020\\u6216\\u5347\\u7ea7\\u5b8c\\u6210');return;}\n"
    "                var held=familyCount(localState,CONSTRUCT_FAMILY),"
    "cap=maxFamily(localState,CONSTRUCT_FAMILY);\n"
    "                if(held>=cap){\n"
    "                    var need=null,bn=data.build_number[CONSTRUCT_FAMILY];\n"
    "                    for(var lv=cityLevelOf(localState)+1;lv<=10;lv++)\n"
    "                        if((bn['lv'+lv+'_num']||0)>held){need=lv;break;}\n"
    "                    status.setString(need?('\\u8bf7\\u5148\\u5c06\\u9f99\\u9996\\u4e4b\\u57ce"
    "\\u5347\\u81f3 '+need+' \\u7ea7'):'\\u65e5\\u5149\\u4e95\\u5df2\\u8fbe\\u539f\\u8868\\u4e0a\\u9650');\n"
    "                    return;\n"
    "                }\n"
    "                var builder=makeBuilder({type:CONSTRUCT_TYPE}),cost=builder.getRealCost();\n"
    "                if(localState.resources.gold<cost){status.setString("
    "'\\u8d44\\u6e90\\u4e0d\\u8db3\\uff0c\\u9700\\u8981 '+cost+' \\u9f99\\u5e01');return;}\n"
    "                placingNew=true;selected=null;confirmUid=null;moving=false;\n"
    "                status.setString('\\u70b9\\u51fb\\u5730\\u56fe\\u7a7a\\u4f4d\\u5efa\\u9020"
    "\\u65e5\\u5149\\u4e95 \\xb7 \\u8d39\\u7528 '+cost+' \\u9f99\\u5e01 \\xb7 '+"
    "builder.buildTime+' \\u79d2');\n"
    "                action.setString('\\u53d6\\u6d88\\u5efa\\u9020');\n"
    "                buildLabel.setColor({r:255,g:235,b:130});\n"
    "            };\n"
    "            var placeNew=function(x,y){\n"
    "                x=Math.max(250,Math.min(3582,Math.round(x)));\n"
    "                y=Math.max(250,Math.min(2562,Math.round(y)));\n"
    "                for(var ni=0;ni<nodes.length;ni++){\n"
    "                    var dx=x-nodes[ni].x,dy=y-nodes[ni].y;\n"
    "                    if(dx*dx+dy*dy<260*260){status.setString("
    "'\\u4e0e\\u5176\\u4ed6\\u5efa\\u7b51\\u592a\\u8fd1\\uff0c\\u8bf7\\u91cd\\u9009\\u4f4d\\u7f6e');"
    "return;}\n"
    "                }\n"
    "                if(workerBusy(localState)){placingNew=false;status.setString("
    "'\\u5efa\\u7b51\\u5e08\\u5fd9\\u788c');return;}\n"
    "                if(familyCount(localState,CONSTRUCT_FAMILY)>="
    "maxFamily(localState,CONSTRUCT_FAMILY)){\n"
    "                    placingNew=false;status.setString('\\u5df2\\u8fbe\\u53ef\\u5efa\\u4e0a\\u9650');"
    "return;\n"
    "                }\n"
    "                var builder=makeBuilder({type:CONSTRUCT_TYPE}),cost=builder.getRealCost();\n"
    "                if(localState.resources.gold<cost){placingNew=false;status.setString("
    "'\\u8d44\\u6e90\\u4e0d\\u8db3\\uff0c\\u9700\\u8981 '+cost+' \\u9f99\\u5e01');return;}\n"
    "                var next=JSON.parse(JSON.stringify(localState)),start=nowSec();\n"
    "                var uid=nextBuildingUid(next);\n"
    "                next.resources.gold-=cost;\n"
    "                next.buildings.push({uid:uid,type:CONSTRUCT_TYPE,x:x,y:y,"
    "construct:{started:start,ends:start+builder.buildTime}});\n"
    "                next.revision++;\n"
    "                try{persist(next);}catch(e){status.setString("
    "'\\u4fdd\\u5b58\\u5931\\u8d25\\uff0c\\u5efa\\u9020\\u672a\\u5f00\\u59cb');"
    "cc.log('DinoLocal save failed: '+e);return;}\n"
    "                placingNew=false;\n"
    "                selected=spawnNode(buildingOf(localState,uid));\n"
    "                showSelected();\n"
    "                status.setString('\\u5df2\\u5f00\\u59cb\\u5efa\\u9020\\u65e5\\u5149\\u4e95 "
    "\\xb7 \\u6d88\\u8017 '+cost+' \\u9f99\\u5e01 \\xb7 '+builder.buildTime+' \\u79d2');\n"
    "            };\n",
    "            var beginPlace=function(pick){\n"
    "                var opt=CONSTRUCT_OPTIONS[pick],builder=makeBuilder({type:opt.type});\n"
    "                var cost=builder.getRealCost(),resource=constructResKey(builder);\n"
    "                if(localState.resources[resource]<cost){status.setString("
    "'\\u8d44\\u6e90\\u4e0d\\u8db3\\uff0c\\u9700\\u8981 '+cost+' '+"
    "constructResLabel(resource));return false;}\n"
    "                constructPick=pick;placingNew=true;selected=null;confirmUid=null;"
    "moving=false;\n"
    "                status.setString('\\u70b9\\u51fb\\u5730\\u56fe\\u7a7a\\u4f4d\\u5efa\\u9020'+"
    "opt.label+' \\xb7 \\u8d39\\u7528 '+cost+' '+constructResLabel(resource)+' \\xb7 '+"
    "builder.buildTime+' \\u79d2\\uff08\\u518d\\u70b9\\u5efa\\u9020\\u53ef\\u5207\\u6362\\u7c7b\\u578b\\uff09');\n"
    "                action.setString('\\u53d6\\u6d88\\u5efa\\u9020');\n"
    "                buildLabel.setString('\\u5207\\u6362\\u7c7b\\u578b');\n"
    "                buildLabel.setColor({r:255,g:235,b:130});\n"
    "                return true;\n"
    "            };\n"
    "            var build=function(){\n"
    "                if(moving){status.setString('\\u8bf7\\u5148\\u7ed3\\u675f\\u79fb\\u52a8');"
    "return;}\n"
    "                if(workerBusy(localState)){status.setString("
    "'\\u5efa\\u7b51\\u5e08\\u5fd9\\u788c\\uff0c\\u8bf7\\u7b49\\u5f85\\u5f53\\u524d"
    "\\u5efa\\u9020\\u6216\\u5347\\u7ea7\\u5b8c\\u6210');return;}\n"
    "                if(placingNew){\n"
    "                    var switched=nextConstructPick(localState,constructPick+1);\n"
    "                    if(switched<0 || switched===constructPick){\n"
    "                        placingNew=false;"
    "buildLabel.setString('\\u5efa\\u9020\\u751f\\u4ea7');showSelected();"
    "status.setString('\\u5df2\\u53d6\\u6d88\\u5efa\\u9020');return;\n"
    "                    }\n"
    "                    beginPlace(switched);return;\n"
    "                }\n"
    "                var pick=nextConstructPick(localState,constructPick);\n"
    "                if(pick<0){\n"
    "                    var need=null,blocked=CONSTRUCT_OPTIONS[0],held0="
    "familyCount(localState,blocked.family);\n"
    "                    var bn0=data.build_number[blocked.family];\n"
    "                    for(var lv=cityLevelOf(localState)+1;lv<=10;lv++)\n"
    "                        if((bn0['lv'+lv+'_num']||0)>held0){need=lv;break;}\n"
    "                    status.setString(need?('\\u8bf7\\u5148\\u5c06\\u9f99\\u9996\\u4e4b\\u57ce"
    "\\u5347\\u81f3 '+need+' \\u7ea7'):"
    "'\\u751f\\u4ea7\\u5efa\\u7b51\\u5df2\\u8fbe\\u539f\\u8868\\u4e0a\\u9650');\n"
    "                    return;\n"
    "                }\n"
    "                beginPlace(pick);\n"
    "            };\n"
    "            var placeNew=function(x,y){\n"
    "                x=Math.max(250,Math.min(3582,Math.round(x)));\n"
    "                y=Math.max(250,Math.min(2562,Math.round(y)));\n"
    "                for(var ni=0;ni<nodes.length;ni++){\n"
    "                    var dx=x-nodes[ni].x,dy=y-nodes[ni].y;\n"
    "                    if(dx*dx+dy*dy<260*260){status.setString("
    "'\\u4e0e\\u5176\\u4ed6\\u5efa\\u7b51\\u592a\\u8fd1\\uff0c\\u8bf7\\u91cd\\u9009\\u4f4d\\u7f6e');"
    "return;}\n"
    "                }\n"
    "                if(workerBusy(localState)){placingNew=false;status.setString("
    "'\\u5efa\\u7b51\\u5e08\\u5fd9\\u788c');return;}\n"
    "                var opt=constructOption();\n"
    "                if(familyCount(localState,opt.family)>="
    "maxFamily(localState,opt.family)){\n"
    "                    placingNew=false;status.setString('\\u5df2\\u8fbe\\u53ef\\u5efa\\u4e0a\\u9650');"
    "return;\n"
    "                }\n"
    "                var builder=makeBuilder({type:opt.type}),cost=builder.getRealCost();\n"
    "                var resource=constructResKey(builder);\n"
    "                if(localState.resources[resource]<cost){placingNew=false;status.setString("
    "'\\u8d44\\u6e90\\u4e0d\\u8db3\\uff0c\\u9700\\u8981 '+cost+' '+"
    "constructResLabel(resource));return;}\n"
    "                var next=JSON.parse(JSON.stringify(localState)),start=nowSec();\n"
    "                var uid=nextBuildingUid(next);\n"
    "                next.resources[resource]-=cost;\n"
    "                next.buildings.push({uid:uid,type:opt.type,x:x,y:y,"
    "construct:{started:start,ends:start+builder.buildTime}});\n"
    "                next.revision++;\n"
    "                try{persist(next);}catch(e){status.setString("
    "'\\u4fdd\\u5b58\\u5931\\u8d25\\uff0c\\u5efa\\u9020\\u672a\\u5f00\\u59cb');"
    "cc.log('DinoLocal save failed: '+e);return;}\n"
    "                placingNew=false;\n"
    "                selected=spawnNode(buildingOf(localState,uid));\n"
    "                showSelected();\n"
    "                status.setString('\\u5df2\\u5f00\\u59cb\\u5efa\\u9020'+opt.label+"
    "' \\xb7 \\u6d88\\u8017 '+cost+' '+constructResLabel(resource)+' \\xb7 '+"
    "builder.buildTime+' \\u79d2');\n"
    "            };\n",
)

# Footer label + status hint + package tags
replace(
    "var buildLabel=label('\\u5efa\\u9020\\u65e5\\u5149\\u4e95',size.width*.90,23,20);",
    "var buildLabel=label('\\u5efa\\u9020\\u751f\\u4ea7',size.width*.90,23,20);",
)
replace(
    "var status=label('\\u53ef\\u5efa\\u9020\\u989d\\u5916\\u65e5\\u5149\\u4e95\\uff08\\u9700"
    "\\u4e8c\\u7ea7\\u4e3b\\u57ce\\uff09',size.width/2,59,19);",
    "var status=label('\\u53ef\\u5efa\\u65e5\\u5149\\u4e95\\u4e0e\\u9f99\\u94f6\\u77ff"
    "\\uff08\\u9700\\u4e8c\\u7ea7\\u4e3b\\u57ce\\uff09',size.width/2,59,19);",
)
replace("local-construct-ready", "local-mine-ready")
replace(
    "\\u672c\\u5730\\u65b0\\u5efa\\u5efa\\u7b51\\u6d4b\\u8bd5",
    "\\u672c\\u5730\\u751f\\u4ea7\\u5efa\\u7b51\\u6d4b\\u8bd5",
)

# When canceling place / leaving place mode, restore button text.
replace(
    "if(placingNew){placingNew=false;showSelected();"
    "status.setString('\\u5df2\\u53d6\\u6d88\\u5efa\\u9020');return;}\n"
    "                    if(selected && (buildingOf(localState,selected.uid).upgrade || "
    "buildingOf(localState,selected.uid).construct)){",
    "if(placingNew){placingNew=false;buildLabel.setString('\\u5efa\\u9020\\u751f\\u4ea7');"
    "showSelected();status.setString('\\u5df2\\u53d6\\u6d88\\u5efa\\u9020');return;}\n"
    "                    if(selected && (buildingOf(localState,selected.uid).upgrade || "
    "buildingOf(localState,selected.uid).construct)){",
)
replace(
    "                if(placingNew){buildLabel.setColor({r:255,g:235,b:130});"
    "action.setString('\\u53d6\\u6d88\\u5efa\\u9020');return;}\n"
    "                if(!selected){action.setString('\\u79fb\\u52a8\\u5efa\\u7b51');return;}\n",
    "                if(placingNew){buildLabel.setColor({r:255,g:235,b:130});"
    "buildLabel.setString('\\u5207\\u6362\\u7c7b\\u578b');"
    "action.setString('\\u53d6\\u6d88\\u5efa\\u9020');return;}\n"
    "                buildLabel.setString('\\u5efa\\u9020\\u751f\\u4ea7');\n"
    "                if(!selected){action.setString('\\u79fb\\u52a8\\u5efa\\u7b51');return;}\n",
)

# Completion status uses the finished building's family name.
replace(
    "                    if(res.construct && res.construct.length)\n"
    "                        status.setString('\\u5efa\\u9020\\u5b8c\\u6210\\uff1a"
    "\\u65e5\\u5149\\u4e95\\u5df2\\u6295\\u4ea7');\n",
    "                    if(res.construct && res.construct.length){\n"
    "                        var doneB=buildingOf(localState,res.construct[0]);\n"
    "                        var doneName=G_StringManager.str(data.unit_main[doneB.type].name);\n"
    "                        status.setString('\\u5efa\\u9020\\u5b8c\\u6210\\uff1a'+doneName+"
    "'\\u5df2\\u6295\\u4ea7');\n"
    "                    }\n",
)

(W / 'mine_boot.js').write_text(
    s.encode('ascii', 'backslashreplace').decode('ascii'), encoding='ascii'
)
builder = (
    (W / 'build_construct.py')
    .read_text(encoding='utf-8')
    .replace('dino-local-construct.apk', 'dino-local-mine.apk')
    .replace('construct_boot.js', 'mine_boot.js')
)
(W / 'build_mine.py').write_text(builder, encoding='utf-8')
print('Generated mine_boot.js and build_mine.py')
