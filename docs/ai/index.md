# 按任务查询

每轮先读 [当前状态](current-state.md)，再选一行。先搜索标题和关键字，仅读取有关章节。历史文档用于核对证据，不要求每次全文加载。

| 任务 | 说明入口 | 代码和数据 |
|---|---|---|
| 字节码版本、函数读取与调用 | [可读性说明](../native/BYTECODE-READABILITY.md) | `analysis/disasm_one.py`、`tools/jsc_decompiler/` |
| 敌袭、自然结束、剧情续接 | [战斗交接](../native/NATIVE-BATTLE-HANDOFF.md) | `analysis/native_boot.js`、`analysis/rpc-contracts/battle-finish.json`、`analysis/check_native_raid_end.cjs` |
| 建造、资源、引导、强杀续读 | [开发上下文](../native/NATIVE-DEV-CONTEXT.md) | `analysis/native_boot.js`、`analysis/rpc-contracts/building-init.json`、`analysis/check_native_building_contract.cjs` |
| 原流程适配陷阱 | [适配笔记](../native/NATIVE-ADAPTER-NOTES.md) | `analysis/native-init-protocol.json` |
| 战役进场和结算 | [工作历史](../history/HANDOFF.md)（搜索 PVE） | `analysis/rpc-contracts/pve-enter.json`、`pve-settle.json`、`analysis/check_native_pve_*.cjs` |
| 构建、启动、设备 | [操作说明](../operations/LOCAL-NATIVE.md)、[技术笔记](../history/TECHNICAL-NOTES.md)（按标题查询） | `analysis/build_native.py`、`analysis/local_hook.cpp`、`Launch-Native.ps1` |
| 历史预览实验 | `docs/operations/LOCAL-*.md`、`docs/baselines/` | `analysis/build_*.py`、`*_boot.js` |
| 文件存放、Git、索引 | [文件规则](file-policy.md) | `tools/repo_index.py`、`.gitignore` |

查询示例：`rg -n 'onReplayEnd|inReplayMode' analysis/native_boot.js analysis/rpc-contracts docs/native/NATIVE-BATTLE-HANDOFF.md`。

索引不是验收报告。以当前状态、具体契约的证据和用户复测结果为准。
