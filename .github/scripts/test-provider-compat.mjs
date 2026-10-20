import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {PassThrough,Writable} from 'node:stream';
import {pathToFileURL} from 'node:url';
const root=process.env.KODER_ACCEPTANCE_PACKAGE;assert.ok(root);
const load=rel=>import(pathToFileURL(path.join(root,rel)));
const {presets,presetRecord}=await load('src/commands/model.mjs');
const {normalizeRecord}=await load('src/provider.mjs');
const {modelEndpoint,withModelEndpoint}=await load('src/model-http.mjs');
const {importKernel}=await load('src/agent.mjs');
const {createProvider}=await importKernel('harness/providers.mjs',{});
const {runCli}=await load('src/cli.mjs');
const {writeAcceptance}=await load('src/eula.mjs');
const json=x=>new Response(JSON.stringify(x),{headers:{'content-type':'application/json'}});
const tmp=()=>fs.mkdtempSync(path.join(os.tmpdir(),'koder-provider-'));
async function cli(argv,{home=tmp(),cwd=home,env={},stdin='',fetchImpl}={}){
 let out='',err='';const output=new Writable({write(c,e,cb){out+=c;cb();}}),error=new Writable({write(c,e,cb){err+=c;cb();}}),input=new PassThrough();input.end(stdin);
 const childEnv={PATH:process.env.PATH,SystemRoot:process.env.SystemRoot,KODER_CLI_HOME:home,NO_COLOR:'1',...env};writeAcceptance(childEnv);
 const code=await runCli(argv,{cwd,env:childEnv,stdin:input,stdout:output,stderr:error,noTerminal:true,fetchImpl});return {code,out,err,home};
}
test('agent picker excludes stopped services, batch, audio and safety-only models',async()=>{
 const list=await presets({env:{}});assert.ok(!list.some(p=>p.id==='yi'));
 for(const p of list)for(const id of p.models||[])assert.doesNotMatch(id,/:batch$|voxtral|safeguard|transcribe|tts|computer-use-preview/i);
 assert.equal(list.find(p=>p.id==='chatgpt').model,'gpt-6.1-sol');
 assert.ok(list.find(p=>p.id==='claude').models.includes('claude-sonnet-5-5'));
 assert.ok(list.find(p=>p.id==='minimax').models.includes('MiniMax-M3.1-Flash'));
 assert.equal(list.find(p=>p.id==='mistral').model,'mistral-large-4');
});
test('OpenAI tool requests use Responses and valid explicit protocol survives configuration',async()=>{
 const record=normalizeRecord({model:'gpt-6.1-sol',baseUrl:'https://api.openai.com/v1',apiKey:'fixture-key'});
 assert.equal(record.protocol,'responses');assert.equal(modelEndpoint(record),'https://api.openai.com/v1/responses');
 let body;const p=createProvider({provider:record,fetchImpl:withModelEndpoint(async(url,init)=>{body=JSON.parse(init.body);return json({status:'completed',output:[{type:'message',role:'assistant',content:[{type:'output_text',text:'ready'}]}]});},record)});
 assert.equal((await p.complete({messages:[{role:'user',content:'ready'}],tools:[{name:'read_fixture',parameters:{type:'object',properties:{}}}]})).text,'ready');
 assert.equal(body.store,false);assert.ok(Array.isArray(body.input));assert.equal(body.tools[0].name,'read_fixture');assert.equal(body.max_tokens,undefined);
 assert.equal(normalizeRecord({model:'custom',baseUrl:'http://localhost/v1',protocol:'responses',apiKey:'fixture'}).protocol,'responses');
 assert.throws(()=>normalizeRecord({model:'custom',baseUrl:'http://localhost/v1',protocol:'unknown',apiKey:'fixture'}));
});
test('Gemini tool signatures survive streaming and replay',async()=>{
 const record=normalizeRecord({model:'gemini-3.8-flash',baseUrl:'https://generativelanguage.googleapis.com/v1beta/openai',apiKey:'fixture'});let n=0;
 const p=createProvider({provider:record,fetchImpl:withModelEndpoint(async(_url,init)=>{
  const body=JSON.parse(init.body);if(n++){assert.equal(body.messages[0].tool_calls[0].extra_content.google.thought_signature,'opaque-signature');return json({choices:[{message:{content:'ready'},finish_reason:'stop'}]});}
  return new Response('data: '+JSON.stringify({choices:[{delta:{tool_calls:[{index:0,id:'call1',function:{name:'read_fixture',arguments:'{}'},extra_content:{google:{thought_signature:'opaque-signature'}}}]},finish_reason:'tool_calls'}]})+'\n\ndata: [DONE]\n\n',{headers:{'content-type':'text/event-stream'}});
 },record)});
 const first=await p.complete({messages:[{role:'user',content:'read'}],tools:[]});
 await p.complete({messages:[{role:'assistant',toolCalls:first.toolCalls},{role:'tool',toolCallId:'call1',content:'fixture'}],tools:[]});
});
test('Spark tool array switch and official model metadata survive preset -> CLI record',async()=>{
 const list=await presets({env:{}}),record=normalizeRecord({...presetRecord(list.find(p=>p.id==='spark')),apiKey:'fixture'});
 const p=createProvider({provider:{...record,id:'cli'},fetchImpl:async(_u,init)=>{assert.equal(JSON.parse(init.body).tool_calls_switch,true);return json({choices:[{message:{content:'ready'},finish_reason:'stop'}]});}});
 await p.complete({messages:[{role:'user',content:'ready'}],tools:[{name:'read_fixture',parameters:{type:'object'}}]});
});
test('native CLI preserves private reasoning between actual tool requests',async()=>{
 const home=tmp(),cwd=tmp();fs.writeFileSync(cwd+'/fixture.txt','owned fixture');fs.writeFileSync(home+'/provider.json',JSON.stringify({model:'mimo-v2.6-pro',baseUrl:'https://api.xiaomimimo.com/v1',apiKey:'sk-fixture'}));let n=0;
 const result=await cli(['run','Read fixture.txt','--no-memory'],{home,cwd,fetchImpl:async(_u,init)=>{
  const b=JSON.parse(init.body);if(n++){const a=b.messages.find(m=>m.role==='assistant'&&m.tool_calls?.length);assert.equal(a.reasoning_content,'private trace');assert.ok(b.messages.some(m=>m.role==='tool'&&m.content.includes('owned fixture')));return json({choices:[{message:{content:'ready'},finish_reason:'stop'}]});}
  return json({choices:[{message:{reasoning_content:'private trace',tool_calls:[{id:'call_fixture',type:'function',function:{name:'read_file',arguments:'{"path":"fixture.txt"}'}}]},finish_reason:'tool_calls'}]});
 }});assert.equal(result.code,0,result.err);assert.equal(n,2);assert.doesNotMatch(result.out,/private trace/);
});
test('every offered cloud preset completes a native tool/result round trip with its declared wire protocol',async()=>{
 const list=await presets({env:{}});
 for(const preset of list.filter(p=>!['local','custom','kilo-free'].includes(p.id))){
  const record=normalizeRecord({...presetRecord(preset),apiKey:preset.id==='mimo-token-plan'?'tp-fixture':preset.id.startsWith('aliyun-')?'sk-sp-fixture':'sk-fixture'});let n=0;
  const p=createProvider({provider:{...record,id:'cli'},fetchImpl:withModelEndpoint(async(url,init)=>{
   const body=JSON.parse(init.body),second=!!n++;assert.equal(new URL(url).origin,new URL(record.baseUrl).origin,preset.id);
   if(record.protocol==='responses'){
    assert.ok(body.input.some(m=>second?m.type==='function_call_output':m.role==='user'),preset.id);
    return json({status:'completed',output:second?[{type:'message',content:[{type:'output_text',text:'ready'}]}]:[{type:'function_call',call_id:'owned_call',name:'read_fixture',arguments:'{}'}]});
   }
   if(record.protocol==='anthropic'){
    if(second)assert.ok(body.messages.some(m=>Array.isArray(m.content)&&m.content.some(c=>c.type==='tool_result')),preset.id);
    return json({stop_reason:second?'end_turn':'tool_use',content:second?[{type:'text',text:'ready'}]:[{type:'thinking',thinking:'private',signature:'signed-state'},{type:'tool_use',id:'owned_call',name:'read_fixture',input:{}}]});
   }
   if(second)assert.ok(body.messages.some(m=>m.role==='tool'),preset.id);
   return json({choices:[{finish_reason:second?'stop':'tool_calls',message:second?{content:'ready'}:{content:null,tool_calls:[{id:'owned_call',function:{name:'read_fixture',arguments:'{}'}}]}}]});
  },record)});
  const messages=[{role:'user',content:'Read owned fixture'}],tools=[{name:'read_fixture',parameters:{type:'object',properties:{}}}];const a=await p.complete({messages,tools});
  messages.push({role:'assistant',content:a.text,toolCalls:a.toolCalls,providerReasoning:a.providerReasoning,providerBlocks:a.providerBlocks},{role:'tool',toolCallId:'owned_call',content:'owned fixture'});
  assert.equal((await p.complete({messages,tools})).text,'ready',preset.id);assert.equal(n,2,preset.id);
 }
});

test('Responses streaming retains encrypted reasoning and function call IDs in actual CLI continuation',async()=>{
 const home=tmp(),cwd=tmp();fs.writeFileSync(cwd+'/fixture.txt','owned fixture');fs.writeFileSync(home+'/provider.json',JSON.stringify({model:'gpt-6.1-sol',baseUrl:'https://api.openai.com/v1',apiKey:'sk-fixture'}));let n=0;
 const result=await cli(['run','Read fixture.txt','--no-memory'],{home,cwd,fetchImpl:async(url,init)=>{
  const body=JSON.parse(init.body);assert.equal(url,'https://api.openai.com/v1/responses');
  if(n++){assert.ok(body.input.some(i=>i.type==='reasoning'&&i.encrypted_content==='opaque-private-state'));assert.ok(body.input.some(i=>i.type==='function_call_output'&&i.call_id==='owned_call'&&i.output.includes('owned fixture')));return json({status:'completed',output:[{type:'message',content:[{type:'output_text',text:'ready'}]}]});}
  const output=[{type:'reasoning',id:'rs_fixture',summary:[],encrypted_content:'opaque-private-state'},{type:'function_call',id:'fc_fixture',call_id:'owned_call',name:'read_file',arguments:'{"path":"fixture.txt"}'}];
  const events=[{type:'response.created'},{type:'response.reasoning_text.delta',delta:'must stay private'},{type:'response.completed',response:{status:'completed',output}}];
  const bytes=new TextEncoder().encode(events.map(e=>'data: '+JSON.stringify(e)+'\n\n').join(''));
  return new Response(new ReadableStream({start(c){for(let i=0;i<bytes.length;i+=11)c.enqueue(bytes.slice(i,i+11));c.close();}}),{headers:{'content-type':'text/event-stream'}});
 }});assert.equal(result.code,0,result.err);assert.equal(n,2);assert.doesNotMatch(result.out,/opaque-private-state|must stay private/);
});

test('Responses rejects incomplete, duplicate, invalid tool arguments and interrupted streams without replay',async()=>{
 const record={model:'fixture',baseUrl:'http://fixture.invalid/v1',apiKey:'fixture',protocol:'responses'};
 for(const output of [[],[{type:'function_call',call_id:'x',name:'read',arguments:'[]'}],[{type:'function_call',call_id:'x',name:'read',arguments:'{}'},{type:'function_call',call_id:'x',name:'read',arguments:'{}'}]]){
  const p=createProvider({provider:record,fetchImpl:async()=>json({status:'completed',output})});await assert.rejects(()=>p.complete({messages:[],tools:[]}));
 }
 let n=0;const p=createProvider({provider:record,fetchImpl:async()=>{n++;return new Response('data: {"type":"response.output_text.delta","delta":"partial"}\n\n',{headers:{'content-type':'text/event-stream'}});}});
 await assert.rejects(()=>p.complete({messages:[],tools:[]}));assert.equal(n,1);
});

test('connection check differentiates text-only models from a verified tool continuation',async()=>{
 const home=tmp();fs.writeFileSync(home+'/provider.json',JSON.stringify({model:'fixture',baseUrl:'http://fixture.invalid/v1',apiKey:'fixture'}));
 const text=()=>json({choices:[{finish_reason:'stop',message:{content:'ready'}}]});
 const a=await cli(['model','test'],{home,fetchImpl:text});assert.equal(a.code,0);assert.match(a.out,/仅文字回复/);
 const b=await cli(['model','test','--tools'],{home,fetchImpl:text});assert.equal(b.code,2);
 let n=0;const c=await cli(['model','test','--tools'],{home,fetchImpl:async()=>json({choices:[{finish_reason:n?'stop':'tool_calls',message:n++?{content:'ready'}:{tool_calls:[{id:'probe',function:{name:'koder_connection_probe',arguments:'{"nonce":"koder-check"}'}}]}}]})});assert.equal(c.code,0,c.err);assert.equal(n,2);assert.match(c.out,/工具调用与续答/);
});

test('100000000-second deadline never overflows Node timers and disposes each scheduled chunk',async()=>{
 const {downloadDeadline,downloadTimeout}=await load('src/download-timeout.mjs');assert.equal(downloadTimeout({}),100000000);assert.equal(downloadTimeout({KODER_DOWNLOAD_TIMEOUT_SECONDS:'100000000'}),100000000);assert.throws(()=>downloadTimeout({KODER_DOWNLOAD_TIMEOUT_SECONDS:'100000001'}));
 let clock=0,pending,delay,cancelled=false;const deadline=downloadDeadline(100000000,{now:()=>clock,schedule:(fn,ms)=>{pending=fn;delay=ms;return 77;},cancel:id=>{assert.equal(id,77);cancelled=true;}});
 assert.equal(delay,2147483647);assert.equal(deadline.signal.aborted,false);clock=delay;pending();assert.equal(deadline.signal.aborted,false);
 clock=100000000000;pending();assert.equal(deadline.signal.aborted,true);deadline.dispose();assert.equal(cancelled,true);
});

test('account model refresh filters non-task endpoints without changing credentials or active model',async()=>{
 const home=tmp(),file=home+'/provider.json',original=JSON.stringify({model:'fixture',baseUrl:'http://fixture.invalid/v1',apiKey:'fixture-key'});fs.writeFileSync(file,original);
 const r=await cli(['model','refresh'],{home,fetchImpl:async(url,init)=>{assert.equal(url,'http://fixture.invalid/v1/models');assert.equal(init.redirect,'error');return json({data:[{id:'new-task-model',supported_parameters:['tools']},{id:'text-only',supported_parameters:['temperature']},{id:'batch-only:batch',supported_parameters:['tools']},{id:'tts-special',supported_parameters:[]}]});}});
 assert.equal(r.code,0,r.err);assert.equal(fs.readFileSync(file,'utf8'),original);const data=JSON.parse(r.out);assert.deepEqual(data.models.map(m=>m.id),['new-task-model','text-only']);assert.ok(!r.out.includes('fixture-key'));
});

test('saved smaller limits and custom proxy protocol remain authoritative',()=>{
 const r=normalizeRecord({model:'gpt-6.1-sol',baseUrl:'https://proxy.example/v1',apiKey:'fixture',protocol:'openai',contextWindow:16384,maxOutput:1024});assert.equal(r.protocol,'openai');assert.equal(r.spec,undefined);assert.equal(r.contextWindow,16384);
 const limits=normalizeRecord({model:'kimi-k2.6',baseUrl:'https://api.moonshot.cn/v1',apiKey:'fixture'});assert.equal(limits.contextWindow,262144);
});

test('Hermes fallback cannot silently reroute a Responses-only provider',async()=>{
 const {hermesMiMoConfig}=await load('src/mimo.mjs');const record=normalizeRecord({model:'openai/gpt-6.1-sol',baseUrl:'https://api.perplexity.ai/v1',apiKey:'fixture',protocol:'responses'});
 assert.throws(()=>hermesMiMoConfig({env:{KODER_CLI_HOME:tmp()}},record),/Use koder engine use koder/);
});

test('legacy fallback selection defaults to native and cannot launch an external process',async()=>{
 const {engineFor}=await load('src/session.mjs');
 const ctx={opts:{},env:{},config:{engine:'hermes',engines:{hermes:{command:'must-not-start'}}}};assert.equal(engineFor(ctx),null);
 assert.throws(()=>engineFor({...ctx,opts:{engine:'hermes'}}),e=>e.key==='engine.fallbackDisabled');
 const home=tmp();const r=await cli(['engine','use','hermes'],{home});assert.equal(r.code,2);assert.match(r.err,/禁用|disabled/);assert.ok(!fs.existsSync(home+'/config.json')||JSON.parse(fs.readFileSync(home+'/config.json')).engine!=='hermes');
});
