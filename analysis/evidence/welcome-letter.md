# 来自女神的信

状态：离线通过，设备显示与领取待复测。

用户确认的礼包内容：标题“来自女神的信”，钻石 100、龙币 5000、日光 5000、英灵值 50。该内容来自用户提供，不标为客户端表中恢复的官方数据。

原代码证据：`LetterManager.loadSysLetter` 接收系统信列表。`SystemLetterBox` 对 `LETTER_TYPE_SYS_REWARD` 显示领取按钮，点击发送 `rpc_s_gain_letter_reward {letter_id}`。原奖励栏仅展示一种资源，完整礼包写在正文，领取一次发四项。标题使用原系统信 sender_name 显示位置。

修改：玩家初始化补一封稳定 ID `local_goddess_newbie_gift` 的系统信；请求信件时通过原版 `rpc_c_load_letter` 下发。领取使用原版 `ResourceManager.addRes(amount,type)` 更新资源及仓库，然后保存快照与 `localWelcomeGiftClaimed`。重启和重复回执都不会再次发放。龙币和日光遵守原容量上限。

验证：`node analysis/check_native_letter_contract.cjs` 通过，核对四项增量、存档余额、信件已领取状态和重复请求。开蛋回归通过。新包已构建。原版信件定向解码位于 `.local/rookie-letter/`。
