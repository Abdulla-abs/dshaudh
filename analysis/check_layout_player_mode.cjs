// Compare every editor tier against the original count method and upgrade constructor.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const C=require('./layout-editor/core.js'),catalog=require('./layout-editor/catalog.json');
const dir='.local/layout-player-mode/',ctx={data:{},UI:{ShopBuildItemSimple:function(){}},
    Comp:{BuildingBuilder:function(){}},cc:{baseCtor(){}},BUILD_STATE_FINISH:2,G_Player:{getBaseLevel:()=>ctx.base}};
vm.createContext(ctx);
for(const name of ['unit_main','build_number'])vm.runInContext(fs.readFileSync(dir+name+'.js','utf8'),ctx);
function stock(file,start,end){const src=fs.readFileSync(file,'utf8'),a=src.indexOf(start),b=src.indexOf(end,a+start.length);assert.ok(a>=0&&b>a);vm.runInContext(src.slice(a,b),ctx);}
stock(dir+'Shop.js','UI.ShopBuildItemSimple.prototype.setExsitNum=','UI.ShopBuildItemSimple.prototype.refreshBuildNum=');
stock('analysis/disasm/Components.decompiled.js','Comp.BuildingBuilder=','cc.inherits(Comp.BuildingBuilder');
for(let base=1;base<=10;base++){
    ctx.base=base;
    for(const [family,rule] of Object.entries(C.playerRules.families)){
        if(!ctx.data.build_number[family])continue;
        const item={typeid:Number(family)*100,Num_Built:{setString(){}},setGray(){}};
        // Worker price is unrelated to count limits.
        ctx.WORKERTOWNID=-1;
        ctx.UI.ShopBuildItemSimple.prototype.setExsitNum.call(item,0);
        assert.equal(C.playerLimit({baseLevel:base},family).count,item.maxNum);
        let reachable=true;
        const entry=catalog.buildings.find(b=>b.family===Number(family));
        const levels=Number(family)===211?Array.from({length:10},(_,i)=>i+1):entry.levels.map(l=>l.level);
        for(const level of levels){
            const config=ctx.data.unit_main[Number(family)*100+level-1]||{};
            const builder=new ctx.Comp.BuildingBuilder({},config);
            reachable=reachable&&builder.upgradeAble&&builder.rely_base_lv<=base;
            const expected=Number(family)===201?level<=base:reachable;
            assert.equal(C.playerLimit({baseLevel:base},family).levels.includes(level),!!expected,`${family} lv${level} base${base}`);
        }
    }
}
const draft=C.empty();draft.mode='player';draft.baseLevel=8;
draft.buildings=[{id:'base',typeid:20108,level:8,x:30,y:30}];
assert.equal(C.validate(draft,catalog).errors.length,0);
const tooHigh=C.clone(draft);tooHigh.walls=[{x:12,y:12,level:9}];
assert.match(C.validate(tooHigh,catalog).errors.join(' '),/最高 8/);
assert.equal(C.normalize(tooHigh,catalog).mode,'player','invalid player imports remain repairable');
assert.ok(C.worsensPlayerLimits(draft,tooHigh));assert.equal(C.worsensPlayerLimits(tooHigh,draft),undefined);
const tooMany=C.clone(draft);tooMany.walls=Array.from({length:201},(_,i)=>({x:11+i%38,y:11+Math.floor(i/38),level:1}));
assert.ok(C.playerViolations(tooMany).some(i=>i.key==='count:211'));
tooMany.mode='free';assert.equal(C.playerViolations(tooMany).length,0);
const legacy=C.clone(draft);delete legacy.mode;delete legacy.baseLevel;assert.equal(C.normalize(legacy,catalog).mode,'free');
const save=JSON.parse(fs.readFileSync(dir+'save.json','utf8')),counts={};
for(const unit of save.level.units){const f=Math.floor(unit.typeid/100);counts[f]=(counts[f]||0)+1;}
const summary={date:C.playerRules.snapshot.date,instance:1,base:save.level.units.find(u=>Math.floor(u.typeid/100)===201).typeid,
    buildings:Object.entries(counts).map(([family,count])=>({family:Number(family),count,max:C.playerLimit({baseLevel:8},family).count,maxLevel:C.playerLimit({baseLevel:8},family).maxLevel}))};
fs.writeFileSync(dir+'audit-summary.json',JSON.stringify(summary,null,2));
console.log('PASS: all 10 tiers against recovered stock methods; off-by-one upgrades, traps, walls, repairable imports and legacy drafts');
