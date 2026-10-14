from pathlib import Path
work=Path(__file__).resolve().parent
s=(work/'state_boot.js').read_text()
s=s.replace("var saveKey = 'dino.local.city.v1';", "var saveKey = 'dino.local.city.v2';\n        DA.SynServerTime(Date.now()/1000);")
s=s.replace('value.version !== 1','value.version !== 2')
s=s.replace('            return value;', '''            if (!value.resources || !value.production) throw Error('Missing economy state');
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
            return value;''',1)
start=s.index('        if (raw) localState')
end=s.index('        var persist =',start)
s=s[:start]+'''        if(raw) localState=validate(JSON.parse(raw));
        else {
            var oldRaw=sys.localStorage.getItem('dino.local.city.v1');
            if(oldRaw){
                localState=JSON.parse(oldRaw);
                if(localState.version!==1)throw Error('Invalid legacy save');
            } else {
                localState={playerId:'local-001',revision:0,buildings:[]};
                for(var di=0;di<defaults.length;di++) localState.buildings.push({
                    uid:'building-'+di,type:defaults[di][0],x:defaults[di][1],y:defaults[di][2]
                });
            }
            localState.version=2;localState.resources={gold:0,wood:0};localState.production={};
            for(var pi=0;pi<localState.buildings.length;pi++){
                var b=localState.buildings[pi],cfg=data.unit_main[b.type];
                if(cfg && (cfg.gold_produce || cfg.wood_produce))localState.production[b.uid]={stored:0,lastHour:DA.getSystemCurrentTimeHour()};
            }
        }
        var capacity={gold:0,wood:0};
        for(var ci=0;ci<localState.buildings.length;ci++){
            var cfg=data.unit_main[localState.buildings[ci].type];
            if(cfg){capacity.gold+=cfg.gold_storage||0;capacity.wood+=cfg.wood_storage||0;}
        }
        var syncWallet=function(){
            if(!G_Player)return;
            var r=G_Player.getComponent('ResourceManager');
            r.Res[RES_TYPE_GOLD]=localState.resources.gold;r.Res[RES_TYPE_WOOD]=localState.resources.wood;
            r.maxRes[RES_TYPE_GOLD]=capacity.gold;r.maxRes[RES_TYPE_WOOD]=capacity.wood;
        };
'''+s[end:]
s=s.replace('            localState=next;','            localState=next;syncWallet();')
s=s.replace('            var tasks = [];','            syncWallet();\n            var tasks = [];')
s=s.replace('nodes.push({id:spec[0], uid:spec[3], x:spec[1], y:spec[2], node:node, name:G_StringManager.str(cfg.name)});', '''var item={id:spec[0],uid:spec[3],x:spec[1],y:spec[2],node:node,name:G_StringManager.str(cfg.name)};
                        if(cfg.gold_produce || cfg.wood_produce){
                            var master={stage:GS_STAGE_BUILD,getComponent:function(name){
                                return name==='BuildingBuilder'?{isBuildingFinished:function(){return true;}}:null;
                            }};
                            item.producer=new Comp.ResourceProductor(master,cfg);
                            item.resource=cfg.gold_produce?'gold':'wood';
                        }
                        nodes.push(item);''')
s=s.replace("label('\\u672c\\u5730\\u5efa\\u7b51\\u79fb\\u52a8',size.width/2-50,size.height-32,23);", "var walletLabel=label('',size.width/2-60,size.height-32,18);")
s=s.replace("size.width/2,23,22", "size.width/2-150,23,22",1)
start=s.index('            var selected=null,moving=false;')
end=s.index('            var place=function',start)
s=s[:start]+r'''
            var collectLabel=label('\u91c7\u96c6\u8d44\u6e90',size.width/2+150,23,22);
            var selected=null,moving=false;
            var marker=cc.LabelTTF.create('','Arial',26);map.addChild(marker,9999);
            var producerAmount=function(item){
                var saved=localState.production[item.uid];
                item.producer.currentStorage=saved.stored;
                item.producer.lastCollectTime=saved.lastHour;
                return Math.max(0,Math.min(item.producer.maxStorage,item.producer.getStoredResourceNum()));
            };
            var showSelected=function(){
                walletLabel.setString('\u9f99\u5e01 '+localState.resources.gold+'/'+capacity.gold+'  \u65e5\u5149 '+localState.resources.wood+'/'+capacity.wood);
                if(!selected)return;
                marker.setString('['+selected.name+']');marker.setPosition(selected.x,selected.y+400);
                var info=moving?'\u70b9\u51fb\u5730\u56fe\u7a7a\u4f4d\u653e\u7f6e':'\u4f4d\u7f6e\u5df2\u4fdd\u5b58';
                if(selected.producer && !moving)info='\u5f85\u91c7\u96c6 '+producerAmount(selected)+'/'+selected.producer.maxStorage+' \u00b7 '+selected.producer.produceSpeed+'/\u5c0f\u65f6';
                status.setString(selected.name+' \u00b7 '+info);
                action.setString(moving?'\u53d6\u6d88\u79fb\u52a8':'\u79fb\u52a8\u5efa\u7b51');
                collectLabel.setColor(selected.producer && !moving?{r:255,g:235,b:130}:{r:150,g:150,b:150});
            };
            var collect=function(){
                if(!selected || !selected.producer || moving){status.setString('\u8bf7\u9009\u62e9\u65e5\u5149\u4e95\u6216\u9f99\u94f6\u77ff');return;}
                var stored=producerAmount(selected);
                if(!stored){status.setString('\u8d44\u6e90\u751f\u4ea7\u4e2d\uff0c\u6bcf 18 \u79d2\u4ea7\u51fa 1 \u70b9');return;}
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
            showSelected();
            // Refresh only the read-only display. Timestamps are saved on collection.
            var displayTicks=0;
            scene.schedule(function(){if(++displayTicks%5===0 && selected && selected.producer && !moving)showSelected();},1);
'''+s[end:]
s=s.replace('                    if(selected){moving=!moving;showSelected();}', '                    if(p.x>size.width/2){collect();return;}\n                    if(selected){moving=!moving;showSelected();}')
s=s.replace('local-state-ready','local-economy-ready')
s=s.replace('\\u672c\\u5730\\u573a\\u666f\\u9884\\u89c8\\u6d4b\\u8bd5', '\\u672c\\u5730\\u751f\\u4ea7\\u91c7\\u96c6\\u6d4b\\u8bd5')
s=s.replace('\\u70b9\\u51fb\\u5efa\\u7b51\\u540e\\u9009\\u62e9\\u79fb\\u52a8', '\\u9009\\u62e9\\u65e5\\u5149\\u4e95\\u6216\\u9f99\\u94f6\\u77ff\\u53ef\\u91c7\\u96c6\\u8d44\\u6e90')
(work/'economy_boot.js').write_text(s,encoding='ascii')
b=(work/'build_state.py').read_text().replace('dino-local-state.apk','dino-local-economy.apk').replace("'state_boot.js'","'economy_boot.js'")
(work/'build_economy.py').write_text(b)
