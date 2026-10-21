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
