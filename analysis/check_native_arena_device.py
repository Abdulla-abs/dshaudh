"""Read-only arena save and screenshot snapshot on dedicated instance 1."""
import argparse
import hashlib
import io
import json
from pathlib import Path
import sqlite3
import subprocess
import tarfile

ROOT = Path(__file__).resolve().parent.parent
ADB = [r"F:\Android\Sdk\platform-tools\adb.exe", "-s", "127.0.0.1:21513"]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--label", required=True)
    args = parser.parse_args()
    if not args.label.replace("-", "").replace("_", "").isalnum():
        raise SystemExit("Use a simple snapshot label")
    out = ROOT / ".local/arena-audit" / args.label
    out.mkdir(parents=True, exist_ok=False)
    raw = subprocess.check_output(ADB + ["exec-out", "su", "-c",
        "tar -cf - -C /data/data/com.netease.h1.qihoo databases shared_prefs files"])
    (out / "save.tar").write_bytes(raw)
    with tarfile.open(fileobj=io.BytesIO(raw)) as archive:
        archive.extractall(out, filter="data")
    with sqlite3.connect(out / "databases/jsb.sqlite") as db:
        rows = dict(db.execute("select key,value from data"))
    store = json.loads(rows["dino.local.native.v1"])
    level = store["level"]
    status = json.loads(rows.get("dino.local.native.status", "{}"))
    summary = {
        "files": {str(p.relative_to(out)): hashlib.sha256(p.read_bytes()).hexdigest()
                  for name in ["databases", "shared_prefs", "files"]
                  for p in (out / name).rglob("*") if p.is_file()},
        "arena_state": level["player"].get("arena_state"),
        "arena_battle": level.get("localArenaBattle"),
        "native_probes": {key: json.loads(value) for key, value in rows.items()
                          if key.startswith("dino.local.arena.probe.")},
        "heroes": [{k: h.get(k) for k in ["sid", "typeid", "state", "aidx", "lv"]}
                   for h in level.get("heros", []) if h.get("state") == 1],
        "arena_log": [e for e in status.get("log", [])
                      if "arena" in json.dumps(e).lower()],
        "recent_log": status.get("log", [])[-8:],
    }
    (out / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2),
                                    encoding="utf-8")
    (out / "status.json").write_text(json.dumps(status, ensure_ascii=False, indent=2),
                                   encoding="utf-8")
    (out / "screen.png").write_bytes(subprocess.check_output(ADB + ["exec-out", "screencap", "-p"]))
    print(json.dumps({"arena_state": summary["arena_state"],
                      "battle": summary["arena_battle"],
                      "probes": list(summary["native_probes"]),
                      "attack_heroes": len(summary["heroes"]),
                      "arena_events": [e for e in summary["arena_log"]
                                       if e.get("step", "").startswith("arena-")][-3:]},
                     ensure_ascii=True))


if __name__ == "__main__":
    main()
