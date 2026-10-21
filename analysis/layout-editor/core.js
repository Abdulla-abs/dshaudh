(function (root, factory) {
    const api = factory(typeof module === 'object' && module.exports
        ? require('../rpc-contracts/layout-map.json') : root.LAYOUT_MAP,
        typeof module === 'object' && module.exports ? require('./player-rules.json') : root.LAYOUT_PLAYER_RULES);
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.LayoutCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (map, playerRules) {
    'use strict';
    const MAP = Object.freeze({...map});
    const inBounds = (x, y) => Number.isInteger(x) && Number.isInteger(y) &&
        x >= MAP.playableMin && y >= MAP.playableMin && x <= MAP.playableMax && y <= MAP.playableMax;
    const SCHEMA = 'dino-pve-layout/v1';
    const clone = value => JSON.parse(JSON.stringify(value));
    const integer = n => Number.isInteger(n);
    const project = (x, y) => ({x: (x - y) * 24, y: (x + y) * 14});
    const unproject = (x, y) => ({x: x / 48 + y / 28, y: y / 28 - x / 48});
    function empty(stage = 7) {
        return {schema: SCHEMA, stage, name: `第 ${stage} 关`, mode:'free', baseLevel:playerRules.snapshot.baseLevel, map: {width: MAP.dataSize, height: MAP.dataSize},
            buildings: [], walls: [], guards: []};
    }
    function specFor(building, catalog) {
        if (!integer(building.level) || building.level < 1) return null;
        const family = Math.floor(Number(building.typeid) / 100);
        const entry = catalog.buildings.find(b => b.family === family);
        return entry && entry.levels.find(l => l.typeid === building.typeid && l.level === building.level);
    }
    function cells(building, catalog) {
        const s = specFor(building, catalog);
        if (!s) return [];
        const out = [];
        for (let x = building.x - s.width + 1; x <= building.x; x++)
            for (let y = building.y - s.height + 1; y <= building.y; y++) out.push({x, y});
        return out;
    }
    function line(a, b) {
        const out = [];
        let x = a.x, y = a.y, dx = Math.abs(b.x - x), dy = -Math.abs(b.y - y);
        const sx = x < b.x ? 1 : -1, sy = y < b.y ? 1 : -1;
        let err = dx + dy;
        for (;;) {
            out.push({x, y});
            if (x === b.x && y === b.y) break;
            const e = err * 2;
            if (e >= dy) {err += dy; x += sx;}
            if (e <= dx) {err += dx; y += sy;}
        }
        return out;
    }
    function guardVariant(g, catalog) {
        const hero=catalog.guards.find(h=>h.typeid===g.typeid);
        return hero && hero.variants.find(v=>v.evolution===(g.evolution??0)&&v.reborn===(g.reborn??0));
    }
    function guardErrors(g, catalog) {
        const errors=[],hero=catalog.guards.find(h=>h.typeid===g.typeid),variant=guardVariant(g,catalog);
        for(const field of ['evolution','reborn','mutateId'])
            if(g[field]!==undefined&&!integer(g[field]))errors.push('培养等级须为有效整数。');
        if(!variant)errors.push('转生或晋升等级不受支持。');
        const mutation=catalog.mutations.find(m=>m.id===(g.mutateId??0));
        if(!mutation||!variant?.basics[mutation.id]?.length)errors.push('变异类型或等级不受支持。');
        const skills=g.skills===undefined?[]:g.skills,seen=new Set();
        if(!Array.isArray(skills)||skills.length>3)errors.push('最多配置 3 个培养技能。');
        else for(const id of skills){
            const family=Math.floor(id/100),skill=hero?.skills.find(s=>s.id===family);
            if(!integer(id)||!skill||!skill.levels.includes(id%100)||seen.has(family))errors.push('技能不适用于该英雄、等级无效或重复。');
            seen.add(family);
        }
        errors.push(...runeErrors(g.runes,catalog));
        return errors;
    }
    function runeErrors(runes,catalog) {
        if(runes===undefined)return [];
        if(!Array.isArray(runes)||runes.length!==5)return ['符文须为 5 个槽位。'];
        const errors=[];
        runes.forEach((r,slot)=>{
            if(r===null)return;
            if(!r||typeof r!=='object'||!catalog.runes.items.some(i=>i.typeid===r.typeid&&i.slot===slot)){
                errors.push('符文类型或槽位不匹配。');return;
            }
            for(const layer of ['base_attr','two_attr','three_attr']){
                const attrs=r[layer]===undefined?[]:r[layer],seen=new Set();
                if(!Array.isArray(attrs)||attrs.length>11){errors.push('符文属性列表无效。');continue;}
                for(const id of attrs){const a=catalog.runes.attributes.find(a=>a.id===id&&a.layers.includes(layer));
                    if(!a||seen.has(a.stat))errors.push('符文属性无效或同类属性重复。');
                    if(a)seen.add(a.stat);
                }
            }
            const exclusive=r.hero_attr===undefined?0:r.hero_attr;
            if(!integer(exclusive)||(exclusive!==0&&!catalog.runes.exclusive.some(e=>e.hero===exclusive)))errors.push('符文专属英雄无效。');
        });
        return errors;
    }
    function runeCombination(g,catalog) {
        const items=[];
        for(const rune of g.runes||[]){
            if(!rune)break;
            const item=catalog.runes.items.find(i=>i.typeid===rune.typeid);if(!item)break;
            items.push(item);
        }
        for(let n=items.length;n>0;n--){
            const key=items.slice(0,n).map(i=>i.type).join(''),order=catalog.runes.orders.find(o=>o.key===key);
            if(!order)continue;
            const rate=items.slice(0,n).reduce((v,i)=>v+i.level,0)/(3*n),level=rate<=.6?1:rate<=.8?2:3;
            const skill=Math.floor(g.typeid/100)===115&&order.replacement?order.replacement:order.skill;
            return {key,skill:skill*100+level,...catalog.runes.skills.find(s=>s.id===skill).levels.find(s=>s.level===level)};
        }
        return null;
    }
    function playerLimit(layout, family) {
        const rule=playerRules.families[family],base=layout.baseLevel;
        const levels=Object.entries(rule?.levels||{}).filter(([,required])=>required<=base).map(([lv])=>Number(lv));
        const count=rule?.counts[base-1]||0;
        return {count,levels,maxLevel:Math.max(0,...levels),currentCount:rule?.currentCount||0};
    }
    function playerViolations(layout, requireBase=false) {
        if(layout.mode!=='player')return [];
        const issues=[],counts={};
        const add=(key,amount,message)=>issues.push({key,amount,message});
        for(const b of layout.buildings) {
            const f=Math.floor(b.typeid/100),limit=playerLimit(layout,f);
            counts[f]=(counts[f]||0)+1;
            if(!limit.levels.includes(b.level))add('level:'+b.id,b.level,`${playerRules.families[f]?.name||b.id} ${b.level} 级不适用于 ${layout.baseLevel} 级大本营（最高 ${limit.maxLevel} 级）。`);
            if(f===201&&b.level!==layout.baseLevel)add('base:'+b.id,1,`大本营须与模式设置一致：${layout.baseLevel} 级。`);
        }
        counts[211]=(counts[211]||0)+layout.walls.length;
        for(const [family,count] of Object.entries(counts)){
            const limit=playerLimit(layout,family);
            if(count>limit.count)add('count:'+family,count-limit.count,`${playerRules.families[family]?.name||family}数量 ${count}/${limit.count}，超出 ${layout.baseLevel} 级大本营限制。`);
        }
        const wallLimit=playerLimit(layout,211);
        for(const w of layout.walls)if(!wallLimit.levels.includes(w.level))add(`wall:${w.x}:${w.y}`,w.level,`城墙 ${w.level} 级超限，当前最高 ${wallLimit.maxLevel} 级。`);
        if(requireBase&&!counts[201])add('missingBase',1,'玩家模式须放置一座与设置等级一致的大本营。');
        return issues;
    }
    function worsensPlayerLimits(before,after) {
        const prior=new Map(playerViolations(before).map(i=>[i.key,i.amount]));
        return playerViolations(after).find(i=>i.amount>(prior.get(i.key)||0));
    }
    function validate(layout, catalog, allowEmpty = false, skipPlayer = false) {
        const errors = [], warnings = [], used = new Map(), ids = new Set();
        const add = message => {if (errors.length < 20) errors.push(message);};
        if (layout.schema !== SCHEMA) add('布局文件版本不支持。');
        if(layout.mode!==undefined&&!['free','player'].includes(layout.mode))add('编辑模式无效。');
        if(layout.baseLevel!==undefined&&(!integer(layout.baseLevel)||layout.baseLevel<1||layout.baseLevel>10))add('大本营等级须为 1～10。');
        if(layout.mode==='player'&&layout.baseLevel===undefined)add('玩家模式缺少大本营等级。');
        if (!integer(layout.stage) || layout.stage < 1 || layout.stage > 999) add('关卡编号须为 1～999。');
        if (!layout.map || layout.map.width !== MAP.dataSize || layout.map.height !== MAP.dataSize) add(`布局数据尺寸须为 ${MAP.dataSize} × ${MAP.dataSize} 格。`);
        if (!Array.isArray(layout.buildings) || !Array.isArray(layout.walls) || !Array.isArray(layout.guards))
            return {errors: ['布局缺少建筑、围墙或守军列表。'], warnings};
        if (layout.buildings.length > (MAP.playableMax-MAP.playableMin+1)**2 || layout.walls.length > 4096 || layout.guards.length > 128)
            return {errors: ['布局对象数量超出限制。'], warnings};
        if (!allowEmpty && !layout.buildings.length) add('至少放置一座建筑后再导出。');
        for (const b of layout.buildings) {
            if (typeof b.id !== 'string' || !b.id || b.id.length > 80 || ids.has(b.id)) add('建筑编号重复或无效。');
            ids.add(b.id);
            if (!specFor(b, catalog)) {add(`建筑 ${b.id} 的类型或等级不受支持。`); continue;}
            if (!integer(b.x) || !integer(b.y)) {add(`建筑 ${b.id} 的坐标须为整数。`); continue;}
            for (const c of cells(b, catalog)) {
                const key = `${c.x}:${c.y}`;
                if (!inBounds(c.x, c.y)) {add(`建筑 ${b.id} 超出地图边界，可建造坐标为 ${MAP.playableMin}～${MAP.playableMax}。`); break;}
                if (used.has(key)) {add(`建筑 ${b.id} 与 ${used.get(key)} 重叠。`); break;}
                used.set(key, b.id);
            }
        }
        for (const w of layout.walls) {
            const key = `${w.x}:${w.y}`;
            if (!inBounds(w.x, w.y) || !integer(w.level) || w.level < 1 || w.level > 10) {add('围墙坐标或等级无效。'); continue;}
            if (used.has(key)) add(`围墙与 ${used.get(key)} 重叠（${w.x}, ${w.y}）。`);
            used.set(key, '另一段围墙');
        }
        for (const g of layout.guards) {
            if (typeof g.id !== 'string' || !g.id || g.id.length > 80 || ids.has(g.id)) add('守军编号重复或无效。');
            ids.add(g.id);
            const anchor = layout.buildings.find(b => b.id === g.anchorId);
            if (!anchor || ![505, 506, 507, 301].includes(Math.floor(anchor.typeid / 100))) add(`守军 ${g.id} 未绑定旗子或龙弹堡。`);
            if (!catalog.guards.some(t => t.typeid === g.typeid)) add(`守军 ${g.id} 的种类不受支持。`);
            if (!integer(g.level) || g.level < 1 || g.level > 100) add('守军等级须为 1～100。');
            for(const message of guardErrors(g,catalog))add(`守军 ${g.id}：${message}`);
        }
        if (!layout.buildings.some(b => Math.floor(b.typeid / 100) === 201)) warnings.push('尚未放置大本营。');
        if (!layout.walls.length) warnings.push('当前布局没有围墙。');
        if(!skipPlayer)for(const issue of playerViolations(layout,!allowEmpty))add(issue.message);
        return {errors: [...new Set(errors)], warnings};
    }
    function normalize(raw, catalog) {
        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw Error('请选择有效的布局 JSON 文件。');
        // Accept the earlier reference contract as an editable draft, never as a default.
        if (!raw.schema && Array.isArray(raw.structures)) {
            const draft = empty(Number(raw.stage) || 7);
            draft.buildings = raw.structures.map(b => ({id: String(b.sid), typeid: b.typeid,
                level: b.typeid % 100, x: b.x, y: b.y}));
            const seen = new Set();
            const addLine = (a, b) => {for (const c of line(a, b)) {
                const key = `${c.x}:${c.y}`;
                if (!seen.has(key)) {seen.add(key); draft.walls.push({...c, level: raw.walls.level || 1});}
            }};
            const outline = raw.walls && raw.walls.outline || [];
            const partitions = raw.walls && raw.walls.partitions || [];
            if (!Array.isArray(outline) || !Array.isArray(partitions) || outline.length > 256 || partitions.length > 256 ||
                outline.some(p => !Array.isArray(p) || p.length !== 2 || p.some(n => !integer(n) || n < 0 || n > 63)) ||
                partitions.some(p => !Array.isArray(p) || p.length !== 4 || p.some(n => !integer(n) || n < 0 || n > 63)))
                throw Error('旧草图的墙坐标无效。');
            for (let i = 1; i < outline.length; i++) addLine({x:outline[i-1][0],y:outline[i-1][1]}, {x:outline[i][0],y:outline[i][1]});
            for (const s of partitions) addLine({x:s[0],y:s[1]}, {x:s[2],y:s[3]});
            if (raw.guard) draft.guards.push({id:String(raw.guard.sid), typeid:raw.guard.typeid,
                level:raw.guard.lv || 1, anchorId:String(raw.guard.did)});
            raw = draft;
        }
        const result = empty();
        result.schema = raw.schema;
        result.mode = raw.mode??'free';
        result.baseLevel = raw.baseLevel??playerRules.snapshot.baseLevel;
        result.stage = raw.stage;
        result.name = String(raw.name || `第 ${raw.stage} 关`).slice(0, 80);
        result.map = raw.map;
        result.buildings = Array.isArray(raw.buildings) ? raw.buildings.map(b => ({
            id:b.id, typeid:b.typeid, level:b.level, x:b.x, y:b.y})) : raw.buildings;
        result.walls = Array.isArray(raw.walls) ? raw.walls.map(w => ({x:w.x,y:w.y,level:w.level})) : raw.walls;
        result.guards = Array.isArray(raw.guards) ? raw.guards.map(g => ({
            id:g.id,typeid:g.typeid,level:g.level,anchorId:g.anchorId,
            ...(g.evolution!==undefined?{evolution:g.evolution}:{}),
            ...(g.reborn!==undefined?{reborn:g.reborn}:{}),
            ...(g.mutateId!==undefined?{mutateId:g.mutateId}:{}),
            ...(g.skills!==undefined?{skills:g.skills}:{}),
            ...(g.runes!==undefined?{runes:g.runes}: {})})) : raw.guards;
        const report = validate(result, catalog, true, true);
        if (report.errors.length) throw Error(report.errors.join('\n'));
        return clone(result);
    }
    function wallStroke(start, end, shape) {
        if (shape !== 'rectangle') return line(start, end);
        const x1=Math.min(start.x,end.x),x2=Math.max(start.x,end.x);
        const y1=Math.min(start.y,end.y),y2=Math.max(start.y,end.y),cells=[],seen=new Set();
        for(const segment of [[{x:x1,y:y1},{x:x2,y:y1}],[{x:x2,y:y1},{x:x2,y:y2}],
            [{x:x2,y:y2},{x:x1,y:y2}],[{x:x1,y:y2},{x:x1,y:y1}]]) {
            for(const c of line(...segment)) {
                const key=`${c.x}:${c.y}`;
                if(!seen.has(key)){seen.add(key);cells.push(c);}
            }
        }
        return cells;
    }
    return {MAP, playerRules, playerLimit, playerViolations, worsensPlayerLimits, inBounds, SCHEMA, empty, clone, project, unproject, specFor, cells, line, wallStroke, validate, normalize, guardVariant, guardErrors, runeErrors, runeCombination};
});
