#!/usr/bin/env node
// Owned synthetic fixture only. No real account, model key, or customer content.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import {spawn,execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';

const options={};
for(let i=2;i<process.argv.length;i+=2){assert.ok(/^--(?:runtime-root|owned-root|kernel-root)$/.test(process.argv[i]),'unknown flag');assert.ok(process.argv[i+1],'missing flag value');options[process.argv[i].slice(2)]=path.resolve(process.argv[i+1]);}
assert.ok(options['runtime-root']&&options['owned-root'],'Use --runtime-root <CLI root> --owned-root <new empty fixture root> [--kernel-root <source kernel root>]');
const runtime=options['runtime-root'],root=options['owned-root'],entry=path.join(runtime,'bin/koder.mjs');
assert.ok(fs.statSync(entry).isFile(),'runtime entry is missing');
const sourceFiles=['bin/koder.mjs','src/process-lifecycle.mjs','src/memory.mjs','src/commands/chat.mjs','src/session.mjs'];
const hashes=()=>Object.fromEntries(sourceFiles.map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(path.join(runtime,file))).digest('hex')]));
const sourceHashesBefore=hashes();
assert.ok(!fs.existsSync(root),'owned-root must not already exist');
fs.mkdirSync(root,{mode:0o700});
// Match test/windows-fixtures.mjs: only a just-created, empty, owned fixture
// receives a restrictive Windows ACL; no installation or user ACL is changed.
function protectOwnedFixture(directory){
 if(process.platform!=='win32')return;
 assert.equal(fs.readdirSync(directory).length,0);const before=fs.lstatSync(directory);assert.ok(before.isDirectory()&&!before.isSymbolicLink());
 const sid=/S-1-5-[0-9-]+/.exec(execFileSync('whoami.exe',['/user','/fo','csv','/nh'],{encoding:'utf8',timeout:5000}))[0];
 execFileSync('icacls.exe',[directory,'/inheritance:r','/grant:r',`*${sid}:(OI)(CI)F`,'*S-1-5-18:(OI)(CI)F','*S-1-5-32-544:(OI)(CI)F'],{stdio:'pipe',timeout:5000});
 const after=fs.lstatSync(directory);assert.equal(after.ino,before.ino);assert.equal(after.dev,before.dev);
}
protectOwnedFixture(root);
const home=path.join(root,'home'),workspace=path.join(root,'workspace'),temp=path.join(root,'tmp');
for(const directory of [home,workspace,temp]){fs.mkdirSync(directory,{mode:0o700});protectOwnedFixture(directory);}
const env={};for(const name of ['PATH','PATHEXT','SystemRoot','SYSTEMROOT','WINDIR','COMSPEC','ProgramFiles','ProgramFiles(x86)','ProgramW6432'])if(process.env[name])env[name]=process.env[name];
Object.assign(env,{HOME:home,USERPROFILE:home,KODER_CLI_HOME:home,TMPDIR:temp,TEMP:temp,TMP:temp,APPDATA:path.join(home,'AppData','Roaming'),LOCALAPPDATA:path.join(home,'AppData','Local'),CI:'1',NO_COLOR:'1',KODER_AUTO_UPDATE:'0'});
if(process.platform==='win32')env.KODER_MEMORY_ROOT=home;
if(options['kernel-root'])env.KODER_DESKTOP_ROOT=options['kernel-root'];
for(const directory of [env.APPDATA,env.LOCALAPPDATA])fs.mkdirSync(directory,{recursive:true,mode:0o700});
const requests=[],children=[],checks=[],started=Date.now();let server,failed=null;
const wait=async(predicate,label,ms=12000)=>{const end=Date.now()+ms;while(Date.now()<end){if(predicate())return;await new Promise(resolve=>setTimeout(resolve,20));}throw new Error('TIMEOUT: '+label);};
const bounded=async(promise,label,ms=12000)=>{let timer;try{return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('TIMEOUT: '+label)),ms);})]);}finally{clearTimeout(timer);}};
const check=(name,fn)=>{fn();checks.push(name);};
const promptCount=child=>(child.out.match(/koder(?:\[[^\]\n]*\])? › /g)||[]).length;
const alive=child=>child.exit===null;
function launch(label){
 const child={label,out:'',err:'',exit:null};child.process=spawn(process.execPath,[entry,'chat','--no-anim','-w',workspace],{env,cwd:workspace,stdio:['pipe','pipe','pipe']});
 child.process.stdin.on('error',error=>{child.stdinError=error.code||error.message;});
 child.pid=child.process.pid;child.process.stdout.on('data',chunk=>child.out+=chunk);child.process.stderr.on('data',chunk=>child.err+=chunk);
 child.done=new Promise((resolve,reject)=>{child.process.once('error',reject);child.process.once('close',(code,signal)=>{child.exit={code,signal};resolve(child.exit);});});
 children.push(child);return child;
}
async function ready(child){await wait(()=>promptCount(child)>0||!alive(child),child.label+' startup');assert.ok(alive(child),child.label+' exited before its prompt: '+child.err);}
async function input(child,line){const before=promptCount(child);child.process.stdin.write(line+'\n');await wait(()=>promptCount(child)>before||!alive(child),child.label+' '+line);assert.ok(alive(child),child.label+' exited during '+line+': '+child.err);}
async function task(child,marker){const before=requests.length;await input(child,marker);assert.equal(requests.length,before+1,'one synthetic model request per task');assert.ok(child.out.includes('ACK '+marker),'task must finish, not only return to prompt');return requests.at(-1);}
function users(request){return request.messages.filter(message=>message.role==='user').map(message=>String(message.content)).join('\n');}
function markerOnly(request){return {model:request.model,markers:[...new Set(users(request).match(/AUDIT_[A-Z0-9_]+/g)||[])]};}
try{
 server=http.createServer((request,response)=>{let body='';request.on('data',chunk=>body+=chunk);request.on('end',()=>{try{const parsed=JSON.parse(body);requests.push(parsed);const last=parsed.messages.filter(message=>message.role==='user').at(-1)?.content;response.writeHead(200,{'content-type':'application/json'});response.end(JSON.stringify({choices:[{message:{role:'assistant',content:'ACK '+last},finish_reason:'stop'}],usage:{prompt_tokens:12,completion_tokens:6}}));}catch{response.writeHead(400);response.end('{}');}});});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const provider={model:'owned-loopback-one',baseUrl:`http://127.0.0.1:${server.address().port}/v1`,auth:'none',contextWindow:64000};
 fs.writeFileSync(path.join(home,'provider.json'),JSON.stringify(provider),{mode:0o600});fs.mkdirSync(path.join(home,'models'),{mode:0o700});fs.writeFileSync(path.join(home,'models','second.json'),JSON.stringify({...provider,model:'owned-loopback-two'}),{mode:0o600});
 const {writeAcceptance}=await import(pathToFileURL(path.join(runtime,'src/eula.mjs')).href);writeAcceptance(env);
 const a=launch('A');await ready(a);await task(a,'AUDIT_ALPHA_FIRST');
 const b=launch('B'),c=launch('C');await Promise.all([ready(b),ready(c)]);
 const br=await task(b,'AUDIT_BETA_FIRST'),cr=await task(c,'AUDIT_GAMMA_FIRST');
 check('three actual CLI processes isolate default histories',()=>{assert.match(b.err,/SESSION_ISOLATED/);assert.match(c.err,/SESSION_ISOLATED/);assert.doesNotMatch(users(br),/AUDIT_ALPHA|AUDIT_GAMMA/);assert.doesNotMatch(users(cr),/AUDIT_ALPHA|AUDIT_BETA/);});
 await input(a,'/mode plan');const plan=await task(a,'AUDIT_ALPHA_PLAN');
 check('single-window mode change keeps its own history',()=>{assert.match(users(plan),/AUDIT_ALPHA_FIRST/);assert.doesNotMatch(users(plan),/AUDIT_BETA|AUDIT_GAMMA/);assert.ok(!(plan.tools||[]).some(tool=>tool.function?.name==='write_file'));});
 await input(a,'/mode code');await input(a,'/model use second');const switched=await task(a,'AUDIT_ALPHA_MODEL');
 check('model change releases/reopens session without false busy',()=>{assert.equal(switched.model,'owned-loopback-two');assert.match(users(switched),/AUDIT_ALPHA_FIRST/);});
 await input(a,'/new');const fresh=await task(a,'AUDIT_ALPHA_FRESH');
 check('reset clears only its own task history',()=>{assert.doesNotMatch(users(fresh),/AUDIT_ALPHA_FIRST|AUDIT_ALPHA_PLAN|AUDIT_ALPHA_MODEL/);});
 await input(a,'/engine koder');const engine=await task(a,'AUDIT_ALPHA_ENGINE');
 check('native engine reopen retains session after reset',()=>{assert.match(users(engine),/AUDIT_ALPHA_FRESH/);});
 await input(a,'/project new Audit Project Owned');const project=await task(a,'AUDIT_ALPHA_PROJECT');
 check('project switch uses new workspace and history',()=>{assert.ok(fs.existsSync(path.join(home,'Koder Projects','Audit Project Owned')));assert.doesNotMatch(users(project),/AUDIT_ALPHA_FRESH|AUDIT_ALPHA_ENGINE|AUDIT_BETA|AUDIT_GAMMA/);});
 const continuedB=await task(b,'AUDIT_BETA_CONTINUE'),continuedC=await task(c,'AUDIT_GAMMA_CONTINUE');
 check('other windows survive peer reset/model/project changes',()=>{assert.match(users(continuedB),/AUDIT_BETA_FIRST/);assert.doesNotMatch(users(continuedB),/AUDIT_ALPHA|AUDIT_GAMMA/);assert.match(users(continuedC),/AUDIT_GAMMA_FIRST/);assert.doesNotMatch(users(continuedC),/AUDIT_ALPHA|AUDIT_BETA/);});
 for(const child of children)child.process.stdin.end('/exit\n');await bounded(Promise.all(children.map(child=>child.done)),'normal exit');
 check('all supervisors/workers exit cleanly',()=>{for(const child of children){assert.equal(child.exit.code,0);assert.equal(child.exit.signal,null);assert.doesNotMatch(child.err,/MEMORY_BUSY|PERSONALIZATION_BUSY|STORAGE_BUSY/);}});
 const sessions=path.join(home,'memory','sessions');check('normal exit releases all owned session and turn locks',()=>{assert.deepEqual(fs.readdirSync(sessions).filter(name=>name.endsWith('.active')||name.endsWith('.lock')),[]);});
}catch(error){failed={name:error.name,message:error.message,stack:error.stack};process.exitCode=1;}
finally{
 for(const child of children)if(alive(child)){child.process.kill('SIGTERM');try{await bounded(child.done,child.label+' owned cleanup',8000);}catch(error){failed??={message:error.message};process.exitCode=1;}}
 if(server){server.closeAllConnections();await bounded(new Promise(resolve=>server.close(resolve)),'owned loopback close',2000);}
 const sourceHashesAfter=hashes();if(JSON.stringify(sourceHashesBefore)!==JSON.stringify(sourceHashesAfter)){failed??={message:'SOURCE_CHANGED_DURING_AUDIT'};process.exitCode=1;}
 const receipt={schema:1,state:failed?'FAIL':'PASS',platform:process.platform,osRelease:(await import('node:os')).release(),node:process.version,runtime,version:JSON.parse(fs.readFileSync(path.join(runtime,'package.json'))).version,sourceHashesBefore,sourceHashesAfter,elapsedMs:Date.now()-started,checks,syntheticRequests:requests.map(markerOnly),children:children.map(child=>({label:child.label,pid:child.pid,exit:child.exit,stdinError:child.stdinError||null,stderr:child.err,tail:child.out.slice(-900)})),failure:failed,scope:'Actual bin/supervisor/chat entrypoint; isolated owned files; local HTTP fixture; no model keys; no native Windows claim unless platform is win32; no native keychain/personalization claim; no real provider or update-installation claim.'};
 fs.writeFileSync(path.join(root,'receipt.json'),JSON.stringify(receipt,null,2)+'\n',{mode:0o600});
 console.log(JSON.stringify({state:receipt.state,platform:receipt.platform,elapsedMs:receipt.elapsedMs,checks:checks.length,requests:requests.length,receipt:path.join(root,'receipt.json'),failure:failed?.message||null}));
}
