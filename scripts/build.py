#!/usr/bin/env python3
"""Validate the integrated static app and package a clean Pages artifact."""
import html as html_module
import hashlib
import shutil
import subprocess
import tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
DIST=ROOT/'dist'
html=(ROOT/'index.html').read_text()
modules=['profiles.js','scenario.js','tools.js','history.js','history-dialogue.js','operations-research.js','operations-dialogue.js','conversation.js','history-ui.js','local-ai-tools.js','local-ai.js','browser-ai.js','operations-ui.js','chat-ui.js']
subprocess.run(['python3',str(ROOT/'scripts'/'attendance_pipeline.py'),'--check'],check=True)
subprocess.run(['python3',str(ROOT/'scripts'/'operations_pipeline.py'),'--check'],check=True)
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
shutil.copytree(ROOT/'data'/'operations',DIST/'data'/'operations')
data_version=hashlib.sha256((DIST/'data'/'processed'/'attendance.json').read_bytes()).hexdigest()[:16]
for name in modules:
    content=(ROOT/'scripts'/name).read_text()
    if name=='history-ui.js':
        content=content.replace("fetch('data/processed/attendance.json')",f"fetch('data/processed/attendance.json?v={data_version}')")
    if name=='operations-ui.js':
        ops_version=hashlib.sha256((DIST/'data'/'operations'/'benchmarks.json').read_bytes()).hexdigest()[:16]
        content=content.replace("fetch('data/operations/benchmarks.json')",f"fetch('data/operations/benchmarks.json?v={ops_version}')")
    if name=='browser-ai.js':
        worker_version=hashlib.sha256((ROOT/'scripts'/'browser-ai-worker.js').read_bytes()).hexdigest()[:16]
        content=content.replace('browser-ai-worker.js?v=browser-v1',f'browser-ai-worker.js?v={worker_version}')
    (DIST/'scripts'/name).write_text(content)
    version=hashlib.sha256(content.encode()).hexdigest()[:16]
    html=html.replace(f'src="scripts/{name}"',f'src="scripts/{name}?v={version}"')
(DIST/'index.html').write_text(html)
print(f'Integrated static build created at {DIST}')

setup=(ROOT/'LOCAL_AI_SETUP.md').read_text()
(DIST/'LOCAL_AI_SETUP.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Castella Local AI setup</title><body style="font:16px system-ui;line-height:1.6;max-width:850px;margin:auto;padding:24px"><a href="./">Return to Castella</a><pre style="white-space:pre-wrap;overflow-wrap:anywhere;font:inherit">'+html_module.escape(setup)+'</pre></body></html>')

shutil.copytree(ROOT/'scripts'/'vendor',DIST/'scripts'/'vendor')
shutil.copyfile(ROOT/'scripts'/'browser-ai-worker.js',DIST/'scripts'/'browser-ai-worker.js')
