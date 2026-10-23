import {installerFixture,fixtureEnv,protectOwnedFixture} from './windows-fixtures.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import http from 'node:http';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {cli,mockModel,textStep,tmp} from './helpers.mjs';
import {kernelRoot} from '../src/agent.mjs';
const source=fileURLToPath(new URL('..',import.meta.url));
const hash=v=>crypto.createHash('sha256').update(v).digest('hex');
const installer=installerFixture(`const fs=require('fs'),path=require('path'),home=process.env.KODER_CLI_HOME,version=process.env.KODER_EXPECTED_VERSION;
const target=path.join(home,'versions',version);fs.cpSync(process.env.KODER_TEST_PACKAGE,target,{recursive:true});
fs.rmSync(path.join(home,'current'),{force:true});fs.symlinkSync(target,path.join(home,'current'),process.platform==='win32'?'junction':'dir');
fs.writeFileSync(path.join(home,'install.json'),JSON.stringify({version,node:process.execPath}));`);
function copyVersion(to,version,bootlog=false){
 fs.mkdirSync(to,{recursive:true});for(const file of ['src','bin','package.json','EULA.md'])fs.cpSync(path.join(source,file),path.join(to,file),{recursive:true});
 const pkg=JSON.parse(fs.readFileSync(path.join(to,'package.json')));pkg.version=version;fs.writeFileSync(path.join(to,'package.json'),JSON.stringify(pkg));
 const c=path.join(to,'src/version.mjs');fs.writeFileSync(c,`export const VERSION = ${JSON.stringify(version)};\n`);
 if(bootlog){const b=path.join(to,'bin/koder.mjs'),s=fs.readFileSync(b,'utf8');fs.writeFileSync(b,s.replace('\n',"\nimport fsBoot from 'node:fs';fsBoot.appendFileSync(process.env.KODER_TEST_BOOTLOG,JSON.stringify({pid:process.pid,ppid:process.ppid,args:process.argv.slice(2)})+'\\n');\n"));}
}
async function fixture(t){
 const root=tmp('koder-restart-'),home=path.join(root,'home'),future=path.join(root,'future');fs.mkdirSync(home);protectOwnedFixture(home);
 t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const old=path.join(home,'versions/0.4.0-preview.6');copyVersion(old,'0.4.0-preview.6');copyVersion(future,'0.4.0-preview.100',true);
 fs.symlinkSync(old,path.join(home,'current'),process.platform==='win32'?'junction':'dir');fs.writeFileSync(path.join(home,'install.json'),JSON.stringify({version:'0.4.0-preview.6'}));
 const manifest={version:'0.4.0-preview.100',file:'koder-cli-0.4.0-preview.100.tgz',sha256:'a'.repeat(64),size:42,preview:true,agreement:{id:'Koder-EULA-1.1',version:'1.1',sha256:hash(fs.readFileSync(path.join(source,'EULA.md')))},installers:{sh:{file:'koder-cli.sh',sha256:hash(installer)},ps1:{file:'koder-cli.ps1',sha256:hash(installer)}}};
 const server=http.createServer((req,res)=>{if(req.url.endsWith('.json'))res.end(JSON.stringify(manifest));else res.end(installer);});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));
 const env={...process.env,...fixtureEnv(home),HOME:root,KODER_DESKTOP_ROOT:kernelRoot(),KODER_INSTALL_BASE:`http://127.0.0.1:${server.address().port}`,KODER_TEST_PACKAGE:future,KODER_TEST_BOOTLOG:path.join(root,'boots.jsonl'),NO_COLOR:'1',CI:'1'};
 delete env.NODE_OPTIONS;delete env.KODER_CLI_WORKER;
 return {root,home,future,old,env};
}
async function child(t,entry,args,env,input){
 const p=spawn(process.execPath,[entry,...args],{env,cwd:env.HOME,stdio:['pipe','pipe','pipe']});let out='',err='';
 p.stdout.on('data',x=>out+=x);p.stderr.on('data',x=>err+=x);
 t.after(()=>{if(p.exitCode===null&&p.signalCode===null)p.kill('SIGTERM');});
 p.stdin.end(input);const code=await new Promise((resolve,reject)=>{p.once('error',reject);p.once('close',resolve);});return {code,out,err,pid:p.pid};
}

test('real update restarts once into new code and consumes queued chat once with prior context and settings intact',async t=>{
 const f=await fixture(t),model=await mockModel([textStep('MAPLE is saved.'),textStep('Continue MAPLE.')]);t.after(()=>model.close());
 assert.equal((await cli(['model','set','--base-url',model.url,'--model','local-fixture','--key-stdin','--context-window','64000'],{home:f.home,stdin:'synthetic-key'})).code,0);
 fs.mkdirSync(path.join(f.home,'gateway'),{recursive:true});fs.writeFileSync(path.join(f.home,'gateway/config.json'),JSON.stringify({platforms:{weixin:{accountId:'synthetic',token:'keep-token'},feishu:{appId:'synthetic',appSecret:'keep-secret'}}}));
 fs.writeFileSync(path.join(f.home,'preferences.md'),'KEEP-USER-MEMORY');
 const before=fs.readFileSync(path.join(f.home,'gateway/config.json'));
 const r=await child(t,path.join(f.old,'bin/koder.mjs'),['chat','--no-anim','--session','maple','--new','--mode','code'],f.env,'Remember project MAPLE; the previous file was already sent.\n更新\nContinue the previous work.\n/exit\n');
 assert.equal(r.code,0,r.out+r.err);
 const boots=fs.readFileSync(f.env.KODER_TEST_BOOTLOG,'utf8').trim().split('\n').map(JSON.parse).filter(x=>x.args[0]==='chat');
 assert.equal(boots.length,1,'verified replacement must actually start one new chat worker');assert.notEqual(boots[0].pid,r.pid,'new worker is a fresh process');
 assert.equal(model.requests.length,2,'completed work and queued request are not replayed');
 assert.ok(model.requests[1].body.messages.some(m=>String(m.content).includes('MAPLE')),'original named session survives --new update');
 assert.deepEqual(fs.readFileSync(path.join(f.home,'gateway/config.json')),before);
 assert.equal(fs.readFileSync(path.join(f.home,'preferences.md'),'utf8'),'KEEP-USER-MEMORY');
 assert.match(r.out,/0\.4\.0-preview\.100/);
});

async function until(predicate,ms=8000){const end=Date.now()+ms;while(Date.now()<end){if(await predicate())return;await new Promise(r=>setTimeout(r,25));}throw new Error('Condition timed out');}
function live(t,entry,args,env){
 const p=spawn(process.execPath,[entry,...args],{env,cwd:env.HOME,stdio:['pipe','pipe','pipe']});let output='';p.stdout.on('data',x=>output+=x);p.stderr.on('data',x=>output+=x);
 const done=new Promise((resolve,reject)=>{p.once('error',reject);p.once('close',(code,signal)=>resolve({code,signal}));});
 t.after(async()=>{if(p.exitCode===null&&p.signalCode===null){p.kill('SIGTERM');await done;}});
 return {p,done,output:()=>output};
}

for(const startupFailure of [false,true])test(`running WeChat gateway drains and restores options/history (${startupFailure?'pre-admission failure fallback':'updated worker'})`,async t=>{
 const f=await fixture(t),model=await mockModel([textStep('MAPLE first done'),textStep('MAPLE second done')]);t.after(()=>model.close());
 assert.equal((await cli(['model','set','--base-url',model.url,'--model','local-fixture','--key-stdin','--context-window','64000'],{home:f.home,stdin:'synthetic-key'})).code,0);
 if(startupFailure)fs.writeFileSync(path.join(f.future,'src/commands/gateway.mjs'),"export async function run(){throw new Error('synthetic gateway initialization failure');}\n");
 const messages=[],sends=[],requests=[];let pendingSend=null;
 const channel=http.createServer((req,res)=>{let body='';req.on('data',x=>body+=x);req.on('end',()=>{
  const data=JSON.parse(body);requests.push({url:req.url,auth:req.headers.authorization});
  if(req.url.endsWith('getupdates'))setTimeout(()=>res.end(JSON.stringify({msgs:messages.splice(0),get_updates_buf:'saved-cursor'})),35);
  else if(req.url.endsWith('sendmessage')){sends.push(data.msg);if(sends.length===1)pendingSend=()=>res.end(JSON.stringify({ret:0}));else res.end(JSON.stringify({ret:0}));}
  else res.end('{}');
 });});await new Promise(r=>channel.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>{channel.closeAllConnections();channel.close(r);}));
 fs.mkdirSync(path.join(f.home,'gateway'),{recursive:true});
 const config={workspace:f.root,platforms:{weixin:{accountId:'test-account',token:'keep-token',dmPolicy:'open',baseUrl:`http://127.0.0.1:${channel.address().port}`},feishu:{enabled:false,appId:'disabled',appSecret:'keep-secret'}}};
 fs.writeFileSync(path.join(f.home,'gateway/config.json'),JSON.stringify(config));const before=fs.readFileSync(path.join(f.home,'gateway/config.json'));
 const provider=path.join(f.root,'explicit-provider.json');fs.writeFileSync(provider,JSON.stringify({model:'explicit-provider',baseUrl:model.url,auth:'none',contextWindow:64000}));
 const old=live(t,path.join(f.old,'bin/koder.mjs'),['gateway','start','--no-memory','--engine','koder','--provider',provider,'-w',f.root,'--mode','plan'],f.env);
 const state=()=>{try{return JSON.parse(fs.readFileSync(path.join(f.home,'gateway/state.json')));}catch{return null;}};
 await until(()=>state()?.platforms?.weixin?.state==='connected');const priorPid=state().pid;
 const inbound=(id,text)=>({message_id:id,from_user_id:'u',message_type:1,context_token:'context-kept',item_list:[{type:1,text_item:{text}}]});
 messages.push(inbound('one','Remember MAPLE work.'));await until(()=>pendingSend);
 const update=await child(t,path.join(f.old,'bin/koder.mjs'),['update'],f.env,'');assert.equal(update.code,0,update.out+update.err);
 await new Promise(r=>setTimeout(r,1100));assert.equal(state().pid,priorPid,'outbound delivery still owns the old gateway');assert.equal(sends.length,1);
 pendingSend();await until(()=>state()?.pid!==priorPid && state()?.version===(startupFailure?'0.4.0-preview.6':'0.4.0-preview.100'));
 if(startupFailure)assert.match(old.output(),/UPDATE_RESTART_FAILED/);
 messages.push(inbound('one','Remember MAPLE work.'));await new Promise(r=>setTimeout(r,200));assert.equal(model.requests.length,1,'duplicate platform event is not re-executed after update');
 messages.push(inbound('two','Continue the prior task.'));await until(()=>sends.length===2);assert.equal(model.requests.length,2);
 assert.equal(model.requests[1].body.model,'explicit-provider','explicit provider survives update');
 assert.ok(!model.requests[1].body.tools.some(t=>t.function.name==='write_file'),'plan mode survives update');
 assert.equal(fs.existsSync(path.join(f.home,'memory/sessions')),false,'gateway --no-memory stays disabled');
 assert.ok(model.requests[1].body.messages.some(m=>String(m.content).includes('MAPLE')));
 assert.deepEqual(fs.readFileSync(path.join(f.home,'gateway/config.json')),before);
 assert.ok(requests.every(r=>r.auth==='Bearer keep-token'));assert.ok(!requests.some(r=>/qrcode|login/.test(r.url)));
 assert.equal(sends[1].context_token,'context-kept');assert.equal(state().platforms.feishu,undefined,'disabled binding is not started');
 old.p.kill('SIGTERM');assert.notEqual((await old.done).code,75,'user stop does not restart the gateway');
});

test('replacement startup failure falls back once to saved conversation without replaying completed work',async t=>{
 const f=await fixture(t),model=await mockModel([textStep('MAPLE done'),textStep('MAPLE continued')]);t.after(()=>model.close());
 assert.equal((await cli(['model','set','--base-url',model.url,'--model','local-fixture','--key-stdin','--context-window','64000'],{home:f.home,stdin:'synthetic-key'})).code,0);
 fs.writeFileSync(path.join(f.future,'src/process-lifecycle.mjs'),"throw new Error('synthetic startup failure');\n");
 const r=await child(t,path.join(f.old,'bin/koder.mjs'),['chat','--no-anim','--session','maple'],f.env,'Remember MAPLE.\n更新\nContinue MAPLE.\n/exit\n');
 assert.equal(r.code,0,r.out+r.err);assert.match(r.err,/UPDATE_RESTART_FAILED/);
 assert.equal(model.requests.length,2);assert.ok(model.requests[1].body.messages.some(m=>String(m.content).includes('MAPLE')));
 const boots=fs.readFileSync(f.env.KODER_TEST_BOOTLOG,'utf8').trim().split('\n').map(JSON.parse).filter(x=>x.args[0]==='chat');assert.equal(boots.length,1,'no automatic failure/restart loop');
});

test('an idle chat notices a separately verified update and remains interactive with the same session',async t=>{
 const f=await fixture(t),model=await mockModel([textStep('MAPLE saved'),textStep('MAPLE continues')]);t.after(()=>model.close());
 assert.equal((await cli(['model','set','--base-url',model.url,'--model','local-fixture','--key-stdin','--context-window','64000'],{home:f.home,stdin:'synthetic-key'})).code,0);
 const chat=live(t,path.join(f.old,'bin/koder.mjs'),['chat','--no-anim','--session','maple','--new'],f.env);
 chat.p.stdin.write('Remember MAPLE.\n');await until(()=>chat.output().includes('MAPLE saved'));
 const updated=await child(t,path.join(f.old,'bin/koder.mjs'),['update'],f.env,'');assert.equal(updated.code,0,updated.out+updated.err);
 await until(()=>{try{return fs.readFileSync(f.env.KODER_TEST_BOOTLOG,'utf8').includes('"chat"');}catch{return false;}});
 chat.p.stdin.end('Continue the previous work.\n/exit\n');const done=await chat.done;assert.equal(done.code,0,chat.output());
 assert.equal(model.requests.length,2);assert.ok(model.requests[1].body.messages.some(m=>String(m.content).includes('MAPLE')));
});

for(const command of ['import','initialize'])test(`replacement chat ${command} failure falls back before admission`,async t=>{
 const f=await fixture(t),model=await mockModel([textStep('MAPLE done'),textStep('MAPLE continued')]);t.after(()=>model.close());
 assert.equal((await cli(['model','set','--base-url',model.url,'--model','local-fixture','--key-stdin','--context-window','64000'],{home:f.home,stdin:'synthetic-key'})).code,0);
 // Exercise both the module loader and the command body before it admits input.
 const target=path.join(f.future,'src/commands/chat.mjs');
 fs.writeFileSync(target,command==='import'?"throw new Error('synthetic command import failure');\n":`export const flags={'no-anim':{type:'bool'}};export async function run(ctx){throw new Error('synthetic chat initialization failure');}\n`);
 const r=await child(t,path.join(f.old,'bin/koder.mjs'),['chat','--no-anim','--no-memory'],f.env,'Remember MAPLE.\n更新\nContinue MAPLE.\n/exit\n');
 assert.equal(r.code,0,r.out+r.err);assert.match(r.err,/UPDATE_RESTART_FAILED/);assert.equal(model.requests.length,2);
 assert.ok(model.requests[1].body.messages.some(m=>String(m.content).includes('MAPLE')));
});

test('failure after new worker admission never falls back and replays buffered input',async t=>{
 const f=await fixture(t),model=await mockModel([textStep('MAPLE done')]);t.after(()=>model.close());
 assert.equal((await cli(['model','set','--base-url',model.url,'--model','local-fixture','--key-stdin','--context-window','64000'],{home:f.home,stdin:'synthetic-key'})).code,0);
 fs.writeFileSync(path.join(f.future,'src/commands/chat.mjs'),`export const flags={'no-anim':{type:'bool'}};export async function run(ctx){await ctx.io.onReady?.();process.stdout.write('WORK_ADMITTED\\n');throw new Error('failure after admission');}\n`);
 const r=await child(t,path.join(f.old,'bin/koder.mjs'),['chat','--no-anim','--no-memory'],f.env,'Remember MAPLE.\n更新\nDo next task.\n/exit\n');
 assert.equal(r.code,1,r.out+r.err);assert.match(r.out,/WORK_ADMITTED/);assert.doesNotMatch(r.err,/UPDATE_RESTART_FAILED/);assert.equal(model.requests.length,1);
});
