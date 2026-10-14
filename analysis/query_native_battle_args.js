var result={request:'battle-args-20261013',build:[],records:[]};
var f=Game.GameControllerBattle.prototype._createBattleUnitWhenInit.original;
var u={typeid:20101,unit_type:201,unit_level:1,x:28,y:28,faction:2,state:2};
var client={faction:2,leagueID:0};
var fake={battleResult:{totalDestoryWeight:0},defenderConfig:{},createUnit:function(p){result.build.push({keys:Object.keys(p),typeid:p.typeid,x:p.x,y:p.y,faction:p.faction});return {setSid:function(){},getComponent:function(){return {};}};}};
try {f.call(fake,u,client);}catch(e){result.build.push({error:String(e),stack:e.stack});}
var old=DA.GETCGC;
DA.GETCGC=function(){return {startBattle:function(){result.records.push('START');},scheduleDelayedBattleFinish:function(){result.records.push('END');}};};
var recorder=Object.create(Game.BattleRecorder.prototype);
recorder.startReplayID=0;
recorder.IndexToFunction={7:'startBattle',5:'scheduleDelayedBattleFinish'};
[[1,0,7],[1,7,0,[]],[1,7,[]],[1,7,0]].forEach(function(r){try {recorder._exeRecord(r);result.records.push({input:r,ok:true});}catch(e){result.records.push({input:r,error:String(e)});}});
DA.GETCGC=old;
return result;

