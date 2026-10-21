# 小绿龙入侵未携带主城驻守英雄

状态：离线通过，已覆盖安装实例 1，待游戏内复测。

触发：入侵使用主城布局，但龙弹堡驻守英雄不出现在防守场。

根因：原版 `GameControllerInvasion.initLevelFromData` 只遍历 `level_data.self.units` 创建单位；本地进场把驻守英雄放在 `self.heros`，入侵控制器不读该字段。建筑 SID 还会 remap 到 93001+，即使把英雄塞进 units，若不改写 `did` 也找不到龙弹堡。

证据：`analysis/disasm/GameControllerInvasion.decompiled.js` 的 `initLevelFromData`／`_createBattleUnitWhenInit`／`_setupAllUnit`；进场构造原在 `buildInvasionEnterDict`。

修改：`buildRemappedUnitsMap`＋`injectDefenseHerosIntoUnitsMap`：按存档 `did`／`defense_id` 选出驻守英雄，写入 `self.units`，`did` 指向 remap 后的堡 SID，去掉 `x/y` 避免 TileHolder；出征队英雄不注入。

验证：`node analysis/check_native_invasion.cjs` PASS。构建 SHA256 `fee9ce18b59c5dd797f6919e19f980f8e190ade9e17cc37def21ee01d344318a`。经 `127.0.0.1:21513` 保留数据覆盖安装 Success，已启动。

待办：用户复测——主城先驻守龙弹堡，再进入侵确认驻守英雄在场。若驻守仍是旧会话内存态，需再设一次以落盘。
