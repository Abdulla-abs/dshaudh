"""Generate the upgrade variant; all upgrade-specific changes live here."""
from pathlib import Path
W=Path(__file__).resolve().parent
s=(W/'economy_boot.js').read_text(encoding='utf-8')
def replace(a,b):
    global s
    assert a in s,a
    s=s.replace(a,b)
replace("var saveKey = 'dino.local.city.v2';", """var saveKey = 'dino.local.city.v3';
        var upgradeTypes={'20101':'20102','20201':'20202','20401':'20402'};
        var nowSec=function(){return DA.getSystemCurrentTimeSec();};
        var buildingOf=function(state,uid){
            for(var i=0;i<state.buildings.length;i++)if(state.buildings[i].uid===uid)return state.buildings[i];
            throw Error('Unknown building '+uid);
        };
        var makeBuilder=function(b){
            var cfg=data.unit_main[b.type];
            var master={params:{},stage:GS_STAGE_BUILD,config:cfg,level:cfg.lv,
                getOriginType:function(){return cfg.typeid;}};
            var comp=new Comp.BuildingBuilder(master,cfg);
            if(b.upgrade){comp.state=BUILD_STATE_BUILDING;comp.beginTime=b.upgrade.started;}
            return comp;
        };""")
replace("value.version !== 2", "value.version !== 3")
replace("b.type !== defaults[i][0]", "(b.type !== defaults[i][0] && b.type !== upgradeTypes[defaults[i][0]])")
replace("            if (!value.resources", """            var active=0;
            for(var ui=0;ui<value.buildings.length;ui++){
                var ub=value.buildings[ui],job=ub.upgrade;
                if(job){
                    active++;
                    if(job.target!==upgradeTypes[ub.type] || typeof job.started!=='number' || !isFinite(job.started) || job.started<0 ||
                        typeof job.ends!=='number' || !isFinite(job.ends) || job.ends!==job.started+data.unit_main[ub.type].lv_up_time)
                        throw Error('Invalid upgrade '+ub.uid);
                }
            }
            if(active>1)throw Error('Too many local upgrade jobs');
            if (!value.resources""")
replace("var oldRaw=sys.localStorage.getItem('dino.local.city.v1');", "var oldRaw=sys.localStorage.getItem('dino.local.city.v2') || sys.localStorage.getItem('dino.local.city.v1');")
replace("if(localState.version!==1)", "if(localState.version!==1 && localState.version!==2)")
replace("localState.version=2;localState.resources={gold:0,wood:0};localState.production={};", "localState.version=3;localState.resources=localState.resources||{gold:0,wood:0};localState.production=localState.production||{};")
replace("if(cfg && (cfg.gold_produce || cfg.wood_produce))", "if(cfg && (cfg.gold_produce || cfg.wood_produce) && !localState.production[b.uid])")
replace("        for(var ci=0;ci<localState.buildings.length;ci++){", """        var updateCapacity=function(){
        capacity.gold=0;capacity.wood=0;
        for(var ci=0;ci<localState.buildings.length;ci++){""")
replace("        var syncWallet=function(){", """        };
        updateCapacity();
        var syncWallet=function(){
            updateCapacity();""")
replace("        if (!raw) persist(localState);", """        if (!raw) persist(localState);
        var settle=function(){
            var next=null,changed=[];
            for(var i=0;i<localState.buildings.length;i++){
                var b=localState.buildings[i];
                if(b.upgrade && nowSec()>=b.upgrade.ends){
                    if(!next)next=JSON.parse(JSON.stringify(localState));
                    var nb=next.buildings[i],end=nb.upgrade.ends;
                    nb.type=nb.upgrade.target;delete nb.upgrade;
                    // Production resumes at completion, including elapsed offline time.
                    if(next.production[nb.uid])next.production[nb.uid].lastHour=end/3600;
                    changed.push(nb.uid);
                }
            }
            if(next){next.revision++;persist(next);}
            return changed;
        };
        settle();""")
replace("            syncWallet();\n            var tasks", "            settle();syncWallet();\n            var tasks")
replace("var selected=null,moving=false;", "var selected=null,moving=false,confirmUid=null;")
replace("size.width/2-150,23,22", "size.width*.18,23,22")
replace("size.width/2+150,23,22", "size.width*.5,23,22")
replace("            var selected=null", "            var upgradeLabel=label('升级建筑',size.width*.82,23,22);\n            var selected=null")
replace("                var saved=localState.production[item.uid];", """                var b=buildingOf(localState,item.uid);
                var saved=localState.production[item.uid];
                if(b.upgrade)return saved.stored;""")
replace("marker.setString('['+selected.name+']');", "marker.setString('['+selected.name+' Lv.'+data.unit_main[selected.id].lv+']');")
replace("                status.setString(selected.name+' \\u00b7 '+info);", """                var b=buildingOf(localState,selected.uid),builder=makeBuilder(b);
                if(b.upgrade)info='升级中 · 剩余 '+Math.max(0,builder.getNeedTime())+' 秒';
                else if(confirmUid===b.uid)info='升至二级：'+builder.getRealCost()+(builder.resType===RES_TYPE_GOLD?' 龙币':' 日光')+' · '+builder.buildTime+' 秒 · 再点确认';
                status.setString(selected.name+' Lv.'+data.unit_main[b.type].lv+' · '+info);
                upgradeLabel.setString(confirmUid===b.uid?'确认升级':'升级建筑');
                upgradeLabel.setColor(upgradeTypes[b.type] && !b.upgrade && !moving?{r:255,g:235,b:130}:{r:150,g:150,b:150});""")
replace("selected.producer && !moving?", "selected.producer && !moving && !b.upgrade?")
replace("                var stored=producerAmount(selected);", """                confirmUid=null;
                if(buildingOf(localState,selected.uid).upgrade){status.setString('升级期间暂停生产和采集');return;}
                var stored=producerAmount(selected);""")
replace("status.setString('\\u8d44\\u6e90\\u751f\\u4ea7\\u4e2d\\uff0c\\u6bcf 18 \\u79d2\\u4ea7\\u51fa 1 \\u70b9')", "status.setString('资源生产中，每 '+(3600/selected.producer.produceSpeed)+' 秒产出 1 点')")
replace("            showSelected();\n            // Refresh", """            var refreshItem=function(item){
                var b=buildingOf(localState,item.uid),cfg=data.unit_main[b.type];
                var oldLookup=getControllerByName;
                getControllerByName=function(name){var info=oldLookup(name);if(name==='Unit')info[0]=function(){};return info;};
                var node;
                try{node=cc.BuilderReader.load(cfg.home_res);}finally{getControllerByName=oldLookup;}
                node.setPosition(b.x,b.y);node.setScale(1.5);map.addChild(node,3000-b.y);
                if(node.animationManager && node.animationManager.getSequenceNames().indexOf('idle_run')>=0)node.animationManager.runAnimations('idle_run');
                item.node.removeFromParent();item.node=node;item.id=b.type;
                if(item.producer){
                    var master={stage:GS_STAGE_BUILD,getComponent:function(){return {isBuildingFinished:function(){return true;}};}};
                    item.producer=new Comp.ResourceProductor(master,cfg);
                }
            };
            var upgrade=function(){
                if(!selected || moving){status.setString('请先选择建筑并结束移动');return;}
                var b=buildingOf(localState,selected.uid);
                if(b.upgrade){status.setString('建筑正在升级');return;}
                if(!upgradeTypes[b.type]){confirmUid=null;status.setString('本次支持龙首之城、日光井和龙银矿升到二级');return;}
                if(confirmUid!==b.uid){confirmUid=b.uid;showSelected();return;}
                confirmUid=null;
                var builder=makeBuilder(b),cfg=data.unit_main[b.type];
                if(data.unit_main[localState.buildings[0].type].lv<cfg.rely_base_lv){status.setString('请先将龙首之城升至 '+cfg.rely_base_lv+' 级');return;}
                for(var i=0;i<localState.buildings.length;i++)if(localState.buildings[i].upgrade){status.setString('建筑师忙碌，请等待当前升级完成');return;}
                var resource=builder.resType===RES_TYPE_GOLD?'gold':'wood',cost=builder.getRealCost();
                if(localState.resources[resource]<cost){status.setString('资源不足，需要 '+cost+(resource==='gold'?' 龙币':' 日光'));return;}
                var next=JSON.parse(JSON.stringify(localState)),nb=buildingOf(next,b.uid),start=nowSec();
                if(selected.producer)next.production[b.uid]={stored:producerAmount(selected),lastHour:start/3600};
                next.resources[resource]-=cost;nb.upgrade={target:upgradeTypes[b.type],started:start,ends:start+builder.buildTime};next.revision++;
                try{persist(next);}catch(e){status.setString('保存失败，升级未完成');cc.log('DinoLocal save failed: '+e);return;}
                showSelected();
            };
            showSelected();
            // Refresh""")
replace("scene.schedule(function(){if(++displayTicks%5===0 && selected && selected.producer && !moving)showSelected();},1);", """scene.schedule(function(){
                try{
                    var changed=settle();
                    for(var i=0;i<nodes.length;i++)if(changed.indexOf(nodes[i].uid)>=0)refreshItem(nodes[i]);
                    if(changed.length || (++displayTicks%2===0 && selected && !moving))showSelected();
                }catch(e){status.setString('升级更新失败，请返回重进');cc.log('DinoLocal update failed: '+e);}
            },1);""")
replace("if(p.x>size.width/2){collect();return;}", "if(p.x>size.width*.67){upgrade();return;}\n                    if(p.x>size.width*.33){collect();return;}\n                    confirmUid=null;\n                    if(selected && buildingOf(localState,selected.uid).upgrade){status.setString('升级期间不能移动建筑');return;}")
replace("if(best){selected=best;showSelected();}", "if(best){selected=best;confirmUid=null;showSelected();}")
replace('local-economy-ready','local-upgrade-ready')
replace('\\u672c\\u5730\\u751f\\u4ea7\\u91c7\\u96c6\\u6d4b\\u8bd5','本地建筑升级测试')
# evalString on this old engine requires ASCII source with escaped Chinese.
(W/'upgrade_boot.js').write_text(s.encode('ascii','backslashreplace').decode('ascii'),encoding='ascii')
builder=(W/'build_economy.py').read_text().replace('dino-local-economy.apk','dino-local-upgrade.apk').replace('economy_boot.js','upgrade_boot.js')
(W/'build_upgrade.py').write_text(builder,encoding='utf-8')
print('Generated upgrade_boot.js and build_upgrade.py')
