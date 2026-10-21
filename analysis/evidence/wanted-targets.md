# 通缉目标普通攻击对地与对空

状态：首版用户复测失败，粉爆龙对空有动作但无伤害；区域筛选修正已安装实例 1，待复测。见 [伤害修正](wanted-air-hit.md)。

触发：通缉令的迪诺等地面目标无法攻击玩家的空中部队。用户要求通缉防守角色能攻击地面和空中部队。

原代码证据：`Skill.SimpleSkill.setTargetAirAvailable` 复制当前技能配置，再设置 `target_air=1`。`Skill.CheckSkillTargetValid` 读取 `target_air` 和 `target_ground`。`ThreatSystem.initSkill` 保存同一个普通攻击技能对象。原函数及字节码由 `analysis/inspect_wanted_targets.py` 输出至 `.local/wanted-targets/`。

修改：`LocalNative.handleWantedRpc` 在原版触发器创建通缉目标后，调用 `allowWantedTargetGroundAndAir`。仅复制此目标普通攻击的配置，设置对空、对地均为 1。伤害、射程、动作、目标阵营和单位类型限制保留；额外技能按原规则释放。出场日志的 `groundAndAir` 记录是否成功应用。

范围：低、中、高通缉目标。主城驻守、单人关卡、侦察及玩家自己的同名角色不受影响。这是用户指定的本地规则。

验证：`node analysis/check_native_wanted.cjs` 通过。覆盖全部 27 个有效目标、原版配置复制方法、共享表隔离、攻击其他属性不变，以及实际出场 RPC 调用。`node --check analysis/native_boot.js` 通过。离线检查只证明配置和接入，未把配置通过当成实际命中证据。

运行时观察：已保留数据覆盖安装并启动实例 1。安装前后全部 9 个存档文件哈希一致。备份见 `.local/wanted-targets/before-install/` 和 `after-install/`。尚未观察迪诺实际攻击飞行部队，用户未确认。

待办：实例 1 使用飞行部队进入迪诺通缉战斗，确认目标自然索敌、攻击并造成伤害，击败后正常结算。

## 对空伤害修正

用户确认高级粉爆龙攻击慈母龙没有伤害。根因为普通攻击引用的区域 10801 仍仅允许地面，首版只改技能目标标志未覆盖此层。现对通缉普通攻击创建出的区域实例复制配置，改为地空均可，再运行原伤害逻辑。详见 [伤害修正证据](wanted-air-hit.md)。
