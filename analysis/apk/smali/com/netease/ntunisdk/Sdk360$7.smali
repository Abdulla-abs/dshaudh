.class Lcom/netease/ntunisdk/Sdk360$7;
.super Ljava/lang/Object;
.source "Sdk360.java"

# interfaces
.implements Lcom/qihoo/gamecenter/sdk/common/IDispatcherCallback;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/ntunisdk/Sdk360;->antiAddiction(Ljava/lang/String;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/netease/ntunisdk/Sdk360;


# direct methods
.method constructor <init>(Lcom/netease/ntunisdk/Sdk360;)V
    .locals 0

    .prologue
    .line 507
    iput-object p1, p0, Lcom/netease/ntunisdk/Sdk360$7;->this$0:Lcom/netease/ntunisdk/Sdk360;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public onFinished(Ljava/lang/String;)V
    .locals 9
    .param p1, "data"    # Ljava/lang/String;

    .prologue
    .line 511
    const-string v6, "antiAddiction_log"

    invoke-static {v6, p1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 512
    invoke-static {p1}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v6

    if-nez v6, :cond_0

    .line 514
    :try_start_0
    new-instance v3, Lorg/json/JSONObject;

    invoke-direct {v3, p1}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    .line 515
    .local v3, "resultJson":Lorg/json/JSONObject;
    const-string v6, "error_code"

    invoke-virtual {v3, v6}, Lorg/json/JSONObject;->getInt(Ljava/lang/String;)I

    move-result v2

    .line 516
    .local v2, "errorCode":I
    const-string v6, "antiAddiction_log"

    new-instance v7, Ljava/lang/StringBuilder;

    invoke-direct {v7}, Ljava/lang/StringBuilder;-><init>()V

    const-string v8, "errorCode:"

    invoke-virtual {v7, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v7

    invoke-virtual {v7, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v7

    invoke-virtual {v7}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v7

    invoke-static {v6, v7}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 517
    if-nez v2, :cond_2

    .line 518
    const-string v6, "content"

    invoke-virtual {v3, v6}, Lorg/json/JSONObject;->getJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v0

    .line 519
    .local v0, "contentData":Lorg/json/JSONObject;
    const-string v6, "ret"

    invoke-virtual {v0, v6}, Lorg/json/JSONObject;->getJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v4

    .line 520
    .local v4, "retData":Lorg/json/JSONArray;
    const/4 v6, 0x0

    invoke-virtual {v4, v6}, Lorg/json/JSONArray;->getJSONObject(I)Lorg/json/JSONObject;

    move-result-object v6

    const-string v7, "status"

    invoke-virtual {v6, v7}, Lorg/json/JSONObject;->getInt(Ljava/lang/String;)I

    move-result v5

    .line 521
    .local v5, "status":I
    if-nez v5, :cond_1

    .line 523
    iget-object v6, p0, Lcom/netease/ntunisdk/Sdk360$7;->this$0:Lcom/netease/ntunisdk/Sdk360;

    invoke-virtual {v6}, Lcom/netease/ntunisdk/Sdk360;->doSdkRealNameRegister()V

    .line 537
    .end local v0    # "contentData":Lorg/json/JSONObject;
    .end local v2    # "errorCode":I
    .end local v3    # "resultJson":Lorg/json/JSONObject;
    .end local v4    # "retData":Lorg/json/JSONArray;
    .end local v5    # "status":I
    :cond_0
    :goto_0
    return-void

    .line 525
    .restart local v0    # "contentData":Lorg/json/JSONObject;
    .restart local v2    # "errorCode":I
    .restart local v3    # "resultJson":Lorg/json/JSONObject;
    .restart local v4    # "retData":Lorg/json/JSONArray;
    .restart local v5    # "status":I
    :cond_1
    const/4 v6, 0x1

    if-eq v5, v6, :cond_0

    .line 527
    const/4 v6, 0x2

    if-ne v5, v6, :cond_0

    goto :goto_0

    .line 531
    .end local v0    # "contentData":Lorg/json/JSONObject;
    .end local v4    # "retData":Lorg/json/JSONArray;
    .end local v5    # "status":I
    :cond_2
    iget-object v6, p0, Lcom/netease/ntunisdk/Sdk360$7;->this$0:Lcom/netease/ntunisdk/Sdk360;

    invoke-static {v6}, Lcom/netease/ntunisdk/Sdk360;->access$200(Lcom/netease/ntunisdk/Sdk360;)Landroid/content/Context;

    move-result-object v6

    const-string v7, "error_msg"

    invoke-virtual {v3, v7}, Lorg/json/JSONObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v7

    const/4 v8, 0x0

    invoke-static {v6, v7, v8}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object v6

    invoke-virtual {v6}, Landroid/widget/Toast;->show()V
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    .line 533
    .end local v2    # "errorCode":I
    .end local v3    # "resultJson":Lorg/json/JSONObject;
    :catch_0
    move-exception v1

    .line 534
    .local v1, "e":Lorg/json/JSONException;
    invoke-virtual {v1}, Lorg/json/JSONException;->printStackTrace()V

    goto :goto_0
.end method
