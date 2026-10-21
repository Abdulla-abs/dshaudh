// Build compact, offline player limits from recovered stock tables and a read-only save.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'.local/layout-player-mode');
const ctx={data:{}};vm.createContext(ctx);
for(const name of ['unit_main','build_number'])vm.runInContext(fs.readFileSync(path.join(dir,name+'.js'),'utf8'),ctx);
const catalog=JSON.parse(fs.readFileSync(path.join(root,'analysis/layout-editor/catalog.json'),'utf8'));
const saved=JSON.parse(fs.readFileSync(path.join(dir,'save.json'),'utf8'));
const capture=JSON.parse(fs.readFileSync(path.join(dir,'capture.json'),'utf8'));
const units=saved.level.units,base=units.find(u=>Math.floor(u.typeid/100)===201);
if(!base)throw Error('No main base in dedicated instance save');
const data=ctx.data, rules={version:1,source:'Original build_number + unit_main; previous-level upgrade requirement',
    snapshot:{date:capture.capturedAt.slice(0,10),instance:capture.instance,baseLevel:base.typeid%100},families:{}};
for(const entry of [...catalog.buildings,{family:211,name:'龙墙',levels:Array.from({length:10},(_,i)=>({level:i+1,typeid:21101+i}))}]){
    const family=entry.family,row=data.build_number[family]||{},levels={};
    let needed=1,reachable=true;
    for(const spec of entry.levels){
        const previous=data.unit_main[spec.typeid-1];
        reachable=reachable&&!!previous?.lv_up_able;
        needed=Math.max(needed,previous?.rely_base_lv||1);
        if(reachable)levels[spec.level]=needed;
    }
    // The base itself defines the scenario tier, rather than depending on itself.
    if(family===201)for(const s of entry.levels)levels[s.level]=s.level;
    const counts=Array.from({length:10},(_,i)=>row[`lv${i+1}_num`]??0);
    rules.families[family]={name:family===201?'大本营':entry.name,counts,levels,
        currentCount:units.filter(u=>Math.floor(u.typeid/100)===family).length};
}
const file=path.join(root,'analysis/layout-editor/player-rules.json');
fs.writeFileSync(file,JSON.stringify(rules,null,2)+'\n');
console.log(`Player rules: ${Object.keys(rules.families).length} families, current base ${rules.snapshot.baseLevel}`);
