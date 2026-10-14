var out={request:'real-component-contract-20261013',calls:[]};var f=G_UnitManager.getFactory(),orig=f.CreateComponent;
f.CreateComponent=function(){var a=Array.prototype.slice.call(arguments);out.calls.push({firstKeys:Object.keys(a[0]),rest:a.slice(1)});};
try{var u=f.createUnit({type:'Unit',cid:-901});u.getPlayer=function(){return {getComponent:function(){return {getRelocateUnitTypeid:function(t){return t;}};}};};u.init({typeid:20101,unit_type:201,unit_level:1,state:2,x:28,y:28,faction:1},2,false);}catch(e){out.error=String(e);out.stack=e.stack;}
f.CreateComponent=orig;return out;

