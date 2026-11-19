#!/usr/bin/env python3
"""Validate the integrated static app and package a clean Pages artifact."""
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
shutil.copy2(ROOT/'index.html',DIST/'index.html')
for name in modules:shutil.copy2(ROOT/'scripts'/name,DIST/'scripts'/name)
shutil.copytree(ROOT/'data'/'processed',DIST/'data'/'processed')
print(f'Integrated static build created at {DIST}')
