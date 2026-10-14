.class public Lorg/cocos2dx/lib/Cocos2dxBitmap;
.super Ljava/lang/Object;
.source "Cocos2dxBitmap.java"


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;,
        Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;
    }
.end annotation


# static fields
.field private static final HORIZONTALALIGN_CENTER:I = 0x3

.field private static final HORIZONTALALIGN_LEFT:I = 0x1

.field private static final HORIZONTALALIGN_RIGHT:I = 0x2

.field private static final VERTICALALIGN_BOTTOM:I = 0x2

.field private static final VERTICALALIGN_CENTER:I = 0x3

.field private static final VERTICALALIGN_TOP:I = 0x1

.field private static sContext:Landroid/content/Context;


# direct methods
.method public constructor <init>()V
    .locals 0

    .prologue
    .line 51
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 915
    return-void
.end method

.method public static ByteToUnsignedInt(B)I
    .locals 1
    .param p0, "b"    # B

    .prologue
    .line 113
    and-int/lit16 v0, p0, 0xff

    return v0
.end method

.method public static IsDefaultLanguage(Ljava/lang/String;)Z
    .locals 1
    .param p0, "charUTF8"    # Ljava/lang/String;

    .prologue
    .line 173
    const/4 v0, 0x0

    return v0
.end method

.method public static IsLatinLanguage(Ljava/lang/String;)Z
    .locals 8
    .param p0, "charUTF8"    # Ljava/lang/String;

    .prologue
    const/4 v5, 0x0

    const/4 v4, 0x1

    .line 145
    :try_start_0
    const-string v6, "UTF-8"

    invoke-virtual {p0, v6}, Ljava/lang/String;->getBytes(Ljava/lang/String;)[B

    move-result-object v0

    .line 146
    .local v0, "array":[B
    const/4 v6, 0x0

    aget-byte v6, v0, v6

    invoke-static {v6}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->ByteToUnsignedInt(B)I

    move-result v1

    .line 147
    .local v1, "c":I
    const/4 v2, 0x1

    .local v2, "shift":I
    :goto_0
    array-length v6, v0

    if-ge v2, v6, :cond_0

    .line 148
    shl-int/lit8 v6, v1, 0x8

    aget-byte v7, v0, v2

    invoke-static {v7}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->ByteToUnsignedInt(B)I
    :try_end_0
    .catch Ljava/io/UnsupportedEncodingException; {:try_start_0 .. :try_end_0} :catch_0

    move-result v7

    add-int v1, v6, v7

    .line 147
    add-int/lit8 v2, v2, 0x1

    goto :goto_0

    .line 150
    :cond_0
    const/16 v6, 0x61

    if-lt v1, v6, :cond_2

    const/16 v6, 0x7a

    if-gt v1, v6, :cond_2

    .line 168
    .end local v0    # "array":[B
    .end local v1    # "c":I
    .end local v2    # "shift":I
    :cond_1
    :goto_1
    return v4

    .line 152
    .restart local v0    # "array":[B
    .restart local v1    # "c":I
    .restart local v2    # "shift":I
    :cond_2
    const/16 v6, 0x41

    if-lt v1, v6, :cond_3

    const/16 v6, 0x5a

    if-le v1, v6, :cond_1

    .line 154
    :cond_3
    const/16 v6, 0x27

    if-eq v1, v6, :cond_1

    .line 156
    const/16 v6, 0x8a

    if-lt v1, v6, :cond_4

    const/16 v6, 0x8e

    if-le v1, v6, :cond_1

    .line 158
    :cond_4
    const/16 v6, 0x9a

    if-lt v1, v6, :cond_5

    const/16 v6, 0x9f

    if-le v1, v6, :cond_1

    .line 160
    :cond_5
    const/16 v6, 0xc6

    if-lt v1, v6, :cond_6

    const/16 v6, 0xff

    if-le v1, v6, :cond_1

    .line 162
    :cond_6
    const v6, 0xc380

    if-lt v1, v6, :cond_7

    const v6, 0xcaaf

    if-le v1, v6, :cond_1

    :cond_7
    move v4, v5

    .line 168
    goto :goto_1

    .line 164
    .end local v0    # "array":[B
    .end local v1    # "c":I
    .end local v2    # "shift":I
    :catch_0
    move-exception v3

    .line 165
    .local v3, "uee":Ljava/io/UnsupportedEncodingException;
    sget-object v4, Ljava/lang/System;->out:Ljava/io/PrintStream;

    const-string v6, "missing required encoding: UTF-16"

    invoke-virtual {v4, v6}, Ljava/io/PrintStream;->println(Ljava/lang/String;)V

    move v4, v5

    .line 166
    goto :goto_1
.end method

.method public static IsThaiLanguage(Ljava/lang/String;)Z
    .locals 11
    .param p0, "charUTF8"    # Ljava/lang/String;

    .prologue
    const/16 v10, 0xbf

    const/16 v9, 0x80

    const/4 v6, 0x1

    const/4 v5, 0x0

    .line 120
    :try_start_0
    const-string v7, "UTF-8"

    invoke-virtual {p0, v7}, Ljava/lang/String;->getBytes(Ljava/lang/String;)[B

    move-result-object v3

    .line 122
    .local v3, "array":[B
    array-length v7, v3

    const/4 v8, 0x3

    if-eq v7, v8, :cond_1

    .line 138
    .end local v3    # "array":[B
    :cond_0
    :goto_0
    return v5

    .line 124
    .restart local v3    # "array":[B
    :cond_1
    const/4 v7, 0x0

    aget-byte v7, v3, v7

    invoke-static {v7}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->ByteToUnsignedInt(B)I

    move-result v0

    .line 125
    .local v0, "a0":I
    const/4 v7, 0x1

    aget-byte v7, v3, v7

    invoke-static {v7}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->ByteToUnsignedInt(B)I

    move-result v1

    .line 126
    .local v1, "a1":I
    const/4 v7, 0x2

    aget-byte v7, v3, v7

    invoke-static {v7}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->ByteToUnsignedInt(B)I
    :try_end_0
    .catch Ljava/io/UnsupportedEncodingException; {:try_start_0 .. :try_end_0} :catch_0

    move-result v2

    .line 127
    .local v2, "a2":I
    const/16 v7, 0xe0

    if-ne v0, v7, :cond_0

    .line 129
    const/16 v7, 0xb8

    if-ne v1, v7, :cond_2

    if-lt v2, v9, :cond_2

    if-gt v2, v10, :cond_2

    move v5, v6

    .line 130
    goto :goto_0

    .line 131
    :cond_2
    const/16 v7, 0xb9

    if-ne v1, v7, :cond_0

    if-lt v2, v9, :cond_0

    if-gt v2, v10, :cond_0

    move v5, v6

    .line 132
    goto :goto_0

    .line 134
    .end local v0    # "a0":I
    .end local v1    # "a1":I
    .end local v2    # "a2":I
    .end local v3    # "array":[B
    :catch_0
    move-exception v4

    .line 135
    .local v4, "uee":Ljava/io/UnsupportedEncodingException;
    sget-object v6, Ljava/lang/System;->out:Ljava/io/PrintStream;

    const-string v7, "missing required encoding: UTF-16"

    invoke-virtual {v6, v7}, Ljava/io/PrintStream;->println(Ljava/lang/String;)V

    goto :goto_0
.end method

.method public static MergeStringList(Ljava/util/Vector;II)Ljava/lang/String;
    .locals 4
    .param p1, "start"    # I
    .param p2, "end"    # I
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/Vector",
            "<",
            "Ljava/lang/String;",
            ">;II)",
            "Ljava/lang/String;"
        }
    .end annotation

    .prologue
    .line 206
    .local p0, "strVec":Ljava/util/Vector;, "Ljava/util/Vector<Ljava/lang/String;>;"
    const-string v1, ""

    .line 207
    .local v1, "ret":Ljava/lang/String;
    move v0, p1

    .local v0, "i":I
    :goto_0
    if-ge v0, p2, :cond_0

    .line 208
    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v2, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {p0, v0}, Ljava/util/Vector;->get(I)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Ljava/lang/String;

    invoke-virtual {v3, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    .line 207
    add-int/lit8 v0, v0, 0x1

    goto :goto_0

    .line 210
    :cond_0
    return-object v1
.end method

.method public static _createTextBitmapShadowStrokeForRichText(Ljava/lang/String;Ljava/lang/String;IIIII[II)V
    .locals 39
    .param p0, "pString"    # Ljava/lang/String;
    .param p1, "pFontName"    # Ljava/lang/String;
    .param p2, "pFontSize"    # I
    .param p3, "horizontalAlignment"    # I
    .param p4, "verticalAlignment"    # I
    .param p5, "pWidth"    # I
    .param p6, "pHeight"    # I
    .param p7, "richInfoAry"    # [I
    .param p8, "richInfoLen"    # I

    .prologue
    .line 217
    const/4 v5, 0x0

    .line 218
    .local v5, "ln":I
    new-instance v32, Ljava/util/Vector;

    invoke-direct/range {v32 .. v32}, Ljava/util/Vector;-><init>()V

    .line 219
    .local v32, "textinfos":Ljava/util/Vector;, "Ljava/util/Vector<Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;>;"
    new-instance v22, Ljava/util/Vector;

    invoke-direct/range {v22 .. v22}, Ljava/util/Vector;-><init>()V

    .line 220
    .local v22, "lineY":Ljava/util/Vector;, "Ljava/util/Vector<Ljava/lang/Integer;>;"
    new-instance v21, Ljava/util/Vector;

    invoke-direct/range {v21 .. v21}, Ljava/util/Vector;-><init>()V

    .line 222
    .local v21, "lineX":Ljava/util/Vector;, "Ljava/util/Vector<Ljava/lang/Integer;>;"
    const/16 v25, 0x0

    .line 223
    .local v25, "maxW":I
    const/16 v33, 0x0

    .line 224
    .local v33, "totalH":I
    const/4 v9, 0x0

    .line 225
    .local v9, "currentW":I
    const/4 v13, 0x0

    .line 226
    .local v13, "currentH":I
    const/4 v14, 0x0

    .line 228
    .local v14, "currentTop":I
    const/16 v17, 0x0

    .local v17, "i":I
    :goto_0
    move/from16 v0, v17

    move/from16 v1, p8

    if-ge v0, v1, :cond_9

    .line 230
    mul-int/lit8 v35, v17, 0x6

    add-int/lit8 v35, v35, 0x3

    aget v35, p7, v35

    const/16 v36, 0x1

    move-object/from16 v0, p1

    move/from16 v1, v35

    move/from16 v2, v36

    invoke-static {v0, v1, v2}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->newPaint(Ljava/lang/String;II)Landroid/graphics/Paint;

    move-result-object v10

    .line 231
    .local v10, "paint":Landroid/graphics/Paint;
    const/16 v35, 0xff

    mul-int/lit8 v36, v17, 0x6

    aget v36, p7, v36

    mul-int/lit8 v37, v17, 0x6

    add-int/lit8 v37, v37, 0x1

    aget v37, p7, v37

    mul-int/lit8 v38, v17, 0x6

    add-int/lit8 v38, v38, 0x2

    aget v38, p7, v38

    move/from16 v0, v35

    move/from16 v1, v36

    move/from16 v2, v37

    move/from16 v3, v38

    invoke-virtual {v10, v0, v1, v2, v3}, Landroid/graphics/Paint;->setARGB(IIII)V

    .line 233
    mul-int/lit8 v35, v17, 0x6

    add-int/lit8 v35, v35, 0x4

    aget v35, p7, v35

    mul-int/lit8 v36, v17, 0x6

    add-int/lit8 v36, v36, 0x5

    aget v36, p7, v36

    move-object/from16 v0, p0

    move/from16 v1, v35

    move/from16 v2, v36

    invoke-virtual {v0, v1, v2}, Ljava/lang/String;->substring(II)Ljava/lang/String;

    move-result-object v30

    .line 235
    .local v30, "subString":Ljava/lang/String;
    invoke-virtual {v10}, Landroid/graphics/Paint;->getFontMetricsInt()Landroid/graphics/Paint$FontMetricsInt;

    move-result-object v16

    .line 236
    .local v16, "fm":Landroid/graphics/Paint$FontMetricsInt;
    move-object/from16 v0, v16

    iget v0, v0, Landroid/graphics/Paint$FontMetricsInt;->bottom:I

    move/from16 v35, v0

    move-object/from16 v0, v16

    iget v0, v0, Landroid/graphics/Paint$FontMetricsInt;->top:I

    move/from16 v36, v0

    sub-int v8, v35, v36

    .line 237
    .local v8, "h":I
    if-ge v13, v8, :cond_0

    .line 238
    move v13, v8

    .line 239
    move-object/from16 v0, v16

    iget v0, v0, Landroid/graphics/Paint$FontMetricsInt;->top:I

    move/from16 v35, v0

    move/from16 v0, v35

    neg-int v14, v0

    .line 242
    :cond_0
    const-string v35, "\\n"

    move-object/from16 v0, v30

    move-object/from16 v1, v35

    invoke-virtual {v0, v1}, Ljava/lang/String;->split(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object v23

    .line 243
    .local v23, "lines":[Ljava/lang/String;
    new-instance v24, Ljava/util/Vector;

    invoke-direct/range {v24 .. v24}, Ljava/util/Vector;-><init>()V

    .line 245
    .local v24, "linesByCut":Ljava/util/Vector;, "Ljava/util/Vector<Ljava/lang/String;>;"
    move/from16 v31, v9

    .line 246
    .local v31, "tempCurrentW":I
    const/16 v18, 0x0

    .local v18, "id":I
    :goto_1
    move-object/from16 v0, v23

    array-length v0, v0

    move/from16 v35, v0

    move/from16 v0, v18

    move/from16 v1, v35

    if-ge v0, v1, :cond_5

    .line 247
    aget-object v6, v23, v18

    .line 248
    .local v6, "curString":Ljava/lang/String;
    invoke-static {v6}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->devideStringByLanguage(Ljava/lang/String;)Ljava/util/Vector;

    move-result-object v15

    .line 249
    .local v15, "devided":Ljava/util/Vector;, "Ljava/util/Vector<Ljava/lang/String;>;"
    invoke-virtual {v10, v6}, Landroid/graphics/Paint;->measureText(Ljava/lang/String;)F

    move-result v35

    invoke-static/range {v35 .. v35}, Landroid/util/FloatMath;->ceil(F)F

    move-result v35

    move/from16 v0, v35

    float-to-int v7, v0

    .line 251
    .local v7, "tw":I
    sub-int v35, p5, v31

    move/from16 v0, v35

    if-le v7, v0, :cond_2

    .line 254
    move/from16 v0, p5

    move/from16 v1, v31

    if-le v0, v1, :cond_1

    .line 256
    sub-int v35, p5, v31

    move/from16 v0, v35

    invoke-static {v15, v0, v10}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->divideFirstStringWithWidth(Ljava/util/Vector;ILandroid/graphics/Paint;)I

    move-result v34

    .line 262
    .local v34, "usedIndex":I
    :goto_2
    const/16 v35, 0x0

    move/from16 v0, v35

    move/from16 v1, v34

    invoke-static {v15, v0, v1}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->MergeStringList(Ljava/util/Vector;II)Ljava/lang/String;

    move-result-object v35

    move-object/from16 v0, v24

    move-object/from16 v1, v35

    invoke-virtual {v0, v1}, Ljava/util/Vector;->add(Ljava/lang/Object;)Z

    .line 264
    new-instance v29, Ljava/util/LinkedList;

    invoke-direct/range {v29 .. v29}, Ljava/util/LinkedList;-><init>()V

    .line 265
    .local v29, "remainStrList":Ljava/util/LinkedList;, "Ljava/util/LinkedList<Ljava/lang/String;>;"
    invoke-virtual {v15}, Ljava/util/Vector;->size()I

    move-result v35

    move/from16 v0, v34

    move/from16 v1, v35

    move/from16 v2, p5

    invoke-static {v15, v0, v1, v2, v10}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->divideStringWithMaxWidth(Ljava/util/Vector;IIILandroid/graphics/Paint;)Ljava/util/LinkedList;

    move-result-object v35

    move-object/from16 v0, v29

    move-object/from16 v1, v35

    invoke-virtual {v0, v1}, Ljava/util/LinkedList;->addAll(Ljava/util/Collection;)Z

    .line 266
    invoke-virtual/range {v29 .. v29}, Ljava/util/LinkedList;->iterator()Ljava/util/Iterator;

    move-result-object v20

    .line 267
    .local v20, "iter":Ljava/util/Iterator;, "Ljava/util/Iterator<Ljava/lang/String;>;"
    :goto_3
    invoke-interface/range {v20 .. v20}, Ljava/util/Iterator;->hasNext()Z

    move-result v35

    if-eqz v35, :cond_3

    .line 268
    invoke-interface/range {v20 .. v20}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v35

    move-object/from16 v0, v24

    move-object/from16 v1, v35

    invoke-virtual {v0, v1}, Ljava/util/Vector;->add(Ljava/lang/Object;)Z

    goto :goto_3

    .line 260
    .end local v20    # "iter":Ljava/util/Iterator;, "Ljava/util/Iterator<Ljava/lang/String;>;"
    .end local v29    # "remainStrList":Ljava/util/LinkedList;, "Ljava/util/LinkedList<Ljava/lang/String;>;"
    .end local v34    # "usedIndex":I
    :cond_1
    const/16 v34, 0x0

    .restart local v34    # "usedIndex":I
    goto :goto_2

    .line 271
    .end local v34    # "usedIndex":I
    :cond_2
    move-object/from16 v0, v24

    invoke-virtual {v0, v6}, Ljava/util/Vector;->add(Ljava/lang/Object;)Z

    .line 273
    :cond_3
    move-object/from16 v0, v23

    array-length v0, v0

    move/from16 v35, v0

    add-int/lit8 v35, v35, -0x1

    move/from16 v0, v18

    move/from16 v1, v35

    if-ge v0, v1, :cond_4

    .line 274
    const/16 v31, 0x0

    .line 246
    :cond_4
    add-int/lit8 v18, v18, 0x1

    goto/16 :goto_1

    .line 278
    .end local v6    # "curString":Ljava/lang/String;
    .end local v7    # "tw":I
    .end local v15    # "devided":Ljava/util/Vector;, "Ljava/util/Vector<Ljava/lang/String;>;"
    :cond_5
    const/16 v18, 0x0

    :goto_4
    invoke-virtual/range {v24 .. v24}, Ljava/util/Vector;->size()I

    move-result v35

    move/from16 v0, v18

    move/from16 v1, v35

    if-ge v0, v1, :cond_8

    .line 279
    move-object/from16 v0, v24

    move/from16 v1, v18

    invoke-virtual {v0, v1}, Ljava/util/Vector;->get(I)Ljava/lang/Object;

    move-result-object v6

    check-cast v6, Ljava/lang/String;

    .line 280
    .restart local v6    # "curString":Ljava/lang/String;
    invoke-virtual {v10, v6}, Landroid/graphics/Paint;->measureText(Ljava/lang/String;)F

    move-result v35

    invoke-static/range {v35 .. v35}, Landroid/util/FloatMath;->ceil(F)F

    move-result v35

    move/from16 v0, v35

    float-to-int v7, v0

    .line 281
    .restart local v7    # "tw":I
    new-instance v4, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;

    invoke-direct/range {v4 .. v10}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;-><init>(ILjava/lang/String;IIILandroid/graphics/Paint;)V

    .line 282
    .local v4, "tf":Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;
    move-object/from16 v0, v32

    invoke-virtual {v0, v4}, Ljava/util/Vector;->add(Ljava/lang/Object;)Z

    .line 283
    add-int/2addr v9, v7

    .line 285
    invoke-virtual/range {v24 .. v24}, Ljava/util/Vector;->size()I

    move-result v35

    add-int/lit8 v35, v35, -0x1

    move/from16 v0, v18

    move/from16 v1, v35

    if-eq v0, v1, :cond_7

    .line 287
    move/from16 v0, v25

    if-ge v0, v9, :cond_6

    .line 288
    move/from16 v25, v9

    .line 290
    :cond_6
    add-int v35, v33, v14

    invoke-static/range {v35 .. v35}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v35

    move-object/from16 v0, v22

    move-object/from16 v1, v35

    invoke-virtual {v0, v1}, Ljava/util/Vector;->add(Ljava/lang/Object;)Z

    .line 291
    invoke-static {v9}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v35

    move-object/from16 v0, v21

    move-object/from16 v1, v35

    invoke-virtual {v0, v1}, Ljava/util/Vector;->add(Ljava/lang/Object;)Z

    .line 292
    const/4 v9, 0x0

    .line 293
    add-int v33, v33, v13

    .line 294
    move v13, v8

    .line 295
    move-object/from16 v0, v16

    iget v0, v0, Landroid/graphics/Paint$FontMetricsInt;->top:I

    move/from16 v35, v0

    move/from16 v0, v35

    neg-int v14, v0

    .line 296
    add-int/lit8 v5, v5, 0x1

    .line 278
    :cond_7
    add-int/lit8 v18, v18, 0x1

    goto :goto_4

    .line 228
    .end local v4    # "tf":Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;
    .end local v6    # "curString":Ljava/lang/String;
    .end local v7    # "tw":I
    :cond_8
    add-int/lit8 v17, v17, 0x1

    goto/16 :goto_0

    .line 301
    .end local v8    # "h":I
    .end local v10    # "paint":Landroid/graphics/Paint;
    .end local v16    # "fm":Landroid/graphics/Paint$FontMetricsInt;
    .end local v18    # "id":I
    .end local v23    # "lines":[Ljava/lang/String;
    .end local v24    # "linesByCut":Ljava/util/Vector;, "Ljava/util/Vector<Ljava/lang/String;>;"
    .end local v30    # "subString":Ljava/lang/String;
    .end local v31    # "tempCurrentW":I
    :cond_9
    add-int v35, v33, v14

    invoke-static/range {v35 .. v35}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v35

    move-object/from16 v0, v22

    move-object/from16 v1, v35

    invoke-virtual {v0, v1}, Ljava/util/Vector;->add(Ljava/lang/Object;)Z

    .line 302
    invoke-static {v9}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v35

    move-object/from16 v0, v21

    move-object/from16 v1, v35

    invoke-virtual {v0, v1}, Ljava/util/Vector;->add(Ljava/lang/Object;)Z

    .line 303
    add-int v33, v33, v13

    .line 305
    move/from16 v0, v25

    if-ge v0, v9, :cond_a

    .line 306
    move/from16 v25, v9

    .line 309
    :cond_a
    if-nez v25, :cond_b

    .line 310
    const/16 v25, 0x1

    .line 311
    :cond_b
    if-nez v33, :cond_c

    .line 312
    const/16 v33, 0x1

    .line 315
    :cond_c
    if-nez p6, :cond_d

    .line 316
    move/from16 v27, v33

    .line 320
    .local v27, "ph":I
    :goto_5
    if-nez p5, :cond_e

    .line 321
    move/from16 v28, v25

    .line 325
    .local v28, "pw":I
    :goto_6
    sget-object v35, Landroid/graphics/Bitmap$Config;->ARGB_8888:Landroid/graphics/Bitmap$Config;

    move/from16 v0, v28

    move/from16 v1, v27

    move-object/from16 v2, v35

    invoke-static {v0, v1, v2}, Landroid/graphics/Bitmap;->createBitmap(IILandroid/graphics/Bitmap$Config;)Landroid/graphics/Bitmap;

    move-result-object v11

    .line 327
    .local v11, "bitmap":Landroid/graphics/Bitmap;
    new-instance v12, Landroid/graphics/Canvas;

    invoke-direct {v12, v11}, Landroid/graphics/Canvas;-><init>(Landroid/graphics/Bitmap;)V

    .line 330
    .local v12, "canvas":Landroid/graphics/Canvas;
    invoke-virtual/range {v32 .. v32}, Ljava/util/Vector;->iterator()Ljava/util/Iterator;

    move-result-object v19

    .line 331
    .local v19, "it2":Ljava/util/Iterator;, "Ljava/util/Iterator<Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;>;"
    const/16 v35, 0x1

    move/from16 v0, p3

    move/from16 v1, v35

    if-ne v0, v1, :cond_f

    .line 333
    :goto_7
    invoke-interface/range {v19 .. v19}, Ljava/util/Iterator;->hasNext()Z

    move-result v35

    if-eqz v35, :cond_11

    .line 334
    invoke-interface/range {v19 .. v19}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v4

    check-cast v4, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;

    .line 335
    .restart local v4    # "tf":Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;
    iget-object v0, v4, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;->mText:Ljava/lang/String;

    move-object/from16 v36, v0

    iget v0, v4, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;->x:I

    move/from16 v35, v0

    move/from16 v0, v35

    int-to-float v0, v0

    move/from16 v37, v0

    iget v0, v4, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;->lineIndex:I

    move/from16 v35, v0

    move-object/from16 v0, v22

    move/from16 v1, v35

    invoke-virtual {v0, v1}, Ljava/util/Vector;->get(I)Ljava/lang/Object;

    move-result-object v35

    check-cast v35, Ljava/lang/Integer;

    invoke-virtual/range {v35 .. v35}, Ljava/lang/Integer;->intValue()I

    move-result v35

    move/from16 v0, v35

    int-to-float v0, v0

    move/from16 v35, v0

    iget-object v0, v4, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;->paint:Landroid/graphics/Paint;

    move-object/from16 v38, v0

    move-object/from16 v0, v36

    move/from16 v1, v37

    move/from16 v2, v35

    move-object/from16 v3, v38

    invoke-virtual {v12, v0, v1, v2, v3}, Landroid/graphics/Canvas;->drawText(Ljava/lang/String;FFLandroid/graphics/Paint;)V

    goto :goto_7

    .line 318
    .end local v4    # "tf":Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;
    .end local v11    # "bitmap":Landroid/graphics/Bitmap;
    .end local v12    # "canvas":Landroid/graphics/Canvas;
    .end local v19    # "it2":Ljava/util/Iterator;, "Ljava/util/Iterator<Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;>;"
    .end local v27    # "ph":I
    .end local v28    # "pw":I
    :cond_d
    move/from16 v27, p6

    .restart local v27    # "ph":I
    goto :goto_5

    .line 323
    :cond_e
    move/from16 v28, p5

    .restart local v28    # "pw":I
    goto :goto_6

    .line 338
    .restart local v11    # "bitmap":Landroid/graphics/Bitmap;
    .restart local v12    # "canvas":Landroid/graphics/Canvas;
    .restart local v19    # "it2":Ljava/util/Iterator;, "Ljava/util/Iterator<Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;>;"
    :cond_f
    const/16 v35, 0x3

    move/from16 v0, p3

    move/from16 v1, v35

    if-ne v0, v1, :cond_10

    .line 340
    :goto_8
    invoke-interface/range {v19 .. v19}, Ljava/util/Iterator;->hasNext()Z

    move-result v35

    if-eqz v35, :cond_11

    .line 341
    invoke-interface/range {v19 .. v19}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v4

    check-cast v4, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;

    .line 342
    .restart local v4    # "tf":Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;
    iget v0, v4, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;->lineIndex:I

    move/from16 v35, v0

    move-object/from16 v0, v21

    move/from16 v1, v35

    invoke-virtual {v0, v1}, Ljava/util/Vector;->get(I)Ljava/lang/Object;

    move-result-object v35

    check-cast v35, Ljava/lang/Integer;

    invoke-virtual/range {v35 .. v35}, Ljava/lang/Integer;->intValue()I

    move-result v35

    sub-int v35, p5, v35

    div-int/lit8 v26, v35, 0x2

    .line 343
    .local v26, "offsetX":I
    iget-object v0, v4, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;->mText:Ljava/lang/String;

    move-object/from16 v36, v0

    iget v0, v4, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;->x:I

    move/from16 v35, v0

    add-int v35, v35, v26

    move/from16 v0, v35

    int-to-float v0, v0

    move/from16 v37, v0

    iget v0, v4, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;->lineIndex:I

    move/from16 v35, v0

    move-object/from16 v0, v22

    move/from16 v1, v35

    invoke-virtual {v0, v1}, Ljava/util/Vector;->get(I)Ljava/lang/Object;

    move-result-object v35

    check-cast v35, Ljava/lang/Integer;

    invoke-virtual/range {v35 .. v35}, Ljava/lang/Integer;->intValue()I

    move-result v35

    move/from16 v0, v35

    int-to-float v0, v0

    move/from16 v35, v0

    iget-object v0, v4, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;->paint:Landroid/graphics/Paint;

    move-object/from16 v38, v0

    move-object/from16 v0, v36

    move/from16 v1, v37

    move/from16 v2, v35

    move-object/from16 v3, v38

    invoke-virtual {v12, v0, v1, v2, v3}, Landroid/graphics/Canvas;->drawText(Ljava/lang/String;FFLandroid/graphics/Paint;)V

    goto :goto_8

    .line 348
    .end local v4    # "tf":Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;
    .end local v26    # "offsetX":I
    :cond_10
    :goto_9
    invoke-interface/range {v19 .. v19}, Ljava/util/Iterator;->hasNext()Z

    move-result v35

    if-eqz v35, :cond_11

    .line 349
    invoke-interface/range {v19 .. v19}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v4

    check-cast v4, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;

    .line 350
    .restart local v4    # "tf":Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;
    iget v0, v4, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;->lineIndex:I

    move/from16 v35, v0

    move-object/from16 v0, v21

    move/from16 v1, v35

    invoke-virtual {v0, v1}, Ljava/util/Vector;->get(I)Ljava/lang/Object;

    move-result-object v35

    check-cast v35, Ljava/lang/Integer;

    invoke-virtual/range {v35 .. v35}, Ljava/lang/Integer;->intValue()I

    move-result v35

    sub-int v26, p5, v35

    .line 351
    .restart local v26    # "offsetX":I
    iget-object v0, v4, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;->mText:Ljava/lang/String;

    move-object/from16 v36, v0

    iget v0, v4, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;->x:I

    move/from16 v35, v0

    add-int v35, v35, v26

    move/from16 v0, v35

    int-to-float v0, v0

    move/from16 v37, v0

    iget v0, v4, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;->lineIndex:I

    move/from16 v35, v0

    move-object/from16 v0, v22

    move/from16 v1, v35

    invoke-virtual {v0, v1}, Ljava/util/Vector;->get(I)Ljava/lang/Object;

    move-result-object v35

    check-cast v35, Ljava/lang/Integer;

    invoke-virtual/range {v35 .. v35}, Ljava/lang/Integer;->intValue()I

    move-result v35

    move/from16 v0, v35

    int-to-float v0, v0

    move/from16 v35, v0

    iget-object v0, v4, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;->paint:Landroid/graphics/Paint;

    move-object/from16 v38, v0

    move-object/from16 v0, v36

    move/from16 v1, v37

    move/from16 v2, v35

    move-object/from16 v3, v38

    invoke-virtual {v12, v0, v1, v2, v3}, Landroid/graphics/Canvas;->drawText(Ljava/lang/String;FFLandroid/graphics/Paint;)V

    goto :goto_9

    .line 355
    .end local v4    # "tf":Lorg/cocos2dx/lib/Cocos2dxBitmap$TextInfo;
    .end local v26    # "offsetX":I
    :cond_11
    invoke-static {v11}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->initNativeObject(Landroid/graphics/Bitmap;)V

    .line 356
    return-void
.end method

.method public static _createTextBitmapShadowStrokeForTTF(Ljava/lang/String;Ljava/lang/String;IFFFIIIIZFFFFFFFZFFFFZLorg/cocos2dx/lib/Cocos2dxTTFExtInfo;)V
    .locals 28
    .param p0, "pString"    # Ljava/lang/String;
    .param p1, "pFontName"    # Ljava/lang/String;
    .param p2, "pFontSize"    # I
    .param p3, "fontTintR"    # F
    .param p4, "fontTintG"    # F
    .param p5, "fontTintB"    # F
    .param p6, "horizontalAlignment"    # I
    .param p7, "verticalAlignment"    # I
    .param p8, "pWidth"    # I
    .param p9, "pHeight"    # I
    .param p10, "shadow"    # Z
    .param p11, "shadowDX"    # F
    .param p12, "shadowDY"    # F
    .param p13, "shadowBlur"    # F
    .param p14, "shadowOpacity"    # F
    .param p15, "shadowR"    # F
    .param p16, "shadowG"    # F
    .param p17, "shadowB"    # F
    .param p18, "stroke"    # Z
    .param p19, "strokeR"    # F
    .param p20, "strokeG"    # F
    .param p21, "strokeB"    # F
    .param p22, "strokeSize"    # F
    .param p23, "outStroke"    # Z
    .param p24, "extInfo"    # Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;

    .prologue
    .line 369
    invoke-static/range {p0 .. p0}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->refactorString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    .line 370
    move-object/from16 v0, p1

    move/from16 v1, p2

    move/from16 v2, p6

    invoke-static {v0, v1, v2}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->newPaint(Ljava/lang/String;II)Landroid/graphics/Paint;

    move-result-object v22

    .line 372
    .local v22, "paint":Landroid/graphics/Paint;
    const/16 v5, 0xff

    const-wide v6, 0x406fe00000000000L    # 255.0

    move/from16 v0, p3

    float-to-double v8, v0

    mul-double/2addr v6, v8

    double-to-int v6, v6

    const-wide v7, 0x406fe00000000000L    # 255.0

    move/from16 v0, p4

    float-to-double v9, v0

    mul-double/2addr v7, v9

    double-to-int v7, v7

    const-wide v8, 0x406fe00000000000L    # 255.0

    move/from16 v0, p5

    float-to-double v10, v0

    mul-double/2addr v8, v10

    double-to-int v8, v8

    move-object/from16 v0, v22

    invoke-virtual {v0, v5, v6, v7, v8}, Landroid/graphics/Paint;->setARGB(IIII)V

    .line 374
    const/high16 v21, 0x3f800000    # 1.0f

    .line 375
    .local v21, "lineHeightMultiple":F
    if-eqz p24, :cond_0

    move-object/from16 v0, p24

    iget v5, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->lineHeight:F

    const/4 v6, 0x0

    cmpl-float v5, v5, v6

    if-lez v5, :cond_0

    .line 377
    move-object/from16 v0, p24

    iget v0, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->lineHeight:F

    move/from16 v21, v0

    .line 381
    :cond_0
    const/4 v15, 0x0

    .line 382
    .local v15, "bitmapPaddingX":F
    const/16 v16, 0x0

    .line 384
    .local v16, "bitmapPaddingY":F
    if-eqz p10, :cond_1

    .line 385
    invoke-static/range {p11 .. p11}, Ljava/lang/Math;->abs(F)F

    move-result v5

    add-float v15, v5, p13

    .line 386
    invoke-static/range {p12 .. p12}, Ljava/lang/Math;->abs(F)F

    move-result v5

    add-float v16, v5, p13

    .line 389
    :cond_1
    if-eqz p18, :cond_2

    .line 390
    add-float v15, v15, p22

    .line 391
    add-float v16, v16, p22

    .line 394
    :cond_2
    if-nez p8, :cond_e

    const/4 v5, 0x0

    :goto_0
    float-to-int v0, v5

    move/from16 v25, v0

    .line 396
    .local v25, "realWidth":I
    move-object/from16 v0, p0

    move/from16 v1, v25

    move/from16 v2, p9

    move/from16 v3, v21

    move-object/from16 v4, v22

    invoke-static {v0, v1, v2, v3, v4}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->computeTextProperty(Ljava/lang/String;IIFLandroid/graphics/Paint;)Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;

    move-result-object v26

    .line 397
    .local v26, "textProperty":Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;
    invoke-virtual/range {v22 .. v22}, Landroid/graphics/Paint;->getFontMetricsInt()Landroid/graphics/Paint$FontMetricsInt;

    move-result-object v20

    .line 398
    .local v20, "fontMetricsInt":Landroid/graphics/Paint$FontMetricsInt;
    if-nez p9, :cond_f

    invoke-static/range {v26 .. v26}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->access$000(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;)F

    move-result v5

    float-to-double v5, v5

    :goto_1
    invoke-static {v5, v6}, Ljava/lang/Math;->ceil(D)D

    move-result-wide v5

    double-to-int v0, v5

    move/from16 v17, v0

    .line 400
    .local v17, "bitmapTotalHeight":I
    invoke-static/range {v26 .. v26}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->access$200(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;)F

    move-result v5

    move/from16 v0, p6

    invoke-static {v5, v0}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->horizontalAlignmentOffset(FI)F

    move-result v5

    move-object/from16 v0, v26

    invoke-static {v0, v5}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->access$102(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;F)F

    .line 401
    move-object/from16 v0, v20

    move/from16 v1, p9

    move-object/from16 v2, v26

    move/from16 v3, v21

    move/from16 v4, p7

    invoke-static {v0, v1, v2, v3, v4}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->fontAndVerticalAlignmentOffset(Landroid/graphics/Paint$FontMetricsInt;ILorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;FI)F

    move-result v5

    move-object/from16 v0, v26

    invoke-static {v0, v5}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->access$302(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;F)F

    .line 403
    if-eqz p10, :cond_4

    .line 404
    const/high16 v5, 0x3f000000    # 0.5f

    mul-float v5, v5, p13

    move-object/from16 v0, v26

    invoke-static {v0, v5}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->access$116(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;F)F

    .line 405
    const/high16 v5, 0x3f000000    # 0.5f

    mul-float v5, v5, p13

    move-object/from16 v0, v26

    invoke-static {v0, v5}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->access$316(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;F)F

    .line 406
    move/from16 v0, p11

    float-to-double v5, v0

    const-wide/16 v7, 0x0

    cmpg-double v5, v5, v7

    if-gez v5, :cond_3

    .line 408
    invoke-static/range {p11 .. p11}, Ljava/lang/Math;->abs(F)F

    move-result v5

    move-object/from16 v0, v26

    invoke-static {v0, v5}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->access$116(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;F)F

    .line 411
    :cond_3
    move/from16 v0, p12

    float-to-double v5, v0

    const-wide/16 v7, 0x0

    cmpg-double v5, v5, v7

    if-gez v5, :cond_4

    .line 413
    invoke-static/range {p12 .. p12}, Ljava/lang/Math;->abs(F)F

    move-result v5

    move-object/from16 v0, v26

    invoke-static {v0, v5}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->access$316(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;F)F

    .line 417
    :cond_4
    if-eqz p18, :cond_5

    .line 418
    const/high16 v5, 0x3f000000    # 0.5f

    mul-float v5, v5, p22

    move-object/from16 v0, v26

    invoke-static {v0, v5}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->access$116(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;F)F

    .line 419
    const/high16 v5, 0x3f000000    # 0.5f

    mul-float v5, v5, p22

    move-object/from16 v0, v26

    invoke-static {v0, v5}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->access$316(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;F)F

    .line 422
    :cond_5
    invoke-static/range {v26 .. v26}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->access$100(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;)F

    move-result v5

    float-to-double v5, v5

    invoke-static {v5, v6}, Ljava/lang/Math;->ceil(D)D

    move-result-wide v5

    double-to-float v5, v5

    move-object/from16 v0, v26

    invoke-static {v0, v5}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->access$102(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;F)F

    .line 423
    invoke-static/range {v26 .. v26}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->access$300(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;)F

    move-result v5

    float-to-double v5, v5

    invoke-static {v5, v6}, Ljava/lang/Math;->ceil(D)D

    move-result-wide v5

    double-to-float v5, v5

    move-object/from16 v0, v26

    invoke-static {v0, v5}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->access$302(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;F)F

    .line 425
    invoke-static/range {v26 .. v26}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->access$200(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;)F

    move-result v5

    add-float/2addr v5, v15

    float-to-double v5, v5

    invoke-static {v5, v6}, Ljava/lang/Math;->ceil(D)D

    move-result-wide v5

    double-to-int v0, v5

    move/from16 v18, v0

    .line 426
    .local v18, "bitmapWidth":I
    move/from16 v0, v17

    int-to-float v5, v0

    add-float v5, v5, v16

    float-to-double v5, v5

    invoke-static {v5, v6}, Ljava/lang/Math;->ceil(D)D

    move-result-wide v5

    double-to-int v14, v5

    .line 428
    .local v14, "bitmapHeight":I
    sget-object v5, Landroid/graphics/Bitmap$Config;->ARGB_8888:Landroid/graphics/Bitmap$Config;

    move/from16 v0, v18

    invoke-static {v0, v14, v5}, Landroid/graphics/Bitmap;->createBitmap(IILandroid/graphics/Bitmap$Config;)Landroid/graphics/Bitmap;

    move-result-object v13

    .line 430
    .local v13, "bitmap":Landroid/graphics/Bitmap;
    new-instance v19, Landroid/graphics/Canvas;

    move-object/from16 v0, v19

    invoke-direct {v0, v13}, Landroid/graphics/Canvas;-><init>(Landroid/graphics/Bitmap;)V

    .line 433
    .local v19, "canvas":Landroid/graphics/Canvas;
    const/16 v23, 0x0

    .line 434
    .local v23, "paintShadow":Landroid/graphics/Paint;
    const/16 v24, 0x0

    .line 436
    .local v24, "paintStroke":Landroid/graphics/Paint;
    if-eqz p24, :cond_7

    .line 438
    move-object/from16 v0, p24

    iget-boolean v5, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->gradientEnabled:Z

    if-eqz v5, :cond_6

    .line 440
    new-instance v5, Landroid/graphics/LinearGradient;

    move/from16 v0, p8

    int-to-float v6, v0

    move-object/from16 v0, p24

    iget v7, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->startX:F

    mul-float/2addr v6, v7

    move/from16 v0, v17

    int-to-float v7, v0

    move-object/from16 v0, p24

    iget v8, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->startY:F

    mul-float/2addr v7, v8

    move/from16 v0, p8

    int-to-float v8, v0

    move-object/from16 v0, p24

    iget v9, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->endX:F

    mul-float/2addr v8, v9

    move/from16 v0, v17

    int-to-float v9, v0

    move-object/from16 v0, p24

    iget v10, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->endY:F

    mul-float/2addr v9, v10

    move-object/from16 v0, p24

    iget v10, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->startColorR:I

    move-object/from16 v0, p24

    iget v11, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->startColorG:I

    move-object/from16 v0, p24

    iget v12, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->startColorB:I

    invoke-static {v10, v11, v12}, Landroid/graphics/Color;->rgb(III)I

    move-result v10

    move-object/from16 v0, p24

    iget v11, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->endColorR:I

    move-object/from16 v0, p24

    iget v12, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->endColorG:I

    move-object/from16 v0, p24

    iget v0, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->endColorB:I

    move/from16 v27, v0

    move/from16 v0, v27

    invoke-static {v11, v12, v0}, Landroid/graphics/Color;->rgb(III)I

    move-result v11

    sget-object v12, Landroid/graphics/Shader$TileMode;->CLAMP:Landroid/graphics/Shader$TileMode;

    invoke-direct/range {v5 .. v12}, Landroid/graphics/LinearGradient;-><init>(FFFFIILandroid/graphics/Shader$TileMode;)V

    move-object/from16 v0, v22

    invoke-virtual {v0, v5}, Landroid/graphics/Paint;->setShader(Landroid/graphics/Shader;)Landroid/graphics/Shader;

    .line 447
    :cond_6
    move-object/from16 v0, p24

    iget-boolean v5, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->underlineEnabled:Z

    if-eqz v5, :cond_7

    .line 449
    const/4 v5, 0x1

    move-object/from16 v0, v22

    invoke-virtual {v0, v5}, Landroid/graphics/Paint;->setUnderlineText(Z)V

    .line 453
    :cond_7
    if-eqz p10, :cond_9

    .line 455
    move-object/from16 v0, p1

    move/from16 v1, p2

    move/from16 v2, p6

    invoke-static {v0, v1, v2}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->newPaint(Ljava/lang/String;II)Landroid/graphics/Paint;

    move-result-object v23

    .line 457
    if-eqz p18, :cond_8

    .line 458
    sget-object v5, Landroid/graphics/Paint$Style;->FILL_AND_STROKE:Landroid/graphics/Paint$Style;

    move-object/from16 v0, v23

    invoke-virtual {v0, v5}, Landroid/graphics/Paint;->setStyle(Landroid/graphics/Paint$Style;)V

    .line 459
    move-object/from16 v0, v23

    move/from16 v1, p22

    invoke-virtual {v0, v1}, Landroid/graphics/Paint;->setStrokeWidth(F)V

    .line 460
    sget-object v5, Landroid/graphics/Paint$Join;->ROUND:Landroid/graphics/Paint$Join;

    move-object/from16 v0, v23

    invoke-virtual {v0, v5}, Landroid/graphics/Paint;->setStrokeJoin(Landroid/graphics/Paint$Join;)V

    .line 463
    :cond_8
    const/high16 v5, 0x3f000000    # 0.5f

    mul-float v5, v5, p13

    const/high16 v6, 0x437f0000    # 255.0f

    mul-float v6, v6, p14

    float-to-int v6, v6

    const/high16 v7, 0x437f0000    # 255.0f

    mul-float v7, v7, p15

    float-to-int v7, v7

    const/high16 v8, 0x437f0000    # 255.0f

    mul-float v8, v8, p16

    float-to-int v8, v8

    const/high16 v9, 0x437f0000    # 255.0f

    mul-float v9, v9, p17

    float-to-int v9, v9

    invoke-static {v6, v7, v8, v9}, Landroid/graphics/Color;->argb(IIII)I

    move-result v6

    move-object/from16 v0, v23

    move/from16 v1, p11

    move/from16 v2, p12

    invoke-virtual {v0, v5, v1, v2, v6}, Landroid/graphics/Paint;->setShadowLayer(FFFI)V

    .line 468
    :cond_9
    if-eqz p18, :cond_a

    .line 470
    move-object/from16 v0, p1

    move/from16 v1, p2

    move/from16 v2, p6

    invoke-static {v0, v1, v2}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->newPaint(Ljava/lang/String;II)Landroid/graphics/Paint;

    move-result-object v24

    .line 471
    sget-object v5, Landroid/graphics/Paint$Style;->STROKE:Landroid/graphics/Paint$Style;

    move-object/from16 v0, v24

    invoke-virtual {v0, v5}, Landroid/graphics/Paint;->setStyle(Landroid/graphics/Paint$Style;)V

    .line 472
    move-object/from16 v0, v24

    move/from16 v1, p22

    invoke-virtual {v0, v1}, Landroid/graphics/Paint;->setStrokeWidth(F)V

    .line 473
    sget-object v5, Landroid/graphics/Paint$Join;->ROUND:Landroid/graphics/Paint$Join;

    move-object/from16 v0, v24

    invoke-virtual {v0, v5}, Landroid/graphics/Paint;->setStrokeJoin(Landroid/graphics/Paint$Join;)V

    .line 475
    if-eqz p24, :cond_10

    move-object/from16 v0, p24

    iget-boolean v5, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->strokeGradientEnabled:Z

    if-eqz v5, :cond_10

    .line 477
    new-instance v5, Landroid/graphics/LinearGradient;

    move/from16 v0, p8

    int-to-float v6, v0

    move-object/from16 v0, p24

    iget v7, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->strokeStartX:F

    mul-float/2addr v6, v7

    move/from16 v0, v17

    int-to-float v7, v0

    move-object/from16 v0, p24

    iget v8, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->strokeStartY:F

    mul-float/2addr v7, v8

    move/from16 v0, p8

    int-to-float v8, v0

    move-object/from16 v0, p24

    iget v9, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->strokeEndX:F

    mul-float/2addr v8, v9

    move/from16 v0, v17

    int-to-float v9, v0

    move-object/from16 v0, p24

    iget v10, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->strokeEndY:F

    mul-float/2addr v9, v10

    move-object/from16 v0, p24

    iget v10, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->strokeStartColorR:I

    move-object/from16 v0, p24

    iget v11, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->strokeStartColorG:I

    move-object/from16 v0, p24

    iget v12, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->strokeStartColorB:I

    invoke-static {v10, v11, v12}, Landroid/graphics/Color;->rgb(III)I

    move-result v10

    move-object/from16 v0, p24

    iget v11, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->strokeEndColorR:I

    move-object/from16 v0, p24

    iget v12, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->strokeEndColorG:I

    move-object/from16 v0, p24

    iget v0, v0, Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;->strokeEndColorB:I

    move/from16 v27, v0

    move/from16 v0, v27

    invoke-static {v11, v12, v0}, Landroid/graphics/Color;->rgb(III)I

    move-result v11

    sget-object v12, Landroid/graphics/Shader$TileMode;->CLAMP:Landroid/graphics/Shader$TileMode;

    invoke-direct/range {v5 .. v12}, Landroid/graphics/LinearGradient;-><init>(FFFFIILandroid/graphics/Shader$TileMode;)V

    move-object/from16 v0, v24

    invoke-virtual {v0, v5}, Landroid/graphics/Paint;->setShader(Landroid/graphics/Shader;)Landroid/graphics/Shader;

    .line 492
    :cond_a
    :goto_2
    if-eqz p10, :cond_b

    .line 494
    move-object/from16 v0, v26

    move-object/from16 v1, v19

    move-object/from16 v2, v23

    invoke-static {v0, v1, v2}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->drawText(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;Landroid/graphics/Canvas;Landroid/graphics/Paint;)V

    .line 498
    :cond_b
    if-eqz p18, :cond_c

    if-eqz p23, :cond_c

    .line 500
    move-object/from16 v0, v26

    move-object/from16 v1, v19

    move-object/from16 v2, v24

    invoke-static {v0, v1, v2}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->drawText(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;Landroid/graphics/Canvas;Landroid/graphics/Paint;)V

    .line 504
    :cond_c
    move-object/from16 v0, v26

    move-object/from16 v1, v19

    move-object/from16 v2, v22

    invoke-static {v0, v1, v2}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->drawText(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;Landroid/graphics/Canvas;Landroid/graphics/Paint;)V

    .line 507
    if-eqz p18, :cond_d

    if-nez p23, :cond_d

    .line 508
    move-object/from16 v0, v26

    move-object/from16 v1, v19

    move-object/from16 v2, v24

    invoke-static {v0, v1, v2}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->drawText(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;Landroid/graphics/Canvas;Landroid/graphics/Paint;)V

    .line 511
    :cond_d
    invoke-static {v13}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->initNativeObject(Landroid/graphics/Bitmap;)V

    .line 512
    return-void

    .line 394
    .end local v13    # "bitmap":Landroid/graphics/Bitmap;
    .end local v14    # "bitmapHeight":I
    .end local v17    # "bitmapTotalHeight":I
    .end local v18    # "bitmapWidth":I
    .end local v19    # "canvas":Landroid/graphics/Canvas;
    .end local v20    # "fontMetricsInt":Landroid/graphics/Paint$FontMetricsInt;
    .end local v23    # "paintShadow":Landroid/graphics/Paint;
    .end local v24    # "paintStroke":Landroid/graphics/Paint;
    .end local v25    # "realWidth":I
    .end local v26    # "textProperty":Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;
    :cond_e
    move/from16 v0, p8

    int-to-float v5, v0

    sub-float/2addr v5, v15

    goto/16 :goto_0

    .line 398
    .restart local v20    # "fontMetricsInt":Landroid/graphics/Paint$FontMetricsInt;
    .restart local v25    # "realWidth":I
    .restart local v26    # "textProperty":Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;
    :cond_f
    move/from16 v0, p9

    int-to-double v5, v0

    goto/16 :goto_1

    .line 485
    .restart local v13    # "bitmap":Landroid/graphics/Bitmap;
    .restart local v14    # "bitmapHeight":I
    .restart local v17    # "bitmapTotalHeight":I
    .restart local v18    # "bitmapWidth":I
    .restart local v19    # "canvas":Landroid/graphics/Canvas;
    .restart local v23    # "paintShadow":Landroid/graphics/Paint;
    .restart local v24    # "paintStroke":Landroid/graphics/Paint;
    :cond_10
    const/16 v5, 0xff

    const/high16 v6, 0x437f0000    # 255.0f

    mul-float v6, v6, p19

    float-to-int v6, v6

    const/high16 v7, 0x437f0000    # 255.0f

    mul-float v7, v7, p20

    float-to-int v7, v7

    const/high16 v8, 0x437f0000    # 255.0f

    mul-float v8, v8, p21

    float-to-int v8, v8

    move-object/from16 v0, v24

    invoke-virtual {v0, v5, v6, v7, v8}, Landroid/graphics/Paint;->setARGB(IIII)V

    goto :goto_2
.end method

.method private static _pushStringToLinesByMaxWidth(Ljava/util/LinkedList;Ljava/lang/String;ILandroid/graphics/Paint;)V
    .locals 9
    .param p1, "toBeAdd"    # Ljava/lang/String;
    .param p2, "maxWidth"    # I
    .param p3, "pPaint"    # Landroid/graphics/Paint;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/LinkedList",
            "<",
            "Ljava/lang/String;",
            ">;",
            "Ljava/lang/String;",
            "I",
            "Landroid/graphics/Paint;",
            ")V"
        }
    .end annotation

    .prologue
    .local p0, "inout":Ljava/util/LinkedList;, "Ljava/util/LinkedList<Ljava/lang/String;>;"
    const/4 v7, 0x0

    .line 755
    invoke-virtual {p0}, Ljava/util/LinkedList;->size()I

    move-result v5

    if-lez v5, :cond_1

    invoke-virtual {p0}, Ljava/util/LinkedList;->getLast()Ljava/lang/Object;

    move-result-object v5

    check-cast v5, Ljava/lang/String;

    move-object v3, v5

    .line 756
    .local v3, "temp":Ljava/lang/String;
    :goto_0
    new-instance v5, Ljava/lang/StringBuilder;

    invoke-direct {v5}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v5, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    .line 757
    invoke-virtual {v3}, Ljava/lang/String;->length()I

    move-result v5

    invoke-virtual {p3, v3, v7, v5}, Landroid/graphics/Paint;->measureText(Ljava/lang/String;II)F

    move-result v5

    float-to-double v5, v5

    invoke-static {v5, v6}, Ljava/lang/Math;->ceil(D)D

    move-result-wide v5

    double-to-int v4, v5

    .line 758
    .local v4, "tempWidth":I
    if-ge v4, p2, :cond_3

    .line 761
    invoke-virtual {p0}, Ljava/util/LinkedList;->size()I

    move-result v5

    if-lez v5, :cond_2

    .line 762
    invoke-virtual {p0}, Ljava/util/LinkedList;->size()I

    move-result v5

    add-int/lit8 v5, v5, -0x1

    invoke-virtual {p0, v5, v3}, Ljava/util/LinkedList;->set(ILjava/lang/Object;)Ljava/lang/Object;

    .line 786
    :cond_0
    :goto_1
    return-void

    .line 755
    .end local v3    # "temp":Ljava/lang/String;
    .end local v4    # "tempWidth":I
    :cond_1
    const-string v3, ""

    goto :goto_0

    .line 764
    .restart local v3    # "temp":Ljava/lang/String;
    .restart local v4    # "tempWidth":I
    :cond_2
    invoke-virtual {p0, v3}, Ljava/util/LinkedList;->add(Ljava/lang/Object;)Z

    goto :goto_1

    .line 766
    :cond_3
    invoke-virtual {p1}, Ljava/lang/String;->length()I

    move-result v5

    invoke-virtual {p3, p1, v7, v5}, Landroid/graphics/Paint;->measureText(Ljava/lang/String;II)F

    move-result v5

    float-to-double v5, v5

    invoke-static {v5, v6}, Ljava/lang/Math;->ceil(D)D

    move-result-wide v5

    int-to-double v7, p2

    cmpl-double v5, v5, v7

    if-ltz v5, :cond_6

    .line 769
    const/4 v0, 0x0

    .line 770
    .local v0, "InnerStart":I
    const/4 v2, 0x1

    .local v2, "sindex":I
    :goto_2
    invoke-virtual {p1}, Ljava/lang/String;->length()I

    move-result v5

    if-gt v2, v5, :cond_5

    .line 772
    invoke-virtual {p3, p1, v0, v2}, Landroid/graphics/Paint;->measureText(Ljava/lang/String;II)F

    move-result v5

    float-to-double v5, v5

    invoke-static {v5, v6}, Ljava/lang/Math;->ceil(D)D

    move-result-wide v5

    double-to-int v1, v5

    .line 773
    .local v1, "fragwidth":I
    if-lt v1, p2, :cond_4

    .line 775
    add-int/lit8 v5, v2, -0x1

    invoke-virtual {p1, v0, v5}, Ljava/lang/String;->substring(II)Ljava/lang/String;

    move-result-object v5

    invoke-virtual {p0, v5}, Ljava/util/LinkedList;->add(Ljava/lang/Object;)Z

    .line 776
    add-int/lit8 v0, v2, -0x1

    .line 770
    :cond_4
    add-int/lit8 v2, v2, 0x1

    goto :goto_2

    .line 779
    .end local v1    # "fragwidth":I
    :cond_5
    invoke-virtual {p1}, Ljava/lang/String;->length()I

    move-result v5

    add-int/lit8 v5, v5, -0x1

    if-ge v0, v5, :cond_0

    .line 780
    invoke-virtual {p1, v0}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object v5

    invoke-virtual {p0, v5}, Ljava/util/LinkedList;->add(Ljava/lang/Object;)Z

    goto :goto_1

    .line 784
    .end local v0    # "InnerStart":I
    .end local v2    # "sindex":I
    :cond_6
    invoke-virtual {p0, p1}, Ljava/util/LinkedList;->add(Ljava/lang/Object;)Z

    goto :goto_1
.end method

.method private static computeTextProperty(Ljava/lang/String;IIFLandroid/graphics/Paint;)Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;
    .locals 11
    .param p0, "pString"    # Ljava/lang/String;
    .param p1, "pWidth"    # I
    .param p2, "pHeight"    # I
    .param p3, "lineHeigthMultiple"    # F
    .param p4, "pPaint"    # Landroid/graphics/Paint;

    .prologue
    .line 588
    invoke-virtual {p4}, Landroid/graphics/Paint;->getFontMetrics()Landroid/graphics/Paint$FontMetrics;

    move-result-object v1

    .line 589
    .local v1, "fm":Landroid/graphics/Paint$FontMetrics;
    iget v9, v1, Landroid/graphics/Paint$FontMetrics;->bottom:F

    iget v10, v1, Landroid/graphics/Paint$FontMetrics;->top:F

    sub-float/2addr v9, v10

    mul-float v2, v9, p3

    .line 590
    .local v2, "h":F
    const/4 v7, 0x0

    .line 592
    .local v7, "maxContentWidth":I
    invoke-static {p0, p1, p2, p4}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->splitString(Ljava/lang/String;IILandroid/graphics/Paint;)[Ljava/lang/String;

    move-result-object v6

    .line 595
    .local v6, "lines":[Ljava/lang/String;
    if-eqz p1, :cond_1

    .line 596
    move v7, p1

    .line 614
    :cond_0
    :goto_0
    new-instance v9, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;

    int-to-float v10, v7

    invoke-direct {v9, v10, v2, v6}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;-><init>(FF[Ljava/lang/String;)V

    return-object v9

    .line 599
    :cond_1
    const/4 v8, 0x0

    .line 600
    .local v8, "temp":I
    move-object v0, v6

    .local v0, "arr$":[Ljava/lang/String;
    array-length v4, v0

    .local v4, "len$":I
    const/4 v3, 0x0

    .local v3, "i$":I
    :goto_1
    if-ge v3, v4, :cond_3

    aget-object v5, v0, v3

    .line 601
    .local v5, "line":Ljava/lang/String;
    const/4 v9, 0x0

    invoke-virtual {v5}, Ljava/lang/String;->length()I

    move-result v10

    invoke-virtual {p4, v5, v9, v10}, Landroid/graphics/Paint;->measureText(Ljava/lang/String;II)F

    move-result v9

    float-to-double v9, v9

    invoke-static {v9, v10}, Ljava/lang/Math;->ceil(D)D

    move-result-wide v9

    double-to-int v8, v9

    .line 603
    if-le v8, v7, :cond_2

    .line 604
    move v7, v8

    .line 600
    :cond_2
    add-int/lit8 v3, v3, 0x1

    goto :goto_1

    .line 608
    .end local v5    # "line":Ljava/lang/String;
    :cond_3
    if-nez v7, :cond_0

    .line 610
    const/4 v7, 0x1

    goto :goto_0
.end method

.method public static createTextBitmap(Ljava/lang/String;Ljava/lang/String;IIII)V
    .locals 26
    .param p0, "pString"    # Ljava/lang/String;
    .param p1, "pFontName"    # Ljava/lang/String;
    .param p2, "pFontSize"    # I
    .param p3, "pAlignment"    # I
    .param p4, "pWidth"    # I
    .param p5, "pHeight"    # I

    .prologue
    .line 104
    const/high16 v3, 0x3f800000    # 1.0f

    const/high16 v4, 0x3f800000    # 1.0f

    const/high16 v5, 0x3f800000    # 1.0f

    const/4 v9, 0x0

    const/4 v10, 0x0

    const/4 v11, 0x0

    const/4 v12, 0x0

    const/4 v13, 0x0

    const/4 v14, 0x0

    const/4 v15, 0x0

    const/16 v16, 0x0

    const/16 v17, 0x0

    const/high16 v18, 0x3f800000    # 1.0f

    const/high16 v19, 0x3f800000    # 1.0f

    const/high16 v20, 0x3f800000    # 1.0f

    const/high16 v21, 0x3f800000    # 1.0f

    const/16 v22, 0x0

    const/16 v23, 0x0

    const/16 v24, 0x0

    const/16 v25, 0x0

    move-object/from16 v0, p0

    move-object/from16 v1, p1

    move/from16 v2, p2

    move/from16 v6, p3

    move/from16 v7, p4

    move/from16 v8, p5

    invoke-static/range {v0 .. v25}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->createTextBitmapShadowStroke(Ljava/lang/String;Ljava/lang/String;IFFFIIIZFFFFFFFZFFFFZLorg/cocos2dx/lib/Cocos2dxTTFExtInfo;[II)V

    .line 109
    return-void
.end method

.method public static createTextBitmapShadowStroke(Ljava/lang/String;Ljava/lang/String;IFFFIIIZFFFFFFFZFFFFZLorg/cocos2dx/lib/Cocos2dxTTFExtInfo;[II)V
    .locals 31
    .param p0, "pString"    # Ljava/lang/String;
    .param p1, "pFontName"    # Ljava/lang/String;
    .param p2, "pFontSize"    # I
    .param p3, "fontTintR"    # F
    .param p4, "fontTintG"    # F
    .param p5, "fontTintB"    # F
    .param p6, "pAlignment"    # I
    .param p7, "pWidth"    # I
    .param p8, "pHeight"    # I
    .param p9, "shadow"    # Z
    .param p10, "shadowDX"    # F
    .param p11, "shadowDY"    # F
    .param p12, "shadowBlur"    # F
    .param p13, "shadowOpacity"    # F
    .param p14, "shadowR"    # F
    .param p15, "shadowG"    # F
    .param p16, "shadowB"    # F
    .param p17, "stroke"    # Z
    .param p18, "strokeR"    # F
    .param p19, "strokeG"    # F
    .param p20, "strokeB"    # F
    .param p21, "strokeSize"    # F
    .param p22, "outStroke"    # Z
    .param p23, "extInfo"    # Lorg/cocos2dx/lib/Cocos2dxTTFExtInfo;
    .param p24, "richInfoAry"    # [I
    .param p25, "richInfoLen"    # I

    .prologue
    .line 522
    and-int/lit8 v4, p6, 0xf

    .line 523
    .local v4, "horizontalAlignment":I
    shr-int/lit8 v1, p6, 0x4

    and-int/lit8 v5, v1, 0xf

    .line 525
    .local v5, "verticalAlignment":I
    const/4 v1, 0x1

    move/from16 v0, p25

    if-ne v0, v1, :cond_0

    .line 527
    const/4 v1, 0x3

    aget p2, p24, v1

    .line 528
    const/4 v1, 0x0

    aget v1, p24, v1

    int-to-float v1, v1

    const/high16 v2, 0x437f0000    # 255.0f

    div-float p3, v1, v2

    .line 529
    const/4 v1, 0x1

    aget v1, p24, v1

    int-to-float v1, v1

    const/high16 v2, 0x437f0000    # 255.0f

    div-float p4, v1, v2

    .line 530
    const/4 v1, 0x2

    aget v1, p24, v1

    int-to-float v1, v1

    const/high16 v2, 0x437f0000    # 255.0f

    div-float p5, v1, v2

    .line 533
    :cond_0
    const/4 v1, 0x1

    move/from16 v0, p25

    if-le v0, v1, :cond_1

    move-object/from16 v1, p0

    move-object/from16 v2, p1

    move/from16 v3, p2

    move/from16 v6, p7

    move/from16 v7, p8

    move-object/from16 v8, p24

    move/from16 v9, p25

    .line 535
    invoke-static/range {v1 .. v9}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->_createTextBitmapShadowStrokeForRichText(Ljava/lang/String;Ljava/lang/String;IIIII[II)V

    .line 543
    :goto_0
    return-void

    :cond_1
    move-object/from16 v6, p0

    move-object/from16 v7, p1

    move/from16 v8, p2

    move/from16 v9, p3

    move/from16 v10, p4

    move/from16 v11, p5

    move v12, v4

    move v13, v5

    move/from16 v14, p7

    move/from16 v15, p8

    move/from16 v16, p9

    move/from16 v17, p10

    move/from16 v18, p11

    move/from16 v19, p12

    move/from16 v20, p13

    move/from16 v21, p14

    move/from16 v22, p15

    move/from16 v23, p16

    move/from16 v24, p17

    move/from16 v25, p18

    move/from16 v26, p19

    move/from16 v27, p20

    move/from16 v28, p21

    move/from16 v29, p22

    move-object/from16 v30, p23

    .line 538
    invoke-static/range {v6 .. v30}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->_createTextBitmapShadowStrokeForTTF(Ljava/lang/String;Ljava/lang/String;IFFFIIIIZFFFFFFFZFFFFZLorg/cocos2dx/lib/Cocos2dxTTFExtInfo;)V

    goto :goto_0
.end method

.method public static devideStringByLanguage(Ljava/lang/String;)Ljava/util/Vector;
    .locals 11
    .param p0, "str"    # Ljava/lang/String;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/lang/String;",
            ")",
            "Ljava/util/Vector",
            "<",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation

    .prologue
    .line 178
    const/4 v0, 0x0

    .line 179
    .local v0, "LanguageDefault":I
    const/4 v1, 0x1

    .line 180
    .local v1, "LanguageLatin":I
    const/4 v2, 0x2

    .line 181
    .local v2, "LanguageThai":I
    const/4 v7, -0x1

    .line 182
    .local v7, "lastLanguage":I
    new-instance v5, Ljava/util/Vector;

    invoke-direct {v5}, Ljava/util/Vector;-><init>()V

    .line 183
    .local v5, "devidedStrings":Ljava/util/Vector;, "Ljava/util/Vector<Ljava/lang/String;>;"
    const/4 v6, 0x0

    .local v6, "i":I
    :goto_0
    invoke-virtual {p0}, Ljava/lang/String;->length()I

    move-result v8

    if-ge v6, v8, :cond_3

    .line 185
    add-int/lit8 v8, v6, 0x1

    invoke-virtual {p0, v6, v8}, Ljava/lang/String;->substring(II)Ljava/lang/String;

    move-result-object v3

    .line 186
    .local v3, "ch":Ljava/lang/String;
    const/4 v4, 0x0

    .line 187
    .local v4, "currentLanguage":I
    invoke-static {v3}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->IsLatinLanguage(Ljava/lang/String;)Z

    move-result v8

    if-eqz v8, :cond_1

    .line 188
    const/4 v4, 0x1

    .line 191
    :cond_0
    :goto_1
    if-ne v7, v4, :cond_2

    if-eqz v4, :cond_2

    .line 193
    invoke-virtual {v5}, Ljava/util/Vector;->size()I

    move-result v8

    add-int/lit8 v9, v8, -0x1

    new-instance v10, Ljava/lang/StringBuilder;

    invoke-direct {v10}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v5}, Ljava/util/Vector;->lastElement()Ljava/lang/Object;

    move-result-object v8

    check-cast v8, Ljava/lang/String;

    invoke-virtual {v10, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v8

    invoke-virtual {v5, v9, v8}, Ljava/util/Vector;->set(ILjava/lang/Object;)Ljava/lang/Object;

    .line 183
    :goto_2
    add-int/lit8 v6, v6, 0x1

    goto :goto_0

    .line 189
    :cond_1
    invoke-static {v3}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->IsThaiLanguage(Ljava/lang/String;)Z

    move-result v8

    if-eqz v8, :cond_0

    .line 190
    const/4 v4, 0x2

    goto :goto_1

    .line 197
    :cond_2
    invoke-virtual {v5, v3}, Ljava/util/Vector;->add(Ljava/lang/Object;)Z

    .line 198
    move v7, v4

    goto :goto_2

    .line 201
    .end local v3    # "ch":Ljava/lang/String;
    .end local v4    # "currentLanguage":I
    :cond_3
    return-object v5
.end method

.method private static divideFirstStringWithWidth(Ljava/util/Vector;ILandroid/graphics/Paint;)I
    .locals 7
    .param p1, "pMaxWidth"    # I
    .param p2, "pPaint"    # Landroid/graphics/Paint;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/Vector",
            "<",
            "Ljava/lang/String;",
            ">;I",
            "Landroid/graphics/Paint;",
            ")I"
        }
    .end annotation

    .prologue
    .local p0, "strList":Ljava/util/Vector;, "Ljava/util/Vector<Ljava/lang/String;>;"
    const/4 v6, 0x0

    .line 740
    invoke-virtual {p0}, Ljava/util/Vector;->size()I

    move-result v0

    .line 741
    .local v0, "charLength":I
    const/4 v3, 0x0

    .line 742
    .local v3, "tempWidth":I
    const/4 v1, 0x1

    .local v1, "i":I
    :goto_0
    if-gt v1, v0, :cond_0

    .line 743
    invoke-static {p0, v6, v1}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->MergeStringList(Ljava/util/Vector;II)Ljava/lang/String;

    move-result-object v2

    .line 744
    .local v2, "pString":Ljava/lang/String;
    invoke-virtual {v2}, Ljava/lang/String;->length()I

    move-result v4

    invoke-virtual {p2, v2, v6, v4}, Landroid/graphics/Paint;->measureText(Ljava/lang/String;II)F

    move-result v4

    float-to-double v4, v4

    invoke-static {v4, v5}, Ljava/lang/Math;->ceil(D)D

    move-result-wide v4

    double-to-int v3, v4

    .line 745
    if-lt v3, p1, :cond_1

    .line 746
    add-int/lit8 v0, v1, -0x1

    .line 749
    .end local v0    # "charLength":I
    .end local v2    # "pString":Ljava/lang/String;
    :cond_0
    return v0

    .line 742
    .restart local v0    # "charLength":I
    .restart local v2    # "pString":Ljava/lang/String;
    :cond_1
    add-int/lit8 v1, v1, 0x1

    goto :goto_0
.end method

.method private static divideStringWithMaxWidth(Ljava/util/Vector;IIILandroid/graphics/Paint;)Ljava/util/LinkedList;
    .locals 3
    .param p1, "startIndex"    # I
    .param p2, "endIndex"    # I
    .param p3, "pMaxWidth"    # I
    .param p4, "pPaint"    # Landroid/graphics/Paint;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/Vector",
            "<",
            "Ljava/lang/String;",
            ">;III",
            "Landroid/graphics/Paint;",
            ")",
            "Ljava/util/LinkedList",
            "<",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation

    .prologue
    .line 790
    .local p0, "inputList":Ljava/util/Vector;, "Ljava/util/Vector<Ljava/lang/String;>;"
    new-instance v1, Ljava/util/LinkedList;

    invoke-direct {v1}, Ljava/util/LinkedList;-><init>()V

    .line 792
    .local v1, "strList":Ljava/util/LinkedList;, "Ljava/util/LinkedList<Ljava/lang/String;>;"
    move v0, p1

    .local v0, "i":I
    :goto_0
    if-ge v0, p2, :cond_0

    .line 793
    invoke-virtual {p0, v0}, Ljava/util/Vector;->elementAt(I)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Ljava/lang/String;

    invoke-static {v1, v2, p3, p4}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->_pushStringToLinesByMaxWidth(Ljava/util/LinkedList;Ljava/lang/String;ILandroid/graphics/Paint;)V

    .line 792
    add-int/lit8 v0, v0, 0x1

    goto :goto_0

    .line 795
    :cond_0
    return-object v1
.end method

.method private static drawText(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;Landroid/graphics/Canvas;Landroid/graphics/Paint;)V
    .locals 1
    .param p0, "textProperty"    # Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;
    .param p1, "canvas"    # Landroid/graphics/Canvas;
    .param p2, "paint"    # Landroid/graphics/Paint;

    .prologue
    .line 665
    const/4 v0, 0x0

    invoke-static {p0, p1, p2, v0}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->drawText(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;Landroid/graphics/Canvas;Landroid/graphics/Paint;I)V

    .line 666
    return-void
.end method

.method private static drawText(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;Landroid/graphics/Canvas;Landroid/graphics/Paint;I)V
    .locals 7
    .param p0, "textProperty"    # Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;
    .param p1, "canvas"    # Landroid/graphics/Canvas;
    .param p2, "paint"    # Landroid/graphics/Paint;
    .param p3, "indentationLength"    # I

    .prologue
    .line 670
    invoke-static {p0}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->access$300(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;)F

    move-result v4

    .line 671
    .local v4, "y":F
    invoke-static {p0}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->access$500(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;)[Ljava/lang/String;

    move-result-object v0

    .local v0, "arr$":[Ljava/lang/String;
    array-length v2, v0

    .local v2, "len$":I
    const/4 v1, 0x0

    .local v1, "i$":I
    :goto_0
    if-ge v1, v2, :cond_0

    aget-object v3, v0, v1

    .line 672
    .local v3, "line":Ljava/lang/String;
    invoke-static {p0}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->access$100(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;)F

    move-result v5

    int-to-float v6, p3

    add-float/2addr v5, v6

    invoke-virtual {p1, v3, v5, v4, p2}, Landroid/graphics/Canvas;->drawText(Ljava/lang/String;FFLandroid/graphics/Paint;)V

    .line 673
    invoke-static {p0}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->access$400(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;)F

    move-result v5

    add-float/2addr v4, v5

    .line 674
    const/4 p3, 0x0

    .line 671
    add-int/lit8 v1, v1, 0x1

    goto :goto_0

    .line 676
    .end local v3    # "line":Ljava/lang/String;
    :cond_0
    return-void
.end method

.method private static fontAndVerticalAlignmentOffset(Landroid/graphics/Paint$FontMetricsInt;ILorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;FI)F
    .locals 5
    .param p0, "pFontMetricsInt"    # Landroid/graphics/Paint$FontMetricsInt;
    .param p1, "pConstrainHeight"    # I
    .param p2, "pTextproperty"    # Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;
    .param p3, "pLineHeightMultiple"    # F
    .param p4, "pVerticalAlignment"    # I

    .prologue
    .line 639
    iget v1, p0, Landroid/graphics/Paint$FontMetricsInt;->top:I

    neg-int v1, v1

    int-to-float v0, v1

    .line 641
    .local v0, "y":F
    float-to-double v1, p3

    const-wide/16 v3, 0x0

    cmpl-double v1, v1, v3

    if-lez v1, :cond_0

    .line 642
    const/high16 v1, 0x3f800000    # 1.0f

    sub-float v1, p3, v1

    invoke-static {p2}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->access$400(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;)F

    move-result v2

    mul-float/2addr v1, v2

    add-float/2addr v0, v1

    .line 645
    :cond_0
    int-to-float v1, p1

    invoke-static {p2}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->access$000(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;)F

    move-result v2

    cmpl-float v1, v1, v2

    if-lez v1, :cond_1

    .line 646
    packed-switch p4, :pswitch_data_0

    .line 660
    :cond_1
    :goto_0
    :pswitch_0
    return v0

    .line 650
    :pswitch_1
    int-to-float v1, p1

    invoke-static {p2}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->access$000(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;)F

    move-result v2

    sub-float/2addr v1, v2

    const/high16 v2, 0x3f000000    # 0.5f

    mul-float/2addr v1, v2

    add-float/2addr v0, v1

    .line 651
    goto :goto_0

    .line 653
    :pswitch_2
    int-to-float v1, p1

    invoke-static {p2}, Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;->access$000(Lorg/cocos2dx/lib/Cocos2dxBitmap$TextProperty;)F

    move-result v2

    sub-float/2addr v1, v2

    add-float/2addr v0, v1

    .line 654
    goto :goto_0

    .line 646
    nop

    :pswitch_data_0
    .packed-switch 0x1
        :pswitch_0
        :pswitch_2
        :pswitch_1
    .end packed-switch
.end method

.method private static getFontSizeAccordingHeight(I)I
    .locals 8
    .param p0, "height"    # I

    .prologue
    .line 853
    new-instance v3, Landroid/graphics/Paint;

    invoke-direct {v3}, Landroid/graphics/Paint;-><init>()V

    .line 854
    .local v3, "paint":Landroid/graphics/Paint;
    new-instance v0, Landroid/graphics/Rect;

    invoke-direct {v0}, Landroid/graphics/Rect;-><init>()V

    .line 856
    .local v0, "bounds":Landroid/graphics/Rect;
    sget-object v5, Landroid/graphics/Typeface;->DEFAULT:Landroid/graphics/Typeface;

    invoke-virtual {v3, v5}, Landroid/graphics/Paint;->setTypeface(Landroid/graphics/Typeface;)Landroid/graphics/Typeface;

    .line 857
    const/4 v2, 0x1

    .line 858
    .local v2, "incr_text_size":I
    const/4 v1, 0x0

    .line 860
    .local v1, "found_desired_size":Z
    :goto_0
    if-nez v1, :cond_1

    .line 862
    int-to-float v5, v2

    invoke-virtual {v3, v5}, Landroid/graphics/Paint;->setTextSize(F)V

    .line 863
    const-string v4, "SghMNy"

    .line 864
    .local v4, "text":Ljava/lang/String;
    const/4 v5, 0x0

    invoke-virtual {v4}, Ljava/lang/String;->length()I

    move-result v6

    invoke-virtual {v3, v4, v5, v6, v0}, Landroid/graphics/Paint;->getTextBounds(Ljava/lang/String;IILandroid/graphics/Rect;)V

    .line 866
    add-int/lit8 v2, v2, 0x1

    .line 868
    invoke-virtual {v0}, Landroid/graphics/Rect;->height()I

    move-result v5

    sub-int v5, p0, v5

    const/4 v6, 0x2

    if-gt v5, v6, :cond_0

    .line 869
    const/4 v1, 0x1

    .line 871
    :cond_0
    const-string v5, "font size"

    new-instance v6, Ljava/lang/StringBuilder;

    invoke-direct {v6}, Ljava/lang/StringBuilder;-><init>()V

    const-string v7, "incr size:"

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v6

    invoke-static {v5, v6}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    goto :goto_0

    .line 873
    .end local v4    # "text":Ljava/lang/String;
    :cond_1
    return v2
.end method

.method private static getPixels(Landroid/graphics/Bitmap;)[B
    .locals 4
    .param p0, "pBitmap"    # Landroid/graphics/Bitmap;

    .prologue
    .line 840
    if-eqz p0, :cond_0

    .line 841
    invoke-virtual {p0}, Landroid/graphics/Bitmap;->getWidth()I

    move-result v2

    invoke-virtual {p0}, Landroid/graphics/Bitmap;->getHeight()I

    move-result v3

    mul-int/2addr v2, v3

    mul-int/lit8 v2, v2, 0x4

    new-array v1, v2, [B

    .line 843
    .local v1, "pixels":[B
    invoke-static {v1}, Ljava/nio/ByteBuffer;->wrap([B)Ljava/nio/ByteBuffer;

    move-result-object v0

    .line 844
    .local v0, "buf":Ljava/nio/ByteBuffer;
    invoke-static {}, Ljava/nio/ByteOrder;->nativeOrder()Ljava/nio/ByteOrder;

    move-result-object v2

    invoke-virtual {v0, v2}, Ljava/nio/ByteBuffer;->order(Ljava/nio/ByteOrder;)Ljava/nio/ByteBuffer;

    .line 845
    invoke-virtual {p0, v0}, Landroid/graphics/Bitmap;->copyPixelsToBuffer(Ljava/nio/Buffer;)V

    .line 849
    .end local v0    # "buf":Ljava/nio/ByteBuffer;
    .end local v1    # "pixels":[B
    :goto_0
    return-object v1

    :cond_0
    const/4 v1, 0x0

    goto :goto_0
.end method

.method private static getStringWithEllipsis(Ljava/lang/String;FF)Ljava/lang/String;
    .locals 2
    .param p0, "pString"    # Ljava/lang/String;
    .param p1, "width"    # F
    .param p2, "fontSize"    # F

    .prologue
    .line 878
    invoke-static {p0}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v1

    if-eqz v1, :cond_0

    .line 879
    const-string v1, ""

    .line 886
    :goto_0
    return-object v1

    .line 882
    :cond_0
    new-instance v0, Landroid/text/TextPaint;

    invoke-direct {v0}, Landroid/text/TextPaint;-><init>()V

    .line 883
    .local v0, "paint":Landroid/text/TextPaint;
    sget-object v1, Landroid/graphics/Typeface;->DEFAULT:Landroid/graphics/Typeface;

    invoke-virtual {v0, v1}, Landroid/text/TextPaint;->setTypeface(Landroid/graphics/Typeface;)Landroid/graphics/Typeface;

    .line 884
    invoke-virtual {v0, p2}, Landroid/text/TextPaint;->setTextSize(F)V

    .line 886
    sget-object v1, Landroid/text/TextUtils$TruncateAt;->END:Landroid/text/TextUtils$TruncateAt;

    invoke-static {p0, v0, p1, v1}, Landroid/text/TextUtils;->ellipsize(Ljava/lang/CharSequence;Landroid/text/TextPaint;FLandroid/text/TextUtils$TruncateAt;)Ljava/lang/CharSequence;

    move-result-object v1

    invoke-interface {v1}, Ljava/lang/CharSequence;->toString()Ljava/lang/String;

    move-result-object v1

    goto :goto_0
.end method

.method private static horizontalAlignmentOffset(FI)F
    .locals 2
    .param p0, "areaWidth"    # F
    .param p1, "pHorizontalAlignment"    # I

    .prologue
    .line 619
    const/4 v0, 0x0

    .line 621
    .local v0, "ret":F
    packed-switch p1, :pswitch_data_0

    .line 633
    :goto_0
    return v0

    .line 623
    :pswitch_0
    const/high16 v1, 0x40000000    # 2.0f

    div-float v0, p0, v1

    .line 624
    goto :goto_0

    .line 626
    :pswitch_1
    move v0, p0

    .line 627
    goto :goto_0

    .line 621
    :pswitch_data_0
    .packed-switch 0x2
        :pswitch_1
        :pswitch_0
    .end packed-switch
.end method

.method private static initNativeObject(Landroid/graphics/Bitmap;)V
    .locals 3
    .param p0, "pBitmap"    # Landroid/graphics/Bitmap;

    .prologue
    .line 830
    invoke-static {p0}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->getPixels(Landroid/graphics/Bitmap;)[B

    move-result-object v0

    .line 831
    .local v0, "pixels":[B
    if-nez v0, :cond_0

    .line 837
    :goto_0
    return-void

    .line 835
    :cond_0
    invoke-virtual {p0}, Landroid/graphics/Bitmap;->getWidth()I

    move-result v1

    invoke-virtual {p0}, Landroid/graphics/Bitmap;->getHeight()I

    move-result v2

    invoke-static {v1, v2, v0}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->nativeInitBitmapDC(II[B)V

    goto :goto_0
.end method

.method private static native nativeInitBitmapDC(II[B)V
.end method

.method private static newPaint(Ljava/lang/String;II)Landroid/graphics/Paint;
    .locals 7
    .param p0, "pFontName"    # Ljava/lang/String;
    .param p1, "pFontSize"    # I
    .param p2, "pHorizontalAlignment"    # I

    .prologue
    const/4 v6, 0x0

    .line 548
    new-instance v1, Landroid/graphics/Paint;

    invoke-direct {v1}, Landroid/graphics/Paint;-><init>()V

    .line 549
    .local v1, "paint":Landroid/graphics/Paint;
    const/4 v3, -0x1

    invoke-virtual {v1, v3}, Landroid/graphics/Paint;->setColor(I)V

    .line 550
    int-to-float v3, p1

    invoke-virtual {v1, v3}, Landroid/graphics/Paint;->setTextSize(F)V

    .line 551
    const/4 v3, 0x1

    invoke-virtual {v1, v3}, Landroid/graphics/Paint;->setAntiAlias(Z)V

    .line 554
    const-string v3, ".ttf"

    invoke-virtual {p0, v3}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v3

    if-eqz v3, :cond_0

    .line 556
    :try_start_0
    sget-object v3, Lorg/cocos2dx/lib/Cocos2dxBitmap;->sContext:Landroid/content/Context;

    invoke-static {v3, p0}, Lorg/cocos2dx/lib/Cocos2dxTypefaces;->get(Landroid/content/Context;Ljava/lang/String;)Landroid/graphics/Typeface;

    move-result-object v2

    .line 558
    .local v2, "typeFace":Landroid/graphics/Typeface;
    invoke-virtual {v1, v2}, Landroid/graphics/Paint;->setTypeface(Landroid/graphics/Typeface;)Landroid/graphics/Typeface;
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 570
    .end local v2    # "typeFace":Landroid/graphics/Typeface;
    :goto_0
    packed-switch p2, :pswitch_data_0

    .line 579
    sget-object v3, Landroid/graphics/Paint$Align;->LEFT:Landroid/graphics/Paint$Align;

    invoke-virtual {v1, v3}, Landroid/graphics/Paint;->setTextAlign(Landroid/graphics/Paint$Align;)V

    .line 583
    :goto_1
    return-object v1

    .line 559
    :catch_0
    move-exception v0

    .line 560
    .local v0, "e":Ljava/lang/Exception;
    const-string v3, "Cocos2dxBitmap"

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    const-string v5, "error to create ttf type face: "

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v3, v4}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 564
    invoke-static {p0, v6}, Landroid/graphics/Typeface;->create(Ljava/lang/String;I)Landroid/graphics/Typeface;

    move-result-object v3

    invoke-virtual {v1, v3}, Landroid/graphics/Paint;->setTypeface(Landroid/graphics/Typeface;)Landroid/graphics/Typeface;

    goto :goto_0

    .line 567
    .end local v0    # "e":Ljava/lang/Exception;
    :cond_0
    invoke-static {p0, v6}, Landroid/graphics/Typeface;->create(Ljava/lang/String;I)Landroid/graphics/Typeface;

    move-result-object v3

    invoke-virtual {v1, v3}, Landroid/graphics/Paint;->setTypeface(Landroid/graphics/Typeface;)Landroid/graphics/Typeface;

    goto :goto_0

    .line 572
    :pswitch_0
    sget-object v3, Landroid/graphics/Paint$Align;->CENTER:Landroid/graphics/Paint$Align;

    invoke-virtual {v1, v3}, Landroid/graphics/Paint;->setTextAlign(Landroid/graphics/Paint$Align;)V

    goto :goto_1

    .line 575
    :pswitch_1
    sget-object v3, Landroid/graphics/Paint$Align;->RIGHT:Landroid/graphics/Paint$Align;

    invoke-virtual {v1, v3}, Landroid/graphics/Paint;->setTextAlign(Landroid/graphics/Paint$Align;)V

    goto :goto_1

    .line 570
    nop

    :pswitch_data_0
    .packed-switch 0x2
        :pswitch_1
        :pswitch_0
    .end packed-switch
.end method

.method private static refactorString(Ljava/lang/String;)Ljava/lang/String;
    .locals 5
    .param p0, "pString"    # Ljava/lang/String;

    .prologue
    .line 800
    const-string v3, ""

    invoke-virtual {p0, v3}, Ljava/lang/String;->compareTo(Ljava/lang/String;)I

    move-result v3

    if-nez v3, :cond_0

    .line 801
    const-string v3, " "

    .line 826
    :goto_0
    return-object v3

    .line 808
    :cond_0
    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2, p0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    .line 809
    .local v2, "strBuilder":Ljava/lang/StringBuilder;
    const/4 v1, 0x0

    .line 810
    .local v1, "start":I
    const-string v3, "\n"

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->indexOf(Ljava/lang/String;)I

    move-result v0

    .line 811
    .local v0, "index":I
    :goto_1
    const/4 v3, -0x1

    if-eq v0, v3, :cond_2

    .line 812
    if-eqz v0, :cond_1

    add-int/lit8 v3, v0, -0x1

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->charAt(I)C

    move-result v3

    const/16 v4, 0xa

    if-ne v3, v4, :cond_3

    .line 813
    :cond_1
    const-string v3, " "

    invoke-virtual {v2, v1, v3}, Ljava/lang/StringBuilder;->insert(ILjava/lang/String;)Ljava/lang/StringBuilder;

    .line 814
    add-int/lit8 v1, v0, 0x2

    .line 819
    :goto_2
    invoke-virtual {v2}, Ljava/lang/StringBuilder;->length()I

    move-result v3

    if-gt v1, v3, :cond_2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->length()I

    move-result v3

    if-ne v0, v3, :cond_4

    .line 826
    :cond_2
    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    goto :goto_0

    .line 816
    :cond_3
    add-int/lit8 v1, v0, 0x1

    goto :goto_2

    .line 823
    :cond_4
    const-string v3, "\n"

    invoke-virtual {v2, v3, v1}, Ljava/lang/StringBuilder;->indexOf(Ljava/lang/String;I)I

    move-result v0

    goto :goto_1
.end method

.method public static setContext(Landroid/content/Context;)V
    .locals 0
    .param p0, "pContext"    # Landroid/content/Context;

    .prologue
    .line 79
    sput-object p0, Lorg/cocos2dx/lib/Cocos2dxBitmap;->sContext:Landroid/content/Context;

    .line 80
    return-void
.end method

.method private static splitString(Ljava/lang/String;IILandroid/graphics/Paint;)[Ljava/lang/String;
    .locals 19
    .param p0, "pString"    # Ljava/lang/String;
    .param p1, "pMaxWidth"    # I
    .param p2, "pMaxHeight"    # I
    .param p3, "pPaint"    # Landroid/graphics/Paint;

    .prologue
    .line 684
    const-string v17, "\\n"

    move-object/from16 v0, p0

    move-object/from16 v1, v17

    invoke-virtual {v0, v1}, Ljava/lang/String;->split(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object v13

    .line 685
    .local v13, "lines":[Ljava/lang/String;
    const/4 v15, 0x0

    .line 686
    .local v15, "ret":[Ljava/lang/String;
    invoke-virtual/range {p3 .. p3}, Landroid/graphics/Paint;->getFontMetrics()Landroid/graphics/Paint$FontMetrics;

    move-result-object v6

    .line 687
    .local v6, "fm":Landroid/graphics/Paint$FontMetrics;
    iget v0, v6, Landroid/graphics/Paint$FontMetrics;->bottom:F

    move/from16 v17, v0

    iget v0, v6, Landroid/graphics/Paint$FontMetrics;->top:F

    move/from16 v18, v0

    sub-float v7, v17, v18

    .line 688
    .local v7, "heightPerLine":F
    move/from16 v0, p2

    int-to-float v0, v0

    move/from16 v17, v0

    div-float v17, v17, v7

    move/from16 v0, v17

    float-to-double v0, v0

    move-wide/from16 v17, v0

    invoke-static/range {v17 .. v18}, Ljava/lang/Math;->ceil(D)D

    move-result-wide v17

    move-wide/from16 v0, v17

    double-to-int v14, v0

    .line 690
    .local v14, "maxLines":I
    if-eqz p1, :cond_4

    .line 691
    new-instance v16, Ljava/util/LinkedList;

    invoke-direct/range {v16 .. v16}, Ljava/util/LinkedList;-><init>()V

    .line 692
    .local v16, "strList":Ljava/util/LinkedList;, "Ljava/util/LinkedList<Ljava/lang/String;>;"
    move-object v4, v13

    .local v4, "arr$":[Ljava/lang/String;
    array-length v10, v4

    .local v10, "len$":I
    const/4 v9, 0x0

    .local v9, "i$":I
    :goto_0
    if-ge v9, v10, :cond_0

    aget-object v11, v4, v9

    .line 697
    .local v11, "line":Ljava/lang/String;
    move-object/from16 v0, p3

    invoke-virtual {v0, v11}, Landroid/graphics/Paint;->measureText(Ljava/lang/String;)F

    move-result v17

    move/from16 v0, v17

    float-to-double v0, v0

    move-wide/from16 v17, v0

    invoke-static/range {v17 .. v18}, Ljava/lang/Math;->ceil(D)D

    move-result-wide v17

    move-wide/from16 v0, v17

    double-to-int v12, v0

    .line 699
    .local v12, "lineWidth":I
    move/from16 v0, p1

    if-le v12, v0, :cond_1

    .line 700
    invoke-static {v11}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->devideStringByLanguage(Ljava/lang/String;)Ljava/util/Vector;

    move-result-object v5

    .line 702
    .local v5, "divided":Ljava/util/Vector;, "Ljava/util/Vector<Ljava/lang/String;>;"
    const/16 v17, 0x0

    invoke-virtual {v5}, Ljava/util/Vector;->size()I

    move-result v18

    move/from16 v0, v17

    move/from16 v1, v18

    move/from16 v2, p1

    move-object/from16 v3, p3

    invoke-static {v5, v0, v1, v2, v3}, Lorg/cocos2dx/lib/Cocos2dxBitmap;->divideStringWithMaxWidth(Ljava/util/Vector;IIILandroid/graphics/Paint;)Ljava/util/LinkedList;

    move-result-object v17

    invoke-virtual/range {v16 .. v17}, Ljava/util/LinkedList;->addAll(Ljava/util/Collection;)Z

    .line 709
    .end local v5    # "divided":Ljava/util/Vector;, "Ljava/util/Vector<Ljava/lang/String;>;"
    :goto_1
    if-lez v14, :cond_2

    invoke-virtual/range {v16 .. v16}, Ljava/util/LinkedList;->size()I

    move-result v17

    move/from16 v0, v17

    if-lt v0, v14, :cond_2

    .line 715
    .end local v11    # "line":Ljava/lang/String;
    .end local v12    # "lineWidth":I
    :cond_0
    if-lez v14, :cond_3

    invoke-virtual/range {v16 .. v16}, Ljava/util/LinkedList;->size()I

    move-result v17

    move/from16 v0, v17

    if-le v0, v14, :cond_3

    .line 716
    :goto_2
    invoke-virtual/range {v16 .. v16}, Ljava/util/LinkedList;->size()I

    move-result v17

    move/from16 v0, v17

    if-le v0, v14, :cond_3

    .line 717
    invoke-virtual/range {v16 .. v16}, Ljava/util/LinkedList;->removeLast()Ljava/lang/Object;

    goto :goto_2

    .line 705
    .restart local v11    # "line":Ljava/lang/String;
    .restart local v12    # "lineWidth":I
    :cond_1
    move-object/from16 v0, v16

    invoke-virtual {v0, v11}, Ljava/util/LinkedList;->add(Ljava/lang/Object;)Z

    goto :goto_1

    .line 692
    :cond_2
    add-int/lit8 v9, v9, 0x1

    goto :goto_0

    .line 721
    .end local v11    # "line":Ljava/lang/String;
    .end local v12    # "lineWidth":I
    :cond_3
    invoke-virtual/range {v16 .. v16}, Ljava/util/LinkedList;->size()I

    move-result v17

    move/from16 v0, v17

    new-array v15, v0, [Ljava/lang/String;

    .line 722
    move-object/from16 v0, v16

    invoke-virtual {v0, v15}, Ljava/util/LinkedList;->toArray([Ljava/lang/Object;)[Ljava/lang/Object;

    .line 735
    .end local v4    # "arr$":[Ljava/lang/String;
    .end local v9    # "i$":I
    .end local v10    # "len$":I
    .end local v16    # "strList":Ljava/util/LinkedList;, "Ljava/util/LinkedList<Ljava/lang/String;>;"
    :goto_3
    return-object v15

    .line 723
    :cond_4
    if-eqz p2, :cond_6

    array-length v0, v13

    move/from16 v17, v0

    move/from16 v0, v17

    if-le v0, v14, :cond_6

    .line 725
    new-instance v16, Ljava/util/LinkedList;

    invoke-direct/range {v16 .. v16}, Ljava/util/LinkedList;-><init>()V

    .line 726
    .restart local v16    # "strList":Ljava/util/LinkedList;, "Ljava/util/LinkedList<Ljava/lang/String;>;"
    const/4 v8, 0x0

    .local v8, "i":I
    :goto_4
    if-ge v8, v14, :cond_5

    .line 727
    aget-object v17, v13, v8

    invoke-virtual/range {v16 .. v17}, Ljava/util/LinkedList;->add(Ljava/lang/Object;)Z

    .line 726
    add-int/lit8 v8, v8, 0x1

    goto :goto_4

    .line 729
    :cond_5
    invoke-virtual/range {v16 .. v16}, Ljava/util/LinkedList;->size()I

    move-result v17

    move/from16 v0, v17

    new-array v15, v0, [Ljava/lang/String;

    .line 730
    move-object/from16 v0, v16

    invoke-virtual {v0, v15}, Ljava/util/LinkedList;->toArray([Ljava/lang/Object;)[Ljava/lang/Object;

    goto :goto_3

    .line 732
    .end local v8    # "i":I
    .end local v16    # "strList":Ljava/util/LinkedList;, "Ljava/util/LinkedList<Ljava/lang/String;>;"
    :cond_6
    move-object v15, v13

    goto :goto_3
.end method
