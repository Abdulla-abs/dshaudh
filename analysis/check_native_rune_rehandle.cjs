const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const src = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8'), local = `${__dirname}/../.local/rune-rehandle/`;
const ctx = {LocalNative: {}, data: {}, GS_CURRENT_STAGE: 1, GS_STAGE_BUILD: 1};
vm.createContext(ctx);
for (const name of ['item', 'equipment_attribute']) vm.runInContext(fs.readFileSync(local + name + '.js', 'utf8'), ctx);
for (const name of ['saveLevel', 'shopState', 'shopTransaction', 'shopSync', 'shopAddItem', 'snapshotHeroEquipment', 'grantPveLoot',
    'runeRehandleTarget', 'showRuneRehandle', 'handleRuneRehandle', 'finishRuneRehandle', 'installRuneRehandle',
    'runShopRequest', 'installCallServer']) {
    const a = src.indexOf(`        LocalNative.${name} = function`), b = src.indexOf('\n        LocalNative.', a + 1);
    assert.ok(a >= 0 && b > a, name); vm.runInContext(src.slice(a, b), ctx);
}
vm.runInContext(`
var UI={EquipmentRehandle:function(){},EquipRehandleResult:function(){},Hero:{UIID:3},AlchemyInterface:{UIID:4},Award:function(){}};
UI.EquipRehandleResult.UIID=1;UI.Award.UIID=5;
var ClientPlayer=function(){},Comp={HeroEquipment:function(){}};
var disk,pm,rm,hero,eq,result,recast,wood,failWrite,commits,answers,closes,inputs,notices,queue;
var DA={makeSelector:function(){return null;}};
var G_MainController={setNotice:function(x){notices.push(x);}};
var G_EventManager={inputAward:function(){inputs++;},getShownAwards:function(a){return a;}};
var award=new UI.Award();award.afterMergeInputs=function(){};
var G_UIManager={get_ui:function(id){return id===1?result:id===5?award:id===3?
    {selectedItem:{hero:hero},equipPanel:{controller:{refreshEquipmentUI:function(){}}}}:{refreshCurrentUI:function(){}};},
    isUIOpen:function(id){return id!==7;},open_ui:function(){},close_ui:function(){closes++;}};
UI.EquipmentInfo={UIID:7};
var building={sid:'bank',getComponent:function(n){return n==='BuildingBuilder'?{}:null;}};
var G_UnitManager={getUnitBySID:function(sid){return String(sid)==='bank'?building:
    hero&&String(sid)===String(hero.sid)?hero:{sid:'player'};}};
var G_Player=new ClientPlayer();
G_Player.getComponent=function(n){return n==='PackageManager'?pm:n==='ResourceManager'?rm:null;};
Object.assign(LocalNative,{callLog:[],readRaw:function(){return JSON.parse(disk);},
    writeRaw:function(s){if(failWrite)throw Error('write failure');disk=JSON.stringify(s);commits++;},
    writeStatus:function(){},copyAccountProgress:function(){},unlockHeroFeedIfNeeded:function(){},
    snapshotBuildingRecord:function(){return {sid:'bank',typeid:20301,sto:{1:wood,2:0}};},
    lookupUnitMain:function(){return {wood_storage:1000000,gold_storage:1000000};},
    syncSavedHomeWallet:function(level){wood=level.units[0].sto[1];rm.Res[1]=wood;},
    scheduleOnRoot:function(fn){queue.push(fn);return true;}});
Comp.HeroEquipment.getEquipmentAttr=function(){return 0;};
`, ctx);
function stock(file, prefix, names) {
    const s = fs.readFileSync(file, 'utf8');
    for (const name of names) {
        const a = s.indexOf(`${prefix}.prototype.${name}=`), b = s.indexOf('\n', s.indexOf('    };', a));
        assert.ok(a >= 0 && b > a, name); vm.runInContext(s.slice(a, b), ctx);
    }
}
stock(local+'Equipment.js', 'UI.EquipmentRehandle', ['onPressRehandle', 'realRehandleEquipment']);
stock(local+'Equipment.js', 'UI.EquipRehandleResult', ['showRehandleResult', 'showAlchemyRehandleResult', '_showResult', '_saveEquipment', 'onPressSave', 'onPressClose', 'realCancelRehandle']);
stock(`${__dirname}/disasm/ClientPlayer.decompiled.js`, 'ClientPlayer', ['rpc_c_rehandle_ans', 'rpc_c_rehandle_ans2', 'rpc_c_cancel_rehandle_ans']);
stock(`${__dirname}/../.local/hero-dismiss/Award.js`, 'UI.Award', ['showAward']);
stock(`${__dirname}/../.local/hero-dismiss/HeroComponents.js`, 'Comp.HeroEquipment', ['rehandleEquipmentAns', '_takeOffEquipment', '_putOnEquipment', 'getEquipment']);
ctx.LocalNative.installRuneRehandle(); ctx.LocalNative.installCallServer(ctx.G_Player);
vm.runInContext(`
function reset(kind) {
    GS_CURRENT_STAGE=1;queue=[];wood=500000;failWrite=false;commits=answers=closes=inputs=0;notices=[];
    var rune={oid:'r1',typeid:7001,num:1,base_attr:[1101,1102],two_attr:[1101],three_attr:[],hero_attr:1002,marker:'keep'};
    var pkg={};['material','based_prop','advanced_prop','formula'].forEach(function(n){pkg[n]={capacity:100,item_dict:{}};});
    pkg.based_prop.item_dict={a:{oid:'a',typeid:5001,num:5},b:{oid:'b',typeid:2001,num:2},c:{oid:'c',typeid:1113,num:1}};
    pm={package:pkg,init:function(p){this.package=JSON.parse(JSON.stringify(p.package));},
        getItem:function(id,oid){return this.package.advanced_prop.item_dict[oid];},
        updatePackageByServer:function(items){for(var i=0;i<items.length;i++)this.package.advanced_prop.item_dict[items[i].oid]=items[i];}};
    rm={Res:{1:wood,3:100,4:50},useRes:function(n,type){wood-=n;this.Res[type]=wood;return true;}};
    hero={sid:kind==='string'?'local_hero_1':23,getSid:function(){return this.sid;},
        getComponent:function(n){return n==='HeroEquipment'?eq:n==='HeroAttributeController'?{setMaxLife:function(){},addLife:function(){}}:null;}};
    eq=new Comp.HeroEquipment();eq.eqp=[kind==='package'?null:rune];eq.master=hero;eq.getOpenedSlots=function(){return 1;};
    if(kind==='package')pm.package.advanced_prop.item_dict.r1=rune;else rune.slot=0;
    result=new UI.EquipRehandleResult();result.setEquipInfo=function(item,side){this['side'+side]=JSON.parse(JSON.stringify(item));};
    result._closeUI=function(){closes++;};
    recast=new UI.EquipmentRehandle();recast.hero=kind==='package'?null:hero;recast.equip=rune;
    recast.heropieces={5001:5};recast.proppieces={2001:2};recast._isMaterialEnough=function(){return true;};recast._closeUI=function(){closes++;};
    disk=JSON.stringify({keep:'unrelated',level:{units:[{sid:'bank',typeid:20301,sto:{1:wood,2:0}}],
        player:{package:pkg,diamond:100,spirit:50},heros:[{sid:hero.sid,typeid:10401,eqp:eq.eqp,skill_slots:[{sid:1,lv:2}]}]}});
}
function flush(){while(queue.length)queue.shift()();}
function count(type){return Object.values(pm.package).reduce(function(sum,b){return sum+Object.values(b.item_dict).reduce(function(n,i){return n+(i.typeid===type?i.num:0);},0);},0);}
`, ctx);
const run = x => vm.runInContext(x, ctx), disk = () => JSON.parse(ctx.disk), n = ctx.LocalNative;
for (const kind of ['package', 'numeric', 'string']) {
    run(`reset('${kind}');recast.onPressRehandle();flush();`);
    let p = disk().level.player.local_rune_rehandle;
    assert.ok(p); assert.equal(ctx.commits, 1); assert.equal(ctx.wood, 400000);
    assert.equal(p.after.typeid, 7001); assert.equal(p.after.oid, 'r1'); assert.equal(p.after.hero_attr, 1002);
    assert.equal(p.after.base_attr.length, 2); assert.equal(p.after.two_attr.length, 1); assert.equal(p.after.three_attr.length, 0);
    assert.deepEqual(JSON.parse(JSON.stringify(ctx.result.side0)), p.before);
    assert.deepEqual(JSON.parse(JSON.stringify(ctx.result.side1)), p.after);
    assert.equal(run('count(5001)+count(2001)+count(1113)'), 0);
    // Re-entering / repeated button resumes this candidate and restores a second optimistic debit.
    run('recast.realRehandleEquipment();flush();');
    assert.equal(ctx.wood, 400000); assert.equal(ctx.commits, 1);
    assert.deepEqual(disk().level.player.local_rune_rehandle.after, p.after);
    run('result.onPressSave();');
    let level = disk().level;
    assert.equal(level.player.local_rune_rehandle, null); assert.equal(ctx.commits, 2);
    const saved = kind === 'package' ? level.player.package.advanced_prop.item_dict.r1 : level.heros[0].eqp[0];
    assert.deepEqual(saved, p.after); assert.equal(saved.marker, 'keep');
    assert.deepEqual(JSON.parse(JSON.stringify(kind === 'package' ? ctx.pm.package.advanced_prop.item_dict.r1 : ctx.eq.eqp[0])), p.after);
    run('result.onPressClose();'); assert.equal(ctx.commits, 2, 'save/close cannot commit twice');
    run(`reset('${kind}');recast.onPressRehandle();flush();result.realCancelRehandle();`);
    level = disk().level;
    assert.equal(ctx.wood, 450000); assert.equal(run('count(5001)'), 2); assert.equal(run('count(2001)'), 1); assert.equal(run('count(1113)'), 0);
    assert.equal(level.player.local_rune_rehandle, null); assert.equal(ctx.inputs, 0, 'refund display does not grant again');
    assert.deepEqual(kind === 'package' ? level.player.package.advanced_prop.item_dict.r1 : level.heros[0].eqp[0], JSON.parse(JSON.stringify(ctx.result.side0)));
    const committed = ctx.disk; run('result.realCancelRehandle();'); assert.equal(ctx.disk, committed); assert.equal(ctx.commits, 2);
}
run("reset('package');failWrite=true;recast.onPressRehandle();flush();");
assert.equal(ctx.commits, 0); assert.equal(ctx.wood, 500000); assert.equal(run('count(5001)'), 5);
run("reset('package');recast.heropieces={5001:100};recast.onPressRehandle();flush();");
assert.equal(ctx.commits, 0); assert.equal(ctx.wood, 500000);
run("reset('package');recast.onPressRehandle();flush();failWrite=true;result.onPressSave();");
assert.equal(ctx.commits, 1); assert.ok(disk().level.player.local_rune_rehandle);
run('failWrite=false;result.onPressSave();'); assert.equal(ctx.commits, 2);
run("reset('package');recast.onPressRehandle();flush();failWrite=true;result.realCancelRehandle();");
assert.equal(ctx.commits, 1); assert.equal(ctx.wood, 400000); assert.equal(run('count(5001)'), 0);
run('failWrite=false;result.realCancelRehandle();'); assert.equal(ctx.commits, 2); assert.equal(ctx.wood, 450000);
run("reset('package');GS_CURRENT_STAGE=2;recast.onPressRehandle();flush();"); assert.equal(ctx.commits, 0);
run("reset('string');recast.onPressRehandle();flush();var restart=JSON.parse(disk);result=new UI.EquipRehandleResult();result.setEquipInfo=function(item,side){this['side'+side]=JSON.parse(JSON.stringify(item));};result._closeUI=function(){closes++;};pm.init({package:restart.level.player.package});eq.eqp=restart.level.heros[0].eqp;LocalNative.showRuneRehandle(G_Player,restart.level.player.local_rune_rehandle);result.onPressSave();");
assert.equal(ctx.commits, 2); assert.equal(ctx.wood, 400000, 'cold result restoration does not pay again');
run("reset('package');recast.onPressRehandle();flush();pm.package.based_prop.capacity=0;result.realCancelRehandle();");
assert.equal(ctx.commits, 1); assert.ok(disk().level.player.local_rune_rehandle); assert.equal(ctx.wood, 400000);
run('pm.package.based_prop.capacity=100;result.realCancelRehandle();'); assert.equal(ctx.commits, 2);
run("reset('package');recast.onPressRehandle();flush();pm.package.advanced_prop.item_dict.r1.oid='moved';result.onPressSave();");
assert.equal(ctx.commits, 1); assert.ok(disk().level.player.local_rune_rehandle, 'changed identity blocks stale save');
let recipes = 0;
for (const [id, cfg] of Object.entries(ctx.data.item)) {
    if (!cfg.rune_type || !cfg.item_reforge?.length) continue;
    run("reset('package');");
    const recipe = cfg.item_reforge;
    ctx.pm.package.advanced_prop.item_dict.r1.typeid = Number(id);
    ctx.pm.package.based_prop.item_dict.a.num = recipe[0][1];
    ctx.pm.package.based_prop.item_dict.b.num = recipe[1][1];
    ctx.pm.package.based_prop.item_dict.c.typeid = recipe[2][0];
    ctx.pm.package.based_prop.item_dict.c.num = recipe[2][1];
    ctx.recast.heropieces = {5001:recipe[0][1]}; ctx.recast.proppieces = {2001:recipe[1][1]};
    ctx.wood = Number(cfg.item_reforge_cost[1]) + 1000;
    const d = disk(); d.level.player.package = ctx.pm.package; d.level.units[0].sto[1] = ctx.wood; ctx.disk = JSON.stringify(d);
    run('recast.onPressRehandle();flush();');
    const p = disk().level.player.local_rune_rehandle; assert.ok(p, id);
    assert.equal(p.after.typeid, Number(id));
    for (const [layer, field] of Object.entries({base_attr:'att_basic_color',two_attr:'att_evolve2_color',three_attr:'att_evolve3_color'}))
        for (const attr of p.after[layer]) assert.ok(ctx.data.equipment_attribute[attr][field] > 0);
    run('result.onPressSave();'); assert.equal(ctx.commits, 2); assert.equal(ctx.wood, 1000);
    recipes++;
}
run("reset('package');recast.onPressRehandle();flush();var stale=JSON.parse(disk).level;delete stale.player.local_rune_rehandle;LocalNative.saveLevel(stale);");
assert.ok(disk().level.player.local_rune_rehandle, 'home dumps preserve the pending candidate');
run('var oldPending=JSON.parse(disk).level.player.local_rune_rehandle;result.onPressSave();var stale=JSON.parse(disk).level;stale.player.local_rune_rehandle=oldPending;LocalNative.saveLevel(stale);');
assert.equal(disk().level.player.local_rune_rehandle, null, 'stale home dumps cannot resurrect a completed candidate');
console.log('PASS: original rehandle and result flows for package/numeric/string heroes, actual gear apply, cold restoration, save/close, half refund, duplicates, disk/capacity failures, moved rune and stage isolation; recipes:', recipes);
