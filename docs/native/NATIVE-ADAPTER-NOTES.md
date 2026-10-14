# 原流程本地适配：运行时笔记

读者：后续接手的 AI / 工程师。读完应能接着改 `dino-local-native`，而不是重走已踩过的坑。

配套入口：`LOCAL-NATIVE.md`（操作与已验证清单）、`analysis/native-init-protocol.json`（协议字段）、实现 `analysis/native_boot.js`。

截至 2026 年 10 月 13 日，交付包 `dino-local-native.apk`（见同目录 `.sha256`）。

## 2026 年 10 月 13 日：首页按钮与真机加载中断已修复

`MainMenu.isLegalAgreed` 必须保持为函数。原按钮会调用 `isLegalAgreed()`；改成布尔值会打断按钮回调。当前返回已同意状态，并保留勾选框处理。

RMX3823 加载卡住的直接原因已用日志确认：初始化报错后，`AppErrorReport.handleError` 调用旧错误上传器。网络访问遭拒，抛出 `SecurityException`，使 GLThread 退出。现在 `handleError` 将类型和详情写到 Android 日志 `DinoLocalError`，不再访问上传服务器。补丁在 `analysis/apk/smali/com/netease/dacommon/AppErrorReport.smali`；`build_native.py` 会先重编译该目录，避免打入旧 dex。

交付包在逍遥实例 1 和 RMX3823（Android 16）均已验证：绿色按钮进入主城，强杀后“本地进入”继续进入。覆盖安装保留应用数据。证据见 `analysis/native-entry-fix-verification.json`。本次未验证首建 301；`config is undefined` 和 `dict is undefined` 两项初始化错误仍有日志，需要后续补齐对应数据。

## 强制方向

只替换失效服务器依赖。保留原客户端逻辑、界面和流程。

禁止：另建主城场景；用八座测试建筑冒充初始城；重写 `BuildActionBar` / Rookie / `BuildingBuilder` 玩法；为过关而强行点亮被 `rely_base_lv` 灰掉的确认键。

主路径必须是：

`ClientPlayer.rpc_c_start_game(levelDict)` → TaskManager selector → `changeStageAndInit(GS_STAGE_BUILD, levelDict)` → `__init_stage_build` → `GameControllerBuild.initLevelFromData(levelDict)`。

## 已验证调用链

1. `rpc_c_start_game` 仅在 `GS_CURRENT_STAGE === GS_STAGE_NONE`（0）时生效，否则空返回。
2. 内部排队 `TASK_TYPE_SELECTOR`，再调 `changeStageAndInit(1, 同一 levelDict)`。
3. `initLevelFromData` 大致顺序：地图初始化 → `G_Player.initByServer(player)` → `__buildWorkerTown` / `__buildUnit(units)` → walls / model_info / hero_donate → `afterInitWorld` → `initRookieByServer(user_config)`。
4. 适配层在进图前必须把 stage 置回 `GS_STAGE_NONE`，并 `DA.SynServerTime`。

## levelDict 与初始城

顶层键：`player`、`units`、`walls`、`model_info`、`hero_donate_list`、`user_config`。原样下传，不要拆包。

单位记录至少要有：`sid`、`typeid`（或 `unit_type`+`unit_level`）、`x`、`y`、`state`。完工用 `BUILD_STATE_FINISH`（2）。阵营用 `BATTLE_FACTION_DEFENDER`（2）。

客户端 **没有** 默认城池布局表。新账号 `units[]` 本应由服务器下发。按教程实测与 Rookie 路径，本地新账号种子为：

| 族 | typeid 例 | 原因 |
| --- | --- | --- |
| 201 主城 | 20101 | 后续升级/剧情依赖 |
| 206 龙英巢 | 20601 | 升级任务前须已存在 |
| 212 建筑师 | 21201 | 至少一座工人镇 |
| 202 日光井 | 20201 | 开局生产建筑 |
| 204 龙银矿 | 20401 | 开局生产建筑 |

**不含** `207` 驯龙场：预置会导致训练引导卡死；驯龙场由后续教程引导建造（升级仍需 `rely_base_lv=2`）。教程中再建：301、205、203。坐标目前是 `MAP_SIZE_BUILD`（9–50）内占位，`source` 标为 `inferred-rookie-minimal-201-206-212-202-204`。旧档若仍带 `20701`，`loadOrCreate` 会经 `normalizeStarterBuildings` 去掉并补齐 `202`/`204`。有真实 `start_game` 样例后应替换。

存档键：`dino.local.native.v1`（schema 1）。写入 `sys.localStorage` → 应用私有库 `databases/jsb.sqlite`（表 `data`，列 `key`/`value`）。交付包不可 `run-as`，读库用 `su` 拷到 `/sdcard` 再 pull（含 `-wal`/`-shm`）。

## 运行时踩坑（必读）

### initByServer 会抛错，但要软过

离线时 `initByServer` 会进 SocialBox / LetterManager。曾出现：

- `TypeError: this.new_message is undefined`
- `TypeError: logs is undefined`（SocialBox.js）

适配层对 `ClientPlayer.prototype.initByServer` 做 try/catch：失败则 `applyPlayerFallback` 回填昵称、`exp`、分数等，**不要 rethrow**，否则 `initLevelFromData` 建不出建筑。

同时软包裹 LetterManager / SocialBox，并给组件补 `new_message=0`、`logs=[]`。根因桩尚未完全消掉。

### G_League 只能用普通桩对象

`MenuControllerBuild` 会调 `G_League.getDungeonRemainSecs`、`inCalculateTime` 等。缺方法时 `__buildUnit`（尤其主城 201）会炸。

**不要** `new ClientLeague` 再 `addUnit` 进 `G_UnitManager`。真实例会弄坏 `getPlayer().getComponent(...)`，导致全部单位创建失败。

用带 `__localNativeLeagueStub` 的 plain object，补全 `ClientLeague.strings` 里常见方法（返回 0 / false / `''` / noop）。

### GETGC / GETMC 在进图后可能不可靠

`DA.getGameController()` / `GETGC()` 有时拿不到带 `menu` 的控制器。`diagnose` 会误报 `buildings=0`。

做法：在 `GameControllerBuild` 的 `__buildUnit` / `afterInitWorld` 包装里把 `this` 存到 `LocalNative.buildController`。取菜单用 `gc.menu`（`MenuControllerBuild`），不要只信 `GETMC()`。

`scheduleOnRoot` 优先使用 `GameScene._global_schedule_node`，该节点跨阶段保留。缺少该节点时才使用 `mc.rootNode` / `gc.rootNode`。切换到战斗会拆除主城节点，不能只把加载恢复回调挂到主城菜单；MainMenu 的 `menu.rootNode` 进主城后也可能已拆掉。

### HUD：昵称与「undefined」蓝条

- `UserName` ← `G_Player.nickname`（种子用 `LocalRookie`）。
- 头像下蓝条是 `MenuControllerBuild.exp`（经验），**不是**联盟名。`player.exp` / `experience` 未定义时，标签会显示字面量 `undefined`。写入 `0` 并 `refreshHud` 强制 `setString`。
- `updatePlayerLabel` 可能绑错字段；`refreshHud` 在调用后再刷 `UserName` / `NumScore` / `exp`。

### 灰确认 = rely_base_lv，不是缺回执

驯龙场 `unit_main['20701'].rely_base_lv === 2`：龙首之城一级时，升级（或未满足条件的建造确认）会灰掉 OK。这是原版规则。

首座 207 应已在 `units[]` 里完工。不要为了点亮确认键去改门槛或伪造二级主城。绿格残留时可点橙色 X；`s_none` 下反复 `switchToNoneState` 无效且会干扰操作。

额外 207 座数看 `data.build_number[207]`（主城一级最多 1 座等）。

### 声音会打断登录

离线 FMOD/`SoundManager.playSound` 在点绿色登录钮时可能抛错，登录钩子跑不完。进菜单后立刻 quiet 掉 `G_SoundManager` / `SoundManager.prototype`。ADB 稳妥点底部字幕带：约 `(640, 700)`（1280×720）；绿钮约 `(640, 465)`。

### 地图缺 tile 会空图

`MapManager.init` 若 `config.tile` 为空，强制 `map/world1.tmx`，并尽量补 `MAP_SIZE_BUILD`。

## 适配层职责（native_boot.js）

| 能力 | 说明 |
| --- | --- |
| `loadOrCreate` / `saveLevel` | 首次写推断四座；继续读本地 |
| `installCallServer` | 拦 `rpc_s_set_user_config`、建造/升级/移动，尝试 `rpc_c_ans_*` / `rpc_c_set_to_tile` |
| `installEngineGuards` | 地图、initByServer 软过、ILD/`__buildUnit` 追踪、Social 软失败 |
| `ensureLeague` | 联盟方法桩 |
| `refreshHud` | 经 `gc.menu` 刷昵称/经验/奖杯 |
| `tryDumpAndSave` | `dumpLevelData` 回写存档 |
| `writeStatus` | `dino.local.native.status`：`{latest, log}`，便于 su 拉库排查 |

全局暴露：`LocalNativeGlobal = LocalNative`（研究注入时可用）。

入口挂钩：`G_MainController.platformLogin` / `login` / `quickLogin` → `startGame`；底部 `UI.Touchable` 兜底点击。

## 调试手段

1. 清数据：`adb -s 127.0.0.1:21513 shell pm clear com.netease.h1.qihoo`
2. 装包后点字幕进入，等约 15s。
3. 用 `su` 拷 `jsb.sqlite` + wal/shm，Python `sqlite3` 读 `dino.local.native.status` 的 `log`（看 `initByServer-soft`、`__buildUnit-exit`、`diagnose`）。
4. 截图对照：昵称、`exp`、建筑师数、是否四座上图。
5. 研究包（可 debug）与交付包差异见 `TECHNICAL-NOTES.md`；交付包不要依赖 `run-as`。

本机：逍遥实例 **1**，ADB `127.0.0.1:21513`，DirectX。实例 0 是用户环境，勿占用。

## 禁止与推荐

禁止：

- 把 `dino.local.city.v*` 八座测试城当官方初始城。
- 注册真 `ClientLeague` 进 UnitManager。
- `initByServer` 失败后 rethrow 打断建城。
- 强行 `enableOK=true` 绕过驯龙场主城等级。

推荐：

- 新 RPC 先在 `callServer` 打日志，再补最小 `rpc_c_*` 回执。
- 改种子单位后清应用数据再验（旧 `v1` 存档会挡住新默认值）。
- 长状态日志避免每帧写相同 `placement-check`（会挤掉真正的 init 步骤）。

## 2026 年 10 月 13 日：进入游戏卡住修复

人工复测卡在主菜单绿钮：字幕仍是「点击进入游戏」，说明 `platformLogin` 从未执行。根因是原版先查 `legalCheckBox.controller.isChecked()`，未勾选只弹 `please_agree_legal_first`，不进登录。

已改：

1. **强制勾选协议**（`setChecked` + `isChecked→true` + `isLegalAgreed` 恒真，并短时重复施加）。
2. 去掉自动进入；去掉 `enableOK===false` 误取消。
3. 底部增加 **【本地进入】** 备用按钮；绿钮仍走原版 `platformLogin` 钩子。
4. `writeStatus` 节流；`entering` 超时解锁。

重装后字幕应含「已勾选协议」。点绿钮或【本地进入】后字幕应变为「已点击进入…」再进加载。

## 2026 年 10 月 13 日：首建闭环准备（未上机验收）

已在 `native_boot.js` 落地，**尚未**稳定跑通「建造 301 → 完工 → 强杀一致」验收：

1. **玩家种子**：`defaultPlayer` / 旧存档补齐 `new_message`、`letters`/`sys_letters`、`battle_recorders` 等；`getBattleLog` 空则回 `[]`。
2. **`rpc_s_build`**：分配 sid → `rpc_c_ans_build` → 延时 `rpc_c_build_complete`；`completedSids` 去重。
3. **`user_config`**：`{value,offset}` → `user_config[offset]` + `rookieBits`。
4. **取消**：仅 `rely_base_lv` 自动取消；不强制点亮驯龙场。

## 2026 年 10 月 13 日：首建闭环补强（代码，待清数据验收）

在上一版基础上继续：

1. **`rpc_s_set_first_movie_played`**：写入玩家与存档。
2. **`BattleRecorder.initByServer`**：调用前预填 `battle_recorders`/`battleLog`，减少 SocialBox `logs` 链中断。
3. **`initRookieByServer`**：status 记录 finished/unfinished PID，便于对照引导停步。
4. **`probe-30101`** + **`seed-starter-res`**：按调研的新账号礼包注入资源（见下节）；`starterResGranted` 防重复。
5. **`resumeConstructions`**：中途强杀后按 `beginTime`+`buildTime` 补发或重排 `rpc_c_build_complete`。

## 2026 年 10 月 13 日：新账号起步资源（调研礼包汇总）

原服无固定「初始资源包」，资源来自新手引导/女神来信/公测礼包等。本地新账号一次写入汇总量：

| 项 | 数量 | 说明 |
| --- | --- | --- |
| 钻石 | 150 | 开局 50 + 女神来信 100 |
| 龙币 | 5000 | 公测新手礼包 |
| 日光 | 5000 | 公测新手礼包 |
| 英灵值 | 50 | 公测新手礼包 |

实现：`defaultPlayer.diamond/spirit` + `LocalNative.NEW_ACCOUNT_STARTER` / `seedStarterResources`。序列号、七日登录等道具尚未自动发。

验收仍须：清数据 → 引导 → 建 301 → 扣费/施工/完工 → 强杀一致；取消不扣费。

## 2026 年 10 月 13 日：新账号默认数据与开场引导

此前强制 `first_movie_played=1` 且空实现 `FirstMovie.begin`，导致 `_beginRookie` 从未执行，开场剧情/`GH_story_*` 不起。

现改为：

1. 首次无存档 → `defaultLevelDict`（五座推断城无驯龙场 + 空 `user_config` + `first_movie_played=0`）。
2. `FirstMovie.begin`：尝试原版；已播过或异常时 `kickBeginRookie`；超时兜底。
3. `_enterWorldAction` 软捕获后仍跟进 `_beginRookie`。
4. 继续游戏保留存档中的 `first_movie_played` / `user_config`，不再强行改成已播。

status 关键节点：`new-account-seed`、`FirstMovie.begin`、`beginRookie-kicked`、`initRookieByServer-exit`。

## 2026 年 10 月 13 日：龙币/日光与宝石加速（重要）

### 龙币 / 日光

钻石可写 `player.diamond`；龙币/日光必须进建筑 **ResourceHolder**，否则 `updateResFromStage` 会盖回 0。用 `fillBuildingStorages` + `seedStarterResources`；status 看 `seed-starter-res` 的 `nowGold`/`nowWood`。

### 建造 / 宝石加速

- `rpc_s_build` 实测参数：`{cid, typeid, x, y}`；施工 typeid 常为 `30100`，完工后应为 `30101`。
- 宝石加速：客户端先 `useRes(DIAMOND)` 再 `rpc_s_build_finish_imm`。
- **禁止**只调 `rpc_c_build_complete`：部分单位无 `server_build_complete`，会抛错并导致换模失败、建筑像「消失」。
- 正确路径：`forceFinishBuilding` → `finishViaBuilder`（`upgradeFinish` / `finishBuildingState` / `onBuilderFinishBuilding`）。
- `confirmFinishNow` 只做延迟 retry，避免与 callServer 双完工。
- `rpc_s_request_region_map` 必须静默，否则冲掉 status 日志。

完整符号表、调试命令与禁止项见根目录 **[NATIVE-DEV-CONTEXT.md](NATIVE-DEV-CONTEXT.md)**。

## 下一步缺口

- 宝石加速完整验收：扣钻 → `finishViaBuilder-ok` → 建筑仍在且为 30101 → 强杀一致。
- Rookie `decodeFinishedRookiePIDs` 位布局仍未完全逆向。
- 真实 `start_game` 的 `units[]` 坐标、`model_info` 与仓库初始存量。
- 首建后 `start_replay_pve`：本地回放字典必须含嵌套 `oppo.player`（扁平 `oppo` 会在 `GameControllerBattle.initLevelFromData` 抛错并卡加载页）。失败时用 `abortBattleEnterToHome` 清加载回 BUILD。真实 records/士兵观战仍后置。
- 采集/升级原版回执、训练、英雄、阵容仍后置。

## 相关文件

| 路径 | 用途 |
| --- | --- |
| `NATIVE-DEV-CONTEXT.md` | **本轮 AI 开发上下文汇总（优先读）** |
| `analysis/native_boot.js` | 适配实现 |
| `analysis/build_native.py` | 打 `dino-local-native.apk` |
| `Launch-Native.ps1` / `启动原流程本地适配.cmd` | 装包启动 |
| `analysis/native-init-protocol.json` | 协议与 Rookie 推断 |
| `analysis/read_native_status.py` | 拉库后读 status/store |
| `LOCAL-NATIVE.md` | 操作说明 |
| `HANDOFF.md` / `TECHNICAL-NOTES.md` / `AGENTS.md` | 总接手与历史实验包 |
