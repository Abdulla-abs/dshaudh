const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, 'native_boot.js'), 'utf8');
const dir = path.resolve(__dirname, '../.local/rune-purchase');
const components = fs.readFileSync(path.join(dir, 'Components.js'), 'utf8');
const packageUI = fs.readFileSync(path.join(dir, 'Package.js'), 'utf8');
const copy = x => JSON.parse(JSON.stringify(x));
let disk, rm, pm, player, failWrite = false, queued = [], notices = [];
const ctx = {LocalNative: {}, data: {}, Comp: {PackageManager: function() {}},
    GS_CURRENT_STAGE: 1, GS_STAGE_BUILD: 1, RES_TYPE_DIAMOND: 3,
    G_UnitManager: {getUnitBySID() {return null;}},
    G_MainController: {setNotice(x) {notices.push(x);}}};
vm.createContext(ctx);
vm.runInContext(components.slice(components.indexOf('ALCHEMY_TYPE_MATERIAL='),
    components.indexOf('HERO_LEVEL_OFFSET=')), ctx);
function stock(text, prefix, name) {
    const start = text.indexOf(prefix + name + '=');
    const end = text.indexOf('\n', text.indexOf('    };', start));
    assert.ok(start >= 0 && end > start, name);
    const body = text.slice(start, end).split('=').slice(1).join('=').trim().replace(/;$/, '');
    return vm.runInContext('(' + body + ')', ctx);
}
for (const name of ['getBuySlotPrice', 'addPackageSlot', 'getPackageCapacity', 'getPackageLength'])
    ctx.Comp.PackageManager.prototype[name] = stock(components, 'Comp.PackageManager.prototype.', name);
const confirm = stock(packageUI, 'UI.AlchemyItemContainer.prototype.', 'confirmCall');
for (const name of ['item', 'itemshop_sell', 'item_input', 'input_event_client', 'period_control'])
    vm.runInContext(fs.readFileSync(path.resolve(dir, '../trader', name + '.js'), 'utf8'), ctx);
const n = ctx.LocalNative;
Object.assign(n, {readRaw: () => JSON.parse(disk),
    writeRaw(s) {if (failWrite) throw Error('disk failure'); disk = JSON.stringify(s);},
    writeStatus() {}, copyAccountProgress() {}, unlockHeroFeedIfNeeded() {},
    syncSavedHomeWallet(l) {rm.Res[3] = l.player.diamond; rm.Res[4] = l.player.spirit;}});
function section(a, b) {
    const start = source.indexOf('        LocalNative.' + a);
    const end = source.indexOf('        LocalNative.' + b, start + 1);
    assert.ok(start >= 0 && end > start); vm.runInContext(source.slice(start, end), ctx);
}
section('shopPolicy =', 'shopHeroPools =');
section('runShopRequest =', 'traderPolicy =');
section('traderPolicy =', 'repairPromotionCounter =');
function reset() {
    queued = []; notices = []; failWrite = false;
    const item_dict = {};
    for (let i = 0; i < 60; i++) item_dict['old_' + i] = {oid: 'old_' + i, typeid: 2001 + i, num: 1};
    const level = {player: {diamond: 131307, spirit: 0, package: {
        material: {capacity: 19, item_dict: {}}, based_prop: {capacity: 19, item_dict},
        advanced_prop: {capacity: 100, item_dict: {}}, formula: {capacity: 100, item_dict: {}}}},
        units: [], heros: [], marker: 'preserve'};
    const before = copy(level);
    n.ensurePackageSlotMetadata(level);
    for (const bag of Object.values(level.player.package)) delete bag.buy_slot_time;
    assert.deepEqual(level, before, 'migration changes only missing purchase counts');
    n.ensurePackageSlotMetadata(level);
    const migrated = JSON.stringify(level); n.ensurePackageSlotMetadata(level);
    assert.equal(JSON.stringify(level), migrated, 'migration is idempotent');
    disk = JSON.stringify({version: 1, level});
    pm = new ctx.Comp.PackageManager();
    pm.init = p => {pm.package = copy(p.package);}; pm.init(level.player);
    rm = {Res: {3: 131307, 4: 0}, useRes(num, kind) {
        if (this.Res[kind] < num) return false;
        this.Res[kind] -= num; return true;
    }};
    player = {getComponent: name => ({ResourceManager: rm, PackageManager: pm})[name],
        callServer(method, params) {queued.push(() => n.runShopRequest(player, method, params));}};
    ctx.G_Player = player;
}
function expand(pkgid = 1) {
    confirm.call({master: {curPage: pkgid, reloadPageScrollData() {}}});
    return queued.length ? queued.shift()() : false;
}
reset();
const originalItems = copy(pm.package.based_prop.item_dict);
assert.equal(expand(), true, 'stock confirmation and RPC persist the first expansion');
assert.equal(rm.Res[3], 131207); assert.equal(pm.package.based_prop.capacity, 24);
assert.equal(pm.package.based_prop.buy_slot_time, 1);
assert.deepEqual(pm.package.based_prop.item_dict, originalItems);
// Restart with saved package, then execute all remaining stock price tiers.
pm.init(JSON.parse(disk).level.player);
for (const capacity of [34, 49, 69, 94, 124]) {
    assert.equal(expand(), true); assert.equal(pm.package.based_prop.capacity, capacity);
    if (capacity === 49) assert.throws(() => n.shopAddItem(JSON.parse(disk).level, 7221, 1), /package is full/);
    if (capacity === 69) assert.equal(n.shopAddItem(JSON.parse(disk).level, 7221, 1)[0].num, 1);
}
assert.equal(rm.Res[3], 127407, 'six original tiers cost 3900 in total');
const afterAll = disk;
pm.addPackageSlot(1); assert.equal(queued.length, 0, 'stock maximum prevents seventh expansion');
assert.equal(disk, afterAll);
// The reported offer can now add a new type; the saved reward keeps original inventory.
const purchase = JSON.parse(disk); n.ensureTrader(purchase.level, false);
purchase.level.localTrader.items[0] = [131, 1]; purchase.level.localTrader.discounts[131] = 1;
disk = JSON.stringify(purchase); pm.init(purchase.level.player); rm.Res[3] -= 800;
assert.equal(n.runTraderRequest(player, 'rpc_s_trader_buy', {trader_id: 1, sale_index: 0, sale_id: 131, buy_num: 1}), true);
assert.equal(n.traderItemCount(JSON.parse(disk).level, 7221), 1);
assert.equal(rm.Res[3], 126607); assert.equal(JSON.parse(disk).level.localTrader.items[0][1], 0);
for (const [oid, item] of Object.entries(originalItems)) assert.deepEqual(pm.package.based_prop.item_dict[oid], item);
reset(); const beforeFailure = disk; failWrite = true;
assert.equal(expand(), false); assert.equal(disk, beforeFailure);
assert.equal(rm.Res[3], 131307); assert.equal(pm.package.based_prop.capacity, 19);
assert.equal(pm.package.based_prop.buy_slot_time, 0);
reset(); const unchanged = disk;
assert.equal(n.runShopRequest(player, 'rpc_s_buy_package_slot', {pkgid: 1}), false, 'no optimistic debit');
assert.equal(n.runShopRequest(player, 'rpc_s_buy_package_slot', {pkgid: -1}), false);
assert.equal(n.runShopRequest(player, 'rpc_s_buy_package_slot', {pkgid: 1.5}), false);
assert.equal(disk, unchanged);
reset(); assert.equal(expand(), true); const committed = disk;
assert.equal(n.runShopRequest(player, 'rpc_s_buy_package_slot', {pkgid: 1}), false, 'replayed RPC cannot double charge');
assert.equal(disk, committed); assert.equal(rm.Res[3], 131207);
for (const id of [0, 2, 3]) {reset(); assert.equal(expand(id), true);}
assert.ok(source.includes("methodName === 'rpc_s_buy_package_slot'"), 'RPC is dispatched');
console.log('PASS package slots: stock confirmation/price tiers, legacy migration, restart, rune purchase, rollback, replay, all four bags');
