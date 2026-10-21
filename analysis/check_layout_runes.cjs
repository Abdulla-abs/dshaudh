// Validate rune contracts and stock HeroEquipment functions recovered from bytecode.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),C=require('./layout-editor/core.js'),catalog=require('./layout-editor/catalog.json');
const ctx={data:{},Comp:{HeroEquipment:function(){}},cc:{baseCall(){}},DA:{debug(){}},
    BATTLE_FACTION_DEFENDER:2,JINGLING_DRAGON_TYPEID:115,RUNE_SKILL_LEVEL_RATE:[0,.6,.8,1],RUNE_SKILL_LEVEL_RLIMIT:3};
vm.createContext(ctx);
for(const file of ['.local/shop-treasure/item.js','.local/hero-reincarnate/unit_main.js','.local/hero-reincarnate/unit_battle.js',
    ...['rune_order','equipment_attribute','exclusive_attribute'].map(n=>'.local/layout-editor/runes/'+n+'.js')])
    vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx);
const original=fs.readFileSync(path.join(root,'.local/layout-editor/runes/HeroComponents.js'),'utf8');
function load(name,staticMethod=false,fixes=[]){
    const prefix='Comp.HeroEquipment'+(staticMethod?'.':'.prototype.')+name+'=';
    const start=original.indexOf(prefix),end=original.indexOf('\n    };',start);
    assert.ok(start>=0&&end>start,name);
    let code=original.slice(start,end+7);
    // The decompiler omits local declarations and loses operands inside OR expressions.
    // Correct only the assignments confirmed in HeroComponents.disasm.txt.
    for(const [from,to]of fixes){assert.ok(code.includes(from),from);code=code.replace(from,to);}
    code=code.replace(/\{/, '{var config,types,levels,i,ret,key,sum,skillno,typeid,rate,attr,rein,heroType,slot,eqp_list,equip;');
    vm.runInContext(code,ctx);
}
load('init');load('dump');load('getNeededForm',true);load('_getEquipSkillId');
load('_getEquipTypeLevel',false,[['(config.item_level || levels.push(0));','levels.push(config.item_level || 0);'],
    ['(config.rune_type || types.push(" "));','types.push(config.rune_type || " ");']]);
load('_getEquipSkillLevel');load('getExtraKeySkill');
load('getIdsValue',true,[['(config[name] || (attr=(attr + 0)));','attr += config[name] || 0;']]);
load('getEquipmentAttr',true,[['(config.reborn_times || (rein=0));','rein=config.reborn_times || 0;']]);
const five=(types,level)=>Array.from({length:5},(_,slot)=>types[slot]?{typeid:catalog.runes.items.find(i=>i.slot===slot&&i.type===types[slot]&&i.level===level).typeid}:null);
function stock(g){
    ctx.payload=JSON.stringify(g.runes);ctx.family=Math.floor(g.typeid/100);
    return vm.runInContext(`(()=>{const equipment=new Comp.HeroEquipment();equipment.master={faction:2,getOriginType:()=>family};
        equipment.init({}, {eqp:JSON.parse(payload)});const dumped={};equipment.dump(dumped);
        return {combination:equipment.getExtraKeySkill(),eqp:dumped.eqp};})()`,ctx);
}
for(const order of catalog.runes.orders)for(const level of [1,2,3])for(const family of [105,115]){
    const g={typeid:family*100+1,runes:five(order.key,level)};
    assert.deepEqual(C.runeErrors(g.runes,catalog),[]);
    assert.equal(C.runeCombination(g,catalog).skill,stock(g).combination[1],order.key);
}
const g={typeid:10501,runes:five('yy',3)};
g.runes[0].base_attr=[1201];g.runes[0].hero_attr=105;
assert.equal(stock(g).eqp[0].base_attr[0],1201);
const equipment=stock(g).eqp[0];
assert.equal(ctx.Comp.HeroEquipment.getEquipmentAttr(equipment,'life',10501),
    200+ctx.Comp.HeroEquipment.getIdsValue(ctx.data.exclusive_attribute[105].ID,'life'));
g.runes[0]=null;assert.equal(C.runeCombination(g,catalog),null);
for(const runes of [[],[{},null,null,null,null],[{typeid:7043},null,null,null,null],
    [{typeid:7003,base_attr:[1201,1201]},null,null,null,null],
    [{typeid:7003,base_attr:null},null,null,null,null],
    [{typeid:7003,hero_attr:null},null,null,null,null]])assert.ok(C.runeErrors(runes,catalog).length);
const layout=C.empty();layout.buildings=[{id:'flag',typeid:50701,level:1,x:30,y:30}];
layout.guards=[{id:'guard',typeid:10501,level:3,anchorId:'flag',runes:five('yy',3)}];
assert.deepEqual(C.normalize(C.clone(layout),catalog),layout);
layout.guards[0].runes[0]={typeid:7003,base_attr:[1201],two_attr:[1201],three_attr:[],hero_attr:105};
const compiled=JSON.parse(require('node:child_process').execFileSync('python',['-c',
    'import sys,json; sys.path.insert(0,"tools"); from import_pve_layout import compile_layout; print(json.dumps(compile_layout(json.load(sys.stdin))))'],
    {cwd:root,input:JSON.stringify(layout),encoding:'utf8'}));
ctx.LocalNative={editorPveLayouts:{},unit:()=>({})};ctx.compiled=compiled;
const boot=fs.readFileSync(path.join(root,'analysis/native_boot.js'),'utf8');
const a=boot.indexOf('LocalNative.buildEditorPveVillage = function('),b=boot.indexOf('\n        };',a);
assert.ok(a>=0&&b>a);vm.runInContext(boot.slice(a,b+11),ctx);
const village=ctx.LocalNative.buildEditorPveVillage(7,0,0,compiled);
const guard=village.units.find(u=>u.localNativeGuard);
assert.deepEqual(JSON.parse(JSON.stringify(guard.eqp)),compiled.units.at(-1).eqp);
ctx.payload=JSON.stringify(guard.eqp);
const originalEquip=vm.runInContext(`(()=>{const e=new Comp.HeroEquipment();e.master={faction:2,getOriginType:()=>105};
    e.init({}, {eqp:JSON.parse(payload)});return e;})()`,ctx);
assert.equal(originalEquip.getExtraKeySkill()[1],C.runeCombination(layout.guards[0],catalog).skill);
assert.equal(originalEquip.eqp[0].base_attr[0],1201);
console.log('PASS: 162 stock rune combination comparisons, equipment init/dump/attributes, slot validation and import round trip');
