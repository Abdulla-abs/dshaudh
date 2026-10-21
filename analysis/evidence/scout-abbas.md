# 随机侦察新增 abbas

状态：布局及进场检查通过，已保留存档覆盖安装并启动实例 1。游戏内待复测。

用户要求：将 `artifacts/玩家模式阵型-铁心方盒.json` 加入随机侦察阵容池，名称为 `abbas`。

修改：新增独立副本 `analysis/rpc-contracts/scout-layouts/abbas.json`，仅将名称改为 `abbas`。8 级大本营、75 个建筑、173 段墙和 8 名守军全部保留，坐标、等级、技能、符文及玩家模式元数据未改。`scout-pool.json` 新增稳定 ID `abbas`，并重新编译嵌入数据。池现共 16 个阵容，当前全池等概率，每个 6.25%。资源沿用仓库 20%、生产建筑 80% 的规则。

验证：原文件与新增副本逐字段对比，确认仅名称不同。`python analysis/check_scout_pool.py`、`node analysis/check_native_scout_pool.cjs` 和 `node analysis/check_native_pvp_contract.cjs` 通过，覆盖实际布局、地图边界、全部 16 个阵容进场、资源总量、守军关联、数据隔离及侦察回城。

运行时观察：构建成功，包内 `assets/offline/boot.js` 与当前源码一致。仅覆盖安装专用实例 1（`127.0.0.1:21513`），安装返回 `Success`，启动返回 `Status: ok`。安装前后全部 9 个存档文件内容一致。APK SHA256 为 `6254bca6aa9be4fa108e4fba59085dad78219cea5653d9f70a48eb35c36ec159`。备份及核对记录在 `.local/scout-abbas/20261020-143605/`，构建日志为 `.local/scout-abbas/build.log`。

用户确认：名称和输入阵型由本轮明确指定，游戏内尚未验收。

待复测：随机侦察匹配到 `abbas` 后，确认布局、守军和战斗结算。全池随机允许重复，不保证固定次数内命中。
