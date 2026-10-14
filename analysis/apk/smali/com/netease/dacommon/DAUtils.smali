.class public Lcom/netease/dacommon/DAUtils;
.super Ljava/lang/Object;
.source "DAUtils.java"


# instance fields
.field private m_activity:Landroid/app/Activity;

.field private m_context:Landroid/content/Context;

.field private m_danotification:Lcom/netease/dacommon/DANotification;


# direct methods
.method public constructor <init>()V
    .locals 0

    .prologue
    .line 6
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public init(Landroid/content/Context;)V
    .locals 2
    .param p1, "ctx"    # Landroid/content/Context;

    .prologue
    .line 12
    iput-object p1, p0, Lcom/netease/dacommon/DAUtils;->m_context:Landroid/content/Context;

    move-object v1, p1

    .line 13
    check-cast v1, Landroid/app/Activity;

    iput-object v1, p0, Lcom/netease/dacommon/DAUtils;->m_activity:Landroid/app/Activity;

    .line 15
    iget-object v1, p0, Lcom/netease/dacommon/DAUtils;->m_context:Landroid/content/Context;

    invoke-static {v1}, Lcom/netease/dacommon/AppParams;->init(Landroid/content/Context;)V

    .line 17
    invoke-static {}, Lcom/netease/dacommon/AppErrorReport;->getInstance()Lcom/netease/dacommon/AppErrorReport;

    move-result-object v0

    .line 18
    .local v0, "appErrorReport":Lcom/netease/dacommon/AppErrorReport;
    iget-object v1, p0, Lcom/netease/dacommon/DAUtils;->m_context:Landroid/content/Context;

    invoke-virtual {v0, v1}, Lcom/netease/dacommon/AppErrorReport;->init(Landroid/content/Context;)V

    .line 20
    new-instance v1, Lcom/netease/dacommon/DANotification;

    invoke-direct {v1}, Lcom/netease/dacommon/DANotification;-><init>()V

    iput-object v1, p0, Lcom/netease/dacommon/DAUtils;->m_danotification:Lcom/netease/dacommon/DANotification;

    .line 21
    invoke-static {p1}, Lcom/netease/dacommon/DANotification;->init(Landroid/content/Context;)V

    .line 23
    iget-object v1, p0, Lcom/netease/dacommon/DAUtils;->m_activity:Landroid/app/Activity;

    invoke-static {v1}, Lcom/netease/dacommon/SocialHelper;->init(Landroid/app/Activity;)V

    .line 24
    return-void
.end method
