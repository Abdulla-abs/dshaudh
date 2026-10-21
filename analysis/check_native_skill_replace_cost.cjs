const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');

const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
const tables = path.resolve(__dirname, '../.local/shop-treasure');
const status = [];

const ctx = {
    LocalNative: {},
    data: {},
    RES_TYPE_WOOD: 1,
    UI: {
        SkillReplace: function() {},
        SkillUpgrade: function() {},
        NumericLable: {setResourceColor() {}}
    },
    G_Player: null
};
ctx.UI.SkillReplace.prototype = {
    setButton: function() {
        const slot = this.oldSlot || {};
        const sum = ctx.UI.SkillReplace.calSumExp(slot.lv, slot.exp);
        this.replaceResNum = ctx.data.skill_to_hero[slot.sid] &&
            ctx.data.skill_to_hero[slot.sid]['skill_exp_' + sum];
        if (this.reResNum) this.reResNum.setString(String(this.replaceResNum));
    }
};
ctx.UI.SkillReplace.calSumExp = function(lv, exp) {
    let sum = Number(exp);
    // Stock concatenates missing exp into the table key as "undefined".
    if (!isFinite(sum)) return exp;
    for (let i = 1; i < (Number(lv) || 1); i++)
        sum += Number(ctx.data.skill_lv_client[i] && ctx.data.skill_lv_client[i].skill_exp) || 0;
    return sum;
};
ctx.UI.SkillUpgrade.prototype = {
    setButton: function() {
        const slot = this.oldSlot || {};
        const sum = ctx.UI.SkillReplace.calSumExp(slot.lv, slot.exp);
        this.enforceResNum = ctx.data.skill_to_hero[slot.sid] &&
            ctx.data.skill_to_hero[slot.sid]['skill_exp_' + sum];
        if (this.enResNum) this.enResNum.setString(String(this.enforceResNum));
    }
};

vm.createContext(ctx);
for (const name of ['skill_to_hero', 'skill_lv_client', 'unit_main', 'skill_data', 'hero_to_skill'])
    vm.runInContext(fs.readFileSync(`${tables}/${name}.js`, 'utf8'), ctx);

function load(name, next) {
    const a = source.indexOf(`        LocalNative.${name} = function`);
    const b = source.indexOf(`        LocalNative.${next} = function`, a + 1);
    assert.ok(a >= 0 && b > a, name);
    vm.runInContext(source.slice(a, b), ctx);
}
load('normalizeHeroSkillSlots', 'getMaxSunshineCapacity');
load('getMaxSunshineCapacity', 'resolveSkillWoodCost');
load('resolveSkillWoodCost', 'installSkillReplaceCostFix');
load('installSkillReplaceCostFix', 'ensureHeroSkill');
load('ensureHeroSkill', 'makeHomeInitDict');
ctx.LocalNative.writeStatus = (row) => status.push(row);
ctx.LocalNative.lookupUnitMain = (id) => ctx.data.unit_main[id];
ctx.LocalNative.readRaw = () => ({level: {units: [{typeid: 20101}, {typeid: 20301}]}});

const broken = {typeid: 10401, skill_slots: [{sid: 10000, lv: 1}]};
assert.equal(ctx.LocalNative.ensureHeroSkill(broken), true);
assert.equal(broken.skill_slots[0].exp, 0);
assert.equal(ctx.LocalNative.ensureHeroSkill(broken), false);

const fromTable = ctx.LocalNative.resolveSkillWoodCost({sid: 10000, lv: 1, exp: 0});
assert.equal(fromTable.source, 'skill_to_hero');
assert.equal(fromTable.cost, ctx.data.skill_to_hero[10000].skill_exp_0);

const missingKey = ctx.LocalNative.resolveSkillWoodCost({sid: 10000, lv: 1, exp: 999999});
assert.equal(missingKey.source, 'max-sunshine-1/3');
assert.equal(missingKey.cost, Math.floor((20000 + 5000) / 3));

ctx.G_Player = {
    getComponent: () => ({getMaxRes: () => 9000, maxRes: {1: 9000}})
};
const liveCap = ctx.LocalNative.resolveSkillWoodCost({sid: 999999, lv: 1, exp: 0});
assert.equal(liveCap.cost, Math.floor(9000 / 3));
ctx.G_Player = null;

ctx.LocalNative.installSkillReplaceCostFix();
let label = 'undefined';
const ui = Object.create(ctx.UI.SkillReplace.prototype);
ui.oldSlot = {sid: 10000, lv: 1}; // missing exp used to make skill_exp_undefined
ui.reResNum = {setString: (s) => { label = s; }};
ui.setButton();
assert.notEqual(label, 'undefined');
assert.equal(Number(ui.replaceResNum), fromTable.cost);
assert.equal(ui.oldSlot.exp, 0);
assert.equal(label, String(fromTable.cost));

label = '';
const upgrade = Object.create(ctx.UI.SkillUpgrade.prototype);
upgrade.oldSlot = {sid: 10000, lv: 1, exp: 999999};
upgrade.enResNum = {setString: (s) => { label = s; }};
upgrade.setButton();
assert.equal(Number(upgrade.enforceResNum), Math.floor((20000 + 5000) / 3));
assert.equal(label, String(upgrade.enforceResNum));
assert.ok(status.some((row) => row.step === 'skill-replace-cost-fix' &&
    row.source === 'max-sunshine-1/3'));

assert.ok(source.includes('LocalNative.installSkillReplaceCostFix();'));
assert.ok(!/skill_slots:\s*\[\{sid:\s*\d+,\s*lv:\s*\d+\}\]/.test(source),
    'all literal skill_slots must include exp');

console.log('PASS: skill replace cost restores skill_to_hero lookup; missing keys use max sunshine / 3; UI undefined fixed');
