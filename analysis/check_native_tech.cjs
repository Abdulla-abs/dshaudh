const fs=require('node:fs'), vm=require('node:vm'), assert=require('node:assert/strict');
const source=fs.readFileSync(`${__dirname}/native_boot.js`,'utf8');
const stock=fs.readFileSync(`${__dirname}/../.local/knowledge-tree/TechComponent.js`,'utf8');
let disk, fail=false, now=1000, callbacks=0;
const c={LocalNative:{},data:{},GS_CURRENT_STAGE:1,GS_STAGE_BUILD:1,
    Comp:{TechManager:function(){},TechController:function(){}},
    G_UIManager:{isUIOpen:()=>false,isUICreate:()=>false},UI:{TechInterface:{},TechInfo:{}},
    DA:{getSystemCurrentTimeSec:()=>now}, G_SoundManager:{playSound(){}},SND:{}};
vm.createContext(c);
vm.runInContext(fs.readFileSync(`${__dirname}/../.local/knowledge-tree/tech.js`,'utf8'),c);
function load(name){const a=source.indexOf(`        LocalNative.${name} = function`),b=source.indexOf('\n        LocalNative.',a+1);assert.ok(a>=0&&b>a,name);vm.runInContext(source.slice(a,b),c);}
for(const n of ['snapshotResearch','restoreResearch','handleTrainTech','finishResearch','snapshotBuildingRecord','shopTransaction','tryDumpAndSave'])load(n);
function stockMethod(type,name){const a=stock.indexOf(`Comp.${type}.prototype.${name}=`),b=stock.indexOf('\nComp.',a+1);vm.runInContext(stock.slice(a,b),c);}
stockMethod('TechManager','onTechTrainingFinish');
stockMethod('TechController','onTechTrainingFinish');
let tm,tc,tree,rm;
const p={getComponent:n=>n==='TechManager'?tm:n==='ResourceManager'?rm:null,
    rpc_c_tech_training_complete:d=>{callbacks++;assert.equal(JSON.parse(disk).level.player.gained_techs[d.tech_id].lv,tm.gained_techs[d.tech_id].lv+1);tm.onTechTrainingFinish(d.tech_id);}};
Object.assign(c.LocalNative,{readRaw:()=>JSON.parse(disk),writeRaw:s=>{if(fail)throw Error('write failed');disk=JSON.stringify(s);},
    shopState(){},copyAccountProgress(){},writeStatus(){},syncSavedHomeWallet:l=>{rm.Res[3]=l.player.diamond;rm.Res[4]=l.player.spirit;rm.Res[1]=l.units[0].sto[1];},
    getBuildController:()=>({}),snapshotHeroEquipment(){},collectHomeBuildings:()=>[],getResourceManager:()=>rm,
    saveLevel:level=>c.LocalNative.writeRaw({level})});
c.G_Player=p;
c.G_UnitManager={getUnitBySID:()=>tree};
function reset(id,lv=0,exp=0){
    fail=false;now=1000;callbacks=0;
    tm=new c.Comp.TechManager();tc=new c.Comp.TechController();
    tm.gained_techs={[id]:{lv,exp}};tm.getTechTree=()=>tree;
    tm.getNextTechConfig=i=>c.data.tech[i*100+tm.gained_techs[i].lv+1];
    tm.invokeAffectedSelectors=()=>{};
    Object.assign(tc,{training_tech:0,trained_time:0,last_train_tech_time:0,
        getTrainingLeftTime:()=>tc.training_tech?tm.getNextTechConfig(tc.training_tech).train_time-tc.trained_time-(now-tc.last_train_tech_time):0});
    rm={Res:{1:1e9,2:1e9,3:100,4:100,9:100000}};
    tree={sid:'tree',typeid:21010,level:10,getComponent:n=>n==='TechController'?tc:n==='BuildingBuilder'?{state:2}:n==='ResourceStorage'?{currentStorage:{1:rm.Res[1],2:rm.Res[2]}}:null};
    disk=JSON.stringify({level:{player:{diamond:100,spirit:100,league_points:100000,gained_techs:tm.gained_techs},units:[{sid:'tree',typeid:21010,sto:{1:1e9,2:1e9}}]}});
}
function point(id,res=1){const cfg=tm.getNextTechConfig(id);if(res===1||res===2)rm.Res[res]-=cfg.stage_res_cost1;
    if(cfg.stage_res_cost2)rm.Res[cfg.resource_type2]-=cfg.stage_res_cost2;
    tm.gained_techs[id].exp++;
    if(tm.gained_techs[id].exp===cfg.level_stage_num)Object.assign(tc,{training_tech:id,last_train_tech_time:now,trained_time:0});
    return c.LocalNative.handleTrainTech(p,{tech_id:id,res_type:res});}
let rows=0;const types=new Set();
for(const cfg of Object.values(c.data.tech)){
    if(!cfg.treeid)continue;
    const id=cfg.treeid;reset(id,cfg.tech_lv-1,cfg.level_stage_num-2);
    assert.ok(point(id));let saved=JSON.parse(disk).level;
    assert.equal(saved.player.gained_techs[id].exp,cfg.level_stage_num-1);
    assert.equal(saved.player.gained_techs[id].lv,cfg.tech_lv-1);
    assert.equal(saved.units[0].sto[1],rm.Res[1],'prepaid wallet saved once');
    assert.equal(saved.player.league_points,rm.Res[9],'secondary cost saved');
    assert.ok(point(id));saved=JSON.parse(disk).level;
    assert.equal(saved.units[0].training_tech,id);
    assert.equal(c.LocalNative.finishResearch(p,0),false,'timer not expired');
    now+=cfg.train_time+1;
    assert.ok(c.LocalNative.finishResearch(p,0));
    assert.equal(tm.gained_techs[id].lv,cfg.tech_lv,'stock completion callback');
    assert.equal(JSON.parse(disk).level.player.gained_techs[id].lv,cfg.tech_lv,'restart level');
    assert.equal(JSON.parse(disk).level.units[0].training_tech,0);
    assert.equal(c.LocalNative.finishResearch(p,0),false);assert.equal(callbacks,1);
    rows++;types.add(cfg.tech_type);
}
const id=1001,cfg=c.data.tech[id*100+1];
reset(id,0,cfg.level_stage_num-1);point(id);
// Recreate components as a fresh login with a running saved timer.
const saved=JSON.parse(disk).level;tm.gained_techs=JSON.parse(JSON.stringify(saved.player.gained_techs));
Object.assign(tc,saved.units[0]);now+=cfg.train_time+1;
assert.ok(c.LocalNative.finishResearch(p,0));assert.equal(tm.gained_techs[id].lv,1);
reset(id);fail=true;assert.equal(point(id),false);assert.equal(tm.gained_techs[id].exp,0);assert.equal(rm.Res[1],1e9);
reset(id,0,cfg.level_stage_num-1);point(id);rm.Res[3]-=7;
assert.ok(c.LocalNative.finishResearch(p,id));assert.equal(JSON.parse(disk).level.player.diamond,93);
reset(id,0,cfg.level_stage_num-1);point(id);rm.Res[3]-=7;fail=true;
assert.equal(c.LocalNative.finishResearch(p,id),false);assert.equal(rm.Res[3],100);assert.equal(tm.gained_techs[id].lv,0);
fail=false;now+=cfg.train_time+1;assert.ok(c.LocalNative.finishResearch(p,0));
reset(id);assert.equal(point(id,999),false);assert.equal(tm.gained_techs[id].exp,0);
reset(id);tm.gained_techs[id].exp=2;rm.Res[1]-=cfg.stage_res_cost1*2;
assert.ok(c.LocalNative.handleTrainTech(p,{tech_id:id,res_type:1}),'rapid clicks share a callback frame');
assert.equal(JSON.parse(disk).level.player.gained_techs[id].exp,2);
assert.ok(c.LocalNative.handleTrainTech(p,{tech_id:id,res_type:1}),'second queued callback is harmless');
reset(id);assert.ok(point(id,2));assert.equal(JSON.parse(disk).level.units[0].sto[2],1e9-cfg.stage_res_cost1);
tm.gained_techs[id].exp=2;assert.ok(c.LocalNative.tryDumpAndSave());
assert.equal(JSON.parse(disk).level.player.gained_techs[id].exp,2,'periodic home save retains research');
reset(id,0,cfg.level_stage_num-1);point(id);now+=cfg.train_time+1;c.GS_CURRENT_STAGE=2;
assert.equal(c.LocalNative.finishResearch(p,0),false);c.GS_CURRENT_STAGE=1;assert.ok(c.LocalNative.finishResearch(p,0));
console.log(`PASS: ${rows} stock research levels, ${types.size} categories; progress, timer, stock callback, relog, acceleration, failure rollback, battle isolation`);
