// Recovered stock functions; excerpt only. Regenerate with inspect_native_hero_swallow.py.

UI.HeroSwallow.prototype.swallowHeros=    function() {
    rm=G_Player.getComponent("ResourceManager");
    if ((!rm.useRes(this.swallowPrice,RES_TYPE_WOOD,this.swallowHeros.bind(this)))) {
    return;}
    this.lockSwallowButton();
    this.moveToLeft();
    hm=G_Player.getComponent("HeroManager");
    for (i in this.swallowList) {
    hero=G_UnitManager.getUnitBySID(this.swallowList[i]);
    if ((!hero)) {
    } else {
    hm.removeHero(hero.cid);
    G_UnitManager.deleteUnit(hero.cid);
    }
    }
    swallower=G_UnitManager.getUnit(this.heroCid);
    expBar=swallower.getComponent("ExpBar");
    attr=swallower.getComponent("HeroAttributeController");
    this.playFXSelector=DA.makeSelector(this.playSwallowExpFXStart,this,[expBar.growthLv,(this.swallowExp + expBar.growthXp)]);
    this.floatTextManager.setExValues([attr.getAttack(),attr.getDefense(),attr.getMaxLife(),DA.sum(attr.getLeadership()),expBar.getScore()]);
    expBar.addGrowthXp(this.swallowExp);
    G_Player.getComponent("HeroManager").sort();
    if ((this.swallowSameCnt > 0)) {
    swallower.getComponent("HeroGift").addExp(this.swallowGiftExp);
    }
    this.floatTextManager.setPostValues([attr.getAttack(),attr.getDefense(),attr.getMaxLife(),DA.sum(attr.getLeadership()),expBar.getScore()]);
    G_Player.swallowHeros(swallower.getSid(),this.swallowList);
    this.rootNode.animationManager.runAnimations(("combine" + this.swallowCount));
    this.soundHandles={};
    i=0;
    while (true) {
    soundHanlde=DA.scheduleOnce(this.rootNode,this,this.playSound.bind(this),[SND.HERO_SWALLOW_ACTION,i],(1.2 + (i * 0.2)));
    this.soundHandles[i];
    (i++);
    if (!((i < this.swallowCount))) break;}
    };

ClientPlayer.prototype.swallowHeros=    function(swallower, swallowList) {
    if ((GS_CURRENT_STAGE != GS_STAGE_BUILD)) {
    return;}
    this.callServer("rpc_s_swallow_heros",{swallower:swallower,swallow_list:swallowList})
    };

Comp.ExpBar.prototype.dump=    function(params) {
    params.xp=this.growthXp;
    params.lv=this.growthLv
    };

Comp.HeroGift.prototype.dump=    function(params) {
    params.gift=this.gift
    };
