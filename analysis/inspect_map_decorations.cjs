// Inspect original map objects; never writes editor catalogs or game layouts.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=path.join(root,'.local/decor-catalog'),ctx={data:{}};
vm.createContext(ctx);
for(const file of ['.local/hero-reincarnate/unit_main.js','.local/layout-editor/skill-info/string_data.js'])
    vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx);
const shopFile=path.join(out,'UserConfig.js');
const assignment=fs.readFileSync(shopFile,'utf8').match(/^SHOP_CONFIG=([^\r\n]+);/m);
assert.ok(assignment,'Decode original Common/UserConfig.jsc before running');
vm.runInContext('SHOP_CONFIG='+assignment[1],ctx);
const shopFamilies=new Set(Object.values(ctx.SHOP_CONFIG).flat().filter(id=>id>=10000).map(id=>Math.floor(id/100)));
const text=key=>ctx.data.string_data[key]?.Chinese||null;
const category=id=>id<60501?'生物':id<61101?'草':id<61401?'蘑菇':id<61801?'树木':id<62101?'树桩':id<62401?'小石头':'大石头';
const rows=Object.values(ctx.data.unit_main).filter(r=>r.first_type===4).map(r=>({
    typeid:r.typeid,name:text(r.name),category:category(r.typeid),width:r.tilesize_x,height:r.tilesize_y,
    first_type:r.first_type,battle_type:r.battle_type,fixed:r.fixed,level:r.lv,
    home_res:r.home_res,battle_res:r.battle_res,resource_pve:r.resource_pve||null,
    description:text(r.describe),inShop:shopFamilies.has(Math.floor(r.typeid/100))
})).sort((a,b)=>a.typeid-b.typeid);
assert.equal(rows.length,29);
assert.ok(rows.every(r=>r.name&&r.width>0&&r.height>0&&r.level===1&&!r.inShop));
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'map-decorations.json'),JSON.stringify(rows,null,2)+'\n');
const report=['# 原版非商店地图对象清单','','状态：原表与商店配置静态核对通过；编辑器接入及验证见 [装饰物接入证据](layout-editor-decorations.md)，游戏显示待验证。',
    '', '原版 `unit_main` 中 `first_type=4` 的对象共 29 种，均为 1 级、`battle_type=7`、`fixed=1`。其中草、蘑菇、树木、树桩、石头共 25 种，另有 4 种生物。',
    '', '商店证据：`Common/UserConfig.jsc` 的 `SHOP_CONFIG` 全部菜单未收录这 29 个家族；`UI.SubShop.initLayout` 从该菜单生成商品，`_makeShopItemConfig` 从 `unit_main` 读取建筑商品。`Common/BaseConfig.jsc` 默认菜单也未列出 600 系列。此结论针对原包静态配置，不代表已逐个打开商店验收。',
    '', '| 类别 | 原版名称 | typeid | 占地 |','|---|---|---:|---|',
    ...rows.map(r=>`| ${r.category} | ${r.name} | ${r.typeid} | ${r.width}×${r.height} |`),
    '', '资源证据：植物、树桩和石头还带有 `resource_pve`，例如柏树 `61401` 的关卡资源为 `unit/ccb/pve_60802.ccbi`，主城资源为 `unit/ccb/60802.ccbi`。名字相似的 40801／40901 雪松属于另一组对象，不能合并编号。',
    '', '其他候选：404～409 系列包含大雪堆、小石堆、大石头、雪松等；421／424／425 为圣诞对象，428～431 为名称缺失的场景蛋对象。它们不属于上述 `first_type=4` 集合，部分缺少占地或中文名，需单独核对后再考虑加入编辑器。龙灵宝树 42600 已在商店 MENU2 中，不属于非商店对象。',
    '', '复核：运行 `node analysis/inspect_map_decorations.cjs`。依赖原表本地提取及 `.local/decor-catalog/UserConfig.js`；原始 JSON、反编译代码保存在 `.local/decor-catalog/`。本检查不更改编辑器、关卡注册表或设备。',
    '', '待办：实际关卡还须验证原版场景对象的创建、碰撞及战斗地图资源选择。此脚本仅核对原包对象定义、名称、占地和静态商店缺席。',''];
fs.writeFileSync(path.join(root,'analysis/evidence/map-decorations.md'),report.join('\n'));
console.log(JSON.stringify({objects:rows.length,plantsAndRocks:rows.filter(r=>r.category!=='生物').length,inShop:rows.filter(r=>r.inShop).length}));
