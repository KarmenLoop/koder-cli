// Separate bounded diagnostic; this does not relax the acceptance test.
import {loadRelease} from "./release.mjs";
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fork} from 'node:child_process';
import {tmp,cli,scripted,textStep} from './helpers.mjs';
import {fixtureEnv} from './windows-fixtures.mjs';
const {scriptedPrompter} = await loadRelease("src/prompter.mjs");
const {createMemory} = await loadRelease("src/memory.mjs");

function child(t,home,workspace,name){
 const proc=fork(new URL('./fixtures/multi-window-session.mjs',import.meta.url),[],{stdio:['ignore','pipe','pipe','ipc']});let stderr='',out='';proc.stderr.on('data',d=>stderr+=d);proc.stdout.on('data',d=>out+=d);
 const queue=[],waiters=[];proc.on('message',message=>{const waiter=waiters.shift();if(waiter)waiter(message);else queue.push(message);});
 const ended=new Promise(resolve=>proc.once('exit',(code,signal)=>resolve({code,signal,stderr,out})));
 async function next(type){let timer;const message=await Promise.race([queue.length?Promise.resolve(queue.shift()):new Promise(resolve=>waiters.push(resolve)),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('timeout '+type+' '+stderr)),7000);})]).finally(()=>clearTimeout(timer));if(type)assert.equal(message.type,type,JSON.stringify(message));console.log(JSON.stringify({probe:'session-phase',pid:proc.pid,type:message.type,at:Date.now()}));return message;}
 t.after(async()=>{if(proc.exitCode===null&&!proc.killed)proc.kill('SIGTERM');await ended;});proc.send({type:'init',home,workspace,name});return {proc,next,nextAny:()=>next(null),ended,send:message=>proc.send(message)};
}
const text=request=>request.messages.map(m=>m.content||'').join('\n');
async function turn(c,prompt){c.send({type:'turn',text:prompt});const request=await c.next('request');c.send({type:'allow'});assert.equal((await c.next('idle')).code,0);return request;}
async function close(c){c.send({type:'close'});await c.next('closed');assert.equal((await c.ended).code,0);}

test('DIAGNOSTIC ONLY, original 30-second gate unchanged: three simultaneous CLI windows isolate default task histories and keep their own idle continuity',{timeout:90000},async t=>{
 const home=tmp(),workspace=tmp();t.after(()=>{fs.rmSync(home,{recursive:true,force:true});fs.rmSync(workspace,{recursive:true,force:true});});
 const a=child(t,home,workspace);const first=await a.next('ready');assert.equal(first.info.session,'default');
 await turn(a,'Only this task knows CANARY_ALPHA_137.');
 const b=child(t,home,workspace),c=child(t,home,workspace);const ready=await Promise.all([b.next('ready'),c.next('ready')]);
 const names=[first.info.session,...ready.map(r=>r.info.session)];assert.equal(new Set(names).size,3);assert.ok(names.slice(1).every(n=>n.startsWith('window-')));
 for(const [i,item] of [a,b,c].entries())item.send({type:'turn',text:['Continue ALPHA_137','Only B knows CANARY_BETA_249.','Only C knows CANARY_GAMMA_351.'][i]});
 const requests=await Promise.all([a.next('request'),b.next('request'),c.next('request')]);
 assert.match(text(requests[0]),/CANARY_ALPHA_137/);assert.doesNotMatch(text(requests[1]),/CANARY_ALPHA_137|CANARY_GAMMA_351/);assert.doesNotMatch(text(requests[2]),/CANARY_ALPHA_137|CANARY_BETA_249/);
 for(const item of [a,b,c])item.send({type:'allow'});for(const item of [a,b,c])assert.equal((await item.next('idle')).code,0);
 for(const [i,item] of [a,b,c].entries()){const request=await turn(item,'Recall the previous task marker.');assert.match(text(request),new RegExp(['CANARY_ALPHA_137','CANARY_BETA_249','CANARY_GAMMA_351'][i]));for(const other of ['CANARY_ALPHA_137','CANARY_BETA_249','CANARY_GAMMA_351'].filter((_,n)=>n!==i))assert.ok(!text(request).includes(other));}
 await Promise.all([a,b,c].map(close));
 const resumed=child(t,home,workspace);assert.equal((await resumed.next('ready')).info.session,'default');assert.match(text(await turn(resumed,'Continue sequential default.')),/CANARY_ALPHA_137/);await close(resumed);
 const forked=child(t,home,workspace,names[1]);await forked.next('ready');assert.match(text(await turn(forked,'Continue named window.')),/CANARY_BETA_249/);await close(forked);
 assert.equal(fs.readdirSync(path.join(home,'memory/sessions')).filter(name=>name.endsWith('.active')||name.endsWith('.lock')).length,0);
});
