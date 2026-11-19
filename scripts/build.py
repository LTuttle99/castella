#!/usr/bin/env python3
"""Validate the inline JavaScript and create a static production directory."""
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "index.html"
DIST = ROOT / "dist"
html = SOURCE.read_text(encoding="utf-8")
if "<script>" not in html or "</script>" not in html:
    raise SystemExit("Could not find the inline application script")
javascript = html.split("<script>", 1)[1].split("</script>", 1)[0]
with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8") as temp:
    temp.write(javascript)
    temp.flush()
    subprocess.run(["node", "--check", temp.name], check=True)
subprocess.run(["node", "--check", str(ROOT / "scripts" / "scenario.js")], check=True)
if DIST.exists():
    shutil.rmtree(DIST)
DIST.mkdir(exist_ok=True)
shutil.copy2(SOURCE, DIST / "index.html")
scripts = DIST / "scripts"
scripts.mkdir(exist_ok=True)
shutil.copy2(ROOT / "scripts" / "scenario.js", scripts / "scenario.js")
print(f"Static production build created at {DIST}")

for name in ["tools.js", "conversation.js", "chat-ui.js"]:
    subprocess.run(["node", "--check", str(ROOT / "scripts" / name)], check=True)
    shutil.copy2(ROOT / "scripts" / name, scripts / name)
