.class Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;
.super Ljava/lang/Object;
.source "Cocos2dxBitmap.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lorg/cocos2dx/lib/Cocos2dxBitmap;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0xa
    name = "TextInfo"
.end annotation


# instance fields
.field public h:I

.field public lineIndex:I

.field public final mText:Ljava/lang/String;

.field public paint:Landroid/graphics/Paint;

.field public w:I

.field public x:I


# direct methods
.method public constructor <init>(ILjava/lang/String;IIILandroid/graphics/Paint;)V
    .locals 0
    .param p1, "li"    # I
    .param p2, "pText"    # Ljava/lang/String;
    .param p3, "pw"    # I
    .param p4, "ph"    # I
    .param p5, "px"    # I
    .param p6, "p"    # Landroid/graphics/Paint;

    .prologue
    .line 922
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 923
    iput p1, p0, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;->lineIndex:I

    .line 924
    iput-object p2, p0, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;->mText:Ljava/lang/String;

    .line 925
    iput p3, p0, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;->w:I

    .line 926
    iput p4, p0, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;->h:I

    .line 927
    iput p5, p0, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;->x:I

    .line 928
    iput-object p6, p0, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;->paint:Landroid/graphics/Paint;

    .line 929
    return-void
.end method
