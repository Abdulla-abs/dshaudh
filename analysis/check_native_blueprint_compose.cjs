const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
const local = `${__dirname}/../.local/blueprint-compose/`;
const ctx = {LocalNative: {}, data: {}, GS_CURRENT_STAGE: 1, GS_STAGE_BUILD: 1};
vm.createContext(ctx);
for (const name of ['item', 'item_input', 'input_event_client'])
    vm.runInContext(fs.readFileSync(`${local}${name}.js`, 'utf8'), ctx);
for (const name of ['shopState', 'shopTransaction', 'shopSync', 'shopAddItem', 'shopRollItemEvent',
    'shopPick', 'handleComposeBlueprint', 'runShopRequest', 'unlockCompose', 'installCallServer']) {
    const a = source.indexOf(`        LocalNative.${name} = function`), b = source.indexOf('\n        LocalNative.', a + 1);
    assert.ok(a >= 0 && b > a, name); vm.runInContext(source.slice(a, b), ctx);
}
vm.runInContext(`
var Comp={PackageManager:function(){}},ClientPlayer=function(){};
var UI={AlchemyCompound:function(){},AlchemyComposeMid:function(){},AlchemyInterface:{UIID:2}};
UI.AlchemyCompound.UIID=1;UI.AlchemyCompound.Equipment=2;UI.AlchemyCompound.Skillbook=3;
UI.AlchemyCompound.Blueprint2=4;UI.AlchemyCompound.Blueprint3=5;
var BLUEPRINT_REBORN_TYPE_2=2,BLUEPRINT_REBORN_TYPE_3=3,ALCHEMY_TYPE_FORMULA=3;
var ALCHEMY_SECOND_TYPE_BLUEPRINT=13,INPUT_TYPE_ITEM=19;
var pm,ui,disk,failWrite,commits,answers,effects,refreshes,shown,throwDisplay,roll=0;
var jobs=[],notices=[],lastResult;
var G_MainController={setNotice:function(s){notices.push(s);}};
var G_SoundManager={playSound:function(){}},SND={ITEM_COMPOSE:1};
var G_UnitManager={getUnitBySID:function(){return null;}};
var G_UIManager={isUIOpen:function(){return true;},get_ui:function(id){return id===1?ui:{refreshCurrentUI:function(){refreshes++;}};}};
var G_Player=new ClientPlayer();
G_Player.getComponent=function(n){return n==='PackageManager'?pm:n==='ResourceManager'?{Res:{3:100,4:50}}:null;};
Object.assign(LocalNative,{callLog:[],readRaw:function(){return JSON.parse(disk);},
    writeRaw:function(s){if(failWrite)throw Error('disk failure');disk=JSON.stringify(s);commits++;},
    copyAccountProgress:function(){},syncSavedHomeWallet:function(){},writeStatus:function(){},
    unlockHeroFeedIfNeeded:function(){},scheduleOnRoot:function(fn){jobs.push(fn);return true;}});
Math.random=function(){return roll;};
var G_EventManager={inputAward:function(ans){
    answers++;if(throwDisplay)throw Error('display failure');
    if(!commits)throw Error('reply before commit');
    for(var i=0;i<ans[0][1].length;i++){
        var item=ans[0][1][i],bag=pm.package.formula.item_dict;
        bag[item.oid]=JSON.parse(JSON.stringify(item));
    }
}};
`, ctx);
function stock(text, prefix, name) {
    const a = text.indexOf(`${prefix}.prototype.${name}=`), b = text.indexOf('\n', text.indexOf('    };', a));
    assert.ok(a >= 0 && b > a, name); vm.runInContext(text.slice(a, b), ctx);
}
const components = fs.readFileSync(`${__dirname}/disasm/Components.decompiled.js`, 'utf8');
for (const name of ['getBlueprintRebornType', 'composeBlueprint', 'composeBlueprintAns']) stock(components, 'Comp.PackageManager', name);
stock(fs.readFileSync(`${__dirname}/disasm/ClientPlayer.decompiled.js`, 'utf8'), 'ClientPlayer', 'rpc_c_compose_blueprint_ans');
const packageSource = fs.readFileSync(local + 'Package.js', 'utf8');
for (const name of ['onPressOK', 'afterReceComposeResult']) stock(packageSource, 'UI.AlchemyCompound', name);
stock(packageSource, 'UI.AlchemyComposeMid', 'setComposedBlueprint');
ctx.LocalNative.installCallServer(ctx.G_Player);
vm.runInContext(`
function reset(types) {
    GS_CURRENT_STAGE=1;failWrite=throwDisplay=false;commits=answers=effects=refreshes=0;
    jobs=[];notices=[];shown=null;
    pm=new Comp.PackageManager();pm.package={};
    ['material','based_prop','advanced_prop','formula'].forEach(function(n){pm.package[n]={capacity:100,item_dict:{}};});
    for(var i=0;i<types.length;i++)pm.package.formula.item_dict['b'+i]={oid:'b'+i,typeid:types[i],num:1};
    pm.getItem=function(pkgid,oid){return this.package.formula.item_dict[oid];};
    pm.init=function(p){this.package=JSON.parse(JSON.stringify(p.package));};
    pm.checkPropPiecePoint=pm.isContainItemNum=pm.checkAlchemyLevel=pm.checkPlayerLevel=function(){return true;};
    ui=new UI.AlchemyCompound();ui.product=types[0]<4021?4041:4042;
    ui.choiceType=types[0]<4021?4:5;ui.blueprints=Object.keys(pm.package.formula.item_dict);ui.mtr_list=[{},{},{}];
    ui.playing=false;ui.composeButtonNode={button:{setEnabled:function(v){ui.enabled=v;}}};
    ui.refreshButtonGray=function(){this.enabled=true;};
    ui.midPanelCtr=new UI.AlchemyComposeMid();
    ui.midPanelCtr.centerItemIcon={setAward:function(a){shown=a[1].typeid;},setGray:function(){}};
    ui.midPanelCtr.showComposeFx=function(){effects++;};
    disk=JSON.stringify({receipt:'keep',level:{player:{package:pm.package,diamond:100,spirit:50},units:[],heros:[{sid:'keep'}]}});
}
function flush(){while(jobs.length)jobs.shift()();}
`, ctx);
const run = s => vm.runInContext(s, ctx), n = ctx.LocalNative;
const count = id => Object.values(ctx.pm.package.formula.item_dict).filter(x => x.typeid === id).reduce((s, x) => s + x.num, 0);
run('reset([4001,4002,4003,4004,4005]); ui.onPressOK();');
assert.equal(ctx.ui.playing, true); assert.equal(ctx.commits, 0, 'reply must run after stock button sets playing');
run('flush();');
assert.equal(ctx.commits, 1); assert.equal(ctx.answers, 1); assert.equal(ctx.effects, 1); assert.equal(ctx.refreshes, 1);
assert.equal(ctx.shown, 4021); assert.equal(count(4001), 0); assert.equal(count(4021), 1);
assert.equal(JSON.parse(ctx.disk).receipt, 'keep'); assert.equal(JSON.parse(ctx.disk).level.heros[0].sid, 'keep');
assert.deepEqual(JSON.parse(JSON.stringify(ctx.pm.package)), JSON.parse(ctx.disk).level.player.package);
const saved = ctx.disk;
assert.equal(n.runShopRequest(ctx.G_Player, 'rpc_s_compose_blueprint', {blueprints:[4001,4002,4003,4004,4005],reborn_type:2}), false);
assert.equal(ctx.disk, saved, 'stale replay cannot grant without materials');
// Weighted boundaries use original table weights for five second-stage and two third-stage inputs.
let boundaries = 0;
for (const tier of [2, 3]) {
    const pool = ctx.data.item_input[tier === 2 ? 12801 : 12802].item_random_chance;
    const total = pool.reduce((s, x) => s + x[1], 0); let before = 0;
    for (const [target, weight] of pool) {
        for (const point of [before, before + weight - 0.000001]) {
            ctx.roll = point / total;
            run(tier === 2 ? 'reset([4001,4001,4001,4001,4001]); ui.onPressOK(); flush();' : 'reset([4021,4021]); ui.onPressOK(); flush();');
            assert.equal(ctx.shown, target); assert.equal(count(target), 1); assert.equal(ctx.commits, 1);
            boundaries++;
        }
        before += weight;
    }
}
for (const params of [
    {blueprints:[4001],reborn_type:2}, {blueprints:[4001,4001,4001,4001,4021],reborn_type:2},
    {blueprints:[4041,4001,4001,4001,4001],reborn_type:2}, {blueprints:[4001,4001],reborn_type:4},
    {blueprints:[4001,4001,4001,4001,4001],reborn_type:2}
]) {
    run('reset([4001,4002,4003,4004,4005]);'); const before = ctx.disk;
    assert.equal(n.runShopRequest(ctx.G_Player, 'rpc_s_compose_blueprint', params), false);
    assert.equal(ctx.disk, before); assert.equal(ctx.answers, 0); assert.equal(ctx.ui.enabled, true);
}
run('reset([4001,4002,4003,4004,4005]); failWrite=true; ui.onPressOK(); flush();');
assert.equal(ctx.commits, 0); assert.equal(ctx.answers, 0); assert.equal(count(4001), 1);
assert.equal(ctx.ui.playing, false); assert.equal(ctx.ui.enabled, true);
run('reset([4001,4002,4003,4004,4005]); throwDisplay=true; ui.onPressOK(); flush();');
assert.equal(ctx.commits, 1); assert.deepEqual(JSON.parse(JSON.stringify(ctx.pm.package)), JSON.parse(ctx.disk).level.player.package);
run('reset([4001,4002,4003,4004,4005]); pm.package.formula.capacity=5; ui.onPressOK(); flush();');
assert.equal(ctx.commits, 1, 'consumed slots make room for result in a full blueprint bag');
run('reset([4001,4002,4003,4004,4005]); GS_CURRENT_STAGE=2; ui.onPressOK(); flush();');
assert.equal(ctx.commits, 0); assert.equal(ctx.answers, 0);
console.log('PASS: stock button -> type-ID RPC -> original weighted reward -> stock result, persistence, duplicate types/requests, invalid inputs, failure/unlock and full bag; pool boundaries:', boundaries);
