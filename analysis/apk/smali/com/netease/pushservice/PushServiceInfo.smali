.class public Lcom/netease/pushservice/PushServiceInfo;
.super Ljava/lang/Object;
.source "PushServiceInfo.java"


# instance fields
.field private charArray:[C

.field public mDevId:Ljava/lang/String;

.field public mPushSrv:Ljava/lang/String;

.field private mbReset:Z


# direct methods
.method public constructor <init>()V
    .locals 1

    .prologue
    .line 34
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 37
    const-string v0, "unipush.x.netease.com:50441"

    iput-object v0, p0, Lcom/netease/pushservice/PushServiceInfo;->mPushSrv:Ljava/lang/String;

    .line 40
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/pushservice/PushServiceInfo;->mDevId:Ljava/lang/String;

    .line 43
    const/4 v0, 0x0

    iput-boolean v0, p0, Lcom/netease/pushservice/PushServiceInfo;->mbReset:Z

    .line 91
    const/16 v0, 0x24

    new-array v0, v0, [C

    fill-array-data v0, :array_0

    .line 93
    iput-object v0, p0, Lcom/netease/pushservice/PushServiceInfo;->charArray:[C

    .line 34
    return-void

    .line 91
    :array_0
    .array-data 2
        0x30s
        0x31s
        0x32s
        0x33s
        0x34s
        0x35s
        0x36s
        0x37s
        0x38s
        0x39s
        0x61s
        0x62s
        0x63s
        0x64s
        0x65s
        0x66s
        0x67s
        0x68s
        0x69s
        0x6as
        0x6bs
        0x6cs
        0x6ds
        0x6es
        0x6fs
        0x70s
        0x71s
        0x72s
        0x73s
        0x74s
        0x75s
        0x76s
        0x77s
        0x78s
        0x79s
        0x7as
    .end array-data
.end method

.method private appendString(Ljava/lang/StringBuilder;Ljava/lang/String;I)V
    .locals 8
    .param p1, "dstStringBuilder"    # Ljava/lang/StringBuilder;
    .param p2, "srcString"    # Ljava/lang/String;
    .param p3, "nsize"    # I
    .annotation build Landroid/annotation/SuppressLint;
        value = {
            "DefaultLocale"
        }
    .end annotation

    .prologue
    const/4 v7, 0x0

    .line 155
    invoke-static {p3}, Ljava/lang/Math;->abs(I)I

    move-result v2

    .line 156
    .local v2, "size":I
    invoke-virtual {p2}, Ljava/lang/String;->toLowerCase()Ljava/lang/String;

    move-result-object v4

    const-string v5, "\\W+"

    const-string v6, ""

    invoke-virtual {v4, v5, v6}, Ljava/lang/String;->replaceAll(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object p2

    .line 158
    invoke-virtual {p2}, Ljava/lang/String;->length()I

    move-result v4

    if-le v4, v2, :cond_0

    .line 159
    if-lez p3, :cond_1

    .line 160
    invoke-virtual {p2, v7, v2}, Ljava/lang/String;->substring(II)Ljava/lang/String;

    move-result-object p2

    .line 165
    :cond_0
    :goto_0
    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3, p2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    .line 166
    .local v3, "tmpStringBuilder":Ljava/lang/StringBuilder;
    new-instance v1, Ljava/util/Random;

    invoke-direct {v1}, Ljava/util/Random;-><init>()V

    .line 167
    .local v1, "r":Ljava/util/Random;
    const/4 v0, 0x0

    .local v0, "i":I
    :goto_1
    if-lt v0, v2, :cond_2

    .line 177
    invoke-virtual {v3, v7, v2}, Ljava/lang/StringBuilder;->subSequence(II)Ljava/lang/CharSequence;

    move-result-object v4

    invoke-virtual {p1, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/CharSequence;)Ljava/lang/StringBuilder;

    .line 178
    return-void

    .line 162
    .end local v0    # "i":I
    .end local v1    # "r":Ljava/util/Random;
    .end local v3    # "tmpStringBuilder":Ljava/lang/StringBuilder;
    :cond_1
    invoke-virtual {p2}, Ljava/lang/String;->length()I

    move-result v4

    sub-int/2addr v4, v2

    invoke-virtual {p2, v4}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object p2

    goto :goto_0

    .line 168
    .restart local v0    # "i":I
    .restart local v1    # "r":Ljava/util/Random;
    .restart local v3    # "tmpStringBuilder":Ljava/lang/StringBuilder;
    :cond_2
    invoke-virtual {p2}, Ljava/lang/String;->length()I

    move-result v4

    if-ne v0, v4, :cond_4

    .line 169
    const/16 v4, 0x5f

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(C)Ljava/lang/StringBuilder;

    .line 167
    :cond_3
    :goto_2
    add-int/lit8 v0, v0, 0x1

    goto :goto_1

    .line 170
    :cond_4
    invoke-virtual {p2}, Ljava/lang/String;->length()I

    move-result v4

    if-le v0, v4, :cond_5

    .line 171
    iget-object v4, p0, Lcom/netease/pushservice/PushServiceInfo;->charArray:[C

    iget-object v5, p0, Lcom/netease/pushservice/PushServiceInfo;->charArray:[C

    array-length v5, v5

    invoke-virtual {v1, v5}, Ljava/util/Random;->nextInt(I)I

    move-result v5

    aget-char v4, v4, v5

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(C)Ljava/lang/StringBuilder;

    goto :goto_2

    .line 172
    :cond_5
    iget-object v4, p0, Lcom/netease/pushservice/PushServiceInfo;->charArray:[C

    invoke-virtual {p2, v0}, Ljava/lang/String;->charAt(I)C

    move-result v5

    invoke-static {v4, v5}, Ljava/util/Arrays;->binarySearch([CC)I

    move-result v4

    if-gez v4, :cond_3

    .line 174
    iget-object v4, p0, Lcom/netease/pushservice/PushServiceInfo;->charArray:[C

    iget-object v5, p0, Lcom/netease/pushservice/PushServiceInfo;->charArray:[C

    array-length v5, v5

    invoke-virtual {v1, v5}, Ljava/util/Random;->nextInt(I)I

    move-result v5

    aget-char v4, v4, v5

    invoke-virtual {v3, v0, v4}, Ljava/lang/StringBuilder;->setCharAt(IC)V

    goto :goto_2
.end method

.method private createFixUUID(Landroid/content/Context;)Ljava/lang/String;
    .locals 12
    .param p1, "context"    # Landroid/content/Context;

    .prologue
    .line 72
    const-string v6, "phone"

    invoke-virtual {p1, v6}, Landroid/content/Context;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Landroid/telephony/TelephonyManager;

    .line 75
    .local v2, "tm":Landroid/telephony/TelephonyManager;
    new-instance v6, Ljava/lang/StringBuilder;

    invoke-direct {v6}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v2}, Landroid/telephony/TelephonyManager;->getDeviceId()Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    .line 76
    .local v3, "tmDevice":Ljava/lang/String;
    new-instance v6, Ljava/lang/StringBuilder;

    invoke-direct {v6}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v2}, Landroid/telephony/TelephonyManager;->getSimSerialNumber()Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    .line 77
    .local v4, "tmSerial":Ljava/lang/String;
    new-instance v6, Ljava/lang/StringBuilder;

    invoke-direct {v6}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {p1}, Landroid/content/Context;->getContentResolver()Landroid/content/ContentResolver;

    move-result-object v7

    .line 78
    const-string v8, "android_id"

    .line 77
    invoke-static {v7, v8}, Landroid/provider/Settings$Secure;->getString(Landroid/content/ContentResolver;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 80
    .local v0, "androidId":Ljava/lang/String;
    const-string v5, ""

    .line 82
    .local v5, "uniqueId":Ljava/lang/String;
    new-instance v1, Ljava/util/UUID;

    invoke-virtual {v0}, Ljava/lang/String;->hashCode()I

    move-result v6

    int-to-long v6, v6

    invoke-virtual {v3}, Ljava/lang/String;->hashCode()I

    move-result v8

    int-to-long v8, v8

    const/16 v10, 0x20

    shl-long/2addr v8, v10

    invoke-virtual {v4}, Ljava/lang/String;->hashCode()I

    move-result v10

    int-to-long v10, v10

    or-long/2addr v8, v10

    invoke-direct {v1, v6, v7, v8, v9}, Ljava/util/UUID;-><init>(JJ)V

    .line 83
    .local v1, "deviceUuid":Ljava/util/UUID;
    invoke-virtual {v1}, Ljava/util/UUID;->toString()Ljava/lang/String;

    move-result-object v5

    .line 84
    return-object v5
.end method

.method private createRandom(I[C)Ljava/lang/String;
    .locals 6
    .param p1, "size"    # I
    .param p2, "array"    # [C

    .prologue
    .line 182
    array-length v2, p2

    .line 184
    .local v2, "length":I
    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    .line 185
    .local v4, "stringBuilder":Ljava/lang/StringBuilder;
    new-instance v3, Ljava/util/Random;

    invoke-direct {v3}, Ljava/util/Random;-><init>()V

    .line 186
    .local v3, "random":Ljava/util/Random;
    const/4 v0, 0x0

    .local v0, "i":I
    :goto_0
    if-lt v0, p1, :cond_0

    .line 191
    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    return-object v5

    .line 187
    :cond_0
    invoke-virtual {v3, v2}, Ljava/util/Random;->nextInt(I)I

    move-result v1

    .line 188
    .local v1, "iRandom":I
    aget-char v5, p2, v1

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(C)Ljava/lang/StringBuilder;

    .line 186
    add-int/lit8 v0, v0, 0x1

    goto :goto_0
.end method

.method private createRandomUUID()Ljava/lang/String;
    .locals 1

    .prologue
    .line 89
    invoke-static {}, Ljava/util/UUID;->randomUUID()Ljava/util/UUID;

    move-result-object v0

    invoke-virtual {v0}, Ljava/util/UUID;->toString()Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method private createSpecialUUID(Landroid/content/Context;)Ljava/lang/String;
    .locals 19
    .param p1, "context"    # Landroid/content/Context;

    .prologue
    .line 95
    new-instance v9, Ljava/lang/StringBuilder;

    invoke-direct {v9}, Ljava/lang/StringBuilder;-><init>()V

    .line 97
    .local v9, "stringBuilder":Ljava/lang/StringBuilder;
    move-object/from16 v0, p0

    iget-object v0, v0, Lcom/netease/pushservice/PushServiceInfo;->charArray:[C

    move-object/from16 v16, v0

    move-object/from16 v0, v16

    array-length v4, v0

    .line 99
    .local v4, "length":I
    new-instance v14, Ljava/lang/StringBuilder;

    invoke-direct {v14}, Ljava/lang/StringBuilder;-><init>()V

    .line 102
    .local v14, "tmpStringBuilder":Ljava/lang/StringBuilder;
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v10

    .line 103
    .local v10, "timeStamp":J
    const/16 v8, 0x8

    .line 104
    .local v8, "size":I
    const/4 v2, 0x0

    .local v2, "i":I
    :goto_0
    if-lt v2, v8, :cond_1

    .line 108
    sget-object v16, Ljava/lang/System;->out:Ljava/io/PrintStream;

    new-instance v17, Ljava/lang/StringBuilder;

    const-string v18, "time:"

    invoke-direct/range {v17 .. v18}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    move-object/from16 v0, v17

    invoke-virtual {v0, v10, v11}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;

    move-result-object v17

    invoke-virtual/range {v17 .. v17}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v17

    invoke-virtual/range {v16 .. v17}, Ljava/io/PrintStream;->println(Ljava/lang/String;)V

    .line 109
    invoke-virtual {v14}, Ljava/lang/StringBuilder;->reverse()Ljava/lang/StringBuilder;

    move-result-object v16

    invoke-virtual/range {v16 .. v16}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v16

    move-object/from16 v0, p0

    move-object/from16 v1, v16

    invoke-direct {v0, v9, v1, v8}, Lcom/netease/pushservice/PushServiceInfo;->appendString(Ljava/lang/StringBuilder;Ljava/lang/String;I)V

    .line 112
    const/4 v8, 0x6

    .line 113
    sget-object v7, Landroid/os/Build;->MODEL:Ljava/lang/String;

    .line 114
    .local v7, "sModel":Ljava/lang/String;
    sget-object v16, Ljava/lang/System;->out:Ljava/io/PrintStream;

    new-instance v17, Ljava/lang/StringBuilder;

    const-string v18, "model:"

    invoke-direct/range {v17 .. v18}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    move-object/from16 v0, v17

    invoke-virtual {v0, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v17

    invoke-virtual/range {v17 .. v17}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v17

    invoke-virtual/range {v16 .. v17}, Ljava/io/PrintStream;->println(Ljava/lang/String;)V

    .line 115
    move-object/from16 v0, p0

    invoke-direct {v0, v9, v7, v8}, Lcom/netease/pushservice/PushServiceInfo;->appendString(Ljava/lang/StringBuilder;Ljava/lang/String;I)V

    .line 118
    const-string v16, "phone"

    move-object/from16 v0, p1

    move-object/from16 v1, v16

    invoke-virtual {v0, v1}, Landroid/content/Context;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v12

    check-cast v12, Landroid/telephony/TelephonyManager;

    .line 119
    .local v12, "tm":Landroid/telephony/TelephonyManager;
    const/4 v8, 0x6

    .line 120
    const-string v13, ""

    .line 121
    .local v13, "tmDevice":Ljava/lang/String;
    invoke-virtual {v12}, Landroid/telephony/TelephonyManager;->getDeviceId()Ljava/lang/String;

    move-result-object v16

    if-eqz v16, :cond_0

    .line 122
    invoke-virtual {v12}, Landroid/telephony/TelephonyManager;->getDeviceId()Ljava/lang/String;

    move-result-object v13

    .line 124
    :cond_0
    sget-object v16, Ljava/lang/System;->out:Ljava/io/PrintStream;

    new-instance v17, Ljava/lang/StringBuilder;

    const-string v18, "IMEI:"

    invoke-direct/range {v17 .. v18}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    move-object/from16 v0, v17

    invoke-virtual {v0, v13}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v17

    invoke-virtual/range {v17 .. v17}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v17

    invoke-virtual/range {v16 .. v17}, Ljava/io/PrintStream;->println(Ljava/lang/String;)V

    .line 125
    neg-int v0, v8

    move/from16 v16, v0

    move-object/from16 v0, p0

    move/from16 v1, v16

    invoke-direct {v0, v9, v13, v1}, Lcom/netease/pushservice/PushServiceInfo;->appendString(Ljava/lang/StringBuilder;Ljava/lang/String;I)V

    .line 128
    const/4 v8, 0x6

    .line 129
    const-string v6, ""

    .line 130
    .local v6, "sMac":Ljava/lang/String;
    const-string v16, "wifi"

    move-object/from16 v0, p1

    move-object/from16 v1, v16

    invoke-virtual {v0, v1}, Landroid/content/Context;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v15

    check-cast v15, Landroid/net/wifi/WifiManager;

    .line 131
    .local v15, "wifiMgr":Landroid/net/wifi/WifiManager;
    if-nez v15, :cond_2

    const/4 v3, 0x0

    .line 132
    .local v3, "info":Landroid/net/wifi/WifiInfo;
    :goto_1
    if-eqz v3, :cond_4

    .line 133
    invoke-virtual {v3}, Landroid/net/wifi/WifiInfo;->getMacAddress()Ljava/lang/String;

    move-result-object v6

    .line 136
    const-string v16, "40:F3:08:3F:FA:D3"

    move-object/from16 v0, v16

    invoke-virtual {v0, v6}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v16

    if-eqz v16, :cond_3

    .line 137
    const-string v16, "etrl52GTI95035737640F308png781lw"

    .line 150
    :goto_2
    return-object v16

    .line 105
    .end local v3    # "info":Landroid/net/wifi/WifiInfo;
    .end local v6    # "sMac":Ljava/lang/String;
    .end local v7    # "sModel":Ljava/lang/String;
    .end local v12    # "tm":Landroid/telephony/TelephonyManager;
    .end local v13    # "tmDevice":Ljava/lang/String;
    .end local v15    # "wifiMgr":Landroid/net/wifi/WifiManager;
    :cond_1
    move-object/from16 v0, p0

    iget-object v0, v0, Lcom/netease/pushservice/PushServiceInfo;->charArray:[C

    move-object/from16 v16, v0

    int-to-long v0, v4

    move-wide/from16 v17, v0

    rem-long v17, v10, v17

    move-wide/from16 v0, v17

    long-to-int v0, v0

    move/from16 v17, v0

    aget-char v16, v16, v17

    move/from16 v0, v16

    invoke-virtual {v14, v0}, Ljava/lang/StringBuilder;->append(C)Ljava/lang/StringBuilder;

    .line 106
    int-to-long v0, v4

    move-wide/from16 v16, v0

    div-long v10, v10, v16

    .line 104
    add-int/lit8 v2, v2, 0x1

    goto/16 :goto_0

    .line 131
    .restart local v6    # "sMac":Ljava/lang/String;
    .restart local v7    # "sModel":Ljava/lang/String;
    .restart local v12    # "tm":Landroid/telephony/TelephonyManager;
    .restart local v13    # "tmDevice":Ljava/lang/String;
    .restart local v15    # "wifiMgr":Landroid/net/wifi/WifiManager;
    :cond_2
    invoke-virtual {v15}, Landroid/net/wifi/WifiManager;->getConnectionInfo()Landroid/net/wifi/WifiInfo;

    move-result-object v3

    goto :goto_1

    .line 139
    .restart local v3    # "info":Landroid/net/wifi/WifiInfo;
    :cond_3
    if-nez v6, :cond_4

    .line 140
    const-string v6, ""

    .line 142
    :cond_4
    sget-object v16, Ljava/lang/System;->out:Ljava/io/PrintStream;

    new-instance v17, Ljava/lang/StringBuilder;

    const-string v18, "MAC:"

    invoke-direct/range {v17 .. v18}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    move-object/from16 v0, v17

    invoke-virtual {v0, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v17

    invoke-virtual/range {v17 .. v17}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v17

    invoke-virtual/range {v16 .. v17}, Ljava/io/PrintStream;->println(Ljava/lang/String;)V

    .line 143
    neg-int v0, v8

    move/from16 v16, v0

    move-object/from16 v0, p0

    move/from16 v1, v16

    invoke-direct {v0, v9, v6, v1}, Lcom/netease/pushservice/PushServiceInfo;->appendString(Ljava/lang/StringBuilder;Ljava/lang/String;I)V

    .line 146
    const/4 v8, 0x6

    .line 147
    move-object/from16 v0, p0

    iget-object v0, v0, Lcom/netease/pushservice/PushServiceInfo;->charArray:[C

    move-object/from16 v16, v0

    move-object/from16 v0, p0

    move-object/from16 v1, v16

    invoke-direct {v0, v8, v1}, Lcom/netease/pushservice/PushServiceInfo;->createRandom(I[C)Ljava/lang/String;

    move-result-object v5

    .line 148
    .local v5, "randomString":Ljava/lang/String;
    move-object/from16 v0, p0

    invoke-direct {v0, v9, v5, v8}, Lcom/netease/pushservice/PushServiceInfo;->appendString(Ljava/lang/StringBuilder;Ljava/lang/String;I)V

    .line 150
    invoke-virtual {v9}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v16

    goto :goto_2
.end method


# virtual methods
.method public createUUID(Landroid/content/Context;)Ljava/lang/String;
    .locals 1
    .param p1, "context"    # Landroid/content/Context;

    .prologue
    .line 67
    invoke-direct {p0, p1}, Lcom/netease/pushservice/PushServiceInfo;->createSpecialUUID(Landroid/content/Context;)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public getPushSrv()Ljava/lang/String;
    .locals 1

    .prologue
    .line 56
    iget-object v0, p0, Lcom/netease/pushservice/PushServiceInfo;->mPushSrv:Ljava/lang/String;

    return-object v0
.end method

.method public resetUUID()V
    .locals 1

    .prologue
    .line 46
    const/4 v0, 0x1

    iput-boolean v0, p0, Lcom/netease/pushservice/PushServiceInfo;->mbReset:Z

    .line 47
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/pushservice/PushServiceInfo;->mDevId:Ljava/lang/String;

    .line 48
    return-void
.end method

.method public setPushSrv(Ljava/lang/String;)V
    .locals 1
    .param p1, "pushSrv"    # Ljava/lang/String;

    .prologue
    .line 51
    invoke-static {p1}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v0

    if-nez v0, :cond_0

    .line 52
    iput-object p1, p0, Lcom/netease/pushservice/PushServiceInfo;->mPushSrv:Ljava/lang/String;

    .line 53
    :cond_0
    return-void
.end method
