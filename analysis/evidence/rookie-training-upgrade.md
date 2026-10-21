# 训练完成与龙英巢升级

状态：用户确认日光加速训练后剧情推进，龙英巢钻石加速升到二级。

训练根因：`QuestManager.init(params)` 将 `params.main_quest` 赋给任务映射。初始玩家缺少该字段。原版 `SoldierTrainer.addSoldier` 增兵后调用 `update_mt_warrior`，读映射时抛错，中断剩余训练与队列清理。设备日志指向 `QuestManager.js:127`、`Components.js:4691` 和 `Train.js:268`。适配补 `main_quest={}` 和任务时间字段。原始快照在 `.local/train-finish-guide/`。

升级根因之一：原版 `GameControllerBuild.__buildUnit(params,id)` 用集合键调用 `obj.setSid(id)`；数组下标与存档 SID 不同，加速曾查到没有建筑组件的玩家对象。`makeHomeInitDict` 改传 SID 对象；升级读取 `uid`；完工目标校验建筑组件，显式 CID 优先。原始快照在 `.local/hero-nest-finish/`。

升级根因之二：`BuildingBuilder.upgradeFinish` 的字节码只结束计时、释放工人和播放效果，不改等级。原版 `Unit.server_build_complete(dict)` 随后调用 `onBuilderFinishBuilding(dict)`，由 `refresh` 和 `initByServer` 读取新等级并重建模型。旧适配跳过刷新，记录出现 `from=20601,to=20601`，却误报成功。已传入目标 `20602`、`unit_level=2`、`bs=2` 和原坐标，并恢复原版完工刷新。成功条件现在检查类型、`unit.level`、建筑完工状态和可见性。

验证：`node analysis/check_native_building_contract.cjs` 覆盖 SID 映射、错查玩家、升级到二级、新建保持一级及等级不变时拒绝成功。`node analysis/check_native_replay.cjs` 通过。用户确认升到二级；后续设备快照记录 `sid=2,typeid=20602,x=20,y=28,unit_level=2`，位于 `.local/hero-slots/`。

待办：自然升级倒计时结束、跨重启施工恢复尚未单独验收。旧定时回调增加升级任务身份校验，避免完成后来同 SID 的升级。
