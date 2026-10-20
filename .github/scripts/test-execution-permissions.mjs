import {load} from './installed-helpers.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {cli,tmp,scripted,toolStep,textStep} from './installed-helpers.mjs';
const {classifyExecution,executionStatus}=await load('src/execution-permissions.mjs');
const codeCommand='node -e "require(\'fs\').appendFileSync(\'owned-marker.txt\',\'x\')"';
const model=command=>scripted([toolStep('shell',{command}),textStep('done')]);

test('smart default executes a real nonsensitive version command without asking',async()=>{
 const provider=model('node --version');let questions=0;
 const r=await cli(['run','Check the installed Node version','--no-memory'],{provider,io:{prompter:{ask:async()=>{questions++;return 'no';}}}});
 assert.equal(r.code,0,r.err);assert.equal(questions,0);assert.match(provider.calls[1].messages.find(m=>m.role==='tool').content,/v\d+\.\d+\.\d+/);
});

test('always allow persists an exact sensitive command across sessions and can be revoked',async()=>{
 const home=tmp(),cwd=tmp();let questions=0;
 const first=await cli(['run','Append one owned marker','--no-memory'],{home,cwd,provider:model(codeCommand),io:{prompter:{ask:async()=>{questions++;return 'always';}}}});
 assert.equal(first.code,0,first.err);assert.equal(questions,1);assert.equal(fs.readFileSync(cwd+'/owned-marker.txt','utf8'),'x');
 const second=await cli(['run','Append one owned marker again','--no-memory'],{home,cwd,provider:model(codeCommand)});assert.equal(second.code,0,second.err);assert.equal(fs.readFileSync(cwd+'/owned-marker.txt','utf8'),'xx');
 const revoked=await cli(['permissions','execution','revoke','all'],{home,cwd});assert.equal(revoked.code,0,revoked.err);
 await cli(['run','Append again','--no-memory'],{home,cwd,provider:model(codeCommand)});assert.equal(fs.readFileSync(cwd+'/owned-marker.txt','utf8'),'xx');
});

test('full access requires an explicit choice, persists for its workspace, and does not leak to another workspace',async()=>{
 const home=tmp(),cwd=tmp(),other=tmp();
 const rejected=await cli(['permissions','execution','full','--yes'],{home,cwd});assert.notEqual(rejected.code,0);
 const grant=await cli(['permissions','execution','full','--confirm','FULL'],{home,cwd});assert.equal(grant.code,0,grant.err);
 const r=await cli(['run','Append an owned marker','--no-memory'],{home,cwd,provider:model(codeCommand)});assert.equal(r.code,0,r.err);assert.equal(fs.readFileSync(cwd+'/owned-marker.txt','utf8'),'x');
 await cli(['run','Append a marker in another workspace','--no-memory'],{home,cwd:other,provider:model(codeCommand)});assert.equal(fs.existsSync(other+'/owned-marker.txt'),false);
 const reset=await cli(['permissions','execution','reset'],{home,cwd});assert.equal(reset.code,0,reset.err);
 await cli(['run','Append again','--no-memory'],{home,cwd,provider:model(codeCommand)});assert.equal(fs.readFileSync(cwd+'/owned-marker.txt','utf8'),'x');
});

test('smart classification rejects shell effects, code, external actions, sensitive files and project executables',()=>{
 const workspace=tmp();
 for(const command of ['rm -rf build','curl https://fixture.invalid/upload','node -e "process.exit()"','echo ok > output','cat .env','rg --pre sh token','find . -exec rm {} \\;','git reset --hard','npm install','npm test','ls; node --version','cat ../outside.txt','cat ~/ordinary.txt','powershell -Command Get-Content'])assert.equal(classifyExecution({kind:'approval',toolName:'shell',command},{workspace}).sensitive,true,command);
 assert.equal(classifyExecution({kind:'approval',toolName:'app_call',command:'node --version',action:{destination:'different'}},{workspace}).sensitive,true);
 assert.equal(classifyExecution({kind:'secret'},{workspace}).sensitive,true);
 for(const file of ['.env','.git/config','package.json','run.ps1','execution-permissions.json'])assert.equal(classifyExecution({kind:'change',path:file,before:'old',after:'new'},{workspace}).sensitive,true,file);
 assert.equal(classifyExecution({kind:'change',path:'main.js',before:'old',after:'new'},{workspace}).sensitive,false);
 if(process.platform!=='win32'){const external=tmp();fs.symlinkSync(external,workspace+'/linked');assert.equal(classifyExecution({kind:'change',path:'linked/new.js',after:'owned'},{workspace}).sensitive,true);}
 assert.equal(classifyExecution({kind:'approval',toolName:'shell',command:'git status'},{workspace,env:{PATH:process.env.PATH,GIT_CONFIG_COUNT:'1'}}).sensitive,true);
 const bin=workspace+'/owned-bin';fs.mkdirSync(bin);fs.writeFileSync(bin+'/node','project executable');assert.equal(classifyExecution({kind:'approval',toolName:'shell',command:'node --version'},{workspace,env:{PATH:bin}}).sensitive,true);
 const outside=tmp();fs.writeFileSync(outside+'/node','outside fake executable');assert.equal(classifyExecution({kind:'approval',toolName:'shell',command:'"'+outside+'/node" --version'},{workspace}).sensitive,true);
});

test('a file-read command cannot auto-approve a symbolic link escaping its workspace',async()=>{
 if(process.platform==='win32')return;
 const cwd=tmp(),home=tmp(),outside=tmp();fs.writeFileSync(outside+'/synthetic.txt','SYNTHETIC-OUTSIDE');fs.symlinkSync(outside+'/synthetic.txt',cwd+'/ordinary.txt');let asked=0;
 const provider=model('cat ordinary.txt');const r=await cli(['run','Read an ordinary file','--no-memory'],{cwd,home,provider,io:{prompter:{ask:async()=>{asked++;return 'no';}}}});
 assert.equal(r.code,0,r.err);assert.equal(asked,1);assert.doesNotMatch(JSON.stringify(provider.calls),/SYNTHETIC-OUTSIDE/);
});

test('an explicit deny overrides --yes and permissions are reread after revocation',async()=>{
 const home=tmp(),cwd=tmp();await cli(['permissions','execution','full','--confirm','FULL'],{home,cwd});
 await cli(['run','Append marker','--no-memory','--yes','--approval','deny'],{home,cwd,provider:model(codeCommand)});assert.equal(fs.existsSync(cwd+'/owned-marker.txt'),false);
 await cli(['permissions','execution','auto'],{home,cwd});assert.equal(executionStatus({env:{KODER_CLI_HOME:home},workspace:cwd}).mode,'auto');
});
