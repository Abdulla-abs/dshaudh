# 布局编辑器守军符文

状态：编辑器、导入编译和原函数恢复检查通过；用户及游戏实战待复测。

触发：用户要求为防守角色配置嵌入符文。此前编辑器与接入工具均未处理该字段。

原代码证据：`HeroComponents.jsc` 的 `HeroEquipment.init/dump` 读写 `params.eqp`。`getNeededForm(slot)` 返回 `slot+3`；`item` 中相应 3～7 形状共有 45 个符文条目，覆盖每槽三类、三级。`getEquipmentAttr` 按 `base_attr/two_attr/three_attr/hero_attr` 计算；转生属性按 `unit_battle.reborn_times` 为 1 或 2 时分别生效，专属属性要求实际英雄家族相符。`rune_order` 有 27 条顺序组合；`_getEquipTypeLevel` 在空槽停止，`getExtraKeySkill` 从最长前缀匹配。`BattleController` 的 `StaticBattleController.afterInit` 读取该组合技能。

字节码核对：原反编译器在 `or` 表达式丢失操作数。已对照 `HeroComponents.disasm.txt` 的 02d608～02d620（等级和类型入列）、02e997～02e9a9（属性累加）、02eb3a～02eb49（转生条件），在检查脚本中明确恢复对应表达式，并恢复函数局部变量。不是设备实测，也未修改原游戏函数。

修改：`tools/extract_layout_runes.py` 定向提取原表及原函数；`tools/build_layout_rune_catalog.cjs` 生成可选物品、属性值、专属配置及组合技能。`core.js`、`editor.js`、`editor.css` 增加每名守军五槽设置、可展开的分层属性编辑与组合预览；属性手动指定，不推测自然随机生成池。缺少中文组合说明时显示缺失提示。导入保留 `runes`，旧布局不受影响；`tools/import_pve_layout.py` 校验槽位、类型、属性层、重复属性和专属英雄，转成原版 `eqp`，不把组合塞入培养技能。侦察池复用相同编译器。已重建离线 HTML。

离线验证：`node analysis/check_layout_editor.cjs`、`python analysis/check_layout_editor.py`（9 项）、`node analysis/check_layout_runes.cjs`、`node analysis/check_layout_editor_browser.cjs` 通过。27 个组合 × 3 级 × 2 个英雄家族，共 162 组预览与恢复原函数结果一致。另将真实 Python 编译结果送入现有 `buildEditorPveVillage`，确认 `eqp` 保留并能由原版装备初始化／导出及属性读取。浏览器验证五槽配置、属性添加与改值、专属选择、空槽中断、撤销、刷新恢复、导入导出、窄屏及既有编辑功能。导出文件再次只读编译通过，`applied=false`。

运行时观察：仅限浏览器。截图 `.local/layout-editor/browser/guard-runes-desktop.png`、`guard-runes-mobile.png`；含符文的导出文件为同目录 `exported-stage7.json`。原表和反汇编保存在 `.local/layout-editor/runes/`。

用户确认：尚无。未将测试布局写入关卡或侦察池，未构建 APK、未安装或改设备存档。下一步由用户重新打开 HTML 配置符文；接入实际布局后验证实战属性与组合技能。
