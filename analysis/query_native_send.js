var out={request:'send-protocol-20261013',length:Game.GameControllerBattle.prototype.sendUnitToMap.length};
var fake={mapManager:{realTileCoordForPosition:function(p){out.coord=p;return {x:16,y:20};},addUnit:function(){}},createUnit:function(p){out.params=p;return {getComponent:function(){return {takeNoSpace:function(){},setOverTile:function(){},setToTile:function(){}};},setPosition:function(){},comeToWorld:function(){}};}};
try{Game.GameControllerBattle.prototype.sendUnitToMap.call(fake,{typeid:10101,faction:1},{x:400,y:400});}catch(e){out.error=String(e);out.stack=e.stack;}
return out;
