(function() {
    try {
        PATCH_ENABLED = false;
        NtUniSdkEnabled = false;
        __PLAY_MODE = __PLAY_MODE_OFF_LINE;
        NETWORK_TICK_ENABLE = false;
        PLAYER_OFFLINE_CHECK_ENABLE = false;
        DestroyVersionControlAndEnterGame();
        var menu = G_MainController.MainMenu.controller;
        menu.showMaintenanceNotice = function() {};
        menu.touchMask.setVisible(false);
        menu.loginCommon.controller.autoLogin = function() {};
        menu.rootNode.animationManager.runAnimations("default");

        // Keep the original entry animation, tip page and TaskManager progress.
        var __localLoadingLog = function(message) {
            __localLoadingTrace.push(message);
        };
        __localLoadingTrace = [];

        var saveKey = 'dino.local.city.v3';
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
        };
        DA.SynServerTime(Date.now()/1000);
        var defaults = [
            ['20101',1900,1400],['20201',1500,1150],['20301',2400,1300],
            ['20401',2300,950],['20501',1750,800],['20601',1300,1600],
            ['20701',2500,1750],['21201',1800,1900]
        ];
        var validate = function(value) {
            if (!value || value.version !== 3 || value.playerId !== 'local-001' ||
                !value.buildings || value.buildings.length !== defaults.length) throw Error('Invalid local save');
            for (var i=0;i<defaults.length;i++) {
                var b=value.buildings[i];
                if (!b || b.uid !== 'building-'+i || (b.type !== defaults[i][0] && b.type !== upgradeTypes[defaults[i][0]]) ||
                    typeof b.x !== 'number' || typeof b.y !== 'number' ||
                    !isFinite(b.x) || !isFinite(b.y) || b.x<250 || b.x>3582 || b.y<250 || b.y>2562)
                    throw Error('Invalid local building '+i);
            }
            var active=0;
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
            if (!value.resources || !value.production) throw Error('Missing economy state');
            for(var ri=0;ri<2;ri++){
                var key=ri===0?'gold':'wood',amount=value.resources[key];
                if(typeof amount!=='number' || !isFinite(amount) || amount<0 || Math.floor(amount)!==amount) throw Error('Invalid resource '+key);
            }
            for(var pi=0;pi<value.buildings.length;pi++){
                var b=value.buildings[pi],cfg=data.unit_main[b.type];
                if(cfg.gold_produce || cfg.wood_produce){
                    var prod=value.production[b.uid];
                    if(!prod || typeof prod.lastHour!=='number' || !isFinite(prod.lastHour) || prod.lastHour<0 ||
                        typeof prod.stored!=='number' || !isFinite(prod.stored) || prod.stored<0 || prod.stored>cfg.temp_storage)
                        throw Error('Invalid producer '+b.uid);
                }
            }
            if(typeof value.revision!=='number' || !isFinite(value.revision) || value.revision<0 || Math.floor(value.revision)!==value.revision) throw Error('Invalid revision');
            return value;
        };
        var raw = sys.localStorage.getItem(saveKey);
        var localState;
        if(raw) localState=validate(JSON.parse(raw));
        else {
            var oldRaw=sys.localStorage.getItem('dino.local.city.v2') || sys.localStorage.getItem('dino.local.city.v1');
            if(oldRaw){
                localState=JSON.parse(oldRaw);
                if(localState.version!==1 && localState.version!==2)throw Error('Invalid legacy save');
            } else {
                localState={playerId:'local-001',revision:0,buildings:[]};
                for(var di=0;di<defaults.length;di++) localState.buildings.push({
                    uid:'building-'+di,type:defaults[di][0],x:defaults[di][1],y:defaults[di][2]
                });
            }
            localState.version=3;localState.resources=localState.resources||{gold:0,wood:0};localState.production=localState.production||{};
            for(var pi=0;pi<localState.buildings.length;pi++){
                var b=localState.buildings[pi],cfg=data.unit_main[b.type];
                if(cfg && (cfg.gold_produce || cfg.wood_produce) && !localState.production[b.uid])localState.production[b.uid]={stored:0,lastHour:DA.getSystemCurrentTimeHour()};
            }
        }
        var capacity={gold:0,wood:0};
        var updateCapacity=function(){
        capacity.gold=0;capacity.wood=0;
        for(var ci=0;ci<localState.buildings.length;ci++){
            var cfg=data.unit_main[localState.buildings[ci].type];
            if(cfg){capacity.gold+=cfg.gold_storage||0;capacity.wood+=cfg.wood_storage||0;}
        }
        };
        updateCapacity();
        var syncWallet=function(){
            updateCapacity();
            if(!G_Player)return;
            var r=G_Player.getComponent('ResourceManager');
            r.Res[RES_TYPE_GOLD]=localState.resources.gold;r.Res[RES_TYPE_WOOD]=localState.resources.wood;
            r.maxRes[RES_TYPE_GOLD]=capacity.gold;r.maxRes[RES_TYPE_WOOD]=capacity.wood;
        };
        var persist = function(next) {
            validate(next);
            var encoded=JSON.stringify(next);
            sys.localStorage.setItem(saveKey,encoded);
            if(sys.localStorage.getItem(saveKey)!==encoded) throw Error('Save readback failed');
            localState=next;syncWallet();
            cc.log('DinoLocal save revision '+next.revision);
        };
        if (!raw) persist(localState);
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
        settle();
        var entering = false;
        var restoreEntry = function() {
            entering = false;
            if (menu.loadingTip) {
                menu.loadingTip.removeFromParent();
                menu.loadingTip = null;
            }
            menu.witticismTip.setString("");
            menu.tutorialTip.setString("");
            menu.progressNode.getParent().setVisible(false);
            menu.gotoDefaultPage();
            menu.rootNode.setVisible(true);
            menu.touchMask.setVisible(false);
            menu.rootNode.animationManager.runAnimations("default");
            caption.setVisible(true);
        };
        var openLocalPreview = function() {
            if (entering) return;
            entering = true;
            caption.setVisible(false);
            menu.progressNode.getParent().setVisible(true);
            if (!G_Player) {
                G_Player = new ClientPlayer(G_UnitManager.getAndPlusCID());
                G_Player._isPlayer = true;
            }
            settle();syncWallet();
            var tasks = [];
            var enqueue = function(fn) {
                tasks.push([DA.TASK_TYPE_SELECTOR, function() {
                    try { fn(); } catch (error) {
                        __localLoadingLog("DinoLocal loading failed: " + error + " " + error.stack);
                        failed = true;
                    }
                }]);
                // Yield a rendered frame between resource tasks.
                tasks.push([DA.TASK_TYPE_DELAY, 1/30]);
            };
            var failed = false;
            var scene, map;
            enqueue(function() {
                scene = cc.Scene.create();
                scene.retain();
                map = cc.BuilderReader.load('map/ccb/sub_map_build.ccbi');
                scene.addChild(map);
                __localLoadingLog("DinoLocal loading: map ready");
            });
            var size = G_Director.getWinSize();
            var controllerLookup = getControllerByName;
            var specs = [];
            for(var si=0;si<localState.buildings.length;si++) {
                var saved=localState.buildings[si];
                specs.push([saved.type,saved.x,saved.y,saved.uid]);
            }
            var nodes = [];
            for (var i = 0; i < specs.length; i++) (function(spec) {
                enqueue(function() {
                    if (failed) return;
            getControllerByName = function(name) {
                var info = controllerLookup(name);
                if (name === 'Unit') info[0] = function() {};
                return info;
            };
                    try {
                        var cfg = data.unit_main[spec[0]];
                        var node = cc.BuilderReader.load(cfg.home_res);
                        node.setPosition(spec[1], spec[2]); node.setScale(1.5);
                        map.addChild(node, 3000-spec[2]);
                        if (node.animationManager) {
                            var names = node.animationManager.getSequenceNames();
                            if (names.indexOf('idle_run') >= 0) node.animationManager.runAnimations('idle_run');
                        }
                        var item={id:spec[0],uid:spec[3],x:spec[1],y:spec[2],node:node,name:G_StringManager.str(cfg.name)};
                        if(cfg.gold_produce || cfg.wood_produce){
                            var master={stage:GS_STAGE_BUILD,getComponent:function(name){
                                return name==='BuildingBuilder'?{isBuildingFinished:function(){return true;}}:null;
                            }};
                            item.producer=new Comp.ResourceProductor(master,cfg);
                            item.resource=cfg.gold_produce?'gold':'wood';
                        }
                        nodes.push(item);
                        __localLoadingLog("DinoLocal loading: building " + spec[0] + " ready");
                    } finally { getControllerByName = controllerLookup; }
                });
            })(specs[i]);
            enqueue(function() {
            if (failed) return;
            var label=function(text,x,y,font) {
                var n=cc.LabelTTF.create(text,'Arial',font||22);
                n.setPosition(x,y); scene.addChild(n,2000); return n;
            };
            var bar=cc.LayerColor.create({r:22,g:39,b:29,a:225});
            bar.setContentSize({width:size.width,height:64});bar.setPosition(0,size.height-64);scene.addChild(bar,1500);
            var footer=cc.LayerColor.create({r:22,g:39,b:29,a:225});
            footer.setContentSize({width:size.width,height:86});scene.addChild(footer,1500);
            label('\u8fd4\u56de',55,size.height-32);
            var walletLabel=label('',size.width/2-60,size.height-32,18);
            label('\u590d\u4f4d',size.width-245,size.height-32);
            label('\uff0b',size.width-140,size.height-32,32);
            label('\uff0d',size.width-55,size.height-32,32);

            var status=label('\u9009\u62e9\u65e5\u5149\u4e95\u6216\u9f99\u94f6\u77ff\u53ef\u91c7\u96c6\u8d44\u6e90',size.width/2,59,19);
            var action=label('\u79fb\u52a8\u5efa\u7b51',size.width*.18,23,22);

            var collectLabel=label('\u91c7\u96c6\u8d44\u6e90',size.width*.5,23,22);
            var upgradeLabel=label('\u5347\u7ea7\u5efa\u7b51',size.width*.82,23,22);
            var selected=null,moving=false,confirmUid=null;
            var marker=cc.LabelTTF.create('','Arial',26);map.addChild(marker,9999);
            var producerAmount=function(item){
                var b=buildingOf(localState,item.uid);
                var saved=localState.production[item.uid];
                if(b.upgrade)return saved.stored;
                item.producer.currentStorage=saved.stored;
                item.producer.lastCollectTime=saved.lastHour;
                return Math.max(0,Math.min(item.producer.maxStorage,item.producer.getStoredResourceNum()));
            };
            var showSelected=function(){
                walletLabel.setString('\u9f99\u5e01 '+localState.resources.gold+'/'+capacity.gold+'  \u65e5\u5149 '+localState.resources.wood+'/'+capacity.wood);
                if(!selected)return;
                marker.setString('['+selected.name+' Lv.'+data.unit_main[selected.id].lv+']');marker.setPosition(selected.x,selected.y+400);
                var info=moving?'\u70b9\u51fb\u5730\u56fe\u7a7a\u4f4d\u653e\u7f6e':'\u4f4d\u7f6e\u5df2\u4fdd\u5b58';
                if(selected.producer && !moving)info='\u5f85\u91c7\u96c6 '+producerAmount(selected)+'/'+selected.producer.maxStorage+' \u00b7 '+selected.producer.produceSpeed+'/\u5c0f\u65f6';
                var b=buildingOf(localState,selected.uid),builder=makeBuilder(b);
                if(b.upgrade)info='\u5347\u7ea7\u4e2d \xb7 \u5269\u4f59 '+Math.max(0,builder.getNeedTime())+' \u79d2';
                else if(confirmUid===b.uid)info='\u5347\u81f3\u4e8c\u7ea7\uff1a'+builder.getRealCost()+(builder.resType===RES_TYPE_GOLD?' \u9f99\u5e01':' \u65e5\u5149')+' \xb7 '+builder.buildTime+' \u79d2 \xb7 \u518d\u70b9\u786e\u8ba4';
                status.setString(selected.name+' Lv.'+data.unit_main[b.type].lv+' \xb7 '+info);
                upgradeLabel.setString(confirmUid===b.uid?'\u786e\u8ba4\u5347\u7ea7':'\u5347\u7ea7\u5efa\u7b51');
                upgradeLabel.setColor(upgradeTypes[b.type] && !b.upgrade && !moving?{r:255,g:235,b:130}:{r:150,g:150,b:150});
                action.setString(moving?'\u53d6\u6d88\u79fb\u52a8':'\u79fb\u52a8\u5efa\u7b51');
                collectLabel.setColor(selected.producer && !moving && !b.upgrade?{r:255,g:235,b:130}:{r:150,g:150,b:150});
            };
            var collect=function(){
                if(!selected || !selected.producer || moving){status.setString('\u8bf7\u9009\u62e9\u65e5\u5149\u4e95\u6216\u9f99\u94f6\u77ff');return;}
                confirmUid=null;
                if(buildingOf(localState,selected.uid).upgrade){status.setString('\u5347\u7ea7\u671f\u95f4\u6682\u505c\u751f\u4ea7\u548c\u91c7\u96c6');return;}
                var stored=producerAmount(selected);
                if(!stored){status.setString('\u8d44\u6e90\u751f\u4ea7\u4e2d\uff0c\u6bcf '+(3600/selected.producer.produceSpeed)+' \u79d2\u4ea7\u51fa 1 \u70b9');return;}
                syncWallet();
                var nums=selected.producer.calculateCollectRes();
                var amount=Math.max(0,Math.min(stored,nums[0]));
                if(!amount){status.setString('\u4ed3\u5e93\u5df2\u6ee1\uff0c\u8d44\u6e90\u4fdd\u7559\u5728\u751f\u4ea7\u5efa\u7b51');return;}
                var next=JSON.parse(JSON.stringify(localState));
                next.resources[selected.resource]+=amount;
                next.production[selected.uid]={stored:stored-amount,lastHour:DA.getSystemCurrentTimeHour()};next.revision++;
                try{persist(next);}catch(error){status.setString('\u4fdd\u5b58\u5931\u8d25\uff0c\u91c7\u96c6\u672a\u5b8c\u6210');cc.log('DinoLocal save failed: '+error);return;}
                showSelected();status.setString(selected.name+' \u00b7 \u5df2\u91c7\u96c6 '+amount+' \u00b7 \u5df2\u4fdd\u5b58');
            };
            var refreshItem=function(item){
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
                if(!selected || moving){status.setString('\u8bf7\u5148\u9009\u62e9\u5efa\u7b51\u5e76\u7ed3\u675f\u79fb\u52a8');return;}
                var b=buildingOf(localState,selected.uid);
                if(b.upgrade){status.setString('\u5efa\u7b51\u6b63\u5728\u5347\u7ea7');return;}
                if(!upgradeTypes[b.type]){confirmUid=null;status.setString('\u672c\u6b21\u652f\u6301\u9f99\u9996\u4e4b\u57ce\u3001\u65e5\u5149\u4e95\u548c\u9f99\u94f6\u77ff\u5347\u5230\u4e8c\u7ea7');return;}
                if(confirmUid!==b.uid){confirmUid=b.uid;showSelected();return;}
                confirmUid=null;
                var builder=makeBuilder(b),cfg=data.unit_main[b.type];
                if(data.unit_main[localState.buildings[0].type].lv<cfg.rely_base_lv){status.setString('\u8bf7\u5148\u5c06\u9f99\u9996\u4e4b\u57ce\u5347\u81f3 '+cfg.rely_base_lv+' \u7ea7');return;}
                for(var i=0;i<localState.buildings.length;i++)if(localState.buildings[i].upgrade){status.setString('\u5efa\u7b51\u5e08\u5fd9\u788c\uff0c\u8bf7\u7b49\u5f85\u5f53\u524d\u5347\u7ea7\u5b8c\u6210');return;}
                var resource=builder.resType===RES_TYPE_GOLD?'gold':'wood',cost=builder.getRealCost();
                if(localState.resources[resource]<cost){status.setString('\u8d44\u6e90\u4e0d\u8db3\uff0c\u9700\u8981 '+cost+(resource==='gold'?' \u9f99\u5e01':' \u65e5\u5149'));return;}
                var next=JSON.parse(JSON.stringify(localState)),nb=buildingOf(next,b.uid),start=nowSec();
                if(selected.producer)next.production[b.uid]={stored:producerAmount(selected),lastHour:start/3600};
                next.resources[resource]-=cost;nb.upgrade={target:upgradeTypes[b.type],started:start,ends:start+builder.buildTime};next.revision++;
                try{persist(next);}catch(e){status.setString('\u4fdd\u5b58\u5931\u8d25\uff0c\u5347\u7ea7\u672a\u5b8c\u6210');cc.log('DinoLocal save failed: '+e);return;}
                showSelected();
            };
            showSelected();
            // Refresh only the read-only display. Timestamps are saved on collection.
            var displayTicks=0;
            scene.schedule(function(){
                try{
                    var changed=settle();
                    for(var i=0;i<nodes.length;i++)if(changed.indexOf(nodes[i].uid)>=0)refreshItem(nodes[i]);
                    if(changed.length || (++displayTicks%2===0 && selected && !moving))showSelected();
                }catch(e){status.setString('\u5347\u7ea7\u66f4\u65b0\u5931\u8d25\uff0c\u8bf7\u8fd4\u56de\u91cd\u8fdb');cc.log('DinoLocal update failed: '+e);}
            },1);
            var place=function(x,y){
                x=Math.max(250,Math.min(3582,Math.round(x)));
                y=Math.max(250,Math.min(2562,Math.round(y)));
                for(var ni=0;ni<nodes.length;ni++)if(nodes[ni]!==selected){
                    var dx=x-nodes[ni].x,dy=y-nodes[ni].y;
                    if(dx*dx+dy*dy<260*260){status.setString('\u4e0e\u5176\u4ed6\u5efa\u7b51\u592a\u8fd1\uff0c\u8bf7\u91cd\u9009\u4f4d\u7f6e');return;}
                }
                var next=JSON.parse(JSON.stringify(localState));
                for(var bi=0;bi<next.buildings.length;bi++)if(next.buildings[bi].uid===selected.uid){next.buildings[bi].x=x;next.buildings[bi].y=y;}
                next.revision++;
                try { persist(next); } catch(error){
                    status.setString('\u4fdd\u5b58\u5931\u8d25\uff0c\u5efa\u7b51\u4fdd\u6301\u539f\u4f4d');cc.log('DinoLocal save failed: '+error);return;
                }
                selected.x=x;selected.y=y;selected.node.setPosition(x,y);selected.node.setZOrder(3000-y);
                moving=false;showSelected();
            };
            var clamp=function(){
                var z=map.getScale(),p=map.getPosition();
                p.x=Math.max(size.width-3832*z,Math.min(0,p.x));
                p.y=Math.max(size.height-2812*z,Math.min(0,p.y));
                map.setPosition(p.x,p.y);
            };
            var reset=function(){map.setScale(.45);map.setPosition(size.width/2-3832*.45/2,size.height/2-2812*.45/2);};
            var zoom=function(d){
                var p=map.getPosition(),old=map.getScale(),z=Math.max(.3,Math.min(.8,old+d));
                var x=(size.width/2-p.x)/old,y=(size.height/2-p.y)/old;
                map.setScale(z);map.setPosition(size.width/2-x*z,size.height/2-y*z);clamp();
            };
            reset();
            var touch=new UI.Touchable();touch.rootNode=scene;
            touch.onTouchesBegan=function(t){if(!t.length)return;this.first=t[0].getLocation();this.last=this.first;this.moved=false;};
            touch.onTouchesMoved=function(t){
                if(!t.length || !this.last || this.first.y>size.height-64 || this.first.y<86)return;
                var p=t[0].getLocation(),mp=map.getPosition();
                map.setPosition(mp.x+p.x-this.last.x,mp.y+p.y-this.last.y);clamp();
                if(Math.abs(p.x-this.first.x)+Math.abs(p.y-this.first.y)>8)this.moved=true;
                this.last=p;
            };
            touch.onTouchesEnded=function(t){
                if(!this.first || this.moved)return;
                var p=this.first;
                if(p.y>size.height-64){
                    if(p.x<110){touch.destroy();G_Director.popScene();restoreEntry();}
                    else if(p.x>size.width-100)zoom(-.07);
                    else if(p.x>size.width-190)zoom(.07);
                    else if(p.x>size.width-300)reset();
                    return;
                }

                if(p.y<86){
                    if(p.x>size.width*.67){upgrade();return;}
                    if(p.x>size.width*.33){collect();return;}
                    confirmUid=null;
                    if(selected && buildingOf(localState,selected.uid).upgrade){status.setString('\u5347\u7ea7\u671f\u95f4\u4e0d\u80fd\u79fb\u52a8\u5efa\u7b51');return;}
                    if(selected){moving=!moving;showSelected();}
                    else status.setString('\u8bf7\u5148\u70b9\u51fb\u4e00\u5ea7\u5efa\u7b51');
                    return;
                }
                var mp=map.getPosition(),z=map.getScale(),x=(p.x-mp.x)/z,y=(p.y-mp.y)/z;
                if(moving && selected){place(x,y);return;}
                var best=null,dist=190*190;
                for(var i=0;i<nodes.length;i++){
                    var n=nodes[i],dx=x-n.x,dy=y-(n.y+90),d=dx*dx+dy*dy;
                    if(d<dist){dist=d;best=n;}
                }
                if(best){selected=best;confirmUid=null;showSelected();}
            };
            touch.onTouchesCancelled=function(){this.last=null;};
            touch.initEventWithMultiTouch();
            if(!touch.__touch_layer.getParent())scene.addChild(touch.__touch_layer,1000);
            touch.enableTouchEvent();
            touch.backClicked=function(){touch.destroy();G_Director.popScene();restoreEntry();};
            touch.menuClicked=function(){};touch.initKeypadEvent();touch.enableKeypadEvent();
            __localLoadingLog("DinoLocal loading: controls ready");
            });
            // The original event task waits for the entergame animation before
            // resource tasks execute. Each selector runs through the engine queue.
            tasks.push([DA.TASK_TYPE_SELECTOR, function() { menu.onEnterGameEnd(); }]);
            tasks.push([DA.TASK_TYPE_DELAY, 0.2]);
            tasks.push([DA.TASK_TYPE_SELECTOR, function() {
                if (failed) {
                    if (scene) scene.release();
                    restoreEntry();
                    G_MainController.setNotice("Local resource loading failed. See DinoLocal log.");
                    return;
                }
                G_Director.pushScene(scene);
                scene.release();
                __localLoadingLog("DinoLocal loading: preview entered");
            }]);
            DA.TaskManager.getInstance().pushBackTaskList(tasks);
            menu.playEnterGameAction();
            __localLoadingLog("DinoLocal loading: original entry transition started");
        };
        G_MainController.platformLogin = openLocalPreview;
        G_MainController.login = openLocalPreview;
        G_MainController.quickLogin = openLocalPreview;
        var size = G_Director.getWinSize();
        var caption = cc.LabelTTF.create("\u672c\u5730\u5efa\u7b51\u5347\u7ea7\u6d4b\u8bd5 \u00b7 \u70b9\u51fb\u8fdb\u5165\u6e38\u620f", "Arial", 18);
        caption.setPosition(size.width / 2, 24);
        menu.rootNode.addChild(caption, 99999);
        G_Director.setAnimationInterval(1 / 30);
        G_Director.resume();
        G_Director.startAnimation();
        cc.log("DinoLocal: local entry scene ready");
        return JSON.stringify({status:"local-upgrade-ready", patch:PATCH_ENABLED, mode:__PLAY_MODE});
    } catch (error) {
        return JSON.stringify({status:"failed", message:String(error), stack:error.stack});
    }
})();
