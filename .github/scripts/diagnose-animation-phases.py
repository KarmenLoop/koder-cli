from pathlib import Path
import hashlib,json,tarfile,subprocess,shutil,re,os
r=Path.cwd();a=r/'candidate';m=json.loads((a/'koder-cli-latest.json').read_text());assert hashlib.sha256((a/m['file']).read_bytes()).hexdigest()==m['sha256'];out=r/'animation-diagnosis';out.mkdir();payload=out/'payload'
with tarfile.open(a/m['file']) as z:z.extractall(payload,filter='data')
cli=payload/'koder-cli';changes=[]
def overlay(name,edit):
 p=cli/name;b=p.read_bytes();s=edit(b.decode());assert s!=b.decode();p.write_text(s);changes.append({'path':name,'before':hashlib.sha256(b).hexdigest(),'after':hashlib.sha256(p.read_bytes()).hexdigest()})
marker="function phase(name){process.stderr.write('\\nANIM_PHASE '+JSON.stringify({name,at:Date.now(),pid:process.pid})+'\\n');}\n"
overlay('bin/koder.mjs',lambda s:s.replace("import module from 'node:module';","import module from 'node:module';\n"+marker+"phase('entry');process.on('beforeExit',()=>phase('before-exit'));process.on('exit',()=>phase('exit'));"))
overlay('src/celebration-animation.mjs',lambda s:"import module from 'node:module';\n"+marker+s.replace(" const date=ctx.io.now?.()||new Date()"," if(process.env.KODER_DIAGNOSTIC_CACHE_FLUSH==='1'){phase('cache-flush-start');module.flushCompileCache?.();phase('cache-flush-end');}\n const date=ctx.io.now?.()||new Date()").replace("const finish=()=>{if(!settled){settled=true;stop?.();}};","const finish=()=>{if(!settled){phase('animation-finish');settled=true;stop?.();}};").replace("  out.write('\\x1b[?1049h", "  phase('animation-start');out.write('\\x1b[?1049h").replace(" return {effect,durationMs:Math.round(performance.now()-start)"," phase('animation-return');return {effect,durationMs:Math.round(performance.now()-start)"))
overlay('src/process-lifecycle.mjs',lambda s:"import module from 'node:module';\n"+marker+s.replace(" const date=ctx.io.now?.()||new Date()"," if(process.env.KODER_DIAGNOSTIC_CACHE_FLUSH==='1'){phase('cache-flush-start');module.flushCompileCache?.();phase('cache-flush-end');}\n const date=ctx.io.now?.()||new Date()").replace("    if(process.connected)process.disconnect();","    phase('worker-disconnect');if(process.connected)process.disconnect();").replace("      const result=await new Promise(resolve=>child.once('close'","      child.once('exit',()=>phase('child-exit'));const result=await new Promise(resolve=>child.once('close'").replace("      clearTimeout(startupTimer);clearTimeout(stopTimer);stopTimer=null;current=null;","      phase('child-close');clearTimeout(startupTimer);clearTimeout(stopTimer);stopTimer=null;current=null;"))
print('DIAGNOSTIC_OVERLAYS '+json.dumps({'acceptance':False,'packageSha256':m['sha256'],'changed':changes}),flush=True)
for n in range(4):
 d=out/f'case-{n}';env={**os.environ,'NODE_COMPILE_CACHE':str(out/f'cold-cache-{n}'),'KODER_DIAGNOSTIC_CACHE_FLUSH':str(n%2)};v=subprocess.run(['python',str(r/'.github/scripts/test-terminal-celebrations.py'),'--node',shutil.which('node'),'--package',str(cli),'--out',str(d)],capture_output=True,text=True,encoding='utf-8',errors='replace',timeout=160,env=env)
 print('DIAGNOSTIC_CASE '+json.dumps({'iteration':n,'flushBeforePlayback':n%2==1,'coldCompileCache':True,'exitCode':v.returncode}),flush=True);print(v.stdout+v.stderr,flush=True)
 text=(d/'fireworks-full.log').read_text(errors='replace')
 for match in re.findall(r'ANIM_PHASE (\{[^\r\n]+\})',text):print('DIAGNOSTIC_PHASE '+match,flush=True)
 report=d/'ANIMATION-RESULT.json'
 if report.exists():print('DIAGNOSTIC_TIMING '+report.read_text(),flush=True)
