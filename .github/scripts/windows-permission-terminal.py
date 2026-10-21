"""Drive the actual Koder approval input in an owned Windows pseudo-terminal."""
from pathlib import Path
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json,os,shutil,subprocess,threading,time
from winpty import PtyProcess
root=Path.cwd();package=Path(os.environ['KODER_PERMISSION_PACKAGE']).resolve();work=root/'permission-terminal';work.mkdir();home=work/'profile';home.mkdir();project=work/'中文 项目';project.mkdir();node=shutil.which('node');marker=project/'owned-marker.txt'
env={**os.environ,'KODER_CLI_HOME':str(home),'KODER_MEMORY_ROOT':str(home),'KODER_AUTO_UPDATE':'0','CI':'','NO_COLOR':'1','KODER_DESKTOP_ROOT':str(package.parent/'koder-desktop')}
subprocess.run([node,'--input-type=module','-e',"const f=await import(process.argv[1]);f.protectOwnedFixture(process.env.KODER_CLI_HOME);const e=await import(process.argv[2]);e.writeAcceptance(process.env)",(package/'test/windows-fixtures.mjs').as_uri(),(package/'src/eula.mjs').as_uri()],env=env,check=True,timeout=15)
requests=[]
class Handler(BaseHTTPRequestHandler):
 def log_message(self,*args):pass
 def do_POST(self):
  body=json.loads(self.rfile.read(int(self.headers['Content-Length'])));requests.append(body);last=body['messages'][-1]
  if last['role']=='tool':message={'role':'assistant','content':'OWNED_COMMAND_DONE'}
  else:message={'role':'assistant','content':'','tool_calls':[{'id':'owned-'+str(len(requests)),'type':'function','function':{'name':'shell','arguments':json.dumps({'command':'"'+node+'" -e "require(\'fs\').appendFileSync(\'owned-marker.txt\',\'x\')"'})}}]}
  data=json.dumps({'choices':[{'message':message,'finish_reason':'stop' if last['role']=='tool' else 'tool_calls'}]}).encode();self.send_response(200);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
server=ThreadingHTTPServer(('127.0.0.1',0),Handler);thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start();(home/'provider.json').write_text(json.dumps({'model':'owned-fixture','baseUrl':'http://127.0.0.1:'+str(server.server_port)+'/v1','auth':'none'}));broken=b'{"version":1,"profile":{"mode":"full"}';(home/'execution-permissions.json').write_bytes(broken)
parts=[];proc=PtyProcess.spawn([node,str(package/'bin/koder.mjs'),'chat','--no-anim','--no-memory','--lang','en','-w',str(project)],env=env,dimensions=(36,110))
def read():
 try:
  while True:
   parts.append(proc.read(65536))
 except (EOFError,OSError):pass
reader=threading.Thread(target=read,daemon=True);reader.start()
def until(predicate,name,seconds=12):
 end=time.monotonic()+seconds
 while time.monotonic()<end:
  if predicate():return
  time.sleep(.02)
 raise AssertionError(name+' timed out; '+''.join(parts)[-3500:])
try:
 until(lambda:'/help' in ''.join(parts),'chat ready');proc.write('Write the owned fixture marker.\r\n')
 until(lambda:'permission record is unreadable' in ''.join(parts),'recoverable approval prompt');proc.write('full\r\n')
 until(lambda:marker.exists() and marker.read_text()=='x','first actual command');until(lambda:'OWNED_COMMAND_DONE' in ''.join(parts),'first model continuation')
 proc.write('Append the owned fixture marker again.\r\n');until(lambda:marker.read_text()=='xx','persisted permission actual command');until(lambda:''.join(parts).count('OWNED_COMMAND_DONE')>=2,'second model continuation')
 assert ''.join(parts).count('permission record is unreadable')==1,'a persisted full grant must not ask again'
 backups=list(home.glob('execution-permissions.invalid-*.json'));assert len(backups)==1 and backups[0].read_bytes()==broken
 proc.write('/exit\r\n');until(lambda:not proc.isalive(),'cooperative chat exit');reader.join(2);assert proc.exitstatus==0,proc.exitstatus
 print(json.dumps({'passed':True,'nativeTerminal':True,'freshFullAnswerAccepted':True,'actualCommandExecutions':2,'corruptRecordPreserved':True,'repeatedApprovalPrompts':0,'exitCode':proc.exitstatus}),flush=True)
finally:
 (work/'terminal.log').write_text(''.join(parts),encoding='utf-8');print('TERMINAL_OUTPUT '+''.join(parts)[-6000:],flush=True)
 if proc.isalive():proc.terminate(force=True)
 server.shutdown();server.server_close();thread.join(2)
