.class public final Lcom/netease/pushclient/PushManager;
.super Ljava/lang/Object;
.source "PushManager.java"


# static fields
.field private static final TAG:Ljava/lang/String;

.field public static mContext:Landroid/content/Context;

.field private static multiPackSupport:Z


# direct methods
.method static constructor <clinit>()V
    .locals 2

    .prologue
    .line 10
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "NGPush_"

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-class v1, Lcom/netease/pushclient/PushManager;

    invoke-virtual {v1}, Ljava/lang/Class;->getSimpleName()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    sput-object v0, Lcom/netease/pushclient/PushManager;->TAG:Ljava/lang/String;

    .line 11
    const/4 v0, 0x0

    sput-object v0, Lcom/netease/pushclient/PushManager;->mContext:Landroid/content/Context;

    .line 12
    const/4 v0, 0x1

    sput-boolean v0, Lcom/netease/pushclient/PushManager;->multiPackSupport:Z

    return-void
.end method

.method public constructor <init>()V
    .locals 0

    .prologue
    .line 9
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public static enableMultiPackSupport(Z)V
    .locals 0
    .param p0, "v"    # Z

    .prologue
    .line 15
    sput-boolean p0, Lcom/netease/pushclient/PushManager;->multiPackSupport:Z

    .line 16
    return-void
.end method

.method public static enableRepeatProtect(Z)V
    .locals 1
    .param p0, "flag"    # Z

    .prologue
    .line 49
    sget-object v0, Lcom/netease/pushclient/PushManager;->mContext:Landroid/content/Context;

    if-eqz v0, :cond_0

    .line 50
    invoke-static {}, Lcom/netease/inner/pushclient/PushManager;->getInstance()Lcom/netease/inner/pushclient/PushManager;

    move-result-object v0

    invoke-virtual {v0, p0}, Lcom/netease/inner/pushclient/PushManager;->enableRepeatProtect(Z)Z

    .line 52
    :cond_0
    return-void
.end method

.method public static enableSound(Z)V
    .locals 1
    .param p0, "flag"    # Z

    .prologue
    .line 31
    sget-object v0, Lcom/netease/pushclient/PushManager;->mContext:Landroid/content/Context;

    if-eqz v0, :cond_0

    .line 32
    invoke-static {}, Lcom/netease/inner/pushclient/PushManager;->getInstance()Lcom/netease/inner/pushclient/PushManager;

    move-result-object v0

    invoke-virtual {v0, p0}, Lcom/netease/inner/pushclient/PushManager;->enableSound(Z)Z

    .line 34
    :cond_0
    return-void
.end method

.method public static enableVibrate(Z)V
    .locals 1
    .param p0, "flag"    # Z

    .prologue
    .line 40
    sget-object v0, Lcom/netease/pushclient/PushManager;->mContext:Landroid/content/Context;

    if-eqz v0, :cond_0

    .line 41
    invoke-static {}, Lcom/netease/inner/pushclient/PushManager;->getInstance()Lcom/netease/inner/pushclient/PushManager;

    move-result-object v0

    invoke-virtual {v0, p0}, Lcom/netease/inner/pushclient/PushManager;->enableVibrate(Z)Z

    .line 43
    :cond_0
    return-void
.end method

.method public static getDevId()Ljava/lang/String;
    .locals 1

    .prologue
    .line 73
    sget-object v0, Lcom/netease/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-static {v0}, Lcom/netease/pushclient/PushManager;->getDevId(Landroid/content/Context;)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public static getDevId(Landroid/content/Context;)Ljava/lang/String;
    .locals 4
    .param p0, "ctx"    # Landroid/content/Context;

    .prologue
    .line 58
    sget-object v1, Lcom/netease/pushclient/PushManager;->TAG:Ljava/lang/String;

    const-string v2, "getDevId"

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 59
    sget-object v1, Lcom/netease/pushclient/PushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "mContext:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    sget-object v3, Lcom/netease/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 60
    sget-object v1, Lcom/netease/pushclient/PushManager;->mContext:Landroid/content/Context;

    if-eqz v1, :cond_1

    .line 61
    invoke-static {}, Lcom/netease/inner/pushclient/PushManager;->getInstance()Lcom/netease/inner/pushclient/PushManager;

    move-result-object v1

    invoke-virtual {v1}, Lcom/netease/inner/pushclient/PushManager;->getDevId()Ljava/lang/String;

    move-result-object v0

    .line 62
    .local v0, "devId":Ljava/lang/String;
    sget-object v1, Lcom/netease/pushclient/PushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "devId:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 63
    sget-object v1, Lcom/netease/pushclient/PushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "multiPackSupport:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    sget-boolean v3, Lcom/netease/pushclient/PushManager;->multiPackSupport:Z

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Z)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 64
    invoke-static {v0}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v1

    if-nez v1, :cond_0

    sget-boolean v1, Lcom/netease/pushclient/PushManager;->multiPackSupport:Z

    if-eqz v1, :cond_0

    .line 65
    new-instance v1, Ljava/lang/StringBuilder;

    invoke-static {v0}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v2

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {p0}, Landroid/content/Context;->getApplicationInfo()Landroid/content/pm/ApplicationInfo;

    move-result-object v2

    iget-object v2, v2, Landroid/content/pm/ApplicationInfo;->packageName:Ljava/lang/String;

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 69
    .end local v0    # "devId":Ljava/lang/String;
    :cond_0
    :goto_0
    return-object v0

    :cond_1
    const-string v0, ""

    goto :goto_0
.end method

.method public static init(Landroid/content/Context;)V
    .locals 3
    .param p0, "context"    # Landroid/content/Context;

    .prologue
    .line 19
    sget-object v0, Lcom/netease/pushclient/PushManager;->TAG:Ljava/lang/String;

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "init, context:"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 20
    sput-object p0, Lcom/netease/pushclient/PushManager;->mContext:Landroid/content/Context;

    .line 21
    sget-object v0, Lcom/netease/pushclient/PushManager;->mContext:Landroid/content/Context;

    if-eqz v0, :cond_0

    .line 22
    invoke-static {}, Lcom/netease/inner/pushclient/PushManager;->getInstance()Lcom/netease/inner/pushclient/PushManager;

    move-result-object v0

    sget-object v1, Lcom/netease/pushclient/PushManager;->mContext:Landroid/content/Context;

    invoke-virtual {v0, v1}, Lcom/netease/inner/pushclient/PushManager;->init(Landroid/content/Context;)V

    .line 24
    :cond_0
    invoke-static {p0}, Lcom/netease/pushclient/NativePushManager;->init(Landroid/content/Context;)V

    .line 25
    return-void
.end method

.method public static startService()V
    .locals 2

    .prologue
    .line 77
    sget-object v0, Lcom/netease/pushclient/PushManager;->TAG:Ljava/lang/String;

    const-string v1, "startService"

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 78
    sget-object v0, Lcom/netease/pushclient/PushManager;->mContext:Landroid/content/Context;

    if-eqz v0, :cond_0

    .line 79
    invoke-static {}, Lcom/netease/inner/pushclient/PushManager;->getInstance()Lcom/netease/inner/pushclient/PushManager;

    move-result-object v0

    invoke-virtual {v0}, Lcom/netease/inner/pushclient/PushManager;->startService()V

    .line 82
    :cond_0
    return-void
.end method

.method public static stopService()V
    .locals 2

    .prologue
    .line 85
    sget-object v0, Lcom/netease/pushclient/PushManager;->TAG:Ljava/lang/String;

    const-string v1, "stopService"

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 86
    sget-object v0, Lcom/netease/pushclient/PushManager;->mContext:Landroid/content/Context;

    if-eqz v0, :cond_0

    .line 87
    invoke-static {}, Lcom/netease/inner/pushclient/PushManager;->getInstance()Lcom/netease/inner/pushclient/PushManager;

    move-result-object v0

    invoke-virtual {v0}, Lcom/netease/inner/pushclient/PushManager;->stopService()V

    .line 89
    :cond_0
    return-void
.end method
