// Stock bytecode extraction: python analysis/inspect_native_arena.py
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const boot = fs.readFileSync(path.join(__dirname, 'native_boot.js'), 'utf8');
const original = name => fs.readFileSync(path.join(__dirname,
    '../.local/arena-audit/' + name + '.js'), 'utf8');
let now = 1429488000 + 604800 * 600 + 700, disk, entered, result, home, fail = false;
let writes = 0, resultCalls = 0;
const notices = [];
const c = {LocalNative: {}, data: {}, GlobalDefine: {}, GS_CURRENT_STAGE: 1, GS_STAGE_BUILD: 1,
    HERO_STATE_ATTACK: 1, PVE_BATTLE_MODE_ARENA: 10, DA: {getSystemCurrentTimeSec: () => now},
    G_MainController: {setNotice: x => notices.push(x)}};
vm.createContext(c);
for (const name of ['Client_GlobalDefine', 'Data_Common_period_control',
    'Data_Common_arena_weekly_reward', 'Data_Common_arena_monthly_reward', 'Data_Common_string_new'])
    vm.runInContext(original(name), c);
const n = c.LocalNative;
function load(name) {
    const start = boot.indexOf('        LocalNative.' + name + ' = function');
    const end = boot.indexOf('\n        };', start) + 11;
    assert.ok(start >= 0 && end > start, name);
    vm.runInContext(boot.slice(start, end), c);
}
for (const name of ['arenaNow', 'ensureArenaState', 'arenaAttackCounter', 'syncArenaState',
    'buildArenaBattleDict', 'handleArenaRpc', 'completeArenaBattle', 'arenaBattleToHome',
    'readScoutHeadquartersLevel', 'makeBattleSide', 'syncQuestEventRecorder',
    'prepareHeroBattleSkills']) load(name);
c.data.unit_battle = {10602: {skill_nums: {12345: [10101]}}, 11101: {skill_nums: {0: [20101]}}};
c.data.skill_data = {10101: {}, 10203: {}, 20101: {}};
function stockMethod(file, prefix, name) {
    let source = original(file + '.functions');
    if (!source.includes(prefix + '.' + name + '=')) source = original(file);
    const start = source.indexOf(prefix + '.' + name + '=');
    const begin = source.indexOf('function', start);
    const next = source.indexOf('\n' + prefix + '.', begin);
    const end = source.lastIndexOf('};', next < 0 ? source.length : next);
    assert.ok(start >= 0 && end > begin, name);
    // Pseudo-JS omits local declarations; restore the local pool so the stock
    // getAttackCountLeft variable named data cannot overwrite global tables.
    const locals = name === 'getEventData' ? 'config' : 'der, data, now, _var_2, _var_3';
    const recovered = source.slice(begin, end + 1).replace('{', '{ var ' + locals + ';');
    return vm.runInContext('(' + recovered + ')', c);
}
const stockCount = stockMethod('Client_Components_Arena', 'ArenaComponent.prototype', 'getAttackCountLeft');
const stockTime = stockMethod('Client_Components_Arena', 'ArenaComponent.prototype', 'getNextAttackCountRecoverTimeLeft');
const stockEvent = stockMethod('Client_Components_CommonComponent', 'Comp.DailyEventRecorder.prototype', 'getEventData');
const clone = x => JSON.parse(JSON.stringify(x));
const der = {event_counters: {}, getEventData: stockEvent, getEventResetTime: () => now + 99999};
const arena = {master: {getComponent: () => der}};
const player = {
    getComponent: key => key === 'DailyEventRecorder' ? der : null,
    rpc_c_sync_arena_state(d) {arena.state = d.state;},
    rpc_c_enter_arena_battle_ans() {},
    rpc_c_enter_battle(d) {entered = d;},
    rpc_c_gain_arena_rewards_ans(d) {this.reward = d;},
    rpc_c_battle_result(d) {result = d; resultCalls++;},
    rpc_c_battle_to_home(d) {home = d;}
};
const gc = {battleFinished: true, battleResult: {isWinner: true}};
n.getBattleController = () => gc;
n.getResourceManager = () => ({Res: {1: 100, 2: 200}, maxRes: {1: 1000, 2: 1000}});
n.readRaw = () => clone(disk);
n.writeRaw = value => {if (fail) throw new Error('disk full'); disk = clone(value); writes++;};
n.tryDumpAndSave = () => true;
n.writeStatus = () => {};
n.syncQuestPackageAndWallet = () => {};
n.collectQuestPutinRewards = (level, id) => {
    level.player.claimed = (level.player.claimed || []).concat(id);
    return [[id, 1]];
};
function seed() {
    disk = {level: {player: {nickname: 'player', availableStages: {7: [1, 2, 3, 0]}},
        units: [{sid: 1, typeid: 20108, x: 27, y: 27}], heros: [
            {sid: 'a', typeid: 10602, state: 1, aidx: 2, lv: 70,
                skills: [10101, 10203], eqp: [{id: 123, attrs: [1, 2]}],
                skill_slots: [{sid: 102, lv: 3}],
                did: '100', defense_id: '100',
                gift: {lv: 3, exp: 7, attrs: [9]}, unit_mutateid: 12345},
            {sid: 'b', typeid: 11101, state: 1, aidx: 1, lv: 20, skills: [20101], eqp: []},
            {sid: 'c', typeid: 10501, state: 0, lv: 10, skills: []}],
        user_config: {autoAttack: false}}};
    n.arenaSession = null; n.pveSession = null; n.pvpSession = null;
    entered = result = home = null; fail = false;
}
function enter() {
    assert.equal(n.handleArenaRpc(player, 'rpc_s_enter_arena_battle'), true);
    gc.__localArenaSession = n.arenaSession;
    gc.battleFinished = true; gc.battleResult.isWinner = true;
}
seed();
const before = clone(disk.level);
enter();
assert.equal(entered.oppo.player.pve_mode, 10);
assert.equal(entered.oppo.player.stage, 3000000);
assert.equal(entered.arena.hero_positions.attacker[0].length, 2);
assert.equal(entered.arena.hero_positions.defender[0].length, 2);
assert.equal(Object.keys(entered.arena.self.heros).length, 2);
assert.equal(entered.arena.self.heros[1].unit_type, 111);
const h = entered.arena.self.heros[2], m = entered.arena.oppo.heros[2];
for (const k of ['lv', 'skills', 'eqp', 'gift', 'unit_mutateid']) assert.deepEqual(h[k], m[k], k);
assert.notEqual(h.sid, m.sid);
assert.equal(h.did, 0); assert.equal(m.defense_id, 0);
assert.notEqual(h, m); assert.notEqual(h.eqp, m.eqp);
m.eqp[0].attrs[0] = -1; m.skills[0] = -1;
assert.equal(h.eqp[0].attrs[0], 1); assert.equal(h.skills[0], 10101);
assert.deepEqual(disk.level.heros, before.heros);
assert.deepEqual(disk.level.units, before.units);
assert.equal(stockCount.call(arena), 9);
now += 1800;
assert.equal(stockTime.call(arena), 1800);
assert.equal(stockCount.call(arena), 9);
now += 1800;
assert.equal(stockCount.call(arena), 10);
const first = disk.level.player.arena_state.season;
assert.equal(n.completeArenaBattle(player, false), true);
assert.equal(disk.level.player.arena_state.season.score, 10);
assert.equal(result.star_num, 3);
assert.equal(n.completeArenaBattle(player, false), false);
assert.equal(disk.level.player.arena_state.season.score, 10);
assert.equal(n.arenaBattleToHome(player, false), true);
assert.equal(home.player.arena_state.season.score, 10);
assert.deepEqual(clone(home.heros), before.heros);
assert.deepEqual(clone(home.player.availableStages), before.player.availableStages);
assert.equal(n.arenaBattleToHome(player, false), false);
// Defeat earns five, even after partial damage; stars never imply a win.
enter(); gc.battleResult = {isWinner: false, starNum: 1};
assert.equal(n.completeArenaBattle(player, false), true);
assert.equal(disk.level.player.arena_state.season.score, 15);
assert.equal(result.star_num, 0);
n.arenaBattleToHome(player, false);
// Persist first, then ACK. Failed writes neither consume attempts nor pay points.
const saved = clone(disk); fail = true;
assert.equal(n.handleArenaRpc(player, 'rpc_s_enter_arena_battle'), false);
assert.deepEqual(disk, saved); fail = false;
enter(); fail = true;
assert.throws(() => n.completeArenaBattle(player, false), /disk full/);
assert.equal(n.arenaSession.completed, false); fail = false;
assert.equal(n.completeArenaBattle(player, false), true);
n.arenaBattleToHome(player, false);
// Entry gates use saved actual roster and HQ, without a fallback first hero.
seed(); disk.level.heros.forEach(x => x.state = 0);
assert.equal(n.handleArenaRpc(player, 'rpc_s_enter_arena_battle'), false); assert.equal(entered, null);
seed(); disk.level.units[0].typeid = 20104;
assert.equal(n.handleArenaRpc(player, 'rpc_s_enter_arena_battle'), false);
seed(); n.ensureArenaState(disk.level); n.arenaAttackCounter(disk.level).d.attack_count = 0;
assert.equal(n.handleArenaRpc(player, 'rpc_s_enter_arena_battle'), false);
// Promotion retains original 100-point threshold and best-of-five/three wins.
seed(); n.ensureArenaState(disk.level).season.score = 95; enter();
n.completeArenaBattle(player, false);
assert.equal(disk.level.player.arena_state.season.phase, 2);
n.arenaBattleToHome(player, false);
for (let i = 0; i < 3; i++) {enter(); n.completeArenaBattle(player, false); n.arenaBattleToHome(player, false);}
assert.equal(disk.level.player.arena_state.season.group, 2);
assert.equal(disk.level.player.arena_state.season.score, 0);
// Unknown failure deduction is explicitly pending, never silently fabricated.
seed(); const state = n.ensureArenaState(disk.level); state.season.score = 100; state.season.phase = 2;
for (let i = 0; i < 5; i++) {
    enter(); gc.battleResult.isWinner = false; n.completeArenaBattle(player, false);
    n.arenaBattleToHome(player, false);
}
assert.equal(disk.level.localArenaPromotionFailure.score, 100);
assert.equal(n.handleArenaRpc(player, 'rpc_s_enter_arena_battle'), false);
// Weekly/season rewards use original table IDs and cannot be claimed twice.
seed(); n.ensureArenaState(disk.level).season.score = 10;
now += 604800;
n.ensureArenaState(disk.level);
assert.deepEqual(clone(disk.level.player.arena_state.rewards), [63511]);
assert.equal(n.handleArenaRpc(player, 'rpc_s_gain_arena_rewards'), true);
assert.deepEqual(disk.level.player.claimed, [63511]);
n.handleArenaRpc(player, 'rpc_s_gain_arena_rewards');
assert.deepEqual(disk.level.player.claimed, [63511]);
now += 604800 * 4;
n.ensureArenaState(disk.level);
assert.deepEqual(clone(disk.level.player.arena_state.rewards), [63511, 63533]);
assert.equal(disk.level.player.arena_state.season.score, 0);
// Results use strict session identity and persistent receipt, including early return.
seed(); enter(); gc.__localArenaSession = null;
assert.equal(n.completeArenaBattle(player, false), false);
gc.__localArenaSession = n.arenaSession;
assert.equal(n.arenaBattleToHome(player, true), true);
assert.equal(disk.level.player.arena_state.season.score, 5);
assert.equal(home.player.arena_state.season.score, 5);
// RPC routing precedes generic PVE/PVP settlement.
assert.ok(boot.indexOf("LocalNative.completeArenaBattle(player, false);") <
    boot.indexOf("if (methodName === 'rpc_s_complete_battle' && LocalNative.pvpSession"));
assert.match(c.data.string_new.arena_normal_intro.Chinese, /10.*5/);
assert.match(c.data.string_new.arena_rise_intro.Chinese, /5.*3/);
// Original reward chains, all eleven groups: real package mutations and rollback.
for (const name of ['input_event_client', 'item_input', 'resource_input', 'item'])
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../.local/wanted', name + '.js'), 'utf8'), c);
for (const name of ['collectQuestPutinRewards', 'questScaledResAmount', 'shopRollItemEvent',
    'shopState', 'shopAddItem', 'saveLevel']) load(name);
function countItem(level, id) {
    return Object.values(level.player.package || {}).reduce((sum, bag) =>
        sum + Object.values(bag.item_dict || {}).reduce((n, item) =>
            n + (Number(item.typeid) === id ? Number(item.num) : 0), 0), 0);
}
for (let group = 1; group <= 11; group++) {
    for (const kind of ['arena_weekly_reward', 'arena_monthly_reward']) {
        seed(); n.ensureArenaState(disk.level);
        const reward = c.data[kind][group].group_reward;
        disk.level.player.arena_state.rewards = [reward];
        assert.equal(n.handleArenaRpc(player, 'rpc_s_gain_arena_rewards'), true);
        const expected = {};
        for (let id = reward; id; id = c.data.input_event_client[id].putin_event_next)
            for (const itemID of c.data.input_event_client[id].putin_event_item) {
                const item = c.data.item_input[itemID];
                expected[item.item_id] = (expected[item.item_id] || 0) + item.item_num;
            }
        for (const [id, num] of Object.entries(expected))
            assert.equal(countItem(disk.level, Number(id)), num, kind + ':' + group);
        const packageBefore = clone(disk.level.player.package);
        n.handleArenaRpc(player, 'rpc_s_gain_arena_rewards');
        assert.deepEqual(disk.level.player.package, packageBefore);
    }
}
seed(); n.ensureArenaState(disk.level);
disk.level.player.arena_state.rewards = [63511];
disk.level.player.package = {material: {item_dict: {}, capacity: 0}};
let rollback = clone(disk);
assert.equal(n.handleArenaRpc(player, 'rpc_s_gain_arena_rewards'), false);
assert.deepEqual(clone(disk), rollback);
seed(); n.ensureArenaState(disk.level); disk.level.player.arena_state.rewards = [63511];
rollback = clone(disk); fail = true;
assert.equal(n.handleArenaRpc(player, 'rpc_s_gain_arena_rewards'), false);
assert.deepEqual(clone(disk), rollback); fail = false;
// Generic saves preserve arena receipts, pending deduction and attempt data.
seed(); enter(); n.completeArenaBattle(player, false); n.arenaBattleToHome(player, false);
disk.level.localArenaPromotionFailure = {score: 100, wins: 2, attacks: 5};
const server = clone(disk.level);
const staleDump = clone(disk.level);
delete staleDump.localArenaSequence; delete staleDump.localArenaBattle;
delete staleDump.localArenaPromotionFailure; delete staleDump.player.event_counters;
staleDump.player.arena_state.season.score = 0;
n.saveLevel(staleDump);
for (const key of ['localArenaSequence', 'localArenaBattle', 'localArenaPromotionFailure'])
    assert.deepEqual(disk.level[key], server[key], key);
assert.deepEqual(disk.level.player.arena_state, server.player.arena_state);
assert.deepEqual(disk.level.player.event_counters, server.player.event_counters);
console.log('Arena: stock counters/help, mirror isolation, entry gates, win/loss, receipts, persistence, promotion and rewards passed.');
