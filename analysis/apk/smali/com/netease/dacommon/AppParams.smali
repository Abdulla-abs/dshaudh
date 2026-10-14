.class public Lcom/netease/dacommon/AppParams;
.super Ljava/lang/Object;
.source "AppParams.java"


# static fields
.field public static m_Context:Landroid/content/Context;


# direct methods
.method public constructor <init>()V
    .locals 0

    .prologue
    .line 25
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public static getAppVersion()Ljava/lang/String;
    .locals 1

    .prologue
    .line 52
    const-string v0, "android"

    return-object v0
.end method

.method public static getDeviceMode()Ljava/lang/String;
    .locals 1

    .prologue
    .line 41
    sget-object v0, Landroid/os/Build;->MODEL:Ljava/lang/String;

    return-object v0
.end method

.method public static getIPAddress()Ljava/lang/String;
    .locals 1
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/net/SocketException;
        }
    .end annotation

    .prologue
    .line 68
    const-string v0, "unkown"

    .line 70
    .local v0, "ipaddress":Ljava/lang/String;
    return-object v0
.end method

.method public static getISP()Ljava/lang/String;
    .locals 5

    .prologue
    .line 102
    const-string v1, "unknown"

    .line 103
    .local v1, "ProvidersName":Ljava/lang/String;
    const-string v0, "unknown"

    .line 104
    .local v0, "IMSI":Ljava/lang/String;
    sget-object v3, Lcom/netease/dacommon/AppParams;->m_Context:Landroid/content/Context;

    const-string v4, "phone"

    invoke-virtual {v3, v4}, Landroid/content/Context;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Landroid/telephony/TelephonyManager;

    .line 106
    .local v2, "tm":Landroid/telephony/TelephonyManager;
    invoke-virtual {v2}, Landroid/telephony/TelephonyManager;->getSubscriberId()Ljava/lang/String;

    move-result-object v0

    .line 109
    if-eqz v0, :cond_0

    invoke-virtual {v0}, Ljava/lang/String;->length()I

    move-result v3

    if-nez v3, :cond_1

    .line 120
    :cond_0
    :goto_0
    return-object v1

    .line 111
    :cond_1
    const-string v3, "46000"

    invoke-virtual {v0, v3}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v3

    if-nez v3, :cond_2

    const-string v3, "46002"

    invoke-virtual {v0, v3}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v3

    if-eqz v3, :cond_3

    .line 112
    :cond_2
    const-string v1, "\ufffd\u0439\ufffd\ufffd\u01b6\ufffd"

    goto :goto_0

    .line 113
    :cond_3
    const-string v3, "46001"

    invoke-virtual {v0, v3}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v3

    if-eqz v3, :cond_4

    .line 114
    const-string v1, "\ufffd\u0439\ufffd\ufffd\ufffd\u0368"

    goto :goto_0

    .line 115
    :cond_4
    const-string v3, "46003"

    invoke-virtual {v0, v3}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v3

    if-eqz v3, :cond_5

    .line 116
    const-string v1, "\ufffd\u0439\ufffd\ufffd\ufffd\ufffd"

    goto :goto_0

    .line 118
    :cond_5
    move-object v1, v0

    goto :goto_0
.end method

.method public static getIdentifier()Ljava/lang/String;
    .locals 4

    .prologue
    .line 56
    sget-object v2, Lcom/netease/dacommon/AppParams;->m_Context:Landroid/content/Context;

    const-string v3, "phone"

    invoke-virtual {v2, v3}, Landroid/content/Context;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Landroid/telephony/TelephonyManager;

    .line 57
    .local v1, "tm":Landroid/telephony/TelephonyManager;
    const-string v0, "unknown"

    .line 59
    .local v0, "deviceID":Ljava/lang/String;
    if-eqz v1, :cond_0

    .line 60
    invoke-virtual {v1}, Landroid/telephony/TelephonyManager;->getDeviceId()Ljava/lang/String;

    move-result-object v0

    .line 62
    :cond_0
    const-string v2, "null"

    if-eq v0, v2, :cond_1

    if-nez v0, :cond_2

    .line 63
    :cond_1
    const-string v0, "unknown"

    .line 64
    :cond_2
    return-object v0
.end method

.method public static getLocation()Ljava/lang/String;
    .locals 2

    .prologue
    .line 45
    invoke-static {}, Ljava/util/Locale;->getDefault()Ljava/util/Locale;

    move-result-object v1

    invoke-virtual {v1}, Ljava/util/Locale;->getCountry()Ljava/lang/String;

    move-result-object v0

    .line 46
    .local v0, "nation":Ljava/lang/String;
    if-nez v0, :cond_0

    .line 47
    const-string v0, "unknown"

    .line 48
    :cond_0
    return-object v0
.end method

.method public static getMacAddress()Ljava/lang/String;
    .locals 5

    .prologue
    .line 74
    sget-object v3, Lcom/netease/dacommon/AppParams;->m_Context:Landroid/content/Context;

    const-string v4, "wifi"

    invoke-virtual {v3, v4}, Landroid/content/Context;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Landroid/net/wifi/WifiManager;

    .line 75
    .local v2, "wifi":Landroid/net/wifi/WifiManager;
    const-string v1, "unkown"

    .line 76
    .local v1, "macAddress":Ljava/lang/String;
    if-eqz v2, :cond_0

    .line 77
    invoke-virtual {v2}, Landroid/net/wifi/WifiManager;->getConnectionInfo()Landroid/net/wifi/WifiInfo;

    move-result-object v0

    .line 78
    .local v0, "info":Landroid/net/wifi/WifiInfo;
    if-eqz v0, :cond_0

    .line 79
    invoke-virtual {v0}, Landroid/net/wifi/WifiInfo;->getMacAddress()Ljava/lang/String;

    move-result-object v1

    .line 82
    .end local v0    # "info":Landroid/net/wifi/WifiInfo;
    :cond_0
    return-object v1
.end method

.method public static getMachineVersion()Ljava/lang/String;
    .locals 1

    .prologue
    .line 86
    const-string v0, "android"

    return-object v0
.end method

.method public static getNetType()Ljava/lang/String;
    .locals 5

    .prologue
    .line 90
    sget-object v3, Lcom/netease/dacommon/AppParams;->m_Context:Landroid/content/Context;

    const-string v4, "connectivity"

    invoke-virtual {v3, v4}, Landroid/content/Context;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Landroid/net/ConnectivityManager;

    .line 91
    .local v0, "connManager":Landroid/net/ConnectivityManager;
    invoke-virtual {v0}, Landroid/net/ConnectivityManager;->getActiveNetworkInfo()Landroid/net/NetworkInfo;

    move-result-object v2

    .line 92
    .local v2, "networkinfo":Landroid/net/NetworkInfo;
    const-string v1, "unkown"

    .line 94
    .local v1, "networkType":Ljava/lang/String;
    if-eqz v2, :cond_0

    .line 95
    invoke-virtual {v2}, Landroid/net/NetworkInfo;->getTypeName()Ljava/lang/String;

    move-result-object v1

    .line 98
    :cond_0
    return-object v1
.end method

.method public static getPushDevId()Ljava/lang/String;
    .locals 2

    .prologue
    .line 147
    invoke-static {}, Lcom/netease/pushclient/PushManager;->getDevId()Ljava/lang/String;

    move-result-object v0

    .line 148
    .local v0, "devId":Ljava/lang/String;
    const-string v1, ""

    if-ne v0, v1, :cond_0

    .line 149
    const-string v0, "default"

    .line 150
    :cond_0
    const-string v1, "Ngpush"

    invoke-static {v1, v0}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 151
    return-object v0
.end method

.method public static getSystemName()Ljava/lang/String;
    .locals 1

    .prologue
    .line 33
    const-string v0, "android"

    return-object v0
.end method

.method public static getSystemVersion()Ljava/lang/String;
    .locals 1

    .prologue
    .line 37
    sget-object v0, Landroid/os/Build$VERSION;->RELEASE:Ljava/lang/String;

    return-object v0
.end method

.method private static hasSuperuserApk()Z
    .locals 2

    .prologue
    .line 125
    new-instance v0, Ljava/io/File;

    const-string v1, "/system/app/Superuser.apk"

    invoke-direct {v0, v1}, Ljava/io/File;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0}, Ljava/io/File;->exists()Z

    move-result v0

    return v0
.end method

.method public static init(Landroid/content/Context;)V
    .locals 0
    .param p0, "ctx"    # Landroid/content/Context;

    .prologue
    .line 29
    sput-object p0, Lcom/netease/dacommon/AppParams;->m_Context:Landroid/content/Context;

    .line 30
    return-void
.end method

.method public static isRooted()I
    .locals 1

    .prologue
    .line 140
    invoke-static {}, Lcom/netease/dacommon/AppParams;->hasSuperuserApk()Z

    move-result v0

    if-nez v0, :cond_0

    invoke-static {}, Lcom/netease/dacommon/AppParams;->isTestKeyBuild()Z

    move-result v0

    if-eqz v0, :cond_1

    .line 141
    :cond_0
    const/4 v0, 0x1

    .line 142
    :goto_0
    return v0

    :cond_1
    const/4 v0, 0x0

    goto :goto_0
.end method

.method private static isTestKeyBuild()Z
    .locals 2

    .prologue
    .line 130
    sget-object v0, Landroid/os/Build;->TAGS:Ljava/lang/String;

    .line 131
    .local v0, "str":Ljava/lang/String;
    if-eqz v0, :cond_0

    const-string v1, "test-keys"

    invoke-virtual {v0, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-eqz v1, :cond_0

    .line 132
    const/4 v1, 0x1

    .line 134
    :goto_0
    return v1

    :cond_0
    const/4 v1, 0x0

    goto :goto_0
.end method
