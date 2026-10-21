# 单人关卡敌方守军可被控制

状态：离线检查通过，已保留数据覆盖安装并启动实例 1，实际战斗待复测。

用户观察：单人关卡中，可以拖动敌方驻守英雄，并手动释放其技能。敌方应自动施法。

原代码证据：`HeroBattleController._delayedInit` 在非回放战斗中，按 `master.faction == G_Player.faction` 创建原版 `HeroOpratePanel`。该面板提供拖动及技能操作。`StaticBattleController.doCastActiveSkill` 在非回放且无操作面板时自动释放可用技能。旧 `LocalNative.ensureBattleClients` 将 `G_Player` 固定绑定为防守方；单人关卡的原版阵营判断因此会给敌方守军创建操作面板。此前血条修正只修显示，没有修正操作归属。

修改：`analysis/native_boot.js` 的 `ensureBattleClients` 按当前战斗分配客户端。非回放进攻战斗将玩家绑定到进攻方、对手绑定到防守方；教程敌袭和回放沿用原有分配。重复补建地图时保持同一归属。原版操作面板、自动施法和己方自动按钮逻辑保留。

离线验证：新增 `analysis/check_native_battle_ownership.cjs`，执行原版英雄面板初始化和技能分发。验证敌方无操作面板、玩家关闭自动时敌方仍自动施法、己方手动与自动切换正常。还覆盖连续五次绑定、旧错位槽位恢复、敌袭切回单人关卡。原技能、血条、单人进场、守军创建、入侵检查及语法检查均通过。

设备观察：2026-10-19 构建 SHA256 为 `dd8fe67035a2430d7b59ac8c29f95d2260fd9e5fb1710f4a268e6587fda491e1`。专用 ADB `127.0.0.1:21513` 覆盖安装返回 `Success`，启动命令成功。安装前备份为 `.local/battle-ownership/before-install.tar`。安装前后数据库、偏好和文件目录中的全部 9 个文件内容一致，见 `.local/battle-ownership/save-verification.json`。

待复测：进入有驻守英雄的单人关卡，关闭玩家自动施法，确认敌方无法拖动、没有可点击技能图标，并会在原技能条件满足时自动释放；己方仍可拖动及手动施法。本轮没有修复后的实际战斗观察或用户验收。
