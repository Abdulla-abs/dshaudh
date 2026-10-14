# 工作接手记录

## 2026 年 10 月 14 日：初始龙银矿显示放置按钮（用户确认成功）

根因是本地建筑数据用了 `state` / `beginTime`，原版 `BuildingBuilder.init(config, params)` 实际读取 `bs` / `bt`。缺少 `bs` 时默认进入待放置状态，并显示取消、确认按钮。龙银矿最后加载，按钮因此停在它旁边。此前“主城漏隐藏控件”的判断不准确。

现由 `toBuildingRecord` 在数据边界生成原版字段，覆盖新账号、旧档加载和回城初始化。保留施工状态与开工时间，英雄状态单独处理。回放建筑按完工记录传入，移除 `ensureBattleBuilderUI` 和建房后强制隐藏确认控件的绕行处理。正常商店放置仍由原版控制。

解析器曾因内层函数数目超过 500，漏掉 `Components.jsc` 的全部函数。现按输入长度限制数量，恢复了该脚本的 594 个内层函数。`check_native_building_contract.cjs` 用恢复出的原版初始化函数复现旧数据问题，并验证完工、施工、待放置和回放数据。相关离线回归、构建、签名校验通过；专用模拟器覆盖安装后按钮消失，建筑坐标及引导存档保留。用户随后确认成功。敌袭完整流程在移除控件绕行后仍需单独复测。

契约见 [analysis/rpc-contracts/building-init.json](../../analysis/rpc-contracts/building-init.json)。交付为 `dino-local-native.apk`，SHA-256：`7efbecc7f3e0228f2d34b696fb295af20993f5c2003e42169fa5b122032b5a8f`。

## 2026 年 10 月 14 日：战役 PVE 结算接线（待用户复测）

进击进场已确认。结算：`rpc_s_complete_pve_battle` → `rpc_c_battle_result`（MatchEnd）→ `rpc_s_battle_to_home` → `rpc_c_battle_to_home`。本地按摧毁比例发龙币/日光、回写 `availableStages` 星级，并按 `pve_next_stage` 解锁下一关。回城路由区分敌袭会话与战役 PVE，避免误走敌袭结束。契约：[analysis/rpc-contracts/pve-settle.json](../../analysis/rpc-contracts/pve-settle.json)。APK SHA-256：`5663f84a08f25ad80f82d8f564b29dfd774d4fa34bb08a857340ba7dc15f6704`。**待用户复测：打完关 → 结算界面 → 回城 → 第 1 关星级 / 第 2 关解锁。** 首通道具包与每日次数限制仍未接。

## 2026 年 10 月 14 日：战役进击无效（rpc_s_enter_pve_battle）

关卡详情可开，点「进击」无进入战斗。根因：未处理 `rpc_s_enter_pve_battle`；且战斗 ILD 补丁曾对所有进场注入空 `replay`，会误开回放模式。现：`handleEnterPveBattle` → `rpc_c_enter_battle`；`oppo.player.stage` + 兼容村庄 stub（`20101/20301/20501/30101`，非官方坐标）；直播进场强制 `replay=null`。契约：[analysis/rpc-contracts/pve-enter.json](../../analysis/rpc-contracts/pve-enter.json)。APK SHA-256：`2e2c0fc7f89096859e44dd6a487e2a1b42219e14374a7831d86507d35e44710c`。**待用户复测进击进场；结算/星级回写仍未接。**

## 2026 年 10 月 14 日：单人关卡全灰（availableStages 形态）

用户进入单人地图后全部关卡灰、提示「该关卡尚未开启」（`pve_pass_not_open`）。根因：`availableStages` / `finishedVirtualStages` 须为对象表，且敌袭虚拟关 `20001` 完成后应解锁战役第 1 关。现 `ensureAvailableStages`：数组迁对象；若有 `finishedVirtualStages[20001]` 则写入 `availableStages[1]=[coin_storage,solar_storage,0,0]`（取自 `data.pve_stage[1]`）。挂在存档加载、`makeHomeInitDict`、敌袭结算与 `battle_to_home`。**不清档、不强改引导。** 离线回归通过。APK SHA-256：`d3f410a44a9bf2cb93d45fb1aac596351c6fc37b8416ca0cde35a2f668965655`。**请覆盖安装后重进游戏（续读即可）验第 1 关可点。**

## 2026 年 10 月 14 日：教程敌袭自然结算适配（待用户复测）

按 v22 字节码追清：`finishBattle`→`onBattleFinished`→`onReplayEnd`→`rpc_s_finish_enemy_attack_replay`→`rpc_c_battle_to_home`→`initRookieByServer`。先验轨迹见 `raid-end-before/after-fix.json`：断点是 `clearBattleOperGates` 把 `inReplayMode` 清成 `false`。现只解除 oper 门闩并消费 start 记录，保留回放模式；并写入结算文本轨迹 `dino.local.native.settle.trace`。不增加定时回城、不强改引导进度、不清存档。离线 `check_native_raid_end` / `check_native_replay` 通过。契约：[analysis/rpc-contracts/battle-finish.json](../../analysis/rpc-contracts/battle-finish.json)。**自然结束→剧情续接→强杀续读仍待用户游戏验证。**

## 2026 年 10 月 14 日：字节码可读性路线启动（无新 APK）

按用户建议暂停扩玩法，先恢复关键脚本可读性并建 RPC 契约。已确认 XDR 魔数 `0xb973c051` = Cocos SpiderMonkey **v22**（`0xb973c0de - 141`），与 cocos2d/Spidermonkey `v22` 的 `Xdr.h` 一致；SM33/34 开源工具不适用。已 vendored `tools/jsc_decompiler`，封装 `analysis/disasm_one.py`。样本 `GameControllerBattle` 已产出反汇编与伪 JS；字节码再次证明 `_createBattleUnitWhenInit(build_data, client)` 两参数、以及 `replay.seed` 读取。结算 RPC 契约初稿：`analysis/rpc-contracts/battle-finish.json`。说明见 [BYTECODE-READABILITY.md](../native/BYTECODE-READABILITY.md)。

## 2026 年 10 月 14 日：龙弹堡主动攻击恢复（用户复测确认）

用户已确认本次修复成功。根因是回放回执只提供外层 `seed`，原版读取 `replay.seed` 得到 `undefined`，使 `DA.getRandom()` 和龙弹堡索敌计时变成 `NaN`。现补齐 `replay.seed: 1`，由原版状态机自行索敌和开火。

已移除强制选敌、威胁注入、反复重建技能管理器和无参数 `beginSkill()`。原引擎记录确认 `beginSkill(30101, targetCID)`，累计造成 270 点伤害，两只敌军死亡。证据见 [analysis/tower-seed-only-result-1014.json](../../analysis/tower-seed-only-result-1014.json)，详细结论见 [NATIVE-BATTLE-HANDOFF.md](../native/NATIVE-BATTLE-HANDOFF.md)。

语法、离线回归、构建和签名校验已通过。当前 APK SHA-256：`2f7dabbf3985f6642955097168fed354f145a64a70fecc0a943df6bad806bec8`；包内启动脚本与源码一致。自然结算、后续剧情和本次修复后的强杀续读仍待单独验收。下列旧补丁保留为失败尝试，不代表当前实现。

## 2026 年 10 月 14 日：龙弹堡不开火 → 攻防 client 错位（历史尝试，仍不足）

client 已纠正为 LocalRookie 后仍不开火。status 显示 301 有 threat/skill；误用 `setIgnoreNoAuto(false)` 可能挡住 `no_auto` 技能。已改 `true` 并清回放技能门闩、威胁索敌后 `beginSkill`。包 SHA-256：`a1bde178ee56a039d53e9062ac2c84d55d50974aa16837a48d068009b0bdfb1a`。

## 2026 年 10 月 14 日：龙弹堡仍不开火 → 关回放门闩（不足）

仅关 `inReplayMode` + `onBattleBegin` 未通过；最终根因与已验收修正见本文首条。

## 2026 年 10 月 13 日：去重确认 + 龙弹堡开火（首版唤醒不足）

用户确认战场局部去重生效：村庄恢复，打爆不再复活。1 级龙弹堡不还击；仅 `onBattleBegin` 唤醒未通过复测，见上条。

## 2026 年 10 月 13 日：本轮敌袭经验已整理

最新接手文档为 [NATIVE-BATTLE-HANDOFF.md](../native/NATIVE-BATTLE-HANDOFF.md)。它汇总原版接口实参、共享控件初始化、出兵参数、重复加载、提前结算和进度续读，并明确区分人工确认与待验收内容。已更新 `AGENTS.md`、`README.md` 和 `NATIVE-DEV-CONTEXT.md` 的入口与过时说明。本次只整理文档，不修改游戏程序或存档。

## 2026 年 10 月 13 日：村庄显示成功，继续修复出兵与提前结算（待复测）

用户确认上一版村庄已显示，敌军仍未显示，约 30 秒结算后重新开始引导。状态日志确认出兵报 `componentList.TileHolder is undefined`；固定结束回放和超时兜底触发结算；返回后的 `initRookieByServer` 收到空对象。

文本诊断捕获原版 `Game.UnitProxy.Operate` 的调用：`sendUnitToMap({typeid, faction}, position)`。本地士兵配置不应带建筑用的 `x/y` 字段。已按原版实参修正，并删除合成的 `BR_DELAY_END_BATTLE` 和固定时间返回/结束回调。战斗结束交给原版条件与正常倒计时。

引导入口收到空配置时，现读取本地 RPC 已保存的 `level.user_config`。原版解码器实测 `rookie0=6210` 可还原 2001、2006、2011、2012；66 只包含前两项。不会自行伪造完成位。旧补丁已覆盖掉的历史进度不会凭空恢复。

检查新增士兵实参格式、无固定结束记录、空引导配置续读，以及显式非空配置的优先级。实际敌军显示、攻击和自然结束仍待用户复测。本轮不读取截图、不清数据。

## 2026 年 10 月 13 日：空村的共享控件初始化错误（待用户复测）

用户复测仍为空村。最新日志确认五座建筑均在 `BuildingBuilder.init` 抛 `Comp.BuildingBuilder.buyBuildingConfirm is null`（Components.js:3330）。上一版参数修复只解决了前一层错误，没有完成建筑创建。

文本诊断复现了原版方法的错误：战斗阶段没有共享确认控件，`init` 在读取建筑数据前就失败。加载原版 `BuyBuildingConfirm.ccbi` 并设置真实 controller 后，同一原版 `init` 可继续执行。新增 `ensureBattleBuilderUI` 在战斗建房前补齐这个初始化条件；控件挂在战斗 UI 层并保持隐藏，模型和战斗组件仍由原版创建。不会修改建造门槛或手工放建筑。

离线检查覆盖控件加载、挂载、隐藏和重复调用。本轮不读取新截图，不自动重跑引导；村庄实际显示仍待用户复测。敌军另有 `componentList.TileHolder is undefined` 日志，本次尚未修复，不得将完整敌袭写为已恢复。

## 2026 年 10 月 13 日：核对原版战斗接口后修正空村（待用户复测）

前三次空村补丁未核对原函数参数，不能视为已修。通过研究包做文本诊断确认：`_createBattleUnitWhenInit` 接收两个参数，必须调用 `(unitData, client)`；将 client 放在 unitData 内并只传一个参数仍会报 `client is undefined`。`createUnit` 只接收一个配置对象；`sendUnitToMap` 接收 `(params, position)`。本轮不操作引导、不读取图片。

本次修正上述调用，并通过原版 `MapManager.TileCenterPosForLogicCoord(x, y)` 换算出兵位置。出兵走原版 `sendUnitToMap`，由原单位逻辑处理移动、攻击和死亡。数量统计改读战斗的 `defenders` / `attackers`，避免误报空村和重复补建。敌军仍沿用此前推断的四只 10101，真实服务器阵容与回放记录尚未恢复。

移除未结束就直接回城的处理，超时改调用原版 `scheduleDelayedBattleFinish`。回放记录结束帧从 180 改为 1800，避免出兵前即请求结束。正常返回再次添加去重。离线回归新增双参数建房、单次原版出兵和战斗单位计数检查；语法、回归、构建与签名校验通过。实际空村、敌军行动和结束流程待用户复测，不得写成上机已通过。

## 2026 年 10 月 13 日：敌袭空村三次修复（client 注入，待人工复测）

二次修复后 UI 昵称已对（LocalRookie 防守 / Enemy 进攻），倒计时在走，但村庄仍空。status 实锤全部 `_createBattleUnitWhenInit` 抛 `TypeError: client is undefined`——建房读 `build_data.client`（防守方 ClientPlayer），敌袭回放队列未带该字段。

本次：

1. `resolveBattleClient` / `ensureBattleClients`：从 `G_PlayerManager` 取或补建攻防 client。
2. `_createBattleUnitWhenInit` 调用前 `withBattleClient` 注入；强制补建按单位计数是否增长计成功。
3. `spawnStubAttackers`：准备阶段/倒计时结束补几只 `10101`，避免只有空地。

包 SHA-256：`0099108a9b8c6f1026c0cbb4c167aeb3f7f72243bd4009d2ef3e35b81e25b39d`。覆盖安装后重进敌袭步。看 status：`resolveBattleClient`（`hasClient`）、`_createBattleUnitWhenInit-exit`、`spawnStubAttackers`。

## 2026 年 10 月 13 日：敌袭空村二次修复（不足：缺 client）

上次 stub/`battleLogItem` 补丁仍无效。status 显示战斗 `initLevelFromData` 已 exit，但全程无 `_createBattleUnitWhenInit`；`initByServer` 收到整份 `self` 信封（昵称落成默认「新晋酋长」）；7.5s watchdog 过早 `battle-scene-watchdog-finish` 强退。

二次改动（UI/调度已改善，建房仍失败）：

1. `makeBattleSide`：`self`/`oppo` 扁平字段 + 嵌套 `.player` 并存。
2. TaskManager `SelectorTask`/`BaseTask` 软捕获。
3. ILD 后强制补建；去掉 7.5s 强退，约 28s/32s 兜底回城。
4. `onBattlePrepareTimeout`→`startBattle`。

复测仍空村，根因见上方「client 注入」条。

## 2026 年 10 月 13 日：敌袭页空村与倒计时无反应（首次补丁，已证实不足）

用户复测：引导建完 301 后能进敌袭页，但村庄建筑为空、无敌袭逻辑、倒计时到 0 无反应。status 确认 ILD 已成功传入 5 座单位与 `oppo.player`；logcat 报 `battleLogItem is undefined`（`MenuControllerBattle.js:484` / `GameControllerBattle.js:2359`），TaskManager 中断导致建筑延后创建被掐断。空 `records` 使回放开战后续无士兵、也无结束。

首次补：`TempBattleLogData`/duck stub → `G_Player.tempReplayBattleLog`；`getReplayBattleLog` 兜底；战斗菜单软捕获；单位补齐 `unit_type`/`unit_level`/`faction`；空 records 约 32 秒自动 `battle_to_home`。复测仍空村，见上方二次修复。

## 2026 年 10 月 13 日：重复加载与引导重启（待人工复测）

用户复测看到两次加载，随后重新开始引导。状态日志确认战斗初始化缺少 `level_data.self`，触发错误返回主城；重建主城时传入的 `user_config` 为空。存档中多次首建产生的 301 还缺少 `unit_type` / `unit_level`，重建报 `config is undefined`。

本次补齐 `self`，保存主城时保留 RPC 已写入的引导进度，并禁止战斗快照覆盖主城。已有建筑按 `typeid` 补齐类型字段，保留原单位和位置。回放进入、正常返回与错误返回共用一次性状态；错误返回后不再对旧控制器调用 `finishRookieProcess`，超时检查从 3 秒改为 15 秒。

语法检查、离线回归、构建与签名校验通过。完整敌袭记录仍未恢复，剧情结果待用户复测。本轮不读取截图、不清数据，也不删除此前产生的重复建筑。

## 2026 年 10 月 13 日：首建后加载修复补充（待人工复测）

日志确认首建后的敌袭回放缺少 `oppo.player`，导致战斗初始化中断。已核对嵌套字段补丁，并将 `scheduleOnRoot` 优先挂到原版 `GameScene._global_schedule_node`，避免主城节点拆除后丢失回执和加载恢复回调。

`node --check analysis/native_boot.js` 和 `node analysis/check_native_replay.cjs` 均通过，新包已构建并通过签名校验。实际新手剧情仍待用户验证；本轮不读取截图、不自动操作引导，也不清除应用数据。完整敌袭回放记录仍未恢复，异常回主城的处理不代表战斗剧情已完整恢复。

## 2026 年 10 月 13 日：首建后剧情加载卡住

新手引导建完 301（宝石加速）后卡在剧情加载页。status 已走到 `rpc_s_enter_enemy_attack_replay` / `rpc_c_enter_enemy_attack_replay`，但 logcat 报 `data.oppo.player is undefined`（`GameControllerBattle.js:309`），加载不收。已在 `native_boot.js` 补嵌套 `oppo.player`，并在战斗 ILD 失败时清加载回主城、结束 `start_replay_pve`。需重装 `dino-local-native.apk` 后从引导该步再验（卡死存档可强杀「本地进入」继续，或清数据重跑）。

## 2026 年 10 月 13 日：首页进入与真机加载卡住修复

`dino-local-native.apk` 已覆盖安装到逍遥实例 1 和 RMX3823 真机。两台设备均验证了绿色按钮进入原版主城，以及强杀后通过“本地进入”继续游戏。本次保留应用数据。

修复了 `isLegalAgreed` 被改成布尔值的问题，现保持函数形式。真机加载停住的直接原因是旧错误上传器遭网络权限拒绝，抛出 `SecurityException`，导致 GLThread 退出。`AppErrorReport.handleError` 现只写本地日志 `DinoLocalError`。构建脚本先重编译 Java 桥接，确保包含补丁。

验证记录见 `analysis/native-entry-fix-verification.json`，操作说明见 `LOCAL-NATIVE.md`。本次只验证入口和继续游戏；首建 301、新手引导，以及仍报错的 `config` / `dict` 初始化数据需继续适配。

## 当前方向（2026 年 10 月 12 日修订）

**保留原客户端的程序逻辑、界面和流程，只把失效的服务器依赖替换为本地数据与本地回执。禁止另建主城场景、手工设定初始建筑或重写已有玩法。**

此前 `dino-local-cityui.apk` 及更早的 `dino-local-*.apk` 用独立预览场景与本地面板验证了资源、占地和数值，属于过渡实验，不再作为主路径扩展。后续交付须走原版：

`ClientPlayer.rpc_c_start_game` → `changeStageAndInit` → `__init_stage_build` → `GameControllerBuild.initLevelFromData`。

首次进入由原程序按服务器形态的 `levelDict` 创建主城、剧情与 Rookie 教程；不能拿八座测试建筑充当初始城池。

协议研究见 `analysis/native-init-protocol.json`。运行时已确认：`rpc_c_start_game(dict)` 在 `GS_STAGE_NONE` 下会排队调用 `changeStageAndInit(1, dict)`；`dict` 含 `player` / `units` / `walls` / `model_info` / `hero_donate_list` / `user_config`。客户端 **没有** 默认城池布局表；新账号 `units[]` 来自原服务器下发。按 Rookie 表推断登录时至少应有 201/206/207（及可能的 212），301/205/203 在教程中建造；202/204 是否在初始包内尚未从客户端表证明。精确占地坐标仍缺真实 `start_game` 样例。

已实现本地适配包 `dino-local-native.apk`（入口 `启动原流程本地适配.cmd`，说明 `LOCAL-NATIVE.md`）。点击登录后走原版 `rpc_c_start_game`；存档键 `dino.local.native.v1`。首次为 Rookie 推断最小集（201/206/207/212），拦截 `callServer` 写回 `user_config` 与建造/移动回执。

## 2026 年 10 月 13 日：首建 301 回执准备（代码已改，待上机验）

在 `analysis/native_boot.js` 推进「原版新手引导第一笔建造」前置：

- 玩家种子补齐 NewMessage / LetterManager / BattleRecorder 字段；`getBattleLog` 空回 `[]`。
- `rpc_s_build` → 分配 sid → `rpc_c_ans_build` → 按 `buildTime` 调度 `rpc_c_build_complete`；完成 sid 去重。
- `rpc_s_set_user_config` 的 `{value,offset}` 写入 `user_config[offset]` + `rookieBits`。
- 取消：灰确认 / `enableOK===false` 走 `onPressNO`；不强制点亮驯龙场。

验收目标见 `NATIVE-ADAPTER-NOTES.md` / `LOCAL-NATIVE.md`。需清数据后重装验证；旧存档会经 `ensurePlayerSocialFields` 补字段但引导进度可能已偏。

## 2026 年 10 月 13 日：首建闭环补强（待清数据验收）

续改 `native_boot.js`：

- 拦截 `rpc_s_set_first_movie_played`；`BattleRecorder.initByServer` 预填；`initRookieByServer` 写 finished/unfinished 到 status。
- 进图后探测 `30101` 费用；余额为 0 时 `ResourceManager.addRes` 注入起步资源（存档标 `starterResGranted`）。
- 强杀后对 `BUILD_STATE_BUILDING` 按 `beginTime` 恢复完工回执。
- 仍不强制点亮驯龙场；四座初始坐标仍为推断。

## 2026 年 10 月 13 日：新账号默认数据与开场引导

修复「开场引导不起」：去掉强制跳过 FirstMovie。首次进入写入推断四座 + `first_movie_played=0` + 空 `user_config`；`FirstMovie.begin` 失败或已播时补调 `_beginRookie`，以跑原版 `GH_story_*`→建造 301 引导。继续游戏沿用存档进度。需 **清数据** 才能验新账号路径。

## 2026 年 10 月 13 日：起步资源 + 宝石加速完工（代码已改）

- 新账号礼包汇总：钻石 150、龙币/日光各 5000、英灵 50；龙币/日光经 `fillBuildingStorages` 写入主城仓库后再汇总进 HUD。
- `rpc_s_build` 实测 `{cid,typeid,x,y}`（施工 typeid 如 `30100`）。
- 宝石加速：`rpc_s_build_finish_imm` → `forceFinishBuilding` → `finishViaBuilder`（`upgradeFinish` 等）；勿依赖缺失的 `unit.server_build_complete`（会导致建筑消失）。
- `rpc_s_request_region_map` 静默，避免冲掉 status。
- **后续 AI 优先读根目录 `NATIVE-DEV-CONTEXT.md`。**

## 2026 年 10 月 13 日：原流程适配运行时结论

四座推断建筑可创建；HUD 昵称与 `exp` 已对齐；强杀后再进可读回存档。详细踩坑、禁止事项与调试步骤见根目录 **`NATIVE-ADAPTER-NOTES.md`**（后续 AI 恢复玩法优先读这份）。

要点摘要：

- `initByServer` 离线会因 SocialBox/`logs` 抛错 → 软捕获后继续 `__buildUnit`，勿 rethrow。
- `G_League` 只用方法桩；禁止把真 `ClientLeague` 注册进 UnitManager。
- 用 `GameControllerBuild` 的 `this` 缓存控制器；勿只信 `GETGC`/`GETMC`。
- 驯龙场灰确认是 `rely_base_lv=2` 原版门槛，不要强行点亮。
- 头像下蓝条是 `menu.exp`，不是联盟名。

## 2026 年 10 月 12 日：本地主城界面、建筑比例与占地

新增独立包 `dino-local-cityui.apk`，入口为 `启动本地主城界面测试.cmd`。本版保留生产建筑新建包的采集、满级升级、养成容量、114 系训练与日光井/龙银矿新建，并按运行时核对的原规则修正建筑比例与占地交互。存档键升级为 `dino.local.city.v12`，从 `v11` 继承资源、等级、生产、施工与训练；像素坐标吸附到等距网格，调整写入 `migrationNotes`，不清空存档。

缩放统一为 `(unit_resource.scale_rate || 1) * OBJ_LAYER_SCALE`（`OBJ_LAYER_SCALE=0.5`），去掉三处写死的 `setScale(1.5)`。占地读 `unit_main.tilesize_x/y`（主城/龙英巢 4×4、生产/仓库 3×3、驯龙场 5×5、建筑师 2×2）；网格来自 `world1.tmx`（64×47）与 `MAP_SIZE_BUILD`（9–50）。选中显示菱形占地；移动/建造先出绿/红候选，确认才保存或扣费，取消不改位置、不扣费。命中按占地格加可见范围。

底部为**本地面板**（名称、等级、占地、生产/容量/施工，以及适用按钮）。已对照可加载原版 `HomeBuildingActionBar` / `BuildingActionCard` CCBI，但完整 `BuildActionBar` / 主城控制器仍未接通。

实现为 `analysis/cityui_boot.js`，由 `python analysis/make_cityui.py` 从 `mine_boot.js` 生成，构建为 `python analysis/build_cityui.py`。烟测 `analysis/validate_cityui_smoke.py`：迁移、取消保持、确认移动共 9 项通过。证据为 `analysis/cityui-verified-*.png`、`analysis/cityui-delivery-entry.png`、`analysis/cityui-validation.json`。原表研究为 `analysis/cityui-native-configs.json`。

新包 SHA-256 为 `e4161d3d3fda899c7992a27e79548079ecd6f3d58745306573fecaa254695359`。专用逍遥实例 1 当前安装本包，外部研究覆盖文件已删除。

操作和构建说明见 `LOCAL-CITYUI.md`。

## 2026 年 10 月 12 日：本地新建日光井与龙银矿

新增独立包 `dino-local-mine.apk`，入口为 `启动本地生产建筑新建测试.cmd`。本版保留新建日光井包的加载、移动、采集、满级升级、养成容量、114 系训练与日光井新建，并按同一套原表规则接入龙银矿新建。存档键升级为 `dino.local.city.v11`，从 `v10` 继承建筑、资源、生产、训练与士兵。

底部“建造生产”进入放置模式；放置中再点同一按钮可在日光井与龙银矿间切换。日光井扣 700 龙币、龙银矿扣 700 日光，均为 180 秒；费用与耗时来自 `BuildingBuilder` 对 `20201`/`20401` 的查询。数量上限分别读 `data.build_number[202]` 与 `[204]`（主城一级最多各 1 座，二级各 2 座，六级起各 6 座）。施工记录仍写在建筑的 `construct:{started,ends}` 上，与升级共用一名工人；完成后删除 `construct` 并创建生产记录。

实现为 `analysis/mine_boot.js`，由 `python analysis/make_mine.py` 从新建版生成，构建命令为 `python analysis/build_mine.py`。存档校验放开前 8 座固定建筑之后最多 10 座额外 202/204 系建筑；额外建筑类型须属于两族升级链之一。

夹具验证为 `analysis/mine-validation.json`，共 22 项：一级主城拒绝第二座日光井、二级主城真实扣费建造日光井与龙银矿、工人忙碌拒绝、离线完成后创建生产、双族达二级上限后拒绝再建、正常 `v11` 存档不变。正式包验证为 `analysis/mine-delivery-validation.json`，7 项。

新包 SHA-256 为 `fe53198e05aab80b85ab536688e4f5712be993046ac60e460edd4afd26a2da61`。截图证据为 `analysis/mine-verified-*.png` 与 `analysis/mine-delivery-*.png`。原表研究为 `analysis/mine-native-configs.json`。专用逍遥实例 1 当前安装生产建筑新建正式包，外部研究覆盖文件已删除。

本版**没有**调用原版 `Shop.buyBuilding`、`rpc_s_build` 或建造动画界面。仓库/驯龙场等其他族新建、`120`/`101`/`102` 兵种、英雄列表与战斗仍未恢复。

操作和构建说明见 `LOCAL-MINE.md`。

## 2026 年 10 月 12 日：本地新建日光井

新增独立包 `dino-local-construct.apk`，入口为 `启动本地新建建筑测试.cmd`。本版保留训练队列包的加载、移动、采集、满级升级、养成容量展示与 114 系训练，并按原表接入一座额外日光井的本地新建。存档键升级为 `dino.local.city.v10`，从 `v9` 继承建筑、资源、生产、训练与士兵。

底部“建造日光井”进入放置模式，点击地图空位后按原表扣 700 龙币、倒计时 180 秒；费用与耗时来自 `BuildingBuilder` 对 `20201` 的查询（与原商店用 `lv_up_cost` / `lv_up_time` 一致）。数量上限读 `data.build_number[202]`（主城一级最多 1 座，二级 2 座，六级起 6 座）。施工记录写在建筑的 `construct:{started,ends}` 上，与升级共用一名工人；完成后删除 `construct` 并创建生产记录，可立即采集。

实现为 `analysis/construct_boot.js`，由 `python analysis/make_construct.py` 从训练版生成，构建命令为 `python analysis/build_construct.py`。存档校验放开前 8 座固定建筑之后最多 5 座额外 202 系建筑；`settle()` 返回值增加 `construct` 完成列表。

夹具验证为 `analysis/construct-validation.json`，共 17 项：一级主城拒绝第二座、二级主城真实扣费与 180 秒倒计时、工人忙碌拒绝、离线完成后创建生产、二级上限拒绝第三座、正常 `v10` 存档不变。正式包验证为 `analysis/construct-delivery-validation.json`，7 项。

新包 SHA-256 为 `8a65fd6183e2a9d8a213f43dc089f198198b544d9a75c1d2102d9aff57e698eb`。截图证据为 `analysis/construct-verified-*.png` 与 `analysis/construct-delivery-*.png`。原表研究为 `analysis/construct-native-configs.json`。专用逍遥实例 1 当前安装新建建筑正式包，外部研究覆盖文件已删除。

本版**没有**调用原版 `Shop.buyBuilding`、`rpc_s_build` 或建造动画界面。龙银矿/仓库/驯龙场等其他族新建、`120`/`101`/`102` 兵种、英雄列表与战斗仍未恢复。

操作和构建说明见 `LOCAL-CONSTRUCT.md`。

## 2026 年 10 月 12 日：本地训练队列

新增独立包 `dino-local-train.apk`，入口为 `启动本地训练队列测试.cmd`。本版保留满级升级包的加载、移动、采集与满级升级映射，以及养成容量只读展示，并把驯龙场的训练队列接到本地存档。存档键升级为 `dino.local.city.v9`，从 `v8` 继承建筑、资源与生产记录。

选中驯龙场后，底部“训练士兵”按原表扣费并开始倒计时，倒计时结束自动入住 1 名士兵。兵种为原表 `TRAIN_TYPE_ID_LIST` 中的 114 系，等级跟随驯龙场等级（三级驯龙场训练 `11403`）；费用与耗时取自 `train_cost` / `train_time`（一级 50 日光、20 秒，十级 800 日光、120 秒）。每座驯龙场同时只有 1 个蛋位（`TRAIN_MAX_BUFFER`），士兵上限为原表 `item_storage`（三级 20，八级 45）。关闭游戏后按本机时间继续，重启即结算。

实现为 `analysis/train_boot.js`，由 `python analysis/make_train.py` 从养成容量版生成，构建命令为 `python analysis/build_train.py`。`settle()` 的返回值改为 `{buildings,training}`，训练完成时把士兵写入同一个驯龙场的 `soldiers[]`。存档校验新增 `training`（目标必须属于 114 系、时长等于原表 `train_time`、只能挂在 207 系建筑上）与 `soldiers`（不超过 `item_storage`）。

夹具验证为 `analysis/train-validation.json`，共 21 项：真实扣费、倒计时等于原表时长、蛋位占用时二次点击被拒、士兵达上限时拒绝训练、完成后入住 1 名、force-stop 后离线完成、重启保持，以及正常 `v9` 存档在整个夹具过程中不变。正式包验证为 `analysis/train-delivery-validation.json`，10 项，使用正常存档：资源不足时拒绝且不扣费、返回再进入、无脚本错误。

新包 SHA-256 为 `5eb41ce0b5ea585386f719b065b7ba7b3228de7e960c59967f23a2ef5e849705`。截图证据为 `analysis/train-verified-*.png`、`analysis/train-delivery-*.png`、`analysis/train-job-active.png` 与 `analysis/train-job-complete.png`（训练中“剩余 38 秒 · 已入住 1/20”，完成后“士兵 2/20 · 蛋位 0/1”）。原表研究为 `analysis/train-native-configs.json`。专用逍遥实例 1 当前安装训练队列正式包，外部研究覆盖文件已删除。

本版**没有**调用原版 `Comp.SoldierTrainer.train()`、`rpc_s_train` 等服务器回执，也没有接原版 `TrainingInterface.ccbi` 界面、队列动画、加速或取消训练。`120`/`101`/`102` 三系兵种尚未接入（各带 `need_barrack_lv` 解锁门槛）。英雄列表、龙英巢出战阵容与战斗仍未恢复，当前仍不能启用完整主城更新。

操作和构建说明见 `LOCAL-TRAIN.md`。

## 2026 年 10 月 12 日：本地养成容量展示

新增独立包 `dino-local-cultivate.apk`，入口为 `启动本地养成容量测试.cmd`。本版保留满级升级包的加载、移动、采集与满级升级映射，并继续使用存档键 `dino.local.city.v8`。旧包保留。

本次只恢复只读容量展示：选择驯龙场时，底部显示原表 `egg_storage`、`item_storage`、`egg_time` 和 `villager_storage`；选择龙英巢时，按当前主城等级读取 `data.hero_number` 的出战栏与英雄等级上限，并显示本建筑 `hero_exp`。截图证据为 `analysis/cultivate-verified-nest.png` 与 `analysis/cultivate-verified-train.png`（存档中龙英巢/驯龙场为三级时：出战栏 3、英雄等级上限 40；蛋容量 14、兵容量 20、蛋时 75 秒、村民 5）。

研究结论见 `analysis/cultivate-native-configs.json`。`Comp.SoldierTrainer` 在 `DA.GETCGC` 返回桩对象时可构造，一级兵容量 10、八级 45，与 `item_storage` 一致；`getTrainCapacity` 等仍依赖 `getStageClient`，本版未接训练队列。未调用 `train()`、`HeroManager` RPC，也未改升级状态机或新建建筑。`build_number` 显示高等级主城可多建 202/204/207，新建流程仍未接入。

实现为 `analysis/cultivate_boot.js`，由 `python analysis/make_cultivate.py` 从满级版生成，构建命令为 `python analysis/build_cultivate.py`。夹具验证为 `analysis/cultivate-validation.json`。新包 SHA-256 为 `70c07834c6036532a6154957cc49945453979a0d538da1084573d26625c52152`。专用逍遥实例 1 当前安装养成容量测试包；外部研究覆盖文件已删除。

下一步可接驯龙场本地训练队列（扣费、倒计时、完成回执），或按 `build_number` 做一座新建生产建筑。龙英巢英雄列表仍需本地 `HeroManager` 状态。当前仍不能启用完整主城更新。

操作和构建说明见 `LOCAL-CULTIVATE.md`。

## 2026 年 10 月 12 日：本地满级升级

新增独立包 `dino-local-max.apk`，入口为 `启动本地满级升级测试.cmd`。本版保留五级及此前的加载、移动、采集与升级，并从五级版复制存档。旧包和旧存档键保留。

本次按原表接满全部可升级等级：主城/日光井/龙银矿/日光皿/龙币库/龙英巢到 10 级，驯龙场到 8 级。建筑师小屋仍不可升级。双仓满级后总容量各约 2520000；满级生产建筑每小时 2500 点，暂存上限 100000。

实现为 `analysis/max_boot.js`，构建命令为 `python analysis/build_max.py`。`analysis/make_max.py` 从五级版生成。新存档键为 `dino.local.city.v8`。`upgradeTypes` 在运行时由 `data.unit_main` 对建筑族 201–207 动态生成（共 61 步），不再逐级硬编码。

本版只扩展映射范围，未改升级状态机。已用研究包扫描完整等级链，见 `analysis/max-native-configs.json`；未再跑完整升级夹具验证。没有调用完整原版升级方法、服务器回执、养成或新建建筑流程。

操作和构建说明见 `LOCAL-MAX.md`。新包 SHA-256 为 `ca083c994cf6bd5135e5f1b9e00d222be9d3d85c311ff57d23a244c6a9055f9c`。专用逍遥实例 1 当前安装正式满级测试包；外部研究覆盖文件已删除。

下一步可分析新建建筑流程，或龙英巢/驯龙场的养成接口。应先补齐各组件的本地状态与完成回执，再逐步接回原版操作；当前仍不能启用完整主城更新。

## 2026 年 10 月 12 日：本地五级升级

新增独立包 `dino-local-level5.apk`，入口为 `启动本地五级升级测试.cmd`。本版保留四级测试版的加载、移动、采集与四级升级，并从四级版复制存档。旧包和旧存档键保留。

本次支持龙首之城、日光井、龙银矿、日光皿和龙币库升到五级，以及龙英巢、驯龙场升到四级。两座仓库都到五级后，总容量由各 60000 变为各 80000。五级生产建筑每小时 1000 点，暂存上限 10000。建筑师小屋仍不可升级。

实现为 `analysis/level5_boot.js`，构建命令为 `python analysis/build_level5.py`。`analysis/make_level5.py` 从四级版生成；功能修改应先写入生成器，再生成和构建。新存档键为 `dino.local.city.v7`。升级映射扩展为经济建筑到五级，以及龙英巢/驯龙场到四级。

本版只扩展映射与存档版本，未改升级状态机、扣费、单工人或离线完成逻辑。因此未再跑完整升级夹具验证；费用与效果见 `analysis/level5-native-configs.json`。没有调用完整原版升级方法、服务器回执、养成或新建建筑流程。六级及以上仍未接入。

操作和构建说明见 `LOCAL-LEVEL5.md`。新包 SHA-256 为 `dae940e714cf6ffaa6d6231297e235edfe60e351ac3564465dc9ec6a63f1e445`。专用逍遥实例 1 当前安装正式五级测试包。

下一步可继续恢复六级建筑、新建建筑流程，或分析龙英巢/驯龙场的养成接口。应先补齐各组件的本地状态与完成回执，再逐步接回原版操作；当前仍不能启用完整主城更新。

## 2026 年 10 月 12 日：本地四级升级

新增独立包 `dino-local-level4.apk`，入口为 `启动本地四级升级测试.cmd`。本版保留三级测试版的加载、移动、采集与三级升级，并从三级版复制存档。旧包和旧存档键保留。

本次支持龙首之城、日光井、龙银矿、日光皿和龙币库升到四级，以及龙英巢、驯龙场升到三级。两座仓库都到四级后，总容量由各 45000 变为各 60000。四级生产建筑每小时 800 点，暂存上限 2500。建筑师小屋仍不可升级。

实现为 `analysis/level4_boot.js`，构建命令为 `python analysis/build_level4.py`。`analysis/make_level4.py` 从三级版生成；功能修改应先写入生成器，再生成和构建。新存档键为 `dino.local.city.v6`。升级映射扩展为经济建筑到四级，以及龙英巢/驯龙场到三级。

没有调用完整原版升级方法、服务器回执、养成或新建建筑流程。五级及以上仍未接入。

操作和构建说明见 `LOCAL-LEVEL4.md`。夹具验证为 `analysis/level4-validation.json`，覆盖主城/生产/仓库四级、龙英巢与驯龙场三级、建筑师拒绝、单工人、容量变化和返回。长耗时升级在保留原表时长的前提下，把 `started/ends` 改写到过去以验证关闭后完成。正式包验证为 `analysis/level4-delivery-validation.json`。截图分别为 `analysis/level4-verified-*.png` 与 `analysis/level4-delivery-*.png`。原版配置研究为 `analysis/level4-native-configs.json`。

新包 SHA-256 为 `f672d996b40ae748b55ffbc8f22e78564bc64e4d3789f8998475ee792446220f`。源码和证据快照为 `handoff/level4-source-2026-10-12.zip`，文件哈希记录为 `LEVEL4-BASELINE.json`。专用逍遥实例 1 当前安装正式四级测试包，外部研究覆盖文件已删除。

下一步可继续恢复五级建筑、新建建筑流程，或分析龙英巢/驯龙场的养成接口。应先补齐各组件的本地状态与完成回执，再逐步接回原版操作；当前仍不能启用完整主城更新。

## 2026 年 10 月 12 日：本地三级升级

新增独立包 `dino-local-level3.apk`，入口为 `启动本地三级升级测试.cmd`。本版保留容量测试版的加载、移动、采集与二级升级，并从容量版复制存档。旧包和旧存档键保留。

本次支持龙首之城、日光井、龙银矿、日光皿和龙币库升到三级，以及龙英巢、驯龙场升到二级。仓库二级升三级要求主城三级。两座仓库都到三级后，总容量由各 35000 变为各 45000。三级生产建筑每小时 600 点，暂存上限 1500。建筑师小屋仍不可升级。

实现为 `analysis/level3_boot.js`，构建命令为 `python analysis/build_level3.py`。`analysis/make_level3.py` 从容量版生成；功能修改应先写入生成器，再生成和构建。新存档键为 `dino.local.city.v5`。升级映射扩展为经济建筑到三级，以及龙英巢/驯龙场到二级。

没有调用完整原版升级方法、服务器回执、养成或新建建筑流程。四级及以上仍未接入。

操作和构建说明见 `LOCAL-LEVEL3.md`。夹具验证为 `analysis/level3-validation.json`，覆盖主城/生产/仓库三级、龙英巢与驯龙场二级、仓库依赖三级主城、建筑师拒绝、单工人、容量变化和返回。长耗时升级在保留原表时长的前提下，把 `started/ends` 改写到过去以验证关闭后完成。正式包验证为 `analysis/level3-delivery-validation.json`。截图分别为 `analysis/level3-verified-*.png` 与 `analysis/level3-delivery-*.png`。原版配置研究为 `analysis/level3-native-configs.json`。

新包 SHA-256 为 `9a3c4784294bd3f634774c61d05c8c5bc0fd9e69de3698d97e882093e3210bd6`。源码和证据快照为 `handoff/level3-source-2026-10-12.zip`，文件哈希记录为 `LEVEL3-BASELINE.json`。专用逍遥实例 1 当前安装正式三级测试包，外部研究覆盖文件已删除。

下一步可继续恢复四级建筑、新建建筑流程，或分析龙英巢/驯龙场的养成接口。应先补齐各组件的本地状态与完成回执，再逐步接回原版操作；当前仍不能启用完整主城更新。

## 2026 年 10 月 12 日：本地仓库容量

新增独立包 `dino-local-capacity.apk`，入口为 `启动本地容量测试.cmd`。本版保留升级测试版的加载、移动、采集，以及龙首之城、日光井和龙银矿升到二级。它从升级版复制存档，旧包和旧存档键保留。

本次支持日光皿和龙币库从一级升到二级。日光皿需要 3000 龙币和 180 秒，龙币库需要 3000 日光和 180 秒，均要求主城为二级。费用和耗时来自原版当前等级配置。升级后，日光仓库由 5000 升到 15000，龙币仓库由 5000 升到 15000。加上主城各 20000，总容量由各 25000 变为各 35000。顶部余额旁显示容量上限；选择仓库建筑时底部显示该建筑提供的容量。

实现为 `analysis/capacity_boot.js`，构建命令为 `python analysis/build_capacity.py`。`analysis/make_capacity.py` 从升级版生成；容量功能修改应先写入生成器，再生成和构建。新存档键为 `dino.local.city.v4`。升级映射扩展为五座建筑的一级到二级，并用 `allowedTypes()` 校验已升级类型。

没有调用完整原版升级方法、服务器回执或新建建筑流程。龙英巢、驯龙场、建筑师小屋和三级及以上升级仍未接入。

操作和构建说明见 `LOCAL-CAPACITY.md`。夹具验证为 `analysis/capacity-validation.json`，覆盖真实的两次 180 秒升级、两种资源扣费、不支持建筑、建筑师忙碌、关闭期间完成、容量变化和重启。正式包验证为 `analysis/capacity-delivery-validation.json`，覆盖资源不足、主城等级限制、自然采集、旧存档不变、返回和重启。截图分别为 `analysis/capacity-verified-*.png` 与 `analysis/capacity-delivery-*.png`。

新包 SHA-256 为 `d233d7a24218c1a7ec1307cbcd50d156245a207b86be8824f2cc4a2ec316f984`。源码和证据快照为 `handoff/capacity-source-2026-10-12.zip`，文件哈希记录为 `CAPACITY-BASELINE.json`。专用逍遥实例 1 当前安装正式容量测试包，外部研究覆盖文件已删除。

下一步可继续恢复其他建筑的更高等级，或分析新建建筑、龙英巢和驯龙场。应先补齐各组件的本地状态与完成回执，再逐步接回原版操作；当前仍不能启用完整主城更新。

## 2026 年 10 月 12 日：本地建筑升级

新增独立包 `dino-local-upgrade.apk`，入口为 `启动本地升级测试.cmd`。本版保留原版进入动画和加载页，继续支持建筑移动、采集和保存。它从采集版复制存档，旧包和旧存档键保留。

本次支持龙首之城、日光井和龙银矿从一级升到二级。龙首之城需要 1000 龙币和 300 秒。日光井需要 700 龙币和 180 秒，龙银矿需要 700 日光和 180 秒。生产建筑升级要求主城为二级。费用和耗时来自原版当前等级配置。

点击“升级建筑”先显示费用，再次点击“确认升级”才扣费。一次只能升级一座建筑。施工期间不能移动正在升级的建筑，生产建筑暂停生产和采集，已有储量保留。关闭游戏后，升级按本机时间继续。完成后加载原版二级模型，二级生产速度为每小时 400 点，暂存上限为 1000。

实现为 `analysis/upgrade_boot.js`，构建命令为 `python analysis/build_upgrade.py`。`analysis/make_upgrade.py` 保存生成步骤；升级功能修改应先写入生成器，再生成和构建。新存档键为 `dino.local.city.v3`，建筑新增 `upgrade.target`、`started` 和 `ends`。旧版本此后的余额和布局独立保存。

本版复用 `BuildingBuilder` 的费用和剩余时间查询，由本地接口保存扣费、升级任务和完成状态。没有调用完整原版升级方法、服务器回执、工人动画或任务奖励，不能描述为原版完整升级流程已恢复。支持范围只到这三座建筑的二级，建造、养成和战斗仍未接入。

操作和构建说明见 `LOCAL-UPGRADE.md`。升级成功路径的记录为 `analysis/upgrade-validation.json`，覆盖真实的 300、180 和 180 秒升级、两种资源扣费、等级限制、建筑师忙碌、施工停产、关闭期间完成、二级生产和重启。测试使用独立存档夹具，正常 `v1`、`v2` 和 `v3` 记录逐步核对，保持不变。

正式包的正常存档验证为 `analysis/upgrade-delivery-validation.json`，覆盖资源不足拒绝、自然资源采集、旧存档不变、返回和重启。截图分别为 `analysis/upgrade-verified-*.png` 与 `analysis/upgrade-delivery-*.png`。前者使用人工测试资源，后者使用正常存档，不能混淆。

新包 SHA-256 为 `f44cf95fae12b91a085574b25af9f0b094634322544da533c01ba6b3b612963b`。源码和证据快照为 `handoff/upgrade-source-2026-10-12.zip`，文件哈希记录为 `UPGRADE-BASELINE.json`。原始 APK、旧预览包和采集包的哈希均已核对。专用逍遥实例 1 当前安装正式升级测试包，外部研究覆盖文件已删除。

下一步可继续恢复其他建筑等级与容量变化，再分析新建建筑、龙英巢和驯龙场。应先补齐各组件的本地状态与完成回执，再逐步接回原版操作；当前仍不能启用完整主城更新。

## 2026 年 10 月 12 日：本地生产和采集

新增 `dino-local-economy.apk`，入口为 `启动本地采集测试.cmd`。它保留原版加载流程和建筑移动，并从上一版复制建筑位置。旧 APK 和旧存档键均保留。

日光井生产日光，龙银矿生产龙币。一级建筑使用原表中的速度，每小时 200 点。每个生产建筑最多暂存 800 点。选择这两座建筑后，底部显示当前待采集量。点击“采集资源”后，资源进入本地账本并自动保存。关闭游戏期间也按本机时间累计产量。

本次复用原版 `Comp.ResourceProductor` 的产量和可采集量计算，并向原版 `ResourceManager` 同步余额和容量。本地接口处理储量上限、按钮、记账和存档。没有调用完整的 `ResourceProductor.init()`、`CollectResource()`、原版采集动画或服务器 RPC，不能描述为完整原版采集流程已恢复。

本地仓库容量从现有建筑配置相加，日光和龙币均为 25,000。初始余额为 0，没有预赠资源。生产速度不加快，每 18 秒产出 1 点。本次尚未接入资源消费、建造、升级、养成和战斗。

实现为 `analysis/economy_boot.js`，构建命令为 `python analysis/build_economy.py`。`analysis/make_economy.py` 保存从上一版生成代码的步骤。以后直接修改成品时，应同步生成脚本或避免重跑。存档键为 `dino.local.city.v2`，新增 `resources` 和 `production` 字段。迁移会复制 `dino.local.city.v1` 中的建筑位置，旧键保持原样。两版此后的布局修改各自保存。

验证记录见 `analysis/economy-validation.json` 和 `analysis/economy-validation.log`。截图为 `analysis/economy-verified-*.png`。验证覆盖旧建筑位置保留、非生产建筑拒绝采集、真实时间生产、日光和龙币采集、连续点击、返回再进入、强制关闭重启和关闭期间生产。原版计算方法的边界探测见 `analysis/economy-native-vectors.json`。

新包 SHA-256 为 `ac911711f38f4031ea2087f8553ddbd936b3fc21345f37c67e79328109876c5b`。源码快照为 `handoff/economy-source-2026-10-12.zip`。专用逍遥实例 1 当前安装采集测试版。研究覆盖文件已删除，交付库不读取外部脚本。

下一步可接资源消费和建筑升级，但需先继续分析 `BuildingBuilder`、升级回执和原版单位初始化。当前建筑始终按一级、已完工计算，不能直接启用完整主城更新。

## 2026 年 10 月 12 日：本地建筑位置和存档

新增独立测试包 `dino-local-state.apk`，入口为 `启动本地建筑测试.cmd`。原始 APK、旧预览包和原版加载预览包均保留。

这个版本保留原版进入动画、加载提示和任务队列。8 座建筑从本地存档读取位置，点击后显示原版名称。点击底部“移动建筑”，再点击地图空位即可放置并自动保存。再次点击底部按钮可取消移动。建筑中心距离不足 260 个地图单位时拒绝放置。

本地数据包含版本号、玩家标识 `local-001`、修订号和建筑唯一标识、类型、坐标。玩家标识只用于这份本地存档，尚未接入原版 `ClientPlayer.initByServer()`。这次没有恢复资源生产、建造、升级、养成和战斗，也没有恢复旧账号。

实现为 `analysis/state_boot.js`，构建命令为 `python analysis/build_state.py`。`analysis/make_local_state.py` 从加载预览脚本生成初版代码；修改成品后不要随意重跑生成器。交付包使用原交付 dex 和 `local_hook.cpp`，不读取外部研究脚本。

存档通过原引擎的 `sys.localStorage` 写入。键名为 `dino.local.city.v1`，数据库位于应用私有目录 `databases/jsb.sqlite`。卸载或清除应用数据会删除存档。旧预览包不会读取这个键，但覆盖安装不会清除它。发现格式错误时脚本会停止初始化，避免静默覆盖原存档。

验证脚本为 `analysis/validate_state.py`。证据为 `analysis/state-validation.json`、`analysis/state-validation.log` 和 `analysis/state-verified-*.png`。验证覆盖位置冲突、取消、移动保存、其他建筑不变、返回再进入、强制关闭重启，以及缩放、拖动、复位和系统返回。测试目标仍是专用逍遥实例 1、Android 9、DirectX。

新包 SHA-256 为 `bf2f702eb061a62a1b3c4f867bbbe6aca7d06a62e8ae87b337ac423e16027d5f`。当前模拟器安装本地建筑测试包，保留验证后的布局。源码快照为 `handoff/state-source-2026-10-12.zip`。

下一步可继续分析原版玩家初始化协议，再接资源和建筑操作。本次的位置冲突检测采用简单距离限制，尚未恢复原版格子占用和建筑规则。

## 2026 年 10 月 12 日：恢复进入游戏的加载过程

用户要求尽量保持原版流程，不省略点击“进入游戏”后的加载过程。后续恢复应保留原版转场、加载页和初始化顺序。

新增验证包为 `dino-local-loading.apk`，入口为 `启动原版加载预览.cmd`。旧的 `dino-local-preview.apk` 和原始 APK 保持原样。下文的旧预览说明仍用于回退。

新包使用原版 `MainMenuScene.playEnterGameAction()`。点击后播放 `entergame` 转场，显示原版随机提示图、提示文案和进度条。地图、8 座建筑和交互控件通过原版 `DA.TaskManager` 加载，完成后进入独立预览场景。返回后清理提示图和文本，再次进入时重新播放加载过程。

源码为 `analysis/loading_boot.js`，构建命令为 `python analysis/build_loading.py`。交付仍使用 `local_hook.cpp` 和交付 dex，不读取外部研究脚本。仅为加载文案创建了 `ClientPlayer`，尚未恢复完整玩家数据、原版主城初始化或玩法。

已在专用逍遥实例 1、Android 9、DirectX 环境验证首次进入、按钮返回、再次进入、系统返回和连续点击。日志未发现脚本异常或崩溃。证据见 `analysis/loading-validation.json`、`analysis/loading-validation.log` 和 `analysis/loading-verified-*.png`。原始截图序列还包含 `loading-verified-frame-*.png` 和 `loading-reenter-frame-*.png`。

新包 SHA-256 为 `a79cc6ded16329e46b8c35063f24781826a2342fb8725ecb415a0481974f5690`。源码快照为 `handoff/loading-source-2026-10-12.zip`。当前模拟器安装的是新包，研究命令和启动覆盖文件已清理。

## 当前目标与结果

用户希望恢复网易《口袋侏罗纪》（Dino On Fire）。用户明确表示不要求联机，本地能打开即可，并要求继续恢复。当前工作目录为 `F:\kdzlj`，本机使用 Windows 和 PowerShell。

已交付两个阶段：入口测试包和场景预览包。最新的 `dino-local-preview.apk` 使用原客户端的引擎、地图和建筑资源。点击入口的“进入游戏”，可以打开独立的本地预览场景。

预览场景有 8 座建筑及部分原版动画。已验证拖动、缩小、复位、建筑编号显示、返回入口和再次进入。它没有调用完整建筑单位初始化，也没有建造、采集、升级、养成、战斗或保存功能。

**不要将预览场景描述为已恢复完整主城或单机游戏。** 预览布局由脚本手工编排，无法恢复用户旧账号的数据。

## 接手后的第一步

1. 阅读本文件和 `TECHNICAL-NOTES.md`，确认交付范围。
2. 查看 `analysis/city_boot.js` 和 `analysis/local_hook.cpp`。
3. 使用 `启动场景预览.cmd` 运行已验证版本。它会重启专用模拟器，运行需要等待。
4. 对照 `analysis/local-preview-verified.png` 检查显示效果。
5. 为实验使用新的 APK 文件名。先推进一个具体功能，再替换已验证交付。

当前没有 Git 仓库或已建立的提交历史可供回退。不要依赖聊天记录作为唯一记录。更新实现后同步修改这份接手记录。

`handoff/verified-source-2026-10-12.zip` 保存了本次已验证交付的源码、修改后的 smali、dex、编译清单和启动库。原始 APK 与工具链不在快照内。需要恢复时先比较文件，不要直接覆盖新的实验。`HANDOFF-BASELINE.json` 保存快照和重要文件的哈希。

## 重要文件

| 路径，相对于工作目录 | 当前用途 |
| --- | --- |
| `koudaizhuluoji.apk` | 原始 360 渠道 APK，保持原样 |
| `dino-local-startup.apk` | 原版入口测试包，SHA-256 为 `4327ddc621ce725708f90d72863f65087c4901f2fc4e5213cc06628ba916487f` |
| `dino-local-cityui.apk` | 最新主城界面/比例/占地测试包，SHA-256 为 `e4161d3d3fda899c7992a27e79548079ecd6f3d58745306573fecaa254695359` |
| `Launch-CityUI.ps1` | 设置专用实例为 DirectX，重启、安装主城界面 APK 并启动 |
| `启动本地主城界面测试.cmd` | 用户入口，调用上述 PowerShell 脚本 |
| `dino-local-mine.apk` | 上一版生产建筑新建测试包（日光井+龙银矿），SHA-256 为 `fe53198e05aab80b85ab536688e4f5712be993046ac60e460edd4afd26a2da61` |
| `Launch-Mine.ps1` | 设置专用实例为 DirectX，重启、安装生产建筑新建 APK 并启动 |
| `启动本地生产建筑新建测试.cmd` | 生产建筑新建版入口 |
| `dino-local-construct.apk` | 上一版仅日光井新建测试包，SHA-256 为 `8a65fd6183e2a9d8a213f43dc089f198198b544d9a75c1d2102d9aff57e698eb` |
| `Launch-Construct.ps1` | 设置专用实例为 DirectX，重启、安装日光井新建 APK 并启动 |
| `启动本地新建建筑测试.cmd` | 日光井新建版入口 |
| `dino-local-train.apk` | 上一版训练队列测试包，SHA-256 为 `5eb41ce0b5ea585386f719b065b7ba7b3228de7e960c59967f23a2ef5e849705` |
| `Launch-Train.ps1` | 设置专用实例为 DirectX，重启、安装训练队列 APK 并启动 |
| `启动本地训练队列测试.cmd` | 训练版入口 |
| `dino-local-cultivate.apk` | 上一版养成容量测试包，SHA-256 为 `70c07834c6036532a6154957cc49945453979a0d538da1084573d26625c52152` |
| `Launch-Cultivate.ps1` | 设置专用实例为 DirectX，重启、安装养成容量 APK 并启动 |
| `启动本地养成容量测试.cmd` | 用户入口，调用上述 PowerShell 脚本 |
| `dino-local-max.apk` | 满级升级测试包，SHA-256 为 `ca083c994cf6bd5135e5f1b9e00d222be9d3d85c311ff57d23a244c6a9055f9c` |
| `Launch-Max.ps1` | 设置专用实例为 DirectX，重启、安装满级测试 APK 并启动 |
| `启动本地满级升级测试.cmd` | 用户入口，调用上述 PowerShell 脚本 |
| `dino-local-level5.apk` | 五级升级测试包，SHA-256 为 `dae940e714cf6ffaa6d6231297e235edfe60e351ac3564465dc9ec6a63f1e445` |
| `dino-local-level4.apk` | 四级升级测试包，SHA-256 为 `f672d996b40ae748b55ffbc8f22e78564bc64e4d3789f8998475ee792446220f` |
| `Launch-Level5.ps1` | 设置专用实例为 DirectX，重启、安装五级测试 APK 并启动 |
| `启动本地五级升级测试.cmd` | 用户入口，调用上述 PowerShell 脚本 |
| `dino-local-level3.apk` | 上一版三级升级测试包，SHA-256 为 `9a3c4784294bd3f634774c61d05c8c5bc0fd9e69de3698d97e882093e3210bd6` |
| `dino-local-capacity.apk` | 容量测试包，SHA-256 为 `d233d7a24218c1a7ec1307cbcd50d156245a207b86be8824f2cc4a2ec316f984` |
| `dino-local-upgrade.apk` | 升级测试包 |
| `Launch-Level4.ps1` | 设置专用实例为 DirectX，重启、安装四级测试 APK 并启动 |
| `启动本地四级升级测试.cmd` | 用户入口，调用上述 PowerShell 脚本 |
| `Launch-Level3.ps1` | 设置专用实例为 DirectX，重启、安装三级测试 APK 并启动 |
| `启动本地三级升级测试.cmd` | 三级版入口 |
| `dino-local-preview.apk` | 场景预览包，SHA-256 为 `0ba711736605b9fda0657eb29510230e66417807d5b979ba134708ab01d3cbdc` |
| `Launch-Capacity.ps1` | 设置专用实例为 DirectX，重启、安装容量测试 APK 并启动 |
| `启动本地容量测试.cmd` | 用户入口，调用上述 PowerShell 脚本 |
| `Launch-Preview.ps1` | 设置专用实例为 DirectX，重启、安装预览 APK 并启动 |
| `启动场景预览.cmd` | 预览版入口 |
| `analysis/boot.js` | 入口测试脚本 |
| `analysis/city_boot.js` | 最新预览脚本，打包后名为 `assets/offline/boot.js` |
| `analysis/local_hook.cpp` | 交付用 JNI 启动库，只执行一次 APK 内脚本 |
| `analysis/build_preview.py` | 最新 APK 构建脚本 |
| `analysis/build_local.py` | 上一阶段入口包构建脚本 |
| `analysis/apk` | apktool 解包工程，包含当前交付的 smali 修改 |
| `analysis/rebuild.apk` | 提供重新编译的 AndroidManifest.xml；构建脚本不直接交付它 |
| `analysis/apk/build/apk/classes.dex` | 构建脚本使用的当前 dex |
| `analysis/decoded/script` | 解密后的 318 个字节码文件和字符串提取结果 |
| `analysis/jadx/sources` | Java 反编译结果；部分渠道 SDK 有反编译错误 |
| `analysis/libcocos2djs.so` | 提取的原版原生引擎，用于符号和汇编分析 |
| `analysis/native-disassembly.txt` | 早期原生汇编记录 |
| `analysis/research_hook.cpp` | 研究用运行时脚本执行器，不能当作交付启动库 |
| `analysis/build_research.py` | 研究包构建脚本，使用独立的 `research-classes.dex` |
| `analysis/query.py` | 将查询脚本发送到研究包，并读取报告 |
| `analysis/preview_hook.cpp` | 已放弃的逐帧恢复 Director 实验，不用于交付 |
| `analysis/startup-renderer.smali` | 入口阶段渲染器备份，目前交付渲染器与其内容一致 |

`analysis` 中还有多次实验 APK、日志和黑屏截图。它们不是全部有效。优先使用下文列出的最终验证证据。

## 原始 APK 信息

包名为 `com.netease.h1.qihoo`，版本名为 `1.0.5`，版本号为 `11`。启动组件为：

```text
com.netease.h1.qihoo/com.netease.h1.qihoo.AdvanceDino
```

原包仅包含 `lib/armeabi` 的 32 位 ARM 库：`libcocos2djs.so`、`libdacommon.so`、`libfmodevent.so` 和 `libfmodex.so`。最低 SDK 为 8，目标 SDK 为 21。

资源统计为 3,302 个 ZIP 条目，包含 318 个加密脚本、913 个 PNG、1,520 个 CCBI、245 个 plist 和 238 个 CCZ 文件。尚未找到服务端程序。原包大小为 107,591,106 字节。

## 已有修改

`analysis/apk/AndroidManifest.xml` 移除了 `android.permission.INTERNET`。其他旧渠道权限仍在清单中，不能声称已完成全面权限清理。

`AdvanceDino.smali` 跳过 `NtUniSdkWrapper.ntInit(Activity)`，避免旧渠道联网初始化。其他初始化调用仍保留。

`Cocos2dxRenderer.smali` 在 `nativeInit()` 后调用 `local.dino.LocalHook.run(AssetManager)`。`LocalHook.smali` 加载 `libdinolocal.so`。

交付渲染器的 `onDrawFrame()` 调用原 `nativeRender()`，然后更新纳秒时间。原有 Java 忙等循环已移除。后来尝试的 `Thread.sleep(33)` 和逐帧 JNI 恢复 Director 均已撤回。

启动脚本关闭补丁检查、自动登录、维护提示和网络计时。`__PLAY_MODE_OFF_LINE` 只跳过部分客户端联网逻辑，不会创建玩家或建筑数据。

预览脚本加载 `map/ccb/sub_map_build.ccbi`。它暂时为 CCBI 的 `Unit` 控制器提供空构造器，接收资源节点和动画。资源加载后恢复原控制器查询函数。预览没有使用完整的 `Unit.init()`。

## 本机工具

| 工具 | 路径或版本 |
| --- | --- |
| Python | `C:\Users\ZoomLink\AppData\Local\Programs\Python\Python311\python.exe`，3.11 |
| Java | `C:\Users\ZoomLink\.jdks\ms-17.0.18\bin\java.exe` |
| Android SDK | `F:\Android\Sdk` |
| ADB | `F:\Android\Sdk\platform-tools\adb.exe` |
| Android 构建工具 | `F:\Android\Sdk\build-tools\35.0.0` |
| NDK | `F:\Android\Sdk\ndk\27.0.12077973` |
| apktool | `F:\kdzlj\tools\apktool.jar`，3.0.3 |
| JADX | `F:\kdzlj\tools\jadx\bin\jadx.bat`，1.5.6 |
| 逍遥命令行 | `D:\Program Files\Microvirt\MEmu\memuc.exe` |
| MuMu 管理器 | `F:\Program Files\Netease\MuMu\nx_main\MuMuManager.exe` |

Python 已安装 `capstone`、`pyelftools`、`unicorn`、`androguard` 和 Pillow。构建脚本使用本机 `.android/debug.keystore` 的 Android 调试证书。工具路径写在脚本中，迁移机器时需要调整。

## 构建与安装

只修改预览脚本或交付 JNI 源文件时，在工作目录运行：

```powershell
python F:\kdzlj\analysis\build_preview.py
```

修改 smali 或清单后，先重建：

```powershell
& 'C:\Users\ZoomLink\.jdks\ms-17.0.18\bin\java.exe' -jar F:\kdzlj\tools\apktool.jar b -f F:\kdzlj\analysis\apk --aapt F:\Android\Sdk\build-tools\35.0.0\aapt2.exe -o F:\kdzlj\analysis\rebuild.apk
python F:\kdzlj\analysis\build_preview.py
```

`-f` 用于强制更新，防止恢复旧 smali 后因时间戳较早而继续复用研究版 dex。之前实际遇到过此问题。

构建脚本编译 ARMv7 JNI 库，从原 APK 复制资源，替换 dex 和清单，再加入本地启动库与脚本。脚本会签名、验证签名，并生成 SHA-256 文件。输出位置固定；开始实验前应先修改输出文件名或备份交付包。

`build_local.py`、`build_preview.py` 和 `build_research.py` 共用部分临时文件，例如 `libdinolocal.so` 和 `local-release-unsigned.apk`。它们不能同时运行。

流式 `adb install` 曾失败。已验证的安装方式是先推送，再执行 `pm install`：

```powershell
adb connect 127.0.0.1:21513
adb -s 127.0.0.1:21513 push F:\kdzlj\dino-local-preview.apk /data/local/tmp/dino-local-preview.apk
adb -s 127.0.0.1:21513 shell pm install -r /data/local/tmp/dino-local-preview.apk
```

## 模拟器状态和黑屏问题

专用逍遥实例为 1，使用 Android 9，支持原游戏的 32 位 ARM 转译。ADB 地址为 `127.0.0.1:21513`。实例 0 是用户已有环境，不应作为默认实验目标。

逍遥实例 1 原使用 OpenGL。入口和预览均出现间歇性全黑帧。改用 DirectX 后，交付包连续截图和交互验证通过。`graphics_render_mode=1` 为 DirectX，值 0 为 OpenGL。启动脚本已设置值 1。

```powershell
& 'D:\Program Files\Microvirt\MEmu\memuc.exe' stop -i 1
& 'D:\Program Files\Microvirt\MEmu\memuc.exe' -i 1 setconfigex graphics_render_mode 1
& 'D:\Program Files\Microvirt\MEmu\memuc.exe' start -i 1
& 'D:\Program Files\Microvirt\MEmu\memuc.exe' startapp -i 1 'com.netease.h1.qihoo/com.netease.h1.qihoo.AdvanceDino'
```

本机也创建过 MuMu 专用实例 1。其 Android 15 环境不支持 32 位 ARM，原包安装报 `INSTALL_FAILED_NO_MATCHING_ABIS`，后来关闭了该实例。没有因此修改用户原有实例。

关闭逍遥访客 Wi-Fi 会同时断开 ADB。当前通过移除 APK 网络权限实现不联网，模拟器保持连接。恢复连接可使用 `memuc connect -i 1`，或使用 `memuc -i 1 execcmd 'svc wifi enable'`。命令是 `execcmd`，不是 `execmd`。

## 最终证据

`Launch-Preview.ps1` 已实际运行，完成渲染设置、重启、安装和启动。当前交付 APK 通过签名验证，清单中没有 INTERNET 权限。原始输入和上一阶段 APK 保留。

| 文件 | 证据 |
| --- | --- |
| `analysis/local-preview-verified.png` | 最终版本正常显示的场景 |
| `analysis/preview-frame-check.json` | 最终版本连续 5 帧正常，包含像素均值和文件大小 |
| `analysis/preview-interaction-check.json` | 缩小、复位、拖动、建筑选择、返回和再次进入的记录 |
| `analysis/preview-selected.png` | 建筑 20101 的编号提示 |
| `analysis/preview-zoom.png` | 缩小后的场景 |
| `analysis/preview-pan.png` | 拖动后的场景 |
| `analysis/preview-back.png` | 返回原版入口 |
| `analysis/preview-reenter.png` | 再次进入预览 |
| `analysis/preview-validation.log` | 最终启动结果为 `local-preview-ready` |
| `analysis/preview-permissions.txt` | 最终包权限记录 |

这些验证只覆盖本机逍遥 Android 9、DirectX 环境。日志中的启动结果仅说明脚本执行完成，不能单独证明画面正常。旧的 `local-startup-offline.png`、`preview-frame-*.png` 等截图中有黑屏，不应作为最终成功证据。

## 下一步建议

主路径为原版初始化适配（`NATIVE-ADAPTER-NOTES.md`、`analysis/native-init-protocol.json`）。当前优先：

1. 读 `NATIVE-DEV-CONTEXT.md`，再改 `analysis/native_boot.js`。
2. 上机验：清数据 → 引导 → 建 301 → 宝石加速完工（建筑不消失）→ 强杀一致；取消不扣费。
3. 随后：原版采集/升级回执、训练与英雄/首场战斗。

`dino-local-cityui` 及更早包仅作数值与资源对照，不再往独立预览场景加玩法。
