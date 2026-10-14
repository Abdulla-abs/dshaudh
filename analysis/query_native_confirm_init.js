var out={request:'confirm-init-prerequisite-20261013'};
var old=Comp.BuildingBuilder.buyBuildingConfirm,node=null;
try {node=cc.BuilderReader.load(RS.BUY_BUILDING_CONFIRM);out.nodeKeys=Object.keys(node);out.hasController=!!node.controller;
Comp.BuildingBuilder.buyBuildingConfirm=node.controller;node.setVisible(false);
var oldGc=DA.GETCGC;DA.GETCGC=function(){return {mapManager:{TileCenterPosForLogicCoord:function(){return {x:0,y:0};}}};};var b={master:{stage:2,canFinishMoving:function(){return false;},getComponent:function(){return {placeType:PLACE_TYPE_ONTILE,targetTile:{x:28,y:28},size:4,size_y:4};}},stage:2,state:0,enableOK:function(){return false;},canFinishMoving:function(){return false;}};
Comp.BuildingBuilder.prototype.init.call(b,data.unit_main[20101],{state:2,beginTime:0});out.state=b.state;out.ok=true;
}catch(e){out.error=String(e);out.stack=e.stack;}
if(typeof oldGc!=="undefined") DA.GETCGC=oldGc;Comp.BuildingBuilder.buyBuildingConfirm=old;
if(node)try{node.cleanup();}catch(e){}
return out;



