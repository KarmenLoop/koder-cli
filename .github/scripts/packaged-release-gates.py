"""Check a distributed package with the unchanged release acceptance harness."""
from pathlib import Path
import hashlib,json,os,re,shutil,subprocess,sys,tarfile,time
ROOT=Path.cwd();A=ROOT/'candidate';P=ROOT/'payload';O=ROOT/'results';O.mkdir(exist_ok=True)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
m=json.loads((A/'koder-cli-latest.json').read_text());assert sha(A/m['file'])==m['sha256'];assert (A/m['file']).stat().st_size==m['size']
for line in (A/'SHA256SUMS').read_text().splitlines():h,n=line.split('  ',1);assert sha(A/n)==h,n
harness=json.loads((ROOT/'.github/scripts/preview17-harness.json').read_text());assert sha(A/'acceptance-harness-preview17.tar.gz')==harness['sha256']
def extract(archive,to):
 with tarfile.open(archive) as z:
  for item in z:assert not item.issym() and not item.islnk() and '..' not in Path(item.name).parts and not Path(item.name).is_absolute()
  z.extractall(to,filter='data')
extract(A/m['file'],P);cli=P/'koder-cli';kernel=cli/'kernel'
for row in json.loads((kernel/'MANIFEST.json').read_text())['files']:assert sha(kernel/row['path'])==row['sha256'],row['path']
shutil.copytree(kernel,P/'koder-desktop');extract(A/'acceptance-harness-preview17.tar.gz',P)
env={**os.environ,'KODER_DESKTOP_ROOT':str(P/'koder-desktop'),'PYTHONUTF8':'1'}
if os.name=='nt':
 for key in list(env):
  if key.lower()=='psmodulepath':del env[key]
 env['PSModulePath']=str(Path(os.environ['SystemRoot'])/'System32/WindowsPowerShell/v1.0/Modules')
runs=[]
def run(name,argv,cwd,timeout):
 started=time.monotonic();log=O/(name+'.log')
 try:
  with log.open('wb') as f:code=subprocess.run(argv,cwd=cwd,env=env,stdout=f,stderr=subprocess.STDOUT,timeout=timeout).returncode
 except subprocess.TimeoutExpired:code=124
 text=log.read_text(encoding='utf-8',errors='replace');counts={k:int(v) for k,v in re.findall(r'^# (tests|pass|fail|cancelled|skipped) (\d+)\s*$',text,re.M)}
 row={'name':name,'command':argv,'cwd':str(cwd),'exitCode':code,'seconds':round(time.monotonic()-started,3),'counts':counts};runs.append(row);print(json.dumps(row),flush=True)
 print('BEGIN_LOG '+name,flush=True);print(text,flush=True);print('END_LOG '+name,flush=True)
 return code
try:
 run('host-lifecycle',['node','--test','--test-concurrency=1','--test-timeout=60000','test/loop-json-store.test.mjs','test/loop-windows-publish.test.mjs','test/app-host.test.mjs'],P/'koder-desktop',300)
 files=[str(p.relative_to(cli)) for p in sorted((cli/'test').glob('*.test.mjs'))]
 run('full-cli',['node','--test','--test-concurrency=1','--test-timeout=60000',*files],cli,1200)
 if os.name=='nt':
  run('native-installer',['python',str(ROOT/'.github/scripts/test-windows-installer.py'),'--assets',str(A),'--out',str(O/'windows')],ROOT,840)
  for file in sorted((O/'windows').glob('*.json')):print(file.name,file.read_text(encoding='utf-8'),flush=True)
finally:
 result={'passed':all(r['exitCode']==0 for r in runs),'runs':runs,'package':m,'platform':sys.platform,'accountAcceptance':'NOT_RUN_NO_TEST_KEYS','scope':'Distributed runtime with original CLI tests and synthetic fixtures, no private development runtime sources uploaded'}
 (O/'RESULT.json').write_text(json.dumps(result,indent=2)+'\n');print('ACCEPTANCE_RESULT '+json.dumps(result),flush=True)
sys.exit(0 if result['passed'] else 1)
