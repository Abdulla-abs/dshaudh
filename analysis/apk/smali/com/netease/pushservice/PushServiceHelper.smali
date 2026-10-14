.class public Lcom/netease/pushservice/PushServiceHelper;
.super Ljava/lang/Object;
.source "PushServiceHelper.java"


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;
    }
.end annotation


# static fields
.field private static final TAG:Ljava/lang/String;

.field private static s_pushServiceHelper:Lcom/netease/pushservice/PushServiceHelper;


# instance fields
.field private m_network:Lcom/netease/pushservice/Network;

.field private m_packageAppInfoMap:Ljava/util/HashMap;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/HashMap",
            "<",
            "Ljava/lang/String;",
            "Lcom/netease/push/utils/AppInfo;",
            ">;"
        }
    .end annotation
.end field

.field private m_pushService:Lcom/netease/pushservice/PushService;

.field private m_serviceInfo:Lcom/netease/pushservice/PushServiceInfo;

.field private m_taskSubmitter:Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;


# direct methods
.method static constructor <clinit>()V
    .locals 2

    .prologue
    .line 63
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "NGPush_"

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-class v1, Lcom/netease/pushservice/PushServiceHelper;

    invoke-virtual {v1}, Ljava/lang/Class;->getSimpleName()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    sput-object v0, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    .line 64
    new-instance v0, Lcom/netease/pushservice/PushServiceHelper;

    invoke-direct {v0}, Lcom/netease/pushservice/PushServiceHelper;-><init>()V

    sput-object v0, Lcom/netease/pushservice/PushServiceHelper;->s_pushServiceHelper:Lcom/netease/pushservice/PushServiceHelper;

    return-void
.end method

.method public constructor <init>()V
    .locals 2

    .prologue
    const/4 v1, 0x0

    .line 62
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 66
    new-instance v0, Ljava/util/HashMap;

    invoke-direct {v0}, Ljava/util/HashMap;-><init>()V

    iput-object v0, p0, Lcom/netease/pushservice/PushServiceHelper;->m_packageAppInfoMap:Ljava/util/HashMap;

    .line 67
    new-instance v0, Lcom/netease/pushservice/PushServiceInfo;

    invoke-direct {v0}, Lcom/netease/pushservice/PushServiceInfo;-><init>()V

    iput-object v0, p0, Lcom/netease/pushservice/PushServiceHelper;->m_serviceInfo:Lcom/netease/pushservice/PushServiceInfo;

    .line 68
    new-instance v0, Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;

    invoke-direct {v0, p0}, Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;-><init>(Lcom/netease/pushservice/PushServiceHelper;)V

    iput-object v0, p0, Lcom/netease/pushservice/PushServiceHelper;->m_taskSubmitter:Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;

    .line 69
    iput-object v1, p0, Lcom/netease/pushservice/PushServiceHelper;->m_network:Lcom/netease/pushservice/Network;

    .line 70
    iput-object v1, p0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    .line 62
    return-void
.end method

.method static synthetic access$0()Ljava/lang/String;
    .locals 1

    .prologue
    .line 63
    sget-object v0, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    return-object v0
.end method

.method static synthetic access$1(Lcom/netease/pushservice/PushServiceHelper;Ljava/lang/String;)V
    .locals 0

    .prologue
    .line 151
    invoke-direct {p0, p1}, Lcom/netease/pushservice/PushServiceHelper;->register(Ljava/lang/String;)V

    return-void
.end method

.method static synthetic access$2(Lcom/netease/pushservice/PushServiceHelper;)Lcom/netease/pushservice/PushService;
    .locals 1

    .prologue
    .line 70
    iget-object v0, p0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    return-object v0
.end method

.method private checkFirstStart(Lcom/netease/push/utils/AppInfo;)V
    .locals 6
    .param p1, "appInfo"    # Lcom/netease/push/utils/AppInfo;

    .prologue
    const/4 v5, 0x0

    .line 192
    sget-object v1, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v2, "checkFirstStart"

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 193
    sget-object v1, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "appInfo.mbFirstStart:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-boolean v3, p1, Lcom/netease/push/utils/AppInfo;->mbFirstStart:Z

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Z)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 194
    sget-object v1, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "appInfo.mPackageName:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v3, p1, Lcom/netease/push/utils/AppInfo;->mPackageName:Ljava/lang/String;

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 195
    sget-object v1, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "appInfo.mLastReceiveTime:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-wide v3, p1, Lcom/netease/push/utils/AppInfo;->mLastReceiveTime:J

    invoke-virtual {v2, v3, v4}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 196
    iget-object v1, p0, Lcom/netease/pushservice/PushServiceHelper;->m_serviceInfo:Lcom/netease/pushservice/PushServiceInfo;

    iget-object v1, v1, Lcom/netease/pushservice/PushServiceInfo;->mDevId:Ljava/lang/String;

    invoke-static {v1}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v1

    if-eqz v1, :cond_1

    .line 208
    :cond_0
    :goto_0
    return-void

    .line 199
    :cond_1
    iget-boolean v1, p1, Lcom/netease/push/utils/AppInfo;->mbFirstStart:Z

    if-eqz v1, :cond_0

    .line 200
    iput-boolean v5, p1, Lcom/netease/push/utils/AppInfo;->mbFirstStart:Z

    .line 201
    iget-object v1, p0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    iget-object v2, p1, Lcom/netease/push/utils/AppInfo;->mPackageName:Ljava/lang/String;

    invoke-static {v1, v2, v5}, Lcom/netease/push/utils/PushSetting;->setOtherPkgFirstStart(Landroid/content/Context;Ljava/lang/String;Z)V

    .line 202
    invoke-static {}, Lcom/netease/inner/pushclient/PushClientReceiver;->createNewIDIntent()Landroid/content/Intent;

    move-result-object v0

    .line 203
    .local v0, "intent":Landroid/content/Intent;
    const-string v1, "devid"

    iget-object v2, p0, Lcom/netease/pushservice/PushServiceHelper;->m_serviceInfo:Lcom/netease/pushservice/PushServiceInfo;

    iget-object v2, v2, Lcom/netease/pushservice/PushServiceInfo;->mDevId:Ljava/lang/String;

    invoke-virtual {v0, v1, v2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 204
    iget-object v1, p1, Lcom/netease/push/utils/AppInfo;->mPackageName:Ljava/lang/String;

    invoke-virtual {v0, v1}, Landroid/content/Intent;->setPackage(Ljava/lang/String;)Landroid/content/Intent;

    .line 205
    sget-object v1, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v2, "broadcast createNewIDIntent"

    invoke-static {v1, v2}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 206
    iget-object v1, p0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    invoke-virtual {v1, v0}, Lcom/netease/pushservice/PushService;->sendBroadcast(Landroid/content/Intent;)V

    goto :goto_0
.end method

.method public static createActiveMethodIntent()Landroid/content/Intent;
    .locals 3

    .prologue
    .line 616
    new-instance v0, Landroid/content/Intent;

    const-string v1, "com.netease.push.action.service.METHOD"

    invoke-direct {v0, v1}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V

    .line 617
    .local v0, "intent":Landroid/content/Intent;
    const-string v1, "method_ver"

    const/4 v2, 0x1

    invoke-virtual {v0, v1, v2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;I)Landroid/content/Intent;

    .line 618
    return-object v0
.end method

.method public static createMethodIntent()Landroid/content/Intent;
    .locals 2

    .prologue
    .line 607
    invoke-static {}, Lcom/netease/pushservice/PushServiceHelper;->createActiveMethodIntent()Landroid/content/Intent;

    move-result-object v0

    .line 608
    .local v0, "intent":Landroid/content/Intent;
    const/16 v1, 0x20

    invoke-virtual {v0, v1}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;

    .line 609
    return-object v0
.end method

.method public static createServiceIntent()Landroid/content/Intent;
    .locals 2

    .prologue
    .line 601
    new-instance v0, Landroid/content/Intent;

    const-string v1, "com.netease.push.action.service.PUSHSERVICE"

    invoke-direct {v0, v1}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V

    .line 602
    .local v0, "intent":Landroid/content/Intent;
    const/16 v1, 0x20

    invoke-virtual {v0, v1}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;

    .line 603
    return-object v0
.end method

.method private enableRepeatProtect(Ljava/lang/String;Z)V
    .locals 4
    .param p1, "packageName"    # Ljava/lang/String;
    .param p2, "flag"    # Z

    .prologue
    .line 346
    sget-object v1, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v2, "repeatprotect"

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 347
    sget-object v1, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "packageName:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 348
    sget-object v1, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "flag:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p2}, Ljava/lang/StringBuilder;->append(Z)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 349
    sget-object v1, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "pid:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-static {}, Landroid/os/Process;->myPid()I

    move-result v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 350
    iget-object v1, p0, Lcom/netease/pushservice/PushServiceHelper;->m_packageAppInfoMap:Ljava/util/HashMap;

    invoke-virtual {v1, p1}, Ljava/util/HashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Lcom/netease/push/utils/AppInfo;

    .line 351
    .local v0, "appInfo":Lcom/netease/push/utils/AppInfo;
    if-eqz v0, :cond_0

    iget-boolean v1, v0, Lcom/netease/push/utils/AppInfo;->mbRepeatProtect:Z

    if-eq v1, p2, :cond_0

    .line 352
    iput-boolean p2, v0, Lcom/netease/push/utils/AppInfo;->mbRepeatProtect:Z

    .line 354
    :cond_0
    return-void
.end method

.method private enableSound(Ljava/lang/String;Z)V
    .locals 4
    .param p1, "packageName"    # Ljava/lang/String;
    .param p2, "flag"    # Z

    .prologue
    .line 324
    sget-object v1, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v2, "enableSound"

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 325
    sget-object v1, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "packageName:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 326
    sget-object v1, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "flag:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p2}, Ljava/lang/StringBuilder;->append(Z)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 327
    sget-object v1, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "pid:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-static {}, Landroid/os/Process;->myPid()I

    move-result v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 328
    iget-object v1, p0, Lcom/netease/pushservice/PushServiceHelper;->m_packageAppInfoMap:Ljava/util/HashMap;

    invoke-virtual {v1, p1}, Ljava/util/HashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Lcom/netease/push/utils/AppInfo;

    .line 329
    .local v0, "appInfo":Lcom/netease/push/utils/AppInfo;
    if-eqz v0, :cond_0

    iget-boolean v1, v0, Lcom/netease/push/utils/AppInfo;->mbEnableSound:Z

    if-eq v1, p2, :cond_0

    .line 330
    iput-boolean p2, v0, Lcom/netease/push/utils/AppInfo;->mbEnableSound:Z

    .line 332
    :cond_0
    return-void
.end method

.method private enableVibrate(Ljava/lang/String;Z)V
    .locals 4
    .param p1, "packageName"    # Ljava/lang/String;
    .param p2, "flag"    # Z

    .prologue
    .line 335
    sget-object v1, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v2, "enableVibrate"

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 336
    sget-object v1, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "packageName:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 337
    sget-object v1, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "flag:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p2}, Ljava/lang/StringBuilder;->append(Z)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 338
    sget-object v1, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "pid:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-static {}, Landroid/os/Process;->myPid()I

    move-result v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 339
    iget-object v1, p0, Lcom/netease/pushservice/PushServiceHelper;->m_packageAppInfoMap:Ljava/util/HashMap;

    invoke-virtual {v1, p1}, Ljava/util/HashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Lcom/netease/push/utils/AppInfo;

    .line 340
    .local v0, "appInfo":Lcom/netease/push/utils/AppInfo;
    if-eqz v0, :cond_0

    iget-boolean v1, v0, Lcom/netease/push/utils/AppInfo;->mbEnableVibrate:Z

    if-eq v1, p2, :cond_0

    .line 341
    iput-boolean p2, v0, Lcom/netease/push/utils/AppInfo;->mbEnableVibrate:Z

    .line 343
    :cond_0
    return-void
.end method

.method public static getInstance()Lcom/netease/pushservice/PushServiceHelper;
    .locals 1

    .prologue
    .line 73
    sget-object v0, Lcom/netease/pushservice/PushServiceHelper;->s_pushServiceHelper:Lcom/netease/pushservice/PushServiceHelper;

    return-object v0
.end method

.method private register(Ljava/lang/String;)V
    .locals 6
    .param p1, "packageName"    # Ljava/lang/String;

    .prologue
    .line 152
    sget-object v3, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v4, "register"

    invoke-static {v3, v4}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 153
    sget-object v3, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "packageName:"

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v3, v4}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 154
    sget-object v3, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "m_serviceInfo.mDevId:"

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v5, p0, Lcom/netease/pushservice/PushServiceHelper;->m_serviceInfo:Lcom/netease/pushservice/PushServiceInfo;

    iget-object v5, v5, Lcom/netease/pushservice/PushServiceInfo;->mDevId:Ljava/lang/String;

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v3, v4}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 155
    invoke-static {p1}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v3

    if-eqz v3, :cond_0

    .line 176
    :goto_0
    return-void

    .line 159
    :cond_0
    iget-object v3, p0, Lcom/netease/pushservice/PushServiceHelper;->m_packageAppInfoMap:Ljava/util/HashMap;

    invoke-virtual {v3, p1}, Ljava/util/HashMap;->containsKey(Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_3

    .line 160
    sget-object v3, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v4, "new AppInfo"

    invoke-static {v3, v4}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 161
    new-instance v0, Lcom/netease/push/utils/AppInfo;

    invoke-direct {v0, p1}, Lcom/netease/push/utils/AppInfo;-><init>(Ljava/lang/String;)V

    .line 162
    .local v0, "appInfo":Lcom/netease/push/utils/AppInfo;
    iget-object v3, p0, Lcom/netease/pushservice/PushServiceHelper;->m_packageAppInfoMap:Ljava/util/HashMap;

    invoke-virtual {v3, p1, v0}, Ljava/util/HashMap;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 163
    iget-object v3, p0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    iget-object v4, p0, Lcom/netease/pushservice/PushServiceHelper;->m_packageAppInfoMap:Ljava/util/HashMap;

    invoke-virtual {v4}, Ljava/util/HashMap;->keySet()Ljava/util/Set;

    move-result-object v4

    invoke-static {v3, v4}, Lcom/netease/push/utils/PushSetting;->setPackages(Landroid/content/Context;Ljava/util/Set;)V

    .line 164
    iget-object v3, p0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    iget-object v4, v0, Lcom/netease/push/utils/AppInfo;->mPackageName:Ljava/lang/String;

    invoke-static {v3, v4}, Lcom/netease/push/utils/PushSetting;->getOtherAllNativeNotification(Landroid/content/Context;Ljava/lang/String;)Ljava/util/List;

    move-result-object v2

    .line 165
    .local v2, "nativePushDatas":Ljava/util/List;, "Ljava/util/List<Lcom/netease/inner/pushclient/NativePushData;>;"
    if-eqz v2, :cond_1

    .line 166
    invoke-interface {v2}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v3

    :goto_1
    invoke-interface {v3}, Ljava/util/Iterator;->hasNext()Z

    move-result v4

    if-nez v4, :cond_2

    .line 170
    :cond_1
    invoke-direct {p0, p1}, Lcom/netease/pushservice/PushServiceHelper;->registerToServer(Ljava/lang/String;)V

    .line 175
    .end local v2    # "nativePushDatas":Ljava/util/List;, "Ljava/util/List<Lcom/netease/inner/pushclient/NativePushData;>;"
    :goto_2
    invoke-direct {p0, v0}, Lcom/netease/pushservice/PushServiceHelper;->checkFirstStart(Lcom/netease/push/utils/AppInfo;)V

    goto :goto_0

    .line 166
    .restart local v2    # "nativePushDatas":Ljava/util/List;, "Ljava/util/List<Lcom/netease/inner/pushclient/NativePushData;>;"
    :cond_2
    invoke-interface {v3}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Lcom/netease/inner/pushclient/NativePushData;

    .line 167
    .local v1, "nativePushData":Lcom/netease/inner/pushclient/NativePushData;
    iget-object v4, p0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    iget-object v5, v0, Lcom/netease/push/utils/AppInfo;->mPackageName:Ljava/lang/String;

    invoke-virtual {v1, v4, v5}, Lcom/netease/inner/pushclient/NativePushData;->startAlarm(Landroid/content/Context;Ljava/lang/String;)V

    goto :goto_1

    .line 172
    .end local v0    # "appInfo":Lcom/netease/push/utils/AppInfo;
    .end local v1    # "nativePushData":Lcom/netease/inner/pushclient/NativePushData;
    .end local v2    # "nativePushDatas":Ljava/util/List;, "Ljava/util/List<Lcom/netease/inner/pushclient/NativePushData;>;"
    :cond_3
    iget-object v3, p0, Lcom/netease/pushservice/PushServiceHelper;->m_packageAppInfoMap:Ljava/util/HashMap;

    invoke-virtual {v3, p1}, Ljava/util/HashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Lcom/netease/push/utils/AppInfo;

    .restart local v0    # "appInfo":Lcom/netease/push/utils/AppInfo;
    goto :goto_2
.end method

.method private registerToServer(Ljava/lang/String;)V
    .locals 3
    .param p1, "service"    # Ljava/lang/String;

    .prologue
    .line 179
    iget-object v1, p0, Lcom/netease/pushservice/PushServiceHelper;->m_serviceInfo:Lcom/netease/pushservice/PushServiceInfo;

    iget-object v1, v1, Lcom/netease/pushservice/PushServiceInfo;->mDevId:Ljava/lang/String;

    invoke-static {v1}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v1

    if-eqz v1, :cond_0

    .line 189
    :goto_0
    return-void

    .line 183
    :cond_0
    new-instance v0, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;

    invoke-direct {v0}, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;-><init>()V

    .line 184
    .local v0, "devServiceInfo":Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;
    iget-object v1, p0, Lcom/netease/pushservice/PushServiceHelper;->m_serviceInfo:Lcom/netease/pushservice/PushServiceInfo;

    iget-object v1, v1, Lcom/netease/pushservice/PushServiceInfo;->mDevId:Ljava/lang/String;

    iput-object v1, v0, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;->id:Ljava/lang/String;

    .line 185
    iput-object p1, v0, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;->service:Ljava/lang/String;

    .line 186
    const-wide/16 v1, 0x0

    iput-wide v1, v0, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;->time:J

    .line 187
    sget-object v1, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v2, "REGISTER_TYPE"

    invoke-static {v1, v2}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 188
    invoke-virtual {p0}, Lcom/netease/pushservice/PushServiceHelper;->getNetwork()Lcom/netease/pushservice/Network;

    move-result-object v1

    const/4 v2, 0x6

    invoke-virtual {v1, v2, v0}, Lcom/netease/pushservice/Network;->sendData(BLcom/netease/push/proto/ProtoClientWrapper$DataMarshal;)V

    goto :goto_0
.end method

.method private requireToken()V
    .locals 15

    .prologue
    const/4 v14, 0x2

    .line 225
    sget-object v10, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v11, "requireToken"

    invoke-static {v10, v11}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 226
    sget-object v5, Landroid/os/Build;->MODEL:Ljava/lang/String;

    .line 227
    .local v5, "sModel":Ljava/lang/String;
    iget-object v10, p0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    const-string v11, "window"

    invoke-virtual {v10, v11}, Lcom/netease/pushservice/PushService;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v9

    check-cast v9, Landroid/view/WindowManager;

    .line 228
    .local v9, "wm":Landroid/view/WindowManager;
    invoke-interface {v9}, Landroid/view/WindowManager;->getDefaultDisplay()Landroid/view/Display;

    move-result-object v1

    .line 229
    .local v1, "display":Landroid/view/Display;
    invoke-virtual {v1}, Landroid/view/Display;->getWidth()I

    move-result v7

    .line 230
    .local v7, "width":I
    invoke-virtual {v1}, Landroid/view/Display;->getHeight()I

    move-result v2

    .line 231
    .local v2, "height":I
    new-instance v10, Ljava/lang/StringBuilder;

    sget-object v11, Landroid/os/Build$VERSION;->RELEASE:Ljava/lang/String;

    invoke-static {v11}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v11

    invoke-direct {v10, v11}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v11, "_"

    invoke-virtual {v10, v11}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v10

    sget-object v11, Landroid/os/Build$VERSION;->SDK:Ljava/lang/String;

    invoke-virtual {v10, v11}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v10

    invoke-virtual {v10}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v6

    .line 232
    .local v6, "sVersion":Ljava/lang/String;
    const-string v4, ""

    .line 233
    .local v4, "sMac":Ljava/lang/String;
    iget-object v10, p0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    const-string v11, "wifi"

    invoke-virtual {v10, v11}, Lcom/netease/pushservice/PushService;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v8

    check-cast v8, Landroid/net/wifi/WifiManager;

    .line 234
    .local v8, "wifiMgr":Landroid/net/wifi/WifiManager;
    if-nez v8, :cond_1

    const/4 v3, 0x0

    .line 235
    .local v3, "info":Landroid/net/wifi/WifiInfo;
    :goto_0
    if-nez v3, :cond_2

    const-string v4, ""

    .line 236
    :goto_1
    if-nez v4, :cond_0

    .line 237
    const-string v4, ""

    .line 239
    :cond_0
    new-instance v0, Lcom/netease/push/proto/ProtoClientWrapper$DevInfo;

    invoke-direct {v0}, Lcom/netease/push/proto/ProtoClientWrapper$DevInfo;-><init>()V

    .line 240
    .local v0, "devInfo":Lcom/netease/push/proto/ProtoClientWrapper$DevInfo;
    iput-object v5, v0, Lcom/netease/push/proto/ProtoClientWrapper$DevInfo;->model:Ljava/lang/String;

    .line 241
    const-string v10, "%d*%d"

    new-array v11, v14, [Ljava/lang/Object;

    const/4 v12, 0x0

    invoke-static {v7}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v13

    aput-object v13, v11, v12

    const/4 v12, 0x1

    invoke-static {v2}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v13

    aput-object v13, v11, v12

    invoke-static {v10, v11}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v10

    iput-object v10, v0, Lcom/netease/push/proto/ProtoClientWrapper$DevInfo;->screen:Ljava/lang/String;

    .line 242
    const-string v10, "android"

    iput-object v10, v0, Lcom/netease/push/proto/ProtoClientWrapper$DevInfo;->os:Ljava/lang/String;

    .line 243
    iput-object v6, v0, Lcom/netease/push/proto/ProtoClientWrapper$DevInfo;->osver:Ljava/lang/String;

    .line 244
    iput-object v4, v0, Lcom/netease/push/proto/ProtoClientWrapper$DevInfo;->mac:Ljava/lang/String;

    .line 245
    iget-object v10, p0, Lcom/netease/pushservice/PushServiceHelper;->m_serviceInfo:Lcom/netease/pushservice/PushServiceInfo;

    iget-object v11, p0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    invoke-virtual {v10, v11}, Lcom/netease/pushservice/PushServiceInfo;->createUUID(Landroid/content/Context;)Ljava/lang/String;

    move-result-object v10

    iput-object v10, v0, Lcom/netease/push/proto/ProtoClientWrapper$DevInfo;->id:Ljava/lang/String;

    .line 246
    sget-object v10, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v11, "SET_NEW_ID_TYPE"

    invoke-static {v10, v11}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 247
    invoke-virtual {p0}, Lcom/netease/pushservice/PushServiceHelper;->getNetwork()Lcom/netease/pushservice/Network;

    move-result-object v10

    invoke-virtual {v10, v14, v0}, Lcom/netease/pushservice/Network;->sendData(BLcom/netease/push/proto/ProtoClientWrapper$DataMarshal;)V

    .line 248
    return-void

    .line 234
    .end local v0    # "devInfo":Lcom/netease/push/proto/ProtoClientWrapper$DevInfo;
    .end local v3    # "info":Landroid/net/wifi/WifiInfo;
    :cond_1
    invoke-virtual {v8}, Landroid/net/wifi/WifiManager;->getConnectionInfo()Landroid/net/wifi/WifiInfo;

    move-result-object v3

    goto :goto_0

    .line 235
    .restart local v3    # "info":Landroid/net/wifi/WifiInfo;
    :cond_2
    invoke-virtual {v3}, Landroid/net/wifi/WifiInfo;->getMacAddress()Ljava/lang/String;

    move-result-object v4

    goto :goto_1
.end method

.method public static startActivePushService(Landroid/content/Context;Landroid/content/Intent;)V
    .locals 1
    .param p0, "context"    # Landroid/content/Context;
    .param p1, "intent"    # Landroid/content/Intent;

    .prologue
    .line 629
    const-class v0, Lcom/netease/pushservice/PushService;

    invoke-virtual {p1, p0, v0}, Landroid/content/Intent;->setClass(Landroid/content/Context;Ljava/lang/Class;)Landroid/content/Intent;

    .line 630
    invoke-virtual {p0, p1}, Landroid/content/Context;->startService(Landroid/content/Intent;)Landroid/content/ComponentName;

    .line 631
    return-void
.end method

.method public static startPushService(Landroid/content/Context;Landroid/content/Intent;)V
    .locals 1
    .param p0, "context"    # Landroid/content/Context;
    .param p1, "intent"    # Landroid/content/Intent;

    .prologue
    .line 622
    const-class v0, Lcom/netease/pushservice/PushService;

    invoke-virtual {p1, p0, v0}, Landroid/content/Intent;->setClass(Landroid/content/Context;Ljava/lang/Class;)Landroid/content/Intent;

    .line 624
    const/16 v0, 0x20

    invoke-virtual {p1, v0}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;

    .line 625
    invoke-virtual {p0, p1}, Landroid/content/Context;->startService(Landroid/content/Intent;)Landroid/content/ComponentName;

    .line 626
    return-void
.end method

.method private updateToken(Ljava/lang/String;)V
    .locals 4
    .param p1, "token"    # Ljava/lang/String;

    .prologue
    .line 211
    sget-object v1, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "updateToken, token:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 212
    iget-object v1, p0, Lcom/netease/pushservice/PushServiceHelper;->m_serviceInfo:Lcom/netease/pushservice/PushServiceInfo;

    iput-object p1, v1, Lcom/netease/pushservice/PushServiceInfo;->mDevId:Ljava/lang/String;

    .line 213
    iget-object v1, p0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    iget-object v2, p0, Lcom/netease/pushservice/PushServiceHelper;->m_serviceInfo:Lcom/netease/pushservice/PushServiceInfo;

    iget-object v2, v2, Lcom/netease/pushservice/PushServiceInfo;->mDevId:Ljava/lang/String;

    invoke-static {v1, v2}, Lcom/netease/push/utils/PushSetting;->setDevId(Landroid/content/Context;Ljava/lang/String;)V

    .line 215
    iget-object v1, p0, Lcom/netease/pushservice/PushServiceHelper;->m_packageAppInfoMap:Ljava/util/HashMap;

    invoke-virtual {v1}, Ljava/util/HashMap;->values()Ljava/util/Collection;

    move-result-object v1

    invoke-interface {v1}, Ljava/util/Collection;->iterator()Ljava/util/Iterator;

    move-result-object v1

    :goto_0
    invoke-interface {v1}, Ljava/util/Iterator;->hasNext()Z

    move-result v2

    if-nez v2, :cond_0

    .line 218
    invoke-virtual {p0}, Lcom/netease/pushservice/PushServiceHelper;->refreshToken()V

    .line 219
    iget-object v1, p0, Lcom/netease/pushservice/PushServiceHelper;->m_packageAppInfoMap:Ljava/util/HashMap;

    invoke-virtual {v1}, Ljava/util/HashMap;->values()Ljava/util/Collection;

    move-result-object v1

    invoke-interface {v1}, Ljava/util/Collection;->iterator()Ljava/util/Iterator;

    move-result-object v1

    :goto_1
    invoke-interface {v1}, Ljava/util/Iterator;->hasNext()Z

    move-result v2

    if-nez v2, :cond_1

    .line 222
    return-void

    .line 215
    :cond_0
    invoke-interface {v1}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Lcom/netease/push/utils/AppInfo;

    .line 216
    .local v0, "appInfo":Lcom/netease/push/utils/AppInfo;
    invoke-direct {p0, v0}, Lcom/netease/pushservice/PushServiceHelper;->checkFirstStart(Lcom/netease/push/utils/AppInfo;)V

    goto :goto_0

    .line 219
    .end local v0    # "appInfo":Lcom/netease/push/utils/AppInfo;
    :cond_1
    invoke-interface {v1}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Lcom/netease/push/utils/AppInfo;

    .line 220
    .restart local v0    # "appInfo":Lcom/netease/push/utils/AppInfo;
    iget-object v2, v0, Lcom/netease/push/utils/AppInfo;->mPackageName:Ljava/lang/String;

    invoke-direct {p0, v2}, Lcom/netease/pushservice/PushServiceHelper;->registerToServer(Ljava/lang/String;)V

    goto :goto_1
.end method


# virtual methods
.method public connect(Z)V
    .locals 3
    .param p1, "bSync"    # Z

    .prologue
    .line 567
    sget-object v0, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "connect, bSync:"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(Z)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 568
    if-eqz p1, :cond_0

    .line 570
    invoke-virtual {p0}, Lcom/netease/pushservice/PushServiceHelper;->getNetwork()Lcom/netease/pushservice/Network;

    move-result-object v0

    const/4 v1, 0x1

    invoke-virtual {v0, v1}, Lcom/netease/pushservice/Network;->setEnable(Z)V

    .line 571
    invoke-virtual {p0}, Lcom/netease/pushservice/PushServiceHelper;->getNetwork()Lcom/netease/pushservice/Network;

    move-result-object v0

    iget-object v1, p0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    invoke-virtual {v0, v1}, Lcom/netease/pushservice/Network;->connectAuto(Landroid/content/Context;)V

    .line 583
    :goto_0
    return-void

    .line 574
    :cond_0
    iget-object v0, p0, Lcom/netease/pushservice/PushServiceHelper;->m_taskSubmitter:Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;

    new-instance v1, Lcom/netease/pushservice/PushServiceHelper$3;

    invoke-direct {v1, p0}, Lcom/netease/pushservice/PushServiceHelper$3;-><init>(Lcom/netease/pushservice/PushServiceHelper;)V

    invoke-virtual {v0, v1}, Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;->submit(Ljava/lang/Runnable;)Ljava/util/concurrent/Future;

    goto :goto_0
.end method

.method public disconnect()V
    .locals 2

    .prologue
    .line 586
    sget-object v0, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v1, "disconnect..."

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 587
    iget-object v0, p0, Lcom/netease/pushservice/PushServiceHelper;->m_taskSubmitter:Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;

    new-instance v1, Lcom/netease/pushservice/PushServiceHelper$4;

    invoke-direct {v1, p0}, Lcom/netease/pushservice/PushServiceHelper$4;-><init>(Lcom/netease/pushservice/PushServiceHelper;)V

    invoke-virtual {v0, v1}, Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;->submit(Ljava/lang/Runnable;)Ljava/util/concurrent/Future;

    .line 594
    return-void
.end method

.method public getNetwork()Lcom/netease/pushservice/Network;
    .locals 1

    .prologue
    .line 563
    iget-object v0, p0, Lcom/netease/pushservice/PushServiceHelper;->m_network:Lcom/netease/pushservice/Network;

    return-object v0
.end method

.method public getNotificationServiceInfo()Lcom/netease/pushservice/PushServiceInfo;
    .locals 1

    .prologue
    .line 597
    iget-object v0, p0, Lcom/netease/pushservice/PushServiceHelper;->m_serviceInfo:Lcom/netease/pushservice/PushServiceInfo;

    return-object v0
.end method

.method public getTaskSubmitter()Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;
    .locals 1

    .prologue
    .line 559
    iget-object v0, p0, Lcom/netease/pushservice/PushServiceHelper;->m_taskSubmitter:Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;

    return-object v0
.end method

.method public handlePush(Lcom/netease/push/proto/ProtoClientWrapper$Packet;)V
    .locals 25
    .param p1, "packet"    # Lcom/netease/push/proto/ProtoClientWrapper$Packet;

    .prologue
    .line 420
    sget-object v18, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v19, "handlePush"

    invoke-static/range {v18 .. v19}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 421
    new-instance v8, Ljava/util/HashMap;

    invoke-direct {v8}, Ljava/util/HashMap;-><init>()V

    .line 422
    .local v8, "gotTimeMap":Ljava/util/HashMap;, "Ljava/util/HashMap<Ljava/lang/String;Ljava/lang/Long;>;"
    const/4 v13, 0x0

    .line 424
    .local v13, "messageInfo":Lcom/netease/push/proto/ProtoClientWrapper$MessageInfo;
    :try_start_0
    move-object/from16 v0, p1

    iget-object v0, v0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->data:[B

    move-object/from16 v18, v0

    invoke-static/range {v18 .. v18}, Lcom/netease/push/proto/ProtoClientWrapper$MessageInfo;->unmarshalMessageInfo([B)Lcom/netease/push/proto/ProtoClientWrapper$MessageInfo;
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    move-result-object v13

    .line 430
    move-object/from16 v0, p0

    iget-object v0, v0, Lcom/netease/pushservice/PushServiceHelper;->m_serviceInfo:Lcom/netease/pushservice/PushServiceInfo;

    move-object/from16 v18, v0

    move-object/from16 v0, v18

    iget-object v0, v0, Lcom/netease/pushservice/PushServiceInfo;->mDevId:Ljava/lang/String;

    move-object/from16 v18, v0

    iget-object v0, v13, Lcom/netease/push/proto/ProtoClientWrapper$MessageInfo;->id:Ljava/lang/String;

    move-object/from16 v19, v0

    invoke-virtual/range {v18 .. v19}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v18

    if-nez v18, :cond_1

    .line 431
    sget-object v18, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v19, "deviceID mismatch:"

    invoke-static/range {v18 .. v19}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 432
    sget-object v18, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v19, Ljava/lang/StringBuilder;

    const-string v20, "got deviceID:"

    invoke-direct/range {v19 .. v20}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v0, v13, Lcom/netease/push/proto/ProtoClientWrapper$MessageInfo;->id:Ljava/lang/String;

    move-object/from16 v20, v0

    invoke-virtual/range {v19 .. v20}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v19

    invoke-virtual/range {v19 .. v19}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v19

    invoke-static/range {v18 .. v19}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 433
    sget-object v18, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v19, Ljava/lang/StringBuilder;

    const-string v20, " my deviceID:"

    invoke-direct/range {v19 .. v20}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    move-object/from16 v0, p0

    iget-object v0, v0, Lcom/netease/pushservice/PushServiceHelper;->m_serviceInfo:Lcom/netease/pushservice/PushServiceInfo;

    move-object/from16 v20, v0

    move-object/from16 v0, v20

    iget-object v0, v0, Lcom/netease/pushservice/PushServiceInfo;->mDevId:Ljava/lang/String;

    move-object/from16 v20, v0

    invoke-virtual/range {v19 .. v20}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v19

    invoke-virtual/range {v19 .. v19}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v19

    invoke-static/range {v18 .. v19}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 526
    :cond_0
    :goto_0
    return-void

    .line 425
    :catch_0
    move-exception v6

    .line 426
    .local v6, "e":Ljava/lang/Exception;
    sget-object v18, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v19, "unmarshalMessageInfo exception"

    invoke-static/range {v18 .. v19}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 427
    invoke-virtual {v6}, Ljava/lang/Exception;->printStackTrace()V

    goto :goto_0

    .line 437
    .end local v6    # "e":Ljava/lang/Exception;
    :cond_1
    iget-object v0, v13, Lcom/netease/push/proto/ProtoClientWrapper$MessageInfo;->messages:[Lcom/netease/push/proto/ProtoClientWrapper$Message;

    move-object/from16 v19, v0

    move-object/from16 v0, v19

    array-length v0, v0

    move/from16 v20, v0

    const/16 v18, 0x0

    :goto_1
    move/from16 v0, v18

    move/from16 v1, v20

    if-lt v0, v1, :cond_2

    .line 504
    invoke-virtual {v8}, Ljava/util/HashMap;->size()I

    move-result v18

    if-lez v18, :cond_0

    .line 505
    new-instance v5, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;

    invoke-direct {v5}, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;-><init>()V

    .line 506
    .local v5, "devServiceInfos":Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;
    move-object/from16 v0, p0

    iget-object v0, v0, Lcom/netease/pushservice/PushServiceHelper;->m_serviceInfo:Lcom/netease/pushservice/PushServiceInfo;

    move-object/from16 v18, v0

    move-object/from16 v0, v18

    iget-object v0, v0, Lcom/netease/pushservice/PushServiceInfo;->mDevId:Ljava/lang/String;

    move-object/from16 v18, v0

    move-object/from16 v0, v18

    iput-object v0, v5, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;->id:Ljava/lang/String;

    .line 507
    const-string v18, "8"

    move-object/from16 v0, v18

    iput-object v0, v5, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;->ver:Ljava/lang/String;

    .line 508
    invoke-virtual {v8}, Ljava/util/HashMap;->size()I

    move-result v18

    move/from16 v0, v18

    new-array v0, v0, [Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;

    move-object/from16 v18, v0

    move-object/from16 v0, v18

    iput-object v0, v5, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;->serviceInfos:[Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;

    .line 509
    const/4 v4, 0x0

    .line 510
    .local v4, "count":I
    invoke-virtual {v8}, Ljava/util/HashMap;->entrySet()Ljava/util/Set;

    move-result-object v18

    invoke-interface/range {v18 .. v18}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v10

    .line 511
    .local v10, "iter":Ljava/util/Iterator;, "Ljava/util/Iterator<Ljava/util/Map$Entry<Ljava/lang/String;Ljava/lang/Long;>;>;"
    :goto_2
    invoke-interface {v10}, Ljava/util/Iterator;->hasNext()Z

    move-result v18

    if-nez v18, :cond_a

    .line 523
    sget-object v18, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v19, "GOT_TIME_TYPE"

    invoke-static/range {v18 .. v19}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 524
    invoke-virtual/range {p0 .. p0}, Lcom/netease/pushservice/PushServiceHelper;->getNetwork()Lcom/netease/pushservice/Network;

    move-result-object v18

    const/16 v19, 0x5

    move-object/from16 v0, v18

    move/from16 v1, v19

    invoke-virtual {v0, v1, v5}, Lcom/netease/pushservice/Network;->sendData(BLcom/netease/push/proto/ProtoClientWrapper$DataMarshal;)V

    goto :goto_0

    .line 437
    .end local v4    # "count":I
    .end local v5    # "devServiceInfos":Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;
    .end local v10    # "iter":Ljava/util/Iterator;, "Ljava/util/Iterator<Ljava/util/Map$Entry<Ljava/lang/String;Ljava/lang/Long;>;>;"
    :cond_2
    aget-object v12, v19, v18

    .line 438
    .local v12, "message":Lcom/netease/push/proto/ProtoClientWrapper$Message;
    sget-object v21, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v22, "got a message"

    invoke-static/range {v21 .. v22}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 439
    sget-object v21, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v22, Ljava/lang/StringBuilder;

    const-string v23, "message.service:"

    invoke-direct/range {v22 .. v23}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v0, v12, Lcom/netease/push/proto/ProtoClientWrapper$Message;->service:Ljava/lang/String;

    move-object/from16 v23, v0

    invoke-virtual/range {v22 .. v23}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v22

    invoke-virtual/range {v22 .. v22}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v22

    invoke-static/range {v21 .. v22}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 440
    sget-object v21, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v22, Ljava/lang/StringBuilder;

    const-string v23, "message.packagename:"

    invoke-direct/range {v22 .. v23}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v0, v12, Lcom/netease/push/proto/ProtoClientWrapper$Message;->packagename:Ljava/lang/String;

    move-object/from16 v23, v0

    invoke-virtual/range {v22 .. v23}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v22

    invoke-virtual/range {v22 .. v22}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v22

    invoke-static/range {v21 .. v22}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 441
    sget-object v21, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v22, Ljava/lang/StringBuilder;

    const-string v23, "message.title:"

    invoke-direct/range {v22 .. v23}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v0, v12, Lcom/netease/push/proto/ProtoClientWrapper$Message;->title:Ljava/lang/String;

    move-object/from16 v23, v0

    invoke-virtual/range {v22 .. v23}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v22

    invoke-virtual/range {v22 .. v22}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v22

    invoke-static/range {v21 .. v22}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 442
    sget-object v21, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v22, Ljava/lang/StringBuilder;

    const-string v23, "message.content:"

    invoke-direct/range {v22 .. v23}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v0, v12, Lcom/netease/push/proto/ProtoClientWrapper$Message;->content:Ljava/lang/String;

    move-object/from16 v23, v0

    invoke-virtual/range {v22 .. v23}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v22

    invoke-virtual/range {v22 .. v22}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v22

    invoke-static/range {v21 .. v22}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 443
    sget-object v21, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v22, Ljava/lang/StringBuilder;

    const-string v23, "message.ext:"

    invoke-direct/range {v22 .. v23}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v0, v12, Lcom/netease/push/proto/ProtoClientWrapper$Message;->ext:Ljava/lang/String;

    move-object/from16 v23, v0

    invoke-virtual/range {v22 .. v23}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v22

    invoke-virtual/range {v22 .. v22}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v22

    invoke-static/range {v21 .. v22}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 444
    sget-object v21, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v22, Ljava/lang/StringBuilder;

    const-string v23, "message.time:"

    invoke-direct/range {v22 .. v23}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-wide v0, v12, Lcom/netease/push/proto/ProtoClientWrapper$Message;->time:J

    move-wide/from16 v23, v0

    invoke-virtual/range {v22 .. v24}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;

    move-result-object v22

    invoke-virtual/range {v22 .. v22}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v22

    invoke-static/range {v21 .. v22}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 445
    sget-object v21, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v22, Ljava/lang/StringBuilder;

    const-string v23, "message:"

    invoke-direct/range {v22 .. v23}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    move-object/from16 v0, v22

    invoke-virtual {v0, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v22

    invoke-virtual/range {v22 .. v22}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v22

    invoke-static/range {v21 .. v22}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 446
    iget-object v15, v12, Lcom/netease/push/proto/ProtoClientWrapper$Message;->service:Ljava/lang/String;

    .line 447
    .local v15, "packageName":Ljava/lang/String;
    invoke-static {v15}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v21

    if-eqz v21, :cond_3

    .line 448
    sget-object v21, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v22, "message.service is empty"

    invoke-static/range {v21 .. v22}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 437
    :goto_3
    add-int/lit8 v18, v18, 0x1

    goto/16 :goto_1

    .line 452
    :cond_3
    invoke-virtual {v8, v15}, Ljava/util/HashMap;->containsKey(Ljava/lang/Object;)Z

    move-result v21

    if-eqz v21, :cond_5

    .line 453
    invoke-virtual {v8, v15}, Ljava/util/HashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v11

    check-cast v11, Ljava/lang/Long;

    .line 454
    .local v11, "lastTime":Ljava/lang/Long;
    invoke-virtual {v11}, Ljava/lang/Long;->longValue()J

    move-result-wide v21

    iget-wide v0, v12, Lcom/netease/push/proto/ProtoClientWrapper$Message;->time:J

    move-wide/from16 v23, v0

    cmp-long v21, v21, v23

    if-gez v21, :cond_4

    .line 455
    iget-wide v0, v12, Lcom/netease/push/proto/ProtoClientWrapper$Message;->time:J

    move-wide/from16 v21, v0

    invoke-static/range {v21 .. v22}, Ljava/lang/Long;->valueOf(J)Ljava/lang/Long;

    move-result-object v21

    move-object/from16 v0, v21

    invoke-virtual {v8, v15, v0}, Ljava/util/HashMap;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 461
    .end local v11    # "lastTime":Ljava/lang/Long;
    :cond_4
    :goto_4
    move-object/from16 v0, p0

    iget-object v0, v0, Lcom/netease/pushservice/PushServiceHelper;->m_packageAppInfoMap:Ljava/util/HashMap;

    move-object/from16 v21, v0

    move-object/from16 v0, v21

    invoke-virtual {v0, v15}, Ljava/util/HashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v3

    check-cast v3, Lcom/netease/push/utils/AppInfo;

    .line 462
    .local v3, "appInfo":Lcom/netease/push/utils/AppInfo;
    if-nez v3, :cond_6

    .line 463
    sget-object v21, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v22, Ljava/lang/StringBuilder;

    const-string v23, "not registered service:"

    invoke-direct/range {v22 .. v23}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    move-object/from16 v0, v22

    invoke-virtual {v0, v15}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v22

    invoke-virtual/range {v22 .. v22}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v22

    invoke-static/range {v21 .. v22}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    goto :goto_3

    .line 458
    .end local v3    # "appInfo":Lcom/netease/push/utils/AppInfo;
    :cond_5
    iget-wide v0, v12, Lcom/netease/push/proto/ProtoClientWrapper$Message;->time:J

    move-wide/from16 v21, v0

    invoke-static/range {v21 .. v22}, Ljava/lang/Long;->valueOf(J)Ljava/lang/Long;

    move-result-object v21

    move-object/from16 v0, v21

    invoke-virtual {v8, v15, v0}, Ljava/util/HashMap;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    goto :goto_4

    .line 467
    .restart local v3    # "appInfo":Lcom/netease/push/utils/AppInfo;
    :cond_6
    iget-wide v0, v3, Lcom/netease/push/utils/AppInfo;->mLastReceiveTime:J

    move-wide/from16 v21, v0

    iget-wide v0, v12, Lcom/netease/push/proto/ProtoClientWrapper$Message;->time:J

    move-wide/from16 v23, v0

    cmp-long v21, v21, v23

    if-ltz v21, :cond_7

    .line 468
    sget-object v21, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v22, "message is out of date:"

    invoke-static/range {v21 .. v22}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 469
    sget-object v21, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v22, Ljava/lang/StringBuilder;

    const-string v23, "appInfo.mLastReceiveTime:"

    invoke-direct/range {v22 .. v23}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-wide v0, v3, Lcom/netease/push/utils/AppInfo;->mLastReceiveTime:J

    move-wide/from16 v23, v0

    invoke-virtual/range {v22 .. v24}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;

    move-result-object v22

    invoke-virtual/range {v22 .. v22}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v22

    invoke-static/range {v21 .. v22}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 470
    sget-object v21, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v22, Ljava/lang/StringBuilder;

    const-string v23, "message.time:"

    invoke-direct/range {v22 .. v23}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-wide v0, v12, Lcom/netease/push/proto/ProtoClientWrapper$Message;->time:J

    move-wide/from16 v23, v0

    invoke-virtual/range {v22 .. v24}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;

    move-result-object v22

    invoke-virtual/range {v22 .. v22}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v22

    invoke-static/range {v21 .. v22}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    goto/16 :goto_3

    .line 474
    :cond_7
    iget-object v0, v12, Lcom/netease/push/proto/ProtoClientWrapper$Message;->packagename:Ljava/lang/String;

    move-object/from16 v21, v0

    invoke-static/range {v21 .. v21}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v21

    if-nez v21, :cond_8

    iget-object v0, v12, Lcom/netease/push/proto/ProtoClientWrapper$Message;->packagename:Ljava/lang/String;

    move-object/from16 v21, v0

    iget-object v0, v3, Lcom/netease/push/utils/AppInfo;->mPackageName:Ljava/lang/String;

    move-object/from16 v22, v0

    invoke-virtual/range {v21 .. v22}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v21

    if-nez v21, :cond_8

    .line 475
    sget-object v21, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v22, "packagename mismatch:"

    invoke-static/range {v21 .. v22}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 476
    sget-object v21, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v22, Ljava/lang/StringBuilder;

    const-string v23, "message.packagename:"

    invoke-direct/range {v22 .. v23}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v0, v12, Lcom/netease/push/proto/ProtoClientWrapper$Message;->packagename:Ljava/lang/String;

    move-object/from16 v23, v0

    invoke-virtual/range {v22 .. v23}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v22

    invoke-virtual/range {v22 .. v22}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v22

    invoke-static/range {v21 .. v22}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 477
    sget-object v21, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v22, Ljava/lang/StringBuilder;

    const-string v23, "appInfo.mPackageName:"

    invoke-direct/range {v22 .. v23}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v0, v3, Lcom/netease/push/utils/AppInfo;->mPackageName:Ljava/lang/String;

    move-object/from16 v23, v0

    invoke-virtual/range {v22 .. v23}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v22

    invoke-virtual/range {v22 .. v22}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v22

    invoke-static/range {v21 .. v22}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    goto/16 :goto_3

    .line 481
    :cond_8
    invoke-virtual {v3, v12}, Lcom/netease/push/utils/AppInfo;->filterMessage(Lcom/netease/push/proto/ProtoClientWrapper$Message;)Z

    move-result v21

    if-eqz v21, :cond_9

    .line 482
    sget-object v21, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v22, "message is filtered"

    invoke-static/range {v21 .. v22}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    goto/16 :goto_3

    .line 485
    :cond_9
    new-instance v14, Lcom/netease/push/utils/NotifyMessage;

    iget-object v0, v12, Lcom/netease/push/proto/ProtoClientWrapper$Message;->content:Ljava/lang/String;

    move-object/from16 v21, v0

    iget-object v0, v12, Lcom/netease/push/proto/ProtoClientWrapper$Message;->title:Ljava/lang/String;

    move-object/from16 v22, v0

    iget-object v0, v12, Lcom/netease/push/proto/ProtoClientWrapper$Message;->ext:Ljava/lang/String;

    move-object/from16 v23, v0

    move-object/from16 v0, v21

    move-object/from16 v1, v22

    move-object/from16 v2, v23

    invoke-direct {v14, v0, v1, v2}, Lcom/netease/push/utils/NotifyMessage;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 486
    .local v14, "notifyMessage":Lcom/netease/push/utils/NotifyMessage;
    invoke-static {}, Lcom/netease/inner/pushclient/PushClientReceiver;->createMessageIntent()Landroid/content/Intent;

    move-result-object v9

    .line 487
    .local v9, "intent":Landroid/content/Intent;
    const-string v16, ""

    .line 489
    .local v16, "sMessage":Ljava/lang/String;
    :try_start_1
    invoke-virtual {v14}, Lcom/netease/push/utils/NotifyMessage;->writeToJsonString()Ljava/lang/String;
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_1

    move-result-object v16

    .line 495
    const-string v21, "message"

    move-object/from16 v0, v21

    move-object/from16 v1, v16

    invoke-virtual {v9, v0, v1}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 497
    const-string v21, "lasttime"

    iget-wide v0, v12, Lcom/netease/push/proto/ProtoClientWrapper$Message;->time:J

    move-wide/from16 v22, v0

    move-object/from16 v0, v21

    move-wide/from16 v1, v22

    invoke-virtual {v9, v0, v1, v2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;J)Landroid/content/Intent;

    .line 498
    invoke-virtual {v9, v15}, Landroid/content/Intent;->setPackage(Ljava/lang/String;)Landroid/content/Intent;

    .line 499
    sget-object v21, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v22, "handlePush, sendBroadcast"

    invoke-static/range {v21 .. v22}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 500
    move-object/from16 v0, p0

    iget-object v0, v0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    move-object/from16 v21, v0

    move-object/from16 v0, v21

    invoke-virtual {v0, v9}, Lcom/netease/pushservice/PushService;->sendBroadcast(Landroid/content/Intent;)V

    goto/16 :goto_3

    .line 490
    :catch_1
    move-exception v6

    .line 491
    .restart local v6    # "e":Ljava/lang/Exception;
    sget-object v18, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v19, "writeToJsonString exception"

    invoke-static/range {v18 .. v19}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 492
    invoke-virtual {v6}, Ljava/lang/Exception;->printStackTrace()V

    goto/16 :goto_0

    .line 512
    .end local v3    # "appInfo":Lcom/netease/push/utils/AppInfo;
    .end local v6    # "e":Ljava/lang/Exception;
    .end local v9    # "intent":Landroid/content/Intent;
    .end local v12    # "message":Lcom/netease/push/proto/ProtoClientWrapper$Message;
    .end local v14    # "notifyMessage":Lcom/netease/push/utils/NotifyMessage;
    .end local v15    # "packageName":Ljava/lang/String;
    .end local v16    # "sMessage":Ljava/lang/String;
    .restart local v4    # "count":I
    .restart local v5    # "devServiceInfos":Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;
    .restart local v10    # "iter":Ljava/util/Iterator;, "Ljava/util/Iterator<Ljava/util/Map$Entry<Ljava/lang/String;Ljava/lang/Long;>;>;"
    :cond_a
    invoke-interface {v10}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v7

    check-cast v7, Ljava/util/Map$Entry;

    .line 513
    .local v7, "entry":Ljava/util/Map$Entry;, "Ljava/util/Map$Entry<Ljava/lang/String;Ljava/lang/Long;>;"
    new-instance v17, Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;

    invoke-direct/range {v17 .. v17}, Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;-><init>()V

    .line 514
    .local v17, "serviceInfo":Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;
    invoke-interface {v7}, Ljava/util/Map$Entry;->getKey()Ljava/lang/Object;

    move-result-object v18

    check-cast v18, Ljava/lang/String;

    move-object/from16 v0, v18

    move-object/from16 v1, v17

    iput-object v0, v1, Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;->service:Ljava/lang/String;

    .line 515
    invoke-interface {v7}, Ljava/util/Map$Entry;->getValue()Ljava/lang/Object;

    move-result-object v18

    check-cast v18, Ljava/lang/Long;

    invoke-virtual/range {v18 .. v18}, Ljava/lang/Long;->longValue()J

    move-result-wide v18

    move-wide/from16 v0, v18

    move-object/from16 v2, v17

    iput-wide v0, v2, Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;->time:J

    .line 516
    sget-object v18, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v19, Ljava/lang/StringBuilder;

    const-string v20, "service:"

    invoke-direct/range {v19 .. v20}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    move-object/from16 v0, v17

    iget-object v0, v0, Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;->service:Ljava/lang/String;

    move-object/from16 v20, v0

    invoke-virtual/range {v19 .. v20}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v19

    invoke-virtual/range {v19 .. v19}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v19

    invoke-static/range {v18 .. v19}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 517
    sget-object v18, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v19, Ljava/lang/StringBuilder;

    const-string v20, "latest push time:"

    invoke-direct/range {v19 .. v20}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    move-object/from16 v0, v17

    iget-wide v0, v0, Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;->time:J

    move-wide/from16 v20, v0

    invoke-virtual/range {v19 .. v21}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;

    move-result-object v19

    invoke-virtual/range {v19 .. v19}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v19

    invoke-static/range {v18 .. v19}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 518
    iget-object v0, v5, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;->serviceInfos:[Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;

    move-object/from16 v18, v0

    aput-object v17, v18, v4

    .line 519
    add-int/lit8 v4, v4, 0x1

    .line 520
    move-object/from16 v0, p0

    iget-object v0, v0, Lcom/netease/pushservice/PushServiceHelper;->m_packageAppInfoMap:Ljava/util/HashMap;

    move-object/from16 v18, v0

    move-object/from16 v0, v17

    iget-object v0, v0, Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;->service:Ljava/lang/String;

    move-object/from16 v19, v0

    invoke-virtual/range {v18 .. v19}, Ljava/util/HashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v3

    check-cast v3, Lcom/netease/push/utils/AppInfo;

    .line 521
    .restart local v3    # "appInfo":Lcom/netease/push/utils/AppInfo;
    move-object/from16 v0, v17

    iget-wide v0, v0, Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;->time:J

    move-wide/from16 v18, v0

    move-wide/from16 v0, v18

    iput-wide v0, v3, Lcom/netease/push/utils/AppInfo;->mLastReceiveTime:J

    goto/16 :goto_2
.end method

.method public init(Lcom/netease/pushservice/PushService;)Z
    .locals 18
    .param p1, "pushService"    # Lcom/netease/pushservice/PushService;

    .prologue
    .line 77
    sget-object v13, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v14, "init"

    invoke-static {v13, v14}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 78
    sget-object v13, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v14, Ljava/lang/StringBuilder;

    const-string v15, "pushService:"

    invoke-direct {v14, v15}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    move-object/from16 v0, p1

    invoke-virtual {v14, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v14

    invoke-virtual {v14}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v14

    invoke-static {v13, v14}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 79
    if-nez p1, :cond_0

    .line 80
    const/4 v13, 0x0

    .line 144
    :goto_0
    return v13

    .line 82
    :cond_0
    new-instance v13, Lcom/netease/pushservice/Network;

    invoke-direct {v13}, Lcom/netease/pushservice/Network;-><init>()V

    move-object/from16 v0, p0

    iput-object v13, v0, Lcom/netease/pushservice/PushServiceHelper;->m_network:Lcom/netease/pushservice/Network;

    .line 83
    move-object/from16 v0, p1

    move-object/from16 v1, p0

    iput-object v0, v1, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    .line 84
    move-object/from16 v0, p0

    iget-object v13, v0, Lcom/netease/pushservice/PushServiceHelper;->m_serviceInfo:Lcom/netease/pushservice/PushServiceInfo;

    move-object/from16 v0, p0

    iget-object v14, v0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    invoke-static {v14}, Lcom/netease/push/utils/PushSetting;->getDevID(Landroid/content/Context;)Ljava/lang/String;

    move-result-object v14

    iput-object v14, v13, Lcom/netease/pushservice/PushServiceInfo;->mDevId:Ljava/lang/String;

    .line 86
    move-object/from16 v0, p0

    iget-object v13, v0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    invoke-virtual {v13}, Lcom/netease/pushservice/PushService;->getPackageName()Ljava/lang/String;

    move-result-object v3

    .line 87
    .local v3, "contextpkg":Ljava/lang/String;
    const/16 v4, 0x8

    .line 88
    .local v4, "contextver":I
    sget-object v13, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v14, Ljava/lang/StringBuilder;

    const-string v15, "contextpkg:"

    invoke-direct {v14, v15}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v14, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v14

    invoke-virtual {v14}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v14

    invoke-static {v13, v14}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 89
    sget-object v13, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v14, Ljava/lang/StringBuilder;

    const-string v15, "contextver:"

    invoke-direct {v14, v15}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v14, v4}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v14

    invoke-virtual {v14}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v14

    invoke-static {v13, v14}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 91
    move-object/from16 v0, p0

    iget-object v13, v0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    invoke-static {v13}, Lcom/netease/push/utils/PushSetting;->getPackages(Landroid/content/Context;)Ljava/util/Set;

    move-result-object v10

    .line 92
    .local v10, "packageSet":Ljava/util/Set;, "Ljava/util/Set<Ljava/lang/String;>;"
    sget-object v13, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v14, Ljava/lang/StringBuilder;

    const-string v15, "packageSet:"

    invoke-direct {v14, v15}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v14, v10}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v14

    invoke-virtual {v14}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v14

    invoke-static {v13, v14}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 93
    if-eqz v10, :cond_2

    .line 94
    move-object/from16 v0, p0

    iget-object v13, v0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    invoke-virtual {v13}, Lcom/netease/pushservice/PushService;->getPackageManager()Landroid/content/pm/PackageManager;

    move-result-object v13

    const/4 v14, 0x0

    invoke-virtual {v13, v14}, Landroid/content/pm/PackageManager;->getInstalledPackages(I)Ljava/util/List;

    move-result-object v8

    .line 95
    .local v8, "packageList":Ljava/util/List;, "Ljava/util/List<Landroid/content/pm/PackageInfo;>;"
    invoke-interface {v8}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v13

    :cond_1
    :goto_1
    invoke-interface {v13}, Ljava/util/Iterator;->hasNext()Z

    move-result v14

    if-nez v14, :cond_3

    .line 109
    move-object/from16 v0, p0

    iget-object v13, v0, Lcom/netease/pushservice/PushServiceHelper;->m_packageAppInfoMap:Ljava/util/HashMap;

    invoke-virtual {v13}, Ljava/util/HashMap;->size()I

    move-result v13

    invoke-interface {v10}, Ljava/util/Set;->size()I

    move-result v14

    if-eq v13, v14, :cond_2

    .line 110
    move-object/from16 v0, p0

    iget-object v13, v0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    move-object/from16 v0, p0

    iget-object v14, v0, Lcom/netease/pushservice/PushServiceHelper;->m_packageAppInfoMap:Ljava/util/HashMap;

    invoke-virtual {v14}, Ljava/util/HashMap;->keySet()Ljava/util/Set;

    move-result-object v14

    invoke-static {v13, v14}, Lcom/netease/push/utils/PushSetting;->setPackages(Landroid/content/Context;Ljava/util/Set;)V

    .line 113
    .end local v8    # "packageList":Ljava/util/List;, "Ljava/util/List<Landroid/content/pm/PackageInfo;>;"
    :cond_2
    move-object/from16 v0, p0

    iget-object v13, v0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    invoke-static {v13}, Lcom/netease/push/utils/PushSetting;->getCurPkg(Landroid/content/Context;)Ljava/lang/String;

    move-result-object v11

    .line 114
    .local v11, "runningpkg":Ljava/lang/String;
    move-object/from16 v0, p0

    iget-object v13, v0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    invoke-static {v13}, Lcom/netease/push/utils/PushSetting;->getCurVerCode(Landroid/content/Context;)I

    move-result v12

    .line 115
    .local v12, "runningver":I
    sget-object v13, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v14, Ljava/lang/StringBuilder;

    const-string v15, "runningpkg:"

    invoke-direct {v14, v15}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v14, v11}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v14

    invoke-virtual {v14}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v14

    invoke-static {v13, v14}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 116
    sget-object v13, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v14, Ljava/lang/StringBuilder;

    const-string v15, "runningver:"

    invoke-direct {v14, v15}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v14, v12}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v14

    invoke-virtual {v14}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v14

    invoke-static {v13, v14}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 117
    invoke-virtual {v3, v11}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v13

    if-nez v13, :cond_4

    .line 118
    sget-object v13, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v14, "incorrect service started"

    invoke-static {v13, v14}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 119
    sget-object v13, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v14, Ljava/lang/StringBuilder;

    const-string v15, "contextpkg:"

    invoke-direct {v14, v15}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v14, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v14

    invoke-virtual {v14}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v14

    invoke-static {v13, v14}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 120
    sget-object v13, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v14, Ljava/lang/StringBuilder;

    const-string v15, "runningpkg:"

    invoke-direct {v14, v15}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v14, v11}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v14

    invoke-virtual {v14}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v14

    invoke-static {v13, v14}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 121
    invoke-virtual/range {p1 .. p1}, Lcom/netease/pushservice/PushService;->stop()V

    .line 122
    const/4 v13, 0x0

    goto/16 :goto_0

    .line 95
    .end local v11    # "runningpkg":Ljava/lang/String;
    .end local v12    # "runningver":I
    .restart local v8    # "packageList":Ljava/util/List;, "Ljava/util/List<Landroid/content/pm/PackageInfo;>;"
    :cond_3
    invoke-interface {v13}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v7

    check-cast v7, Landroid/content/pm/PackageInfo;

    .line 96
    .local v7, "packageInfo":Landroid/content/pm/PackageInfo;
    iget-object v9, v7, Landroid/content/pm/PackageInfo;->packageName:Ljava/lang/String;

    .line 97
    .local v9, "packageName":Ljava/lang/String;
    invoke-interface {v10, v9}, Ljava/util/Set;->contains(Ljava/lang/Object;)Z

    move-result v14

    if-eqz v14, :cond_1

    .line 98
    sget-object v14, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v15, Ljava/lang/StringBuilder;

    const-string v16, "read package:"

    invoke-direct/range {v15 .. v16}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v15, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v15

    invoke-virtual {v15}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v15

    invoke-static {v14, v15}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 99
    move-object/from16 v0, p0

    iget-object v14, v0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    invoke-static {v14, v9}, Lcom/netease/push/utils/PushSetting;->getOtherAppInfo(Landroid/content/Context;Ljava/lang/String;)Lcom/netease/push/utils/AppInfo;

    move-result-object v2

    .line 100
    .local v2, "appInfo":Lcom/netease/push/utils/AppInfo;
    sget-object v14, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v15, Ljava/lang/StringBuilder;

    const-string v16, "appInfo.mbFirstStart:"

    invoke-direct/range {v15 .. v16}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-boolean v0, v2, Lcom/netease/push/utils/AppInfo;->mbFirstStart:Z

    move/from16 v16, v0

    invoke-virtual/range {v15 .. v16}, Ljava/lang/StringBuilder;->append(Z)Ljava/lang/StringBuilder;

    move-result-object v15

    invoke-virtual {v15}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v15

    invoke-static {v14, v15}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 101
    if-eqz v2, :cond_1

    .line 104
    move-object/from16 v0, p0

    iget-object v14, v0, Lcom/netease/pushservice/PushServiceHelper;->m_packageAppInfoMap:Ljava/util/HashMap;

    invoke-virtual {v14, v9, v2}, Ljava/util/HashMap;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 105
    sget-object v14, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v15, Ljava/lang/StringBuilder;

    const-string v16, "put package:"

    invoke-direct/range {v15 .. v16}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v15, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v15

    invoke-virtual {v15}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v15

    invoke-static {v14, v15}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    goto/16 :goto_1

    .line 124
    .end local v2    # "appInfo":Lcom/netease/push/utils/AppInfo;
    .end local v7    # "packageInfo":Landroid/content/pm/PackageInfo;
    .end local v8    # "packageList":Ljava/util/List;, "Ljava/util/List<Landroid/content/pm/PackageInfo;>;"
    .end local v9    # "packageName":Ljava/lang/String;
    .restart local v11    # "runningpkg":Ljava/lang/String;
    .restart local v12    # "runningver":I
    :cond_4
    move-object/from16 v0, p0

    iget-object v13, v0, Lcom/netease/pushservice/PushServiceHelper;->m_packageAppInfoMap:Ljava/util/HashMap;

    invoke-virtual {v13}, Ljava/util/HashMap;->values()Ljava/util/Collection;

    move-result-object v13

    invoke-interface {v13}, Ljava/util/Collection;->iterator()Ljava/util/Iterator;

    move-result-object v13

    :cond_5
    invoke-interface {v13}, Ljava/util/Iterator;->hasNext()Z

    move-result v14

    if-nez v14, :cond_6

    .line 143
    const/4 v13, 0x0

    move-object/from16 v0, p0

    invoke-virtual {v0, v13}, Lcom/netease/pushservice/PushServiceHelper;->connect(Z)V

    .line 144
    const/4 v13, 0x1

    goto/16 :goto_0

    .line 124
    :cond_6
    invoke-interface {v13}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/push/utils/AppInfo;

    .line 125
    .restart local v2    # "appInfo":Lcom/netease/push/utils/AppInfo;
    sget-object v14, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v15, Ljava/lang/StringBuilder;

    const-string v16, "appInfo.mPackageName:"

    invoke-direct/range {v15 .. v16}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v0, v2, Lcom/netease/push/utils/AppInfo;->mPackageName:Ljava/lang/String;

    move-object/from16 v16, v0

    invoke-virtual/range {v15 .. v16}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v15

    invoke-virtual {v15}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v15

    invoke-static {v14, v15}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 126
    move-object/from16 v0, p0

    iget-object v14, v0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    iget-object v15, v2, Lcom/netease/push/utils/AppInfo;->mPackageName:Ljava/lang/String;

    invoke-static {v14, v15}, Lcom/netease/push/utils/PushSetting;->getOtherAllNativeNotification(Landroid/content/Context;Ljava/lang/String;)Ljava/util/List;

    move-result-object v6

    .line 127
    .local v6, "nativePushDatas":Ljava/util/List;, "Ljava/util/List<Lcom/netease/inner/pushclient/NativePushData;>;"
    if-eqz v6, :cond_5

    .line 128
    iget-object v14, v2, Lcom/netease/push/utils/AppInfo;->mPackageName:Ljava/lang/String;

    invoke-virtual {v14, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v14

    if-eqz v14, :cond_7

    .line 129
    invoke-interface {v6}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v14

    :goto_2
    invoke-interface {v14}, Ljava/util/Iterator;->hasNext()Z

    move-result v15

    if-eqz v15, :cond_5

    invoke-interface {v14}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v5

    check-cast v5, Lcom/netease/inner/pushclient/NativePushData;

    .line 130
    .local v5, "nativePushData":Lcom/netease/inner/pushclient/NativePushData;
    sget-object v15, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v16, "startAlarm"

    invoke-static/range {v15 .. v16}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 131
    sget-object v15, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v16, Ljava/lang/StringBuilder;

    const-string v17, "pushName:"

    invoke-direct/range {v16 .. v17}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v5}, Lcom/netease/inner/pushclient/NativePushData;->getPushName()Ljava/lang/String;

    move-result-object v17

    invoke-virtual/range {v16 .. v17}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v16

    invoke-virtual/range {v16 .. v16}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v16

    invoke-static/range {v15 .. v16}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 132
    invoke-static {v5}, Lcom/netease/pushclient/NativePushManager;->startAlarm(Lcom/netease/inner/pushclient/NativePushData;)Z

    goto :goto_2

    .line 135
    .end local v5    # "nativePushData":Lcom/netease/inner/pushclient/NativePushData;
    :cond_7
    invoke-interface {v6}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v14

    :goto_3
    invoke-interface {v14}, Ljava/util/Iterator;->hasNext()Z

    move-result v15

    if-eqz v15, :cond_5

    invoke-interface {v14}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v5

    check-cast v5, Lcom/netease/inner/pushclient/NativePushData;

    .line 136
    .restart local v5    # "nativePushData":Lcom/netease/inner/pushclient/NativePushData;
    sget-object v15, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v16, "startAlarm"

    invoke-static/range {v15 .. v16}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 137
    sget-object v15, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v16, Ljava/lang/StringBuilder;

    const-string v17, "pushName:"

    invoke-direct/range {v16 .. v17}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v5}, Lcom/netease/inner/pushclient/NativePushData;->getPushName()Ljava/lang/String;

    move-result-object v17

    invoke-virtual/range {v16 .. v17}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v16

    invoke-virtual/range {v16 .. v16}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v16

    invoke-static/range {v15 .. v16}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 138
    move-object/from16 v0, p0

    iget-object v15, v0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    iget-object v0, v2, Lcom/netease/push/utils/AppInfo;->mPackageName:Ljava/lang/String;

    move-object/from16 v16, v0

    move-object/from16 v0, v16

    invoke-virtual {v5, v15, v0}, Lcom/netease/inner/pushclient/NativePushData;->startAlarm(Landroid/content/Context;Ljava/lang/String;)V

    goto :goto_3
.end method

.method public notifyMessage(Ljava/lang/String;Lcom/netease/push/utils/NotifyMessage;)V
    .locals 5
    .param p1, "packageName"    # Ljava/lang/String;
    .param p2, "notify"    # Lcom/netease/push/utils/NotifyMessage;

    .prologue
    .line 376
    sget-object v2, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v3, "notifyMessage"

    invoke-static {v2, v3}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 377
    sget-object v2, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "packageName:"

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 378
    sget-object v2, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "notify:"

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 379
    invoke-static {p1}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v2

    if-nez v2, :cond_0

    if-eqz p2, :cond_0

    .line 380
    iget-object v2, p0, Lcom/netease/pushservice/PushServiceHelper;->m_packageAppInfoMap:Ljava/util/HashMap;

    invoke-virtual {v2, p1}, Ljava/util/HashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Lcom/netease/push/utils/AppInfo;

    .line 381
    .local v0, "appInfo":Lcom/netease/push/utils/AppInfo;
    if-eqz v0, :cond_0

    .line 382
    new-instance v1, Lcom/netease/push/utils/Notifier;

    iget-object v2, p0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    invoke-direct {v1, v2}, Lcom/netease/push/utils/Notifier;-><init>(Landroid/content/Context;)V

    .line 383
    .local v1, "notifier":Lcom/netease/push/utils/Notifier;
    invoke-virtual {v1, p2, v0}, Lcom/netease/push/utils/Notifier;->notify(Lcom/netease/push/utils/NotifyMessage;Lcom/netease/push/utils/AppInfo;)V

    .line 386
    .end local v0    # "appInfo":Lcom/netease/push/utils/AppInfo;
    .end local v1    # "notifier":Lcom/netease/push/utils/Notifier;
    :cond_0
    return-void
.end method

.method public onReceive(Lcom/netease/push/proto/ProtoClientWrapper$Packet;)V
    .locals 5
    .param p1, "packet"    # Lcom/netease/push/proto/ProtoClientWrapper$Packet;

    .prologue
    .line 389
    sget-object v2, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v3, "onReceive"

    invoke-static {v2, v3}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 390
    sget-object v2, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "packet:"

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 391
    sget-object v2, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "got cmd:"

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-byte v4, p1, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->type:B

    invoke-static {v4}, Lcom/netease/push/proto/ProtoClientWrapper;->getTypeName(B)Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 392
    const/16 v2, 0x32

    iget-byte v3, p1, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->type:B

    if-ne v2, v3, :cond_0

    .line 393
    sget-object v2, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v3, "PUSH_TYPE"

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 395
    :try_start_0
    invoke-virtual {p0, p1}, Lcom/netease/pushservice/PushServiceHelper;->handlePush(Lcom/netease/push/proto/ProtoClientWrapper$Packet;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 417
    :goto_0
    return-void

    .line 396
    :catch_0
    move-exception v0

    .line 397
    .local v0, "e":Ljava/lang/Exception;
    sget-object v2, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v3, "handlePush exception"

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 398
    invoke-virtual {v0}, Ljava/lang/Exception;->printStackTrace()V

    goto :goto_0

    .line 400
    .end local v0    # "e":Ljava/lang/Exception;
    :cond_0
    const/16 v2, 0x34

    iget-byte v3, p1, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->type:B

    if-ne v2, v3, :cond_1

    .line 401
    sget-object v2, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v3, "NEW_ID_TYPE"

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 404
    :try_start_1
    iget-object v2, p1, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->data:[B

    invoke-static {v2}, Lcom/netease/push/proto/ProtoClientWrapper$NewIdInfo;->UnmarshalNewIdInfo([B)Lcom/netease/push/proto/ProtoClientWrapper$NewIdInfo;

    move-result-object v1

    .line 405
    .local v1, "newIdInfo":Lcom/netease/push/proto/ProtoClientWrapper$NewIdInfo;
    iget-object v2, v1, Lcom/netease/push/proto/ProtoClientWrapper$NewIdInfo;->id:Ljava/lang/String;

    invoke-direct {p0, v2}, Lcom/netease/pushservice/PushServiceHelper;->updateToken(Ljava/lang/String;)V
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_1

    goto :goto_0

    .line 406
    .end local v1    # "newIdInfo":Lcom/netease/push/proto/ProtoClientWrapper$NewIdInfo;
    :catch_1
    move-exception v0

    .line 407
    .restart local v0    # "e":Ljava/lang/Exception;
    sget-object v2, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v3, "updateToken exception"

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 408
    invoke-virtual {v0}, Ljava/lang/Exception;->printStackTrace()V

    goto :goto_0

    .line 410
    .end local v0    # "e":Ljava/lang/Exception;
    :cond_1
    const/16 v2, 0x33

    iget-byte v3, p1, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->type:B

    if-ne v2, v3, :cond_2

    .line 411
    sget-object v2, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v3, "RESET_TYPE"

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 412
    iget-object v2, p0, Lcom/netease/pushservice/PushServiceHelper;->m_serviceInfo:Lcom/netease/pushservice/PushServiceInfo;

    invoke-virtual {v2}, Lcom/netease/pushservice/PushServiceInfo;->resetUUID()V

    .line 413
    invoke-virtual {p0}, Lcom/netease/pushservice/PushServiceHelper;->refreshToken()V

    goto :goto_0

    .line 415
    :cond_2
    sget-object v2, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v3, "error cmd"

    invoke-static {v2, v3}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    goto :goto_0
.end method

.method public processCommand(Lcom/netease/pushservice/PushService;Landroid/content/Intent;)V
    .locals 7
    .param p1, "pushService"    # Lcom/netease/pushservice/PushService;
    .param p2, "intent"    # Landroid/content/Intent;

    .prologue
    const/4 v6, 0x0

    .line 276
    sget-object v3, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v4, "processCommand"

    invoke-static {v3, v4}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 277
    sget-object v3, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "pushService:"

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v3, v4}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 278
    sget-object v3, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "intent:"

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v3, v4}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 279
    if-nez p2, :cond_1

    .line 321
    :cond_0
    :goto_0
    return-void

    .line 282
    :cond_1
    const-string v3, "method"

    invoke-virtual {p2, v3}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    .line 283
    .local v1, "method":Ljava/lang/String;
    const-string v3, "package"

    invoke-virtual {p2, v3}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    .line 284
    .local v2, "packageName":Ljava/lang/String;
    sget-object v3, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "method:"

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v3, v4}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 285
    sget-object v3, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "packageName:"

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v3, v4}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 286
    const-string v3, "restart"

    invoke-virtual {v3, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_2

    .line 287
    invoke-static {v2}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v3

    if-nez v3, :cond_0

    .line 288
    invoke-virtual {p1, v2}, Lcom/netease/pushservice/PushService;->restart(Ljava/lang/String;)V

    goto :goto_0

    .line 290
    :cond_2
    const-string v3, "stopservice"

    invoke-virtual {v3, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_3

    .line 291
    invoke-virtual {p1}, Lcom/netease/pushservice/PushService;->stop()V

    goto :goto_0

    .line 292
    :cond_3
    const-string v3, "setsound"

    invoke-virtual {v3, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_4

    .line 293
    const-string v3, "flag"

    invoke-virtual {p2, v3, v6}, Landroid/content/Intent;->getBooleanExtra(Ljava/lang/String;Z)Z

    move-result v0

    .line 294
    .local v0, "flag":Z
    invoke-direct {p0, v2, v0}, Lcom/netease/pushservice/PushServiceHelper;->enableSound(Ljava/lang/String;Z)V

    goto :goto_0

    .line 295
    .end local v0    # "flag":Z
    :cond_4
    const-string v3, "setvibrate"

    invoke-virtual {v3, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_5

    .line 296
    const-string v3, "flag"

    invoke-virtual {p2, v3, v6}, Landroid/content/Intent;->getBooleanExtra(Ljava/lang/String;Z)Z

    move-result v0

    .line 297
    .restart local v0    # "flag":Z
    invoke-direct {p0, v2, v0}, Lcom/netease/pushservice/PushServiceHelper;->enableVibrate(Ljava/lang/String;Z)V

    goto :goto_0

    .line 298
    .end local v0    # "flag":Z
    :cond_5
    const-string v3, "setrepeatprotect"

    invoke-virtual {v3, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_6

    .line 299
    const-string v3, "flag"

    invoke-virtual {p2, v3, v6}, Landroid/content/Intent;->getBooleanExtra(Ljava/lang/String;Z)Z

    move-result v0

    .line 300
    .restart local v0    # "flag":Z
    invoke-direct {p0, v2, v0}, Lcom/netease/pushservice/PushServiceHelper;->enableRepeatProtect(Ljava/lang/String;Z)V

    goto/16 :goto_0

    .line 301
    .end local v0    # "flag":Z
    :cond_6
    const-string v3, "register"

    invoke-virtual {v3, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_7

    .line 302
    iget-object v3, p0, Lcom/netease/pushservice/PushServiceHelper;->m_taskSubmitter:Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;

    new-instance v4, Lcom/netease/pushservice/PushServiceHelper$1;

    invoke-direct {v4, p0, v2}, Lcom/netease/pushservice/PushServiceHelper$1;-><init>(Lcom/netease/pushservice/PushServiceHelper;Ljava/lang/String;)V

    invoke-virtual {v3, v4}, Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;->submit(Ljava/lang/Runnable;)Ljava/util/concurrent/Future;

    goto/16 :goto_0

    .line 308
    :cond_7
    const-string v3, "removeapp"

    invoke-virtual {v3, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_8

    .line 309
    iget-object v3, p0, Lcom/netease/pushservice/PushServiceHelper;->m_taskSubmitter:Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;

    new-instance v4, Lcom/netease/pushservice/PushServiceHelper$2;

    invoke-direct {v4, p0, v2}, Lcom/netease/pushservice/PushServiceHelper$2;-><init>(Lcom/netease/pushservice/PushServiceHelper;Ljava/lang/String;)V

    invoke-virtual {v3, v4}, Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;->submit(Ljava/lang/Runnable;)Ljava/util/concurrent/Future;

    goto/16 :goto_0

    .line 314
    :cond_8
    const-string v3, "networkconnect"

    invoke-virtual {v3, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_9

    .line 315
    invoke-virtual {p0, v6}, Lcom/netease/pushservice/PushServiceHelper;->connect(Z)V

    goto/16 :goto_0

    .line 316
    :cond_9
    const-string v3, "networkdisconnect"

    invoke-virtual {v3, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_a

    .line 317
    invoke-virtual {p0}, Lcom/netease/pushservice/PushServiceHelper;->disconnect()V

    goto/16 :goto_0

    .line 319
    :cond_a
    sget-object v3, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "not handled method:"

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v3, v4}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    goto/16 :goto_0
.end method

.method public refreshToken()V
    .locals 8

    .prologue
    .line 251
    iget-object v5, p0, Lcom/netease/pushservice/PushServiceHelper;->m_serviceInfo:Lcom/netease/pushservice/PushServiceInfo;

    iget-object v4, v5, Lcom/netease/pushservice/PushServiceInfo;->mDevId:Ljava/lang/String;

    .line 252
    .local v4, "token":Ljava/lang/String;
    sget-object v5, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v6, "refreshToken"

    invoke-static {v5, v6}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 253
    sget-object v5, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v6, Ljava/lang/StringBuilder;

    const-string v7, "token:"

    invoke-direct {v6, v7}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v7, p0, Lcom/netease/pushservice/PushServiceHelper;->m_serviceInfo:Lcom/netease/pushservice/PushServiceInfo;

    iget-object v7, v7, Lcom/netease/pushservice/PushServiceInfo;->mDevId:Ljava/lang/String;

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v6

    invoke-static {v5, v6}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 254
    sget-object v5, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v6, Ljava/lang/StringBuilder;

    const-string v7, "m_packageAppInfoMap.size():"

    invoke-direct {v6, v7}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v7, p0, Lcom/netease/pushservice/PushServiceHelper;->m_packageAppInfoMap:Ljava/util/HashMap;

    invoke-virtual {v7}, Ljava/util/HashMap;->size()I

    move-result v7

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v6

    invoke-static {v5, v6}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 255
    invoke-static {v4}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v5

    if-nez v5, :cond_1

    .line 256
    new-instance v2, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;

    invoke-direct {v2}, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;-><init>()V

    .line 257
    .local v2, "devServiceInfos":Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;
    iput-object v4, v2, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;->id:Ljava/lang/String;

    .line 258
    const-string v5, "8"

    iput-object v5, v2, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;->ver:Ljava/lang/String;

    .line 259
    iget-object v5, p0, Lcom/netease/pushservice/PushServiceHelper;->m_packageAppInfoMap:Ljava/util/HashMap;

    invoke-virtual {v5}, Ljava/util/HashMap;->size()I

    move-result v5

    new-array v5, v5, [Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;

    iput-object v5, v2, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;->serviceInfos:[Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;

    .line 260
    const/4 v1, 0x0

    .line 261
    .local v1, "count":I
    iget-object v5, p0, Lcom/netease/pushservice/PushServiceHelper;->m_packageAppInfoMap:Ljava/util/HashMap;

    invoke-virtual {v5}, Ljava/util/HashMap;->values()Ljava/util/Collection;

    move-result-object v5

    invoke-interface {v5}, Ljava/util/Collection;->iterator()Ljava/util/Iterator;

    move-result-object v5

    :goto_0
    invoke-interface {v5}, Ljava/util/Iterator;->hasNext()Z

    move-result v6

    if-nez v6, :cond_0

    .line 268
    sget-object v5, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v6, "LOGIN_TYPE"

    invoke-static {v5, v6}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 269
    invoke-virtual {p0}, Lcom/netease/pushservice/PushServiceHelper;->getNetwork()Lcom/netease/pushservice/Network;

    move-result-object v5

    const/4 v6, 0x4

    invoke-virtual {v5, v6, v2}, Lcom/netease/pushservice/Network;->sendData(BLcom/netease/push/proto/ProtoClientWrapper$DataMarshal;)V

    .line 273
    .end local v1    # "count":I
    .end local v2    # "devServiceInfos":Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;
    :goto_1
    return-void

    .line 261
    .restart local v1    # "count":I
    .restart local v2    # "devServiceInfos":Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;
    :cond_0
    invoke-interface {v5}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Lcom/netease/push/utils/AppInfo;

    .line 262
    .local v0, "appInfo":Lcom/netease/push/utils/AppInfo;
    new-instance v3, Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;

    invoke-direct {v3}, Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;-><init>()V

    .line 263
    .local v3, "serviceInfo":Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;
    iget-object v6, v0, Lcom/netease/push/utils/AppInfo;->mPackageName:Ljava/lang/String;

    iput-object v6, v3, Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;->service:Ljava/lang/String;

    .line 264
    iget-wide v6, v0, Lcom/netease/push/utils/AppInfo;->mLastReceiveTime:J

    iput-wide v6, v3, Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;->time:J

    .line 265
    iget-object v6, v2, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;->serviceInfos:[Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;

    aput-object v3, v6, v1

    .line 266
    add-int/lit8 v1, v1, 0x1

    goto :goto_0

    .line 271
    .end local v0    # "appInfo":Lcom/netease/push/utils/AppInfo;
    .end local v1    # "count":I
    .end local v2    # "devServiceInfos":Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;
    .end local v3    # "serviceInfo":Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;
    :cond_1
    invoke-direct {p0}, Lcom/netease/pushservice/PushServiceHelper;->requireToken()V

    goto :goto_1
.end method

.method public register()V
    .locals 1

    .prologue
    .line 148
    iget-object v0, p0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    invoke-virtual {v0}, Lcom/netease/pushservice/PushService;->getPackageName()Ljava/lang/String;

    move-result-object v0

    invoke-direct {p0, v0}, Lcom/netease/pushservice/PushServiceHelper;->register(Ljava/lang/String;)V

    .line 149
    return-void
.end method

.method public removeApp(Ljava/lang/String;)V
    .locals 5
    .param p1, "packageName"    # Ljava/lang/String;

    .prologue
    .line 357
    sget-object v2, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v3, "removeApp"

    invoke-static {v2, v3}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 358
    sget-object v2, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "packageName:"

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 359
    sget-object v2, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "pid:"

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-static {}, Landroid/os/Process;->myPid()I

    move-result v4

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 360
    iget-object v2, p0, Lcom/netease/pushservice/PushServiceHelper;->m_packageAppInfoMap:Ljava/util/HashMap;

    invoke-virtual {v2, p1}, Ljava/util/HashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Lcom/netease/push/utils/AppInfo;

    .line 361
    .local v0, "appInfo":Lcom/netease/push/utils/AppInfo;
    if-eqz v0, :cond_0

    .line 362
    new-instance v1, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;

    invoke-direct {v1}, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;-><init>()V

    .line 363
    .local v1, "devServiceInfo":Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;
    iget-object v2, p0, Lcom/netease/pushservice/PushServiceHelper;->m_serviceInfo:Lcom/netease/pushservice/PushServiceInfo;

    iget-object v2, v2, Lcom/netease/pushservice/PushServiceInfo;->mDevId:Ljava/lang/String;

    iput-object v2, v1, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;->id:Ljava/lang/String;

    .line 364
    iget-object v2, v0, Lcom/netease/push/utils/AppInfo;->mPackageName:Ljava/lang/String;

    iput-object v2, v1, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;->service:Ljava/lang/String;

    .line 365
    iget-wide v2, v0, Lcom/netease/push/utils/AppInfo;->mLastReceiveTime:J

    iput-wide v2, v1, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;->time:J

    .line 366
    sget-object v2, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v3, "UNREGISTER_TYPE"

    invoke-static {v2, v3}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 367
    invoke-virtual {p0}, Lcom/netease/pushservice/PushServiceHelper;->getNetwork()Lcom/netease/pushservice/Network;

    move-result-object v2

    const/4 v3, 0x7

    invoke-virtual {v2, v3, v1}, Lcom/netease/pushservice/Network;->sendData(BLcom/netease/push/proto/ProtoClientWrapper$DataMarshal;)V

    .line 368
    iget-object v2, p0, Lcom/netease/pushservice/PushServiceHelper;->m_packageAppInfoMap:Ljava/util/HashMap;

    invoke-virtual {v2, p1}, Ljava/util/HashMap;->remove(Ljava/lang/Object;)Ljava/lang/Object;

    .line 369
    iget-object v2, p0, Lcom/netease/pushservice/PushServiceHelper;->m_pushService:Lcom/netease/pushservice/PushService;

    iget-object v3, p0, Lcom/netease/pushservice/PushServiceHelper;->m_packageAppInfoMap:Ljava/util/HashMap;

    invoke-virtual {v3}, Ljava/util/HashMap;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-static {v2, v3}, Lcom/netease/push/utils/PushSetting;->setPackages(Landroid/content/Context;Ljava/util/Set;)V

    .line 373
    .end local v1    # "devServiceInfo":Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;
    :goto_0
    return-void

    .line 371
    :cond_0
    sget-object v2, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v3, "appinfo is null"

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    goto :goto_0
.end method

.method public stop()V
    .locals 2

    .prologue
    .line 529
    sget-object v0, Lcom/netease/pushservice/PushServiceHelper;->TAG:Ljava/lang/String;

    const-string v1, "stop"

    invoke-static {v0, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 530
    iget-object v0, p0, Lcom/netease/pushservice/PushServiceHelper;->m_taskSubmitter:Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;

    invoke-virtual {v0}, Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;->shutdown()V

    .line 531
    invoke-virtual {p0}, Lcom/netease/pushservice/PushServiceHelper;->getNetwork()Lcom/netease/pushservice/Network;

    move-result-object v0

    invoke-virtual {v0}, Lcom/netease/pushservice/Network;->stop()V

    .line 532
    return-void
.end method
