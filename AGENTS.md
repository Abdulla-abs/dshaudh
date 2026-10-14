# AI 接手入口

先读 `docs/ai/index.md`（任务路由）和 `docs/ai/current-state.md`（当前事实）。按任务只读对应文档及函数；不要默认通读历史交接或枚举整个目录。

每轮先限定一个问题。函数或 RPC 查询优先用 `python tools/ai_lookup.py --find <名称> --count 15`；按结果读 `--read <路径> --line <行号> --count 60`。输出最多 120 行，长 JSON 按字段提取。只有新增修改、失败或未解疑点才扩大测试范围。

## 强制边界

- 保留原客户端逻辑、界面和流程，只替换服务器依赖。禁止另建主城、手摆初始建筑或重写已有玩法。
- 当前暂停逐个扩玩法，优先字节码可读性、RPC 契约和敌袭自然结束到剧情续接。
- 历史“已修”不等于验收。分别标注原代码证据、运行时观察、推断、用户确认和待复测。
- 同一假设失败两次，改用反汇编或参数探针。不要再猜接口参数。
- 专用逍遥实例为 1，ADB 为 `127.0.0.1:21513`；实例 0 属于用户已有环境。

## 文件写入规则（全项目适用）

- 新源码与检查脚本放 `analysis/`；仓库维护工具放 `tools/`。
- 新 RPC 契约只放 `analysis/rpc-contracts/`；经筛选的短证据放 `analysis/evidence/`。
- 文档放 `docs/` 对应分类；当前结论更新 `docs/ai/current-state.md`，任务入口更新 `docs/ai/index.md`。
- AI 临时数据、日志、截图、设备存档、试验输出只放 `.local/<任务名>/`。
- 新解包、反汇编批量输出和构建产物放 `.local/`；新交付件放 `artifacts/`，新原始输入放 `inputs/`。
- 现有构建工具依赖根目录 APK、`analysis/apk`、`analysis/decoded`、`analysis/disasm` 等路径。这些属于兼容例外；保留既有调用，不把例外用于新脚本。
- 不在根目录或 `analysis/` 新增零散数据。不要删除旧证据或设备存档以“清理”目录。
- Git 仅收有效源码、文档、契约和小型证据；不提交 APK、工具二进制、解包资源、密钥、存档、缓存及大文件。执行 `python tools/repo_index.py --check` 检查暂存区。

## 查询方法

先用 `rg -n <关键字> docs/ai analysis/rpc-contracts`，然后在具体源码或专题文档内搜索。`docs/ai/files.tsv` 提供受版本管理文件的大小和分类，`docs/ai/headings.tsv` 提供文档标题及行号。

主脚本函数位置见 `docs/ai/functions.tsv`，RPC 位置见 `docs/ai/rpc-locations.tsv`；接口到契约和检查脚本见 `docs/ai/rpc-map.md`。待验证项见 `docs/ai/pending.md`，短证据入口见 `analysis/evidence/native-findings.md`。不要把文本引用索引当成调用图或字段证明。

完成问题后按 `docs/ai/handoff-template.md` 更新短结论；重复日志放 `.local/`，保留证据路径。若改变当前事实，同时更新 current-state，避免下轮重新推断。

更新索引：`python tools/repo_index.py`。仅在需要本地未跟踪文件清单时执行 `python tools/repo_index.py --inventory`，输出到 `.local/index/`。
