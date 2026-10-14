.class public Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;
.super Ljava/lang/Object;
.source "PushServiceHelper.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/netease/pushservice/PushServiceHelper;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x1
    name = "TaskSubmitter"
.end annotation


# instance fields
.field final m_executorService:Ljava/util/concurrent/ExecutorService;

.field final synthetic this$0:Lcom/netease/pushservice/PushServiceHelper;


# direct methods
.method public constructor <init>(Lcom/netease/pushservice/PushServiceHelper;)V
    .locals 1

    .prologue
    .line 540
    iput-object p1, p0, Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;->this$0:Lcom/netease/pushservice/PushServiceHelper;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 541
    invoke-static {}, Ljava/util/concurrent/Executors;->newSingleThreadExecutor()Ljava/util/concurrent/ExecutorService;

    move-result-object v0

    iput-object v0, p0, Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;->m_executorService:Ljava/util/concurrent/ExecutorService;

    .line 542
    return-void
.end method


# virtual methods
.method public shutdown()V
    .locals 1

    .prologue
    .line 554
    iget-object v0, p0, Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;->m_executorService:Ljava/util/concurrent/ExecutorService;

    invoke-interface {v0}, Ljava/util/concurrent/ExecutorService;->shutdown()V

    .line 555
    return-void
.end method

.method public submit(Ljava/lang/Runnable;)Ljava/util/concurrent/Future;
    .locals 2
    .param p1, "task"    # Ljava/lang/Runnable;

    .prologue
    .line 546
    const/4 v0, 0x0

    .line 547
    .local v0, "result":Ljava/util/concurrent/Future;
    iget-object v1, p0, Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;->m_executorService:Ljava/util/concurrent/ExecutorService;

    invoke-interface {v1}, Ljava/util/concurrent/ExecutorService;->isTerminated()Z

    move-result v1

    if-nez v1, :cond_0

    iget-object v1, p0, Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;->m_executorService:Ljava/util/concurrent/ExecutorService;

    invoke-interface {v1}, Ljava/util/concurrent/ExecutorService;->isShutdown()Z

    move-result v1

    if-nez v1, :cond_0

    if-eqz p1, :cond_0

    .line 548
    iget-object v1, p0, Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;->m_executorService:Ljava/util/concurrent/ExecutorService;

    invoke-interface {v1, p1}, Ljava/util/concurrent/ExecutorService;->submit(Ljava/lang/Runnable;)Ljava/util/concurrent/Future;

    move-result-object v0

    .line 550
    :cond_0
    return-object v0
.end method
