.class Lcom/netease/h1/qihoo/AdvanceDino$1$2;
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


# direct methods
.method constructor <init>(Lcom/netease/h1/qihoo/AdvanceDino$1;)V
    .locals 0

    .prologue
    .line 172
    iput-object p1, p0, Lcom/netease/h1/qihoo/AdvanceDino$1$2;->this$0:Lcom/netease/h1/qihoo/AdvanceDino$1;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public onClick(Landroid/content/DialogInterface;I)V
    .locals 2
    .param p1, "dialog"    # Landroid/content/DialogInterface;
    .param p2, "which"    # I

    .prologue
    .line 176
    invoke-static {}, Lcom/netease/h1/qihoo/AdvanceDino;->access$000()Lcom/netease/h1/qihoo/AdvanceDino;

    move-result-object v0

    new-instance v1, Lcom/netease/h1/qihoo/AdvanceDino$1$2$1;

    invoke-direct {v1, p0}, Lcom/netease/h1/qihoo/AdvanceDino$1$2$1;-><init>(Lcom/netease/h1/qihoo/AdvanceDino$1$2;)V

    invoke-virtual {v0, v1}, Lcom/netease/h1/qihoo/AdvanceDino;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 182
    return-void
.end method
