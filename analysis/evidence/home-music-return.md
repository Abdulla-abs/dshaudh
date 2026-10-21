# 进攻返回主城后背景音乐消失

状态：2026-10-20 排查，根因未确认。未修改游戏代码，未构建或安装。

触发：用户报告首次登录有主城背景音乐，进入“战斗”的进攻玩法后回城，音乐似乎不再播放。

原代码证据：原包 `Client/MenuControllerBuild.jsc` 的 `onEnterWorld` 依次调用父类、`initLayout` 和 `startMusic`。`startMusic` 在 `soundEvent` 为空时调用 `playAndHoldSound(SND.BACKGROUND_BUILD)`；`preLeaveWorld` 调用 `stopMusic`，释放并清空句柄。`GameScene._leaveOldStage` 和 `_enterNextStage` 分别调度上述离开与进入回调。不是仅在首次登录时启动音乐。

原声音配置：`SND.BACKGROUND_BUILD` 对应 `H1_music/music/music_home`。`SoundManager` 的句柄从 1 起计数。`GameController.preChangeStageLeave` 会释放音频事件，原主城离开回调负责先清空菜单持有的句柄。

本地代码证据：`analysis/native_boot.js` 的 `protectSound` 保留原播放方法，只捕获声音异常。本地包装的 `MenuControllerBuild.onEnterWorld` 若遇异常，会记录 `MenuBuild.onEnterWorld-soft` 后返回。若父类或 `initLayout` 先抛错，后续 `startMusic` 不会执行。这只是可成立的条件，尚无本次设备证据。不能据此添加强制播放或改写生命周期。

离线验证：执行原声音管理器、原声音配置，以及原主城 `onEnterWorld/startMusic/stopMusic`。模拟进入主城、停止释放、再次进入，得到两次相同的主城音乐播放请求。注入 `initLayout` 异常时，第二次播放请求不会发生。此验证只覆盖函数顺序与后端请求，不证明设备听感，也不覆盖完整进攻界面流程。反汇编确认 `initLayout` 在 `startMusic` 之前。

运行时观察：只读专用实例 1（`127.0.0.1:21513`）。现有最近 10000 条 logcat 无目标音乐或回城记录；数据库状态日志保留 120 条，未包含本次回城或 `MenuBuild.onEnterWorld-soft`。结算轨迹只有 6 条战斗结束事件，不能判断回城音乐是否启动。未操作游戏界面或改写存档。

证据路径：原包定向反编译、反汇编、离线输出和只读数据库副本位于 `.local/home-music-return/`；离线输出为 `offline-probe.txt`。声音输入沿用 `.local/home-sound/{SoundManager,sound_data}.js`。

用户确认：用户报告了现象，具体进攻分支和恢复条件尚未确认。

待办：在原进攻流程复现一次，捕获主城离开和进入回调、`soundEvent`、声音异常及后端播放结果，再决定是否修改。当前未证明缺少恢复调用，也未排除运行时初始化或音频后端问题。
