// Exercise stock row payment, optimistic state, batch completion and home save.
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const out = path.join(root, '.local/wall-row-upgrade');
fs.mkdirSync(out, {recursive: true});
execFileSync('python', [path.join(root, 'tools/jsc_decompiler/cli.py'),
    path.join(__dirname, 'decoded/script/Client/UI/WallRow.jsc'), path.join(out, 'WallRow.js')]);
const adapter = fs.readFileSync(path.join(__dirname, 'native_boot.js'), 'utf8');
const stockRow = fs.readFileSync(path.join(out, 'WallRow.js'), 'utf8');
const stockComp = fs.readFileSync(path.join(__dirname, 'disasm/Components.decompiled.js'), 'utf8');
const stockPlayer = fs.readFileSync(path.join(__dirname, 'disasm/ClientPlayer.decompiled.js'), 'utf8');
const stockUnit = fs.readFileSync(path.join(__dirname, 'disasm/Unit.decompiled.js'), 'utf8');
const c = {LocalNative: {}, WallRow: function() {}, ClientPlayer: function() {}, Unit: function() {},
    Comp: {BuildingBuilder: function() {}}, data: {unit_main: {}},
    BUILD_STATE_BUILDING: 1, BUILD_STATE_FINISH: 2, WALL_TYPE_ID: 211,
    GS_STAGE_BUILD: 1, GS_STAGE_EDIT: 9, GS_CURRENT_STAGE: 1, RES_TYPE_DIAMOND: 3};
vm.createContext(c);
function load(src, start, end) {
    const a = src.indexOf(start), b = src.indexOf(end, a + start.length);
    assert.ok(a >= 0 && b > a, start);
    vm.runInContext(src.slice(a, b), c);
}
function local(name, next) {
    load(adapter, `        LocalNative.${name} = function`, `        LocalNative.${next} = function`);
}
load(stockRow, 'WallRow.prototype.upgradeWithDiamond=', 'PickArrow=');
load(stockComp, 'Comp.BuildingBuilder.prototype.upgradeInWallRow=',
    'Comp.BuildingBuilder.prototype.OnPressUpgradeCancel=');
load(stockPlayer, 'ClientPlayer.prototype.rpc_c_wallrow_build_complete=',
    'ClientPlayer.prototype.rpc_c_wall_complete=');
load(stockUnit, 'Unit.prototype.onBuilderFinishBuilding=', 'Unit.prototype.server_build_complete=');
local('snapshotBuildingRecord', 'persistFinishedUnit');
local('buildFinishSwapParams', 'unitStillOnMap');
local('handleUpgradeWalls', 'tryDumpAndSave');
local('tryDumpAndSave', 'getAnyGameController');
local('collectHomeBuildings', 'resumeConstructions');
for (const level of [1, 2, 3, 10]) c.data.unit_main[21100 + level] = {lv: level};
c.LocalNative.lookupUnitMain = tid => c.data.unit_main[tid];
c.LocalNative.getBuildingBuilder = u => u && u.builder;
c.LocalNative.ensureQuestManagerSafe = () => {};
c.LocalNative.completedSids = {};
c.LocalNative.pendingBuilds = {};
const logs = [];
c.LocalNative.writeStatus = e => logs.push(e);
c.DA = {getSystemCurrentTimeSec: () => 1000, makeSelector: () => () => {},
    checkCurrentStage: () => true, GETCGC: () => ({isUnitPlaced: () => false})};
function wall(sid, level, x) {
    const w = new c.Unit();
    Object.assign(w, {sid, typeid: 21100 + level, level, cid: 100 + Number(sid)});
    const coord = {x, y: 39};
    w.getSid = () => sid;
    w.getComponent = key => key === 'BuildingBuilder' ? w.builder :
        key === 'TileHolder' ? {getTileCoord: () => coord, targetTile: coord} : null;
    w.refreshByBuildingState = () => {};
    w.refresh = p => {
        assert.equal(p.x, x); assert.equal(p.y, 39);
        w.typeid = p.typeid; w.level = p.unit_level; w.builder = {state: p.bs};
    };
    w.builder = new c.Comp.BuildingBuilder();
    Object.assign(w.builder, {master: w, state: 2, rely_base_lv: 1,
        isUpgradeAble: () => w.level < 10, checkWorker: () => true,
        _processBuilding() {}, enterBuildingWorker() {},
        upgradeFinish() { this.state = 2; }});
    return w;
}
const walls = [wall('106', 1, 23), wall('107', 2, 22), wall('108', 10, 21)];
c.G_UnitManager = {getUnitBySID: sid => walls.find(w => w.sid === String(sid))};
let saved = {level: {units: walls.map(w => ({sid: w.sid, typeid: w.typeid, bs: 2})),
    player: {diamond: 20, spirit: 50}}};
c.LocalNative.readRaw = () => saved;
c.LocalNative.getBuildController = () => ({});
c.LocalNative.copyAccountProgress = () => {};
const rm = {Res: {1: 100000, 3: 20, 4: 50}, useRes(n, type) {this.Res[type] -= n; return true;}};
c.LocalNative.getResourceManager = () => rm;
const snapshots = [];
c.LocalNative.saveLevel = level => {saved = {level}; snapshots.push(JSON.parse(JSON.stringify(level)));};
const player = new c.ClientPlayer(); c.G_Player = player;
player.getComponent = name => name === 'ResourceManager' ? rm : null;
player.getBaseLevel = () => 10;
const queue = [];
c.LocalNative.scheduleOnRoot = fn => queue.push(fn);
const start = adapter.indexOf("                if (methodName === 'rpc_s_upgrade_walls')");
const end = adapter.indexOf('                // Upgrade start', start);
c.dispatch = vm.runInContext(`(function(player, params, methodName) {${adapter.slice(start, end)}})`, c);
let request;
player.callServer = (method, params) => {request = params; assert.equal(c.dispatch(player, params, method), true);};
const row = new c.WallRow();
row.walls = walls; row.costType = 1;
row.findAnUpgradableWall = () => walls[0];
row.master = {changeSelectedTarget() {}};
assert.equal(row.upgradeWithDiamond(12000, 0), true);
assert.equal(rm.Res[1], 88000);
assert.deepEqual(walls.map(w => w.builder.state), [1, 1, 2]);
assert.equal(queue.length, 1);
queue.shift()();
assert.equal(c.LocalNative.lastError, undefined);
assert.deepEqual(walls.map(w => w.level), [2, 3, 10]);
assert.deepEqual(walls.map(w => w.builder.state), [2, 2, 2]);
assert.deepEqual(snapshots[0].units.map(u => u.bs), [1, 1, 2]);
assert.deepEqual(Array.from(saved.level.units, u => u.typeid), [21102, 21103, 21110]);
assert.deepEqual(Array.from(saved.level.units, u => u.bs), [2, 2, 2]);
assert.equal(saved.level.player.diamond, 20);
assert.equal(rm.Res[1], 88000, 'completion must not debit resources twice');
// A duplicate completed request must not increment any wall again.
assert.equal(c.LocalNative.handleUpgradeWalls(player, request), true);
assert.deepEqual(walls.map(w => w.level), [2, 3, 10]);
assert.equal(logs.at(-1).step, 'wallrow-upgrade-complete');
// Reject a wrong SID without silently upgrading some other active building.
vm.runInContext("badWalls = {uids: ['missing']}", c);
assert.equal(c.LocalNative.handleUpgradeWalls(player, c.badWalls), false);
assert.match(c.LocalNative.lastError, /Invalid wall missing/);
assert.deepEqual(walls.map(w => w.level), [2, 3, 10]);
assert.equal(rm.Res[1], 88000);
console.log('PASS: original row payment/request, mixed levels, max-level skip, batch callback, saved levels, duplicate ACK');
