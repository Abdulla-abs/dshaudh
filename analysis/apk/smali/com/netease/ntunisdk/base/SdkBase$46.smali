.class Lcom/netease/ntunisdk/base/SdkBase$46;
.super Ljava/lang/Object;
.source "SdkBase.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/ntunisdk/base/SdkBase;->ntUpdateRank(Ljava/lang/String;D)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/netease/ntunisdk/base/SdkBase;

.field final synthetic val$rankType:Ljava/lang/String;

.field final synthetic val$score:D


# direct methods
.method constructor <init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/lang/String;D)V
    .locals 0

    .prologue
    .line 2190
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase$46;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iput-object p2, p0, Lcom/netease/ntunisdk/base/SdkBase$46;->val$rankType:Ljava/lang/String;

    iput-wide p3, p0, Lcom/netease/ntunisdk/base/SdkBase$46;->val$score:D

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 7

    .prologue
    .line 2193
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$46;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

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

    .line 2194
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$46;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v3, v3, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 2195
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$46;->val$rankType:Ljava/lang/String;

    iget-wide v4, p0, Lcom/netease/ntunisdk/base/SdkBase$46;->val$score:D

    invoke-virtual {v2, v3, v4, v5}, Lcom/netease/ntunisdk/base/SdkBase;->updateRank(Ljava/lang/String;D)V

    goto :goto_0

    .line 2197
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$46;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase$46;->val$rankType:Ljava/lang/String;

    iget-wide v5, p0, Lcom/netease/ntunisdk/base/SdkBase$46;->val$score:D

    invoke-virtual {v3, v4, v5, v6}, Lcom/netease/ntunisdk/base/SdkBase;->updateRank(Ljava/lang/String;D)V

    .line 2198
    return-void
.end method
