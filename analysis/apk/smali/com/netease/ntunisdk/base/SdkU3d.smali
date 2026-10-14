.class public Lcom/netease/ntunisdk/base/SdkU3d;
.super Ljava/lang/Object;
.source "SdkU3d.java"

# interfaces
.implements Lcom/netease/ntunisdk/base/OnLoginDoneListener;
.implements Lcom/netease/ntunisdk/base/OnOrderCheckListener;
.implements Lcom/netease/ntunisdk/base/OnLogoutDoneListener;
.implements Lcom/netease/ntunisdk/base/OnLeaveSdkListener;
.implements Lcom/netease/ntunisdk/base/OnFinishInitListener;
.implements Lcom/netease/ntunisdk/base/OnContinueListener;
.implements Lcom/netease/ntunisdk/base/OnExitListener;
.implements Lcom/netease/ntunisdk/base/QueryFriendListener;
.implements Lcom/netease/ntunisdk/base/QueryRankListener;
.implements Lcom/netease/ntunisdk/base/OnShareListener;


# static fields
.field public static final CALLBACKTYPE_OnApplyFriend:Ljava/lang/String; = "OnApplyFriend"

.field public static final CALLBACKTYPE_OnContinue:Ljava/lang/String; = "OnContinue"

.field public static final CALLBACKTYPE_OnExitView:Ljava/lang/String; = "OnExitView"

.field public static final CALLBACKTYPE_OnExitViewFailed:Ljava/lang/String; = "OnExitViewFailed"

.field public static final CALLBACKTYPE_OnFinishInit:Ljava/lang/String; = "OnFinishInit"

.field public static final CALLBACKTYPE_OnIsDarenUpdated:Ljava/lang/String; = "OnIsDarenUpdated"

.field public static final CALLBACKTYPE_OnLeaveSdk:Ljava/lang/String; = "OnLeaveSdk"

.field public static final CALLBACKTYPE_OnLoginDone:Ljava/lang/String; = "OnLoginDone"

.field public static final CALLBACKTYPE_OnLogoutDone:Ljava/lang/String; = "onLogoutDone"

.field public static final CALLBACKTYPE_OnOrderCheck:Ljava/lang/String; = "OnOrderCheck"

.field public static final CALLBACKTYPE_OnQueryAvailablesInvitees:Ljava/lang/String; = "OnQueryAvailablesInvitees"

.field public static final CALLBACKTYPE_OnQueryFriendList:Ljava/lang/String; = "OnQueryFriendList"

.field public static final CALLBACKTYPE_OnQueryFriendListInGame:Ljava/lang/String; = "OnQueryFriendListInGame"

.field public static final CALLBACKTYPE_OnQueryMyAccount:Ljava/lang/String; = "OnQueryMyAccount"

.field public static final CALLBACKTYPE_OnQueryRank:Ljava/lang/String; = "OnQueryRank"

.field public static final CALLBACKTYPE_OnShare:Ljava/lang/String; = "OnShare"

.field private static final TAG:Ljava/lang/String; = "UniSDK SdkU3d"

.field private static U3DModuleName:Ljava/lang/String;

.field private static UnityPlayerClass:Ljava/lang/Class;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/lang/Class",
            "<*>;"
        }
    .end annotation
.end field

.field public static inst:Lcom/netease/ntunisdk/base/GamerInterface;

.field public static instU3d:Lcom/netease/ntunisdk/base/SdkU3d;


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .prologue
    const/4 v0, 0x0

    .line 19
    sput-object v0, Lcom/netease/ntunisdk/base/SdkU3d;->inst:Lcom/netease/ntunisdk/base/GamerInterface;

    .line 20
    sput-object v0, Lcom/netease/ntunisdk/base/SdkU3d;->UnityPlayerClass:Ljava/lang/Class;

    .line 22
    sput-object v0, Lcom/netease/ntunisdk/base/SdkU3d;->instU3d:Lcom/netease/ntunisdk/base/SdkU3d;

    .line 43
    const-string v0, "Main Camera"

    sput-object v0, Lcom/netease/ntunisdk/base/SdkU3d;->U3DModuleName:Ljava/lang/String;

    return-void
.end method

.method public constructor <init>()V
    .locals 0

    .prologue
    .line 15
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public static callback(Ljava/lang/String;ILjava/lang/Object;)V
    .locals 3
    .param p0, "callbackType"    # Ljava/lang/String;
    .param p1, "code"    # I
    .param p2, "data"    # Ljava/lang/Object;

    .prologue
    .line 203
    :try_start_0
    new-instance v1, Lorg/json/JSONObject;

    invoke-direct {v1}, Lorg/json/JSONObject;-><init>()V

    .line 204
    .local v1, "jobj":Lorg/json/JSONObject;
    const-string v2, "callbackType"

    invoke-virtual {v1, v2, p0}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 205
    const-string v2, "code"

    invoke-virtual {v1, v2, p1}, Lorg/json/JSONObject;->put(Ljava/lang/String;I)Lorg/json/JSONObject;

    .line 206
    const-string v2, "data"

    invoke-virtual {v1, v2, p2}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 208
    invoke-virtual {v1}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v2}, Lcom/netease/ntunisdk/base/SdkU3d;->unity3dSendMessage(Ljava/lang/String;)V
    :try_end_0
    .catch Ljava/lang/Throwable; {:try_start_0 .. :try_end_0} :catch_0

    .line 214
    .end local v1    # "jobj":Lorg/json/JSONObject;
    :goto_0
    return-void

    .line 210
    :catch_0
    move-exception v0

    .line 212
    .local v0, "e":Ljava/lang/Throwable;
    invoke-virtual {v0}, Ljava/lang/Throwable;->printStackTrace()V

    goto :goto_0
.end method

.method public static destroyInst()V
    .locals 1

    .prologue
    .line 96
    const/4 v0, 0x0

    sput-object v0, Lcom/netease/ntunisdk/base/SdkU3d;->inst:Lcom/netease/ntunisdk/base/GamerInterface;

    .line 97
    return-void
.end method

.method public static getInst()Lcom/netease/ntunisdk/base/GamerInterface;
    .locals 3
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/IllegalAccessException;,
            Ljava/lang/IllegalArgumentException;,
            Ljava/lang/NoSuchFieldException;,
            Ljava/lang/ClassNotFoundException;
        }
    .end annotation

    .prologue
    const/4 v2, 0x1

    .line 60
    sget-object v0, Lcom/netease/ntunisdk/base/SdkU3d;->inst:Lcom/netease/ntunisdk/base/GamerInterface;

    if-nez v0, :cond_0

    .line 62
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkU3d;->getUnityPlayerClass()Ljava/lang/Class;

    move-result-object v0

    const-string v1, "currentActivity"

    invoke-virtual {v0, v1}, Ljava/lang/Class;->getField(Ljava/lang/String;)Ljava/lang/reflect/Field;

    move-result-object v0

    const/4 v1, 0x0

    invoke-virtual {v0, v1}, Ljava/lang/reflect/Field;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Landroid/content/Context;

    invoke-static {v0}, Lcom/netease/ntunisdk/base/SdkMgr;->init(Landroid/content/Context;)V

    .line 63
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    sput-object v0, Lcom/netease/ntunisdk/base/SdkU3d;->inst:Lcom/netease/ntunisdk/base/GamerInterface;

    .line 64
    sget-object v0, Lcom/netease/ntunisdk/base/SdkU3d;->inst:Lcom/netease/ntunisdk/base/GamerInterface;

    const-string v1, "GAME_ENGINE"

    invoke-interface {v0, v1, v2}, Lcom/netease/ntunisdk/base/GamerInterface;->setPropInt(Ljava/lang/String;I)V

    .line 65
    sget-object v0, Lcom/netease/ntunisdk/base/SdkU3d;->inst:Lcom/netease/ntunisdk/base/GamerInterface;

    invoke-static {}, Lcom/netease/ntunisdk/base/SdkU3d;->getInstU3d()Lcom/netease/ntunisdk/base/SdkU3d;

    move-result-object v1

    invoke-interface {v0, v1, v2}, Lcom/netease/ntunisdk/base/GamerInterface;->setLoginListener(Lcom/netease/ntunisdk/base/OnLoginDoneListener;I)V

    .line 66
    sget-object v0, Lcom/netease/ntunisdk/base/SdkU3d;->inst:Lcom/netease/ntunisdk/base/GamerInterface;

    invoke-static {}, Lcom/netease/ntunisdk/base/SdkU3d;->getInstU3d()Lcom/netease/ntunisdk/base/SdkU3d;

    move-result-object v1

    invoke-interface {v0, v1, v2}, Lcom/netease/ntunisdk/base/GamerInterface;->setLogoutListener(Lcom/netease/ntunisdk/base/OnLogoutDoneListener;I)V

    .line 67
    sget-object v0, Lcom/netease/ntunisdk/base/SdkU3d;->inst:Lcom/netease/ntunisdk/base/GamerInterface;

    invoke-static {}, Lcom/netease/ntunisdk/base/SdkU3d;->getInstU3d()Lcom/netease/ntunisdk/base/SdkU3d;

    move-result-object v1

    invoke-interface {v0, v1, v2}, Lcom/netease/ntunisdk/base/GamerInterface;->setOrderListener(Lcom/netease/ntunisdk/base/OnOrderCheckListener;I)V

    .line 68
    sget-object v0, Lcom/netease/ntunisdk/base/SdkU3d;->inst:Lcom/netease/ntunisdk/base/GamerInterface;

    invoke-static {}, Lcom/netease/ntunisdk/base/SdkU3d;->getInstU3d()Lcom/netease/ntunisdk/base/SdkU3d;

    move-result-object v1

    invoke-interface {v0, v1, v2}, Lcom/netease/ntunisdk/base/GamerInterface;->setContinueListener(Lcom/netease/ntunisdk/base/OnContinueListener;I)V

    .line 69
    sget-object v0, Lcom/netease/ntunisdk/base/SdkU3d;->inst:Lcom/netease/ntunisdk/base/GamerInterface;

    invoke-static {}, Lcom/netease/ntunisdk/base/SdkU3d;->getInstU3d()Lcom/netease/ntunisdk/base/SdkU3d;

    move-result-object v1

    invoke-interface {v0, v1, v2}, Lcom/netease/ntunisdk/base/GamerInterface;->setExitListener(Lcom/netease/ntunisdk/base/OnExitListener;I)V

    .line 70
    sget-object v0, Lcom/netease/ntunisdk/base/SdkU3d;->inst:Lcom/netease/ntunisdk/base/GamerInterface;

    invoke-static {}, Lcom/netease/ntunisdk/base/SdkU3d;->getInstU3d()Lcom/netease/ntunisdk/base/SdkU3d;

    move-result-object v1

    invoke-interface {v0, v1, v2}, Lcom/netease/ntunisdk/base/GamerInterface;->setQueryFriendListener(Lcom/netease/ntunisdk/base/QueryFriendListener;I)V

    .line 71
    sget-object v0, Lcom/netease/ntunisdk/base/SdkU3d;->inst:Lcom/netease/ntunisdk/base/GamerInterface;

    invoke-static {}, Lcom/netease/ntunisdk/base/SdkU3d;->getInstU3d()Lcom/netease/ntunisdk/base/SdkU3d;

    move-result-object v1

    invoke-interface {v0, v1, v2}, Lcom/netease/ntunisdk/base/GamerInterface;->setQueryRankListener(Lcom/netease/ntunisdk/base/QueryRankListener;I)V

    .line 74
    :cond_0
    sget-object v0, Lcom/netease/ntunisdk/base/SdkU3d;->inst:Lcom/netease/ntunisdk/base/GamerInterface;

    return-object v0
.end method

.method public static getInstU3d()Lcom/netease/ntunisdk/base/SdkU3d;
    .locals 1

    .prologue
    .line 53
    sget-object v0, Lcom/netease/ntunisdk/base/SdkU3d;->instU3d:Lcom/netease/ntunisdk/base/SdkU3d;

    if-nez v0, :cond_0

    .line 54
    new-instance v0, Lcom/netease/ntunisdk/base/SdkU3d;

    invoke-direct {v0}, Lcom/netease/ntunisdk/base/SdkU3d;-><init>()V

    sput-object v0, Lcom/netease/ntunisdk/base/SdkU3d;->instU3d:Lcom/netease/ntunisdk/base/SdkU3d;

    .line 56
    :cond_0
    sget-object v0, Lcom/netease/ntunisdk/base/SdkU3d;->instU3d:Lcom/netease/ntunisdk/base/SdkU3d;

    return-object v0
.end method

.method private static getUnityPlayerClass()Ljava/lang/Class;
    .locals 1
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()",
            "Ljava/lang/Class",
            "<*>;"
        }
    .end annotation

    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/ClassNotFoundException;
        }
    .end annotation

    .prologue
    .line 46
    sget-object v0, Lcom/netease/ntunisdk/base/SdkU3d;->UnityPlayerClass:Ljava/lang/Class;

    if-nez v0, :cond_0

    .line 47
    const-string v0, "com.unity3d.player.UnityPlayer"

    invoke-static {v0}, Ljava/lang/Class;->forName(Ljava/lang/String;)Ljava/lang/Class;

    move-result-object v0

    sput-object v0, Lcom/netease/ntunisdk/base/SdkU3d;->UnityPlayerClass:Ljava/lang/Class;

    .line 49
    :cond_0
    sget-object v0, Lcom/netease/ntunisdk/base/SdkU3d;->UnityPlayerClass:Ljava/lang/Class;

    return-object v0
.end method

.method public static init()V
    .locals 3

    .prologue
    .line 79
    :try_start_0
    const-string v1, "UniSDK SdkU3d"

    const-string v2, "try SdkU3d init"

    invoke-static {v1, v2}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 80
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkU3d;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v1

    invoke-static {}, Lcom/netease/ntunisdk/base/SdkU3d;->getInstU3d()Lcom/netease/ntunisdk/base/SdkU3d;

    move-result-object v2

    invoke-interface {v1, v2}, Lcom/netease/ntunisdk/base/GamerInterface;->ntInit(Lcom/netease/ntunisdk/base/OnFinishInitListener;)V
    :try_end_0
    .catch Ljava/lang/IllegalAccessException; {:try_start_0 .. :try_end_0} :catch_0
    .catch Ljava/lang/IllegalArgumentException; {:try_start_0 .. :try_end_0} :catch_1
    .catch Ljava/lang/NoSuchFieldException; {:try_start_0 .. :try_end_0} :catch_2
    .catch Ljava/lang/ClassNotFoundException; {:try_start_0 .. :try_end_0} :catch_3

    .line 90
    :goto_0
    return-void

    .line 81
    :catch_0
    move-exception v0

    .line 82
    .local v0, "e":Ljava/lang/IllegalAccessException;
    invoke-virtual {v0}, Ljava/lang/IllegalAccessException;->printStackTrace()V

    goto :goto_0

    .line 83
    .end local v0    # "e":Ljava/lang/IllegalAccessException;
    :catch_1
    move-exception v0

    .line 84
    .local v0, "e":Ljava/lang/IllegalArgumentException;
    invoke-virtual {v0}, Ljava/lang/IllegalArgumentException;->printStackTrace()V

    goto :goto_0

    .line 85
    .end local v0    # "e":Ljava/lang/IllegalArgumentException;
    :catch_2
    move-exception v0

    .line 86
    .local v0, "e":Ljava/lang/NoSuchFieldException;
    invoke-virtual {v0}, Ljava/lang/NoSuchFieldException;->printStackTrace()V

    goto :goto_0

    .line 87
    .end local v0    # "e":Ljava/lang/NoSuchFieldException;
    :catch_3
    move-exception v0

    .line 88
    .local v0, "e":Ljava/lang/ClassNotFoundException;
    invoke-virtual {v0}, Ljava/lang/ClassNotFoundException;->printStackTrace()V

    goto :goto_0
.end method

.method public static ntCheckOrder(Ljava/lang/String;)V
    .locals 4
    .param p0, "jsonStr"    # Ljava/lang/String;

    .prologue
    .line 121
    const-string v1, "UniSDK SdkU3d"

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "try SdkU3d ntCheckOrder: "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 122
    invoke-static {p0}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v1

    if-eqz v1, :cond_0

    .line 123
    const-string v1, "UniSDK SdkU3d"

    const-string v2, "jsonStr is null"

    invoke-static {v1, v2}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 128
    :goto_0
    return-void

    .line 126
    :cond_0
    invoke-static {p0}, Lcom/netease/ntunisdk/base/OrderInfo;->jsonStr2Obj(Ljava/lang/String;)Lcom/netease/ntunisdk/base/OrderInfo;

    move-result-object v0

    .line 127
    .local v0, "oi":Lcom/netease/ntunisdk/base/OrderInfo;
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v1

    invoke-interface {v1, v0}, Lcom/netease/ntunisdk/base/GamerInterface;->ntCheckOrder(Lcom/netease/ntunisdk/base/OrderInfo;)V

    goto :goto_0
.end method

.method public static ntCheckOrder(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 5
    .param p0, "pid"    # Ljava/lang/String;
    .param p1, "orderId"    # Ljava/lang/String;
    .param p2, "orderEtc"    # Ljava/lang/String;

    .prologue
    .line 103
    const/4 v1, 0x0

    .line 105
    .local v1, "oi":Lcom/netease/ntunisdk/base/OrderInfo;
    :try_start_0
    new-instance v2, Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-direct {v2, p0}, Lcom/netease/ntunisdk/base/OrderInfo;-><init>(Ljava/lang/String;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 106
    .end local v1    # "oi":Lcom/netease/ntunisdk/base/OrderInfo;
    .local v2, "oi":Lcom/netease/ntunisdk/base/OrderInfo;
    :try_start_1
    invoke-virtual {v2, p1}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderId(Ljava/lang/String;)V

    .line 107
    invoke-virtual {v2, p2}, Lcom/netease/ntunisdk/base/OrderInfo;->setOrderEtc(Ljava/lang/String;)V
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_1

    .line 113
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v3

    invoke-interface {v3, v2}, Lcom/netease/ntunisdk/base/GamerInterface;->ntCheckOrder(Lcom/netease/ntunisdk/base/OrderInfo;)V

    move-object v1, v2

    .line 114
    .end local v2    # "oi":Lcom/netease/ntunisdk/base/OrderInfo;
    .restart local v1    # "oi":Lcom/netease/ntunisdk/base/OrderInfo;
    :goto_0
    return-void

    .line 108
    :catch_0
    move-exception v0

    .line 109
    .local v0, "e":Ljava/lang/Exception;
    :goto_1
    const-string v3, "UniSDK SdkU3d"

    const-string v4, "order create error"

    invoke-static {v3, v4}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 110
    invoke-virtual {v0}, Ljava/lang/Exception;->printStackTrace()V

    goto :goto_0

    .line 108
    .end local v0    # "e":Ljava/lang/Exception;
    .end local v1    # "oi":Lcom/netease/ntunisdk/base/OrderInfo;
    .restart local v2    # "oi":Lcom/netease/ntunisdk/base/OrderInfo;
    :catch_1
    move-exception v0

    move-object v1, v2

    .end local v2    # "oi":Lcom/netease/ntunisdk/base/OrderInfo;
    .restart local v1    # "oi":Lcom/netease/ntunisdk/base/OrderInfo;
    goto :goto_1
.end method

.method public static ntConsume(Ljava/lang/String;)V
    .locals 4
    .param p0, "jsonStr"    # Ljava/lang/String;

    .prologue
    .line 160
    const-string v1, "UniSDK SdkU3d"

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "try SdkU3d ntConsume: "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 161
    invoke-static {p0}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v1

    if-eqz v1, :cond_0

    .line 162
    const-string v1, "UniSDK SdkU3d"

    const-string v2, "jsonStr is null"

    invoke-static {v1, v2}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 167
    :goto_0
    return-void

    .line 165
    :cond_0
    invoke-static {p0}, Lcom/netease/ntunisdk/base/OrderInfo;->jsonStr2Obj(Ljava/lang/String;)Lcom/netease/ntunisdk/base/OrderInfo;

    move-result-object v0

    .line 166
    .local v0, "oi":Lcom/netease/ntunisdk/base/OrderInfo;
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v1

    invoke-interface {v1, v0}, Lcom/netease/ntunisdk/base/GamerInterface;->ntConsume(Lcom/netease/ntunisdk/base/OrderInfo;)V

    goto :goto_0
.end method

.method public static ntQueryRank(Ljava/lang/String;)V
    .locals 4
    .param p0, "jsonStr"    # Ljava/lang/String;

    .prologue
    .line 134
    const-string v1, "UniSDK SdkU3d"

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "try SdkU3d ntQueryRank: "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 135
    invoke-static {p0}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v1

    if-eqz v1, :cond_0

    .line 136
    const-string v1, "UniSDK SdkU3d"

    const-string v2, "jsonStr is null"

    invoke-static {v1, v2}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 141
    :goto_0
    return-void

    .line 139
    :cond_0
    invoke-static {p0}, Lcom/netease/ntunisdk/base/QueryRankInfo;->jsonStr2Obj(Ljava/lang/String;)Lcom/netease/ntunisdk/base/QueryRankInfo;

    move-result-object v0

    .line 140
    .local v0, "rank":Lcom/netease/ntunisdk/base/QueryRankInfo;
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v1

    invoke-interface {v1, v0}, Lcom/netease/ntunisdk/base/GamerInterface;->ntQueryRank(Lcom/netease/ntunisdk/base/QueryRankInfo;)V

    goto :goto_0
.end method

.method public static ntShare(Ljava/lang/String;)V
    .locals 4
    .param p0, "jsonStr"    # Ljava/lang/String;

    .prologue
    .line 147
    const-string v1, "UniSDK SdkU3d"

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "try SdkU3d ntQueryRank: "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 148
    invoke-static {p0}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v1

    if-eqz v1, :cond_0

    .line 149
    const-string v1, "UniSDK SdkU3d"

    const-string v2, "jsonStr is null"

    invoke-static {v1, v2}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 154
    :goto_0
    return-void

    .line 152
    :cond_0
    invoke-static {p0}, Lcom/netease/ntunisdk/base/ShareInfo;->jsonStr2Obj(Ljava/lang/String;)Lcom/netease/ntunisdk/base/ShareInfo;

    move-result-object v0

    .line 153
    .local v0, "shareInfo":Lcom/netease/ntunisdk/base/ShareInfo;
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v1

    invoke-interface {v1, v0}, Lcom/netease/ntunisdk/base/GamerInterface;->ntShare(Lcom/netease/ntunisdk/base/ShareInfo;)V

    goto :goto_0
.end method

.method public static setCallbackModule(Ljava/lang/String;)V
    .locals 3
    .param p0, "module"    # Ljava/lang/String;

    .prologue
    .line 173
    sput-object p0, Lcom/netease/ntunisdk/base/SdkU3d;->U3DModuleName:Ljava/lang/String;

    .line 174
    const-string v0, "NtUniSdk"

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v2, "SdkU3d setCallbackModule:"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 175
    return-void
.end method

.method public static unity3dSendMessage(Ljava/lang/String;)V
    .locals 7
    .param p0, "json"    # Ljava/lang/String;

    .prologue
    .line 184
    :try_start_0
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkU3d;->getUnityPlayerClass()Ljava/lang/Class;

    move-result-object v2

    const-string v3, "UnitySendMessage"

    const/4 v4, 0x3

    new-array v4, v4, [Ljava/lang/Class;

    const/4 v5, 0x0

    const-class v6, Ljava/lang/String;

    aput-object v6, v4, v5

    const/4 v5, 0x1

    const-class v6, Ljava/lang/String;

    aput-object v6, v4, v5

    const/4 v5, 0x2

    const-class v6, Ljava/lang/String;

    aput-object v6, v4, v5

    invoke-virtual {v2, v3, v4}, Ljava/lang/Class;->getMethod(Ljava/lang/String;[Ljava/lang/Class;)Ljava/lang/reflect/Method;

    move-result-object v1

    .line 185
    .local v1, "m":Ljava/lang/reflect/Method;
    const-string v2, "UniSDK SdkU3d"

    const-string v3, "begin U3d send msg..."

    invoke-static {v2, v3}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 186
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkU3d;->getUnityPlayerClass()Ljava/lang/Class;

    move-result-object v2

    const/4 v3, 0x3

    new-array v3, v3, [Ljava/lang/Object;

    const/4 v4, 0x0

    sget-object v5, Lcom/netease/ntunisdk/base/SdkU3d;->U3DModuleName:Ljava/lang/String;

    aput-object v5, v3, v4

    const/4 v4, 0x1

    const-string v5, "OnSdkMsgCallback"

    aput-object v5, v3, v4

    const/4 v4, 0x2

    aput-object p0, v3, v4

    invoke-virtual {v1, v2, v3}, Ljava/lang/reflect/Method;->invoke(Ljava/lang/Object;[Ljava/lang/Object;)Ljava/lang/Object;

    .line 187
    const-string v2, "UniSDK SdkU3d"

    const-string v3, "end U3d send msg..."

    invoke-static {v2, v3}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I
    :try_end_0
    .catch Ljava/lang/NoSuchMethodException; {:try_start_0 .. :try_end_0} :catch_0
    .catch Ljava/lang/ClassNotFoundException; {:try_start_0 .. :try_end_0} :catch_1
    .catch Ljava/lang/IllegalAccessException; {:try_start_0 .. :try_end_0} :catch_2
    .catch Ljava/lang/IllegalArgumentException; {:try_start_0 .. :try_end_0} :catch_3
    .catch Ljava/lang/reflect/InvocationTargetException; {:try_start_0 .. :try_end_0} :catch_4

    .line 199
    .end local v1    # "m":Ljava/lang/reflect/Method;
    :goto_0
    return-void

    .line 188
    :catch_0
    move-exception v0

    .line 189
    .local v0, "e":Ljava/lang/NoSuchMethodException;
    invoke-virtual {v0}, Ljava/lang/NoSuchMethodException;->printStackTrace()V

    goto :goto_0

    .line 190
    .end local v0    # "e":Ljava/lang/NoSuchMethodException;
    :catch_1
    move-exception v0

    .line 191
    .local v0, "e":Ljava/lang/ClassNotFoundException;
    invoke-virtual {v0}, Ljava/lang/ClassNotFoundException;->printStackTrace()V

    goto :goto_0

    .line 192
    .end local v0    # "e":Ljava/lang/ClassNotFoundException;
    :catch_2
    move-exception v0

    .line 193
    .local v0, "e":Ljava/lang/IllegalAccessException;
    invoke-virtual {v0}, Ljava/lang/IllegalAccessException;->printStackTrace()V

    goto :goto_0

    .line 194
    .end local v0    # "e":Ljava/lang/IllegalAccessException;
    :catch_3
    move-exception v0

    .line 195
    .local v0, "e":Ljava/lang/IllegalArgumentException;
    invoke-virtual {v0}, Ljava/lang/IllegalArgumentException;->printStackTrace()V

    goto :goto_0

    .line 196
    .end local v0    # "e":Ljava/lang/IllegalArgumentException;
    :catch_4
    move-exception v0

    .line 197
    .local v0, "e":Ljava/lang/reflect/InvocationTargetException;
    invoke-virtual {v0}, Ljava/lang/reflect/InvocationTargetException;->printStackTrace()V

    goto :goto_0
.end method


# virtual methods
.method public continueGame()V
    .locals 3

    .prologue
    .line 287
    const-string v0, "UniSDK SdkU3d"

    const-string v1, "continueGame"

    invoke-static {v0, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 288
    const-string v0, "OnContinue"

    const/4 v1, 0x1

    const-string v2, ""

    invoke-static {v0, v1, v2}, Lcom/netease/ntunisdk/base/SdkU3d;->callback(Ljava/lang/String;ILjava/lang/Object;)V

    .line 289
    return-void
.end method

.method public exitApp()V
    .locals 3

    .prologue
    .line 269
    const-string v0, "UniSDK SdkU3d"

    const-string v1, "exitApp"

    invoke-static {v0, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 270
    const-string v0, "OnExitView"

    const/4 v1, 0x1

    const-string v2, ""

    invoke-static {v0, v1, v2}, Lcom/netease/ntunisdk/base/SdkU3d;->callback(Ljava/lang/String;ILjava/lang/Object;)V

    .line 271
    return-void
.end method

.method public finishInit(I)V
    .locals 3
    .param p1, "code"    # I

    .prologue
    .line 221
    const-string v0, "UniSDK SdkU3d"

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v2, "finishInit,code="

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 222
    const-string v0, "OnFinishInit"

    const-string v1, ""

    invoke-static {v0, p1, v1}, Lcom/netease/ntunisdk/base/SdkU3d;->callback(Ljava/lang/String;ILjava/lang/Object;)V

    .line 223
    return-void
.end method

.method public leaveSdk(I)V
    .locals 2
    .param p1, "code"    # I

    .prologue
    .line 248
    const-string v0, "OnLeaveSdk"

    const-string v1, ""

    invoke-static {v0, p1, v1}, Lcom/netease/ntunisdk/base/SdkU3d;->callback(Ljava/lang/String;ILjava/lang/Object;)V

    .line 249
    return-void
.end method

.method public loginDone(I)V
    .locals 3
    .param p1, "code"    # I

    .prologue
    .line 230
    const-string v0, "UniSDK SdkU3d"

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v2, "loginDone,code="

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 231
    const-string v0, "OnLoginDone"

    const-string v1, ""

    invoke-static {v0, p1, v1}, Lcom/netease/ntunisdk/base/SdkU3d;->callback(Ljava/lang/String;ILjava/lang/Object;)V

    .line 232
    return-void
.end method

.method public logoutDone(I)V
    .locals 3
    .param p1, "code"    # I

    .prologue
    .line 239
    const-string v0, "UniSDK SdkU3d"

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v2, "logoutDone,code="

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 240
    const-string v0, "onLogoutDone"

    const-string v1, ""

    invoke-static {v0, p1, v1}, Lcom/netease/ntunisdk/base/SdkU3d;->callback(Ljava/lang/String;ILjava/lang/Object;)V

    .line 241
    return-void
.end method

.method public onApplyFriendFinished(Z)V
    .locals 3
    .param p1, "result"    # Z

    .prologue
    .line 353
    const-string v0, "UniSDK SdkU3d"

    const-string v1, "on apply friend finished"

    invoke-static {v0, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 354
    const-string v0, "OnApplyFriend"

    const/4 v1, 0x1

    invoke-static {p1}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object v2

    invoke-static {v0, v1, v2}, Lcom/netease/ntunisdk/base/SdkU3d;->callback(Ljava/lang/String;ILjava/lang/Object;)V

    .line 355
    return-void
.end method

.method public onInviteFriendListFinished(Ljava/util/List;)V
    .locals 0
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/List",
            "<",
            "Ljava/lang/String;",
            ">;)V"
        }
    .end annotation

    .prologue
    .line 431
    .local p1, "inviteeIDList":Ljava/util/List;, "Ljava/util/List<Ljava/lang/String;>;"
    return-void
.end method

.method public onInviterListFinished(Ljava/util/List;)V
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
    .line 437
    .local p1, "friends":Ljava/util/List;, "Ljava/util/List<Lcom/netease/ntunisdk/base/AccountInfo;>;"
    return-void
.end method

.method public onIsDarenUpdated(Z)V
    .locals 3
    .param p1, "result"    # Z

    .prologue
    .line 362
    const-string v0, "UniSDK SdkU3d"

    const-string v1, "on isDarenUpdated"

    invoke-static {v0, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 363
    const-string v0, "OnIsDarenUpdated"

    const/4 v1, 0x1

    invoke-static {p1}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object v2

    invoke-static {v0, v1, v2}, Lcom/netease/ntunisdk/base/SdkU3d;->callback(Ljava/lang/String;ILjava/lang/Object;)V

    .line 364
    return-void
.end method

.method public onOpenExitViewFailed()V
    .locals 3

    .prologue
    .line 278
    const-string v0, "UniSDK SdkU3d"

    const-string v1, "onOpenExitViewFailed"

    invoke-static {v0, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 279
    const-string v0, "OnExitViewFailed"

    const/4 v1, 0x1

    const-string v2, ""

    invoke-static {v0, v1, v2}, Lcom/netease/ntunisdk/base/SdkU3d;->callback(Ljava/lang/String;ILjava/lang/Object;)V

    .line 280
    return-void
.end method

.method public onQueryAvailablesInviteesFinished(Ljava/util/List;)V
    .locals 7
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
    .line 319
    .local p1, "friends":Ljava/util/List;, "Ljava/util/List<Lcom/netease/ntunisdk/base/AccountInfo;>;"
    const-string v4, "UniSDK SdkU3d"

    const-string v5, "on query availables invitees finished"

    invoke-static {v4, v5}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 320
    new-instance v2, Lorg/json/JSONArray;

    invoke-direct {v2}, Lorg/json/JSONArray;-><init>()V

    .line 321
    .local v2, "jList":Lorg/json/JSONArray;
    if-eqz p1, :cond_1

    invoke-interface {p1}, Ljava/util/List;->size()I

    move-result v4

    if-lez v4, :cond_1

    .line 322
    const/4 v1, 0x0

    .local v1, "i":I
    :goto_0
    invoke-interface {p1}, Ljava/util/List;->size()I

    move-result v4

    if-ge v1, v4, :cond_1

    .line 323
    invoke-interface {p1, v1}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object v4

    check-cast v4, Lcom/netease/ntunisdk/base/AccountInfo;

    invoke-static {v4}, Lcom/netease/ntunisdk/base/AccountInfo;->obj2Json(Lcom/netease/ntunisdk/base/AccountInfo;)Lorg/json/JSONObject;

    move-result-object v3

    .line 325
    .local v3, "jdata":Lorg/json/JSONObject;
    if-eqz v3, :cond_0

    .line 326
    :try_start_0
    invoke-virtual {v2, v1, v3}, Lorg/json/JSONArray;->put(ILjava/lang/Object;)Lorg/json/JSONArray;
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    .line 322
    :cond_0
    :goto_1
    add-int/lit8 v1, v1, 0x1

    goto :goto_0

    .line 328
    :catch_0
    move-exception v0

    .line 329
    .local v0, "e":Lorg/json/JSONException;
    invoke-virtual {v0}, Lorg/json/JSONException;->printStackTrace()V

    goto :goto_1

    .line 333
    .end local v0    # "e":Lorg/json/JSONException;
    .end local v1    # "i":I
    .end local v3    # "jdata":Lorg/json/JSONObject;
    :cond_1
    const-string v4, "UniSDK SdkU3d"

    invoke-virtual {v2}, Lorg/json/JSONArray;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-static {v4, v5}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 334
    const-string v4, "OnQueryAvailablesInvitees"

    const/4 v5, 0x1

    invoke-virtual {v2}, Lorg/json/JSONArray;->toString()Ljava/lang/String;

    move-result-object v6

    invoke-static {v4, v5, v6}, Lcom/netease/ntunisdk/base/SdkU3d;->callback(Ljava/lang/String;ILjava/lang/Object;)V

    .line 335
    return-void
.end method

.method public onQueryFriendListFinished(Ljava/util/List;)V
    .locals 7
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
    .line 296
    .local p1, "friends":Ljava/util/List;, "Ljava/util/List<Lcom/netease/ntunisdk/base/AccountInfo;>;"
    const-string v4, "UniSDK SdkU3d"

    const-string v5, "on query friends finished"

    invoke-static {v4, v5}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 297
    new-instance v2, Lorg/json/JSONArray;

    invoke-direct {v2}, Lorg/json/JSONArray;-><init>()V

    .line 298
    .local v2, "jList":Lorg/json/JSONArray;
    if-eqz p1, :cond_1

    invoke-interface {p1}, Ljava/util/List;->size()I

    move-result v4

    if-lez v4, :cond_1

    .line 299
    const/4 v1, 0x0

    .local v1, "i":I
    :goto_0
    invoke-interface {p1}, Ljava/util/List;->size()I

    move-result v4

    if-ge v1, v4, :cond_1

    .line 300
    invoke-interface {p1, v1}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object v4

    check-cast v4, Lcom/netease/ntunisdk/base/AccountInfo;

    invoke-static {v4}, Lcom/netease/ntunisdk/base/AccountInfo;->obj2Json(Lcom/netease/ntunisdk/base/AccountInfo;)Lorg/json/JSONObject;

    move-result-object v3

    .line 302
    .local v3, "jdata":Lorg/json/JSONObject;
    if-eqz v3, :cond_0

    .line 303
    :try_start_0
    invoke-virtual {v2, v1, v3}, Lorg/json/JSONArray;->put(ILjava/lang/Object;)Lorg/json/JSONArray;
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    .line 299
    :cond_0
    :goto_1
    add-int/lit8 v1, v1, 0x1

    goto :goto_0

    .line 305
    :catch_0
    move-exception v0

    .line 306
    .local v0, "e":Lorg/json/JSONException;
    invoke-virtual {v0}, Lorg/json/JSONException;->printStackTrace()V

    goto :goto_1

    .line 310
    .end local v0    # "e":Lorg/json/JSONException;
    .end local v1    # "i":I
    .end local v3    # "jdata":Lorg/json/JSONObject;
    :cond_1
    const-string v4, "UniSDK SdkU3d"

    invoke-virtual {v2}, Lorg/json/JSONArray;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-static {v4, v5}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 311
    const-string v4, "OnQueryFriendList"

    const/4 v5, 0x1

    invoke-virtual {v2}, Lorg/json/JSONArray;->toString()Ljava/lang/String;

    move-result-object v6

    invoke-static {v4, v5, v6}, Lcom/netease/ntunisdk/base/SdkU3d;->callback(Ljava/lang/String;ILjava/lang/Object;)V

    .line 312
    return-void
.end method

.method public onQueryFriendListInGameFinished(Ljava/util/List;)V
    .locals 7
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
    .line 402
    .local p1, "friends":Ljava/util/List;, "Ljava/util/List<Lcom/netease/ntunisdk/base/AccountInfo;>;"
    const-string v4, "UniSDK SdkU3d"

    const-string v5, "on query friends inGame finished"

    invoke-static {v4, v5}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 403
    new-instance v2, Lorg/json/JSONArray;

    invoke-direct {v2}, Lorg/json/JSONArray;-><init>()V

    .line 404
    .local v2, "jList":Lorg/json/JSONArray;
    if-eqz p1, :cond_1

    invoke-interface {p1}, Ljava/util/List;->size()I

    move-result v4

    if-lez v4, :cond_1

    .line 405
    const/4 v1, 0x0

    .local v1, "i":I
    :goto_0
    invoke-interface {p1}, Ljava/util/List;->size()I

    move-result v4

    if-ge v1, v4, :cond_1

    .line 406
    invoke-interface {p1, v1}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object v4

    check-cast v4, Lcom/netease/ntunisdk/base/AccountInfo;

    invoke-static {v4}, Lcom/netease/ntunisdk/base/AccountInfo;->obj2Json(Lcom/netease/ntunisdk/base/AccountInfo;)Lorg/json/JSONObject;

    move-result-object v3

    .line 408
    .local v3, "jdata":Lorg/json/JSONObject;
    if-eqz v3, :cond_0

    .line 409
    :try_start_0
    invoke-virtual {v2, v1, v3}, Lorg/json/JSONArray;->put(ILjava/lang/Object;)Lorg/json/JSONArray;
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    .line 405
    :cond_0
    :goto_1
    add-int/lit8 v1, v1, 0x1

    goto :goto_0

    .line 411
    :catch_0
    move-exception v0

    .line 412
    .local v0, "e":Lorg/json/JSONException;
    invoke-virtual {v0}, Lorg/json/JSONException;->printStackTrace()V

    goto :goto_1

    .line 416
    .end local v0    # "e":Lorg/json/JSONException;
    .end local v1    # "i":I
    .end local v3    # "jdata":Lorg/json/JSONObject;
    :cond_1
    const-string v4, "UniSDK SdkU3d"

    invoke-virtual {v2}, Lorg/json/JSONArray;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-static {v4, v5}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 417
    const-string v4, "OnQueryFriendListInGame"

    const/4 v5, 0x1

    invoke-virtual {v2}, Lorg/json/JSONArray;->toString()Ljava/lang/String;

    move-result-object v6

    invoke-static {v4, v5, v6}, Lcom/netease/ntunisdk/base/SdkU3d;->callback(Ljava/lang/String;ILjava/lang/Object;)V

    .line 418
    return-void
.end method

.method public onQueryMyAccountFinished(Lcom/netease/ntunisdk/base/AccountInfo;)V
    .locals 4
    .param p1, "account"    # Lcom/netease/ntunisdk/base/AccountInfo;

    .prologue
    .line 342
    const-string v1, "UniSDK SdkU3d"

    const-string v2, "on query myAccount finished"

    invoke-static {v1, v2}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 343
    invoke-static {p1}, Lcom/netease/ntunisdk/base/AccountInfo;->obj2Json(Lcom/netease/ntunisdk/base/AccountInfo;)Lorg/json/JSONObject;

    move-result-object v0

    .line 344
    .local v0, "jdata":Lorg/json/JSONObject;
    const-string v1, "UniSDK SdkU3d"

    invoke-virtual {v0}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 345
    const-string v1, "OnQueryMyAccount"

    const/4 v2, 0x1

    invoke-virtual {v0}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v1, v2, v3}, Lcom/netease/ntunisdk/base/SdkU3d;->callback(Ljava/lang/String;ILjava/lang/Object;)V

    .line 346
    return-void
.end method

.method public onQueryRankFinished(Ljava/util/List;)V
    .locals 7
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
    .line 371
    .local p1, "rank":Ljava/util/List;, "Ljava/util/List<Lcom/netease/ntunisdk/base/AccountInfo;>;"
    const-string v4, "UniSDK SdkU3d"

    const-string v5, "on query rank finished"

    invoke-static {v4, v5}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 372
    new-instance v2, Lorg/json/JSONArray;

    invoke-direct {v2}, Lorg/json/JSONArray;-><init>()V

    .line 373
    .local v2, "jList":Lorg/json/JSONArray;
    if-eqz p1, :cond_1

    invoke-interface {p1}, Ljava/util/List;->size()I

    move-result v4

    if-lez v4, :cond_1

    .line 374
    const/4 v1, 0x0

    .local v1, "i":I
    :goto_0
    invoke-interface {p1}, Ljava/util/List;->size()I

    move-result v4

    if-ge v1, v4, :cond_1

    .line 375
    invoke-interface {p1, v1}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object v4

    check-cast v4, Lcom/netease/ntunisdk/base/AccountInfo;

    invoke-static {v4}, Lcom/netease/ntunisdk/base/AccountInfo;->obj2Json(Lcom/netease/ntunisdk/base/AccountInfo;)Lorg/json/JSONObject;

    move-result-object v3

    .line 377
    .local v3, "jdata":Lorg/json/JSONObject;
    if-eqz v3, :cond_0

    .line 378
    :try_start_0
    invoke-virtual {v2, v1, v3}, Lorg/json/JSONArray;->put(ILjava/lang/Object;)Lorg/json/JSONArray;
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    .line 374
    :cond_0
    :goto_1
    add-int/lit8 v1, v1, 0x1

    goto :goto_0

    .line 380
    :catch_0
    move-exception v0

    .line 381
    .local v0, "e":Lorg/json/JSONException;
    invoke-virtual {v0}, Lorg/json/JSONException;->printStackTrace()V

    goto :goto_1

    .line 385
    .end local v0    # "e":Lorg/json/JSONException;
    .end local v1    # "i":I
    .end local v3    # "jdata":Lorg/json/JSONObject;
    :cond_1
    const-string v4, "UniSDK SdkU3d"

    invoke-virtual {v2}, Lorg/json/JSONArray;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-static {v4, v5}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 386
    const-string v4, "OnQueryRank"

    const/4 v5, 0x1

    invoke-virtual {v2}, Lorg/json/JSONArray;->toString()Ljava/lang/String;

    move-result-object v6

    invoke-static {v4, v5, v6}, Lcom/netease/ntunisdk/base/SdkU3d;->callback(Ljava/lang/String;ILjava/lang/Object;)V

    .line 387
    return-void
.end method

.method public onShareFinished(Z)V
    .locals 3
    .param p1, "result"    # Z

    .prologue
    .line 423
    const-string v0, "UniSDK SdkU3d"

    const-string v1, "on share finished"

    invoke-static {v0, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 424
    const-string v0, "OnShare"

    const/4 v1, 0x1

    invoke-static {p1}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object v2

    invoke-static {v0, v1, v2}, Lcom/netease/ntunisdk/base/SdkU3d;->callback(Ljava/lang/String;ILjava/lang/Object;)V

    .line 425
    return-void
.end method

.method public onUpdateAchievement(Z)V
    .locals 0
    .param p1, "result"    # Z

    .prologue
    .line 442
    return-void
.end method

.method public onUpdateRankFinished(Z)V
    .locals 2
    .param p1, "result"    # Z

    .prologue
    .line 393
    const-string v0, "UniSDK SdkU3d"

    const-string v1, "on update rank finished"

    invoke-static {v0, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 395
    return-void
.end method

.method public orderCheckDone(Lcom/netease/ntunisdk/base/OrderInfo;)V
    .locals 5
    .param p1, "oi"    # Lcom/netease/ntunisdk/base/OrderInfo;

    .prologue
    .line 256
    const-string v2, "UniSDK SdkU3d"

    const-string v3, "begin check order done..."

    invoke-static {v2, v3}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 257
    invoke-virtual {p1}, Lcom/netease/ntunisdk/base/OrderInfo;->getOrderStatus()I

    move-result v0

    .line 258
    .local v0, "code":I
    const-string v2, "UniSDK SdkU3d"

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    const-string v4, "checkOrderDone,code="

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3, v0}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 259
    invoke-static {p1}, Lcom/netease/ntunisdk/base/OrderInfo;->obj2Json(Lcom/netease/ntunisdk/base/OrderInfo;)Lorg/json/JSONObject;

    move-result-object v1

    .line 260
    .local v1, "jdata":Lorg/json/JSONObject;
    const-string v2, "UniSDK SdkU3d"

    invoke-virtual {v1}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 261
    const-string v2, "OnOrderCheck"

    invoke-static {v2, v0, v1}, Lcom/netease/ntunisdk/base/SdkU3d;->callback(Ljava/lang/String;ILjava/lang/Object;)V

    .line 262
    return-void
.end method

.method public orderConsumeDone(Lcom/netease/ntunisdk/base/OrderInfo;)V
    .locals 0
    .param p1, "oi"    # Lcom/netease/ntunisdk/base/OrderInfo;

    .prologue
    .line 448
    return-void
.end method
