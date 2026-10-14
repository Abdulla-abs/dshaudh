.class Lcom/netease/ntunisdk/base/RetrieveUser$1;
.super Ljava/lang/Object;
.source "RetrieveUser.java"

# interfaces
.implements Lcom/netease/ntunisdk/base/utils/WgetDoneCallback;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/ntunisdk/base/RetrieveUser;->requestRetrieveUser4Config()V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/netease/ntunisdk/base/RetrieveUser;


# direct methods
.method constructor <init>(Lcom/netease/ntunisdk/base/RetrieveUser;)V
    .locals 0

    .prologue
    .line 59
    iput-object p1, p0, Lcom/netease/ntunisdk/base/RetrieveUser$1;->this$0:Lcom/netease/ntunisdk/base/RetrieveUser;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public ProcessResult(Ljava/lang/String;)V
    .locals 11
    .param p1, "result"    # Ljava/lang/String;

    .prologue
    .line 62
    if-eqz p1, :cond_0

    .line 63
    const-string v7, "UniSDK RetrieveUser"

    new-instance v8, Ljava/lang/StringBuilder;

    invoke-direct {v8}, Ljava/lang/StringBuilder;-><init>()V

    const-string v9, "requestRetrieveUser4Config result:"

    invoke-virtual {v8, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v8

    invoke-static {v7, v8}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    .line 64
    new-instance v6, Lorg/json/JSONTokener;

    invoke-direct {v6, p1}, Lorg/json/JSONTokener;-><init>(Ljava/lang/String;)V

    .line 66
    .local v6, "jsonParser":Lorg/json/JSONTokener;
    :try_start_0
    invoke-virtual {v6}, Lorg/json/JSONTokener;->nextValue()Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lorg/json/JSONObject;

    .line 67
    .local v2, "conf":Lorg/json/JSONObject;
    const-string v7, "enable_bind"

    invoke-virtual {v2, v7}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v0

    .line 68
    .local v0, "bind":Z
    if-eqz v0, :cond_0

    .line 69
    iget-object v7, p0, Lcom/netease/ntunisdk/base/RetrieveUser$1;->this$0:Lcom/netease/ntunisdk/base/RetrieveUser;

    const-string v8, "NtUniSdkDeviceId_key"

    invoke-static {v7, v8}, Lcom/netease/ntunisdk/base/RetrieveUser;->access$000(Lcom/netease/ntunisdk/base/RetrieveUser;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    .line 70
    .local v3, "deviceId":Ljava/lang/String;
    iget-object v7, p0, Lcom/netease/ntunisdk/base/RetrieveUser$1;->this$0:Lcom/netease/ntunisdk/base/RetrieveUser;

    const-string v8, "NtUniSdkDeviceKey_key"

    invoke-static {v7, v8}, Lcom/netease/ntunisdk/base/RetrieveUser;->access$000(Lcom/netease/ntunisdk/base/RetrieveUser;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    .line 71
    .local v4, "deviceKey":Ljava/lang/String;
    new-instance v7, Ljava/lang/StringBuilder;

    invoke-direct {v7}, Ljava/lang/StringBuilder;-><init>()V

    const-string v8, "url"

    invoke-virtual {v2, v8}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v8

    invoke-virtual {v7, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v7

    const-string v8, "?device_id=%s&device_key=%s"

    const/4 v9, 0x2

    new-array v9, v9, [Ljava/lang/Object;

    const/4 v10, 0x0

    aput-object v3, v9, v10

    const/4 v10, 0x1

    aput-object v4, v9, v10

    invoke-static {v8, v9}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v8

    invoke-virtual {v7, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v7

    invoke-virtual {v7}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    .line 72
    .local v1, "bindUrl":Ljava/lang/String;
    const-string v7, "UniSDK RetrieveUser"

    new-instance v8, Ljava/lang/StringBuilder;

    invoke-direct {v8}, Ljava/lang/StringBuilder;-><init>()V

    const-string v9, "bindUrl:"

    invoke-virtual {v8, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v8

    invoke-static {v7, v8}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    .line 73
    invoke-static {v3}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v7

    if-nez v7, :cond_1

    invoke-static {v4}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v7

    if-nez v7, :cond_1

    .line 74
    iget-object v7, p0, Lcom/netease/ntunisdk/base/RetrieveUser$1;->this$0:Lcom/netease/ntunisdk/base/RetrieveUser;

    invoke-static {v7}, Lcom/netease/ntunisdk/base/RetrieveUser;->access$100(Lcom/netease/ntunisdk/base/RetrieveUser;)Landroid/content/Context;

    move-result-object v7

    check-cast v7, Landroid/app/Activity;

    new-instance v8, Lcom/netease/ntunisdk/base/RetrieveUser$1$1;

    invoke-direct {v8, p0, v1}, Lcom/netease/ntunisdk/base/RetrieveUser$1$1;-><init>(Lcom/netease/ntunisdk/base/RetrieveUser$1;Ljava/lang/String;)V

    invoke-virtual {v7, v8}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 93
    .end local v0    # "bind":Z
    .end local v1    # "bindUrl":Ljava/lang/String;
    .end local v2    # "conf":Lorg/json/JSONObject;
    .end local v3    # "deviceId":Ljava/lang/String;
    .end local v4    # "deviceKey":Ljava/lang/String;
    .end local v6    # "jsonParser":Lorg/json/JSONTokener;
    :cond_0
    :goto_0
    return-void

    .line 86
    .restart local v0    # "bind":Z
    .restart local v1    # "bindUrl":Ljava/lang/String;
    .restart local v2    # "conf":Lorg/json/JSONObject;
    .restart local v3    # "deviceId":Ljava/lang/String;
    .restart local v4    # "deviceKey":Ljava/lang/String;
    .restart local v6    # "jsonParser":Lorg/json/JSONTokener;
    :cond_1
    const-string v7, "UniSDK RetrieveUser"

    const-string v8, "RetrieveUser not bind"

    invoke-static {v7, v8}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    .line 89
    .end local v0    # "bind":Z
    .end local v1    # "bindUrl":Ljava/lang/String;
    .end local v2    # "conf":Lorg/json/JSONObject;
    .end local v3    # "deviceId":Ljava/lang/String;
    .end local v4    # "deviceKey":Ljava/lang/String;
    :catch_0
    move-exception v5

    .line 90
    .local v5, "e":Lorg/json/JSONException;
    const-string v7, "UniSDK RetrieveUser"

    new-instance v8, Ljava/lang/StringBuilder;

    invoke-direct {v8}, Ljava/lang/StringBuilder;-><init>()V

    const-string v9, "requestRetrieveUser4Config:"

    invoke-virtual {v8, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v5}, Lorg/json/JSONException;->getMessage()Ljava/lang/String;

    move-result-object v9

    invoke-virtual {v8, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v8

    invoke-static {v7, v8}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    goto :goto_0
.end method
