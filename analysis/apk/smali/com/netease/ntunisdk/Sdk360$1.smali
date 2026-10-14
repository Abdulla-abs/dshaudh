.class Lcom/netease/ntunisdk/Sdk360$1;
.super Landroid/os/Handler;
.source "Sdk360.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/ntunisdk/Sdk360;->init(Lcom/netease/ntunisdk/base/OnFinishInitListener;)V
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
    .line 63
    iput-object p1, p0, Lcom/netease/ntunisdk/Sdk360$1;->this$0:Lcom/netease/ntunisdk/Sdk360;

    invoke-direct {p0}, Landroid/os/Handler;-><init>()V

    return-void
.end method


# virtual methods
.method public handleMessage(Landroid/os/Message;)V
    .locals 3
    .param p1, "msg"    # Landroid/os/Message;

    .prologue
    .line 65
    iget-object v0, p1, Landroid/os/Message;->obj:Ljava/lang/Object;

    check-cast v0, Ljava/lang/String;

    .line 66
    .local v0, "message":Ljava/lang/String;
    iget-object v1, p0, Lcom/netease/ntunisdk/Sdk360$1;->this$0:Lcom/netease/ntunisdk/Sdk360;

    invoke-static {v1}, Lcom/netease/ntunisdk/Sdk360;->access$000(Lcom/netease/ntunisdk/Sdk360;)Landroid/content/Context;

    move-result-object v1

    const/4 v2, 0x1

    invoke-static {v1, v0, v2}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object v1

    invoke-virtual {v1}, Landroid/widget/Toast;->show()V

    .line 67
    return-void
.end method
