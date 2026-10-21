from pathlib import Path
import hashlib,json,os,shutil,subprocess,tarfile,time
R=Path.cwd();A=R/'candidate';P=R/'app-diagnosis';P.mkdir();m=json.loads((A/'koder-cli-latest.json').read_text());h=json.loads((R/'.github/scripts/preview17-harness.json').read_text())
for name,digest in [(m['file'],m['sha256']),(h['file'],h['sha256'])]:
 assert hashlib.sha256((A/name).read_bytes()).hexdigest()==digest
 with tarfile.open(A/name) as z:z.extractall(P,filter='data')
cli=P/'koder-cli';shutil.copytree(cli/'kernel',P/'koder-desktop',dirs_exist_ok=True);env={**os.environ,'KODER_DESKTOP_ROOT':str(P/'koder-desktop')}
f=cli/'test/apps-bundle.test.mjs';original=f.read_text()
# Keep every operation and original 60-second file limit; measure only boundaries.
s=original.replace(' const dist=path.join(dir,'dist');execFileSync('," console.error('[DEBUG-app-phase] pack-start',Date.now());const dist=path.join(dir,'dist');execFileSync(")
s=s.replace(" const manifest=JSON.parse", " console.error('[DEBUG-app-phase] pack-end',Date.now());const manifest=JSON.parse")
s=s.replace("execFileSync('tar',['-xzf',path.join(dist,manifest.file),'-C',dir]);return", "console.error('[DEBUG-app-phase] extract-start',Date.now());execFileSync('tar',['-xzf',path.join(dist,manifest.file),'-C',dir]);console.error('[DEBUG-app-phase] extract-end',Date.now());return")
s=s.replace("async()=>assert.equal((await host.release()).cleanupComplete,true)","async()=>{console.error('[DEBUG-app-phase] release-start',Date.now());assert.equal((await host.release()).cleanupComplete,true);console.error('[DEBUG-app-phase] release-end',Date.now());}")
s=s.replace("async function packed(t){", "async function packed(t){console.error('[DEBUG-app-phase] fixture-start',Date.now());")
for i in range(3):
 f.write_text(s);start=time.monotonic()
 try:p=subprocess.run(['node','--test','--test-concurrency=1','--test-timeout=60000','test/apps-bundle.test.mjs'],cwd=cli,env=env,capture_output=True,timeout=70);code=p.returncode;output=p.stdout+p.stderr
 except subprocess.TimeoutExpired as e:code=124;output=(e.stdout or b'')+(e.stderr or b'')
 print('APP_DIAGNOSIS '+json.dumps({'iteration':i,'exitCode':code,'seconds':time.monotonic()-start}),flush=True);print(output.decode('utf-8',errors='replace'),flush=True)
f.write_text(original)
