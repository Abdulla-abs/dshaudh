# 本地新建建筑测试版

双击 `启动本地新建建筑测试.cmd`，再点击原版入口的“进入游戏”。本版在训练队列包之上，按原表接入一座额外日光井的本地新建。

## 操作

1. 将龙首之城升到二级（`build_number[202].lv2_num=2` 才允许第二座日光井）。
2. 底部右侧点击“建造日光井”。
3. 状态栏显示费用与耗时后，点击地图空位放置。
4. 立即扣费并开始倒计时；施工期间不能移动/采集/升级该建筑，也不能同时再建或升级其他建筑（共用一名工人）。
5. 倒计时结束后自动投产，可按原有采集流程收取日光。

资源不足、主城等级不够、已达上限或工人忙碌时，会给出提示且不扣费。再次点击底部左侧可取消放置。

## 规则

| 项目 | 来源 |
| --- | --- |
| 类型 | 原表 `20201` 日光井（本版只接这一座生产建筑） |
| 费用 | `BuildingBuilder` / 原商店同款：`lv_up_cost` 700 龙币 |
| 耗时 | 原表 `lv_up_time` 180 秒 |
| 数量上限 | `data.build_number[202]`，按当前主城等级取 `lvN_num`（一级 1、二级 2、…、六级起 6） |
| 工人 | 与升级共用，全局同时只能有 1 个 `upgrade` 或 `construct` |
| 离线 | 关闭游戏后按本机时间继续，重启即结算并创建生产记录 |

本版仍支持移动、采集、满级升级、驯龙场/龙英巢容量展示与 114 系训练队列。存档键升级为 `dino.local.city.v10`，从 `v9` 继承建筑、资源、生产、训练与士兵。

## 范围说明

新建由本地存档处理，**没有**调用原版 `Shop.buyBuilding`、`rpc_s_build` 或建造动画界面。龙银矿/仓库/驯龙场等其他族的新建尚未接入；`120`/`101`/`102` 兵种、英雄列表与战斗仍未恢复。

## 开发入口

```powershell
python analysis/make_construct.py              # 由 train_boot.js 生成 construct_boot.js
python analysis/build_construct.py             # 构建 dino-local-construct.apk
python analysis/prepare_construct_validation.py
python analysis/build_construct_validation.py  # 构建夹具包
python analysis/validate_construct.py          # 夹具验证（独立存档键）
python analysis/validate_construct_delivery.py # 正常存档验证
```

修改功能时先改 `analysis/make_construct.py`，再重新生成和构建。证据见 `analysis/construct-validation.json`（17 项）、`analysis/construct-delivery-validation.json`（7 项）与 `analysis/construct-verified-*.png`。原表研究见 `analysis/construct-native-configs.json`。
