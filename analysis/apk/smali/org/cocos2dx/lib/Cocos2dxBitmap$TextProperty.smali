.class Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;
.super Ljava/lang/Object;
.source "Cocos2dxBitmap.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lorg/cocos2dx/lib/Cocos2dxBitmap;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0xa
    name = "TextProperty"
.end annotation


# instance fields
.field private final areaHeight:F

.field private final areaWidth:F

.field private final lineHeight:F

.field private final lines:[Ljava/lang/String;

.field private originX:F

.field private originY:F


# direct methods
.method constructor <init>(FF[Ljava/lang/String;)V
    .locals 2
    .param p1, "pAreaWidth"    # F
    .param p2, "pLineHeight"    # F
    .param p3, "pLines"    # [Ljava/lang/String;

    .prologue
    const/4 v1, 0x0

    .line 905
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 906
    iput p1, p0, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->areaWidth:F

    .line 907
    iput p2, p0, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->lineHeight:F

    .line 908
    array-length v0, p3

    int-to-float v0, v0

    mul-float/2addr v0, p2

    iput v0, p0, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->areaHeight:F

    .line 909
    iput-object p3, p0, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->lines:[Ljava/lang/String;

    .line 910
    iput v1, p0, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->originX:F

    .line 911
    iput v1, p0, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->originY:F

    .line 912
    return-void
.end method

.method static synthetic access$000(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;)F
    .locals 1
    .param p0, "x0"    # Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;

    .prologue
    .line 894
    iget v0, p0, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->areaHeight:F

    return v0
.end method

.method static synthetic access$100(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;)F
    .locals 1
    .param p0, "x0"    # Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;

    .prologue
    .line 894
    iget v0, p0, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->originX:F

    return v0
.end method

.method static synthetic access$102(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;F)F
    .locals 0
    .param p0, "x0"    # Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;
    .param p1, "x1"    # F

    .prologue
    .line 894
    iput p1, p0, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->originX:F

    return p1
.end method

.method static synthetic access$116(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;F)F
    .locals 1
    .param p0, "x0"    # Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;
    .param p1, "x1"    # F

    .prologue
    .line 894
    iget v0, p0, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->originX:F

    add-float/2addr v0, p1

    iput v0, p0, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->originX:F

    return v0
.end method

.method static synthetic access$200(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;)F
    .locals 1
    .param p0, "x0"    # Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;

    .prologue
    .line 894
    iget v0, p0, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->areaWidth:F

    return v0
.end method

.method static synthetic access$300(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;)F
    .locals 1
    .param p0, "x0"    # Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;

    .prologue
    .line 894
    iget v0, p0, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->originY:F

    return v0
.end method

.method static synthetic access$302(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;F)F
    .locals 0
    .param p0, "x0"    # Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;
    .param p1, "x1"    # F

    .prologue
    .line 894
    iput p1, p0, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->originY:F

    return p1
.end method

.method static synthetic access$316(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;F)F
    .locals 1
    .param p0, "x0"    # Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;
    .param p1, "x1"    # F

    .prologue
    .line 894
    iget v0, p0, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->originY:F

    add-float/2addr v0, p1

    iput v0, p0, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->originY:F

    return v0
.end method

.method static synthetic access$400(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;)F
    .locals 1
    .param p0, "x0"    # Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;

    .prologue
    .line 894
    iget v0, p0, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->lineHeight:F

    return v0
.end method

.method static synthetic access$500(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;)[Ljava/lang/String;
    .locals 1
    .param p0, "x0"    # Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;

    .prologue
    .line 894
    iget-object v0, p0, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->lines:[Ljava/lang/String;

    return-object v0
.end method
