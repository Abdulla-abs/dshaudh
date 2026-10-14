var out={request:'actual-unit-params-20261013',calls:[]};var proto=Unit.prototype,orig=proto._initComponents;
proto._initComponents=function(){out.calls.push({args:Array.prototype.slice.call(arguments),stage:this.stage,params:this.params,configKeys:this.config?Object.keys(this.config):null});throw Error('STOP_BEFORE_COMPONENTS');};
var u=null;
try{u=G_UnitManager.getFactory().createUnit({type:'Unit',cid:-900});u.getPlayer=function(){return {getComponent:function(){return {getRelocateUnitTypeid:function(t){return t;}};}};};u.init({typeid:20101,unit_type:201,unit_level:1,state:2,x:28,y:28,faction:1},2,false);}catch(e){out.error=String(e);out.stack=e.stack;}
proto._initComponents=orig;
return out;


