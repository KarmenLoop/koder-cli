from pathlib import Path
import json,subprocess,os
P=Path.cwd()/'payload/koder-cli';p=P/'test/automatic-update.test.mjs';s=p.read_text();s=s.replace("const prompter=prompt(draft,queue),stdin=new PassThrough(),stdout=new Writable({write(_c,_e,cb){cb();}})","let trace='';const prompter=prompt(draft,queue),stdin=new PassThrough(),stdout=new Writable({write(c,_e,cb){trace+=c;cb();}})")
s=s.replace("assert.equal(fs.existsSync(path.join(f.home,'automatic-installed')),true,'idle automatic update must execute the verified installer');","console.log('AUTO_DIAGNOSTIC',JSON.stringify({calls:f.calls,trace:f.trace(),files:fs.readdirSync(f.home),result:r}));assert.equal(fs.existsSync(path.join(f.home,'automatic-installed')),true,'idle automatic update must execute the verified installer');")
s=s.replace('return {home,prompter,restart,calls,run};','return {home,prompter,restart,calls,run,trace:()=>trace};');p.write_text(s)
u=P/'src/update-release.mjs';s=u.read_text().replace('child.stdout.resume();child.stderr.resume();',"child.stdout.on('data',c=>process.stderr.write('INSTALL_OUT '+c));child.stderr.on('data',c=>process.stderr.write('INSTALL_ERR '+c));");s=s.replace("let failed=false;","console.error('INSTALL_CHILD',child.pid);child.on('error',e=>console.error('INSTALL_ERROR',e.code));child.on('close',c=>console.error('INSTALL_CLOSE',c));let failed=false;");u.write_text(s)
env={**os.environ,'KODER_DESKTOP_ROOT':str(Path.cwd()/'payload/koder-desktop')}
for key in list(env):
 if key.lower()=='psmodulepath':del env[key]
env['PSModulePath']=str(Path(os.environ['SystemRoot'])/'System32/WindowsPowerShell/v1.0/Modules')
result=subprocess.run(['node','--test','--test-concurrency=1','test/automatic-update.test.mjs'],cwd=P,env=env,timeout=90)
print('ORIGINAL_FIXTURE_EXIT',result.returncode,flush=True)
s=u.read_text().replace("stdio: ctx.io.quietInstaller?'pipe':'inherit'","stdio: ctx.io.quietInstaller?['ignore','pipe','pipe']:'inherit'").replace('child.stdin.end();','');u.write_text(s)
result=subprocess.run(['node','--test','--test-concurrency=1','test/automatic-update.test.mjs'],cwd=P,env=env,timeout=90)
print('IGNORED_STDIN_FIXTURE_EXIT',result.returncode,flush=True)

f=P/'test/windows-fixtures.mjs';body=f.read_text();start=body.index('export function installerFixture(js)');body=body[:start]+"export function installerFixture(js){const encoded=Buffer.from(js).toString('base64');return `$ErrorActionPreference='Stop'\\n& '${process.execPath.replaceAll(\"'\",\"''\")}' -e \"eval(Buffer.from('${encoded}','base64').toString())\"\\nif ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }\\n`;}\n";f.write_text(body)
result=subprocess.run(['node','--test','--test-concurrency=1','test/automatic-update.test.mjs'],cwd=P,env=env,timeout=90)
print('ARGUMENT_FIXTURE_EXIT',result.returncode,flush=True)
raise SystemExit(result.returncode)
