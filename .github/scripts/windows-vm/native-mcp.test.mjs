import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {loadRelease} from './release.mjs';
const {bundledWindowsMcp, verifyWindowsMcp} = await loadRelease('src/windows-mcp-bundle.mjs');
const {inspectNotificationChannel, notifyNative} = await loadRelease('src/agentd/notifications.mjs');
const evidence = {};
function save() { fs.writeFileSync(path.join(process.env.KODER_VM_EVIDENCE, 'native-receipts.json'), JSON.stringify(evidence, null, 2)+'\n'); }

test('bundled Windows MCP starts without system Python and answers read-only RPC calls', {timeout:90000}, async t => {
  assert.equal(process.platform, 'win32');
  const launch = bundledWindowsMcp();
  evidence.bundle = verifyWindowsMcp({full:true}); save();
  const env = {...process.env, PATH:path.join(process.env.SystemRoot, 'System32'), ANONYMIZED_TELEMETRY:'false', PYTHONUTF8:'1'};
  const child = spawn(launch.command, launch.args, {env, windowsHide:true, stdio:['pipe','pipe','pipe']});
  let stderr = '', buffer = '', sequence = 0;
  const waiters = new Map();
  const ended = new Promise(resolve => child.once('exit', (code, signal) => {
    for (const waiter of waiters.values()) waiter.reject(Error(`MCP exited: ${code}/${signal}; ${stderr.slice(-4000)}`));
    resolve({code, signal});
  }));
  child.stderr.on('data', chunk => {stderr=(stderr+chunk).slice(-16000);});
  child.stdin.on('error', ()=>{});
  child.stdout.on('data', chunk => {
    buffer += chunk;
    for (;;) {
      const newline = buffer.indexOf('\n'); if (newline < 0) break;
      const line = buffer.slice(0, newline); buffer = buffer.slice(newline+1);
      let message; try {message=JSON.parse(line);} catch {continue;}
      const waiter = waiters.get(message.id); if (!waiter) continue;
      waiters.delete(message.id);
      if (message.error) waiter.reject(Error(JSON.stringify(message.error))); else waiter.resolve(message.result);
    }
  });
  t.after(async () => {
    child.stdin.end();
    let timer;
    const closed = await Promise.race([ended.then(()=>true), new Promise(resolve=>{timer=setTimeout(()=>resolve(false),3000);})]);
    clearTimeout(timer); if (!closed) {child.kill(); await ended;}
    evidence.mcpStderr=stderr; save();
  });
  async function call(method, params) {
    const id=++sequence; let timer;
    const reply=new Promise((resolve,reject)=>{waiters.set(id,{resolve,reject});timer=setTimeout(()=>{waiters.delete(id);reject(Error(`MCP timeout: ${method}; ${stderr.slice(-4000)}`));},45000);});
    child.stdin.write(JSON.stringify({jsonrpc:'2.0',id,method,params})+'\n');
    return reply.finally(()=>clearTimeout(timer));
  }
  evidence.initialize=await call('initialize',{protocolVersion:'2024-11-05',capabilities:{},clientInfo:{name:'koder-owned-windows-acceptance',version:'1.0.0'}}); save();
  child.stdin.write(JSON.stringify({jsonrpc:'2.0',method:'notifications/initialized'})+'\n');
  const {tools}=await call('tools/list',{});
  assert(tools.length>0); evidence.tools=tools.map(tool=>tool.name); save();
  for (const name of ['ControlStatus','DisplayInventory']) {
    assert(tools.some(tool=>tool.name===name), `Missing ${name}`);
    const result=await call('tools/call',{name,arguments:{}});
    evidence[name]=result; save(); assert.notEqual(result.isError,true,JSON.stringify(result));
    assert(result.content?.length>0);
  }
});

test('native Windows Toast adapter reports a structured receipt without claiming visibility', {timeout:25000}, async()=>{
  evidence.notificationInspect=await inspectNotificationChannel(); save();
  evidence.notificationSubmit=await notifyNative({kind:'task-done',lang:'en',durationMs:125000}); save();
  for (const [name, receipt] of Object.entries(evidence).filter(([name])=>name.startsWith('notification'))) {
    assert(['available','submitted','unavailable','denied','UNKNOWN'].includes(receipt.state), name);
    assert.equal(receipt.displayVerified,false); assert.equal(typeof receipt.reason,'string');
  }
});

test('Koder MCP transport initializes the bundled server, calls a real tool and cleans up its owned tree', {timeout:45000}, async()=>{
  const {connectStdio}=await loadRelease('kernel/loop/mcp-stdio.mjs');
  const launch=bundledWindowsMcp();
  const client=connectStdio({...launch,env:{SystemRoot:process.env.SystemRoot,PATH:path.join(process.env.SystemRoot,'System32'),ANONYMIZED_TELEMETRY:'false',PYTHONUTF8:'1'}});
  try {
    evidence.koderInitialize=await client.request('initialize',{}); save();
    const listed=await client.request('tools/list',{});
    assert(listed.tools.some(tool=>tool.name==='ControlStatus'));
    evidence.koderControlStatus=await client.request('tools/call',{name:'ControlStatus',arguments:{}}); save();
    assert.notEqual(evidence.koderControlStatus.isError,true);
    assert(evidence.koderControlStatus.content?.length>0);
  } finally {
    evidence.koderCleanup=await client.close(); save();
    assert.equal(evidence.koderCleanup.cleanupComplete,true);
  }
});
