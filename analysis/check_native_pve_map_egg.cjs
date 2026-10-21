const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
let disk, failWrite = false;
const ctx = {LocalNative: {}, data: {}, G_MainController: {setNotice() {}}};
vm.createContext(ctx);
for (const name of ['item', 'item_input', 'input_event_client'])
    vm.runInContext(fs.readFileSync(`${__dirname}/../.local/shop-treasure/${name}.js`, 'utf8'), ctx);
vm.runInContext(fs.readFileSync(`${__dirname}/../.local/hero-guide-entry/pve_stage.js`, 'utf8'), ctx);
const n = ctx.LocalNative;
Object.assign(n, {readRaw: () => JSON.parse(disk), writeRaw: s => {
    if (failWrite) throw Error('disk failure'); disk = JSON.stringify(s);
}, writeStatus() {}});
for (const [name, next] of [['shopState','shopPick'], ['shopAddItem','shopHeroPools'],
    ['handlePveMapEgg','handleTutorialEggDraw']]) {
    const a = source.indexOf(`        LocalNative.${name} = function`);
    const b = source.indexOf(`        LocalNative.${next} = function`, a + 1);
    assert.ok(a >= 0 && b > a); vm.runInContext(source.slice(a, b), ctx);
}
function setup() {
    failWrite = false;
    disk = JSON.stringify({level: {player: {availableStages: {3:[0,0,3,0]}, pve_awardBox:{}},
        heros:[{sid:'keep'}]}, keep:'unchanged'});
    const pm = {init(p) {this.package = p.package;}};
    return {pve_awardBox:{3:1}, getComponent: () => pm};
}
function count() {
    const pkg = JSON.parse(disk).level.player.package || {};
    return Object.values(pkg).flatMap(b => Object.values(b.item_dict)).filter(i => i.typeid === 1124)
        .reduce((sum,i) => sum+i.num,0);
}
let p = setup();
assert.equal(n.handlePveMapEgg(p,{index:3}),true);
assert.equal(count(),1);
assert.equal(JSON.parse(disk).level.player.pve_awardBox[3],1);
assert.equal(JSON.parse(disk).keep,'unchanged');
assert.equal(n.handlePveMapEgg(p,{index:3}),false);
assert.equal(count(),1,'duplicate does not grant');
const restart = {getComponent:()=>({init(){}})};
assert.equal(n.handlePveMapEgg(restart,{index:3}),false);
assert.equal(count(),1,'restart retains claim');
p=setup(); failWrite=true;
assert.equal(n.handlePveMapEgg(p,{index:3}),false);
assert.equal(count(),0);
assert.equal(p.pve_awardBox[3],undefined,'undo optimistic flag');
failWrite=false;
assert.equal(n.handlePveMapEgg(p,{index:3}),true,'can retry failed save');
p=setup();
assert.equal(n.handlePveMapEgg(p,{index:4}),false,'locked stage');
assert.equal(n.handlePveMapEgg(p,{index:'bad'}),false);
assert.equal(count(),0);
p=setup();
const pm=p.getComponent();
pm.package={material:{capacity:0,item_dict:{}}};
assert.equal(n.handlePveMapEgg(p,{index:3}),false,'full bag rolls back');
assert.equal(count(),0);
assert.equal(p.pve_awardBox[3],undefined);
console.log('PASS: original stage-3 event grants one egg; claim/restart dedup, save failure retry, locked stage and full bag');
