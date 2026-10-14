var out={request:'soldier-fields-20261013'};var p=Unit.prototype,old=p._initComponents;
p._initComponents=function(){out.unit={fixed:this.fixed,typeid:this.typeid,battleType:this.battleType,firstType:this.firstType,stage:this.stage};throw Error('STOP_BEFORE_COMPONENTS');};
try{var u=G_UnitManager.getFactory().createUnit({type:'Unit',cid:-905});u.getPlayer=function(){return {getComponent:function(){return {getRelocateUnitTypeid:function(t){return t;}};}};};u.init({typeid:10101,faction:1},2,false);}catch(e){out.error=String(e);}
p._initComponents=old;return out;
