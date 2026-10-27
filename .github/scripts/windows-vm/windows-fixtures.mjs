import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
let sid;
export function protectOwnedFixture(root) {
 if(process.platform!=='win32')return root;
 assert.equal(fs.readdirSync(root).length,0,'only a newly created empty fixture may be protected');
 const before=fs.lstatSync(root);assert.ok(before.isDirectory()&&!before.isSymbolicLink());
 sid ||= /S-1-5-[0-9-]+/.exec(execFileSync('whoami.exe',['/user','/fo','csv','/nh'],{encoding:'utf8',timeout:5000}))[0];
 execFileSync('icacls.exe',[root,'/inheritance:r','/grant:r',`*${sid}:(OI)(CI)F`,'*S-1-5-18:(OI)(CI)F','*S-1-5-32-544:(OI)(CI)F'],{stdio:'pipe',timeout:5000});
 const after=fs.lstatSync(root);assert.equal(after.ino,before.ino);assert.equal(after.dev,before.dev);
 return root;
}
export function fixtureEnv(home,overrides={}) {
 const env={};
 for(const key of ['PATH','PATHEXT','HOME','SystemRoot','SYSTEMROOT','WINDIR','COMSPEC','USERPROFILE','TEMP','TMP','APPDATA','LOCALAPPDATA','ProgramFiles','ProgramFiles(x86)','ProgramW6432'])if(process.env[key])env[key]=process.env[key];
 return {...env,HOME:home,USERPROFILE:home,KODER_CLI_HOME:home,...(process.platform==='win32'?{KODER_MEMORY_ROOT:home}:{}),...overrides};
}
export function assertPrivateFile(file) {
 if(process.platform!=='win32'){assert.equal(fs.statSync(file).mode&0o777,0o600);return;}
 const script=`$ErrorActionPreference='Stop';$me=[Security.Principal.WindowsIdentity]::GetCurrent().User.Value;$allowed=@($me,'S-1-5-18','S-1-5-32-544');$acl=Get-Acl -LiteralPath $env:KODER_TEST_PRIVATE_FILE;if($allowed -notcontains $acl.GetOwner([Security.Principal.SecurityIdentifier]).Value){throw 'owner'};foreach($rule in $acl.GetAccessRules($true,$true,[Security.Principal.SecurityIdentifier])){if($rule.AccessControlType -eq 'Allow' -and $allowed -notcontains $rule.IdentityReference.Value){throw 'public read'}};[Console]::Out.Write('PRIVATE')`;
 const result=execFileSync(path.join(process.env.SystemRoot,'System32/WindowsPowerShell/v1.0/powershell.exe'),['-NoLogo','-NoProfile','-NonInteractive','-EncodedCommand',Buffer.from(script,'utf16le').toString('base64')],{env:{...process.env,PSModulePath:path.join(process.env.SystemRoot,'System32/WindowsPowerShell/v1.0/Modules'),KODER_TEST_PRIVATE_FILE:file},encoding:'utf8',timeout:10000});
 assert.equal(result,'PRIVATE');
}
export function installerFixture(js) {
 const encoded=Buffer.from(js).toString('base64');
 return process.platform==='win32'?`$ErrorActionPreference='Stop'\n& '${process.execPath.replaceAll("'","''")}' -e "eval(Buffer.from('${encoded}','base64').toString())"\nif ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }\n`:`#!/bin/sh\nnode <<'NODE'\n${js}\nNODE\n`;
}
