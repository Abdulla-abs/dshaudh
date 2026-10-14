.class Lcom/netease/ntunisdk/base/SdkBase$7;
.super Ljava/lang/Object;
.source "SdkBase.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/ntunisdk/base/SdkBase;->createOrder(Lcom/netease/ntunisdk/base/OrderInfo;)V
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
    .line 657
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iput-object p2, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 15

    .prologue
    .line 661
    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    const-string v10, "UNISDK_CREATEORDER_URL"

    invoke-virtual {v9, v10}, Lcom/netease/ntunisdk/base/SdkBase;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v8

    .line 662
    .local v8, "url":Ljava/lang/String;
    invoke-static {v8}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v9

    if-eqz v9, :cond_1

    .line 663
    const-string v9, "UniSDK Base"

    const-string v10, "\u8bf7\u6c42\u8ba2\u5355\u7684url\u4e3a\u7a7a"

    invoke-static {v9, v10}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 664
    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    const/4 v10, 0x3

    invoke-virtual {v9, v10}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderStatus(I)V

    .line 665
    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    const-string v10, "create order fail"

    invoke-virtual {v9, v10}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderErrReason(Ljava/lang/String;)V

    .line 666
    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v10, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v9, v10}, Lcom/netease/ntunisdk/base/SdkBase;->checkOrderDone(Lcom/netease/ntunisdk/base/OrderInfo;)V

    .line 730
    :cond_0
    :goto_0
    return-void

    .line 669
    :cond_1
    new-instance v4, Ljava/util/ArrayList;

    invoke-direct {v4}, Ljava/util/ArrayList;-><init>()V

    .line 670
    .local v4, "kvPairs":Ljava/util/List;, "Ljava/util/List<Lorg/apache/http/NameValuePair;>;"
    new-instance v9, Lorg/apache/http/message/BasicNameValuePair;

    const-string v10, "uid"

    iget-object v11, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    const-string v12, "UIN"

    invoke-virtual {v11, v12}, Lcom/netease/ntunisdk/base/SdkBase;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v11

    invoke-direct {v9, v10, v11}, Lorg/apache/http/message/BasicNameValuePair;-><init>(Ljava/lang/String;Ljava/lang/String;)V

    invoke-interface {v4, v9}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 671
    new-instance v9, Lorg/apache/http/message/BasicNameValuePair;

    const-string v10, "loginchannel"

    iget-object v11, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v11}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v11

    invoke-direct {v9, v10, v11}, Lorg/apache/http/message/BasicNameValuePair;-><init>(Ljava/lang/String;Ljava/lang/String;)V

    invoke-interface {v4, v9}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 672
    new-instance v9, Lorg/apache/http/message/BasicNameValuePair;

    const-string v10, "paychannel"

    iget-object v11, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v12, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v12}, Lcom/netease/ntunisdk/base/OrderInfo;->getProductId()Ljava/lang/String;

    move-result-object v12

    invoke-virtual {v11, v12}, Lcom/netease/ntunisdk/base/SdkBase;->getPayChannelByPid(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v11

    invoke-direct {v9, v10, v11}, Lorg/apache/http/message/BasicNameValuePair;-><init>(Ljava/lang/String;Ljava/lang/String;)V

    invoke-interface {v4, v9}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 673
    new-instance v9, Lorg/apache/http/message/BasicNameValuePair;

    const-string v10, "platform"

    iget-object v11, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v11}, Lcom/netease/ntunisdk/base/SdkBase;->getPlatform()Ljava/lang/String;

    move-result-object v11

    invoke-direct {v9, v10, v11}, Lorg/apache/http/message/BasicNameValuePair;-><init>(Ljava/lang/String;Ljava/lang/String;)V

    invoke-interface {v4, v9}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 674
    new-instance v9, Lorg/apache/http/message/BasicNameValuePair;

    const-string v10, "appchannel"

    iget-object v11, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v11}, Lcom/netease/ntunisdk/base/SdkBase;->getAppChannel()Ljava/lang/String;

    move-result-object v11

    invoke-direct {v9, v10, v11}, Lorg/apache/http/message/BasicNameValuePair;-><init>(Ljava/lang/String;Ljava/lang/String;)V

    invoke-interface {v4, v9}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 675
    new-instance v9, Lorg/apache/http/message/BasicNameValuePair;

    const-string v10, "bid"

    iget-object v11, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v11}, Lcom/netease/ntunisdk/base/OrderInfo;->getProductId()Ljava/lang/String;

    move-result-object v11

    invoke-direct {v9, v10, v11}, Lorg/apache/http/message/BasicNameValuePair;-><init>(Ljava/lang/String;Ljava/lang/String;)V

    invoke-interface {v4, v9}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 676
    new-instance v9, Lorg/apache/http/message/BasicNameValuePair;

    const-string v10, "count"

    new-instance v11, Ljava/lang/StringBuilder;

    invoke-direct {v11}, Ljava/lang/StringBuilder;-><init>()V

    iget-object v12, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v12}, Lcom/netease/ntunisdk/base/OrderInfo;->getCount()I

    move-result v12

    invoke-virtual {v11, v12}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v11

    const-string v12, ""

    invoke-virtual {v11, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v11

    invoke-virtual {v11}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v11

    invoke-direct {v9, v10, v11}, Lorg/apache/http/message/BasicNameValuePair;-><init>(Ljava/lang/String;Ljava/lang/String;)V

    invoke-interface {v4, v9}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 677
    new-instance v9, Lorg/apache/http/message/BasicNameValuePair;

    const-string v10, "aid"

    new-instance v11, Ljava/lang/StringBuilder;

    invoke-direct {v11}, Ljava/lang/StringBuilder;-><init>()V

    iget-object v12, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    const-string v13, "USERINFO_AID"

    const/4 v14, -0x1

    invoke-virtual {v12, v13, v14}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v12

    invoke-virtual {v11, v12}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v11

    const-string v12, ""

    invoke-virtual {v11, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v11

    invoke-virtual {v11}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v11

    invoke-direct {v9, v10, v11}, Lorg/apache/http/message/BasicNameValuePair;-><init>(Ljava/lang/String;Ljava/lang/String;)V

    invoke-interface {v4, v9}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 678
    new-instance v9, Lorg/apache/http/message/BasicNameValuePair;

    const-string v10, "ip"

    iget-object v11, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v11, v11, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    invoke-static {v11}, Lcom/netease/ntunisdk/base/UniSdkUtils;->getLocalIpAddress(Landroid/content/Context;)Ljava/lang/String;

    move-result-object v11

    invoke-direct {v9, v10, v11}, Lorg/apache/http/message/BasicNameValuePair;-><init>(Ljava/lang/String;Ljava/lang/String;)V

    invoke-interface {v4, v9}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 679
    new-instance v9, Lorg/apache/http/message/BasicNameValuePair;

    const-string v10, "sdkversion"

    iget-object v11, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v12, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v13, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v13}, Lcom/netease/ntunisdk/base/OrderInfo;->getProductId()Ljava/lang/String;

    move-result-object v13

    invoke-virtual {v12, v13}, Lcom/netease/ntunisdk/base/SdkBase;->getPayChannelByPid(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v12

    invoke-virtual {v11, v12}, Lcom/netease/ntunisdk/base/SdkBase;->getSDKVersion(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v11

    invoke-direct {v9, v10, v11}, Lorg/apache/http/message/BasicNameValuePair;-><init>(Ljava/lang/String;Ljava/lang/String;)V

    invoke-interface {v4, v9}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 680
    new-instance v9, Lorg/apache/http/message/BasicNameValuePair;

    const-string v10, "udid"

    iget-object v11, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v11}, Lcom/netease/ntunisdk/base/SdkBase;->getUdid()Ljava/lang/String;

    move-result-object v11

    invoke-direct {v9, v10, v11}, Lorg/apache/http/message/BasicNameValuePair;-><init>(Ljava/lang/String;Ljava/lang/String;)V

    invoke-interface {v4, v9}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 681
    new-instance v9, Lorg/apache/http/message/BasicNameValuePair;

    const-string v10, "roleid"

    iget-object v11, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    const-string v12, "USERINFO_UID"

    invoke-virtual {v11, v12}, Lcom/netease/ntunisdk/base/SdkBase;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v11

    invoke-direct {v9, v10, v11}, Lorg/apache/http/message/BasicNameValuePair;-><init>(Ljava/lang/String;Ljava/lang/String;)V

    invoke-interface {v4, v9}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 682
    new-instance v9, Lorg/apache/http/message/BasicNameValuePair;

    const-string v10, "deviceid"

    iget-object v11, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    const-string v12, "DEVICE_ID"

    invoke-virtual {v11, v12}, Lcom/netease/ntunisdk/base/SdkBase;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v11

    invoke-direct {v9, v10, v11}, Lorg/apache/http/message/BasicNameValuePair;-><init>(Ljava/lang/String;Ljava/lang/String;)V

    invoke-interface {v4, v9}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 684
    invoke-static {v8, v4}, Lcom/netease/ntunisdk/base/utils/NetUtil;->doPost(Ljava/lang/String;Ljava/util/List;)Lorg/apache/http/HttpResponse;

    move-result-object v5

    .line 688
    .local v5, "response":Lorg/apache/http/HttpResponse;
    if-eqz v5, :cond_4

    .line 689
    :try_start_0
    invoke-interface {v5}, Lorg/apache/http/HttpResponse;->getEntity()Lorg/apache/http/HttpEntity;

    move-result-object v9

    invoke-static {v9}, Lorg/apache/http/util/EntityUtils;->toString(Lorg/apache/http/HttpEntity;)Ljava/lang/String;

    move-result-object v7

    .line 691
    .local v7, "temp":Ljava/lang/String;
    const-string v9, "UniSDK Base"

    new-instance v10, Ljava/lang/StringBuilder;

    invoke-direct {v10}, Ljava/lang/StringBuilder;-><init>()V

    const-string v11, "temp ="

    invoke-virtual {v10, v11}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v10

    invoke-virtual {v10, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v10

    invoke-virtual {v10}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v10

    invoke-static {v9, v10}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 692
    invoke-static {v7}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v9

    if-nez v9, :cond_0

    .line 693
    new-instance v3, Lorg/json/JSONObject;

    invoke-direct {v3, v7}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    .line 694
    .local v3, "json":Lorg/json/JSONObject;
    const-string v9, "code"

    invoke-virtual {v3, v9}, Lorg/json/JSONObject;->getInt(Ljava/lang/String;)I

    move-result v0

    .line 695
    .local v0, "code":I
    const/16 v9, 0xc8

    if-ne v9, v0, :cond_3

    .line 696
    const-string v9, "sn"

    invoke-virtual {v3, v9}, Lorg/json/JSONObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6

    .line 697
    .local v6, "sn":Ljava/lang/String;
    const-string v9, "etc"

    invoke-virtual {v3, v9}, Lorg/json/JSONObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    .line 698
    .local v2, "etc":Ljava/lang/String;
    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v9, v6}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderId(Ljava/lang/String;)V

    .line 699
    invoke-static {v2}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v9

    if-nez v9, :cond_2

    .line 700
    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v9, v2}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderEtc(Ljava/lang/String;)V

    .line 702
    :cond_2
    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v10, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-static {v9, v10}, Lcom/netease/ntunisdk/base/SdkBase;->access$300(Lcom/netease/ntunisdk/base/SdkBase;Lcom/netease/ntunisdk/base/OrderInfo;)V
    :try_end_0
    .catch Lorg/apache/http/ParseException; {:try_start_0 .. :try_end_0} :catch_0
    .catch Ljava/io/IOException; {:try_start_0 .. :try_end_0} :catch_1
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_2

    goto/16 :goto_0

    .line 714
    .end local v0    # "code":I
    .end local v2    # "etc":Ljava/lang/String;
    .end local v3    # "json":Lorg/json/JSONObject;
    .end local v6    # "sn":Ljava/lang/String;
    .end local v7    # "temp":Ljava/lang/String;
    :catch_0
    move-exception v1

    .line 715
    .local v1, "e":Lorg/apache/http/ParseException;
    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    const/4 v10, 0x3

    invoke-virtual {v9, v10}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderStatus(I)V

    .line 716
    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    const-string v10, "create order fail"

    invoke-virtual {v9, v10}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderErrReason(Ljava/lang/String;)V

    .line 717
    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v10, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v9, v10}, Lcom/netease/ntunisdk/base/SdkBase;->checkOrderDone(Lcom/netease/ntunisdk/base/OrderInfo;)V

    .line 718
    invoke-virtual {v1}, Lorg/apache/http/ParseException;->printStackTrace()V

    goto/16 :goto_0

    .line 704
    .end local v1    # "e":Lorg/apache/http/ParseException;
    .restart local v0    # "code":I
    .restart local v3    # "json":Lorg/json/JSONObject;
    .restart local v7    # "temp":Ljava/lang/String;
    :cond_3
    :try_start_1
    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    const/4 v10, 0x3

    invoke-virtual {v9, v10}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderStatus(I)V

    .line 705
    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    const-string v10, "create order fail"

    invoke-virtual {v9, v10}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderErrReason(Ljava/lang/String;)V

    .line 706
    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v10, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v9, v10}, Lcom/netease/ntunisdk/base/SdkBase;->checkOrderDone(Lcom/netease/ntunisdk/base/OrderInfo;)V
    :try_end_1
    .catch Lorg/apache/http/ParseException; {:try_start_1 .. :try_end_1} :catch_0
    .catch Ljava/io/IOException; {:try_start_1 .. :try_end_1} :catch_1
    .catch Lorg/json/JSONException; {:try_start_1 .. :try_end_1} :catch_2

    goto/16 :goto_0

    .line 719
    .end local v0    # "code":I
    .end local v3    # "json":Lorg/json/JSONObject;
    .end local v7    # "temp":Ljava/lang/String;
    :catch_1
    move-exception v1

    .line 720
    .local v1, "e":Ljava/io/IOException;
    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    const/4 v10, 0x3

    invoke-virtual {v9, v10}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderStatus(I)V

    .line 721
    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    const-string v10, "create order fail"

    invoke-virtual {v9, v10}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderErrReason(Ljava/lang/String;)V

    .line 722
    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v10, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v9, v10}, Lcom/netease/ntunisdk/base/SdkBase;->checkOrderDone(Lcom/netease/ntunisdk/base/OrderInfo;)V

    .line 723
    invoke-virtual {v1}, Ljava/io/IOException;->printStackTrace()V

    goto/16 :goto_0

    .line 710
    .end local v1    # "e":Ljava/io/IOException;
    :cond_4
    :try_start_2
    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    const/4 v10, 0x3

    invoke-virtual {v9, v10}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderStatus(I)V

    .line 711
    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    const-string v10, "create order fail"

    invoke-virtual {v9, v10}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderErrReason(Ljava/lang/String;)V

    .line 712
    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v10, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v9, v10}, Lcom/netease/ntunisdk/base/SdkBase;->checkOrderDone(Lcom/netease/ntunisdk/base/OrderInfo;)V
    :try_end_2
    .catch Lorg/apache/http/ParseException; {:try_start_2 .. :try_end_2} :catch_0
    .catch Ljava/io/IOException; {:try_start_2 .. :try_end_2} :catch_1
    .catch Lorg/json/JSONException; {:try_start_2 .. :try_end_2} :catch_2

    goto/16 :goto_0

    .line 724
    :catch_2
    move-exception v1

    .line 725
    .local v1, "e":Lorg/json/JSONException;
    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    const/4 v10, 0x3

    invoke-virtual {v9, v10}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderStatus(I)V

    .line 726
    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    const-string v10, "create order fail"

    invoke-virtual {v9, v10}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderErrReason(Ljava/lang/String;)V

    .line 727
    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v10, p0, Lcom/netease/ntunisdk/base/SdkBase$7;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v9, v10}, Lcom/netease/ntunisdk/base/SdkBase;->checkOrderDone(Lcom/netease/ntunisdk/base/OrderInfo;)V

    .line 728
    invoke-virtual {v1}, Lorg/json/JSONException;->printStackTrace()V

    goto/16 :goto_0
.end method
