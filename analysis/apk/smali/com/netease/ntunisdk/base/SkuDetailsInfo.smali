.class public Lcom/netease/ntunisdk/base/SkuDetailsInfo;
.super Ljava/lang/Object;
.source "SkuDetailsInfo.java"


# instance fields
.field description:Ljava/lang/String;

.field price:Ljava/lang/String;

.field priceAmountMicros:Ljava/lang/String;

.field priceCurrencyCode:Ljava/lang/String;

.field productId:Ljava/lang/String;

.field title:Ljava/lang/String;

.field type:Ljava/lang/String;


# direct methods
.method public constructor <init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 0
    .param p1, "productId"    # Ljava/lang/String;
    .param p2, "type"    # Ljava/lang/String;
    .param p3, "price"    # Ljava/lang/String;
    .param p4, "priceAmountMicros"    # Ljava/lang/String;
    .param p5, "priceCurrencyCode"    # Ljava/lang/String;
    .param p6, "title"    # Ljava/lang/String;
    .param p7, "description"    # Ljava/lang/String;

    .prologue
    .line 15
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 16
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->productId:Ljava/lang/String;

    .line 17
    iput-object p2, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->type:Ljava/lang/String;

    .line 18
    iput-object p3, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->price:Ljava/lang/String;

    .line 19
    iput-object p4, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->priceAmountMicros:Ljava/lang/String;

    .line 20
    iput-object p5, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->priceCurrencyCode:Ljava/lang/String;

    .line 21
    iput-object p6, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->title:Ljava/lang/String;

    .line 22
    iput-object p7, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->description:Ljava/lang/String;

    .line 23
    return-void
.end method


# virtual methods
.method public getDescription()Ljava/lang/String;
    .locals 1

    .prologue
    .line 74
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->description:Ljava/lang/String;

    return-object v0
.end method

.method public getPrice()Ljava/lang/String;
    .locals 1

    .prologue
    .line 42
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->price:Ljava/lang/String;

    return-object v0
.end method

.method public getPriceAmountMicros()Ljava/lang/String;
    .locals 1

    .prologue
    .line 50
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->priceAmountMicros:Ljava/lang/String;

    return-object v0
.end method

.method public getPriceCurrencyCode()Ljava/lang/String;
    .locals 1

    .prologue
    .line 58
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->priceCurrencyCode:Ljava/lang/String;

    return-object v0
.end method

.method public getProductId()Ljava/lang/String;
    .locals 1

    .prologue
    .line 26
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->productId:Ljava/lang/String;

    return-object v0
.end method

.method public getTitle()Ljava/lang/String;
    .locals 1

    .prologue
    .line 66
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->title:Ljava/lang/String;

    return-object v0
.end method

.method public getType()Ljava/lang/String;
    .locals 1

    .prologue
    .line 34
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->type:Ljava/lang/String;

    return-object v0
.end method

.method public setDescription(Ljava/lang/String;)V
    .locals 0
    .param p1, "description"    # Ljava/lang/String;

    .prologue
    .line 78
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->description:Ljava/lang/String;

    .line 79
    return-void
.end method

.method public setPrice(Ljava/lang/String;)V
    .locals 0
    .param p1, "price"    # Ljava/lang/String;

    .prologue
    .line 46
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->price:Ljava/lang/String;

    .line 47
    return-void
.end method

.method public setPriceAmountMicros(Ljava/lang/String;)V
    .locals 0
    .param p1, "priceAmountMicros"    # Ljava/lang/String;

    .prologue
    .line 54
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->priceAmountMicros:Ljava/lang/String;

    .line 55
    return-void
.end method

.method public setPriceCurrencyCode(Ljava/lang/String;)V
    .locals 0
    .param p1, "priceCurrencyCode"    # Ljava/lang/String;

    .prologue
    .line 62
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->priceCurrencyCode:Ljava/lang/String;

    .line 63
    return-void
.end method

.method public setSku(Ljava/lang/String;)V
    .locals 0
    .param p1, "productId"    # Ljava/lang/String;

    .prologue
    .line 30
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->productId:Ljava/lang/String;

    .line 31
    return-void
.end method

.method public setTitle(Ljava/lang/String;)V
    .locals 0
    .param p1, "title"    # Ljava/lang/String;

    .prologue
    .line 70
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->title:Ljava/lang/String;

    .line 71
    return-void
.end method

.method public setType(Ljava/lang/String;)V
    .locals 0
    .param p1, "type"    # Ljava/lang/String;

    .prologue
    .line 38
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->type:Ljava/lang/String;

    .line 39
    return-void
.end method

.method public toString()Ljava/lang/String;
    .locals 4

    .prologue
    .line 83
    const-string v0, "Skudetails: productId:%s, price:%s, priceAmountMicros:%s, priceCurrencyCode:%s, title:%s, description:%s"

    const/4 v1, 0x6

    new-array v1, v1, [Ljava/lang/Object;

    const/4 v2, 0x0

    iget-object v3, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->productId:Ljava/lang/String;

    aput-object v3, v1, v2

    const/4 v2, 0x1

    iget-object v3, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->price:Ljava/lang/String;

    aput-object v3, v1, v2

    const/4 v2, 0x2

    iget-object v3, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->priceAmountMicros:Ljava/lang/String;

    aput-object v3, v1, v2

    const/4 v2, 0x3

    iget-object v3, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->priceCurrencyCode:Ljava/lang/String;

    aput-object v3, v1, v2

    const/4 v2, 0x4

    iget-object v3, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->title:Ljava/lang/String;

    aput-object v3, v1, v2

    const/4 v2, 0x5

    iget-object v3, p0, Lcom/netease/ntunisdk/base/SkuDetailsInfo;->description:Ljava/lang/String;

    aput-object v3, v1, v2

    invoke-static {v0, v1}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method
