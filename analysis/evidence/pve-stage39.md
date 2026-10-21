# 第 39 关用户布局

状态：离线检查通过，已保留数据覆盖安装并启动实例 1，游戏内待复测。

用户请求：新增第 39 关“从南到北”。原始输入保存于 `inputs/pve-stage39/user-layout.json`。按文件保留 12 个建筑、67 段城墙、坐标和等级。3 名守军均为 20 级：10701 转生配置为 8、固定技能 703304，驻守 b2；10501 转生配置为 6、固定技能 15204，驻守 b6；10401 使用默认形态、固定技能 13301，驻守 b12。转生数值为布局字段，不推断界面名称。

代码证据：`tools/import_pve_layout.py --check` 校验通过，`--apply` 写入 `analysis/rpc-contracts/pve-layouts/stage-39.json` 和 `analysis/native_boot.js` 的注册表。沿用现有 `buildEditorPveVillage` 和原版进场流程。第 7、16 关配置保留。

验证：`analysis/check_native_pve_enter.cjs` 核对第 39 关建筑、城墙、守军等级、转生形态、变异、固定技能和驻守关联，并确认实际进场回执、重复进场数据隔离。进场、结算和 Python 布局编辑器检查通过。构建日志在 `.local/pve-stage39/build.log`，APK SHA256 为 `77b47511ef07184fa9343564f1d09e88f09bfcfbaddf23ae90fad0f9e2b73d53`。

设备观察：ADB `127.0.0.1:21513` 安装前停进程，备份至 `.local/pve-stage39/before-install.tar`。覆盖安装返回 `Success`，启动命令成功。启动前比较数据库、偏好和文件目录内的全部 9 个文件，内容均未变化，见 `.local/pve-stage39/save-verification.json`。

待复测：实际进入第 39 关，确认建筑、城墙、3 名守军的显示和技能。未修改关卡解锁进度，尚无游戏内验收或用户确认。
