/* Offline editor. No network or asynchronous data loading; no loading skeleton needed. */
(function () {
    'use strict';
    const C = window.LayoutCore, catalog = window.LAYOUT_CATALOG;
    const MAP = C.MAP, MAP_CENTER = (MAP.terrainSize - 1) / 2;
    const $ = id => document.getElementById(id), board = $('board');
    const STORAGE = 'dino.layout.editor.v1';
    const familyOf = b => Math.floor(b.typeid / 100);
    const entryOf = b => catalog.buildings.find(t => t.family === familyOf(b));
    const displayName = entry => entry.family === 201 ? '大本营' : entry.name;
    const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const colors = {资源:'resource',防御:'defense',建筑:'building',旗子:'flag',陷阱:'defense',植物:'building',石头:'resource',生物:'flag'};
    const symbols = {201:'⌂',205:'◈',203:'◉',204:'◆',202:'☀',301:'◍',303:'♜',302:'◇',401:'⋈',402:'▦',403:'✹'};
    let layout = C.empty(), selected = null, tool = 'select', placing = null, hover = null;
    let undo = [], redo = [], gesture = null, space = false, toastTimer, dragFamily = null;
    let view = {zoom:.8,panX:0,panY:0}, dimensions = {width:800,height:600};
    let reference = {src:window.LAYOUT_REFERENCE || '',opacity:.35,scale:1,x:0,y:0};
    let restoration = '', wallBrushLevel = 1, wallShape = 'free';
    $('wallBrushLevel').innerHTML=Array.from({length:10},(_,i)=>`<option value="${i+1}">${i+1} 级</option>`).join('');
    try {
        const saved = localStorage.getItem(STORAGE);
        if (saved) {layout = C.normalize(JSON.parse(saved),catalog); restoration='已恢复上次编辑的布局';}
    } catch (e) {restoration='旧草稿未能读取，已保留原存储。可导入备份文件。';}
    function toast(message) {
        $('toast').textContent = message; $('toast').classList.add('visible');
        clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').classList.remove('visible'),3500);
    }
    function save() {
        try {localStorage.setItem(STORAGE,JSON.stringify(layout));$('saveState').textContent='已保存到本机';}
        catch (e) {$('saveState').textContent='请导出文件备份';toast('浏览器无法自动保存，请导出布局文件备份。');}
    }
    function snapshot() {return JSON.stringify(layout);}
    function finishChange(before, message) {
        if (before !== snapshot()) {undo.push(before);if(undo.length>80)undo.shift();redo=[];save();}
        render();if(message)toast(message);
    }
    function change(fn,message) {
        const before = snapshot(), draft = C.clone(layout);
        fn(draft);
        const report = C.validate(draft,catalog,true,true);
        if (report.errors.length) {toast(report.errors[0]);render();return false;}
        const worse=C.worsensPlayerLimits(layout,draft);
        if(worse){toast(worse.message);render();return false;}
        layout = draft;finishChange(before,message);return true;
    }
    function freshId(prefix,draft=layout) {
        const used = new Set([...draft.buildings,...draft.guards].map(b=>b.id));
        let i=1;while(used.has(prefix+i))i++;return prefix+i;
    }
    function history(direction) {
        const from = direction==='undo'?undo:redo, to = direction==='undo'?redo:undo;
        if (!from.length) return;
        to.push(snapshot());layout=JSON.parse(from.pop());selected=null;hover=null;save();render();
    }
    function setTool(next) {
        tool=next; if(next!=='place')placing=null;if(next==='wall')selected=null;hover=null;render();
    }
    function canPlace(entry) {
        if(layout.mode!=='player')return true;
        const limit=C.playerLimit(layout,entry.family);
        return limit.maxLevel>0&&layout.buildings.filter(b=>familyOf(b)===entry.family).length<limit.count;
    }
    function choose(entry) {if(!canPlace(entry)){toast('该建筑尚未解锁或数量已达上限。');return;}placing=entry.family;tool='place';selected=null;render();}
    function screenToWorld(clientX,clientY) {
        const rect=board.getBoundingClientRect(),center=C.project(MAP_CENTER,MAP_CENTER);
        return {x:(clientX-rect.left-dimensions.width/2-view.panX)/view.zoom+center.x,
            y:(clientY-rect.top-dimensions.height/2-view.panY)/view.zoom+center.y};
    }
    function eventCell(e) {
        const world=screenToWorld(e.clientX,e.clientY),cell=C.unproject(world.x,world.y);
        return {x:Math.round(cell.x),y:Math.round(cell.y)};
    }
    function inBounds(c) {return C.inBounds(c.x,c.y);}
    function getBuilding(id) {return layout.buildings.find(b=>b.id===id);}
    function wallAt(cell) {return layout.walls.find(w=>w.x===cell.x&&w.y===cell.y);}
    function buildingAt(cell) {return layout.buildings.find(b=>C.cells(b,catalog).some(c=>c.x===cell.x&&c.y===cell.y));}
    function occupied(cell,ignoreId) {
        return wallAt(cell)||layout.buildings.some(b=>b.id!==ignoreId&&C.cells(b,catalog).some(c=>c.x===cell.x&&c.y===cell.y));
    }
    function putBuilding(family,cell) {
        const entry=catalog.buildings.find(b=>b.family===family);if(!entry||!inBounds(cell))return;
        if(!canPlace(entry)){toast('该建筑尚未解锁或数量已达上限。');return;}
        const spec=entry.levels.find(s=>s.level===(layout.mode==='player'&&family===201?layout.baseLevel:1)),id=freshId('b');
        if(change(d=>d.buildings.push({id,typeid:spec.typeid,level:spec.level,x:cell.x,y:cell.y}),
            `已放置${displayName(entry)}。可继续放置，按 V 切换到选择。`))selected={kind:'building',id};
        render();
    }
    function deleteSelected() {
        if(!selected)return;
        const target=selected;
        change(d=>{
            if(target.kind==='building') {d.buildings=d.buildings.filter(b=>b.id!==target.id);d.guards=d.guards.filter(g=>g.anchorId!==target.id);}
            else d.walls=d.walls.filter(w=>`${w.x}:${w.y}`!==target.id);
        },'已删除，可撤销恢复。');selected=null;render();
    }
    function duplicate() {
        if(!selected||selected.kind!=='building')return;
        const b=getBuilding(selected.id);if(!b)return;
        if(!canPlace(entryOf(b))){toast('该建筑数量已达上限，无法复制。');return;}
        const offsets=[];
        for(let r=1;r<16;r++)for(let dx=-r;dx<=r;dx++)for(let dy=-r;dy<=r;dy++)
            if(Math.max(Math.abs(dx),Math.abs(dy))===r)offsets.push({dx,dy});
        for(const o of offsets){
            const next={...b,id:freshId('b'),x:b.x+o.dx,y:b.y+o.dy};
            const trial=C.clone(layout);trial.buildings.push(next);
            if(!C.validate(trial,catalog,true).errors.length){
                change(d=>d.buildings.push(next),'已复制建筑。守军请在新建筑上另行添加。');selected={kind:'building',id:next.id};render();return;
            }
        }
        toast('附近没有足够空位，请先腾出位置。');
    }
    function moveSelected(dx,dy) {
        if(!selected)return;
        change(d=>{
            const obj=selected.kind==='building'?d.buildings.find(b=>b.id===selected.id):d.walls.find(w=>`${w.x}:${w.y}`===selected.id);
            if(obj){obj.x+=dx;obj.y+=dy;if(selected.kind==='wall')selected.id=`${obj.x}:${obj.y}`;}
        });
    }
    function renderPalette() {
        const query=$('search').value.trim(), groups=['建筑','资源','防御','陷阱','旗子','植物','石头','生物'];
        $('palette').innerHTML=groups.map(group=>{
            const list=catalog.buildings.filter(e=>e.group===group&&(displayName(e)+e.name).includes(query));
            if(!list.length)return '';
            return `<section class="palette-group"><h3>${group}</h3><div class="asset-list">${list.map(e=>{
                const s=e.levels[0],limit=C.playerLimit(layout,e.family),count=layout.buildings.filter(b=>familyOf(b)===e.family).length,enabled=canPlace(e);
                const detail=layout.mode==='player'?`${count}/${limit.count} · 最高 ${limit.maxLevel} 级`:`${s.width}×${s.height}`;
                return `<button class="asset ${placing===e.family?'active':''}" ${enabled?'':'disabled'} draggable="${enabled}" data-family="${e.family}" aria-pressed="${placing===e.family}" title="${esc(e.name)}，占地 ${s.width} × ${s.height}${layout.mode==='player'?'，'+detail:''}"><span class="asset-icon" style="--asset-color:var(--${colors[group]})">${symbols[e.family]||(group==='旗子'?'⚑':'▱')}</span><span class="asset-name">${esc(displayName(e))}</span><span class="asset-size">${detail}</span></button>`;
            }).join('')}</div></section>`;
        }).join('')||'<p class="small-note">没有找到这个建筑。</p>';
    }
    const pointString=points=>points.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    function polygon(b,w,h) {
        return [C.project(b.x-w+.5,b.y-h+.5),C.project(b.x+.5,b.y-h+.5),
            C.project(b.x+.5,b.y+.5),C.project(b.x-w+.5,b.y+.5)];
    }
    function drawBuilding(b,ghost=false) {
        const entry=entryOf(b),s=C.specFor(b,catalog);if(!entry||!s)return '';
        const p=polygon(b,s.width,s.height),center=C.project(b.x-(s.width-1)/2,b.y-(s.height-1)/2);
        if(ghost)return `<polygon class="ghost-shape" points="${pointString(p)}"/>`;
        const isFlag=entry.group==='旗子',height=isFlag?7:entry.family===201?23:14;
        const top=p.map(v=>({x:v.x,y:v.y-height})),color=colors[entry.group];
        const active=selected&&selected.kind==='building'&&selected.id===b.id;
        const dimmed=gesture&&gesture.kind==='move'&&gesture.id===b.id;
        let out=`<g data-bid="${esc(b.id)}" opacity="${dimmed?.45:1}"><polygon class="building-shape" fill="var(--${color}-side)" points="${pointString([top[1],top[2],top[3],p[3],p[2],p[1]])}"/><polygon class="building-shape" fill="var(--${color})" points="${pointString(top)}"/>`;
        if(active)out+=`<polygon class="selected-outline" points="${pointString(p)}"/>`;
        const font=Math.max(12,10/view.zoom);
        if(view.zoom>.42||active)out+=`<text class="map-label" text-anchor="middle" x="${center.x}" y="${center.y-height+4}" style="font-size:${font}px">${esc(isFlag?'⚑ '+displayName(entry):displayName(entry))}</text><text class="map-label" text-anchor="middle" x="${center.x}" y="${p[2].y-3}" style="font-size:${font-2}px;font-weight:400">Lv.${b.level}</text>`;
        const guards=layout.guards.filter(g=>g.anchorId===b.id);
        if(guards.length){const gx=center.x+s.width*10,gy=center.y-height-22;
            out+=`<circle class="guard-mark" cx="${gx}" cy="${gy}" r="15"/><text class="guard-label" x="${gx}" y="${gy+3}">${guards.length}守</text>`;
            if(view.zoom>.6)out+=`<text class="map-label" x="${gx+19}" y="${gy+4}" style="font-size:11px">${esc(catalog.guards.find(h=>h.typeid===guards[0].typeid).name)} Lv.${guards[0].level}</text>`;
        }
        return out+'</g>';
    }
    function drawWall(w) {
        const p=polygon(w,1,1),top=p.map(v=>({x:v.x,y:v.y-10})),active=selected&&selected.kind==='wall'&&selected.id===`${w.x}:${w.y}`;
        return `<g data-wall="${w.x}:${w.y}"><polygon class="building-shape" fill="var(--wall-side)" points="${pointString([top[1],top[2],top[3],p[3],p[2],p[1]])}"/><polygon class="building-shape" fill="var(--wall)" points="${pointString(top)}"/>${active?`<polygon class="selected-outline" points="${pointString(p)}"/>`:''}</g>`;
    }
    function renderBoard() {
        const center=C.project(MAP_CENTER,MAP_CENTER),tx=dimensions.width/2+view.panX-center.x*view.zoom,ty=dimensions.height/2+view.panY-center.y*view.zoom;
        let grid='',major='';
        for(let i=0;i<=MAP.terrainSize;i++){
            const a=C.project(i-.5,-.5),b=C.project(i-.5,MAP.terrainSize-.5),c=C.project(-.5,i-.5),d=C.project(MAP.terrainSize-.5,i-.5);
            const part=`M${a.x} ${a.y}L${b.x} ${b.y}M${c.x} ${c.y}L${d.x} ${d.y}`;
            if(i%8===0)major+=part;else grid+=part;
        }
        let out=`<g transform="translate(${tx} ${ty}) scale(${view.zoom})">`;
        const area=(min,max)=>pointString([{x:min-.5,y:min-.5},{x:max+.5,y:min-.5},
            {x:max+.5,y:max+.5},{x:min-.5,y:max+.5}].map(p=>C.project(p.x,p.y)));
        out+=`<polygon points="${area(0,MAP.terrainSize-1)}" fill="var(--surface-2)" pointer-events="none"/>
            <polygon data-playable-region points="${area(MAP.playableMin,MAP.playableMax)}" fill="var(--map)" stroke="var(--success)" stroke-width="2" vector-effect="non-scaling-stroke" pointer-events="none"/>`;

        if($('overlay').checked&&reference.src){
            const w=760*reference.scale,h=w*reference.aspect;
            out+=`<image href="${esc(reference.src)}" x="${center.x-w/2+reference.x}" y="${center.y-h/2+reference.y}" width="${w}" height="${h}" opacity="${reference.opacity}" pointer-events="none"/>`;
        }
        out+=`<path d="${grid}" fill="none" stroke="var(--grid)" stroke-opacity=".3" stroke-width=".7" vector-effect="non-scaling-stroke"/><path d="${major}" fill="none" stroke="var(--grid)" stroke-opacity=".55" stroke-width="1" vector-effect="non-scaling-stroke"/>`;
        const objects=[...layout.buildings.map(b=>({order:b.x+b.y,draw:()=>drawBuilding(b)})),...layout.walls.map(w=>({order:w.x+w.y,draw:()=>drawWall(w)}))];
        objects.sort((a,b)=>a.order-b.order);for(const object of objects)out+=object.draw();
        if(gesture&&gesture.kind==='move'){
            const b=getBuilding(gesture.id);if(b)out+=drawBuilding({...b,...gesture.target},true);
        } else if(hover&&inBounds(hover)&&tool==='place'&&placing){
            const entry=catalog.buildings.find(b=>b.family===placing),spec=entry.levels[0];
            out+=drawBuilding({typeid:spec.typeid,level:spec.level,...hover},true);
        } else if(hover&&inBounds(hover)&&(tool==='wall'||tool==='erase')){
            out+=`<polygon class="ghost-shape" points="${pointString(polygon(hover,1,1))}"/>`;
        }
        board.innerHTML=out+'</g>';board.dataset.mode=tool;
        $('zoomLabel').textContent=Math.round(view.zoom*100)+'%';
    }
    function renderSkillInfo(skill,level) {
        const info=skill.details[level];
        if(!info)return '<p class="small-note">当前等级暂无技能说明。</p>';
        return `<section class="skill-info" aria-label="${esc(info.name)} ${level} 级技能信息" aria-live="polite">
            <div class="skill-info-heading"><strong>${esc(info.name)}</strong><span>${level} 级${level===Math.max(...skill.levels)?' · 已满级':''}</span></div>
            <p class="skill-description">${esc(info.description)}</p>
            ${info.attributes.length?`<dl class="skill-attributes">${info.attributes.map(a=>`<div><dt>${esc(a.name)}</dt><dd>${esc(a.value)}</dd></div>`).join('')}</dl>`:''}
            ${info.targets.length?`<p class="skill-targets"><strong>有效目标：</strong>${esc(info.targets.join('、'))}${info.friendlyFire?'；会影响友军':''}</p>`:''}
            ${info.excludedTargets.length?`<p class="skill-targets"><strong>无效目标：</strong>${esc(info.excludedTargets.join('、'))}</p>`:''}
        </section>`;
    }
    const runeLayers={base_attr:'基础属性',two_attr:'二转属性',three_attr:'三转属性'},openRuneDetails=new Set();
    function renderRunes(g) {
        const runes=g.runes||Array(5).fill(null),combo=C.runeCombination(g,catalog);
        const options=(rows,value)=>rows.map(r=>`<option value="${r.value}" ${r.value===value?'selected':''}>${esc(r.label)}</option>`).join('');
        return `<section class="guard-runes"><h4>嵌入符文</h4><p class="small-note">5 个槽位独立选择类型与等级。组合技能从槽 1 连续匹配，空槽会中断组合。</p>
            ${runes.map((r,slot)=>{
                const data=`data-rune-guard="${esc(g.id)}" data-rune-slot="${slot}"`;
                const item=r&&catalog.runes.items.find(i=>i.typeid===r.typeid);
                return `<div class="rune-slot"><label class="property-field">槽位 ${slot+1}<select ${data} data-rune-field="typeid">${options([{value:0,label:'不嵌入'},...catalog.runes.items.filter(i=>i.slot===slot).map(i=>({value:i.typeid,label:i.name}))],r?.typeid||0)}</select></label>
                    ${r?`<p class="small-note">${esc(item.description)}</p><details data-rune-details="${esc(g.id)}:${slot}" ${openRuneDetails.has(`${g.id}:${slot}`)?'open':''}><summary>属性设置 · ${Object.keys(runeLayers).reduce((n,k)=>n+(r[k]||[]).length,0)} 条</summary>
                    <p class="small-note">属性按原表数值手动配置，不随机生成；未添加的属性不提供加成。转生及专属属性由原版按英雄条件生效。</p>
                    ${Object.entries(runeLayers).map(([layer,label])=>{
                        const attrs=r[layer]||[],available=catalog.runes.attributes.filter(a=>a.layers.includes(layer));
                        return `<div class="rune-layer"><strong>${label}</strong>${attrs.map((id,index)=>{
                            const attr=catalog.runes.attributes.find(a=>a.id===id),used=attrs.map(v=>catalog.runes.attributes.find(a=>a.id===v).stat);
                            const stats=[...new Set(available.filter(a=>a.stat===attr.stat||!used.includes(a.stat)).map(a=>a.stat))];
                            const attrData=`${data} data-rune-layer="${layer}" data-rune-index="${index}"`;
                            return `<div class="rune-attribute"><label>属性<select ${attrData} data-rune-field="stat">${options(stats.map(stat=>({value:stat,label:available.find(a=>a.stat===stat).name})),attr.stat)}</select></label><label>数值<select ${attrData} data-rune-field="attribute">${options(available.filter(a=>a.stat===attr.stat).map(a=>({value:a.id,label:`+${a.value}${a.unit}`})),id)}</select></label><button class="text-button danger" ${attrData} data-rune-action="remove" aria-label="移除${label} ${index+1}">移除</button></div>`;
                        }).join('')}<button class="text-button" ${data} data-rune-layer="${layer}" data-rune-action="add" ${attrs.length>=[...new Set(available.map(a=>a.stat))].length?'disabled':''}>＋ 添加${label}</button></div>`;
                    }).join('')}
                    <label class="property-field">专属英雄<select ${data} data-rune-field="hero_attr">${options([{value:0,label:'无专属属性'},...catalog.runes.exclusive.map(e=>({value:e.hero,label:catalog.guards.find(h=>Math.floor(h.typeid/100)===e.hero)?.name||`英雄 ${e.hero}`}))],r.hero_attr||0)}</select></label>
                    </details>`:''}</div>`;
            }).join('')}<div class="rune-combination" aria-live="polite">${combo?`<strong>组合技能：${esc(combo.name)} · ${combo.level} 级</strong><p class="small-note">${esc(combo.description)}</p>`:'<p class="small-note">当前未激活组合技能。</p>'}</div></section>`;
    }
    function renderGuard(g,index) {
        const hero=catalog.guards.find(h=>h.typeid===g.typeid),evolution=g.evolution??0,reborn=g.reborn??0;
        const mutation=catalog.mutations.find(m=>m.id===(g.mutateId??0)),skills=g.skills||[];
        const variant=C.guardVariant(g,catalog),mutations=catalog.mutations.filter(m=>variant.basics[m.id]?.length);
        const select=(field,label,options,value)=>`<label class="property-field">${label}<select data-guard="${esc(g.id)}" data-field="${field}">${options.map(o=>`<option value="${o.value}" ${o.value===value?'selected':''}>${esc(o.label)}</option>`).join('')}</select></label>`;
        const forms=[...new Set(hero.variants.map(v=>v.evolution))];
        return `<div class="guard-row"><div class="guard-head"><strong>守军 ${index+1} · ${esc(hero.name)}</strong><button class="text-button danger" data-remove-guard="${esc(g.id)}" aria-label="移除守军 ${index+1}">移除</button></div>
            ${select('typeid','英雄种类',catalog.guards.map(h=>({value:h.typeid,label:h.name})),g.typeid)}
            <label class="property-field">英雄等级<input type="number" min="1" max="100" value="${g.level}" data-guard="${esc(g.id)}" data-field="level"></label>
            <div class="guard-grid">${select('evolution','转生等级',forms.map(n=>({value:n,label:n===0?'未转生（第一形态）':`${n} 转（第${n+1}形态）`})),evolution)}
            ${select('reborn','晋升等级',hero.variants.filter(v=>v.evolution===evolution).map(v=>({value:v.reborn,label:v.reborn===0?'未晋升':`${v.reborn} 级`})),reborn)}</div>
            <p class="small-note">转生改变形态，晋升强化当前形态；英雄等级独立设置。</p>
            <div class="guard-grid">${select('mutateType','变异属性',[{value:0,label:'无变异'},...['水','火','风','雷','土'].map((name,i)=>({value:i+1,label:name+'系'})).filter(o=>mutations.some(m=>m.type===o.value))],mutation.type)}
            ${select('mutateLevel','变异等级',mutation.type?mutations.filter(m=>m.type===mutation.type).map(m=>({value:m.level,label:`${m.level} 级`})):[{value:0,label:'未变异'}],mutation.level)}</div>
            ${mutations.length===1?'<p class="small-note">原版未提供该英雄的变异配置。</p>':''}
            <div class="guard-head guard-skill-title"><strong>培养技能 ${skills.length}/3</strong><button class="text-button" data-max-skills="${esc(g.id)}" ${skills.length?'':'disabled'}>技能升满</button></div>
            <p class="small-note">普通攻击自动保留。技能配置固定，不随机抽取。</p>
            ${skills.map((id,i)=>{
                const sid=Math.floor(id/100),skill=hero.skills.find(s=>s.id===sid);
                return `<div class="guard-skill"><label class="property-field">技能 ${i+1}<select data-guard="${esc(g.id)}" data-field="skill" data-slot="${i}">${hero.skills.filter(s=>s.id===sid||!skills.some(other=>Math.floor(other/100)===s.id)).map(s=>`<option value="${s.id}" ${s.id===sid?'selected':''}>${esc(s.name)} · ${s.kind}</option>`).join('')}</select></label><div class="guard-head"><label class="guard-skill-level">技能等级<select data-guard="${esc(g.id)}" data-field="skillLevel" data-slot="${i}">${skill.levels.map(n=>`<option value="${n}" ${n===id%100?'selected':''}>${n} 级</option>`).join('')}</select></label><button class="text-button danger" data-remove-skill="${esc(g.id)}" data-slot="${i}" aria-label="移除技能 ${i+1}">移除技能</button></div>${renderSkillInfo(skill,id%100)}</div>`;
            }).join('')}
            <button class="full" data-add-skill="${esc(g.id)}" ${skills.length>=3||skills.length>=hero.skills.length?'disabled':''}>＋ 添加技能</button>
            ${renderRunes(g)}
            </div>`;
    }
    function renderInspector() {
        if(tool==='wall') {
            $('selectionBadge').textContent='城墙工具';
            const descriptions={free:'按住鼠标连续画墙。',line:'从起点拖到终点，松开鼠标画出直线。',rectangle:'从一个角拖到对角，松开鼠标生成矩形围墙。'};
            $('inspector').innerHTML=`<div class="property-title"><strong>城墙 ${wallBrushLevel} 级</strong><span class="subtle">1 × 1 格</span></div><p class="wall-instructions">${descriptions[wallShape]}</p><p class="small-note">左侧可选择等级和绘制方式。建筑占用的格子会跳过。撤销可一次恢复整笔绘制。</p><p class="small-note">要修改单段城墙，切换“选择”后点击它；删除使用“擦除”。</p>`;
            return;
        }
        const b=selected&&selected.kind==='building'?getBuilding(selected.id):null;
        const wall=selected&&selected.kind==='wall'?layout.walls.find(w=>`${w.x}:${w.y}`===selected.id):null;
        if(!b&&!wall){$('selectionBadge').textContent='未选择';$('inspector').innerHTML='<div class="empty-selection">选中一座建筑，可修改位置和等级。<br>选中旗子或龙弹堡，可添加防守英雄。</div><label class="property-field">画墙等级<select id="wallLevel">'+(layout.mode==='player'?C.playerLimit(layout,211).levels:Array.from({length:10},(_,i)=>i+1)).map(l=>`<option value="${l}">${l} 级</option>`).join('')+'</select></label>';$('wallLevel').value=wallBrushLevel;return;}
        const entry=b?entryOf(b):null,s=b?C.specFor(b,catalog):{width:1,height:1},obj=b||wall;
        $('selectionBadge').textContent=b?b.id:'围墙';
        const allLevels=b?entry.levels.map(l=>l.level):Array.from({length:10},(_,i)=>i+1);
        const limit=C.playerLimit(layout,b?entry.family:211);
        const levels=layout.mode==='player'?allLevels.filter(l=>(b&&entry.family===201?l===layout.baseLevel:limit.levels.includes(l))||l===obj.level):allLevels;
        let html=`<div class="property-title"><strong>${b?esc(displayName(entry)):'龙墙'}</strong><span class="subtle">${s.width} × ${s.height} 格</span></div><label class="property-field">建筑等级<select data-property="level">${levels.map(l=>`<option value="${l}" ${l===obj.level?'selected':''}>${l} 级</option>`).join('')}</select></label><div class="property-row"><label>X 坐标<input data-property="x" type="number" min="${MAP.playableMin+s.width-1}" max="${MAP.playableMax}" value="${obj.x}"></label><label>Y 坐标<input data-property="y" type="number" min="${MAP.playableMin+s.height-1}" max="${MAP.playableMax}" value="${obj.y}"></label></div><p class="small-note">方向键移动一格，Shift＋方向键移动五格。坐标对应占地底端的格子。</p><div class="property-actions">${b?'<button id="duplicateButton">复制建筑</button>':''}<button id="deleteButton" class="danger">删除${b?'建筑':'围墙'}</button></div>`;
        if(b&&[505,506,507,301].includes(entry.family)){
            const guards=layout.guards.filter(g=>g.anchorId===b.id);
            html+=`<div class="guard-section"><h3>防守英雄</h3><p class="small-note">英雄绑定当前建筑，培养设置会随布局保存和导出。</p>${guards.map(renderGuard).join('')}<button id="addGuard" class="full" ${layout.guards.length>=128?'disabled':''}>＋ 添加防守英雄</button></div>`;
        }
        $('inspector').innerHTML=html;
    }
    function render() {
        $('stage').value=layout.stage;$('name').value=layout.name;
        $('editorMode').value=layout.mode||'free';$('playerBaseLevel').value=layout.baseLevel;
        document.body.classList.toggle('mode-player',layout.mode==='player');
        $('playerSnapshot').textContent=`实例 1 主城：${C.playerRules.snapshot.baseLevel} 级大本营（${C.playerRules.snapshot.date} 只读核查）。可选择其他等级编写布局，不会改动游戏存档。`;
        $('playerSettings').hidden=layout.mode!=='player';
        $('modeDescription').textContent=layout.mode==='player'?'按原版大本营规则限制数量和等级。超限旧布局保留，可删除或降级修正。':'数量和等级不受大本营限制，使用原版已有等级自由布局。';
        const wallLimit=C.playerLimit(layout,211),wallLevels=layout.mode==='player'?wallLimit.levels:Array.from({length:10},(_,i)=>i+1);
        if(!wallLevels.includes(wallBrushLevel))wallBrushLevel=wallLevels[0]||1;
        $('wallBrushLevel').innerHTML=wallLevels.map(l=>`<option value="${l}">${l} 级</option>`).join('');
        $('wallQuota').textContent=layout.mode==='player'?`${layout.walls.length}/${wallLimit.count} 段 · 最高 ${wallLimit.maxLevel} 级`:'1 × 1 格';
        $('undo').disabled=!undo.length;$('redo').disabled=!redo.length;
        $('wallBrushLevel').value=wallBrushLevel;$('wallShape').value=wallShape;
        $('applyWallLevel').disabled=!layout.walls.length;
        document.querySelectorAll('[data-tool]').forEach(b=>{const active=b.dataset.tool===tool;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});
        $('moveReference').classList.toggle('active',tool==='reference');
        $('counts').textContent=`${layout.buildings.length} 座建筑 · ${layout.walls.length} 段围墙 · ${layout.guards.length} 名守军`;
        $('emptyHint').hidden=layout.buildings.length>0||layout.walls.length>0||tool==='place'||tool==='wall'||$('overlay').checked;
        const messages={select:'选择建筑或拖动已有建筑',place:placing?`放置${displayName(catalog.buildings.find(b=>b.family===placing))}，按 V 返回选择`:'',wall:'按住拖动画墙，占用格子会跳过',erase:'按住拖动擦除，删除建筑时也会移除绑定守军',pan:'按住拖动画布',reference:'拖动调整参考图位置，建筑位置不变'};
        $('modeHint').textContent=messages[tool]+` · 可建造 X/Y ${MAP.playableMin}～${MAP.playableMax}`;
        const report=C.validate(layout,catalog);
        $('exportButton').disabled=report.errors.length>0;
        $('validationBadge').textContent=report.errors.length?'待完善':'可导出';
        $('validationBadge').style.color=report.errors.length?'var(--muted)':'var(--success)';
        $('validation').innerHTML=report.errors.map(e=>`<p class="error">${esc(e)}</p>`).join('')+
            (report.errors.length?'':'<p class="good">✓ 无重叠或越界，守军绑定有效。</p>')+
            report.warnings.map(w=>`<p class="warning">${esc(w)}</p>`).join('');
        renderPalette();renderInspector();renderBoard();
    }
    function paint(cell,erase=false) {
        if(!inBounds(cell))return;
        if(erase){
            const b=buildingAt(cell);
            if(b){layout.buildings=layout.buildings.filter(o=>o.id!==b.id);layout.guards=layout.guards.filter(g=>g.anchorId!==b.id);if(selected&&selected.id===b.id)selected=null;}
            layout.walls=layout.walls.filter(w=>w.x!==cell.x||w.y!==cell.y);
        }else {
            if(layout.mode==='player'){
                const limit=C.playerLimit(layout,211);
                if(!limit.levels.includes(wallBrushLevel)||(!wallAt(cell)&&layout.walls.length>=limit.count)){
                    toast(`城墙最多 ${limit.count} 段，最高 ${limit.maxLevel} 级。`);return;
                }
            }
            const existing=wallAt(cell);
            if(existing)existing.level=wallBrushLevel;
            else if(!occupied(cell))layout.walls.push({x:cell.x,y:cell.y,level:wallBrushLevel});
        }
    }
    board.addEventListener('pointerdown',e=>{
        if(e.button!==0&&e.button!==1&&e.button!==2)return;
        board.focus({preventScroll:true});const cell=eventCell(e);hover=cell;
        if(space||tool==='pan'||e.button===1||e.button===2){gesture={kind:'pan',x:e.clientX,y:e.clientY,panX:view.panX,panY:view.panY};}
        else if(tool==='reference'){gesture={kind:'reference',x:e.clientX,y:e.clientY,refX:reference.x,refY:reference.y};}
        else if(tool==='place'){putBuilding(placing,cell);return;}
        else if(tool==='wall'||tool==='erase'){gesture={kind:'paint',before:snapshot(),start:cell,last:cell,erase:tool==='erase',shape:wallShape};paint(cell,gesture.erase);renderBoard();}
        else {
            const target=e.target.closest('[data-bid],[data-wall]');
            if(target&&target.dataset.bid){const b=getBuilding(target.dataset.bid);selected={kind:'building',id:b.id};gesture={kind:'move',id:b.id,start:cell,target:{x:b.x,y:b.y},original:{x:b.x,y:b.y}};}
            else if(target&&target.dataset.wall)selected={kind:'wall',id:target.dataset.wall};
            else {const b=buildingAt(cell),w=wallAt(cell);selected=b?{kind:'building',id:b.id}:w?{kind:'wall',id:`${w.x}:${w.y}`}:null;}
            render();
        }
        if(gesture){board.setPointerCapture(e.pointerId);board.classList.add('dragging');e.preventDefault();}
    });
    board.addEventListener('pointermove',e=>{
        hover=eventCell(e);$('coords').textContent=inBounds(hover)?`格子 ${hover.x}, ${hover.y}`:'地图外';
        if(gesture){
            if(gesture.kind==='pan'){view.panX=gesture.panX+e.clientX-gesture.x;view.panY=gesture.panY+e.clientY-gesture.y;}
            else if(gesture.kind==='reference'){reference.x=gesture.refX+(e.clientX-gesture.x)/view.zoom;reference.y=gesture.refY+(e.clientY-gesture.y)/view.zoom;}
            else if(gesture.kind==='move')gesture.target={x:gesture.original.x+hover.x-gesture.start.x,y:gesture.original.y+hover.y-gesture.start.y};
            else if(gesture.kind==='paint'){
                if(!gesture.erase&&gesture.shape!=='free'){
                    layout=JSON.parse(gesture.before);
                    const end={x:Math.max(MAP.playableMin,Math.min(MAP.playableMax,hover.x)),y:Math.max(MAP.playableMin,Math.min(MAP.playableMax,hover.y))};
                    for(const cell of C.wallStroke(gesture.start,end,gesture.shape))paint(cell);
                }else for(const cell of C.line(gesture.last,hover))paint(cell,gesture.erase);
                gesture.last=hover;
            }
        }
        renderBoard();
    });
    function endGesture(e,cancel=false) {
        const g=gesture;if(!g)return;gesture=null;board.classList.remove('dragging');
        if(board.hasPointerCapture(e.pointerId))board.releasePointerCapture(e.pointerId);
        if(g.kind==='move'&&!cancel)change(d=>{const b=d.buildings.find(b=>b.id===g.id);if(b)Object.assign(b,g.target);});
        else if(g.kind==='paint'){
            if(cancel)layout=JSON.parse(g.before);else finishChange(g.before);
        }
        render();
    }
    board.addEventListener('pointerup',e=>endGesture(e));board.addEventListener('pointercancel',e=>endGesture(e,true));
    board.addEventListener('contextmenu',e=>e.preventDefault());
    board.addEventListener('pointerleave',()=>{if(!gesture){hover=null;renderBoard();}});
    function zoom(factor,clientX,clientY) {
        const rect=board.getBoundingClientRect(),sx=clientX??rect.left+dimensions.width/2,sy=clientY??rect.top+dimensions.height/2;
        const before=screenToWorld(sx,sy),next=Math.max(.25,Math.min(2.5,view.zoom*factor));
        const center=C.project(MAP_CENTER,MAP_CENTER);view.zoom=next;
        view.panX=sx-rect.left-dimensions.width/2-(before.x-center.x)*next;
        view.panY=sy-rect.top-dimensions.height/2-(before.y-center.y)*next;renderBoard();
    }
    board.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY<0?1.1:1/1.1,e.clientX,e.clientY);},{passive:false});
    function fit() {
        const points=[];for(const b of layout.buildings){const s=C.specFor(b,catalog);points.push(...polygon(b,s.width,s.height));}
        for(const w of layout.walls)points.push(C.project(w.x,w.y));
        if(!points.length){view={zoom:.8,panX:0,panY:0};renderBoard();return;}
        const xs=points.map(p=>p.x),ys=points.map(p=>p.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
        view.zoom=Math.max(.25,Math.min(1.5,(dimensions.width-140)/(maxX-minX+100),(dimensions.height-150)/(maxY-minY+100)));
        const center=C.project(MAP_CENTER,MAP_CENTER);view.panX=-(minX+maxX-2*center.x)/2*view.zoom;view.panY=-(minY+maxY-2*center.y)/2*view.zoom;
        renderBoard();
    }
    $('palette').addEventListener('click',e=>{const b=e.target.closest('[data-family]');if(b)choose(catalog.buildings.find(x=>x.family===Number(b.dataset.family)));});
    $('palette').addEventListener('dragstart',e=>{const b=e.target.closest('[data-family]');if(!b)return;dragFamily=Number(b.dataset.family);e.dataTransfer.setData('text/plain',String(dragFamily));e.dataTransfer.effectAllowed='copy';});
    $('palette').addEventListener('dragend',()=>{dragFamily=null;});
    board.addEventListener('dragover',e=>{e.preventDefault();if(dragFamily){placing=dragFamily;tool='place';hover=eventCell(e);renderBoard();}});
    board.addEventListener('drop',e=>{e.preventDefault();const family=Number(e.dataTransfer.getData('text/plain'));if(catalog.buildings.some(b=>b.family===family)){putBuilding(family,eventCell(e));setTool('select');}dragFamily=null;});
    document.querySelectorAll('[data-tool]').forEach(b=>b.addEventListener('click',()=>setTool(b.dataset.tool)));
    $('wallBrushLevel').onchange=e=>{wallBrushLevel=Number(e.target.value);render();};
    function setPlayerSettings(mode,baseLevel) {
        const before=snapshot();layout.mode=mode;layout.baseLevel=baseLevel;
        if(mode==='player')for(const b of layout.buildings.filter(b=>familyOf(b)===201)){
            b.level=baseLevel;b.typeid=20100+baseLevel;
        }
        placing=null;selected=null;tool='select';
        finishChange(before,C.playerViolations(layout).length?'已切换。现有超限对象已保留，请按布局检查逐项修正。':'已更新编辑模式，可撤销恢复。');
    }
    $('editorMode').onchange=e=>{
        const base=layout.buildings.find(b=>familyOf(b)===201);
        setPlayerSettings(e.target.value,base?.level||layout.baseLevel||C.playerRules.snapshot.baseLevel);
    };
    $('playerBaseLevel').onchange=e=>setPlayerSettings(layout.mode,Number(e.target.value));
    $('wallShape').onchange=e=>{wallShape=e.target.value;setTool('wall');};
    $('applyWallLevel').onclick=()=>change(d=>{for(const w of d.walls)w.level=wallBrushLevel;},`已将全部城墙设为 ${wallBrushLevel} 级，可撤销恢复。`);
    $('search').addEventListener('input',renderPalette);
    $('undo').onclick=()=>history('undo');$('redo').onclick=()=>history('redo');
    $('zoomIn').onclick=()=>zoom(1.2);$('zoomOut').onclick=()=>zoom(1/1.2);$('fitButton').onclick=fit;
    $('stage').onchange=e=>change(d=>{d.stage=Number(e.target.value);});
    $('name').onchange=e=>change(d=>{d.name=e.target.value.trim().slice(0,80)||`第 ${d.stage} 关`;});
    $('inspector').addEventListener('change',e=>{
        if(e.target.id==='wallLevel'){wallBrushLevel=Number(e.target.value);return;}
        if(e.target.dataset.runeGuard){
            const el=e.target,slot=Number(el.dataset.runeSlot),field=el.dataset.runeField;
            change(d=>{
                const g=d.guards.find(g=>g.id===el.dataset.runeGuard);if(!g)return;
                g.runes??=Array(5).fill(null);
                if(field==='typeid'){
                    const typeid=Number(el.value);
                    g.runes[slot]=typeid?{...(g.runes[slot]||{}),typeid}:null;
                }else{
                    const r=g.runes[slot];if(!r)return;
                    if(field==='hero_attr')r.hero_attr=Number(el.value);
                    else{
                        const layer=el.dataset.runeLayer,index=Number(el.dataset.runeIndex);
                        r[layer][index]=field==='stat'?catalog.runes.attributes.find(a=>a.stat===el.value&&a.layers.includes(layer)).id:Number(el.value);
                    }
                }
            });return;
        }
        if(e.target.dataset.guard){change(d=>{
            const g=d.guards.find(g=>g.id===e.target.dataset.guard);if(!g)return;
            const field=e.target.dataset.field,value=Number(e.target.value),slot=Number(e.target.dataset.slot);
            const hero=catalog.guards.find(h=>h.typeid===g.typeid);
            if(field==='skill'){
                const levels=hero.skills.find(s=>s.id===value).levels,oldLevel=g.skills[slot]%100;
                g.skills[slot]=value*100+(levels.includes(oldLevel)?oldLevel:levels[0]);
            }else if(field==='skillLevel')g.skills[slot]=Math.floor(g.skills[slot]/100)*100+value;
            else if(field==='mutateType'||field==='mutateLevel'){
                const old=catalog.mutations.find(m=>m.id===(g.mutateId??0));
                const type=field==='mutateType'?value:old.type,level=field==='mutateLevel'?value:(old.level||1);
                g.mutateId=type?catalog.mutations.find(m=>m.type===type&&m.level===level).id:0;
            }else{
                g[field]=value;
                if(field==='typeid'){
                    const next=catalog.guards.find(h=>h.typeid===value);
                    if(!next.variants.some(v=>v.evolution===(g.evolution??0)&&v.reborn===(g.reborn??0))){g.evolution=0;g.reborn=0;}
                    if(!C.guardVariant(g,catalog).basics[g.mutateId??0]?.length)g.mutateId=0;
                    const previous=(g.skills||[]).length;
                    g.skills=(g.skills||[]).filter(id=>next.skills.some(s=>s.id===Math.floor(id/100)&&s.levels.includes(id%100)));
                    if(g.skills.length<previous)toast('已切换英雄，不适用的技能已移除，可撤销恢复。');
                }
                if(field==='evolution'&&!C.guardVariant(g,catalog))g.reborn=0;
            }
        });return;}
        if(!selected||!e.target.dataset.property)return;
        const prop=e.target.dataset.property,value=Number(e.target.value),previous=C.clone(selected);
        const ok=change(d=>{
            const b=selected.kind==='building'?d.buildings.find(b=>b.id===selected.id):d.walls.find(w=>`${w.x}:${w.y}`===selected.id);
            if(!b)return;
            b[prop]=value;
            if(selected.kind==='building'&&prop==='level') {const spec=entryOf(b).levels.find(l=>l.level===value);if(spec)b.typeid=spec.typeid;}
            if(selected.kind==='wall')selected.id=`${b.x}:${b.y}`;
        });
        if(!ok){selected=previous;render();}
    });
    $('inspector').addEventListener('toggle',e=>{
        if(e.target.isConnected&&e.target.dataset.runeDetails){
            const key=e.target.dataset.runeDetails;
            if(e.target.open)openRuneDetails.add(key);else openRuneDetails.delete(key);
        }
    },true);
    $('inspector').addEventListener('click',e=>{
        const runeButton=e.target.closest('[data-rune-action]');
        if(runeButton){
            change(d=>{
                const g=d.guards.find(g=>g.id===runeButton.dataset.runeGuard),r=g?.runes?.[Number(runeButton.dataset.runeSlot)];if(!r)return;
                const layer=runeButton.dataset.runeLayer; r[layer]??=[];
                if(runeButton.dataset.runeAction==='remove')r[layer].splice(Number(runeButton.dataset.runeIndex),1);
                else{
                    const used=r[layer].map(id=>catalog.runes.attributes.find(a=>a.id===id).stat);
                    const a=catalog.runes.attributes.find(a=>a.layers.includes(layer)&&!used.includes(a.stat));if(a)r[layer].push(a.id);
                }
            });return;
        }
        if(e.target.id==='deleteButton')deleteSelected();
        if(e.target.id==='duplicateButton')duplicate();
        if(e.target.id==='addGuard'&&selected)change(d=>d.guards.push({id:freshId('g',d),typeid:10501,level:1,anchorId:selected.id}));
        if(e.target.dataset.removeGuard)change(d=>{d.guards=d.guards.filter(g=>g.id!==e.target.dataset.removeGuard);});
        if(e.target.dataset.addSkill)change(d=>{
            const g=d.guards.find(g=>g.id===e.target.dataset.addSkill);if(!g)return;
            const skill=catalog.guards.find(h=>h.typeid===g.typeid).skills.find(s=>!(g.skills||[]).some(id=>Math.floor(id/100)===s.id));
            if(skill&&(g.skills||[]).length<3)(g.skills??=[]).push(skill.id*100+skill.levels[0]);
        });
        if(e.target.dataset.removeSkill)change(d=>{
            const g=d.guards.find(g=>g.id===e.target.dataset.removeSkill);if(g)g.skills.splice(Number(e.target.dataset.slot),1);
        });
        if(e.target.dataset.maxSkills)change(d=>{
            const g=d.guards.find(g=>g.id===e.target.dataset.maxSkills);if(!g)return;
            const hero=catalog.guards.find(h=>h.typeid===g.typeid);
            g.skills=(g.skills||[]).map(id=>{const s=hero.skills.find(s=>s.id===Math.floor(id/100));return s.id*100+Math.max(...s.levels);});
        });
    });
    function exportLayout() {
        const report=C.validate(layout,catalog);if(report.errors.length){toast(report.errors[0]);return;}
        const blob=new Blob([JSON.stringify(layout,null,2)+'\n'],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
        a.href=url;a.download=`第${layout.stage}关-布局.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
        toast('已导出布局文件。把这个 JSON 文件交给我即可接入游戏。');
    }
    function importLayout(raw) {
        const next=C.normalize(raw,catalog),before=snapshot();layout=next;selected=null;setTool('select');finishChange(before,'已导入布局，可撤销恢复之前的版本。');fit();
    }
    $('exportButton').onclick=exportLayout;$('importButton').onclick=()=>$('importFile').click();
    $('importFile').onchange=async e=>{
        const file=e.target.files[0];if(!file)return;
        try {if(file.size>4*1024*1024)throw Error('布局文件过大，请选择 4 MB 以内的 JSON 文件。');importLayout(JSON.parse(await file.text()));}
        catch(error){toast('导入失败，当前布局已保留。\n'+error.message);}e.target.value='';
    };
    $('newButton').onclick=()=>$('newDialog').showModal();
    $('confirmNew').onclick=()=>{const before=snapshot();layout={...C.empty(layout.stage),mode:layout.mode,baseLevel:layout.baseLevel};selected=null;setTool('select');finishChange(before,'已新建空白布局。');fit();$('newDialog').close();};
    $('helpButton').onclick=()=>$('helpDialog').showModal();
    document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).close());
    $('referenceExpand').onclick=$('referenceThumb').onclick=()=>$('referenceDialog').showModal();
    function setReference(src) {
        reference.src=src;const image=new Image();image.onload=()=>{reference.aspect=image.height/image.width;renderBoard();};image.src=src;
        $('referenceImage').src=src;$('referenceLarge').src=src;
    }
    reference.aspect=410/550;setReference(reference.src);
    $('overlay').onchange=()=>{$('overlaySettings').hidden=!$('overlay').checked;if(!$('overlay').checked&&tool==='reference')setTool('select');render();};
    $('refOpacity').oninput=e=>{reference.opacity=Number(e.target.value)/100;$('opacityLabel').textContent=e.target.value+'%';renderBoard();};
    $('refScale').oninput=e=>{reference.scale=Number(e.target.value)/100;$('scaleLabel').textContent=e.target.value+'%';renderBoard();};
    $('moveReference').onclick=()=>setTool(tool==='reference'?'select':'reference');
    $('referenceUpload').onclick=()=>$('referenceFile').click();
    $('referenceFile').onchange=async e=>{
        const file=e.target.files[0];if(!file)return;
        if(!/^image\/(png|jpeg|webp)$/.test(file.type)||file.size>8*1024*1024){toast('请选择 8 MB 以内的 PNG、JPEG 或 WebP 图片。');return;}
        const reader=new FileReader();reader.onload=()=>{reference.x=0;reference.y=0;setReference(String(reader.result));toast('已替换参考图，仅用于本次对照，不会写入布局文件。');};reader.readAsDataURL(file);e.target.value='';
    };
    window.addEventListener('keydown',e=>{
        if(e.target.matches('input,select,textarea')||document.querySelector('dialog[open]'))return;
        const key=e.key.toLowerCase(),ctrl=e.ctrlKey||e.metaKey;
        if(ctrl&&key==='z'){e.preventDefault();history(e.shiftKey?'redo':'undo');}
        else if(ctrl&&key==='y'){e.preventDefault();history('redo');}
        else if(ctrl&&key==='s'){e.preventDefault();exportLayout();}
        else if(key===' '){space=true;e.preventDefault();}
        else if(key==='escape'){setTool('select');selected=null;render();}
        else if(key==='delete'||key==='backspace'){e.preventDefault();deleteSelected();}
        else if(['arrowup','arrowdown','arrowleft','arrowright'].includes(key)){
            e.preventDefault();const n=e.shiftKey?5:1;
            const offsets={arrowup:[-n,-n],arrowdown:[n,n],arrowleft:[-n,n],arrowright:[n,-n]};moveSelected(...offsets[key]);
        }else if(!ctrl&&{v:'select',w:'wall',e:'erase',h:'pan'}[key])setTool({v:'select',w:'wall',e:'erase',h:'pan'}[key]);
    });
    window.addEventListener('keyup',e=>{if(e.key===' ')space=false;});
    window.addEventListener('blur',()=>{space=false;if(gesture){if(gesture.kind==='paint')finishChange(gesture.before);gesture=null;board.classList.remove('dragging');render();}});
    new ResizeObserver(entries=>{
        const rect=entries[0].contentRect,changed=Math.abs(rect.width-dimensions.width)>120;
        dimensions={width:rect.width,height:rect.height};
        if(changed&&layout.buildings.length&&!gesture)fit();else renderBoard();
    }).observe(board);
    window.LayoutEditor={getLayout:()=>C.clone(layout),importLayout,validate:()=>C.validate(layout,catalog),fit};
    render();if(layout.buildings.length)requestAnimationFrame(fit);if(restoration)toast(restoration);
})();
