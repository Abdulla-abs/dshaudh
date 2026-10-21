# 新手七日签到存在性

状态：原包静态证据已确认；设备入口、领取和跨日行为待复测。日期：2026-10-14。

触发：检查游戏是否包含类似“新手七天签到”的活动。

原代码证据：

- `Data/Common/sevendays.jsc` 的配置包含第 1～7 天。奖励事件依次为 55501、55511、55521、55531、55541、55551、55561，计数器均为 8301。
- `Client/Components/GameEventsComponent.jsc` 定义 `Comp.SignReward`、`getRookieDays`、`getRookieSignConfig` 和 `getRookieSignReward`。初始化读取 `params.rookie_days`。反汇编确认按 `data.sevendays[this.rookie_days]` 取配置，并调用 `rpc_s_get_rookie_sign_reward`，请求参数为 `{}`。
- `Client/UI/Reward.jsc` 的 `RewardInterface` 包含 `RookieSign` 和 `DailySign` 两个独立页签。观察 `rookie_days`，若没有对应七日配置，则将新手签到页签设为不可用。
- `Client/Resource.strings.txt:424` 包含 `Award_SevenDaysCard.ccbi`。此项仅作为界面资源的辅助证据。
- `Client/UI/GameEvents.jsc` 包含普通签到的 `rpc_s_get_sign_reward` 和 `rpc_s_refresh_sign_rewards`；组件另含补签接口 `rpc_s_retroactive_sign_reward`。

离线适配观察：在 `analysis/native_boot.js` 搜索 `rookie_days` 和 `rookie_sign` 无匹配；已有注释说明七日登录奖励尚未自动发放。这只能证明缺少明确的专门适配，不能替代设备验收。

推断：原游戏包含新手七日签到奖励。账号字段或服务器活动状态缺失，可能导致当前离线版入口不可用。

验证：单文件反编译与组件反汇编。产物在 `.local/seven-day-check/`。伪代码出现函数错位，函数取值和领取参数以反汇编交叉核对；未将伪代码当作完整可靠源码。

用户确认：暂无运行时确认。

修改：仅保存证据和任务入口，未修改游戏逻辑或设备存档。

待办：具体中文活动标题、每天奖励名称和数量、连续或累计登录规则、跨日条件及当前设备入口待验证。下一步先查原版新手签到卡片与计数器 8301 的条件。
