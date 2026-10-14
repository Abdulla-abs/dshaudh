.class Lcom/netease/ntunisdk/Sdk360$8;
.super Ljava/lang/Object;
.source "Sdk360.java"

# interfaces
.implements Lcom/qihoo/gamecenter/sdk/common/IDispatcherCallback;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/ntunisdk/Sdk360;->doSdkRealNameRegister()V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/netease/ntunisdk/Sdk360;


# direct methods
.method constructor <init>(Lcom/netease/ntunisdk/Sdk360;)V
    .locals 0

    .prologue
    .line 561
    iput-object p1, p0, Lcom/netease/ntunisdk/Sdk360$8;->this$0:Lcom/netease/ntunisdk/Sdk360;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public onFinished(Ljava/lang/String;)V
    .locals 1
    .param p1, "data"    # Ljava/lang/String;

    .prologue
    .line 564
    invoke-static {p1}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v0

    if-nez v0, :cond_0

    .line 565
    const-string v0, "doSdkRealNameRegister_log"

    invoke-static {v0, p1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 567
    :cond_0
    return-void
.end method
