.class public final Lcom/netease/inner/pushclient/PushManager;
.super Ljava/lang/Object;
.source "PushManager.java"


# static fields
.field private static final TAG:Ljava/lang/String;

.field private static mServiceManager:Lcom/netease/inner/pushclient/PushManager;


# instance fields
.field private mAppInfo:Lcom/netease/push/utils/AppInfo;

.field private mContext:Landroid/content/Context;


# direct methods
.method static constructor <clinit>()V
    .locals 2

    .prologue
    .line 23
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "NGPush_"

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-class v1, Lcom/netease/inner/pushclient/PushManager;

    invoke-virtual {v1}, Ljava/lang/Class;->getSimpleName()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    sput-object v0, Lcom/netease/inner/pushclient/PushManager;->TAG:Ljava/lang/String;

    .line 24
    new-instance v0, Lcom/netease/inner/pushclient/PushManager;

    invoke-direct {v0}, Lcom/netease/inner/pushclient/PushManager;-><init>()V

    sput-object v0, Lcom/netease/inner/pushclient/PushManager;->mServiceManager:Lcom/netease/inner/pushclient/PushManager;

    return-void
.end method

.method private constructor <init>()V
    .locals 0

    .prologue
    .line 28
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 29
    return-void
.end method

.method public static getInstance()Lcom/netease/inner/pushclient/PushManager;
    .locals 1

    .prologue
    .line 32
    sget-object v0, Lcom/netease/inner/pushclient/PushManager;->mServiceManager:Lcom/netease/inner/pushclient/PushManager;

    return-object v0
.end method

.method private restartService(Ljava/lang/String;Ljava/lang/String;)V
    .locals 4
    .param p1, "pkgToStop"    # Ljava/lang/String;
    .param p2, "pkgToStart"    # Ljava/lang/String;

    .prologue
    .line 138
    sget-object v1, Lcom/netease/inner/pushclient/PushManager;->TAG:Ljava/lang/String;

    const-string v2, "restart service"

    invoke-static {v1, v2}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 139
    sget-object v1, Lcom/netease/inner/pushclient/PushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "pkgToStop:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 140
    sget-object v1, Lcom/netease/inner/pushclient/PushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "pkgToStart:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 141
    invoke-static {}, Lcom/netease/pushservice/PushServiceHelper;->createMethodIntent()Landroid/content/Intent;

    move-result-object v0

    .line 142
    .local v0, "intent":Landroid/content/Intent;
    const-string v1, "method"

    const-string v2, "restart"

    invoke-virtual {v0, v1, v2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 143
    const-string v1, "package"

    invoke-virtual {v0, v1, p2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 144
    invoke-virtual {v0, p1}, Landroid/content/Intent;->setPackage(Ljava/lang/String;)Landroid/content/Intent;

    .line 145
    iget-object v1, p0, Lcom/netease/inner/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-virtual {v1, v0}, Landroid/content/Context;->sendBroadcast(Landroid/content/Intent;)V

    .line 146
    return-void
.end method

.method private stopService(Ljava/lang/String;)V
    .locals 4
    .param p1, "pkg"    # Ljava/lang/String;

    .prologue
    .line 149
    sget-object v1, Lcom/netease/inner/pushclient/PushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "stop service, pkg:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 150
    invoke-static {}, Lcom/netease/pushservice/PushServiceHelper;->createMethodIntent()Landroid/content/Intent;

    move-result-object v0

    .line 151
    .local v0, "intent":Landroid/content/Intent;
    const-string v1, "method"

    const-string v2, "stopservice"

    invoke-virtual {v0, v1, v2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 152
    invoke-virtual {v0, p1}, Landroid/content/Intent;->setPackage(Ljava/lang/String;)Landroid/content/Intent;

    .line 153
    iget-object v1, p0, Lcom/netease/inner/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-virtual {v1, v0}, Landroid/content/Context;->sendBroadcast(Landroid/content/Intent;)V

    .line 154
    return-void
.end method


# virtual methods
.method public connect()V
    .locals 4

    .prologue
    .line 161
    sget-object v2, Lcom/netease/inner/pushclient/PushManager;->TAG:Ljava/lang/String;

    const-string v3, "connect"

    invoke-static {v2, v3}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 163
    iget-object v2, p0, Lcom/netease/inner/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-static {v2}, Lcom/netease/push/utils/PushSetting;->getCurPkg(Landroid/content/Context;)Ljava/lang/String;

    move-result-object v1

    .line 164
    .local v1, "curPackageName":Ljava/lang/String;
    invoke-static {}, Lcom/netease/pushservice/PushServiceHelper;->createActiveMethodIntent()Landroid/content/Intent;

    move-result-object v0

    .line 165
    .local v0, "connectIntent":Landroid/content/Intent;
    const-string v2, "method"

    const-string v3, "networkconnect"

    invoke-virtual {v0, v2, v3}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 166
    invoke-virtual {v0, v1}, Landroid/content/Intent;->setPackage(Ljava/lang/String;)Landroid/content/Intent;

    .line 167
    iget-object v2, p0, Lcom/netease/inner/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-static {v2, v0}, Lcom/netease/pushservice/PushServiceHelper;->startActivePushService(Landroid/content/Context;Landroid/content/Intent;)V

    .line 168
    return-void
.end method

.method public enableRepeatProtect(Z)Z
    .locals 4
    .param p1, "flag"    # Z

    .prologue
    .line 63
    sget-object v1, Lcom/netease/inner/pushclient/PushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "enableRepeatProtect, flag:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(Z)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 64
    iget-object v1, p0, Lcom/netease/inner/pushclient/PushManager;->mAppInfo:Lcom/netease/push/utils/AppInfo;

    iget-boolean v1, v1, Lcom/netease/push/utils/AppInfo;->mbRepeatProtect:Z

    if-eq p1, v1, :cond_0

    .line 65
    iget-object v1, p0, Lcom/netease/inner/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-static {v1, p1}, Lcom/netease/push/utils/PushSetting;->setRepeatProtect(Landroid/content/Context;Z)V

    .line 67
    invoke-static {}, Lcom/netease/pushservice/PushServiceHelper;->createMethodIntent()Landroid/content/Intent;

    move-result-object v0

    .line 68
    .local v0, "intent":Landroid/content/Intent;
    const-string v1, "method"

    const-string v2, "setrepeatprotect"

    invoke-virtual {v0, v1, v2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 69
    const-string v1, "package"

    iget-object v2, p0, Lcom/netease/inner/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-virtual {v2}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v0, v1, v2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 70
    const-string v1, "flag"

    invoke-virtual {v0, v1, p1}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Z)Landroid/content/Intent;

    .line 71
    iget-object v1, p0, Lcom/netease/inner/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-static {v1}, Lcom/netease/push/utils/PushSetting;->getCurPkg(Landroid/content/Context;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Landroid/content/Intent;->setPackage(Ljava/lang/String;)Landroid/content/Intent;

    .line 72
    iget-object v1, p0, Lcom/netease/inner/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-virtual {v1, v0}, Landroid/content/Context;->sendBroadcast(Landroid/content/Intent;)V

    .line 74
    .end local v0    # "intent":Landroid/content/Intent;
    :cond_0
    const/4 v1, 0x1

    return v1
.end method

.method public enableSound(Z)Z
    .locals 3
    .param p1, "flag"    # Z

    .prologue
    .line 47
    sget-object v0, Lcom/netease/inner/pushclient/PushManager;->TAG:Ljava/lang/String;

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "enableSound, flag:"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(Z)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 48
    iget-object v0, p0, Lcom/netease/inner/pushclient/PushManager;->mAppInfo:Lcom/netease/push/utils/AppInfo;

    iget-boolean v0, v0, Lcom/netease/push/utils/AppInfo;->mbEnableSound:Z

    if-eq p1, v0, :cond_0

    .line 49
    iget-object v0, p0, Lcom/netease/inner/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-static {v0, p1}, Lcom/netease/push/utils/PushSetting;->setSound(Landroid/content/Context;Z)V

    .line 51
    :cond_0
    const/4 v0, 0x1

    return v0
.end method

.method public enableVibrate(Z)Z
    .locals 3
    .param p1, "flag"    # Z

    .prologue
    .line 55
    sget-object v0, Lcom/netease/inner/pushclient/PushManager;->TAG:Ljava/lang/String;

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "enableVibrate, flag:"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(Z)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 56
    iget-object v0, p0, Lcom/netease/inner/pushclient/PushManager;->mAppInfo:Lcom/netease/push/utils/AppInfo;

    iget-boolean v0, v0, Lcom/netease/push/utils/AppInfo;->mbEnableVibrate:Z

    if-eq p1, v0, :cond_0

    .line 57
    iget-object v0, p0, Lcom/netease/inner/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-static {v0, p1}, Lcom/netease/push/utils/PushSetting;->setVibrate(Landroid/content/Context;Z)V

    .line 59
    :cond_0
    const/4 v0, 0x1

    return v0
.end method

.method public getDevId()Ljava/lang/String;
    .locals 1

    .prologue
    .line 78
    iget-object v0, p0, Lcom/netease/inner/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-static {v0}, Lcom/netease/push/utils/PushSetting;->getDevID(Landroid/content/Context;)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public init(Landroid/content/Context;)V
    .locals 3
    .param p1, "context"    # Landroid/content/Context;

    .prologue
    .line 36
    sget-object v1, Lcom/netease/inner/pushclient/PushManager;->TAG:Ljava/lang/String;

    const-string v2, "init"

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 37
    iput-object p1, p0, Lcom/netease/inner/pushclient/PushManager;->mContext:Landroid/content/Context;

    .line 41
    const/16 v0, 0x8

    .line 42
    .local v0, "verCode":I
    iget-object v1, p0, Lcom/netease/inner/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-static {v1, v0}, Lcom/netease/push/utils/PushSetting;->setVerCode(Landroid/content/Context;I)V

    .line 43
    sget-object v1, Lcom/netease/inner/pushclient/PushManager;->TAG:Ljava/lang/String;

    const-string v2, "setVerCode, JAR_VER_CODE:8"

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 44
    return-void
.end method

.method public startService()V
    .locals 14

    .prologue
    .line 82
    sget-object v11, Lcom/netease/inner/pushclient/PushManager;->TAG:Ljava/lang/String;

    const-string v12, "startService"

    invoke-static {v11, v12}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 83
    iget-object v11, p0, Lcom/netease/inner/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-static {v11}, Lcom/netease/push/utils/PushSetting;->getAppInfo(Landroid/content/Context;)Lcom/netease/push/utils/AppInfo;

    move-result-object v11

    iput-object v11, p0, Lcom/netease/inner/pushclient/PushManager;->mAppInfo:Lcom/netease/push/utils/AppInfo;

    .line 85
    iget-object v11, p0, Lcom/netease/inner/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-static {v11}, Lcom/netease/push/utils/PushSetting;->getCurPkg(Landroid/content/Context;)Ljava/lang/String;

    move-result-object v7

    .line 86
    .local v7, "runningpkg":Ljava/lang/String;
    iget-object v11, p0, Lcom/netease/inner/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-static {v11}, Lcom/netease/push/utils/PushSetting;->getCurVerCode(Landroid/content/Context;)I

    move-result v8

    .line 87
    .local v8, "runningver":I
    iget-object v11, p0, Lcom/netease/inner/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-virtual {v11}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    move-result-object v1

    .line 88
    .local v1, "contextpkg":Ljava/lang/String;
    const/16 v2, 0x8

    .line 89
    .local v2, "contextver":I
    sget-object v11, Lcom/netease/inner/pushclient/PushManager;->TAG:Ljava/lang/String;

    new-instance v12, Ljava/lang/StringBuilder;

    const-string v13, "runningpkg:"

    invoke-direct {v12, v13}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v12, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v12

    invoke-virtual {v12}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v12

    invoke-static {v11, v12}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 90
    sget-object v11, Lcom/netease/inner/pushclient/PushManager;->TAG:Ljava/lang/String;

    new-instance v12, Ljava/lang/StringBuilder;

    const-string v13, "runningver:"

    invoke-direct {v12, v13}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v12, v8}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v12

    invoke-virtual {v12}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v12

    invoke-static {v11, v12}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 91
    sget-object v11, Lcom/netease/inner/pushclient/PushManager;->TAG:Ljava/lang/String;

    new-instance v12, Ljava/lang/StringBuilder;

    const-string v13, "contextpkg:"

    invoke-direct {v12, v13}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v12, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v12

    invoke-virtual {v12}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v12

    invoke-static {v11, v12}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 92
    sget-object v11, Lcom/netease/inner/pushclient/PushManager;->TAG:Ljava/lang/String;

    new-instance v12, Ljava/lang/StringBuilder;

    const-string v13, "contextver:"

    invoke-direct {v12, v13}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v12, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v12

    invoke-virtual {v12}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v12

    invoke-static {v11, v12}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 93
    move-object v6, v7

    .line 94
    .local v6, "pkgToStart":Ljava/lang/String;
    move v9, v8

    .line 95
    .local v9, "verToStart":I
    invoke-static {v6}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v11

    if-nez v11, :cond_0

    if-ge v9, v2, :cond_1

    .line 96
    :cond_0
    move-object v6, v1

    .line 97
    move v9, v2

    .line 100
    :cond_1
    iget-object v11, p0, Lcom/netease/inner/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-static {v11}, Lcom/netease/push/utils/VersionManager;->getNewestInstallVersion(Landroid/content/Context;)Lcom/netease/push/utils/VersionManager$VersionInfo;

    move-result-object v10

    .line 101
    .local v10, "versionInfo":Lcom/netease/push/utils/VersionManager$VersionInfo;
    if-eqz v10, :cond_2

    iget-object v11, v10, Lcom/netease/push/utils/VersionManager$VersionInfo;->mPackageName:Ljava/lang/String;

    invoke-static {v11}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v11

    if-nez v11, :cond_2

    .line 102
    iget-object v6, v10, Lcom/netease/push/utils/VersionManager$VersionInfo;->mPackageName:Ljava/lang/String;

    .line 103
    iget v9, v10, Lcom/netease/push/utils/VersionManager$VersionInfo;->mVersionCode:I

    .line 105
    :cond_2
    sget-object v11, Lcom/netease/inner/pushclient/PushManager;->TAG:Ljava/lang/String;

    new-instance v12, Ljava/lang/StringBuilder;

    const-string v13, "pkgToStart:"

    invoke-direct {v12, v13}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v12, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v12

    invoke-virtual {v12}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v12

    invoke-static {v11, v12}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 106
    sget-object v11, Lcom/netease/inner/pushclient/PushManager;->TAG:Ljava/lang/String;

    new-instance v12, Ljava/lang/StringBuilder;

    const-string v13, "verToStart:"

    invoke-direct {v12, v13}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v12, v9}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v12

    invoke-virtual {v12}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v12

    invoke-static {v11, v12}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 108
    invoke-virtual {v6, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v11

    if-eqz v11, :cond_4

    if-ne v9, v8, :cond_4

    const/4 v0, 0x0

    .line 109
    .local v0, "bChange":Z
    :goto_0
    sget-object v11, Lcom/netease/inner/pushclient/PushManager;->TAG:Ljava/lang/String;

    new-instance v12, Ljava/lang/StringBuilder;

    const-string v13, "bChange:"

    invoke-direct {v12, v13}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v12, v0}, Ljava/lang/StringBuilder;->append(Z)Ljava/lang/StringBuilder;

    move-result-object v12

    invoke-virtual {v12}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v12

    invoke-static {v11, v12}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 111
    if-eqz v0, :cond_3

    .line 112
    sget-object v11, Lcom/netease/inner/pushclient/PushManager;->TAG:Ljava/lang/String;

    const-string v12, "change PushSetting"

    invoke-static {v11, v12}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 113
    iget-object v11, p0, Lcom/netease/inner/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-static {v11, v6}, Lcom/netease/push/utils/PushSetting;->setCurPkg(Landroid/content/Context;Ljava/lang/String;)V

    .line 114
    iget-object v11, p0, Lcom/netease/inner/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-static {v11, v9}, Lcom/netease/push/utils/PushSetting;->setCurVerCode(Landroid/content/Context;I)V

    .line 115
    invoke-static {v7}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v11

    if-nez v11, :cond_3

    .line 117
    invoke-direct {p0, v7, v6}, Lcom/netease/inner/pushclient/PushManager;->restartService(Ljava/lang/String;Ljava/lang/String;)V

    .line 125
    :cond_3
    invoke-static {}, Lcom/netease/pushservice/PushServiceHelper;->createMethodIntent()Landroid/content/Intent;

    move-result-object v4

    .line 126
    .local v4, "intent":Landroid/content/Intent;
    const-string v11, "method"

    const-string v12, "register"

    invoke-virtual {v4, v11, v12}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 127
    const-string v11, "package"

    iget-object v12, p0, Lcom/netease/inner/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-virtual {v12}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    move-result-object v12

    invoke-virtual {v4, v11, v12}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 128
    invoke-virtual {v4, v6}, Landroid/content/Intent;->setPackage(Ljava/lang/String;)Landroid/content/Intent;

    .line 129
    iget-object v11, p0, Lcom/netease/inner/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-virtual {v11, v4}, Landroid/content/Context;->sendBroadcast(Landroid/content/Intent;)V

    .line 131
    new-instance v3, Landroid/content/IntentFilter;

    invoke-direct {v3}, Landroid/content/IntentFilter;-><init>()V

    .line 132
    .local v3, "filter":Landroid/content/IntentFilter;
    const-string v11, "android.intent.action.TIME_TICK"

    invoke-virtual {v3, v11}, Landroid/content/IntentFilter;->addAction(Ljava/lang/String;)V

    .line 133
    new-instance v5, Lcom/netease/pushservice/TimeTickReceiver;

    invoke-direct {v5}, Lcom/netease/pushservice/TimeTickReceiver;-><init>()V

    .line 134
    .local v5, "mReceiver":Landroid/content/BroadcastReceiver;
    iget-object v11, p0, Lcom/netease/inner/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-virtual {v11, v5, v3}, Landroid/content/Context;->registerReceiver(Landroid/content/BroadcastReceiver;Landroid/content/IntentFilter;)Landroid/content/Intent;

    .line 135
    return-void

    .line 108
    .end local v0    # "bChange":Z
    .end local v3    # "filter":Landroid/content/IntentFilter;
    .end local v4    # "intent":Landroid/content/Intent;
    .end local v5    # "mReceiver":Landroid/content/BroadcastReceiver;
    :cond_4
    const/4 v0, 0x1

    goto :goto_0
.end method

.method public stopService()V
    .locals 1

    .prologue
    .line 157
    iget-object v0, p0, Lcom/netease/inner/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-static {v0}, Lcom/netease/push/utils/PushSetting;->getCurPkg(Landroid/content/Context;)Ljava/lang/String;

    move-result-object v0

    invoke-direct {p0, v0}, Lcom/netease/inner/pushclient/PushManager;->stopService(Ljava/lang/String;)V

    .line 158
    return-void
.end method
