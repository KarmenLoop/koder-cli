// Each fresh job selects its first PS5.1 variant before launching any PS5.1 child.
// All child processes have the existing 10 s limit. No policy or machine change.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {spawn} from 'node:child_process';

if(process.platform!=='win32')throw Error('WINDOWS_NATIVE_REQUIRED');
const owned=path.resolve(process.argv[2]||'');
const variant=process.argv[3];
if(!['baseline','temporary'].includes(variant))throw Error('BASELINE_OR_TEMPORARY_REQUIRED');
if(!process.argv[2]||fs.existsSync(owned))throw Error('NEW_OWNED_DIRECTORY_REQUIRED');
fs.mkdirSync(owned,{recursive:true});
const system=process.env.SystemRoot||process.env.SYSTEMROOT||'C:\\Windows';
const powershell=path.win32.join(system,'System32','WindowsPowerShell','v1.0','powershell.exe');
const profile=path.join(owned,'profile'),temporary=path.join(owned,'tmp');
const appdata=path.join(profile,'AppData','Roaming'),localappdata=path.join(profile,'AppData','Local');
for(const dir of [profile,temporary,appdata,localappdata])fs.mkdirSync(dir,{recursive:true});
const base=Object.fromEntries(['PATH','HOME','USERPROFILE','SystemRoot','SYSTEMROOT','WINDIR','ProgramFiles','PROGRAMFILES','DBUS_SESSION_BUS_ADDRESS','XDG_RUNTIME_DIR'].filter(k=>typeof process.env[k]==='string').map(k=>[k,process.env[k]]));
base.HOME=profile;base.USERPROFILE=profile;
const programFiles=base.ProgramFiles||base.PROGRAMFILES;
base.PSModulePath=[path.win32.join(system,'System32/WindowsPowerShell/v1.0/Modules'),programFiles&&path.win32.join(programFiles,'WindowsPowerShell/Modules')].filter(Boolean).join(';');
const mark=name=>`[Console]::Error.WriteLine('KODER_STAGE:${name}'); `;
const script=mark('entered')+"$ErrorActionPreference='Stop'; [Console]::InputEncoding=[Text.UTF8Encoding]::new($false); [Console]::OutputEncoding=[Text.UTF8Encoding]::new($false); "+mark('encoding')+"Add-Type -AssemblyName System.Security; "+mark('assembly')+"$s=[Console]::In.ReadLine(); if($null -eq $s){throw 'missing protected input'}; "+mark('read')+"$cipher=[Security.Cryptography.ProtectedData]::Protect([Text.Encoding]::UTF8.GetBytes($s),$null,[Security.Cryptography.DataProtectionScope]::CurrentUser); "+mark('protect')+"$plain=[Text.Encoding]::UTF8.GetString([Security.Cryptography.ProtectedData]::Unprotect($cipher,$null,[Security.Cryptography.DataProtectionScope]::CurrentUser)); if($plain -cne $s){throw 'roundtrip mismatch'}; "+mark('unprotect')+"[Console]::Out.Write('KODER_DPAPI_ROUNDTRIP_OK')";
const args=['-NoLogo','-NoProfile','-NonInteractive','-EncodedCommand',Buffer.from(script,'utf16le').toString('base64')];
const rows=[];
async function run(name,extra){
 const start=performance.now(),events=[];let output='',errorOutput='',timeout=false,spawnError=null;
 const child=spawn(powershell,args,{cwd:owned,env:{...base,...extra},stdio:['pipe','pipe','pipe'],windowsHide:true});
 const record=(event,data={})=>events.push({event,milliseconds:Math.round(performance.now()-start),...data});
 const timer=setTimeout(()=>{timeout=true;record('timeout');child.kill();},10000);
 child.on('spawn',()=>record('spawn'));
 child.on('error',e=>{spawnError=e.code||'SPAWN_ERROR';record('error',{code:spawnError});});
 child.stdout.on('data',b=>{output+=b.toString('utf8');record('stdout',{bytes:b.length});if(output.length>65536)child.kill();});
 child.stderr.on('data',b=>{errorOutput+=b.toString('utf8');record('stderr',{text:b.toString('utf8').slice(0,4096)});if(errorOutput.length>65536)child.kill();});
 child.stdin.on('error',e=>record('stdin-error',{code:e.code}));
 const close=new Promise(resolve=>child.once('close',(code,signal)=>resolve({code,signal})));
 child.stdin.end(JSON.stringify({synthetic:'KODER_CREDENTIAL_PROBE',label:'合成资料'})+'\n');
 const ended=await close;clearTimeout(timer);record('close',ended);
 const row={name,envKeys:Object.keys({...base,...extra}).sort(),...ended,timeout,spawnError,passed:!timeout&&ended.code===0&&output==='KODER_DPAPI_ROUNDTRIP_OK',output,errorOutput,events};rows.push(row);
 fs.writeFileSync(path.join(owned,'probe-receipt.json'),JSON.stringify({platform:process.platform,arch:process.arch,osRelease:os.release(),node:process.version,powershell,scriptSha256:crypto.createHash('sha256').update(script).digest('hex'),deadlineMs:10000,coldBootClaim:false,firstVariant:variant,jobFirstPs51:true,job:{runId:process.env.GITHUB_RUN_ID,job:process.env.GITHUB_JOB,replica:process.env.KODER_PROBE_REPLICA,runnerArch:process.env.RUNNER_ARCH},rows},null,2));
 console.log(JSON.stringify({name,code:row.code,timeout,passed:row.passed,elapsedMs:events.at(-1).milliseconds,stages:errorOutput.match(/KODER_STAGE:[a-z]+/g)||[]}));
}
const extra=variant==='temporary'?{TEMP:temporary,TMP:temporary}:{};
await run(variant+'-first',extra);
await run(variant+'-repeat',extra);
process.exitCode=rows.every(row=>row.passed)?0:1;
