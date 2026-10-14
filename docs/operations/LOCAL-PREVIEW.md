## 本次结果

`dino-local-preview.apk` 可从原版入口打开本地场景预览，显示原版地图和 8 座建筑。支持拖动、缩放、复位、查看建筑编号和返回入口。部分建筑保留原版动画。

这是原版资源的场景预览，**完整主城、建造、采集、养成、战斗与存档尚未恢复**。建筑布局是手工编排的测试布局，不是旧账号城池。预览界面已明确标注测试范围。

使用原 APK 的 Cocos2d-JS 引擎、地图 CCBI 和建筑 CCBI。保留原始安装包与上一阶段的启动测试包。此包已移除网络权限，使用本机调试证书签名，包名仍为 `com.netease.h1.qihoo`。

## 打开方法

本机双击 `启动场景预览.cmd`，脚本会重启专用逍遥实例 1、安装此版本并打开游戏。启动后点击“进入游戏”。脚本只对专用实例 1 设置 DirectX 渲染；此前该实例在 OpenGL 模式下反复出现黑屏，切换后再验证。首次加载建筑需要等待数秒。

顶部提供返回、复位、加号和减号。拖动地图可查看其他建筑。建筑点击目前只显示编号。

其他设备需支持 32 位 ARM 或相应转译。已在本机逍遥 Android 9 环境验证。未验证其他设备；现代纯 64 位环境无法直接运行原版库。

## 实现与下一步

`analysis/city_boot.js` 将入口操作绑定到本地预览。它独立创建 Cocos 场景，加载 `map/ccb/sub_map_build.ccbi`，再按原始 `data.unit_main` 配置加载 20101、20201、20301、20401、20501、20601、20701、21201 的建筑资源。

建筑 CCBI 的控制器暂用空控制器接收节点和动画。没有调用完整 Unit 初始化，也没有伪装成已恢复建筑功能。地图交互使用客户端已有的 `UI.Touchable`。

运行原版完整主城流程的实验已能创建 ClientPlayer、构造其组件并加载 GameScene / GameControllerBuild。但地图参数和玩家字段不完整时，原引擎会出现异常或崩溃，尚不能交付为可玩主城。

继续恢复需要逐项建立本地玩家字段、资源状态、建筑单位及调用回执，再接入保存。单人战斗仍需恢复初始化、单位状态和结算，不能直接由当前预览获得。

调试版本 `analysis/dino-research.apk` 与 `analysis/research_hook.cpp` 仅用于检查运行对象，不用于交付。交付 APK 使用 `analysis/local_hook.cpp`，不读取外部调试脚本。

## 构建

修改 smali 后先运行 apktool 构建；仅修改预览脚本时运行：

```powershell
python F:\kdzlj\analysis\build_preview.py
```

该脚本复用编译后的 dex 和清单，编译本地启动库，保留原资源并签名。输出 `dino-local-preview.apk` 和对应 SHA-256 文件。

## 渲染兼容性

本机专用实例原设置为 OpenGL（`graphics_render_mode=0`），入口和场景均出现间歇性全黑帧。改用 DirectX（值 1）后重新验证。官方命令参数说明见 [逍遥模拟器命令行文档](https://www.xyaz.cn/blog/20240116-231686.html)。

尝试过 Java 帧等待和逐帧恢复 Director，均未解决原渲染模式的黑屏；这些修改已撤回，不在交付 APK 中。

## 最终验证

交付 APK 已签名、安装并在专用逍遥 Android 9 实例中运行。DirectX 模式下连续采集 5 帧均有正常画面；随后完成缩小、复位、拖动、建筑编号显示、返回入口及再次进入的操作验证。

截图为 `analysis/local-preview-verified.png`。帧检查记录在 `analysis/preview-frame-check.json`，交互记录在 `analysis/preview-interaction-check.json`。这些结果只覆盖本机该模拟器环境。

APK 的 SHA-256：`0ba711736605b9fda0657eb29510230e66417807d5b979ba134708ab01d3cbdc`。
