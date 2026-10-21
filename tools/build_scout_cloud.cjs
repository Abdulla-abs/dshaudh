// Build a dependency-free module that can be pasted into the Cloudflare editor.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const core = read('analysis/layout-editor/core.js');
const marker = 'function (map, playerRules) {';
if (!core.includes(marker) || !core.trimEnd().endsWith('});')) throw Error('LayoutCore wrapper changed');
const factory = core.slice(core.indexOf(marker), core.lastIndexOf('});') + 1);
const assets = ['html','css','js'].map(ext => 'const UPLOAD_' + ext.toUpperCase() + ' = ' + JSON.stringify(read('analysis/scout-cloud/upload.' + ext)) + ';\n').join('');
const bundle = assets + 'const CATALOG = ' + JSON.stringify(JSON.parse(read('analysis/layout-editor/catalog.json'))) + ';\n' +
    'const LayoutCore = (' + factory + ')(' + JSON.stringify(JSON.parse(read('analysis/rpc-contracts/layout-map.json'))) + ',' +
    JSON.stringify(JSON.parse(read('analysis/layout-editor/player-rules.json'))) + ');\n' + read('analysis/scout-cloud/worker.mjs');
const target = path.join(root, 'artifacts/scout-cloud');
fs.mkdirSync(target, {recursive:true});
fs.writeFileSync(path.join(target, 'worker.mjs'), bundle);
fs.copyFileSync(path.join(root, 'analysis/scout-cloud/schema.sql'), path.join(target, '初始化.sql'));
console.log('Built artifacts/scout-cloud/worker.mjs and 初始化.sql (' + Buffer.byteLength(bundle) + ' bytes)');
