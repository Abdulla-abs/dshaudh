var out={request:'record-args-20261013',calls:[]};
var old=DA.GETCGC;
DA.GETCGC=function(){return {UserDelayedCreateUnit:function(){out.calls.push(Array.prototype.slice.call(arguments));}};};
var r=Object.create(Game.BattleRecorder.prototype);r.startReplayID=0;r.IndexToFunction={4:"UserDelayedCreateUnit"};
var cfg={typeid:10101,unit_type:101,unit_level:1,faction:1};
[[1,0,4,[cfg,{x:400,y:400},null]],[1,0,4,cfg,{x:400,y:400},null]].forEach(function(rec){try{r._exeRecord(rec);}catch(e){out.calls.push({error:String(e)});}});
DA.GETCGC=old;
var fake={battleStarted:true,isNeedRecordReplay:function(){return false;},UnitChoiceList:[{curNum:4,Operate:function(){out.dispatch=Array.prototype.slice.call(arguments);}}],createUnit:function(p){out.created=p;return {getComponent:function(){return {setOverTile:function(){},setToTile:function(){}};},setPosition:function(){},comeToWorld:function(){}};},mapManager:{realTileCoordForPosition:function(p){out.coord=p;return {x:16,y:20};},addUnit:function(){} }};
try {Game.GameControllerBattle.prototype.UserDelayedCreateUnit.call(fake,0,1,{x:400,y:400});}catch(e){out.createError=String(e);out.stack=e.stack;}
return out;






