# 高级通缉目标出场增益 899801

状态：离线和构建检查通过，已安装实例 1，设备实战待复测。

触发：用户指定将原版 899801“buff且变大”施加到高级通缉防守角色。

原代码证据：`Buff.BuffManager.handleBuff` 创建增益，`runBuff` 使其运行。原版 `StaticBattleController.comeToWorld` 按此顺序施加变异增益，镜像来自 `getCasterMir()`。`BuffAction.take_effect/lose_effect` 分别施加、移除缩放和战斗属性；计时使用 `buff_time/1000`。

原表参数：体型 1.5 倍，`attack_rate=150`、`defence_rate=50`、`speed_rate=200`、`attspeed_rate=200`，持续 `999999` 毫秒，并保留 `field_attack_fire.ccb` 特效。防御为原值的 50%，不是增加 50%。本轮完整沿用原增益，不另改参数。

修改：新增 `LocalNative.applyWantedTargetBuff`。仅在 `session.cardOrder=3` 时，于原出场回调结束后，对已创建的防守目标调用原版增益管理器。组件内记录增益句柄，配合通缉触发去重，防止重复施加；状态日志记录 `buff899801Handle`。普通、中级及其他玩法不进入此逻辑。现有军衔、符文、技能和对空规则保留。

验证：`node analysis/check_native_wanted_buff.cjs` 运行原版增益生效、失效函数，核对缩放、四项属性调用、时长、特效配置、重复施加保护和高级出场 RPC 分支。它使用替身模拟增益管理器和 Cocos 动作，不是设备实测。`check_native_wanted_loadout.cjs` 和 `check_native_wanted.cjs` 回归通过，语法检查通过。

运行时观察：已备份并保留数据覆盖安装、启动实例 1。安装前后全部 9 个存档文件哈希一致，APK 内启动脚本与当前源码一致。备份见 `.local/wanted-targets/before-buff899801-install/`，安装后核对见 `after-buff899801-install/`。尚未进入高级通缉观察增益，用户未确认。

待办：实例 1 实战观察高级目标放大、特效与战斗属性，并确认击败结算。原版符文等其他缩放增益仍按原规则叠加。
