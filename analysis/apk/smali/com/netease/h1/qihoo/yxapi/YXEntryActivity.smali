.class public Lcom/netease/h1/qihoo/yxapi/YXEntryActivity;
.super Lim/yixin/sdk/api/BaseYXEntryActivity;
.source "YXEntryActivity.java"


# static fields
.field private static final TIMELINE_SUPPORTED_VERSION:I = 0x21020001


# instance fields
.field private api:Lim/yixin/sdk/api/IYXAPI;

.field private checkBtn:Landroid/widget/Button;

.field private gotoBtn:Landroid/widget/Button;

.field private launchBtn:Landroid/widget/Button;

.field private regBtn:Landroid/widget/Button;

.field private wxapi:Lcom/tencent/mm/sdk/openapi/IWXAPI;


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .prologue
    .line 116
    const-string v0, "cocos2djs"

    invoke-static {v0}, Ljava/lang/System;->loadLibrary(Ljava/lang/String;)V

    .line 117
    return-void
.end method

.method public constructor <init>()V
    .locals 1

    .prologue
    const/4 v0, 0x0

    .line 26
    invoke-direct {p0}, Lim/yixin/sdk/api/BaseYXEntryActivity;-><init>()V

    .line 32
    iput-object v0, p0, Lcom/netease/h1/qihoo/yxapi/YXEntryActivity;->api:Lim/yixin/sdk/api/IYXAPI;

    .line 33
    iput-object v0, p0, Lcom/netease/h1/qihoo/yxapi/YXEntryActivity;->wxapi:Lcom/tencent/mm/sdk/openapi/IWXAPI;

    return-void
.end method

.method public static native YiXinSharedSuccess(Z)V
.end method

.method private showUI()V
    .locals 1

    .prologue
    .line 37
    invoke-virtual {p0}, Lcom/netease/h1/qihoo/yxapi/YXEntryActivity;->getIntent()Landroid/content/Intent;

    move-result-object v0

    .line 41
    .local v0, "intent":Landroid/content/Intent;
    return-void
.end method


# virtual methods
.method protected getIYXAPI()Lim/yixin/sdk/api/IYXAPI;
    .locals 1

    .prologue
    .line 49
    const-string v0, "yx3d00da779fa14fbda7b867c403058464"

    invoke-static {p0, v0}, Lim/yixin/sdk/api/YXAPIFactory;->createYXAPI(Landroid/content/Context;Ljava/lang/String;)Lim/yixin/sdk/api/IYXAPI;

    move-result-object v0

    return-object v0
.end method

.method public onReq(Lim/yixin/sdk/api/BaseReq;)V
    .locals 4
    .param p1, "req"    # Lim/yixin/sdk/api/BaseReq;

    .prologue
    .line 106
    invoke-direct {p0}, Lcom/netease/h1/qihoo/yxapi/YXEntryActivity;->showUI()V

    .line 107
    const-string v1, "YX-SDK-Client"

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "onReq called: transaction="

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    iget-object v3, p1, Lim/yixin/sdk/api/BaseReq;->transaction:Ljava/lang/String;

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 108
    invoke-virtual {p1}, Lim/yixin/sdk/api/BaseReq;->getType()I

    move-result v1

    packed-switch v1, :pswitch_data_0

    .line 113
    :goto_0
    return-void

    :pswitch_0
    move-object v0, p1

    .line 110
    check-cast v0, Lim/yixin/sdk/api/SendMessageToYX$Req;

    .line 111
    .local v0, "req1":Lim/yixin/sdk/api/SendMessageToYX$Req;
    iget-object v1, v0, Lim/yixin/sdk/api/SendMessageToYX$Req;->message:Lim/yixin/sdk/api/YXMessage;

    iget-object v1, v1, Lim/yixin/sdk/api/YXMessage;->title:Ljava/lang/String;

    const/4 v2, 0x1

    invoke-static {p0, v1, v2}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object v1

    invoke-virtual {v1}, Landroid/widget/Toast;->show()V

    goto :goto_0

    .line 108
    nop

    :pswitch_data_0
    .packed-switch 0x1
        :pswitch_0
    .end packed-switch
.end method

.method public onResp(Lim/yixin/sdk/api/BaseResp;)V
    .locals 6
    .param p1, "resp"    # Lim/yixin/sdk/api/BaseResp;

    .prologue
    const/4 v5, 0x1

    .line 58
    invoke-direct {p0}, Lcom/netease/h1/qihoo/yxapi/YXEntryActivity;->showUI()V

    .line 59
    const-string v2, "Yixin.SDK.YXEntryActivity"

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    const-string v4, "onResp called: errCode="

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    iget v4, p1, Lim/yixin/sdk/api/BaseResp;->errCode:I

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    const-string v4, ",errStr="

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    iget-object v4, p1, Lim/yixin/sdk/api/BaseResp;->errStr:Ljava/lang/String;

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    const-string v4, ",transaction="

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    iget-object v4, p1, Lim/yixin/sdk/api/BaseResp;->transaction:Ljava/lang/String;

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 61
    invoke-virtual {p1}, Lim/yixin/sdk/api/BaseResp;->getType()I

    move-result v2

    packed-switch v2, :pswitch_data_0

    .line 98
    :goto_0
    invoke-virtual {p0}, Lcom/netease/h1/qihoo/yxapi/YXEntryActivity;->finish()V

    .line 99
    return-void

    :pswitch_0
    move-object v0, p1

    .line 63
    check-cast v0, Lim/yixin/sdk/api/SendMessageToYX$Resp;

    .line 64
    .local v0, "resp1":Lim/yixin/sdk/api/SendMessageToYX$Resp;
    iget v2, v0, Lim/yixin/sdk/api/SendMessageToYX$Resp;->errCode:I

    packed-switch v2, :pswitch_data_1

    goto :goto_0

    .line 77
    :pswitch_1
    const-string v2, "\u53d1\u9001\u5931\u8d25"

    invoke-static {p0, v2, v5}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object v2

    invoke-virtual {v2}, Landroid/widget/Toast;->show()V

    goto :goto_0

    .line 66
    :pswitch_2
    const-string v2, "\u5df2\u7ecf\u5206\u4eab\u6210\u529f"

    invoke-static {p0, v2, v5}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object v2

    invoke-virtual {v2}, Landroid/widget/Toast;->show()V

    .line 68
    invoke-static {v5}, Lcom/netease/h1/qihoo/yxapi/YXEntryActivity;->YiXinSharedSuccess(Z)V

    goto :goto_0

    .line 71
    :pswitch_3
    const-string v2, "\u5206\u4eab\u5931\u8d25"

    invoke-static {p0, v2, v5}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object v2

    invoke-virtual {v2}, Landroid/widget/Toast;->show()V

    goto :goto_0

    .line 74
    :pswitch_4
    const-string v2, "\u7528\u6237\u53d6\u6d88"

    invoke-static {p0, v2, v5}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object v2

    invoke-virtual {v2}, Landroid/widget/Toast;->show()V

    goto :goto_0

    .end local v0    # "resp1":Lim/yixin/sdk/api/SendMessageToYX$Resp;
    :pswitch_5
    move-object v1, p1

    .line 82
    check-cast v1, Lim/yixin/sdk/api/SendAuthToYX$Resp;

    .line 83
    .local v1, "resp2":Lim/yixin/sdk/api/SendAuthToYX$Resp;
    iget v2, v1, Lim/yixin/sdk/api/SendAuthToYX$Resp;->errCode:I

    packed-switch v2, :pswitch_data_2

    :pswitch_6
    goto :goto_0

    .line 94
    :pswitch_7
    const-string v2, "\u7528\u6237\u62d2\u7edd"

    invoke-static {p0, v2, v5}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object v2

    invoke-virtual {v2}, Landroid/widget/Toast;->show()V

    goto :goto_0

    .line 85
    :pswitch_8
    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "\u83b7\u53d6Code\u6210\u529f\uff0ccode="

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    iget-object v3, v1, Lim/yixin/sdk/api/SendAuthToYX$Resp;->code:Ljava/lang/String;

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {p0, v2, v5}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object v2

    invoke-virtual {v2}, Landroid/widget/Toast;->show()V

    goto :goto_0

    .line 88
    :pswitch_9
    const-string v2, "\u5931\u8d25"

    invoke-static {p0, v2, v5}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object v2

    invoke-virtual {v2}, Landroid/widget/Toast;->show()V

    goto :goto_0

    .line 91
    :pswitch_a
    const-string v2, "\u7528\u6237\u62d2\u7edd"

    invoke-static {p0, v2, v5}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object v2

    invoke-virtual {v2}, Landroid/widget/Toast;->show()V

    goto :goto_0

    .line 61
    nop

    :pswitch_data_0
    .packed-switch 0x1
        :pswitch_0
        :pswitch_5
    .end packed-switch

    .line 64
    :pswitch_data_1
    .packed-switch -0x3
        :pswitch_1
        :pswitch_4
        :pswitch_3
        :pswitch_2
    .end packed-switch

    .line 83
    :pswitch_data_2
    .packed-switch -0x4
        :pswitch_7
        :pswitch_6
        :pswitch_a
        :pswitch_9
        :pswitch_8
    .end packed-switch
.end method
