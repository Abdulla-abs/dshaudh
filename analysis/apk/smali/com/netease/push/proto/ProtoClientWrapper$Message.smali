.class public Lcom/netease/push/proto/ProtoClientWrapper$Message;
.super Ljava/lang/Object;
.source "ProtoClientWrapper.java"

# interfaces
.implements Lcom/netease/push/proto/ProtoClientWrapper$DataMarshal;


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/netease/push/proto/ProtoClientWrapper;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x9
    name = "Message"
.end annotation


# instance fields
.field public content:Ljava/lang/String;

.field public ext:Ljava/lang/String;

.field public mode:I

.field public packagename:Ljava/lang/String;

.field public service:Ljava/lang/String;

.field public time:J

.field public title:Ljava/lang/String;


# direct methods
.method public constructor <init>()V
    .locals 0

    .prologue
    .line 405
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public static UnmarshalMessage([B)Lcom/netease/push/proto/ProtoClientWrapper$Message;
    .locals 6
    .param p0, "data"    # [B
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/Exception;
        }
    .end annotation

    .prologue
    .line 438
    new-instance v1, Lcom/netease/push/proto/ProtoClientWrapper$Message;

    invoke-direct {v1}, Lcom/netease/push/proto/ProtoClientWrapper$Message;-><init>()V

    .line 441
    .local v1, "message":Lcom/netease/push/proto/ProtoClientWrapper$Message;
    :try_start_0
    invoke-static {p0}, Lcom/netease/push/proto/ProtoClient$PbMessage;->parseFrom([B)Lcom/netease/push/proto/ProtoClient$PbMessage;

    move-result-object v2

    .line 442
    .local v2, "pbMessage":Lcom/netease/push/proto/ProtoClient$PbMessage;
    iget-object v3, v2, Lcom/netease/push/proto/ProtoClient$PbMessage;->content:Ljava/lang/String;

    iput-object v3, v1, Lcom/netease/push/proto/ProtoClientWrapper$Message;->content:Ljava/lang/String;

    .line 443
    iget-wide v3, v2, Lcom/netease/push/proto/ProtoClient$PbMessage;->time:J

    iput-wide v3, v1, Lcom/netease/push/proto/ProtoClientWrapper$Message;->time:J

    .line 444
    iget-object v3, v2, Lcom/netease/push/proto/ProtoClient$PbMessage;->service:Ljava/lang/String;

    iput-object v3, v1, Lcom/netease/push/proto/ProtoClientWrapper$Message;->service:Ljava/lang/String;

    .line 445
    iget-object v3, v2, Lcom/netease/push/proto/ProtoClient$PbMessage;->packagename:Ljava/lang/String;

    iput-object v3, v1, Lcom/netease/push/proto/ProtoClientWrapper$Message;->packagename:Ljava/lang/String;

    .line 446
    iget v3, v2, Lcom/netease/push/proto/ProtoClient$PbMessage;->mode:I

    iput v3, v1, Lcom/netease/push/proto/ProtoClientWrapper$Message;->mode:I

    .line 447
    iget-object v3, v2, Lcom/netease/push/proto/ProtoClient$PbMessage;->ext:Ljava/lang/String;

    iput-object v3, v1, Lcom/netease/push/proto/ProtoClientWrapper$Message;->ext:Ljava/lang/String;

    .line 448
    iget-object v3, v2, Lcom/netease/push/proto/ProtoClient$PbMessage;->title:Ljava/lang/String;

    iput-object v3, v1, Lcom/netease/push/proto/ProtoClientWrapper$Message;->title:Ljava/lang/String;
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 456
    return-object v1

    .line 450
    .end local v2    # "pbMessage":Lcom/netease/push/proto/ProtoClient$PbMessage;
    :catch_0
    move-exception v0

    .line 452
    .local v0, "e":Ljava/lang/Exception;
    const-string v3, "AndroidPush"

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "parse data error:"

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-static {p0}, Ljava/util/Arrays;->toString([B)Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v3, v4}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 453
    throw v0
.end method


# virtual methods
.method public Marshal()[B
    .locals 4

    .prologue
    .line 423
    new-instance v1, Lcom/netease/push/proto/ProtoClient$PbMessage;

    invoke-direct {v1}, Lcom/netease/push/proto/ProtoClient$PbMessage;-><init>()V

    .line 424
    .local v1, "pbMessage":Lcom/netease/push/proto/ProtoClient$PbMessage;
    iget-object v2, p0, Lcom/netease/push/proto/ProtoClientWrapper$Message;->content:Ljava/lang/String;

    iput-object v2, v1, Lcom/netease/push/proto/ProtoClient$PbMessage;->content:Ljava/lang/String;

    .line 425
    iget-wide v2, p0, Lcom/netease/push/proto/ProtoClientWrapper$Message;->time:J

    iput-wide v2, v1, Lcom/netease/push/proto/ProtoClient$PbMessage;->time:J

    .line 426
    iget-object v2, p0, Lcom/netease/push/proto/ProtoClientWrapper$Message;->service:Ljava/lang/String;

    iput-object v2, v1, Lcom/netease/push/proto/ProtoClient$PbMessage;->service:Ljava/lang/String;

    .line 427
    iget-object v2, p0, Lcom/netease/push/proto/ProtoClientWrapper$Message;->packagename:Ljava/lang/String;

    iput-object v2, v1, Lcom/netease/push/proto/ProtoClient$PbMessage;->packagename:Ljava/lang/String;

    .line 428
    iget v2, p0, Lcom/netease/push/proto/ProtoClientWrapper$Message;->mode:I

    iput v2, v1, Lcom/netease/push/proto/ProtoClient$PbMessage;->mode:I

    .line 429
    iget-object v2, p0, Lcom/netease/push/proto/ProtoClientWrapper$Message;->ext:Ljava/lang/String;

    iput-object v2, v1, Lcom/netease/push/proto/ProtoClient$PbMessage;->ext:Ljava/lang/String;

    .line 430
    iget-object v2, p0, Lcom/netease/push/proto/ProtoClientWrapper$Message;->title:Ljava/lang/String;

    iput-object v2, v1, Lcom/netease/push/proto/ProtoClient$PbMessage;->title:Ljava/lang/String;

    .line 432
    invoke-static {v1}, Lcom/google/protobuf/nano/MessageNano;->toByteArray(Lcom/google/protobuf/nano/MessageNano;)[B

    move-result-object v0

    .line 433
    .local v0, "data":[B
    return-object v0
.end method
