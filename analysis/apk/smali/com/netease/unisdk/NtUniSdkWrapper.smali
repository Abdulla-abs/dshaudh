.class public Lcom/netease/unisdk/NtUniSdkWrapper;
.super Ljava/lang/Object;
.source "NtUniSdkWrapper.java"


# static fields
.field private static loginStatus:Z

.field static logout_login_time:J

.field private static m_Activity:Landroid/app/Activity;


# direct methods
.method static constructor <clinit>()V
    .locals 2

    .prologue
    .line 26
    const/4 v0, 0x0

    sput-boolean v0, Lcom/netease/unisdk/NtUniSdkWrapper;->loginStatus:Z

    .line 27
    const/4 v0, 0x0

    sput-object v0, Lcom/netease/unisdk/NtUniSdkWrapper;->m_Activity:Landroid/app/Activity;

    .line 45
    const-wide/16 v0, 0x0

    sput-wide v0, Lcom/netease/unisdk/NtUniSdkWrapper;->logout_login_time:J

    return-void
.end method

.method public constructor <init>()V
    .locals 0

    .prologue
    .line 19
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method static synthetic access$000(I)V
    .locals 0
    .param p0, "x0"    # I

    .prologue
    .line 19
    invoke-static {p0}, Lcom/netease/unisdk/NtUniSdkWrapper;->onLoginDone(I)V

    return-void
.end method

.method static synthetic access$100(Lcom/netease/ntunisdk/base/OrderInfo;)V
    .locals 0
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/OrderInfo;

    .prologue
    .line 19
    invoke-static {p0}, Lcom/netease/unisdk/NtUniSdkWrapper;->onOrderCheckDone(Lcom/netease/ntunisdk/base/OrderInfo;)V

    return-void
.end method

.method static synthetic access$200(I)V
    .locals 0
    .param p0, "x0"    # I

    .prologue
    .line 19
    invoke-static {p0}, Lcom/netease/unisdk/NtUniSdkWrapper;->onLogoutDone(I)V

    return-void
.end method

.method static synthetic access$300()V
    .locals 0

    .prologue
    .line 19
    invoke-static {}, Lcom/netease/unisdk/NtUniSdkWrapper;->onContinueDone()V

    return-void
.end method

.method static synthetic access$400()V
    .locals 0

    .prologue
    .line 19
    invoke-static {}, Lcom/netease/unisdk/NtUniSdkWrapper;->onExitDone()V

    return-void
.end method

.method static synthetic access$500()Landroid/app/Activity;
    .locals 1

    .prologue
    .line 19
    sget-object v0, Lcom/netease/unisdk/NtUniSdkWrapper;->m_Activity:Landroid/app/Activity;

    return-object v0
.end method

.method static synthetic access$600(I)V
    .locals 0
    .param p0, "x0"    # I

    .prologue
    .line 19
    invoke-static {p0}, Lcom/netease/unisdk/NtUniSdkWrapper;->onFinishInit(I)V

    return-void
.end method

.method public static antiAddiction(Ljava/lang/String;Ljava/lang/String;)V
    .locals 3
    .param p0, "uid"    # Ljava/lang/String;
    .param p1, "token"    # Ljava/lang/String;

    .prologue
    .line 247
    const-string v0, "NtUniSdk"

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v2, "antiAddiction uid = "

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v2, " token = "

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 248
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    const-string v1, "UIN"

    invoke-interface {v0, v1, p0}, Lcom/netease/ntunisdk/base/GamerInterface;->setPropStr(Ljava/lang/String;Ljava/lang/String;)V

    .line 249
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    invoke-interface {v0, p1}, Lcom/netease/ntunisdk/base/GamerInterface;->ntAntiAddiction(Ljava/lang/String;)V

    .line 250
    return-void
.end method

.method public static exit()V
    .locals 1

    .prologue
    .line 238
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    invoke-interface {v0}, Lcom/netease/ntunisdk/base/GamerInterface;->exit()V

    .line 239
    return-void
.end method

.method public static getAppChannel()Ljava/lang/String;
    .locals 1

    .prologue
    .line 230
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    invoke-interface {v0}, Lcom/netease/ntunisdk/base/GamerInterface;->getAppChannel()Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public static getChannel()Ljava/lang/String;
    .locals 1

    .prologue
    .line 226
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    invoke-interface {v0}, Lcom/netease/ntunisdk/base/GamerInterface;->getChannel()Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public static getPlatform()Ljava/lang/String;
    .locals 1

    .prologue
    .line 234
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    invoke-interface {v0}, Lcom/netease/ntunisdk/base/GamerInterface;->getPlatform()Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public static getPropInt(Ljava/lang/String;)I
    .locals 2
    .param p0, "prop"    # Ljava/lang/String;

    .prologue
    .line 214
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    const/4 v1, -0x1

    invoke-interface {v0, p0, v1}, Lcom/netease/ntunisdk/base/GamerInterface;->getPropInt(Ljava/lang/String;I)I

    move-result v0

    return v0
.end method

.method public static getPropStr(Ljava/lang/String;)Ljava/lang/String;
    .locals 1
    .param p0, "prop"    # Ljava/lang/String;

    .prologue
    .line 206
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    invoke-interface {v0, p0}, Lcom/netease/ntunisdk/base/GamerInterface;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public static hasLogin()Z
    .locals 1

    .prologue
    .line 222
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    invoke-interface {v0}, Lcom/netease/ntunisdk/base/GamerInterface;->hasLogin()Z

    move-result v0

    return v0
.end method

.method public static ntCheckOrder(Lcom/netease/ntunisdk/base/OrderInfo;I)V
    .locals 2
    .param p0, "order"    # Lcom/netease/ntunisdk/base/OrderInfo;
    .param p1, "cbThreadMode"    # I

    .prologue
    .line 172
    const-string v0, "NtUniSdk"

    const-string v1, "ntCheckOrder called"

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 173
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    invoke-interface {v0, p0}, Lcom/netease/ntunisdk/base/GamerInterface;->ntCheckOrder(Lcom/netease/ntunisdk/base/OrderInfo;)V

    .line 174
    return-void
.end method

.method public static ntInit(Landroid/app/Activity;)V
    .locals 3
    .param p0, "a"    # Landroid/app/Activity;

    .prologue
    .line 149
    sput-object p0, Lcom/netease/unisdk/NtUniSdkWrapper;->m_Activity:Landroid/app/Activity;

    .line 150
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    const-string v1, "iscocos2d"

    const-string v2, "true"

    invoke-interface {v0, v1, v2}, Lcom/netease/ntunisdk/base/GamerInterface;->setPropStr(Ljava/lang/String;Ljava/lang/String;)V

    .line 151
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    const-string v1, "GAME_INNER_SWITCH_USER"

    const-string v2, "true"

    invoke-interface {v0, v1, v2}, Lcom/netease/ntunisdk/base/GamerInterface;->setPropStr(Ljava/lang/String;Ljava/lang/String;)V

    .line 152
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    new-instance v1, Lcom/netease/unisdk/NtUniSdkWrapper$7;

    invoke-direct {v1}, Lcom/netease/unisdk/NtUniSdkWrapper$7;-><init>()V

    invoke-interface {v0, v1}, Lcom/netease/ntunisdk/base/GamerInterface;->ntInit(Lcom/netease/ntunisdk/base/OnFinishInitListener;)V

    .line 164
    return-void
.end method

.method public static ntInitCallback()V
    .locals 3

    .prologue
    const/4 v2, 0x2

    .line 47
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    new-instance v1, Lcom/netease/unisdk/NtUniSdkWrapper$1;

    invoke-direct {v1}, Lcom/netease/unisdk/NtUniSdkWrapper$1;-><init>()V

    invoke-interface {v0, v1, v2}, Lcom/netease/ntunisdk/base/GamerInterface;->setLoginListener(Lcom/netease/ntunisdk/base/OnLoginDoneListener;I)V

    .line 55
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    new-instance v1, Lcom/netease/unisdk/NtUniSdkWrapper$2;

    invoke-direct {v1}, Lcom/netease/unisdk/NtUniSdkWrapper$2;-><init>()V

    invoke-interface {v0, v1, v2}, Lcom/netease/ntunisdk/base/GamerInterface;->setOrderListener(Lcom/netease/ntunisdk/base/OnOrderCheckListener;I)V

    .line 66
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    new-instance v1, Lcom/netease/unisdk/NtUniSdkWrapper$3;

    invoke-direct {v1}, Lcom/netease/unisdk/NtUniSdkWrapper$3;-><init>()V

    invoke-interface {v0, v1, v2}, Lcom/netease/ntunisdk/base/GamerInterface;->setLogoutListener(Lcom/netease/ntunisdk/base/OnLogoutDoneListener;I)V

    .line 74
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    new-instance v1, Lcom/netease/unisdk/NtUniSdkWrapper$4;

    invoke-direct {v1}, Lcom/netease/unisdk/NtUniSdkWrapper$4;-><init>()V

    invoke-interface {v0, v1, v2}, Lcom/netease/ntunisdk/base/GamerInterface;->setContinueListener(Lcom/netease/ntunisdk/base/OnContinueListener;I)V

    .line 82
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    new-instance v1, Lcom/netease/unisdk/NtUniSdkWrapper$5;

    invoke-direct {v1}, Lcom/netease/unisdk/NtUniSdkWrapper$5;-><init>()V

    invoke-interface {v0, v1, v2}, Lcom/netease/ntunisdk/base/GamerInterface;->setExitListener(Lcom/netease/ntunisdk/base/OnExitListener;I)V

    .line 98
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    new-instance v1, Lcom/netease/unisdk/NtUniSdkWrapper$6;

    invoke-direct {v1}, Lcom/netease/unisdk/NtUniSdkWrapper$6;-><init>()V

    invoke-interface {v0, v1, v2}, Lcom/netease/ntunisdk/base/GamerInterface;->setQueryFriendListener(Lcom/netease/ntunisdk/base/QueryFriendListener;I)V

    .line 146
    return-void
.end method

.method public static ntInitDebugMode(Landroid/content/Context;)V
    .locals 8
    .param p0, "c"    # Landroid/content/Context;

    .prologue
    .line 30
    new-instance v4, Ljava/util/Properties;

    invoke-direct {v4}, Ljava/util/Properties;-><init>()V

    .line 32
    .local v4, "props":Ljava/util/Properties;
    :try_start_0
    invoke-virtual {p0}, Landroid/content/Context;->getAssets()Landroid/content/res/AssetManager;

    move-result-object v5

    const-string v6, "gameConfig.properties"

    invoke-virtual {v5, v6}, Landroid/content/res/AssetManager;->open(Ljava/lang/String;)Ljava/io/InputStream;

    move-result-object v3

    .line 33
    .local v3, "is":Ljava/io/InputStream;
    invoke-virtual {v4, v3}, Ljava/util/Properties;->load(Ljava/io/InputStream;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 39
    const-string v5, "debug"

    const-string v6, "false"

    invoke-virtual {v4, v5, v6}, Ljava/util/Properties;->getProperty(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 40
    .local v0, "debug":Ljava/lang/String;
    const-string v5, "true"

    invoke-virtual {v0, v5}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v1

    .line 41
    .local v1, "debugMode":Z
    const-string v5, "NtUniSdk"

    new-instance v6, Ljava/lang/StringBuilder;

    invoke-direct {v6}, Ljava/lang/StringBuilder;-><init>()V

    const-string v7, "gameConfig.properties debug = "

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v6

    const-string v7, " DebugMode = "

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6, v1}, Ljava/lang/StringBuilder;->append(Z)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v6

    invoke-static {v5, v6}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 42
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v5

    invoke-interface {v5, v1}, Lcom/netease/ntunisdk/base/GamerInterface;->setDebugMode(Z)V

    .line 43
    .end local v0    # "debug":Ljava/lang/String;
    .end local v1    # "debugMode":Z
    .end local v3    # "is":Ljava/io/InputStream;
    :goto_0
    return-void

    .line 34
    :catch_0
    move-exception v2

    .line 35
    .local v2, "e":Ljava/lang/Exception;
    const-string v5, "NtUniSdk"

    const-string v6, "gameConfig.properties not found, DebugMode = false"

    invoke-static {v5, v6}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 36
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v5

    const/4 v6, 0x0

    invoke-interface {v5, v6}, Lcom/netease/ntunisdk/base/GamerInterface;->setDebugMode(Z)V

    goto :goto_0
.end method

.method public static ntLogin(I)V
    .locals 2
    .param p0, "cbThreadMode"    # I

    .prologue
    .line 167
    const-string v0, "NtUniSdk"

    const-string v1, "ntLogin"

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 168
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    invoke-interface {v0}, Lcom/netease/ntunisdk/base/GamerInterface;->ntLogin()V

    .line 169
    return-void
.end method

.method public static ntLogout(I)V
    .locals 2
    .param p0, "cbThreadMode"    # I

    .prologue
    .line 177
    const-string v0, "NtUniSdk"

    const-string v1, "ntLogout"

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 178
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    invoke-interface {v0}, Lcom/netease/ntunisdk/base/GamerInterface;->ntLogout()V

    .line 179
    return-void
.end method

.method public static ntOpenExitView(I)V
    .locals 2
    .param p0, "cbThreadMode"    # I

    .prologue
    .line 196
    const-string v0, "NtUniSdk"

    const-string v1, "ntOpenExitView"

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 197
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    invoke-interface {v0}, Lcom/netease/ntunisdk/base/GamerInterface;->ntOpenExitView()V

    .line 198
    return-void
.end method

.method public static ntOpenManager()V
    .locals 2

    .prologue
    .line 182
    const-string v0, "NtUniSdk"

    const-string v1, "ntOpenManager"

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 183
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    invoke-interface {v0}, Lcom/netease/ntunisdk/base/GamerInterface;->ntOpenManager()V

    .line 184
    return-void
.end method

.method public static ntOpenPauseView(I)V
    .locals 2
    .param p0, "cbThreadMode"    # I

    .prologue
    .line 191
    const-string v0, "NtUniSdk"

    const-string v1, "ntOpenManager"

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 192
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    invoke-interface {v0}, Lcom/netease/ntunisdk/base/GamerInterface;->ntOpenPauseView()V

    .line 193
    return-void
.end method

.method public static ntSetFloatBtnVisible(Z)V
    .locals 1
    .param p0, "visible"    # Z

    .prologue
    .line 187
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    invoke-interface {v0, p0}, Lcom/netease/ntunisdk/base/GamerInterface;->ntSetFloatBtnVisible(Z)V

    .line 188
    return-void
.end method

.method private static native onContinueDone()V
.end method

.method private static native onExitDone()V
.end method

.method private static native onFinishInit(I)V
.end method

.method private static native onLoginDone(I)V
.end method

.method private static native onLogoutDone(I)V
.end method

.method private static native onOrderCheckDone(Lcom/netease/ntunisdk/base/OrderInfo;)V
.end method

.method public static setPropInt(Ljava/lang/String;I)V
    .locals 1
    .param p0, "prop"    # Ljava/lang/String;
    .param p1, "val"    # I

    .prologue
    .line 218
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    invoke-interface {v0, p0, p1}, Lcom/netease/ntunisdk/base/GamerInterface;->setPropInt(Ljava/lang/String;I)V

    .line 219
    return-void
.end method

.method public static setPropStr(Ljava/lang/String;Ljava/lang/String;)V
    .locals 1
    .param p0, "prop"    # Ljava/lang/String;
    .param p1, "val"    # Ljava/lang/String;

    .prologue
    .line 210
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    invoke-interface {v0, p0, p1}, Lcom/netease/ntunisdk/base/GamerInterface;->setPropStr(Ljava/lang/String;Ljava/lang/String;)V

    .line 211
    return-void
.end method

.method public static showDaren()V
    .locals 2

    .prologue
    .line 201
    const-string v0, "NtUniSdk"

    const-string v1, "showDaren"

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 202
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    invoke-interface {v0}, Lcom/netease/ntunisdk/base/GamerInterface;->ntShowDaren()V

    .line 203
    return-void
.end method

.method public static updateRank(F)V
    .locals 4
    .param p0, "score"    # F

    .prologue
    .line 242
    const-string v0, "NtUniSdk"

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v2, "updateRank score = "

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, p0}, Ljava/lang/StringBuilder;->append(F)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 243
    invoke-static {}, Lcom/netease/ntunisdk/base/SdkMgr;->getInst()Lcom/netease/ntunisdk/base/GamerInterface;

    move-result-object v0

    const-string v1, "QUERY_RANK_TYPE_SCORE"

    float-to-double v2, p0

    invoke-interface {v0, v1, v2, v3}, Lcom/netease/ntunisdk/base/GamerInterface;->ntUpdateRank(Ljava/lang/String;D)V

    .line 244
    return-void
.end method
