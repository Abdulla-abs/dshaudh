.class public Lcom/netease/dacommon/UpdateAPK;
.super Ljava/lang/Object;
.source "UpdateAPK.java"


# static fields
.field private static m_context:Landroid/app/Activity;

.field public static m_param:Ljava/lang/String;


# direct methods
.method public constructor <init>()V
    .locals 0

    .prologue
    .line 9
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method static synthetic access$000()Landroid/app/Activity;
    .locals 1

    .prologue
    .line 9
    sget-object v0, Lcom/netease/dacommon/UpdateAPK;->m_context:Landroid/app/Activity;

    return-object v0
.end method

.method public static moveToGooglePlayCommon(Ljava/lang/String;)V
    .locals 2
    .param p0, "param"    # Ljava/lang/String;

    .prologue
    .line 20
    sput-object p0, Lcom/netease/dacommon/UpdateAPK;->m_param:Ljava/lang/String;

    .line 21
    const-string v0, "long ke"

    const-string v1, "thanks for your help."

    invoke-static {v0, v1}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 22
    sget-object v0, Lcom/netease/dacommon/UpdateAPK;->m_context:Landroid/app/Activity;

    new-instance v1, Lcom/netease/dacommon/UpdateAPK$1;

    invoke-direct {v1}, Lcom/netease/dacommon/UpdateAPK$1;-><init>()V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 44
    return-void
.end method


# virtual methods
.method public init(Landroid/app/Activity;)V
    .locals 0
    .param p1, "ctx"    # Landroid/app/Activity;

    .prologue
    .line 14
    sput-object p1, Lcom/netease/dacommon/UpdateAPK;->m_context:Landroid/app/Activity;

    .line 15
    return-void
.end method
