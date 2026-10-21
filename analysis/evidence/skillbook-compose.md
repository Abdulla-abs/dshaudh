# 技能书合成无效

状态：离线检查通过，已保留存档安装实例 1，游戏内待复测。

触发：用户报告“技能书→合成”无效。

原代码证据：`AlchemyCompound.onPressOK` 在技能书分支调用 `PackageManager.composeSkillBook`，请求为 `rpc_s_compose_skillbook({skill_books})`。本地此前未处理。材料固定 3 本（`ALCHEMY_SKILL_BOOK_COMPOSE_NUM`），须为带 `skill_level` 的普通技能书，排除强化书 210000。按材料中二级书数量 0～3 选择占位 210001～210004，对应事件 55601～55604。55601～55603 在原表 4501／4502 两池等概率任选后按权重抽取；55604 仅 4502。回执 `rpc_c_compose_skillbook_ans` 经 `composeSkillbookAns` 入库并播放动画。

修改：新增 `handleComposeSkillbook`，扣三本材料、按原事件抽一本结果并同次保存；失败恢复背包并解锁合成页。

验证：`node analysis/check_native_skillbook_compose.cjs` 覆盖原按钮与回执、三级材料消耗、三本二级进稀有池、写盘失败与材料不足。图纸／符文合成回归通过。

交付：已备份 `.local/skillbook-compose/before-save.tar`，实例 1 覆盖安装 Success。安装前后 9 个存档文件一致，包内启动脚本与源码一致，已启动游戏。未消耗设备技能书。APK SHA-256：`f05a0b73f5937f83cba4350e5468ac81834f724d4be7aeae0e4033f70f7642dd`。

待复测：炼金技能书页选满三本合成，检查结果入库、动画和重登。安装不等于游戏内验收。
