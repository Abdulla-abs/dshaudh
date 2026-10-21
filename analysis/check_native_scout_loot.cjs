// Exercise stock hit accounting and saved scout settlement with original unit capacities.
const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
let disk, gc, lastResult, failWrite = false;
const n = {}, ctx = {LocalNative: n, data: {}, RES_TYPE_GOLD: 2, RES_TYPE_WOOD: 1,
    GS_CURRENT_STAGE: 2, GS_STAGE_BATTLE: 2};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(`${__dirname}/../.local/layout-player-mode/unit_main.js`, 'utf8'), ctx);
function load(name, next) {
    const a = source.indexOf(`        LocalNative.${name} = function`);
    const b = source.indexOf(`        LocalNative.${next} = function`, a + 1);
    assert.ok(a >= 0 && b > a, name); vm.runInContext(source.slice(a, b), ctx);
}
load('fillScoutResourceLoot', 'buildPvpBattleDict');
load('handleCompletePvpBattle', 'handlePvpBattleToHome');
load('handlePvpBattleToHome', 'handleEnterPveBattle');
load('grantPveLoot', 'applyPveItemReward');
Object.assign(n, {lookupUnitMain: id => ctx.data.unit_main[id], writeStatus() {},
    readRaw: () => JSON.parse(disk), writeRaw(s) { if (failWrite) throw Error('disk unavailable'); disk = JSON.stringify(s); },
    getBattleController: () => gc,
    buildPveBattleResultDict: () => ({stage: 1, win_gold: 999999, win_wood: 999999, starNum: 0, isWinner: false}),
    ensurePlayerSocialFields(p) { p.achieve_raw ||= {}; }, syncQuestEventRecorder() {}, advanceDailyQuestCounter() {}});
const units = [{typeid: 20509}, {typeid: 20509}, {typeid: 20309}, {typeid: 20201}, {typeid: 20401},
    {typeid: 20109, sto: {1: 0, 2: 0}}, {typeid: 30101}];
const configBefore = JSON.stringify(ctx.data.unit_main);
const total = n.fillScoutResourceLoot(units);
assert.equal(total.gold, 600640, 'two level-9 coin stores give 600k, plus 640 producer loot');
assert.equal(total.wood, 300640);
assert.equal(units[3].sto, 640, 'producer uses numeric stock payload');
assert.equal(units[0].sto[2], 300000, 'warehouse uses resource map payload');
assert.equal(JSON.stringify(ctx.data.unit_main), configBefore);
assert.throws(() => n.fillScoutResourceLoot([{typeid: 20599}]), /Missing/);

const stock = fs.readFileSync(`${__dirname}/disasm/Components.decompiled.js`, 'utf8');
ctx.Comp = {ResourceHolder: function(){}, BattleResourceStorage: function(){}, ResourceManager: function(){}};
function stockMethod(owner, name) {
    const a = stock.indexOf(`Comp.${owner}.prototype.${name}=`), b = stock.indexOf('\n    };', a) + 7;
    assert.ok(a >= 0 && b > a); vm.runInContext(stock.slice(a, b), ctx);
}
stockMethod('ResourceHolder', 'init'); stockMethod('BattleResourceStorage', 'init');
stockMethod('BattleResourceStorage', 'onHit'); stockMethod('ResourceManager', 'onLostRes');
let rm;
ctx.cc = {baseCall(ctor, self, name, ...args) { ctx.Comp.ResourceHolder.prototype[name].apply(self, args); }};
ctx.DA = {getGameController: () => gc, GETCGC: () => gc, contains: (list, value) => list.includes(value)};
ctx.Effect = {ResourceHitAction: function(){this.runAction = () => {};}};
function reset() {
    disk = JSON.stringify({level: {player: {availableStages: {1: [9, 8, 3, 1]}},
        units: [{typeid: 20509, sto: {2: 100}}, {typeid: 20309, sto: {1: 200}}]}});
    rm = {Res: {1: total.wood, 2: total.gold}, lostRes: {1: 0, 2: 0}, master: {isPlayer: () => false},
        onLostRes: ctx.Comp.ResourceManager.prototype.onLostRes};
    n.pvpSession = {started: true, scoutLoot: total};
    gc = {__localPvpSession: n.pvpSession, getStageClient: () => ({getComponent: () => rm}),
        menu: {refreshPlayerLabel(){}, refreshClientLabel(){}}};
    lastResult = null;
}
function hit(record, percent, existing) {
    const comp = existing || {master: {stage: 2, getComponent: () => ({})},
        currentStorage: {1: 0, 2: 0}, lostRes: {1: 0, 2: 0}, registSelf(){}, refreshDisplay(){}, refreshRes(){}};
    if (!existing) ctx.Comp.BattleResourceStorage.prototype.init.call(comp, n.lookupUnitMain(record.typeid), record);
    ctx.Comp.BattleResourceStorage.prototype.onHit.call(comp, percent);
    return comp;
}
const player = {rpc_c_battle_result(r) { lastResult = r; }, getComponent(){},
    rpc_c_battle_to_home(level) { assert.equal(JSON.stringify(level), JSON.stringify(JSON.parse(disk).level)); }};
reset();
assert.deepEqual(JSON.parse(JSON.stringify(n.readScoutBattleLoot(gc, n.pvpSession))), {gold: 0, wood: 0});
const first = hit(units[0], 0.5);
hit(units[0], 0.25, first); // Repeated or regressing hit percentages cannot add more loot.
assert.equal(rm.lostRes[2], 150000);
hit(units[0], 1, first);
hit(units[3], 1);
assert.equal(n.handleCompletePvpBattle(player), true);
assert.equal(lastResult.win_gold, 300000, 'only damaged resource buildings count, despite a lost battle');
assert.equal(lastResult.win_wood, 640);
assert.equal(JSON.parse(disk).level.units[0].sto[2], 300100);
assert.equal(JSON.parse(disk).level.units[1].sto[1], 840);
const after = disk;
assert.equal(n.handleCompletePvpBattle(player), false); assert.equal(disk, after);
assert.equal(n.handlePvpBattleToHome(player), true);
assert.equal(JSON.stringify(JSON.parse(disk).level.player.availableStages), '{"1":[9,8,3,1]}');

reset(); units.slice(0, 5).forEach(u => hit(u, 1));
assert.equal(n.readScoutBattleLoot(gc, n.pvpSession).gold, total.gold);
assert.equal(n.readScoutBattleLoot(gc, n.pvpSession).wood, total.wood);
const state = JSON.parse(disk); state.level.units[0].sto[2] = 1499999; n.writeRaw(state);
assert.equal(n.handleCompletePvpBattle(player), true);
assert.equal(JSON.parse(disk).level.units[0].sto[2], 1500000, 'home capacity limits deposited loot');

reset(); hit(units[0], 1); failWrite = true;
const before = disk;
assert.throws(() => n.handleCompletePvpBattle(player), /disk unavailable/);
assert.equal(disk, before); assert.equal(n.pvpSession.completed, undefined); assert.equal(lastResult, null);
failWrite = false; assert.equal(n.handleCompletePvpBattle(player), true);
assert.equal(JSON.parse(disk).level.units[0].sto[2], 300100);
reset(); gc.__localPvpSession = {};
assert.throws(() => n.readScoutBattleLoot(gc, n.pvpSession), /mismatch/);
console.log('PASS: original capacities, stock init/hit/loss accounting, partial/full loot, defeat, persistence, capacity, duplicate and failed-write retry');
