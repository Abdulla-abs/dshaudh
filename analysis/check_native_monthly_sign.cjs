const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
const clone = x => JSON.parse(JSON.stringify(x));
const original = JSON.parse(fs.readFileSync(`${__dirname}/rpc-contracts/rookie-sign.json`,'utf8')).original_tables;
const ctx = {LocalNative:{},data:clone(original),GS_STAGE_BUILD:1,GS_CURRENT_STAGE:1};
vm.createContext(ctx);
function load(name,next) {
    const start=source.indexOf(`        LocalNative.${name} = function`);
    const end=source.indexOf(`        LocalNative.${next} = function`,start+1);
    assert.ok(start>=0&&end>start);vm.runInContext(source.slice(start,end),ctx);
}
load('rookieSignNow','handleTutorialEggDraw');
load('saveLevel','mergeUserConfig');
let now=Date.UTC(2026,9,14,12)/1000,disk,rm,player,der,sr,failWrite=false,failCallback=false,calls=0;
const native=ctx.LocalNative;
ctx.DA={getSystemCurrentTimeSec:()=>now};
native.readRaw=()=>clone(disk);
native.writeRaw=s=>{if(failWrite)throw Error('disk full');disk=clone(s);};
native.writeStatus=()=>{};native.tryDumpAndSave=()=>false;
native.refreshResHud=()=>{};native.ensureStarterHeros=()=>{};
native.getResourceManager=()=>rm;
function boot(reset=false) {
    if(reset)disk={level:{player:{diamond:300,spirit:150},units:[{sid:1}],heros:[]}};
    rm={Res:{3:disk.level.player.diamond}};
    der={event_counters:{},refreshDailyEvent(d){
        const type=d.event_id===2003||d.event_id===3010||d.event_id===8301?1:3;
        this.event_counters[type] ||= {}; this.event_counters[type][d.event_id]=clone(d.event_counter);
    }};
    sr={};player={getComponent:n=>n==='DailyEventRecorder'?der:n==='SignReward'?sr:null,
        rpc_c_refresh_daily_event:d=>der.refreshDailyEvent(d),resetCurDiamond(){this.diamond=rm.Res[3];},
        rpc_c_get_sign_reward_ans(d){calls++;if(failCallback)throw Error('UI interrupted');
            for(const [type,amount] of d.reward){assert.equal(type,4);rm.Res[3]+=amount;}}};
    const s=native.readRaw();native.syncMonthlySign(player,s.level);native.writeRaw(s);
}
function request(day=1,month=new Date(now*1000).getUTCMonth()+1){return {month,day};}
boot(true);
const sevenBefore=clone(ctx.data.sevendays);
assert.equal(sr.newDailySignReward,true);
assert.equal(der.event_counters[3][2002].d.month,10);
assert.equal(ctx.data.daily_register[1001].dr_putin,990100001);
assert.equal(ctx.data.resource_input[990100001].putin_num,1000000);
for(let month=1;month<=12;month++) {
    const length=new Date(Date.UTC(2026,month,0)).getUTCDate();
    for(let day=1;day<=length;day++)assert.ok(ctx.data.daily_register[month*100+day]);
    if(length<31)assert.equal(ctx.data.daily_register[month*100+length+1],undefined);
}
assert.equal(native.handleMonthlySignReward(player,request(2)),false,'cannot claim future reward');
assert.equal(native.handleMonthlySignReward(player,request(1,9)),false,'stale month rejected');
assert.equal(native.handleMonthlySignReward(player,{}),false,'missing fields rejected');
rm.Res[3]=250; // Spending survived in runtime but the home snapshot failed.
failWrite=true;assert.throws(()=>native.handleMonthlySignReward(player,request()),/disk full/);failWrite=false;
assert.equal(disk.level.player.diamond,300);assert.equal(calls,0,'no UI or currency before durable write');
assert.equal(native.handleMonthlySignReward(player,request()),true);
assert.equal(disk.level.player.diamond,1000250,'preserve spent wallet, add exactly 1000000');
assert.equal(rm.Res[3],1000250);assert.equal(player.diamond,1000250);
assert.equal(sr.newDailySignReward,false);
assert.equal(der.event_counters[1][2003].c,1);
assert.equal(der.event_counters[3][2002].c,1);
assert.equal(native.handleMonthlySignReward(player,request()),false);
assert.equal(native.handleMonthlySignReward(player,request(2)),false,'only once per calendar day');
boot();assert.equal(native.handleMonthlySignReward(player,request(2)),false,'restart cannot duplicate');
now+=4*86400;boot();assert.equal(native.handleMonthlySignReward(player,request(2)),true,'missed dates retain next slot');
assert.equal(disk.level.player.diamond,2000250);
now-=2*86400;boot();assert.equal(native.handleMonthlySignReward(player,request(3)),false,'clock rollback denied');
now=Date.UTC(2026,10,1,12)/1000;boot();
assert.equal(der.event_counters[3][2002].c,0,'new month starts at zero');
assert.equal(der.event_counters[3][2002].d.month,11);
assert.equal(native.handleMonthlySignReward(player,request(1,10)),false);
assert.equal(native.handleMonthlySignReward(player,request(1,11)),true);
assert.equal(disk.level.localMonthlySign.months['2026-10'].claimedDays,2,'prior receipts retained');
now=Date.UTC(2027,0,1,12)/1000;boot();
assert.equal(native.handleMonthlySignReward(player,request()),true,'year transition');
now=Date.UTC(2028,1,1,12)/1000;boot();
assert.ok(ctx.data.daily_register[229]);assert.equal(ctx.data.daily_register[230],undefined);
for(let day=1;day<=29;day++) {
    assert.equal(native.handleMonthlySignReward(player,request(day,2)),true);
    assert.equal(native.handleMonthlySignReward(player,request(day,2)),false);
    if(day<29){now+=86400;boot();}
}
assert.equal(disk.level.localMonthlySign.months['2028-02'].claimedDays,29);
assert.equal(sr.newDailySignReward,false);
now=Date.UTC(2029,1,1,12)/1000;boot();assert.equal(ctx.data.daily_register[229],undefined,'remove old leap-day entry');
ctx.GS_CURRENT_STAGE=2;assert.equal(native.handleMonthlySignReward(player,request()),false);
ctx.GS_CURRENT_STAGE=1;failCallback=true;
assert.throws(()=>native.handleMonthlySignReward(player,request()),/UI interrupted/);failCallback=false;
assert.equal(rm.Res[3],disk.level.player.diamond,'interrupted UI reconciles durable currency');
boot();assert.equal(native.handleMonthlySignReward(player,request(2)),false);
const old=clone(disk.level);
native.saveLevel({player:{},units:clone(old.units),heros:[]});
assert.deepEqual(disk.level.localMonthlySign,old.localMonthlySign);
assert.equal(disk.level.player.diamond,old.player.diamond,'partial snapshot retains award balance');
native.refreshMonthlySign(player,true);
assert.equal(disk.level.localMonthlySign.showDay,Math.floor(now/86400));
assert.equal(der.event_counters[1][3010].c,1);
assert.equal(der.event_counters[3][2111].c,31,'unrecovered paid retroactive path cannot bypass receipts');
assert.deepEqual(ctx.data.sevendays,sevenBefore,'seven-day reward table unchanged');
console.log('PASS: 1000000/day, original preview/RPC counters, atomic/restart-safe grants, spent balance, month/year/leap rollover and independent seven-day rewards');
