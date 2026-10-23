"""Disposable Windows native API probes; synthetic values, public Koder only."""
import hashlib,json,os,subprocess,time,uuid,urllib.request,tarfile,platform
from pathlib import Path
root=Path(os.environ['RUNNER_TEMP'])/'Koder protected-storage probe';root.mkdir();e=root/'evidence';e.mkdir();rows=[];connections=[]
os_data=subprocess.run(['pwsh','-NoProfile','-Command','Get-CimInstance Win32_OperatingSystem | Select-Object Caption,Version,BuildNumber,OSArchitecture,ProductType | ConvertTo-Json'],capture_output=True,text=True,timeout=10);os_info=json.loads(os_data.stdout);assert os_info['ProductType']==1 and int(os_info['BuildNumber'])>=22000
system=Path(os.environ['SystemRoot']);ps5=system/'System32/WindowsPowerShell/v1.0/powershell.exe';pwsh=Path(subprocess.check_output(['where.exe','pwsh'],text=True).splitlines()[0])
helper_env={k:os.environ[k] for k in ['PATH','HOME','USERPROFILE','SystemRoot','SYSTEMROOT','WINDIR','ProgramFiles','PROGRAMFILES','DBUS_SESSION_BUS_ADDRESS','XDG_RUNTIME_DIR'] if k in os.environ}
helper_env['PSModulePath']=';'.join([str(system/'System32/WindowsPowerShell/v1.0/Modules'),str(Path(os.environ['ProgramFiles'])/'WindowsPowerShell/Modules')])
prefix="$ErrorActionPreference='Stop'; [Console]::InputEncoding=[Text.UTF8Encoding]::new($false); [Console]::OutputEncoding=[Text.UTF8Encoding]::new($false); Add-Type -AssemblyName System.Security; $s=[Console]::In.ReadLine(); if($null -eq $s){throw 'missing protected input'}; "
protect="[Convert]::ToBase64String([Security.Cryptography.ProtectedData]::Protect([Text.Encoding]::UTF8.GetBytes($s),$null,[Security.Cryptography.DataProtectionScope]::CurrentUser))"
unprotect="[Text.Encoding]::UTF8.GetString([Security.Cryptography.ProtectedData]::Unprotect([Convert]::FromBase64String($s.Trim()),$null,[Security.Cryptography.DataProtectionScope]::CurrentUser))"
def probe(executable,label,operation,script,value,iteration):
 import base64
 start=time.monotonic();args=[str(executable),'-NoLogo','-NoProfile','-NonInteractive','-EncodedCommand',base64.b64encode((prefix+script).encode('utf-16-le')).decode()]
 try:
  p=subprocess.run(args,input=value+'\n',env=helper_env,capture_output=True,text=True,encoding='utf-8',timeout=10);row={'launcher':label,'operation':operation,'iteration':iteration,'exitCode':p.returncode,'seconds':round(time.monotonic()-start,3),'stderr':p.stderr[-2000:],'outputBytes':len(p.stdout.encode()),'timedOut':False};output=p.stdout.strip()
 except subprocess.TimeoutExpired:row={'launcher':label,'operation':operation,'iteration':iteration,'seconds':round(time.monotonic()-start,3),'timedOut':True,'exitCode':None};output=None
 rows.append(row);return output
for label,exe in [('system-powershell-5.1',ps5),('installed-pwsh',pwsh)]:
 for iteration in range(3):
  value='OWNED_SYNTHETIC_DPAPI_'+uuid.uuid4().hex;encrypted=probe(exe,label,'protect',protect,value,iteration)
  if encrypted:
   clear=probe(exe,label,'unprotect',unprotect,encrypted,iteration);rows[-1]['roundtripMatches']=clear==value
url='https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.4.0-preview.28/koder-cli-0.4.0-preview.28.tgz';payload=root/'koder.tgz'
with urllib.request.urlopen(url,timeout=30) as response:payload.write_bytes(response.read())
assert hashlib.sha256(payload.read_bytes()).hexdigest()=='309d6c159ca432538ff8b90afd4e77a01cf28d4b38aba9eb4f8e535aeb9e8672'
with tarfile.open(payload) as f:f.extractall(root/'package',filter='data')
cli=root/'package/koder-cli/bin/koder.mjs';upstream=Path(os.environ['RUNNER_TEMP'])/'Koder Native 验收/runtime/Scripts/windows-mcp.exe'
for iteration in range(3):
 home=root/('profile-'+str(iteration));home.mkdir();project=home/'project';project.mkdir();env={**os.environ,'KODER_CLI_HOME':str(home/'.koder-cli'),'KODER_DATA':str(home/'data'),'HOME':str(home),'USERPROFILE':str(home),'KODER_AUTO_UPDATE':'0','KODER_REMOTE_RESOURCES':'0','NO_COLOR':'1','KODER_API_KEY':''}
 for action in [['eula','accept'],['mcp','add','windows','--preset','windows-mcp','--command',str(upstream),'--enable','--json','-w',str(project)],['mcp','test','windows','--json','-w',str(project)]]:
  args=['node',str(cli),*action];start=time.monotonic()
  try:p=subprocess.run(args,cwd=project,env=env,capture_output=True,text=True,encoding='utf-8',timeout=60);row={'iteration':iteration,'action':action[:3],'exitCode':p.returncode,'seconds':round(time.monotonic()-start,3),'stdout':p.stdout,'stderr':p.stderr,'timedOut':False}
  except subprocess.TimeoutExpired:row={'iteration':iteration,'action':action[:3],'exitCode':None,'seconds':round(time.monotonic()-start,3),'timedOut':True}
  connections.append(row)
  if row['exitCode']!=0:break
result={'os':os_info,'python':platform.python_version(),'pythonMachine':platform.machine(),'helperDeadlineSeconds':10,'helperResults':rows,'connectionResults':connections,'paidApiCalls':0,'desktopActions':0,'privacySettingsChanged':False,'note':'Raw DPAPI plaintext and encrypted payloads are not included. These are native API probes and published CLI calls, not an acceptance of the local candidate.'};(e/'protected-storage.json').write_text(json.dumps(result,indent=2),encoding='utf-8');print(json.dumps({'helperFailures':sum(x['timedOut'] or x['exitCode']!=0 or x.get('roundtripMatches') is False for x in rows),'connectionFailures':sum(x['exitCode']!=0 for x in connections),'os':os_info}));assert all(not x['timedOut'] and x['exitCode']==0 and x.get('roundtripMatches',True) for x in rows);assert all(x['exitCode']==0 for x in connections)
