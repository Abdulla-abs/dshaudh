# 随机侦察预定义关卡池

状态：离线检查通过，已保留存档覆盖安装并启动实例 1；游戏内侦察待复测。

当前池已新增用户第 9～18 关，共 15 关，每关等概率 1/15。原布局均保留，下文的 3／4／5 关及对应概率为历史状态。最新批次与安装证据见 `analysis/evidence/scout-batch-9-18.md`。

后续用户报告第 8 关布局建筑越界，已整体平移（-20，-20）并增加真实地形检查，重新安装实例 1。此前“保留全部布局字段”和“离线通过”不代表原位置已通过游戏验收；修正与当前安装证据见 `analysis/evidence/scout-map-bounds.md`。

触发：用户要求随机侦察从预定义关卡中抽取，当前全池随机，后续支持大本营等级 ±1。

原代码证据：`analysis/native_boot.js` 的 `buildPvpBattleDict` 原来固定调用 `buildPveBattleDict(1)`。`handleEnterPvpBattle` 处理首次与下一个目标，已有独立的侦察、开战、结算和回城状态。

修改：新增独立关卡清单 `analysis/rpc-contracts/scout-pool.json` 和布局副本。初始为用户已制作的第 7、16、39 关，大本营等级分别为 1、3、1。`selectScoutLevel` 默认全池等概率抽取，预留并实现 `headquarters-range` 与 `headquartersDelta`。共享原有进场构造函数，侦察传入独立布局并跳过单人进度与奖励读取。守军、技能、城墙和原界面流程保留。

验证：`python analysis/check_scout_pool.py`、`python tools/build_scout_pool.py --check`、`node analysis/check_native_scout_pool.cjs` 均通过。覆盖真实布局编译、配置同步、无效清单、空池、等级缺失、3 级匹配 2／3／4 级、抽样端点及战斗数据隔离。原有 `check_native_pvp_contract.cjs`、`check_native_pvp_quest.cjs`、`check_native_pve_enter.cjs`、`check_native_pve_settle.cjs` 和 `check_native_battle_ownership.cjs` 均通过。源码语法检查通过。

运行时观察：本轮没有设备运行证据。用户确认：尚未验收。待复测：构建安装后，在原随机侦察入口换目标并完成战斗回城。初始池复用既有布局是本轮实现选择，用户尚未确认关卡内容。

配置、导入及无匹配行为见 `docs/native/SCOUT-POOL.md`。

用户新增“巷子里的猫”：来源为下载目录的 `第7关-布局 (1).json`，按用户指定改名，其余布局字段保留。以 `alley-cat` 独立加入池，保存在 `analysis/rpc-contracts/scout-layouts/alley-cat.json`。27 个建筑／地图对象、99 段墙、0 名守军；文件中的第 7 关编号仅供编译，不覆盖原第 7 关。布局校验、池编译同步及实际进场数据离线检查通过。池现有 4 关，全池模式下各占 25%。未构建安装，游戏内待复测。

用户再次新增同名“巷子里的猫”：来源为下载目录的 `第8关-布局.json`，仅改名称，以 `alley-cat-8` 独立入池，保存在 `analysis/rpc-contracts/scout-layouts/alley-cat-8.json`，保留旧 `alley-cat`。40 个建筑／地图对象、100 段墙、3 名守军。布局校验、池编译同步、实际进场数据及侦察流程离线检查通过，源码语法检查通过。当前共 5 关，每关 20%，两份同名关卡合计 40%；上一段 4 关／25% 是加入本关之前的状态。未构建安装、未修改设备存档，游戏内待复测。

设备观察（用户要求重新安装后）：已重新构建，APK SHA256 为 `72502ba9e057f3b158fe66a450b228d729c637294ffba5403d0c265c216c841e`，包内 `assets/offline/boot.js` 与当前源码逐字节一致。专用实例 1（`127.0.0.1:21513`）覆盖安装返回 `Success`，启动返回 `Status: ok`。安装前已停进程并备份，安装后、启动前核对全部 9 个存档文件，内容完全一致。备份和核对记录位于 `.local/scout-pool-install/20261019-194813/`，构建日志为 `.local/scout-pool-install/build.log`。此前“未构建安装”为当时状态，现已更新；侦察换目标、两份同名布局显示及战斗回城仍待游戏内复测。
