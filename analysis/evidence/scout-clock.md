# 随机侦察换敌后加速

状态：定向检查和构建通过，已保留存档安装实例 1，游戏内待复测。

触发：用户报告首次随机侦察正常，点击“下一个对手”后自动变为两倍速。

原代码证据：`MenuControllerBattle.gotoNextBattle` 经 `onGotoNextBattle` 发送 `rpc_s_enter_next_battle`，不调用倍速按钮。`ClientPlayer.rpc_c_enter_battle` 执行原场景切换。旧战斗 `preLeaveWorld` 调用 `setReplayMultiple(1)`，其 `_setInternal` 开启固定步长，每帧推进 1/30 秒。对应原函数见 `analysis/disasm/GameControllerBattle.decompiled.js`。

推断：首次从主城进入已有正常计时恢复；换敌经过旧战斗清理后，固定步长残留。当前 `Cocos2dxRenderer.onDrawFrame` 直接执行 `nativeRender`，未按 `sAnimationInterval` 限帧。若每秒渲染 60 帧，固定步长会每秒推进 2 秒。尚未采集此次设备帧率和倍率，不能声称运行时已证实根因。

修改：`analysis/native_boot.js` 的战斗初始化包装仅对 `source=local-predefined-scout` 调用现有计时恢复。时点在旧地图清理之后、新地图初始化之前。原版开战和倍速按钮继续控制实战计时。

验证：语法、`check_native_battle_clock.cjs`、`check_native_scout_pool.cjs` 和 APK 构建通过。计时检查覆盖首次侦察及连续 3 次换敌，确认其他来源保留计时状态。模拟边界检查不等于完整设备操作验证。

交付：实例 1 的覆盖安装返回 Success，安装前后数据库逐字节一致，随后已启动游戏。备份和构建日志在 `.local/scout-clock/`。APK SHA-256：`255cbd86ab3a80a1f584a086d6f619e05bfa9dd57161f9319037c4da64fe523b`。

待复测：连续换敌，观察侦察倒计时经过真实 10 秒是否约减少 10 秒，再部署英雄确认实战速度。若仍加速，先采集帧率、固定步长和 Scheduler 倍率。
