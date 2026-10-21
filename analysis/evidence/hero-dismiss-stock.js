// Original package excerpts; names and request order preserved.
// Sources: Client/UI/Hero.jsc, Client/UI/Award.jsc, Client/ClientUnits/ClientPlayer.jsc.

UI.HeroItem.prototype.dismissHero=    function() {
    hm=G_Player.getComponent("HeroManager");
    if ((!hm.canSellHero())) {
    G_MainController.setNotice("hero_last");
    return;}
    this.closeItem();
    master=this.getHeroMaster();
    master.delSelectItem(this.hero);
    hid=this.hero.cid;
    sid=this.hero.getSid();
    this.clearItem();
    master.delHeroItem(this);
    hm.removeHero(hid);
    G_Player.callServer("rpc_s_dismiss_hero",{hero_id:sid})
    };

UI.Award.prototype.showAward=    function(award, award_get) {
    G_UIManager.open_ui(this._uiid);
    putins=G_EventManager.getShownAwards(award,award_get);
    this.afterMergeInputs(putins);
    G_EventManager.inputAward(award_get)
    };

ClientPlayer.prototype.rpc_c_after_dismiss_hero=    function(dict) {
    G_UIManager.get_ui(UI.Award.UIID).showAward(dict.inputAward,dict.inputAward);
    if (dict.equip_ret) {
    if (dict.equip_ret.letter) {
    G_MainController.setNotice("equip_in_sys_letter");
    }
    if (dict.equip_ret["package"]) {
    G_MainController.setNotice("equip_in_package");
    }}
    };
