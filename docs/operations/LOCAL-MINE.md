# 本地生产建筑新建测试版

双击 `启动本地生产建筑新建测试.cmd`，再点击原版入口的“进入游戏”。本版在日光井新建包之上，按同一套原表规则接入龙银矿新建；底部“建造生产”可建日光井或龙银矿。

## 操作

1. 将龙首之城升到二级（`build_number` 才允许第二座生产建筑）。
2. 底部右侧点击“建造生产”。
3. 默认先进入当前可建类型的放置模式；放置中再点同一按钮可切换日光井 / 龙银矿。
4. 状态栏显示费用与耗时后，点击地图空位放置。
5. 立即扣费并开始倒计时；施工期间不能移动/采集/升级该建筑，也不能同时再建或升级其他建筑（共用一名工人）。
6. 倒计时结束后自动投产，可按原有采集流程收取资源。

资源不足、主城等级不够、已达上限或工人忙碌时，会给出提示且不扣费。点底部左侧可取消放置。

## 规则

| 项目 | 日光井 `20201` | 龙银矿 `20401` |
| --- | --- | --- |
| 费用 | 700 龙币 | 700 日光 |
| 耗时 | 180 秒 | 180 秒 |
| 数量上限 | `data.build_number[202]` | `data.build_number[204]` |
| 一级→六级座数 | 1→2→3→4→5→6 | 同左 |

工人与升级共用，全局同时只能有 1 个 `upgrade` 或 `construct`。关闭游戏后按本机时间继续，重启即结算并创建生产记录。存档键升级为 `dino.local.city.v11`，从 `v10` 继承建筑、资源、生产、训练与士兵。

## 范围说明

新建由本地存档处理，**没有**调用原版 `Shop.buyBuilding`、`rpc_s_build` 或建造动画界面。仓库/驯龙场等其他族新建、`120`/`101`/`102` 兵种、英雄列表与战斗仍未恢复。

## 开发入口

```powershell
python analysis/make_mine.py              # 由 construct_boot.js 生成 mine_boot.js
python analysis/build_mine.py             # 构建 dino-local-mine.apk
python analysis/prepare_mine_validation.py
python analysis/build_mine_validation.py  # 构建夹具包
python analysis/validate_mine.py          # 夹具验证（独立存档键）
python analysis/validate_mine_delivery.py # 正常存档验证
```

修改功能时先改 `analysis/make_mine.py`，再重新生成和构建。证据见 `analysis/mine-validation.json`（22 项）、`analysis/mine-delivery-validation.json`（7 项）与 `analysis/mine-verified-*.png`。原表研究见 `analysis/mine-native-configs.json`。
