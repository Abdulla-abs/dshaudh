# 炼金碎片合成角色失败

状态：离线通过，已覆盖安装实例 1，游戏内待复测。

触发：用户在“炼金”的“碎片”页合成角色，提示 `unsupported compose reward`。

根因：`handleComposeItem` 仅接受道具奖励，并明确拒绝 `putin_event_hero`。原表角色配方使用英雄奖励，因此进入报错分支。旧“道具合成已修”结论只覆盖道具成品。

原代码证据：原表 `item → input_event_client → hero_input_client` 共 14 种固定角色配方，每种消耗 80 个碎片，产出 1 名一级英雄。配方编号只用于选择奖励，不应作为道具入库。原版 `PackageManager.composeItemAns2` 调用 `inputAward`；奖励 29 走 `onGetCapsule` 创建英雄、补足容量并刷新任务提示。完整映射见 [契约](../rpc-contracts/hero-compose.json)。临时解码在 `.local/shop-treasure/`，本次合成界面反编译在 `.local/hero-compose/Package.js`。

修改：扩展 `analysis/native_boot.js` 的 `handleComposeItem`，校验原表固定英雄奖励。扣料、唯一英雄编号、初始技能、容量及获取次数一并保存，再调用原版回执。保留原有道具合成分支和界面。

离线验证：`node analysis/check_native_item_compose.cjs` 覆盖全部 14 种角色配方、原版回执和 `onGetCapsule`。检查材料扣除、英雄类型、初始技能、容量不足／充足、存档读回、再次请求材料不足、连续两次不同编号及写入失败回退。原道具合成检查、`node analysis/check_native_shop.cjs`、语法与构建均通过。

运行时观察：专用实例 1 已备份、保留数据覆盖安装并启动，安装返回 `Success`。安装前后数据库全部 12 个键值相同。备份在 `.local/shop-treasure/hero-compose-preinstall/`，安装后读回在 `.local/shop-treasure/hero-compose-postinstall/`。本轮未在设备消耗碎片，也未生成设备英雄。APK SHA256：`ada35c25b4da3e39e910b11234b7c8561a6ccc4e666427e73a2e03f8f7a92650`。

用户确认：仅确认了原故障；修复效果尚未确认。

待复测：在原页面合成一次，核对减少 80 个对应碎片、增加正确角色及初始技能，再退出重进确认保存。离线存档读回不等同于游戏内重登验收。
