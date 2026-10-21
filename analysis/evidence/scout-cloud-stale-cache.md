# 模拟器侦察仍重复同一云端阵容

状态：只读核对；云端目录正常，实例 1 本地缓存未更新。

触发：用户更新 Cloudflare 阵容至 28 份后，模拟器搜索仍反复看到同一阵容。

云端观察：`GET /api/pool` 返回 revision 28、levels 28。名称与 ID 均无重复（见 `.local/scout-cloud-dup-check/pool-list.txt`）。

设备观察：实例 1（`127.0.0.1:21513`）`dino.local.scout.cloud.v1` 仍为 revision 1，仅 1 份「巷子里的猫」（id `973ba7c0…`）。状态 `sync-failed` / `Cloud watchdog timeout`。快照见 `.local/scout-cloud/dup-check-20261021/summary.json`。

机制：非空云端快照完全取代内置池；同步失败保留旧缓存。单次请求超时 `requestTimeoutSeconds=20`，任一下载失败则整次同步失败。池从 1 扩到 28 时需连续拉取约 27 份缺失条目，模拟器侧易触发 watchdog，故一直用旧的 1 份池，等概率抽取必然总是同一阵容。

推断：不是云端库写重，也不是去重失效；是客户端未同步成功。待复测：提高超时或重试后确认状态变为 `sync-ok` 且 revision=28。
