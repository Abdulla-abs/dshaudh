.class Lcom/netease/pushservice/PushServiceHelper$4;
.super Ljava/lang/Object;
.source "PushServiceHelper.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/pushservice/PushServiceHelper;->disconnect()V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/netease/pushservice/PushServiceHelper;


# direct methods
.method constructor <init>(Lcom/netease/pushservice/PushServiceHelper;)V
    .locals 0

    .prologue
    .line 1
    iput-object p1, p0, Lcom/netease/pushservice/PushServiceHelper$4;->this$0:Lcom/netease/pushservice/PushServiceHelper;

    .line 587
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 2

    .prologue
    .line 589
    invoke-static {}, Lcom/netease/pushservice/PushServiceHelper;->access$0()Ljava/lang/String;

    move-result-object v0

    const-string v1, "disconnect+++"

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 590
    iget-object v0, p0, Lcom/netease/pushservice/PushServiceHelper$4;->this$0:Lcom/netease/pushservice/PushServiceHelper;

    invoke-virtual {v0}, Lcom/netease/pushservice/PushServiceHelper;->getNetwork()Lcom/netease/pushservice/Network;

    move-result-object v0

    invoke-virtual {v0}, Lcom/netease/pushservice/Network;->disconnect()V

    .line 591
    invoke-static {}, Lcom/netease/pushservice/PushServiceHelper;->access$0()Ljava/lang/String;

    move-result-object v0

    const-string v1, "disconnect---"

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 592
    return-void
.end method
