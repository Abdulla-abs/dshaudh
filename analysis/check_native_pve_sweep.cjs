// Offline checks for campaign PVE sweep (rpc_s_pve_sweep → rpc_c_pvesweep_result).
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
            availableStages: {7: [1288, 1288, 3, 0]},
            finishedVirtualStages: {},
            buffs: [],
            package: {
                material: {item_dict: {}, capacity: 100, new_items: 0},
                based_prop: {item_dict: {}, capacity: 100, new_items: 0},
                advanced_prop: {item_dict: {}, capacity: 100, new_items: 0},
                formula: {item_dict: {}, capacity: 100, new_items: 0}
            },
            event_counters: {},
            pve_sweep_tili: 10,
            pve_sweep_ltt: 1000,
            diamond: 150,
            spirit: 50
        },
        units: [{sid: 1, typeid: 20602}],
        heros: [{
            sid: 'hero_slot_1', typeid: 10401, state: 1, aidx: 0,
            lv: 1, level: 1, xp: 0, skill_slots: [{sid: 100, lv: 1}]
        }],
        localShop: {version: 1, sequence: 0, rareMisses: 0, itemCounters: {}, pending: null}
    }
};

const n = {
    STARTER_HERO_TYPEID: 10401,
    writeStatus() {},
    readRaw() { return store; },
    writeRaw(obj) { Object.assign(store, obj); },
    ensurePlayerSocialFields(player) { return player; },
    ensureAvailableStages() { return false; },
    shopState(level) {
        if (!level.localShop) level.localShop = {version: 1, sequence: 0,
            rareMisses: 0, itemCounters: {}, pending: null};
        return level.localShop;
    }
};

const context = {
    LocalNative: n,
    data: {
        pve_stage: {
            7: {pve_roll_reward: 8020, sweep_hero_exp: 11, period_num_limit: 7},
            9: {pve_roll_reward: 8026, sweep_hero_exp: 13, period_num_limit: 9, green_pro: 0.35},
            15: {pve_roll_reward: 8044, sweep_hero_exp: 19, period_num_limit: 15, green_pro: 0.35}
        },
        pve_sweep: {1: {diamond_cost: 20, max_tili: 10, refresh_time: 1800}},
        period_control: {
            7: {num_limit: 5, period_type: 1, add_resource_num: 9},
            9: {num_limit: 5, period_type: 1, add_resource_num: 9},
            15: {num_limit: 3, period_type: 1, add_resource_num: 9}
        },
        input_event_client: {
            8020: {putin_event_item: [], putin_event_next: 8021},
            8021: {putin_event_item: [4000, 4444], putin_event_next: 0},
            8026: {putin_event_item: [], putin_event_next: 8027},
            8027: {putin_event_item: [4019, 4444], putin_event_next: 0},
            8044: {putin_event_item: [7901], putin_event_next: 8045},
            8045: {putin_event_item: [4007, 4444], putin_event_next: 0}
        },
        item_input: {
            4000: {item_id: 200122, item_num: 1, item_random_chance: []},
            4019: {item_id: 200145, item_num: 1, item_random_chance: []},
            4007: {item_id: 200129, item_num: 1, item_random_chance: []},
            4444: {item_id: 210000, item_num: 1, item_random_chance: []},
            7901: {item_id: 1105, item_num: 1, item_random_chance: []}
        },
        item: {
            200122: {item_type: 2, item_overlap: 99},
            200145: {item_type: 2, item_overlap: 99},
            200129: {item_type: 2, item_overlap: 99},
            210000: {item_type: 2, item_overlap: 99},
            1105: {item_type: 1, item_overlap: 99}
        },
        hero_number: {2: {hero_lv_max: 20}},
        hero_lv_data: {1: {hero_exp: 15}, 2: {hero_exp: 20}, 3: {hero_exp: 25}}
    },
    RES_TYPE_TILI: 5,
    Math,
    JSON,
    Date,
    isFinite,
    Object,
    Number,
    parseInt,
    Error
};

loadRange(
    '        LocalNative.normalizeHeroExperience = function',
    '        LocalNative.ensureHeroSkill = function',
    context
);
loadRange(
    '        LocalNative.shopAddItem = function',
    '        LocalNative.shopHeroPools = function',
    context
);
loadRange(
    '        // User-authorized offline PVE sweep drops.',
    '        LocalNative.handleEnterEnemyAttackReplay = function',
    context
);

assert.equal(n.classifyPveSweepItem(200122), 'ordinary');
assert.equal(n.classifyPveSweepItem(210000), 'ordinary');
assert.equal(n.classifyPveSweepItem(1105), 'rare');
assert.equal(n.classifyPveSweepItem(1125), 'skip');

const pools7 = n.collectPveSweepLootPools(7);
assert.equal(pools7.ordinary.length, 2);
assert.equal(pools7.rare.length, 0);
const pools15 = n.collectPveSweepLootPools(15);
assert.ok(pools15.ordinary.length >= 2);
assert.equal(pools15.rare.length, 1);
assert.equal(pools15.rare[0].typeid, 1105);

// Force ordinary hit, no rare.
const realRandom = Math.random;
Math.random = () => 0; // always hit first branch thresholds
let resultCalls = 0;
let failCalls = 0;
let awardCalls = 0;
const pkgBefore = JSON.stringify(store.level.player.package);
const player = {
    getComponent(name) {
        if (name === 'PackageManager') {
            return {
                package: store.level.player.package,
                init(dict) { this.package = dict.package; store.level.player.package = dict.package; }
            };
        }
        if (name === 'PVESweepManager') {
            return {Res: {5: 9}, ltt: 1000};
        }
        if (name === 'DailyEventRecorder') {
            return {event_counters: store.level.player.event_counters, last_update_time: 1000};
        }
        if (name === 'ResourceManager') {
            return {
                Res: {3: 150, 4: 50},
                addRes() { throw new Error('addRes should be stubbed during sweep result'); }
            };
        }
        return null;
    },
    rpc_c_pvesweep_result(dict) {
        resultCalls++;
        lastResult = dict;
        assert.ok(Array.isArray(dict.input_gains));
    },
    rpc_c_pvesweep_fail() { failCalls++; },
    rpc_c_refresh_daily_event() {}
};
let lastResult = null;
context.G_EventManager = {inputAward() { awardCalls++; }};

assert.equal(n.handlePveSweep(player, {level: 7}), true);
assert.equal(resultCalls, 1);
assert.equal(failCalls, 0);
assert.equal(awardCalls, 0);
assert.equal(lastResult.stage, 7);
const exp = lastResult.input_gains.find((g) => g[0] === 5);
assert.ok(exp);
assert.equal(exp[1][0][0], 'hero_slot_1');
assert.equal(exp[1][0][1], 11);
const items = lastResult.input_gains.filter((g) => g[0] === 19);
assert.equal(items.length, 2);
assert.deepEqual(Array.from(items, g => g[1][0].typeid), [200122, 210000],
    'independent knowledge book can drop alongside the unchanged skill book');
assert.notEqual(JSON.stringify(store.level.player.package), pkgBefore);
assert.equal(store.level.player.event_counters[1][7].c, 1);
assert.ok(store.level.heros[0].xp > 0 || store.level.heros[0].lv >= 1);

// Uncleared stage fails.
store.level.player.availableStages[8] = [100, 100, 0, 0];
assert.equal(n.handlePveSweep(player, {level: 8}), false);
assert.equal(failCalls, 1);

// Period reset-when-exhausted then consume.
store.level.player.availableStages[9] = [100, 100, 2, 0];
store.level.player.event_counters[1][9] = {c: 5, t: 1, clientData: {_eventCount: 5}};
Math.random = () => 0.99; // miss ordinary and rare
resultCalls = 0;
assert.equal(n.handlePveSweep(player, {level: 9}), true);
assert.equal(store.level.player.event_counters[1][9].c, 1);

Math.random = realRandom;
delete global.G_EventManager;
console.log('check_native_pve_sweep: ok');
