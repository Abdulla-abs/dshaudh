.class Lcom/netease/ntunisdk/base/SdkBase$23;
.super Ljava/lang/Object;
.source "SdkBase.java"

# interfaces
.implements Lcom/netease/ntunisdk/base/OnFinishInitListener;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/ntunisdk/base/SdkBase;->initAllSdk(ILcom/netease/ntunisdk/base/OnFinishInitListener;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/netease/ntunisdk/base/SdkBase;

.field final synthetic val$f:Lcom/netease/ntunisdk/base/OnFinishInitListener;

.field final synthetic val$index:I

.field final synthetic val$sdkBase:Lcom/netease/ntunisdk/base/SdkBase;


# direct methods
.method constructor <init>(Lcom/netease/ntunisdk/base/SdkBase;Lcom/netease/ntunisdk/base/SdkBase;ILcom/netease/ntunisdk/base/OnFinishInitListener;)V
    .locals 0

    .prologue
    .line 1753
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase$23;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iput-object p2, p0, Lcom/netease/ntunisdk/base/SdkBase$23;->val$sdkBase:Lcom/netease/ntunisdk/base/SdkBase;

    iput p3, p0, Lcom/netease/ntunisdk/base/SdkBase$23;->val$index:I

    iput-object p4, p0, Lcom/netease/ntunisdk/base/SdkBase$23;->val$f:Lcom/netease/ntunisdk/base/OnFinishInitListener;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public finishInit(I)V
    .locals 4
    .param p1, "code"    # I

    .prologue
    .line 1756
    const-string v1, "UniSDK Base"

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$23;->val$sdkBase:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v3}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v3, " ntInit code: "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 1757
    if-eqz p1, :cond_0

    const/4 v1, 0x2

    if-ne p1, v1, :cond_1

    .line 1758
    :cond_0
    iget v1, p0, Lcom/netease/ntunisdk/base/SdkBase$23;->val$index:I

    add-int/lit8 v0, v1, 0x1

    .line 1759
    .local v0, "i":I
    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase$23;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase$23;->val$f:Lcom/netease/ntunisdk/base/OnFinishInitListener;

    invoke-static {v1, v0, v2}, Lcom/netease/ntunisdk/base/SdkBase;->access$1100(Lcom/netease/ntunisdk/base/SdkBase;ILcom/netease/ntunisdk/base/OnFinishInitListener;)V

    .line 1763
    .end local v0    # "i":I
    :goto_0
    return-void

    .line 1761
    :cond_1
    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase$23;->val$f:Lcom/netease/ntunisdk/base/OnFinishInitListener;

    const/4 v2, 0x1

    invoke-interface {v1, v2}, Lcom/netease/ntunisdk/base/OnFinishInitListener;->finishInit(I)V

    goto :goto_0
.end method
