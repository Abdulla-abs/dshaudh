# 英雄喂食点击无效

状态：离线通过，已覆盖安装待复测。

触发：英雄喂食页点“喂食”，神秘豆等道具无消耗、无经验；再次点击也无反应。

根因：`doHeroFeed` 调 `useItemByTypeid` → `rpc_s_use_item`，并 `DA.setLock(LOCK_ID_FEED_HERO)`。本地 `handleShopUseItem` 原先只处理龙蛋/宝藏/技能书，喂食直接失败且无 `rpc_c_use_item_ans`，锁不释放，后续点击被 `checkLock` 挡掉。流光神秘豆为 `1109`，表 `exp_input[5113].putin_num=300`，回执应为 `INPUT_TYPE_EXP_TO_ONE_HERO(24)`。

证据：`analysis/disasm/HeroFeed.decompiled.js` 的 `doHeroFeed` / `feedFxCallback`；`InputEvent.onGetOneHeroExp`；`.local/hero-feed/exp_input.js`。

修改：`applyHeroFeedUse` 处理经验豆、祝福水、变异果（按 `item_level` 从 `mutate_effect` 抽）、技能格果、装备格；失败时 `unlockHeroFeedIfNeeded` 清锁。

验证：`node analysis/check_native_hero_feed.cjs` 通过；包 SHA256 `2ea93fd23ca734f31b474ec01eeca2516516cf9888ebdbc1b8f7690a300d81c0`，实例 1 保留数据覆盖安装并启动。

待办：若仍锁在旧喂食页需重进；再喂 1109 确认经验条与次数。祝福水/变异同路径，实战另复测。
