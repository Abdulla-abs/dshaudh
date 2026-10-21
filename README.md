# 客户端本地适配

保留原客户端，只将失效服务器依赖替换为本地数据和回执。

- AI 接手：[任务索引](docs/ai/index.md)、[当前状态](docs/ai/current-state.md)。
- 运行原流程：根目录 `启动原流程本地适配.cmd`，说明见 [LOCAL-NATIVE.md](docs/operations/LOCAL-NATIVE.md)。
- 目录与版本管理：[文件管理说明](docs/ai/file-policy.md)。
- 旧文件路径：[迁移映射](docs/moved-files.json)。
- 过渡实验说明：[历史 README](docs/archive/README-before-organization.md)。

源码和构建路径保留原位置。APK、解包资源及本机工具不进入 Git，也没有删除。仓库不包含完整运行资源；换机器须自行提供原 APK、Android SDK、apktool 和解包工作区。
