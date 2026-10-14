.class Lcom/netease/ntunisdk/base/SdkBase$54;
.super Ljava/lang/Object;
.source "SdkBase.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/ntunisdk/base/SdkBase;->ntConsume(Lcom/netease/ntunisdk/base/OrderInfo;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/netease/ntunisdk/base/SdkBase;

.field final synthetic val$order:Lcom/netease/ntunisdk/base/OrderInfo;


# direct methods
.method constructor <init>(Lcom/netease/ntunisdk/base/SdkBase;Lcom/netease/ntunisdk/base/OrderInfo;)V
    .locals 0

    .prologue
    .line 2333
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase$54;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iput-object p2, p0, Lcom/netease/ntunisdk/base/SdkBase$54;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 5

    .prologue
    .line 2336
    iget-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase$54;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v2}, Lcom/netease/ntunisdk/base/OrderInfo;->getOrderChannel()Ljava/lang/String;

    move-result-object v0

    .line 2337
    .local v0, "payChannel":Ljava/lang/String;
    iget-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase$54;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v2}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v0, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_0

    .line 2338
    iget-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase$54;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$54;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v2, v3}, Lcom/netease/ntunisdk/base/SdkBase;->consume(Lcom/netease/ntunisdk/base/OrderInfo;)V

    .line 2348
    :goto_0
    return-void

    .line 2340
    :cond_0
    iget-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase$54;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v2, v2, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v2, v0}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Lcom/netease/ntunisdk/base/SdkBase;

    .line 2341
    .local v1, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    if-eqz v1, :cond_1

    .line 2342
    iget-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase$54;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->consume(Lcom/netease/ntunisdk/base/OrderInfo;)V

    goto :goto_0

    .line 2344
    :cond_1
    const-string v2, "UniSDK Base"

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    const-string v4, "orderChannel SdkBase is null, use login channel: "

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    iget-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase$54;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v4}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->w(Ljava/lang/String;Ljava/lang/String;)I

    .line 2345
    iget-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase$54;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$54;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v2, v3}, Lcom/netease/ntunisdk/base/SdkBase;->consume(Lcom/netease/ntunisdk/base/OrderInfo;)V

    goto :goto_0
.end method
