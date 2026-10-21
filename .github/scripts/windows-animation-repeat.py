from pathlib import Path
import hashlib,json,os,shutil,subprocess,sys,tarfile
r=Path.cwd();a=r/'candidate';m=json.loads((a/'koder-cli-latest.json').read_text());assert hashlib.sha256((a/m['file']).read_bytes()).hexdigest()==m['sha256']
payload=r/'animation-repeat';payload.mkdir()
with tarfile.open(a/m['file']) as z:
 for item in z:assert not item.issym() and not item.islnk() and '..' not in Path(item.name).parts and not Path(item.name).is_absolute()
 z.extractall(payload,filter='data')
cli=payload/'koder-cli';rows=[]
for n in range(3):
 command=['python',str(r/'.github/scripts/test-terminal-celebrations.py'),'--node',shutil.which('node'),'--package',str(cli),'--out',str(payload/f'case-{n}')]
 result=subprocess.run(command,capture_output=True,text=True,encoding='utf-8',errors='replace',timeout=160)
 print('ANIMATION_REPEAT_CASE',n,result.returncode,flush=True);print(result.stdout+result.stderr,flush=True)
 report=payload/f'case-{n}/ANIMATION-RESULT.json';data=json.loads(report.read_text()) if report.exists() else {}
 rows.append({'iteration':n,'exitCode':result.returncode,'result':data})
report={'passed':len(rows)==3 and all(x['exitCode']==0 and x['result'].get('passed') for x in rows),'packageSha256':m['sha256'],'runs':rows,'originalProcessDeadlineSeconds':15,'originalFullPlaybackSeconds':[5,7.5],'originalSkipDeadlineSeconds':3,'sourceModified':False}
print('ANIMATION_REPEAT_RESULT '+json.dumps(report),flush=True);sys.exit(0 if report['passed'] else 1)
