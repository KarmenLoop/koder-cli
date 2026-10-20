import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from './installed-helpers.mjs';
const {importKernel}=await load('src/agent.mjs');
const {normalizeRecord}=await load('src/provider.mjs');
const {checkModel,connectionHint}=await load('src/model-check.mjs');
import http from 'node:http';
import fs from 'node:fs';
import {cli,tmp} from './installed-helpers.mjs';
const {MODEL_CODE}=await load('src/tutorial/platform-text.mjs');

const {createProvider}=await importKernel('harness/providers.mjs',{});
const json=value=>new Response(JSON.stringify(value),{headers:{'content-type':'application/json'}});
test('every tutorial DeepSeek environment example selects a currently supported official model',()=>{
 let checked=0;for(const variants of Object.values(MODEL_CODE.variants))for(const text of Object.values(variants))for(const m of text.matchAll(/KODER_MODEL\s*=\s*"?([a-z0-9.-]+)/g)){
  if(!m[1].startsWith('deepseek'))continue;checked++;assert.doesNotThrow(()=>normalizeRecord({model:m[1],baseUrl:'https://api.deepseek.com/v1',apiKey:'synthetic'}));
 }assert.ok(checked>=4);
});
test('terminal SSE completion does not await an uncooperative stream cancellation promise',async()=>{
 let cancelled=false,timer;
 const p=createProvider({provider:normalizeRecord({model:'mimo-v2.6-pro',baseUrl:'https://api.xiaomimimo.com/v1',apiKey:'synthetic'}),fetchImpl:async()=>new Response(new ReadableStream({start(c){c.enqueue(new TextEncoder().encode('data: '+JSON.stringify({choices:[{delta:{content:'ready'},finish_reason:'stop'}]})+'\n\ndata: [DONE]\n\n'));},cancel(){cancelled=true;return new Promise(()=>{});}}),{headers:{'content-type':'text/event-stream'}})});
 try{const result=await Promise.race([p.complete({messages:[{role:'user',content:'Reply ready'}],tools:[]}),new Promise(resolve=>{timer=setTimeout(()=>resolve(null),200);})]);assert.equal(result?.text,'ready');assert.equal(cancelled,true);}finally{clearTimeout(timer);}
});
test('actual native CLI file-tool loops complete on HTTP keep-alive streams for all three providers',async()=>{
 for(const [model,baseUrl] of [['mimo-v2.6-pro','https://api.xiaomimimo.com/v1'],['kimi-k3','https://api.moonshot.cn/v1'],['deepseek-v4-pro','https://api.deepseek.com/v1']]){
  const cwd=tmp();fs.writeFileSync(cwd+'/fixture.txt','OWNED-KEEPALIVE-REFERENCE');let requests=0,closed=0,failure;
  const server=http.createServer(async(req,res)=>{
   try{let raw='';for await(const part of req)raw+=part;const body=JSON.parse(raw);requests++;res.on('close',()=>closed++);
    if(requests===2){assert.ok(body.messages.some(m=>m.role==='tool'&&m.content.includes('OWNED-KEEPALIVE-REFERENCE')));assert.ok(body.messages.some(m=>m.reasoning_content==='private keepalive state'));}
    const delta=requests===1?{reasoning_content:'private keepalive state',tool_calls:[{index:0,id:'owned-read',function:{name:'read_file',arguments:'{"path":"fixture.txt"}'}}]}:{content:'KEEPALIVE-TOOL-PASS'};
    res.writeHead(200,{'content-type':'text/event-stream'});res.write('data: '+JSON.stringify({choices:[{delta,finish_reason:requests===1?'tool_calls':'stop'}]})+'\n\ndata: [DONE]\n\n');
   }catch(error){failure=error;res.destroy();}
  });await new Promise(r=>server.listen(0,'127.0.0.1',r));
  try{const result=await cli(['run','Read fixture.txt','--no-memory'],{cwd,env:{KODER_MODEL:model,KODER_BASE_URL:baseUrl,KODER_API_KEY:'synthetic',KODER_API_IDLE_TIMEOUT_MS:'500',KODER_API_TIMEOUT_MS:'3000',KODER_API_RETRIES:'0'},fetchImpl:async(_url,init)=>fetch('http://127.0.0.1:'+server.address().port,init)});if(failure)throw failure;assert.equal(result.code,0,model+': '+result.err);assert.equal(requests,2);assert.match(result.out,/KEEPALIVE-TOOL-PASS/);assert.doesNotMatch(result.out,/private keepalive state/);await new Promise(r=>setTimeout(r,30));assert.equal(closed,2,'Both completed HTTP responses must be released.');}finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
 }
});
for(const [model,baseUrl] of [['k3-256k','https://api.kimi.com/coding/v1'],['deepseek-flash','https://api.deepseek.com/v1']])test(`${model}: Responses completion ends without HTTP EOF`,async()=>{
 let control,cancelled=false,timer;
 const event={type:'response.completed',response:{status:'completed',output:[{type:'message',content:[{type:'output_text',text:'ready'}]}]}};
 const provider=createProvider({provider:normalizeRecord({model,baseUrl,protocol:'responses',apiKey:'synthetic'}),fetchImpl:async()=>new Response(new ReadableStream({start(c){control=c;c.enqueue(new TextEncoder().encode('data: '+JSON.stringify(event)+'\n\n'));},cancel(){cancelled=true;}}),{headers:{'content-type':'text/event-stream'}})});
 const pending=provider.complete({messages:[{role:'user',content:'Reply ready'}],tools:[]});
 try{const finished=await Promise.race([pending.then(()=>true),new Promise(resolve=>{timer=setTimeout(()=>resolve(false),200);})]);if(!finished)control.close();assert.equal((await pending).text,'ready');assert.equal(finished,true,'response.completed is terminal even while HTTP stays open.');assert.equal(cancelled,true);}finally{clearTimeout(timer);if(!cancelled)try{control.close();}catch{}}
});
test('connection checks report a malformed or incomplete 200 response as its actual model error',async()=>{
 for(const [body,expected] of [[{choices:[{finish_reason:'stop',message:{content:null,reasoning_content:'private state only'}}]},'MODEL_EMPTY_REPLY'],[{choices:[{finish_reason:'length',message:{content:'partial'}}]},'MODEL_INCOMPLETE'],[{choices:[{message:{content:null,tool_calls:[{id:null,function:{name:'read_file',arguments:'{}'}}]}}]},'API_MODEL_PROTOCOL']]){
  const result=await checkModel({env:{},io:{fetchImpl:async()=>json(body)},opts:{}},normalizeRecord({model:'mimo-v2.6-pro',baseUrl:'https://api.xiaomimimo.com/v1',apiKey:'synthetic'}));
  assert.equal(result.ok,false);assert.equal(result.failure.error,expected);assert.equal(result.failure.status,undefined,'HTTP 200 is not the failure reason.');assert.doesNotMatch(JSON.stringify(result),/private state only/);
 }
 assert.match(connectionHint({error:'MODEL_EMPTY_REPLY'},'en'),/empty|visible|reply/i);
});
for(const [model,baseUrl] of [['mimo-v2.6-pro','https://api.xiaomimimo.com/v1'],['kimi-k3','https://api.moonshot.cn/v1'],['deepseek-v4-pro','https://api.deepseek.com/v1']])test(`${model}: a complete SSE reply finishes before a proxy closes the HTTP connection`,async()=>{
 let control,cancelled=false,timer;
 const text='data: '+JSON.stringify({choices:[{delta:{content:'ready'},finish_reason:null}]})+'\n\ndata: '+JSON.stringify({choices:[{delta:{},finish_reason:'stop'}]})+'\n\ndata: [DONE]\n\n';
 const provider=createProvider({provider:normalizeRecord({model,baseUrl,apiKey:'synthetic'}),fetchImpl:async()=>new Response(new ReadableStream({start(c){control=c;c.enqueue(new TextEncoder().encode(text));},cancel(){cancelled=true;}}),{headers:{'content-type':'text/event-stream'}})});
 const pending=provider.complete({messages:[{role:'user',content:'Reply ready'}],tools:[]});
 try{
  const finished=await Promise.race([pending.then(()=>true),new Promise(resolve=>{timer=setTimeout(()=>resolve(false),200);})]);
  if(!finished)control.close();const result=await pending;
  assert.equal(result.text,'ready');assert.equal(finished,true,'A valid [DONE] must not wait for HTTP EOF or eventually become an idle timeout.');assert.equal(cancelled,true,'Release the completed response body.');
 }finally{clearTimeout(timer);if(!cancelled)try{control.close();}catch{}}
});
test('DeepSeek official tool requests retain exact reasoning for earlier visible answers across user turns',async()=>{
 const provider=createProvider({provider:normalizeRecord({model:'deepseek-v4-pro',baseUrl:'https://api.deepseek.com/v1',apiKey:'synthetic'}),fetchImpl:async(_url,init)=>{
  const body=JSON.parse(init.body),previous=body.messages.find(m=>m.role==='assistant');
  if(previous)assert.equal(previous.reasoning_content,'owned protocol state from earlier turn','Official DeepSeek tools requests require reasoning from earlier turns, even without a tool call in that earlier answer.');
  return json({choices:[{finish_reason:'stop',message:{content:'ready',reasoning_content:'owned protocol state from earlier turn'}}]});
 }});
 const tools=[{name:'read_file',description:'Read owned fixture',parameters:{type:'object',properties:{path:{type:'string'}}}}];
 const messages=[{role:'user',content:'First task'}],first=await provider.complete({messages,tools});
 messages.push({role:'assistant',content:first.text,providerReasoning:first.providerReasoning},{role:'user',content:'Second task'});
 assert.equal((await provider.complete({messages,tools})).text,'ready');
});
