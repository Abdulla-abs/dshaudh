// Run python analysis/inspect_native_wanted.py first (original bytecode evidence).
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, 'native_boot.js'), 'utf8');
const original = n => fs.readFileSync(path.join(__dirname, '../.local/wanted', n + '.js'), 'utf8');
let disk, entered, result, trigger, awards = 0;
const notices = [];
const c = {LocalNative: {}, data: {}, GS_CURRENT_STAGE: 1, GS_STAGE_BUILD: 1,
    G_UnitManager: {getUnitBySID() {return null;}},
    G_MainController: {setNotice(m) {notices.push(m);}},
    G_EventManager: {inputAward() {awards++;}},
    Comp: {HunterManager: function() {}}};
vm.createContext(c);
for (const name of ['wanted', 'wanted_control', 'period_control', 'input_event_client',
    'resource_input', 'item_input', 'item', 'pve_trigger', 'pve_trigger_server_to_client',
    'unit_main', 'unit_battle', 'skill_data', 'hero_to_skill', 'skill_to_hero', 'hero_evolve'])
    vm.runInContext(original(name), c);
for (const name of ['equipment_attribute', 'rune_order'])
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../.local/layout-editor/runes', name + '.js'), 'utf8'), c);
const n = c.LocalNative;
function load(name) {
    const a = source.indexOf(`        LocalNative.${name} = function`);
    const b = source.indexOf('\n        };', a) + 11;
    assert.ok(a >= 0 && b > a, name);
    vm.runInContext(source.slice(a, b), c);
}
for (const name of ['wantedCounter', 'wantedPeriod', 'wantedPick', 'ensureWantedCards',
    'syncWanted', 'installWantedAwardDisplay', 'handleWantedRpc', 'completeWantedBattle',
    'collectQuestPutinRewards', 'questScaledResAmount', 'shopRollItemEvent', 'shopAddItem',
    'shopState', 'shopTransaction', 'grantPveLoot', 'syncQuestEventRecorder',
    'buildPveBattleResultDict', 'handleCompletePveBattle', 'buildWantedTargetTrigger',
    'prepareHeroBattleSkills', 'allowWantedTargetGroundAndAir', 'buildWantedEquipment', 'runWantedTargetTrigger', 'applyWantedTargetBuff', 'castWantedGroundAndAirField']) load(name);
const rm = {Res: {1: 0, 2: 0, 3: 10000, 4: 0}};
const der = {event_counters: {}, last_update_time: 0};
const pm = {package: {}, init(d) {this.package = JSON.parse(JSON.stringify(d.package));}};
const hunter = new c.Comp.HunterManager();
const player = {level: 20,
    getComponent(name) {return {ResourceManager: rm, DailyEventRecorder: der,
        PackageManager: pm, HunterManager: hunter}[name];},
    rpc_c_refresh_daily_event(d) {
        assert.equal(d.event_id, 1020);
        der.event_counters[5][1020] = d.event_counter;
    },
    rpc_c_enter_battle(d) {entered = d;},
    rpc_c_battle_result(d) {result = d;},
    rpc_c_run_trigger(d) {trigger = d; gc.wantedTarget = 456;},
    rpc_c_reset_wanted_ans() {},
    rpc_c_get_reward_after_hunter_pve_ans(d) {
        assert.equal(hunter.wanted_id, 10401);
        assert.equal(hunter.hunter_win, true);
        hunter.getWantedReward(d.reward_get, hunter.wanted_reward);
    },
    rpc_c_get_help_for_wanted_ans(d) {hunter.getWantedReward(d.reward_get, d.reward);}
};
hunter.master = player;
c.Comp.HunterManager.prototype.getWantedReward = function(a, b) {
    assert.equal(JSON.stringify(a), JSON.stringify(b));
    c.G_EventManager.inputAward(a);
};
const gc = {battleResult: {starNum: 3, isWinner: true, pve_dict: {}, battlePercents: 100},
    wantedResideUnit: 123, createUnit(params) {return params;}};
Object.assign(n, {
    readRaw() {return JSON.parse(disk);}, writeRaw(s) {disk = JSON.stringify(s);},
    writeStatus() {}, getBattleController() {return gc;},
    copyAccountProgress(p) {p.level = player.level;},
    lookupUnitMain() {return {gold_storage: 999999, wood_storage: 999999};},
    shopPick() {throw Error('Wanted rewards must use original fixed fragments');},
    getResourceManager() {return rm;}, readPveStageLoot() {return [9999, 9999];},
    readLivePveStageId() {return 720;},
    syncQuestPackageAndWallet(p, l) {rm.Res[4] = l.player.spirit; pm.init({package: l.player.package});},
    buildPveBattleDict(stage) {return {oppo: {player: {stage}}, units: []};}
});
function reset() {
    disk = JSON.stringify({level: {player: {level: 20, diamond: 10000, spirit: 0,
        event_counters: {}, package: {}}, units: [{sid: 1, typeid: 20501, sto: {2: 0}}]}});
    rm.Res[4] = 0; der.event_counters = {}; pm.package = {}; n.pveSession = null;
    entered = result = trigger = undefined;
}
const rpc = (m, p) => n.handleWantedRpc(player, 'rpc_s_' + m, p);
reset();
assert.equal(rpc('refresh_wanted'), true);
// Execute the stock getEventData consumer against the actual payload shape.
const getDataSource = original('CommonComponent').match(
    /Comp\.DailyEventRecorder\.prototype\.getEventData=(\s*function\(event_id\) \{[\s\S]*?\n    \});/)[1];
c.der = der;
vm.runInContext('der.getEventData=' + getDataSource, c);
assert.ok(der.getEventData(1020).wanted1.wanted_id);
const firstCards = JSON.stringify(der.getEventData(1020));
rpc('refresh_wanted');
assert.equal(JSON.stringify(der.getEventData(1020)), firstCards, 'opening UI cannot reroll targets');
assert.equal(rpc('load_hunter_pve', {card_order: 0}), false, 'invalid card');
// Recover exact original pools: zero-weight targets never become selectable.
for (const lv of [1, 10, 20, 30, 40]) for (const order of [1, 2, 3]) {
    const level = {player: {level: lv}};
    const band = c.data.wanted['player_lv_info' + order].player_lv_info[lv];
    for (let i = 0; i < 100; i++) {
        const id = n.wantedPick(level, order).wanted_id;
        assert.ok(band.targets.some(t => t.wanted_id === id && t.probability > 0));
    }
}
// Pin a target for a reproducible original 82900 -> 82204 -> 82000 chain.
let saved = n.readRaw();
saved.level.player.event_counters[5][1020].d.wanted1 = {wanted_id: 10401, cost: 58};
n.writeRaw(saved); der.event_counters = saved.level.player.event_counters;
assert.equal(rpc('load_hunter_pve', {card_order: 1}), true);
assert.equal(entered.oppo.player.stage, 720);
assert.equal(entered.oppo.player.pve_mode, 3);
assert.equal(entered.oppo.player.wanted_id, 10401);
const selectedTrigger = JSON.stringify(n.pveSession.wantedTrigger);
assert.equal(rpc('run_server_trigger', {trigger_id: 2501, cid: 123}), false);
const liveBasic = {config: c.data.skill_data[10401], setTargetAirAvailable() {
    this.config = JSON.parse(JSON.stringify(this.config)); this.config.target_air = 1;
}};
c.G_UnitManager.getUnit = id => id === 456 ? {typeid: 10401,
    getComponent: () => ({skillManager: {getDefaultSkill: () => liveBasic}})} : null;
assert.equal(rpc('run_server_trigger', {trigger_id: 2500, cid: 123}), true);
assert.equal(liveBasic.config.target_air, 1, 'spawn RPC applies the override');
assert.equal(liveBasic.config.target_ground, 1);
assert.equal(trigger.config.trigger_unit, 10405);
assert.equal(c.data.unit_main[trigger.config.trigger_unit].battle_res, 'unit/ccb/10401.ccbi');
assert.equal(trigger.config.trigger_unit_lv, 20);
assert.equal(trigger.config.trigger_target_camp, 2);
assert.equal(trigger.config.pause_game, undefined);
assert.equal(trigger.config.card_status, undefined);
assert.equal(trigger.args.residerDead, 1);
assert.equal(JSON.stringify(trigger.config), selectedTrigger, 'use fixed skills selected before entry');
assert.equal(rpc('run_server_trigger', {trigger_id: 2500, cid: 123}), false);
gc.battleResult.pve_dict.wantedDead = 1;
assert.equal(n.handleCompletePveBattle(player, {}), true);
saved = n.readRaw();
assert.equal(saved.level.player.spirit, 10);
assert.equal(saved.level.units[0].sto[2], 5500); // 500 * (1 + 20 * .5)
const pieces = Object.values(saved.level.player.package.based_prop.item_dict);
assert.equal(pieces.length, 1);
assert.equal(pieces[0].typeid, 5001);
assert.equal(pieces[0].num, 4);
assert.equal(result.win_gold, 0, 'no extra generic stage loot');
assert.equal(saved.level.player.availableStages, undefined, 'no campaign progress');
const committed = disk;
assert.equal(n.handleCompletePveBattle(player, {}), false);
assert.equal(disk, committed);
// Simulate a restart after settlement, before home speaker/claim.
n.pveSession = null;
rm.Res[4] = saved.level.player.spirit;
der.event_counters = saved.level.player.event_counters;
pm.package = saved.level.player.package;
assert.equal(rpc('get_reward_after_hunter_pve'), true);
assert.equal(awards, 0, 'original award UI must not apply committed loot again');
assert.equal(n.readRaw().level.player.spirit, 10);
assert.equal(rpc('get_reward_after_hunter_pve'), false);
assert.equal(rpc('load_hunter_pve', {card_order: 1}), false, 'interval enforced');
assert.equal(rpc('reset_wanted_time', {card_order: 1, res_type: 'bogus'}), false);
assert.equal(rpc('reset_wanted_time', {card_order: 1, res_type: 'diamond'}), true);
assert.equal(rpc('load_hunter_pve', {card_order: 1}), true);
gc.battleResult.pve_dict = {}; // Even 3 village stars cannot replace killing target.
assert.equal(n.handleCompletePveBattle(player, {}), true);
assert.equal(n.readRaw().level.localWantedReward.win, false);
assert.equal(n.readRaw().level.player.spirit, 10);
// The original UI exposes advanced cards at player level 12: open_level is
// not consumed by its button flow and must not become an extra RPC gate.
reset(); player.level = 12;
assert.equal(rpc('load_hunter_pve', {card_order: 3}), true);
assert.equal(entered.oppo.player.stage, 760);
assert.equal(entered.oppo.player.pve_mode, 3);
player.level = 20;
// Original higher-card rewards and refresh gating.
reset(); rpc('refresh_wanted');
assert.equal(rpc('get_help_for_wanted', {card_order: 2}), true);
assert.equal(n.readRaw().level.player.spirit, 28);
assert.equal(rpc('get_help_for_wanted', {card_order: 2}), false);
assert.equal(rpc('reset_wanted', {card_order: 1}), true);
assert.equal(rpc('reset_wanted', {card_order: 1}), false);
// Every target with positive original weight is supported. Zero-weight legacy
// full-hero events stay disabled; their presence is not a drop-rate promise.
const enabled = new Set();
for (const order of [1, 2, 3])
    for (const band of Object.values(c.data.wanted['player_lv_info' + order].player_lv_info))
        for (const target of band.targets) if (target.probability > 0) enabled.add(target.wanted_id);
// Execute stock UnitFactory asset selection with trigger-style split type/level
// fields, so a correct-looking RPC cannot hide a first-form model regression.
let loadedModel;
c.DA = {UnitFactory: function() {}, getRealTypeID: (t, l) => t * 100 + l};
c.cc = {BuilderReader: {load(res) {loadedModel = res;}}};
c.GS_STAGE_BATTLE = 2; c.GS_STAGE_INVASION = 3;
c.G_PERFORMANCE_LEVEL = 0; c.PERFORMANCE_LEVEL_HIGH = 1;
const factoryText = original('UnitFactory');
const factoryStart = factoryText.indexOf('DA.UnitFactory.prototype.initUnit=');
const factoryEnd = factoryText.indexOf('DA.UnitFactory.prototype.solveComponent=', factoryStart);
vm.runInContext(factoryText.slice(factoryStart, factoryEnd), c);
const factory = new c.DA.UnitFactory();
factory.UnitsConfig = c.data.unit_main;
factory.solveComponent = function() {};
for (const id of enabled) {
    const cfg = c.data.wanted[id];
    const spawn = n.buildWantedTargetTrigger(id);
    assert.equal(Math.floor(spawn.trigger_unit / 100), Math.floor((cfg.speaker_id || Number(id)) / 100));
    const family = Math.floor(spawn.trigger_unit / 100);
    assert.equal(spawn.trigger_unit, family * 100 + [0, 5, 30, 55][cfg.card_order]);
    assert.equal(c.data.unit_main[spawn.trigger_unit].battle_res,
        'unit/ccb/' + (family * 100 + cfg.card_order) + '.ccbi');
    for (const quality of [0, 1]) {
        c.G_PERFORMANCE_LEVEL = quality;
        factory.initUnit({}, {unit_type: family, unit_level: spawn.trigger_unit % 100,
            lv: spawn.trigger_unit_lv, skills: spawn.trigger_unit_skill, faction: 2}, 2, false);
        assert.equal(loadedModel, 'unit/ccb/' + (family * 100 + cfg.card_order) + '.ccbi');
    }
    assert.equal(spawn.trigger_target_camp, 2);
    assert.equal(spawn.trigger_pos_type, 2);
    assert.ok(spawn.trigger_unit_skill.length > 0);
    assert.equal(spawn.trigger_unit_lv, [0, 20, 40, 60][cfg.card_order]);
    const basics = c.data.unit_battle[spawn.trigger_unit].skill_nums[0];
    const extra = spawn.trigger_unit_skill.filter(id => !basics.includes(id));
    assert.equal(extra.length, cfg.card_order, 'extra skill count ' + id);
    assert.equal(new Set(extra).size, extra.length);
    for (const skillId of extra) {
        assert.equal(skillId % 100, 10);
        const sid = Math.floor(skillId / 100), family = Math.floor(spawn.trigger_unit / 100);
        assert.ok(c.data.hero_to_skill[family].skill_id.includes(sid));
        assert.equal(c.data.skill_to_hero[sid].to_hero_id, family);
        assert.ok(c.data.skill_data[skillId]);
    }
    for (const basic of basics) assert.ok(spawn.trigger_unit_skill.includes(basic));
    for (const forbidden of ['pause_game', 'ignore_user_oper', 'close_player_move_screen',
        'invoke_event', 'card_status', 'close_user_oper_skill']) assert.equal(spawn[forbidden], undefined);
    const l = {player: {level: 40, spirit: 0, diamond: 0, package: {}}, units: [{typeid: 20501}]};
    const reward = n.collectQuestPutinRewards(l, cfg.putin_win, 40);
    assert.ok(reward.some(r => r[0] === 19), 'fragment event ' + id);
    assert.equal(l.player.spirit, [0, 10, 28, 48][cfg.card_order]);
}
factory.initUnit({}, {unit_type: 104, unit_level: 3}, 2, false);
assert.equal(loadedModel, 'unit/ccb/10401.ccbi', 'old reborn_times=2 still loads form 1');
// Deterministic random endpoints choose different valid sets, without duplicates.
vm.runInContext('wantedOriginalRandom = Math.random; Math.random = function() {return 0;}', c);
const firstSkillSet = n.buildWantedTargetTrigger(10403).trigger_unit_skill;
vm.runInContext('Math.random = function() {return 0.999999;}', c);
const lastSkillSet = n.buildWantedTargetTrigger(10403).trigger_unit_skill;
assert.notEqual(JSON.stringify(firstSkillSet), JSON.stringify(lastSkillSet));
vm.runInContext('Math.random = wantedOriginalRandom;', c);
console.log('Wanted: original tables, DER payload, gates, trigger, fixed rewards, settlement, restart and duplicate checks passed');

// Execute the stock per-instance setter, including its deep copy.
c.Skill = {SimpleSkill: function() {}};
c.DA = {deepCopy: value => JSON.parse(JSON.stringify(value))};
const skillSource = fs.readFileSync(path.join(__dirname, '../.local/wanted-targets/Skill.js'), 'utf8');
const setterStart = skillSource.indexOf('Skill.SimpleSkill.prototype.setTargetAirAvailable=');
const setterEnd = skillSource.indexOf('\n    };', setterStart) + 7;
assert.ok(setterStart >= 0 && setterEnd > setterStart);
vm.runInContext(skillSource.slice(setterStart, setterEnd), c);
let checked = 0;
for (const id of enabled) {
    const target = n.buildWantedTargetTrigger(id);
    const basicId = target.trigger_unit_skill[0];
    const stock = c.data.skill_data[basicId];
    const before = JSON.stringify(stock);
    const skill = new c.Skill.SimpleSkill();
    skill.config = stock;
    const bc = {skillManager: {getDefaultSkill: () => skill}};
    const unit = {getComponent: name => name === 'BattleController' ? bc : null};
    assert.equal(n.allowWantedTargetGroundAndAir(unit), true);
    assert.equal(skill.config.target_air, 1);
    assert.equal(skill.config.target_ground, 1);
    assert.notEqual(skill.config, stock);
    assert.equal(JSON.stringify(stock), before, 'shared table and other units stay unchanged');
    const expected = JSON.parse(before);
    expected.target_air = 1; expected.target_ground = 1;
    assert.equal(JSON.stringify(skill.config), JSON.stringify(expected), 'only the two target flags change');
    checked++;
}
assert.ok(checked >= 27);
assert.equal(n.allowWantedTargetGroundAndAir(null), false);
console.log(`Wanted ground/air: ${checked} target configs; stock setter, isolated config and unchanged attack properties passed`);
