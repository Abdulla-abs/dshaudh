# 随机侦察关卡池

随机侦察沿用原版入口、换目标、战斗和回城流程。适配层从预定义关卡池抽取完整布局。当前全池等概率抽取，每次独立，允许连续命中同一关。

## 关卡与匹配规则

入口是 `analysis/rpc-contracts/scout-pool.json`。`levels` 的每项包含稳定的 `id` 和布局相对路径 `layout`。布局统一放在 `analysis/rpc-contracts/scout-layouts/`，使用已有布局编辑器的 `dino-pve-layout/v1` 格式。

单人关卡只通过单人模式注册表进场，不进入侦察池。曾作为初始副本入池的第 7、16、39 关（`scout-7`／`scout-16`／`scout-39`）已从清单剔除；布局中的 `stage` 仅供现有编译器生成单位编号，不控制侦察匹配或单人关卡解锁。剔除证据见 `analysis/evidence/scout-pool-exclude-pve.md`。

当前池共 13 个阵容：两份同名“巷子里的猫”（`alley-cat`、`alley-cat-8`）、用户提供的第 9～18 关，以及 `abbas`。新增十关依次为“铁壁围城、血战龙庭、双峰哨卫、四门铁闸、回字重墙、蜂巢迷阵、长蛇锁链、双环守卫、三阶梯防、龙巢天罡”，使用 `scout-custom-9` 至 `scout-custom-18` 独立 ID。全池模式下每个阵容匹配概率为 1/13（约 7.69%），两个同名关卡合计约 15.38%。批量布局及安装证据见 `analysis/evidence/scout-batch-9-18.md`。

`abbas` 来自用户的“玩家模式阵型-铁心方盒”，保留 8 级大本营、75 个建筑、173 段墙和 8 名守军，除名称外均与原文件一致。独立文件为 `analysis/rpc-contracts/scout-layouts/abbas.json`，接入及安装证据见 `analysis/evidence/scout-abbas.md`。

| 配置 | 行为 |
|---|---|
| `policy.mode = "all"` | 当前默认，从全部已登记关卡等概率抽取 |
| `policy.mode = "headquarters-range"` | 按玩家大本营等级筛选，再等概率抽取 |
| `policy.headquartersDelta = 1` | 等级模式允许目标等级与玩家相差最多 1 级 |

例如，玩家大本营为 3 级时，等级模式只接受 2、3、4 级关卡。玩家等级读取存档建筑的 `typeid`，201 为大本营类型，末两位为建筑等级。关卡等级由编译器从布局中唯一的大本营推导，无须手填第二份等级字段。

等级模式没有候选或缺少玩家大本营时，接口报错并记录现有 RPC 错误日志。当前未添加界面提示，也不会自动扩大等级范围。启用前应补齐各等级关卡。全池模式无需玩家大本营等级。

## 增加关卡

1. 用布局编辑器制作并导出 JSON，保存到 `analysis/rpc-contracts/scout-layouts/`。每份布局须有且仅有一座大本营。
2. 在 `scout-pool.json` 的 `levels` 增加唯一 `id` 和相对路径，例如 `{"id":"scout-new","layout":"scout-layouts/scout-new.json"}`。
3. 执行 `python tools/build_scout_pool.py --apply`，校验并嵌入运行时代码。建筑、墙、陷阱、装饰和守军校验复用既有布局编译器。
4. 执行 `python tools/build_scout_pool.py --check`，确认配置与嵌入数据一致，再构建和安装。

布局 JSON 的 64×64 元数据只用于兼容旧格式。编辑器显示原版 60×60 地形，绿色可建造区域为 x、y 各 11～48，完整建筑占地和墙都必须在此范围。编辑器、单人关卡导入器与侦察池共用 `analysis/rpc-contracts/layout-map.json`，均拒绝越界布局。“巷子里的猫”第 8 关版本已整体平移（-20，-20），保留内部相对位置。地形证据与复现见 `analysis/evidence/scout-map-bounds.md`，运行 `python analysis/check_scout_map_bounds.py` 可核对原版 TMX 与边界检查。

切换规则也须执行 `--apply` 并重新构建。配置文件不会在设备运行时热加载。`--apply` 只更新源码，不修改存档、安装应用或解锁关卡。

## 验证与边界

运行 `python analysis/check_scout_pool.py` 和 `node analysis/check_native_scout_pool.cjs`。前者检查数据编译、配置错误和嵌入同步；后者检查匹配边界、实际进场数据、守军关联、墙和数据隔离。

资源规则按用户要求于 2026-10-20 更新：每次进场复制布局，按资源建筑当前等级的满容量计算可掠夺额度。203／205 类仓库取存储上限的 20%，202／204 类生产建筑取临时存储上限的 80%，逐座向下取整。大本营及其他建筑不计入。例如，两座九级龙币库各有 150 万容量，全毁可掠夺 60 万龙币。

原版受损掠夺过程保留，完全摧毁可取得该建筑的全部额度。结算读取防守方累计资源损失，按主城仓库空余容量入库；战斗失败也可保留已经掠夺的资源。每次重新匹配都恢复相同的目标资源，战斗损坏不会修改预定义数据。侦察不会更新单人关卡解锁、星级或首胜奖励。契约及验收见 `analysis/rpc-contracts/scout-loot.json` 和 `analysis/evidence/scout-loot.md`。

离线检查通过，已保留存档覆盖安装并启动专用实例 1。安装前后全部 9 个存档文件内容一致。游戏内换目标、守军显示、实战结算及回城仍待复测。
