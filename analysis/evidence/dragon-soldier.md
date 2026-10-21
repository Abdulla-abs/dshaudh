# 龙兵部署与消耗

状态：离线通过，已保留数据覆盖安装实例 1，游戏内待复测。

触发：训练后的龙兵无法在进攻中部署。用户确认龙兵按出战数量消耗。

根因：`buildPveBattleDict` 将 `self.soldiers` 固定为 `{}`。原版部署栏从该字段读取兵种和数量。本地还遗漏了 `rpc_s_dispatch_soldier`，即使恢复部署栏也不会保存消耗。

原代码证据：`SoldierTrainer.init` 从建筑的 `sds` 读取库存，以兵种编号为键。`GameControllerBattle.setUnitChoiceFromLevelData` 将兵种 114 转为 11401。`UnitProxy.Operate` 成功创建单位且处于非回放时，每只发送一次 `rpc_s_dispatch_soldier({soldier_type:this.typeid})`。原函数见既有 `analysis/disasm/Components.decompiled.js` 和 `GameControllerBattle.decompiled.js`。

运行时观察：修复前的设备存档中，驯龙场 SID 6 的 `sds={114:10}`，训练队列为空。备份在 `.local/dragon-soldier/before/databases.tar`。这证明已有库存，不代表部署验收。

修改：进攻前汇总建筑 `sds`，传入原版部署栏。每次原版部署请求从一个有库存的驯龙场扣除 1，按原版顺序扣除 `ep`，立即持久化。未部署兵种、训练队列和资源工人保留。战役、联机和荒野探险共用进场构造。回放、非战斗、非法兵种和超库存请求不扣除。

验证：`node analysis/check_native_soldier.cjs` 调用原版部署栏和 `UnitProxy.Operate`，验证多驯龙场、逐只扣除、保存失败、回放和创建失败。`check_native_pve_enter.cjs`、`check_native_pve_settle.cjs`、`check_native_pvp_contract.cjs` 和 `check_native_wild_adventure.cjs` 通过。APK 构建成功，SHA256 为 `1833566a4adc9ed2afc6ee98e3485b149fe3dbb92737112ec28e2ee7d4bd9c50`。

交付：ADB `127.0.0.1:21513` 返回覆盖安装 Success，已启动实例 1。未清除应用数据。

待复测：进入进攻后部署部分龙兵，结束或退出战斗，确认只扣部署数量；强杀重进后确认余量。实际战斗部署和消耗尚无用户确认。
