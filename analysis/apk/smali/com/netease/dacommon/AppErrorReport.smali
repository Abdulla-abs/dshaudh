.class public Lcom/netease/dacommon/AppErrorReport;
.super Ljava/lang/Object;
.source "AppErrorReport.java"

# interfaces
.implements Ljava/lang/Thread$UncaughtExceptionHandler;


# static fields
.field private static final APP_ERROR_EXCEPTION:I = 0x2

.field private static final APP_ERROR_SIGNAL:I = 0x3

.field private static final APP_ERROR_TRACE:I = 0x1

.field private static INSTANCE:Lcom/netease/dacommon/AppErrorReport; = null

.field public static final TAG:Ljava/lang/String; = "CrashHandler"

.field private static basicinfo:Ljava/util/HashMap;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/HashMap",
            "<",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation
.end field

.field private static errorReportURL:Ljava/lang/String;

.field private static hasSendError:Z

.field private static userdesc:Ljava/util/HashMap;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/HashMap",
            "<",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation
.end field


# instance fields
.field private mContext:Landroid/content/Context;

.field private mDefaultHandler:Ljava/lang/Thread$UncaughtExceptionHandler;


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .prologue
    .line 18
    const/4 v0, 0x0

    sput-boolean v0, Lcom/netease/dacommon/AppErrorReport;->hasSendError:Z

    .line 20
    const-string v0, "http://clientdump.x.netease.com/upload/"

    sput-object v0, Lcom/netease/dacommon/AppErrorReport;->errorReportURL:Ljava/lang/String;

    .line 21
    new-instance v0, Ljava/util/HashMap;

    invoke-direct {v0}, Ljava/util/HashMap;-><init>()V

    sput-object v0, Lcom/netease/dacommon/AppErrorReport;->userdesc:Ljava/util/HashMap;

    .line 22
    new-instance v0, Ljava/util/HashMap;

    invoke-direct {v0}, Ljava/util/HashMap;-><init>()V

    sput-object v0, Lcom/netease/dacommon/AppErrorReport;->basicinfo:Ljava/util/HashMap;

    .line 33
    new-instance v0, Lcom/netease/dacommon/AppErrorReport;

    invoke-direct {v0}, Lcom/netease/dacommon/AppErrorReport;-><init>()V

    sput-object v0, Lcom/netease/dacommon/AppErrorReport;->INSTANCE:Lcom/netease/dacommon/AppErrorReport;

    return-void
.end method

.method private constructor <init>()V
    .locals 0

    .prologue
    .line 37
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 38
    return-void
.end method

.method private static dictionaryToString(Ljava/util/HashMap;Ljava/lang/String;)Ljava/lang/String;
    .locals 6
    .param p1, "delimiter"    # Ljava/lang/String;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/HashMap",
            "<",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            ">;",
            "Ljava/lang/String;",
            ")",
            "Ljava/lang/String;"
        }
    .end annotation

    .prologue
    .line 77
    .local p0, "map":Ljava/util/HashMap;, "Ljava/util/HashMap<Ljava/lang/String;Ljava/lang/String;>;"
    new-instance v3, Ljava/lang/StringBuffer;

    const-string v5, ""

    invoke-direct {v3, v5}, Ljava/lang/StringBuffer;-><init>(Ljava/lang/String;)V

    .line 78
    .local v3, "str":Ljava/lang/StringBuffer;
    invoke-virtual {p0}, Ljava/util/HashMap;->keySet()Ljava/util/Set;

    move-result-object v5

    invoke-interface {v5}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v1

    .line 79
    .local v1, "iterable":Ljava/util/Iterator;, "Ljava/util/Iterator<Ljava/lang/String;>;"
    const/4 v0, 0x1

    .line 80
    .local v0, "first":Z
    :goto_0
    invoke-interface {v1}, Ljava/util/Iterator;->hasNext()Z

    move-result v5

    if-eqz v5, :cond_1

    .line 81
    if-nez v0, :cond_0

    .line 82
    invoke-virtual {v3, p1}, Ljava/lang/StringBuffer;->append(Ljava/lang/String;)Ljava/lang/StringBuffer;

    .line 86
    :goto_1
    invoke-interface {v1}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Ljava/lang/String;

    .line 87
    .local v2, "key":Ljava/lang/String;
    invoke-virtual {p0, v2}, Ljava/util/HashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v4

    check-cast v4, Ljava/lang/String;

    .line 88
    .local v4, "value":Ljava/lang/String;
    invoke-virtual {v3, v2}, Ljava/lang/StringBuffer;->append(Ljava/lang/String;)Ljava/lang/StringBuffer;

    .line 89
    const/16 v5, 0x3a

    invoke-virtual {v3, v5}, Ljava/lang/StringBuffer;->append(C)Ljava/lang/StringBuffer;

    .line 90
    invoke-virtual {v3, v4}, Ljava/lang/StringBuffer;->append(Ljava/lang/String;)Ljava/lang/StringBuffer;

    goto :goto_0

    .line 84
    .end local v2    # "key":Ljava/lang/String;
    .end local v4    # "value":Ljava/lang/String;
    :cond_0
    const/4 v0, 0x0

    goto :goto_1

    .line 92
    :cond_1
    invoke-virtual {v3}, Ljava/lang/StringBuffer;->toString()Ljava/lang/String;

    move-result-object v5

    return-object v5
.end method

.method public static getInstance()Lcom/netease/dacommon/AppErrorReport;
    .locals 1

    .prologue
    .line 41
    sget-object v0, Lcom/netease/dacommon/AppErrorReport;->INSTANCE:Lcom/netease/dacommon/AppErrorReport;

    return-object v0
.end method

.method public static handleError(Ljava/lang/String;Ljava/lang/String;)V
    .locals 1
    .param p0, "type"    # Ljava/lang/String;
    .param p1, "msg"    # Ljava/lang/String;

    .prologue
    .line 69
    const/4 v0, 0x1

    invoke-static {v0}, Lcom/netease/dacommon/AppErrorReport;->setDumpType(I)V

    .line 70
    invoke-static {p0}, Lcom/netease/dacommon/AppErrorReport;->replaceInvalidChar(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    invoke-static {v0}, Lcom/netease/dacommon/AppErrorReport;->setDumpId(Ljava/lang/String;)V

    .line 71
    # Offline adapter: keep diagnostics local. A denied network permission in
    # the obsolete uploader otherwise throws out of JNI and kills GLThread.
    const-string v0, "DinoLocalError"
    invoke-static {v0, p0}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I
    invoke-static {v0, p1}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 73
    return-void
.end method

.method public static replaceInvalidChar(Ljava/lang/String;)Ljava/lang/String;
    .locals 3
    .param p0, "origin"    # Ljava/lang/String;

    .prologue
    const/16 v2, 0x5f

    .line 25
    const/16 v0, 0x2c

    invoke-virtual {p0, v0, v2}, Ljava/lang/String;->replace(CC)Ljava/lang/String;

    move-result-object v0

    const/16 v1, 0x3a

    invoke-virtual {v0, v1, v2}, Ljava/lang/String;->replace(CC)Ljava/lang/String;

    move-result-object v0

    const/16 v1, 0x20

    invoke-virtual {v0, v1, v2}, Ljava/lang/String;->replace(CC)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public static sendToServer(Ljava/lang/String;)V
    .locals 17
    .param p0, "detail"    # Ljava/lang/String;

    .prologue
    .line 96
    sget-boolean v12, Lcom/netease/dacommon/AppErrorReport;->hasSendError:Z

    if-eqz v12, :cond_1

    .line 154
    :cond_0
    :goto_0
    return-void

    .line 99
    :cond_1
    const/4 v12, 0x1

    sput-boolean v12, Lcom/netease/dacommon/AppErrorReport;->hasSendError:Z

    .line 100
    const-string v2, "whatever_this9is8just_be2unique"

    .line 101
    .local v2, "boundary":Ljava/lang/String;
    new-instance v4, Ljava/lang/StringBuffer;

    const-string v12, "--%s\r\n"

    const/4 v13, 0x1

    new-array v13, v13, [Ljava/lang/Object;

    const/4 v14, 0x0

    aput-object v2, v13, v14

    invoke-static {v12, v13}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v12

    invoke-direct {v4, v12}, Ljava/lang/StringBuffer;-><init>(Ljava/lang/String;)V

    .line 102
    .local v4, "content":Ljava/lang/StringBuffer;
    const-string v12, "Content-Disposition: form-data; name=\"game\";\r\n"

    invoke-virtual {v4, v12}, Ljava/lang/StringBuffer;->append(Ljava/lang/String;)Ljava/lang/StringBuffer;

    .line 103
    const-string v12, "Content-Type: text/plain;\r\n\r\n"

    invoke-virtual {v4, v12}, Ljava/lang/StringBuffer;->append(Ljava/lang/String;)Ljava/lang/StringBuffer;

    .line 104
    const-string v12, "h1\r\n"

    invoke-virtual {v4, v12}, Ljava/lang/StringBuffer;->append(Ljava/lang/String;)Ljava/lang/StringBuffer;

    .line 106
    sget-object v12, Lcom/netease/dacommon/AppErrorReport;->basicinfo:Ljava/util/HashMap;

    const-string v13, ","

    invoke-static {v12, v13}, Lcom/netease/dacommon/AppErrorReport;->dictionaryToString(Ljava/util/HashMap;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    .line 107
    .local v1, "basicinfoStr":Ljava/lang/String;
    invoke-virtual {v1}, Ljava/lang/String;->length()I

    move-result v12

    if-lez v12, :cond_0

    .line 110
    const-string v12, "--%s\r\n"

    const/4 v13, 0x1

    new-array v13, v13, [Ljava/lang/Object;

    const/4 v14, 0x0

    aput-object v2, v13, v14

    invoke-static {v12, v13}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v12

    invoke-virtual {v4, v12}, Ljava/lang/StringBuffer;->append(Ljava/lang/String;)Ljava/lang/StringBuffer;

    .line 111
    const-string v12, "Content-Disposition: form-data; name=\"basicinfo\";\r\n"

    invoke-virtual {v4, v12}, Ljava/lang/StringBuffer;->append(Ljava/lang/String;)Ljava/lang/StringBuffer;

    .line 112
    const-string v12, "Content-Type: text/plain;\r\n\r\n"

    invoke-virtual {v4, v12}, Ljava/lang/StringBuffer;->append(Ljava/lang/String;)Ljava/lang/StringBuffer;

    .line 113
    invoke-virtual {v4, v1}, Ljava/lang/StringBuffer;->append(Ljava/lang/String;)Ljava/lang/StringBuffer;

    .line 114
    const-string v12, "%s\r\n"

    const/4 v13, 0x1

    new-array v13, v13, [Ljava/lang/Object;

    const/4 v14, 0x0

    aput-object v1, v13, v14

    invoke-static {v12, v13}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v12

    invoke-virtual {v4, v12}, Ljava/lang/StringBuffer;->append(Ljava/lang/String;)Ljava/lang/StringBuffer;

    .line 116
    sget-object v12, Lcom/netease/dacommon/AppErrorReport;->userdesc:Ljava/util/HashMap;

    const-string v13, "\r\n"

    invoke-static {v12, v13}, Lcom/netease/dacommon/AppErrorReport;->dictionaryToString(Ljava/util/HashMap;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v11

    .line 117
    .local v11, "userdescStr":Ljava/lang/String;
    invoke-virtual {v11}, Ljava/lang/String;->length()I

    move-result v12

    if-lez v12, :cond_2

    .line 118
    const-string v12, "--%s\r\n"

    const/4 v13, 0x1

    new-array v13, v13, [Ljava/lang/Object;

    const/4 v14, 0x0

    aput-object v2, v13, v14

    invoke-static {v12, v13}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v12

    invoke-virtual {v4, v12}, Ljava/lang/StringBuffer;->append(Ljava/lang/String;)Ljava/lang/StringBuffer;

    .line 119
    const-string v12, "Content-Disposition: form-data; name=\"userdesc\";\r\n"

    invoke-virtual {v4, v12}, Ljava/lang/StringBuffer;->append(Ljava/lang/String;)Ljava/lang/StringBuffer;

    .line 120
    const-string v12, "Content-Type: text/plain;\r\n\r\n"

    invoke-virtual {v4, v12}, Ljava/lang/StringBuffer;->append(Ljava/lang/String;)Ljava/lang/StringBuffer;

    .line 121
    const-string v12, "%s\r\n"

    const/4 v13, 0x1

    new-array v13, v13, [Ljava/lang/Object;

    const/4 v14, 0x0

    aput-object v11, v13, v14

    invoke-static {v12, v13}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v12

    invoke-virtual {v4, v12}, Ljava/lang/StringBuffer;->append(Ljava/lang/String;)Ljava/lang/StringBuffer;

    .line 124
    :cond_2
    const-string v12, "--%s\r\n"

    const/4 v13, 0x1

    new-array v13, v13, [Ljava/lang/Object;

    const/4 v14, 0x0

    aput-object v2, v13, v14

    invoke-static {v12, v13}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v12

    invoke-virtual {v4, v12}, Ljava/lang/StringBuffer;->append(Ljava/lang/String;)Ljava/lang/StringBuffer;

    .line 125
    const-string v12, "Content-Disposition: form-data; name=\"file1\"; filename=\"dump-%d.txt\"; \r\n"

    const/4 v13, 0x1

    new-array v13, v13, [Ljava/lang/Object;

    const/4 v14, 0x0

    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v15

    invoke-static/range {v15 .. v16}, Ljava/lang/Long;->valueOf(J)Ljava/lang/Long;

    move-result-object v15

    aput-object v15, v13, v14

    invoke-static {v12, v13}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v12

    invoke-virtual {v4, v12}, Ljava/lang/StringBuffer;->append(Ljava/lang/String;)Ljava/lang/StringBuffer;

    .line 126
    const-string v12, "Content-Type: text/plain;\r\n\r\n"

    invoke-virtual {v4, v12}, Ljava/lang/StringBuffer;->append(Ljava/lang/String;)Ljava/lang/StringBuffer;

    .line 127
    const-string v12, "%s\r\n"

    const/4 v13, 0x1

    new-array v13, v13, [Ljava/lang/Object;

    const/4 v14, 0x0

    aput-object p0, v13, v14

    invoke-static {v12, v13}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v12

    invoke-virtual {v4, v12}, Ljava/lang/StringBuffer;->append(Ljava/lang/String;)Ljava/lang/StringBuffer;

    .line 128
    const-string v12, "--%s--\r\n"

    const/4 v13, 0x1

    new-array v13, v13, [Ljava/lang/Object;

    const/4 v14, 0x0

    aput-object v2, v13, v14

    invoke-static {v12, v13}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v12

    invoke-virtual {v4, v12}, Ljava/lang/StringBuffer;->append(Ljava/lang/String;)Ljava/lang/StringBuffer;

    .line 129
    const/4 v3, 0x0

    .line 131
    .local v3, "connection":Ljava/net/HttpURLConnection;
    :try_start_0
    new-instance v10, Ljava/net/URL;

    sget-object v12, Lcom/netease/dacommon/AppErrorReport;->errorReportURL:Ljava/lang/String;

    invoke-direct {v10, v12}, Ljava/net/URL;-><init>(Ljava/lang/String;)V

    .line 132
    .local v10, "url":Ljava/net/URL;
    invoke-virtual {v10}, Ljava/net/URL;->openConnection()Ljava/net/URLConnection;

    move-result-object v12

    move-object v0, v12

    check-cast v0, Ljava/net/HttpURLConnection;

    move-object v3, v0

    .line 133
    const-string v12, "POST"

    invoke-virtual {v3, v12}, Ljava/net/HttpURLConnection;->setRequestMethod(Ljava/lang/String;)V

    .line 134
    const/4 v12, 0x1

    invoke-virtual {v3, v12}, Ljava/net/HttpURLConnection;->setDoOutput(Z)V

    .line 135
    const/4 v12, 0x1

    invoke-virtual {v3, v12}, Ljava/net/HttpURLConnection;->setDoInput(Z)V

    .line 136
    const-string v12, "Content-Type"

    const-string v13, "multipart/form-data; boundary=%s"

    const/4 v14, 0x1

    new-array v14, v14, [Ljava/lang/Object;

    const/4 v15, 0x0

    aput-object v2, v14, v15

    invoke-static {v13, v14}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v13

    invoke-virtual {v3, v12, v13}, Ljava/net/HttpURLConnection;->addRequestProperty(Ljava/lang/String;Ljava/lang/String;)V

    .line 137
    invoke-virtual {v4}, Ljava/lang/StringBuffer;->toString()Ljava/lang/String;

    move-result-object v5

    .line 138
    .local v5, "contentString":Ljava/lang/String;
    invoke-virtual {v3}, Ljava/net/HttpURLConnection;->getOutputStream()Ljava/io/OutputStream;

    move-result-object v12

    const-string v13, "UTF-8"

    invoke-virtual {v5, v13}, Ljava/lang/String;->getBytes(Ljava/lang/String;)[B

    move-result-object v13

    invoke-virtual {v12, v13}, Ljava/io/OutputStream;->write([B)V

    .line 139
    invoke-virtual {v3}, Ljava/net/HttpURLConnection;->getOutputStream()Ljava/io/OutputStream;

    move-result-object v12

    invoke-virtual {v12}, Ljava/io/OutputStream;->flush()V

    .line 140
    invoke-virtual {v3}, Ljava/net/HttpURLConnection;->getOutputStream()Ljava/io/OutputStream;

    move-result-object v12

    invoke-virtual {v12}, Ljava/io/OutputStream;->close()V

    .line 141
    invoke-virtual {v3}, Ljava/net/HttpURLConnection;->getInputStream()Ljava/io/InputStream;

    move-result-object v7

    .line 142
    .local v7, "in":Ljava/io/InputStream;
    new-instance v8, Ljava/io/BufferedReader;

    new-instance v12, Ljava/io/InputStreamReader;

    invoke-direct {v12, v7}, Ljava/io/InputStreamReader;-><init>(Ljava/io/InputStream;)V

    invoke-direct {v8, v12}, Ljava/io/BufferedReader;-><init>(Ljava/io/Reader;)V

    .line 143
    .local v8, "rd":Ljava/io/BufferedReader;
    new-instance v9, Ljava/lang/StringBuilder;

    invoke-direct {v9}, Ljava/lang/StringBuilder;-><init>()V

    .line 144
    .local v9, "tempStr":Ljava/lang/StringBuilder;
    :goto_1
    invoke-virtual {v8}, Ljava/io/BufferedReader;->read()I

    move-result v12

    const/4 v13, -0x1

    if-eq v12, v13, :cond_3

    .line 145
    invoke-virtual {v8}, Ljava/io/BufferedReader;->readLine()Ljava/lang/String;

    move-result-object v12

    invoke-virtual {v9, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    :try_end_0
    .catch Ljava/io/IOException; {:try_start_0 .. :try_end_0} :catch_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    goto :goto_1

    .line 147
    .end local v5    # "contentString":Ljava/lang/String;
    .end local v7    # "in":Ljava/io/InputStream;
    .end local v8    # "rd":Ljava/io/BufferedReader;
    .end local v9    # "tempStr":Ljava/lang/StringBuilder;
    .end local v10    # "url":Ljava/net/URL;
    :catch_0
    move-exception v6

    .line 148
    .local v6, "e":Ljava/io/IOException;
    :try_start_1
    invoke-virtual {v6}, Ljava/io/IOException;->printStackTrace()V
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    .line 150
    if-eqz v3, :cond_0

    .line 151
    invoke-virtual {v3}, Ljava/net/HttpURLConnection;->disconnect()V

    goto/16 :goto_0

    .line 150
    .end local v6    # "e":Ljava/io/IOException;
    .restart local v5    # "contentString":Ljava/lang/String;
    .restart local v7    # "in":Ljava/io/InputStream;
    .restart local v8    # "rd":Ljava/io/BufferedReader;
    .restart local v9    # "tempStr":Ljava/lang/StringBuilder;
    .restart local v10    # "url":Ljava/net/URL;
    :cond_3
    if-eqz v3, :cond_0

    .line 151
    invoke-virtual {v3}, Ljava/net/HttpURLConnection;->disconnect()V

    goto/16 :goto_0

    .line 150
    .end local v5    # "contentString":Ljava/lang/String;
    .end local v7    # "in":Ljava/io/InputStream;
    .end local v8    # "rd":Ljava/io/BufferedReader;
    .end local v9    # "tempStr":Ljava/lang/StringBuilder;
    .end local v10    # "url":Ljava/net/URL;
    :catchall_0
    move-exception v12

    if-eqz v3, :cond_4

    .line 151
    invoke-virtual {v3}, Ljava/net/HttpURLConnection;->disconnect()V

    :cond_4
    throw v12
.end method

.method public static setClientVersion(Ljava/lang/String;)V
    .locals 2
    .param p0, "client_v"    # Ljava/lang/String;

    .prologue
    .line 166
    sget-object v0, Lcom/netease/dacommon/AppErrorReport;->basicinfo:Ljava/util/HashMap;

    const-string v1, "client_v"

    invoke-virtual {v0, v1, p0}, Ljava/util/HashMap;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 168
    return-void
.end method

.method public static setDumpId(Ljava/lang/String;)V
    .locals 2
    .param p0, "dump_indentify"    # Ljava/lang/String;

    .prologue
    .line 176
    sget-object v0, Lcom/netease/dacommon/AppErrorReport;->basicinfo:Ljava/util/HashMap;

    const-string v1, "dump_indentify"

    invoke-virtual {v0, v1, p0}, Ljava/util/HashMap;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 178
    return-void
.end method

.method public static setDumpType(I)V
    .locals 4
    .param p0, "dump_type"    # I

    .prologue
    .line 181
    sget-object v0, Lcom/netease/dacommon/AppErrorReport;->basicinfo:Ljava/util/HashMap;

    const-string v1, "dump_type"

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v2, p0}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v3, ""

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v0, v1, v2}, Ljava/util/HashMap;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 183
    return-void
.end method

.method public static setNickname(Ljava/lang/String;)V
    .locals 2
    .param p0, "nickname"    # Ljava/lang/String;

    .prologue
    .line 197
    sget-object v0, Lcom/netease/dacommon/AppErrorReport;->basicinfo:Ljava/util/HashMap;

    const-string v1, "nickname"

    invoke-virtual {v0, v1, p0}, Ljava/util/HashMap;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 198
    return-void
.end method

.method public static setReportURL(Ljava/lang/String;)V
    .locals 0
    .param p0, "url"    # Ljava/lang/String;

    .prologue
    .line 158
    sput-object p0, Lcom/netease/dacommon/AppErrorReport;->errorReportURL:Ljava/lang/String;

    .line 159
    return-void
.end method

.method public static setServerName(Ljava/lang/String;)V
    .locals 2
    .param p0, "server_name"    # Ljava/lang/String;

    .prologue
    .line 186
    sget-object v0, Lcom/netease/dacommon/AppErrorReport;->basicinfo:Ljava/util/HashMap;

    const-string v1, "server_name"

    invoke-virtual {v0, v1, p0}, Ljava/util/HashMap;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 188
    return-void
.end method

.method public static setServerVersion(Ljava/lang/String;)V
    .locals 2
    .param p0, "server_v"    # Ljava/lang/String;

    .prologue
    .line 171
    sget-object v0, Lcom/netease/dacommon/AppErrorReport;->basicinfo:Ljava/util/HashMap;

    const-string v1, "server_v"

    invoke-virtual {v0, v1, p0}, Ljava/util/HashMap;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 173
    return-void
.end method

.method public static setUid(Ljava/lang/String;)V
    .locals 2
    .param p0, "uid"    # Ljava/lang/String;

    .prologue
    .line 192
    sget-object v0, Lcom/netease/dacommon/AppErrorReport;->basicinfo:Ljava/util/HashMap;

    const-string v1, "uid"

    invoke-virtual {v0, v1, p0}, Ljava/util/HashMap;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 193
    return-void
.end method

.method public static setUrs(Ljava/lang/String;)V
    .locals 2
    .param p0, "urs"    # Ljava/lang/String;

    .prologue
    .line 162
    sget-object v0, Lcom/netease/dacommon/AppErrorReport;->basicinfo:Ljava/util/HashMap;

    const-string v1, "urs"

    invoke-virtual {v0, v1, p0}, Ljava/util/HashMap;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 163
    return-void
.end method

.method public static setUserDesc(Ljava/lang/String;Ljava/lang/String;)V
    .locals 1
    .param p0, "key"    # Ljava/lang/String;
    .param p1, "value"    # Ljava/lang/String;

    .prologue
    .line 201
    sget-object v0, Lcom/netease/dacommon/AppErrorReport;->userdesc:Ljava/util/HashMap;

    invoke-virtual {v0, p0, p1}, Ljava/util/HashMap;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 202
    return-void
.end method


# virtual methods
.method public init(Landroid/content/Context;)V
    .locals 1
    .param p1, "ctx"    # Landroid/content/Context;

    .prologue
    .line 45
    iput-object p1, p0, Lcom/netease/dacommon/AppErrorReport;->mContext:Landroid/content/Context;

    .line 46
    invoke-static {}, Ljava/lang/Thread;->getDefaultUncaughtExceptionHandler()Ljava/lang/Thread$UncaughtExceptionHandler;

    move-result-object v0

    iput-object v0, p0, Lcom/netease/dacommon/AppErrorReport;->mDefaultHandler:Ljava/lang/Thread$UncaughtExceptionHandler;

    .line 47
    invoke-static {p0}, Ljava/lang/Thread;->setDefaultUncaughtExceptionHandler(Ljava/lang/Thread$UncaughtExceptionHandler;)V

    .line 48
    return-void
.end method

.method public uncaughtException(Ljava/lang/Thread;Ljava/lang/Throwable;)V
    .locals 1
    .param p1, "thread"    # Ljava/lang/Thread;
    .param p2, "ex"    # Ljava/lang/Throwable;

    .prologue
    .line 53
    new-instance v0, Lcom/netease/dacommon/AppErrorReport$1;

    invoke-direct {v0, p0, p2}, Lcom/netease/dacommon/AppErrorReport$1;-><init>(Lcom/netease/dacommon/AppErrorReport;Ljava/lang/Throwable;)V

    invoke-virtual {v0}, Lcom/netease/dacommon/AppErrorReport$1;->start()V

    .line 65
    return-void
.end method
