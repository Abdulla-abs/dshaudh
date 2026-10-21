const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(`${__dirname}/native_boot.js`,'utf8');
const original=fs.readFileSync(`${__dirname}/disasm/GameControllerBattle.decompiled.js`,'utf8');
const stage=Number(process.env.DINO_GUARD_STAGE || 7);
const expectedDid=stage===16?'116008':'107003';
let current, positioned=false, visible=false;
const created=new Map();
const ctx={LocalNative:{},Game:{GameControllerBattle:function(){}},
    data:{unit_main:{10501:{first_type:2,battle_type:4}}},G_HERO_DEFEND:true,
    BATTLE_FACTION_ATTACKER:1,BATTLE_FACTION_DEFENDER:2,BATTLE_FACTION_SCENE_OBJ:3,HOMEBASEID:201,
    G_TriggerManager:{setUnitTrigger(){}},
    DA:{getRealTypeID:(t,l)=>t*100+l,contains:(a,n)=>a.includes(n)},
    cc:{baseCall(){const unit={cid:800,battleType:4,setSid(id){this.sid=id;created.set(String(id),this);},
        setToTile(){throw Error('Hero has no TileHolder');},
        getOriginType:()=>105,getDefenseID(){return this.defense_id;},
        setAtDefensePos(id){assert.equal(id,expectedDid);positioned=true;},comeToWorld(){visible=true;}};
        return unit;}},G_UnitManager:{getUnit:()=>current}};
vm.createContext(ctx);
const reg=source.indexOf('// BEGIN USER AUTHORED PVE LAYOUTS'),end=source.indexOf('// END USER AUTHORED PVE LAYOUTS',reg);
vm.runInContext(source.slice(reg,end),ctx);
const guard=ctx.LocalNative.editorPveLayouts[stage].units.find(u=>u.localNativeGuard);
assert.equal(guard.typeid,10501);assert.equal(guard.lv,stage===16?5:1);assert.equal(guard.x,undefined);assert.equal(guard.y,undefined);
if(stage===16) assert.deepEqual(Array.from(guard.skills),[10501,14801]);
function load(name){const a=original.indexOf(`Game.GameControllerBattle.prototype.${name}=`),b=original.indexOf('/* bytecode disassembly',a);
    assert.ok(a>=0&&b>a);vm.runInContext(original.slice(a,b)+'};',ctx);}
load('createUnit');load('_createBattleUnitWhenInit');load('_setupAllUnit');
const gc=new ctx.Game.GameControllerBattle();
Object.assign(gc,{defenders:[],attackers:[],sceneObj:[],battleResult:{totalDestoryWeight:0,defenderConfig:{}},
    updateHeros:[],updateSoldiers:[],updateUnits:{},typeToCid:{},addUnitToFavorClass(){}});
gc._createBattleUnitWhenInit(guard,{faction:2});
assert.equal(gc.defenders.length,1);current=created.get(String(guard.sid));assert.ok(current);
assert.equal(current.defense_id,expectedDid);assert.equal(gc.updateHeros.length,1);
gc._setupAllUnit();assert.equal(positioned,true);assert.equal(visible,true);
// Reproduce the actual device failure with the earlier building-coordinate payload.
assert.throws(()=>gc._createBattleUnitWhenInit({...guard,x:36,y:30},{faction:2}),/TileHolder/);
console.log('PASS: original stock createUnit, guard construction and setup avoid TileHolder and use bunker did; old payload reproduces device error');
