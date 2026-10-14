// Offline checks for campaign PVE enter (rpc_s_enter_pve_battle → rpc_c_enter_battle).
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');

function loadSlice(startName, endName, context) {
    const a = source.indexOf(`        LocalNative.${startName} = function`);
    const b = endName
        ? source.indexOf(`        LocalNative.${endName} = function`, a + 1)
        : source.length;
    assert.ok(a >= 0 && b > a, `slice ${startName}..${endName}`);
    vm.runInNewContext(source.slice(a, b), context);
}

const store = {
    level: {
        player: {
            nickname: 'LocalRookie',
            availableStages: {1: [288, 788, 0, 0]},
            finishedVirtualStages: {20001: 1},
            buffs: []
        },
        heros: [{
            sid: 'hero_slot_1', typeid: 10401, unit_type: 104, unit_level: 1,
            attack_index: 1, state: 1, life: 400
        }],
        units: [],
        user_config: {},
        hero_donate_list: []
    }
};

const n = {
    writeStatus() {},
    readRaw() { return store; },
    defaultLevelDict() { return store.level; },
    defaultPlayer() { return store.level.player; },
    defaultHeros() { return store.level.heros; },
    ensureAvailableStages() { return false; },
    readPveStageLoot() { return [288, 788, 0, 0]; },
    unit(sid, typeid, x, y, extra) {
        const u = {
            sid, typeid,
            unit_type: Math.floor(typeid / 100),
            unit_level: typeid % 100,
            x, y, state: 1, faction: 2, unit_mutateid: 0
        };
        if (extra) Object.assign(u, extra);
        return u;
    },
    normalizeReplayUnits(units) {
        return (units || []).map((src) => {
            const u = Object.assign({}, src);
            u.faction = 2;
            if (u.cid == null && u.sid != null) u.cid = u.sid;
            return u;
        });
    },
    remapBattleUnitIds(units, baseSid) {
        baseSid = baseSid || 91000;
        return (units || []).map((src, i) => {
            const u = Object.assign({}, src);
            u.sid = baseSid + i + 1;
            u.cid = u.sid;
            u.id = u.sid;
            return u;
        });
    },
    makeBattleSide(player, extras) {
        const side = Object.assign({}, player, extras || {});
        side.player = player;
        if (side.soldiers == null) side.soldiers = [];
        if (side.heros == null) side.heros = [];
        if (side.league_tech == null) side.league_tech = [];
        return side;
    }
};

const context = {LocalNative: n, HERO_STATE_ATTACK: 1, BUILD_STATE_FINISH: 1, BATTLE_FACTION_DEFENDER: 2};
loadSlice('inferredPveVillageUnits', 'handleEnterEnemyAttackReplay', context);

const units = n.inferredPveVillageUnits(1, 288, 788);
assert.equal(units.length, 4);
assert.equal(units[0].typeid, 20101);
assert.equal(units[0].sid, 91001);
assert.equal(units[3].typeid, 30101);
assert.equal(units[3].sid, 91004);

const heros = n.collectAttackHerosForPve(store.level, store.level.player);
assert.equal(heros.length, 1);
assert.equal(heros[0].typeid, 10401);
assert.equal(heros[0].state, 1);

const dict = n.buildPveBattleDict(1);
assert.equal(dict.localNativePve, true);
assert.equal(dict.isEnterEnemyAttackReplay, false);
assert.equal(dict.replay, null);
assert.equal(dict.oppo.player.stage, 1);
assert.equal(dict.self.gold, 288);
assert.equal(dict.self.wood, 788);
assert.equal(dict.units.length, 4);
assert.equal(dict.self.heros.length, 1);
assert.equal(dict.source, 'local-inferred-compatible-pve');

let entered = 0;
const player = {
    rpc_c_enter_battle(d) {
        entered++;
        assert.equal(d.oppo.player.stage, 1);
        assert.equal(d.replay, null);
        assert.ok(d.units.length > 0);
    }
};
assert.equal(n.handleEnterPveBattle(player, {level: 1}), true);
assert.equal(entered, 1);

console.log('PASS: pve village stub, attack heros, enter dict, rpc_c_enter_battle');
