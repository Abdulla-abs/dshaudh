const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync(`${__dirname}/native_boot.js`,'utf8');
const ctx={LocalNative:{unit(sid,typeid,x,y,extra){return {sid,id:sid,typeid,
    unit_type:Math.floor(typeid/100),unit_level:typeid%100,x,y,...extra};}},data:{}};
vm.createContext(ctx);
for(const name of ['unit_main','unit_battle'])
    vm.runInContext(fs.readFileSync(`${__dirname}/../.local/shop-treasure/${name}.js`,'utf8'),ctx);
function load(a,b){vm.runInContext(src.slice(src.indexOf(`        LocalNative.${a} = function`),
    src.indexOf(`        LocalNative.${b} = function`)),ctx);}
load('buildStageSevenVillage','inferredPveVillageUnits');
const v=ctx.LocalNative.buildStageSevenVillage(1288,1288);
assert.deepEqual(Array.from(v.units,u=>u.typeid),[20101,30101,20301,30201,20201,20501,20401,30301,50701,10501]);
const occupied=new Set(),wallSet=new Set();
for(const u of v.units.slice(0,9)){
    const c=ctx.data.unit_main[u.typeid];
    for(let x=u.x-c.tilesize_x+1;x<=u.x;x++)for(let y=u.y-c.tilesize_y+1;y<=u.y;y++){
        const key=`${x}:${y}`;assert.ok(!occupied.has(key),`structure overlap ${key}`);occupied.add(key);
    }
}
for(const w of v.walls){const key=`${w[1]}:${w[2]}`;
    assert.ok(!wallSet.has(key),'duplicate wall');assert.ok(!occupied.has(key),`wall overlaps structure ${key}`);
    wallSet.add(key);assert.equal(w[0],1);assert.equal(w[3],0);
}
const hero=v.units[9],flag=v.units[8];assert.equal(hero.unit_level,1);assert.equal(hero.lv,1);
assert.equal(hero.did,String(flag.sid));assert.equal(hero.skills[0],10501);
for(const u of v.units.filter(u=>u.unit_type>=301&&u.unit_type<=303))
    assert.ok(ctx.data.unit_battle[u.typeid].skill_nums.length,'stock tower attack skills exist');
// Original hero placement resolves this battle's flag and produces finite map coordinates.
ctx.Unit=function(){};ctx.GS_CURRENT_STAGE=2;ctx.GS_STAGE_BUILD=1;ctx.GS_STAGE_VISIT=3;ctx.GS_STAGE_INVASION=4;
ctx.G_UnitManager={getUnitBySID(id){assert.equal(String(id),hero.did);return {
    typeid:flag.typeid,getMapCoord:()=>({x:flag.x,y:flag.y})};}};
ctx.DA={debug(){},getRandom:()=>0,GETCGC:()=>({mapManager:{
    TileCenterPosForLogicCoord:(x,y)=>({x,y}),addUnit(){}}})};
const original=fs.readFileSync(`${__dirname}/../.local/pve-stage7/Unit.js`,'utf8');
vm.runInContext(original.slice(original.indexOf('Unit.prototype.setAtDefensePos='),
    original.indexOf('Unit.prototype.setVisible=')),ctx);
let position;
ctx.Unit.prototype.setAtDefensePos.call({setPosition(x,y){position={x,y};}},hero.did);
assert.ok(Number.isFinite(position.x)&&Number.isFinite(position.y),'no NaN at decorative flag anchor');
assert.ok(Math.abs(position.x-flag.x)<2&&Math.abs(position.y-flag.y)<2);
// Battle scene decorations count for de-duplication, but are still original scene faction.
load('countBattleUnits','battleBuildingKey');
assert.equal(ctx.LocalNative.countBattleUnits({defenders:[1],attackers:[],sceneObj:[2]}),2);
assert.match(src,/if \(data && data.localNativeStableSid\) data.id = data.sid;/);
console.log(`PASS: stage 7 reference structures, ${v.walls.length} walls, collision-free footprints, level-1 guard and original flag placement`);
