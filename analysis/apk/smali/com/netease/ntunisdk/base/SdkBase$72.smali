.class Lcom/netease/ntunisdk/base/SdkBase$72;
.super Ljava/lang/Object;
.source "SdkBase.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/ntunisdk/base/SdkBase;->ntQuerySkuDetails(Ljava/lang/String;Ljava/util/List;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/netease/ntunisdk/base/SdkBase;

.field final synthetic val$itemType:Ljava/lang/String;

.field final synthetic val$sku:Ljava/util/List;


# direct methods
.method constructor <init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/lang/String;Ljava/util/List;)V
    .locals 0

    .prologue
    .line 2866
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase$72;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iput-object p2, p0, Lcom/netease/ntunisdk/base/SdkBase$72;->val$itemType:Ljava/lang/String;

    iput-object p3, p0, Lcom/netease/ntunisdk/base/SdkBase$72;->val$sku:Ljava/util/List;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 6

    .prologue
    .line 2869
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$72;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v3, v3, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 2870
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$72;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v3, v3, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 2871
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$72;->val$itemType:Ljava/lang/String;

    iget-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase$72;->val$sku:Ljava/util/List;

    invoke-virtual {v2, v3, v4}, Lcom/netease/ntunisdk/base/SdkBase;->querySkuDetails(Ljava/lang/String;Ljava/util/List;)V

    goto :goto_0

    .line 2873
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$72;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase$72;->val$itemType:Ljava/lang/String;

    iget-object v5, p0, Lcom/netease/ntunisdk/base/SdkBase$72;->val$sku:Ljava/util/List;

    invoke-virtual {v3, v4, v5}, Lcom/netease/ntunisdk/base/SdkBase;->querySkuDetails(Ljava/lang/String;Ljava/util/List;)V

    .line 2874
    return-void
.end method
