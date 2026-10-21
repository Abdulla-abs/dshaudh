# 61 级小盗龙施法后原地卡住

状态：离线通过，已覆盖安装实例 1；已把第三技能改回破釜沉舟便于复测。

触发：释放技能后原地卡住；拖动可恢复；目标摧毁后再卡住。换成邪恶切割后曾确认正常。

## 施法后寻敌链路（原版）

1. 点技能 → 记技能／导演脚本 → 进攻击态  
2. `onAttackUpdate` 用当前 `this.targetID`（或导演脚本目标）做 `canApply`  
3. 结束 → `ATTACK_IDLE` → ThreatSystem 再寻敌  

静态单位：`onUserCastSkillToTarget` 不把参数目标写入 `this.targetID`（自身技路径会写）。英雄：导演脚本带目标，但 `onEventUserChangeToAttack` 未同步 `setTargetID`。ThreatSystem 在 `getUnit` 为空时仍 `getComponent`，抛错后 AI 停住。

友方目标主动技（`skill_type=2`，`target_faction=FRIEND`，`cast_to=TARGET`）原表约 145 个基底，含破釜沉舟、天神下凡、疾跑、格挡等；对敌技不受该错位影响。

## 修改

`analysis/native_boot.js` 的 `installActiveSkillSeekFix`（由 `installEngineGuards` 调用）：

- ThreatSystem 寻敌函数包 try/catch，失败时 `unLock`、清 `curTarget`、回 `null`  
- 静态：`onUserCastSkillToTarget`／`_realDoCastSkill` 施法前同步 `setTargetID`  
- 英雄：用户点目标施法后、以及 `onEventUserChangeToAttack` 时按导演脚本同步目标  

## 验证

`node analysis/check_native_active_skill_seek.cjs` 通过；`node --check analysis/native_boot.js` 通过。

待办：用户用破釜沉舟复测施法与击杀后再寻敌是否还卡。包 SHA256：`03d670d8f6910323b1815960af64b0274f8d662ad5c05cddd1d5c5740e374549`。
