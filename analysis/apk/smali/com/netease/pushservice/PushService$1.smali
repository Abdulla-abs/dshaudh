.class Lcom/netease/pushservice/PushService$1;
.super Ljava/lang/Object;
.source "PushService.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/pushservice/PushService;->onCreate()V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/netease/pushservice/PushService;


# direct methods
.method constructor <init>(Lcom/netease/pushservice/PushService;)V
    .locals 0

    .prologue
    .line 1
    iput-object p1, p0, Lcom/netease/pushservice/PushService$1;->this$0:Lcom/netease/pushservice/PushService;

    .line 66
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 1

    .prologue
    .line 68
    iget-object v0, p0, Lcom/netease/pushservice/PushService$1;->this$0:Lcom/netease/pushservice/PushService;

    invoke-virtual {v0}, Lcom/netease/pushservice/PushService;->start()V

    .line 69
    return-void
.end method
