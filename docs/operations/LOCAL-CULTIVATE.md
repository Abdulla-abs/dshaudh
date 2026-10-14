# 本地养成容量测试版

双击 `启动本地养成容量测试.cmd`，再点击原版入口的“进入游戏”。本版在满级升级包之上，增加驯龙场与龙英巢的只读容量展示。

| 建筑 | 选择后底部显示 |
| --- | --- |
| 驯龙场 | 蛋容量、兵容量、蛋时；二级起另显示村民容量 |
| 龙英巢 | 出战栏、英雄等级上限（按主城等级）、本建筑经验 |

容量数值来自原表 `data.unit_main` 与 `data.hero_number`。仍支持移动、采集和满级升级映射。存档键仍为 `dino.local.city.v8`。

本版没有接入训练队列、英雄列表、`SoldierTrainer.train()` 或服务器回执。完整主城、新建建筑和战斗仍未恢复。

## 开发入口

```powershell
python analysis/make_cultivate.py
python analysis/build_cultivate.py
```

交付脚本为 `analysis/cultivate_boot.js`。研究摘要为 `analysis/cultivate-native-configs.json`。验证记录为 `analysis/cultivate-validation.json`，截图为 `analysis/cultivate-verified-*.png`。
