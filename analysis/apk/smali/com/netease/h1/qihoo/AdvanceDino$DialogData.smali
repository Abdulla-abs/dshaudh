.class public Lcom/netease/h1/qihoo/AdvanceDino$DialogData;
.super Ljava/lang/Object;
.source "AdvanceDino.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/netease/h1/qihoo/AdvanceDino;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x9
    name = "DialogData"
.end annotation


# instance fields
.field public message:Ljava/lang/String;

.field public title:Ljava/lang/String;

.field public url:Ljava/lang/String;


# direct methods
.method public constructor <init>(Ljava/lang/String;Ljava/lang/String;)V
    .locals 1
    .param p1, "title"    # Ljava/lang/String;
    .param p2, "message"    # Ljava/lang/String;

    .prologue
    .line 118
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 119
    iput-object p1, p0, Lcom/netease/h1/qihoo/AdvanceDino$DialogData;->title:Ljava/lang/String;

    .line 120
    iput-object p2, p0, Lcom/netease/h1/qihoo/AdvanceDino$DialogData;->message:Ljava/lang/String;

    .line 121
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/h1/qihoo/AdvanceDino$DialogData;->url:Ljava/lang/String;

    .line 122
    return-void
.end method

.method public constructor <init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 0
    .param p1, "title"    # Ljava/lang/String;
    .param p2, "message"    # Ljava/lang/String;
    .param p3, "url"    # Ljava/lang/String;

    .prologue
    .line 123
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 124
    iput-object p1, p0, Lcom/netease/h1/qihoo/AdvanceDino$DialogData;->title:Ljava/lang/String;

    .line 125
    iput-object p2, p0, Lcom/netease/h1/qihoo/AdvanceDino$DialogData;->message:Ljava/lang/String;

    .line 126
    iput-object p3, p0, Lcom/netease/h1/qihoo/AdvanceDino$DialogData;->url:Ljava/lang/String;

    .line 127
    return-void
.end method
