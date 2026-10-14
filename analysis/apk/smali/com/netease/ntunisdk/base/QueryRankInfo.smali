.class public Lcom/netease/ntunisdk/base/QueryRankInfo;
.super Ljava/lang/Object;
.source "QueryRankInfo.java"


# static fields
.field public static final QUERY_RANK_SCOPE_ALL:Ljava/lang/String; = "QUERY_RANK_SCOPE_ALL"

.field public static final QUERY_RANK_SCOPE_FRIEND:Ljava/lang/String; = "QUERY_RANK_SCOPE_FRIEND"

.field public static final QUERY_RANK_TYPE_GRADE:Ljava/lang/String; = "QUERY_RANK_TYPE_GRADE"

.field public static final QUERY_RANK_TYPE_SCORE:Ljava/lang/String; = "QUERY_RANK_TYPE_SCORE"

.field private static final TAG:Ljava/lang/String; = "UniSDK QueryRankInfo"


# instance fields
.field private queryRankCount:I

.field private queryRankScope:Ljava/lang/String;

.field private queryRankType:Ljava/lang/String;


# direct methods
.method public constructor <init>()V
    .locals 1

    .prologue
    .line 15
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 39
    const/16 v0, 0xa

    iput v0, p0, Lcom/netease/ntunisdk/base/QueryRankInfo;->queryRankCount:I

    return-void
.end method

.method public static jsonStr2Obj(Ljava/lang/String;)Lcom/netease/ntunisdk/base/QueryRankInfo;
    .locals 8
    .param p0, "jsonStr"    # Ljava/lang/String;

    .prologue
    .line 93
    new-instance v2, Lcom/netease/ntunisdk/base/QueryRankInfo;

    invoke-direct {v2}, Lcom/netease/ntunisdk/base/QueryRankInfo;-><init>()V

    .line 94
    .local v2, "oi":Lcom/netease/ntunisdk/base/QueryRankInfo;
    invoke-static {p0}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v6

    if-eqz v6, :cond_0

    .line 111
    :goto_0
    return-object v2

    .line 99
    :cond_0
    :try_start_0
    new-instance v1, Lorg/json/JSONObject;

    invoke-direct {v1, p0}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    .line 100
    .local v1, "obj":Lorg/json/JSONObject;
    const-string v6, "queryRankType"

    invoke-virtual {v1, v6}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    .line 101
    .local v5, "queryRankType":Ljava/lang/String;
    const-string v6, "queryRankScope"

    invoke-virtual {v1, v6}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    .line 102
    .local v4, "queryRankScope":Ljava/lang/String;
    const-string v6, "queryRankCount"

    invoke-virtual {v1, v6}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v3

    .line 104
    .local v3, "queryRankCount":I
    invoke-virtual {v2, v5}, Lcom/netease/ntunisdk/base/QueryRankInfo;->setQueryRankType(Ljava/lang/String;)V

    .line 105
    invoke-virtual {v2, v4}, Lcom/netease/ntunisdk/base/QueryRankInfo;->setQueryRankScope(Ljava/lang/String;)V

    .line 106
    invoke-virtual {v2, v3}, Lcom/netease/ntunisdk/base/QueryRankInfo;->setQueryRankCount(I)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    .line 107
    .end local v1    # "obj":Lorg/json/JSONObject;
    .end local v3    # "queryRankCount":I
    .end local v4    # "queryRankScope":Ljava/lang/String;
    .end local v5    # "queryRankType":Ljava/lang/String;
    :catch_0
    move-exception v0

    .line 108
    .local v0, "e":Ljava/lang/Exception;
    const-string v6, "UniSDK QueryRankInfo"

    const-string v7, "jsonStr2Obj error"

    invoke-static {v6, v7}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 109
    invoke-virtual {v0}, Ljava/lang/Exception;->printStackTrace()V

    goto :goto_0
.end method


# virtual methods
.method public getQueryRankCount()I
    .locals 1

    .prologue
    .line 78
    iget v0, p0, Lcom/netease/ntunisdk/base/QueryRankInfo;->queryRankCount:I

    return v0
.end method

.method public getQueryRankScope()Ljava/lang/String;
    .locals 1

    .prologue
    .line 62
    iget-object v0, p0, Lcom/netease/ntunisdk/base/QueryRankInfo;->queryRankScope:Ljava/lang/String;

    return-object v0
.end method

.method public getQueryRankType()Ljava/lang/String;
    .locals 1

    .prologue
    .line 46
    iget-object v0, p0, Lcom/netease/ntunisdk/base/QueryRankInfo;->queryRankType:Ljava/lang/String;

    return-object v0
.end method

.method public setQueryRankCount(I)V
    .locals 0
    .param p1, "queryRankCount"    # I

    .prologue
    .line 86
    iput p1, p0, Lcom/netease/ntunisdk/base/QueryRankInfo;->queryRankCount:I

    .line 87
    return-void
.end method

.method public setQueryRankScope(Ljava/lang/String;)V
    .locals 0
    .param p1, "queryRankScope"    # Ljava/lang/String;

    .prologue
    .line 70
    iput-object p1, p0, Lcom/netease/ntunisdk/base/QueryRankInfo;->queryRankScope:Ljava/lang/String;

    .line 71
    return-void
.end method

.method public setQueryRankType(Ljava/lang/String;)V
    .locals 0
    .param p1, "queryRankType"    # Ljava/lang/String;

    .prologue
    .line 54
    iput-object p1, p0, Lcom/netease/ntunisdk/base/QueryRankInfo;->queryRankType:Ljava/lang/String;

    .line 55
    return-void
.end method
