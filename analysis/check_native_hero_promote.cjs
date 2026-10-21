const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(`${__dirname}/native_boot.js`,'utf8');
let disk, failWrite=false, callbacks=0, unit, rm;
const ctx={LocalNative:{},data:{},GS_CURRENT_STAGE:1,GS_STAGE_BUILD:1,
    G_UnitManager:{getUnitBySID:()=>unit},G_MainController:{setNotice(){}}};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(`${__dirname}/../.local/shop-treasure/unit_main.js`,'utf8'),ctx);
const n=ctx.LocalNative;
Object.assign(n,{readRaw:()=>JSON.parse(disk),writeRaw:s=>{
    if(failWrite)throw Error('disk failure');disk=JSON.stringify(s);},writeStatus(){},
    copyAccountProgress(){},ensureHeroSkill:h=>assert.ok(h.skill_slots.length),
    syncSavedHomeWallet:l=>{rm.Res[4]=l.player.spirit;rm.wood=l.units[0].sto[1];},
    snapshotBuildingRecord:u=>({sid:1,typeid:20101,sto:{1:rm.wood}})});
for(const [name,next] of [['shopTransaction','shopSync'],['repairPromotionCounter','handleHeroPromote'],['handleHeroPromote','handlePveMapEgg']]){
    const a=source.indexOf(`        LocalNative.${name} = function`),b=source.indexOf(`        LocalNative.${next} = function`,a+1);
    assert.ok(a>=0&&b>a);vm.runInContext(source.slice(a,b),ctx);
}
n.shopState=()=>({});
const unitSource=fs.readFileSync(`${__dirname}/disasm/Unit.decompiled.js`,'utf8');
ctx.Unit=function(){};
ctx.G_Player={getComponent:()=>({updateCurrent(){}})};
vm.runInContext(unitSource.slice(unitSource.indexOf('Unit.prototype.server_promote='),
    unitSource.indexOf('Unit.prototype.getBuildFxOffset=')),ctx);
function reset(){
    failWrite=false;callbacks=0;
    disk=JSON.stringify({level:{player:{spirit:240,diamond:194765,rookie_promote_hero:0},
        units:[{sid:1,typeid:20101,sto:{1:13464}}],
        heros:[{sid:'hero',typeid:11302,state:1,aidx:0,lv:1,xp:17,
            skill_slots:[{sid:7093,lv:1}],eqp:{keep:1}}]}});
    rm={Res:{3:194765,4:210},wood:13265}; // stock button has paid 199 wood and 30 spirit
    const exp={promoting:true,growthLv:1,growthXp:17,afterPromote(){this.promoting=false;}};
    unit=new ctx.Unit();
    Object.assign(unit,{typeid:11302,getComponent:n=>n==='ExpBar'?exp:n==='BuildingBuilder'?{}:null,
        dumpParams:()=>({typeid:11302,lv:1,xp:17,unit_mutateid:2,skill_slots:[{sid:7093,lv:1}]}),
        destroyComponents(){},destroyRootNode(){},initByServer(h){
            this.typeid=h.typeid;this.componentList={ExpBar:exp};this.record=h;}});
    const recorder={achieve_raw:{}};
    return {getComponent:n=>n==='ResourceManager'?rm:n==='AchievementRecorder'?recorder:null,rpc_c_promote:d=>{
        assert.equal(JSON.parse(disk).level.heros[0].typeid,11303,'saved before callback');
        assert.equal(recorder.achieve_raw.hero_reborn_times,1,'tutorial counter available before callback');
        callbacks++;unit.server_promote(d);}};
}
let p=reset();
assert.equal(n.handleHeroPromote(p,{uid:'hero'}),true);
assert.equal(unit.typeid,11303,'original server_promote applies new rank');
let saved=JSON.parse(disk).level;
assert.equal(saved.player.spirit,210,'no double charge');
assert.equal(saved.units[0].sto[1],13265);
assert.equal(saved.heros[0].xp,17);
assert.equal(saved.heros[0].unit_mutateid,2);
assert.equal(saved.heros[0].skill_slots[0].sid,7093);
assert.equal(saved.heros[0].eqp.keep,1);
assert.equal(saved.player.achieve_raw.hero_reborn_times,1);
assert.equal(n.handleHeroPromote(p,{uid:'hero'}),false,'duplicate callback ignored');
assert.equal(callbacks,1);
assert.equal(JSON.parse(JSON.stringify(saved)).heros[0].typeid,11303,'restart record');
p=reset();failWrite=true;
assert.equal(n.handleHeroPromote(p,{uid:'hero'}),false);
assert.equal(JSON.parse(disk).level.heros[0].typeid,11302);
assert.equal(rm.Res[4],240);assert.equal(rm.wood,13464);
assert.equal(unit.getComponent('ExpBar').promoting,false,'failure permits retry');
assert.equal(callbacks,0);
assert.equal(JSON.parse(disk).level.player.achieve_raw,undefined,'failed write cannot count promotion');
p=reset();unit.typeid=99999;
assert.equal(n.handleHeroPromote(p,{uid:'hero'}),false,'invalid target rolls back');
const legacy={player:{achieve_raw:{hero_times:8}},heros:[{sid:'hero',typeid:11305}]};
n.legacyPromotionLog=[
    {step:'hero-promote-saved',sid:'hero',typeid:11303,t:1},
    {step:'hero-promote-saved',sid:'hero',typeid:11304,t:2},
    {step:'hero-promote-saved',sid:'hero',typeid:11305,t:3},
    {step:'hero-promote-saved',sid:'hero',typeid:11305,t:3},
    {step:'hero-promote-saved',sid:'other-account',typeid:11305,t:4}];
n.repairPromotionCounter(legacy);
assert.equal(legacy.player.achieve_raw.hero_reborn_times,3,'recover proven promotions only');
assert.equal(legacy.player.achieve_raw.hero_times,8);
n.repairPromotionCounter(legacy);
assert.equal(legacy.player.achieve_raw.hero_reborn_times,3,'repair idempotent');
const noEvidence={player:{},heros:[{sid:'hero',typeid:11305}]};
n.legacyPromotionLog=[];
n.repairPromotionCounter(noEvidence);
assert.equal(noEvidence.player.achieve_raw.hero_reborn_times,0,'rank alone is not promotion evidence');
console.log('PASS: original promote receipt, 11302 -> 11303, pre-paid wallet, progression/skills/equipment, duplicate and failure rollback');
