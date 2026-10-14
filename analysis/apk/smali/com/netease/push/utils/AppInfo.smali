.class public Lcom/netease/push/utils/AppInfo;
.super Ljava/lang/Object;
.source "AppInfo.java"


# static fields
.field public static final DEFAULT_FIRST_START:Z = true

.field public static final DEFAULT_RECEIVE_TIME:J = 0x0L

.field public static final DEFAULT_REPEAT_PROTECT:Z = false

.field public static final DEFAULT_SOUND:Z = false

.field public static final DEFAULT_VIBREATE:Z = true

.field private static final MAX_SECOND:I = 0x12c


# instance fields
.field public mLastReceiveTime:J

.field public mPackageName:Ljava/lang/String;

.field public mbEnableSound:Z

.field public mbEnableVibrate:Z

.field public mbFirstStart:Z

.field public mbRepeatProtect:Z

.field private messageList:Ljava/util/LinkedList;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/LinkedList",
            "<",
            "Lcom/netease/push/proto/ProtoClientWrapper$Message;",
            ">;"
        }
    .end annotation
.end field


# direct methods
.method public constructor <init>()V
    .locals 3

    .prologue
    const/4 v2, 0x1

    const/4 v1, 0x0

    .line 43
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 27
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/utils/AppInfo;->mPackageName:Ljava/lang/String;

    .line 28
    iput-boolean v1, p0, Lcom/netease/push/utils/AppInfo;->mbEnableSound:Z

    .line 29
    iput-boolean v2, p0, Lcom/netease/push/utils/AppInfo;->mbEnableVibrate:Z

    .line 32
    iput-boolean v1, p0, Lcom/netease/push/utils/AppInfo;->mbRepeatProtect:Z

    .line 34
    iput-boolean v2, p0, Lcom/netease/push/utils/AppInfo;->mbFirstStart:Z

    .line 35
    const-wide/16 v0, 0x0

    iput-wide v0, p0, Lcom/netease/push/utils/AppInfo;->mLastReceiveTime:J

    .line 60
    const/4 v0, 0x0

    iput-object v0, p0, Lcom/netease/push/utils/AppInfo;->messageList:Ljava/util/LinkedList;

    .line 44
    invoke-virtual {p0}, Lcom/netease/push/utils/AppInfo;->clear()V

    .line 45
    return-void
.end method

.method public constructor <init>(Ljava/lang/String;)V
    .locals 3
    .param p1, "packageName"    # Ljava/lang/String;

    .prologue
    const/4 v2, 0x1

    const/4 v1, 0x0

    .line 47
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 27
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/utils/AppInfo;->mPackageName:Ljava/lang/String;

    .line 28
    iput-boolean v1, p0, Lcom/netease/push/utils/AppInfo;->mbEnableSound:Z

    .line 29
    iput-boolean v2, p0, Lcom/netease/push/utils/AppInfo;->mbEnableVibrate:Z

    .line 32
    iput-boolean v1, p0, Lcom/netease/push/utils/AppInfo;->mbRepeatProtect:Z

    .line 34
    iput-boolean v2, p0, Lcom/netease/push/utils/AppInfo;->mbFirstStart:Z

    .line 35
    const-wide/16 v0, 0x0

    iput-wide v0, p0, Lcom/netease/push/utils/AppInfo;->mLastReceiveTime:J

    .line 60
    const/4 v0, 0x0

    iput-object v0, p0, Lcom/netease/push/utils/AppInfo;->messageList:Ljava/util/LinkedList;

    .line 48
    iput-object p1, p0, Lcom/netease/push/utils/AppInfo;->mPackageName:Ljava/lang/String;

    .line 49
    invoke-virtual {p0}, Lcom/netease/push/utils/AppInfo;->clear()V

    .line 50
    return-void
.end method


# virtual methods
.method public clear()V
    .locals 2

    .prologue
    const/4 v1, 0x1

    const/4 v0, 0x0

    .line 53
    iput-boolean v0, p0, Lcom/netease/push/utils/AppInfo;->mbEnableSound:Z

    .line 54
    iput-boolean v1, p0, Lcom/netease/push/utils/AppInfo;->mbEnableVibrate:Z

    .line 55
    iput-boolean v0, p0, Lcom/netease/push/utils/AppInfo;->mbRepeatProtect:Z

    .line 56
    iput-boolean v1, p0, Lcom/netease/push/utils/AppInfo;->mbFirstStart:Z

    .line 57
    const-wide/16 v0, 0x0

    iput-wide v0, p0, Lcom/netease/push/utils/AppInfo;->mLastReceiveTime:J

    .line 58
    return-void
.end method

.method public filterMessage(Lcom/netease/push/proto/ProtoClientWrapper$Message;)Z
    .locals 10
    .param p1, "insertMessage"    # Lcom/netease/push/proto/ProtoClientWrapper$Message;

    .prologue
    .line 64
    const/4 v0, 0x0

    .line 65
    .local v0, "bFilter":Z
    iget-boolean v6, p0, Lcom/netease/push/utils/AppInfo;->mbRepeatProtect:Z

    if-eqz v6, :cond_3

    .line 67
    iget-object v6, p0, Lcom/netease/push/utils/AppInfo;->messageList:Ljava/util/LinkedList;

    if-nez v6, :cond_0

    .line 68
    new-instance v6, Ljava/util/LinkedList;

    invoke-direct {v6}, Ljava/util/LinkedList;-><init>()V

    iput-object v6, p0, Lcom/netease/push/utils/AppInfo;->messageList:Ljava/util/LinkedList;

    .line 71
    :cond_0
    const/4 v5, 0x0

    .line 72
    .local v5, "removeCount":I
    iget-wide v6, p1, Lcom/netease/push/proto/ProtoClientWrapper$Message;->time:J

    const-wide/16 v8, 0x12c

    sub-long v1, v6, v8

    .line 73
    .local v1, "borderTime":J
    iget-object v6, p0, Lcom/netease/push/utils/AppInfo;->messageList:Ljava/util/LinkedList;

    invoke-virtual {v6}, Ljava/util/LinkedList;->iterator()Ljava/util/Iterator;

    move-result-object v6

    :cond_1
    :goto_0
    invoke-interface {v6}, Ljava/util/Iterator;->hasNext()Z

    move-result v7

    if-nez v7, :cond_4

    .line 86
    :goto_1
    if-nez v0, :cond_2

    .line 87
    iget-object v6, p0, Lcom/netease/push/utils/AppInfo;->messageList:Ljava/util/LinkedList;

    invoke-virtual {v6, p1}, Ljava/util/LinkedList;->add(Ljava/lang/Object;)Z

    .line 90
    :cond_2
    const/4 v3, 0x0

    .local v3, "i":I
    :goto_2
    if-lt v3, v5, :cond_6

    .line 94
    .end local v1    # "borderTime":J
    .end local v3    # "i":I
    .end local v5    # "removeCount":I
    :cond_3
    return v0

    .line 73
    .restart local v1    # "borderTime":J
    .restart local v5    # "removeCount":I
    :cond_4
    invoke-interface {v6}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v4

    check-cast v4, Lcom/netease/push/proto/ProtoClientWrapper$Message;

    .line 74
    .local v4, "message":Lcom/netease/push/proto/ProtoClientWrapper$Message;
    iget-wide v7, v4, Lcom/netease/push/proto/ProtoClientWrapper$Message;->time:J

    cmp-long v7, v7, v1

    if-gez v7, :cond_5

    .line 75
    add-int/lit8 v5, v5, 0x1

    .line 76
    goto :goto_0

    .line 78
    :cond_5
    iget-object v7, v4, Lcom/netease/push/proto/ProtoClientWrapper$Message;->content:Ljava/lang/String;

    iget-object v8, p1, Lcom/netease/push/proto/ProtoClientWrapper$Message;->content:Ljava/lang/String;

    invoke-virtual {v7, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-eqz v7, :cond_1

    .line 79
    iget-object v7, v4, Lcom/netease/push/proto/ProtoClientWrapper$Message;->title:Ljava/lang/String;

    iget-object v8, p1, Lcom/netease/push/proto/ProtoClientWrapper$Message;->title:Ljava/lang/String;

    invoke-virtual {v7, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-eqz v7, :cond_1

    .line 80
    const/4 v0, 0x1

    .line 81
    goto :goto_1

    .line 91
    .end local v4    # "message":Lcom/netease/push/proto/ProtoClientWrapper$Message;
    .restart local v3    # "i":I
    :cond_6
    iget-object v6, p0, Lcom/netease/push/utils/AppInfo;->messageList:Ljava/util/LinkedList;

    invoke-virtual {v6}, Ljava/util/LinkedList;->removeFirst()Ljava/lang/Object;

    .line 90
    add-int/lit8 v3, v3, 0x1

    goto :goto_2
.end method
