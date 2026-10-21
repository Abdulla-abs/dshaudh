"""Package the offline layout editor as a double-clickable HTML file."""
from pathlib import Path
import base64
import json

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "analysis/layout-editor"


def build() -> Path:
    catalog = json.loads((SOURCE / "catalog.json").read_text(encoding="utf-8"))
    reference = ROOT / "inputs/pve-stage7/reference.png"
    data_url = "data:image/png;base64," + base64.b64encode(reference.read_bytes()).decode("ascii")
    html = (SOURCE / "index.html").read_text(encoding="utf-8")
    html = html.replace('<link rel="stylesheet" href="editor.css">',
                        "<style>\n" + (SOURCE / "editor.css").read_text(encoding="utf-8") + "\n" +
                        (SOURCE / "wall-settings.css").read_text(encoding="utf-8") + "\n</style>")
    settings = "window.LAYOUT_CATALOG=" + json.dumps(catalog, ensure_ascii=False) + ";\n"
    map_config = json.loads((ROOT / 'analysis/rpc-contracts/layout-map.json').read_text(encoding='utf-8'))
    settings += "window.LAYOUT_MAP=" + json.dumps(map_config) + ";\n"
    player_rules = json.loads((SOURCE / 'player-rules.json').read_text(encoding='utf-8'))
    settings += "window.LAYOUT_PLAYER_RULES=" + json.dumps(player_rules, ensure_ascii=False) + ";\n"
    settings += "window.LAYOUT_REFERENCE=" + json.dumps(data_url) + ";"
    # Escape HTML end tags even if future data contains literal markup.
    html = html.replace('<script src="catalog.js"></script>',
                        "<script>" + settings.replace("</", "<\\/") + "</script>")
    for name in ("core", "editor"):
        code = (SOURCE / f"{name}.js").read_text(encoding="utf-8").replace("</script", "<\\/script")
        html = html.replace(f'<script src="{name}.js"></script>', "<script>\n" + code + "\n</script>")
    output = ROOT / "artifacts/关卡布局编辑器.html"
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(html, encoding="utf-8")
    print(f"Built {output} ({output.stat().st_size:,} bytes)")
    return output


if __name__ == "__main__":
    build()
