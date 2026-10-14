.class public Lcom/netease/ntunisdk/base/SdkMgr;
.super Ljava/lang/Object;
.source "SdkMgr.java"


# static fields
.field private static final PREFIX_SDK_CALSS:Ljava/lang/String; = "Sdk"

.field private static final PREFIX_SDK_PACKAGE:Ljava/lang/String; = "com.netease.ntunisdk."

.field public static final TAG:Ljava/lang/String; = "UniSDK Mgr"

.field private static inst:Lcom/netease/ntunisdk/base/SdkBase;

.field private static sdkMap:Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Map",
            "<",
            "Ljava/lang/String;",
            "Lcom/netease/ntunisdk/base/SdkBase;",
            ">;"
        }
    .end annotation
.end field


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .prologue
    .line 31
    new-instance v0, Ljava/util/HashMap;

    invoke-direct {v0}, Ljava/util/HashMap;-><init>()V

    sput-object v0, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    .line 32
    const/4 v0, 0x0

    sput-object v0, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    return-void
.end method

.method public constructor <init>()V
    .locals 0

    .prologue
    .line 26
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method private static assets2Class(Landroid/content/Context;Ljava/lang/String;)V
    .locals 17
    .param p0, "ctx"    # Landroid/content/Context;
    .param p1, "channalCode"    # Ljava/lang/String;

    .prologue
    .line 173
    const/4 v9, 0x0

    .line 174
    .local v9, "jsonStr":Ljava/lang/String;
    const-string v5, "ntunisdk_data"

    .line 176
    .local v5, "fileName":Ljava/lang/String;
    :try_start_0
    invoke-virtual/range {p0 .. p0}, Landroid/content/Context;->getAssets()Landroid/content/res/AssetManager;

    move-result-object v14

    const/4 v15, 0x3

    invoke-virtual {v14, v5, v15}, Landroid/content/res/AssetManager;->open(Ljava/lang/String;I)Ljava/io/InputStream;

    move-result-object v8

    .line 178
    .local v8, "is":Ljava/io/InputStream;
    invoke-virtual {v8}, Ljava/io/InputStream;->available()I

    move-result v7

    .line 179
    .local v7, "index":I
    if-nez v7, :cond_1

    .line 180
    const-string v14, "UniSDK Mgr"

    const-string v15, "ntunisdk_data empty"

    invoke-static {v14, v15}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 199
    .end local v7    # "index":I
    .end local v8    # "is":Ljava/io/InputStream;
    :cond_0
    return-void

    .line 183
    .restart local v7    # "index":I
    .restart local v8    # "is":Ljava/io/InputStream;
    :cond_1
    new-array v3, v7, [B

    .line 184
    .local v3, "data":[B
    invoke-virtual {v8, v3}, Ljava/io/InputStream;->read([B)I

    .line 186
    new-instance v10, Ljava/lang/String;

    const-string v14, "UTF-8"

    invoke-direct {v10, v3, v14}, Ljava/lang/String;-><init>([BLjava/lang/String;)V
    :try_end_0
    .catch Ljava/io/IOException; {:try_start_0 .. :try_end_0} :catch_0

    .end local v9    # "jsonStr":Ljava/lang/String;
    .local v10, "jsonStr":Ljava/lang/String;
    move-object v9, v10

    .line 190
    .end local v3    # "data":[B
    .end local v7    # "index":I
    .end local v8    # "is":Ljava/io/InputStream;
    .end local v10    # "jsonStr":Ljava/lang/String;
    .restart local v9    # "jsonStr":Ljava/lang/String;
    :goto_0
    if-eqz v9, :cond_0

    .line 191
    const-string v14, "UniSDK Mgr"

    new-instance v15, Ljava/lang/StringBuilder;

    invoke-direct {v15}, Ljava/lang/StringBuilder;-><init>()V

    const-string v16, "ntunisdk_data:"

    invoke-virtual/range {v15 .. v16}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v15

    invoke-virtual {v15, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v15

    invoke-virtual {v15}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v15

    invoke-static {v14, v15}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 192
    const-string v14, ";"

    invoke-virtual {v9, v14}, Ljava/lang/String;->split(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object v12

    .line 193
    .local v12, "names":[Ljava/lang/String;
    move-object v2, v12

    .local v2, "arr$":[Ljava/lang/String;
    array-length v11, v2

    .local v11, "len$":I
    const/4 v6, 0x0

    .local v6, "i$":I
    :goto_1
    if-ge v6, v11, :cond_0

    aget-object v13, v2, v6

    .line 194
    .local v13, "str":Ljava/lang/String;
    invoke-virtual {v13}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v14

    const-string v15, "Sdk"

    invoke-virtual {v14, v15}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v14

    if-eqz v14, :cond_2

    .line 195
    new-instance v14, Ljava/lang/StringBuilder;

    invoke-direct {v14}, Ljava/lang/StringBuilder;-><init>()V

    const-string v15, "com.netease.ntunisdk."

    invoke-virtual {v14, v15}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v14

    invoke-virtual {v13}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v15

    invoke-virtual {v14, v15}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v14

    invoke-virtual {v14}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v14

    move-object/from16 v0, p0

    move-object/from16 v1, p1

    invoke-static {v14, v0, v1}, Lcom/netease/ntunisdk/base/SdkMgr;->newInstanceByClass(Ljava/lang/String;Landroid/content/Context;Ljava/lang/String;)V

    .line 193
    :cond_2
    add-int/lit8 v6, v6, 0x1

    goto :goto_1

    .line 187
    .end local v2    # "arr$":[Ljava/lang/String;
    .end local v6    # "i$":I
    .end local v11    # "len$":I
    .end local v12    # "names":[Ljava/lang/String;
    .end local v13    # "str":Ljava/lang/String;
    :catch_0
    move-exception v4

    .line 188
    .local v4, "e":Ljava/io/IOException;
    const-string v14, "UniSDK Mgr"

    const-string v15, "ntunisdk_data config not found"

    invoke-static {v14, v15}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    goto :goto_0
.end method

.method private static checkCurrentPlatform(Landroid/content/Context;Ljava/lang/String;)V
    .locals 18
    .param p0, "ctx"    # Landroid/content/Context;
    .param p1, "channalCode"    # Ljava/lang/String;

    .prologue
    .line 83
    const/4 v4, 0x0

    .line 86
    .local v4, "localDexFile":Ldalvik/system/DexFile;
    invoke-static/range {p0 .. p1}, Lcom/netease/ntunisdk/base/SdkMgr;->assets2Class(Landroid/content/Context;Ljava/lang/String;)V

    .line 88
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInstFromSdkmap()V

    .line 91
    sget-object v13, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    if-nez v13, :cond_3

    .line 92
    const/4 v6, 0x0

    .line 93
    .local v6, "localEnumeration":Ljava/util/Enumeration;
    invoke-virtual/range {p0 .. p0}, Landroid/content/Context;->getPackageManager()Landroid/content/pm/PackageManager;

    move-result-object v10

    .line 95
    .local v10, "pm":Landroid/content/pm/PackageManager;
    :try_start_0
    invoke-virtual/range {p0 .. p0}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    move-result-object v13

    const/4 v14, 0x0

    invoke-virtual {v10, v13, v14}, Landroid/content/pm/PackageManager;->getPackageInfo(Ljava/lang/String;I)Landroid/content/pm/PackageInfo;

    move-result-object v9

    .line 96
    .local v9, "paramPackageInfo":Landroid/content/pm/PackageInfo;
    new-instance v5, Ldalvik/system/DexFile;

    iget-object v13, v9, Landroid/content/pm/PackageInfo;->applicationInfo:Landroid/content/pm/ApplicationInfo;

    iget-object v13, v13, Landroid/content/pm/ApplicationInfo;->sourceDir:Ljava/lang/String;

    invoke-direct {v5, v13}, Ldalvik/system/DexFile;-><init>(Ljava/lang/String;)V
    :try_end_0
    .catch Ljava/lang/Throwable; {:try_start_0 .. :try_end_0} :catch_0

    .line 97
    .end local v4    # "localDexFile":Ldalvik/system/DexFile;
    .local v5, "localDexFile":Ldalvik/system/DexFile;
    :try_start_1
    invoke-virtual {v5}, Ldalvik/system/DexFile;->entries()Ljava/util/Enumeration;
    :try_end_1
    .catch Ljava/lang/Throwable; {:try_start_1 .. :try_end_1} :catch_2

    move-result-object v6

    .line 102
    :cond_0
    :goto_0
    if-eqz v6, :cond_2

    invoke-interface {v6}, Ljava/util/Enumeration;->hasMoreElements()Z

    move-result v13

    if-eqz v13, :cond_2

    .line 103
    invoke-interface {v6}, Ljava/util/Enumeration;->nextElement()Ljava/lang/Object;

    move-result-object v12

    check-cast v12, Ljava/lang/String;

    .line 104
    .local v12, "str":Ljava/lang/String;
    const-string v13, "com.netease.ntunisdk.Sdk"

    invoke-virtual {v12, v13}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v13

    if-eqz v13, :cond_0

    const-string v13, "$"

    invoke-virtual {v12, v13}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v13

    if-nez v13, :cond_0

    .line 105
    move-object/from16 v0, p0

    move-object/from16 v1, p1

    invoke-static {v12, v0, v1}, Lcom/netease/ntunisdk/base/SdkMgr;->newInstanceByClass(Ljava/lang/String;Landroid/content/Context;Ljava/lang/String;)V

    goto :goto_0

    .line 98
    .end local v5    # "localDexFile":Ldalvik/system/DexFile;
    .end local v9    # "paramPackageInfo":Landroid/content/pm/PackageInfo;
    .end local v12    # "str":Ljava/lang/String;
    .restart local v4    # "localDexFile":Ldalvik/system/DexFile;
    :catch_0
    move-exception v7

    .line 99
    .local v7, "localThrowable1":Ljava/lang/Throwable;
    :goto_1
    invoke-virtual {v7}, Ljava/lang/Throwable;->printStackTrace()V

    .line 149
    .end local v6    # "localEnumeration":Ljava/util/Enumeration;
    .end local v7    # "localThrowable1":Ljava/lang/Throwable;
    .end local v10    # "pm":Landroid/content/pm/PackageManager;
    :cond_1
    :goto_2
    return-void

    .end local v4    # "localDexFile":Ldalvik/system/DexFile;
    .restart local v5    # "localDexFile":Ldalvik/system/DexFile;
    .restart local v6    # "localEnumeration":Ljava/util/Enumeration;
    .restart local v9    # "paramPackageInfo":Landroid/content/pm/PackageInfo;
    .restart local v10    # "pm":Landroid/content/pm/PackageManager;
    :cond_2
    move-object v4, v5

    .line 110
    .end local v5    # "localDexFile":Ldalvik/system/DexFile;
    .restart local v4    # "localDexFile":Ldalvik/system/DexFile;
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInstFromSdkmap()V

    .line 115
    .end local v6    # "localEnumeration":Ljava/util/Enumeration;
    .end local v9    # "paramPackageInfo":Landroid/content/pm/PackageInfo;
    .end local v10    # "pm":Landroid/content/pm/PackageManager;
    :cond_3
    const-string v13, "netease"

    sget-object v14, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v14}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v14

    invoke-virtual {v13, v14}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v13

    if-eqz v13, :cond_4

    sget-object v13, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    invoke-interface {v13}, Ljava/util/Map;->size()I

    move-result v13

    const/4 v14, 0x1

    if-ne v13, v14, :cond_4

    sget-object v13, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    const-string v14, "g_10086"

    invoke-interface {v13, v14}, Ljava/util/Map;->containsKey(Ljava/lang/Object;)Z

    move-result v13

    if-eqz v13, :cond_4

    .line 116
    sget-object v13, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    const-string v14, "netease"

    sget-object v15, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-interface {v13, v14, v15}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 117
    sget-object v13, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    const-string v14, "g_10086"

    invoke-interface {v13, v14}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v13

    check-cast v13, Lcom/netease/ntunisdk/base/SdkBase;

    sput-object v13, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    .line 118
    sget-object v13, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    const-string v14, "g_10086"

    invoke-interface {v13, v14}, Ljava/util/Map;->remove(Ljava/lang/Object;)Ljava/lang/Object;

    .line 122
    :cond_4
    const-string v13, "g_10086"

    sget-object v14, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v14}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v14

    invoke-virtual {v13, v14}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v13

    if-eqz v13, :cond_5

    sget-object v13, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    invoke-interface {v13}, Ljava/util/Map;->size()I

    move-result v13

    const/4 v14, 0x1

    if-le v13, v14, :cond_5

    sget-object v13, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    const-string v14, "netease"

    invoke-interface {v13, v14}, Ljava/util/Map;->containsKey(Ljava/lang/Object;)Z

    move-result v13

    if-eqz v13, :cond_5

    .line 123
    sget-object v13, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    const-string v14, "g_10086"

    sget-object v15, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-interface {v13, v14, v15}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 124
    sget-object v13, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    const-string v14, "netease"

    invoke-interface {v13, v14}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v13

    check-cast v13, Lcom/netease/ntunisdk/base/SdkBase;

    sput-object v13, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    .line 125
    sget-object v13, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    const-string v14, "netease"

    invoke-interface {v13, v14}, Ljava/util/Map;->remove(Ljava/lang/Object;)Ljava/lang/Object;

    .line 128
    :cond_5
    new-instance v11, Ljava/lang/StringBuilder;

    invoke-direct {v11}, Ljava/lang/StringBuilder;-><init>()V

    .line 129
    .local v11, "sb":Ljava/lang/StringBuilder;
    sget-object v13, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    if-eqz v13, :cond_7

    .line 130
    sget-object v13, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    invoke-interface {v13}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v13

    invoke-interface {v13}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v2

    .local v2, "i$":Ljava/util/Iterator;
    :goto_3
    invoke-interface {v2}, Ljava/util/Iterator;->hasNext()Z

    move-result v13

    if-eqz v13, :cond_7

    invoke-interface {v2}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v3

    check-cast v3, Ljava/lang/String;

    .line 131
    .local v3, "key":Ljava/lang/String;
    invoke-virtual {v11}, Ljava/lang/StringBuilder;->length()I

    move-result v13

    if-lez v13, :cond_6

    .line 132
    const-string v13, "+"

    invoke-virtual {v11, v13}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 134
    :cond_6
    sget-object v13, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    invoke-interface {v13, v3}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v13

    check-cast v13, Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v13}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v13

    invoke-virtual {v11, v13}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    goto :goto_3

    .line 137
    .end local v2    # "i$":Ljava/util/Iterator;
    .end local v3    # "key":Ljava/lang/String;
    :cond_7
    const-string v13, "UniSDK Mgr"

    const-string v14, "checkCurrentPlatform, inst=%s, sdkMap=%s"

    const/4 v15, 0x2

    new-array v15, v15, [Ljava/lang/Object;

    const/16 v16, 0x0

    sget-object v17, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual/range {v17 .. v17}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v17

    aput-object v17, v15, v16

    const/16 v16, 0x1

    invoke-virtual {v11}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v17

    aput-object v17, v15, v16

    invoke-static {v14, v15}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v14

    invoke-static {v13, v14}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 139
    sget-object v13, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    sget-object v14, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    invoke-virtual {v13, v14}, Lcom/netease/ntunisdk/base/SdkBase;->setSdkMap(Ljava/util/Map;)V

    .line 140
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->clearSdkMap()V

    .line 142
    if-eqz v4, :cond_1

    sget v13, Landroid/os/Build$VERSION;->SDK_INT:I

    const/16 v14, 0xe

    if-lt v13, v14, :cond_1

    .line 144
    :try_start_2
    invoke-virtual {v4}, Ldalvik/system/DexFile;->close()V
    :try_end_2
    .catch Ljava/lang/Throwable; {:try_start_2 .. :try_end_2} :catch_1

    goto/16 :goto_2

    .line 145
    :catch_1
    move-exception v8

    .line 146
    .local v8, "localThrowable2":Ljava/lang/Throwable;
    invoke-virtual {v8}, Ljava/lang/Throwable;->printStackTrace()V

    goto/16 :goto_2

    .line 98
    .end local v4    # "localDexFile":Ldalvik/system/DexFile;
    .end local v8    # "localThrowable2":Ljava/lang/Throwable;
    .end local v11    # "sb":Ljava/lang/StringBuilder;
    .restart local v5    # "localDexFile":Ldalvik/system/DexFile;
    .restart local v6    # "localEnumeration":Ljava/util/Enumeration;
    .restart local v9    # "paramPackageInfo":Landroid/content/pm/PackageInfo;
    .restart local v10    # "pm":Landroid/content/pm/PackageManager;
    :catch_2
    move-exception v7

    move-object v4, v5

    .end local v5    # "localDexFile":Ldalvik/system/DexFile;
    .restart local v4    # "localDexFile":Ldalvik/system/DexFile;
    goto/16 :goto_1
.end method

.method private static clearSdkMap()V
    .locals 1

    .prologue
    .line 77
    sget-object v0, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    invoke-interface {v0}, Ljava/util/Map;->clear()V

    .line 78
    const/4 v0, 0x0

    sput-object v0, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    .line 79
    return-void
.end method

.method public static destroyInst()V
    .locals 1

    .prologue
    .line 73
    const/4 v0, 0x0

    sput-object v0, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    .line 74
    return-void
.end method

.method public static getInst()Lcom/netease/ntunisdk/base/GamerInterface;
    .locals 1

    .prologue
    .line 66
    sget-object v0, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    return-object v0
.end method

.method private static getInstFromSdkmap()V
    .locals 4

    .prologue
    .line 153
    sget-object v2, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    if-nez v2, :cond_0

    .line 154
    sget-object v2, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    const-string v3, "playpark"

    invoke-interface {v2, v3}, Ljava/util/Map;->containsKey(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_1

    .line 155
    sget-object v2, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    const-string v3, "playpark"

    invoke-interface {v2, v3}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    sput-object v2, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    .line 156
    sget-object v2, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    const-string v3, "playpark"

    invoke-interface {v2, v3}, Ljava/util/Map;->remove(Ljava/lang/Object;)Ljava/lang/Object;

    .line 165
    .local v0, "i$":Ljava/util/Iterator;
    :cond_0
    :goto_0
    return-void

    .line 158
    .end local v0    # "i$":Ljava/util/Iterator;
    :cond_1
    sget-object v2, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    invoke-interface {v2}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v2

    invoke-interface {v2}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .restart local v0    # "i$":Ljava/util/Iterator;
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v2

    if-eqz v2, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 159
    .local v1, "key":Ljava/lang/String;
    sget-object v2, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    invoke-interface {v2, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    sput-object v2, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    .line 160
    sget-object v2, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    invoke-interface {v2, v1}, Ljava/util/Map;->remove(Ljava/lang/Object;)Ljava/lang/Object;

    goto :goto_0
.end method

.method public static init(Landroid/content/Context;)V
    .locals 2
    .param p0, "ctx"    # Landroid/content/Context;

    .prologue
    .line 39
    sget-object v0, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    if-nez v0, :cond_0

    .line 40
    const/4 v0, 0x0

    invoke-static {p0, v0}, Lcom/netease/ntunisdk/base/SdkMgr;->checkCurrentPlatform(Landroid/content/Context;Ljava/lang/String;)V

    .line 45
    :goto_0
    return-void

    .line 42
    :cond_0
    const-string v0, "UniSDK Mgr"

    const-string v1, "setCtx again"

    invoke-static {v0, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 43
    sget-object v0, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v0, p0}, Lcom/netease/ntunisdk/base/SdkBase;->setCtx(Landroid/content/Context;)V

    goto :goto_0
.end method

.method public static init(Landroid/content/Context;Ljava/lang/String;)V
    .locals 2
    .param p0, "ctx"    # Landroid/content/Context;
    .param p1, "channalCode"    # Ljava/lang/String;

    .prologue
    .line 53
    sget-object v0, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    if-nez v0, :cond_0

    .line 54
    invoke-static {p0, p1}, Lcom/netease/ntunisdk/base/SdkMgr;->checkCurrentPlatform(Landroid/content/Context;Ljava/lang/String;)V

    .line 59
    :goto_0
    return-void

    .line 56
    :cond_0
    const-string v0, "UniSDK Mgr"

    const-string v1, "setCtx again"

    invoke-static {v0, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 57
    sget-object v0, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v0, p0}, Lcom/netease/ntunisdk/base/SdkBase;->setCtx(Landroid/content/Context;)V

    goto :goto_0
.end method

.method private static newInstanceByClass(Ljava/lang/String;Landroid/content/Context;Ljava/lang/String;)V
    .locals 12
    .param p0, "str"    # Ljava/lang/String;
    .param p1, "ctx"    # Landroid/content/Context;
    .param p2, "channalCode"    # Ljava/lang/String;

    .prologue
    const/4 v11, 0x1

    .line 206
    :try_start_0
    const-string v7, "SdkUnisdkSingle"

    invoke-virtual {p0, v7}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v7

    if-eqz v7, :cond_1

    .line 207
    const-string v7, "UniSDK Mgr"

    const-string v8, "newInstanceByClass pass SdkUnisdkSingle"

    invoke-static {v7, v8}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 306
    :cond_0
    :goto_0
    return-void

    .line 211
    :cond_1
    const-string v7, "UniSDK Mgr"

    const-string v8, "Class.forName(%s)"

    const/4 v9, 0x1

    new-array v9, v9, [Ljava/lang/Object;

    const/4 v10, 0x0

    aput-object p0, v9, v10

    invoke-static {v8, v9}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v8

    invoke-static {v7, v8}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 212
    invoke-static {p0}, Ljava/lang/Class;->forName(Ljava/lang/String;)Ljava/lang/Class;

    move-result-object v0

    .line 213
    .local v0, "clazz":Ljava/lang/Class;, "Ljava/lang/Class<*>;"
    invoke-virtual {v0}, Ljava/lang/Class;->getConstructors()[Ljava/lang/reflect/Constructor;

    move-result-object v1

    .line 214
    .local v1, "cons":[Ljava/lang/reflect/Constructor;, "[Ljava/lang/reflect/Constructor<*>;"
    if-eqz v1, :cond_0

    .line 215
    const/4 v3, 0x0

    .local v3, "i":I
    :goto_1
    array-length v7, v1

    if-ge v3, v7, :cond_0

    .line 216
    aget-object v7, v1, v3

    invoke-virtual {v7}, Ljava/lang/reflect/Constructor;->getGenericParameterTypes()[Ljava/lang/reflect/Type;

    move-result-object v6

    .line 217
    .local v6, "types":[Ljava/lang/reflect/Type;
    if-eqz v6, :cond_2

    array-length v7, v6

    if-ne v7, v11, :cond_2

    .line 218
    aget-object v7, v1, v3

    const/4 v8, 0x1

    new-array v8, v8, [Ljava/lang/Object;

    const/4 v9, 0x0

    aput-object p1, v8, v9

    invoke-virtual {v7, v8}, Ljava/lang/reflect/Constructor;->newInstance([Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v4

    check-cast v4, Lcom/netease/ntunisdk/base/SdkBase;

    .line 219
    .local v4, "sdk":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v4}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v5

    .line 222
    .local v5, "tmpChannel":Ljava/lang/String;
    const-string v7, "common"

    invoke-virtual {v7, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-eqz v7, :cond_3

    sget-object v7, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    if-nez v7, :cond_2

    sget-object v7, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    invoke-interface {v7}, Ljava/util/Map;->size()I

    move-result v7

    if-eqz v7, :cond_3

    .line 215
    .end local v4    # "sdk":Lcom/netease/ntunisdk/base/SdkBase;
    .end local v5    # "tmpChannel":Ljava/lang/String;
    :cond_2
    add-int/lit8 v3, v3, 0x1

    goto :goto_1

    .line 224
    .restart local v4    # "sdk":Lcom/netease/ntunisdk/base/SdkBase;
    .restart local v5    # "tmpChannel":Ljava/lang/String;
    :cond_3
    sget-object v7, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    if-eqz v7, :cond_4

    .line 225
    const-string v7, "common"

    sget-object v8, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v8}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v8

    invoke-virtual {v7, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-eqz v7, :cond_4

    .line 226
    const/4 v7, 0x0

    sput-object v7, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    .line 230
    :cond_4
    const-string v7, "UniSDK Mgr"

    new-instance v8, Ljava/lang/StringBuilder;

    invoke-direct {v8}, Ljava/lang/StringBuilder;-><init>()V

    const-string v9, "new instance "

    invoke-virtual {v8, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    const-string v9, ": "

    invoke-virtual {v8, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v8

    invoke-static {v7, v8}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 238
    const-string v7, "cc_record"

    invoke-virtual {v5, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_8

    const-string v7, "nstore"

    invoke-virtual {v5, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_8

    const-string v7, "mm_10086"

    invoke-virtual {v5, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_8

    const-string v7, "wo_app"

    invoke-virtual {v5, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_8

    const-string v7, "mdo_mm_10086"

    invoke-virtual {v5, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_8

    const-string v7, "play_telecom"

    invoke-virtual {v5, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-eqz v7, :cond_5

    const-string v7, "PlayLogin"

    invoke-virtual {p0, v7}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v7

    if-eqz v7, :cond_8

    :cond_5
    const-string v7, "play"

    invoke-virtual {v5, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-eqz v7, :cond_6

    const-string v7, "Yixin"

    invoke-virtual {p0, v7}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v7

    if-eqz v7, :cond_8

    :cond_6
    const-string v7, "playpark"

    invoke-virtual {v5, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_8

    const-string v7, "google_play"

    invoke-virtual {v5, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_8

    const-string v7, "google_play_ck"

    invoke-virtual {v5, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_8

    const-string v7, "tstore_ck"

    invoke-virtual {v5, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_8

    const-string v7, "nstore_ck"

    invoke-virtual {v5, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_8

    const-string v7, "olleh_ck"

    invoke-virtual {v5, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_8

    const-string v7, "lgustore"

    invoke-virtual {v5, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_8

    const-string v7, "joybomb"

    invoke-virtual {v5, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-eqz v7, :cond_7

    const-string v7, "SdkJoybombPay"

    invoke-virtual {p0, v7}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v7

    if-nez v7, :cond_8

    :cond_7
    const-string v7, "google_play_jn"

    invoke-virtual {v5, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_8

    const-string v7, "xinyou"

    invoke-virtual {v5, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_8

    const-string v7, "helpshift"

    invoke-virtual {v5, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_8

    const-string v7, "gpGameSrv"

    invoke-virtual {v5, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_8

    const-string v7, "swrve"

    invoke-virtual {v5, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-eqz v7, :cond_9

    .line 260
    :cond_8
    sget-object v7, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    invoke-interface {v7, v5, v4}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
    :try_end_0
    .catch Ljava/lang/ClassNotFoundException; {:try_start_0 .. :try_end_0} :catch_0
    .catch Ljava/lang/InstantiationException; {:try_start_0 .. :try_end_0} :catch_1
    .catch Ljava/lang/IllegalAccessException; {:try_start_0 .. :try_end_0} :catch_2
    .catch Ljava/lang/IllegalArgumentException; {:try_start_0 .. :try_end_0} :catch_3
    .catch Ljava/lang/reflect/InvocationTargetException; {:try_start_0 .. :try_end_0} :catch_4

    goto/16 :goto_0

    .line 289
    .end local v0    # "clazz":Ljava/lang/Class;, "Ljava/lang/Class<*>;"
    .end local v1    # "cons":[Ljava/lang/reflect/Constructor;, "[Ljava/lang/reflect/Constructor<*>;"
    .end local v3    # "i":I
    .end local v4    # "sdk":Lcom/netease/ntunisdk/base/SdkBase;
    .end local v5    # "tmpChannel":Ljava/lang/String;
    .end local v6    # "types":[Ljava/lang/reflect/Type;
    :catch_0
    move-exception v2

    .line 290
    .local v2, "e":Ljava/lang/ClassNotFoundException;
    invoke-virtual {v2}, Ljava/lang/ClassNotFoundException;->printStackTrace()V

    .line 291
    const-string v7, "UniSDK Mgr"

    invoke-virtual {v2}, Ljava/lang/ClassNotFoundException;->getMessage()Ljava/lang/String;

    move-result-object v8

    invoke-static {v7, v8}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    goto/16 :goto_0

    .line 261
    .end local v2    # "e":Ljava/lang/ClassNotFoundException;
    .restart local v0    # "clazz":Ljava/lang/Class;, "Ljava/lang/Class<*>;"
    .restart local v1    # "cons":[Ljava/lang/reflect/Constructor;, "[Ljava/lang/reflect/Constructor<*>;"
    .restart local v3    # "i":I
    .restart local v4    # "sdk":Lcom/netease/ntunisdk/base/SdkBase;
    .restart local v5    # "tmpChannel":Ljava/lang/String;
    .restart local v6    # "types":[Ljava/lang/reflect/Type;
    :cond_9
    :try_start_1
    const-string v7, "g_10086"

    invoke-virtual {v5, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_a

    const-string v7, "netease"

    invoke-virtual {v5, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-eqz v7, :cond_c

    .line 264
    :cond_a
    sget-object v7, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    if-nez v7, :cond_b

    .line 265
    sput-object v4, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;
    :try_end_1
    .catch Ljava/lang/ClassNotFoundException; {:try_start_1 .. :try_end_1} :catch_0
    .catch Ljava/lang/InstantiationException; {:try_start_1 .. :try_end_1} :catch_1
    .catch Ljava/lang/IllegalAccessException; {:try_start_1 .. :try_end_1} :catch_2
    .catch Ljava/lang/IllegalArgumentException; {:try_start_1 .. :try_end_1} :catch_3
    .catch Ljava/lang/reflect/InvocationTargetException; {:try_start_1 .. :try_end_1} :catch_4

    goto/16 :goto_0

    .line 292
    .end local v0    # "clazz":Ljava/lang/Class;, "Ljava/lang/Class<*>;"
    .end local v1    # "cons":[Ljava/lang/reflect/Constructor;, "[Ljava/lang/reflect/Constructor<*>;"
    .end local v3    # "i":I
    .end local v4    # "sdk":Lcom/netease/ntunisdk/base/SdkBase;
    .end local v5    # "tmpChannel":Ljava/lang/String;
    .end local v6    # "types":[Ljava/lang/reflect/Type;
    :catch_1
    move-exception v2

    .line 293
    .local v2, "e":Ljava/lang/InstantiationException;
    invoke-virtual {v2}, Ljava/lang/InstantiationException;->printStackTrace()V

    .line 294
    const-string v7, "UniSDK Mgr"

    invoke-virtual {v2}, Ljava/lang/InstantiationException;->getMessage()Ljava/lang/String;

    move-result-object v8

    invoke-static {v7, v8}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    goto/16 :goto_0

    .line 267
    .end local v2    # "e":Ljava/lang/InstantiationException;
    .restart local v0    # "clazz":Ljava/lang/Class;, "Ljava/lang/Class<*>;"
    .restart local v1    # "cons":[Ljava/lang/reflect/Constructor;, "[Ljava/lang/reflect/Constructor<*>;"
    .restart local v3    # "i":I
    .restart local v4    # "sdk":Lcom/netease/ntunisdk/base/SdkBase;
    .restart local v5    # "tmpChannel":Ljava/lang/String;
    .restart local v6    # "types":[Ljava/lang/reflect/Type;
    :cond_b
    :try_start_2
    sget-object v7, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    invoke-interface {v7, v5, v4}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
    :try_end_2
    .catch Ljava/lang/ClassNotFoundException; {:try_start_2 .. :try_end_2} :catch_0
    .catch Ljava/lang/InstantiationException; {:try_start_2 .. :try_end_2} :catch_1
    .catch Ljava/lang/IllegalAccessException; {:try_start_2 .. :try_end_2} :catch_2
    .catch Ljava/lang/IllegalArgumentException; {:try_start_2 .. :try_end_2} :catch_3
    .catch Ljava/lang/reflect/InvocationTargetException; {:try_start_2 .. :try_end_2} :catch_4

    goto/16 :goto_0

    .line 295
    .end local v0    # "clazz":Ljava/lang/Class;, "Ljava/lang/Class<*>;"
    .end local v1    # "cons":[Ljava/lang/reflect/Constructor;, "[Ljava/lang/reflect/Constructor<*>;"
    .end local v3    # "i":I
    .end local v4    # "sdk":Lcom/netease/ntunisdk/base/SdkBase;
    .end local v5    # "tmpChannel":Ljava/lang/String;
    .end local v6    # "types":[Ljava/lang/reflect/Type;
    :catch_2
    move-exception v2

    .line 296
    .local v2, "e":Ljava/lang/IllegalAccessException;
    invoke-virtual {v2}, Ljava/lang/IllegalAccessException;->printStackTrace()V

    .line 297
    const-string v7, "UniSDK Mgr"

    invoke-virtual {v2}, Ljava/lang/IllegalAccessException;->getMessage()Ljava/lang/String;

    move-result-object v8

    invoke-static {v7, v8}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    goto/16 :goto_0

    .line 271
    .end local v2    # "e":Ljava/lang/IllegalAccessException;
    .restart local v0    # "clazz":Ljava/lang/Class;, "Ljava/lang/Class<*>;"
    .restart local v1    # "cons":[Ljava/lang/reflect/Constructor;, "[Ljava/lang/reflect/Constructor<*>;"
    .restart local v3    # "i":I
    .restart local v4    # "sdk":Lcom/netease/ntunisdk/base/SdkBase;
    .restart local v5    # "tmpChannel":Ljava/lang/String;
    .restart local v6    # "types":[Ljava/lang/reflect/Type;
    :cond_c
    if-eqz p2, :cond_d

    :try_start_3
    invoke-virtual {v5, p2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-eqz v7, :cond_0

    .line 272
    :cond_d
    sget-object v7, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    if-nez v7, :cond_e

    .line 273
    sput-object v4, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;
    :try_end_3
    .catch Ljava/lang/ClassNotFoundException; {:try_start_3 .. :try_end_3} :catch_0
    .catch Ljava/lang/InstantiationException; {:try_start_3 .. :try_end_3} :catch_1
    .catch Ljava/lang/IllegalAccessException; {:try_start_3 .. :try_end_3} :catch_2
    .catch Ljava/lang/IllegalArgumentException; {:try_start_3 .. :try_end_3} :catch_3
    .catch Ljava/lang/reflect/InvocationTargetException; {:try_start_3 .. :try_end_3} :catch_4

    goto/16 :goto_0

    .line 298
    .end local v0    # "clazz":Ljava/lang/Class;, "Ljava/lang/Class<*>;"
    .end local v1    # "cons":[Ljava/lang/reflect/Constructor;, "[Ljava/lang/reflect/Constructor<*>;"
    .end local v3    # "i":I
    .end local v4    # "sdk":Lcom/netease/ntunisdk/base/SdkBase;
    .end local v5    # "tmpChannel":Ljava/lang/String;
    .end local v6    # "types":[Ljava/lang/reflect/Type;
    :catch_3
    move-exception v2

    .line 299
    .local v2, "e":Ljava/lang/IllegalArgumentException;
    invoke-virtual {v2}, Ljava/lang/IllegalArgumentException;->printStackTrace()V

    .line 300
    const-string v7, "UniSDK Mgr"

    invoke-virtual {v2}, Ljava/lang/IllegalArgumentException;->getMessage()Ljava/lang/String;

    move-result-object v8

    invoke-static {v7, v8}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    goto/16 :goto_0

    .line 274
    .end local v2    # "e":Ljava/lang/IllegalArgumentException;
    .restart local v0    # "clazz":Ljava/lang/Class;, "Ljava/lang/Class<*>;"
    .restart local v1    # "cons":[Ljava/lang/reflect/Constructor;, "[Ljava/lang/reflect/Constructor<*>;"
    .restart local v3    # "i":I
    .restart local v4    # "sdk":Lcom/netease/ntunisdk/base/SdkBase;
    .restart local v5    # "tmpChannel":Ljava/lang/String;
    .restart local v6    # "types":[Ljava/lang/reflect/Type;
    :cond_e
    :try_start_4
    sget-object v7, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v7}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v7

    const-string v8, "g_10086"

    invoke-virtual {v7, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_f

    sget-object v7, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v7}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v7

    const-string v8, "netease"

    invoke-virtual {v7, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-eqz v7, :cond_10

    .line 277
    :cond_f
    sget-object v7, Lcom/netease/ntunisdk/base/SdkMgr;->sdkMap:Ljava/util/Map;

    sget-object v8, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v8}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v8

    sget-object v9, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-interface {v7, v8, v9}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 278
    sput-object v4, Lcom/netease/ntunisdk/base/SdkMgr;->inst:Lcom/netease/ntunisdk/base/SdkBase;
    :try_end_4
    .catch Ljava/lang/ClassNotFoundException; {:try_start_4 .. :try_end_4} :catch_0
    .catch Ljava/lang/InstantiationException; {:try_start_4 .. :try_end_4} :catch_1
    .catch Ljava/lang/IllegalAccessException; {:try_start_4 .. :try_end_4} :catch_2
    .catch Ljava/lang/IllegalArgumentException; {:try_start_4 .. :try_end_4} :catch_3
    .catch Ljava/lang/reflect/InvocationTargetException; {:try_start_4 .. :try_end_4} :catch_4

    goto/16 :goto_0

    .line 301
    .end local v0    # "clazz":Ljava/lang/Class;, "Ljava/lang/Class<*>;"
    .end local v1    # "cons":[Ljava/lang/reflect/Constructor;, "[Ljava/lang/reflect/Constructor<*>;"
    .end local v3    # "i":I
    .end local v4    # "sdk":Lcom/netease/ntunisdk/base/SdkBase;
    .end local v5    # "tmpChannel":Ljava/lang/String;
    .end local v6    # "types":[Ljava/lang/reflect/Type;
    :catch_4
    move-exception v2

    .line 302
    .local v2, "e":Ljava/lang/reflect/InvocationTargetException;
    invoke-virtual {v2}, Ljava/lang/reflect/InvocationTargetException;->printStackTrace()V

    .line 303
    const-string v7, "UniSDK Mgr"

    invoke-virtual {v2}, Ljava/lang/reflect/InvocationTargetException;->getMessage()Ljava/lang/String;

    move-result-object v8

    invoke-static {v7, v8}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    goto/16 :goto_0

    .line 280
    .end local v2    # "e":Ljava/lang/reflect/InvocationTargetException;
    .restart local v0    # "clazz":Ljava/lang/Class;, "Ljava/lang/Class<*>;"
    .restart local v1    # "cons":[Ljava/lang/reflect/Constructor;, "[Ljava/lang/reflect/Constructor<*>;"
    .restart local v3    # "i":I
    .restart local v4    # "sdk":Lcom/netease/ntunisdk/base/SdkBase;
    .restart local v5    # "tmpChannel":Ljava/lang/String;
    .restart local v6    # "types":[Ljava/lang/reflect/Type;
    :cond_10
    :try_start_5
    const-string v7, "UniSDK Mgr"

    const-string v8, "dup common SdkBase!!!"

    invoke-static {v7, v8}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I
    :try_end_5
    .catch Ljava/lang/ClassNotFoundException; {:try_start_5 .. :try_end_5} :catch_0
    .catch Ljava/lang/InstantiationException; {:try_start_5 .. :try_end_5} :catch_1
    .catch Ljava/lang/IllegalAccessException; {:try_start_5 .. :try_end_5} :catch_2
    .catch Ljava/lang/IllegalArgumentException; {:try_start_5 .. :try_end_5} :catch_3
    .catch Ljava/lang/reflect/InvocationTargetException; {:try_start_5 .. :try_end_5} :catch_4

    goto/16 :goto_0
.end method
