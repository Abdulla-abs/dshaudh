# 技能替换点击后卡住

状态：离线通过，已覆盖安装待复测。

触发：替换页消耗已显示 888，点“替换为该技能”有点击效果，但不替换；点右上角叉也无效。界面动画未卡死。

根因：原版 `confirmReplace` 先扣阳光，再 `useItemByTypeid` → `rpc_s_use_item`，并设 `playingAnimation=Replace`。`canRespond` 在动画标记未清时拒绝关闭。本地 `handleShopUseItem` 只处理龙蛋与宝藏 1501–1509，技能书直接 `return false` 且不发 `rpc_c_use_item_ans`，界面一直等待。

证据：`analysis/disasm/SkillInterface.decompiled.js` 的 `onSkillReplaced` / `canRespond`；`InputEvent.onGetSkill` → `SkillManager.skillInputResult`（`operation:"replace"`）；再生书 `200123` → `replace_skill=123`。

修改：`analysis/native_boot.js` 增加 `resolveSkillBookReplaceId`、`applySkillBookUse`，在 `handleShopUseItem` 中回执 `[[7,{operation,hero_id,slot_index,skill_id}]]`，并落盘英雄槽与扣书。强化书 `210000` 一并接 `enforce`，避免同路径卡住。

验证：`node analysis/check_native_skill_replace.cjs` 通过；包 SHA256 `dafe62a4aa88b36a12c387463a77cebc410612f482bd3bd9b1933f2130954224`，实例 1 保留数据覆盖安装并启动。

待办：若仍停在旧替换页需重进游戏；再点替换，确认飞入动画、叉可关、技能变为再生且重进仍在。
