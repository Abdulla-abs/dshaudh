# 四菱解封石误报技能孔已满

状态：离线检查通过，已保留存档覆盖安装实例 1，游戏内待复测。

触发：用户给英雄喂食四菱解封石，提示 `Skill slots full`。

根因：`applyHeroFeedUse` 把所有 `putin_event_slot` 都归为技能孔。7222～7225 的原表事件也使用此字段，因而提前进入技能孔分支。原装备分支不可达，且写入了客户端不读取的 `equip_slots`。

原代码证据：7222～7225 对应事件 53061～53064，槽事件分别为 7001～7004。原版 `InputEvent.onGetHeroEquipSlot` 接收类型 31，调用 `HeroEquipment.addEquipSlot(slot)`。`HeroEquipment.init/dump` 读取和保存 `eqp`，开孔数为数组长度；`addEquipSlot` 仅在长度等于 `slot` 时追加 `null`。四菱石传 `slot=1`，即开启第二孔。原版函数提取见 `.local/hero-equip-slot/HeroComponents.js`，原回执见 `analysis/disasm/InputEvent.decompiled.js`。

修改：装备石先独立分流，按原版 `eqp` 保存空孔，返回类型 31；技能果仅处理 210021 和 210022。检查开孔顺序与单次数量，重复请求失败时不扣道具。保留原客户端界面、动画及等级检查。

验证：新增用例在旧代码复现同一报错；修复后 `node analysis/check_native_hero_feed.cjs` 通过。覆盖满技能英雄、四种石头、已有符文保留、存档续读、重复拒绝、旧对象和缺省装备数据，以及技能果回归。`node analysis/check_native_save_safety.cjs` 和语法检查通过。

运行时观察：构建成功，包 SHA256 为 `6287bb6dd74efa511ce777c0b463b88de0ecceab6d58951d37b949079f19ed90`。已备份并覆盖安装、启动实例 1；安装前后 9 个存档文件一致，记录在 `.local/hero-equip-slot/install-result.json`。

待复测：用户重新喂食四菱石，确认第二个符文孔开启、道具减少 1，退出重进后仍保持。尚未观察游戏内成功喂食；未代替用户消耗现有道具。
