# 恢复技术笔记

## 回放随机种子与龙弹堡攻击（2026-10-14，用户确认）

`GameControllerBattle.initLevelFromData` 从嵌套回放对象读取 `replay.seed`，再调用 `BattleRecorder.setRandomSeed`。只提供外层 `seed: 1` 会传入 `undefined`，使 `DA.getRandom()` 与 `StaticBattleController.lastIdleUpdateTime` 变成 `NaN`。当前回执已补齐 `replay: {seed: 1, records: [[1, 0, 7]]}`。

原引擎随后自行调用 `beginSkill(30101, targetCID)`，记录到 270 点累计伤害，用户也确认修复成功。证据见 [analysis/tower-seed-only-result-1014.json](../../analysis/tower-seed-only-result-1014.json)。原表技能键是 `30101`，`30101_atk` 是声音名；此前依靠 `no_auto` 的推断已撤销。

适配层只解除本地回放所需的操作限制，不强制调用 `beginSkill()`、灌入威胁值或反复重建技能管理器。`check_native_replay.cjs` 已检查嵌套种子和这一边界。完整接手与剩余缺口见 [NATIVE-BATTLE-HANDOFF.md](../native/NATIVE-BATTLE-HANDOFF.md)。

## 原版初始化协议（本地适配方向）

方向：只替换失效服务器依赖，不另建主城、不手摆初始城、不重写玩法。完整字段与缺口见 `analysis/native-init-protocol.json`（probe `native-init-probe-001`～`020`）。

### 调用链（已用研究包验证）

1. `ClientPlayer.rpc_c_start_game(levelDict)` — 参数 1 个。仅当 `GS_CURRENT_STAGE === GS_STAGE_NONE` 时生效；否则直接返回。内部 `pushFrontTask(TASK_TYPE_SELECTOR=4, selector)`，selector 调用 `changeStageAndInit(GS_STAGE_BUILD, levelDict)`。
2. `changeStageAndInit(stage, levelDict)` — 参数 2 个。BUILD 时走 `__init_stage_build`。
3. `__init_stage_build(levelDict)` — 进入主城控制器并 `initLevelFromData`。
4. `GameControllerBuild.initLevelFromData(levelDict)` — 顺序：`initByServer(player)` → 建工人镇/单位(`units`) → `walls` → `model_info` → `hero_donate_list` → `afterInitWorld` → `initRookieByServer(user_config)`。

`levelDict` 顶层键：`player`、`units`、`walls`、`model_info`、`hero_donate_list`、`user_config`。`rpc_c_start_game` 原样下传，不拆包。

### 单位与资源字段

- `Unit.dumpParams()` 观测：`unit_type`、`unit_level`、`typeid`、`unit_mutateid`、`faction`。
- `TileHolder.dumpData(out)` 写入 `x`、`y`（逻辑格，不是像素）。
- `BuildingBuilder`：`state`（0 未建 / 1 施工 / 2 完工）、`beginTime`。
- `ResourceProductor`：`currentStorage`、`lastCollectTime`（小时时间）。
- `ResourceManager.init` 读 `diamond`/`spirit` 等；日光/龙币由建筑仓库汇总，不能只靠玩家字典塞 `gold`/`wood`。
- 常量：`HOMEBASEID=201`，`WORKERTOWNID=212`，`BUILD_STATE_FINISH=2`。

### 新账号 / 教程

- 教程系统是 Rookie：`data.rookie_controller`（235 条）、`data.rookie_code`、`user_config`/`rookieBits`，进度经 `rpc_s_set_user_config` 回写。
- 开场 `200100`～`200102`（`GH_story_*`）；随后教程里 **建造** 301、205、203；**已存在** 才讲的有 207 训练、206 升级、201 升级。
- `data.*` 中无 city/layout 默认表。八座测试建筑坐标不能当作官方初始城。
- `decodeFinishedRookiePIDs` 的 bit 布局尚未还原（安全试探均得 `{}`）。

### 研究注意

- 探测前必须把 `GS_CURRENT_STAGE` 置回 `GS_STAGE_NONE`，否则 `rpc_c_start_game` 静默空返回。
- `makeSelector` 可能在排队时绑定函数引用；拦截要打在 `prototype` 上且在 `rpc_c_start_game` 之前。
- 未补齐 MapManager/GETCGC 时不要放行完整主城 `onUpdate`；空数据接通会崩（见下文「原版完整主城实验」）。

### 交付适配运行时结论（2026-10-13）

完整踩坑清单与禁止项见根目录 **`NATIVE-ADAPTER-NOTES.md`**。此处只记与协议紧挨的结论：

- `initByServer` 离线抛 SocialBox/`new_message`/`logs` 时，必须软过并回填 `nickname`/`exp`，否则建筑数为 0。
- 真 `ClientLeague` 入 UnitManager 会断 `getPlayer().getComponent`；联盟用 plain stub。
- `20701.rely_base_lv=2`：一级主城下驯龙场相关确认键变灰是原规则。
- HUD 蓝条字段是 `MenuControllerBuild.exp`，缺省会显示字面量 `undefined`。
- 进图后缓存 `GameControllerBuild` 实例；`GETGC`/`GETMC` 可能拿不到带 `menu` 的对象。
- 交付包读存档：`su` 拷 `databases/jsb.sqlite`（含 wal/shm），键 `dino.local.native.v1` / `dino.local.native.status`。

## 本地主城界面、比例与占地

运行时研究（`analysis/cityui-native-configs.json`，query `footprint-scale-001` / `mapmgr-init-005`）：

| 对象 | 结论 |
| --- | --- |
| `OBJ_LAYER_SCALE` | 全局常量 `0.5`；Unit 用 `unit_resource.scale_rate`（缺省按 1），ObjLayer 再乘该系数 |
| `tilesize_x/y` | 在 `data.unit_main`：201/206→4，202–205→3，207→5，212→2 |
| `world1.tmx` | isometric 60×60，tile 64×47；`getPositionAt(0,0)=(1888,2773)`，Δx/Δy = ±32 / ∓23.5 |
| `MAP_SIZE_BUILD` | `{xmin:9,ymin:9,xmax:50,ymax:50}` |
| 预览色 | `UI_COLOR_TILE_DRAGED_AVAILABLE={140,245,70}`，`UNAVAILABLE={250,72,60}`，透明度 125 |
| `RS.LOGIC_TILES` | `map/logic.png` |
| UI CCBI | `HomeBuildingActionBar` / `BuildingActionCard` 可加载（空控制器）；完整 `BuildActionBar.setBuildingInfo` 依赖 Unit/stage，本版未接 |

本地实现把建筑直接挂在地图 CCBI 上（无 ObjLayer），因此 `setScale(buildingScale(type))` 即 `scale_rate * 0.5`。存档 `v12` 增加 `tilex/tiley`；像素 `x/y` 为占地中心 `tileCenter(tx+(sx-1)/2, ty+(sy-1)/2)`。`Game.MapManager.init` 在缺 master/file 时仍失败，坐标用 TMX `getPositionAt` 公式本地复现，不声称已接通完整 MapManager。

生成器 `make_cityui.py` 从 `mine_boot.js` 注入；注意与训练生成器相同的锚点唯一性问题。DrawNode 绘制菱形时颜色用 0–1 浮点；`drawPolygon` / `drawPoly` / `drawSegment` 做兼容回退。

## 本地新建日光井与龙银矿

在日光井新建之上扩展（见 `analysis/mine-native-configs.json`）：

| 对象 | 结论 |
| --- | --- |
| `20201` | 700 龙币、180 秒（与上一版相同） |
| `20401` | `BuildingBuilder.getRealCost()`=700，资源为日光（`RES_TYPE_WOOD`），`buildTime`=180 |
| `data.build_number[204]` | 与 202 同级：主城 lv1→1 座，lv2→2，…，lv6 起 6 座 |
| UI | 底部键改为“建造生产”；放置中再点可切换类型 |
| 扣费 | 按 `builder.resType` 扣 `gold` 或 `wood`，不再写死龙币 |

存档键 `dino.local.city.v11`。`MAX_EXTRA=10`；额外建筑须属于 `20201` 或 `20401` 升级链。校验对每个 `CONSTRUCT_OPTIONS` 族分别检查 `familyCount <= maxFamily`。生成器为 `make_mine.py`（从 `construct_boot.js` 注入）。

夹具验证注意：`read()` 会 `force-stop`，后续 UI 操作前必须再 `start()`，否则点击落在桌面造成假失败。

## 本地新建日光井

研究结论（见 `analysis/construct-native-configs.json` 与既有 `cultivate-inspect` / Shop 字符串）：

| 对象 | 结论 |
| --- | --- |
| 新建费用 | 原商店用 `unit_main.lv_up_cost` / `lv_up_cost_type`；`BuildingBuilder(20201).getRealCost()`=700，资源为龙币 |
| 新建耗时 | `buildTime` / `lv_up_time`=180 秒 |
| `data.build_number[202]` | 主城 lv1→1 座，lv2→2，…，lv6 起 6 座；默认布局已有 1 座，第二座需主城≥2 |
| 交付范围 | 只接额外 `20201`；最多追加 5 座；uid 为 `building-N`（N≥8） |

存档键 `dino.local.city.v10`。建筑可带可选 `construct:{started,ends}`，校验要求 `ends===started+lv_up_time`，且全局 `upgrade`+`construct` 至多 1 个。施工中不建 `production`；`settle()` 完成时删 `construct` 并写入 `production[uid]={stored:0,lastHour:ends/3600}`，返回值增加 `construct` 完成列表。

UI：底部第五键“建造日光井”进入 `placingNew`，点空位扣费落档并 `spawnNode`；与移动共用 260 距离限制。夹具验证时地图坐标换算到屏幕后必须落在中间可点区——`y≈2100` 会落到顶栏被忽略，应用靠近可视中心的空位（如 `1100,1400`）。

未调用 `Shop.buyBuilding` / `rpc_s_build`。生成器为 `make_construct.py`（从 `train_boot.js` 注入）。

## 本地训练队列（驯龙场）

研究查询 `cultivate-train-001` / `002` 结论（完整结果见 `analysis/train-native-configs.json`）：

| 对象 | 结论 |
| --- | --- |
| `TRAIN_TYPE_ID_LIST` | 全局变量，值为 `[114,120,101,102]`，四个兵种族 |
| 114 系 | `11401`–`11410`，`train_cost` 50→800，`train_time` 20→120 秒，`need_barrack_lv` 恒为 1 |
| 120 系 | `12001`–`12010`，100→2000，30→180 秒，`need_barrack_lv` 恒为 4 |
| 101 系 | 只有 `10101`/`10102`，400 日光、60 秒，`need_barrack_lv` 为 3 |
| 102 系 | 只有 `10201`/`10202`，300 日光、90 秒，`need_barrack_lv` 为 2 |
| `train_cost_type` | 本次接到的条目均为 1，即 `RES_TYPE_WOOD`（日光） |
| `Comp.SoldierTrainer` | `trainBuffer` 为 FIFO 队列，另有 `curIndex`、`lastTrainBeginTime`、`curTrainTime`、`boostTrainNum` |
| `Comp.SoldierManager` | 提供 `getTotalSoldierNum` / `getTrainedSoldierNum` / `getTrainingSoldierNum` / `getSoldierCapacity` |
| `Comp.ResourceSoldier` | 存在，方法含 `createSoldier` / `removeSoldier` / `collectResource` |
| 原版训练接口 | `train()` 经 `makeSelector` + `_processTrain`，最终 `callServer('rpc_s_train')`；加速、取消、完成分别是 `rpc_s_boost_train` / `rpc_s_cancel_train` / `rpc_s_finish_train` |

交付实现**不**调用上述原版方法，只按原表数值在本地存档里完成扣费、倒计时与入住。兵种等级跟随驯龙场等级（三级取 `11403`）。蛋位上限为常量 `TRAIN_MAX_BUFFER=1`（原版队列可容纳多个，尚未恢复）。

存档键升级为 `dino.local.city.v9`，新增 `training`（按建筑 uid 索引，含 `typeid`/`started`/`ends`）与 `soldiers`（按建筑 uid 记已入住数）。`settle()` 返回值由数组改为 `{buildings,training}`，调用方需同步改。校验规则：`ends === started + data.unit_main[typeid].train_time`、`typeid` 必须属于本次接的兵种表、任务只能挂在 207 系建筑上、`soldiers` 不超过该建筑 `item_storage`。

### 生成器改动时容易踩的两个坑

`make_train.py` 把训练逻辑注入 `cultivate_boot.js` 的 `showSelected()` 时，遇到过两个只在运行时暴露的错误，**都属于 `replace()` 锚点选错**：

1. `refreshSoldierBadges` 被插进了 `upgrade()` 内部。原因是锚点 `"            showSelected();\n"` 在 `showSelected()` 内和 `upgrade()` 末尾各出现一次，`str.replace` 命中了第一处，导致括号层级错乱、`upgrade()` 尾部多出一个游离的 `showSelected();`。运行表现是任何操作后状态栏显示“升级更新失败，请返回重进”。修法是改用足够长的唯一锚点（`upgrade()` 的 `catch` 到 `};` 整段）。
2. 训练信息分支写成挂在生产行后面的 `else if`，用了尚未声明的 `b`。`b` 在 `showSelected()` 中先用于生产判断、后于 `var b=...` 声明，所以抛 `TypeError: b is undefined`。修法是把训练分支并入已有的 `else if(!moving)` 链。

第 2 点还顺带暴露一个逻辑问题：即便把 `else if(String(b.type).indexOf('207')===0)` 追加在已有 207 分支**之后**，它也是死代码（同条件已被前面命中），倒计时永远不会显示。正确做法是**替换**原 207 分支，在其中按“有训练任务或已有士兵”选择显示训练信息还是容量信息。

排查这类错误时，`cc.log` 在部分路径下没有进 logcat。有效手段是临时把异常文本拼进状态栏（`status.setString('ERR: '+e)`）再截图，比翻日志快。诊断改动必须回滚，不要留在交付包里。

夹具验证沿用既有模式：`prepare_train_validation.py` 生成只换存档键的夹具包，`validate_train.py` 通过 SQLite 注入夹具并核对；正常 `v9` 存档在整个过程中逐次比对，必须保持不变。

逍遥模拟器自身的 `cmd` 进程（`pm`/`am` 的 binder 辅助进程）会偶发 `Fatal signal 11`，与本包无关。日志断言应只针对游戏进程，不要用无差别的 `Fatal signal` 匹配，否则会产生假失败。

## 本地养成容量（驯龙场 / 龙英巢）

研究查询 `cultivate-inspect-001` / `003` 结论：

| 对象 | 结论 |
| --- | --- |
| `data.unit_main[207xx]` | 有 `egg_storage`、`egg_time`、`item_storage`；二级起有 `villager_storage=5`。一级蛋容 10、兵容 10、蛋时 60；八级蛋容 24、兵容 45、蛋时 200 |
| `data.unit_main[206xx]` | 无蛋/兵字段；有 `hero_exp`。出战栏与英雄等级上限在 `data.hero_number[主城等级]` |
| `Comp.SoldierTrainer` | 存在。直接构造报 `DA.GETCGC(...) is undefined`；覆盖 `DA.GETCGC` 返回桩对象后可构造。`soldierCapacity` / `villagerCapacity` 与表一致 |
| 训练方法 | `getTrainCapacity` / `getSoldierNum` 仍要 `getStageClient`。未在交付中调用 `train` / `cancelTrain` / `finishTrain` |
| `HeroManager` | 原型方法齐全；空 `ClientPlayer` 无组件实例，需后续本地英雄列表 |
| `data.build_number` | 主城升高等级后，202/204 可多建，207 最多到 4，206 始终 1 |

交付只读展示：驯龙场读 `unit_main` 蛋/兵/蛋时/村民；龙英巢读 `hero_number` 出战栏与等级上限，以及本建筑 `hero_exp`。存档仍为 `dino.local.city.v8`。完整表见 `analysis/cultivate-native-configs.json`。

## 本地满级升级链

研究查询 `analysis/max-native-configs.json`（request `max-levels-001`）扫到原表完整建筑等级：

| 族 | 类型范围 | 最高 lv | 满级要点 |
| --- | --- | --- | --- |
| 201 龙首之城 | 20101–20110 | 10 | 仓库贡献仍各 20000；最高级 `lv_up_able` 为空 |
| 202 日光井 | 20201–20210 | 10 | 产量 2500，暂存 100000（`home_res` 为 213xx） |
| 203 日光皿 | 20301–20310 | 10 | 日光仓库 2500000 |
| 204 龙银矿 | 20401–20410 | 10 | 产量 2500，暂存 100000 |
| 205 龙币库 | 20501–20510 | 10 | 龙币仓库 2500000 |
| 206 龙英巢 | 20601–20610 | 10 | 仅模型链 |
| 207 驯龙场 | 20701–20708 | 8 | 原表止于 8，无 20709 |
| 212 建筑师 | 21201 | 1 | 无升级 |

`dino.local.city.v8` 在运行时从 `data.unit_main` 生成 61 条 `upgradeTypes`（201–207），不再按级硬编码。双仓满级后总容量各 2520000。费用/耗时/`rely_base_lv` 仍走 `BuildingBuilder`。未改升级状态机；龙英巢/驯龙场仍无养成接口。

## 本地五级升级链

研究配置摘自 `analysis/level5-native-configs.json`（由 `level4-native-configs.json` 中五级相关条目整理）：

| 当前类型 | 目标 | 费用 | 耗时 | rely_base_lv | 主要效果 |
| --- | --- | --- | --- | --- | --- |
| 20104 | 20105 | 150000 龙币 | 86400 | 4 | 主城五级模型；仓库仍各 20000 |
| 20204 | 20205 | 7000 龙币 | 14400 | 2 | 日光产量 1000，暂存 10000 |
| 20404 | 20405 | 7000 日光 | 14400 | 2 | 龙币产量 1000，暂存 10000 |
| 20304 | 20305 | 30000 龙币 | 21600 | 4 | 日光仓库 60000 |
| 20504 | 20505 | 30000 日光 | 21600 | 4 | 龙币仓库 60000 |
| 20603 | 20604 | 18888 日光 | 7200 | 3 | 龙英巢四级模型 |
| 20703 | 20704 | 99999 日光 | 28800 | 4 | 驯龙场四级模型 |

`dino.local.city.v7` 的升级映射覆盖上表；实现仅扩展 `upgradeTypes` 与版本迁移，未改升级状态机。仓库四级升五级的 `rely_base_lv` 为 4。两座仓库到五级后总容量各 80000。龙英巢与驯龙场仍只恢复建筑升级与模型切换。

## 本地四级升级链

研究查询 `analysis/level4-native-configs.json` 扫到以下已验证费用与效果（`BuildingBuilder.getRealCost()` / `buildTime`）：

| 当前类型 | 目标 | 费用 | 耗时 | rely_base_lv | 主要效果 |
| --- | --- | --- | --- | --- | --- |
| 20103 | 20104 | 25000 龙币 | 28800 | 3 | 主城四级模型；仓库仍各 20000 |
| 20203 | 20204 | 3500 龙币 | 3600 | 2 | 日光产量 800，暂存 2500 |
| 20403 | 20404 | 3500 日光 | 3600 | 2 | 龙币产量 800，暂存 2500 |
| 20303 | 20304 | 15000 龙币 | 7200 | 3 | 日光仓库 40000 |
| 20503 | 20504 | 15000 日光 | 7200 | 3 | 龙币仓库 40000 |
| 20602 | 20603 | 3888 日光 | 1800 | 2 | 龙英巢三级模型 |
| 20702 | 20703 | 9999 日光 | 10800 | 3 | 驯龙场三级模型 |

仓库三级升四级的 `rely_base_lv` 仍为 3（与升三级相同门槛），不是四级主城。`dino.local.city.v6` 的升级映射覆盖上表；`allowedTypes()` 仍沿映射链校验。五级配置（如 `20105`、`20205`）已在同次研究中扫到，本版未启用。

长耗时升级（主城 28800 秒、驯龙场 10800 秒等）仍用 force-stop 后同时改写 `started/ends` 的方式验证离线完成。龙英巢与驯龙场本版只恢复建筑升级与模型切换，未接入英雄数量、训练或蛋相关组件。

## 本地三级升级链

研究查询 `analysis/level3-native-configs.json` 扫到以下已验证费用与效果（`BuildingBuilder.getRealCost()` / `buildTime`）：

| 当前类型 | 目标 | 费用 | 耗时 | rely_base_lv | 主要效果 |
| --- | --- | --- | --- | --- | --- |
| 20102 | 20103 | 4000 龙币 | 3600 | 2 | 主城三级模型；仓库仍各 20000 |
| 20202 | 20203 | 1400 龙币 | 900 | 2 | 日光产量 600，暂存 1500 |
| 20402 | 20403 | 1400 日光 | 900 | 2 | 龙币产量 600，暂存 1500 |
| 20302 | 20303 | 10000 龙币 | 1200 | 3 | 日光仓库 25000 |
| 20502 | 20503 | 10000 日光 | 1200 | 3 | 龙币仓库 25000 |
| 20601 | 20602 | 999 日光 | 900 | 1 | 龙英巢二级模型 |
| 20701 | 20702 | 2588 日光 | 3600 | 2 | 驯龙场二级模型 |

`21201` 建筑师小屋无 `lv_up_*` 字段，`21202` 不存在。`dino.local.city.v5` 的升级映射覆盖上表；`allowedTypes()` 仍沿映射链校验。仓库二级升三级前，若主城不足三级，本地接口提示先升主城。

长耗时升级的夹具验证不能把 `ends` 单独改短：存档校验要求 `ends === started + lv_up_time`。正确做法是 force-stop 后同时改写 `started/ends`，使时长不变但结束点落在过去，再启动让 `settle()` 完成。读取 `jsb.sqlite` 时每次使用新临时目录，避免 Windows 下残留 `-shm` 读到旧快照。

龙英巢与驯龙场本版只恢复建筑升级与模型切换，未接入英雄数量、训练或蛋相关组件。

## 本地仓库容量升级

日光皿 `20301` 与龙币库 `20501` 可用同一套 `BuildingBuilder` 最小接口查询费用和倒计时。一级费用均为 3000，耗时均为 180 秒，均要求 `rely_base_lv` 为 2。日光皿消耗龙币（`lv_up_cost_type=2`），龙币库消耗日光（`lv_up_cost_type=1`）。二级类型为 `20302` 和 `20502`，仓库字段分别为 `wood_storage` 5000→15000 与 `gold_storage` 5000→15000。

本地总容量仍由各建筑配置的 `gold_storage` / `wood_storage` 相加。主城一级和二级均为各 20000，因此一级仓库时总容量各 25000，两座仓库升到二级后各 35000。`updateCapacity()` 在保存和同步钱包时重算，升级完成后立即反映到 `ResourceManager.maxRes`。

`dino.local.city.v4` 的升级映射为五座建筑的一级到二级。`allowedTypes(base)` 从默认类型沿映射链展开，校验已升级后的类型。确认文案改为读取目标配置的 `lv`，不再写死“二级”。仓库建筑无生产组件，升级期间只禁止移动，不涉及暂停采集。

研究记录见 `analysis/capacity-native-builders.json`。更完整的等级链（含三级及以上、龙英巢和驯龙场费用）已在研究查询中扫到，保存在交接前的扩展配置结果中；本版交付未启用这些等级。

## 本地建筑升级接口

`Comp.BuildingBuilder(master, config)` 可在独立场景中构造。最小研究接口包含 `master.params`、`stage`、`config`、`level` 和 `getOriginType()`。构造器从当前等级配置读取 `lv_up_cost`、`lv_up_cost_type`、`lv_up_time`、`rely_base_lv` 和 `need_worker`。

一级龙首之城的 `getRealCost()` 返回 1000，`buildTime` 为 300。一级日光井和龙银矿的费用均为 700，耗时均为 180 秒。日光井使用龙币，龙银矿使用日光。原表中的二级配置分别为 `20102`、`20202` 和 `20402`。

同步本机时间后，将组件的 `state` 设为 `BUILD_STATE_BUILDING`，并填写 `beginTime`，即可查询 `getNeedTime()`。研究向量在开始 60 秒后返回 120 秒。这个包的 `getBuildingFinishTime()` 在同一向量中也返回 120，不能把它当成绝对完成时间。记录见 `analysis/upgrade-native-timing.json`。

本地升级接口没有调用 `BuildingBuilder.init()`、`onPressUpgrade()`、`upgradeFinish()` 或完整单位初始化。这些方法还依赖工人、进度组件、地图、服务器 RPC 和任务系统。当前只复用费用和倒计时查询，由本地存档处理扣费、单座升级限制和完成状态。

`dino.local.city.v3` 的建筑记录新增可选字段 `upgrade`，包含 `target`、`started` 和 `ends`。存档检查要求目标属于本次支持范围，结束时间等于开始时间加原表耗时，同时最多存在一项升级。扣费和升级记录在一次存档写入中提交，读回核对后再更新显示。

生产建筑开始升级时，先计算并保存已有储量。升级期间保留储量，暂停生产和采集。升级完成时，将建筑类型改为二级，生产记录的 `lastHour` 改为绝对完成时刻。这样重启后可以按二级速度计算完成后的离线产量，不会把施工时间计入生产。

完成状态在启动、进入场景和场景计时器中检查。在线完成时重新加载原版二级 CCBI，替换旧节点；重启后直接加载二级资源。地图坐标和建筑唯一标识保持不变。日光井和龙银矿的二级产量均为每小时 400 点，暂存上限为 1000。

测试夹具使用独立键 `dino.local.city.v3.validation-20261012`，人工设置资源以覆盖成功扣费。正常 `v1`、`v2` 和 `v3` 存档在测试期间逐步核对。测试包与交付包共享包名，所以测试结束必须重新安装交付包，并删除外部研究脚本。

## 原版生产组件和本地采集接口

离线入口只创建 `ClientPlayer` 时，`DA.getSystemCurrentTimeHour()` 和 `DA.getSystemCurrentTimeSec()` 会返回无效数值。调用 `DA.SynServerTime(Date.now()/1000)` 后，本机时间可用于原版生产计算。这些方法在 `DA` 中，不是全局函数。

`new Comp.ResourceProductor(master, config)` 可构造生产组件。读取普通资源储量时，`master.getComponent('BuildingBuilder')` 必须返回可响应 `isBuildingFinished()` 的对象。本次提供已完工建筑接口，没有调用组件的 `init()`，也没有注册原版气泡、调度、通知和动画。

`produceSpeed` 来自原配置的 `wood_produce` 或 `gold_produce`。两座一级生产建筑的数值为 200。`maxStorage` 来自 `temp_storage`，数值为 800。`currentStorage` 和 `lastCollectTime` 可从本地记录恢复。

`getStoredResourceNum()` 单独调用不会限制最大储量。边界探测中，一小时返回 200，十小时返回 2000，时间倒退一小时返回 -200。本地接口将结果限制在 0 至 `maxStorage`，避免离线积累超限和负数。

`calculateCollectRes()` 返回 `[可采集量, 当前生产建筑储量]`，第二项不是采集后的剩余量。余额为 995、容量为 1000 时，结果为 `[5, 2000]`；仓库满时为 `[0, 2000]`。本地接口先限制生产储量，再按可采集量转账，并保存剩余储量和新的时间。

资源枚举为 `RES_TYPE_WOOD = 1`、`RES_TYPE_GOLD = 2` 和 `RES_TYPE_DIAMOND = 3`。本次同步 `ResourceManager.Res` 和 `maxRes` 的日光、龙币两项。龙首之城各提供 20,000 容量，日光皿和龙币库分别提供 5000，所以本地总容量各为 25,000。

生产组件没有完整接回原版主城。原版 `CollectResource()` 还会调用服务器、任务更新、特效、声音和界面刷新，因此本次只复用计算方法。本地账本先写入并读回核对，再刷新显示和原版资源管理器。

验证使用独立 APK、真实时间和 ADB 点击，没有向交付存档注入测试资源。时间边界和仓库满额通过研究包中的临时组件探测，研究结果单独保存在 `economy-native-vectors.json`。计时依赖设备时钟，尚未恢复服务器校时或防止用户修改时间的规则。

## 本地建筑状态和保存

旧引擎提供全局 `sys.localStorage`，包含 `getItem()`、`setItem()` 和 `removeItem()`。`cc.sys` 在本包中未定义。接口实际写入应用私有目录下的 SQLite 数据库 `databases/jsb.sqlite`，`data` 表有 `key` 和 `value` 两列。

`state_boot.js` 使用键 `dino.local.city.v1`。首次运行创建 8 座建筑的默认布局。每次进入场景根据存档生成资源节点。移动时先复制数据、更新坐标，再写入并读回核对，成功后才改变显示节点。移动后更新节点位置和 Z 顺序，避免沿用旧位置的绘制层级。

存档校验包含版本、玩家标识、建筑数量、唯一标识、类型以及有限坐标和边界。它尚未包含原版资源、等级或任务字段。放置限制为地图边界和建筑中心距离，不能作为原版建筑规则的实现。

验证使用交付 APK 和真实 ADB 点击。通过 `exec-out cat` 复制数据库及 WAL，再用 Python SQLite 读取记录。共享内存文件无需复制，SQLite 可从 WAL 重建。早期直接 `adb pull` 时出现一次共享内存文件读取失败，另有一次 ADB 点击命令失败；修正证据采集方式后重新运行完整验证。

研究包曾用于确认存储接口和首次移动。验证交付包前已删除外部 `dino-boot.js` 和 `dino-command.js`，不以研究报告代替独立包的重启证据。

## 原版入口加载过程的恢复

旧的 `city_boot.js` 把登录入口直接绑定到创建地图的函数，绕过了原版加载流程。`loading_boot.js` 已接回 `MainMenuScene.playEnterGameAction()`。该函数播放 `entergame`，创建随机提示图，按任务队列剩余数量更新进度，并插入等待动画完成的事件任务。无需重新制作加载页面。

任务管理器位于 `DA.TaskManager`，全局 `TaskManager` 未定义。`pushBackTaskList()` 接收 `[任务类型, 参数]` 数组。选择器类型为 `DA.TASK_TYPE_SELECTOR`，延迟类型为 `DA.TASK_TYPE_DELAY`。原版事件任务使用 `playEnterGameAction` 事件，先等待转场，再执行资源任务。

任务队列会在同一轮处理多个同步选择器。新脚本在资源任务之间加入 `1/30` 秒延迟，让引擎渲染进度和动画。加载完成后调用原版 `onEnterGameEnd()`，保留短暂的完成帧，再推入预览。加载时长取决于本地资源，不模拟服务器等待。

`TipsManager.getWitticismTipWord()` 依赖 `G_Player`。空玩家会在加载入口报错。创建 `ClientPlayer` 即可满足本次加载文案查询；这不代表玩家数据初始化完成。

跨帧创建的独立 `cc.Scene` 必须先 `retain()`，在 `pushScene()` 后 `release()`。否则 Cocos 自动释放池会回收尚未加入 Director 的场景，延迟任务中的 `pushScene()` 会报 `Invalid Native Object`。本次实验已修复。

返回入口时，`gotoDefaultPage()` 不会自动移除独立预览留下的 `menu.loadingTip`。新脚本显式移除提示图、清空提示文本、隐藏进度容器并恢复入口动画。加载期间隐藏预览版底部说明，避免它与原版进度条文案重叠。连续点击由进入状态标记拦截。

## 使用范围

本文记录已验证的技术发现和实验限制。当前交付状态、工具路径和验证证据见 `HANDOFF.md`。原生地址和密钥只对应工作目录中的原始 1.0.5 APK。

## 加密脚本

`analysis/decode_scripts.py` 已成功解密和解压全部 318 个 `.jscz` 文件。输出是 SpiderMonkey XDR 字节码，不是 JavaScript 源码。文件开头为 `51 c0 73 b9`，即小端整数 `0xb973c051`。

**版本已确认（2026-10-14）**：`0xb973c051 = 0xb973c0de - 141`，与 [cocos2d/Spidermonkey v22](https://github.com/cocos2d/Spidermonkey/blob/v22/js/src/vm/Xdr.h) 一致；不是 SM33（`2c c0 73 b9` / subtrahend 178）或 SM34。引擎 `libcocos2djs.so` 含 Cocos 源码路径与同一魔数。现成 mozjs-34 / SM33 dumper 不能直接套用。匹配解析器已 vendored：`tools/jsc_decompiler`（支持 `0xB973C051`）。可重复命令与结算样本见 [BYTECODE-READABILITY.md](../native/BYTECODE-READABILITY.md)；封装入口 `python analysis/disasm_one.py Client/GameControllerBattle`。

原脚本路径仍保留在字节码中，例如 `../../DragonAge/Resources_win_low/script/Client/ClientUnits/ClientPlayer.js`。运行时报错中的原文件名和行号可以帮助定位逻辑；关键函数现可用上述反汇编/伪 JS 读形参与分支，但仍须与运行时探针交叉验证，不能把伪源码当完整原版。

解密参数如下，现有脚本已实现算法，通常无需重新推导：

```text
key parts: 3b5ff6f4 3e647dbf 9e139b57 20f26367
delta: a564fb30
原生密钥地址: 294ea8 27842c 278694 295fd8
原生 delta 地址: 2a9f44
```

算法先用 6 轮 XXTEA 风格混合生成 1,024 个 32 位密钥字。加密数据从偏移 12 开始，前 400 个字逐个异或，之后每 64 个字异或一次。偏移 16 之后为 zlib 数据。解压长度需与偏移 12 的大端长度一致。

```powershell
python F:\kdzlj\analysis\decode_scripts.py
```

`analysis/decoded/script` 中的 `.strings.txt` 是字节码原子字符串提取结果，包含对象名、字段名和方法名。它们不是反编译源码，也不能直接表达分支或参数结构。解密脚本目前只输出 `.jsc`；重新执行不会自动重建这些字符串文件。

曾用原引擎 `JS_DecodeScript()` 和 `JS_DecompileScript()` 解码部分文件，结果均为 `[no source]`。`analysis/decompiled` 保存了部分结果。不要继续将这个 API 当作源码恢复工具。

## 原生启动入口

交付启动库在游戏 GL 线程、原 `nativeInit()` 完成后执行。它用 `dlopen()` 和 `dlsym()` 取得原引擎入口，再执行 APK 内 `offline/boot.js`。

| 符号 | 原 APK 地址或用途 |
| --- | --- |
| `_ZN13ScriptingCore11getInstanceEv` | `0x2779b1`，取得 ScriptingCore |
| `_ZN13ScriptingCore10evalStringEPKcPN2JS5ValueES1_P9JSContextP8JSObject` | `0x2a4545`，执行 JS |
| `ScriptingCore::runScript` | 曾定位在 `0x2a9cc5`，完整符号需从 ELF 查找 |
| `_Z21JS_EncodeStringToUTF8P9JSContextP8JSString` | 将返回的 JS 字符串转为 UTF-8 |
| `_Z7JS_freeP9JSContextPv` | 释放上述返回内存 |
| `_Z15JS_DecodeScriptP9JSContextPKvjP12JSPrincipalsS4_` | `0x4163f8`，解码字节码 |
| `_Z18JS_DecompileScriptP9JSContextP8JSScriptPKcj` | `0x40f544`，本包只得到无源码提示 |

当前代码将 ScriptingCore 对象偏移 8，即 `reinterpret_cast<void**>(core)[2]`，用作 JSContext。JS 返回值由两个 32 位字保存；字符串标签高字为 `0xffffff85`，低字为指针。这些实现依赖原包的 32 位布局。

早期汇编分析容易漏掉 Thumb 跳板。曾遇到跳板结构 `ldr ip,[pc,#4]`、`add ip,pc,ip`、`bx ip`。目标地址由跳板地址加 12，再加字面量得到。不能只按普通 PLT 调用查找函数。

原 `CCEGLView.swapBuffers()` 在这个包中仅有 `bx lr`，已经是空操作。不要因为黑屏就推断原引擎和 GLSurfaceView 重复交换缓冲。最终有效的处理是专用模拟器改用 DirectX。

## 原版入口与全局对象

以下变量是 JS 全局变量，不在 `DA` 命名空间中：

```javascript
PATCH_ENABLED = false;
NtUniSdkEnabled = false;
__PLAY_MODE = __PLAY_MODE_OFF_LINE; // 已观察到离线值为 1，在线值为 2
NETWORK_TICK_ENABLE = false;
PLAYER_OFFLINE_CHECK_ENABLE = false;
DestroyVersionControlAndEnterGame();
```

直接调用 `DestroyVersionControlAndEnterGame()` 可载入原 Start 脚本和 MainController。尝试从原版本检查器继续调度时，曾遇到维护提示或黑屏。只覆盖版本检查器的部分方法没有得到可靠结果。

入口控制器位于 `G_MainController.MainMenu.controller`。当前脚本关闭 `showMaintenanceNotice` 和 `loginCommon.controller.autoLogin`，隐藏 `touchMask`，并运行原入口的 `default` 动画。

预览将 `G_MainController.platformLogin`、`login` 和 `quickLogin` 绑定到本地场景。不会使用网易或 360 账号。

| 名称 | 已验证用途 |
| --- | --- |
| `G_MainController` | 原版主控制器，包含 MainMenu、MainScene、加载层和提示层 |
| `G_Director` | Cocos Director |
| `ClientPlayer` | 全局玩家构造器；`DA.ClientPlayer` 未定义 |
| `G_Player` | 入口阶段为 null，需要自行创建 |
| `G_UnitManager` | 单位管理器，提供 getFactory、getAndPlusCID 等方法 |
| `data` | 已加载的原版数据表对象 |
| `RS` | 原版资源路径常量 |
| `DA.getGameScene()` | 原版 GameScene 的访问函数 |
| `DA.__G_GameScene` | 原版场景引用；直接访问全局 `__G_GameScene` 会报未定义 |
| `GS_STAGE_BUILD` | 主城阶段值为 1 |
| `GS_CURRENT_STAGE` | 原流程当前阶段，入口为 0 |

## 当前预览实现

预览创建独立的 `cc.Scene`，加载 `map/ccb/sub_map_build.ccbi`。地图节点尺寸为 3,832 × 2,812，初始缩放为 0.45。场景通过 `G_Director.pushScene()` 打开，通过 `popScene()` 返回入口。

原建筑配置位于 `data.unit_main[typeid]`。例如 `data.unit_main['20101'].home_res` 为 `unit/ccb/20101.ccbi`。`data.unit_resource` 保存阴影、图标和缩放等信息。

| typeid | 加载资源或已观察到的名称 |
| --- | --- |
| 20101 | `unit/ccb/20101.ccbi` |
| 20201 | 日光井，`unit/ccb/21301.ccbi` |
| 20301 | 日光皿，`unit/ccb/21401.ccbi` |
| 20401 | 龙银矿 |
| 20501 | 龙币库 |
| 20601 | 龙英巢 |
| 20701 | 驯龙场 |
| 21201 | 建筑师小屋 |

以上名称来自原 `G_StringManager.str(config.name)` 的运行输出。当前交付点击提示只显示编号。

直接 `cc.BuilderReader.load('unit/ccb/20101.ccbi')` 会尝试构造原 `Unit`，报 `TypeError: params is undefined`。预览临时覆盖全局 `getControllerByName()`，对 `Unit` 返回空构造器。这个查询函数返回数组，包含构造器、完整名称和短名称。

`getControllerByName` 是全局函数，既不在 `DA` 中，也不在 `cc.BuilderReader` 上。`cc.BuilderReader.load` 接受 4 个参数。预览只使用文件参数；其他参数应结合原字节码继续分析。

节点带有 `animationManager`。部分资源的动画名为 `idle_run`、`idle_rest`；脚本对存在 `idle_run` 的资源播放该动画。其他模型使用 CCBI 自动播放配置。

触摸控制使用 `new UI.Touchable()`，设置 `rootNode` 和 `onTouchesBegan/Moved/Ended/Cancelled`，调用 `initEventWithMultiTouch()` 和 `enableTouchEvent()`。创建后的 `__touch_layer` 需要确保加入场景。退出时调用 `destroy()`。

这个旧绑定的 `setContentSize()` 接受一个尺寸对象：

```javascript
node.setContentSize({width: size.width, height: 64});
```

传两个数会报 `wrong number of arguments: 2, was expecting 1`。中文启动文本需写成 `\uXXXX` 转义。最初将 UTF-8 中文直接交给 `evalString()` 时出现乱码。

## 原版完整主城实验

已在研究包中成功执行以下创建流程：

```javascript
G_Player = new ClientPlayer(G_UnitManager.getAndPlusCID());
G_Player._isPlayer = true;
G_MainController.onStartGame();
```

玩家构造器创建了 ResourceManager、WorkerManager、HeroManager、QuestManager、RankManager、VIPComponent 等组件。它们仍缺少服务器初始化数据。构造成功不代表组件可正常工作。

`onStartGame()` 后曾立即得到 null 场景；等待后再查询才能访问。继续实验时应逐步检查，不能假定所有加载都在同一次调用内完成。

调用 `DA.getGameScene()._loadStage(GS_STAGE_BUILD)` 能加载主城控制器。这个方法没有返回控制器，也不会直接把当前阶段设为主城。已加载对象在 `scene.sub_logicLayer[GS_STAGE_BUILD]` 中。

`GameControllerBuild.initLevelFromData()` 字符串记录中包含 `player`、`units`、`walls`、`model_info`、`hero_donate_list` 和 `user_config` 等字段。`ClientPlayer` 中有 `initByServer`、`rpc_c_start_game`、`changeStageAndInit`、`__init_stage_build` 和 `rpc_c_refresh_all`。这些是恢复原流程的主要入口，字段结构尚未还原。

原流程使用 TaskManager 的 selector、delay 和 event 任务。`initLevelFromData()` 会初始化地图、调用玩家初始化、创建建筑、环境和捐赠单位，再执行后续任务。跳过某个任务并不能保证其依赖已满足。

直接调用 `initMap()` 的试验中，传入的 `tile` 字段没有成为 `cc.TMXTiledMap.create()` 的实际参数，原生层收到 undefined 并崩溃。临时拦截此方法、强制加载 `map/world1.tmx` 后，地图对象可以构造。正确的完整 mapConfig 参数结构仍未确定。

`RS.MAP_CAPTURE` 指向 `map/world2.tmx`，本包只观察到 `assets/res_ref/map/world1.tmx`。此前曾在实验中误选 MAP_CAPTURE 并崩溃。**不能据此断言原版主城必需的地图缺失。** 独立预览已正常加载原版主城美术。

`MapManager` 的地图根节点字段是 `map`，不是 `rootNode`。`G_MainController.LoadingInLayer` 也不是可以直接调用 `setVisible()` 的节点。Object.keys 和方法检查应先于调用。

在未补齐玩家状态时启用主城阶段更新，后来仍出现崩溃。现有资料不足以安全接通完整主城更新与菜单。

## 运行时研究工具

研究包 `analysis/dino-research.apk` 使用 `research_hook.cpp` 和 `research-classes.dex`。该 dex 在每次 onDrawFrame 前再次调用 JNI hook；原生 hook 每 30 帧检查一次命令文件，内容变化后在 GL 线程执行。

研究 hook 启动时可读取 `/data/local/tmp/dino-boot.js`，覆盖 APK 内启动脚本。后续命令路径为 `/data/local/tmp/dino-command.js`。结果写入：

```text
/data/data/com.netease.h1.qihoo/files/local-report.json
```

研究包和交付包使用相同包名与调试签名，可相互覆盖安装，但不能同时运行。研究结束后使用 `启动场景预览.cmd` 恢复已验证包。

开始研究时先使用入口脚本作为覆盖文件，再安装或启动研究包：

```powershell
python F:\kdzlj\analysis\build_research.py
adb -s 127.0.0.1:21513 push F:\kdzlj\analysis\boot.js /data/local/tmp/dino-boot.js
adb -s 127.0.0.1:21513 push F:\kdzlj\analysis\dino-research.apk /data/local/tmp/dino-research.apk
adb -s 127.0.0.1:21513 shell pm install -r /data/local/tmp/dino-research.apk
adb -s 127.0.0.1:21513 shell rm -f /data/local/tmp/dino-command.js
adb -s 127.0.0.1:21513 shell am force-stop com.netease.h1.qihoo
adb -s 127.0.0.1:21513 shell am start -n com.netease.h1.qihoo/com.netease.h1.qihoo.AdvanceDino
```

`research_boot.js` 还保留早期 JS 定时器，也会执行命令文件。原生轮询和 JS 定时器并存时，**同一命令可能执行两次**。上述覆盖文件用于避免加载这个定时器。也可以在确认后清理研究启动脚本，保留一个执行入口。

等待入口加载完成，再将查询内容写入 `analysis/query.js`，从工作目录执行 `python analysis/query.py`。示例：

```javascript
return {
    request: 'inspect-player-001',
    player: G_Player ? Object.keys(G_Player) : null,
    scene: DA.getGameScene() ? Object.keys(DA.getGameScene()) : null
};
```

`query.py` 会包装 try/catch，将结果 JSON 化，再推送命令。它只等待 2 秒，可能读取上次结果。每次查询加入唯一 request，确认返回一致；加载阶段需等待更久。不要在未检查结果时重复执行创建单位或覆盖函数的命令。

该脚本写入 ASCII，中文需使用 Unicode 转义。读取 stdout 时设置了 UTF-8，但一些 Windows ADB 输出仍曾出现解码差异。原始原生 logcat 中的中文可正常显示，不能把控制台乱码直接当作原资源损坏。

原生日志中的 `RESULT` 长内容会截断，完整对象从报告文件读取。直接 JSON.stringify 带节点或组件的对象会出现 `cyclic object value`。优先查看 Object.keys、简单字段和方法 length。

交付库 `local_hook.cpp` 不读取上述外部调试文件，也没有逐帧命令执行功能。最后已经删除访客中的 `dino-command.js` 和 `dino-boot.js`。

## 已放弃或未完成的尝试

| 尝试 | 结果和处理 |
| --- | --- |
| 使用开发离线标记直接进入完整游戏 | 不会创建玩家、城池或 RPC 回执，需要补数据 |
| 直接反编译 SpiderMonkey 字节码 | 原引擎返回 `[no source]`，尚未恢复源码 |
| 修改版本检查器的局部回调 | 没有得到可靠入口，当前直接调用入口函数 |
| 关闭访客 Wi-Fi 验证离线 | 同时断开 ADB；改用移除 APK 网络权限 |
| 纯 64 位 MuMu Android 15 | 无法安装原 32 位 ARM 库 |
| 原版完整主城直接接空数据 | 参数异常和原生崩溃，尚未接通 |
| `Thread.sleep(33)` 控制帧率 | 没有解决 OpenGL 黑屏，已撤回 |
| 每帧 resume/startAnimation | 没有解决 OpenGL 黑屏，已撤回 |
| 推断重复 swapBuffers | 原 EGLView 函数已为空，未据此打补丁 |

## 参考资料

这些链接是早期查证和实现对照资料，不代表本包所有代码都与该版本完全相同。

- [Cocos2d-x 2.2.6 ZipUtils.cpp](https://raw.githubusercontent.com/cocos2d/cocos2d-x/cocos2d-x-2.2.6/cocos2dx/support/zip_support/ZipUtils.cpp)：压缩和 CCZ 解码实现对照。
- [逍遥模拟器命令行文档](https://www.xyaz.cn/blog/20240116-231686.html)：graphics_render_mode、实例和命令参数。
- [MEmu 命令行参考](https://www.memuplay.com/blog/memucommand-reference-manual.html)：模拟器管理命令。
- [MEmu 渲染模式说明](https://www.memuplay.com/blog/play-opengl-es-3-1-android-games-pc.html)：图形异常时切换渲染模式的说明。
