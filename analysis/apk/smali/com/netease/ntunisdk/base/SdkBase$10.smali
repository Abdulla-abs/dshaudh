.class Lcom/netease/ntunisdk/base/SdkBase$10;
.super Ljava/lang/Object;
.source "SdkBase.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/ntunisdk/base/SdkBase;->queryMpayResult(Lcom/netease/ntunisdk/base/OrderInfo;)V
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
    .line 867
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase$10;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iput-object p2, p0, Lcom/netease/ntunisdk/base/SdkBase$10;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 11

    .prologue
    .line 871
    iget-object v7, p0, Lcom/netease/ntunisdk/base/SdkBase$10;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    const-string v8, "UNISDK_QUERYORDER_URL"

    invoke-virtual {v7, v8}, Lcom/netease/ntunisdk/base/SdkBase;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6

    .line 872
    .local v6, "url":Ljava/lang/String;
    invoke-static {v6}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v7

    if-eqz v7, :cond_0

    .line 873
    const-string v7, "UniSDK Base"

    const-string v8, "\u8bf7\u6c42mpay_result\u7684url\u4e3a\u7a7a"

    invoke-static {v7, v8}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 910
    :goto_0
    return-void

    .line 876
    :cond_0
    new-instance v3, Ljava/util/ArrayList;

    invoke-direct {v3}, Ljava/util/ArrayList;-><init>()V

    .line 877
    .local v3, "kvPairs":Ljava/util/List;, "Ljava/util/List<Lorg/apache/http/NameValuePair;>;"
    new-instance v7, Lorg/apache/http/message/BasicNameValuePair;

    const-string v8, "uid"

    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$10;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    const-string v10, "UIN"

    invoke-virtual {v9, v10}, Lcom/netease/ntunisdk/base/SdkBase;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v9

    invoke-direct {v7, v8, v9}, Lorg/apache/http/message/BasicNameValuePair;-><init>(Ljava/lang/String;Ljava/lang/String;)V

    invoke-interface {v3, v7}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 878
    new-instance v7, Lorg/apache/http/message/BasicNameValuePair;

    const-string v8, "loginchannel"

    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$10;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v9}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v9

    invoke-direct {v7, v8, v9}, Lorg/apache/http/message/BasicNameValuePair;-><init>(Ljava/lang/String;Ljava/lang/String;)V

    invoke-interface {v3, v7}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 879
    new-instance v7, Lorg/apache/http/message/BasicNameValuePair;

    const-string v8, "paychannel"

    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$10;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v10, p0, Lcom/netease/ntunisdk/base/SdkBase$10;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v10}, Lcom/netease/ntunisdk/base/OrderInfo;->getProductId()Ljava/lang/String;

    move-result-object v10

    invoke-virtual {v9, v10}, Lcom/netease/ntunisdk/base/SdkBase;->getPayChannelByPid(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v9

    invoke-direct {v7, v8, v9}, Lorg/apache/http/message/BasicNameValuePair;-><init>(Ljava/lang/String;Ljava/lang/String;)V

    invoke-interface {v3, v7}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 880
    new-instance v7, Lorg/apache/http/message/BasicNameValuePair;

    const-string v8, "platform"

    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$10;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v9}, Lcom/netease/ntunisdk/base/SdkBase;->getPlatform()Ljava/lang/String;

    move-result-object v9

    invoke-direct {v7, v8, v9}, Lorg/apache/http/message/BasicNameValuePair;-><init>(Ljava/lang/String;Ljava/lang/String;)V

    invoke-interface {v3, v7}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 881
    new-instance v7, Lorg/apache/http/message/BasicNameValuePair;

    const-string v8, "sn"

    iget-object v9, p0, Lcom/netease/ntunisdk/base/SdkBase$10;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v9}, Lcom/netease/ntunisdk/base/OrderInfo;->getOrderId()Ljava/lang/String;

    move-result-object v9

    invoke-direct {v7, v8, v9}, Lorg/apache/http/message/BasicNameValuePair;-><init>(Ljava/lang/String;Ljava/lang/String;)V

    invoke-interface {v3, v7}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 882
    new-instance v7, Lorg/apache/http/message/BasicNameValuePair;

    const-string v8, "state"

    new-instance v9, Ljava/lang/StringBuilder;

    invoke-direct {v9}, Ljava/lang/StringBuilder;-><init>()V

    iget-object v10, p0, Lcom/netease/ntunisdk/base/SdkBase$10;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v10}, Lcom/netease/ntunisdk/base/OrderInfo;->getOrderStatus()I

    move-result v10

    invoke-virtual {v9, v10}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v9

    const-string v10, ""

    invoke-virtual {v9, v10}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v9

    invoke-virtual {v9}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v9

    invoke-direct {v7, v8, v9}, Lorg/apache/http/message/BasicNameValuePair;-><init>(Ljava/lang/String;Ljava/lang/String;)V

    invoke-interface {v3, v7}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 884
    invoke-static {v6, v3}, Lcom/netease/ntunisdk/base/utils/NetUtil;->doPost(Ljava/lang/String;Ljava/util/List;)Lorg/apache/http/HttpResponse;

    move-result-object v4

    .line 888
    .local v4, "response":Lorg/apache/http/HttpResponse;
    if-eqz v4, :cond_3

    .line 889
    :try_start_0
    invoke-interface {v4}, Lorg/apache/http/HttpResponse;->getEntity()Lorg/apache/http/HttpEntity;

    move-result-object v7

    invoke-static {v7}, Lorg/apache/http/util/EntityUtils;->toString(Lorg/apache/http/HttpEntity;)Ljava/lang/String;

    move-result-object v5

    .line 891
    .local v5, "temp":Ljava/lang/String;
    const-string v7, "UniSDK Base"

    new-instance v8, Ljava/lang/StringBuilder;

    invoke-direct {v8}, Ljava/lang/StringBuilder;-><init>()V

    const-string v9, "temp ="

    invoke-virtual {v8, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v8

    invoke-static {v7, v8}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 892
    invoke-static {v5}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v7

    if-nez v7, :cond_2

    .line 893
    new-instance v2, Lorg/json/JSONObject;

    invoke-direct {v2, v5}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    .line 894
    .local v2, "json":Lorg/json/JSONObject;
    const-string v7, "code"

    invoke-virtual {v2, v7}, Lorg/json/JSONObject;->getInt(Ljava/lang/String;)I

    move-result v0

    .line 895
    .local v0, "code":I
    const/16 v7, 0xc8

    if-ne v7, v0, :cond_1

    .line 896
    const-string v7, "UniSDK Base"

    const-string v8, "\u652f\u4ed8\u901a\u77e5UniSDK\u670d\u52a1\u7aef\u6210\u529f"

    invoke-static {v7, v8}, Lcom/netease/ntunisdk/base/UniSdkUtils;->i(Ljava/lang/String;Ljava/lang/String;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto/16 :goto_0

    .line 906
    .end local v0    # "code":I
    .end local v2    # "json":Lorg/json/JSONObject;
    .end local v5    # "temp":Ljava/lang/String;
    :catch_0
    move-exception v1

    .line 907
    .local v1, "e":Ljava/lang/Exception;
    const-string v7, "UniSDK Base"

    const-string v8, "\u652f\u4ed8\u901a\u77e5UniSDK\u670d\u52a1\u7aef\u5931\u8d25"

    invoke-static {v7, v8}, Lcom/netease/ntunisdk/base/UniSdkUtils;->i(Ljava/lang/String;Ljava/lang/String;)V

    .line 908
    invoke-virtual {v1}, Ljava/lang/Exception;->printStackTrace()V

    goto/16 :goto_0

    .line 898
    .end local v1    # "e":Ljava/lang/Exception;
    .restart local v0    # "code":I
    .restart local v2    # "json":Lorg/json/JSONObject;
    .restart local v5    # "temp":Ljava/lang/String;
    :cond_1
    :try_start_1
    const-string v7, "UniSDK Base"

    new-instance v8, Ljava/lang/StringBuilder;

    invoke-direct {v8}, Ljava/lang/StringBuilder;-><init>()V

    const-string v9, "\u652f\u4ed8\u901a\u77e5UniSDK\u670d\u52a1\u7aef\u5931\u8d25\uff0ccode="

    invoke-virtual {v8, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8, v0}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v8

    invoke-static {v7, v8}, Lcom/netease/ntunisdk/base/UniSdkUtils;->i(Ljava/lang/String;Ljava/lang/String;)V

    goto/16 :goto_0

    .line 901
    .end local v0    # "code":I
    .end local v2    # "json":Lorg/json/JSONObject;
    :cond_2
    const-string v7, "UniSDK Base"

    const-string v8, "\u652f\u4ed8\u901a\u77e5UniSDK\u670d\u52a1\u7aef\u5931\u8d25\uff0cHttpResponse\u8fd4\u56de\u7ed3\u679c\u4e3a\u7a7a"

    invoke-static {v7, v8}, Lcom/netease/ntunisdk/base/UniSdkUtils;->i(Ljava/lang/String;Ljava/lang/String;)V

    goto/16 :goto_0

    .line 904
    .end local v5    # "temp":Ljava/lang/String;
    :cond_3
    const-string v7, "UniSDK Base"

    const-string v8, "\u652f\u4ed8\u901a\u77e5UniSDK\u670d\u52a1\u7aef\u5931\u8d25\uff0cHttpResponse\u8fd4\u56de\u7ed3\u679c\u4e3a\u7a7a"

    invoke-static {v7, v8}, Lcom/netease/ntunisdk/base/UniSdkUtils;->i(Ljava/lang/String;Ljava/lang/String;)V
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_0

    goto/16 :goto_0
.end method
