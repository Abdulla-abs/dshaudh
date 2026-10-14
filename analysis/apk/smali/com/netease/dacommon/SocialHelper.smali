.class public Lcom/netease/dacommon/SocialHelper;
.super Ljava/lang/Object;
.source "SocialHelper.java"


# static fields
.field public static final CLASS_NAME:Ljava/lang/String; = "jp.naver.line.android.activity.selectchat.SelectChatActivity"

.field static final LINE_PACKAGE_NAME:Ljava/lang/String; = "jp.naver.line.android"

.field private static m_context:Landroid/app/Activity;

.field public static m_msg:Ljava/lang/String;


# direct methods
.method public constructor <init>()V
    .locals 0

    .prologue
    .line 11
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method static synthetic access$000()Landroid/app/Activity;
    .locals 1

    .prologue
    .line 11
    sget-object v0, Lcom/netease/dacommon/SocialHelper;->m_context:Landroid/app/Activity;

    return-object v0
.end method

.method public static checkLineInstalled()Z
    .locals 7

    .prologue
    .line 24
    sget-object v5, Lcom/netease/dacommon/SocialHelper;->m_context:Landroid/app/Activity;

    invoke-virtual {v5}, Landroid/app/Activity;->getPackageManager()Landroid/content/pm/PackageManager;

    move-result-object v4

    .line 25
    .local v4, "pm":Landroid/content/pm/PackageManager;
    const/4 v5, 0x0

    invoke-virtual {v4, v5}, Landroid/content/pm/PackageManager;->getInstalledApplications(I)Ljava/util/List;

    move-result-object v3

    .line 26
    .local v3, "m_appList":Ljava/util/List;, "Ljava/util/List<Landroid/content/pm/ApplicationInfo;>;"
    const/4 v2, 0x0

    .line 27
    .local v2, "lineInstallFlag":Z
    invoke-interface {v3}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v1

    .local v1, "i$":Ljava/util/Iterator;
    :cond_0
    invoke-interface {v1}, Ljava/util/Iterator;->hasNext()Z

    move-result v5

    if-eqz v5, :cond_1

    invoke-interface {v1}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Landroid/content/pm/ApplicationInfo;

    .line 29
    .local v0, "ai":Landroid/content/pm/ApplicationInfo;
    iget-object v5, v0, Landroid/content/pm/ApplicationInfo;->packageName:Ljava/lang/String;

    const-string v6, "jp.naver.line.android"

    invoke-virtual {v5, v6}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5

    if-eqz v5, :cond_0

    .line 31
    const/4 v2, 0x1

    .line 35
    .end local v0    # "ai":Landroid/content/pm/ApplicationInfo;
    :cond_1
    return v2
.end method

.method public static init(Landroid/app/Activity;)V
    .locals 0
    .param p0, "c"    # Landroid/app/Activity;

    .prologue
    .line 18
    sput-object p0, Lcom/netease/dacommon/SocialHelper;->m_context:Landroid/app/Activity;

    .line 19
    return-void
.end method

.method public static shareMsgToLine(Ljava/lang/String;)V
    .locals 2
    .param p0, "msg"    # Ljava/lang/String;

    .prologue
    .line 42
    sput-object p0, Lcom/netease/dacommon/SocialHelper;->m_msg:Ljava/lang/String;

    .line 43
    sget-object v0, Lcom/netease/dacommon/SocialHelper;->m_context:Landroid/app/Activity;

    new-instance v1, Lcom/netease/dacommon/SocialHelper$1;

    invoke-direct {v1}, Lcom/netease/dacommon/SocialHelper$1;-><init>()V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 56
    return-void
.end method
