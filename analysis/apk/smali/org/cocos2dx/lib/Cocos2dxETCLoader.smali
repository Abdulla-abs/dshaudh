.class public Lorg/cocos2dx/lib/Cocos2dxETCLoader;
.super Ljava/lang/Object;
.source "Cocos2dxETCLoader.java"


# static fields
.field private static final ASSETS_PATH:Ljava/lang/String; = "assets/"

.field private static context:Landroid/content/Context;


# direct methods
.method public constructor <init>()V
    .locals 0

    .prologue
    .line 37
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public static loadTexture(Ljava/lang/String;)Z
    .locals 14
    .param p0, "filePath"    # Ljava/lang/String;

    .prologue
    const/4 v8, 0x0

    .line 88
    invoke-static {}, Landroid/opengl/ETC1Util;->isETC1Supported()Z

    move-result v11

    if-nez v11, :cond_1

    .line 146
    :cond_0
    :goto_0
    return v8

    .line 92
    :cond_1
    invoke-virtual {p0}, Ljava/lang/String;->length()I

    move-result v11

    if-eqz v11, :cond_0

    .line 97
    const/4 v5, 0x0

    .line 98
    .local v5, "inputStream":Ljava/io/InputStream;
    const/4 v9, 0x0

    .line 99
    .local v9, "texture":Landroid/opengl/ETC1Util$ETC1Texture;
    const/4 v0, 0x0

    .line 101
    .local v0, "assetManager":Landroid/content/res/AssetManager;
    const/4 v11, 0x0

    :try_start_0
    invoke-virtual {p0, v11}, Ljava/lang/String;->charAt(I)C

    move-result v11

    const/16 v12, 0x2f

    if-ne v11, v12, :cond_2

    .line 103
    new-instance v6, Ljava/io/FileInputStream;

    invoke-direct {v6, p0}, Ljava/io/FileInputStream;-><init>(Ljava/lang/String;)V

    .end local v5    # "inputStream":Ljava/io/InputStream;
    .local v6, "inputStream":Ljava/io/InputStream;
    move-object v5, v6

    .line 113
    .end local v6    # "inputStream":Ljava/io/InputStream;
    .restart local v5    # "inputStream":Ljava/io/InputStream;
    :goto_1
    invoke-static {v5}, Landroid/opengl/ETC1Util;->createTexture(Ljava/io/InputStream;)Landroid/opengl/ETC1Util$ETC1Texture;

    move-result-object v9

    .line 114
    invoke-virtual {v5}, Ljava/io/InputStream;->close()V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_1

    .line 121
    :goto_2
    if-eqz v9, :cond_0

    .line 122
    const/4 v8, 0x1

    .line 125
    .local v8, "ret":Z
    :try_start_1
    invoke-virtual {v9}, Landroid/opengl/ETC1Util$ETC1Texture;->getWidth()I

    move-result v10

    .line 126
    .local v10, "width":I
    invoke-virtual {v9}, Landroid/opengl/ETC1Util$ETC1Texture;->getHeight()I

    move-result v4

    .line 127
    .local v4, "height":I
    invoke-virtual {v9}, Landroid/opengl/ETC1Util$ETC1Texture;->getData()Ljava/nio/ByteBuffer;

    move-result-object v11

    invoke-virtual {v11}, Ljava/nio/ByteBuffer;->remaining()I

    move-result v7

    .line 129
    .local v7, "length":I
    new-array v2, v7, [B

    .line 130
    .local v2, "data":[B
    invoke-static {v2}, Ljava/nio/ByteBuffer;->wrap([B)Ljava/nio/ByteBuffer;

    move-result-object v1

    .line 131
    .local v1, "buf":Ljava/nio/ByteBuffer;
    invoke-static {}, Ljava/nio/ByteOrder;->nativeOrder()Ljava/nio/ByteOrder;

    move-result-object v11

    invoke-virtual {v1, v11}, Ljava/nio/ByteBuffer;->order(Ljava/nio/ByteOrder;)Ljava/nio/ByteBuffer;

    .line 132
    invoke-virtual {v9}, Landroid/opengl/ETC1Util$ETC1Texture;->getData()Ljava/nio/ByteBuffer;

    move-result-object v11

    invoke-virtual {v1, v11}, Ljava/nio/ByteBuffer;->put(Ljava/nio/ByteBuffer;)Ljava/nio/ByteBuffer;

    .line 134
    invoke-static {v10, v4, v2, v7}, Lorg/cocos2dx/lib/Cocos2dxETCLoader;->nativeSetTextureInfo(II[BI)V
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_0

    goto :goto_0

    .line 138
    .end local v1    # "buf":Ljava/nio/ByteBuffer;
    .end local v2    # "data":[B
    .end local v4    # "height":I
    .end local v7    # "length":I
    .end local v10    # "width":I
    :catch_0
    move-exception v3

    .line 140
    .local v3, "e":Ljava/lang/Exception;
    const-string v11, "invoke native function error"

    invoke-virtual {v3}, Ljava/lang/Exception;->toString()Ljava/lang/String;

    move-result-object v12

    invoke-static {v11, v12}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 141
    const/4 v8, 0x0

    goto :goto_0

    .line 106
    .end local v3    # "e":Ljava/lang/Exception;
    .end local v8    # "ret":Z
    :cond_2
    :try_start_2
    const-string v11, "assets/"

    invoke-virtual {p0, v11}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v11

    if-eqz v11, :cond_3

    .line 107
    const-string v11, "assets/"

    invoke-virtual {v11}, Ljava/lang/String;->length()I

    move-result v11

    invoke-virtual {p0, v11}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object p0

    .line 109
    :cond_3
    sget-object v11, Lorg/cocos2dx/lib/Cocos2dxETCLoader;->context:Landroid/content/Context;

    invoke-virtual {v11}, Landroid/content/Context;->getAssets()Landroid/content/res/AssetManager;

    move-result-object v0

    .line 110
    invoke-virtual {v0, p0}, Landroid/content/res/AssetManager;->open(Ljava/lang/String;)Ljava/io/InputStream;
    :try_end_2
    .catch Ljava/lang/Exception; {:try_start_2 .. :try_end_2} :catch_1

    move-result-object v5

    goto :goto_1

    .line 115
    :catch_1
    move-exception v3

    .line 116
    .restart local v3    # "e":Ljava/lang/Exception;
    const-string v11, "Cocos2dx"

    new-instance v12, Ljava/lang/StringBuilder;

    invoke-direct {v12}, Ljava/lang/StringBuilder;-><init>()V

    const-string v13, "Unable to create texture for "

    invoke-virtual {v12, v13}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v12

    invoke-virtual {v12, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v12

    invoke-virtual {v12}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v12

    invoke-static {v11, v12}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 118
    const/4 v9, 0x0

    goto :goto_2
.end method

.method public static loadTextureData([BI)Z
    .locals 11
    .param p0, "bytedata"    # [B
    .param p1, "size"    # I

    .prologue
    const/4 v6, 0x0

    .line 42
    invoke-static {}, Landroid/opengl/ETC1Util;->isETC1Supported()Z

    move-result v9

    if-nez v9, :cond_1

    .line 83
    :cond_0
    :goto_0
    return v6

    .line 45
    :cond_1
    if-eqz p1, :cond_0

    .line 48
    const/4 v7, 0x0

    .line 50
    .local v7, "texture":Landroid/opengl/ETC1Util$ETC1Texture;
    :try_start_0
    new-instance v4, Ljava/io/ByteArrayInputStream;

    const/4 v9, 0x0

    invoke-direct {v4, p0, v9, p1}, Ljava/io/ByteArrayInputStream;-><init>([BII)V

    .line 51
    .local v4, "inputStream":Ljava/io/InputStream;
    invoke-static {v4}, Landroid/opengl/ETC1Util;->createTexture(Ljava/io/InputStream;)Landroid/opengl/ETC1Util$ETC1Texture;

    move-result-object v7

    .line 52
    invoke-virtual {v4}, Ljava/io/InputStream;->close()V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_1

    .line 58
    .end local v4    # "inputStream":Ljava/io/InputStream;
    :goto_1
    if-eqz v7, :cond_0

    .line 59
    const/4 v6, 0x1

    .line 62
    .local v6, "ret":Z
    :try_start_1
    invoke-virtual {v7}, Landroid/opengl/ETC1Util$ETC1Texture;->getWidth()I

    move-result v8

    .line 63
    .local v8, "width":I
    invoke-virtual {v7}, Landroid/opengl/ETC1Util$ETC1Texture;->getHeight()I

    move-result v3

    .line 64
    .local v3, "height":I
    invoke-virtual {v7}, Landroid/opengl/ETC1Util$ETC1Texture;->getData()Ljava/nio/ByteBuffer;

    move-result-object v9

    invoke-virtual {v9}, Ljava/nio/ByteBuffer;->remaining()I

    move-result v5

    .line 66
    .local v5, "length":I
    new-array v1, v5, [B

    .line 67
    .local v1, "data":[B
    invoke-static {v1}, Ljava/nio/ByteBuffer;->wrap([B)Ljava/nio/ByteBuffer;

    move-result-object v0

    .line 68
    .local v0, "buf":Ljava/nio/ByteBuffer;
    invoke-static {}, Ljava/nio/ByteOrder;->nativeOrder()Ljava/nio/ByteOrder;

    move-result-object v9

    invoke-virtual {v0, v9}, Ljava/nio/ByteBuffer;->order(Ljava/nio/ByteOrder;)Ljava/nio/ByteBuffer;

    .line 69
    invoke-virtual {v7}, Landroid/opengl/ETC1Util$ETC1Texture;->getData()Ljava/nio/ByteBuffer;

    move-result-object v9

    invoke-virtual {v0, v9}, Ljava/nio/ByteBuffer;->put(Ljava/nio/ByteBuffer;)Ljava/nio/ByteBuffer;

    .line 71
    invoke-static {v8, v3, v1, v5}, Lorg/cocos2dx/lib/Cocos2dxETCLoader;->nativeSetTextureInfo(II[BI)V
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_0

    goto :goto_0

    .line 75
    .end local v0    # "buf":Ljava/nio/ByteBuffer;
    .end local v1    # "data":[B
    .end local v3    # "height":I
    .end local v5    # "length":I
    .end local v8    # "width":I
    :catch_0
    move-exception v2

    .line 77
    .local v2, "e":Ljava/lang/Exception;
    const-string v9, "invoke native function error"

    invoke-virtual {v2}, Ljava/lang/Exception;->toString()Ljava/lang/String;

    move-result-object v10

    invoke-static {v9, v10}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 78
    const/4 v6, 0x0

    goto :goto_0

    .line 53
    .end local v2    # "e":Ljava/lang/Exception;
    .end local v6    # "ret":Z
    :catch_1
    move-exception v2

    .line 54
    .restart local v2    # "e":Ljava/lang/Exception;
    const-string v9, "Cocos2dx"

    const-string v10, "Unable to create texture for"

    invoke-static {v9, v10}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 55
    const/4 v7, 0x0

    goto :goto_1
.end method

.method private static native nativeSetTextureInfo(II[BI)V
.end method

.method public static setContext(Landroid/content/Context;)V
    .locals 0
    .param p0, "context"    # Landroid/content/Context;

    .prologue
    .line 151
    sput-object p0, Lorg/cocos2dx/lib/Cocos2dxETCLoader;->context:Landroid/content/Context;

    .line 152
    return-void
.end method
