.class Lcom/netease/ntunisdk/Sdk360$6;
.super Ljava/lang/Object;
.source "Sdk360.java"

# interfaces
.implements Lcom/qihoo/gamecenter/sdk/common/IDispatcherCallback;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/ntunisdk/Sdk360;->updateRank(Ljava/lang/String;D)V
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
    .line 450
    iput-object p1, p0, Lcom/netease/ntunisdk/Sdk360$6;->this$0:Lcom/netease/ntunisdk/Sdk360;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public onFinished(Ljava/lang/String;)V
    .locals 8
    .param p1, "data"    # Ljava/lang/String;

    .prologue
    .line 453
    invoke-static {p1}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v5

    if-eqz v5, :cond_0

    .line 475
    :goto_0
    return-void

    .line 458
    :cond_0
    :try_start_0
    new-instance v3, Lorg/json/JSONObject;

    invoke-direct {v3, p1}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    .line 459
    .local v3, "json":Lorg/json/JSONObject;
    const-string v5, "error_code"

    invoke-virtual {v3, v5}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v2

    .line 460
    .local v2, "errorCode":I
    if-nez v2, :cond_2

    .line 461
    const-string v5, "data"

    invoke-virtual {v3, v5}, Lorg/json/JSONObject;->getJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v0

    .line 462
    .local v0, "content":Lorg/json/JSONObject;
    const-string v5, "status"

    invoke-virtual {v0, v5}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v4

    .line 463
    .local v4, "status":I
    const/4 v5, 0x1

    if-ne v5, v4, :cond_1

    .line 464
    iget-object v5, p0, Lcom/netease/ntunisdk/Sdk360$6;->this$0:Lcom/netease/ntunisdk/Sdk360;

    const-string v6, "\u66f4\u65b0\u79ef\u5206\u6210\u529f"

    invoke-virtual {v5, v6}, Lcom/netease/ntunisdk/Sdk360;->showMsg(Ljava/lang/String;)V
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    .line 471
    .end local v0    # "content":Lorg/json/JSONObject;
    .end local v2    # "errorCode":I
    .end local v3    # "json":Lorg/json/JSONObject;
    .end local v4    # "status":I
    :catch_0
    move-exception v1

    .line 472
    .local v1, "e":Lorg/json/JSONException;
    const-string v5, "Sdk360"

    new-instance v6, Ljava/lang/StringBuilder;

    invoke-direct {v6}, Ljava/lang/StringBuilder;-><init>()V

    const-string v7, "json error:"

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v1}, Lorg/json/JSONException;->getMessage()Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v6

    invoke-static {v5, v6}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 473
    invoke-virtual {v1}, Lorg/json/JSONException;->printStackTrace()V

    goto :goto_0

    .line 466
    .end local v1    # "e":Lorg/json/JSONException;
    .restart local v0    # "content":Lorg/json/JSONObject;
    .restart local v2    # "errorCode":I
    .restart local v3    # "json":Lorg/json/JSONObject;
    .restart local v4    # "status":I
    :cond_1
    :try_start_1
    iget-object v5, p0, Lcom/netease/ntunisdk/Sdk360$6;->this$0:Lcom/netease/ntunisdk/Sdk360;

    const-string v6, "\u66f4\u65b0\u79ef\u5206\u5931\u8d25"

    invoke-virtual {v5, v6}, Lcom/netease/ntunisdk/Sdk360;->showMsg(Ljava/lang/String;)V

    goto :goto_0

    .line 469
    .end local v0    # "content":Lorg/json/JSONObject;
    .end local v4    # "status":I
    :cond_2
    iget-object v5, p0, Lcom/netease/ntunisdk/Sdk360$6;->this$0:Lcom/netease/ntunisdk/Sdk360;

    const-string v6, "\u4e0a\u4f20\u79ef\u5206\u5931\u8d25"

    invoke-virtual {v5, v6}, Lcom/netease/ntunisdk/Sdk360;->showMsg(Ljava/lang/String;)V
    :try_end_1
    .catch Lorg/json/JSONException; {:try_start_1 .. :try_end_1} :catch_0

    goto :goto_0
.end method
