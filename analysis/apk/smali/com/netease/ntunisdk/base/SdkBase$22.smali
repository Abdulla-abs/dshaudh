.class Lcom/netease/ntunisdk/base/SdkBase$22;
.super Ljava/lang/Object;
.source "SdkBase.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/ntunisdk/base/SdkBase;->ntOpenExitView()V
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
    .line 1503
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase$22;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 8

    .prologue
    const/4 v7, 0x0

    .line 1507
    iget-object v5, p0, Lcom/netease/ntunisdk/base/SdkBase$22;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    const-string v6, "FEATURE_EXIT_VIEW"

    invoke-virtual {v5, v6, v7}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v5

    if-eqz v5, :cond_1

    .line 1508
    iget-object v5, p0, Lcom/netease/ntunisdk/base/SdkBase$22;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v5}, Lcom/netease/ntunisdk/base/SdkBase;->openExitView()Z

    .line 1529
    :cond_0
    :goto_0
    return-void

    .line 1511
    :cond_1
    iget-object v5, p0, Lcom/netease/ntunisdk/base/SdkBase$22;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v5}, Lcom/netease/ntunisdk/base/SdkBase;->getChannelByImsi()Ljava/lang/String;

    move-result-object v3

    .line 1512
    .local v3, "teleChannel":Ljava/lang/String;
    iget-object v5, p0, Lcom/netease/ntunisdk/base/SdkBase$22;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v5, v5, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v5, v3}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v4

    check-cast v4, Lcom/netease/ntunisdk/base/SdkBase;

    .line 1513
    .local v4, "teleSdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    if-nez v4, :cond_2

    const-string v5, "mm_10086"

    invoke-virtual {v5, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5

    if-eqz v5, :cond_2

    .line 1514
    iget-object v5, p0, Lcom/netease/ntunisdk/base/SdkBase$22;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v5, v5, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    const-string v6, "g_10086"

    invoke-interface {v5, v6}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v4

    .end local v4    # "teleSdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    check-cast v4, Lcom/netease/ntunisdk/base/SdkBase;

    .line 1516
    .restart local v4    # "teleSdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_2
    if-eqz v4, :cond_3

    const-string v5, "FEATURE_EXIT_VIEW"

    invoke-virtual {v4, v5, v7}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v5

    if-eqz v5, :cond_3

    .line 1517
    invoke-virtual {v4}, Lcom/netease/ntunisdk/base/SdkBase;->openExitView()Z

    goto :goto_0

    .line 1520
    :cond_3
    iget-object v5, p0, Lcom/netease/ntunisdk/base/SdkBase$22;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v5, v5, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v5}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v5

    invoke-interface {v5}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :cond_4
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v5

    if-eqz v5, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 1521
    .local v1, "key":Ljava/lang/String;
    iget-object v5, p0, Lcom/netease/ntunisdk/base/SdkBase$22;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v5, v5, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v5, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 1522
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    const-string v5, "FEATURE_EXIT_VIEW"

    invoke-virtual {v2, v5, v7}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v5

    if-eqz v5, :cond_4

    .line 1523
    invoke-virtual {v2}, Lcom/netease/ntunisdk/base/SdkBase;->openExitView()Z

    goto :goto_0
.end method
