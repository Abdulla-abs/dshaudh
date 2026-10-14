.class final Lcom/netease/dacommon/VoiceManager$1;
.super Ljava/lang/Object;
.source "VoiceManager.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/netease/dacommon/VoiceManager;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x8
    name = null
.end annotation


# direct methods
.method constructor <init>()V
    .locals 0

    .prologue
    .line 41
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 5

    .prologue
    const/16 v2, 0x64

    .line 44
    invoke-static {}, Lcom/netease/dacommon/VoiceManager;->access$000()Landroid/media/MediaRecorder;

    move-result-object v3

    if-nez v3, :cond_0

    .line 55
    :goto_0
    return-void

    .line 47
    :cond_0
    :try_start_0
    invoke-static {}, Lcom/netease/dacommon/VoiceManager;->access$000()Landroid/media/MediaRecorder;

    move-result-object v3

    invoke-virtual {v3}, Landroid/media/MediaRecorder;->getMaxAmplitude()I

    move-result v3

    mul-int/lit8 v3, v3, 0x64

    const v4, 0x8000

    div-int v1, v3, v4

    .line 48
    .local v1, "volumn":I
    if-le v1, v2, :cond_1

    move v1, v2

    .line 49
    :cond_1
    invoke-static {v1}, Lcom/netease/dacommon/VoiceManager;->setVolumnProgress(I)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 54
    .end local v1    # "volumn":I
    :goto_1
    sget-object v2, Lcom/netease/dacommon/VoiceManager;->mAudioHandler:Landroid/os/Handler;

    const-wide/16 v3, 0x64

    invoke-virtual {v2, p0, v3, v4}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    goto :goto_0

    .line 50
    :catch_0
    move-exception v0

    .line 51
    .local v0, "e":Ljava/lang/Exception;
    invoke-virtual {v0}, Ljava/lang/Exception;->printStackTrace()V

    goto :goto_1
.end method
