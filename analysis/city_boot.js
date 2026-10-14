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

        var openLocalPreview = function() {
            var scene = cc.Scene.create();
            var map = cc.BuilderReader.load('map/ccb/sub_map_build.ccbi');
            scene.addChild(map);
            var size = G_Director.getWinSize();
            var controllerLookup = getControllerByName;
            getControllerByName = function(name) {
                var info = controllerLookup(name);
                if (name === 'Unit') info[0] = function() {};
                return info;
            };
            var specs = [
                ['20101',1900,1400],['20201',1500,1150],['20301',2400,1300],
                ['20401',2300,950],['20501',1750,800],['20601',1300,1600],
                ['20701',2500,1750],['21201',1800,1900]
            ];
            var nodes = [];
            try {
                for(var i=0;i<specs.length;i++) {
                    var s=specs[i], cfg=data.unit_main[s[0]];
                    var node=cc.BuilderReader.load(cfg.home_res);
                    node.setPosition(s[1],s[2]); node.setScale(1.5);
                    map.addChild(node,3000-s[2]);
                    if(node.animationManager) {
                        var names=node.animationManager.getSequenceNames();
                        if(names.indexOf('idle_run')>=0) node.animationManager.runAnimations('idle_run');
                    }
                    nodes.push({id:s[0],x:s[1],y:s[2]});
                }
            } finally {getControllerByName=controllerLookup;}
            var label=function(text,x,y,font) {
                var n=cc.LabelTTF.create(text,'Arial',font||22);
                n.setPosition(x,y); scene.addChild(n,2000); return n;
            };
            var bar=cc.LayerColor.create({r:22,g:39,b:29,a:225});
            bar.setContentSize({width:size.width,height:64});bar.setPosition(0,size.height-64);scene.addChild(bar,1500);
            var footer=cc.LayerColor.create({r:22,g:39,b:29,a:225});
            footer.setContentSize({width:size.width,height:46});scene.addChild(footer,1500);
            label('\u8fd4\u56de',55,size.height-32);
            label('\u539f\u7248\u573a\u666f\u9884\u89c8 \u00b7 \u672c\u5730\u6d4b\u8bd5',size.width/2-50,size.height-32,23);
            label('\u590d\u4f4d',size.width-245,size.height-32);
            label('\uff0b',size.width-140,size.height-32,32);
            label('\uff0d',size.width-55,size.height-32,32);
            var status=label('\u62d6\u52a8\u67e5\u770b\u5730\u56fe \u00b7 \u70b9\u51fb\u5efa\u7b51\u67e5\u770b\u7f16\u53f7 \u00b7 \u5efa\u9020\u3001\u91c7\u96c6\u548c\u6218\u6597\u5c1a\u672a\u6062\u590d',size.width/2,23,19);
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
                if(!t.length || !this.last || this.first.y>size.height-64 || this.first.y<46)return;
                var p=t[0].getLocation(),mp=map.getPosition();
                map.setPosition(mp.x+p.x-this.last.x,mp.y+p.y-this.last.y);clamp();
                if(Math.abs(p.x-this.first.x)+Math.abs(p.y-this.first.y)>8)this.moved=true;
                this.last=p;
            };
            touch.onTouchesEnded=function(t){
                if(!this.first || this.moved)return;
                var p=this.first;
                if(p.y>size.height-64){
                    if(p.x<110){touch.destroy();G_Director.popScene();}
                    else if(p.x>size.width-100)zoom(-.07);
                    else if(p.x>size.width-190)zoom(.07);
                    else if(p.x>size.width-300)reset();
                    return;
                }
                var mp=map.getPosition(),z=map.getScale(),x=(p.x-mp.x)/z,y=(p.y-mp.y)/z;
                var best=null,dist=190*190;
                for(var i=0;i<nodes.length;i++){
                    var n=nodes[i],dx=x-n.x,dy=y-(n.y+90),d=dx*dx+dy*dy;
                    if(d<dist){dist=d;best=n;}
                }
                if(best)status.setString('\u5efa\u7b51 '+best.id+' \u00b7 \u539f\u7248\u6a21\u578b\u5c55\u793a\uff0c\u529f\u80fd\u5c1a\u672a\u63a5\u5165');
            };
            touch.onTouchesCancelled=function(){this.last=null;};
            touch.initEventWithMultiTouch();
            if(!touch.__touch_layer.getParent())scene.addChild(touch.__touch_layer,1000);
            touch.enableTouchEvent();
            touch.backClicked=function(){touch.destroy();G_Director.popScene();};
            touch.menuClicked=function(){};touch.initKeypadEvent();touch.enableKeypadEvent();
            G_Director.pushScene(scene);
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
        return JSON.stringify({status:"local-preview-ready", patch:PATCH_ENABLED, mode:__PLAY_MODE});
    } catch (error) {
        return JSON.stringify({status:"failed", message:String(error), stack:error.stack});
    }
})();
