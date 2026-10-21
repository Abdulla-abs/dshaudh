# 小绿龙入侵：结算回城重播解锁指引

状态：离线通过待复测。

触发：入侵能进场、出兵并结算；回主城后再次弹出解锁「小绿龙入侵」新手指引（NewUnlocked）。

根因（原代码）：
- 解锁进程 `206500` 配置 `rookie_UI_unlock:"unlock_invasion"`、`rookie_click:1`（`data.rookie_controller`）。
- NewUnlocked 关闭后只调 `finishRookieProcess(206500)`，进程完成态仅在内存；整段教程 `pid=2065`（`floor(206500/100)`）不会 `finishRookie`，也就不会 `Rookie.setUserConfig` 写 `rookie2` 第 3 位。
- 后续 206501–206506 依赖入侵界面节点；未走完则回城重建 Build GC 时 `2065` 仍未完成，条件满足会再次打开解锁弹窗。

修改：`finishInvasionUnlockGuide` — 进场与回城写 `user_config.rookie2` bit3，并尽量 `gc.finishRookie(2065)`。若存档已有 `localInvasionFirstWaves` 且 2065 仍未完成，主城 `initRookieByServer` 后补一次迁移。

验证：`node analysis/check_native_invasion.cjs` PASS（进场后断言 rookie2 bit3）。已保留数据覆盖安装实例 1（SHA256 `4618703d…86d5`）并启动。

待办：进主城确认不再弹解锁指引；可选再打一局结算回城复验。
