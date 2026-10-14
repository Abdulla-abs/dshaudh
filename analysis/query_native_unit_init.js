var out={request:'unit-init-contract-20261013',calls:[]};
var factory=G_UnitManager.getFactory(),original=factory.createUnit;
factory.createUnit=function(){out.calls.push({factoryArgs:Array.prototype.slice.call(arguments)});return {init:function(){out.calls.push({initArgs:Array.prototype.slice.call(arguments)});throw new Error('STOP_BEFORE_UNIT_INIT');}};};
try{Game.GameControllerBattle.prototype.createUnit.call({}, {typeid:20101,unit_type:201,unit_level:1,state:2,x:28,y:28,faction:2});}catch(e){out.error=String(e);}
factory.createUnit=original;
out.unitInitLength=Unit.prototype.init.length;
return out;
