# 英雄经验超过阈值仍为 1 级

状态：离线通过，已保留数据覆盖安装到实例 1。读档后的界面和后续通关待复测。

用户观察：慈母龙为 1 级，经验显示 17/3。

原代码证据：原版 `BattleCard` 的结算卡面调用 `ExpBar.addGrowthXp`，按 `hero_lv_data.hero_exp` 消耗经验并升级。适配层结算却只执行 `hero.xp += sweep_hero_exp`，保存的 `lv` 没有变化。回城重新初始化会读回旧等级。

设备观察：`.local/shop-treasure/hero-exp-before/databases/jsb.sqlite` 保存的慈母龙为 `11306`、`lv=1`、`xp=17`；另一名 `11005` 同样为 1 级、17 点经验。龙英巢为 `20602`。未把截图中的卡片阶级当作成长等级。

原表：1 升 2 需 3 点经验，2 升 3 需 15 点。二级龙英巢的 `hero_lv_max=20`。因此已有 17 点应转为 2 级、剩余 14 点，而非经验清零。定向解码为 `.local/hero-exp/hero_lv_data.js` 和 `hero_number.js`。

修改：新增 `normalizeHeroExperience`，在保存结算奖励时逐级消耗经验，同步 `lv`、`level` 和剩余 `xp`。原结算卡面仍接收同一笔经验，用原逻辑播放升级。加载旧档时规范已有经验，重复加载不重复加经验。等级遵守保存的龙英巢上限；上限经验按原版限制，已有 30 级赠送角色不降级。

验证：`check_native_hero_exp.cjs` 覆盖 17/3 修复、精确阈值、连续升级、上限、已有高等级英雄及重复读档。`check_native_pve_settle.cjs` 验证结算保存 2 级和剩余经验，并保留重复结算保护。英雄、晋升和存档安全检查通过。

交付：2026-10-15 构建 SHA256 为 `695a5bcf6cac64e555b02e8aeba18ef75174c93e3183bebc738a24915c8a7aec`。安装前备份 `.local/hero-exp/device-before.tar`。通过 `127.0.0.1:21513` 执行 `pm install -r` 返回 `Success`，已启动游戏，保留存档。

待复测：进入游戏后确认慈母龙为 2 级、14/15；再通关验证经验和等级在回城、强退续读后保持一致。尚无本轮修复后的运行时界面观察或用户确认。
