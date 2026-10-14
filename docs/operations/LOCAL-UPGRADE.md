# 本地建筑升级测试版

双击 `启动本地升级测试.cmd`，再点击原版入口的“进入游戏”。选择建筑后，点击底部“升级建筑”。界面先显示费用和耗时，再次点击“确认升级”才扣费。

本次支持龙首之城、日光井和龙银矿从一级升到二级。

| 建筑 | 费用 | 耗时 | 升级条件 |
| --- | --- | --- | --- |
| 龙首之城 | 1000 龙币 | 300 秒 | 一级主城 |
| 日光井 | 700 龙币 | 180 秒 | 二级主城 |
| 龙银矿 | 700 日光 | 180 秒 | 二级主城 |

费用和耗时来自原版一级建筑配置。一次只能升级一座建筑。资源不足时不会扣费。升级期间，生产建筑暂停生产和采集，已有储量保留。正在升级的建筑不能移动。

升级状态自动保存。关闭游戏后，倒计时按本机时间继续。升级完成后，地图换成原版二级建筑模型。日光井和龙银矿的产量变为每小时 400 点，最多暂存 1000 点资源。

新包为 `dino-local-upgrade.apk`。它复制采集版的位置、余额和生产记录，保存到新键 `dino.local.city.v3`。旧包和旧存档键保留。各版本此后的操作分别保存。

这是原版地图和建筑资源上的本地升级流程。它复用 `BuildingBuilder` 的费用和剩余时间计算，以及 `ResourceProductor` 的生产计算。完整主城、原版工人动画、升级回执、任务奖励、建造、养成和战斗仍未恢复。其他建筑与三级升级尚未接入。

## 开发入口

`analysis/make_upgrade.py` 从采集版生成升级脚本和构建脚本。升级功能修改应先写入生成器，再执行：

```powershell
python analysis/make_upgrade.py
python analysis/build_upgrade.py
```

交付脚本为 `analysis/upgrade_boot.js`，构建脚本为 `analysis/build_upgrade.py`。交付包使用单次启动库，不读取外部研究脚本。构建脚本共享临时文件，不能并行运行。

验证脚本为 `analysis/validate_upgrade.py`。它使用独立测试存档键，测试初始资源为人工夹具；不向正常存档赠送资源。准备夹具时须使用研究包，并保留 `analysis/upgrade-test-fixture.json`。已完成的夹具不能直接重跑，应重新准备。

测试 APK 使用独立存档键。`analysis/prepare_upgrade_validation.py` 和 `analysis/build_upgrade_validation.py` 构建这个变体。运行测试前需检查当前代码与已安装测试包的差异。

## 验证记录

专用逍遥实例 1、Android 9、DirectX 环境中，三座建筑分别按真实的 300、180 和 180 秒完成升级。测试覆盖确认页、两种资源扣费、等级要求、建筑师忙碌、重复点击、施工期间禁止移动和采集、重启续接、二级模型、关闭期间完成和二级日光产量。

成功路径使用独立夹具，记录为 `analysis/upgrade-validation.json` 和 `analysis/upgrade-validation.log`。截图为 `analysis/upgrade-verified-*.png`。测试包与正式包的功能代码已比对，区别为独立存档键，以及正式包按等级显示无储量时的生产间隔。比对结果见 `analysis/upgrade-artifact-check.json`。

正式包在正常存档下另行验证资源不足、自然采集、保存和重启，记录为 `analysis/upgrade-delivery-validation.json`。截图为 `analysis/upgrade-delivery-*.png`。本次没有向正常存档赠送资源。两个旧存档键保持不变。

`Launch-Upgrade.ps1` 已实际运行，完成 DirectX 设置、专用实例重启、正式包安装和启动。正式包签名验证通过，清单保留此前移除 INTERNET 权限的修改。完整权限清理仍未进行。

源码和证据快照为 `handoff/upgrade-source-2026-10-12.zip`。`UPGRADE-BASELINE.json` 保存相关文件哈希。包的 SHA-256 为 `f44cf95fae12b91a085574b25af9f0b094634322544da533c01ba6b3b612963b`。
