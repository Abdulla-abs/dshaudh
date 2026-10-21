const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
let scale = 2, fixed = true, interval = 1/60, appInterval = 1/60;
const reports = [], expected = {units: []};
const context = {
    LocalNative: {writeStatus: x => reports.push(x), makeHomeInitDict: x => x},
    G_Director: {
        getAnimationInterval: () => interval,
        setAnimationInterval: x => { interval = x; },
        setFixAnimationInterval: x => { fixed = x; },
        getScheduler: () => ({getTimeScale: () => scale, setTimeScale: x => {scale = x;}})
    },
    cc: {Application: {getInstance: () => ({setAnimationInterval: x => {appInterval = x;}})}},
    bp: {initLevelFromData(dict) {
        assert.equal(dict, expected);
        assert.equal(scale, 1); assert.equal(fixed, false);
        assert.equal(interval, 1/30); assert.equal(appInterval, 1/30);
        return 'stock-home';
    }}
};
vm.createContext(context);
function runRange(start, end) {
    const a = source.indexOf(start), b = source.indexOf(end, a + 1);
    assert.ok(a >= 0 && b > a); vm.runInContext(source.slice(a, b), context);
}
runRange('        LocalNative.restoreHomeClock = function', '        LocalNative.handlePveBattleToHome = function');
runRange("                    if (typeof bp.initLevelFromData === 'function'", "                    if (typeof bp._enterWorldAction === 'function'");
assert.equal(scale, 2, 'installing the wrapper must preserve active battle speed');
for (const accelerated of [true, false, true]) {
    scale = accelerated ? 2 : 1; fixed = accelerated;
    assert.equal(context.bp.initLevelFromData(expected), 'stock-home');
}
const restore = reports.filter(x => x.step === 'home-clock-restore');
assert.equal(restore[0].scaleBefore, 2); assert.equal(restore[0].scaleAfter, 1);
assert.equal(restore.length, 3);
// One missing platform method must not prevent the other clock resets.
context.G_Director.setFixAnimationInterval = () => {throw Error('unsupported');};
scale = 2; interval = appInterval = 1/60;
assert.equal(context.LocalNative.restoreHomeClock(), false);
assert.equal(scale, 1); assert.equal(interval, 1/30); assert.equal(appInterval, 1/30);
assert.equal(reports.at(-1).errors.length, 1);
console.log('PASS: home boundary restores clocks, preserves stock init and battle speed, logs partial failures');

// Execute the actual scout boundary, after stock preLeaveWorld has enabled
// fixed 1/30 steps. At 60 renders/sec that advances two seconds per second.
context.G_Director.setFixAnimationInterval = x => {fixed = x;};
const scoutStart = source.indexOf('                        btp.initLevelFromData = function(dict) {');
const scoutEnd = source.indexOf('// Guarantee nested oppo.player', scoutStart);
assert.ok(scoutStart >= 0 && scoutEnd > scoutStart);
vm.runInContext('var btp = {}; ' + source.slice(scoutStart, scoutEnd) + 'return dict; };', context);
for (let opponent = 0; opponent < 4; opponent++) {
    scale = 1; fixed = opponent > 0; interval = appInterval = 1/30;
    const dict = {source: 'local-predefined-scout'};
    assert.equal(context.btp.initLevelFromData(dict), dict);
    assert.equal(fixed, false, 'each scouting map must use elapsed time');
    assert.equal(scale, 1);
    assert.equal(interval, 1/30); assert.equal(appInterval, 1/30);
}
scale = 2; fixed = true; interval = appInterval = 1/60;
context.btp.initLevelFromData({source: 'replay'});
assert.equal(scale, 2); assert.equal(fixed, true);
assert.equal(interval, 1/60); assert.equal(appInterval, 1/60);
console.log('PASS: first scout and repeated target changes normalize fixed steps; other battle sources retain timing');
