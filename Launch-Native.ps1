$ErrorActionPreference = 'Stop'
$taskManager = 'D:\Program Files\Microvirt\MEmu\memuc.exe'
$taskAdb = 'F:\Android\Sdk\platform-tools\adb.exe'
$taskApk = Join-Path $PSScriptRoot 'dino-local-native.apk'
if (!(Test-Path -LiteralPath $taskManager)) { throw '找不到逍遥模拟器。' }
if (!(Test-Path -LiteralPath $taskApk)) { throw '找不到原流程本地适配 APK。' }
& $taskManager stop -i 1
& $taskManager -i 1 setconfigex graphics_render_mode 1
if ($LASTEXITCODE -ne 0) { throw '设置专用实例渲染模式失败。' }
& $taskManager start -i 1
if ($LASTEXITCODE -ne 0) { throw '模拟器启动失败。' }
$taskConnected = $false
for ($taskAttempt=0; $taskAttempt -lt 45; $taskAttempt++) {
    & $taskAdb connect '127.0.0.1:21513' | Out-Null
    $taskState = & $taskAdb devices
    if (($taskState -join "`n") -match '127\.0\.0\.1:21513\s+device') { $taskConnected=$true; break }
    Start-Sleep -Seconds 2
}
if (!$taskConnected) { throw '等待专用测试模拟器连接超时。' }
& $taskAdb -s '127.0.0.1:21513' shell rm -f /data/local/tmp/dino-boot.js /data/local/tmp/dino-command.js
& $taskAdb -s '127.0.0.1:21513' push $taskApk /data/local/tmp/dino-local-native.apk
if ($LASTEXITCODE -ne 0) { throw '传输 APK 失败。' }
& $taskAdb -s '127.0.0.1:21513' shell pm install -r /data/local/tmp/dino-local-native.apk
if ($LASTEXITCODE -ne 0) { throw '安装 APK 失败。' }
& $taskManager startapp -i 1 'com.netease.h1.qihoo/com.netease.h1.qihoo.AdvanceDino'
if ($LASTEXITCODE -ne 0) { throw '启动游戏失败。' }
