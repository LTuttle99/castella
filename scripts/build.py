#!/usr/bin/env python3
"""Validate the integrated static app and package a clean Pages artifact."""
import hashlib
import shutil
import subprocess
import tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
DIST=ROOT/'dist'
html=(ROOT/'index.html').read_text()
modules=['scenario.js','tools.js','history.js','history-dialogue.js','conversation.js','history-ui.js','chat-ui.js']
subprocess.run(['python3',str(ROOT/'scripts'/'attendance_pipeline.py'),'--check'],check=True)
for name in modules:
    assert f'scripts/{name}' in html, f'Missing script reference: {name}'
    subprocess.run(['node','--check',str(ROOT/'scripts'/name)],check=True)
inline=html.split('<script>',1)[1].split('</script>',1)[0]
with tempfile.NamedTemporaryFile('w',suffix='.js') as temp:
    temp.write(inline);temp.flush()
    subprocess.run(['node','--check',temp.name],check=True)
if DIST.exists():shutil.rmtree(DIST)
(DIST/'scripts').mkdir(parents=True)
shutil.copytree(ROOT/'data'/'processed',DIST/'data'/'processed')
data_version=hashlib.sha256((DIST/'data'/'processed'/'attendance.json').read_bytes()).hexdigest()[:16]
for name in modules:
    content=(ROOT/'scripts'/name).read_text()
    if name=='history-ui.js':
        content=content.replace("fetch('data/processed/attendance.json')",f"fetch('data/processed/attendance.json?v={data_version}')")
    (DIST/'scripts'/name).write_text(content)
    version=hashlib.sha256(content.encode()).hexdigest()[:16]
    html=html.replace(f'src="scripts/{name}"',f'src="scripts/{name}?v={version}"')
(DIST/'index.html').write_text(html)
print(f'Integrated static build created at {DIST}')
