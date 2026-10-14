.class Lcom/netease/pushservice/Network$3;
.super Ljava/util/TimerTask;
.source "Network.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/pushservice/Network;->startHeartBeat()V
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
    iput-object p1, p0, Lcom/netease/pushservice/Network$3;->this$0:Lcom/netease/pushservice/Network;

    .line 193
    invoke-direct {p0}, Ljava/util/TimerTask;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 3

    .prologue
    const/4 v2, 0x2

    .line 196
    new-array v0, v2, [B

    .line 197
    .local v0, "data":[B
    const/4 v1, 0x0

    invoke-static {v0, v1, v2}, Lcom/netease/push/proto/ProtoClientWrapper;->Uint16ToBytes([BII)V

    .line 198
    iget-object v1, p0, Lcom/netease/pushservice/Network$3;->this$0:Lcom/netease/pushservice/Network;

    invoke-virtual {v1, v0}, Lcom/netease/pushservice/Network;->sendData([B)V

    .line 199
    invoke-static {}, Lcom/netease/pushservice/Network;->access$0()Ljava/lang/String;

    move-result-object v1

    const-string v2, "sent a heart beat"

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 200
    return-void
.end method
