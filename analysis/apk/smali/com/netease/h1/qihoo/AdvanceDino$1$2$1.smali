.class Lcom/netease/h1/qihoo/AdvanceDino$1$2$1;
.super Ljava/lang/Object;
.source "AdvanceDino.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/h1/qihoo/AdvanceDino$1$2;->onClick(Landroid/content/DialogInterface;I)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$1:Lcom/netease/h1/qihoo/AdvanceDino$1$2;


# direct methods
.method constructor <init>(Lcom/netease/h1/qihoo/AdvanceDino$1$2;)V
    .locals 0

    .prologue
    .line 176
    iput-object p1, p0, Lcom/netease/h1/qihoo/AdvanceDino$1$2$1;->this$1:Lcom/netease/h1/qihoo/AdvanceDino$1$2;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 1

    .prologue
    .line 179
    const/4 v0, 0x0

    invoke-static {v0}, Lcom/netease/h1/qihoo/AdvanceDino;->onUserChooseUpdateOrNot(Z)V

    .line 180
    return-void
.end method
