.class Lcom/netease/ntunisdk/Sdk360$4;
.super Ljava/lang/Object;
.source "Sdk360.java"

# interfaces
.implements Lcom/qihoo/gamecenter/sdk/common/IDispatcherCallback;


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/netease/ntunisdk/Sdk360;
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
    .line 301
    iput-object p1, p0, Lcom/netease/ntunisdk/Sdk360$4;->this$0:Lcom/netease/ntunisdk/Sdk360;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public onFinished(Ljava/lang/String;)V
    .locals 9
    .param p1, "data"    # Ljava/lang/String;

    .prologue
    .line 306
    iget-object v6, p0, Lcom/netease/ntunisdk/Sdk360$4;->this$0:Lcom/netease/ntunisdk/Sdk360;

    invoke-static {v6, p1}, Lcom/netease/ntunisdk/Sdk360;->access$100(Lcom/netease/ntunisdk/Sdk360;Ljava/lang/String;)Z

    move-result v6

    if-eqz v6, :cond_0

    .line 343
    :goto_0
    return-void

    .line 310
    :cond_0
    const-string v6, "Sdk360"

    new-instance v7, Ljava/lang/StringBuilder;

    invoke-direct {v7}, Ljava/lang/StringBuilder;-><init>()V

    const-string v8, "mAccountSwitchCallback, data is "

    invoke-virtual {v7, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v7

    invoke-virtual {v7, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v7

    invoke-virtual {v7}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v7

    invoke-static {v6, v7}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 314
    :try_start_0
    invoke-static {p1}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v6

    if-nez v6, :cond_2

    .line 315
    new-instance v5, Lorg/json/JSONObject;

    invoke-direct {v5, p1}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    .line 317
    .local v5, "json":Lorg/json/JSONObject;
    const-string v6, "error_code"

    invoke-virtual {v5, v6}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v3

    .line 318
    .local v3, "errorCode":I
    if-nez v3, :cond_1

    .line 319
    iget-object v6, p0, Lcom/netease/ntunisdk/Sdk360$4;->this$0:Lcom/netease/ntunisdk/Sdk360;

    invoke-virtual {v6}, Lcom/netease/ntunisdk/Sdk360;->resetCommonProp()V

    .line 320
    iget-object v6, p0, Lcom/netease/ntunisdk/Sdk360$4;->this$0:Lcom/netease/ntunisdk/Sdk360;

    const/4 v7, 0x0

    invoke-virtual {v6, v7}, Lcom/netease/ntunisdk/Sdk360;->logoutDone(I)V

    .line 322
    const-string v6, "data"

    invoke-virtual {v5, v6}, Lorg/json/JSONObject;->getJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v1

    .line 323
    .local v1, "content":Lorg/json/JSONObject;
    const-string v6, "access_token"

    invoke-virtual {v1, v6}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 324
    .local v0, "accessToken":Ljava/lang/String;
    const-string v6, "expires_in"

    invoke-virtual {v1, v6}, Lorg/json/JSONObject;->optLong(Ljava/lang/String;)J

    move-result-wide v6

    invoke-static {v6, v7}, Ljava/lang/Long;->valueOf(J)Ljava/lang/Long;

    move-result-object v4

    .line 325
    .local v4, "expiresIn":Ljava/lang/Long;
    iget-object v6, p0, Lcom/netease/ntunisdk/Sdk360$4;->this$0:Lcom/netease/ntunisdk/Sdk360;

    const-string v7, "SESSION"

    invoke-virtual {v6, v7, v0}, Lcom/netease/ntunisdk/Sdk360;->setPropStr(Ljava/lang/String;Ljava/lang/String;)V

    .line 327
    iget-object v6, p0, Lcom/netease/ntunisdk/Sdk360$4;->this$0:Lcom/netease/ntunisdk/Sdk360;

    const-string v7, "UIN"

    const-string v8, "0"

    invoke-virtual {v6, v7, v8}, Lcom/netease/ntunisdk/Sdk360;->setPropStr(Ljava/lang/String;Ljava/lang/String;)V

    .line 328
    iget-object v6, p0, Lcom/netease/ntunisdk/Sdk360$4;->this$0:Lcom/netease/ntunisdk/Sdk360;

    const-string v7, "DEVICE_ID"

    iget-object v8, p0, Lcom/netease/ntunisdk/Sdk360$4;->this$0:Lcom/netease/ntunisdk/Sdk360;

    invoke-virtual {v8}, Lcom/netease/ntunisdk/Sdk360;->getDeviceId()Ljava/lang/String;

    move-result-object v8

    invoke-virtual {v6, v7, v8}, Lcom/netease/ntunisdk/Sdk360;->setPropStr(Ljava/lang/String;Ljava/lang/String;)V

    .line 329
    iget-object v6, p0, Lcom/netease/ntunisdk/Sdk360$4;->this$0:Lcom/netease/ntunisdk/Sdk360;

    const-string v7, "LOGIN_STAT"

    const/4 v8, 0x1

    invoke-virtual {v6, v7, v8}, Lcom/netease/ntunisdk/Sdk360;->setPropInt(Ljava/lang/String;I)V

    .line 330
    iget-object v6, p0, Lcom/netease/ntunisdk/Sdk360$4;->this$0:Lcom/netease/ntunisdk/Sdk360;

    const/4 v7, 0x0

    invoke-virtual {v6, v7}, Lcom/netease/ntunisdk/Sdk360;->loginDone(I)V
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    .line 338
    .end local v0    # "accessToken":Ljava/lang/String;
    .end local v1    # "content":Lorg/json/JSONObject;
    .end local v3    # "errorCode":I
    .end local v4    # "expiresIn":Ljava/lang/Long;
    .end local v5    # "json":Lorg/json/JSONObject;
    :catch_0
    move-exception v2

    .line 339
    .local v2, "e":Lorg/json/JSONException;
    const-string v6, "Sdk360"

    new-instance v7, Ljava/lang/StringBuilder;

    invoke-direct {v7}, Ljava/lang/StringBuilder;-><init>()V

    const-string v8, "json error:"

    invoke-virtual {v7, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v7

    invoke-virtual {v2}, Lorg/json/JSONException;->getMessage()Ljava/lang/String;

    move-result-object v8

    invoke-virtual {v7, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v7

    invoke-virtual {v7}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v7

    invoke-static {v6, v7}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 340
    invoke-virtual {v2}, Lorg/json/JSONException;->printStackTrace()V

    goto/16 :goto_0

    .line 332
    .end local v2    # "e":Lorg/json/JSONException;
    .restart local v3    # "errorCode":I
    .restart local v5    # "json":Lorg/json/JSONObject;
    :cond_1
    :try_start_1
    iget-object v6, p0, Lcom/netease/ntunisdk/Sdk360$4;->this$0:Lcom/netease/ntunisdk/Sdk360;

    const/4 v7, 0x4

    invoke-virtual {v6, v7}, Lcom/netease/ntunisdk/Sdk360;->loginDone(I)V

    goto/16 :goto_0

    .line 335
    .end local v3    # "errorCode":I
    .end local v5    # "json":Lorg/json/JSONObject;
    :cond_2
    iget-object v6, p0, Lcom/netease/ntunisdk/Sdk360$4;->this$0:Lcom/netease/ntunisdk/Sdk360;

    const/4 v7, 0x4

    invoke-virtual {v6, v7}, Lcom/netease/ntunisdk/Sdk360;->loginDone(I)V
    :try_end_1
    .catch Lorg/json/JSONException; {:try_start_1 .. :try_end_1} :catch_0

    goto/16 :goto_0
.end method
