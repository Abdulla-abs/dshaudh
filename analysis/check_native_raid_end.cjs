// Regression checks for local replay completion, independent of the emulator.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
function load(first, next, context) {
    const a = source.indexOf(`        LocalNative.${first} = function`);
    const b = source.indexOf(`        LocalNative.${next} = function`, a);
    assert.ok(a >= 0 && b > a);
    vm.runInNewContext(source.slice(a, b), context);
}
let queued = [], homeCalls = 0, exits = 0, writes = 0;
const store = {level: {player: {finishedVirtualStages: {99: 1}}, user_config: {rookie0: 6210}, units: [{sid: 100}]}};
const session = {stage: 20001, returning: false, closed: false};
const units = {10: {bc: {isAlive: true}}, 11: {bc: {isAlive: false}}};
const player = {rpc_c_battle_to_home(level) {
    homeCalls++;
    assert.equal(level.player.finishedVirtualStages[20001], 1);
    assert.equal(level.user_config.rookie0, 6210);
    assert.equal(level.units[0].sid, 100);
}};
const n = {
    replaySession: session,
    scheduleOnRoot(fn) { queued.push(fn); },
    writeStatus() {}, pushSettleTrace() {},
    snapshotSettleGc(gc) {
        return {
            inReplayMode: !!(gc && gc.inReplayMode),
            battleFinished: !!(gc && gc.battleFinished)
        };
    },
    readRaw() { return store; }, writeRaw() { writes++; },
    resolveBattleUnitById(id) { return units[id] || null; },
    resolveUnitBattleController(u) { return u.bc; },
    clearBattleOperGates(gc) {
        // Must keep inReplayMode; only oper gates are cleared in production.
        const before = {inReplayMode: !!gc.inReplayMode};
        gc.noUserOperSkill = false;
        return before;
    },
    probeDefenderBattleReady() { return []; },
    normalizeStageMap(value, asVirtual) {
        if (value && typeof value === 'object' && !Array.isArray(value)) return value;
        const out = {};
        if (Array.isArray(value) && asVirtual) {
            for (const item of value) if (item != null) out[String(item)] = 1;
        }
        return out;
    },
    readPveStageLoot() { return [288, 788, 0, 0]; },
    ensureAvailableStages(player) {
        if (!player || typeof player !== 'object') return false;
        player.availableStages = n.normalizeStageMap(player.availableStages, false);
        player.finishedVirtualStages = n.normalizeStageMap(player.finishedVirtualStages, true);
        player.pve_awardBox = n.normalizeStageMap(player.pve_awardBox, false);
        const virtual = player.finishedVirtualStages;
        if ((virtual[20001] || virtual['20001']) &&
            !player.availableStages.hasOwnProperty(1) &&
            !player.availableStages.hasOwnProperty('1')) {
            player.availableStages[1] = n.readPveStageLoot(1);
            return true;
        }
        return false;
    }
};
const context = {LocalNative: n, G_Player: player, GS_CURRENT_STAGE: 2, GS_STAGE_BATTLE: 2, GS_STAGE_BUILD: 1};
load('localRaidAllAttackersDead', 'handleBattleToHome', context);
load('enableDefenderLiveCombat', 'spawnStubAttackers', context);
let setCalls = 0;
const gc = {
    battleStarted: true, battleFinished: false, __localRaidSession: session,
    __localRaidDeployed: false, __localStubAtkCids: [],
    battleRecorder: {records: [[1, 0, 7]], setRecords(records) { this.records = records; setCalls++; }},
    menu: {onReplayEnd() { exits++; n.handleFinishEnemyAttackReplay(player, {}); }}
};
n.raidController = gc;
// A start-only record must be consumed once, without touching real replays.
const foreign = {battleStarted: true, battleRecorder: {setRecords() { throw Error('foreign replay changed'); }}};
gc.inReplayMode = true;
n.enableDefenderLiveCombat(foreign, 'foreign');
n.enableDefenderLiveCombat(gc, 'start');
n.enableDefenderLiveCombat(gc, 'post-stub');
assert.equal(setCalls, 1);
assert.equal(gc.battleRecorder.records.length, 0);
assert.equal(gc.inReplayMode, true, 'live combat must keep inReplayMode for stock settle');
assert.equal(n.localRaidAllAttackersDead(gc), false, 'must not finish an empty/pre-deployment scene');
gc.__localRaidDeployed = true;
gc.__localStubAtkCids = [10, 11];
assert.equal(n.localRaidAllAttackersDead(gc), false, 'one living attacker must keep battle running');
assert.equal(n.queueLocalRaidReplayEnd(gc), false, 'must wait for the stock finish condition');
units[10].bc.isAlive = false;
assert.equal(n.localRaidAllAttackersDead(gc), true);
units[11].bc = null;
assert.equal(n.localRaidAllAttackersDead(gc), false, 'unknown component is not proof of death');
units[11].bc = {isAlive: false};
gc.battleFinished = true;
assert.equal(n.queueLocalRaidReplayEnd(gc), true);
assert.equal(n.queueLocalRaidReplayEnd(gc), false);
assert.equal(homeCalls, 0, 'wait for stock finish stack to return');
queued.shift()();
assert.equal(exits, 1);
assert.equal(homeCalls, 1);
assert.equal(writes, 1);
assert.equal(player.finishedVirtualStages[20001], 1);
assert.equal(player.finishedVirtualStages[99], 1);
assert.deepEqual(player.availableStages[1], [288, 788, 0, 0], 'raid 20001 unlocks campaign stage 1');
assert.deepEqual(store.level.player.availableStages[1], [288, 788, 0, 0]);
n.handleFinishEnemyAttackReplay(player, {});
assert.equal(homeCalls, 1, 'duplicate RPC must not return twice');
assert.equal(n.closeLocalRaidSessionOnHome({}), false, 'battle stage cannot close a returning session');
context.GS_CURRENT_STAGE = 1;
assert.equal(n.closeLocalRaidSessionOnHome({}), true, 'new home closes session even if old timer was removed');
assert.equal(n.closeLocalRaidSessionOnHome({}), false);
assert.equal(n.raidController, null);
n.raidController = gc;
queued.shift()();
assert.equal(session.closed, true);
// Pending callbacks from a previous raid cannot finish a later session.
const stale = {stage: 20001, closed: false, returning: false};
gc.__localRaidSession = stale;
n.replaySession = stale;
assert.equal(n.queueLocalRaidReplayEnd(gc), true);
n.replaySession = {stage: 20002, closed: false, returning: false};
queued.shift()();
assert.equal(exits, 1);
assert.equal(n.queueLocalRaidReplayEnd(gc), false);
// Manual exit before completion must preserve the prior stage map.
const uncompleted = {stage: 20002, closed: false, returning: false};
n.replaySession = uncompleted;
gc.__localRaidSession = uncompleted;
gc.__localRaidDeployed = false;
gc.battleFinished = false;
player.rpc_c_battle_to_home = () => homeCalls++;
n.handleFinishEnemyAttackReplay(player, {});
assert.equal(store.level.player.finishedVirtualStages[20002], undefined);
assert.equal(writes, 1);
// Legacy array maps must migrate; 20001 unlocks stage 1 without wiping prior loot.
const legacy = {
    availableStages: [],
    finishedVirtualStages: [20001],
    pve_awardBox: []
};
assert.equal(n.ensureAvailableStages(legacy), true);
assert.deepEqual(legacy.finishedVirtualStages, {'20001': 1});
assert.deepEqual(legacy.availableStages[1], [288, 788, 0, 0]);
assert.deepEqual(legacy.pve_awardBox, {});
const fresh = {availableStages: {}, finishedVirtualStages: {}, pve_awardBox: {}};
assert.equal(n.ensureAvailableStages(fresh), false, 'new account must not unlock stage 1 early');
assert.deepEqual(fresh.availableStages, {});
console.log('PASS: consumed start record, death guards, stock exit, stage persistence, campaign unlock, duplicate and stale-session safety');
