# 原版敌袭适配：接手结论与踩坑记录

## 当前状态与阅读顺序

本文更新至 2026 年 10 月 14 日，整理本轮敌袭适配。后续 AI 先读本文，再读 [NATIVE-DEV-CONTEXT.md](NATIVE-DEV-CONTEXT.md) 和 [NATIVE-ADAPTER-NOTES.md](NATIVE-ADAPTER-NOTES.md)。[HANDOFF.md](../history/HANDOFF.md) 保留历史尝试，早期“已修”标题不等于通过人工验收。

2026-10-14，用户确认龙弹堡不开火问题修复成功。此前村庄显示、敌军攻击和建筑打爆后不再复活也已确认。自然结算与后续剧情续接仍单独待验。单人地图全灰已定位并打补丁（待用户复测第 1 关）。

| 内容 | 证据与状态 |
| --- | --- |
| 首建完成后进入原版敌袭场景 | 用户多次复测确认 |
| 村庄建筑显示 | 用户确认（局部去重后恢复） |
| 建筑共享确认控件补齐 | 原版方法文本诊断及人工显示结果支持 |
| 原版接口参数位置 | 研究包读取函数长度、用替身截获实参确认 |
| 敌军显示与攻击 | 用户确认已出现并攻击 |
| 建筑打爆后不再“复活” | 用户确认去重补丁生效 |
| 龙弹堡（301）本体开火 | 2026-10-14 用户复测确认成功；原引擎文本记录另有 270 点实际伤害 |
| 自然结算路径（字节码） | `onReplayEnd`→`rpc_s_finish_enemy_attack_replay`→`rpc_c_battle_to_home`；已修：不再清 `inReplayMode` |
| 自然结束后继续后续剧情 | 适配已改，**仍待用户游戏复测** |
| 单人关卡解锁（第 1 关） | 用户确认解锁生效 |
| 战役进击进场 | 用户确认进击可进战斗 |
| 战役 PVE 结算 / 星级 / 解锁 | 已接 complete→MatchEnd→home；**待用户复测** |
| 完整原服敌袭阵容与回放记录 | 尚未恢复；当前四只 10101 是本地推断 |

### 2026-10-14：自然结算断点与最小修复

先验轨迹：`analysis/raid-end-before-fix.json` / `raid-end-after-fix.json`。全程 `isReplay:false`，因 `clearBattleOperGates` 曾为开火清掉 `inReplayMode`。v22 字节码要求敌袭自然结束走回放分支，最终由 `MenuControllerBattle.onReplayEnd` 发 `rpc_s_finish_enemy_attack_replay`；`first_time_stage===1` 才会走 `rpc_s_goto_next_first_stage`（本地默认 0）。

修复：只解除 `noUserOperSkill` 等 oper 门闩，并消费仅含 `[1,0,7]` 的 start 记录；**保留** `inReplayMode`。龙弹堡仍依赖已补的 `replay.seed`。新增结算文本轨迹键 `dino.local.native.settle.trace`（同时写入 status `settle-trace`）。不增加定时回城，不伪造引导完成位。

主路径仍保留原客户端程序、界面与流程，只适配失效服务器依赖。禁止另建主城、手工画建筑替代原单位、使用八座预览城冒充初始城，或重写战斗 AI。

## 当前文件与交付

| 文件 | 用途 |
| --- | --- |
| [analysis/native_boot.js](../../analysis/native_boot.js) | 适配实现，直接修改此文件 |
| [analysis/build_native.py](../../analysis/build_native.py) | 重新编译桥接代码、打包和签名 |
| [analysis/check_native_replay.cjs](../../analysis/check_native_replay.cjs) | 离线回归，涵盖接口实参、进度、调度和共享控件 |
| [dino-local-native.apk](../../dino-local-native.apk) | 当前交付包 |
| [dino-local-native.apk.sha256](../../dino-local-native.apk.sha256) | 当前包哈希，以此文件为准 |
| [Launch-Native.ps1](../../Launch-Native.ps1) | 覆盖安装与启动专用实例 |

当前 APK SHA-256：`5663f84a08f25ad80f82d8f564b29dfd774d4fa34bb08a857340ba7dc15f6704`。整理本文时已核对，包内 `assets/offline/boot.js` 与当前源码一致。

### 2026-10-14：单人地图全灰 → availableStages

`ChapterComponent.isStageAvailable` / 提示 `pve_pass_not_open` 依赖 `availableStages` 为对象表。本地曾把该字段存成 `[]`，且敌袭完成后只写了 `finishedVirtualStages[20001]`、未解锁战役 `1`。适配层现将数组迁为对象，并在 `20001` 完成后写入 `availableStages[1]=[coin_storage,solar_storage,0,0]`。续读存档在 `loadOrCreate` 时迁移并落盘；无需清档。

### 2026-10-13：建筑打爆“复活”与错误去重空村

现象 1：打爆后切摧毁贴图仍可再锁定（同格双壳）。  
现象 2：上一版去重后空村、只剩敌军（用户截图确认，摧毁 0%）。

原因：强制补建与 TaskManager DELAY 叠双壳；随后去重用 `getUnitBySID`/`getAllUnits` 命中**主城**同 sid，战场首建全部 `skip-dup`。

处理：

1. 去重只认本场 `gc.defenders` / `gc.buildings` 与 `gc.__localBattleBuildingKeys`，禁止查全局 UnitManager。
2. 成功创建后 `markBattleBuildingCreated`；二次 create / force 跳过。
3. `ensureBattleVillageUnits` 只补缺失；保留 `post-ild` + 延迟补缺口。

离线回归覆盖：UnitManager 已有同 sid 主城残留时仍应 force 成功一次，二次 skipped。**用户已确认村庄恢复且打爆不再复活。**

### 2026-10-14：龙弹堡恢复主动攻击（用户确认）

敌军已能攻击建筑，但 1 级龙弹堡（`30101`）始终不还击。本轮定位到回放随机种子缺失：本地回执只有外层 `seed: 1`，原版初始化读取的却是 `replay.seed`。`BattleRecorder.setRandomSeed` 收到 `undefined` 后，`DA.getRandom()` 返回 `NaN`，龙弹堡的 `lastIdleUpdateTime` 也变成 `NaN`。

当前回执为 `replay: {seed: 1, records: [[1, 0, 7]]}`。保留本地入侵战斗所需的回放操作限制解除，让原版状态机完成索敌、冷却、发射和伤害计算。适配层不再强制选目标、灌入威胁值、反复调用 `resumeBattle` 重建技能管理器，也不再调用无参数 `beginSkill()`。

原引擎确认的攻击调用是 `beginSkill(30101, targetCID)`。技能 ID 为 `30101`；`30101_atk` 是技能配置里的声音名，不能再把它当作技能表的键。原表 `data.skill_data[30101]` 没有 `no_auto` 字段，此前“关闭 no_auto 阻止开火”的推断不成立。

验证证据分为两项：

- 原引擎文本记录：[analysis/tower-seed-only-result-1014.json](../../analysis/tower-seed-only-result-1014.json)。原版 AI 自行调用 `beginSkill(30101, 17/18/20)`，龙弹堡累计输出 270 点伤害。敌军 CID 17、18 的生命均降到 0，CID 20 降到 40。
- 用户在本次会话明确确认“修复成功”。因此龙弹堡主动攻击已通过人工复测。该确认不扩展为自然结算、后续剧情或强杀续读也已通过。

此前修正攻防 client、关闭回放限制和强制唤醒均不足以解决本问题。旧 `wake-defender-battle.nudged[].fired` 只代表调用尝试，不能作为开火或伤害证据。当前状态节点为 `defender-live-combat`，可检查 `randomSeed`；实际攻击仍须结合原版伤害和敌军生命判断。

离线回归新增 `replay.seed` 断言，并检查解除回放限制时不会调用技能、重建技能管理器或重复初始化单位。语法检查、回归、构建和签名校验均已通过。当前 APK 哈希见上表后的记录，包内 `assets/offline/boot.js` 已与源码核对一致。

诊断使用独立存档键 `dino.local.native.tower-fixture-1014`，临时 301 属测试夹具，不能迁入正式账号或作为初始城布局。正式存档仍为 `dino.local.native.v1`。研究覆盖文件与命令仅供研究包使用；正式交付按启动脚本覆盖安装，不得把研究包的安装状态写成正式包验收。

状态环：`dino.local.native.status`。ADB 地址：`127.0.0.1:21513`。实例 0 是用户环境，不使用它。

## 原版流程与已确认接口

首建 301、宝石加速完工后，Rookie 的 `start_replay_pve` 请求 `rpc_s_enter_enemy_attack_replay`，本轮观测到 `stage:20001`。适配层构造回执，调用原版 `rpc_c_enter_enemy_attack_replay`，再进入 `GameControllerBattle.initLevelFromData`。结束请求为 `rpc_s_finish_enemy_attack_replay`，本地返回通过 `rpc_c_battle_to_home(level)`。

| 接口 | 已确认用法 | 错误尝试 |
| --- | --- | --- |
| `_createBattleUnitWhenInit` | `(unitData, client)`，两参数 | 只在字典内放 `client`，只传一参数 |
| `GameControllerBattle.createUnit` | `(params)`，单配置对象 | `(typeid, x, y, faction, params)` |
| `GameControllerBattle.sendUnitToMap` | `(params, position)` | 混入建筑落位字段的士兵配置 |
| `Game.UnitProxy.Operate` | 原版士兵调用 `sendUnitToMap({typeid, faction}, position)` | 用类型编号猜测 `UserDelayedCreateUnit` 的实参 |
| `MapManager.TileCenterPosForLogicCoord` | `(x, y)`，换算逻辑格中心 | 假设 TMXTiledMap 本身有 `getPositionAt` |
| `StaticBattleController.beginSkill` | `(skillID, targetCID)`，本轮捕获 `30101` 与敌军 CID | 无参数调用导致查询 `getUnit(undefined)`，误取玩家对象 |
| `UserDelayedCreateUnit` | 函数长度为 3，完整调用契约仍未还原 | 把函数长度视为参数含义已经确定 |

记录常量已在原引擎确认：`BR_UNIT_CREATE=4`、`BR_DELAY_END_BATTLE=5`、`BR_START_BATTLE=7`。只确认了有限的调用格式：`[1,0,7]` 能调到原版 `startBattle`；单位记录的参数需放在第四项数组中，扁平追加参数不会得到相同实参。完整回放协议、时间基准和正式阵容仍需研究。

最新回执只保留开始记录 `[[1,0,7]]`。此前合成的 `[180,0,5]`、`[1800,0,5]` 均已删除；不能再添加固定结束记录来掩盖出兵失败。

## 从加载卡住到村庄显示的失败原因

| 现象或日志 | 查明的问题 | 当前处理 |
| --- | --- | --- |
| `data.oppo.player is undefined` | `oppo` 缺嵌套玩家对象 | 补 `oppo.player` |
| `level_data.self is undefined` | 本地战斗回执缺玩家侧数据 | 补 `self` 和 `level_data.self` |
| `battleLogItem is undefined` | 原版菜单和控制器需要回放日志对象 | 补 `tempReplayBattleLog`、`battleLogItem` 与读取兜底 |
| `_createBattleUnitWhenInit` 报 `client is undefined` | 原函数第二参数未传 | 传 `unitData, client` |
| 所有建筑报 `buyBuildingConfirm is null` | 主城拆除共享控件，战斗建房初始化仍会访问它 | `ensureBattleBuilderUI` 加载原版控件并保持隐藏 |
| 士兵报 `componentList.TileHolder is undefined` | 士兵配置带建筑用的 `x/y`，进入建筑落位分支 | 使用 `{typeid,faction}`，位置另传；敌军显示与攻击已由用户确认 |

`BuildingBuilder.init` 即使面对完工建筑，也先访问共享建造确认控件。本轮用原版 `BuyBuildingConfirm.ccbi` 的真实 controller 做文本诊断，确认补齐控件后该方法可以继续执行。这里补的是初始化条件，不能改成假确认框、强制点亮 OK，或吞异常后声称建筑已创建。

`ensureBattleBuilderUI(gc)` 将原版控件挂到战斗 `UINodeLayer`，必要时挂 `gc.rootNode`。`_createBattleUnitWhenInit` 包装在调用前补齐控件，调用结束后继续隐藏控件。村庄显示已有用户验证；还应检查返回主城后控件生命周期是否正常。

## 重复加载、进度丢失与提前结算

切换 BUILD → BATTLE 会拆除主城菜单节点。在旧节点上成功调用 `scheduleOnce`，不代表回调之后会执行。`scheduleOnRoot` 当前优先使用原版 `GameScene._global_schedule_node`；跨阶段回执和超时诊断不能只挂主城节点。

回放错误与超时检查曾同时触发返回。`replaySession` 的 `returning/closed` 状态用于去重；过期回调还要确认自己属于当前 session。错误返回后不能对缓存的旧主城控制器调用 `finishRookieProcess`，它可能已经销毁，或已经不是原来的步骤。

存档进度与客户端初始化参数是两个检查点。`saveLevel` 保留 RPC 已写入的 `level.user_config`，战斗阶段禁止 dump 覆盖主城；但这并没有解决原版 `afterInitWorld` 给 `initRookieByServer` 传空值的问题。最新包装在输入为空时读取存档，非空输入仍优先使用原参数。状态节点为 `rookie-progress-restored`。

原版解码器本轮实测：

| `rookie0` | `decodeFinishedRookiePIDs` 结果 |
| --- | --- |
| 6210 | 2001、2006、2011、2012 |
| 66 | 2001、2006 |

旧补丁重启引导后曾把进度写回较小值。当前补丁不会自动找回已经丢失的完成位；不能不看证据就把所有账号改成 6210。恢复旧进度应优先寻找备份和该账号的 RPC 记录。

此前固定时间结算有多处入口：合成结束记录、ILD 后定时结束，以及回放入口的定时回城。最新补丁已删除这些定时处理。原版正常战斗超时和结束回执仍保留。引擎定时器和回放帧受运行时速度影响，不能把代码中的秒数直接当作实际墙钟时间。

## 文本调试的经验

用户要求：需要实际游戏验证时交给用户，不读取截图来反复验收。用户主动提供的画面可作为当次症状证据。默认使用 logcat、SQLite 和研究包返回的 JSON 排查。

读取存档时先确认设备端复制成功。遇到 `cp: No such file or directory` 后，继续 pull 同名 `/sdcard` 文件会读到旧导出，造成错误判断。每次用新的导出名和本机目录；SQLite 的 wal 必须一起取，避免混用旧 shm。

`analysis/query.py` 只等待约 2 秒，可能返回上一条结果。每条查询写唯一 `request`，确认一致再采用；若不一致，稍后读 `local-report.json`。不要因此重复执行创建、安装或修改状态的查询。

研究代码能读取 `.length`，但原函数字符串常只有 `[sourceless code]`。本轮通过临时替换工厂或方法的依赖，截获真实参数；替身在异常后必须恢复。大对象有环或原生节点，返回简化字段即可。

研究包可读取 `/data/local/tmp/dino-boot.js` 和 `dino-command.js`；正式交付库不读它们。结束研究时删除覆盖文件，重新安装正式 APK。先前研究启动脚本和原生轮询曾重复执行同一命令，详见 [TECHNICAL-NOTES.md](../history/TECHNICAL-NOTES.md)。

相关探针在 `analysis/query_native_*.js`。`analysis/query.js` 和 `last-report.json` 是可覆盖的工作文件，不能当作固定历史证据。`jsb-raid.sqlite` 保存了上一版无敌军、提前结算和进度回退时的文本快照；它不是当前设备的实时状态。

## 仍需检查的风险与下一步

离线回归能检查参数和适配状态，不能证明原生组件已创建或单位出现在画面中。前几次测试通过但人工复测失败，正是因为替身没有覆盖组件初始化。后续报告应分清“代码检查通过”“原引擎方法诊断通过”和“用户游戏复测通过”。

本轮日志曾出现六条存档建筑对应战斗单位计数 12，与“打爆后复活”一致，已按上节去重处理。复测时看 status 是否出现 `_createBattleUnitWhenInit-skip-dup` / `battle-units-defer-force`，以及 `battle-units-force-create` 的 `missing/created` 是否远小于存档建筑数。数量增长只说明有单位创建，不等于正确显示了全部建筑。

攻防所属也需核对。旧日志里 faction 2 的 client 昵称为 Enemy，faction 1 为 LocalRookie；HUD 昵称来自日志桩，不能证明单位归属正确。显示敌军后应检查每个单位的 faction、所属 client 和目标，避免攻击错误阵营。

接下来的验收顺序：

1. 确认村庄仍在、敌军仍攻、打爆一次即不可锁定（已通过，回归时再看一眼）。
2. 龙弹堡主动攻击已通过；后续战斗改动应回归原版索敌与伤害，勿恢复强制开火补丁。
3. 验证战斗按原版条件或正常倒计时结束，约 30 秒不再固定结算。
4. 返回时核对 `rookie-progress-restored` 和完成 PID，确认继续后续剧情。
5. 强杀后续读；默认保留存档。驻守英雄 / `unlock_defense` 后置。

离线检查与构建命令：

```powershell
node --check analysis/native_boot.js
node analysis/check_native_replay.cjs
python analysis/build_native.py
```

新账号资源、宝石加速、灰确认、联盟桩和入口修复等约定继续以 [NATIVE-DEV-CONTEXT.md](NATIVE-DEV-CONTEXT.md) 为准。最新敌袭进度以本文和用户后续反馈为准。
