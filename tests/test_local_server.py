import importlib.util
from pathlib import Path
import unittest
spec=importlib.util.spec_from_file_location('serve_local',Path(__file__).resolve().parents[1]/'scripts/serve_local.py')
server=importlib.util.module_from_spec(spec);spec.loader.exec_module(server)
MODELS=[{'name':'qwen3.5:4b','details':{'format':'gguf'}},{'name':'remote:cloud','details':{'format':'gguf'},'remote_host':'cloud'}]
class LocalServerTests(unittest.TestCase):
 def test_local_model_only(self):
  self.assertTrue(server.allowed_model('qwen3.5:4b',MODELS))
  for name in ['remote:cloud','https://evil','unknown',None]:self.assertFalse(server.allowed_model(name,MODELS))
 def test_inference_bounds(self):
  base={'model':'qwen3.5:4b','messages':[{'role':'user','content':'Hello'}]}
  self.assertFalse(server.validate_chat(base,MODELS)['think'])
  for extra in [{'options':{'num_ctx':99999}},{'options':{'num_predict':99999}},{'messages':[{'role':'shell','content':'ls'}]},{'messages':[{'role':'user','content':'x'*20001}]},{'host':'https://evil'},{'model':'remote:cloud'}]:
   with self.subTest(extra=extra),self.assertRaises(ValueError):server.validate_chat({**base,**extra},MODELS)
 def test_exact_origin_and_host(self):
  handler=object.__new__(server.Handler)
  handler.server=type('Server',(),{'server_port':8765})()
  for headers,expected in [({'Host':'127.0.0.1:8765'},True),({'Host':'localhost:8765','Origin':'http://localhost:8765'},True),({'Host':'evil.example:8765'},False),({'Host':'127.0.0.1:8765','Origin':'https://evil.example'},False),({'Host':'127.0.0.1:8765','Sec-Fetch-Site':'cross-site'},False)]:
   handler.headers=headers;self.assertEqual(handler.trusted_request(),expected)
if __name__=='__main__':unittest.main()
