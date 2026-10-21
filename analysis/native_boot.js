(function() {
    try {
        PATCH_ENABLED = false;
        NtUniSdkEnabled = false;
        __PLAY_MODE = __PLAY_MODE_OFF_LINE;
        NETWORK_TICK_ENABLE = false;
        PLAYER_OFFLINE_CHECK_ENABLE = false;
        DestroyVersionControlAndEnterGame();

        var STORE_KEY = 'dino.local.native.v1';
        var SCHEMA = 1;
        var menu = G_MainController.MainMenu.controller;
        menu.showMaintenanceNotice = function() {};
        menu.touchMask.setVisible(false);
        menu.loginCommon.controller.autoLogin = function() {};
        // Green "进入游戏" requires legal checkbox + legalCheckCallback (enables the EffectButton).
        // Do NOT replace legalCheckCallback — call the original so the green button becomes enabled.
        var origLegalCheckCallback = null;
        try {
            if (typeof menu.legalCheckCallback === 'function')
                origLegalCheckCallback = menu.legalCheckCallback;
        } catch (eCb0) {}
        var forceLegalAgreed = function() {
            // MainMenu calls this as a method; a boolean breaks the original button callback.
            try { menu.isLegalAgreed = function() { return true; }; } catch (e0) {}
            try {
                var box = menu.legalCheckBox;
                if (box) {
                    if (typeof box.setSelected === 'function') box.setSelected(true);
                    if (typeof box.setChecked === 'function') box.setChecked(true);
                    var bc = box.controller;
                    if (bc) {
                        if (typeof bc.setChecked === 'function') bc.setChecked(true);
                        if (typeof bc.setSelected === 'function') bc.setSelected(true);
                        bc.isChecked = function() { return true; };
                        bc.isSelected = function() { return true; };
                        try { bc.checked = true; } catch (e2) {}
                        try { bc._checked = true; } catch (e3) {}
                    }
                }
            } catch (eLegal) {}
            // Original callback re-enables login/start EffectButtons after check.
            try {
                if (origLegalCheckCallback)
                    origLegalCheckCallback.call(menu, true);
            } catch (eCb1) {}
            try {
                if (typeof menu.setRegalEnabled === 'function') menu.setRegalEnabled(true);
            } catch (eReg) {}
            try {
                var lcEn = menu.loginCommon && menu.loginCommon.controller;
                if (lcEn) {
                    if (typeof lcEn.setEnabled === 'function') lcEn.setEnabled(true);
                    ['gotoLoginButton', 'loginButton', 'quickRegisterButton', 'startButton',
                     'gotoLogin', 'login'].forEach(function(k) {
                        try {
                            var btn = lcEn[k];
                            if (!btn) return;
                            if (typeof btn.setEnabled === 'function') btn.setEnabled(true);
                            if (typeof Gray !== 'undefined' && Gray && typeof Gray.resetColor === 'function')
                                Gray.resetColor(btn);
                        } catch (eBtn) {}
                    });
                }
            } catch (eLcEn) {}
        };
        forceLegalAgreed();
        // Keep stock audio and mute preferences; contain FMOD exceptions locally so
        // a missing/broken event cannot abort a login button or resource collection.
        var protectSound = function() {
            var guard = function(target, key) {
                var original = target && target[key];
                if (typeof original !== 'function' || original.__localNativeSoundGuard) return;
                var wrapped = function() {
                    try { return original.apply(this, arguments); }
                    catch (eSound) {
                        // Delayed SoundTimer.doPlay runs outside the manager's call.
                        if (key === 'doPlay' && this.master) {
                            this.handle = null;
                            try { if (this.autoDestroy) this.destroy(); } catch (eCleanup) {}
                        }
                        if (!wrapped.__reported) {
                            wrapped.__reported = true;
                            try { cc.log('DinoLocal sound-error ' + key + ': ' + eSound); } catch (eLog) {}
                        }
                        return 0;
                    }
                };
                wrapped.__localNativeSoundGuard = true;
                target[key] = wrapped;
            };
            if (typeof DA !== 'undefined') {
                var manager = DA.SoundManager && DA.SoundManager.prototype;
                ['playSound', 'playAndHoldSound', 'stop', 'start', 'release'].forEach(function(key) { guard(manager, key); });
                guard(DA.SoundTimer && DA.SoundTimer.prototype, 'doPlay');
            }
            if (typeof G_SoundManager !== 'undefined' && G_SoundManager) {
                ['playSound', 'playAndHoldSound', 'playMusic', 'doPlay', 'stop', 'start', 'release'].forEach(function(key) {
                    guard(G_SoundManager, key);
                });
            }
        };
        protectSound();
        try {
            if (typeof Platform !== 'undefined' && Platform) {
                Platform.isPlatformLogin = function() { return true; };
                if (typeof Platform.needCheckSDKInit === 'function')
                    Platform.needCheckSDKInit = function() { return false; };
            }
        } catch (ePlat) {}
        menu.rootNode.animationManager.runAnimations('default');

        var size = G_Director.getWinSize();
        var caption = cc.LabelTTF.create(
            '\u539f\u6d41\u7a0b\u672c\u5730\u9002\u914d \u00b7 \u70b9\u51fb\u8fdb\u5165\u6e38\u620f',
            'Arial', 18
        );
        caption.setPosition(size.width / 2, 24);
        menu.rootNode.addChild(caption, 99999);

        var setCaption = function(text) {
            try { caption.setString(text); } catch (e) {}
        };

        var LocalNative = {
            storeKey: STORE_KEY,
            schema: SCHEMA,
            lastError: null,
            callLog: [],
            settleTrace: [],
            // Inferred new-account seed from Rookie preconditions (NOT the eight test buildings).
            // Tile x/y are placeholders inside MAP_SIZE_BUILD until a real start_game dump exists.
            // User-authorized fallback: stock train tutorial requires a finished 207 at login.
            inferredSource: 'local-starter-fallback-201-206-212-202-204-207'
        };

        // Natural enemy-attack settlement text trail (status + dedicated key).
        try {
            LocalNative.legacyPromotionLog = JSON.parse(sys.localStorage.getItem('dino.local.native.status') || '{}').log || [];
        } catch (eLegacyPromote) { LocalNative.legacyPromotionLog = []; }
        LocalNative.pushSettleTrace = function(entry) {
            try {
                if (!entry || typeof entry !== 'object') return;
                entry.t = Date.now();
                LocalNative.settleTrace.push(entry);
                if (LocalNative.settleTrace.length > 80) LocalNative.settleTrace.shift();
                sys.localStorage.setItem('dino.local.native.settle.trace', JSON.stringify({
                    latest: entry,
                    events: LocalNative.settleTrace
                }));
                LocalNative.writeStatus({
                    step: 'settle-trace',
                    kind: entry.kind || entry.method || entry.rpc || null,
                    snap: entry
                });
            } catch (eTr) {}
        };

        LocalNative.snapshotSettleGc = function(gc) {
            var snap = {
                stage: typeof GS_CURRENT_STAGE !== 'undefined' ? GS_CURRENT_STAGE : null,
                inReplayMode: !!(gc && gc.inReplayMode),
                isEnterEnemyAttackReplay: !!(gc && gc.isEnterEnemyAttackReplay),
                battleStarted: !!(gc && gc.battleStarted),
                battleFinished: !!(gc && gc.battleFinished),
                waitDelayed: !!(gc && gc.waitDelayedBattleFinish),
                isUnitSent: !!(gc && gc.isUnitSent),
                first_time_stage: (typeof G_Player !== 'undefined' && G_Player)
                    ? G_Player.first_time_stage : null,
                attackersN: gc && gc.attackers ? gc.attackers.length : null
            };
            try {
                if (gc && gc.battleRecorder &&
                    typeof gc.battleRecorder.isUserOperationFinished === 'function')
                    snap.operationDone = !!gc.battleRecorder.isUserOperationFinished();
                if (gc && gc.battleRecorder && gc.battleRecorder.records)
                    snap.recordsN = gc.battleRecorder.records.length;
            } catch (eSnap) {}
            return snap;
        };

        LocalNative.readRaw = function() {
            var raw = sys.localStorage.getItem(STORE_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        };

        LocalNative.writeRaw = function(obj) {
            if (typeof LocalNative.validateStore === 'function' && !LocalNative.validateStore(obj))
                throw new Error('Refusing invalid native store; previous save preserved');
            var text = JSON.stringify(obj);
            var previous = sys.localStorage.getItem(STORE_KEY);
            if (previous && previous !== text) {
                // Preserve a valid previous revision before replacing the primary.
                try {
                    if (LocalNative.validateStore(JSON.parse(previous)))
                        sys.localStorage.setItem(STORE_KEY + '.previous', previous);
                } catch (ePrevious) {}
            }
            sys.localStorage.setItem(STORE_KEY, text);
            var back = sys.localStorage.getItem(STORE_KEY);
            if (back !== text) throw new Error('native store verify failed');
            return obj;
        };

        LocalNative.defaultPlayer = function() {
            return {
                nickname: 'LocalRookie',
                nickname_free: 1,
                account: 'local-001',
                account_id: 'local-001',
                accountID: 'local-001',
                gameid: 'h1-local',
                level: 1,
                soldiers: 0,
                protect_time: 0,
                protect_time_p: 0,
                busyWorker: 0,
                // New-account wallet: 50 opening + 100「女神的来信」→ 150；英灵值来自公测新手礼包。
                diamond: 150,
                spirit: 50,
                league_points: 0,
                christmas_points: 0,
                frozen_d: 0,
                unfrozen_t: 0,
                exp: 0,
                experience: 0,
                // 0 = new account: _enterWorldAction → FirstMovie.begin → _beginRookie (GH_story_*).
                first_movie_played: 0,
                rookie_protect: 1,
                is_rookie_pve: 1,
                spirit_free: 0,
                consecutive_days: 1,
                first_time_stage: 0,
                new_hero_type: 0,
                synthesis_score: 0,
                defence_score: 0,
                arena_score: 0,
                buffs: [],
                // Stock ChapterComponent / PVEFlag use object maps, not arrays.
                // availableStages[stageId] = [goldLoot, woodLoot, stars, remainFlag]
                availableStages: {},
                finishedVirtualStages: {},
                pve_awardBox: {},
                stage: 0,
                pveStage: 0,
                pve_mode: 0,
                activity_params: {},
                pvp_fake_times: 0,
                wanted_id: 0,
                rookie_promote_hero: 0,
                league_id: 0,
                apply_backup_time: 0,
                online_time: 0,
                login_time: Math.floor(Date.now() / 1000),
                access_token: 'local',
                // Comp.PVESweepManager reads these on init; max_tili from data.pve_sweep[1].
                pve_sweep_tili: 10,
                pve_sweep_ltt: Math.floor(Date.now() / 1000),
                // Comp.NewMessage / LetterManager / BattleRecorder — needed for initByServer.
                new_message: 0,
                login_warn_attack_num: 0,
                unlooked_attack_num: 0,
                letters: [],
                sys_letters: [],
                letter_paper_num: 0,
                last_send_letter_time: 0,
                update_info: {},
                battle_recorders: []
            };
        };

        LocalNative.ensurePlayerSocialFields = function(player) {
            if (!player || typeof player !== 'object') return player;
            var defaults = {
                new_message: 0,
                login_warn_attack_num: 0,
                unlooked_attack_num: 0,
                letters: [],
                sys_letters: [],
                letter_paper_num: 0,
                last_send_letter_time: 0,
                update_info: {},
                battle_recorders: [],
                // Stock QuestManager.init replaces its constructor map with these
                // server fields. A missing map aborts SoldierTrainer.addSoldier.
                main_quest: {},
                finish_main_quest_timestamp: 0,
                // Account storage slots are independent of hero_attack_num.
                // One slot is the local minimum for the fallback opening Dino.
                hero_slot_num: 1,
                hero_slot_buy_num: 0,
                achieve_raw: {},
                gained_achieve: {},
                exp: 0,
                experience: 0,
                diamond: 0,
                spirit: 0,
                league_points: 0,
                christmas_points: 0,
                frozen_d: 0,
                unfrozen_t: 0,
                pve_sweep_tili: 10,
                pve_sweep_ltt: Math.floor(Date.now() / 1000)
            };
            for (var k in defaults) {
                if (!Object.prototype.hasOwnProperty.call(defaults, k)) continue;
                if (player[k] === undefined || player[k] === null)
                    player[k] = defaults[k];
            }
            LocalNative.ensureAvailableStages(player, 'social-fields');
            if (typeof LocalNative.ensureWelcomeLetter === 'function') LocalNative.ensureWelcomeLetter(player);
            return player;
        };

        // Stock ChapterComponent / PVEFlag need object maps:
        // availableStages[stageId] = [goldLoot, woodLoot, stars, remainFlag]
        // Arrays ([], [20001]) break hasOwnProperty(stageId) and gray every flag.
        LocalNative.normalizeStageMap = function(value, asVirtual) {
            if (value && typeof value === 'object' && !Array.isArray(value)) return value;
            var out = {};
            if (Array.isArray(value)) {
                for (var i = 0; i < value.length; i++) {
                    var item = value[i];
                    if (asVirtual) {
                        if (item == null) continue;
                        out[String(item)] = 1;
                    } else if (item && typeof item === 'object' && item.stage != null) {
                        out[String(item.stage)] = item.entry || [0, 0, 0, 0];
                    }
                }
            }
            return out;
        };

        LocalNative.readPveStageLoot = function(stageId) {
            var gold = 0, wood = 0;
            try {
                if (typeof data !== 'undefined' && data && data.pve_stage) {
                    var cfg = data.pve_stage[stageId] || data.pve_stage[String(stageId)];
                    if (cfg) {
                        gold = cfg.coin_storage || 0;
                        wood = cfg.solar_storage || 0;
                    }
                }
            } catch (eLoot) {}
            return [gold, wood, 0, 0];
        };

        // After virtual raid 20001, server unlocks campaign stage 1.
        // [gold, wood, stars, passTime]; stock QuestManager.get_mt_stage needs
        // passTime > 0. Older local settlements saved stars but left it at zero.
        LocalNative.ensureAvailableStages = function(player, reason) {
            if (!player || typeof player !== 'object') return false;
            var changed = false;
            var stages = LocalNative.normalizeStageMap(player.availableStages, false);
            if (stages !== player.availableStages) {
                player.availableStages = stages;
                changed = true;
            }
            for (var stageKey in stages) {
                if (!Object.prototype.hasOwnProperty.call(stages, stageKey)) continue;
                var entry = stages[stageKey];
                if (Array.isArray(entry) && Number(entry[2]) > 0 &&
                    !(Number(entry[3]) > 0)) {
                    // Existing stars prove a clear, but not its historical count/time.
                    // One is the minimal positive marker accepted by the stock client.
                    entry[3] = 1;
                    changed = true;
                    LocalNative.writeStatus({step: 'pve-pass-marker-repaired',
                        stage: stageKey, stars: entry[2], reason: reason || null});
                }
            }
            var virtual = LocalNative.normalizeStageMap(player.finishedVirtualStages, true);
            if (virtual !== player.finishedVirtualStages) {
                player.finishedVirtualStages = virtual;
                changed = true;
            }
            var boxes = LocalNative.normalizeStageMap(player.pve_awardBox, false);
            if (boxes !== player.pve_awardBox) {
                player.pve_awardBox = boxes;
                changed = true;
            }
            var raidDone = !!(virtual[20001] || virtual['20001']);
            var hasStage1 = stages.hasOwnProperty(1) || stages.hasOwnProperty('1');
            if (raidDone && !hasStage1) {
                stages[1] = LocalNative.readPveStageLoot(1);
                changed = true;
                LocalNative.writeStatus({
                    step: 'unlock-campaign-stage-1',
                    reason: reason || null,
                    entry: stages[1]
                });
            }
            try {
                if (typeof G_Player !== 'undefined' && G_Player && G_Player === player) {
                    var chapter = G_Player.getComponent && G_Player.getComponent('ChapterComponent');
                    if (chapter) {
                        if (chapter._availableStages == null ||
                            chapter._availableStages !== stages) {
                            if (chapter._availableStages == null)
                                chapter._prevAvailableStages = stages;
                            else if (chapter._prevAvailableStages == null)
                                chapter._prevAvailableStages = chapter._availableStages;
                            chapter._availableStages = stages;
                        }
                    }
                }
            } catch (eCh) {}
            return changed;
        };

        // Server building records use bs/bt. state/beginTime were local-save
        // aliases, not fields consumed by stock BuildingBuilder.init.
        // Convert only at the data boundary; never change placement UI logic.
        LocalNative.toBuildingRecord = function(source) {
            var out = {}, key;
            for (key in source) if (Object.prototype.hasOwnProperty.call(source, key))
                out[key] = source[key];
            var state = source.bs != null ? source.bs : source.state;
            if (state == null) throw new Error('building[' + source.sid + '].bs is missing');
            if (state !== 0 && state !== 1 && state !== 2)
                throw new Error('building[' + source.sid + '].bs is invalid: ' + state);
            var begin = source.bt != null ? source.bt : source.beginTime;
            if (begin == null) begin = 0;
            if (typeof begin !== 'number' || !isFinite(begin) || begin < 0)
                throw new Error('building[' + source.sid + '].bt is invalid');
            out.bs = out.state = state;
            out.bt = out.beginTime = begin;
            var family = Math.floor(Number(source.typeid) / 100);
            if ((family === 201 || family === 203 || family === 205) &&
                (!out.sto || typeof out.sto !== 'object')) {
                out.sto = {1: Number(source.woodstorage) || 0, 2: Number(source.goldstorage) || 0};
            }
            if (family === 202 || family === 204) {
                if (out.sto == null) out.sto = Number(source.currentStorage) || 0;
                if (!isFinite(out.lpt)) out.lpt = isFinite(source.lastCollectTime)
                    ? source.lastCollectTime * 3600 : Math.floor(Date.now() / 1000);
            }
            return out;
        };

        LocalNative.unit = function(sid, typeid, x, y, extra) {
            var fam = Math.floor(typeid / 100);
            var lv = typeid % 100;
            var u = {
                sid: sid,
                typeid: typeid,
                unit_type: fam,
                unit_level: lv,
                x: x,
                y: y,
                state: BUILD_STATE_FINISH,
                beginTime: 0,
                unit_mutateid: 0,
                faction: BATTLE_FACTION_DEFENDER,
                currentStorage: 0,
                lastCollectTime: 0
            };
            if (extra && typeof extra === 'object') {
                for (var ek in extra) {
                    if (Object.prototype.hasOwnProperty.call(extra, ek))
                        u[ek] = extra[ek];
                }
            }
            return LocalNative.toBuildingRecord(u);
        };

        // Opening Dino (迪诺 10401): server start_game heros[]; Rookie 2017 expects an attack hero
        // before unlock_heros shop. Research createHero needs state=HERO_STATE_ATTACK(1).
        LocalNative.STARTER_HERO_TYPEID = 10401;
        LocalNative.defaultStarterHero = function() {
            var attackState = (typeof HERO_STATE_ATTACK !== 'undefined') ? HERO_STATE_ATTACK : 1;
            return {
                sid: 'hero_slot_1',
                typeid: LocalNative.STARTER_HERO_TYPEID,
                unit_type: 104,
                unit_level: 1,
                level: 1,
                mutateid: 0,
                unit_mutateid: 0,
                aidx: 0,
                rct: Math.floor(Date.now() / 1000),
                aht: Math.floor(Date.now() / 1000),
                defense_id: 0,
                donate_id: 0,
                skill_id: 1000001,
                skill_slots: [{sid: 10000, lv: 1, exp: 0}],
                gift: 0,
                state: attackState,
                life: 400,
                health: 12
            };
        };
        LocalNative.defaultHeros = function() {
            return [LocalNative.defaultStarterHero()];
        };
        // Stock HeroAttributeController.setDefenseID → rpc_s_set_hero_defense({defense_id}).
        // Dump/init use did; invasion envelopes also filter defense_id. Persist both.
        LocalNative.applyHeroDefense = function(params) {
            params = params || {};
            var store = LocalNative.readRaw();
            var roster = store && store.level && store.level.heros || [];
            var defenseId = params.defense_id;
            if (defenseId == null) defenseId = '';
            for (var i = 0; i < roster.length; i++) {
                if (String(roster[i].sid) !== String(params.uid)) continue;
                roster[i].did = defenseId;
                roster[i].defense_id = defenseId;
                LocalNative.writeRaw(store);
                LocalNative.writeStatus({
                    step: 'hero-defense-saved',
                    sid: roster[i].sid,
                    did: defenseId === '' ? '' : defenseId
                });
                return true;
            }
            LocalNative.writeStatus({step: 'hero-defense-missing', uid: params.uid});
            return false;
        };
        LocalNative.normalizeHeroExperience = function(level, hero, added) {
            var nest = 0;
            for (var i = 0; i < (level.units || []).length; i++) {
                var typeid = Number(level.units[i].typeid);
                if (Math.floor(typeid / 100) === 206) nest = Math.max(nest, typeid % 100);
            }
            var limit = data.hero_number && data.hero_number[nest];
            var cap = limit && Number(limit.hero_lv_max);
            if (!(cap > 0) || !data.hero_lv_data) throw new Error('Missing hero experience limit');
            var lv = Number(hero.lv) || Number(hero.level) || 1;
            var xp = Math.max(0, Number(hero.xp) || 0) + Math.max(0, Number(added) || 0);
            var oldLv = lv, oldXp = hero.xp;
            // Stock MatchEnd calls ExpBar.addGrowthXp. Persist the same threshold
            // transitions separately so its display animation cannot lose levels.
            while (lv < cap) {
                var cfg = data.hero_lv_data[lv], need = cfg && Number(cfg.hero_exp);
                if (!(need > 0)) throw new Error('Missing hero experience threshold ' + lv);
                if (xp < need) break;
                xp -= need; lv++;
            }
            // Do not downgrade pre-existing gifted heroes above the nest limit.
            if (lv === cap) {
                var maxCfg = data.hero_lv_data[lv];
                if (maxCfg && Number(maxCfg.hero_exp) > 0) xp = Math.min(xp, Number(maxCfg.hero_exp));
            }
            hero.lv = hero.level = lv; hero.xp = xp;
            return lv !== oldLv || xp !== oldXp;
        };
        // Stock SkillReplace/SkillUpgrade look up
        // data.skill_to_hero[sid]['skill_exp_' + calSumExp(lv, exp)]. Missing slot.exp
        // makes the key skill_exp_undefined and the UI shows "undefined".
        LocalNative.normalizeHeroSkillSlots = function(hero) {
            if (!hero) return false;
            var slots = hero.skill_slots;
            if (!Array.isArray(slots)) return false;
            var changed = false;
            for (var i = 0; i < slots.length; i++) {
                var slot = slots[i];
                if (!slot || typeof slot !== 'object') continue;
                if (!(Number(slot.lv) > 0)) { slot.lv = 1; changed = true; }
                if (slot.exp == null || !isFinite(Number(slot.exp)) || Number(slot.exp) < 0) {
                    slot.exp = 0;
                    changed = true;
                }
            }
            return changed;
        };

        LocalNative.getMaxSunshineCapacity = function(level) {
            try {
                var rm = typeof G_Player !== 'undefined' && G_Player &&
                    G_Player.getComponent && G_Player.getComponent('ResourceManager');
                var woodType = typeof RES_TYPE_WOOD !== 'undefined' ? RES_TYPE_WOOD : 1;
                if (rm && typeof rm.getMaxRes === 'function') {
                    var maxLive = Number(rm.getMaxRes(woodType));
                    if (maxLive > 0) return maxLive;
                }
                if (rm && rm.maxRes) {
                    var maxArr = Number(rm.maxRes[woodType]);
                    if (maxArr > 0) return maxArr;
                }
            } catch (eMax) {}
            level = level || (LocalNative.readRaw() && LocalNative.readRaw().level);
            var total = 0;
            var units = (level && level.units) || [];
            for (var u = 0; u < units.length; u++) {
                var cfg = LocalNative.lookupUnitMain(units[u].typeid);
                total += Number(cfg && cfg.wood_storage) || 0;
            }
            return total;
        };

        LocalNative.resolveSkillWoodCost = function(slot, level) {
            var lv = Math.max(1, Number(slot && slot.lv) || 1);
            var exp = Math.max(0, Number(slot && slot.exp) || 0);
            var sumExp = exp;
            if (typeof UI !== 'undefined' && UI.SkillReplace &&
                typeof UI.SkillReplace.calSumExp === 'function') {
                sumExp = UI.SkillReplace.calSumExp(lv, exp);
            } else if (typeof data !== 'undefined' && data.skill_lv_client) {
                for (var i = 1; i < lv; i++)
                    sumExp += Number(data.skill_lv_client[i] && data.skill_lv_client[i].skill_exp) || 0;
            }
            var sid = Number(slot && slot.sid);
            var row = typeof data !== 'undefined' && data.skill_to_hero && data.skill_to_hero[sid];
            var cost = row && row['skill_exp_' + sumExp];
            if (cost != null && isFinite(Number(cost)) && Number(cost) >= 0)
                return {cost: Number(cost), sumExp: sumExp, source: 'skill_to_hero'};
            var fallback = Math.max(1, Math.floor(LocalNative.getMaxSunshineCapacity(level) / 3));
            return {cost: fallback, sumExp: sumExp, source: 'max-sunshine-1/3'};
        };

        LocalNative.installSkillReplaceCostFix = function() {
            function patch(proto, field, labelNode) {
                if (!proto || typeof proto.setButton !== 'function' || proto.setButton.__localSkillCost)
                    return;
                var original = proto.setButton;
                proto.setButton = function() {
                    if (this.oldSlot) {
                        if (!(Number(this.oldSlot.lv) > 0)) this.oldSlot.lv = 1;
                        if (this.oldSlot.exp == null || !isFinite(Number(this.oldSlot.exp)) ||
                            Number(this.oldSlot.exp) < 0) this.oldSlot.exp = 0;
                    }
                    var ret = original.apply(this, arguments);
                    var cur = this[field];
                    if (cur != null && isFinite(Number(cur))) return ret;
                    var resolved = LocalNative.resolveSkillWoodCost(this.oldSlot);
                    this[field] = resolved.cost;
                    var node = this[labelNode];
                    if (node && typeof node.setString === 'function')
                        node.setString(String(resolved.cost));
                    if (node && typeof UI !== 'undefined' && UI.NumericLable &&
                        typeof UI.NumericLable.setResourceColor === 'function') {
                        var woodType = typeof RES_TYPE_WOOD !== 'undefined' ? RES_TYPE_WOOD : 1;
                        UI.NumericLable.setResourceColor(node, woodType, resolved.cost);
                    }
                    LocalNative.writeStatus({
                        step: 'skill-replace-cost-fix',
                        field: field,
                        sid: this.oldSlot && this.oldSlot.sid,
                        sumExp: resolved.sumExp,
                        cost: resolved.cost,
                        source: resolved.source
                    });
                    return ret;
                };
                proto.setButton.__localSkillCost = true;
            }
            if (typeof UI === 'undefined') return;
            patch(UI.SkillReplace && UI.SkillReplace.prototype, 'replaceResNum', 'reResNum');
            patch(UI.SkillUpgrade && UI.SkillUpgrade.prototype, 'enforceResNum', 'enResNum');
        };

        LocalNative.ensureHeroSkill = function(hero, preferred) {
            var changed = false;
            var slots = hero.skill_slots || [];
            var has = false;
            for (var i = 0; i < slots.length; i++) {
                if (Number(slots[i].sid) > 0 && Number(slots[i].lv) > 0) { has = true; break; }
            }
            if (!has) {
                var id = Number(preferred || hero.skill_id) || 0;
                if (!id && hero.sid === 'hero_slot_1' && Number(hero.typeid) === 10401) id = 1000001;
                if (!id) {
                    var family = Math.floor(Number(hero.typeid) / 100);
                    var mapping = data.hero_to_skill && data.hero_to_skill[family];
                    var candidates = mapping && mapping.skill_id || [], pool = [];
                    for (var s = 0; s < candidates.length; s++) {
                        var sid = Number(candidates[s]);
                        var cfg = data.skill_to_hero && data.skill_to_hero[sid];
                        // Learnable ordinary skills have stock learning weights; summon,
                        // mutation and tutorial-only skills have no such weights.
                        if (cfg && Number(cfg.to_hero_id) === family &&
                            Number(cfg.skill_weight_1) > 0 && data.skill_data[sid * 100 + 1]) pool.push(sid);
                    }
                    if (!pool.length) throw new Error('Missing ordinary hero skills: ' + hero.typeid);
                    id = pool[Math.floor(Math.random() * pool.length)] * 100 + 1;
                }
                hero.skill_id = id;
                hero.skill_slots = [{sid: Math.floor(id / 100), lv: (id % 100) || 1, exp: 0}];
                changed = true;
            }
            if (LocalNative.normalizeHeroSkillSlots(hero)) changed = true;
            return changed;
        };
        // Stock BUILD ILD iterates units, then __buildUnit routes is_hero to
        // HeroManager.createHero. Keep the saved roster separate from buildings.
        LocalNative.makeHomeInitDict = function(level) {
            var out = {}, key;
            for (key in level) if (Object.prototype.hasOwnProperty.call(level, key)) out[key] = level[key];
            // Stock __buildUnit assigns setSid(key), not params.sid. Supply a
            // server-ID map so array indexes cannot collide with player/hero IDs.
            out.units = {};
            var units = level.units || [];
            for (var i in units) {
                var u = units[i];
                var sid = u.sid != null ? u.sid : i;
                out.units[String(sid)] = Math.floor(Number(u.typeid) / 100) < 200
                    ? u : LocalNative.toBuildingRecord(u);
            }
            var heros = level.heros || [];
            for (var h = 0; h < heros.length; h++) {
                var hero = heros[h];
                if (!hero || out.units.hasOwnProperty(String(hero.sid))) continue;
                out.units[String(hero.sid)] = hero;
            }
            if (out.player) LocalNative.ensureAvailableStages(out.player, 'home-init');
            return out;
        };
        LocalNative.ensureStarterHeros = function(level) {
            if (!level || typeof level !== 'object') return false;
            if (!(level.heros instanceof Array)) level.heros = [];
            var changed = false;
            if (level.heros.length === 0) {
                level.heros.push(LocalNative.defaultStarterHero());
                changed = true;
            }
            // Correct only our legacy starter record; preserve explicit server aidx
            // and other heroes' assignment/state. Stock reads aidx, never attack_index.
            for (var i = 0; i < level.heros.length; i++) {
                var hero = level.heros[i];
                if (LocalNative.ensureHeroSkill(hero)) changed = true;
                if (typeof data !== 'undefined' && data.hero_lv_data && data.hero_number &&
                    LocalNative.normalizeHeroExperience(level, hero, 0)) changed = true;
                // Stock dump writes did; some local paths only kept defense_id.
                if (hero.did != null && hero.did !== '' &&
                    (hero.defense_id == null || hero.defense_id === '' || hero.defense_id === 0)) {
                    hero.defense_id = hero.did;
                    changed = true;
                } else if (hero.defense_id != null && hero.defense_id !== '' && hero.defense_id !== 0 &&
                    (hero.did == null || hero.did === '')) {
                    hero.did = hero.defense_id;
                    changed = true;
                }
                if (hero.sid === 'hero_slot_1' && hero.typeid === LocalNative.STARTER_HERO_TYPEID &&
                    hero.aidx == null && hero.attack_index === 1) {
                    hero.aidx = 0;
                    delete hero.attack_index;
                    changed = true;
                }
                if (hero.sid === 'hero_slot_1' && hero.typeid === LocalNative.STARTER_HERO_TYPEID) {
                    if (hero.rct == null) { hero.rct = Math.floor(Date.now() / 1000); changed = true; }
                    if (hero.aht == null) { hero.aht = Math.floor(Date.now() / 1000); changed = true; }
                }
            }
            // Reconcile the missing stock stage-2 first-win hero reward for old
            // local saves too: pve_stage[2].pve_first_reward=8004 -> hero 9803 ->10501.
            // Stable receipt prevents a sold/consumed reward from being granted again.
            var stage2 = level.player && level.player.availableStages && level.player.availableStages[2];
            if (stage2 && Number(stage2[2]) > 0 && !level.localStage2HeroReward) {
                var rewardSid = 'pve_first_2_hero';
                var exists = false;
                for (var h = 0; h < level.heros.length; h++) {
                    if (level.heros[h].sid === rewardSid) exists = true;
                }
                if (!exists) {
                    var reward = LocalNative.defaultStarterHero();
                    reward.sid = rewardSid;
                    reward.typeid = 10501;
                    reward.unit_type = 105;
                    reward.state = typeof HERO_STATE_IDLE !== 'undefined' ? HERO_STATE_IDLE : 0;
                    reward.aidx = -1;
                    // Let stock attributes calculate full initial life/health.
                    delete reward.life;
                    delete reward.health;
                    reward.lv = 1;
                    reward.xp = 0;
                    reward.skill_slots = [{sid: 151, lv: 1, exp: 0}];
                    reward.skill_id = 15101;
                    level.heros.push(reward);
                }
                level.player.hero_slot_num = Math.max(Number(level.player.hero_slot_num) || 0, level.heros.length);
                level.localStage2HeroReward = true;
                changed = true;
            }
            return changed;
        };

        LocalNative.defaultLevelDict = function() {
            // Local fallback; official start_game layout is still unavailable.
            // Finished 207 is required by stock tutorial 201501; preserve upgrade gating.
            // 301/205/203 are built during tutorial.
            // user_config {} = brand-new Rookie bits so GH_story_1..3 then 201100(301) can start.
            // heros: opening Dino already in attack slot (city lv1 attack_num=1).
            return {
                player: LocalNative.defaultPlayer(),
                units: [
                    // Home carries researched starter gold/wood in storage fields for ResourceHolder init.
                    LocalNative.unit(1, 20101, 28, 28, {
                        currentStorage: 5000,
                        goldstorage: 5000,
                        woodstorage: 5000,
                        gold_storage_cur: 5000,
                        wood_storage_cur: 5000
                    }),
                    LocalNative.unit(2, 20601, 20, 28),
                    LocalNative.unit(3, 21201, 26, 36),
                    LocalNative.unit(4, 20201, 34, 28),
                    LocalNative.unit(5, 20401, 34, 36),
                    LocalNative.unit(6, 20701, 20, 36)
                ],
                walls: [],
                model_info: {},
                heros: LocalNative.defaultHeros(),
                hero_donate_list: [],
                user_config: {}
            };
        };

        // Keep every saved building. Only fill the missing user-authorized train yard.
        LocalNative.normalizeStarterBuildings = function(level) {
            if (!level || !(level.units instanceof Array)) return false;
            var nextSid = 1;
            for (var i = 0; i < level.units.length; i++) {
                var u = level.units[i];
                if (Math.floor(Number(u.typeid) / 100) === 207) return false;
                nextSid = Math.max(nextSid, (Number(u.sid) || 0) + 1);
            }
            // Placeholder coordinates, never an official layout. Avoid saved buildings
            // using stock footprints; the conservative span works for either tile anchor.
            function free(x, y) {
                for (var j = 0; j < level.units.length; j++) {
                    var saved = level.units[j];
                    if (Math.floor(Number(saved.typeid) / 100) < 200) continue;
                    var cfg = typeof data !== 'undefined' && data.unit_main && data.unit_main[saved.typeid];
                    var sx = Math.max(5, Number(cfg && cfg.tilesize_x) || 6);
                    var sy = Math.max(5, Number(cfg && cfg.tilesize_y) || 6);
                    if (Math.abs(x - saved.x) < sx && Math.abs(y - saved.y) < sy) return false;
                }
                return true;
            }
            var x = 20, y = 36;
            if (!free(x, y)) {
                var found = false;
                for (y = 10; y <= 44 && !found; y++) {
                    for (x = 10; x <= 44; x++) {
                        if (free(x, y)) { found = true; break; }
                    }
                    if (found) break;
                }
                if (!found) throw new Error('No free tile for starter train yard');
            }
            level.units.push(LocalNative.unit(nextSid, 20701, x, y));
            return true;
        };

        // _enterWorldAction calls firstMovie.begin → on finish GETCGC._beginRookie.
        // If FirstMovie is skipped/crashes without this kick, Rookie story never starts.
        LocalNative.kickBeginRookie = function(reason) {
            try {
                var gc = LocalNative.getBuildController();
                if (!gc) {
                    LocalNative.writeStatus({step: 'beginRookie-no-gc', reason: reason || null});
                    return false;
                }
                if (gc.rookieStarted) {
                    LocalNative.writeStatus({
                        step: 'beginRookie-skip',
                        reason: reason || null,
                        already: true
                    });
                    return false;
                }
                // Ensure structures exist even if initRookieByServer soft-failed earlier.
                if (!gc.finishedRookiePIDs || !gc.unfinishedRookiePIDs) {
                    try { LocalNative.bootstrapRookieFallback(gc, {}); } catch (eBf2) {}
                }
                if (typeof gc._beginRookie === 'function') {
                    try {
                        gc._beginRookie();
                        LocalNative.writeStatus({
                            step: 'beginRookie-kicked',
                            via: '_beginRookie',
                            reason: reason || null,
                            rookieStarted: !!gc.rookieStarted
                        });
                        return true;
                    } catch (eBeg) {
                        LocalNative.writeStatus({
                            step: 'beginRookie-_begin-soft',
                            reason: reason || null,
                            error: String(eBeg)
                        });
                    }
                }
                if (typeof gc.beginRookie === 'function') {
                    try {
                        gc.beginRookie();
                        LocalNative.writeStatus({
                            step: 'beginRookie-kicked',
                            via: 'beginRookie',
                            reason: reason || null,
                            rookieStarted: !!gc.rookieStarted
                        });
                        return true;
                    } catch (eBeg2) {
                        LocalNative.writeStatus({
                            step: 'beginRookie-begin-soft',
                            reason: reason || null,
                            error: String(eBeg2)
                        });
                    }
                }
                LocalNative.writeStatus({step: 'beginRookie-missing', reason: reason || null});
                return false;
            } catch (eKick) {
                LocalNative.writeStatus({
                    step: 'beginRookie-ERR',
                    reason: reason || null,
                    error: String(eKick)
                });
                return false;
            }
        };

        LocalNative.markFirstMoviePlayed = function(player) {
            try {
                if (player) player.first_movie_played = 1;
                if (G_Player) G_Player.first_movie_played = 1;
                var store = LocalNative.readRaw();
                if (store && store.level && store.level.player) {
                    store.level.player.first_movie_played = 1;
                    store.updatedAt = Math.floor(Date.now() / 1000);
                    LocalNative.writeRaw(store);
                }
            } catch (eM) {}
        };

        LocalNative.installFirstMovieGuide = function() {
            try {
                if (typeof FirstMovie === 'undefined' || !FirstMovie || !FirstMovie.prototype) return;
                if (typeof FirstMovie.prototype.begin !== 'function') return;
                if (FirstMovie.prototype.begin.__localNativePatched) return;
                var origFM = FirstMovie.prototype.begin;
                FirstMovie.prototype.begin = function() {
                    var played = !!(G_Player && G_Player.first_movie_played);
                    LocalNative.writeStatus({step: 'FirstMovie.begin', played: played});
                    // Continue-game: movie already done — still must start Rookie update loop.
                    if (played) {
                        LocalNative.scheduleOnRoot(function() {
                            LocalNative.kickBeginRookie('already-played');
                        }, 0);
                        return undefined;
                    }
                    try {
                        var ret = origFM.apply(this, arguments);
                        // Safety: if CCBI hangs without calling _beginRookie, kick after delay.
                        LocalNative.scheduleOnRoot(function() {
                            LocalNative.kickBeginRookie('firstmovie-timeout');
                        }, 12);
                        return ret;
                    } catch (eFM) {
                        LocalNative.writeStatus({
                            step: 'FirstMovie.begin-ERR',
                            error: String(eFM),
                            stack: (eFM && eFM.stack) ? String(eFM.stack).split('\n').slice(0, 6) : null
                        });
                        LocalNative.markFirstMoviePlayed(G_Player);
                        LocalNative.scheduleOnRoot(function() {
                            LocalNative.kickBeginRookie('firstmovie-catch');
                        }, 0);
                        return undefined;
                    }
                };
                FirstMovie.prototype.begin.__localNativePatched = true;
                LocalNative.writeStatus({step: 'FirstMovie.patch-ok'});
            } catch (eFMp) {
                LocalNative.writeStatus({step: 'FirstMovie.patch-ERR', error: String(eFMp)});
            }
        };

        LocalNative.validateStore = function(value) {
            if (!value || value.version !== SCHEMA) return false;
            if (!value.level || typeof value.level !== 'object') return false;
            var lv = value.level;
            if (!lv.player || !lv.units || !(lv.units instanceof Array)) return false;
            if (!lv.walls || !lv.user_config) return false;
            if (typeof lv.model_info !== 'object') return false;
            if (!(lv.hero_donate_list instanceof Array)) return false;
            // heros optional on old saves; ensureStarterHeros fills opening Dino when empty.
            if (lv.heros != null && !(lv.heros instanceof Array)) return false;
            if (lv.units.length < 1) return false;
            for (var i = 0; i < lv.units.length; i++) {
                var u = lv.units[i];
                if (!u || (typeof u.sid !== 'number' && typeof u.sid !== 'string') ||
                    String(u.sid).length === 0 || typeof u.typeid !== 'number' || !isFinite(u.typeid)) return false;
                if (typeof u.x !== 'number' || !isFinite(u.x) ||
                    typeof u.y !== 'number' || !isFinite(u.y)) return false;
            }
            return true;
        };

        LocalNative.loadOrCreate = function() {
            var existing = null;
            try { existing = LocalNative.readRaw(); } catch (e) {
                throw new Error('corrupt native store: ' + e);
            }
            if (existing) {
                if (!LocalNative.validateStore(existing))
                    throw new Error('native store schema mismatch');
                existing.level.player.login_time = Math.floor(Date.now() / 1000);
                LocalNative.ensureRookieSign(existing.level);
                LocalNative.ensureMonthlySign(existing.level);
                LocalNative.ensurePlayerSocialFields(existing.level.player);
                LocalNative.repairPromotionCounter(existing.level);
                if (!existing.level.user_config) existing.level.user_config = {};
                (existing.level.units || []).forEach(function(u) {
                    if (u.typeid != null) {
                        u.unit_type = Math.floor(Number(u.typeid) / 100);
                        u.unit_level = Number(u.typeid) % 100;
                        if (u.unit_mutateid == null) u.unit_mutateid = 0;
                    }
                });
                // Empty-nest local saves: seed opening Dino so Rookie attack-team steps can run.
                LocalNative.ensureStarterHeros(existing.level);
                // Existing saves keep their buildings and receive a missing starter train yard.
                if (LocalNative.normalizeStarterBuildings(existing.level)) {
                    existing.source = LocalNative.inferredSource;
                    existing.revision = (existing.revision || 0) + 1;
                    LocalNative.writeStatus({
                        step: 'normalize-starter-buildings',
                        source: existing.source,
                        units: (existing.level.units || []).map(function(u) {
                            return { sid: u.sid, typeid: u.typeid };
                        })
                    });
                }
                existing.level.units = existing.level.units.map(function(u) {
                    if (Math.floor(Number(u.typeid) / 100) < 200) return u;
                    return LocalNative.toBuildingRecord(u);
                });
                LocalNative.writeRaw(existing);
                LocalNative.syncNextSid(existing.level.units);
                return { store: existing, created: false };
            }
            var store = {
                version: SCHEMA,
                source: LocalNative.inferredSource,
                revision: 0,
                createdAt: Math.floor(Date.now() / 1000),
                updatedAt: Math.floor(Date.now() / 1000),
                level: LocalNative.defaultLevelDict()
            };
            LocalNative.ensureRookieSign(store.level);
            LocalNative.ensureMonthlySign(store.level);
            LocalNative.writeRaw(store);
            return { store: store, created: true };
        };

        LocalNative.saveLevel = function(levelDict) {
            var store = LocalNative.readRaw();
            // Progress is persisted by RPC, not by dumpLevelData's empty/stale config.
            if (store && store.level) {
                if (store.level.localStage2HeroReward) levelDict.localStage2HeroReward = true;
                if (store.level.localTutorialEgg) levelDict.localTutorialEgg = store.level.localTutorialEgg;
                if (store.level.localPveFirstRewards) levelDict.localPveFirstRewards = store.level.localPveFirstRewards;
                if (store.level.localTrader) levelDict.localTrader = store.level.localTrader;
                if (store.level.player && store.level.player.arena_state) {
                    levelDict.player.arena_state = JSON.parse(JSON.stringify(store.level.player.arena_state));
                    levelDict.player.arena_score = store.level.player.arena_score;
                    ['localArenaSequence', 'localArenaBattle', 'localArenaPromotionFailure'].forEach(function(key) {
                        if (Object.prototype.hasOwnProperty.call(store.level, key))
                            levelDict[key] = JSON.parse(JSON.stringify(store.level[key]));
                        else delete levelDict[key];
                    });
                    // Server-owned attempt counters must not be replaced by a
                    // stale client dump while saving other home changes.
                    var period = data.period_control[GlobalDefine.ARENA_ATTACK_PERIOD_ID].period_type;
                    var savedCounters = store.level.player.event_counters;
                    if (savedCounters && savedCounters[period] &&
                        savedCounters[period][GlobalDefine.ARENA_ATTACK_PERIOD_ID]) {
                        var counters = levelDict.player.event_counters ||
                            (levelDict.player.event_counters = {});
                        var bucket = counters[period] || (counters[period] = {});
                        bucket[GlobalDefine.ARENA_ATTACK_PERIOD_ID] = JSON.parse(JSON.stringify(
                            savedCounters[period][GlobalDefine.ARENA_ATTACK_PERIOD_ID]));
                    }
                }
                if (store.level.localRookieSign) {
                    levelDict.localRookieSign = store.level.localRookieSign;
                    levelDict.player.rookie_days = store.level.player.rookie_days;
                    ['diamond', 'spirit', 'package'].forEach(function(key) {
                        if (levelDict.player[key] === undefined)
                            levelDict.player[key] = store.level.player[key];
                    });
                    LocalNative.ensureRookieSign(levelDict);
                }
                if (store.level.localMonthlySign) {
                    levelDict.localMonthlySign = store.level.localMonthlySign;
                    if (levelDict.player.diamond === undefined)
                        levelDict.player.diamond = store.level.player.diamond;
                    LocalNative.ensureMonthlySign(levelDict);
                }
                levelDict.user_config = store.level.user_config || levelDict.user_config || {};
                if (levelDict.player && store.level.player && store.level.player.first_movie_played)
                    levelDict.player.first_movie_played = store.level.player.first_movie_played;
                // battle_to_home / dump often omit heros; do not wipe the nest roster.
                if (!(levelDict.heros instanceof Array) || levelDict.heros.length === 0) {
                    if (store.level.heros instanceof Array && store.level.heros.length)
                        levelDict.heros = store.level.heros;
                }
            }
            if (typeof LocalNative.ensureStarterHeros === 'function')
                LocalNative.ensureStarterHeros(levelDict);
            if (!store) {
                store = {
                    version: SCHEMA,
                    source: LocalNative.inferredSource,
                    revision: 0,
                    createdAt: Math.floor(Date.now() / 1000),
                    level: levelDict
                };
            } else {
                store.level = levelDict;
                store.revision = (store.revision || 0) + 1;
            }
            store.updatedAt = Math.floor(Date.now() / 1000);
            return LocalNative.writeRaw(store);
        };

        LocalNative.mergeUserConfig = function(patch) {
            var store = LocalNative.readRaw();
            if (!store) return null;
            if (!store.level.user_config) store.level.user_config = {};
            var cfg = store.level.user_config;
            if (patch && typeof patch === 'object') {
                // Rookie.setUserConfig / unsetUserConfig: {value, offset} bit updates.
                if (patch.offset != null && patch.value != null && typeof patch.value !== 'object') {
                    cfg[String(patch.offset)] = patch.value;
                    if (!cfg.rookieBits || typeof cfg.rookieBits !== 'object') cfg.rookieBits = {};
                    cfg.rookieBits[String(patch.offset)] = patch.value;
                } else if (patch.key != null && patch.value != null && typeof patch.value !== 'object' &&
                    patch.offset == null) {
                    // Named slot form observed live: {key:"rookie0", value:2114}.
                    cfg[String(patch.key)] = patch.value;
                    if (String(patch.key).indexOf('rookie') === 0) {
                        if (!cfg.rookieBits || typeof cfg.rookieBits !== 'object') cfg.rookieBits = {};
                        cfg.rookieBits[String(patch.key)] = patch.value;
                    }
                } else {
                    for (var k in patch) {
                        if (!Object.prototype.hasOwnProperty.call(patch, k)) continue;
                        if (k === 'offset' && patch.value != null && typeof patch.value !== 'object')
                            continue;
                        if (k === 'key' && patch.value != null && typeof patch.value !== 'object')
                            continue;
                        cfg[k] = patch[k];
                    }
                }
            }
            store.revision = (store.revision || 0) + 1;
            store.updatedAt = Math.floor(Date.now() / 1000);
            LocalNative.writeRaw(store);
            LocalNative.writeStatus({
                step: 'user_config-merge',
                keys: cfg ? Object.keys(cfg) : null,
                offset: patch && patch.offset != null ? patch.offset : null,
                namedKey: patch && patch.key != null ? String(patch.key) : null
            });
            return cfg;
        };

        LocalNative.nextSid = 100;
        LocalNative.pendingBuilds = {};
        LocalNative.completedSids = {};

        LocalNative.syncNextSid = function(units) {
            var maxSid = LocalNative.nextSid - 1;
            if (units && units.length) {
                for (var i = 0; i < units.length; i++) {
                    var s = units[i] && units[i].sid;
                    // Stock setSid/collection keys produce numeric strings on reload.
                    if (typeof s !== 'number' &&
                        !(typeof s === 'string' && /^[0-9]+$/.test(s))) continue;
                    s = Number(s);
                    if (isFinite(s) && Math.floor(s) === s && s <= 9007199254740991 &&
                        s > maxSid) maxSid = s;
                }
            }
            LocalNative.nextSid = maxSid + 1;
            return LocalNative.nextSid;
        };

        LocalNative.allocateSid = function() {
            var store = LocalNative.readRaw();
            if (store && store.level) {
                LocalNative.syncNextSid(store.level.units);
                LocalNative.syncNextSid(store.level.heros);
            }
            for (;;) {
                var sid = LocalNative.nextSid;
                if (!(sid > 0) || sid % 1 || sid > 9007199254740991)
                    throw new Error('Building SID range exhausted');
                var occupied = LocalNative.pendingBuilds && LocalNative.pendingBuilds[sid];
                if (!occupied && typeof G_UnitManager !== 'undefined' && G_UnitManager &&
                    typeof G_UnitManager.getUnitBySID === 'function') {
                    var live = G_UnitManager.getUnitBySID(sid);
                    // Stock getUnitBySID -> getUnit(undefined) can return the player
                    // registered under units.undefined. Only an exact SID is a collision.
                    occupied = live && live.sid != null && String(live.sid) === String(sid);
                }
                LocalNative.nextSid = sid + 1;
                if (!occupied) return sid;
            }
        };

        LocalNative.findPendingBuildUnit = function() {
            try {
                var ab = LocalNative.activeBuilder;
                if (ab && ab.master) return ab.master;
            } catch (e1) {}
            try {
                var gc = LocalNative.getBuildController();
                if (gc && gc.selectedTarget) return gc.selectedTarget;
            } catch (e2) {}
            try {
                var gc2 = LocalNative.getBuildController();
                var b = gc2 && gc2.buildings;
                if (!b) return null;
                var list = [];
                if (typeof b.length === 'number') {
                    for (var i = 0; i < b.length; i++) if (b[i]) list.push(b[i]);
                } else {
                    var keys = Object.keys(b);
                    for (var j = 0; j < keys.length; j++) if (b[keys[j]]) list.push(b[keys[j]]);
                }
                for (var k = 0; k < list.length; k++) {
                    var u = list[k];
                    var bb = LocalNative.getBuildingBuilder(u);
                    if (!bb) continue;
                    if (bb.state === BUILD_STATE_BEFORE_BUILD || bb.state === BUILD_STATE_BUILDING)
                        return u;
                }
            } catch (e3) {}
            return null;
        };

        LocalNative.resolveBuildTime = function(typeid, unit) {
            try {
                var bb = LocalNative.getBuildingBuilder(unit);
                if (!bb && !unit) bb = LocalNative.activeBuilder;
                if (bb && bb.buildTime != null && isFinite(Number(bb.buildTime)) &&
                    Number(bb.buildTime) >= 0) return Number(bb.buildTime);
            } catch (e1) {}
            try {
                if (typeof data !== 'undefined' && data.unit_main && typeid != null) {
                    var row = data.unit_main[typeid] || data.unit_main[String(typeid)];
                    if (row && row.lv_up_time != null) return Number(row.lv_up_time);
                }
            } catch (e2) {}
            return 0;
        };

        LocalNative.probeUnitMain = function(typeid) {
            var out = {typeid: typeid};
            try {
                if (typeof data === 'undefined' || !data.unit_main) {
                    out.error = 'no-unit_main';
                    return out;
                }
                var row = data.unit_main[typeid] || data.unit_main[String(typeid)];
                if (!row) {
                    out.error = 'missing';
                    return out;
                }
                out.lv_up_cost = row.lv_up_cost != null ? row.lv_up_cost : null;
                out.lv_up_cost_type = row.lv_up_cost_type != null ? row.lv_up_cost_type : null;
                out.lv_up_time = row.lv_up_time != null ? row.lv_up_time : null;
                out.rely_base_lv = row.rely_base_lv != null ? row.rely_base_lv : null;
                out.gold_storage = row.gold_storage != null ? row.gold_storage : null;
                out.wood_storage = row.wood_storage != null ? row.wood_storage : null;
            } catch (eP) {
                out.error = String(eP);
            }
            return out;
        };

        LocalNative.readResAmount = function(rm, resType) {
            if (!rm) return 0;
            try {
                if (rm.Res && rm.Res[resType] != null) return Number(rm.Res[resType]) || 0;
            } catch (e1) {}
            try {
                if (typeof rm.getResInfoConfig === 'function') {
                    var info = rm.getResInfoConfig(resType);
                    if (info) {
                        if (info.cur != null) return Number(info.cur) || 0;
                        if (info.current != null) return Number(info.current) || 0;
                        if (info.storage != null) return Number(info.storage) || 0;
                    }
                }
            } catch (e2) {}
            try {
                if (rm.resinfo && rm.resinfo[resType]) {
                    var ri = rm.resinfo[resType];
                    if (ri.cur != null) return Number(ri.cur) || 0;
                    if (ri.current != null) return Number(ri.current) || 0;
                }
            } catch (e3) {}
            try {
                if (typeof rm.hasResource === 'function' && rm.hasResource(resType, 1))
                    return 1;
            } catch (e4) {}
            return 0;
        };

        // Researched new-account grant (新手引导/公测礼包/女神来信汇总，非固定服务器初始包)：
        // diamond 150 = 开局50 + 女神来信100；龙币/日光/英灵值来自公测新手礼包。
        // 序列号、七日登录等另途道具暂不自动发放。
        LocalNative.NEW_ACCOUNT_STARTER = {
            diamond: 150,
            spirit: 50,
            gold: 5000,
            wood: 5000,
            source: 'rookie-guide+beta-pack+goddess-letter'
        };

        LocalNative.getResourceManager = function() {
            try {
                if (!G_Player) return null;
                if (G_Player.resourceManager) return G_Player.resourceManager;
                if (typeof G_Player.getComponent !== 'function') return null;
                var rm = null;
                try {
                    if (typeof Comp !== 'undefined' && Comp.ResourceManager)
                        rm = G_Player.getComponent(Comp.ResourceManager);
                } catch (e1) {}
                if (!rm) {
                    try { rm = G_Player.getComponent('ResourceManager'); } catch (e2) {}
                }
                return rm || null;
            } catch (e) {
                return null;
            }
        };

        LocalNative.setWalletAmount = function(rm, resType, amount, setters) {
            amount = Number(amount) || 0;
            if (amount < 0) amount = 0;
            var cur = LocalNative.readResAmount(rm, resType);
            if (cur >= amount) return 0;
            var need = amount - cur;
            try {
                if (setters && setters.set && typeof rm[setters.set] === 'function') {
                    rm[setters.set](amount);
                    return need;
                }
            } catch (eSet) {}
            try {
                if (typeof rm.addRes === 'function') {
                    rm.addRes(resType, need);
                    return need;
                }
            } catch (eAdd) {}
            try {
                if (rm.Res) rm.Res[resType] = amount;
            } catch (eRes) {}
            return need;
        };

        // Gold/wood HUD totals come from building ResourceHolder/ResourceStorage, not player dict.
        // addRes alone is wiped by later updateResFromStage if holders stay at 0.
        LocalNative.fillBuildingStorages = function(goldAmt, woodAmt) {
            var out = {holders: 0, storages: 0, goldSet: 0, woodSet: 0, homeSid: null};
            try {
                var goldType = typeof RES_TYPE_GOLD !== 'undefined' ? RES_TYPE_GOLD : 2;
                var woodType = typeof RES_TYPE_WOOD !== 'undefined' ? RES_TYPE_WOOD : 1;
                var gc = LocalNative.getBuildController();
                var list = [];
                if (gc && gc.buildings) {
                    var b = gc.buildings;
                    if (typeof b.length === 'number') {
                        for (var i = 0; i < b.length; i++) if (b[i]) list.push(b[i]);
                    } else {
                        var keys = Object.keys(b);
                        for (var j = 0; j < keys.length; j++) if (b[keys[j]]) list.push(b[keys[j]]);
                    }
                }
                if (!list.length && typeof G_UnitManager !== 'undefined' && G_UnitManager &&
                    typeof G_UnitManager.getAllUnits === 'function') {
                    try {
                        var all = G_UnitManager.getAllUnits();
                        if (all && all.length) list = all;
                    } catch (eAll) {}
                }
                var rhKey = (typeof Comp !== 'undefined' && Comp.ResourceHolder) ? Comp.ResourceHolder : 'ResourceHolder';
                var rsKey = (typeof Comp !== 'undefined' && Comp.ResourceStorage) ? Comp.ResourceStorage : 'ResourceStorage';
                var goldLeft = goldAmt;
                var woodLeft = woodAmt;
                for (var k = 0; k < list.length; k++) {
                    var u = list[k];
                    if (!u || typeof u.getComponent !== 'function') continue;
                    var tid = u.typeid || (u.config && u.config.typeid) || 0;
                    var fam = Math.floor(Number(tid) / 100);
                    var isHome = fam === 201 || tid === 20101;
                    var rh = null;
                    try { rh = u.getComponent(rhKey); } catch (eRh) {}
                    if (!rh) {
                        try { rh = u.getComponent('ResourceHolder'); } catch (eRh2) {}
                    }
                    if (rh) {
                        out.holders++;
                        if (isHome) out.homeSid = u.sid != null ? u.sid : out.homeSid;
                        // Dual home holder: goldstorage / woodstorage fields.
                        try {
                            if (typeof rh.goldstorage !== 'undefined' || typeof rh.goldStorage !== 'undefined' ||
                                isHome) {
                                if (typeof rh.goldstorage !== 'undefined') rh.goldstorage = goldAmt;
                                if (typeof rh.goldStorage !== 'undefined') rh.goldStorage = goldAmt;
                                out.goldSet = goldAmt;
                            }
                            if (typeof rh.woodstorage !== 'undefined' || typeof rh.woodStorage !== 'undefined' ||
                                isHome) {
                                if (typeof rh.woodstorage !== 'undefined') rh.woodstorage = woodAmt;
                                if (typeof rh.woodStorage !== 'undefined') rh.woodStorage = woodAmt;
                                out.woodSet = woodAmt;
                            }
                        } catch (eDual) {}
                        try {
                            var rtype = rh.resourceType != null ? rh.resourceType :
                                (rh.resType != null ? rh.resType : rh.type);
                            if (rtype === goldType || rtype === 'Gold' || rtype === 'gold') {
                                rh.currentStorage = goldAmt;
                                out.goldSet = goldAmt;
                                goldLeft = 0;
                            } else if (rtype === woodType || rtype === 'Wood' || rtype === 'wood') {
                                rh.currentStorage = woodAmt;
                                out.woodSet = woodAmt;
                                woodLeft = 0;
                            } else if (isHome && (rh.currentStorage == null || rh.currentStorage === 0)) {
                                // Single currentStorage on home — prefer gold; wood via dual fields above.
                                if (out.goldSet < goldAmt) {
                                    rh.currentStorage = goldAmt;
                                    out.goldSet = goldAmt;
                                }
                            }
                        } catch (eRt) {}
                        try {
                            if (typeof rh.refreshDisplay === 'function') rh.refreshDisplay();
                        } catch (eRd) {}
                    }
                    var rs = null;
                    try { rs = u.getComponent(rsKey); } catch (eRs) {}
                    if (!rs) {
                        try { rs = u.getComponent('ResourceStorage'); } catch (eRs2) {}
                    }
                    if (rs) {
                        out.storages++;
                        try {
                            var st = rs.resourceType != null ? rs.resourceType :
                                (rs.resType != null ? rs.resType : rs.type);
                            if (st === goldType && goldLeft > 0) {
                                rs.currentStorage = goldAmt;
                                out.goldSet = goldAmt;
                                goldLeft = 0;
                            } else if (st === woodType && woodLeft > 0) {
                                rs.currentStorage = woodAmt;
                                out.woodSet = woodAmt;
                                woodLeft = 0;
                            }
                            if (typeof rs.refreshDisplay === 'function') rs.refreshDisplay();
                        } catch (eRs3) {}
                    }
                }
            } catch (eFill) {
                out.error = String(eFill);
            }
            return out;
        };

        LocalNative.refreshResHud = function() {
            try {
                var mc = LocalNative.getMenuController();
                if (!mc) return;
                if (typeof mc.refreshResourceLabel === 'function') mc.refreshResourceLabel();
                if (typeof mc.updateResourceLabel === 'function') mc.updateResourceLabel();
                if (typeof mc.updatePlayerLabel === 'function') mc.updatePlayerLabel();
                if (typeof mc.refreshHomeBaseRelateInfo === 'function') mc.refreshHomeBaseRelateInfo();
                // Force Gold/Wood/Diamond label nodes if present.
                var rm = LocalNative.getResourceManager();
                var goldType = typeof RES_TYPE_GOLD !== 'undefined' ? RES_TYPE_GOLD : 2;
                var woodType = typeof RES_TYPE_WOOD !== 'undefined' ? RES_TYPE_WOOD : 1;
                var g = rm ? LocalNative.readResAmount(rm, goldType) : 0;
                var w = rm ? LocalNative.readResAmount(rm, woodType) : 0;
                var d = (G_Player && G_Player.diamond != null) ? G_Player.diamond :
                    (rm ? LocalNative.readResAmount(rm, typeof RES_TYPE_DIAMOND !== 'undefined' ? RES_TYPE_DIAMOND : 3) : 0);
                ['Gold', 'gold', 'NumGold', 'numGold', 'Wood', 'wood', 'NumWood', 'numWood',
                 'Diamond', 'diamond', 'NumDiamond', 'numDiamond'].forEach(function(k) {
                    try {
                        if (!mc[k]) return;
                        var val = (k.toLowerCase().indexOf('wood') >= 0) ? w :
                            (k.toLowerCase().indexOf('diamond') >= 0) ? d : g;
                        LocalNative.setLabelText(mc[k], String(val));
                    } catch (eL) {}
                });
            } catch (eHud) {}
        };

        // After buildings register: fill holders then ResourceManager so HUD shows researched pack.
        LocalNative.seedStarterResources = function() {
            LocalNative.writeStatus({step: 'seed-starter-res-enter'});
            try {
                var grantedStore = LocalNative.readRaw();
                if (grantedStore && grantedStore.starterResGranted) return false;
                var pack = LocalNative.NEW_ACCOUNT_STARTER;
                var rm = LocalNative.getResourceManager();
                if (!rm) {
                    LocalNative.writeStatus({step: 'seed-starter-res-ERR', error: 'no-ResourceManager'});
                    return false;
                }
                var goldType = typeof RES_TYPE_GOLD !== 'undefined' ? RES_TYPE_GOLD : 2;
                var woodType = typeof RES_TYPE_WOOD !== 'undefined' ? RES_TYPE_WOOD : 1;
                var diaType = typeof RES_TYPE_DIAMOND !== 'undefined' ? RES_TYPE_DIAMOND : 3;
                var spiType = typeof RES_TYPE_SPIRIT !== 'undefined' ? RES_TYPE_SPIRIT : 4;
                var haveGold0 = LocalNative.readResAmount(rm, goldType);
                var haveWood0 = LocalNative.readResAmount(rm, woodType);
                if (haveGold0 >= pack.gold && haveWood0 >= pack.wood) {
                    if (grantedStore) {
                        grantedStore.starterResGranted = true;
                        LocalNative.writeRaw(grantedStore);
                    }
                    LocalNative.writeStatus({
                        step: 'seed-starter-res-skip',
                        reason: 'already-full',
                        haveGold: haveGold0,
                        haveWood: haveWood0
                    });
                    return false;
                }

                // 1) Write into building storages first (source of truth for gold/wood).
                var filled = LocalNative.fillBuildingStorages(pack.gold, pack.wood);

                // 2) Diamond / spirit on player + ResourceManager.
                try {
                    if (G_Player) {
                        G_Player.diamond = pack.diamond;
                        G_Player.spirit = pack.spirit;
                    }
                } catch (eGP) {}
                var added = {
                    gold: 0, wood: 0, diamond: 0, spirit: 0,
                    filled: filled, pack: pack
                };
                added.diamond = LocalNative.setWalletAmount(rm, diaType, pack.diamond, {set: 'setDiamond'});
                added.spirit = LocalNative.setWalletAmount(rm, spiType, pack.spirit, {set: 'setSpirit'});

                // 3) Push gold/wood into RM totals AFTER holders are filled.
                try {
                    if (typeof rm.addRes === 'function') {
                        var curG = LocalNative.readResAmount(rm, goldType);
                        var curW = LocalNative.readResAmount(rm, woodType);
                        if (curG < pack.gold) {
                            rm.addRes(pack.gold - curG, goldType);
                            added.gold = pack.gold - curG;
                        }
                        if (curW < pack.wood) {
                            rm.addRes(pack.wood - curW, woodType);
                            added.wood = pack.wood - curW;
                        }
                    }
                } catch (eAdd) {
                    added.addResErr = String(eAdd);
                }
                try {
                    if (rm.Res) {
                        if ((Number(rm.Res[goldType]) || 0) < pack.gold) rm.Res[goldType] = pack.gold;
                        if ((Number(rm.Res[woodType]) || 0) < pack.wood) rm.Res[woodType] = pack.wood;
                    }
                } catch (eRes) {}
                try {
                    if (typeof rm.setPlayerResource === 'function') {
                        rm.setPlayerResource({
                            diamond: pack.diamond,
                            spirit: pack.spirit
                        });
                    }
                } catch (eSPR) {}
                // Recalc from holders (should now read 5000/5000).
                try {
                    if (typeof rm.calculateResource === 'function') rm.calculateResource();
                    else if (typeof rm.updateResFromStage === 'function') rm.updateResFromStage();
                } catch (eUp) {}
                // If recalc wiped totals back to 0, force Res[] again and skip another recalc.
                try {
                    var afterG = LocalNative.readResAmount(rm, goldType);
                    var afterW = LocalNative.readResAmount(rm, woodType);
                    if (afterG < pack.gold || afterW < pack.wood) {
                        LocalNative.fillBuildingStorages(pack.gold, pack.wood);
                        if (rm.Res) {
                            rm.Res[goldType] = pack.gold;
                            rm.Res[woodType] = pack.wood;
                        }
                        if (typeof rm.addRes === 'function') {
                            if (afterG < pack.gold) rm.addRes(pack.gold - afterG, goldType);
                            if (afterW < pack.wood) rm.addRes(pack.wood - afterW, woodType);
                        }
                        added.forcedRes = true;
                        added.afterG = afterG;
                        added.afterW = afterW;
                    }
                } catch (eForce) {
                    added.forceErr = String(eForce);
                }

                LocalNative.refreshResHud();

                try {
                    var st = LocalNative.readRaw();
                    if (st) {
                        st.starterResGranted = true;
                        st.starterResPack = pack;
                        st.updatedAt = Math.floor(Date.now() / 1000);
                        if (st.level && st.level.player) {
                            st.level.player.diamond = pack.diamond;
                            st.level.player.spirit = pack.spirit;
                        }
                        LocalNative.writeRaw(st);
                    }
                } catch (eFlag) {}
                LocalNative.writeStatus({
                    step: 'seed-starter-res',
                    added: added,
                    nowGold: LocalNative.readResAmount(rm, goldType),
                    nowWood: LocalNative.readResAmount(rm, woodType),
                    nowDia: LocalNative.readResAmount(rm, diaType)
                });
                try { LocalNative.tryDumpAndSave(); } catch (eDump) {}
                return true;
            } catch (eSeed) {
                LocalNative.writeStatus({
                    step: 'seed-starter-res-ERR',
                    error: String(eSeed),
                    stack: (eSeed && eSeed.stack) ? String(eSeed.stack).split('\n').slice(0, 6) : null
                });
                return false;
            }
        };

        LocalNative.collectHomeBuildings = function(gc) {
            var list = [], buildings = gc && gc.buildings || {};
            // Stock GameControllerBuild stores cid -> typeid, not Unit objects.
            for (var cid in buildings) {
                if (!Object.prototype.hasOwnProperty.call(buildings, cid)) continue;
                var entry = buildings[cid];
                var unit = entry && typeof entry === 'object' ? entry :
                    G_UnitManager.getUnit(cid);
                if (unit && LocalNative.getBuildingBuilder(unit)) list.push(unit);
            }
            return list;
        };

        // After force-kill mid-build: finish elapsed jobs; re-schedule remaining timers.
        LocalNative.resumeConstructions = function(player) {
            try {
                var gc = LocalNative.getBuildController();
                if (!gc) return 0;
                var list = LocalNative.collectHomeBuildings(gc);
                var now = Math.floor(Date.now() / 1000);
                var n = 0;
                for (var k = 0; k < list.length; k++) {
                    var u = list[k];
                    var bb = LocalNative.getBuildingBuilder(u);
                    if (!bb || bb.state !== BUILD_STATE_BUILDING) continue;
                    var sid = u.sid != null ? u.sid : (u.getSID ? u.getSID() : null);
                    if (sid == null || LocalNative.completedSids[sid]) continue;
                    var bt = LocalNative.resolveBuildTime(u.typeid || bb.typeid, u);
                    var begin = bb.beginTime != null ? Number(bb.beginTime) : 0;
                    var remain = begin > 0 && bt > 0 ? (begin + bt - now) : 0;
                    n++;
                    LocalNative.pendingBuilds[sid] = {
                        sid: sid,
                        typeid: u.typeid || bb.typeid,
                        startedAt: begin || now,
                        resumed: true
                    };
                    if (remain <= 0) {
                        LocalNative.ackBuildComplete(player, sid, 'resume-immediate');
                    } else {
                        (function(p, s, r, ticket) {
                            LocalNative.scheduleOnRoot(function() {
                                if (LocalNative.pendingBuilds[s] !== ticket) return;
                                LocalNative.ackBuildComplete(p, s, 'resume-timer');
                            }, r);
                        })(player, sid, remain, LocalNative.pendingBuilds[sid]);
                    }
                    LocalNative.writeStatus({
                        step: 'resume-build',
                        sid: sid,
                        typeid: u.typeid || bb.typeid,
                        remain: remain,
                        beginTime: begin,
                        buildTime: bt
                    });
                }
                return n;
            } catch (eR) {
                LocalNative.writeStatus({step: 'resume-build-ERR', error: String(eR)});
                return 0;
            }
        };

        LocalNative.resolveBuildTarget = function(params) {
            params = params || {};
            // Stock Unit.callServer sends uid=this.sid; ans/complete use sid/unit.
            var sid = params.sid != null ? params.sid :
                (params.uid != null ? params.uid :
                    (params.unit != null && typeof params.unit === 'number' ? params.unit : null));
            var cid = params.cid != null ? params.cid : null;
            var unit = null;
            // An explicit client ID identifies the clicked building even when an
            // old array-based city has a conflicting server-ID registration.
            try {
                if (cid != null && typeof G_UnitManager !== 'undefined' && G_UnitManager &&
                    typeof G_UnitManager.getUnit === 'function')
                    unit = G_UnitManager.getUnit(cid);
                if (unit && !LocalNative.getBuildingBuilder(unit)) unit = null;
            } catch (e1) { unit = null; }
            try {
                if (!unit && sid != null && typeof G_UnitManager !== 'undefined' && G_UnitManager &&
                    typeof G_UnitManager.getUnitBySID === 'function')
                    unit = G_UnitManager.getUnitBySID(sid);
                if (unit && !LocalNative.getBuildingBuilder(unit)) unit = null;
            } catch (e2) { unit = null; }
            if (!unit) {
                try { unit = LocalNative.findPendingBuildUnit(); } catch (e3) {}
            }
            if (!unit) {
                try {
                    if (LocalNative.activeBuilder && LocalNative.activeBuilder.master)
                        unit = LocalNative.activeBuilder.master;
                } catch (e4) {}
            }
            if (sid == null && unit && unit.sid != null) sid = unit.sid;
            if (cid == null && unit) {
                try {
                    cid = unit.cid != null ? unit.cid :
                        (typeof unit.getCID === 'function' ? unit.getCID() : null);
                } catch (e5) {}
            }
            if (sid == null && cid != null && LocalNative.pendingBuilds) {
                var pkeys = Object.keys(LocalNative.pendingBuilds);
                for (var i = 0; i < pkeys.length; i++) {
                    var pb = LocalNative.pendingBuilds[pkeys[i]];
                    if (pb && pb.cid == cid) {
                        sid = pb.sid != null ? pb.sid : Number(pkeys[i]);
                        break;
                    }
                }
            }
            // Last resort: any BUILDING-state unit / pending sid.
            if (sid == null && LocalNative.pendingBuilds) {
                var pkeys2 = Object.keys(LocalNative.pendingBuilds);
                if (pkeys2.length === 1) {
                    sid = LocalNative.pendingBuilds[pkeys2[0]].sid != null
                        ? LocalNative.pendingBuilds[pkeys2[0]].sid : Number(pkeys2[0]);
                }
            }
            if (!unit && sid != null) {
                try {
                    if (typeof G_UnitManager !== 'undefined' && G_UnitManager &&
                        typeof G_UnitManager.getUnitBySID === 'function')
                        unit = G_UnitManager.getUnitBySID(sid);
                    if (unit && !LocalNative.getBuildingBuilder(unit)) unit = null;
                } catch (e6) {}
            }
            return {sid: sid, cid: cid, unit: unit};
        };

        // Stock Unit.server_build_complete may be missing on some build ghosts; finish via builder.
        LocalNative.ensureUnitBuildCompleteHook = function() {
            try {
                if (typeof Unit === 'undefined' || !Unit || !Unit.prototype) return;
                if (typeof Unit.prototype.server_build_complete === 'function' &&
                    Unit.prototype.server_build_complete.__localNativePatched)
                    return;
                var origSbc = typeof Unit.prototype.server_build_complete === 'function'
                    ? Unit.prototype.server_build_complete : null;
                Unit.prototype.server_build_complete = function(dict) {
                    try {
                        if (origSbc) {
                            var ret = origSbc.apply(this, arguments);
                            var tidOk = this.typeid;
                            // Stock path should upgradeFinish + onBuilderFinishBuilding; if the
                            // ghost typeid remains, fall through to our completer.
                            if (!(typeof tidOk === 'number' && tidOk % 100 === 0))
                                return ret;
                            LocalNative.writeStatus({
                                step: 'server_build_complete-still-ghost',
                                sid: this.sid != null ? this.sid : null,
                                typeid: tidOk
                            });
                        }
                    } catch (eOrig) {
                        LocalNative.writeStatus({
                            step: 'server_build_complete-orig-ERR',
                            error: String(eOrig)
                        });
                    }
                    return LocalNative.finishViaBuilder(this, 'Unit.server_build_complete');
                };
                Unit.prototype.server_build_complete.__localNativePatched = true;
            } catch (eHook) {}
        };

        LocalNative.ensureUnitSid = function(unit, sid) {
            if (!unit || sid == null) return false;
            try {
                if (unit.sid === sid) return true;
                if (typeof unit.setSid === 'function') {
                    unit.setSid(sid);
                } else {
                    unit.sid = sid;
                }
            } catch (eSid) {
                try { unit.sid = sid; } catch (e2) { return false; }
            }
            return unit.sid === sid || unit.sid == sid;
        };

        LocalNative.lookupUnitMain = function(typeid) {
            if (typeid == null) return null;
            try {
                if (typeof data !== 'undefined' && data && data.unit_main)
                    return data.unit_main[typeid] || data.unit_main[String(typeid)] || null;
            } catch (e1) {}
            return null;
        };

        LocalNative.resolveRealTypeID = function(unit) {
            var tid = unit && unit.typeid != null ? unit.typeid : null;
            try {
                if (unit && typeof unit.getRealTypeID === 'function') {
                    var r = unit.getRealTypeID();
                    if (r) return r;
                }
            } catch (e1) {}
            if (typeof tid === 'number' && tid % 100 === 0) return tid + 1;
            return tid;
        };

        // Stock Unit.onBuilderFinishBuilding(params) needs old_config / new_config / coord.
        // Calling it with no args throws and can leave the unit visually destroyed.
        LocalNative.buildFinishSwapParams = function(unit, targetType) {
            if (!unit) return null;
            var oldType = unit.typeid != null ? unit.typeid : null;
            var realType = targetType != null ? targetType : LocalNative.resolveRealTypeID(unit);
            var oldConfig = null;
            try { oldConfig = unit.config || unit.cfg || null; } catch (eC) {}
            if (!oldConfig) oldConfig = LocalNative.lookupUnitMain(oldType);
            var newConfig = LocalNative.lookupUnitMain(realType);
            if (!newConfig && realType != null && typeof realType === 'number' && realType % 100 === 0)
                newConfig = LocalNative.lookupUnitMain(realType + 1);
            var coord = null;
            try {
                var th = null;
                if (typeof unit.getComponent === 'function') {
                    if (typeof Comp !== 'undefined' && Comp.TileHolder)
                        th = unit.getComponent(Comp.TileHolder);
                    if (!th) th = unit.getComponent('TileHolder');
                }
                if (th && typeof th.getTileCoord === 'function')
                    coord = th.getTileCoord();
                else if (th && th.coord) coord = th.coord;
            } catch (eT) {}
            if (!coord) {
                try {
                    if (unit.x != null && unit.y != null) coord = {x: unit.x, y: unit.y};
                } catch (eXy) {}
            }
            if (!newConfig) {
                LocalNative.writeStatus({
                    step: 'finish-swap-params-fail',
                    oldType: oldType,
                    realType: realType,
                    hasOld: !!oldConfig,
                    hasCoord: !!coord
                });
                return null;
            }
            var finish = {
                old_config: oldConfig || newConfig,
                new_config: newConfig,
                coord: coord || {x: 24, y: 24},
                typeid: realType,
                x: (coord || {x: 24}).x,
                y: (coord || {y: 24}).y,
                bs: BUILD_STATE_FINISH,
                bt: 0,
                unit_type: newConfig.unit_type != null ? newConfig.unit_type :
                    (typeof realType === 'number' ? Math.floor(realType / 100) : null),
                unit_level: newConfig.lv != null ? newConfig.lv :
                    (typeof realType === 'number' ? realType % 100 : 1)
            };
            // Refresh destroys all components; carry their current server fields
            // before that happens, including zero-valued storage and train queues.
            var preserved = LocalNative.snapshotBuildingRecord(unit);
            for (var pk in preserved) {
                if (finish[pk] === undefined) finish[pk] = preserved[pk];
            }
            return finish;
        };

        LocalNative.unitStillOnMap = function(unit) {
            if (!unit) return false;
            try {
                if (unit.rootNode && typeof unit.rootNode.getParent === 'function' &&
                    unit.rootNode.getParent())
                    return true;
            } catch (e1) {}
            try {
                if (unit.sid != null && typeof G_UnitManager !== 'undefined' && G_UnitManager &&
                    typeof G_UnitManager.getUnitBySID === 'function' &&
                    G_UnitManager.getUnitBySID(unit.sid) === unit)
                    return true;
            } catch (e2) {}
            return !!unit;
        };

        LocalNative.unitHasVisibleRoot = function(unit) {
            if (!unit) return false;
            try {
                var rn = unit.rootNode;
                if (!rn) return false;
                if (typeof rn.getParent === 'function' && !rn.getParent()) return false;
                if (typeof rn.isVisible === 'function' && !rn.isVisible()) return false;
                if (typeof rn.getChildrenCount === 'function' && rn.getChildrenCount() <= 0) return false;
                return true;
            } catch (e) {
                return LocalNative.unitStillOnMap(unit);
            }
        };

        // QuestManager.main_quest is missing offline; stock onBuilderFinishBuilding crashes on it
        // AFTER destroying the old CCBI — that is what makes the building "disappear".
        LocalNative.ensureQuestManagerSafe = function() {
            try {
                if (typeof G_Player === 'undefined' || !G_Player ||
                    typeof G_Player.getComponent !== 'function')
                    return false;
                var qm = null;
                try {
                    if (typeof Comp !== 'undefined' && Comp.QuestManager)
                        qm = G_Player.getComponent(Comp.QuestManager);
                } catch (e1) {}
                if (!qm) {
                    try { qm = G_Player.getComponent('QuestManager'); } catch (e2) {}
                }
                if (!qm) return false;
                if (qm.main_quest == null) qm.main_quest = {};
                if (qm.clientMainQuest == null) qm.clientMainQuest = {};
                if (qm.finish_main_quest_timestamp == null) qm.finish_main_quest_timestamp = 0;
                try { LocalNative.ensureLiveQuestSeed(); } catch (eSeed) {}
                LocalNative.installDailyQuestProgress(qm);
                ['updateCurrent', 'refreshOrHideQuestTipInfo', '_setCurrentQuestUI',
                 'finishMainQuest', '_clearQuestDataOnFinish', '_getMainQuestData',
                 'getDailyQuestOrderedDict', 'getMainQuestOrderedDict'].forEach(function(fn) {
                    if (typeof qm[fn] !== 'function' || qm[fn].__localNativePatched) return;
                    var orig = qm[fn];
                    qm[fn] = function() {
                        try {
                            if (this.main_quest == null) this.main_quest = {};
                            if (this.clientMainQuest == null) this.clientMainQuest = {};
                            if (fn === 'getDailyQuestOrderedDict' ||
                                fn === 'getMainQuestOrderedDict')
                                LocalNative.ensureLiveQuestSeed();
                            return orig.apply(this, arguments);
                        } catch (eQ) {
                            LocalNative.writeStatus({
                                step: 'QuestManager.' + fn + '-soft',
                                error: String(eQ)
                            });
                        }
                    };
                    qm[fn].__localNativePatched = true;
                });
                return true;
            } catch (e) {
                return false;
            }
        };

        // Rebuild finished building if stock swap destroyed the model then threw.
        LocalNative.repairFinishedBuildingVisual = function(unit, swapParams) {
            if (!unit || !swapParams) return false;
            var realType = swapParams.typeid != null ? swapParams.typeid :
                LocalNative.resolveRealTypeID(unit);
            var cfg = swapParams.new_config || LocalNative.lookupUnitMain(realType);
            var coord = swapParams.coord || {x: 24, y: 24};
            var sid = unit.sid;
            try {
                unit.typeid = realType;
                if (cfg) {
                    unit.config = cfg;
                    unit.cfg = cfg;
                }
                if (typeof unit.unit_level !== 'undefined')
                    unit.unit_level = cfg && cfg.lv != null ? cfg.lv :
                        (typeof realType === 'number' ? realType % 100 : 1);
            } catch (eMeta) {}

            // 1) Prefer stock initByServer + setToTile on the same unit object.
            try {
                if (typeof unit.initByServer === 'function') {
                    unit.initByServer({
                        sid: sid,
                        typeid: realType,
                        x: coord.x,
                        y: coord.y,
                        state: BUILD_STATE_FINISH,
                        bs: BUILD_STATE_FINISH,
                        bt: 0,
                        beginTime: 0
                    });
                    try {
                        if (typeof unit.setToTile === 'function') {
                            if (coord && typeof coord.x === 'number')
                                unit.setToTile(coord);
                            else
                                unit.setToTile(coord);
                        }
                    } catch (eTile) {}
                    if (LocalNative.unitHasVisibleRoot(unit)) {
                        LocalNative.writeStatus({
                            step: 'repair-initByServer-ok',
                            sid: sid,
                            typeid: realType
                        });
                        return true;
                    }
                }
            } catch (eInit) {
                LocalNative.writeStatus({
                    step: 'repair-initByServer-ERR',
                    error: String(eInit)
                });
            }

            // 2) Recreate via GameControllerBuild.__buildUnit / createUnit.
            try {
                var gc = LocalNative.getBuildController();
                var dict = {
                    sid: sid,
                    typeid: realType,
                    x: coord.x,
                    y: coord.y,
                    state: BUILD_STATE_FINISH,
                    bs: BUILD_STATE_FINISH,
                    bt: 0,
                    beginTime: 0
                };
                if (gc && typeof gc.__buildUnit === 'function') {
                    gc.__buildUnit(dict);
                    LocalNative.writeStatus({
                        step: 'repair-__buildUnit',
                        sid: sid,
                        typeid: realType
                    });
                    return true;
                }
                if (gc && typeof gc.createUnit === 'function') {
                    var created = gc.createUnit(dict);
                    if (created && sid != null) LocalNative.ensureUnitSid(created, sid);
                    LocalNative.writeStatus({
                        step: 'repair-createUnit',
                        sid: sid,
                        typeid: realType,
                        hasUnit: !!created
                    });
                    return !!created;
                }
            } catch (eGc) {
                LocalNative.writeStatus({
                    step: 'repair-gc-ERR',
                    error: String(eGc)
                });
            }

            // 3) Last resort: load home_res onto a fresh node if BuilderReader exists.
            try {
                if (cfg && cfg.home_res && typeof cc !== 'undefined' && cc.BuilderReader &&
                    typeof cc.BuilderReader.load === 'function') {
                    var node = cc.BuilderReader.load(cfg.home_res);
                    if (node && unit.rootNode) {
                        try { unit.rootNode.removeAllChildren(); } catch (eRm) {}
                        try { unit.rootNode.addChild(node); } catch (eAdd) {}
                        LocalNative.writeStatus({
                            step: 'repair-load-home_res',
                            sid: sid,
                            res: cfg.home_res
                        });
                        return LocalNative.unitHasVisibleRoot(unit);
                    }
                }
            } catch (eLoad) {
                LocalNative.writeStatus({
                    step: 'repair-home_res-ERR',
                    error: String(eLoad)
                });
            }
            return false;
        };

        LocalNative.snapshotBuildingRecord = function(unit) {
            var out = {}, key;
            var store = LocalNative.readRaw();
            var records = store && store.level && store.level.units || [];
            for (var i = 0; i < records.length; i++) {
                if (String(records[i].sid) === String(unit.sid)) {
                    for (key in records[i]) out[key] = records[i][key];
                    break;
                }
            }
            function cp(name) {
                if (unit.componentList && unit.componentList[name]) return unit.componentList[name];
                return unit.getComponent ? unit.getComponent(name) : null;
            }
            var bb = cp('BuildingBuilder');
            var tile = cp('TileHolder');
            var coord = tile && tile.getTileCoord ? tile.getTileCoord() : null;
            out.sid = unit.sid;
            out.typeid = unit.typeid;
            out.unit_type = Math.floor(Number(unit.typeid) / 100);
            out.unit_level = Number(unit.typeid) % 100;
            out.unit_mutateid = unit.mutateid || 0;
            if (coord) { out.x = coord.x; out.y = coord.y; }
            if (bb) { out.bs = out.state = bb.state; out.bt = out.beginTime = bb.beginTime || 0; }
            var holder = cp('ResourceStorage') || cp('ResourceHolder');
            if (holder && holder.currentStorage && typeof holder.currentStorage === 'object') {
                out.sto = JSON.parse(JSON.stringify(holder.currentStorage));
                out.goldstorage = Number(holder.currentStorage[2]) || 0;
                out.woodstorage = Number(holder.currentStorage[1]) || 0;
            }
            var productor = cp('ResourceProductor');
            if (productor) {
                out.sto = Number(productor.currentStorage) || 0;
                out.lastCollectTime = productor.lastCollectTime;
                out.lpt = isFinite(productor.lastCollectTime) ? productor.lastCollectTime * 3600
                    : Math.floor(Date.now() / 1000);
            }
            var trainer = cp('SoldierTrainer');
            if (trainer) {
                out.tbuf = trainer.trainBuffer.slice();
                out.sds = JSON.parse(JSON.stringify(trainer.soldiers));
                out.ep = JSON.parse(JSON.stringify(trainer.elitePost));
                out.ltt = trainer.lastTrainBeginTime;
                out.bn = trainer.boostTrainNum;
                out.autoCastTraining = trainer._autoCastTraining;
            }
            var tech = cp('TechController');
            if (tech) {
                out.training_tech = tech.training_tech || 0;
                out.last_train_tech_time = tech.last_train_tech_time || 0;
                out.trained_time = tech.trained_time || 0;
            }
            return out;
        };

        LocalNative.persistFinishedUnit = function(unit) {
            if (!unit || unit.sid == null) return false;
            try {
                var dumped = LocalNative.snapshotBuildingRecord(unit);
                if (typeof unit.dumpData === 'function') {
                    try { dumped = unit.dumpData(); } catch (eD) {}
                }
                if (!dumped || typeof dumped !== 'object') {
                    var x = null, y = null;
                    try {
                        var th = unit.getComponent && unit.getComponent('TileHolder');
                        if (!th && unit.getComponent && typeof Comp !== 'undefined' && Comp.TileHolder)
                            th = unit.getComponent(Comp.TileHolder);
                        var c = th && th.getTileCoord ? th.getTileCoord() : null;
                        if (c) { x = c.x; y = c.y; }
                    } catch (eC) {}
                    if (x == null) x = unit.x != null ? unit.x : 24;
                    if (y == null) y = unit.y != null ? unit.y : 24;
                    dumped = {
                        sid: unit.sid,
                        typeid: unit.typeid,
                        x: x,
                        y: y,
                        state: BUILD_STATE_FINISH,
                        beginTime: 0
                    };
                }
                var store = LocalNative.readRaw();
                if (!store || !store.level) return false;
                // Stock __buildUnit looks up unit_main using unit_type + unit_level.
                dumped.unit_type = Math.floor(Number(dumped.typeid || unit.typeid) / 100);
                dumped.unit_level = Number(dumped.typeid || unit.typeid) % 100;
                dumped.unit_mutateid = dumped.unit_mutateid || 0;
                dumped.bs = dumped.state = BUILD_STATE_FINISH;
                dumped.bt = dumped.beginTime = 0;
                if (!store.level.units) store.level.units = [];
                var units = store.level.units;
                var found = false;
                for (var i = 0; i < units.length; i++) {
                    if (units[i] && String(units[i].sid) === String(unit.sid)) {
                        units[i] = dumped;
                        found = true;
                        break;
                    }
                }
                if (!found) units.push(dumped);
                store.revision = (store.revision || 0) + 1;
                store.updatedAt = Math.floor(Date.now() / 1000);
                LocalNative.writeRaw(store);
                LocalNative.writeStatus({
                    step: 'persist-finished-unit',
                    sid: unit.sid,
                    typeid: dumped.typeid,
                    inserted: !found
                });
                return true;
            } catch (eP) {
                LocalNative.writeStatus({step: 'persist-finished-unit-ERR', error: String(eP)});
                return false;
            }
        };

        // Safe finish: upgradeFinish (timer/worker) + model swap with quest stubs.
        // If stock onBuilderFinishBuilding destroys then crashes, repair visual immediately.
        // Never blind refresh() / rpc_c_build_complete on construction ghosts.
        LocalNative.finishViaBuilder = function(unit, reason) {
            if (!unit) return false;
            LocalNative.ensureQuestManagerSafe();
            var bb = null;
            try { bb = LocalNative.getBuildingBuilder(unit); } catch (e1) {}
            if (!bb) {
                try {
                    if (typeof unit.getComponent === 'function') {
                        var key = (typeof Comp !== 'undefined' && Comp.BuildingBuilder)
                            ? Comp.BuildingBuilder : 'BuildingBuilder';
                        bb = unit.getComponent(key);
                    }
                } catch (e2) {}
            }
            if (!bb && LocalNative.activeBuilder && LocalNative.activeBuilder.master === unit)
                bb = LocalNative.activeBuilder;
            if (!bb) {
                LocalNative.writeStatus({
                    step: 'finishViaBuilder-no-bb',
                    reason: reason || null,
                    sid: unit.sid != null ? unit.sid : null,
                    typeid: unit.typeid != null ? unit.typeid : null
                });
                return false;
            }
            LocalNative.activeBuilder = bb;
            var beforeType = unit.typeid != null ? unit.typeid : (bb.typeid || null);
            var beforeState = bb.state;
            var didUpgradeFinish = false;
            var didModelSwap = false;
            var pendingFinish = LocalNative.pendingBuilds && LocalNative.pendingBuilds[unit.sid];
            var targetType = pendingFinish && pendingFinish.targetType;
            if (targetType == null) {
                targetType = LocalNative.resolveRealTypeID(unit);
                // Existing non-placeholder buildings in BUILDING state are upgrades.
                if (beforeState === BUILD_STATE_BUILDING && beforeType % 100 !== 0)
                    targetType = Number(beforeType) + 1;
            }
            var swapParams = LocalNative.buildFinishSwapParams(unit, targetType);
            if (!swapParams) return false;
            var visibleBefore = LocalNative.unitHasVisibleRoot(unit);
            try {
                if (typeof bb.upgradeFinish === 'function') {
                    bb.upgradeFinish();
                    didUpgradeFinish = true;
                } else if (typeof bb.finishBuildingState === 'function') {
                    bb.finishBuildingState();
                    didUpgradeFinish = true;
                } else {
                    bb.state = BUILD_STATE_FINISH;
                    try {
                        if (typeof bb._deleteProgressTimer === 'function') bb._deleteProgressTimer();
                    } catch (eDt) {}
                    try {
                        if (typeof bb.leaveBuildingWorker === 'function') bb.leaveBuildingWorker();
                    } catch (eLw) {}
                    didUpgradeFinish = true;
                }

                // Stock refresh consumes the server's new unit_level/typeid, updates
                // unit.level and recreates every component and the upgraded model.
                // Quest initialization fields now prevent the prior main_quest crash.
                unit.onBuilderFinishBuilding(swapParams);
                if (typeof unit.updateBuildingActionBar === 'function') unit.updateBuildingActionBar();
                didModelSwap = unit.typeid === targetType && unit.level === swapParams.unit_level;

                // If upgradeFinish somehow cleared the model, rebuild finished art.
                if (!LocalNative.unitHasVisibleRoot(unit) && swapParams) {
                    try {
                        var repaired = LocalNative.repairFinishedBuildingVisual(unit, swapParams);
                        LocalNative.writeStatus({
                            step: repaired ? 'finish-repair-ok' : 'finish-repair-fail',
                            sid: unit.sid != null ? unit.sid : null,
                            visibleBefore: visibleBefore
                        });
                        if (repaired) didModelSwap = true;
                    } catch (eRep) {
                        LocalNative.writeStatus({
                            step: 'finish-repair-ERR',
                            error: String(eRep)
                        });
                    }
                }

                try {
                    if (typeof unit.updateBuildingActionBar === 'function')
                        unit.updateBuildingActionBar();
                } catch (eBar) {}
            } catch (eFin) {
                LocalNative.writeStatus({
                    step: 'finishViaBuilder-ERR',
                    reason: reason || null,
                    error: String(eFin)
                });
                return false;
            }
            var afterType = unit.typeid != null ? unit.typeid : null;
            var placeholderLeft = typeof afterType === 'number' && afterType % 100 === 0;
            var visible = LocalNative.unitHasVisibleRoot(unit);
            var onMap = LocalNative.unitStillOnMap(unit);
            var finishedBuilder = LocalNative.getBuildingBuilder(unit);
            var ok = !placeholderLeft && afterType === targetType &&
                unit.level === swapParams.unit_level && finishedBuilder &&
                finishedBuilder.state === BUILD_STATE_FINISH && (visible || onMap);
            LocalNative.writeStatus({
                step: ok ? (visible ? 'finishViaBuilder-ok' : 'finishViaBuilder-ok-soft') :
                    (placeholderLeft ? 'finishViaBuilder-partial' : 'finishViaBuilder-offmap'),
                reason: reason || null,
                sid: unit.sid != null ? unit.sid : null,
                beforeType: beforeType,
                afterType: afterType,
                targetType: targetType,
                level: unit.level,
                beforeState: beforeState,
                afterState: bb.state,
                didUpgradeFinish: didUpgradeFinish,
                didModelSwap: didModelSwap,
                visible: visible,
                onMap: onMap
            });
            return ok;
        };

        LocalNative.forceFinishBuilding = function(player, params, reason) {
            LocalNative.ensureUnitBuildCompleteHook();
            LocalNative.ensureQuestManagerSafe();
            var target = LocalNative.resolveBuildTarget(params);
            LocalNative.writeStatus({
                step: 'force-finish',
                reason: reason || null,
                sid: target.sid,
                cid: target.cid,
                hasUnit: !!target.unit,
                typeid: target.unit && target.unit.typeid != null ? target.unit.typeid : null,
                unitSid: target.unit && target.unit.sid != null ? target.unit.sid : null,
                keys: params ? Object.keys(params) : null,
                visible: LocalNative.unitHasVisibleRoot(target.unit)
            });
            var sid = target.sid;
            var unit = target.unit;
            if (unit && sid != null) {
                try { LocalNative.ensureUnitSid(unit, sid); } catch (eEs) {}
            }
            if (sid == null && unit && unit.sid != null) sid = unit.sid;

            if (sid != null && LocalNative.completedSids[sid]) {
                var bbDone = unit ? LocalNative.getBuildingBuilder(unit) : null;
                var tidDone = unit && unit.typeid != null ? unit.typeid : null;
                var reallyDone = bbDone && bbDone.state === BUILD_STATE_FINISH &&
                    !(typeof tidDone === 'number' && tidDone % 100 === 0) &&
                    LocalNative.unitHasVisibleRoot(unit);
                if (reallyDone) {
                    LocalNative.writeStatus({
                        step: 'force-finish-skip',
                        sid: sid,
                        reason: 'already-finished',
                        typeid: tidDone
                    });
                    return true;
                }
                LocalNative.completedSids[sid] = false;
            }
            var ok = false;
            // Do NOT call rpc_c_build_complete for construction ghosts — method is missing on
            // the instance and the stock path is what previously led to disappear bugs.
            if (unit) {
                try { ok = LocalNative.finishViaBuilder(unit, reason || 'force'); } catch (eFv) {}
            }
            if (ok && sid != null) {
                LocalNative.completedSids[sid] = true;
                try { delete LocalNative.pendingBuilds[sid]; } catch (eDel) {}
                try { LocalNative.tryDumpAndSave(); } catch (eDump) {}
                try { LocalNative.persistFinishedUnit(unit); } catch (ePer) {}
            }
            LocalNative.writeStatus({
                step: ok ? 'force-finish-ok' : 'force-finish-fail',
                sid: sid,
                cid: target.cid,
                reason: reason || null,
                typeid: unit && unit.typeid != null ? unit.typeid : null,
                unitSid: unit && unit.sid != null ? unit.sid : null,
                visible: LocalNative.unitHasVisibleRoot(unit),
                onMap: LocalNative.unitStillOnMap(unit)
            });
            return ok;
        };

        LocalNative.ackBuildComplete = function(player, sid, reason) {
            if (sid == null) return false;
            if (LocalNative.completedSids[sid]) {
                LocalNative.writeStatus({step: 'build-complete-skip', sid: sid, reason: reason || 'dup'});
                return false;
            }
            var unit = null;
            try {
                if (typeof G_UnitManager !== 'undefined' && G_UnitManager &&
                    typeof G_UnitManager.getUnitBySID === 'function')
                    unit = G_UnitManager.getUnitBySID(sid);
            } catch (eU) {}
            var ok = LocalNative.forceFinishBuilding(player, {sid: sid, unit: sid}, reason || 'ack');
            return ok;
        };

        LocalNative.scheduleOnRoot = function(fn, delaySec) {
            // GameScene keeps this node across stage teardown. A BUILD menu/root
            // can accept scheduleOnce and then be destroyed before an ACK/watchdog runs.
            try {
                var gameScene = typeof DA !== 'undefined' && DA &&
                    typeof DA.getGameScene === 'function' ? DA.getGameScene() : null;
                var persistentRoot = gameScene && gameScene._global_schedule_node;
                if (persistentRoot && typeof persistentRoot.scheduleOnce === 'function') {
                    persistentRoot.scheduleOnce(fn, delaySec || 0);
                    return true;
                }
            } catch (ePersistent) {}
            var root = LocalNative.getScheduleRoot();
            if (root && typeof root.scheduleOnce === 'function') {
                try {
                    root.scheduleOnce(fn, delaySec || 0);
                    return true;
                } catch (e1) {}
            }
            try {
                if (menu && menu.rootNode && menu.rootNode.scheduleOnce) {
                    menu.rootNode.scheduleOnce(fn, delaySec || 0);
                    return true;
                }
            } catch (e2) {}
            // Survive BUILD→BATTLE teardown: schedule on the running scene / director.
            try {
                if (typeof G_Director !== 'undefined' && G_Director) {
                    var scene = typeof G_Director.getRunningScene === 'function'
                        ? G_Director.getRunningScene() : null;
                    if (scene && typeof scene.scheduleOnce === 'function') {
                        scene.scheduleOnce(fn, delaySec || 0);
                        return true;
                    }
                }
            } catch (eDir) {}
            try {
                if (typeof TaskManager !== 'undefined' && TaskManager &&
                    typeof TaskManager.getInstance === 'function' &&
                    typeof TASK_TYPE_DELAY !== 'undefined' &&
                    typeof TASK_TYPE_SELECTOR !== 'undefined' &&
                    typeof makeSelector === 'function') {
                    var tm = TaskManager.getInstance();
                    if (tm && typeof tm.push === 'function') {
                        if ((delaySec || 0) > 0)
                            tm.push(TASK_TYPE_DELAY, delaySec || 0);
                        tm.push(TASK_TYPE_SELECTOR, makeSelector(fn));
                        return true;
                    }
                }
            } catch (eTm) {}
            try { fn(); } catch (e3) {}
            return false;
        };

        LocalNative.copyAccountProgress = function(target, player) {
            if (!target || !player || typeof player.exp !== 'number' ||
                !isFinite(player.exp) || player.exp < 0 ||
                typeof player.level !== 'number' || !isFinite(player.level) ||
                player.level < 1 || Math.floor(player.level) !== player.level) return false;
            // Stock addExp consumes experience when leveling up: save the pair.
            target.exp = player.exp;
            target.level = player.level;
            return true;
        };

        LocalNative.installAccountProgressPersistence = function(proto) {
            ['addExp', 'rpc_c_refresh_player_info'].forEach(function(name) {
                var original = proto[name];
                if (typeof original !== 'function' || original.__localAccountProgress) return;
                proto[name] = function() {
                    try { return original.apply(this, arguments); }
                    finally {
                        // An opponent/preview player must never overwrite this account.
                        if (typeof G_Player !== 'undefined' && this === G_Player) {
                            try {
                                var saved = LocalNative.readRaw();
                                if (saved && saved.level &&
                                    LocalNative.copyAccountProgress(saved.level.player, this))
                                    LocalNative.writeRaw(saved);
                            } catch (eProgress) {
                                LocalNative.writeStatus({step: 'save-account-progress-ERR', error: String(eProgress)});
                            }
                        }
                    }
                };
                proto[name].__localAccountProgress = true;
            });
        };

        LocalNative.handleUpgradeWalls = function(player, params) {
            // WallRow has already paid and put eligible segments into BUILDING.
            // Its server contract is one SID-keyed completion map, not single ACKs.
            try {
                var uids = params && params.uids;
                if (!(uids instanceof Array)) throw new Error('Missing wall SID list');
                var reply = {}, targets = [], seen = {};
                for (var i = 0; i < uids.length; i++) {
                    var sid = String(uids[i]);
                    if (seen[sid]) continue;
                    seen[sid] = true;
                    var wall = G_UnitManager.getUnitBySID(sid);
                    var bb = LocalNative.getBuildingBuilder(wall);
                    if (!wall || Math.floor(Number(wall.typeid) / 100) !== 211 || !bb)
                        throw new Error('Invalid wall ' + sid);
                    // Retransmission after completion must not grant another level.
                    if (bb.state === BUILD_STATE_FINISH) continue;
                    if (bb.state !== BUILD_STATE_BUILDING)
                        throw new Error('Wall not upgrading ' + sid);
                    var finish = LocalNative.buildFinishSwapParams(wall, Number(wall.typeid) + 1);
                    if (!finish) throw new Error('Missing wall upgrade configuration ' + sid);
                    reply[sid] = finish;
                    targets.push(wall);
                }
                if (!targets.length) return true;
                if (typeof player.rpc_c_wallrow_build_complete !== 'function')
                    throw new Error('Missing wall row completion callback');
                LocalNative.ensureQuestManagerSafe();
                // Save paid wallet and unfinished walls together before model refresh.
                if (!LocalNative.tryDumpAndSave()) throw new Error('Cannot save paid wall row');
                try {
                    player.rpc_c_wallrow_build_complete(reply);
                } finally {
                    // Preserve even a partially completed row for construction resume.
                    if (!LocalNative.tryDumpAndSave()) throw new Error('Cannot save completed wall row');
                }
                for (var j = 0; j < targets.length; j++) {
                    var done = targets[j], expected = reply[String(done.sid)];
                    var doneBuilder = LocalNative.getBuildingBuilder(done);
                    if (done.typeid !== expected.typeid || done.level !== expected.unit_level ||
                        !doneBuilder || doneBuilder.state !== BUILD_STATE_FINISH)
                        throw new Error('Wall completion did not refresh ' + done.sid);
                    LocalNative.completedSids[done.sid] = true;
                    delete LocalNative.pendingBuilds[done.sid];
                    if (typeof done.updateBuildingActionBar === 'function') done.updateBuildingActionBar();
                }
                LocalNative.writeStatus({step: 'wallrow-upgrade-complete', count: targets.length});
                return true;
            } catch (eWall) {
                LocalNative.lastError = String(eWall);
                LocalNative.writeStatus({step: 'wallrow-upgrade-ERR', error: String(eWall)});
                return false;
            }
        };

        LocalNative.snapshotHeroEquipment = function(level) {
            var roster = level.heros || [];
            for (var i = 0; i < roster.length; i++) {
                var unit = G_UnitManager.getUnitBySID(roster[i].sid);
                // A missing/uninitialized runtime hero must not erase saved slots.
                if (!unit || !unit.getComponent || String(unit.sid) !== String(roster[i].sid)) continue;
                var equipment = unit.getComponent('HeroEquipment');
                if (equipment && equipment.eqp != null)
                    roster[i].eqp = JSON.parse(JSON.stringify(equipment.eqp));
            }
        };

        LocalNative.persistHeroEquipment = function(params) {
            // Stock putOn/takeOff/replace already move the item and update stats.
            // Commit the resulting hero slots and package in the same home save.
            var sid = params && (params.sid != null ? params.sid : params.uid);
            var store = LocalNative.readRaw();
            var roster = store && store.level && store.level.heros || [];
            var found = false;
            for (var i = 0; i < roster.length; i++)
                if (String(roster[i].sid) === String(sid)) found = true;
            var unit = sid != null && G_UnitManager.getUnitBySID(sid);
            var equipment = unit && unit.getComponent && unit.getComponent('HeroEquipment');
            var ok = !!(found && unit && String(unit.sid) === String(sid) && equipment &&
                equipment.eqp != null && LocalNative.tryDumpAndSave());
            LocalNative.writeStatus({step: ok ? 'hero-equipment-saved' : 'hero-equipment-save-ERR', sid: sid});
            return ok;
        };

        LocalNative.tryDumpAndSave = function() {
            // Battle dumps must never replace the home city or its guide progress.
            if (typeof GS_CURRENT_STAGE !== 'undefined' && typeof GS_STAGE_BUILD !== 'undefined' &&
                GS_CURRENT_STAGE !== GS_STAGE_BUILD) return false;
            try {
                // Saving component state needs no stock debug-dump controller.
                var gc = LocalNative.getBuildController();
                var saved = LocalNative.readRaw();
                if (!saved || !saved.level) return false;
                var level = JSON.parse(JSON.stringify(saved.level));
                LocalNative.copyAccountProgress(level.player, G_Player);
                for (var i = 0; i < level.units.length; i++) {
                    var unit = G_UnitManager.getUnitBySID(level.units[i].sid);
                    if (unit && unit.typeid != null && unit.getComponent &&
                        unit.getComponent('BuildingBuilder'))
                        level.units[i] = LocalNative.snapshotBuildingRecord(unit);
                }
                // A purchased building must survive exit before its first completion.
                // The old loop only updated existing records; new purchases vanished.
                var knownSids = {};
                for (var j = 0; j < level.units.length; j++)
                    knownSids[String(level.units[j].sid)] = true;
                var buildings = LocalNative.collectHomeBuildings(gc);
                for (var k = 0; k < buildings.length; k++) {
                    var added = buildings[k], builder = LocalNative.getBuildingBuilder(added);
                    if (added.sid == null || knownSids[String(added.sid)] ||
                        builder.state === BUILD_STATE_BEFORE_BUILD) continue;
                    level.units.push(LocalNative.snapshotBuildingRecord(added));
                    knownSids[String(added.sid)] = true;
                }
                var rm = LocalNative.getResourceManager();
                if (rm && rm.Res) {
                    level.player.diamond = Number(rm.Res[3]) || 0;
                    level.player.spirit = Number(rm.Res[4]) || 0;
                }
                var packageManager = G_Player.getComponent && G_Player.getComponent('PackageManager');
                if (packageManager && packageManager['package'])
                    level.player['package'] = JSON.parse(JSON.stringify(packageManager['package']));
                LocalNative.snapshotHeroEquipment(level);
                var techManager = G_Player.getComponent && G_Player.getComponent('TechManager');
                if (techManager && techManager.gained_techs)
                    level.player.gained_techs = JSON.parse(JSON.stringify(techManager.gained_techs));
                // Keep the server-side progress/reward receipts, never save the
                // stock debug dump {buildings,player:{}} as a login payload.
                LocalNative.saveLevel(level);
                return true;
            } catch (e) {
                LocalNative.lastError = String(e);
                LocalNative.writeStatus({step: 'save-home-snapshot-ERR', error: String(e)});
                return false;
            }
        };

        // After bunker gem-finish, Rookie start_replay_pve calls rpc_s_enter_enemy_attack_replay.
        // Without a local ACK the guide waits forever even though rookie0 bits already advanced.
        LocalNative.getAnyGameController = function() {
            try {
                var gc = LocalNative.getBuildController();
                if (gc) return gc;
            } catch (e1) {}
            try {
                if (typeof DA !== 'undefined' && DA && typeof DA.getGameController === 'function')
                    return DA.getGameController();
            } catch (e2) {}
            try { if (typeof GETCGC === 'function') return GETCGC(); } catch (e3) {}
            try { if (typeof GETGC === 'function') return GETGC(); } catch (e4) {}
            return null;
        };

        LocalNative.finishRookieProcessSafe = function(reason) {
            try {
                var gc = LocalNative.getAnyGameController();
                LocalNative.writeStatus({
                    step: 'finishRookieProcess-try',
                    reason: reason || null,
                    hasGc: !!gc,
                    hasFn: !!(gc && typeof gc.finishRookieProcess === 'function'),
                    processID: gc && gc.processID != null ? gc.processID : null
                });
                if (gc && typeof gc.finishRookieProcess === 'function') {
                    try { gc.finishRookieProcess(); } catch (eA) {
                        try { gc.finishRookieProcess(gc.processID); } catch (eB) {
                            LocalNative.writeStatus({
                                step: 'finishRookieProcess-ERR',
                                error: String(eB)
                            });
                            return false;
                        }
                    }
                    LocalNative.writeStatus({step: 'finishRookieProcess-ok', reason: reason || null});
                    return true;
                }
                if (gc && typeof gc.rookieClick === 'function') {
                    try { gc.rookieClick(); } catch (eC) {}
                    LocalNative.writeStatus({step: 'rookieClick-fallback', reason: reason || null});
                    return true;
                }
            } catch (e) {
                LocalNative.writeStatus({step: 'finishRookieProcess-ERR', error: String(e)});
            }
            return false;
        };

        // MenuControllerBattle / GameControllerBattle read getReplayBattleLog() as battleLogItem.
        // Without it TaskManager aborts mid-init → empty village + countdown does nothing.
        LocalNative.buildEnemyAttackBattleLogStub = function(selfPlayer, oppoPlayer) {
            var attName = (oppoPlayer && oppoPlayer.nickname) || 'Enemy';
            var defName = (selfPlayer && selfPlayer.nickname) || 'LocalRookie';
            var nowSec = Math.floor(Date.now() / 1000);
            var params = {
                name: attName,
                att_name: attName,
                attacker_name: attName,
                attackerName: attName,
                def_name: defName,
                defender_name: defName,
                defenderName: defName,
                gold: 0,
                wood: 0,
                percent: 0,
                score: 0,
                star: 0,
                replayid: 'local-enemy-attack-20001',
                replay_id: 'local-enemy-attack-20001',
                unit: [],
                hero: [],
                league_tech: [],
                level: (oppoPlayer && oppoPlayer.level) || 1,
                avatar_id: 0,
                league_id: 0,
                league_name: '',
                league_flag: '',
                att_league_name: '',
                att_league_flag: '',
                att_avatar: 0,
                def_id: 0,
                def_avatar_id: 0,
                def_avatar: 0,
                def_league_name: '',
                def_league_flag: '',
                is_shared: 0,
                is_friend_challenge: 0,
                result: 0,
                date: nowSec,
                replay_time: nowSec,
                isNew: 0,
                win_gold: 0,
                win_wood: 0
            };
            var log = null;
            try {
                if (typeof TempBattleLogData === 'function') {
                    log = new TempBattleLogData();
                    if (typeof log.init === 'function') {
                        try { log.init(params); } catch (eInit) { log.params = params; }
                    } else {
                        log.params = params;
                    }
                }
            } catch (eTmp) { log = null; }
            if (!log) {
                log = {__localNativeBattleLogStub: true, params: params};
            } else {
                log.__localNativeBattleLogStub = true;
                if (!log.params) log.params = params;
            }
            var ensureFn = function(obj, name, fn) {
                if (typeof obj[name] !== 'function') obj[name] = fn;
            };
            ensureFn(log, 'getAttackerName', function() { return attName; });
            ensureFn(log, 'getDefenderName', function() { return defName; });
            ensureFn(log, 'getAttackerLeagueName', function() { return ''; });
            ensureFn(log, 'getDefenderLeagueName', function() { return ''; });
            ensureFn(log, 'getAttackerLeagueFlag', function() { return ''; });
            ensureFn(log, 'getDefenderLeagueFlag', function() { return ''; });
            ensureFn(log, 'getPercent', function() { return 0; });
            ensureFn(log, 'getReplayBattleResult', function() {
                return {percent: 0, star: 0, gold: 0, wood: 0, score: 0};
            });
            ensureFn(log, 'dumpParams', function() { return params; });
            ensureFn(log, 'dumpInfo', function() { return params; });
            ensureFn(log, 'isBattleAttacker', function() { return true; });
            return log;
        };

        LocalNative.ensureEnemyAttackBattleLog = function(selfPlayer, oppoPlayer) {
            var log = LocalNative.buildEnemyAttackBattleLogStub(selfPlayer, oppoPlayer);
            try {
                if (typeof G_Player !== 'undefined' && G_Player)
                    G_Player.tempReplayBattleLog = log;
            } catch (eP) {}
            try {
                if (typeof G_MainController !== 'undefined' && G_MainController)
                    G_MainController.tempReplayBattleLog = log;
            } catch (eM) {}
            LocalNative.enemyAttackBattleLog = log;
            return log;
        };

        LocalNative.normalizeReplayUnits = function(units) {
            var list = units || [];
            var out = [];
            var defender = typeof BATTLE_FACTION_DEFENDER !== 'undefined' ? BATTLE_FACTION_DEFENDER : 2;
            for (var i = 0; i < list.length; i++) {
                var src = list[i];
                if (!src) continue;
                var u = {};
                for (var k in src) {
                    if (Object.prototype.hasOwnProperty.call(src, k)) u[k] = src[k];
                }
                // Construction placeholder 30100 has no battle skill_nums; fight as 30101.
                if (u.typeid != null && Number(u.typeid) % 100 === 0) {
                    var family = Math.floor(Number(u.typeid) / 100);
                    if (family > 0) u.typeid = family * 100 + 1;
                }
                if (u.typeid != null) {
                    u.unit_type = Math.floor(Number(u.typeid) / 100);
                    u.unit_level = Number(u.typeid) % 100;
                }
                // Home dumps keep faction=2; stock enemy-attack may map that slot to Enemy.
                // Always pin replay buildings to the defender faction constant.
                u.faction = defender;
                if (u.unit_mutateid == null) u.unit_mutateid = 0;
                if (u.state == null && typeof BUILD_STATE_FINISH !== 'undefined')
                    u.state = BUILD_STATE_FINISH;
                // Replay villages contain built structures, not placement ghosts.
                u.bs = u.state = BUILD_STATE_FINISH;
                u.bt = u.beginTime = 0;
                // Battle create paths often key off cid; home dumps use sid.
                if (u.cid == null && u.sid != null) u.cid = u.sid;
                out.push(u);
            }
            return out;
        };

        // Battle SIDs must not reuse home-city 1..N. Stock createUnit / UnitManager
        // and our battle-local skip-dup keys treat same sid as already present →
        // campaign PVE (and remounted raids) can paint an empty village.
        LocalNative.remapBattleUnitIds = function(units, baseSid) {
            baseSid = baseSid || 91000;
            var list = units || [];
            var out = [];
            for (var i = 0; i < list.length; i++) {
                var src = list[i];
                if (!src) continue;
                var u = {};
                for (var k in src) {
                    if (Object.prototype.hasOwnProperty.call(src, k)) u[k] = src[k];
                }
                u.sid = baseSid + i + 1;
                u.cid = u.sid;
                u.id = u.sid;
                out.push(u);
            }
            return out;
        };

        // Battle ILD calls createPlayer/initByServer(data.self). Stock expects player fields on
        // the side object itself; a nested-only {player:{nickname}} yields default "新晋酋长"
        // and can break later unit setup. Keep BOTH flat fields and nested .player.
        LocalNative.makeBattleSide = function(player, extras) {
            var side = {};
            if (player && typeof player === 'object') {
                for (var k in player) {
                    if (Object.prototype.hasOwnProperty.call(player, k)) side[k] = player[k];
                }
            }
            side.player = player || side.player || {};
            if (extras && typeof extras === 'object') {
                for (var ek in extras) {
                    if (Object.prototype.hasOwnProperty.call(extras, ek)) side[ek] = extras[ek];
                }
            }
            if (side.gold == null) side.gold = 0;
            if (side.wood == null) side.wood = 0;
            if (side.max_gold == null) side.max_gold = 0;
            if (side.max_wood == null) side.max_wood = 0;
            if (!side.soldiers) side.soldiers = [];
            // Keep saved heros (incl. defense_id). Only default to [] when absent.
            if (!side.heros) {
                if (player && player.heros) side.heros = player.heros;
                else side.heros = [];
            }
            if (!side.league_tech) side.league_tech = [];
            if (side.first_time_stage == null)
                side.first_time_stage = (player && player.first_time_stage) || 0;
            return side;
        };

        LocalNative.countBattleUnits = function(gc) {
            var n = 0;
            // Stock battle controller stores unit IDs here, not in BUILD.buildings.
            if (gc && gc.defenders && gc.defenders.length) n += gc.defenders.length;
            if (gc && gc.attackers && gc.attackers.length) n += gc.attackers.length;
            if (gc && gc.sceneObj && gc.sceneObj.length) n += gc.sceneObj.length;
            if (n > 0) return n;
            try {
                if (gc && gc.buildings) {
                    var b = gc.buildings;
                    if (typeof b.length === 'number') {
                        for (var i = 0; i < b.length; i++) if (b[i]) n++;
                    } else {
                        var keys = Object.keys(b);
                        for (var j = 0; j < keys.length; j++) if (b[keys[j]]) n++;
                    }
                }
            } catch (eB) {}
            if (n > 0) return n;
            try {
                if (typeof G_UnitManager !== 'undefined' && G_UnitManager &&
                    typeof G_UnitManager.getAllUnits === 'function') {
                    var all = G_UnitManager.getAllUnits();
                    if (all && all.length) return all.length;
                }
            } catch (eU) {}
            return n;
        };

        // post-ild force-create raced stock TaskManager DELAY creates → same tile
        // twice. First "explode" only kills one shell; the twin still has full HP.
        // Dedup MUST NOT consult G_UnitManager.getUnitBySID/getAllUnits: home-city
        // units keep the same sid and would make every battle create look like a dup
        // (empty village, attackers only).
        LocalNative.battleBuildingKey = function(unit) {
            if (!unit) return null;
            if (unit.sid != null) return 's:' + unit.sid;
            if (unit.cid != null) return 'c:' + unit.cid;
            if (unit.typeid != null && unit.x != null && unit.y != null)
                return 't:' + unit.typeid + ':' + unit.x + ':' + unit.y;
            return null;
        };

        LocalNative.battleCreatedKeySet = function(gc) {
            if (!gc) return null;
            if (!gc.__localBattleBuildingKeys) gc.__localBattleBuildingKeys = {};
            return gc.__localBattleBuildingKeys;
        };

        LocalNative.markBattleBuildingCreated = function(gc, spec) {
            var keys = LocalNative.battleCreatedKeySet(gc);
            if (!keys || !spec) return;
            var primary = LocalNative.battleBuildingKey(spec);
            if (primary) keys[primary] = true;
            if (spec.sid != null) keys['s:' + spec.sid] = true;
            if (spec.cid != null) keys['c:' + spec.cid] = true;
            if (spec.typeid != null && spec.x != null && spec.y != null)
                keys['t:' + spec.typeid + ':' + spec.x + ':' + spec.y] = true;
        };

        LocalNative.unitMatchesBattleSpec = function(existing, spec) {
            if (!existing || !spec) return false;
            var esid = existing.sid != null ? existing.sid :
                (typeof existing.getSID === 'function' ? existing.getSID() : null);
            var ecid = existing.cid != null ? existing.cid : null;
            var etype = existing.typeid != null ? existing.typeid : null;
            var ex = existing.x != null ? existing.x : null;
            var ey = existing.y != null ? existing.y : null;
            try {
                if (existing.getTypeID && etype == null) etype = existing.getTypeID();
            } catch (eT) {}
            try {
                if ((ex == null || ey == null) && existing.getLogicX && existing.getLogicY) {
                    ex = existing.getLogicX();
                    ey = existing.getLogicY();
                }
            } catch (eXY) {}
            if (spec.sid != null && esid != null && Number(esid) === Number(spec.sid))
                return true;
            if (spec.cid != null && ecid != null && Number(ecid) === Number(spec.cid))
                return true;
            if (spec.typeid != null && etype != null && Number(etype) === Number(spec.typeid) &&
                spec.x != null && ex != null && Number(ex) === Number(spec.x) &&
                spec.y != null && ey != null && Number(ey) === Number(spec.y))
                return true;
            return false;
        };

        LocalNative.eachBattleCandidate = function(gc, visit) {
            if (!gc || typeof visit !== 'function') return;
            var seen = {};
            var pushOne = function(item, via) {
                if (item == null || item === false) return;
                if (typeof item === 'number' || typeof item === 'string') {
                    var sidNum = Number(item);
                    if (!isNaN(sidNum)) {
                        var sidKey = 's:' + sidNum;
                        if (!seen[sidKey]) {
                            seen[sidKey] = true;
                            // defenders may store bare SIDs; do not resolve via
                            // G_UnitManager (that returns the home-city twin).
                            visit({sid: sidNum, cid: sidNum}, via + ':sid-id');
                        }
                    }
                    return;
                }
                var key = LocalNative.battleBuildingKey(item) ||
                    ('obj:' + (item.__instanceId || item._id || Math.random()));
                if (seen[key]) return;
                seen[key] = true;
                visit(item, via);
            };
            var walkList = function(list, via) {
                if (!list) return;
                if (typeof list.length === 'number') {
                    for (var i = 0; i < list.length; i++) pushOne(list[i], via);
                    return;
                }
                try {
                    var keys = Object.keys(list);
                    for (var j = 0; j < keys.length; j++) pushOne(list[keys[j]], via);
                } catch (eObj) {}
            };
            // Battle-local lists only. Home leftovers in UnitManager must be ignored.
            walkList(gc.defenders, 'defenders');
            walkList(gc.sceneObj, 'sceneObj');
            walkList(gc.buildings, 'buildings');
        };

        LocalNative.findBattleBuildingMatch = function(gc, spec) {
            if (!spec || !gc) return null;
            var keySet = LocalNative.battleCreatedKeySet(gc);
            if (keySet) {
                var want = LocalNative.battleBuildingKey(spec);
                if (want && keySet[want]) return {__localMarked: true, sid: spec.sid, cid: spec.cid};
                if (spec.sid != null && keySet['s:' + spec.sid])
                    return {__localMarked: true, sid: spec.sid};
                if (spec.cid != null && keySet['c:' + spec.cid])
                    return {__localMarked: true, cid: spec.cid};
                if (spec.typeid != null && spec.x != null && spec.y != null &&
                    keySet['t:' + spec.typeid + ':' + spec.x + ':' + spec.y])
                    return {__localMarked: true, typeid: spec.typeid, x: spec.x, y: spec.y};
            }
            var found = null;
            LocalNative.eachBattleCandidate(gc, function(item) {
                if (!found && LocalNative.unitMatchesBattleSpec(item, spec)) found = item;
            });
            return found;
        };

        LocalNative.hasBattleBuilding = function(gc, spec) {
            return !!LocalNative.findBattleBuildingMatch(gc, spec);
        };

        LocalNative.listMissingBattleBuildings = function(gc, units) {
            var list = units || [];
            var missing = [];
            for (var i = 0; i < list.length; i++) {
                var raw = list[i];
                if (!raw) continue;
                if (!LocalNative.hasBattleBuilding(gc, raw)) missing.push(raw);
            }
            return missing;
        };

        // _createBattleUnitWhenInit reads build_data.client (defender ClientPlayer).
        // Stock enemy-attack replay often queues tasks with client===undefined → empty village.
        LocalNative.resolveBattleClient = function(faction) {
            var defF = typeof BATTLE_FACTION_DEFENDER !== 'undefined' ? BATTLE_FACTION_DEFENDER : 2;
            var atkF = typeof BATTLE_FACTION_ATTACKER !== 'undefined' ? BATTLE_FACTION_ATTACKER : 1;
            var f = faction != null ? faction : defF;
            var client = null;
            var via = null;
            try {
                if (typeof G_PlayerManager !== 'undefined' && G_PlayerManager &&
                    typeof G_PlayerManager.getPlayerByFaction === 'function') {
                    client = G_PlayerManager.getPlayerByFaction(f);
                    if (client) via = 'getPlayerByFaction';
                }
            } catch (e1) {}
            if (!client) {
                try {
                    var sp = G_PlayerManager && G_PlayerManager.stagePlayers;
                    if (sp) {
                        if (sp[f]) { client = sp[f]; via = 'stagePlayers[f]'; }
                        else if (sp[defF]) { client = sp[defF]; via = 'stagePlayers[def]'; }
                        else if (sp[atkF]) { client = sp[atkF]; via = 'stagePlayers[atk]'; }
                        else {
                            var sk = Object.keys(sp);
                            for (var si = 0; si < sk.length; si++) {
                                if (sp[sk[si]]) { client = sp[sk[si]]; via = 'stagePlayers*'; break; }
                            }
                        }
                    }
                } catch (e2) {}
            }
            if (!client) {
                try {
                    var store = LocalNative.readRaw();
                    var p = store && store.level && store.level.player
                        ? store.level.player : LocalNative.defaultPlayer();
                    if (typeof G_PlayerManager !== 'undefined' && G_PlayerManager &&
                        typeof G_PlayerManager.createPlayer === 'function') {
                        try {
                            client = G_PlayerManager.createPlayer(p, f);
                            via = 'createPlayer(data,f)';
                        } catch (e3a) {
                            try {
                                client = G_PlayerManager.createPlayer(f, p);
                                via = 'createPlayer(f,data)';
                            } catch (e3b) {
                                LocalNative.writeStatus({
                                    step: 'resolveBattleClient-create-ERR',
                                    error: String(e3b)
                                });
                            }
                        }
                    }
                } catch (e3) {}
            }
            LocalNative.writeStatus({
                step: 'resolveBattleClient',
                faction: f,
                hasClient: !!client,
                via: via,
                nick: client ? (client.nickname || null) : null
            });
            return client;
        };

        LocalNative.bindBattleClientFaction = function(client, faction) {
            if (!client || faction == null) return client;
            try { client.faction = faction; } catch (eF) {}
            try {
                if (typeof G_PlayerManager !== 'undefined' && G_PlayerManager) {
                    if (G_PlayerManager.stagePlayers)
                        G_PlayerManager.stagePlayers[faction] = client;
                    if (typeof G_PlayerManager.setPlayerByFaction === 'function')
                        G_PlayerManager.setPlayerByFaction(faction, client);
                }
            } catch (eBind) {}
            return client;
        };

        LocalNative.ensureBattleClients = function(gc) {
            var defF = typeof BATTLE_FACTION_DEFENDER !== 'undefined' ? BATTLE_FACTION_DEFENDER : 2;
            var atkF = typeof BATTLE_FACTION_ATTACKER !== 'undefined' ? BATTLE_FACTION_ATTACKER : 1;
            var byDef = LocalNative.resolveBattleClient(defF);
            var byAtk = LocalNative.resolveBattleClient(atkF);
            // Stock ILD has assigned LocalRookie to faction 1 and Enemy to faction 2 while
            // buildings still carry home faction=2 — towers then sit on the Enemy client.
            // Resolve self/opponent using the legacy raid layout first, then assign
            // roles for the active battle before publishing either client.
            var defender = null;
            var attacker = null;
            try {
                if (typeof G_Player !== 'undefined' && G_Player) defender = G_Player;
            } catch (eP) {}
            if (!defender) defender = byDef;
            if (defender && byDef && defender !== byDef) {
                var defNick = String(defender.nickname || '');
                var slotNick = String(byDef.nickname || '');
                if (/enemy/i.test(defNick) && !/enemy/i.test(slotNick)) defender = byDef;
            }
            if (byDef && /enemy/i.test(String(byDef.nickname || '')) && byAtk &&
                !/enemy/i.test(String(byAtk.nickname || ''))) {
                // Slot names are swapped relative to roles; prefer non-Enemy as defender.
                if (!defender || /enemy/i.test(String(defender.nickname || '')))
                    defender = byAtk;
                attacker = byDef;
            }
            if (!attacker) attacker = byAtk;
            if (!attacker || attacker === defender) {
                try {
                    var oppo = {
                        nickname: 'Enemy', level: 1, account: 'local-enemy',
                        account_id: 'local-enemy', soldiers: [], heros: []
                    };
                    if (G_PlayerManager && typeof G_PlayerManager.createPlayer === 'function') {
                        try { attacker = G_PlayerManager.createPlayer(oppo, atkF); }
                        catch (eA) {
                            try { attacker = G_PlayerManager.createPlayer(atkF, oppo); } catch (eB) {}
                        }
                    }
                    if (!attacker) attacker = oppo;
                } catch (eAtk) {}
            }
            if (!gc && typeof DA !== 'undefined' && typeof DA.GETCGC === 'function') gc = DA.GETCGC();
            var level = gc && gc.level_data || {};
            var liveAttack = gc && !gc.inReplayMode && !gc.isEnterEnemyAttackReplay &&
                !level.isEnterEnemyAttackReplay && !level.localNativeRaid;
            if (liveAttack) {
                var opponent = attacker;
                attacker = defender;
                defender = opponent;
            }
            LocalNative.bindBattleClientFaction(defender, defF);
            LocalNative.bindBattleClientFaction(attacker, atkF);
            LocalNative.writeStatus({
                step: 'ensureBattleClients',
                defF: defF,
                atkF: atkF,
                liveAttack: !!liveAttack,
                defNick: defender ? (defender.nickname || null) : null,
                atkNick: attacker ? (attacker.nickname || null) : null,
                swappedFix: !!(byDef && /enemy/i.test(String(byDef.nickname || '')))
            });
            return {defender: defender, attacker: attacker, defF: defF, atkF: atkF};
        };

        LocalNative.withBattleClient = function(unit, client) {
            if (!unit) return unit;
            var u = {};
            for (var k in unit) {
                if (Object.prototype.hasOwnProperty.call(unit, k)) u[k] = unit[k];
            }
            var defF = typeof BATTLE_FACTION_DEFENDER !== 'undefined' ? BATTLE_FACTION_DEFENDER : 2;
            u.faction = defF;
            // Always rebind defender client; stock may have put Enemy on the home faction slot.
            u.client = client || LocalNative.resolveBattleClient(defF);
            return u;
        };

        // TaskManager queues _createBattleUnitWhenInit with DELAY; if an earlier selector
        // throws (battleLogItem etc.), the queue dies and the village stays empty. Force
        // a synchronous create pass only for units still missing after stock DELAY.
        LocalNative.forceCreateBattleUnits = function(gc, units) {
            var list = units || [];
            var created = 0;
            var skipped = 0;
            var errors = [];
            if (!gc || !list.length)
                return {created: 0, skipped: 0, errors: errors, now: LocalNative.countBattleUnits(gc)};
            var clients = LocalNative.ensureBattleClients();
            var defender = clients.defender;
            for (var i = 0; i < list.length; i++) {
                var raw = list[i];
                if (!raw) continue;
                if (LocalNative.hasBattleBuilding(gc, raw)) {
                    skipped++;
                    continue;
                }
                var beforeOne = LocalNative.countBattleUnits(gc);
                var u = LocalNative.withBattleClient(raw, defender);
                if (!u.client) {
                    errors.push({via: 'no-client', typeid: raw.typeid, error: 'client still undefined'});
                    continue;
                }
                var ok = false;
                try {
                    if (typeof gc._createBattleUnitWhenInit === 'function') {
                        gc._createBattleUnitWhenInit(u, u.client);
                        if (LocalNative.hasBattleBuilding(gc, raw) ||
                            LocalNative.countBattleUnits(gc) > beforeOne) {
                            LocalNative.markBattleBuildingCreated(gc, raw);
                            created++;
                            ok = true;
                        }
                    }
                } catch (e1) {
                    errors.push({via: '_createBattleUnitWhenInit', typeid: u.typeid, error: String(e1)});
                }
                if (ok) continue;
                try {
                    if (typeof gc.__buildUnit === 'function') {
                        gc.__buildUnit(u);
                        if (LocalNative.hasBattleBuilding(gc, raw) ||
                            LocalNative.countBattleUnits(gc) > beforeOne) {
                            LocalNative.markBattleBuildingCreated(gc, raw);
                            created++;
                            ok = true;
                        }
                    }
                } catch (e2) {
                    errors.push({via: '__buildUnit', typeid: u.typeid, error: String(e2)});
                }
                if (ok) continue;
                try {
                    if (typeof gc.createUnit === 'function') {
                        gc.createUnit(u);
                        if (LocalNative.hasBattleBuilding(gc, raw) ||
                            LocalNative.countBattleUnits(gc) > beforeOne) {
                            LocalNative.markBattleBuildingCreated(gc, raw);
                            created++;
                            ok = true;
                        }
                    }
                } catch (e3) {
                    errors.push({via: 'createUnit', typeid: u.typeid, error: String(e3)});
                }
                if (!ok && !LocalNative.hasBattleBuilding(gc, raw) &&
                    LocalNative.countBattleUnits(gc) <= beforeOne) {
                    errors.push({via: 'no-growth', typeid: u.typeid, error: 'unit count unchanged'});
                }
            }
            return {
                created: created,
                skipped: skipped,
                errors: errors,
                now: LocalNative.countBattleUnits(gc),
                hasDefender: !!defender
            };
        };

        LocalNative.ensureBattleVillageUnits = function(gc, units, reason) {
            var expect = units || [];
            var before = LocalNative.countBattleUnits(gc);
            var missing = LocalNative.listMissingBattleBuildings(gc, expect);
            if (!missing.length) {
                LocalNative.writeStatus({
                    step: 'battle-units-ok',
                    reason: reason || null,
                    units: before,
                    expect: expect.length,
                    missing: 0
                });
                return before;
            }
            var result = LocalNative.forceCreateBattleUnits(gc, missing);
            LocalNative.writeStatus({
                step: 'battle-units-force-create',
                reason: reason || null,
                before: before,
                expect: expect.length,
                missing: missing.length,
                created: result.created,
                skipped: result.skipped,
                now: result.now,
                hasDefender: !!result.hasDefender,
                errors: result.errors && result.errors.length ? result.errors.slice(0, 6) : []
            });
            // Keep local live-combat gates open if units were created late.
            if (gc.battleStarted && result.created > 0) {
                try {
                    LocalNative.enableDefenderLiveCombat(gc, (reason || 'force') + '-wake');
                } catch (eWake) {}
            }
            return result.now;
        };

        // Lv1 bunker (301) fires via StaticBattleController + skill 30101_atk.
        // Stock enemy-attack ILD sets inReplayMode from dict.replay; with only
        // BR_START_BATTLE and no attack records, towers never shoot unless live
        // AI is re-enabled. Prefer getUnit (battle map) over getUnitBySID (home).
        LocalNative.resolveBattleUnitById = function(id) {
            if (id == null) return null;
            var unit = null;
            var n = Number(id);
            try {
                if (typeof G_UnitManager !== 'undefined' && G_UnitManager) {
                    if (typeof G_UnitManager.getUnit === 'function') {
                        try { unit = G_UnitManager.getUnit(n); } catch (e0) {}
                        if (!unit) {
                            try { unit = G_UnitManager.getUnit(id); } catch (e1) {}
                        }
                    }
                    if (!unit && typeof G_UnitManager.getUnitBySID === 'function') {
                        try { unit = G_UnitManager.getUnitBySID(n); } catch (e2) {}
                    }
                }
            } catch (e3) {}
            return unit;
        };

        // Stock setTargetID / beginSkill use G_UnitManager.getUnit(cid).getPosition().
        // Battle map units often have sid=null; prefer cid/getCID over sid.
        LocalNative.resolveUnitCid = function(unit) {
            if (unit == null) return null;
            if (typeof unit === 'number' || typeof unit === 'string') {
                var asNum = Number(unit);
                return isNaN(asNum) ? null : asNum;
            }
            try {
                if (typeof unit.getCID === 'function') {
                    var c0 = unit.getCID();
                    if (c0 != null && c0 !== '') return Number(c0);
                }
            } catch (e0) {}
            if (unit.cid != null && unit.cid !== '') return Number(unit.cid);
            try {
                if (typeof unit.getId === 'function') {
                    var c1 = unit.getId();
                    if (c1 != null && c1 !== '') return Number(c1);
                }
            } catch (e1) {}
            if (unit.id != null && unit.id !== '') return Number(unit.id);
            return null;
        };

        LocalNative.isBattleMapUnit = function(unit) {
            if (!unit) return false;
            try {
                if (typeof unit.getPosition === 'function') {
                    var pos = unit.getPosition();
                    return !!pos;
                }
            } catch (e0) {}
            return false;
        };

        LocalNative.resolveUnitBattleController = function(unit) {
            if (!unit || typeof unit.getComponent !== 'function') return null;
            var bc = null;
            try {
                if (typeof Comp !== 'undefined' && Comp && Comp.BattleController)
                    bc = unit.getComponent(Comp.BattleController);
            } catch (e1) {}
            if (!bc) {
                try { bc = unit.getComponent('BattleController'); } catch (e2) {}
            }
            if (!bc && unit.componentList) {
                try {
                    bc = unit.componentList.BattleController ||
                        unit.componentList.StaticBattleController || null;
                } catch (e3) {}
            }
            return bc || null;
        };

        LocalNative.eachBattleDefenderUnit = function(gc, visit) {
            if (!gc || typeof visit !== 'function') return;
            var list = gc.defenders || [];
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                var unit = item;
                var via = 'obj';
                if (typeof item === 'number' || typeof item === 'string') {
                    unit = LocalNative.resolveBattleUnitById(item);
                    via = 'id';
                }
                if (unit) visit(unit, via, item);
            }
        };

        LocalNative.probeDefenderBattleReady = function(gc) {
            var reports = [];
            LocalNative.eachBattleDefenderUnit(gc, function(unit, via) {
                if (reports.length >= 8) return;
                var typeid = unit.typeid != null ? unit.typeid :
                    (typeof unit.getTypeID === 'function' ? unit.getTypeID() : null);
                var unitType = typeid != null ? Math.floor(Number(typeid) / 100) : null;
                var bc = LocalNative.resolveUnitBattleController(unit);
                var skillNums = null;
                try {
                    if (bc && bc.config && bc.config.skill_nums) skillNums = bc.config.skill_nums;
                    else if (unit.config && unit.config.skill_nums) skillNums = unit.config.skill_nums;
                } catch (eSk) {}
                reports.push({
                    sid: unit.sid != null ? unit.sid :
                        (typeof unit.getSID === 'function' ? unit.getSID() : null),
                    typeid: typeid,
                    unitType: unitType,
                    faction: unit.faction != null ? unit.faction : null,
                    via: via,
                    hasBattleController: !!bc,
                    hasThreat: !!(bc && bc.threatSystem),
                    skillCount: skillNums && skillNums.length != null ? skillNums.length : null,
                    ignoreNotAuto: !!(bc && bc.ignoreNotAuto),
                    began: !!(bc && (bc.__localBattleBegan || bc.battleBegan || bc.isBattleBegin))
                });
            });
            return reports;
        };

        // Local stub raids have no BR attack records. Drop only skill/user-oper
        // gates so stock StaticBattleController onIdle/threatSystem can fire.
        // Do NOT clear inReplayMode: stock enemy-attack natural end and
        // MenuControllerBattle.onReplayEnd expect replay mode
        // (isUserOperationFinished + onReplayEnd → rpc_s_finish_enemy_attack_replay).
        LocalNative.clearBattleOperGates = function(gc) {
            if (!gc) return {};
            var before = {
                inReplayMode: !!gc.inReplayMode,
                noUserOperSkill: !!gc.noUserOperSkill,
                ignoreOperSkill: !!gc.ignoreOperSkill,
                noUserOper: !!gc.noUserOper,
                gamePaused: !!gc.gamePaused
            };
            try { gc.noUserOperSkill = false; } catch (e2) {}
            try { gc.ignoreOperSkill = false; } catch (e3) {}
            try { gc.noUserOper = false; } catch (e4) {}
            try { gc.ignoreUserOper = false; } catch (e5) {}
            try { gc.gamePaused = false; } catch (e6) {}
            return before;
        };

        // This local replay has a start record but no attack records. Let the
        // stock FSM acquire targets and cast skills; never drive beginSkill,
        // reset skill managers, or inject threat/targets from the adapter.
        LocalNative.enableDefenderLiveCombat = function(gc, reason) {
            if (!gc) return {};
            var gates = LocalNative.clearBattleOperGates(gc);
            // The synthetic replay only has BR_START_BATTLE. It has just run;
            // after switching to live AI the recorder will never consume it.
            // Leaving it queued makes stock isUserOperationFinished() false.
            if (gc.__localRaidSession && !gc.__localRaidRecordsConsumed && gc.battleStarted &&
                gc.battleRecorder && typeof gc.battleRecorder.setRecords === 'function') {
                gc.battleRecorder.setRecords([]);
                gc.__localRaidRecordsConsumed = true;
            }
            LocalNative.writeStatus({
                step: 'defender-live-combat',
                reason: reason || null,
                gates: gates,
                keptReplayMode: !!gc.inReplayMode,
                randomSeed: gc.battleRecorder ? gc.battleRecorder.randomSeed : null,
                probed: LocalNative.probeDefenderBattleReady(gc)
            });
            LocalNative.pushSettleTrace({
                kind: 'defender-live-combat',
                reason: reason || null,
                keptReplayMode: !!gc.inReplayMode,
                recordsCleared: !!gc.__localRaidRecordsConsumed
            });
            return {gates: gates};
        };

        // Rookie enemy-attack has no real BR_UNIT_CREATE records yet; spawn a few 10101 so
        // the raid is not an empty field after countdown.
        LocalNative.spawnStubAttackers = function(gc) {
            if (!gc) return 0;
            if (gc.__localRaidDeployed) return 0;
            if (!gc.battleStarted && typeof gc.startBattle === 'function') gc.startBattle();
            // Allow stock live AI; the local replay contains only its start record.
            try { LocalNative.enableDefenderLiveCombat(gc, 'pre-stub'); } catch (eW0) {}
            var clients = LocalNative.ensureBattleClients();
            var atkF = clients.atkF != null ? clients.atkF :
                (typeof BATTLE_FACTION_ATTACKER !== 'undefined' ? BATTLE_FACTION_ATTACKER : 1);
            var client = clients.attacker || LocalNative.resolveBattleClient(atkF);
            var before = LocalNative.countBattleUnits(gc);
            // Mix near-bunker (melee ring) and mid-range spots so att_dis_min/att_dis both OK.
            var spots = [[24, 20], [20, 24], [28, 24], [24, 28]];
            var spawned = 0;
            var stubCids = [];
            var stubProbe = [];
            for (var i = 0; i < spots.length; i++) {
                var x = spots[i][0];
                var y = spots[i][1];
                var data = {
                    // Match stock UnitProxy.Operate: x/y in params mean a settled
                    // building and make sendUnitToMap call the absent TileHolder.
                    typeid: 10101, faction: atkF, client: client
                };
                try {
                    // Use stock placement/AI setup, with map coordinates converted
                    // by the same tile map used to display the saved village.
                    var map = gc.mapManager;
                    if (map && typeof map.TileCenterPosForLogicCoord === 'function' &&
                        typeof gc.sendUnitToMap === 'function') {
                        var position = map.TileCenterPosForLogicCoord(x, y);
                        var soldier = gc.sendUnitToMap(data, position);
                        var grew = LocalNative.countBattleUnits(gc) > before + spawned;
                        if (soldier || grew) spawned++;
                        var cid = LocalNative.resolveUnitCid(soldier);
                        if (cid == null && gc.attackers && gc.attackers.length) {
                            var last = gc.attackers[gc.attackers.length - 1];
                            cid = LocalNative.resolveUnitCid(last);
                            if (cid == null && (typeof last === 'number' || typeof last === 'string'))
                                cid = Number(last);
                        }
                        if (cid != null && !isNaN(cid)) stubCids.push(cid);
                        var mapped = cid != null ? LocalNative.resolveBattleUnitById(cid) : soldier;
                        stubProbe.push({
                            cid: cid,
                            hasPos: LocalNative.isBattleMapUnit(mapped || soldier),
                            typeid: mapped && mapped.typeid != null ? mapped.typeid :
                                (soldier && soldier.typeid != null ? soldier.typeid : 10101)
                        });
                    }
                } catch (eC) {
                    LocalNative.writeStatus({
                        step: 'spawnStubAttackers-ERR',
                        error: String(eC),
                        i: i
                    });
                }
            }
            gc.__localStubAtkCids = stubCids;
            try { LocalNative.enableDefenderLiveCombat(gc, 'post-stub'); } catch (eW1) {}
            LocalNative.writeStatus({
                step: 'spawnStubAttackers',
                spawned: spawned,
                before: before,
                now: LocalNative.countBattleUnits(gc),
                hasAtkClient: !!client,
                spots: spots,
                stubCids: stubCids.slice(0, 8),
                stubProbe: stubProbe.slice(0, 8),
                inReplayMode: !!gc.inReplayMode
            });
            if (spawned > 0) gc.__localRaidDeployed = true;
            return spawned;
        };

        // One-shot: set localStorage dino.local.native.retest_enemy_attack=1 then restart.
        LocalNative.maybeRetestEnemyAttack = function() {
            var key = 'dino.local.native.retest_enemy_attack';
            var flag = null;
            try {
                if (typeof sys !== 'undefined' && sys.localStorage)
                    flag = sys.localStorage.getItem(key);
            } catch (eR) {}
            if (flag !== '1' && flag !== 1 && flag !== 'true') return false;
            try {
                if (typeof sys !== 'undefined' && sys.localStorage)
                    sys.localStorage.removeItem(key);
            } catch (eRm) {}
            LocalNative.writeStatus({step: 'retest-enemy-attack-armed'});
            LocalNative.scheduleOnRoot(function() {
                try {
                    var player = typeof G_Player !== 'undefined' ? G_Player : null;
                    LocalNative.handleEnterEnemyAttackReplay(player, {stage: 20001});
                } catch (eGo) {
                    LocalNative.writeStatus({
                        step: 'retest-enemy-attack-ERR',
                        error: String(eGo)
                    });
                }
            }, 1.5);
            return true;
        };

        LocalNative.buildEnemyAttackReplayDict = function(stageId) {
            var store = LocalNative.readRaw();
            var level = store && store.level ? store.level : LocalNative.defaultLevelDict();
            var pveCfg = null;
            try {
                if (typeof data !== 'undefined' && data) {
                    if (data.pve_stage)
                        pveCfg = data.pve_stage[stageId] || data.pve_stage[String(stageId)];
                    if (!pveCfg && data.stage)
                        pveCfg = data.stage[stageId] || data.stage[String(stageId)];
                }
            } catch (eCfg) {}
            // Stock GameControllerBattle.initLevelFromData reads data.oppo.player (nested).
            // A flat oppo{} throws and leaves SceneLoading stuck mid changeStage.
            var selfPlayer = level.player || LocalNative.defaultPlayer();
            // Remap to 92001+ so home UnitManager SIDs cannot blank the raid village.
            var units = LocalNative.remapBattleUnitIds(
                LocalNative.normalizeReplayUnits(level.units || []), 92000);
            var walls = level.walls || [];
            var heroDonate = level.hero_donate_list || [];
            var modelInfo = level.model_info || {};
            var userConfig = level.user_config || {};
            // Keep bunker garrison heros (defense_id) for unlock_defense later.
            // Do NOT pass the city attack team (opening Dino state=ATTACK): spawning
            // them into this enemy-attack replay blocks natural finish after all
            // attackers die. Home nest roster remains on level.heros in the save.
            var rawHeros = (level.heros && level.heros.length) ? level.heros :
                ((selfPlayer.heros && selfPlayer.heros.length) ? selfPlayer.heros : []);
            var selfHeros = [];
            for (var hi = 0; hi < rawHeros.length; hi++) {
                var rh = rawHeros[hi];
                if (rh && rh.defense_id) selfHeros.push(rh);
            }

            var oppoPlayer = {
                nickname: 'Enemy',
                level: 1,
                account: 'local-enemy',
                account_id: 'local-enemy',
                accountID: 'local-enemy',
                diamond: 0,
                spirit: 0,
                exp: 0,
                experience: 0,
                soldiers: [],
                heros: [],
                buffs: [],
                league_id: 0,
                synthesis_score: 0,
                defence_score: 0,
                arena_score: 0,
                walls: walls,
                hero_donate_list: heroDonate
            };
            var selfSide = LocalNative.makeBattleSide(selfPlayer, {
                units: units,
                walls: walls,
                hero_donate_list: heroDonate,
                model_info: modelInfo,
                heros: selfHeros
            });
            var oppoSide = LocalNative.makeBattleSide(oppoPlayer, {
                units: units,
                walls: walls,
                hero_donate_list: heroDonate,
                model_info: modelInfo,
                soldiers: [],
                heros: []
            });
            var battleLog = LocalNative.ensureEnemyAttackBattleLog(selfPlayer, oppoPlayer);
            // Start the stock battle; finish comes from its destruction/timeout
            // conditions. A synthetic BR_DELAY_END_BATTLE record ended empty raids.
            var replayRecords = [[1, 0, 7]];
            return {
                stage: stageId,
                player: selfPlayer,
                self: selfSide,
                oppo: oppoSide,
                units: units,
                walls: walls,
                model_info: modelInfo,
                hero_donate_list: heroDonate,
                user_config: userConfig,
                // Stock ILD reads replay.seed, not the outer seed. Missing it
                // seeds DA.getRandom with undefined and poisons AI idle timers.
                replay: {seed: 1, records: replayRecords},
                records: replayRecords,
                seed: 1,
                pve_mode: 0,
                isPVE: true,
                isEnterEnemyAttackReplay: true,
                localNativeRaid: true,
                pveConfig: pveCfg || {},
                battleLogItem: battleLog,
                tempReplayBattleLog: battleLog,
                level_data: {
                    self: selfSide,
                    oppo: oppoSide,
                    units: units,
                    walls: walls,
                    hero_donate_list: heroDonate,
                    model_info: modelInfo,
                    user_config: userConfig
                },
                mapConfig: pveCfg || {}
            };
        };

        LocalNative.clearLoadingSafe = function() {
            try {
                if (typeof G_MainController !== 'undefined' && G_MainController) {
                    if (typeof G_MainController.clearLoadingTip === 'function')
                        G_MainController.clearLoadingTip();
                    if (typeof G_MainController.endLoading === 'function')
                        G_MainController.endLoading();
                }
            } catch (e1) {}
            try {
                if (typeof G_Director !== 'undefined' && G_Director &&
                    typeof G_Director.getRunningScene === 'function') {
                    var scene = G_Director.getRunningScene();
                    if (scene && scene.isChangingStage)
                        scene.isChangingStage = false;
                }
            } catch (e2) {}
        };

        // If battle init throws mid loading (missing oppo.player etc.), dismiss loading and
        // return to BUILD so start_replay_pve can finish instead of hanging forever.
        LocalNative.abortBattleEnterToHome = function(reason) {
            var session = LocalNative.replaySession;
            if (!session || session.returning) return false;
            session.returning = true;
            LocalNative.writeStatus({
                step: 'abort-battle-enter',
                reason: reason || null,
                stage: typeof GS_CURRENT_STAGE !== 'undefined' ? GS_CURRENT_STAGE : null
            });
            LocalNative.clearLoadingSafe();
            try {
                var player = typeof G_Player !== 'undefined' ? G_Player : null;
                var store = LocalNative.readRaw();
                var level = store && store.level ? store.level : LocalNative.defaultLevelDict();
                var build = typeof GS_STAGE_BUILD !== 'undefined' ? GS_STAGE_BUILD : 1;
                var battle = typeof GS_STAGE_BATTLE !== 'undefined' ? GS_STAGE_BATTLE : 2;
                var stageNow = typeof GS_CURRENT_STAGE !== 'undefined' ? GS_CURRENT_STAGE : null;
                if (stageNow === battle || stageNow !== build) {
                    if (player && typeof player.rpc_c_battle_to_home === 'function') {
                        player.rpc_c_battle_to_home(level);
                    } else if (player && typeof player.changeStageAndInit === 'function') {
                        try {
                            if (typeof GS_STAGE_NONE !== 'undefined')
                                GS_CURRENT_STAGE = GS_STAGE_NONE;
                        } catch (eNone) {}
                        player.changeStageAndInit(build, level);
                    }
                }
            } catch (eHome) {
                LocalNative.writeStatus({
                    step: 'abort-battle-enter-ERR',
                    error: String(eHome)
                });
            }
            LocalNative.scheduleOnRoot(function() {
                // Let the stock home initialization restore guide progress. Do not
                // finish an arbitrary process on the old/destroyed build controller.
                session.closed = true;
            }, 0.5);
            return true;
        };

        // Campaign PVE village layout is server-owned. Without captures, use a
        // labeled compatible stub (tutorial-known building families only).
        // SIDs start at 91001 so they never collide with home starter 1..5 / 301.
        // BEGIN USER AUTHORED PVE LAYOUTS
        LocalNative.editorPveLayouts = {"16":{"stage":16,"name":"\u7b2c 16 \u5173","source":"user-authored-layout","units":[{"sid":116001,"typeid":20103,"x":35,"y":35,"localNativeStableSid":true},{"sid":116002,"typeid":20401,"x":35,"y":30,"localNativeStableSid":true},{"sid":116003,"typeid":20503,"x":38,"y":30,"localNativeStableSid":true},{"sid":116004,"typeid":30202,"x":30,"y":38,"localNativeStableSid":true},{"sid":116005,"typeid":20303,"x":30,"y":35,"localNativeStableSid":true},{"sid":116006,"typeid":20201,"x":30,"y":32,"localNativeStableSid":true},{"sid":116007,"typeid":20901,"x":27,"y":32,"localNativeStableSid":true},{"sid":116008,"typeid":30103,"x":30,"y":28,"localNativeStableSid":true},{"sid":116009,"typeid":20702,"x":41,"y":36,"localNativeStableSid":true},{"sid":116010,"typeid":21002,"x":38,"y":39,"localNativeStableSid":true},{"sid":116011,"typeid":30403,"x":33,"y":39,"localNativeStableSid":true},{"sid":116012,"typeid":50601,"x":44,"y":34,"localNativeStableSid":true},{"sid":116013,"typeid":50701,"x":29,"y":41,"localNativeStableSid":true},{"sid":116014,"id":116014,"typeid":10501,"unit_type":105,"unit_level":1,"unit_mutateid":0,"lv":5,"xp":0,"state":2,"did":"116008","defense_id":"116008","rct":0,"aht":0,"aidx":-1,"skills":[10501,14801],"localNativeStableSid":true,"localNativeGuard":true}],"walls":[[3,32,36,0],[3,33,36,0],[3,34,36,0],[3,35,36,0],[3,36,35,0],[3,36,34,0],[3,36,33,0],[3,36,32,0],[3,31,31,0],[3,33,31,0],[3,34,31,0],[3,35,31,0],[3,31,35,0],[3,31,34,0],[3,31,33,0],[2,31,32,0],[2,31,36,0],[2,32,31,0],[2,36,36,0],[2,36,31,0],[1,32,30,0],[1,31,30,0],[1,31,29,0],[1,31,28,0],[3,31,27,0],[1,31,26,0],[3,31,25,0],[1,30,25,0],[1,29,25,0],[1,28,25,0],[3,27,25,0],[1,27,26,0],[1,27,27,0],[1,27,28,0],[2,27,29,0],[1,26,29,0],[1,25,29,0],[3,24,29,0],[1,24,30,0],[1,24,31,0],[1,24,32,0],[3,24,33,0],[1,26,33,0],[1,25,33,0],[2,27,33,0],[2,27,34,0],[2,27,35,0],[2,27,36,0],[2,27,37,0],[2,27,38,0],[3,27,39,0],[3,28,39,0],[3,29,39,0],[1,34,37,0],[1,34,38,0],[3,34,39,0],[3,34,40,0],[1,37,31,0],[1,38,31,0],[3,39,31,0],[1,39,30,0],[1,39,29,0],[1,39,28,0],[3,39,27,0],[2,32,27,0],[2,33,27,0],[2,34,27,0],[2,35,27,0],[2,36,27,0],[2,37,27,0],[2,38,27,0]]},"7":{"stage":7,"name":"\u7b2c 7 \u5173","source":"user-authored-layout","units":[{"sid":107001,"typeid":20101,"x":27,"y":27,"localNativeStableSid":true},{"sid":107002,"typeid":20401,"x":32,"y":24,"localNativeStableSid":true},{"sid":107003,"typeid":30101,"x":36,"y":30,"localNativeStableSid":true},{"sid":107004,"typeid":20301,"x":33,"y":33,"localNativeStableSid":true},{"sid":107005,"typeid":30301,"x":28,"y":36,"localNativeStableSid":true},{"sid":107006,"typeid":20501,"x":26,"y":32,"localNativeStableSid":true},{"sid":107007,"typeid":30201,"x":30,"y":28,"localNativeStableSid":true},{"sid":107008,"typeid":50701,"x":29,"y":32,"localNativeStableSid":true},{"sid":107009,"typeid":20301,"x":33,"y":29,"localNativeStableSid":true},{"sid":107010,"id":107010,"typeid":10501,"unit_type":105,"unit_level":1,"unit_mutateid":0,"lv":1,"xp":0,"state":2,"did":"107003","defense_id":"107003","rct":0,"aht":0,"aidx":-1,"skills":[10501],"localNativeStableSid":true,"localNativeGuard":true}],"walls":[[2,23,27,0],[2,23,28,0],[2,23,26,0],[2,23,25,0],[2,23,24,0],[2,23,23,0],[2,23,22,0],[2,24,22,0],[2,25,22,0],[2,26,22,0],[2,27,22,0],[2,28,22,0],[2,29,22,0],[2,29,23,0],[2,29,21,0],[2,30,21,0],[2,31,21,0],[2,32,21,0],[2,33,21,0],[2,33,22,0],[2,33,23,0],[2,33,24,0],[2,33,25,0],[2,33,26,0],[2,34,26,0],[2,34,27,0],[2,35,27,0],[2,36,27,0],[2,37,27,0],[2,37,28,0],[2,37,29,0],[2,37,30,0],[2,37,31,0],[2,36,31,0],[2,35,31,0],[2,34,31,0],[2,34,32,0],[2,34,33,0],[2,34,34,0],[2,33,34,0],[2,32,34,0],[2,31,34,0],[2,30,34,0],[3,30,33,0],[3,30,32,0],[3,30,31,0],[2,29,34,0],[2,29,35,0],[2,29,36,0],[2,29,37,0],[2,28,37,0],[2,27,37,0],[2,26,37,0],[2,25,37,0],[2,25,36,0],[2,25,35,0],[2,25,34,0],[2,23,29,0],[2,23,30,0],[2,23,31,0],[2,23,32,0],[2,23,33,0],[2,24,33,0],[2,25,33,0]]},"39":{"stage":39,"name":"\u4ece\u5357\u5230\u5317","source":"user-authored-layout","units":[{"sid":139001,"typeid":20101,"x":27,"y":27,"localNativeStableSid":true},{"sid":139002,"typeid":30106,"x":26,"y":31,"localNativeStableSid":true},{"sid":139003,"typeid":30806,"x":23,"y":31,"localNativeStableSid":true},{"sid":139004,"typeid":20406,"x":20,"y":33,"localNativeStableSid":true},{"sid":139005,"typeid":30205,"x":20,"y":28,"localNativeStableSid":true},{"sid":139006,"typeid":30106,"x":20,"y":25,"localNativeStableSid":true},{"sid":139007,"typeid":30306,"x":27,"y":22,"localNativeStableSid":true},{"sid":139008,"typeid":20206,"x":27,"y":18,"localNativeStableSid":true},{"sid":139009,"typeid":20705,"x":33,"y":24,"localNativeStableSid":true},{"sid":139010,"typeid":50601,"x":24,"y":22,"localNativeStableSid":true},{"sid":139011,"typeid":30806,"x":23,"y":20,"localNativeStableSid":true},{"sid":139012,"typeid":30106,"x":20,"y":20,"localNativeStableSid":true},{"sid":139013,"id":139013,"typeid":10709,"unit_type":107,"unit_level":9,"unit_mutateid":0,"lv":20,"xp":0,"state":2,"did":"139002","defense_id":"139002","rct":0,"aht":0,"aidx":-1,"skills":[10701,703304],"localNativeStableSid":true,"localNativeGuard":true},{"sid":139014,"id":139014,"typeid":10507,"unit_type":105,"unit_level":7,"unit_mutateid":0,"lv":20,"xp":0,"state":2,"did":"139006","defense_id":"139006","rct":0,"aht":0,"aidx":-1,"skills":[10501,15204],"localNativeStableSid":true,"localNativeGuard":true},{"sid":139015,"id":139015,"typeid":10401,"unit_type":104,"unit_level":1,"unit_mutateid":0,"lv":20,"xp":0,"state":2,"did":"139012","defense_id":"139012","rct":0,"aht":0,"aidx":-1,"skills":[10401,13301],"localNativeStableSid":true,"localNativeGuard":true}],"walls":[[3,23,27,0],[3,23,28,0],[3,24,28,0],[3,25,28,0],[3,26,28,0],[3,27,28,0],[3,28,28,0],[3,28,27,0],[3,28,26,0],[3,28,25,0],[3,28,24,0],[3,28,23,0],[3,27,23,0],[3,26,23,0],[3,25,23,0],[3,24,23,0],[3,23,23,0],[3,23,24,0],[3,23,25,0],[3,23,26,0],[2,17,33,0],[2,17,32,0],[2,17,31,0],[2,17,30,0],[2,17,29,0],[2,17,28,0],[2,17,27,0],[2,17,26,0],[2,17,25,0],[2,17,24,0],[2,17,23,0],[2,17,22,0],[2,17,34,0],[2,18,34,0],[2,19,34,0],[2,20,34,0],[2,21,34,0],[2,22,34,0],[2,23,34,0],[2,24,34,0],[2,26,34,0],[2,25,34,0],[2,27,34,0],[2,28,22,0],[2,28,21,0],[2,28,20,0],[2,28,19,0],[2,28,18,0],[2,28,17,0],[2,28,16,0],[2,28,15,0],[2,17,15,0],[2,18,15,0],[2,19,15,0],[2,20,15,0],[2,21,15,0],[2,22,15,0],[2,23,15,0],[2,24,15,0],[2,25,15,0],[2,26,15,0],[2,27,15,0],[3,18,22,0],[3,19,22,0],[3,20,22,0],[3,21,22,0],[3,22,22,0]]}};
        // END USER AUTHORED PVE LAYOUTS

        LocalNative.buildEditorPveVillage = function(stageId, gold, wood, layout) {
            var stored = layout || LocalNative.editorPveLayouts[String(stageId)];
            if (!stored) return null;
            var units = [], raw = JSON.parse(JSON.stringify(stored.units));
            for (var i = 0; i < raw.length; i++) {
                var record = raw[i];
                if (record.localNativeGuard) {
                    record.faction = typeof BATTLE_FACTION_DEFENDER !== 'undefined' ? BATTLE_FACTION_DEFENDER : 2;
                    units.push(record);
                } else {
                    units.push(LocalNative.unit(record.sid, record.typeid, record.x, record.y, record));
                    var family = Math.floor(record.typeid / 100);
                    if (family >= 505 && family <= 507 && data.unit_main[record.typeid] &&
                        data.unit_main[record.typeid].volume == null) data.unit_main[record.typeid].volume = 1;
                }
            }
            function putLoot(family, type, amount) {
                var chosen = null, home = null;
                for (var j = 0; j < units.length; j++) {
                    var unitFamily = Math.floor(units[j].typeid / 100);
                    if (unitFamily === family && !chosen) chosen = units[j];
                    if (unitFamily === 201 && !home) home = units[j];
                }
                chosen = chosen || home;
                if (!chosen) return;
                if (!chosen.sto || typeof chosen.sto !== 'object') chosen.sto = {};
                chosen.sto[type] = amount;
                chosen[type === 2 ? 'goldstorage' : 'woodstorage'] = amount;
                chosen[type === 2 ? 'gold_storage_cur' : 'wood_storage_cur'] = amount;
                chosen.currentStorage = (Number(chosen.currentStorage) || 0) + amount;
            }
            putLoot(205, 2, gold); putLoot(203, 1, wood);
            return {units: units, walls: JSON.parse(JSON.stringify(stored.walls)),
                source: stored.source};
        };

        // User reference screenshot, not recovered server coordinates. Stage 7 only.
        LocalNative.buildStageSevenVillage = function(gold, wood) {
            var specs = [[20101,26,27],[30101,30,27],[20301,33,23],
                [30201,24,33],[20201,34,28],[20501,34,33],
                [20401,39,30],[30301,29,33],[50701,19,34]];
            var units = [];
            for (var i = 0; i < specs.length; i++) {
                var spec = specs[i];
                units.push(LocalNative.unit(91001 + i, spec[0], spec[1], spec[2], {
                    localNativeStableSid: true
                }));
            }
            // Keep original stage loot totals, rather than the reference account's loot.
            units[5].sto = {2: gold}; units[5].goldstorage = gold;
            units[4].sto = {1: wood}; units[4].woodstorage = wood;
            units.push({sid: 91010, id: 91010, typeid: 10501, unit_type: 105,
                unit_level: 1, unit_mutateid: 0, lv: 1, xp: 0,
                state: 2, faction: 2, x: 18, y: 33, did: '91009',
                defense_id: '91009', rct: 0, aht: 0, aidx: -1,
                skills: [10501], localNativeStableSid: true});
            // The original flag lacks the anchor radius read by setAtDefensePos.
            if (typeof data !== 'undefined' && data.unit_main && data.unit_main[50701] &&
                data.unit_main[50701].volume == null) data.unit_main[50701].volume = 1;
            var walls = [], seen = {};
            function line(x1, y1, x2, y2) {
                var dx = x2 === x1 ? 0 : (x2 > x1 ? 1 : -1);
                var dy = y2 === y1 ? 0 : (y2 > y1 ? 1 : -1);
                for (;;) {
                    var key = x1 + ':' + y1;
                    if (!seen[key]) { walls.push([1, x1, y1, 0]); seen[key] = true; }
                    if (x1 === x2 && y1 === y2) break;
                    x1 += dx; y1 += dy;
                }
            }
            var outline = [[20,20],[27,20],[27,19],[35,19],[35,26],[40,26],
                [40,32],[37,32],[37,35],[30,35],[30,39],[24,39],[24,35],[20,35],[20,20]];
            for (var p = 1; p < outline.length; p++)
                line(outline[p-1][0], outline[p-1][1], outline[p][0], outline[p][1]);
            line(27,20,27,29); line(20,29,35,29); line(30,29,30,35);
            return {units: units, walls: walls, source: 'user-reference-stage7-2026-10-15'};
        };

        LocalNative.inferredPveVillageUnits = function(stageId, gold, wood) {
            gold = gold || 0;
            wood = wood || 0;
            return LocalNative.remapBattleUnitIds(LocalNative.normalizeReplayUnits([
                LocalNative.unit(1, 20101, 28, 28, {
                    currentStorage: gold + wood,
                    goldstorage: gold,
                    woodstorage: wood,
                    gold_storage_cur: gold,
                    wood_storage_cur: wood
                }),
                LocalNative.unit(2, 20301, 20, 28),
                LocalNative.unit(3, 20501, 36, 28),
                LocalNative.unit(4, 30101, 28, 36)
            ]), 91000);
        };

        LocalNative.installBattleLifeBarColors = function() {
            if (typeof Comp === 'undefined' || !Comp.BaseBattleController ||
                typeof UI === 'undefined' || !UI.LifeBarSimple) return;
            var proto = Comp.BaseBattleController.prototype;
            var originalInit = proto._initLifeBar;
            if (!originalInit || originalInit.__localFactionColors) return;
            // Keep stock pooling, geometry, visibility, hero level and icons.
            proto._initLifeBar = function() {
                var ret = originalInit.apply(this, arguments);
                var gc = DA.GETCGC();
                var bar = this.lifeBar;
                if (!bar) return ret;
                if (typeof GS_CURRENT_STAGE === 'undefined' ||
                    GS_CURRENT_STAGE !== GS_STAGE_BATTLE || !gc) return ret;
                var level = gc.level_data || {};
                var raid = gc.isEnterEnemyAttackReplay || level.isEnterEnemyAttackReplay ||
                    level.localNativeRaid;
                var friendlyFaction = raid ? BATTLE_FACTION_DEFENDER :
                    (gc.inReplayMode ? null : BATTLE_FACTION_ATTACKER);
                if (friendlyFaction == null) return ret;
                // G_Player.faction can be rebound by ensureBattleClients during live PVE.
                // Display ownership follows battle roles without changing combat factions.
                var faction = this.master.faction;
                if (faction !== BATTLE_FACTION_ATTACKER && faction !== BATTLE_FACTION_DEFENDER)
                    return ret;
                bar.isPlayerSide = faction === friendlyFaction;
                if (this.master.isHero === 1) {
                    // Hero init also selects the faction-dependent kind icon.
                    bar.init(bar.isPlayerSide, this.master.getComponent('ExpBar').getLevel(),
                        data.unit_main[this.master.typeid].hero_kind);
                } else {
                    bar.init(bar.isPlayerSide);
                }
                return ret;
            };
            proto._initLifeBar.__localFactionColors = true;
            LocalNative.writeStatus({step: 'battle-life-colors-installed'});
        };

        LocalNative.installManualHeroSkillGuard = function() {
            if (typeof Comp === 'undefined' || !Comp.HeroBattleController) return;
            var proto = Comp.HeroBattleController.prototype;
            if (proto.__localManualSkillGuard) return;
            var originalCast = proto.doCastActiveSkill, originalAuto = proto.tryOnceAutoAttack;
            var originalDelayed = proto._delayedInit;
            function liveOwnHero(bc) {
                var gc = DA.GETCGC();
                if (GS_CURRENT_STAGE !== GS_STAGE_BATTLE || !gc || gc.inReplayMode || !bc.master) return null;
                var choices = gc.UnitChoiceList || [];
                for (var i = 0; i < choices.length; i++)
                    if (choices[i].hero === bc.master && choices[i].isSelfHero !== false) return gc;
                if (typeof G_Player !== 'undefined' && bc.master.faction === G_Player.faction) return gc;
                return null;
            }
            proto.doCastActiveSkill = function(skillID, targetID, auto) {
                var gc = liveOwnHero(this);
                if (!gc) return originalCast.apply(this, arguments);
                var automatic = typeof gc.isAutoAttack === 'function' && gc.isAutoAttack() === true;
                if (!automatic && !this.operatePanel) {
                    var panel = null;
                    try {
                        panel = new UI.HeroOpratePanel(this);
                        panel.init();
                        this.operatePanel = panel;
                    } catch (ePanel) {
                        try { if (panel) panel.destroy(); } catch (eDestroy) {}
                        LocalNative.writeStatus({step: 'manual-skill-panel-ERR', sid: this.master.sid, error: String(ePanel)});
                        return;
                    }
                }
                LocalNative.writeStatus({step: 'hero-skill-dispatch', sid: this.master.sid,
                    skill: skillID, auto: automatic, panel: !!this.operatePanel});
                return originalCast.call(this, skillID, targetID, automatic);
            };
            proto.tryOnceAutoAttack = function() {
                var gc = liveOwnHero(this);
                if (gc && !(typeof gc.isAutoAttack === 'function' && gc.isAutoAttack() === true)) return;
                return originalAuto.apply(this, arguments);
            };
            proto._delayedInit = function() {
                if (liveOwnHero(this) && this.operatePanel) return;
                return originalDelayed.apply(this, arguments);
            };
            proto.__localManualSkillGuard = true;
        };

        // Friend-target actives (破釜沉舟 etc.) and post-kill seek: sync cast target and
        // keep ThreatSystem from throwing when getUnit returns null.
        LocalNative.syncBattleSkillTarget = function(bc, targetID, purpose) {
            if (!bc || targetID == null || targetID === undefined) return;
            if (typeof bc.setTargetID === 'function') {
                try {
                    if (purpose === undefined) bc.setTargetID(targetID);
                    else bc.setTargetID(targetID, purpose);
                    return;
                } catch (eSet) {}
            }
            bc.targetID = targetID;
        };

        LocalNative.installActiveSkillSeekFix = function() {
            if (typeof Comp !== 'undefined' && Comp.ThreatSystem) {
                var tproto = Comp.ThreatSystem.prototype;
                // applyCost calls changeLife(cost_life) without an attacker. That
                // must not enter onHit: an exception there aborts skill completion.
                if (!tproto.__localThreatHitGuard && typeof tproto.onHit === 'function') {
                    var originalThreatHit = tproto.onHit;
                    tproto.onHit = function(cid, value) {
                        var obj = cid != null ? G_UnitManager.getUnit(cid) : null;
                        if (!obj || typeof obj.canBeFound !== 'function' ||
                            typeof obj.getComponent !== 'function') {
                            if (!this.__localInvalidHitLogged) {
                                this.__localInvalidHitLogged = true;
                                LocalNative.writeStatus({step: 'threat-hit-invalid-source',
                                    cid: cid == null ? null : cid, value: value,
                                    sourceType: obj ? typeof obj : 'missing'});
                            }
                            return;
                        }
                        return originalThreatHit.apply(this, arguments);
                    };
                    tproto.__localThreatHitGuard = true;
                }
                if (!tproto.__localThreatNullGuard) {
                    ['getNearestHighestThreatAttackableTarget', 'getNearestHighestThreatTarget',
                        'getNearestTarget', 'getTargetConsideringLeaderMode'].forEach(function(name) {
                        var orig = tproto[name];
                        if (typeof orig !== 'function') return;
                        tproto[name] = function() {
                            try {
                                return orig.apply(this, arguments);
                            } catch (eThreat) {
                                try { if (typeof this.unLock === 'function') this.unLock(); } catch (eUnlock) {}
                                try { this.curTarget = null; } catch (eCur) {}
                                try {
                                    LocalNative.writeStatus({
                                        step: 'threat-seek-ERR', fn: name, error: String(eThreat)
                                    });
                                } catch (eLog) {}
                                return null;
                            }
                        };
                    });
                    tproto.__localThreatNullGuard = true;
                }
            }

            if (typeof Comp !== 'undefined' && Comp.StaticBattleController) {
                var sproto = Comp.StaticBattleController.prototype;
                if (!sproto.__localActiveSkillTargetSync) {
                    var origUserTarget = sproto.onUserCastSkillToTarget;
                    var origRealCast = sproto._realDoCastSkill;
                    if (typeof origUserTarget === 'function') {
                        sproto.onUserCastSkillToTarget = function(targetID, skillID) {
                            var self = this;
                            var prevSet = this.__setNextSkill;
                            if (typeof prevSet === 'function') {
                                this.__setNextSkill = function(sid, tid) {
                                    LocalNative.syncBattleSkillTarget(self, targetID);
                                    return prevSet.call(self, sid, tid !== undefined ? tid : targetID);
                                };
                            }
                            try {
                                return origUserTarget.call(this, targetID, skillID);
                            } finally {
                                if (typeof prevSet === 'function') this.__setNextSkill = prevSet;
                            }
                        };
                    }
                    if (typeof origRealCast === 'function') {
                        sproto._realDoCastSkill = function(skillID, targetID) {
                            LocalNative.syncBattleSkillTarget(this, targetID);
                            return origRealCast.apply(this, arguments);
                        };
                    }
                    sproto.__localActiveSkillTargetSync = true;
                }
            }

            if (typeof Comp !== 'undefined' && Comp.HeroBattleController) {
                var hproto = Comp.HeroBattleController.prototype;
                if (!hproto.__localHeroSkillTargetSync) {
                    var origHeroTarget = hproto.onUserCastSkillToTarget;
                    var origChangeAttack = hproto.onEventUserChangeToAttack;
                    if (typeof origHeroTarget === 'function') {
                        hproto.onUserCastSkillToTarget = function(targetID, skillID) {
                            var requested = targetID;
                            var ret = origHeroTarget.apply(this, arguments);
                            try {
                                var script = this.director && typeof this.director.poll === 'function' &&
                                    this.director.poll();
                                if (script && script.type === BATTLE_SCRIPT_TYPE_ATTACK) {
                                    var tid = script.targetID != null ? script.targetID : requested;
                                    LocalNative.syncBattleSkillTarget(this, tid, script.purpose);
                                } else if (requested != null &&
                                    (this.targetID == null || this.targetID === undefined)) {
                                    LocalNative.syncBattleSkillTarget(this, requested);
                                }
                            } catch (eHero) {}
                            return ret;
                        };
                    }
                    if (typeof origChangeAttack === 'function') {
                        hproto.onEventUserChangeToAttack = function() {
                            try {
                                var script = this.director && typeof this.director.poll === 'function' &&
                                    this.director.poll();
                                if (script && script.targetID != null)
                                    LocalNative.syncBattleSkillTarget(this, script.targetID, script.purpose);
                            } catch (eChange) {}
                            return origChangeAttack.apply(this, arguments);
                        };
                    }
                    hproto.__localHeroSkillTargetSync = true;
                }
            }

            LocalNative.writeStatus({step: 'active-skill-seek-fix-installed'});
        };

        LocalNative.prepareHeroBattleSkills = function(hero) {
            var cfg = data.unit_battle && data.unit_battle[hero.typeid];
            var mutate = Number(hero.unit_mutateid == null ? hero.mutateid : hero.unit_mutateid) || 0;
            var base = cfg && cfg.skill_nums && cfg.skill_nums[mutate];
            if (!base || !base.length) throw new Error('Missing hero basic attack ' + hero.typeid);
            var skills = [], seen = {};
            function add(id) {
                id = Number(id);
                if (!(id > 0) || !data.skill_data[id]) throw new Error('Invalid hero battle skill ' + id);
                if (!seen[id]) { seen[id] = true; skills.push(id); }
            }
            for (var b = 0; b < base.length; b++) add(base[b]);
            var slots = hero.skill_slots || [];
            for (var s = 0; s < slots.length; s++) {
                if (Number(slots[s].lv) > 0) add(Number(slots[s].sid) * 100 + Number(slots[s].lv));
            }
            hero.skills = skills;
            return hero;
        };

        LocalNative.collectAttackHerosForPve = function(level, selfPlayer) {
            var attackState = (typeof HERO_STATE_ATTACK !== 'undefined') ? HERO_STATE_ATTACK : 1;
            var raw = (level && level.heros && level.heros.length) ? level.heros :
                ((selfPlayer && selfPlayer.heros && selfPlayer.heros.length) ? selfPlayer.heros :
                    LocalNative.defaultHeros());
            var out = [];
            for (var i = 0; i < raw.length; i++) {
                var src = raw[i];
                if (!src) continue;
                var h = {};
                for (var k in src) {
                    if (Object.prototype.hasOwnProperty.call(src, k)) h[k] = src[k];
                }
                if (h.typeid != null) {
                    h.unit_type = Math.floor(Number(h.typeid) / 100);
                    h.unit_level = Number(h.typeid) % 100;
                }
                if (h.state == null) h.state = attackState;
                if (h.life == null || Number(h.life) <= 0) h.life = 400;
                if (h.aidx == null && h.attack_index != null) h.aidx = h.attack_index;
                if (h.unit_mutateid == null) h.unit_mutateid = h.mutateid || 0;
                if (Number(h.state) === attackState || h.attack_index)
                    out.push(LocalNative.prepareHeroBattleSkills(h));
            }
            if (!out.length && raw.length) {
                var first = {};
                var src0 = raw[0];
                for (var k0 in src0) {
                    if (Object.prototype.hasOwnProperty.call(src0, k0)) first[k0] = src0[k0];
                }
                first.state = attackState;
                if (first.life == null || Number(first.life) <= 0) first.life = 400;
                out.push(LocalNative.prepareHeroBattleSkills(first));
            }
            return out;
        };

        // rpc_s_enter_pve_battle → rpc_c_enter_battle. Live attack (no replay).
        // Stock trainer sds and battle choices both use unit TYPE (114), not typeid (11401).
        LocalNative.collectBattleSoldiers = function(level) {
            var out = {}, units = level.units || [], storage = (level.player || {}).soldier_storage || {};
            for (var i = 0; i < units.length; i++) {
                var soldiers = units[i].sds || {};
                for (var key in soldiers) {
                    if (!Object.prototype.hasOwnProperty.call(soldiers, key)) continue;
                    var type = Number(key), num = Number(soldiers[key]);
                    if (!(type > 0) || type !== Math.floor(type) || !isFinite(num) || num < 1) continue;
                    // Resource workers belong to the city, never the deploy tray.
                    if (Object.prototype.hasOwnProperty.call(storage, key)) continue;
                    out[type] = (out[type] || 0) + Math.floor(num);
                }
            }
            return out;
        };

        LocalNative.handleDispatchSoldier = function(params) {
            var gc = LocalNative.getBattleController();
            var stock = LocalNative.battleSoldierStock;
            var typeid = Number(params && params.soldier_type), type = Math.floor(typeid / 100);
            if (typeof GS_CURRENT_STAGE === 'undefined' || GS_CURRENT_STAGE !== GS_STAGE_BATTLE ||
                !gc || gc.inReplayMode || gc.battleFinished || !stock ||
                !isFinite(typeid) || typeid !== type * 100 + 1 || !(stock[type] > 0)) return false;
            try {
                // Each stock UnitProxy RPC represents ONE successful placement. Persist now,
                // so quitting, defeat and process death cannot refund a dispatched soldier.
                var store = LocalNative.readRaw(), units = store.level.units || [];
                for (var i = 0; i < units.length; i++) {
                    var camp = units[i];
                    if (!camp.sds || !(Number(camp.sds[type]) >= 1)) continue;
                    camp.sds[type] = Number(camp.sds[type]) - 1;
                    var post = camp.ep && camp.ep[type];
                    var elite = SOLDIER_LEVEL_ELITE, veteran = SOLDIER_LEVEL_VETERAN;
                    if (post && Number(post[elite]) > 0) post[elite] = Number(post[elite]) - 1;
                    else if (post && Number(post[veteran]) > 0) post[veteran] = Number(post[veteran]) - 1;
                    LocalNative.writeRaw(store);
                    stock[type]--;
                    LocalNative.writeStatus({step: 'dispatch-soldier-saved', typeid: typeid,
                        camp: camp.sid, remaining: stock[type]});
                    return true;
                }
            } catch (e) {
                LocalNative.writeStatus({step: 'dispatch-soldier-ERR', error: String(e)});
            }
            return false;
        };

        // Arena server replacement. Stock UI and ArenaBattleSystem own combat.
        LocalNative.arenaNow = function() {
            return Math.floor(typeof DA !== 'undefined' && DA.getSystemCurrentTimeSec ?
                DA.getSystemCurrentTimeSec() : Date.now() / 1000);
        };
        LocalNative.ensureArenaState = function(level) {
            var now = LocalNative.arenaNow(), begin = GlobalDefine.ARENA_BEGAN_TIMESTAMP;
            var week = GlobalDefine.ARENA_ROUND_PERIOD, rounds = GlobalDefine.ARENA_ROUNDS_PER_SEASON;
            var elapsed = Math.max(0, now - begin);
            var season = Math.floor(elapsed / (week * rounds)) + 1;
            var round = Math.floor(elapsed % (week * rounds) / week) + 1;
            var state = level.player.arena_state;
            function fresh() {
                return {season_num: season, round_num: round, group: 1, score: 0,
                    qualifying_atk_cnt: 0, qualifying_win_cnt: 0,
                    phase: GlobalDefine.ARENA_PHASE_REGULAR_ROUND};
            }
            if (!state || !state.season || !Array.isArray(state.rewards))
                state = level.player.arena_state = {season: fresh(), rewards: []};
            var old = state.season;
            if (season > old.season_num || (season === old.season_num && round > old.round_num)) {
                // No historical rank claims or fabricated missed-week rewards.
                if (old.group > 1 || old.score > 0) {
                    state.rewards.push(data.arena_weekly_reward[old.group].group_reward);
                    if (season > old.season_num)
                        state.rewards.push(data.arena_monthly_reward[old.group].group_reward);
                }
                if (season > old.season_num) {
                    state.season = fresh();
                    delete level.localArenaPromotionFailure;
                } else old.round_num = round;
            }
            return state;
        };
        LocalNative.arenaAttackCounter = function(level) {
            var id = GlobalDefine.ARENA_ATTACK_PERIOD_ID, cfg = data.period_control[id];
            if (!cfg) throw new Error('Missing arena attack period');
            var all = level.player.event_counters || (level.player.event_counters = {});
            var group = all[cfg.period_type] || (all[cfg.period_type] = {});
            var counter = group[id] || (group[id] = {c: 0, t: 0});
            var now = LocalNative.arenaNow(), max = GlobalDefine.ARENA_ATTACK_MAX_COUNT;
            var period = GlobalDefine.ARENA_ATTACK_RECOVER_PERIOD;
            var d = counter.d || (counter.d = {attack_count: max, ltt: now});
            if (d.attack_count == null) d.attack_count = max;
            if (d.ltt == null) d.ltt = now;
            var recovered = Math.max(0, Math.floor((now - d.ltt) / period));
            d.attack_count = Math.min(max, Number(d.attack_count) + recovered);
            if (d.attack_count >= max) d.ltt = now;
            else if (recovered) d.ltt += recovered * period;
            return counter;
        };
        LocalNative.syncArenaState = function(player, level) {
            LocalNative.syncQuestEventRecorder(player, level);
            var state = JSON.parse(JSON.stringify(level.player.arena_state));
            if (player.rpc_c_sync_arena_state) player.rpc_c_sync_arena_state({state: state});
            else {
                var arena = player.getComponent && player.getComponent('Arena');
                if (arena && arena._setState) arena._setState(state);
            }
            player.arena_score = Number(level.player.arena_score) || 0;
        };
        LocalNative.buildArenaBattleDict = function(level) {
            var heroes = [], raw = level.heros || [];
            var attackState = typeof HERO_STATE_ATTACK !== 'undefined' ? HERO_STATE_ATTACK : 1;
            for (var i = 0; i < raw.length; i++) {
                if (Number(raw[i].state) !== attackState) continue;
                var hero = JSON.parse(JSON.stringify(raw[i]));
                if (hero.typeid != null) {
                    hero.unit_type = Math.floor(Number(hero.typeid) / 100);
                    hero.unit_level = Number(hero.typeid) % 100;
                }
                if (!hero.unit_type || !hero.unit_level) throw new Error('Invalid arena hero type');
                heroes.push(LocalNative.prepareHeroBattleSkills(hero));
            }
            heroes.sort(function(a, b) {
                return (Number(a.aidx != null ? a.aidx : a.attack_index) || 0) -
                    (Number(b.aidx != null ? b.aidx : b.attack_index) || 0);
            });
            if (!heroes.length) throw new Error('Arena requires an attack hero');
            var own = {}, mirror = {}, positions = {attacker: {}, defender: {}};
            for (var j = 0; j < heroes.length; j++) {
                var h = heroes[j], index = j + 1;
                // Hero data is deeply copied before stock init mutates faction/cid/id.
                own[index] = JSON.parse(JSON.stringify(h));
                mirror[index] = JSON.parse(JSON.stringify(h));
                own[index].sid = 'local-arena-self-' + index;
                mirror[index].sid = 'local-arena-oppo-' + index;
                // Home garrison references are placement metadata, not combat
                // attributes. No city building exists inside the arena.
                own[index].did = own[index].defense_id = 0;
                mirror[index].did = mirror[index].defense_id = 0;
                delete own[index].cid; delete mirror[index].cid;
                delete own[index].id; delete mirror[index].id;
                // Server-provided deployment slots on the existing stock map.
                // idx++ leaves the old index on the operand stack: slot 0
                // is required by the native dispatcher.
                positions.attacker[j] = [24, 26 + j];
                positions.defender[j] = [36, 26 + j];
            }
            var selfPlayer = JSON.parse(JSON.stringify(level.player));
            var oppoPlayer = JSON.parse(JSON.stringify(level.player));
            selfPlayer.stage = selfPlayer.pveStage = 0;
            // usePVEUI gates the arena's five-second auto-start on a truthy
            // stage. Reuse an empty stock stage row, with no village or quests.
            oppoPlayer.stage = oppoPlayer.pveStage = 3000000;
            oppoPlayer.pve_mode = PVE_BATTLE_MODE_ARENA;
            oppoPlayer.nickname = selfPlayer.nickname + '\uFF08\u955C\u50CF\uFF09';
            oppoPlayer.account = oppoPlayer.account_id = oppoPlayer.accountID = 'local-arena-opponent';
            oppoPlayer.heros = []; oppoPlayer.soldiers = [];
            var rm = LocalNative.getResourceManager();
            var self = LocalNative.makeBattleSide(selfPlayer, {heros: [], soldiers: [],
                units: [], walls: [], league_tech: [], hero_donate_list: [],
                gold: rm.Res[2], wood: rm.Res[1], max_gold: rm.maxRes[2], max_wood: rm.maxRes[1],
                user_config: level.user_config || {}, first_time_stage: 0});
            var oppo = LocalNative.makeBattleSide(oppoPlayer, {heros: [], soldiers: [],
                units: [], walls: [], hero_donate_list: [], model_info: {}});
            return {self: self, oppo: oppo, units: [], walls: [], model_info: {},
                hero_donate_list: [], choices: [], replay: null, isEnterEnemyAttackReplay: false,
                pve_mode: PVE_BATTLE_MODE_ARENA, localNativeArena: true,
                arena: {self: {heros: own}, oppo: {heros: mirror}, hero_positions: positions},
                source: 'stock-arena-player-mirror'};
        };
        LocalNative.traceArenaBattleStart = function(gc) {
            var session = LocalNative.arenaSession;
            if (!session || session.closed || session.started || !gc.battleStarted ||
                gc.__localArenaSession !== session) return;
            var system = gc.battleSystem;
            if (!system) throw new Error('Missing stock ArenaBattleSystem');
            var store = JSON.parse(JSON.stringify(LocalNative.readRaw()));
            if (!store.level.localArenaBattle || store.level.localArenaBattle.id !== session.id)
                throw new Error('Arena entry receipt mismatch');
            store.level.localArenaBattle.started = true;
            LocalNative.writeRaw(store);
            session.started = true;
            function team(params) {
                return params.map(function(p) {
                    var unit = G_UnitManager.getUnit(p.cid);
                    var eq = unit && unit.getComponent('HeroEquipment');
                    return {cid: p.cid, typeid: p.typeid, lv: p.lv, skills: p.skills,
                        eqp: eq && eq.eqp, gift: p.gift, mutate: p.unit_mutateid,
                        faction: unit && unit.faction};
                });
            }
            LocalNative.writeStatus({step: 'arena-native-start', id: session.id,
                mode: gc.getPVEMode(), arenaMenu: gc.menu === gc.menuArena,
                attackers: team(system.attackerHeroParams), defenders: team(system.defenderHeroParams)});
            sys.localStorage.setItem('dino.local.arena.probe.start', JSON.stringify({
                id: session.id, mode: gc.getPVEMode(), arenaMenu: gc.menu === gc.menuArena,
                attackers: team(system.attackerHeroParams), defenders: team(system.defenderHeroParams)}));
        };
        LocalNative.traceArenaInit = function(gc) {
            var session = LocalNative.arenaSession;
            if (!session || gc.__localArenaSession !== session) return;
            var stage = gc.getStageClient(), system = gc.battleSystem;
            sys.localStorage.setItem('dino.local.arena.probe.init', JSON.stringify({
                id: session.id, mode: gc.getPVEMode(), stage: stage && stage.pveStage,
                usePVEUI: stage && stage.usePVEUI(), arenaMenu: gc.menu === gc.menuArena,
                hasSystem: !!system, defenders: system && system.defenderHeroParams.map(function(p) {
                    var u = G_UnitManager.getUnit(p.cid);
                    return {cid: p.cid, typeid: p.typeid, did: p.did,
                        actualDefenseID: u && u.getDefenseID(), faction: u && u.faction};
                })}));
        };
        LocalNative.handleArenaRpc = function(player, method) {
            var committed = false;
            try {
                if (GS_CURRENT_STAGE !== GS_STAGE_BUILD) throw new Error('Arena requires home stage');
                if (method === 'rpc_s_enter_arena_battle' && LocalNative.arenaSession &&
                    !LocalNative.arenaSession.closed) return false;
                LocalNative.tryDumpAndSave();
                var store = JSON.parse(JSON.stringify(LocalNative.readRaw())), level = store.level;
                var state = LocalNative.ensureArenaState(level);
                if (method === 'rpc_s_gain_arena_rewards') {
                    var rewards = state.rewards.slice(), input = [];
                    for (var i = 0; i < rewards.length; i++)
                        input = input.concat(LocalNative.collectQuestPutinRewards(
                            level, rewards[i], Number(level.player.level) || 1));
                    state.rewards = [];
                    LocalNative.writeRaw(store);
                    committed = true;
                    LocalNative.syncQuestPackageAndWallet(player, level);
                    LocalNative.syncArenaState(player, level);
                    player.rpc_c_gain_arena_rewards_ans({state: JSON.parse(JSON.stringify(state)), input_data: input});
                    return true;
                }
                if (method !== 'rpc_s_enter_arena_battle') throw new Error('Unsupported arena request');
                if (LocalNative.readScoutHeadquartersLevel(level) < GlobalDefine.ARENA_MIN_HOME_BASE_LEVEL)
                    throw new Error('Arena requires home base level 5');
                if (level.localArenaPromotionFailure)
                    throw new Error('\u664B\u7EA7\u5931\u8D25\u7684\u539F\u7248\u6263\u5206\u6570\u503C\u5C1A\u5F85\u6838\u5BF9\uFF0C\u5F53\u524D\u79EF\u5206\u5DF2\u4FDD\u7559');
                var now = LocalNative.arenaNow(), s = state.season;
                var roundBegin = GlobalDefine.ARENA_BEGAN_TIMESTAMP +
                    ((s.season_num - 1) * GlobalDefine.ARENA_ROUNDS_PER_SEASON + s.round_num - 1) *
                    GlobalDefine.ARENA_ROUND_PERIOD;
                if (now <= roundBegin + 600) throw new Error('arena_block');
                var counter = LocalNative.arenaAttackCounter(level);
                if (counter.d.attack_count < 1) throw new Error('arena_no_times');
                var dict = LocalNative.buildArenaBattleDict(level);
                counter.d.attack_count--;
                var id = (Number(level.localArenaSequence) || 0) + 1;
                level.localArenaSequence = id;
                level.localArenaBattle = {id: id, season: s.season_num, round: s.round_num,
                    group: s.group, phase: s.phase, completed: false};
                LocalNative.writeRaw(store);
                committed = true;
                LocalNative.syncArenaState(player, level);
                player.rpc_c_enter_arena_battle_ans({state: JSON.parse(JSON.stringify(state))});
                LocalNative.pveSession = null; LocalNative.pvpSession = null;
                LocalNative.battleSoldierStock = null;
                LocalNative.arenaSession = {id: id, player: player, closed: false,
                    completed: false, returning: false};
                player.rpc_c_enter_battle(dict);
                LocalNative.writeStatus({step: 'arena-enter', id: id,
                    heroes: Object.keys(dict.arena.self.heros).length, attacks: counter.d.attack_count,
                    source: dict.source});
                return true;
            } catch (e) {
                try {
                    var saved = LocalNative.readRaw().level;
                    LocalNative.ensureArenaState(saved);
                    player.rpc_c_enter_arena_battle_ans({state: saved.player.arena_state});
                } catch (ignore) {}
                LocalNative.writeStatus({step: 'arena-request-ERR', method: method,
                    committed: committed, error: String(e)});
                if (typeof G_MainController !== 'undefined') G_MainController.setNotice(String(e.message || e));
                return false;
            }
        };
        LocalNative.completeArenaBattle = function(player, early) {
            var session = LocalNative.arenaSession, gc = LocalNative.getBattleController();
            if (!session || session.closed || session.completed || !gc ||
                gc.__localArenaSession !== session) return false;
            var store = JSON.parse(JSON.stringify(LocalNative.readRaw())), level = store.level;
            var receipt = level.localArenaBattle;
            if (!receipt || receipt.id !== session.id || receipt.completed) return false;
            if (!early && !gc.battleFinished) return false;
            var win = !early && !!(gc.battleResult && gc.battleResult.isWinner);
            var state = LocalNative.ensureArenaState(level), s = state.season;
            // Never carry a stale battle into a different season or round.
            var sameRound = receipt.season === s.season_num && receipt.round === s.round_num;
            var score = 0;
            if (sameRound && receipt.phase === GlobalDefine.ARENA_PHASE_REGULAR_ROUND) {
                score = win ? 10 : 5;
                s.score += score;
                if (s.group < GlobalDefine.ARENA_TOP_GROUP && s.score >= 100) {
                    s.score = 100; s.phase = GlobalDefine.ARENA_PHASE_QUALIFYING_ROUND;
                    s.qualifying_atk_cnt = 0; s.qualifying_win_cnt = 0;
                }
            } else if (sameRound) {
                s.qualifying_atk_cnt++;
                if (win) s.qualifying_win_cnt++;
                if (s.qualifying_win_cnt >= 3) {
                    s.group = Math.min(GlobalDefine.ARENA_TOP_GROUP, s.group + 1);
                    s.score = 0; s.phase = GlobalDefine.ARENA_PHASE_REGULAR_ROUND;
                    s.qualifying_atk_cnt = 0; s.qualifying_win_cnt = 0;
                } else if (s.qualifying_atk_cnt >= GlobalDefine.ARENA_QUALIFYING_MAX_ATTACK_COUNT) {
                    // Original help gives no numeric deduction. Preserve the
                    // earned score and stop this branch instead of inventing it.
                    level.localArenaPromotionFailure = {id: session.id, group: s.group,
                        score: s.score, wins: s.qualifying_win_cnt, attacks: s.qualifying_atk_cnt};
                }
            }
            level.player.arena_score = s.group * GlobalDefine.ARENA_RANK_SCORE_GROUP_MULTIPLIER + s.score;
            var result = {star_num: win ? 3 : 0, starNum: win ? 3 : 0, isWinner: win,
                win_gold: 0, win_wood: 0, flower: 0, score: score, input_gains: [],
                exp_add: {}, enemy_id: 'local-arena-opponent',
                arena_state: JSON.parse(JSON.stringify(state))};
            receipt.completed = true; receipt.result = result;
            LocalNative.writeRaw(store);
            session.completed = true;
            LocalNative.syncArenaState(player, level);
            if (!early) player.rpc_c_battle_result(result);
            LocalNative.writeStatus({step: 'arena-result', id: session.id, win: win,
                early: !!early, score: score, group: s.group, total: s.score});
            return true;
        };
        LocalNative.arenaBattleToHome = function(player, early) {
            var session = LocalNative.arenaSession;
            if (!session || session.closed || session.returning) return false;
            if (!session.completed) LocalNative.completeArenaBattle(player, true);
            session.returning = true;
            try {
                var store = JSON.parse(JSON.stringify(LocalNative.readRaw()));
                LocalNative.ensureArenaState(store.level);
                LocalNative.writeRaw(store);
                player.rpc_c_battle_to_home(store.level);
                session.closed = true;
                LocalNative.writeStatus({step: 'arena-home', id: session.id, early: !!early});
                return true;
            } catch (e) {
                session.returning = false;
                LocalNative.writeStatus({step: 'arena-home-ERR', error: String(e)});
                return false;
            }
        };

        LocalNative.buildPveBattleDict = function(stageId, scoutLayout) {
            stageId = parseInt(stageId, 10);
            if (!(stageId > 0)) stageId = 1;
            LocalNative.tryDumpAndSave();
            var store = LocalNative.readRaw();
            var level = store && store.level ? store.level : LocalNative.defaultLevelDict();
            var selfPlayer = level.player || LocalNative.defaultPlayer();
            if (scoutLayout) selfPlayer = JSON.parse(JSON.stringify(selfPlayer));
            if (!scoutLayout) LocalNative.ensureAvailableStages(selfPlayer, 'pve-enter');
            var stageEntry = selfPlayer.availableStages &&
                (selfPlayer.availableStages[stageId] || selfPlayer.availableStages[String(stageId)]);
            var loot = scoutLayout ? [0, 0] : ((stageEntry && stageEntry.length >= 2) ? stageEntry :
                LocalNative.readPveStageLoot(stageId));
            var gold = loot[0] || 0;
            var wood = loot[1] || 0;
            var referenceVillage = typeof LocalNative.buildEditorPveVillage === 'function'
                ? LocalNative.buildEditorPveVillage(stageId, gold, wood, scoutLayout) : null;
            if (!referenceVillage && stageId === 7)
                referenceVillage = LocalNative.buildStageSevenVillage(gold, wood);
            var units = referenceVillage ? referenceVillage.units :
                LocalNative.inferredPveVillageUnits(stageId, gold, wood);
            var villageWalls = referenceVillage ? referenceVillage.walls : [];
            var attackHeros = LocalNative.collectAttackHerosForPve(level, selfPlayer);
            var attackSoldiers = LocalNative.collectBattleSoldiers(level);
            LocalNative.battleSoldierStock = JSON.parse(JSON.stringify(attackSoldiers));
            var oppoPlayer = {
                nickname: 'PVE-' + stageId,
                level: 1,
                account: 'local-pve-' + stageId,
                account_id: 'local-pve-' + stageId,
                accountID: 'local-pve-' + stageId,
                stage: stageId,
                pve_mode: 0,
                diamond: 0,
                spirit: 0,
                exp: 0,
                experience: 0,
                soldiers: [],
                heros: [],
                buffs: [],
                walls: villageWalls,
                hero_donate_list: [],
                model_info: {},
                league_id: 0,
                synthesis_score: 0,
                defence_score: 0,
                arena_score: 0
            };
            var selfSide = LocalNative.makeBattleSide(selfPlayer, {
                gold: LocalNative.getResourceManager().Res[2],
                wood: LocalNative.getResourceManager().Res[1],
                max_gold: LocalNative.getResourceManager().maxRes[2],
                max_wood: LocalNative.getResourceManager().maxRes[1],
                heros: attackHeros,
                soldiers: attackSoldiers,
                league_tech: [],
                buffs: selfPlayer.buffs || [],
                hero_donate_list: level.hero_donate_list || [],
                user_config: level.user_config || {},
                first_time_stage: 0
            });
            var oppoSide = LocalNative.makeBattleSide(oppoPlayer, {
                units: units,
                walls: villageWalls,
                hero_donate_list: [],
                model_info: {},
                soldiers: [],
                heros: []
            });
            if (oppoSide.player) {
                oppoSide.player.stage = stageId;
                oppoSide.player.pve_mode = 0;
                oppoSide.player.walls = villageWalls;
                oppoSide.player.hero_donate_list = [];
                oppoSide.player.model_info = {};
            }
            return {
                self: selfSide,
                oppo: oppoSide,
                units: units,
                walls: villageWalls,
                hero_donate_list: [],
                model_info: {},
                choices: [],
                isEnterEnemyAttackReplay: false,
                localNativeRaid: false,
                localNativePve: true,
                localNativePveStage: stageId,
                pve_mode: 0,
                isPVE: true,
                replay: null,
                source: referenceVillage ? referenceVillage.source : 'local-inferred-compatible-pve'
            };
        };

        // BEGIN SCOUT LEVEL POOL
        LocalNative.scoutLevelPool = {"policy":{"mode":"all","headquartersDelta":1},"levels":[{"id":"scout-7","headquartersLevel":1,"layout":{"stage":7,"name":"\u7b2c 7 \u5173","source":"user-authored-layout","units":[{"sid":107001,"typeid":20101,"x":27,"y":27,"localNativeStableSid":true},{"sid":107002,"typeid":20401,"x":32,"y":24,"localNativeStableSid":true},{"sid":107003,"typeid":30101,"x":36,"y":30,"localNativeStableSid":true},{"sid":107004,"typeid":20301,"x":33,"y":33,"localNativeStableSid":true},{"sid":107005,"typeid":30301,"x":28,"y":36,"localNativeStableSid":true},{"sid":107006,"typeid":20501,"x":26,"y":32,"localNativeStableSid":true},{"sid":107007,"typeid":30201,"x":30,"y":28,"localNativeStableSid":true},{"sid":107008,"typeid":50701,"x":29,"y":32,"localNativeStableSid":true},{"sid":107009,"typeid":20301,"x":33,"y":29,"localNativeStableSid":true},{"sid":107010,"id":107010,"typeid":10501,"unit_type":105,"unit_level":1,"unit_mutateid":0,"lv":1,"xp":0,"state":2,"did":"107003","defense_id":"107003","rct":0,"aht":0,"aidx":-1,"skills":[10501],"localNativeStableSid":true,"localNativeGuard":true}],"walls":[[2,23,27,0],[2,23,28,0],[2,23,26,0],[2,23,25,0],[2,23,24,0],[2,23,23,0],[2,23,22,0],[2,24,22,0],[2,25,22,0],[2,26,22,0],[2,27,22,0],[2,28,22,0],[2,29,22,0],[2,29,23,0],[2,29,21,0],[2,30,21,0],[2,31,21,0],[2,32,21,0],[2,33,21,0],[2,33,22,0],[2,33,23,0],[2,33,24,0],[2,33,25,0],[2,33,26,0],[2,34,26,0],[2,34,27,0],[2,35,27,0],[2,36,27,0],[2,37,27,0],[2,37,28,0],[2,37,29,0],[2,37,30,0],[2,37,31,0],[2,36,31,0],[2,35,31,0],[2,34,31,0],[2,34,32,0],[2,34,33,0],[2,34,34,0],[2,33,34,0],[2,32,34,0],[2,31,34,0],[2,30,34,0],[3,30,33,0],[3,30,32,0],[3,30,31,0],[2,29,34,0],[2,29,35,0],[2,29,36,0],[2,29,37,0],[2,28,37,0],[2,27,37,0],[2,26,37,0],[2,25,37,0],[2,25,36,0],[2,25,35,0],[2,25,34,0],[2,23,29,0],[2,23,30,0],[2,23,31,0],[2,23,32,0],[2,23,33,0],[2,24,33,0],[2,25,33,0]]}},{"id":"scout-16","headquartersLevel":3,"layout":{"stage":16,"name":"\u7b2c 16 \u5173","source":"user-authored-layout","units":[{"sid":116001,"typeid":20103,"x":35,"y":35,"localNativeStableSid":true},{"sid":116002,"typeid":20401,"x":35,"y":30,"localNativeStableSid":true},{"sid":116003,"typeid":20503,"x":38,"y":30,"localNativeStableSid":true},{"sid":116004,"typeid":30202,"x":30,"y":38,"localNativeStableSid":true},{"sid":116005,"typeid":20303,"x":30,"y":35,"localNativeStableSid":true},{"sid":116006,"typeid":20201,"x":30,"y":32,"localNativeStableSid":true},{"sid":116007,"typeid":20901,"x":27,"y":32,"localNativeStableSid":true},{"sid":116008,"typeid":30103,"x":30,"y":28,"localNativeStableSid":true},{"sid":116009,"typeid":20702,"x":41,"y":36,"localNativeStableSid":true},{"sid":116010,"typeid":21002,"x":38,"y":39,"localNativeStableSid":true},{"sid":116011,"typeid":30403,"x":33,"y":39,"localNativeStableSid":true},{"sid":116012,"typeid":50601,"x":44,"y":34,"localNativeStableSid":true},{"sid":116013,"typeid":50701,"x":29,"y":41,"localNativeStableSid":true},{"sid":116014,"id":116014,"typeid":10501,"unit_type":105,"unit_level":1,"unit_mutateid":0,"lv":5,"xp":0,"state":2,"did":"116008","defense_id":"116008","rct":0,"aht":0,"aidx":-1,"skills":[10501,14801],"localNativeStableSid":true,"localNativeGuard":true}],"walls":[[3,32,36,0],[3,33,36,0],[3,34,36,0],[3,35,36,0],[3,36,35,0],[3,36,34,0],[3,36,33,0],[3,36,32,0],[3,31,31,0],[3,33,31,0],[3,34,31,0],[3,35,31,0],[3,31,35,0],[3,31,34,0],[3,31,33,0],[2,31,32,0],[2,31,36,0],[2,32,31,0],[2,36,36,0],[2,36,31,0],[1,32,30,0],[1,31,30,0],[1,31,29,0],[1,31,28,0],[3,31,27,0],[1,31,26,0],[3,31,25,0],[1,30,25,0],[1,29,25,0],[1,28,25,0],[3,27,25,0],[1,27,26,0],[1,27,27,0],[1,27,28,0],[2,27,29,0],[1,26,29,0],[1,25,29,0],[3,24,29,0],[1,24,30,0],[1,24,31,0],[1,24,32,0],[3,24,33,0],[1,26,33,0],[1,25,33,0],[2,27,33,0],[2,27,34,0],[2,27,35,0],[2,27,36,0],[2,27,37,0],[2,27,38,0],[3,27,39,0],[3,28,39,0],[3,29,39,0],[1,34,37,0],[1,34,38,0],[3,34,39,0],[3,34,40,0],[1,37,31,0],[1,38,31,0],[3,39,31,0],[1,39,30,0],[1,39,29,0],[1,39,28,0],[3,39,27,0],[2,32,27,0],[2,33,27,0],[2,34,27,0],[2,35,27,0],[2,36,27,0],[2,37,27,0],[2,38,27,0]]}},{"id":"scout-39","headquartersLevel":1,"layout":{"stage":39,"name":"\u4ece\u5357\u5230\u5317","source":"user-authored-layout","units":[{"sid":139001,"typeid":20101,"x":27,"y":27,"localNativeStableSid":true},{"sid":139002,"typeid":30106,"x":26,"y":31,"localNativeStableSid":true},{"sid":139003,"typeid":30806,"x":23,"y":31,"localNativeStableSid":true},{"sid":139004,"typeid":20406,"x":20,"y":33,"localNativeStableSid":true},{"sid":139005,"typeid":30205,"x":20,"y":28,"localNativeStableSid":true},{"sid":139006,"typeid":30106,"x":20,"y":25,"localNativeStableSid":true},{"sid":139007,"typeid":30306,"x":27,"y":22,"localNativeStableSid":true},{"sid":139008,"typeid":20206,"x":27,"y":18,"localNativeStableSid":true},{"sid":139009,"typeid":20705,"x":33,"y":24,"localNativeStableSid":true},{"sid":139010,"typeid":50601,"x":24,"y":22,"localNativeStableSid":true},{"sid":139011,"typeid":30806,"x":23,"y":20,"localNativeStableSid":true},{"sid":139012,"typeid":30106,"x":20,"y":20,"localNativeStableSid":true},{"sid":139013,"id":139013,"typeid":10709,"unit_type":107,"unit_level":9,"unit_mutateid":0,"lv":20,"xp":0,"state":2,"did":"139002","defense_id":"139002","rct":0,"aht":0,"aidx":-1,"skills":[10701,703304],"localNativeStableSid":true,"localNativeGuard":true},{"sid":139014,"id":139014,"typeid":10507,"unit_type":105,"unit_level":7,"unit_mutateid":0,"lv":20,"xp":0,"state":2,"did":"139006","defense_id":"139006","rct":0,"aht":0,"aidx":-1,"skills":[10501,15204],"localNativeStableSid":true,"localNativeGuard":true},{"sid":139015,"id":139015,"typeid":10401,"unit_type":104,"unit_level":1,"unit_mutateid":0,"lv":20,"xp":0,"state":2,"did":"139012","defense_id":"139012","rct":0,"aht":0,"aidx":-1,"skills":[10401,13301],"localNativeStableSid":true,"localNativeGuard":true}],"walls":[[3,23,27,0],[3,23,28,0],[3,24,28,0],[3,25,28,0],[3,26,28,0],[3,27,28,0],[3,28,28,0],[3,28,27,0],[3,28,26,0],[3,28,25,0],[3,28,24,0],[3,28,23,0],[3,27,23,0],[3,26,23,0],[3,25,23,0],[3,24,23,0],[3,23,23,0],[3,23,24,0],[3,23,25,0],[3,23,26,0],[2,17,33,0],[2,17,32,0],[2,17,31,0],[2,17,30,0],[2,17,29,0],[2,17,28,0],[2,17,27,0],[2,17,26,0],[2,17,25,0],[2,17,24,0],[2,17,23,0],[2,17,22,0],[2,17,34,0],[2,18,34,0],[2,19,34,0],[2,20,34,0],[2,21,34,0],[2,22,34,0],[2,23,34,0],[2,24,34,0],[2,26,34,0],[2,25,34,0],[2,27,34,0],[2,28,22,0],[2,28,21,0],[2,28,20,0],[2,28,19,0],[2,28,18,0],[2,28,17,0],[2,28,16,0],[2,28,15,0],[2,17,15,0],[2,18,15,0],[2,19,15,0],[2,20,15,0],[2,21,15,0],[2,22,15,0],[2,23,15,0],[2,24,15,0],[2,25,15,0],[2,26,15,0],[2,27,15,0],[3,18,22,0],[3,19,22,0],[3,20,22,0],[3,21,22,0],[3,22,22,0]]}},{"id":"alley-cat","headquartersLevel":5,"layout":{"stage":7,"name":"\u5df7\u5b50\u91cc\u7684\u732b","source":"user-authored-layout","units":[{"sid":107001,"typeid":20105,"x":27,"y":27,"localNativeStableSid":true},{"sid":107002,"typeid":20702,"x":20,"y":31,"localNativeStableSid":true},{"sid":107003,"typeid":20702,"x":20,"y":20,"localNativeStableSid":true},{"sid":107004,"typeid":20701,"x":31,"y":20,"localNativeStableSid":true},{"sid":107005,"typeid":20605,"x":35,"y":35,"localNativeStableSid":true},{"sid":107006,"typeid":20801,"x":23,"y":35,"localNativeStableSid":true},{"sid":107007,"typeid":20901,"x":35,"y":23,"localNativeStableSid":true},{"sid":107008,"typeid":21001,"x":25,"y":19,"localNativeStableSid":true},{"sid":107009,"typeid":21201,"x":31,"y":33,"localNativeStableSid":true},{"sid":107010,"typeid":21201,"x":33,"y":31,"localNativeStableSid":true},{"sid":107011,"typeid":21201,"x":37,"y":33,"localNativeStableSid":true},{"sid":107012,"typeid":21201,"x":33,"y":37,"localNativeStableSid":true},{"sid":107013,"typeid":30106,"x":23,"y":31,"localNativeStableSid":true},{"sid":107014,"typeid":30102,"x":31,"y":23,"localNativeStableSid":true},{"sid":107015,"typeid":30104,"x":19,"y":25,"localNativeStableSid":true},{"sid":107016,"typeid":30304,"x":27,"y":30,"localNativeStableSid":true},{"sid":107017,"typeid":30304,"x":30,"y":27,"localNativeStableSid":true},{"sid":107018,"typeid":30306,"x":27,"y":23,"localNativeStableSid":true},{"sid":107019,"typeid":30203,"x":23,"y":27,"localNativeStableSid":true},{"sid":107020,"typeid":30402,"x":23,"y":23,"localNativeStableSid":true},{"sid":107021,"typeid":30801,"x":28,"y":34,"localNativeStableSid":true},{"sid":107022,"typeid":30804,"x":34,"y":28,"localNativeStableSid":true},{"sid":107023,"typeid":30501,"x":30,"y":30,"localNativeStableSid":true},{"sid":107024,"typeid":50701,"x":37,"y":37,"localNativeStableSid":true},{"sid":107025,"typeid":50601,"x":14,"y":33,"localNativeStableSid":true},{"sid":107026,"typeid":50601,"x":33,"y":14,"localNativeStableSid":true},{"sid":107027,"typeid":50601,"x":14,"y":14,"localNativeStableSid":true}],"walls":[[3,21,28,0],[3,22,28,0],[3,23,28,0],[3,24,28,0],[2,24,29,0],[2,24,30,0],[2,24,31,0],[2,25,31,0],[2,26,31,0],[2,27,31,0],[2,28,31,0],[2,29,31,0],[2,29,32,0],[2,30,31,0],[2,31,31,0],[2,31,30,0],[2,31,29,0],[2,31,28,0],[2,31,27,0],[2,31,26,0],[2,32,25,0],[2,31,25,0],[2,31,24,0],[2,30,24,0],[2,29,24,0],[2,28,24,0],[2,28,23,0],[2,28,22,0],[2,28,21,0],[3,20,26,0],[3,20,25,0],[3,20,24,0],[2,20,23,0],[2,20,22,0],[2,20,21,0],[3,21,24,0],[3,22,24,0],[3,23,24,0],[2,24,23,0],[2,24,22,0],[2,24,21,0],[2,24,20,0],[2,23,20,0],[2,22,20,0],[2,21,20,0],[2,25,20,0],[2,26,20,0],[2,32,29,0],[2,33,29,0],[2,34,29,0],[2,33,25,0],[2,34,25,0],[2,25,32,0],[2,25,33,0],[2,25,34,0],[2,29,33,0],[2,29,34,0],[2,19,26,0],[2,18,26,0],[2,17,26,0],[2,16,26,0],[2,16,25,0],[2,16,24,0],[2,16,23,0],[2,16,22,0],[2,17,22,0],[2,18,22,0],[2,19,22,0],[2,22,19,0],[2,22,18,0],[2,22,17,0],[2,22,16,0],[2,23,16,0],[2,24,16,0],[2,25,16,0],[2,26,16,0],[2,26,17,0],[2,26,18,0],[2,26,19,0],[2,26,35,0],[2,28,35,0],[2,35,26,0],[2,35,28,0],[2,21,32,0],[2,22,32,0],[2,23,32,0],[2,32,21,0],[2,32,22,0],[2,32,23,0],[2,36,26,0],[2,37,26,0],[2,37,27,0],[2,37,28,0],[2,37,29,0],[2,26,36,0],[2,26,37,0],[2,27,37,0],[2,28,37,0],[2,29,37,0]]}},{"id":"alley-cat-8","headquartersLevel":5,"layout":{"stage":8,"name":"\u5df7\u5b50\u91cc\u7684\u732b","source":"user-authored-layout","units":[{"sid":108001,"typeid":20105,"x":39,"y":39,"localNativeStableSid":true},{"sid":108002,"typeid":30106,"x":33,"y":38,"localNativeStableSid":true},{"sid":108003,"typeid":30106,"x":38,"y":30,"localNativeStableSid":true},{"sid":108004,"typeid":30106,"x":22,"y":35,"localNativeStableSid":true},{"sid":108005,"typeid":30303,"x":38,"y":27,"localNativeStableSid":true},{"sid":108006,"typeid":30302,"x":32,"y":29,"localNativeStableSid":true},{"sid":108007,"typeid":30306,"x":30,"y":35,"localNativeStableSid":true},{"sid":108008,"typeid":30203,"x":32,"y":32,"localNativeStableSid":true},{"sid":108009,"typeid":30402,"x":35,"y":35,"localNativeStableSid":true},{"sid":108010,"typeid":30501,"x":42,"y":42,"localNativeStableSid":true},{"sid":108011,"typeid":30802,"x":26,"y":35,"localNativeStableSid":true},{"sid":108012,"typeid":30804,"x":38,"y":33,"localNativeStableSid":true},{"sid":108013,"typeid":50501,"x":26,"y":40,"localNativeStableSid":true},{"sid":108014,"typeid":20507,"x":33,"y":42,"localNativeStableSid":true},{"sid":108015,"typeid":20507,"x":30,"y":42,"localNativeStableSid":true},{"sid":108016,"typeid":20307,"x":41,"y":33,"localNativeStableSid":true},{"sid":108017,"typeid":20307,"x":41,"y":30,"localNativeStableSid":true},{"sid":108018,"typeid":21001,"x":41,"y":27,"localNativeStableSid":true},{"sid":108019,"typeid":20901,"x":29,"y":39,"localNativeStableSid":true},{"sid":108020,"typeid":20801,"x":35,"y":29,"localNativeStableSid":true},{"sid":108021,"typeid":20703,"x":24,"y":31,"localNativeStableSid":true},{"sid":108022,"typeid":20701,"x":32,"y":26,"localNativeStableSid":true},{"sid":108023,"typeid":20701,"x":24,"y":41,"localNativeStableSid":true},{"sid":108024,"typeid":21201,"x":41,"y":21,"localNativeStableSid":true},{"sid":108025,"typeid":21201,"x":26,"y":38,"localNativeStableSid":true},{"sid":108026,"typeid":21201,"x":34,"y":23,"localNativeStableSid":true},{"sid":108027,"typeid":20201,"x":19,"y":42,"localNativeStableSid":true},{"sid":108028,"typeid":20208,"x":19,"y":39,"localNativeStableSid":true},{"sid":108029,"typeid":20208,"x":19,"y":36,"localNativeStableSid":true},{"sid":108030,"typeid":20208,"x":19,"y":33,"localNativeStableSid":true},{"sid":108031,"typeid":20201,"x":19,"y":30,"localNativeStableSid":true},{"sid":108032,"typeid":20404,"x":30,"y":21,"localNativeStableSid":true},{"sid":108033,"typeid":20401,"x":33,"y":21,"localNativeStableSid":true},{"sid":108034,"typeid":20408,"x":36,"y":21,"localNativeStableSid":true},{"sid":108035,"typeid":20401,"x":39,"y":21,"localNativeStableSid":true},{"sid":108036,"typeid":20408,"x":41,"y":24,"localNativeStableSid":true},{"sid":108037,"typeid":21201,"x":35,"y":31,"localNativeStableSid":true},{"sid":108038,"typeid":21201,"x":34,"y":25,"localNativeStableSid":true},{"sid":108039,"typeid":21201,"x":36,"y":23,"localNativeStableSid":true},{"sid":108040,"typeid":20605,"x":28,"y":31,"localNativeStableSid":true},{"sid":108041,"id":108041,"typeid":10501,"unit_type":105,"unit_level":1,"unit_mutateid":0,"lv":10,"xp":0,"state":2,"did":"108002","defense_id":"108002","rct":0,"aht":0,"aidx":-1,"skills":[10501,14601],"localNativeStableSid":true,"localNativeGuard":true},{"sid":108042,"id":108042,"typeid":10601,"unit_type":106,"unit_level":1,"unit_mutateid":0,"lv":10,"xp":0,"state":2,"did":"108003","defense_id":"108003","rct":0,"aht":0,"aidx":-1,"skills":[10601,17301],"localNativeStableSid":true,"localNativeGuard":true},{"sid":108043,"id":108043,"typeid":10901,"unit_type":109,"unit_level":1,"unit_mutateid":0,"lv":15,"xp":0,"state":2,"did":"108004","defense_id":"108004","rct":0,"aht":0,"aidx":-1,"skills":[10901,21101],"localNativeStableSid":true,"localNativeGuard":true}],"walls":[[3,43,43,0],[3,42,43,0],[3,41,43,0],[3,39,43,0],[3,40,43,0],[3,43,42,0],[3,43,41,0],[3,43,40,0],[3,43,39,0],[3,42,39,0],[3,41,39,0],[3,40,39,0],[3,40,38,0],[3,40,37,0],[3,40,36,0],[3,40,35,0],[3,39,40,0],[3,39,41,0],[3,39,42,0],[3,38,40,0],[3,37,40,0],[3,36,40,0],[3,35,40,0],[3,35,39,0],[3,35,38,0],[3,35,37,0],[3,35,36,0],[3,39,35,0],[3,38,35,0],[3,37,35,0],[3,36,35,0],[3,38,34,0],[3,37,34,0],[3,36,34,0],[3,34,39,0],[3,34,38,0],[3,34,37,0],[3,34,36,0],[3,33,39,0],[3,32,39,0],[3,31,39,0],[3,30,39,0],[3,30,38,0],[3,30,37,0],[3,30,36,0],[3,29,36,0],[3,33,30,0],[3,33,31,0],[3,33,32,0],[3,34,32,0],[3,35,32,0],[3,32,33,0],[3,32,34,0],[3,32,35,0],[3,31,35,0],[3,31,33,0],[3,20,36,0],[3,21,36,0],[3,22,36,0],[3,23,36,0],[3,24,36,0],[3,25,36,0],[3,26,36,0],[3,27,36,0],[3,28,36,0],[3,20,32,0],[3,21,32,0],[3,22,32,0],[3,23,32,0],[3,26,32,0],[3,27,32,0],[3,24,32,0],[3,25,32,0],[3,38,24,0],[3,37,24,0],[3,36,24,0],[3,35,24,0],[3,35,25,0],[3,35,26,0],[3,41,34,0],[3,42,34,0],[3,42,33,0],[3,42,32,0],[3,27,18,0],[3,27,19,0],[3,27,20,0],[3,27,21,0],[3,27,22,0],[3,27,23,0],[3,27,24,0],[3,28,18,0],[3,29,32,0],[3,29,31,0],[3,29,30,0],[3,29,29,0],[3,29,28,0],[3,29,27,0],[3,27,33,0],[3,27,34,0],[3,27,35,0]]}},{"id":"scout-custom-9","headquartersLevel":5,"layout":{"stage":9,"name":"\u94c1\u58c1\u56f4\u57ce","source":"user-authored-layout","units":[{"sid":109001,"typeid":20105,"x":31,"y":31,"localNativeStableSid":true},{"sid":109002,"typeid":30105,"x":35,"y":35,"localNativeStableSid":true},{"sid":109003,"typeid":30105,"x":27,"y":35,"localNativeStableSid":true},{"sid":109004,"typeid":30105,"x":27,"y":27,"localNativeStableSid":true},{"sid":109005,"typeid":30305,"x":35,"y":31,"localNativeStableSid":true},{"sid":109006,"typeid":30305,"x":27,"y":31,"localNativeStableSid":true},{"sid":109007,"typeid":30305,"x":31,"y":35,"localNativeStableSid":true},{"sid":109008,"typeid":30804,"x":35,"y":27,"localNativeStableSid":true},{"sid":109009,"typeid":30804,"x":31,"y":27,"localNativeStableSid":true},{"sid":109010,"typeid":30203,"x":40,"y":31,"localNativeStableSid":true},{"sid":109011,"typeid":30403,"x":22,"y":31,"localNativeStableSid":true},{"sid":109012,"typeid":30501,"x":31,"y":41,"localNativeStableSid":true},{"sid":109013,"typeid":20604,"x":42,"y":42,"localNativeStableSid":true},{"sid":109014,"typeid":20506,"x":15,"y":15,"localNativeStableSid":true},{"sid":109015,"typeid":20306,"x":15,"y":19,"localNativeStableSid":true},{"sid":109016,"typeid":20406,"x":19,"y":15,"localNativeStableSid":true},{"sid":109017,"typeid":20206,"x":19,"y":19,"localNativeStableSid":true},{"sid":109018,"typeid":20801,"x":15,"y":42,"localNativeStableSid":true},{"sid":109019,"typeid":20901,"x":19,"y":42,"localNativeStableSid":true},{"sid":109020,"typeid":21001,"x":42,"y":15,"localNativeStableSid":true},{"sid":109021,"typeid":20702,"x":42,"y":38,"localNativeStableSid":true},{"sid":109022,"typeid":20702,"x":15,"y":31,"localNativeStableSid":true},{"sid":109023,"typeid":20702,"x":31,"y":15,"localNativeStableSid":true},{"sid":109024,"typeid":21201,"x":14,"y":39,"localNativeStableSid":true},{"sid":109025,"typeid":21201,"x":14,"y":35,"localNativeStableSid":true},{"sid":109026,"typeid":21201,"x":39,"y":14,"localNativeStableSid":true},{"sid":109027,"typeid":21201,"x":35,"y":14,"localNativeStableSid":true},{"sid":109028,"id":109028,"typeid":10501,"unit_type":105,"unit_level":1,"unit_mutateid":0,"lv":26,"xp":0,"state":2,"did":"109002","defense_id":"109002","rct":0,"aht":0,"aidx":-1,"skills":[10501,14903,15204],"localNativeStableSid":true,"localNativeGuard":true},{"sid":109029,"id":109029,"typeid":11201,"unit_type":112,"unit_level":1,"unit_mutateid":0,"lv":33,"xp":0,"state":2,"did":"109003","defense_id":"109003","rct":0,"aht":0,"aidx":-1,"skills":[11201,24002,24903],"localNativeStableSid":true,"localNativeGuard":true},{"sid":109030,"id":109030,"typeid":11101,"unit_type":111,"unit_level":1,"unit_mutateid":0,"lv":22,"xp":0,"state":2,"did":"109004","defense_id":"109004","rct":0,"aht":0,"aidx":-1,"skills":[11101,22802,23703],"localNativeStableSid":true,"localNativeGuard":true}],"walls":[[3,23,23,0],[3,23,37,0],[3,24,23,0],[3,24,37,0],[3,25,23,0],[3,25,37,0],[3,26,23,0],[3,26,37,0],[3,27,23,0],[3,27,37,0],[3,28,23,0],[3,28,37,0],[3,29,23,0],[3,29,37,0],[3,30,23,0],[3,30,37,0],[3,31,23,0],[3,31,37,0],[3,32,23,0],[3,32,37,0],[3,33,23,0],[3,33,37,0],[3,34,23,0],[3,34,37,0],[3,35,23,0],[3,35,37,0],[3,36,23,0],[3,36,37,0],[3,37,23,0],[3,37,37,0],[3,23,24,0],[3,37,24,0],[3,23,25,0],[3,37,25,0],[3,23,26,0],[3,37,26,0],[3,23,27,0],[3,37,27,0],[3,23,28,0],[3,37,28,0],[3,23,29,0],[3,37,29,0],[3,23,30,0],[3,37,30,0],[3,23,31,0],[3,37,31,0],[3,23,32,0],[3,37,32,0],[3,23,33,0],[3,37,33,0],[3,23,34,0],[3,37,34,0],[3,23,35,0],[3,37,35,0],[3,23,36,0],[3,37,36,0],[2,13,21,0],[2,14,21,0],[2,15,21,0],[2,16,13,0],[2,16,21,0],[2,17,21,0],[2,18,21,0],[2,19,21,0],[2,20,13,0],[2,20,21,0],[2,21,13,0],[2,21,21,0],[2,21,14,0],[2,21,15,0],[2,13,16,0],[2,21,16,0],[2,21,17,0],[2,21,18,0],[2,21,19,0],[2,13,20,0],[2,21,20,0],[2,13,44,0],[2,14,44,0],[2,15,44,0],[2,16,44,0],[2,17,44,0],[2,18,44,0],[2,19,44,0],[2,20,44,0],[2,21,44,0],[2,22,13,0],[2,22,44,0],[2,23,13,0],[2,23,44,0],[2,24,13,0],[2,24,44,0],[2,25,13,0],[2,25,44,0],[2,26,13,0],[2,26,44,0],[2,27,44,0],[2,28,44,0],[2,29,44,0],[2,30,44,0],[2,31,44,0],[2,32,13,0],[2,32,44,0],[2,33,13,0],[2,33,44,0],[2,34,44,0],[2,35,44,0],[2,36,13,0],[2,36,44,0],[2,37,13,0],[2,37,44,0],[2,38,44,0],[2,39,44,0],[2,40,44,0],[2,41,44,0],[2,42,44,0],[2,43,13,0],[2,43,44,0],[2,44,13,0],[2,44,44,0],[2,44,14,0],[2,44,15,0],[2,44,16,0],[2,44,17,0],[2,44,18,0],[2,44,19,0],[2,44,20,0],[2,44,21,0],[2,13,22,0],[2,44,22,0],[2,13,23,0],[2,44,23,0],[2,13,24,0],[2,44,24,0],[2,13,25,0],[2,44,25,0],[2,13,26,0],[2,44,26,0],[2,44,27,0],[2,44,28,0],[2,44,29,0],[2,44,30,0],[2,44,31,0],[2,13,32,0],[2,44,32,0],[2,13,33,0],[2,44,33,0],[2,44,34,0],[2,44,35,0],[2,13,36,0],[2,44,36,0],[2,13,37,0],[2,44,37,0],[2,44,38,0],[2,44,39,0],[2,44,40,0],[2,44,41,0],[2,44,42,0],[2,13,43,0],[2,44,43,0]]}},{"id":"scout-custom-10","headquartersLevel":7,"layout":{"stage":10,"name":"\u8840\u6218\u9f99\u5ead","source":"user-authored-layout","units":[{"sid":110001,"typeid":20107,"x":31,"y":31,"localNativeStableSid":true},{"sid":110002,"typeid":30107,"x":34,"y":34,"localNativeStableSid":true},{"sid":110003,"typeid":30107,"x":25,"y":34,"localNativeStableSid":true},{"sid":110004,"typeid":30107,"x":25,"y":25,"localNativeStableSid":true},{"sid":110005,"typeid":30307,"x":34,"y":25,"localNativeStableSid":true},{"sid":110006,"typeid":30307,"x":34,"y":31,"localNativeStableSid":true},{"sid":110007,"typeid":30307,"x":25,"y":31,"localNativeStableSid":true},{"sid":110008,"typeid":30806,"x":34,"y":37,"localNativeStableSid":true},{"sid":110009,"typeid":30806,"x":22,"y":34,"localNativeStableSid":true},{"sid":110010,"typeid":30205,"x":38,"y":24,"localNativeStableSid":true},{"sid":110011,"typeid":30503,"x":24,"y":38,"localNativeStableSid":true},{"sid":110012,"typeid":30405,"x":38,"y":38,"localNativeStableSid":true},{"sid":110013,"typeid":20606,"x":21,"y":38,"localNativeStableSid":true},{"sid":110014,"typeid":20508,"x":20,"y":13,"localNativeStableSid":true},{"sid":110015,"typeid":20308,"x":24,"y":13,"localNativeStableSid":true},{"sid":110016,"typeid":20408,"x":13,"y":20,"localNativeStableSid":true},{"sid":110017,"typeid":20208,"x":13,"y":24,"localNativeStableSid":true},{"sid":110018,"typeid":20803,"x":42,"y":18,"localNativeStableSid":true},{"sid":110019,"typeid":20903,"x":18,"y":42,"localNativeStableSid":true},{"sid":110020,"typeid":21003,"x":42,"y":42,"localNativeStableSid":true},{"sid":110021,"typeid":20704,"x":16,"y":39,"localNativeStableSid":true},{"sid":110022,"typeid":20704,"x":40,"y":15,"localNativeStableSid":true},{"sid":110023,"typeid":20704,"x":43,"y":31,"localNativeStableSid":true},{"sid":110024,"typeid":21201,"x":42,"y":26,"localNativeStableSid":true},{"sid":110025,"typeid":21201,"x":45,"y":29,"localNativeStableSid":true},{"sid":110026,"typeid":21201,"x":26,"y":42,"localNativeStableSid":true},{"sid":110027,"typeid":21201,"x":29,"y":42,"localNativeStableSid":true},{"sid":110028,"id":110028,"typeid":10501,"unit_type":105,"unit_level":1,"unit_mutateid":0,"lv":34,"xp":0,"state":2,"did":"110002","defense_id":"110002","rct":0,"aht":0,"aidx":-1,"skills":[10501,14907,15207],"localNativeStableSid":true,"localNativeGuard":true},{"sid":110029,"id":110029,"typeid":11201,"unit_type":112,"unit_level":1,"unit_mutateid":0,"lv":40,"xp":0,"state":2,"did":"110003","defense_id":"110003","rct":0,"aht":0,"aidx":-1,"skills":[11201,24007,24907],"localNativeStableSid":true,"localNativeGuard":true},{"sid":110030,"id":110030,"typeid":11101,"unit_type":111,"unit_level":1,"unit_mutateid":0,"lv":32,"xp":0,"state":2,"did":"110004","defense_id":"110004","rct":0,"aht":0,"aidx":-1,"skills":[11101,22807,23707],"localNativeStableSid":true,"localNativeGuard":true}],"walls":[[3,26,26,0],[3,26,36,0],[3,27,26,0],[3,27,36,0],[3,28,26,0],[3,28,36,0],[3,29,26,0],[3,29,36,0],[3,30,26,0],[3,30,36,0],[3,31,26,0],[3,31,36,0],[3,32,26,0],[3,33,26,0],[3,34,26,0],[3,35,26,0],[3,35,36,0],[3,36,26,0],[3,26,27,0],[3,36,27,0],[3,26,28,0],[3,36,28,0],[3,26,29,0],[3,36,29,0],[3,26,30,0],[3,36,30,0],[3,26,31,0],[3,36,31,0],[3,26,32,0],[3,36,32,0],[3,26,33,0],[3,36,33,0],[3,26,34,0],[3,36,34,0],[3,26,35,0],[3,36,35,0],[3,21,21,0],[3,21,41,0],[3,22,21,0],[3,22,41,0],[3,23,21,0],[3,23,41,0],[3,24,21,0],[3,24,41,0],[3,25,21,0],[3,26,21,0],[3,27,21,0],[3,27,41,0],[3,28,21,0],[3,29,21,0],[3,30,21,0],[3,30,41,0],[3,31,21,0],[3,31,41,0],[3,32,21,0],[3,32,41,0],[3,33,21,0],[3,33,41,0],[3,34,21,0],[3,34,41,0],[3,35,21,0],[3,35,41,0],[3,36,21,0],[3,36,41,0],[3,37,21,0],[3,37,41,0],[3,38,21,0],[3,38,41,0],[3,39,21,0],[3,39,41,0],[3,40,21,0],[3,41,21,0],[3,21,22,0],[3,41,22,0],[3,21,23,0],[3,41,23,0],[3,21,24,0],[3,41,24,0],[3,21,25,0],[3,21,26,0],[3,21,27,0],[3,21,28,0],[3,21,29,0],[3,21,30,0],[3,21,31,0],[3,41,32,0],[3,41,33,0],[3,41,34,0],[3,41,35,0],[3,41,36,0],[3,41,37,0],[3,41,38,0],[3,21,39,0],[3,41,39,0],[3,21,40,0],[2,14,14,0],[2,14,44,0],[2,15,14,0],[2,15,44,0],[2,16,14,0],[2,16,44,0],[2,17,14,0],[2,17,44,0],[2,18,14,0],[2,18,44,0],[2,19,14,0],[2,19,44,0],[2,20,14,0],[2,20,44,0],[2,21,14,0],[2,21,44,0],[2,22,14,0],[2,22,44,0],[2,23,14,0],[2,23,44,0],[2,24,14,0],[2,24,44,0],[2,25,14,0],[2,25,44,0],[2,26,14,0],[2,26,44,0],[2,27,14,0],[2,27,44,0],[2,28,14,0],[2,28,44,0],[2,29,14,0],[2,29,44,0],[2,30,14,0],[2,30,44,0],[2,31,14,0],[2,31,44,0],[2,32,14,0],[2,32,44,0],[2,33,14,0],[2,33,44,0],[2,34,14,0],[2,34,44,0],[2,35,14,0],[2,35,44,0],[2,36,44,0],[2,37,44,0],[2,38,44,0],[2,39,44,0],[2,40,44,0],[2,41,14,0],[2,41,44,0],[2,42,14,0],[2,42,44,0],[2,43,14,0],[2,43,44,0],[2,44,14,0],[2,44,44,0],[2,14,15,0],[2,44,15,0],[2,14,16,0],[2,44,16,0],[2,14,17,0],[2,44,17,0],[2,14,18,0],[2,44,18,0],[2,14,19,0],[2,44,19,0],[2,14,20,0],[2,44,20,0],[2,14,21,0],[2,44,21,0],[2,14,22,0],[2,44,22,0],[2,14,23,0],[2,44,23,0],[2,14,24,0],[2,44,24,0],[2,14,25,0],[2,44,25,0],[2,14,26,0],[2,44,26,0],[2,14,27,0],[2,44,27,0],[2,14,28,0],[2,14,29,0],[2,14,30,0],[2,44,30,0],[2,14,31,0],[2,44,31,0],[2,14,32,0],[2,44,32,0],[2,14,33,0],[2,44,33,0],[2,14,34,0],[2,44,34,0],[2,44,35,0],[2,44,36,0],[2,44,37,0],[2,44,38,0],[2,44,39,0],[2,14,40,0],[2,44,40,0],[2,14,41,0],[2,44,41,0],[2,14,42,0],[2,44,42,0],[2,14,43,0],[2,44,43,0]]}},{"id":"scout-custom-11","headquartersLevel":5,"layout":{"stage":11,"name":"\u53cc\u5cf0\u54e8\u536b","source":"user-authored-layout","units":[{"sid":111001,"typeid":20105,"x":31,"y":31,"localNativeStableSid":true},{"sid":111002,"typeid":30105,"x":36,"y":36,"localNativeStableSid":true},{"sid":111003,"typeid":30105,"x":26,"y":36,"localNativeStableSid":true},{"sid":111004,"typeid":30105,"x":26,"y":26,"localNativeStableSid":true},{"sid":111005,"typeid":30305,"x":36,"y":26,"localNativeStableSid":true},{"sid":111006,"typeid":30304,"x":36,"y":31,"localNativeStableSid":true},{"sid":111007,"typeid":30304,"x":26,"y":31,"localNativeStableSid":true},{"sid":111008,"typeid":30803,"x":36,"y":41,"localNativeStableSid":true},{"sid":111009,"typeid":30803,"x":26,"y":21,"localNativeStableSid":true},{"sid":111010,"typeid":30203,"x":41,"y":31,"localNativeStableSid":true},{"sid":111011,"typeid":30402,"x":21,"y":31,"localNativeStableSid":true},{"sid":111012,"typeid":30501,"x":31,"y":41,"localNativeStableSid":true},{"sid":111013,"typeid":20605,"x":31,"y":21,"localNativeStableSid":true},{"sid":111014,"typeid":20703,"x":15,"y":15,"localNativeStableSid":true},{"sid":111015,"typeid":20702,"x":43,"y":15,"localNativeStableSid":true},{"sid":111016,"typeid":20702,"x":15,"y":43,"localNativeStableSid":true},{"sid":111017,"typeid":20801,"x":43,"y":43,"localNativeStableSid":true},{"sid":111018,"typeid":20901,"x":20,"y":42,"localNativeStableSid":true},{"sid":111019,"typeid":21001,"x":42,"y":20,"localNativeStableSid":true},{"sid":111020,"typeid":21201,"x":14,"y":21,"localNativeStableSid":true},{"sid":111021,"typeid":21201,"x":14,"y":24,"localNativeStableSid":true},{"sid":111022,"typeid":21201,"x":21,"y":14,"localNativeStableSid":true},{"sid":111023,"typeid":21201,"x":24,"y":14,"localNativeStableSid":true},{"sid":111024,"typeid":20506,"x":14,"y":32,"localNativeStableSid":true},{"sid":111025,"typeid":20306,"x":14,"y":36,"localNativeStableSid":true},{"sid":111026,"typeid":20406,"x":45,"y":32,"localNativeStableSid":true},{"sid":111027,"typeid":20206,"x":45,"y":36,"localNativeStableSid":true},{"sid":111028,"id":111028,"typeid":10501,"unit_type":105,"unit_level":1,"unit_mutateid":0,"lv":22,"xp":0,"state":2,"did":"111002","defense_id":"111002","rct":0,"aht":0,"aidx":-1,"skills":[10501,14603,14902],"localNativeStableSid":true,"localNativeGuard":true},{"sid":111029,"id":111029,"typeid":10701,"unit_type":107,"unit_level":1,"unit_mutateid":0,"lv":27,"xp":0,"state":2,"did":"111003","defense_id":"111003","rct":0,"aht":0,"aidx":-1,"skills":[10701,17502,18103],"localNativeStableSid":true,"localNativeGuard":true},{"sid":111030,"id":111030,"typeid":10901,"unit_type":109,"unit_level":1,"unit_mutateid":0,"lv":24,"xp":0,"state":2,"did":"111004","defense_id":"111004","rct":0,"aht":0,"aidx":-1,"skills":[10901,20202,20603],"localNativeStableSid":true,"localNativeGuard":true}],"walls":[[3,24,38,0],[3,25,38,0],[3,26,38,0],[3,27,24,0],[3,27,38,0],[3,28,24,0],[3,28,38,0],[3,29,24,0],[3,29,38,0],[3,30,24,0],[3,30,38,0],[3,31,24,0],[3,31,38,0],[3,32,24,0],[3,32,38,0],[3,33,24,0],[3,33,38,0],[3,34,38,0],[3,35,38,0],[3,36,38,0],[3,37,24,0],[3,37,38,0],[3,38,24,0],[3,38,38,0],[3,38,25,0],[3,38,26,0],[3,24,27,0],[3,38,27,0],[3,24,28,0],[3,38,28,0],[3,38,29,0],[3,38,30,0],[3,38,31,0],[3,24,32,0],[3,38,32,0],[3,24,33,0],[3,38,33,0],[3,38,34,0],[3,38,35,0],[3,38,36,0],[3,24,37,0],[3,38,37,0],[2,19,19,0],[2,19,33,0],[2,20,19,0],[2,20,33,0],[2,21,19,0],[2,21,33,0],[2,22,19,0],[2,22,33,0],[2,23,19,0],[2,23,33,0],[2,25,33,0],[2,26,33,0],[2,27,19,0],[2,27,33,0],[2,28,33,0],[2,29,33,0],[2,30,33,0],[2,31,33,0],[2,32,19,0],[2,32,33,0],[2,33,19,0],[2,33,33,0],[2,19,20,0],[2,33,20,0],[2,19,21,0],[2,33,21,0],[2,19,22,0],[2,33,22,0],[2,19,23,0],[2,33,23,0],[2,19,24,0],[2,19,25,0],[2,33,25,0],[2,19,26,0],[2,33,26,0],[2,19,27,0],[2,33,27,0],[2,19,28,0],[2,33,28,0],[2,33,29,0],[2,33,30,0],[2,33,31,0],[2,19,32,0],[2,33,32,0],[2,13,45,0],[2,14,45,0],[2,15,45,0],[2,16,13,0],[2,16,45,0],[2,17,13,0],[2,17,45,0],[2,18,13,0],[2,18,45,0],[2,19,13,0],[2,19,45,0],[2,20,45,0],[2,21,45,0],[2,22,13,0],[2,22,45,0],[2,23,45,0],[2,24,45,0],[2,25,13,0],[2,25,45,0],[2,26,13,0],[2,26,45,0],[2,27,13,0],[2,27,45,0],[2,28,13,0],[2,28,45,0],[2,29,13,0],[2,29,45,0],[2,30,13,0],[2,30,45,0],[2,31,13,0],[2,31,45,0],[2,32,13,0],[2,32,45,0],[2,33,13,0],[2,33,45,0],[2,34,13,0],[2,34,45,0],[2,35,13,0],[2,35,45,0],[2,36,13,0],[2,36,45,0],[2,37,13,0],[2,37,45,0],[2,38,13,0],[2,38,45,0],[2,39,45,0],[2,40,45,0],[2,41,45,0],[2,42,45,0],[2,43,45,0],[2,44,13,0],[2,44,45,0],[2,45,13,0],[2,45,45,0],[2,45,14,0],[2,45,15,0],[2,13,16,0],[2,45,16,0],[2,13,17,0],[2,45,17,0],[2,13,18,0],[2,45,18,0],[2,13,19,0],[2,45,19,0],[2,45,20,0],[2,45,21,0],[2,13,22,0],[2,45,22,0],[2,45,23,0],[2,45,24,0],[2,13,25,0],[2,45,25,0],[2,13,26,0],[2,45,26,0],[2,13,27,0],[2,45,27,0],[2,13,28,0],[2,45,28,0],[2,13,29,0],[2,45,29,0],[2,13,33,0],[2,45,33,0],[2,13,37,0],[2,45,37,0],[2,13,38,0],[2,45,38,0],[2,45,39,0],[2,45,40,0],[2,45,41,0],[2,45,42,0],[2,45,43,0],[2,13,44,0],[2,45,44,0],[2,24,22,0],[2,24,23,0],[2,38,19,0],[2,38,20,0],[2,38,21,0],[2,38,22,0],[2,38,23,0],[2,24,39,0],[2,24,40,0],[2,24,41,0],[2,24,42,0],[2,24,43,0],[2,24,44,0],[2,38,39,0],[2,38,40,0],[2,38,41,0],[2,38,42,0],[2,38,43,0],[2,38,44,0]]}},{"id":"scout-custom-12","headquartersLevel":5,"layout":{"stage":12,"name":"\u56db\u95e8\u94c1\u95f8","source":"user-authored-layout","units":[{"sid":112001,"typeid":20105,"x":31,"y":31,"localNativeStableSid":true},{"sid":112002,"typeid":30105,"x":35,"y":35,"localNativeStableSid":true},{"sid":112003,"typeid":30104,"x":27,"y":35,"localNativeStableSid":true},{"sid":112004,"typeid":30104,"x":27,"y":27,"localNativeStableSid":true},{"sid":112005,"typeid":30305,"x":35,"y":27,"localNativeStableSid":true},{"sid":112006,"typeid":30304,"x":35,"y":31,"localNativeStableSid":true},{"sid":112007,"typeid":30304,"x":27,"y":31,"localNativeStableSid":true},{"sid":112008,"typeid":30803,"x":39,"y":39,"localNativeStableSid":true},{"sid":112009,"typeid":30803,"x":23,"y":23,"localNativeStableSid":true},{"sid":112010,"typeid":30202,"x":39,"y":31,"localNativeStableSid":true},{"sid":112011,"typeid":30402,"x":23,"y":31,"localNativeStableSid":true},{"sid":112012,"typeid":30501,"x":31,"y":39,"localNativeStableSid":true},{"sid":112013,"typeid":20604,"x":31,"y":23,"localNativeStableSid":true},{"sid":112014,"typeid":20702,"x":16,"y":16,"localNativeStableSid":true},{"sid":112015,"typeid":20703,"x":44,"y":16,"localNativeStableSid":true},{"sid":112016,"typeid":20702,"x":16,"y":44,"localNativeStableSid":true},{"sid":112017,"typeid":20801,"x":44,"y":44,"localNativeStableSid":true},{"sid":112018,"typeid":20901,"x":22,"y":44,"localNativeStableSid":true},{"sid":112019,"typeid":21001,"x":44,"y":22,"localNativeStableSid":true},{"sid":112020,"typeid":21201,"x":14,"y":30,"localNativeStableSid":true},{"sid":112021,"typeid":21201,"x":14,"y":34,"localNativeStableSid":true},{"sid":112022,"typeid":21201,"x":30,"y":14,"localNativeStableSid":true},{"sid":112023,"typeid":21201,"x":34,"y":14,"localNativeStableSid":true},{"sid":112024,"typeid":20507,"x":28,"y":14,"localNativeStableSid":true},{"sid":112025,"typeid":20307,"x":37,"y":14,"localNativeStableSid":true},{"sid":112026,"typeid":20407,"x":31,"y":45,"localNativeStableSid":true},{"sid":112027,"typeid":20207,"x":36,"y":45,"localNativeStableSid":true},{"sid":112028,"id":112028,"typeid":10601,"unit_type":106,"unit_level":1,"unit_mutateid":0,"lv":25,"xp":0,"state":2,"did":"112002","defense_id":"112002","rct":0,"aht":0,"aidx":-1,"skills":[10601,16702,17303],"localNativeStableSid":true,"localNativeGuard":true},{"sid":112029,"id":112029,"typeid":11001,"unit_type":110,"unit_level":1,"unit_mutateid":0,"lv":29,"xp":0,"state":2,"did":"112003","defense_id":"112003","rct":0,"aht":0,"aidx":-1,"skills":[11001,22003,22504],"localNativeStableSid":true,"localNativeGuard":true},{"sid":112030,"id":112030,"typeid":10801,"unit_type":108,"unit_level":1,"unit_mutateid":0,"lv":23,"xp":0,"state":2,"did":"112004","defense_id":"112004","rct":0,"aht":0,"aidx":-1,"skills":[10801,19102,19903],"localNativeStableSid":true,"localNativeGuard":true}],"walls":[[3,25,37,0],[3,26,37,0],[3,27,37,0],[3,28,25,0],[3,28,37,0],[3,29,25,0],[3,30,25,0],[3,32,25,0],[3,32,37,0],[3,33,37,0],[3,34,37,0],[3,35,37,0],[3,36,25,0],[3,36,37,0],[3,37,25,0],[3,37,26,0],[3,37,27,0],[3,25,28,0],[3,37,28,0],[3,25,32,0],[3,37,32,0],[3,37,33,0],[3,37,34,0],[3,37,35,0],[3,25,36,0],[3,37,36,0],[2,19,19,0],[2,19,43,0],[2,20,19,0],[2,21,19,0],[2,22,19,0],[2,23,19,0],[2,23,43,0],[2,24,19,0],[2,24,43,0],[2,25,19,0],[2,25,43,0],[2,26,19,0],[2,26,43,0],[2,27,19,0],[2,27,43,0],[2,28,19,0],[2,28,43,0],[2,29,19,0],[2,30,19,0],[2,32,19,0],[2,32,43,0],[2,33,19,0],[2,33,43,0],[2,34,19,0],[2,35,19,0],[2,36,19,0],[2,37,19,0],[2,37,43,0],[2,38,19,0],[2,38,43,0],[2,39,19,0],[2,39,43,0],[2,40,19,0],[2,40,43,0],[2,41,19,0],[2,41,43,0],[2,42,19,0],[2,43,19,0],[2,19,20,0],[2,19,21,0],[2,19,22,0],[2,19,23,0],[2,43,23,0],[2,19,24,0],[2,43,24,0],[2,19,25,0],[2,43,25,0],[2,19,26,0],[2,43,26,0],[2,19,27,0],[2,43,27,0],[2,19,28,0],[2,43,28,0],[2,19,29,0],[2,43,29,0],[2,19,30,0],[2,43,30,0],[2,19,32,0],[2,43,32,0],[2,19,33,0],[2,43,33,0],[2,19,34,0],[2,43,34,0],[2,19,35,0],[2,43,35,0],[2,19,36,0],[2,43,36,0],[2,19,37,0],[2,43,37,0],[2,19,38,0],[2,43,38,0],[2,19,39,0],[2,43,39,0],[2,19,40,0],[2,43,40,0],[2,19,41,0],[2,43,41,0],[2,19,42,0]]}},{"id":"scout-custom-13","headquartersLevel":5,"layout":{"stage":13,"name":"\u56de\u5b57\u91cd\u5899","source":"user-authored-layout","units":[{"sid":113001,"typeid":20105,"x":31,"y":31,"localNativeStableSid":true},{"sid":113002,"typeid":30106,"x":34,"y":34,"localNativeStableSid":true},{"sid":113003,"typeid":30105,"x":25,"y":34,"localNativeStableSid":true},{"sid":113004,"typeid":30105,"x":25,"y":25,"localNativeStableSid":true},{"sid":113005,"typeid":30306,"x":34,"y":25,"localNativeStableSid":true},{"sid":113006,"typeid":30305,"x":34,"y":31,"localNativeStableSid":true},{"sid":113007,"typeid":30305,"x":25,"y":31,"localNativeStableSid":true},{"sid":113008,"typeid":30804,"x":38,"y":38,"localNativeStableSid":true},{"sid":113009,"typeid":30804,"x":22,"y":22,"localNativeStableSid":true},{"sid":113010,"typeid":30203,"x":38,"y":31,"localNativeStableSid":true},{"sid":113011,"typeid":30403,"x":22,"y":31,"localNativeStableSid":true},{"sid":113012,"typeid":30501,"x":31,"y":38,"localNativeStableSid":true},{"sid":113013,"typeid":20605,"x":31,"y":26,"localNativeStableSid":true},{"sid":113014,"typeid":20703,"x":18,"y":18,"localNativeStableSid":true},{"sid":113015,"typeid":20703,"x":42,"y":18,"localNativeStableSid":true},{"sid":113016,"typeid":20702,"x":18,"y":42,"localNativeStableSid":true},{"sid":113017,"typeid":20801,"x":42,"y":42,"localNativeStableSid":true},{"sid":113018,"typeid":20901,"x":24,"y":44,"localNativeStableSid":true},{"sid":113019,"typeid":21001,"x":44,"y":24,"localNativeStableSid":true},{"sid":113020,"typeid":21201,"x":14,"y":27,"localNativeStableSid":true},{"sid":113021,"typeid":21201,"x":14,"y":30,"localNativeStableSid":true},{"sid":113022,"typeid":21201,"x":27,"y":14,"localNativeStableSid":true},{"sid":113023,"typeid":21201,"x":30,"y":14,"localNativeStableSid":true},{"sid":113024,"typeid":20508,"x":15,"y":36,"localNativeStableSid":true},{"sid":113025,"typeid":20308,"x":18,"y":37,"localNativeStableSid":true},{"sid":113026,"typeid":20408,"x":13,"y":40,"localNativeStableSid":true},{"sid":113027,"typeid":20208,"x":21,"y":42,"localNativeStableSid":true},{"sid":113028,"id":113028,"typeid":10501,"unit_type":105,"unit_level":1,"unit_mutateid":0,"lv":30,"xp":0,"state":2,"did":"113002","defense_id":"113002","rct":0,"aht":0,"aidx":-1,"skills":[10501,14604,14904,15204],"localNativeStableSid":true,"localNativeGuard":true},{"sid":113029,"id":113029,"typeid":11201,"unit_type":112,"unit_level":1,"unit_mutateid":0,"lv":35,"xp":0,"state":2,"did":"113003","defense_id":"113003","rct":0,"aht":0,"aidx":-1,"skills":[11201,24003,24704,24904],"localNativeStableSid":true,"localNativeGuard":true},{"sid":113030,"id":113030,"typeid":11101,"unit_type":111,"unit_level":1,"unit_mutateid":0,"lv":28,"xp":0,"state":2,"did":"113004","defense_id":"113004","rct":0,"aht":0,"aidx":-1,"skills":[11101,22804,23404,23704],"localNativeStableSid":true,"localNativeGuard":true}],"walls":[[3,26,26,0],[3,26,36,0],[3,27,26,0],[3,27,36,0],[3,28,36,0],[3,32,26,0],[3,32,36,0],[3,33,26,0],[3,33,36,0],[3,34,26,0],[3,34,36,0],[3,35,26,0],[3,35,36,0],[3,36,26,0],[3,26,27,0],[3,36,27,0],[3,26,28,0],[3,36,28,0],[3,26,29,0],[3,26,30,0],[3,26,31,0],[3,26,32,0],[3,36,32,0],[3,26,33,0],[3,36,33,0],[3,26,34,0],[3,36,34,0],[3,26,35,0],[3,36,35,0],[3,22,41,0],[3,23,21,0],[3,23,41,0],[3,24,21,0],[3,24,41,0],[3,25,21,0],[3,25,41,0],[3,26,21,0],[3,26,41,0],[3,27,21,0],[3,27,41,0],[3,28,21,0],[3,28,41,0],[3,29,21,0],[3,29,41,0],[3,30,21,0],[3,30,41,0],[3,31,21,0],[3,31,41,0],[3,32,21,0],[3,32,41,0],[3,33,21,0],[3,33,41,0],[3,34,21,0],[3,34,41,0],[3,35,21,0],[3,35,41,0],[3,36,21,0],[3,36,41,0],[3,37,21,0],[3,37,41,0],[3,38,21,0],[3,38,41,0],[3,39,21,0],[3,39,41,0],[3,40,21,0],[3,41,21,0],[3,41,22,0],[3,21,23,0],[3,41,23,0],[3,21,24,0],[3,41,24,0],[3,21,25,0],[3,41,25,0],[3,21,26,0],[3,41,26,0],[3,21,27,0],[3,41,27,0],[3,21,28,0],[3,41,28,0],[3,41,29,0],[3,41,30,0],[3,41,31,0],[3,21,32,0],[3,41,32,0],[3,21,33,0],[3,41,33,0],[3,21,34,0],[3,41,34,0],[3,21,35,0],[3,41,35,0],[3,21,36,0],[3,41,36,0],[3,21,37,0],[3,41,37,0],[3,21,38,0],[3,41,38,0],[3,21,39,0],[3,41,39,0],[2,14,45,0],[2,15,45,0],[2,16,45,0],[2,17,45,0],[2,18,45,0],[2,19,14,0],[2,19,45,0],[2,20,14,0],[2,20,45,0],[2,21,14,0],[2,21,45,0],[2,22,14,0],[2,22,45,0],[2,23,14,0],[2,23,45,0],[2,24,14,0],[2,24,45,0],[2,25,14,0],[2,25,45,0],[2,26,45,0],[2,27,45,0],[2,28,14,0],[2,28,45,0],[2,29,45,0],[2,30,45,0],[2,31,14,0],[2,31,45,0],[2,32,14,0],[2,32,45,0],[2,33,14,0],[2,33,45,0],[2,34,14,0],[2,34,45,0],[2,35,14,0],[2,35,45,0],[2,36,14,0],[2,36,45,0],[2,37,14,0],[2,37,45,0],[2,38,45,0],[2,39,45,0],[2,40,45,0],[2,41,45,0],[2,42,45,0],[2,43,14,0],[2,43,45,0],[2,44,14,0],[2,44,45,0],[2,45,14,0],[2,45,45,0],[2,45,15,0],[2,45,16,0],[2,45,17,0],[2,45,18,0],[2,14,19,0],[2,45,19,0],[2,14,20,0],[2,45,20,0],[2,14,21,0],[2,45,21,0],[2,14,22,0],[2,45,22,0],[2,14,23,0],[2,45,23,0],[2,14,24,0],[2,45,24,0],[2,14,25,0],[2,45,25,0],[2,45,26,0],[2,45,27,0],[2,14,28,0],[2,45,28,0],[2,45,29,0],[2,45,30,0],[2,14,31,0],[2,45,31,0],[2,14,32,0],[2,45,32,0],[2,14,33,0],[2,45,33,0],[2,45,34,0],[2,45,35,0],[2,45,36,0],[2,14,37,0],[2,45,37,0],[2,45,38,0],[2,45,39,0],[2,45,40,0],[2,45,41,0],[2,45,42,0],[2,14,43,0],[2,45,43,0],[2,14,44,0],[2,45,44,0],[3,22,33,0],[3,22,34,0],[3,37,33,0],[3,38,33,0],[3,39,33,0],[3,40,33,0],[3,37,34,0],[3,38,34,0],[3,39,34,0],[3,40,34,0],[3,33,22,0],[3,34,22,0],[3,33,37,0],[3,33,38,0],[3,33,39,0],[3,33,40,0],[3,34,37,0],[3,34,38,0],[3,34,39,0],[3,34,40,0]]}},{"id":"scout-custom-14","headquartersLevel":5,"layout":{"stage":14,"name":"\u8702\u5de2\u8ff7\u9635","source":"user-authored-layout","units":[{"sid":114001,"typeid":20105,"x":31,"y":31,"localNativeStableSid":true},{"sid":114002,"typeid":30105,"x":35,"y":35,"localNativeStableSid":true},{"sid":114003,"typeid":30105,"x":27,"y":35,"localNativeStableSid":true},{"sid":114004,"typeid":30105,"x":27,"y":27,"localNativeStableSid":true},{"sid":114005,"typeid":30305,"x":35,"y":27,"localNativeStableSid":true},{"sid":114006,"typeid":30304,"x":35,"y":31,"localNativeStableSid":true},{"sid":114007,"typeid":30304,"x":27,"y":31,"localNativeStableSid":true},{"sid":114008,"typeid":30803,"x":35,"y":39,"localNativeStableSid":true},{"sid":114009,"typeid":30803,"x":27,"y":23,"localNativeStableSid":true},{"sid":114010,"typeid":30202,"x":39,"y":27,"localNativeStableSid":true},{"sid":114011,"typeid":30402,"x":23,"y":35,"localNativeStableSid":true},{"sid":114012,"typeid":30501,"x":31,"y":39,"localNativeStableSid":true},{"sid":114013,"typeid":20604,"x":35,"y":23,"localNativeStableSid":true},{"sid":114014,"typeid":20702,"x":17,"y":17,"localNativeStableSid":true},{"sid":114015,"typeid":20702,"x":43,"y":17,"localNativeStableSid":true},{"sid":114016,"typeid":20703,"x":17,"y":43,"localNativeStableSid":true},{"sid":114017,"typeid":20801,"x":43,"y":43,"localNativeStableSid":true},{"sid":114018,"typeid":20901,"x":23,"y":44,"localNativeStableSid":true},{"sid":114019,"typeid":21001,"x":44,"y":23,"localNativeStableSid":true},{"sid":114020,"typeid":21201,"x":14,"y":22,"localNativeStableSid":true},{"sid":114021,"typeid":21201,"x":14,"y":25,"localNativeStableSid":true},{"sid":114022,"typeid":21201,"x":22,"y":14,"localNativeStableSid":true},{"sid":114023,"typeid":21201,"x":25,"y":14,"localNativeStableSid":true},{"sid":114024,"typeid":20507,"x":38,"y":13,"localNativeStableSid":true},{"sid":114025,"typeid":20307,"x":46,"y":15,"localNativeStableSid":true},{"sid":114026,"typeid":20407,"x":13,"y":38,"localNativeStableSid":true},{"sid":114027,"typeid":20207,"x":15,"y":46,"localNativeStableSid":true},{"sid":114028,"id":114028,"typeid":10501,"unit_type":105,"unit_level":1,"unit_mutateid":0,"lv":27,"xp":0,"state":2,"did":"114002","defense_id":"114002","rct":0,"aht":0,"aidx":-1,"skills":[10501,14603,14903],"localNativeStableSid":true,"localNativeGuard":true},{"sid":114029,"id":114029,"typeid":10901,"unit_type":109,"unit_level":1,"unit_mutateid":0,"lv":31,"xp":0,"state":2,"did":"114003","defense_id":"114003","rct":0,"aht":0,"aidx":-1,"skills":[10901,20203,20603,21103],"localNativeStableSid":true,"localNativeGuard":true},{"sid":114030,"id":114030,"typeid":10801,"unit_type":108,"unit_level":1,"unit_mutateid":0,"lv":25,"xp":0,"state":2,"did":"114004","defense_id":"114004","rct":0,"aht":0,"aidx":-1,"skills":[10801,18903,19103,19603],"localNativeStableSid":true,"localNativeGuard":true}],"walls":[[3,24,24,0],[3,24,38,0],[3,25,24,0],[3,25,38,0],[3,26,24,0],[3,26,38,0],[3,27,24,0],[3,27,38,0],[3,28,24,0],[3,28,38,0],[3,29,24,0],[3,30,24,0],[3,31,24,0],[3,32,24,0],[3,32,38,0],[3,33,24,0],[3,34,24,0],[3,35,24,0],[3,36,24,0],[3,36,38,0],[3,37,24,0],[3,37,38,0],[3,38,24,0],[3,38,38,0],[3,24,25,0],[3,24,26,0],[3,24,27,0],[3,24,28,0],[3,38,28,0],[3,24,29,0],[3,38,29,0],[3,24,30,0],[3,38,30,0],[3,24,31,0],[3,38,31,0],[3,24,32,0],[3,38,32,0],[3,24,33,0],[3,38,33,0],[3,24,34,0],[3,38,34,0],[3,24,35,0],[3,38,35,0],[3,24,36,0],[3,38,36,0],[3,24,37,0],[3,38,37,0],[2,14,26,0],[2,15,26,0],[2,16,26,0],[2,17,26,0],[2,18,26,0],[2,19,26,0],[2,20,26,0],[2,20,25,0],[2,20,24,0],[2,20,23,0],[2,20,22,0],[2,20,21,0],[2,20,20,0],[2,42,26,0],[2,43,26,0],[2,44,26,0],[2,45,26,0],[2,46,26,0],[2,42,25,0],[2,42,24,0],[2,42,20,0],[2,14,36,0],[2,15,36,0],[2,16,36,0],[2,17,36,0],[2,18,36,0],[2,19,36,0],[2,20,36,0],[2,20,37,0],[2,20,38,0],[2,20,39,0],[2,20,40,0],[2,20,41,0],[2,20,42,0],[2,42,36,0],[2,43,36,0],[2,44,36,0],[2,45,36,0],[2,46,36,0],[2,42,37,0],[2,42,38,0],[2,42,39,0],[2,42,40,0],[2,26,14,0],[2,26,15,0],[2,26,16,0],[2,26,17,0],[2,26,18,0],[2,26,19,0],[2,26,20,0],[2,27,14,0],[2,28,14,0],[2,29,14,0],[2,30,14,0],[2,31,14,0],[2,32,14,0],[2,36,14,0],[2,36,15,0],[2,36,16,0],[2,36,17,0],[2,36,18,0],[2,36,19,0],[2,36,20,0],[2,37,14,0],[2,38,14,0],[2,26,42,0],[2,26,43,0],[2,26,44,0],[2,26,45,0],[2,26,46,0],[2,27,46,0],[2,28,46,0],[2,29,46,0],[2,30,46,0],[2,31,46,0],[2,32,46,0],[2,36,42,0],[2,36,43,0],[2,36,44,0],[2,36,45,0],[2,36,46,0],[2,37,46,0],[2,38,46,0],[2,39,46,0],[2,40,46,0],[2,41,46,0],[2,42,46,0],[2,16,45,0],[2,17,45,0],[2,18,13,0],[2,18,45,0],[2,19,13,0],[2,19,45,0],[2,20,13,0],[2,20,45,0],[2,21,45,0],[2,22,45,0],[2,23,13,0],[2,23,45,0],[2,24,45,0],[2,25,45,0],[2,26,13,0],[2,27,13,0],[2,27,45,0],[2,28,13,0],[2,28,45,0],[2,29,13,0],[2,29,45,0],[2,30,13,0],[2,30,45,0],[2,31,13,0],[2,31,45,0],[2,32,13,0],[2,32,45,0],[2,33,13,0],[2,33,45,0],[2,34,13,0],[2,34,45,0],[2,35,13,0],[2,35,45,0],[2,37,45,0],[2,38,45,0],[2,39,45,0],[2,40,45,0],[2,41,45,0],[2,42,45,0],[2,43,45,0],[2,44,45,0],[2,45,45,0],[2,45,16,0],[2,45,17,0],[2,13,18,0],[2,45,18,0],[2,13,19,0],[2,45,19,0],[2,13,20,0],[2,45,20,0],[2,45,21,0],[2,45,22,0],[2,13,23,0],[2,45,23,0],[2,45,24,0],[2,45,25,0],[2,13,26,0],[2,13,27,0],[2,45,27,0],[2,13,28,0],[2,45,28,0],[2,13,29,0],[2,45,29,0],[2,13,30,0],[2,45,30,0],[2,13,31,0],[2,45,31,0],[2,13,32,0],[2,45,32,0],[2,13,33,0],[2,45,33,0],[2,13,34,0],[2,45,34,0],[2,13,35,0],[2,45,35,0],[2,45,37,0],[2,45,38,0],[2,45,39,0],[2,45,40,0],[2,45,41,0],[2,45,42,0],[2,45,43,0],[2,45,44,0]]}},{"id":"scout-custom-15","headquartersLevel":5,"layout":{"stage":15,"name":"\u957f\u86c7\u9501\u94fe","source":"user-authored-layout","units":[{"sid":115001,"typeid":20105,"x":28,"y":32,"localNativeStableSid":true},{"sid":115002,"typeid":30105,"x":32,"y":36,"localNativeStableSid":true},{"sid":115003,"typeid":30105,"x":23,"y":36,"localNativeStableSid":true},{"sid":115004,"typeid":30104,"x":23,"y":28,"localNativeStableSid":true},{"sid":115005,"typeid":30305,"x":32,"y":28,"localNativeStableSid":true},{"sid":115006,"typeid":30304,"x":32,"y":32,"localNativeStableSid":true},{"sid":115007,"typeid":30304,"x":23,"y":32,"localNativeStableSid":true},{"sid":115008,"typeid":30803,"x":36,"y":40,"localNativeStableSid":true},{"sid":115009,"typeid":30803,"x":20,"y":24,"localNativeStableSid":true},{"sid":115010,"typeid":30202,"x":36,"y":32,"localNativeStableSid":true},{"sid":115011,"typeid":30402,"x":19,"y":32,"localNativeStableSid":true},{"sid":115012,"typeid":30501,"x":28,"y":40,"localNativeStableSid":true},{"sid":115013,"typeid":20605,"x":32,"y":24,"localNativeStableSid":true},{"sid":115014,"typeid":20703,"x":17,"y":17,"localNativeStableSid":true},{"sid":115015,"typeid":20702,"x":42,"y":17,"localNativeStableSid":true},{"sid":115016,"typeid":20702,"x":17,"y":37,"localNativeStableSid":true},{"sid":115017,"typeid":20801,"x":42,"y":39,"localNativeStableSid":true},{"sid":115018,"typeid":20901,"x":24,"y":44,"localNativeStableSid":true},{"sid":115019,"typeid":21001,"x":43,"y":28,"localNativeStableSid":true},{"sid":115020,"typeid":21201,"x":14,"y":28,"localNativeStableSid":true},{"sid":115021,"typeid":21201,"x":14,"y":31,"localNativeStableSid":true},{"sid":115022,"typeid":21201,"x":28,"y":14,"localNativeStableSid":true},{"sid":115023,"typeid":21201,"x":31,"y":14,"localNativeStableSid":true},{"sid":115024,"typeid":20507,"x":40,"y":20,"localNativeStableSid":true},{"sid":115025,"typeid":20307,"x":43,"y":23,"localNativeStableSid":true},{"sid":115026,"typeid":20407,"x":16,"y":20,"localNativeStableSid":true},{"sid":115027,"typeid":20207,"x":19,"y":21,"localNativeStableSid":true},{"sid":115028,"id":115028,"typeid":10701,"unit_type":107,"unit_level":1,"unit_mutateid":0,"lv":29,"xp":0,"state":2,"did":"115002","defense_id":"115002","rct":0,"aht":0,"aidx":-1,"skills":[10701,17503,18103,17403],"localNativeStableSid":true,"localNativeGuard":true},{"sid":115029,"id":115029,"typeid":11001,"unit_type":110,"unit_level":1,"unit_mutateid":0,"lv":26,"xp":0,"state":2,"did":"115003","defense_id":"115003","rct":0,"aht":0,"aidx":-1,"skills":[11001,22003,22203],"localNativeStableSid":true,"localNativeGuard":true},{"sid":115030,"id":115030,"typeid":11201,"unit_type":112,"unit_level":1,"unit_mutateid":0,"lv":38,"xp":0,"state":2,"did":"115004","defense_id":"115004","rct":0,"aht":0,"aidx":-1,"skills":[11201,23903,24803,24903],"localNativeStableSid":true,"localNativeGuard":true}],"walls":[[3,21,38,0],[3,22,38,0],[3,23,38,0],[3,24,26,0],[3,24,38,0],[3,25,26,0],[3,25,38,0],[3,26,26,0],[3,27,26,0],[3,28,26,0],[3,29,26,0],[3,29,38,0],[3,30,38,0],[3,31,38,0],[3,32,38,0],[3,33,26,0],[3,33,38,0],[3,34,26,0],[3,34,27,0],[3,34,28,0],[3,21,29,0],[3,34,29,0],[3,21,33,0],[3,34,33,0],[3,34,34,0],[3,34,35,0],[3,34,36,0],[3,21,37,0],[3,34,37,0],[2,14,22,0],[2,15,22,0],[2,16,22,0],[2,17,22,0],[2,21,22,0],[2,22,22,0],[2,23,22,0],[2,24,22,0],[2,25,22,0],[2,26,22,0],[2,27,22,0],[2,28,22,0],[2,33,22,0],[2,34,22,0],[2,35,22,0],[2,36,22,0],[2,37,22,0],[2,38,22,0],[2,39,22,0],[2,40,22,0],[2,16,23,0],[2,16,24,0],[2,16,25,0],[2,16,26,0],[2,16,27,0],[2,16,28,0],[2,16,29,0],[2,16,30,0],[2,16,31,0],[2,16,32,0],[2,16,38,0],[2,16,39,0],[2,16,40,0],[2,17,40,0],[2,18,40,0],[2,19,40,0],[2,20,40,0],[2,21,40,0],[2,22,40,0],[2,23,40,0],[2,24,40,0],[2,25,40,0],[2,29,40,0],[2,30,40,0],[2,31,40,0],[2,32,40,0],[2,33,40,0],[2,37,40,0],[2,38,40,0],[2,39,40,0],[2,40,40,0],[2,40,23,0],[2,40,24,0],[2,40,25,0],[2,40,26,0],[2,40,27,0],[2,40,28,0],[2,40,29,0],[2,40,30,0],[2,40,31,0],[2,40,32,0],[2,40,33,0],[2,40,34,0],[2,40,35,0],[2,40,36,0],[3,24,27,0],[3,24,28,0],[3,24,29,0],[3,24,30,0],[3,24,31,0],[3,31,33,0],[3,31,37,0],[2,13,45,0],[2,14,45,0],[2,15,45,0],[2,16,45,0],[2,17,45,0],[2,18,13,0],[2,18,45,0],[2,19,13,0],[2,19,45,0],[2,20,13,0],[2,20,45,0],[2,21,13,0],[2,21,45,0],[2,22,13,0],[2,22,45,0],[2,23,13,0],[2,23,45,0],[2,24,13,0],[2,24,45,0],[2,25,13,0],[2,25,45,0],[2,26,13,0],[2,26,45,0],[2,27,45,0],[2,28,45,0],[2,29,13,0],[2,29,45,0],[2,30,45,0],[2,31,45,0],[2,32,13,0],[2,32,45,0],[2,33,13,0],[2,33,45,0],[2,34,13,0],[2,34,45,0],[2,35,13,0],[2,35,45,0],[2,36,13,0],[2,36,45,0],[2,37,13,0],[2,37,45,0],[2,38,45,0],[2,39,45,0],[2,40,45,0],[2,41,45,0],[2,42,45,0],[2,43,13,0],[2,43,45,0],[2,44,13,0],[2,44,45,0],[2,45,13,0],[2,45,45,0],[2,45,14,0],[2,45,15,0],[2,45,16,0],[2,45,17,0],[2,13,18,0],[2,45,18,0],[2,13,19,0],[2,45,19,0],[2,13,20,0],[2,45,20,0],[2,13,21,0],[2,45,21,0],[2,13,22,0],[2,45,22,0],[2,13,23,0],[2,45,23,0],[2,13,24,0],[2,45,24,0],[2,13,25,0],[2,45,25,0],[2,13,26,0],[2,45,26,0],[2,45,27,0],[2,45,28,0],[2,13,29,0],[2,45,29,0],[2,45,30,0],[2,45,31,0],[2,13,32,0],[2,45,32,0],[2,45,33,0],[2,45,34,0],[2,45,35,0],[2,45,36,0],[2,45,37,0],[2,13,38,0],[2,45,38,0],[2,13,39,0],[2,45,39,0],[2,13,40,0],[2,45,40,0],[2,13,41,0],[2,45,41,0],[2,13,42,0],[2,45,42,0],[2,13,43,0],[2,45,43,0],[2,13,44,0],[2,45,44,0]]}},{"id":"scout-custom-16","headquartersLevel":5,"layout":{"stage":16,"name":"\u53cc\u73af\u5b88\u536b","source":"user-authored-layout","units":[{"sid":116001,"typeid":20105,"x":31,"y":31,"localNativeStableSid":true},{"sid":116002,"typeid":30106,"x":33,"y":35,"localNativeStableSid":true},{"sid":116003,"typeid":30105,"x":25,"y":35,"localNativeStableSid":true},{"sid":116004,"typeid":30105,"x":25,"y":25,"localNativeStableSid":true},{"sid":116005,"typeid":30306,"x":33,"y":25,"localNativeStableSid":true},{"sid":116006,"typeid":30305,"x":35,"y":31,"localNativeStableSid":true},{"sid":116007,"typeid":30305,"x":25,"y":31,"localNativeStableSid":true},{"sid":116008,"typeid":30804,"x":37,"y":21,"localNativeStableSid":true},{"sid":116009,"typeid":30804,"x":29,"y":38,"localNativeStableSid":true},{"sid":116010,"typeid":30203,"x":36,"y":35,"localNativeStableSid":true},{"sid":116011,"typeid":30403,"x":22,"y":27,"localNativeStableSid":true},{"sid":116012,"typeid":30501,"x":31,"y":42,"localNativeStableSid":true},{"sid":116013,"typeid":20605,"x":38,"y":27,"localNativeStableSid":true},{"sid":116014,"typeid":20703,"x":16,"y":16,"localNativeStableSid":true},{"sid":116015,"typeid":20703,"x":43,"y":16,"localNativeStableSid":true},{"sid":116016,"typeid":20702,"x":16,"y":43,"localNativeStableSid":true},{"sid":116017,"typeid":20801,"x":43,"y":43,"localNativeStableSid":true},{"sid":116018,"typeid":20901,"x":23,"y":42,"localNativeStableSid":true},{"sid":116019,"typeid":21001,"x":42,"y":23,"localNativeStableSid":true},{"sid":116020,"typeid":21201,"x":14,"y":34,"localNativeStableSid":true},{"sid":116021,"typeid":21201,"x":14,"y":37,"localNativeStableSid":true},{"sid":116022,"typeid":21201,"x":34,"y":14,"localNativeStableSid":true},{"sid":116023,"typeid":21201,"x":37,"y":14,"localNativeStableSid":true},{"sid":116024,"typeid":20508,"x":20,"y":20,"localNativeStableSid":true},{"sid":116025,"typeid":20308,"x":24,"y":20,"localNativeStableSid":true},{"sid":116026,"typeid":20408,"x":42,"y":38,"localNativeStableSid":true},{"sid":116027,"typeid":20208,"x":38,"y":42,"localNativeStableSid":true},{"sid":116028,"id":116028,"typeid":10501,"unit_type":105,"unit_level":1,"unit_mutateid":0,"lv":32,"xp":0,"state":2,"did":"116002","defense_id":"116002","rct":0,"aht":0,"aidx":-1,"skills":[10501,14604,14904,15204],"localNativeStableSid":true,"localNativeGuard":true},{"sid":116029,"id":116029,"typeid":11201,"unit_type":112,"unit_level":1,"unit_mutateid":0,"lv":37,"xp":0,"state":2,"did":"116003","defense_id":"116003","rct":0,"aht":0,"aidx":-1,"skills":[11201,24004,24704,24804],"localNativeStableSid":true,"localNativeGuard":true},{"sid":116030,"id":116030,"typeid":11101,"unit_type":111,"unit_level":1,"unit_mutateid":0,"lv":30,"xp":0,"state":2,"did":"116004","defense_id":"116004","rct":0,"aht":0,"aidx":-1,"skills":[11101,22804,23404,23704],"localNativeStableSid":true,"localNativeGuard":true}],"walls":[[3,26,26,0],[3,26,36,0],[3,27,26,0],[3,28,26,0],[3,29,26,0],[3,30,26,0],[3,30,36,0],[3,31,26,0],[3,31,36,0],[3,32,26,0],[3,32,36,0],[3,33,26,0],[3,33,36,0],[3,34,26,0],[3,34,36,0],[3,35,36,0],[3,36,36,0],[3,24,27,0],[3,24,28,0],[3,38,28,0],[3,38,29,0],[3,38,30,0],[3,38,31,0],[3,24,32,0],[3,38,32,0],[3,38,33,0],[3,38,34,0],[3,38,35,0],[2,19,43,0],[2,20,43,0],[2,21,19,0],[2,21,43,0],[2,22,43,0],[2,23,43,0],[2,24,43,0],[2,25,19,0],[2,25,43,0],[2,26,19,0],[2,26,43,0],[2,27,19,0],[2,27,43,0],[2,28,19,0],[2,28,43,0],[2,29,19,0],[2,29,43,0],[2,30,19,0],[2,30,43,0],[2,31,19,0],[2,31,43,0],[2,32,19,0],[2,32,43,0],[2,33,19,0],[2,33,43,0],[2,34,19,0],[2,34,43,0],[2,35,43,0],[2,36,43,0],[2,37,43,0],[2,38,19,0],[2,38,43,0],[2,39,19,0],[2,39,43,0],[2,40,19,0],[2,40,43,0],[2,41,19,0],[2,42,19,0],[2,43,19,0],[2,43,20,0],[2,19,21,0],[2,43,21,0],[2,19,22,0],[2,43,22,0],[2,19,23,0],[2,43,23,0],[2,19,24,0],[2,43,24,0],[2,19,25,0],[2,43,25,0],[2,19,26,0],[2,43,26,0],[2,19,27,0],[2,43,27,0],[2,19,28,0],[2,43,28,0],[2,19,29,0],[2,43,29,0],[2,19,30,0],[2,43,30,0],[2,19,31,0],[2,43,31,0],[2,19,32,0],[2,43,32,0],[2,19,33,0],[2,43,33,0],[2,19,34,0],[2,43,34,0],[2,19,35,0],[2,43,35,0],[2,19,36,0],[2,43,36,0],[2,19,37,0],[2,43,37,0],[2,19,38,0],[2,43,38,0],[2,19,39,0],[2,43,39,0],[2,19,40,0],[2,43,40,0],[2,19,41,0],[2,19,42,0]]}},{"id":"scout-custom-17","headquartersLevel":5,"layout":{"stage":17,"name":"\u4e09\u9636\u68af\u9632","source":"user-authored-layout","units":[{"sid":117001,"typeid":20105,"x":31,"y":35,"localNativeStableSid":true},{"sid":117002,"typeid":30106,"x":35,"y":38,"localNativeStableSid":true},{"sid":117003,"typeid":30106,"x":27,"y":38,"localNativeStableSid":true},{"sid":117004,"typeid":30105,"x":31,"y":31,"localNativeStableSid":true},{"sid":117005,"typeid":30305,"x":35,"y":31,"localNativeStableSid":true},{"sid":117006,"typeid":30305,"x":27,"y":31,"localNativeStableSid":true},{"sid":117007,"typeid":30305,"x":31,"y":22,"localNativeStableSid":true},{"sid":117008,"typeid":30804,"x":35,"y":22,"localNativeStableSid":true},{"sid":117009,"typeid":30804,"x":27,"y":22,"localNativeStableSid":true},{"sid":117010,"typeid":30203,"x":38,"y":26,"localNativeStableSid":true},{"sid":117011,"typeid":30403,"x":24,"y":26,"localNativeStableSid":true},{"sid":117012,"typeid":30501,"x":31,"y":41,"localNativeStableSid":true},{"sid":117013,"typeid":20605,"x":42,"y":22,"localNativeStableSid":true},{"sid":117014,"typeid":20703,"x":16,"y":16,"localNativeStableSid":true},{"sid":117015,"typeid":20702,"x":43,"y":16,"localNativeStableSid":true},{"sid":117016,"typeid":20702,"x":16,"y":43,"localNativeStableSid":true},{"sid":117017,"typeid":20801,"x":43,"y":43,"localNativeStableSid":true},{"sid":117018,"typeid":20901,"x":22,"y":43,"localNativeStableSid":true},{"sid":117019,"typeid":21001,"x":43,"y":30,"localNativeStableSid":true},{"sid":117020,"typeid":21201,"x":14,"y":22,"localNativeStableSid":true},{"sid":117021,"typeid":21201,"x":14,"y":25,"localNativeStableSid":true},{"sid":117022,"typeid":21201,"x":22,"y":14,"localNativeStableSid":true},{"sid":117023,"typeid":21201,"x":25,"y":14,"localNativeStableSid":true},{"sid":117024,"typeid":20508,"x":42,"y":40,"localNativeStableSid":true},{"sid":117025,"typeid":20308,"x":39,"y":38,"localNativeStableSid":true},{"sid":117026,"typeid":20408,"x":20,"y":30,"localNativeStableSid":true},{"sid":117027,"typeid":20208,"x":20,"y":34,"localNativeStableSid":true},{"sid":117028,"id":117028,"typeid":10501,"unit_type":105,"unit_level":1,"unit_mutateid":0,"lv":35,"xp":0,"state":2,"did":"117002","defense_id":"117002","rct":0,"aht":0,"aidx":-1,"skills":[10501,14605,14905,15205],"localNativeStableSid":true,"localNativeGuard":true},{"sid":117029,"id":117029,"typeid":11201,"unit_type":112,"unit_level":1,"unit_mutateid":0,"lv":39,"xp":0,"state":2,"did":"117003","defense_id":"117003","rct":0,"aht":0,"aidx":-1,"skills":[11201,24005,24705,24905],"localNativeStableSid":true,"localNativeGuard":true},{"sid":117030,"id":117030,"typeid":11101,"unit_type":111,"unit_level":1,"unit_mutateid":0,"lv":33,"xp":0,"state":2,"did":"117004","defense_id":"117004","rct":0,"aht":0,"aidx":-1,"skills":[11101,22805,23405,23705],"localNativeStableSid":true,"localNativeGuard":true}],"walls":[[3,26,40,0],[3,27,40,0],[3,28,29,0],[3,28,40,0],[3,32,29,0],[3,32,40,0],[3,33,40,0],[3,34,40,0],[3,35,40,0],[3,36,29,0],[3,36,40,0],[3,36,30,0],[3,36,31,0],[3,26,32,0],[3,36,32,0],[3,26,33,0],[3,36,33,0],[3,26,34,0],[3,36,34,0],[3,26,35,0],[3,36,35,0],[3,36,36,0],[3,36,37,0],[3,36,38,0],[3,26,39,0],[3,36,39,0],[2,24,18,0],[2,24,28,0],[2,25,18,0],[2,25,28,0],[2,26,18,0],[2,26,28,0],[2,27,18,0],[2,27,28,0],[2,28,18,0],[2,28,28,0],[2,29,18,0],[2,29,28,0],[2,30,18,0],[2,30,28,0],[2,31,18,0],[2,31,28,0],[2,32,18,0],[2,32,28,0],[2,33,18,0],[2,33,28,0],[2,34,18,0],[2,34,28,0],[2,35,18,0],[2,35,28,0],[2,36,18,0],[2,36,28,0],[2,37,18,0],[2,37,28,0],[2,38,18,0],[2,38,28,0],[2,24,19,0],[2,38,19,0],[2,24,20,0],[2,38,20,0],[2,24,21,0],[2,38,21,0],[2,24,22,0],[2,38,22,0],[2,24,23,0],[2,38,23,0],[2,24,27,0],[2,38,27,0],[2,18,15,0],[2,18,45,0],[2,19,15,0],[2,19,45,0],[2,20,15,0],[2,20,45,0],[2,21,15,0],[2,21,45,0],[2,22,15,0],[2,22,45,0],[2,23,15,0],[2,23,45,0],[2,24,15,0],[2,24,45,0],[2,25,15,0],[2,25,45,0],[2,26,15,0],[2,26,45,0],[2,27,15,0],[2,27,45,0],[2,28,15,0],[2,28,45,0],[2,29,15,0],[2,29,45,0],[2,30,15,0],[2,30,45,0],[2,31,15,0],[2,31,45,0],[2,32,15,0],[2,32,45,0],[2,33,15,0],[2,33,45,0],[2,34,15,0],[2,34,45,0],[2,35,15,0],[2,35,45,0],[2,36,15,0],[2,36,45,0],[2,37,15,0],[2,37,45,0],[2,38,15,0],[2,38,45,0],[2,39,45,0],[2,40,45,0],[2,41,45,0],[2,42,45,0],[2,43,45,0],[2,44,15,0],[2,44,45,0],[2,18,16,0],[2,44,16,0],[2,18,17,0],[2,44,17,0],[2,18,18,0],[2,44,18,0],[2,18,19,0],[2,44,19,0],[2,18,20,0],[2,44,20,0],[2,18,21,0],[2,44,21,0],[2,18,22,0],[2,44,22,0],[2,18,23,0],[2,44,23,0],[2,18,24,0],[2,44,24,0],[2,18,25,0],[2,44,25,0],[2,18,26,0],[2,44,26,0],[2,18,27,0],[2,44,27,0],[2,44,28,0],[2,44,29,0],[2,44,30,0],[2,18,31,0],[2,44,31,0],[2,44,32,0],[2,44,33,0],[2,44,34,0],[2,18,35,0],[2,44,35,0],[2,18,36,0],[2,44,36,0],[2,18,37,0],[2,44,37,0],[2,18,38,0],[2,44,38,0],[2,18,39,0],[2,44,39,0],[2,18,40,0],[2,44,40,0],[2,18,41,0],[2,44,41,0],[2,18,42,0],[2,44,42,0],[2,18,43,0],[2,44,43,0],[2,18,44,0],[2,44,44,0],[2,21,30,0],[2,22,30,0],[2,23,30,0],[2,39,30,0],[2,40,30,0]]}},{"id":"scout-custom-18","headquartersLevel":7,"layout":{"stage":18,"name":"\u9f99\u5de2\u5929\u7f61","source":"user-authored-layout","units":[{"sid":118001,"typeid":20107,"x":31,"y":31,"localNativeStableSid":true},{"sid":118002,"typeid":30107,"x":34,"y":34,"localNativeStableSid":true},{"sid":118003,"typeid":30107,"x":25,"y":34,"localNativeStableSid":true},{"sid":118004,"typeid":30107,"x":25,"y":25,"localNativeStableSid":true},{"sid":118005,"typeid":30307,"x":34,"y":25,"localNativeStableSid":true},{"sid":118006,"typeid":30307,"x":34,"y":31,"localNativeStableSid":true},{"sid":118007,"typeid":30307,"x":25,"y":31,"localNativeStableSid":true},{"sid":118008,"typeid":30806,"x":38,"y":38,"localNativeStableSid":true},{"sid":118009,"typeid":30806,"x":21,"y":21,"localNativeStableSid":true},{"sid":118010,"typeid":30205,"x":38,"y":31,"localNativeStableSid":true},{"sid":118011,"typeid":30405,"x":21,"y":31,"localNativeStableSid":true},{"sid":118012,"typeid":30503,"x":31,"y":38,"localNativeStableSid":true},{"sid":118013,"typeid":20606,"x":31,"y":21,"localNativeStableSid":true},{"sid":118014,"typeid":20704,"x":17,"y":17,"localNativeStableSid":true},{"sid":118015,"typeid":20704,"x":43,"y":17,"localNativeStableSid":true},{"sid":118016,"typeid":20704,"x":17,"y":43,"localNativeStableSid":true},{"sid":118017,"typeid":20803,"x":43,"y":43,"localNativeStableSid":true},{"sid":118018,"typeid":20903,"x":25,"y":43,"localNativeStableSid":true},{"sid":118019,"typeid":21003,"x":43,"y":25,"localNativeStableSid":true},{"sid":118020,"typeid":21201,"x":14,"y":26,"localNativeStableSid":true},{"sid":118021,"typeid":21201,"x":14,"y":29,"localNativeStableSid":true},{"sid":118022,"typeid":21201,"x":26,"y":14,"localNativeStableSid":true},{"sid":118023,"typeid":21201,"x":29,"y":14,"localNativeStableSid":true},{"sid":118024,"typeid":20508,"x":44,"y":30,"localNativeStableSid":true},{"sid":118025,"typeid":20308,"x":44,"y":34,"localNativeStableSid":true},{"sid":118026,"typeid":20408,"x":18,"y":30,"localNativeStableSid":true},{"sid":118027,"typeid":20208,"x":18,"y":34,"localNativeStableSid":true},{"sid":118028,"id":118028,"typeid":10501,"unit_type":105,"unit_level":1,"unit_mutateid":0,"lv":36,"xp":0,"state":2,"did":"118002","defense_id":"118002","rct":0,"aht":0,"aidx":-1,"skills":[10501,14607,14907,15207],"localNativeStableSid":true,"localNativeGuard":true},{"sid":118029,"id":118029,"typeid":11201,"unit_type":112,"unit_level":1,"unit_mutateid":0,"lv":40,"xp":0,"state":2,"did":"118003","defense_id":"118003","rct":0,"aht":0,"aidx":-1,"skills":[11201,24007,24707,24907],"localNativeStableSid":true,"localNativeGuard":true},{"sid":118030,"id":118030,"typeid":11101,"unit_type":111,"unit_level":1,"unit_mutateid":0,"lv":37,"xp":0,"state":2,"did":"118004","defense_id":"118004","rct":0,"aht":0,"aidx":-1,"skills":[11101,22807,23407,23707],"localNativeStableSid":true,"localNativeGuard":true}],"walls":[[3,28,34,0],[3,29,34,0],[3,30,34,0],[3,31,34,0],[3,32,28,0],[3,33,28,0],[3,34,28,0],[3,28,32,0],[3,28,33,0],[3,23,36,0],[3,24,36,0],[3,25,36,0],[3,26,23,0],[3,26,36,0],[3,27,23,0],[3,27,36,0],[3,28,23,0],[3,28,36,0],[3,29,23,0],[3,30,23,0],[3,31,23,0],[3,32,36,0],[3,33,36,0],[3,34,36,0],[3,35,23,0],[3,35,36,0],[3,36,23,0],[3,36,24,0],[3,36,25,0],[3,23,26,0],[3,36,26,0],[3,23,27,0],[3,36,27,0],[3,23,28,0],[3,36,28,0],[3,36,32,0],[3,36,33,0],[3,36,34,0],[3,23,35,0],[3,36,35,0],[3,19,40,0],[3,20,40,0],[3,21,40,0],[3,22,19,0],[3,22,40,0],[3,23,19,0],[3,23,40,0],[3,24,19,0],[3,24,40,0],[3,25,19,0],[3,25,40,0],[3,26,19,0],[3,26,40,0],[3,27,19,0],[3,27,40,0],[3,28,40,0],[3,29,40,0],[3,30,40,0],[3,31,40,0],[3,32,19,0],[3,32,40,0],[3,33,19,0],[3,33,40,0],[3,34,19,0],[3,34,40,0],[3,35,19,0],[3,35,40,0],[3,36,19,0],[3,36,40,0],[3,37,19,0],[3,37,40,0],[3,38,19,0],[3,38,40,0],[3,39,19,0],[3,39,40,0],[3,40,19,0],[3,40,40,0],[3,40,20,0],[3,40,21,0],[3,19,22,0],[3,40,22,0],[3,19,23,0],[3,40,23,0],[3,19,24,0],[3,40,24,0],[3,19,25,0],[3,40,25,0],[3,19,26,0],[3,40,26,0],[3,19,27,0],[3,40,27,0],[3,19,28,0],[3,40,28,0],[3,40,29,0],[3,40,30,0],[3,40,31,0],[3,19,32,0],[3,40,32,0],[3,19,33,0],[3,40,33,0],[3,19,34,0],[3,40,34,0],[3,19,35,0],[3,40,35,0],[3,19,36,0],[3,40,36,0],[3,19,37,0],[3,40,37,0],[3,19,38,0],[3,40,38,0],[3,19,39,0],[3,40,39,0],[2,13,45,0],[2,14,45,0],[2,15,45,0],[2,16,45,0],[2,17,45,0],[2,18,13,0],[2,18,45,0],[2,19,13,0],[2,19,45,0],[2,20,13,0],[2,20,45,0],[2,21,13,0],[2,21,45,0],[2,22,13,0],[2,22,45,0],[2,23,13,0],[2,23,45,0],[2,24,13,0],[2,24,45,0],[2,25,45,0],[2,26,45,0],[2,27,13,0],[2,27,45,0],[2,28,45,0],[2,29,45,0],[2,30,13,0],[2,30,45,0],[2,31,13,0],[2,31,45,0],[2,32,13,0],[2,32,45,0],[2,33,13,0],[2,33,45,0],[2,34,13,0],[2,34,45,0],[2,35,13,0],[2,35,45,0],[2,36,13,0],[2,36,45,0],[2,37,13,0],[2,37,45,0],[2,38,13,0],[2,38,45,0],[2,39,45,0],[2,40,45,0],[2,41,45,0],[2,42,45,0],[2,43,45,0],[2,44,13,0],[2,44,45,0],[2,45,13,0],[2,45,45,0],[2,45,14,0],[2,45,15,0],[2,45,16,0],[2,45,17,0],[2,13,18,0],[2,45,18,0],[2,13,19,0],[2,45,19,0],[2,13,20,0],[2,45,20,0],[2,13,21,0],[2,45,21,0],[2,13,22,0],[2,45,22,0],[2,13,23,0],[2,45,23,0],[2,13,24,0],[2,45,24,0],[2,45,25,0],[2,45,26,0],[2,13,27,0],[2,45,27,0],[2,45,28,0],[2,45,29,0],[2,13,30,0],[2,45,30,0],[2,13,31,0],[2,45,31,0],[2,13,32,0],[2,45,32,0],[2,13,33,0],[2,45,33,0],[2,13,34,0],[2,45,34,0],[2,13,35,0],[2,45,35,0],[2,13,36,0],[2,45,36,0],[2,13,37,0],[2,45,37,0],[2,13,38,0],[2,45,38,0],[2,45,39,0],[2,45,40,0],[2,45,41,0],[2,45,42,0],[2,45,43,0],[2,13,44,0],[2,45,44,0]]}},{"id":"abbas","headquartersLevel":8,"layout":{"stage":901,"name":"abbas","source":"user-authored-layout","units":[{"sid":1001001,"typeid":20108,"x":31,"y":31,"localNativeStableSid":true},{"sid":1001002,"typeid":20506,"x":35,"y":31,"localNativeStableSid":true},{"sid":1001003,"typeid":20506,"x":27,"y":31,"localNativeStableSid":true},{"sid":1001004,"typeid":20506,"x":31,"y":35,"localNativeStableSid":true},{"sid":1001005,"typeid":20306,"x":31,"y":27,"localNativeStableSid":true},{"sid":1001006,"typeid":20306,"x":35,"y":27,"localNativeStableSid":true},{"sid":1001007,"typeid":20306,"x":27,"y":27,"localNativeStableSid":true},{"sid":1001008,"typeid":30206,"x":35,"y":35,"localNativeStableSid":true},{"sid":1001009,"typeid":30206,"x":27,"y":35,"localNativeStableSid":true},{"sid":1001010,"typeid":30206,"x":23,"y":31,"localNativeStableSid":true},{"sid":1001011,"typeid":30807,"x":35,"y":23,"localNativeStableSid":true},{"sid":1001012,"typeid":30807,"x":27,"y":23,"localNativeStableSid":true},{"sid":1001013,"typeid":30807,"x":39,"y":31,"localNativeStableSid":true},{"sid":1001014,"typeid":30807,"x":31,"y":39,"localNativeStableSid":true},{"sid":1001015,"typeid":30308,"x":39,"y":27,"localNativeStableSid":true},{"sid":1001016,"typeid":30308,"x":39,"y":35,"localNativeStableSid":true},{"sid":1001017,"typeid":30308,"x":23,"y":27,"localNativeStableSid":true},{"sid":1001018,"typeid":30308,"x":23,"y":35,"localNativeStableSid":true},{"sid":1001019,"typeid":30308,"x":31,"y":23,"localNativeStableSid":true},{"sid":1001020,"typeid":30406,"x":27,"y":39,"localNativeStableSid":true},{"sid":1001021,"typeid":30406,"x":35,"y":39,"localNativeStableSid":true},{"sid":1001022,"typeid":30506,"x":23,"y":23,"localNativeStableSid":true},{"sid":1001023,"typeid":30506,"x":39,"y":23,"localNativeStableSid":true},{"sid":1001024,"typeid":30506,"x":39,"y":39,"localNativeStableSid":true},{"sid":1001025,"typeid":30602,"x":19,"y":31,"localNativeStableSid":true},{"sid":1001026,"typeid":30602,"x":43,"y":31,"localNativeStableSid":true},{"sid":1001027,"typeid":30602,"x":31,"y":19,"localNativeStableSid":true},{"sid":1001028,"typeid":30701,"x":31,"y":43,"localNativeStableSid":true},{"sid":1001029,"typeid":30108,"x":19,"y":23,"localNativeStableSid":true},{"sid":1001030,"typeid":30108,"x":43,"y":23,"localNativeStableSid":true},{"sid":1001031,"typeid":30108,"x":19,"y":39,"localNativeStableSid":true},{"sid":1001032,"typeid":30108,"x":43,"y":39,"localNativeStableSid":true},{"sid":1001033,"typeid":20607,"x":23,"y":43,"localNativeStableSid":true},{"sid":1001034,"typeid":20807,"x":43,"y":43,"localNativeStableSid":true},{"sid":1001035,"typeid":20908,"x":19,"y":27,"localNativeStableSid":true},{"sid":1001036,"typeid":21004,"x":43,"y":27,"localNativeStableSid":true},{"sid":1001037,"typeid":21201,"x":17,"y":35,"localNativeStableSid":true},{"sid":1001038,"typeid":21201,"x":17,"y":19,"localNativeStableSid":true},{"sid":1001039,"typeid":21201,"x":45,"y":35,"localNativeStableSid":true},{"sid":1001040,"typeid":21201,"x":45,"y":19,"localNativeStableSid":true},{"sid":1001041,"typeid":21201,"x":35,"y":17,"localNativeStableSid":true},{"sid":1001042,"typeid":20708,"x":23,"y":19,"localNativeStableSid":true},{"sid":1001043,"typeid":20708,"x":15,"y":31,"localNativeStableSid":true},{"sid":1001044,"typeid":20708,"x":15,"y":15,"localNativeStableSid":true},{"sid":1001045,"typeid":20708,"x":15,"y":20,"localNativeStableSid":true},{"sid":1001046,"typeid":20204,"x":27,"y":15,"localNativeStableSid":true},{"sid":1001047,"typeid":20204,"x":35,"y":15,"localNativeStableSid":true},{"sid":1001048,"typeid":20204,"x":43,"y":19,"localNativeStableSid":true},{"sid":1001049,"typeid":20204,"x":47,"y":27,"localNativeStableSid":true},{"sid":1001050,"typeid":20204,"x":14,"y":23,"localNativeStableSid":true},{"sid":1001051,"typeid":20204,"x":14,"y":26,"localNativeStableSid":true},{"sid":1001052,"typeid":20404,"x":15,"y":35,"localNativeStableSid":true},{"sid":1001053,"typeid":20404,"x":19,"y":47,"localNativeStableSid":true},{"sid":1001054,"typeid":20404,"x":27,"y":47,"localNativeStableSid":true},{"sid":1001055,"typeid":20404,"x":35,"y":47,"localNativeStableSid":true},{"sid":1001056,"typeid":20404,"x":43,"y":47,"localNativeStableSid":true},{"sid":1001057,"typeid":20404,"x":14,"y":38,"localNativeStableSid":true},{"sid":1001058,"typeid":50601,"x":14,"y":40,"localNativeStableSid":true},{"sid":1001059,"typeid":50601,"x":14,"y":42,"localNativeStableSid":true},{"sid":1001060,"typeid":50701,"x":14,"y":44,"localNativeStableSid":true},{"sid":1001061,"typeid":50701,"x":14,"y":46,"localNativeStableSid":true},{"sid":1001062,"typeid":50501,"x":14,"y":48,"localNativeStableSid":true},{"sid":1001063,"typeid":50501,"x":16,"y":22,"localNativeStableSid":true},{"sid":1001064,"typeid":40101,"x":24,"y":24,"localNativeStableSid":true},{"sid":1001065,"typeid":40101,"x":36,"y":24,"localNativeStableSid":true},{"sid":1001066,"typeid":40101,"x":30,"y":20,"localNativeStableSid":true},{"sid":1001067,"typeid":40201,"x":24,"y":36,"localNativeStableSid":true},{"sid":1001068,"typeid":40201,"x":36,"y":36,"localNativeStableSid":true},{"sid":1001069,"typeid":40201,"x":30,"y":40,"localNativeStableSid":true},{"sid":1001070,"typeid":40301,"x":20,"y":30,"localNativeStableSid":true},{"sid":1001071,"typeid":40301,"x":40,"y":30,"localNativeStableSid":true},{"sid":1001072,"typeid":40301,"x":26,"y":20,"localNativeStableSid":true},{"sid":1001073,"typeid":40301,"x":34,"y":20,"localNativeStableSid":true},{"sid":1001074,"typeid":40301,"x":26,"y":40,"localNativeStableSid":true},{"sid":1001075,"typeid":40301,"x":34,"y":40,"localNativeStableSid":true},{"sid":1001076,"id":1001076,"typeid":11201,"unit_type":112,"unit_level":1,"unit_mutateid":0,"lv":55,"xp":0,"state":2,"did":"1001029","defense_id":"1001029","rct":0,"aht":0,"aidx":-1,"skills":[11201,24007,24107,23907],"localNativeStableSid":true,"localNativeGuard":true},{"sid":1001077,"id":1001077,"typeid":11101,"unit_type":111,"unit_level":1,"unit_mutateid":0,"lv":52,"xp":0,"state":2,"did":"1001030","defense_id":"1001030","rct":0,"aht":0,"aidx":-1,"skills":[11101,22807,22907,23007],"localNativeStableSid":true,"localNativeGuard":true},{"sid":1001078,"id":1001078,"typeid":10701,"unit_type":107,"unit_level":1,"unit_mutateid":0,"lv":50,"xp":0,"state":2,"did":"1001031","defense_id":"1001031","rct":0,"aht":0,"aidx":-1,"skills":[10701,17407,17607,17507],"localNativeStableSid":true,"localNativeGuard":true},{"sid":1001079,"id":1001079,"typeid":11501,"unit_type":115,"unit_level":1,"unit_mutateid":0,"lv":48,"xp":0,"state":2,"did":"1001032","defense_id":"1001032","rct":0,"aht":0,"aidx":-1,"skills":[11501,26707,26907,26807],"localNativeStableSid":true,"localNativeGuard":true},{"sid":1001080,"id":1001080,"typeid":10501,"unit_type":105,"unit_level":1,"unit_mutateid":0,"lv":45,"xp":0,"state":2,"did":"1001058","defense_id":"1001058","rct":0,"aht":0,"aidx":-1,"skills":[10501,14707,14607,14507],"localNativeStableSid":true,"localNativeGuard":true},{"sid":1001081,"id":1001081,"typeid":10801,"unit_type":108,"unit_level":1,"unit_mutateid":0,"lv":45,"xp":0,"state":2,"did":"1001059","defense_id":"1001059","rct":0,"aht":0,"aidx":-1,"skills":[10801,19107,18907,19007],"localNativeStableSid":true,"localNativeGuard":true},{"sid":1001082,"id":1001082,"typeid":11001,"unit_type":110,"unit_level":1,"unit_mutateid":0,"lv":42,"xp":0,"state":2,"did":"1001060","defense_id":"1001060","rct":0,"aht":0,"aidx":-1,"skills":[11001,21607,21707,21807],"localNativeStableSid":true,"localNativeGuard":true},{"sid":1001083,"id":1001083,"typeid":11301,"unit_type":113,"unit_level":1,"unit_mutateid":0,"lv":40,"xp":0,"state":2,"did":"1001061","defense_id":"1001061","rct":0,"aht":0,"aidx":-1,"skills":[11301,709110,709210,709310],"localNativeStableSid":true,"localNativeGuard":true}],"walls":[[8,16,16,0],[8,16,46,0],[8,17,16,0],[8,18,16,0],[8,20,46,0],[8,21,46,0],[8,22,46,0],[8,23,46,0],[8,24,16,0],[8,24,46,0],[8,25,16,0],[8,26,16,0],[8,27,16,0],[8,28,16,0],[8,28,46,0],[8,29,16,0],[8,29,46,0],[8,30,16,0],[8,30,46,0],[8,31,16,0],[8,31,46,0],[8,32,16,0],[8,32,46,0],[8,33,16,0],[8,36,16,0],[8,36,46,0],[8,37,16,0],[8,37,46,0],[8,38,16,0],[8,38,46,0],[8,39,16,0],[8,39,46,0],[8,40,16,0],[8,40,46,0],[8,41,16,0],[8,42,16,0],[8,43,16,0],[8,44,16,0],[8,44,46,0],[8,45,16,0],[8,45,46,0],[8,46,16,0],[8,46,46,0],[8,16,17,0],[8,46,17,0],[8,46,18,0],[8,46,19,0],[8,16,20,0],[8,46,20,0],[8,46,21,0],[8,46,22,0],[8,16,23,0],[8,46,23,0],[8,16,24,0],[8,46,24,0],[8,16,25,0],[8,16,26,0],[8,16,27,0],[8,16,28,0],[8,46,28,0],[8,16,29,0],[8,46,29,0],[8,16,30,0],[8,46,30,0],[8,16,31,0],[8,46,31,0],[8,16,32,0],[8,46,32,0],[8,16,33,0],[8,46,33,0],[8,46,34,0],[8,46,35,0],[8,16,36,0],[8,46,36,0],[8,16,37,0],[8,46,37,0],[8,16,38,0],[8,46,38,0],[8,16,39,0],[8,46,39,0],[8,16,40,0],[8,46,40,0],[8,16,41,0],[8,46,41,0],[8,16,42,0],[8,46,42,0],[8,16,43,0],[8,46,43,0],[8,16,44,0],[8,46,44,0],[8,16,45,0],[8,46,45,0],[8,24,38,0],[8,25,24,0],[8,26,24,0],[8,27,24,0],[8,28,24,0],[8,28,38,0],[8,29,24,0],[8,30,24,0],[8,31,24,0],[8,32,24,0],[8,32,38,0],[8,33,24,0],[8,34,24,0],[8,35,24,0],[8,36,38,0],[8,37,24,0],[8,38,24,0],[8,24,25,0],[8,24,26,0],[8,24,27,0],[8,24,28,0],[8,38,28,0],[8,24,29,0],[8,24,30,0],[8,24,31,0],[8,24,32,0],[8,38,32,0],[8,24,33,0],[8,24,34,0],[8,24,35,0],[8,38,36,0],[8,24,37,0],[8,44,30,0],[8,45,30,0],[8,30,44,0],[8,30,45,0],[8,17,24,0],[8,18,24,0],[8,19,24,0],[8,20,24,0],[8,21,24,0],[8,22,24,0],[8,23,24,0],[8,24,17,0],[8,24,18,0],[8,24,19,0],[8,24,20,0],[8,24,21,0],[8,24,22,0],[8,24,23,0],[8,39,24,0],[8,40,24,0],[8,41,24,0],[8,42,24,0],[8,43,24,0],[8,44,24,0],[8,45,24,0],[8,38,17,0],[8,38,18,0],[8,38,19,0],[8,38,20,0],[8,20,38,0],[8,21,38,0],[8,22,38,0],[8,23,38,0],[8,24,39,0],[8,24,40,0],[8,24,41,0],[8,24,42,0],[8,24,43,0],[8,24,44,0],[8,24,45,0],[8,40,38,0],[8,44,38,0],[8,45,38,0],[8,38,40,0],[8,38,41,0],[8,38,42,0],[8,38,43,0],[8,38,44,0],[8,38,45,0]]}}]};
        // END SCOUT LEVEL POOL

        // BEGIN SCOUT CLOUD SYNC
        LocalNative.scoutCloudConfig = {"schema":"dino-scout-client/v2","baseUrl":"https://kdzlj-scout-api.qizhiwang339.workers.dev","storageKey":"dino.local.scout.cloud.v1","pollSeconds":300,"requestTimeoutSeconds":20,"maxEntries":1000,"maxResponseChars":1048576,"maxCacheChars":8388608,"policy":"A nonempty complete cloud snapshot replaces built-in candidates; otherwise built-in candidates are used. Retain existing all/range policy.","commit":"Write and verify inactive slot, then switch commit pointer. Previous committed slot remains recoverable. Player save is untouched."};
        LocalNative.scoutCloudRules = {"buildings":{"20101":[4,4],"20102":[4,4],"20103":[4,4],"20104":[4,4],"20105":[4,4],"20106":[4,4],"20107":[4,4],"20108":[4,4],"20109":[4,4],"20110":[4,4],"20201":[3,3],"20202":[3,3],"20203":[3,3],"20204":[3,3],"20205":[3,3],"20206":[3,3],"20207":[3,3],"20208":[3,3],"20209":[3,3],"20210":[3,3],"20301":[3,3],"20302":[3,3],"20303":[3,3],"20304":[3,3],"20305":[3,3],"20306":[3,3],"20307":[3,3],"20308":[3,3],"20309":[3,3],"20310":[3,3],"20401":[3,3],"20402":[3,3],"20403":[3,3],"20404":[3,3],"20405":[3,3],"20406":[3,3],"20407":[3,3],"20408":[3,3],"20409":[3,3],"20410":[3,3],"20501":[3,3],"20502":[3,3],"20503":[3,3],"20504":[3,3],"20505":[3,3],"20506":[3,3],"20507":[3,3],"20508":[3,3],"20509":[3,3],"20510":[3,3],"20601":[4,4],"20602":[4,4],"20603":[4,4],"20604":[4,4],"20605":[4,4],"20606":[4,4],"20607":[4,4],"20608":[4,4],"20609":[4,4],"20610":[4,4],"20701":[5,5],"20702":[5,5],"20703":[5,5],"20704":[5,5],"20705":[5,5],"20706":[5,5],"20707":[5,5],"20708":[5,5],"20801":[3,3],"20802":[3,3],"20803":[3,3],"20804":[3,3],"20805":[3,3],"20806":[3,3],"20807":[3,3],"20808":[3,3],"20809":[3,3],"20901":[3,3],"20902":[3,3],"20903":[3,3],"20904":[3,3],"20905":[3,3],"20906":[3,3],"20907":[3,3],"20908":[3,3],"21001":[3,3],"21002":[3,3],"21003":[3,3],"21004":[3,3],"21201":[2,2],"30101":[3,3],"30102":[3,3],"30103":[3,3],"30104":[3,3],"30105":[3,3],"30106":[3,3],"30107":[3,3],"30108":[3,3],"30109":[3,3],"30110":[3,3],"30201":[3,3],"30202":[3,3],"30203":[3,3],"30204":[3,3],"30205":[3,3],"30206":[3,3],"30207":[3,3],"30208":[3,3],"30301":[3,3],"30302":[3,3],"30303":[3,3],"30304":[3,3],"30305":[3,3],"30306":[3,3],"30307":[3,3],"30308":[3,3],"30401":[3,3],"30402":[3,3],"30403":[3,3],"30404":[3,3],"30405":[3,3],"30406":[3,3],"30501":[3,3],"30502":[3,3],"30503":[3,3],"30504":[3,3],"30505":[3,3],"30506":[3,3],"30601":[3,3],"30602":[3,3],"30603":[3,3],"30604":[3,3],"30701":[3,3],"30702":[3,3],"30703":[3,3],"30801":[3,3],"30802":[3,3],"30803":[3,3],"30804":[3,3],"30805":[3,3],"30806":[3,3],"30807":[3,3],"30808":[3,3],"30901":[3,3],"30902":[3,3],"30903":[3,3],"40101":[1,1],"40102":[1,1],"40103":[1,1],"40104":[1,1],"40105":[1,1],"40106":[1,1],"40107":[1,1],"40108":[1,1],"40109":[1,1],"40110":[1,1],"40201":[1,1],"40202":[1,1],"40203":[1,1],"40204":[1,1],"40205":[1,1],"40206":[1,1],"40207":[1,1],"40208":[1,1],"40209":[1,1],"40210":[1,1],"40301":[1,1],"40302":[1,1],"40303":[1,1],"40304":[1,1],"40305":[1,1],"40306":[1,1],"40307":[1,1],"40308":[1,1],"40309":[1,1],"40310":[1,1],"50501":[2,2],"50601":[2,2],"50701":[2,2],"60101":[1,1],"60201":[1,1],"60301":[1,1],"60401":[1,1],"60501":[1,1],"60601":[1,1],"60701":[1,1],"60801":[1,1],"60901":[1,1],"61001":[1,1],"61101":[1,1],"61201":[1,1],"61301":[1,1],"61401":[2,2],"61501":[2,2],"61601":[2,2],"61701":[2,2],"61801":[1,1],"61901":[1,1],"62001":[1,1],"62101":[1,1],"62201":[1,1],"62301":[1,1],"62401":[2,2],"62501":[2,2],"62601":[2,2],"62701":[2,2],"62801":[2,2],"62901":[2,2]},"guards":{"10401":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10402":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10403":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10404":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10405":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10406":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10407":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10408":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10409":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10410":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10411":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10412":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10413":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10414":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10415":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10416":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10417":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10418":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10419":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10420":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10421":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10422":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10423":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10424":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10425":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10426":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10427":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10428":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10429":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10430":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10431":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10432":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10433":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10434":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10435":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10436":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10437":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10438":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10439":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10440":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10441":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10442":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10443":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10444":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10445":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10446":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10447":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10448":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10449":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10450":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10451":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10452":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10453":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10454":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10455":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10456":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10457":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10458":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10459":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10460":{"basics":[[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401],[10401]],"skills":10401},"10501":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10502":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10503":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10504":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10505":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10506":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10507":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10508":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10509":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10510":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10511":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10512":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10513":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10514":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10515":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10516":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10517":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10518":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10519":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10520":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10521":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10522":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10523":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10524":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10525":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10526":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10527":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10528":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10529":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10530":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10531":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10532":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10533":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10534":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10535":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10536":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10537":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10538":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10539":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10540":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10541":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10542":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10543":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10544":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10545":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10546":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10547":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10548":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10549":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10550":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10551":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10552":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10553":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10554":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10555":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10556":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10557":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10558":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10559":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10560":{"basics":[[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501],[10501]],"skills":10501},"10601":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10602":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10603":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10604":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10605":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10606":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10607":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10608":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10609":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10610":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10611":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10612":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10613":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10614":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10615":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10616":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10617":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10618":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10619":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10620":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10621":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10622":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10623":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10624":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10625":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10626":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10627":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10628":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10629":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10630":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10631":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10632":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10633":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10634":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10635":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10636":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10637":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10638":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10639":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10640":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10641":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10642":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10643":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10644":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10645":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10646":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10647":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10648":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10649":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10650":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10651":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10652":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10653":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10654":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10655":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10656":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10657":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10658":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10659":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10660":{"basics":[[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601],[10601]],"skills":10601},"10701":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10702":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10703":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10704":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10705":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10706":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10707":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10708":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10709":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10710":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10711":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10712":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10713":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10714":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10715":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10716":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10717":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10718":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10719":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10720":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10721":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10722":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10723":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10724":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10725":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10726":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10727":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10728":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10729":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10730":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10731":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10732":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10733":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10734":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10735":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10736":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10737":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10738":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10739":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10740":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10741":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10742":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10743":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10744":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10745":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10746":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10747":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10748":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10749":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10750":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10751":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10752":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10753":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10754":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10755":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10756":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10757":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10758":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10759":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10760":{"basics":[[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701],[10701]],"skills":10701},"10801":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10802":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10803":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10804":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10805":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10806":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10807":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10808":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10809":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10810":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10811":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10812":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10813":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10814":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10815":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10816":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10817":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10818":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10819":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10820":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10821":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10822":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10823":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10824":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10825":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10826":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10827":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10828":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10829":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10830":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10831":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10832":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10833":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10834":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10835":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10836":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10837":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10838":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10839":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10840":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10841":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10842":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10843":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10844":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10845":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10846":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10847":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10848":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10849":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10850":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10851":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10852":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10853":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10854":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10855":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10856":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10857":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10858":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10859":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10860":{"basics":[[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801],[10801]],"skills":10801},"10901":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10902":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10903":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10904":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10905":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10906":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10907":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10908":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10909":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10910":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10911":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10912":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10913":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10914":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10915":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10916":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10917":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10918":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10919":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10920":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10921":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10922":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10923":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10924":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10925":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10926":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10927":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10928":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10929":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10930":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10931":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10932":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10933":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10934":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10935":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10936":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10937":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10938":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10939":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10940":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10941":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10942":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10943":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10944":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10945":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10946":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10947":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10948":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10949":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10950":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10951":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10952":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10953":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10954":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10955":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10956":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10957":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10958":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10959":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"10960":{"basics":[[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901],[10901]],"skills":10901},"11001":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11002":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11003":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11004":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11005":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11006":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11007":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11008":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11009":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11010":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11011":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11012":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11013":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11014":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11015":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11016":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11017":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11018":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11019":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11020":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11021":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11022":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11023":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11024":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11025":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11026":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11027":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11028":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11029":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11030":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11031":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11032":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11033":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11034":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11035":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11036":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11037":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11038":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11039":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11040":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11041":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11042":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11043":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11044":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11045":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11046":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11047":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11048":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11049":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11050":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11051":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11052":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11053":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11054":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11055":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11056":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11057":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11058":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11059":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11060":{"basics":[[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001],[11001]],"skills":11001},"11101":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11102":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11103":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11104":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11105":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11106":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11107":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11108":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11109":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11110":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11111":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11112":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11113":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11114":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11115":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11116":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11117":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11118":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11119":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11120":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11121":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11122":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11123":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11124":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11125":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11126":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11127":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11128":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11129":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11130":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11131":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11132":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11133":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11134":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11135":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11136":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11137":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11138":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11139":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11140":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11141":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11142":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11143":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11144":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11145":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11146":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11147":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11148":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11149":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11150":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11151":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11152":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11153":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11154":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11155":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11156":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11157":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11158":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11159":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11160":{"basics":[[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101],[11101]],"skills":11101},"11201":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11202":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11203":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11204":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11205":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11206":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11207":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11208":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11209":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11210":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11211":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11212":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11213":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11214":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11215":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11216":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11217":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11218":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11219":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11220":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11221":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11222":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11223":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11224":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11225":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11226":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11227":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11228":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11229":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11230":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11231":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11232":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11233":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11234":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11235":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11236":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11237":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11238":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11239":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11240":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11241":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11242":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11243":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11244":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11245":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11246":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11247":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11248":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11249":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11250":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11251":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11252":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11253":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11254":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11255":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11256":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11257":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11258":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11259":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11260":{"basics":[[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201],[11201]],"skills":11201},"11301":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11302":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11303":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11304":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11305":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11306":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11307":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11308":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11309":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11310":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11311":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11312":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11313":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11314":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11315":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11316":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11317":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11318":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11319":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11320":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11321":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11322":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11323":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11324":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11325":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11326":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11327":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11328":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11329":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11330":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11331":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11332":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11333":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11334":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11335":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11336":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11337":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11338":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11339":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11340":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11341":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11342":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11343":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11344":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11345":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11346":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11347":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11348":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11349":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11350":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11351":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11352":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11353":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11354":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11355":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11356":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11357":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11358":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11359":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11360":{"basics":[[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301],[11301]],"skills":11301},"11501":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11502":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11503":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11504":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11505":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11506":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11507":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11508":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11509":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11510":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11511":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11512":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11513":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11514":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11515":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11516":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11517":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11518":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11519":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11520":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11521":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11522":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11523":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11524":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11525":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11526":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11527":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11528":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11529":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11530":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11531":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11532":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11533":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11534":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11535":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11536":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11537":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11538":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11539":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11540":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11541":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11542":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11543":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11544":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11545":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11546":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11547":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11548":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11549":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11550":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11551":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11552":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11553":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11554":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11555":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11556":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11557":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11558":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11559":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11560":{"basics":[[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501],[11501]],"skills":11501},"11601":{"basics":[[11601]],"skills":11601},"11602":{"basics":[[11601]],"skills":11601},"11603":{"basics":[[11601]],"skills":11601},"11604":{"basics":[[11601]],"skills":11601},"11605":{"basics":[[11601]],"skills":11601},"11606":{"basics":[[11601]],"skills":11601},"11607":{"basics":[[11601]],"skills":11601},"11608":{"basics":[[11601]],"skills":11601},"11609":{"basics":[[11601]],"skills":11601},"11610":{"basics":[[11601]],"skills":11601},"11611":{"basics":[[11601]],"skills":11601},"11612":{"basics":[[11601]],"skills":11601},"11613":{"basics":[[11601]],"skills":11601},"11614":{"basics":[[11601]],"skills":11601},"11615":{"basics":[[11601]],"skills":11601},"11616":{"basics":[[11601]],"skills":11601},"11617":{"basics":[[11601]],"skills":11601},"11618":{"basics":[[11601]],"skills":11601},"11619":{"basics":[[11601]],"skills":11601},"11620":{"basics":[[11601]],"skills":11601},"11621":{"basics":[[11601]],"skills":11601},"11701":{"basics":[[11701]],"skills":11701},"11702":{"basics":[[11701]],"skills":11701},"11703":{"basics":[[11701]],"skills":11701},"11704":{"basics":[[11701]],"skills":11701},"11705":{"basics":[[11701]],"skills":11701},"11706":{"basics":[[11701]],"skills":11701},"11707":{"basics":[[11701]],"skills":11701},"11708":{"basics":[[11701]],"skills":11701},"11709":{"basics":[[11701]],"skills":11701},"11710":{"basics":[[11701]],"skills":11701},"11711":{"basics":[[11701]],"skills":11701},"11712":{"basics":[[11701]],"skills":11701},"11713":{"basics":[[11701]],"skills":11701},"11714":{"basics":[[11701]],"skills":11701},"11715":{"basics":[[11701]],"skills":11701},"11716":{"basics":[[11701]],"skills":11701},"11717":{"basics":[[11701]],"skills":11701},"11718":{"basics":[[11701]],"skills":11701},"11719":{"basics":[[11701]],"skills":11701},"11720":{"basics":[[11701]],"skills":11701},"11721":{"basics":[[11701]],"skills":11701},"11801":{"basics":[[11801]],"skills":11801},"11802":{"basics":[[11801]],"skills":11801},"11803":{"basics":[[11801]],"skills":11801},"11804":{"basics":[[11801]],"skills":11801},"11805":{"basics":[[11801]],"skills":11801},"11806":{"basics":[[11801]],"skills":11801},"11807":{"basics":[[11801]],"skills":11801},"11808":{"basics":[[11801]],"skills":11801},"11809":{"basics":[[11801]],"skills":11801},"11810":{"basics":[[11801]],"skills":11801},"11811":{"basics":[[11801]],"skills":11801},"11812":{"basics":[[11801]],"skills":11801},"11813":{"basics":[[11801]],"skills":11801},"11814":{"basics":[[11801]],"skills":11801},"11815":{"basics":[[11801]],"skills":11801},"11816":{"basics":[[11801]],"skills":11801},"11817":{"basics":[[11801]],"skills":11801},"11818":{"basics":[[11801]],"skills":11801},"11819":{"basics":[[11801]],"skills":11801},"11820":{"basics":[[11801]],"skills":11801},"11821":{"basics":[[11801]],"skills":11801},"11901":{"basics":[[11901]],"skills":11901},"11902":{"basics":[[11901]],"skills":11901},"11903":{"basics":[[11901]],"skills":11901},"11904":{"basics":[[11901]],"skills":11901},"11905":{"basics":[[11901]],"skills":11901},"11906":{"basics":[[11901]],"skills":11901},"11907":{"basics":[[11901]],"skills":11901},"11908":{"basics":[[11901]],"skills":11901},"11909":{"basics":[[11901]],"skills":11901},"11910":{"basics":[[11901]],"skills":11901},"11911":{"basics":[[11901]],"skills":11901},"11912":{"basics":[[11901]],"skills":11901},"11913":{"basics":[[11901]],"skills":11901},"11914":{"basics":[[11901]],"skills":11901},"11915":{"basics":[[11901]],"skills":11901},"11916":{"basics":[[11901]],"skills":11901},"11917":{"basics":[[11901]],"skills":11901},"11918":{"basics":[[11901]],"skills":11901},"11919":{"basics":[[11901]],"skills":11901},"11920":{"basics":[[11901]],"skills":11901},"11921":{"basics":[[11901]],"skills":11901}},"skills":{"10401":[12201,12202,12203,12204,12205,12206,12207,12208,12209,12210,12301,12302,12303,12304,12305,12306,12307,12308,12309,12310,12401,12402,12403,12404,12405,12406,12407,12408,12409,12410,12501,12502,12503,12504,12505,12506,12507,12508,12509,12510,12601,12602,12603,12604,12605,12606,12607,12608,12609,12610,12701,12702,12703,12704,12705,12706,12707,12708,12709,12710,12801,12802,12803,12804,12805,12806,12807,12808,12809,12810,12901,12902,12903,12904,12905,12906,12907,12908,12909,12910,13001,13002,13003,13004,13005,13006,13007,13008,13009,13010,13101,13102,13103,13104,13105,13106,13107,13108,13109,13110,13201,13202,13203,13204,13205,13206,13207,13208,13209,13210,13301,13302,13303,13304,13305,13306,13307,13308,13309,13310,13401,13402,13403,13404,13405,13406,13407,13408,13409,13410,13501,13502,13503,13504,13505,13506,13507,13508,13509,13510,14001,14002,14003,14004,14005,14006,14007,14008,14009,14010,14101,14102,14103,14104,14105,14106,14107,14108,14109,14110,14201,14202,14203,14204,14205,14206,14207,14208,14209,14210,14301,14302,14303,14304,14305,14306,14307,14308,14309,14310,14401,14402,14403,14404,14405,14406,14407,14408,14409,14410,700101,700102,700103,700104,700105,700106,700107,700108,700109,700110,700201,700202,700203,700204,700205,700206,700207,700208,700209,700210,700301,700302,700303,700304,700305,700306,700307,700308,700309,700310,700401,700402,700403,700404,700405,700406,700407,700408,700409,700410],"10501":[14501,14502,14503,14504,14505,14506,14507,14508,14509,14510,14601,14602,14603,14604,14605,14606,14607,14608,14609,14610,14701,14702,14703,14704,14705,14706,14707,14708,14709,14710,14801,14802,14803,14804,14805,14806,14807,14808,14809,14810,14901,14902,14903,14904,14905,14906,14907,14908,14909,14910,15001,15002,15003,15004,15005,15006,15007,15008,15009,15010,15101,15102,15103,15104,15105,15106,15107,15108,15109,15110,15201,15202,15203,15204,15205,15206,15207,15208,15209,15210,15301,15302,15303,15304,15305,15306,15307,15308,15309,15310,15401,15402,15403,15404,15405,15406,15407,15408,15409,15410,15501,15502,15503,15504,15505,15506,15507,15508,15509,15510,15601,15602,15603,15604,15605,15606,15607,15608,15609,15610,15701,15702,15703,15704,15705,15706,15707,15708,15709,15710,15801,15802,15803,15804,15805,15806,15807,15808,15809,15810,701101,701102,701103,701104,701105,701106,701107,701108,701109,701110,701201,701202,701203,701204,701205,701206,701207,701208,701209,701210,701301,701302,701303,701304,701305,701306,701307,701308,701309,701310,701401,701402,701403,701404,701405,701406,701407,701408,701409,701410],"10601":[15901,15902,15903,15904,15905,15906,15907,15908,15909,15910,16001,16002,16003,16004,16005,16006,16007,16008,16009,16010,16101,16102,16103,16104,16105,16106,16107,16108,16109,16110,16201,16202,16203,16204,16205,16206,16207,16208,16209,16210,16301,16302,16303,16304,16305,16306,16307,16308,16309,16310,16401,16402,16403,16404,16405,16406,16407,16408,16409,16410,16501,16502,16503,16504,16505,16506,16507,16508,16509,16510,16601,16602,16603,16604,16605,16606,16607,16608,16609,16610,16701,16702,16703,16704,16705,16706,16707,16708,16709,16710,16801,16802,16803,16804,16805,16806,16807,16808,16809,16810,16901,16902,16903,16904,16905,16906,16907,16908,16909,16910,17001,17002,17003,17004,17005,17006,17007,17008,17009,17010,17101,17102,17103,17104,17105,17106,17107,17108,17109,17110,17201,17202,17203,17204,17205,17206,17207,17208,17209,17210,17301,17302,17303,17304,17305,17306,17307,17308,17309,17310,702101,702102,702103,702104,702105,702106,702107,702108,702109,702110,702201,702202,702203,702204,702205,702206,702207,702208,702209,702210,702301,702302,702303,702304,702305,702306,702307,702308,702309,702310,702401,702402,702403,702404,702405,702406,702407,702408,702409,702410,702501,702502,702503,702504,702505,702506,702507,702508,702509,702510],"10701":[17401,17402,17403,17404,17405,17406,17407,17408,17409,17410,17501,17502,17503,17504,17505,17506,17507,17508,17509,17510,17601,17602,17603,17604,17605,17606,17607,17608,17609,17610,17701,17702,17703,17704,17705,17706,17707,17708,17709,17710,17801,17802,17803,17804,17805,17806,17807,17808,17809,17810,17901,17902,17903,17904,17905,17906,17907,17908,17909,17910,18001,18002,18003,18004,18005,18006,18007,18008,18009,18010,18101,18102,18103,18104,18105,18106,18107,18108,18109,18110,18201,18202,18203,18204,18205,18206,18207,18208,18209,18210,18301,18302,18303,18304,18305,18306,18307,18308,18309,18310,18401,18402,18403,18404,18405,18406,18407,18408,18409,18410,18501,18502,18503,18504,18505,18506,18507,18508,18509,18510,18601,18602,18603,18604,18605,18606,18607,18608,18609,18610,18701,18702,18703,18704,18705,18706,18707,18708,18709,18710,703101,703102,703103,703104,703105,703106,703107,703108,703109,703110,703201,703202,703203,703204,703205,703206,703207,703208,703209,703210,703301,703302,703303,703304,703305,703306,703307,703308,703309,703310,703401,703402,703403,703404,703405,703406,703407,703408,703409,703410],"10801":[18901,18902,18903,18904,18905,18906,18907,18908,18909,18910,19001,19002,19003,19004,19005,19006,19007,19008,19009,19010,19101,19102,19103,19104,19105,19106,19107,19108,19109,19110,19201,19202,19203,19204,19205,19206,19207,19208,19209,19210,19301,19302,19303,19304,19305,19306,19307,19308,19309,19310,19401,19402,19403,19404,19405,19406,19407,19408,19409,19410,19501,19502,19503,19504,19505,19506,19507,19508,19509,19510,19601,19602,19603,19604,19605,19606,19607,19608,19609,19610,19701,19702,19703,19704,19705,19706,19707,19708,19709,19710,19801,19802,19803,19804,19805,19806,19807,19808,19809,19810,19901,19902,19903,19904,19905,19906,19907,19908,19909,19910,20001,20002,20003,20004,20005,20006,20007,20008,20009,20010,20101,20102,20103,20104,20105,20106,20107,20108,20109,20110,704101,704102,704103,704104,704105,704106,704107,704108,704109,704110,704201,704202,704203,704204,704205,704206,704207,704208,704209,704210,704301,704302,704303,704304,704305,704306,704307,704308,704309,704310,704401,704402,704403,704404,704405,704406,704407,704408,704409,704410,704501,704502,704503,704504,704505,704506,704507,704508,704509,704510],"10901":[20201,20202,20203,20204,20205,20206,20207,20208,20209,20210,20301,20302,20303,20304,20305,20306,20307,20308,20309,20310,20401,20402,20403,20404,20405,20406,20407,20408,20409,20410,20601,20602,20603,20604,20605,20606,20607,20608,20609,20610,20701,20702,20703,20704,20705,20706,20707,20708,20709,20710,20801,20802,20803,20804,20805,20806,20807,20808,20809,20810,20901,20902,20903,20904,20905,20906,20907,20908,20909,20910,21001,21002,21003,21004,21005,21006,21007,21008,21009,21010,21101,21102,21103,21104,21105,21106,21107,21108,21109,21110,21201,21202,21203,21204,21205,21206,21207,21208,21209,21210,21301,21302,21303,21304,21305,21306,21307,21308,21309,21310,21401,21402,21403,21404,21405,21406,21407,21408,21409,21410,21501,21502,21503,21504,21505,21506,21507,21508,21509,21510,705201,705202,705203,705204,705205,705206,705207,705208,705209,705210,705301,705302,705303,705304,705305,705306,705307,705308,705309,705310,705401,705402,705403,705404,705405,705406,705407,705408,705409,705410],"11001":[21601,21602,21603,21604,21605,21606,21607,21608,21609,21610,21701,21702,21703,21704,21705,21706,21707,21708,21709,21710,21801,21802,21803,21804,21805,21806,21807,21808,21809,21810,21901,21902,21903,21904,21905,21906,21907,21908,21909,21910,22001,22002,22003,22004,22005,22006,22007,22008,22009,22010,22101,22102,22103,22104,22105,22106,22107,22108,22109,22110,22201,22202,22203,22204,22205,22206,22207,22208,22209,22210,22301,22302,22303,22304,22305,22306,22307,22308,22309,22310,22401,22402,22403,22404,22405,22406,22407,22408,22409,22410,22501,22502,22503,22504,22505,22506,22507,22508,22509,22510,22601,22602,22603,22604,22605,22606,22607,22608,22609,22610,22701,22702,22703,22704,22705,22706,22707,22708,22709,22710,706101,706102,706103,706104,706105,706106,706107,706108,706109,706110,706201,706202,706203,706204,706205,706206,706207,706208,706209,706210,706301,706302,706303,706304,706305,706306,706307,706308,706309,706310,706401,706402,706403,706404,706405,706406,706407,706408,706409,706410],"11101":[22801,22802,22803,22804,22805,22806,22807,22808,22809,22810,22901,22902,22903,22904,22905,22906,22907,22908,22909,22910,23001,23002,23003,23004,23005,23006,23007,23008,23009,23010,23101,23102,23103,23104,23105,23106,23107,23108,23109,23110,23201,23202,23203,23204,23205,23206,23207,23208,23209,23210,23301,23302,23303,23304,23305,23306,23307,23308,23309,23310,23401,23402,23403,23404,23405,23406,23407,23408,23409,23410,23501,23502,23503,23504,23505,23506,23507,23508,23509,23510,23601,23602,23603,23604,23605,23606,23607,23608,23609,23610,23701,23702,23703,23704,23705,23706,23707,23708,23709,23710,23801,23802,23803,23804,23805,23806,23807,23808,23809,23810,707101,707102,707103,707104,707105,707106,707107,707108,707109,707110,707201,707202,707203,707204,707205,707206,707207,707208,707209,707210,707301,707302,707303,707304,707305,707306,707307,707308,707309,707310,707401,707402,707403,707404,707405,707406,707407,707408,707409,707410],"11201":[23901,23902,23903,23904,23905,23906,23907,23908,23909,23910,24001,24002,24003,24004,24005,24006,24007,24008,24009,24010,24101,24102,24103,24104,24105,24106,24107,24108,24109,24110,24201,24202,24203,24204,24205,24206,24207,24208,24209,24210,24301,24302,24303,24304,24305,24306,24307,24308,24309,24310,24401,24402,24403,24404,24405,24406,24407,24408,24409,24410,24501,24502,24503,24504,24505,24506,24507,24508,24509,24510,24601,24602,24603,24604,24605,24606,24607,24608,24609,24610,24701,24702,24703,24704,24705,24706,24707,24708,24709,24710,24801,24802,24803,24804,24805,24806,24807,24808,24809,24810,24901,24902,24903,24904,24905,24906,24907,24908,24909,24910,25001,25002,25003,25004,25005,25006,25007,25008,25009,25010,25101,25102,25103,25104,25105,25106,25107,25108,25109,25110,25201,25202,25203,25204,25205,25206,25207,25208,25209,25210,708101,708102,708103,708104,708105,708106,708107,708108,708109,708110,708301,708302,708303,708304,708305,708306,708307,708308,708309,708310,708401,708402,708403,708404,708405,708406,708407,708408,708409,708410,708501,708502,708503,708504,708505,708506,708507,708508,708509,708510],"11301":[709101,709102,709103,709104,709105,709106,709107,709108,709109,709110,709201,709202,709203,709204,709205,709206,709207,709208,709209,709210,709301,709302,709303,709304,709305,709306,709307,709308,709309,709310,709401,709402,709403,709404,709405,709406,709407,709408,709409,709410,709501,709502,709503,709504,709505,709506,709507,709508,709509,709510,709601,709602,709603,709604,709605,709606,709607,709608,709609,709610],"11501":[26701,26702,26703,26704,26705,26706,26707,26708,26709,26710,26801,26802,26803,26804,26805,26806,26807,26808,26809,26810,26901,26902,26903,26904,26905,26906,26907,26908,26909,26910,27001,27002,27003,27004,27005,27006,27007,27008,27009,27010,27101,27102,27103,27104,27105,27106,27107,27108,27109,27110,27201,27202,27203,27204,27205,27206,27207,27208,27209,27210,27301,27302,27303,27304,27305,27306,27307,27308,27309,27310,27401,27402,27403,27404,27405,27406,27407,27408,27409,27410],"11601":[13601,13602,13603,13604,13605,13606,13607,13608,13609,13610,28101,28102,28103,28104,28105,28106,28107,28108,28109,28110,28201,28202,28203,28204,28205,28206,28207,28208,28209,28210,28301,28302,28303,28304,28305,28306,28307,28308,28309,28310,28401,28402,28403,28404,28405,28406,28407,28408,28409,28410],"11701":[13701,13702,13703,13704,13705,13706,13707,13708,13709,13710,28501,28502,28503,28504,28505,28506,28507,28508,28509,28510,28601,28602,28603,28604,28605,28606,28607,28608,28609,28610,28701,28702,28703,28704,28705,28706,28707,28708,28709,28710,28801,28802,28803,28804,28805,28806,28807,28808,28809,28810],"11801":[13801,13802,13803,13804,13805,13806,13807,13808,13809,13810,28901,28902,28903,28904,28905,28906,28907,28908,28909,28910,29001,29002,29003,29004,29005,29006,29007,29008,29009,29010,29101,29102,29103,29104,29105,29106,29107,29108,29109,29110,29201,29202,29203,29204,29205,29206,29207,29208,29209,29210],"11901":[13901,13902,13903,13904,13905,13906,13907,13908,13909,13910,29301,29302,29303,29304,29305,29306,29307,29308,29309,29310,29401,29402,29403,29404,29405,29406,29407,29408,29409,29410,29501,29502,29503,29504,29505,29506,29507,29508,29509,29510,29601,29602,29603,29604,29605,29606,29607,29608,29609,29610]},"runeSlots":{"7001":0,"7002":0,"7003":0,"7004":0,"7005":0,"7006":0,"7007":0,"7008":0,"7009":0,"7041":1,"7042":1,"7043":1,"7044":1,"7045":1,"7046":1,"7047":1,"7048":1,"7049":1,"7051":2,"7052":2,"7053":2,"7054":2,"7055":2,"7056":2,"7057":2,"7058":2,"7059":2,"7061":3,"7062":3,"7063":3,"7064":3,"7065":3,"7066":3,"7067":3,"7068":3,"7069":3,"7071":4,"7072":4,"7073":4,"7074":4,"7075":4,"7076":4,"7077":4,"7078":4,"7079":4},"attributes":{"1002":["life",[]],"1003":["life",[]],"1004":["life",[]],"1005":["life",[]],"1006":["life",[]],"1007":["life",[]],"1008":["life",[]],"1009":["life",[]],"1010":["life",[]],"1011":["life",[]],"1012":["life",[]],"1013":["life",[]],"1014":["life",[]],"1015":["life",[]],"1016":["life",[]],"1017":["life",[]],"1018":["life",[]],"1019":["life",[]],"1020":["life",[]],"1021":["life",[]],"1022":["life",[]],"1023":["life",[]],"1024":["life",[]],"1025":["life",[]],"1026":["life",[]],"1027":["life",[]],"1028":["life",[]],"1029":["life",[]],"1030":["life",[]],"1031":["life",[]],"1032":["life",[]],"1033":["life",[]],"1034":["life",[]],"1035":["life",[]],"1036":["life",[]],"1037":["life",[]],"1038":["life",[]],"1039":["life",[]],"1040":["life",[]],"1041":["life",[]],"1042":["life",[]],"1043":["life",[]],"1044":["life",[]],"1045":["life",[]],"1046":["life",[]],"1047":["life",[]],"1048":["life",[]],"1049":["life",[]],"1050":["life",[]],"1051":["life",[]],"1052":["life",[]],"1053":["life",[]],"1054":["life",[]],"1055":["life",[]],"1056":["life",[]],"1057":["life",[]],"1058":["life",[]],"1059":["life",[]],"1060":["life",[]],"1061":["life",[]],"1062":["life",[]],"1063":["life",[]],"1064":["life",[]],"1065":["life",[]],"1066":["life",[]],"1067":["life",[]],"1068":["life",[]],"1069":["life",[]],"1070":["life",[]],"1071":["life",[]],"1072":["life",[]],"1073":["life",[]],"1074":["life",[]],"1075":["life",[]],"1076":["life",[]],"1077":["life",[]],"1078":["life",[]],"1079":["life",[]],"1080":["life",[]],"1081":["life",[]],"1082":["life",[]],"1083":["life",[]],"1084":["life",[]],"1085":["life",[]],"1086":["life",[]],"1087":["life",[]],"1088":["life",[]],"1089":["life",[]],"1090":["life",[]],"1091":["life",[]],"1092":["life",[]],"1093":["life",[]],"1094":["life",[]],"1095":["life",[]],"1096":["life",[]],"1097":["life",[]],"1098":["life",[]],"1099":["life",[]],"1100":["life",[]],"1101":["life",["base_attr"]],"1102":["life",["base_attr"]],"1103":["life",["base_attr"]],"1104":["life",["base_attr"]],"1105":["life",["base_attr"]],"1106":["life",["base_attr"]],"1107":["life",["base_attr"]],"1108":["life",["base_attr"]],"1109":["life",["base_attr"]],"1110":["life",["base_attr"]],"1111":["life",["base_attr"]],"1112":["life",["base_attr"]],"1113":["life",["base_attr"]],"1114":["life",["base_attr"]],"1115":["life",["base_attr"]],"1116":["life",["base_attr"]],"1117":["life",["base_attr"]],"1118":["life",["base_attr"]],"1119":["life",["base_attr"]],"1120":["life",["base_attr"]],"1121":["life",["base_attr"]],"1122":["life",["base_attr"]],"1123":["life",["base_attr"]],"1124":["life",["base_attr"]],"1125":["life",["base_attr"]],"1126":["life",["base_attr"]],"1127":["life",[]],"1128":["life",[]],"1129":["life",[]],"1130":["life",[]],"1131":["life",[]],"1132":["life",[]],"1133":["life",[]],"1134":["life",[]],"1135":["life",[]],"1136":["life",[]],"1137":["life",[]],"1138":["life",[]],"1139":["life",[]],"1140":["life",[]],"1141":["life",[]],"1142":["life",[]],"1143":["life",[]],"1144":["life",[]],"1145":["life",[]],"1146":["life",[]],"1147":["life",[]],"1148":["life",[]],"1149":["life",[]],"1150":["life",[]],"1151":["life",["two_attr"]],"1152":["life",["two_attr"]],"1153":["life",["two_attr"]],"1154":["life",["two_attr"]],"1155":["life",["two_attr"]],"1156":["life",["two_attr"]],"1157":["life",["two_attr"]],"1158":["life",["two_attr"]],"1159":["life",["two_attr"]],"1160":["life",["two_attr"]],"1161":["life",["two_attr"]],"1162":["life",["two_attr"]],"1163":["life",["two_attr"]],"1164":["life",["two_attr"]],"1165":["life",["two_attr"]],"1166":["life",["two_attr"]],"1167":["life",["two_attr"]],"1168":["life",["two_attr"]],"1169":["life",["two_attr"]],"1170":["life",["two_attr"]],"1171":["life",["two_attr"]],"1172":["life",["two_attr"]],"1173":["life",["two_attr"]],"1174":["life",["two_attr"]],"1175":["life",["two_attr"]],"1176":["life",["two_attr"]],"1177":["life",["two_attr"]],"1178":["life",["two_attr"]],"1179":["life",["two_attr"]],"1180":["life",["two_attr"]],"1181":["life",["two_attr"]],"1182":["life",["two_attr"]],"1183":["life",["two_attr"]],"1184":["life",["two_attr"]],"1185":["life",["two_attr"]],"1186":["life",["two_attr"]],"1187":["life",["two_attr"]],"1188":["life",["two_attr"]],"1189":["life",["two_attr"]],"1190":["life",["two_attr"]],"1191":["life",["two_attr"]],"1192":["life",["two_attr"]],"1193":["life",["two_attr"]],"1194":["life",["two_attr"]],"1195":["life",["two_attr"]],"1196":["life",["two_attr"]],"1197":["life",["two_attr"]],"1198":["life",["two_attr"]],"1199":["life",["two_attr"]],"1200":["life",["two_attr"]],"1201":["life",["base_attr","two_attr"]],"1202":["life",["base_attr"]],"1203":["life",["base_attr"]],"1204":["life",["base_attr"]],"1205":["life",["base_attr"]],"1206":["life",["base_attr"]],"1207":["life",["base_attr"]],"1208":["life",["base_attr"]],"1209":["life",["base_attr"]],"1210":["life",["base_attr"]],"1211":["life",["base_attr"]],"1212":["life",["base_attr"]],"1213":["life",["base_attr"]],"1214":["life",["base_attr"]],"1215":["life",["base_attr"]],"1216":["life",["base_attr"]],"1217":["life",["base_attr"]],"1218":["life",["base_attr"]],"1219":["life",["base_attr"]],"1220":["life",["base_attr"]],"1221":["life",["base_attr"]],"1222":["life",["base_attr"]],"1223":["life",["base_attr"]],"1224":["life",["base_attr"]],"1225":["life",["base_attr"]],"1226":["life",["base_attr"]],"1227":["life",["base_attr"]],"1228":["life",["base_attr"]],"1229":["life",["base_attr"]],"1230":["life",["base_attr"]],"1231":["life",["base_attr"]],"1232":["life",["base_attr"]],"1233":["life",["base_attr"]],"1234":["life",["base_attr"]],"1235":["life",["base_attr"]],"1236":["life",["base_attr"]],"1237":["life",["base_attr"]],"1238":["life",["base_attr"]],"1239":["life",["base_attr"]],"1240":["life",["base_attr"]],"1241":["life",["base_attr"]],"1242":["life",["base_attr"]],"1243":["life",["base_attr"]],"1244":["life",["base_attr"]],"1245":["life",["base_attr"]],"1246":["life",["base_attr"]],"1247":["life",["base_attr"]],"1248":["life",["base_attr"]],"1249":["life",["base_attr"]],"1250":["life",["base_attr"]],"1251":["life",["base_attr"]],"1252":["life",[]],"1253":["life",[]],"1254":["life",[]],"1255":["life",[]],"1256":["life",[]],"1257":["life",[]],"1258":["life",[]],"1259":["life",[]],"1260":["life",[]],"1261":["life",[]],"1262":["life",[]],"1263":["life",[]],"1264":["life",[]],"1265":["life",[]],"1266":["life",[]],"1267":["life",[]],"1268":["life",[]],"1269":["life",[]],"1270":["life",[]],"1271":["life",[]],"1272":["life",[]],"1273":["life",[]],"1274":["life",[]],"1275":["life",[]],"1276":["life",[]],"1277":["life",[]],"1278":["life",[]],"1279":["life",[]],"1280":["life",[]],"1281":["life",[]],"1282":["life",[]],"1283":["life",[]],"1284":["life",[]],"1285":["life",[]],"1286":["life",[]],"1287":["life",[]],"1288":["life",[]],"1289":["life",[]],"1290":["life",[]],"1291":["life",[]],"1292":["life",[]],"1293":["life",[]],"1294":["life",[]],"1295":["life",[]],"1296":["life",[]],"1297":["life",[]],"1298":["life",[]],"1299":["life",[]],"1300":["life",[]],"1301":["life",["three_attr"]],"1302":["life",["three_attr"]],"1303":["life",["three_attr"]],"1304":["life",["three_attr"]],"1305":["life",["three_attr"]],"1306":["life",["three_attr"]],"1307":["life",["three_attr"]],"1308":["life",["three_attr"]],"1309":["life",["three_attr"]],"1310":["life",["three_attr"]],"1311":["life",["three_attr"]],"1312":["life",["three_attr"]],"1313":["life",["three_attr"]],"1314":["life",["three_attr"]],"1315":["life",["three_attr"]],"1316":["life",["three_attr"]],"1317":["life",["three_attr"]],"1318":["life",["three_attr"]],"1319":["life",["three_attr"]],"1320":["life",["three_attr"]],"1321":["life",["three_attr"]],"1322":["life",["three_attr"]],"1323":["life",["three_attr"]],"1324":["life",["three_attr"]],"1325":["life",["three_attr"]],"1326":["life",["three_attr"]],"1327":["life",["three_attr"]],"1328":["life",["three_attr"]],"1329":["life",["three_attr"]],"1330":["life",["three_attr"]],"1331":["life",["three_attr"]],"1332":["life",["three_attr"]],"1333":["life",["three_attr"]],"1334":["life",["three_attr"]],"1335":["life",["three_attr"]],"1336":["life",["three_attr"]],"1337":["life",["three_attr"]],"1338":["life",["three_attr"]],"1339":["life",["three_attr"]],"1340":["life",["three_attr"]],"1341":["life",["three_attr"]],"1342":["life",["three_attr"]],"1343":["life",["three_attr"]],"1344":["life",["three_attr"]],"1345":["life",["three_attr"]],"1346":["life",["three_attr"]],"1347":["life",["three_attr"]],"1348":["life",["three_attr"]],"1349":["life",["three_attr"]],"1350":["life",["three_attr"]],"1351":["life",["base_attr","three_attr"]],"1352":["life",["base_attr","three_attr"]],"1353":["life",["base_attr","three_attr"]],"1354":["life",["base_attr","three_attr"]],"1355":["life",["base_attr","three_attr"]],"1356":["life",["base_attr","three_attr"]],"1357":["life",["base_attr","three_attr"]],"1358":["life",["base_attr","three_attr"]],"1359":["life",["base_attr","three_attr"]],"1360":["life",["base_attr","three_attr"]],"1361":["life",["base_attr","three_attr"]],"1362":["life",["base_attr","three_attr"]],"1363":["life",["base_attr","three_attr"]],"1364":["life",["base_attr","three_attr"]],"1365":["life",["base_attr","three_attr"]],"1366":["life",["base_attr","three_attr"]],"1367":["life",["base_attr","three_attr"]],"1368":["life",["base_attr","three_attr"]],"1369":["life",["base_attr","three_attr"]],"1370":["life",["base_attr","three_attr"]],"1371":["life",["base_attr","three_attr"]],"1372":["life",["base_attr","three_attr"]],"1373":["life",["base_attr","three_attr"]],"1374":["life",["base_attr","three_attr"]],"1375":["life",["base_attr","three_attr"]],"1376":["life",["base_attr","three_attr"]],"1377":["life",["base_attr","three_attr"]],"1378":["life",["base_attr","three_attr"]],"1379":["life",["base_attr","three_attr"]],"1380":["life",["base_attr","three_attr"]],"1381":["life",["base_attr","three_attr"]],"1382":["life",["base_attr","three_attr"]],"1383":["life",["base_attr","three_attr"]],"1384":["life",["base_attr","three_attr"]],"1385":["life",["base_attr","three_attr"]],"1386":["life",["base_attr","three_attr"]],"1387":["life",["base_attr","three_attr"]],"1388":["life",["base_attr","three_attr"]],"1389":["life",["base_attr","three_attr"]],"1390":["life",["base_attr","three_attr"]],"1391":["life",["base_attr","three_attr"]],"1392":["life",["base_attr","three_attr"]],"1393":["life",["base_attr","three_attr"]],"1394":["life",["base_attr","three_attr"]],"1395":["life",["base_attr","three_attr"]],"1396":["life",["base_attr","three_attr"]],"1397":["life",["base_attr","three_attr"]],"1398":["life",["base_attr","three_attr"]],"1399":["life",["base_attr","three_attr"]],"1400":["life",["base_attr","three_attr"]],"1401":["life",["base_attr"]],"1402":["life",["base_attr"]],"1403":["life",["base_attr"]],"1404":["life",["base_attr"]],"1405":["life",["base_attr"]],"1406":["life",["base_attr"]],"1407":["life",["base_attr"]],"1408":["life",["base_attr"]],"1409":["life",["base_attr"]],"1410":["life",["base_attr"]],"1411":["life",["base_attr"]],"1412":["life",["base_attr"]],"1413":["life",["base_attr"]],"1414":["life",["base_attr"]],"1415":["life",["base_attr"]],"1416":["life",["base_attr"]],"1417":["life",["base_attr"]],"1418":["life",["base_attr"]],"1419":["life",["base_attr"]],"1420":["life",["base_attr"]],"1421":["life",["base_attr"]],"1422":["life",[]],"1423":["life",[]],"1424":["life",[]],"1425":["life",[]],"1426":["life",[]],"1427":["life",[]],"1428":["life",[]],"1429":["life",[]],"1430":["life",[]],"1431":["life",[]],"1432":["life",[]],"1433":["life",[]],"1434":["life",[]],"1435":["life",[]],"1436":["life",[]],"1437":["life",[]],"1438":["life",[]],"1439":["life",[]],"1440":["life",[]],"1441":["life",[]],"1442":["life",[]],"1443":["life",[]],"1444":["life",[]],"1445":["life",[]],"1446":["life",[]],"1447":["life",[]],"1448":["life",[]],"1449":["life",[]],"1450":["life",[]],"1451":["life",[]],"1452":["life",[]],"1453":["life",[]],"1454":["life",[]],"1455":["life",[]],"1456":["life",[]],"1457":["life",[]],"1458":["life",[]],"1459":["life",[]],"1460":["life",[]],"1461":["life",[]],"1462":["life",[]],"1463":["life",[]],"1464":["life",[]],"1465":["life",[]],"1466":["life",[]],"1467":["life",[]],"1468":["life",[]],"1469":["life",[]],"1470":["life",[]],"1471":["life",[]],"1472":["life",[]],"1473":["life",[]],"1474":["life",[]],"1475":["life",[]],"1476":["life",[]],"1477":["life",[]],"1478":["life",[]],"1479":["life",[]],"1480":["life",[]],"1481":["life",[]],"1482":["life",[]],"1483":["life",[]],"1484":["life",[]],"1485":["life",[]],"1486":["life",[]],"2001":["defence",[]],"2002":["defence",["base_attr"]],"2003":["defence",["base_attr","two_attr"]],"2004":["defence",["base_attr","two_attr"]],"2005":["defence",["base_attr","two_attr"]],"2006":["defence",["base_attr","two_attr"]],"2007":["defence",["two_attr"]],"2008":["defence",["base_attr","three_attr"]],"2009":["defence",["base_attr","three_attr"]],"2010":["defence",["base_attr","three_attr"]],"2011":["defence",["base_attr","three_attr"]],"2012":["defence",["base_attr","three_attr"]],"2013":["defence",["base_attr"]],"2014":["defence",["base_attr"]],"2015":["defence",["base_attr"]],"2016":["defence",["base_attr"]],"2017":["defence",["base_attr"]],"2018":["defence",[]],"2019":["defence",[]],"2020":["defence",[]],"2021":["defence",[]],"2022":["defence",[]],"2023":["defence",[]],"2024":["defence",[]],"2025":["defence",[]],"2026":["defence",[]],"2027":["defence",[]],"2028":["defence",[]],"2029":["defence",[]],"2030":["defence",[]],"2031":["defence",[]],"2032":["defence",[]],"2033":["defence",[]],"2034":["defence",[]],"2035":["defence",[]],"2036":["defence",[]],"2037":["defence",[]],"2038":["defence",[]],"2039":["defence",[]],"2040":["defence",[]],"2041":["defence",[]],"2042":["defence",[]],"2043":["defence",[]],"2044":["defence",[]],"2045":["defence",[]],"2046":["defence",[]],"2047":["defence",[]],"2048":["defence",[]],"2049":["defence",[]],"3001":["life_recover",[]],"3002":["life_recover",[]],"3003":["life_recover",[]],"3004":["life_recover",[]],"3005":["life_recover",["base_attr"]],"3006":["life_recover",["base_attr"]],"3007":["life_recover",["base_attr"]],"3008":["life_recover",["base_attr"]],"3009":["life_recover",["base_attr"]],"3010":["life_recover",[]],"3011":["life_recover",[]],"3012":["life_recover",[]],"3013":["life_recover",[]],"3014":["life_recover",["three_attr"]],"3015":["life_recover",["base_attr","three_attr"]],"3016":["life_recover",["base_attr","three_attr"]],"3017":["life_recover",["base_attr","three_attr"]],"3018":["life_recover",["base_attr","three_attr"]],"3019":["life_recover",["base_attr"]],"3020":["life_recover",["base_attr"]],"3021":["life_recover",["base_attr"]],"3022":["life_recover",["base_attr"]],"3023":["life_recover",["base_attr"]],"3024":["life_recover",["base_attr"]],"3025":["life_recover",["base_attr"]],"3026":["life_recover",["base_attr"]],"3027":["life_recover",["base_attr"]],"3028":["life_recover",["base_attr"]],"3029":["life_recover",["base_attr"]],"3030":["life_recover",["base_attr"]],"4001":["attack",[]],"4002":["attack",[]],"4003":["attack",[]],"4004":["attack",["base_attr"]],"4005":["attack",["base_attr","two_attr"]],"4006":["attack",["base_attr","two_attr"]],"4007":["attack",["base_attr","two_attr"]],"4008":["attack",["base_attr","two_attr"]],"4009":["attack",["base_attr","two_attr"]],"4010":["attack",["base_attr"]],"4011":["attack",["base_attr","three_attr"]],"4012":["attack",["base_attr","three_attr"]],"4013":["attack",["base_attr","three_attr"]],"4014":["attack",["base_attr","three_attr"]],"4015":["attack",["base_attr","three_attr"]],"4016":["attack",["base_attr"]],"4017":["attack",["base_attr"]],"4018":["attack",["base_attr"]],"4019":["attack",[]],"4020":["attack",[]],"4021":["attack",[]],"4022":["attack",[]],"4023":["attack",[]],"4024":["attack",[]],"4025":["attack",[]],"4026":["attack",[]],"4027":["attack",[]],"4028":["attack",[]],"4029":["attack",[]],"4030":["attack",[]],"4031":["attack",[]],"4032":["attack",[]],"4033":["attack",[]],"4034":["attack",[]],"4035":["attack",[]],"4036":["attack",[]],"4037":["attack",[]],"4038":["attack",[]],"4039":["attack",[]],"4040":["attack",[]],"4041":["attack",[]],"4042":["attack",[]],"4043":["attack",[]],"4044":["attack",[]],"4045":["attack",[]],"4046":["attack",[]],"4047":["attack",[]],"4048":["attack",[]],"4049":["attack",[]],"4050":["attack",[]],"4051":["attack",[]],"4052":["attack",[]],"4053":["attack",[]],"4054":["attack",[]],"4055":["attack",[]],"4056":["attack",[]],"4057":["attack",[]],"4058":["attack",[]],"4059":["attack",[]],"4060":["attack",[]],"5001":["attack_speed",[]],"5002":["attack_speed",[]],"5003":["attack_speed",[]],"5004":["attack_speed",["base_attr"]],"5005":["attack_speed",["base_attr"]],"5006":["attack_speed",["base_attr","two_attr"]],"5007":["attack_speed",["base_attr","two_attr"]],"5008":["attack_speed",["base_attr","two_attr"]],"5009":["attack_speed",["two_attr"]],"5010":["attack_speed",["base_attr","two_attr"]],"5011":["attack_speed",["base_attr","three_attr"]],"5012":["attack_speed",["base_attr","three_attr"]],"5013":["attack_speed",["base_attr","three_attr"]],"5014":["attack_speed",["base_attr","three_attr"]],"5015":["attack_speed",["three_attr"]],"5016":["attack_speed",[]],"5017":["attack_speed",[]],"5018":["attack_speed",["base_attr"]],"5019":["attack_speed",["base_attr"]],"5020":["attack_speed",["base_attr"]],"5021":["attack_speed",["base_attr"]],"5022":["attack_speed",["base_attr"]],"5023":["attack_speed",[]],"5024":["attack_speed",[]],"5025":["attack_speed",[]],"5026":["attack_speed",[]],"5027":["attack_speed",[]],"5028":["attack_speed",[]],"5029":["attack_speed",[]],"5030":["attack_speed",[]],"6001":["move_speed",[]],"6002":["move_speed",[]],"6003":["move_speed",[]],"6004":["move_speed",[]],"6005":["move_speed",[]],"6006":["move_speed",["base_attr"]],"6007":["move_speed",["base_attr"]],"6008":["move_speed",["base_attr"]],"6009":["move_speed",["base_attr"]],"6010":["move_speed",["base_attr"]],"6011":["move_speed",[]],"6012":["move_speed",["three_attr"]],"6013":["move_speed",["base_attr","three_attr"]],"6014":["move_speed",["base_attr","three_attr"]],"6015":["move_speed",["base_attr","three_attr"]],"6016":["move_speed",["base_attr","three_attr"]],"6017":["move_speed",["base_attr"]],"6018":["move_speed",[]],"6019":["move_speed",[]],"6020":["move_speed",["base_attr"]],"6021":["move_speed",["base_attr"]],"6022":["move_speed",["base_attr"]],"6023":["move_speed",["base_attr"]],"6024":["move_speed",["base_attr"]],"6025":["move_speed",[]],"6026":["move_speed",[]],"6027":["move_speed",[]],"6028":["move_speed",[]],"6029":["move_speed",[]],"6030":["move_speed",[]],"7001":["soldier_defence",["base_attr"]],"7002":["soldier_defence",["base_attr","two_attr"]],"7003":["soldier_defence",["base_attr","two_attr"]],"7004":["soldier_defence",["base_attr","two_attr"]],"7005":["soldier_defence",["base_attr","two_attr","three_attr"]],"7006":["soldier_defence",["base_attr","two_attr","three_attr"]],"7007":["soldier_defence",["base_attr","three_attr"]],"7008":["soldier_defence",["base_attr","three_attr"]],"7009":["soldier_defence",["base_attr","three_attr"]],"7010":["soldier_defence",["base_attr"]],"7011":["soldier_defence",["base_attr"]],"7012":["soldier_defence",["base_attr"]],"7013":["soldier_defence",["base_attr"]],"7014":["soldier_defence",["base_attr"]],"7015":["soldier_defence",["base_attr"]],"7016":["soldier_defence",[]],"7017":["soldier_defence",[]],"7018":["soldier_defence",[]],"7019":["soldier_defence",[]],"7020":["soldier_defence",[]],"7021":["soldier_defence",[]],"7022":["soldier_defence",[]],"7023":["soldier_defence",[]],"7024":["soldier_defence",[]],"7025":["soldier_defence",[]],"7026":["soldier_defence",[]],"7027":["soldier_defence",[]],"7028":["soldier_defence",[]],"7029":["soldier_defence",[]],"7030":["soldier_defence",[]],"8001":["soldier_attack",["base_attr"]],"8002":["soldier_attack",["base_attr","two_attr"]],"8003":["soldier_attack",["base_attr","two_attr"]],"8004":["soldier_attack",["base_attr","two_attr"]],"8005":["soldier_attack",["base_attr","two_attr"]],"8006":["soldier_attack",["base_attr","two_attr","three_attr"]],"8007":["soldier_attack",["base_attr","two_attr","three_attr"]],"8008":["soldier_attack",["base_attr","two_attr","three_attr"]],"8009":["soldier_attack",["base_attr","two_attr","three_attr"]],"8010":["soldier_attack",["base_attr","two_attr","three_attr"]],"8011":["soldier_attack",["base_attr","two_attr"]],"8012":["soldier_attack",["base_attr"]],"8013":["soldier_attack",["base_attr"]],"8014":["soldier_attack",["base_attr"]],"8015":["soldier_attack",["base_attr"]],"8016":["soldier_attack",[]],"8017":["soldier_attack",[]],"8018":["soldier_attack",[]],"8019":["soldier_attack",[]],"8020":["soldier_attack",[]],"8021":["soldier_attack",[]],"8022":["soldier_attack",[]],"8023":["soldier_attack",[]],"8024":["soldier_attack",[]],"8025":["soldier_attack",[]],"8026":["soldier_attack",[]],"8027":["soldier_attack",[]],"8028":["soldier_attack",[]],"8029":["soldier_attack",[]],"8030":["soldier_attack",[]],"9001":["soldier_recover",[]],"9002":["soldier_recover",[]],"9003":["soldier_recover",["base_attr"]],"9004":["soldier_recover",["base_attr"]],"9005":["soldier_recover",["base_attr"]],"9006":["soldier_recover",["base_attr"]],"9007":["soldier_recover",["base_attr"]],"9008":["soldier_recover",["base_attr"]],"9009":["soldier_recover",["base_attr"]],"9010":["soldier_recover",["base_attr"]],"9011":["soldier_recover",["base_attr"]],"9012":["soldier_recover",["base_attr"]],"9013":["soldier_recover",[]],"9014":["soldier_recover",[]],"9015":["soldier_recover",[]],"9016":["soldier_recover",["base_attr"]],"9017":["soldier_recover",["base_attr"]],"9018":["soldier_recover",["base_attr"]],"9019":["soldier_recover",["base_attr"]],"9020":["soldier_recover",["base_attr"]],"9021":["soldier_recover",[]],"9022":["soldier_recover",[]],"9023":["soldier_recover",[]],"9024":["soldier_recover",[]],"9025":["soldier_recover",[]],"9026":["soldier_recover",[]],"9027":["soldier_recover",[]],"9028":["soldier_recover",[]],"9029":["soldier_recover",[]],"9030":["soldier_recover",[]],"10001":["leadershipA",["three_attr"]],"10002":["leadershipA",["three_attr"]],"10003":["leadershipA",[]],"10004":["leadershipA",[]],"10005":["leadershipA",[]],"11001":["leadershipB",["three_attr"]],"11002":["leadershipB",["three_attr"]],"11003":["leadershipB",[]],"11004":["leadershipB",[]],"11005":["leadershipB",[]],"13601":["life",[]],"13651":["defence",[]],"13671":["leadershipA",[]],"13701":["attack",[]],"13751":["move_speed",[]],"13801":["attack",[]],"13851":["attack_speed",[]],"13901":["life",[]],"13951":["defence",[]],"14001":["attack",[]],"14051":["attack_speed",[]],"14101":["attack_speed",[]],"14151":["move_speed",[]],"14201":["attack",[]],"14251":["leadershipB",[]],"14301":["leadershipA",[]],"14351":["attack_speed",[]],"14401":["life",[]],"14451":["soldier_recover",[]],"14501":["defence",[]],"14551":["life_recover",[]]},"exclusive":[104,105,106,107,108,109,110,111,112,115,999,-1]};
        // ES5 only: runs in the original SpiderMonkey / Cocos JSB engine.
        LocalNative.scoutCloudStatus = function(step, detail) {
            var status = {step: step, detail: String(detail || '').slice(0, 240), time: Date.now()};
            LocalNative.scoutCloudLastStatus = status;
            try { sys.localStorage.setItem(LocalNative.scoutCloudConfig.storageKey + '.status', JSON.stringify(status)); } catch (e) {}
            try { cc.log('DinoLocal scout-cloud ' + step + ' ' + status.detail); } catch (eLog) {}
        };
        LocalNative.validateScoutCloudEntry = function(entry, expected) {
            var rules = LocalNative.scoutCloudRules, cfg = LocalNative.scoutCloudConfig;
            function fail() { throw new Error('Invalid cloud scout layout'); }
            function integer(v, low, high) { return typeof v === 'number' && isFinite(v) && Math.floor(v) === v && v >= low && v <= high; }
            function object(v) { return v && typeof v === 'object' && !Array.isArray(v); }
            if (!object(entry) || !/^[a-f0-9]{64}$/.test(entry.id) || !integer(entry.headquartersLevel, 1, 10)) fail();
            if (expected && (entry.id !== expected.id || entry.headquartersLevel !== expected.headquartersLevel)) fail();
            var layout = entry.layout;
            if (!object(layout) || !integer(layout.stage, 1, 999) || typeof layout.name !== 'string' || !layout.name.trim() || layout.name.length > 80 ||
                layout.source !== 'user-authored-layout' || !Array.isArray(layout.units) || !layout.units.length || layout.units.length > 1572 ||
                !Array.isArray(layout.walls) || layout.walls.length > 4096) fail();
            if (expected && layout.name.trim() !== expected.name) fail();
            var ids = {}, anchors = {}, occupied = {}, homes = 0, guards = 0, buildings = 0, start = 100000 + layout.stage * 1000;
            function occupy(x, y) {
                if (!integer(x, 11, 48) || !integer(y, 11, 48) || occupied[x + ':' + y]) fail();
                occupied[x + ':' + y] = true;
            }
            for (var i = 0; i < layout.units.length; i++) {
                var unit = layout.units[i];
                if (!object(unit) || unit.sid !== start + i + 1 || ids[unit.sid] || unit.localNativeStableSid !== true || !integer(unit.typeid, 1, 99999999)) fail();
                ids[unit.sid] = true;
                if (!unit.localNativeGuard) {
                    if (guards) fail();
                    buildings++;
                    var spec = rules.buildings[unit.typeid];
                    if (!spec || !integer(unit.x, 11, 48) || !integer(unit.y, 11, 48)) fail();
                    for (var x = unit.x - spec[0] + 1; x <= unit.x; x++)
                        for (var y = unit.y - spec[1] + 1; y <= unit.y; y++) occupy(x, y);
                    var family = Math.floor(unit.typeid / 100);
                    anchors[unit.sid] = family;
                    if (family === 201) { homes++; if (unit.typeid % 100 !== entry.headquartersLevel) fail(); }
                } else {
                    guards++;
                    var hero = rules.guards[unit.typeid], mutation = unit.unit_mutateid;
                    if (unit.localNativeGuard !== true || !hero || !integer(mutation, 0, hero.basics.length - 1) || !hero.basics[mutation] || !hero.basics[mutation].length ||
                        !integer(unit.lv, 1, 100) || unit.id !== unit.sid || unit.unit_type !== Math.floor(unit.typeid / 100) || unit.unit_level !== unit.typeid % 100 ||
                        unit.state !== 2 || unit.xp !== 0 || typeof unit.did !== 'string' || unit.did !== unit.defense_id ||
                        [301,505,506,507].indexOf(anchors[unit.did]) < 0 || unit.rct !== 0 || unit.aht !== 0 || unit.aidx !== -1 ||
                        !Array.isArray(unit.skills) || unit.skills.length > 16) fail();
                    var basic = hero.basics[mutation], seen = {}, extras = 0;
                    for (var j = 0; j < unit.skills.length; j++) {
                        var skill = unit.skills[j];
                        if (!integer(skill, 1, 99999999) || seen[skill] || (basic.indexOf(skill) < 0 && rules.skills[hero.skills].indexOf(skill) < 0)) fail();
                        seen[skill] = true;
                        if (basic.indexOf(skill) < 0) extras++;
                    }
                    if (extras > 3 || basic.some(function(s) { return !seen[s]; })) fail();
                    if (unit.eqp !== undefined) {
                        if (!Array.isArray(unit.eqp) || unit.eqp.length !== 5) fail();
                        for (var slot = 0; slot < 5; slot++) {
                            var rune = unit.eqp[slot]; if (rune === null) continue;
                            if (!object(rune) || rune.slot !== slot || rules.runeSlots[rune.typeid] !== slot || !integer(rune.hero_attr, 0, 99999999) ||
                                (rune.hero_attr !== 0 && rules.exclusive.indexOf(rune.hero_attr) < 0)) fail();
                            var layers = ['base_attr','two_attr','three_attr'];
                            for (var l = 0; l < layers.length; l++) {
                                var attrs = rune[layers[l]], stats = {};
                                if (!Array.isArray(attrs) || attrs.length > 11) fail();
                                for (var a = 0; a < attrs.length; a++) {
                                    var attribute = rules.attributes[attrs[a]];
                                    if (!integer(attrs[a], 1, 99999999) || !attribute || attribute[1].indexOf(layers[l]) < 0 || stats[attribute[0]]) fail();
                                    stats[attribute[0]] = true;
                                }
                            }
                        }
                    }
                }
            }
            if (homes !== 1 || guards > 128 || buildings > 1444) fail();
            for (var w = 0; w < layout.walls.length; w++) {
                var wall = layout.walls[w];
                if (!Array.isArray(wall) || wall.length !== 4 || !integer(wall[0], 1, 10) || wall[3] !== 0) fail();
                occupy(wall[1], wall[2]);
            }
            if (JSON.stringify(entry).length > cfg.maxResponseChars) fail();
            return entry;
        };
        LocalNative.validateScoutCloudSnapshot = function(snapshot) {
            var cfg = LocalNative.scoutCloudConfig;
            if (!snapshot || snapshot.schema !== cfg.schema || snapshot.baseUrl !== cfg.baseUrl ||
                typeof snapshot.revision !== 'number' || !isFinite(snapshot.revision) || Math.floor(snapshot.revision) !== snapshot.revision || snapshot.revision < 0 ||
                !Array.isArray(snapshot.levels) || snapshot.levels.length > cfg.maxEntries) throw new Error('Invalid cloud scout snapshot');
            var ids = {};
            for (var i = 0; i < snapshot.levels.length; i++) {
                LocalNative.validateScoutCloudEntry(snapshot.levels[i]);
                if (ids[snapshot.levels[i].id]) throw new Error('Duplicate cloud scout entry');
                ids[snapshot.levels[i].id] = true;
            }
            if (JSON.stringify(snapshot).length > cfg.maxCacheChars) throw new Error('Cloud scout cache too large');
            return snapshot;
        };
        LocalNative.ensureScoutCloudState = function() {
            if (LocalNative.scoutCloudState) return LocalNative.scoutCloudState;
            var state = LocalNative.scoutCloudState = {snapshot:null, pointer:null, syncing:false, lastAttempt:0, clock:false};
            var key = LocalNative.scoutCloudConfig.storageKey;
            try {
                var pointer = JSON.parse(sys.localStorage.getItem(key + '.commit') || 'null');
                if (!pointer) return state;
                var choices = [pointer, pointer.previous];
                for (var i = 0; i < choices.length; i++) {
                    var choice = choices[i];
                    if (!choice || ['a','b'].indexOf(choice.slot) < 0) continue;
                    try {
                        var text = sys.localStorage.getItem(key + '.' + choice.slot);
                        if (!text || text.length > LocalNative.scoutCloudConfig.maxCacheChars) continue;
                        var snapshot = LocalNative.validateScoutCloudSnapshot(JSON.parse(text));
                        if (snapshot.revision !== choice.revision) continue;
                        state.snapshot = snapshot; state.pointer = choice;
                        LocalNative.scoutCloudStatus('cache-loaded', snapshot.revision + '/' + snapshot.levels.length);
                        break;
                    } catch (eSlot) {}
                }
            } catch (eLoad) { LocalNative.scoutCloudStatus('cache-invalid', eLoad.message); }
            return state;
        };
        LocalNative.getScoutCandidatePool = function() {
            var state = LocalNative.ensureScoutCloudState();
            if (state.snapshot && state.snapshot.levels.length)
                return {policy:LocalNative.scoutLevelPool.policy, levels:state.snapshot.levels};
            return LocalNative.scoutLevelPool;
        };
        LocalNative.commitScoutCloudSnapshot = function(snapshot) {
            LocalNative.validateScoutCloudSnapshot(snapshot);
            var state = LocalNative.ensureScoutCloudState(), key = LocalNative.scoutCloudConfig.storageKey;
            var slot = state.pointer && state.pointer.slot === 'a' ? 'b' : 'a';
            var text = JSON.stringify(snapshot), pointer = {slot:slot, revision:snapshot.revision};
            if (state.pointer) pointer.previous = {slot:state.pointer.slot, revision:state.pointer.revision};
            sys.localStorage.setItem(key + '.' + slot, text);
            if (sys.localStorage.getItem(key + '.' + slot) !== text) throw new Error('Cloud scout slot verify failed');
            var old = sys.localStorage.getItem(key + '.commit'), commit = JSON.stringify(pointer);
            try {
                sys.localStorage.setItem(key + '.commit', commit);
                if (sys.localStorage.getItem(key + '.commit') !== commit) throw new Error('Cloud scout commit verify failed');
            } catch (eCommit) {
                try { if (old) sys.localStorage.setItem(key + '.commit', old); else sys.localStorage.removeItem(key + '.commit'); } catch (eRollback) {}
                throw eCommit;
            }
            state.snapshot = snapshot; state.pointer = pointer;
        };
        LocalNative.decodeScoutCloudText = function(text) {
            // Older JSB XHR exposes UTF-8 response bytes as Latin-1 code units.
            // Already-decoded Unicode and genuine Latin-1 strings must stay intact.
            if (/[^\u0000-\u00ff]/.test(text)) return text;
            try {
                return decodeURIComponent(text.replace(/[%\u0080-\u00ff]/g, function(ch) {
                    return '%' + ('0' + ch.charCodeAt(0).toString(16)).slice(-2);
                }));
            } catch (eDecode) { return text; }
        };
        LocalNative.requestScoutCloudJson = function(path, callback) {
            var cfg = LocalNative.scoutCloudConfig, xhr, done = false;
            function finish(error, value) {
                if (done) return; done = true;
                callback(error, value);
            }
            try {
                xhr = new XMLHttpRequest();
                xhr.open('GET', cfg.baseUrl + path, true);
                try { xhr.timeout = cfg.requestTimeoutSeconds * 1000; } catch (eTimeout) {}
                xhr.onreadystatechange = function() {
                    if (done || xhr.readyState !== 4) return;
                    var value;
                    try {
                        if (xhr.status !== 200) throw new Error('HTTP ' + xhr.status);
                        if (typeof xhr.responseText !== 'string' || xhr.responseText.length > cfg.maxResponseChars) throw new Error('Cloud response too large');
                        value = JSON.parse(LocalNative.decodeScoutCloudText(xhr.responseText));
                    } catch (eResponse) { finish(eResponse); return; }
                    finish(null, value);
                };
                xhr.onerror = function() { finish(new Error('Cloud network failure')); };
                xhr.ontimeout = function() { finish(new Error('Cloud request timeout')); };
                if (!LocalNative.scheduleOnRoot(function() {
                    if (!done) { try { xhr.abort(); } catch (eAbort) {} finish(new Error('Cloud watchdog timeout')); }
                }, cfg.requestTimeoutSeconds + 1)) throw new Error('Cloud timeout scheduler unavailable');
                xhr.send();
            } catch (eRequest) { finish(eRequest); }
        };
        LocalNative.syncScoutCloudPool = function() {
            var state = LocalNative.ensureScoutCloudState(), cfg = LocalNative.scoutCloudConfig, now = Date.now();
            if (state.syncing || (state.lastAttempt && now - state.lastAttempt < cfg.pollSeconds * 1000)) return false;
            state.lastAttempt = now; state.syncing = true;
            LocalNative.scoutCloudStatus('checking');
            function fail(error) { state.syncing = false; LocalNative.scoutCloudStatus('sync-failed', error.message); }
            function manifest(data) {
                if (!data || data.schema !== 'dino-scout-cloud/v1' || typeof data.revision !== 'number' ||
                    !isFinite(data.revision) || Math.floor(data.revision) !== data.revision || data.revision < 0 || !Array.isArray(data.levels) || data.levels.length > cfg.maxEntries)
                    throw new Error('Invalid cloud manifest');
                var seen = {};
                for (var i = 0; i < data.levels.length; i++) {
                    var row = data.levels[i];
                    if (!row || typeof row.id !== 'string' || !/^[a-f0-9]{64}$/.test(row.id) || seen[row.id] || typeof row.name !== 'string' ||
                        !row.name.trim() || row.name.length > 80 || typeof row.headquartersLevel !== 'number' || Math.floor(row.headquartersLevel) !== row.headquartersLevel ||
                        row.headquartersLevel < 1 || row.headquartersLevel > 10) throw new Error('Invalid cloud manifest entry');
                    seen[row.id] = true;
                }
                return data;
            }
            LocalNative.requestScoutCloudJson('/api/pool', function(error, data) {
                if (error) { fail(error); return; }
                try { manifest(data); } catch (eManifest) { fail(eManifest); return; }
                if (state.snapshot && state.snapshot.revision === data.revision) {
                    var oldIds = state.snapshot.levels.map(function(e) { return e.id; }).join(',');
                    if (oldIds === data.levels.map(function(e) { return e.id; }).join(',')) {
                        state.syncing = false; LocalNative.scoutCloudStatus('up-to-date', data.revision); return;
                    }
                }
                var reusable = {}, entries = [], bytes = 0, index = 0;
                if (state.snapshot) state.snapshot.levels.forEach(function(e) { reusable[e.id] = e; });
                function accept(entry, row) {
                    LocalNative.validateScoutCloudEntry(entry, row);
                    bytes += JSON.stringify(entry).length;
                    if (bytes > cfg.maxCacheChars - 4096) throw new Error('Cloud scout snapshot too large');
                    entries.push(entry);
                }
                function next() {
                    // Iterate cached records without recursive callbacks.
                    try {
                        while (index < data.levels.length && reusable[data.levels[index].id]) {
                            var cached = data.levels[index++]; accept(reusable[cached.id], cached);
                        }
                    } catch (eCached) { fail(eCached); return; }
                    if (index < data.levels.length) {
                        var row = data.levels[index++];
                        LocalNative.requestScoutCloudJson('/api/layouts/' + row.id, function(eEntry, value) {
                            if (eEntry) { fail(eEntry); return; }
                            try {
                                if (!value || value.schema !== 'dino-scout-entry/v1') throw new Error('Invalid cloud entry schema');
                                accept({id:value.id, headquartersLevel:value.headquartersLevel, layout:value.layout}, row);
                            } catch (eValidate) { fail(eValidate); return; }
                            next();
                        });
                        return;
                    }
                    LocalNative.requestScoutCloudJson('/api/pool', function(eFinal, finalData) {
                        if (eFinal) { fail(eFinal); return; }
                        try {
                            manifest(finalData);
                            if (JSON.stringify(finalData) !== JSON.stringify(data)) throw new Error('Cloud manifest changed during download');
                            LocalNative.commitScoutCloudSnapshot({schema:cfg.schema, baseUrl:cfg.baseUrl, revision:data.revision, levels:entries});
                        } catch (eCommit) { fail(eCommit); return; }
                        state.syncing = false; LocalNative.scoutCloudStatus('sync-ok', data.revision + '/' + entries.length);
                    });
                }
                next();
            });
            return true;
        };
        LocalNative.startScoutCloudSync = function() {
            var state = LocalNative.ensureScoutCloudState();
            LocalNative.syncScoutCloudPool();
            // A home transition may destroy the previous scheduling root.
            var token = state.clockToken = (state.clockToken || 0) + 1;
            function tick() {
                if (token !== state.clockToken) return;
                state.clock = false;
                try { LocalNative.syncScoutCloudPool(); } catch (error) { LocalNative.scoutCloudStatus('clock-failed', error.message); }
                state.clock = LocalNative.scheduleOnRoot(tick, LocalNative.scoutCloudConfig.pollSeconds);
            }
            state.clock = LocalNative.scheduleOnRoot(tick, LocalNative.scoutCloudConfig.pollSeconds);
        };
        // END SCOUT CLOUD SYNC

        LocalNative.readScoutHeadquartersLevel = function(level) {
            var units = level && level.units || [], found = 0;
            for (var key in units) {
                if (!Object.prototype.hasOwnProperty.call(units, key)) continue;
                var typeid = Number(units[key] && units[key].typeid);
                if (Math.floor(typeid / 100) === 201) found = Math.max(found, typeid % 100);
            }
            return found;
        };
        LocalNative.selectScoutLevel = function(level, random) {
            var pool = LocalNative.getScoutCandidatePool(), policy = pool.policy;
            if (LocalNative.scoutCloudState && LocalNative.scoutCloudState.clock)
                LocalNative.syncScoutCloudPool();
            var candidates = pool.levels, hq = LocalNative.readScoutHeadquartersLevel(level);
            if (policy.mode === 'headquarters-range') {
                if (!hq) throw new Error('Scout player headquarters level missing');
                candidates = candidates.filter(function(entry) {
                    return Math.abs(entry.headquartersLevel - hq) <= policy.headquartersDelta;
                });
            } else if (policy.mode !== 'all') throw new Error('Unknown scout matching policy');
            if (!candidates.length) throw new Error('No matching predefined scout levels');
            var roll = (random || Math.random)();
            if (!(roll >= 0 && roll < 1)) throw new Error('Invalid scout random value');
            return candidates[Math.floor(roll * candidates.length)];
        };

        // Stock scouting UI, with independent user-authored opponent snapshots.
        // Scout stocks contain the stealable share, which stock BattleResourceStorage
        // transfers progressively on hits. Never alter the shared layout or unit config.
        LocalNative.fillScoutResourceLoot = function(units) {
            var total = {gold: 0, wood: 0};
            for (var i = 0; i < units.length; i++) {
                var unit = units[i], family = Math.floor(Number(unit.typeid) / 100);
                if (!(family >= 202 && family <= 205) || unit.localNativeGuard) continue;
                var cfg = LocalNative.lookupUnitMain(unit.typeid);
                if (!cfg) throw new Error('Missing scout resource configuration ' + unit.typeid);
                var producer = family === 202 || family === 204;
                var type = family === 204 || family === 205 ? 2 : 1;
                var capacity = Number(cfg[producer ? 'temp_storage' :
                    (type === 2 ? 'gold_storage' : 'wood_storage')]);
                if (!isFinite(capacity) || capacity < 0)
                    throw new Error('Invalid scout resource capacity ' + unit.typeid);
                var amount = Math.floor(capacity * (producer ? 80 : 20) / 100);
                unit.sto = producer ? amount : {1: 0, 2: 0};
                if (!producer) unit.sto[type] = amount;
                unit.goldstorage = unit.gold_storage_cur = type === 2 ? amount : 0;
                unit.woodstorage = unit.wood_storage_cur = type === 1 ? amount : 0;
                unit.currentStorage = amount;
                total[type === 2 ? 'gold' : 'wood'] += amount;
            }
            return total;
        };
        LocalNative.readScoutBattleLoot = function(gc, session) {
            var total = session.scoutLoot || {gold: 0, wood: 0};
            if (!total.gold && !total.wood) return {gold: 0, wood: 0};
            if (!gc || gc.__localPvpSession !== session || gc.inReplayMode || gc.isEnterEnemyAttackReplay)
                throw new Error('Scout resource battle session mismatch');
            // The stock hit callback uses this same defender ResourceManager.
            var client = gc.getStageClient && gc.getStageClient();
            var rm = client && client.getComponent && client.getComponent('ResourceManager');
            if (!rm || !rm.lostRes) throw new Error('Missing scout defender resource losses');
            function amount(type, max) {
                var lost = Number(rm.lostRes[type]);
                if (!isFinite(lost) || lost < 0) throw new Error('Invalid scout resource loss');
                return Math.floor(Math.min(max, lost));
            }
            return {gold: amount(2, total.gold), wood: amount(1, total.wood)};
        };
        LocalNative.buildPvpBattleDict = function(level, player) {
            var target = LocalNative.selectScoutLevel(level);
            var dict = LocalNative.buildPveBattleDict(1, target.layout);
            dict.oppo.player.stage = 0;
            dict.oppo.player.pveStage = 0;
            dict.oppo.player.account = dict.oppo.player.account_id = 'local-scout-opponent';
            dict.oppo.player.accountID = dict.oppo.player.account;
            dict.oppo.player.nickname = target.layout.name;
            dict.oppo.nickname = dict.oppo.player.nickname;
            dict.oppo.account = dict.oppo.account_id = dict.oppo.accountID = dict.oppo.player.account;
            dict.oppo.stage = 0;
            dict.oppo.pveStage = 0;
            dict.oppo.player.defence_score = 0;
            dict.isPVE = false;
            dict.localNativePve = false;
            dict.localNativePveStage = 0;
            dict.localNativePvp = true;
            dict.source = 'local-predefined-scout';
            dict.localNativeScoutLevelId = target.id;
            dict.localNativeScoutHeadquartersLevel = target.headquartersLevel;
            dict.localNativeScoutLoot = LocalNative.fillScoutResourceLoot(dict.oppo.units);
            dict.oppo.gold = dict.localNativeScoutLoot.gold;
            dict.oppo.wood = dict.localNativeScoutLoot.wood;
            dict.self.player.stage = dict.self.stage = 0;
            var rm = LocalNative.getResourceManager && LocalNative.getResourceManager();
            if (rm && rm.Res && rm.maxRes) {
                dict.self.gold = rm.Res[typeof RES_TYPE_GOLD !== 'undefined' ? RES_TYPE_GOLD : 2];
                dict.self.wood = rm.Res[typeof RES_TYPE_WOOD !== 'undefined' ? RES_TYPE_WOOD : 1];
                dict.self.max_gold = rm.maxRes[typeof RES_TYPE_GOLD !== 'undefined' ? RES_TYPE_GOLD : 2];
                dict.self.max_wood = rm.maxRes[typeof RES_TYPE_WOOD !== 'undefined' ? RES_TYPE_WOOD : 1];
            }
            return dict;
        };
        LocalNative.handleEnterPvpBattle = function(player) {
            var previous = LocalNative.pvpSession;
            if (previous && !previous.closed && !previous.completed && !previous.scouting) return false;
            var store = LocalNative.readRaw();
            var dict = LocalNative.buildPvpBattleDict(store.level, player);
            LocalNative.pveSession = null;
            LocalNative.pvpSession = {closed: false, completed: false, returning: false,
                scouting: true, player: player, scoutLevelId: dict.localNativeScoutLevelId,
                scoutLoot: dict.localNativeScoutLoot};
            player.rpc_c_enter_battle(dict);
            LocalNative.writeStatus({step: 'enter-pvp-battle-ok', source: dict.source,
                scoutLevelId: dict.localNativeScoutLevelId,
                headquartersLevel: dict.localNativeScoutHeadquartersLevel,
                heros: dict.self.heros.length, units: dict.oppo.units.length});
            return true;
        };
        LocalNative.handleStartPvpBattle = function(gc) {
            var session = LocalNative.pvpSession;
            if (!session || session.closed || session.completed || session.started ||
                !gc || gc.__localPvpSession !== session || !gc.battleStarted ||
                gc.inReplayMode || gc.isEnterEnemyAttackReplay) return false;
            var store = LocalNative.readRaw();
            LocalNative.advanceDailyQuestCounter(store.level, 'mt_PVP', 1);
            LocalNative.writeRaw(store);
            session.started = true;
            session.scouting = false;
            LocalNative.syncQuestEventRecorder(session.player, store.level);
            LocalNative.writeStatus({step: 'pvp-quest-start', field: 'mt_PVP'});
            return true;
        };
        LocalNative.handleCompletePvpBattle = function(player) {
            var session = LocalNative.pvpSession;
            if (!session || session.closed || session.completed) return false;
            var gc = LocalNative.getBattleController();
            if (!session.started && !LocalNative.handleStartPvpBattle(gc)) return false;
            var result = LocalNative.buildPveBattleResultDict(gc, 1);
            result.stage = 0;
            var loot = LocalNative.readScoutBattleLoot(gc, session);
            result.win_gold = loot.gold;
            result.win_wood = loot.wood;
            result.enemy_id = 'local-scout-opponent';
            var store = LocalNative.readRaw();
            if (loot.gold || loot.wood) LocalNative.grantPveLoot(loot.gold, loot.wood, store.level);
            LocalNative.ensurePlayerSocialFields(store.level.player);
            var stats = store.level.player.achieve_raw;
            stats.pvp_times = (Number(stats.pvp_times) || 0) + 1;
            if (result.isWinner) {
                stats.pvp_win_times = (Number(stats.pvp_win_times) || 0) + 1;
                LocalNative.advanceDailyQuestCounter(store.level, 'mt_PVPvictory', 1);
            }
            player.achieve_raw = stats;
            var recorder = player.getComponent && player.getComponent('AchievementRecorder');
            if (recorder) recorder.achieve_raw = stats;
            LocalNative.writeRaw(store);
            session.completed = true;
            LocalNative.syncQuestEventRecorder(player, store.level);
            player.rpc_c_battle_result(result);
            LocalNative.writeStatus({step: 'complete-pvp-battle-ok', pvp_times: stats.pvp_times,
                starNum: result.starNum, isWinner: result.isWinner});
            return true;
        };
        LocalNative.handlePvpBattleToHome = function(player) {
            var session = LocalNative.pvpSession;
            if (!session || session.returning || session.closed) return false;
            session.returning = true;
            var store = LocalNative.readRaw();
            player.rpc_c_battle_to_home(store.level);
            session.closed = true;
            LocalNative.writeStatus({step: 'pvp-battle-to-home-ok', completed: session.completed});
            return true;
        };

        LocalNative.handleEnterPveBattle = function(player, params) {
            var stageId = params && (params.level != null ? params.level : params.stage);
            LocalNative.writeStatus({step: 'enter-pve-battle', stage: stageId});
            LocalNative.pveSession = {
                stage: parseInt(stageId, 10) || 1,
                returning: false,
                closed: false,
                completed: false,
                starNum: 0,
                winGold: 0,
                winWood: 0
            };
            try {
                var dict = LocalNative.buildPveBattleDict(stageId);
                LocalNative.writeStatus({
                    step: 'enter-pve-battle-dict',
                    stage: stageId,
                    units: dict.units ? dict.units.length : 0,
                    heros: dict.self && dict.self.heros ? dict.self.heros.length : 0,
                    gold: dict.self ? dict.self.gold : null,
                    wood: dict.self ? dict.self.wood : null,
                    oppoStage: dict.oppo && dict.oppo.player ? dict.oppo.player.stage : null,
                    source: dict.source
                });
                if (player && typeof player.rpc_c_enter_battle === 'function') {
                    player.rpc_c_enter_battle(dict);
                    LocalNative.writeStatus({step: 'rpc_c_enter_battle-ok', stage: stageId});
                } else if (player && typeof player.changeStageAndInit === 'function') {
                    var battle = typeof GS_STAGE_BATTLE !== 'undefined' ? GS_STAGE_BATTLE : 2;
                    player.changeStageAndInit(battle, dict, true);
                    LocalNative.writeStatus({step: 'enter-pve-via-changeStage', stage: stageId});
                } else {
                    LocalNative.pveSession.closed = true;
                    LocalNative.writeStatus({step: 'enter-pve-battle-no-handler', stage: stageId});
                    return false;
                }
            } catch (ePve) {
                if (LocalNative.pveSession) LocalNative.pveSession.closed = true;
                LocalNative.writeStatus({
                    step: 'enter-pve-battle-ERR',
                    stage: stageId,
                    error: String(ePve),
                    stack: (ePve && ePve.stack) ? String(ePve.stack).split('\n').slice(0, 8) : null
                });
                return false;
            }
            return true;
        };

        LocalNative.getBattleController = function() {
            try {
                if (typeof DA !== 'undefined' && DA && typeof DA.GETGC === 'function' &&
                    typeof GS_STAGE_BATTLE !== 'undefined') {
                    var gc = DA.GETGC(GS_STAGE_BATTLE);
                    if (gc) return gc;
                }
            } catch (e1) {}
            try {
                if (typeof g_GameControllerList !== 'undefined' && g_GameControllerList &&
                    typeof GS_STAGE_BATTLE !== 'undefined')
                    return g_GameControllerList[GS_STAGE_BATTLE] || null;
            } catch (e2) {}
            return null;
        };

        LocalNative.readLivePveStageId = function() {
            if (LocalNative.pveSession && LocalNative.pveSession.stage)
                return LocalNative.pveSession.stage;
            try {
                var gc = LocalNative.getBattleController();
                var client = gc && typeof gc.getStageClient === 'function' ? gc.getStageClient() : null;
                if (client && client.pveStage) return client.pveStage;
            } catch (e) {}
            return 1;
        };

        LocalNative.isLocalPveBattleActive = function() {
            if (LocalNative.pveSession && !LocalNative.pveSession.closed) return true;
            try {
                var gc = LocalNative.getBattleController();
                var client = gc && typeof gc.getStageClient === 'function' ? gc.getStageClient() : null;
                if (client && client.pveStage && !gc.isEnterEnemyAttackReplay) return true;
            } catch (e) {}
            return false;
        };

        LocalNative.isLocalRaidActive = function() {
            return !!(LocalNative.replaySession && !LocalNative.replaySession.closed &&
                LocalNative.raidController);
        };

        // availableStages[stage]=[goldLoot,woodLoot,stars,remainFlag]; unlock pve_next_stage on win.
        LocalNative.applyPveStageProgress = function(player, stageId, starNum, winGold, winWood) {
            if (!player) return null;
            LocalNative.ensureAvailableStages(player, 'pve-settle');
            stageId = parseInt(stageId, 10) || 1;
            starNum = Math.max(0, Math.min(3, Number(starNum) || 0));
            winGold = Math.max(0, Number(winGold) || 0);
            winWood = Math.max(0, Number(winWood) || 0);
            var stages = player.availableStages;
            var prev = stages[stageId] || stages[String(stageId)] ||
                LocalNative.readPveStageLoot(stageId);
            var oldStars = prev[2] || 0;
            var nextStars = Math.max(oldStars, starNum);
            var goldLeft = Math.max(0, (prev[0] || 0) - winGold);
            var woodLeft = Math.max(0, (prev[1] || 0) - winWood);
            var passTime = prev[3] != null ? prev[3] : 0;
            if (starNum >= 1 && !(Number(passTime) > 0)) passTime = 1;
            stages[stageId] = [goldLeft, woodLeft, nextStars, passTime];
            var unlocked = [];
            if (starNum >= 1) {
                try {
                    if (typeof data !== 'undefined' && data && data.pve_stage) {
                        var cfg = data.pve_stage[stageId] || data.pve_stage[String(stageId)];
                        var nextList = cfg && cfg.pve_next_stage;
                        if (nextList && nextList.length) {
                            for (var i = 0; i < nextList.length; i++) {
                                var nid = parseInt(nextList[i], 10);
                                if (!(nid > 0)) continue;
                                if (stages.hasOwnProperty(nid) || stages.hasOwnProperty(String(nid)))
                                    continue;
                                stages[nid] = LocalNative.readPveStageLoot(nid);
                                unlocked.push(nid);
                            }
                        }
                    }
                } catch (eNext) {}
            }
            try {
                if (typeof G_Player !== 'undefined' && G_Player && G_Player !== player) {
                    LocalNative.ensureAvailableStages(G_Player, 'pve-settle-live');
                    G_Player.availableStages = player.availableStages;
                }
            } catch (eGp) {}
            LocalNative.writeStatus({
                step: 'pve-stage-progress',
                stage: stageId,
                starNum: nextStars,
                winGold: winGold,
                winWood: winWood,
                unlocked: unlocked,
                entry: stages[stageId]
            });
            return {entry: stages[stageId], unlocked: unlocked};
        };

        LocalNative.buildPveBattleResultDict = function(gc, stageId) {
            var starNum = 0;
            var percent = 0;
            var isWinner = false;
            try {
                if (gc && gc.battleResult) {
                    starNum = gc.battleResult.starNum || 0;
                    isWinner = !!gc.battleResult.isWinner || starNum >= 1;
                    if (typeof gc.calRoundPercentage === 'function')
                        percent = gc.calRoundPercentage(gc.battleResult.battlePercents) || 0;
                    else
                        percent = gc.battleResult.battlePercents || 0;
                }
            } catch (eBr) {}
            percent = Math.max(0, Math.min(100, Number(percent) || 0));
            starNum = Math.max(0, Math.min(3, Number(starNum) || 0));
            var loot = LocalNative.readPveStageLoot(stageId);
            var maxGold = loot[0] || 0;
            var maxWood = loot[1] || 0;
            try {
                var store = LocalNative.readRaw();
                var p = store && store.level && store.level.player;
                if (p && p.availableStages) {
                    var cur = p.availableStages[stageId] || p.availableStages[String(stageId)];
                    if (cur && cur.length >= 2) {
                        maxGold = cur[0] != null ? cur[0] : maxGold;
                        maxWood = cur[1] != null ? cur[1] : maxWood;
                    }
                }
            } catch (eLoot) {}
            var ratio = percent / 100;
            if (starNum <= 0) ratio = Math.min(ratio, 0.49);
            var winGold = Math.floor(maxGold * ratio);
            var winWood = Math.floor(maxWood * ratio);
            return {
                win_gold: winGold,
                win_wood: winWood,
                flower: 0,
                score: 0,
                input_gains: [],
                exp_add: {},
                enemy_id: 0,
                starNum: starNum,
                isWinner: isWinner,
                percent: percent,
                stage: stageId
            };
        };

        LocalNative.grantPveLoot = function(winGold, winWood, level) {
            level = level || LocalNative.readRaw().level;
            var granted = {gold: 0, wood: 0};
            function add(type, amount, field, configField) {
                var left = Math.max(0, Number(amount) || 0);
                for (var i = 0; i < level.units.length && left > 0; i++) {
                    var record = level.units[i];
                    var cfg = LocalNative.lookupUnitMain(record.typeid);
                    var cap = Number(cfg && cfg[configField]) || 0;
                    if (!cap) continue;
                    if (!record.sto || typeof record.sto !== 'object')
                        record.sto = {1: Number(record.woodstorage) || 0, 2: Number(record.goldstorage) || 0};
                    var have = Number(record.sto[type]) || 0;
                    var gain = Math.min(left, Math.max(0, cap - have));
                    record.sto[type] = have + gain;
                    record[field] = record.sto[type];
                    left -= gain;
                }
                return Math.max(0, Number(amount) || 0) - left;
            }
            granted.gold = add(2, winGold, 'goldstorage', 'gold_storage');
            granted.wood = add(1, winWood, 'woodstorage', 'wood_storage');
            LocalNative.writeStatus({step: 'pve-loot-persisted', requestedGold: winGold,
                requestedWood: winWood, granted: granted});
            return granted;
        };

        LocalNative.applyPveItemReward = function(level, eventId, receiptKey) {
            var item = typeof data !== 'undefined' && data.item_input && data.item_input[eventId];
            if (!item || !(Number(item.item_id) > 0) || !(Number(item.item_num) > 0)) return [];
            var cfg = data.item && data.item[item.item_id];
            if (!cfg) throw new Error('Missing item configuration ' + item.item_id);
            var names = ['material', 'based_prop', 'advanced_prop', 'formula'];
            var name = names[Number(cfg.item_type) || 0];
            if (!name) throw new Error('Unsupported reward package ' + cfg.item_type);
            var pkg = level.player['package'] || (level.player['package'] = {});
            for (var n = 0; n < names.length; n++) {
                if (!pkg[names[n]]) pkg[names[n]] = {item_dict: {}, capacity: 100, new_items: 0, buy_slot_time: 0};
            }
            var oid = 'local_pve_' + item.item_id;
            var bag = pkg[name].item_dict;
            var old = bag[oid];
            bag[oid] = {oid: oid, typeid: Number(item.item_id),
                num: (old ? Number(old.num) || 0 : 0) + Number(item.item_num), is_new: true};
            return [[19, [{oid: oid, typeid: Number(item.item_id), num: Number(item.item_num)}]]];
        };

        LocalNative.applyPveBattleItemRewards = function(level, eventId, stageId) {
            var stage = data.pve_stage && data.pve_stage[stageId];
            if (!stage) return [];
            // Keep fixed first-win additions, then roll the shared repeat pool once.
            // Event ids and item_input ids belong to different tables.
            var shared = {}, seen = {}, cursor = stage.pve_roll_reward, gains = [];
            while (cursor && !shared[cursor]) {
                shared[cursor] = true;
                var sharedEvent = data.input_event_client && data.input_event_client[cursor];
                cursor = sharedEvent && sharedEvent.putin_event_next;
            }
            while (eventId && !shared[eventId] && !seen[eventId]) {
                seen[eventId] = true;
                var event = data.input_event_client && data.input_event_client[eventId];
                if (!event) break;
                var items = event.putin_event_item || [];
                for (var i = 0; i < items.length; i++) {
                    var item = data.item_input && data.item_input[items[i]];
                    if (!item || (item.item_random_chance || []).length) continue;
                    gains = gains.concat(LocalNative.applyPveItemReward(level, items[i], stageId));
                }
                eventId = event.putin_event_next;
            }
            return gains.concat(LocalNative.rollPveSweepItems(level, stageId).gains);
        };

        LocalNative.applyPveHeroRewards = function(level, eventId, stageId) {
            var event = data.input_event_client && data.input_event_client[eventId];
            var events = event && event.putin_event_hero || [];
            var out = [];
            for (var i = 0; i < events.length; i++) {
                var cfg = data.hero_input_client && data.hero_input_client[events[i]];
                if (!cfg) continue;
                var pool = cfg.putin_team1 || [];
                // Only an unambiguous fixed hero is a proven server substitute.
                if (pool.length !== 1 || (cfg.putin_team2 || []).length ||
                    (cfg.putin_team3 || []).length || (cfg.putin_team4 || []).length) {
                    LocalNative.writeStatus({step: 'pve-hero-reward-unresolved', event: events[i]});
                    continue;
                }
                var sid = Number(stageId) === 2 && Number(pool[0]) === 10501
                    ? 'pve_first_2_hero' : 'pve_reward_' + stageId + '_' + events[i];
                var existing = null;
                for (var h = 0; h < level.heros.length; h++) {
                    if (level.heros[h].sid === sid) existing = level.heros[h];
                }
                if (existing) { out.push([29, existing]); continue; }
                var hero = LocalNative.defaultStarterHero();
                hero.sid = hero.id = sid;
                hero.typeid = hero.hero_id = Number(pool[0]);
                hero.unit_type = Math.floor(hero.typeid / 100);
                hero.unit_level = hero.typeid % 100;
                hero.lv = hero.level = cfg.lv || 1;
                hero.state = 0; hero.aidx = -1; hero.xp = 0;
                delete hero.life; delete hero.health;
                hero.skill_id = cfg.putin_skill;
                hero.skill_slots = cfg.putin_skill
                    ? [{sid: Math.floor(cfg.putin_skill / 100), lv: (cfg.putin_skill % 100) || 1, exp: 0}]
                    : [];
                LocalNative.ensureHeroSkill(hero, cfg.putin_skill);
                level.heros.push(hero);
                level.player.hero_slot_num = Math.max(Number(level.player.hero_slot_num) || 0, level.heros.length);
                out.push([29,hero]);
            }
            return out;
        };

        // rpc_s_complete_pve_battle → rpc_c_battle_result (MatchEnd).
        LocalNative.handleCompletePveBattle = function(player, params) {
            player = player || (typeof G_Player !== 'undefined' ? G_Player : null);
            var session = LocalNative.pveSession;
            if (session && session.completed) return false;
            if (session && session.localNativeWanted)
                return LocalNative.completeWantedBattle(player, params);
            var gc = LocalNative.getBattleController();
            var stageId = LocalNative.readLivePveStageId();
            var isAdventure = !!(session && session.localNativeAdventure);
            LocalNative.writeStatus({
                step: 'complete-pve-battle',
                stage: stageId,
                adventure: isAdventure,
                paramKeys: params ? Object.keys(params) : null
            });
            try {
                var result = LocalNative.buildPveBattleResultDict(gc, stageId);
                if (session) {
                    session.starNum = result.starNum;
                    session.winGold = result.win_gold;
                    session.winWood = result.win_wood;
                    session.stage = stageId;
                }
                var store = LocalNative.readRaw();
                var level = store && store.level ? store.level : LocalNative.defaultLevelDict();
                level.player = level.player || LocalNative.defaultPlayer();
                if (!isAdventure) {
                    LocalNative.applyPveStageProgress(
                        level.player, stageId, result.starNum, result.win_gold, result.win_wood);
                    LocalNative.ensureStarterHeros(level);
                    if (player)
                        LocalNative.applyPveStageProgress(
                            player, stageId, result.starNum, result.win_gold, result.win_wood);
                }
                LocalNative.grantPveLoot(result.win_gold, result.win_wood, level);
                if (!isAdventure) {
                    var claims = level.localPveFirstRewards || (level.localPveFirstRewards = {});
                    var stageConfig = typeof data !== 'undefined' && data.pve_stage && data.pve_stage[stageId];
                    if (result.starNum > 0 && stageConfig) {
                        var first = !claims[stageId];
                        var eventId = first ? stageConfig.pve_first_reward : stageConfig.pve_roll_reward;
                        result.input_gains = LocalNative.applyPveBattleItemRewards(level, eventId, stageId);
                        if (first) result.input_gains = result.input_gains.concat(
                            LocalNative.applyPveHeroRewards(level, eventId, stageId));
                        if (first) claims[stageId] = true;
                        var event = data.input_event_client && data.input_event_client[eventId];
                        var resources = event && event.putin_event_resource || [];
                        for (var ri = 0; ri < resources.length; ri++) {
                            var res = data.resource_input && data.resource_input[resources[ri]];
                            if (!res) continue;
                            var amount = Number(res.putin_num) || 0;
                            if (res.putin_resource_type === 1 || res.putin_resource_type === 2)
                                LocalNative.grantPveLoot(res.putin_resource_type === 2 ? amount : 0,
                                    res.putin_resource_type === 1 ? amount : 0, level);
                            else if (res.putin_resource_type === 3) level.player.diamond += amount;
                            else if (res.putin_resource_type === 4) level.player.spirit += amount;
                        }
                        var exp = Number(stageConfig.sweep_hero_exp) || 0;
                        for (var hi = 0; hi < (level.heros || []).length; hi++) {
                            var hero = level.heros[hi];
                            if (hero.state !== 1) continue;
                            LocalNative.normalizeHeroExperience(level, hero, exp);
                            result.exp_add[hero.sid] = exp;
                        }
                    }
                } else if (result.starNum > 0) {
                    // Home afterInitWorld → AdventureManager.checkAdventureStatus → capture.
                    LocalNative.markAdventureCaptureAfterPveWin(player, level);
                } else {
                    LocalNative.clearAdventureProgress(player, level);
                }
                if (store) {
                    store.level = level;
                    LocalNative.writeRaw(store);
                }
                if (session) session.completed = true;
                LocalNative.writeStatus({
                    step: 'complete-pve-battle-result',
                    stage: stageId,
                    adventure: isAdventure,
                    adventureStatus: level.player.adventure_status,
                    starNum: result.starNum,
                    winGold: result.win_gold,
                    winWood: result.win_wood,
                    percent: result.percent
                });
                if (player && typeof player.rpc_c_battle_result === 'function') {
                    player.rpc_c_battle_result(result);
                    LocalNative.writeStatus({step: 'rpc_c_battle_result-ok', stage: stageId});
                } else {
                    LocalNative.writeStatus({step: 'rpc_c_battle_result-missing', stage: stageId});
                }
            } catch (eDone) {
                LocalNative.writeStatus({
                    step: 'complete-pve-battle-ERR',
                    error: String(eDone),
                    stack: (eDone && eDone.stack) ? String(eDone.stack).split('\n').slice(0, 8) : null
                });
                return false;
            }
            return true;
        };

        // Stock main/Start use real elapsed time at 30 FPS. Battle temporarily
        // switches the global Director to fixed steps; restore at the home boundary
        // even if an early exit or a later battle callback bypasses normal cleanup.
        LocalNative.restoreHomeClock = function() {
            var report = {step: 'home-clock-restore', errors: []};
            var director = typeof G_Director !== 'undefined' ? G_Director : null;
            if (!director) return false;
            try { report.intervalBefore = director.getAnimationInterval(); } catch (eRead) {}
            try {
                var scheduler = director.getScheduler();
                if (typeof scheduler.getTimeScale === 'function')
                    report.scaleBefore = scheduler.getTimeScale();
                scheduler.setTimeScale(1);
                if (typeof scheduler.getTimeScale === 'function')
                    report.scaleAfter = scheduler.getTimeScale();
            } catch (eScale) { report.errors.push(String(eScale)); }
            try { director.setFixAnimationInterval(false); }
            catch (eFix) { report.errors.push(String(eFix)); }
            try { director.setAnimationInterval(1 / 30); }
            catch (eInterval) { report.errors.push(String(eInterval)); }
            try { cc.Application.getInstance().setAnimationInterval(1 / 30); }
            catch (eApp) { report.errors.push(String(eApp)); }
            try { report.intervalAfter = director.getAnimationInterval(); } catch (eAfter) {}
            LocalNative.writeStatus(report);
            return report.errors.length === 0;
        };

        LocalNative.handlePveBattleToHome = function(player, params) {
            player = player || (typeof G_Player !== 'undefined' ? G_Player : null);
            var session = LocalNative.pveSession;
            if (session && session.returning) return false;
            if (session) session.returning = true;
            var isAdventure = !!(session && session.localNativeAdventure);
            LocalNative.writeStatus({
                step: 'pve-battle-to-home',
                stage: session ? session.stage : LocalNative.readLivePveStageId(),
                completed: !!(session && session.completed),
                adventure: isAdventure,
                early: !!(params && params.early)
            });
            try {
                var store = LocalNative.readRaw();
                var level = store && store.level ? store.level : LocalNative.defaultLevelDict();
                if (level.player) LocalNative.ensureAvailableStages(level.player, 'pve-home');
                if (player) LocalNative.ensureAvailableStages(player, 'pve-home-live');
                if (isAdventure) {
                    // Early quit / unfinished fight drops the run; win already flipped CAPTURE.
                    if (!(session && session.completed && session.starNum > 0))
                        LocalNative.clearAdventureProgress(player, level);
                    else LocalNative.syncAdventureManager(player,
                        LocalNative.readAdventureState(level));
                }
                if (store) {
                    store.level = level;
                    LocalNative.writeRaw(store);
                }
                if (player && typeof player.rpc_c_battle_to_home === 'function') {
                    player.rpc_c_battle_to_home(level);
                    LocalNative.writeStatus({step: 'pve-rpc_c_battle_to_home-ok',
                        adventureStatus: level.player && level.player.adventure_status});
                } else if (player && typeof player.changeStageAndInit === 'function') {
                    var build = typeof GS_STAGE_BUILD !== 'undefined' ? GS_STAGE_BUILD : 1;
                    player.changeStageAndInit(build, level, true);
                    LocalNative.writeStatus({step: 'pve-home-via-changeStage'});
                }
            } catch (eHome) {
                LocalNative.writeStatus({
                    step: 'pve-battle-to-home-ERR',
                    error: String(eHome)
                });
            }
            LocalNative.scheduleOnRoot(function() {
                if (session) session.closed = true;
            }, 0.5);
            return true;
        };

        // User-authorized offline PVE sweep drops. Not recovered production rates.
        // Preserve skill-book odds; knowledge book rolls independently at 33%.
        LocalNative.pveSweepPolicy = {
            version: 2,
            ordinaryRateFallback: 1 / 3,
            knowledgeBookRate: 0.33,
            rareRate: 0.08,
            dropFromStage: 7
        };

        LocalNative.classifyPveSweepItem = function(typeid) {
            typeid = Number(typeid) || 0;
            if (typeid >= 200000 && typeid < 210000) return 'ordinary';
            if (typeid === 210000) return 'ordinary';
            if (typeid === 1125 || typeid === 1123) return 'skip';
            if (typeid > 0) return 'rare';
            return 'skip';
        };

        LocalNative.collectPveSweepLootPools = function(stageId) {
            var ordinary = [], rare = [], seen = {}, eventId = null;
            var stage = data.pve_stage && (data.pve_stage[stageId] || data.pve_stage[String(stageId)]);
            if (stage) eventId = stage.pve_roll_reward;
            while (eventId && !seen[eventId]) {
                seen[eventId] = true;
                var event = data.input_event_client && data.input_event_client[eventId];
                if (!event) break;
                var items = event.putin_event_item || [];
                for (var i = 0; i < items.length; i++) {
                    var cfg = data.item_input && data.item_input[items[i]];
                    if (!cfg || !(Number(cfg.item_id) > 0) || !(Number(cfg.item_num) > 0)) continue;
                    if ((cfg.item_random_chance || []).length) continue;
                    var kind = LocalNative.classifyPveSweepItem(cfg.item_id);
                    var entry = {typeid: Number(cfg.item_id), num: Number(cfg.item_num)};
                    if (kind === 'ordinary') ordinary.push(entry);
                    else if (kind === 'rare') rare.push(entry);
                }
                eventId = event.putin_event_next;
            }
            return {ordinary: ordinary, rare: rare};
        };

        LocalNative.snapshotPveSweepTili = function(player, level) {
            var sweep = player && player.getComponent && player.getComponent('PVESweepManager');
            var max = (data.pve_sweep && data.pve_sweep[1] && Number(data.pve_sweep[1].max_tili)) || 10;
            if (sweep) {
                level.player.pve_sweep_tili = Math.max(0, Math.min(max,
                    Number(sweep.Res && sweep.Res[typeof RES_TYPE_TILI !== 'undefined' ? RES_TYPE_TILI : 5]) ||
                    Number(sweep.Res && sweep.Res[5]) || 0));
                level.player.pve_sweep_ltt = Number(sweep.ltt) || Math.floor(Date.now() / 1000);
            } else if (level.player.pve_sweep_tili == null) {
                level.player.pve_sweep_tili = max;
                level.player.pve_sweep_ltt = Math.floor(Date.now() / 1000);
            }
        };

        LocalNative.syncPveSweepTili = function(player, level) {
            var sweep = player && player.getComponent && player.getComponent('PVESweepManager');
            if (!sweep) return;
            var tili = Number(level.player.pve_sweep_tili);
            var ltt = Number(level.player.pve_sweep_ltt) || Math.floor(Date.now() / 1000);
            if (!isFinite(tili)) return;
            if (sweep.Res) {
                var key = typeof RES_TYPE_TILI !== 'undefined' ? RES_TYPE_TILI : 5;
                sweep.Res[key] = tili;
                if (key !== 5) sweep.Res[5] = tili;
            }
            sweep.ltt = ltt;
        };

        LocalNative.consumePveSweepPeriod = function(level, periodId) {
            periodId = Number(periodId) || 0;
            if (!(periodId > 0) || !data.period_control) return true;
            var period = data.period_control[periodId];
            if (!period || !(Number(period.num_limit) > 0)) return true;
            var ptype = Number(period.period_type) || 1;
            var counters = level.player.event_counters || (level.player.event_counters = {});
            var group = counters[ptype] || (counters[ptype] = {});
            var counter = group[periodId] || {c: 0};
            var count = Math.max(Number(counter.c) || 0,
                Number(counter.clientData && counter.clientData._eventCount) || 0);
            // Stock UI may pay diamonds to reset when exhausted, then still call sweep.
            if (count >= Number(period.num_limit)) count = 0;
            if (count >= Number(period.num_limit)) return false;
            group[periodId] = {c: count + 1, t: Math.floor(Date.now() / 1000),
                clientData: {_eventCount: count + 1}};
            return true;
        };

        LocalNative.syncPveSweepPeriod = function(player, level, periodId) {
            var der = player && player.getComponent && player.getComponent('DailyEventRecorder');
            if (!der || !level.player.event_counters) return;
            der.event_counters = JSON.parse(JSON.stringify(level.player.event_counters));
            der.last_update_time = level.player.last_update_time || Math.floor(Date.now() / 1000);
            periodId = Number(periodId) || 0;
            if (!(periodId > 0) || !player.rpc_c_refresh_daily_event) return;
            var period = data.period_control && data.period_control[periodId];
            var ptype = period ? Number(period.period_type) || 1 : 1;
            var counter = level.player.event_counters[ptype] && level.player.event_counters[ptype][periodId];
            if (counter) player.rpc_c_refresh_daily_event({
                event_id: periodId,
                last_update_time: Math.floor(Date.now() / 1000),
                event_counter: JSON.parse(JSON.stringify(counter))
            });
        };

        LocalNative.rollPveSweepItems = function(level, stageId) {
            var policy = LocalNative.pveSweepPolicy;
            var stage = data.pve_stage && (data.pve_stage[stageId] || data.pve_stage[String(stageId)]);
            var gains = [], dropped = [];
            if (!stage || Number(stageId) < policy.dropFromStage) return {gains: gains, dropped: dropped};
            var pools = LocalNative.collectPveSweepLootPools(stageId);
            var ordinaryRate = stage.green_pro != null ? Number(stage.green_pro) : policy.ordinaryRateFallback;
            if (!(ordinaryRate >= 0)) ordinaryRate = policy.ordinaryRateFallback;
            if (pools.ordinary.length && Math.random() < ordinaryRate) {
                var ord = pools.ordinary[Math.floor(Math.random() * pools.ordinary.length)];
                // Leave the original pool denominator intact for every skill book.
                if (ord.typeid !== 210000) {
                    var ordDelta = LocalNative.shopAddItem(level, ord.typeid, ord.num);
                    gains.push([19, ordDelta]);
                    dropped.push({kind: 'ordinary', typeid: ord.typeid, num: ord.num});
                }
            }
            if (pools.rare.length && Math.random() < policy.rareRate) {
                var rare = pools.rare[Math.floor(Math.random() * pools.rare.length)];
                var rareDelta = LocalNative.shopAddItem(level, rare.typeid, rare.num);
                gains.push([19, rareDelta]);
                dropped.push({kind: 'rare', typeid: rare.typeid, num: rare.num});
            }
            var books = [];
            for (var bi = 0; bi < pools.ordinary.length; bi++)
                if (pools.ordinary[bi].typeid === 210000) books.push(pools.ordinary[bi]);
            if (books.length && Math.random() < policy.knowledgeBookRate) {
                var book = books[Math.floor(Math.random() * books.length)];
                gains.push([19, LocalNative.shopAddItem(level, book.typeid, book.num)]);
                dropped.push({kind: 'knowledge-book', typeid: book.typeid, num: book.num});
            }
            return {gains: gains, dropped: dropped};
        };

        LocalNative.handlePveSweep = function(player, params) {
            player = player || (typeof G_Player !== 'undefined' ? G_Player : null);
            var stageId = parseInt(params && (params.level != null ? params.level : params.stage), 10);
            LocalNative.writeStatus({step: 'pve-sweep', stage: stageId});
            try {
                if (!(stageId > 0)) throw new Error('Invalid sweep stage');
                var stage = data.pve_stage && (data.pve_stage[stageId] || data.pve_stage[String(stageId)]);
                if (!stage) throw new Error('Missing sweep stage config');
                var store = JSON.parse(JSON.stringify(LocalNative.readRaw()));
                var level = store.level;
                LocalNative.ensurePlayerSocialFields(level.player);
                LocalNative.ensureAvailableStages(level.player, 'pve-sweep');
                var progress = level.player.availableStages[stageId] ||
                    level.player.availableStages[String(stageId)];
                if (!progress || !(Number(progress[2]) > 0))
                    throw new Error('Stage is not cleared for sweep');
                var pm = player && player.getComponent && player.getComponent('PackageManager');
                if (pm && pm['package'])
                    level.player['package'] = JSON.parse(JSON.stringify(pm['package']));
                var der = player && player.getComponent && player.getComponent('DailyEventRecorder');
                if (der && der.event_counters) {
                    if (der.checkAndResetAllEventCounters)
                        der.checkAndResetAllEventCounters(Math.floor(Date.now() / 1000));
                    level.player.event_counters = JSON.parse(JSON.stringify(der.event_counters));
                    level.player.last_update_time = der.last_update_time || Math.floor(Date.now() / 1000);
                }
                var rm = player && player.getComponent && player.getComponent('ResourceManager');
                if (rm && rm.Res) {
                    if (isFinite(rm.Res[3])) level.player.diamond = Number(rm.Res[3]);
                    if (isFinite(rm.Res[4])) level.player.spirit = Number(rm.Res[4]) || 0;
                }
                LocalNative.snapshotPveSweepTili(player, level);
                if (typeof LocalNative.shopState === 'function') LocalNative.shopState(level);
                var periodId = stage.period_num_limit;
                if (!LocalNative.consumePveSweepPeriod(level, periodId))
                    throw new Error('Sweep daily limit reached');
                var inputGains = [];
                var exp = Number(stage.sweep_hero_exp) || 0;
                var expPairs = [];
                for (var hi = 0; hi < (level.heros || []).length; hi++) {
                    var hero = level.heros[hi];
                    if (Number(hero.state) !== 1) continue;
                    LocalNative.normalizeHeroExperience(level, hero, exp);
                    expPairs.push([hero.sid, exp]);
                }
                if (expPairs.length) inputGains.push([5, expPairs]);
                var rolled = LocalNative.rollPveSweepItems(level, stageId);
                inputGains = inputGains.concat(rolled.gains);
                LocalNative.writeRaw(store);
                if (pm) pm.init({'package': JSON.parse(JSON.stringify(level.player['package'] || {}))});
                LocalNative.syncPveSweepTili(player, level);
                LocalNative.syncPveSweepPeriod(player, level, periodId);
                var em = typeof G_EventManager !== 'undefined' ? G_EventManager : null;
                var origAward = em && em.inputAward ? em.inputAward.bind(em) : null;
                var origAdd = rm && rm.addRes ? rm.addRes.bind(rm) : null;
                if (em && origAward) em.inputAward = function() {};
                if (rm && origAdd) rm.addRes = function() { return true; };
                try {
                    if (player && typeof player.rpc_c_pvesweep_result === 'function')
                        player.rpc_c_pvesweep_result({
                            stage: stageId,
                            score: 0,
                            input_gains: inputGains
                        });
                } finally {
                    if (em && origAward) em.inputAward = origAward;
                    if (rm && origAdd) rm.addRes = origAdd;
                }
                // Stock sweep UI applies hero exp via ExpBar; re-snapshot after display.
                try {
                    var after = LocalNative.readRaw();
                    if (after && after.level) {
                        after.level.heros = JSON.parse(JSON.stringify(level.heros || []));
                        if (typeof G_UnitManager !== 'undefined' && G_UnitManager) {
                            for (var h = 0; h < after.level.heros.length; h++) {
                                var saved = after.level.heros[h];
                                var live = G_UnitManager.getUnitBySID ?
                                    G_UnitManager.getUnitBySID(saved.sid) : null;
                                if (!live) continue;
                                var bar = live.getComponent && live.getComponent('ExpBar');
                                if (bar && bar.growthLv != null) {
                                    saved.lv = saved.level = Number(bar.growthLv) || saved.lv;
                                    if (bar.growthXp != null) saved.xp = Number(bar.growthXp) || 0;
                                }
                            }
                        }
                        after.level.player.pve_sweep_tili = level.player.pve_sweep_tili;
                        after.level.player.pve_sweep_ltt = level.player.pve_sweep_ltt;
                        after.level.player.event_counters = level.player.event_counters;
                        after.level.player['package'] = level.player['package'];
                        LocalNative.writeRaw(after);
                    }
                } catch (eSnap) {}
                LocalNative.writeStatus({
                    step: 'pve-sweep-ok',
                    stage: stageId,
                    exp: exp,
                    dropped: rolled.dropped,
                    ordinaryRate: stage.green_pro != null ? Number(stage.green_pro) :
                        LocalNative.pveSweepPolicy.ordinaryRateFallback,
                    knowledgeBookRate: LocalNative.pveSweepPolicy.knowledgeBookRate,
                    rareRate: LocalNative.pveSweepPolicy.rareRate
                });
                return true;
            } catch (eSweep) {
                LocalNative.writeStatus({step: 'pve-sweep-ERR', stage: stageId, error: String(eSweep)});
                try {
                    if (player && typeof player.rpc_c_pvesweep_fail === 'function')
                        player.rpc_c_pvesweep_fail({});
                } catch (eFail) {}
                if (typeof G_MainController !== 'undefined' && G_MainController.setNotice)
                    G_MainController.setNotice(String(eSweep));
                return false;
            }
        };

        LocalNative.handleRefreshSweepInfo = function(player) {
            player = player || (typeof G_Player !== 'undefined' ? G_Player : null);
            try {
                var store = LocalNative.readRaw();
                var level = store.level;
                LocalNative.ensurePlayerSocialFields(level.player);
                LocalNative.snapshotPveSweepTili(player, level);
                LocalNative.writeRaw(store);
                if (player && typeof player.rpc_c_refresh_sweepinfo === 'function') {
                    player.rpc_c_refresh_sweepinfo({
                        pve_sweep_tili: level.player.pve_sweep_tili,
                        pve_sweep_ltt: level.player.pve_sweep_ltt
                    });
                }
                LocalNative.writeStatus({
                    step: 'pve-sweep-refresh-ok',
                    tili: level.player.pve_sweep_tili
                });
                return true;
            } catch (eRef) {
                LocalNative.writeStatus({step: 'pve-sweep-refresh-ERR', error: String(eRef)});
                return false;
            }
        };

        // --- Little Green Dragon Invasion (小绿龙入侵) ---
        // Stock Start button: onPressStart → ism.ready → rpc_s_invasion_wave_ready
        // → rpc_c_start_wave({heroes,time,corner_type}). Without the reply, Start is inert.
        LocalNative.getInvasionController = function() {
            try {
                if (typeof DA !== 'undefined' && DA && typeof DA.GETCGC === 'function') {
                    var gc = DA.GETCGC();
                    if (gc && gc.ism) return gc;
                }
            } catch (e1) {}
            try {
                if (typeof GS_STAGE_INVASION !== 'undefined' && typeof g_GameControllerList !== 'undefined' &&
                    g_GameControllerList)
                    return g_GameControllerList[GS_STAGE_INVASION] || null;
            } catch (e2) {}
            return null;
        };

        LocalNative.unitsArrayToIdMap = function(units, baseSid) {
            var list = LocalNative.remapBattleUnitIds(
                LocalNative.normalizeReplayUnits(units || []), baseSid || 93000);
            var map = {};
            for (var i = 0; i < list.length; i++) {
                var u = list[i];
                if (!u) continue;
                map[u.sid] = u;
            }
            return map;
        };

        // Stock GameControllerInvasion.initLevelFromData only creates level_data.self.units.
        // Garrison heros must sit in that map with did → remapped bunker SID (not only self.heros).
        LocalNative.heroDefenseAnchor = function(hero) {
            if (!hero) return null;
            if (hero.did != null && hero.did !== '' && hero.did !== 0) return hero.did;
            if (hero.defense_id != null && hero.defense_id !== '' && hero.defense_id !== 0)
                return hero.defense_id;
            return null;
        };

        LocalNative.buildRemappedUnitsMap = function(units, baseSid) {
            baseSid = baseSid || 93000;
            var normalized = LocalNative.normalizeReplayUnits(units || []);
            var remapped = LocalNative.remapBattleUnitIds(normalized, baseSid);
            var map = {};
            var sidMap = {};
            for (var i = 0; i < remapped.length; i++) {
                var u = remapped[i];
                if (!u) continue;
                map[u.sid] = u;
                var oldSid = normalized[i] && normalized[i].sid;
                if (oldSid != null) sidMap[String(oldSid)] = u.sid;
            }
            return {
                map: map,
                sidMap: sidMap,
                nextSid: baseSid + remapped.length + 1
            };
        };

        LocalNative.injectDefenseHerosIntoUnitsMap = function(unitsMap, sidMap, nextSid, heros) {
            var defenseState = typeof HERO_STATE_DEFENSE !== 'undefined' ? HERO_STATE_DEFENSE : 2;
            var defender = typeof BATTLE_FACTION_DEFENDER !== 'undefined' ? BATTLE_FACTION_DEFENDER : 2;
            var outHeros = [];
            var sid = nextSid;
            for (var i = 0; i < (heros || []).length; i++) {
                var src = heros[i];
                var anchor = LocalNative.heroDefenseAnchor(src);
                if (anchor == null) continue;
                var newDid = sidMap[String(anchor)];
                if (newDid == null) continue;
                var hero = {};
                for (var k in src) {
                    if (Object.prototype.hasOwnProperty.call(src, k)) hero[k] = src[k];
                }
                if (hero.typeid != null) {
                    hero.unit_type = Math.floor(Number(hero.typeid) / 100);
                    hero.unit_level = Number(hero.typeid) % 100;
                }
                if (!(hero.unit_level > 0)) continue;
                hero.sid = hero.cid = hero.id = sid++;
                hero.did = String(newDid);
                hero.defense_id = String(newDid);
                hero.state = defenseState;
                hero.faction = defender;
                // Stock createUnit treats x/y as TileHolder placement; mobile heros have none.
                delete hero.x;
                delete hero.y;
                if (typeof LocalNative.prepareHeroBattleSkills === 'function') {
                    try { LocalNative.prepareHeroBattleSkills(hero); } catch (eSkill) {}
                }
                unitsMap[hero.sid] = hero;
                outHeros.push(hero);
            }
            return outHeros;
        };

        LocalNative.buildInvasionEnterDict = function() {
            LocalNative.tryDumpAndSave();
            var store = LocalNative.readRaw();
            var level = store && store.level ? store.level : LocalNative.defaultLevelDict();
            var selfPlayer = level.player || LocalNative.defaultPlayer();
            var remapped = LocalNative.buildRemappedUnitsMap(level.units || [], 93000);
            var unitsMap = remapped.map;
            var walls = level.walls || [];
            var modelInfo = level.model_info || {};
            var userConfig = level.user_config || {};
            var rawHeros = (level.heros && level.heros.length) ? level.heros :
                ((selfPlayer.heros && selfPlayer.heros.length) ? selfPlayer.heros : []);
            var defenseHeros = LocalNative.injectDefenseHerosIntoUnitsMap(
                unitsMap, remapped.sidMap, remapped.nextSid, rawHeros);
            var oppoPlayer = {
                nickname: 'Invasion',
                level: 1,
                account: 'local-invasion',
                account_id: 'local-invasion',
                accountID: 'local-invasion',
                diamond: 0,
                spirit: 0,
                exp: 0,
                experience: 0,
                soldiers: [],
                heros: [],
                buffs: []
            };
            var selfSide = LocalNative.makeBattleSide(selfPlayer, {
                units: unitsMap,
                walls: walls,
                model_info: modelInfo,
                user_config: userConfig,
                heros: defenseHeros
            });
            var oppoSide = LocalNative.makeBattleSide(oppoPlayer, {
                units: {},
                walls: [],
                heros: [],
                soldiers: []
            });
            return {
                self: selfSide,
                oppo: oppoSide,
                units: unitsMap,
                walls: walls,
                model_info: modelInfo,
                user_config: userConfig,
                localNativeInvasion: true
            };
        };

        LocalNative.readInvasionAbsoluteWave = function(relativeWave) {
            relativeWave = Math.max(1, Number(relativeWave) || 1);
            try {
                var ic = typeof G_Player !== 'undefined' && G_Player &&
                    G_Player.getComponent && G_Player.getComponent('InvasionController');
                if (ic && typeof ic.getRealWave === 'function')
                    return ic.getRealWave(relativeWave);
            } catch (e) {}
            var unlocks = 0;
            try {
                var store = LocalNative.readRaw();
                unlocks = Number(store && store.level && store.level.player &&
                    store.level.player.invasion_unlocks) || 0;
            } catch (e2) {}
            var hardness = typeof data !== 'undefined' && data.invasion_hardness &&
                (data.invasion_hardness[unlocks + 1] || data.invasion_hardness[unlocks] ||
                    data.invasion_hardness[1]);
            var begin = hardness && hardness.invasion_hardness_start != null
                ? Number(hardness.invasion_hardness_start) : 1;
            return begin + relativeWave - 1;
        };

        LocalNative.pickInvasionWaveHeroes = function(waveCfg) {
            var pool = (waveCfg && waveCfg.AI_hero_id) || [];
            var levels = (waveCfg && waveCfg.AI_hero_lv) || [1];
            var need = Math.max(1, Number(waveCfg && waveCfg.AI_hero_num) || pool.length || 1);
            var heroes = [];
            if (!pool.length) return heroes;
            var used = {};
            var i;
            for (i = 0; i < need; i++) {
                var pick = null;
                var attempt = 0;
                while (attempt < pool.length * 2) {
                    var cand = pool[Math.floor(Math.random() * pool.length)];
                    attempt++;
                    if (used[cand] && Object.keys(used).length < pool.length) continue;
                    pick = cand;
                    used[cand] = 1;
                    break;
                }
                if (pick == null) pick = pool[i % pool.length];
                var lvMin = Number(levels[0]) || 1;
                var lvMax = Number(levels[levels.length - 1]) || lvMin;
                if (lvMax < lvMin) {
                    var tmp = lvMin;
                    lvMin = lvMax;
                    lvMax = tmp;
                }
                var level = lvMin + Math.floor(Math.random() * (lvMax - lvMin + 1));
                heroes.push({typeid: Number(pick), level: level, leadership: [0, 0]});
            }
            return heroes;
        };

        LocalNative.buildInvasionWaveStartDict = function(absoluteWave) {
            var cfg = typeof data !== 'undefined' && data.invasion && data.invasion[absoluteWave];
            if (!cfg) cfg = (data && data.invasion && data.invasion[1]) || {};
            var heroes = LocalNative.pickInvasionWaveHeroes(cfg);
            return {
                heroes: heroes,
                time: Number(cfg.invasion_duration) || 60,
                corner_type: Math.floor(Math.random() * 4)
            };
        };

        LocalNative.applyInvasionEventRewards = function(level, eventId, receiptKey) {
            var may = [];
            var gains = [];
            var guard = 0;
            var next = eventId;
            while (next && guard++ < 12) {
                var event = data.input_event_client && data.input_event_client[next];
                if (!event) break;
                var items = event.putin_event_item || [];
                for (var i = 0; i < items.length; i++) {
                    var gained = LocalNative.applyPveItemReward(level, items[i], receiptKey + '_' + items[i]);
                    may = may.concat(gained);
                    gains = gains.concat(gained);
                }
                var resources = event.putin_event_resource || [];
                for (var ri = 0; ri < resources.length; ri++) {
                    var res = data.resource_input && data.resource_input[resources[ri]];
                    if (!res) continue;
                    var amount = Number(res.putin_num) || 0;
                    var rtype = Number(res.putin_resource_type);
                    if (rtype === 1) {
                        LocalNative.grantPveLoot(0, amount, level);
                        may.push([2, amount]);
                        gains.push([2, amount]);
                    } else if (rtype === 2) {
                        LocalNative.grantPveLoot(amount, 0, level);
                        may.push([3, amount]);
                        gains.push([3, amount]);
                    } else if (rtype === 3) {
                        level.player.diamond = (Number(level.player.diamond) || 0) + amount;
                        may.push([4, amount]);
                        gains.push([4, amount]);
                    } else if (rtype === 4) {
                        level.player.spirit = (Number(level.player.spirit) || 0) + amount;
                        may.push([11, amount]);
                        gains.push([11, amount]);
                    }
                }
                next = event.putin_event_next || 0;
            }
            return {may_input: may, input_gains: gains};
        };

        // Unlock popup 206500 uses rookie_click:1 → only finishRookieProcess in memory.
        // Finished process bits are not saved; only finishRookie(2065) → setUserConfig persists.
        // Entering invasion (or returning home) means the unlock is done — persist pid 2065
        // so Build GC does not re-open NewUnlocked("unlock_invasion") after settle→home.
        LocalNative.INVASION_UNLOCK_ROOKIE_PID = 2065;

        LocalNative.finishInvasionUnlockGuide = function(reason) {
            var pid = LocalNative.INVASION_UNLOCK_ROOKIE_PID;
            var persisted = false;
            try {
                var starts = (typeof ROOKIE_START_PID !== 'undefined' && ROOKIE_START_PID)
                    ? ROOKIE_START_PID
                    : {rookie0: 2000, rookie1: 2031, rookie2: 2062, rookie3: 2093, rookie4: 2124};
                var bitKey = null;
                var bitOffset = -1;
                for (var key in starts) {
                    if (!Object.prototype.hasOwnProperty.call(starts, key)) continue;
                    var off = pid - starts[key];
                    if (off >= 0 && off <= 30) {
                        bitKey = key;
                        bitOffset = off;
                        break;
                    }
                }
                if (bitKey != null) {
                    var store = LocalNative.readRaw();
                    if (store && store.level) {
                        if (!store.level.user_config) store.level.user_config = {};
                        var cfg = store.level.user_config;
                        var cur = Number(cfg[bitKey]) || 0;
                        var next = cur | (1 << bitOffset);
                        if (next !== cur || !cfg[bitKey]) {
                            if (typeof LocalNative.mergeUserConfig === 'function') {
                                LocalNative.mergeUserConfig({key: bitKey, value: next});
                            } else {
                                cfg[bitKey] = next;
                                if (!cfg.rookieBits || typeof cfg.rookieBits !== 'object')
                                    cfg.rookieBits = {};
                                cfg.rookieBits[bitKey] = next;
                                store.revision = (store.revision || 0) + 1;
                                store.updatedAt = Math.floor(Date.now() / 1000);
                                LocalNative.writeRaw(store);
                            }
                            persisted = true;
                        } else {
                            persisted = true;
                        }
                    }
                }
            } catch (eBit) {
                LocalNative.writeStatus({
                    step: 'invasion-unlock-rookie-bit-ERR',
                    error: String(eBit)
                });
            }
            try {
                var gc = LocalNative.getAnyGameController();
                if (gc && typeof gc.finishRookie === 'function') {
                    gc.finishRookie(pid);
                }
            } catch (eFin) {
                LocalNative.writeStatus({
                    step: 'invasion-unlock-rookie-finish-ERR',
                    error: String(eFin)
                });
            }
            try {
                if (typeof G_Player !== 'undefined' && G_Player && G_Player.localUserInfo &&
                    !G_Player.localUserInfo.invasionPrompt) {
                    G_Player.localUserInfo.invasionPrompt = true;
                    if (typeof G_Player.writeLocalUserInfo === 'function')
                        G_Player.writeLocalUserInfo();
                }
            } catch (ePrompt) {}
            LocalNative.writeStatus({
                step: 'invasion-unlock-rookie-done',
                reason: reason || null,
                pid: pid,
                persisted: persisted
            });
            return persisted;
        };

        LocalNative.handleEnterInvasion = function(player, params) {
            player = player || (typeof G_Player !== 'undefined' ? G_Player : null);
            if (LocalNative.invasionSession && !LocalNative.invasionSession.closed) {
                LocalNative.writeStatus({step: 'invasion-enter-duplicate'});
                return false;
            }
            LocalNative.invasionSession = {
                closed: false,
                returning: false,
                firstWaveClaims: {},
                wave: 0
            };
            LocalNative.writeStatus({step: 'enter-invasion'});
            try {
                LocalNative.finishInvasionUnlockGuide('enter');
                LocalNative.tryDumpAndSave();
                var dict = LocalNative.buildInvasionEnterDict();
                if (player && typeof player.rpc_c_enter_invasion === 'function') {
                    player.rpc_c_enter_invasion(dict);
                    LocalNative.writeStatus({
                        step: 'rpc_c_enter_invasion-ok',
                        units: dict.self && dict.self.units ?
                            Object.keys(dict.self.units).length : 0
                    });
                    return true;
                }
                LocalNative.writeStatus({step: 'enter-invasion-no-handler'});
                LocalNative.invasionSession.closed = true;
                return false;
            } catch (eEnter) {
                if (LocalNative.invasionSession) LocalNative.invasionSession.closed = true;
                LocalNative.writeStatus({step: 'enter-invasion-ERR', error: String(eEnter)});
                return false;
            }
        };

        LocalNative.handleInvasionWaveReady = function(player, params) {
            player = player || (typeof G_Player !== 'undefined' ? G_Player : null);
            var session = LocalNative.invasionSession;
            if (!session || session.closed) {
                session = LocalNative.invasionSession = {
                    closed: false, returning: false, firstWaveClaims: {}, wave: 0
                };
            }
            var gc = LocalNative.getInvasionController();
            var relativeNext = 1;
            try {
                if (gc && gc.ism && gc.ism.passedWaves != null)
                    relativeNext = (Number(gc.ism.passedWaves) || 0) + 1;
                else relativeNext = (Number(session.wave) || 0) + 1;
            } catch (eRel) {}
            var absoluteWave = LocalNative.readInvasionAbsoluteWave(relativeNext);
            session.wave = relativeNext;
            session.absoluteWave = absoluteWave;
            var dict = LocalNative.buildInvasionWaveStartDict(absoluteWave);
            LocalNative.writeStatus({
                step: 'invasion-wave-ready',
                relative: relativeNext,
                absolute: absoluteWave,
                heroes: dict.heroes.length,
                time: dict.time,
                corner: dict.corner_type
            });
            try {
                if (player && typeof player.rpc_c_start_wave === 'function') {
                    player.rpc_c_start_wave(dict);
                    return true;
                }
                // Fallback: talk to the live state machine if the RPC helper is missing.
                if (gc && gc.ism && typeof gc.ism.onReceiveAttackerData === 'function') {
                    gc.ism.onReceiveAttackerData(dict);
                    return true;
                }
                LocalNative.writeStatus({step: 'invasion-wave-ready-no-handler'});
                return false;
            } catch (eReady) {
                LocalNative.writeStatus({step: 'invasion-wave-ready-ERR', error: String(eReady)});
                return false;
            }
        };

        LocalNative.handleInvasionWaveStart = function(player, params) {
            LocalNative.writeStatus({step: 'invasion-wave-start-ack'});
            return true;
        };

        LocalNative.handleInvasionWaveEnd = function(player, params) {
            player = player || (typeof G_Player !== 'undefined' ? G_Player : null);
            params = params || {};
            var session = LocalNative.invasionSession ||
                (LocalNative.invasionSession = {closed: false, firstWaveClaims: {}, wave: 0});
            var succeed = !!params.succeed;
            var gc = LocalNative.getInvasionController();
            var relativeDone = session.wave || 1;
            try {
                if (gc && gc.ism && gc.ism.passedWaves != null) {
                    // Stock bytecode increments passedWaves after callServer; prefer live value.
                    var live = Number(gc.ism.passedWaves) || 0;
                    if (live > 0) relativeDone = live;
                    else if (succeed) {
                        gc.ism.passedWaves = relativeDone;
                    }
                }
            } catch (ePass) {}
            var absoluteWave = session.absoluteWave ||
                LocalNative.readInvasionAbsoluteWave(relativeDone);
            LocalNative.writeStatus({
                step: 'invasion-wave-end',
                succeed: succeed,
                relative: relativeDone,
                absolute: absoluteWave
            });
            try {
                if (!succeed) {
                    if (player && typeof player.rpc_c_invasion_end === 'function')
                        player.rpc_c_invasion_end({});
                    else if (gc && gc.ism && typeof gc.ism.endInvasion === 'function')
                        gc.ism.endInvasion({});
                    return true;
                }
                var store = LocalNative.readRaw();
                var level = store && store.level ? store.level : LocalNative.defaultLevelDict();
                level.player = level.player || LocalNative.defaultPlayer();
                var claims = level.localInvasionFirstWaves ||
                    (level.localInvasionFirstWaves = {});
                var cfg = data.invasion && data.invasion[absoluteWave];
                var first = !claims[absoluteWave];
                var eventId = cfg && (first ? cfg.input_id_first : cfg.input_id);
                var awards = eventId
                    ? LocalNative.applyInvasionEventRewards(level, eventId,
                        'invasion_' + absoluteWave)
                    : {may_input: [], input_gains: []};
                if (first && eventId) claims[absoluteWave] = true;
                if (store) {
                    store.level = level;
                    LocalNative.writeRaw(store);
                }
                if (player && typeof player.rpc_c_wave_end === 'function') {
                    player.rpc_c_wave_end({
                        may_input: awards.may_input,
                        input_gains: awards.input_gains
                    });
                } else if (gc && gc.ism && typeof gc.ism.serverSettle === 'function') {
                    gc.ism.serverSettle({
                        may_input: awards.may_input,
                        input_gains: awards.input_gains
                    });
                }
                LocalNative.writeStatus({
                    step: 'invasion-wave-end-ok',
                    absolute: absoluteWave,
                    first: first,
                    awards: awards.input_gains.length
                });
                return true;
            } catch (eEnd) {
                LocalNative.writeStatus({step: 'invasion-wave-end-ERR', error: String(eEnd)});
                return false;
            }
        };

        LocalNative.handleInvasionToHome = function(player, params) {
            player = player || (typeof G_Player !== 'undefined' ? G_Player : null);
            var session = LocalNative.invasionSession;
            if (session) {
                if (session.returning || session.closed) return false;
                session.returning = true;
            }
            LocalNative.writeStatus({step: 'invasion-to-home'});
            try {
                LocalNative.finishInvasionUnlockGuide('to_home');
                LocalNative.tryDumpAndSave();
                var store = LocalNative.readRaw();
                var level = store && store.level ? store.level : LocalNative.defaultLevelDict();
                if (player && typeof player.rpc_c_invasion_to_home === 'function')
                    player.rpc_c_invasion_to_home(level);
                else if (player && typeof player.rpc_c_battle_to_home === 'function')
                    player.rpc_c_battle_to_home(level);
                else if (player && typeof player.changeStageAndInit === 'function') {
                    var build = typeof GS_STAGE_BUILD !== 'undefined' ? GS_STAGE_BUILD : 1;
                    player.changeStageAndInit(build, level, true);
                }
                if (session) session.closed = true;
                LocalNative.writeStatus({step: 'invasion-to-home-ok'});
                return true;
            } catch (eHome) {
                if (session) session.closed = true;
                LocalNative.writeStatus({step: 'invasion-to-home-ERR', error: String(eHome)});
                return false;
            }
        };

        LocalNative.handleEnterEnemyAttackReplay = function(player, params) {
            var stageId = params && params.stage != null ? params.stage : 20001;
            if (LocalNative.replaySession && !LocalNative.replaySession.closed) {
                LocalNative.writeStatus({step: 'replay-enter-duplicate', stage: stageId});
                return false;
            }
            var session = {
                stage: stageId,
                returning: false,
                closed: false,
                emptyRecords: true
            };
            LocalNative.replaySession = session;
            LocalNative.writeStatus({step: 'enter-enemy-attack-replay', stage: stageId});
            var entered = false;
            try {
                var dict = LocalNative.buildEnemyAttackReplayDict(stageId);
                session.emptyRecords = !(dict.records && dict.records.length);
                try {
                    if (player) player.tempReplayBattleLog = dict.tempReplayBattleLog ||
                        LocalNative.enemyAttackBattleLog;
                } catch (eSeed) {}
                if (player && typeof player.rpc_c_enter_enemy_attack_replay === 'function') {
                    player.rpc_c_enter_enemy_attack_replay(dict);
                    entered = true;
                    LocalNative.writeStatus({
                        step: 'rpc_c_enter_enemy_attack_replay-called',
                        stage: stageId,
                        units: dict.units ? dict.units.length : 0,
                        hasOppoPlayer: !!(dict.oppo && dict.oppo.player),
                        hasBattleLog: !!(dict.battleLogItem || dict.tempReplayBattleLog),
                        hasPveCfg: !!(dict.pveConfig && typeof dict.pveConfig === 'object' &&
                            Object.keys(dict.pveConfig).length),
                        records: dict.records ? dict.records.length : 0
                    });
                }
            } catch (eEnter) {
                LocalNative.writeStatus({
                    step: 'rpc_c_enter_enemy_attack_replay-ERR',
                    error: String(eEnter)
                });
            }
            if (!entered) {
                session.closed = true;
                return false;
            }
            // If battle never takes over / loading stuck, abort back to home + finish guide step.
            LocalNative.scheduleOnRoot(function() {
                if (LocalNative.replaySession !== session || session.returning || session.closed) return;
                try {
                    var stageNow = typeof GS_CURRENT_STAGE !== 'undefined' ? GS_CURRENT_STAGE : null;
                    var battle = typeof GS_STAGE_BATTLE !== 'undefined' ? GS_STAGE_BATTLE : null;
                    var changing = false;
                    try {
                        if (typeof G_Director !== 'undefined' && G_Director &&
                            typeof G_Director.getRunningScene === 'function') {
                            var sc = typeof DA !== 'undefined' && DA && DA.getGameScene
                                ? DA.getGameScene() : G_Director.getRunningScene();
                            changing = !!(sc && sc.isChangingStage);
                        }
                    } catch (eCh) {}
                    if (battle == null || stageNow !== battle || changing)
                        LocalNative.abortBattleEnterToHome(
                            changing ? 'replay-loading-stuck' : 'replay-not-in-battle');
                } catch (eSafe) {
                    LocalNative.abortBattleEnterToHome('replay-safety');
                }
            }, 15.0);
            return true;
        };

        LocalNative.localRaidAllAttackersDead = function(gc) {
            if (!gc || !gc.__localRaidDeployed || !gc.__localStubAtkCids ||
                !gc.__localStubAtkCids.length) return false;
            for (var i = 0; i < gc.__localStubAtkCids.length; i++) {
                var unit = LocalNative.resolveBattleUnitById(gc.__localStubAtkCids[i]);
                // Stock may remove a dead unit from UnitManager. Every CID here
                // was observed at deployment; missing entries are no longer alive.
                if (!unit) continue;
                var bc = LocalNative.resolveUnitBattleController(unit);
                if (!bc || bc.isAlive !== false) return false;
            }
            return true;
        };

        LocalNative.queueLocalRaidReplayEnd = function(gc) {
            var session = LocalNative.replaySession;
            if (!gc || !session || gc.__localRaidSession !== session ||
                session.returning || session.closed || session.endQueued || !gc.battleFinished)
                return false;
            session.endQueued = true;
            session.completed = true;
            LocalNative.scheduleOnRoot(function() {
                if (LocalNative.replaySession !== session || session.returning || session.closed)
                    return;
                try {
                    // The original menu issues rpc_s_finish_enemy_attack_replay.
                    // Do not show a normal PvP result or invent a battle result ACK.
                    LocalNative.pushSettleTrace({
                        kind: 'queue-onReplayEnd',
                        stage: session.stage,
                        gc: LocalNative.snapshotSettleGc(gc)
                    });
                    gc.menu.onReplayEnd();
                    LocalNative.writeStatus({step: 'local-raid-replay-end', stage: session.stage});
                } catch (eEnd) {
                    session.endQueued = false;
                    LocalNative.writeStatus({step: 'local-raid-replay-end-ERR', error: String(eEnd)});
                }
            }, 0);
            return true;
        };

        LocalNative.recordLocalRaidCompletion = function(player, level, stage) {
            level.player = level.player || {};
            LocalNative.ensureAvailableStages(level.player, 'raid-before');
            var stages = {};
            var previous = level.player.finishedVirtualStages || {};
            for (var key in previous) {
                if (previous.hasOwnProperty(key)) stages[key] = previous[key];
            }
            // Original rookie_stage_complete checks a keyed virtual-stage map.
            // A list [20001] does not satisfy it. Do not forge Rookie bits/PIDs.
            stages[String(stage)] = 1;
            level.player.finishedVirtualStages = stages;
            if (player) player.finishedVirtualStages = stages;
            LocalNative.ensureAvailableStages(level.player, 'raid-complete');
            if (player) LocalNative.ensureAvailableStages(player, 'raid-complete-live');
            LocalNative.writeStatus({
                step: 'local-raid-stage-complete',
                stage: stage,
                availableStages: level.player.availableStages
            });
        };

        LocalNative.closeLocalRaidSessionOnHome = function(gc) {
            var session = LocalNative.replaySession;
            if (!gc || typeof GS_CURRENT_STAGE === 'undefined' ||
                typeof GS_STAGE_BUILD === 'undefined' || GS_CURRENT_STAGE !== GS_STAGE_BUILD ||
                !session || !session.returning || session.closed) return false;
            session.closed = true;
            LocalNative.raidController = null;
            LocalNative.writeStatus({step: 'local-raid-home-ready', stage: session.stage});
            return true;
        };

        LocalNative.handleFinishEnemyAttackReplay = function(player, params) {
            var session = LocalNative.replaySession;
            player = player || (typeof G_Player !== 'undefined' ? G_Player : null);
            var inBattle = typeof GS_CURRENT_STAGE !== 'undefined' && typeof GS_STAGE_BATTLE !== 'undefined' &&
                GS_CURRENT_STAGE === GS_STAGE_BATTLE;
            if (session) {
                if (session.returning || session.closed) return false;
                session.returning = true;
            }
            LocalNative.writeStatus({step: 'finish-enemy-attack-replay', inBattle: inBattle});
            try {
                var store = LocalNative.readRaw();
                var level = store && store.level ? store.level : LocalNative.defaultLevelDict();
                var raidGc = LocalNative.raidController;
                if (session && raidGc && raidGc.__localRaidSession === session &&
                    (session.completed || raidGc.battleFinished ||
                        LocalNative.localRaidAllAttackersDead(raidGc))) {
                    session.completed = true;
                    LocalNative.recordLocalRaidCompletion(player, level, session.stage);
                    if (store) {
                        store.level = level;
                        LocalNative.writeRaw(store);
                    }
                }
                if (level && level.player)
                    LocalNative.ensureAvailableStages(level.player, 'battle-to-home');
                if (player)
                    LocalNative.ensureAvailableStages(player, 'battle-to-home-live');
                if (player && typeof player.rpc_c_battle_to_home === 'function') {
                    LocalNative.pushSettleTrace({
                        kind: 'rpc_c_battle_to_home',
                        hasUserConfig: !!(level && level.user_config &&
                            Object.keys(level.user_config).length),
                        finishedVirtualStages: level && level.player
                            ? level.player.finishedVirtualStages : null,
                        availableStages: level && level.player
                            ? level.player.availableStages : null,
                        unitsN: level && level.units ? level.units.length : null
                    });
                    player.rpc_c_battle_to_home(level);
                    LocalNative.writeStatus({step: 'rpc_c_battle_to_home-ok'});
                } else if (player && typeof player.changeStageAndInit === 'function') {
                    var build = typeof GS_STAGE_BUILD !== 'undefined' ? GS_STAGE_BUILD : 1;
                    player.changeStageAndInit(build, level);
                    LocalNative.writeStatus({step: 'battle-to-home-via-changeStage'});
                }
            } catch (e) {
                LocalNative.writeStatus({
                    step: 'finish-enemy-attack-replay-ERR',
                    error: String(e)
                });
            }
            LocalNative.scheduleOnRoot(function() {
                if (session) session.closed = true;
            }, 0.5);
            return true;
        };

        LocalNative.handleBattleToHome = function(player, params) {
            LocalNative.writeStatus({step: 'handleBattleToHome'});
            if (LocalNative.isLocalRaidActive())
                return LocalNative.handleFinishEnemyAttackReplay(player, params);
            if (LocalNative.isLocalPveBattleActive())
                return LocalNative.handlePveBattleToHome(player, params || {});
            // Fallback: treat as home return with current save.
            return LocalNative.handlePveBattleToHome(player, params || {});
        };

        // No fixed tutorial capsule result was found in the client. This one-time
        // fallback is explicitly requested by the user: level-30 JINGLING_DRAGON.
        LocalNative.ensureWelcomeLetter = function(player) {
            if (!player || typeof LETTER_TYPE_SYS_REWARD === 'undefined') return false;
            if (!(player.sys_letters instanceof Array)) player.sys_letters = [];
            var id = 'local_goddess_newbie_gift';
            for (var i = 0; i < player.sys_letters.length; i++) {
                if (player.sys_letters[i].letter_id === id) {
                    player.sys_letters[i].sender_name = "\u6765\u81ea\u5973\u795e\u7684\u4fe1";
                    player.sys_letters[i].msg = "\u65b0\u624b\u793c\u5305\uff1a\u94bb\u77f3\u00d7100\uff0c\u9f99\u5e01\u00d75000\uff0c\u65e5\u5149\u00d75000\uff0c\u82f1\u7075\u503c\u00d750\u3002\u70b9\u51fb\u9886\u53d6\u83b7\u5f97\u5168\u90e8\u5956\u52b1\u3002";
                    return false;
                }
            }
            player.sys_letters.push({
                letter_id: id, letter_type: LETTER_TYPE_SYS_REWARD,
                sender_name: "\u6765\u81ea\u5973\u795e\u7684\u4fe1", sender_id: 'local-system-goddess',
                sender_avatar: 45, sender_level: 1,
                timestamp: Math.floor(Date.now() / 1000),
                msg: "\u65b0\u624b\u793c\u5305\uff1a\u94bb\u77f3\u00d7100\uff0c\u9f99\u5e01\u00d75000\uff0c\u65e5\u5149\u00d75000\uff0c\u82f1\u7075\u503c\u00d750\u3002\u70b9\u51fb\u9886\u53d6\u83b7\u5f97\u5168\u90e8\u5956\u52b1\u3002",
                params: {res_type: 3, res_num: 100},
                is_gained: !!player.localWelcomeGiftClaimed
            });
            return true;
        };
        LocalNative.syncSavedHomeWallet = function(level) {
            var gold = 0, wood = 0;
            for (var i = 0; i < level.units.length; i++) {
                var record = level.units[i];
                if (!record.sto || typeof record.sto !== 'object') continue;
                gold += Number(record.sto[2]) || 0;
                wood += Number(record.sto[1]) || 0;
                var unit = G_UnitManager.getUnitBySID(record.sid);
                var holder = unit && unit.componentList && unit.componentList.ResourceStorage;
                if (!holder && unit && unit.getComponent) holder = unit.getComponent('ResourceStorage');
                if (holder && holder.currentStorage) {
                    holder.currentStorage[1] = Number(record.sto[1]) || 0;
                    holder.currentStorage[2] = Number(record.sto[2]) || 0;
                    if (holder.refreshDisplay) holder.refreshDisplay();
                }
            }
            var rm = LocalNative.getResourceManager();
            rm.Res[1] = wood; rm.Res[2] = gold;
            rm.Res[3] = level.player.diamond; rm.Res[4] = level.player.spirit;
            if (typeof rm.updateResFromStageAndAverage === 'function')
                rm.updateResFromStageAndAverage(GS_STAGE_BUILD);
            LocalNative.refreshResHud();
        };
        LocalNative.handleWelcomeLetterReward = function(player, params) {
            if (!params || params.letter_id !== 'local_goddess_newbie_gift') return false;
            var before = LocalNative.readRaw();
            if (before.level.player.localWelcomeGiftReceiptV2) return false;
            var repair = !!before.level.player.localWelcomeGiftClaimed;
            if (!repair) LocalNative.tryDumpAndSave();
            var store = LocalNative.readRaw();
            var level = store.level;
            var rm = LocalNative.getResourceManager();
            if (!rm || !rm.Res) throw new Error('No resource manager for welcome gift');
            // Server-side saved records are authoritative; never mark a claim
            // from four optimistic addRes calls whose snapshot may have failed.
            level.player.diamond = Math.max(Number(level.player.diamond) || 0, Number(rm.Res[3]) || 0);
            if (!repair) level.player.diamond += 100;
            level.player.spirit = (Number(level.player.spirit) || 0) + 50;
            var credited = LocalNative.grantPveLoot(5000, 5000, level);
            level.player.localWelcomeGiftClaimed = true;
            level.player.localWelcomeGiftReceiptV2 = {diamond: repair ? 0 : 100,
                gold: credited.gold, wood: credited.wood, spirit: 50, repaired: repair};
            var letters = level.player.sys_letters || [];
            for (var i = 0; i < letters.length; i++) {
                if (letters[i].letter_id === params.letter_id) letters[i].is_gained = true;
            }
            LocalNative.writeRaw(store);
            LocalNative.syncSavedHomeWallet(level);
            var lm = player.getComponent && player.getComponent('LetterManager');
            if (lm && lm.sysLetters) {
                for (var j = 0; j < lm.sysLetters.length; j++) {
                    if (lm.sysLetters[j].letter_id === params.letter_id) lm.sysLetters[j].is_gained = true;
                }
            }
            LocalNative.writeStatus({step: 'welcome-letter-gift-persisted', receipt: level.player.localWelcomeGiftReceiptV2,
                diamond: level.player.diamond, spirit: level.player.spirit});
            return true;
        };

        LocalNative.rookieSignNow = function() {
            // DailyEventRecorder compares UTC dates of this same client clock.
            var clock = 0;
            try {
                if (typeof DA !== 'undefined' && DA.getSystemCurrentTimeSec)
                    clock = Number(DA.getSystemCurrentTimeSec());
            } catch (eClock) {}
            return isFinite(clock) && clock > 1000000000
                ? Math.floor(clock) : Math.floor(Date.now() / 1000);
        };

        LocalNative.ensureRookieSign = function(level) {
            var p = level.player, now = LocalNative.rookieSignNow();
            var today = Math.floor(now / 86400);
            var state = level.localRookieSign;
            if (!state) {
                var oldDay = Number(p.rookie_days) || 1;
                var oldCounter = p.event_counters && p.event_counters[1] && p.event_counters[1][8301];
                state = level.localRookieSign = {version: 1,
                    claimedDays: Math.max(0, Math.min(7, oldDay - 1)), receipts: {},
                    lastClaimDay: oldCounter && Number(oldCounter.c) > 0 &&
                        Math.floor((Number(p.last_update_time) || 0) / 86400) === today ? today : null};
            }
            if (state.version !== 1 || !isFinite(state.claimedDays) ||
                state.claimedDays < 0 || state.claimedDays > 7 || state.claimedDays % 1)
                throw new Error('Invalid rookie sign receipt; existing save preserved');
            if (!state.receipts) state.receipts = {};
            p.rookie_days = state.claimedDays + 1;
            if (!p.event_counters) p.event_counters = {};
            // Match stock daily rollover without resetting monthly/tutorial events.
            if (p.last_update_time && Math.floor(p.last_update_time / 86400) < today)
                delete p.event_counters[1];
            if (!p.event_counters[1]) p.event_counters[1] = {};
            var denied = state.claimedDays >= 7 ||
                (state.lastClaimDay != null && state.lastClaimDay >= today);
            p.event_counters[1][8301] = {c: denied ? 1 : 0, t: now,
                clientData: {_eventCount: denied ? 1 : 0}};
            p.last_update_time = now;
            return {state: state, today: today, now: now, day: p.rookie_days,
                eligible: !denied && p.rookie_days <= 7};
        };

        LocalNative.syncRookieSign = function(player, level) {
            var info = LocalNative.ensureRookieSign(level);
            var sr = player.getComponent('SignReward');
            var der = player.getComponent('DailyEventRecorder');
            player.rookie_days = info.day;
            if (sr) sr.rookie_days = info.day;
            if (der) {
                if (!der.event_counters) der.event_counters = {};
                der.refreshDailyEvent({last_update_time: info.now, event_id: 8301,
                    event_counter: JSON.parse(JSON.stringify(level.player.event_counters[1][8301]))});
            }
            if (sr) sr.newRookieReward = info.eligible;
            return info;
        };

        LocalNative.applyRookieSignRewards = function(level, day) {
            var sign = data.sevendays && data.sevendays[day];
            if (!sign) throw new Error('Missing seven-day configuration ' + day);
            var eventId = sign.input_event, seen = {}, rewards = [];
            while (eventId) {
                if (seen[eventId]) throw new Error('Cyclic rookie reward event ' + eventId);
                seen[eventId] = true;
                var event = data.input_event_client && data.input_event_client[eventId];
                if (!event) throw new Error('Missing rookie reward event ' + eventId);
                if ((event.putin_event_exp || []).length || (event.putin_event_slot || []).length ||
                    (event.putin_event_skill || []).length)
                    throw new Error('Unresolved rookie reward category ' + eventId);
                var resources = event.putin_event_resource || [];
                for (var r = 0; r < resources.length; r++) {
                    var res = data.resource_input && data.resource_input[resources[r]];
                    if (!res || !(Number(res.putin_num) > 0))
                        throw new Error('Missing rookie resource ' + resources[r]);
                    var amount = Number(res.putin_num), type = Number(res.putin_resource_type);
                    if (type === 3) {
                        level.player.diamond = (Number(level.player.diamond) || 0) + amount;
                        rewards.push([4, amount]);
                    } else if (type === 4) {
                        level.player.spirit = (Number(level.player.spirit) || 0) + amount;
                        rewards.push([11, amount]);
                    } else if (type === 1 || type === 2) {
                        var credited = LocalNative.grantPveLoot(type === 2 ? amount : 0, type === 1 ? amount : 0, level);
                        rewards.push([type === 1 ? 2 : 3, type === 1 ? credited.wood : credited.gold]);
                    } else throw new Error('Unsupported rookie currency ' + type);
                }
                var items = event.putin_event_item || [];
                for (var i = 0; i < items.length; i++) {
                    var itemRewards = LocalNative.applyPveItemReward(level, items[i], 'rookie_' + day);
                    if (!itemRewards.length) throw new Error('Unresolved rookie item ' + items[i]);
                    rewards = rewards.concat(itemRewards);
                }
                var oldCapacity = Number(level.player.hero_slot_num) || 0;
                var heroes = LocalNative.applyPveHeroRewards(level, eventId, 'rookie_' + day);
                if (heroes.length !== (event.putin_event_hero || []).length)
                    throw new Error('Unresolved rookie hero ' + eventId);
                for (var h = 0; h < heroes.length; h++) {
                    var heroReward = JSON.parse(JSON.stringify(heroes[h]));
                    heroReward[1].hero_slot = h === 0
                        ? Math.max(0, Number(level.player.hero_slot_num) - oldCapacity) : 0;
                    // Type 29 creates the hero but stock mergeInputs does not render
                    // it. Type 0 supplies the original hero reward card (no grant).
                    rewards.push([0, {hero_id: heroReward[1].hero_id,
                        level: heroReward[1].lv, unit_mutateid: heroReward[1].unit_mutateid || 0,
                        skill_id: heroReward[1].skill_id || 0}]);
                    rewards.push(heroReward);
                }
                eventId = event.putin_event_next;
            }
            if (!rewards.length) throw new Error('Empty rookie reward ' + day);
            return rewards;
        };

        LocalNative.handleRookieSignReward = function(player) {
            if (GS_CURRENT_STAGE !== GS_STAGE_BUILD) return false;
            var before = LocalNative.readRaw();
            var info = LocalNative.ensureRookieSign(before.level);
            if (!info.eligible) {
                LocalNative.syncRookieSign(player, before.level);
                LocalNative.writeStatus({step: 'rookie-sign-denied', day: info.day});
                return false;
            }
            LocalNative.tryDumpAndSave();
            // Work on a detached transaction: a missing table or write failure cannot
            // persist a partial reward, nor an optimistic stock rookie_days increment.
            var store = JSON.parse(JSON.stringify(LocalNative.readRaw()));
            info = LocalNative.ensureRookieSign(store.level);
            if (!info.eligible) return false;
            var rewards = LocalNative.applyRookieSignRewards(store.level, info.day);
            info.state.receipts[info.day] = {day: info.day, claimedAt: info.now, reward: rewards};
            info.state.claimedDays++;
            info.state.lastClaimDay = info.today;
            LocalNative.ensureRookieSign(store.level);
            LocalNative.writeRaw(store);
            var pm = player.getComponent('PackageManager');
            if (pm) {
                if (!pm['package']) pm['package'] = {};
                var names = ['material', 'based_prop', 'advanced_prop', 'formula'];
                for (var n = 0; n < names.length; n++) {
                    if (!pm['package'][names[n]])
                        pm['package'][names[n]] = {item_dict: {}, capacity: 100, new_items: 0, buy_slot_time: 0};
                }
            }
            try {
                // Runtime still has its pre-claim wallet/package. The unchanged stock
                // response displays and applies this reward exactly once.
                player.rpc_c_get_rookie_sign_reward_ans({reward: rewards});
            } finally {
                LocalNative.syncSavedHomeWallet(store.level);
                if (pm) {
                    pm.init({'package': JSON.parse(JSON.stringify(store.level.player['package']))});
                    if (pm.refreshNewItems) pm.refreshNewItems();
                }
                LocalNative.syncRookieSign(player, store.level);
            }
            LocalNative.writeStatus({step: 'rookie-sign-claimed', day: info.day,
                next: store.level.player.rookie_days, reward: rewards});
            return true;
        };

        LocalNative.maybeShowRookieSign = function(player, gc) {
            var gate = function(reason, details) {
                if (LocalNative._rookieSignGate !== reason) {
                    LocalNative._rookieSignGate = reason;
                    LocalNative.writeStatus({step: 'rookie-sign-gate', reason: reason, details: details || null});
                }
                return false;
            };
            if (GS_CURRENT_STAGE !== GS_STAGE_BUILD || !player || !gc || gc.firstMovie) return false;
            if (typeof Rookie === 'undefined' || typeof ROOKIE_CODE_SIGN_AWARD === 'undefined' ||
                !Rookie.isRookieCodeFinished(ROOKIE_CODE_SIGN_AWARD))
                return gate('tutorial-locked', typeof ROOKIE_CODE_SIGN_AWARD !== 'undefined' ? ROOKIE_CODE_SIGN_AWARD : null);
            var currentUI = G_UIManager.getCurrentUIIDForRookie();
            if (currentUI !== 1) return gate('other-ui', currentUI);
            // A curProcesses entry may wait for an unbuilt unit indefinitely.
            // Only nodes actually attached and visible can block this popup.
            var active = gc.curRookies || {};
            for (var pid in active) {
                var processes = active[pid].curProcesses || {};
                for (var processId in processes) {
                    var cfg = gc.allRookies && gc.allRookies[pid] && gc.allRookies[pid].processes[processId];
                    var process = processes[processId];
                    var nodes = [process.avataNode, process.markNode];
                    var displayed = false;
                    for (var ni = 0; ni < nodes.length; ni++) {
                        var node = nodes[ni];
                        if (!node || !node.getParent || !node.getParent()) continue;
                        var visible = true;
                        while (node) {
                            if (node.isVisible && !node.isVisible()) { visible = false; break; }
                            node = node.getParent ? node.getParent() : null;
                        }
                        if (visible) displayed = true;
                    }
                    if (displayed)
                        return gate('active-guide', {pid: pid, process: processId,
                            text: cfg && cfg.rookie_text, ui: cfg && cfg.rookie_current_ui});
                }
            }
            var store = LocalNative.readRaw();
            var info = LocalNative.ensureRookieSign(store.level);
            if (!info.eligible || info.state.promptDay === info.today) return false;
            LocalNative.syncRookieSign(player, store.level);
            G_UIManager.get_ui(UI.Reward.RewardInterface.UIID).open('RookieSign');
            info.state.promptDay = info.today;
            LocalNative.writeRaw(store);
            LocalNative.writeStatus({step: 'rookie-sign-open', day: info.day});
            return true;
        };

        LocalNative.startRookieSignClock = function(gc) {
            var root = LocalNative.getScheduleRoot();
            if (!root || !root.schedule) return;
            if (root.__localRookieSignTick) return;
            var lastDate = null;
            root.__localRookieSignTick = function() {
                if (GS_CURRENT_STAGE !== GS_STAGE_BUILD || !G_Player) return;
                try {
                    var store = LocalNative.readRaw();
                    var today = Math.floor(LocalNative.rookieSignNow() / 86400);
                    if (lastDate !== today) {
                        LocalNative.syncRookieSign(G_Player, store.level);
                        LocalNative.syncMonthlySign(G_Player, store.level);
                        LocalNative.writeRaw(store);
                        lastDate = today;
                        LocalNative.writeStatus({step: 'rookie-sign-ready',
                            day: store.level.player.rookie_days,
                            eligible: G_Player.getComponent('SignReward').newRookieReward});
                    }
                    LocalNative.maybeShowRookieSign(G_Player, LocalNative.getBuildController() || gc);
                } catch (e) {
                    LocalNative.writeStatus({step: 'rookie-sign-refresh-ERR', error: String(e)});
                }
            };
            root.schedule(root.__localRookieSignTick, 5);
            LocalNative.scheduleOnRoot(root.__localRookieSignTick, 1);
        };

        LocalNative.installRookieSignHooks = function() {
            var proto = typeof UI !== 'undefined' && UI.Reward && UI.Reward.RewardInterface && UI.Reward.RewardInterface.prototype;
            if (!proto || !proto.open || proto.open.__localRookieSign) return;
            var original = proto.open;
            proto.open = function() {
                if (GS_CURRENT_STAGE === GS_STAGE_BUILD && G_Player) {
                    var store = LocalNative.readRaw();
                    LocalNative.syncRookieSign(G_Player, store.level);
                    LocalNative.syncMonthlySign(G_Player, store.level);
                    LocalNative.writeRaw(store);
                }
                return original.apply(this, arguments);
            };
            proto.open.__localRookieSign = true;
        };

        LocalNative.installMonthlySignRewards = function(year) {
            // User-requested local reward, separate from the original seven-day table.
            var eventId = 990100001;
            if (!data.daily_register) data.daily_register = {};
            if (!data.input_event_client) data.input_event_client = {};
            if (!data.resource_input) data.resource_input = {};
            data.resource_input[eventId] = {putin_type: 6, putin_limit: 0,
                putin_num: 100000, putin_resource_type: 3};
            data.input_event_client[eventId] = {putin_event_exp: [], putin_event_resource: [eventId],
                putin_event_hero: [], putin_event_slot: [], putin_event_next: 0,
                putin_event_skill: [], putin_event_item: []};
            for (var month = 1; month <= 12; month++) {
                var days = new Date(Date.UTC(year, month, 0)).getUTCDate();
                for (var day = 1; day <= 31; day++) {
                    if (day <= days) data.daily_register[month * 100 + day] = {dr_putin: eventId};
                    else delete data.daily_register[month * 100 + day];
                }
            }
        };

        LocalNative.ensureMonthlySign = function(level) {
            var clock = LocalNative.ensureRookieSign(level);
            var date = new Date(clock.now * 1000);
            var year = date.getUTCFullYear(), month = date.getUTCMonth() + 1;
            var days = new Date(Date.UTC(year, month, 0)).getUTCDate();
            var key = year + '-' + (month < 10 ? '0' : '') + month;
            var state = level.localMonthlySign;
            if (!state) state = level.localMonthlySign = {version: 1, months: {}, lastClaimDay: null};
            if (state.version !== 1 || !state.months || typeof state.months !== 'object')
                throw new Error('Invalid monthly sign state; existing save preserved');
            var record = state.months[key];
            if (!record) record = state.months[key] = {claimedDays: 0, receipts: {}};
            if (!isFinite(record.claimedDays) || record.claimedDays % 1 ||
                record.claimedDays < 0 || record.claimedDays > days || !record.receipts)
                throw new Error('Invalid monthly sign receipt; existing save preserved');
            var denied = record.claimedDays >= days ||
                (state.lastClaimDay != null && state.lastClaimDay >= clock.today);
            var counters = level.player.event_counters;
            if (!counters[3]) counters[3] = {};
            counters[1][2003] = {c: denied ? 1 : 0, t: clock.now,
                clientData: {_eventCount: denied ? 1 : 0}};
            counters[3][2002] = {c: record.claimedDays, t: clock.now,
                d: {month: month, year: year}, clientData: {_eventCount: record.claimedDays}};
            // Normal once-a-day claims only. The unrecovered paid retroactive path
            // must not charge items/diamonds or bypass the daily receipt.
            counters[3][2111] = {c: 31, t: clock.now, clientData: {_eventCount: 31}};
            counters[1][3010] = {c: state.showDay === clock.today ? 1 : 0, t: clock.now,
                clientData: {_eventCount: state.showDay === clock.today ? 1 : 0}};
            LocalNative.installMonthlySignRewards(year);
            return {state: state, record: record, key: key, month: month, year: year,
                days: days, today: clock.today, now: clock.now,
                nextDay: record.claimedDays + 1, eligible: !denied};
        };

        LocalNative.syncMonthlySign = function(player, level) {
            var info = LocalNative.ensureMonthlySign(level);
            LocalNative.installMonthlySignRewards(info.year);
            var der = player.getComponent('DailyEventRecorder');
            if (der) {
                if (!der.event_counters) der.event_counters = {};
                var events = [2003, 2111, 3010, 2002];
                for (var i = 0; i < events.length; i++) {
                    var id = events[i], period = id === 2003 || id === 3010 ? 1 : 3;
                    var dict = {event_id: id, last_update_time: info.now,
                        event_counter: JSON.parse(JSON.stringify(level.player.event_counters[period][id]))};
                    if (player.rpc_c_refresh_daily_event) player.rpc_c_refresh_daily_event(dict);
                    else der.refreshDailyEvent(dict);
                }
            }
            var sr = player.getComponent('SignReward');
            if (sr) sr.newDailySignReward = info.eligible;
            return info;
        };

        LocalNative.handleMonthlySignReward = function(player, params) {
            if (GS_CURRENT_STAGE !== GS_STAGE_BUILD) return false;
            var current = LocalNative.readRaw();
            var info = LocalNative.ensureMonthlySign(current.level);
            if (!info.eligible || !params || Number(params.month) !== info.month ||
                Number(params.day) !== info.nextDay) {
                LocalNative.syncMonthlySign(player, current.level);
                LocalNative.writeStatus({step: 'monthly-sign-denied', month: info.key,
                    nextDay: info.nextDay, requested: params || null});
                return false;
            }
            LocalNative.tryDumpAndSave();
            var store = JSON.parse(JSON.stringify(LocalNative.readRaw()));
            info = LocalNative.ensureMonthlySign(store.level);
            if (!info.eligible || Number(params.month) !== info.month || Number(params.day) !== info.nextDay)
                return false;
            var rm = LocalNative.getResourceManager();
            if (!rm || !rm.Res) throw new Error('No wallet for monthly sign');
            // If a snapshot fails, retain the current spent balance instead of
            // restoring an older larger wallet from the save.
            var balance = Number(rm.Res[3]);
            if (!isFinite(balance) || balance < 0) throw new Error('Invalid monthly sign wallet');
            store.level.player.diamond = balance + 100000;
            var reward = [[4, 100000]];
            info.record.receipts[info.today] = {day: info.nextDay, claimedAt: info.now,
                diamond: 100000, balanceAfter: store.level.player.diamond};
            info.record.claimedDays++;
            info.state.lastClaimDay = info.today;
            LocalNative.ensureMonthlySign(store.level);
            LocalNative.writeRaw(store);
            try {
                player.rpc_c_get_sign_reward_ans({reward: reward});
            } finally {
                rm.Res[3] = store.level.player.diamond;
                if (player.resetCurDiamond) player.resetCurDiamond();
                LocalNative.refreshResHud();
                LocalNative.syncMonthlySign(player, store.level);
            }
            LocalNative.writeStatus({step: 'monthly-sign-claimed', month: info.key,
                day: info.nextDay, diamond: store.level.player.diamond});
            return true;
        };

        LocalNative.refreshMonthlySign = function(player, markShown) {
            if (GS_CURRENT_STAGE !== GS_STAGE_BUILD) return false;
            var store = LocalNative.readRaw();
            var info = LocalNative.ensureMonthlySign(store.level);
            if (markShown) info.state.showDay = info.today;
            LocalNative.writeRaw(store);
            LocalNative.syncMonthlySign(player, store.level);
            return true;
        };

        // User-authorized offline economy v1. These probabilities are local policy,
        // not recovered production-server probabilities. Keep all stock UI/RPCs.
        LocalNative.shopPolicy = {version: 1, weights: [70, 25, 5], pity: 20,
            cardColors: [2, 3, 4], dismissSpirit: [10, 30, 100], maxBatch: 100};

        // Independent fragment rolls; retain the original species weights inside each pool.
        LocalNative.rebirthTreasurePolicy = {
            1504: {fragmentStage:50032, fragments:[[9061,1,2,4],[9082,0.25,1,2]], blueprints:{}},
            1505: {fragmentStage:50042, fragments:[[9081,1,5,8],[9082,0.75,4,6]], blueprints:{50045:[9086,0.10]}},
            1506: {fragmentStage:50052, fragments:[[9101,1,16,22],[9102,1,12,16]], blueprints:{50055:[9106,0.02],50056:[9107,0.15]}}
        };

        LocalNative.heroTreasurePolicy = {
            1501: {fragmentStage:50003, fragmentMultiplier:2, boostedStages:{50002:0.40,50004:0.40}},
            1502: {fragmentStage:50013, fragmentMultiplier:2, boostedStages:{50012:0.60,50014:0.60}},
            1503: {fragmentStage:50023, fragmentMultiplier:2, boostedStages:{50022:0.80,50024:0.80}}
        };

        LocalNative.shopState = function(level) {
            if (!level.localShop) level.localShop = {version: 1, sequence: 0,
                rareMisses: 0, itemCounters: {}, pending: null};
            if (level.localShop.version !== 1) throw new Error('Unsupported shop save version');
            return level.localShop;
        };

        LocalNative.shopPick = function(entries) {
            var total = 0, i;
            for (i = 0; i < entries.length; i++) total += Number(entries[i][1]) || 0;
            if (!(total > 0)) throw new Error('Empty shop reward pool');
            var roll = Math.random() * total;
            for (i = 0; i < entries.length; i++) {
                roll -= Number(entries[i][1]) || 0;
                if (roll < 0) return entries[i][0];
            }
            return entries[entries.length - 1][0];
        };

        LocalNative.snapshotResearch = function(level, player) {
            var tm = player && player.getComponent('TechManager');
            if (tm && tm.gained_techs)
                level.player.gained_techs = JSON.parse(JSON.stringify(tm.gained_techs));
            var rm = player && player.getComponent('ResourceManager');
            if (rm && rm.Res && isFinite(rm.Res[9])) level.player.league_points = Number(rm.Res[9]);
        };

        LocalNative.restoreResearch = function(player) {
            var level = LocalNative.readRaw().level;
            var tm = player.getComponent('TechManager');
            tm.gained_techs = JSON.parse(JSON.stringify(level.player.gained_techs || {}));
            var ids = data.tech.summary.all_techs;
            for (var i = 0; i < ids.length; i++)
                if (!tm.gained_techs[ids[i]]) tm.gained_techs[ids[i]] = {lv: 0, exp: 0};
            var tree = tm.getTechTree(), tc = tree && tree.getComponent('TechController');
            if (tc) for (var j = 0; j < level.units.length; j++) {
                if (String(level.units[j].sid) !== String(tree.sid)) continue;
                var record = level.units[j];
                tc.training_tech = record.training_tech || 0;
                tc.last_train_tech_time = record.last_train_tech_time || 0;
                tc.trained_time = record.trained_time || 0;
                if (!tc.training_tech && tc.researchingAnimationHandle) {
                    DA.unschedule(tree.rootNode, tc.researchingAnimationHandle);
                    tc.researchingAnimationHandle = null;
                }
                if (tc.techBubble) tc.techBubble.refresh();
            }
            LocalNative.syncSavedHomeWallet(level);
            var rm = player.getComponent('ResourceManager');
            if (rm && rm.Res) rm.Res[9] = Number(level.player.league_points) || 0;
            if (tm.invokeAffectedSelectors) tm.invokeAffectedSelectors();
        };

        LocalNative.handleTrainTech = function(player, params) {
            try {
                var store = LocalNative.shopTransaction(player), level = store.level;
                var tm = player.getComponent('TechManager'), id = Number(params.tech_id);
                var info = tm.gained_techs[id], tree = tm.getTechTree();
                var cfg = info && data.tech[id * 100 + info.lv + 1];
                var previous = LocalNative.readRaw().level.player.gained_techs || {};
                var before = previous[id] || {lv: 0, exp: 0};
                // Stock has paid and added one point per click. Multiple clicks may
                // reach the zero-delay callback together; commit their full snapshot.
                if (!cfg || !tree || cfg.tree_lv > tree.level ||
                    cfg.resource_type1.indexOf(Number(params.res_type)) < 0 ||
                    info.lv !== before.lv || info.exp < before.exp ||
                    info.exp > cfg.level_stage_num) throw new Error('Invalid research point');
                if (info.exp === before.exp) return true;
                LocalNative.snapshotResearch(level, player);
                LocalNative.writeRaw(store);
                LocalNative.writeStatus({step: 'tech-point-saved', id: id, lv: info.lv, exp: info.exp});
                return true;
            } catch (e) {
                LocalNative.restoreResearch(player);
                LocalNative.writeStatus({step: 'tech-point-ERR', error: String(e)});
                return false;
            }
        };

        LocalNative.finishResearch = function(player, forcedId) {
            if (GS_CURRENT_STAGE !== GS_STAGE_BUILD) return false;
            var tm = player.getComponent('TechManager'), tree = tm && tm.getTechTree();
            var tc = tree && tree.getComponent('TechController');
            var id = tc && tc.training_tech;
            if (!id || (forcedId && Number(forcedId) !== Number(id))) return false;
            if (!forcedId && tc.getTrainingLeftTime() > 0) return false;
            var committed = false;
            try {
                var store = LocalNative.shopTransaction(player), level = store.level;
                var info = tm.gained_techs[id], cfg = tm.getNextTechConfig(id);
                if (!cfg || info.exp !== cfg.level_stage_num) throw new Error('Research points incomplete');
                var savedInfo = LocalNative.readRaw().level.player.gained_techs;
                if (!savedInfo || !savedInfo[id] || savedInfo[id].lv !== info.lv ||
                    savedInfo[id].exp !== info.exp) throw new Error('Research not committed');
                LocalNative.snapshotResearch(level, player);
                level.player.gained_techs[id] = {lv: info.lv + 1, exp: 0};
                for (var i = 0; i < level.units.length; i++) {
                    if (String(level.units[i].sid) !== String(tree.sid)) continue;
                    level.units[i].training_tech = 0;
                    level.units[i].last_train_tech_time = 0;
                    level.units[i].trained_time = 0;
                }
                LocalNative.writeRaw(store);
                committed = true;
                player.rpc_c_tech_training_complete({tech_id: id});
                LocalNative.writeStatus({step: 'tech-level-saved', id: id, lv: info.lv});
                return true;
            } catch (e) {
                if (forcedId || committed) LocalNative.restoreResearch(player);
                LocalNative.writeStatus({step: 'tech-finish-ERR', error: String(e)});
                return false;
            }
        };

        LocalNative.startResearchClock = function() {
            var root = LocalNative.getScheduleRoot();
            if (!root || !root.schedule || root.__localResearchTick) return;
            root.__localResearchTick = function() {
                if (GS_CURRENT_STAGE === GS_STAGE_BUILD && G_Player)
                    LocalNative.finishResearch(G_Player, 0);
            };
            root.schedule(root.__localResearchTick, 1);
            LocalNative.scheduleOnRoot(root.__localResearchTick, 0);
        };

        LocalNative.shopTransaction = function(player) {
            if (GS_CURRENT_STAGE !== GS_STAGE_BUILD) throw new Error('Shop requires home stage');
            var store = JSON.parse(JSON.stringify(LocalNative.readRaw()));
            var level = store.level;
            LocalNative.shopState(level);
            var rm = player.getComponent('ResourceManager');
            if (!rm || !rm.Res || !isFinite(rm.Res[3]) || rm.Res[3] < 0)
                throw new Error('Invalid shop wallet');
            // Stock shop already used useRes before sending paid RPCs. Snapshot
            // that debit, never subtract the price a second time.
            level.player.diamond = Number(rm.Res[3]);
            level.player.spirit = Number(rm.Res[4]) || 0;
            LocalNative.copyAccountProgress(level.player, player);
            var pm = player.getComponent('PackageManager');
            if (pm && pm['package']) level.player['package'] = JSON.parse(JSON.stringify(pm['package']));
            var der = player.getComponent('DailyEventRecorder');
            if (der && der.event_counters) {
                if (der.checkAndResetAllEventCounters)
                    der.checkAndResetAllEventCounters(Math.floor(Date.now() / 1000));
                level.player.event_counters = JSON.parse(JSON.stringify(der.event_counters));
                level.player.last_update_time = der.last_update_time;
            }
            for (var i = 0; i < level.units.length; i++) {
                var unit = G_UnitManager.getUnitBySID(level.units[i].sid);
                if (unit && unit.getComponent && unit.getComponent('BuildingBuilder'))
                    level.units[i] = LocalNative.snapshotBuildingRecord(unit);
            }
            return store;
        };

        LocalNative.shopSync = function(player, level) {
            LocalNative.syncSavedHomeWallet(level);
            var pm = player.getComponent('PackageManager');
            if (pm && level.player['package'])
                pm.init({'package': JSON.parse(JSON.stringify(level.player['package']))});
            var der = player.getComponent('DailyEventRecorder');
            if (der && level.player.event_counters) {
                der.event_counters = JSON.parse(JSON.stringify(level.player.event_counters));
                der.last_update_time = level.player.last_update_time;
            }
            var state = LocalNative.shopState(level);
            if (der && state.freeEggAt && player.rpc_c_refresh_daily_event) {
                player.rpc_c_refresh_daily_event({event_id: 8033,
                    last_update_time: Math.floor(Date.now() / 1000),
                    event_counter: {c: 1, t: state.freeEggAt, clientData: {_eventCount: 1}}});
            }
            if (der && player.rpc_c_refresh_daily_event) {
                for (var id = 8000; id <= 8008; id++) {
                    var counter = level.player.event_counters && level.player.event_counters[1] &&
                        level.player.event_counters[1][id];
                    if (counter) player.rpc_c_refresh_daily_event({event_id: id,
                        last_update_time: Math.floor(Date.now() / 1000), event_counter: counter});
                }
            }
        };

        // Stock getBuySlotPrice requires a numeric purchase count. Legacy local
        // bags omitted it, hiding the stock expansion button even when full.
        LocalNative.ensurePackageSlotMetadata = function(level) {
            var pkg = level.player['package'] || {};
            var names = ['material', 'based_prop', 'advanced_prop', 'formula'];
            for (var i = 0; i < names.length; i++) {
                var bag = pkg[names[i]];
                if (bag && bag.buy_slot_time == null) bag.buy_slot_time = 0;
            }
        };

        LocalNative.handleBuyPackageSlot = function(player, params) {
            var id = Number(params.pkgid);
            var names = ['material', 'based_prop', 'advanced_prop', 'formula'];
            if (!isFinite(id) || id % 1 || id < 0 || id >= names.length)
                throw new Error('Invalid package slot selection');
            var before = LocalNative.readRaw().level;
            var store = LocalNative.shopTransaction(player), level = store.level;
            var oldBag = before.player['package'] && before.player['package'][names[id]];
            var bag = level.player['package'] && level.player['package'][names[id]];
            var count = oldBag && Number(oldBag.buy_slot_time == null ? 0 : oldBag.buy_slot_time);
            var price = typeof PACKAGE_ADD_ITEM_COST !== 'undefined' && PACKAGE_ADD_ITEM_COST[count];
            if (!oldBag || !bag || !isFinite(count) || count % 1 || count < 0 || !price ||
                Number(bag.buy_slot_time) !== count + 1 ||
                Number(bag.capacity) !== Number(oldBag.capacity) + Number(price[0]))
                throw new Error('Invalid package slot expansion');
            if (Number(before.player.diamond) < Number(price[1]) ||
                level.player.diamond !== Number(before.player.diamond) - Number(price[1]))
                throw new Error('Package slot debit mismatch');
            // The original UI has already charged and added the slots. Persist
            // both together; do not charge or expand a second time.
            LocalNative.writeRaw(store);
            LocalNative.shopSync(player, level);
            return true;
        };

        LocalNative.shopAddItem = function(level, typeid, num) {
            var cfg = data.item && data.item[typeid];
            if (!cfg || !(num > 0) || num % 1) throw new Error('Invalid shop item ' + typeid);
            var names = ['material', 'based_prop', 'advanced_prop', 'formula'];
            var name = names[Number(cfg.item_type) || 0];
            if (!name) throw new Error('Unknown item package ' + typeid);
            var pkg = level.player['package'] || (level.player['package'] = {});
            for (var n = 0; n < names.length; n++) {
                if (!pkg[names[n]]) pkg[names[n]] = {item_dict: {}, capacity: 100, new_items: 0, buy_slot_time: 0};
            }
            var bag = pkg[name], remaining = num, deltas = [];
            var max = Number(cfg.item_overlap) || 1;
            for (var oid in bag.item_dict) {
                var item = bag.item_dict[oid];
                if (Number(item.typeid) !== Number(typeid) || item.num >= max) continue;
                var add = Math.min(remaining, max - item.num);
                item.num += add; item.is_new = true; remaining -= add;
                deltas.push({oid: oid, typeid: Number(typeid), num: add, is_new: true});
                if (!remaining) break;
            }
            while (remaining > 0) {
                if (Object.keys(bag.item_dict).length >= Number(bag.capacity == null ? 100 : bag.capacity))
                    throw new Error('Shop reward package is full');
                var state = LocalNative.shopState(level);
                var key = 'local_shop_' + (++state.sequence);
                var amount = Math.min(remaining, max);
                bag.item_dict[key] = {oid: key, typeid: Number(typeid), num: amount, is_new: true};
                deltas.push({oid: key, typeid: Number(typeid), num: amount, is_new: true});
                remaining -= amount;
            }
            bag.new_items = 0;
            for (var k in bag.item_dict) if (bag.item_dict[k].is_new) bag.new_items++;
            return deltas;
        };

        LocalNative.shopHeroPools = function() {
            var pools = [[], [], []], bases = {}, events = data.hero_input_client || {};
            for (var key in events) {
                var event = events[key];
                for (var team = 1; team <= 4; team++) {
                    var ids = event['putin_team' + team] || [];
                    for (var i = 0; i < ids.length; i++) {
                        var base = Number(ids[i]), main = data.unit_main[base];
                        if (base % 100 !== 1 || !main || !main.is_hero || main.hero_class !== 1) continue;
                        if (!bases[base]) bases[base] = {skill: 0};
                        if (event.putin_skill && data.skill_data[event.putin_skill])
                            bases[base].skill = event.putin_skill;
                    }
                }
            }
            for (var baseId in bases) {
                var id = Number(baseId), seen = {}, found = {};
                while (id && !seen[id]) {
                    seen[id] = true;
                    var cfg = data.unit_main[id], battle = data.unit_battle[id];
                    if (!cfg || !battle) break;
                    for (var tier = 0; tier < 3; tier++) {
                        if (!found[tier] && battle.hero_card_color === LocalNative.shopPolicy.cardColors[tier]) {
                            pools[tier].push({typeid: id, skill: bases[baseId].skill});
                            found[tier] = true;
                        }
                    }
                    id = Number(cfg.upgrade_target) || 0;
                }
            }
            for (var p = 0; p < 3; p++) if (!pools[p].length) throw new Error('Missing hero tier ' + p);
            return pools;
        };

        LocalNative.shopRollHeroes = function(level, count) {
            var pools = LocalNative.shopHeroPools(), state = LocalNative.shopState(level);
            var result = [], hasExcellent = false;
            for (var i = 0; i < count; i++) {
                var weights = LocalNative.shopPolicy.weights;
                var tier = LocalNative.shopPick([[0,weights[0]], [1,weights[1]], [2,weights[2]]]);
                if (state.rareMisses >= LocalNative.shopPolicy.pity - 1) tier = 2;
                if (count === 3 && i === 2 && !hasExcellent && tier === 0) tier = 1;
                hasExcellent = hasExcellent || tier >= 1;
                state.rareMisses = tier === 2 ? 0 : (state.rareMisses || 0) + 1;
                var pool = pools[tier], entry = pool[Math.floor(Math.random() * pool.length)];
                var hero = LocalNative.defaultStarterHero();
                hero.id = hero.sid = 'local_shop_hero_' + (++state.sequence);
                hero.hero_id = hero.typeid = entry.typeid;
                hero.unit_type = Math.floor(entry.typeid / 100); hero.unit_level = entry.typeid % 100;
                hero.lv = hero.level = 1; hero.xp = 0; hero.state = 0; hero.aidx = -1;
                hero.unit_mutateid = hero.mutateid = 0;
                hero.rct = hero.aht = Math.floor(Date.now() / 1000);
                hero.skill_id = 0;
                hero.skill_slots = [];
                LocalNative.ensureHeroSkill(hero);
                delete hero.life; delete hero.health;
                result.push({hero: hero, tier: tier, status: 'pending'});
            }
            return result;
        };

        LocalNative.shopShowPending = function(player, level) {
            var pending = LocalNative.shopState(level).pending;
            if (!pending || pending.closed) return false;
            var ans = [];
            pending.displayIndices = [];
            for (var i = 0; i < pending.cards.length; i++) {
                if (pending.cards[i].status === 'pending') {
                    LocalNative.ensureHeroSkill(pending.cards[i].hero);
                    ans.push([29, pending.cards[i].hero]);
                    pending.displayIndices.push(i);
                }
            }
            var store = LocalNative.readRaw();
            LocalNative.shopState(store.level).pending = pending;
            LocalNative.writeRaw(store);
            if (!ans.length) return LocalNative.handleShopGain(player);
            if (ans.length) player.rpc_c_draw_card({ans: ans});
            return !!ans.length;
        };

        LocalNative.handleShopDraw = function(player, params) {
            var old = LocalNative.readRaw(), tutorial = old.level.localTutorialEgg;
            if (params.buy_id === 100 && params.free === true && (!tutorial || !tutorial.claimed))
                return LocalNative.handleTutorialEggDraw(player, params);
            var state = LocalNative.shopState(old.level);
            if (state.pending && !state.pending.closed) {
                LocalNative.shopSync(player, old.level);
                return LocalNative.shopShowPending(player, old.level);
            }
            var id = Number(params.buy_id), cfg = data.virtual_item[id];
            if ((id !== 100 && id !== 101) || !cfg) throw new Error('Unknown dragon egg');
            var now = Math.floor(Date.now() / 1000);
            if (params.free === true) {
                var counters = old.level.player.event_counters || {};
                var last = state.freeEggAt || (counters[5] && counters[5][8033] && counters[5][8033].t) || 0;
                if (id !== 100 || now - last < Number(data.period_control[8033].interval))
                    throw new Error('Free egg is still cooling down');
            }
            var store = LocalNative.shopTransaction(player);
            state = LocalNative.shopState(store.level);
            state.pending = {id: ++state.sequence, buyId: id,
                cards: LocalNative.shopRollHeroes(store.level, id === 101 ? 3 : 1), closed: false};
            if (params.free === true) {
                state.freeEggAt = now;
                if (!store.level.player.event_counters) store.level.player.event_counters = {};
                if (!store.level.player.event_counters[5]) store.level.player.event_counters[5] = {};
                store.level.player.event_counters[5][8033] = {c:1,t:now,clientData:{_eventCount:1}};
            }
            LocalNative.writeRaw(store);
            LocalNative.shopSync(player, store.level);
            return LocalNative.shopShowPending(player, store.level);
        };

        LocalNative.handleShopGain = function(player) {
            var old = LocalNative.readRaw(), tutorial = old.level.localTutorialEgg;
            if (tutorial && !tutorial.claimed) return LocalNative.handleTutorialEggGain(player);
            var pending = LocalNative.shopState(old.level).pending;
            if (!pending || pending.closed) return false;
            var store = LocalNative.shopTransaction(player), level = store.level;
            pending = LocalNative.shopState(level).pending;
            var roster = level.heros || (level.heros = []), ans = [];
            var hm = player.getComponent('HeroManager');
            var capacity = Math.max(Number(level.player.hero_slot_num) || 0, hm ? hm.getHeroCapacity() : 0);
            for (var i = 0; i < pending.cards.length; i++) {
                var card = pending.cards[i];
                if (card.status !== 'pending') continue;
                var hero = card.hero;
                LocalNative.ensureHeroSkill(hero);
                hero.hero_slot = Math.max(0, roster.length + 1 - capacity);
                capacity += hero.hero_slot;
                roster.push(JSON.parse(JSON.stringify(hero)));
                card.status = 'claimed'; ans.push([29, hero]);
            }
            level.player.hero_slot_num = capacity;
            LocalNative.ensurePlayerSocialFields(level.player);
            level.player.achieve_raw.hero_times = (Number(level.player.achieve_raw.hero_times) || 0) + ans.length;
            pending.closed = true;
            LocalNative.writeRaw(store);
            try { if (ans.length) player.rpc_c_gain_drawcard({ans: ans}); }
            finally {
                var recorder = player.getComponent('AchievementRecorder');
                if (recorder) recorder.achieve_raw = level.player.achieve_raw;
                player.achieve_raw = level.player.achieve_raw;
                LocalNative.shopSync(player, level);
            }
            return true;
        };

        LocalNative.handleShopDismiss = function(player, params) {
            var store = LocalNative.shopTransaction(player), level = store.level;
            var pending = LocalNative.shopState(level).pending, index = Number(params.index);
            if (!pending || pending.closed || !isFinite(index) || index % 1 || index < 0) return false;
            index = pending.displayIndices ? pending.displayIndices[index] : index;
            if (index == null || !pending.cards[index] || pending.cards[index].status !== 'pending') return false;
            var card = pending.cards[index];
            card.status = 'dismissed';
            var spirit = LocalNative.shopPolicy.dismissSpirit[card.tier];
            level.player.spirit += spirit;
            // Keep the session until the stock gain RPC closes it, including all-dismissed sessions.
            LocalNative.writeRaw(store);
            LocalNative.shopSync(player, level);
            if (typeof G_MainController !== 'undefined') G_MainController.setNotice('reincarnate_get_spirit');
            return true;
        };

        LocalNative.shopRollItemEvent = function(level, eventId, rewardPolicy) {
            var cfg = data.item_input[eventId];
            if (!cfg) throw new Error('Missing item input ' + eventId);
            // Some original chain nodes are explicit empty placeholders.
            if (!Number(cfg.item_id) && !(cfg.item_random_chance || []).length) return [];
            if (!rewardPolicy || !rewardPolicy.bypassLimit) {
                var state = LocalNative.shopState(level);
                var counter = state.itemCounters[eventId] || {attempts:0, wins:0, misses:0};
                state.itemCounters[eventId] = counter;
                var limit = cfg.item_random_useLimit || [], window = Number(limit[0]) || 0, cap = Number(limit[1]) || 0;
                if (window && counter.attempts % window === 0) counter.wins = 0;
                counter.attempts++;
                var guarantee = Number(cfg.item_random_security) || 0;
                var win = !window || (counter.wins < cap &&
                    ((guarantee && counter.misses >= guarantee - 1) || Math.random() < cap / window));
                if (!win) { counter.misses++; return []; }
                counter.wins++; counter.misses = 0;
            }
            var typeid = Number(cfg.item_id), num = Number(cfg.item_num);
            if (!typeid) typeid = Number(LocalNative.shopPick(cfg.item_random_chance || []));
            if (!(num > 0)) {
                var range = cfg.item_random_numRange;
                if (!range || range.length !== 2 || range[1] < range[0]) throw new Error('Invalid quantity range');
                num = Number(range[0]) + Math.floor(Math.random() * (Number(range[1]) - Number(range[0]) + 1));
            }
            if (rewardPolicy && rewardPolicy.quantityMultiplier) num *= rewardPolicy.quantityMultiplier;
            return [[19, LocalNative.shopAddItem(level, typeid, num)]];
        };

        LocalNative.shopTreasureRewards = function(level, itemId) {
            var cfg = data.item[itemId], starts = cfg && cfg.item_getAfterUse;
            if (!starts || !starts.length) throw new Error('Missing treasure reward chain');
            var ans = [], seen = {};
            for (var s = 0; s < starts.length; s++) {
                var id = starts[s];
                while (id) {
                    if (seen[id]) throw new Error('Cyclic treasure reward chain');
                    seen[id] = true;
                    var event = data.input_event_client[id];
                    if (!event) throw new Error('Missing treasure event ' + id);
                    var res = event.putin_event_resource || [];
                    if (res.length) {
                        var r = data.resource_input[res[Math.floor(Math.random() * res.length)]];
                        if (!r || !(r.putin_num > 0)) throw new Error('Invalid treasure resource');
                        var type = Number(r.putin_resource_type), amount = Number(r.putin_num);
                        if (type === 1 || type === 2) {
                            var gained = LocalNative.grantPveLoot(type === 2 ? amount : 0, type === 1 ? amount : 0, level);
                            var actual = type === 2 ? gained.gold : gained.wood;
                            if (actual) ans.push([type === 2 ? 3 : 2, actual]);
                        } else if (type === 3 || type === 4) {
                            level.player[type === 3 ? 'diamond' : 'spirit'] += amount;
                            ans.push([type === 3 ? 4 : 11, amount]);
                        } else throw new Error('Unsupported treasure resource ' + type);
                    }
                    var policy = LocalNative.rebirthTreasurePolicy[itemId];
                    var blueprint = policy && policy.blueprints[id];
                    var heroPolicy = LocalNative.heroTreasurePolicy[itemId];
                    var heroChance = heroPolicy && heroPolicy.boostedStages[id];
                    if (heroPolicy && (id === heroPolicy.fragmentStage || heroChance != null)) {
                        var heroItems = event.putin_event_item || [];
                        if (!heroItems.length) throw new Error('Missing hero treasure items ' + id);
                        if (heroChance == null || Math.random() < heroChance) {
                            var heroEventId = heroItems[Math.floor(Math.random() * heroItems.length)];
                            ans = ans.concat(LocalNative.shopRollItemEvent(level, heroEventId,
                                heroChance == null ? {quantityMultiplier:heroPolicy.fragmentMultiplier} : {bypassLimit:true}));
                        }
                    } else if (policy && id === policy.fragmentStage) {
                        for (var f = 0; f < policy.fragments.length; f++) {
                            var roll = policy.fragments[f];
                            if (roll[1] < 1 && Math.random() >= roll[1]) continue;
                            var pool = data.item_input[roll[0]];
                            if (!pool) throw new Error('Missing rebirth fragment pool ' + roll[0]);
                            var fragmentId = Number(LocalNative.shopPick(pool.item_random_chance));
                            var quantity = roll[2] + Math.floor(Math.random() * (roll[3] - roll[2] + 1));
                            ans.push([19, LocalNative.shopAddItem(level, fragmentId, quantity)]);
                        }
                    } else if (blueprint) {
                        if (Math.random() < blueprint[1])
                            ans = ans.concat(LocalNative.shopRollItemEvent(level, blueprint[0]));
                    } else {
                        var items = event.putin_event_item || [];
                        if (items.length) ans = ans.concat(LocalNative.shopRollItemEvent(level,
                            items[Math.floor(Math.random() * items.length)]));
                    }
                    if ((event.putin_event_hero || []).length || (event.putin_event_skill || []).length ||
                        (event.putin_event_exp || []).length || (event.putin_event_slot || []).length)
                        throw new Error('Unsupported treasure reward branch');
                    id = event.putin_event_next;
                }
            }
            return ans;
        };

        LocalNative.handleShopBuyPackage = function(player, params) {
            var id = Number(params.typeid), num = Number(params.num), cfg = data.virtual_item[id];
            if (id < 89 || id > 97 || !cfg || !cfg.item_ID || !isFinite(num) || num % 1 || num < 1 ||
                num > LocalNative.shopPolicy.maxBatch) throw new Error('Invalid treasure purchase');
            var store = LocalNative.shopTransaction(player);
            var period = data.period_control[cfg.circle_round];
            if (period && period.num_limit) {
                var counters = store.level.player.event_counters || (store.level.player.event_counters = {});
                var group = counters[period.period_type] || (counters[period.period_type] = {});
                var counter = group[cfg.circle_round] || {c:0};
                var count = Math.max(Number(counter.c) || 0,
                    Number(counter.clientData && counter.clientData._eventCount) || 0);
                if (count + num > period.num_limit) throw new Error('Treasure daily purchase limit');
                group[cfg.circle_round] = {c:count + num,t:Math.floor(Date.now()/1000),
                    clientData:{_eventCount:count + num}};
            }
            var items = LocalNative.shopAddItem(store.level, cfg.item_ID, num);
            LocalNative.writeRaw(store);
            try { player.rpc_c_buy_package_ans({success: true, items: items}); }
            finally { LocalNative.shopSync(player, store.level); }
            return true;
        };

        // Stock AlchemySkillAttribute.getSkillIdByItemId.
        LocalNative.resolveSkillBookReplaceId = function(typeid) {
            var cfg = data.item && data.item[typeid];
            var eventId = cfg && cfg.item_getAfterUse && cfg.item_getAfterUse[0];
            var event = eventId && data.input_event_client && data.input_event_client[eventId];
            var skillEventId = event && event.putin_event_skill && event.putin_event_skill[0];
            var skillEvent = skillEventId && data.skill_input && data.skill_input[skillEventId];
            var sid = skillEvent && Number(skillEvent.replace_skill);
            return sid > 0 ? sid : 0;
        };

        LocalNative.isSkillEnforceBook = function(typeid) {
            var cfg = data.item && data.item[typeid];
            var eventId = cfg && cfg.item_getAfterUse && cfg.item_getAfterUse[0];
            var event = eventId && data.input_event_client && data.input_event_client[eventId];
            var skillEventId = event && event.putin_event_skill && event.putin_event_skill[0];
            var skillEvent = skillEventId && data.skill_input && data.skill_input[skillEventId];
            return !!(skillEvent && Number(skillEvent.upgrade_skill) > 0 &&
                !(Number(skillEvent.replace_skill) > 0));
        };

        LocalNative.applySkillBookUse = function(level, typeid, useParams) {
            var heroId = useParams && useParams.hero_id;
            var slotIndex = Number(useParams && useParams.slot_index);
            if (heroId == null || !isFinite(slotIndex) || slotIndex % 1 || slotIndex < 0)
                throw new Error('Invalid skill book target');
            var hero = null;
            for (var i = 0; i < (level.heros || []).length; i++) {
                if (String(level.heros[i].sid) === String(heroId)) { hero = level.heros[i]; break; }
            }
            if (!hero) throw new Error('Missing skill book hero');
            LocalNative.ensureHeroSkill(hero);
            var slots = hero.skill_slots || [];
            if (slotIndex >= slots.length || !slots[slotIndex])
                throw new Error('Missing skill slot');
            var replaceId = LocalNative.resolveSkillBookReplaceId(typeid);
            if (replaceId) {
                var row = data.skill_to_hero && data.skill_to_hero[replaceId];
                var family = Math.floor(Number(hero.typeid) / 100);
                if (row && Number(row.to_hero_id) > 0 && Number(row.to_hero_id) !== family)
                    throw new Error('Skill book hero mismatch');
                slots[slotIndex].sid = replaceId;
                if (!(Number(slots[slotIndex].lv) > 0)) slots[slotIndex].lv = 1;
                if (slots[slotIndex].exp == null || !isFinite(Number(slots[slotIndex].exp)))
                    slots[slotIndex].exp = 0;
                hero.skill_id = replaceId * 100 + Number(slots[slotIndex].lv);
                return [[7, {operation: 'replace', hero_id: heroId, slot_index: slotIndex,
                    skill_id: replaceId}]];
            }
            if (LocalNative.isSkillEnforceBook(typeid)) {
                var slot = slots[slotIndex];
                var lv = Math.max(1, Number(slot.lv) || 1);
                var exp = Math.max(0, Number(slot.exp) || 0);
                var need = Number(data.skill_lv_client && data.skill_lv_client[lv] &&
                    data.skill_lv_client[lv].skill_exp) || 1;
                var succeed = true;
                if (exp + 1 < need) slot.exp = exp + 1;
                else {
                    slot.exp = 0;
                    slot.lv = lv + 1;
                }
                hero.skill_id = Number(slot.sid) * 100 + Number(slot.lv);
                return [[7, {operation: 'enforce', hero_id: heroId, slot_index: slotIndex,
                    succeed: succeed}]];
            }
            throw new Error('Unsupported skill item');
        };

        // Stock HeroFeed.doHeroFeed → useItemByTypeid({sid,targetTypeId,itemid}).
        // Missing ans leaves LOCK_ID_FEED_HERO set so later clicks do nothing.
        LocalNative.isHeroFeedUse = function(typeid, useParams) {
            if (useParams && useParams.sid != null && useParams.itemid != null) return true;
            var feedIds = {
                1107: 1, 1108: 1, 1109: 1, 1110: 1, 1111: 1, 1112: 1,
                1119: 1, 1120: 1, 1121: 1, 210021: 1, 210022: 1,
                7222: 1, 7223: 1, 7224: 1, 7225: 1
            };
            return !!feedIds[Number(typeid)];
        };

        LocalNative.findHeroRecord = function(level, sid) {
            for (var i = 0; i < (level.heros || []).length; i++) {
                if (String(level.heros[i].sid) === String(sid)) return level.heros[i];
            }
            return null;
        };

        LocalNative.pickMutateId = function(typeid) {
            var cfg = data.item && data.item[typeid];
            var want = Number(cfg && cfg.item_level) || 1;
            var pool = [], effects = data.mutate_effect || {};
            for (var id in effects) {
                if (Number(effects[id].mutate_level) === want) pool.push(Number(id));
            }
            if (!pool.length) {
                for (var any in effects) pool.push(Number(any));
            }
            if (!pool.length) throw new Error('Missing mutate_effect pool');
            return pool[Math.floor(Math.random() * pool.length)];
        };

        LocalNative.pickFeedSlotSkill = function(hero) {
            var family = Math.floor(Number(hero.typeid) / 100);
            var mapping = data.hero_to_skill && data.hero_to_skill[family];
            var candidates = (mapping && mapping.skill_id) || [], owned = {}, pool = [];
            var slots = hero.skill_slots || [];
            for (var s = 0; s < slots.length; s++) owned[Number(slots[s].sid)] = true;
            for (var i = 0; i < candidates.length; i++) {
                var sid = Number(candidates[i]);
                var row = data.skill_to_hero && data.skill_to_hero[sid];
                if (owned[sid] || !row || Number(row.to_hero_id) !== family) continue;
                if (!(Number(row.skill_weight_1) > 0) || !data.skill_data[sid * 100 + 1]) continue;
                pool.push(sid);
            }
            if (!pool.length) return 0;
            return pool[Math.floor(Math.random() * pool.length)];
        };

        LocalNative.applyHeroFeedUse = function(level, typeid, useParams, num) {
            var sid = useParams && useParams.sid;
            var itemid = Number((useParams && useParams.itemid) != null ? useParams.itemid : typeid);
            if (sid == null) throw new Error('Missing feed hero');
            var hero = LocalNative.findHeroRecord(level, sid);
            if (!hero) throw new Error('Missing feed hero record');
            var cfg = data.item && data.item[typeid];
            var eventId = cfg && cfg.item_getAfterUse && cfg.item_getAfterUse[0];
            var event = eventId && data.input_event_client && data.input_event_client[eventId];
            if (!event) throw new Error('Missing feed item event');
            var ans = [], times = Math.max(1, Number(num) || 1), e, r;

            var exps = event.putin_event_exp || [];
            if (exps.length) {
                var total = 0;
                for (e = 0; e < exps.length; e++) {
                    var expCfg = data.exp_input && data.exp_input[exps[e]];
                    if (!expCfg || Number(expCfg.putin_resource_type) !== 7)
                        throw new Error('Unsupported feed exp input');
                    total += Number(expCfg.putin_num) || 0;
                }
                total *= times;
                if (!(total > 0)) throw new Error('Empty feed exp');
                LocalNative.normalizeHeroExperience(level, hero, total);
                ans.push([24, {exp_num: total, sid: sid, itemid: itemid}]);
                return ans;
            }

            var resources = event.putin_event_resource || [];
            if (resources.length) {
                var reduce = 0;
                for (r = 0; r < resources.length; r++) {
                    var resCfg = data.resource_input && data.resource_input[resources[r]];
                    if (!resCfg || Number(resCfg.putin_resource_type) !== 10)
                        throw new Error('Unsupported feed resource input');
                    reduce += Number(resCfg.putin_num) || 0;
                }
                reduce *= times;
                if (!(reduce > 0)) throw new Error('Empty feed recover time');
                ans.push([22, {reduce_time: reduce, sid: sid, itemid: itemid}]);
                return ans;
            }

            // Rune stones and skill fruits both use putin_event_slot. Stock
            // HeroEquipment persists opened slots as eqp (including null slots).
            if (typeid >= 7222 && typeid <= 7225) {
                var openSlot = typeid - 7221;
                var equipment = hero.eqp;
                if (!Array.isArray(equipment)) {
                    var oldEquipment = equipment || {};
                    equipment = [];
                    for (var key in oldEquipment) equipment.push(oldEquipment[key]);
                    if (!equipment.length) equipment.push(null);
                }
                if (times !== 1 || equipment.length !== openSlot)
                    throw new Error('Equipment slot must be opened once and in order');
                hero.eqp = equipment.concat([null]);
                ans.push([31, {itemid: itemid, hero_id: sid, slot: openSlot}]);
                return ans;
            }

            if (typeid === 210021 || typeid === 210022) {
                LocalNative.ensureHeroSkill(hero);
                if ((hero.skill_slots || []).length >= 3) throw new Error('Skill slots full');
                var newSid = LocalNative.pickFeedSlotSkill(hero);
                hero.skill_slots.push({sid: newSid, lv: 1, exp: 0});
                ans.push([8, {itemid: itemid, hero_id: sid, skill_id: newSid}]);
                return ans;
            }

            if (typeid === 1119 || typeid === 1120 || typeid === 1121) {
                // Client tables leave mutate events empty; pick by fruit item_level.
                var mutateId = LocalNative.pickMutateId(typeid);
                hero.mutateid = hero.unit_mutateid = mutateId;
                ans.push([25, {unit_mutateid: mutateId, sid: sid, itemid: itemid}]);
                return ans;
            }

            throw new Error('Unsupported feed item ' + typeid);
        };

        LocalNative.unlockHeroFeedIfNeeded = function(params) {
            try {
                var useParams = params && params.params;
                if (!useParams || useParams.sid == null) return;
                if (typeof DA !== 'undefined' && typeof DA.unlock === 'function' &&
                    typeof LOCK_ID_FEED_HERO !== 'undefined')
                    DA.unlock(LOCK_ID_FEED_HERO);
            } catch (eUnlock) {}
        };

        LocalNative.applyBuildTimeUse = function(level, typeid, params, num) {
            if (GS_CURRENT_STAGE !== GS_STAGE_BUILD || params.sid == null)
                throw new Error('Building acceleration requires a home building');
            var unit = G_UnitManager.getUnitBySID(params.sid);
            var bb = unit && LocalNative.getBuildingBuilder(unit);
            if (!bb || bb.state !== BUILD_STATE_BUILDING ||
                !isFinite(bb.beginTime) || !(bb.buildTime > 0))
                throw new Error('Building is not under construction');
            var now = DA.getSystemCurrentTimeSec();
            if (bb.beginTime + bb.buildTime <= now)
                throw new Error('Building has already finished');
            var cfg = data.item[typeid], events = cfg && cfg.item_getAfterUse;
            var reduce = 0;
            for (var i = 0; events && i < events.length; i++) {
                var event = data.input_event_client[events[i]];
                var resources = event && event.putin_event_resource;
                for (var j = 0; resources && j < resources.length; j++) {
                    var res = data.resource_input[resources[j]];
                    if (!res || Number(res.putin_resource_type) !== 11 || !(res.putin_num > 0))
                        throw new Error('Invalid building time input');
                    reduce += Number(res.putin_num);
                }
            }
            reduce *= num;
            if (!(reduce > 0) || !isFinite(reduce)) throw new Error('Missing building time input');
            var record = null;
            for (i = 0; i < level.units.length; i++)
                if (String(level.units[i].sid) === String(unit.sid)) record = level.units[i];
            if (!record) throw new Error('Building missing from save');
            // Commit the reduced clock with the inventory debit before the stock award runs.
            record.bt = record.beginTime = Number(bb.beginTime) - reduce;
            return [[23, {reduce_time: reduce, sid: unit.sid, itemid: typeid}]];
        };

        LocalNative.scheduleAcceleratedBuild = function(player, sid) {
            var unit = G_UnitManager.getUnitBySID(sid);
            var bb = unit && LocalNative.getBuildingBuilder(unit);
            if (!bb || bb.state !== BUILD_STATE_BUILDING) return;
            var begin = bb.beginTime;
            var ticket = LocalNative.pendingBuilds[sid];
            var remaining = Math.max(0, Math.ceil(begin + bb.buildTime - DA.getSystemCurrentTimeSec()));
            LocalNative.scheduleOnRoot(function() {
                if (GS_CURRENT_STAGE !== GS_STAGE_BUILD ||
                    G_UnitManager.getUnitBySID(sid) !== unit ||
                    LocalNative.getBuildingBuilder(unit) !== bb ||
                    bb.state !== BUILD_STATE_BUILDING || bb.beginTime !== begin ||
                    LocalNative.pendingBuilds[sid] !== ticket) return;
                if (bb.beginTime + bb.buildTime > DA.getSystemCurrentTimeSec()) return;
                LocalNative.ackBuildComplete(player, sid, 'build-time-item');
            }, remaining);
        };

        LocalNative.handleShopUseItem = function(player, params) {
            var names = ['material', 'based_prop', 'advanced_prop', 'formula'];
            var pkgid = Number(params.pkgid), num = Number(params.num);
            if (!isFinite(pkgid) || pkgid % 1 || pkgid < 0 || pkgid > 3 ||
                !isFinite(num) || num % 1 || num < 1) throw new Error('Invalid item use');
            var store = LocalNative.shopTransaction(player), level = store.level;
            var pkg = level.player['package'] && level.player['package'][names[pkgid]];
            var item = pkg && pkg.item_dict[params.oid];
            if (!item) {
                for (var p = 0; p < names.length && !item; p++) {
                    var bag = level.player['package'] && level.player['package'][names[p]];
                    if (bag && bag.item_dict && bag.item_dict[params.oid]) {
                        pkg = bag; item = bag.item_dict[params.oid]; pkgid = p;
                    }
                }
            }
            if (!item || item.num < num) throw new Error('Insufficient treasure items');
            var typeid = Number(item.typeid), state = LocalNative.shopState(level);
            var spiritFragment = typeid === 1101;
            var maxUse = spiritFragment ? Number(data.item[typeid].item_overlap) : LocalNative.shopPolicy.maxBatch;
            if (!(num <= maxUse)) throw new Error('Invalid item use');
            var useParams = params.params || {};
            var egg = typeid === 1124;
            var skillReplace = LocalNative.resolveSkillBookReplaceId(typeid);
            var skillEnforce = LocalNative.isSkillEnforceBook(typeid);
            var feed = LocalNative.isHeroFeedUse(typeid, useParams);
            var buildTimeItem = typeid === 1113 || typeid === 1114 || typeid === 1115;
            if (!spiritFragment && !egg && !skillReplace && !skillEnforce && !feed && !buildTimeItem &&
                (typeid < 1501 || typeid > 1509))
                return false;
            if ((egg || skillReplace || skillEnforce) && num !== 1)
                throw new Error('Skill and egg items must be used one at a time');
            if (feed && (num < 1 || num > LocalNative.shopPolicy.maxBatch))
                throw new Error('Invalid feed quantity');
            if (egg && state.pending && !state.pending.closed)
                throw new Error('Claim the current egg first');
            var ans = [];
            if (spiritFragment) {
                // Use the stock deterministic chain once, then aggregate the batch award.
                var rewards = LocalNative.shopTreasureRewards(level, typeid);
                if (rewards.length !== 1 || rewards[0][0] !== 11 || !(rewards[0][1] > 0))
                    throw new Error('Invalid spirit fragment reward');
                var spiritPerItem = rewards[0][1];
                level.player.spirit += spiritPerItem * (num - 1);
                ans = [[11, spiritPerItem * num]];
            }
            else if (egg) state.pending = {id: ++state.sequence, itemId: typeid,
                cards: LocalNative.shopRollHeroes(level, 1), closed: false};
            else if (skillReplace || skillEnforce)
                ans = LocalNative.applySkillBookUse(level, typeid, useParams);
            else if (feed)
                ans = LocalNative.applyHeroFeedUse(level, typeid, useParams, num);
            else if (buildTimeItem)
                ans = LocalNative.applyBuildTimeUse(level, typeid, useParams, num);
            else for (var i = 0; i < num; i++) ans = ans.concat(LocalNative.shopTreasureRewards(level, typeid));
            item.num -= num;
            if (!item.num) delete pkg.item_dict[params.oid];
            LocalNative.writeRaw(store);
            try { player.rpc_c_use_item_ans({item: {pkgid:pkgid,oid:params.oid,num:num}, ans:ans}); }
            finally { LocalNative.shopSync(player, level); }
            if (buildTimeItem) LocalNative.scheduleAcceleratedBuild(player, useParams.sid);
            if (egg) LocalNative.shopShowPending(player, level);
            return true;
        };

        LocalNative.handleComposeItem = function(player, params) {
            var id = Number(params.product_id), cfg = data.item[id];
            var recipe = cfg && cfg.item_composition, events = cfg && cfg.item_composition_get;
            if (!recipe || !recipe.length || !events || events.length !== 1)
                throw new Error('Unsupported item recipe');
            var event = data.input_event_client[events[0]];
            var rewardIds = event && event.putin_event_item;
            var reward = rewardIds && rewardIds.length === 1 && data.item_input[rewardIds[0]];
            var heroIds = event && event.putin_event_hero || [];
            var heroReward = heroIds.length === 1 && data.hero_input_client && data.hero_input_client[heroIds[0]];
            var heroPool = heroReward && heroReward.putin_team1 || [];
            var fixedHero = heroPool.length === 1 && data.unit_main[heroPool[0]] &&
                !(heroReward.putin_team2 || []).length && !(heroReward.putin_team3 || []).length &&
                !(heroReward.putin_team4 || []).length && Number(heroReward.lv) === 1;
            var itemReward = reward && Number(reward.item_id) === id && Number(reward.item_num) === 1 &&
                !(reward.item_random_chance || []).length && !heroIds.length;
            if (!event || !(itemReward || (fixedHero && !(rewardIds || []).length)) || event.putin_event_next ||
                (event.putin_event_resource || []).length ||
                (event.putin_event_skill || []).length || (event.putin_event_exp || []).length ||
                (event.putin_event_slot || []).length)
                throw new Error('Unsupported compose reward');
            var requested = params.mtr_list;
            if (!Array.isArray(requested) || requested.length !== recipe.length)
                throw new Error('Invalid compose materials');
            var needs = {}, supplied = {};
            for (var i = 0; i < recipe.length; i++) {
                var type = Number(recipe[i][0]), num = Number(recipe[i][1]);
                if (!data.item[type] || !(num > 0) || num % 1)
                    throw new Error('Invalid compose recipe');
                needs[type] = (needs[type] || 0) + num;
                var input = requested[i], amount = input && Number(input.num);
                if (!input || !(amount > 0) || amount % 1 || !isFinite(amount))
                    throw new Error('Invalid compose quantity');
                supplied[input.typeid] = (supplied[input.typeid] || 0) + amount;
            }
            if (Object.keys(needs).length !== Object.keys(supplied).length)
                throw new Error('Invalid compose material types');
            var store = LocalNative.shopTransaction(player), level = store.level;
            var names = ['material', 'based_prop', 'advanced_prop', 'formula'];
            for (var key in needs) {
                if (needs[key] !== supplied[key]) throw new Error('Compose recipe mismatch');
                var remaining = needs[key];
                for (var p = 0; p < names.length; p++) {
                    var bag = level.player['package'][names[p]];
                    if (!bag) continue;
                    for (var oid in bag.item_dict) {
                        var item = bag.item_dict[oid];
                        if (Number(item.typeid) !== Number(key)) continue;
                        var take = Math.min(remaining, Number(item.num));
                        item.num -= take; remaining -= take;
                        if (!item.num) delete bag.item_dict[oid];
                        if (!remaining) break;
                    }
                    bag.new_items = 0;
                    for (var left in bag.item_dict) if (bag.item_dict[left].is_new) bag.new_items++;
                    if (!remaining) break;
                }
                if (remaining) throw new Error('Insufficient compose materials');
            }
            // Stock inputAward grants the product. Expose consumed materials first so
            // HeroReincarnation refreshes the correct counts during the stock answer.
            var consumed = JSON.parse(JSON.stringify(level.player['package']));
            var ans;
            if (itemReward) ans = [[19, LocalNative.shopAddItem(level, id, 1)]];
            else {
                var roster = level.heros || (level.heros = []);
                var hero = LocalNative.defaultStarterHero(), state = LocalNative.shopState(level);
                hero.id = hero.sid = 'local_compose_hero_' + (++state.sequence);
                hero.typeid = hero.hero_id = Number(heroPool[0]);
                hero.unit_type = Math.floor(hero.typeid / 100); hero.unit_level = hero.typeid % 100;
                hero.lv = hero.level = 1; hero.xp = 0; hero.state = 0; hero.aidx = -1;
                hero.unit_mutateid = hero.mutateid = 0;
                hero.rct = hero.aht = Math.floor(Date.now() / 1000);
                hero.skill_id = heroReward.putin_skill; hero.skill_slots = [];
                LocalNative.ensureHeroSkill(hero, heroReward.putin_skill);
                delete hero.life; delete hero.health;
                var hm = player.getComponent('HeroManager');
                var capacity = Math.max(Number(level.player.hero_slot_num) || 0, hm ? hm.getHeroCapacity() : 0);
                hero.hero_slot = Math.max(0, roster.length + 1 - capacity);
                level.player.hero_slot_num = capacity + hero.hero_slot;
                roster.push(hero);
                LocalNative.ensurePlayerSocialFields(level.player);
                level.player.achieve_raw.hero_times = (Number(level.player.achieve_raw.hero_times) || 0) + 1;
                ans = [[29, hero]];
            }
            LocalNative.writeRaw(store);
            try {
                player.getComponent('PackageManager').init({'package': consumed});
                player.rpc_c_compose_item_ans2({ans: ans, mtr_ans: []});
            } finally {
                if (!itemReward) {
                    var recorder = player.getComponent('AchievementRecorder');
                    if (recorder) recorder.achieve_raw = level.player.achieve_raw;
                    player.achieve_raw = level.player.achieve_raw;
                }
                LocalNative.shopSync(player, level);
            }
            return true;
        };

        LocalNative.generateComposedRune = function(id) {
            // User-authorized local policy: equal candidate odds, one attribute
            // per stock layer; exclusive hero attributes are not generated.
            var cfg = data.item[id], eventIds = cfg && cfg.item_composition_get;
            var event = eventIds && eventIds.length === 1 && data.input_event_client[eventIds[0]];
            var inputs = event && event.putin_event_item || [], candidates = [];
            for (var i = 0; i < inputs.length; i++) {
                var input = data.item_input[inputs[i]], target = input && data.item[input.item_id];
                if (!target || !target.rune_type || Number(input.item_num) !== 1 ||
                    Number(target.item_form) !== Number(cfg.item_form) ||
                    Number(target.item_level) !== Number(cfg.item_level))
                    throw new Error('Invalid rune reward table');
                candidates.push(Number(input.item_id));
            }
            if (candidates.length !== 3) throw new Error('Missing rune reward candidates');
            var result = {typeid: candidates[Math.floor(Math.random() * candidates.length)], hero_attr: 0};
            var layers = {base_attr: 'att_basic_color', two_attr: 'att_evolve2_color', three_attr: 'att_evolve3_color'};
            for (var layer in layers) {
                var pool = [];
                for (var key in data.equipment_attribute) {
                    var attr = data.equipment_attribute[key];
                    if (attr.attr_name && Number(attr[layers[layer]]) > 0) pool.push(Number(key));
                }
                if (!pool.length) throw new Error('Missing rune attribute pool');
                result[layer] = [pool[Math.floor(Math.random() * pool.length)]];
            }
            return result;
        };

        LocalNative.handleComposeEquipment = function(player, params) {
            var id = Number(params.equip_id), cfg = data.item[id];
            var recipe = cfg && cfg.item_composition;
            if (!cfg || cfg.rune_type || Number(cfg.item_subID) !== 9 || !recipe || recipe.length !== 3)
                throw new Error('Invalid rune recipe');
            var store = LocalNative.shopTransaction(player), level = store.level;
            var needs = {};
            function pieces(input, category, pointsNeeded) {
                if (!input || typeof input !== 'object' || Array.isArray(input))
                    throw new Error('Invalid rune pieces');
                var points = 0;
                for (var key in input) {
                    var amount = Number(input[key]), item = data.item[key];
                    if (!item || Number(item.item_subID) !== category ||
                        !isFinite(amount) || amount < 1 || amount % 1)
                        throw new Error('Invalid rune piece quantity or type');
                    var point = category === 11 && Number(item.item_level) === 2 ? 3 : 1;
                    points += point * amount;
                    needs[key] = (needs[key] || 0) + amount;
                }
                if (points < Number(pointsNeeded)) throw new Error('Insufficient rune piece points');
            }
            pieces(params.hero_pieces, 7, recipe[0][1]);
            pieces(params.prop_pieces, 11, recipe[1][1]);
            needs[recipe[2][0]] = Number(recipe[2][1]);
            var names = ['material', 'based_prop', 'advanced_prop', 'formula'];
            for (var type in needs) {
                var remaining = needs[type];
                for (var p = 0; p < names.length && remaining; p++) {
                    var bag = level.player['package'][names[p]];
                    if (!bag) continue;
                    for (var oid in bag.item_dict) {
                        var item = bag.item_dict[oid];
                        if (Number(item.typeid) !== Number(type)) continue;
                        var take = Math.min(remaining, Number(item.num));
                        item.num -= take; remaining -= take;
                        if (!item.num) delete bag.item_dict[oid];
                        if (!remaining) break;
                    }
                    bag.new_items = 0;
                    for (var left in bag.item_dict) if (bag.item_dict[left].is_new) bag.new_items++;
                }
                if (remaining) throw new Error('Insufficient rune materials');
            }
            var rune = LocalNative.generateComposedRune(id);
            var consumed = JSON.parse(JSON.stringify(level.player['package']));
            var deltas = LocalNative.shopAddItem(level, rune.typeid, 1);
            if (deltas.length !== 1) throw new Error('Invalid rune award');
            var award = deltas[0];
            for (var field in rune) award[field] = rune[field];
            var record = level.player['package'].advanced_prop.item_dict[award.oid];
            for (var field in rune) record[field] = rune[field];
            LocalNative.writeRaw(store);
            try {
                player.getComponent('PackageManager').init({'package': consumed});
                player.rpc_c_compose_equipment_ans({ans: [[19, [award]]]});
            } finally { LocalNative.shopSync(player, level); }
            return true;
        };

        LocalNative.unlockCompose = function() {
            if (typeof G_UIManager === 'undefined' || typeof UI === 'undefined' || !UI.AlchemyCompound)
                return;
            if (G_UIManager.isUIOpen(UI.AlchemyCompound.UIID)) {
                var ui = G_UIManager.get_ui(UI.AlchemyCompound.UIID);
                ui.playing = false;
                ui.refreshButtonGray();
            }
        };

        LocalNative.runShopRequest = function(player, method, params) {
            try {
                var fn = {rpc_s_drawcard: 'handleShopDraw', rpc_s_gain_drawcard: 'handleShopGain',
                    rpc_s_dismiss_drawcard: 'handleShopDismiss', rpc_s_buy_package: 'handleShopBuyPackage',
                    rpc_s_use_item: 'handleShopUseItem', rpc_s_buy_package_slot: 'handleBuyPackageSlot',
                    rpc_s_compose_item_inputevent: 'handleComposeItem',
                    rpc_s_compose_equipment: 'handleComposeEquipment'}[method];
                var result = LocalNative[fn](player, params || {});
                LocalNative.writeStatus({step: 'shop-rpc', method: method, ok: !!result});
                if (!result) LocalNative.unlockHeroFeedIfNeeded(params);
                return result;
            } catch (eShop) {
                // Restore optimistic stock debits/counters when the transaction failed.
                LocalNative.shopSync(player, LocalNative.readRaw().level);
                LocalNative.unlockHeroFeedIfNeeded(params);
                if (method === 'rpc_s_compose_item_inputevent' || method === 'rpc_s_compose_equipment')
                    LocalNative.unlockCompose();
                LocalNative.writeStatus({step: 'shop-rpc-ERR', method: method, error: String(eShop)});
                if (typeof G_MainController !== 'undefined') G_MainController.setNotice(String(eShop));
                return false;
            }
        };

        // Stock Trader UI and currency exchange; only the unavailable server is replaced.
        LocalNative.traderPolicy = {version: 1, interval: 28800, size: 8, refreshPrice: 80, coin: 1123,
            runeFragmentWeightMultiplier: 3};

        LocalNative.installTraderPolicy = function() {
            if (data.itemshop && data.itemshop[1])
                data.itemshop[1].refresh_price = LocalNative.traderPolicy.refreshPrice;
            // Local sale IDs; stock item definitions provide icons, names and use.
            data.itemshop_sell[134] = {item_id: 210021, item_num: 1, price_kind: 3,
                price_num: 1200, weight: 0, replication: 1, discount_weight: [[1, 100]]};
            data.itemshop_sell[135] = {item_id: 210022, item_num: 1, price_kind: 3,
                price_num: 6000, weight: 0, replication: 1, discount_weight: [[1, 100]]};
        };

        LocalNative.pickTraderOfferIds = function(pool) {
            pool = pool.slice();
            var result = [];
            while (result.length < LocalNative.traderPolicy.size && pool.length) {
                var id = LocalNative.shopPick(pool);
                result.push(id);
                for (var i = pool.length - 1; i >= 0; i--)
                    if (pool[i][0] === id) pool.splice(i, 1);
            }
            return result;
        };

        LocalNative.ensureTrader = function(level, force) {
            LocalNative.installTraderPolicy();
            var now = Math.floor(Date.now() / 1000), bucket = Math.floor(now / LocalNative.traderPolicy.interval);
            var state = level.localTrader;
            if (state && state.version !== 1) throw new Error('Unsupported trader save version');
            var changed = !state || state.bucket !== bucket || force;
            if (changed) {
                state = {version: 1, bucket: bucket, items: [], discounts: {}};
                var pool = [], cfg, id;
                for (id in data.itemshop_sell) {
                    cfg = data.itemshop_sell[id];
                    // Mutation fruits now use the same explicit gate as primary
                    // unlock fruit, rather than competing at tiny stock weights.
                    if (Number(cfg.item_id) >= 1119 && Number(cfg.item_id) <= 1121) continue;
                    if (cfg.weight > 0 && cfg.price_num > 0 && cfg.item_num > 0 && data.item[cfg.item_id]) {
                        var weight = Number(cfg.weight);
                        // User-requested local boost for rune unlock stone fragments.
                        if (Number(cfg.item_id) === 7221)
                            weight *= LocalNative.traderPolicy.runeFragmentWeightMultiplier;
                        pool.push([Number(id), weight]);
                    }
                }
                var selected = LocalNative.pickTraderOfferIds(pool);
                // Use independent baseline samples as exact reference events.
                // If rune inclusion is p, fruit inclusion is p/3 and p/6.
                // Merely dividing weights would not give these per-refresh ratios.
                var fruits = [[134, 3], [135, 6], [25, 3], [26, 3], [27, 3]];
                for (var f = 0; f < fruits.length; f++) {
                    var reference = LocalNative.pickTraderOfferIds(pool), hasRune = false;
                    for (var r = 0; r < reference.length; r++)
                        if (Number(data.itemshop_sell[reference[r]].item_id) === 7221) hasRune = true;
                    if (hasRune && Math.random() < 1 / fruits[f][1]) {
                        for (var slot = selected.length - 1; slot >= 0; slot--) {
                            var itemId = Number(data.itemshop_sell[selected[slot]].item_id);
                            if (itemId !== 7221 && selected[slot] !== 134 && selected[slot] !== 135 &&
                                selected[slot] !== 25 && selected[slot] !== 26 && selected[slot] !== 27) {
                                selected[slot] = fruits[f][0];
                                break;
                            }
                        }
                    }
                }
                for (var s = 0; s < selected.length; s++) {
                    id = selected[s];
                    cfg = data.itemshop_sell[id];
                    state.items.push([id, 1]); // Stock TRADER_STATUS_READY.
                    state.discounts[id] = LocalNative.shopPick(cfg.discount_weight || [[1, 1]]);
                }
                level.localTrader = state;
            }
            var counters = level.player.event_counters || (level.player.event_counters = {});
            var shopGroup = data.period_control[2020].period_type;
            var discountGroup = data.period_control[8800].period_type;
            if (!counters[shopGroup]) counters[shopGroup] = {};
            if (!counters[discountGroup]) counters[discountGroup] = {};
            counters[shopGroup][2020] = {c: 1, t: now, d: {items: JSON.parse(JSON.stringify(state.items))}};
            counters[discountGroup][8800] = {c: 1, t: now, d: {discounts: state.discounts}};
            level.player.last_update_time = now;
            return changed;
        };

        LocalNative.syncTrader = function(player, level) {
            LocalNative.shopSync(player, level);
            if (!player.rpc_c_refresh_daily_event) return;
            for (var i = 0; i < 2; i++) {
                var id = i ? 8800 : 2020;
                var counter = level.player.event_counters &&
                    level.player.event_counters[data.period_control[id].period_type] &&
                    level.player.event_counters[data.period_control[id].period_type][id];
                if (counter) player.rpc_c_refresh_daily_event({event_id: id,
                    last_update_time: level.player.last_update_time,
                    event_counter: JSON.parse(JSON.stringify(counter))});
            }
        };

        LocalNative.traderItemCount = function(level, typeid) {
            var pkg = level.player['package'] || {}, count = 0;
            for (var name in pkg) {
                var items = pkg[name].item_dict || {};
                for (var oid in items) if (Number(items[oid].typeid) === Number(typeid))
                    count += Number(items[oid].num) || 0;
            }
            return count;
        };

        LocalNative.traderCheckItemDebit = function(before, after, typeid, num) {
            var oldCount = LocalNative.traderItemCount(before, typeid);
            if (!(num > 0) || num % 1 || oldCount < num ||
                LocalNative.traderItemCount(after, typeid) !== oldCount - num)
                throw new Error('Trader item debit mismatch: ' + typeid);
        };

        LocalNative.traderEventItems = function(level, cfg, num) {
            var event = cfg.input_event && data.input_event_client[cfg.input_event];
            // Later coin-shop rows have no input_event: the displayed item is the reward.
            if (!event) return LocalNative.shopAddItem(level, cfg.item_id, num);
            if (event.putin_event_next || (event.putin_event_resource || []).length ||
                (event.putin_event_hero || []).length || (event.putin_event_skill || []).length)
                throw new Error('Unsupported trader reward event');
            var result = [], events = event.putin_event_item || [];
            if (!events.length) throw new Error('Empty trader reward');
            for (var i = 0; i < events.length; i++) {
                var item = data.item_input[events[i]];
                if (!item || !(item.item_id > 0) || !(item.item_num > 0))
                    throw new Error('Invalid trader reward quantity');
                result = result.concat(LocalNative.shopAddItem(level, item.item_id, item.item_num * num));
            }
            return result;
        };

        LocalNative.runTraderRequest = function(player, method, params) {
            params = params || {};
            var committed = false;
            try {
                var before = LocalNative.readRaw().level;
                var store = LocalNative.shopTransaction(player), level = store.level;
                var state = level.localTrader, cfg, items = [], ans, num, id;
                var nowBucket = Math.floor(Date.now() / 1000 / LocalNative.traderPolicy.interval);
                if (method === 'rpc_s_refresh_trader' || method === 'rpc_s_reset_trader') {
                    if (Number(params.trader_id) !== 1) throw new Error('Unsupported trader page');
                    if (method === 'rpc_s_reset_trader') {
                        if (before.player.diamond < LocalNative.traderPolicy.refreshPrice ||
                            level.player.diamond !== before.player.diamond - LocalNative.traderPolicy.refreshPrice)
                            throw new Error('Trader refresh debit mismatch');
                    }
                    LocalNative.ensureTrader(level, method === 'rpc_s_reset_trader');
                } else if (method === 'rpc_s_trader_buy') {
                    id = Number(params.sale_id); num = Number(params.buy_num);
                    var index = Number(params.sale_index);
                    if (Number(params.trader_id) !== 1 || !state || state.bucket !== nowBucket ||
                        index % 1 || index < 0 || index >= state.items.length || num !== 1 ||
                        state.items[index][0] !== id || state.items[index][1] !== 1)
                        throw new Error('Trader offer expired or already sold');
                    cfg = data.itemshop_sell[id];
                    var cost = Math.max(1, Math.ceil(cfg.price_num * state.discounts[id]));
                    var rm = player.getComponent('ResourceManager');
                    if (!isFinite(rm.Res[cfg.price_kind]) || rm.Res[cfg.price_kind] < 0)
                        throw new Error('Invalid trader wallet');
                    if (cfg.price_kind === 3 && (before.player.diamond < cost ||
                        level.player.diamond !== before.player.diamond - cost))
                        throw new Error('Trader purchase debit mismatch');
                    items = LocalNative.traderEventItems(level, cfg, 1);
                    state.items[index][1] = 0; // Stock TRADER_STATUS_EMPTY.
                    LocalNative.ensureTrader(level, false);
                    ans = 'rpc_c_trader_buy_ans';
                } else if (method === 'rpc_s_coin_exchange') {
                    if (!(params.items instanceof Array) || !params.items.length || params.items.length > 100)
                        throw new Error('Invalid trader recycle selection');
                    var total = 0, seen = {};
                    for (var n = 0; n < params.items.length; n++) {
                        var pair = params.items[n];
                        if (!(pair instanceof Array) || pair.length !== 2) throw new Error('Invalid recycle item');
                        id = Number(pair[0]); num = Number(pair[1]);
                        cfg = data.itemshop_collect[id];
                        if (!cfg || !(cfg.price > 0) || seen[id]) throw new Error('Unsupported recycle item');
                        seen[id] = true;
                        LocalNative.traderCheckItemDebit(before, level, id, num);
                        total += num * cfg.price;
                    }
                    if (!isFinite(total) || total > 100000000) throw new Error('Invalid recycle value');
                    items = LocalNative.shopAddItem(level, LocalNative.traderPolicy.coin, total);
                    ans = 'rpc_c_coin_exchange_ans';
                } else if (method === 'rpc_s_buy_coin_shop_item') {
                    id = Number(params.sale_id); num = Number(params.buy_num);
                    cfg = data.itemshop_coin[id];
                    if (!cfg || !(cfg.price_num > 0) || !data.item[cfg.item_id] ||
                        !(num > 0) || num % 1 || num > LocalNative.shopPolicy.maxBatch)
                        throw new Error('Invalid trader coin purchase');
                    LocalNative.traderCheckItemDebit(before, level, LocalNative.traderPolicy.coin, cfg.price_num * num);
                    items = LocalNative.traderEventItems(level, cfg, num);
                    ans = 'rpc_c_buy_coin_shop_item_ans';
                } else throw new Error('Unsupported trader request');
                LocalNative.writeRaw(store);
                committed = true;
                try {
                    if (ans && typeof player[ans] === 'function')
                        player[ans]({succeed: true, items: items, num: num || 1, buy_num: num || 1});
                } finally { LocalNative.syncTrader(player, level); }
                LocalNative.writeStatus({step: 'trader-rpc', method: method, sale: params.sale_id,
                    items: items.length, ok: true});
                return true;
            } catch (eTrader) {
                LocalNative.syncTrader(player, LocalNative.readRaw().level);
                LocalNative.writeStatus({step: 'trader-rpc-ERR', method: method,
                    committed: committed, error: String(eTrader)});
                if (typeof G_MainController !== 'undefined') G_MainController.setNotice(String(eTrader));
                return false;
            }
        };

        LocalNative.repairPromotionCounter = function(level) {
            if (level.localPromotionCounterV1) return;
            var logs = LocalNative.legacyPromotionLog || [], seen = {}, count = 0;
            for (var i = 0; i < logs.length; i++) {
                var entry = logs[i];
                if (entry.step !== 'hero-promote-saved' || !entry.sid || !entry.t) continue;
                var key = entry.sid + ':' + entry.typeid + ':' + entry.t;
                if (seen[key]) continue;
                for (var h = 0; h < (level.heros || []).length; h++) {
                    var hero = level.heros[h];
                    if (String(hero.sid) !== String(entry.sid)) continue;
                    var id = Number(entry.typeid), visited = {};
                    while (id && !visited[id]) {
                        visited[id] = true;
                        if (id === Number(hero.typeid)) { seen[key] = true; count++; break; }
                        var cfg = data.unit_main[id];
                        id = cfg && Number(cfg.upgrade_target);
                    }
                    break;
                }
            }
            var stats = level.player.achieve_raw || (level.player.achieve_raw = {});
            stats.hero_reborn_times = Math.max(Number(stats.hero_reborn_times) || 0, count);
            level.localPromotionCounterV1 = true;
        };

        LocalNative.handleHeroReincarnate = function(player, params) {
            var committed = false;
            try {
                var unit = G_UnitManager.getUnitBySID(params.sid);
                var exp = unit && unit.getComponent('ExpBar');
                var target = Number(params.targetTypeid), cfg = data.hero_evolve[target];
                var from = unit && Number(unit.typeid), battle = data.unit_battle[from];
                var rein = battle && (Number(battle.reborn_times) || 0);
                var condition = typeof REINCARNATE_CONDITION !== 'undefined' && REINCARNATE_CONDITION[rein];
                if (!unit || !exp || !cfg || !battle || !condition ||
                    Math.floor(from / 100) !== Math.floor(target / 100) ||
                    target !== Math.floor(from / 100) * 100 + Number(condition[2]) ||
                    from < Number(cfg.type_required) || from >= target ||
                    exp.growthLv < Number(cfg.level_required) || exp.growthLv < Number(condition[0]) ||
                    Number(battle.hero_card_color) < Number(condition[1]) ||
                    !data.unit_main[target] || !data.unit_main[target].is_hero)
                    throw new Error('Invalid hero reincarnation target');
                var store = LocalNative.shopTransaction(player), level = store.level, hero = null;
                for (var h = 0; h < level.heros.length; h++)
                    if (String(level.heros[h].sid) === String(params.sid)) hero = level.heros[h];
                if (!hero || Number(hero.typeid) !== from)
                    throw new Error('Hero reincarnation already applied or stale');
                var recipe = cfg.item_composition, inputs = params.mtr_list;
                if (!recipe || !recipe.length || !Array.isArray(inputs) || inputs.length !== recipe.length)
                    throw new Error('Invalid reincarnation materials');
                var needs = {}, supplied = {};
                for (var i = 0; i < recipe.length; i++) {
                    var type = Number(recipe[i][0]), num = Number(recipe[i][1]);
                    if (!data.item[type] || !(num > 0) || num % 1)
                        throw new Error('Invalid reincarnation recipe');
                    needs[type] = (needs[type] || 0) + num;
                    var input = inputs[i], amount = input && Number(input.num);
                    if (!input || !(amount > 0) || !isFinite(amount) || amount % 1)
                        throw new Error('Invalid reincarnation quantity');
                    supplied[input.typeid] = (supplied[input.typeid] || 0) + amount;
                }
                if (Object.keys(needs).length !== Object.keys(supplied).length)
                    throw new Error('Invalid reincarnation material types');
                for (var k in needs) if (needs[k] !== supplied[k])
                    throw new Error('Reincarnation recipe mismatch');
                var scroll = params.scroll == null ? -1 : Number(params.scroll), afterLevel = 1;
                if (scroll !== -1) {
                    var optional = cfg.item_composition_optional || [], scrollCfg = data.item[scroll];
                    if (optional.indexOf(scroll) < 0 || !scrollCfg ||
                        !(Number(scrollCfg.item_scroll_level) > 0) ||
                        Number(scrollCfg.item_scroll_level) > exp.growthLv)
                        throw new Error('Invalid reincarnation scroll');
                    afterLevel = Number(scrollCfg.item_scroll_level);
                    needs[scroll] = (needs[scroll] || 0) + 1;
                }
                var names = ['material', 'based_prop', 'advanced_prop', 'formula'];
                for (var key in needs) {
                    var remaining = needs[key];
                    for (var p = 0; p < names.length; p++) {
                        var bag = level.player['package'] && level.player['package'][names[p]];
                        if (!bag) continue;
                        for (var oid in bag.item_dict) {
                            var item = bag.item_dict[oid];
                            if (Number(item.typeid) !== Number(key)) continue;
                            var take = Math.min(remaining, Number(item.num));
                            item.num -= take; remaining -= take;
                            if (!item.num) delete bag.item_dict[oid];
                            if (!remaining) break;
                        }
                        bag.new_items = 0;
                        for (var left in bag.item_dict) if (bag.item_dict[left].is_new) bag.new_items++;
                        if (!remaining) break;
                    }
                    if (remaining) throw new Error('Insufficient reincarnation materials');
                }
                var pm = player.getComponent('PackageManager');
                var retSpirit = Number(pm.getRebornSpirits(unit));
                if (!isFinite(retSpirit) || retSpirit < 0 || retSpirit % 1)
                    throw new Error('Invalid reincarnation spirit refund');
                // No server rule for partially filled spirit was recovered. Preserve
                // that balance on the hero rather than silently dropping it.
                var live = unit.dumpParams();
                for (var attr in live) if (Object.prototype.hasOwnProperty.call(live, attr)) hero[attr] = live[attr];
                hero.sid = hero.id = params.sid;
                hero.typeid = hero.hero_id = target;
                hero.unit_type = Math.floor(target / 100); hero.unit_level = target % 100;
                hero.lv = hero.level = afterLevel; hero.xp = 0;
                LocalNative.ensureHeroSkill(hero);
                level.player.spirit += retSpirit;
                LocalNative.writeRaw(store);
                committed = true;
                try {
                    pm.init({'package': JSON.parse(JSON.stringify(level.player['package']))});
                    player.rpc_c_reincarnate_ans2({mtr_ans: [], ret_spirit: retSpirit});
                    // Reuse stock full hero/model reconstruction and hero-card refresh.
                    // demote suppresses promotion quests for this form/rank reset.
                    player.rpc_c_promote({id: params.sid, success: true, demote: true,
                        hero: JSON.parse(JSON.stringify(hero))});
                } finally { LocalNative.shopSync(player, level); }
                LocalNative.writeStatus({step: 'hero-reincarnate-saved', sid: params.sid,
                    from: from, typeid: target, lv: afterLevel, scroll: scroll, ret_spirit: retSpirit});
                return true;
            } catch (e) {
                LocalNative.shopSync(player, LocalNative.readRaw().level);
                if (typeof G_UIManager !== 'undefined' && typeof UI !== 'undefined' &&
                    UI.HeroReincarnation && G_UIManager.isUIOpen(UI.HeroReincarnation.UIID)) {
                    var ui = G_UIManager.get_ui(UI.HeroReincarnation.UIID);
                    ui.playing = false;
                    ui.refreshButtonState();
                }
                LocalNative.writeStatus({step: 'hero-reincarnate-ERR', committed: committed, error: String(e)});
                if (typeof G_MainController !== 'undefined') G_MainController.setNotice(String(e));
                return false;
            }
        };

        LocalNative.probeHeroSwallowContract = function() {
            // Read-only native-bytecode probe: no live hero or wallet is changed.
            try {
                var sample = Object.create(Comp.HeroGift.prototype);
                sample.gift = {lv: 0, exp: 0, attrs: []};
                sample.addExp(SWALLOW_SAME_HERO_EXP);
                var absent = G_UnitManager.getUnitBySID('__local_swallow_absent_probe__');
                LocalNative.writeStatus({step: 'hero-swallow-native-contract',
                    sameHeroExp: SWALLOW_SAME_HERO_EXP, giftAfterOne: sample.gift,
                    nextExp: sample.getNextLevelExp(), missingLookupSid: absent && absent.sid});
            } catch (e) {
                LocalNative.writeStatus({step: 'hero-swallow-native-contract-ERR', error: String(e)});
            }
        };

        LocalNative.handleHeroSwallow = function(player, params) {
            var committed = false;
            try {
                if (GS_CURRENT_STAGE !== GS_STAGE_BUILD) return false;
                var sid = params && params.swallower, ids = params && params.swallow_list;
                if (sid == null || !Array.isArray(ids) || !ids.length)
                    throw new Error('Invalid swallow request');
                var consumed = {}, count = 0;
                for (var i = 0; i < ids.length; i++) {
                    var key = String(ids[i]);
                    if (ids[i] == null || key === String(sid) || consumed[key])
                        throw new Error('Invalid swallowed hero');
                    consumed[key] = true;
                    // Missing SIDs can resolve to units.undefined (the player).
                    // Only a matching SID proves that this material is still live.
                    var material = G_UnitManager.getUnitBySID(ids[i]);
                    if (material && String(material.sid) === key)
                        throw new Error('Swallowed hero is still live');
                }
                var store = LocalNative.shopTransaction(player), level = store.level, hero = null;
                for (var j = 0; j < level.heros.length; j++) {
                    var savedHero = level.heros[j];
                    if (String(savedHero.sid) === String(sid)) hero = savedHero;
                    if (consumed[String(savedHero.sid)]) count++;
                }
                if (!hero) throw new Error('Unknown swallower');
                // A repeated request must not recapture a later wallet or apply XP twice.
                if (count === 0) {
                    var receipt = level.player.local_hero_swallow_receipt;
                    if (receipt && String(receipt.sid) === String(sid) &&
                        JSON.stringify(receipt.ids) === JSON.stringify(Object.keys(consumed).sort())) return true;
                    throw new Error('Unknown swallowed heroes');
                }
                if (count !== ids.length) throw new Error('Incomplete swallow roster');
                var unit = G_UnitManager.getUnitBySID(sid);
                var exp = unit && unit.getComponent('ExpBar');
                var gift = unit && unit.getComponent('HeroGift');
                if (!unit || String(unit.sid) !== String(sid) || !exp || !gift ||
                    !isFinite(exp.growthLv) || exp.growthLv < 1 ||
                    !isFinite(exp.growthXp) || exp.growthXp < 0)
                    throw new Error('Missing swallow progression');
                // Persist the stock calculation, including same-species gift XP.
                exp.dump(hero);
                gift.dump(hero);
                hero.level = hero.lv;
                level.heros = level.heros.filter(function(h) {return !consumed[String(h.sid)];});
                level.player.local_hero_swallow_receipt = {sid: sid, ids: Object.keys(consumed).sort()};
                LocalNative.writeRaw(store);
                committed = true;
                // No additional server reward table has been recovered.
                player.rpc_c_swallow_hero_ans({rewards: null});
                LocalNative.writeStatus({step: 'hero-swallow-saved', sid: sid, consumed: ids,
                    lv: hero.lv, xp: hero.xp, gift: hero.gift});
                return true;
            } catch (e) {
                LocalNative.writeStatus({step: 'hero-swallow-ERR', committed: committed, error: String(e)});
                if (typeof G_MainController !== 'undefined') G_MainController.setNotice(String(e));
                return false;
            }
        };

        LocalNative.handleHeroPromote = function(player, params) {
            var unit = G_UnitManager.getUnitBySID(params && params.uid);
            var exp = unit && unit.getComponent('ExpBar');
            if (!unit || !exp || !exp.promoting) return false;
            var committed = false;
            try {
                var store = LocalNative.shopTransaction(player), level = store.level;
                var hero = null;
                for (var i = 0; i < level.heros.length; i++)
                    if (String(level.heros[i].sid) === String(params.uid)) hero = level.heros[i];
                var cfg = data.unit_main[unit.typeid];
                var target = cfg && Number(cfg.upgrade_target);
                if (!hero || Number(hero.typeid) !== Number(unit.typeid) || !target ||
                    !data.unit_main[target] || !data.unit_main[target].is_hero)
                    throw new Error('Invalid hero promotion target');
                // The stock button already paid. Capture its current wallet and
                // live hero progression; apply only the configured rank transition.
                var live = unit.dumpParams();
                for (var key in live) if (Object.prototype.hasOwnProperty.call(live, key)) hero[key] = live[key];
                hero.sid = hero.id = params.uid;
                hero.typeid = hero.hero_id = target;
                hero.unit_type = Math.floor(target / 100); hero.unit_level = target % 100;
                hero.lv = hero.level = exp.growthLv;
                hero.xp = exp.growthXp;
                hero.spirit = 0;
                LocalNative.ensureHeroSkill(hero);
                level.player.rookie_promote_hero = 0;
                var stats = level.player.achieve_raw || (level.player.achieve_raw = {});
                stats.hero_reborn_times = (Number(stats.hero_reborn_times) || 0) + 1;
                LocalNative.writeRaw(store);
                committed = true;
                player.achieve_raw = stats;
                var recorder = player.getComponent('AchievementRecorder');
                if (recorder) recorder.achieve_raw = stats;
                player.rpc_c_promote({id: params.uid, success: true, hero: JSON.parse(JSON.stringify(hero))});
                LocalNative.writeStatus({step: 'hero-promote-saved', sid: params.uid, typeid: target});
                return true;
            } catch (e) {
                if (!committed) LocalNative.syncSavedHomeWallet(LocalNative.readRaw().level);
                exp.promoting = false;
                LocalNative.writeStatus({step: 'hero-promote-ERR', committed: committed, error: String(e)});
                if (typeof G_MainController !== 'undefined') G_MainController.setNotice(String(e));
                return false;
            }
        };

        LocalNative.handlePveMapEgg = function(player, params) {
            var original = LocalNative.readRaw();
            try {
                var index = Number(params && params.index);
                var cfg = data.pve_stage && data.pve_stage[index];
                var progress = original.level.player.availableStages && original.level.player.availableStages[index];
                if (!isFinite(index) || index % 1 || !cfg || !cfg.pve_tresure || !progress ||
                    !(Number(progress[2]) > 0)) throw new Error('PVE egg is not unlocked');
                var boxes = original.level.player.pve_awardBox || {};
                if (Object.prototype.hasOwnProperty.call(boxes, index)) {
                    player.pve_awardBox = JSON.parse(JSON.stringify(boxes));
                    return false;
                }
                var event = data.input_event_client && data.input_event_client[cfg.pve_tresure];
                var items = event && event.putin_event_item || [];
                if (!items.length || event.putin_event_next ||
                    (event.putin_event_hero || []).length || (event.putin_event_resource || []).length ||
                    (event.putin_event_skill || []).length || (event.putin_event_exp || []).length ||
                    (event.putin_event_slot || []).length) throw new Error('Unsupported PVE egg event');
                var store = JSON.parse(JSON.stringify(original)), level = store.level;
                var pm = player.getComponent('PackageManager');
                if (pm && pm['package']) level.player['package'] = JSON.parse(JSON.stringify(pm['package']));
                for (var i = 0; i < items.length; i++) {
                    var reward = data.item_input && data.item_input[items[i]];
                    if (!reward || Number(reward.item_id) !== 1124 || Number(reward.item_num) !== 1 ||
                        (reward.item_random_chance || []).length) throw new Error('Unsupported PVE egg reward');
                    LocalNative.shopAddItem(level, Number(reward.item_id), Number(reward.item_num));
                }
                if (!level.player.pve_awardBox) level.player.pve_awardBox = {};
                level.player.pve_awardBox[index] = 1;
                // Persist inventory and receipt together before updating the stock UI.
                LocalNative.writeRaw(store);
                player.pve_awardBox = JSON.parse(JSON.stringify(level.player.pve_awardBox));
                if (pm) pm.init({'package': JSON.parse(JSON.stringify(level.player['package']))});
                LocalNative.writeStatus({step: 'pve-map-egg-claimed', index: index, count: items.length});
                return true;
            } catch (e) {
                var saved = LocalNative.readRaw() || original;
                player.pve_awardBox = JSON.parse(JSON.stringify(saved.level.player.pve_awardBox || {}));
                LocalNative.writeStatus({step: 'pve-map-egg-ERR', error: String(e)});
                if (typeof G_MainController !== 'undefined') G_MainController.setNotice(String(e));
                return false;
            }
        };

        // Wild Adventure (荒野探险). Stock AdventureSearch.onShow waits for both the
        // "search" animation and rpc_c_enter_dice_event_ans; missing the answer freezes
        // on the map with no UI. Capture branch is local-complete; PVE battle load is not.
        LocalNative.adventurePolicy = {
            entryPeriodId: 1000,
            resetPeriodId: 1001,
            unfortunatePeriodId: 62,
            statusIdle: 0,
            statusPve: 1,
            statusCapture: 2,
            startEventId: 8000,
            runEventId: 8012,
            tortureCostBase: 50
        };

        // User-authorized local loot. Client has no official drop table; rates follow
        // public player notes (~5% primary fruit, ~30-run pity, 10:1 compose).
        LocalNative.adventureLootPolicy = {
            primaryFruitId: 210021,
            advancedFruitId: 210022,
            primaryFruitRate: 0.05,
            advancedFruitRate: 0.005,
            paidFruitBonus: 0.03,
            pityAtCount: 29,
            goldMin: 600, goldMax: 2200,
            woodMin: 600, woodMax: 2200,
            diamondMin: 8, diamondMax: 45,
            heroExpMin: 40, heroExpMax: 120
        };

        LocalNative.adventureCostFor = function(eventId) {
            var cfg = data.dice_event2_client && data.dice_event2_client[eventId];
            if (!cfg || !cfg.resource_type) return 0;
            var tier = Math.max(0, Number(eventId) - LocalNative.adventurePolicy.startEventId);
            return LocalNative.adventurePolicy.tortureCostBase * (1 + Math.floor(tier / 3));
        };

        LocalNative.readAdventureState = function(level) {
            var p = level && level.player || {};
            return {
                adventure_status: Number(p.adventure_status) || 0,
                dice_event2_id: Number(p.dice_event2_id) || 0,
                dice_event2_cost: Number(p.dice_event2_cost) || 0
            };
        };

        LocalNative.writeAdventureState = function(level, state) {
            level.player.adventure_status = Number(state.adventure_status) || 0;
            level.player.dice_event2_id = Number(state.dice_event2_id) || 0;
            level.player.dice_event2_cost = Number(state.dice_event2_cost) || 0;
        };

        LocalNative.syncAdventureManager = function(player, state) {
            var am = player && player.getComponent && player.getComponent('AdventureManager');
            if (!am) return null;
            am.adventure_status = Number(state.adventure_status) || 0;
            am.dice_event2_id = Number(state.dice_event2_id) || 0;
            am.dice_event2_cost = Number(state.dice_event2_cost) || 0;
            return am;
        };

        LocalNative.consumeAdventureEntry = function(level) {
            return LocalNative.consumePveSweepPeriod(level, LocalNative.adventurePolicy.entryPeriodId);
        };

        LocalNative.resetAdventureEntryCount = function(level) {
            var periodId = LocalNative.adventurePolicy.entryPeriodId;
            var period = data.period_control && data.period_control[periodId];
            if (!period) return;
            var ptype = Number(period.period_type) || 1;
            var counters = level.player.event_counters || (level.player.event_counters = {});
            var group = counters[ptype] || (counters[ptype] = {});
            group[periodId] = {c: 0, t: Math.floor(Date.now() / 1000),
                clientData: {_eventCount: 0}};
            LocalNative.consumePveSweepPeriod(level, LocalNative.adventurePolicy.resetPeriodId);
        };

        LocalNative.clearAdventureInterval = function(level) {
            var periodId = LocalNative.adventurePolicy.entryPeriodId;
            var period = data.period_control && data.period_control[periodId];
            if (!period) return;
            var ptype = Number(period.period_type) || 1;
            var counters = level.player.event_counters || (level.player.event_counters = {});
            var group = counters[ptype] || (counters[ptype] = {});
            var counter = group[periodId] || {c: 0};
            var count = Math.max(Number(counter.c) || 0,
                Number(counter.clientData && counter.clientData._eventCount) || 0);
            // Stamp older than period.interval so isEventIntervalDeny clears.
            var ago = (Number(period.interval) || 360) + 5;
            group[periodId] = {c: count, t: Math.floor(Date.now() / 1000) - ago,
                clientData: {_eventCount: count}};
        };

        LocalNative.adventureRandInt = function(min, max) {
            min = Math.floor(Number(min) || 0);
            max = Math.floor(Number(max) || 0);
            if (max < min) max = min;
            return min + Math.floor(Math.random() * (max - min + 1));
        };

        LocalNative.readAdventureUnfortunateCount = function(level) {
            var periodId = LocalNative.adventurePolicy.unfortunatePeriodId;
            var period = data.period_control && data.period_control[periodId];
            var ptype = period ? Number(period.period_type) || 1 : 5;
            var counters = level.player.event_counters || {};
            var group = counters[ptype] || {};
            var counter = group[periodId] || {};
            return Math.max(Number(counter.c) || 0,
                Number(counter.clientData && counter.clientData._eventCount) || 0);
        };

        LocalNative.writeAdventureUnfortunateCount = function(level, count) {
            var periodId = LocalNative.adventurePolicy.unfortunatePeriodId;
            var period = data.period_control && data.period_control[periodId];
            var ptype = period ? Number(period.period_type) || 1 : 5;
            var counters = level.player.event_counters || (level.player.event_counters = {});
            var group = counters[ptype] || (counters[ptype] = {});
            count = Math.max(0, Number(count) || 0);
            group[periodId] = {c: count, t: Math.floor(Date.now() / 1000),
                clientData: {_eventCount: count}};
        };

        LocalNative.applyAdventureCaptureLoot = function(player, level) {
            var policy = LocalNative.adventureLootPolicy;
            var paid = !!level.player.localAdventureNextPaidBonus;
            level.player.localAdventureNextPaidBonus = false;
            var gold = LocalNative.adventureRandInt(policy.goldMin, policy.goldMax);
            var wood = LocalNative.adventureRandInt(policy.woodMin, policy.woodMax);
            var diamond = LocalNative.adventureRandInt(policy.diamondMin, policy.diamondMax);
            var heroExp = LocalNative.adventureRandInt(policy.heroExpMin, policy.heroExpMax);
            var loot = LocalNative.grantPveLoot(gold, wood, level);
            level.player.diamond = (Number(level.player.diamond) || 0) + diamond;
            var unfortunate = LocalNative.readAdventureUnfortunateCount(level);
            var pity = unfortunate >= policy.pityAtCount;
            var primaryRate = policy.primaryFruitRate + (paid ? policy.paidFruitBonus : 0);
            var gotPrimary = pity || Math.random() < primaryRate;
            var gotAdvanced = !gotPrimary && Math.random() < policy.advancedFruitRate;
            var fruits = [];
            if (gotPrimary) {
                LocalNative.shopAddItem(level, policy.primaryFruitId, 1);
                fruits.push(policy.primaryFruitId);
                LocalNative.writeAdventureUnfortunateCount(level, 0);
            } else if (gotAdvanced) {
                LocalNative.shopAddItem(level, policy.advancedFruitId, 1);
                fruits.push(policy.advancedFruitId);
                LocalNative.writeAdventureUnfortunateCount(level, 0);
            } else {
                LocalNative.writeAdventureUnfortunateCount(level, unfortunate + 1);
            }
            var expTargets = [];
            if (typeof data !== 'undefined' && data.hero_lv_data) {
                for (var i = 0; i < (level.heros || []).length; i++) {
                    var hero = level.heros[i];
                    if (Number(hero.state) !== 1) continue;
                    try {
                        LocalNative.normalizeHeroExperience(level, hero, heroExp);
                        expTargets.push(hero.sid || hero.id);
                    } catch (eExp) {}
                }
            }
            return {
                gold: loot.gold, wood: loot.wood, diamond: diamond, heroExp: heroExp,
                fruits: fruits, pity: pity, paid: paid,
                unfortunate: LocalNative.readAdventureUnfortunateCount(level),
                expTargets: expTargets
            };
        };

        LocalNative.handleEnterDiceEvent = function(player) {
            player = player || (typeof G_Player !== 'undefined' ? G_Player : null);
            try {
                var store = LocalNative.shopTransaction(player), level = store.level;
                var cur = LocalNative.readAdventureState(level);
                var policy = LocalNative.adventurePolicy;
                var state = cur;
                if (cur.adventure_status === policy.statusIdle) {
                    if (!LocalNative.consumeAdventureEntry(level))
                        throw new Error('Adventure daily entries exhausted');
                    // Stock flow: enter → PVE → win → home afterInitWorld → capture.
                    // Pre-seed capture event ids; status flips to CAPTURE only after a win.
                    var startId = policy.startEventId;
                    if (!data.dice_event2_client || !data.dice_event2_client[startId])
                        throw new Error('Missing dice_event2_client start row');
                    state = {
                        adventure_status: policy.statusPve,
                        dice_event2_id: startId,
                        dice_event2_cost: LocalNative.adventureCostFor(startId)
                    };
                    LocalNative.writeAdventureState(level, state);
                }
                LocalNative.writeRaw(store);
                LocalNative.shopSync(player, level);
                LocalNative.syncAdventureManager(player, state);
                if (typeof player.rpc_c_enter_dice_event_ans === 'function')
                    player.rpc_c_enter_dice_event_ans({
                        adventure_status: state.adventure_status,
                        dice_event2_id: state.dice_event2_id,
                        dice_event2_cost: state.dice_event2_cost
                    });
                LocalNative.writeStatus({step: 'adventure-enter-ans', status: state.adventure_status,
                    event: state.dice_event2_id, cost: state.dice_event2_cost});
                return true;
            } catch (e) {
                LocalNative.writeStatus({step: 'adventure-enter-ERR', error: String(e)});
                if (typeof G_MainController !== 'undefined') G_MainController.setNotice(String(e));
                return false;
            }
        };

        LocalNative.handleResetDiceEvent1 = function(player) {
            player = player || (typeof G_Player !== 'undefined' ? G_Player : null);
            try {
                // Stock UI already paid period_control[1000].add_resource_num diamonds.
                var store = LocalNative.shopTransaction(player), level = store.level;
                LocalNative.resetAdventureEntryCount(level);
                // Network notes say paid refreshes roll fruit more often; local bonus flag.
                level.player.localAdventureNextPaidBonus = true;
                LocalNative.writeRaw(store);
                LocalNative.shopSync(player, level);
                LocalNative.syncPveSweepPeriod(player, level, LocalNative.adventurePolicy.entryPeriodId);
                LocalNative.writeStatus({step: 'adventure-reset-entries', paidBonus: true});
                return true;
            } catch (e) {
                LocalNative.writeStatus({step: 'adventure-reset-ERR', error: String(e)});
                return false;
            }
        };

        LocalNative.handleClearDiceEvent1Interval = function(player) {
            player = player || (typeof G_Player !== 'undefined' ? G_Player : null);
            try {
                var store = LocalNative.shopTransaction(player), level = store.level;
                LocalNative.clearAdventureInterval(level);
                LocalNative.writeRaw(store);
                LocalNative.shopSync(player, level);
                LocalNative.syncPveSweepPeriod(player, level, LocalNative.adventurePolicy.entryPeriodId);
                LocalNative.writeStatus({step: 'adventure-clear-interval'});
                return true;
            } catch (e) {
                LocalNative.writeStatus({step: 'adventure-clear-interval-ERR', error: String(e)});
                return false;
            }
        };

        LocalNative.adventureCaptureAnswer = function(player, mode) {
            player = player || (typeof G_Player !== 'undefined' ? G_Player : null);
            var policy = LocalNative.adventurePolicy;
            try {
                var store = LocalNative.shopTransaction(player), level = store.level;
                var cur = LocalNative.readAdventureState(level);
                if (cur.adventure_status !== policy.statusCapture)
                    throw new Error('Not in adventure capture');
                var eventId = cur.dice_event2_id;
                if (!data.dice_event2_client || !data.dice_event2_client[eventId])
                    throw new Error('Invalid dice_event2_id');
                var nextId = eventId;
                var endMode = null;
                if (mode === 'release') {
                    nextId = policy.runEventId;
                    endMode = 'finish';
                } else if (mode === 'torture') {
                    if (eventId >= 8009) {
                        endMode = (Math.random() < 0.5) ? 'dead' : 'finish';
                        if (endMode === 'finish') nextId = policy.runEventId;
                    } else {
                        nextId = Math.min(eventId + 1, 8011);
                        if (nextId >= policy.runEventId) {
                            nextId = policy.runEventId;
                            endMode = 'finish';
                        }
                    }
                } else throw new Error('Unsupported capture mode');

                // Null award skips AdventureCapture.addAward (and its inputAward).
                // Loot is persisted below; reward cards remain a follow-up.
                var award = null;
                var awardGet = null;
                var state;
                if (endMode) {
                    var loot = LocalNative.applyAdventureCaptureLoot(player, level);
                    // Stock diceEvent2Finish/Dead require CAPTURE and then set IDLE themselves.
                    // Persist IDLE on disk first, but keep live manager CAPTURE until the callback.
                    state = {adventure_status: policy.statusIdle, dice_event2_id: nextId,
                        dice_event2_cost: 0};
                    LocalNative.writeAdventureState(level, state);
                    LocalNative.writeRaw(store);
                    LocalNative.shopSync(player, level);
                    var amLive = LocalNative.syncAdventureManager(player, {
                        adventure_status: policy.statusCapture,
                        dice_event2_id: cur.dice_event2_id,
                        dice_event2_cost: cur.dice_event2_cost
                    });
                    var finishDict = {dice_event2_id: nextId, award: award, award_get: awardGet};
                    if (endMode === 'dead' && typeof player.rpc_c_dice_event2_dead === 'function')
                        player.rpc_c_dice_event2_dead(finishDict);
                    else if (typeof player.rpc_c_dice_event2_finish === 'function')
                        player.rpc_c_dice_event2_finish(finishDict);
                    if (amLive && amLive.adventure_status !== policy.statusIdle)
                        LocalNative.syncAdventureManager(player, state);
                    LocalNative.writeStatus({step: 'adventure-capture-' + endMode, event: nextId,
                        loot: loot});
                } else {
                    state = {
                        adventure_status: policy.statusCapture,
                        dice_event2_id: nextId,
                        dice_event2_cost: LocalNative.adventureCostFor(nextId)
                    };
                    LocalNative.writeAdventureState(level, state);
                    LocalNative.writeRaw(store);
                    LocalNative.shopSync(player, level);
                    LocalNative.syncAdventureManager(player, state);
                    if (typeof player.rpc_c_dice_event2_next === 'function')
                        player.rpc_c_dice_event2_next({
                            dice_event2_id: state.dice_event2_id,
                            dice_event2_cost: state.dice_event2_cost,
                            award: award,
                            award_get: awardGet
                        });
                    LocalNative.writeStatus({step: 'adventure-capture-next', event: nextId,
                        cost: state.dice_event2_cost});
                }
                return true;
            } catch (e) {
                LocalNative.writeStatus({step: 'adventure-capture-ERR', mode: mode, error: String(e)});
                if (typeof G_MainController !== 'undefined') G_MainController.setNotice(String(e));
                return false;
            }
        };

        LocalNative.handleDiceEvent2Torture = function(player) {
            return LocalNative.adventureCaptureAnswer(player, 'torture');
        };

        LocalNative.handleDiceEvent2Release = function(player) {
            return LocalNative.adventureCaptureAnswer(player, 'release');
        };

        LocalNative.markAdventureCaptureAfterPveWin = function(player, level) {
            var policy = LocalNative.adventurePolicy;
            var startId = policy.startEventId;
            if (!data.dice_event2_client || !data.dice_event2_client[startId])
                throw new Error('Missing dice_event2_client start row');
            var state = {
                adventure_status: policy.statusCapture,
                dice_event2_id: startId,
                dice_event2_cost: LocalNative.adventureCostFor(startId)
            };
            LocalNative.writeAdventureState(level, state);
            if (player) {
                player.adventure_status = state.adventure_status;
                player.dice_event2_id = state.dice_event2_id;
                player.dice_event2_cost = state.dice_event2_cost;
                LocalNative.syncAdventureManager(player, state);
            }
            return state;
        };

        LocalNative.clearAdventureProgress = function(player, level) {
            var state = {adventure_status: 0, dice_event2_id: 0, dice_event2_cost: 0};
            LocalNative.writeAdventureState(level, state);
            if (player) {
                player.adventure_status = 0;
                player.dice_event2_id = 0;
                player.dice_event2_cost = 0;
                LocalNative.syncAdventureManager(player, state);
            }
            return state;
        };

        // Stock wanted tables supply target weights, rewards, prices and triggers.
        // Only the retired server's village payload remains a compatible fallback.
        LocalNative.wantedCounter = function(level, id) {
            var cfg = data.period_control[id];
            if (!cfg) throw new Error('Missing wanted period ' + id);
            var counters = level.player.event_counters || (level.player.event_counters = {});
            var group = counters[cfg.period_type] || (counters[cfg.period_type] = {});
            return group[id] || (group[id] = {c: 0, t: 0, d: {}, clientData: {_eventCount: 0}});
        };

        LocalNative.wantedPeriod = function(level, id, consume) {
            var cfg = data.period_control[id], counter = LocalNative.wantedCounter(level, id);
            var now = Math.floor(Date.now() / 1000);
            // Daily boundaries follow the device's local calendar, as the offline client does.
            if (Number(cfg.period_type) === 1 && counter.t &&
                new Date(counter.t * 1000).toDateString() !== new Date(now * 1000).toDateString()) {
                counter.c = 0;
                counter.clientData = {_eventCount: 0};
                counter.t = 0;
            }
            var count = Math.max(Number(counter.c) || 0,
                Number(counter.clientData && counter.clientData._eventCount) || 0);
            if ((cfg.num_limit && count >= Number(cfg.num_limit)) ||
                (cfg.interval && counter.t && now < Number(counter.t) + Number(cfg.interval))) return false;
            if (consume) {
                counter.c = count + 1;
                counter.t = now;
                counter.clientData = {_eventCount: counter.c};
            }
            return true;
        };

        LocalNative.wantedPick = function(level, order) {
            var info = data.wanted['player_lv_info' + order], lv = Number(level.player.level) || 1;
            if (!info) throw new Error('Missing wanted target pool');
            var band = null;
            for (var i = 0; i < info.order_array.length; i++)
                if (Number(info.order_array[i]) <= lv) band = info.player_lv_info[info.order_array[i]];
            if (!band) throw new Error('Missing wanted level band');
            var candidates = [], total = 0;
            for (var j = 0; j < band.targets.length; j++) {
                var target = band.targets[j];
                if (!(Number(target.probability) > 0) || !data.wanted[target.wanted_id]) continue;
                candidates.push(target); total += Number(target.probability);
            }
            if (!total) throw new Error('Empty wanted pool');
            var roll = Math.random() * total, chosen = candidates[candidates.length - 1];
            for (var k = 0; k < candidates.length; k++) {
                roll -= Number(candidates[k].probability);
                if (roll < 0) { chosen = candidates[k]; break; }
            }
            var cfg = data.wanted[chosen.wanted_id];
            if (!cfg.cost || cfg.cost.length !== 1) throw new Error('Unknown wanted cost formula');
            return {wanted_id: Number(chosen.wanted_id), cost: Number(cfg.cost[0])};
        };

        LocalNative.ensureWantedCards = function(level) {
            var counter = LocalNative.wantedCounter(level, 1020);
            var cards = counter.d || (counter.d = {});
            for (var order = 1; order <= 3; order++)
                if (!cards['wanted' + order] || !data.wanted[cards['wanted' + order].wanted_id])
                    cards['wanted' + order] = LocalNative.wantedPick(level, order);
            return cards;
        };

        LocalNative.syncWanted = function(player, level) {
            LocalNative.syncQuestEventRecorder(player, level);
            // Only this data event refreshes card contents; broadcasting every DER
            // counter can recursively re-enter unrelated quest refresh handlers.
            if (player && player.rpc_c_refresh_daily_event)
                player.rpc_c_refresh_daily_event({event_id: 1020,
                    last_update_time: Math.floor(Date.now() / 1000),
                    event_counter: JSON.parse(JSON.stringify(LocalNative.wantedCounter(level, 1020)))});
        };

        LocalNative.installWantedAwardDisplay = function() {
            if (typeof Comp === 'undefined' || !Comp.HunterManager) return;
            var proto = Comp.HunterManager.prototype;
            if (proto._localWantedAward) return;
            var original = proto.getWantedReward;
            proto.getWantedReward = function(rewardGet, reward) {
                var em = typeof G_EventManager !== 'undefined' ? G_EventManager : null;
                var input = em && em.inputAward;
                try {
                    // Reward was committed before the home transition. Preserve the
                    // original speaker and Award UI without applying it twice.
                    if (em) em.inputAward = function() {};
                    return original.call(this, rewardGet, reward);
                } finally {
                    if (em) em.inputAward = input;
                    LocalNative.syncQuestPackageAndWallet(this.master, LocalNative.readRaw().level);
                }
            };
            proto._localWantedAward = true;
        };

        LocalNative.buildWantedEquipment = function(order) {
            var count = [0, 0, 2, 5][order], eqp = [null, null, null, null, null];
            if (!count) return eqp;
            var keys = [], key, types = ['t', 'x', 'y'];
            if (order === 3) {
                // Randomize among valid full five-rune words, guaranteeing the
                // stock HeroEquipment component activates a five-rune skill.
                for (key in data.rune_order)
                    if (key.length === 5 && /^[txy]+$/.test(key)) keys.push(key);
                keys.sort();
                if (!keys.length) throw new Error('Missing wanted five-rune orders');
                key = keys[Math.floor(Math.random() * keys.length)];
            } else {
                key = '';
                for (var i = 0; i < count; i++) key += types[Math.floor(Math.random() * types.length)];
            }
            for (var slot = 0; slot < count; slot++) {
                var candidates = [];
                for (var id in data.item) {
                    var item = data.item[id];
                    if (Number(item.item_form) === slot + 3 && Number(item.item_level) === 2 &&
                        item.rune_type === key.charAt(slot)) candidates.push(Number(id));
                }
                if (candidates.length !== 1) throw new Error('Ambiguous wanted rune slot ' + slot);
                var rune = {typeid: candidates[0], hero_attr: 0};
                var layers = {base_attr: 'att_basic_color', two_attr: 'att_evolve2_color', three_attr: 'att_evolve3_color'};
                for (var layer in layers) {
                    var pool = [];
                    for (var aid in data.equipment_attribute) {
                        var attr = data.equipment_attribute[aid];
                        if (attr.attr_name && Number(attr[layers[layer]]) > 0) pool.push(Number(aid));
                    }
                    if (!pool.length) throw new Error('Missing wanted rune attribute pool');
                    rune[layer] = [pool[Math.floor(Math.random() * pool.length)]];
                }
                eqp[slot] = rune;
            }
            return eqp;
        };

        LocalNative.runWantedTargetTrigger = function(player, gc, payload) {
            // The stock trigger does not forward eqp. Supply it before original
            // component initialization so both attributes and rune skills apply.
            var create = gc.createUnit, ownCreate = Object.prototype.hasOwnProperty.call(gc, 'createUnit');
            if (typeof create !== 'function') throw new Error('Missing wanted unit factory');
            gc.createUnit = function(params) {
                var typeid = Number(params.typeid) || Number(params.unit_type) * 100 + Number(params.unit_level);
                if (typeid === Number(payload.config.trigger_unit) &&
                    Number(params.faction) === Number(payload.config.trigger_target_camp)) {
                    params.eqp = JSON.parse(JSON.stringify(payload.config.localWantedEquipment));
                }
                return create.apply(this, arguments);
            };
            try {
                return player.rpc_c_run_trigger(payload);
            } finally {
                if (ownCreate) gc.createUnit = create;
                else delete gc.createUnit;
            }
        };

        LocalNative.buildWantedTargetTrigger = function(wantedId) {
            var wanted = data.wanted[wantedId];
            if (!wanted || !data.pve_trigger_server_to_client ||
                !data.pve_trigger_server_to_client[wanted.server_trigger_id])
                throw new Error('Missing wanted server trigger metadata');
            var typeid = Number(wanted.speaker_id) || Number(wantedId);
            if (!data.unit_main || !data.unit_main[typeid])
                throw new Error('Missing wanted target unit ' + typeid);
            var family = Math.floor(typeid / 100), count = Number(wanted.card_order);
            // reborn_times only strengthens a form: 10402/03/04 all use 10401.ccbi.
            // The user means the three visible evolution forms. Resolve those
            // via hero_evolve and origin_typeid, not the enhancement chain.
            typeid = family * 100 + 1;
            for (var form = 1; form < count; form++) {
                var next = 0;
                for (var evolveId in data.hero_evolve) {
                    var targetId = Number(evolveId), evolve = data.hero_evolve[evolveId];
                    var required = data.unit_main[evolve.type_required];
                    if (Math.floor(targetId / 100) !== family || !required ||
                        Number(required.origin_typeid) !== typeid) continue;
                    if (next) throw new Error('Ambiguous wanted evolution ' + typeid);
                    next = targetId;
                }
                if (!next || !data.unit_main[next] ||
                    data.unit_main[next].battle_res === data.unit_main[typeid].battle_res)
                    throw new Error('Missing wanted evolution form ' + family + '/' + (form + 1));
                typeid = next;
            }
            if (!(count >= 1 && count <= 3) || !data.unit_main[typeid])
                throw new Error('Invalid wanted evolution form');
            var formTypeid = typeid, promotion = [0, 5, 10, 15][count];
            for (var rank = 1; rank < promotion; rank++) {
                var promoted = Number(data.unit_main[typeid].upgrade_target);
                if (!data.unit_main[promoted] ||
                    data.unit_main[promoted].battle_res !== data.unit_main[formTypeid].battle_res)
                    throw new Error('Missing wanted promotion ' + typeid);
                typeid = promoted;
            }
            // Server configs were NOT shipped. pve_trigger is a different local
            // tutorial ID space (2500 creates an allied actor and pauses combat).
            // User difficulty: 20/40/60 with 1/2/3 random full-level learnable
            // skills. Keep the stock basic attack, exclude tutorial/summon skills.
            var candidates = data.hero_to_skill && data.hero_to_skill[family];
            var ids = candidates && candidates.skill_id || [], pool = [], seen = {};
            for (var i = 0; i < ids.length; i++) {
                var sid = Number(ids[i]), row = data.skill_to_hero && data.skill_to_hero[sid];
                var skill = data.skill_data && data.skill_data[sid * 100 + 10];
                if (seen[sid] || !row || Number(row.to_hero_id) !== family || !skill) continue;
                if (!(Number(row.skill_weight_1) > 0 || Number(row.skill_weight_2) > 0 ||
                    Number(row.skill_weight_3) > 0)) continue;
                seen[sid] = true;
                pool.push(sid);
            }
            if (!(count >= 1 && count <= 3) || pool.length < count)
                throw new Error('Not enough wanted advanced skills for ' + typeid);
            var slots = [];
            for (var s = 0; s < count; s++) {
                var pick = Math.floor(Math.random() * pool.length);
                slots.push({sid: pool.splice(pick, 1)[0], lv: 10});
            }
            var hero = LocalNative.prepareHeroBattleSkills({typeid: typeid, unit_mutateid: 0,
                skill_slots: slots});
            return {trigger_unit: typeid, trigger_unit_lv: [0, 20, 40, 60][wanted.card_order],
                trigger_unit_num: 1, trigger_unit_skill: hero.skills,
                trigger_target_camp: 2, trigger_pos_type: 2, trigger_pos: [0, 0],
                localWantedEquipment: LocalNative.buildWantedEquipment(count),
                trigger_times: 1};
        };

        LocalNative.castWantedGroundAndAirField = function(mfid, faction, casterMir, targetID, pos, dir) {
            var manager = MagicField.MagicFieldManager.getInstance();
            var handle = manager.handleMagicField(mfid, faction, casterMir, targetID, pos.x, pos.y, dir);
            var field = manager.MagicFieldObjects[handle];
            if (!field || !field.config) throw new Error('Missing wanted attack field ' + mfid);
            // The stock normal-attack field can independently reject air units
            // (10801/10901 air_land=2). Widen this instance before it runs.
            field.config = JSON.parse(JSON.stringify(field.config));
            field.config.air_land = 0;
            manager.runMagicField(handle);
        };

        LocalNative.allowWantedTargetGroundAndAir = function(unit) {
            var bc = unit && unit.getComponent && unit.getComponent('BattleController');
            var skill = bc && bc.skillManager && bc.skillManager.getDefaultSkill();
            if (!skill || !skill.config) return false;
            // Per-instance copy: never widen data.skill_data or another unit.
            skill.setTargetAirAvailable();
            skill.config.target_ground = 1;
            if (skill.config.magic_field1 || skill.config.magic_field2)
                skill._castMagicField = LocalNative.castWantedGroundAndAirField;
            return true;
        };

        LocalNative.applyWantedTargetBuff = function(unit, session) {
            if (!session || Number(session.cardOrder) !== 3) return 0;
            var bc = unit && unit.getComponent && unit.getComponent('BattleController');
            if (!bc || Number(unit.faction) !== 2 || !bc.getCasterMir ||
                typeof Buff === 'undefined' || !Buff.BuffManager ||
                !data.buff_data || !data.buff_data[899801])
                throw new Error('Missing advanced wanted buff dependencies');
            if (bc._localWantedBuff899801) return bc._localWantedBuff899801;
            var manager = Buff.BuffManager.getInstance();
            var handle = manager.handleBuff(899801, unit.faction, bc.getCasterMir(), unit.cid);
            manager.runBuff(handle);
            bc._localWantedBuff899801 = handle;
            return handle;
        };

        LocalNative.handleWantedRpc = function(player, method, params) {
            params = params || {};
            LocalNative.installWantedAwardDisplay();
            try {
                if (method === 'rpc_s_run_server_trigger') {
                    var session = LocalNative.pveSession, gc = LocalNative.getBattleController();
                    if (!session || !session.localNativeWanted || session.completed || session.closed ||
                        session.triggered || !gc || gc.wantedResideUnit !== params.cid ||
                        Number(params.trigger_id) !== Number(data.wanted[session.wantedId].server_trigger_id)) return false;
                    var trigger = session.wantedTrigger ||
                        (session.wantedTrigger = LocalNative.buildWantedTargetTrigger(session.wantedId));
                    if (!player.rpc_c_run_trigger) throw new Error('Missing rpc_c_run_trigger');
                    LocalNative.runWantedTargetTrigger(player, gc, {trigger_id: Number(params.trigger_id), cid: params.cid,
                        config: JSON.parse(JSON.stringify(trigger)), args: {residerDead: 1,
                            bossMark: data.wanted[session.wantedId].boss_mark}});
                    // A failed spawn remains retryable; do not consume this before ACK.
                    session.triggered = !!gc.wantedTarget;
                    var spawned = typeof G_UnitManager !== 'undefined' && G_UnitManager.getUnit
                        ? G_UnitManager.getUnit(gc.wantedTarget) : null;
                    var allTroops = LocalNative.allowWantedTargetGroundAndAir(spawned);
                    var buffHandle = LocalNative.applyWantedTargetBuff(spawned, session);
                    var equipment = spawned && spawned.getComponent && spawned.getComponent('HeroEquipment');
                    LocalNative.writeStatus({step: 'wanted-target-spawn', wantedId: session.wantedId,
                        target: gc.wantedTarget || null, typeid: trigger.trigger_unit,
                        actualTypeid: spawned && spawned.typeid, groundAndAir: allTroops,
                        buff899801Handle: buffHandle,
                        equipment: trigger.localWantedEquipment,
                        actualEquipment: equipment && equipment.eqp,
                        runeSkill: equipment && equipment.getExtraKeySkill ? equipment.getExtraKeySkill() : null,
                        promotion: data.unit_main[trigger.trigger_unit].sub_name,
                        form: session.cardOrder,
                        battleRes: data.unit_main[trigger.trigger_unit].battle_res,
                        reborn: data.unit_main[trigger.trigger_unit].reborn_times,
                        lv: trigger.trigger_unit_lv, camp: trigger.trigger_target_camp,
                        skills: trigger.trigger_unit_skill});
                    if (!session.triggered) throw new Error('Wanted target was not created');
                    return true;
                }
                var store = LocalNative.shopTransaction(player), level = store.level;
                var cards = LocalNative.ensureWantedCards(level);
                if (method === 'rpc_s_get_reward_after_hunter_pve') {
                    var pending = level.localWantedReward;
                    if (!pending) return false;
                    var hunter = player.getComponent('HunterManager');
                    hunter.wanted_id = pending.wantedId;
                    hunter.wanted_reward = pending.reward;
                    hunter.hunter_win = pending.win;
                    delete level.localWantedReward;
                    level.player.wanted_id = 0;
                    level.player.wanted_reward = null;
                    level.player.hunter_win = false;
                    LocalNative.writeRaw(store);
                    LocalNative.syncQuestPackageAndWallet(player, level);
                    player.rpc_c_get_reward_after_hunter_pve_ans({reward_get: pending.reward});
                    return true;
                }
                if (method === 'rpc_s_refresh_wanted') {
                    LocalNative.writeRaw(store);
                    LocalNative.syncWanted(player, level);
                    return true;
                }
                var order = Number(params.card_order), control = data.wanted_control[order];
                // The shipped WantedCard/Info buttons do not gate on open_level.
                // Preserve their accessible cards; that legacy field alone does
                // not prove a server-side player-level prerequisite.
                if (!(order >= 1 && order <= 3 && order === Math.floor(order)) || !control)
                    throw new Error('Invalid wanted card');
                var card = cards['wanted' + order], cfg = data.wanted[card.wanted_id];
                if (method === 'rpc_s_reset_wanted_time') {
                    if (params.res_type !== 'diamond' && params.res_type !== 'item')
                        throw new Error('Invalid wanted reset resource');
                    // Dispatch runs on the next tick: item button subtracts its
                    // ticket just AFTER callServer, diamond button pays before it.
                    var counter = LocalNative.wantedCounter(level, control.normal_id);
                    counter.c = 0; counter.t = 0; counter.clientData = {_eventCount: 0};
                    if (params.res_type === 'diamond')
                        LocalNative.wantedPeriod(level, control.diamond_refresh, true);
                    else {
                        var item = data.item[control.update_items];
                        if (!item) throw new Error('Missing wanted ticket');
                        var itemPeriod = LocalNative.wantedPeriod(level, item.item_freeEvent, false)
                            ? item.item_freeEvent : item.item_paidEvent;
                        if (!LocalNative.wantedPeriod(level, itemPeriod, true))
                            throw new Error('Wanted ticket limit reached');
                    }
                } else if (method === 'rpc_s_reset_wanted') {
                    if (!LocalNative.wantedPeriod(level, control.normal_id, false) ||
                        !LocalNative.wantedPeriod(level, control.change_target, true))
                        throw new Error('Wanted refresh is cooling down');
                    cards['wanted' + order] = LocalNative.wantedPick(level, order);
                } else if (method === 'rpc_s_load_hunter_pve' || method === 'rpc_s_get_help_for_wanted') {
                    var wantedTrigger = method === 'rpc_s_load_hunter_pve'
                        ? LocalNative.buildWantedTargetTrigger(card.wanted_id) : null;
                    if (level.localWantedReward || (LocalNative.pveSession &&
                        LocalNative.pveSession.localNativeWanted && !LocalNative.pveSession.closed &&
                        !LocalNative.pveSession.returning)) throw new Error('Wanted battle or reward is pending');
                    if (!LocalNative.wantedPeriod(level, control.normal_id, true))
                        throw new Error('Wanted battle is cooling down');
                    if (method === 'rpc_s_get_help_for_wanted') {
                        var reward = LocalNative.collectQuestPutinRewards(level, cfg.putin_win,
                            Number(level.player.level) || 1);
                        cards['wanted' + order] = LocalNative.wantedPick(level, order);
                        LocalNative.writeRaw(store);
                        LocalNative.syncWanted(player, level);
                        LocalNative.syncQuestPackageAndWallet(player, level);
                        player.rpc_c_get_help_for_wanted_ans({wanted_id: card.wanted_id,
                            reward: reward, reward_get: reward});
                        return true;
                    }
                    LocalNative.writeRaw(store);
                    LocalNative.syncQuestEventRecorder(player, level);
                    var stages = cfg.stage || [], total = 0, stage = 0;
                    for (var si = 0; si < stages.length; si++) total += Number(stages[si][1]) || 0;
                    var pick = Math.random() * total;
                    for (var sj = 0; sj < stages.length; sj++) {
                        pick -= Number(stages[sj][1]) || 0;
                        if (pick < 0) { stage = Number(stages[sj][0]); break; }
                    }
                    if (!stage) throw new Error('Missing wanted stage');
                    var dict = LocalNative.buildPveBattleDict(stage);
                    dict.pve_mode = dict.oppo.player.pve_mode = 3;
                    dict.oppo.player.wanted_id = card.wanted_id;
                    dict.localNativeWanted = true;
                    dict.source = 'stock-wanted-with-compatible-server-village';
                    LocalNative.pveSession = {stage: stage, wantedId: card.wanted_id, cardOrder: order,
                        wantedTrigger: wantedTrigger, localNativeWanted: true,
                        completed: false, closed: false, returning: false};
                    LocalNative.writeStatus({step: 'wanted-battle-enter', wantedId: card.wanted_id,
                        stage: stage, order: order, source: dict.source});
                    player.rpc_c_enter_battle(dict);
                    return true;
                } else throw new Error('Unsupported wanted RPC ' + method);
                LocalNative.writeRaw(store);
                LocalNative.syncWanted(player, level);
                if (method === 'rpc_s_reset_wanted' && player.rpc_c_reset_wanted_ans)
                    player.rpc_c_reset_wanted_ans({card_order: order});
                return true;
            } catch (e) {
                LocalNative.writeStatus({step: 'wanted-rpc-ERR', method: method,
                    cardOrder: params.card_order, playerLevel: player && player.level, error: String(e)});
                if (typeof G_MainController !== 'undefined') G_MainController.setNotice(String(e));
                return false;
            }
        };

        LocalNative.completeWantedBattle = function(player, params) {
            var session = LocalNative.pveSession;
            if (!session || session.completed || session.closed) return false;
            var gc = LocalNative.getBattleController();
            var win = !!(gc && gc.battleResult && gc.battleResult.pve_dict &&
                gc.battleResult.pve_dict.wantedDead === 1);
            var store = JSON.parse(JSON.stringify(LocalNative.readRaw())), level = store.level;
            var cfg = data.wanted[session.wantedId];
            var reward = LocalNative.collectQuestPutinRewards(level,
                win ? cfg.putin_win : cfg.putin_lose, Number(level.player.level) || 1);
            level.localWantedReward = {wantedId: session.wantedId, win: win, reward: reward};
            level.player.wanted_id = session.wantedId;
            level.player.wanted_reward = reward;
            level.player.hunter_win = win;
            LocalNative.ensureWantedCards(level)['wanted' + session.cardOrder] =
                LocalNative.wantedPick(level, session.cardOrder);
            LocalNative.writeRaw(store);
            session.completed = true;
            session.starNum = win ? 3 : 0;
            LocalNative.writeStatus({step: 'wanted-battle-result', wantedId: session.wantedId,
                win: win, reward: reward});
            var result = LocalNative.buildPveBattleResultDict(gc, session.stage);
            result.win_gold = result.win_wood = 0;
            result.starNum = session.starNum;
            result.isWinner = win;
            result.input_gains = [];
            player.rpc_c_battle_result(result);
            return true;
        };

        LocalNative.handleLoadDiceEvent1Pve = function(player) {
            player = player || (typeof G_Player !== 'undefined' ? G_Player : null);
            try {
                var store = LocalNative.readRaw();
                var level = store && store.level;
                var cur = LocalNative.readAdventureState(level);
                if (cur.adventure_status !== LocalNative.adventurePolicy.statusPve)
                    throw new Error('Adventure PVE is not pending');
                // Compatible village stub with stock PVE_BATTLE_MODE_DICE_EVENT1.
                var dict = LocalNative.buildPveBattleDict(1);
                var mode = (typeof PVE_BATTLE_MODE_DICE_EVENT1 !== 'undefined')
                    ? PVE_BATTLE_MODE_DICE_EVENT1 : 2;
                dict.pve_mode = mode;
                if (dict.oppo && dict.oppo.player) dict.oppo.player.pve_mode = mode;
                dict.localNativeAdventure = true;
                dict.source = 'local-inferred-compatible-adventure-pve';
                LocalNative.pveSession = {
                    stage: 1,
                    returning: false,
                    closed: false,
                    completed: false,
                    starNum: 0,
                    winGold: 0,
                    winWood: 0,
                    localNativeAdventure: true
                };
                LocalNative.writeStatus({step: 'adventure-pve-enter', mode: mode});
                if (player && typeof player.rpc_c_enter_battle === 'function')
                    player.rpc_c_enter_battle(dict);
                else throw new Error('Missing rpc_c_enter_battle');
                return true;
            } catch (e) {
                if (LocalNative.pveSession) LocalNative.pveSession.closed = true;
                LocalNative.writeStatus({step: 'adventure-pve-enter-ERR', error: String(e)});
                if (typeof G_MainController !== 'undefined') G_MainController.setNotice(String(e));
                return false;
            }
        };

        LocalNative.handleTutorialEggDraw = function(player, params) {
            if (!params || Number(params.buy_id) !== 100 || params.free !== true) {
                LocalNative.writeStatus({step: 'drawcard-unsupported', buy_id: params && params.buy_id});
                return false;
            }
            var store = LocalNative.readRaw();
            var level = store.level;
            var receipt = level.localTutorialEgg;
            if (receipt && receipt.claimed) return false;
            if (!receipt) {
                var hero = {
                    id: 'tutorial_free_egg_1', sid: 'tutorial_free_egg_1',
                    hero_id: 11501, typeid: 11501, unit_type: 115, unit_level: 1,
                    lv: 30, level: 30, xp: 0, state: 0, aidx: -1,
                    unit_mutateid: 0, mutateid: 0,
                    rct: Math.floor(Date.now() / 1000), aht: Math.floor(Date.now() / 1000),
                    skill_id: 26701, skill_slots: [{sid: 267, lv: 1, exp: 0}], gift: 0,
                    source: 'user-authorized-tutorial-egg-fallback'
                };
                receipt = level.localTutorialEgg = {claimed: false, hero: hero};
            }
            // Shop has already started its stock cooldown optimistically.
            var daily = player.getComponent && player.getComponent('DailyEventRecorder');
            if (daily && daily.event_counters) {
                level.player.event_counters = JSON.parse(JSON.stringify(daily.event_counters));
                level.player.last_update_time = daily.last_update_time || Math.floor(Date.now() / 1000);
            }
            LocalNative.writeRaw(store);
            player.rpc_c_draw_card({ans: [[29, receipt.hero]]});
            LocalNative.writeStatus({step: 'tutorial-egg-draw-ok', typeid: receipt.hero.typeid, lv: receipt.hero.lv});
            return true;
        };
        LocalNative.handleTutorialEggGain = function(player) {
            var store = LocalNative.readRaw();
            var level = store && store.level;
            var receipt = level && level.localTutorialEgg;
            if (!receipt || receipt.claimed) return false;
            var hero = receipt.hero;
            LocalNative.ensureHeroSkill(hero);
            var roster = level.heros || (level.heros = []);
            for (var i = 0; i < roster.length; i++) {
                if (roster[i].sid === hero.sid) return false;
            }
            var hm = player.getComponent('HeroManager');
            var oldCapacity = hm.getHeroCapacity();
            hero.hero_slot = Math.max(0, roster.length + 1 - oldCapacity);
            // Stock inputAward -> onGetCapsule creates the hero and extends slots.
            player.rpc_c_gain_drawcard({ans: [[29, hero]]});
            roster.push(JSON.parse(JSON.stringify(hero)));
            level.player.hero_slot_num = Math.max(oldCapacity, roster.length);
            LocalNative.ensurePlayerSocialFields(level.player);
            var stats = level.player.achieve_raw;
            stats.hero_times = (Number(stats.hero_times) || 0) + 1;
            var recorder = player.getComponent('AchievementRecorder');
            if (recorder) recorder.achieve_raw = stats;
            player.achieve_raw = stats;
            receipt.claimed = true;
            LocalNative.writeRaw(store);
            LocalNative.writeStatus({step: 'tutorial-egg-gain-ok', sid: hero.sid,
                typeid: hero.typeid, lv: hero.lv, hero_times: stats.hero_times});
            return true;
        };

        // Daily/main quest claim: finishDailyQuest clears UI then waits for
        // rpc_c_finish_*_quest_ans({reward, root_quest_id, current}).
        LocalNative.questPlayerLevel = function(level, player) {
            var live = Number(player && player.level);
            if (live > 0) return live;
            return Math.max(1, Number(level && level.player && level.player.level) || 1);
        };

        LocalNative.questScaledResAmount = function(resCfg, playerLevel) {
            var amount = Number(resCfg && resCfg.putin_num) || 0;
            var factor = Number(resCfg && resCfg.putin_factor) || 0;
            var type = Number(resCfg && resCfg.putin_resource_type);
            if (factor > 0 && (type === 1 || type === 2))
                amount = Math.floor(amount * (1 + playerLevel * factor));
            return amount;
        };

        LocalNative.collectQuestPutinRewards = function(level, putinId, playerLevel) {
            var ans = [], seen = {}, id = putinId;
            while (id) {
                if (seen[id]) throw new Error('Cyclic quest putin ' + id);
                seen[id] = true;
                var event = data.input_event_client && data.input_event_client[id];
                if (!event) throw new Error('Missing quest putin event ' + id);
                var resources = event.putin_event_resource || [];
                for (var r = 0; r < resources.length; r++) {
                    var res = data.resource_input && data.resource_input[resources[r]];
                    if (!res) throw new Error('Missing quest resource ' + resources[r]);
                    var amount = LocalNative.questScaledResAmount(res, playerLevel);
                    var type = Number(res.putin_resource_type);
                    if (!(amount > 0)) continue;
                    if (type === 1 || type === 2) {
                        var gained = LocalNative.grantPveLoot(type === 2 ? amount : 0,
                            type === 1 ? amount : 0, level);
                        var actual = type === 2 ? gained.gold : gained.wood;
                        if (actual) ans.push([type === 2 ? 3 : 2, actual]);
                    } else if (type === 3 || type === 4) {
                        level.player[type === 3 ? 'diamond' : 'spirit'] =
                            (Number(level.player[type === 3 ? 'diamond' : 'spirit']) || 0) + amount;
                        ans.push([type === 3 ? 4 : 11, amount]);
                    } else throw new Error('Unsupported quest resource ' + type);
                }
                var items = event.putin_event_item || [];
                for (var i = 0; i < items.length; i++)
                    ans = ans.concat(LocalNative.shopRollItemEvent(level, items[i]));
                if ((event.putin_event_hero || []).length || (event.putin_event_skill || []).length ||
                    (event.putin_event_exp || []).length || (event.putin_event_slot || []).length)
                    throw new Error('Unsupported quest reward branch ' + id);
                id = event.putin_event_next;
            }
            return ans;
        };

        // Read-only list payload: AwardBase expects [inputType, amount/item], while
        // claim handlers above also mutate wallets, packages and random counters.
        LocalNative.previewQuestRewards = function(putinId, playerLevel) {
            var out = [], seen = {}, id = putinId;
            var resourceTypes = {1: 2, 2: 3, 3: 4, 4: 11};
            while (id && !seen[id]) {
                seen[id] = true;
                var event = data.input_event_client && data.input_event_client[id];
                if (!event) break;
                var resources = event.putin_event_resource || [];
                for (var r = 0; r < resources.length; r++) {
                    var res = data.resource_input && data.resource_input[resources[r]];
                    var type = res && resourceTypes[res.putin_resource_type];
                    var amount = LocalNative.questScaledResAmount(res, playerLevel);
                    if (type && amount > 0) out.push([type, amount]);
                }
                var items = event.putin_event_item || [];
                for (var i = 0; i < items.length; i++) {
                    var item = data.item_input && data.item_input[items[i]];
                    // All original daily quest item events are fixed, not rolled.
                    if (item && Number(item.item_id) > 0 && Number(item.item_num) > 0)
                        out.push([19, {typeid: Number(item.item_id), num: Number(item.item_num)}]);
                }
                id = event.putin_event_next;
            }
            return out;
        };

        LocalNative.ensureQuestRewardPreviews = function(player) {
            var changed = false, lv = LocalNative.questPlayerLevel({player: player});
            function fill(current, table) {
                if (!current || !table) return;
                for (var id in current) {
                    if (!Object.prototype.hasOwnProperty.call(current, id) || !table[id] ||
                        !current[id] || typeof current[id] !== 'object') continue;
                    var rewards = LocalNative.previewQuestRewards(table[id].mt_putin, lv);
                    // The stock client uses zero for these targets until the server
                    // supplies current[id].max. Preserve any existing server target.
                    var row = current[id], fields = ['mt_coin', 'mt_solar'];
                    for (var f = 0; f < fields.length; f++) {
                        var field = fields[f];
                        if (!(Number(table[id][field]) > 0)) continue;
                        if (!row.max) row.max = {};
                        if (!(Number(row.max[field]) > 0)) {
                            row.max[field] = Number(table[id][field]);
                            changed = true;
                        }
                    }
                    if (JSON.stringify(current[id].reward) !== JSON.stringify(rewards)) {
                        current[id].reward = rewards;
                        changed = true;
                    }
                }
            }
            var counters = player.event_counters || {};
            for (var group in counters) {
                for (var period in counters[group]) {
                    var bucket = counters[group][period];
                    fill(bucket && bucket.d && bucket.d.current, data.daily_task);
                }
            }
            var main = player.main_quest || {};
            for (var root in main) fill(main[root] && main[root].current, data.main_task);
            return changed;
        };

        LocalNative.ensureDailyQuestBucket = function(level, rootQuestId) {
            var cfg = data.daily_task && data.daily_task[rootQuestId];
            var periodId = cfg && Number(cfg.reset_period);
            var periodCfg = periodId && data.period_control && data.period_control[periodId];
            if (!cfg || !periodId || !periodCfg) throw new Error('Missing daily quest period');
            var ptype = Number(periodCfg.period_type) || 1;
            var counters = level.player.event_counters || (level.player.event_counters = {});
            var group = counters[ptype] || (counters[ptype] = {});
            var entry = group[periodId] || (group[periodId] = {c: 0, t: Math.floor(Date.now() / 1000)});
            if (!entry.d || typeof entry.d !== 'object') entry.d = {};
            if (!entry.d.current || typeof entry.d.current !== 'object') entry.d.current = {};
            if (!entry.clientData || typeof entry.clientData !== 'object') entry.clientData = {};
            return {periodId: periodId, ptype: ptype, entry: entry, cfg: cfg};
        };

        // Stock server seeds DER.current / main_quest on login. Offline saves had
        // empty maps, so GameEventsLayer.refreshDailyQuest painted an empty list.
        LocalNative.seedDailyQuestRoots = function(player) {
            var roots = data.daily_task && data.daily_task.game_event_roots &&
                data.daily_task.game_event_roots.game_event_roots;
            if (!player || !roots || !data.period_control) return false;
            var changed = false, now = Math.floor(Date.now() / 1000), i;
            if (!(Number(player.last_update_time) > 0)) {
                player.last_update_time = now;
                changed = true;
            }
            for (i = 0; i < roots.length; i++) {
                var rootId = roots[i], cfg = data.daily_task[rootId];
                var periodId = cfg && Number(cfg.reset_period);
                var periodCfg = periodId && data.period_control[periodId];
                if (!cfg || !periodCfg) continue;
                var ptype = Number(periodCfg.period_type) || 1;
                var counters = player.event_counters || (player.event_counters = {});
                var group = counters[ptype] || (counters[ptype] = {});
                var entry = group[periodId];
                if (!entry) {
                    entry = group[periodId] = {c: 0, t: now, d: {current: {}}, clientData: {}};
                    changed = true;
                }
                if (!entry.d || typeof entry.d !== 'object') {
                    entry.d = {};
                    changed = true;
                }
                if (!entry.d.current || typeof entry.d.current !== 'object') {
                    entry.d.current = {};
                    changed = true;
                }
                // Finished today → last set and current cleared; do not re-seed.
                if (!Object.keys(entry.d.current).length && !entry.d.last) {
                    entry.d.current[rootId] = {};
                    entry.t = now;
                    changed = true;
                }
            }
            return changed;
        };

        LocalNative.seedMainQuestRoots = function(player) {
            if (!player || !data.main_task) return false;
            var roots = data.main_task.game_event_roots &&
                data.main_task.game_event_roots.game_event_roots;
            if (!roots || !roots.length) roots = [300201];
            var changed = false, i;
            if (!player.main_quest || typeof player.main_quest !== 'object') {
                player.main_quest = {};
                changed = true;
            }
            if (player.finish_main_quest_timestamp == null) {
                player.finish_main_quest_timestamp = 0;
                changed = true;
            }
            for (i = 0; i < roots.length; i++) {
                var rootId = roots[i];
                if (!data.main_task[rootId]) continue;
                var slot = player.main_quest[rootId];
                if (!slot || typeof slot !== 'object') {
                    player.main_quest[rootId] = {current: {}};
                    player.main_quest[rootId].current[rootId] = {};
                    changed = true;
                    continue;
                }
                if (!slot.current || typeof slot.current !== 'object') {
                    slot.current = {};
                    changed = true;
                }
                if (!Object.keys(slot.current).length && !slot.last) {
                    slot.current[rootId] = {};
                    changed = true;
                }
            }
            return changed;
        };

        LocalNative.ensureQuestProgressSeeded = function(levelOrPlayer) {
            var player = levelOrPlayer && levelOrPlayer.player ? levelOrPlayer.player : levelOrPlayer;
            if (!player) return false;
            var daily = LocalNative.seedDailyQuestRoots(player);
            var main = LocalNative.seedMainQuestRoots(player);
            var rewards = LocalNative.ensureQuestRewardPreviews(player);
            return daily || main || rewards;
        };

        LocalNative.applyQuestSeedToLive = function(player, level) {
            if (!player || !level || !level.player) return false;
            var der = player.getComponent && player.getComponent('DailyEventRecorder');
            if (der && level.player.event_counters) {
                der.event_counters = JSON.parse(JSON.stringify(level.player.event_counters));
                der.last_update_time = level.player.last_update_time ||
                    Math.floor(Date.now() / 1000);
            }
            var qm = player.getComponent && player.getComponent('QuestManager');
            if (qm && level.player.main_quest) {
                qm.main_quest = JSON.parse(JSON.stringify(level.player.main_quest));
                qm.finish_main_quest_timestamp =
                    level.player.finish_main_quest_timestamp || 0;
            }
            return true;
        };

        LocalNative.ensureLiveQuestSeed = function() {
            try {
                if (typeof G_Player !== 'undefined' &&
                    LocalNative._questSeededPlayer === G_Player)
                    LocalNative.saveLiveQuestProgress(G_Player);
                var store = LocalNative.readRaw();
                if (!store || !store.level || !store.level.player) return false;
                var changed = LocalNative.ensureQuestProgressSeeded(store.level);
                if (changed) LocalNative.writeRaw(store);
                if (typeof G_Player !== 'undefined' && G_Player) {
                    LocalNative.applyQuestSeedToLive(G_Player, store.level);
                    LocalNative._questSeededPlayer = G_Player;
                }
                return changed;
            } catch (eSeed) {
                LocalNative.writeStatus({step: 'quest-seed-ERR', error: String(eSeed)});
                return false;
            }
        };

        LocalNative.saveLiveQuestProgress = function(player) {
            var der = player && player.getComponent('DailyEventRecorder');
            if (!der || !der.event_counters) return;
            var store = LocalNative.readRaw();
            if (!store || !store.level || !store.level.player) return;
            store.level.player.event_counters = JSON.parse(JSON.stringify(der.event_counters));
            store.level.player.last_update_time = der.last_update_time;
            var qm = player.getComponent('QuestManager');
            if (qm && qm.main_quest)
                store.level.player.main_quest = JSON.parse(JSON.stringify(qm.main_quest));
            LocalNative.ensureQuestRewardPreviews(store.level.player);
            LocalNative.writeRaw(store);
        };

        LocalNative.installDailyQuestProgress = function(qm) {
            if (!qm || qm.__localDailyProgress) return;
            qm.__localDailyProgress = true;
            var normal = qm._updateNormalField;
            if (typeof normal === 'function') qm._updateNormalField = function(field, num, quest, cfg, type) {
                if (type !== DAILY_QUEST) return normal.apply(this, arguments);
                // Main counters are client-owned; daily counters were server-owned.
                if (Number(num) > 0 && isFinite(Number(num)))
                    quest[0][field] = (Number(quest[0][field]) || 0) + Number(num);
            };
            var warrior = qm._update_mt_warrior_cb;
            if (typeof warrior === 'function') qm._update_mt_warrior_cb = function(soldier, num, quest, cfg, type) {
                // Reuse stock total/type-specific accumulation, which otherwise
                // runs only for MAIN_QUEST. The outer update still owns UI type.
                return warrior.call(this, soldier, num, quest, cfg,
                    type === DAILY_QUEST ? MAIN_QUEST : type);
            };
            function refresh(manager, field) {
                var ids = data.daily_task[field] && data.daily_task[field].ids || [];
                for (var i = 0; i < ids.length; i++)
                    manager._checkAndSetDailyQuestFinishStatus(ids[i]);
            }
            ['updateCurrent', 'update_mt_warrior'].forEach(function(name) {
                var original = qm[name];
                if (typeof original !== 'function') return;
                qm[name] = function() {
                    try {
                        var result = original.apply(this, arguments);
                        refresh(this, name === 'updateCurrent' ? arguments[0] : 'mt_warrior');
                        return result;
                    } finally {
                        LocalNative.saveLiveQuestProgress(G_Player);
                    }
                };
            });
            var finish = qm.finishDailyQuest;
            if (typeof finish === 'function') qm.finishDailyQuest = function(id) {
                var quest = this.getDailyQuest(id);
                if (!quest || !this._canFinish(quest, data.daily_task[id])) return false;
                // Stock clears DER before calling the RPC. Save the verified row
                // first so the local server can validate and reject repeat claims.
                LocalNative.saveLiveQuestProgress(G_Player);
                return finish.apply(this, arguments);
            };
            var ids = data.daily_task.game_event_roots.game_event_roots || [];
            for (var i = 0; i < ids.length; i++) {
                var q = qm.getDailyQuest && qm.getDailyQuest(ids[i]);
                if (q && q[1]) delete q[1].canFinish;
            }
        };

        // Quiet DER write only. Never broadcast rpc_c_refresh_daily_event for every
        // quest period: that invokes refreshDailyQuest → rpc_s_refresh_daily_quest
        // → this path again and freezes the client.
        LocalNative.syncQuestEventRecorder = function(player, level) {
            var der = player && player.getComponent && player.getComponent('DailyEventRecorder');
            if (!der || !level || !level.player || !level.player.event_counters) return;
            der.event_counters = JSON.parse(JSON.stringify(level.player.event_counters));
            if (level.player.last_update_time != null)
                der.last_update_time = level.player.last_update_time;
            else der.last_update_time = Math.floor(Date.now() / 1000);
        };

        LocalNative.nextDailyQuestIds = function(questId) {
            var show = data.daily_task && data.daily_task.show_tasks &&
                data.daily_task.show_tasks.show_tasks;
            var next = show && show[questId];
            return next && next.length ? next.slice() : [];
        };

        LocalNative.bumpDailyTasknum = function(level) {
            var ids = data.daily_task && data.daily_task.mt_tasknum && data.daily_task.mt_tasknum.ids;
            if (!ids || !ids.length) return;
            for (var i = 0; i < ids.length; i++) {
                var qid = ids[i];
                var cfg = data.daily_task[qid];
                if (!cfg) continue;
                var bucket = LocalNative.ensureDailyQuestBucket(level, cfg.root_id || qid);
                var cur = bucket.entry.d.current[qid];
                if (!cur) continue;
                cur.mt_tasknum = (Number(cur.mt_tasknum) || 0) + 1;
            }
        };

        LocalNative.advanceDailyQuestCounter = function(level, field, amount) {
            var ids = data.daily_task && data.daily_task[field] && data.daily_task[field].ids || [];
            for (var i = 0; i < ids.length; i++) {
                var cfg = data.daily_task[ids[i]];
                if (!cfg) continue;
                var bucket = LocalNative.ensureDailyQuestBucket(level, cfg.root_id || ids[i]);
                var row = bucket.entry.d.current[ids[i]];
                // Never resurrect claimed quests or create a future tier here.
                if (!row) continue;
                row[field] = (Number(row[field]) || 0) + amount;
                var cache = bucket.entry.clientData.current;
                if (cache && cache[ids[i]]) delete cache[ids[i]].canFinish;
            }
        };

        LocalNative.syncQuestPackageAndWallet = function(player, level) {
            LocalNative.syncSavedHomeWallet(level);
            var pm = player && player.getComponent && player.getComponent('PackageManager');
            if (pm && level.player['package'])
                pm.init({'package': JSON.parse(JSON.stringify(level.player['package']))});
        };

        LocalNative.handleRefreshDailyQuest = function(player, params) {
            if (LocalNative._questRpcBusy) return false;
            LocalNative._questRpcBusy = true;
            try {
                var rootId = Number(params && params.root_quest_id);
                if (!(rootId > 0) || !data.daily_task || !data.daily_task[rootId])
                    throw new Error('Invalid daily quest root');
                var store = LocalNative.shopTransaction(player), level = store.level;
                var bucket = LocalNative.ensureDailyQuestBucket(level, rootId);
                // Re-seed only when never finished today (empty current, no last).
                if (!Object.keys(bucket.entry.d.current).length && !bucket.entry.d.last)
                    bucket.entry.d.current[rootId] = {};
                LocalNative.ensureQuestRewardPreviews(level.player);
                bucket.entry.t = Math.floor(Date.now() / 1000);
                LocalNative.writeRaw(store);
                LocalNative.syncQuestEventRecorder(player, level);
                player.rpc_c_refresh_daily_quest_ans({root_quest_id: rootId});
                LocalNative.writeStatus({step: 'daily-quest-refresh', root: rootId});
                return true;
            } finally {
                LocalNative._questRpcBusy = false;
            }
        };

        LocalNative.handleFinishDailyQuest = function(player, params) {
            if (LocalNative._questRpcBusy) return false;
            LocalNative._questRpcBusy = true;
            try {
                var questId = Number(params && params.quest_id);
                var cfg = data.daily_task && data.daily_task[questId];
                if (!(questId > 0) || !cfg) throw new Error('Invalid daily quest');
                var rootId = Number(cfg.root_id) || questId;
                var savedStore = LocalNative.readRaw();
                var savedBucket = LocalNative.ensureDailyQuestBucket(savedStore.level, rootId);
                var savedQuest = savedBucket.entry.d.current[questId];
                var manager = player.getComponent && player.getComponent('QuestManager');
                if (!savedQuest || (manager && manager._canFinish &&
                    !manager._canFinish([savedQuest, {}], cfg))) return false;
                var store = LocalNative.shopTransaction(player), level = store.level;
                var bucket = LocalNative.ensureDailyQuestBucket(level, rootId);
                // Stock finishDailyQuest already deleted the finished id from live DER.
                delete bucket.entry.d.current[questId];
                bucket.entry.d.last = questId;
                bucket.entry.t = Math.floor(Date.now() / 1000);
                // Next show-task ids are separate roots with their own reset_period;
                // seed each into its own DER bucket (not the finished root's current).
                var nextIds = LocalNative.nextDailyQuestIds(questId), ansCurrent = {}, n;
                for (n = 0; n < nextIds.length; n++) {
                    var nextId = nextIds[n], nextCfg = data.daily_task[nextId];
                    if (!nextCfg) continue;
                    var nextRoot = Number(nextCfg.root_id) || nextId;
                    var nextBucket = LocalNative.ensureDailyQuestBucket(level, nextRoot);
                    nextBucket.entry.d.current[nextId] = {reward: LocalNative.previewQuestRewards(
                        nextCfg.mt_putin, LocalNative.questPlayerLevel(level, player))};
                    nextBucket.entry.t = Math.floor(Date.now() / 1000);
                    ansCurrent[nextId] = nextBucket.entry.d.current[nextId];
                }
                LocalNative.bumpDailyTasknum(level);
                var reward = LocalNative.collectQuestPutinRewards(level, cfg.mt_putin,
                    LocalNative.questPlayerLevel(level, player));
                LocalNative.ensureQuestRewardPreviews(level.player);
                LocalNative.writeRaw(store);
                LocalNative.syncQuestEventRecorder(player, level);
                player.rpc_c_finish_daily_quest_ans({
                    reward: reward,
                    root_quest_id: rootId,
                    current: ansCurrent
                });
                // The local server advanced mt_tasknum; ask stock notification/UI
                // code to re-evaluate its cached state without adding another count.
                if (manager && manager.updateCurrent) manager.updateCurrent('mt_tasknum', 0);
                LocalNative.syncQuestPackageAndWallet(player, level);
                LocalNative.writeStatus({
                    step: 'daily-quest-finish', quest: questId, root: rootId,
                    next: nextIds, rewardTypes: reward.map(function(row) { return row[0]; })
                });
                return true;
            } finally {
                LocalNative._questRpcBusy = false;
            }
        };

        LocalNative.handleFinishMainQuest = function(player, params) {
            if (LocalNative._questRpcBusy) return false;
            LocalNative._questRpcBusy = true;
            try {
                var questId = Number(params && params.quest_id);
                var cfg = data.main_task && data.main_task[questId];
                if (!(questId > 0) || !cfg) throw new Error('Invalid main quest');
                var rootId = Number(cfg.root_id) || questId;
                var store = LocalNative.shopTransaction(player), level = store.level;
                var qmLive = player.getComponent && player.getComponent('QuestManager');
                // Stock finishMainQuest already cleared the live QM entry; prefer it.
                if (qmLive && qmLive.main_quest)
                    level.player.main_quest = JSON.parse(JSON.stringify(qmLive.main_quest));
                if (!level.player.main_quest) level.player.main_quest = {};
                var slot = level.player.main_quest[rootId] ||
                    (level.player.main_quest[rootId] = {current: {}});
                if (!slot.current || typeof slot.current !== 'object') slot.current = {};
                delete slot.current[questId];
                slot.last = questId;
                // main_task.show_tasks is empty in stock data; chain is cfg.mt_next.
                var nextIds = (cfg.mt_next && cfg.mt_next.length) ? cfg.mt_next.slice() : [], n;
                for (n = 0; n < nextIds.length; n++) {
                    if (data.main_task[nextIds[n]]) slot.current[nextIds[n]] = {
                        reward: LocalNative.previewQuestRewards(data.main_task[nextIds[n]].mt_putin,
                            LocalNative.questPlayerLevel(level, player))};
                }
                var reward = [];
                if (cfg.mt_putin)
                    reward = LocalNative.collectQuestPutinRewards(level, cfg.mt_putin,
                        LocalNative.questPlayerLevel(level, player));
                level.player.finish_main_quest_timestamp =
                    Math.floor(Date.now() / 1000);
                LocalNative.writeRaw(store);
                var qm = player.getComponent && player.getComponent('QuestManager');
                if (qm) {
                    qm.main_quest = JSON.parse(JSON.stringify(level.player.main_quest));
                    qm.finish_main_quest_timestamp = level.player.finish_main_quest_timestamp;
                }
                player.rpc_c_finish_main_quest_ans({
                    reward: reward,
                    root_quest_id: rootId,
                    current: JSON.parse(JSON.stringify(slot.current))
                });
                LocalNative.syncQuestPackageAndWallet(player, level);
                LocalNative.writeStatus({step: 'main-quest-finish', quest: questId, root: rootId});
                return true;
            } finally {
                LocalNative._questRpcBusy = false;
            }
        };

        LocalNative.handleChangeNickname = function(player, params) {
            var nickname = params && params.nickname;
            var store = LocalNative.readRaw();
            if (!store || !store.level || !store.level.player ||
                typeof nickname !== 'string' || !nickname.replace(/\s/g, '').length) {
                player.rpc_c_change_nickname_failed({msg: 'nickname_null'});
                return false;
            }
            // The stock Rename UI already validates length and allowed characters.
            var saved = store.level.player;
            var free = Number(saved.nickname_free) || 0;
            // Same request may be delivered again; never charge twice.
            if (saved.nickname !== nickname || free > 0) {
                if (free > 0) free--;
                else {
                    var rm = LocalNative.getResourceManager();
                    if (typeof NICKNAME_CHANGE_COST === 'undefined' || !rm ||
                        !rm.useRes(NICKNAME_CHANGE_COST, RES_TYPE_DIAMOND)) {
                        player.rpc_c_change_nickname_failed({msg: 'notice_1'});
                        return false;
                    }
                    if (rm.Res) saved.diamond = rm.Res[RES_TYPE_DIAMOND];
                }
                saved.nickname = nickname;
                saved.nickname_free = free;
                LocalNative.writeRaw(store);
            }
            player.rpc_c_change_nickname_ans({nickname: saved.nickname, nickname_free: saved.nickname_free});
            LocalNative.writeStatus({step: 'change-nickname-ok', nickname: saved.nickname,
                nickname_free: saved.nickname_free});
            return true;
        };

        LocalNative.installCallServer = function(player) {
            if (!player || player.__localNativeCallServer) return;
            var orig = player.callServer ? player.callServer.bind(player) : null;
            player.callServer = function(methodName, params) {
                var entry = { t: Date.now(), method: methodName };
                try {
                    if (params != null && typeof params === 'object') {
                        entry.keys = Object.keys(params);
                        entry.snap = {};
                        for (var i = 0; i < entry.keys.length && i < 12; i++) {
                            var k = entry.keys[i];
                            var v = params[k];
                            if (v == null || typeof v === 'number' || typeof v === 'string' || typeof v === 'boolean')
                                entry.snap[k] = v;
                        }
                    }
                } catch (e) {}
                LocalNative.callLog.push(entry);
                if (LocalNative.callLog.length > 80) LocalNative.callLog.shift();

                if (methodName === 'rpc_s_dispatch_soldier')
                    return LocalNative.handleDispatchSoldier(params || {});

                if (methodName === 'rpc_s_enter_arena_battle' || methodName === 'rpc_s_gain_arena_rewards') {
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleArenaRpc(player, methodName);
                    }, 0);
                    return true;
                }
                if (LocalNative.arenaSession && !LocalNative.arenaSession.closed) {
                    if (methodName === 'rpc_s_complete_battle' || methodName === 'rpc_s_complete_pve_battle') {
                        LocalNative.scheduleOnRoot(function() {
                            LocalNative.completeArenaBattle(player, false);
                        }, 0);
                        return true;
                    }
                    if (methodName === 'rpc_s_battle_to_home' || methodName === 'rpc_s_leave_battle') {
                        LocalNative.scheduleOnRoot(function() {
                            LocalNative.arenaBattleToHome(player, methodName === 'rpc_s_leave_battle');
                        }, 0);
                        return true;
                    }
                    if (methodName === 'rpc_s_pve_battle_start' ||
                        methodName === 'rpc_s_set_intermediate_battle_result') return true;
                }

                if (methodName === 'rpc_s_refresh_sign_rewards' || methodName === 'rpc_s_set_sign_show_times' ||
                    methodName === 'rpc_s_get_sign_reward' || methodName === 'rpc_s_retroactive_sign_reward') {
                    LocalNative.scheduleOnRoot(function() {
                        try {
                            if (methodName === 'rpc_s_get_sign_reward')
                                LocalNative.handleMonthlySignReward(player, params || {});
                            else {
                                LocalNative.refreshMonthlySign(player, methodName === 'rpc_s_set_sign_show_times');
                                if (methodName === 'rpc_s_retroactive_sign_reward' && UI.Waiting)
                                    UI.Waiting.getInstance().cancelWait('rpc_s_retroactive_sign_reward', true);
                            }
                        } catch (eMonthly) {
                            LocalNative.syncMonthlySign(player, LocalNative.readRaw().level);
                            LocalNative.writeStatus({step: 'monthly-sign-ERR', error: String(eMonthly)});
                        }
                    }, 0);
                    return true;
                }
                if (methodName === 'rpc_s_get_rookie_sign_reward') {
                    LocalNative.scheduleOnRoot(function() {
                        try { LocalNative.handleRookieSignReward(player); }
                        catch (eSign) {
                            LocalNative.syncRookieSign(player, LocalNative.readRaw().level);
                            LocalNative.writeStatus({step: 'rookie-sign-claim-ERR', error: String(eSign)});
                        }
                    }, 0);
                    return true;
                }
                if (methodName === 'rpc_s_request_chat_and_letter') {
                    LocalNative.scheduleOnRoot(function() {
                        var letterStore = LocalNative.readRaw();
                        LocalNative.ensureWelcomeLetter(letterStore.level.player);
                        LocalNative.writeRaw(letterStore);
                        player.rpc_c_load_letter({letters: letterStore.level.player.letters || [],
                            sys_letters: letterStore.level.player.sys_letters || []});
                    }, 0);
                    return true;
                }
                if (methodName === 'rpc_s_gain_letter_reward' && params &&
                    params.letter_id === 'local_goddess_newbie_gift') {
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleWelcomeLetterReward(player, params);
                    }, 0);
                    return true;
                }

                if (methodName === 'rpc_s_refresh_trader' || methodName === 'rpc_s_reset_trader' ||
                    methodName === 'rpc_s_trader_buy' || methodName === 'rpc_s_coin_exchange' ||
                    methodName === 'rpc_s_buy_coin_shop_item') {
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.runTraderRequest(player, methodName, params || {});
                    }, 0);
                    return true;
                }

                if (methodName === 'rpc_s_drawcard' || methodName === 'rpc_s_gain_drawcard' ||
                    methodName === 'rpc_s_dismiss_drawcard' || methodName === 'rpc_s_buy_package' ||
                    methodName === 'rpc_s_use_item' || methodName === 'rpc_s_compose_item_inputevent' ||
                    methodName === 'rpc_s_buy_package_slot' || methodName === 'rpc_s_compose_equipment') {
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.runShopRequest(player, methodName, params || {});
                    }, 0);
                    return true;
                }

                if (methodName === 'rpc_s_change_nickname') {
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleChangeNickname(player, params || {});
                    }, 0);
                    return true;
                }

                if (methodName === 'rpc_s_finish_daily_quest' ||
                    methodName === 'rpc_s_refresh_daily_quest' ||
                    methodName === 'rpc_s_finish_main_quest') {
                    LocalNative.scheduleOnRoot(function() {
                        try {
                            if (methodName === 'rpc_s_finish_daily_quest')
                                LocalNative.handleFinishDailyQuest(player, params || {});
                            else if (methodName === 'rpc_s_refresh_daily_quest')
                                LocalNative.handleRefreshDailyQuest(player, params || {});
                            else LocalNative.handleFinishMainQuest(player, params || {});
                        } catch (eQuest) {
                            LocalNative.shopSync(player, LocalNative.readRaw().level);
                            LocalNative.writeStatus({
                                step: 'quest-rpc-ERR', method: methodName, error: String(eQuest)
                            });
                            if (typeof G_MainController !== 'undefined')
                                G_MainController.setNotice(String(eQuest));
                        }
                    }, 0);
                    return true;
                }

                if (methodName === 'rpc_s_enter_battle' || methodName === 'rpc_s_enter_next_battle') {
                    LocalNative.writeStatus({step: 'callServer-' + methodName});
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleEnterPvpBattle(player);
                    }, 0);
                    return true;
                }
                if (methodName === 'rpc_s_complete_battle' && LocalNative.pvpSession &&
                    !LocalNative.pvpSession.closed) {
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleCompletePvpBattle(player);
                    }, 0);
                    return true;
                }
                if ((methodName === 'rpc_s_battle_to_home' || methodName === 'rpc_s_leave_battle') &&
                    LocalNative.pvpSession && !LocalNative.pvpSession.closed) {
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handlePvpBattleToHome(player);
                    }, 0);
                    return true;
                }

                // Stock state/index updates are optimistic; replace only their
                // server persistence and never finish Rookie processes manually.
                if (methodName === 'rpc_s_reincarnate_hero') {
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleHeroReincarnate(player, params || {});
                    }, 0);
                    return true;
                }
                if (methodName === 'rpc_s_swallow_heros')
                    return LocalNative.handleHeroSwallow(player, params || {});
                if (methodName === 'rpc_s_promote') {
                    var promoteParams = params || {};
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleHeroPromote(player, promoteParams);
                    }, 0);
                    return true;
                }
                if (methodName === 'rpc_s_train_tech' || methodName === 'rpc_s_finish_training_now') {
                    var techParams = params || {}, techMethod = methodName;
                    LocalNative.scheduleOnRoot(function() {
                        if (techMethod === 'rpc_s_train_tech') LocalNative.handleTrainTech(player, techParams);
                        else LocalNative.finishResearch(player, techParams.tech_id);
                    }, 0);
                    return true;
                }
                if (methodName === 'rpc_s_put_on_equipment' || methodName === 'rpc_s_take_off_equipment' ||
                    methodName === 'rpc_s_replace_equipment')
                    return LocalNative.persistHeroEquipment(params || {});
                if (methodName === 'rpc_s_set_hero_defense')
                    return LocalNative.applyHeroDefense(params || {});
                if (methodName === 'rpc_s_set_hero_state' || methodName === 'rpc_s_set_attack_index') {
                    var heroStore = LocalNative.readRaw();
                    var heroParams = params || {};
                    var roster = heroStore && heroStore.level && heroStore.level.heros || [];
                    for (var hr = 0; hr < roster.length; hr++) {
                        if (String(roster[hr].sid) !== String(heroParams.uid)) continue;
                        if (methodName === 'rpc_s_set_hero_state') {
                            roster[hr].state = heroParams.heroState;
                            if (heroParams.heroState !== 1) roster[hr].aidx = -1;
                        } else roster[hr].aidx = heroParams.attack_index;
                        LocalNative.writeRaw(heroStore);
                        LocalNative.writeStatus({step: 'hero-assignment-saved', sid: roster[hr].sid,
                            state: roster[hr].state, aidx: roster[hr].aidx});
                        return true;
                    }
                    LocalNative.writeStatus({step: 'hero-assignment-missing', uid: heroParams.uid});
                    return false;
                }

                if (methodName === 'rpc_s_set_user_config') {
                    var patch = params;
                    if (params && params.offset != null && params.value != null)
                        patch = params;
                    else if (params && params.value != null && typeof params.value === 'object' && params.offset == null)
                        patch = params.value;
                    LocalNative.mergeUserConfig(patch || params || {});
                    return true;
                }

                // FirstMovie / Rookie opening — persist flag so continue skips movie.
                if (methodName === 'rpc_s_set_first_movie_played') {
                    try {
                        var storeFM = LocalNative.readRaw();
                        if (storeFM && storeFM.level && storeFM.level.player) {
                            storeFM.level.player.first_movie_played = 1;
                            storeFM.revision = (storeFM.revision || 0) + 1;
                            storeFM.updatedAt = Math.floor(Date.now() / 1000);
                            LocalNative.writeRaw(storeFM);
                        }
                        if (player) player.first_movie_played = 1;
                    } catch (eFM2) {}
                    LocalNative.writeStatus({step: 'callServer-rpc_s_set_first_movie_played'});
                    return true;
                }

                // New build: client already useRes + worker; ACK assigns sid then complete after buildTime.
                if (methodName === 'rpc_s_build') {
                    var selfB = player;
                    var pB = params || {};
                    LocalNative.writeStatus({
                        step: 'callServer-rpc_s_build',
                        keys: entry.keys || null,
                        snap: entry.snap || null,
                        typeid: pB.typeid != null ? pB.typeid : null
                    });
                    LocalNative.scheduleOnRoot(function() {
                        try {
                            // The request CID identifies the purchase. activeBuilder can
                            // change before this scheduled response and may be an old unit.
                            var pending = pB.cid != null ? G_UnitManager.getUnit(pB.cid) :
                                LocalNative.findPendingBuildUnit();
                            var purchaseBuilder = LocalNative.getBuildingBuilder(pending);
                            if (!purchaseBuilder || purchaseBuilder.state !== BUILD_STATE_BUILDING ||
                                (pB.typeid != null && Number(pending.typeid) !== Number(pB.typeid)))
                                throw new Error('Purchase target missing or mismatched CID: ' + pB.cid);
                            var cid = pB.cid != null ? pB.cid :
                                (pending && (pending.cid != null ? pending.cid :
                                    (pending.getCID ? pending.getCID() : null)));
                            var sid = (pB.sid != null ? pB.sid :
                                (pB.unit != null && typeof pB.unit === 'number' ? pB.unit : null));
                            if (sid == null) sid = LocalNative.allocateSid();
                            var typeid = pB.typeid != null ? pB.typeid :
                                (pending && (pending.typeid || pending.unit_type));
                            // Assign sid on the ghost BEFORE ans_build — live runs showed unit.sid
                            // staying null after stock rpc_c_ans_build alone.
                            if (pending) LocalNative.ensureUnitSid(pending, sid);
                            if (typeof selfB.rpc_c_ans_build === 'function') {
                                // Stock: GETCGC / getUnit(cid) → setSid(dict.unit). unit = server sid.
                                selfB.rpc_c_ans_build({
                                    success: true,
                                    id: sid,
                                    unit: sid,
                                    cid: cid,
                                    typeid: typeid
                                });
                            }
                            // Re-resolve and force sid again if stock ans missed the ghost.
                            var bound = pending;
                            try {
                                if ((!bound || bound.sid !== sid) && sid != null &&
                                    G_UnitManager && typeof G_UnitManager.getUnitBySID === 'function')
                                    bound = G_UnitManager.getUnitBySID(sid) || bound;
                            } catch (eByS) {}
                            try {
                                if ((!bound || bound.sid !== sid) && cid != null &&
                                    G_UnitManager && typeof G_UnitManager.getUnit === 'function')
                                    bound = G_UnitManager.getUnit(cid) || bound;
                            } catch (eByC) {}
                            if (bound) LocalNative.ensureUnitSid(bound, sid);
                            // Stamp beginTime so gem-cost / timer math is valid.
                            try {
                                var bbNew = bound ? LocalNative.getBuildingBuilder(bound) :
                                    LocalNative.activeBuilder;
                                if (bbNew && (bbNew.beginTime == null || !(bbNew.beginTime > 0)))
                                    bbNew.beginTime = (typeof getSystemCurrentTimeSec === 'function')
                                        ? getSystemCurrentTimeSec()
                                        : Math.floor(Date.now() / 1000);
                                if (bbNew && bbNew.state !== BUILD_STATE_BUILDING)
                                    bbNew.state = BUILD_STATE_BUILDING;
                                LocalNative.activeBuilder = bbNew || LocalNative.activeBuilder;
                            } catch (eBt) {}
                            LocalNative.pendingBuilds[sid] = {
                                sid: sid,
                                cid: cid,
                                typeid: typeid,
                                startedAt: Math.floor(Date.now() / 1000)
                            };
                            var buildTime = LocalNative.resolveBuildTime(typeid, bound || pending);
                            LocalNative.writeStatus({
                                step: 'ans-build',
                                sid: sid,
                                cid: cid,
                                typeid: typeid,
                                buildTime: buildTime,
                                unitSid: bound && bound.sid != null ? bound.sid : null,
                                hasBound: !!bound
                            });
                            LocalNative.tryDumpAndSave();
                            if (buildTime <= 0) {
                                LocalNative.ackBuildComplete(selfB, sid, 'immediate');
                            } else {
                                LocalNative.scheduleOnRoot(function() {
                                    LocalNative.ackBuildComplete(selfB, sid, 'timer');
                                }, buildTime);
                            }
                        } catch (err) {
                            LocalNative.lastError = String(err);
                            LocalNative.writeStatus({step: 'ack-build-ERR', error: String(err)});
                        }
                    }, 0);
                    return true;
                }

                if (methodName === 'rpc_s_upgrade_walls') {
                    var wallRowPlayer = player, wallRowParams = params;
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleUpgradeWalls(wallRowPlayer, wallRowParams);
                    }, 0);
                    return true;
                }

                // Upgrade start (original rpc_s_build_update) / legacy aliases.
                if (methodName === 'rpc_s_build_update' || methodName === 'rpc_s_upgrade' ||
                    methodName === 'rpc_s_building_upgrade') {
                    var selfU = player;
                    var pU = params || {};
                    LocalNative.writeStatus({
                        step: 'callServer-' + methodName,
                        keys: entry.keys || null,
                        snap: entry.snap || null
                    });
                    LocalNative.scheduleOnRoot(function() {
                        try {
                            var targetU = LocalNative.resolveBuildTarget(pU);
                            var sidU = targetU.sid;
                            var pendingU = targetU.unit;
                            if (!pendingU || sidU == null) throw new Error('Upgrade building not found');
                            var upgradeTicket = {
                                sid: sidU, cid: targetU.cid,
                                targetType: Number(pendingU.typeid) + 1
                            };
                            if (!LocalNative.lookupUnitMain(upgradeTicket.targetType))
                                throw new Error('Missing upgrade configuration ' + upgradeTicket.targetType);
                            LocalNative.pendingBuilds[sidU] = upgradeTicket;
                            LocalNative.completedSids[sidU] = false;
                            if (typeof selfU.rpc_c_ans_building_upgrade === 'function' && pendingU) {
                                selfU.rpc_c_ans_building_upgrade({success: true,
                                    cid: targetU.cid, id: sidU});
                            }
                            var buildTimeU = LocalNative.resolveBuildTime(
                                pU.typeid || (pendingU && pendingU.typeid), pendingU);
                            LocalNative.writeStatus({
                                step: 'ans-upgrade',
                                sid: sidU,
                                buildTime: buildTimeU
                            });
                            LocalNative.tryDumpAndSave();
                            if (sidU != null) {
                                if (buildTimeU <= 0) {
                                    LocalNative.ackBuildComplete(selfU, sidU, 'upgrade-immediate');
                                } else {
                                    LocalNative.scheduleOnRoot(function() {
                                        if (LocalNative.pendingBuilds[sidU] !== upgradeTicket) return;
                                        LocalNative.ackBuildComplete(selfU, sidU, 'upgrade-timer');
                                    }, buildTimeU);
                                }
                            }
                        } catch (errU) {
                            LocalNative.lastError = String(errU);
                            LocalNative.writeStatus({step: 'ack-upgrade-ERR', error: String(errU)});
                        }
                    }, 0);
                    return true;
                }

                // Gem/instant finish: client already useRes(DIAMOND); must ACK complete by cid/sid.
                if (methodName === 'rpc_s_build_finish_imm' || methodName === 'rpc_s_building_finish' ||
                    methodName === 'rpc_s_build_complete' || methodName === 'rpc_s_finish_build' ||
                    methodName === 'rpc_s_finish_imm' || methodName === 'rpc_s_build_finish') {
                    var selfF = player;
                    var pF = params || {};
                    LocalNative.writeStatus({
                        step: 'callServer-' + methodName,
                        keys: entry.keys || null,
                        snap: entry.snap || null
                    });
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.forceFinishBuilding(selfF, pF, methodName);
                    }, 0);
                    return true;
                }

                // Cancel upgrade — client refunds via addRes; accept and dump.
                if (methodName === 'rpc_s_build_update_cancel') {
                    LocalNative.writeStatus({
                        step: 'callServer-rpc_s_build_update_cancel',
                        keys: entry.keys || null,
                        snap: entry.snap || null
                    });
                    LocalNative.scheduleOnRoot(function() {
                        try { LocalNative.tryDumpAndSave(); } catch (eC) {}
                    }, 0);
                    return true;
                }

                if (methodName === 'rpc_s_move_to_tile' || methodName === 'rpc_s_set_to_tile') {
                    var self2 = player;
                    var p2 = params || {};
                    var ackMove = function() {
                        try {
                            var sidM = p2.sid != null ? p2.sid :
                                (p2.unit != null && typeof p2.unit === 'number' ? p2.unit :
                                    (p2.unit && p2.unit.sid));
                            if (typeof self2.rpc_c_set_to_tile === 'function') {
                                self2.rpc_c_set_to_tile({unit: sidM != null ? sidM : p2.unit || p2});
                            } else if (sidM != null) {
                                var u = G_UnitManager.getUnitBySID(sidM);
                                if (u && typeof u.server_set_to_tile === 'function')
                                    u.server_set_to_tile(p2);
                            }
                            LocalNative.tryDumpAndSave();
                        } catch (err2) {
                            LocalNative.lastError = String(err2);
                        }
                    };
                    LocalNative.scheduleOnRoot(ackMove, 0);
                    return true;
                }

                // Network tick / logout etc.: ignore offline.
                if (methodName === 'rpc_s_network_tick' || methodName === 'rpc_s_logout')
                    return true;

                // Little Green Dragon Invasion (小绿龙入侵).
                if (methodName === 'rpc_s_enter_invasion') {
                    var selfInv = player;
                    LocalNative.writeStatus({step: 'callServer-rpc_s_enter_invasion'});
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleEnterInvasion(selfInv, {});
                    }, 0);
                    return true;
                }
                if (methodName === 'rpc_s_invasion_wave_ready') {
                    var selfWr = player;
                    LocalNative.writeStatus({step: 'callServer-rpc_s_invasion_wave_ready'});
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleInvasionWaveReady(selfWr, {});
                    }, 0);
                    return true;
                }
                if (methodName === 'rpc_s_invasion_wave_start') {
                    LocalNative.writeStatus({step: 'callServer-rpc_s_invasion_wave_start'});
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleInvasionWaveStart(player, params || {});
                    }, 0);
                    return true;
                }
                if (methodName === 'rpc_s_invasion_wave_end') {
                    var selfWe = player;
                    var pWe = params || {};
                    LocalNative.writeStatus({
                        step: 'callServer-rpc_s_invasion_wave_end',
                        succeed: !!(pWe && pWe.succeed)
                    });
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleInvasionWaveEnd(selfWe, pWe);
                    }, 0);
                    return true;
                }
                if (methodName === 'rpc_s_leave_invasion' ||
                    methodName === 'rpc_s_invasion_to_home') {
                    var selfIh = player;
                    LocalNative.writeStatus({step: 'callServer-' + methodName});
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleInvasionToHome(selfIh, {});
                    }, 0);
                    return true;
                }

                // Rookie story after first bunker: start_replay_pve → enemy attack replay (stage 20001).
                if (methodName === 'rpc_s_enter_enemy_attack_replay') {
                    var selfEar = player;
                    var pEar = params || {};
                    LocalNative.writeStatus({
                        step: 'callServer-rpc_s_enter_enemy_attack_replay',
                        keys: entry.keys || null,
                        snap: entry.snap || null
                    });
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleEnterEnemyAttackReplay(selfEar, pEar);
                    }, 0);
                    return true;
                }
                // Local enemy replay runs stock live AI, whose natural finish
                // sends the normal result RPC. Supply the local completion path
                // only for this bound raid, then reuse the original replay exit.
                if (methodName === 'rpc_s_complete_battle' && LocalNative.raidController &&
                    LocalNative.raidController.__localRaidSession === LocalNative.replaySession &&
                    LocalNative.replaySession && !LocalNative.replaySession.closed) {
                    LocalNative.writeStatus({step: 'local-raid-result-received'});
                    LocalNative.pushSettleTrace({
                        kind: 'rpc',
                        rpc: 'rpc_s_complete_battle',
                        gc: LocalNative.snapshotSettleGc(LocalNative.raidController),
                        paramKeys: entry.keys || null
                    });
                    LocalNative.queueLocalRaidReplayEnd(LocalNative.raidController);
                    return true;
                }
                if (methodName === 'rpc_s_complete_pve_battle') {
                    var selfPveDone = player;
                    var pPveDone = params || {};
                    LocalNative.writeStatus({
                        step: 'callServer-rpc_s_complete_pve_battle',
                        keys: entry.keys || null,
                        snap: entry.snap || null
                    });
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleCompletePveBattle(selfPveDone, pPveDone);
                    }, 0);
                    return true;
                }
                if (methodName === 'rpc_s_set_intermediate_battle_result')
                    return true;
                if (methodName === 'rpc_s_finish_enemy_attack_replay') {
                    var selfFer = player;
                    var pFer = params || {};
                    LocalNative.writeStatus({
                        step: 'callServer-rpc_s_finish_enemy_attack_replay',
                        keys: entry.keys || null,
                        snap: entry.snap || null
                    });
                    LocalNative.pushSettleTrace({
                        kind: 'rpc',
                        rpc: 'rpc_s_finish_enemy_attack_replay',
                        gc: LocalNative.snapshotSettleGc(LocalNative.raidController),
                        first_time_stage: player && player.first_time_stage
                    });
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleFinishEnemyAttackReplay(selfFer, pFer);
                    }, 0);
                    return true;
                }
                if (methodName === 'rpc_s_battle_to_home' || methodName === 'rpc_s_leave_battle') {
                    var selfBth = player;
                    var pBth = params || {};
                    var raidActive = LocalNative.isLocalRaidActive();
                    var pveActive = LocalNative.isLocalPveBattleActive();
                    LocalNative.writeStatus({
                        step: 'callServer-' + methodName,
                        keys: entry.keys || null,
                        snap: entry.snap || null,
                        raidActive: raidActive,
                        pveActive: pveActive
                    });
                    LocalNative.pushSettleTrace({
                        kind: 'rpc',
                        rpc: methodName,
                        gc: LocalNative.snapshotSettleGc(
                            raidActive ? LocalNative.raidController : LocalNative.getBattleController())
                    });
                    LocalNative.scheduleOnRoot(function() {
                        if (raidActive) {
                            LocalNative.handleFinishEnemyAttackReplay(selfBth, pBth);
                        } else if (pveActive || methodName === 'rpc_s_battle_to_home') {
                            LocalNative.handlePveBattleToHome(selfBth, {
                                early: methodName === 'rpc_s_leave_battle' &&
                                    !(LocalNative.pveSession && LocalNative.pveSession.completed)
                            });
                        } else {
                            LocalNative.handleBattleToHome(selfBth, pBth);
                        }
                    }, 0);
                    return true;
                }
                // Later rookie PVE battle entry — stub so guide is not blocked.
                if (methodName === 'rpc_s_enter_rookie_pve_battle') {
                    var selfRpb = player;
                    var pRpb = params || {};
                    LocalNative.writeStatus({
                        step: 'callServer-rpc_s_enter_rookie_pve_battle',
                        keys: entry.keys || null,
                        snap: entry.snap || null
                    });
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleEnterEnemyAttackReplay(selfRpb, pRpb);
                    }, 0);
                    return true;
                }

                // Campaign chapter map → PVEInfo 进击.
                if (methodName === 'rpc_s_get_pve_egg') {
                    return LocalNative.handlePveMapEgg(player, params || {});
                }
                if (methodName === 'rpc_s_pve_sweep') {
                    var selfSweep = player;
                    var pSweep = params || {};
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handlePveSweep(selfSweep, pSweep);
                    }, 0);
                    return true;
                }
                if (methodName === 'rpc_s_refresh_sweepinfo') {
                    var selfRefSweep = player;
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleRefreshSweepInfo(selfRefSweep);
                    }, 0);
                    return true;
                }
                if (methodName === 'rpc_s_enter_pve_battle') {
                    var selfPve = player;
                    var pPve = params || {};
                    LocalNative.writeStatus({
                        step: 'callServer-rpc_s_enter_pve_battle',
                        level: pPve.level != null ? pPve.level : pPve.stage,
                        keys: entry.keys || null,
                        snap: entry.snap || null
                    });
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleEnterPveBattle(selfPve, pPve);
                    }, 0);
                    return true;
                }

                // Wild Adventure (荒野探险): search animation waits on enter ans.
                if (methodName === 'rpc_s_enter_dice_event') {
                    var selfAdv = player;
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleEnterDiceEvent(selfAdv);
                    }, 0);
                    return true;
                }
                if (methodName === 'rpc_s_reset_dice_event1') {
                    return LocalNative.handleResetDiceEvent1(player);
                }
                if (methodName === 'rpc_s_clear_dice_event1_interval') {
                    return LocalNative.handleClearDiceEvent1Interval(player);
                }
                if (methodName === 'rpc_s_dice_event2_do_torture') {
                    var selfTor = player;
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleDiceEvent2Torture(selfTor);
                    }, 0);
                    return true;
                }
                if (methodName === 'rpc_s_dice_event2_do_release') {
                    var selfRel = player;
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleDiceEvent2Release(selfRel);
                    }, 0);
                    return true;
                }
                if (methodName === 'rpc_s_load_dice_event1_pve') {
                    return LocalNative.handleLoadDiceEvent1Pve(player);
                }
                if (methodName === 'rpc_s_refresh_wanted' || methodName === 'rpc_s_reset_wanted' ||
                    methodName === 'rpc_s_reset_wanted_time' || methodName === 'rpc_s_load_hunter_pve' ||
                    methodName === 'rpc_s_get_help_for_wanted' ||
                    methodName === 'rpc_s_get_reward_after_hunter_pve' ||
                    (methodName === 'rpc_s_run_server_trigger' && LocalNative.pveSession &&
                        LocalNative.pveSession.localNativeWanted))
                {
                    if (methodName === 'rpc_s_run_server_trigger')
                        return LocalNative.handleWantedRpc(player, methodName, params);
                    var wantedMethod = methodName, wantedParams = params, wantedPlayer = player;
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleWantedRpc(wantedPlayer, wantedMethod, wantedParams);
                    }, 0);
                    return true;
                }

                // Region map / chat / heartbeat / battle-time tick — swallow quietly
                // (adjust_battle_time was wiping the 120-entry status ring during idle battle).
                if (methodName === 'rpc_s_request_region_map' || methodName === 'rpc_s_region_map' ||
                    methodName === 'rpc_s_get_region_map' || methodName === 'rpc_s_heartbeat' ||
                    methodName === 'rpc_s_ping' || methodName === 'rpc_s_chat' ||
                    methodName === 'rpc_s_world_chat' || methodName === 'rpc_s_sync_time' ||
                    methodName === 'rpc_s_adjust_battle_time')
                    return true;

                LocalNative.writeStatus({
                    step: 'callServer-unhandled',
                    method: methodName,
                    keys: entry.keys || null,
                    snap: entry.snap || null
                });
                cc.log('DinoLocal native unhandled callServer: ' + methodName);
                if (orig) {
                    try { return orig(methodName, params); } catch (e3) {
                        LocalNative.lastError = String(e3);
                        return false;
                    }
                }
                return true;
            };
            player.__localNativeCallServer = true;
            player.callServerEnable = true;
        };

        LocalNative.ensureLeague = function() {
            // Plain stub only — a real ClientLeague instance registered in UnitManager
            // broke getPlayer().getComponent() during __buildUnit.
            var isRealLeague = false;
            try {
                isRealLeague = typeof ClientLeague === 'function' && G_League &&
                    (G_League instanceof ClientLeague || G_League.constructor === ClientLeague);
            } catch (eRL) {}
            if (!G_League || isRealLeague || !G_League.__localNativeLeagueStub)
                G_League = {__localNativeLeagueStub: true, league_id: 0};
            var L = G_League;
            L.__localNativeLeagueStub = true;
            if (L.league_id == null) L.league_id = 0;
            // Blue capsule under avatar reads league name; keep defined empty strings.
            if (L.name == null) L.name = '';
            if (L.desc == null) L.desc = '';
            if (L.flag == null) L.flag = '';
            if (L.leagueName == null) L.leagueName = '';
            var zero = function() { return 0; };
            var empty = function() { return ''; };
            var no = function() { return false; };
            var noop = function() {};
            var stubs = {
                requestLeagueInfo: noop, refreshLeagueInfo: noop, setLeagueInfo: noop,
                clearLeagueInfo: noop, setLeagueID: function(id) { this.league_id = id; },
                getLeagueID: function() { return this.league_id || 0; },
                hasLeague: no, leaveLeague: noop, joinLeague: noop, changeLeague: noop,
                registerLeagueUnit: noop, hasLeagueUnit: no, promoteElder: noop,
                demoteElder: noop, delLeagueMember: noop, promoteChief: noop,
                getLeagueRelatedUIs: function() { return []; },
                getLeaguePosition: zero, getDungeonRemainSecs: zero, inCalculateTime: no,
                calculatingRemainSecs: zero, getRemainDungeonCount: zero,
                getCreatedDungeonCount: zero, getDungeonStage: zero, getFund: zero,
                costFund: noop, changeFund: noop, subscribeFund: noop, upgrade: noop,
                changeName: noop, create_dungeon_succ: noop, create_dungeon_fail: noop,
                enter_dungeon_fail: noop, changeLevel: noop,
                getLevel: zero, getScore: zero, getScoreLimit: zero, getMemberCount: zero,
                getLeagueName: empty, getDesc: empty, getFlag: empty, getJoinType: zero,
                hasLeagueInfo: no, isLeagueMember: no, hasElders: no, hasOtherMember: no,
                hasElderAuthority: no, hasChiefAuthority: no, isEldersFull: no,
                isMemeberFull: no, hasRequireScore: no, isRefused: no, canJoinIn: no,
                isMaxLevel: no, hasImmoed: no, setImmoed: noop,
                judgeDungeonHasEntered: no, setDungeonHasEntered: noop,
                refreshDeadTime: noop, refreshDailyEvent: noop, refreshLeagueUI: noop,
                refreshFundDisplay: noop, getMembers: function() { return []; },
                getDungeonHistory: function() { return []; }, getTechInfo: function() { return {}; },
                getUnlockTech: function() { return []; }, getUnlockedTechTypes: function() { return []; },
                getAddMember: zero, getUnlockDungeonStage: zero, getMaintainCost: zero,
                getAddedTechFreeTimes: zero, getLevelFrame: empty, getFlagFrame: empty,
                enterWorldAction: noop, notice: noop, updateInfo: noop, onDataChanged: noop,
                getComponent: function() { return null; }, setComponent: noop,
                initByServer: noop, destroy: noop
            };
            for (var k in stubs) {
                if (typeof L[k] !== 'function') L[k] = stubs[k];
            }
            LocalNative.writeStatus({step: 'ensureLeague', mode: 'stub', inCalc: true});
            return L;
        };

        LocalNative.applyPlayerFallback = function(player, dict) {
            if (!player || !dict) return;
            var keys = [
                'nickname', 'nickname_free', 'account', 'account_id', 'accountID', 'gameid',
                'level', 'soldiers', 'protect_time', 'protect_time_p', 'busyWorker',
                'first_movie_played', 'rookie_protect', 'is_rookie_pve', 'spirit_free',
                'consecutive_days', 'first_time_stage', 'synthesis_score', 'defence_score',
                'arena_score', 'buffs', 'availableStages', 'finishedVirtualStages',
                'pve_awardBox', 'stage', 'pveStage', 'pve_mode', 'activity_params',
                'pvp_fake_times', 'wanted_id', 'rookie_promote_hero', 'league_id',
                'apply_backup_time', 'online_time', 'login_time', 'access_token',
                'diamond', 'spirit', 'league_points', 'christmas_points', 'frozen_d', 'unfrozen_t',
                'exp', 'experience', 'new_message', 'login_warn_attack_num', 'unlooked_attack_num',
                'letters', 'sys_letters', 'letter_paper_num', 'last_send_letter_time',
                'update_info', 'battle_recorders', 'main_quest', 'finish_main_quest_timestamp',
                'hero_slot_num', 'hero_slot_buy_num', 'achieve_raw', 'gained_achieve'
            ];
            for (var i = 0; i < keys.length; i++) {
                var k = keys[i];
                if (dict[k] !== undefined) player[k] = dict[k];
            }
            if (dict.new_hero_type !== undefined) player.newHeroType = dict.new_hero_type;
            if (dict.nickname) {
                player.nickname = dict.nickname;
                if (player.name == null || player.name === '' || player.name === undefined)
                    player.name = dict.nickname;
                if (player.nick == null || player.nick === undefined)
                    player.nick = dict.nickname;
            }
            if (player.defence_score == null) player.defence_score = dict.defence_score || 0;
            if (player.arena_score == null) player.arena_score = dict.arena_score || 0;
            LocalNative.ensurePlayerSocialFields(player);
            try {
                if (player.resourceManager && typeof player.resourceManager.init === 'function') {
                    player.resourceManager.init(dict);
                } else if (typeof ResourceManager !== 'undefined' && player.resourceManager) {
                    ResourceManager.prototype.init.call(player.resourceManager, dict);
                }
            } catch (eRes) {}
            try {
                LocalNative.seedPlayerComponents(player);
            } catch (eComp) {}
        };

        LocalNative.seedPlayerComponents = function(player) {
            if (!player || typeof player.getComponent !== 'function') return;
            // BattleSelect reads getRegionConfig(RankManager.getRegionID()).
            // Offline accounts have no server-assigned region. Use an existing
            // open/free row from the original table; never fabricate UI config.
            try {
                var regions = player.getAllRegionConfig();
                var rank = player.getComponent('RankManager');
                if (regions && rank && !regions[rank.regionID]) {
                    var regionID = player.region_id;
                    if (!regions[regionID]) {
                        regionID = null;
                        for (var regionKey in regions) {
                            if (!Object.prototype.hasOwnProperty.call(regions, regionKey)) continue;
                            var region = regions[regionKey];
                            if (region && region.v_server_open && region.v_server_is_free &&
                                region.v_server_allow_in) {
                                regionID = Number(regionKey);
                                break;
                            }
                        }
                    }
                    if (regionID != null && regions[regionID]) {
                        rank.regionID = regionID;
                        player.region_id = regionID;
                        if (!rank.regionInfo) rank.regionInfo = [0,0,0,0,0,0,0,0,0];
                        if (rank.regionScore == null) rank.regionScore = 0;
                        LocalNative.writeStatus({step: 'local-region-seeded', region: regionID,
                            name: regions[regionID].v_server_name});
                    }
                }
            } catch (eRegion) {
                LocalNative.writeStatus({step: 'local-region-ERR', error: String(eRegion)});
            }
            try {
                if (typeof Comp !== 'undefined' && Comp.NewMessage) {
                    var nm = player.getComponent(Comp.NewMessage);
                    if (nm) {
                        if (nm.new_message == null) nm.new_message = player.new_message || 0;
                        if (nm.login_warn_attack_num == null)
                            nm.login_warn_attack_num = player.login_warn_attack_num || 0;
                        if (nm.unlooked_attack_num == null)
                            nm.unlooked_attack_num = player.unlooked_attack_num || 0;
                    }
                }
            } catch (eNM) {}
            try {
                if (typeof Comp !== 'undefined' && Comp.LetterManager) {
                    var lm = player.getComponent(Comp.LetterManager);
                    if (lm) {
                        if (!lm.letters) lm.letters = player.letters || [];
                        if (!lm.sysLetters) lm.sysLetters = player.sys_letters || [];
                        if (!lm.letterMap) lm.letterMap = {};
                        if (lm.letterPaperNum == null)
                            lm.letterPaperNum = player.letter_paper_num || 0;
                        if (lm.lastSendLetterTime == null)
                            lm.lastSendLetterTime = player.last_send_letter_time || 0;
                        if (lm.new_message == null) lm.new_message = 0;
                    }
                }
            } catch (eLM) {}
            try {
                if (typeof Comp !== 'undefined' && Comp.BattleRecorder) {
                    var br = player.getComponent(Comp.BattleRecorder);
                    if (br) {
                        if (!br.battle_recorders)
                            br.battle_recorders = player.battle_recorders || [];
                        if (!br.battleLog) br.battleLog = br.battle_recorders;
                    }
                }
            } catch (eBR) {}
            try {
                LocalNative.ensureQuestManagerSafe();
                LocalNative.ensureLiveQuestSeed();
            } catch (eQuest) {
                LocalNative.writeStatus({step: 'quest-component-seed-ERR', error: String(eQuest)});
            }
            try {
                var am = player.getComponent('AdventureManager');
                if (am) {
                    var savedAdv = null;
                    try {
                        var rawAdv = LocalNative.readRaw();
                        savedAdv = rawAdv && rawAdv.level && LocalNative.readAdventureState(rawAdv.level);
                    } catch (eReadAdv) {}
                    if (am.adventure_status == null)
                        am.adventure_status = savedAdv ? savedAdv.adventure_status : 0;
                    if (am.dice_event2_id == null)
                        am.dice_event2_id = savedAdv ? savedAdv.dice_event2_id : 0;
                    if (am.dice_event2_cost == null)
                        am.dice_event2_cost = savedAdv ? savedAdv.dice_event2_cost : 0;
                }
            } catch (eAdv) {
                LocalNative.writeStatus({step: 'adventure-component-seed-ERR', error: String(eAdv)});
            }
        };

        LocalNative.lastBuildingCount = 0;
        LocalNative.buildController = null;
        LocalNative.getBuildController = function() {
            if (LocalNative.buildController) return LocalNative.buildController;
            try { if (typeof GETGC === 'function') return GETGC(); } catch (e1) {}
            try { if (typeof GETCGC === 'function') return GETCGC(); } catch (e1b) {}
            try { if (typeof DA !== 'undefined' && DA.getGameController) return DA.getGameController(); } catch (e2) {}
            return null;
        };

        LocalNative.getMenuController = function() {
            try {
                var gc = LocalNative.getBuildController();
                if (gc && gc.menu) return gc.menu;
            } catch (e0) {}
            try { if (typeof GETMC === 'function') return GETMC(); } catch (e1) {}
            try { if (typeof DA !== 'undefined' && DA.getMenuController) return DA.getMenuController(); } catch (e2) {}
            return null;
        };

        LocalNative.getScheduleRoot = function() {
            try {
                var mc = LocalNative.getMenuController();
                if (mc && mc.rootNode) return mc.rootNode;
            } catch (e1) {}
            try {
                var gc = LocalNative.getBuildController();
                if (gc && gc.rootNode) return gc.rootNode;
            } catch (e2) {}
            try {
                if (menu && menu.rootNode) return menu.rootNode;
            } catch (e3) {}
            return null;
        };

        LocalNative.setLabelText = function(node, text) {
            if (!node) return false;
            text = String(text);
            try {
                if (typeof node.setString === 'function') { node.setString(text); return true; }
            } catch (e1) {}
            try {
                if (node.controller && typeof node.controller.setString === 'function') {
                    node.controller.setString(text); return true;
                }
            } catch (e2) {}
            try {
                if (typeof node.setText === 'function') { node.setText(text); return true; }
            } catch (e3) {}
            try {
                if (node.getChildren && node.getChildren().length) {
                    var ch = node.getChildren();
                    for (var i = 0; i < ch.length; i++) {
                        if (LocalNative.setLabelText(ch[i], text)) return true;
                    }
                }
            } catch (e4) {}
            return false;
        };

        LocalNative.refreshHud = function() {
            try {
                if (G_Player) {
                    if (!G_Player.nickname) G_Player.nickname = 'LocalRookie';
                    if (G_Player.synthesis_score == null) G_Player.synthesis_score = 0;
                    if (G_Player.defence_score == null) G_Player.defence_score = 0;
                    if (G_Player.exp == null) G_Player.exp = 0;
                    if (G_Player.experience == null) G_Player.experience = 0;
                }
                var mc = LocalNative.getMenuController();
                var nick = (G_Player && G_Player.nickname) ? G_Player.nickname : 'LocalRookie';
                var score = G_Player && G_Player.synthesis_score != null ? G_Player.synthesis_score : 0;
                if (mc && typeof mc.updatePlayerLabel === 'function') mc.updatePlayerLabel();
                var setName = false;
                var setScore = false;
                var readBack = null;
                if (mc) {
                    setName = LocalNative.setLabelText(mc.UserName, nick) ||
                        LocalNative.setLabelText(mc.userName, nick) ||
                        LocalNative.setLabelText(mc.nickname, nick);
                    setScore = LocalNative.setLabelText(mc.NumScore, score) ||
                        LocalNative.setLabelText(mc.numScore, score);
                    // Blue capsule under avatar is exp (was literally "undefined").
                    try {
                        LocalNative.setLabelText(mc.exp, String(G_Player && G_Player.exp != null ? G_Player.exp : 0));
                    } catch (eExp) {}
                    ['LeagueName', 'leagueName', 'league', 'ClanName', 'clanName', 'level', 'Level'].forEach(function(k) {
                        try {
                            var node = mc[k];
                            if (!node) return;
                            var cur = null;
                            try { if (typeof node.getString === 'function') cur = node.getString(); } catch (eG) {}
                            if (cur != null && String(cur).indexOf('undefined') >= 0) {
                                if (k === 'level' || k === 'Level')
                                    LocalNative.setLabelText(node, String(G_Player && G_Player.level != null ? G_Player.level : 1));
                                else
                                    LocalNative.setLabelText(node, '');
                            } else if (k !== 'level' && k !== 'Level') {
                                LocalNative.setLabelText(node, '');
                            }
                        } catch (eLg) {}
                    });
                    try {
                        if (G_League) {
                            G_League.name = G_League.name || '';
                            G_League.leagueName = G_League.leagueName || '';
                            G_League.desc = G_League.desc || '';
                        }
                    } catch (eGL) {}
                    try {
                        if (mc.UserName && typeof mc.UserName.getString === 'function')
                            readBack = mc.UserName.getString();
                    } catch (eRB) {}
                }
                var undefLabels = [];
                if (mc) {
                    try {
                        for (var uk in mc) {
                            if (!Object.prototype.hasOwnProperty.call(mc, uk)) continue;
                            try {
                                var un = mc[uk];
                                if (!un || typeof un.getString !== 'function') continue;
                                var us = un.getString();
                                if (us != null && String(us).indexOf('undefined') >= 0) {
                                    undefLabels.push({k: uk, s: String(us)});
                                    LocalNative.setLabelText(un, uk === 'level' || uk === 'Level'
                                        ? String(G_Player && G_Player.level != null ? G_Player.level : 1)
                                        : '');
                                }
                            } catch (eUL) {}
                        }
                    } catch (eScan) {}
                }
                LocalNative.writeStatus({
                    step: 'refreshHud',
                    nick: G_Player ? G_Player.nickname : null,
                    score: G_Player ? G_Player.synthesis_score : null,
                    hasMC: !!mc,
                    hasUserName: !!(mc && mc.UserName),
                    setName: setName,
                    setScore: setScore,
                    readBack: readBack,
                    undefLabels: undefLabels
                });
                return true;
            } catch (eH) {
                LocalNative.writeStatus({step: 'refreshHud-ERR', error: String(eH)});
                return false;
            }
        };

        LocalNative.getBuildingBuilder = function(unit) {
            if (!unit) return null;
            if (typeof unit.getComponent === 'function') {
                try {
                    if (typeof Comp !== 'undefined' && Comp.BuildingBuilder) {
                        var c1 = unit.getComponent(Comp.BuildingBuilder);
                        if (c1) return c1;
                    }
                } catch (eC) {}
                try {
                    var c2 = unit.getComponent('BuildingBuilder');
                    if (c2) return c2;
                } catch (eN) {}
            }
            try {
                var list = unit.componentList || unit.components;
                if (list && list.length) {
                    for (var i = 0; i < list.length; i++) {
                        var c = list[i];
                        if (c && (typeof c.cancelBuilding === 'function' || typeof c.enableOK === 'function' ||
                            typeof c.onPressNO === 'function'))
                            return c;
                    }
                }
            } catch (eL) {}
            try {
                for (var k in unit) {
                    if (!Object.prototype.hasOwnProperty.call(unit, k)) continue;
                    var v = unit[k];
                    if (v && typeof v === 'object' &&
                        (typeof v.cancelBuilding === 'function' || typeof v.onPressNO === 'function'))
                        return v;
                }
            } catch (eP) {}
            return null;
        };

        // Grey OK on 驯龙场 etc. is original rely_base_lv gating — cancel blocked placement, do not force-enable.
        LocalNative.cancelBlockedPlacement = function() {
            try {
                var gc = LocalNative.getBuildController();
                if (!gc) return false;
                var candidates = [];
                if (gc.selectedTarget) candidates.push(gc.selectedTarget);
                try {
                    var b = gc.buildings;
                    if (b) {
                        if (typeof b.length === 'number') {
                            for (var i = 0; i < b.length; i++) if (b[i]) candidates.push(b[i]);
                        }
                        var keys = Object.keys(b);
                        for (var j = 0; j < keys.length; j++) if (b[keys[j]]) candidates.push(b[keys[j]]);
                    }
                } catch (eBld) {}
                var baseLv = 1;
                try {
                    baseLv = G_Player && typeof G_Player.getBaseLevel === 'function'
                        ? G_Player.getBaseLevel() : (G_Player && G_Player.level) || 1;
                } catch (eB) {}
                var saw = 0;
                for (var c = 0; c < candidates.length; c++) {
                    var bb = LocalNative.getBuildingBuilder(candidates[c]);
                    if (!bb) continue;
                    saw++;
                    var cfg = bb.config || {};
                    var rely = cfg.rely_base_lv;
                    var ut = bb.unit_type || cfg.unit_type ||
                        (bb.typeid ? Math.floor(bb.typeid / 100) : (cfg.typeid ? Math.floor(cfg.typeid / 100) : null));
                    var ok = null;
                    try { if (typeof bb.enableOK === 'function') ok = !!bb.enableOK(); } catch (eO) {}
                    // Only auto-cancel original rely_base_lv grey-OK (e.g. 驯龙场).
                    // Do NOT cancel on enableOK===false alone — Rookie/shop placement often
                    // reports false briefly and auto onPressNO freezes/kills the tutorial UI.
                    if (rely != null && baseLv < rely) {
                        LocalNative.writeStatus({
                            step: 'placement-check',
                            unit_type: ut,
                            typeid: bb.typeid || cfg.typeid || null,
                            rely_base_lv: rely,
                            baseLevel: baseLv,
                            enableOK: ok,
                            state: bb.state
                        });
                        if (typeof bb.onPressNO === 'function') bb.onPressNO();
                        else if (typeof bb.cancelBuilding === 'function') bb.cancelBuilding();
                        LocalNative.writeStatus({
                            step: 'placement-cancelled',
                            reason: 'rely_base_lv',
                            unit_type: ut,
                            rely_base_lv: rely,
                            baseLevel: baseLv,
                            enableOK: ok,
                            state: bb.state
                        });
                        return true;
                    }
                }
                if (!saw) {
                    // Only act when buy/select state is active or we have a tracked builder.
                    // Do NOT spam switchToNoneState while already s_none — it fights Rookie/UI.
                    var cancelled = false;
                    var reason = null;
                    var stName = null;
                    try {
                        if (gc.stateManager && gc.stateManager.curState != null)
                            stName = String(gc.stateManager.curState);
                    } catch (eSI) {}
                    try {
                        var ab = LocalNative.activeBuilder;
                        if (ab) {
                            var acfg = ab.config || {};
                            var arely = acfg.rely_base_lv;
                            if (arely != null && baseLv < arely) {
                                if (typeof ab.onPressNO === 'function') {
                                    ab.onPressNO(); cancelled = true; reason = 'activeBuilder.onPressNO';
                                } else if (typeof ab.cancelBuilding === 'function') {
                                    ab.cancelBuilding(); cancelled = true; reason = 'activeBuilder.cancelBuilding';
                                }
                            }
                        }
                    } catch (eAB) {}
                    var busy = stName && stName !== 's_none' && stName.indexOf('none') < 0;
                    if (!cancelled && busy) {
                        try {
                            if (typeof gc.onEvent === 'function') {
                                gc.onEvent('cancel_select_building');
                                cancelled = true; reason = 'cancel_select_building';
                            }
                        } catch (eEv) {}
                    }
                    // Avoid flooding status ring with identical idle checks.
                    var sig = [cancelled, reason, stName, !!LocalNative.activeBuilder, candidates.length].join('|');
                    if (cancelled || sig !== LocalNative._lastPlacementSig) {
                        LocalNative._lastPlacementSig = sig;
                        LocalNative.writeStatus({
                            step: cancelled ? 'placement-cancelled' : 'placement-check',
                            reason: reason,
                            unit_type: null,
                            candidates: candidates.length,
                            hasSelected: !!gc.selectedTarget,
                            baseLevel: baseLv,
                            stateInfo: {curState: stName},
                            hasActiveBuilder: !!LocalNative.activeBuilder
                        });
                    }
                    return cancelled;
                }
                return false;
            } catch (eP) {
                LocalNative.writeStatus({step: 'placement-check-ERR', error: String(eP)});
                return false;
            }
        };
        LocalNative.statusLog = [];
        LocalNative.writeStatus = function(obj) {
            try {
                obj.t = Date.now();
                LocalNative.statusLog.push(obj);
                if (LocalNative.statusLog.length > 120) LocalNative.statusLog.shift();
                // Throttle sqlite writes — sync setItem on every init step can freeze the GL thread.
                var now = obj.t;
                var step = obj.step || '';
                var important = step.indexOf('ERR') >= 0 || step.indexOf('soft') >= 0 ||
                    step === 'rpc_c_start_game' || step.indexOf('ans-') === 0 ||
                    step.indexOf('build-complete') === 0 || step.indexOf('force-finish') === 0 ||
                    step.indexOf('callServer-rpc_s_build') === 0 || step === 'diagnose' ||
                    step.indexOf('initByServer') === 0 || step.indexOf('initLevelFromData') === 0 ||
                    step.indexOf('initRookie') === 0 || step.indexOf('FirstMovie') === 0 ||
                    step.indexOf('beginRookie') === 0 || step.indexOf('new-account') === 0 ||
                    step.indexOf('_enterWorld') === 0 || step.indexOf('seed-starter') === 0 ||
                    step.indexOf('wake-defender') === 0 || step.indexOf('spawnStub') === 0 ||
                    step.indexOf('battle-units') === 0 || step.indexOf('battle-init') === 0 ||
                    step.indexOf('enter-enemy') === 0 || step.indexOf('ensureBattleClients') === 0 ||
                    step.indexOf('retest-enemy') === 0 || step.indexOf('settle') === 0 ||
                    step.indexOf('finish-enemy') === 0 || step.indexOf('local-raid') === 0 ||
                    step.indexOf('rpc_c_battle_to_home') === 0 || step.indexOf('user_config') === 0;
                if (!important && LocalNative._lastStatusWrite && (now - LocalNative._lastStatusWrite) < 400)
                    return;
                LocalNative._lastStatusWrite = now;
                sys.localStorage.setItem('dino.local.native.status', JSON.stringify({
                    latest: obj,
                    log: LocalNative.statusLog
                }));
            } catch (eS) {}
            try { cc.log('DinoLocal STATUS ' + (obj && obj.step ? obj.step : '')); } catch (e3) {}
        };

        LocalNative.afterWorldReady = function(gc) {
            try {
                if (gc) LocalNative.buildController = gc;
                try { LocalNative.startScoutCloudSync(); }
                catch (eScoutCloud) { LocalNative.scoutCloudStatus('start-failed', eScoutCloud.message); }
                // The response crosses scenes; an old-root close timer may be
                // removed during the transition. Confirm closure on the new home.
                LocalNative.closeLocalRaidSessionOnHome(gc);
                LocalNative.scheduleOnRoot(function() {
                    if (GS_CURRENT_STAGE === GS_STAGE_BUILD) {
                        var signStore = LocalNative.readRaw();
                        LocalNative.syncRookieSign(G_Player, signStore.level);
                        LocalNative.syncMonthlySign(G_Player, signStore.level);
                        LocalNative.writeRaw(signStore);
                        LocalNative.startRookieSignClock(gc);
                    }
                }, 1);
                try { LocalNative.refreshHud(); } catch (eHud) {}
                try { LocalNative.maybeRetestEnemyAttack(); } catch (eRetest) {}
                try {
                    LocalNative.writeStatus({
                        step: 'probe-30101',
                        info: LocalNative.probeUnitMain(30101)
                    });
                } catch (ePr) {}
                try {
                    LocalNative.seedStarterResources();
                } catch (eSeed2) {
                    LocalNative.writeStatus({step: 'seed-starter-res-throw', error: String(eSeed2)});
                }
                try { LocalNative.resumeConstructions(G_Player); } catch (eResu) {}
                try { LocalNative.startResearchClock(); } catch (eTechClock) {}
                // Earlier request may arrive before BUILD; stock load ACK ignores
                // that stage. Supply letters again only after home initialization.
                LocalNative.scheduleOnRoot(function() {
                    if (GS_CURRENT_STAGE !== GS_STAGE_BUILD) return;
                    var mailStore = LocalNative.readRaw();
                    LocalNative.ensureWelcomeLetter(mailStore.level.player);
                    LocalNative.writeRaw(mailStore);
                    if (mailStore.level.player.localWelcomeGiftClaimed &&
                        !mailStore.level.player.localWelcomeGiftReceiptV2) {
                        LocalNative.handleWelcomeLetterReward(G_Player, {letter_id:'local_goddess_newbie_gift'});
                        mailStore = LocalNative.readRaw();
                    }
                    G_Player.rpc_c_load_letter({letters: mailStore.level.player.letters || [],
                        sys_letters: mailStore.level.player.sys_letters || []});
                    LocalNative.writeStatus({step: 'home-letters-loaded',
                        count: mailStore.level.player.sys_letters.length});
                }, 1);

                try { LocalNative.tryDumpAndSave(); } catch (eDump) {}
                // Resume an opened-but-unclaimed tutorial egg after restart.
                LocalNative.scheduleOnRoot(function() {
                    var eggStore = LocalNative.readRaw();
                    var egg = eggStore && eggStore.level && eggStore.level.localTutorialEgg;
                    if (egg && !egg.claimed && GS_CURRENT_STAGE === GS_STAGE_BUILD)
                        LocalNative.handleTutorialEggDraw(G_Player, {buy_id: 100, free: true});
                    else if (eggStore && GS_CURRENT_STAGE === GS_STAGE_BUILD)
                        LocalNative.shopShowPending(G_Player, eggStore.level);
                }, 1);
                try {
                    var rootN = LocalNative.getScheduleRoot() ||
                        (gc && gc.menu && gc.menu.rootNode) ||
                        (gc && gc.rootNode) ||
                        (menu && menu.rootNode);
                    if (!rootN || typeof rootN.schedule !== 'function') return;
                    var triesCancel = 0;
                    var cancelTick = function() {
                        triesCancel++;
                        try { LocalNative.refreshHud(); } catch (eRH2) {}
                        // Re-seed gold/wood after holders finish registering.
                        if (triesCancel === 2 || triesCancel === 6 || triesCancel === 12) {
                            try { LocalNative.seedStarterResources(); } catch (eSd) {}
                            try { LocalNative.refreshResHud(); } catch (eRh) {}
                        }
                        if (triesCancel === 4 || triesCancel === 10 || triesCancel === 20) {
                            try { LocalNative.kickBeginRookie('afterInit-safety-' + triesCancel); } catch (eBk) {}
                        }
                        // Skip first ~4s so opening story / first placement can start.
                        if (triesCancel >= 8) {
                            try { LocalNative.cancelBlockedPlacement(); } catch (eCB) {}
                        }
                        if (triesCancel > 36) {
                            try { rootN.unschedule(cancelTick); } catch (eU) {}
                        }
                    };
                    rootN.schedule(cancelTick, 0.5);
                } catch (eSched) {}
            } catch (eAw) {
                LocalNative.writeStatus({step: 'afterWorldReady-ERR', error: String(eAw)});
            }
        };

        // When initRookieByServer throws (dict/config undefined offline), seed empty progress
        // and still schedule the original Rookie update / _beginRookie path.
        LocalNative.bootstrapRookieFallback = function(gc, userConfig) {
            try {
                if (!gc) return false;
                userConfig = userConfig && typeof userConfig === 'object' ? userConfig : {};
                if (!gc.finishedRookiePIDs) gc.finishedRookiePIDs = {};
                if (!gc.unfinishedRookiePIDs) gc.unfinishedRookiePIDs = {};
                if (!gc.curRookies) gc.curRookies = {};
                if (!gc.curProcesses) gc.curProcesses = {};
                if (!gc.allRookies) gc.allRookies = {};
                if (!gc.rookieRoots) gc.rookieRoots = [];
                try {
                    if (typeof Rookie !== 'undefined' && Rookie &&
                        typeof Rookie.decodeFinishedRookiePIDs === 'function') {
                        var decoded = Rookie.decodeFinishedRookiePIDs(userConfig) || {};
                        for (var dk in decoded) {
                            if (Object.prototype.hasOwnProperty.call(decoded, dk))
                                gc.finishedRookiePIDs[dk] = decoded[dk];
                        }
                    }
                } catch (eDec) {
                    LocalNative.writeStatus({step: 'decodeFinishedRookiePIDs-soft', error: String(eDec)});
                }
                try {
                    if (typeof Rookie !== 'undefined' && Rookie &&
                        typeof Rookie.copyRookieBits === 'function')
                        Rookie.copyRookieBits(userConfig.rookieBits || userConfig || {});
                } catch (eCopy) {}
                // Build unfinished list from data.rookie_controller roots when possible.
                try {
                    if (typeof data !== 'undefined' && data.rookie_controller && !gc.rookieRoots.length) {
                        var rc = data.rookie_controller;
                        var keys = Object.keys(rc);
                        for (var i = 0; i < keys.length; i++) {
                            var pid = keys[i];
                            var row = rc[pid];
                            if (!row) continue;
                            var father = row.rookie_father_PID;
                            if (father == null || father === 0 || father === '0') {
                                gc.rookieRoots.push(pid);
                                if (!gc.finishedRookiePIDs[pid])
                                    gc.unfinishedRookiePIDs[pid] = row;
                            }
                            gc.allRookies[pid] = row;
                        }
                    }
                } catch (eRoots) {
                    LocalNative.writeStatus({step: 'rookie-roots-soft', error: String(eRoots)});
                }
                try {
                    if (typeof gc._solveUnfinishedRookie === 'function')
                        gc._solveUnfinishedRookie();
                } catch (eSolve) {
                    LocalNative.writeStatus({step: '_solveUnfinishedRookie-soft', error: String(eSolve)});
                }
                try {
                    if (!gc.rookieUpdateHandle && gc.rootNode && typeof gc.rookieUpdate === 'function') {
                        var interval = gc.rookieUpdateInterval || 1;
                        if (typeof ROOKIE_DEFAULT_UPDATE_INTERVAL !== 'undefined')
                            interval = ROOKIE_DEFAULT_UPDATE_INTERVAL || interval;
                        gc.rootNode.schedule(function() {
                            try { gc.rookieUpdate(); } catch (eUp) {}
                        }, interval);
                        gc.rookieUpdateHandle = true;
                    }
                } catch (eSchedR) {}
                LocalNative.writeStatus({
                    step: 'bootstrapRookieFallback',
                    finishedN: Object.keys(gc.finishedRookiePIDs).length,
                    unfinishedN: Object.keys(gc.unfinishedRookiePIDs).length,
                    rootsN: gc.rookieRoots.length
                });
                LocalNative.scheduleOnRoot(function() {
                    LocalNative.kickBeginRookie('bootstrap-followup');
                }, 0.5);
                return true;
            } catch (eBoot) {
                LocalNative.writeStatus({step: 'bootstrapRookieFallback-ERR', error: String(eBoot)});
                return false;
            }
        };

        LocalNative.installEngineGuards = function() {
            protectSound();
            LocalNative.installBattleLifeBarColors();
            LocalNative.installManualHeroSkillGuard();
            LocalNative.installActiveSkillSeekFix();
            LocalNative.installRookieSignHooks();
            LocalNative.installSkillReplaceCostFix();
            LocalNative.writeStatus({step: 'installEngineGuards'});
            // Force a real TMX when mapConfig.tile is missing (native crash / empty map).
            try {
                if (Game && Game.MapManager && Game.MapManager.prototype && Game.MapManager.prototype.init) {
                    var origMapInit = Game.MapManager.prototype.init;
                    if (!origMapInit.__localNativePatched) {
                        Game.MapManager.prototype.init = function(config) {
                            config = config || {};
                            if (!config.tile) config.tile = 'map/world1.tmx';
                            if (!config.mapImage && typeof MAP_IMAGE_BUILD !== 'undefined')
                                config.mapImage = MAP_IMAGE_BUILD;
                            if (!config.size && typeof MAP_SIZE_BUILD !== 'undefined')
                                config.size = MAP_SIZE_BUILD;
                            LocalNative.writeStatus({
                                step: 'mapInit',
                                tile: config.tile,
                                hasImage: !!config.mapImage,
                                size: config.size || null
                            });
                            try {
                                return origMapInit.call(this, config);
                            } catch (eMI) {
                                LocalNative.writeStatus({step: 'mapInit-ERR', error: String(eMI)});
                                throw eMI;
                            }
                        };
                        Game.MapManager.prototype.init.__localNativePatched = true;
                    }
                }
            } catch (eMap) {
                LocalNative.writeStatus({step: 'mapGuard-ERR', error: String(eMap)});
            }
            // Trace player init + stage chain.
            try {
                if (ClientPlayer && ClientPlayer.prototype) {
                    var cpp = ClientPlayer.prototype;
                    LocalNative.installAccountProgressPersistence(cpp);
                    if (typeof cpp.initByServer === 'function' && !cpp.initByServer.__localNativePatched) {
                        var origIBS = cpp.initByServer;
                        cpp.initByServer = function(dict) {
                            LocalNative.writeStatus({
                                step: 'initByServer-enter',
                                keys: dict ? Object.keys(dict) : null,
                                nick: dict && dict.nickname
                            });
                            try {
                                var r = origIBS.apply(this, arguments);
                                LocalNative.writeStatus({
                                    step: 'initByServer-exit',
                                    nick: this.nickname,
                                    level: this.level,
                                    account: this.account
                                });
                                return r;
                            } catch (eIBS) {
                                // SocialBox/LetterManager often throw offline (new_message etc).
                                // Apply core player fields so initLevelFromData can still build units.
                                LocalNative.applyPlayerFallback(this, dict);
                                LocalNative.writeStatus({
                                    step: 'initByServer-soft',
                                    error: String(eIBS),
                                    nick: this.nickname,
                                    level: this.level,
                                    stack: (eIBS && eIBS.stack) ? String(eIBS.stack).split('\n').slice(0, 6) : null
                                });
                                try { LocalNative.refreshHud(); } catch (eRH) {}
                                return undefined;
                            } finally {
                                try {
                                    LocalNative.ensurePlayerSocialFields(this);
                                    LocalNative.seedPlayerComponents(this);
                                } catch (eFin) {}
                            }
                        };
                        cpp.initByServer.__localNativePatched = true;
                    }
                    ['changeStageAndInit', '__init_stage_build', 'rpc_c_start_game'].forEach(function(name) {
                        if (typeof cpp[name] !== 'function' || cpp[name].__localNativePatched) return;
                        var origFn = cpp[name];
                        cpp[name] = function() {
                            var arg0 = arguments[0];
                            var dict = name === 'changeStageAndInit' ? arguments[1] : arg0;
                            LocalNative.writeStatus({
                                step: name + '-enter',
                                argc: arguments.length,
                                stageArg: name === 'changeStageAndInit' ? arg0 : null,
                                dictKeys: (dict && typeof dict === 'object') ? Object.keys(dict) : null,
                                units: (dict && dict.units) ? dict.units.length : null
                            });
                            try {
                                var rr = origFn.apply(this, arguments);
                                LocalNative.writeStatus({
                                    step: name + '-exit',
                                    stage: typeof GS_CURRENT_STAGE !== 'undefined' ? GS_CURRENT_STAGE : null,
                                    nick: G_Player ? G_Player.nickname : null
                                });
                                return rr;
                            } catch (eFn) {
                                LocalNative.writeStatus({
                                    step: name + '-ERR',
                                    error: String(eFn),
                                    stack: (eFn.stack || '').split('\n').slice(0, 10)
                                });
                                throw eFn;
                            }
                        };
                        cpp[name].__localNativePatched = true;
                    });
                }
            } catch (eP) {}
            // Trace and soft-fail around initLevelFromData so later UI errors don't hide build results.
            try {
                LocalNative.writeStatus({
                    step: 'patch-build-proto',
                    hasGame: !!Game,
                    hasBuild: !!(Game && Game.GameControllerBuild),
                    hasProto: !!(Game && Game.GameControllerBuild && Game.GameControllerBuild.prototype),
                    hasILD: !!(Game && Game.GameControllerBuild && Game.GameControllerBuild.prototype &&
                        Game.GameControllerBuild.prototype.initLevelFromData)
                });
                if (Game && Game.GameControllerBuild && Game.GameControllerBuild.prototype) {
                    var bp = Game.GameControllerBuild.prototype;
                    if (typeof bp.initLevelFromData === 'function' && !bp.initLevelFromData.__localNativePatched) {
                        var origILD = bp.initLevelFromData;
                        bp.initLevelFromData = function(dict) {
                            LocalNative.restoreHomeClock();
                            LocalNative.writeStatus({
                                step: 'initLevelFromData-enter',
                                keys: dict ? Object.keys(dict) : null,
                                units: dict && dict.units ? dict.units.length : null
                            });
                            try {
                                var ret = origILD.call(this, LocalNative.makeHomeInitDict(dict));
                                LocalNative.writeStatus({
                                    step: 'initLevelFromData-exit',
                                    buildings: this.buildings ? (this.buildings.length != null ? this.buildings.length : Object.keys(this.buildings).length) : -1,
                                    typeToCid: this.typeToCid ? Object.keys(this.typeToCid).length : -1
                                });
                                return ret;
                            } catch (eILD) {
                                LocalNative.writeStatus({
                                    step: 'initLevelFromData-ERR',
                                    error: String(eILD),
                                    stack: (eILD && eILD.stack) ? String(eILD.stack).split('\n').slice(0, 8) : null,
                                    buildings: this.buildings ? (this.buildings.length != null ? this.buildings.length : Object.keys(this.buildings).length) : -1
                                });
                                throw eILD;
                            }
                        };
                        bp.initLevelFromData.__localNativePatched = true;
                    }
                    if (typeof bp._enterWorldAction === 'function' && !bp._enterWorldAction.__localNativePatched) {
                        var origEnter = bp._enterWorldAction;
                        bp._enterWorldAction = function() {
                            LocalNative.writeStatus({
                                step: '_enterWorldAction-enter',
                                first_movie_played: G_Player ? G_Player.first_movie_played : null
                            });
                            try {
                                var re = origEnter.apply(this, arguments);
                                LocalNative.writeStatus({step: '_enterWorldAction-exit'});
                                // If firstMovie.begin was missing/no-op, still start Rookie shortly.
                                var selfEnter = this;
                                try {
                                    var rootE = LocalNative.getScheduleRoot() ||
                                        (selfEnter.menu && selfEnter.menu.rootNode) || selfEnter.rootNode;
                                    if (rootE && typeof rootE.scheduleOnce === 'function') {
                                        rootE.scheduleOnce(function() {
                                            LocalNative.kickBeginRookie('enterWorld-followup');
                                        }, 1.5);
                                    } else {
                                        LocalNative.scheduleOnRoot(function() {
                                            LocalNative.kickBeginRookie('enterWorld-followup');
                                        }, 1.5);
                                    }
                                } catch (eFollow) {}
                                return re;
                            } catch (eEnter) {
                                LocalNative.writeStatus({
                                    step: '_enterWorldAction-ERR',
                                    error: String(eEnter),
                                    stack: (eEnter && eEnter.stack)
                                        ? String(eEnter.stack).split('\n').slice(0, 6) : null
                                });
                                try { LocalNative.kickBeginRookie('enterWorld-catch'); } catch (eK2) {}
                                return undefined;
                            }
                        };
                        bp._enterWorldAction.__localNativePatched = true;
                    }
                    if (typeof bp.initRookieByServer === 'function' && !bp.initRookieByServer.__localNativePatched) {
                        var origRookie = bp.initRookieByServer;
                        bp.initRookieByServer = function(userConfig) {
                            // Offline TaskManager sometimes invokes with undefined — never pass that through.
                            if (userConfig == null || typeof userConfig !== 'object')
                                userConfig = {};
                            // Stock afterInitWorld sometimes passes undefined rather
                            // than level.user_config. Empty input must not restart the guide.
                            if (!Object.keys(userConfig).length) {
                                var guideStore = LocalNative.readRaw();
                                var savedGuide = guideStore && guideStore.level && guideStore.level.user_config;
                                if (savedGuide && Object.keys(savedGuide).length) {
                                    userConfig = savedGuide;
                                    LocalNative.writeStatus({step: 'rookie-progress-restored', keys: Object.keys(savedGuide)});
                                }
                            }
                            var cfgKeys = null;
                            try { cfgKeys = Object.keys(userConfig); } catch (eK) {}
                            LocalNative.writeStatus({
                                step: 'initRookieByServer-enter',
                                keys: cfgKeys,
                                hasRookieBits: !!(userConfig && userConfig.rookieBits),
                                argc: arguments.length
                            });
                            try {
                                var rrk = origRookie.call(this, userConfig);
                                var finished = null;
                                var unfinished = null;
                                try {
                                    if (this.finishedRookiePIDs)
                                        finished = Object.keys(this.finishedRookiePIDs);
                                    if (this.unfinishedRookiePIDs)
                                        unfinished = Object.keys(this.unfinishedRookiePIDs);
                                } catch (eGc) {}
                                LocalNative.writeStatus({
                                    step: 'initRookieByServer-exit',
                                    finished: finished,
                                    unfinished: unfinished,
                                    finishedN: finished ? finished.length : null,
                                    unfinishedN: unfinished ? unfinished.length : null
                                });
                                // Already played invasion but unlock pid never persisted → stop NewUnlocked replay.
                                try {
                                    var invPid = String(LocalNative.INVASION_UNLOCK_ROOKIE_PID || 2065);
                                    var needInvUnlock = unfinished && unfinished.indexOf(invPid) >= 0;
                                    if (needInvUnlock) {
                                        var invStore = LocalNative.readRaw();
                                        var invClaims = invStore && invStore.level &&
                                            invStore.level.localInvasionFirstWaves;
                                        var playedInv = invClaims && Object.keys(invClaims).length > 0;
                                        if (playedInv &&
                                            typeof LocalNative.finishInvasionUnlockGuide === 'function') {
                                            LocalNative.finishInvasionUnlockGuide('migrate-played');
                                            if (typeof this.finishRookie === 'function')
                                                this.finishRookie(Number(invPid));
                                        }
                                    }
                                } catch (eInvMig) {}
                                return rrk;
                            } catch (eRookie) {
                                LocalNative.writeStatus({
                                    step: 'initRookieByServer-soft',
                                    error: String(eRookie),
                                    stack: (eRookie && eRookie.stack)
                                        ? String(eRookie.stack).split('\n').slice(0, 8) : null
                                });
                                // Do NOT rethrow — guide must continue offline.
                                try { LocalNative.bootstrapRookieFallback(this, userConfig); } catch (eBf) {}
                                return undefined;
                            }
                        };
                        bp.initRookieByServer.__localNativePatched = true;
                    }
                    ['showGameScene', 'afterInitWorld', '__buildUnit', '__buildWorkerTown'].forEach(function(name) {
                        if (typeof bp[name] !== 'function' || bp[name].__localNativePatched) return;
                        var orig = bp[name];
                        bp[name] = function() {
                            var uArg = arguments[0];
                            LocalNative.writeStatus({
                                step: name + '-enter',
                                argc: arguments.length,
                                sid: uArg && uArg.sid,
                                typeid: uArg && uArg.typeid
                            });
                            try {
                                LocalNative.buildController = this;
                                var r = orig.apply(this, arguments);
                                LocalNative.buildController = this;
                                var bCount = LocalNative.countBuildings(this);
                                if (bCount > LocalNative.lastBuildingCount)
                                    LocalNative.lastBuildingCount = bCount;
                                LocalNative.writeStatus({
                                    step: name + '-exit',
                                    sid: uArg && uArg.sid,
                                    typeid: uArg && uArg.typeid,
                                    buildings: bCount,
                                    hasMenu: !!(this && this.menu)
                                });
                                if (name === 'afterInitWorld') {
                                    LocalNative.afterWorldReady(this);
                                }
                                return r;
                            } catch (eN) {
                                LocalNative.writeStatus({
                                    step: name + '-ERR',
                                    sid: uArg && uArg.sid,
                                    typeid: uArg && uArg.typeid,
                                    error: String(eN),
                                    stack: (eN.stack || '').split('\n').slice(0, 6)
                                });
                                // Keep building the rest of the city on soft UI/league failures.
                                if (name === 'afterInitWorld') {
                                    try { LocalNative.afterWorldReady(this); } catch (eAw) {}
                                    return undefined;
                                }
                                if (name === 'showGameScene' ||
                                    name === '__buildUnit' || name === '__buildWorkerTown')
                                    return undefined;
                                throw eN;
                            }
                        };
                        bp[name].__localNativePatched = true;
                    });
                }
            } catch (eBuild) {
                LocalNative.writeStatus({step: 'buildGuard-ERR', error: String(eBuild)});
            }
            // Soft-fail battle init so a bad local replay dict cannot leave SceneLoading forever.
            try {
                if (Game && Game.GameControllerBattle && Game.GameControllerBattle.prototype) {
                    var btp = Game.GameControllerBattle.prototype;
                    if (typeof btp.getReplayBattleLog === 'function' &&
                        !btp.getReplayBattleLog.__localNativePatched) {
                        var origGetReplayLog = btp.getReplayBattleLog;
                        btp.getReplayBattleLog = function() {
                            var log = null;
                            try { log = origGetReplayLog.apply(this, arguments); } catch (eG) {
                                log = null;
                            }
                            if (log) return log;
                            try {
                                if (typeof G_Player !== 'undefined' && G_Player &&
                                    G_Player.tempReplayBattleLog)
                                    return G_Player.tempReplayBattleLog;
                            } catch (eP2) {}
                            if (LocalNative.enemyAttackBattleLog)
                                return LocalNative.enemyAttackBattleLog;
                            return LocalNative.buildEnemyAttackBattleLogStub(
                                (typeof G_Player !== 'undefined' && G_Player) || null,
                                {nickname: 'Enemy', level: 1});
                        };
                        btp.getReplayBattleLog.__localNativePatched = true;
                    } else if (typeof btp.getReplayBattleLog !== 'function') {
                        btp.getReplayBattleLog = function() {
                            try {
                                if (typeof G_Player !== 'undefined' && G_Player &&
                                    G_Player.tempReplayBattleLog)
                                    return G_Player.tempReplayBattleLog;
                            } catch (eP3) {}
                            return LocalNative.enemyAttackBattleLog ||
                                LocalNative.buildEnemyAttackBattleLogStub(null, {nickname: 'Enemy'});
                        };
                        btp.getReplayBattleLog.__localNativePatched = true;
                    }
                    // Inject build_data.client before stock create — enemy-attack queues often omit it.
                    if (typeof btp._createBattleUnitWhenInit === 'function' &&
                        !btp._createBattleUnitWhenInit.__localNativePatched) {
                        var origCreateBattleUnit = btp._createBattleUnitWhenInit;
                        btp._createBattleUnitWhenInit = function(unitDict, client) {
                            var data = unitDict;
                            // Original ILD assigns array indexes to id; this village uses
                            // stable server IDs for the hero's reference to its flag.
                            if (data && data.localNativeStableSid) data.id = data.sid;
                            var passClient = client;
                            try {
                                // Enemy-attack ILD can pass Enemy as positional client while
                                // home units still carry faction=2. Always rebind defender.
                                var clients = LocalNative.ensureBattleClients();
                                data = LocalNative.withBattleClient(data || {}, clients.defender);
                                passClient = clients.defender || client || (data && data.client);
                            } catch (eInj) {
                                try {
                                    if (data && !data.client)
                                        data = LocalNative.withBattleClient(data, null);
                                    passClient = client || (data && data.client);
                                } catch (eInj2) {}
                            }
                            // Skip only if THIS battle controller already created the shell.
                            // Do not treat home-city UnitManager entries as present.
                            if (data && LocalNative.hasBattleBuilding(this, data)) {
                                LocalNative.writeStatus({
                                    step: '_createBattleUnitWhenInit-skip-dup',
                                    sid: data.sid,
                                    cid: data.cid,
                                    typeid: data.typeid,
                                    x: data.x,
                                    y: data.y,
                                    units: LocalNative.countBattleUnits(this)
                                });
                                return undefined;
                            }
                            LocalNative.writeStatus({
                                step: '_createBattleUnitWhenInit-enter',
                                sid: data && data.sid,
                                cid: data && data.cid,
                                typeid: data && data.typeid,
                                x: data && data.x,
                                y: data && data.y,
                                hasClient: !!passClient,
                                clientNick: passClient ? (passClient.nickname || null) : null,
                                faction: data && data.faction
                            });
                            try {
                                var beforeCu = LocalNative.countBattleUnits(this);
                                var rCu = origCreateBattleUnit.call(this, data, passClient);
                                var grewCu = LocalNative.countBattleUnits(this) > beforeCu;
                                // Only mark real creates. Marking failed creates made later
                                // force-fill / retries treat the village as already built.
                                if (data && grewCu)
                                    LocalNative.markBattleBuildingCreated(this, data);
                                LocalNative.writeStatus({
                                    step: '_createBattleUnitWhenInit-exit',
                                    typeid: data && data.typeid,
                                    grew: grewCu,
                                    units: LocalNative.countBattleUnits(this),
                                    clientNick: passClient ? (passClient.nickname || null) : null
                                });
                                return rCu;
                            } catch (eCu) {
                                LocalNative.writeStatus({
                                    step: '_createBattleUnitWhenInit-ERR',
                                    typeid: data && data.typeid,
                                    hasClient: !!passClient,
                                    error: String(eCu)
                                });
                                throw eCu;
                            }
                        };
                        btp._createBattleUnitWhenInit.__localNativePatched = true;
                    }
                    if (typeof btp.startBattle === 'function' &&
                        !btp.startBattle.__localNativePatched) {
                        var origStartBattle = btp.startBattle;
                        btp.startBattle = function() {
                            var retSb = origStartBattle.apply(this, arguments);
                            LocalNative.handleStartPvpBattle(this);
                            try { LocalNative.traceArenaBattleStart(this); }
                            catch (eArenaStart) {
                                LocalNative.writeStatus({step: 'arena-native-start-ERR', error: String(eArenaStart)});
                            }
                            try {
                                if (this && (this.isEnterEnemyAttackReplay ||
                                    (this.level_data && this.level_data.isEnterEnemyAttackReplay) ||
                                    LocalNative.replaySession)) {
                                    LocalNative.enableDefenderLiveCombat(this, 'startBattle');
                                }
                            } catch (eSbWake) {
                                LocalNative.writeStatus({
                                    step: 'startBattle-wake-ERR',
                                    error: String(eSbWake)
                                });
                            }
                            return retSb;
                        };
                        btp.startBattle.__localNativePatched = true;
                    }
                    // Settlement text trail for enemy-attack natural end → home.
                    ['scheduleDelayedBattleFinish', 'finishBattle', 'onBattleFinished'].forEach(function(settleName) {
                        if (typeof btp[settleName] !== 'function' || btp[settleName].__localSettleTraced)
                            return;
                        var origSettle = btp[settleName];
                        btp[settleName] = function() {
                            var beforeSnap = LocalNative.snapshotSettleGc(this);
                            LocalNative.pushSettleTrace({
                                kind: 'method',
                                method: settleName,
                                phase: 'enter',
                                gc: beforeSnap
                            });
                            try {
                                var settleRet = origSettle.apply(this, arguments);
                                LocalNative.pushSettleTrace({
                                    kind: 'method',
                                    method: settleName,
                                    phase: 'exit',
                                    gc: LocalNative.snapshotSettleGc(this)
                                });
                                return settleRet;
                            } catch (eSettle) {
                                LocalNative.pushSettleTrace({
                                    kind: 'method',
                                    method: settleName,
                                    phase: 'ERR',
                                    error: String(eSettle),
                                    gc: LocalNative.snapshotSettleGc(this)
                                });
                                throw eSettle;
                            }
                        };
                        btp[settleName].__localSettleTraced = true;
                    });
                    if (typeof btp.afterInitWorld === 'function' &&
                        !btp.afterInitWorld.__localNativePatched) {
                        var origBattleAfter = btp.afterInitWorld;
                        btp.afterInitWorld = function() {
                            try {
                                if (!this.battleLogItem) {
                                    this.battleLogItem = LocalNative.enemyAttackBattleLog ||
                                        (typeof G_Player !== 'undefined' && G_Player &&
                                            G_Player.tempReplayBattleLog) ||
                                        LocalNative.buildEnemyAttackBattleLogStub(
                                            null, {nickname: 'Enemy'});
                                }
                                if (this.menu && !this.menu.battleLogItem)
                                    this.menu.battleLogItem = this.battleLogItem;
                            } catch (eSeedAw) {}
                            try {
                                return origBattleAfter.apply(this, arguments);
                            } catch (eAwB) {
                                LocalNative.writeStatus({
                                    step: 'GameControllerBattle.afterInitWorld-soft',
                                    error: String(eAwB)
                                });
                                return undefined;
                            }
                        };
                        btp.afterInitWorld.__localNativePatched = true;
                    }
                    if (typeof btp.initLevelFromData === 'function' &&
                        !btp.initLevelFromData.__localNativePatched) {
                        var origBattleILD = btp.initLevelFromData;
                        btp.initLevelFromData = function(dict) {
                            // Stock preLeaveWorld enables fixed steps even when only
                            // replacing a scout target. Normalize after teardown,
                            // before the next map; startBattle retains stock timing.
                            if (dict && dict.source === 'local-predefined-scout')
                                LocalNative.restoreHomeClock();
                            // Guarantee nested oppo.player and defender structures before stock code touches it.
                            try {
                                if (dict && typeof dict === 'object') {
                                    if (!dict.oppo || typeof dict.oppo !== 'object')
                                        dict.oppo = {};
                                    if (!dict.oppo.player || typeof dict.oppo.player !== 'object') {
                                        dict.oppo.player = {
                                            nickname: 'Enemy',
                                            level: 1,
                                            account: 'local-enemy',
                                            account_id: 'local-enemy',
                                            soldiers: [],
                                            heros: [],
                                            exp: 0,
                                            diamond: 0,
                                            spirit: 0
                                        };
                                    }
                                    if (dict.oppo.player.soldiers == null)
                                        dict.oppo.player.soldiers = [];
                                    // Flatten self/oppo so initByServer(side) sees nickname etc.
                                    if (dict.self && dict.self.player && dict.self.nickname == null)
                                        dict.self = LocalNative.makeBattleSide(dict.self.player, dict.self);
                                    if (dict.oppo && dict.oppo.player && dict.oppo.nickname == null)
                                        dict.oppo = LocalNative.makeBattleSide(dict.oppo.player, dict.oppo);
                                    if (dict.units)
                                        dict.units = LocalNative.normalizeReplayUnits(dict.units);
                                    if (dict.units && (!dict.oppo.units || !dict.oppo.units.length))
                                        dict.oppo.units = dict.units;
                                    if (dict.walls && !dict.oppo.walls)
                                        dict.oppo.walls = dict.walls;
                                    if (dict.walls && !dict.oppo.player.walls)
                                        dict.oppo.player.walls = dict.walls;
                                    if (dict.hero_donate_list && !dict.oppo.hero_donate_list)
                                        dict.oppo.hero_donate_list = dict.hero_donate_list;
                                    if (dict.hero_donate_list && !dict.oppo.player.hero_donate_list)
                                        dict.oppo.player.hero_donate_list = dict.hero_donate_list;
                                    if (dict.model_info && !dict.oppo.model_info)
                                        dict.oppo.model_info = dict.model_info;

                                    if (dict.level_data && dict.level_data.oppo) {
                                        if (dict.oppo.units && (!dict.level_data.oppo.units || !dict.level_data.oppo.units.length))
                                            dict.level_data.oppo.units = dict.oppo.units;
                                        if (dict.oppo.walls && !dict.level_data.oppo.walls)
                                            dict.level_data.oppo.walls = dict.oppo.walls;
                                        if (dict.level_data.self && dict.level_data.self.player &&
                                            dict.level_data.self.nickname == null)
                                            dict.level_data.self = LocalNative.makeBattleSide(
                                                dict.level_data.self.player, dict.level_data.self);
                                        if (dict.level_data.oppo && dict.level_data.oppo.player &&
                                            dict.level_data.oppo.nickname == null)
                                            dict.level_data.oppo = LocalNative.makeBattleSide(
                                                dict.level_data.oppo.player, dict.level_data.oppo);
                                    }

                                    // Stock ILD: truthy level_data.replay → setReplayMode(true).
                                    // Only enemy-attack / local raid may inject replay; live PVE must not.
                                    var needReplay = !!(dict.isEnterEnemyAttackReplay || dict.localNativeRaid);
                                    if (needReplay) {
                                        if (dict.isEnterEnemyAttackReplay &&
                                            (!dict.records || !dict.records.length)) {
                                            var repRecs = [[1, 0, 7]];
                                            dict.records = repRecs;
                                            if (!dict.replay || typeof dict.replay !== 'object')
                                                dict.replay = {};
                                            dict.replay.records = repRecs;
                                            if (dict.replay.seed == null) dict.replay.seed = 1;
                                        }
                                        if (dict.records == null) dict.records = [];
                                        if (!dict.replay || typeof dict.replay !== 'object')
                                            dict.replay = {records: dict.records || []};
                                        if (dict.replay.records == null)
                                            dict.replay.records = [];
                                    } else if (dict.localNativePve ||
                                        (dict.oppo && dict.oppo.player && dict.oppo.player.stage &&
                                            !dict.isEnterEnemyAttackReplay)) {
                                        dict.replay = null;
                                        if (dict.records && !dict.records.length)
                                            dict.records = null;
                                    }
                                    if (!dict.battleLogItem)
                                        dict.battleLogItem = dict.tempReplayBattleLog ||
                                            LocalNative.enemyAttackBattleLog ||
                                            LocalNative.buildEnemyAttackBattleLogStub(
                                                dict.player, dict.oppo && dict.oppo.player);
                                    if (!dict.tempReplayBattleLog)
                                        dict.tempReplayBattleLog = dict.battleLogItem;
                                    try {
                                        if (typeof G_Player !== 'undefined' && G_Player)
                                            G_Player.tempReplayBattleLog = dict.tempReplayBattleLog;
                                    } catch (eSeed2) {}
                                }
                            } catch (eFix) {}
                            // Bind battleLogItem BEFORE stock ILD / TaskManager afterInitWorld.
                            try {
                                if (this && dict) {
                                    this.battleLogItem = dict.battleLogItem ||
                                        dict.tempReplayBattleLog ||
                                        LocalNative.enemyAttackBattleLog;
                                    if (this.menu)
                                        this.menu.battleLogItem = this.battleLogItem;
                                }
                            } catch (ePreBind) {}
                            if (dict && dict.localNativeRaid && LocalNative.replaySession) {
                                this.__localRaidSession = LocalNative.replaySession;
                                LocalNative.raidController = this;
                            }
                            this.__localPvpSession = dict && dict.localNativePvp ?
                                LocalNative.pvpSession : null;
                            this.__localArenaSession = dict && dict.localNativeArena ?
                                LocalNative.arenaSession : null;
                            // Fresh battle: drop skip-dup marks from a prior raid/PVE on a
                            // reused controller so remapped units are not all skipped.
                            try {
                                if (this) this.__localBattleBuildingKeys = {};
                            } catch (eClrKeys) {}
                            LocalNative.writeStatus({
                                step: 'battle-initLevelFromData-enter',
                                keys: dict ? Object.keys(dict) : null,
                                hasOppoPlayer: !!(dict && dict.oppo && dict.oppo.player),
                                selfNick: dict && dict.self && dict.self.nickname,
                                oppoUnits: dict && dict.oppo && dict.oppo.units ? dict.oppo.units.length : 0,
                                hasBattleLog: !!(dict && (dict.battleLogItem ||
                                    dict.tempReplayBattleLog)),
                                units: dict && dict.units ? dict.units.length : null,
                                isReplay: !!(dict && dict.isEnterEnemyAttackReplay),
                                localNativePve: !!(dict && dict.localNativePve)
                            });
                            try {
                                var retB = origBattleILD.call(this, dict);
                                try { LocalNative.traceArenaInit(this); }
                                catch (eArenaInit) {
                                    LocalNative.writeStatus({step: 'arena-native-init-ERR', error: String(eArenaInit)});
                                }
                                try {
                                    if (this && !this.battleLogItem)
                                        this.battleLogItem = (dict && dict.battleLogItem) ||
                                            LocalNative.enemyAttackBattleLog;
                                    if (this && this.menu && !this.menu.battleLogItem)
                                        this.menu.battleLogItem = this.battleLogItem;
                                } catch (eBind) {}
                                var selfBattle = this;
                                var expectUnits = (dict && dict.units) ? dict.units : [];
                                var needVillageFill = !!(dict && (
                                    dict.isEnterEnemyAttackReplay || dict.localNativePve ||
                                    dict.localNativeRaid));
                                if (needVillageFill) {
                                    // Fill missing buildings immediately and on delay.
                                    // Dedup is battle-local (defenders/buildings + marked
                                    // keys), so stock DELAY and force-create cannot stack
                                    // twins, and home-city SIDs cannot blank the village.
                                    // Campaign PVE uses the same fill: stub SIDs alone are
                                    // not enough if stock TaskManager aborts mid-create.
                                    try { LocalNative.ensureBattleClients(); } catch (eCli0) {}
                                    try {
                                        LocalNative.ensureBattleVillageUnits(
                                            selfBattle, expectUnits, 'post-ild');
                                    } catch (eForce0) {}
                                    var retryDelays = [0.5, 1.2, 2.5];
                                    for (var ri = 0; ri < retryDelays.length; ri++) {
                                        (function(delay) {
                                            LocalNative.scheduleOnRoot(function() {
                                                try {
                                                    LocalNative.ensureBattleClients();
                                                    LocalNative.ensureBattleVillageUnits(
                                                        selfBattle, expectUnits, 'retry-' + delay);
                                                } catch (eForceR) {}
                                            }, delay);
                                        })(retryDelays[ri]);
                                    }
                                    if (dict.isEnterEnemyAttackReplay || dict.localNativeRaid) {
                                        LocalNative.scheduleOnRoot(function() {
                                            try {
                                                LocalNative.ensureBattleVillageUnits(
                                                    selfBattle, expectUnits, 'pre-raid');
                                                LocalNative.spawnStubAttackers(selfBattle);
                                            } catch (eRaid) {}
                                        }, 3.0);
                                    }
                                }
                                LocalNative.writeStatus({
                                    step: 'battle-initLevelFromData-exit',
                                    units: LocalNative.countBattleUnits(selfBattle)
                                });
                                return retB;
                            } catch (eBILD) {
                                LocalNative.writeStatus({
                                    step: 'battle-initLevelFromData-ERR',
                                    error: String(eBILD),
                                    stack: (eBILD && eBILD.stack)
                                        ? String(eBILD.stack).split('\n').slice(0, 8) : null
                                });
                                LocalNative.scheduleOnRoot(function() {
                                    LocalNative.abortBattleEnterToHome('battle-ild-ERR');
                                }, 0.1);
                                return undefined;
                            }
                        };
                        btp.initLevelFromData.__localNativePatched = true;
                        LocalNative.writeStatus({step: 'patch-battle-proto'});
                    }
                }
            } catch (eBattle) {
                LocalNative.writeStatus({step: 'battleGuard-ERR', error: String(eBattle)});
            }
            // Keep TaskManager alive when a selector throws (otherwise delayed buildings never spawn).
            try {
                if (typeof SelectorTask !== 'undefined' && SelectorTask.prototype &&
                    typeof SelectorTask.prototype._executeSelector === 'function' &&
                    !SelectorTask.prototype._executeSelector.__localNativePatched) {
                    var origSelExec = SelectorTask.prototype._executeSelector;
                    SelectorTask.prototype._executeSelector = function() {
                        try {
                            return origSelExec.apply(this, arguments);
                        } catch (eSel) {
                            LocalNative.writeStatus({
                                step: 'SelectorTask-soft',
                                error: String(eSel),
                                stack: eSel && eSel.stack
                                    ? String(eSel.stack).split('\n').slice(0, 5) : null
                            });
                            try { this.isDone = true; } catch (eDone) {}
                            return undefined;
                        }
                    };
                    SelectorTask.prototype._executeSelector.__localNativePatched = true;
                }
                if (typeof BaseTask !== 'undefined' && BaseTask.prototype &&
                    typeof BaseTask.prototype.execute === 'function' &&
                    !BaseTask.prototype.execute.__localNativePatched) {
                    var origBaseExec = BaseTask.prototype.execute;
                    BaseTask.prototype.execute = function() {
                        try {
                            return origBaseExec.apply(this, arguments);
                        } catch (eBase) {
                            LocalNative.writeStatus({
                                step: 'BaseTask.execute-soft',
                                error: String(eBase)
                            });
                            try { this.isDone = true; } catch (eDone2) {}
                            return undefined;
                        }
                    };
                    BaseTask.prototype.execute.__localNativePatched = true;
                }
            } catch (eTmPatch) {
                LocalNative.writeStatus({step: 'taskManagerGuard-ERR', error: String(eTmPatch)});
            }
            // Soft-wrap battle menu paths that crash when battleLogItem is missing.
            try {
                if (Game && Game.MenuControllerBattle && Game.MenuControllerBattle.prototype) {
                    var mbp = Game.MenuControllerBattle.prototype;
                    if (typeof mbp.onReplayEnd === 'function' && !mbp.onReplayEnd.__localSettleTraced) {
                        var origReplayEnd = mbp.onReplayEnd;
                        mbp.onReplayEnd = function() {
                            var logic = this.logic || null;
                            LocalNative.pushSettleTrace({
                                kind: 'method',
                                method: 'MenuControllerBattle.onReplayEnd',
                                phase: 'enter',
                                first_time_stage: (typeof G_Player !== 'undefined' && G_Player)
                                    ? G_Player.first_time_stage : null,
                                isEnterEnemyAttackReplay: !!(logic && logic.isEnterEnemyAttackReplay),
                                gc: LocalNative.snapshotSettleGc(logic)
                            });
                            try {
                                return origReplayEnd.apply(this, arguments);
                            } catch (eRe) {
                                LocalNative.pushSettleTrace({
                                    kind: 'method',
                                    method: 'MenuControllerBattle.onReplayEnd',
                                    phase: 'ERR',
                                    error: String(eRe)
                                });
                                throw eRe;
                            }
                        };
                        mbp.onReplayEnd.__localSettleTraced = true;
                    }
                    if (typeof mbp.onBattleTimeout === 'function' && !mbp.onBattleTimeout.__localNativePatched) {
                        var origTimeout = mbp.onBattleTimeout;
                        mbp.onBattleTimeout = function() {
                            if (this.logic && this.logic.__localArenaSession)
                                return origTimeout.apply(this, arguments);
                            LocalNative.writeStatus({step: 'battle-onBattleTimeout'});
                            try {
                                var logic = this.logic || (typeof GETCGC === 'function' && GETCGC());
                                if (logic && typeof logic.finishBattle === 'function')
                                    logic.finishBattle();
                                else if (logic && typeof logic.scheduleDelayedBattleFinish === 'function')
                                    logic.scheduleDelayedBattleFinish();
                            } catch (eTo1) {}
                            try {
                                return origTimeout.apply(this, arguments);
                            } catch (eTo2) {
                                LocalNative.writeStatus({step: 'onBattleTimeout-soft', error: String(eTo2)});
                                try {
                                    LocalNative.handleFinishEnemyAttackReplay(
                                        (typeof G_Player !== 'undefined' && G_Player) || null, {});
                                } catch (eTo3) {}
                            }
                        };
                        mbp.onBattleTimeout.__localNativePatched = true;
                    }
                    if (typeof mbp.onBattlePrepareTimeout === 'function' &&
                        !mbp.onBattlePrepareTimeout.__localNativePatched) {
                        var origPrepTo = mbp.onBattlePrepareTimeout;
                        mbp.onBattlePrepareTimeout = function() {
                            // Empty arena units are deliberate. The old raid
                            // recovery would otherwise inject the saved city.
                            if (this.logic && this.logic.__localArenaSession)
                                return origPrepTo.apply(this, arguments);
                            LocalNative.writeStatus({step: 'battle-onBattlePrepareTimeout'});
                            try {
                                var logicP = this.logic || (typeof GETCGC === 'function' && GETCGC());
                                if (logicP) {
                                    try {
                                        var ld = logicP.level_data || null;
                                        var fillUnits = null;
                                        if (ld && ld.units && ld.units.length)
                                            fillUnits = ld.units;
                                        else if (ld && ld.oppo && ld.oppo.units && ld.oppo.units.length)
                                            fillUnits = ld.oppo.units;
                                        else {
                                            var storeU = LocalNative.readRaw();
                                            var homeUnits = storeU && storeU.level
                                                ? storeU.level.units : [];
                                            fillUnits = LocalNative.remapBattleUnitIds(
                                                LocalNative.normalizeReplayUnits(homeUnits || []),
                                                92000);
                                        }
                                        LocalNative.ensureBattleVillageUnits(
                                            logicP, fillUnits || [], 'prepare-timeout');
                                    } catch (eVu) {}
                                    // Stub attackers belong to enemy-attack replay only.
                                    if (logicP.isEnterEnemyAttackReplay ||
                                        (logicP.level_data &&
                                            logicP.level_data.isEnterEnemyAttackReplay)) {
                                        try { LocalNative.spawnStubAttackers(logicP); } catch (eSp) {}
                                    }
                                    if (typeof logicP.startBattle === 'function')
                                        logicP.startBattle();
                                }
                            } catch (ePrep1) {
                                LocalNative.writeStatus({
                                    step: 'onBattlePrepareTimeout-start-ERR',
                                    error: String(ePrep1)
                                });
                            }
                            try {
                                return origPrepTo.apply(this, arguments);
                            } catch (ePrep2) {
                                LocalNative.writeStatus({
                                    step: 'onBattlePrepareTimeout-soft',
                                    error: String(ePrep2)
                                });
                            }
                        };
                        mbp.onBattlePrepareTimeout.__localNativePatched = true;
                    }
                    ['afterInitWorld', 'init', 'onEnterWorld', '_enterWorldAction',
                     'refreshClientLabel', 'refreshPlayerLabel', 'beginCountdown',
                     'runBattleTimer', 'refreshReplayMode', 'initLayout'].forEach(function(name) {
                        if (typeof mbp[name] !== 'function' || mbp[name].__localNativePatched)
                            return;
                        var origMb = mbp[name];
                        mbp[name] = function() {
                            try {
                                if (!this.battleLogItem) {
                                    var logic = this.logic || this;
                                    if (logic && typeof logic.getReplayBattleLog === 'function')
                                        this.battleLogItem = logic.getReplayBattleLog();
                                    if (!this.battleLogItem)
                                        this.battleLogItem = LocalNative.enemyAttackBattleLog ||
                                            (typeof G_Player !== 'undefined' && G_Player &&
                                                G_Player.tempReplayBattleLog) ||
                                            LocalNative.buildEnemyAttackBattleLogStub(
                                                null, {nickname: 'Enemy'});
                                }
                                if (this.logic && !this.logic.battleLogItem)
                                    this.logic.battleLogItem = this.battleLogItem;
                            } catch (eSeedMb) {}
                            try {
                                return origMb.apply(this, arguments);
                            } catch (eMb) {
                                LocalNative.writeStatus({
                                    step: 'MenuControllerBattle.' + name + '-soft',
                                    error: String(eMb)
                                });
                                return undefined;
                            }
                        };
                        mbp[name].__localNativePatched = true;
                    });
                }
            } catch (eMenuB) {
                LocalNative.writeStatus({step: 'battleMenuGuard-ERR', error: String(eMenuB)});
            }
            // LetterManager / SocialBox / BattleRecorder — seed fields so initByServer can finish.
            try {
                if (Comp && Comp.LetterManager && Comp.LetterManager.prototype) {
                    var lm = Comp.LetterManager.prototype;
                    if (typeof lm.new_message === 'undefined') lm.new_message = 0;
                    ['enterWorldAction', 'noticeLetter', 'noticeSysLetter', 'refreshNewPrompt',
                     'updateInfo', 'initByServer', 'setNewMessage', 'getNewMessage', 'ctor', 'init',
                     'getLetter', 'getSysLetter', 'addLetter', 'addSysLetter'].forEach(function(name) {
                        if (typeof lm[name] !== 'function' || lm[name].__localNativePatched) return;
                        var orig = lm[name];
                        lm[name] = function() {
                            try {
                                if (typeof this.new_message === 'undefined') this.new_message = 0;
                                if (!this.letters) this.letters = [];
                                if (!this.sysLetters) this.sysLetters = [];
                                if (!this.letterMap) this.letterMap = {};
                                return orig.apply(this, arguments);
                            } catch (eLM) {
                                if (typeof this.new_message === 'undefined') this.new_message = 0;
                                if (!this.letters) this.letters = [];
                                if (!this.sysLetters) this.sysLetters = [];
                                LocalNative.writeStatus({step: 'LetterManager.' + name + '-soft', error: String(eLM)});
                            }
                        };
                        lm[name].__localNativePatched = true;
                    });
                }
            } catch (eLetter) {}
            try {
                if (Comp && Comp.NewMessage && Comp.NewMessage.prototype) {
                    var nmp = Comp.NewMessage.prototype;
                    ['init', 'initByServer', 'ctor', 'clearUnlookedAttackNum',
                     'getUnlookedAttackNum', 'setNewMessage'].forEach(function(name) {
                        if (typeof nmp[name] !== 'function' || nmp[name].__localNativePatched) return;
                        var origNm = nmp[name];
                        nmp[name] = function() {
                            try {
                                if (this.new_message == null) this.new_message = 0;
                                if (this.login_warn_attack_num == null) this.login_warn_attack_num = 0;
                                if (this.unlooked_attack_num == null) this.unlooked_attack_num = 0;
                                return origNm.apply(this, arguments);
                            } catch (eNm) {
                                if (this.new_message == null) this.new_message = 0;
                                LocalNative.writeStatus({step: 'NewMessage.' + name + '-soft', error: String(eNm)});
                            }
                        };
                        nmp[name].__localNativePatched = true;
                    });
                }
            } catch (eNewMsg) {}
            try {
                if (Comp && Comp.BattleRecorder && Comp.BattleRecorder.prototype) {
                    var brp = Comp.BattleRecorder.prototype;
                    if (typeof brp.getBattleLog === 'function' && !brp.getBattleLog.__localNativePatched) {
                        var origGBL = brp.getBattleLog;
                        brp.getBattleLog = function() {
                            try {
                                if (!this.battle_recorders) this.battle_recorders = [];
                                var logs = origGBL.apply(this, arguments);
                                return logs != null ? logs : this.battle_recorders;
                            } catch (eGBL) {
                                if (!this.battle_recorders) this.battle_recorders = [];
                                return this.battle_recorders;
                            }
                        };
                        brp.getBattleLog.__localNativePatched = true;
                    } else if (typeof brp.getBattleLog !== 'function') {
                        brp.getBattleLog = function() {
                            if (!this.battle_recorders) this.battle_recorders = [];
                            return this.battle_recorders;
                        };
                        brp.getBattleLog.__localNativePatched = true;
                    }
                    // Pre-seed before initByServer so SocialBox.logs path does not see undefined.
                    if (typeof brp.initByServer === 'function' && !brp.initByServer.__localNativePatched) {
                        var origBrInit = brp.initByServer;
                        brp.initByServer = function(params) {
                            if (!this.battle_recorders) {
                                this.battle_recorders = (params && params.battle_recorders) || [];
                            }
                            if (!this.battleLog) this.battleLog = this.battle_recorders;
                            try {
                                return origBrInit.apply(this, arguments);
                            } catch (eBrI) {
                                if (!this.battle_recorders) this.battle_recorders = [];
                                if (!this.battleLog) this.battleLog = this.battle_recorders;
                                LocalNative.writeStatus({
                                    step: 'BattleRecorder.initByServer-soft',
                                    error: String(eBrI)
                                });
                            }
                        };
                        brp.initByServer.__localNativePatched = true;
                    }
                    // Soft-wrap UI refresh paths only.
                    ['refresh', 'deleteReplayID'].forEach(function(name) {
                        if (typeof brp[name] !== 'function' || brp[name].__localNativePatched) return;
                        var origBr = brp[name];
                        brp[name] = function() {
                            try {
                                if (!this.battle_recorders) this.battle_recorders = [];
                                if (!this.battleLog) this.battleLog = this.battle_recorders;
                                return origBr.apply(this, arguments);
                            } catch (eBr) {
                                if (!this.battle_recorders) this.battle_recorders = [];
                                LocalNative.writeStatus({step: 'BattleRecorder.' + name + '-soft', error: String(eBr)});
                            }
                        };
                        brp[name].__localNativePatched = true;
                    });
                }
            } catch (eBRP) {}
            try {
                if (typeof SocialBox !== 'undefined' && SocialBox && SocialBox.prototype) {
                    var sb = SocialBox.prototype;
                    if (typeof sb.logs === 'undefined') sb.logs = [];
                    if (typeof sb.new_message === 'undefined') sb.new_message = 0;
                    var sbNames = Object.keys(sb);
                    ['updateInfo', 'refresh', 'notice', 'enterWorld', 'init', 'ctor', 'onEnter',
                     'show', 'hide', 'setLogs', 'getLogs', 'addLog', 'battleLogInfo',
                     'refreshUI', 'onShowRefresh'].forEach(function(n) {
                        if (sbNames.indexOf(n) < 0) sbNames.push(n);
                    });
                    sbNames.forEach(function(name) {
                        if (typeof sb[name] !== 'function' || sb[name].__localNativePatched) return;
                        if (name === 'constructor') return;
                        var origSb = sb[name];
                        sb[name] = function() {
                            try {
                                if (typeof this.logs === 'undefined') this.logs = [];
                                if (typeof this.new_message === 'undefined') this.new_message = 0;
                                return origSb.apply(this, arguments);
                            } catch (eSb) {
                                if (typeof this.logs === 'undefined') this.logs = [];
                                if (typeof this.new_message === 'undefined') this.new_message = 0;
                                LocalNative.writeStatus({step: 'SocialBox.' + name + '-soft', error: String(eSb)});
                            }
                        };
                        sb[name].__localNativePatched = true;
                    });
                }
            } catch (eSocial) {}
            // Patch LetterManager getter used by SocialBox (Components.js ~6626).
            try {
                if (ClientPlayer && ClientPlayer.prototype && typeof ClientPlayer.prototype.getComponent === 'function' &&
                    !ClientPlayer.prototype.getComponent.__localNativePatched) {
                    var origPGC = ClientPlayer.prototype.getComponent;
                    ClientPlayer.prototype.getComponent = function(key) {
                        var comp = origPGC.apply(this, arguments);
                        if (comp) {
                            if (typeof comp.new_message === 'undefined') comp.new_message = 0;
                            if (comp.battle_recorders == null &&
                                (key === Comp.BattleRecorder || key === 'BattleRecorder'))
                                comp.battle_recorders = [];
                            if (!comp.letters && (key === Comp.LetterManager || key === 'LetterManager')) {
                                comp.letters = [];
                                comp.sysLetters = [];
                                if (!comp.letterMap) comp.letterMap = {};
                            }
                        }
                        return comp;
                    };
                    ClientPlayer.prototype.getComponent.__localNativePatched = true;
                }
            } catch (eGC) {}
            // Track active BuildingBuilder; cancel uses stock onPressNO (no force-enableOK).
            try {
                var BB = null;
                if (typeof BuildingBuilder !== 'undefined' && BuildingBuilder) BB = BuildingBuilder;
                else if (typeof Comp !== 'undefined' && Comp && Comp.BuildingBuilder) BB = Comp.BuildingBuilder;
                if (BB && BB.prototype && !BB.prototype.__localNativeBuilderTracked) {
                    BB.prototype.__localNativeBuilderTracked = true;
                    ['enableOK', 'onPressNO', 'onPressOK', 'cancelBuilding', 'updatePosition',
                     'buyBuildingConfirm', 'confirmFinishNow', 'onPressFinishNow'].forEach(function(fn) {
                        if (typeof BB.prototype[fn] !== 'function' || BB.prototype[fn].__localNativePatched) return;
                        var origFn = BB.prototype[fn];
                        BB.prototype[fn] = function() {
                            LocalNative.activeBuilder = this;
                            if (fn === 'onPressNO' || fn === 'cancelBuilding') {
                                LocalNative.writeStatus({
                                    step: 'builder-' + fn,
                                    typeid: this.typeid || (this.config && this.config.typeid) || null,
                                    state: this.state
                                });
                            }
                            if (fn === 'enableOK') {
                                var r = origFn.apply(this, arguments);
                                try {
                                    var cfg = this.config || this.cfg || null;
                                    var rely = cfg && cfg.rely_base_lv;
                                    var baseLv = null;
                                    try {
                                        baseLv = G_Player && typeof G_Player.getBaseLevel === 'function'
                                            ? G_Player.getBaseLevel() : (G_Player && G_Player.level);
                                    } catch (eBL) {}
                                    LocalNative.writeStatus({
                                        step: 'enableOK',
                                        ok: !!r,
                                        typeid: this.typeid || (cfg && cfg.typeid) || null,
                                        unit_type: this.unit_type || (cfg && cfg.unit_type) || null,
                                        rely_base_lv: rely != null ? rely : null,
                                        baseLevel: baseLv,
                                        state: this.state
                                    });
                                } catch (eOK) {}
                                return r;
                            }
                            // onPressFinishNow only opens the gem confirm dialog — do NOT force-finish
                            // there (it raced the dialog and left 30100 ghosts). Retry only after
                            // confirmFinishNow (useRes + rpc_s_build_finish_imm).
                            if (fn === 'confirmFinishNow') {
                                var retF = origFn.apply(this, arguments);
                                var selfBb = this;
                                LocalNative.scheduleOnRoot(function() {
                                    try {
                                        var master = selfBb.master || null;
                                        var tidM = master && master.typeid != null ? master.typeid : null;
                                        var stillGhost = selfBb.state === BUILD_STATE_BUILDING ||
                                            (typeof tidM === 'number' && tidM % 100 === 0);
                                        if (!stillGhost) return;
                                        var pFin = {};
                                        if (master) {
                                            if (master.sid != null) pFin.sid = master.sid;
                                            try {
                                                pFin.cid = master.cid != null ? master.cid :
                                                    (master.getCID ? master.getCID() : null);
                                            } catch (eCid) {}
                                        }
                                        LocalNative.forceFinishBuilding(
                                            G_Player, pFin, 'builder-confirmFinishNow-retry');
                                    } catch (eFin) {
                                        LocalNative.writeStatus({
                                            step: 'builder-finish-follow-ERR',
                                            error: String(eFin)
                                        });
                                    }
                                }, 0.2);
                                return retF;
                            }
                            if (fn === 'onPressFinishNow') {
                                LocalNative.writeStatus({
                                    step: 'builder-onPressFinishNow',
                                    typeid: this.typeid || (this.master && this.master.typeid) || null,
                                    state: this.state,
                                    sid: this.master && this.master.sid != null ? this.master.sid : null
                                });
                            }
                            return origFn.apply(this, arguments);
                        };
                        BB.prototype[fn].__localNativePatched = true;
                    });
                }
            } catch (eEn) {}
            // BuyBuildingConfirm orange X → master.onPressNO (stock path); log only.
            try {
                var BBC = null;
                if (typeof BuyBuildingConfirm !== 'undefined' && BuyBuildingConfirm)
                    BBC = BuyBuildingConfirm;
                else if (typeof UI !== 'undefined' && UI.BuyBuildingConfirm)
                    BBC = UI.BuyBuildingConfirm;
                if (BBC && BBC.prototype && typeof BBC.prototype.onPressNO === 'function' &&
                    !BBC.prototype.onPressNO.__localNativePatched) {
                    var origBbcNo = BBC.prototype.onPressNO;
                    BBC.prototype.onPressNO = function() {
                        LocalNative.writeStatus({step: 'BuyBuildingConfirm.onPressNO'});
                        try {
                            return origBbcNo.apply(this, arguments);
                        } catch (eBbc) {
                            LocalNative.writeStatus({
                                step: 'BuyBuildingConfirm.onPressNO-soft',
                                error: String(eBbc)
                            });
                            try {
                                if (this.master && typeof this.master.onPressNO === 'function')
                                    return this.master.onPressNO();
                            } catch (eM) {}
                        }
                    };
                    BBC.prototype.onPressNO.__localNativePatched = true;
                }
            } catch (eBbcP) {}
            try {
                if (typeof cc !== 'undefined' && cc.TMXTiledMap && cc.TMXTiledMap.create) {
                    var origTmx = cc.TMXTiledMap.create;
                    if (!origTmx.__localNativePatched) {
                        cc.TMXTiledMap.create = function(path) {
                            if (!path) path = 'map/world1.tmx';
                            LocalNative.writeStatus({step: 'TMXCreate', path: path});
                            return origTmx.call(this, path);
                        };
                        cc.TMXTiledMap.create.__localNativePatched = true;
                    }
                }
            } catch (eTmx) {}
            // MenuControllerBuild.afterInitWorld throws "config is undefined" offline — soft it
            // so TaskManager still reaches initRookieByServer / _enterWorldAction.
            try {
                if (Game && Game.MenuControllerBuild && Game.MenuControllerBuild.prototype) {
                    var mp = Game.MenuControllerBuild.prototype;
                    ['afterInitWorld', 'onEnterWorld', 'refreshUnbuiltBuilding',
                     'refreshNewPrompt', 'refreshAvatar', 'refreshAvatarNewPrompt',
                     'refreshHeroPrompt', 'refreshVIPPrompt'].forEach(function(name) {
                        if (typeof mp[name] !== 'function' || mp[name].__localNativePatched) return;
                        var origM = mp[name];
                        mp[name] = function() {
                            try {
                                return origM.apply(this, arguments);
                            } catch (eMenu) {
                                LocalNative.writeStatus({
                                    step: 'MenuBuild.' + name + '-soft',
                                    error: String(eMenu)
                                });
                                return undefined;
                            }
                        };
                        mp[name].__localNativePatched = true;
                    });
                }
            } catch (eMenuP) {}
            // Rookie helpers: never feed undefined user_config into bit decoder.
            try {
                if (typeof Rookie !== 'undefined' && Rookie &&
                    typeof Rookie.decodeFinishedRookiePIDs === 'function' &&
                    !Rookie.decodeFinishedRookiePIDs.__localNativePatched) {
                    var origDec = Rookie.decodeFinishedRookiePIDs;
                    Rookie.decodeFinishedRookiePIDs = function(cfg) {
                        try {
                            return origDec.call(this, cfg && typeof cfg === 'object' ? cfg : {});
                        } catch (eDec2) {
                            LocalNative.writeStatus({
                                step: 'decodeFinishedRookiePIDs-soft',
                                error: String(eDec2)
                            });
                            return {};
                        }
                    };
                    Rookie.decodeFinishedRookiePIDs.__localNativePatched = true;
                }
            } catch (eDecP) {}
            // Soft-wrap Rookie UI processors so one bad PID does not kill the guide.
            try {
                if (Game && Game.GameControllerBuild && Game.GameControllerBuild.prototype) {
                    var rbp = Game.GameControllerBuild.prototype;
                    ['processRookieUI', 'checkRookieTrigger', 'checkRookiePrecondition',
                     'checkRookieCompleteCondition', 'checkRookieProcessCompleteCondition',
                     '_solveUnfinishedRookie', 'rookieUpdate', 'clearCurRookie',
                     'processMarkNode', 'onRookieFinished'].forEach(function(name) {
                        if (typeof rbp[name] !== 'function' || rbp[name].__localNativeRookieSoft) return;
                        var origRb = rbp[name];
                        rbp[name] = function() {
                            try {
                                // Guard common undefined-dict crashes in processRookieUI.
                                if (name === 'processRookieUI' || name === 'clearCurRookie') {
                                    var d0 = arguments[0];
                                    if (d0 == null) {
                                        LocalNative.writeStatus({
                                            step: name + '-skip-null',
                                            argc: arguments.length
                                        });
                                        return undefined;
                                    }
                                }
                                return origRb.apply(this, arguments);
                            } catch (eRb) {
                                LocalNative.writeStatus({
                                    step: name + '-soft',
                                    error: String(eRb)
                                });
                                return undefined;
                            }
                        };
                        rbp[name].__localNativeRookieSoft = true;
                    });
                }
            } catch (eRbP) {}
        };

        LocalNative.countBuildings = function(gc) {
            if (!gc) return 0;
            var n = 0;
            try {
                if (gc.buildings) {
                    if (typeof gc.buildings.length === 'number' && gc.buildings.length > 0)
                        n = gc.buildings.length;
                    else {
                        var keys = Object.keys(gc.buildings);
                        for (var i = 0; i < keys.length; i++) {
                            if (gc.buildings[keys[i]]) n++;
                        }
                    }
                }
                if (!n && gc.typeToCid) n = Object.keys(gc.typeToCid).length;
            } catch (eC) {}
            return n;
        };

        LocalNative.diagnoseBuild = function() {
            var info = {
                stage: typeof GS_CURRENT_STAGE !== 'undefined' ? GS_CURRENT_STAGE : null,
                buildings: 0,
                nickname: G_Player ? G_Player.nickname : null,
                level: G_Player ? G_Player.level : null,
                lastError: LocalNative.lastError
            };
            try {
                var gc = null;
                try { if (typeof GETGC === 'function') gc = GETGC(); } catch (eG) {}
                if (!gc && typeof DA.getGameController === 'function') gc = DA.getGameController();
                info.buildings = Math.max(LocalNative.countBuildings(gc), LocalNative.lastBuildingCount || 0);
                if (gc && gc.typeToCid) info.typeToCid = Object.keys(gc.typeToCid).length;
                if (gc && gc.mapManager) {
                    info.hasMap = true;
                    info.mapInited = !!gc.mapManager.inited;
                }
                if (G_Player) {
                    info.defence_score = G_Player.defence_score;
                    info.account = G_Player.account;
                }
            } catch (eD) { info.diagErr = String(eD); }
            LocalNative.writeStatus({step: 'diagnose', info: info});
            return info;
        };

        LocalNative.ensurePlayer = function() {
            if (G_Player) return G_Player;
            var cid = G_UnitManager.getAndPlusCID();
            G_Player = new ClientPlayer(cid);
            G_Player._isPlayer = true;
            G_Player.uuid = 'local-player';
            G_Player.sid = 1;
            G_Player.faction = BATTLE_FACTION_DEFENDER;
            try { G_UnitManager.addUnit(G_Player); } catch (e) {}
            try { G_UnitManager.RegisterPlayer(G_Player); } catch (e2) {}
            return G_Player;
        };

        var entering = false;
        var enterStamp = 0;
        LocalNative.unlockEnter = function() {
            entering = false;
            enterStamp = 0;
        };

        LocalNative.getDurableScheduleRoot = function() {
            try {
                var r = LocalNative.getScheduleRoot();
                if (r) return r;
            } catch (e1) {}
            try {
                if (typeof G_Director !== 'undefined' && G_Director.getRunningScene)
                    return G_Director.getRunningScene();
            } catch (e2) {}
            try {
                if (menu && menu.rootNode) return menu.rootNode;
            } catch (e3) {}
            return null;
        };

        LocalNative.startGame = function() {
            if (entering) {
                // Auto-unlock if a previous click hung without reaching city.
                if (enterStamp && (Date.now() - enterStamp) > 20000) {
                    LocalNative.unlockEnter();
                    LocalNative.writeStatus({step: 'startGame-unlock-stale'});
                } else {
                    LocalNative.writeStatus({step: 'startGame-busy'});
                    setCaption('\u6b63\u5728\u8fdb\u5165\u4e2d\u2026');
                    return;
                }
            }
            entering = true;
            enterStamp = Date.now();
            setCaption('\u6b63\u5728\u542f\u52a8\u539f\u4e3b\u57ce\u521d\u59cb\u5316\u2026');
            try {
                try { G_Director.resume(); G_Director.startAnimation(); } catch (eDir) {}
                protectSound();
                forceLegalAgreed();
                DA.SynServerTime(Date.now() / 1000);
                GS_CURRENT_STAGE = GS_STAGE_NONE;
                LocalNative.installEngineGuards();
                LocalNative.ensureLeague();
                LocalNative.ensureUnitBuildCompleteHook();
                // New-account guide: allow FirstMovie → _beginRookie; soft-fallback if CCBI crashes.
                LocalNative.installFirstMovieGuide();

                var player = LocalNative.ensurePlayer();
                LocalNative.installCallServer(player);

                var loaded = null;
                var levelDict = null;
                try {
                    loaded = LocalNative.loadOrCreate();
                    levelDict = loaded.store.level;
                } catch (eLoad) {
                    LocalNative.writeStatus({step: 'store-load-failed-preserved', error: String(eLoad)});
                    LocalNative.unlockEnter();
                    throw eLoad;
                }
                LocalNative.ensurePlayerSocialFields(levelDict.player);
                LocalNative.ensurePackageSlotMetadata(levelDict);
                LocalNative.ensureArenaState(levelDict);
                LocalNative.arenaAttackCounter(levelDict);
                LocalNative.installTraderPolicy();
                LocalNative.ensureTrader(levelDict, false);
                LocalNative.writeRaw(loaded.store);
                // Keep saved first_movie_played. New store defaults to 0 so opening story can run.
                if (levelDict.player.first_movie_played == null)
                    levelDict.player.first_movie_played = loaded.created ? 0 : 1;
                if (!levelDict.user_config || typeof levelDict.user_config !== 'object')
                    levelDict.user_config = {};
                if (LocalNative.ensureQuestProgressSeeded(levelDict)) {
                    try { LocalNative.saveLevel(levelDict); } catch (eQuestSeed) {}
                }
                LocalNative.ensureStarterHeros(levelDict);
                LocalNative.syncNextSid(levelDict.units);
                if (loaded.created) {
                    var hour = DA.getSystemCurrentTimeHour();
                    for (var i = 0; i < levelDict.units.length; i++) {
                        if (levelDict.units[i].lastCollectTime === 0)
                            levelDict.units[i].lastCollectTime = hour;
                    }
                    // Persist the inferred new-account seed before entering the original chain.
                    LocalNative.saveLevel(levelDict);
                    LocalNative.ensureStarterHeros(levelDict);
                    LocalNative.writeStatus({
                        step: 'new-account-seed',
                        nickname: levelDict.player.nickname,
                        units: levelDict.units.map(function(u) {
                            return {sid: u.sid, typeid: u.typeid, x: u.x, y: u.y};
                        }),
                        heros: (levelDict.heros || []).map(function(h) {
                            return {
                                sid: h.sid,
                                typeid: h.typeid,
                                attack_index: h.attack_index,
                                state: h.state
                            };
                        }),
                        first_movie_played: levelDict.player.first_movie_played,
                        user_config_keys: Object.keys(levelDict.user_config)
                    });
                }

                // Do NOT call playEnterGameAction here — on phone it can native-crash mid
                // loading UI; MEmu already reached city via direct rpc_c_start_game.
                setCaption(loaded.created
                    ? '\u9996\u6b21\u8fdb\u5165\u00b7\u65b0\u8d26\u53f7\u5f15\u5bfc\u00b7rpc_c_start_game'
                    : '\u7ee7\u7eed\u6e38\u620f\u00b7\u5df2\u8bfb\u672c\u5730\u5b58\u6863\u00b7rpc_c_start_game');

                var kickStart = function() {
                    try {
                        GS_CURRENT_STAGE = GS_STAGE_NONE;
                        LocalNative.writeStatus({
                            step: 'rpc_c_start_game',
                            created: loaded.created,
                            units: levelDict.units.length,
                            heros: levelDict.heros ? levelDict.heros.length : 0,
                            heroTypeids: levelDict.heros ? levelDict.heros.map(function(h) {
                                return h && h.typeid;
                            }) : [],
                            nickname: levelDict.player.nickname,
                            first_movie_played: levelDict.player.first_movie_played
                        });
                        player.rpc_c_start_game(levelDict);
                        try { G_Director.resume(); G_Director.startAnimation(); } catch (eDir2) {}
                    } catch (eKick) {
                        LocalNative.lastError = String(eKick);
                        LocalNative.writeStatus({
                            step: 'rpc_c_start_game-ERR',
                            error: String(eKick),
                            stack: (eKick && eKick.stack) ? String(eKick.stack).split('\n').slice(0, 8) : null
                        });
                        LocalNative.unlockEnter();
                        setCaption('\u542f\u52a8\u5931\u8d25\uff0c\u5b58\u6863\u5df2\u4fdd\u7559: ' + eKick);
                        throw eKick;
                    }
                };
                kickStart();

                // Persist after stage settles. MainMenu root may be torn down — rebind each tick.
                var tries = 0;
                var saverBound = null;
                var saver = function() {
                    tries++;
                    try { G_Director.resume(); } catch (eR) {}
                    try { LocalNative.refreshHud(); } catch (eRH3) {}
                    if (tries >= 8) {
                        try { LocalNative.cancelBlockedPlacement(); } catch (eCP) {}
                    }
                    var diag = LocalNative.diagnoseBuild();
                    var dumped = false;
                    try { dumped = LocalNative.tryDumpAndSave(); } catch (eDump) {}
                    var ready = dumped || (diag.stage === GS_STAGE_BUILD && diag.buildings > 0);
                    if (ready || tries > 45) {
                        try {
                            if (saverBound) {
                                var ur = LocalNative.getDurableScheduleRoot();
                                if (ur && ur.unschedule) ur.unschedule(saver);
                            }
                        } catch (eUn) {}
                        var msg = '\u4e3b\u57cestage=' + diag.stage + ' \u5efa\u7b51=' + diag.buildings +
                            ' nick=' + (diag.nickname || '?');
                        if (dumped) msg += ' saved';
                        if (LocalNative.lastError) msg += ' err=' + LocalNative.lastError;
                        setCaption(msg);
                        try { G_MainController.setNotice(msg); } catch (eN) {}
                        LocalNative.unlockEnter();
                        LocalNative.writeStatus({step: 'startGame-done', info: diag, dumped: !!dumped});
                        LocalNative.probeHeroSwallowContract();
                    }
                };
                saverBound = true;
                try {
                    var bootRoot = LocalNative.getDurableScheduleRoot();
                    if (bootRoot && bootRoot.schedule) bootRoot.schedule(saver, 1.0);
                    else menu.rootNode.schedule(saver, 1.0);
                } catch (eBootSched) {
                    try { menu.rootNode.schedule(saver, 1.0); } catch (e2) {
                        LocalNative.unlockEnter();
                    }
                }
            } catch (err) {
                LocalNative.unlockEnter();
                LocalNative.lastError = String(err);
                setCaption('\u542f\u52a8\u5931\u8d25: ' + err);
                cc.log('DinoLocal native start failed: ' + err + ' ' + (err && err.stack));
                try { G_MainController.setNotice('\u672c\u5730\u9002\u914d\u542f\u52a8\u5931\u8d25: ' + err); } catch (e4) {}
            }
        };

        var startWrapped = function() {
            protectSound();
            forceLegalAgreed();
            try { G_Director.resume(); G_Director.startAnimation(); } catch (eW) {}
            setCaption('\u5df2\u70b9\u51fb\u8fdb\u5165\u2026');
            LocalNative.writeStatus({step: 'startWrapped'});
            LocalNative.startGame();
        };
        G_MainController.platformLogin = startWrapped;
        G_MainController.login = startWrapped;
        G_MainController.quickLogin = startWrapped;
        try {
            if (typeof G_MainController._doPlatformLogin === 'function')
                G_MainController._doPlatformLogin = startWrapped;
            if (typeof G_MainController.onAppPlatformLogin === 'function')
                G_MainController.onAppPlatformLogin = startWrapped;
            if (typeof G_MainController._doLogin === 'function')
                G_MainController._doLogin = startWrapped;
            if (typeof G_MainController._doQuickLogin === 'function')
                G_MainController._doQuickLogin = startWrapped;
        } catch (eHook) {}
        // LoginCommon green start often gates on isLegalAgreed then platformLogin.
        try {
            var lc = menu.loginCommon && menu.loginCommon.controller;
            if (lc) {
                ['onPressGotoLogin', 'onPressGotoLoginFacebook', 'onPressQuickRegister',
                 'onPressQuickRegisterFacebook', 'commonLogin', 'autoLogin'].forEach(function(name) {
                    if (typeof lc[name] !== 'function' || lc[name].__localNativeEnter) return;
                    var origLc = lc[name];
                    lc[name] = function() {
                        forceLegalAgreed();
                        protectSound();
                        try {
                            if (name === 'autoLogin') return;
                            // Prefer local start over original network login UI.
                            if (name.indexOf('GotoLogin') >= 0 || name.indexOf('QuickRegister') >= 0 ||
                                name === 'commonLogin') {
                                startWrapped();
                                return;
                            }
                            return origLc.apply(this, arguments);
                        } catch (eLc) {
                            LocalNative.writeStatus({step: 'LoginCommon.' + name + '-ERR', error: String(eLc)});
                            startWrapped();
                        }
                    };
                    lc[name].__localNativeEnter = true;
                });
            }
        } catch (eLcP) {}
        // Guarantee isLegalAgreed reads true even if something resets the field.
        try {
            var legalHeld = true;
            if (Object.defineProperty) {
                Object.defineProperty(menu, 'isLegalAgreed', {
                    configurable: true,
                    enumerable: true,
                    get: function() { return function() { return true; }; },
                    set: function(v) { legalHeld = !!v; }
                });
            } else {
                menu.isLegalAgreed = function() { return true; };
            }
        } catch (eDef) {
            menu.isLegalAgreed = function() { return true; };
        }
        LocalNativeGlobal = LocalNative;

        // Re-apply legal check for a few seconds — CCBI/UI may rebuild the checkbox after boot.
        try {
            var legalTicks = 0;
            var legalKeep = function() {
                legalTicks++;
                forceLegalAgreed();
                if (legalTicks >= 20) {
                    try { menu.rootNode.unschedule(legalKeep); } catch (eU) {}
                }
            };
            menu.rootNode.schedule(legalKeep, 0.5);
        } catch (eKeep) {}

        // Also intercept MainMenu green EffectButton handlers if present.
        try {
            ['onPressStartGame', 'onPressEnterGame', 'onPressLogin', 'onLogin',
             'startGame', 'enterGame', 'onPressOK'].forEach(function(name) {
                if (typeof menu[name] !== 'function' || menu[name].__localNativeEnter) return;
                var orig = menu[name];
                menu[name] = function() {
                    forceLegalAgreed();
                    protectSound();
                    LocalNative.writeStatus({step: 'MainMenu.' + name});
                    startWrapped();
                };
                menu[name].__localNativeEnter = true;
                menu[name].__orig = orig;
            });
        } catch (eMM) {}

        G_Director.setAnimationInterval(1 / 30);
        G_Director.resume();
        G_Director.startAnimation();
        forceLegalAgreed();
        setCaption('\u539f\u6d41\u7a0b\u672c\u5730\u9002\u914d \u00b7\u5df2\u52fe\u9009\u534f\u8bae\u00b7\u70b9\u7eff\u94ae');
        cc.log('DinoLocal: native adapter entry ready');
        try { LocalNative.startScoutCloudSync(); }
        catch (eScoutStartup) { LocalNative.scoutCloudStatus('start-failed', eScoutStartup.message); }
        return JSON.stringify({
            status: 'native-adapter-ready',
            storeKey: STORE_KEY,
            source: LocalNative.inferredSource
        });
    } catch (error) {
        return JSON.stringify({ status: 'failed', message: String(error), stack: error.stack });
    }
})();
