.class public Lcom/netease/inner/pushclient/NativePushData;
.super Ljava/lang/Object;
.source "NativePushData.java"


# static fields
.field static final synthetic $assertionsDisabled:Z

.field public static final ONCE:I = 0x0

.field public static final REPEAT_MONTH:I = 0x2

.field public static final REPEAT_WEEK:I = 0x1

.field private static final TAG:Ljava/lang/String;


# instance fields
.field private mDay:I

.field private mHour:I

.field private mMinute:I

.field private mMode:I

.field private mMonth:I

.field private mNotifyMessage:Lcom/netease/push/utils/NotifyMessage;

.field private mPushID:I

.field private mPushName:Ljava/lang/String;

.field private mRepeatMode:I

.field private mSecond:I

.field private mTimeZone:Ljava/lang/String;

.field private mYear:I


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .prologue
    .line 47
    const-class v0, Lcom/netease/inner/pushclient/NativePushData;

    invoke-virtual {v0}, Ljava/lang/Class;->desiredAssertionStatus()Z

    move-result v0

    if-nez v0, :cond_0

    const/4 v0, 0x1

    :goto_0
    sput-boolean v0, Lcom/netease/inner/pushclient/NativePushData;->$assertionsDisabled:Z

    .line 49
    const-class v0, Lcom/netease/pushclient/NativePushManager;

    invoke-virtual {v0}, Ljava/lang/Class;->getSimpleName()Ljava/lang/String;

    move-result-object v0

    sput-object v0, Lcom/netease/inner/pushclient/NativePushData;->TAG:Ljava/lang/String;

    .line 62
    return-void

    .line 47
    :cond_0
    const/4 v0, 0x0

    goto :goto_0
.end method

.method public constructor <init>(Ljava/lang/String;)V
    .locals 2
    .param p1, "alarmID"    # Ljava/lang/String;

    .prologue
    const/4 v1, 0x0

    .line 84
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 51
    new-instance v0, Lcom/netease/push/utils/NotifyMessage;

    invoke-direct {v0}, Lcom/netease/push/utils/NotifyMessage;-><init>()V

    iput-object v0, p0, Lcom/netease/inner/pushclient/NativePushData;->mNotifyMessage:Lcom/netease/push/utils/NotifyMessage;

    .line 55
    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mHour:I

    .line 56
    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mMinute:I

    .line 57
    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mSecond:I

    .line 58
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/inner/pushclient/NativePushData;->mTimeZone:Ljava/lang/String;

    .line 65
    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mRepeatMode:I

    .line 71
    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mMode:I

    .line 74
    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mYear:I

    .line 75
    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mMonth:I

    .line 76
    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mDay:I

    .line 78
    const-string v0, "default"

    iput-object v0, p0, Lcom/netease/inner/pushclient/NativePushData;->mPushName:Ljava/lang/String;

    .line 82
    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mPushID:I

    .line 85
    invoke-virtual {p0}, Lcom/netease/inner/pushclient/NativePushData;->clear()V

    .line 86
    iput-object p1, p0, Lcom/netease/inner/pushclient/NativePushData;->mPushName:Ljava/lang/String;

    .line 87
    return-void
.end method

.method private getRepeatNextTime(Ljava/util/Calendar;II)J
    .locals 7
    .param p1, "calendar"    # Ljava/util/Calendar;
    .param p2, "field"    # I
    .param p3, "pattern"    # I

    .prologue
    const/4 v6, 0x1

    .line 227
    iget v0, p0, Lcom/netease/inner/pushclient/NativePushData;->mMode:I

    .line 228
    .local v0, "mode":I
    invoke-virtual {p1}, Ljava/util/Calendar;->getTimeInMillis()J

    move-result-wide v1

    .line 229
    .local v1, "selectTime":J
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v3

    .line 230
    .local v3, "systemTime":J
    :goto_0
    cmp-long v5, v1, v3

    if-ltz v5, :cond_0

    invoke-virtual {p1, p2}, Ljava/util/Calendar;->get(I)I

    move-result v5

    add-int/lit8 v5, v5, -0x1

    shl-int v5, v6, v5

    and-int/2addr v5, p3

    if-eqz v5, :cond_0

    .line 234
    return-wide v1

    .line 231
    :cond_0
    const/4 v5, 0x5

    invoke-virtual {p1, v5, v6}, Ljava/util/Calendar;->add(II)V

    .line 232
    invoke-virtual {p1}, Ljava/util/Calendar;->getTimeInMillis()J

    move-result-wide v1

    goto :goto_0
.end method

.method public static readFromJsonString(Ljava/lang/String;Ljava/lang/String;)Lcom/netease/inner/pushclient/NativePushData;
    .locals 4
    .param p0, "alarmID"    # Ljava/lang/String;
    .param p1, "data"    # Ljava/lang/String;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Lorg/json/JSONException;
        }
    .end annotation

    .prologue
    .line 294
    new-instance v0, Lorg/json/JSONObject;

    invoke-direct {v0, p1}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    .line 296
    .local v0, "jsonObject":Lorg/json/JSONObject;
    new-instance v2, Lcom/netease/inner/pushclient/NativePushData;

    invoke-direct {v2, p0}, Lcom/netease/inner/pushclient/NativePushData;-><init>(Ljava/lang/String;)V

    .line 297
    .local v2, "nativePushData":Lcom/netease/inner/pushclient/NativePushData;
    const-string v3, "notify"

    invoke-virtual {v0, v3}, Lorg/json/JSONObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    .line 298
    .local v1, "messageData":Ljava/lang/String;
    invoke-static {v1}, Lcom/netease/push/utils/NotifyMessage;->readFromJsonString(Ljava/lang/String;)Lcom/netease/push/utils/NotifyMessage;

    move-result-object v3

    iput-object v3, v2, Lcom/netease/inner/pushclient/NativePushData;->mNotifyMessage:Lcom/netease/push/utils/NotifyMessage;

    .line 300
    const-string v3, "repeat"

    invoke-virtual {v0, v3}, Lorg/json/JSONObject;->getInt(Ljava/lang/String;)I

    move-result v3

    iput v3, v2, Lcom/netease/inner/pushclient/NativePushData;->mRepeatMode:I

    .line 301
    const-string v3, "mode"

    invoke-virtual {v0, v3}, Lorg/json/JSONObject;->getInt(Ljava/lang/String;)I

    move-result v3

    iput v3, v2, Lcom/netease/inner/pushclient/NativePushData;->mMode:I

    .line 302
    const-string v3, "hour"

    invoke-virtual {v0, v3}, Lorg/json/JSONObject;->getInt(Ljava/lang/String;)I

    move-result v3

    iput v3, v2, Lcom/netease/inner/pushclient/NativePushData;->mHour:I

    .line 303
    const-string v3, "min"

    invoke-virtual {v0, v3}, Lorg/json/JSONObject;->getInt(Ljava/lang/String;)I

    move-result v3

    iput v3, v2, Lcom/netease/inner/pushclient/NativePushData;->mMinute:I

    .line 304
    const-string v3, "sec"

    invoke-virtual {v0, v3}, Lorg/json/JSONObject;->getInt(Ljava/lang/String;)I

    move-result v3

    iput v3, v2, Lcom/netease/inner/pushclient/NativePushData;->mSecond:I

    .line 305
    const-string v3, "pushid"

    invoke-virtual {v0, v3}, Lorg/json/JSONObject;->getInt(Ljava/lang/String;)I

    move-result v3

    iput v3, v2, Lcom/netease/inner/pushclient/NativePushData;->mPushID:I

    .line 306
    const-string v3, "year"

    invoke-virtual {v0, v3}, Lorg/json/JSONObject;->getInt(Ljava/lang/String;)I

    move-result v3

    iput v3, v2, Lcom/netease/inner/pushclient/NativePushData;->mYear:I

    .line 307
    const-string v3, "month"

    invoke-virtual {v0, v3}, Lorg/json/JSONObject;->getInt(Ljava/lang/String;)I

    move-result v3

    iput v3, v2, Lcom/netease/inner/pushclient/NativePushData;->mMonth:I

    .line 308
    const-string v3, "day"

    invoke-virtual {v0, v3}, Lorg/json/JSONObject;->getInt(Ljava/lang/String;)I

    move-result v3

    iput v3, v2, Lcom/netease/inner/pushclient/NativePushData;->mDay:I

    .line 310
    return-object v2
.end method


# virtual methods
.method public clear()V
    .locals 2

    .prologue
    const/4 v1, 0x0

    .line 90
    iget-object v0, p0, Lcom/netease/inner/pushclient/NativePushData;->mNotifyMessage:Lcom/netease/push/utils/NotifyMessage;

    invoke-virtual {v0}, Lcom/netease/push/utils/NotifyMessage;->clear()V

    .line 91
    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mHour:I

    .line 92
    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mMinute:I

    .line 93
    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mSecond:I

    .line 94
    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mMode:I

    .line 95
    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mYear:I

    .line 96
    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mMonth:I

    .line 97
    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mDay:I

    .line 98
    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mRepeatMode:I

    .line 99
    const-string v0, "default"

    iput-object v0, p0, Lcom/netease/inner/pushclient/NativePushData;->mPushName:Ljava/lang/String;

    .line 100
    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mPushID:I

    .line 101
    return-void
.end method

.method public createPushID(Landroid/content/Context;)V
    .locals 3
    .param p1, "context"    # Landroid/content/Context;

    .prologue
    .line 158
    new-instance v1, Ljava/lang/StringBuilder;

    invoke-virtual {p1}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    move-result-object v2

    invoke-static {v2}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v2

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v2, p0, Lcom/netease/inner/pushclient/NativePushData;->mPushName:Ljava/lang/String;

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 159
    .local v0, "push":Ljava/lang/String;
    invoke-virtual {v0}, Ljava/lang/String;->hashCode()I

    move-result v1

    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mPushID:I

    .line 160
    return-void
.end method

.method public getNativeNotifyIntent(Ljava/lang/String;)Landroid/content/Intent;
    .locals 3
    .param p1, "packageName"    # Ljava/lang/String;

    .prologue
    .line 164
    invoke-static {}, Lcom/netease/inner/pushclient/PushClientReceiver;->createMethodIntent()Landroid/content/Intent;

    move-result-object v0

    .line 165
    .local v0, "intent":Landroid/content/Intent;
    invoke-virtual {v0, p1}, Landroid/content/Intent;->setPackage(Ljava/lang/String;)Landroid/content/Intent;

    .line 166
    const-string v1, "package"

    invoke-virtual {v0, v1, p1}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 167
    const-string v1, "pushname"

    iget-object v2, p0, Lcom/netease/inner/pushclient/NativePushData;->mPushName:Ljava/lang/String;

    invoke-virtual {v0, v1, v2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 168
    const-string v1, "method"

    const-string v2, "nativenotify"

    invoke-virtual {v0, v1, v2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 169
    return-object v0
.end method

.method public getNotifyMessage()Lcom/netease/push/utils/NotifyMessage;
    .locals 1

    .prologue
    .line 53
    iget-object v0, p0, Lcom/netease/inner/pushclient/NativePushData;->mNotifyMessage:Lcom/netease/push/utils/NotifyMessage;

    return-object v0
.end method

.method public getPushName()Ljava/lang/String;
    .locals 1

    .prologue
    .line 80
    iget-object v0, p0, Lcom/netease/inner/pushclient/NativePushData;->mPushName:Ljava/lang/String;

    return-object v0
.end method

.method public getRepeatMode()I
    .locals 1

    .prologue
    .line 67
    iget v0, p0, Lcom/netease/inner/pushclient/NativePushData;->mRepeatMode:I

    return v0
.end method

.method public getTriggerAtMillis()J
    .locals 17

    .prologue
    .line 176
    invoke-static {}, Landroid/os/SystemClock;->elapsedRealtime()J

    move-result-wide v2

    .line 177
    .local v2, "firstTime":J
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v7

    .line 178
    .local v7, "systemTime":J
    invoke-static {}, Ljava/util/Calendar;->getInstance()Ljava/util/Calendar;

    move-result-object v1

    .line 180
    .local v1, "calendar":Ljava/util/Calendar;
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v9

    invoke-virtual {v1, v9, v10}, Ljava/util/Calendar;->setTimeInMillis(J)V

    .line 181
    move-object/from16 v0, p0

    iget-object v9, v0, Lcom/netease/inner/pushclient/NativePushData;->mTimeZone:Ljava/lang/String;

    if-eqz v9, :cond_1

    move-object/from16 v0, p0

    iget-object v9, v0, Lcom/netease/inner/pushclient/NativePushData;->mTimeZone:Ljava/lang/String;

    invoke-virtual {v9}, Ljava/lang/String;->length()I

    move-result v9

    if-lez v9, :cond_1

    .line 182
    move-object/from16 v0, p0

    iget-object v9, v0, Lcom/netease/inner/pushclient/NativePushData;->mTimeZone:Ljava/lang/String;

    invoke-static {v9}, Ljava/util/TimeZone;->getTimeZone(Ljava/lang/String;)Ljava/util/TimeZone;

    move-result-object v9

    invoke-virtual {v1, v9}, Ljava/util/Calendar;->setTimeZone(Ljava/util/TimeZone;)V

    .line 186
    :goto_0
    const/16 v9, 0xb

    move-object/from16 v0, p0

    iget v10, v0, Lcom/netease/inner/pushclient/NativePushData;->mHour:I

    invoke-virtual {v1, v9, v10}, Ljava/util/Calendar;->set(II)V

    .line 187
    const/16 v9, 0xc

    move-object/from16 v0, p0

    iget v10, v0, Lcom/netease/inner/pushclient/NativePushData;->mMinute:I

    invoke-virtual {v1, v9, v10}, Ljava/util/Calendar;->set(II)V

    .line 188
    const/16 v9, 0xd

    move-object/from16 v0, p0

    iget v10, v0, Lcom/netease/inner/pushclient/NativePushData;->mSecond:I

    invoke-virtual {v1, v9, v10}, Ljava/util/Calendar;->set(II)V

    .line 189
    const/16 v9, 0xe

    const/4 v10, 0x0

    invoke-virtual {v1, v9, v10}, Ljava/util/Calendar;->set(II)V

    .line 191
    const-wide/16 v5, 0x0

    .line 192
    .local v5, "selectTime":J
    move-object/from16 v0, p0

    iget v9, v0, Lcom/netease/inner/pushclient/NativePushData;->mRepeatMode:I

    if-nez v9, :cond_2

    .line 193
    move-object/from16 v0, p0

    iget v9, v0, Lcom/netease/inner/pushclient/NativePushData;->mYear:I

    move-object/from16 v0, p0

    iget v10, v0, Lcom/netease/inner/pushclient/NativePushData;->mMonth:I

    move-object/from16 v0, p0

    iget v11, v0, Lcom/netease/inner/pushclient/NativePushData;->mDay:I

    invoke-virtual {v1, v9, v10, v11}, Ljava/util/Calendar;->set(III)V

    .line 194
    invoke-virtual {v1}, Ljava/util/Calendar;->getTimeInMillis()J

    move-result-wide v5

    .line 217
    :cond_0
    :goto_1
    sget-object v9, Lcom/netease/inner/pushclient/NativePushData;->TAG:Ljava/lang/String;

    const-string v10, "next trigger time:%s sec:%d"

    const/4 v11, 0x2

    new-array v11, v11, [Ljava/lang/Object;

    const/4 v12, 0x0

    invoke-virtual {v1}, Ljava/util/Calendar;->getTime()Ljava/util/Date;

    move-result-object v13

    invoke-virtual {v13}, Ljava/util/Date;->toLocaleString()Ljava/lang/String;

    move-result-object v13

    aput-object v13, v11, v12

    const/4 v12, 0x1

    sub-long v13, v5, v7

    const-wide/16 v15, 0x3e8

    div-long/2addr v13, v15

    invoke-static {v13, v14}, Ljava/lang/Long;->valueOf(J)Ljava/lang/Long;

    move-result-object v13

    aput-object v13, v11, v12

    invoke-static {v10, v11}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v10

    invoke-static {v9, v10}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 218
    cmp-long v9, v5, v7

    if-gez v9, :cond_7

    .line 219
    const-wide/16 v9, 0x0

    .line 222
    :goto_2
    return-wide v9

    .line 184
    .end local v5    # "selectTime":J
    :cond_1
    invoke-static {}, Ljava/util/TimeZone;->getDefault()Ljava/util/TimeZone;

    move-result-object v9

    invoke-virtual {v1, v9}, Ljava/util/Calendar;->setTimeZone(Ljava/util/TimeZone;)V

    goto :goto_0

    .line 196
    .restart local v5    # "selectTime":J
    :cond_2
    move-object/from16 v0, p0

    iget v9, v0, Lcom/netease/inner/pushclient/NativePushData;->mRepeatMode:I

    const/4 v10, 0x1

    if-ne v9, v10, :cond_5

    .line 198
    move-object/from16 v0, p0

    iget v9, v0, Lcom/netease/inner/pushclient/NativePushData;->mMode:I

    if-nez v9, :cond_3

    .line 199
    const-wide/16 v9, 0x0

    goto :goto_2

    .line 203
    :cond_3
    const/4 v4, 0x0

    .line 204
    .local v4, "mode":I
    move-object/from16 v0, p0

    iget v9, v0, Lcom/netease/inner/pushclient/NativePushData;->mMode:I

    and-int/lit8 v9, v9, 0x40

    if-eqz v9, :cond_4

    .line 205
    const/4 v4, 0x1

    .line 207
    :cond_4
    move-object/from16 v0, p0

    iget v9, v0, Lcom/netease/inner/pushclient/NativePushData;->mMode:I

    shl-int/lit8 v9, v9, 0x1

    or-int/2addr v9, v4

    and-int/lit8 v4, v9, 0x7f

    .line 209
    const/4 v9, 0x7

    move-object/from16 v0, p0

    invoke-direct {v0, v1, v9, v4}, Lcom/netease/inner/pushclient/NativePushData;->getRepeatNextTime(Ljava/util/Calendar;II)J

    move-result-wide v5

    .line 210
    goto :goto_1

    .line 211
    .end local v4    # "mode":I
    :cond_5
    move-object/from16 v0, p0

    iget v9, v0, Lcom/netease/inner/pushclient/NativePushData;->mRepeatMode:I

    const/4 v10, 0x2

    if-ne v9, v10, :cond_0

    .line 212
    move-object/from16 v0, p0

    iget v9, v0, Lcom/netease/inner/pushclient/NativePushData;->mMode:I

    if-nez v9, :cond_6

    .line 213
    const-wide/16 v9, 0x0

    goto :goto_2

    .line 215
    :cond_6
    const/4 v9, 0x5

    move-object/from16 v0, p0

    iget v10, v0, Lcom/netease/inner/pushclient/NativePushData;->mMode:I

    move-object/from16 v0, p0

    invoke-direct {v0, v1, v9, v10}, Lcom/netease/inner/pushclient/NativePushData;->getRepeatNextTime(Ljava/util/Calendar;II)J

    move-result-wide v5

    goto :goto_1

    .line 222
    :cond_7
    add-long v9, v2, v5

    sub-long/2addr v9, v7

    goto :goto_2
.end method

.method public setMessage(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 1
    .param p1, "title"    # Ljava/lang/String;
    .param p2, "msg"    # Ljava/lang/String;
    .param p3, "ext"    # Ljava/lang/String;

    .prologue
    .line 104
    iget-object v0, p0, Lcom/netease/inner/pushclient/NativePushData;->mNotifyMessage:Lcom/netease/push/utils/NotifyMessage;

    iput-object p1, v0, Lcom/netease/push/utils/NotifyMessage;->mTitle:Ljava/lang/String;

    .line 105
    iget-object v0, p0, Lcom/netease/inner/pushclient/NativePushData;->mNotifyMessage:Lcom/netease/push/utils/NotifyMessage;

    iput-object p2, v0, Lcom/netease/push/utils/NotifyMessage;->mMsg:Ljava/lang/String;

    .line 106
    iget-object v0, p0, Lcom/netease/inner/pushclient/NativePushData;->mNotifyMessage:Lcom/netease/push/utils/NotifyMessage;

    iput-object p3, v0, Lcom/netease/push/utils/NotifyMessage;->mExt:Ljava/lang/String;

    .line 107
    return-void
.end method

.method public setMonthRepeat(I)V
    .locals 1
    .param p1, "monthMode"    # I

    .prologue
    .line 129
    const/4 v0, 0x2

    iput v0, p0, Lcom/netease/inner/pushclient/NativePushData;->mRepeatMode:I

    .line 130
    iput p1, p0, Lcom/netease/inner/pushclient/NativePushData;->mMode:I

    .line 131
    return-void
.end method

.method public setOnce(III)V
    .locals 1
    .param p1, "year"    # I
    .param p2, "month"    # I
    .param p3, "day"    # I

    .prologue
    .line 134
    const/4 v0, 0x0

    iput v0, p0, Lcom/netease/inner/pushclient/NativePushData;->mRepeatMode:I

    .line 135
    iput p1, p0, Lcom/netease/inner/pushclient/NativePushData;->mYear:I

    .line 136
    iput p2, p0, Lcom/netease/inner/pushclient/NativePushData;->mMonth:I

    .line 137
    iput p3, p0, Lcom/netease/inner/pushclient/NativePushData;->mDay:I

    .line 138
    return-void
.end method

.method public setOnceUnixtime(J)V
    .locals 4
    .param p1, "ut"    # J

    .prologue
    .line 141
    invoke-static {}, Ljava/util/Calendar;->getInstance()Ljava/util/Calendar;

    move-result-object v0

    .line 142
    .local v0, "c":Ljava/util/Calendar;
    new-instance v1, Ljava/util/Date;

    const-wide/16 v2, 0x3e8

    mul-long/2addr v2, p1

    invoke-direct {v1, v2, v3}, Ljava/util/Date;-><init>(J)V

    invoke-virtual {v0, v1}, Ljava/util/Calendar;->setTime(Ljava/util/Date;)V

    .line 143
    iget-object v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mTimeZone:Ljava/lang/String;

    if-eqz v1, :cond_0

    iget-object v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mTimeZone:Ljava/lang/String;

    invoke-virtual {v1}, Ljava/lang/String;->length()I

    move-result v1

    if-lez v1, :cond_0

    .line 144
    iget-object v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mTimeZone:Ljava/lang/String;

    invoke-static {v1}, Ljava/util/TimeZone;->getTimeZone(Ljava/lang/String;)Ljava/util/TimeZone;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/util/Calendar;->setTimeZone(Ljava/util/TimeZone;)V

    .line 148
    :goto_0
    const/4 v1, 0x1

    invoke-virtual {v0, v1}, Ljava/util/Calendar;->get(I)I

    move-result v1

    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mYear:I

    .line 149
    const/4 v1, 0x2

    invoke-virtual {v0, v1}, Ljava/util/Calendar;->get(I)I

    move-result v1

    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mMonth:I

    .line 150
    const/4 v1, 0x5

    invoke-virtual {v0, v1}, Ljava/util/Calendar;->get(I)I

    move-result v1

    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mDay:I

    .line 151
    const/16 v1, 0xb

    invoke-virtual {v0, v1}, Ljava/util/Calendar;->get(I)I

    move-result v1

    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mHour:I

    .line 152
    const/16 v1, 0xc

    invoke-virtual {v0, v1}, Ljava/util/Calendar;->get(I)I

    move-result v1

    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mMinute:I

    .line 153
    const/16 v1, 0xd

    invoke-virtual {v0, v1}, Ljava/util/Calendar;->get(I)I

    move-result v1

    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mSecond:I

    .line 154
    const/4 v1, 0x0

    iput v1, p0, Lcom/netease/inner/pushclient/NativePushData;->mRepeatMode:I

    .line 155
    return-void

    .line 146
    :cond_0
    invoke-static {}, Ljava/util/TimeZone;->getDefault()Ljava/util/TimeZone;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/util/Calendar;->setTimeZone(Ljava/util/TimeZone;)V

    goto :goto_0
.end method

.method public setTime(II)V
    .locals 1
    .param p1, "hour"    # I
    .param p2, "minute"    # I

    .prologue
    .line 110
    iput p1, p0, Lcom/netease/inner/pushclient/NativePushData;->mHour:I

    .line 111
    iput p2, p0, Lcom/netease/inner/pushclient/NativePushData;->mMinute:I

    .line 112
    const/4 v0, 0x0

    iput v0, p0, Lcom/netease/inner/pushclient/NativePushData;->mSecond:I

    .line 113
    return-void
.end method

.method public setTime(IILjava/lang/String;)V
    .locals 1
    .param p1, "hour"    # I
    .param p2, "minute"    # I
    .param p3, "tz"    # Ljava/lang/String;

    .prologue
    .line 116
    iput p1, p0, Lcom/netease/inner/pushclient/NativePushData;->mHour:I

    .line 117
    iput p2, p0, Lcom/netease/inner/pushclient/NativePushData;->mMinute:I

    .line 118
    const/4 v0, 0x0

    iput v0, p0, Lcom/netease/inner/pushclient/NativePushData;->mSecond:I

    .line 119
    iput-object p3, p0, Lcom/netease/inner/pushclient/NativePushData;->mTimeZone:Ljava/lang/String;

    .line 120
    return-void
.end method

.method public setWeekRepeat(I)V
    .locals 1
    .param p1, "weekMode"    # I

    .prologue
    .line 123
    sget-boolean v0, Lcom/netease/inner/pushclient/NativePushData;->$assertionsDisabled:Z

    if-nez v0, :cond_1

    if-lez p1, :cond_0

    const/16 v0, 0x7f

    if-le p1, v0, :cond_1

    :cond_0
    new-instance v0, Ljava/lang/AssertionError;

    invoke-direct {v0}, Ljava/lang/AssertionError;-><init>()V

    throw v0

    .line 124
    :cond_1
    const/4 v0, 0x1

    iput v0, p0, Lcom/netease/inner/pushclient/NativePushData;->mRepeatMode:I

    .line 125
    iput p1, p0, Lcom/netease/inner/pushclient/NativePushData;->mMode:I

    .line 126
    return-void
.end method

.method public startAlarm(Landroid/content/Context;)V
    .locals 2
    .param p1, "context"    # Landroid/content/Context;

    .prologue
    .line 239
    invoke-virtual {p1}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {p0, v1}, Lcom/netease/inner/pushclient/NativePushData;->getNativeNotifyIntent(Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v0

    .line 240
    .local v0, "intent":Landroid/content/Intent;
    invoke-virtual {p0, p1, v0}, Lcom/netease/inner/pushclient/NativePushData;->startAlarm(Landroid/content/Context;Landroid/content/Intent;)V

    .line 241
    return-void
.end method

.method public startAlarm(Landroid/content/Context;Landroid/content/Intent;)V
    .locals 6
    .param p1, "context"    # Landroid/content/Context;
    .param p2, "intent"    # Landroid/content/Intent;

    .prologue
    .line 251
    iget v4, p0, Lcom/netease/inner/pushclient/NativePushData;->mPushID:I

    const/4 v5, 0x0

    invoke-static {p1, v4, p2, v5}, Landroid/app/PendingIntent;->getBroadcast(Landroid/content/Context;ILandroid/content/Intent;I)Landroid/app/PendingIntent;

    move-result-object v1

    .line 254
    .local v1, "pendingIntent":Landroid/app/PendingIntent;
    const-string v4, "alarm"

    invoke-virtual {p1, v4}, Landroid/content/Context;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Landroid/app/AlarmManager;

    .line 255
    .local v0, "alarmManager":Landroid/app/AlarmManager;
    invoke-virtual {p0}, Lcom/netease/inner/pushclient/NativePushData;->getTriggerAtMillis()J

    move-result-wide v2

    .line 256
    .local v2, "triggerAtMillis":J
    const-wide/16 v4, 0x0

    cmp-long v4, v2, v4

    if-lez v4, :cond_0

    .line 258
    const/4 v4, 0x2

    invoke-virtual {v0, v4, v2, v3, v1}, Landroid/app/AlarmManager;->set(IJLandroid/app/PendingIntent;)V

    .line 264
    :goto_0
    return-void

    .line 262
    :cond_0
    iget-object v4, p0, Lcom/netease/inner/pushclient/NativePushData;->mPushName:Ljava/lang/String;

    invoke-static {p1, v4}, Lcom/netease/push/utils/PushSetting;->rmNativePushNames(Landroid/content/Context;Ljava/lang/String;)V

    goto :goto_0
.end method

.method public startAlarm(Landroid/content/Context;Ljava/lang/String;)V
    .locals 1
    .param p1, "context"    # Landroid/content/Context;
    .param p2, "packageName"    # Ljava/lang/String;

    .prologue
    .line 245
    invoke-virtual {p0, p2}, Lcom/netease/inner/pushclient/NativePushData;->getNativeNotifyIntent(Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v0

    .line 246
    .local v0, "intent":Landroid/content/Intent;
    invoke-virtual {p0, p1, v0}, Lcom/netease/inner/pushclient/NativePushData;->startAlarm(Landroid/content/Context;Landroid/content/Intent;)V

    .line 247
    return-void
.end method

.method public stopAlarm(Landroid/content/Context;)V
    .locals 5
    .param p1, "context"    # Landroid/content/Context;

    .prologue
    .line 267
    invoke-virtual {p1}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {p0, v3}, Lcom/netease/inner/pushclient/NativePushData;->getNativeNotifyIntent(Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v1

    .line 268
    .local v1, "intent":Landroid/content/Intent;
    iget v3, p0, Lcom/netease/inner/pushclient/NativePushData;->mPushID:I

    const/4 v4, 0x0

    invoke-static {p1, v3, v1, v4}, Landroid/app/PendingIntent;->getBroadcast(Landroid/content/Context;ILandroid/content/Intent;I)Landroid/app/PendingIntent;

    move-result-object v2

    .line 269
    .local v2, "pendingIntent":Landroid/app/PendingIntent;
    const-string v3, "alarm"

    invoke-virtual {p1, v3}, Landroid/content/Context;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Landroid/app/AlarmManager;

    .line 270
    .local v0, "alarmManager":Landroid/app/AlarmManager;
    invoke-virtual {v0, v2}, Landroid/app/AlarmManager;->cancel(Landroid/app/PendingIntent;)V

    .line 271
    return-void
.end method

.method public writeToJsonString()Ljava/lang/String;
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Lorg/json/JSONException;
        }
    .end annotation

    .prologue
    .line 275
    new-instance v0, Lorg/json/JSONObject;

    invoke-direct {v0}, Lorg/json/JSONObject;-><init>()V

    .line 277
    .local v0, "jsonObject":Lorg/json/JSONObject;
    iget-object v2, p0, Lcom/netease/inner/pushclient/NativePushData;->mNotifyMessage:Lcom/netease/push/utils/NotifyMessage;

    invoke-virtual {v2}, Lcom/netease/push/utils/NotifyMessage;->writeToJsonString()Ljava/lang/String;

    move-result-object v1

    .line 278
    .local v1, "sMessage":Ljava/lang/String;
    const-string v2, "notify"

    invoke-virtual {v0, v2, v1}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 279
    const-string v2, "repeat"

    iget v3, p0, Lcom/netease/inner/pushclient/NativePushData;->mRepeatMode:I

    invoke-virtual {v0, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;I)Lorg/json/JSONObject;

    .line 280
    const-string v2, "mode"

    iget v3, p0, Lcom/netease/inner/pushclient/NativePushData;->mMode:I

    invoke-virtual {v0, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;I)Lorg/json/JSONObject;

    .line 281
    const-string v2, "year"

    iget v3, p0, Lcom/netease/inner/pushclient/NativePushData;->mYear:I

    invoke-virtual {v0, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;I)Lorg/json/JSONObject;

    .line 282
    const-string v2, "month"

    iget v3, p0, Lcom/netease/inner/pushclient/NativePushData;->mMonth:I

    invoke-virtual {v0, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;I)Lorg/json/JSONObject;

    .line 283
    const-string v2, "day"

    iget v3, p0, Lcom/netease/inner/pushclient/NativePushData;->mDay:I

    invoke-virtual {v0, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;I)Lorg/json/JSONObject;

    .line 284
    const-string v2, "hour"

    iget v3, p0, Lcom/netease/inner/pushclient/NativePushData;->mHour:I

    invoke-virtual {v0, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;I)Lorg/json/JSONObject;

    .line 285
    const-string v2, "min"

    iget v3, p0, Lcom/netease/inner/pushclient/NativePushData;->mMinute:I

    invoke-virtual {v0, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;I)Lorg/json/JSONObject;

    .line 286
    const-string v2, "sec"

    iget v3, p0, Lcom/netease/inner/pushclient/NativePushData;->mSecond:I

    invoke-virtual {v0, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;I)Lorg/json/JSONObject;

    .line 287
    const-string v2, "pushid"

    iget v3, p0, Lcom/netease/inner/pushclient/NativePushData;->mPushID:I

    invoke-virtual {v0, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;I)Lorg/json/JSONObject;

    .line 289
    invoke-virtual {v0}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object v2

    return-object v2
.end method
