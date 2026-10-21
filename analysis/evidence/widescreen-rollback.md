# 安卓宽屏试验撤回

状态：用户确认布局混乱，要求撤回；黑边问题未解决。

触发：RMX3823（Android 16）横屏显示两侧黑边。用户指定设备 `adb-b949c7c6-zEwUSM._adb-tls-connect._tcp`。

运行时观察：原窗口为 2204×1240。仅增加 `android.max_aspect` 元数据无效，Activity 的 `resizeableActivity=true` 也无效。应用级 `android:maxAspectRatio="2.4"` 将窗口扩展到 2634×1240；剩余避让原因是 `DISPLAY_CUTOUT`。随后尝试 API 28 以上的短边摄像头区域布局。

原代码证据：真机系统框架 `OplusDisplayCompatUtils.shouldCompat` 读取应用级 `ApplicationInfo.maxAspectRatio`。定向反汇编在 `.local/widescreen/phone/oplus-disasm/`，窗口记录和截图在同目录上一级。

用户确认：游戏内布局混乱，本次方案不可用。解除系统窗口限制不能视为游戏适配通过。

撤回：移除本次所有 Manifest 及 `AdvanceDino.onCreate` 变更，两文件相对 Git 无差异。原 APK 备份为 `.local/widescreen/phone/before.apk`，SHA256 为 `d0bb69b8126ad3cb41946bfddfc829ce524b05397bdd5a08c19a75675e4cf0fa`。根目录交付包已恢复为该备份，真机按保留数据覆盖安装恢复。未卸载或清除数据；真机私有存档因权限限制无法导出。

模拟器：实例 1 曾临时调整分辨率，已执行 `wm size reset` 恢复。未向实例 0 操作。

待办：保留原黑边，不继续修改布局；其他玩法代码未因本次试验撤回。
