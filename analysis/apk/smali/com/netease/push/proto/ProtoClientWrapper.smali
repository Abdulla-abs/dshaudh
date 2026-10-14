.class public Lcom/netease/push/proto/ProtoClientWrapper;
.super Ljava/lang/Object;
.source "ProtoClientWrapper.java"


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Lcom/netease/push/proto/ProtoClientWrapper$DataMarshal;,
        Lcom/netease/push/proto/ProtoClientWrapper$DevInfo;,
        Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;,
        Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;,
        Lcom/netease/push/proto/ProtoClientWrapper$Message;,
        Lcom/netease/push/proto/ProtoClientWrapper$MessageInfo;,
        Lcom/netease/push/proto/ProtoClientWrapper$NewIdInfo;,
        Lcom/netease/push/proto/ProtoClientWrapper$Packet;,
        Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;
    }
.end annotation


# static fields
.field public static final GET_NEW_ID_TYPE:B = 0x1t

.field public static final GOT_TIME_TYPE:B = 0x5t

.field public static final HB_FLAG:S = 0x2s

.field public static final HB_TYPE:B = 0x3t

.field public static final LOGIN_TYPE:B = 0x4t

.field public static final NEW_ID_TYPE:B = 0x34t

.field public static final PROTO_VER:B = 0x2t

.field public static final PUSH_TYPE:B = 0x32t

.field public static final REGISTER_TYPE:B = 0x6t

.field public static final RESET_TYPE:B = 0x33t

.field public static final SET_NEW_ID_TYPE:B = 0x2t

.field public static final UNREGISTER_TYPE:B = 0x7t

.field private static final headLen:I = 0x4


# direct methods
.method public constructor <init>()V
    .locals 0

    .prologue
    .line 41
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public static BytesToUint16([BI)I
    .locals 3
    .param p0, "buf"    # [B
    .param p1, "pos"    # I

    .prologue
    .line 81
    aget-byte v1, p0, p1

    and-int/lit16 v1, v1, 0xff

    shl-int/lit8 v1, v1, 0x8

    add-int/lit8 v2, p1, 0x1

    aget-byte v2, p0, v2

    and-int/lit16 v2, v2, 0xff

    add-int v0, v1, v2

    .line 82
    .local v0, "v":I
    return v0
.end method

.method public static final MarshalObject(BLcom/netease/push/proto/ProtoClientWrapper$DataMarshal;)[B
    .locals 8
    .param p0, "cmdType"    # B
    .param p1, "object"    # Lcom/netease/push/proto/ProtoClientWrapper$DataMarshal;

    .prologue
    const/4 v4, 0x2

    const/4 v7, 0x0

    .line 89
    invoke-interface {p1}, Lcom/netease/push/proto/ProtoClientWrapper$DataMarshal;->Marshal()[B

    move-result-object v2

    .line 91
    .local v2, "messageBytes":[B
    array-length v3, v2

    add-int/lit8 v1, v3, 0x4

    .line 92
    .local v1, "length":I
    new-array v0, v1, [B

    .line 94
    .local v0, "data":[B
    invoke-static {v0, v7, v1}, Lcom/netease/push/proto/ProtoClientWrapper;->Uint16ToBytes([BII)V

    .line 95
    aput-byte v4, v0, v4

    .line 96
    const/4 v3, 0x3

    aput-byte p0, v0, v3

    .line 97
    const/4 v3, 0x4

    array-length v4, v2

    invoke-static {v2, v7, v0, v3, v4}, Ljava/lang/System;->arraycopy(Ljava/lang/Object;ILjava/lang/Object;II)V

    .line 99
    sget-object v3, Ljava/lang/System;->out:Ljava/io/PrintStream;

    const-string v4, "marshal:%s"

    const/4 v5, 0x1

    new-array v5, v5, [Ljava/lang/Object;

    invoke-static {v0}, Ljava/util/Arrays;->toString([B)Ljava/lang/String;

    move-result-object v6

    aput-object v6, v5, v7

    invoke-virtual {v3, v4, v5}, Ljava/io/PrintStream;->printf(Ljava/lang/String;[Ljava/lang/Object;)Ljava/io/PrintStream;

    .line 101
    return-object v0
.end method

.method public static Uint16ToBytes([BII)V
    .locals 2
    .param p0, "byteArr"    # [B
    .param p1, "pos"    # I
    .param p2, "cData"    # I

    .prologue
    .line 64
    const v0, 0xffff

    and-int/2addr p2, v0

    .line 65
    shr-int/lit8 v0, p2, 0x8

    and-int/lit16 v0, v0, 0xff

    int-to-byte v0, v0

    aput-byte v0, p0, p1

    .line 66
    add-int/lit8 v0, p1, 0x1

    and-int/lit16 v1, p2, 0xff

    int-to-byte v1, v1

    aput-byte v1, p0, v0

    .line 67
    return-void
.end method

.method public static UnmarshalPacket([B)Lcom/netease/push/proto/ProtoClientWrapper$Packet;
    .locals 6
    .param p0, "data"    # [B

    .prologue
    const/4 v5, 0x4

    const/4 v4, 0x0

    .line 106
    array-length v1, p0

    if-ge v1, v5, :cond_0

    .line 108
    const-string v1, "AndroidPush"

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "data error:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 109
    const/4 v0, 0x0

    .line 120
    :goto_0
    return-object v0

    .line 111
    :cond_0
    new-instance v0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;

    invoke-direct {v0}, Lcom/netease/push/proto/ProtoClientWrapper$Packet;-><init>()V

    .line 112
    .local v0, "packet":Lcom/netease/push/proto/ProtoClientWrapper$Packet;
    invoke-static {p0, v4}, Lcom/netease/push/proto/ProtoClientWrapper;->BytesToUint16([BI)I

    move-result v1

    iput v1, v0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->length:I

    .line 113
    const-string v1, "AndroidPush"

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "data[0]="

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    aget-byte v3, p0, v4

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 114
    const-string v1, "AndroidPush"

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "data[1]="

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const/4 v3, 0x1

    aget-byte v3, p0, v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 115
    const-string v1, "AndroidPush"

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "packet.length:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget v3, v0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->length:I

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v3, ", data.length:"

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    array-length v3, p0

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 116
    const/4 v1, 0x2

    aget-byte v1, p0, v1

    iput-byte v1, v0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->version:B

    .line 117
    const/4 v1, 0x3

    aget-byte v1, p0, v1

    iput-byte v1, v0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->type:B

    .line 118
    iget v1, v0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->length:I

    add-int/lit8 v1, v1, -0x4

    new-array v1, v1, [B

    iput-object v1, v0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->data:[B

    .line 119
    iget-object v1, v0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->data:[B

    iget v2, v0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->length:I

    add-int/lit8 v2, v2, -0x4

    invoke-static {p0, v5, v1, v4, v2}, Ljava/lang/System;->arraycopy(Ljava/lang/Object;ILjava/lang/Object;II)V

    goto :goto_0
.end method

.method public static getTypeName(B)Ljava/lang/String;
    .locals 1
    .param p0, "type"    # B

    .prologue
    .line 124
    const-string v0, ""

    .line 125
    .local v0, "name":Ljava/lang/String;
    packed-switch p0, :pswitch_data_0

    .line 137
    const-string v0, "unknown"

    .line 140
    :goto_0
    return-object v0

    .line 127
    :pswitch_0
    const-string v0, "push"

    .line 128
    goto :goto_0

    .line 130
    :pswitch_1
    const-string v0, "reset"

    .line 131
    goto :goto_0

    .line 133
    :pswitch_2
    const-string v0, "newid"

    .line 134
    goto :goto_0

    .line 125
    nop

    :pswitch_data_0
    .packed-switch 0x32
        :pswitch_0
        :pswitch_1
        :pswitch_2
    .end packed-switch
.end method
