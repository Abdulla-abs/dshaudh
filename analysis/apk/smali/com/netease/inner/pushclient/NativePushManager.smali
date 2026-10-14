.class public Lcom/netease/inner/pushclient/NativePushManager;
.super Ljava/lang/Object;
.source "NativePushManager.java"


# static fields
.field private static final TAG:Ljava/lang/String;

.field private static nativePushManager:Lcom/netease/inner/pushclient/NativePushManager;


# instance fields
.field public final PUSH_NAME_PREFIX:Ljava/lang/String;

.field private mContext:Landroid/content/Context;

.field private mNativePushHashMap:Ljava/util/HashMap;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/HashMap",
            "<",
            "Ljava/lang/String;",
            "Lcom/netease/inner/pushclient/NativePushData;",
            ">;"
        }
    .end annotation
.end field

.field private mNativePushNameSet:Ljava/util/Set;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Set",
            "<",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation
.end field


# direct methods
.method static constructor <clinit>()V
    .locals 2

    .prologue
    .line 38
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "NGPush_"

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-class v1, Lcom/netease/inner/pushclient/NativePushManager;

    invoke-virtual {v1}, Ljava/lang/Class;->getSimpleName()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    sput-object v0, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    .line 40
    new-instance v0, Lcom/netease/inner/pushclient/NativePushManager;

    invoke-direct {v0}, Lcom/netease/inner/pushclient/NativePushManager;-><init>()V

    sput-object v0, Lcom/netease/inner/pushclient/NativePushManager;->nativePushManager:Lcom/netease/inner/pushclient/NativePushManager;

    return-void
.end method

.method private constructor <init>()V
    .locals 2

    .prologue
    const/4 v1, 0x0

    .line 46
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 39
    iput-object v1, p0, Lcom/netease/inner/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    .line 41
    new-instance v0, Ljava/util/HashMap;

    invoke-direct {v0}, Ljava/util/HashMap;-><init>()V

    iput-object v0, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    .line 42
    iput-object v1, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushNameSet:Ljava/util/Set;

    .line 44
    const-string v0, "nn_"

    iput-object v0, p0, Lcom/netease/inner/pushclient/NativePushManager;->PUSH_NAME_PREFIX:Ljava/lang/String;

    .line 47
    return-void
.end method

.method public static getInstance()Lcom/netease/inner/pushclient/NativePushManager;
    .locals 1

    .prologue
    .line 50
    sget-object v0, Lcom/netease/inner/pushclient/NativePushManager;->nativePushManager:Lcom/netease/inner/pushclient/NativePushManager;

    return-object v0
.end method

.method private stopPushWithPushName(Ljava/lang/String;)Z
    .locals 4
    .param p1, "pushName"    # Ljava/lang/String;

    .prologue
    .line 383
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    const-string v2, "stopPushWithPushName"

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 384
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "pushName:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 385
    iget-object v1, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v1, p1}, Ljava/util/HashMap;->containsKey(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_0

    .line 386
    const/4 v1, 0x0

    .line 390
    :goto_0
    return v1

    .line 388
    :cond_0
    iget-object v1, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v1, p1}, Ljava/util/HashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Lcom/netease/inner/pushclient/NativePushData;

    .line 389
    .local v0, "nativePushData":Lcom/netease/inner/pushclient/NativePushData;
    iget-object v1, p0, Lcom/netease/inner/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    invoke-virtual {v0, v1}, Lcom/netease/inner/pushclient/NativePushData;->stopAlarm(Landroid/content/Context;)V

    .line 390
    const/4 v1, 0x1

    goto :goto_0
.end method


# virtual methods
.method public init(Landroid/content/Context;)V
    .locals 3
    .param p1, "context"    # Landroid/content/Context;

    .prologue
    .line 54
    sget-object v0, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    const-string v1, "init"

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 55
    iput-object p1, p0, Lcom/netease/inner/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    .line 57
    invoke-static {p1}, Lcom/netease/push/utils/PushSetting;->getNativePushNames(Landroid/content/Context;)Ljava/util/Set;

    move-result-object v0

    iput-object v0, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushNameSet:Ljava/util/Set;

    .line 58
    sget-object v0, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "this:"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 59
    sget-object v0, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "mNativePushNameSet:"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v2, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushNameSet:Ljava/util/Set;

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 60
    return-void
.end method

.method public newAlarm(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Z
    .locals 5
    .param p1, "alarmID"    # Ljava/lang/String;
    .param p2, "title"    # Ljava/lang/String;
    .param p3, "msg"    # Ljava/lang/String;
    .param p4, "ext"    # Ljava/lang/String;

    .prologue
    .line 76
    sget-object v2, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    const-string v3, "newAlarm"

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 77
    sget-object v2, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "alarmID:"

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 78
    sget-object v2, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "title:"

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 79
    sget-object v2, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "msg:"

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, p3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 80
    sget-object v2, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "ext:"

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, p4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 81
    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "nn_"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    .line 82
    .local v1, "pushName":Ljava/lang/String;
    sget-object v2, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "pushName:"

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 83
    iget-object v2, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushNameSet:Ljava/util/Set;

    invoke-interface {v2, v1}, Ljava/util/Set;->contains(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_0

    .line 85
    iget-object v2, p0, Lcom/netease/inner/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    invoke-static {v2, v1}, Lcom/netease/push/utils/PushSetting;->getNativeNotification(Landroid/content/Context;Ljava/lang/String;)Lcom/netease/inner/pushclient/NativePushData;

    move-result-object v0

    .line 86
    .local v0, "nativePushData":Lcom/netease/inner/pushclient/NativePushData;
    if-eqz v0, :cond_1

    .line 87
    iget-object v2, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v2, v1, v0}, Ljava/util/HashMap;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 94
    .end local v0    # "nativePushData":Lcom/netease/inner/pushclient/NativePushData;
    :cond_0
    :goto_0
    iget-object v2, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v2, v1}, Ljava/util/HashMap;->containsKey(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_2

    .line 95
    iget-object v2, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v2, v1}, Ljava/util/HashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/inner/pushclient/NativePushData;

    invoke-virtual {v2, p2, p3, p4}, Lcom/netease/inner/pushclient/NativePushData;->setMessage(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 105
    :goto_1
    const/4 v2, 0x1

    :goto_2
    return v2

    .line 89
    .restart local v0    # "nativePushData":Lcom/netease/inner/pushclient/NativePushData;
    :cond_1
    iget-object v2, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushNameSet:Ljava/util/Set;

    invoke-interface {v2, v1}, Ljava/util/Set;->remove(Ljava/lang/Object;)Z

    .line 90
    iget-object v2, p0, Lcom/netease/inner/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    invoke-static {v2, v1}, Lcom/netease/push/utils/PushSetting;->rmNativePushNames(Landroid/content/Context;Ljava/lang/String;)V

    goto :goto_0

    .line 97
    .end local v0    # "nativePushData":Lcom/netease/inner/pushclient/NativePushData;
    :cond_2
    iget-object v2, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v2}, Ljava/util/HashMap;->size()I

    move-result v2

    const/16 v3, 0x32

    if-lt v2, v3, :cond_3

    .line 98
    const-string v2, "NgPush"

    const-string v3, "max alarms exist!"

    invoke-static {v2, v3}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 99
    const/4 v2, 0x0

    goto :goto_2

    .line 101
    :cond_3
    new-instance v0, Lcom/netease/inner/pushclient/NativePushData;

    invoke-direct {v0, v1}, Lcom/netease/inner/pushclient/NativePushData;-><init>(Ljava/lang/String;)V

    .line 102
    .restart local v0    # "nativePushData":Lcom/netease/inner/pushclient/NativePushData;
    invoke-virtual {v0, p2, p3, p4}, Lcom/netease/inner/pushclient/NativePushData;->setMessage(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 103
    iget-object v2, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v2, v1, v0}, Ljava/util/HashMap;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    goto :goto_1
.end method

.method public setAlarmTime(Ljava/lang/String;II)Z
    .locals 4
    .param p1, "alarmID"    # Ljava/lang/String;
    .param p2, "hour"    # I
    .param p3, "minute"    # I

    .prologue
    .line 120
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    const-string v2, "setAlarmTime"

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 121
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "alarmID:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 122
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "hour:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 123
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "minute:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 124
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "nn_"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 125
    .local v0, "pushName":Ljava/lang/String;
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "pushName:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 126
    iget-object v1, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v1, v0}, Ljava/util/HashMap;->containsKey(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_0

    .line 127
    iget-object v1, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v1, v0}, Ljava/util/HashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Lcom/netease/inner/pushclient/NativePushData;

    invoke-virtual {v1, p2, p3}, Lcom/netease/inner/pushclient/NativePushData;->setTime(II)V

    .line 131
    const/4 v1, 0x1

    :goto_0
    return v1

    .line 129
    :cond_0
    const/4 v1, 0x0

    goto :goto_0
.end method

.method public setAlarmTime(Ljava/lang/String;IILjava/lang/String;)Z
    .locals 4
    .param p1, "alarmID"    # Ljava/lang/String;
    .param p2, "hour"    # I
    .param p3, "minute"    # I
    .param p4, "tz"    # Ljava/lang/String;

    .prologue
    .line 148
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    const-string v2, "setAlarmTime"

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 149
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "alarmID:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 150
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "hour:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 151
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "minute:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 152
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "tz:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 153
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "nn_"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 154
    .local v0, "pushName":Ljava/lang/String;
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "pushName:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 155
    iget-object v1, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v1, v0}, Ljava/util/HashMap;->containsKey(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_0

    .line 156
    iget-object v1, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v1, v0}, Ljava/util/HashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Lcom/netease/inner/pushclient/NativePushData;

    invoke-virtual {v1, p2, p3, p4}, Lcom/netease/inner/pushclient/NativePushData;->setTime(IILjava/lang/String;)V

    .line 160
    const/4 v1, 0x1

    :goto_0
    return v1

    .line 158
    :cond_0
    const/4 v1, 0x0

    goto :goto_0
.end method

.method public setMonthRepeat(Ljava/lang/String;I)Z
    .locals 5
    .param p1, "alarmID"    # Ljava/lang/String;
    .param p2, "monthMode"    # I

    .prologue
    const/4 v1, 0x0

    .line 199
    sget-object v2, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    const-string v3, "setMonthRepeat"

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 200
    sget-object v2, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "alarmID:"

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 201
    sget-object v2, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "monthMode:"

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, p2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 202
    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "nn_"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 203
    .local v0, "pushName":Ljava/lang/String;
    sget-object v2, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "pushName:"

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 204
    if-nez p2, :cond_1

    .line 212
    :cond_0
    :goto_0
    return v1

    .line 207
    :cond_1
    iget-object v2, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v2, v0}, Ljava/util/HashMap;->containsKey(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_0

    .line 208
    iget-object v1, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v1, v0}, Ljava/util/HashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Lcom/netease/inner/pushclient/NativePushData;

    invoke-virtual {v1, p2}, Lcom/netease/inner/pushclient/NativePushData;->setMonthRepeat(I)V

    .line 212
    const/4 v1, 0x1

    goto :goto_0
.end method

.method public setOnce(Ljava/lang/String;III)Z
    .locals 4
    .param p1, "alarmID"    # Ljava/lang/String;
    .param p2, "year"    # I
    .param p3, "month"    # I
    .param p4, "day"    # I

    .prologue
    .line 229
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    const-string v2, "setOnce"

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 230
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "alarmID:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 231
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "year:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 232
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "month:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 233
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "day:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p4}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 234
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "nn_"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 235
    .local v0, "pushName":Ljava/lang/String;
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "pushName:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 236
    iget-object v1, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v1, v0}, Ljava/util/HashMap;->containsKey(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_0

    .line 237
    iget-object v1, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v1, v0}, Ljava/util/HashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Lcom/netease/inner/pushclient/NativePushData;

    invoke-virtual {v1, p2, p3, p4}, Lcom/netease/inner/pushclient/NativePushData;->setOnce(III)V

    .line 241
    const/4 v1, 0x1

    :goto_0
    return v1

    .line 239
    :cond_0
    const/4 v1, 0x0

    goto :goto_0
.end method

.method public setOnceUnixtime(Ljava/lang/String;J)Z
    .locals 4
    .param p1, "alarmID"    # Ljava/lang/String;
    .param p2, "ut"    # J

    .prologue
    .line 254
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    const-string v2, "setOnceUnixtime"

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 255
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "alarmID:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 256
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "ut:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p2, p3}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 257
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "nn_"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 258
    .local v0, "pushName":Ljava/lang/String;
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "pushName:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 259
    iget-object v1, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v1, v0}, Ljava/util/HashMap;->containsKey(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_0

    .line 260
    iget-object v1, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v1, v0}, Ljava/util/HashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Lcom/netease/inner/pushclient/NativePushData;

    invoke-virtual {v1, p2, p3}, Lcom/netease/inner/pushclient/NativePushData;->setOnceUnixtime(J)V

    .line 264
    const/4 v1, 0x1

    :goto_0
    return v1

    .line 262
    :cond_0
    const/4 v1, 0x0

    goto :goto_0
.end method

.method public setWeekRepeat(Ljava/lang/String;I)Z
    .locals 5
    .param p1, "alarmID"    # Ljava/lang/String;
    .param p2, "weekMode"    # I

    .prologue
    const/4 v1, 0x0

    .line 173
    sget-object v2, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    const-string v3, "setWeekRepeat"

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 174
    sget-object v2, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "alarmID:"

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 175
    sget-object v2, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "weekMode:"

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, p2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 176
    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "nn_"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 177
    .local v0, "pushName":Ljava/lang/String;
    sget-object v2, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "pushName:"

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 178
    const/16 v2, 0x7f

    if-gt p2, v2, :cond_0

    if-gtz p2, :cond_1

    .line 186
    :cond_0
    :goto_0
    return v1

    .line 181
    :cond_1
    iget-object v2, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v2, v0}, Ljava/util/HashMap;->containsKey(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_0

    .line 182
    iget-object v1, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v1, v0}, Ljava/util/HashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Lcom/netease/inner/pushclient/NativePushData;

    invoke-virtual {v1, p2}, Lcom/netease/inner/pushclient/NativePushData;->setWeekRepeat(I)V

    .line 186
    const/4 v1, 0x1

    goto :goto_0
.end method

.method public startAlarm(Lcom/netease/inner/pushclient/NativePushData;)Z
    .locals 10
    .param p1, "nativePushData"    # Lcom/netease/inner/pushclient/NativePushData;

    .prologue
    const/4 v6, 0x0

    .line 310
    sget-object v5, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    const-string v7, "startAlarm"

    invoke-static {v5, v7}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 311
    sget-object v5, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v7, Ljava/lang/StringBuilder;

    const-string v8, "nativePushData:"

    invoke-direct {v7, v8}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v7, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v7

    invoke-virtual {v7}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v7

    invoke-static {v5, v7}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 312
    sget-object v5, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v7, Ljava/lang/StringBuilder;

    const-string v8, "this:"

    invoke-direct {v7, v8}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v7, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v7

    invoke-virtual {v7}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v7

    invoke-static {v5, v7}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 313
    sget-object v5, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v7, Ljava/lang/StringBuilder;

    const-string v8, "mNativePushNameSet:"

    invoke-direct {v7, v8}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v8, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushNameSet:Ljava/util/Set;

    invoke-virtual {v7, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v7

    invoke-virtual {v7}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v7

    invoke-static {v5, v7}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 314
    if-nez p1, :cond_0

    .line 315
    sget-object v5, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    const-string v7, "nativePushData is null"

    invoke-static {v5, v7}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    move v5, v6

    .line 364
    :goto_0
    return v5

    .line 318
    :cond_0
    invoke-virtual {p1}, Lcom/netease/inner/pushclient/NativePushData;->getPushName()Ljava/lang/String;

    move-result-object v3

    .line 319
    .local v3, "pushName":Ljava/lang/String;
    sget-object v5, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v7, Ljava/lang/StringBuilder;

    const-string v8, "pushName:"

    invoke-direct {v7, v8}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v7, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v7

    invoke-virtual {v7}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v7

    invoke-static {v5, v7}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 320
    iget-object v5, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushNameSet:Ljava/util/Set;

    invoke-interface {v5, v3}, Ljava/util/Set;->contains(Ljava/lang/Object;)Z

    move-result v5

    if-eqz v5, :cond_1

    .line 322
    iget-object v5, p0, Lcom/netease/inner/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    invoke-static {v5, v3}, Lcom/netease/push/utils/PushSetting;->getNativeNotification(Landroid/content/Context;Ljava/lang/String;)Lcom/netease/inner/pushclient/NativePushData;

    move-result-object v0

    .line 323
    .local v0, "nativePushDataTemp":Lcom/netease/inner/pushclient/NativePushData;
    if-eqz v0, :cond_2

    .line 324
    iget-object v5, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v5, v3, v0}, Ljava/util/HashMap;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 330
    .end local v0    # "nativePushDataTemp":Lcom/netease/inner/pushclient/NativePushData;
    :cond_1
    :goto_1
    invoke-virtual {p1}, Lcom/netease/inner/pushclient/NativePushData;->getNotifyMessage()Lcom/netease/push/utils/NotifyMessage;

    move-result-object v1

    .line 331
    .local v1, "notifyMessage":Lcom/netease/push/utils/NotifyMessage;
    iget-object v5, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v5, v3}, Ljava/util/HashMap;->containsKey(Ljava/lang/Object;)Z

    move-result v5

    if-eqz v5, :cond_3

    .line 332
    iget-object v5, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v5, v3}, Ljava/util/HashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v5

    check-cast v5, Lcom/netease/inner/pushclient/NativePushData;

    iget-object v7, v1, Lcom/netease/push/utils/NotifyMessage;->mTitle:Ljava/lang/String;

    iget-object v8, v1, Lcom/netease/push/utils/NotifyMessage;->mMsg:Ljava/lang/String;

    iget-object v9, v1, Lcom/netease/push/utils/NotifyMessage;->mExt:Ljava/lang/String;

    invoke-virtual {v5, v7, v8, v9}, Lcom/netease/inner/pushclient/NativePushData;->setMessage(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 341
    :goto_2
    iget-object v5, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v5, v3}, Ljava/util/HashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/inner/pushclient/NativePushData;

    .line 342
    .local v2, "pushData":Lcom/netease/inner/pushclient/NativePushData;
    iget-object v5, p0, Lcom/netease/inner/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    invoke-virtual {v2, v5}, Lcom/netease/inner/pushclient/NativePushData;->createPushID(Landroid/content/Context;)V

    .line 343
    sget-object v5, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v7, Ljava/lang/StringBuilder;

    const-string v8, "pushData.getPushName():"

    invoke-direct {v7, v8}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2}, Lcom/netease/inner/pushclient/NativePushData;->getPushName()Ljava/lang/String;

    move-result-object v8

    invoke-virtual {v7, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v7

    invoke-virtual {v7}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v7

    invoke-static {v5, v7}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 344
    invoke-virtual {v2}, Lcom/netease/inner/pushclient/NativePushData;->getPushName()Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v3, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5

    if-nez v5, :cond_5

    .line 345
    sget-object v5, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    const-string v7, "invalid pushData: inconsistent pushName"

    invoke-static {v5, v7}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    move v5, v6

    .line 346
    goto/16 :goto_0

    .line 326
    .end local v1    # "notifyMessage":Lcom/netease/push/utils/NotifyMessage;
    .end local v2    # "pushData":Lcom/netease/inner/pushclient/NativePushData;
    .restart local v0    # "nativePushDataTemp":Lcom/netease/inner/pushclient/NativePushData;
    :cond_2
    iget-object v5, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushNameSet:Ljava/util/Set;

    invoke-interface {v5, v3}, Ljava/util/Set;->remove(Ljava/lang/Object;)Z

    .line 327
    iget-object v5, p0, Lcom/netease/inner/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    invoke-static {v5, v3}, Lcom/netease/push/utils/PushSetting;->rmNativePushNames(Landroid/content/Context;Ljava/lang/String;)V

    goto :goto_1

    .line 334
    .end local v0    # "nativePushDataTemp":Lcom/netease/inner/pushclient/NativePushData;
    .restart local v1    # "notifyMessage":Lcom/netease/push/utils/NotifyMessage;
    :cond_3
    iget-object v5, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v5}, Ljava/util/HashMap;->size()I

    move-result v5

    const/16 v7, 0x32

    if-lt v5, v7, :cond_4

    .line 335
    const-string v5, "NgPush"

    const-string v7, "max alarms exist!"

    invoke-static {v5, v7}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    move v5, v6

    .line 336
    goto/16 :goto_0

    .line 338
    :cond_4
    iget-object v5, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v5, v3, p1}, Ljava/util/HashMap;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    goto :goto_2

    .line 349
    .restart local v2    # "pushData":Lcom/netease/inner/pushclient/NativePushData;
    :cond_5
    iget-object v5, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushNameSet:Ljava/util/Set;

    invoke-interface {v5, v3}, Ljava/util/Set;->contains(Ljava/lang/Object;)Z

    move-result v5

    if-eqz v5, :cond_6

    .line 351
    invoke-direct {p0, v3}, Lcom/netease/inner/pushclient/NativePushManager;->stopPushWithPushName(Ljava/lang/String;)Z

    .line 353
    :cond_6
    iget-object v5, p0, Lcom/netease/inner/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    invoke-static {v5, v2}, Lcom/netease/push/utils/PushSetting;->setNativeNotification(Landroid/content/Context;Lcom/netease/inner/pushclient/NativePushData;)Z

    move-result v4

    .line 354
    .local v4, "ret":Z
    if-nez v4, :cond_7

    .line 355
    sget-object v5, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    const-string v7, "PushSetting.setNativeNotification error"

    invoke-static {v5, v7}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    move v5, v6

    .line 356
    goto/16 :goto_0

    .line 358
    :cond_7
    iget-object v5, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushNameSet:Ljava/util/Set;

    invoke-interface {v5, v3}, Ljava/util/Set;->contains(Ljava/lang/Object;)Z

    move-result v5

    if-nez v5, :cond_8

    .line 359
    iget-object v5, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushNameSet:Ljava/util/Set;

    invoke-interface {v5, v3}, Ljava/util/Set;->add(Ljava/lang/Object;)Z

    .line 360
    iget-object v5, p0, Lcom/netease/inner/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    iget-object v6, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushNameSet:Ljava/util/Set;

    invoke-static {v5, v6}, Lcom/netease/push/utils/PushSetting;->setNativePushNames(Landroid/content/Context;Ljava/util/Set;)V

    .line 362
    :cond_8
    sget-object v5, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    const-string v6, "pushData.startAlarm"

    invoke-static {v5, v6}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 363
    iget-object v5, p0, Lcom/netease/inner/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    invoke-virtual {v2, v5}, Lcom/netease/inner/pushclient/NativePushData;->startAlarm(Landroid/content/Context;)V

    .line 364
    const/4 v5, 0x1

    goto/16 :goto_0
.end method

.method public startAlarm(Ljava/lang/String;)Z
    .locals 7
    .param p1, "alarmID"    # Ljava/lang/String;

    .prologue
    const/4 v3, 0x0

    .line 275
    sget-object v4, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    const-string v5, "startAlarm"

    invoke-static {v4, v5}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 276
    sget-object v4, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v5, Ljava/lang/StringBuilder;

    const-string v6, "alarmID:"

    invoke-direct {v5, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v5, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-static {v4, v5}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 277
    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "nn_"

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    .line 278
    .local v1, "pushName":Ljava/lang/String;
    sget-object v4, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v5, Ljava/lang/StringBuilder;

    const-string v6, "pushName:"

    invoke-direct {v5, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v5, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-static {v4, v5}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 279
    iget-object v4, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v4, v1}, Ljava/util/HashMap;->containsKey(Ljava/lang/Object;)Z

    move-result v4

    if-nez v4, :cond_1

    .line 280
    sget-object v4, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    const-string v5, "mNativePushHashMap does not contain pushName"

    invoke-static {v4, v5}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 305
    :cond_0
    :goto_0
    return v3

    .line 283
    :cond_1
    iget-object v4, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushHashMap:Ljava/util/HashMap;

    invoke-virtual {v4, v1}, Ljava/util/HashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Lcom/netease/inner/pushclient/NativePushData;

    .line 284
    .local v0, "nativePushData":Lcom/netease/inner/pushclient/NativePushData;
    iget-object v4, p0, Lcom/netease/inner/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    invoke-virtual {v0, v4}, Lcom/netease/inner/pushclient/NativePushData;->createPushID(Landroid/content/Context;)V

    .line 285
    sget-object v4, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v5, Ljava/lang/StringBuilder;

    const-string v6, "nativePushData.getPushName():"

    invoke-direct {v5, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0}, Lcom/netease/inner/pushclient/NativePushData;->getPushName()Ljava/lang/String;

    move-result-object v6

    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-static {v4, v5}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 286
    invoke-virtual {v0}, Lcom/netease/inner/pushclient/NativePushData;->getPushName()Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v1, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v4

    if-nez v4, :cond_2

    .line 287
    sget-object v4, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    const-string v5, "invalid nativePushData: inconsistent pushName"

    invoke-static {v4, v5}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    goto :goto_0

    .line 291
    :cond_2
    iget-object v4, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushNameSet:Ljava/util/Set;

    invoke-interface {v4, v1}, Ljava/util/Set;->contains(Ljava/lang/Object;)Z

    move-result v4

    if-eqz v4, :cond_3

    .line 293
    invoke-direct {p0, v1}, Lcom/netease/inner/pushclient/NativePushManager;->stopPushWithPushName(Ljava/lang/String;)Z

    .line 295
    :cond_3
    iget-object v4, p0, Lcom/netease/inner/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    invoke-static {v4, v0}, Lcom/netease/push/utils/PushSetting;->setNativeNotification(Landroid/content/Context;Lcom/netease/inner/pushclient/NativePushData;)Z

    move-result v2

    .line 296
    .local v2, "ret":Z
    if-eqz v2, :cond_0

    .line 299
    iget-object v3, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushNameSet:Ljava/util/Set;

    invoke-interface {v3, v1}, Ljava/util/Set;->contains(Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_4

    .line 300
    iget-object v3, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushNameSet:Ljava/util/Set;

    invoke-interface {v3, v1}, Ljava/util/Set;->add(Ljava/lang/Object;)Z

    .line 301
    iget-object v3, p0, Lcom/netease/inner/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    iget-object v4, p0, Lcom/netease/inner/pushclient/NativePushManager;->mNativePushNameSet:Ljava/util/Set;

    invoke-static {v3, v4}, Lcom/netease/push/utils/PushSetting;->setNativePushNames(Landroid/content/Context;Ljava/util/Set;)V

    .line 303
    :cond_4
    sget-object v3, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    const-string v4, "nativePushData.startAlarm"

    invoke-static {v3, v4}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 304
    iget-object v3, p0, Lcom/netease/inner/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    invoke-virtual {v0, v3}, Lcom/netease/inner/pushclient/NativePushData;->startAlarm(Landroid/content/Context;)V

    .line 305
    const/4 v3, 0x1

    goto :goto_0
.end method

.method public stopPush(Ljava/lang/String;)Z
    .locals 4
    .param p1, "alarmID"    # Ljava/lang/String;

    .prologue
    .line 375
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    const-string v2, "stopPush"

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 376
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "alarmID:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 377
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "nn_"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 378
    .local v0, "pushName":Ljava/lang/String;
    sget-object v1, Lcom/netease/inner/pushclient/NativePushManager;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "pushName:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 379
    invoke-direct {p0, v0}, Lcom/netease/inner/pushclient/NativePushManager;->stopPushWithPushName(Ljava/lang/String;)Z

    move-result v1

    return v1
.end method
