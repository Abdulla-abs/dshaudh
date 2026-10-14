var out={request:'choice-20261013'};
try {var p=new Game.UnitProxy(10101,{inReplayMode:true},0);p.setMaxNum(4);out.keys=Object.keys(p);out.proto=Object.keys(Game.UnitProxy.prototype);out.fields={typeid:p.typeid,curNum:p.curNum,maxNum:p.maxNum,params:p.params};out.methods={dispatch:p.dispatchUnit&&p.dispatchUnit.length,setMaxNum:p.setMaxNum&&p.setMaxNum.length};}catch(e){out.error=String(e);out.stack=e.stack;}
return out;

