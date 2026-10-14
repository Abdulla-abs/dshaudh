.class Lcom/netease/ntunisdk/base/SdkBase$69;
.super Ljava/lang/Object;
.source "SdkBase.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/ntunisdk/base/SdkBase;->ntMoreGame()V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/netease/ntunisdk/base/SdkBase;


# direct methods
.method constructor <init>(Lcom/netease/ntunisdk/base/SdkBase;)V
    .locals 0

    .prologue
    .line 2647
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase$69;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 6

    .prologue
    const/4 v5, 0x0

    .line 2650
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$69;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v3, v3, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :cond_0
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_1

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 2651
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$69;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v3, v3, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 2652
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    const-string v3, "FEATURE_HAS_MOREGAME_BTN"

    invoke-virtual {v2, v3, v5}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v3

    if-eqz v3, :cond_0

    .line 2653
    invoke-virtual {v2}, Lcom/netease/ntunisdk/base/SdkBase;->moreGame()V

    goto :goto_0

    .line 2656
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_1
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$69;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    const-string v4, "FEATURE_HAS_MOREGAME_BTN"

    invoke-virtual {v3, v4, v5}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v3

    if-eqz v3, :cond_2

    .line 2657
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$69;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v3}, Lcom/netease/ntunisdk/base/SdkBase;->moreGame()V

    .line 2659
    :cond_2
    return-void
.end method
