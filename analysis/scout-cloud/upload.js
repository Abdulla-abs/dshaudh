(() => {
    'use strict';
    const $ = id => document.getElementById(id), MAX = 262144;
    let layout = null, busy = false, selection = 0;
    const status = (id, text, type = '') => {const el=$(id); el.textContent=text; el.className='status '+type;};
    const canSubmit = () => {$('submit').disabled=busy || !layout || !$('author').value.trim();};
    async function api(path, options = {}) {
        const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 30000);
        try {
            const response = await fetch(path, {...options, signal:controller.signal});
            let data;
            try {data=await response.json();} catch {throw Error('服务返回了无法读取的内容，请稍后重试。');}
            if (!response.ok) throw Error(data.error || '请求失败，请稍后重试。');
            return data;
        } catch(error) {
            if (error.name==='AbortError') throw Error('请求超时，未能确认结果。可以稍后重试，同一内容不会重复入池。');
            if (error instanceof TypeError) throw Error('网络连接失败，请检查网络后重试。');
            throw error;
        } finally {clearTimeout(timeout);}
    }
    $('layout-file').addEventListener('change', async () => {
        const current=++selection, file=$('layout-file').files[0];
        layout=null; $('preview').hidden=true; status('upload-status',''); canSubmit();
        if (!file) return;
        try {
            if (file.size>MAX) throw Error('文件超过 256 KiB，请减少布局内容后重新导出。');
            const text=await file.text(); if(current!==selection) return;
            let raw; try {raw=JSON.parse(text.replace(/^\uFEFF/,''));} catch {throw Error('文件不是有效的 JSON，请重新从编辑器导出。');}
            if (!raw || raw.schema!=='dino-pve-layout/v1' || !['buildings','walls','guards'].every(k => Array.isArray(raw[k]) && raw[k].every(r => r && typeof r==='object' && !Array.isArray(r))))
                throw Error('请选择关卡布局编辑器导出的原始 JSON。');
            if (typeof raw.name!=='string' || !raw.name.trim() || raw.name.length>80) throw Error('阵容缺少有效名称，请在编辑器中命名后重新导出。');
            const homes=raw.buildings.filter(b => Math.floor(b.typeid/100)===201);
            if(homes.length!==1) throw Error('阵容必须恰好包含一座大本营。');
            layout=raw;
            $('layout-name').textContent=raw.name;
            $('layout-summary').textContent=`${homes[0].level} 级大本营 · ${raw.buildings.length} 个建筑及地图对象 · ${raw.walls.length} 段墙 · ${raw.guards.length} 名守军`;
            $('preview').hidden=false; canSubmit();
        } catch(error) {if(current===selection) status('upload-status',error.message,'error');}
    });
    $('author').addEventListener('input',canSubmit);
    $('upload-form').addEventListener('submit',async event => {
        event.preventDefault(); if(busy || !layout) return;
        const author=$('author').value.trim();
        if(!author || author.length>40) {status('upload-status','请填写 1～40 个字符的作者名。','error'); $('author').focus(); return;}
        const body=JSON.stringify({author,layout});
        if(new TextEncoder().encode(body).length>MAX) {status('upload-status','文件和作者信息合计超过 256 KiB，请减少布局内容。','error'); return;}
        busy=true; canSubmit(); $('layout-file').disabled=true; $('author').disabled=true; $('submit').textContent='正在上传…';
        status('upload-status','正在校验并上传阵容，请稍候。');
        try {
            const result=await api('/api/layouts',{method:'POST',headers:{'Content-Type':'application/json'},body});
            if(!result.ok || !/^[a-f0-9]{64}$/.test(result.id)) throw Error('上传回执不完整，请刷新阵容列表确认。');
            status('upload-status',result.duplicate?'此阵容已经在池中，无需重复上传。':'上传成功，阵容已加入共享池。','success');
            await refresh();
        } catch(error) {status('upload-status',error.message,'error');}
        finally {busy=false; $('layout-file').disabled=false; $('author').disabled=false; $('submit').textContent='上传阵容'; canSubmit();}
    });
    async function refresh() {
        if($('refresh').disabled) return;
        $('refresh').disabled=true; $('refresh').textContent='正在刷新…'; $('pool-list').setAttribute('aria-busy','true'); status('pool-status','');
        try {
            const data=await api('/api/pool');
            if(data.schema!=='dino-scout-cloud/v1' || !Number.isInteger(data.revision) || !Array.isArray(data.levels) || data.levels.some(r => !r || !/^[a-f0-9]{64}$/.test(r.id))) throw Error('阵容目录格式不正确，请联系维护者。');
            const list=document.createDocumentFragment();
            for(const entry of data.levels) {
                const li=document.createElement('li'), text=document.createElement('div'), name=document.createElement('span'), meta=document.createElement('p'), link=document.createElement('a');
                text.className='entry-text'; name.className='entry-name'; name.textContent=entry.name;
                meta.className='entry-meta'; meta.textContent=`${entry.headquartersLevel} 级大本营 · 作者：${entry.author}`;
                link.className='download'; link.href='/api/layouts/'+entry.id+'/raw'; link.textContent='下载 JSON'; link.setAttribute('aria-label','下载阵容：'+entry.name); link.download='';
                text.append(name,meta); li.append(text,link); list.append(li);
            }
            if(!data.levels.length) {const empty=document.createElement('li'); empty.className='placeholder'; empty.textContent='阵容池还没有公开布局。上传第一份阵容，开始分享。'; list.append(empty);}
            $('pool-list').replaceChildren(list); $('pool-summary').textContent=`共 ${data.levels.length} 份公开阵容 · 版本 ${data.revision}`;
        } catch(error) {
            status('pool-status',error.message+' 可点击“刷新阵容”重试。','error');
            if($('pool-list').querySelector('.placeholder')) {$('pool-list').replaceChildren(); $('pool-summary').textContent='尚未读取到阵容池';}
        } finally {$('refresh').disabled=false; $('refresh').textContent='刷新阵容'; $('pool-list').setAttribute('aria-busy','false');}
    }
    $('refresh').addEventListener('click',refresh);
    refresh();
})();
