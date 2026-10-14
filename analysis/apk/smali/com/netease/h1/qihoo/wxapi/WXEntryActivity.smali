.class public Lcom/netease/h1/qihoo/wxapi/WXEntryActivity;
.super Landroid/app/Activity;
.source "WXEntryActivity.java"

# interfaces
.implements Lcom/tencent/mm/sdk/openapi/IWXAPIEventHandler;


# static fields
.field private static wxApi:Lcom/tencent/mm/sdk/openapi/IWXAPI;


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .prologue
    .line 86
    const-string v0, "cocos2djs"

    invoke-static {v0}, Ljava/lang/System;->loadLibrary(Ljava/lang/String;)V

    .line 87
    return-void
.end method

.method public constructor <init>()V
    .locals 0

    .prologue
    .line 23
    invoke-direct {p0}, Landroid/app/Activity;-><init>()V

    return-void
.end method

.method public static native WeiXinSharedSuccess(Z)V
.end method

.method private goToGetMsg()V
    .locals 2

    .prologue
    .line 78
    const-string v0, "hujing"

    const-string v1, "getMsg from wx ..."

    invoke-static {v0, v1}, Landroid/util/Log;->v(Ljava/lang/String;Ljava/lang/String;)I

    .line 79
    return-void
.end method

.method private goToShowMsg(Lcom/tencent/mm/sdk/modelmsg/ShowMessageFromWX$Req;)V
    .locals 2
    .param p1, "showReq"    # Lcom/tencent/mm/sdk/modelmsg/ShowMessageFromWX$Req;

    .prologue
    .line 82
    const-string v0, "hujing"

    const-string v1, "show msg from wx ..."

    invoke-static {v0, v1}, Landroid/util/Log;->v(Ljava/lang/String;Ljava/lang/String;)I

    .line 83
    return-void
.end method


# virtual methods
.method public onCreate(Landroid/os/Bundle;)V
    .locals 2
    .param p1, "savedInstanceState"    # Landroid/os/Bundle;

    .prologue
    .line 28
    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V

    .line 29
    const-string v0, "wx80a52fb1d7ecac64"

    const/4 v1, 0x0

    invoke-static {p0, v0, v1}, Lcom/tencent/mm/sdk/openapi/WXAPIFactory;->createWXAPI(Landroid/content/Context;Ljava/lang/String;Z)Lcom/tencent/mm/sdk/openapi/IWXAPI;

    move-result-object v0

    sput-object v0, Lcom/netease/h1/qihoo/wxapi/WXEntryActivity;->wxApi:Lcom/tencent/mm/sdk/openapi/IWXAPI;

    .line 30
    sget-object v0, Lcom/netease/h1/qihoo/wxapi/WXEntryActivity;->wxApi:Lcom/tencent/mm/sdk/openapi/IWXAPI;

    invoke-virtual {p0}, Lcom/netease/h1/qihoo/wxapi/WXEntryActivity;->getIntent()Landroid/content/Intent;

    move-result-object v1

    invoke-interface {v0, v1, p0}, Lcom/tencent/mm/sdk/openapi/IWXAPI;->handleIntent(Landroid/content/Intent;Lcom/tencent/mm/sdk/openapi/IWXAPIEventHandler;)Z

    .line 31
    return-void
.end method

.method protected onNewIntent(Landroid/content/Intent;)V
    .locals 1
    .param p1, "intent"    # Landroid/content/Intent;

    .prologue
    .line 35
    invoke-super {p0, p1}, Landroid/app/Activity;->onNewIntent(Landroid/content/Intent;)V

    .line 37
    invoke-virtual {p0, p1}, Lcom/netease/h1/qihoo/wxapi/WXEntryActivity;->setIntent(Landroid/content/Intent;)V

    .line 38
    sget-object v0, Lcom/netease/h1/qihoo/wxapi/WXEntryActivity;->wxApi:Lcom/tencent/mm/sdk/openapi/IWXAPI;

    invoke-interface {v0, p1, p0}, Lcom/tencent/mm/sdk/openapi/IWXAPI;->handleIntent(Landroid/content/Intent;Lcom/tencent/mm/sdk/openapi/IWXAPIEventHandler;)Z

    .line 39
    return-void
.end method

.method public onReq(Lcom/tencent/mm/sdk/modelbase/BaseReq;)V
    .locals 1
    .param p1, "req"    # Lcom/tencent/mm/sdk/modelbase/BaseReq;

    .prologue
    .line 43
    invoke-virtual {p1}, Lcom/tencent/mm/sdk/modelbase/BaseReq;->getType()I

    move-result v0

    packed-switch v0, :pswitch_data_0

    .line 53
    .end local p1    # "req":Lcom/tencent/mm/sdk/modelbase/BaseReq;
    :goto_0
    return-void

    .line 45
    .restart local p1    # "req":Lcom/tencent/mm/sdk/modelbase/BaseReq;
    :pswitch_0
    invoke-direct {p0}, Lcom/netease/h1/qihoo/wxapi/WXEntryActivity;->goToGetMsg()V

    goto :goto_0

    .line 48
    :pswitch_1
    check-cast p1, Lcom/tencent/mm/sdk/modelmsg/ShowMessageFromWX$Req;

    .end local p1    # "req":Lcom/tencent/mm/sdk/modelbase/BaseReq;
    invoke-direct {p0, p1}, Lcom/netease/h1/qihoo/wxapi/WXEntryActivity;->goToShowMsg(Lcom/tencent/mm/sdk/modelmsg/ShowMessageFromWX$Req;)V

    goto :goto_0

    .line 43
    :pswitch_data_0
    .packed-switch 0x3
        :pswitch_0
        :pswitch_1
    .end packed-switch
.end method

.method public onResp(Lcom/tencent/mm/sdk/modelbase/BaseResp;)V
    .locals 2
    .param p1, "resp"    # Lcom/tencent/mm/sdk/modelbase/BaseResp;

    .prologue
    const/4 v1, 0x1

    .line 58
    iget v0, p1, Lcom/tencent/mm/sdk/modelbase/BaseResp;->errCode:I

    packed-switch v0, :pswitch_data_0

    .line 71
    :pswitch_0
    const-string v0, "\u5206\u4eab\u5931\u8d25"

    invoke-static {p0, v0, v1}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object v0

    invoke-virtual {v0}, Landroid/widget/Toast;->show()V

    .line 74
    :goto_0
    invoke-virtual {p0}, Lcom/netease/h1/qihoo/wxapi/WXEntryActivity;->finish()V

    .line 75
    return-void

    .line 60
    :pswitch_1
    const-string v0, "\u5206\u4eab\u6210\u529f\u4e86"

    invoke-static {p0, v0, v1}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object v0

    invoke-virtual {v0}, Landroid/widget/Toast;->show()V

    .line 62
    invoke-static {v1}, Lcom/netease/h1/qihoo/wxapi/WXEntryActivity;->WeiXinSharedSuccess(Z)V

    goto :goto_0

    .line 65
    :pswitch_2
    const-string v0, "\u53d6\u6d88\u5206\u4eab"

    invoke-static {p0, v0, v1}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object v0

    invoke-virtual {v0}, Landroid/widget/Toast;->show()V

    goto :goto_0

    .line 68
    :pswitch_3
    const-string v0, "\u5206\u4eab\u5931\u8d25"

    invoke-static {p0, v0, v1}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object v0

    invoke-virtual {v0}, Landroid/widget/Toast;->show()V

    goto :goto_0

    .line 58
    :pswitch_data_0
    .packed-switch -0x4
        :pswitch_3
        :pswitch_0
        :pswitch_2
        :pswitch_0
        :pswitch_1
    .end packed-switch
.end method
