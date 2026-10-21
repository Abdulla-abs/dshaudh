# 小绿龙入侵：开始按钮无效与本地数据

状态：出兵已用户确认；解锁指引重播见 [invasion-unlock-guide-replay.md](invasion-unlock-guide-replay.md)，离线通过待复测。主城驻守英雄未进场见 [invasion-garrison.md](invasion-garrison.md)。

触发：用户解锁「小绿龙入侵」后进入新手教程，点「开始」无效。

根因：独立 Invasion 模式。点开始走 `MenuControllerInvasion.onPressStart` → `InvasionStateMachine.ready` → `rpc_s_invasion_wave_ready`，须回 `rpc_c_start_wave({heroes,time,corner_type})`。本地此前未接任何 Invasion RPC。

原包数据（有）：
- `data.invasion`：54 波，时限／AI 池／等级／数量／首通与常规奖励／`need_rest`
- `data.invasion_hardness`：难度段 1–18／19–36／37–54
- `data.invasion_tutorial`／`data.invasion_honor`
- `AI_hero_id`（如 400101）即 `unit_main` 英雄 typeid，可直接作出兵 `heroes[].typeid`

修改：`analysis/native_boot.js` 接入
- `rpc_s_enter_invasion` → `handleEnterInvasion`（主城建筑进防守场）
- `rpc_s_invasion_wave_ready` → `handleInvasionWaveReady`（按当前波抽英雄回执）
- `rpc_s_invasion_wave_start`／`wave_end`／`leave`／`invasion_to_home`
- 波胜利按 `input_id_first`／`input_id` 发奖励并记 `localInvasionFirstWaves`

契约：`analysis/rpc-contracts/invasion.json`  
验证：`node analysis/check_native_invasion.cjs` PASS；`node --check analysis/native_boot.js` 通过。

待办：覆盖安装实例 1 后点「开始」确认出兵；再验一波胜利结算、休整与回城。荣誉击杀与商店／排行未接。
