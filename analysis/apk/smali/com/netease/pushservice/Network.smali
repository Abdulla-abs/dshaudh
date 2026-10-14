.class public Lcom/netease/pushservice/Network;
.super Ljava/lang/Object;
.source "Network.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation build Landroid/annotation/SuppressLint;
    value = {
        "DefaultLocale"
    }
.end annotation


# static fields
.field private static final TAG:Ljava/lang/String;


# instance fields
.field private HEART_BEAT_TIME:I

.field private heartBeatTask:Ljava/util/TimerTask;

.field private inetAddr:Ljava/net/InetAddress;

.field private isEnable:Z

.field private mLock:Ljava/util/concurrent/locks/ReentrantLock;

.field private mTimer:Ljava/util/Timer;

.field private mbConnected:Z

.field private retryCount:I

.field private socket:Ljava/net/Socket;

.field private socketAddr:Ljava/net/SocketAddress;

.field private socketReader:Ljava/io/DataInputStream;

.field private socketWriter:Ljava/io/DataOutputStream;


# direct methods
.method static constructor <clinit>()V
    .locals 2

    .prologue
    .line 29
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "NGPush_"

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-class v1, Lcom/netease/pushservice/Network;

    invoke-virtual {v1}, Ljava/lang/Class;->getSimpleName()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    sput-object v0, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    return-void
.end method

.method public constructor <init>()V
    .locals 3

    .prologue
    const/4 v2, 0x0

    const/4 v1, 0x0

    .line 43
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 30
    iput-object v1, p0, Lcom/netease/pushservice/Network;->inetAddr:Ljava/net/InetAddress;

    .line 31
    iput-object v1, p0, Lcom/netease/pushservice/Network;->socketAddr:Ljava/net/SocketAddress;

    .line 32
    iput-object v1, p0, Lcom/netease/pushservice/Network;->socket:Ljava/net/Socket;

    .line 33
    iput-object v1, p0, Lcom/netease/pushservice/Network;->socketWriter:Ljava/io/DataOutputStream;

    .line 34
    iput-object v1, p0, Lcom/netease/pushservice/Network;->socketReader:Ljava/io/DataInputStream;

    .line 35
    iput-boolean v2, p0, Lcom/netease/pushservice/Network;->mbConnected:Z

    .line 36
    new-instance v0, Ljava/util/concurrent/locks/ReentrantLock;

    invoke-direct {v0}, Ljava/util/concurrent/locks/ReentrantLock;-><init>()V

    iput-object v0, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    .line 37
    iput-boolean v2, p0, Lcom/netease/pushservice/Network;->isEnable:Z

    .line 38
    iput-object v1, p0, Lcom/netease/pushservice/Network;->mTimer:Ljava/util/Timer;

    .line 39
    iput-object v1, p0, Lcom/netease/pushservice/Network;->heartBeatTask:Ljava/util/TimerTask;

    .line 40
    const v0, 0x3a980

    iput v0, p0, Lcom/netease/pushservice/Network;->HEART_BEAT_TIME:I

    .line 41
    iput v2, p0, Lcom/netease/pushservice/Network;->retryCount:I

    .line 44
    new-instance v0, Ljava/util/Timer;

    invoke-direct {v0}, Ljava/util/Timer;-><init>()V

    iput-object v0, p0, Lcom/netease/pushservice/Network;->mTimer:Ljava/util/Timer;

    .line 45
    sget-object v0, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    const-string v1, "Network constructed"

    invoke-static {v0, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 46
    return-void
.end method

.method static synthetic access$0()Ljava/lang/String;
    .locals 1

    .prologue
    .line 29
    sget-object v0, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    return-object v0
.end method

.method static synthetic access$1(Lcom/netease/pushservice/Network;I)V
    .locals 0

    .prologue
    .line 166
    invoke-direct {p0, p1}, Lcom/netease/pushservice/Network;->connectRetry(I)V

    return-void
.end method

.method private connectRetry(I)V
    .locals 4
    .param p1, "second"    # I

    .prologue
    .line 168
    iget-object v0, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    invoke-virtual {v0}, Ljava/util/concurrent/locks/ReentrantLock;->lock()V

    .line 169
    sget-object v0, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    const-string v1, "connectRetry"

    invoke-static {v0, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 170
    iget-boolean v0, p0, Lcom/netease/pushservice/Network;->mbConnected:Z

    if-eqz v0, :cond_0

    .line 171
    sget-object v0, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    const-string v1, "already connected"

    invoke-static {v0, v1}, Landroid/util/Log;->w(Ljava/lang/String;Ljava/lang/String;)I

    .line 172
    iget-object v0, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    invoke-virtual {v0}, Ljava/util/concurrent/locks/ReentrantLock;->unlock()V

    .line 188
    :goto_0
    return-void

    .line 175
    :cond_0
    iget-boolean v0, p0, Lcom/netease/pushservice/Network;->isEnable:Z

    if-nez v0, :cond_1

    .line 176
    sget-object v0, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    const-string v1, "connect not enable"

    invoke-static {v0, v1}, Landroid/util/Log;->w(Ljava/lang/String;Ljava/lang/String;)I

    .line 177
    iget-object v0, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    invoke-virtual {v0}, Ljava/util/concurrent/locks/ReentrantLock;->unlock()V

    goto :goto_0

    .line 180
    :cond_1
    sget-object v0, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "retry connect after:"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 181
    iget-object v0, p0, Lcom/netease/pushservice/Network;->mTimer:Ljava/util/Timer;

    new-instance v1, Lcom/netease/pushservice/Network$2;

    invoke-direct {v1, p0}, Lcom/netease/pushservice/Network$2;-><init>(Lcom/netease/pushservice/Network;)V

    .line 186
    mul-int/lit16 v2, p1, 0x3e8

    int-to-long v2, v2

    .line 181
    invoke-virtual {v0, v1, v2, v3}, Ljava/util/Timer;->schedule(Ljava/util/TimerTask;J)V

    .line 187
    iget-object v0, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    invoke-virtual {v0}, Ljava/util/concurrent/locks/ReentrantLock;->unlock()V

    goto :goto_0
.end method

.method private endHeartBeat()V
    .locals 2

    .prologue
    .line 206
    sget-object v0, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    const-string v1, "endHeartBeat"

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 207
    iget-object v0, p0, Lcom/netease/pushservice/Network;->heartBeatTask:Ljava/util/TimerTask;

    if-eqz v0, :cond_0

    .line 208
    iget-object v0, p0, Lcom/netease/pushservice/Network;->heartBeatTask:Ljava/util/TimerTask;

    invoke-virtual {v0}, Ljava/util/TimerTask;->cancel()Z

    .line 210
    :cond_0
    return-void
.end method

.method private getRetrySecond()I
    .locals 3

    .prologue
    const/4 v2, 0x7

    .line 54
    iget v1, p0, Lcom/netease/pushservice/Network;->retryCount:I

    if-le v1, v2, :cond_0

    .line 55
    iput v2, p0, Lcom/netease/pushservice/Network;->retryCount:I

    .line 57
    :cond_0
    iget v1, p0, Lcom/netease/pushservice/Network;->retryCount:I

    mul-int/lit8 v1, v1, 0x24

    iget v2, p0, Lcom/netease/pushservice/Network;->retryCount:I

    mul-int v0, v1, v2

    .line 58
    .local v0, "after":I
    if-gtz v0, :cond_1

    .line 59
    const/4 v0, 0x2

    .line 61
    :cond_1
    iget v1, p0, Lcom/netease/pushservice/Network;->retryCount:I

    add-int/lit8 v1, v1, 0x1

    iput v1, p0, Lcom/netease/pushservice/Network;->retryCount:I

    .line 62
    return v0
.end method

.method private onReceive([B)V
    .locals 6
    .param p1, "data"    # [B

    .prologue
    .line 309
    sget-object v1, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    const-string v2, "OnReceive len=%d, data=%s"

    const/4 v3, 0x2

    new-array v3, v3, [Ljava/lang/Object;

    const/4 v4, 0x0

    array-length v5, p1

    invoke-static {v5}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v5

    aput-object v5, v3, v4

    const/4 v4, 0x1

    new-instance v5, Ljava/lang/String;

    invoke-direct {v5, p1}, Ljava/lang/String;-><init>([B)V

    aput-object v5, v3, v4

    invoke-static {v2, v3}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 310
    invoke-static {p1}, Lcom/netease/push/proto/ProtoClientWrapper;->UnmarshalPacket([B)Lcom/netease/push/proto/ProtoClientWrapper$Packet;

    move-result-object v0

    .line 311
    .local v0, "packet":Lcom/netease/push/proto/ProtoClientWrapper$Packet;
    if-eqz v0, :cond_0

    .line 312
    invoke-static {}, Lcom/netease/pushservice/PushServiceHelper;->getInstance()Lcom/netease/pushservice/PushServiceHelper;

    move-result-object v1

    invoke-virtual {v1, v0}, Lcom/netease/pushservice/PushServiceHelper;->onReceive(Lcom/netease/push/proto/ProtoClientWrapper$Packet;)V

    .line 314
    :cond_0
    return-void
.end method

.method private startHeartBeat()V
    .locals 6

    .prologue
    .line 191
    sget-object v0, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    const-string v1, "startHeartBeat"

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 192
    invoke-direct {p0}, Lcom/netease/pushservice/Network;->endHeartBeat()V

    .line 193
    new-instance v0, Lcom/netease/pushservice/Network$3;

    invoke-direct {v0, p0}, Lcom/netease/pushservice/Network$3;-><init>(Lcom/netease/pushservice/Network;)V

    iput-object v0, p0, Lcom/netease/pushservice/Network;->heartBeatTask:Ljava/util/TimerTask;

    .line 202
    iget-object v0, p0, Lcom/netease/pushservice/Network;->mTimer:Ljava/util/Timer;

    iget-object v1, p0, Lcom/netease/pushservice/Network;->heartBeatTask:Ljava/util/TimerTask;

    iget v2, p0, Lcom/netease/pushservice/Network;->HEART_BEAT_TIME:I

    int-to-long v2, v2

    iget v4, p0, Lcom/netease/pushservice/Network;->HEART_BEAT_TIME:I

    int-to-long v4, v4

    invoke-virtual/range {v0 .. v5}, Ljava/util/Timer;->schedule(Ljava/util/TimerTask;JJ)V

    .line 203
    return-void
.end method


# virtual methods
.method public connect(Ljava/lang/String;I)V
    .locals 7
    .param p1, "host"    # Ljava/lang/String;
    .param p2, "port"    # I

    .prologue
    const/4 v6, 0x0

    .line 86
    iget-object v3, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    invoke-virtual {v3}, Ljava/util/concurrent/locks/ReentrantLock;->lock()V

    .line 87
    sget-object v3, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    const-string v4, "connect"

    invoke-static {v3, v4}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 88
    sget-object v3, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "host:"

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v3, v4}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 89
    sget-object v3, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "port:"

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, p2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v3, v4}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 90
    iget-boolean v3, p0, Lcom/netease/pushservice/Network;->mbConnected:Z

    if-eqz v3, :cond_0

    .line 91
    sget-object v3, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    const-string v4, "already connected"

    invoke-static {v3, v4}, Landroid/util/Log;->w(Ljava/lang/String;Ljava/lang/String;)I

    .line 92
    iget-object v3, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    invoke-virtual {v3}, Ljava/util/concurrent/locks/ReentrantLock;->unlock()V

    .line 133
    :goto_0
    return-void

    .line 95
    :cond_0
    iget-boolean v3, p0, Lcom/netease/pushservice/Network;->isEnable:Z

    if-nez v3, :cond_1

    .line 96
    sget-object v3, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    const-string v4, "Disabled Network"

    invoke-static {v3, v4}, Landroid/util/Log;->w(Ljava/lang/String;Ljava/lang/String;)I

    .line 97
    iget-object v3, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    invoke-virtual {v3}, Ljava/util/concurrent/locks/ReentrantLock;->unlock()V

    goto :goto_0

    .line 101
    :cond_1
    :try_start_0
    invoke-static {p1}, Ljava/net/InetAddress;->getByName(Ljava/lang/String;)Ljava/net/InetAddress;

    move-result-object v3

    iput-object v3, p0, Lcom/netease/pushservice/Network;->inetAddr:Ljava/net/InetAddress;

    .line 102
    new-instance v3, Ljava/net/InetSocketAddress;

    iget-object v4, p0, Lcom/netease/pushservice/Network;->inetAddr:Ljava/net/InetAddress;

    invoke-direct {v3, v4, p2}, Ljava/net/InetSocketAddress;-><init>(Ljava/net/InetAddress;I)V

    iput-object v3, p0, Lcom/netease/pushservice/Network;->socketAddr:Ljava/net/SocketAddress;

    .line 103
    new-instance v3, Ljava/net/Socket;

    invoke-direct {v3}, Ljava/net/Socket;-><init>()V

    iput-object v3, p0, Lcom/netease/pushservice/Network;->socket:Ljava/net/Socket;

    .line 104
    iget-object v3, p0, Lcom/netease/pushservice/Network;->socket:Ljava/net/Socket;

    const/4 v4, 0x1

    invoke-virtual {v3, v4}, Ljava/net/Socket;->setKeepAlive(Z)V

    .line 105
    iget-object v3, p0, Lcom/netease/pushservice/Network;->socket:Ljava/net/Socket;

    const/4 v4, 0x0

    invoke-virtual {v3, v4}, Ljava/net/Socket;->setSoTimeout(I)V

    .line 106
    iget-object v3, p0, Lcom/netease/pushservice/Network;->socket:Ljava/net/Socket;

    iget-object v4, p0, Lcom/netease/pushservice/Network;->socketAddr:Ljava/net/SocketAddress;

    const/16 v5, 0x1388

    invoke-virtual {v3, v4, v5}, Ljava/net/Socket;->connect(Ljava/net/SocketAddress;I)V

    .line 107
    sget-object v3, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    const-string v4, "connect success"

    invoke-static {v3, v4}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 108
    const/4 v3, 0x1

    iput-boolean v3, p0, Lcom/netease/pushservice/Network;->mbConnected:Z

    .line 109
    new-instance v3, Ljava/io/DataInputStream;

    iget-object v4, p0, Lcom/netease/pushservice/Network;->socket:Ljava/net/Socket;

    invoke-virtual {v4}, Ljava/net/Socket;->getInputStream()Ljava/io/InputStream;

    move-result-object v4

    invoke-direct {v3, v4}, Ljava/io/DataInputStream;-><init>(Ljava/io/InputStream;)V

    iput-object v3, p0, Lcom/netease/pushservice/Network;->socketReader:Ljava/io/DataInputStream;

    .line 110
    new-instance v3, Ljava/io/DataOutputStream;

    iget-object v4, p0, Lcom/netease/pushservice/Network;->socket:Ljava/net/Socket;

    invoke-virtual {v4}, Ljava/net/Socket;->getOutputStream()Ljava/io/OutputStream;

    move-result-object v4

    invoke-direct {v3, v4}, Ljava/io/DataOutputStream;-><init>(Ljava/io/OutputStream;)V

    iput-object v3, p0, Lcom/netease/pushservice/Network;->socketWriter:Ljava/io/DataOutputStream;

    .line 111
    new-instance v2, Ljava/lang/Thread;

    invoke-direct {v2, p0}, Ljava/lang/Thread;-><init>(Ljava/lang/Runnable;)V

    .line 112
    .local v2, "thread":Ljava/lang/Thread;
    invoke-virtual {v2}, Ljava/lang/Thread;->start()V

    .line 113
    invoke-direct {p0}, Lcom/netease/pushservice/Network;->startHeartBeat()V

    .line 114
    invoke-static {}, Lcom/netease/pushservice/PushServiceHelper;->getInstance()Lcom/netease/pushservice/PushServiceHelper;

    move-result-object v3

    invoke-virtual {v3}, Lcom/netease/pushservice/PushServiceHelper;->refreshToken()V

    .line 115
    const/4 v3, 0x0

    iput v3, p0, Lcom/netease/pushservice/Network;->retryCount:I
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 121
    .end local v2    # "thread":Ljava/lang/Thread;
    :goto_1
    iget-boolean v3, p0, Lcom/netease/pushservice/Network;->mbConnected:Z

    if-nez v3, :cond_2

    .line 122
    invoke-virtual {p0}, Lcom/netease/pushservice/Network;->disconnect()V

    .line 123
    sget-object v3, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    const-string v4, "disconnectRetry in connect()"

    invoke-static {v3, v4}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 124
    invoke-direct {p0}, Lcom/netease/pushservice/Network;->getRetrySecond()I

    move-result v1

    .line 125
    .local v1, "retryAfter":I
    invoke-static {}, Lcom/netease/pushservice/PushServiceHelper;->getInstance()Lcom/netease/pushservice/PushServiceHelper;

    move-result-object v3

    invoke-virtual {v3}, Lcom/netease/pushservice/PushServiceHelper;->getTaskSubmitter()Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;

    move-result-object v3

    new-instance v4, Lcom/netease/pushservice/Network$1;

    invoke-direct {v4, p0, v1}, Lcom/netease/pushservice/Network$1;-><init>(Lcom/netease/pushservice/Network;I)V

    invoke-virtual {v3, v4}, Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;->submit(Ljava/lang/Runnable;)Ljava/util/concurrent/Future;

    .line 132
    .end local v1    # "retryAfter":I
    :cond_2
    iget-object v3, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    invoke-virtual {v3}, Ljava/util/concurrent/locks/ReentrantLock;->unlock()V

    goto/16 :goto_0

    .line 116
    :catch_0
    move-exception v0

    .line 117
    .local v0, "e":Ljava/lang/Exception;
    sget-object v3, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "connect exception:"

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0}, Ljava/lang/Exception;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v3, v4}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 118
    iput-boolean v6, p0, Lcom/netease/pushservice/Network;->mbConnected:Z

    .line 119
    invoke-virtual {v0}, Ljava/lang/Exception;->printStackTrace()V

    goto :goto_1
.end method

.method public connectAuto(Landroid/content/Context;)V
    .locals 10
    .param p1, "ctx"    # Landroid/content/Context;

    .prologue
    const/4 v9, 0x0

    .line 66
    sget-object v6, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    const-string v7, "connectAuto"

    invoke-static {v6, v7}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 67
    invoke-static {}, Lcom/netease/pushservice/PushServiceHelper;->getInstance()Lcom/netease/pushservice/PushServiceHelper;

    move-result-object v6

    invoke-virtual {v6}, Lcom/netease/pushservice/PushServiceHelper;->getNotificationServiceInfo()Lcom/netease/pushservice/PushServiceInfo;

    move-result-object v5

    .line 69
    .local v5, "pushServiceInfo":Lcom/netease/pushservice/PushServiceInfo;
    invoke-static {p1}, Lcom/netease/push/utils/PushSetting;->getPushAddr(Landroid/content/Context;)Ljava/lang/String;

    move-result-object v0

    .line 70
    .local v0, "data":Ljava/lang/String;
    invoke-static {v0}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v6

    if-eqz v6, :cond_0

    .line 71
    invoke-virtual {v5}, Lcom/netease/pushservice/PushServiceInfo;->getPushSrv()Ljava/lang/String;

    move-result-object v0

    .line 73
    :cond_0
    sget-object v6, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    new-instance v7, Ljava/lang/StringBuilder;

    const-string v8, "unipush addr:"

    invoke-direct {v7, v8}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v7, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v7

    invoke-virtual {v7}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v7

    invoke-static {v6, v7}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 74
    const-string v6, ":"

    invoke-virtual {v0, v6}, Ljava/lang/String;->indexOf(Ljava/lang/String;)I

    move-result v4

    .line 75
    .local v4, "position":I
    const/4 v6, -0x1

    if-eq v4, v6, :cond_1

    .line 76
    invoke-virtual {v0, v9, v4}, Ljava/lang/String;->substring(II)Ljava/lang/String;

    move-result-object v1

    .line 77
    .local v1, "host":Ljava/lang/String;
    add-int/lit8 v6, v4, 0x1

    invoke-virtual {v0, v6}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object v3

    .line 78
    .local v3, "port":Ljava/lang/String;
    invoke-static {v3}, Ljava/lang/Integer;->parseInt(Ljava/lang/String;)I

    move-result v2

    .line 79
    .local v2, "iPort":I
    sget-object v6, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    const-string v7, "connect to unipush %s:%s"

    const/4 v8, 0x2

    new-array v8, v8, [Ljava/lang/Object;

    aput-object v1, v8, v9

    const/4 v9, 0x1

    aput-object v3, v8, v9

    invoke-static {v7, v8}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v7

    invoke-static {v6, v7}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 80
    invoke-virtual {p0, v1, v2}, Lcom/netease/pushservice/Network;->connect(Ljava/lang/String;I)V

    .line 82
    .end local v1    # "host":Ljava/lang/String;
    .end local v2    # "iPort":I
    .end local v3    # "port":Ljava/lang/String;
    :cond_1
    return-void
.end method

.method public disconnect()V
    .locals 4

    .prologue
    const/4 v3, 0x0

    .line 137
    iget-object v1, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    invoke-virtual {v1}, Ljava/util/concurrent/locks/ReentrantLock;->lock()V

    .line 138
    sget-object v1, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    const-string v2, "disconnect"

    invoke-static {v1, v2}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 140
    :try_start_0
    iget-object v1, p0, Lcom/netease/pushservice/Network;->socketReader:Ljava/io/DataInputStream;

    if-eqz v1, :cond_0

    .line 141
    iget-object v1, p0, Lcom/netease/pushservice/Network;->socketReader:Ljava/io/DataInputStream;

    invoke-virtual {v1}, Ljava/io/DataInputStream;->close()V

    .line 142
    :cond_0
    iget-object v1, p0, Lcom/netease/pushservice/Network;->socketWriter:Ljava/io/DataOutputStream;

    if-eqz v1, :cond_1

    .line 143
    iget-object v1, p0, Lcom/netease/pushservice/Network;->socketWriter:Ljava/io/DataOutputStream;

    invoke-virtual {v1}, Ljava/io/DataOutputStream;->close()V

    .line 144
    :cond_1
    iget-object v1, p0, Lcom/netease/pushservice/Network;->socket:Ljava/net/Socket;

    if-eqz v1, :cond_2

    .line 145
    iget-object v1, p0, Lcom/netease/pushservice/Network;->socket:Ljava/net/Socket;

    invoke-virtual {v1}, Ljava/net/Socket;->close()V
    :try_end_0
    .catch Ljava/io/IOException; {:try_start_0 .. :try_end_0} :catch_0

    .line 149
    :cond_2
    :goto_0
    iput-object v3, p0, Lcom/netease/pushservice/Network;->socket:Ljava/net/Socket;

    .line 150
    iput-object v3, p0, Lcom/netease/pushservice/Network;->socketWriter:Ljava/io/DataOutputStream;

    .line 151
    iput-object v3, p0, Lcom/netease/pushservice/Network;->socketReader:Ljava/io/DataInputStream;

    .line 152
    const/4 v1, 0x0

    iput-boolean v1, p0, Lcom/netease/pushservice/Network;->mbConnected:Z

    .line 153
    invoke-direct {p0}, Lcom/netease/pushservice/Network;->endHeartBeat()V

    .line 154
    iget-object v1, p0, Lcom/netease/pushservice/Network;->mTimer:Ljava/util/Timer;

    invoke-virtual {v1}, Ljava/util/Timer;->purge()I

    .line 155
    iget-object v1, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    invoke-virtual {v1}, Ljava/util/concurrent/locks/ReentrantLock;->unlock()V

    .line 156
    return-void

    .line 146
    :catch_0
    move-exception v0

    .line 147
    .local v0, "e":Ljava/io/IOException;
    invoke-virtual {v0}, Ljava/io/IOException;->printStackTrace()V

    goto :goto_0
.end method

.method public disconnectRetry(I)V
    .locals 3
    .param p1, "second"    # I

    .prologue
    .line 214
    iget-object v0, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    invoke-virtual {v0}, Ljava/util/concurrent/locks/ReentrantLock;->lock()V

    .line 216
    sget-object v0, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "disconnectRetry after:"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 217
    iget-boolean v0, p0, Lcom/netease/pushservice/Network;->mbConnected:Z

    if-eqz v0, :cond_0

    .line 218
    sget-object v0, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    const-string v1, "already connected"

    invoke-static {v0, v1}, Landroid/util/Log;->w(Ljava/lang/String;Ljava/lang/String;)I

    .line 219
    iget-object v0, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    invoke-virtual {v0}, Ljava/util/concurrent/locks/ReentrantLock;->unlock()V

    .line 225
    :goto_0
    return-void

    .line 222
    :cond_0
    invoke-virtual {p0}, Lcom/netease/pushservice/Network;->disconnect()V

    .line 223
    invoke-direct {p0, p1}, Lcom/netease/pushservice/Network;->connectRetry(I)V

    .line 224
    iget-object v0, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    invoke-virtual {v0}, Ljava/util/concurrent/locks/ReentrantLock;->unlock()V

    goto :goto_0
.end method

.method public run()V
    .locals 7
    .annotation build Landroid/annotation/SuppressLint;
        value = {
            "NewApi"
        }
    .end annotation

    .prologue
    .line 258
    sget-object v4, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    const-string v5, "run"

    invoke-static {v4, v5}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 259
    sget-object v4, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    new-instance v5, Ljava/lang/StringBuilder;

    const-string v6, "isEnable:"

    invoke-direct {v5, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-boolean v6, p0, Lcom/netease/pushservice/Network;->isEnable:Z

    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;->append(Z)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-static {v4, v5}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 260
    sget-object v4, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    new-instance v5, Ljava/lang/StringBuilder;

    const-string v6, "mbConnected:"

    invoke-direct {v5, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-boolean v6, p0, Lcom/netease/pushservice/Network;->mbConnected:Z

    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;->append(Z)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-static {v4, v5}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 262
    iget-object v4, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    invoke-virtual {v4}, Ljava/util/concurrent/locks/ReentrantLock;->lock()V

    .line 264
    iget-boolean v4, p0, Lcom/netease/pushservice/Network;->isEnable:Z

    if-eqz v4, :cond_0

    iget-boolean v4, p0, Lcom/netease/pushservice/Network;->mbConnected:Z

    if-nez v4, :cond_1

    .line 265
    :cond_0
    iget-object v4, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    invoke-virtual {v4}, Ljava/util/concurrent/locks/ReentrantLock;->unlock()V

    .line 295
    :goto_0
    return-void

    .line 268
    :cond_1
    iget-object v4, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    invoke-virtual {v4}, Ljava/util/concurrent/locks/ReentrantLock;->unlock()V

    .line 270
    const/4 v1, 0x0

    .line 271
    .local v1, "length":I
    const/16 v4, 0x1000

    new-array v3, v4, [B

    .line 274
    .local v3, "tmpBuff":[B
    :goto_1
    :try_start_0
    iget-object v4, p0, Lcom/netease/pushservice/Network;->socketReader:Ljava/io/DataInputStream;

    invoke-virtual {v4}, Ljava/io/DataInputStream;->readShort()S

    move-result v4

    const v5, 0xffff

    and-int v1, v4, v5

    .line 275
    sget-object v4, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    new-instance v5, Ljava/lang/StringBuilder;

    const-string v6, "receive length:"

    invoke-direct {v5, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v5, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-static {v4, v5}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 276
    const/4 v4, 0x0

    invoke-static {v3, v4, v1}, Lcom/netease/push/proto/ProtoClientWrapper;->Uint16ToBytes([BII)V

    .line 277
    iget-object v4, p0, Lcom/netease/pushservice/Network;->socketReader:Ljava/io/DataInputStream;

    const/4 v5, 0x2

    add-int/lit8 v6, v1, -0x2

    invoke-virtual {v4, v3, v5, v6}, Ljava/io/DataInputStream;->readFully([BII)V

    .line 278
    const/4 v4, 0x0

    invoke-static {v3, v4, v1}, Ljava/util/Arrays;->copyOfRange([BII)[B

    move-result-object v4

    invoke-direct {p0, v4}, Lcom/netease/pushservice/Network;->onReceive([B)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_1

    .line 279
    :catch_0
    move-exception v0

    .line 280
    .local v0, "e":Ljava/lang/Exception;
    sget-object v4, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    new-instance v5, Ljava/lang/StringBuilder;

    const-string v6, "receive exception:"

    invoke-direct {v5, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0}, Ljava/lang/Exception;->toString()Ljava/lang/String;

    move-result-object v6

    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-static {v4, v5}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 281
    invoke-virtual {v0}, Ljava/lang/Exception;->printStackTrace()V

    .line 286
    invoke-virtual {p0}, Lcom/netease/pushservice/Network;->disconnect()V

    .line 287
    sget-object v4, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    const-string v5, "connectRetry in receive thread"

    invoke-static {v4, v5}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 288
    invoke-direct {p0}, Lcom/netease/pushservice/Network;->getRetrySecond()I

    move-result v2

    .line 289
    .local v2, "retryAfter":I
    invoke-static {}, Lcom/netease/pushservice/PushServiceHelper;->getInstance()Lcom/netease/pushservice/PushServiceHelper;

    move-result-object v4

    invoke-virtual {v4}, Lcom/netease/pushservice/PushServiceHelper;->getTaskSubmitter()Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;

    move-result-object v4

    new-instance v5, Lcom/netease/pushservice/Network$4;

    invoke-direct {v5, p0, v2}, Lcom/netease/pushservice/Network$4;-><init>(Lcom/netease/pushservice/Network;I)V

    invoke-virtual {v4, v5}, Lcom/netease/pushservice/PushServiceHelper$TaskSubmitter;->submit(Ljava/lang/Runnable;)Ljava/util/concurrent/Future;

    goto :goto_0
.end method

.method public sendData(BLcom/netease/push/proto/ProtoClientWrapper$DataMarshal;)V
    .locals 4
    .param p1, "cmdType"    # B
    .param p2, "object"    # Lcom/netease/push/proto/ProtoClientWrapper$DataMarshal;

    .prologue
    .line 303
    sget-object v1, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "sendData, cmdType="

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 304
    invoke-static {p1, p2}, Lcom/netease/push/proto/ProtoClientWrapper;->MarshalObject(BLcom/netease/push/proto/ProtoClientWrapper$DataMarshal;)[B

    move-result-object v0

    .line 305
    .local v0, "data":[B
    invoke-virtual {p0, v0}, Lcom/netease/pushservice/Network;->sendData([B)V

    .line 306
    return-void
.end method

.method public sendData(Lcom/netease/push/proto/ProtoClientWrapper$Packet;)V
    .locals 1
    .param p1, "packet"    # Lcom/netease/push/proto/ProtoClientWrapper$Packet;

    .prologue
    .line 298
    invoke-virtual {p1}, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->Marshal()[B

    move-result-object v0

    .line 299
    .local v0, "data":[B
    invoke-virtual {p0, v0}, Lcom/netease/pushservice/Network;->sendData([B)V

    .line 300
    return-void
.end method

.method public sendData([B)V
    .locals 4
    .param p1, "data"    # [B

    .prologue
    .line 229
    iget-object v1, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    invoke-virtual {v1}, Ljava/util/concurrent/locks/ReentrantLock;->lock()V

    .line 231
    iget-boolean v1, p0, Lcom/netease/pushservice/Network;->mbConnected:Z

    if-nez v1, :cond_0

    .line 232
    sget-object v1, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    const-string v2, "not connected"

    invoke-static {v1, v2}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 233
    iget-object v1, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    invoke-virtual {v1}, Ljava/util/concurrent/locks/ReentrantLock;->unlock()V

    .line 254
    :goto_0
    return-void

    .line 236
    :cond_0
    iget-object v1, p0, Lcom/netease/pushservice/Network;->socket:Ljava/net/Socket;

    invoke-virtual {v1}, Ljava/net/Socket;->isConnected()Z

    move-result v1

    if-nez v1, :cond_1

    .line 237
    sget-object v1, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    const-string v2, "socket not connected"

    invoke-static {v1, v2}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 238
    iget-object v1, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    invoke-virtual {v1}, Ljava/util/concurrent/locks/ReentrantLock;->unlock()V

    goto :goto_0

    .line 242
    :cond_1
    :try_start_0
    iget-object v1, p0, Lcom/netease/pushservice/Network;->socketWriter:Ljava/io/DataOutputStream;

    invoke-virtual {v1, p1}, Ljava/io/DataOutputStream;->write([B)V

    .line 243
    iget-object v1, p0, Lcom/netease/pushservice/Network;->socket:Ljava/net/Socket;

    const/16 v2, 0xff

    invoke-virtual {v1, v2}, Ljava/net/Socket;->sendUrgentData(I)V
    :try_end_0
    .catch Ljava/net/SocketException; {:try_start_0 .. :try_end_0} :catch_0
    .catch Ljava/io/IOException; {:try_start_0 .. :try_end_0} :catch_1

    .line 253
    :goto_1
    iget-object v1, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    invoke-virtual {v1}, Ljava/util/concurrent/locks/ReentrantLock;->unlock()V

    goto :goto_0

    .line 244
    :catch_0
    move-exception v0

    .line 245
    .local v0, "e":Ljava/net/SocketException;
    sget-object v1, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "SocketException:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0}, Ljava/net/SocketException;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 246
    invoke-virtual {p0}, Lcom/netease/pushservice/Network;->disconnect()V

    .line 247
    invoke-virtual {v0}, Ljava/net/SocketException;->printStackTrace()V

    goto :goto_1

    .line 248
    .end local v0    # "e":Ljava/net/SocketException;
    :catch_1
    move-exception v0

    .line 249
    .local v0, "e":Ljava/io/IOException;
    sget-object v1, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "IOException:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0}, Ljava/io/IOException;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 250
    invoke-virtual {p0}, Lcom/netease/pushservice/Network;->disconnect()V

    .line 251
    invoke-virtual {v0}, Ljava/io/IOException;->printStackTrace()V

    goto :goto_1
.end method

.method protected setEnable(Z)V
    .locals 3
    .param p1, "flag"    # Z

    .prologue
    .line 317
    sget-object v0, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "setEnable:"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(Z)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 319
    iget-object v0, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    invoke-virtual {v0}, Ljava/util/concurrent/locks/ReentrantLock;->lock()V

    .line 321
    iput-boolean p1, p0, Lcom/netease/pushservice/Network;->isEnable:Z

    .line 322
    iget-boolean v0, p0, Lcom/netease/pushservice/Network;->isEnable:Z

    if-nez v0, :cond_0

    .line 323
    invoke-virtual {p0}, Lcom/netease/pushservice/Network;->disconnect()V

    .line 325
    :cond_0
    iget-object v0, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    invoke-virtual {v0}, Ljava/util/concurrent/locks/ReentrantLock;->unlock()V

    .line 326
    return-void
.end method

.method public setHeartBeatTime(I)V
    .locals 3
    .param p1, "v"    # I

    .prologue
    .line 49
    sget-object v0, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "setHeartBeatTime:"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 50
    iput p1, p0, Lcom/netease/pushservice/Network;->HEART_BEAT_TIME:I

    .line 51
    return-void
.end method

.method public stop()V
    .locals 2

    .prologue
    .line 159
    sget-object v0, Lcom/netease/pushservice/Network;->TAG:Ljava/lang/String;

    const-string v1, "stop"

    invoke-static {v0, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 160
    iget-object v0, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    invoke-virtual {v0}, Ljava/util/concurrent/locks/ReentrantLock;->lock()V

    .line 161
    invoke-virtual {p0}, Lcom/netease/pushservice/Network;->disconnect()V

    .line 162
    const/4 v0, 0x0

    iput-boolean v0, p0, Lcom/netease/pushservice/Network;->isEnable:Z

    .line 163
    iget-object v0, p0, Lcom/netease/pushservice/Network;->mLock:Ljava/util/concurrent/locks/ReentrantLock;

    invoke-virtual {v0}, Ljava/util/concurrent/locks/ReentrantLock;->unlock()V

    .line 164
    return-void
.end method
