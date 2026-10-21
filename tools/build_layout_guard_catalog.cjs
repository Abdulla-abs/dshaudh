// Refresh guard choices from locally extracted original game tables.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),ctx={data:{}};
vm.createContext(ctx);
for(const [folder,names] of [
    ['hero-reincarnate',['unit_main','unit_battle']],
    ['shop-treasure',['hero_to_skill','skill_to_hero','skill_data']],
    ['hero-feed',['mutate_effect']],
    ['layout-editor/skill-info',['string_data','info_skill','info_info_skill']]]) {
    for(const name of names)vm.runInContext(fs.readFileSync(path.join(root,'.local',folder,name+'.js'),'utf8'),ctx);
}
const file=path.join(root,'analysis/layout-editor/catalog.json');
const catalog=JSON.parse(fs.readFileSync(file,'utf8')),d=ctx.data;
const text=key=>{
    const value=d.string_data[key]?.Chinese;
    if(typeof value!=='string')throw Error('Missing original Chinese string '+key);
    return value.replace(/#c[0-9a-f]{6}/gi,'').replace(/#n/g,'\n');
};
const targetKeys={1:'skill_target_construction',2:'skill_target_defence',3:'skill_target_soldior',
    4:'skill_target_hero',5:'skill_target_self',6:'skill_target_ground',7:'skill_target_air'};
const targetName=id=>text(targetKeys[id]||d.unit_main[id*100+1]?.name);
for(const hero of catalog.guards){
    const family=Math.floor(hero.typeid/100);
    const rows=Object.values(d.unit_main).filter(x=>Math.floor(x.typeid/100)===family&&x.is_hero&&d.unit_battle[x.typeid]);
    const models=[...new Set(rows.map(x=>x.battle_res))];
    hero.variants=rows.map(x=>({typeid:x.typeid,evolution:models.indexOf(x.battle_res),
        reborn:x.reborn_times??rows.filter(v=>v.battle_res===x.battle_res&&v.typeid<x.typeid).length,
        basics:d.unit_battle[x.typeid].skill_nums}));
    hero.skills=(d.hero_to_skill[family]?.skill_id||[]).filter(id=>{
        const row=d.skill_to_hero[id];
        return row&&row.to_hero_id===family&&[1,2,3].some(i=>row['skill_weight_'+i]>0);
    }).map(id=>{
        const levels=Object.values(d.skill_data).filter(s=>Math.floor(s.id/100)===id&&s.skill_lv>0).sort((a,b)=>a.skill_lv-b.skill_lv);
        if(!levels.length)throw Error('Missing skill '+id);
        const details={};
        for(const s of levels){
            const info=d.info_skill[s.id];
            if(!info)throw Error('Missing original skill detail '+s.id);
            details[s.id%100]={name:text(s.skill_cast_name),description:text(s.skill_cast_info),
                attributes:Object.values(d.info_info_skill).filter(a=>info[a.vari]!==undefined).map(a=>({
                    name:text(a.tid),value:String(info[a.vari])})),
                targets:(info.target_list||[]).map(targetName),excludedTargets:(info.no_target_list||[]).map(targetName),
                friendlyFire:!!info.friendly_fire};
        }
        return {id,name:levels[0].skill_name,kind:levels[0].skill_type===2?'主动':'被动',levels:levels.map(s=>s.id%100),details};
    });
}
catalog.mutations=[{id:0,name:'无变异',type:0,level:0},...Object.entries(d.mutate_effect).map(([id,x])=>({
    id:Number(id),type:x.mutate_type,level:x.mutate_level,name:['','水','火','风','雷','土'][x.mutate_type]+'系 '+x.mutate_level+' 级'}))];
fs.writeFileSync(file,JSON.stringify(catalog)+'\n');
console.log('Updated original guard variants, learnable skills, mutation types and levels.');
