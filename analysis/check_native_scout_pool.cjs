const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
const n = {}, ctx = {LocalNative: n, data: {unit_main: {}}};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(`${__dirname}/../.local/layout-player-mode/unit_main.js`, 'utf8'), ctx);
n.lookupUnitMain = id => ctx.data.unit_main[id];
function load(start, end) {
    const a = source.indexOf(start), b = source.indexOf(end, a + 1);
    assert.ok(a >= 0 && b > a);
    vm.runInContext(source.slice(a, b), ctx);
}
load('        // BEGIN SCOUT LEVEL POOL', '        LocalNative.handleEnterPveBattle = function');
const pool = n.scoutLevelPool;
assert.equal(pool.policy.mode, 'all');
const manifest = JSON.parse(fs.readFileSync(`${__dirname}/rpc-contracts/scout-pool.json`, 'utf8'));
assert.deepEqual(Array.from(pool.levels, e => e.id), manifest.levels.map(e => e.id));
const level = {player: {availableStages: {1: [99, 88, 3, 0]}}, units: [{typeid: 20103}]};
const original = JSON.stringify(level);
for (let i = 0; i < pool.levels.length; i++) {
    assert.equal(n.selectScoutLevel(level, () => (i + 0.5) / pool.levels.length), pool.levels[i]);
}
assert.equal(n.selectScoutLevel(level, () => 0), pool.levels[0]);
assert.equal(n.selectScoutLevel(level, () => 0.999999), pool.levels.at(-1));
assert.throws(() => n.selectScoutLevel(level, () => 1), /random/);
const actualLevels = pool.levels;
pool.levels = [1, 2, 3, 4, 5].map(h => ({id: String(h), headquartersLevel: h}));
pool.policy.mode = 'headquarters-range';
for (const [roll, expected] of [[0, '2'], [0.5, '3'], [0.99999, '4']]) {
    assert.equal(n.selectScoutLevel(level, () => roll).id, expected);
}
assert.equal(n.readScoutHeadquartersLevel({units: {hq: {typeid: '20103'}}}), 3);
assert.throws(() => n.selectScoutLevel({units: [{typeid: 20109}]}), /No matching/);
assert.throws(() => n.selectScoutLevel({units: []}), /headquarters level missing/);
pool.levels = [];
pool.policy.mode = 'all';
assert.throws(() => n.selectScoutLevel(level), /No matching/);
pool.levels = actualLevels;

// Exercise actual village and battle constructors, including guards/walls and resource loot.
load('        LocalNative.buildEditorPveVillage = function', '        // User reference screenshot');
load('        LocalNative.buildPveBattleDict = function', '        // BEGIN SCOUT LEVEL POOL');
Object.assign(n, {
    tryDumpAndSave() {}, readRaw: () => ({level}),
    ensureAvailableStages() { throw Error('scouting must not update campaign progress'); },
    readPveStageLoot() { throw Error('scouting must not inherit campaign loot'); },
    collectAttackHerosForPve: () => [], collectBattleSoldiers: () => ({}),
    getResourceManager: () => ({Res: {1: 4001, 2: 4982}, maxRes: {1: 20000, 2: 20000}}),
    makeBattleSide: (player, extras) => ({player, ...extras}),
    unit: (sid, typeid, x, y, extra) => ({sid, typeid, x, y, ...extra}),
    editorPveLayouts: {},
});
const snapshot = JSON.stringify(pool);
for (let i = 0; i < pool.levels.length; i++) {
    const entry = pool.levels[i];
    n.selectScoutLevel = () => entry;
    const dict = n.buildPvpBattleDict(level);
    assert.equal(dict.localNativeScoutLevelId, entry.id);
    assert.equal(dict.localNativeScoutHeadquartersLevel, entry.headquartersLevel);
    assert.equal(dict.isPVE, false);
    assert.equal(dict.localNativePveStage, 0);
    assert.equal(dict.oppo.player.stage, 0);
    assert.equal(dict.self.gold, 4982);
    assert.equal(dict.self.wood, 4001);
    assert.equal(dict.units.length, entry.layout.units.length);
    assert.equal(JSON.stringify(dict.walls), JSON.stringify(entry.layout.walls));
    for (const guard of dict.units.filter(u => u.localNativeGuard)) {
        assert.equal(guard.faction, 2);
        assert.ok(dict.units.some(u => String(u.sid) === guard.did));
    }
    const expected = {gold: 0, wood: 0};
    for (const u of dict.units) {
        const family = Math.floor(u.typeid / 100), cfg = ctx.data.unit_main[u.typeid];
        if (![202, 203, 204, 205].includes(family) || u.localNativeGuard) continue;
        const producer = family === 202 || family === 204, gold = family >= 204;
        const amount = Math.floor((producer ? cfg.temp_storage : gold ? cfg.gold_storage : cfg.wood_storage) * (producer ? 80 : 20) / 100);
        assert.equal(producer ? u.sto : u.sto[gold ? 2 : 1], amount);
        expected[gold ? 'gold' : 'wood'] += amount;
    }
    assert.equal(JSON.stringify(dict.localNativeScoutLoot), JSON.stringify(expected));
    dict.units[0].x = -999;
    dict.walls[0][1] = -999;
}
assert.equal(JSON.stringify(pool), snapshot, 'battle mutations do not modify the pool');
assert.equal(JSON.stringify(level), original, 'scouting does not update campaign progress');
console.log('PASS: all/range matching, boundaries, all pool resource totals, guards, walls and isolation');
