.class public Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;
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
    name = "DevServiceInfo"
.end annotation


# instance fields
.field public id:Ljava/lang/String;

.field public service:Ljava/lang/String;

.field public time:J


# direct methods
.method public constructor <init>()V
    .locals 0

    .prologue
    .line 330
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public static unmarshalDevServiceInfo([B)Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;
    .locals 6
    .param p0, "data"    # [B
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/Exception;
        }
    .end annotation

    .prologue
    .line 349
    new-instance v0, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;

    invoke-direct {v0}, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;-><init>()V

    .line 353
    .local v0, "devServiceInfo":Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;
    :try_start_0
    invoke-static {p0}, Lcom/netease/push/proto/ProtoClient$PbDevServiceInfo;->parseFrom([B)Lcom/netease/push/proto/ProtoClient$PbDevServiceInfo;

    move-result-object v2

    .line 354
    .local v2, "pbDevServiceInfo":Lcom/netease/push/proto/ProtoClient$PbDevServiceInfo;
    iget-object v3, v2, Lcom/netease/push/proto/ProtoClient$PbDevServiceInfo;->id:Ljava/lang/String;

    iput-object v3, v0, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;->id:Ljava/lang/String;

    .line 355
    iget-object v3, v2, Lcom/netease/push/proto/ProtoClient$PbDevServiceInfo;->service:Ljava/lang/String;

    iput-object v3, v0, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;->service:Ljava/lang/String;

    .line 356
    iget-wide v3, v2, Lcom/netease/push/proto/ProtoClient$PbDevServiceInfo;->time:J

    iput-wide v3, v0, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;->time:J
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 364
    return-object v0

    .line 358
    .end local v2    # "pbDevServiceInfo":Lcom/netease/push/proto/ProtoClient$PbDevServiceInfo;
    :catch_0
    move-exception v1

    .line 360
    .local v1, "e":Ljava/lang/Exception;
    const-string v3, "AndroidPush"

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "parse data devserviceinfo error:"

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-static {p0}, Ljava/util/Arrays;->toString([B)Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v3, v4}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 361
    throw v1
.end method


# virtual methods
.method public Marshal()[B
    .locals 4

    .prologue
    .line 338
    new-instance v1, Lcom/netease/push/proto/ProtoClient$PbDevServiceInfo;

    invoke-direct {v1}, Lcom/netease/push/proto/ProtoClient$PbDevServiceInfo;-><init>()V

    .line 339
    .local v1, "pbDevServiceInfo":Lcom/netease/push/proto/ProtoClient$PbDevServiceInfo;
    iget-object v2, p0, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;->id:Ljava/lang/String;

    iput-object v2, v1, Lcom/netease/push/proto/ProtoClient$PbDevServiceInfo;->id:Ljava/lang/String;

    .line 340
    iget-object v2, p0, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;->service:Ljava/lang/String;

    iput-object v2, v1, Lcom/netease/push/proto/ProtoClient$PbDevServiceInfo;->service:Ljava/lang/String;

    .line 341
    iget-wide v2, p0, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfo;->time:J

    iput-wide v2, v1, Lcom/netease/push/proto/ProtoClient$PbDevServiceInfo;->time:J

    .line 343
    invoke-static {v1}, Lcom/google/protobuf/nano/MessageNano;->toByteArray(Lcom/google/protobuf/nano/MessageNano;)[B

    move-result-object v0

    .line 344
    .local v0, "data":[B
    return-object v0
.end method
