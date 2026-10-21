# 整行城墙升级扣费后不完工

状态：离线通过。已保留数据覆盖安装并启动实例 1，实际画面待用户复测。

触发（用户确认）：选中城墙，选择“整行”后升级。资源扣除，各段形态不变，点击出现“加速”。此前单段检查没有覆盖这条分支。

根因（原代码证据）：`WallRow.upgradeWithDiamond` 先扣费。`confirmUpgrade` 调用各段的 `upgradeInWallRow`，将状态设为施工中，然后发送 `rpc_s_upgrade_walls({uids,res,diamond})`。本地此前没有处理这条请求，原版批量完工回执一直未触发。

原版回执为 `ClientPlayer.rpc_c_wallrow_build_complete`。它读取以 SID 为键的对象，逐段调用 `upgradeFinish` 和 `onBuilderFinishBuilding`。单段的 `rpc_c_ans_building_upgrade` 无法替代它。原函数解析位于 `.local/wall-row-upgrade/WallRow.js`，输入为 `analysis/decoded/script/Client/UI/WallRow.jsc`。

运行时观察：安装前数据库有 73 段城墙，存于 `level.units`。这些段的存档状态均为 `bs=2`。状态日志明确记录未处理的 `rpc_s_upgrade_walls`，资源为 12000，钻石为 0。日志未保存 `uids`，无法确定此次失败涉及哪些段。备份和摘要位于 `.local/wall-row-upgrade/before-install/`。

修改：`analysis/native_boot.js` 新增 `handleUpgradeWalls`，并接入原请求。按请求中的 SID 校验目标，生成各段目标等级，调用原版批量回执。回执前保存扣费后的钱包和施工状态，回执后保存新等级。完工不再扣费，重复回执不会再加等级。

验证：`node analysis/check_native_wall_row.cjs` 执行原版整行扣费、状态修改、请求和批量回执，以及原版模型刷新入口。覆盖混合等级、满级跳过、坐标保留、等级落盘、重复请求和无效 SID。渲染组件和部分游戏依赖使用桩，不能替代设备画面验收。建筑契约、龙晶石和钱包回归通过；语法检查及 APK 构建通过。

交付：`dino-local-native.apk` 的 SHA256 为 `e5f6dd1dd53c20b1a41e0fb3134631cbb25b9c7a802a19bec89bfca818589b84`。实例 1（`127.0.0.1:21513`）覆盖安装返回 Success，已启动。

待复测：整行升级后应立即刷新各段形态，点击不再显示施工加速，退出重进保留等级。此次没有为验证另扣设备资源，也没有按日志中的总费用推测补等级。旧失败操作未保存施工段，无法保证自动恢复。
