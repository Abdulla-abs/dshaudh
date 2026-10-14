.class final Lcom/netease/unisdk/NtUniSdkWrapper$2;
.super Ljava/lang/Object;
.source "NtUniSdkWrapper.java"

# interfaces
.implements Lcom/netease/ntunisdk/base/OnOrderCheckListener;


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
    .line 55
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public orderCheckDone(Lcom/netease/ntunisdk/base/OrderInfo;)V
    .locals 2
    .param p1, "order"    # Lcom/netease/ntunisdk/base/OrderInfo;

    .prologue
    .line 58
    const-string v0, "NtUniSdk"

    const-string v1, "orderCheckDone"

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 59
    invoke-static {p1}, Lcom/netease/unisdk/NtUniSdkWrapper;->access$100(Lcom/netease/ntunisdk/base/OrderInfo;)V

    .line 60
    return-void
.end method

.method public orderConsumeDone(Lcom/netease/ntunisdk/base/OrderInfo;)V
    .locals 0
    .param p1, "arg0"    # Lcom/netease/ntunisdk/base/OrderInfo;

    .prologue
    .line 63
    return-void
.end method
