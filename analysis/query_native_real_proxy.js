var out={request:'real-proxy-20261013',calls:[]};
var fake={battleStarted:true,inReplayMode:true,isNeedRecordReplay:function(){return false;},sendUnitToMap:function(){out.calls.push(Array.prototype.slice.call(arguments));return {getComponent:function(){return {};}};},menu:{}};
var p=new Game.UnitProxy(10101,fake,0);p.setMaxNum(4);p.type=SELECTABLE_TYPE_UNIT;fake.UnitChoiceList=[p];
try {Game.GameControllerBattle.prototype.UserDelayedCreateUnit.call(fake,0,{x:400,y:400},1);}catch(e){out.error=String(e);out.stack=e.stack;}
out.curNum=p.curNum;
return out;

