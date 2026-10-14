# 战斗按钮地区配置修复

2026-10-14，用户确认新流程正确。新手教程推进到“战斗”按钮时，点击没有反应。

实例 1 的日志记录了两次 `BattleSelect.js:96 config is undefined`。按钮已经进入原版 UI 创建链，但地区标题初始化中断。存档备份位于 `analysis/battle-button-1014`，玩家数据没有 `region_id`。

原版 `BattleSelect` 使用 `RankManager.getRegionID()` 查询 `data.v_server_h1global`，再读取 `v_server_name`。`ClientPlayer` 和 `RankManager` 字节码确认了地区表查询与 `region_id` 赋值。伪源码中部分函数标签错位，判断应结合反汇编。

修复位于 `analysis/native_boot.js` 的 `seedPlayerComponents`。有效地区保持原值；缺失或无效时，先查玩家保存的地区，再从原表选择开放、免费且允许进入的条目。地区选择属于本地兼容策略，不代表原服分配结果。原版界面和引导继续执行。

语法、地区回归、敌袭回归和自然结算回归均通过。新包已覆盖安装至逍遥实例 1，保留应用数据。SHA-256：`a74a1d4efbe56c2a23e5528e3af0985b70190c3634f385a6c6ce0895bcdfb3a4`。

待用户复测：重新启动并选择“本地进入”，点击“战斗”，确认原版选择界面打开。后续关卡进入仍需单独验证。
