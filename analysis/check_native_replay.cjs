// Offline checks: no emulator interaction or screenshots.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
function load(name, next, context) {
    const start = source.indexOf(`        LocalNative.${name} = function`);
    const end = source.indexOf(`        LocalNative.${next} = function`, start);
    assert.ok(start >= 0 && end > start);
    vm.runInNewContext(source.slice(start, end), context);
}
const starterContext = {LocalNative: {STARTER_HERO_TYPEID: 10401}, HERO_STATE_ATTACK: 1};
load('toBuildingRecord', 'unit', starterContext);
load('defaultStarterHero', 'defaultLevelDict', starterContext);
vm.runInNewContext(`
    const oldSave = {heros: [], user_config: {rookie0: 6210}, units: [{sid: 5, typeid: 20401, state: 2}]};
    if (!LocalNative.ensureStarterHeros(oldSave)) throw Error('Missing migration');
    const hero = oldSave.heros[0];
    if (hero.sid !== 'hero_slot_1' || hero.typeid !== 10401 || hero.state !== 1)
        throw Error('Invalid stock attack hero');
    if (oldSave.user_config.rookie0 !== 6210 || oldSave.units[0].sid !== 5)
        throw Error('Migration changed progress or buildings');
    if (LocalNative.ensureStarterHeros(oldSave) || oldSave.heros.length !== 1)
        throw Error('Duplicate starter');
    const existing = {heros: [{sid: 'hero_slot_2', typeid: 11501, state: 0}]};
    if (LocalNative.ensureStarterHeros(existing) || existing.heros.length !== 1)
        throw Error('Existing roster replaced');
    const init = LocalNative.makeHomeInitDict(oldSave);
    if (init.units.length !== 2 || init.units[1] !== hero || oldSave.units.length !== 1)
        throw Error('Stock units initialization did not receive hero');
    if (LocalNative.makeHomeInitDict(init).units.length !== 2)
        throw Error('Repeated initialization duplicated hero');
`, starterContext);
let queued = [];
const persistent = {scheduleOnce(fn, delay) { queued.push({fn, delay}); }};
const removedBuildRoot = {scheduleOnce() { throw Error('Used torn down BUILD root'); }};
const context = {
    LocalNative: {getScheduleRoot() { return removedBuildRoot; }},
    DA: {getGameScene() { return {_global_schedule_node: persistent}; }}
};
load('scheduleOnRoot', 'tryDumpAndSave', context);
let recovered = false;
assert.equal(context.LocalNative.scheduleOnRoot(() => { recovered = true; }, 3), true);
assert.equal(queued[0].delay, 3);
queued[0].fn();
assert.equal(recovered, true);
context.DA.getGameScene = () => null;
context.LocalNative.getScheduleRoot = () => persistent;
assert.equal(context.LocalNative.scheduleOnRoot(() => {}, 0), true);
assert.equal(queued[1].delay, 0);

const level = {player: {nickname: 'LocalRookie'}, units: [{sid: 100, typeid: 30101, x: 24, y: 24}]};
context.LocalNative.readRaw = () => ({level});
context.LocalNative.ensureEnemyAttackBattleLog = (selfPlayer, oppoPlayer) =>
    context.LocalNative.buildEnemyAttackBattleLogStub(selfPlayer, oppoPlayer);
context.LocalNative.writeStatus = () => {};
context.LocalNative.pushSettleTrace = () => {};
context.LocalNative.snapshotSettleGc = () => ({});
context.BATTLE_FACTION_DEFENDER = 2;
context.BUILD_STATE_FINISH = 2;
context.data = {pve_stage: {20001: {id: 20001}}};
load('buildEnemyAttackBattleLogStub', 'ensureEnemyAttackBattleLog', context);
load('ensureEnemyAttackBattleLog', 'normalizeReplayUnits', context);
load('normalizeReplayUnits', 'remapBattleUnitIds', context);
load('remapBattleUnitIds', 'makeBattleSide', context);
load('makeBattleSide', 'countBattleUnits', context);
load('countBattleUnits', 'resolveBattleClient', context);
load('resolveBattleClient', 'ensureBattleClients', context);
load('ensureBattleClients', 'withBattleClient', context);
load('withBattleClient', 'forceCreateBattleUnits', context);
load('forceCreateBattleUnits', 'ensureBattleVillageUnits', context);
// ensure → spawnStub includes resolve/probe/enable/wake helpers defined between them.
load('ensureBattleVillageUnits', 'spawnStubAttackers', context);
load('spawnStubAttackers', 'buildEnemyAttackReplayDict', context);
load('buildEnemyAttackReplayDict', 'clearLoadingSafe', context);
const stubLog = context.LocalNative.buildEnemyAttackBattleLogStub(
    {nickname: 'LocalRookie'}, {nickname: 'Enemy'});
assert.equal(stubLog.getAttackerName(), 'Enemy');
assert.equal(stubLog.getDefenderName(), 'LocalRookie');
const replay = context.LocalNative.buildEnemyAttackReplayDict(20001);
assert.equal(replay.oppo.player.nickname, 'Enemy');
assert.ok(Array.isArray(replay.oppo.player.soldiers));
assert.ok(Array.isArray(replay.replay.records));
// Stock ILD passes replay.seed to BattleRecorder.setRandomSeed. An outer
// seed alone yields NaN from DA.getRandom and stalls static tower idle AI.
assert.equal(replay.replay.seed, 1);
assert.ok(Number.isFinite(replay.replay.seed));
assert.equal(replay.units[0].typeid, 30101);
assert.equal(replay.units[0].unit_type, 301);
assert.equal(replay.units[0].sid, 92001);
assert.equal(replay.units[0].faction, context.BATTLE_FACTION_DEFENDER);
assert.ok(replay.battleLogItem);
assert.ok(replay.tempReplayBattleLog);
assert.equal(replay.player, level.player);
assert.equal(replay.pveConfig.id, 20001);
assert.equal(level.oppo, undefined);
assert.ok(replay.self.player);
assert.equal(replay.self.nickname, 'LocalRookie');
assert.ok(replay.level_data.self.player);
assert.equal(replay.level_data.self.nickname, 'LocalRookie');
assert.ok(Array.isArray(replay.oppo.units));
assert.equal(replay.oppo.units[0].typeid, 30101);
assert.ok(replay.units[0].cid != null);

// Assert the stock positional contract, which previous mocks failed to check.
const defenderClient = {faction: 2};
context.LocalNative.ensureBattleClients = () => ({defender: defenderClient});
// Home-city leftovers share SIDs; dedup must ignore UnitManager and still create.
context.G_UnitManager = {
    getUnitBySID() { return {sid: 100, typeid: 30101, x: 24, y: 24}; },
    getAllUnits() { return [{sid: 100, typeid: 30101, x: 24, y: 24}]; }
};
const battle = {defenders: [], attackers: [], _createBattleUnitWhenInit(unit, client) {
    assert.equal(client, defenderClient);
    assert.equal(unit.typeid, 30101);
    this.defenders.push(unit.sid);
}};
assert.equal(context.LocalNative.hasBattleBuilding(battle, replay.units[0]), false);
const created = context.LocalNative.forceCreateBattleUnits(battle, replay.units);
assert.equal(created.created, 1);
assert.equal(created.now, 1);
assert.equal(created.skipped, 0);
assert.equal(context.LocalNative.hasBattleBuilding(battle, replay.units[0]), true);
// Same sid/tile must not stack a second shell (explode-then-resurrect bug).
const createdAgain = context.LocalNative.forceCreateBattleUnits(battle, replay.units);
assert.equal(createdAgain.created, 0);
assert.equal(createdAgain.skipped, 1);
assert.equal(battle.defenders.length, 1);
assert.equal(context.LocalNative.ensureBattleVillageUnits(battle, replay.units, 'dup-check'), 1);
assert.equal(battle.defenders.length, 1);
assert.equal(context.LocalNative.listMissingBattleBuildings(battle, replay.units).length, 0);
context.LocalNative.resolveBattleClient = () => ({faction: 1});
let deployments = 0;
battle.startBattle = function() { this.battleStarted = true; };
battle.mapManager = {TileCenterPosForLogicCoord(x, y) { return {x: x * 32, y: y * 24}; }};
battle.sendUnitToMap = function(params, position) {
    assert.equal(params.typeid, 10101);
    assert.equal(params.faction, 1);
    assert.equal('x' in params, false);
    assert.equal('y' in params, false);
    assert.equal('unit_type' in params, false);
    assert.ok(position.x > 0 && position.y > 0);
    deployments++;
    this.attackers.push(deployments);
    return {};
};
assert.equal(context.LocalNative.spawnStubAttackers(battle), 4);
assert.equal(context.LocalNative.spawnStubAttackers(battle), 0);
assert.equal(deployments, 4);
assert.equal(replay.records.length, 1);
assert.equal(replay.records[0][2], 7);
// Construction placeholder must fight as finished bunker (skill 30101_atk).
const ghost = context.LocalNative.normalizeReplayUnits([{sid: 101, typeid: 30100, x: 24, y: 24}]);
assert.equal(ghost[0].typeid, 30101);
assert.equal(ghost[0].unit_level, 1);
// Bunker garrison (defense_id) survives in the raid envelope; attack-team Dino does not.
context.LocalNative.readRaw = () => ({
    level: {
        player: {nickname: 'LocalRookie', heros: [{cid: 1, typeid: 10112, defense_id: 100}]},
        units: [{sid: 100, typeid: 30101, x: 24, y: 24}],
        heros: [
            {sid: 5, typeid: 10401, attack_index: 1, state: 1, defense_id: 0},
            {cid: 1, typeid: 10112, defense_id: 100}
        ]
    }
});
const replayHero = context.LocalNative.buildEnemyAttackReplayDict(20001);
assert.equal(replayHero.self.heros.length, 1);
assert.equal(replayHero.self.heros[0].defense_id, 100);
assert.equal(replayHero.self.heros[0].typeid, 10112);
assert.equal(replayHero.oppo.heros.length, 0);
// Restoring local live combat must not bypass or reset the stock FSM.
let stockCalls = 0;
const stockController = {
    config: {skill_nums: [[30101]]},
    skillManager: {identity: 'must-survive'},
    onIdle() { stockCalls++; },
    beginSkill() { stockCalls++; },
    resumeBattle() { stockCalls++; },
    comeToWorld() { stockCalls++; },
    onBattleBegin() { stockCalls++; }
};
const wakeUnit = {typeid: 30101, getComponent() { return stockController; }};
context.G_UnitManager.getUnit = () => wakeUnit;
const wakeGc = {
    battleStarted: true, inReplayMode: true, noUserOperSkill: true,
    defenders: [100], battleRecorder: {randomSeed: replay.replay.seed},
    _setupAllUnit() { stockCalls++; }
};
assert.equal(typeof context.LocalNative.clearBattleOperGates, 'function');
assert.equal(typeof context.LocalNative.enableDefenderLiveCombat, 'function');
context.LocalNative.clearBattleOperGates(wakeGc);
assert.equal(wakeGc.noUserOperSkill, false, 'clearBattleOperGates must drop skill gate');
wakeGc.noUserOperSkill = true;
context.LocalNative.enableDefenderLiveCombat(wakeGc, 'test');
context.LocalNative.enableDefenderLiveCombat(wakeGc, 'repeat');
assert.equal(wakeGc.inReplayMode, true, 'must keep inReplayMode for stock settle/onReplayEnd');
assert.equal(wakeGc.noUserOperSkill, false);
assert.equal(stockCalls, 0, 'adapter must leave target selection, cooldown and casting to stock AI');
assert.equal(stockController.skillManager.identity, 'must-survive');
assert.ok(!source.includes('bc.beginSkill()'), 'zero-argument cast has an undefined target');
assert.ok(!source.includes('ts.addThreat('), 'adapter must not manufacture threat');

const saved = {level: {user_config: {rookie0: 6210}, player: {first_movie_played: 1}}};
context.LocalNative.readRaw = () => saved;
context.LocalNative.writeRaw = value => value;
load('saveLevel', 'mergeUserConfig', context);
context.LocalNative.saveLevel({player: {first_movie_played: 0}, user_config: {}, units: []});
assert.equal(saved.level.user_config.rookie0, 6210);
assert.equal(saved.level.player.first_movie_played, 1);

context.bp = {};
context.origRookie = cfg => cfg;
const guideStart = source.indexOf('                        bp.initRookieByServer = function(userConfig)');
const guideEnd = source.indexOf('                        bp.initRookieByServer.__localNativePatched', guideStart);
assert.ok(guideStart >= 0 && guideEnd > guideStart);
vm.runInNewContext(source.slice(guideStart, guideEnd), context);
assert.equal(context.bp.initRookieByServer(undefined).rookie0, 6210);
assert.equal(context.bp.initRookieByServer({}).rookie0, 6210);
assert.equal(context.bp.initRookieByServer({rookie0: 66}).rookie0, 66);

let returns = 0;
queued = [];
Object.assign(context, {
    GS_CURRENT_STAGE: 2, GS_STAGE_BUILD: 1, GS_STAGE_BATTLE: 2,
    G_Player: {rpc_c_battle_to_home() { returns++; }}
});
context.LocalNative.writeStatus = () => {};
context.LocalNative.clearLoadingSafe = () => {};
context.LocalNative.replaySession = {returning: false, closed: false};
load('abortBattleEnterToHome', 'handleEnterEnemyAttackReplay', context);
context.LocalNative.abortBattleEnterToHome('battle-ild-ERR');
context.LocalNative.abortBattleEnterToHome('replay-loading-stuck');
assert.equal(returns, 1);
let entries = 0;
context.LocalNative.replaySession = null;
context.LocalNative.buildEnemyAttackReplayDict = () => replay;
load('handleEnterEnemyAttackReplay', 'handleFinishEnemyAttackReplay', context);
const player = {rpc_c_enter_enemy_attack_replay() { entries++; }};
context.LocalNative.handleEnterEnemyAttackReplay(player, {stage: 20001});
context.LocalNative.handleEnterEnemyAttackReplay(player, {stage: 20001});
assert.equal(entries, 1);
context.LocalNative.abortBattleEnterToHome('battle-ild-ERR');
queued[queued.length - 2].fn(); // watchdog scheduled before return completion
assert.equal(returns, 2);
console.log('PASS: scheduling, nested self/oppo ACK, progress preservation, duplicate entry/return and stale watchdog');

