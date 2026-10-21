# 英雄安置点与出征队列

状态：根因和契约已确认，修复离线通过，上机显示待验。

触发：龙英巢升到二级后，主城显示 0/2，巢内显示英雄个数 1/0。迪诺卡片和出征队列均为空。

原代码证据：`HeroManager.init` 从玩家字段读取 `hero_slot_num`、`hero_slot_buy_num`，缺失时取 0。`getHeroCapacity` 和 `getHeroSlotNum` 都返回 `hero_slot_num`。`UI.Hero.loadHeroScroll` 按安置点总数加载已拥有英雄与空闲位置，再追加扩容入口。`refreshHeroNum` 的分子是 `getAllHero().length`，分母是安置点容量。安置点总数与建筑等级独立。

主城建筑上方数字由 `BuildingInfoProgress._setAttackHerosCapacity` 设置，分子为 `getAllAttackHero().length`，分母为 `hero_number[target.level].hero_attack_num`。一级到十级出征上限依次为 1、2、3、3、4、4、5、5、6、6，并非每级都加一。出征队列是已拥有英雄的状态选择，不产生额外英雄。

`HeroAttributeController.init` 读取 `params.aidx`，队列位置从 0 开始；界面用该值索引 `teams`。`params.attack_index` 不会被读取。初始化还直接解析 `rct`、`aht`。时间缺失后，`refreshHealth` 的计算得到 NaN，`isAlive` 的比较失败，`getState` 返回不可出征的死亡状态。这里是数据缺失导致的错误分类，不是英雄实际死亡。

原字节码和定向解码在 `.local/hero-slots/`。`HeroManager.init` 的逻辑或默认赋值被反编译器误排为独立表达式；已核对字节码 `007bfb` 到 `007c27`。小型恢复函数保存在 `analysis/evidence/hero-slot-stock.js`，注明该处按字节码还原。

运行时观察：设备存档有一个 `10401` 迪诺，`state=1,life=400,health=12`，但使用 `attack_index=1`，缺少 `aidx`、`rct` 和 `aht`。玩家缺少两个安置点字段。二级龙英巢 `20602` 已正确持久化。完整快照在 `.local/hero-slots/dino.local.native.v1.json`。

修改：默认玩家补最低 1 个安置点和购买次数 0；这是本地兼容值，不是已确认的官方初始数量。迪诺写 `aidx=0` 和当前恢复时间；旧档仅迁移本地默认迪诺的缺失字段。已有扩容数量、明确的队列位置和其他英雄不变。原版管理器、界面与状态机未改。

验证：`node analysis/check_native_hero_contract.cjs` 用原版属性初始化和体力刷新复现容量 0、体力 NaN、不可出征，再验证补齐后的迪诺仍可出征。存档迁移幂等，已有扩容值保持不变。建筑与回城检查通过。待上机核对迪诺卡片、主城 1/2 和第一个出征位置。
