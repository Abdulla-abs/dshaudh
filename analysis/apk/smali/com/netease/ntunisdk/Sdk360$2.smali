.class Lcom/netease/ntunisdk/Sdk360$2;
.super Ljava/lang/Object;
.source "Sdk360.java"

# interfaces
.implements Lcom/qihoo/gamecenter/sdk/common/IDispatcherCallback;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/ntunisdk/Sdk360;->login()V
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
    .line 111
    iput-object p1, p0, Lcom/netease/ntunisdk/Sdk360$2;->this$0:Lcom/netease/ntunisdk/Sdk360;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public onFinished(Ljava/lang/String;)V
    .locals 9
    .param p1, "data"    # Ljava/lang/String;

    .prologue
    const/4 v8, 0x4

    .line 114
    const-string v5, "sdk test"

    new-instance v6, Ljava/lang/StringBuilder;

    invoke-direct {v6}, Ljava/lang/StringBuilder;-><init>()V

    const-string v7, "qihoo login callback, result is "

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v6

    invoke-static {v5, v6}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 118
    :try_start_0
    invoke-static {p1}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v5

    if-nez v5, :cond_1

    .line 119
    new-instance v4, Lorg/json/JSONObject;

    invoke-direct {v4, p1}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    .line 121
    .local v4, "json":Lorg/json/JSONObject;
    const-string v5, "error_code"

    invoke-virtual {v4, v5}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v3

    .line 122
    .local v3, "errorCode":I
    if-nez v3, :cond_0

    .line 123
    const-string v5, "data"

    invoke-virtual {v4, v5}, Lorg/json/JSONObject;->getJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v1

    .line 124
    .local v1, "content":Lorg/json/JSONObject;
    const-string v5, "access_token"

    invoke-virtual {v1, v5}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 125
    .local v0, "accessToken":Ljava/lang/String;
    iget-object v5, p0, Lcom/netease/ntunisdk/Sdk360$2;->this$0:Lcom/netease/ntunisdk/Sdk360;

    const-string v6, "SESSION"

    invoke-virtual {v5, v6, v0}, Lcom/netease/ntunisdk/Sdk360;->setPropStr(Ljava/lang/String;Ljava/lang/String;)V

    .line 127
    iget-object v5, p0, Lcom/netease/ntunisdk/Sdk360$2;->this$0:Lcom/netease/ntunisdk/Sdk360;

    const-string v6, "UIN"

    const-string v7, "0"

    invoke-virtual {v5, v6, v7}, Lcom/netease/ntunisdk/Sdk360;->setPropStr(Ljava/lang/String;Ljava/lang/String;)V

    .line 128
    iget-object v5, p0, Lcom/netease/ntunisdk/Sdk360$2;->this$0:Lcom/netease/ntunisdk/Sdk360;

    const-string v6, "LOGIN_STAT"

    const/4 v7, 0x1

    invoke-virtual {v5, v6, v7}, Lcom/netease/ntunisdk/Sdk360;->setPropInt(Ljava/lang/String;I)V

    .line 129
    iget-object v5, p0, Lcom/netease/ntunisdk/Sdk360$2;->this$0:Lcom/netease/ntunisdk/Sdk360;

    const/4 v6, 0x0

    invoke-virtual {v5, v6}, Lcom/netease/ntunisdk/Sdk360;->loginDone(I)V

    .line 142
    .end local v0    # "accessToken":Ljava/lang/String;
    .end local v1    # "content":Lorg/json/JSONObject;
    .end local v3    # "errorCode":I
    .end local v4    # "json":Lorg/json/JSONObject;
    :goto_0
    return-void

    .line 131
    .restart local v3    # "errorCode":I
    .restart local v4    # "json":Lorg/json/JSONObject;
    :cond_0
    iget-object v5, p0, Lcom/netease/ntunisdk/Sdk360$2;->this$0:Lcom/netease/ntunisdk/Sdk360;

    const/4 v6, 0x4

    invoke-virtual {v5, v6}, Lcom/netease/ntunisdk/Sdk360;->loginDone(I)V
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    .line 137
    .end local v3    # "errorCode":I
    .end local v4    # "json":Lorg/json/JSONObject;
    :catch_0
    move-exception v2

    .line 138
    .local v2, "e":Lorg/json/JSONException;
    const-string v5, "Sdk360"

    new-instance v6, Ljava/lang/StringBuilder;

    invoke-direct {v6}, Ljava/lang/StringBuilder;-><init>()V

    const-string v7, "json error:"

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v2}, Lorg/json/JSONException;->getMessage()Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v6

    invoke-static {v5, v6}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 139
    iget-object v5, p0, Lcom/netease/ntunisdk/Sdk360$2;->this$0:Lcom/netease/ntunisdk/Sdk360;

    invoke-virtual {v5, v8}, Lcom/netease/ntunisdk/Sdk360;->loginDone(I)V

    .line 140
    invoke-virtual {v2}, Lorg/json/JSONException;->printStackTrace()V

    goto :goto_0

    .line 134
    .end local v2    # "e":Lorg/json/JSONException;
    :cond_1
    :try_start_1
    iget-object v5, p0, Lcom/netease/ntunisdk/Sdk360$2;->this$0:Lcom/netease/ntunisdk/Sdk360;

    const/4 v6, 0x4

    invoke-virtual {v5, v6}, Lcom/netease/ntunisdk/Sdk360;->loginDone(I)V
    :try_end_1
    .catch Lorg/json/JSONException; {:try_start_1 .. :try_end_1} :catch_0

    goto :goto_0
.end method
