# -*- coding: utf-8 -*-
"""Generate city-UI / footprint variant from mine_boot.js.

Restores original scale (OBJ_LAYER_SCALE * scale_rate), isometric footprint
collision from unit_main.tilesize_x/y, placement preview, and a local building
action panel. Save key bumps to dino.local.city.v12 with migration from v11.
Does not enable full native GameControllerBuild / BuildActionBar controllers.
"""
from pathlib import Path

W = Path(__file__).resolve().parent
s = (W / 'mine_boot.js').read_text(encoding='utf-8')


def replace(a, b, count=1):
    global s
    n = s.count(a)
    assert n >= 1, repr(a[:160])
    if count == 1:
        assert n >= 1
        s = s.replace(a, b, 1)
    else:
        s = s.replace(a, b)


# ---------------------------------------------------------------- save v12
replace("var saveKey = 'dino.local.city.v11';", "var saveKey = 'dino.local.city.v12';")
replace("value.version !== 11", "value.version !== 12")
replace(
    "var oldRaw=sys.localStorage.getItem('dino.local.city.v10') || "
    "sys.localStorage.getItem('dino.local.city.v9') || ",
    "var oldRaw=sys.localStorage.getItem('dino.local.city.v11') || "
    "sys.localStorage.getItem('dino.local.city.v10') || "
    "sys.localStorage.getItem('dino.local.city.v9') || ",
)
replace(
    "if(localState.version!==1 && localState.version!==2 && localState.version!==3 && "
    "localState.version!==4 && localState.version!==5 && localState.version!==6 && "
    "localState.version!==7 && localState.version!==8 && localState.version!==9 && "
    "localState.version!==10)throw Error('Invalid legacy save');",
    "if(localState.version!==1 && localState.version!==2 && localState.version!==3 && "
    "localState.version!==4 && localState.version!==5 && localState.version!==6 && "
    "localState.version!==7 && localState.version!==8 && localState.version!==9 && "
    "localState.version!==10 && localState.version!==11)throw Error('Invalid legacy save');",
)
replace("localState.version=11;", "localState.version=12;")

# ---------------------------------------------- grid helpers after defaults
GRID_HELPERS = r'''
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
'''

replace(
    "        var defaults = [\n"
    "            ['20101',1900,1400],['20201',1500,1150],['20301',2400,1300],\n"
    "            ['20401',2300,950],['20501',1750,800],['20601',1300,1600],\n"
    "            ['20701',2500,1750],['21201',1800,1900]\n"
    "        ];\n",
    "        // Default layout as tile corners (min x/y of footprint) inside MAP_SIZE_BUILD.\n"
    "        var defaults = [\n"
    "            ['20101',28,28],['20201',22,24],['20301',34,24],\n"
    "            ['20401',34,18],['20501',22,18],['20601',18,30],\n"
    "            ['20701',36,32],['21201',26,36]\n"
    "        ];\n"
    + GRID_HELPERS,
)

# validate: require tilex/tiley OR migrate path; relax pixel bounds to tile-derived
replace(
    "                if (!b || b.uid !== 'building-'+i || !allowedTypes(defaults[i][0])[b.type] ||\n"
    "                    typeof b.x !== 'number' || typeof b.y !== 'number' ||\n"
    "                    !isFinite(b.x) || !isFinite(b.y) || b.x<250 || b.x>3582 || b.y<250 || b.y>2562)\n"
    "                    throw Error('Invalid local building '+i);\n",
    "                if (!b || b.uid !== 'building-'+i || !allowedTypes(defaults[i][0])[b.type] ||\n"
    "                    typeof b.x !== 'number' || typeof b.y !== 'number' ||\n"
    "                    !isFinite(b.x) || !isFinite(b.y) ||\n"
    "                    typeof b.tilex !== 'number' || typeof b.tiley !== 'number' ||\n"
    "                    !isFinite(b.tilex) || !isFinite(b.tiley) ||\n"
    "                    !inBuildRange(b.tilex,b.tiley,footprintOf(b.type).sx,footprintOf(b.type).sy))\n"
    "                    throw Error('Invalid local building '+i);\n",
)
replace(
    "                if (!eb || typeof eb.uid!=='string' || !/^building-\\d+$/.test(eb.uid) ||\n"
    "                    seenUid[eb.uid] || !extraAllowed(eb.type) ||\n"
    "                    typeof eb.x !== 'number' || typeof eb.y !== 'number' ||\n"
    "                    !isFinite(eb.x) || !isFinite(eb.y) || eb.x<250 || eb.x>3582 || eb.y<250 || eb.y>2562)\n"
    "                    throw Error('Invalid extra building '+ei);\n",
    "                if (!eb || typeof eb.uid!=='string' || !/^building-\\d+$/.test(eb.uid) ||\n"
    "                    seenUid[eb.uid] || !extraAllowed(eb.type) ||\n"
    "                    typeof eb.x !== 'number' || typeof eb.y !== 'number' ||\n"
    "                    !isFinite(eb.x) || !isFinite(eb.y) ||\n"
    "                    typeof eb.tilex !== 'number' || typeof eb.tiley !== 'number' ||\n"
    "                    !isFinite(eb.tilex) || !isFinite(eb.tiley) ||\n"
    "                    !inBuildRange(eb.tilex,eb.tiley,footprintOf(eb.type).sx,footprintOf(eb.type).sy))\n"
    "                    throw Error('Invalid extra building '+ei);\n",
)

# After family count checks in validate, add overlap check
replace(
    "            for(var fi2=0;fi2<CONSTRUCT_OPTIONS.length;fi2++){\n"
    "                var fam=CONSTRUCT_OPTIONS[fi2].family;\n"
    "                if(familyCount(value,fam)>maxFamily(value,fam))\n"
    "                    throw Error('Too many family '+fam);\n"
    "            }\n",
    "            for(var fi2=0;fi2<CONSTRUCT_OPTIONS.length;fi2++){\n"
    "                var fam=CONSTRUCT_OPTIONS[fi2].family;\n"
    "                if(familyCount(value,fam)>maxFamily(value,fam))\n"
    "                    throw Error('Too many family '+fam);\n"
    "            }\n"
    "            for(var oi=0;oi<value.buildings.length;oi++){\n"
    "                var ob=value.buildings[oi],ofp=footprintOf(ob.type);\n"
    "                if(occupiedByOthers(value,ob.tilex,ob.tiley,ofp.sx,ofp.sy,ob.uid))\n"
    "                    throw Error('Overlapping footprint '+ob.uid);\n"
    "            }\n",
)

# Fresh defaults use tile corners
replace(
    "                for(var di=0;di<defaults.length;di++) localState.buildings.push({\n"
    "                    uid:'building-'+di,type:defaults[di][0],x:defaults[di][1],y:defaults[di][2]\n"
    "                });\n",
    "                for(var di=0;di<defaults.length;di++){\n"
    "                    var db={uid:'building-'+di,type:defaults[di][0],x:0,y:0};\n"
    "                    applyTileToBuilding(db,defaults[di][1],defaults[di][2]);\n"
    "                    localState.buildings.push(db);\n"
    "                }\n",
)

# Migration: after version=12 assignment, snap all buildings to grid
replace(
    "            localState.version=12;localState.resources=localState.resources||{gold:0,wood:0};localState.production=localState.production||{};localState.training=localState.training||{};\n"
    "            for(var pi=0;pi<localState.buildings.length;pi++){\n"
    "                var b=localState.buildings[pi],cfg=data.unit_main[b.type];\n"
    "                if(cfg && (cfg.gold_produce || cfg.wood_produce) && !localState.production[b.uid])localState.production[b.uid]={stored:0,lastHour:DA.getSystemCurrentTimeHour()};\n"
    "            }\n",
    "            localState.version=12;localState.resources=localState.resources||{gold:0,wood:0};localState.production=localState.production||{};localState.training=localState.training||{};\n"
    "            localState.migrationNotes=localState.migrationNotes||[];\n"
    "            for(var pi=0;pi<localState.buildings.length;pi++){\n"
    "                var b=localState.buildings[pi],cfg=data.unit_main[b.type];\n"
    "                if(cfg && (cfg.gold_produce || cfg.wood_produce) && !localState.production[b.uid])localState.production[b.uid]={stored:0,lastHour:DA.getSystemCurrentTimeHour()};\n"
    "            }\n"
    "            // Snap legacy pixel positions onto isometric tiles; record adjustments.\n"
    "            for(var mi=0;mi<localState.buildings.length;mi++){\n"
    "                var mb=localState.buildings[mi], beforeX=mb.x, beforeY=mb.y;\n"
    "                var adj=migrateBuildingToGrid(mb,localState,true);\n"
    "                if(adj.moved || mb.x!==beforeX || mb.y!==beforeY)\n"
    "                    localState.migrationNotes.push({uid:mb.uid,from:[beforeX,beforeY],to:[mb.x,mb.y],tile:[mb.tilex,mb.tiley]});\n"
    "            }\n"
    "            if(localState.migrationNotes.length)\n"
    "                cc.log('DinoLocal grid migrate '+JSON.stringify(localState.migrationNotes));\n",
)

# Also migrate if raw v12 somehow missing tiles (defensive) — skip, validate requires them.

# Scale on load / refresh / spawn
replace("node.setPosition(spec[1], spec[2]); node.setScale(1.5);",
        "node.setPosition(spec[1], spec[2]); node.setScale(buildingScale(spec[0]));")
replace("node.setPosition(b.x,b.y);node.setScale(1.5);map.addChild(node,3000-b.y);",
        "node.setPosition(b.x,b.y);node.setScale(buildingScale(b.type));map.addChild(node,3000-b.y);")
replace("node.setPosition(saved.x,saved.y);node.setScale(1.5);map.addChild(node,3000-saved.y);",
        "node.setPosition(saved.x,saved.y);node.setScale(buildingScale(saved.type));map.addChild(node,3000-saved.y);")

# Specs should use saved x,y (already tile-derived after migrate)
# Load path already uses saved.x, saved.y from buildings.

# ------------------------------------------------ UI + footprint + placement
# Replace the control-building enqueue block from bar creation through touch end.
# Find unique anchors.

OLD_UI_START = """            var label=function(text,x,y,font) {
                var n=cc.LabelTTF.create(text,'Arial',font||22);
                n.setPosition(x,y); scene.addChild(n,2000); return n;
            };
            var bar=cc.LayerColor.create({r:22,g:39,b:29,a:225});
            bar.setContentSize({width:size.width,height:64});bar.setPosition(0,size.height-64);scene.addChild(bar,1500);
            var footer=cc.LayerColor.create({r:22,g:39,b:29,a:225});
            footer.setContentSize({width:size.width,height:86});scene.addChild(footer,1500);
            label('\\u8fd4\\u56de',55,size.height-32);
            var walletLabel=label('',size.width/2-60,size.height-32,18);
            label('\\u590d\\u4f4d',size.width-245,size.height-32);
            label('\\uff0b',size.width-140,size.height-32,32);
            label('\\uff0d',size.width-55,size.height-32,32);

            var status=label('\\u53ef\\u5efa\\u65e5\\u5149\\u4e95\\u4e0e\\u9f99\\u94f6\\u77ff\\uff08\\u9700\\u4e8c\\u7ea7\\u4e3b\\u57ce\\uff09',size.width/2,59,19);
            var action=label('\\u79fb\\u52a8\\u5efa\\u7b51',size.width*.10,23,20);

            var collectLabel=label('\\u91c7\\u96c6\\u8d44\\u6e90',size.width*.30,23,20);
            var upgradeLabel=label('\\u5347\\u7ea7\\u5efa\\u7b51',size.width*.50,23,20);
            var trainLabel=label('\\u8bad\\u7ec3\\u58eb\\u5175',size.width*.70,23,20);
            var buildLabel=label('\\u5efa\\u9020\\u751f\\u4ea7',size.width*.90,23,20);
            var selected=null,moving=false,confirmUid=null;
            // placingNew is declared with the build helpers below.
            var marker=cc.LabelTTF.create('','Arial',26);map.addChild(marker,9999);"""

NEW_UI_START = r"""            var label=function(text,x,y,font) {
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
            };"""

assert OLD_UI_START in s, 'UI start block missing'
s = s.replace(OLD_UI_START, NEW_UI_START, 1)

# Rewrite showSelected to drive panel buttons
OLD_SHOW = """            var showSelected=function(){
                walletLabel.setString('\\u9f99\\u5e01 '+localState.resources.gold+'/'+capacity.gold+'  \\u65e5\\u5149 '+localState.resources.wood+'/'+capacity.wood);
                buildLabel.setColor(!moving && !placingNew?{r:255,g:235,b:130}:{r:150,g:150,b:150});
                if(placingNew){buildLabel.setColor({r:255,g:235,b:130});buildLabel.setString('\\u5207\\u6362\\u7c7b\\u578b');action.setString('\\u53d6\\u6d88\\u5efa\\u9020');return;}
                buildLabel.setString('\\u5efa\\u9020\\u751f\\u4ea7');
                if(!selected){action.setString('\\u79fb\\u52a8\\u5efa\\u7b51');return;}
                marker.setString('['+selected.name+' Lv.'+data.unit_main[selected.id].lv+']');marker.setPosition(selected.x,selected.y+400);
                var info=moving?'\\u70b9\\u51fb\\u5730\\u56fe\\u7a7a\\u4f4d\\u653e\\u7f6e':'\\u4f4d\\u7f6e\\u5df2\\u4fdd\\u5b58';
                if(selected.producer && !moving)info='\\u5f85\\u91c7\\u96c6 '+producerAmount(selected)+'/'+selected.producer.maxStorage+' \\u00b7 '+selected.producer.produceSpeed+'/\\u5c0f\\u65f6';
                var b=buildingOf(localState,selected.uid),builder=makeBuilder(b);
                if(b.construct)info=constructInfo(selected);
                else if(b.upgrade)info='\\u5347\\u7ea7\\u4e2d \\xb7 \\u5269\\u4f59 '+Math.max(0,builder.getNeedTime())+' \\u79d2';
                else if(confirmUid===b.uid){
                    var targetLv=data.unit_main[upgradeTypes[b.type]].lv;
                    info='\\u5347\\u81f3'+targetLv+'\\u7ea7\\uff1a'+builder.getRealCost()+(builder.resType===RES_TYPE_GOLD?' \\u9f99\\u5e01':' \\u65e5\\u5149')+' \\xb7 '+builder.buildTime+' \\u79d2 \\xb7 \\u518d\\u70b9\\u786e\\u8ba4';
                }else if(!moving){
                    var sc=data.unit_main[b.type];
                    if(sc.wood_storage||sc.gold_storage)
                        info='\\u4ed3\\u5e93\\u63d0\\u4f9b \\u65e5\\u5149 '+(sc.wood_storage||0)+' / \\u9f99\\u5e01 '+(sc.gold_storage||0);
                    else if(String(b.type).indexOf('207')===0)
                        info=(localState.training[b.uid]||soldiersOf(b.uid))?trainInfo(selected):('\\u86cb\\u5bb9\\u91cf '+(sc.egg_storage||0)+' \\xb7 \\u5175\\u5bb9\\u91cf '+(sc.item_storage||0)+' \\xb7 \\u86cb\\u65f6 '+(sc.egg_time||0)+'\\u79d2'+(sc.villager_storage?(' \\xb7 \\u6751\\u6c11 '+(sc.villager_storage||0)):''));
                    else if(String(b.type).indexOf('206')===0){
                        var cityLv=data.unit_main[localState.buildings[0].type].lv;
                        var hn=data.hero_number[cityLv]||data.hero_number[String(cityLv)]||{};
                        info='\\u51fa\\u6218\\u680f '+(hn.hero_attack_num||0)+' \\xb7 \\u82f1\\u96c4\\u7b49\\u7ea7\\u4e0a\\u9650 '+(hn.hero_lv_max||0)+' \\xb7 \\u7ecf\\u9a8c '+(sc.hero_exp||0);
                    }
                }
                status.setString(selected.name+' Lv.'+data.unit_main[b.type].lv+' \\xb7 '+info);
                upgradeLabel.setString(confirmUid===b.uid?'\\u786e\\u8ba4\\u5347\\u7ea7':'\\u5347\\u7ea7\\u5efa\\u7b51');
                upgradeLabel.setColor(upgradeTypes[b.type] && !b.upgrade && !b.construct && !moving && !placingNew?{r:255,g:235,b:130}:{r:150,g:150,b:150});
                action.setString(moving?'\\u53d6\\u6d88\\u79fb\\u52a8':'\\u79fb\\u52a8\\u5efa\\u7b51');
                collectLabel.setColor(selected.producer && !moving && !placingNew && !b.upgrade && !b.construct?{r:255,g:235,b:130}:{r:150,g:150,b:150});
                var isBarracks=String(b.type).indexOf('207')===0;
                trainLabel.setColor(isBarracks && !moving && !placingNew && !b.upgrade && !b.construct && !localState.training[b.uid]?{r:255,g:235,b:130}:{r:150,g:150,b:150});
            };"""

NEW_SHOW = r"""            var showSelected=function(){
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
            };"""

assert OLD_SHOW in s, 'showSelected missing'
s = s.replace(OLD_SHOW, NEW_SHOW, 1)

# Remove duplicate placingNew declaration
replace("            var placingNew=false;\n            var constructInfo=function(item){",
        "            var constructInfo=function(item){")

# beginPlace / placeNew / place overhaul
replace(
    """            var beginPlace=function(pick){
                var opt=CONSTRUCT_OPTIONS[pick],builder=makeBuilder({type:opt.type});
                var cost=builder.getRealCost(),resource=constructResKey(builder);
                if(localState.resources[resource]<cost){status.setString('\\u8d44\\u6e90\\u4e0d\\u8db3\\uff0c\\u9700\\u8981 '+cost+' '+constructResLabel(resource));return false;}
                constructPick=pick;placingNew=true;selected=null;confirmUid=null;moving=false;
                status.setString('\\u70b9\\u51fb\\u5730\\u56fe\\u7a7a\\u4f4d\\u5efa\\u9020'+opt.label+' \\xb7 \\u8d39\\u7528 '+cost+' '+constructResLabel(resource)+' \\xb7 '+builder.buildTime+' \\u79d2\\uff08\\u518d\\u70b9\\u5efa\\u9020\\u53ef\\u5207\\u6362\\u7c7b\\u578b\\uff09');
                action.setString('\\u53d6\\u6d88\\u5efa\\u9020');
                buildLabel.setString('\\u5207\\u6362\\u7c7b\\u578b');
                buildLabel.setColor({r:255,g:235,b:130});
                return true;
            };""",
    """            var beginPlace=function(pick){
                var opt=CONSTRUCT_OPTIONS[pick],builder=makeBuilder({type:opt.type});
                var cost=builder.getRealCost(),resource=constructResKey(builder);
                if(localState.resources[resource]<cost){status.setString('\\u8d44\\u6e90\\u4e0d\\u8db3\\uff0c\\u9700\\u8981 '+cost+' '+constructResLabel(resource));return false;}
                constructPick=pick;placingNew=true;pendingPlace=null;selected=null;confirmUid=null;moving=false;
                showSelected();
                return true;
            };""",
)

replace(
    """            var placeNew=function(x,y){
                x=Math.max(250,Math.min(3582,Math.round(x)));
                y=Math.max(250,Math.min(2562,Math.round(y)));
                for(var ni=0;ni<nodes.length;ni++){
                    var dx=x-nodes[ni].x,dy=y-nodes[ni].y;
                    if(dx*dx+dy*dy<260*260){status.setString('\\u4e0e\\u5176\\u4ed6\\u5efa\\u7b51\\u592a\\u8fd1\\uff0c\\u8bf7\\u91cd\\u9009\\u4f4d\\u7f6e');return;}
                }
                if(workerBusy(localState)){placingNew=false;status.setString('\\u5efa\\u7b51\\u5e08\\u5fd9\\u788c');return;}
                var opt=constructOption();
                if(familyCount(localState,opt.family)>=maxFamily(localState,opt.family)){
                    placingNew=false;status.setString('\\u5df2\\u8fbe\\u53ef\\u5efa\\u4e0a\\u9650');return;
                }
                var builder=makeBuilder({type:opt.type}),cost=builder.getRealCost();
                var resource=constructResKey(builder);
                if(localState.resources[resource]<cost){placingNew=false;status.setString('\\u8d44\\u6e90\\u4e0d\\u8db3\\uff0c\\u9700\\u8981 '+cost+' '+constructResLabel(resource));return;}
                var next=JSON.parse(JSON.stringify(localState)),start=nowSec();
                var uid=nextBuildingUid(next);
                next.resources[resource]-=cost;
                next.buildings.push({uid:uid,type:opt.type,x:x,y:y,construct:{started:start,ends:start+builder.buildTime}});
                next.revision++;
                try{persist(next);}catch(e){status.setString('\\u4fdd\\u5b58\\u5931\\u8d25\\uff0c\\u5efa\\u9020\\u672a\\u5f00\\u59cb');cc.log('DinoLocal save failed: '+e);return;}
                placingNew=false;
                selected=spawnNode(buildingOf(localState,uid));
                showSelected();
                status.setString('\\u5df2\\u5f00\\u59cb\\u5efa\\u9020'+opt.label+' \\xb7 \\u6d88\\u8017 '+cost+' '+constructResLabel(resource)+' \\xb7 '+builder.buildTime+' \\u79d2');
            };""",
    """            var proposePlace=function(x,y,type,label,exceptUid,mode){
                var fp=footprintOf(type), corner=snapCorner(x,y,fp.sx,fp.sy);
                var ok=canPlaceAt(localState,type,corner.tx,corner.ty,exceptUid);
                pendingPlace={mode:mode,type:type,label:label,tx:corner.tx,ty:corner.ty,ok:ok,exceptUid:exceptUid||null};
                showSelected();
            };
            var commitPending=function(){
                if(!pendingPlace || !pendingPlace.ok){status.setString('\\u5f53\\u524d\\u4f4d\\u7f6e\\u4e0d\\u53ef\\u653e\\u7f6e');return;}
                if(pendingPlace.mode==='move'){
                    var next=JSON.parse(JSON.stringify(localState));
                    for(var bi=0;bi<next.buildings.length;bi++)if(next.buildings[bi].uid===selected.uid){
                        applyTileToBuilding(next.buildings[bi],pendingPlace.tx,pendingPlace.ty);
                    }
                    next.revision++;
                    try{persist(next);}catch(error){status.setString('\\u4fdd\\u5b58\\u5931\\u8d25\\uff0c\\u5efa\\u7b51\\u4fdd\\u6301\\u539f\\u4f4d');cc.log('DinoLocal save failed: '+error);return;}
                    selected.x=buildingOf(localState,selected.uid).x;selected.y=buildingOf(localState,selected.uid).y;
                    selected.node.setPosition(selected.x,selected.y);selected.node.setZOrder(3000-selected.y);
                    pendingPlace=null;moving=false;refreshSoldierBadges();showSelected();
                    status.setString('\\u4f4d\\u7f6e\\u5df2\\u4fdd\\u5b58');return;
                }
                if(pendingPlace.mode==='build'){
                    if(workerBusy(localState)){pendingPlace=null;placingNew=false;status.setString('\\u5efa\\u7b51\\u5e08\\u5fd9\\u788c');showSelected();return;}
                    var opt=constructOption();
                    if(familyCount(localState,opt.family)>=maxFamily(localState,opt.family)){
                        pendingPlace=null;placingNew=false;status.setString('\\u5df2\\u8fbe\\u53ef\\u5efa\\u4e0a\\u9650');showSelected();return;
                    }
                    var builder=makeBuilder({type:opt.type}),cost=builder.getRealCost();
                    var resource=constructResKey(builder);
                    if(localState.resources[resource]<cost){pendingPlace=null;placingNew=false;status.setString('\\u8d44\\u6e90\\u4e0d\\u8db3');showSelected();return;}
                    var next2=JSON.parse(JSON.stringify(localState)),start=nowSec();
                    var uid=nextBuildingUid(next2);
                    var nb={uid:uid,type:opt.type,x:0,y:0,construct:{started:start,ends:start+builder.buildTime}};
                    applyTileToBuilding(nb,pendingPlace.tx,pendingPlace.ty);
                    next2.resources[resource]-=cost;next2.buildings.push(nb);next2.revision++;
                    try{persist(next2);}catch(e){status.setString('\\u4fdd\\u5b58\\u5931\\u8d25\\uff0c\\u5efa\\u9020\\u672a\\u5f00\\u59cb');cc.log('DinoLocal save failed: '+e);return;}
                    placingNew=false;pendingPlace=null;
                    selected=spawnNode(buildingOf(localState,uid));
                    showSelected();
                    status.setString('\\u5df2\\u5f00\\u59cb\\u5efa\\u9020'+opt.label+' \\xb7 \\u6d88\\u8017 '+cost+' '+constructResLabel(resource)+' \\xb7 '+builder.buildTime+' \\u79d2');
                }
            };
            var cancelPending=function(){
                pendingPlace=null;placingNew=false;moving=false;
                showSelected();status.setString('\\u5df2\\u53d6\\u6d88');
            };
            var placeNew=function(x,y){
                var opt=constructOption();
                proposePlace(x,y,opt.type,opt.label,null,'build');
            };""",
)

replace(
    """            var place=function(x,y){
                x=Math.max(250,Math.min(3582,Math.round(x)));
                y=Math.max(250,Math.min(2562,Math.round(y)));
                for(var ni=0;ni<nodes.length;ni++)if(nodes[ni]!==selected){
                    var dx=x-nodes[ni].x,dy=y-nodes[ni].y;
                    if(dx*dx+dy*dy<260*260){status.setString('\\u4e0e\\u5176\\u4ed6\\u5efa\\u7b51\\u592a\\u8fd1\\uff0c\\u8bf7\\u91cd\\u9009\\u4f4d\\u7f6e');return;}
                }
                var next=JSON.parse(JSON.stringify(localState));
                for(var bi=0;bi<next.buildings.length;bi++)if(next.buildings[bi].uid===selected.uid){next.buildings[bi].x=x;next.buildings[bi].y=y;}
                next.revision++;
                try { persist(next); } catch(error){
                    status.setString('\\u4fdd\\u5b58\\u5931\\u8d25\\uff0c\\u5efa\\u7b51\\u4fdd\\u6301\\u539f\\u4f4d');cc.log('DinoLocal save failed: '+error);return;
                }
                selected.x=x;selected.y=y;selected.node.setPosition(x,y);selected.node.setZOrder(3000-y);
                moving=false;refreshSoldierBadges();showSelected();
            };""",
    """            var place=function(x,y){
                proposePlace(x,y,selected.id,selected.name,selected.uid,'move');
            };""",
)

# Camera: slightly higher default zoom so smaller buildings fill the view like reference
replace(
    "            var reset=function(){map.setScale(.45);map.setPosition(size.width/2-3832*.45/2,size.height/2-2812*.45/2);};\n"
    "            var zoom=function(d){\n"
    "                var p=map.getPosition(),old=map.getScale(),z=Math.max(.3,Math.min(.8,old+d));\n",
    "            var reset=function(){map.setScale(.58);map.setPosition(size.width/2-3832*.58/2,size.height/2-2812*.58/2-40);};\n"
    "            var zoom=function(d){\n"
    "                var p=map.getPosition(),old=map.getScale(),z=Math.max(.35,Math.min(1.0,old+d));\n",
)

# Touch handling: footerH, panel buttons, hitBuilding
replace(
    """            touch.onTouchesMoved=function(t){
                if(!t.length || !this.last || this.first.y>size.height-64 || this.first.y<86)return;""",
    """            touch.onTouchesMoved=function(t){
                if(!t.length || !this.last || this.first.y>size.height-64 || this.first.y<footerH)return;""",
)

replace(
    """                if(p.y<86){
                    if(p.x>size.width*.80){build();return;}
                    if(p.x>size.width*.60){train();return;}
                    if(p.x>size.width*.40){upgrade();return;}
                    if(p.x>size.width*.20){collect();return;}
                    confirmUid=null;
                    if(placingNew){placingNew=false;buildLabel.setString('\\u5efa\\u9020\\u751f\\u4ea7');showSelected();status.setString('\\u5df2\\u53d6\\u6d88\\u5efa\\u9020');return;}
                    if(selected && (buildingOf(localState,selected.uid).upgrade || buildingOf(localState,selected.uid).construct)){status.setString('\\u5efa\\u9020\\u6216\\u5347\\u7ea7\\u671f\\u95f4\\u4e0d\\u80fd\\u79fb\\u52a8\\u5efa\\u7b51');return;}
                    if(selected){moving=!moving;showSelected();}
                    else status.setString('\\u8bf7\\u5148\\u70b9\\u51fb\\u4e00\\u5ea7\\u5efa\\u7b51');
                    return;
                }
                var mp=map.getPosition(),z=map.getScale(),x=(p.x-mp.x)/z,y=(p.y-mp.y)/z;
                if(placingNew){placeNew(x,y);return;}
                if(moving && selected){place(x,y);return;}
                var best=null,dist=190*190;
                for(var i=0;i<nodes.length;i++){
                    var n=nodes[i],dx=x-n.x,dy=y-(n.y+90),d=dx*dx+dy*dy;
                    if(d<dist){dist=d;best=n;}
                }
                if(best){selected=best;confirmUid=null;showSelected();}
            };""",
    """                if(p.y<footerH){
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
                            status.setString('\\u5efa\\u9020\\u6216\\u5347\\u7ea7\\u671f\\u95f4\\u4e0d\\u80fd\\u79fb\\u52a8\\u5efa\\u7b51');return;
                        }
                        if(selected){moving=!moving;pendingPlace=null;showSelected();}
                        else status.setString('\\u8bf7\\u5148\\u70b9\\u51fb\\u4e00\\u5ea7\\u5efa\\u7b51');
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
            };""",
)

# badge offset
replace("n.badge.setString(txt);n.badge.setPosition(n.x,n.y+250);",
        "n.badge.setString(txt);n.badge.setPosition(n.x,n.y+140);")

# caption / ready status
replace(
    'var caption = cc.LabelTTF.create("\\u672c\\u5730\\u751f\\u4ea7\\u5efa\\u7b51\\u6d4b\\u8bd5 \\u00b7 \\u70b9\\u51fb\\u8fdb\\u5165\\u6e38\\u620f", "Arial", 18);',
    'var caption = cc.LabelTTF.create("\\u672c\\u5730\\u4e3b\\u57ce\\u754c\\u9762\\u6d4b\\u8bd5 \\u00b7 \\u70b9\\u51fb\\u8fdb\\u5165\\u6e38\\u620f", "Arial", 18);',
)
replace('return JSON.stringify({status:"local-mine-ready", patch:PATCH_ENABLED, mode:__PLAY_MODE});',
        'return JSON.stringify({status:"local-cityui-ready", patch:PATCH_ENABLED, mode:__PLAY_MODE});')

# schedule displayTicks also when pending
replace(
    "if(changed.length || (res.construct&&res.construct.length) || res.training.length || (++displayTicks%2===0 && selected && !moving && !placingNew))showSelected();",
    "if(changed.length || (res.construct&&res.construct.length) || res.training.length || (++displayTicks%2===0 && selected && !moving && !placingNew && !pendingPlace))showSelected();",
)

out = W / 'cityui_boot.js'
out.write_text(s, encoding='utf-8')
print('Wrote', out, 'bytes', out.stat().st_size)
# sanity: no leftover 1.5 scales or 260 distance
assert 'setScale(1.5)' not in s
assert '260*260' not in s
assert 'dino.local.city.v12' in s
assert 'buildingScale' in s
assert 'drawFootprint' in s
print('sanity ok')
