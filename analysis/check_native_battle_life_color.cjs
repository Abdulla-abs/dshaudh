const fs = require('node:fs'), path = require('node:path');
const vm = require('node:vm'), assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const out = path.join(root, '.local/battle-life-color');
fs.mkdirSync(out, {recursive:true});
const fixture = path.join(out, 'BattleController.js');
execFileSync('python', [path.join(root, 'tools/jsc_decompiler/cli.py'),
    path.join(__dirname, 'decoded/script/Client/Components/BattleController.jsc'), fixture]);
const stock = fs.readFileSync(fixture, 'utf8');
const src = fs.readFileSync(path.join(__dirname, 'native_boot.js'), 'utf8');
let gc, pooledBar, scheduled;
const green = {r:140,g:245,b:70}, purple = {r:220,g:0,b:255};
const ctx = {LocalNative:{writeStatus(){}}, UI:{}, Comp:{BaseBattleController:function(){}},
    BATTLE_FACTION_ATTACKER:1, BATTLE_FACTION_DEFENDER:2,
    GS_CURRENT_STAGE:2, GS_STAGE_BATTLE:2, G_Player:{faction:2},
    LIFEBAR_GREEN:green, LIFEBAR_PURPLE:purple, LIFEBAR_RED:{r:250,g:72,b:60}, EVIL_TAG_1:201408085,
    DA:{GETCGC:()=>gc, makeSelector:(fn, self)=>()=>fn.call(self)},
    data:{unit_main:{10101:{hero_kind:3,time_bar_offset:4}}},
    RS:{BATTLE_LIFE_BAR_HERO:'hero',BATTLE_LIFE_BAR_SIMPLE:'simple',HERO_KIND_ICON:{3:'kind3'}},
    cc:{ScaleTo:{create:(duration,x,y)=>({duration,x,y})},
        CallFunc:{create:fn=>fn}, Sequence:{create:(action,done)=>({action,done,setTag(){}})},
        SpriteFrameCache:{getInstance:()=>({getOrCreateSpriteFrameByName:n=>n})}}};
vm.createContext(ctx);
function method(text, marker) {
    const start=text.indexOf(marker), end=text.indexOf('\n    };',start);
    assert.ok(start>=0 && end>start,marker);
    vm.runInContext(text.slice(start,end+7),ctx);
}
vm.runInContext('UI.LifeBar = function() {}; UI.LifeBarSimple = function() {}; UI.LifeBarHero = function() {};',ctx);
for (const marker of ['UI.LifeBar.getColorByPercentage=',
    ...['init','setColor','setPercentage','progressToPercentage','_stopProgress','_progressEndCall']
        .map(n=>'UI.LifeBarSimple.prototype.'+n+'=')]) method(stock,marker);
vm.runInContext('UI.LifeBarHero.prototype = Object.create(UI.LifeBarSimple.prototype);',ctx);
ctx.cc.baseCall = (cls,self,name,...args)=>ctx.UI.LifeBarSimple.prototype[name].apply(self,args);
method(stock,'UI.LifeBarHero.prototype.init=');
method(stock,'Comp.BaseBattleController.prototype._initLifeBar=');
ctx.UI.CCBItemPoolManager={getInstance:()=>({createItemSyn:kind=>{
    pooledBar.kind=kind; return {controller:pooledBar};
}})};
function makeBar(hero) {
    const bar=new (hero?ctx.UI.LifeBarHero:ctx.UI.LifeBarSimple)();
    Object.assign(bar,{progressTimerNode:{setColor(c){bar.color=c;},setScaleX(x){bar.percent=x;},
        stopAllActionsByTag(){},runAction(a){scheduled=a;bar.percent=a.action.x;}},
        rootNode:{setPosition(p){bar.position=p;},setScale(){},},show(v){bar.visible=v;},
        heroKindIcon:{setVisible(v){bar.iconVisible=v;},setDisplayFrame(){}},
        heroKindBG:{setVisible(){}},levelLabel:{setString(v){bar.level=v;}}});
    // The stock hero init uses the existing resource-specific icon/label names.
    return bar;
}
// Inspect hero init separately below; use a real simple bar for building reproduction.
function battleUnit(faction, hero=false) {
    const bc=new ctx.Comp.BaseBattleController();
    bc.master={faction,isHero:hero?1:0,typeid:10101,
        getComponent:n=>n==='ExpBar'?{getLevel:()=>7}:null,
        rootNode:{getContentSize:()=>({width:20,height:30}),getPosition:()=>({x:0,y:0}),
            getAnchorPoint:()=>({x:0.5,y:0.5}),getScaleX:()=>1,addChild(){} }};
    bc.config={};bc.alwaysShowLifeBar=()=>true;
    return bc;
}
gc={inReplayMode:false,getStageClient:()=>({faction:2})};
// Execute the adapter rebind and verify stock ownership after role correction.
vm.runInContext(src.slice(src.indexOf('        LocalNative.bindBattleClientFaction = function'),
    src.indexOf('        LocalNative.withBattleClient = function')),ctx);
ctx.G_Player={faction:1,nickname:'LocalRookie'};
const enemy={faction:2,nickname:'Enemy'};
ctx.LocalNative.resolveBattleClient=faction=>faction===1?ctx.G_Player:enemy;
ctx.LocalNative.ensureBattleClients();
assert.equal(ctx.G_Player.faction,1,'live attacker stays owned by the player');
pooledBar=makeBar(false);
const original=new ctx.Comp.BaseBattleController();
Object.assign(original,battleUnit(1));original._initLifeBar();
assert.equal(pooledBar.isPlayerSide,true,'stock recognizes friendly attacker after role correction');
vm.runInContext(src.slice(src.indexOf('        LocalNative.installBattleLifeBarColors = function() {'),
    src.indexOf('        LocalNative.installManualHeroSkillGuard = function() {')),ctx);
const stockPercentage=ctx.UI.LifeBarSimple.prototype.setPercentage;
const stockProgress=ctx.UI.LifeBarSimple.prototype.progressToPercentage;
ctx.LocalNative.installBattleLifeBarColors();
assert.equal(ctx.UI.LifeBarSimple.prototype.setPercentage,stockPercentage,'stock HP color function retained');
assert.equal(ctx.UI.LifeBarSimple.prototype.progressToPercentage,stockProgress,'stock animated color function retained');
const wrapped=ctx.Comp.BaseBattleController.prototype._initLifeBar;
ctx.LocalNative.installBattleLifeBarColors();
assert.equal(wrapped,ctx.Comp.BaseBattleController.prototype._initLifeBar,'idempotent install');
for (const mode of ['tutorial-raid','random-scout','wanted','single-pve','wild-adventure']) {
    const raid=mode==='tutorial-raid';
    gc={inReplayMode:raid,isEnterEnemyAttackReplay:raid,getStageClient:()=>({faction:2}),level_data:{}};
    for (const hero of [false,true]) for (const faction of [1,2]) {
        pooledBar=makeBar(hero);
        const bc=battleUnit(faction,hero);bc._initLifeBar();
        const expected=(faction===(raid?2:1))?green:purple;
        assert.equal(pooledBar.color,expected,`${mode} hero=${hero} faction=${faction}`);
        for (const hp of [100,55,1,0,90]) {
            const hpColor=expected===green?
                [250+(140-250)*hp/100,72+(245-72)*hp/100,60+(70-60)*hp/100]:[220,0,255];
            function assertColor() {
                for (const [i,k] of ['r','g','b'].entries())
                    assert.ok(Math.abs(pooledBar.color[k]-hpColor[i])<1e-9,`${mode} ${hp}% ${k}`);
            }
            pooledBar.setPercentage(hp);assertColor();
            assert.equal(pooledBar.percent,hp/100);
            pooledBar.progressToPercentage(0.4,hp);assertColor();
            assert.equal(scheduled.action.duration,0.4);scheduled.done();
        }
        assert.equal(bc.master.faction,faction,'combat faction unchanged');
        assert.equal(pooledBar.visible,true,'stock visibility retained');
        assert.equal(pooledBar.kind,hero?'hero':'simple');
        if (hero) {
            assert.equal(pooledBar.level,7);
            assert.equal(pooledBar.iconVisible,expected!==green,'stock hero icon uses corrected side');
        }
    }
}
gc={inReplayMode:true,getStageClient:()=>({faction:2}),level_data:{}};
// Reuse a colored pool item in a normal replay, then outside battle.
battleUnit(2)._initLifeBar();
assert.equal(pooledBar.isPlayerSide,true,'normal replay retains stock perspective');
ctx.GS_CURRENT_STAGE=1;battleUnit(1)._initLifeBar();
assert.equal(pooledBar.isPlayerSide,false,'pooled item returns to stock side outside battle');
console.log('PASS: live attacker ownership; 5 battle roles × heroes/buildings × both factions; HP/animation/pooling preserved');
