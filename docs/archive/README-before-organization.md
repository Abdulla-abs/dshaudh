# 口袋侏罗纪本地恢复

当前方向：保留原客户端逻辑与界面，只用本地数据/回执替换失效服务器依赖；禁止另建主城或手摆初始城。协议研究见 `analysis/native-init-protocol.json`。

主路径实验包：双击 `启动原流程本地适配.cmd`。走原版 `rpc_c_start_game`，存档 `dino.local.native.v1`。操作见 [LOCAL-NATIVE.md](../operations/LOCAL-NATIVE.md)；**运行时踩坑见 [NATIVE-ADAPTER-NOTES.md](../native/NATIVE-ADAPTER-NOTES.md)**；**本轮 AI 开发上下文（引导/资源/建造/宝石加速）见 [NATIVE-DEV-CONTEXT.md](../native/NATIVE-DEV-CONTEXT.md)**。包为 `dino-local-native.apk`。

最新进度（2026-10-14）：用户已确认入侵战斗的村庄、敌军、打爆去重和龙弹堡主动攻击恢复。龙弹堡根因为缺少 `replay.seed`，修正后沿用原版战斗 AI。自然结算与剧情续接仍待单独验收，详见 [NATIVE-BATTLE-HANDOFF.md](../native/NATIVE-BATTLE-HANDOFF.md)。

上一测试版（过渡）：双击 `启动本地主城界面测试.cmd`。独立预览场景 + 本地面板，包为 `dino-local-cityui.apk`，存档 `dino.local.city.v12`，说明见 [LOCAL-CITYUI.md](../operations/LOCAL-CITYUI.md)。该路线不再作为主路径扩展。

上一版生产建筑新建：双击 `启动本地生产建筑新建测试.cmd`。主城二级后可点“建造生产”放置日光井或龙银矿。包为 `dino-local-mine.apk`，说明见 [LOCAL-MINE.md](../operations/LOCAL-MINE.md)。

上一版仅日光井新建：双击 `启动本地新建建筑测试.cmd`。包为 `dino-local-construct.apk`，说明见 [LOCAL-CONSTRUCT.md](../operations/LOCAL-CONSTRUCT.md)。

训练队列：双击 `启动本地训练队列测试.cmd`。选中驯龙场后，底部“训练士兵”按原表扣费并倒计时，结束后自动入住 1 名士兵。包为 `dino-local-train.apk`，说明见 [LOCAL-TRAIN.md](../operations/LOCAL-TRAIN.md)。

养成容量：双击 `启动本地养成容量测试.cmd`。选择驯龙场或龙英巢可查看蛋/兵容量与出战栏等只读信息。包为 `dino-local-cultivate.apk`，说明见 [LOCAL-CULTIVATE.md](../operations/LOCAL-CULTIVATE.md)。

满级升级：双击 `启动本地满级升级测试.cmd`。按原表接满升级：主城/生产/仓库/龙英巢到 10 级，驯龙场到 8 级；双仓满级后总容量各约 2520000。包为 `dino-local-max.apk`，说明见 [LOCAL-MAX.md](../operations/LOCAL-MAX.md)。

五级升级：双击 `启动本地五级升级测试.cmd`。主城/生产/仓库到五级，龙英巢与驯龙场到四级；双仓满级后总容量各 80000。包为 `dino-local-level5.apk`，说明见 [LOCAL-LEVEL5.md](../operations/LOCAL-LEVEL5.md)。

四级升级：双击 `启动本地四级升级测试.cmd`。主城/生产/仓库到四级，龙英巢与驯龙场到三级；双仓满级后总容量各 60000。包为 `dino-local-level4.apk`，说明见 [LOCAL-LEVEL4.md](../operations/LOCAL-LEVEL4.md)。

三级升级：双击 `启动本地三级升级测试.cmd`。主城/生产/仓库可升到三级，龙英巢与驯龙场可升到二级；两座仓库都到三级后总容量各 45000。包为 `dino-local-level3.apk`，说明见 [LOCAL-LEVEL3.md](../operations/LOCAL-LEVEL3.md)。

容量测试：双击 `启动本地容量测试.cmd`。日光皿和龙币库可升到二级，仓库容量从各 25000 升到各 35000。包为 `dino-local-capacity.apk`，说明见 [LOCAL-CAPACITY.md](../operations/LOCAL-CAPACITY.md)。

上一版升级测试：双击 `启动本地升级测试.cmd`。选择龙首之城、日光井或龙银矿，点击“升级建筑”，确认费用后再次点击才开始。升级自动保存，关闭游戏后也会继续计时。包为 `dino-local-upgrade.apk`，说明见 [LOCAL-UPGRADE.md](../operations/LOCAL-UPGRADE.md)。

本版支持这三座建筑升到二级，并保留原版加载、建筑移动和资源采集。二级生产建筑每小时产出 400 点资源。完整主城、建造、养成和战斗仍未恢复。以下保留前期版本的入口与记录。

采集测试版：双击 `启动本地采集测试.cmd`。进入后选择日光井或龙银矿，点击底部“采集资源”。生产速度为每小时 200 点，资源余额自动保存，关闭游戏期间也会累计产量。新包为 `dino-local-economy.apk`。

本版保留原版加载过程和建筑移动，并复制旧版建筑位置。生产和容量计算复用原版组件，本地接口处理采集和存档。完整主城、资源消费、建造、升级、养成和战斗仍未恢复。

新增本地建筑测试版：双击 `启动本地建筑测试.cmd`。进入后选择建筑，点击“移动建筑”，再点击地图空位。位置自动保存，关闭游戏后仍可恢复。新包为 `dino-local-state.apk`，保留原版加载流程。

这次新增建筑位置存档。资源生产、建造、升级、养成和战斗仍未恢复。详见 [HANDOFF.md](../history/HANDOFF.md)。

## 接手入口

先读 [HANDOFF.md](../history/HANDOFF.md)、[TECHNICAL-NOTES.md](../history/TECHNICAL-NOTES.md)，做原流程适配时再读 [NATIVE-ADAPTER-NOTES.md](../native/NATIVE-ADAPTER-NOTES.md)。

当前工程路线（暂停扩玩法，先恢复关键字节码可读性与 RPC 契约）：[BYTECODE-READABILITY.md](../native/BYTECODE-READABILITY.md)。战斗结算字段/调用清单见 [analysis/rpc-contracts/battle-finish.json](../../analysis/rpc-contracts/battle-finish.json)。

首建后的敌袭适配另读 [NATIVE-BATTLE-HANDOFF.md](../native/NATIVE-BATTLE-HANDOFF.md)，其中汇总接口实参、共享控件初始化、出兵失败、提前结算和引导进度丢失的原因，以及最新待验收项。

场景预览版可显示原版地图、8 座建筑及部分动画，支持拖动、缩放、复位、查看建筑编号和返回。最新升级测试版还支持保存、移动、采集和部分建筑升级。

**完整主城、建造、养成和战斗尚未恢复。** 初始布局是手工编排的测试布局。采集和部分升级由本地接口处理，尚未恢复完整原版流程。

## 运行与文件

恢复原版加载过程的新版本：双击 `启动原版加载预览.cmd`。点击“进入游戏”后，先显示原版转场、随机提示图和进度条，再进入本地预览。新包为 `dino-local-loading.apk`，旧预览包保留用于回退。完整玩法仍未恢复。

本机双击 `启动场景预览.cmd`。脚本会重启专用逍遥实例 1，设置 DirectX 渲染，安装 `dino-local-preview.apk` 并启动。进入原版入口后，点击“进入游戏”。

| 文件 | 用途 |
| --- | --- |
| `koudaizhuluoji.apk` | 原始安装包，恢复工作的输入 |
| `dino-local-native.apk` | 原流程本地适配（主路径） |
| `NATIVE-ADAPTER-NOTES.md` | 适配运行时踩坑、禁止项、调试（给后续 AI） |
| `LOCAL-NATIVE.md` | 原流程适配操作与已验证清单 |
| `dino-local-cityui.apk` | 过渡：主城界面 / 比例 / 占地对照包 |
| `LOCAL-CITYUI.md` | 主城界面说明和验证记录 |
| `dino-local-mine.apk` | 上一版生产建筑新建版（日光井+龙银矿） |
| `LOCAL-MINE.md` | 生产建筑新建说明和验证记录 |
| `dino-local-construct.apk` | 上一版仅日光井新建版 |
| `LOCAL-CONSTRUCT.md` | 日光井新建说明和验证记录 |
| `dino-local-train.apk` | 上一版训练队列版 |
| `LOCAL-TRAIN.md` | 训练队列说明和验证记录 |
| `dino-local-cultivate.apk` | 上一版养成容量展示版 |
| `dino-local-preview.apk` | 最早的场景预览版 |
| `dino-local-startup.apk` | 上一阶段的入口测试版 |
| `LOCAL-PREVIEW.md` | 预览版说明和验证记录 |
| `LOCAL-STARTUP.md` | 上一阶段记录，渲染问题以最新接手文档为准 |
| `HANDOFF-BASELINE.json` | 本次交接时的文件哈希、大小和 APK 内容一致性检查 |
| `handoff/verified-source-2026-10-12.zip` | 已验证交付的源码、smali、dex 和启动库快照 |
| `analysis/local-preview-verified.png` | 最终预览截图 |

新会话可直接使用以下请求：

> 请先阅读 F:\kdzlj\AGENTS.md、F:\kdzlj\NATIVE-ADAPTER-NOTES.md、F:\kdzlj\HANDOFF.md 和 F:\kdzlj\TECHNICAL-NOTES.md。主路径是 dino-local-native（原版 rpc_c_start_game），不要另建主城或用八座测试建筑当初始城。按 NATIVE-ADAPTER-NOTES 里的禁止项继续补回执与 Rookie。
