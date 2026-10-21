from pathlib import Path
import json,hashlib,os,subprocess,tarfile,shutil
r=Path.cwd();a=r/'candidate';m=json.loads((a/'koder-cli-latest.json').read_text());assert hashlib.sha256((a/m['file']).read_bytes()).hexdigest()==m['sha256'];p=r/'memory-public';p.mkdir()
with tarfile.open(a/m['file']) as z:
 for item in z:assert not item.issym() and not item.islnk() and '..' not in Path(item.name).parts and not Path(item.name).is_absolute()
 z.extractall(p,filter='data')
cli=p/'koder-cli';env={**os.environ,'KODER_ACCEPTANCE_PACKAGE':str(cli)}
v=subprocess.run(['node','--test','--test-timeout=30000',str(r/'.github/scripts/test-windows-memory-acl.mjs')],env=env,capture_output=True,text=True,encoding='utf-8',errors='replace',timeout=100);print(v.stdout+v.stderr,flush=True);assert v.returncode==0 and '# pass 4' in v.stdout and '# fail 0' in v.stdout
v=subprocess.run(['python',str(r/'.github/scripts/windows-memory-terminal.py'),'--package',str(cli),'--out',str(p/'terminal')],capture_output=True,text=True,encoding='utf-8',errors='replace',timeout=75);print(v.stdout+v.stderr,flush=True);assert v.returncode==0
report=json.loads((p/'terminal/RESULT.json').read_text());assert report['passed'] and report['modelTurns']==2 and report['warningCount']==1 and report['historyUntouched'] and report['noSilentLocationFork'];print('PUBLIC_MEMORY_RESULT '+json.dumps({'passed':True,'packageSha256':m['sha256'],'nativeAclChecks':4,'terminal':report,'scope':'Unmodified publicly downloaded runtime; dedicated memory regression, not overall Windows installer/animation acceptance'}),flush=True)
