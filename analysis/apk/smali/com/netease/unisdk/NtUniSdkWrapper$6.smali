.class final Lcom/netease/unisdk/NtUniSdkWrapper$6;
.super Ljava/lang/Object;
.source "NtUniSdkWrapper.java"

# interfaces
.implements Lcom/netease/ntunisdk/base/QueryFriendListener;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/netease/unisdk/NtUniSdkWrapper;->ntInitCallback()V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x8
    name = null
.end annotation


# direct methods
.method constructor <init>()V
    .locals 0

    .prologue
    .line 98
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public onApplyFriendFinished(Z)V
    .locals 0
    .param p1, "arg0"    # Z

    .prologue
    .line 104
    return-void
.end method

.method public onInviteFriendListFinished(Ljava/util/List;)V
    .locals 0
    .param p1, "arg0"    # Ljava/util/List;

    .prologue
    .line 139
    return-void
.end method

.method public onInviterListFinished(Ljava/util/List;)V
    .locals 0
    .param p1, "arg0"    # Ljava/util/List;

    .prologue
    .line 144
    return-void
.end method

.method public onIsDarenUpdated(Z)V
    .locals 3
    .param p1, "status"    # Z

    .prologue
    .line 109
    const-string v0, "NtUniSdk"

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v2, "onIsDarenUpdated -> "

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(Z)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 110
    return-void
.end method

.method public onQueryAvailablesInviteesFinished(Ljava/util/List;)V
    .locals 0
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/List",
            "<",
            "Lcom/netease/ntunisdk/base/AccountInfo;",
            ">;)V"
        }
    .end annotation

    .prologue
    .line 116
    .local p1, "arg0":Ljava/util/List;, "Ljava/util/List<Lcom/netease/ntunisdk/base/AccountInfo;>;"
    return-void
.end method

.method public onQueryFriendListFinished(Ljava/util/List;)V
    .locals 0
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/List",
            "<",
            "Lcom/netease/ntunisdk/base/AccountInfo;",
            ">;)V"
        }
    .end annotation

    .prologue
    .line 122
    .local p1, "arg0":Ljava/util/List;, "Ljava/util/List<Lcom/netease/ntunisdk/base/AccountInfo;>;"
    return-void
.end method

.method public onQueryFriendListInGameFinished(Ljava/util/List;)V
    .locals 0
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/List",
            "<",
            "Lcom/netease/ntunisdk/base/AccountInfo;",
            ">;)V"
        }
    .end annotation

    .prologue
    .line 128
    .local p1, "arg0":Ljava/util/List;, "Ljava/util/List<Lcom/netease/ntunisdk/base/AccountInfo;>;"
    return-void
.end method

.method public onQueryMyAccountFinished(Lcom/netease/ntunisdk/base/AccountInfo;)V
    .locals 0
    .param p1, "arg0"    # Lcom/netease/ntunisdk/base/AccountInfo;

    .prologue
    .line 134
    return-void
.end method
