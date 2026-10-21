# 荒野探险进入后卡在地图

状态：离线通过待复测。

触发：龙首之城升到可解锁等级后，从雾隐大陆点「荒野探险」，按教程播完动画后停在荒野地图，无 UI。用户确认正常链路为：动画后进 PVE → 战斗成功 → 抓捕／对话。另：讨好／放过点后两按钮变灰卡住。

根因：
1. 原版 `AdventureSearch` 需 `rpc_c_enter_dice_event_ans` 与 search 动画双条件才 `gotoNextStage`；缺回执则卡地图。
2. 原版 `adventure_status=PVE` 后走 `rpc_s_load_dice_event1_pve`；胜利回城 `afterInitWorld` 调 `checkAdventureStatus`，仅 CAPTURE 时开抓捕。
3. 讨好／放过变灰：按钮等 `onDataGet`／`finish`／`dead`；若在回调前把 live `AdventureManager` 写成 IDLE，`diceEvent2Finish/Dead` 直接 return，按钮永不恢复。

证据：
- 原版：`Adventure.decompiled.js`、`AdventureComponent.decompiled.js`、`GameControllerBuild.afterInitWorld` → `checkAdventureStatus`；`BaseConfig` `ADVENTURE_STATUS_PVE=1`／`CAPTURE=2`／`PVE_BATTLE_MODE_DICE_EVENT1=2`。
- 契约：`analysis/rpc-contracts/wild-adventure.json`。
- 离线：`node analysis/check_native_wild_adventure.cjs` PASS。

修改：进入回 PVE；`load_dice_event1_pve` 用兼容村进 `pve_mode=2`；胜利落 CAPTURE，失败／中途退出清状态；抓捕结束先保 CAPTURE 再调 finish／dead。

验证：离线通过；已覆盖安装实例 1。待设备复测：动画→PVE→胜利→抓捕→讨好／放过可结束。

待办：奖励卡片 UI `award`（资源／果已落盘，见 `wild-adventure-loot.md`）；官方荒野关卡坐标（现用兼容村）；用户实机确认全链路含掉落。
