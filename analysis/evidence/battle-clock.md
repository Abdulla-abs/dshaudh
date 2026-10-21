# 战斗回城后动画和倒计时加速

状态：恢复补丁离线通过；实际加速根因未确认，设备效果待复测。

用户观察：荒野探险进攻成功后回主城，阳光特效、粒子、资源增加动画变快，再进入战斗选择页时冷却倒计时也变快。

原代码证据：`GameControllerBattle._setInternal` 在战斗中开启固定帧间隔；倍率方法同时设置 Scheduler 的 `timeScale`。`onBattleFinished` 恢复倍率 1、关闭固定帧间隔，并恢复 Director 和 Application 的帧间隔。原版 `main`、`Start` 使用非固定时间步长和 `1 / 30` 帧间隔。相关反汇编见既有 `analysis/disasm/GameControllerBattle.disasm.txt`；本轮启动函数反编译在 `.local/battle-clock/`。

运行时观察：设备备份中的结算轨迹包含 `onBattleFinished` 的 enter 和 exit，随后调用 `rpc_s_battle_to_home`。该轨迹未记录计时器倍率，不能证明恢复后的值。原始数据库备份为 `.local/battle-clock/before-databases.tar`，提取轨迹为同目录 `dino.local.native.settle.trace.json`。

推断：全局计时状态异常可能共同影响这些表现，但“未执行正常结算”不受本次轨迹支持。现有 Java `onDrawFrame` 不使用 `sAnimationInterval` 限帧，历史记录确认忙等已移除；它是否参与本次异常尚未验证，本轮未改渲染器。

修改：`LocalNative.restoreHomeClock` 在原版主城 `initLevelFromData` 前恢复 Scheduler 倍率 1、非固定步长，以及 Director 和 Application 的 `1 / 30` 间隔。记录恢复前后倍率、间隔及异常。保留战斗中的原倍率控制、主城初始化和存档。该措施覆盖回城边界，不代表已证明根因。

验证：`node analysis/check_native_battle_clock.cjs` 通过，覆盖加速回城、普通回城、连续回城、原初始化返回值，以及单项恢复异常不妨碍其他恢复。`node --check analysis/native_boot.js` 通过，APK 构建成功。

交付：已备份存档，使用 `pm install -r` 保留数据覆盖安装实例 1，返回 Success，并启动游戏。APK SHA256 为 `c4859969e9c94cbd91feb2d2d2496ffde5157a3b900047ee73a09bbaf282bd3a`。安装成功不等于游戏内验收。

待复测：荒野探险胜利回城后，对照真实经过 10 秒观察冷却是否约减少 10 秒，并观察资源与粒子动画。若仍加速，先采集 `home-clock-restore` 记录和实际帧时间探针，不能重复猜参数。
