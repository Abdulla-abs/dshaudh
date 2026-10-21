// Build editor rune choices from extracted original tables, preserving other catalogs.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),ctx={data:{}};vm.createContext(ctx);
for(const p of ['.local/shop-treasure/item.js','.local/shop-treasure/skill_data.js',
    '.local/layout-editor/skill-info/string_data.js',...['rune_order','equipment_attribute','exclusive_attribute'].map(n=>'.local/layout-editor/runes/'+n+'.js')])
    vm.runInContext(fs.readFileSync(path.join(root,p),'utf8'),ctx);
const d=ctx.data,text=k=>{const v=d.string_data[k]?.Chinese;assert.ok(v,'Missing Chinese '+k);return v.replace(/#c[0-9a-f]{6}/gi,'').replace(/#n/g,'\n');};
const items=Object.entries(d.item).filter(([id,r])=>r.rune_type).map(([id,r])=>({
    typeid:Number(id),name:text(r.item_name),slot:r.item_form-3,level:r.item_level,type:r.rune_type,
    description:text(r.item_info)}));
assert.equal(items.length,45);assert.ok(items.every(r=>r.slot>=0&&r.slot<5));
const labels={life:'生命',defence:'防御',life_recover:'生命恢复',attack:'攻击',attack_speed:'攻击速度',move_speed:'移动速度',
    soldier_defence:'龙兵防御',soldier_attack:'龙兵攻击',soldier_recover:'龙兵恢复',leadershipA:'统驭-蛋壳儿',leadershipB:'统驭-小白皮'};
const attributes=Object.entries(d.equipment_attribute).filter(([id,r])=>r.attr_name).map(([id,r])=>({
    id:Number(id),stat:r.attr_name,name:labels[r.attr_name],value:r[r.attr_name],
    unit:['attack_speed','move_speed'].includes(r.attr_name)?'%':'',
    layers:[['base_attr','att_basic_color'],['two_attr','att_evolve2_color'],['three_attr','att_evolve3_color']]
        .filter(([layer,key])=>r[key]>0).map(([layer])=>layer)}));
const orders=Object.entries(d.rune_order).map(([key,r])=>({key,skill:r.rune_skill_no,replacement:r.replace1_rune_skill_no||null}));
const skills=[...new Set(orders.flatMap(r=>[r.skill,r.replacement]).filter(Boolean))].map(id=>{
    const rows=Object.values(d.skill_data).filter(s=>Math.floor(s.id/100)===id&&s.skill_lv>0);
    assert.ok(rows.length,'Missing rune skill '+id);
    return {id,levels:rows.map(s=>({level:s.skill_lv,name:d.string_data[s.skill_cast_name]?.Chinese||s.skill_name,
        description:d.string_data[s.skill_cast_info]?.Chinese||'原表暂无中文说明。'}))};
});
const file=path.join(root,'analysis/layout-editor/catalog.json'),catalog=JSON.parse(fs.readFileSync(file,'utf8'));
catalog.runes={slots:5,items,attributes,orders,skills,exclusive:Object.entries(d.exclusive_attribute).map(([id,r])=>({
    hero:Number(id),attributes:r.ID}))};
fs.writeFileSync(file,JSON.stringify(catalog),'utf8');console.log('Built 45 rune choices, attribute values and 27 combination orders');
