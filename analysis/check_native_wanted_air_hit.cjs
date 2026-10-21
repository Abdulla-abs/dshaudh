// Regression: Pink Dragon normal attack -> stock field filter -> damage buff -> HP callback.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'.local/wanted-air-hit'),boot=fs.readFileSync(path.join(__dirname,'native_boot.js'),'utf8');
let target,hits=0,sourceSkill;const units={};
const c={LocalNative:{},data:{},Skill:{SimpleSkill:function(){},EffectSkill:function(){},SkillCaster:function(){}},
 MagicField:{MagicFieldAction:function(){}},Buff:{BuffAction:function(){}},
 SKILL_CAST_TO_SELF:1,SKILL_CAST_TO_TARGET:2,SKILL_CAST_TO_POS:3,SKILL_TYPE_NORMAL_ATTACK:1,
 MAGICFIELD_AIR_ONLY:1,MAGICFIELD_LAND_ONLY:2,EFFECT_CAMP_NONE:4,STATE_ENDIND_ATTACK:2,
 G_UnitManager:{getUnit:id=>units[id]},G_EffectManager:{playEffectOnce(){}},
 DA:{deepCopy:x=>JSON.parse(JSON.stringify(x)),GETCGC:()=>({invincibleUnits:{}}),contains:(a,b)=>a.includes(b),getGameTimeSec:()=>10,getFavouriteAdd:()=>1,calculateTile8Dir:()=>0},
 cc:{baseCall(clazz,self,name,...args){return c.Skill.SimpleSkill.prototype[name].apply(self,args);}}};
vm.createContext(c);
for(const [folder,name]of [[dir,'magic_field'],[dir,'buff_data'],[path.join(root,'.local/wanted'),'skill_data'],[path.join(root,'.local/wanted'),'unit_main']])
 vm.runInContext(fs.readFileSync(path.join(folder,name+'.js'),'utf8'),c);
function original(file,prefix,name,fixes=[]){
 const src=fs.readFileSync(path.join(dir,file+'.js'),'utf8'),a=src.indexOf(prefix+name+'='),b=src.indexOf('\n    };',a)+7;
 assert.ok(a>=0&&b>a,name);let text=src.slice(a,b);
 for(const [from,to]of fixes){assert.ok(text.includes(from),from);text=text.replaceAll(from,to);}
 text=text.replace(/\{/,'{var target,bc,attack,currTime,interval,targetList,i,max,pos,dir,s_pos,vector,curTime,flyer,mfm,mfhandle,posList,unit,judger,targets,effect_targets,tar,buff_id,summon_list,len,total_damage,damage,base_att_rate;');
 vm.runInContext(text,c);
}
for(const name of ['apply','setTargetAirAvailable'])original('Skill','Skill.SimpleSkill.prototype.',name);
// Restore the short-circuit guard confirmed at Skill bytecode 003709..003743.
original('Skill','Skill.SimpleSkill.prototype.','realAttack',[
 ['((target && target.isAlive()) && (!target.getComponent("BattleController"))) && target.getComponent("BattleController").isAttackTarget()',
  '(target && target.isAlive()) && (!target.getComponent("BattleController") || target.getComponent("BattleController").isAttackTarget())']]);
for(const name of ['applyTarget','__applyTarget','realAttack','_castMagicField','getAttackBeginPos'])original('Skill','Skill.EffectSkill.prototype.',name);
Object.setPrototypeOf(c.Skill.EffectSkill.prototype,c.Skill.SimpleSkill.prototype);
for(const name of ['realAttack','__realApplySkill','_applyNormalSkillTrigger'])original('SkillCaster','Skill.SkillCaster.prototype.',name);
original('MagicField','MagicField.MagicFieldAction.prototype.','checkTargetValid');
// Parser loses the receiver on incprop (MagicField bytecode 004ace..004ae3).
original('MagicField','MagicField.MagicFieldAction.prototype.','action',[['undefined.validTimes','this.validTimes']]);
original('MagicField','MagicField.MagicFieldAction.prototype.','calc');
original('BuffControll','Buff.BuffAction.prototype.','calc');
for(const name of ['castWantedGroundAndAirField','allowWantedTargetGroundAndAir']){
 const a=boot.indexOf(`        LocalNative.${name} = function`),b=boot.indexOf('\n        };',a)+11;vm.runInContext(boot.slice(a,b),c);
}
const buffs={},bm={handleBuff(id,camp,mir,cid){const b=new c.Buff.BuffAction();Object.assign(b,{config:c.data.buff_data[id],targetId:cid,casterId:mir.casterId,baseAtt:mir.baseAtt});buffs[++this.id]=b;return this.id;},id:0,
 runBuff:id=>buffs[id].calc()};
c.Buff.BuffManager={getInstance:()=>bm};
const fields={},fm={MagicFieldObjects:fields,id:0,handleMagicField(id,camp,mir,cid,x,y,dir){
 const field=new c.MagicField.MagicFieldAction();Object.assign(field,{config:c.data.magic_field[id],camp,casterMir:mir,targetId:cid,pos_x:x,pos_y:y,validTimes:0,
 getCenterPosition:()=>({x,y}),getAffectTargetList(){return this.checkTargetValid(target)?[target]:[];}});
 fields[++this.id]=field;return this.id;
},runMagicField:id=>fields[id].action()};
c.MagicField.MagicFieldManager={getInstance:()=>fm};
assert.equal(c.data.unit_main[11301].air_type,1,'Mother Dragon is airborne');
const sharedBefore=JSON.stringify(c.data.magic_field);
const outcomes=[];
function attack(id,air,fixed){
 hits=0;const victim={life:1000,isAttackTarget:()=>true,onHit(damage){hits++;this.life-=damage;}};
 target={cid:2,airType:air,battleType:4,faction:1,getOriginType:()=>113,isAlive:()=>true,getPosition:()=>({x:10,y:10}),getComponent:()=>victim};units[2]=target;
 const caster={cid:1,faction:2,getPosition:()=>({x:0,y:0}),getATKPosition:()=>({x:0,y:0})};units[1]=caster;
 const controller={master:caster,getCasterMir:()=>({casterId:1,baseAtt:100}),onSkillApplyed(){}};
 const skill=new c.Skill.EffectSkill();Object.assign(skill,{config:c.data.skill_data[id],id,cast_to:2,skill_type:1,
 master:controller,base_att_rate:0,att_val:0,skill_last_time:-1,castCD(){},applyCost(){},getExtraTargetList:()=>[]});
 skill.makeBullet=()=>({applyTarget(pos,t){skill.realAttack(t,null);}});
 controller.skillManager={getDefaultSkill:()=>skill};
 // The old version already widened the skill-level flags, but not the damage field.
 if(fixed)c.LocalNative.allowWantedTargetGroundAndAir({getComponent:()=>controller});
 else{skill.setTargetAirAvailable();skill.config.target_ground=1;}
 const cast=new c.Skill.SkillCaster();Object.assign(cast,{master:controller,skill,targetID:2,targetPos:{x:10,y:10},triggerSkills:[]});
 cast.realAttack();
 const outcome={id,air,fixed,hits,life: victim.life};outcomes.push(outcome);return outcome;
}
for(const id of [10801,10901]){
 assert.equal(c.data.magic_field[id].air_land,2);
 assert.equal(attack(id,1,false).life,1000,'old widening allows animation but damage field rejects air');
 assert.equal(attack(id,1,true).life,900,'new widening reaches original damage buff and HP callback');
 assert.equal(attack(id,0,true).life,900,'ground damage retained');
}
assert.equal(JSON.stringify(c.data.magic_field),sharedBefore,'all shared field configs unchanged');
for(const field of Object.values(fields))if(field.config.air_land===0){assert.notEqual(field.config,c.data.magic_field[10801]);assert.notEqual(field.config,c.data.magic_field[10901]);}
fs.writeFileSync(path.join(dir,'regression.json'),JSON.stringify({basis:'Original attack dispatch, field filter and damage buff; spatial candidate list and onHit HP controller are test doubles',outcomes},null,2)+'\n');
console.log('PASS: Pink/Mischief normal attack dispatch -> field -> original damage buff; old air HP 1000, fixed air/ground HP 900; shared tables isolated');
