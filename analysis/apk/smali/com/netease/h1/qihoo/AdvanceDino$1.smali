.class final Lcom/netease/h1/qihoo/AdvanceDino$1;
.super Landroid/os/Handler;
.source "AdvanceDino.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/netease/h1/qihoo/AdvanceDino;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x8
    name = null
.end annotation


# direct methods
.method constructor <init>()V
    .locals 0

    .prologue
    .line 130
    invoke-direct {p0}, Landroid/os/Handler;-><init>()V

    return-void
.end method


# virtual methods
.method public handleMessage(Landroid/os/Message;)V
    .locals 6
    .param p1, "msg"    # Landroid/os/Message;

    .prologue
    const v5, 0x7f050073

    const/4 v4, 0x0

    .line 133
    iget v2, p1, Landroid/os/Message;->what:I

    packed-switch v2, :pswitch_data_0

    .line 190
    :goto_0
    return-void

    .line 135
    :pswitch_0
    iget-object v0, p1, Landroid/os/Message;->obj:Ljava/lang/Object;

    check-cast v0, Lcom/netease/h1/qihoo/AdvanceDino$DialogData;

    .line 136
    .local v0, "data":Lcom/netease/h1/qihoo/AdvanceDino$DialogData;
    iget-object v1, v0, Lcom/netease/h1/qihoo/AdvanceDino$DialogData;->url:Ljava/lang/String;

    .line 137
    .local v1, "str_url":Ljava/lang/String;
    new-instance v2, Landroid/app/AlertDialog$Builder;

    invoke-static {}, Lcom/netease/h1/qihoo/AdvanceDino;->access$000()Lcom/netease/h1/qihoo/AdvanceDino;

    move-result-object v3

    invoke-direct {v2, v3}, Landroid/app/AlertDialog$Builder;-><init>(Landroid/content/Context;)V

    iget-object v3, v0, Lcom/netease/h1/qihoo/AdvanceDino$DialogData;->title:Ljava/lang/String;

    invoke-virtual {v2, v3}, Landroid/app/AlertDialog$Builder;->setTitle(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    move-result-object v2

    iget-object v3, v0, Lcom/netease/h1/qihoo/AdvanceDino$DialogData;->message:Ljava/lang/String;

    invoke-virtual {v2, v3}, Landroid/app/AlertDialog$Builder;->setMessage(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    move-result-object v2

    invoke-virtual {v2, v4}, Landroid/app/AlertDialog$Builder;->setCancelable(Z)Landroid/app/AlertDialog$Builder;

    move-result-object v2

    invoke-static {}, Lorg/cocos2dx/lib/Cocos2dxActivity;->getContext()Landroid/content/Context;

    move-result-object v3

    invoke-virtual {v3, v5}, Landroid/content/Context;->getString(I)Ljava/lang/String;

    move-result-object v3

    new-instance v4, Lcom/netease/h1/qihoo/AdvanceDino$1$1;

    invoke-direct {v4, p0, v1}, Lcom/netease/h1/qihoo/AdvanceDino$1$1;-><init>(Lcom/netease/h1/qihoo/AdvanceDino$1;Ljava/lang/String;)V

    invoke-virtual {v2, v3, v4}, Landroid/app/AlertDialog$Builder;->setPositiveButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object v2

    invoke-virtual {v2}, Landroid/app/AlertDialog$Builder;->show()Landroid/app/AlertDialog;

    goto :goto_0

    .line 155
    .end local v0    # "data":Lcom/netease/h1/qihoo/AdvanceDino$DialogData;
    .end local v1    # "str_url":Ljava/lang/String;
    :pswitch_1
    iget-object v0, p1, Landroid/os/Message;->obj:Ljava/lang/Object;

    check-cast v0, Lcom/netease/h1/qihoo/AdvanceDino$DialogData;

    .line 156
    .restart local v0    # "data":Lcom/netease/h1/qihoo/AdvanceDino$DialogData;
    iget-object v1, v0, Lcom/netease/h1/qihoo/AdvanceDino$DialogData;->url:Ljava/lang/String;

    .line 157
    .restart local v1    # "str_url":Ljava/lang/String;
    new-instance v2, Landroid/app/AlertDialog$Builder;

    invoke-static {}, Lcom/netease/h1/qihoo/AdvanceDino;->access$000()Lcom/netease/h1/qihoo/AdvanceDino;

    move-result-object v3

    invoke-direct {v2, v3}, Landroid/app/AlertDialog$Builder;-><init>(Landroid/content/Context;)V

    iget-object v3, v0, Lcom/netease/h1/qihoo/AdvanceDino$DialogData;->title:Ljava/lang/String;

    invoke-virtual {v2, v3}, Landroid/app/AlertDialog$Builder;->setTitle(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    move-result-object v2

    iget-object v3, v0, Lcom/netease/h1/qihoo/AdvanceDino$DialogData;->message:Ljava/lang/String;

    invoke-virtual {v2, v3}, Landroid/app/AlertDialog$Builder;->setMessage(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    move-result-object v2

    invoke-virtual {v2, v4}, Landroid/app/AlertDialog$Builder;->setCancelable(Z)Landroid/app/AlertDialog$Builder;

    move-result-object v2

    invoke-static {}, Lorg/cocos2dx/lib/Cocos2dxActivity;->getContext()Landroid/content/Context;

    move-result-object v3

    invoke-virtual {v3, v5}, Landroid/content/Context;->getString(I)Ljava/lang/String;

    move-result-object v3

    new-instance v4, Lcom/netease/h1/qihoo/AdvanceDino$1$3;

    invoke-direct {v4, p0, v1}, Lcom/netease/h1/qihoo/AdvanceDino$1$3;-><init>(Lcom/netease/h1/qihoo/AdvanceDino$1;Ljava/lang/String;)V

    invoke-virtual {v2, v3, v4}, Landroid/app/AlertDialog$Builder;->setPositiveButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object v2

    invoke-static {}, Lorg/cocos2dx/lib/Cocos2dxActivity;->getContext()Landroid/content/Context;

    move-result-object v3

    const v4, 0x7f050074

    invoke-virtual {v3, v4}, Landroid/content/Context;->getString(I)Ljava/lang/String;

    move-result-object v3

    new-instance v4, Lcom/netease/h1/qihoo/AdvanceDino$1$2;

    invoke-direct {v4, p0}, Lcom/netease/h1/qihoo/AdvanceDino$1$2;-><init>(Lcom/netease/h1/qihoo/AdvanceDino$1;)V

    invoke-virtual {v2, v3, v4}, Landroid/app/AlertDialog$Builder;->setNegativeButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object v2

    invoke-virtual {v2}, Landroid/app/AlertDialog$Builder;->show()Landroid/app/AlertDialog;

    goto :goto_0

    .line 133
    :pswitch_data_0
    .packed-switch 0x1
        :pswitch_0
        :pswitch_1
    .end packed-switch
.end method
