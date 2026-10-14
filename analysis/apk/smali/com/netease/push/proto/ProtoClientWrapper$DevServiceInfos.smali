.class public Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;
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
    name = "DevServiceInfos"
.end annotation


# instance fields
.field public id:Ljava/lang/String;

.field public serviceInfos:[Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;

.field public ver:Ljava/lang/String;


# direct methods
.method public constructor <init>()V
    .locals 0

    .prologue
    .line 277
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public static unmarshalDevServiceInfos([B)Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;
    .locals 8
    .param p0, "data"    # [B
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/Exception;
        }
    .end annotation

    .prologue
    .line 303
    new-instance v0, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;

    invoke-direct {v0}, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;-><init>()V

    .line 307
    .local v0, "devServiceInfos":Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;
    :try_start_0
    invoke-static {p0}, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->parseFrom([B)Lcom/netease/push/proto/ProtoClient$PbLoginInfo;

    move-result-object v4

    .line 308
    .local v4, "pbLoginInfo":Lcom/netease/push/proto/ProtoClient$PbLoginInfo;
    iget-object v5, v4, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->id:Ljava/lang/String;

    iput-object v5, v0, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;->id:Ljava/lang/String;

    .line 309
    iget-object v5, v4, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->ver:Ljava/lang/String;

    iput-object v5, v0, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;->ver:Ljava/lang/String;

    .line 312
    iget-object v5, v4, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->serviceinfos:[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    array-length v3, v5

    .line 313
    .local v3, "length":I
    new-array v5, v3, [Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;

    iput-object v5, v0, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;->serviceInfos:[Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;

    .line 314
    const/4 v2, 0x0

    .local v2, "i":I
    :goto_0
    if-lt v2, v3, :cond_0

    .line 325
    return-object v0

    .line 315
    :cond_0
    iget-object v5, v0, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;->serviceInfos:[Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;

    aget-object v5, v5, v2

    iget-object v6, v4, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->serviceinfos:[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    aget-object v6, v6, v2

    iget-object v6, v6, Lcom/netease/push/proto/ProtoClient$PbServiceInfo;->service:Ljava/lang/String;

    iput-object v6, v5, Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;->service:Ljava/lang/String;

    .line 316
    iget-object v5, v0, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;->serviceInfos:[Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;

    aget-object v5, v5, v2

    iget-object v6, v4, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->serviceinfos:[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    aget-object v6, v6, v2

    iget-wide v6, v6, Lcom/netease/push/proto/ProtoClient$PbServiceInfo;->time:J

    iput-wide v6, v5, Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;->time:J
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 314
    add-int/lit8 v2, v2, 0x1

    goto :goto_0

    .line 319
    .end local v2    # "i":I
    .end local v3    # "length":I
    .end local v4    # "pbLoginInfo":Lcom/netease/push/proto/ProtoClient$PbLoginInfo;
    :catch_0
    move-exception v1

    .line 321
    .local v1, "e":Ljava/lang/Exception;
    const-string v5, "AndroidPush"

    new-instance v6, Ljava/lang/StringBuilder;

    const-string v7, "parse data devserviceinfos error:"

    invoke-direct {v6, v7}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-static {p0}, Ljava/util/Arrays;->toString([B)Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v6

    invoke-static {v5, v6}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 322
    throw v1
.end method


# virtual methods
.method public Marshal()[B
    .locals 7

    .prologue
    .line 285
    new-instance v3, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;

    invoke-direct {v3}, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;-><init>()V

    .line 286
    .local v3, "pbLoginInfo":Lcom/netease/push/proto/ProtoClient$PbLoginInfo;
    iget-object v4, p0, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;->id:Ljava/lang/String;

    iput-object v4, v3, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->id:Ljava/lang/String;

    .line 287
    iget-object v4, p0, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;->ver:Ljava/lang/String;

    iput-object v4, v3, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->ver:Ljava/lang/String;

    .line 289
    iget-object v4, p0, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;->serviceInfos:[Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;

    array-length v2, v4

    .line 290
    .local v2, "length":I
    new-array v4, v2, [Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    iput-object v4, v3, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->serviceinfos:[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    .line 291
    const/4 v1, 0x0

    .local v1, "i":I
    :goto_0
    if-lt v1, v2, :cond_0

    .line 297
    invoke-static {v3}, Lcom/google/protobuf/nano/MessageNano;->toByteArray(Lcom/google/protobuf/nano/MessageNano;)[B

    move-result-object v0

    .line 298
    .local v0, "data":[B
    return-object v0

    .line 292
    .end local v0    # "data":[B
    :cond_0
    iget-object v4, v3, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->serviceinfos:[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    new-instance v5, Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    invoke-direct {v5}, Lcom/netease/push/proto/ProtoClient$PbServiceInfo;-><init>()V

    aput-object v5, v4, v1

    .line 293
    iget-object v4, v3, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->serviceinfos:[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    aget-object v4, v4, v1

    new-instance v5, Ljava/lang/String;

    iget-object v6, p0, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;->serviceInfos:[Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;

    aget-object v6, v6, v1

    iget-object v6, v6, Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;->service:Ljava/lang/String;

    invoke-direct {v5, v6}, Ljava/lang/String;-><init>(Ljava/lang/String;)V

    iput-object v5, v4, Lcom/netease/push/proto/ProtoClient$PbServiceInfo;->service:Ljava/lang/String;

    .line 294
    iget-object v4, v3, Lcom/netease/push/proto/ProtoClient$PbLoginInfo;->serviceinfos:[Lcom/netease/push/proto/ProtoClient$PbServiceInfo;

    aget-object v4, v4, v1

    iget-object v5, p0, Lcom/netease/push/proto/ProtoClientWrapper$DevServiceInfos;->serviceInfos:[Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;

    aget-object v5, v5, v1

    iget-wide v5, v5, Lcom/netease/push/proto/ProtoClientWrapper$ServiceInfo;->time:J

    iput-wide v5, v4, Lcom/netease/push/proto/ProtoClient$PbServiceInfo;->time:J

    .line 291
    add-int/lit8 v1, v1, 0x1

    goto :goto_0
.end method
