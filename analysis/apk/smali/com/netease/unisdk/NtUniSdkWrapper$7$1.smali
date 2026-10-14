.class Lcom/netease/unisdk/NtUniSdkWrapper$7$1;
.super Ljava/lang/Object;
.source "NtUniSdkWrapper.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/unisdk/NtUniSdkWrapper$7;->finishInit(I)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/netease/unisdk/NtUniSdkWrapper$7;

.field final synthetic val$code:I


# direct methods
.method constructor <init>(Lcom/netease/unisdk/NtUniSdkWrapper$7;I)V
    .locals 0

    .prologue
    .line 156
    iput-object p1, p0, Lcom/netease/unisdk/NtUniSdkWrapper$7$1;->this$0:Lcom/netease/unisdk/NtUniSdkWrapper$7;

    iput p2, p0, Lcom/netease/unisdk/NtUniSdkWrapper$7$1;->val$code:I

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 1

    .prologue
    .line 159
    iget v0, p0, Lcom/netease/unisdk/NtUniSdkWrapper$7$1;->val$code:I

    invoke-static {v0}, Lcom/netease/unisdk/NtUniSdkWrapper;->access$600(I)V

    .line 160
    return-void
.end method
