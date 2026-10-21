# 第 16 关用户布局

状态：离线检查通过，已保留数据覆盖安装实例 1，游戏内待复测。

后续守军补充：用户要求额外增加 5 级三角龙，并固定一个技能。现新增 `g1/typeid=10501/level=5/anchorId=b8/skills=[14801]`，驻守现有龙弹堡。运行时为 `sid=116014/did=116008/state=2/lv=5/skills=[10501,14801]`。10501 为原有普通攻击，14801 为固定 1 级「冰枪」。13 个建筑和 71 段墙均保持不变。下文守军为 0 的描述仅记录最初导入。

技能证据：原版 `hero_to_skill[105].skill_id` 包含 148，`skill_to_hero[148].to_hero_id=105`，`skill_data[14801]` 确认为 1 级「冰枪」。定向结果在 `.local/pve-stage16-guard/skill-verification.json`。导入工具新增可选固定技能列表，原有未填列表的守军仍只带普通攻击。进场沿用注册表深拷贝，未加入随机技能选择。

补充验证：进场检查确认 5 级、龙弹堡关联、固定技能，连续 10 次生成配置相同，前次战斗修改技能数组不污染后续进场。以 `DINO_GUARD_STAGE=16` 执行原版守军创建和定位检查通过；编辑器导入及结算检查通过。构建 SHA256 为 `6de5dff56e7525776903c617028bac423669723b348fcbc1c302de26ea6d6789`。备份 `.local/pve-stage16-guard/before-install.tar` 后，实例 1 覆盖安装返回 `Success` 并启动。安装前后 SQLite 文件有变化，进一步读取数据库确认全部 12 个 data 表键值及元数据相同，见同目录 `logical-save-verification.json`。游戏内显示及施法仍待用户复测。

用户请求：应用 `F:/Download/第16关-布局.json`。原始副本为 `inputs/pve-stage16/user-layout.json`。按文件保留 13 个建筑／旗子、71 段城墙及各自坐标和等级，守军为 0。

代码证据：`tools/import_pve_layout.py --check` 校验通过，随后用 `--apply` 更新 `analysis/rpc-contracts/pve-layouts/stage-16.json` 和 `analysis/native_boot.js` 的布局注册表。沿用 `buildEditorPveVillage` 和原版进场流程，保留第 7 关用户布局。

离线验证：`analysis/check_native_pve_enter.cjs` 新增第 16 关检查，逐项核对实际进场的建筑类型、坐标、墙体等级及坐标，并确认原进场回执收到第 16 关数据。进场、结算及 Python 编辑器检查全部通过。构建日志在 `.local/pve-stage16/build.log`，APK SHA256 为 `17b909b7663a9ff63a32adfd752dea848506c9dc1af17c8b434dbd8c4e177422`。

设备观察：实例 1（ADB `127.0.0.1:21513`）安装前停进程并备份 `.local/pve-stage16/before-install.tar`。覆盖安装返回 `Success`，启动命令成功。启动前核对三个数据库文件，安装前后逐字节相同，见 `.local/pve-stage16/save-verification.json`。本次未解锁关卡。

待复测：用户进入第 16 关，确认实际布局、建筑显示和战斗。当前没有第 16 关游戏内画面或用户验收证据。
