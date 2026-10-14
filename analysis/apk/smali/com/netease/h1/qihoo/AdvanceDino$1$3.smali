.class Lcom/netease/h1/qihoo/AdvanceDino$1$3;
.super Ljava/lang/Object;
.source "AdvanceDino.java"

# interfaces
.implements Landroid/content/DialogInterface$OnClickListener;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/h1/qihoo/AdvanceDino$1;->handleMessage(Landroid/os/Message;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/netease/h1/qihoo/AdvanceDino$1;

.field final synthetic val$str_url:Ljava/lang/String;


# direct methods
.method constructor <init>(Lcom/netease/h1/qihoo/AdvanceDino$1;Ljava/lang/String;)V
    .locals 0

    .prologue
    .line 158
    iput-object p1, p0, Lcom/netease/h1/qihoo/AdvanceDino$1$3;->this$0:Lcom/netease/h1/qihoo/AdvanceDino$1;

    iput-object p2, p0, Lcom/netease/h1/qihoo/AdvanceDino$1$3;->val$str_url:Ljava/lang/String;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public onClick(Landroid/content/DialogInterface;I)V
    .locals 3
    .param p1, "dialog"    # Landroid/content/DialogInterface;
    .param p2, "which"    # I

    .prologue
    .line 161
    invoke-static {}, Lcom/netease/h1/qihoo/AdvanceDino;->access$000()Lcom/netease/h1/qihoo/AdvanceDino;

    move-result-object v1

    new-instance v2, Lcom/netease/h1/qihoo/AdvanceDino$1$3$1;

    invoke-direct {v2, p0}, Lcom/netease/h1/qihoo/AdvanceDino$1$3$1;-><init>(Lcom/netease/h1/qihoo/AdvanceDino$1$3;)V

    invoke-virtual {v1, v2}, Lcom/netease/h1/qihoo/AdvanceDino;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 167
    new-instance v0, Landroid/content/Intent;

    const-string v1, "android.intent.action.VIEW"

    invoke-direct {v0, v1}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V

    .line 168
    .local v0, "i":Landroid/content/Intent;
    iget-object v1, p0, Lcom/netease/h1/qihoo/AdvanceDino$1$3;->val$str_url:Ljava/lang/String;

    invoke-static {v1}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;

    move-result-object v1

    invoke-virtual {v0, v1}, Landroid/content/Intent;->setData(Landroid/net/Uri;)Landroid/content/Intent;

    .line 169
    invoke-static {}, Lorg/cocos2dx/lib/Cocos2dxActivity;->getContext()Landroid/content/Context;

    move-result-object v1

    invoke-virtual {v1, v0}, Landroid/content/Context;->startActivity(Landroid/content/Intent;)V

    .line 170
    return-void
.end method
