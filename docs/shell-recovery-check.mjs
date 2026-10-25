// Run from an extracted package. No model, account, notification or service calls.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {EventEmitter} from 'node:events';
import {PassThrough} from 'node:stream';
import {VERSION} from '../src/version.mjs';
import {runOwnedCommand} from '../kernel/harness/process-control.mjs';
import {createHarness} from '../kernel/harness/create.mjs';
import {createTools} from '../kernel/harness/tools.mjs';
import {createAuthorizedFiles} from '../kernel/fusion/authorized-files.mjs';
import {assistantServices} from '../src/assistant-services.mjs';
import {previewFor} from '../src/live-preview.mjs';

const root=await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(),'koder-shell-check-')));
const results=[];
const inspection=`powershell -NoProfile -NonInteractive -Command "Get-ChildItem -Path '.' -Recurse -Include *.html -File -ErrorAction SilentlyContinue | Select-String -Pattern 'recovery-marker' -List | Select-Object Path"`;
const uncertain=`powershell -NoProfile -Command "Move-Item missing target -ErrorAction SilentlyContinue; Write-Host ok"`;
function synthetic(){const child=new EventEmitter();child.stdout=new PassThrough();child.stderr=new PassThrough();queueMicrotask(()=>{child.stdout.end('Path\n----\n');child.stderr.end();child.emit('close',0,null);});return child;}
async function check(name,layer,fn){try{await fn();results.push({name,layer,state:'PASS'});}catch(error){results.push({name,layer,state:'FAIL',reason:String(error.message).slice(0,1500)});}}
const step=(id,command)=>({text:'',toolCalls:[{id,name:'shell',arguments:{command,timeout_ms:15000}}]});
try{
  await fs.writeFile(path.join(root,'index.html'),'<!DOCTYPE html><title>recovery-marker</title>');
  await fs.writeFile(path.join(root,'protected.fixture'),'fixture only');
  await check('clean inspection does not block later commands','synthetic-win32',async()=>{
    const result=await runOwnedCommand({cwd:root,command:inspection,platform:'win32',spawnImpl:synthetic});
    assert.equal(result.ok,true);assert.equal(result.resultUnverified,false);assert.equal(result.warningCode,'SHELL_READ_PARTIAL');
  });
  await check('suppressed write remains unknown','synthetic-win32',async()=>{
    const result=await runOwnedCommand({cwd:root,command:uncertain,platform:'win32',spawnImpl:synthetic});
    assert.equal(result.resultUnverified,true);assert.ok(result.uncertaintyReasons.includes('ERRORS_SUPPRESSED'));
  });
  await check('absolute workspace listing and scoped content search','local-filesystem',async()=>{
    const tools=createTools({root});assert.equal((await tools.run('list_dir',{path:root})).ok,true);
    const found=await tools.run('search',{query:'recovery-marker',path:root});assert.equal(found.ok,true);assert.match(found.content,/index.html/);
  });
  await check('a protected descendant leaves accessible search results','injected-access-error',async()=>{
    const capabilities={async status(){return [{name:'files.search',state:'granted',roots:[root]}];},async authorize({path:target}){
      assert.ok(target===root||target.startsWith(root+path.sep));
      if(target===path.join(root,'protected.fixture'))throw Object.assign(Error('owned fixture denial'),{code:'EPERM'});
      return {root,path:target};
    }};
    const found=await createAuthorizedFiles({capabilities}).search({query:'.html'});
    assert.equal(found.partial,true);assert.equal(found.items[0].path,path.join(root,'index.html'));
  });
  await check('reconciliation permits preview readback and reports restricted steering','scripted-harness-local-files',async()=>{
    let calls=0,spawns=0,opens=0;
    const service=assistantServices({command:'chat',opts:{},lang:'zh',env:{KODER_CLI_HOME:path.join(root,'profile')},stdout:{write(){}},io:{openPreviewBrowser:async()=>{opens++;return true;}}},{workspace:root});
    const harness=await createHarness({workspace:root,assistantServices:service,spawnImpl:()=>{spawns++;return synthetic();},providerOverride:{async complete({tools}){
      calls++;
      if(calls===1)return step('unknown',uncertain);
      assert.deepEqual(tools.find(t=>t.name==='workspace_preview')?.parameters.properties.action.enum,['discover','status']);
      if(calls===2){const r=harness.requestSteering(thread.id,'请给出已有预览地址');assert.equal(r.accepted,true);assert.equal(r.restriction,'SHELL_RECONCILIATION_REQUIRED');}
      const action=({2:'discover',3:'status',4:'start'})[calls];
      return action?{text:'',toolCalls:[{id:action,name:'workspace_preview',arguments:{action}}]}:{text:'Readback only; prior result remains unknown.',toolCalls:[]};
    }}});
    const thread=harness.createThread();await harness.addThread(thread);
    try{
      await harness.submit(thread.id,'Inspect previous command');await harness.decideApproval(thread.id,thread.pause.approvalId,true);
      assert.equal(JSON.parse(thread.messages.find(m=>m.toolCallId==='discover').content).kind,'static');
      assert.equal(JSON.parse(thread.messages.find(m=>m.toolCallId==='status').content).state,'not-running');
      assert.equal(thread.messages.find(m=>m.toolCallId==='start').errorCode,'SHELL_RECONCILIATION_REQUIRED');
      assert.equal(thread.messages.find(m=>m.toolCallId==='unknown').receipt.state,'unknown');
      assert.equal(spawns,1);assert.equal(opens,0);assert.equal(previewFor(root),undefined);
    }finally{await harness.cancel(thread.id);await service.close();await previewFor(root)?.close();}
  });
  if(process.platform!=='win32')results.push({name:'PowerShell inspection then next approved command',layer:'native-windows',state:'NOT_RUN',reason:'Requires native Windows 10/11; other hosts do not emulate this acceptance.'});
  else await check('PowerShell inspection then next approved command','native-windows',async()=>{
    let calls=0;
    const harness=await createHarness({workspace:root,providerOverride:{async complete(){calls++;return calls===1?step('inspect',inspection):calls===2?step('next','echo RECOVERY_NEXT'):{text:'Owned fixture finished.',toolCalls:[]};}}});
    const thread=harness.createThread();await harness.addThread(thread);await harness.submit(thread.id,'Inspect only this temporary fixture, then echo RECOVERY_NEXT.');
    assert.equal(thread.pause?.kind,'approval');await harness.decideApproval(thread.id,thread.pause.approvalId,true);
    assert.equal(thread.pause?.kind,'approval','clean inspection must not prevent the next approval');await harness.decideApproval(thread.id,thread.pause.approvalId,true);
    assert.equal(thread.status,'idle');assert.equal(calls,3);
    const next=thread.messages.find(m=>m.role==='tool'&&m.toolCallId==='next');assert.equal(next.receipt.state,'process-exited');assert.match(next.content,/RECOVERY_NEXT/);
  });
}finally{await fs.rm(root,{recursive:true,force:true});}
console.log(JSON.stringify({version:VERSION,platform:process.platform,arch:process.arch,node:process.version,results},null,2));
if(results.some(r=>r.state==='FAIL'))process.exitCode=1;
