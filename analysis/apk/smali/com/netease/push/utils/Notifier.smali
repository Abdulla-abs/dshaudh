.class public Lcom/netease/push/utils/Notifier;
.super Ljava/lang/Object;
.source "Notifier.java"


# static fields
.field private static final TAG:Ljava/lang/String; = "Notifier"

.field private static final random:Ljava/util/Random;


# instance fields
.field private context:Landroid/content/Context;

.field private notificationManager:Landroid/app/NotificationManager;


# direct methods
.method static constructor <clinit>()V
    .locals 3

    .prologue
    .line 14
    new-instance v0, Ljava/util/Random;

    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v1

    invoke-direct {v0, v1, v2}, Ljava/util/Random;-><init>(J)V

    sput-object v0, Lcom/netease/push/utils/Notifier;->random:Ljava/util/Random;

    return-void
.end method

.method public constructor <init>(Landroid/content/Context;)V
    .locals 1
    .param p1, "context"    # Landroid/content/Context;

    .prologue
    .line 18
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 19
    iput-object p1, p0, Lcom/netease/push/utils/Notifier;->context:Landroid/content/Context;

    .line 20
    const-string v0, "notification"

    invoke-virtual {p1, v0}, Landroid/content/Context;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Landroid/app/NotificationManager;

    iput-object v0, p0, Lcom/netease/push/utils/Notifier;->notificationManager:Landroid/app/NotificationManager;

    .line 21
    return-void
.end method


# virtual methods
.method public notify(Lcom/netease/push/utils/NotifyMessage;Lcom/netease/push/utils/AppInfo;)V
    .locals 7
    .param p1, "notifyMessage"    # Lcom/netease/push/utils/NotifyMessage;
    .param p2, "appInfo"    # Lcom/netease/push/utils/AppInfo;

    .prologue
    .line 24
    const-string v4, "Notifier"

    const-string v5, "notify"

    invoke-static {v4, v5}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 25
    const-string v4, "Notifier"

    new-instance v5, Ljava/lang/StringBuilder;

    const-string v6, "notifyMessage:"

    invoke-direct {v5, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v5, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-static {v4, v5}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 26
    const-string v4, "Notifier"

    new-instance v5, Ljava/lang/StringBuilder;

    const-string v6, "appInfo:"

    invoke-direct {v5, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v5, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-static {v4, v5}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 27
    if-eqz p1, :cond_0

    if-nez p2, :cond_1

    .line 54
    :cond_0
    :goto_0
    return-void

    .line 31
    :cond_1
    new-instance v3, Landroid/app/Notification;

    invoke-direct {v3}, Landroid/app/Notification;-><init>()V

    .line 32
    .local v3, "notification":Landroid/app/Notification;
    iget-object v4, p0, Lcom/netease/push/utils/Notifier;->context:Landroid/content/Context;

    invoke-virtual {v4}, Landroid/content/Context;->getApplicationInfo()Landroid/content/pm/ApplicationInfo;

    move-result-object v4

    iget v4, v4, Landroid/content/pm/ApplicationInfo;->icon:I

    iput v4, v3, Landroid/app/Notification;->icon:I

    .line 33
    iget-boolean v4, p2, Lcom/netease/push/utils/AppInfo;->mbEnableSound:Z

    if-eqz v4, :cond_2

    .line 34
    iget v4, v3, Landroid/app/Notification;->defaults:I

    or-int/lit8 v4, v4, 0x1

    iput v4, v3, Landroid/app/Notification;->defaults:I

    .line 36
    :cond_2
    iget-boolean v4, p2, Lcom/netease/push/utils/AppInfo;->mbEnableVibrate:Z

    if-eqz v4, :cond_3

    .line 37
    iget v4, v3, Landroid/app/Notification;->defaults:I

    or-int/lit8 v4, v4, 0x2

    iput v4, v3, Landroid/app/Notification;->defaults:I

    .line 39
    :cond_3
    iget v4, v3, Landroid/app/Notification;->flags:I

    or-int/lit8 v4, v4, 0x10

    iput v4, v3, Landroid/app/Notification;->flags:I

    .line 40
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v4

    iput-wide v4, v3, Landroid/app/Notification;->when:J

    .line 41
    iget-object v4, p1, Lcom/netease/push/utils/NotifyMessage;->mMsg:Ljava/lang/String;

    iput-object v4, v3, Landroid/app/Notification;->tickerText:Ljava/lang/CharSequence;

    .line 43
    sget-object v4, Lcom/netease/push/utils/Notifier;->random:Ljava/util/Random;

    invoke-virtual {v4}, Ljava/util/Random;->nextInt()I

    move-result v2

    .line 44
    .local v2, "msgId":I
    iget-object v4, p0, Lcom/netease/push/utils/Notifier;->context:Landroid/content/Context;

    invoke-virtual {v4}, Landroid/content/Context;->getPackageManager()Landroid/content/pm/PackageManager;

    move-result-object v4

    iget-object v5, p2, Lcom/netease/push/utils/AppInfo;->mPackageName:Ljava/lang/String;

    invoke-virtual {v4, v5}, Landroid/content/pm/PackageManager;->getLaunchIntentForPackage(Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v1

    .line 45
    .local v1, "intent":Landroid/content/Intent;
    const/high16 v4, 0x24000000

    invoke-virtual {v1, v4}, Landroid/content/Intent;->setFlags(I)Landroid/content/Intent;

    .line 46
    const-string v4, "NOTIFICATION_TITLE"

    iget-object v5, p1, Lcom/netease/push/utils/NotifyMessage;->mTitle:Ljava/lang/String;

    invoke-virtual {v1, v4, v5}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 47
    const-string v4, "NOTIFICATION_MESSAGE"

    iget-object v5, p1, Lcom/netease/push/utils/NotifyMessage;->mMsg:Ljava/lang/String;

    invoke-virtual {v1, v4, v5}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 48
    const-string v4, "NOTIFICATION_EXT"

    iget-object v5, p1, Lcom/netease/push/utils/NotifyMessage;->mExt:Ljava/lang/String;

    invoke-virtual {v1, v4, v5}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 51
    iget-object v4, p0, Lcom/netease/push/utils/Notifier;->context:Landroid/content/Context;

    const/4 v5, 0x0

    const/high16 v6, 0x8000000

    invoke-static {v4, v5, v1, v6}, Landroid/app/PendingIntent;->getActivity(Landroid/content/Context;ILandroid/content/Intent;I)Landroid/app/PendingIntent;

    move-result-object v0

    .line 52
    .local v0, "contentIntent":Landroid/app/PendingIntent;
    iget-object v4, p0, Lcom/netease/push/utils/Notifier;->context:Landroid/content/Context;

    iget-object v5, p1, Lcom/netease/push/utils/NotifyMessage;->mTitle:Ljava/lang/String;

    iget-object v6, p1, Lcom/netease/push/utils/NotifyMessage;->mMsg:Ljava/lang/String;

    invoke-virtual {v3, v4, v5, v6, v0}, Landroid/app/Notification;->setLatestEventInfo(Landroid/content/Context;Ljava/lang/CharSequence;Ljava/lang/CharSequence;Landroid/app/PendingIntent;)V

    .line 53
    iget-object v4, p0, Lcom/netease/push/utils/Notifier;->notificationManager:Landroid/app/NotificationManager;

    invoke-virtual {v4, v2, v3}, Landroid/app/NotificationManager;->notify(ILandroid/app/Notification;)V

    goto :goto_0
.end method
