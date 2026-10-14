.class public Lcom/netease/ntunisdk/base/Notice;
.super Ljava/lang/Object;
.source "Notice.java"


# static fields
.field private static final TAG:Ljava/lang/String; = "UniSDK notice"

.field private static final TYPE_HTML:Ljava/lang/String; = "html"

.field private static final TYPE_TEXT:Ljava/lang/String; = "txt"

.field private static final TYPE_URL:Ljava/lang/String; = "url"

.field private static final URL:Ljava/lang/String; = "http://192.168.25.190:8080/Gamegg/notice.jsp?gameid=%s&channel=%s&sdk_version=%s&game_version=%s"


# instance fields
.field private mContext:Landroid/content/Context;


# direct methods
.method public constructor <init>(Landroid/content/Context;)V
    .locals 0
    .param p1, "ctx"    # Landroid/content/Context;

    .prologue
    .line 38
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 39
    iput-object p1, p0, Lcom/netease/ntunisdk/base/Notice;->mContext:Landroid/content/Context;

    .line 40
    return-void
.end method

.method static synthetic access$000(Lcom/netease/ntunisdk/base/Notice;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 0
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/Notice;
    .param p1, "x1"    # Ljava/lang/String;
    .param p2, "x2"    # Ljava/lang/String;
    .param p3, "x3"    # Ljava/lang/String;

    .prologue
    .line 29
    invoke-direct {p0, p1, p2, p3}, Lcom/netease/ntunisdk/base/Notice;->showNotice(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    return-void
.end method

.method static synthetic access$100(Lcom/netease/ntunisdk/base/Notice;)Landroid/content/Context;
    .locals 1
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/Notice;

    .prologue
    .line 29
    iget-object v0, p0, Lcom/netease/ntunisdk/base/Notice;->mContext:Landroid/content/Context;

    return-object v0
.end method

.method private showNotice(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 2
    .param p1, "type"    # Ljava/lang/String;
    .param p2, "title"    # Ljava/lang/String;
    .param p3, "msg"    # Ljava/lang/String;

    .prologue
    .line 86
    iget-object v0, p0, Lcom/netease/ntunisdk/base/Notice;->mContext:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 87
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/Notice$2;

    invoke-direct {v1, p0, p2, p1, p3}, Lcom/netease/ntunisdk/base/Notice$2;-><init>(Lcom/netease/ntunisdk/base/Notice;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 126
    return-void
.end method


# virtual methods
.method public checkNotice(Lcom/netease/ntunisdk/base/SdkBase;)V
    .locals 2
    .param p1, "sdk"    # Lcom/netease/ntunisdk/base/SdkBase;

    .prologue
    .line 47
    const-string v0, "UniSDK notice"

    const-string v1, "checkNotice"

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 48
    new-instance v0, Ljava/lang/Thread;

    new-instance v1, Lcom/netease/ntunisdk/base/Notice$1;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/Notice$1;-><init>(Lcom/netease/ntunisdk/base/Notice;)V

    invoke-direct {v0, v1}, Ljava/lang/Thread;-><init>(Ljava/lang/Runnable;)V

    invoke-virtual {v0}, Ljava/lang/Thread;->start()V

    .line 79
    return-void
.end method
