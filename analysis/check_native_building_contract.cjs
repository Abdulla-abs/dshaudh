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
