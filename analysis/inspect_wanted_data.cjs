// Read-only snapshot of current wanted spawn rules and original table fields.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=path.join(root,'.local/wanted-data');
fs.mkdirSync(out,{recursive:true});
const c={LocalNative:{},data:{}};vm.createContext(c);
for(const n of ['wanted','unit_main','unit_battle','skill_data','hero_to_skill','skill_to_hero','hero_evolve','pve_trigger_server_to_client','item'])
 vm.runInContext(fs.readFileSync(path.join(root,'.local/wanted',n+'.js'),'utf8'),c);
for(const name of ['rune_order','equipment_attribute'])vm.runInContext(fs.readFileSync(path.join(root,'.local/layout-editor/runes',name+'.js'),'utf8'),c);
const source=fs.readFileSync(path.join(root,'analysis/native_boot.js'),'utf8');
for(const n of ['prepareHeroBattleSkills','buildWantedEquipment','buildWantedTargetTrigger']){
 const a=source.indexOf(`        LocalNative.${n} = function`),b=source.indexOf('\n        };',a)+11;
 assert(a>=0&&b>a);vm.runInContext(source.slice(a,b),c);
}
const catalog=JSON.parse(fs.readFileSync(path.join(root,'analysis/layout-editor/catalog.json'),'utf8'));
const enabled=new Set();
for(let order=1;order<=3;order++)for(const band of Object.values(c.data.wanted['player_lv_info'+order].player_lv_info))
 for(const x of band.targets)if(x.probability>0)enabled.add(x.wanted_id);
const rows=[...enabled].sort((a,b)=>a-b).map(id=>{
 const w=c.data.wanted[id],spawn=c.LocalNative.buildWantedTargetTrigger(id),type=spawn.trigger_unit;
 const main=c.data.unit_main[type],b=c.data.unit_battle[type],family=Math.floor(type/100);
 const g=catalog.guards.find(x=>Math.floor(x.typeid/100)===family);
 const skills=(c.data.hero_to_skill[family]?.skill_id||[]).filter(sid=>{
 const s=c.data.skill_to_hero[sid];return s&&s.to_hero_id===family&&[1,2,3].some(i=>s['skill_weight_'+i]>0)&&c.data.skill_data[sid*100+10];
 }).map(sid=>{const s=c.data.skill_data[sid*100+10];return {id:sid,fullId:sid*100+10,name:s.skill_name,kind:s.skill_type===2?'主动':'被动',level:10,config:s};});
 const basicIds=b.skill_nums[0],basics=basicIds.map(id=>({id,config:c.data.skill_data[id]}));
 return {wantedId:id,name:g?.name||('角色家族 '+family+'（中文名待核对）'),tier:w.card_order,typeid:type,model:main.battle_res,level:spawn.trigger_unit_lv,
 promotion:['','下士','少尉','准将'][w.card_order],spawnBuff:w.card_order===3?899801:null,count:spawn.trigger_unit_num,extraSkillCount:w.card_order,extraSkillLevel:10,randomSkillPool:skills,
 baseFields:{life:b.life,base_att:b.base_att,def:b.def,life_growth:b.life_growth,att_growth:b.att_growth,def_growth:b.def_growth,speed:b.speed,att_time:b.att_time,alarmfield:b.alarmfield},
 basics,basicTargetOverride:{target_ground:1,target_air:1},wantedSource:w,
 equipment:{count:[0,0,2,5][w.card_order],level:2,fullCombinationRequired:w.card_order===3,sample:spawn.localWantedEquipment},mutation:'prepareHeroBattleSkills uses unit_mutateid=0; trigger does not explicitly supply trigger_unit_mutateid'};
});
assert.equal(rows.length,27);
fs.writeFileSync(path.join(out,'snapshot.json'),JSON.stringify({basis:'Static source/table inspection; not runtime final stats. Random skills are a pool, not a fixed selection.',rows},null,2)+'\n');
const tier=['','普通','中级','高级'];
let md='# 通缉令防守目标数据清单\n\n核对日期：2026-10-20。已更新为用户指定的晋升与符文规则。以下是源码与原表数据，不是设备实战测量。\n\n';
md+='## 当前共用规则\n\n| 项目 | 普通 | 中级 | 高级 |\n|---|---|---|---|\n| 成长等级 | 20 | 40 | 60 |\n| 晋升军衔 | 下士 | 少尉 | 准将 |\n| 出场额外增益 | 无 | 无 | 899801，放大并强化 |\n| 二级符文数量 | 0 | 2 | 5 |\n| 符文组合技能 | 无 | 按随机结果匹配 | 保证激活五符文组合 |\n| 实际模型形态 | 第一形态 | 第二形态 | 第三形态 |\n| 目标数量 | 1 | 1 | 1 |\n| 额外随机技能数 | 1 | 2 | 3 |\n| 额外技能等级 | 10 | 10 | 10 |\n| 普通攻击目标 | 地面和空中 | 地面和空中 | 地面和空中 |\n\n等级、形态、军衔、符文和技能数量是当前本地规则。随机技能从角色自己的可学习候选池等概率、不重复抽取，进入战斗前确定。普通攻击对地和对空的修改仅作用于通缉目标实例。额外技能保留各自原目标限制。高级目标出场后额外获得原版 899801 增益：体型 1.5 倍，攻击 150%、防御 50%、移速和攻速各 200%，持续 999999 毫秒，保留原特效。每个目标只施加一次。\n\n';
md+='## 27 个有效目标\n\n生命、攻击、防御列为原表基础字段。成长列为原表数组首项，完整数组见 JSON；这些列不能直接当作 20、40、60 级的最终战斗属性。射程使用游戏逻辑单位，非格子数。\n\n| 档位 | 角色 | 通缉 ID | 出场类型 | 基础生命 | 基础攻击 | 基础防御 | 生命／攻击／防御成长首项 | 速度首项 | 普攻 ID | 普攻射程 |\n|---|---|---:|---:|---:|---:|---:|---|---:|---|---|\n';
for(const r of rows){const b=r.baseFields;md+=`| ${tier[r.tier]} | ${r.name} | ${r.wantedId} | ${r.typeid} | ${b.life??'未设'} | ${b.base_att??0} | ${b.def??0} | ${b.life_growth?.[0]}／${b.att_growth?.[0]}／${b.def_growth?.[0]} | ${b.speed?.[0]} | ${r.basics.map(x=>x.id).join('、')} | ${r.basics.map(x=>x.config.att_dis??'未设').join('、')} |\n`;}
md+='\n## 各角色随机技能候选池\n\n同一角色在不同档位使用相同候选池，抽取数量不同。普通包含 5 种角色，中级和高级各包含 11 种。角色家族 131、132 未出现在现有守军中文目录中，保留编号，中文名待核对。括号中为技能家族 ID；实际 10 级 ID 为家族 ID × 100 + 10。\n\n';
for(const r of rows.filter((r,i)=>rows.findIndex(x=>Math.floor(x.typeid/100)===Math.floor(r.typeid/100))===i))md+=`- ${r.name}：${r.randomSkillPool.map(s=>`${s.name}（${s.id}，${s.kind}）`).join('、')}。\n`;
md+='\n## 调整入口与限制\n\n档位等级、形态、目标数量、技能数量和等级目前写在 `analysis/native_boot.js` 的 `buildWantedTargetTrigger`，没有独立的难度配置文件。该函数从原表取得生命、攻击、防御与成长数据，没有单独设置通缉专用的属性倍率。\n\n如需只改变通缉难度，应在通缉出场流程配置属性或倍率。直接修改共享 `unit_battle` 会影响其他玩法中的同名角色。原版成长函数读取成长等级，技能、装备等加成继续参与后续属性计算；本次未核验设备中的最终数值，不把基础字段乘等级当作实战证明。\n\n通缉出场先选定符文，再通过局部创建入口传入原版 `params.eqp`。中级前两槽随机类型，高级从原表 9 种五符文组合等概率选择；每个符文均为 2 级，每层随机一条原表属性，不生成专属英雄属性。重试复用已选定配置。原版装备组件自动接入属性和组合技能，五个 2 级符文产生 2 级组合技能。变异编号仍未显式传入。技能准备函数使用 `unit_mutateid=0`，而原触发器读取 `trigger_unit_mutateid`；缺省值最终如何归一化，本次未做设备探针，暂不作为变异已验证结论。\n\n完整候选技能配置、目标原表、模型路径与成长数组保存在 `.local/wanted-data/snapshot.json`。生成脚本：`analysis/inspect_wanted_data.cjs`。\n';
fs.mkdirSync(path.join(root,'docs/native'),{recursive:true});fs.writeFileSync(path.join(root,'docs/native/WANTED-TARGET-DATA.md'),md);
console.log(JSON.stringify(rows.filter((r,i)=>rows.findIndex(x=>x.name===r.name)===i).map(r=>({name:r.name,forms:rows.filter(x=>x.name===r.name).map(x=>x.typeid),skills:r.randomSkillPool.length})),null,2));
console.log('Wrote docs/native/WANTED-TARGET-DATA.md and .local/wanted-data/snapshot.json');
