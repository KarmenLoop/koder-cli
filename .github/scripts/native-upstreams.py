"""Public-package acceptance only. No private source or model credentials."""
import argparse,asyncio,base64,hashlib,json,os,platform,re,subprocess,tarfile,threading,time,urllib.request,uuid
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from mcp import ClientSession,StdioServerParameters
from mcp.client.stdio import stdio_client
p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);r=p.parse_args().root;e=r/'evidence';e.mkdir(exist_ok=True);home=r/'home';home.mkdir(exist_ok=True);project=r/'project';project.mkdir(exist_ok=True);exe=r/'runtime/Scripts/windows-mcp.exe';nonce='KODER_NATIVE_'+uuid.uuid4().hex;artifact=project/'actual-tool.txt';calls=[];report={'platform':platform.platform(),'upstream':'windows-mcp==0.8.8','realDesktop':'GitHub-hosted disposable Windows runner; not a user PC','modelRequests':0,'calls':calls,'passed':False}
env={**os.environ,'HOME':str(home),'USERPROFILE':str(home),'KODER_CLI_HOME':str(home/'.koder-cli'),'KODER_DATA':str(home/'koder-data'),'KODER_EULA_ACCEPT':'1','KODER_AUTO_UPDATE':'0','KODER_REMOTE_RESOURCES':'0','NO_COLOR':'1','ANONYMIZED_TELEMETRY':'false','PYTHONUTF8':'1','PYTHONIOENCODING':'utf-8'}
async def check():
 with (e/'upstream.stderr').open('w',encoding='utf-8') as log:
  async with stdio_client(StdioServerParameters(command=str(exe),args=['serve'],env=env,cwd=str(project)),errlog=log) as (read,write):
   async with ClientSession(read,write) as client:
    init=await asyncio.wait_for(client.initialize(),30);tools=await asyncio.wait_for(client.list_tools(),10);(e/'discovery.json').write_text(json.dumps({'server':init.model_dump(mode='json'),'tools':[x.model_dump(mode='json') for x in tools.tools]},indent=2),encoding='utf-8');names={x.name for x in tools.tools};assert {'PowerShell','Snapshot','Click','Type'}<=names
    async def call(name,args):
     result=await asyncio.wait_for(client.call_tool(name,args),30);data=result.model_dump(mode='json');calls.append({'name':name,'arguments':args,'result':data});assert ('is_error' in data or 'isError' in data),data;assert not data.get('is_error',data.get('isError')),(name,data);return json.dumps(data)
    path=str(artifact).replace("'","''");cmd="[IO.File]::WriteAllText('"+path+"','"+nonce+"',[Text.UTF8Encoding]::new($false)); [IO.File]::ReadAllText('"+path+"')"
    result=await call('PowerShell',{'command':cmd,'timeout':10});assert nonce in result;assert artifact.read_text(encoding='utf-8')==nonce;report['actualFileReadback']=True
    coords=project/'ui-coordinates.json';saved=project/'ui-observed.txt';title='KoderOwned_'+nonce
    literal=lambda p:str(p).replace("'","''")
    source="""Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
$form=New-Object Windows.Forms.Form
$form.Text='TITLE'; $form.Width=500; $form.Height=220; $form.TopMost=$true
$form.StartPosition='Manual'; $form.Location=New-Object Drawing.Point(40,40)
$box=New-Object Windows.Forms.TextBox
$box.AccessibleName='KoderOwnedInput'; $box.Width=400; $box.Location=New-Object Drawing.Point(30,60)
$form.Controls.Add($box)
$box.add_TextChanged({[IO.File]::WriteAllText('SAVED',$box.Text,[Text.UTF8Encoding]::new($false))})
$form.add_Shown({$form.Activate();$box.Focus();$pt=$box.PointToScreen([Drawing.Point]::new(20,10));@{x=$pt.X;y=$pt.Y;pid=$PID}|ConvertTo-Json|Set-Content -Encoding UTF8 'COORDS'})
[Windows.Forms.Application]::Run($form)
""".replace('TITLE',title).replace('SAVED',literal(saved)).replace('COORDS',literal(coords))
    (e/'owned-ui.ps1').write_text(source,encoding='utf-8-sig')
    ui=subprocess.Popen(['powershell','-NoProfile','-STA','-WindowStyle','Hidden','-EncodedCommand',base64.b64encode(source.encode('utf-16-le')).decode()],stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
    try:
     end=time.monotonic()+8
     while not coords.exists():
      assert ui.poll() is None,'Owned UI exited before readiness';assert time.monotonic()<end,'Owned UI readiness deadline';await asyncio.sleep(.1)
     point=json.loads(coords.read_text(encoding='utf-8-sig'));assert point['pid']==ui.pid
     snapshot=await call('Snapshot',{'use_vision':False,'use_ui_tree':True});assert 'Error capturing desktop state' not in snapshot;assert title in snapshot;report['snapshotReturned']=True
     await call('Click',{'loc':[point['x'],point['y']]})
     await call('Type',{'text':nonce,'loc':[point['x'],point['y']],'clear':True})
     end=time.monotonic()+3
     while not saved.exists() or saved.read_text(encoding='utf-8')!=nonce:
      assert time.monotonic()<end,'Native UI text did not reach the owned control';await asyncio.sleep(.1)
     report['actualClickTypeReadback']=True
    finally:
     subprocess.run(['powershell','-NoProfile','-Command','[Diagnostics.Process]::GetProcessById('+str(ui.pid)+').CloseMainWindow()'],capture_output=True,timeout=5)
     try:ui.wait(timeout=5)
     except subprocess.TimeoutExpired:ui.terminate();ui.wait(timeout=3)
     report['ownedUiExitCode']=ui.returncode
     assert ui.returncode==0,'Owned UI did not close normally'

def agent_check(cli,server_name):
 target=project/'agent-tool-result.txt';marker='AGENT_'+nonce;trace=[]
 command="[IO.File]::WriteAllText('"+str(target).replace("'","''")+"','"+marker+"',[Text.UTF8Encoding]::new($false)); [IO.File]::ReadAllText('"+str(target).replace("'","''")+"')"
 class Model(BaseHTTPRequestHandler):
  def log_message(self,*args):pass
  def do_POST(self):
   body=json.loads(self.rfile.read(int(self.headers['Content-Length'])));trace.append(body);index=len(trace)-1;message={'role':'assistant','content':None}
   if index==0:name='app_tools';arguments={'query':'PowerShell'}
   elif index==1:
    names=re.findall(r'mcp__[A-Za-z0-9_]+__PowerShell',json.dumps(body['messages'][-1]));assert names,'Actual MCP tool was not discovered';name='app_call';arguments={'name':names[0],'arguments':{'command':command,'timeout':10}}
   else:
    assert marker in json.dumps(body['messages'][-1]),'Actual result was not returned to the model';message['content']='Owned MCP command completed and its marker was verified.'
   if index<2:message['tool_calls']=[{'id':'owned_'+str(index),'type':'function','function':{'name':name,'arguments':json.dumps(arguments)}}]
   data=json.dumps({'choices':[{'message':message,'finish_reason':'tool_calls' if index<2 else 'stop'}],'usage':{'prompt_tokens':10,'completion_tokens':10}}).encode();self.send_response(200);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
 model=ThreadingHTTPServer(('127.0.0.1',0),Model);thread=threading.Thread(target=model.serve_forever,daemon=True);thread.start()
 try:
  model_env={**env,'KODER_MODEL':'owned-local-audit','KODER_BASE_URL':'http://127.0.0.1:'+str(model.server_port)+'/v1','KODER_AUTH':'none','KODER_API_KEY':'','KODER_API_RETRIES':'0','KODER_CONTEXT_WINDOW':'64000'}
  args=['node',str(cli),'run','Use the configured Windows MCP PowerShell to write the owned acceptance marker.','--approval','full','--no-memory','-w',str(project)];v=subprocess.run(args,cwd=project,env=model_env,capture_output=True,text=True,encoding='utf-8',timeout=60);(e/'agent.json').write_text(json.dumps({'argv':args,'exitCode':v.returncode,'stdout':v.stdout,'stderr':v.stderr,'requests':trace},indent=2),encoding='utf-8');assert v.returncode==0;assert len(trace)==3;assert target.read_text(encoding='utf-8')==marker;report['actualKoderAgentCallAndContinuation']=True;report['scriptedModelRequests']=len(trace)
 finally:model.shutdown();model.server_close();thread.join(timeout=3)
async def main():
 try:
  await check()
  url='https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.4.0-preview.28/koder-cli-0.4.0-preview.28.tgz';tar=r/'koder.tgz'
  with urllib.request.urlopen(url,timeout=30) as response:tar.write_bytes(response.read())
  assert hashlib.sha256(tar.read_bytes()).hexdigest()=='309d6c159ca432538ff8b90afd4e77a01cf28d4b38aba9eb4f8e535aeb9e8672'
  with tarfile.open(tar) as f:f.extractall(r/'package',filter='data')
  cli=r/'package/koder-cli/bin/koder.mjs';steps=[]
  for action in [['--version'],['eula','accept'],['mcp','add','windows','--preset','windows-mcp','--command',str(exe),'--enable','--json','-w',str(project)],['mcp','test','windows','--json','-w',str(project)]]:
   args=['node',str(cli),*action];v=subprocess.run(args,capture_output=True,text=True,encoding='utf-8',env=env,cwd=project,timeout=60);steps.append({'argv':args,'exitCode':v.returncode,'stdout':v.stdout,'stderr':v.stderr});(e/'koder-steps.json').write_text(json.dumps(steps,indent=2),encoding='utf-8');assert v.returncode==0,steps[-1]
  report['publishedKoderConnection']=True
  agent_check(cli,'windows')
  report['passed']=True
 finally:
  (e/'report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
asyncio.run(main())
