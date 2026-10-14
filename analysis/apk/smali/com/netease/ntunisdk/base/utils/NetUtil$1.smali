.class final Lcom/netease/ntunisdk/base/utils/NetUtil$1;
.super Ljava/lang/Object;
.source "NetUtil.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/ntunisdk/base/utils/NetUtil;->wget(Ljava/lang/String;Lcom/netease/ntunisdk/base/utils/WgetDoneCallback;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x8
    name = null
.end annotation


# instance fields
.field final synthetic val$cb:Lcom/netease/ntunisdk/base/utils/WgetDoneCallback;

.field final synthetic val$urlStr:Ljava/lang/String;


# direct methods
.method constructor <init>(Ljava/lang/String;Lcom/netease/ntunisdk/base/utils/WgetDoneCallback;)V
    .locals 0

    .prologue
    .line 33
    iput-object p1, p0, Lcom/netease/ntunisdk/base/utils/NetUtil$1;->val$urlStr:Ljava/lang/String;

    iput-object p2, p0, Lcom/netease/ntunisdk/base/utils/NetUtil$1;->val$cb:Lcom/netease/ntunisdk/base/utils/WgetDoneCallback;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 12

    .prologue
    .line 36
    const/4 v7, 0x0

    .line 37
    .local v7, "result":Ljava/lang/String;
    const/4 v9, 0x0

    .line 38
    .local v9, "url":Ljava/net/URL;
    const/4 v2, 0x0

    .line 39
    .local v2, "connection":Ljava/net/HttpURLConnection;
    const/4 v4, 0x0

    .line 41
    .local v4, "in":Ljava/io/InputStreamReader;
    :try_start_0
    new-instance v10, Ljava/net/URL;

    iget-object v11, p0, Lcom/netease/ntunisdk/base/utils/NetUtil$1;->val$urlStr:Ljava/lang/String;

    invoke-direct {v10, v11}, Ljava/net/URL;-><init>(Ljava/lang/String;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_4
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    .line 42
    .end local v9    # "url":Ljava/net/URL;
    .local v10, "url":Ljava/net/URL;
    :try_start_1
    invoke-virtual {v10}, Ljava/net/URL;->openConnection()Ljava/net/URLConnection;

    move-result-object v11

    move-object v0, v11

    check-cast v0, Ljava/net/HttpURLConnection;

    move-object v2, v0

    .line 43
    new-instance v5, Ljava/io/InputStreamReader;

    invoke-virtual {v2}, Ljava/net/HttpURLConnection;->getInputStream()Ljava/io/InputStream;

    move-result-object v11

    invoke-direct {v5, v11}, Ljava/io/InputStreamReader;-><init>(Ljava/io/InputStream;)V
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_5
    .catchall {:try_start_1 .. :try_end_1} :catchall_1

    .line 44
    .end local v4    # "in":Ljava/io/InputStreamReader;
    .local v5, "in":Ljava/io/InputStreamReader;
    :try_start_2
    new-instance v1, Ljava/io/BufferedReader;

    invoke-direct {v1, v5}, Ljava/io/BufferedReader;-><init>(Ljava/io/Reader;)V

    .line 45
    .local v1, "bufferedReader":Ljava/io/BufferedReader;
    new-instance v8, Ljava/lang/StringBuffer;

    invoke-direct {v8}, Ljava/lang/StringBuffer;-><init>()V

    .line 46
    .local v8, "strBuffer":Ljava/lang/StringBuffer;
    const/4 v6, 0x0

    .line 47
    .local v6, "line":Ljava/lang/String;
    :goto_0
    invoke-virtual {v1}, Ljava/io/BufferedReader;->readLine()Ljava/lang/String;

    move-result-object v6

    if-eqz v6, :cond_3

    .line 48
    invoke-virtual {v8, v6}, Ljava/lang/StringBuffer;->append(Ljava/lang/String;)Ljava/lang/StringBuffer;
    :try_end_2
    .catch Ljava/lang/Exception; {:try_start_2 .. :try_end_2} :catch_0
    .catchall {:try_start_2 .. :try_end_2} :catchall_2

    goto :goto_0

    .line 51
    .end local v1    # "bufferedReader":Ljava/io/BufferedReader;
    .end local v6    # "line":Ljava/lang/String;
    .end local v8    # "strBuffer":Ljava/lang/StringBuffer;
    :catch_0
    move-exception v3

    move-object v4, v5

    .end local v5    # "in":Ljava/io/InputStreamReader;
    .restart local v4    # "in":Ljava/io/InputStreamReader;
    move-object v9, v10

    .line 52
    .end local v10    # "url":Ljava/net/URL;
    .local v3, "e":Ljava/lang/Exception;
    .restart local v9    # "url":Ljava/net/URL;
    :goto_1
    :try_start_3
    invoke-virtual {v3}, Ljava/lang/Exception;->printStackTrace()V
    :try_end_3
    .catchall {:try_start_3 .. :try_end_3} :catchall_0

    .line 54
    if-eqz v2, :cond_0

    .line 55
    invoke-virtual {v2}, Ljava/net/HttpURLConnection;->disconnect()V

    .line 57
    :cond_0
    if-eqz v4, :cond_1

    .line 59
    :try_start_4
    invoke-virtual {v4}, Ljava/io/InputStreamReader;->close()V
    :try_end_4
    .catch Ljava/io/IOException; {:try_start_4 .. :try_end_4} :catch_2

    .line 66
    .end local v3    # "e":Ljava/lang/Exception;
    :cond_1
    :goto_2
    iget-object v11, p0, Lcom/netease/ntunisdk/base/utils/NetUtil$1;->val$cb:Lcom/netease/ntunisdk/base/utils/WgetDoneCallback;

    if-eqz v11, :cond_2

    .line 67
    iget-object v11, p0, Lcom/netease/ntunisdk/base/utils/NetUtil$1;->val$cb:Lcom/netease/ntunisdk/base/utils/WgetDoneCallback;

    invoke-interface {v11, v7}, Lcom/netease/ntunisdk/base/utils/WgetDoneCallback;->ProcessResult(Ljava/lang/String;)V

    .line 69
    :cond_2
    return-void

    .line 50
    .end local v4    # "in":Ljava/io/InputStreamReader;
    .end local v9    # "url":Ljava/net/URL;
    .restart local v1    # "bufferedReader":Ljava/io/BufferedReader;
    .restart local v5    # "in":Ljava/io/InputStreamReader;
    .restart local v6    # "line":Ljava/lang/String;
    .restart local v8    # "strBuffer":Ljava/lang/StringBuffer;
    .restart local v10    # "url":Ljava/net/URL;
    :cond_3
    :try_start_5
    invoke-virtual {v8}, Ljava/lang/StringBuffer;->toString()Ljava/lang/String;
    :try_end_5
    .catch Ljava/lang/Exception; {:try_start_5 .. :try_end_5} :catch_0
    .catchall {:try_start_5 .. :try_end_5} :catchall_2

    move-result-object v7

    .line 54
    if-eqz v2, :cond_4

    .line 55
    invoke-virtual {v2}, Ljava/net/HttpURLConnection;->disconnect()V

    .line 57
    :cond_4
    if-eqz v5, :cond_7

    .line 59
    :try_start_6
    invoke-virtual {v5}, Ljava/io/InputStreamReader;->close()V
    :try_end_6
    .catch Ljava/io/IOException; {:try_start_6 .. :try_end_6} :catch_1

    move-object v4, v5

    .end local v5    # "in":Ljava/io/InputStreamReader;
    .restart local v4    # "in":Ljava/io/InputStreamReader;
    move-object v9, v10

    .line 62
    .end local v10    # "url":Ljava/net/URL;
    .restart local v9    # "url":Ljava/net/URL;
    goto :goto_2

    .line 60
    .end local v4    # "in":Ljava/io/InputStreamReader;
    .end local v9    # "url":Ljava/net/URL;
    .restart local v5    # "in":Ljava/io/InputStreamReader;
    .restart local v10    # "url":Ljava/net/URL;
    :catch_1
    move-exception v3

    .line 61
    .local v3, "e":Ljava/io/IOException;
    invoke-virtual {v3}, Ljava/io/IOException;->printStackTrace()V

    move-object v4, v5

    .end local v5    # "in":Ljava/io/InputStreamReader;
    .restart local v4    # "in":Ljava/io/InputStreamReader;
    move-object v9, v10

    .line 62
    .end local v10    # "url":Ljava/net/URL;
    .restart local v9    # "url":Ljava/net/URL;
    goto :goto_2

    .line 60
    .end local v1    # "bufferedReader":Ljava/io/BufferedReader;
    .end local v6    # "line":Ljava/lang/String;
    .end local v8    # "strBuffer":Ljava/lang/StringBuffer;
    .local v3, "e":Ljava/lang/Exception;
    :catch_2
    move-exception v3

    .line 61
    .local v3, "e":Ljava/io/IOException;
    invoke-virtual {v3}, Ljava/io/IOException;->printStackTrace()V

    goto :goto_2

    .line 54
    .end local v3    # "e":Ljava/io/IOException;
    :catchall_0
    move-exception v11

    :goto_3
    if-eqz v2, :cond_5

    .line 55
    invoke-virtual {v2}, Ljava/net/HttpURLConnection;->disconnect()V

    .line 57
    :cond_5
    if-eqz v4, :cond_6

    .line 59
    :try_start_7
    invoke-virtual {v4}, Ljava/io/InputStreamReader;->close()V
    :try_end_7
    .catch Ljava/io/IOException; {:try_start_7 .. :try_end_7} :catch_3

    .line 62
    :cond_6
    :goto_4
    throw v11

    .line 60
    :catch_3
    move-exception v3

    .line 61
    .restart local v3    # "e":Ljava/io/IOException;
    invoke-virtual {v3}, Ljava/io/IOException;->printStackTrace()V

    goto :goto_4

    .line 54
    .end local v3    # "e":Ljava/io/IOException;
    .end local v9    # "url":Ljava/net/URL;
    .restart local v10    # "url":Ljava/net/URL;
    :catchall_1
    move-exception v11

    move-object v9, v10

    .end local v10    # "url":Ljava/net/URL;
    .restart local v9    # "url":Ljava/net/URL;
    goto :goto_3

    .end local v4    # "in":Ljava/io/InputStreamReader;
    .end local v9    # "url":Ljava/net/URL;
    .restart local v5    # "in":Ljava/io/InputStreamReader;
    .restart local v10    # "url":Ljava/net/URL;
    :catchall_2
    move-exception v11

    move-object v4, v5

    .end local v5    # "in":Ljava/io/InputStreamReader;
    .restart local v4    # "in":Ljava/io/InputStreamReader;
    move-object v9, v10

    .end local v10    # "url":Ljava/net/URL;
    .restart local v9    # "url":Ljava/net/URL;
    goto :goto_3

    .line 51
    :catch_4
    move-exception v3

    goto :goto_1

    .end local v9    # "url":Ljava/net/URL;
    .restart local v10    # "url":Ljava/net/URL;
    :catch_5
    move-exception v3

    move-object v9, v10

    .end local v10    # "url":Ljava/net/URL;
    .restart local v9    # "url":Ljava/net/URL;
    goto :goto_1

    .end local v4    # "in":Ljava/io/InputStreamReader;
    .end local v9    # "url":Ljava/net/URL;
    .restart local v1    # "bufferedReader":Ljava/io/BufferedReader;
    .restart local v5    # "in":Ljava/io/InputStreamReader;
    .restart local v6    # "line":Ljava/lang/String;
    .restart local v8    # "strBuffer":Ljava/lang/StringBuffer;
    .restart local v10    # "url":Ljava/net/URL;
    :cond_7
    move-object v4, v5

    .end local v5    # "in":Ljava/io/InputStreamReader;
    .restart local v4    # "in":Ljava/io/InputStreamReader;
    move-object v9, v10

    .end local v10    # "url":Ljava/net/URL;
    .restart local v9    # "url":Ljava/net/URL;
    goto :goto_2
.end method
