const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`,'utf8');
const values = {};
const ctx = {LocalNative:{},SCHEMA:1,STORE_KEY:'save',sys:{localStorage:{
    getItem:k=>values[k],setItem:(k,v)=>{values[k]=v;}}}};
vm.createContext(ctx);
for (const [name,next] of [['validateStore','loadOrCreate'],['writeRaw','defaultPlayer']]) {
    const a=source.indexOf(`        LocalNative.${name} = function`);
    const b=source.indexOf(`        LocalNative.${next} = function`,a+1);
    vm.runInContext(source.slice(a,b),ctx);
}
vm.runInContext(`
var saved={version:1,level:{player:{nickname:'Player'},units:[{sid:'2',typeid:20602,x:20,y:28}],
    walls:[],user_config:{rookie0:123},model_info:{},hero_donate_list:[]}};
if (!LocalNative.validateStore(saved)) throw Error('Stock string SID rejected');
LocalNative.writeRaw(saved);
saved.level.player.nickname='Updated'; LocalNative.writeRaw(saved);
`,ctx);
assert.equal(JSON.parse(values['save.previous']).level.player.nickname,'Player');
const good=values.save;
assert.throws(()=>vm.runInContext('LocalNative.writeRaw({version:1,level:{}})',ctx),/previous save preserved/);
assert.equal(values.save,good);
assert.equal(source.includes('LocalNative.resetCorruptStore'),false);
assert.equal(/removeItem\(STORE_KEY\)/.test(source),false);
console.log('PASS: stock string SID accepted, prior revision saved, invalid writes and startup errors cannot delete progress');
