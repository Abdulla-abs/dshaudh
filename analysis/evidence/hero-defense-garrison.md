# 龙弹堡驻守进战后消失

状态：离线通过，已覆盖安装实例 1，待游戏内复测。

触发：主城把英雄驻守到龙弹堡后，进入任意战斗类玩法再回城，驻守单位消失，需重新设置。

根因：原版 `HeroAttributeController.setDefenseID` 会发 `rpc_s_set_hero_defense({defense_id})`，本地只接了 `rpc_s_set_hero_state`。会话内内存有 `defense_id`，进战后主城从存档重建；存档只有 `state=2`、没有 `did`，原版 `createHero`／`init` 读不到驻守建筑，驻守消失。

证据：原版 `.local/hero-slots/HeroComponents.js` 的 `setDefenseID`、`HeroIdleBunkerController.changeState`；`Unit.callServer` 注入 `uid=this.sid`；`dump` 写 `params.did=this.defense_id`。本地 `docs/ai/rpc-locations.tsv` 此前无 `rpc_s_set_hero_defense`。

修改：`analysis/native_boot.js` 新增 `applyHeroDefense`，`installCallServer` 接入该 RPC，同时落盘 `did` 与 `defense_id`；`ensureStarterHeros` 互相同步旧档两字段。契约 `analysis/rpc-contracts/hero-defense.json`。

验证：`node analysis/check_native_hero_defense.cjs` PASS。构建 SHA256 `865f9e91d41847b1d07398a3c1ad8f641393e67b2f2539c95a9ed695c140b3eb`。经 `127.0.0.1:21513` 保留数据覆盖安装 Success，已启动。

待办：用户复测——重新驻守一次后进战斗回城，确认驻守仍在。历史上未落盘的旧驻守需再设一次。
