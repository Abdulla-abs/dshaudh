.class public final Lcom/netease/push/proto/ProtoClient$PbDevInfo;
.super Lcom/google/protobuf/nano/MessageNano;
.source "ProtoClient.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/netease/push/proto/ProtoClient;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x19
    name = "PbDevInfo"
.end annotation


# static fields
.field private static volatile _emptyArray:[Lcom/netease/push/proto/ProtoClient$PbDevInfo;


# instance fields
.field public id:Ljava/lang/String;

.field public mac:Ljava/lang/String;

.field public model:Ljava/lang/String;

.field public os:Ljava/lang/String;

.field public osver:Ljava/lang/String;

.field public screen:Ljava/lang/String;


# direct methods
.method public constructor <init>()V
    .locals 0

    .prologue
    .line 43
    invoke-direct {p0}, Lcom/google/protobuf/nano/MessageNano;-><init>()V

    .line 44
    invoke-virtual {p0}, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->clear()Lcom/netease/push/proto/ProtoClient$PbDevInfo;

    .line 45
    return-void
.end method

.method public static emptyArray()[Lcom/netease/push/proto/ProtoClient$PbDevInfo;
    .locals 2

    .prologue
    .line 14
    sget-object v0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->_emptyArray:[Lcom/netease/push/proto/ProtoClient$PbDevInfo;

    if-nez v0, :cond_1

    .line 16
    sget-object v1, Lcom/google/protobuf/nano/InternalNano;->LAZY_INIT_LOCK:Ljava/lang/Object;

    monitor-enter v1

    .line 17
    :try_start_0
    sget-object v0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->_emptyArray:[Lcom/netease/push/proto/ProtoClient$PbDevInfo;

    if-nez v0, :cond_0

    .line 18
    const/4 v0, 0x0

    new-array v0, v0, [Lcom/netease/push/proto/ProtoClient$PbDevInfo;

    sput-object v0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->_emptyArray:[Lcom/netease/push/proto/ProtoClient$PbDevInfo;

    .line 15
    :cond_0
    monitor-exit v1
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    .line 22
    :cond_1
    sget-object v0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->_emptyArray:[Lcom/netease/push/proto/ProtoClient$PbDevInfo;

    return-object v0

    .line 15
    :catchall_0
    move-exception v0

    :try_start_1
    monitor-exit v1
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    throw v0
.end method

.method public static parseFrom(Lcom/google/protobuf/nano/CodedInputByteBufferNano;)Lcom/netease/push/proto/ProtoClient$PbDevInfo;
    .locals 1
    .param p0, "input"    # Lcom/google/protobuf/nano/CodedInputByteBufferNano;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .prologue
    .line 163
    new-instance v0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;

    invoke-direct {v0}, Lcom/netease/push/proto/ProtoClient$PbDevInfo;-><init>()V

    invoke-virtual {v0, p0}, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->mergeFrom(Lcom/google/protobuf/nano/CodedInputByteBufferNano;)Lcom/netease/push/proto/ProtoClient$PbDevInfo;

    move-result-object v0

    return-object v0
.end method

.method public static parseFrom([B)Lcom/netease/push/proto/ProtoClient$PbDevInfo;
    .locals 1
    .param p0, "data"    # [B
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Lcom/google/protobuf/nano/InvalidProtocolBufferNanoException;
        }
    .end annotation

    .prologue
    .line 157
    new-instance v0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;

    invoke-direct {v0}, Lcom/netease/push/proto/ProtoClient$PbDevInfo;-><init>()V

    invoke-static {v0, p0}, Lcom/google/protobuf/nano/MessageNano;->mergeFrom(Lcom/google/protobuf/nano/MessageNano;[B)Lcom/google/protobuf/nano/MessageNano;

    move-result-object v0

    check-cast v0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;

    return-object v0
.end method


# virtual methods
.method public clear()Lcom/netease/push/proto/ProtoClient$PbDevInfo;
    .locals 1

    .prologue
    .line 48
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->model:Ljava/lang/String;

    .line 49
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->screen:Ljava/lang/String;

    .line 50
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->os:Ljava/lang/String;

    .line 51
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->osver:Ljava/lang/String;

    .line 52
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->mac:Ljava/lang/String;

    .line 53
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->id:Ljava/lang/String;

    .line 54
    const/4 v0, -0x1

    iput v0, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->cachedSize:I

    .line 55
    return-object p0
.end method

.method protected computeSerializedSize()I
    .locals 3

    .prologue
    .line 84
    invoke-super {p0}, Lcom/google/protobuf/nano/MessageNano;->computeSerializedSize()I

    move-result v0

    .line 85
    .local v0, "size":I
    iget-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->model:Ljava/lang/String;

    const-string v2, ""

    invoke-virtual {v1, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_0

    .line 87
    const/4 v1, 0x1

    iget-object v2, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->model:Ljava/lang/String;

    invoke-static {v1, v2}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->computeStringSize(ILjava/lang/String;)I

    move-result v1

    add-int/2addr v0, v1

    .line 89
    :cond_0
    iget-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->screen:Ljava/lang/String;

    const-string v2, ""

    invoke-virtual {v1, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_1

    .line 91
    const/4 v1, 0x2

    iget-object v2, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->screen:Ljava/lang/String;

    invoke-static {v1, v2}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->computeStringSize(ILjava/lang/String;)I

    move-result v1

    add-int/2addr v0, v1

    .line 93
    :cond_1
    iget-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->os:Ljava/lang/String;

    const-string v2, ""

    invoke-virtual {v1, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_2

    .line 95
    const/4 v1, 0x3

    iget-object v2, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->os:Ljava/lang/String;

    invoke-static {v1, v2}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->computeStringSize(ILjava/lang/String;)I

    move-result v1

    add-int/2addr v0, v1

    .line 97
    :cond_2
    iget-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->osver:Ljava/lang/String;

    const-string v2, ""

    invoke-virtual {v1, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_3

    .line 99
    const/4 v1, 0x4

    iget-object v2, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->osver:Ljava/lang/String;

    invoke-static {v1, v2}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->computeStringSize(ILjava/lang/String;)I

    move-result v1

    add-int/2addr v0, v1

    .line 101
    :cond_3
    iget-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->mac:Ljava/lang/String;

    const-string v2, ""

    invoke-virtual {v1, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_4

    .line 103
    const/4 v1, 0x5

    iget-object v2, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->mac:Ljava/lang/String;

    invoke-static {v1, v2}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->computeStringSize(ILjava/lang/String;)I

    move-result v1

    add-int/2addr v0, v1

    .line 105
    :cond_4
    iget-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->id:Ljava/lang/String;

    const-string v2, ""

    invoke-virtual {v1, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_5

    .line 107
    const/4 v1, 0x6

    iget-object v2, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->id:Ljava/lang/String;

    invoke-static {v1, v2}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->computeStringSize(ILjava/lang/String;)I

    move-result v1

    add-int/2addr v0, v1

    .line 109
    :cond_5
    return v0
.end method

.method public bridge synthetic mergeFrom(Lcom/google/protobuf/nano/CodedInputByteBufferNano;)Lcom/google/protobuf/nano/MessageNano;
    .locals 1
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .prologue
    .line 1
    invoke-virtual {p0, p1}, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->mergeFrom(Lcom/google/protobuf/nano/CodedInputByteBufferNano;)Lcom/netease/push/proto/ProtoClient$PbDevInfo;

    move-result-object v0

    return-object v0
.end method

.method public mergeFrom(Lcom/google/protobuf/nano/CodedInputByteBufferNano;)Lcom/netease/push/proto/ProtoClient$PbDevInfo;
    .locals 2
    .param p1, "input"    # Lcom/google/protobuf/nano/CodedInputByteBufferNano;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .prologue
    .line 117
    :cond_0
    :goto_0
    invoke-virtual {p1}, Lcom/google/protobuf/nano/CodedInputByteBufferNano;->readTag()I

    move-result v0

    .line 118
    .local v0, "tag":I
    sparse-switch v0, :sswitch_data_0

    .line 122
    invoke-static {p1, v0}, Lcom/google/protobuf/nano/WireFormatNano;->parseUnknownField(Lcom/google/protobuf/nano/CodedInputByteBufferNano;I)Z

    move-result v1

    if-nez v1, :cond_0

    .line 123
    :sswitch_0
    return-object p0

    .line 128
    :sswitch_1
    invoke-virtual {p1}, Lcom/google/protobuf/nano/CodedInputByteBufferNano;->readString()Ljava/lang/String;

    move-result-object v1

    iput-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->model:Ljava/lang/String;

    goto :goto_0

    .line 132
    :sswitch_2
    invoke-virtual {p1}, Lcom/google/protobuf/nano/CodedInputByteBufferNano;->readString()Ljava/lang/String;

    move-result-object v1

    iput-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->screen:Ljava/lang/String;

    goto :goto_0

    .line 136
    :sswitch_3
    invoke-virtual {p1}, Lcom/google/protobuf/nano/CodedInputByteBufferNano;->readString()Ljava/lang/String;

    move-result-object v1

    iput-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->os:Ljava/lang/String;

    goto :goto_0

    .line 140
    :sswitch_4
    invoke-virtual {p1}, Lcom/google/protobuf/nano/CodedInputByteBufferNano;->readString()Ljava/lang/String;

    move-result-object v1

    iput-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->osver:Ljava/lang/String;

    goto :goto_0

    .line 144
    :sswitch_5
    invoke-virtual {p1}, Lcom/google/protobuf/nano/CodedInputByteBufferNano;->readString()Ljava/lang/String;

    move-result-object v1

    iput-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->mac:Ljava/lang/String;

    goto :goto_0

    .line 148
    :sswitch_6
    invoke-virtual {p1}, Lcom/google/protobuf/nano/CodedInputByteBufferNano;->readString()Ljava/lang/String;

    move-result-object v1

    iput-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->id:Ljava/lang/String;

    goto :goto_0

    .line 118
    :sswitch_data_0
    .sparse-switch
        0x0 -> :sswitch_0
        0xa -> :sswitch_1
        0x12 -> :sswitch_2
        0x1a -> :sswitch_3
        0x22 -> :sswitch_4
        0x2a -> :sswitch_5
        0x32 -> :sswitch_6
    .end sparse-switch
.end method

.method public writeTo(Lcom/google/protobuf/nano/CodedOutputByteBufferNano;)V
    .locals 2
    .param p1, "output"    # Lcom/google/protobuf/nano/CodedOutputByteBufferNano;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .prologue
    .line 61
    iget-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->model:Ljava/lang/String;

    const-string v1, ""

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    .line 62
    const/4 v0, 0x1

    iget-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->model:Ljava/lang/String;

    invoke-virtual {p1, v0, v1}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->writeString(ILjava/lang/String;)V

    .line 64
    :cond_0
    iget-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->screen:Ljava/lang/String;

    const-string v1, ""

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_1

    .line 65
    const/4 v0, 0x2

    iget-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->screen:Ljava/lang/String;

    invoke-virtual {p1, v0, v1}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->writeString(ILjava/lang/String;)V

    .line 67
    :cond_1
    iget-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->os:Ljava/lang/String;

    const-string v1, ""

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_2

    .line 68
    const/4 v0, 0x3

    iget-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->os:Ljava/lang/String;

    invoke-virtual {p1, v0, v1}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->writeString(ILjava/lang/String;)V

    .line 70
    :cond_2
    iget-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->osver:Ljava/lang/String;

    const-string v1, ""

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_3

    .line 71
    const/4 v0, 0x4

    iget-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->osver:Ljava/lang/String;

    invoke-virtual {p1, v0, v1}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->writeString(ILjava/lang/String;)V

    .line 73
    :cond_3
    iget-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->mac:Ljava/lang/String;

    const-string v1, ""

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_4

    .line 74
    const/4 v0, 0x5

    iget-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->mac:Ljava/lang/String;

    invoke-virtual {p1, v0, v1}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->writeString(ILjava/lang/String;)V

    .line 76
    :cond_4
    iget-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->id:Ljava/lang/String;

    const-string v1, ""

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_5

    .line 77
    const/4 v0, 0x6

    iget-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbDevInfo;->id:Ljava/lang/String;

    invoke-virtual {p1, v0, v1}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->writeString(ILjava/lang/String;)V

    .line 79
    :cond_5
    invoke-super {p0, p1}, Lcom/google/protobuf/nano/MessageNano;->writeTo(Lcom/google/protobuf/nano/CodedOutputByteBufferNano;)V

    .line 80
    return-void
.end method
