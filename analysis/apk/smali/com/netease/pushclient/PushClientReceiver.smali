.class public Lcom/netease/pushclient/PushClientReceiver;
.super Landroid/content/BroadcastReceiver;
.source "PushClientReceiver.java"


# static fields
.field public static final TAG:Ljava/lang/String;


# direct methods
.method static constructor <clinit>()V
    .locals 2

    .prologue
    .line 35
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "NGPush_"

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-class v1, Lcom/netease/pushclient/PushClientReceiver;

    invoke-virtual {v1}, Ljava/lang/Class;->getSimpleName()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    sput-object v0, Lcom/netease/pushclient/PushClientReceiver;->TAG:Ljava/lang/String;

    return-void
.end method

.method public constructor <init>()V
    .locals 0

    .prologue
    .line 34
    invoke-direct {p0}, Landroid/content/BroadcastReceiver;-><init>()V

    return-void
.end method


# virtual methods
.method public onGetNewDevId(Landroid/content/Context;Ljava/lang/String;)V
    .locals 0
    .param p1, "context"    # Landroid/content/Context;
    .param p2, "regId"    # Ljava/lang/String;

    .prologue
    .line 96
    return-void
.end method

.method public onReceive(Landroid/content/Context;Landroid/content/Intent;)V
    .locals 20
    .param p1, "context"    # Landroid/content/Context;
    .param p2, "intent"    # Landroid/content/Intent;

    .prologue
    .line 45
    sget-object v17, Lcom/netease/pushclient/PushClientReceiver;->TAG:Ljava/lang/String;

    const-string v18, "onReceive"

    invoke-static/range {v17 .. v18}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 46
    sget-object v17, Lcom/netease/pushclient/PushClientReceiver;->TAG:Ljava/lang/String;

    new-instance v18, Ljava/lang/StringBuilder;

    const-string v19, "intent:"

    invoke-direct/range {v18 .. v19}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    move-object/from16 v0, v18

    move-object/from16 v1, p2

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v18

    invoke-virtual/range {v18 .. v18}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v18

    invoke-static/range {v17 .. v18}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 47
    invoke-virtual/range {p2 .. p2}, Landroid/content/Intent;->getAction()Ljava/lang/String;

    move-result-object v4

    .line 48
    .local v4, "action":Ljava/lang/String;
    sget-object v17, Lcom/netease/pushclient/PushClientReceiver;->TAG:Ljava/lang/String;

    new-instance v18, Ljava/lang/StringBuilder;

    const-string v19, "action:"

    invoke-direct/range {v18 .. v19}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    move-object/from16 v0, v18

    invoke-virtual {v0, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v18

    invoke-virtual/range {v18 .. v18}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v18

    invoke-static/range {v17 .. v18}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 49
    const-string v17, "com.netease.push.action.client.MESSAGE"

    move-object/from16 v0, v17

    invoke-virtual {v0, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v17

    if-eqz v17, :cond_1

    .line 50
    const-string v17, "message"

    move-object/from16 v0, p2

    move-object/from16 v1, v17

    invoke-virtual {v0, v1}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v16

    .line 51
    .local v16, "sMessage":Ljava/lang/String;
    sget-object v17, Lcom/netease/pushclient/PushClientReceiver;->TAG:Ljava/lang/String;

    new-instance v18, Ljava/lang/StringBuilder;

    const-string v19, "sMessage:"

    invoke-direct/range {v18 .. v19}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    move-object/from16 v0, v18

    move-object/from16 v1, v16

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v18

    invoke-virtual/range {v18 .. v18}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v18

    invoke-static/range {v17 .. v18}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 54
    :try_start_0
    invoke-static/range {v16 .. v16}, Lcom/netease/push/utils/NotifyMessage;->readFromJsonString(Ljava/lang/String;)Lcom/netease/push/utils/NotifyMessage;

    move-result-object v13

    .line 55
    .local v13, "notifyMessage":Lcom/netease/push/utils/NotifyMessage;
    move-object/from16 v0, p0

    move-object/from16 v1, p1

    invoke-virtual {v0, v1, v13}, Lcom/netease/pushclient/PushClientReceiver;->onReceiveNotifyMessage(Landroid/content/Context;Lcom/netease/push/utils/NotifyMessage;)V

    .line 56
    const-string v17, "lasttime"

    const-wide/16 v18, 0x0

    move-object/from16 v0, p2

    move-object/from16 v1, v17

    move-wide/from16 v2, v18

    invoke-virtual {v0, v1, v2, v3}, Landroid/content/Intent;->getLongExtra(Ljava/lang/String;J)J

    move-result-wide v9

    .line 57
    .local v9, "lastTime":J
    invoke-static/range {p1 .. p1}, Lcom/netease/push/utils/PushSetting;->getReceiveTime(Landroid/content/Context;)J

    move-result-wide v7

    .line 58
    .local v7, "lastReceiveTime":J
    cmp-long v17, v7, v9

    if-gez v17, :cond_0

    .line 59
    move-object/from16 v0, p1

    invoke-static {v0, v9, v10}, Lcom/netease/push/utils/PushSetting;->setReceiveTime(Landroid/content/Context;J)V
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    .line 92
    .end local v7    # "lastReceiveTime":J
    .end local v9    # "lastTime":J
    .end local v13    # "notifyMessage":Lcom/netease/push/utils/NotifyMessage;
    .end local v16    # "sMessage":Ljava/lang/String;
    :cond_0
    :goto_0
    return-void

    .line 61
    .restart local v16    # "sMessage":Ljava/lang/String;
    :catch_0
    move-exception v6

    .line 62
    .local v6, "e":Lorg/json/JSONException;
    sget-object v17, Lcom/netease/pushclient/PushClientReceiver;->TAG:Ljava/lang/String;

    new-instance v18, Ljava/lang/StringBuilder;

    const-string v19, "JSONException, error:"

    invoke-direct/range {v18 .. v19}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v6}, Lorg/json/JSONException;->toString()Ljava/lang/String;

    move-result-object v19

    invoke-virtual/range {v18 .. v19}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v18

    invoke-virtual/range {v18 .. v18}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v18

    invoke-static/range {v17 .. v18}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 63
    invoke-virtual {v6}, Lorg/json/JSONException;->printStackTrace()V

    goto :goto_0

    .line 66
    .end local v6    # "e":Lorg/json/JSONException;
    .end local v16    # "sMessage":Ljava/lang/String;
    :cond_1
    const-string v17, "com.netease.push.action.client.NEWID"

    move-object/from16 v0, v17

    invoke-virtual {v0, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v17

    if-eqz v17, :cond_2

    .line 67
    invoke-static/range {p1 .. p1}, Lcom/netease/pushclient/PushManager;->getDevId(Landroid/content/Context;)Ljava/lang/String;

    move-result-object v5

    .line 68
    .local v5, "devID":Ljava/lang/String;
    sget-object v17, Lcom/netease/pushclient/PushClientReceiver;->TAG:Ljava/lang/String;

    new-instance v18, Ljava/lang/StringBuilder;

    const-string v19, "devID:"

    invoke-direct/range {v18 .. v19}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    move-object/from16 v0, v18

    invoke-virtual {v0, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v18

    invoke-virtual/range {v18 .. v18}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v18

    invoke-static/range {v17 .. v18}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 69
    move-object/from16 v0, p0

    move-object/from16 v1, p1

    invoke-virtual {v0, v1, v5}, Lcom/netease/pushclient/PushClientReceiver;->onGetNewDevId(Landroid/content/Context;Ljava/lang/String;)V

    .line 70
    const/16 v17, 0x0

    move-object/from16 v0, p1

    move/from16 v1, v17

    invoke-static {v0, v1}, Lcom/netease/push/utils/PushSetting;->setFirstStart(Landroid/content/Context;Z)V

    goto :goto_0

    .line 71
    .end local v5    # "devID":Ljava/lang/String;
    :cond_2
    const-string v17, "com.netease.push.action.client.METHOD"

    move-object/from16 v0, v17

    invoke-virtual {v0, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v17

    if-eqz v17, :cond_0

    .line 73
    const-string v17, "method"

    move-object/from16 v0, p2

    move-object/from16 v1, v17

    invoke-virtual {v0, v1}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v11

    .line 74
    .local v11, "method":Ljava/lang/String;
    sget-object v17, Lcom/netease/pushclient/PushClientReceiver;->TAG:Ljava/lang/String;

    new-instance v18, Ljava/lang/StringBuilder;

    const-string v19, "method:"

    invoke-direct/range {v18 .. v19}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    move-object/from16 v0, v18

    invoke-virtual {v0, v11}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v18

    invoke-virtual/range {v18 .. v18}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v18

    invoke-static/range {v17 .. v18}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 75
    const-string v17, "nativenotify"

    move-object/from16 v0, v17

    invoke-virtual {v0, v11}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v17

    if-eqz v17, :cond_0

    .line 76
    const-string v17, "pushname"

    move-object/from16 v0, p2

    move-object/from16 v1, v17

    invoke-virtual {v0, v1}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v14

    .line 77
    .local v14, "pushName":Ljava/lang/String;
    sget-object v17, Lcom/netease/pushclient/PushClientReceiver;->TAG:Ljava/lang/String;

    new-instance v18, Ljava/lang/StringBuilder;

    const-string v19, "native push id:"

    invoke-direct/range {v18 .. v19}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    move-object/from16 v0, v18

    invoke-virtual {v0, v14}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v18

    invoke-virtual/range {v18 .. v18}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v18

    invoke-static/range {v17 .. v18}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 78
    move-object/from16 v0, p1

    invoke-static {v0, v14}, Lcom/netease/push/utils/PushSetting;->getNativeNotification(Landroid/content/Context;Ljava/lang/String;)Lcom/netease/inner/pushclient/NativePushData;

    move-result-object v12

    .line 79
    .local v12, "nativePushData":Lcom/netease/inner/pushclient/NativePushData;
    if-eqz v12, :cond_0

    .line 80
    invoke-virtual {v12}, Lcom/netease/inner/pushclient/NativePushData;->getNotifyMessage()Lcom/netease/push/utils/NotifyMessage;

    move-result-object v13

    .line 81
    .restart local v13    # "notifyMessage":Lcom/netease/push/utils/NotifyMessage;
    move-object/from16 v0, p0

    move-object/from16 v1, p1

    invoke-virtual {v0, v1, v13}, Lcom/netease/pushclient/PushClientReceiver;->onReceiveNotifyMessage(Landroid/content/Context;Lcom/netease/push/utils/NotifyMessage;)V

    .line 82
    invoke-virtual {v12}, Lcom/netease/inner/pushclient/NativePushData;->getRepeatMode()I

    move-result v15

    .line 83
    .local v15, "repeatMode":I
    sget-object v17, Lcom/netease/pushclient/PushClientReceiver;->TAG:Ljava/lang/String;

    new-instance v18, Ljava/lang/StringBuilder;

    const-string v19, "native push repeat mode:"

    invoke-direct/range {v18 .. v19}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    move-object/from16 v0, v18

    invoke-virtual {v0, v15}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v18

    invoke-virtual/range {v18 .. v18}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v18

    invoke-static/range {v17 .. v18}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 84
    if-eqz v15, :cond_3

    .line 85
    move-object/from16 v0, p1

    invoke-virtual {v12, v0}, Lcom/netease/inner/pushclient/NativePushData;->startAlarm(Landroid/content/Context;)V

    goto/16 :goto_0

    .line 87
    :cond_3
    invoke-virtual {v12}, Lcom/netease/inner/pushclient/NativePushData;->getPushName()Ljava/lang/String;

    move-result-object v17

    move-object/from16 v0, p1

    move-object/from16 v1, v17

    invoke-static {v0, v1}, Lcom/netease/push/utils/PushSetting;->rmNativePushNames(Landroid/content/Context;Ljava/lang/String;)V

    goto/16 :goto_0
.end method

.method public onReceiveNotifyMessage(Landroid/content/Context;Lcom/netease/push/utils/NotifyMessage;)V
    .locals 4
    .param p1, "context"    # Landroid/content/Context;
    .param p2, "notifyMessage"    # Lcom/netease/push/utils/NotifyMessage;

    .prologue
    .line 99
    sget-object v1, Lcom/netease/pushclient/PushClientReceiver;->TAG:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "onReceiveNotifyMessage:"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 100
    iget-object v1, p2, Lcom/netease/push/utils/NotifyMessage;->mTitle:Ljava/lang/String;

    invoke-virtual {v1}, Ljava/lang/String;->length()I

    move-result v1

    if-nez v1, :cond_0

    iget-object v1, p2, Lcom/netease/push/utils/NotifyMessage;->mMsg:Ljava/lang/String;

    invoke-virtual {v1}, Ljava/lang/String;->length()I

    move-result v1

    if-nez v1, :cond_0

    .line 101
    sget-object v1, Lcom/netease/pushclient/PushClientReceiver;->TAG:Ljava/lang/String;

    const-string v2, "abandon msg"

    invoke-static {v1, v2}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;)I

    .line 109
    :goto_0
    return-void

    .line 104
    :cond_0
    invoke-static {p1}, Lcom/netease/push/utils/PushSetting;->getAppInfo(Landroid/content/Context;)Lcom/netease/push/utils/AppInfo;

    move-result-object v0

    .line 105
    .local v0, "appInfo":Lcom/netease/push/utils/AppInfo;
    if-nez v0, :cond_1

    .line 106
    new-instance v0, Lcom/netease/push/utils/AppInfo;

    .end local v0    # "appInfo":Lcom/netease/push/utils/AppInfo;
    invoke-virtual {p1}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    move-result-object v1

    invoke-direct {v0, v1}, Lcom/netease/push/utils/AppInfo;-><init>(Ljava/lang/String;)V

    .line 108
    .restart local v0    # "appInfo":Lcom/netease/push/utils/AppInfo;
    :cond_1
    new-instance v1, Lcom/netease/push/utils/Notifier;

    invoke-direct {v1, p1}, Lcom/netease/push/utils/Notifier;-><init>(Landroid/content/Context;)V

    invoke-virtual {v1, p2, v0}, Lcom/netease/push/utils/Notifier;->notify(Lcom/netease/push/utils/NotifyMessage;Lcom/netease/push/utils/AppInfo;)V

    goto :goto_0
.end method
