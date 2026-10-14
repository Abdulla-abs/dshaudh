.class public Lcom/netease/push/proto/ProtoClientWrapper$Packet;
.super Ljava/lang/Object;
.source "ProtoClientWrapper.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/netease/push/proto/ProtoClientWrapper;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x9
    name = "Packet"
.end annotation


# instance fields
.field public data:[B

.field public length:I

.field public type:B

.field public version:B


# direct methods
.method public constructor <init>()V
    .locals 1

    .prologue
    .line 155
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 156
    const/4 v0, 0x0

    iput v0, p0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->length:I

    .line 157
    return-void
.end method

.method public constructor <init>(B)V
    .locals 1
    .param p1, "cmdType"    # B

    .prologue
    .line 159
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 161
    const/4 v0, 0x4

    iput v0, p0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->length:I

    .line 162
    iput-byte p1, p0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->type:B

    .line 163
    const/4 v0, 0x2

    iput-byte v0, p0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->version:B

    .line 164
    const/4 v0, 0x0

    iput-object v0, p0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->data:[B

    .line 166
    return-void
.end method

.method public constructor <init>(B[B)V
    .locals 3
    .param p1, "cmdType"    # B
    .param p2, "data"    # [B

    .prologue
    const/4 v2, 0x0

    .line 168
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 170
    array-length v0, p2

    add-int/lit8 v0, v0, 0x4

    iput v0, p0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->length:I

    .line 171
    iput-byte p1, p0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->type:B

    .line 172
    const/4 v0, 0x2

    iput-byte v0, p0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->version:B

    .line 173
    array-length v0, p2

    new-array v0, v0, [B

    iput-object v0, p0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->data:[B

    .line 174
    iget-object v0, p0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->data:[B

    array-length v1, p2

    invoke-static {p2, v2, v0, v2, v1}, Ljava/lang/System;->arraycopy(Ljava/lang/Object;ILjava/lang/Object;II)V

    .line 176
    return-void
.end method


# virtual methods
.method public Marshal()[B
    .locals 6

    .prologue
    const/4 v3, 0x2

    const/4 v5, 0x0

    .line 179
    const/4 v0, 0x4

    .line 180
    .local v0, "_length":I
    iget-object v2, p0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->data:[B

    if-eqz v2, :cond_0

    .line 181
    iget-object v2, p0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->data:[B

    array-length v2, v2

    add-int/2addr v0, v2

    .line 183
    :cond_0
    new-array v1, v0, [B

    .line 185
    .local v1, "msgData":[B
    invoke-static {v1, v5, v0}, Lcom/netease/push/proto/ProtoClientWrapper;->Uint16ToBytes([BII)V

    .line 186
    aput-byte v3, v1, v3

    .line 187
    const/4 v2, 0x3

    iget-byte v3, p0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->type:B

    aput-byte v3, v1, v2

    .line 189
    iget-object v2, p0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->data:[B

    if-eqz v2, :cond_1

    .line 190
    iget-object v2, p0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->data:[B

    const/4 v3, 0x4

    iget-object v4, p0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->data:[B

    array-length v4, v4

    invoke-static {v2, v5, v1, v3, v4}, Ljava/lang/System;->arraycopy(Ljava/lang/Object;ILjava/lang/Object;II)V

    .line 192
    :cond_1
    return-object v1
.end method

.method public UnmarshalPacket([B)I
    .locals 4
    .param p1, "_data"    # [B

    .prologue
    const/4 v3, 0x4

    const/4 v0, 0x0

    .line 198
    array-length v1, p1

    if-ge v1, v3, :cond_0

    .line 200
    const-string v1, "AndroidPush"

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "data error:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 208
    :goto_0
    return v0

    .line 203
    :cond_0
    invoke-static {p1, v0}, Lcom/netease/push/proto/ProtoClientWrapper;->BytesToUint16([BI)I

    move-result v1

    iput v1, p0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->length:I

    .line 204
    const/4 v1, 0x2

    aget-byte v1, p1, v1

    iput-byte v1, p0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->version:B

    .line 205
    const/4 v1, 0x3

    aget-byte v1, p1, v1

    iput-byte v1, p0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->type:B

    .line 206
    array-length v1, p1

    add-int/lit8 v1, v1, -0x4

    new-array v1, v1, [B

    iput-object v1, p0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->data:[B

    .line 207
    iget-object v1, p0, Lcom/netease/push/proto/ProtoClientWrapper$Packet;->data:[B

    array-length v2, p1

    add-int/lit8 v2, v2, -0x4

    invoke-static {p1, v3, v1, v0, v2}, Ljava/lang/System;->arraycopy(Ljava/lang/Object;ILjava/lang/Object;II)V

    .line 208
    const/4 v0, 0x1

    goto :goto_0
.end method
