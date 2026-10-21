// Offline checks for campaign PVE enter (rpc_s_enter_pve_battle → rpc_c_enter_battle).
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');

function loadSlice(startName, endName, context) {
    const a = source.indexOf(`        LocalNative.${startName} = function`);
    const b = endName
        ? source.indexOf(`        LocalNative.${endName} = function`, a + 1)
        : source.length;
    assert.ok(a >= 0 && b > a, `slice ${startName}..${endName}`);
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
        heros: [{
            sid: 'hero_slot_1', typeid: 10401, unit_type: 104, unit_level: 1,
            attack_index: 1, state: 1, life: 400, skill_slots: [{sid:10000,lv:1}]
        }],
        units: [{sid:'6',typeid:20701,sds:{114:10},tbuf:[114,114]}],
        user_config: {},
        hero_donate_list: []
    }
};

const n = {
    tryDumpAndSave() {},
    getResourceManager: () => ({Res:{1:4001,2:5000},maxRes:{1:20000,2:20000}}),
    writeStatus() {},
    readRaw() { return store; },
    defaultLevelDict() { return store.level; },
    defaultPlayer() { return store.level.player; },
    defaultHeros() { return store.level.heros; },
    ensureAvailableStages() { return false; },
    readPveStageLoot() { return [288, 788, 0, 0]; },
    unit(sid, typeid, x, y, extra) {
        const u = {
            sid, typeid,
            unit_type: Math.floor(typeid / 100),
            unit_level: typeid % 100,
            x, y, state: 1, faction: 2, unit_mutateid: 0
        };
        if (extra) Object.assign(u, extra);
        return u;
    },
    normalizeReplayUnits(units) {
        return (units || []).map((src) => {
            const u = Object.assign({}, src);
            u.faction = 2;
            if (u.cid == null && u.sid != null) u.cid = u.sid;
            return u;
        });
    },
    remapBattleUnitIds(units, baseSid) {
        baseSid = baseSid || 91000;
        return (units || []).map((src, i) => {
            const u = Object.assign({}, src);
            u.sid = baseSid + i + 1;
            u.cid = u.sid;
            u.id = u.sid;
            return u;
        });
    },
    makeBattleSide(player, extras) {
        const side = Object.assign({}, player, extras || {});
        side.player = player;
        if (side.soldiers == null) side.soldiers = [];
        if (side.heros == null) side.heros = [];
        if (side.league_tech == null) side.league_tech = [];
        return side;
    }
};

const context = {LocalNative: n, data:{}, HERO_STATE_ATTACK: 1, BUILD_STATE_FINISH: 1, BATTLE_FACTION_DEFENDER: 2};
for (const name of ['unit_battle','skill_data'])
    vm.runInNewContext(fs.readFileSync(`${__dirname}/../.local/shop-treasure/${name}.js`,'utf8'),context);
loadSlice('inferredPveVillageUnits', 'handleEnterEnemyAttackReplay', context);

const units = n.inferredPveVillageUnits(1, 288, 788);
assert.equal(units.length, 4);
assert.equal(units[0].typeid, 20101);
assert.equal(units[0].sid, 91001);
assert.equal(units[3].typeid, 30101);
assert.equal(units[3].sid, 91004);

const heros = n.collectAttackHerosForPve(store.level, store.level.player);
assert.equal(heros.length, 1);
assert.equal(heros[0].typeid, 10401);
assert.equal(heros[0].state, 1);
assert.deepEqual(Array.from(heros[0].skills),[10401,1000001]);
assert.equal(store.level.heros[0].skills,undefined,'battle projection does not mutate saved hero');
const mother={typeid:11306,unit_mutateid:0,skill_slots:[{sid:7093,lv:1}]};
n.prepareHeroBattleSkills(mother);
assert.deepEqual(Array.from(mother.skills),[11301,709301]);
n.prepareHeroBattleSkills(mother);
assert.deepEqual(Array.from(mother.skills),[11301,709301],'projection does not accumulate duplicates');

const dict = n.buildPveBattleDict(1);
assert.equal(dict.localNativePve, true);
assert.equal(dict.isEnterEnemyAttackReplay, false);
assert.equal(dict.replay, null);
assert.equal(dict.oppo.player.stage, 1);
assert.equal(dict.self.gold, 5000, 'battle self wallet must not be replaced with enemy loot');
assert.equal(dict.self.wood, 4001);
assert.equal(dict.units.length, 4);
assert.equal(dict.self.heros.length, 1);
assert.equal(dict.self.soldiers[114], 10, 'trained soldiers reach stock deploy choices; queued ones excluded');
assert.equal(dict.source, 'local-inferred-compatible-pve');
loadSlice('buildStageSevenVillage', 'inferredPveVillageUnits', context);
const seventh=n.buildPveBattleDict(7);
assert.equal(seventh.units.length,10,'nine reference structures plus the defender');
assert.equal(seventh.oppo.player.walls,seventh.walls,'stock wall reader gets the reference walls');
assert.equal(seventh.oppo.units,seventh.units);
assert.ok(seventh.walls.length>70);
assert.equal(seventh.units.find(u=>u.typeid===10501).did,'91009');
assert.equal(seventh.source,'user-reference-stage7-2026-10-15');
assert.equal(n.buildPveBattleDict(6).units.length,4,'other stages retain their existing data');
// The approved editor file must take precedence over the earlier estimated village.
const registryStart=source.indexOf('        // BEGIN USER AUTHORED PVE LAYOUTS');
const registryEnd=source.indexOf('        LocalNative.buildStageSevenVillage = function',registryStart);
vm.runInNewContext(source.slice(registryStart,registryEnd),context);
const approvedFile=`${__dirname}/rpc-contracts/pve-layouts/stage-7.json`;
if(fs.existsSync(approvedFile)) {
    context.data.unit_main={50701:{volume:1}};
    const approved=JSON.parse(fs.readFileSync(approvedFile,'utf8'));
    const actual=n.buildPveBattleDict(7);
    assert.equal(actual.source,'user-authored-layout');
    assert.deepEqual(Array.from(actual.units.filter(u=>!u.localNativeGuard),u=>[u.typeid,u.x,u.y]),
        approved.buildings.map(b=>[b.typeid,b.x,b.y]),'preserve every authored building type and coordinate');
    assert.deepEqual(Array.from(actual.walls,w=>Array.from(w)),approved.walls.map(w=>[w.level,w.x,w.y,0]));
    assert.equal(actual.units.filter(u=>u.localNativeGuard).length,approved.guards.length);
    for(const guard of approved.guards) {
        const anchorIndex=approved.buildings.findIndex(b=>b.id===guard.anchorId);
        const runtimeGuard=actual.units.find(u=>u.localNativeGuard&&u.typeid===guard.typeid);
        assert.ok(runtimeGuard);
        assert.equal(runtimeGuard.lv,guard.level);
        assert.equal(runtimeGuard.state,2,'original defense state');
        assert.equal(runtimeGuard.x,undefined,'mobile hero must not take building TileHolder path');
        assert.equal(runtimeGuard.y,undefined);
        assert.equal(runtimeGuard.did,String(actual.units[anchorIndex].sid),'guard uses original building SID linkage');
        assert.equal(runtimeGuard.faction,2);
        assert.equal(runtimeGuard.skills[0],10501,'original triceratops base skill');
    }
    assert.equal(actual.oppo.player.walls,actual.walls);
    assert.equal(n.buildPveBattleDict(6).units.length,4);
}

const stage16File = `${__dirname}/rpc-contracts/pve-layouts/stage-16.json`;
if (fs.existsSync(stage16File)) {
    const authored = JSON.parse(fs.readFileSync(stage16File, 'utf8'));
    const actual = n.buildPveBattleDict(16);
    assert.equal(actual.source, 'user-authored-layout');
    assert.equal(actual.oppo.player.stage, 16);
    assert.deepEqual(Array.from(actual.units.filter(u => !u.localNativeGuard), u => [u.typeid, u.x, u.y]),
        authored.buildings.map(b => [b.typeid, b.x, b.y]));
    assert.deepEqual(Array.from(actual.walls, w => Array.from(w)),
        authored.walls.map(w => [w.level, w.x, w.y, 0]));
    const guards = actual.units.filter(u => u.localNativeGuard);
    assert.equal(guards.length, 1);
    assert.equal(guards[0].typeid, 10501);
    assert.equal(guards[0].lv, 5);
    assert.equal(guards[0].did, String(actual.units[authored.buildings.findIndex(b => b.id === 'b8')].sid));
    assert.equal(guards[0].x, undefined);
    assert.equal(guards[0].y, undefined);
    assert.deepEqual(Array.from(guards[0].skills), [10501, 14801]);
    guards[0].skills.push(99999);
    for (let retry = 0; retry < 10; retry++) {
        assert.deepEqual(Array.from(n.buildPveBattleDict(16).units.find(u => u.localNativeGuard).skills),
            [10501, 14801], 'fixed skills survive repeated entry and previous battle mutation');
    }
    assert.equal(actual.oppo.player.walls, actual.walls);
    assert.equal(n.handleEnterPveBattle({rpc_c_enter_battle(dict) {
        assert.equal(dict.oppo.player.stage, 16);
        assert.equal(dict.units.length, authored.buildings.length + 1);
        assert.equal(dict.walls.length, authored.walls.length);
    }}, {level: 16}), true);
}

const stage39File = `${__dirname}/rpc-contracts/pve-layouts/stage-39.json`;
if (fs.existsSync(stage39File)) {
    const authored = JSON.parse(fs.readFileSync(stage39File, 'utf8'));
    const actual = n.buildPveBattleDict(39);
    assert.equal(actual.source, 'user-authored-layout');
    assert.equal(actual.oppo.player.stage, 39);
    assert.deepEqual(Array.from(actual.units.filter(u => !u.localNativeGuard), u => [u.typeid, u.x, u.y]),
        authored.buildings.map(b => [b.typeid, b.x, b.y]));
    assert.deepEqual(Array.from(actual.walls, w => Array.from(w)), authored.walls.map(w => [w.level, w.x, w.y, 0]));
    const guards = actual.units.filter(u => u.localNativeGuard);
    const catalog = JSON.parse(fs.readFileSync(`${__dirname}/layout-editor/catalog.json`, 'utf8'));
    assert.equal(guards.length, authored.guards.length);
    authored.guards.forEach((guard, i) => {
        const hero = catalog.guards.find(h => h.typeid === guard.typeid);
        const variant = hero.variants.find(v => v.evolution === (guard.evolution || 0) && v.reborn === (guard.reborn || 0));
        assert.equal(guards[i].typeid, variant.typeid, 'preserve authored reborn form');
        assert.equal(guards[i].lv, guard.level);
        assert.equal(guards[i].unit_mutateid, guard.mutateId || 0);
        assert.equal(guards[i].state, 2);
        assert.equal(guards[i].did, String(actual.units[authored.buildings.findIndex(b => b.id === guard.anchorId)].sid));
        assert.equal(guards[i].x, undefined);
        assert.equal(guards[i].y, undefined);
        assert.deepEqual(Array.from(guards[i].skills), [...new Set([...variant.basics[guard.mutateId || 0], ...(guard.skills || [])])]);
    });
    guards[0].skills.push(99999);
    assert.ok(!n.buildPveBattleDict(39).units.find(u => u.localNativeGuard).skills.includes(99999));
    let calls = 0;
    assert.equal(n.handleEnterPveBattle({rpc_c_enter_battle(dict) {
        calls++;
        assert.equal(dict.oppo.player.stage, 39);
        assert.equal(dict.units.length, 15);
        assert.equal(dict.walls.length, 67);
    }}, {level: 39}), true);
    assert.equal(calls, 1);
}

let entered = 0;
const player = {
    rpc_c_enter_battle(d) {
        entered++;
        assert.equal(d.oppo.player.stage, 1);
        assert.equal(d.replay, null);
        assert.ok(d.units.length > 0);
    }
};
assert.equal(n.handleEnterPveBattle(player, {level: 1}), true);
assert.equal(entered, 1);

console.log('PASS: pve village stub, attack heros, enter dict, rpc_c_enter_battle');
