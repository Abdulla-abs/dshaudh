const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync('analysis/native_boot.js','utf8');
const start=src.indexOf('LocalNative.seedPlayerComponents = function');
const end=src.indexOf('LocalNative.lastBuildingCount',start);
const ctx={LocalNative:{writeStatus(){}},Number};vm.createContext(ctx);vm.runInContext(src.slice(start,end),ctx);
const table={1:{v_server_open:1,v_server_is_free:1,v_server_allow_in:1,v_server_name:'server1_name'},2:{v_server_name:'server2_name'}};
function run(id,saved){const rank={regionID:id};const p={region_id:saved,getAllRegionConfig:()=>table,getComponent:()=>rank};ctx.LocalNative.seedPlayerComponents(p);return rank;}
assert.equal(run(undefined,undefined).regionID,1);assert.equal(run(2,undefined).regionID,2);assert.equal(run(0,2).regionID,2);assert.equal(run(0,999).regionID,1);
console.log('PASS: missing/invalid region repaired; valid live/saved region preserved');
