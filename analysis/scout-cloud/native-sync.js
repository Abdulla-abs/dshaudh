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
