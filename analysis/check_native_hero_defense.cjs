const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
let disk;
const status = [];
const ctx = { LocalNative: {} };
vm.createContext(ctx);
const n = ctx.LocalNative;
Object.assign(n, {
    readRaw: () => JSON.parse(disk),
    writeRaw: (s) => { disk = JSON.stringify(s); },
    writeStatus: (e) => { status.push(e); }
});
const a = source.indexOf('        LocalNative.applyHeroDefense = function');
const b = source.indexOf('        LocalNative.normalizeHeroExperience = function', a + 1);
assert.ok(a >= 0 && b > a, 'applyHeroDefense missing');
vm.runInContext(source.slice(a, b), ctx);

function reset() {
    status.length = 0;
    disk = JSON.stringify({
        level: {
            heros: [
                { sid: 'hero_slot_1', typeid: 10401, state: 1, aidx: 0, defense_id: 0 },
                { sid: 'pve_first_2_hero', typeid: 10501, state: 0, aidx: -1 }
            ]
        }
    });
}

reset();
assert.equal(n.applyHeroDefense({ uid: 'pve_first_2_hero', defense_id: 100 }), true);
let saved = JSON.parse(disk).level.heros[1];
assert.equal(saved.did, 100);
assert.equal(saved.defense_id, 100);
assert.equal(JSON.parse(disk).level.heros[0].did, undefined, 'other hero untouched');
assert.equal(status[0].step, 'hero-defense-saved');

assert.equal(n.applyHeroDefense({ uid: 'pve_first_2_hero', defense_id: '' }), true);
saved = JSON.parse(disk).level.heros[1];
assert.equal(saved.did, '');
assert.equal(saved.defense_id, '');

reset();
assert.equal(n.applyHeroDefense({ uid: 'missing', defense_id: 100 }), false);
assert.equal(JSON.parse(disk).level.heros[1].did, undefined);
assert.equal(status[0].step, 'hero-defense-missing');

const dispatch = source.indexOf("methodName === 'rpc_s_set_hero_defense'");
assert.ok(dispatch > 0, 'callServer must dispatch rpc_s_set_hero_defense');
assert.ok(source.indexOf('LocalNative.applyHeroDefense(params || {})', dispatch) > dispatch);

console.log('PASS: bunker garrison did/defense_id persists via rpc_s_set_hero_defense; clear and missing uid covered');
