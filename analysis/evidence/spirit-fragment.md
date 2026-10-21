# 炼金消耗品英灵碎片使用报错

状态：离线通过，已覆盖安装实例 1，游戏内待复测。

触发：在“炼金”→“消耗品”使用英灵碎片，出现 `Error: Invalid item use`。

根因：`handleShopUseItem` 把所有道具限制为每批 100 个，同时遗漏 1101。超过 100 个时抛错，少量请求返回 false。两种旧行为均由代码确认。

原代码证据：`Client/UI/Package.jsc` 的 `onPressUseItem` 为 1101 打开数量选择器，`onPressUseBatchItems` 传入选定数量。原表 `item[1101]` → 50801 → 20501，每个增加 1 点英灵值，堆叠上限 99999。原版 `PackageManager.useItemAns` 扣道具，事件 11 调用 `onGetSpirit`。

运行时观察：`.local/shop-treasure/spirit-before/` 保存设备数据库及摘要。库存 1101 × 1558，英灵值 98；轨迹有一次 Invalid item use 和三次 ok=false。日志未记录请求数量，超过 100 个触发该报错是结合代码的推断。

修改：`analysis/native_boot.js` 的 `handleShopUseItem` 接入碎片兑换，读取原表奖励并汇总批量回执。1101 使用原表堆叠上限，其他道具保留既有上限；扣库存与加英灵一起保存，再回原版回执并同步钱包。契约见 `analysis/rpc-contracts/spirit-fragment.json`。

验证：`node analysis/check_native_shop.cjs` 通过，执行原版回执与英灵奖励函数，覆盖 1、100、101、1558、99999 个、非法数量、库存不足、写入失败和重复请求。钱包同步未重复增加英灵。语法、龙晶石、喂食及技能书检查通过，构建通过。

安装：已备份 `.local/spirit-fragment/before-install.tar`，经 `pm install -r` 成功覆盖安装专用实例 1。未在设备消耗碎片。新版 APK SHA256 为 `092dd7a9ba1dad060bb076562044bce4199d5582d4dc9a7dfb6e3715074891cd`。

用户确认：尚无修复后的使用反馈。

待复测：在原界面使用碎片，核对库存与英灵值，再退出重进核对保存结果。
