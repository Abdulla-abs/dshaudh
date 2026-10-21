# 云端侦察阵容池 API

状态：用户确认部署及上传成功；线上目录版本 1、阵容 1 份，游戏端已下载。用户确认游戏测试通过。

触发：用户要求共享编辑器导出的阵容，无需维护服务器，并让游戏更新后本地随机。

原代码证据：`tools/build_scout_pool.py` 在构建时编译并嵌入阵容，`LocalNative.selectScoutLevel` 从内置池抽取。编辑器格式为 `dino-pve-layout/v1`，转换规则见 `tools/import_pve_layout.py`。

用户确认：Cloudflare Worker 和 D1 已创建，绑定名为 `DB`。电脑和手机连通；初始化 SQL 执行成功；健康接口返回 `ok: true`、`schema: dino-scout-cloud/v1`、`revision: 0`。

修改：新增 `analysis/scout-cloud/worker.mjs`、`schema.sql`、构建工具和接口契约。实现上传校验、转换、精确去重、目录版本、下载、限额和管理下架。API 阶段增加同域上传网页、摘要预览、作者输入、成功和失败反馈、阵容列表及原始 JSON 下载接口，数据库无需变更。客户端接入另见 `scout-cloud-client.md`。

验证：构建、语法和 `node analysis/check_scout_cloud.mjs <用户样本路径>` 通过。现有 16 份和用户第 36 关共 17 份编译结果与 Python 逐字段一致；SQLite 覆盖上传、去重、版本、原始和编译下载、静态资源、CSP、格式、越界、大小、限额、管理鉴权和下架。结果在 `.local/scout-cloud/check-result.json`。

运行时观察：本地真实浏览器选择用户样本，显示 7 级大本营、39 个建筑及地图对象、150 段墙、4 名守军；上传后版本 1、列表 1 条，重复提交不新增，控制台无错误。390 px 手机宽度无横向溢出，截图在 `.local/scout-cloud/upload-desktop.png`、`upload-mobile.png`。HTTP 原始下载与源文件一致，内置浏览器下载事件超时，实际落盘仍待用户复测。真实 D1 上传随后由用户确认，线上观察见下段。

线上观察：用户确认新版已部署并上传成功。内置浏览器打开正式地址，目录由“0 份、版本 0”变为“1 份、版本 1”，显示“巷子里的猫”、7 级大本营，作者“巷子里的猫”。实例 1 已真实下载该阵容，详见 `scout-cloud-client.md`。命令行 HTTP 请求返回 403，浏览器及游戏请求正常，不能据此判定服务不可用。

用户已确认游戏测试通过。待办：真实断网复测；浏览器下载实际落盘仍待单独确认。客户端同步与缓存已实现，Worker 无需再次部署。
