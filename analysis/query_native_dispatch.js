var out={request:'dispatch-20261013',cases:[]};
var values=[[0,{x:400,y:400},0],[0,{x:400,y:400},1],[{x:400,y:400},0,0],[0,0,{x:400,y:400}]];
values.forEach(function(args){var events=[];var list={};[0,1].forEach(function(i){Object.defineProperty(list,i,{get:function(){events.push('index'+i);return {curNum:4,maxNum:4,unitNum:4,Operate:function(){events.push(Array.prototype.slice.call(arguments));}};}});});var fake={battleStarted:true,isNeedRecordReplay:function(){return false;},UnitChoiceList:list};try {var r=Game.GameControllerBattle.prototype.UserDelayedCreateUnit.apply(fake,args);events.push({returned:r});}catch(e){events.push(String(e));}out.cases.push({args:args,events:events});});
return out;
