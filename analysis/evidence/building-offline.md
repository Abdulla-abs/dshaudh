# 建筑施工期间退出后丢失或停工

状态：离线检查通过；已保留数据覆盖安装实例 1，旧档的 8 段施工城墙已自动完工。新购建筑完整复现待用户复测。

后续补充：用户另报已有完工建筑消失，已查出字符串 SID 漏算造成新购重号，以及购买目标可能取错。见 [建筑编号证据](building-sid.md)。本页两处修复未覆盖编号冲突。

触发（用户报告）：购买建筑，在施工期间退出，超过完工时间后登录。建筑消失，或仍显示升级，倒计时消失，加速宝石为 0。

根因（原代码证据）：`tryDumpAndSave` 只遍历存档已有的 `level.units`，没有追加新购建筑；首次完工前退出会漏存。`resumeConstructions` 又把 `gc.buildings` 的值当建筑对象。原版 `GameControllerBuild.createUnit` 实际写 `buildings[cid]=typeid`，因此恢复循环跳过所有建筑。原版 `BuildingBuilder._update` 到期只删除计时条，不改变施工状态，仍需完工回执。另核对发现 `rpc_c_ans_build` 读取 `dict.id`，此前本地仅回 `unit`，依赖额外 SID 修补。

修改：`collectHomeBuildings` 按 CID 解析原版建筑表，供保存和施工恢复共用。保存追加已有 SID 且已确认购买的建筑，保留施工状态、开始时间和坐标，排除摆放预览。恢复已过期施工，重设未到期定时器，并用任务对象校验淘汰旧回调。购买回执补 `id`。保留原版模型重建、工人释放和完工存档流程。

验证：`node analysis/check_native_building_offline.cjs` 覆盖施工期间保存、重复保存、未确认预览排除、原版回执字段、到期仅删计时条、原版 CID 表恢复和旧定时器失效。建筑契约、龙晶石、资源钱包、存档安全和整行城墙检查均通过，JS 语法与 APK 构建通过。整行城墙检查最初缺少新增辅助函数，补充测试环境加载后通过。

设备观察：安装前完整数据库备份位于 `.local/building-offline/before-install/`，共 85 个建筑，SID 155～162 为施工状态。新版登录后仍为 85 个，8 段城墙均已沿完工链路恢复，施工记录为 0，状态日志无 ERR。摘要在 `.local/building-offline/after-login-summary.json`，数据库在同目录 `after-login.sqlite`。没有购买建筑或消耗设备资源进行试验。

安装包 SHA256：`0e5a006f3a7f931085d0cb6a21e2673ed9d4ca2f4b638923c66950fcc54c8bfc`。

推断与边界：两处缺陷可解释本次症状；设备未完整重演新购建筑退出流程。旧版若从未保存消失建筑，无法仅凭当前存档还原购买品种和坐标。用户验收待确认。
