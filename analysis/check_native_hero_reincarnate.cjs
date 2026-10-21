const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(`${__dirname}/native_boot.js`,'utf8');
const dir=`${__dirname}/../.local/hero-reincarnate`;
let disk,pm,unit,rm,failWrite=false,answers=0,model,questCalls=0,failCallback=false;
const ui={playing:true,refreshButtonState(){this.enabled=true;},refreshCurrentUI(){}};
const ctx={LocalNative:{},data:{},GS_CURRENT_STAGE:1,GS_STAGE_BUILD:1,Comp:{PackageManager:function(){}},
 ClientPlayer:function(){},Unit:function(){},RES_TYPE_SPIRIT:4,HERO_LEVEL_OFFSET:100,
 G_UnitManager:{getUnitBySID:sid=>sid==='hero'?unit:null},
 G_MainController:{setNotice(){}},UI:{HeroReincarnation:{UIID:1},AlchemyInterface:{UIID:2}},
 G_UIManager:{isUIOpen:()=>true,get_ui:()=>ui}};
vm.createContext(ctx);
for(const name of ['hero_evolve','unit_main','unit_battle','item'])
 vm.runInContext(fs.readFileSync(`${dir}/${name}.js`,'utf8'),ctx);
function stock(file,start,end){const s=fs.readFileSync(`${dir}/${file}.js`,'utf8');
 const a=s.indexOf(start),b=s.indexOf(end,a+start.length);assert.ok(a>=0&&b>a);vm.runInContext(s.slice(a,b),ctx);}
const components=fs.readFileSync(`${dir}/Components.js`,'utf8');
vm.runInContext(components.match(/REINCARNATE_CONDITION=\[[^;]+;/)[0],ctx);
stock('Components','Comp.PackageManager.prototype.getRebornSpirits=', 'Comp.PackageManager.prototype.getTargetTypeid=');
stock('Components','Comp.PackageManager.prototype.getHeroMaxSpirit=', 'Comp.PackageManager.prototype.getPreTargetTypeid=');
stock('Components','Comp.PackageManager.prototype.getRebornTime=', 'Comp.PackageManager.prototype.getHeroMaxSpirit=');
stock('Components','Comp.PackageManager.prototype.reincarnateHeroAns=', 'Comp.PackageManager.prototype.buyPackageAns=');
stock('ClientPlayer','ClientPlayer.prototype.rpc_c_reincarnate_ans2=', 'ClientPlayer.prototype.');
stock('ClientPlayer','ClientPlayer.prototype.rpc_c_promote=', 'ClientPlayer.prototype.');
stock('Unit','Unit.prototype.server_promote=', 'Unit.prototype.getBuildFxOffset=');
const n=ctx.LocalNative;
Object.assign(n,{readRaw:()=>JSON.parse(disk),writeRaw:s=>{if(failWrite)throw Error('disk');disk=JSON.stringify(s);},
 writeStatus(){},copyAccountProgress(){},ensureHeroSkill(){},
 syncSavedHomeWallet:l=>{rm.Res[4]=l.player.spirit;rm.Res[3]=l.player.diamond;},shopState:()=>({})});
for(const [start,end] of [['shopTransaction','shopSync'],['shopSync','shopAddItem'],['handleHeroReincarnate','handleHeroPromote']]){
 const a=source.indexOf(`        LocalNative.${start} = function`),b=source.indexOf(`        LocalNative.${end} = function`,a+1);
 assert.ok(a>=0&&b>a);vm.runInContext(source.slice(a,b),ctx);}
function reset(from=10610,lv=50){failWrite=failCallback=false;answers=questCalls=0;ui.playing=true;ui.enabled=false;model=null;
 const hero={sid:'hero',typeid:from,lv,xp:236,spirit:0,unit_mutateid:2,skill_slots:[{sid:7021,lv:3}],
 eqp:[{keep:1}],gift:{lv:2},state:0,aidx:-1,did:'keep-defense'};
 const recipe=ctx.data.hero_evolve[from<10621?10621:10641].item_composition;
 const dict={};for(const [typeid,num] of recipe)dict[`item_${typeid}`]={oid:`item_${typeid}`,typeid,num};
 dict.scroll={oid:'scroll',typeid:3204,num:1};
 pm=new ctx.Comp.PackageManager();pm.package={advanced_prop:{capacity:100,item_dict:dict}};
 pm.init=function(p){this.package=JSON.parse(JSON.stringify(p.package));};
 disk=JSON.stringify({level:{player:{spirit:6179,diamond:176147,package:pm.package,achieve_raw:{hero_reborn_times:7}},
 heros:[hero],units:[],user_config:{keep:1}},receipt:'keep'});
 rm={Res:{3:176147,4:6179},addRes:(amount,type)=>{rm.Res[type]+=amount;}};
 const exp={growthLv:lv,growthXp:236,afterPromote(){this.promoting=false;}};
 unit=new ctx.Unit();Object.assign(unit,{typeid:from,getComponent:()=>exp,dumpParams:()=>({...hero,lv:exp.growthLv,xp:exp.growthXp}),
 destroyComponents(){},destroyRootNode(){},initByServer(h){
 assert.equal(JSON.parse(disk).level.heros[0].typeid,h.typeid,'persist before reconstruction');
 this.typeid=h.typeid;model=ctx.data.unit_main[h.typeid].home_res;exp.growthLv=h.lv;exp.growthXp=h.xp;
 this.componentList={ExpBar:exp};},heroController:{afterPromote(){}}});
 ctx.G_Player=player;return player;}
const player={getComponent:name=>({PackageManager:pm,ResourceManager:rm,QuestManager:{updateCurrent(){questCalls++;}}})[name],
 rpc_c_reincarnate_ans2(d){answers++;if(failCallback)throw Error('callback');ctx.ClientPlayer.prototype.rpc_c_reincarnate_ans2.call(this,d);},
 rpc_c_promote(d){ctx.ClientPlayer.prototype.rpc_c_promote.call(this,d);}};
function request(target=10621,scroll=3204){return {sid:'hero',targetTypeid:target,scroll,
 mtr_list:ctx.data.hero_evolve[target].item_composition.map(([typeid,num])=>({typeid,num,item_num:num}))};}
function count(type){return Object.values(pm.package).flatMap(b=>Object.values(b.item_dict)).filter(x=>x.typeid===type).reduce((a,x)=>a+x.num,0);}
reset();assert.equal(n.handleHeroReincarnate(player,request()),true);
let saved=JSON.parse(disk).level;assert.equal(saved.heros[0].typeid,10621);assert.equal(unit.typeid,10621);
assert.equal(saved.heros[0].lv,50);assert.equal(saved.heros[0].xp,0);assert.equal(model,'unit/ccb/10602.ccbi');
for(const type of [3021,3022,4003,3204])assert.equal(count(type),0);
assert.equal(saved.player.spirit,7264);assert.equal(rm.Res[4],7264,'refund once');assert.equal(answers,1);
assert.equal(saved.player.achieve_raw.hero_reborn_times,7);assert.equal(questCalls,0);
assert.equal(saved.heros[0].skill_slots[0].lv,3);assert.equal(saved.heros[0].unit_mutateid,2);
assert.equal(saved.heros[0].eqp[0].keep,1);assert.equal(saved.heros[0].gift.lv,2);assert.equal(saved.heros[0].did,'keep-defense');
const after=disk;assert.equal(n.handleHeroReincarnate(player,request()),false);assert.equal(disk,after);
reset();assert.equal(n.handleHeroReincarnate(player,request(10621,-1)),true);
assert.equal(JSON.parse(disk).level.heros[0].lv,1);assert.equal(count(3204),1);
reset(10635,70);assert.equal(n.handleHeroReincarnate(player,request(10641,-1)),true);
assert.equal(unit.typeid,10641);assert.equal(model,'unit/ccb/10603.ccbi');
for(const mode of ['missing','write','bad-material','bad-scroll','low-level','wrong-family','skipped-form','stale']){
 reset();const req=request();
 if(mode==='missing')delete pm.package.advanced_prop.item_dict.item_3022;
 if(mode==='write')failWrite=true;
 if(mode==='bad-material')req.mtr_list[0].num=0;
 if(mode==='bad-scroll')req.scroll=3205;
 if(mode==='low-level')unit.getComponent('ExpBar').growthLv=49;
 if(mode==='wrong-family')req.targetTypeid=10521;
 if(mode==='skipped-form')req.targetTypeid=10641;
 if(mode==='stale'){const s=JSON.parse(disk);s.level.heros[0].typeid=10621;disk=JSON.stringify(s);}
 const before=disk;assert.equal(n.handleHeroReincarnate(player,req),false,mode);assert.equal(disk,before,mode);
 assert.equal(unit.typeid,10610);assert.equal(answers,0);assert.equal(ui.playing,false);assert.equal(ui.enabled,true);
}
reset();failCallback=true;assert.equal(n.handleHeroReincarnate(player,request()),false);
assert.equal(JSON.parse(disk).level.heros[0].typeid,10621,'committed result survives callback failure');
const committed=disk;assert.equal(n.handleHeroReincarnate(player,request()),false);assert.equal(disk,committed);
assert.match(source,/methodName === 'rpc_s_reincarnate_hero'/);
console.log('PASS reincarnation: original refund/reconstruction callbacks, two forms, optional scroll, preserved hero data, validation, repeat, save/callback failure.');
