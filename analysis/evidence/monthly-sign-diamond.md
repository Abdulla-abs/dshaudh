# 每日签到钻石额度

状态：离线通过，已保留存档安装实例 1，游戏内待复测。

触发：用户要求将每日签到奖励由 10 万钻石改为 100 万。
根因：本地月签奖励为用户指定固定额度，与原版七日表无关；展示表与领取回执此前均为 `100000`。
证据：`LocalNative.installMonthlySignRewards` 的 `resource_input[990100001].putin_num`；`LocalNative.handleMonthlySignReward` 加钻、回执与 `rpc_c_get_sign_reward_ans`。
修改：`analysis/native_boot.js` 四处额度改为 `1000000`；`analysis/check_native_monthly_sign.cjs` 同步断言。
验证：`node analysis/check_native_monthly_sign.cjs` → `PASS: 1000000/day, ...`。
交付：已备份 `.local/monthly-sign-diamond/before-save.tar`，实例 1 覆盖安装 Success。安装前后 9 个存档文件一致，包内启动脚本与源码一致，已启动游戏。APK SHA-256：`7f445f2e7b28f8d4b9f95308d6b83edee440635e65e2b1de490839c277ff9972`。核对见 `.local/monthly-sign-diamond/install-verification.json`。
待办：游戏内领取确认预览与到账均为 100 万。
