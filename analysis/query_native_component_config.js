var out={request:'component-params-20261013',calls:[]};var f=G_UnitManager.getFactory();var orig=f.CheckAndCreateComponent;
f.CheckAndCreateComponent=function(){var a=Array.prototype.slice.call(arguments);out.calls.push({key:a[1],stage:a[2],firstKeys:a[0]&&Object.keys(a[0]),params:a[3]});};
try{f.solveComponent({config:data.unit_main[20101]}, {unit_type:201,unit_level:1,typeid:20101,state:2,x:28,y:28},2,false);}catch(e){out.error=String(e);}
f.CheckAndCreateComponent=orig;
return out;
