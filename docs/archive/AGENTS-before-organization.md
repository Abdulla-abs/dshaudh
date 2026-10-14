# 接手导航

本项目恢复《口袋侏罗纪》的本地运行。开始工作时，先阅读根目录的 `HANDOFF.md`、`TECHNICAL-NOTES.md`、原流程适配笔记 **`NATIVE-ADAPTER-NOTES.md`**，以及本轮开发上下文汇总 **`NATIVE-DEV-CONTEXT.md`**。`README.md` 提供文件入口；操作说明见 `LOCAL-NATIVE.md`。

接手首建后的敌袭、空村、敌军或引导续接问题，还须阅读 [NATIVE-BATTLE-HANDOFF.md](../native/NATIVE-BATTLE-HANDOFF.md)。最新（2026-10-14）：村庄、敌军、去重和龙弹堡主动攻击均已获用户确认。龙弹堡根因为缺少 `replay.seed`。自然结算：已确认勿清 `inReplayMode`（否则偏离 `onReplayEnd`→`rpc_s_finish_enemy_attack_replay`）；轨迹键 `dino.local.native.settle.trace`。单人地图全灰：`availableStages` 须为对象且 `20001` 后解锁第 1 关（用户已确认）。战役进击已确认；结算已接 complete→MatchEnd→home（星级/`pve_next_stage` 解锁，待复测）。剧情续接与强杀续读仍待用户复测。历史“已修”标题不能当作验收结果。

## 当前工程路线（2026-10-14 起）

**暂停逐个扩玩法。** 先做「字节码可读性 + RPC 数据契约」，再修敌袭自然结束→剧情续接闭环。主方向仍只替换服务器依赖。入口：[BYTECODE-READABILITY.md](../native/BYTECODE-READABILITY.md)；战斗结算契约：[analysis/rpc-contracts/battle-finish.json](../../analysis/rpc-contracts/battle-finish.json)。引擎为 Cocos SpiderMonkey **v22**（头 `51 c0 73 b9` / `0xb973c051`）。解析：`python analysis/disasm_one.py Client/GameControllerBattle`。

## 当前方向（强制）

**保留原客户端的程序逻辑、界面和流程，只把失效的服务器依赖替换为本地数据与本地回执。禁止另建主城场景、手工设定初始建筑或重写已有玩法。**

此前 `dino-local-*.apk` 系列用独立预览场景与本地面板验证了资源、占地和部分数值，属于过渡实验。后续交付须走原版 `ClientPlayer` → `rpc_c_start_game` / `changeStageAndInit` → `GameControllerBuild.initLevelFromData` 链路；首次进入由原程序按服务器下发形态的数据创建主城、剧情与教程，不能拿八座测试建筑充当初始城池。

截至 2026 年 10 月 12 日，已验证原版入口、场景预览、建筑存档、采集、部分升级、仓库容量，以及主城/生产/仓库四级与龙英巢/驯龙场三级。另已交付五级、满级映射包、养成容量只读展示包、驯龙场本地训练队列包（114 一系）、本地新建日光井包（存档 `v10`）、本地新建日光井+龙银矿包（存档 `v11`），以及主城界面/建筑比例/占地包（存档 `v12`）。上述包仍可作为数值与 UI 对照，不再作为主路径扩展。

原始输入为 `koudaizhuluoji.apk`。原流程本地适配实验包为 `dino-local-native.apk`（入口 `启动原流程本地适配.cmd`）；上一过渡交付仍为 `dino-local-cityui.apk`。协议与缺口见 `analysis/native-init-protocol.json`、`LOCAL-NATIVE.md`。

截至 2026-10-13，`dino-local-native` 已能走通 `rpc_c_start_game`→主城推断建筑、HUD 昵称/`exp`、强杀续读 `dino.local.native.v1`，以及 Rookie 开场引导。驯龙场灰确认属原版 `rely_base_lv=2`，不要强开。新账号初始建筑：`20101`/`20601`/`21201`/`20201`/`20401`（**无** `207` 驯龙场）；`first_movie_played=0` + 空 `user_config`；起步资源钻石150/龙币5000/日光5000/英灵50（龙币日光须写入 ResourceHolder）。建造 `rpc_s_build` 含 `cid`；宝石加速须走 `finishViaBuilder`（勿只调缺失的 `server_build_complete`）。细节见 `NATIVE-DEV-CONTEXT.md`。

本机专用逍遥实例为 1，ADB 地址为 `127.0.0.1:21513`，渲染模式为 DirectX。实例 0 是用户已有环境。调试器与交付启动库的差异、研究脚本重复执行的问题，见技术笔记。


有更好的方案。**我建议先暂停逐个补玩法，投入一轮“恢复字节码可读性＋建立 RPC 数据契约”。主方向仍保留原客户端，只替换服务器依赖。** 换模型能改善效率，但当前更大的消耗来自证据不足后反复试错。

读完交接记录后，最典型的两个例子是：

- 空村修了多轮，最终才确认 `_createBattleUnitWhenInit(unitData, client)` 必须传第二个参数。
- 龙弹堡反复加唤醒补丁，最终根因只是缺少 `replay.seed`，随机数和索敌计时因此变成 `NaN`。

这些信息本来应先从函数调用和字段读取中取得。[技术笔记](F:/kdzlj/TECHNICAL-NOTES.md:308)也明确：318 个脚本已经解密，但拿到的是 SpiderMonkey 字节码；字符串提取结果不能表达参数和分支。

**更省试错的工程路线**

1. **先准确识别 SpiderMonkey 版本。** 当前文件头为 `51 c0 73 b9`。确定对应的 XDR 格式和 opcode，才能可靠反汇编。
2. **只恢复关键函数，不追求全量源码。** 优先处理 `ClientPlayer`、主城/战斗 `initLevelFromData`、战斗结束、Rookie 续接、建造回执。目标是拿到“读取哪些字段、调用谁、什么条件返回”。
3. **建立 RPC 契约表。** 每个接口记录请求参数、回执字段、类型、默认值和证据来源。区分“原代码证明”“运行时观测”“暂时推断”；缺字段在进入原引擎前直接报出完整路径。
4. **把本地回执集中到一个适配边界。** 用统一存档处理资源、建筑、施工和引导进度，再生成原客户端需要的回执。减少散落在控制器中的兜底和重复修复。
5. **先完成一个闭环。** 当前优先验“敌袭自然结束→返回主城→剧情续接→强杀续读”，通过后再扩训练、英雄等功能。

这里还有一个必须接受的边界：**客户端可以帮助恢复协议和客户端规则，但不能凭空恢复只存在于服务器上的官方初始坐标、真实敌袭阵容和完整回放。** 这些应寻找旧缓存、抓包或历史数据；找不到时保留明确标注的兼容数据，避免反复猜“官方原值”。

**查到的开源工具，哪些值得用**

| 项目 | 对当前工程的用途 | 我的判断 |
|---|---|---|
| [Ghidra](https://github.com/NationalSecurityAgency/ghidra) | 分析原生 `.so`，定位 XDR 解码、字节码结构和引擎实现 | 通用成熟工具，适合解决版本与结构问题 |
| [Frida](https://github.com/frida/frida) | 动态记录原生函数参数、返回值和调用链 | 有帮助；已有研究桥能完成的探针可以继续复用 |
| [jsc-decompile-mozjs-34](https://github.com/irelance/jsc-decompile-mozjs-34) | SpiderMonkey 字节码解码/反编译参考 | 针对性强，但不保证兼容本包 |
| [spidermonkey-dumper](https://github.com/zboralski/spidermonkey-dumper) | SpiderMonkey 33 反汇编及控制流输出 | 小众项目，适合参考解析器，需先验证版本 |
| [JADX](https://github.com/skylot/jadx)、[Apktool](https://github.com/iBotPeaches/Apktool) | Java/DEX 分析、资源和 smali 修改、重打包 | 继续用于 Android 外壳，无法直接解决这些 JS 字节码 |

**关键发现：现成的两个 SpiderMonkey 工具都不能直接认定适用。** mozjs-34 项目列出的 33/34 文件头分别是 `2c c0 73 b9`、`28 c0 73 b9`，与你的 `51 c0 73 b9` 不同；项目还明确说明反编译不完整。另一个 dumper 当前主要支持 33，其“源码恢复”部分依赖 LLM，也会继续消耗 token。[版本及限制说明](https://github.com/irelance/jsc-decompile-mozjs-34#3-how-to-guess-the-bytecode-version)、[dumper 说明](https://github.com/zboralski/spidermonkey-dumper#smdis)。

所以我的优先级是：**原引擎版本定位 → 匹配反汇编 → 少量运行时探针交叉验证**。先得到可靠指令和字段访问，比让模型直接生成整份伪源码更有价值。本轮已核对工具文档，尚未用本包实测兼容性。

**模型怎么选**

我的项目建议如下，并非已在本工程上测出的排名：

| 工作 | 建议模型与推理强度 |
|---|---|
| 日常适配、探针、根据确定证据修复 | **GPT-6.1 Sol，Medium** |
| XDR/opcode、复杂状态机、长期卡住的根因 | **GPT-6 Astra，High**，限定具体问题 |
| 字段整理、日志归类、明确的小修改 | **GPT-6 Luna，Low/Medium** |

如果只选一个，就用 **GPT-6.1 Sol + Medium**。官方目前将它定位于兼顾复杂任务、时间和成本；Astra 用于更深分析，Luna 用于范围清楚的任务。[官方模型选择说明](https://developers.openai.com/api/docs/guides/model-selection)。具体账户额度消耗不能直接按 API 单价推算。

最有效的节省方式是：**让模型解释工具已经提取的证据，而不是让模型承担数据猜测。** 每轮只读当前模块的短交接和相关函数；每次修复必须新增证据；同一假设失败两次就改用反汇编或调用探针。下一笔投入应以“关键函数可读、RPC 字段有依据”为交付目标，而不是再做一版未经原引擎验证的补丁 APK。

**下一步最好先确认 SpiderMonkey 的准确版本，并试着可靠反汇编一个关键脚本。** 暂时停止扩玩法，也不再尝试恢复全部 318 个脚本。

先做一个范围明确的验证：

1. 从原 APK 的引擎 `.so`、XDR 文件头和解码函数确定字节码版本。
2. 检查现成工具能否匹配；不匹配时，只适配必要的解析部分。
3. 以 `GameControllerBattle` 为样本，提取自然结算、结束回执和返回主城的调用条件。
4. 用原引擎文本探针对照，确认结果可靠后，再修“敌袭结束→剧情续接”。

**这一轮的交付应是版本证据、可重复运行的解析命令，以及关键函数的字段和调用清单。** 不要求立刻出新 APK。

如果反汇编适配成本过高，就及时转向现有研究桥，专门记录上述结算链路的参数与状态变化。这样无论哪条路线成功，都能减少下一次修复的猜测。
