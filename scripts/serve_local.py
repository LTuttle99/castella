#!/usr/bin/env python3
"""Serve Castella and a strictly loopback-only Ollama adapter on one local origin."""
import argparse
import json
import mimetypes
import subprocess
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import unquote, urlsplit
from urllib.request import Request, urlopen
ROOT=Path(__file__).resolve().parents[1]
MAX_BODY=131072


def allowed_model(model,models):
    return isinstance(model,str) and not any(s in model.lower() for s in ('cloud','http','@')) and any(m.get('name')==model and m.get('details',{}).get('format')=='gguf' and not m.get('remote_host') and not m.get('remote_model') for m in models)


def validate_chat(data,models):
    if not isinstance(data,dict) or not allowed_model(data.get('model'),models):
        raise ValueError('Select an installed local GGUF model.')
    permitted={'model','messages','tools','stream','think','options','keep_alive','format'}
    if set(data)-permitted:raise ValueError('Unsupported inference fields.')
    if not isinstance(data.get('messages'),list) or len(data['messages'])>30:raise ValueError('Invalid conversation size.')
    for message in data['messages']:
        if not isinstance(message,dict) or message.get('role') not in ('system','user','assistant','tool') or not isinstance(message.get('content',''),str) or len(message.get('content',''))>20000 or set(message)-{'role','content','tool_calls','tool_name'}:
            raise ValueError('Only bounded text conversations are supported.')
    opts=data.get('options',{})
    if not isinstance(opts,dict) or set(opts)-{'num_ctx','num_predict','temperature'}:raise ValueError('Unsupported generation options.')
    if not 512<=opts.get('num_ctx',4096)<=8192 or not 1<=opts.get('num_predict',384)<=512:raise ValueError('Generation limits exceeded.')
    return {**data,'think':False,'keep_alive':'2m'}


class Server(ThreadingHTTPServer):
    daemon_threads=True
    allow_reuse_address=True


class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT/'dist'),**kwargs)
    def log_message(self,*args):pass  # Never log transcripts or prompts.
    def trusted_request(self):
        host=self.headers.get('Host','')
        if host not in (f'127.0.0.1:{self.server.server_port}',f'localhost:{self.server.server_port}'):
            return False
        origin=self.headers.get('Origin')
        return self.headers.get('Sec-Fetch-Site')!='cross-site' and (origin is None or origin in (f'http://127.0.0.1:{self.server.server_port}',f'http://localhost:{self.server.server_port}'))
    def fail(self,code,message):
        body=json.dumps({'error':message}).encode();self.send_response(code);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)
    def upstream(self,path,body=None):
        return urlopen(Request(f'http://127.0.0.1:{self.server.ollama_port}{path}',data=None if body is None else json.dumps(body).encode(),headers={'Content-Type':'application/json'}),timeout=180)
    def do_OPTIONS(self):self.fail(403,'Cross-origin proxy access is not allowed. Open the local Castella preview.')
    def do_GET(self):
        if not self.trusted_request():return self.fail(403,'This service accepts its local origin only.')
        path=urlsplit(self.path).path
        if path.startswith('/ollama/'):
            if path!='/ollama/api/tags':return self.fail(404,'Unsupported local route.')
            return self.proxy('/api/tags')
        resolved=(ROOT/'dist'/unquote(path).lstrip('/')).resolve()
        if not resolved.is_relative_to((ROOT/'dist').resolve()):return self.fail(403,'Invalid static path.')
        if path in ('/','/index.html'):
            html=(ROOT/'dist'/'index.html').read_text().replace('<head>','<head><meta name="castella-local-proxy" content="/ollama">')
            content=html.encode();self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(content)));self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(content);return
        super().do_GET()
    def do_POST(self):
        if not self.trusted_request():return self.fail(403,'This service accepts its local origin only.')
        path=urlsplit(self.path).path
        if path not in ('/ollama/api/chat','/ollama/api/show'):return self.fail(404,'Unsupported local route.')
        if self.headers.get('Content-Type','').split(';')[0]!='application/json':return self.fail(415,'Use JSON requests.')
        try:
            size=int(self.headers.get('Content-Length','0'))
            if not 0<size<=MAX_BODY:return self.fail(413,'Request size limit exceeded.')
            body=json.loads(self.rfile.read(size))
            with self.upstream('/api/tags') as response:models=json.load(response)['models']
            if path.endswith('/show'):
                if set(body)!={'model'} or not allowed_model(body.get('model'),models):raise ValueError('Choose an installed local model.')
            else:body=validate_chat(body,models)
        except (ValueError,TypeError,KeyError):return self.fail(400,'Invalid local inference request.')
        except Exception:return self.fail(503,'Ollama is unavailable. Start it locally and retry.')
        return self.proxy(path.removeprefix('/ollama'),body)
    def proxy(self,path,body=None):
        sent=False
        try:
            with self.upstream(path,body) as response:
                self.send_response(200);self.send_header('Content-Type',response.headers.get('Content-Type','application/json'));self.send_header('Cache-Control','no-store');self.send_header('Connection','close');self.end_headers();sent=True;self.close_connection=True
                if body and body.get('stream'):
                    for line in response:
                        self.wfile.write(line);self.wfile.flush()
                else:self.wfile.write(response.read())
        except (BrokenPipeError,ConnectionResetError):pass
        except Exception:
            if not sent:self.fail(503,'Local Ollama request failed. Use Standard mode or reconnect.')


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--port',type=int,default=8765);parser.add_argument('--ollama-port',type=int,default=11434);parser.add_argument('--no-build',action='store_true');args=parser.parse_args()
    if not 1024<=args.port<=65535 or not 1024<=args.ollama_port<=65535:raise SystemExit('Use an unprivileged local port.')
    if not args.no_build:subprocess.run(['python3',str(ROOT/'scripts'/'build.py')],check=True)
    server=Server(('127.0.0.1',args.port),Handler);server.ollama_port=args.ollama_port
    print(f'Castella local-only preview: http://127.0.0.1:{args.port}/',flush=True)
    try:server.serve_forever()
    except KeyboardInterrupt:server.server_close()
