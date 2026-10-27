import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {loadRelease} from './release.mjs';
const {inspectNotificationChannel,notifyNative,psEncoded}=await loadRelease('src/agentd/notifications.mjs');
const rows={};
const save=()=>fs.writeFileSync(path.join(process.env.KODER_VM_EVIDENCE,'notification-acceptance.json'),JSON.stringify(rows,null,2)+'\n');
function ps(script){return execFileSync(path.join(process.env.SystemRoot,'System32/WindowsPowerShell/v1.0/powershell.exe'),psEncoded(script),{encoding:'utf8',windowsHide:true,timeout:10000}).trim();}

test('a fresh Windows desktop can inspect and submit its first Koder notification', {timeout:30000}, async()=>{
  rows.before=await inspectNotificationChannel();save();assert.equal(rows.before.state,'available');
  rows.first=await notifyNative({kind:'task-done',lang:'en',durationMs:125000});save();
  assert.equal(rows.first.state,'submitted');assert.equal(rows.first.displayVerified,false);
  rows.after=await inspectNotificationChannel();save();assert.equal(rows.after.state,'available');
});

test('Windows per-app notification refusal stays denied without re-enabling the setting', {timeout:30000}, async()=>{
  const key='Software\\Microsoft\\Windows\\CurrentVersion\\Notifications\\Settings\\KarmenLoop.Koder';
  const prior=JSON.parse(ps(`$r=[Microsoft.Win32.Registry]::CurrentUser;$k=$r.OpenSubKey('${key}');$v=$null;$kind=$null;if($k){$v=$k.GetValue('Enabled',$null);if($null -ne $v){$kind=[string]$k.GetValueKind('Enabled')};$k.Dispose()};@{value=$v;kind=$kind}|ConvertTo-Json -Compress`));
  // Only this disposable VM's Koder preference is changed, then restored.
  ps(`$k=[Microsoft.Win32.Registry]::CurrentUser.CreateSubKey('${key}');try{$k.SetValue('Enabled',0,[Microsoft.Win32.RegistryValueKind]::DWord)}finally{$k.Dispose()}`);
  try {
    rows.disabled=await inspectNotificationChannel();rows.denied=await notifyNative({kind:'task-done',lang:'en'});save();
    assert.equal(rows.disabled.state,'denied');assert.equal(rows.denied.state,'denied');
    assert.equal(ps(`$k=[Microsoft.Win32.Registry]::CurrentUser.OpenSubKey('${key}');try{[Console]::Write($k.GetValue('Enabled'))}finally{$k.Dispose()}`),'0');
  } finally {
    const encoded=Buffer.from(JSON.stringify(prior)).toString('base64');
    ps(`$p=[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${encoded}'))|ConvertFrom-Json;$k=[Microsoft.Win32.Registry]::CurrentUser.CreateSubKey('${key}');try{if($null -eq $p.value){$k.DeleteValue('Enabled',$false)}else{$k.SetValue('Enabled',$p.value,([Enum]::Parse([Microsoft.Win32.RegistryValueKind],[string]$p.kind)))}}finally{$k.Dispose()}`);
    rows.preferenceRestored=true;save();
  }
});
