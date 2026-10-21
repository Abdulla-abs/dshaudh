# 主城建筑和资源收集无音效

状态：离线通过，已覆盖安装实例 1；设备登录、点击和收集正常，实际听感待用户确认。

触发：用户反馈主城点击建筑，以及日光井和龙银矿收集产出时没有原有音效。

根因：`analysis/native_boot.js` 的 `quietSound` 把声音管理器的播放方法永久替换成空函数。登录、进入主城和安装引擎保护时会反复调用。旧登录异常的处理因此也屏蔽了主城声音。

原代码证据：`Unit.onBuildingSelected` 调用 `SND.ON_BUILD_SELECT`，编号为 2003。`ResourceProductor.CollectResource → playGainAnimation` 调用原表收集音效。龙银为 2005／2006／2007，日光为 2008／2009／2010。`sound_data` 分别映射到 `H1_soundeffect/item/build_pick`、`item/gain/gain_gold_*` 和 `item/gain/gain_sunshine_*`。原 APK 内仍有两份 FEV、五份 FSB 及 FMOD 库，不能把静音归因于资源缺失。

修改：以 `protectSound` 替换 `quietSound`。保留原版 `DA.SoundManager` 和 `DA.SoundTimer` 的播放、定位、延时、启停与音量设置，仅捕获单次声音异常。延时播放异常也单独返回，并释放自动销毁计时器，避免异常打断登录或收集。重复安装保护不会叠加包装。

离线验证：`node analysis/check_native_sound.cjs` 执行原版声音管理器及声音配置。建筑选中、两种资源的六个收集事件均到达模拟音频后端；覆盖位置参数、持有音效、延时、异常后重试、计时器释放、原静音设置和重复安装。`node --check analysis/native_boot.js`、构建通过。解码临时输入在 `.local/home-sound/`。

运行时观察：已保留数据覆盖安装、启动实例 1，安装返回 `Success`。安装前后数据库全部 12 个键值相同。备份在 `.local/shop-treasure/home-sound-preinstall/`，安装后读回在 `home-sound-postinstall/`。APK SHA256 为 `f4a14a6d761d11b36d2fd41d9c8a39e2242acd25b595c7f6de56dfa7aef4fec8`。

设备已实际进入主城，点收日光 800、龙银 1000，显示分别从 1111543 增至 1112343、从 491894 增至 492894。随后点击日光井，原版选中效果及“日光井 等级 1”面板正常。截图和日志在 `.local/home-sound/entered.png`、`collected.png`、`selected.png` 和 `logcat-after-*.txt`。未在这些日志中观察到声音异常。AudioFlinger 中该游戏进程的音轨处于活动状态；这只能证明音轨工作，不能证明具体收集声音已经听见。

边界：运行轨迹仍记录 `rpc_s_collect_resource` 未处理，本轮未改该接口。资源显示变化不作为收集持久化验收。设备快照在 `.local/shop-treasure/home-sound-runtime/`。

用户确认：确认了原故障，尚未确认修复后的听感。

待复测：点击主城建筑，分别收集日光井与龙银矿，确认选中声和两种收集声恢复。保留原设置中的音效开关。
