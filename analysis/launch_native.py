import subprocess
import time
from pathlib import Path

MEMUC = Path(r"D:\Program Files\Microvirt\MEmu\memuc.exe")
ADB = Path(r"F:\Android\Sdk\platform-tools\adb.exe")
APK = Path(__file__).resolve().parent.parent / "dino-local-native.apk"
TARGET = "127.0.0.1:21513"

def run(cmd, check=True):
    print("Running:", cmd)
    return subprocess.run(cmd, check=check, capture_output=True, text=True)

def main():
    if not MEMUC.exists():
        raise SystemExit(f"Missing {MEMUC}")
    if not APK.exists():
        raise SystemExit(f"Missing {APK}")

    print("Stopping MEmu instance 1...")
    subprocess.run([str(MEMUC), "stop", "-i", "1"], capture_output=True)
    time.sleep(1)

    print("Configuring DirectX render mode for instance 1...")
    subprocess.run([str(MEMUC), "-i", "1", "setconfigex", "graphics_render_mode", "1"], check=True)

    print("Starting MEmu instance 1...")
    subprocess.run([str(MEMUC), "start", "-i", "1"], check=True)

    print("Waiting for ADB connection on", TARGET)
    connected = False
    for attempt in range(45):
        subprocess.run([str(ADB), "connect", TARGET], capture_output=True)
        res = subprocess.run([str(ADB), "devices"], capture_output=True, text=True)
        if f"{TARGET}\tdevice" in res.stdout:
            connected = True
            break
        time.sleep(2)

    if not connected:
        raise SystemExit("Timeout waiting for emulator connection.")

    print("Emulator connected! Cleaning temp files...")
    subprocess.run([str(ADB), "-s", TARGET, "shell", "rm -f /data/local/tmp/dino-boot.js /data/local/tmp/dino-command.js"], capture_output=True)

    print("Pushing APK...")
    subprocess.run([str(ADB), "-s", TARGET, "push", str(APK), "/data/local/tmp/dino-local-native.apk"], check=True)

    print("Installing APK...")
    subprocess.run([str(ADB), "-s", TARGET, "shell", "pm install -r /data/local/tmp/dino-local-native.apk"], check=True)

    print("Starting app...")
    subprocess.run([str(MEMUC), "startapp", "-i", "1", "com.netease.h1.qihoo/com.netease.h1.qihoo.AdvanceDino"], check=True)
    print("Game launched successfully!")

if __name__ == "__main__":
    main()
