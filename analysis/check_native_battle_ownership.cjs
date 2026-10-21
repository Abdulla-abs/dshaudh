const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync(`${__dirname}/native_boot.js`,'utf8');
const stock=fs.readFileSync(`${__dirname}/../.local/battle-skill/BattleController.js`,'utf8');
let panels=0,casts=0,flags=0;
const gc={inReplayMode:false,level_data:{localNativePve:true},isAutoAttack:()=>false,UnitChoiceList:[]};
const self={nickname:'LocalRookie',faction:1},enemy={nickname:'Enemy',faction:2};
const ctx={LocalNative:{writeStatus(){}},G_Player:self,
    BATTLE_FACTION_ATTACKER:1,BATTLE_FACTION_DEFENDER:2,GS_CURRENT_STAGE:2,GS_STAGE_BATTLE:2,
    G_PlayerManager:{stagePlayers:{1:self,2:enemy}},DA:{GETCGC:()=>gc},
    Comp:{HeroBattleController:function(){},StaticBattleController:function(){}},
    UI:{HeroOpratePanel:function(){panels++;this.init=()=>{};this.showSkillFlag=()=>flags++;}}};
ctx.Comp.HeroBattleController.prototype=Object.create(ctx.Comp.StaticBattleController.prototype);
vm.createContext(ctx);
function range(text,start,end){const a=text.indexOf(start),b=text.indexOf(end,a+1);
    assert.ok(a>=0&&b>a,start);vm.runInContext(text.slice(a,b),ctx);}
range(src,'        LocalNative.bindBattleClientFaction = function','        LocalNative.withBattleClient = function');
ctx.LocalNative.resolveBattleClient=f=>ctx.G_PlayerManager.stagePlayers[f];
range(stock,'Comp.StaticBattleController.prototype.doCastActiveSkill=',
    'Comp.StaticBattleController.prototype.castSkill=');
range(stock,'Comp.HeroBattleController.prototype._delayedInit=',
    'Comp.HeroBattleController.prototype.sendLifeToServer=');
ctx.Comp.HeroBattleController.prototype.tryOnceAutoAttack=()=>{};
range(src,'        LocalNative.installManualHeroSkillGuard = function',
    '        LocalNative.prepareHeroBattleSkills = function');
ctx.LocalNative.installManualHeroSkillGuard();
function hero(faction){const h=new ctx.Comp.HeroBattleController();
    h.master={sid:`hero-${faction}`,faction};h._realDoCastSkill=()=>casts++;
    h.skillShouldAutoCast=()=>true;return h;}
for(let retry=0;retry<5;retry++){
    const clients=ctx.LocalNative.ensureBattleClients();
    assert.equal(clients.attacker,self);assert.equal(clients.defender,enemy);
    assert.equal(self.faction,1);assert.equal(enemy.faction,2);
}
const defender=hero(2),attacker=hero(1);
defender._delayedInit();assert.equal(panels,0,'stock creates no touch/skill panel for enemy');
defender.doCastActiveSkill(14801,42,false);
assert.equal(casts,1,'enemy casts automatically even with player auto disabled');
assert.equal(flags,0,'enemy never waits for user skill click');
attacker._delayedInit();assert.equal(panels,1,'player retains stock operation panel');
attacker.doCastActiveSkill(14801,43,true);
assert.equal(flags,1);assert.equal(casts,1,'player manual mode still waits for click');
gc.isAutoAttack=()=>true;attacker.doCastActiveSkill(14801,43,true);
assert.equal(casts,2,'player automatic mode still works');
// A later repair must also recover from the previous adapter's swapped slots.
ctx.G_PlayerManager.stagePlayers={1:enemy,2:self};self.faction=2;enemy.faction=1;
ctx.LocalNative.ensureBattleClients();assert.equal(self.faction,1);assert.equal(enemy.faction,2);
gc.level_data={localNativeRaid:true};gc.inReplayMode=true;
let clients=ctx.LocalNative.ensureBattleClients();
assert.equal(clients.defender,self);assert.equal(clients.attacker,enemy);
assert.equal(self.faction,2,'raid retains defending player');
gc.level_data={localNativePve:true};gc.inReplayMode=false;
clients=ctx.LocalNative.ensureBattleClients();assert.equal(clients.attacker,self);
assert.equal(self.faction,1,'next campaign restores attacking player');
console.log('PASS: stock hero panel/skill dispatch; repeated binding, swapped slots, raid-to-PVE, player manual/auto');
