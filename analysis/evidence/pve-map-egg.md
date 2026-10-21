# 单人第三关地图龙蛋未入库

状态：离线通过，已保留存档覆盖安装到专用实例 1，实际点击领取待复测。

用户观察：第三关通关后点击地图龙蛋，背包没有龙蛋。

原代码证据：`HeroCardEgg.onPress` 先设置运行中 `G_Player.pve_awardBox[index]=1`，再发送 `rpc_s_get_pve_egg({index})` 并播放消失动画。适配层此前未处理此 RPC。地图是否显示龙蛋由 `pve_awardBox` 键判断，可领取条件为该关已解锁且星数大于零。原伪反编译方法标签有偏移，以函数体和字符串为证。

原配置：`pve_stage[3].pve_tresure=33009` → `input_event_client[33009].putin_event_item=[6200]` → `item_input[6200]` 为 1124 × 1，随机字段为空。领取固定获得一个龙蛋；打开背包龙蛋则复用已有随机英雄抽取逻辑，该奖池概率为已授权的本地规则。

设备观察：`.local/shop-treasure/pve-egg-before/databases/jsb.sqlite` 显示第三关星数为 3，`pve_awardBox={}`，背包无 1124；状态日志有 `callServer-unhandled`、`method=rpc_s_get_pve_egg`、`snap.index=3`。因此本次无需推测补发：重启后原地图会重新提供未领取的龙蛋。

修改：`handlePveMapEgg` 校验保存的通关进度和奖励配置，使用现有背包堆叠/容量逻辑，在同一次写盘提交物品与领取标记后同步原背包组件。重复点击及重启用保存标记去重，失败时恢复运行中领取标记，保持可重试。接入原 `callServer` 分发，不修改地图、动画或玩法。

验证：`node analysis/check_native_pve_map_egg.cjs` 通过原第三关配置、固定一个龙蛋、重复领取、重启去重、磁盘失败后重试、未解锁及背包满回滚；`node analysis/check_native_shop.cjs` 和语法检查通过。

交付：2026-10-15 构建 SHA256 `8e6044cfa1ed874f6cb313e09ea520fcbbf55b6734954df8d01e3861e99c9581`。安装前备份 `.local/pve-map-egg/device-before.tar`；专用 `127.0.0.1:21513` 执行 `install -r` 返回 `Success`，已启动游戏。未清数据，也未直接修改设备奖励。

待复测：重进第三关地图点击龙蛋，确认背包增加一个，强退重进保留且地图不再重复领取。
