"""Preview only the packaged editor on a loopback-only local HTTP server."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ARTIFACT = ROOT / "artifacts/关卡布局编辑器.html"


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/favicon.ico":
            self.send_response(204)
            self.end_headers()
            return
        if self.path not in ("/", "/editor"):
            self.send_error(404)
            return
        content = ARTIFACT.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(content)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    output = ROOT / ".local/layout-editor"
    output.mkdir(parents=True, exist_ok=True)
    url = f"http://127.0.0.1:{server.server_address[1]}/editor"
    (output / "preview-url.txt").write_text(url, encoding="utf-8")
    print(url, flush=True)
    server.serve_forever()
