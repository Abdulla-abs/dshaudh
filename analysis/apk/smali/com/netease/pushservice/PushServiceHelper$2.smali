.class Lcom/netease/pushservice/PushServiceHelper$2;
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
    iput-object p1, p0, Lcom/netease/pushservice/PushServiceHelper$2;->this$0:Lcom/netease/pushservice/PushServiceHelper;

    iput-object p2, p0, Lcom/netease/pushservice/PushServiceHelper$2;->val$packageName:Ljava/lang/String;

    .line 309
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 2

    .prologue
    .line 311
    iget-object v0, p0, Lcom/netease/pushservice/PushServiceHelper$2;->this$0:Lcom/netease/pushservice/PushServiceHelper;

    iget-object v1, p0, Lcom/netease/pushservice/PushServiceHelper$2;->val$packageName:Ljava/lang/String;

    invoke-virtual {v0, v1}, Lcom/netease/pushservice/PushServiceHelper;->removeApp(Ljava/lang/String;)V

    .line 312
    return-void
.end method
