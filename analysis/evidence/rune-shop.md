# 符文原石碎片购买与刷新

状态：离线通过；实例 1 已观察扩容、购买和续读，概率调整已安装，刷新效果待用户复测。

## 购买失败与扩容

用户截图显示购买符文原石碎片后报 `Shop reward package is full`。设备日志确认事务未提交，宝石恢复为 131,307。商品为 `itemshop_sell[131]`，道具为 7221，属于基础道具栏。该栏容量 19 格，已有 60 种道具；新道具需要一个空格。原有战役奖励允许超容量入库，商店则检查容量，造成操作差异。

原版 `PackageManager.getBuySlotPrice` 读取 `buy_slot_time`，旧本地存档缺失该字段，原扩容按钮因而隐藏。`addPackageSlot` 先增加格子和次数，再发 `rpc_s_buy_package_slot({pkgid})`；原 `AlchemyItemContainer.confirmCall` 在此之前预扣宝石。此前本地未接这个请求。

用户明确选择保留原版容量和扩容价格。现登录仅将缺失次数补为 0，新建背包也带初始次数。`handleBuyPackageSlot` 校验一次扩容和相应预扣，将钱包、格子和次数一并保存，失败恢复原记录。六档原价分别为增加 5／10／15／20／25／30 格，花费 100／200／400／700／1000／1500 宝石。当前基础栏需扩容四次到 69 格，共 1400 宝石，才可购买新种类。

定向检查直接执行原扩容确认、计价和增加格子函数，覆盖四栏、六档、上限、重进、失败回退和重复请求。另验证扩容三次仍满，四次后可发放 7221；交易检查确认扣除 800 宝石、发放一个碎片及标记售罄。AI 未操作设备付费按钮。

设备安装后登录读回：四栏次数均为 0，基础栏仍为 19 格、60 种道具，宝石仍为 131,307。迁移未赠送格子或消耗宝石。备份见 `.local/trader/rune-purchase-preinstall/databases.tar`，登录后记录见 `.local/trader/rune-purchase-entered/`。

后续覆盖安装前读回，运行日志已有六次扩容成功和 `sale=131` 购买成功。基础栏为 124 格、扩容次数 6、61 种道具，7221 库存为 1，宝石为 126,527。这是运行时观察，未收到用户口头验收确认。原始记录见 `.local/trader/rune-shop-final-before/`。

## 刷新概率调整

用户追加要求提高该道具在此商店的刷新概率。现本地 `traderPolicy.runeFragmentWeightMultiplier=3`，`ensureTrader` 建立候选池时，将 7221 的权重由 3000 提高到 9000。其余商品权重、价格、数量和折扣配置保持原值，每轮仍为八个不同商品。

实际选货代码固定种子模拟各 10,000 轮，原权重出现 1883 轮，提高后出现 4565 轮。每轮出现比例约从 19% 升到 46%；这是模拟估计，未声称精确概率或官方规则。新权重在下次付费或自动刷新时生效，重登保留当前商品和已售状态。未代用户付费刷新。

检查命令：`node analysis/check_native_package_slot.cjs`、`node analysis/check_native_trader_rune.cjs`、`node analysis/check_native_trader.cjs` 和 `node analysis/check_native_shop.cjs`。契约见 `analysis/rpc-contracts/package-slot.json` 和 `analysis/rpc-contracts/trader-rune.json`。原函数解码见 `analysis/inspect_native_package_slot.py`；原始输出及构建日志在 `.local/rune-purchase/`。

最终版本已保留数据覆盖安装并启动实例 1。安装前后完整 `level` 相同，未重抽商品；验证摘要为 `.local/rune-purchase/final-device-verification.json`。交付包为 `artifacts/dino-local-native-rune-shop.apk`，SHA256 为 `9eeef8d8cff2a701bc487d12dd8bc3664a024a8f628855a83b1b6155455ea5ed`。权重调整未在设备上付费刷新验收。
