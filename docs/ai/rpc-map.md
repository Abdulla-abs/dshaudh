# RPC 任务映射

先在本表选任务，再执行 `python tools/ai_lookup.py --find 接口名 --count 15`。位置索引由源码生成，避免手工维护行号。

| 请求或初始化 | 处理入口 | 契约 | 最小离线检查 |
|---|---|---|---|
| `rpc_s_compose_blueprint` | `handleComposeBlueprint` | `analysis/rpc-contracts/blueprint-compose.json` | `node analysis/check_native_blueprint_compose.cjs` |
| `rpc_s_dismiss_hero` | `prepareHeroDismiss`、`handleHeroDismiss` | `analysis/rpc-contracts/hero-dismiss.json` | `node analysis/check_native_hero_dismiss.cjs` |
| `rpc_s_enter_arena_battle`、`rpc_s_gain_arena_rewards`、竞技场结算／回城 | `handleArenaRpc`、`completeArenaBattle`、`arenaBattleToHome` | `analysis/rpc-contracts/arena.json` | `python analysis/inspect_native_arena.py`、`node analysis/check_native_arena.cjs` |
| `rpc_s_swallow_heros` | `handleHeroSwallow` | `analysis/rpc-contracts/hero-swallow.json` | `node analysis/check_native_hero_swallow.cjs` |
| `rpc_s_train_tech`、`rpc_s_finish_training_now` | `handleTrainTech`、`finishResearch`、`startResearchClock` | `analysis/rpc-contracts/knowledge-tree.json` | `node analysis/check_native_tech.cjs` |
| `rpc_s_compose_equipment` 符文合成 | `handleComposeEquipment`、`generateComposedRune` | `analysis/rpc-contracts/rune-compose.json` | `node analysis/check_native_rune_compose.cjs` |
| `rpc_s_put_on_equipment`、`rpc_s_take_off_equipment`、`rpc_s_replace_equipment` | `persistHeroEquipment`、`snapshotHeroEquipment` | `analysis/rpc-contracts/hero-equipment.json` | `node analysis/check_native_rune_persistence.cjs` |
| `rpc_s_use_item` 四菱等解封石 | `applyHeroFeedUse`、`handleShopUseItem` | `analysis/rpc-contracts/hero-equip-slot.json` | `node analysis/check_native_hero_feed.cjs` |
| `rpc_s_enter_battle`、`rpc_s_enter_next_battle` 随机侦察 | `selectScoutLevel`、`buildPvpBattleDict`、`handleEnterPvpBattle` | `analysis/rpc-contracts/scout-pool.json`；[说明](../native/SCOUT-POOL.md) | `python analysis/check_scout_pool.py`、`node analysis/check_native_scout_pool.cjs`、`node analysis/check_native_pvp_contract.cjs` |
| 旅行商店变异果刷新权重 | `ensureTrader`，1119／1120／1121 各自与初级解封果同概率 p/3 | `analysis/rpc-contracts/trader-mutant-fruits.json` | `node analysis/check_native_trader_mutant_fruits.cjs` |
| `rpc_s_trader_buy` 初级／高级解封果 134／135 | `runTraderRequest`、`traderEventItems`；`ensureTrader` 比例选货 | `analysis/rpc-contracts/trader-fruits.json` | `node analysis/check_native_trader_fruits.cjs`、`node analysis/check_native_trader.cjs` |
| `rpc_s_buy_package_slot` | `handleBuyPackageSlot`，登录补旧档扩容次数 | `analysis/rpc-contracts/package-slot.json` | `node analysis/check_native_package_slot.cjs` |
| 商店 7221 刷新权重 | `ensureTrader` 候选池，按用户要求乘 3 | `analysis/rpc-contracts/trader-rune.json` | `node analysis/check_native_trader_rune.cjs` |
| `rpc_s_compose_item_inputevent` | `handleComposeItem`，道具／角色碎片合成 | `analysis/rpc-contracts/item-compose.json`、`analysis/rpc-contracts/hero-compose.json` | `node analysis/check_native_item_compose.cjs` |
| `rpc_s_refresh_wanted`、`rpc_s_load_hunter_pve`、更换／重置／直接胜利／回城领奖 | `handleWantedRpc`、`completeWantedBattle` | `analysis/rpc-contracts/wanted.json` | `python analysis/inspect_native_wanted.py`、`node analysis/check_native_wanted.cjs` |
| `rpc_s_set_hero_defense` | `LocalNative.applyHeroDefense` | `analysis/rpc-contracts/hero-defense.json` | `node analysis/check_native_hero_defense.cjs` |
| `rpc_s_dispatch_soldier` | `LocalNative.handleDispatchSoldier` | `analysis/rpc-contracts/soldier-dispatch.json` | `node analysis/check_native_soldier.cjs` |
| `rpc_s_enter_invasion` | `LocalNative.handleEnterInvasion` | `analysis/rpc-contracts/invasion.json` | `node analysis/check_native_invasion.cjs` |
| `rpc_s_invasion_wave_ready` | `LocalNative.handleInvasionWaveReady` | 同上 | 同上 |
| `rpc_s_invasion_wave_start` | `LocalNative.handleInvasionWaveStart` | 同上 | 同上 |
| `rpc_s_invasion_wave_end` | `LocalNative.handleInvasionWaveEnd` | 同上 | 同上 |
| `rpc_s_leave_invasion`／`rpc_s_invasion_to_home` | `LocalNative.handleInvasionToHome` | 同上 | 同上 |
| `rpc_s_enter_enemy_attack_replay` | `LocalNative.handleEnterEnemyAttackReplay` | `analysis/rpc-contracts/battle-finish.json` | `node analysis/check_native_replay.cjs` |
| `rpc_s_complete_battle`（绑定敌袭会话） | `LocalNative.queueLocalRaidReplayEnd` | 同上 | `node analysis/check_native_raid_end.cjs` |
| `rpc_s_finish_enemy_attack_replay` | `LocalNative.handleFinishEnemyAttackReplay` | 同上 | 同上 |
| `rpc_s_battle_to_home`、`rpc_s_leave_battle` | 依会话分派至 `handleFinishEnemyAttackReplay`、`handlePveBattleToHome`、`handleBattleToHome` | `battle-finish.json`、`pve-settle.json` | 按所改会话选择 raid_end 或 pve_settle |
| `rpc_s_enter_pve_battle` | `LocalNative.handleEnterPveBattle` | `analysis/rpc-contracts/pve-enter.json` | `node analysis/check_native_pve_enter.cjs` |
| `rpc_s_complete_pve_battle` | `LocalNative.handleCompletePveBattle` | `analysis/rpc-contracts/pve-settle.json` | `node analysis/check_native_pve_settle.cjs` |
| `rpc_s_pve_sweep`、`rpc_s_refresh_sweepinfo` | `LocalNative.handlePveSweep`、`handleRefreshSweepInfo` | `analysis/rpc-contracts/pve-sweep.json` | `node analysis/check_native_pve_sweep.cjs` |
| `rpc_s_build` | `LocalNative.installCallServer` 内分支；`collectHomeBuildings`、`resumeConstructions` | 初始化 `building-init.json`；购买回执及离线恢复 `building-offline.json` | `node analysis/check_native_building_contract.cjs`；`node analysis/check_native_building_offline.cjs` |
| `rpc_s_build_finish_imm` 及加速别名 | 同上；完成通过 `LocalNative.finishViaBuilder` | 完整请求与回执契约待补 | `node analysis/check_native_replay.cjs`，仍需上机验加速 |
| `rpc_s_use_item` 建筑龙晶石 | `applyBuildTimeUse`；回原版事件 23，缩短后走既有完工函数 | `analysis/rpc-contracts/build-crystal.json` | `node analysis/check_native_build_crystal.cjs`；已安装，界面及续读待复测 |
| 建筑入场初始化 | `LocalNative.toBuildingRecord` | `analysis/rpc-contracts/building-init.json` | `node analysis/check_native_building_contract.cjs` |
| `rpc_s_set_user_config` | `LocalNative.installCallServer` 内分支 | `analysis/native-init-protocol.json` 及开发上下文，尚非独立契约 | `node analysis/check_native_replay.cjs` |
| `rpc_s_finish_daily_quest`、`rpc_s_refresh_daily_quest`、`rpc_s_finish_main_quest` | `handleFinishDailyQuest`、`handleRefreshDailyQuest`、`handleFinishMainQuest` | `analysis/rpc-contracts/quest-finish.json` | `node analysis/check_native_quest_contract.cjs` |
| `rpc_s_enter_dice_event` 及重置／清冷却／抓捕拷问释放 | `handleEnterDiceEvent`、`handleResetDiceEvent1`、`handleClearDiceEvent1Interval`、`handleDiceEvent2Torture`、`handleDiceEvent2Release` | `analysis/rpc-contracts/wild-adventure.json` | `node analysis/check_native_wild_adventure.cjs` |

路径未写目录时均指 `analysis/rpc-contracts/`。检查脚本只覆盖各自声明的条件，离线通过不代替剧情和存档的人工复测。

函数索引记录源码声明，不等于原引擎调用图。RPC 位置中的 `dispatch-condition` 表示源码接口比较；`lexical-reference` 仅表示文本引用，不代表接口已实现。字段与条件仍以契约和原函数证据为准。
