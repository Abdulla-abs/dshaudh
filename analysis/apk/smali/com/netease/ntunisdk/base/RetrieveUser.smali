.class public Lcom/netease/ntunisdk/base/RetrieveUser;
.super Ljava/lang/Object;
.source "RetrieveUser.java"


# static fields
.field private static final NtUniSdkDeviceId_key:Ljava/lang/String; = "NtUniSdkDeviceId_key"

.field private static final NtUniSdkDeviceKey_key:Ljava/lang/String; = "NtUniSdkDeviceKey_key"

.field private static final NtUniSdk_SP:Ljava/lang/String; = "NtUniSdk_SP"

.field private static final TAG:Ljava/lang/String; = "UniSDK RetrieveUser"

.field private static final USER_URL:Ljava/lang/String; = "http://fc.my.163.com:8080/"


# instance fields
.field private mSdkBase:Lcom/netease/ntunisdk/base/SdkBase;

.field private myCtx:Landroid/content/Context;

.field private sp:Landroid/content/SharedPreferences;


# direct methods
.method constructor <init>(Lcom/netease/ntunisdk/base/SdkBase;Landroid/content/Context;)V
    .locals 3
    .param p1, "sdkBase"    # Lcom/netease/ntunisdk/base/SdkBase;
    .param p2, "ctx"    # Landroid/content/Context;

    .prologue
    .line 36
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 37
    iput-object p1, p0, Lcom/netease/ntunisdk/base/RetrieveUser;->mSdkBase:Lcom/netease/ntunisdk/base/SdkBase;

    .line 38
    iput-object p2, p0, Lcom/netease/ntunisdk/base/RetrieveUser;->myCtx:Landroid/content/Context;

    .line 39
    iget-object v0, p0, Lcom/netease/ntunisdk/base/RetrieveUser;->myCtx:Landroid/content/Context;

    const-string v1, "NtUniSdk_SP"

    const/4 v2, 0x0

    invoke-virtual {v0, v1, v2}, Landroid/content/Context;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    move-result-object v0

    iput-object v0, p0, Lcom/netease/ntunisdk/base/RetrieveUser;->sp:Landroid/content/SharedPreferences;

    .line 40
    return-void
.end method

.method static synthetic access$000(Lcom/netease/ntunisdk/base/RetrieveUser;Ljava/lang/String;)Ljava/lang/String;
    .locals 1
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/RetrieveUser;
    .param p1, "x1"    # Ljava/lang/String;

    .prologue
    .line 21
    invoke-direct {p0, p1}, Lcom/netease/ntunisdk/base/RetrieveUser;->getNtUniSdkSp(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method static synthetic access$100(Lcom/netease/ntunisdk/base/RetrieveUser;)Landroid/content/Context;
    .locals 1
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/RetrieveUser;

    .prologue
    .line 21
    iget-object v0, p0, Lcom/netease/ntunisdk/base/RetrieveUser;->myCtx:Landroid/content/Context;

    return-object v0
.end method

.method static synthetic access$200(Lcom/netease/ntunisdk/base/RetrieveUser;Ljava/lang/String;Ljava/lang/String;)V
    .locals 0
    .param p0, "x0"    # Lcom/netease/ntunisdk/base/RetrieveUser;
    .param p1, "x1"    # Ljava/lang/String;
    .param p2, "x2"    # Ljava/lang/String;

    .prologue
    .line 21
    invoke-direct {p0, p1, p2}, Lcom/netease/ntunisdk/base/RetrieveUser;->setNtUniSdkSp(Ljava/lang/String;Ljava/lang/String;)V

    return-void
.end method

.method private encrypt(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    .locals 9
    .param p1, "deviceKey"    # Ljava/lang/String;
    .param p2, "data"    # Ljava/lang/String;

    .prologue
    const/16 v8, 0x10

    .line 175
    invoke-virtual {p1}, Ljava/lang/String;->length()I

    move-result v7

    if-ge v7, v8, :cond_0

    .line 176
    const-string v7, "UniSDK RetrieveUser"

    const-string v8, "encrypt deviceKey error"

    invoke-static {v7, v8}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    .line 177
    const-string v7, ""

    .line 193
    :goto_0
    return-object v7

    .line 180
    :cond_0
    const/4 v7, 0x0

    const/16 v8, 0x10

    :try_start_0
    invoke-virtual {p1, v7, v8}, Ljava/lang/String;->substring(II)Ljava/lang/String;

    move-result-object v5

    .line 181
    .local v5, "key":Ljava/lang/String;
    const/16 v7, 0x10

    invoke-virtual {p1, v7}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object v3

    .line 182
    .local v3, "iv":Ljava/lang/String;
    new-instance v6, Ljavax/crypto/spec/SecretKeySpec;

    invoke-virtual {v5}, Ljava/lang/String;->getBytes()[B

    move-result-object v7

    const-string v8, "AES"

    invoke-direct {v6, v7, v8}, Ljavax/crypto/spec/SecretKeySpec;-><init>([BLjava/lang/String;)V

    .line 183
    .local v6, "keyspec":Ljavax/crypto/spec/SecretKeySpec;
    new-instance v4, Ljavax/crypto/spec/IvParameterSpec;

    invoke-virtual {v3}, Ljava/lang/String;->getBytes()[B

    move-result-object v7

    invoke-direct {v4, v7}, Ljavax/crypto/spec/IvParameterSpec;-><init>([B)V

    .line 184
    .local v4, "ivspec":Ljavax/crypto/spec/IvParameterSpec;
    const-string v7, "AES/CBC/PKCS5Padding"

    invoke-static {v7}, Ljavax/crypto/Cipher;->getInstance(Ljava/lang/String;)Ljavax/crypto/Cipher;

    move-result-object v0

    .line 185
    .local v0, "cipher":Ljavax/crypto/Cipher;
    const/4 v7, 0x1

    invoke-virtual {v0, v7, v6, v4}, Ljavax/crypto/Cipher;->init(ILjava/security/Key;Ljava/security/spec/AlgorithmParameterSpec;)V

    .line 186
    invoke-virtual {p2}, Ljava/lang/String;->getBytes()[B

    move-result-object v7

    invoke-virtual {v0, v7}, Ljavax/crypto/Cipher;->doFinal([B)[B

    move-result-object v2

    .line 188
    .local v2, "encrypted":[B
    invoke-direct {p0, v2}, Lcom/netease/ntunisdk/base/RetrieveUser;->parseByte2HexStr([B)Ljava/lang/String;
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    move-result-object v7

    goto :goto_0

    .line 190
    .end local v0    # "cipher":Ljavax/crypto/Cipher;
    .end local v2    # "encrypted":[B
    .end local v3    # "iv":Ljava/lang/String;
    .end local v4    # "ivspec":Ljavax/crypto/spec/IvParameterSpec;
    .end local v5    # "key":Ljava/lang/String;
    .end local v6    # "keyspec":Ljavax/crypto/spec/SecretKeySpec;
    :catch_0
    move-exception v1

    .line 191
    .local v1, "e":Ljava/lang/Exception;
    const-string v7, "UniSDK RetrieveUser"

    invoke-virtual {v1}, Ljava/lang/Exception;->getMessage()Ljava/lang/String;

    move-result-object v8

    invoke-static {v7, v8}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    .line 193
    const-string v7, ""

    goto :goto_0
.end method

.method private getNtUniSdkSp(Ljava/lang/String;)Ljava/lang/String;
    .locals 2
    .param p1, "key"    # Ljava/lang/String;

    .prologue
    .line 47
    iget-object v0, p0, Lcom/netease/ntunisdk/base/RetrieveUser;->sp:Landroid/content/SharedPreferences;

    const-string v1, ""

    invoke-interface {v0, p1, v1}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method private parseByte2HexStr([B)Ljava/lang/String;
    .locals 5
    .param p1, "buf"    # [B

    .prologue
    .line 203
    new-instance v2, Ljava/lang/StringBuffer;

    invoke-direct {v2}, Ljava/lang/StringBuffer;-><init>()V

    .line 204
    .local v2, "sb":Ljava/lang/StringBuffer;
    const/4 v1, 0x0

    .local v1, "i":I
    :goto_0
    array-length v3, p1

    if-ge v1, v3, :cond_1

    .line 205
    aget-byte v3, p1, v1

    and-int/lit16 v3, v3, 0xff

    invoke-static {v3}, Ljava/lang/Integer;->toHexString(I)Ljava/lang/String;

    move-result-object v0

    .line 206
    .local v0, "hex":Ljava/lang/String;
    invoke-virtual {v0}, Ljava/lang/String;->length()I

    move-result v3

    const/4 v4, 0x1

    if-ne v3, v4, :cond_0

    .line 207
    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    const/16 v4, 0x30

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(C)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 209
    :cond_0
    invoke-virtual {v2, v0}, Ljava/lang/StringBuffer;->append(Ljava/lang/String;)Ljava/lang/StringBuffer;

    .line 204
    add-int/lit8 v1, v1, 0x1

    goto :goto_0

    .line 211
    .end local v0    # "hex":Ljava/lang/String;
    :cond_1
    invoke-virtual {v2}, Ljava/lang/StringBuffer;->toString()Ljava/lang/String;

    move-result-object v3

    return-object v3
.end method

.method private setNtUniSdkSp(Ljava/lang/String;Ljava/lang/String;)V
    .locals 1
    .param p1, "key"    # Ljava/lang/String;
    .param p2, "value"    # Ljava/lang/String;

    .prologue
    .line 43
    iget-object v0, p0, Lcom/netease/ntunisdk/base/RetrieveUser;->sp:Landroid/content/SharedPreferences;

    invoke-interface {v0}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;

    move-result-object v0

    invoke-interface {v0, p1, p2}, Landroid/content/SharedPreferences$Editor;->putString(Ljava/lang/String;Ljava/lang/String;)Landroid/content/SharedPreferences$Editor;

    move-result-object v0

    invoke-interface {v0}, Landroid/content/SharedPreferences$Editor;->commit()Z

    .line 44
    return-void
.end method


# virtual methods
.method requestRetrieveUser4Config()V
    .locals 8

    .prologue
    const/4 v2, 0x1

    const/4 v3, 0x0

    .line 54
    iget-object v4, p0, Lcom/netease/ntunisdk/base/RetrieveUser;->mSdkBase:Lcom/netease/ntunisdk/base/SdkBase;

    const-string v5, "RETRIEVE_USER"

    invoke-virtual {v4, v5, v3}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v4

    if-ne v4, v2, :cond_1

    move v0, v2

    .line 55
    .local v0, "isOpen":Z
    :goto_0
    if-eqz v0, :cond_0

    .line 56
    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    const-string v5, "http://fc.my.163.com:8080/"

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    const-string v5, "config?channel=%s&gameid=%s&platform=%s"

    const/4 v6, 0x3

    new-array v6, v6, [Ljava/lang/Object;

    iget-object v7, p0, Lcom/netease/ntunisdk/base/RetrieveUser;->mSdkBase:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v7}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v7

    aput-object v7, v6, v3

    iget-object v3, p0, Lcom/netease/ntunisdk/base/RetrieveUser;->mSdkBase:Lcom/netease/ntunisdk/base/SdkBase;

    const-string v7, "GAMEID"

    invoke-virtual {v3, v7}, Lcom/netease/ntunisdk/base/SdkBase;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    aput-object v3, v6, v2

    const/4 v2, 0x2

    iget-object v3, p0, Lcom/netease/ntunisdk/base/RetrieveUser;->mSdkBase:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v3}, Lcom/netease/ntunisdk/base/SdkBase;->getPlatform()Ljava/lang/String;

    move-result-object v3

    aput-object v3, v6, v2

    invoke-static {v5, v6}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v4, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    .line 58
    .local v1, "url":Ljava/lang/String;
    const-string v2, "UniSDK RetrieveUser"

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    const-string v4, "requestRetrieveUser4Config url:"

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2, v3}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    .line 59
    new-instance v2, Lcom/netease/ntunisdk/base/RetrieveUser$1;

    invoke-direct {v2, p0}, Lcom/netease/ntunisdk/base/RetrieveUser$1;-><init>(Lcom/netease/ntunisdk/base/RetrieveUser;)V

    invoke-static {v1, v2}, Lcom/netease/ntunisdk/base/utils/NetUtil;->wget(Ljava/lang/String;Lcom/netease/ntunisdk/base/utils/WgetDoneCallback;)V

    .line 96
    .end local v1    # "url":Ljava/lang/String;
    :cond_0
    return-void

    .end local v0    # "isOpen":Z
    :cond_1
    move v0, v3

    .line 54
    goto :goto_0
.end method

.method requestRetrieveUser4Device()V
    .locals 10

    .prologue
    const/4 v4, 0x1

    const/4 v5, 0x0

    .line 102
    iget-object v6, p0, Lcom/netease/ntunisdk/base/RetrieveUser;->mSdkBase:Lcom/netease/ntunisdk/base/SdkBase;

    const-string v7, "RETRIEVE_USER"

    invoke-virtual {v6, v7, v5}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v6

    if-ne v6, v4, :cond_2

    move v2, v4

    .line 103
    .local v2, "isOpen":Z
    :goto_0
    const-string v6, "NtUniSdkDeviceId_key"

    invoke-direct {p0, v6}, Lcom/netease/ntunisdk/base/RetrieveUser;->getNtUniSdkSp(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 104
    .local v0, "deviceId":Ljava/lang/String;
    const-string v6, "NtUniSdkDeviceKey_key"

    invoke-direct {p0, v6}, Lcom/netease/ntunisdk/base/RetrieveUser;->getNtUniSdkSp(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    .line 105
    .local v1, "deviceKey":Ljava/lang/String;
    if-eqz v2, :cond_1

    invoke-static {v0}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v6

    if-nez v6, :cond_0

    invoke-static {v1}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v6

    if-eqz v6, :cond_1

    .line 106
    :cond_0
    new-instance v6, Ljava/lang/StringBuilder;

    invoke-direct {v6}, Ljava/lang/StringBuilder;-><init>()V

    const-string v7, "http://fc.my.163.com:8080/"

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v6

    const-string v7, "device?channel=%s&gameid=%s&platform=%s&imsi=%s&mac=%s&mobilemodel=%s"

    const/4 v8, 0x6

    new-array v8, v8, [Ljava/lang/Object;

    iget-object v9, p0, Lcom/netease/ntunisdk/base/RetrieveUser;->mSdkBase:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v9}, Lcom/netease/ntunisdk/base/SdkBase;->getChannel()Ljava/lang/String;

    move-result-object v9

    aput-object v9, v8, v5

    iget-object v5, p0, Lcom/netease/ntunisdk/base/RetrieveUser;->mSdkBase:Lcom/netease/ntunisdk/base/SdkBase;

    const-string v9, "GAMEID"

    invoke-virtual {v5, v9}, Lcom/netease/ntunisdk/base/SdkBase;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    aput-object v5, v8, v4

    const/4 v4, 0x2

    iget-object v5, p0, Lcom/netease/ntunisdk/base/RetrieveUser;->mSdkBase:Lcom/netease/ntunisdk/base/SdkBase;

    invoke-virtual {v5}, Lcom/netease/ntunisdk/base/SdkBase;->getPlatform()Ljava/lang/String;

    move-result-object v5

    aput-object v5, v8, v4

    const/4 v4, 0x3

    iget-object v5, p0, Lcom/netease/ntunisdk/base/RetrieveUser;->myCtx:Landroid/content/Context;

    invoke-static {v5}, Lcom/netease/ntunisdk/base/UniSdkUtils;->getMobileIMSI(Landroid/content/Context;)Ljava/lang/String;

    move-result-object v5

    aput-object v5, v8, v4

    const/4 v4, 0x4

    iget-object v5, p0, Lcom/netease/ntunisdk/base/RetrieveUser;->myCtx:Landroid/content/Context;

    invoke-static {v5}, Lcom/netease/ntunisdk/base/UniSdkUtils;->getMacAddress(Landroid/content/Context;)Ljava/lang/String;

    move-result-object v5

    aput-object v5, v8, v4

    const/4 v4, 0x5

    invoke-static {}, Lcom/netease/ntunisdk/base/UniSdkUtils;->getMobileModel()Ljava/lang/String;

    move-result-object v5

    aput-object v5, v8, v4

    invoke-static {v7, v8}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v6, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    .line 108
    .local v3, "url":Ljava/lang/String;
    const-string v4, "UniSDK RetrieveUser"

    new-instance v5, Ljava/lang/StringBuilder;

    invoke-direct {v5}, Ljava/lang/StringBuilder;-><init>()V

    const-string v6, "requestRetrieveUser4Device url:"

    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-static {v4, v5}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    .line 109
    new-instance v4, Lcom/netease/ntunisdk/base/RetrieveUser$2;

    invoke-direct {v4, p0}, Lcom/netease/ntunisdk/base/RetrieveUser$2;-><init>(Lcom/netease/ntunisdk/base/RetrieveUser;)V

    invoke-static {v3, v4}, Lcom/netease/ntunisdk/base/utils/NetUtil;->wget(Ljava/lang/String;Lcom/netease/ntunisdk/base/utils/WgetDoneCallback;)V

    .line 128
    .end local v3    # "url":Ljava/lang/String;
    :cond_1
    return-void

    .end local v0    # "deviceId":Ljava/lang/String;
    .end local v1    # "deviceKey":Ljava/lang/String;
    .end local v2    # "isOpen":Z
    :cond_2
    move v2, v5

    .line 102
    goto/16 :goto_0
.end method

.method requestRetrieveUser4Login()V
    .locals 15

    .prologue
    const/4 v11, 0x1

    const/4 v12, 0x0

    .line 135
    iget-object v13, p0, Lcom/netease/ntunisdk/base/RetrieveUser;->mSdkBase:Lcom/netease/ntunisdk/base/SdkBase;

    const-string v14, "RETRIEVE_USER"

    invoke-virtual {v13, v14, v12}, Lcom/netease/ntunisdk/base/SdkBase;->getPropInt(Ljava/lang/String;I)I

    move-result v13

    if-ne v13, v11, :cond_0

    move v7, v11

    .line 136
    .local v7, "isOpen":Z
    :goto_0
    const-string v13, "NtUniSdkDeviceId_key"

    invoke-direct {p0, v13}, Lcom/netease/ntunisdk/base/RetrieveUser;->getNtUniSdkSp(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    .line 137
    .local v3, "deviceId":Ljava/lang/String;
    const-string v13, "NtUniSdkDeviceKey_key"

    invoke-direct {p0, v13}, Lcom/netease/ntunisdk/base/RetrieveUser;->getNtUniSdkSp(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    .line 138
    .local v4, "deviceKey":Ljava/lang/String;
    iget-object v13, p0, Lcom/netease/ntunisdk/base/RetrieveUser;->mSdkBase:Lcom/netease/ntunisdk/base/SdkBase;

    const-string v14, "USERINFO_AID"

    invoke-virtual {v13, v14}, Lcom/netease/ntunisdk/base/SdkBase;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 139
    .local v0, "aid":Ljava/lang/String;
    iget-object v13, p0, Lcom/netease/ntunisdk/base/RetrieveUser;->mSdkBase:Lcom/netease/ntunisdk/base/SdkBase;

    const-string v14, "USERINFO_NAME"

    invoke-virtual {v13, v14}, Lcom/netease/ntunisdk/base/SdkBase;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v8

    .line 140
    .local v8, "nickname":Ljava/lang/String;
    iget-object v13, p0, Lcom/netease/ntunisdk/base/RetrieveUser;->mSdkBase:Lcom/netease/ntunisdk/base/SdkBase;

    const-string v14, "USERINFO_GRADE"

    invoke-virtual {v13, v14}, Lcom/netease/ntunisdk/base/SdkBase;->getPropStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6

    .line 142
    .local v6, "grade":Ljava/lang/String;
    invoke-static {v3}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v13

    if-nez v13, :cond_1

    move v13, v11

    :goto_1
    and-int/2addr v13, v7

    invoke-static {v4}, Landroid/text/TextUtils;->isEmpty(Ljava/lang/CharSequence;)Z

    move-result v14

    if-nez v14, :cond_2

    :goto_2
    and-int/2addr v11, v13

    if-eqz v11, :cond_3

    .line 143
    new-instance v9, Lorg/json/JSONObject;

    invoke-direct {v9}, Lorg/json/JSONObject;-><init>()V

    .line 145
    .local v9, "object":Lorg/json/JSONObject;
    :try_start_0
    const-string v11, "aid"

    invoke-virtual {v9, v11, v0}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 146
    const-string v11, "nickname"

    invoke-virtual {v9, v11, v8}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 147
    const-string v11, "grade"

    invoke-virtual {v9, v11, v6}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 148
    invoke-virtual {v9}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object v1

    .line 149
    .local v1, "content":Ljava/lang/String;
    invoke-direct {p0, v4, v1}, Lcom/netease/ntunisdk/base/RetrieveUser;->encrypt(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    .line 151
    .local v2, "data":Ljava/lang/String;
    new-instance v11, Ljava/lang/StringBuilder;

    invoke-direct {v11}, Ljava/lang/StringBuilder;-><init>()V

    const-string v12, "http://fc.my.163.com:8080/"

    invoke-virtual {v11, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v11

    const-string v12, "login?device_id=%s&data=%s"

    const/4 v13, 0x2

    new-array v13, v13, [Ljava/lang/Object;

    const/4 v14, 0x0

    aput-object v3, v13, v14

    const/4 v14, 0x1

    aput-object v2, v13, v14

    invoke-static {v12, v13}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v12

    invoke-virtual {v11, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v11

    invoke-virtual {v11}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v10

    .line 152
    .local v10, "url":Ljava/lang/String;
    const-string v11, "UniSDK RetrieveUser"

    new-instance v12, Ljava/lang/StringBuilder;

    invoke-direct {v12}, Ljava/lang/StringBuilder;-><init>()V

    const-string v13, "requestRetrieveUser4Login:"

    invoke-virtual {v12, v13}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v12

    invoke-virtual {v12, v10}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v12

    invoke-virtual {v12}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v12

    invoke-static {v11, v12}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    .line 153
    new-instance v11, Lcom/netease/ntunisdk/base/RetrieveUser$3;

    invoke-direct {v11, p0}, Lcom/netease/ntunisdk/base/RetrieveUser$3;-><init>(Lcom/netease/ntunisdk/base/RetrieveUser;)V

    invoke-static {v10, v11}, Lcom/netease/ntunisdk/base/utils/NetUtil;->wget(Ljava/lang/String;Lcom/netease/ntunisdk/base/utils/WgetDoneCallback;)V
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    .line 166
    .end local v1    # "content":Ljava/lang/String;
    .end local v2    # "data":Ljava/lang/String;
    .end local v9    # "object":Lorg/json/JSONObject;
    .end local v10    # "url":Ljava/lang/String;
    :goto_3
    return-void

    .end local v0    # "aid":Ljava/lang/String;
    .end local v3    # "deviceId":Ljava/lang/String;
    .end local v4    # "deviceKey":Ljava/lang/String;
    .end local v6    # "grade":Ljava/lang/String;
    .end local v7    # "isOpen":Z
    .end local v8    # "nickname":Ljava/lang/String;
    :cond_0
    move v7, v12

    .line 135
    goto/16 :goto_0

    .restart local v0    # "aid":Ljava/lang/String;
    .restart local v3    # "deviceId":Ljava/lang/String;
    .restart local v4    # "deviceKey":Ljava/lang/String;
    .restart local v6    # "grade":Ljava/lang/String;
    .restart local v7    # "isOpen":Z
    .restart local v8    # "nickname":Ljava/lang/String;
    :cond_1
    move v13, v12

    .line 142
    goto :goto_1

    :cond_2
    move v11, v12

    goto :goto_2

    .line 159
    .restart local v9    # "object":Lorg/json/JSONObject;
    :catch_0
    move-exception v5

    .line 160
    .local v5, "e":Lorg/json/JSONException;
    const-string v11, "UniSDK RetrieveUser"

    new-instance v12, Ljava/lang/StringBuilder;

    invoke-direct {v12}, Ljava/lang/StringBuilder;-><init>()V

    const-string v13, "requestRetrieveUser4Login:"

    invoke-virtual {v12, v13}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v12

    invoke-virtual {v5}, Lorg/json/JSONException;->getMessage()Ljava/lang/String;

    move-result-object v13

    invoke-virtual {v12, v13}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v12

    invoke-virtual {v12}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v12

    invoke-static {v11, v12}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    goto :goto_3

    .line 163
    .end local v5    # "e":Lorg/json/JSONException;
    .end local v9    # "object":Lorg/json/JSONObject;
    :cond_3
    const-string v11, "UniSDK RetrieveUser"

    const-string v12, "RetrieveUser not open"

    invoke-static {v11, v12}, Lcom/netease/ntunisdk/base/UniSdkUtils;->d(Ljava/lang/String;Ljava/lang/String;)V

    goto :goto_3
.end method
