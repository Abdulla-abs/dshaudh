# 商店宝藏数据完整性调查

状态：2026-10-15 静态调查完成，关键数据不全，按用户要求停止功能实现。未修改游戏代码、存档或安装包。

后续更新：用户已授权自定缺失概率，现已实现并验证原流程，见 [本地规则及运行证据](shop-treasure-local.md)。设备确认普通转生宝藏实际为商品 92／道具 1504，前次仅凭旧中文表的名称映射疑点已消除。下文保留为本地实现前的数据缺项记录。

## 原代码证据

龙蛋商品位于 `Data/Common/virtual_item`：商品 100 售价字段为 488，`capsule_id=[2,1]`，免费周期引用 8033；商品 101 售价字段为 1288，`capsule_id=[3]`。价格类型字段均为 3。已查客户端数据中未定位到胶囊 1、2、3 的英雄奖池和抽取权重；背包龙蛋道具 1124 还引用 `capsule_event=4`。

原版 `UI.ShopBuildItem.freeBuyDrawCard`、`confirmBuyDrawCard` 请求 `rpc_s_drawcard({buy_id,free})`。`ClientPlayer.rpc_c_draw_card` 读取服务端 `ans` 中类型 29 的胶囊，显示单抽或三抽；`rpc_c_gain_drawcard` 才调用 `inputAward` 领取。现有教程固定精灵龙是前轮用户授权的兼容方案，不能作为普通抽奖概率证据。

英雄宝藏商品 89、90、91 对应道具 1501、1502、1503，价格字段分别为 50、200、800。道具引用奖励链 50001、50011、50021。链内的资源与物品配置存在，包括部分 `item_random_chance` 权重、`item_random_numRange` 数量范围，以及 `item_random_useLimit`、`item_random_security`。例如事件 9001 配置物品 1116、数量 1、限制字段 `[15,4]`、security 字段 6。事件 9003 的四个候选权重均为 25，但这不能证明整个宝藏的最终中奖率。

当前包中文名称 1507、1508、1509 分别为普通、珍奇、稀世“英灵宝藏”，商品为 95、96、97，价格字段同为 50、200、800。对应奖励链 50061、50071、50081。它们是否就是用户所称“转世宝藏”，尚未确认。

购买宝藏走 `rpc_s_buy_package({typeid,num})`，回执 `rpc_c_buy_package_ans` 进入 `PackageManager.buyPackageAns`。使用物品回执 `rpc_c_use_item_ans` 经 `useItemAns` 扣物品并读取服务端 `ans`。客户端 `InputEvent` 的物品计算分支指向返回空数组的 `zeroEvent`；`getProbableItemRewards` 只收集展示候选，不执行这些限制和保底字段。字符串引用搜索也只在数据表中定位到 `item_random_useLimit`、`item_random_security`，未找到执行规则。

## 结论与缺项

已找到商品、部分奖励内容和局部随机权重；尚不足以忠实恢复完整抽取流程。没有假定候选等概率，也没有把权重数值直接当作最终百分比。

需要补充：胶囊事件 1、2、3、4 的奖池、权重、免费及三抽规则；宝藏奖励链每阶段的选择规则；`item_random_useLimit` 和 `item_random_security` 的算法及计数持久化规则；“转世宝藏”的商品名或 ID。最好提供服务端配置、处理代码或能说明规则的原始数据。

## 证据位置与验收边界

本轮定向反编译输出位于 `.local/shop-treasure-audit/`：`Shop.js`、`virtual_item.js`、`item.js` 和相关中文文本表。既有定向解码位于 `.local/hero-guide-entry/`：`input_event_client.js`、`item_input.js`、`hero_input_client.js`、`InputEvent.js`。回执证据见 `analysis/disasm/ClientPlayer.decompiled.js`、`Components.decompiled.js` 对应函数。

以上为静态配置和函数证据；没有实际购买、开箱或设备概率验收。补充数据后再决定实现范围。
