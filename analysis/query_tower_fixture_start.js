var n=LocalNativeGlobal;
if(!n.readRaw()){var l=n.defaultLevelDict();l.player.first_movie_played=1;l.user_config={rookie0:6210};l.units.push({sid:100,typeid:30101,unit_type:301,unit_level:1,state:2,x:24,y:24,faction:2});n.writeRaw({version:1,revision:1,source:'isolated-tower-diagnostic',starterResGranted:true,level:l});}
Rookie.initRookieByServer=function(){};n.kickBeginRookie=function(){};this.TowerTrace={fixtureKey:'dino.local.native.tower-fixture-1014',seed:[],events:[],samples:[]};
var orig=Game.BattleRecorder.prototype.setRandomSeed;
Game.BattleRecorder.prototype.setRandomSeed=function(seed){TowerTrace.seed.push({seed:seed,type:typeof seed});return orig.apply(this,arguments);};
['beginSkill','onSkillApplyed'].forEach(function(k){var p=Comp.StaticBattleController.prototype,fn=p[k];p[k]=function(){if(this.master.typeid===30101&&TowerTrace.events.length<60)TowerTrace.events.push({method:k,args:Array.prototype.slice.call(arguments).map(function(v){return typeof v==='object'?(v&&v.id||typeof v):v;}),target:this.targetID,damage:this.totalOutputDamage});return fn.apply(this,arguments);};});
var p=Game.GameControllerBattle.prototype,origStart=p.startBattle;
p.startBattle=function(){var r=origStart.apply(this,arguments),gc=this;
[3,8,15,25].forEach(function(delay){gc.rootNode.scheduleOnce(function(){var s={delay:delay,finished:gc.battleFinished,seed:gc.battleRecorder.randomSeed,towers:[],enemies:[]};n.eachBattleDefenderUnit(gc,function(u){if(u.typeid!==30101)return;var b=n.resolveUnitBattleController(u);s.towers.push({cid:u.cid,life:b.life,damage:b.totalOutputDamage,lastIdle:String(b.lastIdleUpdateTime),target:b.targetID});});gc.attackers.forEach(function(cid){var u=G_UnitManager.getUnit(cid),b=n.resolveUnitBattleController(u);s.enemies.push({cid:cid,life:b&&b.life,damage:b&&b.totalDamage});});TowerTrace.samples.push(s);},delay);});return r;};
n.startGame();return {request:'tower-final-fixture-start-1014'};
