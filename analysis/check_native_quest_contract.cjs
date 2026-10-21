const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
const tables = path.resolve(__dirname, '../.local/shop-treasure');
const questTables = path.resolve(__dirname, '../.local/quest');
let disk, player, rm, pm, der, qm, ans, refreshed = [];
const ctx = {
    LocalNative: {}, data: {}, Math,
    GS_CURRENT_STAGE: 1, GS_STAGE_BUILD: 1,
    G_UnitManager: {getUnitBySID() { return null; }},
    G_MainController: {setNotice() {}}
};
vm.createContext(ctx);
for (const name of ['item', 'item_input', 'resource_input', 'period_control',
    'input_event_client', 'unit_main']) {
    vm.runInContext(fs.readFileSync(`${tables}/${name}.js`, 'utf8'), ctx);
}
for (const name of ['daily_task', 'main_task']) {
    vm.runInContext(fs.readFileSync(`${questTables}/${name}.js`, 'utf8'), ctx);
}
const n = ctx.LocalNative;
Object.assign(n, {
    readRaw: () => JSON.parse(disk),
    writeRaw: s => { disk = JSON.stringify(s); },
    writeStatus() {},
    copyAccountProgress(target, p) { target.exp = p.exp; target.level = p.level; },
    lookupUnitMain: id => ctx.data.unit_main[id] || {gold_storage: 50000, wood_storage: 50000},
    syncSavedHomeWallet(level) {
        rm.Res[3] = level.player.diamond;
        rm.Res[4] = level.player.spirit;
    },
    snapshotBuildingRecord: u => u
});
function load(name, next) {
    const a = source.indexOf(`        LocalNative.${name} = function`);
    const b = source.indexOf(`        LocalNative.${next} = function`, a + 1);
    assert.ok(a >= 0 && b > a, name);
    vm.runInContext(source.slice(a, b), ctx);
}
load('grantPveLoot', 'applyPveItemReward');
const shopA = source.indexOf('        LocalNative.shopPolicy =');
const shopB = source.indexOf('        LocalNative.handleChangeNickname =', shopA);
vm.runInContext(source.slice(shopA, shopB), ctx);

function reset() {
    const level = {
        player: {
            level: 2, exp: 10, diamond: 500, spirit: 50,
            event_counters: {
                1: {
                    2004: {c: 0, t: 1, d: {current: {3801: {mt_coin: 2000}}}, clientData: {}},
                    2013: {c: 0, t: 1, d: {current: {3811: {mt_tasknum: 0}}}, clientData: {}}
                }
            },
            main_quest: {
                300201: {current: {300201: {mt_baselv: 1}}}
            },
            package: {material: {item_dict: {}, capacity: 100, new_items: 0},
                based_prop: {item_dict: {}, capacity: 100, new_items: 0},
                advanced_prop: {item_dict: {}, capacity: 100, new_items: 0},
                formula: {item_dict: {}, capacity: 100, new_items: 0}}
        },
        units: [{sid: 1, typeid: 20101, sto: {1: 1000, 2: 1000}}],
        heros: []
    };
    disk = JSON.stringify({version: 1, level});
    rm = {Res: {1: 1000, 2: 1000, 3: 500, 4: 50}};
    pm = {package: JSON.parse(JSON.stringify(level.player.package)),
        init(p) { this.package = JSON.parse(JSON.stringify(p.package)); }};
    der = {event_counters: JSON.parse(JSON.stringify(level.player.event_counters)),
        last_update_time: 1};
    qm = {main_quest: JSON.parse(JSON.stringify(level.player.main_quest)),
        finish_main_quest_timestamp: 0};
    ans = null;
    refreshed = [];
    player = {
        level: 2, exp: 10,
        getComponent(name) {
            return ({ResourceManager: rm, PackageManager: pm,
                DailyEventRecorder: der, QuestManager: qm})[name];
        },
        rpc_c_finish_daily_quest_ans(d) { ans = JSON.parse(JSON.stringify(d)); },
        rpc_c_refresh_daily_quest_ans(d) { ans = JSON.parse(JSON.stringify(d)); },
        rpc_c_finish_main_quest_ans(d) { ans = JSON.parse(JSON.stringify(d)); },
        rpc_c_refresh_daily_event(d) { refreshed.push(d.event_id); }
    };
}

// Empty offline save: seed all daily roots + main root 300201.
reset();
disk = JSON.stringify({version: 1, level: {player: {level: 2, diamond: 100, spirit: 10},
    units: [{sid: 1, typeid: 20101, sto: {1: 0, 2: 0}}], heros: []}});
const bare = JSON.parse(disk);
assert.equal(n.ensureQuestProgressSeeded(bare.level), true);
assert.ok(bare.level.player.event_counters[1][2004].d.current[3801]);
assert.ok(bare.level.player.event_counters[1][2005].d.current[3802]);
assert.ok(bare.level.player.main_quest[300201].current[300201]);
assert.ok(bare.level.player.last_update_time);
assert.deepEqual(JSON.parse(JSON.stringify(bare.level.player.event_counters[1][2004].d.current[3801].reward)),
    [[3,750],[19,{typeid:1123,num:10}]], 'list preview uses original scaled gold and fixed item chain');
for (const group of Object.values(bare.level.player.event_counters))
    for (const bucket of Object.values(group))
        for (const quest of Object.values(bucket.d.current))
            assert.ok(quest.reward.length > 0, 'every seeded daily has a preview');
assert.equal(n.ensureQuestProgressSeeded(bare.level),false,'migration is idempotent');
// Finished today: empty current + last → do not re-seed.
bare.level.player.event_counters[1][2004].d = {current: {}, last: 3801};
assert.equal(n.seedDailyQuestRoots(bare.level.player), false);
assert.deepEqual(bare.level.player.event_counters[1][2004].d.current, {});

// Finish coin daily 3801: gold scales floor(250*(1+2*1))=750, next 4001 in period 2033.
reset();
delete der.event_counters[1][2004].d.current[3801];
assert.equal(n.handleFinishDailyQuest(player, {quest_id: 3801}), true);
assert.equal(ans.root_quest_id, 3801);
assert.deepEqual(Object.keys(ans.current).map(Number), [4001]);
assert.ok(ans.reward.some(r => r[0] === 3 && r[1] === 750));
assert.ok(ans.reward.some(r => r[0] === 19));
const saved = JSON.parse(disk).level.player;
assert.equal(saved.event_counters[1][2004].d.current[3801], undefined);
assert.ok(saved.event_counters[1][2033].d.current[4001]);
assert.equal(saved.event_counters[1][2013].d.current[3811].mt_tasknum, 1);
// Quiet DER sync must not broadcast rpc_c_refresh_daily_event (re-entry storm).
assert.equal(refreshed.length, 0);
assert.ok(der.event_counters[1][2033].d.current[4001]);
assert.ok(ans.current[4001].reward.length > 0,'next daily receipt carries preview');

// Refresh empty root seeds current[root].
reset();
der.event_counters[1][2004].d.current = {};
assert.equal(n.handleRefreshDailyQuest(player, {root_quest_id: 3801}), true);
assert.equal(ans.root_quest_id, 3801);
assert.ok(JSON.parse(disk).level.player.event_counters[1][2004].d.current[3801]);
assert.ok(der.event_counters[1][2004].d.current[3801].reward.length > 0,'refresh populates live DER');

// Main quest finish seeds mt_next (300416) and grants putin wood+diamond.
reset();
delete qm.main_quest[300201].current[300201];
assert.equal(n.handleFinishMainQuest(player, {quest_id: 300201}), true);
assert.equal(ans.root_quest_id, 300201);
assert.deepEqual(Object.keys(ans.current).map(Number), [300416]);
assert.ok(ans.reward.some(r => r[0] === 2 && r[1] === 1000));
assert.ok(ans.reward.some(r => r[0] === 4 && r[1] === 5));
assert.equal(qm.main_quest[300201].last, 300201);
assert.ok(qm.main_quest[300201].current[300416]);
assert.equal(JSON.parse(disk).level.player.main_quest[300201].last, 300201);
assert.ok(ans.current[300416].reward.length > 0,'next main receipt carries preview');

// Existing saves retain their counters, packages and claimed markers during backfill.
reset();
const old = JSON.parse(disk), before = JSON.stringify(old);
const stateBefore = JSON.stringify({bag:old.level.player.package,units:old.level.units});
assert.equal(n.ensureQuestRewardPreviews(old.level.player),true);
assert.equal(old.level.player.event_counters[1][2004].d.current[3801].mt_coin,2000);
assert.equal(JSON.stringify({bag:old.level.player.package,units:old.level.units}),stateBefore,
    'preview cannot grant items/resources or create shop counters');
assert.equal(old.level.localShop,undefined);
assert.equal(disk,before,'preview is read-only with respect to disk');
// Exercise the original rendering boundary, not just the generated payload.
ctx.UI={GameEventBox:function(){}};ctx.INPUT_TYPE_UNKNOWN=0;
const ui = fs.readFileSync(`${__dirname}/../.local/quest-reward/GameEvents.js`,'utf8');
const uiStart=ui.indexOf('UI.GameEventBox.prototype.refreshReward=');
const uiEnd=ui.indexOf('UI.GameEventBox.prototype.onShow=',uiStart);
vm.runInContext(ui.slice(uiStart,uiEnd),ctx);
let second;
const row=old.level.player.event_counters[1][2004].d.current[3801];
const box={getScrollData:()=>({getQuest:()=>[row,{}]}),
    award1:{controller:{data:{},onBindData(){}}},
    award2:{setVisible(v){second=v;},controller:{data:{},onBindData(){}}}};
ctx.UI.GameEventBox.prototype.refreshReward.call(box);
assert.equal(box.award1.controller.data.award[0],3,'original UI receives gold, not UNKNOWN');
assert.equal(box.award1.controller.data.award[1],750);
assert.equal(second,true);assert.equal(box.award2.controller.data.award[1].typeid,1123);

// Stock daily callbacks deliberately do not increment ordinary fields. Exercise
// the adapter with that original callback and the original resource collector.
reset();
der.event_counters[1][2004].d.current[3801] = {};
const emptyProgress=JSON.parse(disk);
emptyProgress.level.player.event_counters[1][2004].d.current[3801]={};
disk=JSON.stringify(emptyProgress);
ctx.G_Player = player; ctx.DAILY_QUEST = 1; ctx.MAIN_QUEST = 2;
ctx.NON_LOG_FIELDS = {mt_b_numlv:1,mt_decorate:1,mt_league:1,mt_h_numrank:1};
ctx.Comp = {QuestManager:function(){},ResourceProductor:function(){}};
const stockQuest = fs.readFileSync(`${__dirname}/disasm/QuestManager.decompiled.js`, 'utf8');
function stockMethod(text, owner, name, next) {
    const start = text.indexOf(`${owner}.prototype.${name}=`);
    const end = text.indexOf(`${owner}.prototype.${next}=`, start);
    assert.ok(start >= 0 && end > start);
    vm.runInContext(text.slice(start, end), ctx);
}
stockMethod(stockQuest, 'Comp.QuestManager', '_updateNormalField', 'checkNoNotifyField');
stockMethod(stockQuest, 'Comp.QuestManager', '_canFinish', 'canFinish');
stockMethod(stockQuest, 'Comp.QuestManager', '_update_mt_warrior_cb', '_updateCurrent');
qm.getDailyQuest = id => {
    const cfg = ctx.data.daily_task[id];
    if (!cfg || !cfg.reset_period) return null;
    const bucket = der.event_counters[1][cfg.reset_period];
    const current = bucket && bucket.d && bucket.d.current[id];
    if (!current) return null;
    const cache = bucket.clientData.current || (bucket.clientData.current = {});
    return [current, cache[id] || (cache[id] = {})];
};
// Value boundary follows verified stock bytecode: resource targets default to
// zero without a server max override; ordinary counters use config targets.
qm.getQuestValue = (q,cfg) => {
    const field = Object.keys(ctx.data.daily_task).find(f =>
        f.startsWith('mt_') && ctx.data.daily_task[f].ids &&
        ctx.data.daily_task[f].ids.some(id => ctx.data.daily_task[id] === cfg));
    const max = q[0].max && q[0].max[field] ||
        (field === 'mt_coin' || field === 'mt_solar' ? 0 : Number(cfg[field]));
    const target=field==='mt_warrior' ? cfg.mt_warrior[0] : max;
    const value=field==='mt_warrior' ? q[0].mt_warrior && q[0].mt_warrior.total : q[0][field];
    return {curValue:Math.min(Number(value) || 0,target), maxValue:target};
};
qm._canFinish = ctx.Comp.QuestManager.prototype._canFinish;
qm._updateNormalField = ctx.Comp.QuestManager.prototype._updateNormalField;
qm._update_mt_warrior_cb = ctx.Comp.QuestManager.prototype._update_mt_warrior_cb;
qm.checkNoNotifyField = () => {};
qm._checkAndSetDailyQuestFinishStatus = id => {
    const q = qm.getDailyQuest(id);
    if (q) q[1].canFinish = qm._canFinish(q,ctx.data.daily_task[id]);
};
qm.updateCurrent = (field,num=1) => {
    for (const id of ctx.data.daily_task[field].ids || []) {
        const q = qm.getDailyQuest(id);
        if (q && !qm._canFinish(q,ctx.data.daily_task[id]))
            qm._updateNormalField(field,num,q,ctx.data.daily_task[id],ctx.DAILY_QUEST);
    }
};
qm.update_mt_warrior = (type,num) => {
    for (const id of ctx.data.daily_task.mt_warrior.ids) {
        const q=qm.getDailyQuest(id);
        if (q && !qm._canFinish(q,ctx.data.daily_task[id]))
            qm._update_mt_warrior_cb(type,num,q,ctx.data.daily_task[id],ctx.DAILY_QUEST);
    }
};
qm.finishDailyQuest = id => {
    const bucket=der.event_counters[1][ctx.data.daily_task[id].reset_period];
    bucket.d.last=id; delete bucket.d.current[id];
    return n.handleFinishDailyQuest(player,{quest_id:id});
};
assert.equal(qm._canFinish(qm.getDailyQuest(3801),ctx.data.daily_task[3801]),true,
    'reproduce false completion before max backfill');
n._questSeededPlayer = null;
n.ensureLiveQuestSeed();
n.installDailyQuestProgress(qm);
assert.equal(qm._canFinish(qm.getDailyQuest(3801),ctx.data.daily_task[3801]),false);
const beforeUnfinished=disk;
assert.equal(qm.finishDailyQuest(3801),false);
assert.equal(n.handleFinishDailyQuest(player,{quest_id:3801}),false);
assert.equal(disk,beforeUnfinished,'unfinished claims cannot change inventory or progress');

const components=fs.readFileSync(`${__dirname}/disasm/Components.decompiled.js`,'utf8');
stockMethod(components,'Comp.ResourceProductor','CollectResource','playGainAnimation');
Object.assign(ctx,{DA:{getSystemCurrentTimeHour:()=>1},RES_TYPE_GOLD:1,
    RES_TYPE_WOOD:2,RES_TYPE_DIAMOND:3,GOLD_COLLECT_FLOAT_TEXT_COLOR:1,
    WOOD_COLLECT_FLOAT_TEXT_COLOR:2});
ctx.G_MainController.floatText=()=>{};
rm.addRes=(num,type)=>{rm.Res[type]+=num;};
let amount=1000;
const collector={master:{callServer(){}},resourceType:1,
    calculateCollectRes:()=>[amount,amount],playGainAnimation(){},
    updateButton(){},_scheduleNotification(){}};
ctx.Comp.ResourceProductor.prototype.CollectResource.call(collector);
assert.equal(qm.getDailyQuest(3801)[0].mt_coin,1000,'original collector increments exactly once');
assert.equal(qm.getDailyQuest(3801)[1].canFinish,false);
assert.equal(JSON.parse(disk).level.player.event_counters[1][2004].d.current[3801].mt_coin,1000);
n.ensureLiveQuestSeed();
assert.equal(qm.getDailyQuest(3801)[0].mt_coin,1000,'opening list preserves live progress');
ctx.Comp.ResourceProductor.prototype.CollectResource.call(collector);
assert.equal(qm.getDailyQuest(3801)[1].canFinish,true);
assert.equal(qm.finishDailyQuest(3801),true,'completion survives stock pre-RPC deletion');
const afterClaim=disk;
assert.equal(n.handleFinishDailyQuest(player,{quest_id:3801}),false);
assert.equal(disk,afterClaim,'duplicate claim grants nothing');
assert.ok(ans.current[4001].max.mt_coin > 0,'next tier has a real target');
assert.equal(qm.getDailyQuest(3811)[0].mt_tasknum,1,'claim advances total exactly once');
assert.equal(qm.getDailyQuest(3811)[1].canFinish,false);
// Other ordinary daily events use the same stock notification entry point.
n.ensureLiveQuestSeed();
qm.updateCurrent('mt_PVEvictory');
assert.equal(qm.getDailyQuest(3804)[0].mt_PVEvictory,1);
assert.equal(qm.getDailyQuest(3804)[1].canFinish,false);
qm.updateCurrent('mt_PVEvictory',4);
assert.equal(qm.getDailyQuest(3804)[1].canFinish,true);
const persisted=JSON.parse(disk).level.player.event_counters;
assert.equal(persisted[1][ctx.data.daily_task[3804].reset_period].d.current[3804].mt_PVEvictory,5);
qm.update_mt_warrior(10101,19);
assert.equal(qm.getDailyQuest(3807)[0].mt_warrior.total,19,'stock soldier counter is not doubled');
assert.equal(qm.getDailyQuest(3807)[1].canFinish,false);
qm.update_mt_warrior(10101,1);
assert.equal(qm.getDailyQuest(3807)[0].mt_warrior.total,20);
assert.equal(qm.getDailyQuest(3807)[1].canFinish,true);
for (let i=0;i<7;i++) {
    // Seven additional already-validated claims are represented by the server's
    // aggregate operation; a zero notification must refresh the cached flag.
    const store=JSON.parse(disk); n.bumpDailyTasknum(store.level);
    n.writeRaw(store); n.syncQuestEventRecorder(player,store.level);
    qm.updateCurrent('mt_tasknum',0);
}
assert.equal(qm.getDailyQuest(3811)[0].mt_tasknum,8);
assert.equal(qm.getDailyQuest(3811)[1].canFinish,true,'aggregate reward unlocks at threshold');
console.log('PASS: daily targets, original resource event, progress persistence, completion, claims and rewards');
