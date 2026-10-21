const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
const store = {level: {player: {availableStages: {1:[0,0,3,0]}}, user_config:{rookie0:123}, heros:[{sid:'a'}]}};
let enters = 0, results = 0, homes = 0;
const battleController = {battleStarted:true};
const player = {
    rpc_c_enter_battle(dict) { enters++; assert.equal(dict.oppo.player.stage, 0);
        battleController.__localPvpSession = ctx.LocalNative.pvpSession; },
    rpc_c_battle_result(dict) { results++; assert.equal(dict.stage, 0); },
    rpc_c_battle_to_home(level) { homes++; assert.equal(level.user_config.rookie0,123); },
    getComponent() { return recorder; },
};
const recorder = {};
const ctx = {LocalNative: {
    readRaw: () => store, writeRaw() {}, writeStatus() {},
    advanceDailyQuestCounter() {}, syncQuestEventRecorder() {},
    ensurePlayerSocialFields(p) { p.achieve_raw = p.achieve_raw || {}; },
    getResourceManager: () => ({Res:{1:4001,2:4982},maxRes:{1:20000,2:20000}}),
    buildPveBattleDict(stage) {
        assert.equal(stage,1);
        return {self:{player:{},heros:[{}]},oppo:{player:{stage:1},units:[{}]},isPVE:true};
    },
    getBattleController: () => battleController,
    buildPveBattleResultDict: () => ({starNum:2,isWinner:true,win_gold:100,win_wood:100}),
}};
vm.createContext(ctx);
const a = source.indexOf('        // BEGIN SCOUT LEVEL POOL');
const b = source.indexOf('        LocalNative.handleEnterPveBattle = function', a);
vm.runInContext(source.slice(a,b),ctx);
const n = ctx.LocalNative;
assert.equal(n.handleEnterPvpBattle(player),true);
assert.equal(enters,1);
const dict = n.buildPvpBattleDict(store.level,player);
assert.equal(dict.isPVE,false);
assert.equal(dict.self.gold,4982);
assert.equal(dict.self.wood,4001);
assert.equal(n.handleCompletePvpBattle(player),true);
assert.equal(store.level.player.achieve_raw.pvp_times,1);
assert.equal(recorder.achieve_raw.pvp_times,1);
assert.equal(n.handleCompletePvpBattle(player),false);
assert.equal(results,1);
assert.equal(n.handlePvpBattleToHome(player),true);
assert.equal(n.handlePvpBattleToHome(player),false);
assert.equal(homes,1);
assert.deepEqual(store.level.player.availableStages,{1:[0,0,3,0]});
assert.equal(n.handleEnterPvpBattle(player),true);
assert.equal(n.handlePvpBattleToHome(player),true);
assert.equal(store.level.player.achieve_raw.pvp_times,1,'abandoning scouting is not a finished battle');
console.log('PASS: PVP scout enter, wallet preservation, completion receipt, duplicate/abort and home progress');
