# 布局编辑器地图装饰物

状态：编辑器和接入编译检查通过，用户待复测；游戏内显示未验证。

触发：用户要求将已查明的 29 种非商店地图对象加入离线编辑器。

原代码证据：对象列表见 [原表清单](map-decorations.md)。`unit_main` 中 60101～62901 为 `first_type=4` 的有效 1 级对象，名称取自 `string_data`，占地取自 `tilesize_x/y`。

修改：`tools/build_layout_decoration_catalog.cjs` 刷新目录中的 29 个家族，重复运行不会重复追加。`editor.js` 新增“植物”（16 种）、“石头”（9 种）、“生物”（4 种）分类，沿用现有色板、放置及属性操作。保留原版 1 级，不添加推测等级；不提供守军绑定。对象沿既有 `buildings` 字段保存，接入工具保留原版 typeid 和格子坐标。已重建 `artifacts/关卡布局编辑器.html`。

验证：核心 JavaScript 检查、Python 8 项检查和真实浏览器检查全部通过。浏览器逐一搜索并放置全部 29 种，确认单一等级、无守军入口，导出、重新导入及刷新恢复后数据一致；已有陷阱、建筑、守军、城墙及窄屏检查通过。Python 验证全部原编号编译及装饰物与墙重叠的拒绝。导出文件另经 `tools/import_pve_layout.py --check` 通过，29 个对象、`applied=false`。

运行时观察：仅限编辑器浏览器。截图 `.local/layout-editor/browser/decorations-desktop.png`，布局 `.local/layout-editor/browser/exported-decorations.json`。未将测试布局应用到游戏，未修改设备或关卡注册表。

待办：用户重新打开 HTML 验收；后续接入真实用户布局后验证游戏显示、地图资源选择及碰撞。
