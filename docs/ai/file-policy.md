# 文件与版本管理

## 分类

| 位置 | 内容 | Git |
|---|---|---|
| `docs/ai/` | 短入口、状态、文件与标题索引 | 收录 |
| `docs/native/` | 原流程专题笔记 | 收录 |
| `docs/operations/` | 各版本运行说明 | 收录 |
| `docs/history/`、`docs/archive/` | 长期历史与整理前入口 | 收录，按需查询 |
| `docs/baselines/` | 小型基线 JSON | 收录 |
| `analysis/` | 既有源码、探针、检查脚本 | 按白名单收录 |
| `analysis/rpc-contracts/`、`analysis/evidence/` | 契约与精选证据 | 收录，单文件上限 1 MiB |
| `tools/jsc_decompiler/` | 解析器源码及许可证 | 收录源码，排除内层 `.git` |
| `.local/` | AI 临时数据、截图、日志、设备存档 | 忽略 |
| `inputs/`、`artifacts/` | 新原始输入与交付件 | 忽略 |
| 旧 APK、解包目录、工具安装包、handoff ZIP | 本机兼容资源与备份 | 忽略，保留本机 |

现有脚本与启动器依赖固定路径，因此 APK、源码和解包工作区保留位置。根目录文档已归类，截图已移入 `.local/screenshots/root-legacy/`。迁移表见 `docs/moved-files.json`。

## 查询和维护

`python tools/repo_index.py` 根据 Git 索引生成 `files.tsv` 和 `headings.tsv`。文件索引只有路径、分类和大小，不装载正文。标题索引给出原文行号。先查索引，再用 `rg -n` 查询具体文件。

`python tools/repo_index.py --inventory` 生成本机全量清单 `.local/index/inventory.tsv`，供查找未跟踪的旧资源。默认索引不扫描这些目录。

提交前执行 `python tools/repo_index.py --check`。超过 1 MiB、二进制产物、缓存、密钥和备份脚本会报错。新增路径先修改白名单，不能直接 `git add -f` 绕过策略。

Git 忽略规则负责筛选，不是安全沙箱。文件位置规则约束 AI 行为；本机权限没有被修改。

## 换机器恢复

本仓库提供维护源码和补丁，不提供完整原游戏或工具安装包。准备原 `koudaizhuluoji.apk`、Android SDK、Java 和 `tools/apktool.jar`；按技术笔记建立 `analysis/apk` 工作区，再覆盖版本管理中的 Manifest 和网易 smali 补丁。`analysis/decoded` 由解码脚本重新生成。构建前检查本机工具路径，签名密钥由本机另行准备。
