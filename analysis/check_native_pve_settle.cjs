// Offline checks for campaign PVE settle (complete → MatchEnd → home).
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');

function loadRange(startMarker, endMarker, context) {
    const a = source.indexOf(startMarker);
    const b = source.indexOf(endMarker, a + 1);
    assert.ok(a >= 0 && b > a, `range ${startMarker.slice(0, 40)}`);
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
        units: [{sid: 1, typeid: 20101}],
        user_config: {},
        heros: []
    }
};

const n = {
    pveSession: null,
    replaySession: null,
    raidController: null,
    writeStatus() {},
    pushSettleTrace() {},
    scheduleOnRoot(fn) { fn(); },
    readRaw() { return store; },
    writeRaw(obj) { Object.assign(store, obj); },
    defaultLevelDict() { return store.level; },
    defaultPlayer() { return Object.assign({}, store.level.player); },
    ensureAvailableStages(player) {
        if (!player.availableStages || Array.isArray(player.availableStages))
            player.availableStages = {};
        return false;
    },
    readPveStageLoot(stageId) {
        if (stageId === 1) return [288, 788, 0, 0];
        if (stageId === 2) return [288, 888, 0, 0];
        return [100, 100, 0, 0];
    },
    getResourceManager() {
        return {Res: {1: 0, 2: 0}, addRes(t, v) { this.Res[t] = (this.Res[t] || 0) + v; }};
    },
    getBattleController() {
        return {
            battleResult: {starNum: 2, isWinner: true, battlePercents: 70},
            calRoundPercentage(p) { return p; },
            isEnterEnemyAttackReplay: false,
            getStageClient() { return {pveStage: 1}; }
        };
    }
};

const context = {
    LocalNative: n,
    data: {pve_stage: {1: {pve_next_stage: [2], coin_storage: 288, solar_storage: 788}}},
    RES_TYPE_GOLD: 2,
    RES_TYPE_WOOD: 1,
    G_Player: null
};

// Keep test stubs for getBattleController / readRaw; only load settle helpers.
const stubGc = n.getBattleController;
loadRange(
    '        LocalNative.isLocalRaidActive = function',
    '        LocalNative.handleEnterEnemyAttackReplay = function',
    context
);
n.getBattleController = stubGc;
n.readLivePveStageId = function() {
    return (n.pveSession && n.pveSession.stage) || 1;
};
n.isLocalPveBattleActive = function() {
    return !!(n.pveSession && !n.pveSession.closed);
};
n.isLocalRaidActive = function() {
    return !!(n.replaySession && !n.replaySession.closed && n.raidController);
};

assert.equal(n.isLocalRaidActive(), false);
n.pveSession = {stage: 1, closed: false, completed: false};
assert.equal(n.isLocalPveBattleActive(), true);
assert.equal(n.readLivePveStageId(), 1);

const progress = n.applyPveStageProgress(store.level.player, 1, 2, 100, 200);
assert.equal(progress.entry[2], 2);
assert.equal(progress.unlocked.length, 1);
assert.equal(Number(progress.unlocked[0]), 2);
assert.ok(store.level.player.availableStages[2]);

const result = n.buildPveBattleResultDict(n.getBattleController(), 1);
assert.equal(result.starNum, 2);
assert.ok(result.win_gold > 0);
assert.ok(Array.isArray(result.input_gains));
assert.equal(typeof result.exp_add, 'object');

let battleResultCalls = 0;
let homeCalls = 0;
const player = {
    availableStages: store.level.player.availableStages,
    rpc_c_battle_result(dict) {
        battleResultCalls++;
        assert.equal(dict.starNum, 2);
        assert.ok(dict.win_gold >= 0);
    },
    rpc_c_battle_to_home(level) {
        homeCalls++;
        assert.equal(level.player.availableStages[1][2], 2);
        assert.ok(level.player.availableStages[2]);
    }
};
context.G_Player = player;

// reset entry for settle path
store.level.player.availableStages = {1: [288, 788, 0, 0]};
n.pveSession = {stage: 1, closed: false, completed: false, returning: false};
assert.equal(n.handleCompletePveBattle(player, {pve_dict: {}}), true);
assert.equal(battleResultCalls, 1);
assert.equal(n.pveSession.completed, true);
assert.equal(store.level.player.availableStages[1][2], 2);

assert.equal(n.handlePveBattleToHome(player, {}), true);
assert.equal(homeCalls, 1);
assert.equal(n.handlePveBattleToHome(player, {}), false, 'duplicate home blocked');

console.log('PASS: pve progress unlock, result dict, complete + home');
