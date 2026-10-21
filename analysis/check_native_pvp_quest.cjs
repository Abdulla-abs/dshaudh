const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
let disk, gc, winner = true, failWrite = false;
let enters = 0, results = 0, homes = 0;
const recorder = {}, der = {event_counters:{}};
const ctx = {LocalNative: {
    readRaw: () => JSON.parse(disk),
    writeRaw(s) { if (failWrite) throw Error('disk unavailable'); disk = JSON.stringify(s); },
    writeStatus() {},
    ensurePlayerSocialFields(p) { p.achieve_raw = p.achieve_raw || {}; },
    getResourceManager: () => ({Res:{1:4001,2:4982},maxRes:{1:20000,2:20000}}),
    buildPveBattleDict(stage) {
        assert.equal(stage,1);
        return {self:{player:{},heros:[{}]},oppo:{player:{stage:1},units:[{}]},isPVE:true};
    },
    getBattleController: () => gc,
    buildPveBattleResultDict: () => ({starNum:winner?2:0,isWinner:winner,win_gold:100,win_wood:100}),
}, data:{}};
vm.createContext(ctx);
for (const [dir,name] of [['quest','daily_task'],['shop-treasure','period_control']])
    vm.runInContext(fs.readFileSync(`${__dirname}/../.local/${dir}/${name}.js`,'utf8'),ctx);
function load(name,next) {
    const a=source.indexOf(`        LocalNative.${name} = function`);
    const b=source.indexOf(`        LocalNative.${next} = function`,a+1);
    assert.ok(a>=0 && b>a,name); vm.runInContext(source.slice(a,b),ctx);
}
vm.runInContext(source.slice(source.indexOf('        // BEGIN SCOUT LEVEL POOL'),
    source.indexOf('        LocalNative.buildPvpBattleDict = function')),ctx);
load('buildPvpBattleDict','handleEnterPveBattle');
load('ensureDailyQuestBucket','seedDailyQuestRoots');
load('syncQuestEventRecorder','nextDailyQuestIds');
load('advanceDailyQuestCounter','syncQuestPackageAndWallet');
const n = ctx.LocalNative;
// Execute the actual controller binding and start wrapper used by the adapter.
const bindStart=source.indexOf('this.__localPvpSession = dict && dict.localNativePvp ?');
const bindEnd=source.indexOf('null;',bindStart)+5;
assert.ok(bindStart>0 && bindEnd>bindStart);
const bind=vm.runInContext(`(function(dict){${source.slice(bindStart,bindEnd)}})`,ctx);
ctx.btp={}; ctx.origStartBattle=function(){this.battleStarted=true;};
const start=source.indexOf('                        btp.startBattle = function()');
const end=source.indexOf('                        btp.startBattle.__localNativePatched',start);
vm.runInContext(source.slice(start,end),ctx);
const player = {
    rpc_c_enter_battle(dict) {
        enters++; assert.equal(dict.oppo.player.stage,0);
        gc={battleStarted:false}; bind.call(gc,dict);
    },
    rpc_c_battle_result(dict) { results++; assert.equal(dict.stage,0); },
    rpc_c_battle_to_home(level) { homes++; assert.equal(level.user_config.rookie0,123); },
    getComponent(name) { return name==='DailyEventRecorder'?der:name==='AchievementRecorder'?recorder:null; },
};
const initial={level:{player:{availableStages:{1:[0,0,3,0]},event_counters:{}},
    user_config:{rookie0:123},heros:[{sid:'a'}]}};
for (const id of [3806,4006,3803,4003,4103]) {
    const b=n.ensureDailyQuestBucket(initial.level,id);
    b.entry.d.current[id]={}; b.entry.clientData.current={[id]:{canFinish:false}};
}
const claimed=n.ensureDailyQuestBucket(initial.level,4103);
claimed.entry.d.current={}; claimed.entry.d.last=4103;
disk=JSON.stringify(initial);
function progress(id,field) {
    const cfg=ctx.data.daily_task[id];
    const b=JSON.parse(disk).level.player.event_counters[1][cfg.reset_period];
    return b.d.current[id] && (b.d.current[id][field] || 0);
}
assert.equal(n.handleEnterPvpBattle(player),true);
const dict=n.buildPvpBattleDict(JSON.parse(disk).level,player);
assert.equal(dict.isPVE,false); assert.equal(dict.self.gold,4982); assert.equal(dict.self.wood,4001);
assert.equal(progress(3806,'mt_PVP'),0,'scouting is not an attack');
assert.equal(n.handleCompletePvpBattle(player),false,'cannot settle before a battle starts');
assert.equal(n.handleEnterPvpBattle(player),true,'switching scouting targets is allowed');
assert.equal(progress(3806,'mt_PVP'),0);
assert.equal(n.handlePvpBattleToHome(player),true);
assert.equal(n.handlePvpBattleToHome(player),false);
assert.equal(JSON.parse(disk).level.player.achieve_raw,undefined);

// Actual start wrapper advances attempts once, before a loss or surrender.
assert.equal(n.handleEnterPvpBattle(player),true);
ctx.btp.startBattle.call(gc);
assert.equal(progress(3806,'mt_PVP'),1);
assert.equal(progress(4006,'mt_PVP'),1);
ctx.btp.startBattle.call(gc);
assert.equal(progress(3806,'mt_PVP'),1,'duplicate starts do not count');
assert.equal(n.handleEnterPvpBattle(player),false,'started battle cannot switch targets');
winner=false;
assert.equal(n.handleCompletePvpBattle(player),true);
assert.equal(progress(3803,'mt_PVPvictory'),0,'defeat is not a successful raid');
assert.equal(n.handleCompletePvpBattle(player),false);
assert.equal(JSON.parse(disk).level.player.achieve_raw.pvp_times,1);
assert.equal(n.handlePvpBattleToHome(player),true);

// Victory updates active daily tiers and invalidates their cached false status.
assert.equal(n.handleEnterPvpBattle(player),true);
ctx.btp.startBattle.call(gc); winner=true;
assert.equal(n.handleCompletePvpBattle(player),true);
assert.equal(progress(3806,'mt_PVP'),2);
assert.equal(progress(3803,'mt_PVPvictory'),1);
assert.equal(progress(4003,'mt_PVPvictory'),1);
assert.equal(progress(4103,'mt_PVPvictory'),undefined,'claimed quests stay absent');
assert.equal(n.handleCompletePvpBattle(player),false);
assert.equal(progress(3803,'mt_PVPvictory'),1);
assert.equal(recorder.achieve_raw.pvp_win_times,1);
const victoryBucket=n.ensureDailyQuestBucket(JSON.parse(disk).level,3803);
assert.equal(victoryBucket.entry.clientData.current[3803].canFinish,undefined);
assert.equal(der.event_counters[1][victoryBucket.periodId].d.current[3803].mt_PVPvictory,1);
assert.equal(n.handlePvpBattleToHome(player),true);
assert.deepEqual(JSON.parse(disk).level.player.availableStages,{1:[0,0,3,0]});

// A stale controller, another battle mode, or replay must never advance PVP.
assert.equal(n.handleEnterPvpBattle(player),true);
const before=disk;
assert.equal(n.handleStartPvpBattle({battleStarted:true}),false);
gc.battleStarted=true; gc.inReplayMode=true;
assert.equal(n.handleStartPvpBattle(gc),false); gc.inReplayMode=false;
bind.call(gc,{localNativePve:true});
assert.equal(n.handleStartPvpBattle(gc),false);
assert.equal(disk,before);
bind.call(gc,{localNativePvp:true});
failWrite=true;
assert.throws(()=>n.handleStartPvpBattle(gc),/disk unavailable/);
assert.equal(n.pvpSession.started,undefined,'failed save can retry');
assert.equal(disk,before);
failWrite=false; assert.equal(n.handleStartPvpBattle(gc),true);
assert.equal(progress(3806,'mt_PVP'),3);
assert.equal(n.handlePvpBattleToHome(player),true,'leaving a started battle retains attempts');
assert.equal(progress(3803,'mt_PVPvictory'),1);
assert.equal(results,2); assert.equal(homes,4); assert.equal(enters,5);
console.log('PASS: actual PVP start hook, daily attempts/victories, defeat/scout/replay exclusions, persistence, duplicate and save failure');
