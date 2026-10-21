// Execute the recovered stock item acknowledgement and building-time award.
const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const src = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
const components = fs.readFileSync(`${__dirname}/disasm/Components.decompiled.js`, 'utf8');
const events = fs.readFileSync(`${__dirname}/disasm/InputEvent.decompiled.js`, 'utf8');
let clock = 1000000, disk, building, queue, finishes;
const n = {pendingBuilds:{}, shopPolicy:{maxBatch:100}};
const ctx = {LocalNative:n, data:{}, Comp:{BuildingBuilder:function(){}, PackageManager:function(){}},
    InputEvent:{EventManager:function(){}}, GS_CURRENT_STAGE:1, GS_STAGE_BUILD:1, BUILD_STATE_BUILDING:1,
    DA:{getSystemCurrentTimeSec:()=>clock, checkCurrentStage:()=>true,
        GETCGC:()=>({getSelectedTarget:()=>null})},
    G_UnitManager:{getUnitBySID:sid=>String(sid)==='b1'?building:null},
    G_EffectManager:{playEffectOnce(){}}, RS:{REDUCE_BUILD_FX:'reduce'},
    G_UIManager:{isUIOpen:()=>false}, UI:{AlchemyInterface:{UIID:1}}};
vm.createContext(ctx);
for (const name of ['item','input_event_client','resource_input'])
    vm.runInContext(fs.readFileSync(`${__dirname}/../.local/shop-treasure/${name}.js`,'utf8'),ctx);
function stock(text, start, end) {
    const a=text.indexOf(start), b=text.indexOf(end,a+start.length);
    assert.ok(a>=0&&b>a,start); vm.runInContext(text.slice(a,b),ctx);
}
stock(components,'Comp.BuildingBuilder.prototype.reduceBuildTime=', 'Comp.ShadowHolder=');
stock(components,'Comp.PackageManager.prototype.useItemAns=', 'Comp.PackageManager.prototype.');
stock(events,'InputEvent.EventManager.prototype.onGetBuildTime=', 'InputEvent.EventManager.prototype.onGetHero=');
const a=src.indexOf('        LocalNative.applyBuildTimeUse = function');
const b=src.indexOf('        LocalNative.runShopRequest = function',a);
vm.runInContext(src.slice(a,b),ctx);
n.getBuildingBuilder=u=>u.builder;
n.shopTransaction=p=>JSON.parse(JSON.stringify(p.store));
n.shopState=()=>({}); n.isHeroFeedUse=()=>false;
n.resolveSkillBookReplaceId=()=>0; n.isSkillEnforceBook=()=>false;
n.writeRaw=s=>{disk=JSON.parse(JSON.stringify(s));};
n.shopSync=(p,level)=>{p.store={level:JSON.parse(JSON.stringify(level))};};
n.scheduleOnRoot=(fn,delay)=>queue.push({fn,delay});
n.ackBuildComplete=(p,sid)=>{finishes++;building.builder.state=2;};
let received;
const eventManager = new ctx.InputEvent.EventManager();
ctx.G_EventManager={mergeInputs:()=>[],inputAward:awards=>{
    received=awards;
    for(const [type,award] of awards) {
        assert.equal(type,23); eventManager.onGetBuildTime(award);
    }
}};
function setup(typeid=1113, remaining=50000, count=3) {
    queue=[];finishes=0;disk=null;received=null;n.pendingBuilds={};clock=1000000;
    const bb=new ctx.Comp.BuildingBuilder();
    Object.assign(bb,{state:1,beginTime:clock-1000,buildTime:remaining+1000,
        _update(){this.updated=true;},_scheduleNotification(){this.notified=true;}});
    building={sid:'b1',volume:0,builder:bb,getComponent:()=>bb,getPosition:()=>({x:0,y:0})};bb.master=building;
    const player={store:{level:{units:[{sid:'b1',typeid:20601,bs:1,bt:bb.beginTime}],player:{package:{
        material:{item_dict:{crystal:{typeid,num:count}}}
    }}}}};
    const pm=new ctx.Comp.PackageManager();
    pm.getItem=()=>({});pm._isItemInLetter=()=>[false];
    pm.subItemNumByOid=(pkgid,oid,num)=>{
        assert.equal(disk.level.player.package.material.item_dict.crystal?.num||0,count-num);
        assert.equal(disk.level.units[0].bt,bb.beginTime-receivedReduce);
    };
    player.rpc_c_use_item_ans=ans=>pm.useItemAns(ans);
    return player;
}
let receivedReduce;
function use(player,num=1,sid='b1') {
    return n.handleShopUseItem(player,{pkgid:0,oid:'crystal',num,params:{sid}});
}
for(const [typeid,seconds] of [[1113,10800],[1114,32400],[1115,86400]]) {
    const p=setup(typeid,100000);receivedReduce=seconds;
    assert.equal(use(p),true);
    assert.equal(received[0][1].reduce_time,seconds);
    assert.equal(building.builder.beginTime,disk.level.units[0].bt);
    assert.ok(building.builder.updated&&building.builder.notified);
    assert.equal(queue[0].delay,100000-seconds);
    assert.equal(finishes,0);
    // The persisted bt restores the same remaining time on a fresh client.
    assert.equal(clock-disk.level.units[0].bt,1000+seconds);
    clock+=queue[0].delay;queue[0].fn();assert.equal(finishes,1);
}
let p=setup(1113,500);receivedReduce=10800;
use(p);assert.equal(queue[0].delay,0);queue[0].fn();assert.equal(finishes,1);
p=setup(1113,50000);receivedReduce=21600;use(p,2);
assert.equal(received[0][1].reduce_time,21600);
for(const invalid of ['missing','finished','expired','stock','quantity','config']) {
    p=setup();receivedReduce=10800;
    if(invalid==='finished')building.builder.state=2;
    if(invalid==='expired')building.builder.beginTime=clock-building.builder.buildTime;
    if(invalid==='config')ctx.data.resource_input[20601].putin_resource_type=10;
    assert.throws(()=>use(p,invalid==='stock'?4:invalid==='quantity'?0:1,invalid==='missing'?'other':'b1'));
    assert.equal(disk,null);assert.equal(queue.length,0);
    ctx.data.resource_input[20601].putin_resource_type=11;
}
// A cancelled/restarted upgrade must not be completed by its old timer.
p=setup();receivedReduce=10800;use(p);
const timer=queue[0];building.builder.beginTime+=5;clock+=timer.delay;timer.fn();
assert.equal(finishes,0);
console.log('PASS: all three crystal tiers, stock award chain, durable debit/clock, partial and full finish, invalid requests, stale timer');
