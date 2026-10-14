.class public final Lcom/netease/push/proto/ProtoClient$PbMessage;
.super Lcom/google/protobuf/nano/MessageNano;
.source "ProtoClient.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/netease/push/proto/ProtoClient;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x19
    name = "PbMessage"
.end annotation


# static fields
.field private static volatile _emptyArray:[Lcom/netease/push/proto/ProtoClient$PbMessage;


# instance fields
.field public content:Ljava/lang/String;

.field public ext:Ljava/lang/String;

.field public mode:I

.field public packagename:Ljava/lang/String;

.field public service:Ljava/lang/String;

.field public tTL:J

.field public time:J

.field public title:Ljava/lang/String;


# direct methods
.method public constructor <init>()V
    .locals 0

    .prologue
    .line 645
    invoke-direct {p0}, Lcom/google/protobuf/nano/MessageNano;-><init>()V

    .line 646
    invoke-virtual {p0}, Lcom/netease/push/proto/ProtoClient$PbMessage;->clear()Lcom/netease/push/proto/ProtoClient$PbMessage;

    .line 647
    return-void
.end method

.method public static emptyArray()[Lcom/netease/push/proto/ProtoClient$PbMessage;
    .locals 2

    .prologue
    .line 610
    sget-object v0, Lcom/netease/push/proto/ProtoClient$PbMessage;->_emptyArray:[Lcom/netease/push/proto/ProtoClient$PbMessage;

    if-nez v0, :cond_1

    .line 612
    sget-object v1, Lcom/google/protobuf/nano/InternalNano;->LAZY_INIT_LOCK:Ljava/lang/Object;

    monitor-enter v1

    .line 613
    :try_start_0
    sget-object v0, Lcom/netease/push/proto/ProtoClient$PbMessage;->_emptyArray:[Lcom/netease/push/proto/ProtoClient$PbMessage;

    if-nez v0, :cond_0

    .line 614
    const/4 v0, 0x0

    new-array v0, v0, [Lcom/netease/push/proto/ProtoClient$PbMessage;

    sput-object v0, Lcom/netease/push/proto/ProtoClient$PbMessage;->_emptyArray:[Lcom/netease/push/proto/ProtoClient$PbMessage;

    .line 611
    :cond_0
    monitor-exit v1
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    .line 618
    :cond_1
    sget-object v0, Lcom/netease/push/proto/ProtoClient$PbMessage;->_emptyArray:[Lcom/netease/push/proto/ProtoClient$PbMessage;

    return-object v0

    .line 611
    :catchall_0
    move-exception v0

    :try_start_1
    monitor-exit v1
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    throw v0
.end method

.method public static parseFrom(Lcom/google/protobuf/nano/CodedInputByteBufferNano;)Lcom/netease/push/proto/ProtoClient$PbMessage;
    .locals 1
    .param p0, "input"    # Lcom/google/protobuf/nano/CodedInputByteBufferNano;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .prologue
    .line 789
    new-instance v0, Lcom/netease/push/proto/ProtoClient$PbMessage;

    invoke-direct {v0}, Lcom/netease/push/proto/ProtoClient$PbMessage;-><init>()V

    invoke-virtual {v0, p0}, Lcom/netease/push/proto/ProtoClient$PbMessage;->mergeFrom(Lcom/google/protobuf/nano/CodedInputByteBufferNano;)Lcom/netease/push/proto/ProtoClient$PbMessage;

    move-result-object v0

    return-object v0
.end method

.method public static parseFrom([B)Lcom/netease/push/proto/ProtoClient$PbMessage;
    .locals 1
    .param p0, "data"    # [B
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Lcom/google/protobuf/nano/InvalidProtocolBufferNanoException;
        }
    .end annotation

    .prologue
    .line 783
    new-instance v0, Lcom/netease/push/proto/ProtoClient$PbMessage;

    invoke-direct {v0}, Lcom/netease/push/proto/ProtoClient$PbMessage;-><init>()V

    invoke-static {v0, p0}, Lcom/google/protobuf/nano/MessageNano;->mergeFrom(Lcom/google/protobuf/nano/MessageNano;[B)Lcom/google/protobuf/nano/MessageNano;

    move-result-object v0

    check-cast v0, Lcom/netease/push/proto/ProtoClient$PbMessage;

    return-object v0
.end method


# virtual methods
.method public clear()Lcom/netease/push/proto/ProtoClient$PbMessage;
    .locals 3

    .prologue
    const-wide/16 v1, 0x0

    .line 650
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->content:Ljava/lang/String;

    .line 651
    iput-wide v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->time:J

    .line 652
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->service:Ljava/lang/String;

    .line 653
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->packagename:Ljava/lang/String;

    .line 654
    const/4 v0, 0x0

    iput v0, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->mode:I

    .line 655
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->ext:Ljava/lang/String;

    .line 656
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->title:Ljava/lang/String;

    .line 657
    iput-wide v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->tTL:J

    .line 658
    const/4 v0, -0x1

    iput v0, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->cachedSize:I

    .line 659
    return-object p0
.end method

.method protected computeSerializedSize()I
    .locals 6

    .prologue
    const-wide/16 v4, 0x0

    .line 694
    invoke-super {p0}, Lcom/google/protobuf/nano/MessageNano;->computeSerializedSize()I

    move-result v0

    .line 695
    .local v0, "size":I
    iget-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->content:Ljava/lang/String;

    const-string v2, ""

    invoke-virtual {v1, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_0

    .line 697
    const/4 v1, 0x1

    iget-object v2, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->content:Ljava/lang/String;

    invoke-static {v1, v2}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->computeStringSize(ILjava/lang/String;)I

    move-result v1

    add-int/2addr v0, v1

    .line 699
    :cond_0
    iget-wide v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->time:J

    cmp-long v1, v1, v4

    if-eqz v1, :cond_1

    .line 701
    const/4 v1, 0x2

    iget-wide v2, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->time:J

    invoke-static {v1, v2, v3}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->computeInt64Size(IJ)I

    move-result v1

    add-int/2addr v0, v1

    .line 703
    :cond_1
    iget-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->service:Ljava/lang/String;

    const-string v2, ""

    invoke-virtual {v1, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_2

    .line 705
    const/4 v1, 0x3

    iget-object v2, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->service:Ljava/lang/String;

    invoke-static {v1, v2}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->computeStringSize(ILjava/lang/String;)I

    move-result v1

    add-int/2addr v0, v1

    .line 707
    :cond_2
    iget-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->packagename:Ljava/lang/String;

    const-string v2, ""

    invoke-virtual {v1, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_3

    .line 709
    const/4 v1, 0x4

    iget-object v2, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->packagename:Ljava/lang/String;

    invoke-static {v1, v2}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->computeStringSize(ILjava/lang/String;)I

    move-result v1

    add-int/2addr v0, v1

    .line 711
    :cond_3
    iget v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->mode:I

    if-eqz v1, :cond_4

    .line 713
    const/4 v1, 0x5

    iget v2, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->mode:I

    invoke-static {v1, v2}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->computeInt32Size(II)I

    move-result v1

    add-int/2addr v0, v1

    .line 715
    :cond_4
    iget-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->ext:Ljava/lang/String;

    const-string v2, ""

    invoke-virtual {v1, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_5

    .line 717
    const/4 v1, 0x6

    iget-object v2, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->ext:Ljava/lang/String;

    invoke-static {v1, v2}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->computeStringSize(ILjava/lang/String;)I

    move-result v1

    add-int/2addr v0, v1

    .line 719
    :cond_5
    iget-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->title:Ljava/lang/String;

    const-string v2, ""

    invoke-virtual {v1, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_6

    .line 721
    const/4 v1, 0x7

    iget-object v2, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->title:Ljava/lang/String;

    invoke-static {v1, v2}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->computeStringSize(ILjava/lang/String;)I

    move-result v1

    add-int/2addr v0, v1

    .line 723
    :cond_6
    iget-wide v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->tTL:J

    cmp-long v1, v1, v4

    if-eqz v1, :cond_7

    .line 725
    const/16 v1, 0x8

    iget-wide v2, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->tTL:J

    invoke-static {v1, v2, v3}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->computeInt64Size(IJ)I

    move-result v1

    add-int/2addr v0, v1

    .line 727
    :cond_7
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
    invoke-virtual {p0, p1}, Lcom/netease/push/proto/ProtoClient$PbMessage;->mergeFrom(Lcom/google/protobuf/nano/CodedInputByteBufferNano;)Lcom/netease/push/proto/ProtoClient$PbMessage;

    move-result-object v0

    return-object v0
.end method

.method public mergeFrom(Lcom/google/protobuf/nano/CodedInputByteBufferNano;)Lcom/netease/push/proto/ProtoClient$PbMessage;
    .locals 3
    .param p1, "input"    # Lcom/google/protobuf/nano/CodedInputByteBufferNano;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .prologue
    .line 735
    :cond_0
    :goto_0
    invoke-virtual {p1}, Lcom/google/protobuf/nano/CodedInputByteBufferNano;->readTag()I

    move-result v0

    .line 736
    .local v0, "tag":I
    sparse-switch v0, :sswitch_data_0

    .line 740
    invoke-static {p1, v0}, Lcom/google/protobuf/nano/WireFormatNano;->parseUnknownField(Lcom/google/protobuf/nano/CodedInputByteBufferNano;I)Z

    move-result v1

    if-nez v1, :cond_0

    .line 741
    :sswitch_0
    return-object p0

    .line 746
    :sswitch_1
    invoke-virtual {p1}, Lcom/google/protobuf/nano/CodedInputByteBufferNano;->readString()Ljava/lang/String;

    move-result-object v1

    iput-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->content:Ljava/lang/String;

    goto :goto_0

    .line 750
    :sswitch_2
    invoke-virtual {p1}, Lcom/google/protobuf/nano/CodedInputByteBufferNano;->readInt64()J

    move-result-wide v1

    iput-wide v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->time:J

    goto :goto_0

    .line 754
    :sswitch_3
    invoke-virtual {p1}, Lcom/google/protobuf/nano/CodedInputByteBufferNano;->readString()Ljava/lang/String;

    move-result-object v1

    iput-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->service:Ljava/lang/String;

    goto :goto_0

    .line 758
    :sswitch_4
    invoke-virtual {p1}, Lcom/google/protobuf/nano/CodedInputByteBufferNano;->readString()Ljava/lang/String;

    move-result-object v1

    iput-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->packagename:Ljava/lang/String;

    goto :goto_0

    .line 762
    :sswitch_5
    invoke-virtual {p1}, Lcom/google/protobuf/nano/CodedInputByteBufferNano;->readInt32()I

    move-result v1

    iput v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->mode:I

    goto :goto_0

    .line 766
    :sswitch_6
    invoke-virtual {p1}, Lcom/google/protobuf/nano/CodedInputByteBufferNano;->readString()Ljava/lang/String;

    move-result-object v1

    iput-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->ext:Ljava/lang/String;

    goto :goto_0

    .line 770
    :sswitch_7
    invoke-virtual {p1}, Lcom/google/protobuf/nano/CodedInputByteBufferNano;->readString()Ljava/lang/String;

    move-result-object v1

    iput-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->title:Ljava/lang/String;

    goto :goto_0

    .line 774
    :sswitch_8
    invoke-virtual {p1}, Lcom/google/protobuf/nano/CodedInputByteBufferNano;->readInt64()J

    move-result-wide v1

    iput-wide v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->tTL:J

    goto :goto_0

    .line 736
    :sswitch_data_0
    .sparse-switch
        0x0 -> :sswitch_0
        0xa -> :sswitch_1
        0x10 -> :sswitch_2
        0x1a -> :sswitch_3
        0x22 -> :sswitch_4
        0x28 -> :sswitch_5
        0x32 -> :sswitch_6
        0x3a -> :sswitch_7
        0x40 -> :sswitch_8
    .end sparse-switch
.end method

.method public writeTo(Lcom/google/protobuf/nano/CodedOutputByteBufferNano;)V
    .locals 5
    .param p1, "output"    # Lcom/google/protobuf/nano/CodedOutputByteBufferNano;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .prologue
    const-wide/16 v3, 0x0

    .line 665
    iget-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->content:Ljava/lang/String;

    const-string v1, ""

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    .line 666
    const/4 v0, 0x1

    iget-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->content:Ljava/lang/String;

    invoke-virtual {p1, v0, v1}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->writeString(ILjava/lang/String;)V

    .line 668
    :cond_0
    iget-wide v0, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->time:J

    cmp-long v0, v0, v3

    if-eqz v0, :cond_1

    .line 669
    const/4 v0, 0x2

    iget-wide v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->time:J

    invoke-virtual {p1, v0, v1, v2}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->writeInt64(IJ)V

    .line 671
    :cond_1
    iget-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->service:Ljava/lang/String;

    const-string v1, ""

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_2

    .line 672
    const/4 v0, 0x3

    iget-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->service:Ljava/lang/String;

    invoke-virtual {p1, v0, v1}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->writeString(ILjava/lang/String;)V

    .line 674
    :cond_2
    iget-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->packagename:Ljava/lang/String;

    const-string v1, ""

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_3

    .line 675
    const/4 v0, 0x4

    iget-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->packagename:Ljava/lang/String;

    invoke-virtual {p1, v0, v1}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->writeString(ILjava/lang/String;)V

    .line 677
    :cond_3
    iget v0, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->mode:I

    if-eqz v0, :cond_4

    .line 678
    const/4 v0, 0x5

    iget v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->mode:I

    invoke-virtual {p1, v0, v1}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->writeInt32(II)V

    .line 680
    :cond_4
    iget-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->ext:Ljava/lang/String;

    const-string v1, ""

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_5

    .line 681
    const/4 v0, 0x6

    iget-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->ext:Ljava/lang/String;

    invoke-virtual {p1, v0, v1}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->writeString(ILjava/lang/String;)V

    .line 683
    :cond_5
    iget-object v0, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->title:Ljava/lang/String;

    const-string v1, ""

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_6

    .line 684
    const/4 v0, 0x7

    iget-object v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->title:Ljava/lang/String;

    invoke-virtual {p1, v0, v1}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->writeString(ILjava/lang/String;)V

    .line 686
    :cond_6
    iget-wide v0, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->tTL:J

    cmp-long v0, v0, v3

    if-eqz v0, :cond_7

    .line 687
    const/16 v0, 0x8

    iget-wide v1, p0, Lcom/netease/push/proto/ProtoClient$PbMessage;->tTL:J

    invoke-virtual {p1, v0, v1, v2}, Lcom/google/protobuf/nano/CodedOutputByteBufferNano;->writeInt64(IJ)V

    .line 689
    :cond_7
    invoke-super {p0, p1}, Lcom/google/protobuf/nano/MessageNano;->writeTo(Lcom/google/protobuf/nano/CodedOutputByteBufferNano;)V

    .line 690
    return-void
.end method
