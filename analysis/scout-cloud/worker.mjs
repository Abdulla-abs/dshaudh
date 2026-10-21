// CATALOG and LayoutCore are injected by tools/build_scout_cloud.cjs.
const MAX_BYTES = 262144;
class HttpError extends Error {
    constructor(status, message) { super(message); this.status = status; }
}
const reject = message => { throw new HttpError(400, message); };
const record = value => value && typeof value === 'object' && !Array.isArray(value);
function canonical(value) {
    if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
    if (record(value)) return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonical(value[k])).join(',') + '}';
    return JSON.stringify(value);
}
async function digest(value) {
    return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))), b => b.toString(16).padStart(2, '0')).join('');
}
export function compile(raw) {
    if (!record(raw) || !['buildings', 'walls', 'guards'].every(k => Array.isArray(raw[k]) && raw[k].every(record))) reject('请选择编辑器导出的布局 JSON。');
    // Reject explicit null cultivation fields: the editor's preview uses nullish defaults.
    for (const g of raw.guards) for (const k of ['evolution', 'reborn', 'mutateId'])
        if (k in g && !Number.isInteger(g[k])) reject('守军培养字段必须是整数。');
    const report = LayoutCore.validate(raw, CATALOG);
    if (report.errors.length) reject(report.errors.join('\n'));
    const homes = raw.buildings.filter(b => Math.floor(b.typeid / 100) === 201);
    if (homes.length !== 1) reject('随机侦察阵容必须恰好有一座大本营。');
    const start = 100000 + raw.stage * 1000;
    const anchors = new Map();
    const units = raw.buildings.map((b, i) => {
        const sid = start + i + 1;
        anchors.set(b.id, sid);
        return {sid, typeid:b.typeid, x:b.x, y:b.y, localNativeStableSid:true};
    });
    raw.guards.forEach((g, i) => {
        const variant = LayoutCore.guardVariant(g, CATALOG), typeid = variant.typeid;
        const sid = start + raw.buildings.length + i + 1, did = String(anchors.get(g.anchorId));
        const unit = {sid, id:sid, typeid, unit_type:Math.floor(typeid / 100), unit_level:typeid % 100,
            unit_mutateid:g.mutateId ?? 0, lv:g.level, xp:0, state:2, did, defense_id:did,
            rct:0, aht:0, aidx:-1, skills:[...new Set([...variant.basics[g.mutateId ?? 0], ...(g.skills || [])])],
            localNativeStableSid:true, localNativeGuard:true};
        if ('runes' in g) unit.eqp = g.runes.map((r, slot) => r === null ? null : ({typeid:r.typeid, slot,
            base_attr:r.base_attr || [], two_attr:r.two_attr || [], three_attr:r.three_attr || [], hero_attr:r.hero_attr ?? 0}));
        units.push(unit);
    });
    return {headquartersLevel:homes[0].level, layout:{stage:raw.stage, name:String(raw.name || '').slice(0,80),
        source:'user-authored-layout', units, walls:raw.walls.map(w => [w.level,w.x,w.y,0])}};
}
const headers = {'Content-Type':'application/json; charset=utf-8', 'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Methods':'GET, POST, DELETE, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization',
    'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff'};
const json = (value, status = 200) => new Response(JSON.stringify(value), {status, headers});
async function readJson(request) {
    if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) throw new HttpError(415, '需要 application/json。');
    if (Number(request.headers.get('Content-Length')) > MAX_BYTES) throw new HttpError(413, 'JSON 文件不能超过 256 KiB。');
    const reader = request.body?.getReader();
    if (!reader) reject('请求缺少 JSON。');
    const chunks = []; let size = 0;
    for (;;) {
        const {value, done} = await reader.read(); if (done) break;
        size += value.byteLength;
        if (size > MAX_BYTES) {await reader.cancel(); throw new HttpError(413, 'JSON 文件不能超过 256 KiB。');}
        chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) {bytes.set(chunk, offset); offset += chunk.length;}
    try {return JSON.parse(new TextDecoder('utf-8', {fatal:true}).decode(bytes).replace(/^\uFEFF/, ''));}
    catch {reject('JSON 文件无法解析。');}
}
async function allowance(db, key, limit) {
    const result = await db.prepare(`INSERT INTO scout_limits (bucket, hits, expires) VALUES (?, 1, ?)
        ON CONFLICT(bucket) DO UPDATE SET hits=hits+1 WHERE hits < ? RETURNING hits`).bind(key, Date.now()+86400000, limit).first();
    if (!result) throw new HttpError(429, '上传次数已达上限，请稍后再试。');
}
async function route(request, env) {
    const url = new URL(request.url), path = url.pathname, method = request.method;
    if (method === 'OPTIONS') return new Response(null, {status:204, headers});
    if (method === 'GET') {
        const assets = {'/':[UPLOAD_HTML,'text/html'], '/assets/upload.css':[UPLOAD_CSS,'text/css'], '/assets/upload.js':[UPLOAD_JS,'text/javascript']};
        if (Object.hasOwn(assets,path)) return new Response(assets[path][0], {headers:{
            'Content-Type':assets[path][1]+'; charset=utf-8', 'Cache-Control':'no-store',
            'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'no-referrer',
            'Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src data:; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"
        }});
    }
    if (!env.DB) throw new HttpError(503, '尚未绑定 DB 数据库。');
    if (method === 'GET' && path === '/api/health') {
        const meta = await env.DB.prepare('SELECT revision FROM scout_meta WHERE id=1').first();
        return json({ok:true, schema:'dino-scout-cloud/v1', revision:meta.revision});
    }
    if (method === 'GET' && path === '/api/pool') {
        // A D1 batch returns metadata and manifest from one sequential transaction.
        const results = await env.DB.batch([
            env.DB.prepare('SELECT revision FROM scout_meta WHERE id=1'),
            env.DB.prepare('SELECT id,name,author,headquarters_level AS headquartersLevel,created_at AS createdAt FROM scout_layouts WHERE published=1 ORDER BY id')
        ]);
        return json({schema:'dino-scout-cloud/v1', revision:results[0].results[0].revision, levels:results[1].results});
    }
    const rawMatch = path.match(/^\/api\/layouts\/([a-f0-9]{64})\/raw$/);
    if (method === 'GET' && rawMatch) {
        const row = await env.DB.prepare('SELECT raw FROM scout_layouts WHERE id=? AND published=1').bind(rawMatch[1]).first();
        if (!row) throw new HttpError(404, '阵容不存在或已下架。');
        return new Response(row.raw, {headers:{...headers, 'Content-Disposition':'attachment; filename="layout-'+rawMatch[1]+'.json"'}});
    }
    const match = path.match(/^\/api\/layouts\/([a-f0-9]{64})$/);
    if (method === 'GET' && match) {
        const row = await env.DB.prepare('SELECT compiled FROM scout_layouts WHERE id=? AND published=1').bind(match[1]).first();
        if (!row) throw new HttpError(404, '阵容不存在或已下架。');
        return json({schema:'dino-scout-entry/v1', id:match[1], ...JSON.parse(row.compiled)});
    }
    if (method === 'POST' && path === '/api/layouts') {
        const ip = request.headers.get('CF-Connecting-IP');
        if (!ip) throw new HttpError(403, '缺少来源地址。');
        const day = Math.floor(Date.now()/86400000), hour = Math.floor(Date.now()/3600000);
        await allowance(env.DB, 'ip:' + hour + ':' + await digest(day + ':' + ip), 5);
        await allowance(env.DB, 'global:' + day, 100);
        await env.DB.prepare('DELETE FROM scout_limits WHERE expires < ?').bind(Date.now()).run();
        const body = await readJson(request);
        if (!record(body) || typeof body.author !== 'string' || body.author.trim().length < 1 || body.author.trim().length > 40) reject('作者名需为 1～40 个字符。');
        const raw = body.layout;
        if (typeof raw?.name !== 'string' || !raw.name.trim() || raw.name.length > 80) reject('阵容名需为 1～80 个字符。');
        const compiled = compile(raw), id = await digest(canonical(compiled));
        const existing = await env.DB.prepare('SELECT id,published FROM scout_layouts WHERE id=?').bind(id).first();
        if (existing) {
            if (!existing.published) throw new HttpError(409, '此阵容已下架，不能重复发布。');
            return json({ok:true, id, duplicate:true});
        }
        const result = await env.DB.prepare(`INSERT OR IGNORE INTO scout_layouts
            (id,name,author,headquarters_level,raw,compiled,created_at,published)
            SELECT ?,?,?,?,?,?,?,1 WHERE (SELECT COUNT(*) FROM scout_layouts) < 1000`)
            .bind(id, raw.name.trim(), body.author.trim(), compiled.headquartersLevel, canonical(raw), canonical(compiled), new Date().toISOString()).run();
        if (!result.meta.changes) {
            const concurrent = await env.DB.prepare('SELECT id FROM scout_layouts WHERE id=?').bind(id).first();
            if (!concurrent) throw new HttpError(409, '阵容池已满，请联系维护者。');
        }
        return json({ok:true, id, duplicate:!result.meta.changes}, result.meta.changes ? 201 : 200);
    }
    if (method === 'DELETE' && match) {
        if (typeof env.ADMIN_TOKEN !== 'string' || env.ADMIN_TOKEN.length < 32) throw new HttpError(503, '尚未配置管理密钥。');
        const supplied = request.headers.get('Authorization') || '';
        if (await digest(supplied) !== await digest('Bearer ' + env.ADMIN_TOKEN)) throw new HttpError(401, '管理密钥无效。');
        const result = await env.DB.prepare('UPDATE scout_layouts SET published=0 WHERE id=? AND published=1').bind(match[1]).run();
        if (!result.meta.changes) throw new HttpError(404, '阵容不存在或已下架。');
        return json({ok:true});
    }
    throw new HttpError(404, '接口不存在。');
}
export default {
    async fetch(request, env) {
        try {return await route(request, env);}
        catch (error) {
            if (error instanceof HttpError) return json({ok:false,error:error.message}, error.status);
            console.error('scout-cloud error', error.message);
            return json({ok:false,error:'服务暂不可用，请确认已执行数据库初始化。'}, 503);
        }
    }
};
