const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
const level = {player:{diamond:150,spirit:50},heros:[{sid:'hero',state:1,xp:0}],
    units:[{sid:1,typeid:20101,x:28,y:28,bs:2,bt:0,sto:{1:1000,2:1200}}],user_config:{rookie0:123}};
const store={level,starterResGranted:true};
const configs={20101:{lv:1,gold_storage:20000,wood_storage:20000},20102:{lv:2,gold_storage:20000,wood_storage:20000}};
const ctx={LocalNative:{readRaw:()=>store,writeStatus(){},lookupUnitMain:tid=>configs[tid],
    resolveRealTypeID:u=>u.typeid},data:{item_input:{8001:{item_id:1125,item_num:300}},item:{1125:{}}}};
vm.createContext(ctx);
function load(name,next) {
    const a=source.indexOf(`        LocalNative.${name} = function`);
    const b=source.indexOf(`        LocalNative.${next} = function`,a+1);
    assert.ok(a>=0&&b>a);vm.runInContext(source.slice(a,b),ctx);
}
load('toBuildingRecord','unit');
load('snapshotBuildingRecord','persistFinishedUnit');
load('buildFinishSwapParams','unitStillOnMap');
load('grantPveLoot','handleCompletePveBattle');
const holder={currentStorage:{1:731,2:963}};
const comps={ResourceStorage:holder,TileHolder:{getTileCoord:()=>({x:28,y:28})},BuildingBuilder:{state:1,beginTime:123}};
const unit={sid:1,typeid:20101,getComponent:n=>comps[n]};
ctx.BUILD_STATE_FINISH=2;
const payload=ctx.LocalNative.buildFinishSwapParams(unit,20102);
assert.deepEqual(JSON.parse(JSON.stringify(payload.sto)),{1:731,2:963});
assert.equal(payload.typeid,20102);
assert.equal(payload.bs,2);
// Recovered stock ResourceHolder initializer must receive inventory during refresh.
const stock=fs.readFileSync(`${__dirname}/disasm/Components.decompiled.js`,'utf8');
const a=stock.indexOf('Comp.ResourceHolder.prototype.init=');
const b=stock.indexOf('Comp.ResourceHolder.prototype.refreshDisplay=',a);
ctx.Comp={ResourceHolder:function(){}};
ctx.DA={contains:(xs,x)=>xs.includes(x)};
ctx.RES_TYPE_GOLD=2;ctx.RES_TYPE_WOOD=1;
vm.runInContext(stock.slice(a,b),ctx);
const reloaded=new ctx.Comp.ResourceHolder();
reloaded.currentStorage={1:0,2:0};reloaded.registSelf=()=>{};reloaded.refreshDisplay=()=>{};
reloaded.init({},payload);
assert.equal(reloaded.currentStorage[1],731);
assert.equal(reloaded.currentStorage[2],963);
const migrated=ctx.LocalNative.toBuildingRecord({sid:1,typeid:20102,bs:2,goldstorage:731,woodstorage:0});
assert.equal(migrated.sto[2],731);
assert.equal(migrated.sto[1],0,'zero stock is preserved');
ctx.LocalNative.grantPveLoot(200,300,level);
assert.equal(level.units[0].sto[2],1400);
assert.equal(level.units[0].sto[1],1300);
const gains=ctx.LocalNative.applyPveItemReward(level,8001,'1');
assert.equal(gains[0][0],19);
assert.equal(level.player.package.material.item_dict.local_pve_1125.num,300);
ctx.LocalNative.grantPveLoot(50000,50000,level);
assert.equal(level.units[0].sto[2],20000);
assert.equal(level.units[0].sto[1],20000);
const restarted=JSON.parse(JSON.stringify(level));
reloaded.init({},restarted.units[0]);
assert.equal(reloaded.currentStorage[1],20000);
assert.equal(restarted.player.package.material.item_dict.local_pve_1125.num,300);
console.log('PASS: stock storage refresh retains spent balance; loot/items persist across reload and obey capacity');
