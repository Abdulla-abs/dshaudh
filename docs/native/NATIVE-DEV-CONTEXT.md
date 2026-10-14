# 原流程本地适配：后续 AI 开发上下文

读者：后续接手的 AI / 工程师。本文汇总截至 **2026-10-14** 本轮会话已验证的代码约定、踩坑与关键符号，便于直接改 `analysis/native_boot.js` 继续推进，而不必重翻聊天记录。

首建后敌袭的最新结论与经验见 [NATIVE-BATTLE-HANDOFF.md](NATIVE-BATTLE-HANDOFF.md)。用户已确认村庄、敌军攻击、打爆不再复活，以及龙弹堡（301）主动攻击恢复。自然结算与剧情续接仍待单独验收。

**自 2026-10-14 起**：暂停扩玩法，优先 [BYTECODE-READABILITY.md](BYTECODE-READABILITY.md)（SM v22 反汇编 + RPC 契约）。结算链路契约见 [analysis/rpc-contracts/battle-finish.json](../../analysis/rpc-contracts/battle-finish.json)。改 `native_boot.js` 前先查契约证据等级；缺回执字段先探针，勿猜测。

配套必读：

- [BYTECODE-READABILITY.md](BYTECODE-READABILITY.md) — 字节码版本、解析命令、样本结论
- [NATIVE-ADAPTER-NOTES.md](NATIVE-ADAPTER-NOTES.md) — 运行时踩坑与禁止项
- [LOCAL-NATIVE.md](../operations/LOCAL-NATIVE.md) — 操作与验收清单
- [AGENTS.md](../archive/AGENTS-before-organization.md) / [HANDOFF.md](../history/HANDOFF.md) — 总方向与历史包
- [analysis/native-init-protocol.json](../../analysis/native-init-protocol.json) — 协议字段

实现主文件：`analysis/native_boot.js`  
构建：`python analysis/build_native.py` → `dino-local-native.apk`  
启动：`启动原流程本地适配.cmd` / `Launch-Native.ps1`  
存档键：`dino.local.native.v1`；状态环：`dino.local.native.status`  
本机：逍遥实例 **1**，ADB `127.0.0.1:21513`，DirectX。

截至本文写入时交付包 SHA-256：`d3f410a44a9bf2cb93d45fb1aac596351c6fc37b8416ca0cde35a2f668965655`（以同目录 `.sha256` 为准）。

敌袭自然结算：`clearBattleOperGates` **不得**清 `inReplayMode`；结算轨迹见 `dino.local.native.settle.trace` / status `settle-trace`。

战役解锁：`availableStages` / `finishedVirtualStages` / `pve_awardBox` 必须是对象表；`finishedVirtualStages[20001]` 后解锁 `availableStages[1]`（见 `ensureAvailableStages`）。状态环可见 `unlock-campaign-stage-1`。

战役进击：`rpc_s_enter_pve_battle` → `handleEnterPveBattle` → `rpc_c_enter_battle`；`oppo.player.stage` 必填；直播关不得带 truthy `replay`。村庄布局暂为 `local-inferred-compatible-pve` stub。契约见 `analysis/rpc-contracts/pve-enter.json`。

战役结算：`rpc_s_complete_pve_battle` → `handleCompletePveBattle` → `rpc_c_battle_result`；回城 `rpc_s_battle_to_home` 在 PVE 会话走 `handlePveBattleToHome`（勿与敌袭 `finish_enemy_attack_replay` 混用）。`applyPveStageProgress` 回写星级并解锁 `pve_next_stage`。契约见 `analysis/rpc-contracts/pve-settle.json`。

---

## 强制方向（勿违反）

1. 只替换失效服务器依赖；保留原客户端逻辑、界面、流程。
2. 主路径：`ClientPlayer.rpc_c_start_game` → `changeStageAndInit(BUILD)` → `GameControllerBuild.initLevelFromData`。
3. 禁止：另建主城、用八座测试城冒充初始城、强行 `enableOK=true` 点亮驯龙场（`20701.rely_base_lv=2` 是原版规则）。
4. 首次推断城五座：`20101`（龙首之城）/ `20601`（龙英巢）/ `21201`（建筑师小屋）/ `20201`（日光井）/ `20401`（龙银矿）；**不含** `207` 驯龙场（由后续教程引导）；`301`/`205`/`203` 由 Rookie 教程建造。旧档若仍带 `20701` 会在 `loadOrCreate` 时经 `normalizeStarterBuildings` 去掉并补齐 `202`/`204`。

---

## 本轮已落地能力（`native_boot.js`）

### 1. 新账号默认数据

| 字段 | 值 | 说明 |
| --- | --- | --- |
| `units` | 五座推断建筑（无驯龙场） | `source=inferred-rookie-minimal-201-206-212-202-204` |
| `user_config` | `{}` | 空 = 全新 Rookie |
| `first_movie_played` | `0` | 允许开场 → `_beginRookie` |
| 钻石 | 150 | 开局 50 +「女神来信」100（调研汇总） |
| 龙币 / 日光 | 各 5000 | 「公测新手礼包」汇总 |
| 英灵值 | 50 | 同上 |

常量：`LocalNative.NEW_ACCOUNT_STARTER`。  
序列号、七日登录等道具 **尚未** 自动发放。

### 2. 开场引导（曾坏过）

**踩坑**：曾强制 `first_movie_played=1` 且空实现 `FirstMovie.begin`，导致 `_beginRookie` 永不执行，无 `GH_story_*` 引导。

**现逻辑**：

- `installFirstMovieGuide`：尝试原版 `FirstMovie.begin`；已播/异常/超时 → `kickBeginRookie`。
- `_enterWorldAction` 软捕获后仍跟进 `_beginRookie`。
- `initRookieByServer`：输入为空时先读存档中的 `level.user_config`，无存档进度才用 `{}`；抛错时走 `bootstrapRookieFallback`。
- MenuControllerBuild.`afterInitWorld` 等「config is undefined」软捕获，避免打断 TaskManager 队列。

status 关键节点：`new-account-seed`、`FirstMovie.begin`、`initRookieByServer-exit`、`beginRookie-kicked` / `beginRookie-skip`。

### 3. 龙币 / 日光注入（曾只显示钻石）

**踩坑**：钻石走 `player.diamond` / `setDiamond` 即可；龙币/日光由建筑 **ResourceHolder** 汇总，`addRes` 后再 `updateResFromStage` 会被空仓库盖回 0。

**现逻辑**：`fillBuildingStorages` 写入主城 holder（`goldstorage`/`woodstorage`/`currentStorage`）→ 再 `addRes` / 写 `rm.Res[]` → `calculateResource`；不足时强制补种。`afterWorldReady` 在约 1s/3s/6s 再补种。

status：`seed-starter-res-enter` / `seed-starter-res`（看 `nowGold`/`nowWood`/`nowDia`）/ `seed-starter-res-skip`。

### 4. 建造与宝石加速完工

**建造请求**（已观测）：

```text
rpc_s_build keys: cid, typeid, x, y
例：{cid:7, typeid:30100, x:24, y:24}
```

注意施工中 typeid 常为 `30100`（占位），完工后应变为 `30101`。

本地：分配 `sid`（自 100 起）→ `rpc_c_ans_build({success,unit:sid,cid,typeid})` → 按 `buildTime` 调度完工；`pendingBuilds[sid]={cid,typeid,...}`。

**宝石加速**：

```text
客户端：useRes(DIAMOND) → callServer(rpc_s_build_finish_imm)
```

**踩坑**：

1. 回执若只认 `sid`、请求只有 `cid` → 只扣钻不完工。
2. 调用 `rpc_c_build_complete` 时部分单位无 `server_build_complete` → 抛错；错误换模会导致建筑「消失」。
3. `confirmFinishNow` 与 `callServer` 各强制一次会双完工，切勿重复。

**现逻辑**：

- `resolveBuildTarget`：sid / cid / pendingBuilds / activeBuilder / 施工中单位。
- `finishViaBuilder`：优先 `BuildingBuilder.upgradeFinish` → `finishBuildingState` → `onBuilderFinishBuilding`（负责 30100→30101 换模）。
- `forceFinishBuilding`：先 builder 完工；成功则 **不再** 二次 `rpc_c_build_complete`；失败才兜底；**禁止** `deleteUnit`。
- `ensureUnitBuildCompleteHook`：缺 `Unit.server_build_complete` 时补桩转 builder。
- `confirmFinishNow` 仅在 0.15s 后若仍 `BUILD_STATE_BUILDING` 才 retry。

status：`callServer-rpc_s_build` → `ans-build` → `force-finish` / `finishViaBuilder-ok` / `force-finish-ok`。

### 5. 其它 callServer

| 方法 | 处理 |
| --- | --- |
| `rpc_s_set_user_config` | `{value,offset}` 合并进存档 |
| `rpc_s_set_first_movie_played` | 写玩家与存档 |
| `rpc_s_build` / `rpc_s_build_update` | ans + 延时完工 |
| `rpc_s_build_finish_imm` 等 | `forceFinishBuilding` |
| `rpc_s_move_to_tile` / `rpc_s_set_to_tile` | `rpc_c_set_to_tile` |
| `rpc_s_request_region_map` 等 | **静默吞掉**（曾刷爆 status 80 条日志） |

---

## 调试手段（交付包）

交付包不可 `run-as`。读存档：

```powershell
adb -s 127.0.0.1:21513 shell "su -c 'cp /data/data/com.netease.h1.qihoo/databases/jsb.sqlite /sdcard/jsb-native.sqlite; cp /data/data/com.netease.h1.qihoo/databases/jsb.sqlite-wal /sdcard/jsb-native.sqlite-wal; cp /data/data/com.netease.h1.qihoo/databases/jsb.sqlite-shm /sdcard/jsb-native.sqlite-shm; chmod 644 /sdcard/jsb-native.sqlite*'"
adb -s 127.0.0.1:21513 pull /sdcard/jsb-native.sqlite f:\kdzlj\analysis\jsb-native.sqlite
adb -s 127.0.0.1:21513 pull /sdcard/jsb-native.sqlite-wal f:\kdzlj\analysis\jsb-native.sqlite-wal
adb -s 127.0.0.1:21513 pull /sdcard/jsb-native.sqlite-shm f:\kdzlj\analysis\jsb-native.sqlite-shm
python f:\kdzlj\analysis\read_native_status.py
```

清数据验新账号：

```powershell
adb -s 127.0.0.1:21513 shell pm clear com.netease.h1.qihoo
```

logcat 标签：`DinoLocal` / `DinoLocalError` / `DinoLocal STATUS`。

辅助脚本：`analysis/read_native_status.py`、`analysis/read_native_calls.py`。

---

## `native_boot.js` 关键符号索引

| 符号 | 用途 |
| --- | --- |
| `defaultPlayer` / `defaultLevelDict` | 新账号种子 |
| `NEW_ACCOUNT_STARTER` | 礼包汇总量 |
| `seedStarterResources` / `fillBuildingStorages` | 龙币日光钻石英灵注入 |
| `installFirstMovieGuide` / `kickBeginRookie` | 开场与 Rookie 启动 |
| `bootstrapRookieFallback` | initRookie 软失败兜底 |
| `afterWorldReady` | 进图后补种资源、安全踢引导、灰确认清理 |
| `installCallServer` | 全部本地 RPC 回执 |
| `resolveBuildTarget` / `forceFinishBuilding` / `finishViaBuilder` | 建造/宝石加速完工 |
| `ensureUnitBuildCompleteHook` | 补 `server_build_complete` |
| `buildEnemyAttackReplayDict` / `handleEnterEnemyAttackReplay` | 301 后 `start_replay_pve` 本地回放 |
| `makeBattleSide` / `ensureBattleVillageUnits` | 敌袭 self 扁平化 + 空村强制补建 |
| `resolveBattleClient` / `withBattleClient` / `spawnStubAttackers` | 注入防守 client；stub 进攻 10101 |
| `enableDefenderLiveCombat` / `clearBattleOperGates` | 解除本地回放操作限制；不强制索敌或开火 |
| `abortBattleEnterToHome` / `clearLoadingSafe` | 战斗加载失败回主城 |
| `writeStatus` | status 环（重要步骤不节流） |
| `cancelBlockedPlacement` | 仅 `rely_base_lv` 灰确认自动取消 |

---

## 首建后剧情加载卡住（历史问题，进入敌袭已确认）

症状：引导建完 301 并用宝石加速后，进入 `start_replay_pve` → 加载页永不结束。

根因（logcat `DinoLocalError`）：本地回放字典把 `oppo` 写成扁平对象，原版 `GameControllerBattle.initLevelFromData` 读 `data.oppo.player` 抛 `TypeError`，TaskManager 中断，`SceneLoading` 不收。

修复：`buildEnemyAttackReplayDict` 补嵌套 `oppo.player` 和 `self`。战斗 ILD 软捕获后 `abortBattleEnterToHome` 只返回一次，不再调用旧控制器的 `finishRookieProcess`。`scheduleOnRoot` 优先走原版 `GameScene._global_schedule_node`，避免主城节点拆除后丢失回调。字段与跨场景调度已通过离线检查，实际剧情由用户验证。

首次复测发现 `level_data.self` 缺失，错误返回主城后传入空 `user_config`，导致引导重启。本次补齐数据，并让 `saveLevel` 保留 RPC 已保存的进度；战斗阶段不能 dump 覆盖主城。旧存档建筑按 `typeid` 补齐 `unit_type` / `unit_level`。离线回归新增重复进入、重复返回、过期超时回调与空进度覆盖检查。

status：`rpc_c_enter_enemy_attack_replay-called`（看 `hasOppoPlayer` / `hasBattleLog`）→ `battle-initLevelFromData-enter/exit`；失败见 `battle-initLevelFromData-ERR` / `abort-battle-enter`。旧 `replay-empty-records-auto-finish` 属于已撤销的定时返回，不能作为当前验收目标。

### 敌袭页空村 / 倒计时无反应（2026-10-13，三次）

后续文本诊断证明三次补丁仍传错参数。原版 `_createBattleUnitWhenInit(unitData, client)` 必须传第二个参数；原版 `createUnit(params)` 只收配置对象。最新补丁已修正，并使用 `sendUnitToMap(params, position)` 和 `MapManager.TileCenterPosForLogicCoord(x, y)` 出兵。读取 `defenders` / `attackers` 统计数量；结束由原版 `scheduleDelayedBattleFinish` 处理，不再在战斗未结束时直接返回。村庄显示、敌军行动和去重已有用户确认；自然结算与剧情续接仍待验收。

二次后 UI 正确，建房仍全失败：`_createBattleUnitWhenInit` → `client is undefined`。

三次：`resolveBattleClient` / `withBattleClient` 注入防守方 ClientPlayer；`spawnStubAttackers`（10101）；强制补建以单位数增长为准。

验收 status：`resolveBattleClient.hasClient`、`_createBattleUnitWhenInit-exit`（`hasClient:true`）、`spawnStubAttackers`、`battle-units-force-create.now>0`。

## 已知仍开放的缺口

2026-10-14，用户确认龙弹堡主动攻击恢复。回放回执必须提供 `replay.seed: 1`；只写外层 `seed` 会让 `DA.getRandom()` 和索敌计时变成 `NaN`。已移除 `wakeDefenderBattleControllers` 等强制开火补丁，让原版状态机工作。原引擎捕获 `beginSkill(30101, targetCID)`，累计伤害 270；证据见 `analysis/tower-seed-only-result-1014.json`。技能 ID 为 `30101`，`30101_atk` 是声音名。驻守 RPC 后置。

1. 宝石加速完整上机验收（扣钻 → 换模 30101 → 强杀仍在）。
2. 龙币/日光在部分机型上 holder 数量为 0 时需确认 `fillBuildingStorages` 是否命中主城；必要时继续强化。
3. `decodeFinishedRookiePIDs` 位布局未完全逆向。
4. 真实 `start_game` 的 `units[]` 坐标、`model_info`、仓库初始存量仍缺。
5. 敌袭村庄、敌军、打爆去重和龙弹堡主动攻击已有用户确认；自然结算和剧情续接仍待复测。固定时间回城已撤销。真实士兵回放、驻守英雄与完整观战尚未恢复。
6. `rpc_s_request_chat_and_letter` 等仍记 unhandled（可继续静默）。

---

## 禁止再犯

- 不要空实现 `FirstMovie.begin` 而不调 `_beginRookie`。
- 不要对龙币/日光只 `addRes` 后立刻 `updateResFromStage` 而不写 holder。
- 不要宝石加速只调 `rpc_c_build_complete` 而不走 `BuildingBuilder.upgradeFinish`。
- 不要因 `enableOK===false` 自动 `onPressNO`（会杀 Rookie UI）。
- 不要把 `rpc_s_request_region_map` / `rpc_s_adjust_battle_time` 写入 status（刷屏）。
- 不要注册真 `ClientLeague` 进 UnitManager。
- 敌袭回放不要省略 `tempReplayBattleLog` / `battleLogItem`（会空村）。
- 回放种子必须放在 `replay.seed`；不要再用无参数 `beginSkill()`、人工威胁值或反复 `resumeBattle` 代替原版 AI。

---

## 建议下一验收顺序

1. 清数据 → 新账号 → 确认 HUD：龙币 5000、日光 5000、钻石 150，且开场引导出现。
2. 引导建 301 → `ans-build` → 宝石加速 → `finishViaBuilder-ok`，建筑仍在且为完工模型。
3. 强杀再进：建筑、`user_config`、资源一致。
4. 取消放置不扣费；重复完工回执不重复扣费。
