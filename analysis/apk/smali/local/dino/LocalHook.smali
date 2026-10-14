.class public Llocal/dino/LocalHook;
.super Ljava/lang/Object;
.method static constructor <clinit>()V
    .locals 1
    const-string v0, "dinolocal"
    invoke-static {v0}, Ljava/lang/System;->loadLibrary(Ljava/lang/String;)V
    return-void
.end method
.method public static native run(Landroid/content/res/AssetManager;)V
.end method
