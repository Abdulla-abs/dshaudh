.class final Lcom/netease/unisdk/NtUniSdkWrapper$5;
.super Ljava/lang/Object;
.source "NtUniSdkWrapper.java"

# interfaces
.implements Lcom/netease/ntunisdk/base/OnExitListener;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/unisdk/NtUniSdkWrapper;->ntInitCallback()V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x8
    name = null
.end annotation


# direct methods
.method constructor <init>()V
    .locals 0

    .prologue
    .line 82
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public exitApp()V
    .locals 2

    .prologue
    .line 85
    const-string v0, "NtUniSdk"

    const-string v1, "exitApp"

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 86
    invoke-static {}, Lcom/netease/unisdk/NtUniSdkWrapper;->access$400()V

    .line 87
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    invoke-interface {v0}, Lcom/netease/ntunisdk/base/GamerInterface;->exit()V

    .line 89
    invoke-static {}, Lcom/netease/unisdk/NtUniSdkWrapper;->access$500()Landroid/app/Activity;

    move-result-object v0

    if-eqz v0, :cond_0

    .line 90
    invoke-static {}, Lcom/netease/unisdk/NtUniSdkWrapper;->access$500()Landroid/app/Activity;

    move-result-object v0

    invoke-virtual {v0}, Landroid/app/Activity;->finish()V

    .line 92
    :cond_0
    return-void
.end method

.method public onOpenExitViewFailed()V
    .locals 0

    .prologue
    .line 95
    return-void
.end method
