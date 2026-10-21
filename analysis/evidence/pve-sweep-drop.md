# 单人关卡扫荡与掉落概率

状态：离线通过待设备复测。用户已授权本地掉落策略。

触发：恢复单人关卡“扫荡”；官方概率不可得，按用户给定手感与攻略规则自定。

原代码证据：
- 入口 `UI.PVEInfo.pveSweep` / `UI.PveSweepEnd.pveSweep` → `rpc_s_pve_sweep({level})`
- 回执 `rpc_c_pvesweep_result` / `rpc_c_pvesweep_fail`；体力同步 `rpc_s_refresh_sweepinfo`
- `Comp.PVESweepManager` 只管理体力；`getProbableRewards` 只做预览
- 第 7 关起 `pve_roll_reward` 链含技能书（200xxx）与强化书（210000）；部分关另有稀有物（如水晶）
- `green_pro`（多为 0.35）仅在关卡表，客户端无读取发奖逻辑

本地策略（非官方）：
- 经验：必掉，数量为 `sweep_hero_exp`，发给 `state===1` 出征英雄
- 技能书：从第 7 关起；保留 `green_pro`（缺失时 `1/3`）和原普通池分母，选中技能书才发放。因此第 7～8 关单件概率约 16.67%，第 9～50 关 17.5%。
- 龙族秘笈（210000）：2026-10-20 按用户要求改为独立 33%，每次成功掉落 1 本，只在原奖池包含秘笈的关卡生效。可与技能书同时掉落，见 [秘笈证据](pve-book-drop.md)。
- 稀有：独立概率 `0.08`，从稀有池等权抽 1 件
- 需已通关（星级 ≥ 1）；消耗 `period_num_limit` 日次数；次数用尽时按客户端已付费重置再计 1 次
- 回调期间 stub `inputAward`/`addRes`，避免与落盘重复发放

修改：`analysis/native_boot.js` 的 `handlePveSweep`、`handleRefreshSweepInfo` 及 `installCallServer` 分支；契约 `analysis/rpc-contracts/pve-sweep.json`；检查 `analysis/check_native_pve_sweep.cjs`。

验证：`node analysis/check_native_pve_sweep.cjs` 通过（经验、普通掉落、未通关失败、日限重置）。

待办：设备上点扫荡看结算窗、背包、体力与日次数；确认强化书/技能书与稀有手感。
