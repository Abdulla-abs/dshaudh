.class public Lcom/netease/pushclient/NativePushManager;
.super Ljava/lang/Object;
.source "NativePushManager.java"


# static fields
.field public static mContext:Landroid/content/Context;


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .prologue
    .line 26
    const/4 v0, 0x0

    sput-object v0, Lcom/netease/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    return-void
.end method

.method public constructor <init>()V
    .locals 0

    .prologue
    .line 24
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public static init(Landroid/content/Context;)V
    .locals 2
    .param p0, "context"    # Landroid/content/Context;

    .prologue
    .line 29
    sput-object p0, Lcom/netease/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    .line 30
    sget-object v0, Lcom/netease/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    if-eqz v0, :cond_0

    .line 31
    invoke-static {}, Lcom/netease/inner/pushclient/NativePushManager;->getInstance()Lcom/netease/inner/pushclient/NativePushManager;

    move-result-object v0

    sget-object v1, Lcom/netease/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    invoke-virtual {v0, v1}, Lcom/netease/inner/pushclient/NativePushManager;->init(Landroid/content/Context;)V

    .line 33
    :cond_0
    return-void
.end method

.method public static newAlarm(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Z
    .locals 1
    .param p0, "alarmID"    # Ljava/lang/String;
    .param p1, "title"    # Ljava/lang/String;
    .param p2, "msg"    # Ljava/lang/String;
    .param p3, "ext"    # Ljava/lang/String;

    .prologue
    .line 36
    sget-object v0, Lcom/netease/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    if-eqz v0, :cond_0

    .line 37
    invoke-static {}, Lcom/netease/inner/pushclient/NativePushManager;->getInstance()Lcom/netease/inner/pushclient/NativePushManager;

    move-result-object v0

    invoke-virtual {v0, p0, p1, p2, p3}, Lcom/netease/inner/pushclient/NativePushManager;->newAlarm(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Z

    move-result v0

    .line 39
    :goto_0
    return v0

    :cond_0
    const/4 v0, 0x0

    goto :goto_0
.end method

.method public static setAlarmTime(Ljava/lang/String;II)Z
    .locals 1
    .param p0, "alarmID"    # Ljava/lang/String;
    .param p1, "hour"    # I
    .param p2, "minute"    # I

    .prologue
    .line 43
    sget-object v0, Lcom/netease/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    if-eqz v0, :cond_0

    .line 44
    invoke-static {}, Lcom/netease/inner/pushclient/NativePushManager;->getInstance()Lcom/netease/inner/pushclient/NativePushManager;

    move-result-object v0

    invoke-virtual {v0, p0, p1, p2}, Lcom/netease/inner/pushclient/NativePushManager;->setAlarmTime(Ljava/lang/String;II)Z

    move-result v0

    .line 46
    :goto_0
    return v0

    :cond_0
    const/4 v0, 0x0

    goto :goto_0
.end method

.method public static setAlarmTime(Ljava/lang/String;IILjava/lang/String;)Z
    .locals 1
    .param p0, "alarmID"    # Ljava/lang/String;
    .param p1, "hour"    # I
    .param p2, "minute"    # I
    .param p3, "tz"    # Ljava/lang/String;

    .prologue
    .line 50
    sget-object v0, Lcom/netease/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    if-eqz v0, :cond_0

    .line 51
    invoke-static {}, Lcom/netease/inner/pushclient/NativePushManager;->getInstance()Lcom/netease/inner/pushclient/NativePushManager;

    move-result-object v0

    invoke-virtual {v0, p0, p1, p2, p3}, Lcom/netease/inner/pushclient/NativePushManager;->setAlarmTime(Ljava/lang/String;IILjava/lang/String;)Z

    move-result v0

    .line 53
    :goto_0
    return v0

    :cond_0
    const/4 v0, 0x0

    goto :goto_0
.end method

.method public static setMonthRepeat(Ljava/lang/String;I)Z
    .locals 1
    .param p0, "alarmID"    # Ljava/lang/String;
    .param p1, "monthMode"    # I

    .prologue
    .line 64
    sget-object v0, Lcom/netease/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    if-eqz v0, :cond_0

    .line 65
    invoke-static {}, Lcom/netease/inner/pushclient/NativePushManager;->getInstance()Lcom/netease/inner/pushclient/NativePushManager;

    move-result-object v0

    invoke-virtual {v0, p0, p1}, Lcom/netease/inner/pushclient/NativePushManager;->setMonthRepeat(Ljava/lang/String;I)Z

    move-result v0

    .line 67
    :goto_0
    return v0

    :cond_0
    const/4 v0, 0x0

    goto :goto_0
.end method

.method public static setOnce(Ljava/lang/String;III)Z
    .locals 1
    .param p0, "alarmID"    # Ljava/lang/String;
    .param p1, "year"    # I
    .param p2, "month"    # I
    .param p3, "day"    # I

    .prologue
    .line 71
    sget-object v0, Lcom/netease/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    if-eqz v0, :cond_0

    .line 72
    invoke-static {}, Lcom/netease/inner/pushclient/NativePushManager;->getInstance()Lcom/netease/inner/pushclient/NativePushManager;

    move-result-object v0

    invoke-virtual {v0, p0, p1, p2, p3}, Lcom/netease/inner/pushclient/NativePushManager;->setOnce(Ljava/lang/String;III)Z

    move-result v0

    .line 74
    :goto_0
    return v0

    :cond_0
    const/4 v0, 0x0

    goto :goto_0
.end method

.method public static setOnceLater(Ljava/lang/String;I)Z
    .locals 5
    .param p0, "alarmID"    # Ljava/lang/String;
    .param p1, "delaySecond"    # I

    .prologue
    .line 85
    sget-object v0, Lcom/netease/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    if-eqz v0, :cond_0

    .line 86
    invoke-static {}, Lcom/netease/inner/pushclient/NativePushManager;->getInstance()Lcom/netease/inner/pushclient/NativePushManager;

    move-result-object v0

    .line 87
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v1

    const-wide/16 v3, 0x3e8

    div-long/2addr v1, v3

    int-to-long v3, p1

    add-long/2addr v1, v3

    .line 86
    invoke-virtual {v0, p0, v1, v2}, Lcom/netease/inner/pushclient/NativePushManager;->setOnceUnixtime(Ljava/lang/String;J)Z

    move-result v0

    .line 89
    :goto_0
    return v0

    :cond_0
    const/4 v0, 0x0

    goto :goto_0
.end method

.method public static setOnceUnixtime(Ljava/lang/String;J)Z
    .locals 1
    .param p0, "alarmID"    # Ljava/lang/String;
    .param p1, "ut"    # J

    .prologue
    .line 78
    sget-object v0, Lcom/netease/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    if-eqz v0, :cond_0

    .line 79
    invoke-static {}, Lcom/netease/inner/pushclient/NativePushManager;->getInstance()Lcom/netease/inner/pushclient/NativePushManager;

    move-result-object v0

    invoke-virtual {v0, p0, p1, p2}, Lcom/netease/inner/pushclient/NativePushManager;->setOnceUnixtime(Ljava/lang/String;J)Z

    move-result v0

    .line 81
    :goto_0
    return v0

    :cond_0
    const/4 v0, 0x0

    goto :goto_0
.end method

.method public static setWeekRepeat(Ljava/lang/String;I)Z
    .locals 1
    .param p0, "alarmID"    # Ljava/lang/String;
    .param p1, "weekMode"    # I

    .prologue
    .line 57
    sget-object v0, Lcom/netease/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    if-eqz v0, :cond_0

    .line 58
    invoke-static {}, Lcom/netease/inner/pushclient/NativePushManager;->getInstance()Lcom/netease/inner/pushclient/NativePushManager;

    move-result-object v0

    invoke-virtual {v0, p0, p1}, Lcom/netease/inner/pushclient/NativePushManager;->setWeekRepeat(Ljava/lang/String;I)Z

    move-result v0

    .line 60
    :goto_0
    return v0

    :cond_0
    const/4 v0, 0x0

    goto :goto_0
.end method

.method public static startAlarm(Lcom/netease/inner/pushclient/NativePushData;)Z
    .locals 1
    .param p0, "nativePushData"    # Lcom/netease/inner/pushclient/NativePushData;

    .prologue
    .line 100
    sget-object v0, Lcom/netease/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    if-eqz v0, :cond_0

    .line 101
    invoke-static {}, Lcom/netease/inner/pushclient/NativePushManager;->getInstance()Lcom/netease/inner/pushclient/NativePushManager;

    move-result-object v0

    invoke-virtual {v0, p0}, Lcom/netease/inner/pushclient/NativePushManager;->startAlarm(Lcom/netease/inner/pushclient/NativePushData;)Z

    move-result v0

    .line 103
    :goto_0
    return v0

    :cond_0
    const/4 v0, 0x0

    goto :goto_0
.end method

.method public static startAlarm(Ljava/lang/String;)Z
    .locals 1
    .param p0, "alarmID"    # Ljava/lang/String;

    .prologue
    .line 93
    sget-object v0, Lcom/netease/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    if-eqz v0, :cond_0

    .line 94
    invoke-static {}, Lcom/netease/inner/pushclient/NativePushManager;->getInstance()Lcom/netease/inner/pushclient/NativePushManager;

    move-result-object v0

    invoke-virtual {v0, p0}, Lcom/netease/inner/pushclient/NativePushManager;->startAlarm(Ljava/lang/String;)Z

    move-result v0

    .line 96
    :goto_0
    return v0

    :cond_0
    const/4 v0, 0x0

    goto :goto_0
.end method

.method public static stopPush(Ljava/lang/String;)Z
    .locals 1
    .param p0, "alarmID"    # Ljava/lang/String;

    .prologue
    .line 113
    sget-object v0, Lcom/netease/pushclient/NativePushManager;->mContext:Landroid/content/Context;

    if-eqz v0, :cond_0

    .line 114
    invoke-static {}, Lcom/netease/inner/pushclient/NativePushManager;->getInstance()Lcom/netease/inner/pushclient/NativePushManager;

    move-result-object v0

    invoke-virtual {v0, p0}, Lcom/netease/inner/pushclient/NativePushManager;->stopPush(Ljava/lang/String;)Z

    move-result v0

    .line 116
    :goto_0
    return v0

    :cond_0
    const/4 v0, 0x0

    goto :goto_0
.end method
