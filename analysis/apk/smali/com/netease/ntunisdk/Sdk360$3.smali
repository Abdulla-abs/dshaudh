.class Lcom/netease/ntunisdk/Sdk360$3;
.super Ljava/lang/Object;
.source "Sdk360.java"

# interfaces
.implements Lcom/qihoo/gamecenter/sdk/common/IDispatcherCallback;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/ntunisdk/Sdk360;->checkOrder(Lcom/netease/ntunisdk/base/OrderInfo;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/netease/ntunisdk/Sdk360;

.field final synthetic val$order:Lcom/netease/ntunisdk/base/OrderInfo;


# direct methods
.method constructor <init>(Lcom/netease/ntunisdk/Sdk360;Lcom/netease/ntunisdk/base/OrderInfo;)V
    .locals 0

    .prologue
    .line 239
    iput-object p1, p0, Lcom/netease/ntunisdk/Sdk360$3;->this$0:Lcom/netease/ntunisdk/Sdk360;

    iput-object p2, p0, Lcom/netease/ntunisdk/Sdk360$3;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public onFinished(Ljava/lang/String;)V
    .locals 6
    .param p1, "data"    # Ljava/lang/String;

    .prologue
    .line 243
    iget-object v3, p0, Lcom/netease/ntunisdk/Sdk360$3;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    const/4 v4, 0x1

    invoke-virtual {v3, v4}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderStatus(I)V

    .line 245
    :try_start_0
    new-instance v2, Lorg/json/JSONObject;

    invoke-direct {v2, p1}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    .line 248
    .local v2, "jsonRes":Lorg/json/JSONObject;
    const-string v3, "error_code"

    invoke-virtual {v2, v3}, Lorg/json/JSONObject;->getInt(Ljava/lang/String;)I
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    move-result v1

    .line 249
    .local v1, "errorCode":I
    packed-switch v1, :pswitch_data_0

    .line 266
    .end local v1    # "errorCode":I
    .end local v2    # "jsonRes":Lorg/json/JSONObject;
    :goto_0
    iget-object v3, p0, Lcom/netease/ntunisdk/Sdk360$3;->this$0:Lcom/netease/ntunisdk/Sdk360;

    iget-object v4, p0, Lcom/netease/ntunisdk/Sdk360$3;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-virtual {v3, v4}, Lcom/netease/ntunisdk/Sdk360;->checkOrderDone(Lcom/netease/ntunisdk/base/OrderInfo;)V

    .line 267
    return-void

    .line 251
    .restart local v1    # "errorCode":I
    .restart local v2    # "jsonRes":Lorg/json/JSONObject;
    :pswitch_0
    :try_start_1
    iget-object v3, p0, Lcom/netease/ntunisdk/Sdk360$3;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    const/4 v4, 0x2

    invoke-virtual {v3, v4}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderStatus(I)V
    :try_end_1
    .catch Lorg/json/JSONException; {:try_start_1 .. :try_end_1} :catch_0

    goto :goto_0

    .line 260
    .end local v1    # "errorCode":I
    .end local v2    # "jsonRes":Lorg/json/JSONObject;
    :catch_0
    move-exception v0

    .line 261
    .local v0, "e":Lorg/json/JSONException;
    const-string v3, "Sdk360"

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    const-string v5, "json error:"

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v0}, Lorg/json/JSONException;->getMessage()Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v3, v4}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 262
    iget-object v3, p0, Lcom/netease/ntunisdk/Sdk360$3;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    const/4 v4, 0x5

    invoke-virtual {v3, v4}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderStatus(I)V

    .line 263
    iget-object v3, p0, Lcom/netease/ntunisdk/Sdk360$3;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    const-string v5, "json error:"

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v0}, Lorg/json/JSONException;->getMessage()Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v3, v4}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderErrReason(Ljava/lang/String;)V

    .line 264
    invoke-virtual {v0}, Lorg/json/JSONException;->printStackTrace()V

    goto :goto_0

    .line 254
    .end local v0    # "e":Lorg/json/JSONException;
    .restart local v1    # "errorCode":I
    .restart local v2    # "jsonRes":Lorg/json/JSONObject;
    :pswitch_1
    :try_start_2
    iget-object v3, p0, Lcom/netease/ntunisdk/Sdk360$3;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    const/4 v4, 0x3

    invoke-virtual {v3, v4}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderStatus(I)V

    .line 255
    iget-object v3, p0, Lcom/netease/ntunisdk/Sdk360$3;->val$order:Lcom/netease/ntunisdk/base/OrderInfo;

    const-string v4, "error_msg"

    invoke-virtual {v2, v4}, Lorg/json/JSONObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v3, v4}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderErrReason(Ljava/lang/String;)V
    :try_end_2
    .catch Lorg/json/JSONException; {:try_start_2 .. :try_end_2} :catch_0

    goto :goto_0

    .line 249
    :pswitch_data_0
    .packed-switch -0x1
        :pswitch_1
        :pswitch_0
        :pswitch_1
    .end packed-switch
.end method
