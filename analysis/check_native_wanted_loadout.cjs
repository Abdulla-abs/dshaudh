// Verify stock ranks and rune components through the wanted spawn boundary.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),src=fs.readFileSync(path.join(__dirname,'native_boot.js'),'utf8');
const c={LocalNative:{},data:{},Comp:{HeroEquipment:function(){},StaticBattleController:function(){}},cc:{baseCall(){}},
 BATTLE_FACTION_DEFENDER:2,BATTLE_TYPE_HERO:4,SKILL_TYPE_ACTIVE_SKILL:2,JINGLING_DRAGON_TYPEID:115,RUNE_SKILL_LEVEL_RATE:[0,.6,.8,1],RUNE_SKILL_LEVEL_RLIMIT:3,
 DA:{debug(){},GETCGC:()=>({getStageClient:()=>({pveStage:720})})}};
vm.createContext(c);
for(const name of ['wanted','unit_main','unit_battle','skill_data','hero_to_skill','skill_to_hero','hero_evolve','pve_trigger_server_to_client','item'])
 vm.runInContext(fs.readFileSync(path.join(root,'.local/wanted',name+'.js'),'utf8'),c);
for(const name of ['rune_order','equipment_attribute','exclusive_attribute'])
 vm.runInContext(fs.readFileSync(path.join(root,'.local/layout-editor/runes',name+'.js'),'utf8'),c);
vm.runInContext(fs.readFileSync(path.join(root,'.local/layout-editor/skill-info/string_data.js'),'utf8'),c);
for(const name of ['buildWantedEquipment','buildWantedTargetTrigger','prepareHeroBattleSkills','runWantedTargetTrigger']){
 const a=src.indexOf(`        LocalNative.${name} = function`),b=src.indexOf('\n        };',a)+11;
 assert.ok(a>=0&&b>a);vm.runInContext(src.slice(a,b),c);
}
const equipmentSource=fs.readFileSync(path.join(root,'.local/layout-editor/runes/HeroComponents.js'),'utf8');
for(const name of ['init','dump','_getEquipSkillId','_getEquipTypeLevel','_getEquipSkillLevel','getExtraKeySkill']){
 const start=equipmentSource.indexOf('Comp.HeroEquipment.prototype.'+name+'='),end=equipmentSource.indexOf('\n    };',start)+7;
 assert.ok(start>=0&&end>start);let text=equipmentSource.slice(start,end);
 if(name==='_getEquipTypeLevel')text=text.replace('(config.item_level || levels.push(0));','levels.push(config.item_level || 0);')
  .replace('(config.rune_type || types.push(" "));','types.push(config.rune_type || " ");');
 text=text.replace(/\{/,'{var config,types,levels,i,ret,key,sum,skillno,typeid,rate,attr,rein,heroType,slot,eqp_list,equip;');
 vm.runInContext(text,c);
}
const battleSource=fs.readFileSync(path.join(root,'.local/battle-skill/BattleController.js'),'utf8');
for(const method of ['afterInit','addSkill']){
 const start=battleSource.indexOf('Comp.StaticBattleController.prototype.'+method+'='),end=battleSource.indexOf('\n    };',start)+7;
 vm.runInContext(battleSource.slice(start,end).replace(/\{/,'{var base_att,extral,heroEqp,isPVP,config;'),c);
}
const enabled=new Set();for(let order=1;order<=3;order++)for(const band of Object.values(c.data.wanted['player_lv_info'+order].player_lv_info))
 for(const row of band.targets)if(row.probability>0)enabled.add(row.wanted_id);
let stockSkills=0;
function verify(spawn){
 const order=c.data.wanted[spawn.wantedId]?.card_order;
 const eqp=spawn.localWantedEquipment;
 assert.equal(eqp.length,5);
 const expected=[0,0,2,5][spawn.order];
 assert.equal(eqp.filter(Boolean).length,expected);
 for(let slot=0;slot<5;slot++){
  const r=eqp[slot];if(slot>=expected){assert.equal(r,null);continue;}
  const item=c.data.item[r.typeid];assert.equal(item.item_form,slot+3);assert.equal(item.item_level,2);
  for(const [layer,flag] of [['base_attr','att_basic_color'],['two_attr','att_evolve2_color'],['three_attr','att_evolve3_color']]){
   assert.equal(r[layer].length,1);assert.ok(c.data.equipment_attribute[r[layer][0]][flag]>0);
  }
 }
 // Native components consume the eqp passed into createUnit before afterInit.
 let received,combination,added=[];
 const gc={createUnit(params){
  received=params;const equipment=new c.Comp.HeroEquipment();
  equipment.master={faction:params.faction,getOriginType:()=>Math.floor(spawn.trigger_unit/100)};
  equipment.init({},params);assert.equal(JSON.stringify(equipment.eqp),JSON.stringify(eqp));
  combination=equipment.getExtraKeySkill();
  const bc={config:{base_att:10},master:{faction:2,getExtraAttack:()=>0,getComponent:()=>equipment},
   getGrowUpValue:()=>0,canCastActiveSkill:false,addSkill:c.Comp.StaticBattleController.prototype.addSkill,
   skillManager:{addSkill:id=>{assert.ok(c.data.skill_data[id]);added.push(id);}}};
  c.Comp.StaticBattleController.prototype.afterInit.call(bc);
  if(combination[1]>0&&c.data.skill_data[combination[1]].skill_type===2)assert.equal(bc.canCastActiveSkill,true);
  return {equipment};
 }};
 const originalCreate=gc.createUnit;
 const payload={config:spawn};const player={rpc_c_run_trigger(p){
  assert.equal(p,payload);gc.createUnit({unit_type:Math.floor(spawn.trigger_unit/100),unit_level:spawn.trigger_unit%100,faction:2});
 }};
 c.LocalNative.runWantedTargetTrigger(player,gc,payload);
 assert.equal(gc.createUnit,originalCreate);
 assert.notEqual(received.eqp,eqp,'fresh equipment copy for each spawn');
 if(spawn.order===3){assert.ok(combination[1]>0);assert.equal(combination[0].length,5);}
 if(combination[1]>0){assert.equal(combination[1]%100,2,'all level-2 runes produce level-2 skill');
  assert.deepEqual(added,[combination[1]]);stockSkills++;
 }else{assert.equal(combination[1],-1);assert.equal(added.length,0);}
}
for(const id of enabled){const spawn=c.LocalNative.buildWantedTargetTrigger(id),order=c.data.wanted[id].card_order;
 const main=c.data.unit_main[spawn.trigger_unit];
 assert.equal(c.data.string_data[main.sub_name].Chinese,['','下士','少尉','准将'][order]);
 assert.equal(main.battle_res,'unit/ccb/'+(Math.floor(spawn.trigger_unit/100)*100+order)+'.ccbi');
 verify({...spawn,wantedId:id,order});
}
// Cover every five-rune order, including both random endpoints.
const keys=Object.keys(c.data.rune_order).filter(k=>k.length===5&&/^[txy]+$/.test(k)).sort(),seen=new Set();
for(let i=0;i<keys.length;i++){
 vm.runInContext(`Math.random=()=>${(i+.1)/keys.length}`,c);
 const spawn=c.LocalNative.buildWantedTargetTrigger(10403);verify({...spawn,order:3});
 seen.add(spawn.localWantedEquipment.map(r=>c.data.item[r.typeid].rune_type).join(''));
}
assert.equal(seen.size,keys.length);
// On callback failure restore both own and inherited factory methods.
for(const own of [true,false]){
 const create=()=>{};const gc=own?{createUnit:create}:Object.create({createUnit:create});
 assert.throws(()=>c.LocalNative.runWantedTargetTrigger({rpc_c_run_trigger(){throw Error('spawn failed');}},gc,{config:{}}),/spawn failed/);
 assert.equal(gc.createUnit,create);assert.equal(Object.hasOwn(gc,'createUnit'),own);
}
// Other units created by the callback never receive target equipment.
const foreign={typeid:10401,faction:1},gc={createUnit:p=>p};
c.LocalNative.runWantedTargetTrigger({rpc_c_run_trigger(){gc.createUnit(foreign);}},gc,
 {config:{trigger_unit:10455,trigger_target_camp:2,localWantedEquipment:[]}});
assert.equal(foreign.eqp,undefined);
console.log(`PASS: ${enabled.size} localized promotion ranks; 0/2/5 level-2 rune slots; ${keys.length} full five-rune orders; ${stockSkills} stock skill activations; spawn isolation and exception restoration`);
