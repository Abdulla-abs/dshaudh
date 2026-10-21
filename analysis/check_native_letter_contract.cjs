const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
let store={level:{player:{diamond:150,spirit:50,sys_letters:[]},units:[{sid:1,typeid:20102,sto:{1:1000,2:1200}}]}};
const rm={Res:{1:1000,2:1200,3:150,4:50}};
const holder={currentStorage:{1:1000,2:1200},refreshDisplay(){}};
const lm={sysLetters:[]};
const player={getComponent:()=>lm};
const ctx={LETTER_TYPE_SYS_REWARD:256,GS_STAGE_BUILD:1,G_UnitManager:{getUnitBySID:()=>({componentList:{ResourceStorage:holder}})},LocalNative:{
    readRaw:()=>store,writeRaw(){},getResourceManager:()=>rm,refreshResHud(){},writeStatus(){},
    lookupUnitMain:()=>({gold_storage:20000,wood_storage:20000}),
    tryDumpAndSave(){return false;} // Reproduce the real failed-snapshot condition.
}};
vm.createContext(ctx);
function load(name,next){const a=source.indexOf(`        LocalNative.${name} = function`);const b=source.indexOf(`        LocalNative.${next} = function`,a+1);vm.runInContext(source.slice(a,b),ctx);}
load('ensureWelcomeLetter','handleTutorialEggDraw');
load('grantPveLoot','applyPveItemReward');
assert.equal(ctx.LocalNative.ensureWelcomeLetter(store.level.player),true);
assert.equal(store.level.player.sys_letters[0].sender_name,'来自女神的信');
assert.equal(ctx.LocalNative.ensureWelcomeLetter(store.level.player),false);
lm.sysLetters=store.level.player.sys_letters;
const params={letter_id:'local_goddess_newbie_gift'};
assert.equal(ctx.LocalNative.handleWelcomeLetterReward(player,params),true);
assert.equal(store.level.player.diamond,250);
assert.equal(store.level.player.spirit,100);
assert.equal(store.level.units[0].sto[1],6000);
assert.equal(store.level.units[0].sto[2],6200);
assert.equal(holder.currentStorage[1],6000);
assert.equal(rm.Res[4],100);
assert.equal(ctx.LocalNative.handleWelcomeLetterReward(player,params),false);
// Old release saved the claimed flag with no resource balances. Credit only
// the three missing currencies and preserve already displayed diamond reward.
store={level:{player:{diamond:150,spirit:50,sys_letters:[],localWelcomeGiftClaimed:true},units:[{sid:1,typeid:20102,sto:{1:0,2:0}}]}};
rm.Res={1:0,2:0,3:250,4:100};
assert.equal(ctx.LocalNative.handleWelcomeLetterReward(player,params),true);
assert.equal(store.level.player.diamond,250);
assert.equal(store.level.player.spirit,100);
assert.equal(store.level.units[0].sto[1],5000);
assert.equal(store.level.units[0].sto[2],5000);
assert.equal(store.level.player.localWelcomeGiftReceiptV2.diamond,0);
assert.equal(ctx.LocalNative.handleWelcomeLetterReward(player,params),false);
console.log('PASS: durable four-currency gift despite failed snapshot; repair missing currencies without duplicating diamond/spirit');
