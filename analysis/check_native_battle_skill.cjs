const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync(`${__dirname}/native_boot.js`,'utf8');
const ctx={LocalNative:{},data:{},Comp:{StaticBattleController:function(){}},
    UI:{SkillFlagController:function(){}},Skill:{SkillManager:function(){
        this.init=ids=>{this.ids=Array.from(ids);};this.setDefaultSkill=id=>{this.defaultSkill=id;};}},
    SKILL_TYPE_ACTIVE_SKILL:2,SKILL_CAST_TO_TARGET:1,SKILL_CAST_TO_POS:2,SKILL_CAST_TO_SELF:3,
    DA:{GETCGC:()=>({noUserOperSkill:false,ignoreOperSkill:false}),scheduleOnce:()=>1},
    G_TriggerManager:{invokeReleaseSkillTrigger(){}}};
vm.createContext(ctx);
for(const name of ['unit_battle','skill_data'])
    vm.runInContext(fs.readFileSync(`${__dirname}/../.local/shop-treasure/${name}.js`,'utf8'),ctx);
function range(text,start,end){const a=text.indexOf(start),b=text.indexOf(end,a+1);assert.ok(a>=0&&b>a);vm.runInContext(text.slice(a,b),ctx);}
range(src,'        LocalNative.prepareHeroBattleSkills = function','        LocalNative.collectAttackHerosForPve = function');
const battle=fs.readFileSync(`${__dirname}/../.local/battle-skill/BattleController.js`,'utf8');
range(battle,'Comp.StaticBattleController.prototype.initSkill=','Comp.StaticBattleController.prototype.refreshThreatSystemCheckNode=');
range(battle,'Comp.StaticBattleController.prototype.doCastActiveSkill=','Comp.StaticBattleController.prototype.castSkill=');
range(battle,'Comp.StaticBattleController.prototype.skillShouldAutoCast=','Comp.StaticBattleController.prototype.doCastActiveSkill=');
const ui=fs.readFileSync(`${__dirname}/../.local/battle-skill/HeroOprate.js`,'utf8');
range(ui,'UI.SkillFlagController.prototype.releaseByUser=','UI.SkillFlagController.prototype.onTouchBegan=');
range(ui,'UI.SkillFlagController.prototype.onTouchEnded=','UI.SkillFlagController.prototype.onTouchCancelled=');
const bc=new ctx.Comp.StaticBattleController();
bc.threatSystem={initSkill(){}};
const old={typeid:10401,unit_mutateid:0,skill_slots:[{sid:10000,lv:1}]};
const hero=ctx.LocalNative.prepareHeroBattleSkills(old);
bc.initSkill(hero.skills);
assert.deepEqual(bc.skillManager.ids,[10401,1000001]);
assert.equal(bc.skillManager.defaultSkill,10401,'normal attack stays first');
assert.equal(bc.canCastActiveSkill,true,'stock recognizes equipped active skill');
let shown,cast;
bc.master={isAlive:()=>true};
bc.operatePanel={showSkillFlag:(skill,target)=>{shown={skill,target};}};
bc.doCastActiveSkill(1000001,42,false);
assert.deepEqual(shown,{skill:1000001,target:42});
bc.onUserCastSkillToTarget=(target,skill)=>{cast={target,skill};};
const flag=new ctx.UI.SkillFlagController();
Object.assign(flag,{master:{battleController:bc},skillID:shown.skill,targetID:shown.target,
    config:ctx.data.skill_data[shown.skill],isShow:true,castingSkillHandles:{},_close(){this.isShow=false;}});
flag.onTouchEnded({});
assert.deepEqual(cast,{target:42,skill:1000001},'original touch path requests the carried skill');
assert.equal(flag.isShow,false);
// The original battle menu, rather than a per-hero default, controls manual/auto.
ctx.Game={MenuControllerBattle:function(){},GameControllerBattle:function(){}};
ctx.G_ButtonManager={callBase:()=>true};ctx.DA.debug=()=>{};
const menu=fs.readFileSync(`${__dirname}/disasm/MenuControllerBattle.decompiled.js`,'utf8');
range(menu,'Game.MenuControllerBattle.prototype.PressAutoAttack=',
    'Game.MenuControllerBattle.prototype.PressBackHome=');
const controller=fs.readFileSync(`${__dirname}/disasm/GameControllerBattle.decompiled.js`,'utf8');
function originalMethod(name){
    const marker=`Game.GameControllerBattle.prototype.${name}=`;
    const a=controller.indexOf(marker),comment=controller.indexOf('/* bytecode disassembly',a);
    assert.ok(a>=0&&comment>a);
    vm.runInContext(controller.slice(a,comment)+'};',ctx);
}
originalMethod('setAutoAttack');originalMethod('isAutoAttack');
ctx.G_StringManager={str:s=>s};
const logic=new ctx.Game.GameControllerBattle(),battleMenu=new ctx.Game.MenuControllerBattle();
let buttonState,automaticCasts=0,flagShows=0;
Object.assign(logic,{autoAttack:false,isNeedRecordReplay:()=>false,refreshOnceAutoAttack(){},menu:battleMenu});
Object.assign(battleMenu,{logic,auto_attack_effect_btn:{setOnAndOff:s=>{buttonState=s;}},auto_attack_label:{setString(){}}});
bc._realDoCastSkill=()=>{automaticCasts++;};
bc.operatePanel.showSkillFlag=()=>{flagShows++;};
bc.doCastActiveSkill(1000001,42,logic.isAutoAttack());
assert.equal(flagShows,1);assert.equal(automaticCasts,0,'manual waits for a click');
battleMenu.PressAutoAttack();
assert.equal(logic.isAutoAttack(),true);assert.equal(buttonState,true);
bc.doCastActiveSkill(1000001,42,logic.isAutoAttack());
assert.equal(automaticCasts,1);assert.equal(flagShows,1,'auto bypasses pending flag');
battleMenu.PressAutoAttack();
assert.equal(buttonState,false);
bc.doCastActiveSkill(1000001,42,logic.isAutoAttack());
assert.equal(flagShows,2);assert.equal(automaticCasts,1,'switching off restores manual');
const mutation={typeid:10401,unit_mutateid:7,skill_slots:[{sid:10000,lv:1}]};
ctx.LocalNative.prepareHeroBattleSkills(mutation);
assert.equal(mutation.skills[0],ctx.data.unit_battle[10401].skill_nums[7][0]);
ctx.GS_STAGE_BATTLE=2;ctx.GS_CURRENT_STAGE=2;ctx.BATTLE_FACTION_DEFENDER=2;
ctx.G_Player={faction:1};
ctx.Comp.HeroBattleController=function(){};
ctx.Comp.HeroBattleController.prototype=Object.create(ctx.Comp.StaticBattleController.prototype);
let panelCount=0, autoFlush=0, failPanel=false;
ctx.Comp.HeroBattleController.prototype.tryOnceAutoAttack=()=>{autoFlush++;};
ctx.Comp.HeroBattleController.prototype._delayedInit=()=>{panelCount++;};
const liveGc={inReplayMode:false,isAutoAttack:()=>logic.autoAttack,UnitChoiceList:[]};
ctx.DA.GETCGC=()=>liveGc;
ctx.LocalNative.writeStatus=()=>{};
ctx.UI.HeroOpratePanel=function(){
    panelCount++;this.init=()=>{if(failPanel)throw Error('panel failure');};this.destroy=()=>{};
    this.showSkillFlag=()=>{flagShows++;};
};
range(src,'        LocalNative.installManualHeroSkillGuard = function','        LocalNative.prepareHeroBattleSkills = function');
ctx.LocalNative.installManualHeroSkillGuard();
const guarded=new ctx.Comp.HeroBattleController();
guarded.master={faction:1,sid:'hero'};
guarded._realDoCastSkill=()=>{automaticCasts++;};
logic.autoAttack=false;
const castsBefore=automaticCasts,flagsBefore=flagShows;
guarded.doCastActiveSkill(1000001,42,true); // stale caller flag, missing panel
assert.equal(automaticCasts,castsBefore,'manual mode cannot fall through to automatic cast');
assert.equal(flagShows,flagsBefore+1);
assert.equal(panelCount,1);
guarded._delayedInit();assert.equal(panelCount,1,'no duplicate delayed panel');
guarded.tryOnceAutoAttack();assert.equal(autoFlush,0,'manual cannot flush queued flag');
logic.autoAttack=true;
guarded.doCastActiveSkill(1000001,42,false);
assert.equal(automaticCasts,castsBefore+1,'button state enables auto');
guarded.tryOnceAutoAttack();assert.equal(autoFlush,1);
logic.autoAttack=false;guarded.operatePanel=null;failPanel=true;
guarded.doCastActiveSkill(1000001,42,true);
assert.equal(automaticCasts,castsBefore+1,'failed panel must not release skill');
liveGc.inReplayMode=true;
guarded.doCastActiveSkill(1000001,42,true);
assert.equal(automaticCasts,castsBefore+2,'replay retains original behavior');
console.log('PASS: original skill/flag/click chain; manual missing-panel and stale-auto guards, toggle, panel failure, replay and mutation');
