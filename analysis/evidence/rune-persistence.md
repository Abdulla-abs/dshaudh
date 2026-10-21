# 穿戴符文重登后消失

状态：离线通过，已安装实例 1，游戏内待复测。

触发：用户报告角色穿戴符文后退出，再登录时角色和背包均无该符文。

根因：原客户端先改符文槽并移动背包物品，再发送穿戴请求。本地未接穿戴、卸下和替换接口；日常保存只复制背包，没有复制角色 `eqp`。背包扣除后落盘，符文槽仍为旧值。

原代码证据：恢复的 `HeroComponents.js` 中，`putOnEquipment` 在 2727～2730 行先扣物品、更新槽，再发 `rpc_s_put_on_equipment`。`takeOffEquipment` 和 `replaceEquipment` 也先改客户端状态。`init` 和 `dump` 读取、写出 `eqp`。原始提取件在 `.local/hero-equip-slot/HeroComponents.js`；字段及请求见 `analysis/rpc-contracts/hero-equipment.json`。恢复代码的背包编号赋值表达式不完整，测试显式设置高级道具背包编号，不将该表达式当成参数证明。

修改：`analysis/native_boot.js` 接入三个原请求，同步调用主城保存；新增 `snapshotHeroEquipment`，将运行中角色的完整 `eqp` 与背包在一次提交中保存。保留属性和空槽；缺失或尚未初始化的角色保留原存档。沿用原客户端属性更新和物品移动。

验证：`node analysis/check_native_rune_persistence.cjs` 使用恢复的原版穿戴、替换、卸下和初始化函数，检查属性、空槽、背包数量、其他角色、保存失败后重试和战斗隔离。删除符文快照调用后，同一用例在首个穿戴存档检查失败，记录在 `.local/rune-persistence/regression-before.txt`。符文合成、开孔、存档安全、建筑购买及离线施工、账号经验回归和源码语法检查均通过。账号经验检查补齐此前缺失的建筑收集桩；两个建筑检查加载新增快照依赖。

运行时观察：构建包 SHA256 为 `b4393291e5ebf2480c54269bb37478a34e80a24110ec3757700ff9e42c3a7fe5`。已备份、保留数据覆盖安装并启动实例 1；安装前后 9 个存档文件哈希一致，见 `.local/rune-persistence/install-result.json`。当前档及上一版快照均无已穿戴符文，背包各有 3 个高级道具记录；无法据此确定历史丢失符文的编号和属性，未补发物品。

用户确认：仅有本次故障报告，尚无修复后验收。

待复测：游戏中穿戴一件符文，退出重登确认角色仍佩戴，背包不重复；再替换、卸下并重登确认物品数量。未在设备代替用户操作符文。
