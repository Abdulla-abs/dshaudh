.class Lcom/netease/h1/qihoo/AdvanceDino$2$1;
.super Ljava/lang/Object;
.source "AdvanceDino.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/h1/qihoo/AdvanceDino$2;->run()V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/netease/h1/qihoo/AdvanceDino$2;


# direct methods
.method constructor <init>(Lcom/netease/h1/qihoo/AdvanceDino$2;)V
    .locals 0

    .prologue
    .line 329
    iput-object p1, p0, Lcom/netease/h1/qihoo/AdvanceDino$2$1;->this$0:Lcom/netease/h1/qihoo/AdvanceDino$2;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 1

    .prologue
    .line 331
    invoke-static {}, Lcom/netease/h1/qihoo/AdvanceDino;->access$000()Lcom/netease/h1/qihoo/AdvanceDino;

    move-result-object v0

    invoke-static {v0}, Lcom/netease/h1/qihoo/AdvanceDino;->access$100(Lcom/netease/h1/qihoo/AdvanceDino;)V

    .line 332
    return-void
.end method
