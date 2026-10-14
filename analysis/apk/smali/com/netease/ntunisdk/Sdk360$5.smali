.class Lcom/netease/ntunisdk/Sdk360$5;
.super Ljava/lang/Object;
.source "Sdk360.java"

# interfaces
.implements Lcom/qihoo/gamecenter/sdk/common/IDispatcherCallback;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/ntunisdk/Sdk360;->openExitView()Z
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
    .line 409
    iput-object p1, p0, Lcom/netease/ntunisdk/Sdk360$5;->this$0:Lcom/netease/ntunisdk/Sdk360;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public onFinished(Ljava/lang/String;)V
    .locals 5
    .param p1, "data"    # Ljava/lang/String;

    .prologue
    .line 414
    :try_start_0
    new-instance v1, Lorg/json/JSONObject;

    invoke-direct {v1, p1}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    .line 415
    .local v1, "json":Lorg/json/JSONObject;
    const-string v3, "which"

    const/4 v4, -0x1

    invoke-virtual {v1, v3, v4}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;I)I

    move-result v2

    .line 417
    .local v2, "which":I
    packed-switch v2, :pswitch_data_0

    .line 432
    .end local v1    # "json":Lorg/json/JSONObject;
    .end local v2    # "which":I
    :goto_0
    :pswitch_0
    return-void

    .line 422
    .restart local v1    # "json":Lorg/json/JSONObject;
    .restart local v2    # "which":I
    :pswitch_1
    iget-object v3, p0, Lcom/netease/ntunisdk/Sdk360$5;->this$0:Lcom/netease/ntunisdk/Sdk360;

    invoke-virtual {v3}, Lcom/netease/ntunisdk/Sdk360;->exitDone()V
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    .line 429
    .end local v1    # "json":Lorg/json/JSONObject;
    .end local v2    # "which":I
    :catch_0
    move-exception v0

    .line 430
    .local v0, "e":Lorg/json/JSONException;
    invoke-virtual {v0}, Lorg/json/JSONException;->printStackTrace()V

    goto :goto_0

    .line 425
    .end local v0    # "e":Lorg/json/JSONException;
    .restart local v1    # "json":Lorg/json/JSONObject;
    .restart local v2    # "which":I
    :pswitch_2
    :try_start_1
    iget-object v3, p0, Lcom/netease/ntunisdk/Sdk360$5;->this$0:Lcom/netease/ntunisdk/Sdk360;

    invoke-virtual {v3}, Lcom/netease/ntunisdk/Sdk360;->exitDone()V
    :try_end_1
    .catch Lorg/json/JSONException; {:try_start_1 .. :try_end_1} :catch_0

    goto :goto_0

    .line 417
    nop

    :pswitch_data_0
    .packed-switch 0x0
        :pswitch_0
        :pswitch_1
        :pswitch_2
    .end packed-switch
.end method
