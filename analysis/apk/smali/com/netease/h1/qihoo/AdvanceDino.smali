.class public Lcom/netease/h1/qihoo/AdvanceDino;
.super Lorg/cocos2dx/lib/Cocos2dxActivity;
.source "AdvanceDino.java"


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Lcom/netease/h1/qihoo/AdvanceDino$DialogData;
    }
.end annotation


# static fields
.field private static final MSG_MessageBox_Forced:I = 0x1

.field private static final MSG_MessageBox_Select:I = 0x2

.field private static final SPLASH_TAG_BACK:Ljava/lang/String; = "ADVANCEDINO_SPLASH_TAG_BACK"

.field private static final SPLASH_TAG_LOGO:Ljava/lang/String; = "ADVANCEDINO_SPLASH_TAG_LOGO"

.field public static final WEI_XIN_APP_ID:Ljava/lang/String; = "wx80a52fb1d7ecac64"

.field public static final YI_XIN_APP_ID:Ljava/lang/String; = "yx3d00da779fa14fbda7b867c403058464"

.field private static activeVar:Lcom/netease/h1/qihoo/AdvanceDino;

.field private static framelayout:Landroid/widget/FrameLayout;

.field public static has_splash_logo:Z

.field static mHandler:Landroid/os/Handler;

.field private static wxApi:Lcom/tencent/mm/sdk/openapi/IWXAPI;

.field private static yxApi:Lim/yixin/sdk/api/IYXAPI;


# instance fields
.field private final SPLASH_ANIMATION_TIME:I

.field private final SPLASH_DISPLAY_TIME:I

.field private glSurfaceView:Lorg/cocos2dx/lib/Cocos2dxGLSurfaceView;

.field private m_DAUtils:Lcom/netease/dacommon/DAUtils;


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .prologue
    .line 111
    const/4 v0, 0x0

    sput-boolean v0, Lcom/netease/h1/qihoo/AdvanceDino;->has_splash_logo:Z

    .line 130
    new-instance v0, Lcom/netease/h1/qihoo/AdvanceDino$1;

    invoke-direct {v0}, Lcom/netease/h1/qihoo/AdvanceDino$1;-><init>()V

    sput-object v0, Lcom/netease/h1/qihoo/AdvanceDino;->mHandler:Landroid/os/Handler;

    .line 197
    const/4 v0, 0x0

    sput-object v0, Lcom/netease/h1/qihoo/AdvanceDino;->framelayout:Landroid/widget/FrameLayout;

    .line 561
    const-string v0, "fmodex"

    invoke-static {v0}, Ljava/lang/System;->loadLibrary(Ljava/lang/String;)V

    .line 562
    const-string v0, "fmodevent"

    invoke-static {v0}, Ljava/lang/System;->loadLibrary(Ljava/lang/String;)V

    .line 563
    const-string v0, "dacommon"

    invoke-static {v0}, Ljava/lang/System;->loadLibrary(Ljava/lang/String;)V

    .line 564
    const-string v0, "cocos2djs"

    invoke-static {v0}, Ljava/lang/System;->loadLibrary(Ljava/lang/String;)V

    .line 565
    return-void
.end method

.method public constructor <init>()V
    .locals 1

    .prologue
    .line 95
    invoke-direct {p0}, Lorg/cocos2dx/lib/Cocos2dxActivity;-><init>()V

    .line 303
    const/16 v0, 0xfa

    iput v0, p0, Lcom/netease/h1/qihoo/AdvanceDino;->SPLASH_DISPLAY_TIME:I

    .line 304
    const/16 v0, 0x14d

    iput v0, p0, Lcom/netease/h1/qihoo/AdvanceDino;->SPLASH_ANIMATION_TIME:I

    return-void
.end method

.method public static ConnectionFailedShowAlert()V
    .locals 2

    .prologue
    .line 540
    sget-object v0, Lcom/netease/h1/qihoo/AdvanceDino;->activeVar:Lcom/netease/h1/qihoo/AdvanceDino;

    new-instance v1, Lcom/netease/h1/qihoo/AdvanceDino$4;

    invoke-direct {v1}, Lcom/netease/h1/qihoo/AdvanceDino$4;-><init>()V

    invoke-virtual {v0, v1}, Lcom/netease/h1/qihoo/AdvanceDino;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 558
    return-void
.end method

.method public static ShowDialog(ZLjava/lang/String;)V
    .locals 5
    .param p0, "force"    # Z
    .param p1, "url"    # Ljava/lang/String;

    .prologue
    .line 420
    new-instance v0, Landroid/os/Message;

    invoke-direct {v0}, Landroid/os/Message;-><init>()V

    .line 421
    .local v0, "msg":Landroid/os/Message;
    if-eqz p0, :cond_0

    const/4 v1, 0x1

    iput v1, v0, Landroid/os/Message;->what:I

    .line 423
    :goto_0
    new-instance v1, Lcom/netease/h1/qihoo/AdvanceDino$DialogData;

    invoke-static {}, Lcom/netease/h1/qihoo/AdvanceDino;->getContext()Landroid/content/Context;

    move-result-object v2

    const v3, 0x7f050071

    invoke-virtual {v2, v3}, Landroid/content/Context;->getString(I)Ljava/lang/String;

    move-result-object v2

    invoke-static {}, Lcom/netease/h1/qihoo/AdvanceDino;->getContext()Landroid/content/Context;

    move-result-object v3

    const v4, 0x7f050072

    invoke-virtual {v3, v4}, Landroid/content/Context;->getString(I)Ljava/lang/String;

    move-result-object v3

    invoke-direct {v1, v2, v3, p1}, Lcom/netease/h1/qihoo/AdvanceDino$DialogData;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    iput-object v1, v0, Landroid/os/Message;->obj:Ljava/lang/Object;

    .line 424
    sget-object v1, Lcom/netease/h1/qihoo/AdvanceDino;->mHandler:Landroid/os/Handler;

    invoke-virtual {v1, v0}, Landroid/os/Handler;->sendMessage(Landroid/os/Message;)Z

    .line 425
    return-void

    .line 422
    :cond_0
    const/4 v1, 0x2

    iput v1, v0, Landroid/os/Message;->what:I

    goto :goto_0
.end method

.method static synthetic access$000()Lcom/netease/h1/qihoo/AdvanceDino;
    .locals 1

    .prologue
    .line 95
    sget-object v0, Lcom/netease/h1/qihoo/AdvanceDino;->activeVar:Lcom/netease/h1/qihoo/AdvanceDino;

    return-object v0
.end method

.method static synthetic access$100(Lcom/netease/h1/qihoo/AdvanceDino;)V
    .locals 0
    .param p0, "x0"    # Lcom/netease/h1/qihoo/AdvanceDino;

    .prologue
    .line 95
    invoke-direct {p0}, Lcom/netease/h1/qihoo/AdvanceDino;->playSplashAnimation()V

    return-void
.end method

.method static synthetic access$200()Landroid/widget/FrameLayout;
    .locals 1

    .prologue
    .line 95
    sget-object v0, Lcom/netease/h1/qihoo/AdvanceDino;->framelayout:Landroid/widget/FrameLayout;

    return-object v0
.end method

.method public static bmpDataToByteArray(Landroid/graphics/Bitmap;Z)[B
    .locals 5
    .param p0, "bmp"    # Landroid/graphics/Bitmap;
    .param p1, "needRecycle"    # Z

    .prologue
    .line 489
    new-instance v1, Ljava/io/ByteArrayOutputStream;

    invoke-direct {v1}, Ljava/io/ByteArrayOutputStream;-><init>()V

    .line 490
    .local v1, "output":Ljava/io/ByteArrayOutputStream;
    sget-object v3, Landroid/graphics/Bitmap$CompressFormat;->JPEG:Landroid/graphics/Bitmap$CompressFormat;

    const/16 v4, 0x32

    invoke-virtual {p0, v3, v4, v1}, Landroid/graphics/Bitmap;->compress(Landroid/graphics/Bitmap$CompressFormat;ILjava/io/OutputStream;)Z

    .line 491
    if-eqz p1, :cond_0

    .line 492
    invoke-virtual {p0}, Landroid/graphics/Bitmap;->recycle()V

    .line 495
    :cond_0
    invoke-virtual {v1}, Ljava/io/ByteArrayOutputStream;->toByteArray()[B

    move-result-object v2

    .line 497
    .local v2, "result":[B
    :try_start_0
    invoke-virtual {v1}, Ljava/io/ByteArrayOutputStream;->close()V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 502
    :goto_0
    return-object v2

    .line 498
    :catch_0
    move-exception v0

    .line 499
    .local v0, "e":Ljava/lang/Exception;
    invoke-virtual {v0}, Ljava/lang/Exception;->printStackTrace()V

    goto :goto_0
.end method

.method private static buildTransaction(Ljava/lang/String;)Ljava/lang/String;
    .locals 3
    .param p0, "type"    # Ljava/lang/String;

    .prologue
    .line 453
    if-nez p0, :cond_0

    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v0

    invoke-static {v0, v1}, Ljava/lang/String;->valueOf(J)Ljava/lang/String;

    move-result-object v0

    :goto_0
    return-object v0

    :cond_0
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v0, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v1

    invoke-virtual {v0, v1, v2}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    goto :goto_0
.end method

.method protected static onApplicationDidFinishLaunching()V
    .locals 4

    .prologue
    .line 307
    sget-object v2, Lcom/netease/h1/qihoo/AdvanceDino;->framelayout:Landroid/widget/FrameLayout;

    if-nez v2, :cond_1

    .line 337
    .local v0, "view_back":Landroid/view/View;
    .local v1, "view_logo":Landroid/view/View;
    :cond_0
    :goto_0
    return-void

    .line 311
    .end local v0    # "view_back":Landroid/view/View;
    .end local v1    # "view_logo":Landroid/view/View;
    :cond_1
    sget-object v2, Lcom/netease/h1/qihoo/AdvanceDino;->framelayout:Landroid/widget/FrameLayout;

    const-string v3, "ADVANCEDINO_SPLASH_TAG_LOGO"

    invoke-virtual {v2, v3}, Landroid/widget/FrameLayout;->findViewWithTag(Ljava/lang/Object;)Landroid/view/View;

    move-result-object v1

    .line 312
    .restart local v1    # "view_logo":Landroid/view/View;
    sget-object v2, Lcom/netease/h1/qihoo/AdvanceDino;->framelayout:Landroid/widget/FrameLayout;

    const-string v3, "ADVANCEDINO_SPLASH_TAG_BACK"

    invoke-virtual {v2, v3}, Landroid/widget/FrameLayout;->findViewWithTag(Ljava/lang/Object;)Landroid/view/View;

    move-result-object v0

    .line 313
    .restart local v0    # "view_back":Landroid/view/View;
    if-eqz v1, :cond_2

    if-nez v0, :cond_4

    .line 315
    :cond_2
    if-eqz v0, :cond_3

    .line 317
    sget-object v2, Lcom/netease/h1/qihoo/AdvanceDino;->framelayout:Landroid/widget/FrameLayout;

    invoke-virtual {v2, v0}, Landroid/widget/FrameLayout;->removeView(Landroid/view/View;)V

    .line 320
    :cond_3
    if-eqz v1, :cond_0

    .line 322
    sget-object v2, Lcom/netease/h1/qihoo/AdvanceDino;->framelayout:Landroid/widget/FrameLayout;

    invoke-virtual {v2, v1}, Landroid/widget/FrameLayout;->removeView(Landroid/view/View;)V

    goto :goto_0

    .line 326
    :cond_4
    sget-object v2, Lcom/netease/h1/qihoo/AdvanceDino;->activeVar:Lcom/netease/h1/qihoo/AdvanceDino;

    new-instance v3, Lcom/netease/h1/qihoo/AdvanceDino$2;

    invoke-direct {v3}, Lcom/netease/h1/qihoo/AdvanceDino$2;-><init>()V

    invoke-virtual {v2, v3}, Lcom/netease/h1/qihoo/AdvanceDino;->runOnUiThread(Ljava/lang/Runnable;)V

    goto :goto_0
.end method

.method public static native onUserChooseUpdateOrNot(Z)V
.end method

.method public static openURL(Ljava/lang/String;)V
    .locals 3
    .param p0, "url"    # Ljava/lang/String;

    .prologue
    .line 444
    new-instance v1, Landroid/content/Intent;

    invoke-direct {v1}, Landroid/content/Intent;-><init>()V

    .line 445
    .local v1, "intent":Landroid/content/Intent;
    const-string v2, "android.intent.action.VIEW"

    invoke-virtual {v1, v2}, Landroid/content/Intent;->setAction(Ljava/lang/String;)Landroid/content/Intent;

    .line 446
    invoke-static {p0}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;

    move-result-object v0

    .line 447
    .local v0, "content_url":Landroid/net/Uri;
    invoke-virtual {v1, v0}, Landroid/content/Intent;->setData(Landroid/net/Uri;)Landroid/content/Intent;

    .line 448
    invoke-static {}, Lcom/netease/h1/qihoo/AdvanceDino;->getContext()Landroid/content/Context;

    move-result-object v2

    invoke-virtual {v2, v1}, Landroid/content/Context;->startActivity(Landroid/content/Intent;)V

    .line 449
    return-void
.end method

.method private playSplashAnimation()V
    .locals 5

    .prologue
    .line 340
    const-string v3, "longke"

    const-string v4, "playSplashAnimation"

    invoke-static {v3, v4}, Landroid/util/Log;->v(Ljava/lang/String;Ljava/lang/String;)I

    .line 341
    sget-object v3, Lcom/netease/h1/qihoo/AdvanceDino;->framelayout:Landroid/widget/FrameLayout;

    const-string v4, "ADVANCEDINO_SPLASH_TAG_LOGO"

    invoke-virtual {v3, v4}, Landroid/widget/FrameLayout;->findViewWithTag(Ljava/lang/Object;)Landroid/view/View;

    move-result-object v2

    .line 342
    .local v2, "viewlogo":Landroid/view/View;
    sget-object v3, Lcom/netease/h1/qihoo/AdvanceDino;->framelayout:Landroid/widget/FrameLayout;

    const-string v4, "ADVANCEDINO_SPLASH_TAG_BACK"

    invoke-virtual {v3, v4}, Landroid/widget/FrameLayout;->findViewWithTag(Ljava/lang/Object;)Landroid/view/View;

    move-result-object v1

    .line 343
    .local v1, "viewback":Landroid/view/View;
    new-instance v0, Landroid/view/animation/AlphaAnimation;

    const/high16 v3, 0x3f800000    # 1.0f

    const/4 v4, 0x0

    invoke-direct {v0, v3, v4}, Landroid/view/animation/AlphaAnimation;-><init>(FF)V

    .line 344
    .local v0, "animation":Landroid/view/animation/Animation;
    invoke-virtual {p0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    const-wide/16 v3, 0x14d

    invoke-virtual {v0, v3, v4}, Landroid/view/animation/Animation;->setDuration(J)V

    .line 345
    new-instance v3, Lcom/netease/h1/qihoo/AdvanceDino$3;

    invoke-direct {v3, p0, v2, v1}, Lcom/netease/h1/qihoo/AdvanceDino$3;-><init>(Lcom/netease/h1/qihoo/AdvanceDino;Landroid/view/View;Landroid/view/View;)V

    invoke-virtual {v0, v3}, Landroid/view/animation/Animation;->setAnimationListener(Landroid/view/animation/Animation$AnimationListener;)V

    .line 363
    sget-object v3, Lcom/netease/h1/qihoo/AdvanceDino;->framelayout:Landroid/widget/FrameLayout;

    invoke-virtual {v3, v0}, Landroid/widget/FrameLayout;->startAnimation(Landroid/view/animation/Animation;)V

    .line 364
    return-void
.end method

.method public static native reloadGame(Z)V
.end method

.method public static shareToWeiXin(Ljava/lang/String;Ljava/lang/String;)V
    .locals 13
    .param p0, "comment"    # Ljava/lang/String;
    .param p1, "picture"    # Ljava/lang/String;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .prologue
    .line 506
    const-string v9, "hujing"

    new-instance v10, Ljava/lang/StringBuilder;

    invoke-direct {v10}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v10, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v10

    const-string v11, ": "

    invoke-virtual {v10, v11}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v10

    invoke-virtual {v10, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v10

    invoke-virtual {v10}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v10

    invoke-static {v9, v10}, Landroid/util/Log;->v(Ljava/lang/String;Ljava/lang/String;)I

    .line 509
    new-instance v2, Ljava/io/FileInputStream;

    invoke-direct {v2, p1}, Ljava/io/FileInputStream;-><init>(Ljava/lang/String;)V

    .line 510
    .local v2, "fis":Ljava/io/FileInputStream;
    invoke-static {v2}, Landroid/graphics/BitmapFactory;->decodeStream(Ljava/io/InputStream;)Landroid/graphics/Bitmap;

    move-result-object v1

    .line 511
    .local v1, "bmp0":Landroid/graphics/Bitmap;
    invoke-virtual {v1}, Landroid/graphics/Bitmap;->getWidth()I

    move-result v9

    int-to-double v9, v9

    const-wide/high16 v11, 0x3fe0000000000000L    # 0.5

    mul-double/2addr v9, v11

    double-to-int v8, v9

    .line 512
    .local v8, "w":I
    invoke-virtual {v1}, Landroid/graphics/Bitmap;->getHeight()I

    move-result v9

    int-to-double v9, v9

    const-wide/high16 v11, 0x3fe0000000000000L    # 0.5

    mul-double/2addr v9, v11

    double-to-int v3, v9

    .line 513
    .local v3, "h":I
    const/4 v9, 0x1

    invoke-static {v1, v8, v3, v9}, Landroid/graphics/Bitmap;->createScaledBitmap(Landroid/graphics/Bitmap;IIZ)Landroid/graphics/Bitmap;

    move-result-object v0

    .line 514
    .local v0, "bmp":Landroid/graphics/Bitmap;
    invoke-virtual {v2}, Ljava/io/FileInputStream;->close()V

    .line 516
    new-instance v4, Lcom/tencent/mm/sdk/modelmsg/WXImageObject;

    invoke-direct {v4, v0}, Lcom/tencent/mm/sdk/modelmsg/WXImageObject;-><init>(Landroid/graphics/Bitmap;)V

    .line 518
    .local v4, "imgObj":Lcom/tencent/mm/sdk/modelmsg/WXImageObject;
    new-instance v5, Lcom/tencent/mm/sdk/modelmsg/WXMediaMessage;

    invoke-direct {v5}, Lcom/tencent/mm/sdk/modelmsg/WXMediaMessage;-><init>()V

    .line 519
    .local v5, "msg":Lcom/tencent/mm/sdk/modelmsg/WXMediaMessage;
    iput-object v4, v5, Lcom/tencent/mm/sdk/modelmsg/WXMediaMessage;->mediaObject:Lcom/tencent/mm/sdk/modelmsg/WXMediaMessage$IMediaObject;

    .line 520
    const-string v9, "aabbccdeffefdadf"

    iput-object v9, v5, Lcom/tencent/mm/sdk/modelmsg/WXMediaMessage;->description:Ljava/lang/String;

    .line 522
    const/16 v9, 0x96

    const/16 v10, 0x96

    const/4 v11, 0x1

    invoke-static {v0, v9, v10, v11}, Landroid/graphics/Bitmap;->createScaledBitmap(Landroid/graphics/Bitmap;IIZ)Landroid/graphics/Bitmap;

    move-result-object v7

    .line 523
    .local v7, "thumbBmp":Landroid/graphics/Bitmap;
    const/4 v9, 0x1

    invoke-static {v7, v9}, Lcom/netease/h1/qihoo/AdvanceDino;->bmpDataToByteArray(Landroid/graphics/Bitmap;Z)[B

    move-result-object v9

    iput-object v9, v5, Lcom/tencent/mm/sdk/modelmsg/WXMediaMessage;->thumbData:[B

    .line 525
    new-instance v6, Lcom/tencent/mm/sdk/modelmsg/SendMessageToWX$Req;

    invoke-direct {v6}, Lcom/tencent/mm/sdk/modelmsg/SendMessageToWX$Req;-><init>()V

    .line 526
    .local v6, "req":Lcom/tencent/mm/sdk/modelmsg/SendMessageToWX$Req;
    const-string v9, "img"

    invoke-static {v9}, Lcom/netease/h1/qihoo/AdvanceDino;->buildTransaction(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v9

    iput-object v9, v6, Lcom/tencent/mm/sdk/modelmsg/SendMessageToWX$Req;->transaction:Ljava/lang/String;

    .line 527
    iput-object v5, v6, Lcom/tencent/mm/sdk/modelmsg/SendMessageToWX$Req;->message:Lcom/tencent/mm/sdk/modelmsg/WXMediaMessage;

    .line 529
    const/4 v9, 0x1

    iput v9, v6, Lcom/tencent/mm/sdk/modelmsg/SendMessageToWX$Req;->scene:I

    .line 530
    sget-object v9, Lcom/netease/h1/qihoo/AdvanceDino;->wxApi:Lcom/tencent/mm/sdk/openapi/IWXAPI;

    invoke-interface {v9, v6}, Lcom/tencent/mm/sdk/openapi/IWXAPI;->sendReq(Lcom/tencent/mm/sdk/modelbase/BaseReq;)Z

    .line 532
    const-string v9, "hujing"

    new-instance v10, Ljava/lang/StringBuilder;

    invoke-direct {v10}, Ljava/lang/StringBuilder;-><init>()V

    const-string v11, "png: "

    invoke-virtual {v10, v11}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v10

    iget-object v11, v4, Lcom/tencent/mm/sdk/modelmsg/WXImageObject;->imageData:[B

    array-length v11, v11

    invoke-virtual {v10, v11}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v10

    invoke-virtual {v10}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v10

    invoke-static {v9, v10}, Landroid/util/Log;->v(Ljava/lang/String;Ljava/lang/String;)I

    .line 533
    const-string v9, "hujing"

    new-instance v10, Ljava/lang/StringBuilder;

    invoke-direct {v10}, Ljava/lang/StringBuilder;-><init>()V

    const-string v11, "thumb png: "

    invoke-virtual {v10, v11}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v10

    iget-object v11, v5, Lcom/tencent/mm/sdk/modelmsg/WXMediaMessage;->thumbData:[B

    array-length v11, v11

    invoke-virtual {v10, v11}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v10

    invoke-virtual {v10}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v10

    invoke-static {v9, v10}, Landroid/util/Log;->v(Ljava/lang/String;Ljava/lang/String;)I

    .line 534
    return-void
.end method

.method public static shareToYiXin(Ljava/lang/String;Ljava/lang/String;)V
    .locals 12
    .param p0, "comment"    # Ljava/lang/String;
    .param p1, "picture"    # Ljava/lang/String;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .prologue
    const/16 v11, 0xc8

    const/4 v10, 0x1

    .line 457
    const-string v7, "hujing"

    new-instance v8, Ljava/lang/StringBuilder;

    invoke-direct {v8}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v8, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    const-string v9, ": "

    invoke-virtual {v8, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v8

    invoke-static {v7, v8}, Landroid/util/Log;->v(Ljava/lang/String;Ljava/lang/String;)I

    .line 458
    move-object v5, p0

    .line 461
    .local v5, "text":Ljava/lang/String;
    new-instance v1, Ljava/io/FileInputStream;

    invoke-direct {v1, p1}, Ljava/io/FileInputStream;-><init>(Ljava/lang/String;)V

    .line 462
    .local v1, "fis":Ljava/io/FileInputStream;
    invoke-static {v1}, Landroid/graphics/BitmapFactory;->decodeStream(Ljava/io/InputStream;)Landroid/graphics/Bitmap;

    move-result-object v0

    .line 463
    .local v0, "bmp":Landroid/graphics/Bitmap;
    invoke-virtual {v1}, Ljava/io/FileInputStream;->close()V

    .line 465
    new-instance v2, Lim/yixin/sdk/api/YXImageMessageData;

    invoke-direct {v2, v0}, Lim/yixin/sdk/api/YXImageMessageData;-><init>(Landroid/graphics/Bitmap;)V

    .line 467
    .local v2, "imgObj":Lim/yixin/sdk/api/YXImageMessageData;
    new-instance v3, Lim/yixin/sdk/api/YXMessage;

    invoke-direct {v3}, Lim/yixin/sdk/api/YXMessage;-><init>()V

    .line 468
    .local v3, "msg":Lim/yixin/sdk/api/YXMessage;
    iput-object v2, v3, Lim/yixin/sdk/api/YXMessage;->messageData:Lim/yixin/sdk/api/YXMessage$YXMessageData;

    .line 469
    iput-object v5, v3, Lim/yixin/sdk/api/YXMessage;->description:Ljava/lang/String;

    .line 470
    iput-object v5, v3, Lim/yixin/sdk/api/YXMessage;->comment:Ljava/lang/String;

    .line 471
    invoke-static {v0, v11, v11, v10}, Landroid/graphics/Bitmap;->createScaledBitmap(Landroid/graphics/Bitmap;IIZ)Landroid/graphics/Bitmap;

    move-result-object v6

    .line 472
    .local v6, "thumbBmp":Landroid/graphics/Bitmap;
    invoke-virtual {v0}, Landroid/graphics/Bitmap;->recycle()V

    .line 473
    invoke-static {v6, v10}, Lim/yixin/sdk/util/BitmapUtil;->bmpToByteArray(Landroid/graphics/Bitmap;Z)[B

    move-result-object v7

    iput-object v7, v3, Lim/yixin/sdk/api/YXMessage;->thumbData:[B

    .line 475
    new-instance v4, Lim/yixin/sdk/api/SendMessageToYX$Req;

    invoke-direct {v4}, Lim/yixin/sdk/api/SendMessageToYX$Req;-><init>()V

    .line 476
    .local v4, "req":Lim/yixin/sdk/api/SendMessageToYX$Req;
    const-string v7, "img"

    invoke-static {v7}, Lcom/netease/h1/qihoo/AdvanceDino;->buildTransaction(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v7

    iput-object v7, v4, Lim/yixin/sdk/api/SendMessageToYX$Req;->transaction:Ljava/lang/String;

    .line 477
    iput-object v3, v4, Lim/yixin/sdk/api/SendMessageToYX$Req;->message:Lim/yixin/sdk/api/YXMessage;

    .line 482
    iput v10, v4, Lim/yixin/sdk/api/SendMessageToYX$Req;->scene:I

    .line 483
    sget-object v7, Lcom/netease/h1/qihoo/AdvanceDino;->yxApi:Lim/yixin/sdk/api/IYXAPI;

    invoke-interface {v7, v4}, Lim/yixin/sdk/api/IYXAPI;->sendRequest(Lim/yixin/sdk/api/BaseReq;)Z

    .line 485
    return-void
.end method

.method private splashLogo()V
    .locals 20

    .prologue
    .line 248
    const v17, 0x1020002

    move-object/from16 v0, p0

    move/from16 v1, v17

    invoke-virtual {v0, v1}, Lcom/netease/h1/qihoo/AdvanceDino;->findViewById(I)Landroid/view/View;

    move-result-object v17

    check-cast v17, Landroid/widget/FrameLayout;

    sput-object v17, Lcom/netease/h1/qihoo/AdvanceDino;->framelayout:Landroid/widget/FrameLayout;

    .line 249
    invoke-virtual/range {p0 .. p0}, Lcom/netease/h1/qihoo/AdvanceDino;->getResources()Landroid/content/res/Resources;

    move-result-object v17

    const v18, 0x7f020005

    invoke-virtual/range {v17 .. v18}, Landroid/content/res/Resources;->openRawResource(I)Ljava/io/InputStream;

    move-result-object v17

    invoke-static/range {v17 .. v17}, Landroid/graphics/BitmapFactory;->decodeStream(Ljava/io/InputStream;)Landroid/graphics/Bitmap;

    move-result-object v6

    .line 250
    .local v6, "back":Landroid/graphics/Bitmap;
    new-instance v10, Landroid/widget/ImageView;

    invoke-static {}, Lcom/netease/h1/qihoo/AdvanceDino;->getContext()Landroid/content/Context;

    move-result-object v17

    move-object/from16 v0, v17

    invoke-direct {v10, v0}, Landroid/widget/ImageView;-><init>(Landroid/content/Context;)V

    .line 251
    .local v10, "imgback":Landroid/widget/ImageView;
    invoke-virtual {v10, v6}, Landroid/widget/ImageView;->setImageBitmap(Landroid/graphics/Bitmap;)V

    .line 252
    sget-object v17, Landroid/widget/ImageView$ScaleType;->FIT_XY:Landroid/widget/ImageView$ScaleType;

    move-object/from16 v0, v17

    invoke-virtual {v10, v0}, Landroid/widget/ImageView;->setScaleType(Landroid/widget/ImageView$ScaleType;)V

    .line 253
    const-string v17, "ADVANCEDINO_SPLASH_TAG_BACK"

    move-object/from16 v0, v17

    invoke-virtual {v10, v0}, Landroid/widget/ImageView;->setTag(Ljava/lang/Object;)V

    .line 254
    sget-object v17, Lcom/netease/h1/qihoo/AdvanceDino;->framelayout:Landroid/widget/FrameLayout;

    move-object/from16 v0, v17

    invoke-virtual {v0, v10}, Landroid/widget/FrameLayout;->addView(Landroid/view/View;)V

    .line 256
    invoke-virtual/range {p0 .. p0}, Lcom/netease/h1/qihoo/AdvanceDino;->getResources()Landroid/content/res/Resources;

    move-result-object v17

    const v18, 0x7f020006

    invoke-virtual/range {v17 .. v18}, Landroid/content/res/Resources;->openRawResource(I)Ljava/io/InputStream;

    move-result-object v17

    invoke-static/range {v17 .. v17}, Landroid/graphics/BitmapFactory;->decodeStream(Ljava/io/InputStream;)Landroid/graphics/Bitmap;

    move-result-object v11

    .line 257
    .local v11, "logo":Landroid/graphics/Bitmap;
    new-instance v9, Landroid/widget/ImageView;

    invoke-static {}, Lcom/netease/h1/qihoo/AdvanceDino;->getContext()Landroid/content/Context;

    move-result-object v17

    move-object/from16 v0, v17

    invoke-direct {v9, v0}, Landroid/widget/ImageView;-><init>(Landroid/content/Context;)V

    .line 258
    .local v9, "imgLogo":Landroid/widget/ImageView;
    invoke-virtual {v9, v11}, Landroid/widget/ImageView;->setImageBitmap(Landroid/graphics/Bitmap;)V

    .line 260
    invoke-virtual {v11}, Landroid/graphics/Bitmap;->getHeight()I

    move-result v13

    .line 261
    .local v13, "mapHeight":I
    invoke-virtual {v11}, Landroid/graphics/Bitmap;->getWidth()I

    move-result v14

    .line 263
    .local v14, "mapWidth":I
    const-string v17, "longke"

    new-instance v18, Ljava/lang/StringBuilder;

    invoke-direct/range {v18 .. v18}, Ljava/lang/StringBuilder;-><init>()V

    const-string v19, "mapHeight = "

    invoke-virtual/range {v18 .. v19}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v18

    move-object/from16 v0, v18

    invoke-virtual {v0, v13}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v18

    invoke-virtual/range {v18 .. v18}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v18

    invoke-static/range {v17 .. v18}, Landroid/util/Log;->v(Ljava/lang/String;Ljava/lang/String;)I

    .line 264
    const-string v17, "longke"

    new-instance v18, Ljava/lang/StringBuilder;

    invoke-direct/range {v18 .. v18}, Ljava/lang/StringBuilder;-><init>()V

    const-string v19, "mapWidth = "

    invoke-virtual/range {v18 .. v19}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v18

    move-object/from16 v0, v18

    invoke-virtual {v0, v14}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v18

    invoke-virtual/range {v18 .. v18}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v18

    invoke-static/range {v17 .. v18}, Landroid/util/Log;->v(Ljava/lang/String;Ljava/lang/String;)I

    .line 266
    new-instance v12, Landroid/util/DisplayMetrics;

    invoke-direct {v12}, Landroid/util/DisplayMetrics;-><init>()V

    .line 267
    .local v12, "mDisplayMetrics":Landroid/util/DisplayMetrics;
    invoke-virtual/range {p0 .. p0}, Lcom/netease/h1/qihoo/AdvanceDino;->getWindowManager()Landroid/view/WindowManager;

    move-result-object v17

    invoke-interface/range {v17 .. v17}, Landroid/view/WindowManager;->getDefaultDisplay()Landroid/view/Display;

    move-result-object v17

    move-object/from16 v0, v17

    invoke-virtual {v0, v12}, Landroid/view/Display;->getMetrics(Landroid/util/DisplayMetrics;)V

    .line 268
    iget v3, v12, Landroid/util/DisplayMetrics;->widthPixels:I

    .line 269
    .local v3, "W":I
    iget v2, v12, Landroid/util/DisplayMetrics;->heightPixels:I

    .line 271
    .local v2, "H":I
    int-to-float v0, v2

    move/from16 v17, v0

    const/high16 v18, 0x447f0000    # 1020.0f

    div-float v8, v17, v18

    .line 272
    .local v8, "heigth_ratio":F
    const/high16 v17, 0x43b20000    # 356.0f

    mul-float v17, v17, v8

    move/from16 v0, v17

    float-to-int v4, v0

    .line 273
    .local v4, "_heigth":I
    const/high16 v17, 0x44900000    # 1152.0f

    mul-float v17, v17, v8

    move/from16 v0, v17

    float-to-int v5, v0

    .line 275
    .local v5, "_width":I
    invoke-static {v4, v2}, Ljava/lang/Math;->min(II)I

    move-result v7

    .line 276
    .local v7, "heigth":I
    invoke-static {v5, v3}, Ljava/lang/Math;->min(II)I

    move-result v16

    .line 277
    .local v16, "width":I
    if-ge v3, v2, :cond_0

    .line 279
    invoke-static {v4, v3}, Ljava/lang/Math;->min(II)I

    move-result v16

    .line 280
    invoke-static {v5, v2}, Ljava/lang/Math;->min(II)I

    move-result v7

    .line 283
    :cond_0
    const-string v17, "longke"

    new-instance v18, Ljava/lang/StringBuilder;

    invoke-direct/range {v18 .. v18}, Ljava/lang/StringBuilder;-><init>()V

    const-string v19, "heigth = "

    invoke-virtual/range {v18 .. v19}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v18

    move-object/from16 v0, v18

    invoke-virtual {v0, v7}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v18

    invoke-virtual/range {v18 .. v18}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v18

    invoke-static/range {v17 .. v18}, Landroid/util/Log;->v(Ljava/lang/String;Ljava/lang/String;)I

    .line 284
    const-string v17, "longke"

    new-instance v18, Ljava/lang/StringBuilder;

    invoke-direct/range {v18 .. v18}, Ljava/lang/StringBuilder;-><init>()V

    const-string v19, "width = "

    invoke-virtual/range {v18 .. v19}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v18

    move-object/from16 v0, v18

    move/from16 v1, v16

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v18

    invoke-virtual/range {v18 .. v18}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v18

    invoke-static/range {v17 .. v18}, Landroid/util/Log;->v(Ljava/lang/String;Ljava/lang/String;)I

    .line 286
    new-instance v15, Landroid/widget/FrameLayout$LayoutParams;

    const/16 v17, -0x2

    const/16 v18, -0x2

    move/from16 v0, v17

    move/from16 v1, v18

    invoke-direct {v15, v0, v1}, Landroid/widget/FrameLayout$LayoutParams;-><init>(II)V

    .line 287
    .local v15, "params":Landroid/widget/FrameLayout$LayoutParams;
    const/16 v17, 0x11

    move/from16 v0, v17

    iput v0, v15, Landroid/widget/FrameLayout$LayoutParams;->gravity:I

    .line 288
    iput v7, v15, Landroid/widget/FrameLayout$LayoutParams;->height:I

    .line 289
    move/from16 v0, v16

    iput v0, v15, Landroid/widget/FrameLayout$LayoutParams;->width:I

    .line 291
    const/16 v17, 0x1

    move/from16 v0, v17

    invoke-virtual {v9, v0}, Landroid/widget/ImageView;->setAdjustViewBounds(Z)V

    .line 292
    invoke-virtual {v9, v7}, Landroid/widget/ImageView;->setMaxHeight(I)V

    .line 293
    move/from16 v0, v16

    invoke-virtual {v9, v0}, Landroid/widget/ImageView;->setMaxWidth(I)V

    .line 295
    sget-object v17, Landroid/widget/ImageView$ScaleType;->FIT_CENTER:Landroid/widget/ImageView$ScaleType;

    move-object/from16 v0, v17

    invoke-virtual {v9, v0}, Landroid/widget/ImageView;->setScaleType(Landroid/widget/ImageView$ScaleType;)V

    .line 297
    const-string v17, "ADVANCEDINO_SPLASH_TAG_LOGO"

    move-object/from16 v0, v17

    invoke-virtual {v9, v0}, Landroid/widget/ImageView;->setTag(Ljava/lang/Object;)V

    .line 298
    sget-object v17, Lcom/netease/h1/qihoo/AdvanceDino;->framelayout:Landroid/widget/FrameLayout;

    move-object/from16 v0, v17

    invoke-virtual {v0, v9, v15}, Landroid/widget/FrameLayout;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    .line 299
    return-void
.end method

.method public static syncGetData(Ljava/lang/String;)Ljava/lang/String;
    .locals 6
    .param p0, "strurl"    # Ljava/lang/String;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Lorg/apache/http/client/ClientProtocolException;,
            Ljava/io/IOException;
        }
    .end annotation

    .prologue
    .line 427
    const-string v3, ""

    .line 428
    .local v3, "result":Ljava/lang/String;
    new-instance v0, Lorg/apache/http/client/methods/HttpGet;

    invoke-direct {v0, p0}, Lorg/apache/http/client/methods/HttpGet;-><init>(Ljava/lang/String;)V

    .line 429
    .local v0, "httpRequest":Lorg/apache/http/client/methods/HttpGet;
    new-instance v2, Lorg/apache/http/impl/client/DefaultHttpClient;

    invoke-direct {v2}, Lorg/apache/http/impl/client/DefaultHttpClient;-><init>()V

    .line 430
    .local v2, "httpclient":Lorg/apache/http/client/HttpClient;
    invoke-interface {v2, v0}, Lorg/apache/http/client/HttpClient;->execute(Lorg/apache/http/client/methods/HttpUriRequest;)Lorg/apache/http/HttpResponse;

    move-result-object v1

    .line 431
    .local v1, "httpResponse":Lorg/apache/http/HttpResponse;
    invoke-interface {v1}, Lorg/apache/http/HttpResponse;->getStatusLine()Lorg/apache/http/StatusLine;

    move-result-object v4

    invoke-interface {v4}, Lorg/apache/http/StatusLine;->getStatusCode()I

    move-result v4

    const/16 v5, 0xc8

    if-ne v4, v5, :cond_0

    .line 433
    invoke-interface {v1}, Lorg/apache/http/HttpResponse;->getEntity()Lorg/apache/http/HttpEntity;

    move-result-object v4

    invoke-static {v4}, Lorg/apache/http/util/EntityUtils;->toString(Lorg/apache/http/HttpEntity;)Ljava/lang/String;

    move-result-object v3

    .line 440
    :cond_0
    return-object v3
.end method


# virtual methods
.method protected onActivityResult(IILandroid/content/Intent;)V
    .locals 1
    .param p1, "requestCode"    # I
    .param p2, "resultCode"    # I
    .param p3, "data"    # Landroid/content/Intent;

    .prologue
    .line 414
    invoke-super {p0, p1, p2, p3}, Lorg/cocos2dx/lib/Cocos2dxActivity;->onActivityResult(IILandroid/content/Intent;)V

    .line 415
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    invoke-interface {v0, p1, p2, p3}, Lcom/netease/ntunisdk/base/GamerInterface;->handleOnActivityResult(IILandroid/content/Intent;)V

    .line 416
    return-void
.end method

.method protected onCreate(Landroid/os/Bundle;)V
    .locals 6
    .param p1, "savedInstanceState"    # Landroid/os/Bundle;

    .prologue
    .line 200
    invoke-super {p0, p1}, Lorg/cocos2dx/lib/Cocos2dxActivity;->onCreate(Landroid/os/Bundle;)V

    .line 202
    invoke-static {p0}, Lcom/netease/ntunisdk/base/SdkMgr;->init(Landroid/content/Context;)V

    .line 203
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v3

    iget-object v4, p0, Lcom/netease/h1/qihoo/AdvanceDino;->glSurfaceView:Lorg/cocos2dx/lib/Cocos2dxGLSurfaceView;

    invoke-interface {v3, v4}, Lcom/netease/ntunisdk/base/GamerInterface;->setGlView(Landroid/opengl/GLSurfaceView;)V

    .line 204
    invoke-static {p0}, Lcom/netease/unisdk/NtUniSdkWrapper;->ntInitDebugMode(Landroid/content/Context;)V

    .line 205
    invoke-static {}, Lcom/netease/unisdk/NtUniSdkWrapper;->ntInitCallback()V

    .line 206
    # Local startup: skip obsolete channel SDK initialization.

    .line 208
    new-instance v3, Lcom/netease/dacommon/DAUtils;

    invoke-direct {v3}, Lcom/netease/dacommon/DAUtils;-><init>()V

    iput-object v3, p0, Lcom/netease/h1/qihoo/AdvanceDino;->m_DAUtils:Lcom/netease/dacommon/DAUtils;

    .line 209
    iget-object v3, p0, Lcom/netease/h1/qihoo/AdvanceDino;->m_DAUtils:Lcom/netease/dacommon/DAUtils;

    invoke-static {}, Lcom/netease/h1/qihoo/AdvanceDino;->getContext()Landroid/content/Context;

    move-result-object v4

    invoke-virtual {v3, v4}, Lcom/netease/dacommon/DAUtils;->init(Landroid/content/Context;)V

    .line 211
    invoke-virtual {p0}, Lcom/netease/h1/qihoo/AdvanceDino;->getApplicationContext()Landroid/content/Context;

    move-result-object v2

    .line 213
    .local v2, "mcontext":Landroid/content/Context;
    const-string v3, "package_name"

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    const-string v5, " class name: "

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {p0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/Class;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v3, v4}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 214
    const-string v3, "package_name"

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    const-string v5, " package name: "

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {p0}, Lcom/netease/h1/qihoo/AdvanceDino;->getPackageName()Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v3, v4}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 218
    sget-boolean v3, Lcom/netease/h1/qihoo/AdvanceDino;->has_splash_logo:Z

    if-nez v3, :cond_0

    .line 222
    :try_start_0
    invoke-direct {p0}, Lcom/netease/h1/qihoo/AdvanceDino;->splashLogo()V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 227
    :cond_0
    :goto_0
    const/4 v3, 0x1

    sput-boolean v3, Lcom/netease/h1/qihoo/AdvanceDino;->has_splash_logo:Z

    .line 230
    iget-object v3, p0, Lcom/netease/h1/qihoo/AdvanceDino;->glSurfaceView:Lorg/cocos2dx/lib/Cocos2dxGLSurfaceView;

    invoke-virtual {v3}, Lorg/cocos2dx/lib/Cocos2dxGLSurfaceView;->hideSystemUI()V

    .line 231
    sput-object p0, Lcom/netease/h1/qihoo/AdvanceDino;->activeVar:Lcom/netease/h1/qihoo/AdvanceDino;

    .line 233
    const-string v3, "yx3d00da779fa14fbda7b867c403058464"

    invoke-static {p0, v3}, Lim/yixin/sdk/api/YXAPIFactory;->createYXAPI(Landroid/content/Context;Ljava/lang/String;)Lim/yixin/sdk/api/IYXAPI;

    move-result-object v3

    sput-object v3, Lcom/netease/h1/qihoo/AdvanceDino;->yxApi:Lim/yixin/sdk/api/IYXAPI;

    .line 234
    sget-object v3, Lcom/netease/h1/qihoo/AdvanceDino;->yxApi:Lim/yixin/sdk/api/IYXAPI;

    invoke-interface {v3}, Lim/yixin/sdk/api/IYXAPI;->registerApp()Z

    .line 236
    const-string v3, "wx80a52fb1d7ecac64"

    const/4 v4, 0x0

    invoke-static {p0, v3, v4}, Lcom/tencent/mm/sdk/openapi/WXAPIFactory;->createWXAPI(Landroid/content/Context;Ljava/lang/String;Z)Lcom/tencent/mm/sdk/openapi/IWXAPI;

    move-result-object v3

    sput-object v3, Lcom/netease/h1/qihoo/AdvanceDino;->wxApi:Lcom/tencent/mm/sdk/openapi/IWXAPI;

    .line 237
    sget-object v3, Lcom/netease/h1/qihoo/AdvanceDino;->wxApi:Lcom/tencent/mm/sdk/openapi/IWXAPI;

    const-string v4, "wx80a52fb1d7ecac64"

    invoke-interface {v3, v4}, Lcom/tencent/mm/sdk/openapi/IWXAPI;->registerApp(Ljava/lang/String;)Z

    .line 238
    invoke-static {}, Lcom/netease/dacommon/VoiceManager;->initAudioRDecorder()V

    .line 240
    invoke-static {p0}, Lcom/netease/pushclient/PushManager;->init(Landroid/content/Context;)V

    .line 241
    invoke-static {}, Lcom/netease/pushclient/PushManager;->startService()V

    .line 242
    invoke-static {}, Lcom/netease/pushclient/PushManager;->getDevId()Ljava/lang/String;

    move-result-object v0

    .line 243
    .local v0, "devId":Ljava/lang/String;
    const-string v3, "Ngpush"

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    const-string v5, "devId:"

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v3, v4}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 244
    return-void

    .line 223
    .end local v0    # "devId":Ljava/lang/String;
    :catch_0
    move-exception v1

    .line 224
    .local v1, "e":Ljava/lang/Exception;
    invoke-virtual {v1}, Ljava/lang/Exception;->printStackTrace()V

    goto :goto_0
.end method

.method public onCreateView()Lorg/cocos2dx/lib/Cocos2dxGLSurfaceView;
    .locals 7

    .prologue
    const/16 v1, 0x8

    .line 368
    new-instance v0, Lorg/cocos2dx/lib/Cocos2dxGLSurfaceView;

    invoke-direct {v0, p0}, Lorg/cocos2dx/lib/Cocos2dxGLSurfaceView;-><init>(Landroid/content/Context;)V

    iput-object v0, p0, Lcom/netease/h1/qihoo/AdvanceDino;->glSurfaceView:Lorg/cocos2dx/lib/Cocos2dxGLSurfaceView;

    .line 369
    iget-object v0, p0, Lcom/netease/h1/qihoo/AdvanceDino;->glSurfaceView:Lorg/cocos2dx/lib/Cocos2dxGLSurfaceView;

    const/16 v5, 0x10

    move v2, v1

    move v3, v1

    move v4, v1

    move v6, v1

    invoke-virtual/range {v0 .. v6}, Lorg/cocos2dx/lib/Cocos2dxGLSurfaceView;->setEGLConfigChooser(IIIIII)V

    .line 370
    iget-object v0, p0, Lcom/netease/h1/qihoo/AdvanceDino;->glSurfaceView:Lorg/cocos2dx/lib/Cocos2dxGLSurfaceView;

    return-object v0
.end method

.method protected onDestroy()V
    .locals 2

    .prologue
    .line 375
    const-string v0, "AdvanceDino"

    const-string v1, "onDestroy"

    invoke-static {v0, v1}, Landroid/util/Log;->v(Ljava/lang/String;Ljava/lang/String;)I

    .line 376
    invoke-super {p0}, Lorg/cocos2dx/lib/Cocos2dxActivity;->onDestroy()V

    .line 377
    invoke-virtual {p0}, Lcom/netease/h1/qihoo/AdvanceDino;->isFinishing()Z

    move-result v0

    if-eqz v0, :cond_0

    .line 379
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->destroyInst()V

    .line 381
    const/4 v0, 0x0

    invoke-static {v0}, Ljava/lang/System;->exit(I)V

    .line 383
    :cond_0
    return-void
.end method

.method protected onPause()V
    .locals 1

    .prologue
    .line 387
    invoke-super {p0}, Lorg/cocos2dx/lib/Cocos2dxActivity;->onPause()V

    .line 388
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    invoke-interface {v0}, Lcom/netease/ntunisdk/base/GamerInterface;->handleOnPause()V

    .line 389
    return-void
.end method

.method protected onRestart()V
    .locals 2

    .prologue
    .line 406
    const-string v0, "AdvanceDino"

    const-string v1, "onRestart"

    invoke-static {v0, v1}, Landroid/util/Log;->v(Ljava/lang/String;Ljava/lang/String;)I

    .line 407
    invoke-super {p0}, Lorg/cocos2dx/lib/Cocos2dxActivity;->onRestart()V

    .line 409
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    invoke-interface {v0}, Lcom/netease/ntunisdk/base/GamerInterface;->handleOnRestart()V

    .line 410
    return-void
.end method

.method protected onResume()V
    .locals 1

    .prologue
    .line 393
    invoke-super {p0}, Lorg/cocos2dx/lib/Cocos2dxActivity;->onResume()V

    .line 394
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    invoke-interface {v0}, Lcom/netease/ntunisdk/base/GamerInterface;->handleOnResume()V

    .line 395
    return-void
.end method

.method protected onStop()V
    .locals 2

    .prologue
    .line 399
    const-string v0, "AdvanceDino"

    const-string v1, "onStop"

    invoke-static {v0, v1}, Landroid/util/Log;->v(Ljava/lang/String;Ljava/lang/String;)I

    .line 400
    invoke-super {p0}, Lorg/cocos2dx/lib/Cocos2dxActivity;->onStop()V

    .line 401
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    invoke-interface {v0}, Lcom/netease/ntunisdk/base/GamerInterface;->handleOnStop()V

    .line 402
    return-void
.end method
