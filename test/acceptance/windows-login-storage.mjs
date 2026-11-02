// Public acceptance harness. Imports only the installed runtime; uses synthetic data.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn,spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const root=process.env.KODER_ACCEPTANCE_PACKAGE;
if(process.platform!=='win32'||!root)throw Error('WINDOWS_PACKAGE_REQUIRED');
const module=path.join(root,'kernel','fusion','native-credentials.mjs');
const helper=path.join(root,'kernel','fusion','windows-credential-helper.exe');
const receipt={schema:1,platform:process.platform,arch:process.arch,node:process.version,version:JSON.parse(fs.readFileSync(path.join(root,'package.json'))).version,helperSha256:crypto.createHash('sha256').update(fs.readFileSync(helper)).digest('hex'),checks:[]};
const {openMemoryCredentials}=await import(pathToFileURL(module));
const base=fs.mkdtempSync(path.join(os.tmpdir(),'koder-storage-acceptance-'));
async function check(name,work){try{await work();receipt.checks.push({name,state:'PASS'});}catch(error){receipt.checks.push({name,state:'FAIL',code:/^[A-Z0-9_]+$/.test(error?.code||'')?error.code:'ASSERTION_FAILED',...(error.safe?{detail:error.safe}:{})});}}
const demand=(ok,code)=>{if(!ok)throw Object.assign(Error(code),{code});};
try{
 await check('direct-native-transform',async()=>{
  const input=Buffer.from(JSON.stringify({marker:'SYNTHETIC',label:'合成资料'})+'\n');
  const a=spawnSync(helper,['protect'],{input,timeout:10000,windowsHide:true,maxBuffer:263168});
  demand(!a.error&&a.status===0&&a.stdout.length>0,'NATIVE_PROTECT_FAILED');
  demand(!a.stdout.includes(Buffer.from('SYNTHETIC')),'PLAINTEXT_CIPHER');
  const b=spawnSync(helper,['unprotect'],{input:Buffer.concat([a.stdout,Buffer.from('\n')]),timeout:10000,windowsHide:true,maxBuffer:263168});
  demand(!b.error&&b.status===0&&b.stdout.toString()===input.toString().trim(),'NATIVE_UNPROTECT_FAILED');
 });
 for(const label of ['plain','space and Unicode 资料'])await check('vault-'+label,async()=>{
  const dir=path.join(base,label),calls=[];
  const vault=openMemoryCredentials({dir,namespace:'acceptance',requireProtected:true,spawnImpl:(file,args,options)=>{
   const call={action:args[0]};calls.push(call);
   const child=spawn(file,args,options);
   child.on('error',error=>{call.code=/^[A-Z0-9_]+$/.test(error.code||'')?error.code:'SPAWN_FAILED';});
   child.on('close',code=>{call.exitCode=code;});
   return child;
  }});
  const value={marker:'SYNTHETIC',label:'合成资料',revision:1};
  try{await vault.write(value);demand(vault.availability().mode==='protected','VAULT_NOT_PROTECTED');demand(JSON.stringify(await vault.read())===JSON.stringify(value),'VAULT_READBACK_FAILED');}
  catch(error){error.safe={availability:vault.availability(),calls};throw error;}
  const bytes=fs.readFileSync(path.join(dir,'acceptance-credentials.dpapi'));
  demand(!bytes.includes(Buffer.from('SYNTHETIC')),'PLAINTEXT_FILE');
  const reader="import {openMemoryCredentials} from "+JSON.stringify(pathToFileURL(module).href)+"; const v=openMemoryCredentials({dir:process.env.KODER_SYNTHETIC_HOME,namespace:'acceptance',requireProtected:true});const r=await v.read(); if(r?.marker!=='SYNTHETIC')process.exit(4);";
  const child=spawnSync(process.execPath,['--input-type=module','-e',reader],{env:{...process.env,KODER_SYNTHETIC_HOME:dir},timeout:15000,windowsHide:true,maxBuffer:16384});
  demand(!child.error&&child.status===0,'FRESH_PROCESS_READ_FAILED');
  if(typeof vault.check==='function'){
   const before=fs.readFileSync(path.join(dir,'acceptance-credentials.dpapi'));
   demand((await vault.check()).state==='ready','PREFLIGHT_FAILED');
   demand(before.equals(fs.readFileSync(path.join(dir,'acceptance-credentials.dpapi'))),'PREFLIGHT_CHANGED_ACCOUNT');
   demand(!fs.readdirSync(dir).some(n=>n.startsWith('.credential-probe-')),'PROBE_NOT_REMOVED');
  }
  await vault.clear();demand(await vault.read()===null,'CLEAR_FAILED');
 });
 await check('legacy-dpapi-cipher-compatibility',async()=>{
  const dir=path.join(base,'compat'),native=openMemoryCredentials({dir,namespace:'compat',requireProtected:true}),legacy=openMemoryCredentials({dir,namespace:'compat',windowsBackend:'powershell',requireProtected:true});
  await native.write({marker:'SYNTHETIC-NATIVE'});demand((await legacy.read())?.marker==='SYNTHETIC-NATIVE','LEGACY_CANNOT_READ_NATIVE');
  await legacy.write({marker:'SYNTHETIC-LEGACY'});demand((await native.read())?.marker==='SYNTHETIC-LEGACY','NATIVE_CANNOT_READ_LEGACY');await native.clear();
 });
 await check('account-authorization-persist-refresh-logout',async()=>{
  // Synthetic issuer responses exercise the shipping account client and real
  // native storage. This is not a human or production-server login test.
  const {createAccountClient}=await import(pathToFileURL(path.join(root,'src/account/client.mjs')));
  const home=path.join(base,'account 账号');let now=Date.now(),opened=0,rotations=0;
  const issuer='https://karmensecurity.com',state='s'.repeat(43),pollSecret='p'.repeat(43);
  const ctx={env:{KODER_CLI_HOME:home,KODER_DESKTOP_ROOT:path.join(root,'kernel')},io:{}};
  const fetchImpl=async(url,options={})=>{
   const route=new URL(url).pathname;let data;
   if(route==='/.well-known/karmen-account.json')data={version:1,issuer,clientId:'koder-cli',tokenEndpoint:'/oauth/token',userinfoEndpoint:'/oauth/userinfo',revocationEndpoint:'/oauth/revoke',cliAuthorization:{version:1,pkceMethod:'S256',startEndpoint:'/oauth/cli/start',tokenEndpoint:'/oauth/cli/token',cancelEndpoint:'/oauth/cli/cancel'}};
   else if(route==='/oauth/cli/start')data={issuer,clientId:'koder-cli',state,pollSecret,authUrl:issuer+'/account?cli='+state,expiresIn:300,interval:1,confirmationCode:'SYNTH123'};
   else if(route==='/oauth/cli/token'||route==='/oauth/token'){rotations++;data={client_id:'koder-cli',token_type:'Bearer',access_token:'synthetic-access-'+String(rotations).padStart(24,'0'),refresh_token:'synthetic-refresh-'+String(rotations).padStart(24,'0'),expires_in:300,scope:'offline_access profile'};}
   else if(route==='/oauth/userinfo')data={client_id:'koder-cli',sub:'synthetic-user',email_verified:true,email:'test@example.invalid',name:'Synthetic',scope:'offline_access profile',session_id:'synthetic-session',expires_at:now+300000,grant_expires_at:now+86400000};
   else if(route==='/oauth/revoke'||route==='/oauth/cli/cancel')data={ok:true};
   else throw Object.assign(Error('UNEXPECTED_TEST_ROUTE'),{code:'UNEXPECTED_TEST_ROUTE'});
   return new Response(JSON.stringify(data),{status:200,headers:{'content-type':'application/json'}});
  };
  const client=createAccountClient(ctx,{fetchImpl,now:()=>now,wait:async()=>{}});
  if(typeof client.doctor==='function')demand((await client.doctor()).state==='ready','ACCOUNT_PREFLIGHT_FAILED');
  const signedIn=await client.login({onStart:()=>{opened++;}});
  demand(opened===1&&signedIn.state==='authenticated','ACCOUNT_LOGIN_FAILED');
  demand((await client.status()).state==='authenticated','ACCOUNT_STATUS_FAILED');
  const metadata=fs.readFileSync(path.join(home,'account-session.json'),'utf8');
  demand(!metadata.includes('synthetic-access-')&&!metadata.includes('synthetic-refresh-'),'PLAINTEXT_METADATA');
  const reader="import {createAccountClient} from "+JSON.stringify(pathToFileURL(path.join(root,'src/account/client.mjs')).href)+";const c=createAccountClient({env:{KODER_CLI_HOME:process.env.KODER_SYNTHETIC_HOME,KODER_DESKTOP_ROOT:process.env.KODER_SYNTHETIC_KERNEL},io:{}});if((await c.status()).state!=='authenticated')process.exit(4);";
  const processRead=spawnSync(process.execPath,['--input-type=module','-e',reader],{env:{...process.env,KODER_SYNTHETIC_HOME:home,KODER_SYNTHETIC_KERNEL:path.join(root,'kernel')},timeout:20000,windowsHide:true,maxBuffer:16384});
  demand(!processRead.error&&processRead.status===0,'ACCOUNT_FRESH_PROCESS_FAILED');
  now+=301000;demand((await client.authenticated()).state==='authenticated'&&rotations===2,'ACCOUNT_REFRESH_FAILED');
  demand((await client.logout()).state==='signed-out'&&(await client.status()).state==='signed-out','ACCOUNT_LOGOUT_FAILED');
 });
}finally{fs.rmSync(base,{recursive:true,force:true});}
receipt.state=receipt.checks.every(x=>x.state==='PASS')?'PASS':'FAIL';
fs.mkdirSync('evidence',{recursive:true});
fs.writeFileSync('evidence/windows-login-storage.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
if(receipt.state!=='PASS')process.exitCode=1;

