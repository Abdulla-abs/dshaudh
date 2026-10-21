// Refresh stationary traps from the original unit and Chinese string tables.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const root = path.resolve(__dirname, '..'), ctx = {data: {}};
vm.createContext(ctx);
for (const file of ['.local/hero-reincarnate/unit_main.js', '.local/layout-editor/skill-info/string_data.js']) {
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), ctx);
}
const file = path.join(root, 'analysis/layout-editor/catalog.json');
const catalog = JSON.parse(fs.readFileSync(file, 'utf8'));
const rows = Object.values(ctx.data.unit_main).filter(r => r.first_type === 1 && r.battle_type === 8 && r.lv > 0);
const families = [...new Set(rows.map(r => Math.floor(r.typeid / 100)))].sort((a, b) => a - b);
if (!families.length) throw Error('Original trap rows missing');
const traps = families.map(family => {
    const variants = rows.filter(r => Math.floor(r.typeid / 100) === family).sort((a, b) => a.lv - b.lv);
    const name = ctx.data.string_data[variants[0].name]?.Chinese;
    if (!name || variants.some(r => !Number.isInteger(r.tilesize_x) || !Number.isInteger(r.tilesize_y))) {
        throw Error('Incomplete trap data: ' + family);
    }
    return {family, name, group: '陷阱', levels: variants.map(r => ({
        level: r.lv, typeid: r.typeid, width: r.tilesize_x, height: r.tilesize_y
    }))};
});
catalog.buildings = catalog.buildings.filter(b => !families.includes(b.family)).concat(traps);
fs.writeFileSync(file, JSON.stringify(catalog), 'utf8');
console.log(traps.map(t => `${t.family} ${t.name}: ${t.levels.length} levels`).join('\n'));
