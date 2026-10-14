.class public Lcom/netease/push/utils/VersionManager$VersionInfo;
.super Ljava/lang/Object;
.source "VersionManager.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/netease/push/utils/VersionManager;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x9
    name = "VersionInfo"
.end annotation


# instance fields
.field public mPackageName:Ljava/lang/String;

.field public mVersionCode:I


# direct methods
.method public constructor <init>(ILjava/lang/String;)V
    .locals 1
    .param p1, "versionCode"    # I
    .param p2, "packageName"    # Ljava/lang/String;

    .prologue
    .line 32
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 29
    const/4 v0, 0x0

    iput v0, p0, Lcom/netease/push/utils/VersionManager$VersionInfo;->mVersionCode:I

    .line 30
    const-string v0, ""

    iput-object v0, p0, Lcom/netease/push/utils/VersionManager$VersionInfo;->mPackageName:Ljava/lang/String;

    .line 33
    iput p1, p0, Lcom/netease/push/utils/VersionManager$VersionInfo;->mVersionCode:I

    .line 34
    iput-object p2, p0, Lcom/netease/push/utils/VersionManager$VersionInfo;->mPackageName:Ljava/lang/String;

    .line 35
    return-void
.end method
