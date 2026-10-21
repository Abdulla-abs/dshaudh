# 巷子里的猫建筑落到地图外

状态：离线检查通过，已保留存档覆盖安装并启动实例 1；修正后的游戏画面待复测。

后续编辑器修正：通用编辑器和单人导入器现也执行真实地形限制，与侦察池共用边界配置；下文“通用编辑器仍使用 64×64 数据画布”为当时状态，已由 `analysis/evidence/layout-editor-bounds.md` 更新。

触发：用户截图显示一份“巷子里的猫”关卡的建筑落在地图外。

原代码证据：`tools/import_pve_layout.py` 只验证编辑器的 64×64 数据范围。原版 `Resource` 的 `RS.MAP` 和 `RS.MAP_PVE` 均为 `map/world1.tmx`，PVP／PVE 背景均为 `map/ccb/sub_map_battle.ccbi`。`MapManager.canAttachToTile` 读取地形格的 `Building` 属性，值为 0 时不可放置。

地图证据：`analysis/apk/assets/res_ref/map/world1.tmx` 实际为 60×60 格，`GameLogicLayer` 中只有 GID 2 的 `Building=1`，恰好覆盖 x、y 各 11～48 的 38×38 方形。`analysis/check_scout_map_bounds.py` 解压 TMX 并逐格验证该范围。原版反编译仅放 `.local/scout-map-bounds/`，不作为新交付件。

定位：`alley-cat-8` 的完整建筑占地与墙范围为 x=37～63、y=38～63，454 个占用格超出可建造区域。另一份 `alley-cat` 为 x、y 各 13～37，没有此问题。由坐标与守军数量判断，截图对应 `alley-cat-8`；本轮未读取设备中的战斗关卡标识，因此此对应关系为推断。

修改：将 `analysis/rpc-contracts/scout-layouts/alley-cat-8.json` 的全部建筑和墙统一平移（-20，-20），修正后占地为 x=17～43、y=18～43。逐项反向平移比对与原布局完全相等，名称、对象种类、等级、守军、技能和关联均保留。原文件备份在 `.local/scout-map-bounds/alley-cat-8-before.json`。`tools/build_scout_pool.py` 新增真实可建造区域检查，覆盖完整建筑占地和墙，阻止类似布局入池。通用编辑器仍使用 64×64 数据画布，侦察池编译器执行更严格检查。

验证：新增地形检查先在旧布局上失败，再在平移后通过。`python analysis/check_scout_map_bounds.py` 通过，覆盖原版地形逐格验证、旧越界复现、修正布局、边缘墙及建筑锚点合法但占地越界。池编译同步、`check_scout_pool.py`、`check_native_scout_pool.cjs`、`check_native_pvp_contract.cjs` 和源码语法检查均通过。

设备观察：构建 APK SHA256 为 `02bae0bbf9e3b90f1ea349412bfa28acf450426017cb7208d40fde07228a56c9`，包内启动脚本与当前源码逐字节一致。专用实例 1（`127.0.0.1:21513`）覆盖安装返回 `Success`，启动返回 `Status: ok`，进程存在。安装前后全部 9 个存档文件内容一致。构建、备份、安装及核对记录在 `.local/scout-map-bounds/`。

用户确认：原越界现象已有截图。待复测：重新侦察到带 3 名守军的同名关卡，核对修正后的地图边缘与战斗。
