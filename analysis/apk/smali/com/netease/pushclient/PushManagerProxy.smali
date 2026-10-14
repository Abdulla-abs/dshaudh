.class public Lcom/netease/pushclient/PushManagerProxy;
.super Ljava/lang/Object;
.source "PushManagerProxy.java"


# static fields
.field private static final INNER_PUSH_MANAGER:Ljava/lang/String; = "com.netease.pushclient.PushManager"


# direct methods
.method public constructor <init>()V
    .locals 0

    .prologue
    .line 29
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public static isLoadPushManager(Landroid/content/Context;)Z
    .locals 2
    .param p0, "context"    # Landroid/content/Context;

    .prologue
    .line 46
    :try_start_0
    invoke-virtual {p0}, Landroid/content/Context;->getClassLoader()Ljava/lang/ClassLoader;

    move-result-object v0

    const-string v1, "com.netease.pushclient.PushManager"

    invoke-virtual {v0, v1}, Ljava/lang/ClassLoader;->loadClass(Ljava/lang/String;)Ljava/lang/Class;
    :try_end_0
    .catch Ljava/lang/ClassNotFoundException; {:try_start_0 .. :try_end_0} :catch_0

    .line 47
    const/4 v0, 0x1

    .line 52
    :goto_0
    return v0

    .line 48
    :catch_0
    move-exception v0

    .line 52
    const/4 v0, 0x0

    goto :goto_0
.end method

.method public static declared-synchronized loadPushManager(Landroid/content/Context;)Z
    .locals 3
    .param p0, "context"    # Landroid/content/Context;

    .prologue
    .line 35
    const-class v1, Lcom/netease/pushclient/PushManagerProxy;

    monitor-enter v1

    :try_start_0
    invoke-virtual {p0}, Landroid/content/Context;->getClassLoader()Ljava/lang/ClassLoader;

    move-result-object v0

    const-string v2, "com.netease.pushclient.PushManager"

    invoke-virtual {v0, v2}, Ljava/lang/ClassLoader;->loadClass(Ljava/lang/String;)Ljava/lang/Class;
    :try_end_0
    .catch Ljava/lang/ClassNotFoundException; {:try_start_0 .. :try_end_0} :catch_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    .line 36
    const/4 v0, 0x1

    .line 41
    :goto_0
    monitor-exit v1

    return v0

    .line 37
    :catch_0
    move-exception v0

    .line 41
    const/4 v0, 0x0

    goto :goto_0

    .line 35
    :catchall_0
    move-exception v0

    monitor-exit v1

    throw v0
.end method

.method public static run(Landroid/content/Context;Ljava/lang/Runnable;)V
    .locals 1
    .param p0, "context"    # Landroid/content/Context;
    .param p1, "runnable"    # Ljava/lang/Runnable;

    .prologue
    .line 56
    invoke-static {p0}, Lcom/netease/pushclient/PushManagerProxy;->isLoadPushManager(Landroid/content/Context;)Z

    move-result v0

    if-eqz v0, :cond_0

    .line 57
    invoke-interface {p1}, Ljava/lang/Runnable;->run()V

    .line 62
    :goto_0
    return-void

    .line 60
    :cond_0
    new-instance v0, Lcom/netease/pushclient/LoadThread;

    invoke-direct {v0, p0, p1}, Lcom/netease/pushclient/LoadThread;-><init>(Landroid/content/Context;Ljava/lang/Runnable;)V

    invoke-virtual {v0}, Lcom/netease/pushclient/LoadThread;->start()V

    goto :goto_0
.end method
