// Inspect the current PVE implementation using locally decoded original tables.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const context = {data: {}, LocalNative: {}, Math: Object.create(Math)};
vm.createContext(context);
for (const file of [
    '.local/layout-editor/skill-info/string_data.js',
    '.local/shop-treasure/item.js',
    '.local/hero-guide-entry/pve_stage.js',
    '.local/hero-guide-entry/item_input.js',
    '.local/shop-treasure/input_event_client.js'
]) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
const source = fs.readFileSync(path.join(root, 'analysis/native_boot.js'), 'utf8');
function load(start, end) {
    const a = source.indexOf('LocalNative.' + start + ' =');
    const b = source.indexOf('LocalNative.' + end + ' =', a);
    assert.ok(a >= 0 && b > a);
    vm.runInContext(source.slice(a, b), context);
}
load('pveSweepPolicy', 'snapshotPveSweepTili');
load('rollPveSweepItems', 'handlePveSweep');
load('applyPveItemReward', 'applyPveHeroRewards');
load('shopAddItem', 'shopHeroPools');
const {data: d, LocalNative: n} = context;
n.shopState = level => level.localShop || (level.localShop = {sequence: 0});
function rolls(values, fn) {
    let at = 0;
    context.Math.random = () => values[at++] ?? 0.999999;
    return fn();
}
const total = (level, typeid) => Object.values(level.player.package || {}).reduce((sum, bag) =>
    sum + Object.values(bag.item_dict).filter(x => x.typeid === typeid).reduce((s, x) => s + x.num, 0), 0);
function bookOnlyTape(pools, value) {
    // Miss the ordinary and rare branches, then probe the independent book boundary.
    return [0.999999, ...(pools.rare.length ? [0.999999] : []), value, 0];
}
const bookId = 210000;
assert.equal(d.item[bookId].item_name, 'update_book_name');
const rows = [];
for (const [key, stage] of Object.entries(d.pve_stage)) {
    const id = Number(key);
    if (!Number.isFinite(id)) continue;
    const pools = n.collectPveSweepLootPools(id);
    const books = pools.ordinary.filter(x => x.typeid === bookId);
    const rate = id >= n.pveSweepPolicy.dropFromStage && books.length
        ? n.pveSweepPolicy.knowledgeBookRate : 0;
    const manual = ['pve_first_reward', 'pve_roll_reward'].map(field => rolls([], () => {
        const level = {player: {}};
        n.applyPveBattleItemRewards(level, stage[field], id);
        return total(level, bookId);
    }));
    if (rate > 0) {
        for (const [value, expected] of [[0.329999, true], [0.33, false], [0.999999, false]]) {
            const level = {player: {}};
            const result = rolls(bookOnlyTape(pools, value), () => n.rollPveSweepItems(level, id));
            assert.equal(result.dropped.some(x => x.typeid === bookId), expected, `sweep ${id} boundary ${value}`);
            const battle = {player: {}};
            rolls(bookOnlyTape(pools, value), () => n.applyPveBattleItemRewards(battle, stage.pve_roll_reward, id));
            assert.equal(total(battle, bookId) > 0, expected, `battle ${id} boundary ${value}`);
            assert.equal(total(JSON.parse(JSON.stringify(battle)), bookId), total(battle, bookId), 'saved item survives reload');
        }
        // Exhaust all 100 percentage points with ordinary/rare rolls missed.
        let hits = 0;
        for (let i = 0; i < 100; i++) {
            const level = {player: {}};
            const result = rolls(bookOnlyTape(pools, (i + 0.5) / 100), () => n.rollPveSweepItems(level, id));
            if (result.dropped.some(x => x.typeid === bookId)) hits++;
        }
        assert.equal(hits, 33, `sweep ${id} exact 33 percent partition`);
        // Keep the old ordinary threshold AND every candidate's share unchanged.
        for (const value of [0, 0.333332, 0.333334, 0.349999, 0.35, 0.999999]) {
            for (let i = 0; i < pools.ordinary.length; i++) {
                const level = {player: {}};
                const result = rolls([value, (i + 0.5) / pools.ordinary.length, 0.999999, 0.999999],
                    () => n.rollPveSweepItems(level, id));
                const expected = value < (stage.green_pro ?? n.pveSweepPolicy.ordinaryRateFallback)
                    && pools.ordinary[i].typeid !== bookId;
                assert.equal(result.dropped.some(x => x.kind === 'ordinary'), expected, `unchanged skill ${id}/${i}/${value}`);
            }
        }
    }
    rows.push({stage: id, ordinaryRate: stage.green_pro ?? n.pveSweepPolicy.ordinaryRateFallback,
        ordinaryPool: JSON.parse(JSON.stringify(pools.ordinary)), bookRate: rate,
        manualFirstFixedBooks: manual[0], manualRepeatFixedBooks: manual[1]});
}
const groups = new Map();
for (const row of rows) {
    const key = JSON.stringify({rate: row.bookRate, quantities: row.ordinaryPool.filter(x => x.typeid === bookId).map(x => x.num)});
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row.stage);
}
const report = {item: {id: bookId, name: d.string_data.update_book_name.Chinese},
    scope: 'Current local source; no device execution or official server probability recovery',
    groups: [...groups].map(([key, stages]) => ({...JSON.parse(key), stages})), rows};
// Stage 7 first win retains exactly one fixed book and one fixed skill, without
// granting the entire shared random pool or confusing event id 8019 with an item id.
const first7 = {player: {}};
rolls([], () => n.applyPveBattleItemRewards(first7, d.pve_stage[7].pve_first_reward, 7));
assert.equal(total(first7, bookId), 1);
assert.equal(total(first7, 200149), 1);
assert.equal(total(first7, 200122), 0);
const both = {player: {}};
const bothResult = rolls([0, 0, 0, 0], () => n.rollPveSweepItems(both, 9));
assert.equal(total(both, 200145), 1);
assert.equal(total(both, bookId), 1);
assert.equal(bothResult.dropped.length, 2);
const out = path.join(root, '.local/pve-book33');
fs.mkdirSync(out, {recursive: true});
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({item: report.item, stageCount: rows.length,
    groups: report.groups.map(group => ({rate: group.rate, quantities: group.quantities,
        stageCount: group.stages.length, examples: group.stages.slice(0, 6)})),
    eligibleBookStages: rows.filter(x => x.bookRate > 0).length,
    report: '.local/pve-book33/report.json'}, null, 2));
