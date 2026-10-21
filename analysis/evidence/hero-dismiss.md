# 角色解散没有奖励且重登恢复

状态：离线检查和构建通过，已保留存档安装实例 1，游戏内待复测。

触发：用户报告角色解散后消失，但没有奖励，退出再登录又出现。

原代码证据：`UI.HeroItem.dismissHero` 先调用 `HeroManager.removeHero`，再发送 `rpc_s_dismiss_hero({hero_id:sid})`。本地此前没有处理该请求，日常主城快照沿用存档角色列表。因此运行单位消失，但磁盘仍有角色，也没有奖励回执。相关短代码见 [原版摘录](hero-dismiss-stock.js)。设备安装前存档有 24 个角色；当前状态日志未保留相关解散请求，不能确定历史操作对象。

奖励依据：`HeroUpgradePanel.onPressDismiss` 读取原版解散事件和可选等级事件。额外英灵为 `floor((total_spirit || 0) + expBar.spirit)`。反编译器把其中的逻辑或表达式还原错了，本轮已核对 `.local/hero-dismiss/Hero.disasm.txt` 的 `022611`～`022659` 操作码。当前底包等级表未含 `hero_lv_soul`，不推测添加。`rpc_c_after_dismiss_hero` 使用 `inputAward` 和 `equip_ret` 展示奖励及符文去向。

修改：在原解散方法前只读采集当前角色成长、投入英灵和符文，并预检奖励背包容量。原请求到达后，将删除角色、奖励、原符文和防重收据一次保存，再同步组件和调用原回执。原奖励弹窗还会发奖，因此展示期间临时禁用该重复发奖入口，并在 `finally` 恢复。原保留人数限制继续生效。

失败边界：背包满或配置无效时，预检阻止原删除。写盘失败时磁盘不变，也不显示成功奖励；原界面已经删掉运行单位的情况需重登恢复。未实现该异常下的即时恢复。历史角色既已回到存档，本轮不推测补发奖励。

验证：`node analysis/check_native_hero_dismiss.cjs` 通过。检查执行原解散、请求和奖励弹窗函数，覆盖 911 种可解散配置、当前成长快照、英灵和道具、原符文属性、重复请求、背包满及写盘失败。实际 PVE 回城处理器读回的角色列表没有恢复被删角色。语法、吞噬、符文穿脱保存、商店和侦察计时相关检查通过，APK 构建通过。

交付：已备份 `.local/hero-dismiss/before-save.tar`，保留数据覆盖安装实例 1 返回 Success，安装前后全部 9 个存档文件逐字节一致，随后已启动游戏。本轮没有解散设备存档中的角色。APK SHA-256：`ce1cf24d01347a64fd58cc7b56754a866c4f81b18641c3f1241037719fadd10d`。构建日志和安装后备份在 `.local/hero-dismiss/`。

待复测：选择用户不需要的角色，核对原确认框与实际奖励，检查符文返还，再退出重登及进攻回城。安装成功和离线检查不等于游戏内验收。

复现检查准备：使用 `python tools/jsc_decompiler/cli.py <输入.jsc> <输出.js>`，输出放 `.local/hero-dismiss/`。需 `Client/UI/Hero`、`Client/UI/Award` 及 `Data/Common/` 的 `unit_main`、`unit_battle`、`hero_lv_data`、`resource_input`、`item_input`、`item`，另需 `Data/Client/input_event_client`。输入位于兼容路径 `analysis/decoded/script/`；输出文件名沿用原表名。客户端回执读取既有 `analysis/disasm/ClientPlayer.decompiled.js`。
