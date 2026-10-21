const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const src = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
let disk = {level:{player:{soldier_storage:{120:{}}},units:[
    {sid:'6',sds:{114:2,120:5},ep:{114:{0:1,1:1}},tbuf:[114]},
    {sid:'7',sds:{114:1,101:2},ep:{114:{0:0,1:1}}}
]}};
let writes=0, failWrite=false, spawn=true;
const gc={inReplayMode:false,battleFinished:false,menu:{unitNumber:{controller:{setSingleNum(){}}}},
    sendUnitToMap(){return spawn ? {} : null;}};
const ctx={LocalNative:{getBattleController:()=>gc,readRaw:()=>JSON.parse(JSON.stringify(disk)),
    writeRaw(store){if(failWrite)throw Error('disk failure'); disk=JSON.parse(JSON.stringify(store));writes++;},
    writeStatus(){}},GS_CURRENT_STAGE:2,GS_STAGE_BATTLE:2,
    SOLDIER_LEVEL_ELITE:0,SOLDIER_LEVEL_VETERAN:1,
    Game:{GameControllerBattle:function(){},UnitProxy:function(){},ChoiceProxy:{sendUnitEffect(){}}},
    _EXPENDITIONS_CONFIG:[],SELECTABLE_TYPE_UNIT:0,
    DA:{GETCGC:()=>gc},BATTLE_FACTION_ATTACKER:1};
vm.createContext(ctx);
vm.runInContext(src.slice(src.indexOf('        LocalNative.collectBattleSoldiers = function'),
    src.indexOf('        LocalNative.buildPveBattleDict = function')),ctx);
const n=ctx.LocalNative;
n.battleSoldierStock=n.collectBattleSoldiers(disk.level);
assert.deepEqual(JSON.parse(JSON.stringify(n.battleSoldierStock)),{101:2,114:3},'sum camps, exclude workers and queue');
ctx.G_Player={callServer(method,p){assert.equal(method,'rpc_s_dispatch_soldier');return n.handleDispatchSoldier(p);}};
const original=fs.readFileSync(`${__dirname}/disasm/GameControllerBattle.decompiled.js`,'utf8');
const clean=original.replace(/\/\* bytecode disassembly[\s\S]*?\*\//g,'');
const choiceStart=clean.indexOf('Game.GameControllerBattle.prototype.setUnitChoiceFromLevelData=');
const choiceEnd=clean.indexOf('Game.GameControllerBattle.prototype.',choiceStart+1);
vm.runInContext(clean.slice(choiceStart,choiceEnd),ctx);
let choices;
ctx.Game.GameControllerBattle.prototype.setUnitChoiceFromLevelData.call({
    _getLeagueTechs:()=>[],battleSystem:{getChoiceOptions:()=>[false,true,false]},
    battleRecorder:{setChoices(c){choices=c;}},initUnitChoiceList(){},initLeagueTechList(){}
},{self:{heros:[],soldiers:n.battleSoldierStock,hero_donate_list:[]},choices:[]});
assert.equal(choices.find(c=>c.id===11401).num,3,'stock deploy tray receives full typeid and summed count');
const start=original.indexOf('Game.UnitProxy.prototype.Operate=');
const end=original.indexOf('/* bytecode disassembly',start);
vm.runInContext(original.slice(start,end)+'};',ctx);
const proxy={master:gc,typeid:11401,curNum:3,aliveNum:0};
function deploy(){ctx.Game.UnitProxy.prototype.Operate.call(proxy,{x:400,y:400},1);}
deploy();
assert.equal(writes,1);assert.equal(disk.level.units[0].sds[114],1);
assert.equal(disk.level.units[0].ep[114][0],0);
assert.equal(proxy.curNum,2);
assert.equal(disk.level.units[0].tbuf.length,1,'training queue preserved');
deploy();deploy();
assert.equal(disk.level.units[0].sds[114],0);assert.equal(disk.level.units[1].sds[114],0);
assert.equal(disk.level.units[1].sds[101],2,'undeployed type retained');
assert.equal(disk.level.units[0].sds[120],5,'workers retained');
assert.equal(n.handleDispatchSoldier({soldier_type:11401}),false,'cannot overspend');
assert.equal(writes,3);
gc.inReplayMode=true;deploy();assert.equal(writes,3,'replays never consume');gc.inReplayMode=false;
spawn=false;deploy();assert.equal(writes,3,'failed stock placement sends no RPC');spawn=true;
ctx.GS_CURRENT_STAGE=1;assert.equal(n.handleDispatchSoldier({soldier_type:10101}),false);ctx.GS_CURRENT_STAGE=2;
assert.equal(n.handleDispatchSoldier({soldier_type:101}),false,'contract takes typeid');
assert.equal(n.handleDispatchSoldier({soldier_type:12001}),false,'workers cannot dispatch');
failWrite=true;assert.equal(n.handleDispatchSoldier({soldier_type:10101}),false);
assert.equal(n.battleSoldierStock[101],2,'failed save keeps budget');failWrite=false;
// Fresh process reads the committed inventory, not the initial battle roster.
assert.deepEqual(JSON.parse(JSON.stringify(n.collectBattleSoldiers(disk.level))),{101:2});
assert.match(src,/methodName === 'rpc_s_dispatch_soldier'\)\s*return LocalNative.handleDispatchSoldier/);
console.log('PASS: stock UnitProxy deployment, immediate durable per-soldier consumption, camps, queue, replay and failure guards');
