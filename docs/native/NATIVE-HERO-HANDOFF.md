# 新手战斗缺少将领：迪诺数据适配

2026-10-14，用户确认入侵剧情已完成，后续引导点击战斗时提示“缺少将领”。这次反馈支持剧情已续接到战斗入口；后续战斗仍待复测。

原表确认迪诺类型为 `10401`，一级生命 400、攻击 46。证据见 `analysis/hero-init-005.txt`。英雄道具 `3332` 也指向迪诺，见 `analysis/dino-starter-check.txt`。这些数据证明客户端包含迪诺，但不能独立证明原服务器在何时赠送。

原引擎研究确认：仅有 `attack_index: 1` 时，英雄仍为闲置状态，出征人数为 0。补上 `state: HERO_STATE_ATTACK`（1），原版 `HeroManager.createHero` 创建后出征人数为 1，生命与攻击均符合原表。见 `analysis/dino-create-probe.txt`、`analysis/dino-create-probe-002.txt`。

本地适配采用起始携带一级迪诺的推断，补齐登录数据顶层 `heros`。英雄使用已验证的 `hero_slot_1` 标识，避免与建筑数字 SID 冲突。旧存档仅在英雄名单为空时补齐；已有英雄名单保留。保存与回城时保留名单，不改教程完成位。入侵回放仅带驻守英雄，出征迪诺保留在主城名单中。

首版人工复测失败：仍提示缺少将领。设备存档已有迪诺，但原版 BUILD 初始化仅遍历 `units`，顶层 `heros` 不参与创建。修正为 `makeHomeInitDict` 在传给原版主城初始化时合并名单，存档仍分别保存建筑和英雄。原版 `__buildUnit` 依据 `is_hero` 调用 `HeroManager.createHero`，无需适配层手工创建运行时将领。

独立存档 `dino.local.native.hero-fixture-1014` 的原引擎诊断已确认：主城阶段为 1，迪诺 CID 为 9，总将领和出征名单均为 `[9]`，状态为 1，生命 400、攻击 46。原版 `__buildUnit` 日志含 `hero_slot_1 / 10401`。证据见 `analysis/hero-stock-home-init-1014.json`。正式存档不参与自动剧情验证；战斗按钮仍须用户复测。

语法、入侵回归、剧情结束回归和 APK 签名检查已通过。交付包为根目录 `dino-local-native.apk`，哈希以同目录 `.sha256` 为准。覆盖安装保留应用数据；无需清数据。模拟器安装前备份为 `analysis/dino-before-starter-1014.sqlite`。

待用户验证：继续游戏后点击引导的战斗按钮，确认不再提示“缺少将领”，并检查下一步原版界面。后续主动 PVE 入口当前仍有借用敌袭回放的历史占位回执，不能据此声称完整出征战斗已经恢复；若进入该链路，须另查原版主动战斗协议。
