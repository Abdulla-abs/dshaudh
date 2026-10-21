const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const src = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
const local = `${__dirname}/../.local/rune-rehandle/`;
const ctx = {LocalNative: {}, data: {}, GS_CURRENT_STAGE: 1, GS_STAGE_BUILD: 1};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(local + 'item.js', 'utf8'), ctx);
for (const name of ['saveLevel', 'shopState', 'shopTransaction', 'shopSync', 'shopAddItem',
    'snapshotHeroEquipment', 'runeRehandleTarget', 'handleRuneUpgrade', 'unlockRuneUpgrade',
    'runShopRequest', 'installCallServer']) {
    const a = src.indexOf(`        LocalNative.${name} = function`), b = src.indexOf('\n        LocalNative.', a + 1);
    assert.ok(a >= 0 && b > a, name); vm.runInContext(src.slice(a, b), ctx);
}
vm.runInContext(`
var UI={EquipmentUpgrade:function(){},EquipmentInfo:{UIID:7},AlchemyInterface:{UIID:4},Hero:{UIID:3}};
UI.EquipmentUpgrade.UIID=1; UI.EquipBaseOperate={UI_STATE_HERO:1,UI_STATE_ALCHEMY:2};
var ClientPlayer=function(){}, Comp={HeroEquipment:function(){}};
var disk,pm,rm,hero,eq,upgrade,gold,failWrite,commits,answers,notices,queue,unlocked,fx,statuses;
var DA={makeSelector:function(){return null;},debug:function(){}};
var SND={EQUIP_UPGRADE:1}; var G_SoundManager={playSound:function(){}};
var G_MainController={setNotice:function(x){notices.push(x);}};
var G_UIManager={get_ui:function(id){return id===1?upgrade:id===3?
    {selectedItem:{hero:hero},equipPanel:{controller:{refreshEquipmentUI:function(){}}}}:
    {refreshCurrentUI:function(){},setTouchDisabled:function(){},changeEquipment:function(){}};},
    isUIOpen:function(){return true;}, open_ui:function(){}, close_ui:function(){}};
var building={sid:'bank',getComponent:function(n){return n==='BuildingBuilder'?{}:null;}};
var G_UnitManager={getUnitBySID:function(sid){return String(sid)==='bank'?building:
    hero&&String(sid)===String(hero.sid)?hero:{sid:'player'};}};
var G_Player=new ClientPlayer();
G_Player.getComponent=function(n){return n==='PackageManager'?pm:n==='ResourceManager'?rm:null;};
Object.assign(LocalNative,{callLog:[],readRaw:function(){return JSON.parse(disk);},
    writeRaw:function(s){if(failWrite)throw Error('write failure');disk=JSON.stringify(s);commits++;},
    writeStatus:function(s){statuses.push(s);},copyAccountProgress:function(){},unlockHeroFeedIfNeeded:function(){},
    snapshotBuildingRecord:function(){return {sid:'bank',typeid:20301,sto:{1:0,2:gold}};},
    lookupUnitMain:function(){return {wood_storage:1000000,gold_storage:2000000};},
    syncSavedHomeWallet:function(level){gold=level.units[0].sto[2];rm.Res[2]=gold;},
    scheduleOnRoot:function(fn){queue.push(fn);return true;}});
`, ctx);
function stock(file, prefix, names) {
    const s = fs.readFileSync(file, 'utf8');
    for (const name of names) {
        const a = s.indexOf(`${prefix}.prototype.${name}=`), b = s.indexOf('\n', s.indexOf('    };', a));
        assert.ok(a >= 0 && b > a, name); vm.runInContext(s.slice(a, b), ctx);
    }
}
stock(local + 'Equipment.js', 'UI.EquipmentUpgrade',
    ['onPressUpgrade', 'realUpgrade', 'afterReceUpgradeResult', 'afterPlayUpgradeFx']);
stock(`${__dirname}/../.local/arena-audit/Client_ClientUnits_ClientPlayer.js`, 'ClientPlayer',
    ['rpc_c_upgrade_equip_ans', 'rpc_c_upgrade_equip_ans2']);
stock(`${__dirname}/../.local/hero-dismiss/HeroComponents.js`, 'Comp.HeroEquipment',
    ['upgradeEquipmentAns', '_takeOffEquipment', '_putOnEquipment', 'getEquipment']);
ctx.Comp.HeroEquipment.getEquipmentAttr = function() { return 0; };
// Decompiler turned `pkgid = config.item_type || 0` into a no-op expression.
ctx.UI.EquipmentUpgrade.prototype.realUpgrade = function() {
    const config = ctx.data.item[this.equip.typeid];
    const upType = config && config.item_can_be_update_to && config.item_can_be_update_to[0];
    const upConf = upType && ctx.data.item[upType];
    if (!upConf || !config) return;
    const price = upConf.item_update_res_need;
    if (price && !ctx.G_Player.getComponent('ResourceManager').useRes(price[1], price[0])) return false;
    if (ctx.UI.EquipBaseOperate.UI_STATE_HERO === this.state && this.hero) {
        ctx.G_Player.callServer('rpc_s_upgrade_equipment', {
            sid: this.hero.getSid(), slot: this.equip.slot,
            hero_pieces: this.heropieces, prop_pieces: this.proppieces
        });
    } else if (ctx.UI.EquipBaseOperate.UI_STATE_ALCHEMY === this.state) {
        ctx.G_Player.callServer('rpc_s_upgrade_equipment_package', {
            pkgid: config.item_type || 0, oid: this.equip.oid,
            hero_pieces: this.heropieces, prop_pieces: this.proppieces
        });
    }
    this.setTouchDisabled(true);
};
// Decompiler mangled braces; keep the bytecode control flow: success updates gear, else notices failure.
ctx.ClientPlayer.prototype.rpc_c_upgrade_equip_ans = function(dict) {
    if (dict.succeed) {
        ctx.G_MainController.setNotice('upgrade_equip_success');
        const unit = ctx.G_UnitManager.getUnitBySID(dict.sid);
        const heroEqp = unit && unit.getComponent('HeroEquipment');
        if (heroEqp) heroEqp.upgradeEquipmentAns(dict.slot, dict.new_equip);
    } else ctx.G_MainController.setNotice('upgrade_equip_failed');
    if (ctx.G_UIManager.isUIOpen(ctx.UI.EquipmentUpgrade.UIID))
        ctx.G_UIManager.get_ui(ctx.UI.EquipmentUpgrade.UIID).afterReceUpgradeResult(dict.new_equip, dict.succeed);
};
ctx.LocalNative.installCallServer(ctx.G_Player);
vm.runInContext(`
function reset(kind, typeid) {
    GS_CURRENT_STAGE=1; queue=[]; gold=900000; failWrite=false; commits=answers=unlocked=fx=0; notices=[]; statuses=[];
    var rune={oid:'r1',typeid:typeid||7001,num:1,base_attr:[1101,1102],two_attr:[1201],three_attr:[],hero_attr:1002,marker:'keep'};
    var pkg={}; ['material','based_prop','advanced_prop','formula'].forEach(function(n){pkg[n]={capacity:100,item_dict:{}};});
    pkg.based_prop.item_dict={a:{oid:'a',typeid:5001,num:30},b:{oid:'b',typeid:2001,num:30}};
    pkg.formula.item_dict={bp:{oid:'bp',typeid:7102,num:1}};
    pm={package:pkg,init:function(p){this.package=JSON.parse(JSON.stringify(p.package));}};
    rm={Res:{2:gold,3:100,4:50},useRes:function(n,type){gold-=n;this.Res[type]=gold;return true;}};
    hero={sid:kind==='string'?'local_hero_1':23,getSid:function(){return this.sid;},
        getComponent:function(n){return n==='HeroEquipment'?eq:n==='HeroAttributeController'?
            {setMaxLife:function(){},addLife:function(){}}:null;}};
    eq=new Comp.HeroEquipment(); eq.eqp=[kind==='package'?null:rune]; eq.master=hero;
    eq.getOpenedSlots=function(){return 1;};
    if(kind==='package') pm.package.advanced_prop.item_dict.r1=rune; else rune.slot=0;
    upgrade=new UI.EquipmentUpgrade();
    upgrade.state=kind==='package'?UI.EquipBaseOperate.UI_STATE_ALCHEMY:UI.EquipBaseOperate.UI_STATE_HERO;
    upgrade.hero=kind==='package'?null:hero; upgrade.equip=rune;
    upgrade.heropieces={5001:30}; upgrade.proppieces={2001:30};
    upgrade._isMaterialEnough=function(){return true;}; upgrade.isDisabled=false;
    upgrade.setTouchDisabled=function(v){this.disabled=!!v;};
    upgrade.upgradeButtonNode={button:{setEnabled:function(){}}};
    upgrade.rootNode={animationManager:{runAnimations:function(){fx++;}}};
    upgrade.cleanUp=function(){}; upgrade.changeEquipment=function(item){this.equip=item;};
    upgrade.master={afterUpgrade:function(){}};
    var orig=UI.EquipmentUpgrade.prototype.afterReceUpgradeResult;
    upgrade.afterReceUpgradeResult=function(new_equip, succeed){
        if(!new_equip||!succeed){unlocked++; this.setTouchDisabled(false); return;}
        answers++; return orig.call(this, new_equip, succeed);
    };
    disk=JSON.stringify({keep:'unrelated',level:{units:[{sid:'bank',typeid:20301,sto:{1:0,2:gold}}],
        player:{package:pkg,diamond:100,spirit:50},
        heros:[{sid:hero.sid,typeid:10401,eqp:eq.eqp,skill_slots:[{sid:1,lv:2}]}]}});
}
function flush(){while(queue.length)queue.shift()();}
function count(type){return Object.values(pm.package).reduce(function(sum,b){
    return sum+Object.values(b.item_dict).reduce(function(n,i){return n+(i.typeid===type?i.num:0);},0);},0);}
`, ctx);
const run = x => vm.runInContext(x, ctx);
const disk = () => JSON.parse(ctx.disk);
const n = ctx.LocalNative;

for (const kind of ['package', 'numeric', 'string']) {
    run(`reset('${kind}', 7001); upgrade.onPressUpgrade(); flush();`);
    assert.equal(ctx.commits, 1);
    assert.equal(ctx.gold, 500000, 'stock prepayment only');
    assert.equal(run('count(5001)+count(2001)+count(7102)'), 0);
    assert.equal(ctx.answers, 1); assert.equal(ctx.fx, 1);
    assert.ok(ctx.notices.includes('upgrade_equip_success'));
    const saved = kind === 'package'
        ? disk().level.player.package.advanced_prop.item_dict.r1
        : disk().level.heros[0].eqp[0];
    assert.equal(saved.typeid, 7002);
    assert.equal(saved.oid, 'r1');
    assert.equal(saved.hero_attr, 1002);
    assert.deepEqual(saved.base_attr, [1101, 1102]);
    assert.deepEqual(saved.two_attr, [1201]);
    assert.equal(saved.marker, 'keep');
    const live = kind === 'package' ? ctx.pm.package.advanced_prop.item_dict.r1
        : ctx.eq.eqp[0];
    assert.equal(live.typeid, 7002);
}

run("reset('package', 7002); pm.package.based_prop.item_dict.a.num=80; pm.package.based_prop.item_dict.b.num=80;");
run("pm.package.formula.item_dict.bp.typeid=7103; upgrade.heropieces={5001:80}; upgrade.proppieces={2001:80};");
run("gold=1500000; rm.Res[2]=gold; var d=JSON.parse(disk); d.level.player.package=pm.package; d.level.units[0].sto[2]=gold; disk=JSON.stringify(d);");
run("upgrade.equip.typeid=7002; upgrade.onPressUpgrade(); flush();");
assert.equal(disk().level.player.package.advanced_prop.item_dict.r1.typeid, 7003);
assert.equal(ctx.gold, 500000);
assert.equal(run('count(7103)'), 0);

const committed = ctx.disk;
run("reset('package', 7001); failWrite=true; upgrade.onPressUpgrade(); flush();");
assert.equal(ctx.commits, 0); assert.equal(ctx.gold, 900000);
assert.equal(run('count(5001)'), 30); assert.equal(ctx.unlocked, 1); assert.equal(ctx.answers, 0);

run("reset('package', 7001); upgrade.heropieces={5001:29}; upgrade.onPressUpgrade(); flush();");
assert.equal(ctx.commits, 0); assert.equal(ctx.unlocked, 1); assert.equal(ctx.gold, 900000);

run("reset('package', 7003); upgrade.onPressUpgrade(); flush();");
assert.equal(ctx.commits, 0); assert.equal(ctx.answers, 0);

run("reset('package', 7001); GS_CURRENT_STAGE=2; upgrade.onPressUpgrade(); flush();");
assert.equal(ctx.commits, 0);

let paths = 0;
for (const [id, cfg] of Object.entries(ctx.data.item)) {
    if (Number(cfg.item_type) !== 2 || Number(cfg.item_subID) !== 9 || !cfg.item_can_be_update_to) continue;
    const nextId = cfg.item_can_be_update_to[0], next = ctx.data.item[nextId];
    if (!next || !next.item_update_mat_need || !next.item_update_res_need) continue;
    const recipe = next.item_update_mat_need, cost = next.item_update_res_need;
    run(`reset('package', ${Number(id)});`);
    ctx.pm.package.based_prop.item_dict.a.num = recipe[0][1];
    ctx.pm.package.based_prop.item_dict.b.num = recipe[1][1];
    ctx.pm.package.formula.item_dict.bp = {oid: 'bp', typeid: recipe[2][0], num: recipe[2][1]};
    ctx.upgrade.heropieces = {5001: recipe[0][1]};
    ctx.upgrade.proppieces = {2001: recipe[1][1]};
    ctx.gold = Number(cost[1]) + 1000;
    const d = disk();
    d.level.player.package = ctx.pm.package;
    d.level.units[0].sto[2] = ctx.gold;
    ctx.disk = JSON.stringify(d);
    ctx.rm.Res[2] = ctx.gold;
    run('upgrade.onPressUpgrade(); flush();');
    const saved = disk().level.player.package.advanced_prop.item_dict.r1;
    assert.equal(saved.typeid, nextId, id);
    assert.equal(saved.oid, 'r1');
    assert.equal(ctx.gold, 1000);
    assert.equal(ctx.commits, 1);
    paths++;
}
assert.equal(paths, 30);
assert.match(src, /methodName === 'rpc_s_upgrade_equipment'/);
assert.match(src, /methodName === 'rpc_s_upgrade_equipment_package'/);
console.log('PASS: rune upgrade package/numeric/string, attribute preserve, prepaid gold, materials, lv2->3, failures and all 30 paths');
