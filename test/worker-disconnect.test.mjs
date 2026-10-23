import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {tmp} from './helpers.mjs';
import {fixtureEnv} from './windows-fixtures.mjs';
import {writeAcceptance} from '../src/eula.mjs';
import {createMemory} from '../src/memory.mjs';
import {kernelRoot} from '../src/agent.mjs';
const source=fileURLToPath(new URL('..',import.meta.url));
async function until(predicate,ms=8000){const end=Date.now()+ms;while(Date.now()<end){if(await predicate())return;await new Promise(r=>setTimeout(r,20));}throw Error('Condition timed out');}
async function ownedWorker(t,{boot=true,args=['chat','--no-anim','--session','orphan-owned'],prepare=null}={}){
 const home=tmp('koder-owned-orphan-');
 const env={...fixtureEnv(home),CI:'1',NO_COLOR:'1',NODE_USE_ENV_PROXY:'0',KODER_AUTO_UPDATE:'0',KODER_CLI_WORKER:'1',KODER_CLI_SUPERVISOR_PID:String(process.pid),KODER_DESKTOP_ROOT:kernelRoot()};
 writeAcceptance(env);
 const entry=prepare?.(home)||path.join(source,'bin/koder.mjs');
 const p=spawn(process.execPath,[entry,...args],{env,cwd:home,stdio:['pipe','pipe','pipe','ipc']});
 let output='',hello=false,ready=false,closed=false,handoff=false;
 p.stdout.on('data',x=>output+=x);p.stderr.on('data',x=>output+=x);
 const done=new Promise((resolve,reject)=>{p.once('error',reject);p.once('exit',(code,signal)=>{closed=true;resolve({code,signal});});});
 p.on('message',m=>{if(m.type==='koder:hello'){hello=true;if(boot)p.send({type:'koder:boot',resume:null});}if(m.type==='koder:ready')ready=true;if(m.type==='koder:restart')handoff=true;});
 t.after(async()=>{
  if(!closed){p.stdin.end('/exit\n');if(p.connected)p.send({type:'koder:stop'});await Promise.race([done,new Promise(r=>setTimeout(r,1000))]);}
  if(!closed){p.kill('SIGTERM');await Promise.race([done,new Promise(r=>setTimeout(r,1000))]);}
  if(!closed){p.kill('SIGKILL');await done;}
  p.stdin.destroy();p.stdout.destroy();p.stderr.destroy();
  fs.rmSync(home,{recursive:true,force:true});
 });
 return {p,env,home,done,output:()=>output,hello:()=>hello,ready:()=>ready,closed:()=>closed,handoff:()=>handoff};
}
test('real chat worker releases its named session after IPC loss while stdin remains open',async t=>{
 const f=await ownedWorker(t);await until(()=>f.ready());
 const memory=createMemory({workspace:f.home,env:f.env,name:'orphan-owned'});
 await until(()=>fs.existsSync(memory.file.replace(/\.json$/,'.active')));
 assert.throws(()=>memory.acquireSession(),{code:'MEMORY_BUSY'});
 assert.equal(f.p.stdin.writableEnded,false);
 const started=performance.now();f.p.disconnect();
 await until(()=>f.closed(),5000);
 assert.ok(performance.now()-started<5000);
 assert.equal((await f.done).code,0,f.output());
 assert.equal(f.p.stdin.writableEnded,false,'the test never supplies EOF to stop the worker');
 assert.equal(fs.existsSync(memory.file.replace(/\.json$/,'.active')),false,'cooperative chat cleanup removes its owned lease');
 const release=memory.acquireSession();release();
 assert.doesNotMatch(f.output(),/UPDATE_WORKER_STOP_TIMEOUT|UPDATE_HANDOFF_NOT_ACKNOWLEDGED/);
});
test('IPC loss before boot does not leave the 15-second startup waiter alive',async t=>{
 const f=await ownedWorker(t,{boot:false,args:['version']});await until(()=>f.hello());
 f.p.disconnect();await until(()=>f.closed(),1500);
 assert.doesNotMatch(f.output(),/UPDATE_SUPERVISOR_UNAVAILABLE/);
});

function handoffFixture(home){
 const fixture=path.join(home,'lifecycle-fixture');fs.mkdirSync(fixture);
 for(const file of ['process-lifecycle.mjs','network-bootstrap.mjs'])fs.copyFileSync(path.join(source,'src',file),path.join(fixture,file));
 fs.writeFileSync(path.join(fixture,'cli.mjs'),`export const VERSION='0.0.1';export async function runCli(args,io){await io.onReady();return 0;}`);
 fs.writeFileSync(path.join(fixture,'update-lifecycle.mjs'),`export function createRestartController(){return {pending:{version:'0.0.2',entry:'owned-test-only'},resume:{argv:['version']},close(){}}}`);
 const entry=path.join(fixture,'entry.mjs');
 fs.writeFileSync(entry,`import {runWorker} from './process-lifecycle.mjs';try{process.exitCode=await runWorker(['version']);}catch(e){process.stderr.write(e.message+'\\n');process.exitCode=1;if(process.connected)process.disconnect();}`);
 return entry;
}
test('lifecycle handoff disconnect clears acknowledgement timer instead of leaving a 15-second waiter',async t=>{
 const f=await ownedWorker(t,{prepare:handoffFixture});await until(()=>f.handoff());
 f.p.disconnect();await until(()=>f.closed(),1500);
 assert.doesNotMatch(f.output(),/UPDATE_HANDOFF_NOT_ACKNOWLEDGED/);assert.equal((await f.done).code,1);
});
test('normal handoff acknowledgement still returns restart code 75',async t=>{
 const f=await ownedWorker(t,{prepare:handoffFixture});await until(()=>f.handoff());
 f.p.send({type:'koder:accepted'});await until(()=>f.closed(),1500);
 assert.equal((await f.done).code,75,f.output());
});
test('an already-lost IPC owner is noticed before boot even if disconnect preceded runWorker',async t=>{
 const f=await ownedWorker(t,{prepare(home){
  const entry=path.join(home,'delayed-entry.mjs');
  fs.writeFileSync(entry,`import {setTimeout} from 'node:timers/promises';await setTimeout(200);const {runWorker}=await import(${JSON.stringify(new URL('../src/process-lifecycle.mjs',import.meta.url).href)});try{process.exitCode=await runWorker(['version']);}catch(e){process.stderr.write(e.message+'\\n');process.exitCode=1;}`);
  return entry;
 }});
 f.p.disconnect();await until(()=>f.closed(),1500);assert.equal(f.hello(),false);
 assert.doesNotMatch(f.output(),/UPDATE_SUPERVISOR_UNAVAILABLE/);
});

test('IPC loss cancels a running request through the existing session and releases its lease',async t=>{
 let requestArrived=false,requestClosed=false;
 const server=http.createServer((req,res)=>{req.resume();req.on('end',()=>{requestArrived=true;});res.on('close',()=>{requestClosed=true;});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 t.after(()=>new Promise(r=>{server.closeAllConnections();server.close(r);}));
 const f=await ownedWorker(t,{args:['chat','--no-anim','--session','orphan-owned','--provider','owned-provider.json'],prepare(home){
  fs.writeFileSync(path.join(home,'owned-provider.json'),JSON.stringify({baseUrl:'http://127.0.0.1:'+server.address().port+'/v1',model:'owned-fixture',auth:'none',contextWindow:64000}));
 }});
 await until(()=>f.ready());
 const memory=createMemory({workspace:f.home,env:f.env,name:'orphan-owned'});
 f.p.stdin.write('Run the owned synthetic request.\n');await until(()=>requestArrived);
 assert.throws(()=>memory.acquireSession(),{code:'MEMORY_BUSY'});
 f.p.disconnect();await until(()=>f.closed(),5000);
 assert.equal((await f.done).code,0,f.output());
 assert.equal(fs.existsSync(memory.file.replace(/\.json$/,'.active')),false);
 await until(()=>requestClosed,1000);
});
