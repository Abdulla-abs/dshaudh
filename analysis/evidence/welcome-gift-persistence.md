# 女神礼包领取后只见钻石

状态：离线通过，运行时补发待验。

运行证据：`welcome-letter-gift-claimed` 日志记录运行时钻石 250、龙币 5000、日光 5000、英灵 100。但 SQLite 仍为钻石 150、英灵 50、主城库存 sto 全 0，同时 `localWelcomeGiftClaimed=true`。备份在 `.local/welcome-gift-claim/`。

根因：四次 addRes 的运行时修改完成后，快照保存提前返回 false，领取逻辑没有检查返回值就保存了已领取标记。`tryDumpAndSave` 要求无参数 `DA.getGameController()` 返回具有 debug dump 方法的控制器，这不是持久化组件状态的必要条件，导致提前退出且没有诊断日志。

修改：取消保存对 debug dump 控制器的依赖，资源组件快照优先使用原版 componentList。失败新增状态记录。礼包改为先写主城存量、钻石、英灵和逐项 V2 领取收据，再同步运行时资源组件。旧版已领取但无 V2 收据时补龙币 5000、日光 5000、英灵 50；保留已显示的钻石，不再加 100。补发不依赖再次点击邮件，在主城初始化后处理。

验证：`check_native_letter_contract.cjs` 故意让快照保存返回 false，检查四项仍入库，再验证旧领取标记补发及钻石、英灵不重复。保档和资源刷新检查通过。补发需要新包启动后的运行时与重启验证。
