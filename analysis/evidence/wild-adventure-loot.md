# 荒野探险掉落与概率核对

状态：本地奖池已接，离线通过，待设备复测。

## 客户端可证实（原包）

| 项 | 证据 |
|---|---|
| 主城 5 级／每日 3 次／99 钻重置／间隔 360 秒 | `period_control[1000]`、`ADVENTURE_BASE_LEVEL_REQUIRE` |
| 初级／高级解封果 | `210021`／`210022`，10 合 1 |
| 不幸计数展示 | `period_control[62].num_limit=29`，UI `left+1` |
| 精确掉率表 | **不在客户端** |

## 本地规则（用户授权，参考网络资料）

抓捕结束（放过／讨好导致 finish／dead）时结算一次：

| 内容 | 规则 |
|---|---|
| 龙币 | 600–2200 |
| 日光 | 600–2200 |
| 钻石 | 8–45 |
| 出征英雄经验 | 40–120／人（`state=1`） |
| 初级解封果 `210021` | 基础 5%；付费重置后下一趟 +3% |
| 高级解封果 `210022` | 未出初级时独立 0.5% |
| 保底 | 不幸计数 `>=29`（约第 30 次）必出初级果并清零；出果也清零，否则 +1 |

实现：`LocalNative.adventureLootPolicy`／`applyAdventureCaptureLoot`；付费重置写 `localAdventureNextPaidBonus`。

## 验证

`node analysis/check_native_wild_adventure.cjs` PASS（含保底出果）。奖励卡片 UI 仍可后续补；资源／道具已落盘。
