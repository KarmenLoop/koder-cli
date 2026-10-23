"""Native channel/install checks against exact draft assets; no model calls."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import os,json,hashlib,platform,subprocess,threading,time
root=Path.cwd();assets=root/'candidate';out=root/'stable-results';out.mkdir(exist_ok=True);commands=[];results=[]
for label,version in [('new','0.4.0'),('prior','0.4.0-preview.30')]:
 folder=assets/label;m=json.loads((folder/'koder-cli-latest.json').read_text());assert m['version']==version and m['preview']==(label=='prior')
 for line in (folder/'SHA256SUMS').read_text().splitlines():
  digest,name=line.split('  ',1);assert Path(name).name==name;assert hashlib.sha256((folder/name).read_bytes()).hexdigest()==digest,name
 assert hashlib.sha256((folder/m['file']).read_bytes()).hexdigest()==m['sha256']
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(assets)));thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
win=os.name=='nt';base='http://127.0.0.1:'+str(server.server_port);ps=str(Path(os.environ.get('SystemRoot','C:/Windows'))/'System32/WindowsPowerShell/v1.0/powershell.exe')
def run(name,argv,home,env,timeout=180):
 start=time.monotonic();p=subprocess.run(argv,cwd=home,env=env,input='',capture_output=True,text=True,encoding='utf-8',errors='replace',timeout=timeout)
 (out/(name+'.log')).write_text(p.stdout+'\nSTDERR\n'+p.stderr,encoding='utf-8');commands.append({'name':name,'argv':argv,'exitCode':p.returncode,'seconds':round(time.monotonic()-start,3)});(out/'commands.json').write_text(json.dumps(commands,indent=2)+'\n');assert p.returncode==0,name+'\n'+p.stdout[-2000:]+'\n'+p.stderr[-2000:];return p.stdout

def check_install(name,mode,upgrade=False):
 home=out/(name+'-home');home.mkdir();tmp=home/'tmp';tmp.mkdir();install=home/'install';data=home/'data';data.mkdir()
 env={k:v for k,v in os.environ.items() if not k.startswith(('KODER_','OPENAI_','ANTHROPIC_'))};env.update(HOME=str(home),USERPROFILE=str(home),TMP=str(tmp),TEMP=str(tmp),TMPDIR=str(tmp),KODER_CLI_HOME=str(install),KODER_INSTALL_HOME=str(install),KODER_BIN_DIR=str(home/'bin'),KODER_DATA=str(data),KODER_AUTO_UPDATE='0',KODER_REMOTE_RESOURCES='0',KODER_EULA_ACCEPT='1',KODER_NO_ONBOARD='1',KODER_DOWNLOAD_TIMEOUT_SECONDS='60',KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS='15',NO_COLOR='1')
 if win:env['PSModulePath']=os.pathsep.join([str(Path(os.environ['SystemRoot'])/'System32/WindowsPowerShell/v1.0/Modules'),str(Path(os.environ['ProgramFiles'])/'WindowsPowerShell/Modules'),env.get('PSModulePath','')])
 def install_version(label):
  env['KODER_INSTALL_BASE']=base+'/'+label;script=assets/label/('koder-cli.cmd' if mode=='cmd' else 'koder-cli.ps1' if mode=='ps' else 'koder-cli.sh')
  argv=[os.environ['COMSPEC'],'/d','/c',str(script)] if mode=='cmd' else [ps,'-NoProfile','-ExecutionPolicy','Bypass','-File',str(script)] if mode=='ps' else ['bash',str(script),'--no-onboard','--no-modify-path'];run(name+'-'+label,argv,home,env)
 if upgrade:install_version('prior')
 sentinel=data/'settings-sentinel.json';sentinel.write_text('{"lang":"en","preserve":"owned-fixture"}\n');before=hashlib.sha256(sentinel.read_bytes()).hexdigest();install_version('new');assert hashlib.sha256(sentinel.read_bytes()).hexdigest()==before
 info=json.loads((install/'install.json').read_text(encoding='utf-8-sig'));accept=json.loads((install/'eula-acceptance.json').read_text(encoding='utf-8-sig'));assert info['version']=='0.4.0' and info['preview'] is False,info;assert accept['preview'] is False,accept
 launcher=install/'bin/koder.cmd' if win else home/'bin/koder';argv=[os.environ['COMSPEC'],'/d','/c',str(launcher),'--version'] if win else [str(launcher),'--version'];output=run(name+'-version',argv,home,env,60);assert 'koder 0.4.0' in output,output;assert (install/'versions/0.4.0').is_dir()
 results.append({'name':name,'installer':mode,'fresh':not upgrade,'upgradeFrom':'0.4.0-preview.30' if upgrade else None,'version':info['version'],'installPreview':info['preview'],'acceptancePreview':accept['preview'],'sentinelPreserved':True,'passed':True})
try:
 if win:check_install('windows-powershell-fresh','ps');check_install('windows-cmd-upgrade','cmd',True)
 else:check_install('mac-shell-fresh','sh');check_install('mac-shell-upgrade','sh',True)
 report={'system':platform.platform(),'machine':platform.machine(),'node':subprocess.check_output(['node','-p','process.version+" "+process.platform+" "+process.arch'],text=True).strip(),'tests':results,'allPassed':True,'scope':'Exact draft assets; owned loopback origin and disposable install roots; CLI installer/channel and reinstall upgrade only. No GUI/IME/UAC, Windows10/11 client certification, real providers or cold-only PS5 claim.'};(out/'result.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
finally:server.shutdown();server.server_close();thread.join(timeout=3)
