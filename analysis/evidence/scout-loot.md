# 随机侦察资源掠夺

状态：离线检查通过，已保留存档覆盖安装并启动实例 1。游戏内待复测。

用户要求：每个阵容按资源建筑的等级和满容量计算固定库存。仓库可掠夺 20%，生产建筑可掠夺 80%。两座九级龙币库的容量合计 300 万，全毁可掠夺 60 万。

根因：原侦察进场复用布局时传入零资源，`handleCompletePvpBattle` 又将结算资源固定为 0。

原代码证据：原表 `unit_main[20509].gold_storage=1500000`。202／204 类生产建筑使用 `temp_storage`，203／205 类仓库分别使用 `wood_storage`／`gold_storage`。原版 `Components` 的 `BattleResourceStorage.init` 对生产建筑读取数值型 `sto`，对仓库读取资源字典。`onHit` 累计受损掠夺量，再调用防守方 `ResourceManager.onLostRes`。比例为用户指定的本地规则。

修改：`analysis/native_boot.js` 新增 `fillScoutResourceLoot` 和 `readScoutBattleLoot`。每次复制目标布局后，逐座写入可掠夺额度；大本营、墙、守军及非资源建筑不计入。每次重新匹配都恢复相同额度，保留原版受损掠夺过程。结算读取本场防守方累计损失，限制在本场额度内，写入主城仓库后返回原结算回执。实际入库仍受主城容量限制。失败战斗也保留已掠夺资源，未开始战斗不得结算。

验证：`check_native_scout_loot.cjs` 执行原版库存初始化、受损和资源损失函数，覆盖两座九级库、生产库存、部分受损、全毁、重复命中、失败战斗、入库续读、容量上限、重复结算和写盘失败重试。`check_native_scout_pool.cjs` 核对全部 15 个阵容及数据隔离。侦察接口、每日任务、单人进场、单人结算和钱包回归通过；池编译检查和语法检查通过。

运行时观察：构建成功，包内 `assets/offline/boot.js` 与源码一致。仅在专用实例 1（`127.0.0.1:21513`）覆盖安装，返回 `Success`，启动返回 `Status: ok`。安装前后全部 9 个存档文件内容一致。APK SHA256 为 `2e9c5fff138884392cfb162d18458e6d5d8568306daf9efcc8391d42fdad61cd`。原始记录和备份在 `.local/scout-loot/20261020-142200/`，构建日志为 `.local/scout-loot/build.log`。

用户确认：比例与满容量规则来自本轮要求；实际到账尚未验收。

待复测：在随机侦察中查看目标资源，摧毁资源建筑后结算回城，再重登确认库存。结算界面显示战斗所得，仓库放不下的部分不会入库。契约见 `analysis/rpc-contracts/scout-loot.json`。
