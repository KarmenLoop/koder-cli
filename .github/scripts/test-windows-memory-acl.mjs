import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {load,tmp} from './installed-helpers.mjs';
const {resolveMemoryLocation}=await load('src/shared-memory/location.mjs');
assert.equal(process.platform,'win32');
function powershell(script,root){
 const env={...process.env,KODER_ACL_FIXTURE:root};
 const key=Object.keys(env).find(k=>k.toLowerCase()==='psmodulepath');const original=key&&env[key];
 for(const k of Object.keys(env))if(k.toLowerCase()==='psmodulepath')delete env[k];
 env.PSModulePath=path.join(env.SystemRoot,'System32/WindowsPowerShell/v1.0/Modules')+';'+(original||'');
 const r=spawnSync(path.join(env.SystemRoot,'System32/WindowsPowerShell/v1.0/powershell.exe'),['-NoProfile','-NonInteractive','-EncodedCommand',Buffer.from("$ErrorActionPreference='Stop';"+script,'utf16le').toString('base64')],{env,encoding:'utf8',timeout:15000});
 assert.equal(r.status,0,r.stdout+r.stderr);return r.stdout.trim();
}
test('native Windows creates and reads back a protected owned memory directory',()=>{
 const root=path.join(tmp(),'new-private');const r=resolveMemoryLocation({configured:{root}});assert.equal(r.state,'ready',JSON.stringify(r));
 const read=JSON.parse(powershell("$a=Get-Acl -LiteralPath $env:KODER_ACL_FIXTURE;@{protected=$a.AreAccessRulesProtected;sids=@($a.GetAccessRules($true,$true,[Security.Principal.SecurityIdentifier]) | % {$_.IdentityReference.Value})} | ConvertTo-Json -Compress",root));
 assert.equal(read.protected,true);assert.ok(!read.sids.includes('S-1-1-0')&&!read.sids.includes('S-1-5-32-545'));
 fs.writeFileSync(path.join(root,'owned.txt'),'retained');assert.equal(resolveMemoryLocation({configured:r}).state,'ready');assert.equal(fs.readFileSync(path.join(root,'owned.txt'),'utf8'),'retained');
});
test('an existing nonempty directory with broad access remains blocked and its ACL is unchanged',()=>{
 const root=path.join(tmp(),'existing');fs.mkdirSync(root);fs.writeFileSync(path.join(root,'owned.txt'),'do not change');
 powershell("$a=Get-Acl -LiteralPath $env:KODER_ACL_FIXTURE;$s=[Security.Principal.SecurityIdentifier]::new('S-1-1-0');$r=[Security.AccessControl.FileSystemAccessRule]::new($s,'ReadAndExecute','Allow');$a.AddAccessRule($r);Set-Acl -LiteralPath $env:KODER_ACL_FIXTURE -AclObject $a",root);
 const before=powershell("(Get-Acl -LiteralPath $env:KODER_ACL_FIXTURE).Sddl",root);const r=resolveMemoryLocation({configured:{root}});assert.equal(r.state,'restricted');assert.equal(r.reasonCode,'MEMORY_ACCESS_ISOLATION_UNVERIFIED');
 assert.equal(powershell("(Get-Acl -LiteralPath $env:KODER_ACL_FIXTURE).Sddl",root),before);assert.equal(fs.readFileSync(path.join(root,'owned.txt'),'utf8'),'do not change');
});
test('a Windows junction cannot redirect memory root validation',()=>{
 const dir=tmp(),target=tmp();fs.symlinkSync(target,path.join(dir,'junction'),'junction');
 const r=resolveMemoryLocation({configured:{root:path.join(dir,'junction','new')}});assert.equal(r.state,'restricted');assert.equal(r.reasonCode,'MEMORY_ROOT_UNSAFE');assert.equal(fs.existsSync(path.join(target,'new')),false);
});

