.class public final Lcom/netease/push/proto/ProtoClient$PbLoginInfo;
.super Lcom/google/protobuf/nano/MessageNano;
.source "ProtoClient.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/netease/push/proto/ProtoClient;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x19
    name = "PbLoginInfo"
.end annotation


# static fields
.field private static volatile _emptyArray:[Lcom/netease/push/proto/ProtoClient$PbLoginInfo;


# instance fields
.field public id:Ljava/lang/String;

.field public serviceinfos:[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

.field public ver:Ljava/lang/String;


# direct methods
.method public constructor <init>()V
    .locals 0

    .prologue
    .line 406
    invoke-direct {p0}, Lcom/google/protobuf/nano/MessageNano;-><init>()V

    .line 407
    invoke-virtual {p0}, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->clear()Lcom/netease/push/proto/ProtoClient$PbLoginInfo;

    .line 408
    return-void
.end method

.method public static emptyArray()[Lcom/netease/push/proto/ProtoClient$PbLoginInfo;
    .locals 2

    .prologue
    .line 386
    sget-object v0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->_emptyArray:[Lcom/netease/push/proto/ProtoClient$PbLoginInfo;

    if-nez v0, :cond_1

    .line 388
    sget-object v1, Lcom/google/protobuf/nano/InternalNano;->LAZY_INIT_LOCK:Ljava/lang/Object;

    monitor-enter v1

    .line 389
    :try_start_0
    sget-object v0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->_emptyArray:[Lcom/netease/push/proto/ProtoClient$PbLoginInfo;

    if-nez v0, :cond_0

    .line 390
    const/4 v0, 0x0

    new-array v0, v0, [Lcom/netease/push/proto/ProtoClient$PbLoginInfo;

    sput-object v0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->_emptyArray:[Lcom/netease/push/proto/ProtoClient$PbLoginInfo;

    .line 387
    :cond_0
    monitor-exit v1
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    .line 394
    :cond_1
    sget-object v0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->_emptyArray:[Lcom/netease/push/proto/ProtoClient$PbLoginInfo;

    return-object v0

    .line 387
    :catchall_0
    move-exception v0

    :try_start_1
    monitor-exit v1
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    throw v0
.end method

.method public static parseFrom(Lcom/google/protobuf/nano/CodedInputByteBufferNano;)Lcom/netease/push/proto/ProtoClient$PbLoginInfo;
    .locals 1
    .param p0, "input"    # Lcom/google/protobuf/nano/CodedInputByteBufferNano;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .prologue
    .line 516
    new-instance v0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;

    invoke-direct {v0}, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;-><init>()V

    invoke-virtual {v0, p0}, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->mergeFrom(Lcom/google/protobuf/nano/CodedInputByteBufferNano;)Lcom/netease/push/proto/ProtoClient$PbLoginInfo;

    move-result-object v0

    return-object v0
.end method

.method public static parseFrom([B)Lcom/netease/push/proto/ProtoClient$PbLoginInfo;
    .locals 1
    .param p0, "data"    # [B
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Lcom/google/protobuf/nano/InvalidProtocolBufferNanoException;
        }
    .end annotation

    .prologue
    .line 510
    new-instance v0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;

    invoke-direct {v0}, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;-><init>()V

    invoke-static {v0, p0}, Lcom/google/protobuf/nano/MessageNano;->mergeFrom(Lcom/google/protobuf/nano/MessageNano;[B)Lcom/google/protobuf/nano/MessageNano;

    move-result-object v0

    check-cast v0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;

    return-object v0
.end method


# virtual methods
.method public clear()Lcom/netease/push/proto/ProtoClient$PbLoginInfo;
    .locals 1

    .prologue
    .line 411
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->id:Ljava/lang/String;

    .line 412
    invoke-static {}, Lcom/netease/push/proto/ProtoClient$PbServiceInfo;->emptyArray()[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    move-result-object v0

    iput-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->serviceinfos:[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    .line 413
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->ver:Ljava/lang/String;

    .line 414
    const/4 v0, -0x1

    iput v0, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->cachedSize:I

    .line 415
    return-object p0
.end method

.method protected computeSerializedSize()I
    .locals 5

    .prologue
    .line 440
    invoke-super {p0}, Lcom/google/protobuf/nano/MessageNano;->computeSerializedSize()I

    move-result v2

    .line 441
    .local v2, "size":I
    iget-object v3, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->id:Ljava/lang/String;

    const-string v4, ""

    invoke-virtual {v3, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_0

    .line 443
    const/4 v3, 0x1

    iget-object v4, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->id:Ljava/lang/String;

    invoke-static {v3, v4}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->computeStringSize(ILjava/lang/String;)I

    move-result v3

    add-int/2addr v2, v3

    .line 445
    :cond_0
    iget-object v3, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->serviceinfos:[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    if-eqz v3, :cond_1

    iget-object v3, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->serviceinfos:[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    array-length v3, v3

    if-lez v3, :cond_1

    .line 446
    const/4 v1, 0x0

    .local v1, "i":I
    :goto_0
    iget-object v3, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->serviceinfos:[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    array-length v3, v3

    if-lt v1, v3, :cond_3

    .line 454
    .end local v1    # "i":I
    :cond_1
    iget-object v3, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->ver:Ljava/lang/String;

    const-string v4, ""

    invoke-virtual {v3, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_2

    .line 456
    const/4 v3, 0x3

    iget-object v4, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->ver:Ljava/lang/String;

    invoke-static {v3, v4}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->computeStringSize(ILjava/lang/String;)I

    move-result v3

    add-int/2addr v2, v3

    .line 458
    :cond_2
    return v2

    .line 447
    .restart local v1    # "i":I
    :cond_3
    iget-object v3, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->serviceinfos:[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    aget-object v0, v3, v1

    .line 448
    .local v0, "element":Lcom/netease/push/proto/ProtoClient$PbServiceInfo;
    if-eqz v0, :cond_4

    .line 450
    const/4 v3, 0x2

    invoke-static {v3, v0}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->computeMessageSize(ILcom/google/protobuf/nano/MessageNano;)I

    move-result v3

    add-int/2addr v2, v3

    .line 446
    :cond_4
    add-int/lit8 v1, v1, 0x1

    goto :goto_0
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
    invoke-virtual {p0, p1}, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->mergeFrom(Lcom/google/protobuf/nano/CodedInputByteBufferNano;)Lcom/netease/push/proto/ProtoClient$PbLoginInfo;

    move-result-object v0

    return-object v0
.end method

.method public mergeFrom(Lcom/google/protobuf/nano/CodedInputByteBufferNano;)Lcom/netease/push/proto/ProtoClient$PbLoginInfo;
    .locals 6
    .param p1, "input"    # Lcom/google/protobuf/nano/CodedInputByteBufferNano;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .prologue
    const/4 v4, 0x0

    .line 466
    :cond_0
    :goto_0
    invoke-virtual {p1}, Lcom/google/protobuf/nano/CodedInputByteBufferNano;->readTag()I

    move-result v3

    .line 467
    .local v3, "tag":I
    sparse-switch v3, :sswitch_data_0

    .line 471
    invoke-static {p1, v3}, Lcom/google/protobuf/nano/WireFormatNano;->parseUnknownField(Lcom/google/protobuf/nano/CodedInputByteBufferNano;I)Z

    move-result v5

    if-nez v5, :cond_0

    .line 472
    :sswitch_0
    return-object p0

    .line 477
    :sswitch_1
    invoke-virtual {p1}, Lcom/google/protobuf/nano/CodedInputByteBufferNano;->readString()Ljava/lang/String;

    move-result-object v5

    iput-object v5, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->id:Ljava/lang/String;

    goto :goto_0

    .line 482
    :sswitch_2
    const/16 v5, 0x12

    invoke-static {p1, v5}, Lcom/google/protobuf/nano/WireFormatNano;->getRepeatedFieldArrayLength(Lcom/google/protobuf/nano/CodedInputByteBufferNano;I)I

    move-result v0

    .line 483
    .local v0, "arrayLength":I
    iget-object v5, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->serviceinfos:[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    if-nez v5, :cond_2

    move v1, v4

    .line 485
    .local v1, "i":I
    :goto_1
    add-int v5, v1, v0

    new-array v2, v5, [Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    .line 486
    .local v2, "newArray":[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;
    if-eqz v1, :cond_1

    .line 487
    iget-object v5, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->serviceinfos:[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    invoke-static {v5, v4, v2, v4, v1}, Ljava/lang/System;->arraycopy(Ljava/lang/Object;ILjava/lang/Object;II)V

    .line 489
    :cond_1
    :goto_2
    array-length v5, v2

    add-int/lit8 v5, v5, -0x1

    if-lt v1, v5, :cond_3

    .line 495
    new-instance v5, Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    invoke-direct {v5}, Lcom/netease/push/proto/ProtoClient$PbServiceInfo;-><init>()V

    aput-object v5, v2, v1

    .line 496
    aget-object v5, v2, v1

    invoke-virtual {p1, v5}, Lcom/google/protobuf/nano/CodedInputByteBufferNano;->readMessage(Lcom/google/protobuf/nano/MessageNano;)V

    .line 497
    iput-object v2, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->serviceinfos:[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    goto :goto_0

    .line 483
    .end local v1    # "i":I
    .end local v2    # "newArray":[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;
    :cond_2
    iget-object v5, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->serviceinfos:[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    array-length v1, v5

    goto :goto_1

    .line 490
    .restart local v1    # "i":I
    .restart local v2    # "newArray":[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;
    :cond_3
    new-instance v5, Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    invoke-direct {v5}, Lcom/netease/push/proto/ProtoClient$PbServiceInfo;-><init>()V

    aput-object v5, v2, v1

    .line 491
    aget-object v5, v2, v1

    invoke-virtual {p1, v5}, Lcom/google/protobuf/nano/CodedInputByteBufferNano;->readMessage(Lcom/google/protobuf/nano/MessageNano;)V

    .line 492
    invoke-virtual {p1}, Lcom/google/protobuf/nano/CodedInputByteBufferNano;->readTag()I

    .line 489
    add-int/lit8 v1, v1, 0x1

    goto :goto_2

    .line 501
    .end local v0    # "arrayLength":I
    .end local v1    # "i":I
    .end local v2    # "newArray":[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;
    :sswitch_3
    invoke-virtual {p1}, Lcom/google/protobuf/nano/CodedInputByteBufferNano;->readString()Ljava/lang/String;

    move-result-object v5

    iput-object v5, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->ver:Ljava/lang/String;

    goto :goto_0

    .line 467
    nop

    :sswitch_data_0
    .sparse-switch
        0x0 -> :sswitch_0
        0xa -> :sswitch_1
        0x12 -> :sswitch_2
        0x1a -> :sswitch_3
    .end sparse-switch
.end method

.method public writeTo(Lcom/google/protobuf/nano/CodedOutputByteBufferNano;)V
    .locals 4
    .param p1, "output"    # Lcom/google/protobuf/nano/CodedOutputByteBufferNano;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .prologue
    .line 421
    iget-object v2, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->id:Ljava/lang/String;

    const-string v3, ""

    invoke-virtual {v2, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-nez v2, :cond_0

    .line 422
    const/4 v2, 0x1

    iget-object v3, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->id:Ljava/lang/String;

    invoke-virtual {p1, v2, v3}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->writeString(ILjava/lang/String;)V

    .line 424
    :cond_0
    iget-object v2, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->serviceinfos:[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    if-eqz v2, :cond_1

    iget-object v2, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->serviceinfos:[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    array-length v2, v2

    if-lez v2, :cond_1

    .line 425
    const/4 v1, 0x0

    .local v1, "i":I
    :goto_0
    iget-object v2, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->serviceinfos:[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    array-length v2, v2

    if-lt v1, v2, :cond_3

    .line 432
    .end local v1    # "i":I
    :cond_1
    iget-object v2, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->ver:Ljava/lang/String;

    const-string v3, ""

    invoke-virtual {v2, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-nez v2, :cond_2

    .line 433
    const/4 v2, 0x3

    iget-object v3, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->ver:Ljava/lang/String;

    invoke-virtual {p1, v2, v3}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->writeString(ILjava/lang/String;)V

    .line 435
    :cond_2
    invoke-super {p0, p1}, Lcom/google/protobuf/nano/MessageNano;->writeTo(Lcom/google/protobuf/nano/CodedOutputByteBufferNano;)V

    .line 436
    return-void

    .line 426
    .restart local v1    # "i":I
    :cond_3
    iget-object v2, p0, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->serviceinfos:[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    aget-object v0, v2, v1

    .line 427
    .local v0, "element":Lcom/netease/push/proto/ProtoClient$PbServiceInfo;
    if-eqz v0, :cond_4

    .line 428
    const/4 v2, 0x2

    invoke-virtual {p1, v2, v0}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->writeMessage(ILcom/google/protobuf/nano/MessageNano;)V

    .line 425
    :cond_4
    add-int/lit8 v1, v1, 0x1

    goto :goto_0
.end method
