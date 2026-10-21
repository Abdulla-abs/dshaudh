# 单人奖励未入库与主城升级清空资源

状态：离线检查通过，新包已构建；上机复测待完成。

奖励根因：`grantPveLoot` 调用了 `addRes(type,amount)`，原版签名是 `addRes(value,type)`。它只操作战斗 ResourceManager，没有保存主城仓库存量。结算 `input_gains` 固定为空，未下发普通物品和英雄经验。进场时还把敌方可抢资源写为自己的资源余额。

升级根因：原版 `ResourceHolder.init` 从 `params.sto` 读库存。`onBuilderFinishBuilding` 刷新时会销毁并重建组件，旧完工回执只有等级和坐标，没有 sto。存档观察显示 20102 已完工但库存字段全部缺失。`persistFinishedUnit` 又误用无参数的 `unit.dumpData()`，失败后只保存等级、坐标和状态。原版 debug dump 实际是 `{buildings,player:{}}`，不能直接当登录数据存储。

其他确定缺口：原版资源生产器读取 `sto` 和以秒计的 `lpt`，本地旧字段是 `currentStorage` 和以小时计的 `lastCollectTime`。反复进主城的旧补资源逻辑没有检查 `starterResGranted`，会重复补库存及重置钻石。

修改：建筑字段边界补 sto、lpt。升级前读取原版资源和训练组件快照，并随完工回执传入。完工和周期保存使用有效的登录记录快照，保留资源、背包及奖励收据。新手资源仅发一次。战斗 self 使用自己的钱包。结算资源按库存容量写入保存的主城 sto，回城由原版初始化读取。物品按奖励表写背包，固定英雄入英雄列表，`sweep_hero_exp` 写已出征英雄经验。重复结算有收据保护。

原代码证据：`Components.jsc` 中 `ResourceHolder.init`、`ResourceProductor.init`、`ResourceManager.addRes`、`PackageManager.init/addItem`；`Unit.jsc` 中 `refresh` 和 `dumpData(level_data)`。`pve_stage` 的 `pve_first_reward`、`pve_roll_reward`、`sweep_hero_exp` 配合本地解码的 input 表。设备快照与定向解码在 `.local/pve-wallet-fix/`，前序奖励表解码在 `.local/hero-guide-entry/`。

验证：`check_native_pve_wallet.cjs` 用恢复的原版资源初始化验证升级前已消费余额不丢失，资源和物品重载后仍在，并检查容量上限。建筑、进场、结算和回城检查均通过；结算检查增加物品数量与重复回执不再发奖断言。尚需设备验证一次新结算、一次带库存升级及重启。

限制：资源按破坏比例的结算公式仍是兼容推断；未确定的多候选英雄池记录为待恢复，不任意选角色。旧档已经丢失的确切余额与历史每次闯关掉落无法从当前存档还原，本轮没有把余额重置为初始值。新首胜收据建立前，再次完成该关会补其首胜物品；历史固定第 2 关英雄已有独立收据，不重复发放。
