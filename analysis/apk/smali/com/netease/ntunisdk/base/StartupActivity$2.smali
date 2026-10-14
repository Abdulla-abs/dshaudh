.class Lcom/netease/ntunisdk/base/StartupActivity$2;
.super Ljava/lang/Object;
.source "StartupActivity.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/ntunisdk/base/StartupActivity;->onCreate(Landroid/os/Bundle;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/netease/ntunisdk/base/StartupActivity;

.field final synthetic val$hideAnim:Landroid/view/animation/AlphaAnimation;

.field final synthetic val$reLayout:Landroid/widget/RelativeLayout;


# direct methods
.method constructor <init>(Lcom/netease/ntunisdk/base/StartupActivity;Landroid/widget/RelativeLayout;Landroid/view/animation/AlphaAnimation;)V
    .locals 0

    .prologue
    .line 132
    iput-object p1, p0, Lcom/netease/ntunisdk/base/StartupActivity$2;->this$0:Lcom/netease/ntunisdk/base/StartupActivity;

    iput-object p2, p0, Lcom/netease/ntunisdk/base/StartupActivity$2;->val$reLayout:Landroid/widget/RelativeLayout;

    iput-object p3, p0, Lcom/netease/ntunisdk/base/StartupActivity$2;->val$hideAnim:Landroid/view/animation/AlphaAnimation;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 2

    .prologue
    .line 135
    iget-object v0, p0, Lcom/netease/ntunisdk/base/StartupActivity$2;->val$reLayout:Landroid/widget/RelativeLayout;

    iget-object v1, p0, Lcom/netease/ntunisdk/base/StartupActivity$2;->val$hideAnim:Landroid/view/animation/AlphaAnimation;

    invoke-virtual {v0, v1}, Landroid/widget/RelativeLayout;->startAnimation(Landroid/view/animation/Animation;)V

    .line 136
    return-void
.end method
