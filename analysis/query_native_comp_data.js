var out={request:'component-data-20261013',calls:[]};var f=G_UnitManager.getFactory();var orig=f.CreateComponent;
f.CreateComponent=function(){var a=Array.prototype.slice.call(arguments);out.calls.push({key:a[1],args:a.slice(2)});};
var params={typeid:20101,unit_type:201,unit_level:1,state:2,x:28,y:28};
var unit={params:params,config:data.unit_main[20101],typeid:20101,firstType:1,secondType:0,stage:2,componentList:{}};
try{f.solveComponent(unit,params,false,2);}catch(e){out.error=String(e);out.stack=e.stack;}
f.CreateComponent=orig;return out;


