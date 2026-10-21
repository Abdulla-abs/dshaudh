# 符文合成扣费后没有成品

状态：离线检查通过，已保留数据覆盖安装实例 1，游戏内待复测。

触发：用户合成 1 级符文，扣除资源后没有得到道具。

原代码证据：`AlchemyCompound.onPressOK` 先调用 `ResourceManager.useRes`，再执行 `PackageManager.composeEquipment`。请求为 `rpc_s_compose_equipment({equip_id,hero_pieces,prop_pieces})`。适配层原先未处理该接口。原版 `ClientPlayer.rpc_c_compose_equipment_ans` 将 `dict.ans` 交给 `PackageManager.composeEquipmentAns`，再调用 `inputAward` 和原合成动画。

运行时观察：设备状态日志记录 `callServer-unhandled`，方法为 `rpc_s_compose_equipment`，`snap.equip_id=7031`，时间戳为 1792412536779。原始设备数据库见 `.local/shop-treasure/rune-compose-before/databases/jsb.sqlite`。只证明请求未处理，不能据此确定所有历史失败次数或实际损失总额。

修改：新增 `handleComposeEquipment`，校验英雄碎片和转生碎片点数，跨堆栈扣材料及图纸。转生碎片 `item_level=2` 每个计 3 点，其余按原函数计 1 点。快照保存原界面预扣后的钱包，不再扣第二次。生成成品、扣材料和保存使用同一事务，成功后回原版类型 19 道具回执。失败恢复保存的钱包和背包，并解除合成按钮锁定。

本地规则：用户明确允许自定缺失的随机规则。按原表合成事件选出同形状、同等级的三类候选，等概率生成一件。普通、一转、二转各随机一条有效属性；属性编号和值来自 `equipment_attribute`。本次不生成专属英雄属性。随机权重和每层一条属于本地规则，不能标为原服务器规则。

验证：`node analysis/check_native_rune_compose.cjs` 通过，覆盖 15 种配方、45 个候选、属性层、原回执和动画、跨堆栈材料、点数折算、图纸扣除、成品保存及单次扣费。材料不足、重复请求、背包满、写盘失败均验证不提交，恢复扣费并清锁。原道具及 14 种英雄合成、英雄喂食和存档安全回归通过，源码语法检查通过。

交付：构建并安装包 SHA256 为 `5a6a36f53061c689bcc97de7814e02de1bd8cdf2fa84e64f6410fd7522b80355`。安装前后 9 个存档文件一致，已启动实例 1。备份及安装记录见 `.local/rune-compose/`。

待复测：合成成功后确认高级道具栏出现带属性的符文，材料和费用仅扣一次；退出重进确认保留。此前失败扣费未按不完整日志推测补发。
