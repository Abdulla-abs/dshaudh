const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, 'native_boot.js'), 'utf8');
const dir = path.resolve(__dirname, '../.local/trader');
let seed = 7241;
const ctx = {LocalNative: {}, data: {}, Math: Object.create(Math)};
ctx.Math.random = () => {seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296;};
vm.createContext(ctx);
for (const name of ['item', 'itemshop_sell', 'period_control'])
    vm.runInContext(fs.readFileSync(path.join(dir, name + '.js'), 'utf8'), ctx);
function load(first, next) {
    const start = source.indexOf('        LocalNative.' + first);
    const end = source.indexOf('        LocalNative.' + next, start + 1);
    assert.ok(start >= 0 && end > start); vm.runInContext(source.slice(start, end), ctx);
}
load('shopPick =', 'shopTransaction =');
load('traderPolicy =', 'syncTrader =');
const n = ctx.LocalNative;
n.installTraderPolicy();
const tableBefore = JSON.stringify(ctx.data.itemshop_sell);
const multiplier = n.traderPolicy.runeFragmentWeightMultiplier;
assert.equal(multiplier, 3);
const trials = 10000;
function sample(factor) {
    seed = 7241; n.traderPolicy.runeFragmentWeightMultiplier = factor;
    let hits = 0;
    for (let i = 0; i < trials; i++) {
        const level = {player: {}}; n.ensureTrader(level, true);
        assert.equal(level.localTrader.items.length, 8);
        assert.equal(new Set(level.localTrader.items.map(x => x[0])).size, 8);
        if (level.localTrader.items.some(([id]) => ctx.data.itemshop_sell[id].item_id === 7221)) hits++;
    }
    return hits / trials;
}
const before = sample(1), after = sample(multiplier);
assert.ok(after > before * 1.7 && after < 0.8, 'boost increases visibility without guaranteeing an offer');
assert.equal(JSON.stringify(ctx.data.itemshop_sell), tableBefore, 'original prices, quantities and discounts are preserved');
const level = {player: {}}; n.ensureTrader(level, true);
level.localTrader.items[0][1] = 0;
const offers = JSON.stringify(level.localTrader);
assert.equal(n.ensureTrader(level, false), false);
assert.equal(JSON.stringify(level.localTrader), offers, 'reload keeps existing offers and sold status');
assert.equal(ctx.data.itemshop_sell[131].price_num, 800);
assert.equal(ctx.data.itemshop_sell[131].item_num, 1);
assert.equal(n.traderPolicy.refreshPrice, 80); assert.equal(n.traderPolicy.interval, 28800);
const result = {trials, seed: 7241, multiplier, originalWeight: 3000, effectiveWeight: 9000,
    before, after, note: 'Seeded simulation per eight-offer refresh; not an exact probability or an official rate.'};
fs.writeFileSync(path.resolve(dir, '../rune-purchase/probability.json'), JSON.stringify(result, null, 2));
console.log('PASS rune trader: ' + JSON.stringify(result));
