.class public Lcom/netease/pushclient/LoadThread;
.super Ljava/lang/Thread;
.source "LoadThread.java"


# instance fields
.field private mContext:Landroid/content/Context;

.field private mRunnable:Ljava/lang/Runnable;


# direct methods
.method public constructor <init>(Landroid/content/Context;Ljava/lang/Runnable;)V
    .locals 0
    .param p1, "context"    # Landroid/content/Context;
    .param p2, "runnable"    # Ljava/lang/Runnable;

    .prologue
    .line 28
    invoke-direct {p0}, Ljava/lang/Thread;-><init>()V

    .line 29
    iput-object p1, p0, Lcom/netease/pushclient/LoadThread;->mContext:Landroid/content/Context;

    .line 30
    iput-object p2, p0, Lcom/netease/pushclient/LoadThread;->mRunnable:Ljava/lang/Runnable;

    .line 31
    return-void
.end method


# virtual methods
.method public run()V
    .locals 1

    .prologue
    .line 36
    iget-object v0, p0, Lcom/netease/pushclient/LoadThread;->mContext:Landroid/content/Context;

    invoke-static {v0}, Lcom/netease/pushclient/PushManagerProxy;->loadPushManager(Landroid/content/Context;)Z

    move-result v0

    if-eqz v0, :cond_0

    .line 37
    iget-object v0, p0, Lcom/netease/pushclient/LoadThread;->mRunnable:Ljava/lang/Runnable;

    invoke-interface {v0}, Ljava/lang/Runnable;->run()V

    .line 40
    :cond_0
    return-void
.end method
