const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
const output = path.resolve(__dirname, '../.local/shop-treasure');
let disk, player, rm, pm, shown, claimed, notices = [], rng = 0.5, failWrite = false;
const ctx = {LocalNative:{}, data:{}, Math:Object.create(Math),
    GS_CURRENT_STAGE:1, GS_STAGE_BUILD:1,
    G_UnitManager:{getUnitBySID(){return null;}},
    G_MainController:{setNotice:n=>notices.push(n)}};
ctx.Math.random = () => rng;
vm.createContext(ctx);
for (const name of ['virtual_item','item','item_input','resource_input','unit_main','unit_battle',
    'skill_data','hero_to_skill','skill_to_hero','period_control','input_event_client','hero_input_client']) {
    vm.runInContext(fs.readFileSync(`${output}/${name}.js`, 'utf8'),ctx);
}
const n=ctx.LocalNative;
Object.assign(n, {
    readRaw:()=>JSON.parse(disk),
    writeRaw:s=>{if(failWrite)throw Error('simulated disk failure');disk=JSON.stringify(s);},
    writeStatus(){}, ensurePlayerSocialFields:p=>{p.achieve_raw=p.achieve_raw||{};},
    defaultStarterHero:()=>({sid:'unused',typeid:10401}),
    copyAccountProgress:(target,p)=>{target.exp=p.exp;target.level=p.level;},
    lookupUnitMain:id=>ctx.data.unit_main[id],
    syncSavedHomeWallet:level=>{rm.Res[3]=level.player.diamond;rm.Res[4]=level.player.spirit;},
});
function load(name,next){
    const a=source.indexOf(`        LocalNative.${name} = function`);
    const b=source.indexOf(`        LocalNative.${next} = function`,a+1);
    assert.ok(a>=0&&b>a);vm.runInContext(source.slice(a,b),ctx);
}
load('grantPveLoot','applyPveItemReward');
load('normalizeHeroSkillSlots','getMaxSunshineCapacity');
load('ensureHeroSkill','makeHomeInitDict');
load('resolveSkillBookReplaceId','isSkillEnforceBook');
load('isSkillEnforceBook','applySkillBookUse');
load('applySkillBookUse','handleShopUseItem');
const a=source.indexOf('        LocalNative.shopPolicy =');
const b=source.indexOf('        LocalNative.handleChangeNickname =',a);
vm.runInContext(source.slice(a,b),ctx);
const json=x=>JSON.parse(JSON.stringify(x));
function reset(){
    const level={player:{level:1,exp:17,diamond:50000,spirit:50,hero_slot_num:1,achieve_raw:{}},
        heros:[{sid:'original',lv:30,typeid:11501}],units:[{sid:1,typeid:20101,sto:{1:0,2:0}}],
        user_config:{rookie0:123},localTutorialEgg:{claimed:true}};
    disk=JSON.stringify({version:1,level,receipt:'preserve'});
    rm={Res:{3:50000,4:50}};
    pm={package:{},init(p){this.package=json(p.package);}};
    const der={event_counters:{},last_update_time:100};
    const stats={};
    player={level:1,exp:17,getComponent:name=>({ResourceManager:rm,PackageManager:pm,
        DailyEventRecorder:der,HeroManager:{getHeroCapacity:()=>JSON.parse(disk).level.player.hero_slot_num},
        AchievementRecorder:stats})[name],
        rpc_c_draw_card:d=>{shown=json(d.ans);},
        rpc_c_gain_drawcard:d=>{claimed=json(d.ans);},
        rpc_c_refresh_daily_event:d=>{const group=ctx.data.period_control[d.event_id].period_type;
            der.event_counters[group]=der.event_counters[group]||{};
            der.event_counters[group][d.event_id]=json(d.event_counter);},
        rpc_c_buy_package_ans:d=>{assert.equal(d.success,true);},
        rpc_c_use_item_ans:d=>{claimed=json(d.ans);}};
    shown=claimed=null;rng=0.5;failWrite=false;
}
function paidDraw(id){rm.Res[3]-=ctx.data.virtual_item[id].lv_up_cost;return n.runShopRequest(player,'rpc_s_drawcard',{buy_id:id,free:false});}
function buy(id,num=1){rm.Res[3]-=ctx.data.virtual_item[id].lv_up_cost*num;return n.runShopRequest(player,'rpc_s_buy_package',{typeid:id,num});}
function findItem(id){for(const [name,p]of Object.entries(pm.package))for(const item of Object.values(p.item_dict))if(item.typeid===id)return {pkgid:['material','based_prop','advanced_prop','formula'].indexOf(name),oid:item.oid,num:1};}
reset();
const pools=json(n.shopHeroPools());
assert.deepEqual(pools.map(p=>p.length),[14,14,14]);
// Every card family and rarity must receive an ordinary skill, including
// both ends of its random pool. Existing skills survive migration unchanged.
for (const pool of pools) for (const entry of pool) for (const random of [0, 0.999999]) {
    rng = random;
    const hero = {typeid: entry.typeid, skill_slots: []};
    assert.equal(n.ensureHeroSkill(hero), true);
    const skill = hero.skill_slots[0];
    assert.ok(ctx.data.hero_to_skill[Math.floor(entry.typeid / 100)].skill_id.includes(skill.sid));
    assert.ok(ctx.data.skill_to_hero[skill.sid].skill_weight_1 > 0);
    assert.equal(skill.lv, 1);
    const saved = JSON.stringify(hero);
    assert.equal(n.ensureHeroSkill(hero), false);
    assert.equal(JSON.stringify(hero), saved);
}
const starter = {sid:'hero_slot_1',typeid:10401,skill_slots:[]};
n.ensureHeroSkill(starter);
assert.equal(starter.skill_id,1000001);
assert.equal(ctx.data.skill_data[starter.skill_id].skill_name,'未成熟的旋风斩');
rng = 0.5;
for(let tier=0;tier<3;tier++)for(const hero of pools[tier]){
    assert.equal(ctx.data.unit_battle[hero.typeid].hero_card_color,[2,3,4][tier]);
    assert.ok(!hero.skill||ctx.data.skill_data[hero.skill]);
}
assert.equal(paidDraw(100),true);
const sid=shown[0][1].sid;
const drawnSkill=JSON.stringify(shown[0][1].skill_slots);
assert.equal(shown[0][1].skill_slots.length,1);
assert.equal(JSON.parse(disk).level.player.diamond,49512,'paid once');
assert.equal(JSON.parse(disk).level.heros.length,1,'open is not claim');
assert.equal(n.shopShowPending(player,JSON.parse(disk).level),true,'restart resumes result');
assert.equal(shown[0][1].sid,sid);
assert.equal(JSON.stringify(shown[0][1].skill_slots),drawnSkill,'restart keeps skill');
// Repeated open while a claim is pending restores the same result and no second debit.
assert.equal(paidDraw(100),true);
assert.equal(JSON.parse(disk).level.player.diamond,49512);
assert.equal(rm.Res[3],49512);
assert.equal(n.handleShopGain(player),true);
assert.equal(JSON.parse(disk).level.heros.length,2);
assert.equal(JSON.parse(disk).level.player.hero_slot_num,2);
assert.equal(n.handleShopGain(player),false);
assert.equal(JSON.parse(disk).level.player.achieve_raw.hero_times,1);
reset();rng=0;
assert.equal(paidDraw(101),true);
assert.equal(shown.length,3);
assert.deepEqual(JSON.parse(disk).level.localShop.pending.cards.map(c=>c.tier),[0,0,1]);
assert.equal(n.handleShopDismiss(player,{index:0}),true);
assert.equal(n.handleShopDismiss(player,{index:0}),false);
assert.equal(rm.Res[4],60);
assert.equal(n.shopShowPending(player,JSON.parse(disk).level),true);
assert.equal(shown.length,2);
assert.equal(n.handleShopDismiss(player,{index:0}),true,'resume maps visible index to remaining card');
assert.equal(n.handleShopGain(player),true);
assert.equal(JSON.parse(disk).level.heros.length,2,'only remaining card was granted');
assert.equal(JSON.parse(disk).level.player.diamond,48712);
reset();rng=0;
for(let i=0;i<20;i++){
    assert.equal(paidDraw(100),true);
    const tier=JSON.parse(disk).level.localShop.pending.cards[0].tier;
    assert.equal(tier,i===19?2:0,'20th draw pity persists across JSON reloads');
    n.handleShopGain(player);
}
reset();
assert.equal(n.runShopRequest(player,'rpc_s_drawcard',{buy_id:100,free:true}),true);
assert.equal(rm.Res[3],50000);
n.handleShopGain(player);
assert.equal(n.runShopRequest(player,'rpc_s_drawcard',{buy_id:100,free:true}),false);
let saved=JSON.parse(disk);saved.level.localShop.freeEggAt-=165601;
saved.level.player.event_counters[5][8033].t-=165601;disk=JSON.stringify(saved);
assert.equal(n.runShopRequest(player,'rpc_s_drawcard',{buy_id:100,free:true}),true);
reset();
for(const roll of [0,0.5,0.999])for(let id=89;id<=97;id++){
    rng=roll;
    assert.equal(buy(id),true,`buy treasure ${id}`);
    const params=findItem(ctx.data.virtual_item[id].item_ID);
    assert.ok(params,`treasure ${id} is in the package`);
    assert.equal(n.runShopRequest(player,'rpc_s_use_item',params),true,`open treasure ${id}: ${notices.at(-1)}`);
    assert.ok(claimed.length>0,'resource or item result is available');
    assert.equal(n.runShopRequest(player,'rpc_s_use_item',params),false,'consumed object cannot be replayed');
}
assert.equal(JSON.parse(disk).receipt,'preserve');
assert.equal(JSON.parse(disk).level.player.exp,17);
assert.equal(JSON.parse(disk).level.user_config.rookie0,123);
assert.equal(JSON.parse(disk).level.player.event_counters[1][8000].c,3);
reset();assert.equal(buy(89),true);
const invalidUse=findItem(1501), beforeInvalid=disk;
assert.equal(n.runShopRequest(player,'rpc_s_use_item',{...invalidUse,num:'invalid'}),false);
assert.equal(disk,beforeInvalid,'invalid quantity cannot consume an owned box');
const full=JSON.parse(disk);
for(const bag of Object.values(full.level.player.package))bag.capacity=Object.keys(bag.item_dict).length;
disk=JSON.stringify(full);n.shopSync(player,full.level);
const beforeFull=disk;
assert.equal(n.runShopRequest(player,'rpc_s_use_item',findItem(1501)),false);
assert.equal(disk,beforeFull,'full reward package preserves the source box');
reset();
assert.equal(buy(89,100),true,'original daily purchase limit');
const limited=disk;
assert.equal(buy(89),false,'daily cap cannot be exceeded');
assert.equal(disk,limited);
assert.equal(rm.Res[3],45000,'rejected purchase refunds stock debit');
reset();
saved=JSON.parse(disk);
rng=0.999;
for(let i=0;i<5;i++)assert.equal(n.shopRollItemEvent(saved.level,9001).length,0);
assert.equal(n.shopRollItemEvent(saved.level,9001).length,1,'local security threshold guarantees result');
assert.equal(saved.level.localShop.itemCounters[9001].misses,0);
saved=JSON.parse(JSON.stringify(saved));
assert.equal(saved.level.localShop.itemCounters[9001].wins,1,'window counter is serialized');
reset();
const before=disk;rm.Res[3]-=50;failWrite=true;
assert.equal(n.runShopRequest(player,'rpc_s_buy_package',{typeid:89,num:1}),false);
assert.equal(disk,before);assert.equal(rm.Res[3],50000,'disk failure restores optimistic payment');
failWrite=false;
// All original treasure alternatives have valid item IDs and quantities.
for(let box=1501;box<=1509;box++)for(let event of ctx.data.item[box].item_getAfterUse){
    while(event){const e=ctx.data.input_event_client[event];
        for(const itemId of e.putin_event_item){const item=ctx.data.item_input[itemId];
            for(const [id,weight]of item.item_random_chance||[])
                if(weight>0)assert.ok(ctx.data.item[id],`configured treasure reward ${id} exists`);
            if(item.item_id)assert.ok(ctx.data.item[item.item_id]);
        }event=e.putin_event_next;
    }
}
reset();
saved=JSON.parse(disk);n.shopAddItem(saved.level,1124,1);disk=JSON.stringify(saved);
n.shopSync(player,saved.level);
assert.equal(n.runShopRequest(player,'rpc_s_use_item',findItem(1124)),true);
assert.equal(shown.length,1);n.handleShopGain(player);
assert.equal(JSON.parse(disk).level.heros.length,2,'inventory egg uses stock claim flow');
// Spirit fragments use the stock batch picker and deterministic 50801 -> 20501 reward.
assert.equal(ctx.data.item[1101].item_getAfterUse[0],50801);
assert.equal(ctx.data.input_event_client[50801].putin_event_resource[0],20501);
assert.equal(ctx.data.resource_input[20501].putin_num,1);
assert.equal(ctx.data.resource_input[20501].putin_resource_type,4);
ctx.Comp={PackageManager:function(){}};
ctx.InputEvent={EventManager:function(){}};
ctx.RES_TYPE_SPIRIT=4;
ctx.ALCHEMY_SECOND_TYPE_PACKAGE=10; ctx.ALCHEMY_SECOND_TYPE_NEWPLAYER_PACKAGE=11;
ctx.UI={Award:{UIID:1},AlchemyInterface:{UIID:2}};
ctx.G_UIManager={get_ui:()=>({afterMergeInputs(){}}),open_ui(){},isUIOpen:()=>false};
function stockFunction(file,start,end) {
    const text=fs.readFileSync(`${__dirname}/disasm/${file}.decompiled.js`,'utf8');
    const a=text.indexOf(start),b=text.indexOf(end,a+start.length);
    assert.ok(a>=0&&b>a); vm.runInContext(text.slice(a,b),ctx);
}
stockFunction('Components','Comp.PackageManager.prototype.useItemAns=', 'Comp.PackageManager.prototype.composeItemInputEvent=');
stockFunction('InputEvent','InputEvent.EventManager.prototype.onGetSpirit=', 'InputEvent.EventManager.prototype.onGetSpiritHero=');
for (const count of [1,100,101,1558,99999]) {
    reset(); saved=JSON.parse(disk); n.shopAddItem(saved.level,1101,count);
    disk=JSON.stringify(saved); n.shopSync(player,saved.level);
    const request={...findItem(1101),num:count};
    const beforeUse=disk;
    for (const invalid of [0,-1,1.5,count+1,'bad']) {
        assert.equal(n.runShopRequest(player,'rpc_s_use_item',{...request,num:invalid}),false);
        assert.equal(disk,beforeUse,'rejected fragment use preserves save');
    }
    failWrite=true;
    assert.equal(n.runShopRequest(player,'rpc_s_use_item',request),false);
    assert.equal(disk,beforeUse,'failed save preserves fragments and spirit');
    failWrite=false;
    // Execute the original acknowledgement and spirit award against the live wallet.
    const stockPm=new ctx.Comp.PackageManager();
    stockPm.getItem=(pkg,oid)=>Object.values(pm.package)[pkg].item_dict[oid];
    stockPm.subItemNumByOid=(pkg,oid,num)=>{stockPm.getItem(pkg,oid).num-=num;};
    stockPm._isItemInLetter=()=>[false];
    ctx.G_Player=player;
    rm.addRes=(amount,type)=>{assert.equal(type,4);rm.Res[type]+=amount;};
    ctx.G_EventManager={mergeInputs:x=>x,inputAward:awards=>{
        for(const [type,amount] of awards){assert.equal(type,11);
            new ctx.InputEvent.EventManager().onGetSpirit(amount);}
    }};
    player.rpc_c_use_item_ans=d=>{claimed=json(d.ans);stockPm.useItemAns(d);};
    assert.equal(n.runShopRequest(player,'rpc_s_use_item',request),true);
    assert.equal(JSON.parse(disk).level.player.spirit,50+count);
    assert.equal(rm.Res[4],50+count,'wallet sync must not double grant');
    assert.deepEqual(claimed,[[11,count]]);
    assert.equal(findItem(1101),undefined);
    assert.equal(n.runShopRequest(player,'rpc_s_use_item',request),false,'no duplicate use');
    assert.equal(JSON.parse(disk).level.player.spirit,50+count);
}
console.log('PASS: spirit fragments 1/100/101/1558/99999, invalid quantities, save failure, debit and wallet reload');
fs.writeFileSync(`${output}/check-result.json`,JSON.stringify({status:'PASS',pools,
    weights:[70,25,5],pity:20,threeDraw:'at least one excellent',freeInterval:165600},null,2));
console.log('PASS: original pools, paid/free single and triple, pending resume/dismiss/claim, pity, nine treasure purchases/opens, inventory egg, rollback and progress retention');
