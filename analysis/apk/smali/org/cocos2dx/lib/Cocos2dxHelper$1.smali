.class final Lorg/cocos2dx/lib/Cocos2dxHelper$1;
.super Ljava/lang/Object;
.source "Cocos2dxHelper.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lorg/cocos2dx/lib/Cocos2dxHelper;->setEditTextDialogResult(Ljava/lang/String;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x8
    name = null
.end annotation


# instance fields
.field final synthetic val$bytesUTF8:[B


# direct methods
.method constructor <init>([B)V
    .locals 0

    .prologue
    .line 423
    iput-object p1, p0, Lorg/cocos2dx/lib/Cocos2dxHelper$1;->val$bytesUTF8:[B

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 1

    .prologue
    .line 426
    iget-object v0, p0, Lorg/cocos2dx/lib/Cocos2dxHelper$1;->val$bytesUTF8:[B

    invoke-static {v0}, Lorg/cocos2dx/lib/Cocos2dxHelper;->access$000([B)V

    .line 427
    return-void
.end method
