.class public Lcom/netease/ntunisdk/base/OrderInfo;
.super Ljava/lang/Object;
.source "OrderInfo.java"


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;
    }
.end annotation


# static fields
.field public static final NT_OS_SDK_INVALID_CURRENCY:I = 0x9

.field public static final ORDERID_MAX_LEN:I = 0x40

.field public static final S_GS_CHECKING:I = 0x4

.field public static final S_GS_CHECK_ERR:I = 0x6

.field public static final S_GS_CHECK_OK:I = 0x5

.field public static final S_PREPARING:I = 0x0

.field public static final S_SDK_CHECKING:I = 0x1

.field public static final S_SDK_CHECK_ERR:I = 0x3

.field public static final S_SDK_CHECK_OK:I = 0x2

.field public static final S_WRONG_ORDER_ID:I = 0x8

.field public static final S_WRONG_PRODUCT_ID:I = 0x7

.field private static final TAG:Ljava/lang/String; = "UniSDK OrderInfo"

.field private static productList:Ljava/util/Hashtable;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Hashtable",
            "<",
            "Ljava/lang/String;",
            "Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;",
            ">;"
        }
    .end annotation
.end field


# instance fields
.field private externalChannelId:Ljava/lang/String;

.field private orderChannel:Ljava/lang/String;

.field private orderCurrency:Ljava/lang/String;

.field private orderDesc:Ljava/lang/String;

.field private orderErrReason:Ljava/lang/String;

.field private orderEtc:Ljava/lang/String;

.field private orderId:Ljava/lang/String;

.field private orderStatus:I

.field private productCount:I

.field private productCurrentPrice:F

.field private productId:Ljava/lang/String;

.field private sdkOrderId:Ljava/lang/String;

.field private signature:Ljava/lang/String;


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .prologue
    .line 86
    new-instance v0, Ljava/util/Hashtable;

    invoke-direct {v0}, Ljava/util/Hashtable;-><init>()V

    sput-object v0, Lcom/netease/ntunisdk/base/OrderInfo;->productList:Ljava/util/Hashtable;

    return-void
.end method

.method public constructor <init>(Lcom/netease/ntunisdk/base/OrderInfo;)V
    .locals 1
    .param p1, "info"    # Lcom/netease/ntunisdk/base/OrderInfo;

    .prologue
    .line 251
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 378
    const/high16 v0, -0x40800000    # -1.0f

    iput v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->productCurrentPrice:F

    .line 379
    const/4 v0, 0x1

    iput v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->productCount:I

    .line 380
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderDesc:Ljava/lang/String;

    .line 381
    const/4 v0, 0x0

    iput v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderStatus:I

    .line 382
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderErrReason:Ljava/lang/String;

    .line 383
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderEtc:Ljava/lang/String;

    .line 384
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->signature:Ljava/lang/String;

    .line 385
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderChannel:Ljava/lang/String;

    .line 386
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderCurrency:Ljava/lang/String;

    .line 387
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->externalChannelId:Ljava/lang/String;

    .line 252
    iget-object v0, p1, Lcom/netease/ntunisdk/base/OrderInfo;->orderId:Ljava/lang/String;

    iput-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderId:Ljava/lang/String;

    .line 253
    iget-object v0, p1, Lcom/netease/ntunisdk/base/OrderInfo;->sdkOrderId:Ljava/lang/String;

    iput-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->sdkOrderId:Ljava/lang/String;

    .line 254
    iget-object v0, p1, Lcom/netease/ntunisdk/base/OrderInfo;->productId:Ljava/lang/String;

    iput-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->productId:Ljava/lang/String;

    .line 255
    iget v0, p1, Lcom/netease/ntunisdk/base/OrderInfo;->productCurrentPrice:F

    iput v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->productCurrentPrice:F

    .line 256
    iget v0, p1, Lcom/netease/ntunisdk/base/OrderInfo;->productCount:I

    iput v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->productCount:I

    .line 257
    iget-object v0, p1, Lcom/netease/ntunisdk/base/OrderInfo;->orderDesc:Ljava/lang/String;

    iput-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderDesc:Ljava/lang/String;

    .line 258
    iget v0, p1, Lcom/netease/ntunisdk/base/OrderInfo;->orderStatus:I

    iput v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderStatus:I

    .line 259
    iget-object v0, p1, Lcom/netease/ntunisdk/base/OrderInfo;->orderErrReason:Ljava/lang/String;

    iput-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderErrReason:Ljava/lang/String;

    .line 260
    iget-object v0, p1, Lcom/netease/ntunisdk/base/OrderInfo;->orderEtc:Ljava/lang/String;

    iput-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderEtc:Ljava/lang/String;

    .line 261
    iget-object v0, p1, Lcom/netease/ntunisdk/base/OrderInfo;->signature:Ljava/lang/String;

    iput-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->signature:Ljava/lang/String;

    .line 262
    iget-object v0, p1, Lcom/netease/ntunisdk/base/OrderInfo;->orderChannel:Ljava/lang/String;

    iput-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderChannel:Ljava/lang/String;

    .line 263
    iget-object v0, p1, Lcom/netease/ntunisdk/base/OrderInfo;->orderCurrency:Ljava/lang/String;

    iput-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderCurrency:Ljava/lang/String;

    .line 264
    return-void
.end method

.method public constructor <init>(Ljava/lang/String;)V
    .locals 1
    .param p1, "pId"    # Ljava/lang/String;

    .prologue
    .line 241
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 378
    const/high16 v0, -0x40800000    # -1.0f

    iput v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->productCurrentPrice:F

    .line 379
    const/4 v0, 0x1

    iput v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->productCount:I

    .line 380
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderDesc:Ljava/lang/String;

    .line 381
    const/4 v0, 0x0

    iput v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderStatus:I

    .line 382
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderErrReason:Ljava/lang/String;

    .line 383
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderEtc:Ljava/lang/String;

    .line 384
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->signature:Ljava/lang/String;

    .line 385
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderChannel:Ljava/lang/String;

    .line 386
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderCurrency:Ljava/lang/String;

    .line 387
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->externalChannelId:Ljava/lang/String;

    .line 242
    invoke-virtual {p0, p1}, Lcom/netease/ntunisdk/base/OrderInfo;->setProductId(Ljava/lang/String;)V

    .line 243
    return-void
.end method

.method public static getProductList()Ljava/util/Hashtable;
    .locals 1
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()",
            "Ljava/util/Hashtable",
            "<",
            "Ljava/lang/String;",
            "Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;",
            ">;"
        }
    .end annotation

    .prologue
    .line 93
    sget-object v0, Lcom/netease/ntunisdk/base/OrderInfo;->productList:Ljava/util/Hashtable;

    return-object v0
.end method

.method public static hasProduct(Ljava/lang/String;)Z
    .locals 1
    .param p0, "pId"    # Ljava/lang/String;

    .prologue
    .line 232
    sget-object v0, Lcom/netease/ntunisdk/base/OrderInfo;->productList:Ljava/util/Hashtable;

    invoke-virtual {v0, p0}, Ljava/util/Hashtable;->containsKey(Ljava/lang/Object;)Z

    move-result v0

    return v0
.end method

.method public static jsonStr2Obj(Ljava/lang/String;)Lcom/netease/ntunisdk/base/OrderInfo;
    .locals 20
    .param p0, "jsonOrder"    # Ljava/lang/String;

    .prologue
    .line 547
    new-instance v3, Lcom/netease/ntunisdk/base/OrderInfo;

    const-string v18, ""

    move-object/from16 v0, v18

    invoke-direct {v3, v0}, Lcom/netease/ntunisdk/base/OrderInfo;-><init>(Ljava/lang/String;)V

    .line 548
    .local v3, "oi":Lcom/netease/ntunisdk/base/OrderInfo;
    invoke-static/range {p0 .. p0}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v18

    if-eqz v18, :cond_0

    move-object v4, v3

    .line 587
    .end local v3    # "oi":Lcom/netease/ntunisdk/base/OrderInfo;
    .local v4, "oi":Ljava/lang/Object;
    :goto_0
    return-object v4

    .line 553
    .end local v4    # "oi":Ljava/lang/Object;
    .restart local v3    # "oi":Lcom/netease/ntunisdk/base/OrderInfo;
    :cond_0
    :try_start_0
    new-instance v5, Lorg/json/JSONObject;

    move-object/from16 v0, p0

    invoke-direct {v5, v0}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    .line 554
    .local v5, "order":Lorg/json/JSONObject;
    const-string v18, "orderId"

    move-object/from16 v0, v18

    invoke-virtual {v5, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v11

    .line 555
    .local v11, "orderId":Ljava/lang/String;
    const-string v18, "sdkOrderId"

    move-object/from16 v0, v18

    invoke-virtual {v5, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v16

    .line 556
    .local v16, "sdkOrderId":Ljava/lang/String;
    const-string v18, "pid"

    move-object/from16 v0, v18

    invoke-virtual {v5, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v13

    .line 557
    .local v13, "pid":Ljava/lang/String;
    const-string v18, "productCurrentPrice"

    move-object/from16 v0, v18

    invoke-virtual {v5, v0}, Lorg/json/JSONObject;->optDouble(Ljava/lang/String;)D

    move-result-wide v14

    .line 558
    .local v14, "productCurrentPrice":D
    const-string v18, "productCount"

    move-object/from16 v0, v18

    invoke-virtual {v5, v0}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v1

    .line 559
    .local v1, "count":I
    const-string v18, "orderDesc"

    move-object/from16 v0, v18

    invoke-virtual {v5, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v8

    .line 560
    .local v8, "orderDesc":Ljava/lang/String;
    const-string v18, "orderStatus"

    move-object/from16 v0, v18

    invoke-virtual {v5, v0}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v12

    .line 561
    .local v12, "orderStatus":I
    const-string v18, "orderErrReason"

    move-object/from16 v0, v18

    invoke-virtual {v5, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v9

    .line 562
    .local v9, "orderErrReason":Ljava/lang/String;
    const-string v18, "orderEtc"

    move-object/from16 v0, v18

    invoke-virtual {v5, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v10

    .line 563
    .local v10, "orderEtc":Ljava/lang/String;
    const-string v18, "signature"

    move-object/from16 v0, v18

    invoke-virtual {v5, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v17

    .line 564
    .local v17, "signature":Ljava/lang/String;
    const-string v18, "orderChannel"

    move-object/from16 v0, v18

    invoke-virtual {v5, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6

    .line 565
    .local v6, "orderChannel":Ljava/lang/String;
    const-string v18, "orderCurrency"

    move-object/from16 v0, v18

    invoke-virtual {v5, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v7

    .line 567
    .local v7, "orderCurrency":Ljava/lang/String;
    new-instance v4, Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-direct {v4, v13}, Lcom/netease/ntunisdk/base/OrderInfo;-><init>(Ljava/lang/String;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 568
    .end local v3    # "oi":Lcom/netease/ntunisdk/base/OrderInfo;
    .local v4, "oi":Lcom/netease/ntunisdk/base/OrderInfo;
    :try_start_1
    invoke-virtual {v4, v11}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderId(Ljava/lang/String;)V

    .line 569
    move-object/from16 v0, v16

    invoke-virtual {v4, v0}, Lcom/netease/ntunisdk/base/OrderInfo;->setSdkOrderId(Ljava/lang/String;)V

    .line 570
    const-wide/16 v18, 0x0

    cmpl-double v18, v14, v18

    if-lez v18, :cond_1

    .line 571
    double-to-float v0, v14

    move/from16 v18, v0

    move/from16 v0, v18

    invoke-virtual {v4, v0}, Lcom/netease/ntunisdk/base/OrderInfo;->setProductCurrentPrice(F)V

    .line 573
    :cond_1
    if-lez v1, :cond_2

    .line 574
    invoke-virtual {v4, v1}, Lcom/netease/ntunisdk/base/OrderInfo;->setCount(I)V

    .line 576
    :cond_2
    invoke-virtual {v4, v8}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderDesc(Ljava/lang/String;)V

    .line 577
    invoke-virtual {v4, v12}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderStatus(I)V

    .line 578
    invoke-virtual {v4, v9}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderErrReason(Ljava/lang/String;)V

    .line 579
    invoke-virtual {v4, v10}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderEtc(Ljava/lang/String;)V

    .line 580
    move-object/from16 v0, v17

    invoke-virtual {v4, v0}, Lcom/netease/ntunisdk/base/OrderInfo;->setSignature(Ljava/lang/String;)V

    .line 581
    invoke-virtual {v4, v6}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderChannel(Ljava/lang/String;)V

    .line 582
    invoke-virtual {v4, v7}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderCurrency(Ljava/lang/String;)V
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_1

    move-object v3, v4

    .end local v1    # "count":I
    .end local v4    # "oi":Lcom/netease/ntunisdk/base/OrderInfo;
    .end local v5    # "order":Lorg/json/JSONObject;
    .end local v6    # "orderChannel":Ljava/lang/String;
    .end local v7    # "orderCurrency":Ljava/lang/String;
    .end local v8    # "orderDesc":Ljava/lang/String;
    .end local v9    # "orderErrReason":Ljava/lang/String;
    .end local v10    # "orderEtc":Ljava/lang/String;
    .end local v11    # "orderId":Ljava/lang/String;
    .end local v12    # "orderStatus":I
    .end local v13    # "pid":Ljava/lang/String;
    .end local v14    # "productCurrentPrice":D
    .end local v16    # "sdkOrderId":Ljava/lang/String;
    .end local v17    # "signature":Ljava/lang/String;
    .restart local v3    # "oi":Lcom/netease/ntunisdk/base/OrderInfo;
    :goto_1
    move-object v4, v3

    .line 587
    .local v4, "oi":Ljava/lang/Object;
    goto/16 :goto_0

    .line 583
    .end local v4    # "oi":Ljava/lang/Object;
    :catch_0
    move-exception v2

    .line 584
    .local v2, "e":Ljava/lang/Exception;
    :goto_2
    const-string v18, "UniSDK OrderInfo"

    const-string v19, "jsonStr2Obj error"

    invoke-static/range {v18 .. v19}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 585
    invoke-virtual {v2}, Ljava/lang/Exception;->printStackTrace()V

    goto :goto_1

    .line 583
    .end local v2    # "e":Ljava/lang/Exception;
    .end local v3    # "oi":Lcom/netease/ntunisdk/base/OrderInfo;
    .restart local v1    # "count":I
    .local v4, "oi":Lcom/netease/ntunisdk/base/OrderInfo;
    .restart local v5    # "order":Lorg/json/JSONObject;
    .restart local v6    # "orderChannel":Ljava/lang/String;
    .restart local v7    # "orderCurrency":Ljava/lang/String;
    .restart local v8    # "orderDesc":Ljava/lang/String;
    .restart local v9    # "orderErrReason":Ljava/lang/String;
    .restart local v10    # "orderEtc":Ljava/lang/String;
    .restart local v11    # "orderId":Ljava/lang/String;
    .restart local v12    # "orderStatus":I
    .restart local v13    # "pid":Ljava/lang/String;
    .restart local v14    # "productCurrentPrice":D
    .restart local v16    # "sdkOrderId":Ljava/lang/String;
    .restart local v17    # "signature":Ljava/lang/String;
    :catch_1
    move-exception v2

    move-object v3, v4

    .end local v4    # "oi":Lcom/netease/ntunisdk/base/OrderInfo;
    .restart local v3    # "oi":Lcom/netease/ntunisdk/base/OrderInfo;
    goto :goto_2
.end method

.method public static jsonToMap(Lorg/json/JSONObject;)Ljava/util/Map;
    .locals 2
    .param p0, "json"    # Lorg/json/JSONObject;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Lorg/json/JSONException;
        }
    .end annotation

    .prologue
    .line 149
    new-instance v0, Ljava/util/HashMap;

    invoke-direct {v0}, Ljava/util/HashMap;-><init>()V

    .line 151
    .local v0, "retMap":Ljava/util/Map;, "Ljava/util/Map<Ljava/lang/String;Ljava/lang/Object;>;"
    sget-object v1, Lorg/json/JSONObject;->NULL:Ljava/lang/Object;

    if-eq p0, v1, :cond_0

    .line 152
    invoke-static {p0}, Lcom/netease/ntunisdk/base/OrderInfo;->toMap(Lorg/json/JSONObject;)Ljava/util/Map;

    move-result-object v0

    .line 154
    :cond_0
    return-object v0
.end method

.method public static obj2Json(Lcom/netease/ntunisdk/base/OrderInfo;)Lorg/json/JSONObject;
    .locals 5
    .param p0, "oi"    # Lcom/netease/ntunisdk/base/OrderInfo;

    .prologue
    .line 594
    new-instance v1, Lorg/json/JSONObject;

    invoke-direct {v1}, Lorg/json/JSONObject;-><init>()V

    .line 595
    .local v1, "jdata":Lorg/json/JSONObject;
    if-nez p0, :cond_0

    .line 616
    :goto_0
    return-object v1

    .line 599
    :cond_0
    :try_start_0
    const-string v2, "orderId"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/OrderInfo;->getOrderId()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 600
    const-string v2, "sdkOrderId"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/OrderInfo;->getSdkOrderId()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 601
    const-string v2, "pid"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/OrderInfo;->getProductId()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 602
    const-string v2, "productCurrentPrice"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/OrderInfo;->getProductCurrentPrice()F

    move-result v3

    float-to-double v3, v3

    invoke-virtual {v1, v2, v3, v4}, Lorg/json/JSONObject;->put(Ljava/lang/String;D)Lorg/json/JSONObject;

    .line 603
    const-string v2, "productCount"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/OrderInfo;->getCount()I

    move-result v3

    invoke-virtual {v1, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;I)Lorg/json/JSONObject;

    .line 604
    const-string v2, "orderDesc"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/OrderInfo;->getOrderDesc()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 605
    const-string v2, "orderStatus"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/OrderInfo;->getOrderStatus()I

    move-result v3

    invoke-virtual {v1, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;I)Lorg/json/JSONObject;

    .line 606
    const-string v2, "orderErrReason"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/OrderInfo;->getOrderErrReason()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 607
    const-string v2, "orderEtc"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/OrderInfo;->getOrderEtc()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 608
    const-string v2, "signature"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/OrderInfo;->getSignature()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 609
    const-string v2, "orderChannel"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/OrderInfo;->getOrderChannel()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 610
    const-string v2, "orderCurrency"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/OrderInfo;->getOrderCurrency()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 611
    const-string v2, "productName"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/OrderInfo;->getProductName()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    .line 612
    :catch_0
    move-exception v0

    .line 613
    .local v0, "e":Lorg/json/JSONException;
    const-string v2, "UniSDK OrderInfo"

    const-string v3, "obj2Json error"

    invoke-static {v2, v3}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 614
    invoke-virtual {v0}, Lorg/json/JSONException;->printStackTrace()V

    goto/16 :goto_0
.end method

.method public static regProduct(Ljava/lang/String;)V
    .locals 10
    .param p0, "prodJson"    # Ljava/lang/String;

    .prologue
    .line 126
    invoke-static {p0}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v8

    if-eqz v8, :cond_0

    .line 127
    const-string v8, "UniSDK OrderInfo"

    const-string v9, "prodJson is null"

    invoke-static {v8, v9}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 146
    :goto_0
    return-void

    .line 131
    :cond_0
    :try_start_0
    new-instance v2, Lorg/json/JSONObject;

    invoke-direct {v2, p0}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    .line 132
    .local v2, "jdata":Lorg/json/JSONObject;
    const-string v8, "pid"

    invoke-virtual {v2, v8}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    .line 133
    .local v3, "pId":Ljava/lang/String;
    const-string v8, "productName"

    invoke-virtual {v2, v8}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    .line 134
    .local v4, "pName":Ljava/lang/String;
    const-string v8, "productPrice"

    invoke-virtual {v2, v8}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    .line 135
    .local v5, "productPrice":Ljava/lang/String;
    const-string v8, "eRatio"

    invoke-virtual {v2, v8}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v1

    .line 136
    .local v1, "eRatio":I
    new-instance v6, Ljava/util/HashMap;

    invoke-direct {v6}, Ljava/util/HashMap;-><init>()V

    .line 137
    .local v6, "sdkPids":Ljava/util/Map;, "Ljava/util/Map<Ljava/lang/String;Ljava/lang/String;>;"
    const-string v8, "sdkPids"

    invoke-virtual {v2, v8}, Lorg/json/JSONObject;->optJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v7

    .line 138
    .local v7, "sdkPidsJson":Lorg/json/JSONObject;
    if-eqz v7, :cond_1

    invoke-virtual {v7}, Lorg/json/JSONObject;->length()I

    move-result v8

    if-lez v8, :cond_1

    .line 139
    invoke-static {v7}, Lcom/netease/ntunisdk/base/OrderInfo;->jsonToMap(Lorg/json/JSONObject;)Ljava/util/Map;

    move-result-object v6

    .line 142
    :cond_1
    invoke-static {v5}, Ljava/lang/Float;->valueOf(Ljava/lang/String;)Ljava/lang/Float;

    move-result-object v8

    invoke-virtual {v8}, Ljava/lang/Float;->floatValue()F

    move-result v8

    invoke-static {v3, v4, v8, v1, v6}, Lcom/netease/ntunisdk/base/OrderInfo;->regProduct(Ljava/lang/String;Ljava/lang/String;FILjava/util/Map;)V
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    .line 143
    .end local v1    # "eRatio":I
    .end local v2    # "jdata":Lorg/json/JSONObject;
    .end local v3    # "pId":Ljava/lang/String;
    .end local v4    # "pName":Ljava/lang/String;
    .end local v5    # "productPrice":Ljava/lang/String;
    .end local v6    # "sdkPids":Ljava/util/Map;, "Ljava/util/Map<Ljava/lang/String;Ljava/lang/String;>;"
    .end local v7    # "sdkPidsJson":Lorg/json/JSONObject;
    :catch_0
    move-exception v0

    .line 144
    .local v0, "e":Lorg/json/JSONException;
    invoke-virtual {v0}, Lorg/json/JSONException;->printStackTrace()V

    goto :goto_0
.end method

.method public static regProduct(Ljava/lang/String;Ljava/lang/String;FI)V
    .locals 1
    .param p0, "pId"    # Ljava/lang/String;
    .param p1, "pName"    # Ljava/lang/String;
    .param p2, "pPrice"    # F
    .param p3, "eRatio"    # I

    .prologue
    .line 109
    const/4 v0, 0x0

    invoke-static {p0, p1, p2, p3, v0}, Lcom/netease/ntunisdk/base/OrderInfo;->regProduct(Ljava/lang/String;Ljava/lang/String;FILjava/util/Map;)V

    .line 110
    return-void
.end method

.method public static regProduct(Ljava/lang/String;Ljava/lang/String;FILjava/util/Map;)V
    .locals 4
    .param p0, "pId"    # Ljava/lang/String;
    .param p1, "pName"    # Ljava/lang/String;
    .param p2, "pPrice"    # F
    .param p3, "eRatio"    # I
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            "FI",
            "Ljava/util/Map",
            "<",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            ">;)V"
        }
    .end annotation

    .prologue
    .line 208
    .local p4, "sdkPids":Ljava/util/Map;, "Ljava/util/Map<Ljava/lang/String;Ljava/lang/String;>;"
    const-string v2, "UniSDK OrderInfo"

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "regProduct: "

    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v3, " "

    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v3, " "

    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, p2}, Ljava/lang/StringBuilder;->append(F)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v3, " "

    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, p3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v3, " "

    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    if-nez p4, :cond_1

    const-string v1, ""

    :goto_0
    invoke-virtual {v3, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v2, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 210
    const/4 v0, 0x0

    .line 211
    .local v0, "pi":Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;
    sget-object v1, Lcom/netease/ntunisdk/base/OrderInfo;->productList:Ljava/util/Hashtable;

    invoke-virtual {v1, p0}, Ljava/util/Hashtable;->containsKey(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_2

    .line 213
    sget-object v1, Lcom/netease/ntunisdk/base/OrderInfo;->productList:Ljava/util/Hashtable;

    invoke-virtual {v1, p0}, Ljava/util/Hashtable;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    .end local v0    # "pi":Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;
    check-cast v0, Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;

    .line 219
    .restart local v0    # "pi":Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;
    :goto_1
    iput-object p0, v0, Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;->productId:Ljava/lang/String;

    .line 220
    iput-object p1, v0, Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;->productName:Ljava/lang/String;

    .line 221
    iput p2, v0, Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;->productPrice:F

    .line 222
    iput p3, v0, Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;->exchangeRatio:I

    .line 223
    if-eqz p4, :cond_0

    .line 224
    iget-object v1, v0, Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;->sdkPids:Ljava/util/Map;

    invoke-interface {v1, p4}, Ljava/util/Map;->putAll(Ljava/util/Map;)V

    .line 226
    :cond_0
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v1

    check-cast v1, Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v1, p4}, Lcom/netease/ntunisdk/base/SdkBase;->choosePayChannel(Ljava/util/Map;)Ljava/lang/String;

    move-result-object v1

    iput-object v1, v0, Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;->payChannel:Ljava/lang/String;

    .line 227
    const-string v1, "UniSDK OrderInfo"

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "choose payChannel:"

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    iget-object v3, v0, Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;->payChannel:Ljava/lang/String;

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v3, " for pId:"

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    iget-object v3, v0, Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;->productId:Ljava/lang/String;

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 228
    sget-object v1, Lcom/netease/ntunisdk/base/OrderInfo;->productList:Ljava/util/Hashtable;

    invoke-virtual {v1, p0, v0}, Ljava/util/Hashtable;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 229
    return-void

    .line 208
    .end local v0    # "pi":Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;
    :cond_1
    invoke-virtual {p4}, Ljava/lang/Object;->toString()Ljava/lang/String;

    move-result-object v1

    goto :goto_0

    .line 217
    .restart local v0    # "pi":Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;
    :cond_2
    new-instance v0, Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;

    .end local v0    # "pi":Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;
    invoke-direct {v0}, Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;-><init>()V

    .restart local v0    # "pi":Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;
    goto :goto_1
.end method

.method public static toList(Lorg/json/JSONArray;)Ljava/util/List;
    .locals 4
    .param p0, "array"    # Lorg/json/JSONArray;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Lorg/json/JSONException;
        }
    .end annotation

    .prologue
    .line 178
    new-instance v1, Ljava/util/ArrayList;

    invoke-direct {v1}, Ljava/util/ArrayList;-><init>()V

    .line 179
    .local v1, "list":Ljava/util/List;, "Ljava/util/List<Ljava/lang/Object;>;"
    const/4 v0, 0x0

    .local v0, "i":I
    :goto_0
    invoke-virtual {p0}, Lorg/json/JSONArray;->length()I

    move-result v3

    if-ge v0, v3, :cond_2

    .line 180
    invoke-virtual {p0, v0}, Lorg/json/JSONArray;->get(I)Ljava/lang/Object;

    move-result-object v2

    .line 181
    .local v2, "value":Ljava/lang/Object;
    instance-of v3, v2, Lorg/json/JSONArray;

    if-eqz v3, :cond_1

    .line 182
    check-cast v2, Lorg/json/JSONArray;

    .end local v2    # "value":Ljava/lang/Object;
    invoke-static {v2}, Lcom/netease/ntunisdk/base/OrderInfo;->toList(Lorg/json/JSONArray;)Ljava/util/List;

    move-result-object v2

    .line 188
    :cond_0
    :goto_1
    invoke-interface {v1, v2}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 179
    add-int/lit8 v0, v0, 0x1

    goto :goto_0

    .line 185
    .restart local v2    # "value":Ljava/lang/Object;
    :cond_1
    instance-of v3, v2, Lorg/json/JSONObject;

    if-eqz v3, :cond_0

    .line 186
    check-cast v2, Lorg/json/JSONObject;

    .end local v2    # "value":Ljava/lang/Object;
    invoke-static {v2}, Lcom/netease/ntunisdk/base/OrderInfo;->toMap(Lorg/json/JSONObject;)Ljava/util/Map;

    move-result-object v2

    .local v2, "value":Ljava/util/Map;
    goto :goto_1

    .line 190
    .end local v2    # "value":Ljava/util/Map;
    :cond_2
    return-object v1
.end method

.method public static toMap(Lorg/json/JSONObject;)Ljava/util/Map;
    .locals 5
    .param p0, "object"    # Lorg/json/JSONObject;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Lorg/json/JSONException;
        }
    .end annotation

    .prologue
    .line 158
    new-instance v2, Ljava/util/HashMap;

    invoke-direct {v2}, Ljava/util/HashMap;-><init>()V

    .line 160
    .local v2, "map":Ljava/util/Map;, "Ljava/util/Map<Ljava/lang/String;Ljava/lang/Object;>;"
    invoke-virtual {p0}, Lorg/json/JSONObject;->keys()Ljava/util/Iterator;

    move-result-object v1

    .line 161
    .local v1, "keysItr":Ljava/util/Iterator;, "Ljava/util/Iterator<Ljava/lang/String;>;"
    :goto_0
    invoke-interface {v1}, Ljava/util/Iterator;->hasNext()Z

    move-result v4

    if-eqz v4, :cond_2

    .line 162
    invoke-interface {v1}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/lang/String;

    .line 163
    .local v0, "key":Ljava/lang/String;
    invoke-virtual {p0, v0}, Lorg/json/JSONObject;->get(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v3

    .line 165
    .local v3, "value":Ljava/lang/Object;
    instance-of v4, v3, Lorg/json/JSONArray;

    if-eqz v4, :cond_1

    .line 166
    check-cast v3, Lorg/json/JSONArray;

    .end local v3    # "value":Ljava/lang/Object;
    invoke-static {v3}, Lcom/netease/ntunisdk/base/OrderInfo;->toList(Lorg/json/JSONArray;)Ljava/util/List;

    move-result-object v3

    .line 172
    :cond_0
    :goto_1
    invoke-interface {v2, v0, v3}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    goto :goto_0

    .line 169
    .restart local v3    # "value":Ljava/lang/Object;
    :cond_1
    instance-of v4, v3, Lorg/json/JSONObject;

    if-eqz v4, :cond_0

    .line 170
    check-cast v3, Lorg/json/JSONObject;

    .end local v3    # "value":Ljava/lang/Object;
    invoke-static {v3}, Lcom/netease/ntunisdk/base/OrderInfo;->toMap(Lorg/json/JSONObject;)Ljava/util/Map;

    move-result-object v3

    .local v3, "value":Ljava/util/Map;
    goto :goto_1

    .line 174
    .end local v0    # "key":Ljava/lang/String;
    .end local v3    # "value":Ljava/util/Map;
    :cond_2
    return-object v2
.end method


# virtual methods
.method public getCount()I
    .locals 1

    .prologue
    .line 340
    iget v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->productCount:I

    if-gtz v0, :cond_0

    .line 341
    const/4 v0, 0x1

    iput v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->productCount:I

    .line 343
    :cond_0
    iget v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->productCount:I

    return v0
.end method

.method public getExternalChannelId()Ljava/lang/String;
    .locals 1

    .prologue
    .line 536
    iget-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->externalChannelId:Ljava/lang/String;

    return-object v0
.end method

.method public getOrderChannel()Ljava/lang/String;
    .locals 2

    .prologue
    .line 524
    const-string v0, "UniSDK OrderInfo"

    const-string v1, "getOrderChannel..."

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 525
    iget-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderChannel:Ljava/lang/String;

    invoke-static {v0}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :cond_0

    .line 526
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/OrderInfo;->getPayChannel()Ljava/lang/String;

    move-result-object v0

    .line 528
    :goto_0
    return-object v0

    :cond_0
    iget-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderChannel:Ljava/lang/String;

    goto :goto_0
.end method

.method public getOrderCurrency()Ljava/lang/String;
    .locals 1

    .prologue
    .line 516
    iget-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderCurrency:Ljava/lang/String;

    return-object v0
.end method

.method public getOrderDesc()Ljava/lang/String;
    .locals 1

    .prologue
    .line 362
    iget-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderDesc:Ljava/lang/String;

    return-object v0
.end method

.method public getOrderErrReason()Ljava/lang/String;
    .locals 1

    .prologue
    .line 483
    iget-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderErrReason:Ljava/lang/String;

    return-object v0
.end method

.method public getOrderEtc()Ljava/lang/String;
    .locals 1

    .prologue
    .line 497
    iget-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderEtc:Ljava/lang/String;

    return-object v0
.end method

.method public getOrderId()Ljava/lang/String;
    .locals 1

    .prologue
    .line 272
    iget-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderId:Ljava/lang/String;

    invoke-static {v0}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :cond_0

    .line 273
    const-string v0, ""

    .line 275
    :goto_0
    return-object v0

    :cond_0
    iget-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderId:Ljava/lang/String;

    goto :goto_0
.end method

.method public getOrderStatus()I
    .locals 1

    .prologue
    .line 469
    iget v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderStatus:I

    return v0
.end method

.method public getPayChannel()Ljava/lang/String;
    .locals 3

    .prologue
    .line 440
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/OrderInfo;->getProductInfo()Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;

    move-result-object v0

    .line 441
    .local v0, "pInfo":Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;
    if-eqz v0, :cond_0

    .line 442
    iget-object v1, v0, Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;->payChannel:Ljava/lang/String;

    .line 444
    :goto_0
    return-object v1

    :cond_0
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v1

    check-cast v1, Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/OrderInfo;->getSdkPids()Ljava/util/Map;

    move-result-object v2

    invoke-virtual {v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->choosePayChannel(Ljava/util/Map;)Ljava/lang/String;

    move-result-object v1

    goto :goto_0
.end method

.method public getProductCurrentPrice()F
    .locals 2

    .prologue
    .line 314
    iget v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->productCurrentPrice:F

    const/4 v1, 0x0

    cmpg-float v0, v0, v1

    if-gez v0, :cond_0

    .line 315
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/OrderInfo;->getProductInfo()Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;

    move-result-object v0

    iget v0, v0, Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;->productPrice:F

    .line 317
    :goto_0
    return v0

    :cond_0
    iget v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->productCurrentPrice:F

    goto :goto_0
.end method

.method public getProductExchangeRatio()I
    .locals 1

    .prologue
    .line 431
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/OrderInfo;->getProductInfo()Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;

    move-result-object v0

    iget v0, v0, Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;->exchangeRatio:I

    return v0
.end method

.method public getProductId()Ljava/lang/String;
    .locals 1

    .prologue
    .line 294
    iget-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->productId:Ljava/lang/String;

    return-object v0
.end method

.method getProductInfo()Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;
    .locals 2

    .prologue
    .line 395
    sget-object v0, Lcom/netease/ntunisdk/base/OrderInfo;->productList:Ljava/util/Hashtable;

    iget-object v1, p0, Lcom/netease/ntunisdk/base/OrderInfo;->productId:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/util/Hashtable;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;

    return-object v0
.end method

.method public getProductName()Ljava/lang/String;
    .locals 1

    .prologue
    .line 404
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/OrderInfo;->getProductInfo()Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;

    move-result-object v0

    iget-object v0, v0, Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;->productName:Ljava/lang/String;

    return-object v0
.end method

.method public getProductPrice()F
    .locals 1

    .prologue
    .line 413
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/OrderInfo;->getProductInfo()Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;

    move-result-object v0

    iget v0, v0, Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;->productPrice:F

    return v0
.end method

.method public getSdkOrderId()Ljava/lang/String;
    .locals 1

    .prologue
    .line 452
    iget-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->sdkOrderId:Ljava/lang/String;

    invoke-static {v0}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :cond_0

    .line 453
    iget-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderId:Ljava/lang/String;

    .line 455
    :goto_0
    return-object v0

    :cond_0
    iget-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->sdkOrderId:Ljava/lang/String;

    goto :goto_0
.end method

.method public getSdkPids()Ljava/util/Map;
    .locals 1
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()",
            "Ljava/util/Map",
            "<",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation

    .prologue
    .line 422
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/OrderInfo;->getProductInfo()Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;

    move-result-object v0

    iget-object v0, v0, Lcom/netease/ntunisdk/base/OrderInfo$ProductInfo;->sdkPids:Ljava/util/Map;

    return-object v0
.end method

.method public getSignature()Ljava/lang/String;
    .locals 1

    .prologue
    .line 508
    iget-object v0, p0, Lcom/netease/ntunisdk/base/OrderInfo;->signature:Ljava/lang/String;

    return-object v0
.end method

.method public setCount(I)V
    .locals 0
    .param p1, "productCount"    # I

    .prologue
    .line 353
    iput p1, p0, Lcom/netease/ntunisdk/base/OrderInfo;->productCount:I

    .line 354
    return-void
.end method

.method public setExternalChannelId(Ljava/lang/String;)V
    .locals 0
    .param p1, "externalChannelId"    # Ljava/lang/String;

    .prologue
    .line 540
    iput-object p1, p0, Lcom/netease/ntunisdk/base/OrderInfo;->externalChannelId:Ljava/lang/String;

    .line 541
    return-void
.end method

.method public setOrderChannel(Ljava/lang/String;)V
    .locals 0
    .param p1, "orderChannel"    # Ljava/lang/String;

    .prologue
    .line 532
    iput-object p1, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderChannel:Ljava/lang/String;

    .line 533
    return-void
.end method

.method public setOrderCurrency(Ljava/lang/String;)V
    .locals 0
    .param p1, "orderCurrency"    # Ljava/lang/String;

    .prologue
    .line 520
    iput-object p1, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderCurrency:Ljava/lang/String;

    .line 521
    return-void
.end method

.method public setOrderDesc(Ljava/lang/String;)V
    .locals 0
    .param p1, "orderDesc"    # Ljava/lang/String;

    .prologue
    .line 372
    iput-object p1, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderDesc:Ljava/lang/String;

    .line 373
    return-void
.end method

.method public setOrderErrReason(Ljava/lang/String;)V
    .locals 0
    .param p1, "orderErrReason"    # Ljava/lang/String;

    .prologue
    .line 490
    iput-object p1, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderErrReason:Ljava/lang/String;

    .line 491
    return-void
.end method

.method public setOrderEtc(Ljava/lang/String;)V
    .locals 0
    .param p1, "orderEtc"    # Ljava/lang/String;

    .prologue
    .line 504
    iput-object p1, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderEtc:Ljava/lang/String;

    .line 505
    return-void
.end method

.method public setOrderId(Ljava/lang/String;)V
    .locals 0
    .param p1, "orderId"    # Ljava/lang/String;

    .prologue
    .line 285
    iput-object p1, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderId:Ljava/lang/String;

    .line 286
    return-void
.end method

.method public setOrderStatus(I)V
    .locals 0
    .param p1, "orderStatus"    # I

    .prologue
    .line 476
    iput p1, p0, Lcom/netease/ntunisdk/base/OrderInfo;->orderStatus:I

    .line 477
    return-void
.end method

.method public setProductCurrentPrice(F)V
    .locals 3
    .param p1, "productCurrentPrice"    # F
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/Exception;
        }
    .end annotation

    .prologue
    .line 328
    const/4 v0, 0x0

    cmpg-float v0, p1, v0

    if-ltz v0, :cond_0

    const v0, 0x461c4000    # 10000.0f

    cmpl-float v0, p1, v0

    if-lez v0, :cond_1

    .line 329
    :cond_0
    new-instance v0, Ljava/lang/Exception;

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v2, "product price error:"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(F)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-direct {v0, v1}, Ljava/lang/Exception;-><init>(Ljava/lang/String;)V

    throw v0

    .line 331
    :cond_1
    iput p1, p0, Lcom/netease/ntunisdk/base/OrderInfo;->productCurrentPrice:F

    .line 332
    return-void
.end method

.method public setProductId(Ljava/lang/String;)V
    .locals 0
    .param p1, "productId"    # Ljava/lang/String;

    .prologue
    .line 305
    iput-object p1, p0, Lcom/netease/ntunisdk/base/OrderInfo;->productId:Ljava/lang/String;

    .line 306
    return-void
.end method

.method public setSdkOrderId(Ljava/lang/String;)V
    .locals 0
    .param p1, "sdkOrderId"    # Ljava/lang/String;

    .prologue
    .line 462
    iput-object p1, p0, Lcom/netease/ntunisdk/base/OrderInfo;->sdkOrderId:Ljava/lang/String;

    .line 463
    return-void
.end method

.method public setSignature(Ljava/lang/String;)V
    .locals 0
    .param p1, "signature"    # Ljava/lang/String;

    .prologue
    .line 512
    iput-object p1, p0, Lcom/netease/ntunisdk/base/OrderInfo;->signature:Ljava/lang/String;

    .line 513
    return-void
.end method
