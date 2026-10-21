# 技能替换消耗显示 undefined

状态：离线通过，已覆盖安装待复测。

触发：教程拿到技能书后进入替换技能页，“替换为该技能”按钮下消耗显示红色 `undefined` 与阳光图标。

根因：原版 `SkillReplace.setButton` 用 `data.skill_to_hero[sid]['skill_exp_' + calSumExp(lv, exp)]` 取阳光消耗。本地英雄 `skill_slots` 缺 `exp` 时，键变成 `skill_exp_undefined`，界面把 `undefined` 直接 `setString`。不是云端下发字段；表内对迪诺初始技能 `10000` 有 `skill_exp_0`/`skill_exp_1`（888）。

证据：原表 `.local/shop-treasure/skill_to_hero.js` 的 `10000.skill_exp_0=888`；适配注释与修补在 `analysis/native_boot.js` 的 `normalizeHeroSkillSlots`、`resolveSkillWoodCost`、`installSkillReplaceCostFix`。

修改：
- 读写英雄技能槽时补 `exp:0`，加载时规范化。
- `setButton` 后若消耗仍非有限数，先按表重算；仍失败则用当前最大阳光储量的 1/3（用户授权）。
- 强化界面 `SkillUpgrade` 同路径一并兜底。

验证：`node analysis/check_native_skill_replace_cost.cjs` 通过；包 SHA256 `d04c2269649d1c0b895a8e66fe72c40f73fda56023f670d2b3f5b4243bfe54f1`，实例 1 保留数据覆盖安装并启动。

待办：设备上再进替换页确认数字与扣费；技能书 `rpc_s_use_item` 是否完整另项。
