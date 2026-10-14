from pathlib import Path

work = Path(__file__).resolve().parent
s = (work / 'loading_boot.js').read_text(encoding='utf-8')
s = s.replace('        var entering = false;', r'''
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
        var entering = false;''')
start=s.index('            var specs = [')
end=s.index('            var nodes = [];',start)
s=s[:start]+'''            var specs = [];
            for(var si=0;si<localState.buildings.length;si++) {
                var saved=localState.buildings[si];
                specs.push([saved.type,saved.x,saved.y,saved.uid]);
            }
'''+s[end:]
s=s.replace('nodes.push({id:spec[0], x:spec[1], y:spec[2]});','nodes.push({id:spec[0], uid:spec[3], x:spec[1], y:spec[2], node:node, name:G_StringManager.str(cfg.name)});')
s=s.replace("height:46", "height:86")
s=s.replace("label('\\u539f\\u7248\\u573a\\u666f\\u9884\\u89c8 \\u00b7 \\u672c\\u5730\\u6d4b\\u8bd5',size.width/2-50,size.height-32,23);", "label('\\u672c\\u5730\\u5efa\\u7b51\\u79fb\\u52a8',size.width/2-50,size.height-32,23);")
start=s.index('            var status=label(')
end=s.index('            var clamp=',start)
s=s[:start]+r'''
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
'''+s[end:]
s=s.replace('this.first.y<46','this.first.y<86')
s=s.replace('                var mp=map.getPosition(),z=map.getScale(),x=(p.x-mp.x)/z,y=(p.y-mp.y)/z;',r'''
                if(p.y<86){
                    if(selected){moving=!moving;showSelected();}
                    else status.setString('\u8bf7\u5148\u70b9\u51fb\u4e00\u5ea7\u5efa\u7b51');
                    return;
                }
                var mp=map.getPosition(),z=map.getScale(),x=(p.x-mp.x)/z,y=(p.y-mp.y)/z;
                if(moving && selected){place(x,y);return;}''')
start=s.index('                if(best)status.setString(')
end=s.index('\n',start)
s=s[:start]+"                if(best){selected=best;showSelected();}"+s[end:]
s=s.replace('local-loading-ready','local-state-ready')
(work/'state_boot.js').write_text(s,encoding='ascii')
b=(work/'build_loading.py').read_text().replace('dino-local-loading.apk','dino-local-state.apk').replace("'loading_boot.js'","'state_boot.js'")
(work/'build_state.py').write_text(b)
