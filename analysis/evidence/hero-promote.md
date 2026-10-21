# 英雄晋升只播放动画

状态：设备已确认晋升记录生效；引导续接修复离线通过，原版剧情推进待复测。

用户观察：慈母龙晋升时播放动画，英雄实际没有变化。

原代码证据：`HeroPromotePanel.doPromote` 先扣日光和英灵，再调用 `ExpBar.promote`。后者设置 `promoting=true`，发送 `rpc_s_promote`，`Unit.callServer` 补入 `uid`。界面自行播放动画。适配层此前未处理请求，英雄未收到 `rpc_c_promote`。

设备观察：`.local/shop-treasure/promote-before/databases/jsb.sqlite` 的日志包含未处理的 `rpc_s_promote`，`uid=local_shop_hero_5`。保存的英雄仍为 `11302`。此前扣除资源的次数和历史余额无法仅凭该日志还原，本轮没有推测补发。

晋升规则：原版 `ExpBar.getRebornID` 取 `unit_main[typeid].upgrade_target`，变异类型保持原值。慈母龙 `11302` 的目标为 `11303`。一级费用为日光 199、英灵 30。`Unit.server_promote` 接收 `{success,id,hero}`，销毁旧组件并以新记录初始化，再调用各组件 `afterPromote` 刷新界面。

修改：新增 `handleHeroPromote` 和原请求分发。采集客户端已支付后的钱包及实时英雄记录，更新配置目标，保留等级、经验、技能、装备和变异。下一阶的已投入英灵归零。先保存英雄与钱包，再调用原晋升回执。写盘前失败则恢复保存的钱包并解除请求锁；重复请求由晋升锁及源类型校验拦截。

验证：`node analysis/check_native_hero_promote.cjs` 通过。检查调用原版 `Unit.server_promote`，确认 `11302 → 11303`、预扣费用不重复扣、经验技能装备保留、重启记录、重复请求、写盘失败和非法目标回滚。商店、第三关地图龙蛋和语法检查均通过。原函数定向解码位于 `.local/hero-promote/`。

交付：2026-10-15 构建 SHA256 为 `0ef52a239863066027eb0ecff1cd28352cd53d22c014feffbac56d5088054a27`。备份位于 `.local/hero-promote/device-before.tar`。通过 `127.0.0.1:21513` 覆盖安装，返回 `Success`，已启动游戏。

续接缺口（2026-10-15）：用户报告晋升指示一直停留。设备 `.local/shop-treasure/promote-guide-stall/databases/jsb.sqlite` 保存的慈母龙已为 `11305`，日志明确有 `11303`、`11304`、`11305` 三次 `hero-promote-saved`，但 `achieve_raw` 无 `hero_reborn_times`。此前“游戏内晋升待复测”现已有保存记录支持，不能再将引导卡住归因于晋升未生效。

原版条件：`rookie_controller[204306].rookie_reborn_check=1`，目标按钮 `15101`。`GameControllerBuild` 检查 `AchievementRecorder.achieve_raw.hero_reborn_times`。晋升回执本身不增加此服务器计数，上一版适配遗漏此字段。

续接修改：成功晋升同一事务保存 `hero_reborn_times + 1`，在晋升回执前同步原成就组件。旧档启动时从上次持久化状态日志恢复有英雄 SID、晋升目标和时间的成功事件；仅接受目标可沿原升级链到达当前英雄的记录，按事件去重，并以一次性标记防重复修复。无证据时不根据卡色推测次数。保留原教程位和剧情逻辑。

续接检查：定向测试新增计数先于回执、保存失败不计数、三次历史成功恢复、重复日志去重、重复启动不累加和无证据不补计数。存档安全、商店回归和构建通过。续接修复包 SHA256 为 `eaf90d4043972b1d69eaac8d79d451becf6c7a3eaac4a0eea5ffcb84cbef111f`，安装前备份 `.local/hero-promote/guide-device-before.tar`。

安装结果：首次流式安装返回空错误，改为推送 APK 后执行 `pm install -r` 返回 `Success`，已启动实例 1。保留原存档。

待复测：重新进入后原引导标识消失，后续晋升完成对话自然触发。无需再次晋升以满足已有完成条件。
