const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const root = require('node:path').resolve(__dirname, '..');
const source = fs.readFileSync(root + '/analysis/native_boot.js','utf8');
const poolConfig=JSON.parse(fs.readFileSync(root+'/analysis/rpc-contracts/scout-pool.json'));
function environment(storage = new Map()) {
    let now=1000000; const timers=[], pending=[], n={};
    const sys={localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)}};
    function XHR(){this.open=(method,url,async)=>{assert.equal(method,'GET');assert.equal(async,true);this.url=url};this.send=()=>pending.push(this);this.abort=()=>{this.aborted=true;this.onerror()};}
    const ctx={LocalNative:n,sys,XMLHttpRequest:XHR,Date:{now:()=>now},cc:{log(){}},data:{unit_main:{}}};vm.createContext(ctx);
    function load(start,end){const a=source.indexOf(start),b=source.indexOf(end,a+1);assert.ok(a>=0&&b>a);vm.runInContext(source.slice(a,b),ctx);}
    load('        // BEGIN SCOUT LEVEL POOL','        LocalNative.handleEnterPveBattle = function');
    n.scheduleOnRoot=(fn,seconds)=>{timers.push({fn,seconds});return true};
    function respond(value,status=200){const xhr=pending.shift();assert.ok(xhr,'pending request');xhr.readyState=4;xhr.status=status;xhr.responseText=typeof value==='string'?value:Buffer.from(JSON.stringify(value),'utf8').toString('latin1');xhr.onreadystatechange();return xhr;}
    function entry(index=0){const e=JSON.parse(JSON.stringify(n.scoutLevelPool.levels[index]));e.id=String(index+1).padStart(64,'0');return e;}
    function manifest(entries,revision=1){return {schema:'dino-scout-cloud/v1',revision,levels:entries.map(e=>({id:e.id,name:e.layout.name.trim(),author:'test',headquartersLevel:e.headquartersLevel,createdAt:'2026-10-21'}))};}
    function payload(e){return {schema:'dino-scout-entry/v1',...e};}
    function sync(entries,revision=1){now+=301000;n.syncScoutCloudPool();const m=manifest(entries,revision);respond(m);while(pending[0]?.url.includes('/api/layouts/')){const id=pending[0].url.split('/').at(-1);respond(payload(entries.find(e=>e.id===id)));}if(pending.length)respond(m);}
    return {n,ctx,sys,storage,pending,timers,respond,entry,manifest,payload,sync,load,advance:()=>{now+=301000}};
}
const env=environment(), {n}=env, key=n.scoutCloudConfig.storageKey;
for(const text of ['巷子里的猫','中文 100% 🐱','café','%20 literal']) {
    assert.equal(n.decodeScoutCloudText(text),text);
    assert.equal(n.decodeScoutCloudText(Buffer.from(text,'utf8').toString('latin1')),text);
}
assert.equal(n.getScoutCandidatePool().levels.length,poolConfig.levels.length);
// Validate every existing compiled entry against client geometry, hero and rune rules.
n.scoutLevelPool.levels.forEach((e,i)=>n.validateScoutCloudEntry({...e,id:String(i+1).padStart(64,'0')}));
const first=env.entry(0),second=env.entry(1);
env.sync([first],1);assert.equal(n.scoutCloudLastStatus.step,'sync-ok');
assert.equal(n.getScoutCandidatePool().levels[0].id,first.id);
const one=JSON.stringify(n.scoutCloudState.snapshot), commitOne=env.storage.get(key+'.commit');
// Only added immutable entries download; a second unchanged sync uses a single manifest.
env.sync([first,second],2);assert.equal(n.scoutCloudState.snapshot.levels.length,2);
assert.equal(n.selectScoutLevel({units:[{typeid:20103}]},()=>.99).id,second.id);
env.advance();n.syncScoutCloudPool();env.respond(env.manifest([first,second],2));assert.equal(env.pending.length,0);assert.equal(n.scoutCloudLastStatus.step,'up-to-date');
const reload=environment(env.storage);assert.equal(reload.n.getScoutCandidatePool().levels.length,2);
// Failed downloads, unexpected HTML and revision races retain the complete previous snapshot.
const previous=JSON.stringify(n.scoutCloudState.snapshot),third=env.entry(2);
env.advance();n.syncScoutCloudPool();env.respond(env.manifest([third],3));env.respond('denied',403);
assert.equal(JSON.stringify(n.scoutCloudState.snapshot),previous);assert.equal(n.scoutCloudState.syncing,false);
env.advance();n.syncScoutCloudPool();env.respond('<html>challenge</html>');assert.equal(n.scoutCloudLastStatus.step,'sync-failed');
env.advance();n.syncScoutCloudPool();env.respond(env.manifest([third],3));env.respond(env.payload(third));env.respond(env.manifest([],4));assert.equal(JSON.stringify(n.scoutCloudState.snapshot),previous);
const invalid=structuredClone(third);invalid.layout.units[0].x=0;assert.throws(()=>n.validateScoutCloudEntry(invalid));
const duplicate=env.manifest([first,first],3);env.advance();n.syncScoutCloudPool();env.respond(duplicate);assert.equal(n.scoutCloudState.syncing,false);
// Publication removal replaces the previous cloud snapshot, empty pool falls back to built-in.
env.sync([second],3);assert.equal(n.getScoutCandidatePool().levels.length,1);assert.equal(n.getScoutCandidatePool().levels[0].id,second.id);
env.sync([],4);assert.equal(n.scoutCloudState.snapshot.levels.length,0);assert.equal(n.getScoutCandidatePool(),n.scoutLevelPool);
// Interrupted slot write cannot activate partial state; reload uses the last commit.
const failed=environment();failed.sync([first]);const saved=failed.storage.get(key+'.commit');
const set=failed.sys.localStorage.setItem;failed.sys.localStorage.setItem=(k,v)=>{if(k===key+'.commit')throw Error('disk full');set(k,v)};
assert.throws(()=>failed.n.commitScoutCloudSnapshot({schema:n.scoutCloudConfig.schema,baseUrl:n.scoutCloudConfig.baseUrl,revision:2,levels:[second]}));
assert.equal(failed.storage.get(key+'.commit'),saved);assert.equal(environment(failed.storage).n.getScoutCandidatePool().levels[0].id,first.id);
// If latest slot corrupts, recover only the previously committed slot.
const recover=environment();recover.sync([first],1);recover.sync([second],2);const pointer=JSON.parse(recover.storage.get(key+'.commit'));recover.storage.set(key+'.'+pointer.slot,'broken');
assert.equal(environment(recover.storage).n.getScoutCandidatePool().levels[0].id,first.id);
// Timeout + late XHR completion must only finish once and leave the old pool available.
const timeout=environment();timeout.n.syncScoutCloudPool();const old=timeout.pending[0];timeout.timers.find(t=>t.seconds===21).fn();assert.equal(timeout.n.scoutCloudState.syncing,false);
old.readyState=4;old.status=200;old.responseText=JSON.stringify(timeout.manifest([first]));old.onreadystatechange();assert.equal(timeout.n.scoutCloudState.snapshot,null);
// Use the actual battle constructor: a later sync must not mutate the active battle dict.
env.load('        LocalNative.buildEditorPveVillage = function','        // User reference screenshot');
env.load('        LocalNative.buildPveBattleDict = function','        // BEGIN SCOUT LEVEL POOL');
vm.runInContext(fs.readFileSync(root+'/.local/layout-player-mode/unit_main.js','utf8'),env.ctx);
Object.assign(n,{lookupUnitMain:id=>env.ctx.data.unit_main[id],tryDumpAndSave(){},readRaw:()=>({level:{units:[],player:{}}}),collectAttackHerosForPve:()=>[],collectBattleSoldiers:()=>({}),getResourceManager:()=>({Res:{1:100,2:100},maxRes:{1:10000,2:10000}}),makeBattleSide:(p,e)=>({player:p,...e}),unit:(sid,typeid,x,y,extra)=>({sid,typeid,x,y,...extra}),editorPveLayouts:{}});
env.sync([first],5);const dict=n.buildPvpBattleDict({units:[{typeid:20103}],player:{}}),frozen=JSON.stringify(dict);env.sync([second],6);assert.equal(JSON.stringify(dict),frozen);
assert.equal(dict.localNativeScoutLevelId,first.id);assert.equal(n.getScoutCandidatePool().levels[0].id,second.id);
let runtimeLevels=0;
if(process.argv[2]) {
    const runtime=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
    n.commitScoutCloudSnapshot(runtime);
    const battle=n.buildPvpBattleDict({units:[{typeid:20108}],player:{}});
    assert.ok(runtime.levels.some(e=>e.id===battle.localNativeScoutLevelId));
    runtimeLevels=runtime.levels.length;
}
assert.ok(!Array.from(env.storage.keys()).includes('dino.local.native.v1'),'no player save writes');
const result={passed:true,builtinLayoutsValidated:poolConfig.levels.length,runtimeLevels,checks:['utf8-and-latin1','download-and-commit','cache-restart','uniform-selection','reuse','unchanged','network-failure','html-challenge','revision-race','invalid-geometry','duplicate-ids','unpublish','empty-fallback','atomic-commit-failure','corrupt-cache-recovery','timeout-late-callback','battle-snapshot','player-save-isolation']};
fs.mkdirSync(root+'/.local/scout-cloud',{recursive:true});fs.writeFileSync(root+'/.local/scout-cloud/native-check-result.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
