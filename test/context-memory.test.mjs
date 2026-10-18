import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {PassThrough} from 'node:stream';
import test from 'node:test';
import {createContext} from '../src/cli.mjs';
import {createSession} from '../src/session.mjs';
import {createGateway} from '../src/gateway/core.mjs';
import {cli,scripted,textStep,tmp} from './helpers.mjs';

const textOf=messages=>messages.map(m=>m.content||'').join('\n');
function context(home,workspace,model){return createContext({command:'run',argv:[],opts:{},positionals:[],io:{providerOverride:model,env:{KODER_CLI_HOME:home,NO_COLOR:'1'},stdin:new PassThrough(),stdout:new PassThrough(),stderr:new PassThrough(),cwd:workspace}});}
function gateway(ctx,workspace){return createGateway(ctx,{config:{workspace,interaction:'ask',approvalTimeoutSec:2,moa:false,platforms:{fake:{dmPolicy:'open'}}}});}
const message=(text,chatId='chat-1',userId='user-1')=>({platform:'fake',chatId,userId,text,isGroup:false,mentioned:true,reply:async()=>{}});

test('separate CLI invocations in the same workspace recall the previous task',async()=>{
 const home=tmp(),workspace=tmp();
 await cli(['ask','Project codename is ORCHID-739. Keep the API unchanged.','-w',workspace],{home,provider:scripted([textStep('noted')])});
 const model=scripted([({messages})=>textStep(textOf(messages).includes('ORCHID-739')?'remembered':'forgotten')]);
 const result=await cli(['ask','What is the codename?','-w',workspace],{home,provider:model});
 assert.equal(result.code,0,result.err);assert.match(result.out,/remembered/);
 assert.ok(model.calls[0].messages.some(m=>m.role==='assistant'&&m.content==='noted'));
});
test('rebuilding a session after changing modes retains its context',async()=>{
 const home=tmp(),workspace=tmp();const ctx=context(home,workspace,scripted([textStep('okay')]));
 const first=await createSession(ctx,{workspace});await first.turn('Remember: the release branch is orchid-release.');
 const model=scripted([textStep('continued')]);ctx.io.providerOverride=model;
 const rebuilt=await createSession(ctx,{workspace,mode:'code'});await rebuilt.turn('Continue the same task.');
 assert.match(textOf(model.calls[0].messages),/orchid-release/);
});
test('long conversations retain original constraints through bounded carry-over',async()=>{
 const home=tmp(),workspace=tmp();const model=scripted([textStep('understood')]);model.contextWindow=8192;model.maxOutput=1024;
 const session=await createSession(context(home,workspace,model),{workspace});
 await session.turn('Task marker ORCHID-739: edit only config.ts, preserve public API.');
 for(let i=0;i<12;i++)await session.turn(`Step ${i}: ${'中间检查结果没有改变原目标。'.repeat(80)}`);
 assert.match(textOf(model.calls.at(-1).messages),/ORCHID-739/);
 assert.match(textOf(model.calls.at(-1).messages),/preserve public API/);
 assert.ok(session.thread.usage.dropped>0,'must actually exercise history compaction');
});
test('gateway restart restores the same chat context',async()=>{
 const home=tmp(),workspace=tmp();const ctx=context(home,workspace,scripted([textStep('noted')]));
 const first=gateway(ctx,workspace);await first.receive(message('Project marker is GATEWAY-812.'));await first.stop();
 const model=scripted([textStep('continued')]);ctx.io.providerOverride=model;
 const next=gateway(ctx,workspace);await next.receive(message('Continue our project.'));await next.stop();
 assert.match(textOf(model.calls[0].messages),/GATEWAY-812/);
});
test('different workspaces do not load each other\'s context',async()=>{
 const home=tmp(),a=tmp(),b=tmp();await cli(['ask','Only project A knows PRIVATE-A','-w',a],{home,provider:scripted([textStep('noted')])});
 const model=scripted([textStep('B')]);await cli(['ask','Start project B','-w',b],{home,provider:model});
 assert.doesNotMatch(textOf(model.calls[0].messages),/PRIVATE-A/);
});

test('named sessions, --new and --no-memory do not accidentally reuse history',async()=>{
 const home=tmp(),workspace=tmp();const ask=async(args,provider)=>cli(['ask',...args,'-w',workspace],{home,provider});
 await ask(['Alpha marker ALPHA-199','--session','alpha'],scripted([textStep('noted')]));
 const beta=scripted([textStep('B')]);await ask(['Hello beta','--session','beta'],beta);assert.doesNotMatch(textOf(beta.calls[0].messages),/ALPHA-199/);
 const alpha=scripted([textStep('A')]);await ask(['Continue alpha','--session','alpha'],alpha);assert.match(textOf(alpha.calls[0].messages),/ALPHA-199/);
 const fresh=scripted([textStep('new')]);await ask(['Start fresh','--session','alpha','--new'],fresh);assert.doesNotMatch(textOf(fresh.calls[0].messages),/ALPHA-199/);
 const privateHome=tmp();await cli(['ask','Private marker','--no-memory','-w',workspace],{home:privateHome,provider:scripted([textStep('ok')])});assert.equal(fs.existsSync(path.join(privateHome,'memory')),false);
});
test('explicit remembered notes survive new conversations, can be searched and removed',async()=>{
 const home=tmp(),workspace=tmp();const args=['-w',workspace,'--session','alpha'];
 const added=await cli(['memory','add','Use pnpm and keep the public API stable.',...args],{home});assert.equal(added.code,0,added.err);
 const shown=await cli(['memory','show','--json',...args],{home});const data=JSON.parse(shown.out);assert.equal(data.notes.length,1);
 await cli(['memory','clear',...args],{home});
 const model=scripted([textStep('okay')]);await cli(['ask','Continue','-w',workspace,'--session','alpha'],{home,provider:model});assert.match(textOf(model.calls[0].messages),/Use pnpm/);
 const search=await cli(['memory','search','Continue',...args],{home});assert.match(search.out,/Continue/);
 await cli(['memory','remove',data.notes[0].id,...args],{home});
 const empty=await cli(['memory','show','--json',...args],{home});assert.equal(JSON.parse(empty.out).notes.length,0);
});
test('normal turns never claim a previous interruption',async()=>{
 const home=tmp(),workspace=tmp(),model=scripted([textStep('okay')]);
 const session=await createSession(context(home,workspace,model),{workspace});
 await session.turn('First');await session.turn('Second');
 assert.doesNotMatch(textOf(model.calls[0].messages),/上次会话未正常结束/);assert.doesNotMatch(textOf(model.calls[1].messages),/上次会话未正常结束/);
});
test('gateway histories are isolated by chat, user and binding',async()=>{
 const home=tmp(),workspace=tmp(),model=scripted([textStep('okay')]);const ctx=context(home,workspace,model);
 const hub=gateway(ctx,workspace);await hub.receive(message('ONLY-ALICE-981','same-group','alice'));await hub.receive(message('Hello','same-group','bob'));assert.doesNotMatch(textOf(model.calls.at(-1).messages),/ONLY-ALICE-981/);
 await hub.receive(message('Hello','different-chat','alice'));assert.doesNotMatch(textOf(model.calls.at(-1).messages),/ONLY-ALICE-981/);
 await hub.receive(message('Continue','same-group','alice'));assert.match(textOf(model.calls.at(-1).messages),/ONLY-ALICE-981/);await hub.stop();
 const rebound=createGateway(ctx,{config:{workspace,interaction:'ask',approvalTimeoutSec:2,moa:false,platforms:{fake:{dmPolicy:'open',botId:'another-bot'}}}});
 await rebound.receive(message('Hello','same-group','alice'));assert.doesNotMatch(textOf(model.calls.at(-1).messages),/ONLY-ALICE-981/);await rebound.stop();
});
test('gateway /new before first post-restart turn clears the stored chat',async()=>{
 const home=tmp(),workspace=tmp(),model=scripted([textStep('okay')]),ctx=context(home,workspace,model);
 const first=gateway(ctx,workspace);await first.receive(message('DELETE-OLD-472'));await first.stop();
 const next=gateway(ctx,workspace);await next.receive(message('/new'));await next.receive(message('Fresh start'));assert.doesNotMatch(textOf(model.calls.at(-1).messages),/DELETE-OLD-472/);await next.stop();
});

test('chat /memory operates on its named session, including clear',async()=>{
 const home=tmp(),workspace=tmp();let lines=['/memory add ALPHA-SLASH-443','/memory show','/memory clear','/exit'];
 const result=await cli(['chat','--session','alpha','-w',workspace],{home,provider:scripted([textStep('okay')]),io:{prompter:{ask:async()=>lines.shift()??null}}});
 assert.equal(result.code,0,result.err);assert.match(result.out,/ALPHA-SLASH-443/);
 const alpha=await cli(['memory','show','--json','--session','alpha','-w',workspace],{home});
 const normal=await cli(['memory','show','--json','-w',workspace],{home});
 assert.equal(JSON.parse(alpha.out).notes[0].text,'ALPHA-SLASH-443');assert.equal(JSON.parse(normal.out).notes.length,0);
});

test('interrupted history restores no approval, queue or executable tool state',async()=>{
 const {createMemory}=await import('../src/memory.mjs');const {mockModel}=await import('./helpers.mjs');
 const home=tmp(),workspace=tmp(),memory=createMemory({workspace,env:{KODER_CLI_HOME:home}});const id='22222222-2222-4222-8222-222222222222';
 memory.transact(data=>memory.write({...data,interrupted:true,conversation:{id,title:'interrupted',createdAt:1,messages:[{id,role:'user',content:'Create never-replay.txt',at:1},{id:'33333333-3333-4333-8333-333333333333',role:'assistant',content:'',toolCalls:[{id:'old-write',name:'write_file',arguments:{path:'never-replay.txt',content:'bad'}}],at:2}]},approvals:[{status:'allowed'}],queue:[{text:'untrusted queued work'}],inflight:{index:0}}));
 const server=await mockModel([textStep('ready')]);
 try{
  const result=await cli(['run','Check current status; do not repeat old work.','-w',workspace],{home,env:{KODER_MODEL:'fixture',KODER_BASE_URL:server.url,KODER_AUTH:'none',KODER_CONTEXT_WINDOW:'32768'}});
  assert.equal(result.code,0,result.err);assert.equal(fs.existsSync(path.join(workspace,'never-replay.txt')),false);assert.equal(server.requests.length,1);
  const input=server.requests[0].body.messages;assert.match(textOf(input),/上次会话未正常结束/);assert.match(input.find(m=>m.role==='tool').content,/TOOL_RESULT_UNCONFIRMED/);assert.doesNotMatch(textOf(input),/untrusted queued work/);
  const saved=memory.read();assert.equal(saved.interrupted,false);assert.equal(saved.approvals,undefined);assert.equal(saved.inflight,undefined);assert.equal(saved.queue,undefined);
 }finally{await server.close();}
});

test('gateway /new during approval cancels the old turn and clears its context',async()=>{
 const {toolStep}=await import('./helpers.mjs');const {until}=await import('./ws-server.mjs');const home=tmp(),workspace=tmp(),replies=[];
 const model=scripted([toolStep('write_file',{path:'old.txt',content:'bad'}),textStep('fresh')]);const ctx=context(home,workspace,model);
 const hub=createGateway(ctx,{config:{workspace,interaction:'agent',approvalTimeoutSec:2,moa:false,platforms:{fake:{dmPolicy:'open'}}}});
 const first=hub.receive({...message('OLD-PENDING-419: write old.txt'),reply:async text=>replies.push(text)});
 await until(()=>replies.length>0);
 await hub.receive(message('/new'));await first;
 await hub.receive(message('Start a different task.'));
 assert.equal(fs.existsSync(path.join(workspace,'old.txt')),false);assert.doesNotMatch(textOf(model.calls.at(-1).messages),/OLD-PENDING-419/);await hub.stop();
});

test('forget deletes this session notes and archived history, leaving other named sessions intact',async()=>{
 const home=tmp(),workspace=tmp(),base=['-w',workspace];
 await cli(['ask','HISTORY-FORGET-448',...base],{home,provider:scripted([textStep('ack')])});await cli(['memory','clear',...base],{home});
 await cli(['memory','add','Other session note','--session','other',...base],{home});
 await cli(['memory','add','Remove this note',...base],{home});const result=await cli(['memory','forget',...base],{home});assert.equal(result.code,0,result.err);
 const shown=JSON.parse((await cli(['memory','show','--json',...base],{home})).out);assert.equal(shown.messages,0);assert.equal(shown.notes.length,0);
 const other=JSON.parse((await cli(['memory','show','--json','--session','other',...base],{home})).out);assert.equal(other.notes.length,1);
 const archive=path.join(home,'memory','archive');assert.equal(fs.readdirSync(archive).length,0);
});

test('credential rotation for the same known bot retains its own history',async()=>{
 const home=tmp(),workspace=tmp(),model=scripted([textStep('ack')]),ctx=context(home,workspace,model);
 const make=token=>createGateway(ctx,{config:{workspace,interaction:'ask',approvalTimeoutSec:2,moa:false,platforms:{fake:{dmPolicy:'open',botId:'stable-bot',botSecret:token}}}});
 const a=make('fixture-old-secret');await a.receive(message('STABLE-BOT-908'));await a.stop();
 const b=make('fixture-new-secret');await b.receive(message('Continue'));assert.match(textOf(model.calls.at(-1).messages),/STABLE-BOT-908/);await b.stop();
});

test('gateway reset is a queue barrier while cancellation is still settling',async()=>{
 const home=tmp(),workspace=tmp(),ctx=context(home,workspace,scripted([textStep('unused')]));let releaseOld,releaseCancel,cancelling;const calls=[];
 const oldDone=new Promise(r=>releaseOld=r),cancelDone=new Promise(r=>releaseCancel=r),cancelStarted=new Promise(r=>cancelling=r);
 const session={turn:async text=>{calls.push(`turn:${text}`);if(text==='old')await oldDone;return {text:'ok'};},cancel:()=>{releaseOld();cancelling();return cancelDone;},reset:async()=>{calls.push('reset');}};
 const hub=createGateway(ctx,{config:{workspace,interaction:'ask',approvalTimeoutSec:2,moa:false,platforms:{fake:{dmPolicy:'open'}}},sessionFactory:async()=>session});
 const first=hub.receive(message('old'));await new Promise(r=>setTimeout(r,5));const reset=hub.receive(message('/new'));await cancelStarted;
 const second=hub.receive(message('new'));await new Promise(r=>setTimeout(r,5));releaseCancel();await Promise.all([first,reset,second]);
 assert.deepEqual(calls,['turn:old','reset','turn:new']);await hub.stop();
});
test('reset during first session initialization never runs the old prompt',async()=>{
 const home=tmp(),workspace=tmp(),ctx=context(home,workspace,scripted([textStep('unused')]));let finishInit,startInit;const ready=new Promise(r=>startInit=r),initializing=new Promise(r=>finishInit=r),calls=[];
 const session={turn:async text=>{calls.push(`turn:${text}`);return {text:'ok'};},cancel:async()=>{},reset:async()=>{calls.push('reset');}};
 const hub=createGateway(ctx,{config:{workspace,interaction:'ask',approvalTimeoutSec:2,moa:false,platforms:{fake:{dmPolicy:'open'}}},sessionFactory:async()=>{startInit();await initializing;return session;}});
 const old=hub.receive(message('old'));await ready;const reset=hub.receive(message('/new'));finishInit();await Promise.all([old,reset]);assert.deepEqual(calls,['reset']);await hub.stop();
});
