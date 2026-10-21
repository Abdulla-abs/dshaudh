# 游戏云端阵容同步

状态：实例 1 真实联网、缓存和重启通过；用户确认游戏测试通过。

触发：用户确认云端上传成功，继续接入游戏动态更新和本地随机。

原代码证据：`LocalNative.selectScoutLevel` 原先只读取构建时嵌入的池。现有 `buildPvpBattleDict` 复制选中布局，保留原侦察、进场、资源、结算和回城。原 Manifest 缺少 `INTERNET` 权限，已为同步补齐。

修改：`analysis/scout-cloud/native-sync.js` 实现 ES5 同步；`tools/build_scout_cloud_native.cjs` 生成规则并嵌入 `native_boot.js`。启动和回城检查版本，运行期间每 300 秒轮询。非空云端完整快照参与原等概率抽取，空池或无缓存时回退内置池。有旧缓存但更新失败时保留旧池。全量校验建筑占地、守军驻守、技能、变异和符文，按不可变 ID 复用下载。

缓存：独立于玩家存档，使用 `dino.local.scout.cloud.v1` 前缀。先写入并读回非活动槽，再切换提交指针；损坏时尝试上个已提交槽。缓存协议为 `dino-scout-client/v2`。初版实机发现 JSB XHR 将 UTF-8 字节当作 Latin-1 字符，已修正解码；v2 拒绝早期乱码缓存。

离线验证：现有 16 份布局及实际下载阵容通过客户端校验和原进场数据构造。`check_native_scout_cloud.cjs` 覆盖缓存重启、下载复用、网络失败、HTML 响应、版本竞争、下架、空池回退、写盘失败、损坏恢复、超时晚回调、中文解码、战斗快照和存档隔离。原侦察池及掠夺回归通过。结果在 `.local/scout-cloud/native-check-result.json`。

运行时观察：线上网页显示 1 份公开阵容、版本 1。实例 1 下载 `973ba7c0d331a089277e3aced5db456915eb56734f29837d963135b7a3d54971`，名称“巷子里的猫”，7 级大本营、43 个单位（含 4 名守军）、150 段墙。缓存与用户 JSON 的 Python 编译结果逐字段一致。强杀重启后状态 `up-to-date / 1`，中文正常。证据在 `.local/scout-cloud/network-v2/`、`restarted-v2/` 和 `runtime-final/`。

存档与交付：最终 APK 已保留数据覆盖安装实例 1；`.local/scout-cloud/before-final/` 与 `installed-final/` 全部 9 个文件哈希一致。网络验证和重启后玩家主存档哈希仍与首次备份一致。交付 `artifacts/scout-cloud/dino-scout-cloud.apk`，SHA-256 为 `a2ae1ad850bef617b226e6ff20a96a4dc2a38c0c0882e964c862e20e426ac0ec`。

用户确认：在要求复测随机侦察、战斗和回城后，用户反馈“测试通过”，并要求提交推送。

待复测：真实断网操作和手机安装未单独确认。实机未通过上传第二份或下架来改变线上池；版本更新、随机分布和下架由离线检查覆盖。目前池仅 1 份，重复抽到同一阵容是正常行为。
