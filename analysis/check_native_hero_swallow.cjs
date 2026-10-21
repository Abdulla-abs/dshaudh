const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const source = fs.readFileSync(process.env.NATIVE_BOOT_SOURCE || `${__dirname}/native_boot.js`, 'utf8');
const stock = fs.readFileSync(`${__dirname}/../.local/hero-swallow/HeroSwallow.js`, 'utf8');
const components = fs.readFileSync(`${__dirname}/../.local/hero-swallow/HeroComponents.js`, 'utf8');
const client = fs.readFileSync(`${__dirname}/disasm/ClientPlayer.decompiled.js`, 'utf8');
const ctx = {LocalNative: {}, GS_CURRENT_STAGE: 1, GS_STAGE_BUILD: 1};
vm.createContext(ctx);
for (const name of ['shopTransaction', 'handleHeroSwallow', 'handlePveBattleToHome', 'installCallServer']) {
    const start = source.indexOf(`        LocalNative.${name} = function`);
    const end = source.indexOf('\n        LocalNative.', start + 1);
    assert.ok(start >= 0 && end > start, name);
    vm.runInContext(source.slice(start, end), ctx);
}
vm.runInContext(`
var disk, failWrite, commits, answers, units, rm, exp, gift;
var ClientPlayer = function(){};
var UI = {HeroSwallow: function(){}};
var Comp = {ExpBar: function(){}, HeroGift: function(){}};
var G_UnitManager = {getUnitBySID: function(sid){return units[String(sid)];},
    getUnit: function(cid){return units[String(cid)];}, deleteUnit: function(cid){delete units[String(cid)];}};
var G_MainController = {setNotice: function(){}};
var DA = {makeSelector: function(){return null;}, sum: function(){return 0;}, scheduleOnce: function(){}};
var SND = {HERO_SWALLOW_ACTION: 1}, RES_TYPE_WOOD = 1;
var G_Player = new ClientPlayer();
G_Player.getComponent = function(name){
    if (name === 'ResourceManager') return rm;
    if (name === 'HeroManager') return {removeHero: function(){}, sort: function(){}};
    return null;
};
G_Player.rpc_c_swallow_hero_ans = function(reply){answers++; if (!commits) throw Error('ack before commit');};
Object.assign(LocalNative, {readRaw: function(){return JSON.parse(disk);},
    writeRaw: function(s){if(failWrite) throw Error('disk failure'); disk=JSON.stringify(s); commits++;},
    callLog: [], shopState: function(){}, copyAccountProgress: function(){}, writeStatus: function(){},
    snapshotBuildingRecord: function(){return {sid: 1, typeid: 20101, sto: {1: rm.wood}};}});
`, ctx);
function stockMethod(text, prefix, name) {
    const start = text.indexOf(`${prefix}.prototype.${name}=`);
    const end = text.indexOf('\n', text.indexOf('    };', start));
    assert.ok(start >= 0 && end > start, name);
    vm.runInContext(text.slice(start, end), ctx);
}
stockMethod(components, 'Comp.ExpBar', 'dump');
stockMethod(components, 'Comp.HeroGift', 'dump');
stockMethod(client, 'ClientPlayer', 'swallowHeros');
stockMethod(stock, 'UI.HeroSwallow', 'swallowHeros');
vm.runInContext('DA.UnitManager=function(){};', ctx);
const manager = fs.readFileSync(`${__dirname}/../.local/hero-swallow/UnitManager.js`, 'utf8');
for (const name of ['getUnit', 'getUnitBySID', 'deleteUnit']) stockMethod(manager, 'DA.UnitManager', name);
vm.runInContext(`
LocalNative.installCallServer(G_Player);
function reset(same) {
    commits=answers=0; failWrite=false;
    disk=JSON.stringify({level:{player:{diamond:10,spirit:5}, units:[{sid:1,typeid:20101,sto:{1:1000}}],
        heros:[{sid:'h1',lv:61,level:61,xp:2,gift:{lv:1,exp:0},skill_slots:[{sid:7001,lv:1}],eqp:[null]},
            {sid:22,lv:13}, {sid:'h3',lv:30}]}});
    exp={growthLv:61,growthXp:2,dump:Comp.ExpBar.prototype.dump,
        addGrowthXp:function(x){this.growthLv=62;this.growthXp=7;}};
    gift={gift:{lv:1,exp:0},dump:Comp.HeroGift.prototype.dump,
        addExp:function(x){this.gift={lv:2,exp:x-10};}};
    rm={Res:{3:10,4:5},wood:1000,useRes:function(price){this.wood-=price;return true;}};
    var attr={getAttack:function(){},getDefense:function(){},getMaxLife:function(){},getLeadership:function(){}};
    exp.getScore=function(){};
    units={'h1':{sid:'h1',getSid:function(){return this.sid;}, getComponent:function(name){
        return name==='ExpBar'?exp:name==='HeroGift'?gift:attr;}},
        '22':{sid:22,cid:'22',destroy:function(){}}, 'h3':{sid:'h3',cid:'h3',destroy:function(){}},
        '1':{getComponent:function(){return {};}}};
    // Reproduce the real missing-SID fallback, including destruction/unmapping.
    units.undefined=G_Player; G_Player.sid=1;
    G_UnitManager=new DA.UnitManager();
    G_UnitManager.units=units; G_UnitManager.UUIDtoCID={};
    G_UnitManager.sidToCid={local:{h1:'h1',22:'22',h3:'h3',1:'1'},other:{}};
    units['22'].destroy=function(){delete G_UnitManager.sidToCid.local[22];};
    return {swallowHeros:UI.HeroSwallow.prototype.swallowHeros,heroCid:'h1',swallowList:['22'],swallowCount:1,swallowPrice:100,swallowExp:100,
        swallowSameCnt:same?1:0,swallowGiftExp:17,playSound:function(){},lockSwallowButton:function(){},moveToLeft:function(){},
        floatTextManager:{setExValues:function(){},setPostValues:function(){}},
        rootNode:{animationManager:{runAnimations:function(){}}}};
}
var ui=reset(true);
UI.HeroSwallow.prototype.swallowHeros.call(ui);
`, ctx);
assert.equal(vm.runInContext('G_UnitManager.getUnitBySID(22).sid', ctx), 1,
    'stock lookup returns player after swallowed material is destroyed');
let saved = JSON.parse(ctx.disk).level;
assert.deepEqual(saved.heros.map(h => h.sid), ['h1', 'h3']);
assert.equal(saved.heros[0].lv, 62); assert.equal(saved.heros[0].xp, 7);
assert.deepEqual(saved.heros[0].gift, {lv:2,exp:7});
assert.deepEqual(saved.heros[0].skill_slots, [{sid:7001,lv:1}]);
assert.deepEqual(saved.heros[0].eqp, [null]);
assert.equal(saved.units[0].sto[1], 900); assert.equal(ctx.answers, 1);
// Use the real campaign return adapter, which re-reads the disk roster.
ctx.GS_CURRENT_STAGE = 2;
ctx.LocalNative.pveSession = {stage: 1, completed: true};
ctx.LocalNative.ensureAvailableStages = () => {};
ctx.LocalNative.scheduleOnRoot = fn => fn();
let homePayload;
ctx.G_Player.rpc_c_battle_to_home = level => {homePayload = JSON.parse(JSON.stringify(level));};
assert.equal(ctx.LocalNative.handlePveBattleToHome(ctx.G_Player, {}), true);
assert.deepEqual(homePayload.heros, saved.heros, 'campaign return keeps consumed roster and gift');
assert.deepEqual(JSON.parse(ctx.disk).level.heros, saved.heros, 'restart uses that same saved roster');
ctx.GS_CURRENT_STAGE = 1;
const committed = ctx.disk;
ctx.rm.wood = 400;
assert.equal(ctx.LocalNative.handleHeroSwallow(ctx.G_Player, {swallower:'h1',swallow_list:[22]}), true);
assert.equal(ctx.disk, committed, 'duplicate request is idempotent');
vm.runInContext('ui=reset(false); failWrite=true; UI.HeroSwallow.prototype.swallowHeros.call(ui);', ctx);
assert.equal(ctx.commits, 0); assert.equal(ctx.answers, 0);
assert.equal(JSON.parse(ctx.disk).level.heros.length, 3, 'failed write preserves disk');
ctx.failWrite=false;
assert.equal(ctx.LocalNative.handleHeroSwallow(ctx.G_Player, {swallower:'h1',swallow_list:[22]}), true);
assert.equal(JSON.parse(ctx.disk).level.heros[0].gift.exp, 0, 'unrelated species keeps gift');
ctx.GS_CURRENT_STAGE=2;
assert.equal(ctx.LocalNative.handleHeroSwallow(ctx.G_Player, {swallower:'h1',swallow_list:['h3']}), false);
ctx.GS_CURRENT_STAGE=1;
for (const ids of [['h1'], ['h3','h3'], ['missing'], []])
    assert.equal(ctx.LocalNative.handleHeroSwallow(ctx.G_Player, {swallower:'h1',swallow_list:ids}), false);
assert.equal(ctx.commits, 1);
saved=JSON.parse(ctx.disk).level;
assert.equal(saved.heros.length, 2, 'battle return and relog consume the committed roster');
console.log('PASS: stock swallow/RPC and UnitManager player fallback, real PVE return payload, roster/XP/gift/wallet, duplicate, failure/retry and battle guard');
