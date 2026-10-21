const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
const tables = path.resolve(__dirname, '../.local/shop-treasure');
const local = path.resolve(__dirname, '../.local/avatar-achieve');

let disk, unlocks = 0, notices = 0, expAdds = 0;
const ctx = {
    LocalNative: {}, data: {}, Math, Object, Array, JSON, Date, Number, String,
    GS_CURRENT_STAGE: 1, GS_STAGE_BUILD: 1, RES_TYPE_DIAMOND: 3,
    G_UnitManager: { getUnitBySID() { return null; } },
    G_MainController: { setNotice() { notices++; } }
};
vm.createContext(ctx);
for (const name of ['resource_input', 'input_event_client'])
    vm.runInContext(fs.readFileSync(`${tables}/${name}.js`, 'utf8'), ctx);
for (const name of ['player_head', 'achieve'])
    vm.runInContext(fs.readFileSync(`${local}/${name}.js`, 'utf8'), ctx);

function load(name, next) {
    const a = source.indexOf(`        LocalNative.${name} = function`);
    const b = source.indexOf(`        LocalNative.${next} = function`, a + 1);
    assert.ok(a >= 0 && b > a, name);
    vm.runInContext(source.slice(a, b), ctx);
}
// Helpers used by gain-achieve path.
load('grantPveLoot', 'applyPveItemReward');
const shopA = source.indexOf('        LocalNative.shopPolicy =');
const shopB = source.indexOf('        LocalNative.handleChangeNickname =', shopA);
vm.runInContext(source.slice(shopA, shopB), ctx);
load('collectDefaultAvatars', 'ensureAvatarFields');
load('ensureAvatarFields', 'ensurePlayerSocialFields');
load('ensurePlayerSocialFields', 'normalizeStageMap');
load('collectQuestPutinRewards', 'previewQuestRewards');
load('syncQuestPackageAndWallet', 'handleRefreshDailyQuest');
load('avatarOwned', 'handleChangeAvatar');
load('handleChangeAvatar', 'handleBuyAvatar');
load('handleBuyAvatar', 'handleGainAchieve');
load('handleGainAchieve', 'installCallServer');

const n = ctx.LocalNative;
Object.assign(n, {
    readRaw: () => JSON.parse(disk),
    writeRaw(s) { disk = JSON.stringify(s); },
    writeStatus() {},
    copyAccountProgress(target, p) {
        if (typeof p.exp === 'number') target.exp = p.exp;
        if (typeof p.level === 'number') target.level = p.level;
    },
    getResourceManager: () => rm,
    questPlayerLevel: (level) => Number(level.player.level) || 1,
    syncSavedHomeWallet(level) {
        rm.Res[3] = level.player.diamond;
        rm.Res[4] = level.player.spirit;
    },
    snapshotBuildingRecord: (u) => u,
    ensureAvailableStages() {},
    ensureWelcomeLetter() {}
});

let rm, player, personalize, recorder;
function reset(extra) {
    const playerSave = Object.assign({
        nickname: 'LocalRookie', level: 5, exp: 20, diamond: 500, spirit: 50,
        avatar_id: 0, avatar_list: null, achieve_raw: { hero_times: 3 },
        gained_achieve: {}, package: {}
    }, extra || {});
    disk = JSON.stringify({ version: 1, level: { player: playerSave, units: [], heros: [] } });
    rm = {
        Res: { 1: 0, 2: 0, 3: playerSave.diamond, 4: playerSave.spirit },
        useRes(amount, type) {
            assert.equal(type, 3);
            if (this.Res[3] < amount) return false;
            this.Res[3] -= amount;
            return true;
        }
    };
    personalize = {
        avatar_id: Number(playerSave.avatar_id) || 0,
        avatar_list: Array.isArray(playerSave.avatar_list) ? playerSave.avatar_list.slice() : []
    };
    recorder = {
        achieve_raw: Object.assign({}, playerSave.achieve_raw),
        gained_achieve: Object.assign({}, playerSave.gained_achieve)
    };
    unlocks = 0;
    expAdds = 0;
    player = {
        level: playerSave.level, exp: playerSave.exp,
        getComponent(name) {
            if (name === 'Personalize') return personalize;
            if (name === 'AchievementRecorder') return recorder;
            if (name === 'ResourceManager') return rm;
            if (name === 'PackageManager') return null;
            return null;
        },
        addExp(v) { expAdds += v; this.exp += v; },
        noticeDiamondReward() {},
        rpc_c_unlock_avatar(dict) {
            unlocks++;
            personalize.avatar_list.push(dict.avatar_id);
            personalize.avatar_id = dict.avatar_id;
        }
    };
}

// 1) Invalid avatar_id 0 is repaired to a real default_have head.
reset();
const repaired = JSON.parse(disk).level.player;
n.ensurePlayerSocialFields(repaired);
assert.notEqual(repaired.avatar_id, 0);
assert.ok(ctx.data.player_head[repaired.avatar_id] ||
    ctx.data.player_head[String(repaired.avatar_id)]);
assert.ok(Array.isArray(repaired.avatar_list) && repaired.avatar_list.length >= 2);
assert.ok(n.avatarOwned(repaired.avatar_list, repaired.avatar_id));

// 2) Change avatar persists owned head.
reset({ avatar_id: 6, avatar_list: [6, 36] });
personalize.avatar_id = 6;
personalize.avatar_list = [6, 36];
assert.equal(n.handleChangeAvatar(player, { avatar_id: 36 }), true);
assert.equal(JSON.parse(disk).level.player.avatar_id, 36);
assert.equal(personalize.avatar_id, 36);
assert.equal(n.handleChangeAvatar(player, { avatar_id: 2 }), false, 'unowned change rejected');

// 3) Buy avatar charges gems once and unlocks via stock callback.
reset({ avatar_id: 6, avatar_list: [6, 36], diamond: 200 });
personalize.avatar_id = 6;
personalize.avatar_list = [6, 36];
rm.Res[3] = 200;
const cost = Number(ctx.data.player_head[1].need_gems);
assert.ok(cost > 0);
assert.equal(n.handleBuyAvatar(player, { avatar_id: 1 }), true);
assert.equal(unlocks, 1);
assert.equal(rm.Res[3], 200 - cost);
assert.ok(n.avatarOwned(JSON.parse(disk).level.player.avatar_list, 1));
assert.ok(n.avatarOwned(personalize.avatar_list, 1));
assert.equal(n.handleBuyAvatar(player, { avatar_id: 1 }), true, 'duplicate buy is idempotent');
assert.equal(unlocks, 1, 'duplicate buy must not push again');
assert.equal(rm.Res[3], 200 - cost, 'duplicate buy must not charge again');

// 4) Gain achieve grants input_id gems + reward_exp, persists gained_achieve.
reset({ avatar_id: 6, avatar_list: [6, 36], diamond: 100, exp: 10, level: 5 });
personalize.avatar_id = 6;
personalize.avatar_list = [6, 36];
rm.Res[3] = 100;
recorder.gained_achieve = {};
const achieveId = 10001;
const cfg = ctx.data.achieve[achieveId];
assert.ok(cfg && cfg.input_id && cfg.reward_gem === 1);
// Client marks gained before the RPC.
recorder.gained_achieve[achieveId] = { gain_time: 1 };
assert.equal(n.handleGainAchieve(player, { achieve_id: achieveId }), true);
const after = JSON.parse(disk).level.player;
assert.ok(after.gained_achieve[achieveId] || after.gained_achieve[String(achieveId)]);
assert.equal(after.diamond, 101);
assert.equal(rm.Res[3], 101);
assert.equal(n.handleGainAchieve(player, { achieve_id: achieveId }), true, 'repeat claim ok');
assert.equal(JSON.parse(disk).level.player.diamond, 101, 'repeat claim cannot double-pay');

// Exp+gem achieve
const expId = 10025;
assert.ok(ctx.data.achieve[expId].reward_exp > 0);
recorder.gained_achieve[expId] = { gain_time: 2 };
const beforeExp = player.exp;
const beforeGem = rm.Res[3];
assert.equal(n.handleGainAchieve(player, { achieve_id: expId }), true);
assert.equal(player.exp, beforeExp + ctx.data.achieve[expId].reward_exp);
assert.equal(rm.Res[3], beforeGem + ctx.data.achieve[expId].reward_gem);

console.log('PASS: avatar seed/repair, change, buy, gain-achieve rewards and idempotence');
