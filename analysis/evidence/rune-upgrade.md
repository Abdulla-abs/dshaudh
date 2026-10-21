# 符文升级无效

状态：离线检查和构建通过，已保留存档安装实例 1，游戏内待复测。

触发：用户报告“符文→升级”无效。

原代码证据：`UI.EquipmentUpgrade.realUpgrade` 先按目标符文 `item_update_res_need` 预扣费用，再分别发送 `rpc_s_upgrade_equipment`／`rpc_s_upgrade_equipment_package`。适配层此前未处理这两个请求。成功回执为 `rpc_c_upgrade_equip_ans`／`ans2`，穿戴路径再调用 `HeroEquipment.upgradeEquipmentAns`。目标配方取自 `item_can_be_update_to[0]` 的 `item_update_mat_need`；原表共 30 条同形升一级路径（1→2 与 2→3 各 15）。材料为英雄碎片点数、转生碎片点数和图纸；二级转生碎片每个 3 点。费用 1→2 为龙银 40 万，2→3 为 100 万。反编译将 `pkgid = config.item_type || 0` 还原成无赋值表达式，本地对缺失 `pkgid` 按高级背包 2 处理。

结果策略：保留 OID、属性层、专属英雄属性及其他元数据，仅把 `typeid` 改为升级目标。这是本地身份升级策略，不是已证明的官方重随规则。

修改：新增 `handleRuneUpgrade`，扣材并保存预扣钱包，写盘后同步背包并回原版成功回执；失败 `shopSync` 恢复并 `afterReceUpgradeResult(null,false)` 解锁升级页。

验证：`node analysis/check_native_rune_upgrade.cjs` 覆盖背包／数字及字符串角色 SID、属性保留、费用不双扣、材料点数、2→3、写盘失败、材料不足、满级拒绝、战斗阶段隔离和全部 30 条路径。符文重铸、合成、穿脱保存回归通过。

交付：已备份 `.local/rune-upgrade/before-save.tar`，实例 1 覆盖安装返回 Success。安装前后全部 9 个存档文件逐字节一致，包内启动脚本与当前源码一致，随后已启动游戏。本轮未消耗设备符文、碎片或费用。APK SHA-256：`5a81ba7ae1fec3e6c03fa99bc1c8db1611a33f442a795004f472607c8f2c6a39`。安装核对见 `.local/rune-upgrade/install-verification.json`。

待复测：背包与已穿戴符文分别 1→2、2→3，检查属性保留、费用与材料扣除、动画及退出重登。安装和离线检查不等于游戏内验收。
