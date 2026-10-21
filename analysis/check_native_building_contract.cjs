// Exercise the actual recovered stock initializer, not a copy of its logic.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
const stock = fs.readFileSync(`${__dirname}/disasm/Components.decompiled.js`, 'utf8');
const ctx = {
    LocalNative: {defaultPlayer: () => ({}), defaultHeros: () => []},
    BUILD_STATE_BEFORE_BUILD: 0, BUILD_STATE_BUILDING: 1, BUILD_STATE_FINISH: 2,
    GS_STAGE_BUILD: 1, GS_CURRENT_STAGE: 1, BATTLE_FACTION_DEFENDER: 2,
    Comp: {BuildingBuilder: function() {}},
};
vm.createContext(ctx);
function load(name, next) {
    const a = source.indexOf(`        LocalNative.${name} = function`);
    const b = source.indexOf(`        LocalNative.${next} = function`, a + 1);
    assert.ok(a >= 0 && b > a);
    vm.runInContext(source.slice(a, b), ctx);
}
load('toBuildingRecord', 'unit');
load('unit', 'defaultStarterHero');
load('defaultLevelDict', 'normalizeStarterBuildings');
load('normalizeStarterBuildings', 'kickBeginRookie');
const a = stock.indexOf('Comp.BuildingBuilder.prototype.init=');
const b = stock.indexOf('Comp.BuildingBuilder.prototype.afterInit=', a);
assert.ok(a >= 0 && b > a);
vm.runInContext(stock.slice(a, b), ctx);
let prompts = 0;
ctx.Comp.BuildingBuilder.buyBuildingConfirm = {init() { prompts++; }};
function init(params) {
    const builder = new ctx.Comp.BuildingBuilder();
    builder.init({lv_up_time: 900}, params);
    return builder;
}
// Reproduce the reported defect with the pre-migration stored shape.
init({sid: 5, typeid: 20401, state: 2, beginTime: 0});
assert.equal(prompts, 1);
prompts = 0;
const initial = ctx.LocalNative.defaultLevelDict();
for (const unit of initial.units) assert.equal(init(unit).state, 2);
assert.equal(prompts, 0, 'initial city must not enter placement');
assert.equal(initial.units.filter(u => u.unit_type === 207).length, 1);
// Migrating a progressed city keeps records and guide bits, adds one finished yard,
// avoids an occupied fallback tile, and becomes a no-op on the next login.
ctx.legacyCity = initial;
vm.runInContext('legacyCity.units = legacyCity.units.filter(function(u) { return u.unit_type !== 207; });', ctx);
const occupied = ctx.LocalNative.unit(100, 30101, 20, 36);
initial.units.push(occupied);
initial.user_config.rookie0 = 30786;
const preserved = JSON.stringify(initial);
assert.equal(ctx.LocalNative.normalizeStarterBuildings(initial), true);
const yard = initial.units.find(u => u.unit_type === 207);
assert.equal(init(yard).state, 2);
assert.equal(yard.sid, 101);
assert.ok(Math.abs(yard.x - occupied.x) >= 5 || Math.abs(yard.y - occupied.y) >= 5);
assert.equal(JSON.stringify({...initial, units: initial.units.filter(u => u !== yard)}), preserved);
assert.equal(ctx.LocalNative.normalizeStarterBuildings(initial), false);
yard.typeid = 20702;
yard.unit_level = 2;
yard.x = 40;
const withUpgradedYard = JSON.stringify(initial);
assert.equal(ctx.LocalNative.normalizeStarterBuildings(initial), false);
assert.equal(JSON.stringify(initial), withUpgradedYard, 'existing upgraded yard must survive login');
const old = {sid: 5, typeid: 20401, state: 2, beginTime: 0, x: 34, y: 36};
const migrated = ctx.LocalNative.toBuildingRecord(old);
assert.equal(init(migrated).state, 2);
assert.equal(old.bs, undefined, 'conversion must not mutate its input');
assert.equal(migrated.x, old.x);
const constructing = ctx.LocalNative.toBuildingRecord({sid: 9, state: 1, beginTime: 1700000000});
assert.equal(init(constructing).state, 1);
assert.equal(init(constructing).beginTime, 1700000000);
assert.equal(prompts, 0);
// A native record wins over obsolete aliases; explicit placement stays placement.
assert.equal(init(ctx.LocalNative.toBuildingRecord({sid: 9, bs: 1, state: 2, bt: 123, beginTime: 0})).beginTime, 123);
assert.equal(init(ctx.LocalNative.toBuildingRecord({sid: 10, bs: 0, bt: 0})).state, 0);
assert.equal(prompts, 1, 'normal shop placement must still show its confirmation');
assert.throws(() => ctx.LocalNative.toBuildingRecord({sid: 5}), /building\[5\].bs/);
assert.throws(() => ctx.LocalNative.toBuildingRecord({sid: 5, bs: 9}), /invalid/);
// Finished replay buildings need no synthetic shared placement UI.
ctx.GS_CURRENT_STAGE = 2;
ctx.Comp.BuildingBuilder.buyBuildingConfirm = null;
assert.equal(init(migrated).state, 2);
console.log('PASS: stock initializer reproduces old defect; new/legacy/constructing/placement/replay records obey bs/bt');
// The stock build initializer uses the collection key as the server ID.
ctx.LocalNative.ensureAvailableStages = () => {};
load('makeHomeInitDict', 'ensureStarterHeros');
const serverDict = ctx.LocalNative.makeHomeInitDict(initial);
assert.equal(Array.isArray(serverDict.units), false);
assert.equal(serverDict.units['2'].typeid, 20601);
assert.equal(serverDict.units['100'].typeid, 30101);
assert.equal(serverDict.units['101'].typeid, 20702);
const playerObject = {sid: '1'};
const buildingObject = {sid: '2', cid: 44, builder: {state: 1}};
ctx.LocalNative.getBuildingBuilder = unit => unit && unit.builder;
ctx.LocalNative.findPendingBuildUnit = () => buildingObject;
ctx.G_UnitManager = {
    getUnitBySID: sid => String(sid) === '1' ? playerObject : buildingObject,
    getUnit: () => buildingObject,
};
load('resolveBuildTarget', 'ensureUnitBuildCompleteHook');
assert.equal(ctx.LocalNative.resolveBuildTarget({uid: '2'}).unit, buildingObject);
assert.equal(ctx.LocalNative.resolveBuildTarget({sid: '1', cid: 44}).unit, buildingObject);
assert.equal(ctx.LocalNative.resolveBuildTarget({uid: '1'}).unit, buildingObject,
    'SID collision must not route gem completion to a player without BuildingBuilder');
console.log('PASS: home data keyed by server ID; gem finish rejects player and honors explicit CID');
// Model the reported failure using the recovered stock completion callback:
// upgradeFinish alone changes state, whereas onBuilderFinishBuilding refreshes
// from the server's new unit_level. Verify both construction and upgrade payloads.
ctx.data = {unit_main: {20601: {lv: 1}, 20602: {lv: 2}, 30101: {lv: 1}}};
ctx.LocalNative.lookupUnitMain = tid => ctx.data.unit_main[tid];
ctx.LocalNative.resolveRealTypeID = unit => unit.typeid % 100 === 0 ? unit.typeid + 1 : unit.typeid;
ctx.LocalNative.ensureQuestManagerSafe = () => {};
ctx.LocalNative.unitHasVisibleRoot = () => true;
ctx.LocalNative.unitStillOnMap = () => true;
ctx.LocalNative.writeStatus = () => {};
ctx.LocalNative.pendingBuilds = {};
ctx.Unit = function() {};
ctx.DA = {checkCurrentStage: () => true, GETCGC: () => ({isUnitPlaced: () => false})};
ctx.GS_STAGE_EDIT = 9;
const unitSource = fs.readFileSync(`${__dirname}/disasm/Unit.decompiled.js`, 'utf8');
const finishStart = unitSource.indexOf('Unit.prototype.onBuilderFinishBuilding=');
const finishEnd = unitSource.indexOf('Unit.prototype.server_build_complete=', finishStart);
vm.runInContext(unitSource.slice(finishStart, finishEnd), ctx);
load('buildFinishSwapParams', 'unitStillOnMap');
ctx.LocalNative.readRaw = () => null;
load('snapshotBuildingRecord', 'persistFinishedUnit');
load('finishViaBuilder', 'forceFinishBuilding');
function completionFixture(tid) {
    const unit = new ctx.Unit();
    unit.sid = '2'; unit.typeid = tid; unit.level = tid % 100;
    unit.getComponent = key => key === 'TileHolder' ? {getTileCoord: () => ({x: 20, y: 28})} : null;
    unit.builder = {state: 1, upgradeFinish() { this.state = 2; }};
    unit.refresh = params => {
        assert.equal(params.bs, 2);
        assert.equal(params.x, 20);
        unit.typeid = params.typeid; unit.level = params.unit_level;
        unit.builder = {state: params.bs};
    };
    return unit;
}
const upgradingNest = completionFixture(20601);
assert.equal(ctx.LocalNative.finishViaBuilder(upgradingNest, 'test-upgrade'), true);
assert.equal(upgradingNest.typeid, 20602);
assert.equal(upgradingNest.level, 2);
const newBunker = completionFixture(30100);
assert.equal(ctx.LocalNative.finishViaBuilder(newBunker, 'test-construction'), true);
assert.equal(newBunker.typeid, 30101);
assert.equal(newBunker.level, 1);
const brokenRefresh = completionFixture(20601);
brokenRefresh.refresh = () => {};
assert.equal(ctx.LocalNative.finishViaBuilder(brokenRefresh, 'test-no-level-change'), false,
    'timer stopped without reaching the target level is not successful completion');
console.log('PASS: stock completion receives level 2; construction stays level 1; false success rejected');

// Execute the recovered success ACK and the real adapter upgrade dispatch.
// The old {unit:sid} response throws before zero-time construction can finish.
ctx.ClientPlayer = function() {};
const playerSource = fs.readFileSync(`${__dirname}/disasm/ClientPlayer.decompiled.js`, 'utf8');
const ackStart = playerSource.indexOf('ClientPlayer.prototype.rpc_c_ans_building_upgrade=');
const ackEnd = playerSource.indexOf('ClientPlayer.prototype.rpc_c_ans_unlock_hero=', ackStart);
vm.runInContext(playerSource.slice(ackStart, ackEnd), ctx);
load('resolveBuildTime', 'probeUnitMain');
ctx.data.unit_main[21101] = {lv: 1};
ctx.data.unit_main[21102] = {lv: 2};
ctx.LocalNative.activeBuilder = {buildTime: 900};
const wall = completionFixture(21101);
wall.cid = 91;
wall.builder.buildTime = 0;
wall.setSid = sid => { wall.sid = sid; };
ctx.G_UnitManager = {
    getUnit: cid => cid === 91 ? wall : undefined,
    getUnitBySID: sid => String(sid) === '2' ? wall : undefined,
};
const player = new ctx.ClientPlayer();
assert.throws(() => player.rpc_c_ans_building_upgrade({success: true, unit: '2'}));
assert.equal(ctx.LocalNative.resolveBuildTime(21101, wall), 0,
    'zero-time wall must not inherit the last active building timer');
assert.equal(ctx.LocalNative.resolveBuildTime(20601, {builder: {buildTime: 300}}), 300);
const queued = [];
ctx.LocalNative.scheduleOnRoot = (fn, delay) => queued.push({fn, delay});
ctx.LocalNative.completedSids = {};
ctx.LocalNative.tryDumpAndSave = () => true;
const completed = [];
ctx.LocalNative.ackBuildComplete = (p, sid, reason) => {
    completed.push({sid, reason});
    return ctx.LocalNative.finishViaBuilder(wall, reason);
};
const dispatchStart = source.indexOf("                if (methodName === 'rpc_s_build_update'");
const dispatchEnd = source.indexOf('                // Gem/instant finish:', dispatchStart);
ctx.dispatchUpgrade = vm.runInContext(`(function(player, params, entry, methodName) {
    ${source.slice(dispatchStart, dispatchEnd)}
})`, ctx);
ctx.dispatchUpgrade(player, {uid: '2'}, {}, 'rpc_s_build_update');
assert.equal(queued.length, 1);
queued.shift().fn();
assert.equal(ctx.LocalNative.lastError, undefined);
assert.equal(completed.length, 1);
assert.equal(queued.length, 0, 'instant wall upgrade must not schedule a duration timer');
assert.equal(wall.typeid, 21102);
assert.equal(wall.level, 2);
assert.equal(wall.builder.state, 2);
assert.equal(wall.sid, '2');
console.log('PASS: stock ACK reproduces old exception; zero-time wall upgrades once to level 2');
wall.typeid = 21101; wall.level = 1; wall.builder = {state: 1, buildTime: 300};
ctx.dispatchUpgrade(player, {uid: '2'}, {}, 'rpc_s_build_update');
queued.shift().fn();
assert.equal(completed.length, 1, 'timed upgrade must wait');
assert.equal(queued[0].delay, 300);
queued.shift().fn();
assert.equal(completed.length, 2);
// Already paid zero-time walls saved in BUILDING state use the existing resume path.
wall.typeid = 21101; wall.level = 1;
wall.builder = {state: 1, buildTime: 0, beginTime: 1};
ctx.LocalNative.getBuildController = () => ({buildings: [wall]});
load('collectHomeBuildings', 'resumeConstructions');
load('resumeConstructions', 'resolveBuildTarget');
assert.equal(ctx.LocalNative.resumeConstructions(player), 1);
assert.equal(completed.length, 3);
assert.equal(wall.typeid, 21102);
assert.equal(wall.builder.state, 2);
console.log('PASS: timed upgrade waits; saved zero-time wall completes through construction resume');
