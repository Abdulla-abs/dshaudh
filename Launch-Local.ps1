$ErrorActionPreference = 'Stop'
$taskManager = 'D:\Program Files\Microvirt\MEmu\memuc.exe'
if (!(Test-Path -LiteralPath $taskManager)) { throw '找不到本机逍遥模拟器。请使用支持 32 位 ARM 的模拟器安装 APK。' }
& $taskManager stop -i 1
& $taskManager start -i 1
if ($LASTEXITCODE -ne 0) { throw '模拟器启动失败。' }
& $taskManager startapp -i 1 'com.netease.h1.qihoo/com.netease.h1.qihoo.AdvanceDino'
