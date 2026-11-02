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
}finally{fs.rmSync(base,{recursive:true,force:true});}
receipt.state=receipt.checks.every(x=>x.state==='PASS')?'PASS':'FAIL';
fs.mkdirSync('evidence',{recursive:true});
fs.writeFileSync('evidence/windows-login-storage.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
if(receipt.state!=='PASS')process.exitCode=1;

