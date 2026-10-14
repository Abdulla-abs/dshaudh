.class public Lcom/netease/ntunisdk/base/AccountInfo;
.super Ljava/lang/Object;
.source "AccountInfo.java"


# static fields
.field private static final TAG:Ljava/lang/String; = "UniSDK AccountInfo"

.field public static final UNKNOWN:Ljava/lang/String; = "unknown"


# instance fields
.field private accountId:Ljava/lang/String;

.field private icon:Ljava/lang/String;

.field private idType:Ljava/lang/String;

.field private inGame:Z

.field private nickname:Ljava/lang/String;

.field private rank:J

.field private rankScore:D

.field private relationType:Ljava/lang/String;

.field private remark:Ljava/lang/String;

.field private statusMessage:Ljava/lang/String;


# direct methods
.method public constructor <init>()V
    .locals 0

    .prologue
    .line 73
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 75
    return-void
.end method

.method public constructor <init>(Ljava/lang/String;)V
    .locals 2
    .param p1, "accountId"    # Ljava/lang/String;

    .prologue
    .line 81
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 82
    invoke-virtual {p0, p1}, Lcom/netease/ntunisdk/base/AccountInfo;->setAccountId(Ljava/lang/String;)V

    .line 83
    const-string v0, "unknown"

    invoke-virtual {p0, v0}, Lcom/netease/ntunisdk/base/AccountInfo;->setIdType(Ljava/lang/String;)V

    .line 84
    const-string v0, "unknown"

    invoke-virtual {p0, v0}, Lcom/netease/ntunisdk/base/AccountInfo;->setNickname(Ljava/lang/String;)V

    .line 85
    const-string v0, "unknown"

    invoke-virtual {p0, v0}, Lcom/netease/ntunisdk/base/AccountInfo;->setIcon(Ljava/lang/String;)V

    .line 86
    const/4 v0, 0x0

    invoke-virtual {p0, v0}, Lcom/netease/ntunisdk/base/AccountInfo;->setInGame(Z)V

    .line 87
    const-wide/16 v0, 0x0

    invoke-virtual {p0, v0, v1}, Lcom/netease/ntunisdk/base/AccountInfo;->setRankScore(D)V

    .line 88
    const-wide/16 v0, 0x0

    invoke-virtual {p0, v0, v1}, Lcom/netease/ntunisdk/base/AccountInfo;->setRank(J)V

    .line 89
    const-string v0, ""

    invoke-virtual {p0, v0}, Lcom/netease/ntunisdk/base/AccountInfo;->setRemark(Ljava/lang/String;)V

    .line 90
    return-void
.end method

.method public static json2Str(Lcom/netease/ntunisdk/base/AccountInfo;)Ljava/lang/String;
    .locals 1
    .param p0, "account"    # Lcom/netease/ntunisdk/base/AccountInfo;

    .prologue
    .line 246
    invoke-static {p0}, Lcom/netease/ntunisdk/base/AccountInfo;->obj2Json(Lcom/netease/ntunisdk/base/AccountInfo;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-virtual {v0}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public static obj2Json(Lcom/netease/ntunisdk/base/AccountInfo;)Lorg/json/JSONObject;
    .locals 5
    .param p0, "account"    # Lcom/netease/ntunisdk/base/AccountInfo;

    .prologue
    .line 253
    new-instance v1, Lorg/json/JSONObject;

    invoke-direct {v1}, Lorg/json/JSONObject;-><init>()V

    .line 254
    .local v1, "jdata":Lorg/json/JSONObject;
    if-nez p0, :cond_0

    .line 271
    :goto_0
    return-object v1

    .line 258
    :cond_0
    :try_start_0
    const-string v2, "accountId"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/AccountInfo;->getAccountId()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 259
    const-string v2, "idType"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/AccountInfo;->getIdType()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 260
    const-string v2, "relationType"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/AccountInfo;->getRelationType()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 261
    const-string v2, "nickname"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/AccountInfo;->getNickname()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 262
    const-string v2, "icon"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/AccountInfo;->getIcon()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 263
    const-string v2, "inGame"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/AccountInfo;->isInGame()Z

    move-result v3

    invoke-virtual {v1, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;Z)Lorg/json/JSONObject;

    .line 264
    const-string v2, "rankScore"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/AccountInfo;->getRankScore()D

    move-result-wide v3

    invoke-virtual {v1, v2, v3, v4}, Lorg/json/JSONObject;->put(Ljava/lang/String;D)Lorg/json/JSONObject;

    .line 265
    const-string v2, "rank"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/AccountInfo;->getRank()J

    move-result-wide v3

    invoke-virtual {v1, v2, v3, v4}, Lorg/json/JSONObject;->put(Ljava/lang/String;J)Lorg/json/JSONObject;

    .line 266
    const-string v2, "remark"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/AccountInfo;->getRemark()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    .line 267
    :catch_0
    move-exception v0

    .line 268
    .local v0, "e":Lorg/json/JSONException;
    const-string v2, "UniSDK AccountInfo"

    const-string v3, "obj2Json error"

    invoke-static {v2, v3}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 269
    invoke-virtual {v0}, Lorg/json/JSONException;->printStackTrace()V

    goto :goto_0
.end method


# virtual methods
.method public getAccountId()Ljava/lang/String;
    .locals 1

    .prologue
    .line 98
    iget-object v0, p0, Lcom/netease/ntunisdk/base/AccountInfo;->accountId:Ljava/lang/String;

    return-object v0
.end method

.method public getIcon()Ljava/lang/String;
    .locals 1

    .prologue
    .line 157
    iget-object v0, p0, Lcom/netease/ntunisdk/base/AccountInfo;->icon:Ljava/lang/String;

    return-object v0
.end method

.method public getIdType()Ljava/lang/String;
    .locals 1

    .prologue
    .line 115
    iget-object v0, p0, Lcom/netease/ntunisdk/base/AccountInfo;->idType:Ljava/lang/String;

    return-object v0
.end method

.method public getNickname()Ljava/lang/String;
    .locals 1

    .prologue
    .line 139
    iget-object v0, p0, Lcom/netease/ntunisdk/base/AccountInfo;->nickname:Ljava/lang/String;

    return-object v0
.end method

.method public getRank()J
    .locals 2

    .prologue
    .line 210
    iget-wide v0, p0, Lcom/netease/ntunisdk/base/AccountInfo;->rank:J

    return-wide v0
.end method

.method public getRankScore()D
    .locals 2

    .prologue
    .line 193
    iget-wide v0, p0, Lcom/netease/ntunisdk/base/AccountInfo;->rankScore:D

    return-wide v0
.end method

.method public getRelationType()Ljava/lang/String;
    .locals 1

    .prologue
    .line 127
    iget-object v0, p0, Lcom/netease/ntunisdk/base/AccountInfo;->relationType:Ljava/lang/String;

    return-object v0
.end method

.method public getRemark()Ljava/lang/String;
    .locals 1

    .prologue
    .line 226
    iget-object v0, p0, Lcom/netease/ntunisdk/base/AccountInfo;->remark:Ljava/lang/String;

    return-object v0
.end method

.method public getStatusMessage()Ljava/lang/String;
    .locals 1

    .prologue
    .line 238
    iget-object v0, p0, Lcom/netease/ntunisdk/base/AccountInfo;->statusMessage:Ljava/lang/String;

    return-object v0
.end method

.method public isInGame()Z
    .locals 1

    .prologue
    .line 175
    iget-boolean v0, p0, Lcom/netease/ntunisdk/base/AccountInfo;->inGame:Z

    return v0
.end method

.method public setAccountId(Ljava/lang/String;)V
    .locals 0
    .param p1, "accountId"    # Ljava/lang/String;

    .prologue
    .line 107
    iput-object p1, p0, Lcom/netease/ntunisdk/base/AccountInfo;->accountId:Ljava/lang/String;

    .line 108
    return-void
.end method

.method public setIcon(Ljava/lang/String;)V
    .locals 0
    .param p1, "icon"    # Ljava/lang/String;

    .prologue
    .line 166
    iput-object p1, p0, Lcom/netease/ntunisdk/base/AccountInfo;->icon:Ljava/lang/String;

    .line 167
    return-void
.end method

.method public setIdType(Ljava/lang/String;)V
    .locals 0
    .param p1, "idType"    # Ljava/lang/String;

    .prologue
    .line 123
    iput-object p1, p0, Lcom/netease/ntunisdk/base/AccountInfo;->idType:Ljava/lang/String;

    .line 124
    return-void
.end method

.method public setInGame(Z)V
    .locals 0
    .param p1, "inGame"    # Z

    .prologue
    .line 184
    iput-boolean p1, p0, Lcom/netease/ntunisdk/base/AccountInfo;->inGame:Z

    .line 185
    return-void
.end method

.method public setNickname(Ljava/lang/String;)V
    .locals 0
    .param p1, "nickname"    # Ljava/lang/String;

    .prologue
    .line 148
    iput-object p1, p0, Lcom/netease/ntunisdk/base/AccountInfo;->nickname:Ljava/lang/String;

    .line 149
    return-void
.end method

.method public setRank(J)V
    .locals 0
    .param p1, "rank"    # J

    .prologue
    .line 218
    iput-wide p1, p0, Lcom/netease/ntunisdk/base/AccountInfo;->rank:J

    .line 219
    return-void
.end method

.method public setRankScore(D)V
    .locals 0
    .param p1, "rankScore"    # D

    .prologue
    .line 202
    iput-wide p1, p0, Lcom/netease/ntunisdk/base/AccountInfo;->rankScore:D

    .line 203
    return-void
.end method

.method public setRelationType(Ljava/lang/String;)V
    .locals 0
    .param p1, "relationType"    # Ljava/lang/String;

    .prologue
    .line 130
    iput-object p1, p0, Lcom/netease/ntunisdk/base/AccountInfo;->relationType:Ljava/lang/String;

    .line 131
    return-void
.end method

.method public setRemark(Ljava/lang/String;)V
    .locals 0
    .param p1, "remark"    # Ljava/lang/String;

    .prologue
    .line 234
    iput-object p1, p0, Lcom/netease/ntunisdk/base/AccountInfo;->remark:Ljava/lang/String;

    .line 235
    return-void
.end method

.method public setStatusMessage(Ljava/lang/String;)V
    .locals 0
    .param p1, "statusMessage"    # Ljava/lang/String;

    .prologue
    .line 242
    iput-object p1, p0, Lcom/netease/ntunisdk/base/AccountInfo;->statusMessage:Ljava/lang/String;

    .line 243
    return-void
.end method
