# 布局编辑器陷阱

状态：离线及真实浏览器检查通过，用户待复测；游戏内触发效果未验证。

触发：用户指定交付 HTML 缺少蛋壳炸弹、网兜等陷阱。

原代码证据：原版 `unit_main` 中 `first_type=1`、`battle_type=8` 的建筑包含捕兽夹（401）、网兜（402）、蛋壳炸弹（403）。每类有效等级为 1～10，占地均为 1×1；末两位为 00 的条目没有 `lv`，不作为可放置等级。同名移动单位不属于陷阱建筑。中文名称取自 `string_data`。

根因：编辑器目录未收录这三类，素材栏分组也未包含陷阱。

修改：`tools/build_layout_trap_catalog.cjs` 从原表刷新陷阱目录；`analysis/layout-editor/editor.js` 增加“陷阱”分组，沿用现有防御配色、放置和属性操作。已重建 `artifacts/关卡布局编辑器.html`。

验证：`node analysis/check_layout_editor.cjs`、`python analysis/check_layout_editor.py`（7 项）、`node analysis/check_layout_editor_browser.cjs` 全部通过。浏览器逐类搜索、放置、升至 10 级，确认导出、重新导入及刷新恢复后数据相同。Python 检查验证 40101、40205、40310 原编号及坐标编译。浏览器导出文件另经 `python tools/import_pve_layout.py .local/layout-editor/browser/exported-traps.json --check` 通过，`applied=false`。检查中的显式应用仅在测试隔离目录执行。

运行时观察：仅限编辑器浏览器操作；截图为 `.local/layout-editor/browser/traps-desktop.png`，导出文件为同目录 `exported-traps.json`。未向游戏应用测试布局，未修改设备。

待办：用户重新打开 HTML 后确认入口与编辑效果；实际关卡陷阱触发效果须在接入用户布局后复测。
