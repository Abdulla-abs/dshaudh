var out={request:'soldier-placement-20261013',calls:[]};
var fake={createUnit:function(params){out.calls.push({params:params});return {getComponent:function(){out.calls.push("GET_COMPONENT");return null;},setPosition:function(p){out.calls.push({pos:p});},rootNode:{setPosition:function(p){out.calls.push({rootPos:p});}},comeToWorld:function(){out.calls.push('COME');}};},mapManager:{addUnit:function(){out.calls.push('ADD');}}};
try {Game.GameControllerBattle.prototype.sendUnitToMap.call(fake,{typeid:10101,faction:1}, {x:400,y:400});}catch(e){out.calls.push(String(e));}
out.proxyLength=Game.UnitProxy.prototype.Operate.length;
var oldGc=DA.GETCGC;DA.GETCGC=function(){return {battleFinished:false};};var proxy=new Game.UnitProxy(10101,{sendUnitToMap:function(){out.proxyArgs=Array.prototype.slice.call(arguments);return {};},inReplayMode:true},0);proxy.setMaxNum(4);
try {proxy.Operate({x:400,y:400},1);}catch(e){out.proxyError=String(e);out.proxyStack=e.stack;}
DA.GETCGC=oldGc;return out;



