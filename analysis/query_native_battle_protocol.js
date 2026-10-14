var bp=Game.GameControllerBattle.prototype;
var names=['_createBattleUnitWhenInit','createUnit','UserDelayedCreateUnit','startBattle','scheduleDelayedBattleFinish'];
var out={request:'battle-protocol-20261013',functions:{},constants:{}};
names.forEach(function(n){var f=bp[n]; if(f) out.functions[n]={length:(f.original||f).length,source:String(f.original||f)};});
out.functions.createPlayer={length:G_PlayerManager.createPlayer.length,source:String(G_PlayerManager.createPlayer)};
out.functions.record={length:Game.BattleRecorder.prototype._exeRecord.length,source:String(Game.BattleRecorder.prototype._exeRecord)};
['BR_UNIT_CREATE','BR_START_BATTLE','BR_DELAY_END_BATTLE'].forEach(function(n){out.constants[n]=eval(n);});
return out;
