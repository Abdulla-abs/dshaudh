# 原流程短证据目录

原始记录保留原位置。本文件只提供结论和来源，不重复日志正文。

| 问题 | 确定结论 | 证据入口 | 验收边界 |
|---|---|---|---|
| 龙弹堡不开火 | 必须提供 `replay.seed`，外层 seed 不足 | `analysis/tower-seed-only-result-1014.json`；战斗交接的种子章节 | 用户确认主动攻击；记录伤害 270 |
| 建筑显示放置按钮 | 原版读取 `bs`、`bt`；缺 bs 默认待放置 | `analysis/rpc-contracts/building-init.json`；`check_native_building_contract.cjs` | 用户确认初始矿显示；移除绕行后的完整敌袭待复测 |
| 自然结算不续接 | 保留 `inReplayMode`，原路径经 `onReplayEnd` 请求结束回放 | `analysis/rpc-contracts/battle-finish.json`；`analysis/raid-end-before-fix.json`、`raid-end-after-fix.json` | 离线检查通过；自然结束与后续剧情待用户复测 |
| PVE 进场与结算 | 直播进场 replay 为 falsy；结束回执进入 MatchEnd，再回主城 | `analysis/rpc-contracts/pve-enter.json`、`pve-settle.json` | 进击用户确认；结算星级与解锁待复测 |

需要深入时先查契约的 evidence、validation 或 artifacts 字段。单行 JSON 用字段提取，不要直接输出整行运行日志。
