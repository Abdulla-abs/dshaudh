.class Lcom/netease/h1/qihoo/AdvanceDino$4$1$1;
.super Ljava/lang/Object;
.source "AdvanceDino.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/h1/qihoo/AdvanceDino$4$1;->onClick(Landroid/content/DialogInterface;I)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$1:Lcom/netease/h1/qihoo/AdvanceDino$4$1;


# direct methods
.method constructor <init>(Lcom/netease/h1/qihoo/AdvanceDino$4$1;)V
    .locals 0

    .prologue
    .line 548
    iput-object p1, p0, Lcom/netease/h1/qihoo/AdvanceDino$4$1$1;->this$1:Lcom/netease/h1/qihoo/AdvanceDino$4$1;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 1

    .prologue
    .line 551
    const/4 v0, 0x1

    invoke-static {v0}, Lcom/netease/h1/qihoo/AdvanceDino;->reloadGame(Z)V

    .line 552
    return-void
.end method
