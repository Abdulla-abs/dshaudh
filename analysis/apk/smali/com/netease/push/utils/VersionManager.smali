.class public Lcom/netease/push/utils/VersionManager;
.super Ljava/lang/Object;
.source "VersionManager.java"


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Lcom/netease/push/utils/VersionManager$VersionInfo;
    }
.end annotation


# direct methods
.method public constructor <init>()V
    .locals 0

    .prologue
    .line 26
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public static getNewestInstallVersion(Landroid/content/Context;)Lcom/netease/push/utils/VersionManager$VersionInfo;
    .locals 10
    .param p0, "context"    # Landroid/content/Context;

    .prologue
    .line 39
    const/4 v1, 0x0

    .line 40
    .local v1, "newVerCode":I
    const-string v0, ""

    .line 42
    .local v0, "newPackage":Ljava/lang/String;
    new-instance v5, Landroid/content/Intent;

    const-string v8, "com.netease.push.action.service.PUSHSERVICE"

    invoke-direct {v5, v8}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V

    .line 43
    .local v5, "serviceIntent":Landroid/content/Intent;
    invoke-virtual {p0}, Landroid/content/Context;->getPackageManager()Landroid/content/pm/PackageManager;

    move-result-object v8

    const/4 v9, 0x0

    invoke-virtual {v8, v5, v9}, Landroid/content/pm/PackageManager;->queryIntentServices(Landroid/content/Intent;I)Ljava/util/List;

    move-result-object v2

    .line 44
    .local v2, "packageList":Ljava/util/List;, "Ljava/util/List<Landroid/content/pm/ResolveInfo;>;"
    invoke-interface {v2}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v8

    :cond_0
    :goto_0
    invoke-interface {v8}, Ljava/util/Iterator;->hasNext()Z

    move-result v9

    if-nez v9, :cond_1

    .line 52
    if-nez v1, :cond_2

    .line 53
    const/4 v7, 0x0

    .line 56
    :goto_1
    return-object v7

    .line 44
    :cond_1
    invoke-interface {v8}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v4

    check-cast v4, Landroid/content/pm/ResolveInfo;

    .line 45
    .local v4, "resolveInfo":Landroid/content/pm/ResolveInfo;
    iget-object v9, v4, Landroid/content/pm/ResolveInfo;->serviceInfo:Landroid/content/pm/ServiceInfo;

    iget-object v3, v9, Landroid/content/pm/ServiceInfo;->packageName:Ljava/lang/String;

    .line 46
    .local v3, "packageName":Ljava/lang/String;
    invoke-static {p0, v3}, Lcom/netease/push/utils/PushSetting;->getOtherPkgVerCode(Landroid/content/Context;Ljava/lang/String;)I

    move-result v6

    .line 47
    .local v6, "verCode":I
    if-lt v6, v1, :cond_0

    .line 48
    move v1, v6

    .line 49
    move-object v0, v3

    goto :goto_0

    .line 55
    .end local v3    # "packageName":Ljava/lang/String;
    .end local v4    # "resolveInfo":Landroid/content/pm/ResolveInfo;
    .end local v6    # "verCode":I
    :cond_2
    new-instance v7, Lcom/netease/push/utils/VersionManager$VersionInfo;

    invoke-direct {v7, v1, v0}, Lcom/netease/push/utils/VersionManager$VersionInfo;-><init>(ILjava/lang/String;)V

    .line 56
    .local v7, "versionInfo":Lcom/netease/push/utils/VersionManager$VersionInfo;
    goto :goto_1
.end method
