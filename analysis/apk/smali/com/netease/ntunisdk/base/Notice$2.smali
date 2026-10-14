.class Lcom/netease/ntunisdk/base/Notice$2;
.super Ljava/lang/Object;
.source "Notice.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/ntunisdk/base/Notice;->showNotice(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/netease/ntunisdk/base/Notice;

.field final synthetic val$msg:Ljava/lang/String;

.field final synthetic val$title:Ljava/lang/String;

.field final synthetic val$type:Ljava/lang/String;


# direct methods
.method constructor <init>(Lcom/netease/ntunisdk/base/Notice;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 0

    .prologue
    .line 87
    iput-object p1, p0, Lcom/netease/ntunisdk/base/Notice$2;->this$0:Lcom/netease/ntunisdk/base/Notice;

    iput-object p2, p0, Lcom/netease/ntunisdk/base/Notice$2;->val$title:Ljava/lang/String;

    iput-object p3, p0, Lcom/netease/ntunisdk/base/Notice$2;->val$type:Ljava/lang/String;

    iput-object p4, p0, Lcom/netease/ntunisdk/base/Notice$2;->val$msg:Ljava/lang/String;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 8

    .prologue
    .line 90
    new-instance v0, Landroid/app/AlertDialog$Builder;

    iget-object v5, p0, Lcom/netease/ntunisdk/base/Notice$2;->this$0:Lcom/netease/ntunisdk/base/Notice;

    invoke-static {v5}, Lcom/netease/ntunisdk/base/Notice;->access$100(Lcom/netease/ntunisdk/base/Notice;)Landroid/content/Context;

    move-result-object v5

    invoke-direct {v0, v5}, Landroid/app/AlertDialog$Builder;-><init>(Landroid/content/Context;)V

    .line 91
    .local v0, "builder":Landroid/app/AlertDialog$Builder;
    iget-object v5, p0, Lcom/netease/ntunisdk/base/Notice$2;->val$title:Ljava/lang/String;

    invoke-virtual {v0, v5}, Landroid/app/AlertDialog$Builder;->setTitle(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    .line 92
    const v5, 0x104000a

    new-instance v6, Lcom/netease/ntunisdk/base/Notice$2$1;

    invoke-direct {v6, p0}, Lcom/netease/ntunisdk/base/Notice$2$1;-><init>(Lcom/netease/ntunisdk/base/Notice$2;)V

    invoke-virtual {v0, v5, v6}, Landroid/app/AlertDialog$Builder;->setPositiveButton(ILandroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    .line 98
    const-string v5, "url"

    iget-object v6, p0, Lcom/netease/ntunisdk/base/Notice$2;->val$type:Ljava/lang/String;

    invoke-virtual {v5, v6}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5

    if-eqz v5, :cond_0

    .line 104
    new-instance v2, Landroid/widget/LinearLayout;

    iget-object v5, p0, Lcom/netease/ntunisdk/base/Notice$2;->this$0:Lcom/netease/ntunisdk/base/Notice;

    invoke-static {v5}, Lcom/netease/ntunisdk/base/Notice;->access$100(Lcom/netease/ntunisdk/base/Notice;)Landroid/content/Context;

    move-result-object v5

    invoke-direct {v2, v5}, Landroid/widget/LinearLayout;-><init>(Landroid/content/Context;)V

    .line 105
    .local v2, "noticeLayout":Landroid/widget/LinearLayout;
    new-instance v3, Landroid/webkit/WebView;

    iget-object v5, p0, Lcom/netease/ntunisdk/base/Notice$2;->this$0:Lcom/netease/ntunisdk/base/Notice;

    invoke-static {v5}, Lcom/netease/ntunisdk/base/Notice;->access$100(Lcom/netease/ntunisdk/base/Notice;)Landroid/content/Context;

    move-result-object v5

    invoke-direct {v3, v5}, Landroid/webkit/WebView;-><init>(Landroid/content/Context;)V

    .line 106
    .local v3, "noticeWv":Landroid/webkit/WebView;
    new-instance v5, Landroid/widget/LinearLayout$LayoutParams;

    const/4 v6, -0x2

    const/16 v7, 0x258

    invoke-direct {v5, v6, v7}, Landroid/widget/LinearLayout$LayoutParams;-><init>(II)V

    invoke-virtual {v2, v3, v5}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    .line 107
    invoke-virtual {v3}, Landroid/webkit/WebView;->getSettings()Landroid/webkit/WebSettings;

    move-result-object v4

    .line 108
    .local v4, "webSettings":Landroid/webkit/WebSettings;
    const/4 v5, 0x1

    invoke-virtual {v4, v5}, Landroid/webkit/WebSettings;->setJavaScriptEnabled(Z)V

    .line 110
    iget-object v5, p0, Lcom/netease/ntunisdk/base/Notice$2;->val$msg:Ljava/lang/String;

    invoke-virtual {v3, v5}, Landroid/webkit/WebView;->loadUrl(Ljava/lang/String;)V

    .line 111
    invoke-virtual {v0, v2}, Landroid/app/AlertDialog$Builder;->setView(Landroid/view/View;)Landroid/app/AlertDialog$Builder;

    .line 112
    new-instance v5, Lcom/netease/ntunisdk/base/Notice$2$2;

    invoke-direct {v5, p0, v3}, Lcom/netease/ntunisdk/base/Notice$2$2;-><init>(Lcom/netease/ntunisdk/base/Notice$2;Landroid/webkit/WebView;)V

    invoke-virtual {v3, v5}, Landroid/webkit/WebView;->setWebViewClient(Landroid/webkit/WebViewClient;)V

    .line 122
    .end local v2    # "noticeLayout":Landroid/widget/LinearLayout;
    .end local v3    # "noticeWv":Landroid/webkit/WebView;
    .end local v4    # "webSettings":Landroid/webkit/WebSettings;
    :goto_0
    invoke-virtual {v0}, Landroid/app/AlertDialog$Builder;->create()Landroid/app/AlertDialog;

    move-result-object v1

    .line 123
    .local v1, "customDialog":Landroid/app/AlertDialog;
    invoke-virtual {v1}, Landroid/app/AlertDialog;->show()V

    .line 124
    return-void

    .line 119
    .end local v1    # "customDialog":Landroid/app/AlertDialog;
    :cond_0
    iget-object v5, p0, Lcom/netease/ntunisdk/base/Notice$2;->val$msg:Ljava/lang/String;

    invoke-static {v5}, Landroid/text/Html;->fromHtml(Ljava/lang/String;)Landroid/text/Spanned;

    move-result-object v5

    invoke-virtual {v0, v5}, Landroid/app/AlertDialog$Builder;->setMessage(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    goto :goto_0
.end method
