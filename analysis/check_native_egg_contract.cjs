const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
const store = {level:{player:{hero_slot_num:2,achieve_raw:{}},heros:[{sid:'a'},{sid:'b'}]}};
let cards=0, gains=0;
const hm={getHeroCapacity:()=>2};
const recorder={};
const daily={last_update_time:100,event_counters:{1:{8033:{t:100}}}};
const player={getComponent:name=>({HeroManager:hm,AchievementRecorder:recorder,DailyEventRecorder:daily})[name],
    rpc_c_draw_card(d){cards++;assert.equal(d.ans[0][0],29);assert.equal(d.ans[0][1].hero_id,11501);assert.equal(d.ans[0][1].lv,30);},
    rpc_c_gain_drawcard(d){gains++;assert.equal(d.ans[0][1].hero_slot,1);assert.equal(d.ans[0][1].skill_slots[0].sid,267);}};
const ctx={LocalNative:{readRaw:()=>store,writeRaw(){},writeStatus(){},ensurePlayerSocialFields(p){p.achieve_raw=p.achieve_raw||{};}}};
vm.createContext(ctx);
vm.runInContext(source.slice(source.indexOf('        LocalNative.normalizeHeroSkillSlots = function'),
    source.indexOf('        LocalNative.getMaxSunshineCapacity = function')),ctx);
vm.runInContext(source.slice(source.indexOf('        LocalNative.ensureHeroSkill = function'),
    source.indexOf('        LocalNative.makeHomeInitDict = function')),ctx);
const a=source.indexOf('        LocalNative.handleTutorialEggDraw = function');
const b=source.indexOf('        LocalNative.handleChangeNickname = function',a);
vm.runInContext(source.slice(a,b),ctx);
const n=ctx.LocalNative;
assert.equal(n.handleTutorialEggDraw(player,{buy_id:100,free:true}),true);
assert.equal(store.level.heros.length,2,'draw opens a card; grant requires stock claim button');
const pendingSid=store.level.localTutorialEgg.hero.sid;
assert.equal(n.handleTutorialEggDraw(player,{buy_id:100,free:true}),true);
assert.equal(store.level.localTutorialEgg.hero.sid,pendingSid,'duplicate draw resumes same result');
assert.equal(n.handleTutorialEggGain(player),true);
assert.equal(store.level.heros.length,3);
assert.equal(store.level.player.hero_slot_num,3);
assert.equal(store.level.player.achieve_raw.hero_times,1);
assert.equal(recorder.achieve_raw.hero_times,1);
assert.equal(store.level.heros[2].lv,30);
assert.equal(store.level.heros[2].state,0);
assert.equal(n.handleTutorialEggGain(player),false);
assert.equal(n.handleTutorialEggDraw(player,{buy_id:100,free:true}),false);
assert.equal(n.handleTutorialEggDraw(player,{buy_id:101,free:false}),false);
assert.equal(gains,1);
assert.equal(cards,2);
console.log('PASS: free level-30 elf egg, stock draw/claim shape, slots, cooldown, tutorial stat and no duplicates');
