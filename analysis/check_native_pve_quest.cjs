// Execute the stock quest predicate against local settlement and old-save repair.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
const stock = fs.readFileSync(`${__dirname}/disasm/QuestManager.decompiled.js`, 'utf8');
const ctx = {LocalNative: {writeStatus() {}}, data: {pve_stage: {
    3: {coin_storage: 100, solar_storage: 200, pve_next_stage: [4]}
}}, G_Player: null};
vm.createContext(ctx);
function load(name, next) {
    const start = source.indexOf(`        LocalNative.${name} = function`);
    const end = source.indexOf(`        LocalNative.${next} = function`, start + 1);
    assert.ok(start >= 0 && end > start, name);
    vm.runInContext(source.slice(start, end), ctx);
}
load('normalizeStageMap', 'readPveStageLoot');
load('readPveStageLoot', 'toBuildingRecord');
load('applyPveStageProgress', 'buildPveBattleResultDict');
const start = stock.indexOf('Comp.QuestManager.prototype.get_mt_stage=');
const end = stock.indexOf('Comp.QuestManager.prototype.get_mt_warrior=', start);
assert.ok(start >= 0 && end > start);
ctx.Comp = {QuestManager: function() {}};
vm.runInContext(stock.slice(start, end), ctx);
const predicate = ctx.Comp.QuestManager.prototype.get_mt_stage;
const n = ctx.LocalNative;
function done(player, stage = 3) {
    ctx.G_Player = player;
    return predicate.call({}, [], {mt_stage: stage});
}

// Device evidence: active quest 300418 needs stage 3; stars=3, marker=0.
const old = {availableStages: {3: [0, 0, 3, 0], 4: [10, 20, 0, 0],
    5: [0, 0, 2, 17], 6: [0, 0, 0, 0]}};
assert.equal(done(old), 0, 'old three-star clear reproduces the blocked stock quest');
n.ensureAvailableStages(old, 'test-old-save');
assert.equal(done(old), 1, 'existing clear now satisfies the original predicate');
assert.equal(old.availableStages[4][3], 0, 'unplayed stage stays incomplete');
assert.equal(old.availableStages[5][3], 17, 'existing positive value preserved');
assert.equal(old.availableStages[6][3], 0, 'zero loot alone is not proof of a win');
const snapshot = JSON.stringify(old);
n.ensureAvailableStages(old, 'test-repeat');
assert.equal(JSON.stringify(old), snapshot, 'migration is idempotent');
assert.equal(done(JSON.parse(snapshot)), 1, 'repair survives serialization/reload');

const fresh = {availableStages: {3: [100, 200, 0, 0]}};
ctx.G_Player = fresh;
n.applyPveStageProgress(fresh, 3, 0, 10, 20);
assert.equal(done(fresh), 0, 'loss does not complete the quest');
n.applyPveStageProgress(fresh, 3, 1, 20, 40);
assert.equal(done(fresh), 1, 'one-star victory completes the quest');
assert.equal(done(fresh, 4), 0, 'unlocking the next stage does not complete it');
assert.deepEqual(Array.from(fresh.availableStages[3]), [70, 140, 1, 1]);
n.applyPveStageProgress(fresh, 3, 0, 0, 0);
assert.equal(done(fresh), 1, 'later loss keeps prior completion');
console.log('PASS stock PVE quest predicate, old-save migration, win/loss and reload');
