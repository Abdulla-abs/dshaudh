#!/usr/bin/env node
/**
 * Generate a player-mode TH8 formation: compact double-box "铁心方盒".
 * Output: .local/layout-player-formation/铁心方盒.json
 */
'use strict';

const fs = require('fs');
const path = require('path');
const C = require('./layout-editor/core.js');
const catalog = require('./layout-editor/catalog.json');

const BASE = 8;
const WALL_LV = 8;
const OUT_DIR = path.join(__dirname, '..', '.local', 'layout-player-formation');
const OUT_FILE = path.join(OUT_DIR, '铁心方盒.json');

const layout = {
  schema: 'dino-pve-layout/v1',
  stage: 901,
  name: '玩家模式·铁心方盒',
  mode: 'player',
  baseLevel: BASE,
  map: { width: 64, height: 64 },
  buildings: [],
  walls: [],
  guards: [],
};

let bid = 0;
let gid = 0;
const occupied = new Set();
const key = (x, y) => `${x},${y}`;

function markCells(cells) {
  for (const c of cells) occupied.add(key(c.x, c.y));
}

function free(cells) {
  return cells.every(c => C.inBounds(c.x, c.y) && !occupied.has(key(c.x, c.y)));
}

function place(family, level, x, y) {
  const entry = catalog.buildings.find(b => b.family === family);
  if (!entry) throw new Error(`unknown family ${family}`);
  const spec = entry.levels.find(l => l.level === level);
  if (!spec) throw new Error(`no level ${entry.name} ${level}`);
  const b = { id: `b${++bid}`, typeid: spec.typeid, level, x, y };
  const cells = C.cells(b, catalog);
  if (!cells.length) throw new Error(`no cells for ${entry.name}`);
  if (!free(cells)) {
    const bad = cells.filter(c => !C.inBounds(c.x, c.y) || occupied.has(key(c.x, c.y)));
    throw new Error(`overlap ${entry.name} @${x},${y} bad=${JSON.stringify(bad)}`);
  }
  markCells(cells);
  layout.buildings.push(b);
  return b;
}

function canPlace(family, level, x, y) {
  const entry = catalog.buildings.find(b => b.family === family);
  const spec = entry?.levels.find(l => l.level === level);
  if (!spec) return false;
  const b = { id: 'tmp', typeid: spec.typeid, level, x, y };
  return free(C.cells(b, catalog));
}

function scanCandidates(family, level, prefer = []) {
  const out = [...prefer];
  for (let x = 14; x <= 48; x++) {
    for (let y = 14; y <= 48; y++) out.push([x, y]);
  }
  return out;
}

function placeN(family, level, n, prefer = []) {
  const placed = [];
  const seen = new Set();
  for (const [x, y] of scanCandidates(family, level, prefer)) {
    if (placed.length >= n) break;
    const k = `${x},${y}`;
    if (seen.has(k)) continue;
    seen.add(k);
    if (!canPlace(family, level, x, y)) continue;
    placed.push(place(family, level, x, y));
  }
  if (placed.length < n) {
    throw new Error(`only placed ${placed.length}/${n} of family ${family} lv${level}`);
  }
  return placed;
}

function addWall(x, y, level = WALL_LV) {
  if (!C.inBounds(x, y)) return false;
  if (occupied.has(key(x, y))) return false;
  if (layout.walls.length >= 200) return false;
  occupied.add(key(x, y));
  layout.walls.push({ x, y, level });
  return true;
}

function wallRect(x0, y0, x1, y1, level = WALL_LV) {
  for (let x = x0; x <= x1; x++) {
    addWall(x, y0, level);
    addWall(x, y1, level);
  }
  for (let y = y0; y <= y1; y++) {
    addWall(x0, y, level);
    addWall(x1, y, level);
  }
}

function wallH(x0, x1, y, level = WALL_LV) {
  for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) addWall(x, y, level);
}

function wallV(x, y0, y1, level = WALL_LV) {
  for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) addWall(x, y, level);
}

function guard(anchorId, typeid, level, skills) {
  layout.guards.push({ id: `g${++gid}`, typeid, level, anchorId, skills });
}

// === Core cluster (manual preferred anchors) ===
const th = place(201, 8, 31, 31);

placeN(205, 6, 3, [[35, 31], [27, 31], [31, 35]]);
placeN(203, 6, 3, [[31, 27], [35, 27], [27, 27]]);

placeN(302, 6, 3, [[35, 35], [27, 35], [23, 31]]);
placeN(308, 7, 4, [[35, 23], [27, 23], [39, 31], [31, 39]]);
placeN(303, 8, 5, [[39, 27], [39, 35], [23, 27], [23, 35], [31, 23]]);
placeN(304, 6, 2, [[27, 39], [35, 39]]);
placeN(305, 6, 3, [[23, 23], [39, 23], [39, 39]]);
placeN(306, 2, 3, [[19, 31], [43, 31], [31, 19]]);
placeN(307, 1, 1, [[31, 43]]);

const cannons = placeN(301, 8, 4, [[19, 23], [43, 23], [19, 39], [43, 39]]);

placeN(206, 7, 1, [[23, 43]]);
placeN(208, 7, 1, [[43, 43]]);
placeN(209, 8, 1, [[19, 27]]);
placeN(210, 4, 1, [[43, 27]]);
placeN(212, 1, 5, [[17, 35], [17, 19], [45, 35], [45, 19], [35, 17]]);
placeN(207, 8, 4, [[23, 19], [39, 19], [15, 31], [47, 31]]);

placeN(202, 4, 6, [
  [19, 19], [27, 15], [35, 15], [43, 19], [15, 27], [47, 27],
]);
placeN(204, 4, 6, [
  [15, 35], [47, 35], [19, 47], [27, 47], [35, 47], [43, 47],
]);

const skull = placeN(506, 1, 2, [[25, 25], [37, 25]]);
const tribe = placeN(507, 1, 2, [[25, 37], [37, 37]]);
placeN(505, 1, 2, [[21, 31], [41, 31]]);

placeN(401, 1, 3, [[24, 24], [36, 24], [30, 20]]);
placeN(402, 1, 3, [[24, 36], [36, 36], [30, 40]]);
placeN(403, 1, 6, [[20, 30], [40, 30], [26, 20], [34, 20], [26, 40], [34, 40]]);

// Walls after buildings so they skip occupied cells
wallRect(16, 16, 46, 46);
wallRect(24, 24, 38, 38);
wallH(16, 24, 30);
wallH(38, 46, 30);
wallV(30, 16, 24);
wallV(30, 38, 46);
wallRect(16, 16, 24, 24);
wallRect(38, 16, 46, 24);
wallRect(16, 38, 24, 46);
wallRect(38, 38, 46, 46);

// Guards
guard(cannons[0].id, 11201, 55, [24007, 24107, 23907]);
guard(cannons[1].id, 11101, 52, [22807, 22907, 23007]);
guard(cannons[2].id, 10701, 50, [17407, 17607, 17507]);
guard(cannons[3].id, 11501, 48, [26707, 26907, 26807]);
guard(skull[0].id, 10501, 45, [14707, 14607, 14507]);
guard(skull[1].id, 10801, 45, [19107, 18907, 19007]);
guard(tribe[0].id, 11001, 42, [21607, 21707, 21807]);
guard(tribe[1].id, 11301, 40, [709110, 709210, 709310]);

const result = C.validate(layout, catalog, false, false);
const counts = {};
for (const b of layout.buildings) {
  const f = Math.floor(b.typeid / 100);
  counts[f] = (counts[f] || 0) + 1;
}
counts[211] = layout.walls.length;

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(layout, null, 2), 'utf8');

const summary = {
  file: OUT_FILE,
  buildings: layout.buildings.length,
  walls: layout.walls.length,
  guards: layout.guards.length,
  counts,
  errors: result.errors,
  warnings: result.warnings || [],
};
console.log(JSON.stringify(summary, null, 2));
if (result.errors.length) process.exitCode = 1;
