.class public Lcom/netease/dacommon/VoiceManager;
.super Ljava/lang/Object;
.source "VoiceManager.java"


# static fields
.field private static audioPlayer:Landroid/media/MediaPlayer;

.field private static audio_fname:Ljava/lang/String;

.field public static audio_time:J

.field private static current_audio_fname:Ljava/lang/String;

.field static mAudioHandler:Landroid/os/Handler;

.field private static mAudioRecord:Landroid/media/MediaRecorder;

.field static r_audio_volumn:Ljava/lang/Runnable;


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .prologue
    const/4 v0, 0x0

    .line 26
    sput-object v0, Lcom/netease/dacommon/VoiceManager;->audio_fname:Ljava/lang/String;

    .line 27
    sput-object v0, Lcom/netease/dacommon/VoiceManager;->current_audio_fname:Ljava/lang/String;

    .line 41
    new-instance v0, Lcom/netease/dacommon/VoiceManager$1;

    invoke-direct {v0}, Lcom/netease/dacommon/VoiceManager$1;-><init>()V

    sput-object v0, Lcom/netease/dacommon/VoiceManager;->r_audio_volumn:Ljava/lang/Runnable;

    .line 58
    new-instance v0, Landroid/os/Handler;

    invoke-direct {v0}, Landroid/os/Handler;-><init>()V

    sput-object v0, Lcom/netease/dacommon/VoiceManager;->mAudioHandler:Landroid/os/Handler;

    return-void
.end method

.method public constructor <init>()V
    .locals 0

    .prologue
    .line 21
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method static synthetic access$000()Landroid/media/MediaRecorder;
    .locals 1

    .prologue
    .line 21
    sget-object v0, Lcom/netease/dacommon/VoiceManager;->mAudioRecord:Landroid/media/MediaRecorder;

    return-object v0
.end method

.method static synthetic access$100()Landroid/media/MediaPlayer;
    .locals 1

    .prologue
    .line 21
    sget-object v0, Lcom/netease/dacommon/VoiceManager;->audioPlayer:Landroid/media/MediaPlayer;

    return-object v0
.end method

.method private static copyAudioFile(Ljava/io/File;Ljava/io/File;)V
    .locals 11
    .param p0, "source"    # Ljava/io/File;
    .param p1, "target"    # Ljava/io/File;

    .prologue
    .line 95
    const/4 v0, 0x0

    .line 96
    .local v0, "in":Ljava/nio/channels/FileChannel;
    const/4 v5, 0x0

    .line 97
    .local v5, "out":Ljava/nio/channels/FileChannel;
    const/4 v7, 0x0

    .line 98
    .local v7, "inStream":Ljava/io/FileInputStream;
    const/4 v9, 0x0

    .line 100
    .local v9, "outStream":Ljava/io/FileOutputStream;
    :try_start_0
    new-instance v8, Ljava/io/FileInputStream;

    invoke-direct {v8, p0}, Ljava/io/FileInputStream;-><init>(Ljava/io/File;)V
    :try_end_0
    .catch Ljava/io/IOException; {:try_start_0 .. :try_end_0} :catch_1
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    .line 101
    .end local v7    # "inStream":Ljava/io/FileInputStream;
    .local v8, "inStream":Ljava/io/FileInputStream;
    :try_start_1
    new-instance v10, Ljava/io/FileOutputStream;

    invoke-direct {v10, p1}, Ljava/io/FileOutputStream;-><init>(Ljava/io/File;)V
    :try_end_1
    .catch Ljava/io/IOException; {:try_start_1 .. :try_end_1} :catch_4
    .catchall {:try_start_1 .. :try_end_1} :catchall_1

    .line 102
    .end local v9    # "outStream":Ljava/io/FileOutputStream;
    .local v10, "outStream":Ljava/io/FileOutputStream;
    :try_start_2
    invoke-virtual {v8}, Ljava/io/FileInputStream;->getChannel()Ljava/nio/channels/FileChannel;

    move-result-object v0

    .line 103
    invoke-virtual {v10}, Ljava/io/FileOutputStream;->getChannel()Ljava/nio/channels/FileChannel;

    move-result-object v5

    .line 104
    const-wide/16 v1, 0x0

    invoke-virtual {v0}, Ljava/nio/channels/FileChannel;->size()J

    move-result-wide v3

    invoke-virtual/range {v0 .. v5}, Ljava/nio/channels/FileChannel;->transferTo(JJLjava/nio/channels/WritableByteChannel;)J
    :try_end_2
    .catch Ljava/io/IOException; {:try_start_2 .. :try_end_2} :catch_5
    .catchall {:try_start_2 .. :try_end_2} :catchall_2

    .line 110
    :try_start_3
    invoke-virtual {v8}, Ljava/io/FileInputStream;->close()V

    .line 111
    invoke-virtual {v0}, Ljava/nio/channels/FileChannel;->close()V

    .line 112
    invoke-virtual {v10}, Ljava/io/FileOutputStream;->close()V

    .line 113
    invoke-virtual {v5}, Ljava/nio/channels/FileChannel;->close()V
    :try_end_3
    .catch Ljava/io/IOException; {:try_start_3 .. :try_end_3} :catch_0

    move-object v9, v10

    .end local v10    # "outStream":Ljava/io/FileOutputStream;
    .restart local v9    # "outStream":Ljava/io/FileOutputStream;
    move-object v7, v8

    .line 119
    .end local v8    # "inStream":Ljava/io/FileInputStream;
    .restart local v7    # "inStream":Ljava/io/FileInputStream;
    :goto_0
    return-void

    .line 114
    .end local v7    # "inStream":Ljava/io/FileInputStream;
    .end local v9    # "outStream":Ljava/io/FileOutputStream;
    .restart local v8    # "inStream":Ljava/io/FileInputStream;
    .restart local v10    # "outStream":Ljava/io/FileOutputStream;
    :catch_0
    move-exception v6

    .line 115
    .local v6, "e":Ljava/io/IOException;
    invoke-virtual {v6}, Ljava/io/IOException;->printStackTrace()V

    .line 116
    const-string v1, "error when close file"

    invoke-static {v1}, Lcom/netease/dacommon/VoiceManager;->onAudioFailed(Ljava/lang/String;)V

    move-object v9, v10

    .end local v10    # "outStream":Ljava/io/FileOutputStream;
    .restart local v9    # "outStream":Ljava/io/FileOutputStream;
    move-object v7, v8

    .line 118
    .end local v8    # "inStream":Ljava/io/FileInputStream;
    .restart local v7    # "inStream":Ljava/io/FileInputStream;
    goto :goto_0

    .line 105
    .end local v6    # "e":Ljava/io/IOException;
    :catch_1
    move-exception v6

    .line 106
    .restart local v6    # "e":Ljava/io/IOException;
    :goto_1
    :try_start_4
    invoke-virtual {v6}, Ljava/io/IOException;->printStackTrace()V

    .line 107
    const-string v1, "error when open file"

    invoke-static {v1}, Lcom/netease/dacommon/VoiceManager;->onAudioFailed(Ljava/lang/String;)V
    :try_end_4
    .catchall {:try_start_4 .. :try_end_4} :catchall_0

    .line 110
    :try_start_5
    invoke-virtual {v7}, Ljava/io/FileInputStream;->close()V

    .line 111
    invoke-virtual {v0}, Ljava/nio/channels/FileChannel;->close()V

    .line 112
    invoke-virtual {v9}, Ljava/io/FileOutputStream;->close()V

    .line 113
    invoke-virtual {v5}, Ljava/nio/channels/FileChannel;->close()V
    :try_end_5
    .catch Ljava/io/IOException; {:try_start_5 .. :try_end_5} :catch_2

    goto :goto_0

    .line 114
    :catch_2
    move-exception v6

    .line 115
    invoke-virtual {v6}, Ljava/io/IOException;->printStackTrace()V

    .line 116
    const-string v1, "error when close file"

    invoke-static {v1}, Lcom/netease/dacommon/VoiceManager;->onAudioFailed(Ljava/lang/String;)V

    goto :goto_0

    .line 109
    .end local v6    # "e":Ljava/io/IOException;
    :catchall_0
    move-exception v1

    .line 110
    :goto_2
    :try_start_6
    invoke-virtual {v7}, Ljava/io/FileInputStream;->close()V

    .line 111
    invoke-virtual {v0}, Ljava/nio/channels/FileChannel;->close()V

    .line 112
    invoke-virtual {v9}, Ljava/io/FileOutputStream;->close()V

    .line 113
    invoke-virtual {v5}, Ljava/nio/channels/FileChannel;->close()V
    :try_end_6
    .catch Ljava/io/IOException; {:try_start_6 .. :try_end_6} :catch_3

    .line 117
    :goto_3
    throw v1

    .line 114
    :catch_3
    move-exception v6

    .line 115
    .restart local v6    # "e":Ljava/io/IOException;
    invoke-virtual {v6}, Ljava/io/IOException;->printStackTrace()V

    .line 116
    const-string v2, "error when close file"

    invoke-static {v2}, Lcom/netease/dacommon/VoiceManager;->onAudioFailed(Ljava/lang/String;)V

    goto :goto_3

    .line 109
    .end local v6    # "e":Ljava/io/IOException;
    .end local v7    # "inStream":Ljava/io/FileInputStream;
    .restart local v8    # "inStream":Ljava/io/FileInputStream;
    :catchall_1
    move-exception v1

    move-object v7, v8

    .end local v8    # "inStream":Ljava/io/FileInputStream;
    .restart local v7    # "inStream":Ljava/io/FileInputStream;
    goto :goto_2

    .end local v7    # "inStream":Ljava/io/FileInputStream;
    .end local v9    # "outStream":Ljava/io/FileOutputStream;
    .restart local v8    # "inStream":Ljava/io/FileInputStream;
    .restart local v10    # "outStream":Ljava/io/FileOutputStream;
    :catchall_2
    move-exception v1

    move-object v9, v10

    .end local v10    # "outStream":Ljava/io/FileOutputStream;
    .restart local v9    # "outStream":Ljava/io/FileOutputStream;
    move-object v7, v8

    .end local v8    # "inStream":Ljava/io/FileInputStream;
    .restart local v7    # "inStream":Ljava/io/FileInputStream;
    goto :goto_2

    .line 105
    .end local v7    # "inStream":Ljava/io/FileInputStream;
    .restart local v8    # "inStream":Ljava/io/FileInputStream;
    :catch_4
    move-exception v6

    move-object v7, v8

    .end local v8    # "inStream":Ljava/io/FileInputStream;
    .restart local v7    # "inStream":Ljava/io/FileInputStream;
    goto :goto_1

    .end local v7    # "inStream":Ljava/io/FileInputStream;
    .end local v9    # "outStream":Ljava/io/FileOutputStream;
    .restart local v8    # "inStream":Ljava/io/FileInputStream;
    .restart local v10    # "outStream":Ljava/io/FileOutputStream;
    :catch_5
    move-exception v6

    move-object v9, v10

    .end local v10    # "outStream":Ljava/io/FileOutputStream;
    .restart local v9    # "outStream":Ljava/io/FileOutputStream;
    move-object v7, v8

    .end local v8    # "inStream":Ljava/io/FileInputStream;
    .restart local v7    # "inStream":Ljava/io/FileInputStream;
    goto :goto_1
.end method

.method public static initAudioRDecorder()V
    .locals 3

    .prologue
    .line 34
    :try_start_0
    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    invoke-static {}, Lorg/cocos2dx/lib/Cocos2dxHelper;->getCocos2dxWritablePath()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v2, "/audio/audiorecorder.amr"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    sput-object v1, Lcom/netease/dacommon/VoiceManager;->audio_fname:Ljava/lang/String;
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 38
    .local v0, "e":Ljava/lang/Exception;
    :goto_0
    new-instance v1, Landroid/media/MediaPlayer;

    invoke-direct {v1}, Landroid/media/MediaPlayer;-><init>()V

    sput-object v1, Lcom/netease/dacommon/VoiceManager;->audioPlayer:Landroid/media/MediaPlayer;

    .line 39
    return-void

    .line 35
    .end local v0    # "e":Ljava/lang/Exception;
    :catch_0
    move-exception v0

    .line 36
    .restart local v0    # "e":Ljava/lang/Exception;
    invoke-virtual {v0}, Ljava/lang/Exception;->printStackTrace()V

    goto :goto_0
.end method

.method public static native onAudioFailed(Ljava/lang/String;)V
.end method

.method public static native onAudioFinished(Ljava/lang/String;)V
.end method

.method public static native onPlayAudioFinished()V
.end method

.method public static playAudio(Ljava/lang/String;Ljava/lang/String;)V
    .locals 7
    .param p0, "fileName"    # Ljava/lang/String;
    .param p1, "fileUrl"    # Ljava/lang/String;

    .prologue
    .line 164
    :try_start_0
    sget-object v3, Lcom/netease/dacommon/VoiceManager;->audioPlayer:Landroid/media/MediaPlayer;

    invoke-virtual {v3}, Landroid/media/MediaPlayer;->reset()V

    .line 165
    new-instance v1, Ljava/io/File;

    invoke-direct {v1, p0}, Ljava/io/File;-><init>(Ljava/lang/String;)V

    .line 166
    .local v1, "file":Ljava/io/File;
    if-eqz v1, :cond_0

    invoke-virtual {v1}, Ljava/io/File;->isFile()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-virtual {v1}, Ljava/io/File;->canRead()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-virtual {v1}, Ljava/io/File;->length()J

    move-result-wide v3

    const-wide/16 v5, 0x0

    cmp-long v3, v3, v5

    if-lez v3, :cond_0

    .line 167
    new-instance v2, Ljava/io/FileInputStream;

    new-instance v3, Ljava/io/File;

    invoke-direct {v3, p0}, Ljava/io/File;-><init>(Ljava/lang/String;)V

    invoke-direct {v2, v3}, Ljava/io/FileInputStream;-><init>(Ljava/io/File;)V

    .line 168
    .local v2, "fis":Ljava/io/FileInputStream;
    sget-object v3, Lcom/netease/dacommon/VoiceManager;->audioPlayer:Landroid/media/MediaPlayer;

    invoke-virtual {v2}, Ljava/io/FileInputStream;->getFD()Ljava/io/FileDescriptor;

    move-result-object v4

    invoke-virtual {v3, v4}, Landroid/media/MediaPlayer;->setDataSource(Ljava/io/FileDescriptor;)V

    .line 172
    .end local v2    # "fis":Ljava/io/FileInputStream;
    :goto_0
    sget-object v3, Lcom/netease/dacommon/VoiceManager;->audioPlayer:Landroid/media/MediaPlayer;

    invoke-virtual {v3}, Landroid/media/MediaPlayer;->prepareAsync()V

    .line 173
    sget-object v3, Lcom/netease/dacommon/VoiceManager;->audioPlayer:Landroid/media/MediaPlayer;

    new-instance v4, Lcom/netease/dacommon/VoiceManager$2;

    invoke-direct {v4}, Lcom/netease/dacommon/VoiceManager$2;-><init>()V

    invoke-virtual {v3, v4}, Landroid/media/MediaPlayer;->setOnPreparedListener(Landroid/media/MediaPlayer$OnPreparedListener;)V

    .line 179
    sget-object v3, Lcom/netease/dacommon/VoiceManager;->audioPlayer:Landroid/media/MediaPlayer;

    new-instance v4, Lcom/netease/dacommon/VoiceManager$3;

    invoke-direct {v4}, Lcom/netease/dacommon/VoiceManager$3;-><init>()V

    invoke-virtual {v3, v4}, Landroid/media/MediaPlayer;->setOnCompletionListener(Landroid/media/MediaPlayer$OnCompletionListener;)V

    .line 194
    .end local v1    # "file":Ljava/io/File;
    :goto_1
    return-void

    .line 170
    .restart local v1    # "file":Ljava/io/File;
    :cond_0
    sget-object v3, Lcom/netease/dacommon/VoiceManager;->audioPlayer:Landroid/media/MediaPlayer;

    invoke-virtual {v3, p1}, Landroid/media/MediaPlayer;->setDataSource(Ljava/lang/String;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    .line 190
    .end local v1    # "file":Ljava/io/File;
    :catch_0
    move-exception v0

    .line 191
    .local v0, "e":Ljava/lang/Exception;
    invoke-virtual {v0}, Ljava/lang/Exception;->printStackTrace()V

    .line 192
    invoke-static {}, Lcom/netease/dacommon/VoiceManager;->onPlayAudioFinished()V

    goto :goto_1
.end method

.method public static native setVolumnProgress(I)V
.end method

.method public static startRecording(Ljava/lang/String;)V
    .locals 4
    .param p0, "file_name"    # Ljava/lang/String;

    .prologue
    .line 63
    sget-object v2, Lcom/netease/dacommon/VoiceManager;->current_audio_fname:Ljava/lang/String;

    if-eqz v2, :cond_0

    .line 92
    :goto_0
    return-void

    .line 66
    :cond_0
    :try_start_0
    sput-object p0, Lcom/netease/dacommon/VoiceManager;->current_audio_fname:Ljava/lang/String;

    .line 67
    new-instance v1, Ljava/io/File;

    sget-object v2, Lcom/netease/dacommon/VoiceManager;->audio_fname:Ljava/lang/String;

    invoke-direct {v1, v2}, Ljava/io/File;-><init>(Ljava/lang/String;)V

    .line 68
    .local v1, "file":Ljava/io/File;
    if-eqz v1, :cond_1

    .line 69
    invoke-virtual {v1}, Ljava/io/File;->delete()Z

    .line 70
    const/4 v1, 0x0

    .line 72
    :cond_1
    sget-object v2, Lcom/netease/dacommon/VoiceManager;->mAudioRecord:Landroid/media/MediaRecorder;

    if-eqz v2, :cond_2

    .line 73
    const-string v2, "record voice failed"

    invoke-static {v2}, Lcom/netease/dacommon/VoiceManager;->onAudioFailed(Ljava/lang/String;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    .line 89
    .end local v1    # "file":Ljava/io/File;
    :catch_0
    move-exception v0

    .line 90
    .local v0, "e":Ljava/lang/Exception;
    invoke-virtual {v0}, Ljava/lang/Exception;->printStackTrace()V

    goto :goto_0

    .line 76
    .end local v0    # "e":Ljava/lang/Exception;
    .restart local v1    # "file":Ljava/io/File;
    :cond_2
    :try_start_1
    new-instance v2, Landroid/media/MediaRecorder;

    invoke-direct {v2}, Landroid/media/MediaRecorder;-><init>()V

    sput-object v2, Lcom/netease/dacommon/VoiceManager;->mAudioRecord:Landroid/media/MediaRecorder;

    .line 77
    sget-object v2, Lcom/netease/dacommon/VoiceManager;->mAudioRecord:Landroid/media/MediaRecorder;

    const/4 v3, 0x1

    invoke-virtual {v2, v3}, Landroid/media/MediaRecorder;->setAudioSource(I)V

    .line 78
    sget-object v2, Lcom/netease/dacommon/VoiceManager;->mAudioRecord:Landroid/media/MediaRecorder;

    const/4 v3, 0x3

    invoke-virtual {v2, v3}, Landroid/media/MediaRecorder;->setOutputFormat(I)V

    .line 79
    sget-object v2, Lcom/netease/dacommon/VoiceManager;->mAudioRecord:Landroid/media/MediaRecorder;

    const/4 v3, 0x1

    invoke-virtual {v2, v3}, Landroid/media/MediaRecorder;->setAudioEncoder(I)V

    .line 81
    sget-object v2, Lcom/netease/dacommon/VoiceManager;->mAudioRecord:Landroid/media/MediaRecorder;

    const/16 v3, 0x1f40

    invoke-virtual {v2, v3}, Landroid/media/MediaRecorder;->setAudioSamplingRate(I)V

    .line 82
    sget-object v2, Lcom/netease/dacommon/VoiceManager;->mAudioRecord:Landroid/media/MediaRecorder;

    sget-object v3, Lcom/netease/dacommon/VoiceManager;->audio_fname:Ljava/lang/String;

    invoke-virtual {v2, v3}, Landroid/media/MediaRecorder;->setOutputFile(Ljava/lang/String;)V

    .line 83
    sget-object v2, Lcom/netease/dacommon/VoiceManager;->mAudioRecord:Landroid/media/MediaRecorder;

    const/4 v3, 0x1

    invoke-virtual {v2, v3}, Landroid/media/MediaRecorder;->setAudioChannels(I)V

    .line 84
    sget-object v2, Lcom/netease/dacommon/VoiceManager;->mAudioRecord:Landroid/media/MediaRecorder;

    invoke-virtual {v2}, Landroid/media/MediaRecorder;->prepare()V

    .line 85
    sget-object v2, Lcom/netease/dacommon/VoiceManager;->mAudioRecord:Landroid/media/MediaRecorder;

    invoke-virtual {v2}, Landroid/media/MediaRecorder;->start()V

    .line 87
    sget-object v2, Lcom/netease/dacommon/VoiceManager;->mAudioHandler:Landroid/os/Handler;

    sget-object v3, Lcom/netease/dacommon/VoiceManager;->r_audio_volumn:Ljava/lang/Runnable;

    invoke-virtual {v2, v3}, Landroid/os/Handler;->post(Ljava/lang/Runnable;)Z

    .line 88
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v2

    sput-wide v2, Lcom/netease/dacommon/VoiceManager;->audio_time:J
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_0

    goto :goto_0
.end method

.method public static stopAudio()V
    .locals 1

    .prologue
    .line 197
    sget-object v0, Lcom/netease/dacommon/VoiceManager;->audioPlayer:Landroid/media/MediaPlayer;

    if-eqz v0, :cond_0

    sget-object v0, Lcom/netease/dacommon/VoiceManager;->audioPlayer:Landroid/media/MediaPlayer;

    invoke-virtual {v0}, Landroid/media/MediaPlayer;->isPlaying()Z

    move-result v0

    if-eqz v0, :cond_0

    .line 198
    sget-object v0, Lcom/netease/dacommon/VoiceManager;->audioPlayer:Landroid/media/MediaPlayer;

    invoke-virtual {v0}, Landroid/media/MediaPlayer;->stop()V

    .line 199
    sget-object v0, Lcom/netease/dacommon/VoiceManager;->audioPlayer:Landroid/media/MediaPlayer;

    invoke-virtual {v0}, Landroid/media/MediaPlayer;->reset()V

    .line 201
    :cond_0
    return-void
.end method

.method public static stopRecording()V
    .locals 8

    .prologue
    const/4 v7, 0x0

    .line 124
    :try_start_0
    sget-object v3, Lcom/netease/dacommon/VoiceManager;->mAudioRecord:Landroid/media/MediaRecorder;

    if-nez v3, :cond_1

    .line 155
    :cond_0
    :goto_0
    return-void

    .line 126
    :cond_1
    sget-object v3, Lcom/netease/dacommon/VoiceManager;->mAudioHandler:Landroid/os/Handler;

    sget-object v4, Lcom/netease/dacommon/VoiceManager;->r_audio_volumn:Ljava/lang/Runnable;

    invoke-virtual {v3, v4}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 127
    const/4 v3, 0x0

    invoke-static {v3}, Lcom/netease/dacommon/VoiceManager;->setVolumnProgress(I)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 129
    :try_start_1
    sget-object v3, Lcom/netease/dacommon/VoiceManager;->mAudioRecord:Landroid/media/MediaRecorder;

    invoke-virtual {v3}, Landroid/media/MediaRecorder;->stop()V
    :try_end_1
    .catch Ljava/lang/RuntimeException; {:try_start_1 .. :try_end_1} :catch_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_0

    .line 133
    .local v1, "e":Ljava/lang/RuntimeException;
    :goto_1
    :try_start_2
    sget-object v3, Lcom/netease/dacommon/VoiceManager;->mAudioRecord:Landroid/media/MediaRecorder;

    invoke-virtual {v3}, Landroid/media/MediaRecorder;->release()V

    .line 134
    const/4 v3, 0x0

    sput-object v3, Lcom/netease/dacommon/VoiceManager;->mAudioRecord:Landroid/media/MediaRecorder;

    .line 135
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v3

    sget-wide v5, Lcom/netease/dacommon/VoiceManager;->audio_time:J

    sub-long/2addr v3, v5

    sput-wide v3, Lcom/netease/dacommon/VoiceManager;->audio_time:J

    .line 136
    sget-wide v3, Lcom/netease/dacommon/VoiceManager;->audio_time:J

    long-to-float v3, v3

    const/high16 v4, 0x447a0000    # 1000.0f

    div-float/2addr v3, v4

    float-to-double v3, v3

    const-wide/high16 v5, 0x3fe0000000000000L    # 0.5

    cmpg-double v3, v3, v5

    if-gtz v3, :cond_2

    .line 137
    const/4 v3, 0x0

    sput-object v3, Lcom/netease/dacommon/VoiceManager;->current_audio_fname:Ljava/lang/String;

    .line 138
    const-string v3, "voice time is too short"

    invoke-static {v3}, Lcom/netease/dacommon/VoiceManager;->onAudioFailed(Ljava/lang/String;)V
    :try_end_2
    .catch Ljava/lang/Exception; {:try_start_2 .. :try_end_2} :catch_0

    goto :goto_0

    .line 150
    :catch_0
    move-exception v1

    .line 151
    .local v1, "e":Ljava/lang/Exception;
    invoke-virtual {v1}, Ljava/lang/Exception;->printStackTrace()V

    .line 152
    sput-object v7, Lcom/netease/dacommon/VoiceManager;->current_audio_fname:Ljava/lang/String;

    .line 153
    const-string v3, "error when stop recording"

    invoke-static {v3}, Lcom/netease/dacommon/VoiceManager;->onAudioFailed(Ljava/lang/String;)V

    goto :goto_0

    .line 130
    .end local v1    # "e":Ljava/lang/Exception;
    :catch_1
    move-exception v1

    .line 131
    .local v1, "e":Ljava/lang/RuntimeException;
    :try_start_3
    invoke-virtual {v1}, Ljava/lang/RuntimeException;->printStackTrace()V

    goto :goto_1

    .line 141
    :cond_2
    sget-object v3, Lcom/netease/dacommon/VoiceManager;->current_audio_fname:Ljava/lang/String;

    if-eqz v3, :cond_0

    .line 144
    new-instance v2, Ljava/io/File;

    sget-object v3, Lcom/netease/dacommon/VoiceManager;->audio_fname:Ljava/lang/String;

    invoke-direct {v2, v3}, Ljava/io/File;-><init>(Ljava/lang/String;)V

    .line 145
    .local v2, "file":Ljava/io/File;
    new-instance v0, Ljava/io/File;

    .end local v1    # "e":Ljava/lang/RuntimeException;
    sget-object v3, Lcom/netease/dacommon/VoiceManager;->current_audio_fname:Ljava/lang/String;

    invoke-direct {v0, v3}, Ljava/io/File;-><init>(Ljava/lang/String;)V

    .line 146
    .local v0, "dirfile":Ljava/io/File;
    invoke-static {v2, v0}, Lcom/netease/dacommon/VoiceManager;->copyAudioFile(Ljava/io/File;Ljava/io/File;)V

    .line 148
    sget-object v3, Lcom/netease/dacommon/VoiceManager;->current_audio_fname:Ljava/lang/String;

    invoke-static {v3}, Lcom/netease/dacommon/VoiceManager;->onAudioFinished(Ljava/lang/String;)V

    .line 149
    const/4 v3, 0x0

    sput-object v3, Lcom/netease/dacommon/VoiceManager;->current_audio_fname:Ljava/lang/String;
    :try_end_3
    .catch Ljava/lang/Exception; {:try_start_3 .. :try_end_3} :catch_0

    goto :goto_0
.end method
