.class Lcom/netease/ntunisdk/base/SdkBase$6;
.super Ljava/lang/Object;
.source "SdkBase.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/ntunisdk/base/SdkBase;->_ntCheckOrder(Lcom/netease/ntunisdk/base/OrderInfo;)V
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
    .line 592
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iput-object p2, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 7

    .prologue
    const/16 v6, 0x8

    .line 596
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-static {v3}, Lcom/netease/ntunisdk/base/SdkBase;->access$400(Lcom/netease/ntunisdk/base/SdkBase;)Ljava/util/Map;

    move-result-object v3

    iget-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v4}, Lcom/netease/ntunisdk/base/OrderInfo;->getOrderId()Ljava/lang/String;

    move-result-object v4

    invoke-interface {v3, v4}, Ljava/util/Map;->containsKey(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_0

    .line 597
    const-string v3, "UniSDK Base"

    const-string v4, "repeated orderId"

    invoke-static {v3, v4}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 598
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v3, v4}, Lcom/netease/ntunisdk/base/SdkBase;->checkOrderDone(Lcom/netease/ntunisdk/base/OrderInfo;)V

    .line 647
    :goto_0
    return-void

    .line 601
    :cond_0
    new-instance v1, Ljava/text/SimpleDateFormat;

    const-string v3, "yyyyMMddHHmmss"

    sget-object v4, Ljava/util/Locale;->CHINA:Ljava/util/Locale;

    invoke-direct {v1, v3, v4}, Ljava/text/SimpleDateFormat;-><init>(Ljava/lang/String;Ljava/util/Locale;)V

    .line 602
    .local v1, "sdf":Ljava/text/SimpleDateFormat;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-static {v3}, Lcom/netease/ntunisdk/base/SdkBase;->access$400(Lcom/netease/ntunisdk/base/SdkBase;)Ljava/util/Map;

    move-result-object v3

    iget-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v4}, Lcom/netease/ntunisdk/base/OrderInfo;->getOrderId()Ljava/lang/String;

    move-result-object v4

    new-instance v5, Ljava/util/Date;

    invoke-direct {v5}, Ljava/util/Date;-><init>()V

    invoke-virtual {v1, v5}, Ljava/text/SimpleDateFormat;->format(Ljava/util/Date;)Ljava/lang/String;

    move-result-object v5

    invoke-interface {v3, v4, v5}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 606
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v3}, Lcom/netease/ntunisdk/base/OrderInfo;->getOrderId()Ljava/lang/String;

    move-result-object v3

    invoke-static {v3}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v3

    if-eqz v3, :cond_1

    .line 607
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v3, v6}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderStatus(I)V

    .line 608
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    const-string v4, "\u8ba2\u5355\u53f7\u4e3a\u7a7a"

    invoke-virtual {v3, v4}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderErrReason(Ljava/lang/String;)V

    .line 609
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v3, v4}, Lcom/netease/ntunisdk/base/SdkBase;->checkOrderDone(Lcom/netease/ntunisdk/base/OrderInfo;)V

    goto :goto_0

    .line 614
    :cond_1
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v4}, Lcom/netease/ntunisdk/base/OrderInfo;->getOrderId()Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v3, v4}, Lcom/netease/ntunisdk/base/SdkBase;->isValidOrderId(Ljava/lang/String;)Z

    move-result v3

    if-nez v3, :cond_2

    .line 615
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v3, v6}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderStatus(I)V

    .line 616
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    const-string v4, "\u8ba2\u5355\u53f7\u8d85\u957f"

    invoke-virtual {v3, v4}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderErrReason(Ljava/lang/String;)V

    .line 617
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v3, v4}, Lcom/netease/ntunisdk/base/SdkBase;->checkOrderDone(Lcom/netease/ntunisdk/base/OrderInfo;)V

    goto :goto_0

    .line 621
    :cond_2
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v3}, Lcom/netease/ntunisdk/base/OrderInfo;->getOrderChannel()Ljava/lang/String;

    move-result-object v0

    .line 622
    .local v0, "payChannel":Ljava/lang/String;
    invoke-static {v0}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v3

    if-eqz v3, :cond_3

    .line 623
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v3}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v0

    .line 624
    const-string v3, "UniSDK Base"

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    const-string v5, "payChannel is null, use login channel: "

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v3, v4}, Landroid/util/Log;->w(Ljava/lang/String;Ljava/lang/String;)I

    .line 627
    :cond_3
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v3, v0}, Lcom/netease/ntunisdk/base/SdkBase;->isTelecomChannel(Ljava/lang/String;)Z

    move-result v3

    if-eqz v3, :cond_4

    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v3, v0}, Lcom/netease/ntunisdk/base/SdkBase;->isValidTelecomChannel(Ljava/lang/String;)Z

    move-result v3

    if-nez v3, :cond_4

    .line 629
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    const/4 v4, 0x3

    invoke-virtual {v3, v4}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderStatus(I)V

    .line 630
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    const-string v4, "apk\u91cc\u6ca1\u6709\u4e0esim\u5361\u5bf9\u5e94\u7684\u6e20\u9053"

    invoke-virtual {v3, v4}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderErrReason(Ljava/lang/String;)V

    .line 631
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v3, v4}, Lcom/netease/ntunisdk/base/SdkBase;->checkOrderDone(Lcom/netease/ntunisdk/base/OrderInfo;)V

    goto/16 :goto_0

    .line 635
    :cond_4
    const-string v3, "UniSDK Base"

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    const-string v5, "try ntCheckOrder, pid="

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    iget-object v5, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v5}, Lcom/netease/ntunisdk/base/OrderInfo;->getProductId()Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    const-string v5, ", payChannel="

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    const-string v5, ", orderId="

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    iget-object v5, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v5}, Lcom/netease/ntunisdk/base/OrderInfo;->getOrderId()Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v3, v4}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 636
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v3}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v0, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_5

    .line 637
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v3, v4}, Lcom/netease/ntunisdk/base/SdkBase;->checkOrder(Lcom/netease/ntunisdk/base/OrderInfo;)V

    goto/16 :goto_0

    .line 639
    :cond_5
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v3, v3, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v0}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 640
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    if-nez v2, :cond_6

    .line 641
    const-string v3, "UniSDK Base"

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    const-string v5, "orderChannel SdkBase is null, use login channel: "

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    iget-object v5, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v5}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v3, v4}, Landroid/util/Log;->w(Ljava/lang/String;Ljava/lang/String;)I

    .line 642
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v3, v4}, Lcom/netease/ntunisdk/base/SdkBase;->checkOrder(Lcom/netease/ntunisdk/base/OrderInfo;)V

    goto/16 :goto_0

    .line 644
    :cond_6
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$6;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v2, v3}, Lcom/netease/ntunisdk/base/SdkBase;->checkOrder(Lcom/netease/ntunisdk/base/OrderInfo;)V

    goto/16 :goto_0
.end method
