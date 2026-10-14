.class Lcom/netease/pushservice/Network$2;
.super Ljava/util/TimerTask;
.source "Network.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/pushservice/Network;->connectRetry(I)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/netease/pushservice/Network;


# direct methods
.method constructor <init>(Lcom/netease/pushservice/Network;)V
    .locals 0

    .prologue
    .line 1
    iput-object p1, p0, Lcom/netease/pushservice/Network$2;->this$0:Lcom/netease/pushservice/Network;

    .line 181
    invoke-direct {p0}, Ljava/util/TimerTask;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 2

    .prologue
    .line 184
    invoke-static {}, Lcom/netease/pushservice/PushServiceHelper;->getInstance()Lcom/netease/pushservice/PushServiceHelper;

    move-result-object v0

    const/4 v1, 0x0

    invoke-virtual {v0, v1}, Lcom/netease/pushservice/PushServiceHelper;->connect(Z)V

    .line 185
    return-void
.end method
