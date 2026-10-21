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
        units: [{sid: 1, typeid: 20101}, {sid: 2, typeid: 20602}],
        user_config: {},
        heros: []
    }
};

const n = {
    lookupUnitMain: () => ({gold_storage:20000,wood_storage:20000}),
    STARTER_HERO_TYPEID: 10401,
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
    data: {pve_stage: {1: {pve_next_stage: [2], coin_storage: 288, solar_storage: 788,
        pve_first_reward:8001,pve_roll_reward:8002,sweep_hero_exp:4}},
        item_input:{4000:{item_id:1125,item_num:300},8001:{item_id:1125,item_num:999}},
        item:{1125:{}},input_event_client:{8001:{putin_event_item:[4000]},8002:{}}},
    RES_TYPE_GOLD: 2,
    RES_TYPE_WOOD: 1,
    G_Player: null
};

// Keep test stubs for getBattleController / readRaw; only load settle helpers.
for (const name of ['hero_lv_data','hero_number'])
    vm.runInNewContext(fs.readFileSync(`${__dirname}/../.local/hero-exp/${name}.js`,'utf8'),context);
const stubGc = n.getBattleController;
loadRange('        LocalNative.defaultStarterHero = function',
    '        LocalNative.defaultLevelDict = function', context);
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
assert.equal(store.level.player.package.material.item_dict.local_pve_1125.num,300);
assert.equal(store.level.heros[0].lv,2,'saved battle XP advances level');
assert.equal(store.level.heros[0].xp,1,'saved XP consumes level-1 threshold');
const rewardedState=JSON.stringify(store);
assert.equal(n.handleCompletePveBattle(player,{}),false);
assert.equal(JSON.stringify(store),rewardedState,'duplicate completion cannot grant loot/items twice');

assert.equal(n.handlePveBattleToHome(player, {}), true);
assert.equal(homeCalls, 1);
assert.equal(n.handlePveBattleToHome(player, {}), false, 'duplicate home blocked');

// Exercise live manual settlement against the original reward event tables.
for (const [folder, name] of [['hero-guide-entry','pve_stage'], ['hero-guide-entry','item_input'],
    ['shop-treasure','input_event_client'], ['shop-treasure','item']])
    vm.runInNewContext(fs.readFileSync(`${__dirname}/../.local/${folder}/${name}.js`, 'utf8'), context);
loadRange('        LocalNative.shopAddItem = function',
    '        LocalNative.shopHeroPools = function', context);
n.shopState = level => level.localShop || (level.localShop = {sequence: 0});
const controlledMath = Object.create(Math);
controlledMath.random = () => 0;
context.Math = controlledMath;
// The earlier functions keep their VM global object, so bind the isolated Math
// through the same context and reload only the reward roll helpers.
loadRange('        LocalNative.rollPveSweepItems = function',
    '        LocalNative.handlePveSweep = function', context);
const countItem = id => Object.values(store.level.player.package || {}).reduce((sum, bag) =>
    sum + Object.values(bag.item_dict).filter(x => x.typeid === id).reduce((s, x) => s + x.num, 0), 0);
let acknowledgements = 0;
const rewardPlayer = {availableStages: store.level.player.availableStages,
    rpc_c_battle_result(dict) {
        acknowledgements++;
        if (dict.starNum > 0) assert.ok(dict.input_gains.some(g => g[0] === 19));
    }};
const bookBefore = countItem(210000), skillBefore = countItem(200145);
n.pveSession = {stage: 9, closed: false, completed: false};
assert.equal(n.handleCompletePveBattle(rewardPlayer, {}), true);
assert.equal(countItem(210000), bookBefore + 1, 'manual victory grants independent book');
assert.equal(countItem(200145), skillBefore + 1, 'manual victory grants skill from event chain');
const manualSaved = JSON.stringify(store);
assert.equal(n.handleCompletePveBattle(rewardPlayer, {}), false);
assert.equal(JSON.stringify(store), manualSaved, 'duplicate manual result is idempotent');
const reloadedManual = JSON.parse(manualSaved);
assert.ok(Object.values(reloadedManual.level.player.package.advanced_prop.item_dict)
    .some(x => x.typeid === 210000 && x.num >= 1), 'book survives saved state reload');
// A separate repeat victory uses the same chain once and can award both items.
n.pveSession = {stage: 9, closed: false, completed: false};
assert.equal(n.handleCompletePveBattle(rewardPlayer, {}), true);
assert.equal(countItem(210000), bookBefore + 2);
assert.equal(countItem(200145), skillBefore + 2);
n.getBattleController = () => ({battleResult: {starNum: 0, isWinner: false, battlePercents: 0},
    calRoundPercentage: p => p});
n.pveSession = {stage: 9, closed: false, completed: false};
assert.equal(n.handleCompletePveBattle(rewardPlayer, {}), true);
assert.equal(countItem(210000), bookBefore + 2, 'defeat grants no book');
assert.equal(countItem(200145), skillBefore + 2, 'defeat grants no skill');
assert.equal(acknowledgements, 3);
console.log('PASS: PVE progress, complete/home, original manual reward chains, repeat/duplicate/defeat and saved reload');
