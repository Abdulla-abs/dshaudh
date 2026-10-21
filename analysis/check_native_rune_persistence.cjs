const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(process.env.NATIVE_BOOT_SOURCE || `${__dirname}/native_boot.js`, 'utf8');
const stock = fs.readFileSync(`${__dirname}/../.local/hero-equip-slot/HeroComponents.js`, 'utf8');
const ctx = {LocalNative: {}, GS_CURRENT_STAGE: 1, GS_STAGE_BUILD: 1, BATTLE_FACTION_DEFENDER: 2};
vm.createContext(ctx);
function load(name) {
    const a = source.indexOf(`        LocalNative.${name} = function`);
    const b = source.indexOf('\n        LocalNative.', a + 1);
    assert.ok(a >= 0 && b > a, name);
    vm.runInContext(source.slice(a, b), ctx);
}
for (const name of ['snapshotHeroEquipment', 'persistHeroEquipment', 'tryDumpAndSave', 'installCallServer']) load(name);
vm.runInContext(`
var disk, failWrite = false, commits = 0, statuses = [];
var pm = {package: {advanced_prop: {item_dict: {}, capacity: 100}},
    subItemNumByOid: function(pkgid, oid, num) {
        var bag = this.package.advanced_prop.item_dict;
        bag[oid].num -= num; if (!bag[oid].num) delete bag[oid];
    },
    addItem: function(item) { this.package.advanced_prop.item_dict[item.oid] = JSON.parse(JSON.stringify(item)); },
    isPackageFull: function() { return false; }
};
var G_Player = {getComponent: function(name) { return name === 'PackageManager' ? pm : null; }};
var hero = {sid: 'h1', typeid: 10401, faction: 1, getSid: function() {return this.sid;},
    getComponent: function(name) {
        if (name === 'HeroEquipment') return equipment;
        if (name === 'HeroAttributeController') return {setMaxLife: function(){}, addLife: function(){}};
        return null;
    }, callServer: function(method, params) { params.uid = this.sid; return G_Player.callServer(method, params); }
};
var G_UnitManager = {getUnitBySID: function(sid) { return sid === hero.sid ? hero : null; }};
var Comp = {HeroEquipment: function() {this.master = hero; this.eqp = [null, null];}};
Comp.HeroEquipment.getEquipmentAttr = function() {return 0;};
var cc = {baseCall: function(){}};
var DA = {deepCopy: function(x) {return JSON.parse(JSON.stringify(x));}, debug: function(){}};
var data = {item: {7031: {item_type: 2}, 7041: {item_type: 2}}};
// The decompiler leaves item_type's pkgid assignment as an expression. Seed the
// known advanced_prop ID; this test exercises stock ordering, not that decode.
var pkgid = 2, rep_pkgid = 2;
`, ctx);
for (const name of ['init', 'dump', 'getOpenedSlots', 'isSlotEmpty', 'isSlotFull', 'getEquipment',
    'putOnEquipment', '_putOnEquipment', 'takeOffEquipment', '_takeOffEquipment', 'replaceEquipment']) {
    const a = stock.indexOf(`Comp.HeroEquipment.prototype.${name}=`);
    const b = stock.indexOf('\nComp.HeroEquipment.', a + 1);
    assert.ok(a >= 0 && b > a, name);
    vm.runInContext(stock.slice(a, b), ctx);
}
vm.runInContext(`
Comp.HeroEquipment.prototype.getEquipForm = function(){return 1;};
Comp.HeroEquipment.prototype.getNeededForm = function(){return 1;};
var equipment = new Comp.HeroEquipment();
Object.assign(LocalNative, {
    readRaw: function(){return JSON.parse(disk);},
    saveLevel: function(level){if (failWrite) throw Error('disk full'); disk = JSON.stringify({level:level}); commits++;},
    getBuildController: function(){return null;}, collectHomeBuildings: function(){return [];},
    getResourceManager: function(){return null;}, copyAccountProgress: function(){},
    writeStatus: function(s){statuses.push(s);}, callLog: []
});
LocalNative.installCallServer(G_Player);
function reset() {
    equipment.eqp = [null, null];
    pm.package.advanced_prop.item_dict = {
        r1: {oid:'r1', typeid:7031, num:1, attrs:[[1,77]], marker:'first'},
        r2: {oid:'r2', typeid:7041, num:1, attrs:[[2,88]], marker:'second'}
    };
    disk = JSON.stringify({level:{units:[], player:{package:pm.package},
        heros:[{sid:'h1', eqp:[null,null], skill_slots:[{sid:123, lv:2}]},
               {sid:'absent', eqp:[{oid:'offline', typeid:7031}]}]}});
    failWrite = false; commits = 0;
}
function login() {
    var saved = JSON.parse(disk).level;
    pm.package = JSON.parse(JSON.stringify(saved.player.package));
    equipment = new Comp.HeroEquipment();
    equipment.init({}, saved.heros[0]);
}
reset();
equipment.putOnEquipment(0, pm.package.advanced_prop.item_dict.r1);
`, ctx);
const run = code => vm.runInContext(code, ctx);
const saved = () => JSON.parse(run('disk')).level;
assert.equal(saved().heros[0].eqp[0].marker, 'first');
assert.equal(saved().player.package.advanced_prop.item_dict.r1, undefined);
assert.equal(run('commits'), 1, 'one atomic save after optimistic item move');
run('login()');
assert.equal(run('equipment.eqp[0].attrs[0][1]'), 77);
assert.equal(run('equipment.eqp.length'), 2);
run('equipment.replaceEquipment(0, pm.package.advanced_prop.item_dict.r2); login()');
assert.equal(saved().heros[0].eqp[0].marker, 'second');
assert.equal(saved().player.package.advanced_prop.item_dict.r1.num, 1);
assert.equal(saved().player.package.advanced_prop.item_dict.r2, undefined);
run('equipment.takeOffEquipment(0); login()');
assert.equal(saved().heros[0].eqp[0], null);
assert.equal(saved().player.package.advanced_prop.item_dict.r2.num, 1);
assert.equal(saved().player.package.advanced_prop.item_dict.r2.slot, undefined);
assert.deepEqual(saved().heros[0].skill_slots, [{sid:123, lv:2}]);
assert.equal(saved().heros[1].eqp[0].oid, 'offline', 'missing runtime hero preserved');
const unchanged = run('disk');
assert.equal(run("LocalNative.persistHeroEquipment({sid:'missing'})"), false);
assert.equal(run('disk'), unchanged);
run('reset(); failWrite = true; equipment.putOnEquipment(0, pm.package.advanced_prop.item_dict.r1)');
assert.equal(saved().heros[0].eqp[0], null, 'failed save leaves previous pair intact');
assert.equal(saved().player.package.advanced_prop.item_dict.r1.num, 1);
run('failWrite = false; LocalNative.tryDumpAndSave(); login()');
assert.equal(saved().heros[0].eqp[0].marker, 'first', 'later home snapshot retries equipment too');
assert.equal(saved().player.package.advanced_prop.item_dict.r1, undefined);
const home = run('disk');
run('GS_CURRENT_STAGE = 2; equipment.eqp = [null]; LocalNative.tryDumpAndSave()');
assert.equal(run('disk'), home, 'battle snapshot cannot overwrite home');
console.log('PASS: stock wear/replace/remove -> atomic home save -> stock login; attributes, slots, absent hero, failed save retry and battle isolation');
