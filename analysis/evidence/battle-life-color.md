# 战斗血条阵营颜色

状态：离线通过；已备份存档，保留数据覆盖安装并重启实例 1；实际战斗画面待复测。

触发：首次账号教程入侵，以及随机侦察、通缉令、单人关卡、荒野探险中的血条颜色。

原代码证据：原包 `BattleController.jsc` 的 `BaseBattleController._initLifeBar` 在非回放时读取 `G_Player.faction`。`LifeBarSimple.init` 已有友军绿色、敌军紫色设置；英雄继承此组件。`setPercentage` 和 `progressToPercentage` 会把友军颜色按血量插值成黄色或红色。`BaseConfig.jsc` 的原版颜色为绿色 `{r:140,g:245,b:70}`、紫色 `{r:220,g:0,b:255}`。

根因：适配层 `ensureBattleClients` 把 `G_Player` 绑定到防守方。战斗初始化对单人关卡也调用此函数，随后创建血条时会把进攻方判为敌军。检查脚本执行现有绑定函数和原版血条函数，已复现己方进攻单位被判为敌军。原版 `GameController.getStageClient` 返回防守方，教程回放原本应以防守方为友军；未证明教程画面存在相同的反色根因。

修改：`analysis/native_boot.js` 新增 `installBattleLifeBarColors`。教程入侵按防守方判定友军，非回放出征按进攻方判定友军。按用户补充要求，撤销固定颜色覆盖，只校正血条的友敌归属。友军保留原版随血量从绿向黄、红渐变的效果，敌军保留原版紫色。`setPercentage` 和 `progressToPercentage` 使用原函数，保留血条池、位置、显隐、英雄等级和阵营图标；不修改单位阵营或索敌。其他普通回放保留原视角，中立单位保留原逻辑。

验证：`node analysis/check_native_battle_life_color.cjs` 通过。直接运行原版英雄／普通血条创建与血量函数，检查两种战斗视角下的双方单位、低血量、回血、动画及池复用。随机侦察、通缉令、单人关卡和荒野探险共用非回放视角；模式名称的用例标签不代表已运行各模式完整流程。`node --check analysis/native_boot.js`、单人进场检查及战斗技能检查通过。额外的 `check_native_replay.cjs` 在加载初始英雄时因旧测试环境缺少 `data` 报错，未执行到回放断言，本轮未修改此检查。

本次补充验证：定向检查确认血量更新和动画函数未被替换；友军在满血、低血、归零及回血时符合原版插值，敌军保持紫色。语法检查通过。

运行时观察：恢复渐变后的 APK 构建、签名和实例 1 的覆盖安装成功，ADB 重启成功。备份和构建日志在 `.local/battle-life-color/`，本次构建日志为 `build-restore-gradient.log`。未清数据、未新建账号。

用户确认：待用户实战复测教程入侵与各出征模式的实际画面。
