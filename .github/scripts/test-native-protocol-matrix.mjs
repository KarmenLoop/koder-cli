import {load} from './installed-helpers.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {cli,tmp} from './installed-helpers.mjs';
const {normalizeRecord}=await load("src/provider.mjs");
const {presets}=await load("src/commands/model.mjs");
const json=v=>new Response(JSON.stringify(v),{headers:{'content-type':'application/json'}});
const settings=(model,baseUrl,protocol)=>({KODER_MODEL:model,KODER_BASE_URL:baseUrl,KODER_PROTOCOL:protocol,KODER_API_KEY:'synthetic-native-key'});

test('Kimi China and international Chat Completions complete real file-tool continuations with nullable SSE fields',{skip:"Temporarily unavailable by user decision; public refusal is covered by provider-availability.test.mjs; prior enabled file-tool contract is retained for future re-acceptance."},async()=>{
 for(const host of ['api.moonshot.cn','api.moonshot.ai']){
  const cwd=tmp();fs.writeFileSync(cwd+'/fixture.txt','owned Kimi matrix');let count=0;
  const r=await cli(['run','Read fixture.txt','--no-memory'],{cwd,env:settings('kimi-k3','https://'+host+'/v1','openai'),fetchImpl:async(url,init)=>{
   assert.equal(url,'https://'+host+'/v1/chat/completions');const b=JSON.parse(init.body);assert.equal(b.max_tokens,undefined);assert.ok(b.max_completion_tokens>=16384);assert.equal(b.reasoning_effort,'low');
   if(count++){assert.ok(b.messages.some(m=>m.role==='assistant'&&m.reasoning_content==='private Kimi state'));assert.ok(b.messages.some(m=>m.role==='tool'&&m.content.includes('owned Kimi matrix')));return json({choices:[{finish_reason:'stop',message:{content:'Kimi tool verified',reasoning_content:'private final'}}]});}
   const frames=[{reasoning_content:'private Kimi state'},{content:'Reading the file.'},{tool_calls:[{index:0,id:'kimi_owned',function:{name:'read_file',arguments:'{"path":'}}]},{tool_calls:[{index:0,id:null,function:{name:null,arguments:'"fixture.txt"}'}}]}];
   return new Response(frames.map(delta=>'data: '+JSON.stringify({choices:[{delta}]})+'\n\n').join('')+'data: '+JSON.stringify({choices:[{delta:{},finish_reason:'tool_calls'}]})+'\n\ndata: [DONE]\n\n',{headers:{'content-type':'text/event-stream'}});
  }});assert.equal(r.code,0,r.err);assert.equal(count,2);assert.match(r.out,/Kimi tool verified/);assert.doesNotMatch(r.out,/private Kimi state/);
 }
});

test('Kimi, DeepSeek and Kimi Code Messages routes retain thinking signatures through actual file-tool results',{skip:"Temporarily unavailable by user decision; public refusal is covered by provider-availability.test.mjs; prior enabled file-tool contract is retained for future re-acceptance."},async()=>{
 const cases=[['kimi-k3','https://api.moonshot.ai/anthropic'],['deepseek-flash','https://api.deepseek.com/anthropic'],['k3-256k','https://api.kimi.com/coding']];
 for(const [model,base] of cases){
  const cwd=tmp();fs.writeFileSync(cwd+'/fixture.txt','owned Messages fixture');let count=0;
  const r=await cli(['run','Read fixture.txt','--no-memory'],{cwd,env:settings(model,base,'anthropic'),fetchImpl:async(url,init)=>{
   assert.equal(url,base+'/v1/messages');const b=JSON.parse(init.body);assert.equal(b.output_config.effort,'low');
   if(model==='deepseek-flash')assert.equal(b.thinking.type,'enabled');
   if(base.includes('api.kimi.'))assert.equal(new Headers(init.headers).get('user-agent'),'KoderCLI');
   if(count++){assert.ok(b.messages.some(m=>Array.isArray(m.content)&&m.content.some(x=>x.type==='tool_result'&&x.content.includes('owned Messages fixture'))));assert.ok(b.messages.some(m=>Array.isArray(m.content)&&m.content.some(x=>x.type==='thinking'&&x.signature==='signed-private-state')));return json({stop_reason:'end_turn',content:[{type:'text',text:'Messages verified'}]});}
   return json({stop_reason:'tool_use',content:[{type:'thinking',thinking:'private Messages state',signature:'signed-private-state'},{type:'tool_use',id:'owned_messages',name:'read_file',input:{path:'fixture.txt'}}]});
  }});assert.equal(r.code,0,model+': '+r.err);assert.equal(count,2);assert.match(r.out,/Messages verified/);assert.doesNotMatch(r.out,/signed-private-state|private Messages state/);
 }
});

test('DeepSeek and Kimi Code Responses preserve opaque reasoning and actual file-tool call IDs',{skip:"Temporarily unavailable by user decision; public refusal is covered by provider-availability.test.mjs; prior enabled file-tool contract is retained for future re-acceptance."},async()=>{
 for(const [model,base] of [['deepseek-flash','https://api.deepseek.com/v1'],['k3-256k','https://api.kimi.ai/coding/v1']]){
  const cwd=tmp();fs.writeFileSync(cwd+'/fixture.txt','owned Responses matrix');let count=0;
  const r=await cli(['run','Read fixture.txt','--no-memory'],{cwd,env:settings(model,base,'responses'),fetchImpl:async(url,init)=>{
   assert.equal(url,base+'/responses');const b=JSON.parse(init.body);assert.equal(b.reasoning.effort,'low');assert.ok(b.max_output_tokens>=16384);assert.equal(b.include,undefined);
   if(count++){assert.ok(b.input.some(m=>m.type==='function_call_output'&&m.call_id==='responses_owned'&&m.output.includes('owned Responses matrix')));assert.ok(b.input.some(m=>m.type==='reasoning'&&m.id==='rs_owned'));return json({status:'completed',output:[{type:'message',content:[{type:'output_text',text:'Responses verified'}]}]});}
   return json({status:'completed',output:[{type:'reasoning',id:'rs_owned',summary:[]},{type:'function_call',call_id:'responses_owned',name:'read_file',arguments:'{"path":"fixture.txt"}'}]});
  }});assert.equal(r.code,0,r.err);assert.equal(count,2);assert.match(r.out,/Responses verified/);
 }
});

test('Kimi Code presets use separate products and documented model IDs without impersonating another client',async()=>{
 const list=await presets({env:{}}),code=list.find(p=>p.id==='kimi-code');assert.ok(code);assert.equal(code.protocol,'responses');assert.equal(code.model,'k3-256k');assert.deepEqual(code.models,['k3-256k','k3','kimi-for-coding','kimi-for-coding-highspeed']);
 assert.throws(()=>normalizeRecord({presetId:'kimi-code',model:'kimi-k3',baseUrl:'https://api.moonshot.cn/v1',apiKey:'synthetic'}),/KIMI_ENDPOINT_MISMATCH/);
 assert.throws(()=>normalizeRecord({model:'kimi-for-coding-typo',baseUrl:'https://api.kimi.com/coding/v1',apiKey:'synthetic'}),/KIMI_CODE_MODEL_UNKNOWN/);
 assert.throws(()=>normalizeRecord({model:'deepseek-chat',baseUrl:'https://api.deepseek.com',apiKey:'synthetic'}),/DEEPSEEK_MODEL_LEGACY/);
 const custom=normalizeRecord({model:'deepseek-chat',baseUrl:'https://proxy.invalid/v1',apiKey:'synthetic',maxOutput:1024});assert.equal(custom.spec,undefined);assert.equal(custom.maxOutput,1024);
});

test('incomplete reasoning output is diagnosed as budget exhaustion and never executes partial calls',async()=>{
 const cwd=tmp();let calls=0;
 const r=await cli(['run','Write an owned marker','--no-memory'],{cwd,env:settings('mimo-v2.6-pro','https://api.xiaomimimo.com/v1','openai'),fetchImpl:async()=>{calls++;return json({choices:[{finish_reason:'length',message:{reasoning_content:'private partial',tool_calls:[{id:'partial',function:{name:'write_file',arguments:'{"path":"must-not-exist.txt",'}}]}}]});}});
 assert.notEqual(r.code,0);assert.equal(calls,1);assert.equal(fs.existsSync(cwd+'/must-not-exist.txt'),false);assert.match(r.err,/MODEL_INCOMPLETE/);
 const check=await cli(['model','test'],{env:settings('mimo-v2.6-pro','https://api.xiaomimimo.com/v1','openai'),fetchImpl:async()=>json({choices:[{finish_reason:'length',message:{reasoning_content:'private'}}]})});assert.equal(check.code,2);assert.match(check.err,/MODEL_INCOMPLETE/);assert.doesNotMatch(check.err,/接口返回网页/);
});
