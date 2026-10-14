// Recon for the local training queue: soldier configs, costs and capacity helpers.
var out = { request: 'cultivate-train-001' };
try {
    out.hasTrainTypeIdList = (typeof TRAIN_TYPE_ID_LIST !== 'undefined');
    if (typeof TRAIN_TYPE_ID_LIST !== 'undefined') out.trainTypeIdList = TRAIN_TYPE_ID_LIST;
} catch (e) { out.trainTypeIdListErr = String(e); }
try {
    out.daKeys = Object.keys(DA).filter(function (k) {
        return /TRAIN|TRAIN_|train/.test(k);
    });
} catch (e) { out.daErr = String(e); }
try {
    // unit_main entries that look like trainable soldiers (have train_cost)
    var ids = Object.keys(data.unit_main);
    var soldiers = [];
    for (var i = 0; i < ids.length; i++) {
        var c = data.unit_main[ids[i]];
        if (!c || c.train_cost === undefined) continue;
        soldiers.push({
            id: ids[i],
            name: G_StringManager ? G_StringManager.str(c.name) : c.name,
            train_cost: c.train_cost,
            train_cost_type: c.train_cost_type,
            train_time: c.train_time,
            need_barrack_lv: c.need_barrack_lv,
            volume: c.volume,
            is_hero: c.is_hero,
            hero_kind: c.hero_kind,
            first_type: c.first_type,
            second_type: c.second_type,
            battle_type: c.battle_type,
            lv: c.lv
        });
    }
    out.soldierCount = soldiers.length;
    out.soldiers = soldiers.slice(0, 40);
} catch (e) { out.soldierErr = String(e) + ' ' + e.stack; }
try {
    out.dataKeys = Object.keys(data).filter(function (k) { return /train|soldier|egg|villager|hero/i.test(k); });
} catch (e) { out.dataKeysErr = String(e); }
try {
    var nest = data.unit_main['20601'];
    out.nest20601 = {};
    for (var k in nest) out.nest20601[k] = nest[k];
} catch (e) { out.nestErr = String(e); }
return out;
