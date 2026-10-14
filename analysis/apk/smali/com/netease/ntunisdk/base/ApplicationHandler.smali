.class public Lcom/netease/ntunisdk/base/ApplicationHandler;
.super Landroid/app/Application;
.source "ApplicationHandler.java"


# static fields
.field public static final TAG:Ljava/lang/String; = "UniSDK ApplicationHandler"

.field private static sdkMap:Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Map",
            "<",
            "Ljava/lang/String;",
            "Lcom/netease/ntunisdk/base/SdkApplication;",
            ">;"
        }
    .end annotation
.end field


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .prologue
    .line 30
    new-instance v0, Ljava/util/HashMap;

    invoke-direct {v0}, Ljava/util/HashMap;-><init>()V

    sput-object v0, Lcom/netease/ntunisdk/base/ApplicationHandler;->sdkMap:Ljava/util/Map;

    return-void
.end method

.method public constructor <init>()V
    .locals 0

    .prologue
    .line 26
    invoke-direct {p0}, Landroid/app/Application;-><init>()V

    return-void
.end method

.method private static assets2Class(Landroid/content/Context;)Ljava/lang/String;
    .locals 10
    .param p0, "ctx"    # Landroid/content/Context;

    .prologue
    .line 162
    const/4 v5, 0x0

    .line 163
    .local v5, "jsonStr":Ljava/lang/String;
    const-string v2, "ntunisdk_data"

    .line 165
    .local v2, "fileName":Ljava/lang/String;
    :try_start_0
    invoke-virtual {p0}, Landroid/content/Context;->getAssets()Landroid/content/res/AssetManager;

    move-result-object v7

    const/4 v8, 0x3

    invoke-virtual {v7, v2, v8}, Landroid/content/res/AssetManager;->open(Ljava/lang/String;I)Ljava/io/InputStream;

    move-result-object v4

    .line 167
    .local v4, "is":Ljava/io/InputStream;
    invoke-virtual {v4}, Ljava/io/InputStream;->available()I

    move-result v3

    .line 168
    .local v3, "index":I
    if-nez v3, :cond_0

    .line 169
    const-string v7, "UniSDK ApplicationHandler"

    const-string v8, "ntunisdk_data empty"

    invoke-static {v7, v8}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    move-object v6, v5

    .line 181
    .end local v3    # "index":I
    .end local v4    # "is":Ljava/io/InputStream;
    .end local v5    # "jsonStr":Ljava/lang/String;
    .local v6, "jsonStr":Ljava/lang/String;
    :goto_0
    return-object v6

    .line 172
    .end local v6    # "jsonStr":Ljava/lang/String;
    .restart local v3    # "index":I
    .restart local v4    # "is":Ljava/io/InputStream;
    .restart local v5    # "jsonStr":Ljava/lang/String;
    :cond_0
    new-array v0, v3, [B

    .line 173
    .local v0, "data":[B
    invoke-virtual {v4, v0}, Ljava/io/InputStream;->read([B)I

    .line 175
    new-instance v6, Ljava/lang/String;

    const-string v7, "UTF-8"

    invoke-direct {v6, v0, v7}, Ljava/lang/String;-><init>([BLjava/lang/String;)V
    :try_end_0
    .catch Ljava/io/IOException; {:try_start_0 .. :try_end_0} :catch_0

    .end local v5    # "jsonStr":Ljava/lang/String;
    .restart local v6    # "jsonStr":Ljava/lang/String;
    move-object v5, v6

    .line 180
    .end local v0    # "data":[B
    .end local v3    # "index":I
    .end local v4    # "is":Ljava/io/InputStream;
    .end local v6    # "jsonStr":Ljava/lang/String;
    .restart local v5    # "jsonStr":Ljava/lang/String;
    :goto_1
    const-string v7, "UniSDK ApplicationHandler"

    new-instance v8, Ljava/lang/StringBuilder;

    invoke-direct {v8}, Ljava/lang/StringBuilder;-><init>()V

    const-string v9, "ntunisdk_data:"

    invoke-virtual {v8, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v8

    invoke-static {v7, v8}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    move-object v6, v5

    .line 181
    .end local v5    # "jsonStr":Ljava/lang/String;
    .restart local v6    # "jsonStr":Ljava/lang/String;
    goto :goto_0

    .line 176
    .end local v6    # "jsonStr":Ljava/lang/String;
    .restart local v5    # "jsonStr":Ljava/lang/String;
    :catch_0
    move-exception v1

    .line 177
    .local v1, "e":Ljava/io/IOException;
    const-string v7, "UniSDK ApplicationHandler"

    const-string v8, "ntunisdk_data config not found"

    invoke-static {v7, v8}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    goto :goto_1
.end method

.method private static clearSdkMap()V
    .locals 1

    .prologue
    .line 70
    sget-object v0, Lcom/netease/ntunisdk/base/ApplicationHandler;->sdkMap:Ljava/util/Map;

    if-eqz v0, :cond_0

    .line 71
    sget-object v0, Lcom/netease/ntunisdk/base/ApplicationHandler;->sdkMap:Ljava/util/Map;

    invoke-interface {v0}, Ljava/util/Map;->clear()V

    .line 74
    :cond_0
    return-void
.end method

.method public static getSdkApplication(Ljava/lang/String;)Lcom/netease/ntunisdk/base/SdkApplication;
    .locals 1
    .param p0, "key"    # Ljava/lang/String;

    .prologue
    .line 77
    sget-object v0, Lcom/netease/ntunisdk/base/ApplicationHandler;->sdkMap:Ljava/util/Map;

    invoke-interface {v0, p0}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Lcom/netease/ntunisdk/base/SdkApplication;

    return-object v0
.end method

.method public static handleOnApplicationAttachBaseContext(Landroid/content/Context;)V
    .locals 5
    .param p0, "base"    # Landroid/content/Context;

    .prologue
    .line 49
    invoke-static {p0}, Lcom/netease/ntunisdk/base/ApplicationHandler;->initAllApplication(Landroid/content/Context;)V

    .line 51
    const-string v2, "UniSDK ApplicationHandler"

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    const-string v4, "sdkMap size:"

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    sget-object v4, Lcom/netease/ntunisdk/base/ApplicationHandler;->sdkMap:Ljava/util/Map;

    invoke-interface {v4}, Ljava/util/Map;->size()I

    move-result v4

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 52
    sget-object v2, Lcom/netease/ntunisdk/base/ApplicationHandler;->sdkMap:Ljava/util/Map;

    invoke-interface {v2}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v2

    invoke-interface {v2}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v2

    if-eqz v2, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 53
    .local v1, "key":Ljava/lang/String;
    sget-object v2, Lcom/netease/ntunisdk/base/ApplicationHandler;->sdkMap:Ljava/util/Map;

    invoke-interface {v2, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkApplication;

    invoke-virtual {v2, p0}, Lcom/netease/ntunisdk/base/SdkApplication;->handleOnApplicationAttachBaseContext(Landroid/content/Context;)V

    goto :goto_0

    .line 55
    .end local v1    # "key":Ljava/lang/String;
    :cond_0
    return-void
.end method

.method public static handleOnApplicationOnCreate(Landroid/content/Context;)V
    .locals 3
    .param p0, "base"    # Landroid/content/Context;

    .prologue
    .line 62
    sget-object v2, Lcom/netease/ntunisdk/base/ApplicationHandler;->sdkMap:Ljava/util/Map;

    invoke-interface {v2}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v2

    invoke-interface {v2}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v2

    if-eqz v2, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 63
    .local v1, "key":Ljava/lang/String;
    sget-object v2, Lcom/netease/ntunisdk/base/ApplicationHandler;->sdkMap:Ljava/util/Map;

    invoke-interface {v2, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkApplication;

    invoke-virtual {v2, p0}, Lcom/netease/ntunisdk/base/SdkApplication;->handleOnApplicationOnCreate(Landroid/content/Context;)V

    goto :goto_0

    .line 66
    .end local v1    # "key":Ljava/lang/String;
    :cond_0
    invoke-static {}, Lcom/netease/ntunisdk/base/ApplicationHandler;->clearSdkMap()V

    .line 67
    return-void
.end method

.method private static initAllApplication(Landroid/content/Context;)V
    .locals 28
    .param p0, "ctx"    # Landroid/content/Context;

    .prologue
    .line 81
    const/4 v12, 0x0

    .line 82
    .local v12, "localDexFile":Ldalvik/system/DexFile;
    new-instance v23, Ljava/util/ArrayList;

    invoke-direct/range {v23 .. v23}, Ljava/util/ArrayList;-><init>()V

    .line 84
    .local v23, "unisdkList":Ljava/util/List;, "Ljava/util/List<Ljava/lang/String;>;"
    invoke-static/range {p0 .. p0}, Lcom/netease/ntunisdk/base/ApplicationHandler;->assets2Class(Landroid/content/Context;)Ljava/lang/String;

    move-result-object v4

    .line 85
    .local v4, "assetsClasses":Ljava/lang/String;
    if-eqz v4, :cond_1

    .line 86
    const-string v24, ";"

    move-object/from16 v0, v24

    invoke-virtual {v4, v0}, Ljava/lang/String;->split(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object v5

    .line 87
    .local v5, "claNames":[Ljava/lang/String;
    move-object v3, v5

    .local v3, "arr$":[Ljava/lang/String;
    array-length v11, v3

    .local v11, "len$":I
    const/4 v10, 0x0

    .local v10, "i$":I
    :goto_0
    if-ge v10, v11, :cond_1

    aget-object v20, v3, v10

    .line 88
    .local v20, "str":Ljava/lang/String;
    invoke-virtual/range {v20 .. v20}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v24

    const-string v25, "Application"

    invoke-virtual/range {v24 .. v25}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v24

    if-eqz v24, :cond_0

    .line 89
    new-instance v24, Ljava/lang/StringBuilder;

    invoke-direct/range {v24 .. v24}, Ljava/lang/StringBuilder;-><init>()V

    const-string v25, "com.netease.ntunisdk."

    invoke-virtual/range {v24 .. v25}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v24

    invoke-virtual/range {v20 .. v20}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v25

    invoke-virtual/range {v24 .. v25}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v24

    invoke-virtual/range {v24 .. v24}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v24

    invoke-interface/range {v23 .. v24}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 87
    :cond_0
    add-int/lit8 v10, v10, 0x1

    goto :goto_0

    .line 94
    .end local v3    # "arr$":[Ljava/lang/String;
    .end local v5    # "claNames":[Ljava/lang/String;
    .end local v10    # "i$":I
    .end local v11    # "len$":I
    .end local v20    # "str":Ljava/lang/String;
    :cond_1
    invoke-interface/range {v23 .. v23}, Ljava/util/List;->isEmpty()Z

    move-result v24

    if-eqz v24, :cond_5

    .line 95
    const/4 v14, 0x0

    .line 96
    .local v14, "localEnumeration":Ljava/util/Enumeration;
    invoke-virtual/range {p0 .. p0}, Landroid/content/Context;->getPackageManager()Landroid/content/pm/PackageManager;

    move-result-object v18

    .line 98
    .local v18, "pm":Landroid/content/pm/PackageManager;
    :try_start_0
    invoke-virtual/range {p0 .. p0}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    move-result-object v24

    const/16 v25, 0x0

    move-object/from16 v0, v18

    move-object/from16 v1, v24

    move/from16 v2, v25

    invoke-virtual {v0, v1, v2}, Landroid/content/pm/PackageManager;->getPackageInfo(Ljava/lang/String;I)Landroid/content/pm/PackageInfo;

    move-result-object v17

    .line 99
    .local v17, "paramPackageInfo":Landroid/content/pm/PackageInfo;
    new-instance v13, Ldalvik/system/DexFile;

    move-object/from16 v0, v17

    iget-object v0, v0, Landroid/content/pm/PackageInfo;->applicationInfo:Landroid/content/pm/ApplicationInfo;

    move-object/from16 v24, v0

    move-object/from16 v0, v24

    iget-object v0, v0, Landroid/content/pm/ApplicationInfo;->sourceDir:Ljava/lang/String;

    move-object/from16 v24, v0

    move-object/from16 v0, v24

    invoke-direct {v13, v0}, Ldalvik/system/DexFile;-><init>(Ljava/lang/String;)V
    :try_end_0
    .catch Ljava/lang/Throwable; {:try_start_0 .. :try_end_0} :catch_0

    .line 100
    .end local v12    # "localDexFile":Ldalvik/system/DexFile;
    .local v13, "localDexFile":Ldalvik/system/DexFile;
    :try_start_1
    invoke-virtual {v13}, Ldalvik/system/DexFile;->entries()Ljava/util/Enumeration;
    :try_end_1
    .catch Ljava/lang/Throwable; {:try_start_1 .. :try_end_1} :catch_7

    move-result-object v14

    .line 106
    :cond_2
    :goto_1
    if-eqz v14, :cond_4

    invoke-interface {v14}, Ljava/util/Enumeration;->hasMoreElements()Z

    move-result v24

    if-eqz v24, :cond_4

    .line 107
    invoke-interface {v14}, Ljava/util/Enumeration;->nextElement()Ljava/lang/Object;

    move-result-object v20

    check-cast v20, Ljava/lang/String;

    .line 108
    .restart local v20    # "str":Ljava/lang/String;
    const-string v24, "com.netease.ntunisdk.Application"

    move-object/from16 v0, v20

    move-object/from16 v1, v24

    invoke-virtual {v0, v1}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v24

    if-eqz v24, :cond_2

    const-string v24, "$"

    move-object/from16 v0, v20

    move-object/from16 v1, v24

    invoke-virtual {v0, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v24

    if-nez v24, :cond_2

    .line 109
    move-object/from16 v0, v23

    move-object/from16 v1, v20

    invoke-interface {v0, v1}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    goto :goto_1

    .line 101
    .end local v13    # "localDexFile":Ldalvik/system/DexFile;
    .end local v17    # "paramPackageInfo":Landroid/content/pm/PackageInfo;
    .end local v20    # "str":Ljava/lang/String;
    .restart local v12    # "localDexFile":Ldalvik/system/DexFile;
    :catch_0
    move-exception v15

    .line 102
    .local v15, "localThrowable1":Ljava/lang/Throwable;
    :goto_2
    invoke-virtual {v15}, Ljava/lang/Throwable;->printStackTrace()V

    .line 155
    .end local v14    # "localEnumeration":Ljava/util/Enumeration;
    .end local v15    # "localThrowable1":Ljava/lang/Throwable;
    .end local v18    # "pm":Landroid/content/pm/PackageManager;
    :cond_3
    :goto_3
    return-void

    .end local v12    # "localDexFile":Ldalvik/system/DexFile;
    .restart local v13    # "localDexFile":Ldalvik/system/DexFile;
    .restart local v14    # "localEnumeration":Ljava/util/Enumeration;
    .restart local v17    # "paramPackageInfo":Landroid/content/pm/PackageInfo;
    .restart local v18    # "pm":Landroid/content/pm/PackageManager;
    :cond_4
    move-object v12, v13

    .line 114
    .end local v13    # "localDexFile":Ldalvik/system/DexFile;
    .end local v14    # "localEnumeration":Ljava/util/Enumeration;
    .end local v17    # "paramPackageInfo":Landroid/content/pm/PackageInfo;
    .end local v18    # "pm":Landroid/content/pm/PackageManager;
    .restart local v12    # "localDexFile":Ldalvik/system/DexFile;
    :cond_5
    invoke-interface/range {v23 .. v23}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v10

    .local v10, "i$":Ljava/util/Iterator;
    :cond_6
    :goto_4
    invoke-interface {v10}, Ljava/util/Iterator;->hasNext()Z

    move-result v24

    if-eqz v24, :cond_8

    invoke-interface {v10}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v20

    check-cast v20, Ljava/lang/String;

    .line 116
    .restart local v20    # "str":Ljava/lang/String;
    :try_start_2
    const-string v24, "UniSDK ApplicationHandler"

    const-string v25, "Class.forName(%s)"

    const/16 v26, 0x1

    move/from16 v0, v26

    new-array v0, v0, [Ljava/lang/Object;

    move-object/from16 v26, v0

    const/16 v27, 0x0

    aput-object v20, v26, v27

    invoke-static/range {v25 .. v26}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v25

    invoke-static/range {v24 .. v25}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 117
    invoke-static/range {v20 .. v20}, Ljava/lang/Class;->forName(Ljava/lang/String;)Ljava/lang/Class;

    move-result-object v6

    .line 118
    .local v6, "clazz":Ljava/lang/Class;, "Ljava/lang/Class<*>;"
    invoke-virtual {v6}, Ljava/lang/Class;->getConstructors()[Ljava/lang/reflect/Constructor;

    move-result-object v7

    .line 119
    .local v7, "cons":[Ljava/lang/reflect/Constructor;, "[Ljava/lang/reflect/Constructor<*>;"
    if-eqz v7, :cond_6

    .line 120
    const/4 v9, 0x0

    .local v9, "i":I
    :goto_5
    array-length v0, v7

    move/from16 v24, v0

    move/from16 v0, v24

    if-ge v9, v0, :cond_6

    .line 121
    aget-object v24, v7, v9

    invoke-virtual/range {v24 .. v24}, Ljava/lang/reflect/Constructor;->getGenericParameterTypes()[Ljava/lang/reflect/Type;

    move-result-object v22

    .line 122
    .local v22, "types":[Ljava/lang/reflect/Type;
    if-eqz v22, :cond_7

    move-object/from16 v0, v22

    array-length v0, v0

    move/from16 v24, v0

    const/16 v25, 0x1

    move/from16 v0, v24

    move/from16 v1, v25

    if-ne v0, v1, :cond_7

    .line 123
    aget-object v24, v7, v9

    const/16 v25, 0x1

    move/from16 v0, v25

    new-array v0, v0, [Ljava/lang/Object;

    move-object/from16 v25, v0

    const/16 v26, 0x0

    aput-object p0, v25, v26

    invoke-virtual/range {v24 .. v25}, Ljava/lang/reflect/Constructor;->newInstance([Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v19

    check-cast v19, Lcom/netease/ntunisdk/base/SdkApplication;

    .line 124
    .local v19, "sdk":Lcom/netease/ntunisdk/base/SdkApplication;
    invoke-virtual/range {v19 .. v19}, Lcom/netease/ntunisdk/base/SdkApplication;->getChannel()Ljava/lang/String;

    move-result-object v21

    .line 125
    .local v21, "tmpChannel":Ljava/lang/String;
    sget-object v24, Lcom/netease/ntunisdk/base/ApplicationHandler;->sdkMap:Ljava/util/Map;

    move-object/from16 v0, v24

    move-object/from16 v1, v21

    move-object/from16 v2, v19

    invoke-interface {v0, v1, v2}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
    :try_end_2
    .catch Ljava/lang/ClassNotFoundException; {:try_start_2 .. :try_end_2} :catch_1
    .catch Ljava/lang/InstantiationException; {:try_start_2 .. :try_end_2} :catch_2
    .catch Ljava/lang/IllegalAccessException; {:try_start_2 .. :try_end_2} :catch_3
    .catch Ljava/lang/IllegalArgumentException; {:try_start_2 .. :try_end_2} :catch_4
    .catch Ljava/lang/reflect/InvocationTargetException; {:try_start_2 .. :try_end_2} :catch_5

    goto :goto_4

    .line 130
    .end local v6    # "clazz":Ljava/lang/Class;, "Ljava/lang/Class<*>;"
    .end local v7    # "cons":[Ljava/lang/reflect/Constructor;, "[Ljava/lang/reflect/Constructor<*>;"
    .end local v9    # "i":I
    .end local v19    # "sdk":Lcom/netease/ntunisdk/base/SdkApplication;
    .end local v21    # "tmpChannel":Ljava/lang/String;
    .end local v22    # "types":[Ljava/lang/reflect/Type;
    :catch_1
    move-exception v8

    .line 131
    .local v8, "e":Ljava/lang/ClassNotFoundException;
    invoke-virtual {v8}, Ljava/lang/ClassNotFoundException;->printStackTrace()V

    .line 132
    const-string v24, "UniSDK ApplicationHandler"

    invoke-virtual {v8}, Ljava/lang/ClassNotFoundException;->getMessage()Ljava/lang/String;

    move-result-object v25

    invoke-static/range {v24 .. v25}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    goto :goto_4

    .line 120
    .end local v8    # "e":Ljava/lang/ClassNotFoundException;
    .restart local v6    # "clazz":Ljava/lang/Class;, "Ljava/lang/Class<*>;"
    .restart local v7    # "cons":[Ljava/lang/reflect/Constructor;, "[Ljava/lang/reflect/Constructor<*>;"
    .restart local v9    # "i":I
    .restart local v22    # "types":[Ljava/lang/reflect/Type;
    :cond_7
    add-int/lit8 v9, v9, 0x1

    goto :goto_5

    .line 133
    .end local v6    # "clazz":Ljava/lang/Class;, "Ljava/lang/Class<*>;"
    .end local v7    # "cons":[Ljava/lang/reflect/Constructor;, "[Ljava/lang/reflect/Constructor<*>;"
    .end local v9    # "i":I
    .end local v22    # "types":[Ljava/lang/reflect/Type;
    :catch_2
    move-exception v8

    .line 134
    .local v8, "e":Ljava/lang/InstantiationException;
    invoke-virtual {v8}, Ljava/lang/InstantiationException;->printStackTrace()V

    .line 135
    const-string v24, "UniSDK ApplicationHandler"

    invoke-virtual {v8}, Ljava/lang/InstantiationException;->getMessage()Ljava/lang/String;

    move-result-object v25

    invoke-static/range {v24 .. v25}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    goto/16 :goto_4

    .line 136
    .end local v8    # "e":Ljava/lang/InstantiationException;
    :catch_3
    move-exception v8

    .line 137
    .local v8, "e":Ljava/lang/IllegalAccessException;
    invoke-virtual {v8}, Ljava/lang/IllegalAccessException;->printStackTrace()V

    .line 138
    const-string v24, "UniSDK ApplicationHandler"

    invoke-virtual {v8}, Ljava/lang/IllegalAccessException;->getMessage()Ljava/lang/String;

    move-result-object v25

    invoke-static/range {v24 .. v25}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    goto/16 :goto_4

    .line 139
    .end local v8    # "e":Ljava/lang/IllegalAccessException;
    :catch_4
    move-exception v8

    .line 140
    .local v8, "e":Ljava/lang/IllegalArgumentException;
    invoke-virtual {v8}, Ljava/lang/IllegalArgumentException;->printStackTrace()V

    .line 141
    const-string v24, "UniSDK ApplicationHandler"

    invoke-virtual {v8}, Ljava/lang/IllegalArgumentException;->getMessage()Ljava/lang/String;

    move-result-object v25

    invoke-static/range {v24 .. v25}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    goto/16 :goto_4

    .line 142
    .end local v8    # "e":Ljava/lang/IllegalArgumentException;
    :catch_5
    move-exception v8

    .line 143
    .local v8, "e":Ljava/lang/reflect/InvocationTargetException;
    invoke-virtual {v8}, Ljava/lang/reflect/InvocationTargetException;->printStackTrace()V

    .line 144
    const-string v24, "UniSDK ApplicationHandler"

    invoke-virtual {v8}, Ljava/lang/reflect/InvocationTargetException;->getMessage()Ljava/lang/String;

    move-result-object v25

    invoke-static/range {v24 .. v25}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    goto/16 :goto_4

    .line 148
    .end local v8    # "e":Ljava/lang/reflect/InvocationTargetException;
    .end local v20    # "str":Ljava/lang/String;
    :cond_8
    if-eqz v12, :cond_3

    sget v24, Landroid/os/Build$VERSION;->SDK_INT:I

    const/16 v25, 0xe

    move/from16 v0, v24

    move/from16 v1, v25

    if-lt v0, v1, :cond_3

    .line 150
    :try_start_3
    invoke-virtual {v12}, Ldalvik/system/DexFile;->close()V
    :try_end_3
    .catch Ljava/lang/Throwable; {:try_start_3 .. :try_end_3} :catch_6

    goto/16 :goto_3

    .line 151
    :catch_6
    move-exception v16

    .line 152
    .local v16, "localThrowable2":Ljava/lang/Throwable;
    invoke-virtual/range {v16 .. v16}, Ljava/lang/Throwable;->printStackTrace()V

    goto/16 :goto_3

    .line 101
    .end local v10    # "i$":Ljava/util/Iterator;
    .end local v12    # "localDexFile":Ldalvik/system/DexFile;
    .end local v16    # "localThrowable2":Ljava/lang/Throwable;
    .restart local v13    # "localDexFile":Ldalvik/system/DexFile;
    .restart local v14    # "localEnumeration":Ljava/util/Enumeration;
    .restart local v17    # "paramPackageInfo":Landroid/content/pm/PackageInfo;
    .restart local v18    # "pm":Landroid/content/pm/PackageManager;
    :catch_7
    move-exception v15

    move-object v12, v13

    .end local v13    # "localDexFile":Ldalvik/system/DexFile;
    .restart local v12    # "localDexFile":Ldalvik/system/DexFile;
    goto/16 :goto_2
.end method


# virtual methods
.method protected attachBaseContext(Landroid/content/Context;)V
    .locals 0
    .param p1, "base"    # Landroid/content/Context;

    .prologue
    .line 34
    invoke-static {p1}, Lcom/netease/ntunisdk/base/ApplicationHandler;->handleOnApplicationAttachBaseContext(Landroid/content/Context;)V

    .line 35
    invoke-super {p0, p1}, Landroid/app/Application;->attachBaseContext(Landroid/content/Context;)V

    .line 36
    return-void
.end method

.method public onCreate()V
    .locals 1

    .prologue
    .line 40
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/ApplicationHandler;->getApplicationContext()Landroid/content/Context;

    move-result-object v0

    invoke-static {v0}, Lcom/netease/ntunisdk/base/ApplicationHandler;->handleOnApplicationOnCreate(Landroid/content/Context;)V

    .line 41
    invoke-super {p0}, Landroid/app/Application;->onCreate()V

    .line 42
    return-void
.end method
