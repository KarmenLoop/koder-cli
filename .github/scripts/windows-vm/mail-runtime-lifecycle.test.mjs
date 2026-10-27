import {loadRelease} from "./release.mjs";
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import net from 'node:net';
import {once} from 'node:events';
import {spawn,spawnSync} from 'node:child_process';
const {openMail,closeMail,watchMail,runMailProactiveTick} = await loadRelease("src/mail-runtime.mjs");
import {tmp} from './helpers.mjs';
import {fixtureEnv} from './windows-fixtures.mjs';
const {saveConfig} = await loadRelease("src/config.mjs");
const {importKernel,kernelRoot} = await loadRelease("src/agent.mjs");
import {pathToFileURL} from 'node:url';
const {writeState} = await loadRelease("src/agentd/state.mjs");
const {channel} = await loadRelease("src/agentd/wire.mjs");

function context(t,session='') {
 const home=fs.realpathSync(tmp());
 t.after(()=>fs.rmSync(home,{recursive:true,force:true}));
 const ctx={env:fixtureEnv(home),lang:'en',stderr:{write(){}},io:{agentdSessionId:session,memoryAccount:{async currentIdentity(){return null;},isCurrentKnown(){return true;}},mailCredentials:{async read(){return {key:Buffer.alloc(32,7).toString('base64')};},async write(){assert.fail('The synthetic protected key already exists');},availability(){return {mode:'protected',nativeVerified:true};}},mailTransport:{}}};
 t.after(()=>closeMail(ctx));return ctx;
}
async function settled(watch){for(let i=0;watch.busy&&i<1000;i++)await new Promise(r=>setTimeout(r,2));assert.equal(watch.busy,false);}

test('concurrent foreground mail opens share one initialized service and protected-key lease',async t=>{
 const ctx=context(t),opened=await Promise.all([openMail(ctx,{create:true}),openMail(ctx,{create:true}),openMail(ctx,{create:true})]);
 t.after(async()=>{for(const mail of opened)await mail.close();});
 assert.strictEqual(opened[1],opened[0]);assert.strictEqual(opened[2],opened[0]);
});

test('closing an already closed service cannot evict its replacement',async t=>{
 const ctx=context(t),first=await openMail(ctx,{create:true});await first.close();
 const replacement=await openMail(ctx,{create:true});await first.close();
 const current=await openMail(ctx,{create:true});t.after(()=>current.close());
 assert.strictEqual(current,replacement);
});

test('closing foreground mail leaves another session owner open',async t=>{
 const ctx=context(t),other={...ctx,io:{...ctx.io,agentdSessionId:'owned-daemon-session'}};
 const foreground=await openMail(ctx,{create:true}),daemon=await openMail(other,{create:true});
 t.after(()=>closeMail(other));assert.notStrictEqual(foreground,daemon);await closeMail(ctx);
 const current=await openMail(other,{create:true});assert.strictEqual(current,daemon);
});

test('interleaved success does not repeat the same STORAGE_BUSY warning during one watcher lifetime',async t=>{
 const ctx=context(t),notices=[];ctx.stderr.write=value=>notices.push(value);let attempt=0;
 ctx.io.mailAssistant={async poll(){if(attempt++%2===0)throw Object.assign(new Error('Synthetic busy storage'),{code:'STORAGE_BUSY'});return {fresh:[],inquiries:[]};}};
 const watch=watchMail(ctx,{intervalMs:60000});t.after(()=>watch.close());await settled(watch);
 await watch.tick();await watch.tick();await watch.tick();await watch.tick();await watch.close();
 assert.equal(attempt,5);assert.equal(notices.length,1);assert.match(notices[0],/STORAGE_BUSY/);
});

function mailboxDir(ctx){return path.join(ctx.env.KODER_CLI_HOME,'mail',crypto.createHash('sha256').update('local').digest('hex').slice(0,24));}
async function heldLease(ctx){
 const {withPrivateLease}=await importKernel('fusion/private-lease.mjs',ctx.env);let entered,release;
 const ready=new Promise(r=>entered=r),gate=new Promise(r=>release=r);
 const work=withPrivateLease(mailboxDir(ctx),'mail-operation',async()=>{entered();await gate;});await ready;
 return {async close(){release();await work;}};
}

test('foreground mail waits beyond the five-second acquisition window for a live poll to finish',async t=>{
 const ctx=context(t),mail=await openMail(ctx,{create:true}),held=await heldLease(ctx);t.after(()=>held.close());
 const release=setTimeout(()=>void held.close(),5250);t.after(()=>clearTimeout(release));
 assert.deepEqual(await mail.listNotices(),[]);
});

test('a busy automatic check yields without advancing notices or entering mail work',async t=>{
 const ctx=context(t),mail=await openMail(ctx,{create:true});ctx.io.mailAssistant=mail;
 const held=await heldLease(ctx);t.after(()=>held.close());
 const result=await runMailProactiveTick(ctx);
 assert.equal(result.skipped,'MAIL_CHECK_IN_PROGRESS');assert.deepEqual(result.fresh,[]);assert.deepEqual(result.inquiries,[]);
});

test('an aborted mail operation leaves a live lease untouched and does not wait five seconds',async t=>{
 const ctx=context(t),mail=await openMail(ctx,{create:true}),held=await heldLease(ctx);t.after(()=>held.close());
 const controller=new AbortController(),start=performance.now(),pending=mail.poll({signal:controller.signal});
 const abort=setTimeout(()=>controller.abort(),30);t.after(()=>clearTimeout(abort));
 await assert.rejects(pending,error=>error.name==='AbortError');assert(performance.now()-start<1000);
 assert.equal(fs.readdirSync(path.join(mailboxDir(ctx),'.private-locks')).length,1);
});

test('a crashed local lease is reclaimed while its original record remains exact',async t=>{
 const ctx=context(t),mail=await openMail(ctx,{create:true});
 const child=spawnSync(process.execPath,['-e',''],{env:ctx.env,encoding:'utf8'});assert.equal(child.status,0);
 const dir=path.join(mailboxDir(ctx),'.private-locks');fs.mkdirSync(dir,{recursive:true,mode:0o700});
 const file=path.join(dir,crypto.createHash('sha256').update('mail-operation').digest('hex')+'.lock');
 fs.writeFileSync(file,JSON.stringify({host:os.hostname(),pid:child.pid,token:crypto.randomUUID()}),{mode:0o600});
 assert.deepEqual(await mail.listNotices(),[]);assert.equal(fs.existsSync(file),false);
});

test('stale activated mail visibility without a daemon endpoint does not suppress foreground polling',async t=>{
 const ctx=context(t);saveConfig({agentd:{activated:true,visibility:{mail:true},proactive:{enabled:true}}},ctx.env);let polls=0;
 ctx.io.mailAssistant={async poll(){polls++;return {fresh:[],inquiries:[]};},async status(){return {policy:{proactiveInquiry:false}};}};
 const watch=watchMail(ctx,{intervalMs:60000});t.after(()=>watch.close());await settled(watch);await watch.close();assert.equal(polls,1);
});


test('closeMail waits for an in-flight initialization and does not leave an orphan service',async t=>{
 const ctx=context(t);let entered,release,reads=0;
 const ready=new Promise(r=>entered=r),gate=new Promise(r=>release=r),originalRead=ctx.io.mailCredentials.read;
 ctx.io.mailCredentials.read=async()=>{if(reads++===0){entered();await gate;}return originalRead();};
 const opening=openMail(ctx,{create:true});await ready;
 let closed=false;const closing=closeMail(ctx).then(()=>{closed=true;});await new Promise(r=>setImmediate(r));assert.equal(closed,false);
 release();const previous=await opening;await closing;await assert.rejects(previous.status(),{code:'MAIL_ACCOUNT_CHANGED'});
 const current=await openMail(ctx,{create:true});assert.notStrictEqual(current,previous);
});

test('STORAGE_BUSY raised after mail work enters is not retried',async t=>{
 const ctx=context(t);let confirmations=0,sends=0;
 ctx.io.mailTransport={async imapCheck(){},async smtpCheck(){},async smtpSend(){sends++;assert.fail('No submission after failed confirmation');}};
 ctx.io.mailConfirm=async()=>{confirmations++;throw Object.assign(new Error('Synthetic busy result inside mail work'),{code:'STORAGE_BUSY'});};
 const mail=await openMail(ctx,{create:true});
 await mail.connect({providerId:'custom',user:'sender@example.test',password:'synthetic-password',custom:{host:'imap.example.test',smtpHost:'smtp.example.test'}});
 await assert.rejects(mail.send({to:'recipient@example.test',subject:'Owned synthetic draft',text:'No network send'}),{code:'STORAGE_BUSY'});
 assert.equal(confirmations,1);assert.equal(sends,0);
});

async function daemonEndpoint(t,ctx,status) {
 const token='a'.repeat(64),instance='owned-daemon-instance',sockets=new Set(),requests=[];
 const server=net.createServer(socket=>{sockets.add(socket);socket.once('close',()=>sockets.delete(socket));const wire=channel(socket,msg=>{requests.push(msg.type);if(msg.type==='hello'){assert.equal(msg.token,token);wire.send({id:msg.id,value:{protocol:1,instance}});}else if(msg.type==='status')wire.send({id:msg.id,value:status});else assert.fail('Ownership probe must remain read-only');});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 t.after(async()=>{for(const socket of sockets)socket.destroy();await new Promise(r=>server.close(r));});
 writeState(ctx.env,'endpoint',{host:'127.0.0.1',port:server.address().port,token,instance,pid:process.pid});return requests;
}
function pollingStub(ctx){let polls=0;ctx.io.mailAssistant={async poll(){polls++;return {fresh:[],inquiries:[]};},async status(){return {policy:{proactiveInquiry:false}};}};return ()=>polls;}

test('an authenticated live daemon retains mail ownership even before its first successful check',async t=>{
 const ctx=context(t);saveConfig({agentd:{activated:true,visibility:{mail:true},proactive:{enabled:true}}},ctx.env);
 const polls=pollingStub(ctx),requests=await daemonEndpoint(t,ctx,{running:true,activated:true,visibility:{mail:true},lastMailSuccess:null,lastMailError:'NETWORK'});
 const watch=watchMail(ctx,{intervalMs:60000});t.after(()=>watch.close());await settled(watch);await watch.close();
 assert.equal(polls(),0);assert.deepEqual(requests,['hello','status']);
});

test('an authenticated stopped daemon yields mail ownership to the foreground',async t=>{
 const ctx=context(t);saveConfig({agentd:{activated:true,visibility:{mail:true},proactive:{enabled:true}}},ctx.env);
 const polls=pollingStub(ctx);await daemonEndpoint(t,ctx,{running:false,activated:true,visibility:{mail:true}});
 const watch=watchMail(ctx,{intervalMs:60000});t.after(()=>watch.close());await settled(watch);await watch.close();assert.equal(polls(),1);
});

test('a live daemon PID with an unreachable endpoint is visible and is not treated as a dead owner',async t=>{
 const ctx=context(t);saveConfig({agentd:{activated:true,visibility:{mail:true},proactive:{enabled:true}}},ctx.env);
 const probe=net.createServer();await new Promise(r=>probe.listen(0,'127.0.0.1',r));const port=probe.address().port;await new Promise(r=>probe.close(r));
 writeState(ctx.env,'endpoint',{host:'127.0.0.1',port,token:'a'.repeat(64),instance:'owned-unreachable',pid:process.pid});
 const polls=pollingStub(ctx),errors=[];ctx.stderr.write=s=>errors.push(s);
 const watch=watchMail(ctx,{intervalMs:60000});t.after(()=>watch.close());await settled(watch);await watch.tick();await watch.close();
 assert.equal(polls(),0);assert.equal(errors.length,1);assert.match(errors[0],/MAIL_BACKGROUND_OWNER_UNAVAILABLE/);
});

test('another process keeps its mail lease when this window cancels',async t=>{
 const ctx=context(t),mail=await openMail(ctx,{create:true}),dir=mailboxDir(ctx);
 const moduleUrl=pathToFileURL(path.join(kernelRoot(ctx.env),'fusion/private-lease.mjs')).href;
 const child=spawn(process.execPath,['--input-type=module','-e',String.raw`const {withPrivateLease}=await import(process.argv[1]);await withPrivateLease(process.argv[2],'mail-operation',async()=>{process.stdout.write('ready\n');await new Promise(r=>process.once('message',r));});process.disconnect();`,moduleUrl,dir],{env:ctx.env,stdio:['ignore','pipe','pipe','ipc']});
 const exited=once(child,'exit');let released=false,diagnostic='';child.stderr.on('data',chunk=>diagnostic+=chunk);
 t.after(async()=>{if(!released&&child.connected)child.send('release');await exited;});
 const [ready]=await Promise.race([once(child.stdout,'data'),exited.then(([code])=>{throw new Error('Owned child exited before lease readiness: '+code+' '+diagnostic);})]);assert.match(ready.toString(),/ready/);
 const file=path.join(dir,'.private-locks',crypto.createHash('sha256').update('mail-operation').digest('hex')+'.lock'),before=fs.readFileSync(file,'utf8');
 const controller=new AbortController(),pending=mail.poll({signal:controller.signal});setTimeout(()=>controller.abort(),30);
 await assert.rejects(pending,error=>error.name==='AbortError');assert.equal(fs.readFileSync(file,'utf8'),before);
 child.send('release');released=true;const [code]=await exited;assert.equal(code,0);assert.deepEqual(await mail.listNotices(),[]);
});


test('closing a watcher cancels a notice read waiting behind another operation',async t=>{
 const ctx=context(t),mail=await openMail(ctx,{create:true});ctx.io.mailAssistant=mail;
 let held,entered;const ready=new Promise(r=>entered=r);
 mail.poll=async()=>{held=await heldLease(ctx);entered();return {fresh:[],inquiries:[]};};
 const watch=watchMail(ctx,{intervalMs:60000});t.after(async()=>{await held?.close();await watch.close();});
 await ready;await new Promise(r=>setTimeout(r,20));
 const closing=watch.close(),fast=await Promise.race([closing.then(()=>true),new Promise(r=>setTimeout(()=>r(false),300))]);
 await held.close();await closing;assert.equal(fast,true,'watcher shutdown must abort the pending notice read');
});

test('an incomplete authenticated daemon status does not authorize a second polling owner',async t=>{
 const ctx=context(t);saveConfig({agentd:{activated:true,visibility:{mail:true},proactive:{enabled:true}}},ctx.env);
 const polls=pollingStub(ctx),errors=[];ctx.stderr.write=s=>errors.push(s);await daemonEndpoint(t,ctx,{running:true});
 const watch=watchMail(ctx,{intervalMs:60000});t.after(()=>watch.close());await settled(watch);await watch.close();
 assert.equal(polls(),0);assert.equal(errors.length,1);assert.match(errors[0],/MAIL_BACKGROUND_OWNER_UNAVAILABLE/);
});

test('a foreign lease is not reclaimed by age or treated as a local dead process',async t=>{
 const ctx=context(t),mail=await openMail(ctx,{create:true}),dir=path.join(mailboxDir(ctx),'.private-locks');fs.mkdirSync(dir,{recursive:true,mode:0o700});
 const file=path.join(dir,crypto.createHash('sha256').update('mail-operation').digest('hex')+'.lock'),raw=JSON.stringify({host:'synthetic-other-host',pid:process.pid,token:crypto.randomUUID()});
 fs.writeFileSync(file,raw,{mode:0o600});fs.utimesSync(file,0,0);
 await assert.rejects(mail.listNotices(),/锁归属/);assert.equal(fs.readFileSync(file,'utf8'),raw);
});
