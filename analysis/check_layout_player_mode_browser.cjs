const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url'),{chromium}=require('../.local/layout-editor/qa/node_modules/playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'.local/layout-player-mode/browser');
fs.mkdirSync(out,{recursive:true});
(async()=>{
    const context=await chromium.launchPersistentContext(path.join(out,'profile'),{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,viewport:{width:1500,height:1000},acceptDownloads:true});
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    try{
        await page.goto(pathToFileURL(path.join(root,'artifacts/关卡布局编辑器.html')).href);
        await page.evaluate(()=>localStorage.clear());await page.reload();await page.waitForFunction(()=>window.LayoutEditor);
        await page.locator('#editorMode').selectOption('player');
        assert.equal(await page.locator('#playerBaseLevel').inputValue(),'8');
        assert.equal(await page.locator('#wallBrushLevel option').count(),8);
        assert.ok(await page.locator('[data-family="309"]').isDisabled());
        assert.ok(await page.locator('[data-family="614"]').isDisabled());
        assert.match(await page.locator('[data-family="202"]').innerText(),/0\/6/);
        async function at(x,y){return page.evaluate(({x,y})=>{
            const r=board.getBoundingClientRect(),p=LayoutCore.project(x,y),m=board.querySelector('g').getCTM();
            return {x:r.left+m.a*p.x+m.c*p.y+m.e,y:r.top+m.b*p.x+m.d*p.y+m.f};
        },{x,y});}
        async function place(f,x,y){await page.locator(`[data-family="${f}"]`).click();const p=await at(x,y);await page.mouse.click(p.x,p.y);}
        await place(201,30,30);assert.equal((await page.evaluate(()=>LayoutEditor.getLayout())).buildings[0].level,8);
        assert.ok(await page.locator('[data-family="201"]').isDisabled());
        assert.equal(await page.locator('[data-property="level"] option').count(),1);
        await place(401,35,30);assert.equal(await page.locator('[data-property="level"] option').count(),1);
        await page.locator('#playerBaseLevel').selectOption('1');
        assert.equal((await page.evaluate(()=>LayoutEditor.getLayout())).buildings[0].level,1);
        assert.equal((await page.evaluate(()=>LayoutEditor.getLayout())).buildings.length,2);
        assert.ok(await page.locator('#exportButton').isDisabled());
        await page.locator('#undo').click();assert.equal(await page.locator('#playerBaseLevel').inputValue(),'8');
        await page.locator('#playerBaseLevel').selectOption('1');
        // Remove the now locked trap, repairing the old layout.
        await page.keyboard.press('v');const p=await at(35,30);await page.mouse.click(p.x,p.y);
        await page.locator('#deleteButton').click();assert.equal(await page.locator('#exportButton').isDisabled(),false);
        await place(202,34,30);assert.ok(await page.locator('[data-family="202"]').isDisabled());
        assert.equal(await page.locator('[data-property="level"] option').count(),1);
        await page.locator('#duplicateButton').click();assert.equal((await page.evaluate(()=>LayoutEditor.getLayout())).buildings.length,2);
        await page.locator('#editorMode').selectOption('free');assert.equal(await page.locator('[data-family="202"]').isDisabled(),false);
        assert.equal(await page.locator('[data-family="614"]').isDisabled(),false);
        await page.locator('#editorMode').selectOption('player');
        // A full wall gesture must stop exactly at the level-1 cap of 20.
        await page.locator('#wallShape').selectOption('line');await page.locator('#wallPaletteButton').click();
        const a=await at(15,35),b=await at(40,35);
        await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:30});await page.mouse.up();
        assert.equal((await page.evaluate(()=>LayoutEditor.getLayout())).walls.length,20);
        assert.match(await page.locator('#wallQuota').innerText(),/20\/20/);
        const pending=page.waitForEvent('download');await page.locator('#exportButton').click();const download=await pending;
        await download.saveAs(path.join(out,'player-export.json'));
        const exported=JSON.parse(fs.readFileSync(path.join(out,'player-export.json'),'utf8'));assert.equal(exported.mode,'player');
        await page.reload();await page.waitForFunction(()=>window.LayoutEditor);assert.deepEqual(await page.evaluate(()=>LayoutEditor.getLayout()),exported);
        await page.locator('#importFile').setInputFiles(path.join(out,'player-export.json'));assert.deepEqual(await page.evaluate(()=>LayoutEditor.getLayout()),exported);
        await page.locator('#playerBaseLevel').selectOption('8');
        await page.screenshot({path:path.join(out,'player-desktop.png'),fullPage:true});
        await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(out,'player-mobile.png'),fullPage:true});
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        assert.deepEqual(errors,[]);console.log('PASS: packaged HTML mode switch, limits, repair, undo, drag-wall cap, export/import, reload and narrow screen');
    }finally{await context.close();}
})().catch(e=>{console.error(e);process.exit(1);});
