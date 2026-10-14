# 原流程本地适配

方向：保留原客户端程序逻辑、界面和流程，只把失效的服务器依赖换成本地数据与本地回执。禁止另建主城场景，禁止用八座测试建筑冒充初始城池。

运行时踩坑、控制器缓存、联盟桩、灰确认与调试步骤见根目录 **[NATIVE-ADAPTER-NOTES.md](../native/NATIVE-ADAPTER-NOTES.md)**。本轮建造/引导/资源/宝石加速的符号与禁止项见 **[NATIVE-DEV-CONTEXT.md](../native/NATIVE-DEV-CONTEXT.md)**。

## 入口

双击 `启动原流程本地适配.cmd`，或：

```powershell
python F:\kdzlj\analysis\build_native.py
powershell -File F:\kdzlj\Launch-Native.ps1
```

包名仍为 `com.netease.h1.qihoo`。交付包 `dino-local-native.apk`。存档键 `dino.local.native.v1`。

## 行为

1. 入口仍是原版 MainMenu。点击登录/进入后，适配层调用原版 `ClientPlayer.rpc_c_start_game(levelDict)`。
2. `levelDict` 形态与协议研究一致：`player`、`units`、`walls`、`model_info`、`hero_donate_list`、`user_config`。见 `analysis/native-init-protocol.json`。
3. 首次进入若无存档，写入 **推断最小初始城**：`20101`、`20601`、`21201`、`20201`、`20401`（龙首之城/龙英巢/建筑师小屋/日光井/龙银矿）。**不含**驯龙场；**不是** 旧预览的八座测试布局；`301`/`205`/`203` 按教程表应在引导中建造。
4. 占地坐标目前是 `MAP_SIZE_BUILD` 内的占位格，来源字段标为 `inferred-rookie-minimal-201-206-212-202-204`。旧档若仍预置 `20701`，进游戏时会自动去掉并补齐日光井/龙银矿。真实服务器 `start_game` 样例补齐后应替换。
5. `callServer` 被本地拦截：`rpc_s_set_user_config` 写入存档；建造/升级/移动尝试回 `rpc_c_ans_*` / `rpc_c_set_to_tile`；主城 `dumpLevelData` 成功后回写存档。

## 构建

```powershell
python F:\kdzlj\analysis\build_native.py
```

实现文件：`analysis/native_boot.js`。使用交付用 `local_hook.cpp`，不读外部研究脚本。构建时先用 apktool 重编译 Java 桥接代码，包含本地错误日志补丁，避免使用旧的 `classes.dex`。

## 龙弹堡修复验收（2026-10-14）

用户已确认剧情入侵战斗中的龙弹堡恢复主动攻击。修正为补齐回放内的 `replay.seed`，由原版 AI 自行索敌、发射并计算伤害。原引擎文本记录另确认累计输出 270 点伤害，见 [NATIVE-BATTLE-HANDOFF.md](../native/NATIVE-BATTLE-HANDOFF.md)。

当前包哈希以 [dino-local-native.apk.sha256](../../dino-local-native.apk.sha256) 为准。继续游戏保留原存档，无需为这项修复清数据。自然结算和后续剧情尚未单独确认。

## 入口修复验证（2026-10-13）

绿色按钮的协议检查会调用 `MainMenu.isLegalAgreed()`。此前适配层把它改为布尔值，打断原按钮回调。现已保留函数形式，返回已同意状态。

真机加载停住的直接原因是错误上传器。初始化异常触发 `AppErrorReport.handleError` 后，旧上传器访问失效地址。RMX3823 的网络访问遭拒，抛出 `SecurityException`，导致 GLThread 退出，画面停在加载页。现将这项上传依赖替换为 Android 本地日志，标签为 `DinoLocalError`。

交付包已在逍遥实例 1 和 RMX3823（Android 16）覆盖安装验证。两台设备均能通过绿色按钮进入原版主城；强杀后通过“本地进入”也能继续进入。本次没有清除应用数据。截图与验证记录见 `analysis/native-entry-fix-verification.json`。

本次只修复入口和加载中断。日志仍有 `MenuControllerBuild.js:1251` 的 `config is undefined`，以及 `GameControllerBuild.js:2259` 的 `dict is undefined`。它们目前不会再因错误上传器导致渲染线程退出；对应的初始化数据与新手引导仍需继续适配。

## 已验证（2026-10-12）

- `rpc_c_start_game` → `changeStageAndInit(BUILD)` → `initLevelFromData` 可走通；五座推断建筑 `20101`/`20601`/`21201`/`20201`/`20401` 均可创建。
- `initByServer` 离线仍会因 SocialBox `logs` 抛错；适配层软捕获并回填 `nickname`/`exp` 等，`__buildUnit` 继续。
- `G_League` 用方法桩（不要把真 `ClientLeague` 注册进 UnitManager）。
- HUD：`UserName`=`LocalRookie`；头像下蓝条是 `menu.exp`（经验），写入 `player.exp=0` 后不再显示 `undefined`。
- **灰确认是原版主城门槛**：驯龙场 `20701.rely_base_lv=2`，一级龙首之城时确认键保持灰色。适配层**不会**强行点亮；可点橙色 X 取消。开局**不**预置 207，由教程后续引导建造。
- **继续游戏**：清数据首次进入写入 `dino.local.native.v1` 后，强杀再进可读回单位与昵称（`created=false` 路径）。
- 状态环：`dino.local.native.status`（`latest` + `log`）。

## 已知缺口

- 敌袭村庄、敌军、去重与龙弹堡主动攻击已获用户确认。固定时间兜底回城已撤销；自然结算和剧情续接仍待验。真实士兵阵容与完整回放记录仍未恢复。
- 起步资源：钻石 150 已验证；龙币/日光依赖 ResourceHolder 注入，以 HUD 与 status `seed-starter-res` 为准。
- Rookie 位布局未完全逆向；精确初始坐标、`model_info` 仍缺真实样例。
- 旧 `dino-local-cityui` 等包仅作对照，不再往独立预览场景加玩法。

## 验证建议

1. 仅需验证全新账号时才清数据；日常继续游戏保留存档。新账号预期：五座推断城（无驯龙场）；HUD 龙币/日光约 5000、钻石 150；开场引导出现。旧档带驯龙场时覆盖安装后进游戏会自动迁移。
2. 引导建 301：status 见 `callServer-rpc_s_build` → `ans-build`；宝石加速见 `finishViaBuilder-ok` / `force-finish-ok`，建筑仍在。
3. 建完后剧情：status 见 `resolveBattleClient`（`hasClient`）→ `_createBattleUnitWhenInit-exit` / `battle-units-force-create.now>0`，敌袭页应有村庄建筑；约 3 秒或倒计时结束可见 stub 进攻龙（`spawnStubAttackers`）。龙弹堡应按原版逻辑主动攻击。结束应由原版条件或正常倒计时触发；返回后还需核对剧情和进度。
4. 放置后点橙色 X：不扣费、不落库。重复完工回执不重复扣费。
5. 强杀再进：建筑、`user_config`、资源与教程进度一致。

主验收环境仍为逍遥实例 1（`127.0.0.1:21513`，DirectX）。真机 RMX3823 入口与继续游戏已验证。早期加载卡住截图在 `analysis/native-phone-verify/`。
