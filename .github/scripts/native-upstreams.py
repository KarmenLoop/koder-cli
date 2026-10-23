"""Public-package acceptance only. No private source or model credentials."""
import argparse,asyncio,hashlib,json,os,platform,subprocess,tarfile,urllib.request,uuid
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
    snapshot=await call('Snapshot',{'use_vision':False,'use_ui_tree':True});assert 'Error capturing desktop state' not in snapshot;report['snapshotReturned']=True
async def main():
 try:
  await check()
  url='https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.4.0-preview.28/koder-cli-0.4.0-preview.28.tgz';tar=r/'koder.tgz'
  with urllib.request.urlopen(url,timeout=30) as response:tar.write_bytes(response.read())
  assert hashlib.sha256(tar.read_bytes()).hexdigest()=='309d6c159ca432538ff8b90afd4e77a01cf28d4b38aba9eb4f8e535aeb9e8672'
  with tarfile.open(tar) as f:f.extractall(r/'package',filter='data')
  cli=r/'package/koder-cli/bin/koder.mjs';steps=[]
  for action in [['--version'],['mcp','add','windows','--preset','windows-mcp','--command',str(exe),'--enable','--json','-w',str(project)],['mcp','test','windows','--json','-w',str(project)]]:
   args=['node',str(cli),*action];v=subprocess.run(args,capture_output=True,text=True,encoding='utf-8',env=env,cwd=project,timeout=60);steps.append({'argv':args,'exitCode':v.returncode,'stdout':v.stdout,'stderr':v.stderr});(e/'koder-steps.json').write_text(json.dumps(steps,indent=2),encoding='utf-8');assert v.returncode==0,steps[-1]
  report['publishedKoderConnection']=True;report['passed']=True
 finally:
  (e/'report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
asyncio.run(main())
