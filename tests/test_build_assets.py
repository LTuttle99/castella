"""Check actual build output so browser caches cannot mix script versions."""
import hashlib
import re
import subprocess
import unittest
from pathlib import Path
ROOT=Path(__file__).parents[1]

class BuildAssetTests(unittest.TestCase):
    def test_versioned_relative_assets_match_emitted_bytes(self):
        subprocess.run(['python3',str(ROOT/'scripts'/'build.py')],check=True,capture_output=True)
        html=(ROOT/'dist'/'index.html').read_text()
        urls=re.findall(r'<script src="([^"]+)"',html)
        self.assertEqual(len(urls),14)
        for url in urls:
            path,version=url.split('?v=')
            self.assertTrue(path.startswith('scripts/'))
            self.assertEqual(hashlib.sha256((ROOT/'dist'/path).read_bytes()).hexdigest()[:16],version)
        data_version=hashlib.sha256((ROOT/'dist'/'data'/'processed'/'attendance.json').read_bytes()).hexdigest()[:16]
        self.assertIn('data/processed/attendance.json?v='+data_version,(ROOT/'dist'/'scripts'/'history-ui.js').read_text())

        worker_version=hashlib.sha256((ROOT/'dist/scripts/browser-ai-worker.js').read_bytes()).hexdigest()[:16]
        self.assertIn('browser-ai-worker.js?v='+worker_version,(ROOT/'dist/scripts/browser-ai.js').read_text())
        self.assertTrue((ROOT/'dist/scripts/vendor/webllm-0.2.89.js').is_file())
