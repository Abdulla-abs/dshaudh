const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
const local = `${__dirname}/../.local/hero-dismiss/`;
const ctx = {LocalNative: {}, data: {}, GS_CURRENT_STAGE: 1, GS_STAGE_BUILD: 1};
vm.createContext(ctx);
for (const table of ['unit_main', 'unit_battle', 'hero_lv_data', 'input_event_client', 'resource_input', 'item_input', 'item'])
    vm.runInContext(fs.readFileSync(`${local}${table}.js`, 'utf8'), ctx);
for (const name of ['shopState', 'shopTransaction', 'shopAddItem', 'shopRollItemEvent', 'shopPick',
    'questPlayerLevel', 'questScaledResAmount', 'collectQuestPutinRewards', 'prepareHeroDismiss',
    'installHeroDismiss', 'handleHeroDismiss', 'installCallServer', 'handlePveBattleToHome']) {
    const a = source.indexOf(`        LocalNative.${name} = function`);
    const b = source.indexOf('\n        LocalNative.', a + 1);
    assert.ok(a >= 0 && b > a, name); vm.runInContext(source.slice(a, b), ctx);
}
function stock(file, prefix, name) {
    const text = fs.readFileSync(local + file, 'utf8');
    const a = text.indexOf(`${prefix}.prototype.${name}=`);
    const b = text.indexOf('\n', text.indexOf('    };', a));
    assert.ok(a >= 0 && b > a); vm.runInContext(text.slice(a, b), ctx);
}
vm.runInContext(`
var UI={HeroItem:function(){},Award:function(){}};
var ClientPlayer=function(){};
var failWrite=false, commits=0, answers=0, duplicateGrants=0, disk, live, ui, rm, pm, allowed=true;
var notices=[];
var G_MainController={setNotice:function(x){notices.push(x);}};
var G_UnitManager={getUnitBySID:function(sid){return live && String(live.sid)===String(sid) ? live : {sid:'player'};}};
var G_EventManager={inputAward:function(){duplicateGrants++;},getShownAwards:function(a){return a;}};
var award=new UI.Award(); award.afterMergeInputs=function(a){answers++;};
var G_UIManager={get_ui:function(){return award;},open_ui:function(){}};
UI.Award.UIID=1;
var hm={canSellHero:function(){return allowed;},removeHero:function(){live=null;}};
var G_Player=new ClientPlayer();
G_Player.getComponent=function(n){return n==='ResourceManager'?rm:n==='PackageManager'?pm:n==='HeroManager'?hm:null;};
G_Player.level=10;
Object.assign(LocalNative,{
    callLog:[],
    readRaw:function(){return JSON.parse(disk);},
    writeRaw:function(s){if(failWrite)throw Error('disk failure');disk=JSON.stringify(s);commits++;},
    copyAccountProgress:function(){},writeStatus:function(){},
    shopSync:function(p,l){rm.Res[4]=l.player.spirit;pm.package=JSON.parse(JSON.stringify(l.player.package));},
    ensureAvailableStages:function(){}, scheduleOnRoot:function(fn){fn();}
});
function reset(typeid, lv, spirit, rune) {
    allowed=true;failWrite=false;commits=answers=duplicateGrants=0;notices=[];
    GS_CURRENT_STAGE=GS_STAGE_BUILD;
    var pkg={}; ['material','based_prop','advanced_prop','formula'].forEach(function(n){pkg[n]={capacity:100,item_dict:{}};});
    rm={Res:{3:10,4:7}};pm={package:pkg};
    disk=JSON.stringify({level:{player:{diamond:10,spirit:7,package:pkg},units:[],heros:[
        {sid:'h1',typeid:typeid,lv:1,eqp:[null]}, {sid:'keep',typeid:11302,lv:30,skill_slots:[{sid:1,lv:2}]}]}});
    var exp={growthLv:lv,spirit:spirit};
    live={sid:'h1',cid:123,typeid:typeid,getSid:function(){return this.sid;},
        getComponent:function(n){return n==='ExpBar'?exp:n==='HeroEquipment'?{eqp:rune?[rune]:[null]}:null;}};
    var master={delSelectItem:function(){},delHeroItem:function(){}};
    ui=new UI.HeroItem();ui.hero=live;ui.closeItem=function(){};ui.getHeroMaster=function(){return master;};
    ui.clearItem=function(){this.hero=null;};
    return ui;
}
`, ctx);
stock('Hero.js', 'UI.HeroItem', 'dismissHero');
stock('Award.js', 'UI.Award', 'showAward');
// ClientPlayer source is already available from the original package.
const client = fs.readFileSync(`${__dirname}/disasm/ClientPlayer.decompiled.js`, 'utf8');
const a = client.indexOf('ClientPlayer.prototype.rpc_c_after_dismiss_hero=');
const b = client.indexOf('\n', client.indexOf('    };', a));
vm.runInContext(client.slice(a, b), ctx);
ctx.LocalNative.installHeroDismiss(); ctx.LocalNative.installCallServer(ctx.G_Player);
function run(code) { return vm.runInContext(code, ctx); }
const rune = {oid: 'r1', typeid: 7031, num: 1, attrs: [[7, 99]], marker: 'preserve'};
run(`reset(10402,61,12,${JSON.stringify(rune)}); ui.dismissHero();`);
let level = JSON.parse(ctx.disk).level;
assert.equal(ctx.commits, 1); assert.equal(ctx.answers, 1); assert.equal(ctx.duplicateGrants, 0);
assert.equal(level.heros.length, 1); assert.equal(level.heros[0].sid, 'keep');
assert.equal(level.player.spirit, 24, '7 wallet + 5 configured promotion refund + 12 live spirit');
assert.equal(ctx.rm.Res[4], 24);
const returned = level.player.package.advanced_prop.item_dict.r1;
assert.deepEqual(returned.attrs, rune.attrs); assert.equal(returned.marker, 'preserve');
const coin = Object.values(level.player.package.based_prop.item_dict).find(x => x.typeid === 1123) ||
    Object.values(level.player.package.material.item_dict).find(x => x.typeid === 1123);
assert.equal(coin.num, 200);
const committed = ctx.disk;
assert.equal(ctx.LocalNative.handleHeroDismiss(ctx.G_Player, {hero_id:'h1'}), true);
assert.equal(ctx.disk, committed); assert.equal(ctx.commits, 1); assert.equal(ctx.answers, 1);
assert.equal(ctx.LocalNative.handleHeroDismiss(ctx.G_Player, {hero_id:'unknown'}), false);
// The real campaign return re-reads the committed roster rather than resurrecting it.
ctx.GS_CURRENT_STAGE = 2; ctx.LocalNative.pveSession = {stage:1,completed:true};
let home;
ctx.G_Player.rpc_c_battle_to_home = x => {home = JSON.parse(JSON.stringify(x));};
assert.equal(ctx.LocalNative.handlePveBattleToHome(ctx.G_Player, {}), true);
assert.deepEqual(home.heros, level.heros); assert.deepEqual(JSON.parse(ctx.disk).level.heros, level.heros);
run('reset(10402,1,0,null); allowed=false; ui.dismissHero();');
assert.equal(ctx.commits, 0); assert.ok(ctx.live, 'stock roster limit remains effective');
run(`reset(10402,1,0,${JSON.stringify(rune)}); pm.package.advanced_prop.capacity=0; ui.dismissHero();`);
assert.equal(ctx.commits, 0); assert.ok(ctx.live, 'full rune bag is checked before stock removes hero');
run('reset(10402,1,0,null); pm.package.based_prop.capacity=0; pm.package.material.capacity=0; ui.dismissHero();');
assert.equal(ctx.commits, 0); assert.ok(ctx.live, 'full coin bag prevents partial deletion');
run('reset(10402,1,0,null); failWrite=true; ui.dismissHero();');
assert.equal(ctx.commits, 0); assert.equal(ctx.answers, 0);
assert.equal(JSON.parse(ctx.disk).level.heros.length, 2, 'failed disk write retains hero and wallet');
assert.equal(JSON.parse(ctx.disk).level.player.spirit, 7);
run('reset(10402,1,0,null); GS_CURRENT_STAGE=2; ui.dismissHero();');
assert.equal(ctx.commits, 0); assert.ok(ctx.live);
run('reset(10402,1,0,null); var originalInput=G_EventManager.inputAward; var merge=award.afterMergeInputs; award.afterMergeInputs=function(){throw Error("display failure");}; ui.dismissHero(); award.afterMergeInputs=merge;');
assert.equal(ctx.commits, 1, 'display failure cannot roll back a committed deletion');
assert.equal(JSON.parse(ctx.disk).level.heros.length, 1);
assert.equal(run('G_EventManager.inputAward === originalInput'), true, 'always restore the original grant method');
// Every dismissible hero in the original tables must resolve supported rewards.
let checked = 0;
for (const [id, cfg] of Object.entries(ctx.data.unit_battle)) {
    if (!cfg.dismiss_resource_num || !ctx.data.unit_main[id]?.is_hero) continue;
    run(`reset(${Number(id)},70,3,null);`);
    const pending = ctx.LocalNative.prepareHeroDismiss(ctx.G_Player, ctx.live);
    assert.equal(pending.store.level.heros.length, 1);
    const expected = 7 + Math.floor((Number(ctx.data.unit_main[id].total_spirit) || 0) + 3);
    const event = ctx.data.input_event_client[cfg.dismiss_resource_num];
    const res = (event.putin_event_resource || []).reduce((sum, rid) => sum + ctx.data.resource_input[rid].putin_num, 0);
    assert.equal(pending.store.level.player.spirit, expected + res);
    checked++;
}
console.log('PASS: stock dismiss -> RPC -> Award, saved roster/rewards/rune attributes, duplicate, capacity/write failures, campaign return; configured heroes:', checked);
