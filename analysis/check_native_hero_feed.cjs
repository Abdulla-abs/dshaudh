const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');

const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
const shop = path.resolve(__dirname, '../.local/shop-treasure');
const feed = path.resolve(__dirname, '../.local/hero-feed');
const heroExp = path.resolve(__dirname, '../.local/hero-exp');

const ctx = {LocalNative: {}, data: {}, Math};
vm.createContext(ctx);
for (const name of ['item', 'input_event_client', 'resource_input', 'skill_to_hero', 'skill_data',
    'hero_to_skill', 'unit_main'])
    vm.runInContext(fs.readFileSync(`${shop}/${name}.js`, 'utf8'), ctx);
vm.runInContext(fs.readFileSync(`${feed}/exp_input.js`, 'utf8'), ctx);
vm.runInContext(fs.readFileSync(`${feed}/mutate_effect.js`, 'utf8'), ctx);
for (const name of ['hero_lv_data', 'hero_number'])
    vm.runInContext(fs.readFileSync(`${heroExp}/${name}.js`, 'utf8'), ctx);

function load(name, next) {
    const a = source.indexOf(`        LocalNative.${name} = function`);
    const b = source.indexOf(`        LocalNative.${next} = function`, a + 1);
    assert.ok(a >= 0 && b > a, name);
    vm.runInContext(source.slice(a, b), ctx);
}
load('normalizeHeroExperience', 'normalizeHeroSkillSlots');
load('normalizeHeroSkillSlots', 'getMaxSunshineCapacity');
load('ensureHeroSkill', 'makeHomeInitDict');
load('isHeroFeedUse', 'findHeroRecord');
load('findHeroRecord', 'pickMutateId');
load('pickMutateId', 'pickFeedSlotSkill');
load('pickFeedSlotSkill', 'applyHeroFeedUse');
load('applyHeroFeedUse', 'unlockHeroFeedIfNeeded');
load('unlockHeroFeedIfNeeded', 'handleShopUseItem');
load('handleShopUseItem', 'runShopRequest');

const n = ctx.LocalNative;
n.writeStatus = () => {};
n.shopPolicy = {maxBatch: 100};
n.shopState = (level) => level.localShopState || (level.localShopState = {sequence: 0});
n.shopTransaction = (player) => JSON.parse(JSON.stringify(player.__store));
n.shopSync = () => {};
n.shopShowPending = () => {};
n.shopTreasureRewards = () => { throw new Error('treasure'); };
n.shopRollHeroes = () => [];
n.resolveSkillBookReplaceId = () => 0;
n.isSkillEnforceBook = () => false;
n.applySkillBookUse = () => { throw new Error('skill'); };
let disk = null;
n.writeRaw = (store) => { disk = store; };

assert.equal(n.isHeroFeedUse(1109, {sid: 'h1', itemid: 1109}), true);
assert.equal(ctx.data.exp_input[5113].putin_num, 300);

const level = {
    player: {
        diamond: 100, spirit: 50,
        package: {
            material: {item_dict: {bean: {oid: 'bean', typeid: 1109, num: 2}}},
            based_prop: {item_dict: {}},
            advanced_prop: {item_dict: {}},
            formula: {item_dict: {}}
        }
    },
    heros: [{sid: 'hero_slot_1', typeid: 10401, lv: 2, xp: 0, skill_slots: [{sid: 10000, lv: 1, exp: 0}]}],
    units: [{typeid: 20602}]
};
const player = {
    __store: {version: 1, level: JSON.parse(JSON.stringify(level))},
    lastAns: null,
    rpc_c_use_item_ans(dict) { this.lastAns = dict; }
};

assert.equal(n.handleShopUseItem(player, {
    pkgid: 0, oid: 'bean', num: 1,
    params: {sid: 'hero_slot_1', targetTypeId: 10401, itemid: 1109}
}), true);
assert.equal(player.lastAns.ans[0][0], 24);
assert.equal(player.lastAns.ans[0][1].exp_num, 300);
assert.equal(player.lastAns.ans[0][1].sid, 'hero_slot_1');
assert.equal(disk.level.heros[0].xp > 0 || disk.level.heros[0].lv >= 2, true);
assert.equal(disk.level.player.package.material.item_dict.bean.num, 1);

player.__store = disk;
assert.equal(n.handleShopUseItem(player, {
    pkgid: 0, oid: 'bean', num: 1,
    params: {sid: 'hero_slot_1', targetTypeId: 10401, itemid: 1109}
}), true);
assert.ok(!disk.level.player.package.material.item_dict.bean);

const waterLevel = {
    player: {
        diamond: 100, spirit: 50,
        package: {
            material: {item_dict: {w: {oid: 'w', typeid: 1110, num: 1}}},
            based_prop: {item_dict: {}}, advanced_prop: {item_dict: {}}, formula: {item_dict: {}}
        }
    },
    heros: [{sid: 'hero_slot_1', typeid: 10401, lv: 2, xp: 0}],
    units: [{typeid: 20602}]
};
player.__store = {version: 1, level: JSON.parse(JSON.stringify(waterLevel))};
assert.equal(n.handleShopUseItem(player, {
    pkgid: 0, oid: 'w', num: 1,
    params: {sid: 'hero_slot_1', targetTypeId: 10401, itemid: 1110}
}), true);
assert.equal(player.lastAns.ans[0][0], 22);
assert.equal(player.lastAns.ans[0][1].reduce_time, 600);

assert.ok(source.includes('applyHeroFeedUse'));
assert.ok(source.includes('unlockHeroFeedIfNeeded'));
// Rune stones share putin_event_slot with skill fruits, but open equipment slots.
for (const stone of [7222, 7223, 7224, 7225]) {
    const openSlot = stone - 7221;
    const testLevel = JSON.parse(JSON.stringify(level));
    const hero = testLevel.heros[0];
    hero.skill_slots = [10000, 10001, 10002].map(sid => ({sid, lv: 1, exp: 0}));
    hero.eqp = Array(openSlot).fill(null);
    hero.eqp[0] = {oid: 'existing-rune', typeid: 7031};
    const beforeSkills = JSON.stringify(hero.skill_slots);
    testLevel.player.package.material.item_dict = {stone: {oid: 'stone', typeid: stone, num: 2}};
    player.__store = {version: 1, level: testLevel};
    const request = {pkgid: 0, oid: 'stone', num: 1,
        params: {sid: hero.sid, itemid: stone}};
    assert.equal(n.handleShopUseItem(player, request), true);
    assert.equal(JSON.stringify(player.lastAns.ans), JSON.stringify([[31,
        {itemid: stone, hero_id: hero.sid, slot: openSlot}]]));
    assert.equal(disk.level.heros[0].eqp.length, openSlot + 1);
    assert.equal(disk.level.heros[0].eqp[openSlot], null);
    assert.equal(disk.level.heros[0].eqp[0].oid, 'existing-rune');
    assert.equal(JSON.stringify(disk.level.heros[0].skill_slots), beforeSkills);
    assert.equal(disk.level.player.package.material.item_dict.stone.num, 1);
    player.__store = JSON.parse(JSON.stringify(disk)); // Reload persisted state.
    const before = JSON.stringify(disk);
    assert.throws(() => n.handleShopUseItem(player, request), /Equipment slot/);
    assert.equal(JSON.stringify(disk), before, 'failed repeat must not consume a stone');
}
for (const initialEquipment of [undefined, {}, {first: {oid: 'legacy-rune'}}]) {
    const testLevel = JSON.parse(JSON.stringify(level));
    const hero = testLevel.heros[0];
    hero.eqp = initialEquipment;
    const ans = n.applyHeroFeedUse(testLevel, 7222, {sid: hero.sid, itemid: 7222}, 1);
    assert.equal(ans[0][0], 31);
    assert.equal(hero.eqp.length, 2);
    assert.equal(hero.eqp[1], null);
    if (initialEquipment && initialEquipment.first) assert.equal(hero.eqp[0].oid, 'legacy-rune');
}
for (const fruit of [210021, 210022]) {
    const testLevel = JSON.parse(JSON.stringify(level));
    const hero = testLevel.heros[0];
    const ans = n.applyHeroFeedUse(testLevel, fruit, {sid: hero.sid, itemid: fruit}, 1);
    assert.equal(ans[0][0], 8);
    assert.equal(hero.skill_slots.length, 2);
    assert.equal(hero.eqp, undefined);
}
console.log('PASS: feed exp/water, four rune stones, full skills, persistence, legacy eqp and skill fruits');
