# 每日任务全部显示问号奖励

状态：已修复，离线通过并保留数据覆盖安装。设备存档已验证，页面待复测。

用户观察：正常页面显示资源图标与数量；当前每条任务均显示问号盒子。

原代码证据：`QuestManager.getQuest` 返回 `[questData.current[questID], clientQuestData.current[questID]]`。`UI.GameEventBox.refreshReward` 直接读取 `quest[0].reward`，不存在或为空时将第一个奖励设为 `[INPUT_TYPE_UNKNOWN,0]`，并隐藏第二个奖励。问号盒子是这个明确的缺数据分支。

本地代码证据：`seedDailyQuestRoots` 创建 `current[rootId]={}`，后续任务和刷新路径也写空对象。`collectQuestPutinRewards` 只在领取时发奖，不负责列表中的 `current[questId].reward`。因此此前列表、领取回执的修复遗漏了展示字段。

运行时观察：实例 1 的存档中共有 34 条每日任务，带有非空 `reward` 的为 0。原始备份在 `.local/dragon-soldier/before/databases.tar`，按字段提取结果在 `.local/quest-reward/observed.json`。本次没有通过游戏内点击复测领取数量。

奖励表证据：原包 `daily_task[3807]` 是孵化 20 个龙兵，`mt_putin=80307`；对应资源事件给日光，后继 80324 给道具 1123。原包配置仍在，不能把问号图标归因于奖励图标资源缺失。页面只展示最多两项。截图中的固定数值来自另一账号或版本，不宜直接照抄。

修复方向：按原包 `mt_putin` 事件生成只读奖励预览，填入每条当前任务的 `reward`；覆盖旧档、初次种子、刷新和后续任务。资源数量须与实际发奖的等级计算一致，生成预览时不能发奖或推进随机计数。主线也使用同一展示组件，需同时核对。

取证：本轮定向反编译输出在 `.local/quest-reward/GameEvents.js`，`UI.GameEventBox.refreshReward` 位于 797 行；原版任务读取位于既有 `analysis/disasm/QuestManager.decompiled.js` 的 `getQuest`。

离线验证：直接调用原版 `refreshReward`。传入 `{}` 时得到 `[INPUT_TYPE_UNKNOWN,0]`，第二栏隐藏；传入资源及物品奖励时显示资源并开启第二栏，断言通过。该检查确认缺字段足以重现当前展示，不代表设备已修复。

修复：`previewQuestRewards` 从原包事件生成资源和固定物品的只读预览；`ensureQuestRewardPreviews` 补全旧档当前任务并保留进度。登录、列表、刷新和后续每日／主线回执均携带奖励。预览不调用发奖函数，也不推进随机计数。原包每日物品事件均为固定奖励。

修复验证：`node analysis/check_native_quest_contract.cjs` 覆盖全部每日种子、旧档进度、幂等性、预览无发奖副作用、每日和主线后续回执，以及原版显示函数。龙兵检查也通过。构建 SHA256 为 `c5be27d2855b76ffb031a81412db50a27a0ed83dde98b417d497c62b3856164b`，实例 1 覆盖安装返回 Success。备份为 `.local/quest-reward/before-install/databases.tar`。

运行时复核：登录后数据库备份 `.local/quest-reward/after-login/databases.tar` 确认 34 条每日任务全部带有非空奖励；抽样为日光 3250 和道具 1123 × 10。原页面实际渲染尚未截图确认，不据安装成功宣称界面验收。
