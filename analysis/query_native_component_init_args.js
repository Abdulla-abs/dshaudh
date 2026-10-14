var out={request:'component-init-args-20261013',calls:[]};var f=G_UnitManager.getFactory(),orig=f.CreateComponent;
f.CreateComponent=function(unit,config,key,realKey){unit.componentList[realKey]={init:function(p){out.calls.push({key:key,args:Array.prototype.slice.call(arguments).map(function(a){return a&&a.typeid?{typeid:a.typeid,state:a.state,unit_type:a.unit_type,x:a.x,TileHolder:a.TileHolder,BuildingBuilder:a.BuildingBuilder}:a;})});},afterInit:function(){}};};
try{var u=f.createUnit({type:'Unit',cid:-902});u.getPlayer=function(){return {getComponent:function(){return {getRelocateUnitTypeid:function(t){return t;}};}};};u.init({typeid:20101,unit_type:201,unit_level:1,state:2,x:28,y:28,faction:1},2,false);}catch(e){out.error=String(e);out.stack=e.stack;}
f.CreateComponent=orig;out.states={finish:BUILD_STATE_FINISH,building:BUILD_STATE_BUILDING,before:BUILD_STATE_BEFORE_BUILD};return out;

