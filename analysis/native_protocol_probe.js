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
        // Offline FMOD/sound can throw on button click and abort login before our hook.
        var quietSound = function() {
            try {
                var quiet = function() { return 0; };
                if (typeof G_SoundManager !== 'undefined' && G_SoundManager) {
                    G_SoundManager.playSound = quiet;
                    G_SoundManager.doPlay = quiet;
                    G_SoundManager.playMusic = quiet;
                    G_SoundManager.stop = quiet;
                    G_SoundManager.start = quiet;
                }
                if (typeof SoundManager !== 'undefined' && SoundManager && SoundManager.prototype) {
                    SoundManager.prototype.playSound = quiet;
                    SoundManager.prototype.doPlay = quiet;
                }
            } catch (eSound) {}
        };
        quietSound();
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
            // Inferred new-account seed from Rookie preconditions (NOT the eight test buildings).
            // Tile x/y are placeholders inside MAP_SIZE_BUILD until a real start_game dump exists.
            inferredSource: 'inferred-rookie-minimal-201-206-207-212'
        };

        LocalNative.readRaw = function() {
            var raw = sys.localStorage.getItem(STORE_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        };

        LocalNative.writeRaw = function(obj) {
            var text = JSON.stringify(obj);
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
                availableStages: [],
                finishedVirtualStages: [],
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
                exp: 0,
                experience: 0,
                diamond: 0,
                spirit: 0,
                league_points: 0,
                christmas_points: 0,
                frozen_d: 0,
                unfrozen_t: 0
            };
            for (var k in defaults) {
                if (!Object.prototype.hasOwnProperty.call(defaults, k)) continue;
                if (player[k] === undefined || player[k] === null)
                    player[k] = defaults[k];
            }
            return player;
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
            return u;
        };

        LocalNative.defaultLevelDict = function() {
            // Rookie-inferred starter: home / hero nest / train / one builder.
            // 301/205/203 are built during tutorial; 202/204 not proven in client tables.
            // user_config {} = brand-new Rookie bits so GH_story_1..3 then 201100(301) can start.
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
                    // 207 finished at login (train quest); upgrading 20701 needs home rely_base_lv>=2.
                    LocalNative.unit(3, 20701, 34, 28),
                    LocalNative.unit(4, 21201, 26, 36)
                ],
                walls: [],
                model_info: {},
                hero_donate_list: [],
                user_config: {}
            };
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
            if (lv.units.length < 1) return false;
            for (var i = 0; i < lv.units.length; i++) {
                var u = lv.units[i];
                if (!u || typeof u.sid !== 'number' || typeof u.typeid !== 'number') return false;
                if (typeof u.x !== 'number' || typeof u.y !== 'number') return false;
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
                LocalNative.ensurePlayerSocialFields(existing.level.player);
                if (!existing.level.user_config) existing.level.user_config = {};
                (existing.level.units || []).forEach(function(u) {
                    if (u.typeid != null) {
                        u.unit_type = Math.floor(Number(u.typeid) / 100);
                        u.unit_level = Number(u.typeid) % 100;
                        if (u.unit_mutateid == null) u.unit_mutateid = 0;
                    }
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
            LocalNative.writeRaw(store);
            return { store: store, created: true };
        };

        LocalNative.saveLevel = function(levelDict) {
            var store = LocalNative.readRaw();
            // Progress is persisted by RPC, not by dumpLevelData's empty/stale config.
            if (store && store.level) {
                levelDict.user_config = store.level.user_config || levelDict.user_config || {};
                if (levelDict.player && store.level.player && store.level.player.first_movie_played)
                    levelDict.player.first_movie_played = store.level.player.first_movie_played;
            }
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
                    if (typeof s === 'number' && s > maxSid) maxSid = s;
                }
            }
            LocalNative.nextSid = maxSid + 1;
            return LocalNative.nextSid;
        };

        LocalNative.allocateSid = function() {
            var sid = LocalNative.nextSid++;
            return sid;
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
                var bb = LocalNative.activeBuilder || LocalNative.getBuildingBuilder(unit);
                if (bb && bb.buildTime != null && bb.buildTime > 0) return Number(bb.buildTime);
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
                            rm.addRes(goldType, pack.gold - curG);
                            added.gold = pack.gold - curG;
                        }
                        if (curW < pack.wood) {
                            rm.addRes(woodType, pack.wood - curW);
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
                            if (afterG < pack.gold) rm.addRes(goldType, pack.gold - afterG);
                            if (afterW < pack.wood) rm.addRes(woodType, pack.wood - afterW);
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

        // After force-kill mid-build: finish elapsed jobs; re-schedule remaining timers.
        LocalNative.resumeConstructions = function(player) {
            try {
                var gc = LocalNative.getBuildController();
                if (!gc) return 0;
                var list = [];
                var b = gc.buildings;
                if (b) {
                    if (typeof b.length === 'number') {
                        for (var i = 0; i < b.length; i++) if (b[i]) list.push(b[i]);
                    } else {
                        var keys = Object.keys(b);
                        for (var j = 0; j < keys.length; j++) if (b[keys[j]]) list.push(b[keys[j]]);
                    }
                }
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
                        (function(p, s, r) {
                            LocalNative.scheduleOnRoot(function() {
                                LocalNative.ackBuildComplete(p, s, 'resume-timer');
                            }, r);
                        })(player, sid, remain);
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
            // Live gem-finish uses {uid: sid}; ans/complete use sid/unit.
            var sid = params.sid != null ? params.sid :
                (params.uid != null ? params.uid :
                    (params.unit != null && typeof params.unit === 'number' ? params.unit : null));
            var cid = params.cid != null ? params.cid : null;
            var unit = null;
            try {
                if (sid != null && typeof G_UnitManager !== 'undefined' && G_UnitManager &&
                    typeof G_UnitManager.getUnitBySID === 'function')
                    unit = G_UnitManager.getUnitBySID(sid);
            } catch (e1) {}
            try {
                if (!unit && cid != null && typeof G_UnitManager !== 'undefined' && G_UnitManager &&
                    typeof G_UnitManager.getUnit === 'function')
                    unit = G_UnitManager.getUnit(cid);
            } catch (e2) {}
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
        LocalNative.buildFinishSwapParams = function(unit) {
            if (!unit) return null;
            var oldType = unit.typeid != null ? unit.typeid : null;
            var realType = LocalNative.resolveRealTypeID(unit);
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
            return {
                old_config: oldConfig || newConfig,
                new_config: newConfig,
                coord: coord || {x: 24, y: 24},
                typeid: realType,
                unit_type: newConfig.unit_type != null ? newConfig.unit_type :
                    (typeof realType === 'number' ? Math.floor(realType / 100) : null),
                unit_level: newConfig.lv != null ? newConfig.lv :
                    (typeof realType === 'number' ? realType % 100 : 1)
            };
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
                ['updateCurrent', 'refreshOrHideQuestTipInfo', '_setCurrentQuestUI',
                 'finishMainQuest', '_clearQuestDataOnFinish', '_getMainQuestData'].forEach(function(fn) {
                    if (typeof qm[fn] !== 'function' || qm[fn].__localNativePatched) return;
                    var orig = qm[fn];
                    qm[fn] = function() {
                        try {
                            if (this.main_quest == null) this.main_quest = {};
                            if (this.clientMainQuest == null) this.clientMainQuest = {};
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

        LocalNative.persistFinishedUnit = function(unit) {
            if (!unit || unit.sid == null) return false;
            try {
                var dumped = null;
                if (typeof unit.dumpData === 'function') {
                    try { dumped = unit.dumpData(); } catch (eD) {}
                }
                if (!dumped || typeof dumped !== 'object') {
                    var x = null, y = null;
                    try {
                        var th = unit.getComponent && (unit.getComponent(
                            (typeof Comp !== 'undefined' && Comp.TileHolder) ? Comp.TileHolder : 'TileHolder'));
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
                if (!store.level.units) store.level.units = [];
                var units = store.level.units;
                var found = false;
                for (var i = 0; i < units.length; i++) {
                    if (units[i] && units[i].sid === unit.sid) {
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
            var swapParams = null;
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

                swapParams = LocalNative.buildFinishSwapParams(unit);
                // Default offline path: do NOT call stock onBuilderFinishBuilding.
                // Live runs: it destroys the CCBI then throws on QuestManager.main_quest,
                // leaving an invisible unit. Soft-stamp typeid and repair if needed.
                if (swapParams) {
                    try {
                        var tid0 = unit.typeid;
                        var real0 = swapParams.typeid;
                        unit.typeid = real0;
                        if (swapParams.new_config) {
                            unit.config = swapParams.new_config;
                            unit.cfg = swapParams.new_config;
                        }
                        if (typeof unit.unit_level !== 'undefined')
                            unit.unit_level = swapParams.unit_level != null ? swapParams.unit_level :
                                (typeof real0 === 'number' ? real0 % 100 : unit.unit_level);
                        try {
                            if (bb.typeid != null) bb.typeid = real0;
                            bb.state = BUILD_STATE_FINISH;
                        } catch (eBt0) {}
                        didModelSwap = true;
                        LocalNative.writeStatus({
                            step: 'finishViaBuilder-soft-typeid',
                            from: tid0,
                            to: real0,
                            visible: LocalNative.unitHasVisibleRoot(unit)
                        });
                    } catch (eSoft) {
                        LocalNative.writeStatus({
                            step: 'finishViaBuilder-soft-ERR',
                            error: String(eSoft)
                        });
                    }
                }

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
            // Success = logical finish (xx01) AND still visible (or at least on map with soft stamp).
            var ok = !placeholderLeft && (visible || onMap);
            LocalNative.writeStatus({
                step: ok ? (visible ? 'finishViaBuilder-ok' : 'finishViaBuilder-ok-soft') :
                    (placeholderLeft ? 'finishViaBuilder-partial' : 'finishViaBuilder-offmap'),
                reason: reason || null,
                sid: unit.sid != null ? unit.sid : null,
                beforeType: beforeType,
                afterType: afterType,
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

        LocalNative.tryDumpAndSave = function() {
            // Battle dumps must never replace the home city or its guide progress.
            if (typeof GS_CURRENT_STAGE !== 'undefined' && typeof GS_STAGE_BUILD !== 'undefined' &&
                GS_CURRENT_STAGE !== GS_STAGE_BUILD) return false;
            try {
                var gc = typeof DA.getGameController === 'function' ? DA.getGameController() : null;
                if (!gc || typeof gc.dumpLevelData !== 'function') return false;
                var dumped = gc.dumpLevelData();
                if (!dumped || typeof dumped !== 'object') return false;
                if (!dumped.player && G_Player) {
                    dumped.player = LocalNative.readRaw().level.player;
                }
                if (!dumped.user_config) {
                    var cur = LocalNative.readRaw();
                    dumped.user_config = cur && cur.level ? cur.level.user_config : {};
                }
                if (!dumped.walls) dumped.walls = [];
                if (!dumped.model_info) dumped.model_info = {};
                if (!dumped.hero_donate_list) dumped.hero_donate_list = [];
                LocalNative.saveLevel(dumped);
                return true;
            } catch (e) {
                LocalNative.lastError = String(e);
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
                if (u.typeid != null) {
                    u.unit_type = Math.floor(Number(u.typeid) / 100);
                    u.unit_level = Number(u.typeid) % 100;
                }
                if (u.faction == null) u.faction = defender;
                if (u.unit_mutateid == null) u.unit_mutateid = 0;
                if (u.state == null && typeof BUILD_STATE_FINISH !== 'undefined')
                    u.state = BUILD_STATE_FINISH;
                // Battle create paths often key off cid; home dumps use sid.
                if (u.cid == null && u.sid != null) u.cid = u.sid;
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
            if (!side.heros) side.heros = [];
            if (!side.league_tech) side.league_tech = [];
            if (side.first_time_stage == null)
                side.first_time_stage = (player && player.first_time_stage) || 0;
            return side;
        };

        LocalNative.countBattleUnits = function(gc) {
            var n = 0;
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

        LocalNative.ensureBattleClients = function() {
            var defF = typeof BATTLE_FACTION_DEFENDER !== 'undefined' ? BATTLE_FACTION_DEFENDER : 2;
            var atkF = typeof BATTLE_FACTION_ATTACKER !== 'undefined' ? BATTLE_FACTION_ATTACKER : 1;
            var defender = LocalNative.resolveBattleClient(defF);
            var attacker = LocalNative.resolveBattleClient(atkF);
            if (!attacker) {
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
                } catch (eAtk) {}
            }
            return {defender: defender, attacker: attacker};
        };

        LocalNative.withBattleClient = function(unit, client) {
            if (!unit) return unit;
            if (unit.client) return unit;
            var u = {};
            for (var k in unit) {
                if (Object.prototype.hasOwnProperty.call(unit, k)) u[k] = unit[k];
            }
            u.client = client || LocalNative.resolveBattleClient(u.faction);
            return u;
        };

        // TaskManager queues _createBattleUnitWhenInit with DELAY; if an earlier selector
        // throws (battleLogItem etc.), the queue dies and the village stays empty. Force
        // a synchronous create pass when nothing appeared after ILD.
        LocalNative.forceCreateBattleUnits = function(gc, units) {
            var list = units || [];
            var created = 0;
            var errors = [];
            if (!gc || !list.length) return {created: 0, errors: errors, now: 0};
            var clients = LocalNative.ensureBattleClients();
            var defender = clients.defender;
            for (var i = 0; i < list.length; i++) {
                var raw = list[i];
                if (!raw) continue;
                var beforeOne = LocalNative.countBattleUnits(gc);
                var u = LocalNative.withBattleClient(raw, defender);
                if (!u.client) {
                    errors.push({via: 'no-client', typeid: raw.typeid, error: 'client still undefined'});
                    continue;
                }
                var ok = false;
                try {
                    if (typeof gc._createBattleUnitWhenInit === 'function') {
                        gc._createBattleUnitWhenInit(u);
                        if (LocalNative.countBattleUnits(gc) > beforeOne) { created++; ok = true; }
                    }
                } catch (e1) {
                    errors.push({via: '_createBattleUnitWhenInit', typeid: u.typeid, error: String(e1)});
                }
                if (ok) continue;
                try {
                    if (typeof gc.__buildUnit === 'function') {
                        gc.__buildUnit(u);
                        if (LocalNative.countBattleUnits(gc) > beforeOne) { created++; ok = true; }
                    }
                } catch (e2) {
                    errors.push({via: '__buildUnit', typeid: u.typeid, error: String(e2)});
                }
                if (ok) continue;
                try {
                    if (typeof gc.createUnit === 'function') {
                        var faction = u.faction != null ? u.faction :
                            (typeof BATTLE_FACTION_DEFENDER !== 'undefined' ? BATTLE_FACTION_DEFENDER : 2);
                        gc.createUnit(u.typeid || u.unit_type, u.x, u.y, faction, u);
                        if (LocalNative.countBattleUnits(gc) > beforeOne) { created++; ok = true; }
                    }
                } catch (e3) {
                    errors.push({via: 'createUnit', typeid: u.typeid, error: String(e3)});
                }
                if (!ok && LocalNative.countBattleUnits(gc) <= beforeOne) {
                    errors.push({via: 'no-growth', typeid: u.typeid, error: 'unit count unchanged'});
                }
            }
            return {
                created: created,
                errors: errors,
                now: LocalNative.countBattleUnits(gc),
                hasDefender: !!defender
            };
        };

        LocalNative.ensureBattleVillageUnits = function(gc, units, reason) {
            var before = LocalNative.countBattleUnits(gc);
            if (before > 0) {
                LocalNative.writeStatus({
                    step: 'battle-units-ok',
                    reason: reason || null,
                    units: before
                });
                return before;
            }
            var result = LocalNative.forceCreateBattleUnits(gc, units);
            LocalNative.writeStatus({
                step: 'battle-units-force-create',
                reason: reason || null,
                before: before,
                created: result.created,
                now: result.now,
                hasDefender: !!result.hasDefender,
                errors: result.errors && result.errors.length ? result.errors.slice(0, 6) : []
            });
            return result.now;
        };

        // Rookie enemy-attack has no real BR_UNIT_CREATE records yet; spawn a few 10101 so
        // the raid is not an empty field after countdown.
        LocalNative.spawnStubAttackers = function(gc) {
            if (!gc) return 0;
            var atkF = typeof BATTLE_FACTION_ATTACKER !== 'undefined' ? BATTLE_FACTION_ATTACKER : 1;
            var client = LocalNative.resolveBattleClient(atkF);
            var before = LocalNative.countBattleUnits(gc);
            var spots = [[16, 20], [20, 16], [30, 16], [34, 20]];
            var spawned = 0;
            for (var i = 0; i < spots.length; i++) {
                var x = spots[i][0];
                var y = spots[i][1];
                var data = {
                    typeid: 10101, unit_type: 101, unit_level: 1,
                    x: x, y: y, faction: atkF, client: client, unit_mutateid: 0
                };
                try {
                    if (typeof gc.UserDelayedCreateUnit === 'function') {
                        try {
                            gc.UserDelayedCreateUnit(10101, x, y, null);
                            spawned++;
                            continue;
                        } catch (eU1) {
                            try { gc.UserDelayedCreateUnit(data); spawned++; continue; } catch (eU2) {}
                        }
                    }
                } catch (eU) {}
                try {
                    if (typeof gc.createUnit === 'function') {
                        gc.createUnit(10101, x, y, atkF, data);
                        spawned++;
                    }
                } catch (eC) {
                    LocalNative.writeStatus({
                        step: 'spawnStubAttackers-ERR',
                        error: String(eC),
                        i: i
                    });
                }
            }
            LocalNative.writeStatus({
                step: 'spawnStubAttackers',
                spawned: spawned,
                before: before,
                now: LocalNative.countBattleUnits(gc),
                hasAtkClient: !!client
            });
            return spawned;
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
            var units = LocalNative.normalizeReplayUnits(level.units || []);
            var walls = level.walls || [];
            var heroDonate = level.hero_donate_list || [];
            var modelInfo = level.model_info || {};
            var userConfig = level.user_config || {};

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
                model_info: modelInfo
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
            // Replay records:
            // Action 7: BR_START_BATTLE -> startBattle()
            // Action 5: BR_DELAY_END_BATTLE -> scheduleDelayedBattleFinish()
            var replayRecords = [
                [1, 0, 7],
                [180, 0, 5]
            ];
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
                replay: {records: replayRecords},
                records: replayRecords,
                seed: 1,
                pve_mode: 0,
                isPVE: true,
                isEnterEnemyAttackReplay: true,
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
            // Always schedule a late auto-return. Stub records may not tick if BattleRecorder
            // never starts; prepare countdown ~25s with no reaction must not softlock Rookie.
            LocalNative.scheduleOnRoot(function() {
                if (LocalNative.replaySession !== session || session.returning || session.closed)
                    return;
                LocalNative.writeStatus({
                    step: session.emptyRecords
                        ? 'replay-empty-records-auto-finish'
                        : 'replay-fallback-auto-finish',
                    stage: stageId,
                    emptyRecords: !!session.emptyRecords
                });
                LocalNative.handleFinishEnemyAttackReplay(player, {stage: stageId});
            }, 32.0);
            return true;
        };

        LocalNative.handleFinishEnemyAttackReplay = function(player, params) {
            var session = LocalNative.replaySession;
            player = player || (typeof G_Player !== 'undefined' ? G_Player : null);
            var inBattle = typeof GS_CURRENT_STAGE !== 'undefined' && typeof GS_STAGE_BATTLE !== 'undefined' &&
                GS_CURRENT_STAGE === GS_STAGE_BATTLE;
            if (session) {
                if (session.closed && !inBattle) return false;
                session.returning = true;
            }
            LocalNative.writeStatus({step: 'finish-enemy-attack-replay', inBattle: inBattle});
            try {
                var store = LocalNative.readRaw();
                var level = store && store.level ? store.level : LocalNative.defaultLevelDict();
                if (player && typeof player.rpc_c_battle_to_home === 'function') {
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
            return LocalNative.handleFinishEnemyAttackReplay(player, params);
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
                            var pending = LocalNative.findPendingBuildUnit();
                            var cid = pB.cid != null ? pB.cid :
                                (pending && (pending.cid != null ? pending.cid :
                                    (pending.getCID ? pending.getCID() : null)));
                            if (!pending && cid != null && typeof G_UnitManager !== 'undefined' &&
                                G_UnitManager && typeof G_UnitManager.getUnit === 'function') {
                                try { pending = G_UnitManager.getUnit(cid); } catch (eGu) {}
                            }
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
                            var sidU = pU.sid != null ? pU.sid :
                                (pU.unit != null && typeof pU.unit === 'number' ? pU.unit : null);
                            if (sidU == null && LocalNative.activeBuilder && LocalNative.activeBuilder.master)
                                sidU = LocalNative.activeBuilder.master.sid;
                            if (typeof selfU.rpc_c_ans_building_upgrade === 'function') {
                                selfU.rpc_c_ans_building_upgrade({success: true, unit: sidU});
                            }
                            var pendingU = sidU != null && G_UnitManager && G_UnitManager.getUnitBySID
                                ? G_UnitManager.getUnitBySID(sidU) : LocalNative.findPendingBuildUnit();
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
                if (methodName === 'rpc_s_finish_enemy_attack_replay') {
                    var selfFer = player;
                    var pFer = params || {};
                    LocalNative.writeStatus({
                        step: 'callServer-rpc_s_finish_enemy_attack_replay',
                        keys: entry.keys || null,
                        snap: entry.snap || null
                    });
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleFinishEnemyAttackReplay(selfFer, pFer);
                    }, 0);
                    return true;
                }
                if (methodName === 'rpc_s_battle_to_home' || methodName === 'rpc_s_leave_battle') {
                    var selfBth = player;
                    var pBth = params || {};
                    LocalNative.writeStatus({
                        step: 'callServer-' + methodName,
                        keys: entry.keys || null,
                        snap: entry.snap || null
                    });
                    LocalNative.scheduleOnRoot(function() {
                        LocalNative.handleBattleToHome(selfBth, pBth);
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
                'update_info', 'battle_recorders'
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
                    step.indexOf('_enterWorld') === 0 || step.indexOf('seed-starter') === 0;
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
                try { LocalNative.refreshHud(); } catch (eHud) {}
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
                try { LocalNative.tryDumpAndSave(); } catch (eDump) {}
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
            quietSound();
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
                            LocalNative.writeStatus({
                                step: 'initLevelFromData-enter',
                                keys: dict ? Object.keys(dict) : null,
                                units: dict && dict.units ? dict.units.length : null
                            });
                            try {
                                var ret = origILD.call(this, dict);
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
                        btp._createBattleUnitWhenInit = function(unitDict) {
                            var data = unitDict;
                            try {
                                if (data && !data.client) {
                                    data = LocalNative.withBattleClient(data, null);
                                }
                            } catch (eInj) {}
                            LocalNative.writeStatus({
                                step: '_createBattleUnitWhenInit-enter',
                                sid: data && data.sid,
                                cid: data && data.cid,
                                typeid: data && data.typeid,
                                x: data && data.x,
                                y: data && data.y,
                                hasClient: !!(data && data.client)
                            });
                            try {
                                var rCu = origCreateBattleUnit.call(this, data);
                                LocalNative.writeStatus({
                                    step: '_createBattleUnitWhenInit-exit',
                                    typeid: data && data.typeid,
                                    units: LocalNative.countBattleUnits(this)
                                });
                                return rCu;
                            } catch (eCu) {
                                LocalNative.writeStatus({
                                    step: '_createBattleUnitWhenInit-ERR',
                                    typeid: data && data.typeid,
                                    hasClient: !!(data && data.client),
                                    error: String(eCu)
                                });
                                throw eCu;
                            }
                        };
                        btp._createBattleUnitWhenInit.__localNativePatched = true; btp._createBattleUnitWhenInit.original = origCreateBattleUnit;
                    }
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

                                    if (dict.isEnterEnemyAttackReplay && (!dict.records || !dict.records.length)) {
                                        var repRecs = [
                                            [1, 0, 7],
                                            [180, 0, 5]
                                        ];
                                        dict.records = repRecs;
                                        if (!dict.replay || typeof dict.replay !== 'object')
                                            dict.replay = {};
                                        dict.replay.records = repRecs;
                                    }

                                    if (dict.records == null) dict.records = [];
                                    if (!dict.replay || typeof dict.replay !== 'object')
                                        dict.replay = {records: []};
                                    if (dict.replay.records == null) dict.replay.records = [];
                                    if (!dict.battleLogItem)
                                        dict.battleLogItem = dict.tempReplayBattleLog ||
                                            LocalNative.enemyAttackBattleLog ||
                                            LocalNative.buildEnemyAttackBattleLogStub(
                                                dict.player, dict.oppo.player);
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
                            LocalNative.writeStatus({
                                step: 'battle-initLevelFromData-enter',
                                keys: dict ? Object.keys(dict) : null,
                                hasOppoPlayer: !!(dict && dict.oppo && dict.oppo.player),
                                selfNick: dict && dict.self && dict.self.nickname,
                                oppoUnits: dict && dict.oppo && dict.oppo.units ? dict.oppo.units.length : 0,
                                hasBattleLog: !!(dict && (dict.battleLogItem ||
                                    dict.tempReplayBattleLog)),
                                units: dict && dict.units ? dict.units.length : null,
                                isReplay: !!(dict && dict.isEnterEnemyAttackReplay)
                            });
                            try {
                                var retB = origBattleILD.call(this, dict);
                                try {
                                    if (this && !this.battleLogItem)
                                        this.battleLogItem = (dict && dict.battleLogItem) ||
                                            LocalNative.enemyAttackBattleLog;
                                    if (this && this.menu && !this.menu.battleLogItem)
                                        this.menu.battleLogItem = this.battleLogItem;
                                } catch (eBind) {}
                                var selfBattle = this;
                                var expectUnits = (dict && dict.units) ? dict.units : [];
                                if (dict && dict.isEnterEnemyAttackReplay) {
                                    // Immediate + delayed force-create: TaskManager may still be
                                    // processing DELAY tasks; do not wait for a broken queue.
                                    try { LocalNative.ensureBattleClients(); } catch (eCli0) {}
                                    try {
                                        LocalNative.ensureBattleVillageUnits(
                                            selfBattle, expectUnits, 'post-ild');
                                    } catch (eForce0) {}
                                    var retryDelays = [0.35, 1.0, 2.0];
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
                                    // After prepare window starts, also try spawning stub raiders once.
                                    LocalNative.scheduleOnRoot(function() {
                                        try {
                                            LocalNative.ensureBattleVillageUnits(
                                                selfBattle, expectUnits, 'pre-raid');
                                            LocalNative.spawnStubAttackers(selfBattle);
                                        } catch (eRaid) {}
                                    }, 3.0);
                                    // Do NOT finish at 7.5s — prepare countdown is ~25s and early
                                    // finish leaves empty-village / no-reaction impressions.
                                    // Fallback return after prepare window if records/timeout fail.
                                    LocalNative.scheduleOnRoot(function() {
                                        try {
                                            var curStage = typeof GS_CURRENT_STAGE !== 'undefined'
                                                ? GS_CURRENT_STAGE : null;
                                            var bStage = typeof GS_STAGE_BATTLE !== 'undefined'
                                                ? GS_STAGE_BATTLE : null;
                                            var sess = LocalNative.replaySession;
                                            if (sess && (sess.returning || sess.closed)) return;
                                            if (curStage != null && curStage === bStage) {
                                                LocalNative.writeStatus({
                                                    step: 'battle-scene-fallback-return',
                                                    units: LocalNative.countBattleUnits(selfBattle)
                                                });
                                                LocalNative.handleFinishEnemyAttackReplay(
                                                    (typeof G_Player !== 'undefined' && G_Player) || null,
                                                    {stage: dict.stage || 20001}
                                                );
                                            }
                                        } catch (eUlt) {}
                                    }, 28.0);
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
                    if (typeof mbp.onBattleTimeout === 'function' && !mbp.onBattleTimeout.__localNativePatched) {
                        var origTimeout = mbp.onBattleTimeout;
                        mbp.onBattleTimeout = function() {
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
                            LocalNative.writeStatus({step: 'battle-onBattlePrepareTimeout'});
                            try {
                                var logicP = this.logic || (typeof GETCGC === 'function' && GETCGC());
                                if (logicP) {
                                    try {
                                        var storeU = LocalNative.readRaw();
                                        var homeUnits = storeU && storeU.level ? storeU.level.units : [];
                                        LocalNative.ensureBattleVillageUnits(
                                            logicP, LocalNative.normalizeReplayUnits(homeUnits || []),
                                            'prepare-timeout');
                                    } catch (eVu) {}
                                    try { LocalNative.spawnStubAttackers(logicP); } catch (eSp) {}
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

        LocalNative.resetCorruptStore = function() {
            try { sys.localStorage.removeItem(STORE_KEY); } catch (e1) {}
            try { sys.localStorage.removeItem('dino.local.native.status'); } catch (e2) {}
            LocalNative.completedSids = {};
            LocalNative.pendingBuilds = {};
            LocalNative.nextSid = 100;
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
                quietSound();
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
                    LocalNative.writeStatus({step: 'store-reset', error: String(eLoad)});
                    LocalNative.resetCorruptStore();
                    loaded = LocalNative.loadOrCreate();
                    levelDict = loaded.store.level;
                }
                LocalNative.ensurePlayerSocialFields(levelDict.player);
                // Keep saved first_movie_played. New store defaults to 0 so opening story can run.
                if (levelDict.player.first_movie_played == null)
                    levelDict.player.first_movie_played = loaded.created ? 0 : 1;
                if (!levelDict.user_config || typeof levelDict.user_config !== 'object')
                    levelDict.user_config = {};
                LocalNative.syncNextSid(levelDict.units);
                if (loaded.created) {
                    var hour = DA.getSystemCurrentTimeHour();
                    for (var i = 0; i < levelDict.units.length; i++) {
                        if (levelDict.units[i].lastCollectTime === 0)
                            levelDict.units[i].lastCollectTime = hour;
                    }
                    // Persist the inferred new-account seed before entering the original chain.
                    LocalNative.saveLevel(levelDict);
                    LocalNative.writeStatus({
                        step: 'new-account-seed',
                        nickname: levelDict.player.nickname,
                        units: levelDict.units.map(function(u) {
                            return {sid: u.sid, typeid: u.typeid, x: u.x, y: u.y};
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
                        // One retry with fresh inferred city if continue-save blows up.
                        try {
                            LocalNative.resetCorruptStore();
                            var fresh = LocalNative.loadOrCreate();
                            LocalNative.ensurePlayerSocialFields(fresh.store.level.player);
                            // Retry is a brand-new seed → keep first_movie_played=0 for guide.
                            GS_CURRENT_STAGE = GS_STAGE_NONE;
                            player.rpc_c_start_game(fresh.store.level);
                            loaded = fresh;
                            levelDict = fresh.store.level;
                            setCaption('\u5b58\u6863\u91cd\u7f6e\u540e\u91cd\u8bd5\u65b0\u8d26\u53f7\u5f15\u5bfc');
                        } catch (eRetry) {
                            LocalNative.unlockEnter();
                            setCaption('\u542f\u52a8\u5931\u8d25: ' + eRetry);
                            throw eRetry;
                        }
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
            quietSound();
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
                        quietSound();
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

        // Large bottom-center hit zone + label (MenuItemFont alone is easy to miss on phone).
        try {
            var zoneH = 110;
            var zoneW = Math.min(520, size.width * 0.55);
            var zone = cc.LayerColor.create({r: 40, g: 28, b: 10, a: 160}, zoneW, zoneH);
            zone.setPosition((size.width - zoneW) / 2, 8);
            menu.rootNode.addChild(zone, 100000);
            var zoneLabel = cc.LabelTTF.create('\u3010\u672c\u5730\u8fdb\u5165\u3011', 'Arial', 26);
            try { zoneLabel.setColor({r: 255, g: 230, b: 120}); } catch (eZL) {}
            zoneLabel.setPosition(zoneW / 2, zoneH / 2);
            zone.addChild(zoneLabel, 1);
            var enterTouch = new UI.Touchable();
            enterTouch.rootNode = zone;
            enterTouch.onTouchesBegan = function() { return true; };
            enterTouch.onTouchesMoved = function() {};
            enterTouch.onTouchesEnded = function() {
                LocalNative.writeStatus({step: 'backup-enter'});
                startWrapped();
            };
            enterTouch.onTouchesCancelled = function() {};
            enterTouch.initEventWithMultiTouch();
            if (enterTouch.__touch_layer && !enterTouch.__touch_layer.getParent())
                zone.addChild(enterTouch.__touch_layer, 2);
            enterTouch.enableTouchEvent();
        } catch (eMenu) {
            cc.log('DinoLocal native backup enter failed: ' + eMenu);
        }

        // Also intercept MainMenu green EffectButton handlers if present.
        try {
            ['onPressStartGame', 'onPressEnterGame', 'onPressLogin', 'onLogin',
             'startGame', 'enterGame', 'onPressOK'].forEach(function(name) {
                if (typeof menu[name] !== 'function' || menu[name].__localNativeEnter) return;
                var orig = menu[name];
                menu[name] = function() {
                    forceLegalAgreed();
                    quietSound();
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
        setCaption('\u539f\u6d41\u7a0b\u672c\u5730\u9002\u914d \u00b7\u5df2\u52fe\u9009\u534f\u8bae\u00b7\u70b9\u7eff\u94ae\u6216\u3010\u672c\u5730\u8fdb\u5165\u3011');
        cc.log('DinoLocal: native adapter entry ready');
        return JSON.stringify({
            status: 'native-adapter-ready',
            storeKey: STORE_KEY,
            source: LocalNative.inferredSource
        });
    } catch (error) {
        return JSON.stringify({ status: 'failed', message: String(error), stack: error.stack });
    }
})();
