from pathlib import Path
import hashlib,json,os,shutil,subprocess,tarfile,time
R=Path.cwd();A=R/'candidate';P=R/'diagnosis';P.mkdir();m=json.loads((A/'koder-cli-latest.json').read_text());assert hashlib.sha256((A/m['file']).read_bytes()).hexdigest()==m['sha256']
for name in [m['file'],'acceptance-harness-preview17-r2.tar.gz']:
 with tarfile.open(A/name) as z:z.extractall(P,filter='data')
cli=P/'koder-cli';shutil.copytree(cli/'kernel',P/'koder-desktop',dirs_exist_ok=True)
env={**os.environ,'KODER_DESKTOP_ROOT':str(P/'koder-desktop'),'PSModulePath':str(Path(os.environ['SystemRoot'])/'System32/WindowsPowerShell/v1.0/Modules')}
rows=[]
def run(name,args,timeout=90):
 start=time.monotonic()
 try:r=subprocess.run(args,cwd=cli,env=env,capture_output=True,timeout=timeout);code=r.returncode;text=(r.stdout+r.stderr).decode('utf-8',errors='replace')
 except subprocess.TimeoutExpired as e:code=124;text=((e.stdout or b'')+(e.stderr or b'')).decode('utf-8',errors='replace')
 print('BEGIN_DIAGNOSIS '+name,flush=True);print(text,flush=True);row={'name':name,'exitCode':code,'seconds':time.monotonic()-start};rows.append(row);print('END_DIAGNOSIS '+json.dumps(row),flush=True)
run('original-execution-permissions',['node','--test','--test-concurrency=1','--test-timeout=30000','test/execution-permissions.test.mjs'])
# Distinguish native flags, JSON validity, and path identity without touching a user profile.
probe=cli/'test/diagnostic-permissions.mjs'
probe.write_text("import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {setExecutionMode,executionStatus} from '../src/execution-permissions.mjs';const root=fs.mkdtempSync(path.join(os.tmpdir(),'owned-permission-'));for(const name of ['normal','中文 空格','extended']){const dir=path.join(root,name);fs.mkdirSync(dir);const env={KODER_CLI_HOME:dir};try{setExecutionMode('full',{env,workspace:root});console.log(name,executionStatus({env,workspace:root}));}catch(e){console.log(name,e.code,e.message);}const p=path.join(dir,'execution-permissions.json');if(fs.existsSync(p)){for(const flag of [fs.constants.O_RDONLY,fs.constants.O_RDONLY|(fs.constants.O_NOFOLLOW||0)|(fs.constants.O_NONBLOCK||0)])try{const fd=fs.openSync(p,flag);console.log('FLAGS',flag,fs.lstatSync(p).ino,fs.fstatSync(fd).ino,JSON.parse(fs.readFileSync(fd,'utf8')).profile);fs.closeSync(fd);}catch(e){console.log('FLAGS',flag,e.code);}}}fs.rmSync(root,{recursive:true});")
run('native-permission-record',['node',str(probe)])
# Trace the real handoff after cleanup without changing deadlines or assertions.
lifecycle=cli/'src/process-lifecycle.mjs';s=lifecycle.read_text();needle='if(process.connected)process.disconnect();';assert s.count(needle)==1
lifecycle.write_text(s.replace(needle,"console.error('[DEBUG-win-final-handoff]',JSON.stringify({pid:process.pid,code,resources:process.getActiveResourcesInfo(),handles:process._getActiveHandles().map(h=>h.constructor.name)}));"+needle))
f=cli/'test/update-restart-process.test.mjs';s=f.read_text();needle="pendingSend();await until(()=>state()?.pid!==priorPid && state()?.version===(startupFailure?'0.4.0-preview.6':'0.4.0-preview.100'));";assert s.count(needle)==1
f.write_text(s.replace(needle,"pendingSend();try{await until(()=>state()?.pid!==priorPid && state()?.version===(startupFailure?'0.4.0-preview.6':'0.4.0-preview.100'));}catch(error){console.error('[DEBUG-win-final-gateway]',JSON.stringify({state:state(),output:old.output()}));throw error;}"))
for i in range(10):run('wechat-'+str(i),['node','--test','--test-timeout=30000','--test-name-pattern=running WeChat gateway drains and restores options/history \\(updated worker\\)','test/update-restart-process.test.mjs'],45)
for i in range(10):run('startup-'+str(i),['node','--test','--test-timeout=30000','--test-name-pattern=light commands start fast','test/bundle.test.mjs'],40)
for i in range(4):run('terminal-'+str(i),['python',str(R/'.github/scripts/test-terminal-celebrations.py'),'--node',shutil.which('node'),'--package',str(cli),'--out',str(P/('terminal-'+str(i)))],100)
print('DIAGNOSIS_RESULT '+json.dumps(rows),flush=True)
