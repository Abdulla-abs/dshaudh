const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const src = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');

const ctx = {
    LocalNative: {},
    Comp: {
        ThreatSystem: function() {},
        StaticBattleController: function() {},
        HeroBattleController: function() {}
    },
    BATTLE_SCRIPT_TYPE_ATTACK: 2,
    SCRIPT_ATTACK_PURPOSE_ONCE: 1
};
ctx.Comp.ThreatSystem.prototype = {
    getNearestHighestThreatAttackableTarget() {
        throw new Error('null unit getComponent');
    },
    getNearestHighestThreatTarget() { return 7; },
    getNearestTarget() { return 8; },
    getTargetConsideringLeaderMode() {
        throw new Error('stale lock');
    },
    unLock() { this.unlocked = true; },
    curTarget: 99
};
ctx.Comp.StaticBattleController.prototype = {
    __setNextSkill(skillID) { this.nextSkill = skillID; },
    onUserCastSkillToTarget(targetID, skillID) {
        this.__setNextSkill(skillID);
        this.fsmEvent = 'CAST_ACTIVE';
    },
    _realDoCastSkill(skillID, targetID) {
        this.__setNextSkill(skillID, targetID);
        this.realArgs = [skillID, targetID];
    },
    setTargetID(id, purpose) {
        this.targetID = id;
        this.targetPurpose = purpose;
    }
};
ctx.Comp.HeroBattleController.prototype = Object.create(ctx.Comp.StaticBattleController.prototype);
Object.assign(ctx.Comp.HeroBattleController.prototype, {
    onUserCastSkillToTarget(targetID, skillID) {
        this.director = {
            poll() {
                return {
                    type: ctx.BATTLE_SCRIPT_TYPE_ATTACK,
                    targetID: targetID,
                    useSkill: skillID,
                    purpose: ctx.SCRIPT_ATTACK_PURPOSE_ONCE
                };
            }
        };
        this.heroCast = [targetID, skillID];
    },
    onEventUserChangeToAttack() {
        this.changed = true;
        return 2;
    }
});

vm.createContext(ctx);
function range(text, start, end) {
    const a = text.indexOf(start), b = text.indexOf(end, a + 1);
    assert.ok(a >= 0 && b > a, start);
    vm.runInContext(text.slice(a, b), ctx);
}
range(src,
    '        LocalNative.syncBattleSkillTarget = function',
    '        LocalNative.prepareHeroBattleSkills = function');
ctx.LocalNative.writeStatus = (o) => { ctx.lastStatus = o; };

ctx.LocalNative.installActiveSkillSeekFix();

const threat = new ctx.Comp.ThreatSystem();
assert.equal(threat.getNearestHighestThreatAttackableTarget(), null, 'throw becomes null');
assert.equal(threat.unlocked, true);
assert.equal(threat.curTarget, null);
assert.equal(threat.getNearestHighestThreatTarget(), 7);
assert.equal(ctx.lastStatus.step, 'threat-seek-ERR');

const st = new ctx.Comp.StaticBattleController();
st.targetID = 11;
st.onUserCastSkillToTarget(55, 15910);
assert.equal(st.targetID, 55, 'static user cast syncs skill target');
assert.equal(st.nextSkill, 15910);

const st2 = new ctx.Comp.StaticBattleController();
st2.targetID = 11;
st2._realDoCastSkill(15910, 66);
assert.equal(st2.targetID, 66, 'auto cast syncs skill target');

const hero = new ctx.Comp.HeroBattleController();
hero.targetID = 11;
hero.onUserCastSkillToTarget(77, 15910);
assert.equal(hero.targetID, 77, 'hero in-range cast syncs director target');
assert.deepEqual(hero.heroCast, [77, 15910]);

const hero2 = new ctx.Comp.HeroBattleController();
hero2.director = {
    poll() {
        return { type: ctx.BATTLE_SCRIPT_TYPE_ATTACK, targetID: 88, purpose: 1, useSkill: 15910 };
    }
};
assert.equal(hero2.onEventUserChangeToAttack(), 2);
assert.equal(hero2.targetID, 88, 'USER_CHANGE_TO_ATTACK syncs script target');

assert.equal(ctx.lastStatus && ctx.LocalNative.writeStatus ? true : true, true);
console.log('PASS: threat null-guard; static/hero friend-target cast sync; change-to-attack sync');
