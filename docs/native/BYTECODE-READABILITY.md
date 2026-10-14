# 字节码可读性与 RPC 契约（本轮工程路线）

**状态（2026-10-14）**：已暂停逐个补玩法扩面。主方向不变——保留原客户端，只替换服务器依赖。本轮交付是版本证据、可重复解析命令、关键函数字段/调用清单；**不出新 APK**。

## 为何换路线

空村与龙弹堡的根因（缺 `_createBattleUnitWhenInit` 第二参数、缺 `replay.seed`）本可从函数形参与字段读取直接读出。字符串提取无法表达参数与分支；继续无证据试错成本高于先恢复关键脚本可读性。

## 版本证据（已确认）

| 证据 | 值 |
| --- | --- |
| 解密后 `.jsc` 文件头 | `51 c0 73 b9` → LE `0xb973c051` |
| Mozilla 公式 | `XDR_BYTECODE_VERSION = 0xb973c0de - subtrahend` |
| subtrahend | **141**（`0xb973c0de - 0xb973c051`） |
| 上游匹配 | [cocos2d/Spidermonkey `v22`](https://github.com/cocos2d/Spidermonkey/blob/v22/js/src/vm/Xdr.h)：`0xb973c0de - 141` |
| 对照 | v21=`-137`；v25=`-150`；v33=`-178`（头 `2c c0 73 b9`） |
| 引擎 `.so` | `libcocos2djs.so` 含 `/Users/cocos/Spidermonkey/js/src/jsinfer.cpp`；魔数 `0xb973c051` 出现在二进制内 |

**结论**：本包脚本是 **Cocos 定制 SpiderMonkey v22** XDR，不是 SM33/34。  
`jsc-decompile-mozjs-34`（头 `2c/28 c0 73 b9`）与 `spidermonkey-dumper`（主攻 33）**不能直接认定适用**。  
可用工具：[byzp/jsc_decompiler](https://github.com/byzp/jsc_decompiler)（已 vendored 到 `tools/jsc_decompiler`），其 `0xB973C051` 解析器与本包匹配。仓库注释里写的 “MozJS34 variant” 不准确，以本页 subtrahend/v22 证据为准。

## 可重复命令

先确保已解密（若 `analysis/decoded/script/**/*.jsc` 已存在可跳过）：

```powershell
python F:\kdzlj\analysis\decode_scripts.py
```

反汇编 / 反编译单文件（推荐封装）：

```powershell
# 反汇编 → analysis/disasm/<name>.disasm.txt
python F:\kdzlj\analysis\disasm_one.py Client/GameControllerBattle

# 伪 JS → analysis/disasm/<name>.decompiled.js
python F:\kdzlj\analysis\disasm_one.py Client/GameControllerBattle --mode decompile

# 伪 JS + 操作码注释（体积大）
python F:\kdzlj\analysis\disasm_one.py Client/GameControllerBattle --mode decompile --dump-bytecode
```

等效直接调用：

```powershell
python F:\kdzlj\tools\jsc_decompiler\cli.py --disasm F:\kdzlj\analysis\decoded\script\Client\GameControllerBattle.jsc F:\kdzlj\analysis\disasm\GameControllerBattle.disasm.txt
python F:\kdzlj\tools\jsc_decompiler\cli.py F:\kdzlj\analysis\decoded\script\Client\GameControllerBattle.jsc F:\kdzlj\analysis\disasm\GameControllerBattle.decompiled.js
```

本轮样本产物：

- `analysis/disasm/GameControllerBattle.disasm.txt`（约 477KB）
- `analysis/disasm/GameControllerBattle.decompiled.js`（约 632KB，含 bytecode 注释）

**范围**：只解关键脚本，不追求 318 个全量伪源码。伪 JS 有栈机还原噪声，但形参、属性读、`callServer` 名与分支条件可作为证据；重大决策仍应用运行时探针交叉验证。

## 样本：`GameControllerBattle` 结算链路（字节码证明）

详见契约表 [analysis/rpc-contracts/battle-finish.json](../../analysis/rpc-contracts/battle-finish.json)。摘要：

1. **`initLevelFromData(level_data)`**  
   - 有 `level_data.replay` → `setReplayMode(true)`，`setRandomSeed(level_data.replay.seed)`，`setRecords(replay.records)`。  
   - 建房任务：`_createBattleUnitWhenInit(build_datas[id], client)`（**两参数**）。  
   - `client` 来自 `G_PlayerManager.createPlayer(level_data.oppo.player, DEFENDER)`。

2. **自然结束**  
   - `finishBattle()` → `battleFinished=true` → `onBattleFinished()`。  
   - `onBattleFinished` 在非回放且 `first_time_stage===2` 时走 `menu.onPressNextStage()` 并 return；否则 `sendBattleResult()`。

3. **`sendBattleResult()`**  
   - `!isUnitSent` → `rpc_s_leave_battle` `{}`。  
   - 否则按 PVE / GVG / 普通分别 `rpc_s_complete_*`，参数为 `getBattleResultDict()`。

4. **回城**  
   - 回放模式回城：`rpc_s_battle_to_home` `{}`。  
   - `leaveBattle()`：`rpc_s_leave_battle` `{}`。

5. **教程敌袭结算（2026-10-14 字节码 + 轨迹）**  
   - `onReplayEnd`：`first_time_stage===1` → `rpc_s_goto_next_first_stage`；否则 `isEnterEnemyAttackReplay` → `rpc_s_finish_enemy_attack_replay {}`。  
   - `rpc_c_battle_to_home(dict)` → `changeStageAndInit(BUILD, dict, true)`。  
   - **已确认断点**：为开火曾把 `inReplayMode` 置 `false`，结算轨迹全程 `isReplay:false`，偏离原版 `onReplayEnd` 路径。现只解除 oper 门闩并消费 start 记录，**保留** `inReplayMode`。  
   - 文本轨迹键：`dino.local.native.settle.trace`。先验轨迹：`analysis/raid-end-before-fix.json` / `raid-end-after-fix.json`。

## 工程约定（后续）

1. 每个本地回执接口写入 `analysis/rpc-contracts/*.json`，区分 `bytecode` / `runtime` / `inferred`。  
2. 缺字段在进入原引擎前报完整路径，避免再静默 `undefined`→`NaN`。  
3. 同一假设失败两次 → 先反汇编或调用探针，再改适配代码。  
4. 优先闭环：**敌袭自然结束 → 回主城 → 剧情续接 → 强杀续读**；通过后再扩训练/英雄。  
5. 反汇编适配成本过高时，改用现有研究桥只记结算链路参数与状态；两条路都要减少猜测。

## 下一批关键脚本（未做）

按需用 `disasm_one.py` 处理，不要一次全解：

- `Client/ClientUnits/ClientPlayer`（`callServer` / stage / rookie）
- `Client/GameControllerBuild`
- `Client/MenuControllerBattle`
- Rookie / FirstMovie 相关脚本
