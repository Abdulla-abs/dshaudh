// Advanced wanted buff: native API arguments, stock effects, scope and RPC integration.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(__dirname,'native_boot.js'),'utf8');
let unit,scale=1,created=0,ran=0;const changes=[];
const c={LocalNative:{},data:{},Buff:{BuffAction:function(){}},
 cc:{ScaleBy:{create:(duration,x,y)=>({duration,x,y})}},G_UnitManager:{getUnit:()=>unit},
 MagicField:{MagicFieldManager:{getInstance:()=>({setActiveMagicField(){}})}}};
vm.createContext(c);
for(const file of ['.local/hero-scale/buff_data.js','.local/wanted/wanted.js','.local/wanted/unit_main.js'])
 vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),c);
const buffSource=fs.readFileSync(path.join(root,'.local/hero-scale/BuffControll.js'),'utf8');
for(const name of ['take_effect','lose_effect']){
 const a=buffSource.indexOf('Buff.BuffAction.prototype.'+name+'='),b=buffSource.indexOf('\n    };',a)+7;
 vm.runInContext(buffSource.slice(a,b).replace(/\{/,'{var target,bc,progressAction;'),c);
}
for(const name of ['applyWantedTargetBuff','handleWantedRpc','runWantedTargetTrigger','allowWantedTargetGroundAndAir','castWantedGroundAndAirField']){
 const a=source.indexOf(`        LocalNative.${name} = function`),b=source.indexOf('\n        };',a)+11;
 assert.ok(a>=0&&b>a,name);vm.runInContext(source.slice(a,b),c);
}
const actions={};
const manager={handleBuff(id,camp,mir,target){
 assert.equal(id,899801);assert.equal(camp,2);assert.equal(mir.casterId,unit.cid);assert.equal(target,unit.cid);
 const action=new c.Buff.BuffAction();action.config=c.data.buff_data[id];action.targetId=target;actions[++created]=action;return created;
},runBuff(handle){ran++;actions[handle].take_effect();}};
c.Buff.BuffManager={getInstance:()=>manager};
function fresh(){scale=1;changes.length=0;
 const bc={getCasterMir:()=>({casterId:unit.cid,baseAtt:100})};
 for(const name of ['changeAttack','changeDefence','changeAttackSpeed'])bc[name]=(...args)=>changes.push([name,...args]);
 const move={changeSpeed:(...args)=>changes.push(['changeSpeed',...args])};
 bc.skillManager={getDefaultSkill:()=>({config:{},setTargetAirAvailable(){this.config.target_air=1;}})};
 unit={cid:456,typeid:10455,faction:2,rootNode:{runAction:a=>{scale*=a.x;}},getComponent:name=>name==='BattleController'?bc:name==='MoveController'?move:null};
 return bc;
}
const n=c.LocalNative;let bc=fresh();
for(const cardOrder of [1,2])assert.equal(n.applyWantedTargetBuff(unit,{cardOrder}),0);
assert.equal(created,0);assert.equal(scale,1);
const handle=n.applyWantedTargetBuff(unit,{cardOrder:3});
assert.equal(created,1);assert.equal(ran,1);assert.equal(scale,1.5);
assert.deepEqual(changes,[['changeAttack',.5,0],['changeDefence',-.5,0],['changeSpeed',2],['changeAttackSpeed',2]]);
assert.equal(n.applyWantedTargetBuff(unit,{cardOrder:3}),handle);assert.equal(created,1);assert.equal(ran,1);assert.equal(scale,1.5);
assert.equal(c.data.buff_data[899801].buff_time,999999);
assert.ok(c.data.buff_data[899801].buff_fx_auto);
actions[handle].lose_effect();assert.equal(scale,1);
// Exercise the real advanced RPC branch, with stock trigger callback boundary.
bc=fresh();let status;
const gc={wantedResideUnit:123,createUnit:()=>unit};
Object.assign(n,{installWantedAwardDisplay(){},getBattleController:()=>gc,writeStatus:s=>{status=s;},
 pveSession:{localNativeWanted:true,cardOrder:3,wantedId:10403,wantedTrigger:{trigger_unit:10455,trigger_target_camp:2,trigger_unit_lv:60,localWantedEquipment:[]}}});
const player={rpc_c_run_trigger(p){gc.createUnit({typeid:10455,faction:2});gc.wantedTarget=unit.cid;}};
const params={cid:123,trigger_id:c.data.wanted[10403].server_trigger_id};
assert.equal(n.handleWantedRpc(player,'rpc_s_run_server_trigger',params),true);
assert.equal(scale,1.5);assert.equal(status.buff899801Handle,2);assert.equal(created,2);assert.equal(ran,2);
assert.equal(n.handleWantedRpc(player,'rpc_s_run_server_trigger',params),false);assert.equal(ran,2);
// Missing prerequisites report a failure rather than silently claiming success.
assert.throws(()=>n.applyWantedTargetBuff(null,{cardOrder:3}),/dependencies/);
console.log('PASS: 899801 advanced-only, original 1.5x scale and 150/50/200/200 modifiers, duration/effect table, inverse scale, once per unit, advanced spawn RPC and duplicate rejection');
