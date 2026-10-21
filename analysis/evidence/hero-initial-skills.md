# 英雄获取时的初始技能

状态：离线通过，已保留数据覆盖安装到专用实例 1，游戏内技能待复测。

触发：用户报告获取英雄可能没有技能，要求迪诺携带“未成熟的旋风斩”，普通龙蛋从对应角色普通技能中随机一个。

原代码证据：`analysis/native_boot.js` 的 `defaultStarterHero` 原为 `skill_slots: []`；`shopRollHeroes` 从 `hero_input_client.putin_skill` 取技能，缺失即为空。`applyPveHeroRewards` 同样允许配置缺失时为空。

获取入口检索：账号初始迪诺；旧档第二关首胜补发；单人关卡首胜及重复奖励；七日签到英雄（共用 `applyPveHeroRewards`）；教程免费精灵龙；商店付费/免费单抽、三抽及背包龙蛋（共用 `shopRollHeroes`），最后由领取入口入库。宝藏使用遇到英雄事件当前会拒绝，尚无另一个直接发英雄的路径。

原表证据：`skill_data[1000001].skill_name` 为“未成熟的旋风斩”；`hero_to_skill[角色类型].skill_id` 列出该角色技能；`skill_to_hero` 中有 `to_hero_id` 和 `skill_weight_1/2/3`。本次将存在学习权重的角色技能作为普通技能池，这是基于配置字段的实现判断，未冒称原服务器抽取算法；排除没有学习权重的召唤、变异及教程特殊技能。解码表位于 `.local/shop-treasure/`，可用 `python analysis/inspect_native_shop.py` 重建。

修改：初始迪诺固定 1000001；普通龙蛋从对应角色普通技能池等概率选一级技能。关卡和签到保留配置技能，配置缺失时补选。教程精灵龙已有 26701。`ensureStarterHeros` 在加载旧档时为无技能英雄补齐，保留已有技能；未领取旧龙蛋在展示和领取前补齐并保存。未知角色无可用池时抛错，避免发出空技能英雄。第二关旧档补发同步设置 15101，避免继承迪诺的技能标识。

验证：`node analysis/check_native_shop.cjs` 覆盖 14 个角色、三个卡色、随机池首尾、技能归属、已有技能不重抽、抽取重启技能保留，以及商店事务回归。`check_native_hero_contract.cjs`、`check_native_egg_contract.cjs`、`check_native_pve_wallet.cjs`、`check_native_pve_settle.cjs`、`check_native_save_safety.cjs` 均通过，`node --check analysis/native_boot.js` 通过。

交付：2026-10-15 构建成功，APK SHA256 为 `9aa91ccd0a69db53e13ab285e83efb95a61137c87afbd050d8bea9747e76f744`。安装前数据库及偏好备份为 `.local/hero-initial-skills/device-before.tar`；通过 `127.0.0.1:21513` 执行 `install -r` 返回 `Success`，已启动游戏。

待复测：检查已有无技能英雄补齐、迪诺技能名和龙蛋领取后的技能显示及强退续读。尚无本轮技能界面的运行时观察或用户验收。
