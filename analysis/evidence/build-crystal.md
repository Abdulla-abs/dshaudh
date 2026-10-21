# 龙晶石无法加速建筑升级

状态：离线检查通过，已覆盖安装实例 1，游戏内使用待复测。

触发：用户报告已获得的龙晶石无法缩短建筑升级时间。

根因（原代码证据）：`handleShopUseItem` 只接龙蛋、技能书、喂食及宝藏；1113／1114／1115 会返回 `false`，没有道具回执。原版 `BuildingAction` 的 `SPEEDUP_BUILD_ITEMS` 正是这三档，`onPressSpeedupItem` 通过 `useItemByTypeid(typeid,{sid:target.sid})` 请求使用。原版事件 23 读取 `reduce_time/sid`，调用 `BuildingBuilder.reduceBuildTime`。

原表时长：1113 → 52801 → 20601，10800 秒；1114 → 52802 → 20602，32400 秒；1115 → 52803 → 20603，86400 秒。资源类型均为 11。依据 `item`、`input_event_client` 和 `resource_input`，分别为 3／9／24 小时，未自定数值。

修改：`analysis/native_boot.js` 新增 `applyBuildTimeUse`、`scheduleAcceleratedBuild`，并接入原道具处理。校验目标正在建造且未到期，先同时保存库存扣除和缩短后的 `bt/beginTime`，再回原版事件 23。部分缩短按新期限调用既有完工函数；足够覆盖剩余时间时立即走同一完工链路。旧计时任务校验建筑对象、开始时间及升级票据，避免取消或再次升级后误完工。

验证：`node analysis/check_native_build_crystal.cjs` 执行原版 `PackageManager.useItemAns`、`EventManager.onGetBuildTime` 和 `BuildingBuilder.reduceBuildTime`。三档时长、部分缩短、直接完工、批量、库存与时间同存、恢复剩余时间、无效目标、不足数量和失效计时任务均通过。建筑契约、喂食、技能书、商店检查及源码语法检查通过。测试完工调用处使用桩；既有完工函数另由建筑契约检查验证。

设备观察：安装前存档确有 1113 × 1，OID 为 `local_shop_9`，没有 `bs=1` 的建筑；未消耗该道具或启动测试升级。存档备份及摘要在 `.local/build-crystal/before-install/`，原版建筑操作栏解析在 `.local/build-crystal/BuildingAction.js`。

交付：APK SHA256 为 `32b7cf2c943e01e1069b1a2e279df2f9731a039e89a0d1c88ed2b96c892e270b`。实例 1（`127.0.0.1:21513`）保留数据覆盖安装并启动。契约见 `analysis/rpc-contracts/build-crystal.json`。

待复测：在原建筑加速按钮选择龙晶石，确认库存扣除、倒计时缩短，以及强退重进后保留结果。用户尚未确认修复效果。
