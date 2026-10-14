.class Lcom/netease/ntunisdk/base/SdkBase$89;
.super Ljava/lang/Object;
.source "SdkBase.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/ntunisdk/base/SdkBase;->ntShowBoard(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/netease/ntunisdk/base/SdkBase;

.field final synthetic val$category:Ljava/lang/String;

.field final synthetic val$termId:Ljava/lang/String;

.field final synthetic val$title:Ljava/lang/String;


# direct methods
.method constructor <init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 0

    .prologue
    .line 3161
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase$89;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iput-object p2, p0, Lcom/netease/ntunisdk/base/SdkBase$89;->val$category:Ljava/lang/String;

    iput-object p3, p0, Lcom/netease/ntunisdk/base/SdkBase$89;->val$termId:Ljava/lang/String;

    iput-object p4, p0, Lcom/netease/ntunisdk/base/SdkBase$89;->val$title:Ljava/lang/String;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 4

    .prologue
    .line 3164
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase$89;->this$0:Lcom/netease/ntunisdk/base/SdkBase;

    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase$89;->val$category:Ljava/lang/String;

    iget-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase$89;->val$termId:Ljava/lang/String;

    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase$89;->val$title:Ljava/lang/String;

    invoke-virtual {v0, v1, v2, v3}, Lcom/netease/ntunisdk/base/SdkBase;->showBoard(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 3165
    return-void
.end method
