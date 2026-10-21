// Run actual purchase dispatch against a progressed city with stock string SIDs.
// Lookup fixture: python tools/jsc_decompiler/cli.py analysis/decoded/script/Client/ClientUnits/UnitManager.jsc .local/build-freeze/UnitManager.js --dump-bytecode
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
const stock = fs.readFileSync(`${__dirname}/disasm/ClientPlayer.decompiled.js`, 'utf8');
const now = Math.floor(Date.now() / 1000);
let saved = {level: {units: [
    {sid: '100', typeid: 30108, x: 24, y: 30, bs: 2, bt: 0},
    {sid: '178', typeid: 21102, x: 13, y: 14, bs: 2, bt: 0}
], player: {diamond: 55}}};
const units = {}, registry = {}, queue = [];
function unit(cid, sid, tid, state, x, y) {
    const bb = {state, beginTime: state === 1 ? now : 0, buildTime: 300};
    const u = units[cid] = {cid, sid, typeid: tid,
        componentList: {BuildingBuilder: bb, TileHolder: {getTileCoord: () => ({x, y})}},
        getComponent(name) {return this.componentList[name];},
        setSid(s) {this.sid = s; registry[String(s)] = this;}};
    bb.master = u;
    if (sid != null) registry[String(sid)] = u;
    return u;
}
const old = unit(10, '100', 30108, 2, 24, 30);
unit(11, '178', 21102, 2, 13, 14);
const bought = unit(12, null, 20400, 1, 20, 21);
const gc = {buildings: {10: 30108, 11: 21102, 12: 20400}};
const logs = [];
const ctx = {BUILD_STATE_BEFORE_BUILD: 0, BUILD_STATE_BUILDING: 1, BUILD_STATE_FINISH: 2,
    GS_STAGE_BUILD: 1, GS_CURRENT_STAGE: 1, ClientPlayer: function() {},
    G_UnitManager: {getUnit: cid => units[cid], getUnitBySID: sid => registry[String(sid)]},
    LocalNative: {nextSid: 100, pendingBuilds: {}, completedSids: {},
        activeBuilder: bought.componentList.BuildingBuilder,
        getBuildController: () => gc, readRaw: () => saved,
        saveLevel: level => { saved = JSON.parse(JSON.stringify({level})); },
        writeRaw: store => { saved = JSON.parse(JSON.stringify(store)); },
        getBuildingBuilder: u => u && u.getComponent && u.getComponent('BuildingBuilder'),
        copyAccountProgress() {}, getResourceManager: () => null,
        writeStatus: e => logs.push(e), scheduleOnRoot: (fn, delay) => queue.push({fn, delay}),
        ackBuildComplete() {}}};
vm.createContext(ctx);
function load(name, next) {
    const a = source.indexOf(`        LocalNative.${name} = function`);
    const b = source.indexOf(`        LocalNative.${next} = function`, a + 1);
    assert.ok(a >= 0 && b > a, name);
    vm.runInContext(source.slice(a, b), ctx);
}
load('syncNextSid', 'allocateSid');
load('allocateSid', 'findPendingBuildUnit');
load('findPendingBuildUnit', 'resolveBuildTime');
load('resolveBuildTime', 'probeUnitMain');
load('ensureUnitSid', 'lookupUnitMain');
load('collectHomeBuildings', 'resumeConstructions');
load('snapshotBuildingRecord', 'persistFinishedUnit');
load('persistFinishedUnit', 'finishViaBuilder');
load('snapshotHeroEquipment', 'persistHeroEquipment');
load('tryDumpAndSave', 'getAnyGameController');
const a = stock.indexOf('ClientPlayer.prototype.rpc_c_ans_build=');
const b = stock.indexOf('ClientPlayer.prototype.rpc_c_ans_building_upgrade=', a);
vm.runInContext(stock.slice(a, b), ctx);
const player = ctx.G_Player = new ctx.ClientPlayer();
const start = source.indexOf("                if (methodName === 'rpc_s_build')");
const end = source.indexOf("                if (methodName === 'rpc_s_upgrade_walls')", start);
ctx.dispatch = vm.runInContext(`(function(player, params, entry, methodName) {${source.slice(start, end)}})`, ctx);
// The stock login path passes string SID records to syncNextSid.
ctx.LocalNative.syncNextSid(saved.level.units);
assert.equal(ctx.dispatch(player, {cid: 12, typeid: 20400}, {}, 'rpc_s_build'), true);
queue.shift().fn();
assert.equal(ctx.LocalNative.lastError, undefined);
assert.equal(bought.sid, 179, 'new purchase must start above numeric-string SID 178');
assert.equal(old.sid, '100');
assert.equal(registry['100'], old);
assert.equal(saved.level.units.find(u => u.sid === '100').typeid, 30108);
assert.equal(saved.level.units.length, 3);
assert.equal(new Set(saved.level.units.map(u => String(u.sid))).size, 3);
// Finish the purchase, persist it, then emulate stock login's string SID keys.
bought.typeid = 20401;
bought.componentList.BuildingBuilder.state = 2;
assert.equal(ctx.LocalNative.persistFinishedUnit(bought), true);
for (const u of Object.values(units)) if (u.sid != null) u.setSid(String(u.sid));
ctx.LocalNative.nextSid = 100;
ctx.LocalNative.syncNextSid(saved.level.units);
assert.equal(saved.level.units.find(u => String(u.sid) === '179').bs, 2);
// A stale activeBuilder must never redirect another purchase to an old building.
const second = unit(13, null, 20200, 1, 22, 23);
gc.buildings[13] = 20200;
ctx.LocalNative.activeBuilder = old.componentList.BuildingBuilder;
assert.equal(ctx.dispatch(player, {cid: 13, typeid: 20200}, {}, 'rpc_s_build'), true);
queue.splice(queue.findIndex(t => t.delay === 0), 1)[0].fn();
assert.equal(second.sid, 180);
assert.equal(old.sid, '100');
assert.equal(old.componentList.BuildingBuilder.state, 2);
assert.equal(saved.level.units.length, 4);
assert.equal(saved.level.units.find(u => String(u.sid) === '100').typeid, 30108);
assert.equal(saved.level.units.find(u => String(u.sid) === '179').typeid, 20401);
// Unknown CID must not touch the selected/active old building.
const before = JSON.stringify(saved);
ctx.dispatch(player, {cid: 999, typeid: 20200}, {}, 'rpc_s_build');
queue.splice(queue.findIndex(t => t.delay === 0), 1)[0].fn();
assert.equal(JSON.stringify(saved), before);
assert.equal(old.sid, '100');
ctx.LocalNative.nextSid = 100;
assert.ok(ctx.LocalNative.allocateSid() > 180, 'allocation rechecks durable records');
ctx.LocalNative.nextSid = 400;
ctx.LocalNative.syncNextSid([{sid: 'local_shop_hero_999'}, {sid: '401'}, {sid: 405}, {sid: null}]);
assert.equal(ctx.LocalNative.nextSid, 406);
console.log('PASS: stock string SIDs cannot overwrite finished buildings; purchase binds exact CID despite stale builder; missing CID preserves city');

// Actual stock lookup returns units.undefined for an unmapped SID. On this
// device that entry is the player (sid=1), which is not a collision with 179.
ctx.DA={UnitManager:function(){}};
const umSource=fs.readFileSync(`${__dirname}/../.local/build-freeze/UnitManager.js`,'utf8');
for(const [name,next] of [['getUnit','getLocalPlayerUnits'],['getUnitBySID','getCIDByUUID']]){
 const a=umSource.indexOf(`DA.UnitManager.prototype.${name}=`),b=umSource.indexOf(`DA.UnitManager.prototype.${next}=`,a);
 assert.ok(a>=0&&b>a);vm.runInContext(umSource.slice(a,b),ctx);
}
const um=ctx.G_UnitManager=new ctx.DA.UnitManager();
um.units={undefined:{sid:1}};um.sidToCid={local:{},other:{}};
assert.equal(um.getUnitBySID(179).sid,1);
saved={level:{units:[{sid:'178'}],heros:[]}};ctx.LocalNative.nextSid=100;ctx.LocalNative.pendingBuilds={};
assert.equal(vm.runInContext('LocalNative.allocateSid()',ctx,{timeout:500}),179);
// Both real runtime occupancy and pending purchases still reserve their SID.
um.units[3]={sid:'180'};um.sidToCid.local[180]=3;
ctx.LocalNative.pendingBuilds[181]={sid:181};
assert.equal(vm.runInContext('LocalNative.allocateSid()',ctx,{timeout:500}),182);
ctx.LocalNative.nextSid=9007199254740991;
ctx.LocalNative.pendingBuilds[9007199254740991]={sid:9007199254740991};
assert.throws(()=>vm.runInContext('LocalNative.allocateSid()',ctx,{timeout:500}),/SID range exhausted/);
console.log('PASS: original UnitManager undefined-CID player fallback cannot spin SID allocation; real and pending collisions still skipped; exhausted range fails promptly.');
