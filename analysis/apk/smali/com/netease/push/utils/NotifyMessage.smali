.class public Lcom/netease/push/utils/NotifyMessage;
.super Ljava/lang/Object;
.source "NotifyMessage.java"

# interfaces
.implements Landroid/os/Parcelable;


# static fields
.field public static final CREATOR:Landroid/os/Parcelable$Creator;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Landroid/os/Parcelable$Creator",
            "<",
            "Lcom/netease/push/utils/NotifyMessage;",
            ">;"
        }
    .end annotation
.end field

.field private static final TAG:Ljava/lang/String;


# instance fields
.field public mExt:Ljava/lang/String;

.field public mMsg:Ljava/lang/String;

.field public mTitle:Ljava/lang/String;


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .prologue
    .line 32
    const-class v0, Lcom/netease/push/utils/NotifyMessage;

    invoke-virtual {v0}, Ljava/lang/Class;->getSimpleName()Ljava/lang/String;

    move-result-object v0

    sput-object v0, Lcom/netease/push/utils/NotifyMessage;->TAG:Ljava/lang/String;

    .line 114
    new-instance v0, Lcom/netease/push/utils/NotifyMessage$1;

    invoke-direct {v0}, Lcom/netease/push/utils/NotifyMessage$1;-><init>()V

    sput-object v0, Lcom/netease/push/utils/NotifyMessage;->CREATOR:Landroid/os/Parcelable$Creator;

    .line 126
    return-void
.end method

.method public constructor <init>()V
    .locals 1

    .prologue
    .line 53
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 34
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/utils/NotifyMessage;->mMsg:Ljava/lang/String;

    .line 35
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/utils/NotifyMessage;->mTitle:Ljava/lang/String;

    .line 36
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/utils/NotifyMessage;->mExt:Ljava/lang/String;

    .line 54
    invoke-virtual {p0}, Lcom/netease/push/utils/NotifyMessage;->clear()V

    .line 55
    return-void
.end method

.method public constructor <init>(Landroid/os/Parcel;)V
    .locals 1
    .param p1, "parcel"    # Landroid/os/Parcel;

    .prologue
    .line 49
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 34
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/utils/NotifyMessage;->mMsg:Ljava/lang/String;

    .line 35
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/utils/NotifyMessage;->mTitle:Ljava/lang/String;

    .line 36
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/utils/NotifyMessage;->mExt:Ljava/lang/String;

    .line 50
    invoke-virtual {p0, p1}, Lcom/netease/push/utils/NotifyMessage;->readFromParcel(Landroid/os/Parcel;)V

    .line 51
    return-void
.end method

.method public constructor <init>(Ljava/lang/String;Ljava/lang/String;)V
    .locals 1
    .param p1, "message"    # Ljava/lang/String;
    .param p2, "title"    # Ljava/lang/String;

    .prologue
    .line 38
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 34
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/utils/NotifyMessage;->mMsg:Ljava/lang/String;

    .line 35
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/utils/NotifyMessage;->mTitle:Ljava/lang/String;

    .line 36
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/utils/NotifyMessage;->mExt:Ljava/lang/String;

    .line 39
    iput-object p1, p0, Lcom/netease/push/utils/NotifyMessage;->mMsg:Ljava/lang/String;

    .line 40
    iput-object p2, p0, Lcom/netease/push/utils/NotifyMessage;->mTitle:Ljava/lang/String;

    .line 41
    return-void
.end method

.method public constructor <init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 1
    .param p1, "message"    # Ljava/lang/String;
    .param p2, "title"    # Ljava/lang/String;
    .param p3, "ext"    # Ljava/lang/String;

    .prologue
    .line 43
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 34
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/utils/NotifyMessage;->mMsg:Ljava/lang/String;

    .line 35
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/utils/NotifyMessage;->mTitle:Ljava/lang/String;

    .line 36
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/utils/NotifyMessage;->mExt:Ljava/lang/String;

    .line 44
    iput-object p1, p0, Lcom/netease/push/utils/NotifyMessage;->mMsg:Ljava/lang/String;

    .line 45
    iput-object p2, p0, Lcom/netease/push/utils/NotifyMessage;->mTitle:Ljava/lang/String;

    .line 46
    iput-object p3, p0, Lcom/netease/push/utils/NotifyMessage;->mExt:Ljava/lang/String;

    .line 47
    return-void
.end method

.method public static getFrom(Landroid/app/Activity;)Lcom/netease/push/utils/NotifyMessage;
    .locals 1
    .param p0, "activity"    # Landroid/app/Activity;

    .prologue
    .line 139
    invoke-virtual {p0}, Landroid/app/Activity;->getIntent()Landroid/content/Intent;

    move-result-object v0

    invoke-static {v0}, Lcom/netease/push/utils/NotifyMessage;->getFrom(Landroid/content/Intent;)Lcom/netease/push/utils/NotifyMessage;

    move-result-object v0

    return-object v0
.end method

.method public static getFrom(Landroid/content/Intent;)Lcom/netease/push/utils/NotifyMessage;
    .locals 4
    .param p0, "intent"    # Landroid/content/Intent;

    .prologue
    .line 129
    const-string v3, "NOTIFICATION_TITLE"

    invoke-virtual {p0, v3}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    .line 130
    .local v2, "title":Ljava/lang/String;
    const-string v3, "NOTIFICATION_MESSAGE"

    invoke-virtual {p0, v3}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    .line 131
    .local v1, "msg":Ljava/lang/String;
    const-string v3, "NOTIFICATION_EXT"

    invoke-virtual {p0, v3}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 132
    .local v0, "ext":Ljava/lang/String;
    if-eqz v2, :cond_0

    if-nez v1, :cond_1

    .line 133
    :cond_0
    const/4 v3, 0x0

    .line 135
    :goto_0
    return-object v3

    :cond_1
    new-instance v3, Lcom/netease/push/utils/NotifyMessage;

    invoke-direct {v3, v1, v2, v0}, Lcom/netease/push/utils/NotifyMessage;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    goto :goto_0
.end method

.method public static readFromJsonString(Ljava/lang/String;)Lcom/netease/push/utils/NotifyMessage;
    .locals 5
    .param p0, "data"    # Ljava/lang/String;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Lorg/json/JSONException;
        }
    .end annotation

    .prologue
    .line 78
    new-instance v2, Lorg/json/JSONObject;

    invoke-direct {v2, p0}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    .line 79
    .local v2, "jsonObject":Lorg/json/JSONObject;
    const-string v4, "title"

    invoke-virtual {v2, v4}, Lorg/json/JSONObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    .line 80
    .local v3, "title":Ljava/lang/String;
    const-string v4, "content"

    invoke-virtual {v2, v4}, Lorg/json/JSONObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 81
    .local v0, "content":Ljava/lang/String;
    const-string v4, "ext"

    invoke-virtual {v2, v4}, Lorg/json/JSONObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    .line 82
    .local v1, "ext":Ljava/lang/String;
    new-instance v4, Lcom/netease/push/utils/NotifyMessage;

    invoke-direct {v4, v0, v3, v1}, Lcom/netease/push/utils/NotifyMessage;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    return-object v4
.end method


# virtual methods
.method public clear()V
    .locals 1

    .prologue
    .line 58
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/utils/NotifyMessage;->mMsg:Ljava/lang/String;

    .line 59
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/utils/NotifyMessage;->mTitle:Ljava/lang/String;

    .line 60
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/utils/NotifyMessage;->mExt:Ljava/lang/String;

    .line 61
    return-void
.end method

.method public describeContents()I
    .locals 1

    .prologue
    .line 92
    const/4 v0, 0x0

    return v0
.end method

.method public readFromParcel(Landroid/os/Parcel;)V
    .locals 1
    .param p1, "src"    # Landroid/os/Parcel;

    .prologue
    .line 108
    invoke-virtual {p1}, Landroid/os/Parcel;->readString()Ljava/lang/String;

    move-result-object v0

    iput-object v0, p0, Lcom/netease/push/utils/NotifyMessage;->mTitle:Ljava/lang/String;

    .line 109
    invoke-virtual {p1}, Landroid/os/Parcel;->readString()Ljava/lang/String;

    move-result-object v0

    iput-object v0, p0, Lcom/netease/push/utils/NotifyMessage;->mMsg:Ljava/lang/String;

    .line 110
    invoke-virtual {p1}, Landroid/os/Parcel;->readString()Ljava/lang/String;

    move-result-object v0

    iput-object v0, p0, Lcom/netease/push/utils/NotifyMessage;->mExt:Ljava/lang/String;

    .line 111
    return-void
.end method

.method public toString()Ljava/lang/String;
    .locals 2

    .prologue
    .line 64
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "content:"

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v1, p0, Lcom/netease/push/utils/NotifyMessage;->mMsg:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ",title:"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    iget-object v1, p0, Lcom/netease/push/utils/NotifyMessage;->mTitle:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ",ext:"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    iget-object v1, p0, Lcom/netease/push/utils/NotifyMessage;->mExt:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public writeToJsonString()Ljava/lang/String;
    .locals 3
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Lorg/json/JSONException;
        }
    .end annotation

    .prologue
    .line 69
    new-instance v0, Lorg/json/JSONObject;

    invoke-direct {v0}, Lorg/json/JSONObject;-><init>()V

    .line 70
    .local v0, "jsonObject":Lorg/json/JSONObject;
    const-string v1, "title"

    iget-object v2, p0, Lcom/netease/push/utils/NotifyMessage;->mTitle:Ljava/lang/String;

    invoke-virtual {v0, v1, v2}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 71
    const-string v1, "content"

    iget-object v2, p0, Lcom/netease/push/utils/NotifyMessage;->mMsg:Ljava/lang/String;

    invoke-virtual {v0, v1, v2}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 72
    const-string v1, "ext"

    iget-object v2, p0, Lcom/netease/push/utils/NotifyMessage;->mExt:Ljava/lang/String;

    invoke-virtual {v0, v1, v2}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 73
    invoke-virtual {v0}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object v1

    return-object v1
.end method

.method public writeToParcel(Landroid/os/Parcel;I)V
    .locals 1
    .param p1, "dest"    # Landroid/os/Parcel;
    .param p2, "flags"    # I

    .prologue
    .line 102
    iget-object v0, p0, Lcom/netease/push/utils/NotifyMessage;->mTitle:Ljava/lang/String;

    invoke-virtual {p1, v0}, Landroid/os/Parcel;->writeString(Ljava/lang/String;)V

    .line 103
    iget-object v0, p0, Lcom/netease/push/utils/NotifyMessage;->mMsg:Ljava/lang/String;

    invoke-virtual {p1, v0}, Landroid/os/Parcel;->writeString(Ljava/lang/String;)V

    .line 104
    iget-object v0, p0, Lcom/netease/push/utils/NotifyMessage;->mExt:Ljava/lang/String;

    invoke-virtual {p1, v0}, Landroid/os/Parcel;->writeString(Ljava/lang/String;)V

    .line 105
    return-void
.end method
