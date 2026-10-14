.class public Lcom/netease/ntunisdk/Sdk360;
.super Lcom/netease/ntunisdk/base/SdkBase;
.source "Sdk360.java"


# static fields
.field private static final TAG:Ljava/lang/String; = "Sdk360"


# instance fields
.field private handler:Landroid/os/Handler;

.field private mAccountSwitchCallback:Lcom/qihoo/gamecenter/sdk/common/IDispatcherCallback;


# direct methods
.method public constructor <init>(Landroid/content/Context;)V
    .locals 1
    .param p1, "ctx"    # Landroid/content/Context;

    .prologue
    .line 44
    invoke-direct {p0, p1}, Lcom/netease/ntunisdk/base/SdkBase;-><init>(Landroid/content/Context;)V

    .line 301
    new-instance v0, Lcom/netease/ntunisdk/Sdk360$4;

    invoke-direct {v0, p0}, Lcom/netease/ntunisdk/Sdk360$4;-><init>(Lcom/netease/ntunisdk/Sdk360;)V

    iput-object v0, p0, Lcom/netease/ntunisdk/Sdk360;->mAccountSwitchCallback:Lcom/qihoo/gamecenter/sdk/common/IDispatcherCallback;

    .line 46
    return-void
.end method

.method static synthetic access$000(Lcom/netease/ntunisdk/Sdk360;)Landroid/content/Context;
    .locals 1
    .param p0, "x0"    # Lcom/netease/ntunisdk/Sdk360;

    .prologue
    .line 41
    iget-object v0, p0, Lcom/netease/ntunisdk/Sdk360;->myCtx:Landroid/content/Context;

    return-object v0
.end method

.method static synthetic access$100(Lcom/netease/ntunisdk/Sdk360;Ljava/lang/String;)Z
    .locals 1
    .param p0, "x0"    # Lcom/netease/ntunisdk/Sdk360;
    .param p1, "x1"    # Ljava/lang/String;

    .prologue
    .line 41
    invoke-direct {p0, p1}, Lcom/netease/ntunisdk/Sdk360;->isCancelLogin(Ljava/lang/String;)Z

    move-result v0

    return v0
.end method

.method static synthetic access$200(Lcom/netease/ntunisdk/Sdk360;)Landroid/content/Context;
    .locals 1
    .param p0, "x0"    # Lcom/netease/ntunisdk/Sdk360;

    .prologue
    .line 41
    iget-object v0, p0, Lcom/netease/ntunisdk/Sdk360;->myCtx:Landroid/content/Context;

    return-object v0
.end method

.method private getAntiAddictionIntent(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;
    .locals 4
    .param p1, "qihooUserId"    # Ljava/lang/String;
    .param p2, "accessToken"    # Ljava/lang/String;

    .prologue
    .line 548
    new-instance v0, Landroid/os/Bundle;

    invoke-direct {v0}, Landroid/os/Bundle;-><init>()V

    .line 549
    .local v0, "bundle":Landroid/os/Bundle;
    const-string v2, "access_token"

    invoke-virtual {v0, v2, p2}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    .line 550
    const-string v2, "qihoo_user_id"

    invoke-virtual {v0, v2, p1}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    .line 551
    const-string v2, "function_code"

    const/16 v3, 0x804

    invoke-virtual {v0, v2, v3}, Landroid/os/Bundle;->putInt(Ljava/lang/String;I)V

    .line 553
    new-instance v1, Landroid/content/Intent;

    iget-object v2, p0, Lcom/netease/ntunisdk/Sdk360;->myCtx:Landroid/content/Context;

    const-class v3, Lcom/qihoo/gamecenter/sdk/activity/ContainerActivity;

    invoke-direct {v1, v2, v3}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    .line 554
    .local v1, "intent":Landroid/content/Intent;
    invoke-virtual {v1, v0}, Landroid/content/Intent;->putExtras(Landroid/os/Bundle;)Landroid/content/Intent;

    .line 556
    return-object v1
.end method

.method private getBBSIntent(Z)Landroid/content/Intent;
    .locals 4
    .param p1, "isLandScape"    # Z

    .prologue
    .line 594
    new-instance v0, Landroid/os/Bundle;

    invoke-direct {v0}, Landroid/os/Bundle;-><init>()V

    .line 596
    .local v0, "bundle":Landroid/os/Bundle;
    const-string v2, "screen_orientation"

    invoke-virtual {v0, v2, p1}, Landroid/os/Bundle;->putBoolean(Ljava/lang/String;Z)V

    .line 598
    const-string v2, "function_code"

    const/16 v3, 0x801

    invoke-virtual {v0, v2, v3}, Landroid/os/Bundle;->putInt(Ljava/lang/String;I)V

    .line 599
    new-instance v1, Landroid/content/Intent;

    iget-object v2, p0, Lcom/netease/ntunisdk/Sdk360;->myCtx:Landroid/content/Context;

    const-class v3, Lcom/qihoo/gamecenter/sdk/activity/ContainerActivity;

    invoke-direct {v1, v2, v3}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    .line 600
    .local v1, "intent":Landroid/content/Intent;
    invoke-virtual {v1, v0}, Landroid/content/Intent;->putExtras(Landroid/os/Bundle;)Landroid/content/Intent;

    .line 601
    return-object v1
.end method

.method public static getChannelSts()Ljava/lang/String;
    .locals 1

    .prologue
    .line 391
    const-string v0, "360_assistant"

    return-object v0
.end method

.method private getLoginIntent(ZZ)Landroid/content/Intent;
    .locals 4
    .param p1, "isLandScape"    # Z
    .param p2, "isBgTransparent"    # Z

    .prologue
    .line 90
    new-instance v0, Landroid/os/Bundle;

    invoke-direct {v0}, Landroid/os/Bundle;-><init>()V

    .line 93
    .local v0, "bundle":Landroid/os/Bundle;
    const-string v2, "screen_orientation"

    invoke-virtual {v0, v2, p1}, Landroid/os/Bundle;->putBoolean(Ljava/lang/String;Z)V

    .line 96
    const-string v2, "login_bg_transparent"

    invoke-virtual {v0, v2, p2}, Landroid/os/Bundle;->putBoolean(Ljava/lang/String;Z)V

    .line 100
    const-string v2, "function_code"

    const/16 v3, 0x101

    invoke-virtual {v0, v2, v3}, Landroid/os/Bundle;->putInt(Ljava/lang/String;I)V

    .line 102
    new-instance v1, Landroid/content/Intent;

    iget-object v2, p0, Lcom/netease/ntunisdk/Sdk360;->myCtx:Landroid/content/Context;

    check-cast v2, Landroid/app/Activity;

    const-class v3, Lcom/qihoo/gamecenter/sdk/activity/ContainerActivity;

    invoke-direct {v1, v2, v3}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    .line 103
    .local v1, "intent":Landroid/content/Intent;
    invoke-virtual {v1, v0}, Landroid/content/Intent;->putExtras(Landroid/os/Bundle;)Landroid/content/Intent;

    .line 105
    return-object v1
.end method

.method private getQuitIntent(Z)Landroid/content/Intent;
    .locals 4
    .param p1, "isLandScape"    # Z

    .prologue
    .line 396
    new-instance v0, Landroid/os/Bundle;

    invoke-direct {v0}, Landroid/os/Bundle;-><init>()V

    .line 397
    .local v0, "bundle":Landroid/os/Bundle;
    const-string v2, "screen_orientation"

    invoke-virtual {v0, v2, p1}, Landroid/os/Bundle;->putBoolean(Ljava/lang/String;Z)V

    .line 398
    const-string v2, "function_code"

    const/16 v3, 0x802

    invoke-virtual {v0, v2, v3}, Landroid/os/Bundle;->putInt(Ljava/lang/String;I)V

    .line 400
    new-instance v1, Landroid/content/Intent;

    iget-object v2, p0, Lcom/netease/ntunisdk/Sdk360;->myCtx:Landroid/content/Context;

    const-class v3, Lcom/qihoo/gamecenter/sdk/activity/ContainerActivity;

    invoke-direct {v1, v2, v3}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    .line 401
    .local v1, "intent":Landroid/content/Intent;
    invoke-virtual {v1, v0}, Landroid/content/Intent;->putExtras(Landroid/os/Bundle;)Landroid/content/Intent;

    .line 402
    return-object v1
.end method

.method private getRealNameRegisterIntent(ZZLjava/lang/String;)Landroid/content/Intent;
    .locals 4
    .param p1, "isLandScape"    # Z
    .param p2, "isBgTransparent"    # Z
    .param p3, "qihooUserId"    # Ljava/lang/String;

    .prologue
    .line 572
    new-instance v0, Landroid/os/Bundle;

    invoke-direct {v0}, Landroid/os/Bundle;-><init>()V

    .line 573
    .local v0, "bundle":Landroid/os/Bundle;
    const-string v2, "screen_orientation"

    invoke-virtual {v0, v2, p1}, Landroid/os/Bundle;->putBoolean(Ljava/lang/String;Z)V

    .line 574
    const-string v2, "login_bg_transparent"

    invoke-virtual {v0, v2, p2}, Landroid/os/Bundle;->putBoolean(Ljava/lang/String;Z)V

    .line 575
    const-string v2, "qihoo_user_id"

    invoke-virtual {v0, v2, p3}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    .line 576
    const-string v2, "function_code"

    const/16 v3, 0x104

    invoke-virtual {v0, v2, v3}, Landroid/os/Bundle;->putInt(Ljava/lang/String;I)V

    .line 578
    new-instance v1, Landroid/content/Intent;

    iget-object v2, p0, Lcom/netease/ntunisdk/Sdk360;->myCtx:Landroid/content/Context;

    const-class v3, Lcom/qihoo/gamecenter/sdk/activity/ContainerActivity;

    invoke-direct {v1, v2, v3}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    .line 579
    .local v1, "intent":Landroid/content/Intent;
    invoke-virtual {v1, v0}, Landroid/content/Intent;->putExtras(Landroid/os/Bundle;)Landroid/content/Intent;

    return-object v1
.end method

.method private getSwitchAccountIntent(Z)Landroid/content/Intent;
    .locals 3
    .param p1, "isLandScape"    # Z

    .prologue
    .line 369
    new-instance v0, Landroid/content/Intent;

    iget-object v1, p0, Lcom/netease/ntunisdk/Sdk360;->myCtx:Landroid/content/Context;

    const-class v2, Lcom/qihoo/gamecenter/sdk/activity/ContainerActivity;

    invoke-direct {v0, v1, v2}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    .line 372
    .local v0, "intent":Landroid/content/Intent;
    const-string v1, "screen_orientation"

    invoke-virtual {v0, v1, p1}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Z)Landroid/content/Intent;

    .line 375
    const-string v1, "function_code"

    const/16 v2, 0x102

    invoke-virtual {v0, v1, v2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;I)Landroid/content/Intent;

    .line 377
    return-object v0
.end method

.method private getUploadScoreIntent(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;
    .locals 3
    .param p1, "topnid"    # Ljava/lang/String;
    .param p2, "score"    # Ljava/lang/String;

    .prologue
    .line 485
    new-instance v0, Landroid/content/Intent;

    invoke-direct {v0}, Landroid/content/Intent;-><init>()V

    .line 492
    .local v0, "intent":Landroid/content/Intent;
    const-string v1, "function_code"

    const/16 v2, 0x204

    invoke-virtual {v0, v1, v2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;I)Landroid/content/Intent;

    .line 493
    const-string v1, "score"

    invoke-virtual {v0, v1, p2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 494
    const-string v1, "topnid"

    invoke-virtual {v0, v1, p1}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 495
    return-object v0
.end method

.method private isCancelLogin(Ljava/lang/String;)Z
    .locals 5
    .param p1, "data"    # Ljava/lang/String;

    .prologue
    const/4 v4, -0x1

    .line 291
    :try_start_0
    new-instance v1, Lorg/json/JSONObject;

    invoke-direct {v1, p1}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    .line 292
    .local v1, "joData":Lorg/json/JSONObject;
    const-string v2, "errno"

    const/4 v3, -0x1

    invoke-virtual {v1, v2, v3}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;I)I
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    move-result v0

    .line 293
    .local v0, "errno":I
    if-ne v4, v0, :cond_0

    .line 294
    const/4 v2, 0x1

    .line 297
    .end local v0    # "errno":I
    .end local v1    # "joData":Lorg/json/JSONObject;
    :goto_0
    return v2

    .line 296
    :catch_0
    move-exception v2

    .line 297
    :cond_0
    const/4 v2, 0x0

    goto :goto_0
.end method


# virtual methods
.method public antiAddiction(Ljava/lang/String;)V
    .locals 5
    .param p1, "accessToken"    # Ljava/lang/String;

    .prologue
    .line 503
    const-string v2, "UIN"

    invoke-virtual {p0, v2}, Lcom/netease/ntunisdk/Sdk360;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    .line 504
    .local v1, "userId":Ljava/lang/String;
    invoke-direct {p0, v1, p1}, Lcom/netease/ntunisdk/Sdk360;->getAntiAddictionIntent(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v0

    .line 505
    .local v0, "intent":Landroid/content/Intent;
    const-string v2, "sdk360"

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    const-string v4, "userId:"

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 506
    const-string v2, "sdk360"

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    const-string v4, "accessToken:"

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 507
    iget-object v2, p0, Lcom/netease/ntunisdk/Sdk360;->myCtx:Landroid/content/Context;

    new-instance v3, Lcom/netease/ntunisdk/Sdk360$7;

    invoke-direct {v3, p0}, Lcom/netease/ntunisdk/Sdk360$7;-><init>(Lcom/netease/ntunisdk/Sdk360;)V

    invoke-static {v2, v0, v3}, Lcom/qihoo/gamecenter/sdk/matrix/Matrix;->execute(Landroid/content/Context;Landroid/content/Intent;Lcom/qihoo/gamecenter/sdk/common/IDispatcherCallback;)V

    .line 539
    return-void
.end method

.method public checkOrder(Lcom/netease/ntunisdk/base/OrderInfo;)V
    .locals 3
    .param p1, "order"    # Lcom/netease/ntunisdk/base/OrderInfo;

    .prologue
    .line 225
    invoke-virtual {p0}, Lcom/netease/ntunisdk/Sdk360;->hasLogin()Z

    move-result v1

    if-nez v1, :cond_0

    .line 226
    const/4 v1, 0x6

    invoke-virtual {p1, v1}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderStatus(I)V

    .line 227
    const-string v1, "not login"

    invoke-virtual {p1, v1}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderErrReason(Ljava/lang/String;)V

    .line 228
    invoke-virtual {p0, p1}, Lcom/netease/ntunisdk/Sdk360;->checkOrderDone(Lcom/netease/ntunisdk/base/OrderInfo;)V

    .line 269
    :goto_0
    return-void

    .line 232
    :cond_0
    const-string v1, "Sdk360"

    const-string v2, "try 360 order"

    invoke-static {v1, v2}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 234
    invoke-virtual {p0, p1}, Lcom/netease/ntunisdk/Sdk360;->getPayIntent(Lcom/netease/ntunisdk/base/OrderInfo;)Landroid/content/Intent;

    move-result-object v0

    .line 236
    .local v0, "intent":Landroid/content/Intent;
    const-string v1, "function_code"

    const/16 v2, 0x401

    invoke-virtual {v0, v1, v2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;I)Landroid/content/Intent;

    .line 238
    const-string v1, "login_bg_transparent"

    const/4 v2, 0x1

    invoke-virtual {v0, v1, v2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Z)Landroid/content/Intent;

    .line 239
    iget-object v1, p0, Lcom/netease/ntunisdk/Sdk360;->myCtx:Landroid/content/Context;

    check-cast v1, Landroid/app/Activity;

    new-instance v2, Lcom/netease/ntunisdk/Sdk360$3;

    invoke-direct {v2, p0, p1}, Lcom/netease/ntunisdk/Sdk360$3;-><init>(Lcom/netease/ntunisdk/Sdk360;Lcom/netease/ntunisdk/base/OrderInfo;)V

    invoke-static {v1, v0, v2}, Lcom/qihoo/gamecenter/sdk/matrix/Matrix;->invokeActivity(Landroid/content/Context;Landroid/content/Intent;Lcom/qihoo/gamecenter/sdk/common/IDispatcherCallback;)V

    goto :goto_0
.end method

.method protected doSdkBBS(Z)V
    .locals 3
    .param p1, "isLandScape"    # Z

    .prologue
    .line 584
    invoke-direct {p0, p1}, Lcom/netease/ntunisdk/Sdk360;->getBBSIntent(Z)Landroid/content/Intent;

    move-result-object v0

    .line 585
    .local v0, "intent":Landroid/content/Intent;
    iget-object v1, p0, Lcom/netease/ntunisdk/Sdk360;->myCtx:Landroid/content/Context;

    const/4 v2, 0x0

    invoke-static {v1, v0, v2}, Lcom/qihoo/gamecenter/sdk/matrix/Matrix;->invokeActivity(Landroid/content/Context;Landroid/content/Intent;Lcom/qihoo/gamecenter/sdk/common/IDispatcherCallback;)V

    .line 586
    return-void
.end method

.method public doSdkRealNameRegister()V
    .locals 4

    .prologue
    .line 560
    invoke-virtual {p0}, Lcom/netease/ntunisdk/Sdk360;->isLandscape()Z

    move-result v1

    const/4 v2, 0x1

    invoke-virtual {p0}, Lcom/netease/ntunisdk/Sdk360;->getLoginUid()Ljava/lang/String;

    move-result-object v3

    invoke-direct {p0, v1, v2, v3}, Lcom/netease/ntunisdk/Sdk360;->getRealNameRegisterIntent(ZZLjava/lang/String;)Landroid/content/Intent;

    move-result-object v0

    .line 561
    .local v0, "intent":Landroid/content/Intent;
    iget-object v1, p0, Lcom/netease/ntunisdk/Sdk360;->myCtx:Landroid/content/Context;

    new-instance v2, Lcom/netease/ntunisdk/Sdk360$8;

    invoke-direct {v2, p0}, Lcom/netease/ntunisdk/Sdk360$8;-><init>(Lcom/netease/ntunisdk/Sdk360;)V

    invoke-static {v1, v0, v2}, Lcom/qihoo/gamecenter/sdk/matrix/Matrix;->invokeActivity(Landroid/content/Context;Landroid/content/Intent;Lcom/qihoo/gamecenter/sdk/common/IDispatcherCallback;)V

    .line 569
    return-void
.end method

.method protected doSdkSwitchAccount(Z)V
    .locals 3
    .param p1, "isLandScape"    # Z

    .prologue
    .line 354
    invoke-direct {p0, p1}, Lcom/netease/ntunisdk/Sdk360;->getSwitchAccountIntent(Z)Landroid/content/Intent;

    move-result-object v0

    .line 356
    .local v0, "intent":Landroid/content/Intent;
    iget-object v1, p0, Lcom/netease/ntunisdk/Sdk360;->myCtx:Landroid/content/Context;

    iget-object v2, p0, Lcom/netease/ntunisdk/Sdk360;->mAccountSwitchCallback:Lcom/qihoo/gamecenter/sdk/common/IDispatcherCallback;

    invoke-static {v1, v0, v2}, Lcom/qihoo/gamecenter/sdk/matrix/Matrix;->invokeActivity(Landroid/content/Context;Landroid/content/Intent;Lcom/qihoo/gamecenter/sdk/common/IDispatcherCallback;)V

    .line 357
    return-void
.end method

.method public exit()V
    .locals 1

    .prologue
    .line 76
    iget-object v0, p0, Lcom/netease/ntunisdk/Sdk360;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    invoke-static {v0}, Lcom/qihoo/gamecenter/sdk/matrix/Matrix;->destroy(Landroid/content/Context;)V

    .line 77
    invoke-super {p0}, Lcom/netease/ntunisdk/base/SdkBase;->exit()V

    .line 78
    return-void
.end method

.method public getChannel()Ljava/lang/String;
    .locals 1

    .prologue
    .line 387
    const-string v0, "360_assistant"

    return-object v0
.end method

.method public getLoginSession()Ljava/lang/String;
    .locals 1

    .prologue
    .line 148
    invoke-virtual {p0}, Lcom/netease/ntunisdk/Sdk360;->hasLogin()Z

    move-result v0

    if-eqz v0, :cond_0

    .line 149
    const-string v0, "SESSION"

    invoke-virtual {p0, v0}, Lcom/netease/ntunisdk/Sdk360;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 152
    :goto_0
    return-object v0

    :cond_0
    const-string v0, "not_login"

    goto :goto_0
.end method

.method public getLoginUid()Ljava/lang/String;
    .locals 1

    .prologue
    .line 158
    invoke-virtual {p0}, Lcom/netease/ntunisdk/Sdk360;->hasLogin()Z

    move-result v0

    if-eqz v0, :cond_0

    .line 159
    const-string v0, "UIN"

    invoke-virtual {p0, v0}, Lcom/netease/ntunisdk/Sdk360;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 161
    :goto_0
    return-object v0

    :cond_0
    const-string v0, ""

    goto :goto_0
.end method

.method protected getPayIntent(Lcom/netease/ntunisdk/base/OrderInfo;)Landroid/content/Intent;
    .locals 8
    .param p1, "order"    # Lcom/netease/ntunisdk/base/OrderInfo;

    .prologue
    const/16 v7, 0x7c

    .line 177
    invoke-virtual {p1}, Lcom/netease/ntunisdk/base/OrderInfo;->getOrderEtc()Ljava/lang/String;

    move-result-object v1

    .line 178
    .local v1, "etc":Ljava/lang/String;
    invoke-static {v1}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v4

    if-nez v4, :cond_1

    .line 179
    invoke-virtual {v1, v7}, Ljava/lang/String;->indexOf(I)I

    move-result v4

    if-ltz v4, :cond_0

    .line 180
    const-string v4, "UIN"

    const/4 v5, 0x0

    invoke-virtual {v1, v7}, Ljava/lang/String;->indexOf(I)I

    move-result v6

    invoke-virtual {v1, v5, v6}, Ljava/lang/String;->substring(II)Ljava/lang/String;

    move-result-object v5

    invoke-virtual {p0, v4, v5}, Lcom/netease/ntunisdk/Sdk360;->setPropStr(Ljava/lang/String;Ljava/lang/String;)V

    .line 182
    :cond_0
    const-string v4, "SESSION"

    invoke-virtual {v1, v7}, Ljava/lang/String;->indexOf(I)I

    move-result v5

    add-int/lit8 v5, v5, 0x1

    invoke-virtual {v1, v5}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object v5

    invoke-virtual {p0, v4, v5}, Lcom/netease/ntunisdk/Sdk360;->setPropStr(Ljava/lang/String;Ljava/lang/String;)V

    .line 184
    :cond_1
    new-instance v0, Landroid/os/Bundle;

    invoke-direct {v0}, Landroid/os/Bundle;-><init>()V

    .line 186
    .local v0, "bundle":Landroid/os/Bundle;
    const-string v4, "screen_orientation"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/Sdk360;->isLandscape()Z

    move-result v5

    invoke-virtual {v0, v4, v5}, Landroid/os/Bundle;->putBoolean(Ljava/lang/String;Z)V

    .line 190
    const-string v5, "access_token"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/Sdk360;->hasLogin()Z

    move-result v4

    if-eqz v4, :cond_2

    const-string v4, "SESSION"

    invoke-virtual {p0, v4}, Lcom/netease/ntunisdk/Sdk360;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    :goto_0
    invoke-virtual {v0, v5, v4}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    .line 192
    const-string v4, "qihoo_user_id"

    const-string v5, "UIN"

    invoke-virtual {p0, v5}, Lcom/netease/ntunisdk/Sdk360;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v0, v4, v5}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    .line 194
    invoke-virtual {p1}, Lcom/netease/ntunisdk/base/OrderInfo;->getProductPrice()F

    move-result v4

    const/high16 v5, 0x42c80000    # 100.0f

    mul-float/2addr v4, v5

    invoke-virtual {p1}, Lcom/netease/ntunisdk/base/OrderInfo;->getCount()I

    move-result v5

    int-to-float v5, v5

    mul-float/2addr v4, v5

    float-to-int v4, v4

    invoke-static {v4}, Ljava/lang/Integer;->toString(I)Ljava/lang/String;

    move-result-object v3

    .line 195
    .local v3, "money":Ljava/lang/String;
    const-string v4, "sdk test"

    new-instance v5, Ljava/lang/StringBuilder;

    invoke-direct {v5}, Ljava/lang/StringBuilder;-><init>()V

    const-string v6, "qihoo test payment, mone="

    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-static {v4, v5}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 196
    const-string v4, "amount"

    invoke-virtual {v0, v4, v3}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    .line 198
    const-string v4, "rate"

    invoke-virtual {p1}, Lcom/netease/ntunisdk/base/OrderInfo;->getProductExchangeRatio()I

    move-result v5

    invoke-static {v5}, Ljava/lang/Integer;->toString(I)Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v0, v4, v5}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    .line 200
    const-string v4, "product_name"

    invoke-virtual {p1}, Lcom/netease/ntunisdk/base/OrderInfo;->getProductName()Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v0, v4, v5}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    .line 202
    const-string v4, "product_id"

    invoke-virtual {p1}, Lcom/netease/ntunisdk/base/OrderInfo;->getProductId()Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v0, v4, v5}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    .line 204
    const-string v4, "notify_uri"

    const-string v5, "PAY_CB_URL"

    invoke-virtual {p0, v5}, Lcom/netease/ntunisdk/Sdk360;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v0, v4, v5}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    .line 206
    const-string v4, "app_name"

    const-string v5, "APP_NAME"

    invoke-virtual {p0, v5}, Lcom/netease/ntunisdk/Sdk360;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v0, v4, v5}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    .line 209
    const-string v4, "app_user_name"

    const-string v5, "\u73a9\u5bb6"

    invoke-virtual {v0, v4, v5}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    .line 212
    const-string v4, "app_user_id"

    const-string v5, "UIN"

    invoke-virtual {p0, v5}, Lcom/netease/ntunisdk/Sdk360;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v0, v4, v5}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    .line 214
    const-string v4, "app_ext_1"

    invoke-virtual {p1}, Lcom/netease/ntunisdk/base/OrderInfo;->getOrderDesc()Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v0, v4, v5}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    .line 216
    const-string v4, "app_order_id"

    invoke-virtual {p1}, Lcom/netease/ntunisdk/base/OrderInfo;->getOrderId()Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v0, v4, v5}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    .line 218
    new-instance v2, Landroid/content/Intent;

    iget-object v4, p0, Lcom/netease/ntunisdk/Sdk360;->myCtx:Landroid/content/Context;

    check-cast v4, Landroid/app/Activity;

    const-class v5, Lcom/qihoo/gamecenter/sdk/activity/ContainerActivity;

    invoke-direct {v2, v4, v5}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    .line 219
    .local v2, "intent":Landroid/content/Intent;
    invoke-virtual {v2, v0}, Landroid/content/Intent;->putExtras(Landroid/os/Bundle;)Landroid/content/Intent;

    .line 220
    return-object v2

    .line 190
    .end local v2    # "intent":Landroid/content/Intent;
    .end local v3    # "money":Ljava/lang/String;
    :cond_2
    const-string v4, ""

    goto/16 :goto_0
.end method

.method public getSDKVersion()Ljava/lang/String;
    .locals 1

    .prologue
    .line 618
    const-string v0, "1.1.6"

    return-object v0
.end method

.method public getUniSDKVersion()Ljava/lang/String;
    .locals 1

    .prologue
    .line 623
    const-string v0, "1.1.6"

    return-object v0
.end method

.method public init(Lcom/netease/ntunisdk/base/OnFinishInitListener;)V
    .locals 3
    .param p1, "initListner"    # Lcom/netease/ntunisdk/base/OnFinishInitListener;

    .prologue
    const/4 v2, 0x1

    const/4 v1, 0x0

    .line 58
    const-string v0, "FEATURE_HAS_LOGOUT"

    invoke-virtual {p0, v0, v1}, Lcom/netease/ntunisdk/Sdk360;->setPropInt(Ljava/lang/String;I)V

    .line 59
    const-string v0, "FEATURE_HAS_MANAGER"

    invoke-virtual {p0, v0, v2}, Lcom/netease/ntunisdk/Sdk360;->setPropInt(Ljava/lang/String;I)V

    .line 60
    const-string v0, "FEATURE_EXIT_VIEW"

    invoke-virtual {p0, v0, v2}, Lcom/netease/ntunisdk/Sdk360;->setPropInt(Ljava/lang/String;I)V

    .line 61
    const-string v0, "FEATURE_NEED_UNITED_LOGIN"

    invoke-virtual {p0, v0, v1}, Lcom/netease/ntunisdk/Sdk360;->setPropInt(Ljava/lang/String;I)V

    .line 63
    new-instance v0, Lcom/netease/ntunisdk/Sdk360$1;

    invoke-direct {v0, p0}, Lcom/netease/ntunisdk/Sdk360$1;-><init>(Lcom/netease/ntunisdk/Sdk360;)V

    iput-object v0, p0, Lcom/netease/ntunisdk/Sdk360;->handler:Landroid/os/Handler;

    .line 70
    iget-object v0, p0, Lcom/netease/ntunisdk/Sdk360;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    invoke-static {v0}, Lcom/qihoo/gamecenter/sdk/matrix/Matrix;->init(Landroid/app/Activity;)V

    .line 71
    invoke-interface {p1, v1}, Lcom/netease/ntunisdk/base/OnFinishInitListener;->finishInit(I)V

    .line 72
    return-void
.end method

.method protected isLandscape()Z
    .locals 2

    .prologue
    const/4 v1, 0x2

    .line 53
    const-string v0, "SCR_ORIENTATION"

    invoke-virtual {p0, v0, v1}, Lcom/netease/ntunisdk/Sdk360;->getPropInt(Ljava/lang/String;I)I

    move-result v0

    if-ne v0, v1, :cond_0

    const/4 v0, 0x1

    :goto_0
    return v0

    :cond_0
    const/4 v0, 0x0

    goto :goto_0
.end method

.method public login()V
    .locals 3

    .prologue
    .line 110
    invoke-virtual {p0}, Lcom/netease/ntunisdk/Sdk360;->isLandscape()Z

    move-result v1

    const/4 v2, 0x1

    invoke-direct {p0, v1, v2}, Lcom/netease/ntunisdk/Sdk360;->getLoginIntent(ZZ)Landroid/content/Intent;

    move-result-object v0

    .line 111
    .local v0, "intent":Landroid/content/Intent;
    iget-object v1, p0, Lcom/netease/ntunisdk/Sdk360;->myCtx:Landroid/content/Context;

    check-cast v1, Landroid/app/Activity;

    new-instance v2, Lcom/netease/ntunisdk/Sdk360$2;

    invoke-direct {v2, p0}, Lcom/netease/ntunisdk/Sdk360$2;-><init>(Lcom/netease/ntunisdk/Sdk360;)V

    invoke-static {v1, v0, v2}, Lcom/qihoo/gamecenter/sdk/matrix/Matrix;->invokeActivity(Landroid/content/Context;Landroid/content/Intent;Lcom/qihoo/gamecenter/sdk/common/IDispatcherCallback;)V

    .line 144
    return-void
.end method

.method public logout()V
    .locals 0

    .prologue
    .line 287
    return-void
.end method

.method public openExitView()Z
    .locals 3

    .prologue
    .line 407
    invoke-virtual {p0}, Lcom/netease/ntunisdk/Sdk360;->isLandscape()Z

    move-result v1

    invoke-direct {p0, v1}, Lcom/netease/ntunisdk/Sdk360;->getQuitIntent(Z)Landroid/content/Intent;

    move-result-object v0

    .line 408
    .local v0, "intent":Landroid/content/Intent;
    iget-object v1, p0, Lcom/netease/ntunisdk/Sdk360;->myCtx:Landroid/content/Context;

    new-instance v2, Lcom/netease/ntunisdk/Sdk360$5;

    invoke-direct {v2, p0}, Lcom/netease/ntunisdk/Sdk360$5;-><init>(Lcom/netease/ntunisdk/Sdk360;)V

    invoke-static {v1, v0, v2}, Lcom/qihoo/gamecenter/sdk/matrix/Matrix;->invokeActivity(Landroid/content/Context;Landroid/content/Intent;Lcom/qihoo/gamecenter/sdk/common/IDispatcherCallback;)V

    .line 435
    const/4 v1, 0x1

    return v1
.end method

.method public openManager()V
    .locals 1

    .prologue
    .line 382
    invoke-virtual {p0}, Lcom/netease/ntunisdk/Sdk360;->isLandscape()Z

    move-result v0

    invoke-virtual {p0, v0}, Lcom/netease/ntunisdk/Sdk360;->doSdkSwitchAccount(Z)V

    .line 383
    return-void
.end method

.method public setDebugMode(Z)V
    .locals 0
    .param p1, "v"    # Z

    .prologue
    .line 167
    return-void
.end method

.method public setFloatBtnVisible(Z)V
    .locals 0
    .param p1, "v"    # Z

    .prologue
    .line 614
    return-void
.end method

.method public showMsg(Ljava/lang/String;)V
    .locals 2
    .param p1, "msg"    # Ljava/lang/String;

    .prologue
    .line 605
    invoke-static {}, Landroid/os/Message;->obtain()Landroid/os/Message;

    move-result-object v0

    .line 606
    .local v0, "message":Landroid/os/Message;
    iput-object p1, v0, Landroid/os/Message;->obj:Ljava/lang/Object;

    .line 607
    iget-object v1, p0, Lcom/netease/ntunisdk/Sdk360;->handler:Landroid/os/Handler;

    invoke-virtual {v1, v0}, Landroid/os/Handler;->sendMessage(Landroid/os/Message;)Z

    .line 608
    return-void
.end method

.method public upLoadUserInfo()V
    .locals 0

    .prologue
    .line 441
    return-void
.end method

.method public updateRank(Ljava/lang/String;D)V
    .locals 5
    .param p1, "rankType"    # Ljava/lang/String;
    .param p2, "score"    # D

    .prologue
    .line 449
    :try_start_0
    invoke-static {p2, p3}, Ljava/lang/String;->valueOf(D)Ljava/lang/String;

    move-result-object v2

    invoke-direct {p0, p1, v2}, Lcom/netease/ntunisdk/Sdk360;->getUploadScoreIntent(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v1

    .line 450
    .local v1, "intent":Landroid/content/Intent;
    iget-object v2, p0, Lcom/netease/ntunisdk/Sdk360;->myCtx:Landroid/content/Context;

    new-instance v3, Lcom/netease/ntunisdk/Sdk360$6;

    invoke-direct {v3, p0}, Lcom/netease/ntunisdk/Sdk360$6;-><init>(Lcom/netease/ntunisdk/Sdk360;)V

    invoke-static {v2, v1, v3}, Lcom/qihoo/gamecenter/sdk/matrix/Matrix;->execute(Landroid/content/Context;Landroid/content/Intent;Lcom/qihoo/gamecenter/sdk/common/IDispatcherCallback;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 482
    .end local v1    # "intent":Landroid/content/Intent;
    :goto_0
    return-void

    .line 478
    :catch_0
    move-exception v0

    .line 479
    .local v0, "e":Ljava/lang/Exception;
    const-string v2, "Sdk360"

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    const-string v4, "updateRank exception "

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v0}, Ljava/lang/Exception;->getMessage()Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 480
    invoke-virtual {v0}, Ljava/lang/Exception;->printStackTrace()V

    goto :goto_0
.end method
