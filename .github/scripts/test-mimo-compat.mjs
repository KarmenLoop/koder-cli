import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {PassThrough,Writable} from 'node:stream';
import {pathToFileURL} from 'node:url';
const root=process.env.KODER_ACCEPTANCE_PACKAGE;
assert.ok(root,'KODER_ACCEPTANCE_PACKAGE must point at the installed package');
const load=rel=>import(pathToFileURL(path.join(root,rel)));
const {presets,presetRecord}=await load('src/commands/model.mjs');
const {normalizeRecord}=await load('src/provider.mjs');
const {withModelEndpoint,modelEndpoint}=await load('src/model-http.mjs');
const {importKernel}=await load('src/agent.mjs');
const {runCli}=await load('src/cli.mjs');
const {writeAcceptance}=await load('src/eula.mjs');
const {hermesMiMoConfig}=await load('src/mimo.mjs');
const tmp=()=>fs.mkdtempSync(path.join(os.tmpdir(),'koder-mimo-'));
async function cli(argv,{home=tmp(),cwd=home,env={},stdin=''}={}){
 let out='',err='';const output=new Writable({write(c,e,cb){out+=c;cb();}}),error=new Writable({write(c,e,cb){err+=c;cb();}}),input=new PassThrough();input.end(stdin);
 const childEnv={PATH:process.env.PATH,SystemRoot:process.env.SystemRoot,KODER_CLI_HOME:home,NO_COLOR:'1',...env};writeAcceptance(childEnv);
 const code=await runCli(argv,{cwd,env:childEnv,stdin:input,stdout:output,stderr:error,noTerminal:true});return {code,out,err,home};
}
const key='tp-fixture-never-a-real-credential';
const context={env:{}};
test('MiMo offers explicit pay-as-you-go and Token Plan presets with Pro and Flash',async()=>{
 const list=await presets(context),paid=list.find(p=>p.id==='mimo'),plan=list.find(p=>p.id==='mimo-token-plan');
 assert.ok(plan,'Token Plan must be independently selectable');
 assert.equal(paid.baseUrl,'https://api.xiaomimimo.com/v1');assert.equal(plan.baseUrl,'https://token-plan-cn.xiaomimimo.com/v1');
 for(const p of [paid,plan]){assert.ok(p.models.includes('mimo-v2.6-pro'));assert.ok(p.models.includes('mimo-v2.6-flash'));assert.equal(p.contextWindow,1048576);}
});
test('MiMo rejects mismatched official endpoint and credential class before a request',()=>{
 for(const [baseUrl,apiKey] of [['https://api.xiaomimimo.com/v1',key],['https://token-plan-cn.xiaomimimo.com/v1','sk-fixture']]){
  assert.throws(()=>normalizeRecord({model:'mimo-v2.6-pro',baseUrl,apiKey}),e=>e.key==='model.mimoKeyMismatch' && !e.message.includes(apiKey));
 }
 assert.doesNotThrow(()=>normalizeRecord({model:'mimo-v2.6-pro',baseUrl:'https://proxy.example/v1',apiKey:key}));
});
test('MiMo uses the official completion budget field and retains reasoning through a tool round trip',async()=>{
 const {createProvider}=await importKernel('harness/providers.mjs',{}),list=await presets(context);
 for(const id of ['mimo','mimo-token-plan'])for(const model of ['mimo-v2.6-pro','mimo-v2.6-flash']){
  const p=list.find(p=>p.id===id);assert.ok(p,'Missing '+id);
  const record=normalizeRecord({...presetRecord(p),model,apiKey:id==='mimo'?'sk-fixture':key});const requests=[];
  const fetchImpl=withModelEndpoint(async(url,init)=>{
   const body=JSON.parse(init.body);requests.push(body);assert.equal(url,record.baseUrl+'/chat/completions');assert.equal(new Headers(init.headers).get('api-key'),record.apiKey);
   assert.ok(body.max_completion_tokens>0);assert.equal(body.max_tokens,undefined);assert.equal(body.model,model);
   const message=requests.length===1?{content:null,reasoning_content:'private fixture reasoning',tool_calls:[{id:'fixture_call',type:'function',function:{name:'read_fixture',arguments:'{}'}}]}:{content:'ready'};
   return new Response(JSON.stringify({choices:[{message,finish_reason:requests.length===1?'tool_calls':'stop'}]}),{headers:{'content-type':'application/json'}});
  },record);
  const provider=createProvider({provider:{...record,id:'cli'},fetchImpl});const first=await provider.complete({messages:[{role:'user',content:'read fixture'}],tools:[]});
  await provider.complete({messages:[{role:'assistant',content:first.text,providerReasoning:first.providerReasoning,toolCalls:first.toolCalls},{role:'tool',toolCallId:'fixture_call',content:'fixture'}],tools:[]});
  assert.equal(requests[1].messages[0].reasoning_content,'private fixture reasoning');assert.equal(requests[1].messages[1].tool_call_id,'fixture_call');
 }
});
test('MiMo Anthropic compatibility uses the exact messages path and accepted API-key header',async()=>{
 const {createProvider}=await importKernel('harness/providers.mjs',{});
 const record=normalizeRecord({model:'mimo-v2.6-pro',protocol:'anthropic',baseUrl:'https://token-plan-cn.xiaomimimo.com/anthropic',apiKey:key});
 assert.equal(modelEndpoint(record),'https://token-plan-cn.xiaomimimo.com/anthropic/v1/messages');
 const provider=createProvider({provider:record,fetchImpl:withModelEndpoint(async(url,init)=>{
  assert.equal(url,modelEndpoint(record));assert.equal(new Headers(init.headers).get('api-key'),key);
  return new Response(JSON.stringify({content:[{type:'text',text:'ready'}],stop_reason:'end_turn'}),{headers:{'content-type':'application/json'}});
 },record)});
 assert.equal((await provider.complete({messages:[{role:'user',content:'ready'}],tools:[]})).text,'ready');
});
test('Hermes gets the selected MiMo model over ACP and credentials in its child environment only',async()=>{
 const home=tmp(),workspace=tmp(),fixture=path.join(home,'agent.mjs'),record={model:'mimo-v2.6-flash',baseUrl:'https://token-plan-cn.xiaomimimo.com/v1',apiKey:key};
 fs.writeFileSync(path.join(home,'provider.json'),JSON.stringify(record));
 fs.writeFileSync(path.join(home,'config.json'),JSON.stringify({engine:'hermes',engines:{hermes:{command:process.execPath,args:[fixture]}}}));
 fs.writeFileSync(fixture,`import readline from 'node:readline';let selected=false;for await(const line of readline.createInterface({input:process.stdin})){const m=JSON.parse(line);let result={};if(m.method==='initialize')result={protocolVersion:1};if(m.method==='session/new')result={sessionId:'fixture'};if(m.method==='session/set_model'){selected=m.params.modelId==='custom:mimo-v2.6-flash'&&process.env.KODER_HERMES_MODEL_KEY===${JSON.stringify(key)}&&JSON.parse((await import('node:fs')).readFileSync((await import('node:path')).join(process.env.HERMES_HOME,'config.yaml'),'utf8')).model.base_url===${JSON.stringify(record.baseUrl)};}if(m.method==='session/prompt'){process.stdout.write(JSON.stringify({jsonrpc:'2.0',method:'session/update',params:{sessionId:'fixture',update:{sessionUpdate:'agent_message_chunk',content:{type:'text',text:selected?'MiMo selected':'wrong model'}}}})+'\\n');result={stopReason:'end_turn'};}if(m.id!==undefined)process.stdout.write(JSON.stringify({jsonrpc:'2.0',id:m.id,result})+'\\n');}`);
 const originalHermes=path.join(home,'original-hermes');fs.mkdirSync(originalHermes);fs.writeFileSync(path.join(originalHermes,'config.yaml'),'original sentinel');
 const before={key:process.env.KODER_HERMES_MODEL_KEY,home:process.env.HERMES_HOME};
 const result=await cli(['ask','hello','--no-memory'],{home,cwd:workspace,env:{HERMES_HOME:originalHermes}});
 assert.equal(result.code,0,result.err);assert.match(result.out,/MiMo selected/);assert.deepEqual({key:process.env.KODER_HERMES_MODEL_KEY,home:process.env.HERMES_HOME},before);
 assert.doesNotMatch(result.out+result.err,new RegExp(key));assert.equal(fs.readFileSync(path.join(originalHermes,'config.yaml'),'utf8'),'original sentinel');
 const profile=path.join(home,'engines','hermes',fs.readdirSync(path.join(home,'engines','hermes'))[0]);const config=fs.readFileSync(path.join(profile,'config.yaml'),'utf8');assert.ok(!config.includes(key));assert.equal(JSON.parse(config).model.key_env,'KODER_HERMES_MODEL_KEY');
});

test('MiMo streaming joins fragmented tool arguments while private reasoning stays out of visible deltas',async()=>{
 const {createProvider}=await importKernel('harness/providers.mjs',{});
 const record=normalizeRecord({model:'mimo-v2.6-flash',baseUrl:'https://token-plan-sgp.xiaomimimo.com/v1',apiKey:key});
 const data=[{reasoning_content:'private reasoning'},{content:'Reading '},{tool_calls:[{index:0,id:'call_stream',function:{name:'read_fixture',arguments:'{"path":'}}]},{tool_calls:[{index:0,function:{arguments:'"fixture.txt"}'}}]}].map(delta=>'data: '+JSON.stringify({choices:[{delta}]})+'\n\n').join('')+'data: '+JSON.stringify({choices:[{delta:{},finish_reason:'tool_calls'}]})+'\n\ndata: [DONE]\n\n';
 const provider=createProvider({provider:record,fetchImpl:withModelEndpoint(async()=>new Response(new ReadableStream({start(c){const bytes=new TextEncoder().encode(data);for(let i=0;i<bytes.length;i+=7)c.enqueue(bytes.slice(i,i+7));c.close();}}),{headers:{'content-type':'text/event-stream'}}),record)});
 let visible='';const value=await provider.complete({messages:[{role:'user',content:'read fixture'}],tools:[],onDelta:t=>visible+=t});
 assert.equal(visible,'Reading ');assert.equal(value.providerReasoning,'private reasoning');assert.deepEqual(value.toolCalls,[{id:'call_stream',name:'read_fixture',arguments:{path:'fixture.txt'}}]);
});
test('MiMo explicit account limits and custom proxies remain authoritative',()=>{
 const record=normalizeRecord({model:'mimo-v2.6-pro',baseUrl:'https://proxy.example/v1',apiKey:key,contextWindow:32768,maxOutput:1024});
 assert.equal(record.baseUrl,'https://proxy.example/v1');assert.equal(record.contextWindow,32768);assert.equal(record.maxOutput,1024);assert.equal(record.spec,undefined);
 for(const host of ['cn','sgp','ams'])assert.doesNotThrow(()=>normalizeRecord({model:'mimo-v2.6-flash',baseUrl:`https://token-plan-${host}.xiaomimimo.com/v1`,keyEnv:'MIMO_TOKEN_PLAN_API_KEY'},{MIMO_TOKEN_PLAN_API_KEY:key}));
});
test('MiMo wrong protocol gives a local diagnostic without sending credentials',async()=>{
 const home=tmp(),result=await cli(['model','set','--model','mimo-v2.6-pro','--base-url','https://token-plan-cn.xiaomimimo.com/anthropic','--protocol','openai','--key-stdin'],{home,stdin:key});
 assert.equal(result.code,2);assert.match(result.err,/MiMo.*OpenAI.*Anthropic/);assert.ok(!fs.existsSync(path.join(home,'provider.json')));assert.ok(!result.err.includes(key));
});

test('Hermes profile keeps non-model settings and refuses a changed credential destination',async()=>{
 const home=tmp(),ctx={env:{KODER_CLI_HOME:home}},record=normalizeRecord({model:'mimo-v2.6-pro',baseUrl:'https://token-plan-cn.xiaomimimo.com/v1',apiKey:key});
 const first=hermesMiMoConfig(ctx,record),file=path.join(first.env.HERMES_HOME,'config.yaml'),config=JSON.parse(fs.readFileSync(file,'utf8'));config.agent={disabled_toolsets:['terminal']};fs.writeFileSync(file,JSON.stringify(config));
 const second=hermesMiMoConfig(ctx,{...record,apiKey:'tp-rotated-fixture'});assert.equal(second.env.HERMES_HOME,first.env.HERMES_HOME);assert.equal(second.env.KODER_HERMES_MODEL_KEY,'tp-rotated-fixture');assert.deepEqual(JSON.parse(fs.readFileSync(file,'utf8')).agent,config.agent);
 config.model.base_url='https://unrelated.example/v1';fs.writeFileSync(file,JSON.stringify(config));assert.throws(()=>hermesMiMoConfig(ctx,record),e=>e.key==='model.hermesProfileChanged');assert.equal(JSON.parse(fs.readFileSync(file,'utf8')).model.base_url,'https://unrelated.example/v1');
});
test('Hermes refusing model selection stops before any prompt and redacts the credential',async()=>{
 const home=tmp(),fixture=path.join(home,'refuse.mjs'),marker=path.join(home,'unexpected-prompt');
 fs.writeFileSync(path.join(home,'provider.json'),JSON.stringify({model:'mimo-v2.6-pro',baseUrl:'https://token-plan-cn.xiaomimimo.com/v1',apiKey:key}));fs.writeFileSync(path.join(home,'config.json'),JSON.stringify({engine:'hermes',engines:{hermes:{command:process.execPath,args:[fixture]}}}));
 fs.writeFileSync(fixture,`import readline from 'node:readline';import fs from 'node:fs';for await(const line of readline.createInterface({input:process.stdin})){const m=JSON.parse(line);if(m.method==='session/prompt')fs.writeFileSync(${JSON.stringify(marker)},'unexpected');const result=m.method==='initialize'?{protocolVersion:1}:m.method==='session/new'?{sessionId:'fixture'}:{};process.stdout.write(JSON.stringify({jsonrpc:'2.0',id:m.id,...(m.method==='session/set_model'?{error:{code:-32602,message:process.env.KODER_HERMES_MODEL_KEY+' refused'}}:{result})})+'\\n');}`);
 const result=await cli(['ask','hello','--no-memory'],{home});assert.equal(result.code,2);assert.ok(!fs.existsSync(marker));assert.ok(!result.err.includes(key));assert.match(result.err,/<REDACTED>/);
});
