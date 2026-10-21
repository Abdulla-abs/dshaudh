# 每日／主线任务领取与列表

状态：离线通过，已覆盖安装实例 1，待复测。

触发：任务面板空白；点领取后无奖励／下一环。

根因：
1. 列表：离线存档无 `event_counters[].d.current`／`main_quest` 种子；`GameEventsLayer.refreshDailyQuest` 只读 DER，不向服务器要列表。
2. 领取：`finishDailyQuest`／`finishMainQuest` 清 UI 后等 `rpc_c_finish_*_quest_ans`，本地原先未回执。

证据：`QuestManager` finish／refresh／`getDailyQuestOrderedDict`；`GameEventsLayer.refreshDailyQuest`；DER `getEventData`；表 `daily_task.game_event_roots`、`main_task.mt_next`。

修改：列表种子；领取／刷新回执；下一环各自 period；主线 `mt_next`。领取后只静默写 DER，禁止全量 `rpc_c_refresh_daily_event`（会触发 refresh→rpc_s_refresh 死循环卡死）。

验证：`node analysis/check_native_quest_contract.cjs` 通过；包 SHA256 `d3a7ea78879d1c375bff8a533b8afb7b893a23c6772805b7856d26c1a3fd8ce7`，实例 1 覆盖安装。

待办：若仍卡在旧风暴中请强杀重进；再点领一条已完成每日，确认流畅与奖励弹窗。
