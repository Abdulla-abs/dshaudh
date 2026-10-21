const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const ctx={data:{},LocalNative:{},Math:Object.create(Math)};let seed=7;
ctx.Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);vm.createContext(ctx);
for(const n of ['item','itemshop_sell','period_control'])vm.runInContext(fs.readFileSync(`${__dirname}/../.local/trader/${n}.js`,'utf8'),ctx);
const source=fs.readFileSync(`${__dirname}/native_boot.js`,'utf8');
for(const [a,b]of [['shopPick =','shopTransaction ='],['traderPolicy =','syncTrader =']]){const p=source.indexOf('        LocalNative.'+a),q=source.indexOf('        LocalNative.'+b,p+1);assert.ok(p>=0&&q>p);vm.runInContext(source.slice(p,q),ctx);}
const n=ctx.LocalNative;n.installTraderPolicy();const table=JSON.stringify(ctx.data.itemshop_sell);
const pick=n.pickTraderOfferIds,random=ctx.Math.random;
let samples=[[131,1,2,3,4,5,6,7],[131],[131],[131],[131],[131]];
n.pickTraderOfferIds=()=>samples.shift();ctx.Math.random=()=>0;
const forced={player:{}};n.ensureTrader(forced,true);
for(const id of [131,134,135,25,26,27])assert.ok(forced.localTrader.items.some(x=>x[0]===id),'all fruits and rune coexist');
assert.equal(new Set(forced.localTrader.items.map(x=>x[0])).size,8);
samples=[[131,1,2,3,4,5,6,7],[131],[131],[131],[131],[131]];ctx.Math.random=()=>0.34;
const excluded={player:{}};n.ensureTrader(excluded,true);
for(const id of [134,25,26,27])assert.ok(!excluded.localTrader.items.some(x=>x[0]===id));
n.pickTraderOfferIds=pick;ctx.Math.random=random;
const counts={1119:0,1120:0,1121:0,210021:0,210022:0,7221:0},trials=20000;
for(let i=0;i<trials;i++){const l={player:{}};n.ensureTrader(l,true);const ids=l.localTrader.items.map(x=>x[0]);assert.equal(ids.length,8);assert.equal(new Set(ids).size,8);for(const id of ids){const item=ctx.data.itemshop_sell[id].item_id;if(item in counts)counts[item]++;}}
const rates=Object.fromEntries(Object.entries(counts).map(([k,v])=>[k,v/trials]));
for(const id of [1119,1120,1121]){assert.ok(Math.abs(rates[id]-rates[210021])<0.015);assert.ok(Math.abs(rates[id]/rates[7221]-1/3)<0.025);}
assert.equal(JSON.stringify(ctx.data.itemshop_sell),table);
const l={player:{}};n.ensureTrader(l,true);l.localTrader.items[0][1]=0;const old=JSON.stringify(l.localTrader);assert.equal(n.ensureTrader(l,false),false);assert.equal(JSON.stringify(l.localTrader),old);
const result={trials,seed:7,counts,rates,rule:'Each mutation fruit and primary unlock fruit independently occurs with p/3; advanced unlock fruit p/6.'};
fs.mkdirSync(`${__dirname}/../.local/trader-kiwi`,{recursive:true});fs.writeFileSync(`${__dirname}/../.local/trader-kiwi/unseal-parity.json`,JSON.stringify(result,null,2));console.log('PASS mutant fruits: '+JSON.stringify(result));
