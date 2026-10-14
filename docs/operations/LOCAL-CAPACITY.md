# 本地仓库容量测试版

双击 `启动本地容量测试.cmd`，再点击原版入口的“进入游戏”。本版在升级测试版之上，新增日光皿和龙币库从一级升到二级，升级后仓库容量会变化。

| 建筑 | 费用 | 耗时 | 升级条件 | 容量变化 |
| --- | --- | --- | --- | --- |
| 日光皿 | 3000 龙币 | 180 秒 | 二级主城 | 日光仓库 5000 → 15000 |
| 龙币库 | 3000 日光 | 180 秒 | 二级主城 | 龙币仓库 5000 → 15000 |

仍保留龙首之城、日光井和龙银矿升到二级。总容量由主城与仓库建筑配置相加：一级仓库时各 25,000，两座仓库升到二级后各 35,000。顶部余额旁显示当前容量上限。

选择仓库建筑时，底部会显示该建筑提供的容量。点击“升级建筑”先显示费用，再次点击“确认升级”才扣费。一次只能升级一座建筑。施工期间不能移动该建筑。

新包为 `dino-local-capacity.apk`。它复制升级版存档到新键 `dino.local.city.v4`。旧包和旧存档键保留。各版本此后的操作分别保存。

这是原版地图和建筑资源上的本地容量升级。它复用 `BuildingBuilder` 的费用和倒计时，以及既有生产采集接口。完整主城、新建建筑、龙英巢、驯龙场、养成和战斗仍未恢复。三级及以上升级尚未接入。

## 开发入口

`analysis/make_capacity.py` 从升级版生成容量脚本和构建脚本。容量功能修改应先写入生成器，再执行：

```powershell
python analysis/make_capacity.py
python analysis/build_capacity.py
```

交付脚本为 `analysis/capacity_boot.js`，构建脚本为 `analysis/build_capacity.py`。

验证脚本为 `analysis/validate_capacity.py`。它使用独立测试存档键，测试初始资源为人工夹具；不向正常存档赠送资源。正式包另用 `analysis/validate_capacity_delivery.py` 验证。

## 验证记录

专用逍遥实例 1、Android 9、DirectX 环境中，日光皿和龙币库分别按真实的 180 秒完成升级。测试覆盖确认页、两种资源扣费、不支持建筑、建筑师忙碌、关闭期间完成、容量 25000→35000、二级模型和返回再进入。

成功路径使用独立夹具，记录为 `analysis/capacity-validation.json`。截图为 `analysis/capacity-verified-*.png`。正式包在正常存档下另行验证资源不足、主城等级限制、自然采集、旧存档不变、返回和重启，记录为 `analysis/capacity-delivery-validation.json`。

`Launch-Capacity.ps1` 设置 DirectX、重启专用实例、安装正式包并启动。包的 SHA-256 为 `d233d7a24218c1a7ec1307cbcd50d156245a207b86be8824f2cc4a2ec316f984`。
