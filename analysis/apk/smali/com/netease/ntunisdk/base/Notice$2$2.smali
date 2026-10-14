.class Lcom/netease/ntunisdk/base/Notice$2$2;
.super Landroid/webkit/WebViewClient;
.source "Notice.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/ntunisdk/base/Notice$2;->run()V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$1:Lcom/netease/ntunisdk/base/Notice$2;

.field final synthetic val$noticeWv:Landroid/webkit/WebView;


# direct methods
.method constructor <init>(Lcom/netease/ntunisdk/base/Notice$2;Landroid/webkit/WebView;)V
    .locals 0

    .prologue
    .line 112
    iput-object p1, p0, Lcom/netease/ntunisdk/base/Notice$2$2;->this$1:Lcom/netease/ntunisdk/base/Notice$2;

    iput-object p2, p0, Lcom/netease/ntunisdk/base/Notice$2$2;->val$noticeWv:Landroid/webkit/WebView;

    invoke-direct {p0}, Landroid/webkit/WebViewClient;-><init>()V

    return-void
.end method


# virtual methods
.method public shouldOverrideUrlLoading(Landroid/webkit/WebView;Ljava/lang/String;)Z
    .locals 1
    .param p1, "view"    # Landroid/webkit/WebView;
    .param p2, "url"    # Ljava/lang/String;

    .prologue
    .line 114
    iget-object v0, p0, Lcom/netease/ntunisdk/base/Notice$2$2;->val$noticeWv:Landroid/webkit/WebView;

    invoke-virtual {v0, p2}, Landroid/webkit/WebView;->loadUrl(Ljava/lang/String;)V

    .line 115
    const/4 v0, 0x1

    return v0
.end method
