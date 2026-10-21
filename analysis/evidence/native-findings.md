# 原流程短证据目录

原始记录保留原位置。本文件只提供结论和来源，不重复日志正文。

| 问题 | 确定结论 | 证据入口 | 验收边界 |
|---|---|---|---|
| 知识古树研究只有动画 | 原研究点和建筑计时未保存，研究和加速请求未接入，缺自然完成回执 | [研究证据](knowledge-tree.md)；`knowledge-tree.json` | 950 条配置离线通过；已安装实例 1，游戏研究和重登待复测 |
| 商店建筑确认后卡死 | 原版空闲 SID 查询误返玩家，旧查重无限循环；现仅将编号匹配的对象视为占用 | [建造确认卡死](building-confirm-freeze.md) | 离线及设备购买、施工重登通过；用户待复测 |
| 主城建筑及资源收集静音 | 旧 `quietSound` 永久屏蔽播放；现恢复原声并单独捕获异常 | [主城声音](home-sound.md)；`check_native_sound.cjs` | 离线通过，已安装且设备点击、收集正常；实际听感待用户确认 |
| 炼金碎片合成角色失败 | 本地合成只接受道具奖励；已按原表接入 14 种固定英雄配方 | [角色合成](hero-compose.md)；`hero-compose.json` | 离线通过，已安装实例 1；实际合成和重登待复测 |
| 转生道具合成按钮变灰 | 设备记录合成 RPC 未处理；现按原表保存扣材料和成品，并回原版合成回执 | [合成证据](item-compose.md) | 离线通过；已安装实例 1，实际合成待复测 |
| 小绿龙入侵开始无效 | 点开始缺 `rpc_c_start_wave`；已按 `data.invasion` 接进场／波次／结算／回城 | [入侵证据](invasion-start.md)；`check_native_invasion.cjs` | 出兵已确认 |
| 入侵结算回城重播解锁指引 | `206500` 为 click:1，不持久 2065；进场／回城写 rookie2 bit3 | [解锁指引重播](invasion-unlock-guide-replay.md) | 离线 PASS；待覆盖安装复测 |
| 战斗血条反色 | 非回放原版读取 `G_Player.faction`，适配层会把玩家改绑防守方；现按入侵／出征视角校正友敌，保留友军随血量变色及敌军紫色 | [血条证据](battle-life-color.md)；`check_native_battle_life_color.cjs` | 原函数定向检查通过；恢复渐变版已覆盖安装，各模式实际画面待复测 |
| 龙弹堡驻守进战后消失 | 未接 `rpc_s_set_hero_defense`，`did` 未落盘；进战斗回城重建后丢失 | [驻守证据](hero-defense-garrison.md)；`hero-defense.json` | 离线 PASS；待覆盖安装复测 |
| 入侵缺主城驻守英雄 | 入侵只建 `self.units`；须注入驻守并 remap `did` | [入侵驻守](invasion-garrison.md)；`invasion.json` | 离线 PASS；待覆盖安装复测 |
| 龙弹堡不开火 | 必须提供 `replay.seed`，外层 seed 不足 | `analysis/tower-seed-only-result-1014.json`；战斗交接的种子章节 | 用户确认主动攻击；记录伤害 270 |
| 建筑显示放置按钮 | 原版读取 `bs`、`bt`；缺 bs 默认待放置 | `analysis/rpc-contracts/building-init.json`；`check_native_building_contract.cjs` | 用户确认初始矿显示；移除绕行后的完整敌袭待复测 |
| 自然结算不续接 | 保留 `inReplayMode`，原路径经 `onReplayEnd` 请求结束回放 | `analysis/rpc-contracts/battle-finish.json`；`analysis/raid-end-before-fix.json`、`raid-end-after-fix.json` | 离线检查通过；自然结束与后续剧情待用户复测 |
| PVE 进场与结算 | 直播进场 replay 为 falsy；结束回执进入 MatchEnd，再回主城 | `analysis/rpc-contracts/pve-enter.json`、`pve-settle.json` | 进击用户确认；结算星级与解锁待复测 |
| 荒野探险动画后卡死／按钮变灰 | 缺进入回执；正确链路 PVE→胜利→CAPTURE；finish 前写 IDLE 会卡按钮 | `wild-adventure.json`；`check_native_wild_adventure.cjs` | 离线 PASS；设备待复测完整链路 |
| 荒野探险本地掉落 | 包无精确掉率；按网络资料接 5%／0.5%／30 保底／付费 +3% | `wild-adventure-loot.md`；`adventureLootPolicy` | 离线 PASS；已覆盖安装待复测 |

需要深入时先查契约的 evidence、validation 或 artifacts 字段。单行 JSON 用字段提取，不要直接输出整行运行日志。
