# 左上角头像与成就

状态：离线通过，已保留存档安装实例 1，游戏内待复测。

触发：主城左上角头像空白／点不开；成就页领取无钻石或经验、重登进度丢失。

根因：
1. 本地种子与战斗占位把 `avatar_id` 写成 `0`，原表 `data.player_head` 无此键；`MenuControllerBuild.refreshAvatar` 读 `config.head_resource` 抛 `config is undefined`（设备 `MenuBuild.refreshAvatar-soft`）。
2. `rpc_s_change_avatar`／`rpc_s_buy_avatar`／`rpc_s_gain_achieve` 此前未接；成就奖励在原表走 `input_id`→`input_event_client` 资源链，另有 `reward_exp` 需加经验。

证据：
- 原版：`Personalize.changeAvatar`／`unlockAvatar`，`AchievementRecorder.gainAchievement`，`AvataInfo` 购买与领取，`ClientPlayer.rpc_c_unlock_avatar`。
- 表：`player_head` 默认拥有 6／36；成就 `input_id` 与 `reward_gem` 资源数额一致（90／90）。
- 运行：`.local/arena-audit/final-ready/status.json` 的 `MenuBuild.refreshAvatar-soft`。

修改：`analysis/native_boot.js` — `ensureAvatarFields`／组件种子与主城快照；`handleChangeAvatar`／`handleBuyAvatar`／`handleGainAchieve` 及 `installCallServer` 分流。

验证：`node analysis/check_native_avatar_achieve.cjs` 通过。

交付：已备份 `.local/avatar-achieve/before-save.tar`，实例 1 覆盖安装 Success。安装前后 9 个存档文件一致，包内启动脚本与源码一致，已启动游戏。APK SHA-256：`c5d6eca2a1cfe2ee76c959396929b5b04cd778ac9078b192fac03af154bbe824`。

待办：点左上角头像确认肖像显示；换装、购买一头像、领取一条可领成就并重登。安装不等于游戏内验收。
