const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
const stock = fs.readFileSync(`${__dirname}/disasm/Components.decompiled.js`, 'utf8');
const playerSource = fs.readFileSync(`${__dirname}/disasm/ClientPlayer.decompiled.js`, 'utf8');
const controller = fs.readFileSync(`${__dirname}/disasm/GameControllerBuild.decompiled.js`, 'utf8');
assert.ok(controller.includes('this.buildings[obj.cid]=obj.typeid;'));
const now = Math.floor(Date.now() / 1000);
const units = {};
function building(cid, sid, tid, state, begin, duration) {
    const bb = {state, beginTime: begin, buildTime: duration};
    return units[cid] = {cid, sid, typeid: tid,
        componentList: {BuildingBuilder: bb, TileHolder: {getTileCoord: () => ({x: 12, y: 13})}},
        getComponent(name) { return this.componentList[name]; },
        setSid(s) { this.sid = s; }};
}
const existing = building(10, '2', 20601, 1, now - 1000, 900);
const purchased = building(11, '100', 30100, 1, now - 100, 300);
building(12, null, 20400, 0, 0, 300);
const gc = {buildings: {10: 20601, 11: 30100, 12: 20400}};
let saved = {level: {units: [{sid: '2', typeid: 20601, bs: 1, bt: now - 1000}], player: {diamond: 55}}};
const queue = [], completions = [];
const ctx = {BUILD_STATE_BEFORE_BUILD: 0, BUILD_STATE_BUILDING: 1,
    BUILD_STATE_FINISH: 2, GS_CURRENT_STAGE: 1, GS_STAGE_BUILD: 1,
    G_Player: {}, G_UnitManager: {getUnit: cid => units[cid],
        getUnitBySID: sid => Object.values(units).find(u => String(u.sid) === String(sid))},
    LocalNative: {pendingBuilds: {}, completedSids: {},
        getBuildingBuilder: u => u && u.componentList && u.componentList.BuildingBuilder,
        getBuildController: () => gc, readRaw: () => saved,
        copyAccountProgress() {}, getResourceManager: () => null,
        saveLevel: level => { saved = JSON.parse(JSON.stringify({level})); },
        writeStatus() {}, resolveBuildTime: (tid, u) => u.getComponent('BuildingBuilder').buildTime,
        scheduleOnRoot: (fn, delay) => queue.push({fn, delay}),
        ackBuildComplete: (p, sid) => completions.push(sid)}};
vm.createContext(ctx);
function load(name, next) {
    const a = source.indexOf(`        LocalNative.${name} = function`);
    const b = source.indexOf(`        LocalNative.${next} = function`, a + 1);
    assert.ok(a >= 0 && b > a);
    vm.runInContext(source.slice(a, b), ctx);
}
load('collectHomeBuildings', 'resumeConstructions');
load('snapshotBuildingRecord', 'persistFinishedUnit');
load('snapshotHeroEquipment', 'persistHeroEquipment');
load('tryDumpAndSave', 'getAnyGameController');
load('resumeConstructions', 'resolveBuildTarget');
assert.equal(ctx.LocalNative.tryDumpAndSave(), true);
assert.equal(saved.level.units.length, 2, 'include paid purchase, exclude unconfirmed ghost');
const record = saved.level.units.find(u => u.sid === '100');
assert.equal(record.typeid, 30100);
assert.equal(record.bs, 1);
assert.equal(record.bt, now - 100);
assert.deepEqual([record.x, record.y], [12, 13]);
assert.equal(saved.level.player.diamond, 55);
assert.equal(ctx.LocalNative.tryDumpAndSave(), true);
assert.equal(saved.level.units.length, 2, 'repeated saves must not duplicate purchases');
// Execute stock ACK: its SID field is id, not unit.
const a = playerSource.indexOf('ClientPlayer.prototype.rpc_c_ans_build=');
const b = playerSource.indexOf('ClientPlayer.prototype.rpc_c_ans_building_upgrade=', a);
ctx.ClientPlayer = function() {};
vm.runInContext(playerSource.slice(a, b), ctx);
ctx.ClientPlayer.prototype.rpc_c_ans_build({success: true, cid: 11, id: '100', unit: '100'});
assert.equal(purchased.sid, '100');
// Stock timeout hides the timer but leaves state=1 until a completion response.
const c = stock.indexOf('Comp.BuildingBuilder.prototype._update=');
const d = stock.indexOf('Comp.BuildingBuilder.prototype.setRestTime=', c);
ctx.Comp = {BuildingBuilder: function() {}};
ctx.DA = {getSystemCurrentTimeSec: () => now};
vm.runInContext(stock.slice(c, d), ctx);
let hidden = false;
const expired = existing.getComponent('BuildingBuilder');
expired._deleteProgressTimer = () => { hidden = true; };
ctx.Comp.BuildingBuilder.prototype._update.call(expired);
assert.equal(hidden, true);
assert.equal(expired.state, 1);
assert.equal(ctx.LocalNative.resumeConstructions({}), 2);
assert.deepEqual(completions, ['2']);
assert.ok(queue[0].delay >= 199 && queue[0].delay <= 200);
ctx.LocalNative.resumeConstructions({});
queue[0].fn();
assert.equal(completions.length, 2, 'stale timer must not finish replacement job');
queue[1].fn();
assert.equal(completions.at(-1), '100');
console.log('PASS: paid purchase persists before completion; stock CID map restores elapsed and remaining jobs; stale timers ignored');
