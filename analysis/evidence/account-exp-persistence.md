# 账号经验退出后丢失

状态：离线检查通过，已在专用实例 1 覆盖安装，游戏内获经验后退出重进待复测。

触发：用户报告账号获得经验后，退出游戏再进入，经验消失。

根因：`tryDumpAndSave` 从旧存档复制账号，只更新资源和背包，没有采集运行中的 `G_Player.exp` 和 `level`。原版经验变化函数也没有本地保存回调。入口的定时保存会在主城就绪后取消，不能保证稍后获得的经验落盘。

原代码证据：`ClientPlayer` 的 `rpc_c_add_player_exp` 调用 `addExp(dict.exp)`；`addExp` 修改 `this.exp`，升级时扣除本级经验并调用 `addLevel`。`rpc_c_refresh_player_info` 同时赋值 `exp` 和 `level`。登录初始化读取 `dict.exp`。定向反编译见 `analysis/disasm/ClientPlayer.decompiled.js` 对应函数；不以反编译的循环控制结构作为重新实现升级算法的依据。

修改：`analysis/native_boot.js` 新增 `copyAccountProgress` 和 `installAccountProgressPersistence`。保留原版计算，在 `addExp` 和账号信息刷新结束后同步写入当前账号的经验与等级。允许升级后经验为 0，拒绝无效数值；其他玩家对象不能覆盖本账号。主城快照也同步这两个字段。保留原存档及收据，没有补发或重置历史经验。

验证：`node --check analysis/native_boot.js`、`node analysis/check_native_account_progress.cjs`、`node analysis/check_native_save_safety.cjs`、`node analysis/check_native_pve_wallet.cjs` 均通过。定向测试覆盖立即保存、重新加载后继续累积、升级、经验归零、原版刷新 RPC、重复安装钩子、其他玩家隔离、无效值保护和主城快照。游戏内退出重进尚未验收。

交付：`python analysis/build_native.py` 成功；APK SHA256 为 `5f8b54f6885dd9fe587aa481af02b6a0d10e99e49dfaf57a1e83ef8edf5766f2`。通过 `127.0.0.1:21513` 执行保留数据的覆盖安装，返回 `Success`。安装前设备数据库及偏好备份位于 `.local/account-exp-persistence/device-before.tar`。

待办：在实际账号获得经验后退出重进，确认经验及升级后的等级保留。此前已丢失的经验没有可靠来源，本次没有推测恢复。
