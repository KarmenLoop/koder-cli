import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {createMemory,redactMemory} from '../src/memory.mjs';
import {cli,mockModel,textStep,tmp} from './helpers.mjs';
import {importKernel} from '../src/agent.mjs';
const {estimateMessages,estimateTokens}=await importKernel('fusion/tokens.mjs');

test('redaction covers Authorization, quoted JSON fields and env-style credentials',()=>{
 const result=redactMemory('Authorization: Bearer fixture-opaque-token\n{"apiKey":"fixture-json-key","password":"fixture-password"}\nAPI_KEY=fixture-env-key');
 for(const value of ['fixture-opaque-token','fixture-json-key','fixture-password','fixture-env-key'])assert.equal(result.includes(value),false,result);
});
test('actual wire input and output budgets fit an 8192-token model without explicit maxOutput',async()=>{
 const server=await mockModel([textStep('okay')]);
 try{
  const result=await cli(['run','Reply briefly.','-w',tmp()],{env:{KODER_MODEL:'fixture',KODER_BASE_URL:server.url,KODER_AUTH:'none',KODER_CONTEXT_WINDOW:'8192'}});
  assert.equal(result.code,0,result.err);assert.equal(server.requests.length,1);
  const body=server.requests[0].body;
  assert.ok(estimateMessages(body.messages)+estimateTokens(JSON.stringify(body.tools))+body.max_tokens<=8192);
 }finally{await server.close();}
});

test('exclusive memory lease rejects concurrent writers and preserves data',()=>{
 const workspace=tmp(),env={KODER_CLI_HOME:tmp()},first=createMemory({workspace,env}),second=createMemory({workspace,env});
 first.acquire();try{assert.throws(()=>second.acquire(),{code:'MEMORY_BUSY'});const data=first.read();first.write({...data,notes:[{id:'test',text:'preserved',at:1}]});}finally{first.release();}
 second.acquire();try{assert.equal(second.read().notes[0].text,'preserved');}finally{second.release();}
});
test('symlinked and corrupt memories are rejected without touching target',()=>{
 const workspace=tmp(),env={KODER_CLI_HOME:tmp()},memory=createMemory({workspace,env});const outside=path.join(tmp(),'private.txt');fs.writeFileSync(outside,'outside');fs.symlinkSync(outside,memory.file);
 assert.throws(()=>memory.read(),{code:'MEMORY_INVALID'});assert.equal(fs.readFileSync(outside,'utf8'),'outside');fs.unlinkSync(memory.file);fs.writeFileSync(memory.file,'{broken');assert.throws(()=>memory.read(),{code:'MEMORY_INVALID'});
});
test('a successful archive is reusable when reset is retried after main rename failure',()=>{
 const workspace=tmp(),env={KODER_CLI_HOME:tmp()},memory=createMemory({workspace,env});const id='11111111-1111-4111-8111-111111111111';
 memory.transact(data=>memory.write({...data,conversation:{id,title:'test',createdAt:1,messages:[{role:'user',content:'keep',id,at:1}]}}));
 const original=fs.renameSync;
 try{
  fs.renameSync=(from,to)=>{if(to===memory.file)throw Object.assign(new Error('fixture'),{code:'EIO'});return original(from,to);};
  assert.throws(()=>memory.transact(data=>memory.reset(data)),{code:'EIO'});
 }finally{fs.renameSync=original;}
 memory.transact(data=>memory.reset(data));assert.equal(memory.read().conversation,null);
});

test('FIFO memory is rejected promptly instead of blocking open', {skip:process.platform==='win32'}, async()=>{
 const {spawnSync}=await import('node:child_process');const memory=createMemory({workspace:tmp(),env:{KODER_CLI_HOME:tmp()}});
 assert.equal(spawnSync('mkfifo',[memory.file]).status,0);
 const module=new URL('../src/memory.mjs',import.meta.url).href;
 const result=spawnSync(process.execPath,['--input-type=module','-e',`import {createMemory} from ${JSON.stringify(module)};try{createMemory(${JSON.stringify({workspace:memory.identity.workspace,env:{KODER_CLI_HOME:path.dirname(path.dirname(path.dirname(memory.file)))}})}).read();process.exitCode=1}catch(e){if(e.code!=='MEMORY_INVALID')throw e;console.log('rejected')}`],{timeout:1000,encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);assert.match(result.stdout,/rejected/);
});
test('dead-process lock and dead reaper are recoverable without restoring execution state',async()=>{
 const {spawnSync}=await import('node:child_process');const workspace=tmp(),env={KODER_CLI_HOME:tmp()},module=new URL('../src/memory.mjs',import.meta.url).href;
 const result=spawnSync(process.execPath,['--input-type=module','-e',`import {createMemory} from ${JSON.stringify(module)};const m=createMemory(${JSON.stringify({workspace,env})});m.acquire();console.log(process.pid);`],{encoding:'utf8',timeout:1500});assert.equal(result.status,0,result.stderr);
 const memory=createMemory({workspace,env}),lock=memory.file.replace(/\.json$/,'.lock');const owner=JSON.parse(fs.readFileSync(lock,'utf8'));
 fs.writeFileSync(path.join(path.dirname(lock),`${memory.key}.reap-${owner.token}`),JSON.stringify({pid:Number(result.stdout.trim()),token:'12345678-1234-4234-8234-123456789012'}));
 memory.acquire();try{const data=memory.read();memory.write({...data,notes:[{id:'survived',text:'restored safely',at:1}]});}finally{memory.release();}
 assert.equal(memory.read().notes[0].text,'restored safely');
});
test('concurrent stale-lock reclaimers never overlap owned leases or lose committed notes',async()=>{
 const {spawn,spawnSync}=await import('node:child_process');const workspace=tmp(),env={KODER_CLI_HOME:tmp()},module=new URL('../src/memory.mjs',import.meta.url).href;
 const initial=spawnSync(process.execPath,['--input-type=module','-e',`import {createMemory} from ${JSON.stringify(module)};createMemory(${JSON.stringify({workspace,env})}).acquire();`],{encoding:'utf8',timeout:1500});assert.equal(initial.status,0,initial.stderr);
 const children=Array.from({length:6},(_,index)=>{
  const code=`import {createMemory} from ${JSON.stringify(module)};const m=createMemory(${JSON.stringify({workspace,env})});process.send('ready');process.once('message',async()=>{let owned=false;try{m.acquire();owned=true;const start=Date.now();const d=m.read();await new Promise(r=>setTimeout(r,100));m.write({...d,notes:[...d.notes,{id:'writer-${index}',text:'note-${index}',at:1}]});m.release();owned=false;console.log(JSON.stringify({start,end:Date.now(),id:'writer-${index}'}));}catch(e){if(!['MEMORY_BUSY','ENOENT'].includes(e.code))throw e;console.log(JSON.stringify({busy:true}));}finally{if(owned)m.release();process.disconnect();}});`;
  const child=spawn(process.execPath,['--input-type=module','-e',code],{stdio:['ignore','pipe','pipe','ipc']});let out='',err='';child.stdout.on('data',v=>out+=v);child.stderr.on('data',v=>err+=v);
  return {child,ready:new Promise(r=>child.once('message',r)),done:new Promise((resolve,reject)=>{const timer=setTimeout(()=>child.kill('SIGKILL'),3000);child.once('error',reject);child.once('exit',code=>{clearTimeout(timer);resolve({code,out,err});});})};
 });
 await Promise.all(children.map(c=>c.ready));for(const c of children)c.child.send('go');const outcomes=await Promise.all(children.map(c=>c.done));
 for(const item of outcomes)assert.equal(item.code,0,item.err);const owned=outcomes.map(item=>JSON.parse(item.out)).filter(item=>!item.busy).sort((a,b)=>a.start-b.start);
 assert.ok(owned.length>=1);for(let i=1;i<owned.length;i++)assert.ok(owned[i].start>=owned[i-1].end);
 const data=createMemory({workspace,env}).read();assert.deepEqual(data.notes.map(n=>n.id).sort(),owned.map(n=>n.id).sort());
});

test('secret-like session and workspace names retain a valid opaque routing identity',()=>{
 const workspace=path.join(tmp(),'password=workspace-name');fs.mkdirSync(workspace);
 const memory=createMemory({workspace,env:{KODER_CLI_HOME:tmp()},name:'sk-synthetic-session-name',secrets:['workspace-name']});
 memory.transact(data=>memory.write({...data,notes:[{id:'note',text:'value workspace-name',at:1}]}));
 assert.equal(memory.read().notes[0].text,'value [redacted]');assert.equal(memory.read().revision,1);
});
