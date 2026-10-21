// Original package excerpts: Client/UI/Package.jsc, Client/Components/Components.jsc, Client/ClientUnits/ClientPlayer.jsc.

ALCHEMY_BLUEPRINT_COMPOSE_NUM={2:5,3:2};

GRAY_UNKNOWN_BLUEPRINT_TYPEID={2:4041,3:4042};

Comp.PackageManager.prototype.composeBlueprint=    function(blueprints, rebornType) {
    pkgMgr=G_Player.getComponent("PackageManager");
    typeids=[];
    i=0;
    while (true) {
    item=pkgMgr.getItem(ALCHEMY_TYPE_FORMULA,blueprints[i]);
    typeids.push(item.typeid);
    (i++);
    if (!((i < blueprints.length))) break;}
    G_Player.callServer("rpc_s_compose_blueprint",{blueprints:typeids,reborn_type:rebornType})
    };

Comp.PackageManager.prototype.composeBlueprintAns=    function(ans) {
    G_EventManager.inputAward(ans);
    G_MainController.setNotice("compose_success");
    composedBlueprint=null;
    i=0;
    while (true) {
    if ((ans[i][0] != INPUT_TYPE_ITEM)) {
    }
    items=ans[i][1];
    j=0;
    while (true) {
    if (this.getBlueprintRebornType(items[j].typeid)) {
    composedBlueprint=items[j].typeid;
    break;
    }
    (j++);
    if (!((j < items.length))) break;}
    (i++);
    if (!(((!composedBlueprint) && (i < ans.length)))) break;}
    if (composedBlueprint) {
    if (G_UIManager.isUIOpen(UI.AlchemyCompound.UIID)) {
    ui=G_UIManager.get_ui(UI.AlchemyCompound.UIID);
    ui.midPanelCtr.setComposedBlueprint(composedBlueprint);
    }}
    if (G_UIManager.isUIOpen(UI.AlchemyCompound.UIID)) {
    G_UIManager.get_ui(UI.AlchemyCompound.UIID).afterReceComposeResult(ans);
    }
    if (G_UIManager.isUIOpen(UI.AlchemyInterface.UIID)) {
    G_UIManager.get_ui(UI.AlchemyInterface.UIID).refreshCurrentUI();
    }
    };

ClientPlayer.prototype.rpc_c_compose_blueprint_ans=    function(dict) {
    G_Player.getComponent("PackageManager").composeBlueprintAns(dict.ans)
    };
