const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, 'native_boot.js'), 'utf8');
const dir = path.resolve(__dirname, '../.local/trader');
let disk, player, rm, pm, now = 1800000000000, rng = 0, failWrite = false, acknowledgments = [];
const ctx = {LocalNative: {}, data: {}, Math: Object.create(Math),
    Date: {now: () => now}, GS_CURRENT_STAGE: 1, GS_STAGE_BUILD: 1,
    G_UnitManager: {getUnitBySID: () => null},
    G_MainController: {setNotice() {}}, G_UIManager: {isUIOpen: () => false}, UI: {Trader: {TraderInterface: {UIID: 1}}}};
ctx.Math.random = () => rng;
vm.createContext(ctx);
for (const name of ['itemshop', 'itemshop_sell', 'itemshop_collect', 'itemshop_coin', 'item',
    'item_input', 'input_event_client', 'period_control'])
    vm.runInContext(fs.readFileSync(path.join(dir, name + '.js'), 'utf8'), ctx);
const n = ctx.LocalNative;
const copy = x => JSON.parse(JSON.stringify(x));
const read = () => JSON.parse(disk);
Object.assign(n, {readRaw: read, writeRaw: s => {if (failWrite) throw Error('disk failure'); disk = JSON.stringify(s);},
    copyAccountProgress() {}, writeStatus() {},
    syncSavedHomeWallet: level => {rm.Res[3] = level.player.diamond; rm.Res[4] = level.player.spirit;}});
function section(a, b) {
    const start = source.indexOf('        LocalNative.' + a);
    const end = source.indexOf('        LocalNative.' + b, start + 1);
    assert.ok(start >= 0 && end > start); vm.runInContext(source.slice(start, end), ctx);
}
section('shopPolicy =', 'shopHeroPools =');
section('traderPolicy =', 'repairPromotionCounter =');
function stock(name) {
    const text = fs.readFileSync(path.join(dir, 'ClientPlayer.js'), 'utf8');
    const start = text.indexOf('ClientPlayer.prototype.' + name + '=');
    const end = text.indexOf('\nClientPlayer.prototype.', start + 1);
    return vm.runInContext('(' + text.slice(start, end).substring(text.slice(start, end).indexOf('function')).trim().replace(/;$/, '') + ')', ctx);
}
function reset() {
    now = 1800000000000; rng = 0; failWrite = false; acknowledgments = [];
    disk = JSON.stringify({version: 1, marker: 'preserve', level: {
        player: {diamond: 50000, spirit: 50, package: {}, event_counters: {}},
        units: [], heros: [{sid: 'dino'}], user_config: {rookie0: 123}}});
    rm = {Res: {1: 999999, 2: 999999, 3: 50000, 4: 50}};
    pm = {package: {}, init(p) {this.package = copy(p.package);},
        addItemsByServer(items) {for (const item of items) this.addItem(item);},
        addItem(item) {acknowledgments.push(copy(item));}};
    const der = {event_counters: {}, last_update_time: now / 1000};
    player = {getComponent: name => ({ResourceManager: rm, PackageManager: pm, DailyEventRecorder: der})[name],
        rpc_c_refresh_daily_event(dict) {const group = ctx.data.period_control[dict.event_id].period_type;
            der.event_counters[group] ||= {}; der.event_counters[group][dict.event_id] = copy(dict.event_counter);
            der.last_update_time = dict.last_update_time;}};
    ctx.G_Player = player;
    for (const name of ['rpc_c_trader_buy_ans', 'rpc_c_coin_exchange_ans', 'rpc_c_buy_coin_shop_item_ans'])
        player[name] = stock(name);
}
function call(method, params = {}) {return n.runTraderRequest(player, method, vm.runInContext('(' + JSON.stringify(params) + ')', ctx));}
function refresh(paid = false) {if (paid) rm.Res[3] -= 80; return call(paid ? 'rpc_s_reset_trader' : 'rpc_s_refresh_trader', {trader_id: 1});}
function count(id) {return n.traderItemCount(read().level, id);}
function debit(id, num) {
    for (const bag of Object.values(pm.package)) for (const [oid, item] of Object.entries(bag.item_dict)) {
        if (item.typeid !== id) continue;
        const take = Math.min(num, item.num); item.num -= take; num -= take;
        if (!item.num) delete bag.item_dict[oid]; if (!num) return;
    }
    throw Error('missing test item');
}
function add(id, num) {const s = read(); n.shopAddItem(s.level, id, num); n.writeRaw(s); n.shopSync(player, s.level);}
function buySlot(index = 0) {
    const s = read().level.localTrader, id = s.items[index][0], cfg = ctx.data.itemshop_sell[id];
    rm.Res[cfg.price_kind] -= Math.max(1, Math.ceil(cfg.price_num * s.discounts[id]));
    return call('rpc_s_trader_buy', {trader_id: 1, sale_index: index, sale_id: id, buy_num: 1});
}
reset(); n.installTraderPolicy(); assert.equal(ctx.data.itemshop[1].refresh_price, 80);
assert.equal(refresh(), true);
const first = copy(read().level.localTrader);
assert.equal(first.items.length, 8); assert.equal(new Set(first.items.map(x => x[0])).size, 8);
assert.equal(refresh(), true); assert.deepEqual(read().level.localTrader, first);
assert.equal(buySlot(), true);
assert.equal(count(1101), 5); assert.equal(rm.Res[3], 49980);
assert.equal(read().level.localTrader.items[0][1], 0);
assert.equal(buySlot(), false); assert.equal(count(1101), 5); assert.equal(rm.Res[3], 49980);
assert.equal(refresh(), true); assert.equal(read().level.localTrader.items[0][1], 0);
// A fresh runtime gets the same stock, discounts, and sold flags from disk.
const saved = copy(read()); pm.init(saved.level.player);
assert.equal(n.ensureTrader(saved.level, false), false); assert.deepEqual(saved.level.localTrader, read().level.localTrader);
assert.equal(refresh(true), true); assert.equal(rm.Res[3], 49900);
assert.equal(read().level.localTrader.items[0][1], 1);
failWrite = true; assert.equal(refresh(true), false); failWrite = false;
assert.equal(rm.Res[3], 49900); assert.equal(read().level.localTrader.items[0][1], 1);
const beforeAuto = rm.Res[3]; now += 28800000;
assert.equal(refresh(), true); assert.equal(rm.Res[3], beforeAuto);
assert.equal(read().level.localTrader.bucket, first.bucket + 1);
// Exercise every weighted stock offer against its original input event and currency.
for (const [id, cfg] of Object.entries(ctx.data.itemshop_sell)) {
    if (!(cfg.weight > 0) && ![134, 135].includes(Number(id))) continue;
    reset(); refresh(); const s = read();
    s.level.localTrader.items[0] = [Number(id), 1]; s.level.localTrader.discounts[id] = 0.8;
    n.ensureTrader(s.level, false); n.writeRaw(s); n.syncTrader(player, s.level);
    assert.equal(buySlot(), true, 'sale ' + id);
    assert.equal(count(cfg.item_id), cfg.item_num, 'quantity ' + id);
}
reset(); refresh(); add(2001, 10); debit(2001, 3);
assert.equal(call('rpc_s_coin_exchange', {items: [[2001, 3]]}), true);
assert.equal(count(2001), 7); assert.equal(count(1123), 180);
assert.equal(call('rpc_s_coin_exchange', {items: [[2001, 3]]}), false); // no second debit
assert.equal(count(1123), 180);
debit(1123, 120);
assert.equal(call('rpc_s_buy_coin_shop_item', {sale_id: 2, buy_num: 1}), true);
assert.equal(count(1123), 60); assert.equal(count(2001), 9); // original event grants two fragments
// Failed purchase/recycle restores optimistic inventory changes and keeps saved rewards untouched.
debit(2001, 2); failWrite = true;
assert.equal(call('rpc_s_coin_exchange', {items: [[2001, 2]]}), false); failWrite = false;
assert.equal(n.traderItemCount({player: {package: pm.package}}, 2001), 9);
assert.equal(count(1123), 60);
assert.equal(call('rpc_s_coin_exchange', {items: [[2001, -1]]}), false);
assert.equal(call('rpc_s_coin_exchange', {items: [[99999, 1]]}), false);
// Cover later coin-shop rows without events and multi-purchase quantities.
for (const [id, cfg] of Object.entries(ctx.data.itemshop_coin)) {
    if (!(Number(id) > 0)) continue;
    reset(); refresh(); add(1123, cfg.price_num * 3); debit(1123, cfg.price_num * 2);
    assert.equal(call('rpc_s_buy_coin_shop_item', {sale_id: Number(id), buy_num: 2}), true, 'coin sale ' + id);
    assert.equal(count(1123), cfg.price_num);
    assert.ok(count(cfg.item_id) >= 2);
}
reset(); refresh();
const unchanged = disk;
assert.equal(call('rpc_s_trader_buy', {trader_id: 1, sale_index: 0, sale_id: 1, buy_num: 1}), false); // no payment
assert.equal(disk, unchanged);
// Reward capacity failure must roll back the fee and sold flag.
pm.package = {material: {capacity: 0, item_dict: {}}};
assert.equal(buySlot(), false); assert.equal(rm.Res[3], 50000);
assert.equal(read().level.localTrader.items[0][1], 1);
assert.equal(read().marker, 'preserve'); assert.equal(read().level.heros[0].sid, 'dino');
console.log('PASS trader: 96 stock offers, 95 coin offers, refresh/reload, optimistic debits, replay, disk/capacity rollback');

// Added fruit offers use the stock purchase answer and transaction guarantees.
for (const [sale, item, cost] of [[134, 210021, 1200], [135, 210022, 6000]]) {
    reset(); refresh(); const s = read();
    s.level.localTrader.items[0] = [sale, 1]; s.level.localTrader.discounts[sale] = 1;
    n.writeRaw(s); n.syncTrader(player, s.level);
    const pending = disk;
    failWrite = true; assert.equal(buySlot(), false); failWrite = false;
    assert.equal(disk, pending); assert.equal(rm.Res[3], 50000);
    assert.equal(read().level.localTrader.items[0][1], 1);
    assert.equal(buySlot(), true); assert.equal(count(item), 1);
    assert.equal(rm.Res[3], 50000 - cost);
    assert.equal(buySlot(), false); assert.equal(count(item), 1);
    const savedFruit = copy(read()); pm.init(savedFruit.level.player);
    assert.equal(n.ensureTrader(savedFruit.level, false), false);
    assert.equal(n.traderItemCount(savedFruit.level, item), 1);
    assert.equal(savedFruit.level.localTrader.items[0][1], 0);
    assert.ok(acknowledgments.some(x => x.typeid === item && x.num === 1), 'stock answer adds the fruit');
}
console.log('PASS fruit purchases: original answer, exact price/quantity, failed save refund, sold replay, reload');
