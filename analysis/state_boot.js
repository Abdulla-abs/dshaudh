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

        var saveKey = 'dino.local.city.v1';
        var defaults = [
            ['20101',1900,1400],['20201',1500,1150],['20301',2400,1300],
            ['20401',2300,950],['20501',1750,800],['20601',1300,1600],
            ['20701',2500,1750],['21201',1800,1900]
        ];
        var validate = function(value) {
            if (!value || value.version !== 1 || value.playerId !== 'local-001' ||
                !value.buildings || value.buildings.length !== defaults.length) throw Error('Invalid local save');
            for (var i=0;i<defaults.length;i++) {
                var b=value.buildings[i];
                if (!b || b.uid !== 'building-'+i || b.type !== defaults[i][0] ||
                    typeof b.x !== 'number' || typeof b.y !== 'number' ||
                    !isFinite(b.x) || !isFinite(b.y) || b.x<250 || b.x>3582 || b.y<250 || b.y>2562)
                    throw Error('Invalid local building '+i);
            }
            return value;
        };
        var raw = sys.localStorage.getItem(saveKey);
        var localState;
        if (raw) localState = validate(JSON.parse(raw));
        else {
            localState = {version:1, playerId:'local-001', revision:0, buildings:[]};
            for (var di=0;di<defaults.length;di++) localState.buildings.push({
                uid:'building-'+di,type:defaults[di][0],x:defaults[di][1],y:defaults[di][2]
            });
        }
        var persist = function(next) {
            validate(next);
            var encoded=JSON.stringify(next);
            sys.localStorage.setItem(saveKey,encoded);
            if(sys.localStorage.getItem(saveKey)!==encoded) throw Error('Save readback failed');
            localState=next;
            cc.log('DinoLocal save revision '+next.revision);
        };
        if (!raw) persist(localState);
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
                        nodes.push({id:spec[0], uid:spec[3], x:spec[1], y:spec[2], node:node, name:G_StringManager.str(cfg.name)});
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
            label('\u672c\u5730\u5efa\u7b51\u79fb\u52a8',size.width/2-50,size.height-32,23);
            label('\u590d\u4f4d',size.width-245,size.height-32);
            label('\uff0b',size.width-140,size.height-32,32);
            label('\uff0d',size.width-55,size.height-32,32);

            var status=label('\u70b9\u51fb\u5efa\u7b51\u540e\u9009\u62e9\u79fb\u52a8',size.width/2,59,19);
            var action=label('\u79fb\u52a8\u5efa\u7b51',size.width/2,23,22);
            var selected=null,moving=false;
            var marker=cc.LabelTTF.create('','Arial',26);map.addChild(marker,9999);
            var showSelected=function(){
                if(!selected)return;
                marker.setString('['+selected.name+']');
                marker.setPosition(selected.x,selected.y+400);
                status.setString(selected.name+' \u00b7 '+(moving?'\u70b9\u51fb\u5730\u56fe\u7a7a\u4f4d\u653e\u7f6e':'\u4f4d\u7f6e\u5df2\u4fdd\u5b58'));
                action.setString(moving?'\u53d6\u6d88\u79fb\u52a8':'\u79fb\u52a8\u5efa\u7b51');
            };
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
                if(best){selected=best;showSelected();}
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
        var caption = cc.LabelTTF.create("\u672c\u5730\u573a\u666f\u9884\u89c8\u6d4b\u8bd5 \u00b7 \u70b9\u51fb\u8fdb\u5165\u6e38\u620f", "Arial", 18);
        caption.setPosition(size.width / 2, 24);
        menu.rootNode.addChild(caption, 99999);
        G_Director.setAnimationInterval(1 / 30);
        G_Director.resume();
        G_Director.startAnimation();
        cc.log("DinoLocal: local entry scene ready");
        return JSON.stringify({status:"local-state-ready", patch:PATCH_ENABLED, mode:__PLAY_MODE});
    } catch (error) {
        return JSON.stringify({status:"failed", message:String(error), stack:error.stack});
    }
})();
