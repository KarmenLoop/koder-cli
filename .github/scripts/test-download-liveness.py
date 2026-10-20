"""Exercise owned stalled endpoints with a long total transfer budget."""
from pathlib import Path
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
import argparse,json,os,subprocess,threading,time
p=argparse.ArgumentParser();p.add_argument('--assets',required=True);p.add_argument('--out',required=True);a=p.parse_args()
assets=Path(a.assets).resolve();out=Path(a.out).resolve();out.mkdir(parents=True,exist_ok=True)
stop=threading.Event();state={'mode':'bootstrap'};requests=[]
class Handler(BaseHTTPRequestHandler):
 def do_GET(self):
  requests.append(self.path)
  if state['mode']=='bootstrap' or state['mode']=='manifest' and self.path.endswith('.json'):
   stop.wait(15);return
  if state['mode']=='package' and self.path.endswith('.tgz'):
   self.send_response(200);self.send_header('Content-Length','99999999');self.end_headers();self.wfile.write(b'x'*1024);self.wfile.flush();stop.wait(15);return
  f=assets/self.path.lstrip('/')
  if not f.is_file():self.send_error(404);return
  b=f.read_bytes();self.send_response(200);self.send_header('Content-Length',str(len(b)));self.end_headers();self.wfile.write(b)
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start();base='http://127.0.0.1:'+str(server.server_port)
ps=str(Path(os.environ['SystemRoot'])/'System32/WindowsPowerShell/v1.0/powershell.exe');rows=[]
try:
 for mode in ['bootstrap','manifest','package']:
  state['mode']=mode;home=out/mode;home.mkdir();temp=home/'temp';temp.mkdir()
  env={**os.environ,'KODER_INSTALL_BASE':base,'KODER_INSTALL_HOME':str(home/'install'),'KODER_CLI_HOME':str(home/'profile'),'KODER_EULA_ACCEPT':'1','KODER_NO_ONBOARD':'1','KODER_DOWNLOAD_TIMEOUT_SECONDS':'100000000','KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS':'1','KODER_DOWNLOAD_IDLE_TIMEOUT_SECONDS':'1','TEMP':str(temp),'TMP':str(temp)}
  if mode=='bootstrap':
   command=Path(__file__).with_name('windows-install-command.txt').read_text().strip();body=command.split('-Command "',1)[1][:-1].replace('https://karmenloop.com/install/koder-cli.ps1',base+'/koder-cli.ps1');argv=[ps,'-NoProfile','-ExecutionPolicy','Bypass','-Command',body]
  else:argv=[ps,'-NoProfile','-ExecutionPolicy','Bypass','-File',str(assets/'koder-cli.ps1')]
  started=time.monotonic();timed_out=False
  try:r=subprocess.run(argv,env=env,capture_output=True,text=True,encoding='utf-8',errors='replace',timeout=7);text=r.stdout+r.stderr;code=r.returncode
  except subprocess.TimeoutExpired as error:timed_out=True;text=str(error.stdout)+str(error.stderr);code=None
  elapsed=time.monotonic()-started;(home/'terminal.log').write_text(text,encoding='utf-8')
  passed=not timed_out and code!=0 and elapsed<7 and not (home/'install/bin/koder.cmd').exists()
  rows.append({'name':mode+' no-progress limit with long total budget','passed':passed,'elapsedSeconds':round(elapsed,3),'processTimedOut':timed_out,'exitCode':code,'noActivation':not (home/'install/bin/koder.cmd').exists()})
finally:stop.set();server.shutdown()
result={'passed':len(rows)==3 and all(r['passed'] for r in rows),'checks':rows,'scope':'Real Windows PowerShell, owned bootstrap/header/body stalls, total budget 100000000s with explicit one-second no-progress limits','requests':requests};(out/'LIVENESS-RESULT.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result));raise SystemExit(0 if result['passed'] else 1)
