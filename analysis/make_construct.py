"""Generate the local new-construction variant from the verified train boot script.

Adds one local construction flow for an extra 日光井 (family 202):
  - cost / time from BuildingBuilder on 20201 (原表 lv_up_cost / lv_up_time)
  - count limit from data.build_number[202] keyed by city hall level
  - single shared worker with upgrades (construct or upgrade, not both)
  - place on the map like move, then countdown; on finish, start production

Does not call Shop.buyBuilding, rpc_s_build, or the original construction UI.
Save key bumps to dino.local.city.v10; extra buildings are appended after the
fixed 8 starter buildings.
"""
from pathlib import Path

W = Path(__file__).resolve().parent
s = (W / 'train_boot.js').read_text(encoding='utf-8')


def replace(a, b):
    global s
    assert a in s, repr(a[:140])
    s = s.replace(a, b)


# ---------------------------------------------------------------- save v10
replace("var saveKey = 'dino.local.city.v9';", "var saveKey = 'dino.local.city.v10';")
replace("value.version !== 9", "value.version !== 10")
replace(
    "var oldRaw=sys.localStorage.getItem('dino.local.city.v8') || ",
    "var oldRaw=sys.localStorage.getItem('dino.local.city.v9') || "
    "sys.localStorage.getItem('dino.local.city.v8') || ",
)
replace(
    "if(localState.version!==1 && localState.version!==2 && localState.version!==3 && "
    "localState.version!==4 && localState.version!==5 && localState.version!==6 && "
    "localState.version!==7 && localState.version!==8)throw Error('Invalid legacy save');",
    "if(localState.version!==1 && localState.version!==2 && localState.version!==3 && "
    "localState.version!==4 && localState.version!==5 && localState.version!==6 && "
    "localState.version!==7 && localState.version!==8 && localState.version!==9)"
    "throw Error('Invalid legacy save');",
)
replace("localState.version=9;", "localState.version=10;")

# ---------------------------------------------- construct config + validation
CONSTRUCT_BLOCK = (
    "        var CONSTRUCT_TYPE='20201';\n"
    "        var CONSTRUCT_FAMILY='202';\n"
    "        var MAX_EXTRA=5;\n"
    "        var cityLevelOf=function(state){\n"
    "            for(var ci=0;ci<state.buildings.length;ci++){\n"
    "                if(String(state.buildings[ci].type).indexOf('201')===0)\n"
    "                    return data.unit_main[state.buildings[ci].type].lv;\n"
    "            }\n"
    "            return 1;\n"
    "        };\n"
    "        var familyCount=function(state,fam){\n"
    "            var n=0;\n"
    "            for(var fi=0;fi<state.buildings.length;fi++)\n"
    "                if(String(state.buildings[fi].type).indexOf(fam)===0)n++;\n"
    "            return n;\n"
    "        };\n"
    "        var maxFamily=function(state,fam){\n"
    "            var bn=data.build_number[fam];\n"
    "            if(!bn)return 0;\n"
    "            var lv=cityLevelOf(state),key='lv'+lv+'_num';\n"
    "            return bn[key]||0;\n"
    "        };\n"
    "        var nextBuildingUid=function(state){\n"
    "            var max=-1;\n"
    "            for(var ui=0;ui<state.buildings.length;ui++){\n"
    "                var m=String(state.buildings[ui].uid).match(/^building-(\\d+)$/);\n"
    "                if(m)max=Math.max(max,Number(m[1]));\n"
    "            }\n"
    "            return 'building-'+(max+1);\n"
    "        };\n"
)

replace(
    "        var TRAIN_FAMILY='114';\n",
    CONSTRUCT_BLOCK + "        var TRAIN_FAMILY='114';\n",
)

# Allow appended extra 202 buildings; keep the first 8 locked to defaults.
replace(
    "            if (!value || value.version !== 10 || value.playerId !== 'local-001' ||\n"
    "                !value.buildings || value.buildings.length !== defaults.length) "
    "throw Error('Invalid local save');\n"
    "            for (var i=0;i<defaults.length;i++) {\n"
    "                var b=value.buildings[i];\n"
    "                if (!b || b.uid !== 'building-'+i || !allowedTypes(defaults[i][0])[b.type] ||\n"
    "                    typeof b.x !== 'number' || typeof b.y !== 'number' ||\n"
    "                    !isFinite(b.x) || !isFinite(b.y) || b.x<250 || b.x>3582 || "
    "b.y<250 || b.y>2562)\n"
    "                    throw Error('Invalid local building '+i);\n"
    "            }\n",
    "            if (!value || value.version !== 10 || value.playerId !== 'local-001' ||\n"
    "                !value.buildings || value.buildings.length < defaults.length ||\n"
    "                value.buildings.length > defaults.length+MAX_EXTRA)\n"
    "                throw Error('Invalid local save');\n"
    "            var seenUid={};\n"
    "            for (var i=0;i<defaults.length;i++) {\n"
    "                var b=value.buildings[i];\n"
    "                if (!b || b.uid !== 'building-'+i || !allowedTypes(defaults[i][0])[b.type] ||\n"
    "                    typeof b.x !== 'number' || typeof b.y !== 'number' ||\n"
    "                    !isFinite(b.x) || !isFinite(b.y) || b.x<250 || b.x>3582 || "
    "b.y<250 || b.y>2562)\n"
    "                    throw Error('Invalid local building '+i);\n"
    "                seenUid[b.uid]=true;\n"
    "            }\n"
    "            for (var ei=defaults.length;ei<value.buildings.length;ei++) {\n"
    "                var eb=value.buildings[ei];\n"
    "                if (!eb || typeof eb.uid!=='string' || !/^building-\\d+$/.test(eb.uid) ||\n"
    "                    seenUid[eb.uid] || !allowedTypes(CONSTRUCT_TYPE)[eb.type] ||\n"
    "                    typeof eb.x !== 'number' || typeof eb.y !== 'number' ||\n"
    "                    !isFinite(eb.x) || !isFinite(eb.y) || eb.x<250 || eb.x>3582 || "
    "eb.y<250 || eb.y>2562)\n"
    "                    throw Error('Invalid extra building '+ei);\n"
    "                seenUid[eb.uid]=true;\n"
    "            }\n"
    "            if(familyCount(value,CONSTRUCT_FAMILY)>maxFamily(value,CONSTRUCT_FAMILY))\n"
    "                throw Error('Too many family '+CONSTRUCT_FAMILY);\n",
)

# Upgrade / construct share one worker; validate construct timing.
replace(
    "            var active=0;\n"
    "            for(var ui=0;ui<value.buildings.length;ui++){\n"
    "                var ub=value.buildings[ui],job=ub.upgrade;\n"
    "                if(job){\n"
    "                    active++;\n"
    "                    if(job.target!==upgradeTypes[ub.type] || typeof job.started!=='number' || "
    "!isFinite(job.started) || job.started<0 ||\n"
    "                        typeof job.ends!=='number' || !isFinite(job.ends) || "
    "job.ends!==job.started+data.unit_main[ub.type].lv_up_time)\n"
    "                        throw Error('Invalid upgrade '+ub.uid);\n"
    "                }\n"
    "            }\n"
    "            if(active>1)throw Error('Too many local upgrade jobs');\n",
    "            var active=0;\n"
    "            for(var ui=0;ui<value.buildings.length;ui++){\n"
    "                var ub=value.buildings[ui],job=ub.upgrade,cj=ub.construct;\n"
    "                if(job){\n"
    "                    active++;\n"
    "                    if(job.target!==upgradeTypes[ub.type] || typeof job.started!=='number' || "
    "!isFinite(job.started) || job.started<0 ||\n"
    "                        typeof job.ends!=='number' || !isFinite(job.ends) || "
    "job.ends!==job.started+data.unit_main[ub.type].lv_up_time)\n"
    "                        throw Error('Invalid upgrade '+ub.uid);\n"
    "                }\n"
    "                if(cj){\n"
    "                    active++;\n"
    "                    if(typeof cj.started!=='number' || !isFinite(cj.started) || cj.started<0 ||\n"
    "                        typeof cj.ends!=='number' || !isFinite(cj.ends) ||\n"
    "                        cj.ends!==cj.started+data.unit_main[ub.type].lv_up_time)\n"
    "                        throw Error('Invalid construct '+ub.uid);\n"
    "                }\n"
    "                if(job && cj)throw Error('Building both upgrading and constructing '+ub.uid);\n"
    "            }\n"
    "            if(active>1)throw Error('Too many local builder jobs');\n",
)

# Producers under construction have no production record yet.
replace(
    "            for(var pi=0;pi<value.buildings.length;pi++){\n"
    "                var b=value.buildings[pi],cfg=data.unit_main[b.type];\n"
    "                if(cfg.gold_produce || cfg.wood_produce){\n"
    "                    var prod=value.production[b.uid];\n"
    "                    if(!prod || typeof prod.lastHour!=='number' || !isFinite(prod.lastHour) || "
    "prod.lastHour<0 ||\n"
    "                        typeof prod.stored!=='number' || !isFinite(prod.stored) || "
    "prod.stored<0 || prod.stored>cfg.temp_storage)\n"
    "                        throw Error('Invalid producer '+b.uid);\n"
    "                }\n"
    "            }\n",
    "            for(var pi=0;pi<value.buildings.length;pi++){\n"
    "                var b=value.buildings[pi],cfg=data.unit_main[b.type];\n"
    "                if((cfg.gold_produce || cfg.wood_produce) && !b.construct){\n"
    "                    var prod=value.production[b.uid];\n"
    "                    if(!prod || typeof prod.lastHour!=='number' || !isFinite(prod.lastHour) || "
    "prod.lastHour<0 ||\n"
    "                        typeof prod.stored!=='number' || !isFinite(prod.stored) || "
    "prod.stored<0 || prod.stored>cfg.temp_storage)\n"
    "                        throw Error('Invalid producer '+b.uid);\n"
    "                }\n"
    "            }\n",
)

# makeBuilder also drives construct countdowns.
replace(
    "            if(b.upgrade){comp.state=BUILD_STATE_BUILDING;comp.beginTime=b.upgrade.started;}\n"
    "            return comp;\n",
    "            if(b.upgrade){comp.state=BUILD_STATE_BUILDING;comp.beginTime=b.upgrade.started;}\n"
    "            else if(b.construct){comp.state=BUILD_STATE_BUILDING;"
    "comp.beginTime=b.construct.started;}\n"
    "            return comp;\n",
)

# --------------------------------------------------------- settle construct
replace(
    "            for(var i=0;i<localState.buildings.length;i++){\n"
    "                var b=localState.buildings[i];\n"
    "                if(b.upgrade && nowSec()>=b.upgrade.ends){\n"
    "                    if(!next)next=JSON.parse(JSON.stringify(localState));\n"
    "                    var nb=next.buildings[i],end=nb.upgrade.ends;\n"
    "                    nb.type=nb.upgrade.target;delete nb.upgrade;\n"
    "                    // Production resumes at completion, including elapsed offline time.\n"
    "                    if(next.production[nb.uid])next.production[nb.uid].lastHour=end/3600;\n"
    "                    changed.push(nb.uid);\n"
    "                }\n"
    "            }\n"
    "            var trainDone=[];\n",
    "            var constructDone=[];\n"
    "            for(var i=0;i<localState.buildings.length;i++){\n"
    "                var b=localState.buildings[i];\n"
    "                if(b.upgrade && nowSec()>=b.upgrade.ends){\n"
    "                    if(!next)next=JSON.parse(JSON.stringify(localState));\n"
    "                    var nb=next.buildings[i],end=nb.upgrade.ends;\n"
    "                    nb.type=nb.upgrade.target;delete nb.upgrade;\n"
    "                    // Production resumes at completion, including elapsed offline time.\n"
    "                    if(next.production[nb.uid])next.production[nb.uid].lastHour=end/3600;\n"
    "                    changed.push(nb.uid);\n"
    "                }else if(b.construct && nowSec()>=b.construct.ends){\n"
    "                    if(!next)next=JSON.parse(JSON.stringify(localState));\n"
    "                    var nb2=next.buildings[i],end2=nb2.construct.ends,cfg2=data.unit_main[nb2.type];\n"
    "                    delete nb2.construct;\n"
    "                    if(cfg2.gold_produce || cfg2.wood_produce)\n"
    "                        next.production[nb2.uid]={stored:0,lastHour:end2/3600};\n"
    "                    changed.push(nb2.uid);\n"
    "                    constructDone.push(nb2.uid);\n"
    "                }\n"
    "            }\n"
    "            var trainDone=[];\n",
)
replace(
    "            if(next){next.revision++;persist(next);}\n"
    "            return {buildings:changed,training:trainDone};\n",
    "            if(next){next.revision++;persist(next);}\n"
    "            return {buildings:changed,training:trainDone,construct:constructDone};\n",
)

# After settle completes a construct, refreshItem must create the producer.
replace(
    "                item.node.removeFromParent();item.node=node;item.id=b.type;\n"
    "                if(item.producer){\n"
    "                    var master={stage:GS_STAGE_BUILD,getComponent:function(){"
    "return {isBuildingFinished:function(){return true;}};}};\n"
    "                    item.producer=new Comp.ResourceProductor(master,cfg);\n"
    "                }\n"
    "            };\n",
    "                item.node.removeFromParent();item.node=node;item.id=b.type;\n"
    "                if((cfg.gold_produce || cfg.wood_produce) && !b.construct){\n"
    "                    var master={stage:GS_STAGE_BUILD,getComponent:function(){"
    "return {isBuildingFinished:function(){return true;}};}};\n"
    "                    item.producer=new Comp.ResourceProductor(master,cfg);\n"
    "                    item.resource=cfg.gold_produce?'gold':'wood';\n"
    "                }else{item.producer=null;}\n"
    "            };\n",
)

# Skip producer init while loading an unfinished construct.
replace(
    "                        if(cfg.gold_produce || cfg.wood_produce){\n"
    "                            var master={stage:GS_STAGE_BUILD,getComponent:function(name){\n"
    "                                return name==='BuildingBuilder'?"
    "{isBuildingFinished:function(){return true;}}:null;\n"
    "                            }};\n"
    "                            item.producer=new Comp.ResourceProductor(master,cfg);\n"
    "                            item.resource=cfg.gold_produce?'gold':'wood';\n"
    "                        }\n",
    "                        var savedB=buildingOf(localState,spec[3]);\n"
    "                        if((cfg.gold_produce || cfg.wood_produce) && !savedB.construct){\n"
    "                            var master={stage:GS_STAGE_BUILD,getComponent:function(name){\n"
    "                                return name==='BuildingBuilder'?"
    "{isBuildingFinished:function(){return true;}}:null;\n"
    "                            }};\n"
    "                            item.producer=new Comp.ResourceProductor(master,cfg);\n"
    "                            item.resource=cfg.gold_produce?'gold':'wood';\n"
    "                        }\n",
)

# producerAmount: unfinished construct has no yield.
replace(
    "            var producerAmount=function(item){\n"
    "                var b=buildingOf(localState,item.uid);\n"
    "                var saved=localState.production[item.uid];\n"
    "                if(b.upgrade)return saved.stored;\n",
    "            var producerAmount=function(item){\n"
    "                var b=buildingOf(localState,item.uid);\n"
    "                var saved=localState.production[item.uid];\n"
    "                if(b.construct || !item.producer || !saved)return 0;\n"
    "                if(b.upgrade)return saved.stored;\n",
)

# -------------------------------------------------------------- build UI logic
BUILD_UI = (
    "            var placingNew=false;\n"
    "            var constructInfo=function(item){\n"
    "                var b=buildingOf(localState,item.uid),builder=makeBuilder(b);\n"
    "                return '\\u5efa\\u9020\\u4e2d \\xb7 \\u5269\\u4f59 '+"
    "Math.max(0,builder.getNeedTime())+' \\u79d2';\n"
    "            };\n"
    "            var workerBusy=function(state){\n"
    "                for(var wi=0;wi<state.buildings.length;wi++){\n"
    "                    var wb=state.buildings[wi];\n"
    "                    if(wb.upgrade || wb.construct)return true;\n"
    "                }\n"
    "                return false;\n"
    "            };\n"
    "            var spawnNode=function(saved){\n"
    "                var cfg=data.unit_main[saved.type],oldLookup=getControllerByName;\n"
    "                getControllerByName=function(name){var info=oldLookup(name);"
    "if(name==='Unit')info[0]=function(){};return info;};\n"
    "                var node;\n"
    "                try{node=cc.BuilderReader.load(cfg.home_res);}"
    "finally{getControllerByName=oldLookup;}\n"
    "                node.setPosition(saved.x,saved.y);node.setScale(1.5);"
    "map.addChild(node,3000-saved.y);\n"
    "                if(node.animationManager && "
    "node.animationManager.getSequenceNames().indexOf('idle_run')>=0)\n"
    "                    node.animationManager.runAnimations('idle_run');\n"
    "                var item={id:saved.type,uid:saved.uid,x:saved.x,y:saved.y,node:node,"
    "name:G_StringManager.str(cfg.name)};\n"
    "                if((cfg.gold_produce || cfg.wood_produce) && !saved.construct){\n"
    "                    var master={stage:GS_STAGE_BUILD,getComponent:function(){"
    "return {isBuildingFinished:function(){return true;}};}};\n"
    "                    item.producer=new Comp.ResourceProductor(master,cfg);\n"
    "                    item.resource=cfg.gold_produce?'gold':'wood';\n"
    "                }\n"
    "                nodes.push(item);return item;\n"
    "            };\n"
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
    "            };\n"
)

replace(
    "            var soldiersOf=function(uid){return (localState.soldiers||{})[uid]||0;};\n",
    BUILD_UI + "            var soldiersOf=function(uid){return (localState.soldiers||{})[uid]||0;};\n",
)

# showSelected: construct countdown + build button color; handle !selected with placingNew
replace(
    "            var showSelected=function(){\n"
    "                walletLabel.setString('\\u9f99\\u5e01 '+localState.resources.gold+'/'+capacity.gold+"
    "'  \\u65e5\\u5149 '+localState.resources.wood+'/'+capacity.wood);\n"
    "                if(!selected)return;\n",
    "            var showSelected=function(){\n"
    "                walletLabel.setString('\\u9f99\\u5e01 '+localState.resources.gold+'/'+capacity.gold+"
    "'  \\u65e5\\u5149 '+localState.resources.wood+'/'+capacity.wood);\n"
    "                buildLabel.setColor(!moving && !placingNew?"
    "{r:255,g:235,b:130}:{r:150,g:150,b:150});\n"
    "                if(placingNew){buildLabel.setColor({r:255,g:235,b:130});"
    "action.setString('\\u53d6\\u6d88\\u5efa\\u9020');return;}\n"
    "                if(!selected){action.setString('\\u79fb\\u52a8\\u5efa\\u7b51');return;}\n",
)

replace(
    "                if(b.upgrade)info='\\u5347\\u7ea7\\u4e2d \\xb7 \\u5269\\u4f59 '+"
    "Math.max(0,builder.getNeedTime())+' \\u79d2';\n"
    "                else if(confirmUid===b.uid){\n",
    "                if(b.construct)info=constructInfo(selected);\n"
    "                else if(b.upgrade)info='\\u5347\\u7ea7\\u4e2d \\xb7 \\u5269\\u4f59 '+"
    "Math.max(0,builder.getNeedTime())+' \\u79d2';\n"
    "                else if(confirmUid===b.uid){\n",
)

replace(
    "                upgradeLabel.setColor(upgradeTypes[b.type] && !b.upgrade && !moving?"
    "{r:255,g:235,b:130}:{r:150,g:150,b:150});\n"
    "                action.setString(moving?'\\u53d6\\u6d88\\u79fb\\u52a8':"
    "'\\u79fb\\u52a8\\u5efa\\u7b51');\n"
    "                collectLabel.setColor(selected.producer && !moving && !b.upgrade?"
    "{r:255,g:235,b:130}:{r:150,g:150,b:150});\n"
    "                var isBarracks=String(b.type).indexOf('207')===0;\n"
    "                trainLabel.setColor(isBarracks && !moving && !b.upgrade && "
    "!localState.training[b.uid]?{r:255,g:235,b:130}:{r:150,g:150,b:150});\n",
    "                upgradeLabel.setColor(upgradeTypes[b.type] && !b.upgrade && !b.construct && "
    "!moving && !placingNew?{r:255,g:235,b:130}:{r:150,g:150,b:150});\n"
    "                action.setString(moving?'\\u53d6\\u6d88\\u79fb\\u52a8':"
    "'\\u79fb\\u52a8\\u5efa\\u7b51');\n"
    "                collectLabel.setColor(selected.producer && !moving && !placingNew && "
    "!b.upgrade && !b.construct?{r:255,g:235,b:130}:{r:150,g:150,b:150});\n"
    "                var isBarracks=String(b.type).indexOf('207')===0;\n"
    "                trainLabel.setColor(isBarracks && !moving && !placingNew && !b.upgrade && "
    "!b.construct && !localState.training[b.uid]?{r:255,g:235,b:130}:{r:150,g:150,b:150});\n",
)

# Upgrade / train / collect refuse construct and shared worker.
replace(
    "                if(buildingOf(localState,selected.uid).upgrade){status.setString("
    "'\\u5347\\u7ea7\\u671f\\u95f4\\u6682\\u505c\\u751f\\u4ea7\\u548c\\u91c7\\u96c6');return;}\n",
    "                var cb=buildingOf(localState,selected.uid);\n"
    "                if(cb.upgrade || cb.construct){status.setString("
    "'\\u5efa\\u9020\\u6216\\u5347\\u7ea7\\u671f\\u95f4\\u6682\\u505c\\u751f\\u4ea7\\u548c"
    "\\u91c7\\u96c6');return;}\n",
)
replace(
    "                if(b.upgrade){status.setString('\\u5347\\u7ea7\\u671f\\u95f4\\u4e0d\\u80fd"
    "\\u8bad\\u7ec3');return;}\n",
    "                if(b.upgrade || b.construct){status.setString("
    "'\\u5efa\\u9020\\u6216\\u5347\\u7ea7\\u671f\\u95f4\\u4e0d\\u80fd\\u8bad\\u7ec3');return;}\n",
)
replace(
    "                if(b.upgrade){status.setString('\\u5efa\\u7b51\\u6b63\\u5728\\u5347\\u7ea7');"
    "return;}\n"
    "                if(!upgradeTypes[b.type]){confirmUid=null;status.setString("
    "'\\u672c\\u6b21\\u5df2\\u63a5\\u6ee1\\u539f\\u8868\\u53ef\\u5347\\u7ea7\\u7b49\\u7ea7\\uff0c"
    "\\u5efa\\u7b51\\u5e08\\u5c0f\\u5c4b\\u4e0d\\u53ef\\u5347\\u7ea7');return;}\n"
    "                if(confirmUid!==b.uid){confirmUid=b.uid;showSelected();return;}\n"
    "                confirmUid=null;\n"
    "                var builder=makeBuilder(b),cfg=data.unit_main[b.type];\n"
    "                if(data.unit_main[localState.buildings[0].type].lv<cfg.rely_base_lv){"
    "status.setString('\\u8bf7\\u5148\\u5c06\\u9f99\\u9996\\u4e4b\\u57ce\\u5347\\u81f3 '+"
    "cfg.rely_base_lv+' \\u7ea7');return;}\n"
    "                for(var i=0;i<localState.buildings.length;i++)"
    "if(localState.buildings[i].upgrade){status.setString("
    "'\\u5efa\\u7b51\\u5e08\\u5fd9\\u788c\\uff0c\\u8bf7\\u7b49\\u5f85\\u5f53\\u524d\\u5347\\u7ea7"
    "\\u5b8c\\u6210');return;}\n",
    "                if(b.upgrade || b.construct){status.setString("
    "'\\u5efa\\u7b51\\u6b63\\u5728\\u5efa\\u9020\\u6216\\u5347\\u7ea7');return;}\n"
    "                if(!upgradeTypes[b.type]){confirmUid=null;status.setString("
    "'\\u672c\\u6b21\\u5df2\\u63a5\\u6ee1\\u539f\\u8868\\u53ef\\u5347\\u7ea7\\u7b49\\u7ea7\\uff0c"
    "\\u5efa\\u7b51\\u5e08\\u5c0f\\u5c4b\\u4e0d\\u53ef\\u5347\\u7ea7');return;}\n"
    "                if(confirmUid!==b.uid){confirmUid=b.uid;showSelected();return;}\n"
    "                confirmUid=null;\n"
    "                var builder=makeBuilder(b),cfg=data.unit_main[b.type];\n"
    "                if(data.unit_main[localState.buildings[0].type].lv<cfg.rely_base_lv){"
    "status.setString('\\u8bf7\\u5148\\u5c06\\u9f99\\u9996\\u4e4b\\u57ce\\u5347\\u81f3 '+"
    "cfg.rely_base_lv+' \\u7ea7');return;}\n"
    "                if(workerBusy(localState)){status.setString("
    "'\\u5efa\\u7b51\\u5e08\\u5fd9\\u788c\\uff0c\\u8bf7\\u7b49\\u5f85\\u5f53\\u524d\\u5efa\\u9020"
    "\\u6216\\u5347\\u7ea7\\u5b8c\\u6210');return;}\n",
)

# Footer: five actions — move / collect / upgrade / train / build
replace(
    "            var action=label('\\u79fb\\u52a8\\u5efa\\u7b51',size.width*.13,23,22);\n"
    "\n"
    "            var collectLabel=label('\\u91c7\\u96c6\\u8d44\\u6e90',size.width*.37,23,22);\n"
    "            var upgradeLabel=label('\\u5347\\u7ea7\\u5efa\\u7b51',size.width*.61,23,22);\n"
    "            var trainLabel=label('\\u8bad\\u7ec3\\u58eb\\u5175',size.width*.85,23,22);",
    "            var action=label('\\u79fb\\u52a8\\u5efa\\u7b51',size.width*.10,23,20);\n"
    "\n"
    "            var collectLabel=label('\\u91c7\\u96c6\\u8d44\\u6e90',size.width*.30,23,20);\n"
    "            var upgradeLabel=label('\\u5347\\u7ea7\\u5efa\\u7b51',size.width*.50,23,20);\n"
    "            var trainLabel=label('\\u8bad\\u7ec3\\u58eb\\u5175',size.width*.70,23,20);\n"
    "            var buildLabel=label('\\u5efa\\u9020\\u65e5\\u5149\\u4e95',size.width*.90,23,20);",
)

replace(
    "            var selected=null,moving=false,confirmUid=null;\n",
    "            var selected=null,moving=false,confirmUid=null;\n"
    "            // placingNew is declared with the build helpers below.\n",
)

# Hit testing: >.80 build, >.60 train, >.40 upgrade, >.20 collect, else move/cancel-place
replace(
    "                if(p.y<86){\n"
    "                    if(p.x>size.width*.73){train();return;}\n"
    "                    if(p.x>size.width*.49){upgrade();return;}\n"
    "                    if(p.x>size.width*.27){collect();return;}\n"
    "                    confirmUid=null;\n"
    "                    if(selected && buildingOf(localState,selected.uid).upgrade){"
    "status.setString('\\u5347\\u7ea7\\u671f\\u95f4\\u4e0d\\u80fd\\u79fb\\u52a8\\u5efa\\u7b51');"
    "return;}\n"
    "                    if(selected){moving=!moving;showSelected();}\n"
    "                    else status.setString('\\u8bf7\\u5148\\u70b9\\u51fb\\u4e00\\u5ea7\\u5efa\\u7b51');\n"
    "                    return;\n"
    "                }\n"
    "                var mp=map.getPosition(),z=map.getScale(),x=(p.x-mp.x)/z,y=(p.y-mp.y)/z;\n"
    "                if(moving && selected){place(x,y);return;}\n",
    "                if(p.y<86){\n"
    "                    if(p.x>size.width*.80){build();return;}\n"
    "                    if(p.x>size.width*.60){train();return;}\n"
    "                    if(p.x>size.width*.40){upgrade();return;}\n"
    "                    if(p.x>size.width*.20){collect();return;}\n"
    "                    confirmUid=null;\n"
    "                    if(placingNew){placingNew=false;showSelected();"
    "status.setString('\\u5df2\\u53d6\\u6d88\\u5efa\\u9020');return;}\n"
    "                    if(selected && (buildingOf(localState,selected.uid).upgrade || "
    "buildingOf(localState,selected.uid).construct)){"
    "status.setString('\\u5efa\\u9020\\u6216\\u5347\\u7ea7\\u671f\\u95f4\\u4e0d\\u80fd"
    "\\u79fb\\u52a8\\u5efa\\u7b51');return;}\n"
    "                    if(selected){moving=!moving;showSelected();}\n"
    "                    else status.setString('\\u8bf7\\u5148\\u70b9\\u51fb\\u4e00\\u5ea7\\u5efa\\u7b51');\n"
    "                    return;\n"
    "                }\n"
    "                var mp=map.getPosition(),z=map.getScale(),x=(p.x-mp.x)/z,y=(p.y-mp.y)/z;\n"
    "                if(placingNew){placeNew(x,y);return;}\n"
    "                if(moving && selected){place(x,y);return;}\n",
)

# Status hint + package labels
replace(
    "var status=label('\\u9009\\u62e9\\u9a6f\\u9f99\\u573a\\u53ef\\u8bad\\u7ec3\\u58eb\\u5175',"
    "size.width/2,59,19);",
    "var status=label('\\u53ef\\u5efa\\u9020\\u989d\\u5916\\u65e5\\u5149\\u4e95\\uff08\\u9700"
    "\\u4e8c\\u7ea7\\u4e3b\\u57ce\\uff09',size.width/2,59,19);",
)
replace("local-train-ready", "local-construct-ready")
replace(
    "\\u672c\\u5730\\u8bad\\u7ec3\\u961f\\u5217\\u6d4b\\u8bd5",
    "\\u672c\\u5730\\u65b0\\u5efa\\u5efa\\u7b51\\u6d4b\\u8bd5",
)

# Scheduler: mention construct completion in the status line.
replace(
    "                    if(changed.length)refreshSoldierBadges();\n"
    "                    if(res.training.length){\n"
    "                        refreshSoldierBadges();\n"
    "                        status.setString('\\u8bad\\u7ec3\\u5b8c\\u6210\\uff1a\\u5df2\\u5165\\u4f4f "
    "1 \\u540d\\u58eb\\u5175');\n"
    "                    }\n"
    "                    if(changed.length || res.training.length || "
    "(++displayTicks%2===0 && selected && !moving))showSelected();",
    "                    if(changed.length)refreshSoldierBadges();\n"
    "                    if(res.construct && res.construct.length)\n"
    "                        status.setString('\\u5efa\\u9020\\u5b8c\\u6210\\uff1a"
    "\\u65e5\\u5149\\u4e95\\u5df2\\u6295\\u4ea7');\n"
    "                    if(res.training.length){\n"
    "                        refreshSoldierBadges();\n"
    "                        status.setString('\\u8bad\\u7ec3\\u5b8c\\u6210\\uff1a\\u5df2\\u5165\\u4f4f "
    "1 \\u540d\\u58eb\\u5175');\n"
    "                    }\n"
    "                    if(changed.length || (res.construct&&res.construct.length) || "
    "res.training.length || (++displayTicks%2===0 && selected && !moving && !placingNew))"
    "showSelected();",
)

(W / 'construct_boot.js').write_text(
    s.encode('ascii', 'backslashreplace').decode('ascii'), encoding='ascii'
)
builder = (
    (W / 'build_train.py')
    .read_text(encoding='utf-8')
    .replace('dino-local-train.apk', 'dino-local-construct.apk')
    .replace('train_boot.js', 'construct_boot.js')
)
(W / 'build_construct.py').write_text(builder, encoding='utf-8')
print('Generated construct_boot.js and build_construct.py')
