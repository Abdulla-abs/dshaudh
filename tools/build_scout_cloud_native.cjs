const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const catalog = JSON.parse(read('analysis/layout-editor/catalog.json'));
const rules = {buildings:{}, guards:{}, skills:{}, runeSlots:{}, attributes:{}, exclusive:catalog.runes.exclusive.map(e => e.hero)};
for (const building of catalog.buildings) for (const v of building.levels) rules.buildings[v.typeid] = [v.width, v.height];
for (const hero of catalog.guards) for (const v of hero.variants) {
    rules.skills[hero.typeid] = hero.skills.flatMap(s => s.levels.map(l => s.id * 100 + l));
    const value = {basics:v.basics, skills:hero.typeid};
    if (rules.guards[v.typeid] && JSON.stringify(rules.guards[v.typeid]) !== JSON.stringify(value)) throw Error('Ambiguous guard variant');
    rules.guards[v.typeid] = value;
}
for (const item of catalog.runes.items) rules.runeSlots[item.typeid] = item.slot;
for (const a of catalog.runes.attributes) rules.attributes[a.id] = [a.stat, a.layers];
const start = '        // BEGIN SCOUT CLOUD SYNC';
const end = '        // END SCOUT CLOUD SYNC';
const config = JSON.parse(read('analysis/rpc-contracts/scout-cloud-client.json'));
const block = start + '\n        LocalNative.scoutCloudConfig = ' + JSON.stringify(config) + ';\n' +
    '        LocalNative.scoutCloudRules = ' + JSON.stringify(rules) + ';\n' +
    read('analysis/scout-cloud/native-sync.js').trimEnd().split('\n').map(line => '        ' + line).join('\n') + '\n' + end;
let source = read('analysis/native_boot.js');
if (process.argv.includes('--apply')) {
    const a = source.indexOf(start), b = source.indexOf(end);
    if (a >= 0 && b > a) source = source.slice(0, a) + block + source.slice(b + end.length);
    else {
        const anchor = '        // END SCOUT LEVEL POOL';
        if (a >= 0 || b >= 0 || !source.includes(anchor)) throw Error('Sync insertion markers invalid');
        source = source.replace(anchor, anchor + '\n\n' + block);
    }
    fs.writeFileSync(path.join(root, 'analysis/native_boot.js'), source);
} else if (!source.includes(block)) throw Error('Native scout sync block is stale; use --apply');
console.log('Native cloud sync block: ' + Buffer.byteLength(block) + ' bytes');
