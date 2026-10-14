# 当前状态（2026-10-14）

方向：暂停扩玩法，先提高字节码可读性、建立 RPC 数据契约，再验证敌袭自然结束、返回主城、剧情续接和强杀续读。

用户已确认：原入口与续读、敌袭村庄和敌军、去重、龙弹堡主动攻击、单人第 1 关解锁和战役进击。敌袭自然结算、剧情续接，以及战役结算星级和下一关解锁仍待复测。

确定证据：Cocos SpiderMonkey v22，魔数 `0xb973c051`。建房 `_createBattleUnitWhenInit(unitData, client)` 需要两个参数。龙弹堡需要 `replay.seed`；自然结束必须保留 `inReplayMode`。建筑初始化读取 `bs`、`bt`，不是 `state`、`beginTime`。

主路径：`ClientPlayer` → `rpc_c_start_game` → `changeStageAndInit` → `GameControllerBuild.initLevelFromData`。主适配源码为 `analysis/native_boot.js`，存档键 `dino.local.native.v1`，结算轨迹键 `dino.local.native.settle.trace`。

新账号建筑：20101、20601、21201、20201、20401，无 207。初始钻石 150、龙币 5000、日光 5000、英灵 50；龙币和日光须写 ResourceHolder。宝石加速走 `finishViaBuilder`。首次剧情 `first_movie_played=0`，`user_config` 为空。

真实服务器初始坐标、敌袭阵容及完整回放仍缺。兼容数据不得标为官方原值。后续结论须附证据并注明验收状态。
