"""Repeat the original startup assertions against the unchanged package."""
from pathlib import Path
import hashlib,json,os,shutil,subprocess,sys,tarfile,time

root=Path.cwd();assets=root/'candidate';payload=root/'startup-repeat';payload.mkdir()
manifest=json.loads((assets/'koder-cli-latest.json').read_text())
harness=json.loads((root/'.github/scripts/preview17-harness.json').read_text())
for name,digest in [(manifest['file'],manifest['sha256']),(harness['file'],harness['sha256'])]:
    assert hashlib.sha256((assets/name).read_bytes()).hexdigest()==digest
    with tarfile.open(assets/name) as archive:
        for item in archive:
            assert not item.issym() and not item.islnk() and '..' not in Path(item.name).parts and not Path(item.name).is_absolute()
        archive.extractall(payload,filter='data')
cli=payload/'koder-cli';shutil.copytree(cli/'kernel',payload/'koder-desktop')
env={**os.environ,'KODER_DESKTOP_ROOT':str(payload/'koder-desktop')}
rows=[]
for index in range(20):
    # The original case creates new profile/workspace directories for each
    # version and ask process. No source, assertion or deadline is patched.
    started=time.monotonic()
    command=['node','--test','--test-timeout=30000','--test-name-pattern=light commands start fast','test/bundle.test.mjs']
    try:
        result=subprocess.run(command,cwd=cli,env=env,capture_output=True,timeout=40)
        code=result.returncode;output=(result.stdout+result.stderr).decode('utf-8',errors='replace')
    except subprocess.TimeoutExpired as error:
        code=124;output=((error.stdout or b'')+(error.stderr or b'')).decode('utf-8',errors='replace')
    row={'iteration':index,'exitCode':code,'seconds':round(time.monotonic()-started,3)}
    rows.append(row);print('STARTUP_CASE '+json.dumps(row),flush=True);print(output,flush=True)
report={'passed':len(rows)==20 and all(row['exitCode']==0 for row in rows),'packageSha256':manifest['sha256'],'runs':rows,'assertions':{'versionMsLessThan':250,'firstModelRequestMsLessThan':1000},'sourceModified':False}
print('STARTUP_REPEAT_RESULT '+json.dumps(report),flush=True)
sys.exit(0 if report['passed'] else 1)
