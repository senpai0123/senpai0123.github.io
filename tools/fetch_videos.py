"""Actualiza data/videos.json con los videos más recientes de cada lista de YouTube.
Usa los feeds públicos de YouTube (no necesita clave). Lo ejecuta GitHub Actions dos veces al día."""
import json, re, sys, urllib.request, xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_JS = (ROOT / "js" / "data.js").read_text(encoding="utf-8")
PLAYLISTS = re.findall(r'key:\s*"([^"]+)",\s*type:\s*"[^"]+",\s*id:\s*"([^"]+)"', DATA_JS.split("VDF_PLAYLISTS", 1)[1])
NS = {"a": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015"}

out_path = ROOT / "data" / "videos.json"
try:
    old = json.loads(out_path.read_text(encoding="utf-8"))
except Exception:
    old = {"playlists": {}}

result = {"updated": datetime.now(timezone.utc).isoformat(timespec="seconds"), "playlists": {}}
for key, pid in PLAYLISTS:
    url = f"https://www.youtube.com/feeds/videos.xml?playlist_id={pid}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "VidaDeFe-website/1.0"})
        root = ET.fromstring(urllib.request.urlopen(req, timeout=30).read())
        items = []
        for e in root.findall("a:entry", NS):
            items.append({
                "id": e.find("yt:videoId", NS).text,
                "title": e.find("a:title", NS).text,
                "published": e.find("a:published", NS).text,
            })
        items.sort(key=lambda x: x["published"], reverse=True)
        result["playlists"][key] = items
        print(f"{key}: {len(items)} videos")
    except Exception as ex:  # si falla una lista, se conserva lo anterior
        print(f"{key}: error {ex}", file=sys.stderr)
        result["playlists"][key] = old.get("playlists", {}).get(key, [])

if result["playlists"] != old.get("playlists"):
    out_path.write_text(json.dumps(result, ensure_ascii=False, indent=1), encoding="utf-8")
    print("videos.json actualizado")
else:
    print("sin cambios")
