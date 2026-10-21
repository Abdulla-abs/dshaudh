# 商店建筑确认后整帧卡死

状态：已复现并修复，离线与设备购买检查通过。用户复测待确认。

触发：从原商店购买日光皿（20300），在放置界面点击确认。最后停在 `rpc_s_build(cid=123,x=24,y=24)`，整帧不再更新。

原代码证据：`UnitManager.getUnitBySID(sid)` 调用 `getUnit(sidToCid.local[sid])`，而 `getUnit` 直接返回 `units[cid]`。设备的 `units.undefined` 实际是玩家对象，`sid=1`。编号 179 未映射，因此查询 179 也返回玩家。旧 `allocateSid` 仅判断结果是否为真，把每个空闲编号都当成已占用，循环无法结束。

运行时观察：渲染线程为运行态，没有崩溃退出。定点记录确认 `BUILD_START` 的 `playSound` 和 `doPlay` 都已返回，随后停在编号分配。进一步探针确认 `nextSid=179`，本地表没有对应映射，`units.undefined.sid=1`。原记录在 `.local/shop-treasure/build-freeze-probe2/`、`build-freeze-probe3/`。线程记录在 `.local/build-freeze/native-backtrace.txt`。临时探针已撤回，原版声音保持恢复状态。

修改：`LocalNative.allocateSid` 仅在查询对象的 SID 与候选编号确实相同时判定冲突。继续核对存档、数字字符串编号和待处理购买，并在超出安全整数范围时及时报错。沿用原商店、确认按钮、回执和施工流程。

离线验证：`analysis/check_native_building_sid.cjs` 执行原版 `getUnit` 和 `getUnitBySID`，构造设备的玩家回退条件。编号 179 正常返回，真实占用及待处理编号仍跳过，耗尽编号及时失败。原购买、旧建筑保留、施工恢复、建筑回执和声音检查均通过，语法及构建通过。旧检查仅使用“未找到即返回空”的模拟查询，因此遗漏此问题。

设备验证：已保留存档覆盖安装实例 1，并实际通过原商店购买日光皿。确认后正常回执，SID 为 179，原 85 个建筑之外新增第 86 个记录；显示 60 秒施工倒计时。购买消耗原价 300 龙银。施工期间强退重进后，新建筑及原施工开始时间保留。记录在 `.local/shop-treasure/build-freeze-fixed-purchase/`、`build-freeze-relogin/`，截图在 `.local/build-freeze/fixed-purchased.png`。

自然完工后再次强退重进：新增日光皿为 `179/20301/bs=2/bt=0`，坐标仍为 `(24,24)`，总数 86。逐一核对原 85 个建筑的 SID、类型和坐标，均保留。记录在 `.local/shop-treasure/build-freeze-completed/`、`build-freeze-final-relogin/`，截图在 `.local/build-freeze/final-relogin.png`。这次已覆盖确认、施工续读、自然完工及完工重登。

现场备份：`.local/shop-treasure/build-freeze-before/`。最终 APK SHA256：`61e87e1633b0b10ec9c24e4748f8957dcd5b8b48380f6a963d2823a817250d09`。本轮只在专用实例 1 复测，没有操作实例 0 或手机。

用户确认：确认了旧故障，尚未确认修复效果。
