# 本地主城界面 / 占地测试版

双击 `启动本地主城界面测试.cmd`，再点击原版入口的“进入游戏”。本版在生产建筑新建包之上，优先恢复建筑比例、等距占地与操作面板；保留采集、满级升级、114 系训练与日光井/龙银矿新建。

## 操作

1. 点击建筑：底部显示名称、等级、占地，以及适用的移动 / 采集 / 升级 / 训练按钮；不适用的按钮隐藏。
2. 选中时建筑下方显示绿色菱形占地（来自 `unit_main.tilesize_x/y`）。
3. **移动**：点“移动”后点地图候选格 → 绿=可放、红=重叠或越界 → “确认”才保存，“取消”不改位置。
4. **建造**：点“建造”进入放置；点地图出候选（可再点建造切换日光井/龙银矿）→ 确认才扣费开工，取消不扣费。
5. 升级仍为费用确认后再扣费；训练、采集逻辑与上一版相同。

拖动、缩放、复位保留。顶部为资源与镜头控件。

## 原规则（运行时已核对）

| 项目 | 来源与结论 |
| --- | --- |
| 缩放 | `(unit_resource.scale_rate \|\| 1) * OBJ_LAYER_SCALE`，`OBJ_LAYER_SCALE=0.5`；不再写死 `1.5` |
| 占地 | `data.unit_main.tilesize_x/y`：主城/龙英巢 4×4，生产/仓库 3×3，驯龙场 5×5，建筑师 2×2 |
| 网格 | `map/world1.tmx` 等距 64×47；中心 `x=1888+(tx-ty)*32`，`y=2773-(tx+ty)*23.5` |
| 可建范围 | `MAP_SIZE_BUILD`：`xmin/ymin=9`，`xmax/ymax=50` |
| 预览色 | `UI_COLOR_TILE_DRAGED_AVAILABLE` 绿 / `UNAVAILABLE` 红 |

存档键为 `dino.local.city.v12`。从 `v11`（及更早链）迁移时，按像素位置吸附到最近可放网格，冲突则螺旋搜索空位；调整写入 `migrationNotes`，不清空资源、等级、生产、施工与训练。

## 范围说明

操作面板为**本地面板**：可加载原版 `HomeBuildingActionBar` / `BuildingActionCard` 资源作对照，但未接完整 `UI.BuildActionBar` / `GameControllerBuild`（缺 Unit/stage 状态）。完整原版主城菜单与商店界面仍未恢复。英雄列表与战斗仍未恢复。

## 开发入口

```powershell
python analysis/make_cityui.py            # 由 mine_boot.js 生成 cityui_boot.js
python analysis/build_cityui.py           # 构建 dino-local-cityui.apk
python analysis/validate_cityui_smoke.py  # 烟测：迁移、取消、确认移动
```

修改功能时先改 `analysis/make_cityui.py`，再重新生成和构建。证据见 `analysis/cityui-validation.json`、`analysis/cityui-verified-*.png`、`analysis/cityui-delivery-entry.png`。原表研究见 `analysis/cityui-native-configs.json`。
