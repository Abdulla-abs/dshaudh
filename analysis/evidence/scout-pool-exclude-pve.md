# 侦察池剔除单人关卡副本

状态：离线通过待复测。

触发：用户要求随机侦察阵容池不再包含单人关卡，单人关卡仅在单人模式可用。
根因：初始池曾把第 7、16、39 关用户布局副本登记为 `scout-7`／`scout-16`／`scout-39`。
修改：从 `analysis/rpc-contracts/scout-pool.json` 移除上述三项；`python tools/build_scout_pool.py --apply` 重新嵌入。单人关卡注册表与 `pve-layouts` 未改。`scout-layouts/scout-7.json` 等副本文件保留未删，仅不再入池。池现 13 个阵容，全池等概率约 7.69%。
验证：`python analysis/check_scout_pool.py`、`node analysis/check_native_scout_pool.cjs`、`node analysis/check_native_pvp_contract.cjs`、`node analysis/check_native_scout_cloud.cjs`、`node analysis/check_native_scout_loot.cjs` 通过。
待办：构建安装后，在随机侦察确认不再出现第 7／16／39 关布局；单人模式进第 7／16／39 关仍正常。
