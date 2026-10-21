const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
const ctx = {
    Comp: {HeroManager: function() {}, HeroAttributeController: function() {}},
    HERO_STATE_IDLE: 0, HERO_STATE_ATTACK: 1, HERO_STATE_DEAD: 3,
    HERO_STATE_RECOVERING: 4, HERO_STATE_DONATE: 5, DAY_TIME: 86400,
    LocalNative: {STARTER_HERO_TYPEID: 10401, ensureAvailableStages() {}},
    DA: {getUnitBattleConfig: () => ({health_daily: 72}), getSystemCurrentTimeSec: () => Math.floor(Date.now() / 1000)},
};
vm.createContext(ctx);
function load(name, next) {
    const a = source.indexOf(`        LocalNative.${name} = function`);
    const b = source.indexOf(`        LocalNative.${next} = function`, a + 1);
    assert.ok(a >= 0 && b > a);
    vm.runInContext(source.slice(a, b), ctx);
}
load('ensurePlayerSocialFields', 'normalizeStageMap');
load('defaultStarterHero', 'defaultLevelDict');
vm.runInContext(fs.readFileSync(`${__dirname}/evidence/hero-slot-stock.js`, 'utf8'), ctx);
function attribute(record) {
    const attr = new ctx.Comp.HeroAttributeController();
    attr.master = {};
    attr.maxLife = 400; attr.maxHealth = 12;
    attr.getHealthBattleRequired = () => 1;
    attr.healthChangeTrigger = () => {};
    attr.init({}, record);
    return attr;
}
const broken = attribute({typeid: 10401, state: 1, life: 400, health: 12, attack_index: 1});
assert.equal(broken.attack_index, undefined);
broken.refreshHealth();
assert.equal(Number.isNaN(broken.health), true);
assert.equal(broken.getState(), 3, 'missing aht reproduces non-attack/dead classification');
const oldPlayer = {};
const empty = new ctx.Comp.HeroManager();
empty.init(oldPlayer);
assert.equal(empty.getHeroCapacity(), 0);
ctx.LocalNative.ensurePlayerSocialFields(oldPlayer);
empty.init(oldPlayer);
assert.equal(empty.getHeroCapacity(), 1);
assert.equal(empty.getHeroSlotNum(), 1);
const corrected = attribute(ctx.LocalNative.defaultStarterHero());
corrected.refreshHealth();
assert.equal(corrected.attack_index, 0);
assert.equal(corrected.health, 12);
assert.equal(corrected.getState(), 1);
vm.runInContext(`
    var legacy = {heros: [{sid:'hero_slot_1', typeid:10401, state:1, attack_index:1}]};
    if (!LocalNative.ensureStarterHeros(legacy)) throw Error('Legacy starter not migrated');
    if (legacy.heros[0].aidx !== 0 || !isFinite(legacy.heros[0].aht)) throw Error('Invalid starter fields');
    if (LocalNative.ensureStarterHeros(legacy)) throw Error('Migration not idempotent');
    var progressed = {player: {availableStages: {2:[0,0,3,0]}, hero_slot_num:1},
        heros:[LocalNative.defaultStarterHero()]};
    if (!LocalNative.ensureStarterHeros(progressed)) throw Error('Missing stage-2 reward');
    var reward = progressed.heros[1];
    if (reward.typeid !== 10501 || reward.state !== 0 || reward.aidx !== -1 ||
        reward.skill_slots[0].sid !== 151 || progressed.player.hero_slot_num !== 2)
        throw Error('Wrong original first-win reward');
    if (LocalNative.ensureStarterHeros(progressed) || progressed.heros.length !== 2)
        throw Error('Duplicate reward');
    progressed.heros.pop();
    if (LocalNative.ensureStarterHeros(progressed) || progressed.heros.length !== 1)
        throw Error('Claimed reward granted again after removal');
`, ctx);
const expanded = {hero_slot_num: 8, hero_slot_buy_num: 3};
ctx.LocalNative.ensurePlayerSocialFields(expanded);
assert.equal(expanded.hero_slot_num, 8);
assert.equal(expanded.hero_slot_buy_num, 3);
console.log('PASS: stock getters and hero refresh reproduce missing-slot/NaN defects; corrected Dino stays attack-ready');
