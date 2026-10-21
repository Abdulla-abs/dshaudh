import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {spawnSync} from 'node:child_process';
import worker, {compile} from '../artifacts/scout-cloud/worker.mjs';
const manifest = JSON.parse(fs.readFileSync('analysis/rpc-contracts/scout-pool.json'));
const layouts = manifest.levels.map(entry => JSON.parse(fs.readFileSync('analysis/rpc-contracts/' + entry.layout)));
fs.mkdirSync('.local/scout-cloud', {recursive:true});
const py = spawnSync('python', ['-c', `import sys,json;sys.path.insert(0,'tools');from build_scout_pool import compile_pool;print(json.dumps(compile_pool(json.load(open('analysis/rpc-contracts/scout-pool.json',encoding='utf-8')))))`], {encoding:'utf8'});
assert.equal(py.status, 0, py.stderr);
const expected = JSON.parse(py.stdout);
layouts.forEach((raw, i) => assert.deepEqual(compile(raw), {headquartersLevel:expected.levels[i].headquartersLevel, layout:expected.levels[i].layout}));
const samplePath = process.argv[2];
let sample;
if (samplePath) {
    sample=JSON.parse(fs.readFileSync(samplePath,'utf8').replace(/^\uFEFF/,''));
    const check=spawnSync('python',['-c',`import sys,json;sys.path.insert(0,'tools');from import_pve_layout import compile_layout;print(json.dumps(compile_layout(json.load(open(sys.argv[1],encoding='utf-8-sig')))))`,samplePath],{encoding:'utf8'});
    assert.equal(check.status,0,check.stderr);
    assert.deepEqual(compile(sample).layout,JSON.parse(check.stdout));
}
const db = new DatabaseSync('.local/scout-cloud/test.sqlite');
db.exec('DROP TABLE IF EXISTS scout_layouts; DROP TABLE IF EXISTS scout_meta; DROP TABLE IF EXISTS scout_limits;');
db.exec(fs.readFileSync('analysis/scout-cloud/schema.sql', 'utf8'));
function statement(sql, args = []) {
    return {bind(...values) {return statement(sql, values);}, async first() {return db.prepare(sql).get(...args) || null;},
        async run() {const r = db.prepare(sql).run(...args); return {meta:{changes:Number(r.changes)}};},
        async all() {return {results:db.prepare(sql).all(...args)};}};
}
const env = {ADMIN_TOKEN:'a'.repeat(40), DB:{prepare:statement, async batch(items) {
    db.exec('BEGIN'); try {const result = []; for (const item of items) result.push(await item.all()); db.exec('COMMIT'); return result;}
    catch(e) {db.exec('ROLLBACK'); throw e;}
}}};
let ip = 0;
async function call(path, method = 'GET', value, extra = {}) {
    const response = await worker.fetch(new Request('https://test.invalid' + path, {method,
        headers:{'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.' + (++ip), ...extra},
        ...(value === undefined ? {} : {body:typeof value === 'string' ? value : JSON.stringify(value)})}), env);
    return {status:response.status, body:await response.json()};
}
assert.equal((await call('/api/health')).body.revision, 0);
for(const [path,type] of [['/','text/html'],['/assets/upload.css','text/css'],['/assets/upload.js','text/javascript']]) {
    const response=await worker.fetch(new Request('https://test.invalid'+path),env);
    assert.equal(response.status,200); assert.ok(response.headers.get('Content-Type').startsWith(type));
    assert.ok(response.headers.get('Content-Security-Policy').includes("script-src 'self'"));
}
const created = await call('/api/layouts','POST',{author:'测试作者',layout:layouts[0]});
assert.equal(created.status, 201);
const id = created.body.id;
assert.equal((await call('/api/layouts','POST',{author:'另一作者',layout:layouts[0]})).body.duplicate,true);
const pool = (await call('/api/pool')).body;
assert.equal(pool.revision,1); assert.equal(pool.levels.length,1);
assert.deepEqual((await call('/api/layouts/'+id)).body.layout, expected.levels[0].layout);
assert.deepEqual((await call('/api/layouts/'+id+'/raw')).body,layouts[0]);
assert.equal((await call('/api/layouts','POST','{broken')).status,400);
assert.equal((await call('/api/layouts','POST',{author:'x',layout:null})).status,400);
const invalid = structuredClone(layouts[0]); invalid.buildings[0].x = 0;
assert.equal((await call('/api/layouts','POST',{author:'x',layout:invalid})).status,400);
assert.equal((await call('/api/layouts','POST',' '.repeat(262145))).status,413);
for(let i=0;i<5;i++) assert.equal((await call('/api/layouts','POST','{}',{'CF-Connecting-IP':'fixed'})).status,400);
assert.equal((await call('/api/layouts','POST','{}',{'CF-Connecting-IP':'fixed'})).status,429);
assert.equal((await call('/api/layouts/'+id,'DELETE')).status,401);
assert.equal((await call('/api/layouts/'+id,'DELETE',undefined,{Authorization:'Bearer '+env.ADMIN_TOKEN})).status,200);
assert.equal((await call('/api/pool')).body.revision,2);
assert.equal((await call('/api/pool')).body.levels.length,0);
assert.equal((await call('/api/layouts/'+id)).status,404);
assert.equal((await call('/api/layouts/'+id+'/raw')).status,404);
assert.equal((await call('/api/layouts','POST',{author:'x',layout:layouts[0]})).status,409);
const noDB = await worker.fetch(new Request('https://test.invalid/api/health'),{});
assert.equal(noDB.status,503);
if(sample) {
    const first=await call('/api/layouts','POST',{author:'阵容测试',layout:sample});
    assert.equal(first.status,201);
    assert.equal((await call('/api/layouts','POST',{author:'阵容测试',layout:sample})).body.duplicate,true);
    assert.deepEqual((await call('/api/layouts/'+first.body.id+'/raw')).body,sample);
    assert.deepEqual((await call('/api/layouts/'+first.body.id)).body.layout,compile(sample).layout);
}
db.close();
const summary = {passed:true, pythonParity:layouts.length+(sample?1:0), userSample:sample?{name:sample.name,buildings:sample.buildings.length,walls:sample.walls.length,guards:sample.guards.length}:null, checks:['upload','duplicate','manifest','download','raw-download','static-assets','CSP','bad-json','bad-schema','bounds','body-limit','rate-limit','admin-auth','unpublish','revision','missing-binding']};
fs.writeFileSync('.local/scout-cloud/check-result.json',JSON.stringify(summary,null,2));
console.log(JSON.stringify(summary));
