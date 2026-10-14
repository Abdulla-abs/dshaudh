.class public Lcom/netease/dacommon/DANotification;
.super Ljava/lang/Object;
.source "DANotification.java"


# static fields
.field static final ALARM_ACTION:Ljava/lang/String; = "com.netease.H1.AdvanceDino.yo.ALARM"

.field static alarmIntents:Ljava/util/Vector;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Vector",
            "<",
            "Landroid/app/PendingIntent;",
            ">;"
        }
    .end annotation
.end field

.field static m_Context:Landroid/content/Context;


# direct methods
.method public constructor <init>()V
    .locals 0

    .prologue
    .line 10
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public static cancelAllNotifications()V
    .locals 4

    .prologue
    .line 41
    sget-object v2, Lcom/netease/dacommon/DANotification;->m_Context:Landroid/content/Context;

    const-string v3, "alarm"

    invoke-virtual {v2, v3}, Landroid/content/Context;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Landroid/app/AlarmManager;

    .line 44
    .local v0, "am":Landroid/app/AlarmManager;
    const/4 v1, 0x0

    .local v1, "i":I
    :goto_0
    sget-object v2, Lcom/netease/dacommon/DANotification;->alarmIntents:Ljava/util/Vector;

    invoke-virtual {v2}, Ljava/util/Vector;->size()I

    move-result v2

    if-ge v1, v2, :cond_0

    .line 45
    sget-object v2, Lcom/netease/dacommon/DANotification;->alarmIntents:Ljava/util/Vector;

    invoke-virtual {v2, v1}, Ljava/util/Vector;->get(I)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Landroid/app/PendingIntent;

    invoke-virtual {v0, v2}, Landroid/app/AlarmManager;->cancel(Landroid/app/PendingIntent;)V

    .line 44
    add-int/lit8 v1, v1, 0x1

    goto :goto_0

    .line 47
    :cond_0
    sget-object v2, Lcom/netease/dacommon/DANotification;->alarmIntents:Ljava/util/Vector;

    invoke-virtual {v2}, Ljava/util/Vector;->clear()V

    .line 48
    return-void
.end method

.method public static init(Landroid/content/Context;)V
    .locals 1
    .param p0, "ctx"    # Landroid/content/Context;

    .prologue
    .line 17
    sput-object p0, Lcom/netease/dacommon/DANotification;->m_Context:Landroid/content/Context;

    .line 18
    new-instance v0, Ljava/util/Vector;

    invoke-direct {v0}, Ljava/util/Vector;-><init>()V

    sput-object v0, Lcom/netease/dacommon/DANotification;->alarmIntents:Ljava/util/Vector;

    .line 19
    return-void
.end method

.method public static scheduleNotification(Ljava/lang/String;IILjava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 9
    .param p0, "notifIDStr"    # Ljava/lang/String;
    .param p1, "secondsLater"    # I
    .param p2, "repeatType"    # I
    .param p3, "alertBody"    # Ljava/lang/String;
    .param p4, "alertAction"    # Ljava/lang/String;
    .param p5, "key"    # Ljava/lang/String;
    .param p6, "value"    # Ljava/lang/String;

    .prologue
    .line 23
    const v5, 0x3f480

    if-le p1, v5, :cond_0

    .line 24
    const p1, 0x3f480

    .line 25
    :cond_0
    sget-object v5, Lcom/netease/dacommon/DANotification;->m_Context:Landroid/content/Context;

    sget-object v6, Lcom/netease/dacommon/DANotification;->m_Context:Landroid/content/Context;

    const-string v6, "alarm"

    invoke-virtual {v5, v6}, Landroid/content/Context;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Landroid/app/AlarmManager;

    .line 26
    .local v0, "am":Landroid/app/AlarmManager;
    new-instance v1, Landroid/content/Intent;

    invoke-direct {v1}, Landroid/content/Intent;-><init>()V

    .line 27
    .local v1, "intent":Landroid/content/Intent;
    const-string v5, "com.netease.H1.AdvanceDino.yo.ALARM"

    invoke-virtual {v1, v5}, Landroid/content/Intent;->setAction(Ljava/lang/String;)Landroid/content/Intent;

    .line 28
    const-string v5, "msg"

    invoke-virtual {v1, v5, p3}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 29
    sget-object v5, Lcom/netease/dacommon/DANotification;->m_Context:Landroid/content/Context;

    const/4 v6, 0x0

    const/high16 v7, 0x8000000

    invoke-static {v5, v6, v1, v7}, Landroid/app/PendingIntent;->getBroadcast(Landroid/content/Context;ILandroid/content/Intent;I)Landroid/app/PendingIntent;

    move-result-object v2

    .line 30
    .local v2, "pi":Landroid/app/PendingIntent;
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v5

    mul-int/lit16 v7, p1, 0x3e8

    int-to-long v7, v7

    add-long v3, v5, v7

    .line 32
    .local v3, "time":J
    const/4 v5, 0x0

    invoke-virtual {v0, v5, v3, v4, v2}, Landroid/app/AlarmManager;->set(IJLandroid/app/PendingIntent;)V

    .line 34
    sget-object v5, Lcom/netease/dacommon/DANotification;->alarmIntents:Ljava/util/Vector;

    invoke-virtual {v5, v2}, Ljava/util/Vector;->add(Ljava/lang/Object;)Z

    .line 37
    return-void
.end method
