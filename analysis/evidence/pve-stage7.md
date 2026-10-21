# 第七关参考图防御布局

状态：已按用户导出的布局替换并保留数据覆盖安装，离线通过，游戏内待复测。旧估算复刻未通过用户验收。

三角龙不显示修复：用户确认前一版没有显示。设备记录 `_createBattleUnitWhenInit-ERR(typeid=10501)`，错误为 `this.componentList.TileHolder is undefined`，三次重试均创建失败。取证在 `.local/pve-stage7-guard-missing/databases.tar` 和同目录状态 JSON。先前只验证数据关联，未执行原版创建函数，因此没有覆盖该错误。

确定根因：`tools/import_pve_layout.py` 将驻防建筑的 `x/y` 同时写进守军。原版 `GameControllerBattle.createUnit` 见坐标会调用 `Unit.setToTile`，该函数直接访问 `TileHolder`；移动英雄不具备此建筑组件。现删除守军格子坐标，由 `_setupAllUnit` 读取 `did` 后调用 `setAtDefensePos`。建筑与围墙坐标保留。

修复验证：`node analysis/check_native_guard_spawn.cjs` 直接执行原版 `createUnit`、`_createBattleUnitWhenInit` 和 `_setupAllUnit`，旧带坐标数据复现相同错误，新数据成功登记为防守英雄并调用龙弹堡定位、`comeToWorld`。进场、导入工具和结算检查通过。APK SHA256 为 `01d2614a52d0513adac541d570c9cd235d13dd1a1cefdc356904a0547a9bfd56`。备份 `.local/pve-stage7-guard-missing/before-install.tar` 后覆盖安装实例 1 返回 Success，已启动；修复后游戏内显示仍待复测。

后续驻防补充：用户明确要求给龙弹堡驻防 1 级三角龙。现新增守军 `g1/typeid=10501/level=1/anchorId=b3`，编译为 `sid=107010,did=107003,state=2,lv=1`。其余 9 个建筑、64 段墙、坐标和等级保留。原版 `_createBattleUnitWhenInit` 读取 `did`，`_setupAllUnit` 再调用 `getDefenseID` 和 `setAtDefensePos`；单人战斗确实使用建筑关联的防守流程。原版英雄 AI 继续处理巡逻与索敌。

驻防验证与安装：进场检查确认三角龙的一级成长、驻防状态、防守阵营、基础技能及 `did` 指向龙弹堡真实 SID；结算和编辑器核心检查通过。构建 SHA256 为 `e79e36c62477828ad843b110929c04bcae9f9d45c3a71a351fae586a3bb0ca2b`。备份 `.local/pve-stage7-garrison/before-install/databases.tar` 后保留数据覆盖安装实例 1，返回 Success，已启动。设备实际三角龙驻守和交战尚待复测。

用户文件接入：输入为 `C:/Users/ZoomLink/Downloads/第7关-布局.json`，已保存原始副本 `inputs/pve-stage7/user-layout.json`。通过 `tools/import_pve_layout.py --check` 后显式应用到 `analysis/rpc-contracts/pve-layouts/stage-7.json` 及运行时注册表。共 9 个建筑／旗子、64 段城墙、0 名守军；建筑均为 1 级。文件配置两座日光皿、未放日光井、守军为空。本次严格按文件保留，未补入先前截图要求的三角龙。

本次验证：进场检查直接读取当前注册表，与用户文件逐项比较建筑类型、坐标、墙等级及坐标，并确认优先于旧估算布局。结算、龙兵、联机、通缉令及编辑器核心检查通过。首次进场测试因 fixture 未提供 `unit_main` 失败，补齐测试表后通过，未改运行时代码猜参数。

本次交付：APK SHA256 为 `8adb96e3f451383eb912d049aa3f79f4a31e1700dde37f4ac4c693cf3daee7a1`。存档备份 `.local/pve-stage7-user/before-install/databases.tar`；专用实例 1（ADB `127.0.0.1:21513`）覆盖安装返回 Success，已启动。未清数据、未解锁关卡，实际第七关视觉和战斗待复测。

以下为旧估算布局调查记录，不能作为当前第七关配置。

用户要求：按提供截图还原单人第七关。包含大本营、龙币库、日光皿、龙银矿、日光井、龙弹堡、剑龙塔、投石器，以及一面旗和 1 级防守三角龙。参考输入保存为 `inputs/pve-stage7/reference.png`。

原代码证据：`unit_main` 和 `string_data` 确认各建筑及三角龙类型。原版战斗从 `oppo.units` 创建建筑和英雄，从 `oppo.player.walls` 创建围墙。墙记录为 `[等级,x,y,损坏比例]`。英雄 `did` 指向旗子，原版 `Unit.setAtDefensePos` 计算驻守位置；`HeroBattleController` 处理索敌和巡逻。定向反编译在 `.local/pve-stage7/`。

修改：新增 `buildStageSevenVillage`，只在第七关选择此布局。共 8 座一级建筑、1 面旗、1 只一级三角龙和 108 段一级墙。坐标及具体旗款依据截图推定，旗子采用原版恐龙部落旗 50701，未声称恢复官方服务器坐标。完整坐标见 `analysis/rpc-contracts/pve-stage7.json`。

适配细节：原版进场会把数组下标写入 `id`，本布局标记保留稳定 SID，保证守军能找到旗子。旗子属于原版场景物件，去重检查补入 `sceneObj`；不改变其战斗阵营。旗子原表缺 `volume`，补驻守半径 1，避免原版定位生成 NaN。关卡奖励继续使用原表和当前存档数据。

验证：`check_native_pve_stage7.cjs` 覆盖建筑清单、建筑及墙格不重叠、墙段去重、原版炮塔技能、一级三角龙，以及原版旗边定位。进场、结算、联机、荒野探险和每日任务检查通过。旧 `check_native_replay.cjs` 的起始英雄测试因 fixture 缺 `data` 抛错，本轮未扩修该测试；定向 `check_native_raid_end.cjs` 通过。

构建：APK SHA256 为 `f7849b363beb9173c23410ebfc3c55681812a68ef7b5c31369b4b7b925e8d482`。安装前备份在 `.local/pve-stage7/before-install/databases.tar`。

待复测：第七关实际进场的建筑相对位置、围墙视觉、旗边三角龙巡逻与交战。布局可运行检查不等于截图视觉验收。
