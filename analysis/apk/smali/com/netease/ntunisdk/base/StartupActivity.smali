.class public Lcom/netease/ntunisdk/base/StartupActivity;
.super Landroid/app/Activity;
.source "StartupActivity.java"


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Lcom/netease/ntunisdk/base/StartupActivity$StartupFinishListener;
    }
.end annotation


# static fields
.field private static final TAG:Ljava/lang/String; = "UniSDK Base"

.field public static finishCallback:Lcom/netease/ntunisdk/base/StartupActivity$StartupFinishListener;


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .prologue
    .line 53
    const/4 v0, 0x0

    sput-object v0, Lcom/netease/ntunisdk/base/StartupActivity;->finishCallback:Lcom/netease/ntunisdk/base/StartupActivity$StartupFinishListener;

    return-void
.end method

.method public constructor <init>()V
    .locals 0

    .prologue
    .line 83
    invoke-direct {p0}, Landroid/app/Activity;-><init>()V

    .line 84
    return-void
.end method

.method private static getAnimation(FFJ)Landroid/view/animation/AlphaAnimation;
    .locals 1
    .param p0, "fromAlpha"    # F
    .param p1, "toAlpha"    # F
    .param p2, "time"    # J

    .prologue
    .line 150
    new-instance v0, Landroid/view/animation/AlphaAnimation;

    invoke-direct {v0, p0, p1}, Landroid/view/animation/AlphaAnimation;-><init>(FF)V

    .line 151
    .local v0, "a":Landroid/view/animation/AlphaAnimation;
    invoke-virtual {v0, p2, p3}, Landroid/view/animation/AlphaAnimation;->setDuration(J)V

    .line 154
    return-object v0
.end method

.method public static popStartup(Landroid/content/Context;Lcom/netease/ntunisdk/base/StartupActivity$StartupFinishListener;)V
    .locals 2
    .param p0, "myCtx"    # Landroid/content/Context;
    .param p1, "startupFinishListener"    # Lcom/netease/ntunisdk/base/StartupActivity$StartupFinishListener;

    .prologue
    .line 63
    new-instance v0, Landroid/content/Intent;

    const-class v1, Lcom/netease/ntunisdk/base/StartupActivity;

    invoke-direct {v0, p0, v1}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    invoke-virtual {p0, v0}, Landroid/content/Context;->startActivity(Landroid/content/Intent;)V

    .line 64
    sput-object p1, Lcom/netease/ntunisdk/base/StartupActivity;->finishCallback:Lcom/netease/ntunisdk/base/StartupActivity$StartupFinishListener;

    .line 65
    const-string v0, "UniSDK Base"

    const-string v1, "StartupActivity popStartup"

    invoke-static {v0, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 66
    return-void
.end method

.method public static popStartup(Landroid/content/Context;Lcom/netease/ntunisdk/base/StartupActivity$StartupFinishListener;I)V
    .locals 4
    .param p0, "myCtx"    # Landroid/content/Context;
    .param p1, "startupFinishListener"    # Lcom/netease/ntunisdk/base/StartupActivity$StartupFinishListener;
    .param p2, "color"    # I

    .prologue
    .line 76
    new-instance v0, Landroid/content/Intent;

    const-class v1, Lcom/netease/ntunisdk/base/StartupActivity;

    invoke-direct {v0, p0, v1}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    .line 77
    .local v0, "intent":Landroid/content/Intent;
    const-string v1, "SPLASH_COLOR"

    invoke-virtual {v0, v1, p2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;I)Landroid/content/Intent;

    .line 78
    invoke-virtual {p0, v0}, Landroid/content/Context;->startActivity(Landroid/content/Intent;)V

    .line 79
    sput-object p1, Lcom/netease/ntunisdk/base/StartupActivity;->finishCallback:Lcom/netease/ntunisdk/base/StartupActivity$StartupFinishListener;

    .line 80
    const-string v1, "UniSDK Base"

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "StartupActivity popStartup color: "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2, p2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 81
    return-void
.end method


# virtual methods
.method protected onCreate(Landroid/os/Bundle;)V
    .locals 13
    .param p1, "savedInstanceState"    # Landroid/os/Bundle;

    .prologue
    .line 92
    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V

    .line 93
    const-string v9, "UniSDK Base"

    const-string v10, "StartupActivity onCreate"

    invoke-static {v9, v10}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 94
    new-instance v3, Landroid/widget/ImageView;

    invoke-direct {v3, p0}, Landroid/widget/ImageView;-><init>(Landroid/content/Context;)V

    .line 95
    .local v3, "imgView":Landroid/widget/ImageView;
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/StartupActivity;->getResources()Landroid/content/res/Resources;

    move-result-object v9

    const-string v10, "sdk_startup_logo"

    const-string v11, "drawable"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/StartupActivity;->getPackageName()Ljava/lang/String;

    move-result-object v12

    invoke-virtual {v9, v10, v11, v12}, Landroid/content/res/Resources;->getIdentifier(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)I

    move-result v6

    .line 96
    .local v6, "resID":I
    invoke-virtual {v3, v6}, Landroid/widget/ImageView;->setBackgroundResource(I)V

    .line 97
    new-instance v5, Landroid/widget/RelativeLayout;

    invoke-direct {v5, p0}, Landroid/widget/RelativeLayout;-><init>(Landroid/content/Context;)V

    .line 98
    .local v5, "reLayout":Landroid/widget/RelativeLayout;
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/StartupActivity;->getIntent()Landroid/content/Intent;

    move-result-object v9

    const-string v10, "SPLASH_COLOR"

    const/4 v11, -0x1

    invoke-virtual {v9, v10, v11}, Landroid/content/Intent;->getIntExtra(Ljava/lang/String;I)I

    move-result v0

    .line 99
    .local v0, "color":I
    invoke-virtual {v5, v0}, Landroid/widget/RelativeLayout;->setBackgroundColor(I)V

    .line 100
    new-instance v4, Landroid/widget/RelativeLayout$LayoutParams;

    const/4 v9, -0x2

    const/4 v10, -0x2

    invoke-direct {v4, v9, v10}, Landroid/widget/RelativeLayout$LayoutParams;-><init>(II)V

    .line 103
    .local v4, "params":Landroid/widget/RelativeLayout$LayoutParams;
    const/16 v9, 0xd

    invoke-virtual {v4, v9}, Landroid/widget/RelativeLayout$LayoutParams;->addRule(I)V

    .line 104
    invoke-virtual {v5, v3, v4}, Landroid/widget/RelativeLayout;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    .line 105
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/StartupActivity;->getWindow()Landroid/view/Window;

    move-result-object v9

    const/16 v10, 0x400

    const/16 v11, 0x400

    invoke-virtual {v9, v10, v11}, Landroid/view/Window;->setFlags(II)V

    .line 107
    const/4 v9, 0x1

    invoke-virtual {p0, v9}, Lcom/netease/ntunisdk/base/StartupActivity;->requestWindowFeature(I)Z

    .line 108
    invoke-virtual {p0, v5}, Lcom/netease/ntunisdk/base/StartupActivity;->setContentView(Landroid/view/View;)V

    .line 110
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v9

    const-string v10, "SPLASH_TIME"

    const/4 v11, 0x1

    invoke-interface {v9, v10, v11}, Lcom/netease/ntunisdk/base/GamerInterface;->getPropInt(Ljava/lang/String;I)I

    move-result v8

    .line 112
    .local v8, "time":I
    const/high16 v9, 0x3f800000    # 1.0f

    const/4 v10, 0x0

    mul-int/lit16 v11, v8, 0x3e8

    int-to-long v11, v11

    invoke-static {v9, v10, v11, v12}, Lcom/netease/ntunisdk/base/StartupActivity;->getAnimation(FFJ)Landroid/view/animation/AlphaAnimation;

    move-result-object v2

    .line 113
    .local v2, "hideAnim":Landroid/view/animation/AlphaAnimation;
    new-instance v9, Lcom/netease/ntunisdk/base/StartupActivity$1;

    invoke-direct {v9, p0, v5}, Lcom/netease/ntunisdk/base/StartupActivity$1;-><init>(Lcom/netease/ntunisdk/base/StartupActivity;Landroid/widget/RelativeLayout;)V

    invoke-virtual {v2, v9}, Landroid/view/animation/AlphaAnimation;->setAnimationListener(Landroid/view/animation/Animation$AnimationListener;)V

    .line 132
    new-instance v7, Lcom/netease/ntunisdk/base/StartupActivity$2;

    invoke-direct {v7, p0, v5, v2}, Lcom/netease/ntunisdk/base/StartupActivity$2;-><init>(Lcom/netease/ntunisdk/base/StartupActivity;Landroid/widget/RelativeLayout;Landroid/view/animation/AlphaAnimation;)V

    .line 139
    .local v7, "runnable":Ljava/lang/Runnable;
    new-instance v1, Landroid/os/Handler;

    invoke-direct {v1}, Landroid/os/Handler;-><init>()V

    .line 140
    .local v1, "handler":Landroid/os/Handler;
    const-wide/16 v9, 0x3e8

    invoke-virtual {v1, v7, v9, v10}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    .line 141
    return-void
.end method

.method protected onDestroy()V
    .locals 1

    .prologue
    .line 162
    invoke-super {p0}, Landroid/app/Activity;->onDestroy()V

    .line 163
    sget-object v0, Lcom/netease/ntunisdk/base/StartupActivity;->finishCallback:Lcom/netease/ntunisdk/base/StartupActivity$StartupFinishListener;

    if-eqz v0, :cond_0

    .line 164
    sget-object v0, Lcom/netease/ntunisdk/base/StartupActivity;->finishCallback:Lcom/netease/ntunisdk/base/StartupActivity$StartupFinishListener;

    invoke-interface {v0}, Lcom/netease/ntunisdk/base/StartupActivity$StartupFinishListener;->finishListener()V

    .line 166
    :cond_0
    return-void
.end method
