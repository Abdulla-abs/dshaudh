var out={request:'choices-protocol-20261013'};
var fake={UnitChoiceList:[],choices:[{typeid:10101,choice:4,num:4}],inReplayMode:true,menu:{initUnitChoises:function(){},setUnitChoiceNum:function(){}},_preLoadUnitResource:function(){}};
try{Game.GameControllerBattle.prototype.initUnitChoiceList.call(fake,[{typeid:10101,choice:4,num:4}]);out.keys=Object.keys(fake.UnitChoiceList[0]);out.fields={type:fake.UnitChoiceList[0].type,curNum:fake.UnitChoiceList[0].curNum,maxNum:fake.UnitChoiceList[0].maxNum};}catch(e){out.error=String(e);out.stack=e.stack;}
return out;


