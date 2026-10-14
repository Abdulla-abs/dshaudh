.class Lcom/netease/h1/qihoo/AdvanceDino$3;
.super Ljava/lang/Object;
.source "AdvanceDino.java"

# interfaces
.implements Landroid/view/animation/Animation$AnimationListener;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/h1/qihoo/AdvanceDino;->playSplashAnimation()V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/netease/h1/qihoo/AdvanceDino;

.field final synthetic val$viewback:Landroid/view/View;

.field final synthetic val$viewlogo:Landroid/view/View;


# direct methods
.method constructor <init>(Lcom/netease/h1/qihoo/AdvanceDino;Landroid/view/View;Landroid/view/View;)V
    .locals 0

    .prologue
    .line 345
    iput-object p1, p0, Lcom/netease/h1/qihoo/AdvanceDino$3;->this$0:Lcom/netease/h1/qihoo/AdvanceDino;

    iput-object p2, p0, Lcom/netease/h1/qihoo/AdvanceDino$3;->val$viewlogo:Landroid/view/View;

    iput-object p3, p0, Lcom/netease/h1/qihoo/AdvanceDino$3;->val$viewback:Landroid/view/View;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public onAnimationEnd(Landroid/view/animation/Animation;)V
    .locals 3
    .param p1, "arg0"    # Landroid/view/animation/Animation;

    .prologue
    .line 348
    const-string v1, "longke"

    const-string v2, "playSplashAnimation onAnimationEnd"

    invoke-static {v1, v2}, Landroid/util/Log;->v(Ljava/lang/String;Ljava/lang/String;)I

    .line 351
    :try_start_0
    invoke-static {}, Lcom/netease/h1/qihoo/AdvanceDino;->access$200()Landroid/widget/FrameLayout;

    move-result-object v1

    iget-object v2, p0, Lcom/netease/h1/qihoo/AdvanceDino$3;->val$viewlogo:Landroid/view/View;

    invoke-virtual {v1, v2}, Landroid/widget/FrameLayout;->removeView(Landroid/view/View;)V

    .line 352
    invoke-static {}, Lcom/netease/h1/qihoo/AdvanceDino;->access$200()Landroid/widget/FrameLayout;

    move-result-object v1

    iget-object v2, p0, Lcom/netease/h1/qihoo/AdvanceDino$3;->val$viewback:Landroid/view/View;

    invoke-virtual {v1, v2}, Landroid/widget/FrameLayout;->removeView(Landroid/view/View;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 357
    :goto_0
    return-void

    .line 353
    :catch_0
    move-exception v0

    .line 354
    .local v0, "e":Ljava/lang/Exception;
    const-string v1, "longke"

    const-string v2, "longke error"

    invoke-static {v1, v2}, Landroid/util/Log;->v(Ljava/lang/String;Ljava/lang/String;)I

    .line 355
    invoke-virtual {v0}, Ljava/lang/Exception;->printStackTrace()V

    goto :goto_0
.end method

.method public onAnimationRepeat(Landroid/view/animation/Animation;)V
    .locals 0
    .param p1, "arg0"    # Landroid/view/animation/Animation;

    .prologue
    .line 359
    return-void
.end method

.method public onAnimationStart(Landroid/view/animation/Animation;)V
    .locals 0
    .param p1, "arg0"    # Landroid/view/animation/Animation;

    .prologue
    .line 361
    return-void
.end method
