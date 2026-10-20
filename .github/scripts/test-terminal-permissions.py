"""Use an owned real terminal and fresh CLI processes to verify execution grants."""
import argparse,json,os,subprocess,threading,time,queue
from pathlib import Path
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
p=argparse.ArgumentParser();p.add_argument('--node',required=True);p.add_argument('--package',required=True);p.add_argument('--out',required=True);a=p.parse_args()
out=Path(a.out).resolve();out.mkdir(parents=True,exist_ok=False)
root=Path(a.package).resolve();workspace=out/'project';workspace.mkdir()
env={**os.environ,'KODER_CLI_HOME':str(out/'profile'),'KODER_MODEL':'terminal-fixture','KODER_API_KEY':'synthetic-only','NO_COLOR':'1','CI':''}
active={'command':'node --version'}
class Handler(BaseHTTPRequestHandler):
 def do_POST(self):
  body=json.loads(self.rfile.read(int(self.headers['Content-Length'])))
  if any(m.get('role')=='tool' for m in body['messages']):
   message={'content':'OWNED-ROUNDTRIP-DONE'};finish='stop'
  else:
   message={'content':'Owned command check','tool_calls':[{'id':'owned_command','type':'function','function':{'name':'shell','arguments':json.dumps({'command':active['command']})}}]};finish='tool_calls'
  data=json.dumps({'choices':[{'message':message,'finish_reason':finish}]}).encode()
  self.send_response(200);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start()
env['KODER_BASE_URL']='http://127.0.0.1:'+str(server.server_port)+'/v1'
subprocess.run([a.node,'--input-type=module','-e','(await import(process.argv[1])).writeAcceptance(process.env)',(root/'src/eula.mjs').as_uri()],env=env,check=True,timeout=15)
base=[a.node,str(root/'bin/koder.mjs')]
rows=[]
def run(name,args):
 r=subprocess.run(base+args,cwd=workspace,env=env,capture_output=True,text=True,encoding='utf-8',errors='replace',timeout=20)
 (out/(name+'.log')).write_text(r.stdout+r.stderr,encoding='utf-8');return r
task=['run','Execute the owned fixture action','--no-memory','--lang','en']
try:
 r=run('smart-check',task);assert r.returncode==0 and 'OWNED-ROUNDTRIP-DONE' in r.stdout and 'always remembers' not in r.stdout
 rows.append({'name':'smart command in a fresh process','passed':True})
 active['command']='node -e "require(\'fs\').appendFileSync(\'owned-marker.txt\',\'x\')"'
 command=base+task;start=time.monotonic();text='';sent=False
 if os.name=='nt':
  from winpty import PtyProcess
  child=PtyProcess.spawn(subprocess.list2cmdline(command),cwd=str(workspace),env=env,dimensions=(35,140))
  pending=queue.Queue()
  def pump():
   while True:
    try:chunk=child.read(8192)
    except (EOFError,OSError):break
    if chunk:pending.put(chunk)
  reader=threading.Thread(target=pump,daemon=True);reader.start()
  def read():
   try:return pending.get_nowait()
   except queue.Empty:return ''
  def write(s):child.write(s)
  alive=child.isalive
 else:
  import pty,select
  master,slave=pty.openpty();proc=subprocess.Popen(command,cwd=workspace,env=env,stdin=slave,stdout=slave,stderr=slave,start_new_session=True);os.close(slave)
  def read():
   if not select.select([master],[],[],.05)[0]:return ''
   try:return os.read(master,8192).decode('utf-8',errors='replace')
   except OSError:return ''
  def write(s):os.write(master,s.encode())
  alive=lambda:proc.poll() is None
 while time.monotonic()-start<20:
  text+=read()
  if 'always remembers this action' in text and not sent:write('always\r\n');sent=True
  if not alive():
   if os.name=='nt':
    reader.join(timeout=2)
    while not pending.empty():text+=read()
   break
  time.sleep(.03)
 (out/'always-terminal.log').write_text(text,encoding='utf-8')
 assert sent and not alive() and (workspace/'owned-marker.txt').read_text()=='x' and 'OWNED-ROUNDTRIP-DONE' in text,text[-2500:]
 if os.name=='nt':assert child.exitstatus==0,child.exitstatus
 if os.name!='nt':os.close(master);assert proc.wait(timeout=2)==0
 rows.append({'name':'real terminal Always allow executes once','passed':True,'seconds':round(time.monotonic()-start,3)})
 r=run('remembered-fresh-process',task);assert r.returncode==0 and (workspace/'owned-marker.txt').read_text()=='xx' and 'always remembers this action' not in r.stdout
 rows.append({'name':'saved rule runs in a fresh process without a prompt','passed':True})
 assert run('revoke',['permissions','execution','revoke','all']).returncode==0
 r=run('revoked-fresh-process',task);assert (workspace/'owned-marker.txt').read_text()=='xx'
 rows.append({'name':'revoke blocks a later unapproved sensitive action','passed':True})
 assert run('full',['permissions','execution','full','--confirm','FULL']).returncode==0
 active['command']='node -e "require(\'fs\').appendFileSync(\'owned-marker.txt\',\'F\')"'
 r=run('full-fresh-process',task);assert r.returncode==0 and (workspace/'owned-marker.txt').read_text()=='xxF'
 assert run('reset',['permissions','execution','reset']).returncode==0
 rows.append({'name':'explicit full mode runs a different sensitive command','passed':True})
finally:
 if os.name=='nt' and 'child' in globals() and child.isalive():child.terminate(force=True)
 if os.name!='nt' and 'proc' in globals() and proc.poll() is None:proc.terminate();proc.wait(timeout=5)
 server.shutdown()
 report={'passed':len(rows)==5 and all(r['passed'] for r in rows),'checks':rows,'scope':'Owned real terminal and fresh CLI processes; synthetic local model only'}
 (out/'RESULT.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))

