## 当前结果

已生成 `dino-local-startup.apk`。这个测试包可显示原版入口画面、角色动画和“进入游戏”按钮。它跳过补丁检查与维护公告，也关闭了自动登录。

测试包已移除 `android.permission.INTERNET`，无法访问服务器。它也跳过了旧渠道 SDK 的联网初始化。

**主城、建造、养成、战斗和本地存档尚未恢复。** 点击“进入游戏”会显示测试范围说明，不会登录网易或 360 账号。

原始 `koudaizhuluoji.apk` 保持不变。测试包使用本机 Android 调试证书签名。包名仍是 `com.netease.h1.qihoo`，不能与原渠道包同时安装。

## 运行方法

本机已在逍遥模拟器的独立实例 1 中安装测试包。该实例使用 Android 9，并支持 32 位 ARM 转译。

双击 `启动本地测试.cmd`，可启动这个实例并打开游戏。安装到其他设备时，设备必须支持 `armeabi` 或 32 位 ARM 转译。已测试的 MuMu Android 15 环境只有 64 位 ARM 转译，安装原游戏会报 `INSTALL_FAILED_NO_MATCHING_ABIS`。

反复热启动时，模拟器曾出现持续黑屏。启动脚本会先重启专用测试实例，再打开游戏。模拟器启动需要等待约 30 秒。其他模拟器实例不受影响。

## 修改位置

`analysis/local_hook.cpp` 在 Cocos2d 初始化之后执行本地脚本。`analysis/boot.js` 关闭补丁检查，设置开发离线标记，调用 `DestroyVersionControlAndEnterGame()`，再禁用入口的自动登录和维护公告。

修改后的 `Cocos2dxRenderer.smali` 在 `nativeInit()` 后调用 `local.dino.LocalHook.run()`。原画面、资源与大部分逻辑仍来自原客户端。底部增加了测试范围说明。

渲染器还移除了原版 Java 层的帧间隔忙等循环，由 `GLSurfaceView` 刷新机制控制绘制。

`analysis/decode_scripts.py` 可解密、解压全部 318 个 `.jscz` 文件。输出仍是 SpiderMonkey 字节码。尝试用原引擎的 `JS_DecompileScript()` 恢复源码时，只得到 `[no source]`，因此不能把这些输出当作源码。

## 重新构建

在本机运行：

```powershell
python F:\kdzlj\analysis\build_local.py
```

脚本编译 ARM 启动库，复用 `analysis/apk/build/apk/classes.dex`，以原 APK 为基础重新打包并签名。输出 APK 和 SHA-256 校验文件都位于项目根目录。

若修改 smali，先用本机工具重新构建 dex：

```powershell
& 'C:\Users\ZoomLink\.jdks\ms-17.0.18\bin\java.exe' -jar F:\kdzlj\tools\apktool.jar b F:\kdzlj\analysis\apk --aapt F:\Android\Sdk\build-tools\35.0.0\aapt2.exe -o F:\kdzlj\analysis\rebuild.apk
python F:\kdzlj\analysis\build_local.py
```

后续要进入主城，需补齐客户端期待的玩家初始化数据和本地服务代理。当前发现的离线标记会跳过部分联网调用，但不会自动创建玩家、建筑或地图数据。

## 验证记录

已验证 APK 签名和安装。早期版本曾在关闭 Wi-Fi 与移动数据后显示入口画面，后续重复测试又出现黑屏，因此不能保证这种运行方式稳定。当前采用移除 APK 网络权限的方式验证本地启动，模拟器可保持连接状态。启动日志中的 `local-entry-ready` 表示脚本执行完成，还需结合截图确认画面。

最终包在重启测试实例后显示了原版入口画面。APK 权限清单中没有 `android.permission.INTERNET`。截图保存在 `analysis/final-no-network.png`，权限清单保存在 `analysis/final-permissions.txt`。当前验证范围是本机专用 Android 9 模拟器实例。

模拟器命令参考[逍遥模拟器官方命令手册](https://www.memuplay.com/blog/memucommand-reference-manual.html)。解密算法分析参考 [Cocos2d-x 的 ZipUtils 源码](https://raw.githubusercontent.com/cocos2d/cocos2d-x/cocos2d-x-2.2.6/cocos2dx/support/zip_support/ZipUtils.cpp)，实际参数来自本 APK 的原生库。
