const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, 'native_boot.js'), 'utf8');
const dir = path.resolve(__dirname, '../.local/trader');
const out = path.resolve(__dirname, '../.local/trader-fruits');
fs.mkdirSync(out, {recursive: true});
let seed = 210021;
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
load('shopPick =', 'shopTransaction ='); load('traderPolicy =', 'syncTrader =');
const n = ctx.LocalNative;
const stock = JSON.stringify(ctx.data.itemshop_sell);
assert.ok(!ctx.data.itemshop_sell[134] && !ctx.data.itemshop_sell[135], 'local sale IDs do not collide with stock');
n.installTraderPolicy();
const originalRows = JSON.parse(JSON.stringify(ctx.data.itemshop_sell));
delete originalRows[134]; delete originalRows[135];
assert.equal(JSON.stringify(originalRows), stock);
assert.equal(ctx.data.itemshop_sell[134].item_id, 210021);
assert.equal(ctx.data.itemshop_sell[135].item_id, 210022);
assert.equal(ctx.data.itemshop_sell[134].price_num, 1200);
assert.equal(ctx.data.itemshop_sell[135].price_num, 6000);
// Probe reference events independently of main offers. Fruits can appear
// together even when the main selection has no rune.
const pick = n.pickTraderOfferIds, random = ctx.Math.random;
let samples = [[1, 2, 3, 4, 5, 6, 7, 8], [131], [131], [131], [131], [131]];
n.pickTraderOfferIds = () => samples.shift(); ctx.Math.random = () => 0;
const probe = {player: {}}; n.ensureTrader(probe, true);
assert.ok(probe.localTrader.items.some(x => x[0] === 134));
assert.ok(probe.localTrader.items.some(x => x[0] === 135));
assert.ok(!probe.localTrader.items.some(x => x[0] === 131));
samples = [[131, 2, 3, 4, 5, 6, 7, 8], [131], [131], [131], [131], [131]];
const protectedRune = {player: {}}; n.ensureTrader(protectedRune, true);
assert.ok(protectedRune.localTrader.items.some(x => x[0] === 131), 'fruit insertion preserves rune occurrence');
const serialized = JSON.stringify(protectedRune.localTrader);
assert.equal(n.ensureTrader(protectedRune, false), false);
assert.equal(JSON.stringify(protectedRune.localTrader), serialized, 'same refresh persists local offers');
n.pickTraderOfferIds = pick; ctx.Math.random = random;
const trials = 20000, counts = {7221: 0, 210021: 0, 210022: 0};
for (let i = 0; i < trials; i++) {
    const level = {player: {}}; n.ensureTrader(level, true);
    const ids = level.localTrader.items.map(x => x[0]);
    assert.equal(ids.length, 8); assert.equal(new Set(ids).size, 8);
    for (const id of ids) {
        const item = ctx.data.itemshop_sell[id].item_id;
        if (Object.hasOwn(counts, item)) counts[item]++;
    }
}
const rates = Object.fromEntries(Object.entries(counts).map(([k, v]) => [k, v / trials]));
assert.ok(Math.abs(rates[210021] / rates[7221] - 1 / 3) < 0.025);
assert.ok(Math.abs(rates[210022] / rates[7221] - 1 / 6) < 0.02);
const summary = {seed: 210021, trials, rates, counts,
    mathematicalRatios: {primary: 'p/3', advanced: 'p/6'},
    note: 'p is rune inclusion probability under the existing eight-offer weighted selection. Reference samples are independent; fruit insertion never replaces rune.'};
fs.writeFileSync(path.join(out, 'probability.json'), JSON.stringify(summary, null, 2));
console.log('PASS fruit selection: ' + JSON.stringify(summary));
