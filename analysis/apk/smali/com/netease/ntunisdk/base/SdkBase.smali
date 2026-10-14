.class public abstract Lcom/netease/ntunisdk/base/SdkBase;
.super Ljava/lang/Object;
.source "SdkBase.java"

# interfaces
.implements Landroid/view/SurfaceHolder$Callback;
.implements Lcom/netease/ntunisdk/base/GamerInterface;


# static fields
.field static final synthetic $assertionsDisabled:Z

.field public static final DRPF_ERR_INVALID_INPUT_JSON:I = 0x5

.field public static final DRPF_ERR_JSON:I = 0x4

.field public static final DRPF_ERR_NO_PROJECT:I = 0x1

.field public static final DRPF_ERR_NO_SOURCE:I = 0x2

.field public static final DRPF_ERR_NO_TYPE:I = 0x3

.field public static final DRPF_SUCCESS:I = 0x0

.field protected static IMEI:Ljava/lang/String; = null

.field private static final TAG:Ljava/lang/String; = "UniSDK Base"


# instance fields
.field private continueListener:Lcom/netease/ntunisdk/base/OnContinueListener;

.field private controllerListener:Lcom/netease/ntunisdk/base/OnControllerListener;

.field private exitViewListener:Lcom/netease/ntunisdk/base/OnExitListener;

.field private friendListener:Lcom/netease/ntunisdk/base/QueryFriendListener;

.field private glView:Landroid/opengl/GLSurfaceView;

.field private hasInit:Z

.field private isSurfaceViewValid:Z

.field private leaveListener:Lcom/netease/ntunisdk/base/OnLeaveSdkListener;

.field private loginListener:Lcom/netease/ntunisdk/base/OnLoginDoneListener;

.field private logoutListener:Lcom/netease/ntunisdk/base/OnLogoutDoneListener;

.field protected myCtx:Landroid/content/Context;

.field private orderListener:Lcom/netease/ntunisdk/base/OnOrderCheckListener;

.field private payHisMap:Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Map",
            "<",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation
.end field

.field private propDict:Ljava/util/Hashtable;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Hashtable",
            "<",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation
.end field

.field private pushListener:Lcom/netease/ntunisdk/base/OnPushListener;

.field private querySkuDetailsListener:Lcom/netease/ntunisdk/base/OnQuerySkuDetailsListener;

.field private rankListener:Lcom/netease/ntunisdk/base/QueryRankListener;

.field private receiveMsgListener:Lcom/netease/ntunisdk/base/OnReceiveMsgListener;

.field private retrieveUser:Lcom/netease/ntunisdk/base/RetrieveUser;

.field private runnableQueue:Ljava/util/concurrent/BlockingQueue;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/concurrent/BlockingQueue",
            "<",
            "Ljava/lang/Runnable;",
            ">;"
        }
    .end annotation
.end field

.field protected sdkInstMap:Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Map",
            "<",
            "Ljava/lang/String;",
            "Lcom/netease/ntunisdk/base/SdkBase;",
            ">;"
        }
    .end annotation
.end field

.field private shareListener:Lcom/netease/ntunisdk/base/OnShareListener;

.field private startupListener:Lcom/netease/ntunisdk/base/OnStartupListener;

.field protected uiThreadId:J

.field private userInfoDict:Ljava/util/Hashtable;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Hashtable",
            "<",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation
.end field


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .prologue
    .line 51
    const-class v0, Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v0}, Ljava/lang/Class;->desiredAssertionStatus()Z

    move-result v0

    if-nez v0, :cond_0

    const/4 v0, 0x1

    :goto_0
    sput-boolean v0, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    .line 1259
    const/4 v0, 0x0

    sput-object v0, Lcom/netease/ntunisdk/base/SdkBase;->IMEI:Ljava/lang/String;

    return-void

    .line 51
    :cond_0
    const/4 v0, 0x0

    goto :goto_0
.end method

.method public constructor <init>(Landroid/content/Context;)V
    .locals 4
    .param p1, "ctx"    # Landroid/content/Context;

    .prologue
    const/4 v3, 0x0

    const/4 v2, 0x0

    .line 127
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 55
    iput-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    .line 56
    iput-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->startupListener:Lcom/netease/ntunisdk/base/OnStartupListener;

    .line 57
    iput-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->loginListener:Lcom/netease/ntunisdk/base/OnLoginDoneListener;

    .line 58
    iput-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->orderListener:Lcom/netease/ntunisdk/base/OnOrderCheckListener;

    .line 59
    iput-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->logoutListener:Lcom/netease/ntunisdk/base/OnLogoutDoneListener;

    .line 60
    iput-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->leaveListener:Lcom/netease/ntunisdk/base/OnLeaveSdkListener;

    .line 61
    iput-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->continueListener:Lcom/netease/ntunisdk/base/OnContinueListener;

    .line 62
    iput-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->receiveMsgListener:Lcom/netease/ntunisdk/base/OnReceiveMsgListener;

    .line 63
    iput-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->exitViewListener:Lcom/netease/ntunisdk/base/OnExitListener;

    .line 64
    iput-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->friendListener:Lcom/netease/ntunisdk/base/QueryFriendListener;

    .line 65
    iput-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->rankListener:Lcom/netease/ntunisdk/base/QueryRankListener;

    .line 66
    iput-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->shareListener:Lcom/netease/ntunisdk/base/OnShareListener;

    .line 67
    iput-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->pushListener:Lcom/netease/ntunisdk/base/OnPushListener;

    .line 68
    iput-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->querySkuDetailsListener:Lcom/netease/ntunisdk/base/OnQuerySkuDetailsListener;

    .line 69
    iput-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->controllerListener:Lcom/netease/ntunisdk/base/OnControllerListener;

    .line 70
    const-wide/16 v0, 0x0

    iput-wide v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->uiThreadId:J

    .line 71
    iput-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->glView:Landroid/opengl/GLSurfaceView;

    .line 73
    new-instance v0, Ljava/util/concurrent/LinkedBlockingQueue;

    invoke-direct {v0}, Ljava/util/concurrent/LinkedBlockingQueue;-><init>()V

    iput-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->runnableQueue:Ljava/util/concurrent/BlockingQueue;

    .line 74
    iput-boolean v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->isSurfaceViewValid:Z

    .line 76
    new-instance v0, Ljava/util/HashMap;

    invoke-direct {v0}, Ljava/util/HashMap;-><init>()V

    iput-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->payHisMap:Ljava/util/Map;

    .line 80
    new-instance v0, Ljava/util/HashMap;

    invoke-direct {v0}, Ljava/util/HashMap;-><init>()V

    iput-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    .line 1280
    new-instance v0, Ljava/util/Hashtable;

    invoke-direct {v0}, Ljava/util/Hashtable;-><init>()V

    iput-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->propDict:Ljava/util/Hashtable;

    .line 1703
    iput-boolean v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->hasInit:Z

    .line 1771
    new-instance v0, Ljava/util/Hashtable;

    invoke-direct {v0}, Ljava/util/Hashtable;-><init>()V

    iput-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->userInfoDict:Ljava/util/Hashtable;

    .line 128
    invoke-virtual {p0, p1}, Lcom/netease/ntunisdk/base/SdkBase;->setCtx(Landroid/content/Context;)V

    .line 129
    return-void
.end method

.method private _ntCheckOrder(Lcom/netease/ntunisdk/base/OrderInfo;)V
    .locals 2
    .param p1, "order"    # Lcom/netease/ntunisdk/base/OrderInfo;

    .prologue
    .line 591
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 592
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$6;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$6;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Lcom/netease/ntunisdk/base/OrderInfo;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 649
    return-void
.end method

.method static synthetic access$000(Lcom/netease/ntunisdk/base/SdkBase;)Lcom/netease/ntunisdk/base/OnStartupListener;
    .locals 1
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/SdkBase;

    .prologue
    .line 51
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->startupListener:Lcom/netease/ntunisdk/base/OnStartupListener;

    return-object v0
.end method

.method static synthetic access$100(Lcom/netease/ntunisdk/base/SdkBase;)Lcom/netease/ntunisdk/base/OnLoginDoneListener;
    .locals 1
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/SdkBase;

    .prologue
    .line 51
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->loginListener:Lcom/netease/ntunisdk/base/OnLoginDoneListener;

    return-object v0
.end method

.method static synthetic access$1000(Lcom/netease/ntunisdk/base/SdkBase;)Lcom/netease/ntunisdk/base/OnLeaveSdkListener;
    .locals 1
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/SdkBase;

    .prologue
    .line 51
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->leaveListener:Lcom/netease/ntunisdk/base/OnLeaveSdkListener;

    return-object v0
.end method

.method static synthetic access$1100(Lcom/netease/ntunisdk/base/SdkBase;ILcom/netease/ntunisdk/base/OnFinishInitListener;)V
    .locals 0
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/SdkBase;
    .param p1, "x1"    # I
    .param p2, "x2"    # Lcom/netease/ntunisdk/base/OnFinishInitListener;

    .prologue
    .line 51
    invoke-direct {p0, p1, p2}, Lcom/netease/ntunisdk/base/SdkBase;->initAllSdk(ILcom/netease/ntunisdk/base/OnFinishInitListener;)V

    return-void
.end method

.method static synthetic access$1200(Lcom/netease/ntunisdk/base/SdkBase;)Lcom/netease/ntunisdk/base/QueryFriendListener;
    .locals 1
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/SdkBase;

    .prologue
    .line 51
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->friendListener:Lcom/netease/ntunisdk/base/QueryFriendListener;

    return-object v0
.end method

.method static synthetic access$1300(Lcom/netease/ntunisdk/base/SdkBase;)Lcom/netease/ntunisdk/base/QueryRankListener;
    .locals 1
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/SdkBase;

    .prologue
    .line 51
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->rankListener:Lcom/netease/ntunisdk/base/QueryRankListener;

    return-object v0
.end method

.method static synthetic access$1400(Lcom/netease/ntunisdk/base/SdkBase;)Lcom/netease/ntunisdk/base/RetrieveUser;
    .locals 1
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/SdkBase;

    .prologue
    .line 51
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->retrieveUser:Lcom/netease/ntunisdk/base/RetrieveUser;

    return-object v0
.end method

.method static synthetic access$1500(Lcom/netease/ntunisdk/base/SdkBase;)Lcom/netease/ntunisdk/base/OnShareListener;
    .locals 1
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/SdkBase;

    .prologue
    .line 51
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->shareListener:Lcom/netease/ntunisdk/base/OnShareListener;

    return-object v0
.end method

.method static synthetic access$1600(Lcom/netease/ntunisdk/base/SdkBase;)Lcom/netease/ntunisdk/base/OnPushListener;
    .locals 1
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/SdkBase;

    .prologue
    .line 51
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->pushListener:Lcom/netease/ntunisdk/base/OnPushListener;

    return-object v0
.end method

.method static synthetic access$1700(Lcom/netease/ntunisdk/base/SdkBase;)Lcom/netease/ntunisdk/base/OnQuerySkuDetailsListener;
    .locals 1
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/SdkBase;

    .prologue
    .line 51
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->querySkuDetailsListener:Lcom/netease/ntunisdk/base/OnQuerySkuDetailsListener;

    return-object v0
.end method

.method static synthetic access$1800(Lcom/netease/ntunisdk/base/SdkBase;)Lcom/netease/ntunisdk/base/OnControllerListener;
    .locals 1
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/SdkBase;

    .prologue
    .line 51
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->controllerListener:Lcom/netease/ntunisdk/base/OnControllerListener;

    return-object v0
.end method

.method static synthetic access$200(Lcom/netease/ntunisdk/base/SdkBase;Lcom/netease/ntunisdk/base/OrderInfo;)V
    .locals 0
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/SdkBase;
    .param p1, "x1"    # Lcom/netease/ntunisdk/base/OrderInfo;

    .prologue
    .line 51
    invoke-direct {p0, p1}, Lcom/netease/ntunisdk/base/SdkBase;->createOrder(Lcom/netease/ntunisdk/base/OrderInfo;)V

    return-void
.end method

.method static synthetic access$300(Lcom/netease/ntunisdk/base/SdkBase;Lcom/netease/ntunisdk/base/OrderInfo;)V
    .locals 0
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/SdkBase;
    .param p1, "x1"    # Lcom/netease/ntunisdk/base/OrderInfo;

    .prologue
    .line 51
    invoke-direct {p0, p1}, Lcom/netease/ntunisdk/base/SdkBase;->_ntCheckOrder(Lcom/netease/ntunisdk/base/OrderInfo;)V

    return-void
.end method

.method static synthetic access$400(Lcom/netease/ntunisdk/base/SdkBase;)Ljava/util/Map;
    .locals 1
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/SdkBase;

    .prologue
    .line 51
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->payHisMap:Ljava/util/Map;

    return-object v0
.end method

.method static synthetic access$500(Lcom/netease/ntunisdk/base/SdkBase;)Lcom/netease/ntunisdk/base/OnOrderCheckListener;
    .locals 1
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/SdkBase;

    .prologue
    .line 51
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->orderListener:Lcom/netease/ntunisdk/base/OnOrderCheckListener;

    return-object v0
.end method

.method static synthetic access$600(Lcom/netease/ntunisdk/base/SdkBase;)Lcom/netease/ntunisdk/base/OnLogoutDoneListener;
    .locals 1
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/SdkBase;

    .prologue
    .line 51
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->logoutListener:Lcom/netease/ntunisdk/base/OnLogoutDoneListener;

    return-object v0
.end method

.method static synthetic access$700(Lcom/netease/ntunisdk/base/SdkBase;)Lcom/netease/ntunisdk/base/OnReceiveMsgListener;
    .locals 1
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/SdkBase;

    .prologue
    .line 51
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->receiveMsgListener:Lcom/netease/ntunisdk/base/OnReceiveMsgListener;

    return-object v0
.end method

.method static synthetic access$800(Lcom/netease/ntunisdk/base/SdkBase;)Lcom/netease/ntunisdk/base/OnContinueListener;
    .locals 1
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/SdkBase;

    .prologue
    .line 51
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->continueListener:Lcom/netease/ntunisdk/base/OnContinueListener;

    return-object v0
.end method

.method static synthetic access$900(Lcom/netease/ntunisdk/base/SdkBase;)Lcom/netease/ntunisdk/base/OnExitListener;
    .locals 1
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/SdkBase;

    .prologue
    .line 51
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->exitViewListener:Lcom/netease/ntunisdk/base/OnExitListener;

    return-object v0
.end method

.method private createOrder(Lcom/netease/ntunisdk/base/OrderInfo;)V
    .locals 2
    .param p1, "order"    # Lcom/netease/ntunisdk/base/OrderInfo;

    .prologue
    .line 657
    new-instance v0, Ljava/lang/Thread;

    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$7;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$7;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Lcom/netease/ntunisdk/base/OrderInfo;)V

    invoke-direct {v0, v1}, Ljava/lang/Thread;-><init>(Ljava/lang/Runnable;)V

    invoke-virtual {v0}, Ljava/lang/Thread;->start()V

    .line 733
    return-void
.end method

.method private getDistroId()Ljava/lang/String;
    .locals 10

    .prologue
    const/4 v6, 0x0

    .line 172
    const/4 v1, 0x0

    .line 174
    .local v1, "distroId":Ljava/lang/String;
    :try_start_0
    new-instance v5, Ljava/io/BufferedReader;

    new-instance v7, Ljava/io/InputStreamReader;

    iget-object v8, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    invoke-virtual {v8}, Landroid/content/Context;->getAssets()Landroid/content/res/AssetManager;

    move-result-object v8

    const-string v9, "com.netease.apk_distro/config.json"

    invoke-virtual {v8, v9}, Landroid/content/res/AssetManager;->open(Ljava/lang/String;)Ljava/io/InputStream;

    move-result-object v8

    invoke-direct {v7, v8}, Ljava/io/InputStreamReader;-><init>(Ljava/io/InputStream;)V

    invoke-direct {v5, v7}, Ljava/io/BufferedReader;-><init>(Ljava/io/Reader;)V

    .line 176
    .local v5, "reader":Ljava/io/BufferedReader;
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    .line 178
    .local v0, "content":Ljava/lang/StringBuilder;
    :goto_0
    invoke-virtual {v5}, Ljava/io/BufferedReader;->readLine()Ljava/lang/String;

    move-result-object v4

    .local v4, "line":Ljava/lang/String;
    if-eqz v4, :cond_0

    .line 179
    invoke-virtual {v0, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    goto :goto_0

    .line 184
    .end local v0    # "content":Ljava/lang/StringBuilder;
    .end local v4    # "line":Ljava/lang/String;
    .end local v5    # "reader":Ljava/io/BufferedReader;
    :catch_0
    move-exception v2

    .line 190
    :goto_1
    return-object v6

    .line 182
    .restart local v0    # "content":Ljava/lang/StringBuilder;
    .restart local v4    # "line":Ljava/lang/String;
    .restart local v5    # "reader":Ljava/io/BufferedReader;
    :cond_0
    new-instance v3, Lorg/json/JSONObject;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v7

    invoke-direct {v3, v7}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    .line 183
    .local v3, "jsonContent":Lorg/json/JSONObject;
    const-string v7, "distro_id"

    invoke-virtual {v3, v7}, Lorg/json/JSONObject;->getString(Ljava/lang/String;)Ljava/lang/String;
    :try_end_0
    .catch Ljava/io/IOException; {:try_start_0 .. :try_end_0} :catch_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_1

    move-result-object v1

    move-object v6, v1

    .line 190
    goto :goto_1

    .line 186
    .end local v0    # "content":Ljava/lang/StringBuilder;
    .end local v3    # "jsonContent":Lorg/json/JSONObject;
    .end local v4    # "line":Ljava/lang/String;
    .end local v5    # "reader":Ljava/io/BufferedReader;
    :catch_1
    move-exception v2

    .line 187
    .local v2, "e":Lorg/json/JSONException;
    goto :goto_1
.end method

.method private initAllSdk(ILcom/netease/ntunisdk/base/OnFinishInitListener;)V
    .locals 6
    .param p1, "index"    # I
    .param p2, "f"    # Lcom/netease/ntunisdk/base/OnFinishInitListener;

    .prologue
    const/4 v5, 0x1

    const/4 v4, 0x0

    .line 1732
    iget-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v2}, Ljava/util/Map;->size()I

    move-result v2

    if-lt p1, v2, :cond_1

    .line 1734
    const-string v2, "DEBUG_MODE"

    invoke-virtual {p0, v2, v4}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v0

    .line 1735
    .local v0, "debugMode":I
    if-ne v5, v0, :cond_0

    .line 1736
    invoke-virtual {p0, v5}, Lcom/netease/ntunisdk/base/SdkBase;->setDebugMode(Z)V

    .line 1741
    :goto_0
    invoke-virtual {p0, p2}, Lcom/netease/ntunisdk/base/SdkBase;->init(Lcom/netease/ntunisdk/base/OnFinishInitListener;)V

    .line 1766
    :goto_1
    return-void

    .line 1738
    :cond_0
    invoke-virtual {p0, v4}, Lcom/netease/ntunisdk/base/SdkBase;->setDebugMode(Z)V

    goto :goto_0

    .line 1743
    .end local v0    # "debugMode":I
    :cond_1
    iget-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->toArray()[Ljava/lang/Object;

    move-result-object v3

    aget-object v3, v3, p1

    invoke-interface {v2, v3}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Lcom/netease/ntunisdk/base/SdkBase;

    .line 1746
    .local v1, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    const-string v2, "DEBUG_MODE"

    invoke-virtual {v1, v2, v4}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v0

    .line 1747
    .restart local v0    # "debugMode":I
    if-ne v5, v0, :cond_2

    .line 1748
    invoke-virtual {v1, v5}, Lcom/netease/ntunisdk/base/SdkBase;->setDebugMode(Z)V

    .line 1753
    :goto_2
    new-instance v2, Lcom/netease/ntunisdk/base/SdkBase$23;

    invoke-direct {v2, p0, v1, p1, p2}, Lcom/netease/ntunisdk/base/SdkBase$23;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Lcom/netease/ntunisdk/base/SdkBase;ILcom/netease/ntunisdk/base/OnFinishInitListener;)V

    invoke-virtual {v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->init(Lcom/netease/ntunisdk/base/OnFinishInitListener;)V

    goto :goto_1

    .line 1750
    :cond_2
    invoke-virtual {v1, v4}, Lcom/netease/ntunisdk/base/SdkBase;->setDebugMode(Z)V

    goto :goto_2
.end method

.method private queryMpayResult(Lcom/netease/ntunisdk/base/OrderInfo;)V
    .locals 2
    .param p1, "order"    # Lcom/netease/ntunisdk/base/OrderInfo;

    .prologue
    .line 867
    new-instance v0, Ljava/lang/Thread;

    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$10;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$10;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Lcom/netease/ntunisdk/base/OrderInfo;)V

    invoke-direct {v0, v1}, Ljava/lang/Thread;-><init>(Ljava/lang/Runnable;)V

    invoke-virtual {v0}, Ljava/lang/Thread;->start()V

    .line 913
    return-void
.end method


# virtual methods
.method public DRPF(Ljava/lang/String;)I
    .locals 22
    .param p1, "strJson"    # Ljava/lang/String;

    .prologue
    .line 3216
    const-string v19, "UniSDK Base"

    const-string v20, "DRPF"

    invoke-static/range {v19 .. v20}, Lcom/netease/ntunisdk/base/UniSdkUtils;->i(Ljava/lang/String;Ljava/lang/String;)V

    .line 3217
    const-string v19, "UniSDK Base"

    new-instance v20, Ljava/lang/StringBuilder;

    invoke-direct/range {v20 .. v20}, Ljava/lang/StringBuilder;-><init>()V

    const-string v21, "strJson="

    invoke-virtual/range {v20 .. v21}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    move-object/from16 v0, v20

    move-object/from16 v1, p1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    invoke-virtual/range {v20 .. v20}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v20

    invoke-static/range {v19 .. v20}, Lcom/netease/ntunisdk/base/UniSdkUtils;->i(Ljava/lang/String;Ljava/lang/String;)V

    .line 3218
    const/4 v7, 0x0

    .line 3219
    .local v7, "errCode":I
    const-string v14, ""

    .line 3220
    .local v14, "project":Ljava/lang/String;
    const-string v15, ""

    .line 3221
    .local v15, "source":Ljava/lang/String;
    const-string v17, ""

    .line 3224
    .local v17, "type":Ljava/lang/String;
    :try_start_0
    new-instance v10, Lorg/json/JSONObject;

    move-object/from16 v0, p1

    invoke-direct {v10, v0}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 3229
    .local v10, "jsonObj":Lorg/json/JSONObject;
    :goto_0
    if-nez v10, :cond_0

    .line 3230
    const/16 v19, 0x5

    .line 3318
    :goto_1
    return v19

    .line 3225
    .end local v10    # "jsonObj":Lorg/json/JSONObject;
    :catch_0
    move-exception v6

    .line 3226
    .local v6, "e":Ljava/lang/Exception;
    invoke-virtual {v6}, Ljava/lang/Exception;->printStackTrace()V

    .line 3227
    const/4 v10, 0x0

    .restart local v10    # "jsonObj":Lorg/json/JSONObject;
    goto :goto_0

    .line 3233
    .end local v6    # "e":Ljava/lang/Exception;
    :cond_0
    :try_start_1
    const-string v19, "project"

    move-object/from16 v0, v19

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v14

    .line 3234
    invoke-static {v14}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_1

    move-result v19

    if-eqz v19, :cond_1

    .line 3235
    const/4 v7, 0x1

    .line 3240
    :cond_1
    :goto_2
    if-eqz v7, :cond_2

    move/from16 v19, v7

    .line 3241
    goto :goto_1

    .line 3237
    :catch_1
    move-exception v6

    .line 3238
    .restart local v6    # "e":Ljava/lang/Exception;
    const/4 v7, 0x1

    goto :goto_2

    .line 3244
    .end local v6    # "e":Ljava/lang/Exception;
    :cond_2
    :try_start_2
    const-string v19, "source"

    move-object/from16 v0, v19

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v15

    .line 3245
    invoke-static {v15}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z
    :try_end_2
    .catch Ljava/lang/Exception; {:try_start_2 .. :try_end_2} :catch_2

    move-result v19

    if-eqz v19, :cond_3

    .line 3246
    const/4 v7, 0x2

    .line 3251
    :cond_3
    :goto_3
    if-eqz v7, :cond_4

    move/from16 v19, v7

    .line 3252
    goto :goto_1

    .line 3248
    :catch_2
    move-exception v6

    .line 3249
    .restart local v6    # "e":Ljava/lang/Exception;
    const/4 v7, 0x2

    goto :goto_3

    .line 3255
    .end local v6    # "e":Ljava/lang/Exception;
    :cond_4
    :try_start_3
    const-string v19, "type"

    move-object/from16 v0, v19

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v17

    .line 3256
    invoke-static/range {v17 .. v17}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z
    :try_end_3
    .catch Ljava/lang/Exception; {:try_start_3 .. :try_end_3} :catch_3

    move-result v19

    if-eqz v19, :cond_5

    .line 3257
    const/4 v7, 0x3

    .line 3262
    :cond_5
    :goto_4
    if-eqz v7, :cond_6

    move/from16 v19, v7

    .line 3263
    goto :goto_1

    .line 3259
    :catch_3
    move-exception v6

    .line 3260
    .restart local v6    # "e":Ljava/lang/Exception;
    const/4 v7, 0x3

    goto :goto_4

    .line 3266
    .end local v6    # "e":Ljava/lang/Exception;
    :cond_6
    new-instance v4, Ljava/text/SimpleDateFormat;

    const-string v19, "yyyy-MM-dd HH:mm:ss Z"

    move-object/from16 v0, v19

    invoke-direct {v4, v0}, Ljava/text/SimpleDateFormat;-><init>(Ljava/lang/String;)V

    .line 3267
    .local v4, "dataFormat":Ljava/text/SimpleDateFormat;
    new-instance v19, Ljava/util/Date;

    invoke-direct/range {v19 .. v19}, Ljava/util/Date;-><init>()V

    move-object/from16 v0, v19

    invoke-virtual {v4, v0}, Ljava/text/SimpleDateFormat;->format(Ljava/util/Date;)Ljava/lang/String;

    move-result-object v16

    .line 3268
    .local v16, "timeString":Ljava/lang/String;
    move-object/from16 v0, p0

    iget-object v0, v0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    move-object/from16 v19, v0

    invoke-static/range {v19 .. v19}, Lcom/netease/ntunisdk/base/UniSdkUtils;->getLocalIpAddress(Landroid/content/Context;)Ljava/lang/String;

    move-result-object v9

    .line 3269
    .local v9, "ip":Ljava/lang/String;
    invoke-static {}, Lcom/netease/ntunisdk/base/UniSdkUtils;->getMobileModel()Ljava/lang/String;

    move-result-object v5

    .line 3270
    .local v5, "device":Ljava/lang/String;
    invoke-static {}, Lcom/netease/ntunisdk/base/UniSdkUtils;->getMobileVersion()Ljava/lang/String;

    move-result-object v13

    .line 3271
    .local v13, "os_ver":Ljava/lang/String;
    move-object/from16 v0, p0

    iget-object v0, v0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    move-object/from16 v19, v0

    invoke-static/range {v19 .. v19}, Lcom/netease/ntunisdk/base/UniSdkUtils;->getMacAddress(Landroid/content/Context;)Ljava/lang/String;

    move-result-object v12

    .line 3272
    .local v12, "mac":Ljava/lang/String;
    move-object/from16 v0, p0

    iget-object v0, v0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    move-object/from16 v19, v0

    invoke-static/range {v19 .. v19}, Lcom/netease/ntunisdk/base/UniSdkUtils;->getMobileIMSI(Landroid/content/Context;)Ljava/lang/String;

    move-result-object v8

    .line 3273
    .local v8, "idfa":Ljava/lang/String;
    invoke-virtual/range {p0 .. p0}, Lcom/netease/ntunisdk/base/SdkBase;->getAppChannel()Ljava/lang/String;

    move-result-object v2

    .line 3274
    .local v2, "app_channel":Ljava/lang/String;
    invoke-virtual/range {p0 .. p0}, Lcom/netease/ntunisdk/base/SdkBase;->getSDKVersion()Ljava/lang/String;

    move-result-object v3

    .line 3275
    .local v3, "app_ver":Ljava/lang/String;
    const-string v19, "UniSDK Base"

    new-instance v20, Ljava/lang/StringBuilder;

    invoke-direct/range {v20 .. v20}, Ljava/lang/StringBuilder;-><init>()V

    const-string v21, "project="

    invoke-virtual/range {v20 .. v21}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    move-object/from16 v0, v20

    invoke-virtual {v0, v14}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    invoke-virtual/range {v20 .. v20}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v20

    invoke-static/range {v19 .. v20}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    .line 3276
    const-string v19, "UniSDK Base"

    new-instance v20, Ljava/lang/StringBuilder;

    invoke-direct/range {v20 .. v20}, Ljava/lang/StringBuilder;-><init>()V

    const-string v21, "source="

    invoke-virtual/range {v20 .. v21}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    move-object/from16 v0, v20

    invoke-virtual {v0, v15}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    invoke-virtual/range {v20 .. v20}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v20

    invoke-static/range {v19 .. v20}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    .line 3277
    const-string v19, "UniSDK Base"

    new-instance v20, Ljava/lang/StringBuilder;

    invoke-direct/range {v20 .. v20}, Ljava/lang/StringBuilder;-><init>()V

    const-string v21, "type="

    invoke-virtual/range {v20 .. v21}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    move-object/from16 v0, v20

    move-object/from16 v1, v17

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    invoke-virtual/range {v20 .. v20}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v20

    invoke-static/range {v19 .. v20}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    .line 3278
    const-string v19, "UniSDK Base"

    new-instance v20, Ljava/lang/StringBuilder;

    invoke-direct/range {v20 .. v20}, Ljava/lang/StringBuilder;-><init>()V

    const-string v21, "timeString="

    invoke-virtual/range {v20 .. v21}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    move-object/from16 v0, v20

    move-object/from16 v1, v16

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    invoke-virtual/range {v20 .. v20}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v20

    invoke-static/range {v19 .. v20}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    .line 3279
    const-string v19, "UniSDK Base"

    new-instance v20, Ljava/lang/StringBuilder;

    invoke-direct/range {v20 .. v20}, Ljava/lang/StringBuilder;-><init>()V

    const-string v21, "ip="

    invoke-virtual/range {v20 .. v21}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    move-object/from16 v0, v20

    invoke-virtual {v0, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    invoke-virtual/range {v20 .. v20}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v20

    invoke-static/range {v19 .. v20}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    .line 3280
    const-string v19, "UniSDK Base"

    new-instance v20, Ljava/lang/StringBuilder;

    invoke-direct/range {v20 .. v20}, Ljava/lang/StringBuilder;-><init>()V

    const-string v21, "device="

    invoke-virtual/range {v20 .. v21}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    move-object/from16 v0, v20

    invoke-virtual {v0, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    invoke-virtual/range {v20 .. v20}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v20

    invoke-static/range {v19 .. v20}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    .line 3281
    const-string v19, "UniSDK Base"

    new-instance v20, Ljava/lang/StringBuilder;

    invoke-direct/range {v20 .. v20}, Ljava/lang/StringBuilder;-><init>()V

    const-string v21, "os_ver="

    invoke-virtual/range {v20 .. v21}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    move-object/from16 v0, v20

    invoke-virtual {v0, v13}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    invoke-virtual/range {v20 .. v20}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v20

    invoke-static/range {v19 .. v20}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    .line 3282
    const-string v19, "UniSDK Base"

    new-instance v20, Ljava/lang/StringBuilder;

    invoke-direct/range {v20 .. v20}, Ljava/lang/StringBuilder;-><init>()V

    const-string v21, "mac="

    invoke-virtual/range {v20 .. v21}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    move-object/from16 v0, v20

    invoke-virtual {v0, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    invoke-virtual/range {v20 .. v20}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v20

    invoke-static/range {v19 .. v20}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    .line 3283
    const-string v19, "UniSDK Base"

    new-instance v20, Ljava/lang/StringBuilder;

    invoke-direct/range {v20 .. v20}, Ljava/lang/StringBuilder;-><init>()V

    const-string v21, "idfa="

    invoke-virtual/range {v20 .. v21}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    move-object/from16 v0, v20

    invoke-virtual {v0, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    invoke-virtual/range {v20 .. v20}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v20

    invoke-static/range {v19 .. v20}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    .line 3284
    const-string v19, "UniSDK Base"

    new-instance v20, Ljava/lang/StringBuilder;

    invoke-direct/range {v20 .. v20}, Ljava/lang/StringBuilder;-><init>()V

    const-string v21, "app_channel="

    invoke-virtual/range {v20 .. v21}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    move-object/from16 v0, v20

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    invoke-virtual/range {v20 .. v20}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v20

    invoke-static/range {v19 .. v20}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    .line 3285
    const-string v19, "UniSDK Base"

    new-instance v20, Ljava/lang/StringBuilder;

    invoke-direct/range {v20 .. v20}, Ljava/lang/StringBuilder;-><init>()V

    const-string v21, "app_ver="

    invoke-virtual/range {v20 .. v21}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    move-object/from16 v0, v20

    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    invoke-virtual/range {v20 .. v20}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v20

    invoke-static/range {v19 .. v20}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    .line 3287
    const-string v11, ""

    .line 3289
    .local v11, "jsonToSend":Ljava/lang/String;
    :try_start_4
    const-string v19, "os"

    const-string v20, "android"

    move-object/from16 v0, v19

    move-object/from16 v1, v20

    invoke-virtual {v10, v0, v1}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 3290
    const-string v19, "time"

    move-object/from16 v0, v19

    move-object/from16 v1, v16

    invoke-virtual {v10, v0, v1}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 3291
    const-string v19, "ip"

    move-object/from16 v0, v19

    invoke-virtual {v10, v0, v9}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 3292
    const-string v19, "device"

    move-object/from16 v0, v19

    invoke-virtual {v10, v0, v5}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 3293
    const-string v19, "os_ver"

    move-object/from16 v0, v19

    invoke-virtual {v10, v0, v13}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 3294
    const-string v19, "mac"

    move-object/from16 v0, v19

    invoke-virtual {v10, v0, v12}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 3295
    const-string v19, "idfa"

    move-object/from16 v0, v19

    invoke-virtual {v10, v0, v8}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 3296
    const-string v19, "app_channel"

    move-object/from16 v0, v19

    invoke-virtual {v10, v0, v2}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 3297
    const-string v19, "app_ver"

    move-object/from16 v0, v19

    invoke-virtual {v10, v0, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 3298
    invoke-virtual {v10}, Lorg/json/JSONObject;->toString()Ljava/lang/String;
    :try_end_4
    .catch Ljava/lang/Exception; {:try_start_4 .. :try_end_4} :catch_4

    move-result-object v11

    .line 3303
    :goto_5
    invoke-static {v11}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v19

    if-eqz v19, :cond_7

    .line 3304
    const/16 v19, 0x4

    goto/16 :goto_1

    .line 3299
    :catch_4
    move-exception v6

    .line 3300
    .restart local v6    # "e":Ljava/lang/Exception;
    const-string v11, ""

    .line 3301
    invoke-virtual {v6}, Ljava/lang/Exception;->printStackTrace()V

    goto :goto_5

    .line 3306
    .end local v6    # "e":Ljava/lang/Exception;
    :cond_7
    const-string v19, "UniSDK Base"

    new-instance v20, Ljava/lang/StringBuilder;

    invoke-direct/range {v20 .. v20}, Ljava/lang/StringBuilder;-><init>()V

    const-string v21, "jsonToSend="

    invoke-virtual/range {v20 .. v21}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    move-object/from16 v0, v20

    invoke-virtual {v0, v11}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    invoke-virtual/range {v20 .. v20}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v20

    invoke-static/range {v19 .. v20}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    .line 3308
    new-instance v19, Ljava/lang/StringBuilder;

    invoke-direct/range {v19 .. v19}, Ljava/lang/StringBuilder;-><init>()V

    const-string v20, "http://"

    invoke-virtual/range {v19 .. v20}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v19

    move-object/from16 v0, v19

    invoke-virtual {v0, v14}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v19

    const-string v20, ".drpf.x.netease.com/"

    invoke-virtual/range {v19 .. v20}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v19

    invoke-virtual/range {v19 .. v19}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v18

    .line 3309
    .local v18, "url":Ljava/lang/String;
    const-string v19, "UniSDK Base"

    new-instance v20, Ljava/lang/StringBuilder;

    invoke-direct/range {v20 .. v20}, Ljava/lang/StringBuilder;-><init>()V

    const-string v21, "url="

    invoke-virtual/range {v20 .. v21}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    move-object/from16 v0, v20

    move-object/from16 v1, v18

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v20

    invoke-virtual/range {v20 .. v20}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v20

    invoke-static/range {v19 .. v20}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    .line 3310
    const/16 v19, 0x0

    move-object/from16 v0, v18

    move-object/from16 v1, v19

    invoke-static {v0, v11, v1}, Lcom/netease/ntunisdk/base/utils/NetUtil;->wpost(Ljava/lang/String;Ljava/lang/String;Lcom/netease/ntunisdk/base/utils/WgetDoneCallback;)V

    move/from16 v19, v7

    .line 3318
    goto/16 :goto_1
.end method

.method public anonymousLogin()V
    .locals 0

    .prologue
    .line 2726
    return-void
.end method

.method public antiAddiction(Ljava/lang/String;)V
    .locals 0
    .param p1, "accessToken"    # Ljava/lang/String;

    .prologue
    .line 1832
    return-void
.end method

.method public applyFriend(Ljava/lang/String;)V
    .locals 0
    .param p1, "accountId"    # Ljava/lang/String;

    .prologue
    .line 1897
    return-void
.end method

.method public applyFriendFinished(Z)V
    .locals 3
    .param p1, "result"    # Z

    .prologue
    .line 1918
    sget-boolean v1, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v1, :cond_0

    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->friendListener:Lcom/netease/ntunisdk/base/QueryFriendListener;

    if-nez v1, :cond_0

    new-instance v1, Ljava/lang/AssertionError;

    const-string v2, "QueryFriendListener not set"

    invoke-direct {v1, v2}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v1

    .line 1919
    :cond_0
    const-string v1, "FRIEND_CALLER_THREAD"

    const/4 v2, 0x1

    invoke-virtual {p0, v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v1

    const/4 v2, 0x2

    if-ne v1, v2, :cond_1

    .line 1920
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$29;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$29;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Z)V

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 1937
    :goto_0
    return-void

    .line 1928
    :cond_1
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 1929
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$30;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$30;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Z)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    goto :goto_0
.end method

.method public ccStartService()V
    .locals 0

    .prologue
    .line 3054
    return-void
.end method

.method public ccStopService()V
    .locals 0

    .prologue
    .line 3074
    return-void
.end method

.method public abstract checkOrder(Lcom/netease/ntunisdk/base/OrderInfo;)V
.end method

.method public checkOrderDone(Lcom/netease/ntunisdk/base/OrderInfo;)V
    .locals 4
    .param p1, "oi"    # Lcom/netease/ntunisdk/base/OrderInfo;

    .prologue
    .line 841
    sget-boolean v0, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v0, :cond_0

    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->orderListener:Lcom/netease/ntunisdk/base/OnOrderCheckListener;

    if-nez v0, :cond_0

    new-instance v0, Ljava/lang/AssertionError;

    const-string v1, "OnOrderCheckListener not set"

    invoke-direct {v0, v1}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v0

    .line 842
    :cond_0
    sget-boolean v0, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v0, :cond_1

    iget-wide v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->uiThreadId:J

    invoke-static {}, Ljava/lang/Thread;->currentThread()Ljava/lang/Thread;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/Thread;->getId()J

    move-result-wide v2

    cmp-long v0, v0, v2

    if-eqz v0, :cond_1

    new-instance v0, Ljava/lang/AssertionError;

    const-string v1, "checkOrderDone function can only by execute in UI thread"

    invoke-direct {v0, v1}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v0

    .line 845
    :cond_1
    const-string v0, "REQUEST_UNISDK_SERVER"

    invoke-virtual {p0, v0}, Lcom/netease/ntunisdk/base/SdkBase;->hasFeature(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_2

    .line 846
    invoke-direct {p0, p1}, Lcom/netease/ntunisdk/base/SdkBase;->queryMpayResult(Lcom/netease/ntunisdk/base/OrderInfo;)V

    .line 849
    :cond_2
    const-string v0, "ORDER_CALLER_THREAD"

    const/4 v1, 0x1

    invoke-virtual {p0, v0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v0

    const/4 v1, 0x2

    if-ne v0, v1, :cond_3

    .line 850
    new-instance v0, Lcom/netease/ntunisdk/base/SdkBase$9;

    invoke-direct {v0, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$9;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Lcom/netease/ntunisdk/base/OrderInfo;)V

    invoke-virtual {p0, v0}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 860
    :goto_0
    return-void

    .line 857
    :cond_3
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->orderListener:Lcom/netease/ntunisdk/base/OnOrderCheckListener;

    invoke-interface {v0, p1}, Lcom/netease/ntunisdk/base/OnOrderCheckListener;->orderCheckDone(Lcom/netease/ntunisdk/base/OrderInfo;)V

    goto :goto_0
.end method

.method public choosePayChannel(Ljava/util/Map;)Ljava/lang/String;
    .locals 11
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/Map",
            "<",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            ">;)",
            "Ljava/lang/String;"
        }
    .end annotation

    .prologue
    .local p1, "sdkPids":Ljava/util/Map;, "Ljava/util/Map<Ljava/lang/String;Ljava/lang/String;>;"
    const/4 v10, 0x1

    .line 738
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v1

    .line 746
    .local v1, "defaultPayChannel":Ljava/lang/String;
    const-string v7, "UniSDK Base"

    new-instance v8, Ljava/lang/StringBuilder;

    invoke-direct {v8}, Ljava/lang/StringBuilder;-><init>()V

    const-string v9, "defaultChannel: "

    invoke-virtual {v8, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v8

    invoke-static {v7, v8}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 748
    if-eqz p1, :cond_0

    invoke-interface {p1}, Ljava/util/Map;->size()I

    move-result v7

    if-nez v7, :cond_1

    .line 749
    :cond_0
    const-string v7, "UniSDK Base"

    new-instance v8, Ljava/lang/StringBuilder;

    invoke-direct {v8}, Ljava/lang/StringBuilder;-><init>()V

    const-string v9, "sdkPids is null, use  defaultPayChannel: "

    invoke-virtual {v8, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v8

    invoke-static {v7, v8}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 788
    .end local v1    # "defaultPayChannel":Ljava/lang/String;
    :goto_0
    return-object v1

    .line 751
    .restart local v1    # "defaultPayChannel":Ljava/lang/String;
    :cond_1
    iget-object v7, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v7}, Ljava/util/Map;->isEmpty()Z

    move-result v7

    if-eqz v7, :cond_2

    .line 752
    const-string v7, "UniSDK Base"

    new-instance v8, Ljava/lang/StringBuilder;

    invoke-direct {v8}, Ljava/lang/StringBuilder;-><init>()V

    const-string v9, "sdkInstMap is empty, use  defaultPayChannel: "

    invoke-virtual {v8, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v8

    invoke-static {v7, v8}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    goto :goto_0

    .line 756
    :cond_2
    const/4 v3, 0x0

    .line 757
    .local v3, "telecomInstCnt":I
    iget-object v7, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v7}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v7

    invoke-interface {v7}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v4

    .line 758
    .local v4, "telecomIt":Ljava/util/Iterator;
    :cond_3
    :goto_1
    invoke-interface {v4}, Ljava/util/Iterator;->hasNext()Z

    move-result v7

    if-eqz v7, :cond_4

    .line 759
    invoke-interface {v4}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/lang/String;

    .line 760
    .local v0, "apkHasChannel":Ljava/lang/String;
    invoke-virtual {p0, v0}, Lcom/netease/ntunisdk/base/SdkBase;->isTelecomChannel(Ljava/lang/String;)Z

    move-result v7

    if-eqz v7, :cond_3

    .line 761
    add-int/lit8 v3, v3, 0x1

    goto :goto_1

    .line 764
    .end local v0    # "apkHasChannel":Ljava/lang/String;
    :cond_4
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v7

    invoke-virtual {p0, v7}, Lcom/netease/ntunisdk/base/SdkBase;->isTelecomChannel(Ljava/lang/String;)Z

    move-result v7

    if-eqz v7, :cond_5

    .line 765
    add-int/lit8 v3, v3, 0x1

    .line 767
    :cond_5
    const-string v7, "UniSDK Base"

    new-instance v8, Ljava/lang/StringBuilder;

    invoke-direct {v8}, Ljava/lang/StringBuilder;-><init>()V

    const-string v9, "telecomInstCnt: "

    invoke-virtual {v8, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8, v3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v8

    invoke-static {v7, v8}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 769
    invoke-interface {p1}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v7

    invoke-interface {v7}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v2

    .line 770
    .local v2, "it":Ljava/util/Iterator;
    :cond_6
    invoke-interface {v2}, Ljava/util/Iterator;->hasNext()Z

    move-result v7

    if-eqz v7, :cond_8

    .line 771
    invoke-interface {v2}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v5

    check-cast v5, Ljava/lang/String;

    .line 773
    .local v5, "wantChannel":Ljava/lang/String;
    iget-object v7, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v7, v5}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v6

    check-cast v6, Lcom/netease/ntunisdk/base/SdkBase;

    .line 774
    .local v6, "wantSdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    if-eqz v6, :cond_6

    .line 778
    invoke-virtual {p0, v5}, Lcom/netease/ntunisdk/base/SdkBase;->isTelecomChannel(Ljava/lang/String;)Z

    move-result v7

    if-eqz v7, :cond_7

    if-eq v3, v10, :cond_7

    invoke-virtual {p0, v5}, Lcom/netease/ntunisdk/base/SdkBase;->isValidTelecomChannel(Ljava/lang/String;)Z

    move-result v7

    if-nez v7, :cond_7

    const-string v7, "HAS_3N"

    const/4 v8, 0x0

    invoke-virtual {v6, v7, v8}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v7

    if-ne v7, v10, :cond_6

    .line 782
    :cond_7
    const-string v7, "UniSDK Base"

    new-instance v8, Ljava/lang/StringBuilder;

    invoke-direct {v8}, Ljava/lang/StringBuilder;-><init>()V

    const-string v9, "choose payChannel: "

    invoke-virtual {v8, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v8

    invoke-static {v7, v8}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    move-object v1, v5

    .line 783
    goto/16 :goto_0

    .line 787
    .end local v5    # "wantChannel":Ljava/lang/String;
    .end local v6    # "wantSdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_8
    const-string v7, "UniSDK Base"

    new-instance v8, Ljava/lang/StringBuilder;

    invoke-direct {v8}, Ljava/lang/StringBuilder;-><init>()V

    const-string v9, "sdkInstMap dont match, use  defaultPayChannel: "

    invoke-virtual {v8, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v8

    invoke-static {v7, v8}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    goto/16 :goto_0
.end method

.method protected collectEvent(Ljava/lang/String;)V
    .locals 0
    .param p1, "eventId"    # Ljava/lang/String;

    .prologue
    .line 3125
    return-void
.end method

.method protected consume(Lcom/netease/ntunisdk/base/OrderInfo;)V
    .locals 0
    .param p1, "order"    # Lcom/netease/ntunisdk/base/OrderInfo;

    .prologue
    .line 549
    return-void
.end method

.method public consumeOrderDone(Lcom/netease/ntunisdk/base/OrderInfo;)V
    .locals 4
    .param p1, "oi"    # Lcom/netease/ntunisdk/base/OrderInfo;

    .prologue
    .line 3559
    sget-boolean v0, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v0, :cond_0

    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->orderListener:Lcom/netease/ntunisdk/base/OnOrderCheckListener;

    if-nez v0, :cond_0

    new-instance v0, Ljava/lang/AssertionError;

    const-string v1, "OnOrderCheckListener not set"

    invoke-direct {v0, v1}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v0

    .line 3560
    :cond_0
    sget-boolean v0, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v0, :cond_1

    iget-wide v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->uiThreadId:J

    invoke-static {}, Ljava/lang/Thread;->currentThread()Ljava/lang/Thread;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/Thread;->getId()J

    move-result-wide v2

    cmp-long v0, v0, v2

    if-eqz v0, :cond_1

    new-instance v0, Ljava/lang/AssertionError;

    const-string v1, "consumeOrderDone function can only by execute in UI thread"

    invoke-direct {v0, v1}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v0

    .line 3561
    :cond_1
    const-string v0, "ORDER_CALLER_THREAD"

    const/4 v1, 0x1

    invoke-virtual {p0, v0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v0

    const/4 v1, 0x2

    if-ne v0, v1, :cond_2

    .line 3562
    new-instance v0, Lcom/netease/ntunisdk/base/SdkBase$102;

    invoke-direct {v0, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$102;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Lcom/netease/ntunisdk/base/OrderInfo;)V

    invoke-virtual {p0, v0}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 3571
    :goto_0
    return-void

    .line 3569
    :cond_2
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->orderListener:Lcom/netease/ntunisdk/base/OnOrderCheckListener;

    invoke-interface {v0, p1}, Lcom/netease/ntunisdk/base/OnOrderCheckListener;->orderConsumeDone(Lcom/netease/ntunisdk/base/OrderInfo;)V

    goto :goto_0
.end method

.method public continueDone()V
    .locals 4

    .prologue
    .line 988
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->continueListener:Lcom/netease/ntunisdk/base/OnContinueListener;

    if-nez v0, :cond_0

    .line 1002
    :goto_0
    return-void

    .line 991
    :cond_0
    sget-boolean v0, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v0, :cond_1

    iget-wide v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->uiThreadId:J

    invoke-static {}, Ljava/lang/Thread;->currentThread()Ljava/lang/Thread;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/Thread;->getId()J

    move-result-wide v2

    cmp-long v0, v0, v2

    if-eqz v0, :cond_1

    new-instance v0, Ljava/lang/AssertionError;

    const-string v1, "continueDone function can only by execute in UI thread"

    invoke-direct {v0, v1}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v0

    .line 992
    :cond_1
    const-string v0, "CONTINUE_CALLER_THREAD"

    const/4 v1, 0x1

    invoke-virtual {p0, v0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v0

    const/4 v1, 0x2

    if-ne v0, v1, :cond_2

    .line 993
    new-instance v0, Lcom/netease/ntunisdk/base/SdkBase$14;

    invoke-direct {v0, p0}, Lcom/netease/ntunisdk/base/SdkBase$14;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {p0, v0}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    goto :goto_0

    .line 1000
    :cond_2
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->continueListener:Lcom/netease/ntunisdk/base/OnContinueListener;

    invoke-interface {v0}, Lcom/netease/ntunisdk/base/OnContinueListener;->continueGame()V

    goto :goto_0
.end method

.method protected deleteInviters(Ljava/util/List;)V
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
    .line 3442
    .local p1, "inviterPlayerIDList":Ljava/util/List;, "Ljava/util/List<Ljava/lang/String;>;"
    return-void
.end method

.method public displayAchievement()V
    .locals 0

    .prologue
    .line 3639
    return-void
.end method

.method public displayLeaderboard(Ljava/lang/String;)V
    .locals 0
    .param p1, "leaderboardId"    # Ljava/lang/String;

    .prologue
    .line 3622
    return-void
.end method

.method protected doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V
    .locals 5
    .param p1, "json"    # Lorg/json/JSONObject;
    .param p2, "tag"    # Ljava/lang/String;

    .prologue
    .line 220
    const/4 v1, 0x0

    .line 221
    .local v1, "val":Ljava/lang/String;
    invoke-virtual {p1, p2}, Lorg/json/JSONObject;->has(Ljava/lang/String;)Z

    move-result v2

    if-nez v2, :cond_1

    .line 234
    :cond_0
    :goto_0
    return-void

    .line 226
    :cond_1
    :try_start_0
    invoke-virtual {p1, p2}, Lorg/json/JSONObject;->getString(Ljava/lang/String;)Ljava/lang/String;
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    move-result-object v1

    .line 230
    :goto_1
    if-eqz v1, :cond_0

    invoke-virtual {p0, p2}, Lcom/netease/ntunisdk/base/SdkBase;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    if-nez v2, :cond_0

    .line 231
    const-string v2, "UniSDK Base"

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    const-string v4, "doConfigVal:"

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    const-string v4, "->"

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 232
    invoke-virtual {p0, p2, v1}, Lcom/netease/ntunisdk/base/SdkBase;->setPropStr(Ljava/lang/String;Ljava/lang/String;)V

    goto :goto_0

    .line 227
    :catch_0
    move-exception v0

    .line 228
    .local v0, "e":Lorg/json/JSONException;
    const-string v2, "UniSDK Base"

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    const-string v4, "no tag:"

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    goto :goto_1
.end method

.method public doSdkRealNameRegister()V
    .locals 0

    .prologue
    .line 1849
    return-void
.end method

.method public exit()V
    .locals 4

    .prologue
    .line 1074
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->resetFields()V

    .line 1076
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 1077
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 1078
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2}, Lcom/netease/ntunisdk/base/SdkBase;->exit()V

    goto :goto_0

    .line 1080
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    return-void
.end method

.method public exitDone()V
    .locals 4

    .prologue
    .line 1008
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->exitViewListener:Lcom/netease/ntunisdk/base/OnExitListener;

    if-nez v0, :cond_0

    .line 1022
    :goto_0
    return-void

    .line 1011
    :cond_0
    sget-boolean v0, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v0, :cond_1

    iget-wide v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->uiThreadId:J

    invoke-static {}, Ljava/lang/Thread;->currentThread()Ljava/lang/Thread;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/Thread;->getId()J

    move-result-wide v2

    cmp-long v0, v0, v2

    if-eqz v0, :cond_1

    new-instance v0, Ljava/lang/AssertionError;

    const-string v1, "exitDone function can only by execute in UI thread"

    invoke-direct {v0, v1}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v0

    .line 1012
    :cond_1
    const-string v0, "EXIT_CALLER_THREAD"

    const/4 v1, 0x1

    invoke-virtual {p0, v0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v0

    const/4 v1, 0x2

    if-ne v0, v1, :cond_2

    .line 1013
    new-instance v0, Lcom/netease/ntunisdk/base/SdkBase$15;

    invoke-direct {v0, p0}, Lcom/netease/ntunisdk/base/SdkBase$15;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {p0, v0}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    goto :goto_0

    .line 1020
    :cond_2
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->exitViewListener:Lcom/netease/ntunisdk/base/OnExitListener;

    invoke-interface {v0}, Lcom/netease/ntunisdk/base/OnExitListener;->exitApp()V

    goto :goto_0
.end method

.method protected gameLoginSuccess()V
    .locals 0

    .prologue
    .line 2326
    return-void
.end method

.method public getAppChannel()Ljava/lang/String;
    .locals 3

    .prologue
    .line 1446
    const-string v0, "UniSDK Base"

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v2, "APP_CHANNEL:"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v2, "APP_CHANNEL"

    invoke-virtual {p0, v2}, Lcom/netease/ntunisdk/base/SdkBase;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 1447
    const-string v0, "APP_CHANNEL"

    invoke-virtual {p0, v0}, Lcom/netease/ntunisdk/base/SdkBase;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public getAuthType()I
    .locals 1

    .prologue
    .line 2415
    const/4 v0, 0x1

    return v0
.end method

.method public getCCPerformance()I
    .locals 2

    .prologue
    .line 3084
    const-string v0, "CC_PERFORMANCE"

    const/4 v1, -0x1

    invoke-virtual {p0, v0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v0

    return v0
.end method

.method public getCCWindowState()I
    .locals 2

    .prologue
    .line 3092
    const-string v0, "CC_WINDOW_STATE"

    const/4 v1, 0x0

    invoke-virtual {p0, v0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v0

    return v0
.end method

.method public abstract getChannel()Ljava/lang/String;
.end method

.method public getChannelByImsi()Ljava/lang/String;
    .locals 4

    .prologue
    .line 794
    iget-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    const-string v3, "phone"

    invoke-virtual {v2, v3}, Landroid/content/Context;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Landroid/telephony/TelephonyManager;

    .line 795
    .local v1, "telephonyManager":Landroid/telephony/TelephonyManager;
    invoke-virtual {v1}, Landroid/telephony/TelephonyManager;->getSubscriberId()Ljava/lang/String;

    move-result-object v0

    .line 796
    .local v0, "IMSI":Ljava/lang/String;
    if-nez v0, :cond_0

    .line 797
    const-string v2, "CHANNEL_UNKNOW"

    .line 807
    :goto_0
    return-object v2

    .line 800
    :cond_0
    const-string v2, "46000"

    invoke-virtual {v0, v2}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v2

    if-nez v2, :cond_1

    const-string v2, "46002"

    invoke-virtual {v0, v2}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v2

    if-nez v2, :cond_1

    const-string v2, "46007"

    invoke-virtual {v0, v2}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v2

    if-eqz v2, :cond_2

    .line 801
    :cond_1
    const-string v2, "mm_10086"

    goto :goto_0

    .line 802
    :cond_2
    const-string v2, "46001"

    invoke-virtual {v0, v2}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v2

    if-eqz v2, :cond_3

    .line 803
    const-string v2, "wo_app"

    goto :goto_0

    .line 804
    :cond_3
    const-string v2, "46003"

    invoke-virtual {v0, v2}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v2

    if-eqz v2, :cond_4

    .line 805
    const-string v2, "play_telecom"

    goto :goto_0

    .line 807
    :cond_4
    const-string v2, "CHANNEL_UNKNOW"

    goto :goto_0
.end method

.method public getDeviceId()Ljava/lang/String;
    .locals 2

    .prologue
    .line 1268
    const-string v1, "DEVICE_ID"

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 1270
    .local v0, "deviceId":Ljava/lang/String;
    if-nez v0, :cond_0

    .line 1271
    const-string v0, "unknown_device"

    .line 1274
    .end local v0    # "deviceId":Ljava/lang/String;
    :cond_0
    return-object v0
.end method

.method protected getGlView()Landroid/opengl/GLSurfaceView;
    .locals 1

    .prologue
    .line 1418
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->glView:Landroid/opengl/GLSurfaceView;

    return-object v0
.end method

.method public abstract getLoginSession()Ljava/lang/String;
.end method

.method public abstract getLoginUid()Ljava/lang/String;
.end method

.method public getPayChannel()Ljava/lang/String;
    .locals 5

    .prologue
    .line 1454
    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    .line 1455
    .local v2, "sb":Ljava/lang/StringBuilder;
    iget-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v4}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v4

    invoke-interface {v4}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v4

    if-eqz v4, :cond_1

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 1456
    .local v1, "key":Ljava/lang/String;
    iget-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v4, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v3

    check-cast v3, Lcom/netease/ntunisdk/base/SdkBase;

    .line 1457
    .local v3, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2}, Ljava/lang/StringBuilder;->length()I

    move-result v4

    if-lez v4, :cond_0

    .line 1458
    const-string v4, "+"

    invoke-virtual {v2, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 1460
    :cond_0
    invoke-virtual {v3}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v2, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    goto :goto_0

    .line 1462
    .end local v1    # "key":Ljava/lang/String;
    .end local v3    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_1
    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    return-object v4
.end method

.method public getPayChannelByPid(Ljava/lang/String;)Ljava/lang/String;
    .locals 2
    .param p1, "pid"    # Ljava/lang/String;

    .prologue
    .line 1474
    invoke-static {p1}, Lcom/netease/ntunisdk/base/OrderInfo;->hasProduct(Ljava/lang/String;)Z

    move-result v1

    if-nez v1, :cond_0

    .line 1475
    const-string v1, ""

    .line 1478
    :goto_0
    return-object v1

    .line 1477
    :cond_0
    new-instance v0, Lcom/netease/ntunisdk/base/OrderInfo;

    invoke-direct {v0, p1}, Lcom/netease/ntunisdk/base/OrderInfo;-><init>(Ljava/lang/String;)V

    .line 1478
    .local v0, "oi":Lcom/netease/ntunisdk/base/OrderInfo;
    invoke-virtual {v0}, Lcom/netease/ntunisdk/base/OrderInfo;->getPayChannel()Ljava/lang/String;

    move-result-object v1

    goto :goto_0
.end method

.method public getPlatform()Ljava/lang/String;
    .locals 1

    .prologue
    .line 1485
    const-string v0, "ad"

    return-object v0
.end method

.method public getPropInt(Ljava/lang/String;I)I
    .locals 2
    .param p1, "prop"    # Ljava/lang/String;
    .param p2, "defaultVal"    # I

    .prologue
    .line 1330
    invoke-virtual {p0, p1}, Lcom/netease/ntunisdk/base/SdkBase;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    .line 1331
    .local v1, "val":Ljava/lang/String;
    if-nez v1, :cond_0

    .line 1338
    .end local p2    # "defaultVal":I
    :goto_0
    return p2

    .line 1336
    .restart local p2    # "defaultVal":I
    :cond_0
    :try_start_0
    invoke-static {v1}, Ljava/lang/Integer;->parseInt(Ljava/lang/String;)I
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    move-result p2

    goto :goto_0

    .line 1337
    :catch_0
    move-exception v0

    .line 1338
    .local v0, "e":Ljava/lang/Exception;
    goto :goto_0
.end method

.method public getPropStr(Ljava/lang/String;)Ljava/lang/String;
    .locals 3
    .param p1, "prop"    # Ljava/lang/String;

    .prologue
    .line 1291
    const-string v0, "FULL_UIN"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_0

    .line 1292
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->propDict:Ljava/util/Hashtable;

    const-string v1, "UIN"

    invoke-virtual {v0, v1}, Ljava/util/Hashtable;->containsKey(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_0

    .line 1293
    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->propDict:Ljava/util/Hashtable;

    const-string v2, "UIN"

    invoke-virtual {v0, v2}, Ljava/util/Hashtable;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/lang/String;

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, "@"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->getPlatform()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, "."

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ".win.163.com"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 1300
    :goto_0
    return-object v0

    .line 1296
    :cond_0
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->propDict:Ljava/util/Hashtable;

    invoke-virtual {v0, p1}, Ljava/util/Hashtable;->containsKey(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_1

    .line 1298
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->propDict:Ljava/util/Hashtable;

    invoke-virtual {v0, p1}, Ljava/util/Hashtable;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/lang/String;

    goto :goto_0

    .line 1300
    :cond_1
    const/4 v0, 0x0

    goto :goto_0
.end method

.method public getSDKVersion()Ljava/lang/String;
    .locals 1

    .prologue
    .line 2671
    const-string v0, ""

    return-object v0
.end method

.method public getSDKVersion(Ljava/lang/String;)Ljava/lang/String;
    .locals 5
    .param p1, "channelId"    # Ljava/lang/String;

    .prologue
    .line 2687
    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    .line 2688
    .local v2, "sb":Ljava/lang/StringBuilder;
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v4

    invoke-virtual {p1, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v4

    if-eqz v4, :cond_0

    .line 2689
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->getSDKVersion()Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v2, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 2691
    :cond_0
    iget-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v4}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v4

    invoke-interface {v4}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :cond_1
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v4

    if-eqz v4, :cond_3

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 2692
    .local v1, "key":Ljava/lang/String;
    iget-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v4, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v3

    check-cast v3, Lcom/netease/ntunisdk/base/SdkBase;

    .line 2693
    .local v3, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v3}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v4

    invoke-virtual {p1, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v4

    if-eqz v4, :cond_1

    .line 2694
    invoke-virtual {v2}, Ljava/lang/StringBuilder;->length()I

    move-result v4

    if-lez v4, :cond_2

    .line 2695
    const-string v4, "+"

    invoke-virtual {v2, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 2697
    :cond_2
    invoke-virtual {v3}, Lcom/netease/ntunisdk/base/SdkBase;->getSDKVersion()Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v2, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    goto :goto_0

    .line 2700
    .end local v1    # "key":Ljava/lang/String;
    .end local v3    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_3
    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    return-object v4
.end method

.method public getUdid()Ljava/lang/String;
    .locals 1

    .prologue
    .line 205
    const-string v0, "UDID"

    invoke-virtual {p0, v0}, Lcom/netease/ntunisdk/base/SdkBase;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method protected getUniSDKVersion()Ljava/lang/String;
    .locals 1

    .prologue
    .line 2680
    const-string v0, ""

    return-object v0
.end method

.method protected getUsePushNotification()V
    .locals 0

    .prologue
    .line 3513
    return-void
.end method

.method public getUserInfo(Ljava/lang/String;)Ljava/lang/String;
    .locals 1
    .param p1, "prop"    # Ljava/lang/String;

    .prologue
    .line 1798
    invoke-virtual {p0, p1}, Lcom/netease/ntunisdk/base/SdkBase;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public getUserPushFinished(Z)V
    .locals 3
    .param p1, "result"    # Z

    .prologue
    .line 2522
    sget-boolean v1, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v1, :cond_0

    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->pushListener:Lcom/netease/ntunisdk/base/OnPushListener;

    if-nez v1, :cond_0

    new-instance v1, Ljava/lang/AssertionError;

    const-string v2, "pushListener not set"

    invoke-direct {v1, v2}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v1

    .line 2523
    :cond_0
    const-string v1, "PUSH_CALLER_THREAD"

    const/4 v2, 0x1

    invoke-virtual {p0, v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v1

    const/4 v2, 0x2

    if-ne v1, v2, :cond_1

    .line 2524
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$65;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$65;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Z)V

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 2541
    :goto_0
    return-void

    .line 2532
    :cond_1
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2533
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$66;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$66;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Z)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    goto :goto_0
.end method

.method public guestBind()V
    .locals 0

    .prologue
    .line 1865
    return-void
.end method

.method public handleOnActivityResult(IILandroid/content/Intent;)V
    .locals 4
    .param p1, "requestCode"    # I
    .param p2, "resultCode"    # I
    .param p3, "data"    # Landroid/content/Intent;

    .prologue
    .line 1690
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 1691
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 1692
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2, p1, p2, p3}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnActivityResult(IILandroid/content/Intent;)V

    goto :goto_0

    .line 1694
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    invoke-virtual {p0, p1, p2, p3}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnActivityResult(IILandroid/content/Intent;)V

    .line 1695
    return-void
.end method

.method public handleOnBackPressed()V
    .locals 6

    .prologue
    .line 1593
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 1594
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 1595
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    const-string v3, "UniSDK Base"

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    const-string v5, "sdkBase"

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v2}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v3, v4}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 1596
    invoke-virtual {v2}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnBackPressed()V

    goto :goto_0

    .line 1598
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    const-string v3, "UniSDK Base"

    const-string v4, "handleOnPause:before sdkOnBackPressed"

    invoke-static {v3, v4}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 1599
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnBackPressed()V

    .line 1600
    return-void
.end method

.method public handleOnConfigurationChanged(Landroid/content/res/Configuration;)V
    .locals 4
    .param p1, "config"    # Landroid/content/res/Configuration;

    .prologue
    .line 2610
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 2611
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 2612
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2, p1}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnConfigurationChanged(Landroid/content/res/Configuration;)V

    goto :goto_0

    .line 2614
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    invoke-virtual {p0, p1}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnConfigurationChanged(Landroid/content/res/Configuration;)V

    .line 2615
    return-void
.end method

.method public handleOnCreate(Landroid/os/Bundle;)V
    .locals 4
    .param p1, "savedInstanceState"    # Landroid/os/Bundle;

    .prologue
    .line 2759
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 2760
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 2761
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2, p1}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnCreate(Landroid/os/Bundle;)V

    goto :goto_0

    .line 2763
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    invoke-virtual {p0, p1}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnCreate(Landroid/os/Bundle;)V

    .line 2764
    return-void
.end method

.method public handleOnDestroy()V
    .locals 4

    .prologue
    .line 1631
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 1632
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 1633
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnDestroy()V

    goto :goto_0

    .line 1635
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnDestroy()V

    .line 1636
    return-void
.end method

.method public handleOnLowMemory()V
    .locals 4

    .prologue
    .line 2777
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 2778
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 2779
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnLowMemory()V

    goto :goto_0

    .line 2781
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnLowMemory()V

    .line 2782
    return-void
.end method

.method public handleOnNewIntent(Landroid/content/Intent;)V
    .locals 4
    .param p1, "intent"    # Landroid/content/Intent;

    .prologue
    .line 2628
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 2629
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 2630
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2, p1}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnNewIntent(Landroid/content/Intent;)V

    goto :goto_0

    .line 2632
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    invoke-virtual {p0, p1}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnNewIntent(Landroid/content/Intent;)V

    .line 2633
    return-void
.end method

.method public handleOnPause()V
    .locals 4

    .prologue
    .line 1573
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 1574
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 1575
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnPause()V

    goto :goto_0

    .line 1577
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnPause()V

    .line 1578
    return-void
.end method

.method public handleOnRestart()V
    .locals 4

    .prologue
    .line 1665
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 1666
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 1667
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnRestart()V

    goto :goto_0

    .line 1669
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnRestart()V

    .line 1670
    return-void
.end method

.method public handleOnResume()V
    .locals 4

    .prologue
    .line 1648
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 1649
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 1650
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnResume()V

    goto :goto_0

    .line 1652
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnResume()V

    .line 1653
    return-void
.end method

.method public handleOnSaveInstanceState(Landroid/os/Bundle;)V
    .locals 4
    .param p1, "outState"    # Landroid/os/Bundle;

    .prologue
    .line 2740
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 2741
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 2742
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2, p1}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnSaveInstanceState(Landroid/os/Bundle;)V

    goto :goto_0

    .line 2744
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    invoke-virtual {p0, p1}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnSaveInstanceState(Landroid/os/Bundle;)V

    .line 2745
    return-void
.end method

.method public handleOnStart()V
    .locals 4

    .prologue
    .line 1538
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 1539
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 1540
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnStart()V

    goto :goto_0

    .line 1542
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnStart()V

    .line 1543
    return-void
.end method

.method public handleOnStop()V
    .locals 4

    .prologue
    .line 1614
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 1615
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 1616
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnStop()V

    goto :goto_0

    .line 1618
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnStop()V

    .line 1619
    return-void
.end method

.method public handleOnUserLeaveHint()V
    .locals 4

    .prologue
    .line 1562
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 1563
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 1564
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnUserLeaveHint()V

    goto :goto_0

    .line 1566
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnUserLeaveHint()V

    .line 1567
    return-void
.end method

.method public handleOnWindowFocusChanged(Z)V
    .locals 4
    .param p1, "hasFocus"    # Z

    .prologue
    .line 2592
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 2593
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 2594
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2, p1}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnWindowFocusChanged(Z)V

    goto :goto_0

    .line 2596
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    invoke-virtual {p0, p1}, Lcom/netease/ntunisdk/base/SdkBase;->sdkOnWindowFocusChanged(Z)V

    .line 2597
    return-void
.end method

.method public hasFeature(Ljava/lang/String;)Z
    .locals 6
    .param p1, "feature"    # Ljava/lang/String;

    .prologue
    const/4 v3, 0x1

    const/4 v4, 0x0

    .line 1364
    iget-object v5, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v5}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v5

    invoke-interface {v5}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :cond_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v5

    if-eqz v5, :cond_2

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 1365
    .local v1, "key":Ljava/lang/String;
    iget-object v5, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v5, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 1366
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2, p1, v4}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v5

    if-eqz v5, :cond_0

    .line 1370
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_1
    :goto_0
    return v3

    :cond_2
    invoke-virtual {p0, p1, v4}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v5

    if-nez v5, :cond_1

    move v3, v4

    goto :goto_0
.end method

.method protected hasInitAlready()Z
    .locals 2

    .prologue
    const/4 v0, 0x1

    .line 1706
    iget-boolean v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->hasInit:Z

    if-eqz v1, :cond_0

    .line 1710
    :goto_0
    return v0

    .line 1709
    :cond_0
    iput-boolean v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->hasInit:Z

    .line 1710
    const/4 v0, 0x0

    goto :goto_0
.end method

.method public hasLogin()Z
    .locals 3

    .prologue
    const/4 v0, 0x1

    const/4 v1, 0x0

    .line 1401
    const-string v2, "LOGIN_STAT"

    invoke-virtual {p0, v2, v1}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v2

    if-ne v2, v0, :cond_0

    :goto_0
    return v0

    :cond_0
    move v0, v1

    goto :goto_0
.end method

.method public abstract init(Lcom/netease/ntunisdk/base/OnFinishInitListener;)V
.end method

.method protected inviteFriendList(Ljava/lang/String;Ljava/lang/String;)V
    .locals 0
    .param p1, "message"    # Ljava/lang/String;
    .param p2, "title"    # Ljava/lang/String;

    .prologue
    .line 3348
    return-void
.end method

.method public inviteFriendListFinished(Ljava/util/List;)V
    .locals 3
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
    .line 3370
    .local p1, "inviteeIDList":Ljava/util/List;, "Ljava/util/List<Ljava/lang/String;>;"
    sget-boolean v1, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v1, :cond_0

    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->friendListener:Lcom/netease/ntunisdk/base/QueryFriendListener;

    if-nez v1, :cond_0

    new-instance v1, Ljava/lang/AssertionError;

    const-string v2, "QueryFriendListener not set"

    invoke-direct {v1, v2}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v1

    .line 3371
    :cond_0
    const-string v1, "FRIEND_CALLER_THREAD"

    const/4 v2, 0x1

    invoke-virtual {p0, v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v1

    const/4 v2, 0x2

    if-ne v1, v2, :cond_1

    .line 3372
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$92;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$92;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/util/List;)V

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 3389
    :goto_0
    return-void

    .line 3380
    :cond_1
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 3381
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$93;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$93;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/util/List;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    goto :goto_0
.end method

.method public inviterListFinished(Ljava/util/List;)V
    .locals 3
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
    .line 3416
    .local p1, "friends":Ljava/util/List;, "Ljava/util/List<Lcom/netease/ntunisdk/base/AccountInfo;>;"
    sget-boolean v1, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v1, :cond_0

    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->friendListener:Lcom/netease/ntunisdk/base/QueryFriendListener;

    if-nez v1, :cond_0

    new-instance v1, Ljava/lang/AssertionError;

    const-string v2, "QueryFriendListener not set"

    invoke-direct {v1, v2}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v1

    .line 3417
    :cond_0
    const-string v1, "FRIEND_CALLER_THREAD"

    const/4 v2, 0x1

    invoke-virtual {p0, v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v1

    const/4 v2, 0x2

    if-ne v1, v2, :cond_1

    .line 3418
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$95;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$95;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/util/List;)V

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 3435
    :goto_0
    return-void

    .line 3426
    :cond_1
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 3427
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$96;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$96;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/util/List;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    goto :goto_0
.end method

.method public isCCRecordMic()Z
    .locals 1

    .prologue
    .line 3675
    const/4 v0, 0x0

    return v0
.end method

.method public isCCRecording()Z
    .locals 1

    .prologue
    .line 3668
    const/4 v0, 0x0

    return v0
.end method

.method public isDarenUpdated()V
    .locals 0

    .prologue
    .line 2382
    return-void
.end method

.method public isDarenUpdatedFinished(Z)V
    .locals 3
    .param p1, "result"    # Z

    .prologue
    .line 2390
    sget-boolean v1, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v1, :cond_0

    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->friendListener:Lcom/netease/ntunisdk/base/QueryFriendListener;

    if-nez v1, :cond_0

    new-instance v1, Ljava/lang/AssertionError;

    const-string v2, "QueryFriendListener not set"

    invoke-direct {v1, v2}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v1

    .line 2391
    :cond_0
    const-string v1, "FRIEND_CALLER_THREAD"

    const/4 v2, 0x1

    invoke-virtual {p0, v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v1

    const/4 v2, 0x2

    if-ne v1, v2, :cond_1

    .line 2392
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$57;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$57;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Z)V

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 2409
    :goto_0
    return-void

    .line 2400
    :cond_1
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2401
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$58;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$58;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Z)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    goto :goto_0
.end method

.method public isLoginInst()Z
    .locals 1

    .prologue
    .line 2732
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    if-ne v0, p0, :cond_0

    const/4 v0, 0x1

    :goto_0
    return v0

    :cond_0
    const/4 v0, 0x0

    goto :goto_0
.end method

.method public isTelecomChannel(Ljava/lang/String;)Z
    .locals 1
    .param p1, "channeId"    # Ljava/lang/String;

    .prologue
    .line 2794
    const-string v0, "play_telecom"

    invoke-virtual {v0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    const-string v0, "play"

    invoke-virtual {v0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    const-string v0, "mm_10086"

    invoke-virtual {v0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    const-string v0, "g_10086"

    invoke-virtual {v0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    const-string v0, "wo_app"

    invoke-virtual {v0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_1

    .line 2799
    :cond_0
    const/4 v0, 0x1

    .line 2801
    :goto_0
    return v0

    :cond_1
    const/4 v0, 0x0

    goto :goto_0
.end method

.method public isValidOrderId(Ljava/lang/String;)Z
    .locals 2
    .param p1, "orderId"    # Ljava/lang/String;

    .prologue
    .line 2292
    invoke-virtual {p1}, Ljava/lang/String;->length()I

    move-result v0

    const/16 v1, 0x40

    if-le v0, v1, :cond_0

    .line 2293
    const/4 v0, 0x0

    .line 2295
    :goto_0
    return v0

    :cond_0
    const/4 v0, 0x1

    goto :goto_0
.end method

.method public isValidTelecomChannel(Ljava/lang/String;)Z
    .locals 3
    .param p1, "channelId"    # Ljava/lang/String;

    .prologue
    const/4 v1, 0x0

    .line 2809
    invoke-virtual {p0, p1}, Lcom/netease/ntunisdk/base/SdkBase;->isTelecomChannel(Ljava/lang/String;)Z

    move-result v2

    if-nez v2, :cond_1

    .line 2816
    :cond_0
    :goto_0
    return v1

    .line 2812
    :cond_1
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->getChannelByImsi()Ljava/lang/String;

    move-result-object v0

    .line 2813
    .local v0, "imeiChannel":Ljava/lang/String;
    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-nez v2, :cond_2

    const-string v2, "g_10086"

    invoke-virtual {v2, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_0

    const-string v2, "mm_10086"

    invoke-virtual {v2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_0

    .line 2814
    :cond_2
    const/4 v1, 0x1

    goto :goto_0
.end method

.method public leaveSdk(I)V
    .locals 4
    .param p1, "code"    # I

    .prologue
    .line 1052
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->leaveListener:Lcom/netease/ntunisdk/base/OnLeaveSdkListener;

    if-nez v0, :cond_0

    .line 1068
    :goto_0
    return-void

    .line 1055
    :cond_0
    sget-boolean v0, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v0, :cond_1

    iget-wide v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->uiThreadId:J

    invoke-static {}, Ljava/lang/Thread;->currentThread()Ljava/lang/Thread;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/Thread;->getId()J

    move-result-wide v2

    cmp-long v0, v0, v2

    if-eqz v0, :cond_1

    new-instance v0, Ljava/lang/AssertionError;

    const-string v1, "leaveSdk function can only by execute in UI thread"

    invoke-direct {v0, v1}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v0

    .line 1056
    :cond_1
    const-string v0, "LOGIN_CALLER_THREAD"

    const/4 v1, 0x1

    invoke-virtual {p0, v0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v0

    const/4 v1, 0x2

    if-ne v0, v1, :cond_2

    .line 1057
    new-instance v0, Lcom/netease/ntunisdk/base/SdkBase$17;

    invoke-direct {v0, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$17;-><init>(Lcom/netease/ntunisdk/base/SdkBase;I)V

    invoke-virtual {p0, v0}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    goto :goto_0

    .line 1065
    :cond_2
    const-string v0, "UniSDK Base"

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v2, "leave sdk : current thread:"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-static {}, Ljava/lang/Thread;->currentThread()Ljava/lang/Thread;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/Thread;->getId()J

    move-result-wide v2

    invoke-virtual {v1, v2, v3}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 1066
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->leaveListener:Lcom/netease/ntunisdk/base/OnLeaveSdkListener;

    invoke-interface {v0, p1}, Lcom/netease/ntunisdk/base/OnLeaveSdkListener;->leaveSdk(I)V

    goto :goto_0
.end method

.method public abstract login()V
.end method

.method public loginDone(I)V
    .locals 4
    .param p1, "code"    # I

    .prologue
    .line 497
    const-string v0, "LOGIN_CHANNEL"

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {p0, v0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->setPropStr(Ljava/lang/String;Ljava/lang/String;)V

    .line 498
    sget-boolean v0, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v0, :cond_0

    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->loginListener:Lcom/netease/ntunisdk/base/OnLoginDoneListener;

    if-nez v0, :cond_0

    new-instance v0, Ljava/lang/AssertionError;

    const-string v1, "OnLoginDoneListener not set"

    invoke-direct {v0, v1}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v0

    .line 499
    :cond_0
    sget-boolean v0, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v0, :cond_1

    iget-wide v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->uiThreadId:J

    invoke-static {}, Ljava/lang/Thread;->currentThread()Ljava/lang/Thread;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/Thread;->getId()J

    move-result-wide v2

    cmp-long v0, v0, v2

    if-eqz v0, :cond_1

    new-instance v0, Ljava/lang/AssertionError;

    const-string v1, "loginDone function can only by execute in UI thread"

    invoke-direct {v0, v1}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v0

    .line 500
    :cond_1
    const-string v0, "LOGIN_CALLER_THREAD"

    const/4 v1, 0x1

    invoke-virtual {p0, v0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v0

    const/4 v1, 0x2

    if-ne v0, v1, :cond_2

    .line 501
    new-instance v0, Lcom/netease/ntunisdk/base/SdkBase$4;

    invoke-direct {v0, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$4;-><init>(Lcom/netease/ntunisdk/base/SdkBase;I)V

    invoke-virtual {p0, v0}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 512
    :goto_0
    return-void

    .line 509
    :cond_2
    const-string v0, "UniSDK Base"

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v2, "runOnUIThread, loginDone: code="

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v2, ", current thread="

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-static {}, Ljava/lang/Thread;->currentThread()Ljava/lang/Thread;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/Thread;->getId()J

    move-result-wide v2

    invoke-virtual {v1, v2, v3}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 510
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->loginListener:Lcom/netease/ntunisdk/base/OnLoginDoneListener;

    invoke-interface {v0, p1}, Lcom/netease/ntunisdk/base/OnLoginDoneListener;->loginDone(I)V

    goto :goto_0
.end method

.method public abstract logout()V
.end method

.method public logoutDone(I)V
    .locals 4
    .param p1, "code"    # I

    .prologue
    .line 949
    sget-boolean v0, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v0, :cond_0

    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->logoutListener:Lcom/netease/ntunisdk/base/OnLogoutDoneListener;

    if-nez v0, :cond_0

    new-instance v0, Ljava/lang/AssertionError;

    const-string v1, "OnLogoutDoneListener not set"

    invoke-direct {v0, v1}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v0

    .line 950
    :cond_0
    sget-boolean v0, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v0, :cond_1

    iget-wide v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->uiThreadId:J

    invoke-static {}, Ljava/lang/Thread;->currentThread()Ljava/lang/Thread;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/Thread;->getId()J

    move-result-wide v2

    cmp-long v0, v0, v2

    if-eqz v0, :cond_1

    new-instance v0, Ljava/lang/AssertionError;

    const-string v1, "logoutDone function can only by execute in UI thread"

    invoke-direct {v0, v1}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v0

    .line 951
    :cond_1
    const-string v0, "LOGOUT_CALLER_THREAD"

    const/4 v1, 0x1

    invoke-virtual {p0, v0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v0

    const/4 v1, 0x2

    if-ne v0, v1, :cond_2

    .line 952
    new-instance v0, Lcom/netease/ntunisdk/base/SdkBase$12;

    invoke-direct {v0, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$12;-><init>(Lcom/netease/ntunisdk/base/SdkBase;I)V

    invoke-virtual {p0, v0}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 961
    :goto_0
    return-void

    .line 959
    :cond_2
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->logoutListener:Lcom/netease/ntunisdk/base/OnLogoutDoneListener;

    invoke-interface {v0, p1}, Lcom/netease/ntunisdk/base/OnLogoutDoneListener;->logoutDone(I)V

    goto :goto_0
.end method

.method public moreGame()V
    .locals 0

    .prologue
    .line 2665
    return-void
.end method

.method public ntAntiAddiction(Ljava/lang/String;)V
    .locals 2
    .param p1, "accessToken"    # Ljava/lang/String;

    .prologue
    .line 1839
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 1840
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$25;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$25;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/lang/String;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 1846
    return-void
.end method

.method public ntApplyFriend(Ljava/lang/String;)V
    .locals 2
    .param p1, "accountId"    # Ljava/lang/String;

    .prologue
    .line 1903
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 1904
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$28;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$28;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/lang/String;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 1910
    return-void
.end method

.method public ntCCStartService()V
    .locals 2

    .prologue
    .line 3040
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 3041
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$85;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$85;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 3051
    return-void
.end method

.method public ntCCStopService()V
    .locals 2

    .prologue
    .line 3060
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 3061
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$86;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$86;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 3071
    return-void
.end method

.method public ntCheckOrder(Lcom/netease/ntunisdk/base/OrderInfo;)V
    .locals 4
    .param p1, "order"    # Lcom/netease/ntunisdk/base/OrderInfo;

    .prologue
    .line 560
    invoke-static {}, Ljava/lang/Thread;->currentThread()Ljava/lang/Thread;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/Thread;->getId()J

    move-result-wide v1

    .line 561
    .local v1, "curThread":J
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 562
    .local v0, "act":Landroid/app/Activity;
    new-instance v3, Lcom/netease/ntunisdk/base/SdkBase$5;

    invoke-direct {v3, p0, v1, v2, p1}, Lcom/netease/ntunisdk/base/SdkBase$5;-><init>(Lcom/netease/ntunisdk/base/SdkBase;JLcom/netease/ntunisdk/base/OrderInfo;)V

    invoke-virtual {v0, v3}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 584
    return-void
.end method

.method public ntCollectEvent(Ljava/lang/String;)V
    .locals 2
    .param p1, "eventId"    # Ljava/lang/String;

    .prologue
    .line 3133
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 3134
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$88;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$88;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/lang/String;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 3140
    return-void
.end method

.method public ntConsume(Lcom/netease/ntunisdk/base/OrderInfo;)V
    .locals 2
    .param p1, "order"    # Lcom/netease/ntunisdk/base/OrderInfo;

    .prologue
    .line 2332
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2333
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$54;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$54;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Lcom/netease/ntunisdk/base/OrderInfo;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 2350
    return-void
.end method

.method public ntDeleteInviters(Ljava/util/List;)V
    .locals 2
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
    .line 3448
    .local p1, "inviterPlayerIDList":Ljava/util/List;, "Ljava/util/List<Ljava/lang/String;>;"
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 3449
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$97;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$97;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/util/List;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 3455
    return-void
.end method

.method public ntDisplayAchievement()V
    .locals 2

    .prologue
    .line 3625
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 3626
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$106;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$106;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 3636
    return-void
.end method

.method public ntDisplayLeaderboard(Ljava/lang/String;)V
    .locals 2
    .param p1, "leaderboardId"    # Ljava/lang/String;

    .prologue
    .line 3608
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 3609
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$105;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$105;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/lang/String;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 3619
    return-void
.end method

.method public ntDoSdkRealNameRegister()V
    .locals 2

    .prologue
    .line 1855
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 1856
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$26;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$26;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 1862
    return-void
.end method

.method public ntGameLoginSuccess()V
    .locals 2

    .prologue
    .line 2302
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2303
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$53;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$53;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 2320
    return-void
.end method

.method public ntGetUsePushNotification()V
    .locals 2

    .prologue
    .line 3520
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 3521
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$100;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$100;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 3527
    return-void
.end method

.method public ntGuestBind()V
    .locals 2

    .prologue
    .line 1871
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 1872
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$27;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$27;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 1878
    return-void
.end method

.method public ntInit(Lcom/netease/ntunisdk/base/OnFinishInitListener;)V
    .locals 2
    .param p1, "f"    # Lcom/netease/ntunisdk/base/OnFinishInitListener;

    .prologue
    .line 1714
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->hasInitAlready()Z

    move-result v0

    if-eqz v0, :cond_1

    .line 1715
    const-string v0, "UniSDK Base"

    const-string v1, "ntInit already"

    invoke-static {v0, v1}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 1724
    :cond_0
    :goto_0
    return-void

    .line 1719
    :cond_1
    const/4 v0, 0x0

    invoke-direct {p0, v0, p1}, Lcom/netease/ntunisdk/base/SdkBase;->initAllSdk(ILcom/netease/ntunisdk/base/OnFinishInitListener;)V

    .line 1720
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->retrieveUser:Lcom/netease/ntunisdk/base/RetrieveUser;

    if-eqz v0, :cond_0

    .line 1721
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->retrieveUser:Lcom/netease/ntunisdk/base/RetrieveUser;

    invoke-virtual {v0}, Lcom/netease/ntunisdk/base/RetrieveUser;->requestRetrieveUser4Device()V

    .line 1722
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->retrieveUser:Lcom/netease/ntunisdk/base/RetrieveUser;

    invoke-virtual {v0}, Lcom/netease/ntunisdk/base/RetrieveUser;->requestRetrieveUser4Config()V

    goto :goto_0
.end method

.method public ntInviteFriendList(Ljava/lang/String;Ljava/lang/String;)V
    .locals 2
    .param p1, "message"    # Ljava/lang/String;
    .param p2, "title"    # Ljava/lang/String;

    .prologue
    .line 3356
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 3357
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$91;

    invoke-direct {v1, p0, p1, p2}, Lcom/netease/ntunisdk/base/SdkBase$91;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/lang/String;Ljava/lang/String;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 3363
    return-void
.end method

.method public ntIsDarenUpdated()V
    .locals 2

    .prologue
    .line 2372
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2373
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$56;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$56;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 2379
    return-void
.end method

.method public ntLogin()V
    .locals 4

    .prologue
    .line 479
    invoke-static {}, Ljava/lang/Thread;->currentThread()Ljava/lang/Thread;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/Thread;->getId()J

    move-result-wide v1

    .line 480
    .local v1, "curThread":J
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 481
    .local v0, "act":Landroid/app/Activity;
    new-instance v3, Lcom/netease/ntunisdk/base/SdkBase$3;

    invoke-direct {v3, p0, v1, v2}, Lcom/netease/ntunisdk/base/SdkBase$3;-><init>(Lcom/netease/ntunisdk/base/SdkBase;J)V

    invoke-virtual {v0, v3}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 488
    return-void
.end method

.method public ntLogout()V
    .locals 2

    .prologue
    .line 933
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 934
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$11;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$11;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 940
    return-void
.end method

.method public ntMoreGame()V
    .locals 2

    .prologue
    .line 2645
    const-string v1, "FEATURE_HAS_MOREGAME_BTN"

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->hasFeature(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_0

    .line 2646
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2647
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$69;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$69;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 2662
    .end local v0    # "act":Landroid/app/Activity;
    :cond_0
    return-void
.end method

.method public ntOpenExitView()V
    .locals 2

    .prologue
    .line 1501
    const-string v1, "FEATURE_EXIT_VIEW"

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->hasFeature(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_0

    .line 1502
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 1503
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$22;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$22;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 1532
    .end local v0    # "act":Landroid/app/Activity;
    :cond_0
    return-void
.end method

.method public ntOpenGmView()V
    .locals 2

    .prologue
    .line 2279
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2280
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$52;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$52;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 2286
    return-void
.end method

.method public ntOpenManager()V
    .locals 2

    .prologue
    .line 1138
    const-string v1, "FEATURE_HAS_MANAGER"

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->hasFeature(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_0

    .line 1139
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 1140
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$18;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$18;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 1157
    .end local v0    # "act":Landroid/app/Activity;
    :cond_0
    return-void
.end method

.method public ntOpenNearby()V
    .locals 2

    .prologue
    .line 1204
    const-string v1, "FEATURE_HAS_NEARBY"

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->hasFeature(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_0

    .line 1205
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 1206
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$20;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$20;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 1223
    .end local v0    # "act":Landroid/app/Activity;
    :cond_0
    return-void
.end method

.method public ntOpenPauseView()V
    .locals 2

    .prologue
    .line 1235
    const-string v1, "FEATURE_HAS_PAUSE_VIEW"

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->hasFeature(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_0

    .line 1236
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 1237
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$21;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$21;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 1254
    .end local v0    # "act":Landroid/app/Activity;
    :cond_0
    return-void
.end method

.method public ntPrePay()V
    .locals 2

    .prologue
    .line 2713
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2714
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$70;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$70;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 2720
    return-void
.end method

.method public ntQueryAvailablesInvitees()V
    .locals 2

    .prologue
    .line 2036
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2037
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$37;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$37;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 2043
    return-void
.end method

.method public ntQueryFriendList()V
    .locals 2

    .prologue
    .line 1946
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 1947
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$31;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$31;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 1953
    return-void
.end method

.method public ntQueryFriendListInGame()V
    .locals 2

    .prologue
    .line 1960
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 1961
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$32;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$32;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 1967
    return-void
.end method

.method public ntQueryInviterList()V
    .locals 2

    .prologue
    .line 3402
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 3403
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$94;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$94;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 3409
    return-void
.end method

.method public ntQueryMyAccount()V
    .locals 2

    .prologue
    .line 2079
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2080
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$40;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$40;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 2086
    return-void
.end method

.method public ntQueryRank(Lcom/netease/ntunisdk/base/QueryRankInfo;)V
    .locals 2
    .param p1, "queryRank"    # Lcom/netease/ntunisdk/base/QueryRankInfo;

    .prologue
    .line 2138
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2139
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$43;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$43;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Lcom/netease/ntunisdk/base/QueryRankInfo;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 2149
    return-void
.end method

.method public ntQuerySkuDetails(Ljava/lang/String;Ljava/util/List;)V
    .locals 2
    .param p1, "itemType"    # Ljava/lang/String;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/lang/String;",
            "Ljava/util/List",
            "<",
            "Ljava/lang/String;",
            ">;)V"
        }
    .end annotation

    .prologue
    .line 2865
    .local p2, "sku":Ljava/util/List;, "Ljava/util/List<Ljava/lang/String;>;"
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2866
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$72;

    invoke-direct {v1, p0, p1, p2}, Lcom/netease/ntunisdk/base/SdkBase$72;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/lang/String;Ljava/util/List;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 2876
    return-void
.end method

.method public ntSendLocalNotification(Ljava/lang/String;)V
    .locals 2
    .param p1, "strJson"    # Ljava/lang/String;

    .prologue
    .line 3498
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 3499
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$99;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$99;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/lang/String;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 3505
    return-void
.end method

.method public ntSendPushNotification(Ljava/lang/String;Ljava/util/List;)V
    .locals 2
    .param p1, "message"    # Ljava/lang/String;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/lang/String;",
            "Ljava/util/List",
            "<",
            "Ljava/lang/String;",
            ">;)V"
        }
    .end annotation

    .prologue
    .line 3468
    .local p2, "playerIDList":Ljava/util/List;, "Ljava/util/List<Ljava/lang/String;>;"
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 3469
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$98;

    invoke-direct {v1, p0, p1, p2}, Lcom/netease/ntunisdk/base/SdkBase$98;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/lang/String;Ljava/util/List;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 3475
    return-void
.end method

.method public ntSetFloatBtnVisible(Z)V
    .locals 2
    .param p1, "v"    # Z

    .prologue
    .line 821
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 822
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$8;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$8;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Z)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 832
    return-void
.end method

.method public ntSetUsePushNotification(Z)V
    .locals 2
    .param p1, "use"    # Z

    .prologue
    .line 3542
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 3543
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$101;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$101;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Z)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 3549
    return-void
.end method

.method public ntShare(Lcom/netease/ntunisdk/base/ShareInfo;)V
    .locals 2
    .param p1, "shareInfo"    # Lcom/netease/ntunisdk/base/ShareInfo;

    .prologue
    .line 2263
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2264
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$51;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$51;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Lcom/netease/ntunisdk/base/ShareInfo;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 2270
    return-void
.end method

.method public ntShowBoard(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 2
    .param p1, "category"    # Ljava/lang/String;
    .param p2, "termId"    # Ljava/lang/String;
    .param p3, "title"    # Ljava/lang/String;

    .prologue
    .line 3160
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 3161
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$89;

    invoke-direct {v1, p0, p1, p2, p3}, Lcom/netease/ntunisdk/base/SdkBase$89;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 3167
    return-void
.end method

.method public ntShowConversation()V
    .locals 2

    .prologue
    .line 3574
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 3575
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$103;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$103;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 3585
    return-void
.end method

.method public ntShowDaren()V
    .locals 2

    .prologue
    .line 2356
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2357
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$55;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$55;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 2363
    return-void
.end method

.method public ntShowFAQs()V
    .locals 2

    .prologue
    .line 3591
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 3592
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$104;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$104;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 3602
    return-void
.end method

.method public ntShowRewardView(Ljava/util/List;)V
    .locals 2
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
    .line 3334
    .local p1, "rewardCodeList":Ljava/util/List;, "Ljava/util/List<Ljava/lang/String;>;"
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 3335
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$90;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$90;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/util/List;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 3341
    return-void
.end method

.method public ntShowWeb(Ljava/lang/String;)V
    .locals 2
    .param p1, "url"    # Ljava/lang/String;

    .prologue
    .line 3110
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 3111
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$87;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$87;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/lang/String;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 3117
    return-void
.end method

.method public ntSwitchAccount()V
    .locals 2

    .prologue
    .line 1171
    const-string v1, "FEATURE_HAS_SWITCH_ACCOUNT"

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->hasFeature(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_0

    .line 1172
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 1173
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$19;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$19;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 1190
    .end local v0    # "act":Landroid/app/Activity;
    :cond_0
    return-void
.end method

.method public ntUpLoadUserInfo()V
    .locals 2

    .prologue
    .line 1814
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 1815
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$24;

    invoke-direct {v1, p0}, Lcom/netease/ntunisdk/base/SdkBase$24;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 1825
    return-void
.end method

.method public ntUpdateAchievement(Ljava/lang/String;I)V
    .locals 2
    .param p1, "achievenmentId"    # Ljava/lang/String;
    .param p2, "step"    # I

    .prologue
    .line 3642
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 3643
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$107;

    invoke-direct {v1, p0, p1, p2}, Lcom/netease/ntunisdk/base/SdkBase$107;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/lang/String;I)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 3653
    return-void
.end method

.method public ntUpdateRank(Ljava/lang/String;D)V
    .locals 2
    .param p1, "rankType"    # Ljava/lang/String;
    .param p2, "score"    # D

    .prologue
    .line 2189
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2190
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$46;

    invoke-direct {v1, p0, p1, p2, p3}, Lcom/netease/ntunisdk/base/SdkBase$46;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/lang/String;D)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 2200
    return-void
.end method

.method public ntvGenericFunctionCall(Ljava/lang/String;)V
    .locals 0
    .param p1, "specs"    # Ljava/lang/String;

    .prologue
    .line 3662
    return-void
.end method

.method public onKeyDown(ILcom/netease/ntunisdk/base/PadEvent;)V
    .locals 3
    .param p1, "keyCode"    # I
    .param p2, "event"    # Lcom/netease/ntunisdk/base/PadEvent;

    .prologue
    .line 2905
    sget-boolean v1, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v1, :cond_0

    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->controllerListener:Lcom/netease/ntunisdk/base/OnControllerListener;

    if-nez v1, :cond_0

    new-instance v1, Ljava/lang/AssertionError;

    const-string v2, "OnControllerListener not set"

    invoke-direct {v1, v2}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v1

    .line 2906
    :cond_0
    const-string v1, "CONTROLLER_CALLER_THREAD"

    const/4 v2, 0x1

    invoke-virtual {p0, v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v1

    const/4 v2, 0x2

    if-ne v1, v2, :cond_1

    .line 2907
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$73;

    invoke-direct {v1, p0, p1, p2}, Lcom/netease/ntunisdk/base/SdkBase$73;-><init>(Lcom/netease/ntunisdk/base/SdkBase;ILcom/netease/ntunisdk/base/PadEvent;)V

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 2924
    :goto_0
    return-void

    .line 2915
    :cond_1
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2916
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$74;

    invoke-direct {v1, p0, p1, p2}, Lcom/netease/ntunisdk/base/SdkBase$74;-><init>(Lcom/netease/ntunisdk/base/SdkBase;ILcom/netease/ntunisdk/base/PadEvent;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    goto :goto_0
.end method

.method public onKeyPressure(IFLcom/netease/ntunisdk/base/PadEvent;)V
    .locals 3
    .param p1, "keyCode"    # I
    .param p2, "pressure"    # F
    .param p3, "event"    # Lcom/netease/ntunisdk/base/PadEvent;

    .prologue
    .line 2949
    sget-boolean v1, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v1, :cond_0

    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->controllerListener:Lcom/netease/ntunisdk/base/OnControllerListener;

    if-nez v1, :cond_0

    new-instance v1, Ljava/lang/AssertionError;

    const-string v2, "OnControllerListener not set"

    invoke-direct {v1, v2}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v1

    .line 2950
    :cond_0
    const-string v1, "CONTROLLER_CALLER_THREAD"

    const/4 v2, 0x1

    invoke-virtual {p0, v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v1

    const/4 v2, 0x2

    if-ne v1, v2, :cond_1

    .line 2951
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$77;

    invoke-direct {v1, p0, p1, p2, p3}, Lcom/netease/ntunisdk/base/SdkBase$77;-><init>(Lcom/netease/ntunisdk/base/SdkBase;IFLcom/netease/ntunisdk/base/PadEvent;)V

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 2968
    :goto_0
    return-void

    .line 2959
    :cond_1
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2960
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$78;

    invoke-direct {v1, p0, p1, p2, p3}, Lcom/netease/ntunisdk/base/SdkBase$78;-><init>(Lcom/netease/ntunisdk/base/SdkBase;IFLcom/netease/ntunisdk/base/PadEvent;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    goto :goto_0
.end method

.method public onKeyUp(ILcom/netease/ntunisdk/base/PadEvent;)V
    .locals 3
    .param p1, "keyCode"    # I
    .param p2, "event"    # Lcom/netease/ntunisdk/base/PadEvent;

    .prologue
    .line 2927
    sget-boolean v1, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v1, :cond_0

    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->controllerListener:Lcom/netease/ntunisdk/base/OnControllerListener;

    if-nez v1, :cond_0

    new-instance v1, Ljava/lang/AssertionError;

    const-string v2, "OnControllerListener not set"

    invoke-direct {v1, v2}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v1

    .line 2928
    :cond_0
    const-string v1, "CONTROLLER_CALLER_THREAD"

    const/4 v2, 0x1

    invoke-virtual {p0, v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v1

    const/4 v2, 0x2

    if-ne v1, v2, :cond_1

    .line 2929
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$75;

    invoke-direct {v1, p0, p1, p2}, Lcom/netease/ntunisdk/base/SdkBase$75;-><init>(Lcom/netease/ntunisdk/base/SdkBase;ILcom/netease/ntunisdk/base/PadEvent;)V

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 2946
    :goto_0
    return-void

    .line 2937
    :cond_1
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2938
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$76;

    invoke-direct {v1, p0, p1, p2}, Lcom/netease/ntunisdk/base/SdkBase$76;-><init>(Lcom/netease/ntunisdk/base/SdkBase;ILcom/netease/ntunisdk/base/PadEvent;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    goto :goto_0
.end method

.method public onLeftStick(FFLcom/netease/ntunisdk/base/PadEvent;)V
    .locals 3
    .param p1, "x"    # F
    .param p2, "y"    # F
    .param p3, "event"    # Lcom/netease/ntunisdk/base/PadEvent;

    .prologue
    .line 2971
    sget-boolean v1, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v1, :cond_0

    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->controllerListener:Lcom/netease/ntunisdk/base/OnControllerListener;

    if-nez v1, :cond_0

    new-instance v1, Ljava/lang/AssertionError;

    const-string v2, "OnControllerListener not set"

    invoke-direct {v1, v2}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v1

    .line 2972
    :cond_0
    const-string v1, "CONTROLLER_CALLER_THREAD"

    const/4 v2, 0x1

    invoke-virtual {p0, v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v1

    const/4 v2, 0x2

    if-ne v1, v2, :cond_1

    .line 2973
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$79;

    invoke-direct {v1, p0, p1, p2, p3}, Lcom/netease/ntunisdk/base/SdkBase$79;-><init>(Lcom/netease/ntunisdk/base/SdkBase;FFLcom/netease/ntunisdk/base/PadEvent;)V

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 2990
    :goto_0
    return-void

    .line 2981
    :cond_1
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2982
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$80;

    invoke-direct {v1, p0, p1, p2, p3}, Lcom/netease/ntunisdk/base/SdkBase$80;-><init>(Lcom/netease/ntunisdk/base/SdkBase;FFLcom/netease/ntunisdk/base/PadEvent;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    goto :goto_0
.end method

.method public onReceivedNotificationDone()V
    .locals 4

    .prologue
    .line 967
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->receiveMsgListener:Lcom/netease/ntunisdk/base/OnReceiveMsgListener;

    if-nez v0, :cond_0

    .line 968
    const-string v0, "UniSDK Base"

    const-string v1, "receiveMsgListener null"

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 982
    :goto_0
    return-void

    .line 971
    :cond_0
    sget-boolean v0, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v0, :cond_1

    iget-wide v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->uiThreadId:J

    invoke-static {}, Ljava/lang/Thread;->currentThread()Ljava/lang/Thread;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/Thread;->getId()J

    move-result-wide v2

    cmp-long v0, v0, v2

    if-eqz v0, :cond_1

    new-instance v0, Ljava/lang/AssertionError;

    const-string v1, "onReceivedNotificationDone function can only by execute in UI thread"

    invoke-direct {v0, v1}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v0

    .line 972
    :cond_1
    const-string v0, "CONTINUE_CALLER_THREAD"

    const/4 v1, 0x1

    invoke-virtual {p0, v0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v0

    const/4 v1, 0x2

    if-ne v0, v1, :cond_2

    .line 973
    new-instance v0, Lcom/netease/ntunisdk/base/SdkBase$13;

    invoke-direct {v0, p0}, Lcom/netease/ntunisdk/base/SdkBase$13;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {p0, v0}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    goto :goto_0

    .line 980
    :cond_2
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->receiveMsgListener:Lcom/netease/ntunisdk/base/OnReceiveMsgListener;

    invoke-interface {v0}, Lcom/netease/ntunisdk/base/OnReceiveMsgListener;->onReceivedNotification()V

    goto :goto_0
.end method

.method public onRightStick(FFLcom/netease/ntunisdk/base/PadEvent;)V
    .locals 3
    .param p1, "x"    # F
    .param p2, "y"    # F
    .param p3, "event"    # Lcom/netease/ntunisdk/base/PadEvent;

    .prologue
    .line 2993
    sget-boolean v1, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v1, :cond_0

    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->controllerListener:Lcom/netease/ntunisdk/base/OnControllerListener;

    if-nez v1, :cond_0

    new-instance v1, Ljava/lang/AssertionError;

    const-string v2, "OnControllerListener not set"

    invoke-direct {v1, v2}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v1

    .line 2994
    :cond_0
    const-string v1, "CONTROLLER_CALLER_THREAD"

    const/4 v2, 0x1

    invoke-virtual {p0, v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v1

    const/4 v2, 0x2

    if-ne v1, v2, :cond_1

    .line 2995
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$81;

    invoke-direct {v1, p0, p1, p2, p3}, Lcom/netease/ntunisdk/base/SdkBase$81;-><init>(Lcom/netease/ntunisdk/base/SdkBase;FFLcom/netease/ntunisdk/base/PadEvent;)V

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 3012
    :goto_0
    return-void

    .line 3003
    :cond_1
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 3004
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$82;

    invoke-direct {v1, p0, p1, p2, p3}, Lcom/netease/ntunisdk/base/SdkBase$82;-><init>(Lcom/netease/ntunisdk/base/SdkBase;FFLcom/netease/ntunisdk/base/PadEvent;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    goto :goto_0
.end method

.method public onStateEvent(Lcom/netease/ntunisdk/base/PadEvent;)V
    .locals 3
    .param p1, "event"    # Lcom/netease/ntunisdk/base/PadEvent;

    .prologue
    .line 3015
    sget-boolean v1, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v1, :cond_0

    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->controllerListener:Lcom/netease/ntunisdk/base/OnControllerListener;

    if-nez v1, :cond_0

    new-instance v1, Ljava/lang/AssertionError;

    const-string v2, "OnControllerListener not set"

    invoke-direct {v1, v2}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v1

    .line 3016
    :cond_0
    const-string v1, "CONTROLLER_CALLER_THREAD"

    const/4 v2, 0x1

    invoke-virtual {p0, v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v1

    const/4 v2, 0x2

    if-ne v1, v2, :cond_1

    .line 3017
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$83;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$83;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Lcom/netease/ntunisdk/base/PadEvent;)V

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 3034
    :goto_0
    return-void

    .line 3025
    :cond_1
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 3026
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$84;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$84;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Lcom/netease/ntunisdk/base/PadEvent;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    goto :goto_0
.end method

.method public openExitView()Z
    .locals 1

    .prologue
    .line 1493
    const/4 v0, 0x0

    return v0
.end method

.method public openExitViewFailed()V
    .locals 4

    .prologue
    .line 1028
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->exitViewListener:Lcom/netease/ntunisdk/base/OnExitListener;

    if-nez v0, :cond_0

    .line 1042
    :goto_0
    return-void

    .line 1031
    :cond_0
    sget-boolean v0, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v0, :cond_1

    iget-wide v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->uiThreadId:J

    invoke-static {}, Ljava/lang/Thread;->currentThread()Ljava/lang/Thread;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/Thread;->getId()J

    move-result-wide v2

    cmp-long v0, v0, v2

    if-eqz v0, :cond_1

    new-instance v0, Ljava/lang/AssertionError;

    const-string v1, "openExitViewFailed function can only by execute in UI thread"

    invoke-direct {v0, v1}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v0

    .line 1032
    :cond_1
    const-string v0, "EXIT_CALLER_THREAD"

    const/4 v1, 0x1

    invoke-virtual {p0, v0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v0

    const/4 v1, 0x2

    if-ne v0, v1, :cond_2

    .line 1033
    new-instance v0, Lcom/netease/ntunisdk/base/SdkBase$16;

    invoke-direct {v0, p0}, Lcom/netease/ntunisdk/base/SdkBase$16;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {p0, v0}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    goto :goto_0

    .line 1040
    :cond_2
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->exitViewListener:Lcom/netease/ntunisdk/base/OnExitListener;

    invoke-interface {v0}, Lcom/netease/ntunisdk/base/OnExitListener;->onOpenExitViewFailed()V

    goto :goto_0
.end method

.method public openGmView()V
    .locals 0

    .prologue
    .line 2273
    return-void
.end method

.method public abstract openManager()V
.end method

.method public openNearby()V
    .locals 0

    .prologue
    .line 1198
    return-void
.end method

.method public openPauseView()V
    .locals 0

    .prologue
    .line 1229
    return-void
.end method

.method public prePay()V
    .locals 0

    .prologue
    .line 2707
    return-void
.end method

.method public queryAvailablesInvitees()V
    .locals 0

    .prologue
    .line 2030
    return-void
.end method

.method public queryAvailablesInviteesFinished(Ljava/util/List;)V
    .locals 3
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
    .line 2051
    .local p1, "friends":Ljava/util/List;, "Ljava/util/List<Lcom/netease/ntunisdk/base/AccountInfo;>;"
    sget-boolean v1, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v1, :cond_0

    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->friendListener:Lcom/netease/ntunisdk/base/QueryFriendListener;

    if-nez v1, :cond_0

    new-instance v1, Ljava/lang/AssertionError;

    const-string v2, "QueryFriendListener not set"

    invoke-direct {v1, v2}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v1

    .line 2052
    :cond_0
    const-string v1, "FRIEND_CALLER_THREAD"

    const/4 v2, 0x1

    invoke-virtual {p0, v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v1

    const/4 v2, 0x2

    if-ne v1, v2, :cond_1

    .line 2053
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$38;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$38;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/util/List;)V

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 2070
    :goto_0
    return-void

    .line 2061
    :cond_1
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2062
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$39;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$39;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/util/List;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    goto :goto_0
.end method

.method public queryFriendList()V
    .locals 0

    .prologue
    .line 1940
    return-void
.end method

.method public queryFriendListFinished(Ljava/util/List;)V
    .locals 3
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
    .line 2008
    .local p1, "friends":Ljava/util/List;, "Ljava/util/List<Lcom/netease/ntunisdk/base/AccountInfo;>;"
    sget-boolean v1, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v1, :cond_0

    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->friendListener:Lcom/netease/ntunisdk/base/QueryFriendListener;

    if-nez v1, :cond_0

    new-instance v1, Ljava/lang/AssertionError;

    const-string v2, "QueryFriendListener not set"

    invoke-direct {v1, v2}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v1

    .line 2009
    :cond_0
    const-string v1, "FRIEND_CALLER_THREAD"

    const/4 v2, 0x1

    invoke-virtual {p0, v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v1

    const/4 v2, 0x2

    if-ne v1, v2, :cond_1

    .line 2010
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$35;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$35;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/util/List;)V

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 2027
    :goto_0
    return-void

    .line 2018
    :cond_1
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2019
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$36;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$36;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/util/List;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    goto :goto_0
.end method

.method public queryFriendListInGame()V
    .locals 0

    .prologue
    .line 1973
    return-void
.end method

.method public queryFriendListInGameFinished(Ljava/util/List;)V
    .locals 3
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
    .line 1981
    .local p1, "friends":Ljava/util/List;, "Ljava/util/List<Lcom/netease/ntunisdk/base/AccountInfo;>;"
    sget-boolean v1, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v1, :cond_0

    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->friendListener:Lcom/netease/ntunisdk/base/QueryFriendListener;

    if-nez v1, :cond_0

    new-instance v1, Ljava/lang/AssertionError;

    const-string v2, "QueryFriendListener not set"

    invoke-direct {v1, v2}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v1

    .line 1982
    :cond_0
    const-string v1, "FRIEND_CALLER_THREAD"

    const/4 v2, 0x1

    invoke-virtual {p0, v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v1

    const/4 v2, 0x2

    if-ne v1, v2, :cond_1

    .line 1983
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$33;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$33;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/util/List;)V

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 2000
    :goto_0
    return-void

    .line 1991
    :cond_1
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 1992
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$34;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$34;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/util/List;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    goto :goto_0
.end method

.method protected queryInventory()V
    .locals 0

    .prologue
    .line 543
    return-void
.end method

.method protected queryInviterList()V
    .locals 0

    .prologue
    .line 3396
    return-void
.end method

.method public queryMyAccount()V
    .locals 0

    .prologue
    .line 2073
    return-void
.end method

.method public queryMyAccountFinished(Lcom/netease/ntunisdk/base/AccountInfo;)V
    .locals 3
    .param p1, "account"    # Lcom/netease/ntunisdk/base/AccountInfo;

    .prologue
    .line 2094
    sget-boolean v1, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v1, :cond_0

    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->friendListener:Lcom/netease/ntunisdk/base/QueryFriendListener;

    if-nez v1, :cond_0

    new-instance v1, Ljava/lang/AssertionError;

    const-string v2, "QueryFriendListener not set"

    invoke-direct {v1, v2}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v1

    .line 2095
    :cond_0
    const-string v1, "FRIEND_CALLER_THREAD"

    const/4 v2, 0x1

    invoke-virtual {p0, v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v1

    const/4 v2, 0x2

    if-ne v1, v2, :cond_1

    .line 2096
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$41;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$41;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Lcom/netease/ntunisdk/base/AccountInfo;)V

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 2113
    :goto_0
    return-void

    .line 2104
    :cond_1
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2105
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$42;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$42;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Lcom/netease/ntunisdk/base/AccountInfo;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    goto :goto_0
.end method

.method public queryRank(Lcom/netease/ntunisdk/base/QueryRankInfo;)V
    .locals 0
    .param p1, "queryRank"    # Lcom/netease/ntunisdk/base/QueryRankInfo;

    .prologue
    .line 2132
    return-void
.end method

.method public queryRankFinished(Ljava/util/List;)V
    .locals 3
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
    .line 2157
    .local p1, "rank":Ljava/util/List;, "Ljava/util/List<Lcom/netease/ntunisdk/base/AccountInfo;>;"
    sget-boolean v1, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v1, :cond_0

    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->rankListener:Lcom/netease/ntunisdk/base/QueryRankListener;

    if-nez v1, :cond_0

    new-instance v1, Ljava/lang/AssertionError;

    const-string v2, "QueryRankListener not set"

    invoke-direct {v1, v2}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v1

    .line 2158
    :cond_0
    const-string v1, "RANK_CALLER_THREAD"

    const/4 v2, 0x1

    invoke-virtual {p0, v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v1

    const/4 v2, 0x2

    if-ne v1, v2, :cond_1

    .line 2159
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$44;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$44;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/util/List;)V

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 2176
    :goto_0
    return-void

    .line 2167
    :cond_1
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2168
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$45;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$45;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/util/List;)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    goto :goto_0
.end method

.method public querySkuDetails(Ljava/lang/String;Ljava/util/List;)V
    .locals 0
    .param p1, "itemType"    # Ljava/lang/String;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/lang/String;",
            "Ljava/util/List",
            "<",
            "Ljava/lang/String;",
            ">;)V"
        }
    .end annotation

    .prologue
    .line 2885
    .local p2, "sku":Ljava/util/List;, "Ljava/util/List<Ljava/lang/String;>;"
    return-void
.end method

.method protected querySkuDetailsDone(Ljava/util/List;)V
    .locals 4
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/List",
            "<",
            "Lcom/netease/ntunisdk/base/SkuDetailsInfo;",
            ">;)V"
        }
    .end annotation

    .prologue
    .line 2845
    .local p1, "skuDetailsList":Ljava/util/List;, "Ljava/util/List<Lcom/netease/ntunisdk/base/SkuDetailsInfo;>;"
    sget-boolean v0, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v0, :cond_0

    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->querySkuDetailsListener:Lcom/netease/ntunisdk/base/OnQuerySkuDetailsListener;

    if-nez v0, :cond_0

    new-instance v0, Ljava/lang/AssertionError;

    const-string v1, "OnQuerySkuDetailsListener not set"

    invoke-direct {v0, v1}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v0

    .line 2846
    :cond_0
    sget-boolean v0, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v0, :cond_1

    iget-wide v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->uiThreadId:J

    invoke-static {}, Ljava/lang/Thread;->currentThread()Ljava/lang/Thread;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/Thread;->getId()J

    move-result-wide v2

    cmp-long v0, v0, v2

    if-eqz v0, :cond_1

    new-instance v0, Ljava/lang/AssertionError;

    const-string v1, "querySkuDetailsDone function can only by execute in UI thread"

    invoke-direct {v0, v1}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v0

    .line 2847
    :cond_1
    const-string v0, "ORDER_CALLER_THREAD"

    const/4 v1, 0x1

    invoke-virtual {p0, v0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v0

    const/4 v1, 0x2

    if-ne v0, v1, :cond_2

    .line 2848
    new-instance v0, Lcom/netease/ntunisdk/base/SdkBase$71;

    invoke-direct {v0, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$71;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Ljava/util/List;)V

    invoke-virtual {p0, v0}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 2857
    :goto_0
    return-void

    .line 2855
    :cond_2
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->querySkuDetailsListener:Lcom/netease/ntunisdk/base/OnQuerySkuDetailsListener;

    invoke-interface {v0, p1}, Lcom/netease/ntunisdk/base/OnQuerySkuDetailsListener;->querySkuDetailsFinished(Ljava/util/List;)V

    goto :goto_0
.end method

.method protected readConfig()V
    .locals 13

    .prologue
    .line 237
    const/4 v8, 0x0

    .line 238
    .local v8, "jsonStr":Ljava/lang/String;
    new-instance v10, Ljava/lang/StringBuilder;

    invoke-direct {v10}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v11

    invoke-virtual {v10, v11}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v10

    const-string v11, "_data"

    invoke-virtual {v10, v11}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v10

    invoke-virtual {v10}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    .line 240
    .local v4, "fileName":Ljava/lang/String;
    :try_start_0
    iget-object v10, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    invoke-virtual {v10}, Landroid/content/Context;->getAssets()Landroid/content/res/AssetManager;

    move-result-object v10

    const/4 v11, 0x3

    invoke-virtual {v10, v4, v11}, Landroid/content/res/AssetManager;->open(Ljava/lang/String;I)Ljava/io/InputStream;

    move-result-object v6

    .line 241
    .local v6, "is":Ljava/io/InputStream;
    invoke-virtual {v6}, Ljava/io/InputStream;->available()I

    move-result v5

    .line 242
    .local v5, "index":I
    if-nez v5, :cond_0

    .line 334
    .end local v5    # "index":I
    .end local v6    # "is":Ljava/io/InputStream;
    :goto_0
    return-void

    .line 245
    .restart local v5    # "index":I
    .restart local v6    # "is":Ljava/io/InputStream;
    :cond_0
    new-array v2, v5, [B

    .line 246
    .local v2, "data":[B
    invoke-virtual {v6, v2}, Ljava/io/InputStream;->read([B)I

    .line 248
    new-instance v9, Ljava/lang/String;

    const-string v10, "UTF-8"

    invoke-direct {v9, v2, v10}, Ljava/lang/String;-><init>([BLjava/lang/String;)V
    :try_end_0
    .catch Ljava/io/IOException; {:try_start_0 .. :try_end_0} :catch_0

    .end local v8    # "jsonStr":Ljava/lang/String;
    .local v9, "jsonStr":Ljava/lang/String;
    move-object v8, v9

    .line 254
    .end local v2    # "data":[B
    .end local v5    # "index":I
    .end local v6    # "is":Ljava/io/InputStream;
    .end local v9    # "jsonStr":Ljava/lang/String;
    .restart local v8    # "jsonStr":Ljava/lang/String;
    :goto_1
    if-nez v8, :cond_1

    .line 255
    const-string v10, "UniSDK Base"

    new-instance v11, Ljava/lang/StringBuilder;

    invoke-direct {v11}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v11, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v11

    const-string v12, " is null"

    invoke-virtual {v11, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v11

    invoke-virtual {v11}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v11

    invoke-static {v10, v11}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    goto :goto_0

    .line 250
    :catch_0
    move-exception v3

    .line 251
    .local v3, "e":Ljava/io/IOException;
    const-string v10, "UniSDK Base"

    new-instance v11, Ljava/lang/StringBuilder;

    invoke-direct {v11}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v12

    invoke-virtual {v11, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v11

    const-string v12, "_data config not found"

    invoke-virtual {v11, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v11

    invoke-virtual {v11}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v11

    invoke-static {v10, v11}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    goto :goto_1

    .line 260
    .end local v3    # "e":Ljava/io/IOException;
    :cond_1
    const-string v10, "\uff1a"

    invoke-virtual {v8, v10}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v10

    if-nez v10, :cond_2

    const-string v10, "\u201c"

    invoke-virtual {v8, v10}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v10

    if-nez v10, :cond_2

    const-string v10, "\u201d"

    invoke-virtual {v8, v10}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v10

    if-eqz v10, :cond_3

    .line 261
    :cond_2
    const-string v10, "UniSDK Base"

    new-instance v11, Ljava/lang/StringBuilder;

    invoke-direct {v11}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v11, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v11

    const-string v12, "\u5305\u542b\u4e2d\u6587\u7279\u6b8a\u5b57\u7b26"

    invoke-virtual {v11, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v11

    invoke-virtual {v11}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v11

    invoke-static {v10, v11}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 264
    :cond_3
    new-instance v7, Lorg/json/JSONTokener;

    invoke-direct {v7, v8}, Lorg/json/JSONTokener;-><init>(Ljava/lang/String;)V

    .line 265
    .local v7, "jsonParser":Lorg/json/JSONTokener;
    const/4 v1, 0x0

    .line 267
    .local v1, "conf":Lorg/json/JSONObject;
    :try_start_1
    invoke-virtual {v7}, Lorg/json/JSONTokener;->nextValue()Ljava/lang/Object;

    move-result-object v10

    move-object v0, v10

    check-cast v0, Lorg/json/JSONObject;

    move-object v1, v0

    .line 269
    const-string v10, "GAMEID"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 270
    const-string v10, "APP_KEY"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 271
    const-string v10, "APP_SECRET"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 272
    const-string v10, "APPID"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 273
    const-string v10, "APP_NAME"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 274
    const-string v10, "SCR_ORIENTATION"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 275
    const-string v10, "CPID"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 276
    const-string v10, "CP_KEY"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 277
    const-string v10, "SERVER_ID"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 278
    const-string v10, "PAY_CB_URL"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 279
    const-string v10, "RSA_PRIVATE"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 280
    const-string v10, "RSA_PUBLIC"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 281
    const-string v10, "SDK_UPDATE_CHECK_STRICT"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 282
    const-string v10, "BUOY_PRIVATEKEY"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 283
    const-string v10, "USER_ID"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 284
    const-string v10, "PACKET_ID"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 285
    const-string v10, "EXCHANGE_RATE"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 286
    const-string v10, "EXCHANGE_UNIT"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 287
    const-string v10, "CHANNEL_ID"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 288
    const-string v10, "SPLASH"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 289
    const-string v10, "SPLASH_TIME"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 290
    const-string v10, "SPLASH_COLOR"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 291
    const-string v10, "DEBUG_MODE"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 292
    const-string v10, "APP_CHANNEL"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 293
    const-string v10, "LAUNCHER_NAME"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 294
    const-string v10, "APPSFLYER_DEV_KEY"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 295
    const-string v10, "ADVERTISER_APPID"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 296
    const-string v10, "TIMELINE_KEY"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 297
    const-string v10, "PLATFORM_KEY"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 298
    const-string v10, "GAME_REGION"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 299
    const-string v10, "GAME_ENGINE"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 300
    const-string v10, "CC_SHOW_FPS_SETTING"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 301
    const-string v10, "CC_DEFAULT_FPS"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 302
    const-string v10, "PAYTYPE"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 303
    const-string v10, "PAYCODE"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 304
    const-string v10, "MONTHTYPE"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 305
    const-string v10, "LIANYUN"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 306
    const-string v10, "SINGLE_CB"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 307
    const-string v10, "DK_APPID"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 308
    const-string v10, "DK_APP_KEY"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 309
    const-string v10, "SHARE_QQ_API"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 310
    const-string v10, "SHARE_WEIBO_API"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 311
    const-string v10, "SHARE_WEIXIN_API"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 312
    const-string v10, "SHARE_YIXIN_API"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 313
    const-string v10, "ENABLE_EXLOGIN_GUEST"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 314
    const-string v10, "ENABLE_EXLOGIN_WEIBO"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 315
    const-string v10, "ENABLE_EXLOGIN_MOBILE"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 316
    const-string v10, "DATA_REPORT_MODE"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 317
    const-string v10, "GAME_NAME"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 318
    const-string v10, "RETRIEVE_USER"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 319
    const-string v10, "DOMAIN"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 320
    const-string v10, "QQ_APPID"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 321
    const-string v10, "QQ_APP_KEY"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 322
    const-string v10, "WX_APPID"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 323
    const-string v10, "WX_APP_KEY"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 324
    const-string v10, "OFFER_ID"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 325
    const-string v10, "VERIFY_MODE"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 326
    const-string v10, "REQUEST_UNISDK_SERVER"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 327
    const-string v10, "UNISDK_CREATEORDER_URL"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 328
    const-string v10, "UNISDK_QUERYORDER_URL"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 329
    const-string v10, "LANGUAGE_CODE"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 330
    const-string v10, "PURCHASE_REG_SERVER"

    invoke-virtual {p0, v1, v10}, Lcom/netease/ntunisdk/base/SdkBase;->doConfigVal(Lorg/json/JSONObject;Ljava/lang/String;)V
    :try_end_1
    .catch Lorg/json/JSONException; {:try_start_1 .. :try_end_1} :catch_1

    goto/16 :goto_0

    .line 331
    :catch_1
    move-exception v3

    .line 332
    .local v3, "e":Lorg/json/JSONException;
    const-string v10, "UniSDK Base"

    new-instance v11, Ljava/lang/StringBuilder;

    invoke-direct {v11}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v12

    invoke-virtual {v11, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v11

    const-string v12, "_data config parse to json error"

    invoke-virtual {v11, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v11

    invoke-virtual {v11}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v11

    invoke-static {v10, v11}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    goto/16 :goto_0
.end method

.method public resetCommonProp()V
    .locals 3

    .prologue
    const/4 v2, 0x0

    .line 1388
    const-string v0, "LOGIN_STAT"

    const/4 v1, 0x0

    invoke-virtual {p0, v0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->setPropInt(Ljava/lang/String;I)V

    .line 1389
    const-string v0, "UIN"

    invoke-virtual {p0, v0, v2}, Lcom/netease/ntunisdk/base/SdkBase;->setPropStr(Ljava/lang/String;Ljava/lang/String;)V

    .line 1390
    const-string v0, "SESSION"

    invoke-virtual {p0, v0, v2}, Lcom/netease/ntunisdk/base/SdkBase;->setPropStr(Ljava/lang/String;Ljava/lang/String;)V

    .line 1391
    return-void
.end method

.method protected resetFields()V
    .locals 5

    .prologue
    const/4 v2, 0x0

    const/4 v4, 0x0

    .line 1086
    iput-boolean v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->hasInit:Z

    .line 1087
    iput-boolean v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->isSurfaceViewValid:Z

    .line 1088
    const-wide/16 v2, 0x0

    iput-wide v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->uiThreadId:J

    .line 1090
    iput-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    .line 1091
    iput-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase;->loginListener:Lcom/netease/ntunisdk/base/OnLoginDoneListener;

    .line 1092
    iput-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase;->orderListener:Lcom/netease/ntunisdk/base/OnOrderCheckListener;

    .line 1093
    iput-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase;->logoutListener:Lcom/netease/ntunisdk/base/OnLogoutDoneListener;

    .line 1094
    iput-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase;->leaveListener:Lcom/netease/ntunisdk/base/OnLeaveSdkListener;

    .line 1095
    iput-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase;->continueListener:Lcom/netease/ntunisdk/base/OnContinueListener;

    .line 1096
    iput-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase;->exitViewListener:Lcom/netease/ntunisdk/base/OnExitListener;

    .line 1097
    iput-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase;->controllerListener:Lcom/netease/ntunisdk/base/OnControllerListener;

    .line 1098
    iput-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase;->friendListener:Lcom/netease/ntunisdk/base/QueryFriendListener;

    .line 1099
    iput-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase;->querySkuDetailsListener:Lcom/netease/ntunisdk/base/OnQuerySkuDetailsListener;

    .line 1100
    iput-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase;->shareListener:Lcom/netease/ntunisdk/base/OnShareListener;

    .line 1101
    iput-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase;->pushListener:Lcom/netease/ntunisdk/base/OnPushListener;

    .line 1102
    iput-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase;->rankListener:Lcom/netease/ntunisdk/base/QueryRankListener;

    .line 1103
    iput-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase;->glView:Landroid/opengl/GLSurfaceView;

    .line 1105
    iget-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->runnableQueue:Ljava/util/concurrent/BlockingQueue;

    if-eqz v2, :cond_0

    .line 1106
    iget-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->runnableQueue:Ljava/util/concurrent/BlockingQueue;

    invoke-interface {v2}, Ljava/util/concurrent/BlockingQueue;->clear()V

    .line 1109
    :cond_0
    iget-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->propDict:Ljava/util/Hashtable;

    if-eqz v2, :cond_1

    .line 1110
    iget-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->propDict:Ljava/util/Hashtable;

    invoke-virtual {v2}, Ljava/util/Hashtable;->clear()V

    .line 1113
    :cond_1
    iget-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->userInfoDict:Ljava/util/Hashtable;

    if-eqz v2, :cond_2

    .line 1114
    iget-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->userInfoDict:Ljava/util/Hashtable;

    invoke-virtual {v2}, Ljava/util/Hashtable;->clear()V

    .line 1117
    :cond_2
    iget-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->payHisMap:Ljava/util/Map;

    if-eqz v2, :cond_3

    .line 1118
    iget-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->payHisMap:Ljava/util/Map;

    invoke-interface {v2}, Ljava/util/Map;->clear()V

    .line 1121
    :cond_3
    iget-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    if-eqz v2, :cond_5

    .line 1122
    iget-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v2}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v2

    invoke-interface {v2}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v2

    if-eqz v2, :cond_4

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 1123
    .local v1, "key":Ljava/lang/String;
    iget-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v2, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v2}, Lcom/netease/ntunisdk/base/SdkBase;->resetFields()V

    goto :goto_0

    .line 1125
    .end local v1    # "key":Ljava/lang/String;
    :cond_4
    iget-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v2}, Ljava/util/Map;->clear()V

    .line 1127
    .end local v0    # "i$":Ljava/util/Iterator;
    :cond_5
    return-void
.end method

.method protected runOnGLThread(Ljava/lang/Runnable;)V
    .locals 1
    .param p1, "runner"    # Ljava/lang/Runnable;

    .prologue
    .line 88
    iget-boolean v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->isSurfaceViewValid:Z

    if-eqz v0, :cond_0

    .line 89
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->glView:Landroid/opengl/GLSurfaceView;

    invoke-virtual {v0, p1}, Landroid/opengl/GLSurfaceView;->queueEvent(Ljava/lang/Runnable;)V

    .line 93
    :goto_0
    return-void

    .line 91
    :cond_0
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->runnableQueue:Ljava/util/concurrent/BlockingQueue;

    invoke-interface {v0, p1}, Ljava/util/concurrent/BlockingQueue;->add(Ljava/lang/Object;)Z

    goto :goto_0
.end method

.method public sdkOnActivityResult(IILandroid/content/Intent;)V
    .locals 0
    .param p1, "requestCode"    # I
    .param p2, "resultCode"    # I
    .param p3, "data"    # Landroid/content/Intent;

    .prologue
    .line 1701
    return-void
.end method

.method public sdkOnBackPressed()V
    .locals 0

    .prologue
    .line 1607
    return-void
.end method

.method public sdkOnConfigurationChanged(Landroid/content/res/Configuration;)V
    .locals 0
    .param p1, "config"    # Landroid/content/res/Configuration;

    .prologue
    .line 2621
    return-void
.end method

.method public sdkOnCreate(Landroid/os/Bundle;)V
    .locals 0
    .param p1, "savedInstanceState"    # Landroid/os/Bundle;

    .prologue
    .line 2771
    return-void
.end method

.method public sdkOnDestroy()V
    .locals 0

    .prologue
    .line 1642
    return-void
.end method

.method public sdkOnLowMemory()V
    .locals 0

    .prologue
    .line 2788
    return-void
.end method

.method public sdkOnNewIntent(Landroid/content/Intent;)V
    .locals 0
    .param p1, "intent"    # Landroid/content/Intent;

    .prologue
    .line 2639
    return-void
.end method

.method public sdkOnPause()V
    .locals 0

    .prologue
    .line 1584
    return-void
.end method

.method public sdkOnRestart()V
    .locals 0

    .prologue
    .line 1676
    return-void
.end method

.method public sdkOnResume()V
    .locals 0

    .prologue
    .line 1659
    return-void
.end method

.method public sdkOnSaveInstanceState(Landroid/os/Bundle;)V
    .locals 0
    .param p1, "outState"    # Landroid/os/Bundle;

    .prologue
    .line 2752
    return-void
.end method

.method public sdkOnStart()V
    .locals 0

    .prologue
    .line 1549
    return-void
.end method

.method public sdkOnStop()V
    .locals 0

    .prologue
    .line 1625
    return-void
.end method

.method public sdkOnUserLeaveHint()V
    .locals 0

    .prologue
    .line 1555
    return-void
.end method

.method public sdkOnWindowFocusChanged(Z)V
    .locals 0
    .param p1, "hasFocus"    # Z

    .prologue
    .line 2603
    return-void
.end method

.method protected sendLocalNotification(Ljava/lang/String;)V
    .locals 0
    .param p1, "strJson"    # Ljava/lang/String;

    .prologue
    .line 3479
    return-void
.end method

.method public sendLocalNotificationFinished(Z)V
    .locals 3
    .param p1, "result"    # Z

    .prologue
    .line 2495
    sget-boolean v1, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v1, :cond_0

    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->pushListener:Lcom/netease/ntunisdk/base/OnPushListener;

    if-nez v1, :cond_0

    new-instance v1, Ljava/lang/AssertionError;

    const-string v2, "pushListener not set"

    invoke-direct {v1, v2}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v1

    .line 2496
    :cond_0
    const-string v1, "PUSH_CALLER_THREAD"

    const/4 v2, 0x1

    invoke-virtual {p0, v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v1

    const/4 v2, 0x2

    if-ne v1, v2, :cond_1

    .line 2497
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$63;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$63;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Z)V

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 2514
    :goto_0
    return-void

    .line 2505
    :cond_1
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2506
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$64;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$64;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Z)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    goto :goto_0
.end method

.method protected sendPushNotification(Ljava/lang/String;Ljava/util/List;)V
    .locals 0
    .param p1, "message"    # Ljava/lang/String;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/lang/String;",
            "Ljava/util/List",
            "<",
            "Ljava/lang/String;",
            ">;)V"
        }
    .end annotation

    .prologue
    .line 3459
    .local p2, "playerIDList":Ljava/util/List;, "Ljava/util/List<Ljava/lang/String;>;"
    return-void
.end method

.method public sendPushNotificationFinished(Z)V
    .locals 3
    .param p1, "result"    # Z

    .prologue
    .line 2468
    sget-boolean v1, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v1, :cond_0

    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->pushListener:Lcom/netease/ntunisdk/base/OnPushListener;

    if-nez v1, :cond_0

    new-instance v1, Ljava/lang/AssertionError;

    const-string v2, "pushListener not set"

    invoke-direct {v1, v2}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v1

    .line 2469
    :cond_0
    const-string v1, "PUSH_CALLER_THREAD"

    const/4 v2, 0x1

    invoke-virtual {p0, v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v1

    const/4 v2, 0x2

    if-ne v1, v2, :cond_1

    .line 2470
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$61;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$61;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Z)V

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 2487
    :goto_0
    return-void

    .line 2478
    :cond_1
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2479
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$62;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$62;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Z)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    goto :goto_0
.end method

.method public setContinueListener(Lcom/netease/ntunisdk/base/OnContinueListener;I)V
    .locals 1
    .param p1, "continueL"    # Lcom/netease/ntunisdk/base/OnContinueListener;
    .param p2, "thread"    # I

    .prologue
    .line 435
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase;->continueListener:Lcom/netease/ntunisdk/base/OnContinueListener;

    .line 436
    const-string v0, "CONTINUE_CALLER_THREAD"

    invoke-virtual {p0, v0, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setPropInt(Ljava/lang/String;I)V

    .line 437
    return-void
.end method

.method public setControllerListener(Lcom/netease/ntunisdk/base/OnControllerListener;I)V
    .locals 4
    .param p1, "controllerL"    # Lcom/netease/ntunisdk/base/OnControllerListener;
    .param p2, "thread"    # I

    .prologue
    .line 2896
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 2897
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 2898
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2, p1, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setControllerListener(Lcom/netease/ntunisdk/base/OnControllerListener;I)V

    goto :goto_0

    .line 2900
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase;->controllerListener:Lcom/netease/ntunisdk/base/OnControllerListener;

    .line 2901
    const-string v3, "CONTROLLER_CALLER_THREAD"

    invoke-virtual {p0, v3, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setPropInt(Ljava/lang/String;I)V

    .line 2902
    return-void
.end method

.method public setCtx(Landroid/content/Context;)V
    .locals 5
    .param p1, "ctx"    # Landroid/content/Context;

    .prologue
    .line 138
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    .line 140
    instance-of v3, p1, Landroid/app/Activity;

    if-eqz v3, :cond_0

    .line 141
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    invoke-virtual {v3}, Landroid/content/Context;->getContentResolver()Landroid/content/ContentResolver;

    move-result-object v3

    const-string v4, "android_id"

    invoke-static {v3, v4}, Landroid/provider/Settings$Secure;->getString(Landroid/content/ContentResolver;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    .line 143
    .local v1, "deviceId":Ljava/lang/String;
    const-string v3, "DEVICE_ID"

    invoke-virtual {p0, v3, v1}, Lcom/netease/ntunisdk/base/SdkBase;->setPropStr(Ljava/lang/String;Ljava/lang/String;)V

    .line 144
    const-string v3, "UDID"

    invoke-virtual {p0, v3, v1}, Lcom/netease/ntunisdk/base/SdkBase;->setPropStr(Ljava/lang/String;Ljava/lang/String;)V

    move-object v0, p1

    .line 146
    check-cast v0, Landroid/app/Activity;

    .line 147
    .local v0, "ap":Landroid/app/Activity;
    new-instance v3, Lcom/netease/ntunisdk/base/SdkBase$1;

    invoke-direct {v3, p0}, Lcom/netease/ntunisdk/base/SdkBase$1;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {v0, v3}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 153
    new-instance v3, Lcom/netease/ntunisdk/base/RetrieveUser;

    iget-object v4, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    invoke-direct {v3, p0, v4}, Lcom/netease/ntunisdk/base/RetrieveUser;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Landroid/content/Context;)V

    iput-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->retrieveUser:Lcom/netease/ntunisdk/base/RetrieveUser;

    .line 156
    .end local v0    # "ap":Landroid/app/Activity;
    .end local v1    # "deviceId":Ljava/lang/String;
    :cond_0
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->readConfig()V

    .line 159
    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->getAppChannel()Ljava/lang/String;

    move-result-object v3

    if-eqz v3, :cond_1

    const-string v3, ""

    invoke-virtual {p0}, Lcom/netease/ntunisdk/base/SdkBase;->getAppChannel()Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v3, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_2

    .line 160
    :cond_1
    invoke-direct {p0}, Lcom/netease/ntunisdk/base/SdkBase;->getDistroId()Ljava/lang/String;

    move-result-object v2

    .line 161
    .local v2, "distroId":Ljava/lang/String;
    if-eqz v2, :cond_3

    const-string v3, ""

    invoke-virtual {v3, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_3

    .line 162
    const-string v3, "APP_CHANNEL"

    invoke-virtual {p0, v3, v2}, Lcom/netease/ntunisdk/base/SdkBase;->setPropStr(Ljava/lang/String;Ljava/lang/String;)V

    .line 168
    .end local v2    # "distroId":Ljava/lang/String;
    :cond_2
    :goto_0
    return-void

    .line 164
    .restart local v2    # "distroId":Ljava/lang/String;
    :cond_3
    const-string v3, "APP_CHANNEL"

    const-string v4, "please_input_appchannel"

    invoke-virtual {p0, v3, v4}, Lcom/netease/ntunisdk/base/SdkBase;->setPropStr(Ljava/lang/String;Ljava/lang/String;)V

    goto :goto_0
.end method

.method public setDebugMode(Z)V
    .locals 0
    .param p1, "v"    # Z

    .prologue
    .line 922
    return-void
.end method

.method public setExitListener(Lcom/netease/ntunisdk/base/OnExitListener;I)V
    .locals 4
    .param p1, "exitL"    # Lcom/netease/ntunisdk/base/OnExitListener;
    .param p2, "thread"    # I

    .prologue
    .line 461
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 462
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 463
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2, p1, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setExitListener(Lcom/netease/ntunisdk/base/OnExitListener;I)V

    goto :goto_0

    .line 465
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase;->exitViewListener:Lcom/netease/ntunisdk/base/OnExitListener;

    .line 466
    const-string v3, "EXIT_CALLER_THREAD"

    invoke-virtual {p0, v3, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setPropInt(Ljava/lang/String;I)V

    .line 467
    return-void
.end method

.method public setFeature(Ljava/lang/String;Z)V
    .locals 1
    .param p1, "feature"    # Ljava/lang/String;
    .param p2, "enable"    # Z

    .prologue
    .line 1381
    if-eqz p2, :cond_0

    const/4 v0, 0x1

    :goto_0
    invoke-virtual {p0, p1, v0}, Lcom/netease/ntunisdk/base/SdkBase;->setPropInt(Ljava/lang/String;I)V

    .line 1382
    return-void

    .line 1381
    :cond_0
    const/4 v0, 0x0

    goto :goto_0
.end method

.method public setFloatBtnVisible(Z)V
    .locals 0
    .param p1, "v"    # Z

    .prologue
    .line 812
    return-void
.end method

.method public setGlView(Landroid/opengl/GLSurfaceView;)V
    .locals 4
    .param p1, "glView"    # Landroid/opengl/GLSurfaceView;

    .prologue
    .line 1427
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 1428
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 1429
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2, p1}, Lcom/netease/ntunisdk/base/SdkBase;->setGlView(Landroid/opengl/GLSurfaceView;)V

    goto :goto_0

    .line 1431
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase;->glView:Landroid/opengl/GLSurfaceView;

    .line 1432
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->glView:Landroid/opengl/GLSurfaceView;

    invoke-virtual {v3}, Landroid/opengl/GLSurfaceView;->getHolder()Landroid/view/SurfaceHolder;

    move-result-object v3

    invoke-interface {v3, p0}, Landroid/view/SurfaceHolder;->addCallback(Landroid/view/SurfaceHolder$Callback;)V

    .line 1433
    return-void
.end method

.method public setLeaveSdkListener(Lcom/netease/ntunisdk/base/OnLeaveSdkListener;I)V
    .locals 1
    .param p1, "leaveL"    # Lcom/netease/ntunisdk/base/OnLeaveSdkListener;
    .param p2, "thread"    # I

    .prologue
    .line 405
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase;->leaveListener:Lcom/netease/ntunisdk/base/OnLeaveSdkListener;

    .line 406
    const-string v0, "LOGIN_CALLER_THREAD"

    invoke-virtual {p0, v0, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setPropInt(Ljava/lang/String;I)V

    .line 407
    return-void
.end method

.method public setLoginListener(Lcom/netease/ntunisdk/base/OnLoginDoneListener;I)V
    .locals 1
    .param p1, "loginL"    # Lcom/netease/ntunisdk/base/OnLoginDoneListener;
    .param p2, "thread"    # I

    .prologue
    .line 345
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase;->loginListener:Lcom/netease/ntunisdk/base/OnLoginDoneListener;

    .line 346
    const-string v0, "LOGIN_CALLER_THREAD"

    invoke-virtual {p0, v0, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setPropInt(Ljava/lang/String;I)V

    .line 347
    return-void
.end method

.method public setLoginStat(I)V
    .locals 1
    .param p1, "stat"    # I

    .prologue
    .line 1411
    const-string v0, "LOGIN_STAT"

    invoke-virtual {p0, v0, p1}, Lcom/netease/ntunisdk/base/SdkBase;->setPropInt(Ljava/lang/String;I)V

    .line 1412
    return-void
.end method

.method public setLogoutListener(Lcom/netease/ntunisdk/base/OnLogoutDoneListener;I)V
    .locals 1
    .param p1, "logoutL"    # Lcom/netease/ntunisdk/base/OnLogoutDoneListener;
    .param p2, "thread"    # I

    .prologue
    .line 392
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase;->logoutListener:Lcom/netease/ntunisdk/base/OnLogoutDoneListener;

    .line 393
    const-string v0, "LOGOUT_CALLER_THREAD"

    invoke-virtual {p0, v0, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setPropInt(Ljava/lang/String;I)V

    .line 394
    return-void
.end method

.method public setOrderListener(Lcom/netease/ntunisdk/base/OnOrderCheckListener;I)V
    .locals 4
    .param p1, "orderL"    # Lcom/netease/ntunisdk/base/OnOrderCheckListener;
    .param p2, "thread"    # I

    .prologue
    .line 418
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 419
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 420
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2, p1, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setOrderListener(Lcom/netease/ntunisdk/base/OnOrderCheckListener;I)V

    goto :goto_0

    .line 422
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase;->orderListener:Lcom/netease/ntunisdk/base/OnOrderCheckListener;

    .line 423
    const-string v3, "ORDER_CALLER_THREAD"

    invoke-virtual {p0, v3, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setPropInt(Ljava/lang/String;I)V

    .line 424
    return-void
.end method

.method public setPropInt(Ljava/lang/String;I)V
    .locals 2
    .param p1, "prop"    # Ljava/lang/String;
    .param p2, "val"    # I

    .prologue
    .line 1351
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->propDict:Ljava/util/Hashtable;

    invoke-static {p2}, Ljava/lang/Integer;->toString(I)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, p1, v1}, Ljava/util/Hashtable;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 1352
    return-void
.end method

.method public setPropStr(Ljava/lang/String;Ljava/lang/String;)V
    .locals 1
    .param p1, "prop"    # Ljava/lang/String;
    .param p2, "val"    # Ljava/lang/String;

    .prologue
    .line 1312
    if-nez p2, :cond_0

    .line 1313
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->propDict:Ljava/util/Hashtable;

    invoke-virtual {v0, p1}, Ljava/util/Hashtable;->remove(Ljava/lang/Object;)Ljava/lang/Object;

    .line 1317
    :goto_0
    return-void

    .line 1315
    :cond_0
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->propDict:Ljava/util/Hashtable;

    invoke-virtual {v0, p1, p2}, Ljava/util/Hashtable;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    goto :goto_0
.end method

.method public setPushListener(Lcom/netease/ntunisdk/base/OnPushListener;I)V
    .locals 4
    .param p1, "listener"    # Lcom/netease/ntunisdk/base/OnPushListener;
    .param p2, "thread"    # I

    .prologue
    .line 2578
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 2579
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 2580
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2, p1, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setPushListener(Lcom/netease/ntunisdk/base/OnPushListener;I)V

    .line 2581
    const-string v3, "PUSH_CALLER_THREAD"

    invoke-virtual {v2, v3, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setPropInt(Ljava/lang/String;I)V

    goto :goto_0

    .line 2583
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase;->pushListener:Lcom/netease/ntunisdk/base/OnPushListener;

    .line 2584
    const-string v3, "PUSH_CALLER_THREAD"

    invoke-virtual {p0, v3, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setPropInt(Ljava/lang/String;I)V

    .line 2585
    return-void
.end method

.method public setQueryFriendListener(Lcom/netease/ntunisdk/base/QueryFriendListener;I)V
    .locals 4
    .param p1, "listener"    # Lcom/netease/ntunisdk/base/QueryFriendListener;
    .param p2, "thread"    # I

    .prologue
    .line 1888
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 1889
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 1890
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2, p1, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setQueryFriendListener(Lcom/netease/ntunisdk/base/QueryFriendListener;I)V

    goto :goto_0

    .line 1892
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase;->friendListener:Lcom/netease/ntunisdk/base/QueryFriendListener;

    .line 1893
    const-string v3, "FRIEND_CALLER_THREAD"

    invoke-virtual {p0, v3, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setPropInt(Ljava/lang/String;I)V

    .line 1894
    return-void
.end method

.method public setQueryRankListener(Lcom/netease/ntunisdk/base/QueryRankListener;I)V
    .locals 4
    .param p1, "listener"    # Lcom/netease/ntunisdk/base/QueryRankListener;
    .param p2, "thread"    # I

    .prologue
    .line 2123
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 2124
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 2125
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2, p1, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setQueryRankListener(Lcom/netease/ntunisdk/base/QueryRankListener;I)V

    goto :goto_0

    .line 2127
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase;->rankListener:Lcom/netease/ntunisdk/base/QueryRankListener;

    .line 2128
    const-string v3, "RANK_CALLER_THREAD"

    invoke-virtual {p0, v3, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setPropInt(Ljava/lang/String;I)V

    .line 2129
    return-void
.end method

.method public setQuerySkuDetailsListener(Lcom/netease/ntunisdk/base/OnQuerySkuDetailsListener;I)V
    .locals 4
    .param p1, "listener"    # Lcom/netease/ntunisdk/base/OnQuerySkuDetailsListener;
    .param p2, "thread"    # I

    .prologue
    .line 2830
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 2831
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 2832
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2, p1, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setQuerySkuDetailsListener(Lcom/netease/ntunisdk/base/OnQuerySkuDetailsListener;I)V

    goto :goto_0

    .line 2834
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase;->querySkuDetailsListener:Lcom/netease/ntunisdk/base/OnQuerySkuDetailsListener;

    .line 2835
    const-string v3, "QUERYSKUDETAILS_CALLER_THREAD"

    invoke-virtual {p0, v3, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setPropInt(Ljava/lang/String;I)V

    .line 2836
    return-void
.end method

.method public setReceiveMsgListener(Lcom/netease/ntunisdk/base/OnReceiveMsgListener;I)V
    .locals 1
    .param p1, "receiveMsgL"    # Lcom/netease/ntunisdk/base/OnReceiveMsgListener;
    .param p2, "thread"    # I

    .prologue
    .line 448
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase;->receiveMsgListener:Lcom/netease/ntunisdk/base/OnReceiveMsgListener;

    .line 449
    const-string v0, "CONTINUE_CALLER_THREAD"

    invoke-virtual {p0, v0, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setPropInt(Ljava/lang/String;I)V

    .line 450
    return-void
.end method

.method setSdkMap(Ljava/util/Map;)V
    .locals 1
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/Map",
            "<",
            "Ljava/lang/String;",
            "Lcom/netease/ntunisdk/base/SdkBase;",
            ">;)V"
        }
    .end annotation

    .prologue
    .line 198
    .local p1, "sdks":Ljava/util/Map;, "Ljava/util/Map<Ljava/lang/String;Lcom/netease/ntunisdk/base/SdkBase;>;"
    if-eqz p1, :cond_0

    .line 199
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v0, p1}, Ljava/util/Map;->putAll(Ljava/util/Map;)V

    .line 201
    :cond_0
    return-void
.end method

.method public setShareListener(Lcom/netease/ntunisdk/base/OnShareListener;I)V
    .locals 4
    .param p1, "listener"    # Lcom/netease/ntunisdk/base/OnShareListener;
    .param p2, "thread"    # I

    .prologue
    .line 2453
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "i$":Ljava/util/Iterator;
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 2454
    .local v1, "key":Ljava/lang/String;
    iget-object v3, p0, Lcom/netease/ntunisdk/base/SdkBase;->sdkInstMap:Ljava/util/Map;

    invoke-interface {v3, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/netease/ntunisdk/base/SdkBase;

    .line 2455
    .local v2, "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    invoke-virtual {v2, p1, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setShareListener(Lcom/netease/ntunisdk/base/OnShareListener;I)V

    .line 2456
    const-string v3, "SHARE_CALLER_THREAD"

    invoke-virtual {v2, v3, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setPropInt(Ljava/lang/String;I)V

    goto :goto_0

    .line 2458
    .end local v1    # "key":Ljava/lang/String;
    .end local v2    # "sdkBase":Lcom/netease/ntunisdk/base/SdkBase;
    :cond_0
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase;->shareListener:Lcom/netease/ntunisdk/base/OnShareListener;

    .line 2459
    const-string v3, "SHARE_CALLER_THREAD"

    invoke-virtual {p0, v3, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setPropInt(Ljava/lang/String;I)V

    .line 2460
    return-void
.end method

.method public setStartupListener(Lcom/netease/ntunisdk/base/OnStartupListener;I)V
    .locals 1
    .param p1, "startupL"    # Lcom/netease/ntunisdk/base/OnStartupListener;
    .param p2, "thread"    # I

    .prologue
    .line 358
    iput-object p1, p0, Lcom/netease/ntunisdk/base/SdkBase;->startupListener:Lcom/netease/ntunisdk/base/OnStartupListener;

    .line 359
    const-string v0, "LOGIN_CALLER_THREAD"

    invoke-virtual {p0, v0, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setPropInt(Ljava/lang/String;I)V

    .line 360
    return-void
.end method

.method protected setUsePushNotification(Z)V
    .locals 0
    .param p1, "use"    # Z

    .prologue
    .line 3535
    return-void
.end method

.method public setUserInfo(Ljava/lang/String;Ljava/lang/String;)V
    .locals 0
    .param p1, "prop"    # Ljava/lang/String;
    .param p2, "val"    # Ljava/lang/String;

    .prologue
    .line 1782
    invoke-virtual {p0, p1, p2}, Lcom/netease/ntunisdk/base/SdkBase;->setPropStr(Ljava/lang/String;Ljava/lang/String;)V

    .line 1787
    return-void
.end method

.method public setUserPushFinished(Z)V
    .locals 3
    .param p1, "result"    # Z

    .prologue
    .line 2549
    sget-boolean v1, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v1, :cond_0

    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->pushListener:Lcom/netease/ntunisdk/base/OnPushListener;

    if-nez v1, :cond_0

    new-instance v1, Ljava/lang/AssertionError;

    const-string v2, "pushListener not set"

    invoke-direct {v1, v2}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v1

    .line 2550
    :cond_0
    const-string v1, "PUSH_CALLER_THREAD"

    const/4 v2, 0x1

    invoke-virtual {p0, v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v1

    const/4 v2, 0x2

    if-ne v1, v2, :cond_1

    .line 2551
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$67;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$67;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Z)V

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 2568
    :goto_0
    return-void

    .line 2559
    :cond_1
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2560
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$68;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$68;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Z)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    goto :goto_0
.end method

.method public share(Lcom/netease/ntunisdk/base/ShareInfo;)V
    .locals 0
    .param p1, "shareInfo"    # Lcom/netease/ntunisdk/base/ShareInfo;

    .prologue
    .line 2257
    return-void
.end method

.method public shareFinished(Z)V
    .locals 3
    .param p1, "result"    # Z

    .prologue
    .line 2424
    sget-boolean v1, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v1, :cond_0

    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->shareListener:Lcom/netease/ntunisdk/base/OnShareListener;

    if-nez v1, :cond_0

    new-instance v1, Ljava/lang/AssertionError;

    const-string v2, "shareListener not set"

    invoke-direct {v1, v2}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v1

    .line 2425
    :cond_0
    const-string v1, "SHARE_CALLER_THREAD"

    const/4 v2, 0x1

    invoke-virtual {p0, v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v1

    const/4 v2, 0x2

    if-ne v1, v2, :cond_1

    .line 2426
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$59;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$59;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Z)V

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 2443
    :goto_0
    return-void

    .line 2434
    :cond_1
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2435
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$60;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$60;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Z)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    goto :goto_0
.end method

.method protected showBoard(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 0
    .param p1, "category"    # Ljava/lang/String;
    .param p2, "termId"    # Ljava/lang/String;
    .param p3, "title"    # Ljava/lang/String;

    .prologue
    .line 3150
    return-void
.end method

.method public showConversation()V
    .locals 0

    .prologue
    .line 3588
    return-void
.end method

.method public showDaren()V
    .locals 0

    .prologue
    .line 2366
    return-void
.end method

.method public showFAQs()V
    .locals 0

    .prologue
    .line 3605
    return-void
.end method

.method protected showRewardView(Ljava/util/List;)V
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
    .line 3327
    .local p1, "rewardCodeList":Ljava/util/List;, "Ljava/util/List<Ljava/lang/String;>;"
    return-void
.end method

.method protected showWeb(Ljava/lang/String;)V
    .locals 0
    .param p1, "url"    # Ljava/lang/String;

    .prologue
    .line 3102
    return-void
.end method

.method public startupDone()V
    .locals 4

    .prologue
    .line 366
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->startupListener:Lcom/netease/ntunisdk/base/OnStartupListener;

    if-nez v0, :cond_0

    .line 367
    const-string v0, "UniSDK Base"

    const-string v1, "startupListener not set"

    invoke-static {v0, v1}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 381
    :goto_0
    return-void

    .line 370
    :cond_0
    sget-boolean v0, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v0, :cond_1

    iget-wide v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->uiThreadId:J

    invoke-static {}, Ljava/lang/Thread;->currentThread()Ljava/lang/Thread;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/Thread;->getId()J

    move-result-wide v2

    cmp-long v0, v0, v2

    if-eqz v0, :cond_1

    new-instance v0, Ljava/lang/AssertionError;

    const-string v1, "startupDone function can only by execute in UI thread"

    invoke-direct {v0, v1}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v0

    .line 371
    :cond_1
    const-string v0, "CONTINUE_CALLER_THREAD"

    const/4 v1, 0x1

    invoke-virtual {p0, v0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v0

    const/4 v1, 0x2

    if-ne v0, v1, :cond_2

    .line 372
    new-instance v0, Lcom/netease/ntunisdk/base/SdkBase$2;

    invoke-direct {v0, p0}, Lcom/netease/ntunisdk/base/SdkBase$2;-><init>(Lcom/netease/ntunisdk/base/SdkBase;)V

    invoke-virtual {p0, v0}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    goto :goto_0

    .line 379
    :cond_2
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->startupListener:Lcom/netease/ntunisdk/base/OnStartupListener;

    invoke-interface {v0}, Lcom/netease/ntunisdk/base/OnStartupListener;->startupDone()V

    goto :goto_0
.end method

.method public surfaceChanged(Landroid/view/SurfaceHolder;III)V
    .locals 3
    .param p1, "holder"    # Landroid/view/SurfaceHolder;
    .param p2, "format"    # I
    .param p3, "width"    # I
    .param p4, "height"    # I

    .prologue
    .line 99
    iget-boolean v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->isSurfaceViewValid:Z

    if-eqz v1, :cond_1

    .line 100
    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->runnableQueue:Ljava/util/concurrent/BlockingQueue;

    invoke-interface {v1}, Ljava/util/concurrent/BlockingQueue;->iterator()Ljava/util/Iterator;

    move-result-object v0

    .local v0, "iter":Ljava/util/Iterator;, "Ljava/util/Iterator<Ljava/lang/Runnable;>;"
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v1

    if-eqz v1, :cond_0

    .line 101
    iget-object v2, p0, Lcom/netease/ntunisdk/base/SdkBase;->glView:Landroid/opengl/GLSurfaceView;

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/Runnable;

    invoke-virtual {v2, v1}, Landroid/opengl/GLSurfaceView;->queueEvent(Ljava/lang/Runnable;)V

    goto :goto_0

    .line 103
    :cond_0
    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->runnableQueue:Ljava/util/concurrent/BlockingQueue;

    invoke-interface {v1}, Ljava/util/concurrent/BlockingQueue;->clear()V

    .line 105
    .end local v0    # "iter":Ljava/util/Iterator;, "Ljava/util/Iterator<Ljava/lang/Runnable;>;"
    :cond_1
    return-void
.end method

.method public surfaceCreated(Landroid/view/SurfaceHolder;)V
    .locals 1
    .param p1, "holder"    # Landroid/view/SurfaceHolder;

    .prologue
    .line 111
    const/4 v0, 0x1

    iput-boolean v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->isSurfaceViewValid:Z

    .line 112
    return-void
.end method

.method public surfaceDestroyed(Landroid/view/SurfaceHolder;)V
    .locals 1
    .param p1, "holder"    # Landroid/view/SurfaceHolder;

    .prologue
    .line 118
    const/4 v0, 0x0

    iput-boolean v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->isSurfaceViewValid:Z

    .line 119
    return-void
.end method

.method public switchAccount()V
    .locals 0

    .prologue
    .line 1165
    return-void
.end method

.method public abstract upLoadUserInfo()V
.end method

.method public updateAchievement(Ljava/lang/String;I)V
    .locals 0
    .param p1, "achievenmentId"    # Ljava/lang/String;
    .param p2, "step"    # I

    .prologue
    .line 3656
    return-void
.end method

.method public updateAchievementFinished(Z)V
    .locals 3
    .param p1, "result"    # Z

    .prologue
    .line 2235
    sget-boolean v1, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v1, :cond_0

    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->rankListener:Lcom/netease/ntunisdk/base/QueryRankListener;

    if-nez v1, :cond_0

    new-instance v1, Ljava/lang/AssertionError;

    const-string v2, "QueryRankListener not set"

    invoke-direct {v1, v2}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v1

    .line 2236
    :cond_0
    const-string v1, "RANK_CALLER_THREAD"

    const/4 v2, 0x1

    invoke-virtual {p0, v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v1

    const/4 v2, 0x2

    if-ne v1, v2, :cond_1

    .line 2237
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$49;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$49;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Z)V

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 2254
    :goto_0
    return-void

    .line 2245
    :cond_1
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2246
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$50;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$50;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Z)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    goto :goto_0
.end method

.method public updateRank(Ljava/lang/String;D)V
    .locals 0
    .param p1, "rankType"    # Ljava/lang/String;
    .param p2, "score"    # D

    .prologue
    .line 2179
    return-void
.end method

.method public updateRankFinished(Z)V
    .locals 3
    .param p1, "result"    # Z

    .prologue
    .line 2208
    sget-boolean v1, Lcom/netease/ntunisdk/base/SdkBase;->$assertionsDisabled:Z

    if-nez v1, :cond_0

    iget-object v1, p0, Lcom/netease/ntunisdk/base/SdkBase;->rankListener:Lcom/netease/ntunisdk/base/QueryRankListener;

    if-nez v1, :cond_0

    new-instance v1, Ljava/lang/AssertionError;

    const-string v2, "QueryRankListener not set"

    invoke-direct {v1, v2}, Ljava/lang/AssertionError;-><init>(Ljava/lang/Object;)V

    throw v1

    .line 2209
    :cond_0
    const-string v1, "RANK_CALLER_THREAD"

    const/4 v2, 0x1

    invoke-virtual {p0, v1, v2}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v1

    const/4 v2, 0x2

    if-ne v1, v2, :cond_1

    .line 2210
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$47;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$47;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Z)V

    invoke-virtual {p0, v1}, Lcom/netease/ntunisdk/base/SdkBase;->runOnGLThread(Ljava/lang/Runnable;)V

    .line 2227
    :goto_0
    return-void

    .line 2218
    :cond_1
    iget-object v0, p0, Lcom/netease/ntunisdk/base/SdkBase;->myCtx:Landroid/content/Context;

    check-cast v0, Landroid/app/Activity;

    .line 2219
    .local v0, "act":Landroid/app/Activity;
    new-instance v1, Lcom/netease/ntunisdk/base/SdkBase$48;

    invoke-direct {v1, p0, p1}, Lcom/netease/ntunisdk/base/SdkBase$48;-><init>(Lcom/netease/ntunisdk/base/SdkBase;Z)V

    invoke-virtual {v0, v1}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    goto :goto_0
.end method
