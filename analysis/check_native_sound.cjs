// Decode fixtures with the vendored cli from Client/Components/SoundManager.jsc
// and Data/Client/sound_data.jsc into .local/home-sound/{SoundManager,sound_data}.js.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(`${__dirname}/native_boot.js`,'utf8');
const sounds=[],loads=[],mutes=[],logs=[],scheduled=[];
let fail=false;
const backend={loadSound:p=>loads.push(p),setCategoryMute:(c,m)=>mutes.push([c,m]),
 playSound(...args){if(fail)throw Error('FMOD unavailable');sounds.push(args);return sounds.length;},
 start(){if(fail)throw Error('start unavailable');},stop(){},release(){},freeAllEvents(){}};
const saved={music_switch:'true',sound_switch:'false'};
const ctx={data:{},cc:{log:s=>logs.push(s)},sys:{localStorage:{getItem:k=>saved[k]}},Singleton:f=>f,
 DA:{SoundSystem:{getInstance:()=>backend},warning(){},GETCGC:()=>({mapManager:{getScale:()=>2}}),
 scheduleOnce(node,self,fn,args,delay){scheduled.push(()=>fn.apply(self,args));return scheduled.length;},
 unschedule(){}},ROLLOFF_SCALE:1};
vm.createContext(ctx);
for(const name of ['sound_data','SoundManager'])
 vm.runInContext(fs.readFileSync(`${__dirname}/../.local/home-sound/${name}.js`,'utf8'),ctx);
vm.runInContext('new DA.SoundManager()',ctx);
const mgr=ctx.G_SoundManager, stock=mgr.playSound;
const start=source.indexOf('        var protectSound = function()'),end=source.indexOf('        protectSound();',start);
assert.ok(start>=0&&end>start);
vm.runInContext(source.slice(start,end)+'protectSound();',ctx);
assert.deepEqual(loads,['sound/H1_soundeffect.fev','sound/H1_music.fev']);
assert.deepEqual(mutes,[['music',true],['fx',false],['ui',false],['item',false],['voice',false]]);
const mutedBefore=JSON.stringify(mutes);
for(const id of [2003,2005,2006,2007,2008,2009,2010])mgr.playSound(id);
assert.equal(sounds.length,7);assert.equal(sounds[0][0],'H1_soundeffect/item/build_pick');
assert.ok(sounds.some(x=>x[0].endsWith('gain_sunshine_l')));
assert.ok(sounds.some(x=>x[0].endsWith('gain_gold_l')));
assert.equal(Object.keys(mgr.soundMap).length,0,'auto timers released');
assert.notEqual(mgr.playSound,stock);
const guarded=mgr.playSound;for(let i=0;i<5;i++)vm.runInContext('protectSound()',ctx);
assert.equal(mgr.playSound,guarded,'idempotent repeated installation');
mgr.playSound(2003,{x:3,y:4});assert.deepEqual(sounds.at(-1),['H1_soundeffect/item/build_pick',6,8]);
const handle=mgr.playAndHoldSound(2003);assert.equal(typeof handle,'number');mgr.stop(handle);mgr.start(handle);mgr.release(handle);
assert.equal(Object.keys(mgr.soundMap).length,0);
fail=true;assert.doesNotThrow(()=>mgr.playSound(2003));assert.equal(Object.keys(mgr.soundMap).length,0);
ctx.data.sound_data[99999]={sound_file_path:'delayed',sound_delay:30};
mgr.playSound(99999);assert.doesNotThrow(()=>scheduled.pop()());
assert.equal(Object.keys(mgr.soundMap).length,0,'failed delayed timer released');
assert.equal(logs.length,1,'audio failure reported only once per wrapper');
fail=false;mgr.playSound(2003);assert.equal(sounds.at(-1)[0],'H1_soundeffect/item/build_pick','later events still play');
assert.equal(JSON.stringify(mutes),mutedBefore,'preserves mute preferences');
mgr.SoundOnAndOff(false);assert.deepEqual(mutes.at(-1),['voice',true]);
assert.doesNotMatch(source,/quietSound|playSound\s*=\s*quiet/);
console.log('PASS: stock building/collection sounds, positions, held/delayed events, failure containment, retry, timer cleanup, preferences and repeated installation.');
