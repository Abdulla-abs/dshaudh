# 城墙扣费后停在升级中

状态：离线通过，专用实例 1 已保留数据覆盖安装并启动；实际画面待复测。

触发（用户确认）：城墙升级扣资源，形态不变，点击出现“加速”，城墙实际无升级时间。

根因（原代码证据）：原版 `ClientPlayer.rpc_c_ans_building_upgrade` 成功时调用 `getUnit(dict.cid).setSid(dict.id)`。适配只回 `{success:true,unit:sid}`，实际原函数检查可复现异常，导致后续保存及完工不执行。`resolveBuildTime` 又优先取全局 `activeBuilder` 且忽略零值，可能误用其他建筑的正耗时；这是独立可复现的计时错误，未证明本次设备也触发了它。

原配置：`BuildingBuilder.init` 读取 `config.lv_up_time || 0`；原表 21101～21110 均无该字段，模型分别为 `unit/ccb/21101.ccbi` 至 `21110.ccbi`。表解析来源 `.local/shop-treasure/unit_main.js`，原始输入 `analysis/decoded/script/Data/Common/unit_main.jsc`。

修改：`analysis/native_boot.js` 成功回执补正确 `cid/id`；计时优先当前目标组件并接受零秒。沿用既有完工刷新、保存和施工续读，不改原界面、不额外扣费。契约见 `analysis/rpc-contracts/building-upgrade.json`。

验证：建筑契约检查执行真实原版成功回执，复现旧异常并验证修复后零秒升二级、状态完成、SID 保留；正耗时继续等待，旧 `bs=1` 零耗时城墙走施工恢复。等级刷新使用原版 `onBuilderFinishBuilding`，渲染与持久化部分使用既有检查桩，不能替代设备验收。龙晶石及钱包回归、源码语法检查和 APK 构建通过。

设备观察：实例 1 安装前 `walls=[]`，没有 `bs=1` 建筑，近期状态日志无升级条目，未在该设备复现用户存档。数据库备份和摘要位于 `.local/wall-upgrade/before-install/`。没有新建城墙或消耗资源作设备试验；未操作其他设备。

交付：`dino-local-native.apk` SHA256 `2a69c35a49c4415ca439b9ae7d5e4d3122f82289c0beaaae2e8864ba5f509ba7`。ADB `127.0.0.1:21513` 覆盖安装返回 Success，已启动。

待复测：安装新版重进主城，确认已扣费且保存为施工状态的城墙完成；再正常升级一段，核对立即换形态、无加速选项和退出续读。若旧档未保存施工状态，不推测补等级或资源。
