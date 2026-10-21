const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const C=require('./layout-editor/core.js'),catalog=require('./layout-editor/catalog.json');
const layout=C.empty();
assert.equal(C.MAP.terrainSize,60);
assert.equal(C.MAP.playableMin,11);
assert.equal(C.MAP.playableMax,48);
for(const [x,y,expected] of [[11,11,true],[48,48,true],[10,30,false],[49,30,false],[30,10,false],[30,49,false]])
    assert.equal(C.inBounds(x,y),expected);
const overflow=require('./rpc-contracts/scout-layouts/alley-cat-8.json');
const beforeTranslation=C.clone(overflow);
for(const obj of [...beforeTranslation.buildings,...beforeTranslation.walls]){obj.x+=20;obj.y+=20;}
assert.throws(()=>C.normalize(beforeTranslation,catalog),/边界/,'reject the original alley-cat overflow in the editor');
assert.deepEqual(C.validate(overflow,catalog).errors,[]);
const edge=C.empty();
edge.buildings=[{id:'hq',typeid:20101,level:1,x:11,y:30}];
assert.match(C.validate(edge,catalog).errors.join(),/边界/,'whole footprint must fit, not just anchor');
const rectangle=C.wallStroke({x:10,y:10},{x:14,y:13},'rectangle');
assert.equal(rectangle.length,14,'rectangle perimeter has no duplicate corners');
assert.equal(new Set(rectangle.map(c=>`${c.x}:${c.y}`)).size,14);
assert.ok(rectangle.every(c=>c.x===10||c.x===14||c.y===10||c.y===13));
assert.equal(C.wallStroke({x:10,y:10},{x:10,y:13},'rectangle').length,4,'degenerate rectangle stays a line');
layout.buildings=[{id:'base',typeid:20101,level:1,x:30,y:30},
    {id:'flag',typeid:50701,level:1,x:36,y:28}];
layout.walls=C.line({x:25,y:23},{x:35,y:23}).map(c=>({...c,level:1}));
layout.guards=[{id:'triceratops',typeid:10501,level:1,anchorId:'flag'}];
assert.deepEqual(C.validate(layout,catalog).errors,[]);
assert.deepEqual(C.normalize(JSON.parse(JSON.stringify(layout)),catalog),layout,'JSON round trip');
const trained=C.clone(layout);
Object.assign(trained.guards[0],{evolution:2,reborn:19,mutateId:6,skills:[14810]});
assert.deepEqual(C.validate(trained,catalog).errors,[]);
assert.deepEqual(C.normalize(C.clone(trained),catalog),trained,'cultivation fields survive import');
assert.equal(C.guardVariant(trained.guards[0],catalog).typeid,10560);
for(const [field,value] of [['evolution',3],['reborn',20],['mutateId',16],['skills',[14801,14802]],
    ['skills',[16501]],['skills',[14899]],['skills',null],['reborn',null],['mutateId',true]]){
    const invalid=C.clone(trained);invalid.guards[0][field]=value;
    assert.throws(()=>C.normalize(invalid,catalog),undefined,`reject ${field}=${value}`);
}
for(const p of [{x:0,y:0},{x:32,y:17},{x:63,y:63}]){
    const projected=C.project(p.x,p.y);assert.deepEqual(C.unproject(projected.x,projected.y),p);
}
const bad=C.clone(layout);bad.buildings.push({id:'overlap',typeid:30101,level:1,x:30,y:30});
assert.match(C.validate(bad,catalog).errors.join(),/重叠/);
const outside=C.clone(layout);outside.buildings[0].x=1;
assert.match(C.validate(outside,catalog).errors.join(),/边界/);
const orphan=C.clone(layout);orphan.guards[0].anchorId='absent';
assert.match(C.validate(orphan,catalog).errors.join(),/未绑定/);
const duplicate=C.clone(layout);duplicate.walls.push(duplicate.walls[0]);
assert.match(C.validate(duplicate,catalog).errors.join(),/围墙/);
assert.throws(()=>C.normalize({schema:'invalid',...{buildings:[],walls:[],guards:[]}},catalog));
const old=JSON.parse(fs.readFileSync(`${__dirname}/rpc-contracts/pve-stage7.json`,'utf8'));
const migrated=C.normalize(old,catalog);assert.equal(migrated.buildings.length,9);assert.equal(migrated.walls.length,108);
assert.equal(migrated.guards[0].anchorId,'91009');
const corrupt=C.clone(old);corrupt.walls.outline=[[1,1],[1.5,1]];
assert.throws(()=>C.normalize(corrupt,catalog),/墙坐标/,'reject malformed legacy paths before interpolation');
const source=fs.readFileSync(`${__dirname}/native_boot.js`,'utf8');
const context={LocalNative:{editorPveLayouts:{},unit(sid,typeid,x,y,extra){return {sid,typeid,x,y,...extra};}},
    data:{unit_main:{50701:{}}},BATTLE_FACTION_DEFENDER:2};
const a=source.indexOf('        LocalNative.buildEditorPveVillage = function'),b=source.indexOf('        LocalNative.buildStageSevenVillage = function',a);
vm.runInNewContext(source.slice(a,b),context);
assert.equal(context.LocalNative.buildEditorPveVillage(7,10,20),null,'no approved layout changes existing behavior');
context.LocalNative.editorPveLayouts[7]={source:'user-authored-layout',units:[
    {sid:107001,typeid:20101,x:30,y:30,localNativeStableSid:true},
    {sid:107002,typeid:50701,x:36,y:28,localNativeStableSid:true},
    {sid:107003,typeid:10501,unit_type:105,unit_level:1,lv:1,did:'107002',localNativeGuard:true}
],walls:[[1,25,23,0]]};
const homeBefore=JSON.stringify(context.LocalNative.editorPveLayouts[7]);
const v=context.LocalNative.buildEditorPveVillage(7,1288,1288);
assert.equal(v.units[0].sto[2],1288);assert.equal(v.units[0].sto[1],1288);
assert.equal(v.units[2].did,'107002');assert.equal(v.units[2].lv,1);
assert.equal(context.data.unit_main[50701].volume,1);
assert.equal(context.LocalNative.buildEditorPveVillage(8,10,20),null);
assert.equal(JSON.stringify(context.LocalNative.editorPveLayouts[7]),homeBefore,'registry stays immutable');
console.log('PASS: layout geometry, collision checks, import round trip, malformed paths, legacy draft and native registry isolation');
