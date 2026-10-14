.class Lcom/netease/ntunisdk/base/RetrieveUser$1$1;
.super Ljava/lang/Object;
.source "RetrieveUser.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/ntunisdk/base/RetrieveUser$1;->ProcessResult(Ljava/lang/String;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$1:Lcom/netease/ntunisdk/base/RetrieveUser$1;

.field final synthetic val$bindUrl:Ljava/lang/String;


# direct methods
.method constructor <init>(Lcom/netease/ntunisdk/base/RetrieveUser$1;Ljava/lang/String;)V
    .locals 0

    .prologue
    .line 74
    iput-object p1, p0, Lcom/netease/ntunisdk/base/RetrieveUser$1$1;->this$1:Lcom/netease/ntunisdk/base/RetrieveUser$1;

    iput-object p2, p0, Lcom/netease/ntunisdk/base/RetrieveUser$1$1;->val$bindUrl:Ljava/lang/String;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 3

    .prologue
    .line 77
    new-instance v0, Landroid/content/Intent;

    invoke-direct {v0}, Landroid/content/Intent;-><init>()V

    .line 78
    .local v0, "intent":Landroid/content/Intent;
    const-string v2, "android.intent.action.VIEW"

    invoke-virtual {v0, v2}, Landroid/content/Intent;->setAction(Ljava/lang/String;)Landroid/content/Intent;

    .line 79
    iget-object v2, p0, Lcom/netease/ntunisdk/base/RetrieveUser$1$1;->val$bindUrl:Ljava/lang/String;

    invoke-static {v2}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;

    move-result-object v1

    .line 80
    .local v1, "url":Landroid/net/Uri;
    invoke-virtual {v0, v1}, Landroid/content/Intent;->setData(Landroid/net/Uri;)Landroid/content/Intent;

    .line 81
    const/high16 v2, 0x10000000

    invoke-virtual {v0, v2}, Landroid/content/Intent;->setFlags(I)Landroid/content/Intent;

    .line 82
    iget-object v2, p0, Lcom/netease/ntunisdk/base/RetrieveUser$1$1;->this$1:Lcom/netease/ntunisdk/base/RetrieveUser$1;

    iget-object v2, v2, Lcom/netease/ntunisdk/base/RetrieveUser$1;->this$0:Lcom/netease/ntunisdk/base/RetrieveUser;

    invoke-static {v2}, Lcom/netease/ntunisdk/base/RetrieveUser;->access$100(Lcom/netease/ntunisdk/base/RetrieveUser;)Landroid/content/Context;

    move-result-object v2

    invoke-virtual {v2, v0}, Landroid/content/Context;->startActivity(Landroid/content/Intent;)V

    .line 83
    return-void
.end method
