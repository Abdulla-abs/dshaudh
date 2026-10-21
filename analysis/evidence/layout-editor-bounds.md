# 编辑器与游戏地图边界统一

状态：离线及真实浏览器检查通过，已重建 `artifacts/关卡布局编辑器.html`。本轮未重新构建或安装游戏，设备仍为上一轮越界修正版。

触发：用户怀疑编辑器允许在游戏地图外放置建筑，要求检查边界一致性。

原代码证据：旧 `core.validate`、`editor.inBounds`、属性输入、画墙端点均按 0～63；网格显示 64×64。Python 通用导入器也仅检查此数据范围。这解释了原第 8 关布局虽然落在游戏地图外，仍能通过旧编辑器检查。

游戏边界：原版 `world1.tmx` 地形为 60×60，`GameLogicLayer` 的 `Building=1` 格恰好为 x、y 各 11～48。地图逐格检查见 `analysis/check_scout_map_bounds.py` 和 `analysis/evidence/scout-map-bounds.md`。

修改：新增共享契约 `analysis/rpc-contracts/layout-map.json`，由编辑器构建器注入单文件 HTML，JS 校验和 Python 导入器共用，侦察编译器复用后者。画布改为 60×60 地形，绿色背景和边框标出可建造区域，外围灰色不可放置；提示栏显示坐标范围。属性输入最小锚点按建筑宽高调整。放置、拖动、键盘移动、精确坐标、画墙、复制、导入及导出检查均覆盖完整占地。旧格式 `map.width/height=64` 保留为兼容元数据。

验证：`node analysis/check_layout_editor.cjs`、`python analysis/check_layout_editor.py`（8 项）、`python analysis/check_scout_map_bounds.py`、`python analysis/check_scout_pool.py`、`node analysis/check_layout_editor_browser.cjs` 通过。真实 Chrome 覆盖拒绝边缘越界占地、手填越界坐标回退、越界拖动回退、墙笔刷边界截断、拒绝旧第 8 关越界文件且保留当前布局；原有装饰、陷阱、守军、导入导出、撤销恢复、自动保存及手机宽度检查也通过。

视觉检查：已查看 `.local/layout-editor/browser/empty-desktop.png`，绿色可建造区与灰色外围区清楚可辨。浏览器日志在 `.local/layout-editor-bounds/browser.log`，交互截图和结果在 `.local/layout-editor/browser/`。

运行时观察：已在真实浏览器操作重建的离线 HTML。用户确认：待重新打开 HTML 验收。旧越界文件不会自动修改；无效本机草稿保留原存储。下一步仅需用户用新版编辑器继续制作布局。
