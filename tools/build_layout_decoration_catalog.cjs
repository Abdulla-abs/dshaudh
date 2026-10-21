// Refresh map decorations from original unit and Chinese string tables.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),ctx={data:{}};
vm.createContext(ctx);
for(const file of ['.local/hero-reincarnate/unit_main.js','.local/layout-editor/skill-info/string_data.js'])
    vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx);
const rows=Object.values(ctx.data.unit_main).filter(r=>r.first_type===4&&r.lv>0).sort((a,b)=>a.typeid-b.typeid);
assert.equal(rows.length,29,'Expected the audited original map objects');
const groups=new Map();
for(const r of rows){
    const family=Math.floor(r.typeid/100),name=ctx.data.string_data[r.name]?.Chinese;
    assert.ok(name&&Number.isInteger(r.tilesize_x)&&r.tilesize_x>0&&Number.isInteger(r.tilesize_y)&&r.tilesize_y>0,
        'Incomplete decoration '+r.typeid);
    if(!groups.has(family))groups.set(family,{family,name,group:family<=604?'生物':family>=621?'石头':'植物',levels:[]});
    groups.get(family).levels.push({level:r.lv,typeid:r.typeid,width:r.tilesize_x,height:r.tilesize_y});
}
const file=path.join(root,'analysis/layout-editor/catalog.json'),catalog=JSON.parse(fs.readFileSync(file,'utf8'));
catalog.buildings=catalog.buildings.filter(b=>!groups.has(b.family)).concat([...groups.values()]);
fs.writeFileSync(file,JSON.stringify(catalog),'utf8');
console.log('Updated '+groups.size+' original map decorations');
