.class Lcom/netease/ntunisdk/base/RetrieveUser$2;
.super Ljava/lang/Object;
.source "RetrieveUser.java"

# interfaces
.implements Lcom/netease/ntunisdk/base/utils/WgetDoneCallback;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/ntunisdk/base/RetrieveUser;->requestRetrieveUser4Device()V
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
    .line 109
    iput-object p1, p0, Lcom/netease/ntunisdk/base/RetrieveUser$2;->this$0:Lcom/netease/ntunisdk/base/RetrieveUser;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public ProcessResult(Ljava/lang/String;)V
    .locals 8
    .param p1, "result"    # Ljava/lang/String;

    .prologue
    .line 112
    if-eqz p1, :cond_0

    .line 113
    const-string v5, "UniSDK RetrieveUser"

    new-instance v6, Ljava/lang/StringBuilder;

    invoke-direct {v6}, Ljava/lang/StringBuilder;-><init>()V

    const-string v7, "requestRetrieveUser4Device result:"

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v6

    invoke-static {v5, v6}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    .line 114
    new-instance v4, Lorg/json/JSONTokener;

    invoke-direct {v4, p1}, Lorg/json/JSONTokener;-><init>(Ljava/lang/String;)V

    .line 116
    .local v4, "jsonParser":Lorg/json/JSONTokener;
    :try_start_0
    invoke-virtual {v4}, Lorg/json/JSONTokener;->nextValue()Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Lorg/json/JSONObject;

    .line 117
    .local v0, "conf":Lorg/json/JSONObject;
    const-string v5, "device_id"

    invoke-virtual {v0, v5}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    .line 118
    .local v1, "deviceId":Ljava/lang/String;
    const-string v5, "device_key"

    invoke-virtual {v0, v5}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    .line 119
    .local v2, "deviceKey":Ljava/lang/String;
    iget-object v5, p0, Lcom/netease/ntunisdk/base/RetrieveUser$2;->this$0:Lcom/netease/ntunisdk/base/RetrieveUser;

    const-string v6, "NtUniSdkDeviceId_key"

    invoke-static {v5, v6, v1}, Lcom/netease/ntunisdk/base/RetrieveUser;->access$200(Lcom/netease/ntunisdk/base/RetrieveUser;Ljava/lang/String;Ljava/lang/String;)V

    .line 120
    iget-object v5, p0, Lcom/netease/ntunisdk/base/RetrieveUser$2;->this$0:Lcom/netease/ntunisdk/base/RetrieveUser;

    const-string v6, "NtUniSdkDeviceKey_key"

    invoke-static {v5, v6, v2}, Lcom/netease/ntunisdk/base/RetrieveUser;->access$200(Lcom/netease/ntunisdk/base/RetrieveUser;Ljava/lang/String;Ljava/lang/String;)V
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    .line 125
    .end local v0    # "conf":Lorg/json/JSONObject;
    .end local v1    # "deviceId":Ljava/lang/String;
    .end local v2    # "deviceKey":Ljava/lang/String;
    .end local v4    # "jsonParser":Lorg/json/JSONTokener;
    :cond_0
    :goto_0
    return-void

    .line 121
    .restart local v4    # "jsonParser":Lorg/json/JSONTokener;
    :catch_0
    move-exception v3

    .line 122
    .local v3, "e":Lorg/json/JSONException;
    const-string v5, "UniSDK RetrieveUser"

    new-instance v6, Ljava/lang/StringBuilder;

    invoke-direct {v6}, Ljava/lang/StringBuilder;-><init>()V

    const-string v7, "requestRetrieveUser4Device:"

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v3}, Lorg/json/JSONException;->getMessage()Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v6

    invoke-static {v5, v6}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    goto :goto_0
.end method
