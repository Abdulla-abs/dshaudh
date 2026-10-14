.class Lcom/netease/pushservice/PushServiceHelper$1;
.super Ljava/lang/Object;
.source "PushServiceHelper.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/pushservice/PushServiceHelper;->processCommand(Lcom/netease/pushservice/PushService;Landroid/content/Intent;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/netease/pushservice/PushServiceHelper;

.field private final synthetic val$packageName:Ljava/lang/String;


# direct methods
.method constructor <init>(Lcom/netease/pushservice/PushServiceHelper;Ljava/lang/String;)V
    .locals 0

    .prologue
    .line 1
    iput-object p1, p0, Lcom/netease/pushservice/PushServiceHelper$1;->this$0:Lcom/netease/pushservice/PushServiceHelper;

    iput-object p2, p0, Lcom/netease/pushservice/PushServiceHelper$1;->val$packageName:Ljava/lang/String;

    .line 302
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 2

    .prologue
    .line 304
    invoke-static {}, Lcom/netease/pushservice/PushServiceHelper;->access$0()Ljava/lang/String;

    move-result-object v0

    const-string v1, "SERVICE_METHOD_REGISTER"

    invoke-static {v0, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 305
    iget-object v0, p0, Lcom/netease/pushservice/PushServiceHelper$1;->this$0:Lcom/netease/pushservice/PushServiceHelper;

    iget-object v1, p0, Lcom/netease/pushservice/PushServiceHelper$1;->val$packageName:Ljava/lang/String;

    invoke-static {v0, v1}, Lcom/netease/pushservice/PushServiceHelper;->access$1(Lcom/netease/pushservice/PushServiceHelper;Ljava/lang/String;)V

    .line 306
    return-void
.end method
