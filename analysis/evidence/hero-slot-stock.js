// Short recovered stock functions from HeroComponents.jsc, Cocos SM v22.
// HeroManager.init default assignments below are reconstructed from bytecode;
// the decompiler misrenders the value-or-zero expression.
Comp.HeroManager.prototype.init = function(params) {
    this.hero_slot_num = params.hero_slot_num || 0;
    this.hero_slot_buy_num = params.hero_slot_buy_num || 0;
};

Comp.HeroManager.prototype.getHeroCapacity=    function() {
    return this.hero_slot_num
    };


Comp.HeroManager.prototype.getHeroSlotNum=    function() {
    return this.hero_slot_num
    };


Comp.HeroAttributeController.prototype.init=    function(config, params) {
    this.battleConfig=DA.getUnitBattleConfig(params.typeid,params.unit_mutateid);
    this.life=((typeof params.life != "undefined") ? params.life : this.getMaxLife());
    this.health=((typeof params.health != "undefined") ? params.health : this.getMaxHealth());
    this.state=((typeof params.state != "undefined") ? params.state : HERO_STATE_IDLE);
    this.lastRecoverTime=parseInt(params.rct);
    this.lastAddHealthTime=parseInt(params.aht);
    this.attack_index=params.aidx;
    (params.did || (this.defense_id=""))
    };


Comp.HeroAttributeController.prototype.refreshHealth=    function(isUserOperate) {
    healthSpeed=(this.battleConfig.health_daily / DAY_TIME);
    nowtime=DA.getSystemCurrentTimeSec();
    tempHealth=parseInt(((nowtime - this.lastAddHealthTime) * healthSpeed));
    this.changeHealth((tempHealth + this.health));
    if (((healthSpeed != 0) && (this.health < this.maxHealth))) {
    this.lastAddHealthTime=(this.lastAddHealthTime + (tempHealth / healthSpeed));
    } else {
    this.lastAddHealthTime=nowtime;
    }
    this.healthChangeTrigger(this.health);
    if (this.master.heroController) {
    this.master.heroController.refreshHealth(isUserOperate);
    }
    };


Comp.HeroAttributeController.prototype.changeHealth=    function(health) {
    this.health=Math.min(Math.max(0,health),this.maxHealth)
    };


Comp.HeroAttributeController.prototype.isAlive=    function() {
    return (this.health >= this.getHealthBattleRequired())
    };


Comp.HeroAttributeController.prototype.getState=    function() {
    if ((!this.isAlive())) {
    return HERO_STATE_DEAD;}
    if ((this.isRecovering() && (this.state != HERO_STATE_DONATE))) {
    return HERO_STATE_RECOVERING;}
    return this.state
    };


Comp.HeroAttributeController.prototype.isRecovering=    function(life) {
    return (this.life < this.maxLife)
    };

