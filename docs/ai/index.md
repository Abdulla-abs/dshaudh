# 按任务查询

每轮先读 [当前状态](current-state.md)，再选一行。先搜索标题和关键字，仅读取有关章节。历史文档用于核对证据，不要求每次全文加载。

实现定位先查 [RPC 映射](rpc-map.md)。验证进度见 [待验证事项](pending.md)，已知根因见 [短证据目录](../../analysis/evidence/native-findings.md)。不要全文加载 TSV；用 `python tools/ai_lookup.py --find handleFinishEnemyAttackReplay --count 10` 查询。

| 任务 | 说明入口 | 代码和数据 |
|---|---|---|
| 战斗 → 英雄竞技场镜像对手 | [镜像对战证据](../../analysis/evidence/arena-feasibility.md)，原生五对五、判负结算、回城重登已观察；失败扣分、商店和排名仍有缺口，用户待验收 | `arena.json`、`inspect_native_arena.py`、`check_native_arena.cjs`、`check_native_arena_device.py` |
| 随机侦察按建筑容量掠夺资源 | [资源证据](../../analysis/evidence/scout-loot.md)，仓库 20%、生产 80%，已安装实例 1 待实战 | `scout-loot.json`、`fillScoutResourceLoot`、`readScoutBattleLoot`、`check_native_scout_loot.cjs` |
| 吞噬后进攻回城返还角色、成长还原 | [吞噬保存证据](../../analysis/evidence/hero-swallow.md)，首版复测失败；第二版修正玩家回退误判，原生探针确认 +100 升级归零；已安装待复测 | `hero-swallow.json`、`handleHeroSwallow`、`check_native_hero_swallow.cjs` |
| 知识古树所有研究无效、重登未保存 | [研究证据](../../analysis/evidence/knowledge-tree.md)，补研究点、计时和原版完成回执；已安装实例 1 待复测 | `knowledge-tree.json`、`handleTrainTech`、`finishResearch`、`check_native_tech.cjs` |
| 穿戴符文重登后角色和背包均消失 | [保存证据](../../analysis/evidence/rune-persistence.md)，补穿戴、替换和卸下请求，符文槽与背包一起保存；已安装实例 1 待复测 | `hero-equipment.json`、`snapshotHeroEquipment`、`persistHeroEquipment`、`check_native_rune_persistence.cjs` |
| 英雄宝藏角色碎片、龙晶石和通缉令 | [奖励证据](../../analysis/evidence/hero-treasure.md)，碎片数量翻倍，两类道具每箱独立按 40%／60%／80% 掉落；已安装实例 1 待复测 | `hero-treasure.json`、`heroTreasurePolicy`、`check_hero_treasure.cjs` |
| 转生宝藏碎片和图纸概率 | [奖池证据](../../analysis/evidence/rebirth-treasure.md)，提高二转、三转碎片数量与概率，高档三转图纸降至 2%；已安装实例 1 待复测 | `rebirth-treasure.json`、`rebirthTreasurePolicy`、`check_rebirth_treasure.cjs` |
| 符文合成扣费后没有道具 | [合成证据](../../analysis/evidence/rune-compose.md)，补装备合成接口、事务和原回执；用户允许本地随机规则，已安装待复测 | `rune-compose.json`、`handleComposeEquipment`、`check_native_rune_compose.cjs` |
| 四菱解封石报 skill slots full | [开孔证据](../../analysis/evidence/hero-equip-slot.md)，修正事件分流和 `eqp` 持久化，已安装实例 1 待复测 | `hero-equip-slot.json`、`applyHeroFeedUse`、`check_native_hero_feed.cjs` |
| 布局编辑器自由／玩家模式、大本营数量与等级限制 | [玩家模式证据](../../analysis/evidence/layout-editor-player-mode.md)，实例 1 当前 8 级，原版 10 档对照和浏览器通过，用户待复测 | `analysis/layout-editor/player-rules.json`、`tools/build_layout_player_rules.cjs`、`analysis/check_layout_player_mode.cjs` |
| 布局编辑器防守英雄嵌入符文 | [符文证据](../../analysis/evidence/layout-editor-runes.md)，五槽、分层属性及组合预览；编辑和接入检查通过，实战待复测 | `tools/build_layout_rune_catalog.cjs`、`analysis/check_layout_runes.cjs`、`tools/import_pve_layout.py` |
| 编辑器范围与游戏地图不一致 | [边界证据](../../analysis/evidence/layout-editor-bounds.md)，已统一为原版地形和 11～48 可建造区，离线 HTML 已重建，真实浏览器检查通过 | `layout-map.json`、`analysis/layout-editor/core.js`、`editor.js`、`tools/import_pve_layout.py` |
| 随机侦察“巷子里的猫”建筑越界 | [越界证据](../../analysis/evidence/scout-map-bounds.md)，第 8 关布局整体平移并新增真实地形检查，已安装实例 1 待复测 | `scout-layouts/alley-cat-8.json`、`tools/build_scout_pool.py`、`analysis/check_scout_map_bounds.py` |
| 随机侦察预定义关卡池与等级匹配 | [关卡池说明](../native/SCOUT-POOL.md)、[新增 abbas](../../analysis/evidence/scout-abbas.md)，现共 16 个，全池等概率；等级 ±1 已实现待启用，已保留存档安装实例 1 待实测 | `analysis/rpc-contracts/scout-pool.json`、`scout-layouts/`、`tools/build_scout_pool.py`、`selectScoutLevel` |
| 布局编辑器树、石头等非商店地图装饰 | [接入证据](../../analysis/evidence/layout-editor-decorations.md)、[编号清单](../../analysis/evidence/map-decorations.md)，29 种已加入，编辑及编译检查通过，游戏显示待验证 | `tools/build_layout_decoration_catalog.cjs`、`analysis/inspect_map_decorations.cjs`、`analysis/layout-editor/` |
| 单人关卡敌方守军可拖动、手动施法 | [操作归属证据](../../analysis/evidence/battle-ownership.md)，修正玩家战斗阵营，已安装实例 1 待实战复测 | `ensureBattleClients`、`check_native_battle_ownership.cjs` |
| 布局编辑器缺少蛋壳炸弹、网兜等陷阱 | [陷阱证据](../../analysis/evidence/layout-editor-traps.md)，三类原版陷阱、1～10 级，编辑及接入检查通过 | `tools/build_layout_trap_catalog.cjs`、`analysis/layout-editor/`、`artifacts/关卡布局编辑器.html` |
| 新增第 39 关“从南到北” | [第 39 关证据](../../analysis/evidence/pve-stage39.md)，12 个建筑、67 段墙、3 名守军，已安装实例 1 待实战复测 | `analysis/rpc-contracts/pve-layouts/stage-39.json`、`check_native_pve_enter.cjs` |
| 旅行商店三档变异果太难刷新 | [刷新权重](../../analysis/evidence/trader-mutant-fruits.md)，现改为每档与初级解封果相同 p/3，旧乘 10 方案失效，下次刷新生效 | `trader-mutant-fruits.json`、`check_native_trader_mutant_fruits.cjs`、`ensureTrader` |
| 商店建筑点击确认后整帧卡死 | [建造确认卡死](../../analysis/evidence/building-confirm-freeze.md)，空闲编号误查到玩家，旧查重无限循环；实例 1 已实测购买及施工重登 | `allocateSid`、`building-confirm-freeze.json`、`check_native_building_sid.cjs` |
| 进攻回城后主城背景音乐消失 | [排查证据](../../analysis/evidence/home-music-return.md)，原恢复调用存在，根因未确认；未改游戏代码，待复现 | 原版 `MenuControllerBuild.onEnterWorld/startMusic/stopMusic`、本地异常日志 |
| 主城点击建筑、日光井和龙银矿收集无音效 | [声音证据](../../analysis/evidence/home-sound.md)，撤销永久静音，保留原播放并捕获声音异常，已安装待听感确认 | `protectSound`、`check_native_sound.cjs` |
| 炼金碎片合成角色报 unsupported compose reward | [角色合成证据](../../analysis/evidence/hero-compose.md)，补齐原表 14 种英雄奖励，已安装待复测 | `hero-compose.json`、`check_native_item_compose.cjs`、`handleComposeItem` |
| 购买后重登，已完工建筑也消失 | [建筑编号证据](../../analysis/evidence/building-sid.md)，字符串 SID 漏算导致新购重号，另修旧 activeBuilder 错绑；已安装待复测 | `check_native_building_sid.cjs`、`syncNextSid`、`allocateSid`、`rpc_s_build` |
| 购买建筑施工期间退出后消失、无倒计时且加速为 0 | [离线施工证据](../../analysis/evidence/building-offline.md)，补新购建筑存档、修正 CID 表恢复；旧施工设备验证，新购完整流程待复测 | `building-offline.json`、`check_native_building_offline.cjs`、`collectHomeBuildings`、`resumeConstructions` |
| 龙弹堡驻守进战后消失 | [驻守证据](../../analysis/evidence/hero-defense-garrison.md)，未接 `rpc_s_set_hero_defense`，离线通过待复测 | `hero-defense.json`、`check_native_hero_defense.cjs`、`applyHeroDefense` |
| 小绿龙入侵缺主城驻守英雄 | [入侵驻守证据](../../analysis/evidence/invasion-garrison.md)，须写入 `self.units` 并 remap `did`，离线通过待复测 | `invasion.json`、`check_native_invasion.cjs`、`injectDefenseHerosIntoUnitsMap` |
| 商店初级／高级解封果 | [解封果证据](../../analysis/evidence/trader-fruits.md)，每轮出现概率为符文碎片的 1/3、1/6，1200／6000 宝石 | `trader-fruits.json`、`check_native_trader_fruits.cjs`、`check_native_trader.cjs` |
| 符文原石碎片购买失败、背包扩容与刷新概率 | [商店证据](../../analysis/evidence/rune-shop.md)，保留原价扩容，碎片刷新权重乘 3 | `package-slot.json`、`trader-rune.json`；`check_native_package_slot.cjs`、`check_native_trader_rune.cjs` |
| 用户指定账号等级、碎片、技能调整 | [70 级小盗龙](../../analysis/evidence/hero-level-70.md)、[三种碎片各 50](../../analysis/evidence/hero-fragments-50.md)、[英灵碎片 60000](../../analysis/evidence/spirit-fragments-60000.md)、[61 级小盗龙技能](../../analysis/evidence/hero-skills-61.md) | 仅修改指定存档字段；原始备份和读回验证在对应 `.local/` 任务目录 |
| 61 级小盗龙施法后原地卡住 | [卡住证据](../../analysis/evidence/hero-skill-stuck.md)，根因破釜沉舟类友方目标主动技；统一寻敌修复已装待复测 | `installActiveSkillSeekFix`、`check_native_active_skill_seek.cjs` |
| 转生道具合成按钮变灰 | [合成证据](../../analysis/evidence/item-compose.md)，已覆盖安装待复测 | `analysis/rpc-contracts/item-compose.json`、`analysis/check_native_item_compose.cjs`、`handleComposeItem` |
| 炼金消耗品英灵碎片使用报错 | [英灵碎片证据](../../analysis/evidence/spirit-fragment.md)，已覆盖安装待复测 | `analysis/rpc-contracts/spirit-fragment.json`、`analysis/check_native_shop.cjs`、`handleShopUseItem` |
| 整行城墙升级扣费不完工 | [整行升级证据](../../analysis/evidence/wall-row-upgrade.md)，独立批量接口已接，已安装实例 1 待复测 | `analysis/rpc-contracts/wall-row-upgrade.json`、`analysis/check_native_wall_row.cjs` |
| 城墙升级扣费不变形、出现加速 | [城墙升级证据](../../analysis/evidence/wall-upgrade.md)，回执字段和零耗时取值已修，已安装实例 1 待复测 | `analysis/rpc-contracts/building-upgrade.json`、`analysis/check_native_building_contract.cjs` |
| 高版本安卓两侧黑边 | [撤回记录](../../analysis/evidence/widescreen-rollback.md)，用户确认宽屏后布局混乱，已撤回适配 | 原 Manifest 和 Activity 保持不变；试验原始记录在 `.local/widescreen/` |
| 主线完成「战斗援军」通关后不推进 | [通关任务证据](../../analysis/evidence/pve-quest-pass-marker.md)，已修完成标记遗漏与旧档迁移，安装后待复测 | `applyPveStageProgress`、`ensureAvailableStages`、`analysis/check_native_pve_quest.cjs` |
| 龙晶石不能加速建筑升级 | [龙晶石证据](../../analysis/evidence/build-crystal.md)，三档时长原表确认，已安装待复测 | `analysis/rpc-contracts/build-crystal.json`、`analysis/check_native_build_crystal.cjs`、`applyBuildTimeUse` |
| 战斗血条友敌归属与原版变色 | [血条证据](../../analysis/evidence/battle-life-color.md)，保留友军随血量变色，已覆盖安装待实战 | `installBattleLifeBarColors`、`analysis/check_native_battle_life_color.cjs` |
| 高级通缉目标出场变大并强化 | [增益证据](../../analysis/evidence/wanted-advanced-buff.md)，原版 899801 仅高级目标施加一次，已安装实例 1，实战待复测 | `applyWantedTargetBuff`、`check_native_wanted_buff.cjs` |
| 角色变大、纯模型缩放和符文放大 | [变大证据](../../analysis/evidence/hero-scale.md)，原版有专用放大增益及技能增益，原函数离线通过，未应用修改 | `inspect_hero_scale.py`、`check_native_hero_scale.cjs`、原 `BuffAction.take_effect/lose_effect` |
| 通缉防守目标晋升、随机符文与属性 | [培养证据](../../analysis/evidence/wanted-loadout.md)、[数据清单](../native/WANTED-TARGET-DATA.md)，下士／少尉／准将，中级 2 个、高级 5 个二级符文；已安装实例 1，实战待复测 | `buildWantedTargetTrigger`、`buildWantedEquipment`、`runWantedTargetTrigger`、`check_native_wanted_loadout.cjs` |
| 通缉目标攻击空中有动作但无伤害 | [伤害证据](../../analysis/evidence/wanted-air-hit.md)，粉爆龙对慈母龙用户复现；补普通攻击区域地空筛选，已安装实例 1 待复测 | `castWantedGroundAndAirField`、`check_native_wanted_air_hit.cjs`、`inspect_wanted_air_hit.py` |
| 战斗通缉令、目标转生等级和随机技能 | [通缉令证据](../../analysis/evidence/wanted.md)，已纠正为三个实际模型形态，20／40／60 级及随机 1／2／3 个满级技能，实战待复测 | `analysis/rpc-contracts/wanted.json`、`analysis/check_native_wanted.cjs`、`buildWantedTargetTrigger` |
| 防守英雄技能、转生、晋升和变异配置 | [守军培养证据](../../analysis/evidence/layout-editor-guards.md)，编辑、保存、导入导出及接入校验已补齐 | `analysis/layout-editor/`、`tools/build_layout_guard_catalog.cjs`、`tools/import_pve_layout.py` |
| 用户自行编写关卡布局 | [编辑器使用说明](../tools/layout-editor/README.md)，第 7、16 关文件已接入；[第 16 关证据](../../analysis/evidence/pve-stage16.md)，增加 5 级三角龙，固定 1 级冰枪 | `analysis/layout-editor/`、`tools/import_pve_layout.py`、`analysis/rpc-contracts/pve-layouts/`、`pve-layout-editor.json` |
| 第七关用户布局、三角龙不显示 | [布局证据](../../analysis/evidence/pve-stage7.md)，已修移动英雄误传格子坐标，覆盖安装待复测 | `analysis/rpc-contracts/pve-layouts/stage-7.json`、`check_native_guard_spawn.cjs`、`check_native_pve_enter.cjs` |
| 每日任务奖励全是问号盒子 | [展示证据](../../analysis/evidence/quest-reward-display.md)，已安装，设备确认 34 条有奖励，页面待复测 | `ensureQuestRewardPreviews`、原版 `GameEventBox.refreshReward` |
| 龙兵无法部署及出战消耗 | [龙兵证据](../../analysis/evidence/dragon-soldier.md)，已覆盖安装待复测 | `analysis/rpc-contracts/soldier-dispatch.json`、`analysis/check_native_soldier.cjs` |
| 战斗回城后动画和倒计时加速 | [计时证据](../../analysis/evidence/battle-clock.md)，恢复补丁离线通过，根因及效果待复测 | `restoreHomeClock`、`analysis/check_native_battle_clock.cjs` |
| 战斗中英雄技能图标缺失 | [战斗技能证据](../../analysis/evidence/battle-hero-skills.md)，已覆盖安装待实战复测 | `analysis/check_native_battle_skill.cjs`、`prepareHeroBattleSkills` |
| 英雄经验溢出未升级 | [经验等级证据](../../analysis/evidence/hero-exp-level.md)，已覆盖安装待复测 | `analysis/check_native_hero_exp.cjs`、`analysis/native_boot.js` 的 `normalizeHeroExperience` |
| 英雄晋升只有动画 | [晋升证据](../../analysis/evidence/hero-promote.md)，已覆盖安装待复测 | `analysis/rpc-contracts/hero-promote.json`、`analysis/check_native_hero_promote.cjs` |
| 第三关地图龙蛋未入背包 | [地图龙蛋领取](../../analysis/evidence/pve-map-egg.md)，已覆盖安装待点击复测 | `analysis/rpc-contracts/pve-map-egg.json`、`analysis/check_native_pve_map_egg.cjs` |
| 英雄获取后无技能 | [初始技能修复](../../analysis/evidence/hero-initial-skills.md)，离线通过待设备复测 | `analysis/native_boot.js` 的 `ensureHeroSkill`；`analysis/check_native_shop.cjs` |
| 商店龙蛋与宝藏 | [本地规则及验证](../../analysis/evidence/shop-treasure-local.md)，用户授权自定概率，单抽／三抽及英雄宝藏已设备验证 | `analysis/rpc-contracts/shop-treasure.json`、`analysis/check_native_shop.cjs`；原调查见 [数据缺项](../../analysis/evidence/shop-treasure-audit.md) |
| 账号经验退出后丢失 | [经验持久化证据](../../analysis/evidence/account-exp-persistence.md)，离线通过，已覆盖安装，待游戏内复测 | `analysis/native_boot.js` 的 `copyAccountProgress`、`installAccountProgressPersistence`；`analysis/check_native_account_progress.cjs` |
| 新手七日签到是否存在 | [静态证据](../../analysis/evidence/seven-day-sign.md)，原包已确认，设备入口待验证 | 原版 `sevendays`、`SignReward`、`RewardInterface`；临时反汇编在 `.local/seven-day-check/` |
| 字节码版本、函数读取与调用 | [可读性说明](../native/BYTECODE-READABILITY.md) | `analysis/disasm_one.py`、`tools/jsc_decompiler/` |
| 小绿龙入侵点开始无效 | [入侵证据](../../analysis/evidence/invasion-start.md)，进场／出兵已通 | `invasion.json`、`check_native_invasion.cjs`；`handleInvasionWaveReady` |
| 入侵结算回城再弹解锁指引 | [解锁指引回放](../../analysis/evidence/invasion-unlock-guide-replay.md)，进场／回城持久化 2065，待复测 | `finishInvasionUnlockGuide`；`check_native_invasion.cjs` |
| 敌袭、自然结束、剧情续接 | [战斗交接](../native/NATIVE-BATTLE-HANDOFF.md) | `analysis/native_boot.js`、`analysis/rpc-contracts/battle-finish.json`、`analysis/check_native_raid_end.cjs` |
| 建造、资源、引导、强杀续读 | [开发上下文](../native/NATIVE-DEV-CONTEXT.md) | `analysis/native_boot.js`、`analysis/rpc-contracts/building-init.json`、`analysis/check_native_building_contract.cjs` |
| 第一关回城后训练引导停住 | [卡点证据](../../analysis/evidence/rookie-train-stall.md)，已补初始 207，用户确认；旧“后续建造”结论失效 | `analysis/native_boot.js` 的 `createSeed`、`normalizeStarterBuildings` |
| 训练加速、龙英巢升级完工 | [训练及升级证据](../../analysis/evidence/rookie-training-upgrade.md) | `analysis/native_boot.js`、`analysis/check_native_building_contract.cjs` |
| 英雄安置点、出征队列、迪诺不显示 | [容量与状态证据](../../analysis/evidence/hero-slots.md) | `analysis/native_boot.js`、`analysis/check_native_hero_contract.cjs` |
| 免费龙蛋领取后的教程触发 | [领取后续接证据](../../analysis/evidence/egg-guide-after.md) | `analysis/native_boot.js`、`analysis/check_native_egg_contract.cjs` |
| 来自女神的信、新手礼包领取 | [信件证据](../../analysis/evidence/welcome-letter.md) | `analysis/rpc-contracts/welcome-letter.json`、`analysis/check_native_letter_contract.cjs` |
| 原流程适配陷阱 | [适配笔记](../native/NATIVE-ADAPTER-NOTES.md) | `analysis/native-init-protocol.json` |
| 战役进场和结算 | [工作历史](../history/HANDOFF.md)（搜索 PVE） | `analysis/rpc-contracts/pve-enter.json`、`pve-settle.json`、`analysis/check_native_pve_*.cjs` |
| 每日／主线任务领取无回执 | [任务领取证据](../../analysis/evidence/quest-finish.md)，已覆盖安装待复测 | `analysis/rpc-contracts/quest-finish.json`、`check_native_quest_contract.cjs`、`handleFinishDailyQuest` |
| 英雄喂食点击无效 | [喂食证据](../../analysis/evidence/hero-feed.md)，离线通过待复测 | `check_native_hero_feed.cjs`、`applyHeroFeedUse`、`handleShopUseItem` |
| 技能替换消耗 undefined / 点击卡住 | [消耗](../../analysis/evidence/skill-replace-cost.md)、[替换执行](../../analysis/evidence/skill-replace-use.md)，离线通过待复测 | `check_native_skill_replace_cost.cjs`、`check_native_skill_replace.cjs`、`handleShopUseItem` / `applySkillBookUse` |
| 单人关卡扫荡与掉落概率 | [扫荡证据](../../analysis/evidence/pve-sweep-drop.md)，秘笈独立 33%，技能书照旧、稀有 8%，离线通过待实战 | `analysis/rpc-contracts/pve-sweep.json`、`analysis/check_native_pve_sweep.cjs`、`handlePveSweep` |
| 龙族秘笈 33% 与手动进攻奖励链 | [秘笈证据](../../analysis/evidence/pve-book-drop.md)，修复手动物品引用，保留固定首胜；离线通过，已保留存档安装实例 1 待复测 | `analysis/inspect_pve_book_drop.cjs`、`rollPveSweepItems`、`applyPveBattleItemRewards` |
| 单人奖励入库、主城升级保留库存 | [资源修复证据](../../analysis/evidence/pve-wallet-fix.md) | `analysis/native_boot.js`、`analysis/check_native_pve_wallet.cjs` |
| 荒野探险动画后卡死／抓捕按钮变灰 | [荒野探险证据](../../analysis/evidence/wild-adventure.md)，离线通过待复测 | `wild-adventure.json`、`check_native_wild_adventure.cjs`、`handleEnterDiceEvent`／`handleLoadDiceEvent1Pve` |
| 荒野探险掉落与概率 | [掉落核对](../../analysis/evidence/wild-adventure-loot.md)；本地奖池已接待复测 | `adventureLootPolicy`／`check_native_wild_adventure.cjs` |
| 构建、启动、设备 | [操作说明](../operations/LOCAL-NATIVE.md)、[技术笔记](../history/TECHNICAL-NOTES.md)（按标题查询） | `analysis/build_native.py`、`analysis/local_hook.cpp`、`Launch-Native.ps1` |
| 历史预览实验 | `docs/operations/LOCAL-*.md`、`docs/baselines/` | `analysis/build_*.py`、`*_boot.js` |
| 文件存放、Git、索引 | [文件规则](file-policy.md) | `tools/repo_index.py`、`.gitignore` |

查询示例：`rg -n 'onReplayEnd|inReplayMode' analysis/native_boot.js analysis/rpc-contracts docs/native/NATIVE-BATTLE-HANDOFF.md`。

索引不是验收报告。以当前状态、具体契约的证据和用户复测结果为准。

读取示例：`python tools/ai_lookup.py --read analysis/native_boot.js --line 3769 --count 60`。行号由生成索引定位，源码修改后执行 `python tools/repo_index.py` 刷新。
