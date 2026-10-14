# RPC 任务映射

先在本表选任务，再执行 `python tools/ai_lookup.py --find 接口名 --count 15`。位置索引由源码生成，避免手工维护行号。

| 请求或初始化 | 处理入口 | 契约 | 最小离线检查 |
|---|---|---|---|
| `rpc_s_enter_enemy_attack_replay` | `LocalNative.handleEnterEnemyAttackReplay` | `analysis/rpc-contracts/battle-finish.json` | `node analysis/check_native_replay.cjs` |
| `rpc_s_complete_battle`（绑定敌袭会话） | `LocalNative.queueLocalRaidReplayEnd` | 同上 | `node analysis/check_native_raid_end.cjs` |
| `rpc_s_finish_enemy_attack_replay` | `LocalNative.handleFinishEnemyAttackReplay` | 同上 | 同上 |
| `rpc_s_battle_to_home`、`rpc_s_leave_battle` | 依会话分派至 `handleFinishEnemyAttackReplay`、`handlePveBattleToHome`、`handleBattleToHome` | `battle-finish.json`、`pve-settle.json` | 按所改会话选择 raid_end 或 pve_settle |
| `rpc_s_enter_pve_battle` | `LocalNative.handleEnterPveBattle` | `analysis/rpc-contracts/pve-enter.json` | `node analysis/check_native_pve_enter.cjs` |
| `rpc_s_complete_pve_battle` | `LocalNative.handleCompletePveBattle` | `analysis/rpc-contracts/pve-settle.json` | `node analysis/check_native_pve_settle.cjs` |
| `rpc_s_build` | `LocalNative.installCallServer` 内分支 | 初始化形态见 `analysis/rpc-contracts/building-init.json`；完整建造 RPC 契约待补 | `node analysis/check_native_building_contract.cjs` |
| `rpc_s_build_finish_imm` 及加速别名 | 同上；完成通过 `LocalNative.finishViaBuilder` | 完整请求与回执契约待补 | `node analysis/check_native_replay.cjs`，仍需上机验加速 |
| 建筑入场初始化 | `LocalNative.toBuildingRecord` | `analysis/rpc-contracts/building-init.json` | `node analysis/check_native_building_contract.cjs` |
| `rpc_s_set_user_config` | `LocalNative.installCallServer` 内分支 | `analysis/native-init-protocol.json` 及开发上下文，尚非独立契约 | `node analysis/check_native_replay.cjs` |

路径未写目录时均指 `analysis/rpc-contracts/`。检查脚本只覆盖各自声明的条件，离线通过不代替剧情和存档的人工复测。

函数索引记录源码声明，不等于原引擎调用图。RPC 位置中的 `dispatch-condition` 表示源码接口比较；`lexical-reference` 仅表示文本引用，不代表接口已实现。字段与条件仍以契约和原函数证据为准。
