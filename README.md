# 客户端本地适配

保留原客户端，只将失效服务器依赖替换为本地数据和回执。仓库提供维护源码、补丁、RPC 契约与检查脚本；原始 APK 通过 Release 单独分发。

## 获取源码和底包

以下命令使用 Windows PowerShell。先克隆项目，再将[原始 APK](https://github.com/Abdulla-abs/dshaudh/releases/download/OfficialVersion/koudaizhuluoji.apk) 下载到仓库根目录，保留下面命令中的文件名。

```powershell
git clone https://github.com/Abdulla-abs/dshaudh.git
cd dshaudh
curl.exe -fL --output koudaizhuluoji.apk https://github.com/Abdulla-abs/dshaudh/releases/download/OfficialVersion/koudaizhuluoji.apk
Get-FileHash .\koudaizhuluoji.apk -Algorithm SHA256
```

本机已用于构建的原始底包 SHA-256 为：

```text
0147B66E34C4790FEA9C273F2DCF67721E55B2F2BCE8A50AB5EA51EA1E09B618
```

下载后请核对哈希。下载底包后可以阅读和修改源码，构建前还需完成以下初始化。

## 首次配置开发环境

安装 Git、Python 3、JDK 17 和 Android SDK。当前构建脚本使用 Build Tools `35.0.0`、NDK `27.0.12077973` 及 Windows 工具链。将 apktool 的 JAR 文件放到 `tools/apktool.jar`，确保 `java` 和 `keytool` 可从终端运行。

首次解包先输出到 `.local/bootstrap/apk`，再覆盖仓库维护的补丁，最后合并到构建工作区。以下命令只用于刚克隆的仓库；已有解包工作区时，先备份本地未提交的修改。

```powershell
New-Item -ItemType Directory -Force .local/bootstrap | Out-Null
java -jar tools/apktool.jar d koudaizhuluoji.apk -o .local/bootstrap/apk
if ($LASTEXITCODE -ne 0) { throw 'APK 解包失败，请检查 apktool 和 Java。' }
Copy-Item analysis/apk/* .local/bootstrap/apk/ -Recurse -Force
Copy-Item .local/bootstrap/apk/* analysis/apk/ -Recurse -Force
```

其中 `analysis/apk` 中受 Git 管理的 Manifest、smali 和 apktool 配置是项目补丁，必须覆盖到解包结果中。若临时解包目录已经存在，请使用新的临时目录，并同步调整上述路径。

编辑 `analysis/build_native.py`，将 `SDK` 和 `JAVA` 改为本机路径。若使用其他 NDK 或 Build Tools 版本，还需同步修改脚本中的版本路径；这些版本组合尚未在本指南中验证。

脚本默认使用用户目录下的 `.android/debug.keystore`。若本机没有此文件，可创建开发签名密钥；已有密钥时跳过：

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE/.android" | Out-Null
keytool -genkeypair -keystore "$env:USERPROFILE/.android/debug.keystore" -storepass android -keypass android -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
```

## 修改、构建和测试

主要适配逻辑在 `analysis/native_boot.js`，原生加载代码在 `analysis/local_hook.cpp`。接口说明和验证脚本入口见 [RPC 映射](docs/ai/rpc-map.md)。

在仓库根目录运行：

```powershell
python analysis/build_native.py
```

构建会编译 `analysis/apk` 中的补丁和原生适配库，以原始 APK 为底包，替换对应内容、加入最新适配脚本，再签名校验。输出为根目录的 `dino-local-native.apk` 和 `.apk.sha256` 文件。原始 APK 保持不变，后续构建无需重复下载或解包。

将生成的 APK 安装到支持 ARMv7 应用的 Android 测试设备或模拟器。使用自己的 ADB 地址：

```powershell
adb -s <设备地址> install -r dino-local-native.apk
```

覆盖安装要求新旧应用签名一致。请使用独立测试环境，并保留自己的签名密钥。仓库中的 `Launch-Native.ps1` 和启动器包含原维护机的路径与设备设置，使用前需按本机环境调整。

研究原版字节码或运行部分检查脚本时，还需要生成 `analysis/decoded`：

```powershell
python -m pip install pyelftools
python analysis/decode_scripts.py
```

具体检查脚本可能依赖本机资源，请按任务入口核对。上述指引根据现有脚本核对，尚未在全新机器上完成从克隆到安装的完整验证。

## 文档与版本管理

- AI 接手：[任务索引](docs/ai/index.md)、[当前状态](docs/ai/current-state.md)。
- 原流程操作说明：[LOCAL-NATIVE.md](docs/operations/LOCAL-NATIVE.md)。
- 目录与版本管理：[文件管理说明](docs/ai/file-policy.md)。
- 旧文件路径：[迁移映射](docs/moved-files.json)。
- 过渡实验说明：[历史 README](docs/archive/README-before-organization.md)。

APK、解包资源、工具二进制、签名密钥、存档和日志只保留在本机，不纳入 Git。临时文件放到 `.local/`，交付件放到 `artifacts/`。提交前运行：

```powershell
python tools/repo_index.py --check
```
