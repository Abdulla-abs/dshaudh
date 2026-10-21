# 知识古树研究无效

状态：离线通过，已保留存档覆盖安装到实例 1，游戏内研究及重登待复测。

用户观察：所有类型点击研究后只播放动画，列表等级不变，退出重登没有保存。

原代码证据：`TechManager.confirmTrainTech` 先扣资源，发送 `rpc_s_train_tech({tech_id,res_type})`，再调用 `addPoint`。每次加 1 点，满 `level_stage_num` 后由 `TechController.beginTraining` 开始倒计时。原版并非每点一次就升级。完成依赖 `rpc_c_tech_training_complete({tech_id})`，由原版清理计时和动画、升级、刷新列表及受影响对象。加速请求为 `rpc_s_finish_training_now`，发送前已扣钻石。

根因：本地此前未接这两个请求，没有模拟服务器自然完成回执。主城保存也没有研究点、等级和研究建筑计时字段。此结论来自适配源码与原版函数对照。原版提取件和反汇编位于 `.local/knowledge-tree/`，提取入口为 `analysis/inspect_native_tech.py`，短契约见 `analysis/rpc-contracts/knowledge-tree.json`。

运行时观察：修复前设备存档没有 `player.gained_techs`；知识古树 SID 为 `214`、类型为 `21001`，三个计时字段也为空。备份见 `.local/knowledge-tree/observed/save.tar`。现存数据不足以还原历史失败点击次数和资源，未推测补等级或资源。

修改：`analysis/native_boot.js` 新增研究请求处理、研究快照和主城完成时钟。保存研究点、等级、建筑计时及预扣资源。点数未满和满点倒计时均可续读；返回主城后检查离线到期。完成先落盘，再调用原版回执，沿用原研究效果。失败恢复有效存档，重复完成不会再升级。建筑升级期间沿用原版暂停计时计算。

验证：`node analysis/check_native_tech.cjs` 遍历原表四大类、29 个分支、950 条等级配置，检查部分研究点、满点、计时、原版完成回执、续读、钻石加速、主资源和联盟积分保存、写盘失败回滚及战斗隔离。主城快照、符文持久化、建筑离线施工、建筑编号、建筑契约、账号经验、商店及存档安全检查通过，源码语法和构建通过。研究点测试显式模拟原客户端预扣和加点；完成处理加载恢复的原版函数，不将离线检查当作设备点击验收。

交付：最终 APK SHA256 为 `fad2083175036669eca7db5b8137ff841ddb2718e1a661cb5b3bff5ceb590fcf`。通过 `127.0.0.1:21513` 覆盖安装返回 `Success`。安装前备份为 `.local/knowledge-tree/before-release/save.tar`；前后全部 9 个存档文件哈希一致，结果见 `.local/knowledge-tree/install-result.json`。未操作实例 0。

用户确认：目前仅有故障报告，修复后尚未确认。

待复测：各类型研究的点数能够增加；满点倒计时结束后列表升一级，退出重登等级和未满点进度均保留。设备实际操作、离线到期和加速仍待复测。
