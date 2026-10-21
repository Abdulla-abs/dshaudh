// Original package excerpts: Client/UI/Equipment.jsc and Client/ClientUnits/ClientPlayer.jsc.
// Original cancellation prompts: 会损失50%的资源 / 确认取消重铸.
// The local cancellation refund policy is separately authorized by the user.

UI.EquipmentRehandle.prototype.realRehandleEquipment=    function() {
    config=data.item[this.equip.typeid];
    if ((!config)) {
    return;}
    price=config.item_reforge_cost;
    if (price) {
    okFunc=DA.makeSelector(this.realRehandleEquipment,this,[]);
    if ((!G_Player.getComponent("ResourceManager").useRes(price[1],price[0],okFunc))) {
    return false;}}
    if (this.hero) {
    G_Player.callServer("rpc_s_rehandle_equipment",{sid:this.hero.getSid(),slot:this.equip.slot,hero_pieces:this.heropieces,prop_pieces:this.proppieces});
    } else {
    pkgid=config.item_type;
    G_Player.callServer("rpc_s_rehandle_equipment_package",{pkgid:pkgid,oid:this.equip.oid,hero_pieces:this.heropieces,prop_pieces:this.proppieces});
    }
    this._closeUI()
    };

UI.EquipRehandleResult.prototype._saveEquipment=    function() {
    if ((this.sid > -1)) {
    hero=G_UnitManager.getUnitBySID(this.sid);
    if (hero) {
    hero.getComponent("HeroEquipment").rehandleEquipmentAns(this.slot,this.after_equip);
    }
    ui=G_UIManager.get_ui(UI.Hero.UIID);
    if ((ui.selectedItem.hero.getSid() == this.sid)) {
    ui.equipPanel.controller.refreshEquipmentUI();
    }} else {
    G_Player.getComponent("PackageManager").updatePackageByServer([this.after_equip]);
    G_UIManager.get_ui(UI.AlchemyInterface.UIID).refreshCurrentUI();
    }
    this._closeUI()
    };

UI.EquipRehandleResult.prototype.realCancelRehandle=    function() {
    if ((this.sid > -1)) {
    G_Player.callServer("rpc_s_rehandle_cancel",{sid:this.sid,slot:this.slot});
    } else {
    G_Player.callServer("rpc_s_rehandle_cancel_package",{pkgid:this.pkgid,oid:this.oid});
    }
    this._closeUI()
    };

ClientPlayer.prototype.rpc_c_rehandle_ans=    function(dict) {
    G_UIManager.get_ui(UI.EquipRehandleResult.UIID).showRehandleResult(dict.sid,dict.slot,dict.after_equip)
    };

ClientPlayer.prototype.rpc_c_rehandle_ans2=    function(dict) {
    G_UIManager.get_ui(UI.EquipRehandleResult.UIID).showAlchemyRehandleResult(dict.pkgid,dict.oid,dict.after_equip)
    };

ClientPlayer.prototype.rpc_c_cancel_rehandle_ans=    function(dict) {
    G_UIManager.get_ui(UI.Award.UIID).showAward(dict.input_rst,dict.input_rst)
    };
