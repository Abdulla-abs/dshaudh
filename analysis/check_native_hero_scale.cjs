// Read-only check: execute original scale application and removal with mocked Cocos actions.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=path.join(root,'.local/hero-scale');
let scale=2,attributeCalls=0;const actions=[];
const bc={};for(const method of ['changeAttack','changeMaxLife','changeDefence','changeAttackSpeed','setInvincible'])
 bc[method]=()=>{attributeCalls++;};
const unit={rootNode:{runAction(action){actions.push(action);scale*=action.x;}},getComponent:name=>name==='BattleController'?bc:null};
const c={data:{},Buff:{BuffAction:function(){}},G_UnitManager:{getUnit:()=>unit},
 MagicField:{MagicFieldManager:{getInstance:()=>({setActiveMagicField(){}})}},
 cc:{ScaleBy:{create:(duration,x,y)=>({duration,x,y})}}};
vm.createContext(c);
for(const name of ['buff_data'])vm.runInContext(fs.readFileSync(path.join(out,name+'.js'),'utf8'),c);
const src=fs.readFileSync(path.join(out,'BuffControll.js'),'utf8');
for(const name of ['take_effect','lose_effect']){
 const a=src.indexOf('Buff.BuffAction.prototype.'+name+'='),b=src.indexOf('\n    };',a)+7;
 assert.ok(a>=0&&b>a);vm.runInContext(src.slice(a,b).replace(/\{/,'{var target,bc,progressAction;'),c);
}
const pure=c.data.buff_data[899701];assert.equal(pure.scale,1.5);assert.equal(pure.buff_name,'放大专用buff');
const buff=new c.Buff.BuffAction();buff.config=pure;buff.targetId=1;
buff.take_effect();assert.equal(scale,3);assert.deepEqual(actions[0],{duration:.5,x:1.5,y:1.5});
buff.lose_effect();assert.equal(scale,2);assert.equal(actions[1].x,1/1.5);assert.equal(attributeCalls,0);
const summary=[899501,899701,899801,1022202].map(id=>{
 const b=c.data.buff_data[id];assert.ok(b);return {id,name:b.buff_name,scale:b.scale,durationMs:b.buff_time,
  attack_rate:b.attack_rate,defence_rate:b.defence_rate,speed_rate:b.speed_rate,attspeed_rate:b.attspeed_rate};
});
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({source:'original buff table and original methods; mocked action completion, not device observation',pureScaleApplicationRestores:true,summary},null,2)+'\n');
console.log('PASS: stock 1.5x scale action and inverse removal; pure scale makes no combat attribute calls');
for(const row of summary)console.log(JSON.stringify(row));
