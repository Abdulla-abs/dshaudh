.class Lcom/netease/dacommon/AppErrorReport$1;
.super Ljava/lang/Thread;
.source "AppErrorReport.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/dacommon/AppErrorReport;->uncaughtException(Ljava/lang/Thread;Ljava/lang/Throwable;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/netease/dacommon/AppErrorReport;

.field final synthetic val$ex:Ljava/lang/Throwable;


# direct methods
.method constructor <init>(Lcom/netease/dacommon/AppErrorReport;Ljava/lang/Throwable;)V
    .locals 0

    .prologue
    .line 53
    iput-object p1, p0, Lcom/netease/dacommon/AppErrorReport$1;->this$0:Lcom/netease/dacommon/AppErrorReport;

    iput-object p2, p0, Lcom/netease/dacommon/AppErrorReport$1;->val$ex:Ljava/lang/Throwable;

    invoke-direct {p0}, Ljava/lang/Thread;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 2

    .prologue
    .line 56
    iget-object v1, p0, Lcom/netease/dacommon/AppErrorReport$1;->val$ex:Ljava/lang/Throwable;

    invoke-virtual {v1}, Ljava/lang/Throwable;->getMessage()Ljava/lang/String;

    move-result-object v0

    .line 57
    .local v0, "msg":Ljava/lang/String;
    const/4 v1, 0x2

    invoke-static {v1}, Lcom/netease/dacommon/AppErrorReport;->setDumpType(I)V

    .line 58
    invoke-virtual {v0}, Ljava/lang/String;->length()I

    move-result v1

    if-lez v1, :cond_0

    .line 59
    invoke-static {v0}, Lcom/netease/dacommon/AppErrorReport;->replaceInvalidChar(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-static {v1}, Lcom/netease/dacommon/AppErrorReport;->setDumpId(Ljava/lang/String;)V

    .line 62
    :goto_0
    iget-object v1, p0, Lcom/netease/dacommon/AppErrorReport$1;->val$ex:Ljava/lang/Throwable;

    invoke-virtual {v1}, Ljava/lang/Throwable;->getLocalizedMessage()Ljava/lang/String;

    move-result-object v1

    invoke-static {v1}, Lcom/netease/dacommon/AppErrorReport;->sendToServer(Ljava/lang/String;)V

    .line 63
    return-void

    .line 61
    :cond_0
    const-string v1, "unknown_exception"

    invoke-static {v1}, Lcom/netease/dacommon/AppErrorReport;->setDumpId(Ljava/lang/String;)V

    goto :goto_0
.end method
