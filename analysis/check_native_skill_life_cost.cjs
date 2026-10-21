const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = `${__dirname}/..`;
const ctx = {
    LocalNative: {writeStatus() {}}, Comp: {ThreatSystem: function() {}, StaticBattleController: function() {}},
    Skill: {SimpleSkill: function() {}},
    // Reproduce the observed non-Unit source, plus valid and deleted attackers.
    G_UnitManager: {getUnit(id) { return units[id]; }},
    DA: {GETCGC() { return {applySkillCost() { ctx.paid++; }}; }}, paid: 0
};
const units = {undefined: {}, 0: {}, 7: {
    faction: 2, canBeFound() { return true; },
    getComponent() { return {isAttackTarget() { return true; }}; }
}};
vm.createContext(ctx);
function loadRange(src, start, end) {
    const a = src.indexOf(start), b = src.indexOf(end, a + start.length);
    assert.ok(a >= 0 && b > a, start);
    vm.runInContext(src.slice(a, b), ctx);
}
const original = fs.readFileSync(`${root}/analysis/disasm/ThreatSystem.decompiled.js`, 'utf8');
// The decompiler flattens the OR at 0x2251 incorrectly. Bytecode proves:
// obj && obj.canBeFound() && (!bc || bc.isAttackTarget()).
const hitStart = 'Comp.ThreatSystem.prototype.onHit=';
const hitEnd = 'Comp.ThreatSystem.prototype.addThreat=';
const hit = original.slice(original.indexOf(hitStart), original.indexOf(hitEnd))
    .replace('((obj && obj.canBeFound()) && (!obj.getComponent("BattleController"))) && obj.getComponent("BattleController").isAttackTarget()',
        '(obj && obj.canBeFound()) && ((!obj.getComponent("BattleController")) || obj.getComponent("BattleController").isAttackTarget())');
vm.runInContext(hit, ctx);
const threat = new ctx.Comp.ThreatSystem();
Object.assign(threat, {master: {battle_type: 1}, selfFaction: 1,
    addThreat(id, value) { this.lastThreat = [id, value]; }});
loadRange(fs.readFileSync(`${root}/analysis/disasm/Skill.decompiled.js`, 'utf8'),
    'Skill.SimpleSkill.prototype.applyCost=', 'Skill.SimpleSkill.prototype.comeToWorld=');
// Same order as StaticBattleController.changeLife: apply base HP change, then onHit.
const skill = new ctx.Skill.SimpleSkill();
skill.config = {cost_life: 37};
skill.master = {life: 100, changeLife(value, attacker) {
    this.life -= value;
    threat.onHit(attacker, value);
}};
assert.throws(() => skill.applyCost(), /canBeFound/, 'old cost path aborts before completion');
assert.equal(ctx.paid, 0);
const boot = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
loadRange(boot, '        LocalNative.syncBattleSkillTarget = function',
    '        LocalNative.prepareHeroBattleSkills = function');
ctx.LocalNative.installActiveSkillSeekFix();
for (let i = 0; i < 3; i++) {
    skill.master.life = 100;
    skill.applyCost();
    assert.equal(skill.master.life, 63, 'HP cost retained exactly once');
    threat.onHit(7, 10); // Subsequent real enemy damage still registers.
    assert.deepEqual(threat.lastThreat, [7, 10]);
    threat.onHit(99, 5); // Deleted building/attacker.
    threat.onHit(0, 5); // Registered non-Unit source.
}
assert.equal(ctx.paid, 3, 'skill completion continues on repeated costs');
units[8] = {faction: 1, canBeFound() { return true; }, getComponent() { return null; }};
threat.lastThreat = null;
threat.onHit(8, 5);
assert.equal(threat.lastThreat, null, 'friendly source creates no threat');
ctx.LocalNative.installActiveSkillSeekFix();
skill.applyCost();
assert.equal(ctx.paid, 4, 'installation is idempotent');
console.log('PASS: original cost abort reproduced; HP cost, skill continuation, repeated casts, valid/friendly/deleted/non-Unit sources');
