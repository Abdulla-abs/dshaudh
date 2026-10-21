# 转生道具合成按钮变灰

状态：离线检查通过，已保留存档覆盖安装实例 1，游戏内待复测。

触发：合成精钢爪，碎片显示 35/30；点击后按钮变灰，未获得成品。

根因：本地适配遗漏 `rpc_s_compose_item_inputevent`。原版 `AlchemyCompound.onPressOK` 发出请求后设置 `playing=true` 并禁用按钮，等待合成回执。

原代码证据：`Client/UI/Package.jsc`、`PackageManager.composeItemInputEvent/composeItemAns2` 和 `ClientPlayer.rpc_c_compose_item_ans2`。原表规定 2021 × 30 合成 3021 × 1，奖励事件为 53511 → 12511。契约见 `analysis/rpc-contracts/item-compose.json`。

运行时观察：设备轨迹明确记录 `callServer-unhandled`，接口为上述合成请求，目标为 3021。存档中 2021 库存为 35。原始备份在 `.local/shop-treasure/compose-before/`，安装前备份在 `.local/shop-treasure/compose-preinstall/`。

修改：`handleComposeItem` 对照原表校验配方，支持跨堆叠扣材料，扣除和成品入库一并保存。沿原版回执发放并播放动画，回执前同步已扣材料，供转生页面刷新。失败恢复库存并解除合成按钮锁。仅接固定成品配方，装备、随机技能书和图纸的独立接口保持原状。

验证：`node analysis/check_native_item_compose.cjs` 直接执行原版客户端回执和背包合成回调，确认碎片 35 → 5、成品增加 1，转生页面读取扣除后的材料。分堆、配方不符、材料不足、再次请求和保存失败检查通过。`node analysis/check_native_shop.cjs`、语法及构建通过。测试表可用 `python analysis/inspect_native_shop.py` 生成。

安装：`pm install -r` 返回 `Success`，已启动实例 1。APK SHA256 为 `93d31ed3f9b964e2a8120a3ab56920e30470ab9f29fb469877d772a23c107104`。未在设备消耗碎片。

用户确认：尚无修复后的合成反馈。

待复测：重新进入合成窗口，合成一次并核对碎片、成品，再退出重进确认保存。
