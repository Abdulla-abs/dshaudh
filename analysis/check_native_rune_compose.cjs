const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
let disk, pm, gold, failWrite, answers, effects, actualRune;
const ui = {playing: true, refreshButtonGray() {this.enabled = true;}, afterReceComposeResult() {effects++;}};
const ctx = {LocalNative: {}, data: {}, Math, GS_CURRENT_STAGE: 1, GS_STAGE_BUILD: 1,
    Comp: {PackageManager: function() {}}, ClientPlayer: function() {},
    UI: {AlchemyCompound: {UIID: 1}, AlchemyInterface: {UIID: 2}},
    G_UIManager: {isUIOpen: id => id === 1, get_ui: () => ui},
    G_MainController: {setNotice() {}},
    G_UnitManager: {getUnitBySID: () => ({getComponent: () => ({})})}};
vm.createContext(ctx);
for (const name of ['item', 'item_input', 'input_event_client'])
    vm.runInContext(fs.readFileSync(`${__dirname}/../.local/shop-treasure/${name}.js`, 'utf8'), ctx);
vm.runInContext(fs.readFileSync(`${__dirname}/../.local/layout-editor/runes/equipment_attribute.js`, 'utf8'), ctx);
vm.runInContext(source.slice(source.indexOf('        LocalNative.shopPolicy ='),
    source.indexOf('        // Stock Trader UI')), ctx);
const n = ctx.LocalNative;
Object.assign(n, {readRaw: () => JSON.parse(disk), writeRaw: s => {
    if (failWrite) throw Error('disk failure'); disk = JSON.stringify(s);
}, writeStatus() {}, copyAccountProgress() {}, unlockHeroFeedIfNeeded() {},
snapshotBuildingRecord: () => ({sid: 'bank', sto: {2: gold}}),
syncSavedHomeWallet: level => {gold = level.units[0].sto[2];}});
// Exercise the stock response and UI animation path.
for (const [file, first, next] of [
    ['../.local/hero-equip-slot/Components.js', 'Comp.PackageManager.prototype.composeEquipmentAns=', 'Comp.PackageManager.prototype.getPiecesList='],
    ['../.local/trader/ClientPlayer.js', 'ClientPlayer.prototype.rpc_c_compose_equipment_ans=', 'ClientPlayer.prototype.rpc_c_compose_skillbook_ans=']]) {
    const s = fs.readFileSync(`${__dirname}/${file}`, 'utf8'), a = s.indexOf(first), b = s.indexOf(next, a);
    assert.ok(a >= 0 && b > a); vm.runInContext(s.slice(a, b), ctx);
}
ctx.G_EventManager = {inputAward(ans) {
    assert.equal(ans[0][0], 19);
    for (const item of ans[0][1]) {
        assert.equal(count(5001), 5, 'stock callback sees consumed pieces');
        assert.equal(count(7101), 0, 'blueprint consumed before award');
        assert.ok(!pm.package.advanced_prop.item_dict[item.oid], 'no duplicate reward');
        actualRune = JSON.parse(JSON.stringify(item));
        pm.package.advanced_prop.item_dict[item.oid] = actualRune;
    }
}};
const player = {getComponent: name => name === 'PackageManager' ? pm : name === 'ResourceManager' ? {Res: {2: gold, 3: 100, 4: 50}} : null,
    rpc_c_compose_equipment_ans(d) {answers++; ctx.ClientPlayer.prototype.rpc_c_compose_equipment_ans.call(this, d);}};
ctx.G_Player = player;
function count(id) {return Object.values(pm.package).flatMap(b => Object.values(b.item_dict)).filter(i => i.typeid === id).reduce((a, i) => a + i.num, 0);}
function reset() {
    failWrite = false; answers = effects = 0; actualRune = null; gold = 800000; ui.playing = true; ui.enabled = false;
    pm = {package: {based_prop: {capacity: 100, item_dict: {
        a: {oid: 'a', typeid: 5001, num: 20}, b: {oid: 'b', typeid: 5001, num: 15},
        c: {oid: 'c', typeid: 2003, num: 10}}},
        advanced_prop: {capacity: 100, item_dict: {}}, formula: {capacity: 100, item_dict: {d: {oid: 'd', typeid: 7101, num: 1}}}},
        init(p) {this.package = JSON.parse(JSON.stringify(p.package));},
        composeEquipmentAns: ctx.Comp.PackageManager.prototype.composeEquipmentAns};
    disk = JSON.stringify({level: {player: {package: pm.package}, units: [{sid: 'bank', sto: {2: 1000000}}]}});
}
const req = {equip_id: 7031, hero_pieces: {5001: 30}, prop_pieces: {2003: 10}};
const generate = n.generateComposedRune;
// Transaction tests use a fixed original-table candidate; generation tested separately.
n.generateComposedRune = () => ({typeid: 7001, base_attr: [1101], two_attr: [], three_attr: [], hero_attr: 0});
reset(); assert.equal(n.runShopRequest(player, 'rpc_s_compose_equipment', req), true);
assert.equal(count(5001), 5); assert.equal(count(2003), 0); assert.equal(count(7101), 0);
assert.equal(count(7001), 1); assert.equal(gold, 800000, 'stock prepayment is not charged twice');
assert.equal(answers, 1); assert.equal(effects, 1);
assert.deepEqual(JSON.parse(disk).level.player.package.advanced_prop.item_dict[actualRune.oid].base_attr, [1101]);
const committed = disk; assert.equal(n.runShopRequest(player, 'rpc_s_compose_equipment', req), false); assert.equal(disk, committed);
for (const request of [{...req, equip_id: 1109}, {...req, hero_pieces: {5001: 29}},
    {...req, prop_pieces: {5001: 30}}, {...req, hero_pieces: {5001: -1}},
    {...req, prop_pieces: {2003: 11}}, {...req, hero_pieces: {5001: 30.5}}]) {
    reset(); const before = disk;
    assert.equal(n.runShopRequest(player, 'rpc_s_compose_equipment', request), false);
    assert.equal(disk, before); assert.equal(gold, 1000000); assert.equal(answers, 0); assert.equal(ui.playing, false);
}
for (const failure of ['write', 'capacity', 'blueprint']) {
    reset();
    if (failure === 'write') failWrite = true;
    if (failure === 'capacity') {pm.package.advanced_prop.capacity = 0; disk = JSON.stringify({...JSON.parse(disk), level: {...JSON.parse(disk).level, player: {package: pm.package}}});}
    if (failure === 'blueprint') {pm.package.formula.item_dict = {}; disk = JSON.stringify({...JSON.parse(disk), level: {...JSON.parse(disk).level, player: {package: pm.package}}});}
    const before = disk;
    assert.equal(n.runShopRequest(player, 'rpc_s_compose_equipment', req), false);
    assert.equal(disk, before); assert.equal(gold, 1000000); assert.equal(answers, 0); assert.equal(ui.playing, false);
}
n.generateComposedRune = generate;
const random = ctx.Math;
ctx.Math = Object.create(Math);
const recipes = Object.entries(ctx.data.item).filter(([id, cfg]) => cfg.item_subID === 9 && !cfg.rune_type && cfg.item_composition);
assert.equal(recipes.length, 15);
for (const [id, cfg] of recipes) {
    const seen = new Set();
    for (const roll of [0, 0.5, 0.999999]) {
        ctx.Math.random = () => roll;
        const rune = n.generateComposedRune(Number(id)), target = ctx.data.item[rune.typeid];
        seen.add(rune.typeid);
        assert.equal(target.item_form, cfg.item_form); assert.equal(target.item_level, cfg.item_level);
        for (const [layer, field] of [['base_attr', 'att_basic_color'], ['two_attr', 'att_evolve2_color'], ['three_attr', 'att_evolve3_color']]) {
            assert.equal(rune[layer].length, 1);
            assert.ok(ctx.data.equipment_attribute[rune[layer][0]][field] > 0);
        }
        assert.equal(rune.hero_attr, 0);
    }
    assert.equal(seen.size, 3);
}
ctx.Math = random;
reset(); assert.equal(n.runShopRequest(player, 'rpc_s_compose_equipment', req), true);
assert.equal(actualRune.base_attr.length, 1); assert.equal(actualRune.two_attr.length, 1); assert.equal(actualRune.three_attr.length, 1);
assert.match(source, /methodName === 'rpc_s_compose_equipment'/);
console.log('PASS: rune stock callback, split stacks, weighted fragment points, blueprint, persisted award, single debit and failure rollback');
console.log('PASS: all 15 rune recipes, all 45 candidate runes and original-table attribute layers');
