.class public Lorg/cocos2dx/lib/Cocos2dxLocalization;
.super Ljava/lang/Object;
.source "Cocos2dxLocalization.java"


# direct methods
.method public constructor <init>()V
    .locals 0

    .prologue
    .line 7
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public static breakWordsCommon(Ljava/lang/String;Ljava/util/Locale;)[Ljava/lang/String;
    .locals 5
    .param p0, "s"    # Ljava/lang/String;
    .param p1, "locale"    # Ljava/util/Locale;

    .prologue
    .line 10
    invoke-static {p1}, Ljava/text/BreakIterator;->getWordInstance(Ljava/util/Locale;)Ljava/text/BreakIterator;

    move-result-object v0

    .line 11
    .local v0, "boundary":Ljava/text/BreakIterator;
    invoke-virtual {v0, p0}, Ljava/text/BreakIterator;->setText(Ljava/lang/String;)V

    .line 13
    new-instance v2, Ljava/util/ArrayList;

    invoke-direct {v2}, Ljava/util/ArrayList;-><init>()V

    .line 15
    .local v2, "ret":Ljava/util/ArrayList;, "Ljava/util/ArrayList<Ljava/lang/String;>;"
    invoke-virtual {v0}, Ljava/text/BreakIterator;->first()I

    move-result v3

    .line 16
    .local v3, "start":I
    invoke-virtual {v0}, Ljava/text/BreakIterator;->next()I

    move-result v1

    .local v1, "end":I
    :goto_0
    const/4 v4, -0x1

    if-eq v1, v4, :cond_0

    .line 17
    invoke-virtual {p0, v3, v1}, Ljava/lang/String;->substring(II)Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v2, v4}, Ljava/util/ArrayList;->add(Ljava/lang/Object;)Z

    .line 16
    move v3, v1

    invoke-virtual {v0}, Ljava/text/BreakIterator;->next()I

    move-result v1

    goto :goto_0

    .line 20
    :cond_0
    invoke-virtual {v2}, Ljava/util/ArrayList;->size()I

    move-result v4

    new-array v4, v4, [Ljava/lang/String;

    invoke-virtual {v2, v4}, Ljava/util/ArrayList;->toArray([Ljava/lang/Object;)[Ljava/lang/Object;

    move-result-object v4

    check-cast v4, [Ljava/lang/String;

    return-object v4
.end method

.method public static breakWordsThai(Ljava/lang/String;)[Ljava/lang/String;
    .locals 4
    .param p0, "s"    # Ljava/lang/String;

    .prologue
    .line 24
    new-instance v0, Ljava/util/Locale;

    const-string v1, "th"

    const-string v2, "TH"

    const-string v3, "TH"

    invoke-direct {v0, v1, v2, v3}, Ljava/util/Locale;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {p0, v0}, Lorg/cocos2dx/lib/Cocos2dxLocalization;->breakWordsCommon(Ljava/lang/String;Ljava/util/Locale;)[Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method
