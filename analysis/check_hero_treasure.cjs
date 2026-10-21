const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const path = require('node:path'), root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(__dirname, 'native_boot.js'), 'utf8');
const ctx = {LocalNative:{}, data:{}, Math:Object.create(Math)};
vm.createContext(ctx);
for (const name of ['item','item_input','input_event_client','resource_input'])
    vm.runInContext(fs.readFileSync(path.join(root, '.local/shop-treasure', name + '.js'), 'utf8'),ctx);
const beforeTables = JSON.stringify(ctx.data);
function load(start, end) {
    const a=source.indexOf('        LocalNative.'+start), b=source.indexOf('        LocalNative.'+end,a+1);
    assert.ok(a>=0 && b>a); vm.runInContext(source.slice(a,b),ctx);
}
load('rebirthTreasurePolicy =','shopState =');
load('shopState =','shopTransaction =');
load('shopRollItemEvent =','handleShopBuyPackage =');
const n=ctx.LocalNative;
let seed;
ctx.Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
n.shopAddItem=(level,typeid,num)=>{
    assert.ok(ctx.data.item[typeid]); assert.ok(Number.isInteger(num) && num>0);
    const item={typeid,num}; level.items.push(item); return item;
};
n.grantPveLoot=(gold,wood)=>({gold,wood});
const contract=JSON.parse(fs.readFileSync(path.join(__dirname,'rpc-contracts/hero-treasure.json')));
const policy=n.heroTreasurePolicy, results={};
const level=()=>({player:{diamond:0,spirit:0},items:[]});
for (const id of [1501,1502,1503]) {
    const p=policy[id], rule=contract.tiers[id];
    assert.equal(p.fragmentMultiplier,contract.fragmentMultiplier);
    const stages=ctx.data.input_event_client;
    const fragmentEvents=stages[p.fragmentStage].putin_event_item;
    for (const eventId of fragmentEvents) for (let trial=1;trial<=20;trial++) {
        seed=trial; const old=n.shopRollItemEvent(level(),eventId)[0][1];
        seed=trial; const updated=n.shopRollItemEvent(level(),eventId,{quantityMultiplier:p.fragmentMultiplier})[0][1];
        assert.equal(updated.typeid,old.typeid); assert.equal(updated.num,old.num*2);
        assert.equal(ctx.data.item[updated.typeid].is_piece,1);
    }
    const eventIds=Object.keys(p.boostedStages).flatMap(stage=>stages[stage].putin_event_item);
    for (const eventId of eventIds) {
        const item=ctx.data.item_input[eventId].item_id;
        assert.ok([...rule.wantedItems,...rule.crystalItems].includes(item));
    }
    function sample(usePolicy) {
        n.heroTreasurePolicy=usePolicy?policy:{}; seed=20261019;
        const saved=level(), counts={wanted:0,crystal:0,both:0}, perItem={}, quantities=new Set();
        // A full previous cap must not throttle the new independent rolls.
        n.shopState(saved);
        if (usePolicy) for(const e of eventIds) saved.localShop.itemCounters[e]={attempts:1,wins:999,misses:999};
        const counters=JSON.stringify(saved.localShop.itemCounters);
        for(let run=0;run<20000;run++) {
            saved.items=[];
            n.shopTreasureRewards(saved,id);
            const fragments=saved.items.filter(x=>ctx.data.item[x.typeid].is_piece);
            assert.equal(fragments.length,1,'every box retains one fragment reward');
            quantities.add(fragments[0].num);
            if(usePolicy) assert.ok(rule.fragmentQuantities.includes(fragments[0].num));
            let wanted=0,crystal=0;
            for(const x of saved.items) {
                if(rule.wantedItems.includes(x.typeid)){wanted++;assert.equal(x.num,1);}
                if(rule.crystalItems.includes(x.typeid)){crystal++;assert.equal(x.num,1);}
                if(rule.wantedItems.includes(x.typeid)||rule.crystalItems.includes(x.typeid))
                    perItem[x.typeid]=(perItem[x.typeid]||0)+1;
            }
            assert.ok(wanted<=1&&crystal<=1);
            counts.wanted+=wanted;counts.crystal+=crystal;counts.both+=wanted&&crystal;
        }
        if(usePolicy) for(const e of eventIds)
            assert.deepEqual(saved.localShop.itemCounters[e],JSON.parse(counters)[e],'old capped counter remains untouched');
        return {rates:Object.fromEntries(Object.entries(counts).map(([k,v])=>[k,v/20000])),
            perItemRates:Object.fromEntries(Object.entries(perItem).map(([k,v])=>[k,v/20000])),
            fragmentQuantities:[...quantities].sort((a,b)=>a-b)};
    }
    const old=sample(false), updated=sample(true);
    assert.deepEqual(updated.fragmentQuantities,rule.fragmentQuantities);
    for(const key of ['wanted','crystal']) {
        assert.ok(Math.abs(updated.rates[key]-rule[key+'Chance'])<.015);
        assert.ok(updated.rates[key]>old.rates[key]);
    }
    for(const item of [...rule.wantedItems,...rule.crystalItems])
        assert.ok(updated.perItemRates[item]>old.perItemRates[item],'each existing tier becomes more frequent');
    assert.ok(Math.abs(updated.rates.both-rule.wantedChance*rule.crystalChance)<.015);
    results[id]={runs:20000,old,updated};
}
n.heroTreasurePolicy=policy;
assert.equal(JSON.stringify(ctx.data),beforeTables);
fs.mkdirSync(path.join(root,'.local/hero-treasure'),{recursive:true});
fs.writeFileSync(path.join(root,'.local/hero-treasure/check-result.json'),JSON.stringify(results,null,2));
console.log('PASS: every fragment alternative doubled; all item tiers boosted; independent stages; old cap bypass; original tables intact');
for(const [id,result] of Object.entries(results)) console.log(id,JSON.stringify({old:result.old.rates,updated:result.updated.rates,quantities:result.updated.fragmentQuantities}));
