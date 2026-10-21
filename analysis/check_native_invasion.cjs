const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');

let disk;
const statusLog = [];
const ctx = {
    LocalNative: {},
    data: {
        invasion: {
            1: {
                invasion_duration: 60,
                input_id: 85108,
                AI_hero_id: [400101, 400201, 400301, 400401],
                AI_hero_lv: [1, 2],
                input_id_first: 85054,
                AI_hero_num: 4
            },
            3: {
                invasion_duration: 60,
                need_rest: 1,
                input_id: 85110,
                AI_hero_id: [402101],
                AI_hero_lv: [4, 5],
                input_id_first: 85056,
                AI_hero_num: 1
            }
        },
        invasion_hardness: {
            1: {invasion_hardness_start: 1, invasion_hardness_end: 18}
        },
        input_event_client: {
            85054: {
                putin_event_exp: [], putin_event_resource: [], putin_event_hero: [],
                putin_event_slot: [], putin_event_next: 85000, putin_event_skill: [],
                putin_event_item: [8000]
            },
            85000: {
                putin_event_exp: [], putin_event_resource: [18025], putin_event_hero: [],
                putin_event_slot: [], putin_event_next: 0, putin_event_skill: [],
                putin_event_item: []
            },
            85108: {
                putin_event_exp: [], putin_event_resource: [], putin_event_hero: [],
                putin_event_slot: [], putin_event_next: 85000, putin_event_skill: [],
                putin_event_item: [8018]
            }
        },
        item_input: {
            8000: {item_id: 1125, item_num: 40},
            8018: {item_id: 1125, item_num: 20}
        },
        item: {1125: {item_type: 0, item_overlap: 999}},
        resource_input: {
            18025: {putin_type: 8, putin_factor: 0.2, putin_limit: 0, putin_num: 3000,
                putin_resource_type: 1}
        }
    },
    GS_CURRENT_STAGE: 1,
    GS_STAGE_BUILD: 1,
    GS_STAGE_INVASION: 5,
    BATTLE_FACTION_DEFENDER: 2,
    BATTLE_FACTION_ATTACKER: 1,
    BUILD_STATE_FINISH: 3
};

vm.createContext(ctx);
const n = ctx.LocalNative;

function loadRange(startName, endName) {
    const a = source.indexOf(`        LocalNative.${startName} = function`);
    const b = endName
        ? source.indexOf(`        LocalNative.${endName} = function`, a + 1)
        : source.length;
    assert.ok(a >= 0 && b > a, startName + ' range');
    vm.runInContext(source.slice(a, b), ctx);
}

function seedStore() {
    disk = JSON.stringify({
        version: 1,
        level: {
            player: {
                nickname: 'LocalRookie', diamond: 150, spirit: 50,
                package: {material: {item_dict: {}, capacity: 100, new_items: 0, buy_slot_time: 0}},
                invasion_unlocks: 0
            },
            units: [
                {sid: 1, typeid: 20101, x: 20, y: 20, state: 3, bs: 3, bt: 0},
                {sid: 2, typeid: 30101, x: 24, y: 24, state: 3, bs: 3, bt: 0}
            ],
            walls: [],
            heros: [
                {sid: 'hero_slot_1', typeid: 10401, state: 1, aidx: 0, defense_id: 0},
                {sid: 'pve_first_2_hero', typeid: 10501, state: 2, aidx: -1,
                    did: 2, defense_id: 2, skill_slots: [{sid: 151, lv: 1}]}
            ],
            model_info: {},
            user_config: {}
        }
    });
}

Object.assign(n, {
    readRaw: () => JSON.parse(disk),
    writeRaw: (s) => { disk = JSON.stringify(s); },
    writeStatus(s) { statusLog.push(s); },
    tryDumpAndSave() {},
    defaultLevelDict() {
        return {
            player: {nickname: 'LocalRookie', diamond: 150, package: {material: {
                item_dict: {}, capacity: 100, new_items: 0, buy_slot_time: 0}}},
            units: [], walls: [], heros: [], model_info: {}, user_config: {}
        };
    },
    defaultPlayer() {
        return {nickname: 'LocalRookie', diamond: 150, package: {material: {
            item_dict: {}, capacity: 100, new_items: 0, buy_slot_time: 0}}};
    },
    makeBattleSide(player, extras) {
        const side = Object.assign({}, player, extras || {});
        side.player = player;
        return side;
    },
    normalizeReplayUnits(units) {
        return (units || []).map((u) => Object.assign({}, u, {
            unit_type: Math.floor(u.typeid / 100),
            unit_level: u.typeid % 100,
            faction: 2,
            bs: 3, state: 3, bt: 0,
            cid: u.cid != null ? u.cid : u.sid
        }));
    },
    remapBattleUnitIds(units, base) {
        return (units || []).map((u, i) => {
            const sid = (base || 93000) + i + 1;
            return Object.assign({}, u, {sid: sid, cid: sid, id: sid});
        });
    },
    grantPveLoot(gold, wood, level) {
        level.__loot = level.__loot || {gold: 0, wood: 0};
        level.__loot.gold += gold;
        level.__loot.wood += wood;
        return level.__loot;
    },
    applyPveItemReward(level, eventId) {
        const item = ctx.data.item_input[eventId];
        if (!item) return [];
        const pkg = level.player.package.material.item_dict;
        const oid = 'local_pve_' + item.item_id;
        const old = pkg[oid];
        pkg[oid] = {
            oid: oid, typeid: item.item_id,
            num: (old ? old.num : 0) + item.item_num, is_new: true
        };
        return [[19, [{oid: oid, typeid: item.item_id, num: item.item_num}]]];
    }
});

loadRange('getInvasionController', 'unitsArrayToIdMap');
loadRange('unitsArrayToIdMap', 'buildInvasionEnterDict');
loadRange('buildInvasionEnterDict', 'readInvasionAbsoluteWave');
loadRange('readInvasionAbsoluteWave', 'pickInvasionWaveHeroes');
loadRange('pickInvasionWaveHeroes', 'buildInvasionWaveStartDict');
loadRange('buildInvasionWaveStartDict', 'applyInvasionEventRewards');
loadRange('applyInvasionEventRewards', 'finishInvasionUnlockGuide');
loadRange('finishInvasionUnlockGuide', 'handleEnterInvasion');
loadRange('handleEnterInvasion', 'handleInvasionWaveReady');
loadRange('handleInvasionWaveReady', 'handleInvasionWaveStart');
loadRange('handleInvasionWaveStart', 'handleInvasionWaveEnd');
loadRange('handleInvasionWaveEnd', 'handleInvasionToHome');
loadRange('handleInvasionToHome', 'handleEnterEnemyAttackReplay');

n.getAnyGameController = () => null;

seedStore();

// Wave hero pick uses AI pool IDs as typeids.
const heroes = n.pickInvasionWaveHeroes(ctx.data.invasion[1]);
assert.equal(heroes.length, 4);
heroes.forEach((h) => {
    assert.ok(ctx.data.invasion[1].AI_hero_id.indexOf(h.typeid) >= 0);
    assert.ok(h.level >= 1 && h.level <= 2);
});

const startDict = n.buildInvasionWaveStartDict(1);
assert.equal(startDict.time, 60);
assert.equal(startDict.heroes.length, 4);
assert.ok(startDict.corner_type >= 0 && startDict.corner_type <= 3);

const enterDict = n.buildInvasionEnterDict();
assert.ok(enterDict.self && enterDict.self.units);
assert.ok(enterDict.oppo && enterDict.oppo.player);
// Stock Invasion ILD only creates self.units; garrison must be injected there with remapped did.
assert.equal(Object.keys(enterDict.self.units).length, 3);
const bunker = Object.values(enterDict.self.units).find((u) => u.typeid === 30101);
const guard = Object.values(enterDict.self.units).find((u) => u.typeid === 10501);
assert.ok(bunker && guard, 'bunker and garrison hero present in self.units');
assert.equal(String(guard.did), String(bunker.sid));
assert.equal(String(guard.defense_id), String(bunker.sid));
assert.equal(guard.state, 2);
assert.equal(guard.x, undefined, 'no TileHolder coordinates on mobile hero');
assert.equal(enterDict.self.heros.length, 1);
assert.equal(enterDict.self.heros[0].typeid, 10501);
assert.ok(!Object.values(enterDict.self.units).some((u) => u.typeid === 10401),
    'attack-team Dino stays out of invasion village');

// Enter + Start (wave ready) replies.
const calls = [];
const player = {
    rpc_c_enter_invasion(dict) { calls.push(['enter', dict]); },
    rpc_c_start_wave(dict) { calls.push(['start_wave', dict]); },
    rpc_c_wave_end(dict) { calls.push(['wave_end', dict]); },
    rpc_c_invasion_end(dict) { calls.push(['invasion_end', dict]); },
    rpc_c_invasion_to_home(dict) { calls.push(['to_home', !!dict]); },
    getComponent() { return null; }
};

assert.equal(n.handleEnterInvasion(player, {}), true);
assert.equal(calls[0][0], 'enter');
assert.ok(calls[0][1].localNativeInvasion);
// Unlock guide pid 2065 must persist (rookie2 bit 3) so settle→home does not replay NewUnlocked.
const afterEnter = JSON.parse(disk);
const rookie2 = Number(afterEnter.level.user_config.rookie2) || 0;
assert.equal((rookie2 >> 3) & 1, 1, 'invasion unlock rookie 2065 bit');
assert.ok(statusLog.some((s) => s.step === 'invasion-unlock-rookie-done'));

assert.equal(n.handleInvasionWaveReady(player, {}), true);
assert.equal(calls[1][0], 'start_wave');
assert.equal(calls[1][1].heroes.length, 4);

// Mock live GC so wave-end can read passedWaves.
const ism = {passedWaves: 1, status: 'wave_end'};
n.getInvasionController = () => ({ism: ism});
assert.equal(n.handleInvasionWaveEnd(player, {succeed: true}), true);
assert.equal(calls[2][0], 'wave_end');
assert.ok(calls[2][1].input_gains.length >= 1);
const after = JSON.parse(disk);
assert.equal(after.level.localInvasionFirstWaves['1'], true);
assert.ok(after.level.player.package.material.item_dict.local_pve_1125.num >= 40);
assert.ok(after.level.__loot && after.level.__loot.wood >= 3000);

assert.equal(n.handleInvasionWaveEnd(player, {succeed: false}), true);
assert.equal(calls[3][0], 'invasion_end');

assert.equal(n.handleInvasionToHome(player, {}), true);
assert.equal(calls[4][0], 'to_home');

// Dispatch wiring present in boot source.
assert.ok(source.indexOf("methodName === 'rpc_s_enter_invasion'") >= 0);
assert.ok(source.indexOf("methodName === 'rpc_s_invasion_wave_ready'") >= 0);
assert.ok(source.indexOf("methodName === 'rpc_s_invasion_wave_end'") >= 0);
assert.ok(source.indexOf('LocalNative.handleInvasionWaveReady') >= 0);

console.log('check_native_invasion: PASS');
