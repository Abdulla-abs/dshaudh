.class Lorg/cocos2dx/lib/Cocos2dxEditBoxDialog$3;
.super Ljava/lang/Object;
.source "Cocos2dxEditBoxDialog.java"

# interfaces
.implements Landroid/text/TextWatcher;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lorg/cocos2dx/lib/Cocos2dxEditBoxDialog;->onCreate(Landroid/os/Bundle;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lorg/cocos2dx/lib/Cocos2dxEditBoxDialog;


# direct methods
.method constructor <init>(Lorg/cocos2dx/lib/Cocos2dxEditBoxDialog;)V
    .locals 0

    .prologue
    .line 290
    iput-object p1, p0, Lorg/cocos2dx/lib/Cocos2dxEditBoxDialog$3;->this$0:Lorg/cocos2dx/lib/Cocos2dxEditBoxDialog;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public afterTextChanged(Landroid/text/Editable;)V
    .locals 0
    .param p1, "s"    # Landroid/text/Editable;

    .prologue
    .line 313
    return-void
.end method

.method public beforeTextChanged(Ljava/lang/CharSequence;III)V
    .locals 0
    .param p1, "s"    # Ljava/lang/CharSequence;
    .param p2, "start"    # I
    .param p3, "count"    # I
    .param p4, "after"    # I

    .prologue
    .line 295
    return-void
.end method

.method public onTextChanged(Ljava/lang/CharSequence;III)V
    .locals 4
    .param p1, "s"    # Ljava/lang/CharSequence;
    .param p2, "start"    # I
    .param p3, "before"    # I
    .param p4, "count"    # I

    .prologue
    .line 298
    invoke-interface {p1}, Ljava/lang/CharSequence;->length()I

    move-result v2

    if-lez v2, :cond_0

    .line 300
    invoke-interface {p1}, Ljava/lang/CharSequence;->length()I

    move-result v2

    add-int/lit8 v2, v2, -0x1

    invoke-interface {p1, v2}, Ljava/lang/CharSequence;->charAt(I)C

    move-result v0

    .line 301
    .local v0, "l_key":C
    const/16 v2, 0xa

    if-ne v0, v2, :cond_0

    .line 303
    iget-object v2, p0, Lorg/cocos2dx/lib/Cocos2dxEditBoxDialog$3;->this$0:Lorg/cocos2dx/lib/Cocos2dxEditBoxDialog;

    invoke-static {v2}, Lorg/cocos2dx/lib/Cocos2dxEditBoxDialog;->access$000(Lorg/cocos2dx/lib/Cocos2dxEditBoxDialog;)Landroid/widget/EditText;

    move-result-object v2

    invoke-virtual {v2}, Landroid/widget/EditText;->getText()Landroid/text/Editable;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/Object;->toString()Ljava/lang/String;

    move-result-object v1

    .line 304
    .local v1, "l_strText":Ljava/lang/String;
    const/4 v2, 0x0

    invoke-virtual {v1}, Ljava/lang/String;->length()I

    move-result v3

    add-int/lit8 v3, v3, -0x1

    invoke-virtual {v1, v2, v3}, Ljava/lang/String;->substring(II)Ljava/lang/String;

    move-result-object v2

    invoke-static {v2}, Lorg/cocos2dx/lib/Cocos2dxHelper;->setEditTextDialogResult(Ljava/lang/String;)V

    .line 305
    iget-object v2, p0, Lorg/cocos2dx/lib/Cocos2dxEditBoxDialog$3;->this$0:Lorg/cocos2dx/lib/Cocos2dxEditBoxDialog;

    invoke-static {v2}, Lorg/cocos2dx/lib/Cocos2dxEditBoxDialog;->access$200(Lorg/cocos2dx/lib/Cocos2dxEditBoxDialog;)V

    .line 306
    iget-object v2, p0, Lorg/cocos2dx/lib/Cocos2dxEditBoxDialog$3;->this$0:Lorg/cocos2dx/lib/Cocos2dxEditBoxDialog;

    invoke-virtual {v2}, Lorg/cocos2dx/lib/Cocos2dxEditBoxDialog;->dismiss()V

    .line 309
    .end local v0    # "l_key":C
    .end local v1    # "l_strText":Ljava/lang/String;
    :cond_0
    return-void
.end method
