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

        var saveKey = 'dino.local.city.v12';
        var upgradeTypes=(function(){var map={},prefixes=['201','202','203','204','205','206','207'];for(var pi=0;pi<prefixes.length;pi++){var prefix=prefixes[pi],ids=[];for(var n=1;n<=20;n++){var id=String(Number(prefix)*100+n);if(data.unit_main[id])ids.push(id);}for(var i=0;i<ids.length-1;i++){var cfg=data.unit_main[ids[i]];if(cfg && cfg.lv_up_able)map[ids[i]]=ids[i+1];}}return map;})();
        var allowedTypes=function(base){
            var out={},cur=base;out[cur]=true;
            while(upgradeTypes[cur]){cur=upgradeTypes[cur];out[cur]=true;}
            return out;
        };
        var CONSTRUCT_OPTIONS=[
            {type:'20201',family:'202',label:'\u65e5\u5149\u4e95'},
            {type:'20401',family:'204',label:'\u9f99\u94f6\u77ff'}
        ];
        var MAX_EXTRA=10;
        var constructPick=0;
        var constructOption=function(){return CONSTRUCT_OPTIONS[constructPick];};
        var extraAllowed=function(type){
            for(var oi=0;oi<CONSTRUCT_OPTIONS.length;oi++)
                if(allowedTypes(CONSTRUCT_OPTIONS[oi].type)[type])return true;
            return false;
        };
        var nextConstructPick=function(state,from){
            for(var i=0;i<CONSTRUCT_OPTIONS.length;i++){
                var idx=(from+i)%CONSTRUCT_OPTIONS.length,opt=CONSTRUCT_OPTIONS[idx];
                if(familyCount(state,opt.family)<maxFamily(state,opt.family))return idx;
            }
            return -1;
        };
        var constructResKey=function(builder){
            return builder.resType===RES_TYPE_GOLD?'gold':'wood';
        };
        var constructResLabel=function(key){
            return key==='gold'?'\u9f99\u5e01':'\u65e5\u5149';
        };
        var cityLevelOf=function(state){
            for(var ci=0;ci<state.buildings.length;ci++){
                if(String(state.buildings[ci].type).indexOf('201')===0)
                    return data.unit_main[state.buildings[ci].type].lv;
            }
            return 1;
        };
        var familyCount=function(state,fam){
            var n=0;
            for(var fi=0;fi<state.buildings.length;fi++)
                if(String(state.buildings[fi].type).indexOf(fam)===0)n++;
            return n;
        };
        var maxFamily=function(state,fam){
            var bn=data.build_number[fam];
            if(!bn)return 0;
            var lv=cityLevelOf(state),key='lv'+lv+'_num';
            return bn[key]||0;
        };
        var nextBuildingUid=function(state){
            var max=-1;
            for(var ui=0;ui<state.buildings.length;ui++){
                var m=String(state.buildings[ui].uid).match(/^building-(\d+)$/);
                if(m)max=Math.max(max,Number(m[1]));
            }
            return 'building-'+(max+1);
        };
        var TRAIN_FAMILY='114';
        var trainTypes=(function(){
            var ids=[];
            for(var n=1;n<=10;n++){var id=TRAIN_FAMILY+('0'+n).slice(-2);if(data.unit_main[id])ids.push(id);}
            return ids;
        })();
        var TRAIN_MAX_BUFFER=1;
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
            else if(b.construct){comp.state=BUILD_STATE_BUILDING;comp.beginTime=b.construct.started;}
            return comp;
        };
        DA.SynServerTime(Date.now()/1000);
        // Default layout as tile corners (min x/y of footprint) inside MAP_SIZE_BUILD.
        var defaults = [
            ['20101',28,28],['20201',22,24],['20301',34,24],
            ['20401',34,18],['20501',22,18],['20601',18,30],
            ['20701',36,32],['21201',26,36]
        ];

        // Original isometric rules from world1.tmx + MapManager constants.
        var TILE_W=64, TILE_H=47, HALF_W=32, HALF_H=23.5;
        var TILE_ORIGIN_X=1888, TILE_ORIGIN_Y=2773;
        var BUILD_RANGE={xmin:MAP_SIZE_BUILD.xmin,ymin:MAP_SIZE_BUILD.ymin,xmax:MAP_SIZE_BUILD.xmax,ymax:MAP_SIZE_BUILD.ymax};
        var COLOR_OK=UI_COLOR_TILE_DRAGED_AVAILABLE||{r:140,g:245,b:70};
        var COLOR_BAD=UI_COLOR_TILE_DRAGED_UNAVAILABLE||{r:250,g:72,b:60};
        var TILE_OPACITY=typeof UI_TILE_NO_LANDING_OPACITY==='number'?UI_TILE_NO_LANDING_OPACITY:125;
        var buildingScale=function(type){
            var res=data.unit_resource[type]||{};
            var sr=res.scale_rate==null?1:res.scale_rate;
            return sr*OBJ_LAYER_SCALE;
        };
        var footprintOf=function(type){
            var cfg=data.unit_main[type];
            return {sx:cfg.tilesize_x|0, sy:cfg.tilesize_y|0};
        };
        var tileCenter=function(tx,ty){
            return {x:TILE_ORIGIN_X+(tx-ty)*HALF_W, y:TILE_ORIGIN_Y-(tx+ty)*HALF_H};
        };
        var logicFromPos=function(px,py){
            var a=(px-TILE_ORIGIN_X)/HALF_W, b=(TILE_ORIGIN_Y-py)/HALF_H;
            return {x:(a+b)/2, y:(b-a)/2};
        };
        var footprintCenter=function(tx,ty,sx,sy){
            return tileCenter(tx+(sx-1)/2, ty+(sy-1)/2);
        };
        var roundTile=function(v){return Math.round(v);};
        var snapCorner=function(px,py,sx,sy){
            var mid=logicFromPos(px,py);
            var tx=roundTile(mid.x-(sx-1)/2), ty=roundTile(mid.y-(sy-1)/2);
            return {tx:tx,ty:ty};
        };
        var inBuildRange=function(tx,ty,sx,sy){
            return tx>=BUILD_RANGE.xmin && ty>=BUILD_RANGE.ymin &&
                tx+sx-1<=BUILD_RANGE.xmax && ty+sy-1<=BUILD_RANGE.ymax;
        };
        var footprintsOverlap=function(ax,ay,asx,asy,bx,by,bsx,bsy){
            return !(ax+asx<=bx || bx+bsx<=ax || ay+asy<=by || by+bsy<=ay);
        };
        var occupiedByOthers=function(state,tx,ty,sx,sy,exceptUid){
            for(var i=0;i<state.buildings.length;i++){
                var b=state.buildings[i];
                if(exceptUid && b.uid===exceptUid)continue;
                var fp=footprintOf(b.type);
                var ox=b.tilex, oy=b.tiley;
                if(ox==null || oy==null){
                    var c=snapCorner(b.x,b.y,fp.sx,fp.sy);ox=c.tx;oy=c.ty;
                }
                if(footprintsOverlap(tx,ty,sx,sy,ox,oy,fp.sx,fp.sy))return true;
            }
            return false;
        };
        var canPlaceAt=function(state,type,tx,ty,exceptUid){
            var fp=footprintOf(type);
            if(!inBuildRange(tx,ty,fp.sx,fp.sy))return false;
            if(occupiedByOthers(state,tx,ty,fp.sx,fp.sy,exceptUid))return false;
            return true;
        };
        var applyTileToBuilding=function(b,tx,ty){
            var fp=footprintOf(b.type), c=footprintCenter(tx,ty,fp.sx,fp.sy);
            b.tilex=tx;b.tiley=ty;b.x=c.x;b.y=c.y;
        };
        var migrateBuildingToGrid=function(b,state,exceptSelf){
            var fp=footprintOf(b.type);
            var corner=snapCorner(b.x,b.y,fp.sx,fp.sy);
            var tx=corner.tx, ty=corner.ty;
            if(canPlaceAt(state,b.type,tx,ty,exceptSelf?b.uid:null)){
                applyTileToBuilding(b,tx,ty);return {tx:tx,ty:ty,moved:false};
            }
            // Spiral search for nearest free footprint inside build range.
            for(var radius=1;radius<=40;radius++){
                for(var dx=-radius;dx<=radius;dx++){
                    for(var dy=-radius;dy<=radius;dy++){
                        if(Math.max(Math.abs(dx),Math.abs(dy))!==radius)continue;
                        var nx=tx+dx, ny=ty+dy;
                        if(canPlaceAt(state,b.type,nx,ny,exceptSelf?b.uid:null)){
                            applyTileToBuilding(b,nx,ny);
                            return {tx:nx,ty:ny,moved:true};
                        }
                    }
                }
            }
            applyTileToBuilding(b,tx,ty);
            return {tx:tx,ty:ty,moved:true,forced:true};
        };
        var validate = function(value) {
            if (!value || value.version !== 12 || value.playerId !== 'local-001' ||
                !value.buildings || value.buildings.length < defaults.length ||
                value.buildings.length > defaults.length+MAX_EXTRA)
                throw Error('Invalid local save');
            var seenUid={};
            for (var i=0;i<defaults.length;i++) {
                var b=value.buildings[i];
                if (!b || b.uid !== 'building-'+i || !allowedTypes(defaults[i][0])[b.type] ||
                    typeof b.x !== 'number' || typeof b.y !== 'number' ||
                    !isFinite(b.x) || !isFinite(b.y) ||
                    typeof b.tilex !== 'number' || typeof b.tiley !== 'number' ||
                    !isFinite(b.tilex) || !isFinite(b.tiley) ||
                    !inBuildRange(b.tilex,b.tiley,footprintOf(b.type).sx,footprintOf(b.type).sy))
                    throw Error('Invalid local building '+i);
                seenUid[b.uid]=true;
            }
            for (var ei=defaults.length;ei<value.buildings.length;ei++) {
                var eb=value.buildings[ei];
                if (!eb || typeof eb.uid!=='string' || !/^building-\d+$/.test(eb.uid) ||
                    seenUid[eb.uid] || !extraAllowed(eb.type) ||
                    typeof eb.x !== 'number' || typeof eb.y !== 'number' ||
                    !isFinite(eb.x) || !isFinite(eb.y) ||
                    typeof eb.tilex !== 'number' || typeof eb.tiley !== 'number' ||
                    !isFinite(eb.tilex) || !isFinite(eb.tiley) ||
                    !inBuildRange(eb.tilex,eb.tiley,footprintOf(eb.type).sx,footprintOf(eb.type).sy))
                    throw Error('Invalid extra building '+ei);
                seenUid[eb.uid]=true;
            }
            for(var fi2=0;fi2<CONSTRUCT_OPTIONS.length;fi2++){
                var fam=CONSTRUCT_OPTIONS[fi2].family;
                if(familyCount(value,fam)>maxFamily(value,fam))
                    throw Error('Too many family '+fam);
            }
            for(var oi=0;oi<value.buildings.length;oi++){
                var ob=value.buildings[oi],ofp=footprintOf(ob.type);
                if(occupiedByOthers(value,ob.tilex,ob.tiley,ofp.sx,ofp.sy,ob.uid))
                    throw Error('Overlapping footprint '+ob.uid);
            }
            var jobs=value.training||{};
            for(var tk in jobs){
                var jl=jobs[tk],jb=null;
                if(!jl || typeof jl.typeid!=='string' || trainTypes.indexOf(jl.typeid)<0 ||
                    typeof jl.started!=='number' || !isFinite(jl.started) || jl.started<0 ||
                    typeof jl.ends!=='number' || !isFinite(jl.ends) ||
                    jl.ends!==jl.started+data.unit_main[jl.typeid].train_time)
                    throw Error('Invalid training job '+tk);
                for(var bi2=0;bi2<value.buildings.length;bi2++)
                    if(value.buildings[bi2].uid===tk)jb=value.buildings[bi2];
                if(!jb || String(jb.type).indexOf('207')!==0) throw Error('Training on non-barracks '+tk);
            }
            var active=0;
            for(var ui=0;ui<value.buildings.length;ui++){
                var ub=value.buildings[ui],job=ub.upgrade,cj=ub.construct;
                if(job){
                    active++;
                    if(job.target!==upgradeTypes[ub.type] || typeof job.started!=='number' || !isFinite(job.started) || job.started<0 ||
                        typeof job.ends!=='number' || !isFinite(job.ends) || job.ends!==job.started+data.unit_main[ub.type].lv_up_time)
                        throw Error('Invalid upgrade '+ub.uid);
                }
                if(cj){
                    active++;
                    if(typeof cj.started!=='number' || !isFinite(cj.started) || cj.started<0 ||
                        typeof cj.ends!=='number' || !isFinite(cj.ends) ||
                        cj.ends!==cj.started+data.unit_main[ub.type].lv_up_time)
                        throw Error('Invalid construct '+ub.uid);
                }
                if(job && cj)throw Error('Building both upgrading and constructing '+ub.uid);
            }
            if(active>1)throw Error('Too many local builder jobs');
            if (!value.resources || !value.production) throw Error('Missing economy state');
            for(var ri=0;ri<2;ri++){
                var key=ri===0?'gold':'wood',amount=value.resources[key];
                if(typeof amount!=='number' || !isFinite(amount) || amount<0 || Math.floor(amount)!==amount) throw Error('Invalid resource '+key);
            }
            for(var pi=0;pi<value.buildings.length;pi++){
                var b=value.buildings[pi],cfg=data.unit_main[b.type];
                if((cfg.gold_produce || cfg.wood_produce) && !b.construct){
                    var prod=value.production[b.uid];
                    if(!prod || typeof prod.lastHour!=='number' || !isFinite(prod.lastHour) || prod.lastHour<0 ||
                        typeof prod.stored!=='number' || !isFinite(prod.stored) || prod.stored<0 || prod.stored>cfg.temp_storage)
                        throw Error('Invalid producer '+b.uid);
                }
            }
            for(var si=0;si<value.buildings.length;si++){
                var sb=value.buildings[si];
                if(String(sb.type).indexOf('207')!==0)continue;
                var held=(value.soldiers||{})[sb.uid];
                if(held===undefined)continue;
                if(typeof held!=='number' || !isFinite(held) || held<0 || Math.floor(held)!==held ||
                    held>data.unit_main[sb.type].item_storage)
                    throw Error('Invalid soldier count '+sb.uid);
            }
            if(typeof value.revision!=='number' || !isFinite(value.revision) || value.revision<0 || Math.floor(value.revision)!==value.revision) throw Error('Invalid revision');
            return value;
        };
        var raw = sys.localStorage.getItem(saveKey);
        var localState;
        if(raw) localState=validate(JSON.parse(raw));
        else {
            var oldRaw=sys.localStorage.getItem('dino.local.city.v11') || sys.localStorage.getItem('dino.local.city.v10') || sys.localStorage.getItem('dino.local.city.v9') || sys.localStorage.getItem('dino.local.city.v8') || sys.localStorage.getItem('dino.local.city.v7') || sys.localStorage.getItem('dino.local.city.v6') || sys.localStorage.getItem('dino.local.city.v5') || sys.localStorage.getItem('dino.local.city.v4') || sys.localStorage.getItem('dino.local.city.v3') || sys.localStorage.getItem('dino.local.city.v2') || sys.localStorage.getItem('dino.local.city.v1');
            if(oldRaw){
                localState=JSON.parse(oldRaw);
                if(localState.version!==1 && localState.version!==2 && localState.version!==3 && localState.version!==4 && localState.version!==5 && localState.version!==6 && localState.version!==7 && localState.version!==8 && localState.version!==9 && localState.version!==10 && localState.version!==11)throw Error('Invalid legacy save');
            } else {
                localState={playerId:'local-001',revision:0,buildings:[]};
                for(var di=0;di<defaults.length;di++){
                    var db={uid:'building-'+di,type:defaults[di][0],x:0,y:0};
                    applyTileToBuilding(db,defaults[di][1],defaults[di][2]);
                    localState.buildings.push(db);
                }
            }
            localState.version=12;localState.resources=localState.resources||{gold:0,wood:0};localState.production=localState.production||{};localState.training=localState.training||{};
            localState.migrationNotes=localState.migrationNotes||[];
            for(var pi=0;pi<localState.buildings.length;pi++){
                var b=localState.buildings[pi],cfg=data.unit_main[b.type];
                if(cfg && (cfg.gold_produce || cfg.wood_produce) && !localState.production[b.uid])localState.production[b.uid]={stored:0,lastHour:DA.getSystemCurrentTimeHour()};
            }
            // Snap legacy pixel positions onto isometric tiles; record adjustments.
            for(var mi=0;mi<localState.buildings.length;mi++){
                var mb=localState.buildings[mi], beforeX=mb.x, beforeY=mb.y;
                var adj=migrateBuildingToGrid(mb,localState,true);
                if(adj.moved || mb.x!==beforeX || mb.y!==beforeY)
                    localState.migrationNotes.push({uid:mb.uid,from:[beforeX,beforeY],to:[mb.x,mb.y],tile:[mb.tilex,mb.tiley]});
            }
            if(localState.migrationNotes.length)
                cc.log('DinoLocal grid migrate '+JSON.stringify(localState.migrationNotes));
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
            var constructDone=[];
            for(var i=0;i<localState.buildings.length;i++){
                var b=localState.buildings[i];
                if(b.upgrade && nowSec()>=b.upgrade.ends){
                    if(!next)next=JSON.parse(JSON.stringify(localState));
                    var nb=next.buildings[i],end=nb.upgrade.ends;
                    nb.type=nb.upgrade.target;delete nb.upgrade;
                    // Production resumes at completion, including elapsed offline time.
                    if(next.production[nb.uid])next.production[nb.uid].lastHour=end/3600;
                    changed.push(nb.uid);
                }else if(b.construct && nowSec()>=b.construct.ends){
                    if(!next)next=JSON.parse(JSON.stringify(localState));
                    var nb2=next.buildings[i],end2=nb2.construct.ends,cfg2=data.unit_main[nb2.type];
                    delete nb2.construct;
                    if(cfg2.gold_produce || cfg2.wood_produce)
                        next.production[nb2.uid]={stored:0,lastHour:end2/3600};
                    changed.push(nb2.uid);
                    constructDone.push(nb2.uid);
                }
            }
            var trainDone=[];
            for(var tk2 in localState.training){
                var tj=localState.training[tk2];
                if(nowSec()<tj.ends)continue;
                if(!next)next=JSON.parse(JSON.stringify(localState));
                next.soldiers=next.soldiers||{};
                next.soldiers[tk2]=(next.soldiers[tk2]||0)+1;
                delete next.training[tk2];
                trainDone.push(tk2);
            }
            if(next){next.revision++;persist(next);}
            return {buildings:changed,training:trainDone,construct:constructDone};
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
                        node.setPosition(spec[1], spec[2]); node.setScale(buildingScale(spec[0]));
                        map.addChild(node, 3000-spec[2]);
                        if (node.animationManager) {
                            var names = node.animationManager.getSequenceNames();
                            if (names.indexOf('idle_run') >= 0) node.animationManager.runAnimations('idle_run');
                        }
                        var item={id:spec[0],uid:spec[3],x:spec[1],y:spec[2],node:node,name:G_StringManager.str(cfg.name)};
                        var savedB=buildingOf(localState,spec[3]);
                        if((cfg.gold_produce || cfg.wood_produce) && !savedB.construct){
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
            var footerH=120;
            var footer=cc.LayerColor.create({r:18,g:32,b:26,a:235});
            footer.setContentSize({width:size.width,height:footerH});scene.addChild(footer,1500);
            label('\u8fd4\u56de',55,size.height-32);
            var walletLabel=label('',size.width/2-60,size.height-32,18);
            label('\u590d\u4f4d',size.width-245,size.height-32);
            label('\uff0b',size.width-140,size.height-32,32);
            label('\uff0d',size.width-55,size.height-32,32);

            var status=label('\u70b9\u51fb\u5efa\u7b51\u67e5\u770b\u64cd\u4f5c\u9762\u677f',size.width/2,footerH-18,17);
            var infoLine=label('',size.width/2,footerH-42,15);
            infoLine.setColor({r:200,g:220,b:200});
            // Local action panel (original BuildActionBar needs full Unit/stage; cards load as chrome).
            var panelButtons=[];
            var mkBtn=function(title,x){
                var bg=cc.LayerColor.create({r:40,g:70,b:52,a:220});
                bg.setContentSize({width:110,height:44});
                bg.setPosition(x-55,12);scene.addChild(bg,1600);
                var t=label(title,x,34,16);t.setZOrder(1601);
                panelButtons.push({bg:bg,label:t,title:title,x:x,enabled:false,visible:false,id:title});
                bg.setVisible(false);t.setVisible(false);
                return panelButtons[panelButtons.length-1];
            };
            var btnMove=mkBtn('\u79fb\u52a8',size.width*0.10);
            var btnCollect=mkBtn('\u91c7\u96c6',size.width*0.28);
            var btnUpgrade=mkBtn('\u5347\u7ea7',size.width*0.46);
            var btnTrain=mkBtn('\u8bad\u7ec3',size.width*0.64);
            var btnBuild=mkBtn('\u5efa\u9020',size.width*0.82);
            var btnConfirm=mkBtn('\u786e\u8ba4',size.width*0.38);
            var btnCancel=mkBtn('\u53d6\u6d88',size.width*0.62);
            // Keep aliases used by existing helpers.
            var action=btnMove.label, collectLabel=btnCollect.label, upgradeLabel=btnUpgrade.label;
            var trainLabel=btnTrain.label, buildLabel=btnBuild.label;
            var selected=null,moving=false,confirmUid=null;
            var placingNew=false, pendingPlace=null;
            var marker=cc.LabelTTF.create('','Arial',22);map.addChild(marker,9999);
            var footprintLayer=cc.DrawNode.create();map.addChild(footprintLayer,5000);
            var setBtn=function(btn,visible,enabled,text){
                btn.visible=!!visible;btn.enabled=!!enabled;
                btn.bg.setVisible(!!visible);btn.label.setVisible(!!visible);
                if(text)btn.label.setString(text);
                btn.bg.setColor(enabled?{r:48,g:96,b:64}:{r:50,g:50,b:50});
                btn.label.setColor(enabled?{r:255,g:235,b:130}:{r:150,g:150,b:150});
            };
            var clearFootprint=function(){footprintLayer.clear();};
            var drawFootprint=function(tx,ty,sx,sy,ok){
                clearFootprint();
                var col=ok?COLOR_OK:COLOR_BAD;
                var fill={r:col.r/255,g:col.g/255,b:col.b/255,a:TILE_OPACITY/255};
                var border={r:col.r/255,g:col.g/255,b:col.b/255,a:0.9};
                for(var ix=0;ix<sx;ix++){
                    for(var iy=0;iy<sy;iy++){
                        var c=tileCenter(tx+ix,ty+iy);
                        var pts=[{x:c.x,y:c.y+HALF_H-1},{x:c.x+HALF_W-1,y:c.y},{x:c.x,y:c.y-HALF_H+1},{x:c.x-HALF_W+1,y:c.y}];
                        try{
                            if(footprintLayer.drawPolygon)footprintLayer.drawPolygon(pts,fill,1.5,border);
                            else if(footprintLayer.drawPoly)footprintLayer.drawPoly(pts,fill,1.5,border);
                            else{
                                for(var ei=0;ei<4;ei++)footprintLayer.drawSegment(pts[ei],pts[(ei+1)%4],2,border);
                            }
                        }catch(de){
                            for(var ej=0;ej<4;ej++)try{footprintLayer.drawSegment(pts[ej],pts[(ej+1)%4],2,border);}catch(e2){}
                        }
                    }
                }
            };
            var showSelectedFootprint=function(){
                if(!selected){clearFootprint();return;}
                var b=buildingOf(localState,selected.uid),fp=footprintOf(b.type);
                drawFootprint(b.tilex,b.tiley,fp.sx,fp.sy,true);
            };
            var hitBuilding=function(x,y){
                var logic=logicFromPos(x,y), best=null, bestD=1e15;
                for(var i=0;i<nodes.length;i++){
                    var n=nodes[i],b=buildingOf(localState,n.uid),fp=footprintOf(b.type);
                    var tx=b.tilex,ty=b.tiley;
                    var inside=logic.x>=tx-0.15 && logic.x<tx+fp.sx+0.15 && logic.y>=ty-0.15 && logic.y<ty+fp.sy+0.15;
                    // Also allow tapping the upper visual body above footprint center.
                    var dx=x-n.x, dy=y-(n.y+80*buildingScale(n.id)/0.5);
                    var visual=dx*dx+dy*dy < Math.pow(70+Math.max(fp.sx,fp.sy)*18,2);
                    if(inside || visual){
                        var d=dx*dx+dy*dy;
                        if(d<bestD){bestD=d;best=n;}
                    }
                }
                return best;
            };
            var hitPanelButton=function(p){
                if(p.y>footerH || p.y<0)return null;
                for(var i=0;i<panelButtons.length;i++){
                    var btn=panelButtons[i];
                    if(!btn.visible || !btn.enabled)continue;
                    if(Math.abs(p.x-btn.x)<58)return btn;
                }
                return null;
            };
            var producerAmount=function(item){
                var b=buildingOf(localState,item.uid);
                var saved=localState.production[item.uid];
                if(b.construct || !item.producer || !saved)return 0;
                if(b.upgrade)return saved.stored;
                item.producer.currentStorage=saved.stored;
                item.producer.lastCollectTime=saved.lastHour;
                return Math.max(0,Math.min(item.producer.maxStorage,item.producer.getStoredResourceNum()));
            };
            var showSelected=function(){
                walletLabel.setString('\u9f99\u5e01 '+localState.resources.gold+'/'+capacity.gold+'  \u65e5\u5149 '+localState.resources.wood+'/'+capacity.wood);
                var placingMode=placingNew || !!pendingPlace;
                if(placingMode){
                    setBtn(btnMove,false,false);setBtn(btnCollect,false,false);setBtn(btnUpgrade,false,false);
                    setBtn(btnTrain,false,false);
                    setBtn(btnBuild,placingNew,true,placingNew?'\u5207\u6362\u7c7b\u578b':'\u5efa\u9020');
                    setBtn(btnConfirm,!!pendingPlace,!!(pendingPlace&&pendingPlace.ok),'\u786e\u8ba4');
                    setBtn(btnCancel,true,true,'\u53d6\u6d88');
                    if(pendingPlace){
                        var fp=footprintOf(pendingPlace.type);
                        drawFootprint(pendingPlace.tx,pendingPlace.ty,fp.sx,fp.sy,pendingPlace.ok);
                        status.setString((pendingPlace.ok?'\u53ef\u653e\u7f6e':'\u4e0d\u53ef\u653e\u7f6e')+' \xb7 '+pendingPlace.label+' \xb7 \u5360\u5730 '+fp.sx+'\u00d7'+fp.sy);
                        infoLine.setString(pendingPlace.ok?'\u70b9\u786e\u8ba4\u4fdd\u5b58\uff0c\u53d6\u6d88\u4e0d\u6263\u8d39\u4e0d\u6539\u4f4d':'\u4e0e\u5176\u4ed6\u5efa\u7b51\u91cd\u53e0\u6216\u8d85\u51fa\u5730\u56fe\u8fb9\u754c');
                    }else if(placingNew){
                        clearFootprint();
                        var opt=constructOption(),builder=makeBuilder({type:opt.type});
                        status.setString('\u70b9\u5730\u56fe\u9009\u4f4d\u5efa\u9020'+opt.label+' \xb7 '+builder.getRealCost()+' '+constructResLabel(constructResKey(builder)));
                        infoLine.setString('\u518d\u70b9\u5efa\u9020\u53ef\u5207\u6362\u7c7b\u578b');
                    }
                    return;
                }
                setBtn(btnConfirm,false,false);setBtn(btnCancel,false,false);
                setBtn(btnBuild,true,!moving,'\u5efa\u9020');
                if(!selected){
                    setBtn(btnMove,false,false);setBtn(btnCollect,false,false);
                    setBtn(btnUpgrade,false,false);setBtn(btnTrain,false,false);
                    clearFootprint();marker.setString('');
                    status.setString('\u70b9\u51fb\u5efa\u7b51\u67e5\u770b\u64cd\u4f5c\u9762\u677f');
                    infoLine.setString('\u5360\u5730\u6309\u539f\u8868 tilesize\uff0c\u6bd4\u4f8b OBJ_LAYER_SCALE\u00d7scale_rate');
                    return;
                }
                var b=buildingOf(localState,selected.uid),cfg=data.unit_main[b.type],fp=footprintOf(b.type);
                var builder=makeBuilder(b);
                marker.setString(selected.name+' Lv.'+cfg.lv);marker.setPosition(selected.x,selected.y+220);
                showSelectedFootprint();
                var detail='\u5360\u5730 '+fp.sx+'\u00d7'+fp.sy;
                if(b.construct)detail=constructInfo(selected)+' \xb7 '+detail;
                else if(b.upgrade)detail='\u5347\u7ea7\u4e2d \xb7 \u5269\u4f59 '+Math.max(0,builder.getNeedTime())+' \u79d2 \xb7 '+detail;
                else if(confirmUid===b.uid){
                    var targetLv=data.unit_main[upgradeTypes[b.type]].lv;
                    detail='\u5347\u81f3'+targetLv+'\u7ea7\uff1a'+builder.getRealCost()+(builder.resType===RES_TYPE_GOLD?' \u9f99\u5e01':' \u65e5\u5149')+' \xb7 '+builder.buildTime+'\u79d2';
                }else if(selected.producer)detail='\u5f85\u91c7\u96c6 '+producerAmount(selected)+'/'+selected.producer.maxStorage+' \xb7 '+selected.producer.produceSpeed+'/\u5c0f\u65f6 \xb7 '+detail;
                else if(cfg.wood_storage||cfg.gold_storage)
                    detail='\u4ed3\u5e93 \u65e5\u5149 '+(cfg.wood_storage||0)+' / \u9f99\u5e01 '+(cfg.gold_storage||0)+' \xb7 '+detail;
                else if(String(b.type).indexOf('207')===0)
                    detail=((localState.training[b.uid]||soldiersOf(b.uid))?trainInfo(selected):('\u86cb '+(cfg.egg_storage||0)+' \xb7 \u5175 '+(cfg.item_storage||0)))+' \xb7 '+detail;
                else if(String(b.type).indexOf('206')===0){
                    var cityLv=data.unit_main[localState.buildings[0].type].lv;
                    var hn=data.hero_number[cityLv]||data.hero_number[String(cityLv)]||{};
                    detail='\u51fa\u6218 '+(hn.hero_attack_num||0)+' \xb7 \u7b49\u7ea7\u4e0a\u9650 '+(hn.hero_lv_max||0)+' \xb7 '+detail;
                }
                status.setString(selected.name+' Lv.'+cfg.lv);
                infoLine.setString(detail);
                var busy=!!(b.upgrade||b.construct);
                setBtn(btnMove,true,!busy && !moving, moving?'\u70b9\u5730\u56fe':'\u79fb\u52a8');
                setBtn(btnCollect,!!selected.producer, !!(selected.producer && !busy && !moving), '\u91c7\u96c6');
                setBtn(btnUpgrade,!!upgradeTypes[b.type], !!(upgradeTypes[b.type] && !busy && !moving),
                    confirmUid===b.uid?'\u786e\u8ba4\u5347\u7ea7':'\u5347\u7ea7');
                var isBarracks=String(b.type).indexOf('207')===0;
                setBtn(btnTrain,isBarracks, isBarracks && !busy && !moving && !localState.training[b.uid], '\u8bad\u7ec3');
            };
            var collect=function(){
                if(!selected || !selected.producer || moving){status.setString('\u8bf7\u9009\u62e9\u65e5\u5149\u4e95\u6216\u9f99\u94f6\u77ff');return;}
                confirmUid=null;
                var cb=buildingOf(localState,selected.uid);
                if(cb.upgrade || cb.construct){status.setString('\u5efa\u9020\u6216\u5347\u7ea7\u671f\u95f4\u6682\u505c\u751f\u4ea7\u548c\u91c7\u96c6');return;}
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
                node.setPosition(b.x,b.y);node.setScale(buildingScale(b.type));map.addChild(node,3000-b.y);
                if(node.animationManager && node.animationManager.getSequenceNames().indexOf('idle_run')>=0)node.animationManager.runAnimations('idle_run');
                item.node.removeFromParent();item.node=node;item.id=b.type;
                if((cfg.gold_produce || cfg.wood_produce) && !b.construct){
                    var master={stage:GS_STAGE_BUILD,getComponent:function(){return {isBuildingFinished:function(){return true;}};}};
                    item.producer=new Comp.ResourceProductor(master,cfg);
                    item.resource=cfg.gold_produce?'gold':'wood';
                }else{item.producer=null;}
            };
            var constructInfo=function(item){
                var b=buildingOf(localState,item.uid),builder=makeBuilder(b);
                return '\u5efa\u9020\u4e2d \xb7 \u5269\u4f59 '+Math.max(0,builder.getNeedTime())+' \u79d2';
            };
            var workerBusy=function(state){
                for(var wi=0;wi<state.buildings.length;wi++){
                    var wb=state.buildings[wi];
                    if(wb.upgrade || wb.construct)return true;
                }
                return false;
            };
            var spawnNode=function(saved){
                var cfg=data.unit_main[saved.type],oldLookup=getControllerByName;
                getControllerByName=function(name){var info=oldLookup(name);if(name==='Unit')info[0]=function(){};return info;};
                var node;
                try{node=cc.BuilderReader.load(cfg.home_res);}finally{getControllerByName=oldLookup;}
                node.setPosition(saved.x,saved.y);node.setScale(buildingScale(saved.type));map.addChild(node,3000-saved.y);
                if(node.animationManager && node.animationManager.getSequenceNames().indexOf('idle_run')>=0)
                    node.animationManager.runAnimations('idle_run');
                var item={id:saved.type,uid:saved.uid,x:saved.x,y:saved.y,node:node,name:G_StringManager.str(cfg.name)};
                if((cfg.gold_produce || cfg.wood_produce) && !saved.construct){
                    var master={stage:GS_STAGE_BUILD,getComponent:function(){return {isBuildingFinished:function(){return true;}};}};
                    item.producer=new Comp.ResourceProductor(master,cfg);
                    item.resource=cfg.gold_produce?'gold':'wood';
                }
                nodes.push(item);return item;
            };
            var beginPlace=function(pick){
                var opt=CONSTRUCT_OPTIONS[pick],builder=makeBuilder({type:opt.type});
                var cost=builder.getRealCost(),resource=constructResKey(builder);
                if(localState.resources[resource]<cost){status.setString('\u8d44\u6e90\u4e0d\u8db3\uff0c\u9700\u8981 '+cost+' '+constructResLabel(resource));return false;}
                constructPick=pick;placingNew=true;pendingPlace=null;selected=null;confirmUid=null;moving=false;
                showSelected();
                return true;
            };
            var build=function(){
                if(moving){status.setString('\u8bf7\u5148\u7ed3\u675f\u79fb\u52a8');return;}
                if(workerBusy(localState)){status.setString('\u5efa\u7b51\u5e08\u5fd9\u788c\uff0c\u8bf7\u7b49\u5f85\u5f53\u524d\u5efa\u9020\u6216\u5347\u7ea7\u5b8c\u6210');return;}
                if(placingNew){
                    var switched=nextConstructPick(localState,constructPick+1);
                    if(switched<0 || switched===constructPick){
                        placingNew=false;buildLabel.setString('\u5efa\u9020\u751f\u4ea7');showSelected();status.setString('\u5df2\u53d6\u6d88\u5efa\u9020');return;
                    }
                    beginPlace(switched);return;
                }
                var pick=nextConstructPick(localState,constructPick);
                if(pick<0){
                    var need=null,blocked=CONSTRUCT_OPTIONS[0],held0=familyCount(localState,blocked.family);
                    var bn0=data.build_number[blocked.family];
                    for(var lv=cityLevelOf(localState)+1;lv<=10;lv++)
                        if((bn0['lv'+lv+'_num']||0)>held0){need=lv;break;}
                    status.setString(need?('\u8bf7\u5148\u5c06\u9f99\u9996\u4e4b\u57ce\u5347\u81f3 '+need+' \u7ea7'):'\u751f\u4ea7\u5efa\u7b51\u5df2\u8fbe\u539f\u8868\u4e0a\u9650');
                    return;
                }
                beginPlace(pick);
            };
            var proposePlace=function(x,y,type,label,exceptUid,mode){
                var fp=footprintOf(type), corner=snapCorner(x,y,fp.sx,fp.sy);
                var ok=canPlaceAt(localState,type,corner.tx,corner.ty,exceptUid);
                pendingPlace={mode:mode,type:type,label:label,tx:corner.tx,ty:corner.ty,ok:ok,exceptUid:exceptUid||null};
                showSelected();
            };
            var commitPending=function(){
                if(!pendingPlace || !pendingPlace.ok){status.setString('\u5f53\u524d\u4f4d\u7f6e\u4e0d\u53ef\u653e\u7f6e');return;}
                if(pendingPlace.mode==='move'){
                    var next=JSON.parse(JSON.stringify(localState));
                    for(var bi=0;bi<next.buildings.length;bi++)if(next.buildings[bi].uid===selected.uid){
                        applyTileToBuilding(next.buildings[bi],pendingPlace.tx,pendingPlace.ty);
                    }
                    next.revision++;
                    try{persist(next);}catch(error){status.setString('\u4fdd\u5b58\u5931\u8d25\uff0c\u5efa\u7b51\u4fdd\u6301\u539f\u4f4d');cc.log('DinoLocal save failed: '+error);return;}
                    selected.x=buildingOf(localState,selected.uid).x;selected.y=buildingOf(localState,selected.uid).y;
                    selected.node.setPosition(selected.x,selected.y);selected.node.setZOrder(3000-selected.y);
                    pendingPlace=null;moving=false;refreshSoldierBadges();showSelected();
                    status.setString('\u4f4d\u7f6e\u5df2\u4fdd\u5b58');return;
                }
                if(pendingPlace.mode==='build'){
                    if(workerBusy(localState)){pendingPlace=null;placingNew=false;status.setString('\u5efa\u7b51\u5e08\u5fd9\u788c');showSelected();return;}
                    var opt=constructOption();
                    if(familyCount(localState,opt.family)>=maxFamily(localState,opt.family)){
                        pendingPlace=null;placingNew=false;status.setString('\u5df2\u8fbe\u53ef\u5efa\u4e0a\u9650');showSelected();return;
                    }
                    var builder=makeBuilder({type:opt.type}),cost=builder.getRealCost();
                    var resource=constructResKey(builder);
                    if(localState.resources[resource]<cost){pendingPlace=null;placingNew=false;status.setString('\u8d44\u6e90\u4e0d\u8db3');showSelected();return;}
                    var next2=JSON.parse(JSON.stringify(localState)),start=nowSec();
                    var uid=nextBuildingUid(next2);
                    var nb={uid:uid,type:opt.type,x:0,y:0,construct:{started:start,ends:start+builder.buildTime}};
                    applyTileToBuilding(nb,pendingPlace.tx,pendingPlace.ty);
                    next2.resources[resource]-=cost;next2.buildings.push(nb);next2.revision++;
                    try{persist(next2);}catch(e){status.setString('\u4fdd\u5b58\u5931\u8d25\uff0c\u5efa\u9020\u672a\u5f00\u59cb');cc.log('DinoLocal save failed: '+e);return;}
                    placingNew=false;pendingPlace=null;
                    selected=spawnNode(buildingOf(localState,uid));
                    showSelected();
                    status.setString('\u5df2\u5f00\u59cb\u5efa\u9020'+opt.label+' \xb7 \u6d88\u8017 '+cost+' '+constructResLabel(resource)+' \xb7 '+builder.buildTime+' \u79d2');
                }
            };
            var cancelPending=function(){
                pendingPlace=null;placingNew=false;moving=false;
                showSelected();status.setString('\u5df2\u53d6\u6d88');
            };
            var placeNew=function(x,y){
                var opt=constructOption();
                proposePlace(x,y,opt.type,opt.label,null,'build');
            };
            var soldiersOf=function(uid){return (localState.soldiers||{})[uid]||0;};
            var barracksItem=function(){
                if(!selected)return null;
                return String(buildingOf(localState,selected.uid).type).indexOf('207')===0?selected:null;
            };
            var trainInfo=function(item){
                var b=buildingOf(localState,item.uid),cfg=data.unit_main[b.type];
                var job=localState.training[item.uid];
                var held=soldiersOf(item.uid),cap=cfg.item_storage||0;
                if(job){
                    var left=Math.max(0,job.ends-nowSec());
                    return '\u8bad\u7ec3\u4e2d '+(data.unit_main[job.typeid]?data.unit_main[job.typeid].lv:0)+'\u7ea7\u5175 \xb7 \u5269\u4f59 '+Math.ceil(left)+' \u79d2 \xb7 \u5df2\u5165\u4f4f '+held+'/'+cap;
                }
                return '\u58eb\u5175 '+held+'/'+cap+' \xb7 \u86cb\u4f4d '+(job?1:0)+'/'+TRAIN_MAX_BUFFER;
            };
            var nextTrainType=function(){
                var lv=data.unit_main[buildingOf(localState,selected.uid).type].lv-1;
                return trainTypes[Math.min(trainTypes.length-1,Math.max(0,lv))];
            };
            var trainCost=function(typeid){return data.unit_main[typeid].train_cost;};
            var train=function(){
                var item=barracksItem();
                if(!item){status.setString('\u8bf7\u5148\u9009\u62e9\u9a6f\u9f99\u573a');return;}
                if(moving){status.setString('\u8bf7\u5148\u7ed3\u675f\u79fb\u52a8');return;}
                var b=buildingOf(localState,item.uid);
                if(b.upgrade || b.construct){status.setString('\u5efa\u9020\u6216\u5347\u7ea7\u671f\u95f4\u4e0d\u80fd\u8bad\u7ec3');return;}
                if(localState.training[item.uid]){status.setString('\u86cb\u4f4d\u5df2\u6ee1\uff0c\u8bf7\u7b49\u5f85\u5f53\u524d\u8bad\u7ec3\u5b8c\u6210');return;}
                var cfg=data.unit_main[b.type],held=soldiersOf(item.uid);
                if(held+1>(cfg.item_storage||0)){status.setString('\u58eb\u5175\u5df2\u6ee1\uff0c\u8bf7\u5148\u817e\u51fa\u4f4d\u7f6e');return;}
                var typeid=nextTrainType(),tc=data.unit_main[typeid],cost=trainCost(typeid);
                if(localState.resources.wood<cost){status.setString('\u8d44\u6e90\u4e0d\u8db3\uff0c\u9700\u8981 '+cost+' \u65e5\u5149');return;}
                var next=JSON.parse(JSON.stringify(localState)),start=nowSec();
                next.resources.wood-=cost;
                next.training[item.uid]={typeid:typeid,started:start,ends:start+tc.train_time};
                next.revision++;
                try{persist(next);}catch(e){status.setString('\u4fdd\u5b58\u5931\u8d25\uff0c\u8bad\u7ec3\u672a\u5f00\u59cb');cc.log('DinoLocal save failed: '+e);return;}
                showSelected();status.setString('\u5df2\u5f00\u59cb\u8bad\u7ec3 '+tc.lv+'\u7ea7\u5175 \xb7 \u6d88\u8017 '+cost+' \u65e5\u5149 \xb7 '+tc.train_time+' \u79d2');
            };
            var upgrade=function(){
                if(!selected || moving){status.setString('\u8bf7\u5148\u9009\u62e9\u5efa\u7b51\u5e76\u7ed3\u675f\u79fb\u52a8');return;}
                var b=buildingOf(localState,selected.uid);
                if(b.upgrade || b.construct){status.setString('\u5efa\u7b51\u6b63\u5728\u5efa\u9020\u6216\u5347\u7ea7');return;}
                if(!upgradeTypes[b.type]){confirmUid=null;status.setString('\u672c\u6b21\u5df2\u63a5\u6ee1\u539f\u8868\u53ef\u5347\u7ea7\u7b49\u7ea7\uff0c\u5efa\u7b51\u5e08\u5c0f\u5c4b\u4e0d\u53ef\u5347\u7ea7');return;}
                if(confirmUid!==b.uid){confirmUid=b.uid;showSelected();return;}
                confirmUid=null;
                var builder=makeBuilder(b),cfg=data.unit_main[b.type];
                if(data.unit_main[localState.buildings[0].type].lv<cfg.rely_base_lv){status.setString('\u8bf7\u5148\u5c06\u9f99\u9996\u4e4b\u57ce\u5347\u81f3 '+cfg.rely_base_lv+' \u7ea7');return;}
                if(workerBusy(localState)){status.setString('\u5efa\u7b51\u5e08\u5fd9\u788c\uff0c\u8bf7\u7b49\u5f85\u5f53\u524d\u5efa\u9020\u6216\u5347\u7ea7\u5b8c\u6210');return;}
                var resource=builder.resType===RES_TYPE_GOLD?'gold':'wood',cost=builder.getRealCost();
                if(localState.resources[resource]<cost){status.setString('\u8d44\u6e90\u4e0d\u8db3\uff0c\u9700\u8981 '+cost+(resource==='gold'?' \u9f99\u5e01':' \u65e5\u5149'));return;}
                var next=JSON.parse(JSON.stringify(localState)),nb=buildingOf(next,b.uid),start=nowSec();
                if(selected.producer)next.production[b.uid]={stored:producerAmount(selected),lastHour:start/3600};
                next.resources[resource]-=cost;nb.upgrade={target:upgradeTypes[b.type],started:start,ends:start+builder.buildTime};next.revision++;
                try{persist(next);}catch(e){status.setString('\u4fdd\u5b58\u5931\u8d25\uff0c\u5347\u7ea7\u672a\u5b8c\u6210');cc.log('DinoLocal save failed: '+e);return;}
                showSelected();
            };
            var refreshSoldierBadges=function(){
                for(var i=0;i<nodes.length;i++){
                    var n=nodes[i];
                    if(String(buildingOf(localState,n.uid).type).indexOf('207')!==0){
                        if(n.badge){n.badge.removeFromParent();n.badge=null;}
                        continue;
                    }
                    if(!n.badge){n.badge=cc.LabelTTF.create('','Arial',22);map.addChild(n.badge,10000);}
                    var cfg=data.unit_main[buildingOf(localState,n.uid).type];
                    var txt=soldiersOf(n.uid)+'/'+(cfg.item_storage||0);
                    if(localState.training[n.uid])txt+=' \u23f3';
                    n.badge.setString(txt);n.badge.setPosition(n.x,n.y+140);
                }
            };
            showSelected();
            // Refresh only the read-only display. Timestamps are saved on collection.
            var displayTicks=0;
            scene.schedule(function(){
                try{
                    var res=settle(),changed=res.buildings;
                    for(var i=0;i<nodes.length;i++)if(changed.indexOf(nodes[i].uid)>=0)refreshItem(nodes[i]);
                    if(changed.length)refreshSoldierBadges();
                    if(res.construct && res.construct.length){
                        var doneB=buildingOf(localState,res.construct[0]);
                        var doneName=G_StringManager.str(data.unit_main[doneB.type].name);
                        status.setString('\u5efa\u9020\u5b8c\u6210\uff1a'+doneName+'\u5df2\u6295\u4ea7');
                    }
                    if(res.training.length){
                        refreshSoldierBadges();
                        status.setString('\u8bad\u7ec3\u5b8c\u6210\uff1a\u5df2\u5165\u4f4f 1 \u540d\u58eb\u5175');
                    }
                    if(changed.length || (res.construct&&res.construct.length) || res.training.length || (++displayTicks%2===0 && selected && !moving && !placingNew && !pendingPlace))showSelected();
                }catch(e){status.setString('\u5347\u7ea7\u66f4\u65b0\u5931\u8d25\uff0c\u8bf7\u8fd4\u56de\u91cd\u8fdb');cc.log('DinoLocal update failed: '+e);}
            },1);
            var place=function(x,y){
                proposePlace(x,y,selected.id,selected.name,selected.uid,'move');
            };
            var clamp=function(){
                var z=map.getScale(),p=map.getPosition();
                p.x=Math.max(size.width-3832*z,Math.min(0,p.x));
                p.y=Math.max(size.height-2812*z,Math.min(0,p.y));
                map.setPosition(p.x,p.y);
            };
            var reset=function(){map.setScale(.58);map.setPosition(size.width/2-3832*.58/2,size.height/2-2812*.58/2-40);};
            var zoom=function(d){
                var p=map.getPosition(),old=map.getScale(),z=Math.max(.35,Math.min(1.0,old+d));
                var x=(size.width/2-p.x)/old,y=(size.height/2-p.y)/old;
                map.setScale(z);map.setPosition(size.width/2-x*z,size.height/2-y*z);clamp();
            };
            reset();
            var touch=new UI.Touchable();touch.rootNode=scene;
            touch.onTouchesBegan=function(t){if(!t.length)return;this.first=t[0].getLocation();this.last=this.first;this.moved=false;};
            touch.onTouchesMoved=function(t){
                if(!t.length || !this.last || this.first.y>size.height-64 || this.first.y<footerH)return;
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

                if(p.y<footerH){
                    var hit=hitPanelButton(p);
                    if(!hit)return;
                    if(hit===btnCancel){cancelPending();return;}
                    if(hit===btnConfirm){commitPending();return;}
                    if(hit===btnBuild){build();return;}
                    if(hit===btnTrain){train();return;}
                    if(hit===btnUpgrade){upgrade();return;}
                    if(hit===btnCollect){collect();return;}
                    if(hit===btnMove){
                        confirmUid=null;
                        if(selected && (buildingOf(localState,selected.uid).upgrade || buildingOf(localState,selected.uid).construct)){
                            status.setString('\u5efa\u9020\u6216\u5347\u7ea7\u671f\u95f4\u4e0d\u80fd\u79fb\u52a8\u5efa\u7b51');return;
                        }
                        if(selected){moving=!moving;pendingPlace=null;showSelected();}
                        else status.setString('\u8bf7\u5148\u70b9\u51fb\u4e00\u5ea7\u5efa\u7b51');
                    }
                    return;
                }
                var mp=map.getPosition(),z=map.getScale(),x=(p.x-mp.x)/z,y=(p.y-mp.y)/z;
                if(placingNew || (moving && selected)){
                    if(placingNew)placeNew(x,y); else place(x,y);
                    return;
                }
                var best=hitBuilding(x,y);
                if(best){selected=best;confirmUid=null;pendingPlace=null;moving=false;showSelected();}
            };
            touch.onTouchesCancelled=function(){this.last=null;};
            touch.initEventWithMultiTouch();
            if(!touch.__touch_layer.getParent())scene.addChild(touch.__touch_layer,1000);
            touch.enableTouchEvent();
            refreshSoldierBadges();
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
        var caption = cc.LabelTTF.create("\u672c\u5730\u4e3b\u57ce\u754c\u9762\u6d4b\u8bd5 \u00b7 \u70b9\u51fb\u8fdb\u5165\u6e38\u620f", "Arial", 18);
        caption.setPosition(size.width / 2, 24);
        menu.rootNode.addChild(caption, 99999);
        G_Director.setAnimationInterval(1 / 30);
        G_Director.resume();
        G_Director.startAnimation();
        cc.log("DinoLocal: local entry scene ready");
        return JSON.stringify({status:"local-cityui-ready", patch:PATCH_ENABLED, mode:__PLAY_MODE});
    } catch (error) {
        return JSON.stringify({status:"failed", message:String(error), stack:error.stack});
    }
})();
