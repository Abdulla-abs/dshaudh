.class final Lcom/netease/h1/qihoo/AdvanceDino$2;
.super Ljava/lang/Object;
.source "AdvanceDino.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/h1/qihoo/AdvanceDino;->onApplicationDidFinishLaunching()V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x8
    name = null
.end annotation


# direct methods
.method constructor <init>()V
    .locals 0

    .prologue
    .line 326
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 4

    .prologue
    .line 329
    new-instance v0, Landroid/os/Handler;

    invoke-direct {v0}, Landroid/os/Handler;-><init>()V

    new-instance v1, Lcom/netease/h1/qihoo/AdvanceDino$2$1;

    invoke-direct {v1, p0}, Lcom/netease/h1/qihoo/AdvanceDino$2$1;-><init>(Lcom/netease/h1/qihoo/AdvanceDino$2;)V

    const-wide/16 v2, 0xfa

    invoke-virtual {v0, v1, v2, v3}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    .line 335
    return-void
.end method
