import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fork} from 'node:child_process';
import {tmp,cli,scripted,textStep} from './helpers.mjs';
import {fixtureEnv} from './windows-fixtures.mjs';
import {createMemory} from '../src/memory.mjs';
import {scriptedPrompter} from '../src/prompter.mjs';
async function legacyOwner(t,home,workspace){
 const child=fork(new URL('./fixtures/legacy-session-owner.mjs',import.meta.url),[],{stdio:['ignore','pipe','pipe','ipc']});
 let stderr='';child.stderr.on('data',v=>stderr+=v);
 const ended=new Promise(r=>child.once('exit',(code,signal)=>r({code,signal,stderr})));
 t.after(async()=>{if(child.exitCode===null&&!child.killed)child.kill();await ended;});
 const ready=new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('legacy fixture not ready: '+stderr)),5000);child.once('message',m=>{clearTimeout(timer);resolve(m);});});
 child.send({home,workspace});assert.equal((await ready).type,'ready');return {child,ended};
}
for(const command of ['ask','chat'])test(`${command} starts a separate task when a legacy process holds only the turn lock`,{timeout:15000},async t=>{
 const home=tmp(),workspace=tmp();t.after(()=>{for(const p of [home,workspace])fs.rmSync(p,{recursive:true,force:true});});
 const owner=await legacyOwner(t,home,workspace),memory=createMemory({workspace,env:fixtureEnv(home)}),before=fs.readFileSync(memory.file,'utf8');
 const provider=scripted([textStep('NEW_TASK_FINISHED')]);
 const result=await cli(command==='chat'?['chat','--no-anim']:['ask','Do my independent task.'],{home,cwd:workspace,provider,env:{KODER_AUTO_UPDATE:'0'},io:command==='chat'?{prompter:scriptedPrompter(['Do my independent task.','/exit'])}: {}});
 assert.equal(provider.calls.length,1,result.err+'\n'+result.out);assert.equal(result.code,0,result.err);
 assert.match(result.out,/NEW_TASK_FINISHED/);assert.doesNotMatch(JSON.stringify(provider.calls),/PRIVATE_LEGACY_TASK/);assert.doesNotMatch(result.err+result.out,/MEMORY_BUSY/);
 assert.equal(fs.readFileSync(memory.file,'utf8'),before);owner.child.send('close');assert.equal((await owner.ended).code,0);
});

test('a previous Koder process instance cannot keep a recycled current PID busy',()=>{
 const home=tmp(),workspace=tmp();try{
  const memory=createMemory({workspace,env:fixtureEnv(home)}),active=memory.file.replace(/\.json$/,'.active');
  fs.writeFileSync(active,JSON.stringify({pid:process.pid,instance:'12345678-1234-4234-8234-123456789012',token:'87654321-4321-4321-8321-210987654321'}));
  const release=memory.acquireSession();release();assert.equal(fs.existsSync(active),false);
 }finally{for(const p of [home,workspace])fs.rmSync(p,{recursive:true,force:true});}
});
test('a legacy owner with a still-live PID is never guessed stale',()=>{
 const home=tmp(),workspace=tmp();try{
  const memory=createMemory({workspace,env:fixtureEnv(home)}),active=memory.file.replace(/\.json$/,'.active');
  const owner=JSON.stringify({pid:process.pid,token:'87654321-4321-4321-8321-210987654321'});fs.writeFileSync(active,owner);
  assert.throws(()=>memory.acquireSession(),{code:'MEMORY_BUSY'});assert.equal(fs.readFileSync(active,'utf8'),owner);
 }finally{for(const p of [home,workspace])fs.rmSync(p,{recursive:true,force:true});}
});
