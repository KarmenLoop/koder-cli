"""Reproduce an unverifiable old memory directory in a real owned Windows terminal."""
from pathlib import Path
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
import argparse,json,os,shutil,subprocess,threading,time
from winpty import PtyProcess
p=argparse.ArgumentParser();p.add_argument('--package',required=True);p.add_argument('--out',required=True);a=p.parse_args()
package=Path(a.package).resolve();work=Path(a.out).resolve();work.mkdir();home=work/'profile';home.mkdir();old=work/'old-memory';old.mkdir();project=work/'project';project.mkdir();node=shutil.which('node')
env={**os.environ,'KODER_CLI_HOME':str(home),'KODER_AUTO_UPDATE':'0','CI':'','NO_COLOR':'1'}
script="$ErrorActionPreference='Stop';$me=[Security.Principal.WindowsIdentity]::GetCurrent().User;$a=[Security.AccessControl.DirectorySecurity]::new();$a.SetOwner($me);$a.SetAccessRuleProtection($true,$false);foreach($sid in @($me.Value,'S-1-5-18','S-1-5-32-544')){$a.AddAccessRule([Security.AccessControl.FileSystemAccessRule]::new([Security.Principal.SecurityIdentifier]::new($sid),'FullControl','ContainerInherit,ObjectInherit','None','Allow'))};[IO.Directory]::SetAccessControl($env:KODER_CLI_HOME,$a)"
ps=str(Path(os.environ['SystemRoot'])/'System32/WindowsPowerShell/v1.0/powershell.exe');subprocess.run([ps,'-NoProfile','-NonInteractive','-EncodedCommand',__import__('base64').b64encode(script.encode('utf-16le')).decode()],env=env,check=True,timeout=15)
subprocess.run([node,'--input-type=module','-e','const m=await import(process.argv[1]);m.writeAcceptance(process.env)',(package/'src/eula.mjs').as_uri()],env=env,check=True,timeout=15)
(old/'history.json').write_text('OLD_HISTORY_MUST_NOT_REACH_MODEL');subprocess.run(['icacls.exe',str(old),'/grant','*S-1-1-0:(OI)(CI)RX'],check=True,capture_output=True,timeout=5)
(home/'config.json').write_text(json.dumps({'memoryLocation':{'root':str(old)},'personalizationInitialized':True,'setupDone':True}))
original=(home/'config.json').read_bytes();requests=[]
class Handler(BaseHTTPRequestHandler):
 def log_message(self,*args):pass
 def do_POST(self):
  body=json.loads(self.rfile.read(int(self.headers['Content-Length'])));requests.append(body)
  assert 'OLD_HISTORY_MUST_NOT_REACH_MODEL' not in json.dumps(body)
  text='RAM_FIRST_OK' if len(requests)==1 else 'RAM_SECOND_OK'
  if len(requests)>1:assert any('RAM_FIRST_OK' in str(m.get('content','')) for m in body['messages'])
  data=json.dumps({'choices':[{'message':{'role':'assistant','content':text},'finish_reason':'stop'}]}).encode();self.send_response(200);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
server=ThreadingHTTPServer(('127.0.0.1',0),Handler);thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start();(home/'provider.json').write_text(json.dumps({'model':'owned-fixture','baseUrl':'http://127.0.0.1:'+str(server.server_port)+'/v1','auth':'none'}))
parts=[];proc=PtyProcess.spawn([node,str(package/'bin/koder.mjs'),'chat','--no-anim','--lang','en','-w',str(project)],env=env,dimensions=(36,110))
def read():
 try:
  while True:parts.append(proc.read(65536))
 except (EOFError,OSError):pass
reader=threading.Thread(target=read,daemon=True);reader.start()
def until(predicate,label):
 end=time.monotonic()+12
 while time.monotonic()<end:
  if predicate():return
  time.sleep(.02)
 raise AssertionError(label+' timed out; '+''.join(parts)[-3000:])
try:
 until(lambda:'koder' in ''.join(parts) and '/help' in ''.join(parts),'chat ready');proc.write('Hello.\r\n');until(lambda:'RAM_FIRST_OK' in ''.join(parts),'first temporary reply');proc.write('Continue.\r\n');until(lambda:'RAM_SECOND_OK' in ''.join(parts),'second temporary reply')
 assert ''.join(parts).count('MEMORY_ACCESS_ISOLATION_UNVERIFIED')==1,'no repeated failure warning';assert len(requests)==2
 proc.write('/exit\r\n');until(lambda:not proc.isalive(),'normal exit');reader.join(2);assert proc.exitstatus==0
 assert sorted(p.name for p in old.iterdir())==['history.json'];assert (old/'history.json').read_text()=='OLD_HISTORY_MUST_NOT_REACH_MODEL';assert (home/'config.json').read_bytes()==original
 report={'passed':True,'nativeTerminal':True,'modelTurns':2,'temporaryContinuity':True,'historyUntouched':True,'noSilentLocationFork':True,'warningCount':1,'exitCode':proc.exitstatus};(work/'RESULT.json').write_text(json.dumps(report));print(json.dumps(report),flush=True)
finally:
 (work/'terminal.log').write_text(''.join(parts),encoding='utf-8');print('MEMORY_TERMINAL_OUTPUT '+''.join(parts)[-6000:],flush=True)
 if proc.isalive():proc.terminate(force=True)
 server.shutdown();server.server_close();thread.join(2)
