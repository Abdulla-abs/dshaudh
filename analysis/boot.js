(function() {
    try {
        PATCH_ENABLED = false;
        NtUniSdkEnabled = false;
        __PLAY_MODE = __PLAY_MODE_OFF_LINE;
        NETWORK_TICK_ENABLE = false;
        PLAYER_OFFLINE_CHECK_ENABLE = false;
        DestroyVersionControlAndEnterGame();
        var menu = G_MainController.MainMenu.controller;
        menu.showMaintenanceNotice = function() {};
        menu.touchMask.setVisible(false);
        menu.loginCommon.controller.autoLogin = function() {};
        menu.rootNode.animationManager.runAnimations("default");
        var localNotice = function() {
            G_MainController.setNotice("\u672c\u5730\u542f\u52a8\u6d4b\u8bd5\u5df2\u901a\u8fc7\u3002\u4e3b\u57ce\u548c\u73a9\u6cd5\u5c1a\u672a\u6062\u590d\u3002");
        };
        G_MainController.platformLogin = localNotice;
        G_MainController.login = localNotice;
        G_MainController.quickLogin = localNotice;
        var size = G_Director.getWinSize();
        var caption = cc.LabelTTF.create("\u672c\u5730\u542f\u52a8\u6d4b\u8bd5 \u00b7 \u4e3b\u57ce\u548c\u73a9\u6cd5\u5c1a\u672a\u6062\u590d", "Arial", 18);
        caption.setPosition(size.width / 2, 24);
        menu.rootNode.addChild(caption, 99999);
        G_Director.setAnimationInterval(1 / 30);
        G_Director.resume();
        G_Director.startAnimation();
        cc.log("DinoLocal: local entry scene ready");
        return JSON.stringify({status:"local-entry-ready", patch:PATCH_ENABLED, mode:__PLAY_MODE});
    } catch (error) {
        return JSON.stringify({status:"failed", message:String(error), stack:error.stack});
    }
})();
