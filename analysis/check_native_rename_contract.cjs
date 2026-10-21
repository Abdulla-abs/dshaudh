const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(`${__dirname}/native_boot.js`, 'utf8');
const store = {level:{player:{nickname:'LocalRookie',nickname_free:1,diamond:150},user_config:{rookie0:123}}};
let writes = 0, acks = 0, errors = 0, charges = 0;
const ctx = {
    LocalNative: {readRaw:()=>store, writeRaw(){writes++;},writeStatus(){},
        getResourceManager:()=>({Res:{3:50}, useRes(){charges++;return true;}})},
    NICKNAME_CHANGE_COST:100,RES_TYPE_DIAMOND:3,
    player:{rpc_c_change_nickname_ans(d){acks++;this.nickname=d.nickname;this.nickname_free=d.nickname_free;},
        rpc_c_change_nickname_failed(){errors++;}},
};
vm.createContext(ctx);
const a=source.indexOf('        LocalNative.handleChangeNickname = function');
const b=source.indexOf('        LocalNative.installCallServer = function',a);
vm.runInContext(source.slice(a,b),ctx);
assert.equal(ctx.LocalNative.handleChangeNickname(ctx.player,{nickname:'测试酋长'}),true);
assert.equal(ctx.player.nickname,'测试酋长');
assert.equal(ctx.player.nickname_free,0);
assert.equal(store.level.player.nickname,'测试酋长');
assert.equal(charges,0,'first tutorial naming is free');
assert.equal(ctx.LocalNative.handleChangeNickname(ctx.player,{nickname:'测试酋长'}),true);
assert.equal(charges,0,'duplicate request cannot charge');
assert.equal(writes,1);
assert.equal(ctx.LocalNative.handleChangeNickname(ctx.player,{nickname:' '}),false);
assert.equal(errors,1);
assert.equal(acks,2);
assert.equal(store.level.user_config.rookie0,123,'progress stays under stock Rookie control');
assert.equal(ctx.LocalNative.handleChangeNickname(ctx.player,{nickname:'新酋长'}),true);
assert.equal(charges,1);
assert.equal(store.level.player.diamond,50);
console.log('PASS: nickname save + stock ACK, free naming, duplicate, invalid and paid change');
