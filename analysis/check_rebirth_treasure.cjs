const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(__dirname, 'native_boot.js'), 'utf8');
const ctx = {LocalNative: {}, data: {}, Math: Object.create(Math)};
vm.createContext(ctx);
for (const name of ['item', 'item_input', 'input_event_client', 'resource_input'])
    vm.runInContext(fs.readFileSync(path.join(root, '.local/shop-treasure', name + '.js'), 'utf8'), ctx);
const tablesBefore = JSON.stringify(ctx.data);
let seed = 20261019;
ctx.Math.random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
function load(start, end) {
    const a = source.indexOf('        LocalNative.' + start);
    const b = source.indexOf('        LocalNative.' + end, a + 1);
    assert.ok(a >= 0 && b > a);
    vm.runInContext(source.slice(a, b), ctx);
}
load('rebirthTreasurePolicy =', 'shopState =');
load('shopState =', 'shopPick =');
load('shopPick =', 'shopTransaction =');
load('shopRollItemEvent =', 'handleShopBuyPackage =');
const n = ctx.LocalNative;
n.shopAddItem = (level, typeid, num) => {
    assert.ok(ctx.data.item[typeid]);
    assert.ok(Number.isInteger(num) && num > 0);
    level.items.push({typeid, num});
    return {typeid, num};
};
n.grantPveLoot = (gold, wood) => ({gold, wood});
const contract = JSON.parse(fs.readFileSync(path.join(__dirname, 'rpc-contracts/rebirth-treasure.json')));
const expected = {
    1504: [[1, 2, 4], [.25, 1, 2], [0, 0]],
    1505: [[1, 5, 8], [.75, 4, 6], [.10, 0]],
    1506: [[1, 16, 22], [1, 12, 16], [.15, .02]]
};
const results = {};
for (const id of [1504, 1505, 1506]) {
    const policy = n.rebirthTreasurePolicy[id], want = expected[id];
    assert.deepEqual(JSON.parse(JSON.stringify(policy.fragments.map(x => x.slice(1)))), want.slice(0, 2));
    assert.deepEqual(contract.tiers[id].secondFragments, want[0]);
    assert.deepEqual(contract.tiers[id].thirdFragments, want[1]);
    assert.deepEqual(contract.tiers[id].blueprintChance, want[2]);
    const pools = policy.fragments.map(x => ctx.data.item_input[x[0]].item_random_chance);
    for (let tier = 0; tier < 2; tier++) for (const [itemId] of pools[tier]) {
        const fragment = ctx.data.item[itemId];
        assert.equal(fragment.is_piece, 1);
        const material = ctx.data.item[fragment.item_can_compose_to[0]];
        const evolve = ctx.data.item[material.item_can_compose_to[0]];
        const scroll = evolve.item_composition.map(x => ctx.data.item[x[0]]).find(x => x.evolve_scroll_level);
        assert.equal(scroll.evolve_scroll_level, tier + 2, 'original recipe proves rebirth tier');
    }
    const counts = [0, 0, 0, 0], ranges = [[Infinity, 0], [Infinity, 0]];
    const runs = 20000;
    for (let run = 0; run < runs; run++) {
        const level = {player: {diamond: 0, spirit: 0}, items: []};
        const ans = n.shopTreasureRewards(level, id);
        assert.ok(ans.length);
        for (let tier = 0; tier < 2; tier++) {
            const reward = level.items.filter(x => pools[tier].some(([key]) => key === x.typeid));
            assert.ok(reward.length <= 1);
            if (reward.length) {
                counts[tier]++;
                assert.ok(reward[0].num >= want[tier][1] && reward[0].num <= want[tier][2]);
                ranges[tier][0] = Math.min(ranges[tier][0], reward[0].num);
                ranges[tier][1] = Math.max(ranges[tier][1], reward[0].num);
            }
        }
        for (const reward of level.items) {
            const tier = ctx.data.item[reward.typeid].evolve_scroll_level;
            if (tier) { counts[tier]++; assert.equal(reward.num, 1); }
        }
    }
    const rates = counts.map(x => x / runs);
    for (let i = 0; i < 4; i++) {
        const chance = i < 2 ? want[i][0] : want[2][i - 2];
        assert.ok(Math.abs(rates[i] - chance) < .015, 'observed rate agrees with configured probability');
        if (chance === 0 || chance === 1) assert.equal(rates[i], chance);
    }
    assert.deepEqual(ranges, want.slice(0, 2).map(x => x.slice(1)));
    results[id] = {runs, rates, ranges};
}
assert.equal(JSON.stringify(ctx.data), tablesBefore, 'original tables remain intact');
fs.mkdirSync(path.join(root, '.local/rebirth-treasure'), {recursive: true});
fs.writeFileSync(path.join(root, '.local/rebirth-treasure/check-result.json'), JSON.stringify(results, null, 2));
console.log('PASS: original recipe tiers, contract, quantities, independent rolls, blueprint rates and unchanged tables');
console.log(JSON.stringify(results));
