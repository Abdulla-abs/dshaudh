# 云端侦察阵容池部署

## 当前状态

用户已创建 Worker `kdzlj-scout-api` 和 D1 数据库 `kdzlj-scout-pool`，绑定名为 `DB`。网页和 API 已部署，用户确认上传成功，线上浏览器显示 1 份阵容、版本 1。游戏同步包已覆盖安装实例 1，真实下载、缓存和重启通过；用户已确认游戏测试通过。

## 初始化数据库

打开 Cloudflare 的 D1 数据库 `kdzlj-scout-pool`，进入 Console。复制 `artifacts/scout-cloud/初始化.sql` 的全部内容并执行。脚本可重复执行，保留已有记录。

执行后会创建 `scout_meta`、`scout_layouts` 和 `scout_limits` 三张表，以及版本更新触发器。

## 部署 Worker

回到 Worker，点击 Edit code。用 `artifacts/scout-cloud/worker.mjs` 的全部内容替换现有代码，点击 Deploy。此文件包含网页、编辑器目录和校验规则，约 908 KB，应完整复制。数据库结构保持兼容，已有初始化无需重跑。

访问 `https://kdzlj-scout-api.qizhiwang339.workers.dev/`，应显示上传表单和共享阵容列表。选择编辑器导出的 JSON，检查摘要，填写公开作者名并上传。校验通过后列表出现阵容；重复上传保持一条记录。点击“下载 JSON”可获取原始布局。上传成功后健康接口的版本会递增。

网页明确显示超限、格式、网络和接口错误。上传失败保留所选文件和作者；请求超时可以重试，精确去重避免重复入池。作者名称和阵容名称以文本显示，避免当作 HTML 执行。网页只加载自身域名的脚本和样式。

下架接口需要在 Worker 的 Settings 中添加 Secret `ADMIN_TOKEN`，内容至少 32 个随机字符。只在 Cloudflare 保存密钥，不写入游戏、网页或仓库。未配置时下架接口关闭，上传和下载仍可使用。

## API 行为

契约见 `analysis/rpc-contracts/scout-cloud.json`。上传接收作者名和原始布局，复用编辑器校验并转换为游戏单位数据。要求恰好一座大本营，保留建筑、墙、守军、技能、培养和符文。

校验通过后直接公开。内容哈希包含名称、关卡编号和数组顺序，只去除完全相同的编译结果；暂不识别几何等价阵容。下架保留记录并递增版本。阵容目录只返回公开记录，下载已下架阵容会返回 404。

每个来源地址每小时最多请求上传 5 次，全局每天 100 次，失败请求也占次数。请求体上限 256 KiB，总记录上限 1,000 条，含下架记录。限额通过数据库条件更新执行。来源地址按天计算哈希后存入短期计数器，不直接存储 IP。

## 游戏同步和随机

新版客户端先读取目录，下载缺失阵容，再核对目录版本。全部验证并写盘成功后替换本地缓存，失败保留旧缓存。缓存采用双槽和提交指针，与玩家存档分开。正在战斗的目标使用进场快照。

启动时检查更新，进入主城后重新安排检查时钟，运行期间每 5 分钟检查一次。侦察始终在本地抽取，沿用全池等概率、允许重复的规则。非空云端池取代内置候选；云端空池或尚无有效缓存时使用原内置池，不混合两者。已有缓存时断网仍可侦察。只有 1 份云端阵容时，每次匹配到同一份属于正常行为。

客户端补齐了联网权限，并兼容旧引擎 XHR 的中文解码。所有传输均使用现有 HTTPS 地址，不上传玩家主城、账号或存档。客户端契约见 `analysis/rpc-contracts/scout-cloud-client.json`。

手机使用 `artifacts/scout-cloud/dino-scout-cloud.apk` 保留数据覆盖安装。实例 1 已安装，数据库无需变更，Worker 无需再次部署。

## 本地检查

在仓库根目录运行 `node tools/build_scout_cloud.cjs`，再运行 `node analysis/check_scout_cloud.mjs`。可在检查命令后传入用户 JSON 的绝对路径，同时验证该文件的编译、上传、去重和下载。检查使用本地 SQLite，并将当前 16 份阵容及用户样本与 Python 编译器逐字段对照。完整结果在 `.local/scout-cloud/check-result.json`。

用户提供的第 36 关样本为 7 级大本营、39 个建筑及地图对象、150 段墙、4 名守军。浏览器本地上传和重复提示通过，390 px 手机宽度无横向溢出。截图位于 `.local/scout-cloud/upload-desktop.png` 和 `upload-mobile.png`。下载接口经本地 HTTP 读取，与源文件逐字段一致；内置浏览器未返回下载事件，落盘操作仍待真实浏览器复测。

客户端源码修改后运行 `node tools/build_scout_cloud_native.cjs --apply`，再运行 `node analysis/check_native_scout_cloud.cjs`、原侦察池及掠夺检查，然后用现有 `analysis/build_native.py` 构建。规则目录按英雄共享技能表，避免重复嵌入。

实例 1 已下载真实云端阵容，逐字段对照原始文件的编译结果一致，强杀重启缓存正常，最终安装前后 9 个存档文件一致。完整结论见 `analysis/evidence/scout-cloud-client.md`。用户已确认本轮游戏测试通过。实际断网和手机安装未单独确认。

Cloudflare API 依据：[D1 数据库绑定与查询](https://developers.cloudflare.com/d1/worker-api/d1-database/)。
