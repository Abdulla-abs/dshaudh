.class public Lcom/netease/ntunisdk/base/ShareInfo;
.super Ljava/lang/Object;
.source "ShareInfo.java"


# static fields
.field public static final SCOPE_CIRCLE:Ljava/lang/String; = "SCOPE_CIRCLE"

.field public static final SCOPE_MULTIUSER:Ljava/lang/String; = "SCOPE_MULTIUSER"

.field public static final SCOPE_TOUSER:Ljava/lang/String; = "SCOPE_TOUSER"

.field private static final TAG:Ljava/lang/String; = "UniSDK ShareInfo"

.field public static final TYPE_IMAGE:Ljava/lang/String; = "TYPE_IMAGE"

.field public static final TYPE_IMAGE_ONLY:Ljava/lang/String; = "TYPE_IMAGE_ONLY"

.field public static final TYPE_INVITE:Ljava/lang/String; = "TYPE_INVITE"

.field public static final TYPE_LINK:Ljava/lang/String; = "TYPE_LINK"

.field public static final TYPE_TEXT_ONLY:Ljava/lang/String; = "TYPE_TEXT_ONLY"


# instance fields
.field private altTextMsg:Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Map",
            "<",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation
.end field

.field private desc:Ljava/lang/String;

.field private image:Ljava/lang/String;

.field private link:Ljava/lang/String;

.field private linkTextMsg:Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Map",
            "<",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation
.end field

.field private objectValue:Ljava/lang/String;

.field private scope:Ljava/lang/String;

.field private shareBitmap:Landroid/graphics/Bitmap;

.field private shareChannel:I

.field private showShareDialog:Z

.field private subTextMsg:Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Map",
            "<",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation
.end field

.field private templateId:Ljava/lang/String;

.field private text:Ljava/lang/String;

.field private textMsg:Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Map",
            "<",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation
.end field

.field private timelineType:Ljava/lang/String;

.field private title:Ljava/lang/String;

.field private toUser:Ljava/lang/String;

.field private toUserList:Ljava/util/List;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/List",
            "<",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation
.end field

.field private type:Ljava/lang/String;


# direct methods
.method public constructor <init>()V
    .locals 1

    .prologue
    .line 22
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 64
    new-instance v0, Ljava/util/HashMap;

    invoke-direct {v0}, Ljava/util/HashMap;-><init>()V

    iput-object v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->textMsg:Ljava/util/Map;

    .line 65
    new-instance v0, Ljava/util/HashMap;

    invoke-direct {v0}, Ljava/util/HashMap;-><init>()V

    iput-object v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->subTextMsg:Ljava/util/Map;

    .line 66
    new-instance v0, Ljava/util/HashMap;

    invoke-direct {v0}, Ljava/util/HashMap;-><init>()V

    iput-object v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->altTextMsg:Ljava/util/Map;

    .line 67
    new-instance v0, Ljava/util/HashMap;

    invoke-direct {v0}, Ljava/util/HashMap;-><init>()V

    iput-object v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->linkTextMsg:Ljava/util/Map;

    .line 69
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    iput-object v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->toUserList:Ljava/util/List;

    .line 70
    const/4 v0, 0x0

    iput-boolean v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->showShareDialog:Z

    return-void
.end method

.method public static jsonStr2Obj(Ljava/lang/String;)Lcom/netease/ntunisdk/base/ShareInfo;
    .locals 5
    .param p0, "jsonStr"    # Ljava/lang/String;

    .prologue
    .line 193
    new-instance v2, Lcom/netease/ntunisdk/base/ShareInfo;

    invoke-direct {v2}, Lcom/netease/ntunisdk/base/ShareInfo;-><init>()V

    .line 194
    .local v2, "shareInfo":Lcom/netease/ntunisdk/base/ShareInfo;
    invoke-static {p0}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v3

    if-eqz v3, :cond_0

    .line 212
    :goto_0
    return-object v2

    .line 199
    :cond_0
    :try_start_0
    new-instance v1, Lorg/json/JSONObject;

    invoke-direct {v1, p0}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    .line 200
    .local v1, "info":Lorg/json/JSONObject;
    const-string v3, "scope"

    invoke-virtual {v1, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Lcom/netease/ntunisdk/base/ShareInfo;->setToUser(Ljava/lang/String;)V

    .line 201
    const-string v3, "type"

    invoke-virtual {v1, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Lcom/netease/ntunisdk/base/ShareInfo;->setToUser(Ljava/lang/String;)V

    .line 202
    const-string v3, "toUser"

    invoke-virtual {v1, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Lcom/netease/ntunisdk/base/ShareInfo;->setToUser(Ljava/lang/String;)V

    .line 203
    const-string v3, "title"

    invoke-virtual {v1, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Lcom/netease/ntunisdk/base/ShareInfo;->setTitle(Ljava/lang/String;)V

    .line 204
    const-string v3, "desc"

    invoke-virtual {v1, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Lcom/netease/ntunisdk/base/ShareInfo;->setDesc(Ljava/lang/String;)V

    .line 205
    const-string v3, "image"

    invoke-virtual {v1, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Lcom/netease/ntunisdk/base/ShareInfo;->setImage(Ljava/lang/String;)V

    .line 206
    const-string v3, "text"

    invoke-virtual {v1, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Lcom/netease/ntunisdk/base/ShareInfo;->setText(Ljava/lang/String;)V

    .line 207
    const-string v3, "link"

    invoke-virtual {v1, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Lcom/netease/ntunisdk/base/ShareInfo;->setLink(Ljava/lang/String;)V
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    .line 208
    .end local v1    # "info":Lorg/json/JSONObject;
    :catch_0
    move-exception v0

    .line 209
    .local v0, "e":Lorg/json/JSONException;
    const-string v3, "UniSDK ShareInfo"

    const-string v4, "jsonStr2Obj error"

    invoke-static {v3, v4}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 210
    invoke-virtual {v0}, Lorg/json/JSONException;->printStackTrace()V

    goto :goto_0
.end method


# virtual methods
.method public getAltTextMsg()Ljava/util/Map;
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
    .line 234
    iget-object v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->altTextMsg:Ljava/util/Map;

    return-object v0
.end method

.method public getDesc()Ljava/lang/String;
    .locals 1

    .prologue
    .line 137
    iget-object v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->desc:Ljava/lang/String;

    return-object v0
.end method

.method public getImage()Ljava/lang/String;
    .locals 1

    .prologue
    .line 151
    iget-object v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->image:Ljava/lang/String;

    return-object v0
.end method

.method public getLink()Ljava/lang/String;
    .locals 1

    .prologue
    .line 179
    iget-object v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->link:Ljava/lang/String;

    return-object v0
.end method

.method public getLinkTextMsg()Ljava/util/Map;
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
    .line 240
    iget-object v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->linkTextMsg:Ljava/util/Map;

    return-object v0
.end method

.method public getObjectValue()Ljava/lang/String;
    .locals 1

    .prologue
    .line 246
    iget-object v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->objectValue:Ljava/lang/String;

    return-object v0
.end method

.method public getScope()Ljava/lang/String;
    .locals 1

    .prologue
    .line 81
    iget-object v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->scope:Ljava/lang/String;

    return-object v0
.end method

.method public getShareBitmap()Landroid/graphics/Bitmap;
    .locals 1

    .prologue
    .line 277
    iget-object v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->shareBitmap:Landroid/graphics/Bitmap;

    return-object v0
.end method

.method public getShareChannel()I
    .locals 1

    .prologue
    .line 285
    iget v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->shareChannel:I

    return v0
.end method

.method public getSubTextMsg()Ljava/util/Map;
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
    .line 228
    iget-object v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->subTextMsg:Ljava/util/Map;

    return-object v0
.end method

.method public getTemplateId()Ljava/lang/String;
    .locals 1

    .prologue
    .line 216
    iget-object v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->templateId:Ljava/lang/String;

    return-object v0
.end method

.method public getText()Ljava/lang/String;
    .locals 1

    .prologue
    .line 165
    iget-object v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->text:Ljava/lang/String;

    return-object v0
.end method

.method public getTextMsg()Ljava/util/Map;
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
    .line 222
    iget-object v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->textMsg:Ljava/util/Map;

    return-object v0
.end method

.method public getTimelineType()Ljava/lang/String;
    .locals 1

    .prologue
    .line 261
    iget-object v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->timelineType:Ljava/lang/String;

    return-object v0
.end method

.method public getTitle()Ljava/lang/String;
    .locals 1

    .prologue
    .line 123
    iget-object v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->title:Ljava/lang/String;

    return-object v0
.end method

.method public getToUser()Ljava/lang/String;
    .locals 1

    .prologue
    .line 109
    iget-object v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->toUser:Ljava/lang/String;

    return-object v0
.end method

.method public getToUserList()Ljava/util/List;
    .locals 1
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()",
            "Ljava/util/List",
            "<",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation

    .prologue
    .line 253
    iget-object v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->toUserList:Ljava/util/List;

    return-object v0
.end method

.method public getType()Ljava/lang/String;
    .locals 1

    .prologue
    .line 95
    iget-object v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->type:Ljava/lang/String;

    return-object v0
.end method

.method public isShowShareDialog()Z
    .locals 1

    .prologue
    .line 269
    iget-boolean v0, p0, Lcom/netease/ntunisdk/base/ShareInfo;->showShareDialog:Z

    return v0
.end method

.method public setAltTextMsg(Ljava/util/Map;)V
    .locals 0
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/Map",
            "<",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            ">;)V"
        }
    .end annotation

    .prologue
    .line 237
    .local p1, "altTextMsg":Ljava/util/Map;, "Ljava/util/Map<Ljava/lang/String;Ljava/lang/String;>;"
    iput-object p1, p0, Lcom/netease/ntunisdk/base/ShareInfo;->altTextMsg:Ljava/util/Map;

    .line 238
    return-void
.end method

.method public setDesc(Ljava/lang/String;)V
    .locals 0
    .param p1, "desc"    # Ljava/lang/String;

    .prologue
    .line 144
    iput-object p1, p0, Lcom/netease/ntunisdk/base/ShareInfo;->desc:Ljava/lang/String;

    .line 145
    return-void
.end method

.method public setImage(Ljava/lang/String;)V
    .locals 0
    .param p1, "image"    # Ljava/lang/String;

    .prologue
    .line 158
    iput-object p1, p0, Lcom/netease/ntunisdk/base/ShareInfo;->image:Ljava/lang/String;

    .line 159
    return-void
.end method

.method public setLink(Ljava/lang/String;)V
    .locals 0
    .param p1, "link"    # Ljava/lang/String;

    .prologue
    .line 186
    iput-object p1, p0, Lcom/netease/ntunisdk/base/ShareInfo;->link:Ljava/lang/String;

    .line 187
    return-void
.end method

.method public setLinkTextMsg(Ljava/util/Map;)V
    .locals 0
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/Map",
            "<",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            ">;)V"
        }
    .end annotation

    .prologue
    .line 243
    .local p1, "linkTextMsg":Ljava/util/Map;, "Ljava/util/Map<Ljava/lang/String;Ljava/lang/String;>;"
    iput-object p1, p0, Lcom/netease/ntunisdk/base/ShareInfo;->linkTextMsg:Ljava/util/Map;

    .line 244
    return-void
.end method

.method public setObjectValue(Ljava/lang/String;)V
    .locals 0
    .param p1, "objectValue"    # Ljava/lang/String;

    .prologue
    .line 249
    iput-object p1, p0, Lcom/netease/ntunisdk/base/ShareInfo;->objectValue:Ljava/lang/String;

    .line 250
    return-void
.end method

.method public setScope(Ljava/lang/String;)V
    .locals 0
    .param p1, "scope"    # Ljava/lang/String;

    .prologue
    .line 88
    iput-object p1, p0, Lcom/netease/ntunisdk/base/ShareInfo;->scope:Ljava/lang/String;

    .line 89
    return-void
.end method

.method public setShareBitmap(Landroid/graphics/Bitmap;)V
    .locals 0
    .param p1, "shareBitmap"    # Landroid/graphics/Bitmap;

    .prologue
    .line 281
    iput-object p1, p0, Lcom/netease/ntunisdk/base/ShareInfo;->shareBitmap:Landroid/graphics/Bitmap;

    .line 282
    return-void
.end method

.method public setShareChannel(I)V
    .locals 0
    .param p1, "shareChannel"    # I

    .prologue
    .line 289
    iput p1, p0, Lcom/netease/ntunisdk/base/ShareInfo;->shareChannel:I

    .line 290
    return-void
.end method

.method public setShowShareDialog(Z)V
    .locals 0
    .param p1, "showShareDialog"    # Z

    .prologue
    .line 273
    iput-boolean p1, p0, Lcom/netease/ntunisdk/base/ShareInfo;->showShareDialog:Z

    .line 274
    return-void
.end method

.method public setSubTextMsg(Ljava/util/Map;)V
    .locals 0
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/Map",
            "<",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            ">;)V"
        }
    .end annotation

    .prologue
    .line 231
    .local p1, "subTextMsg":Ljava/util/Map;, "Ljava/util/Map<Ljava/lang/String;Ljava/lang/String;>;"
    iput-object p1, p0, Lcom/netease/ntunisdk/base/ShareInfo;->subTextMsg:Ljava/util/Map;

    .line 232
    return-void
.end method

.method public setTemplateId(Ljava/lang/String;)V
    .locals 0
    .param p1, "templateId"    # Ljava/lang/String;

    .prologue
    .line 219
    iput-object p1, p0, Lcom/netease/ntunisdk/base/ShareInfo;->templateId:Ljava/lang/String;

    .line 220
    return-void
.end method

.method public setText(Ljava/lang/String;)V
    .locals 0
    .param p1, "text"    # Ljava/lang/String;

    .prologue
    .line 172
    iput-object p1, p0, Lcom/netease/ntunisdk/base/ShareInfo;->text:Ljava/lang/String;

    .line 173
    return-void
.end method

.method public setTextMsg(Ljava/util/Map;)V
    .locals 0
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/Map",
            "<",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            ">;)V"
        }
    .end annotation

    .prologue
    .line 225
    .local p1, "textMsg":Ljava/util/Map;, "Ljava/util/Map<Ljava/lang/String;Ljava/lang/String;>;"
    iput-object p1, p0, Lcom/netease/ntunisdk/base/ShareInfo;->textMsg:Ljava/util/Map;

    .line 226
    return-void
.end method

.method public setTimelineType(Ljava/lang/String;)V
    .locals 0
    .param p1, "timelineType"    # Ljava/lang/String;

    .prologue
    .line 265
    iput-object p1, p0, Lcom/netease/ntunisdk/base/ShareInfo;->timelineType:Ljava/lang/String;

    .line 266
    return-void
.end method

.method public setTitle(Ljava/lang/String;)V
    .locals 0
    .param p1, "title"    # Ljava/lang/String;

    .prologue
    .line 130
    iput-object p1, p0, Lcom/netease/ntunisdk/base/ShareInfo;->title:Ljava/lang/String;

    .line 131
    return-void
.end method

.method public setToUser(Ljava/lang/String;)V
    .locals 0
    .param p1, "toUser"    # Ljava/lang/String;

    .prologue
    .line 116
    iput-object p1, p0, Lcom/netease/ntunisdk/base/ShareInfo;->toUser:Ljava/lang/String;

    .line 117
    return-void
.end method

.method public setToUserList(Ljava/util/List;)V
    .locals 0
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/List",
            "<",
            "Ljava/lang/String;",
            ">;)V"
        }
    .end annotation

    .prologue
    .line 257
    .local p1, "toUserList":Ljava/util/List;, "Ljava/util/List<Ljava/lang/String;>;"
    iput-object p1, p0, Lcom/netease/ntunisdk/base/ShareInfo;->toUserList:Ljava/util/List;

    .line 258
    return-void
.end method

.method public setType(Ljava/lang/String;)V
    .locals 0
    .param p1, "type"    # Ljava/lang/String;

    .prologue
    .line 102
    iput-object p1, p0, Lcom/netease/ntunisdk/base/ShareInfo;->type:Ljava/lang/String;

    .line 103
    return-void
.end method
