.class public Lcom/netease/h1/qihoo/DinoAlarmReceiver;
.super Landroid/content/BroadcastReceiver;
.source "DinoAlarmReceiver.java"


# direct methods
.method public constructor <init>()V
    .locals 0

    .prologue
    .line 11
    invoke-direct {p0}, Landroid/content/BroadcastReceiver;-><init>()V

    return-void
.end method


# virtual methods
.method public onReceive(Landroid/content/Context;Landroid/content/Intent;)V
    .locals 11
    .param p1, "context"    # Landroid/content/Context;
    .param p2, "intent"    # Landroid/content/Intent;

    .prologue
    const v10, 0x7f050070

    const/4 v9, 0x0

    .line 15
    const-string v5, "notification"

    invoke-virtual {p1, v5}, Landroid/content/Context;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v4

    check-cast v4, Landroid/app/NotificationManager;

    .line 17
    .local v4, "notificationMananger":Landroid/app/NotificationManager;
    new-instance v2, Landroid/app/Notification;

    const v5, 0x7f020001

    invoke-virtual {p1, v10}, Landroid/content/Context;->getString(I)Ljava/lang/String;

    move-result-object v6

    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v7

    invoke-direct {v2, v5, v6, v7, v8}, Landroid/app/Notification;-><init>(ILjava/lang/CharSequence;J)V

    .line 18
    .local v2, "notification":Landroid/app/Notification;
    const v5, -0xffff01

    iput v5, v2, Landroid/app/Notification;->ledARGB:I

    .line 19
    const/16 v5, 0xbb8

    iput v5, v2, Landroid/app/Notification;->ledOnMS:I

    .line 20
    const/16 v5, 0x10

    iput v5, v2, Landroid/app/Notification;->flags:I

    .line 21
    const/4 v5, 0x1

    iput v5, v2, Landroid/app/Notification;->defaults:I

    .line 22
    new-instance v3, Landroid/content/Intent;

    const-class v5, Lcom/netease/h1/qihoo/AdvanceDino;

    invoke-direct {v3, p1, v5}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    .line 23
    .local v3, "notificationIntent":Landroid/content/Intent;
    invoke-static {p1, v9, v3, v9}, Landroid/app/PendingIntent;->getActivity(Landroid/content/Context;ILandroid/content/Intent;I)Landroid/app/PendingIntent;

    move-result-object v0

    .line 24
    .local v0, "contentIntent":Landroid/app/PendingIntent;
    const-string v5, "msg"

    invoke-virtual {p2, v5}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    .line 25
    .local v1, "msg":Ljava/lang/String;
    const/high16 v5, 0x14000000

    invoke-virtual {p2, v5}, Landroid/content/Intent;->setFlags(I)Landroid/content/Intent;

    .line 26
    invoke-virtual {p1, v10}, Landroid/content/Context;->getString(I)Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v2, p1, v5, v1, v0}, Landroid/app/Notification;->setLatestEventInfo(Landroid/content/Context;Ljava/lang/CharSequence;Ljava/lang/CharSequence;Landroid/app/PendingIntent;)V

    .line 27
    invoke-virtual {v4, v9, v2}, Landroid/app/NotificationManager;->notify(ILandroid/app/Notification;)V

    .line 28
    return-void
.end method
