const fs=require('node:fs'), vm=require('node:vm'), assert=require('node:assert/strict');
const source=fs.readFileSync(`${__dirname}/native_boot.js`,'utf8');
let disk, pm, failed=false, answers=0, effects=0, refreshed=0, heroMode=false;
const ui={playing:true,refreshButtonGray(){this.enabled=true;},afterReceComposeResult(){effects++;}};
const ctx={LocalNative:{},data:{},GS_CURRENT_STAGE:1,GS_STAGE_BUILD:1,
 G_UnitManager:{getUnitBySID(){return null;}},
 UI:{AlchemyCompound:{UIID:1},AlchemyInterface:{UIID:2},HeroReincarnation:{UIID:3}},
 G_UIManager:{isUIOpen:id=>id!==2&&(!heroMode||id!==3),get_ui:id=>id===1?ui:{afterReceComposeResult(){
 assert.equal(count(2021),5,'hero UI sees consumed materials');refreshed++;}}},
 G_MainController:{setNotice(){}},Comp:{PackageManager:function(){}},ClientPlayer:function(){}};
vm.createContext(ctx);
for(const name of ['item','item_input','input_event_client'])
 vm.runInContext(fs.readFileSync(`${__dirname}/../.local/shop-treasure/${name}.js`,'utf8'),ctx);
const n=ctx.LocalNative;
Object.assign(n,{readRaw:()=>JSON.parse(disk),writeRaw:s=>{if(failed)throw Error('disk');disk=JSON.stringify(s);},
 copyAccountProgress(){},writeStatus(){},unlockHeroFeedIfNeeded(){},syncSavedHomeWallet(){}});
vm.runInContext(source.slice(source.indexOf('        LocalNative.shopPolicy ='),
 source.indexOf('        // Stock Trader UI')),ctx);
function stock(file,start,end){const s=fs.readFileSync(`${__dirname}/disasm/${file}.decompiled.js`,'utf8');
 const a=s.indexOf(start),b=s.indexOf(end,a+start.length);assert.ok(a>=0&&b>a);vm.runInContext(s.slice(a,b),ctx);}
stock('Components','Comp.PackageManager.prototype.composeItemAns2=', 'Comp.PackageManager.prototype.getItemAchieveMethod=');
stock('ClientPlayer','ClientPlayer.prototype.rpc_c_compose_item_ans2=', 'ClientPlayer.prototype.',);
const player={getComponent:name=>name==='PackageManager'?pm:name==='ResourceManager'?{Res:{3:100,4:50}}:null,
 rpc_c_compose_item_ans2(d){answers++;ctx.ClientPlayer.prototype.rpc_c_compose_item_ans2.call(this,d);}};
ctx.G_EventManager={inputAward(ans){assert.equal(ans[0][0],19);for(const item of ans[0][1]){
 const bag=pm.package.advanced_prop.item_dict;const old=bag[item.oid];
 bag[item.oid]={...item,num:(old?old.num:0)+item.num};}}};
function reset(split=false){answers=effects=refreshed=0;failed=false;ui.playing=true;ui.enabled=false;
 pm={package:{based_prop:{capacity:100,item_dict:split?{a:{oid:'a',typeid:2021,num:20},b:{oid:'b',typeid:2021,num:15}}:
 {a:{oid:'a',typeid:2021,num:35}}},advanced_prop:{capacity:100,item_dict:{}}},
 composeItemAns2:ctx.Comp.PackageManager.prototype.composeItemAns2,
 init(p){this.package=JSON.parse(JSON.stringify(p.package));}};
 disk=JSON.stringify({level:{player:{package:pm.package},units:[],heros:[{sid:'keep'}]},receipt:'keep'});}
function count(type){return Object.values(pm.package).flatMap(b=>Object.values(b.item_dict)).filter(i=>i.typeid===type).reduce((a,i)=>a+i.num,0);}
const req={product_id:3021,mtr_list:[{typeid:2021,num:30,item_num:35}]};
for(const split of [false,true]){reset(split);assert.equal(n.runShopRequest(player,'rpc_s_compose_item_inputevent',req),true);
 assert.equal(count(2021),5);assert.equal(count(3021),1);assert.equal(answers,1);assert.equal(effects,1);assert.equal(refreshed,1);
 assert.equal(JSON.parse(disk).receipt,'keep');assert.equal(JSON.parse(disk).level.heros[0].sid,'keep');
 const saved=disk;assert.equal(n.runShopRequest(player,'rpc_s_compose_item_inputevent',req),false);assert.equal(disk,saved);}
for(const input of [{...req,mtr_list:[]},{...req,mtr_list:[{typeid:2021,num:1}]},
 {...req,mtr_list:[{typeid:2022,num:30}]},{...req,product_id:4041}]){
 reset();const before=disk;assert.equal(n.runShopRequest(player,'rpc_s_compose_item_inputevent',input),false);
 assert.equal(disk,before);assert.equal(count(2021),35);assert.equal(answers,0);assert.equal(ui.playing,false);}
reset();failed=true;const before=disk;
assert.equal(n.runShopRequest(player,'rpc_s_compose_item_inputevent',req),false);
assert.equal(disk,before);assert.equal(count(2021),35);assert.equal(count(3021),0);assert.equal(answers,0);
assert.equal(ui.playing,false);assert.equal(ui.enabled,true);
assert.match(source,/methodName === 'rpc_s_compose_item_inputevent'/);
console.log('Item compose: stock answer/UI, 35 -> 5 + product, split stacks, validation, repeat and write failure passed.');

// Hero recipes must grant a capsule through the stock callback, not a pseudo item.
heroMode=true;
for(const name of ['hero_input_client','unit_main','unit_battle','skill_data','hero_to_skill','skill_to_hero'])
 vm.runInContext(fs.readFileSync(`${__dirname}/../.local/shop-treasure/${name}.js`,'utf8'),ctx);
Object.assign(n,{defaultStarterHero:()=>({}),lookupUnitMain:id=>ctx.data.unit_main[id],
 ensurePlayerSocialFields:p=>{p.achieve_raw=p.achieve_raw||{};}});
function load(name,next){const a=source.indexOf(`        LocalNative.${name} = function`),
 b=source.indexOf(`        LocalNative.${next} = function`,a+1);assert.ok(a>=0&&b>a);vm.runInContext(source.slice(a,b),ctx);}
load('normalizeHeroSkillSlots','getMaxSunshineCapacity');load('ensureHeroSkill','makeHomeInitDict');
ctx.InputEvent={EventManager:function(){}};
stock('InputEvent','InputEvent.EventManager.prototype.onGetCapsule=', 'InputEvent.EventManager.prototype.getProbableRewards=');
let liveHeroes,capacity;
const hm={getHeroCapacity:()=>capacity,inputHeroSlot:n=>{capacity+=n;},addNewHero(){},
 createHero(h){assert.ok(!liveHeroes.some(x=>x.sid===h.sid));liveHeroes.push(JSON.parse(JSON.stringify(h)));return {setSid(){}};}};
const getComponent=player.getComponent;
player.getComponent=name=>name==='HeroManager'?hm:name==='QuestManager'?{updateCurrent(){}}:
 name==='LetterManager'?{updateLetter(){}}:getComponent(name);
ctx.G_Player=player;ctx.DA={getGameController:()=>({menu:{refreshHeroPrompt(){}}})};
ctx.G_EventManager={inputAward(ans){assert.equal(ans[0][0],29);
 ctx.InputEvent.EventManager.prototype.onGetCapsule.call(this,ans[0][1]);}};
const recipes=Object.entries(ctx.data.item).filter(([id,cfg])=>
 cfg.item_composition?.length&&ctx.data.input_event_client[cfg.item_composition_get?.[0]]?.putin_event_hero?.length);
assert.equal(recipes.length,14);
function resetHero(cfg,qty=85,slots=1){reset();liveHeroes=[];capacity=slots;
 pm.package.based_prop.item_dict={a:{oid:'a',typeid:cfg.item_composition[0][0],num:qty}};
 const s=JSON.parse(disk);s.level.player.package=pm.package;s.level.player.hero_slot_num=slots;disk=JSON.stringify(s);}
for(const [id,cfg] of recipes){const type=cfg.item_composition[0][0],req={product_id:Number(id),mtr_list:[{typeid:type,num:80}]};
 for(const slots of [1,10]){resetHero(cfg,85,slots);
 assert.equal(n.runShopRequest(player,'rpc_s_compose_item_inputevent',req),true);
 const s=JSON.parse(disk),h=s.level.heros[1],event=ctx.data.input_event_client[cfg.item_composition_get[0]];
 assert.equal(h.typeid,ctx.data.hero_input_client[event.putin_event_hero[0]].putin_team1[0]);
 assert.equal(h.lv,1);assert.ok(h.skill_slots.length);assert.equal(count(type),5);assert.equal(count(Number(id)),0);
 assert.equal(s.level.heros.length,2);assert.equal(liveHeroes.length,1);assert.equal(liveHeroes[0].sid,h.sid);
 assert.equal(capacity,Math.max(slots,2));assert.equal(s.level.player.hero_slot_num,capacity);
 assert.equal(s.level.player.achieve_raw.hero_times,1);assert.equal(answers,1);assert.equal(effects,1);
 const saved=disk;assert.equal(n.runShopRequest(player,'rpc_s_compose_item_inputevent',req),false);assert.equal(disk,saved);
 assert.equal(liveHeroes.length,1);}
 resetHero(cfg,79);let before=disk;assert.equal(n.runShopRequest(player,'rpc_s_compose_item_inputevent',req),false);
 assert.equal(disk,before);assert.equal(liveHeroes.length,0);
 resetHero(cfg);failed=true;before=disk;assert.equal(n.runShopRequest(player,'rpc_s_compose_item_inputevent',req),false);
 assert.equal(disk,before);assert.equal(liveHeroes.length,0);assert.equal(count(type),85);assert.equal(ui.playing,false);
 resetHero(cfg,165);for(let i=0;i<2;i++)assert.equal(n.runShopRequest(player,'rpc_s_compose_item_inputevent',req),true);
 assert.equal(liveHeroes.length,2);assert.notEqual(liveHeroes[0].sid,liveHeroes[1].sid);assert.equal(count(type),5);
}
console.log('Hero compose: all 14 stock recipes, skills, capsule callback, slots, persistence, insufficient/repeat/write failure passed.');

