.class final Lcom/netease/dacommon/VoiceManager$3;
.super Ljava/lang/Object;
.source "VoiceManager.java"

# interfaces
.implements Landroid/media/MediaPlayer$OnCompletionListener;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/dacommon/VoiceManager;->playAudio(Ljava/lang/String;Ljava/lang/String;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x8
    name = null
.end annotation


# direct methods
.method constructor <init>()V
    .locals 0

    .prologue
    .line 179
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public onCompletion(Landroid/media/MediaPlayer;)V
    .locals 2
    .param p1, "mp"    # Landroid/media/MediaPlayer;

    .prologue
    .line 182
    invoke-virtual {p1}, Landroid/media/MediaPlayer;->getCurrentPosition()I

    move-result v0

    .line 183
    .local v0, "cur":I
    if-lez v0, :cond_0

    const/16 v1, 0x7918

    if-gt v0, v1, :cond_0

    .line 184
    invoke-virtual {p1}, Landroid/media/MediaPlayer;->stop()V

    .line 185
    invoke-virtual {p1}, Landroid/media/MediaPlayer;->reset()V

    .line 186
    invoke-static {}, Lcom/netease/dacommon/VoiceManager;->onPlayAudioFinished()V

    .line 188
    :cond_0
    return-void
.end method
