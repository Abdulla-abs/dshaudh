var out={request:'init-components-20261013',calls:[]};var f=G_UnitManager.getFactory();var orig=f.initUnit;
f.initUnit=function(){var a=Array.prototype.slice.call(arguments);out.calls.push({args:a});throw Error('STOP_COMPONENT_FACTORY');};
try{Unit.prototype._initComponents.call({params:{typeid:20101,unit_type:201,unit_level:1,state:2,x:28,y:28},stage:2,componentList:{}}, {state:2},2,false);}catch(e){out.error=String(e);}
f.initUnit=orig;out.length=Unit.prototype._initComponents.length;
return out;
