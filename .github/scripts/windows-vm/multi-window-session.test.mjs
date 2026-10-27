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
 async function next(type){let timer;const message=await Promise.race([queue.length?Promise.resolve(queue.shift()):new Promise(resolve=>waiters.push(resolve)),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('timeout '+type+' '+stderr)),7000);})]).finally(()=>clearTimeout(timer));if(type)assert.equal(message.type,type,JSON.stringify(message));return message;}
 t.after(async()=>{if(proc.exitCode===null&&!proc.killed)proc.kill('SIGTERM');await ended;});proc.send({type:'init',home,workspace,name});return {proc,next,nextAny:()=>next(null),ended,send:message=>proc.send(message)};
}
const text=request=>request.messages.map(m=>m.content||'').join('\n');
async function turn(c,prompt){c.send({type:'turn',text:prompt});const request=await c.next('request');c.send({type:'allow'});assert.equal((await c.next('idle')).code,0);return request;}
async function close(c){c.send({type:'close'});await c.next('closed');assert.equal((await c.ended).code,0);}

test('three simultaneous CLI windows isolate default task histories and keep their own idle continuity',{timeout:30000},async t=>{
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
test('explicit same-session contention fails before reading history; other workspaces stay independent',{timeout:25000},async t=>{
 const home=tmp(),wa=tmp(),wb=tmp();t.after(()=>{for(const p of [home,wa,wb])fs.rmSync(p,{recursive:true,force:true});});
 const a=child(t,home,wa,'named');await a.next('ready');await turn(a,'PRIVATE_NAMED_643');
 const rejected=child(t,home,wa,'named');assert.equal((await rejected.next('error')).code,'MEMORY_BUSY');assert.equal((await rejected.ended).code,0);
 const b=child(t,home,wb,'named');await b.next('ready');assert.ok(!text(await turn(b,'New workspace.')).includes('PRIVATE_NAMED_643'));await close(b);await close(a);
 const next=child(t,home,wa,'named');await next.next('ready');assert.match(text(await turn(next,'Sequential named resume.')),/PRIVATE_NAMED_643/);await close(next);
});
test('dead session-owner leases recover committed history without auto-replaying actions',{timeout:15000},async t=>{
 const home=tmp(),workspace=tmp();t.after(()=>{fs.rmSync(home,{recursive:true,force:true});fs.rmSync(workspace,{recursive:true,force:true});});
 const a=child(t,home,workspace);await a.next('ready');await turn(a,'CRASH_MARKER_872');a.proc.kill('SIGTERM');await a.ended;
 const b=child(t,home,workspace);assert.equal((await b.next('ready')).info.session,'default');const request=await turn(b,'Review the previous state only.');assert.match(text(request),/CRASH_MARKER_872/);await close(b);
});
test('cancelling one window releases its turn lock without releasing another live window owner',{timeout:20000},async t=>{
 const home=tmp(),workspace=tmp();t.after(()=>{fs.rmSync(home,{recursive:true,force:true});fs.rmSync(workspace,{recursive:true,force:true});});
 const a=child(t,home,workspace);await a.next('ready');await turn(a,'PRIMARY_WINDOW_765');const b=child(t,home,workspace);const ready=await b.next('ready');assert.match(ready.info.session,/^window-/);
 b.send({type:'turn',text:'Wait for this synthetic request.'});await b.next('request');b.send({type:'cancel'});
 const events=[await b.nextAny(),await b.nextAny()];assert.deepEqual(events.map(e=>e.type).sort(),['cancelled','idle']);
 await close(b);const conflict=child(t,home,workspace,'default');assert.equal((await conflict.next('error')).code,'MEMORY_BUSY');await conflict.ended;
 assert.match(text(await turn(a,'Continue only my task.')),/PRIMARY_WINDOW_765/);await close(a);
});

const jsonRows=out=>out.split('\n').filter(line=>line.startsWith('{')).map(line=>JSON.parse(line));
test('a fresh chat reserves an independent identity before /new and memory menus can read or clear default',{timeout:20000},async t=>{
 const home=tmp(),workspace=tmp();t.after(()=>{for(const p of [home,workspace])fs.rmSync(p,{recursive:true,force:true});});
 const a=child(t,home,workspace);await a.next('ready');await turn(a,'FIRST_WINDOW_MENU_CANARY_831');
 const memory=createMemory({workspace,env:fixtureEnv(home)}),before=fs.readFileSync(memory.file,'utf8');
 const provider=scripted([textStep('SECOND_WINDOW_REPLY')]);
 const result=await cli(['chat','--no-anim'],{home,cwd:workspace,provider,env:{KODER_AUTO_UPDATE:'0'},io:{prompter:scriptedPrompter(['/memory show --json','/new','/mode plan','Second window task.','/memory show --json','/new','/memory show --json','/exit'])}});
 assert.equal(result.code,0,result.err);assert.match(result.err,/SESSION_ISOLATED/);const rows=jsonRows(result.out).filter(row=>row.session);
 assert.equal(rows.length,3,result.out);assert.match(rows[0].session,/^window-/);assert.equal(rows[0].messages,0);assert.ok(rows[1].messages>=2);assert.equal(rows[2].messages,0);assert.equal(new Set(rows.map(row=>row.session)).size,1);
 assert.equal(provider.calls.length,1);assert.doesNotMatch(text(provider.calls[0]),/FIRST_WINDOW_MENU_CANARY_831/);assert.equal(fs.readFileSync(memory.file,'utf8'),before,'the other idle window is unchanged');
 await close(a);assert.equal(fs.readdirSync(path.join(home,'memory/sessions')).filter(n=>n.endsWith('.active')||n.endsWith('.lock')).length,0);
});
test('standalone memory commands and explicit chat cannot read or mutate an active foreign session',{timeout:20000},async t=>{
 const home=tmp(),workspace=tmp();t.after(()=>{for(const p of [home,workspace])fs.rmSync(p,{recursive:true,force:true});});
 assert.equal((await cli(['memory','add','GLOBAL_NOTE_TO_PRESERVE'],{home,cwd:workspace})).code,0);
 const a=child(t,home,workspace);await a.next('ready');await turn(a,'BUSY_DEFAULT_PRESERVE_579');
 const memory=createMemory({workspace,env:fixtureEnv(home)}),before=fs.readFileSync(memory.file,'utf8');
 for(const args of [['memory','show'],['memory','clear'],['memory','forget'],['chat','--session','default','--no-anim']]){
  const result=await cli(args,{home,cwd:workspace,env:{KODER_AUTO_UPDATE:'0'},io:{prompter:scriptedPrompter(['/new','/exit'])}});
  assert.notEqual(result.code,0,result.out);assert.match(result.err,/MEMORY_BUSY|另一个任务中使用/);assert.equal(fs.readFileSync(memory.file,'utf8'),before);
 }
 await close(a);
 const shown=await cli(['memory','show','--json'],{home,cwd:workspace});assert.equal(shown.code,0,shown.err);assert.ok(JSON.parse(shown.out).notes.some(note=>note.text==='GLOBAL_NOTE_TO_PRESERVE'));
 const search=await cli(['memory','search','GLOBAL_NOTE_TO_PRESERVE','--json'],{home,cwd:workspace});assert.equal(search.code,0,search.err);assert.ok(JSON.parse(search.out).shared.length>0,'busy forget must not retire shared notes before its owner check');
});
test('a forked chat keeps /project workspace selection and its memory namespace aligned',{timeout:20000},async t=>{
 const home=tmp(),workspace=tmp();t.after(()=>{for(const p of [home,workspace])fs.rmSync(p,{recursive:true,force:true});});
 const a=child(t,home,workspace);await a.next('ready');await turn(a,'ORIGINAL_PROJECT_WINDOW_462');
 const provider=scripted([textStep('NEW_PROJECT_REPLY')]);
 const result=await cli(['chat','--no-anim'],{home,cwd:workspace,provider,env:{KODER_AUTO_UPDATE:'0'},io:{prompter:scriptedPrompter(['/project new Parallel Project','/memory show --json','Continue the selected project.','/memory show --json','/exit'])}});
 assert.equal(result.code,0,result.err);const rows=jsonRows(result.out).filter(row=>row.session),expected=fs.realpathSync(path.join(home,'Koder Projects','Parallel Project'));
 assert.equal(rows.length,2,result.out);for(const row of rows){assert.equal(row.workspace,expected);assert.match(row.session,/^window-/);}assert.equal(rows[0].messages,0);assert.ok(rows[1].messages>=2);
 assert.equal(provider.calls.length,1);assert.doesNotMatch(text(provider.calls[0]),/ORIGINAL_PROJECT_WINDOW_462/);assert.match(text(await turn(a,'Continue original workspace.')),/ORIGINAL_PROJECT_WINDOW_462/);await close(a);
});
