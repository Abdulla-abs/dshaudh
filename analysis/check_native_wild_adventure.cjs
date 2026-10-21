const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');

let disk;
const notices = [];
const ctx = {
    LocalNative: {},
    data: {
        period_control: {
            1000: {add_resource_num: 99, interval: 360, num_limit: 3, period_type: 1,
                add_resource_type: 3, interval_refresh_type: 3},
            1001: {num_limit: 300, period_type: 1},
            62: {num_limit: 29, period_type: 5, build_show: 1}
        },
        dice_event2_client: {},
        item: {
            210021: {item_type: 0, item_overlap: 99999},
            210022: {item_type: 0, item_overlap: 99999}
        }
    },
    GS_CURRENT_STAGE: 1,
    GS_STAGE_BUILD: 1,
    PVE_BATTLE_MODE_DICE_EVENT1: 2,
    G_UnitManager: {getUnitBySID() { return null; }},
    G_MainController: {setNotice(msg) { notices.push(String(msg)); }}
};
for (let id = 8000; id <= 8014; id++) {
    ctx.data.dice_event2_client[id] = {
        text: ['t'], die_behavior: [], die_text: [],
        resource_type: ((id - 8000) % 3) + 1,
        behavior: ['1']
    };
}
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

loadRange('consumePveSweepPeriod', 'syncPveSweepPeriod');
loadRange('syncPveSweepPeriod', 'rollPveSweepItems');
loadRange('grantPveLoot', 'handleCompletePveBattle');
loadRange('shopAddItem', 'shopHeroPools');
Object.assign(n, {
    readRaw: () => JSON.parse(disk),
    writeRaw: (s) => { disk = JSON.stringify(s); },
    writeStatus() {},
    shopState(level) {
        if (!level.localShop) level.localShop = {sequence: 0};
        return level.localShop;
    },
    shopTransaction(player) {
        const store = JSON.parse(disk);
        const rm = player.getComponent('ResourceManager');
        store.level.player.diamond = Number(rm.Res[3]);
        store.level.player.spirit = Number(rm.Res[4]) || 0;
        const der = player.getComponent('DailyEventRecorder');
        if (der && der.event_counters)
            store.level.player.event_counters = JSON.parse(JSON.stringify(der.event_counters));
        return store;
    },
    shopSync(player, level) {
        const der = player.getComponent('DailyEventRecorder');
        if (der && level.player.event_counters)
            der.event_counters = JSON.parse(JSON.stringify(level.player.event_counters));
        const rm = player.getComponent('ResourceManager');
        rm.Res[3] = level.player.diamond;
        rm.Res[4] = level.player.spirit || 0;
        const pm = player.getComponent('PackageManager');
        if (pm && level.player.package) pm.init({package: JSON.parse(JSON.stringify(level.player.package))});
    },
    syncSavedHomeWallet() {},
    copyAccountProgress() {},
    snapshotBuildingRecord(u) { return u; },
    getResourceManager() { return {Res: {1: 0, 2: 0, 3: 0, 4: 0}, maxRes: {1: 0, 2: 0}}; },
    lookupUnitMain() { return {gold_storage: 999999, wood_storage: 999999}; },
    buildPveBattleDict(stageId) {
        return {
            self: {player: {}, heros: []},
            oppo: {player: {stage: stageId || 1, pve_mode: 0}},
            units: [],
            pve_mode: 0,
            localNativePve: true
        };
    }
});

const advStart = source.indexOf('        LocalNative.adventurePolicy = {');
const advEnd = source.indexOf('        LocalNative.handleTutorialEggDraw = function', advStart);
assert.ok(advStart >= 0 && advEnd > advStart);
vm.runInContext(source.slice(advStart, advEnd), ctx);

function fruitCount(typeid) {
    const pkg = JSON.parse(disk).level.player.package || {};
    let nFruit = 0;
    for (const bag of Object.values(pkg)) {
        for (const item of Object.values((bag && bag.item_dict) || {})) {
            if (Number(item.typeid) === typeid) nFruit += Number(item.num) || 0;
        }
    }
    return nFruit;
}

function setup(extra) {
    notices.length = 0;
    disk = JSON.stringify({
        level: {
            player: Object.assign({
                diamond: 1000, spirit: 50, adventure_status: 0,
                dice_event2_id: 0, dice_event2_cost: 0, event_counters: {}
            }, extra || {}),
            units: [{sid: 1, typeid: 20301, sto: {1: 1000, 2: 1000}}],
            heros: [{sid: 'h1', state: 1, lv: 1, xp: 0}],
            localShop: {sequence: 0}
        }
    });
    const am = {adventure_status: 0, dice_event2_id: 0, dice_event2_cost: 0};
    const der = {event_counters: {}};
    const rm = {Res: {1: 1000, 2: 1000, 3: 1000, 4: 50}};
    const calls = {enter: [], next: [], finish: [], dead: [], battle: []};
    return {
        am, der, rm, calls,
        getComponent(name) {
            if (name === 'AdventureManager') return am;
            if (name === 'DailyEventRecorder') return der;
            if (name === 'ResourceManager') return rm;
            if (name === 'PackageManager') return {init() {}};
            return null;
        },
        rpc_c_enter_dice_event_ans(d) { calls.enter.push(d); },
        rpc_c_dice_event2_next(d) { calls.next.push(d); },
        rpc_c_dice_event2_finish(d) {
            assert.equal(am.adventure_status, 2, 'finish requires live CAPTURE');
            am.adventure_status = 0;
            am.dice_event2_id = d.dice_event2_id;
            calls.finish.push(d);
        },
        rpc_c_dice_event2_dead(d) {
            assert.equal(am.adventure_status, 2, 'dead requires live CAPTURE');
            am.adventure_status = 0;
            calls.dead.push(d);
        },
        rpc_c_enter_battle(d) { calls.battle.push(d); },
        rpc_c_refresh_daily_event() {}
    };
}

let p = setup();
assert.equal(n.handleEnterDiceEvent(p), true);
assert.equal(p.calls.enter[0].adventure_status, 1, 'enter answers PVE');
assert.equal(JSON.parse(disk).level.player.event_counters[1][1000].c, 1);

assert.equal(n.handleLoadDiceEvent1Pve(p), true);
assert.equal(p.calls.battle[0].pve_mode, 2);

const winStore = JSON.parse(disk);
n.markAdventureCaptureAfterPveWin(p, winStore.level);
n.writeRaw(winStore);
assert.equal(JSON.parse(disk).level.player.adventure_status, 2);

p = setup({adventure_status: 2, dice_event2_id: 8000, dice_event2_cost: 50});
p.am.adventure_status = 2; p.am.dice_event2_id = 8000; p.am.dice_event2_cost = 50;
assert.equal(n.handleDiceEvent2Torture(p), true);
assert.equal(p.calls.next[0].dice_event2_id, 8001);

// Release grants base resources.
p = setup({adventure_status: 2, dice_event2_id: 8001, dice_event2_cost: 50});
p.am.adventure_status = 2; p.am.dice_event2_id = 8001;
const diamondBefore = JSON.parse(disk).level.player.diamond;
const goldBefore = JSON.parse(disk).level.units[0].sto[2];
assert.equal(n.handleDiceEvent2Release(p), true);
assert.equal(p.calls.finish.length, 1);
assert.ok(JSON.parse(disk).level.player.diamond > diamondBefore, 'diamond loot');
assert.ok(JSON.parse(disk).level.units[0].sto[2] > goldBefore, 'gold loot');

// Pity at unfortunate count >= 29 forces primary fruit and resets counter.
p = setup({
    adventure_status: 2, dice_event2_id: 8001, dice_event2_cost: 50,
    event_counters: {5: {62: {c: 29, t: 1, clientData: {_eventCount: 29}}}}
});
p.am.adventure_status = 2; p.am.dice_event2_id = 8001;
p.der.event_counters = JSON.parse(JSON.stringify(JSON.parse(disk).level.player.event_counters));
const origRandom = Math.random;
Math.random = () => 0.99;
assert.equal(n.handleDiceEvent2Release(p), true);
Math.random = origRandom;
assert.equal(fruitCount(210021), 1, 'pity grants primary fruit');
assert.equal(JSON.parse(disk).level.player.event_counters[5][62].c, 0, 'pity resets');

// Paid reset marks next fruit bonus flag.
p = setup({event_counters: {1: {1000: {c: 3, t: 1, clientData: {_eventCount: 3}}}}});
p.der.event_counters = JSON.parse(JSON.stringify(JSON.parse(disk).level.player.event_counters));
assert.equal(n.handleResetDiceEvent1(p), true);
assert.equal(JSON.parse(disk).level.player.event_counters[1][1000].c, 0);
assert.equal(JSON.parse(disk).level.player.localAdventureNextPaidBonus, true);

console.log('PASS: adventure flow + local loot (resources, 30-pity fruit, paid bonus flag)');
