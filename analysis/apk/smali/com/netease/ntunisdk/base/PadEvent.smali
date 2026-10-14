.class public Lcom/netease/ntunisdk/base/PadEvent;
.super Ljava/lang/Object;
.source "PadEvent.java"


# static fields
.field public static final ACTION_CONNECTED:I = 0x1

.field public static final ACTION_CONNECTING:I = 0x2

.field public static final ACTION_DISCONNECTED:I = 0x0

.field public static final ACTION_DOWN:I = 0x0

.field public static final ACTION_PRESSURE:I = -0x1

.field public static final ACTION_UP:I = 0x1

.field public static final KEYCODE_BACK:I = 0x4

.field public static final KEYCODE_BUTTON_A:I = 0x60

.field public static final KEYCODE_BUTTON_B:I = 0x61

.field public static final KEYCODE_BUTTON_HELP:I = 0xc6

.field public static final KEYCODE_BUTTON_KEYBOARD:I = 0xc7

.field public static final KEYCODE_BUTTON_L1:I = 0x66

.field public static final KEYCODE_BUTTON_L2:I = 0x68

.field public static final KEYCODE_BUTTON_R1:I = 0x67

.field public static final KEYCODE_BUTTON_R2:I = 0x69

.field public static final KEYCODE_BUTTON_START:I = 0x6c

.field public static final KEYCODE_BUTTON_THUMBL:I = 0x6a

.field public static final KEYCODE_BUTTON_THUMBR:I = 0x6b

.field public static final KEYCODE_BUTTON_X:I = 0x63

.field public static final KEYCODE_BUTTON_Y:I = 0x64

.field public static final KEYCODE_DPAD_DOWN:I = 0x14

.field public static final KEYCODE_DPAD_LEFT:I = 0x15

.field public static final KEYCODE_DPAD_RIGHT:I = 0x16

.field public static final KEYCODE_DPAD_UP:I = 0x13

.field public static final KEYCODE_LEFT_STICK:I = 0xc8

.field public static final KEYCODE_RIGHT_STICK:I = 0xc9


# instance fields
.field private action:I

.field private deviceId:I

.field private eventTime:J

.field private keyCode:I

.field private motionKeyCode:I

.field private pressure:F

.field private state:I

.field private stateAction:I

.field private x:F

.field private y:F


# direct methods
.method public constructor <init>(JI)V
    .locals 0
    .param p1, "evnTime"    # J
    .param p3, "devId"    # I

    .prologue
    .line 50
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 51
    iput-wide p1, p0, Lcom/netease/ntunisdk/base/PadEvent;->eventTime:J

    .line 52
    iput p3, p0, Lcom/netease/ntunisdk/base/PadEvent;->deviceId:I

    .line 53
    return-void
.end method

.method public constructor <init>(JIIFF)V
    .locals 0
    .param p1, "evnTime"    # J
    .param p3, "devId"    # I
    .param p4, "motionKeyCode"    # I
    .param p5, "x"    # F
    .param p6, "y"    # F

    .prologue
    .line 79
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 80
    iput-wide p1, p0, Lcom/netease/ntunisdk/base/PadEvent;->eventTime:J

    .line 81
    iput p3, p0, Lcom/netease/ntunisdk/base/PadEvent;->deviceId:I

    .line 82
    iput p4, p0, Lcom/netease/ntunisdk/base/PadEvent;->motionKeyCode:I

    .line 83
    iput p5, p0, Lcom/netease/ntunisdk/base/PadEvent;->x:F

    .line 84
    iput p6, p0, Lcom/netease/ntunisdk/base/PadEvent;->y:F

    .line 85
    return-void
.end method

.method public constructor <init>(JIII)V
    .locals 0
    .param p1, "evnTime"    # J
    .param p3, "devId"    # I
    .param p4, "state"    # I
    .param p5, "stateAction"    # I

    .prologue
    .line 94
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 95
    iput-wide p1, p0, Lcom/netease/ntunisdk/base/PadEvent;->eventTime:J

    .line 96
    iput p3, p0, Lcom/netease/ntunisdk/base/PadEvent;->deviceId:I

    .line 97
    iput p4, p0, Lcom/netease/ntunisdk/base/PadEvent;->state:I

    .line 98
    iput p5, p0, Lcom/netease/ntunisdk/base/PadEvent;->stateAction:I

    .line 99
    return-void
.end method

.method public constructor <init>(JIIIF)V
    .locals 0
    .param p1, "evnTime"    # J
    .param p3, "devId"    # I
    .param p4, "keyCode"    # I
    .param p5, "action"    # I
    .param p6, "pressure"    # F

    .prologue
    .line 63
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 64
    iput-wide p1, p0, Lcom/netease/ntunisdk/base/PadEvent;->eventTime:J

    .line 65
    iput p3, p0, Lcom/netease/ntunisdk/base/PadEvent;->deviceId:I

    .line 66
    iput p4, p0, Lcom/netease/ntunisdk/base/PadEvent;->keyCode:I

    .line 67
    iput p5, p0, Lcom/netease/ntunisdk/base/PadEvent;->action:I

    .line 68
    iput p6, p0, Lcom/netease/ntunisdk/base/PadEvent;->pressure:F

    .line 69
    return-void
.end method
