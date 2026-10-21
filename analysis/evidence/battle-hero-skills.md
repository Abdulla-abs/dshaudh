# 战斗中缺少英雄技能图标

状态：离线通过，已保留存档覆盖安装到实例 1，实际战斗待复测。

用户观察：进入战斗后没有英雄头顶的可点击技能图标。

原代码证据：主城 `Comp.SkillManager` 从 `params.skill_slots` 读取 `{sid,lv}`。战斗 `StaticBattleController.init` 从 `params.skills` 读取完整技能编号，缺失时只用基础攻击配置。适配层 `collectAttackHerosForPve` 原先仅复制主城英雄记录，没有生成战斗技能数组。

原流程：`HeroBattleController._delayedInit` 为非回放的己方英雄创建 `UI.HeroOpratePanel`。技能判定需要提示时调用 `doCastActiveSkill`，经 `showSkillFlag` 显示头顶标识。`SkillFlagController.onTouchEnded` 调用原版 `releaseByUser`，由目标、自身或位置分支请求施放。图标受技能可用性、目标和冷却影响，不是所有时刻常驻。

修改：新增 `prepareHeroBattleSkills`，按角色类型和变异索引取得基础技能，再追加携带技能的 `sid * 100 + lv`。去重并验证原技能表。仅修改出征副本，保留主城技能槽。单人战斗和复用进场数据的联机适配共用此转换。保留原图标、触摸、冷却、目标及施放逻辑。

离线验证：`check_native_battle_skill.cjs` 调用原版技能初始化、显示分发和点击释放方法，确认迪诺的技能列表为 `[10401,1000001]`，基础攻击在首位、携带技能被识别为主动技能，点击请求正确技能和目标。检查变异基础攻击仍按原表选择。单人进场和联机契约检查通过，语法检查通过。定向解码位于 `.local/battle-skill/`。

交付：2026-10-15 构建 SHA256 为 `799b68956405ecd4564198fafc70813cc19fff6d2f16bbc2712b4147fc0a785a`。安装前备份 `.local/battle-skill/device-before.tar`。专用 `127.0.0.1:21513` 执行 `pm install -r` 返回 `Success`，已启动游戏。

待复测：实际出征后，确认技能满足条件时出现头顶图标，点击可释放并进入原冷却流程。本轮尚无修复后实战观察或用户确认。

录屏规则核对：用户提供的原游戏录屏显示左侧“自动施法”按钮控制释放方式。原版 `resetBattleValues` 设置 `autoAttack=false`；`MenuControllerBattle.PressAutoAttack` 切换状态，`refreshAutoAttackButton` 刷新按钮。`StaticBattleController.__checkCastActiveSkill` 读取 `GameControllerBattle.isAutoAttack` 并传入 `doCastActiveSkill`。关闭时走头顶图标与点击释放；开启时按原技能限制自动施放。

本次补充检查：`check_native_battle_skill.cjs` 调用原版按钮与控制器方法，验证“默认手动 → 点击开启自动 → 再次关闭恢复手动”，并确认手动分支不会自动施放。检查通过。此前出征技能修复保留了以上原逻辑；本次仅补检查和证据，未修改运行时代码，未重新安装。录屏是原游戏行为证据，当前适配版仍待实战复测。

手动模式回归（2026-10-15）：用户确认关闭自动施法仍会自行释放，上一轮隔离测试不足以验收实战。原代码 `doCastActiveSkill` 在无 `operatePanel` 的非回放战斗中直接调用 `_realDoCastSkill`，该分支不要求自动模式。已确认这是绕过手动图标的一条代码路径；当前设备是否正由面板缺失触发，仍属待运行时确认，未将推断写成观察。

新增保护：仅对非回放己方英雄，以原控制器 `isAutoAttack() === true` 为准。手动模式面板缺失时创建原版 `HeroOpratePanel`；创建失败则等待，不直接释放。阻止手动模式执行 `tryOnceAutoAttack`。保留点击释放方法和自动模式原技能限制。避免延迟初始化重复创建面板。日志 `hero-skill-dispatch` 记录实际模式和面板状态，`manual-skill-panel-ERR` 记录初始化失败。

新增验证：缺面板、调用方自动标志与按钮不一致、手动释放队列、自动开关、面板失败、回放不受影响，均通过；单人进场和语法检查通过。已构建并保留数据覆盖安装实例 1，返回 `Success`，已启动游戏。包 SHA256 为 `55fcbbd1726ed0acd8e7a0780e380763ba00efe39fb63d39db5bea7738a221bd`；备份 `.local/manual-cast/device-before.tar`。本次保护仍待实际战斗复测。
