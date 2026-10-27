// Real GUI input against a disposable, owned WinForms window. No user apps.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import {loadRelease} from './release.mjs';

test('Koder MCP transport snapshots, types and clicks an owned native Windows form', {timeout:90000}, async () => {
  const {bundledWindowsMcp}=await loadRelease('src/windows-mcp-bundle.mjs');
  const {connectStdio}=await loadRelease('kernel/loop/mcp-stdio.mjs');
  const out=process.env.KODER_VM_EVIDENCE, root=fs.mkdtempSync(path.join(out,'gui-owned-'));
  const marker='KODER_GUI_'+crypto.randomBytes(8).toString('hex');
  const title='Koder owned VM input '+marker, evidence={title,marker,steps:[]};
  const save=()=>fs.writeFileSync(path.join(out,'native-gui.json'),JSON.stringify(evidence,null,2)+'\n');
  const script=`$ErrorActionPreference='Stop';Add-Type -AssemblyName System.Windows.Forms;Add-Type -AssemblyName System.Drawing;
  $f=New-Object Windows.Forms.Form;$f.Text=$env:KODER_GUI_TITLE;$f.Size=New-Object Drawing.Size(480,240);$f.StartPosition='CenterScreen';$f.TopMost=$true;
  $inputBox=New-Object Windows.Forms.TextBox;$inputBox.Location=New-Object Drawing.Point(30,35);$inputBox.Size=New-Object Drawing.Size(400,30);$inputBox.AccessibleName='Koder acceptance input';
  $button=New-Object Windows.Forms.Button;$button.Text='Save receipt';$button.Location=New-Object Drawing.Point(30,90);$button.Size=New-Object Drawing.Size(160,35);
  $label=New-Object Windows.Forms.Label;$label.Location=New-Object Drawing.Point(30,145);$label.Size=New-Object Drawing.Size(400,30);$label.Text='Waiting for input';
  $f.Controls.AddRange(@($inputBox,$button,$label));
  $button.Add_Click({[IO.File]::WriteAllText((Join-Path $env:KODER_GUI_ROOT 'saved.txt'),$inputBox.Text);$label.Text='Saved '+$inputBox.Text});
  $f.Add_Shown({$f.Activate();$i=$inputBox.PointToScreen((New-Object Drawing.Point(20,12)));$b=$button.PointToScreen((New-Object Drawing.Point(70,16)));@{title=$f.Text;pid=$PID;input=@($i.X,$i.Y);button=@($b.X,$b.Y)}|ConvertTo-Json -Compress|Set-Content (Join-Path $env:KODER_GUI_ROOT 'ready.json')});
  $timer=New-Object Windows.Forms.Timer;$timer.Interval=100;$timer.Add_Tick({if(Test-Path (Join-Path $env:KODER_GUI_ROOT 'close')){$f.Close()}});$timer.Start();
  try{[Windows.Forms.Application]::Run($f)}finally{$timer.Dispose();$f.Dispose()}`;
  const child=spawn(path.join(process.env.SystemRoot,'System32/WindowsPowerShell/v1.0/powershell.exe'),['-NoProfile','-NonInteractive','-STA','-EncodedCommand',Buffer.from(script,'utf16le').toString('base64')],{env:{...process.env,KODER_GUI_ROOT:root,KODER_GUI_TITLE:title},windowsHide:true,stdio:['ignore','pipe','pipe']});
  let stderr='';child.stderr.on('data',d=>stderr=(stderr+d).slice(-6000));
  const ended=new Promise(resolve=>child.once('exit',(code,signal)=>resolve({code,signal})));let client;
  try {
    const ready=path.join(root,'ready.json');
    for(let i=0;i<100&&!fs.existsSync(ready)&&child.exitCode===null;i++)await delay(100);
    assert(fs.existsSync(ready),'Owned GUI did not become ready: '+stderr);
    const state=JSON.parse(fs.readFileSync(ready,'utf8').replace(/^\uFEFF/,''));assert.equal(state.pid,child.pid);assert.equal(state.title,title);evidence.window=state;save();
    client=connectStdio({...bundledWindowsMcp(),env:{SystemRoot:process.env.SystemRoot,PATH:path.join(process.env.SystemRoot,'System32'),ANONYMIZED_TELEMETRY:'false',PYTHONUTF8:'1'}});
    await client.request('initialize',{});
    async function call(name,args) {
      const result=await client.request('tools/call',{name,arguments:args});
      const content=result.content?.filter(c=>c.type==='text').map(c=>c.text).join('\n')||'';
      evidence.steps.push({name,isError:result.isError===true,text:content.slice(0,20000)});save();assert.notEqual(result.isError,true,content);
      for(const [i,item] of (result.content||[]).entries())if(item.type==='image'&&item.mimeType==='image/png')fs.writeFileSync(path.join(out,`gui-${name}-${i}.png`),Buffer.from(item.data,'base64'));
      return content;
    }
    assert((await call('Snapshot',{use_vision:true,use_annotation:false})).includes(title),'Snapshot must observe the owned window before input');
    await call('Type',{loc:state.input,text:marker,clear:true});
    await call('Click',{loc:state.button});
    const receipt=path.join(root,'saved.txt');
    for(let i=0;i<50&&!fs.existsSync(receipt);i++)await delay(100);
    assert(fs.existsSync(receipt),'GUI click did not save a receipt');
    assert.equal(fs.readFileSync(receipt,'utf8'),marker);
    evidence.after=await call('Snapshot',{use_vision:true,use_annotation:false});
    evidence.savedValueVerified=true;save();
  } finally {
    fs.writeFileSync(path.join(root,'close'),'close');
    let timer;const closed=await Promise.race([ended.then(()=>true),new Promise(resolve=>{timer=setTimeout(()=>resolve(false),3000);})]);clearTimeout(timer);
    if(!closed){child.kill();await ended;}
    evidence.windowClosed=true;evidence.windowStderr=stderr;
    if(client){evidence.cleanup=await client.close();save();assert.equal(evidence.cleanup.cleanupComplete,true);}save();
  }
});
