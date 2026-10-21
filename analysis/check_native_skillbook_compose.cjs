const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
const local = `${__dirname}/../.local/rune-rehandle/`;
const ctx = {LocalNative: {}, data: {}, GS_CURRENT_STAGE: 1, GS_STAGE_BUILD: 1, Math};
vm.createContext(ctx);
for (const name of ['item', 'item_input', 'input_event_client'])
    vm.runInContext(fs.readFileSync(local + name + '.js', 'utf8'), ctx);
for (const name of ['shopState', 'shopTransaction', 'shopSync', 'shopAddItem', 'shopRollItemEvent',
    'shopPick', 'handleComposeSkillbook', 'runShopRequest', 'unlockCompose', 'installCallServer']) {
    const a = source.indexOf(`        LocalNative.${name} = function`), b = source.indexOf('\n        LocalNative.', a + 1);
    assert.ok(a >= 0 && b > a, name); vm.runInContext(source.slice(a, b), ctx);
}
vm.runInContext(`
var Comp={PackageManager:function(){}}, ClientPlayer=function(){};
var UI={AlchemyCompound:function(){},AlchemyComposeMid:function(){},AlchemyInterface:{UIID:2}};
UI.AlchemyCompound.UIID=1; UI.AlchemyCompound.Skillbook=3;
var ALCHEMY_SKILL_BOOK_COMPOSE_NUM=3, ALCHEMY_SECOND_TYPE_SKILLBOOK=3, ALCHEMY_SKILL_ENFORCE_BOOK=210000;
var SKILLBOOK_COMPOSE_TO_TYPEID=[210001,210002,210003,210004], INPUT_TYPE_ITEM=19;
var pm,ui,disk,failWrite,commits,answers,effects,refreshes,shown,roll=0,jobs=[],notices=[];
var G_MainController={setNotice:function(s){notices.push(s);}};
var G_SoundManager={playSound:function(){}}, SND={ITEM_COMPOSE:1};
var G_UnitManager={getUnitBySID:function(){return null;}};
var G_UIManager={isUIOpen:function(){return true;},
    get_ui:function(id){return id===1?ui:{refreshCurrentUI:function(){refreshes++;}};}};
var G_Player=new ClientPlayer();
G_Player.getComponent=function(n){return n==='PackageManager'?pm:n==='ResourceManager'?{Res:{3:100,4:50}}:null;};
Object.assign(LocalNative,{callLog:[],readRaw:function(){return JSON.parse(disk);},
    writeRaw:function(s){if(failWrite)throw Error('disk failure');disk=JSON.stringify(s);commits++;},
    copyAccountProgress:function(){},syncSavedHomeWallet:function(){},writeStatus:function(){},
    unlockHeroFeedIfNeeded:function(){},scheduleOnRoot:function(fn){jobs.push(fn);return true;}});
Math.random=function(){return roll;};
var G_EventManager={inputAward:function(ans){
    answers++;
    for(var i=0;i<ans[0][1].length;i++){
        var item=ans[0][1][i];
        pm.package.advanced_prop.item_dict[item.oid]=JSON.parse(JSON.stringify(item));
    }
}};
`, ctx);
function stock(text, prefix, name) {
    const a = text.indexOf(`${prefix}.prototype.${name}=`), b = text.indexOf('\n', text.indexOf('    };', a));
    assert.ok(a >= 0 && b > a, name); vm.runInContext(text.slice(a, b), ctx);
}
const components = fs.readFileSync(`${__dirname}/../.local/hero-equip-slot/Components.js`, 'utf8');
for (const name of ['isNormalSkillBook', 'composeSkillBook', 'composeSkillbookAns'])
    stock(components, 'Comp.PackageManager', name);
stock(fs.readFileSync(`${__dirname}/../.local/arena-audit/Client_ClientUnits_ClientPlayer.js`, 'utf8'),
    'ClientPlayer', 'rpc_c_compose_skillbook_ans');
const packageSource = fs.readFileSync(`${__dirname}/../.local/item-compose/Package.js`, 'utf8');
for (const name of ['onPressOK', 'afterReceComposeResult']) stock(packageSource, 'UI.AlchemyCompound', name);
stock(packageSource, 'UI.AlchemyComposeMid', 'setComposedSkillbook');
ctx.LocalNative.installCallServer(ctx.G_Player);
vm.runInContext(`
function reset(books) {
    GS_CURRENT_STAGE=1; failWrite=false; commits=answers=effects=refreshes=0; jobs=[]; notices=[]; shown=null; roll=0;
    pm=new Comp.PackageManager(); pm.package={};
    ['material','based_prop','advanced_prop','formula'].forEach(function(n){pm.package[n]={capacity:100,item_dict:{}};});
    for(var i=0;i<books.length;i++)
        pm.package.advanced_prop.item_dict['s'+i]={oid:'s'+i,typeid:books[i],num:1};
    pm.init=function(p){this.package=JSON.parse(JSON.stringify(p.package));};
    // Stock onPressOK decompiles equipment checks outside the Equipment branch.
    pm.checkHeroPiecePoint=pm.checkPropPiecePoint=pm.isContainItemNum=
        pm.checkAlchemyLevel=pm.checkPlayerLevel=pm.checkMaterialEnough=function(){return true;};
    ui=new UI.AlchemyCompound(); ui.choiceType=UI.AlchemyCompound.Skillbook;
    ui.skillbooks=books.slice(); ui.product=SKILLBOOK_COMPOSE_TO_TYPEID[0];
    ui.mtr_list=[{},{},{typeid:7101,num:1}]; ui.heropieces={}; ui.proppieces={};
    ui.playing=false; ui.composeButtonNode={button:{setEnabled:function(v){ui.enabled=v;}}};
    ui.refreshButtonGray=function(){this.enabled=true;};
    ui.midPanelCtr=new UI.AlchemyComposeMid();
    ui.midPanelCtr.centerItemIcon={setAward:function(a){shown=a[1].typeid;},setGray:function(){}};
    ui.midPanelCtr.showComposeFx=function(){effects++;};
    disk=JSON.stringify({receipt:'keep',level:{player:{package:pm.package,diamond:100,spirit:50},units:[],heros:[{sid:'keep'}]}});
}
function flush(){while(jobs.length)jobs.shift()();}
function count(id){return Object.values(pm.package.advanced_prop.item_dict).filter(function(x){return x.typeid===id;})
    .reduce(function(s,x){return s+x.num;},0);}
`, ctx);
const run = s => vm.runInContext(s, ctx);
const n = ctx.LocalNative;
const lv1 = Object.keys(ctx.data.item).map(Number).filter(id => {
    const cfg = ctx.data.item[id];
    return cfg && Number(cfg.item_subID) === 3 && Number(cfg.item_type) === 2 && Number(cfg.skill_level) === 1 && id !== 210000;
});
const lv2 = Object.keys(ctx.data.item).map(Number).filter(id => {
    const cfg = ctx.data.item[id];
    return cfg && Number(cfg.item_subID) === 3 && Number(cfg.item_type) === 2 && Number(cfg.skill_level) === 2;
});
assert.ok(lv1.length >= 3 && lv2.length >= 3);

run(`reset([${lv1[0]},${lv1[1]},${lv1[2]}]); ui.onPressOK();`);
assert.equal(ctx.ui.playing, true); assert.equal(ctx.commits, 0);
run('flush();');
assert.equal(ctx.commits, 1); assert.equal(ctx.answers, 1); assert.equal(ctx.effects, 1); assert.equal(ctx.refreshes, 1);
assert.ok(ctx.shown); assert.ok(ctx.Comp.PackageManager.prototype.isNormalSkillBook.call(ctx.pm, ctx.shown));
assert.equal(Object.keys(ctx.pm.package.advanced_prop.item_dict).length, 1, 'three materials become one result');
assert.equal(run(`count(${ctx.shown})`), 1);
assert.ok(ctx.notices.includes('compose_success'));
assert.equal(['s0', 's1', 's2'].filter(oid => ctx.pm.package.advanced_prop.item_dict[oid]).length, 0);

// 3 high-level books must use placeholder 210004 / event 55604 (pool 4502 only).
const pool4502 = new Set((ctx.data.item_input[4502].item_random_chance || []).map(row => row[0]));
run(`reset([${lv2[0]},${lv2[1]},${lv2[2]}]); roll=0; ui.onPressOK(); flush();`);
assert.ok(pool4502.has(ctx.shown), 'three high books stay in rare pool');

run(`reset([${lv1[0]},${lv1[1]},${lv1[2]}]); failWrite=true; ui.onPressOK(); flush();`);
assert.equal(ctx.commits, 0); assert.equal(ctx.answers, 0); assert.equal(ctx.ui.playing, false);
assert.equal(run(`count(${lv1[0]})`), 1);

run(`reset([${lv1[0]},${lv1[1]},${lv1[2]}]); pm.package.advanced_prop.item_dict={};
    disk=JSON.stringify({level:{player:{package:pm.package,diamond:100,spirit:50},units:[],heros:[]}});
    ui.onPressOK(); flush();`);
assert.equal(ctx.commits, 0); assert.equal(ctx.ui.playing, false);

// All four placeholder events expose valid original pools.
for (const [high, id] of [[0, 210001], [1, 210002], [2, 210003], [3, 210004]]) {
    const eventId = ctx.data.item[id].item_composition_get[0];
    // Compare via JSON: vm-realm arrays are not deepStrictEqual to host arrays.
    const items = JSON.stringify([].map.call(ctx.data.input_event_client[eventId].putin_event_item, Number));
    if (high === 3) assert.equal(items, JSON.stringify([4502]));
    else assert.equal(items, JSON.stringify([4501, 4502]));
}

assert.match(source, /methodName === 'rpc_s_compose_skillbook'/);
console.log('PASS: skillbook compose stock callback, material consume, high-tier rare pool, failures; lv1/lv2 materials', lv1.length, lv2.length);
