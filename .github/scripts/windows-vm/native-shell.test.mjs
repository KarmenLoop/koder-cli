import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {tmp, cli, scripted, toolStep, textStep, write} from './helpers.mjs';

test('PowerShell read-only inspection does not block a later authorized CMD write', {timeout:45000}, async t=>{
  assert.equal(process.platform,'win32');
  const home=tmp('koder-native-shell-');
  t.after(()=>fs.rmSync(home,{recursive:true,force:true}));
  write(home,{'input.txt':'OWNED_WINDOWS_INPUT'});
  const provider=scripted([
    toolStep('shell',{command:'powershell -NoProfile -NonInteractive -Command "Get-ChildItem -LiteralPath . -File -ErrorAction SilentlyContinue | Select-Object Name"'}),
    toolStep('shell',{command:'echo OWNED_WINDOWS_OUTPUT>"result.txt"'}),
    toolStep('read_file',{path:'result.txt'}),
    ({messages})=>{assert.match(messages.findLast(m=>m.role==='tool').content,/OWNED_WINDOWS_OUTPUT/);return textStep('The owned diagnostic result was saved and read back.');}
  ]);
  const result=await cli(['run','Inspect the owned diagnostic records and save the requested result','--yes','--json','--no-memory'],{home,provider});
  assert.equal(result.code,0,result.err+'\n'+result.out.slice(-4000));
  assert.equal(fs.readFileSync(path.join(home,'result.txt'),'utf8').trim(),'OWNED_WINDOWS_OUTPUT');
  assert.doesNotMatch(result.err,/SHELL_RECONCILIATION_REQUIRED|HARNESS_JIT_STOP/);
});
