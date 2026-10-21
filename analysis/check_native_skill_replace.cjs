const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');

const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
const tables = path.resolve(__dirname, '../.local/shop-treasure');
const ctx = {
    LocalNative: {},
    data: {},
    GS_CURRENT_STAGE: 1,
    GS_STAGE_BUILD: 1,
    G_UnitManager: {getUnitBySID() { return null; }},
    G_MainController: {setNotice() {}}
};
vm.createContext(ctx);
for (const name of ['item', 'skill_input', 'input_event_client', 'skill_to_hero', 'skill_data',
    'skill_lv_client', 'hero_to_skill', 'unit_main'])
    vm.runInContext(fs.readFileSync(`${tables}/${name}.js`, 'utf8'), ctx);

function load(name, next) {
    const a = source.indexOf(`        LocalNative.${name} = function`);
    const b = source.indexOf(`        LocalNative.${next} = function`, a + 1);
    assert.ok(a >= 0 && b > a, name);
    vm.runInContext(source.slice(a, b), ctx);
}
load('normalizeHeroSkillSlots', 'getMaxSunshineCapacity');
load('ensureHeroSkill', 'makeHomeInitDict');
load('resolveSkillBookReplaceId', 'isSkillEnforceBook');
load('isSkillEnforceBook', 'applySkillBookUse');
load('applySkillBookUse', 'handleShopUseItem');
load('handleShopUseItem', 'runShopRequest');

const n = ctx.LocalNative;
n.writeStatus = () => {};
n.shopPolicy = {maxBatch: 100};
n.shopState = (level) => level.localShopState || (level.localShopState = {sequence: 0});
n.shopTransaction = (player) => JSON.parse(JSON.stringify(player.__store));
n.shopSync = () => {};
n.shopShowPending = () => {};
n.shopTreasureRewards = () => { throw new Error('treasure path'); };
n.shopRollHeroes = () => [];
n.copyAccountProgress = () => {};
n.syncSavedHomeWallet = () => {};
n.readRaw = () => ({level: {}});
n.writeRaw = (store) => { disk = store; };

assert.equal(n.resolveSkillBookReplaceId(200123), 123);
assert.equal(n.isSkillEnforceBook(210000), true);
assert.equal(n.resolveSkillBookReplaceId(210000), 0);

let disk = null;
const level = {
    player: {
        diamond: 100,
        spirit: 50,
        package: {
            material: {item_dict: {}},
            based_prop: {item_dict: {}},
            advanced_prop: {item_dict: {book1: {oid: 'book1', typeid: 200123, num: 1}}},
            formula: {item_dict: {}}
        }
    },
    heros: [{sid: 'hero_slot_1', typeid: 10401, skill_slots: [{sid: 10000, lv: 1, exp: 0}]}],
    units: []
};
const player = {
    __store: {version: 1, level: JSON.parse(JSON.stringify(level))},
    rpc_c_use_item_ans: null
};
player.rpc_c_use_item_ans = (dict) => { player.lastAns = dict; };

assert.equal(n.handleShopUseItem(player, {
    pkgid: 2, oid: 'book1', num: 1, params: {hero_id: 'hero_slot_1', slot_index: 0}
}), true);
assert.equal(disk.level.heros[0].skill_slots[0].sid, 123);
assert.equal(disk.level.heros[0].skill_id, 12301);
assert.ok(!disk.level.player.package.advanced_prop.item_dict.book1);
assert.equal(player.lastAns.ans.length, 1);
assert.equal(player.lastAns.ans[0][0], 7);
assert.equal(player.lastAns.ans[0][1].operation, 'replace');
assert.equal(player.lastAns.ans[0][1].hero_id, 'hero_slot_1');
assert.equal(player.lastAns.ans[0][1].slot_index, 0);
assert.equal(player.lastAns.ans[0][1].skill_id, 123);
assert.ok(source.includes("operation: 'replace'"));
assert.ok(source.includes('resolveSkillBookReplaceId'));

console.log('PASS: skill book rpc_s_use_item returns INPUT_TYPE_SKILL replace and persists slot');
