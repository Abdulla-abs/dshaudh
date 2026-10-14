.class public Lcom/netease/h1/qihoo/yxapi/AppRegister;
.super Lim/yixin/sdk/api/YXAPIBaseBroadcastReceiver;
.source "AppRegister.java"


# direct methods
.method public constructor <init>()V
    .locals 0

    .prologue
    .line 17
    invoke-direct {p0}, Lim/yixin/sdk/api/YXAPIBaseBroadcastReceiver;-><init>()V

    return-void
.end method


# virtual methods
.method protected getAppId()Ljava/lang/String;
    .locals 1

    .prologue
    .line 24
    const-string v0, "yxbbd0e8b3dce64e02bab42437becc4384"

    return-object v0
.end method

.method protected onAfterYixinStart(Lim/yixin/sdk/channel/YXMessageProtocol;)V
    .locals 0
    .param p1, "protocol"    # Lim/yixin/sdk/channel/YXMessageProtocol;

    .prologue
    .line 39
    return-void
.end method
