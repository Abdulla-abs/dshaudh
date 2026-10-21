# 主线「完成关卡」通关后不完成

状态：原版函数定向检查及回归通过，已保留数据覆盖安装实例 1；设备迁移与任务页面待验证。

触发：用户报告完成「战斗援军」后主线仍未完成。

原代码证据：`QuestManager.get_mt_stage` 读取 `G_Player.availableStages[config.mt_stage][3]`，仅在该值大于零时返回 1；不读取星级。原表 `main_task[300418].mt_stage=3`。旧本地 `applyPveStageProgress` 只更新星级，原样保留第 4 项为 0。此前契约将该项记作 `remain` 的解释撤销。

运行时观察：`.local/quest-stage/before/databases.tar` 是安装前实例 1 数据库备份。当前主线为 `300418`，第 1～9 关记录均为 `[0,0,3,0]`，第 10 关无星。第 3 关已三星但原版任务判断仍返回 0。用户报告的关卡中文名与第三关的对应未另作文本表确认，存档中的当前任务目标已确认。

修改：`analysis/native_boot.js` 的 `applyPveStageProgress` 在胜利时补正数完成标记；`ensureAvailableStages` 用已有正星级修复旧档缺失标记。已有正值保留，无星关卡不补。只写最小正值 1，不推测原服完整计数或时间语义，不重发奖励或自动领取任务。进游戏沿原版任务页面判断完成。

验证：`node analysis/check_native_pve_quest.cjs` 直接执行原版 `get_mt_stage`，覆盖旧三星记录复现、修复、无星不误完成、已有值保留、重复迁移、序列化续读、胜利／失败和下一关解锁。语法、`check_native_pve_settle.cjs`、`check_native_quest_contract.cjs`、`check_native_pve_enter.cjs`、`check_native_save_safety.cjs`、`check_native_pve_sweep.cjs` 均通过。构建首次读取中间 APK 失败，重试成功，包 SHA256 `b30419f6f313e7638137ac112deab1ee97c40c17e6130a5d1b536d6dd1d5ac08`，ADB `install -r` 返回 Success，已启动实例 1 游戏。

待办：登录后核对旧档标记持久化，以及任务显示可领取；实际领取／下一环由用户复测确认。
