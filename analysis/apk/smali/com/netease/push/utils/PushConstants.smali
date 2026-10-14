.class public Lcom/netease/push/utils/PushConstants;
.super Ljava/lang/Object;
.source "PushConstants.java"


# static fields
.field static final synthetic $assertionsDisabled:Z

.field public static final ACTION_HEAD:Ljava/lang/String; = "com.netease.push.action."

.field public static final ANDROIR_PUHS_TAG:Ljava/lang/String; = "AndroidPush"

.field public static final CLIENT_ACTION_HEAD:Ljava/lang/String; = "com.netease.push.action.client."

.field public static final CLIENT_ACTION_MESSAGE:Ljava/lang/String; = "com.netease.push.action.client.MESSAGE"

.field public static final CLIENT_ACTION_METHOD:Ljava/lang/String; = "com.netease.push.action.client.METHOD"

.field public static final CLIENT_ACTION_NOTIFICATION_CLICK:Ljava/lang/String; = "com.netease.push.action.client.NOTIFICATION_CLICK"

.field public static final CLIENT_ACTION_REFRESH_DEVID:Ljava/lang/String; = "com.netease.push.action.client.NEWID"

.field public static final CLIENT_MESSAGE_VER:I = 0x1

.field public static final CLIENT_METHOD_NATIVENOTIFY:Ljava/lang/String; = "nativenotify"

.field public static final CLIENT_METHOD_ONBIND:Ljava/lang/String; = "onbind"

.field public static final CLIENT_METHOD_ONUNBIND:Ljava/lang/String; = "onunbind"

.field public static final CLIENT_METHOD_VER:I = 0x1

.field public static final CLIENT_NEWID_VER:I = 0x1

.field public static final EVERYDAY:I = 0x7f

.field public static final FRIDAY:I = 0x10

.field public static final HEAD:Ljava/lang/String; = "com.netease.push."

.field public static final INTENT_DEVID_NAME:Ljava/lang/String; = "devid"

.field public static final INTENT_FLAG_NAME:Ljava/lang/String; = "flag"

.field public static final INTENT_LASTTIME_NAME:Ljava/lang/String; = "lasttime"

.field public static final INTENT_MESSAGE_NAME:Ljava/lang/String; = "message"

.field public static final INTENT_METHOD_NAME:Ljava/lang/String; = "method"

.field public static final INTENT_PACKAGE_NAME:Ljava/lang/String; = "package"

.field public static final INTENT_PUSH_NAME:Ljava/lang/String; = "pushname"

.field public static final JAR_VER_CODE:I = 0x8

.field public static final MAX_ALARM_COUNT:I = 0x32

.field public static final MAX_RECONNECT_COUNT:I = 0x7

.field public static final MESSAGE_CONTENT:Ljava/lang/String; = "content"

.field public static final MESSAGE_EXT:Ljava/lang/String; = "ext"

.field public static final MESSAGE_TITLE:Ljava/lang/String; = "title"

.field public static final MESSAGE_VER_NAME:Ljava/lang/String; = "message_ver"

.field public static final METHOD_VER_NAME:Ljava/lang/String; = "method_ver"

.field public static final MONDAY:I = 0x1

.field public static final NEWID_VER_NAME:Ljava/lang/String; = "newid_ver"

.field public static final NOTIFICATION_EXT:Ljava/lang/String; = "NOTIFICATION_EXT"

.field public static final NOTIFICATION_MESSAGE:Ljava/lang/String; = "NOTIFICATION_MESSAGE"

.field public static final NOTIFICATION_NOTIFYID:Ljava/lang/String; = "NOTIFICATION_NOTIFYID"

.field public static final NOTIFICATION_TITLE:Ljava/lang/String; = "NOTIFICATION_TITLE"

.field public static final NOTIFICATION_URI:Ljava/lang/String; = "NOTIFICATION_URI"

.field public static final SATURDAY:I = 0x20

.field public static final SERVICE_ACTION:Ljava/lang/String; = "com.netease.push.action.service.PUSHSERVICE"

.field public static final SERVICE_ACTION_HEAD:Ljava/lang/String; = "com.netease.push.action.service."

.field public static final SERVICE_ACTION_METHOD:Ljava/lang/String; = "com.netease.push.action.service.METHOD"

.field public static final SERVICE_METHOD_NATIVENOTIFY:Ljava/lang/String; = "nativenotify"

.field public static final SERVICE_METHOD_NETWORKCONNECT:Ljava/lang/String; = "networkconnect"

.field public static final SERVICE_METHOD_NETWORKDISCONNECT:Ljava/lang/String; = "networkdisconnect"

.field public static final SERVICE_METHOD_REGISTER:Ljava/lang/String; = "register"

.field public static final SERVICE_METHOD_REMOVEAPP:Ljava/lang/String; = "removeapp"

.field public static final SERVICE_METHOD_REPEATPROTECT:Ljava/lang/String; = "setrepeatprotect"

.field public static final SERVICE_METHOD_RESTART:Ljava/lang/String; = "restart"

.field public static final SERVICE_METHOD_SETSOUND:Ljava/lang/String; = "setsound"

.field public static final SERVICE_METHOD_SETVIBRATE:Ljava/lang/String; = "setvibrate"

.field public static final SERVICE_METHOD_STOP:Ljava/lang/String; = "stopservice"

.field public static final SERVICE_METHOD_TIME_TICK:Ljava/lang/String; = "time_tick"

.field public static final SERVICE_METHOD_VER:I = 0x1

.field public static final SUNDAY:I = 0x40

.field public static final THURSDAY:I = 0x8

.field public static final TUESDAY:I = 0x2

.field public static final WEDNESDAY:I = 0x4

.field public static final WEEKEND:I = 0x60

.field public static final WORKDAY:I = 0x1f


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .prologue
    .line 20
    const-class v0, Lcom/netease/push/utils/PushConstants;

    invoke-virtual {v0}, Ljava/lang/Class;->desiredAssertionStatus()Z

    move-result v0

    if-nez v0, :cond_0

    const/4 v0, 0x1

    :goto_0
    sput-boolean v0, Lcom/netease/push/utils/PushConstants;->$assertionsDisabled:Z

    .line 105
    return-void

    .line 20
    :cond_0
    const/4 v0, 0x0

    goto :goto_0
.end method

.method public constructor <init>()V
    .locals 0

    .prologue
    .line 20
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public static MONTH_DAY(I)I
    .locals 2
    .param p0, "day"    # I

    .prologue
    .line 113
    sget-boolean v0, Lcom/netease/push/utils/PushConstants;->$assertionsDisabled:Z

    if-nez v0, :cond_1

    if-lez p0, :cond_0

    const/16 v0, 0x20

    if-lt p0, v0, :cond_1

    :cond_0
    new-instance v0, Ljava/lang/AssertionError;

    invoke-direct {v0}, Ljava/lang/AssertionError;-><init>()V

    throw v0

    .line 114
    :cond_1
    const/4 v0, 0x1

    add-int/lit8 v1, p0, -0x1

    shl-int/2addr v0, v1

    return v0
.end method

.method public static MONTH_DAY_RANGE(II)I
    .locals 4
    .param p0, "from"    # I
    .param p1, "to"    # I

    .prologue
    const/16 v3, 0x20

    const/4 v2, 0x1

    .line 123
    sget-boolean v1, Lcom/netease/push/utils/PushConstants;->$assertionsDisabled:Z

    if-nez v1, :cond_1

    if-lez p0, :cond_0

    if-lt p0, v3, :cond_1

    :cond_0
    new-instance v1, Ljava/lang/AssertionError;

    invoke-direct {v1}, Ljava/lang/AssertionError;-><init>()V

    throw v1

    .line 124
    :cond_1
    sget-boolean v1, Lcom/netease/push/utils/PushConstants;->$assertionsDisabled:Z

    if-nez v1, :cond_3

    if-lez p1, :cond_2

    if-lt p1, v3, :cond_3

    :cond_2
    new-instance v1, Ljava/lang/AssertionError;

    invoke-direct {v1}, Ljava/lang/AssertionError;-><init>()V

    throw v1

    .line 125
    :cond_3
    sget-boolean v1, Lcom/netease/push/utils/PushConstants;->$assertionsDisabled:Z

    if-nez v1, :cond_4

    if-lt p0, p1, :cond_4

    new-instance v1, Ljava/lang/AssertionError;

    invoke-direct {v1}, Ljava/lang/AssertionError;-><init>()V

    throw v1

    .line 126
    :cond_4
    const/16 v1, 0x1f

    if-ne p1, v1, :cond_5

    const v0, 0x7fffffff

    .line 127
    .local v0, "tmp":I
    :goto_0
    add-int/lit8 v1, p0, -0x1

    shl-int v1, v2, v1

    add-int/lit8 v1, v1, -0x1

    sub-int v1, v0, v1

    return v1

    .line 126
    .end local v0    # "tmp":I
    :cond_5
    shl-int v1, v2, p1

    add-int/lit8 v0, v1, -0x1

    goto :goto_0
.end method
