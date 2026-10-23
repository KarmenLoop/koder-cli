"""Owned, no-account Windows component acceptance on an exact public runtime."""
from pathlib import Path
import os,sys,subprocess,urllib.request,tarfile,hashlib,json,shutil,time
repo=Path.cwd();root=Path(os.environ['RUNNER_TEMP'])/'post29-multiwindow';root.mkdir();e=root/'evidence';e.mkdir();archive=root/'runtime.tgz'
sha='107aca33641987458df2c41251824cfabbfb4927e65f7e7c4b4dbd3cd723b766'
with urllib.request.urlopen('https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.4.0-preview.29/koder-cli-0.4.0-preview.29.tgz',timeout=40) as response:archive.write_bytes(response.read())
assert hashlib.sha256(archive.read_bytes()).hexdigest()==sha
with tarfile.open(archive) as f:f.extractall(root/'package',filter='data')
runtime=root/'package/koder-cli';files=json.loads((repo/'.github/scripts/post29-multiwindow-files.json').read_text())
base={f:hashlib.sha256((runtime/f).read_bytes()).hexdigest() for f in files if f.startswith('src/')}
for f in files:
 if not f.startswith('test/'):continue
 (runtime/f).parent.mkdir(parents=True,exist_ok=True);shutil.copy2(repo/f,runtime/f)
rows=[]
def run(name,argv,timeout=100,cwd=runtime):
 start=time.monotonic()
 try:
  p=subprocess.run(argv,cwd=cwd,env=os.environ,capture_output=True,text=True,encoding='utf-8',timeout=timeout);row={'name':name,'argv':argv,'exitCode':p.returncode,'seconds':time.monotonic()-start};(e/(name+'.log')).write_text(p.stdout+p.stderr,encoding='utf-8')
 except subprocess.TimeoutExpired as exc:
  row={'name':name,'argv':argv,'exitCode':None,'timedOut':True,'seconds':time.monotonic()-start};(e/(name+'.log')).write_bytes((exc.stdout or b'')+(exc.stderr or b''))
 rows.append(row);(e/'commands.json').write_text(json.dumps(rows,indent=2));print(json.dumps(row),flush=True);return row['exitCode']
try:
 red=run('public29-legacy-lock-red',['node','--test','--test-concurrency=1','test/multi-window-lock-compat.test.mjs'])
 for f in files:
  if f.startswith('src/'):shutil.copy2(repo/f,runtime/f)
 source={f:hashlib.sha256((runtime/f).read_bytes()).hexdigest() for f in base}
 (e/'source.json').write_text(json.dumps({'publicArchiveSHA256':sha,'before':base,'candidateComponents':source,'scope':'Three CLI source components over exact public preview.29. Not a complete new release or GUI/IME/UAC acceptance.'},indent=2))
 green=run('candidate-lock-and-worker',['node','--test','--test-concurrency=1','--test-timeout=60000','test/multi-window-lock-compat.test.mjs','test/multi-window-session.test.mjs','test/memory-store.test.mjs','test/worker-disconnect.test.mjs'],timeout=260)
 # Run each updater case with the same 60s deadline instead of sharing one file-level 60s deadline.
 update_names=['^real update restarts once', '^running WeChat gateway.*updated worker', '^running WeChat gateway.*pre-admission failure', '^replacement startup failure', '^an idle chat', '^replacement chat import', '^replacement chat initialize', '^failure after new worker admission']
 updates=[run('update-case-'+str(i+1),['node','--test','--test-concurrency=1','--test-timeout=60000','--test-name-pattern',name,'test/update-restart-process.test.mjs'],timeout=70) for i,name in enumerate(update_names)]
 entry=run('candidate-actual-entry',['node',str(repo/'.github/scripts/post29-multiwindow-entry.mjs'),'--runtime-root',str(runtime),'--owned-root',str(root/'entry-fixture')],timeout=120)
 if (root/'entry-fixture/receipt.json').exists():shutil.copy2(root/'entry-fixture/receipt.json',e/'actual-entry.json')
 assert red==1,'Original public runtime must reproduce the legacy/PID defect; preserve failures separately.'
 assert green==0 and entry==0 and all(code==0 for code in updates),'Candidate regression did not pass.'
finally:
 (e/'platform.json').write_text(json.dumps({'platform':sys.platform,'architecture':os.environ.get('PROCESSOR_ARCHITECTURE'),'runner':os.environ.get('RUNNER_OS'),'modelKeysUsed':False,'testsOnly':True},indent=2))
