# 二转图纸无法合成三转图纸

状态：原版调用链定向检查和构建通过，已保留存档安装实例 1，游戏内待复测。

触发：用户报告使用二转图纸无法合成三转图纸。

原代码证据：原 `AlchemyCompound.onPressOK` 的图纸分支调用 `PackageManager.composeBlueprint`。该方法把所选 OID 转成类型编号后，发送 `rpc_s_compose_blueprint({blueprints,reborn_type})`。此前本地适配未接此独立请求，普通道具合成处理器不覆盖它。原请求不预扣图纸。短代码见 [原版摘录](blueprint-compose-stock.js)，原表关系见 [契约](../rpc-contracts/blueprint-compose.json)。本轮未在设备上执行合成，未采集该次失败操作的日志。

原配方：`ALCHEMY_BLUEPRINT_COMPOSE_NUM={2:5,3:2}`。5 张二转图纸走占位物品 4041 的 `53801→12801` 奖励，获得 1 张三转图纸；14 个候选使用原表不同权重。2 张三转图纸走 4042 的 `53802→12802` 奖励，在同档 14 个候选中等权重重合成。本轮保留原规则，没有采用转生宝藏的独立奖池。

修改：新增 `handleComposeBlueprint`，校验档位、材料类型和实际库存，支持同类型图纸重复选入。在存档副本扣材、抽取结果后一次保存，再调用原图纸回执更新结果和播放动画。回执执行前同步扣材后的背包，结束后同步最终存档。失败恢复原保存状态并解除合成按钮等待。

验证：`node analysis/check_native_blueprint_compose.cjs` 执行原按钮、PackageManager 请求和结果函数，以及原 ClientPlayer 回执。两种原奖池的 56 个区间边界、同类和混合材料、错误档位、占位图纸、数量不足、耗材后重复请求、满背包腾位、写盘和展示失败均通过。结果及材料的运行时背包与重读存档一致，角色列表和其他保存字段保留。普通道具／角色碎片合成、符文合成、商店、角色解散相关回归和语法检查通过，APK 构建通过。

交付：已备份 `.local/blueprint-compose/before-save.tar`，实例 1 覆盖安装返回 Success。安装前后全部 9 个存档文件逐字节一致，APK 内启动脚本与当前源码相同，随后已启动游戏。未消耗设备图纸。APK SHA-256：`96537730c991b987be16ee0d947e4658c82aadf73890dc090d6040f31f4854e3`。原始输出及构建日志位于 `.local/blueprint-compose/`。

待复测：用 5 张二转图纸完成合成，核对材料减少 5 张、出现 1 张三转图纸、结果动画及退出重登后的库存。离线检查和安装成功不等于游戏内验收。

检查准备：用 `python tools/jsc_decompiler/cli.py <输入.jsc> <输出.js>` 解出 `Client/UI/Package`、`Data/Common/item`、`Data/Common/item_input` 和 `Data/Client/input_event_client`，输出到 `.local/blueprint-compose/` 并沿用源文件名。输入位于兼容路径 `analysis/decoded/script/`。检查另读取既有 `analysis/disasm/Components.decompiled.js` 和 `ClientPlayer.decompiled.js`。
