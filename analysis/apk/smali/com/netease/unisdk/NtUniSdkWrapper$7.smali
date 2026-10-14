.class final Lcom/netease/unisdk/NtUniSdkWrapper$7;
.super Ljava/lang/Object;
.source "NtUniSdkWrapper.java"

# interfaces
.implements Lcom/netease/ntunisdk/base/OnFinishInitListener;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/unisdk/NtUniSdkWrapper;->ntInit(Landroid/app/Activity;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x8
    name = null
.end annotation


# direct methods
.method constructor <init>()V
    .locals 0

    .prologue
    .line 152
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public finishInit(I)V
    .locals 2
    .param p1, "code"    # I

    .prologue
    .line 155
    const-string v0, "NtUniSdk finishInit"

    const-string v1, "NtUniSdk finishInit"

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 156
    invoke-static {}, Lorg/cocos2dx/lib/Cocos2dxGLSurfaceView;->getInstance()Lorg/cocos2dx/lib/Cocos2dxGLSurfaceView;

    move-result-object v0

    new-instance v1, Lcom/netease/unisdk/NtUniSdkWrapper$7$1;

    invoke-direct {v1, p0, p1}, Lcom/netease/unisdk/NtUniSdkWrapper$7$1;-><init>(Lcom/netease/unisdk/NtUniSdkWrapper$7;I)V

    invoke-virtual {v0, v1}, Lorg/cocos2dx/lib/Cocos2dxGLSurfaceView;->queueEvent(Ljava/lang/Runnable;)V

    .line 162
    return-void
.end method
