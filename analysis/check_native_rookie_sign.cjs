const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(path.join(__dirname, 'native_boot.js'), 'utf8');
const clone = x => JSON.parse(JSON.stringify(x));
const contract = JSON.parse(fs.readFileSync(path.join(__dirname,'rpc-contracts/rookie-sign.json'),'utf8'));
const ctx = {data:clone(contract.original_tables), GS_STAGE_BUILD:1, GS_CURRENT_STAGE:1, LocalNative:{},
    G_UnitManager:{getUnitBySID:()=>null}};
vm.createContext(ctx);
function load(name, next) {
    const a = source.indexOf(`        LocalNative.${name} = function`);
    const b = source.indexOf(`        LocalNative.${next} = function`, a + 1);
    assert.ok(a >= 0 && b > a); vm.runInContext(source.slice(a,b),ctx);
}
load('rookieSignNow','handleTutorialEggDraw');
load('grantPveLoot','handleCompletePveBattle');
load('syncSavedHomeWallet','handleWelcomeLetterReward');
load('saveLevel','mergeUserConfig');
let now = Date.UTC(2026,9,14,12) / 1000;
let disk, rm, components, player, callbackCount, failWrite, failCallback;
const native = ctx.LocalNative;
ctx.DA = {getSystemCurrentTimeSec:()=>now};
native.readRaw = () => clone(disk);
native.writeRaw = value => { if(failWrite) throw Error('write rejected'); disk=clone(value); };
native.writeStatus=()=>{};
native.tryDumpAndSave=()=>false; // Failed snapshots must not lose committed awards.
native.getResourceManager=()=>rm;
native.refreshResHud=()=>{};
native.lookupUnitMain=()=>({wood_storage:20000,gold_storage:20000});
native.defaultStarterHero=()=>({lv:1,unit_mutateid:0,rct:now,aht:now});
native.ensureStarterHeros=()=>{};
function boot(reset=false) {
    if(reset) disk={level:{player:{diamond:150,spirit:50,hero_slot_num:1},
        units:[{sid:1,typeid:20101,sto:{1:0,2:0}}],heros:[{sid:'original'}]}};
    rm={Res:{1:0,2:0,3:disk.level.player.diamond,4:disk.level.player.spirit}};
    components={SignReward:{},DailyEventRecorder:{event_counters:{},
        refreshDailyEvent(d){this.event_counters[1] ||= {};this.event_counters[1][d.event_id]=clone(d.event_counter);}},
        PackageManager:{package:clone(disk.level.player.package || {}),init(p){this.package=clone(p.package);}}};
    player={getComponent:n=>components[n],rpc_c_get_rookie_sign_reward_ans(d){
        callbackCount++;
        if(failCallback) throw Error('UI interrupted');
        for(const [type,value] of d.reward) {
            if(type===4) rm.Res[3]+=value;
            if(type===11) rm.Res[4]+=value;
            if(type===19) for(const item of value) {
                const pkgName=['material','based_prop','advanced_prop','formula'][ctx.data.item[item.typeid].item_type || 0];
                const bag=components.PackageManager.package[pkgName].item_dict;
                bag[item.oid]={...clone(item),num:(bag[item.oid]?.num || 0)+item.num};
            }
        }
    }};
    ctx.G_Player=player;
    const s=native.readRaw();native.ensureRookieSign(s.level);native.writeRaw(s);
    native.syncRookieSign(player,s.level);
}
callbackCount=0; boot(true);
assert.equal(disk.level.player.rookie_days,1);
assert.equal(components.SignReward.newRookieReward,true);
assert.equal(ctx.data.period_control[8301].num_limit,1);
assert.equal(ctx.data.period_control[8301].period_type,1);
assert.equal(native.handleRookieSignReward(player),true);
assert.equal(disk.level.player.diamond,200);
assert.equal(rm.Res[3],200,'stock callback must not double credit');
assert.equal(disk.level.player.package.material.item_dict.local_pve_100101.num,3);
assert.equal(components.PackageManager.package.material.item_dict.local_pve_100101.num,3);
assert.equal(disk.level.player.rookie_days,2);
assert.equal(components.SignReward.newRookieReward,false);
components.SignReward.rookie_days++; // Reproduce original optimistic increment.
assert.equal(native.handleRookieSignReward(player),false);
assert.equal(components.SignReward.rookie_days,2);
assert.equal(callbackCount,1);
boot();assert.equal(native.handleRookieSignReward(player),false,'restart cannot claim twice');
now+=3*86400; boot();assert.equal(disk.level.player.rookie_days,2,'missed days never skip rewards');
for(let day=2;day<=7;day++) {
    const previous=clone(disk);
    if(day===2) {
        failWrite=true; assert.throws(()=>native.handleRookieSignReward(player),/write rejected/);
        failWrite=false; assert.deepEqual(disk,previous,'failed write is atomic');
        const cfg=ctx.data.input_event_client[55513];delete ctx.data.input_event_client[55513];
        assert.throws(()=>native.handleRookieSignReward(player),/Missing rookie reward event/);
        assert.deepEqual(disk,previous,'missing data cannot persist a partial reward');
        ctx.data.input_event_client[55513]=cfg;
    }
    assert.equal(native.handleRookieSignReward(player),true);
    assert.equal(native.handleRookieSignReward(player),false);
    now+=86400;boot();
}
assert.equal(disk.level.player.diamond,430);
assert.equal(disk.level.player.spirit,300);
assert.equal(rm.Res[3],430);assert.equal(rm.Res[4],300);
assert.equal(disk.level.heros.length,3);
assert.equal(disk.level.heros[1].hero_id,10801);assert.equal(disk.level.heros[1].lv,1);
assert.equal(disk.level.heros[2].hero_id,10510);assert.equal(disk.level.heros[2].lv,30);
assert.equal(disk.level.player.hero_slot_num,3);
assert.equal(disk.level.player.package.material.item_dict.local_pve_2301.num,6);
assert.equal(Object.keys(disk.level.localRookieSign.receipts).length,7);
assert.equal(disk.level.player.rookie_days,8);
assert.equal(components.SignReward.newRookieReward,false);
assert.equal(native.handleRookieSignReward(player),false);
const heroReceipt=disk.level.localRookieSign.receipts[2].reward;
assert.ok(heroReceipt.some(r=>r[0]===0&&r[1].hero_id===10801),'visible hero card');
assert.ok(heroReceipt.some(r=>r[0]===29&&r[1].hero_id===10801),'original hero creation');
now-=20*86400;boot();assert.equal(native.handleRookieSignReward(player),false,'clock rollback cannot replay claims');
now+=25*86400;boot(true);failCallback=true;
assert.throws(()=>native.handleRookieSignReward(player),/UI interrupted/);
failCallback=false;
assert.equal(disk.level.player.diamond,200);assert.equal(rm.Res[3],200);
boot();assert.equal(native.handleRookieSignReward(player),false,'saved award survives interrupted UI');
now+=86400;boot();ctx.GS_CURRENT_STAGE=2;
assert.equal(native.handleRookieSignReward(player),false,'no claims during battle');
ctx.GS_CURRENT_STAGE=1;
let unlocked=false, currentUI=1, opens=[];
ctx.Rookie={isRookieCodeFinished:()=>unlocked};ctx.ROOKIE_CODE_SIGN_AWARD=1001;
ctx.UI={Reward:{RewardInterface:{UIID:230000}}};
ctx.G_UIManager={getCurrentUIIDForRookie:()=>currentUI,get_ui:()=>({open:p=>opens.push(p)})};
const gc={curRookies:{},allRookies:{}};
assert.equal(native.maybeShowRookieSign(player,gc),false,'tutorial lock respected');
unlocked=true;currentUI=9;assert.equal(native.maybeShowRookieSign(player,gc),false,'do not interrupt another UI');
currentUI=1;gc.firstMovie={};assert.equal(native.maybeShowRookieSign(player,gc),false);
delete gc.firstMovie;
gc.curRookies={1:{curProcesses:{100:{avataNode:{getParent:()=>({}),isVisible:()=>true}}}}};
gc.allRookies={1:{processes:{100:{rookie_text:'story'}}}};
assert.equal(native.maybeShowRookieSign(player,gc),false,'active story respected');
gc.curRookies[1].curProcesses[100]={};
assert.equal(native.maybeShowRookieSign(player,gc),true,'pending guide with no displayed node cannot block');
assert.deepEqual(opens,['RookieSign']);assert.equal(native.maybeShowRookieSign(player,gc),false);
boot();assert.equal(native.maybeShowRookieSign(player,gc),false,'prompt receipt survives restart');
const beforeSnapshot=clone(disk.level);
native.saveLevel({player:{},units:clone(beforeSnapshot.units),heros:[]});
assert.equal(disk.level.player.diamond,beforeSnapshot.player.diamond);
assert.equal(disk.level.player.spirit,beforeSnapshot.player.spirit);
assert.deepEqual(disk.level.player.package,beforeSnapshot.player.package);
assert.deepEqual(disk.level.localRookieSign.receipts,beforeSnapshot.localRookieSign.receipts);
assert.equal(disk.level.player.rookie_days,2,'partial snapshot preserves authoritative day');
assert.equal(disk.level.player.event_counters[1][8301].c,0,'next-date snapshot retains eligibility');
console.log('PASS: original seven-day rewards, atomic persistence, repeat/restart protection, rollover/gaps, heroes/items, stage/tutorial/UI gates');
