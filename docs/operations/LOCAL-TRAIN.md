# 本地训练队列测试版

双击 `启动本地训练队列测试.cmd`，再点击原版入口的“进入游戏”。本版在养成容量包之上，为驯龙场接上本地训练队列。

## 操作

1. 点击驯龙场（207 系）。
2. 底部右侧点击“训练士兵”。
3. 资源足够时立即扣费并开始倒计时；底部状态栏显示“训练中 …级兵 · 剩余 N 秒 · 已入住 x/y”。
4. 倒计时结束后自动入住 1 名士兵，驯龙场上方徽标与状态栏同步更新。

再次点击“训练士兵”时，若蛋位已满、士兵已达上限或资源不足，会给出对应提示且不扣费。

## 规则

| 项目 | 来源 |
| --- | --- |
| 兵种 | 原表 `TRAIN_TYPE_ID_LIST` 中的 114 系（`11401`–`11410`），本次只接这一系 |
| 兵种等级 | 跟随本驯龙场当前等级，如三级驯龙场训练 `11403` |
| 费用 | 原表 `train_cost`，一级 50 起，逐级递增到十级 800；`train_cost_type` 为 1，即消耗日光 |
| 耗时 | 原表 `train_time`，一级 20 秒，逐级递增到十级 120 秒 |
| 蛋位 | 每座驯龙场同时只有 1 个（`TRAIN_MAX_BUFFER`） |
| 士兵上限 | 原表 `item_storage`，一级 10 到八级 45 |
| 离线 | 关闭游戏后按本机时间继续，重启即结算 |

本版仍支持原有移动、采集、满级升级映射与驯龙场/龙英巢容量展示。存档键升级为 `dino.local.city.v9`，建筑结构、资源、生产记录与满级升级状态都从 `v8` 继承。

## 范围说明

训练队列由本地存档处理，**没有**调用原版 `Comp.SoldierTrainer.train()`、`rpc_s_train` 等服务器回执，也没有接入原版 `TrainingInterface.ccbi` 界面、队列动画、加速或取消训练。英雄列表、龙英巢出战阵容与战斗仍未恢复。

`120`/`101`/`102` 三系兵种已在原表中确认，但尚未接入；它们各自带 `need_barrack_lv` 解锁门槛（如 120 系需四级驯龙场）。新建建筑也仍未接入。

## 开发入口

```powershell
python analysis/make_train.py              # 由 cultivate_boot.js 生成 train_boot.js
python analysis/build_train.py             # 构建 dino-local-train.apk
python analysis/prepare_train_validation.py
python analysis/build_train_validation.py  # 构建夹具包 dino-train-validation.apk
python analysis/validate_train.py          # 夹具验证（独立存档键）
python analysis/validate_train_delivery.py # 正常存档验证
```

修改功能时先改 `analysis/make_train.py`，再重新生成和构建。证据见 `analysis/train-validation.json`（21 项）、`analysis/train-delivery-validation.json`（10 项）与 `analysis/train-verified-*.png`。原表研究见 `analysis/train-native-configs.json`。
