import {load} from './installed-helpers.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {cli,tmp} from './installed-helpers.mjs';
const {normalizeRecord}=await load("src/provider.mjs");
const json=(value,init={})=>new Response(JSON.stringify(value),{...init,headers:{'content-type':'application/json'}});
const answer=(content,reasoning_content)=>json({choices:[{finish_reason:'stop',message:{content,reasoning_content}}]});

test('Kimi K3 official international endpoint receives its supported token field and reasoning control',{skip:"Temporarily unavailable by user decision; public refusal is covered by provider-availability.test.mjs; prior enabled file-tool contract is retained for future re-acceptance."},async()=>{
 const result=await cli(['run','Reply ready','--no-memory'],{env:{KODER_MODEL:'kimi-k3',KODER_BASE_URL:'https://api.moonshot.ai/v1',KODER_API_KEY:'synthetic-key'},fetchImpl:async(url,init)=>{
  assert.equal(url,'https://api.moonshot.ai/v1/chat/completions');const b=JSON.parse(init.body);
  if(b.max_tokens!==undefined||!Number.isInteger(b.max_completion_tokens)||b.reasoning_effort!=='low')return json({error:{code:'invalid_parameter',message:'Unsupported request fields'}},{status:400});
  return answer('ready','private reasoning');
 }});assert.equal(result.code,0,result.err);assert.match(result.out,/ready/);assert.doesNotMatch(result.out,/private reasoning/);
});

test('held services refuse recovery while available MiMo retains actual file-tool recovery',async()=>{
 for(const [model,base] of [['deepseek-flash','https://api.deepseek.com/v1'],['kimi-k3','https://api.moonshot.cn/v1'],['mimo-v2.6-pro','https://api.xiaomimimo.com/v1']]){
  if(model!=='mimo-v2.6-pro'){
   let calls=0;const r=await cli(['run','Read fixture.txt','--no-memory'],{env:{KODER_MODEL:model,KODER_BASE_URL:base,KODER_API_KEY:'synthetic-key'},fetchImpl:async()=>{calls++;throw Error('Unavailable');}});
   assert.equal(r.code,2);assert.equal(calls,0);assert.match(r.err,/暂时无法使用|temporarily unavailable/);continue;
  }
  const home=tmp(),cwd=tmp();fs.writeFileSync(cwd+'/fixture.txt','owned recovery fixture');fs.writeFileSync(home+'/provider.json',JSON.stringify({model,baseUrl:base,apiKey:'synthetic-key'}));
  const first=await cli(['run','Remember that the project marker is RECOVER-42.'],{home,cwd,fetchImpl:async()=>answer('The project marker is RECOVER-42.','private first-turn state')});assert.equal(first.code,0,first.err);
  let requests=0,invalid=0;
  const second=await cli(['run','Continue the project and read fixture.txt.'],{home,cwd,fetchImpl:async(_url,init)=>{
   requests++;const b=JSON.parse(init.body);
   if(b.messages.some(m=>m.role==='assistant'&&typeof m.reasoning_content!=='string')){invalid++;return new Response(JSON.stringify({error:{message:'Missing reasoning_content'}}),{status:400,headers:{'content-type':'application/json'}});}
   assert.match(JSON.stringify(b.messages),/RECOVER-42/);
   if(requests===1)return json({choices:[{finish_reason:'tool_calls',message:{content:null,reasoning_content:'private tool state',tool_calls:[{id:'owned-recovery',type:'function',function:{name:'read_file',arguments:'{"path":"fixture.txt"}'}}]}}]});
   assert.ok(b.messages.some(m=>m.role==='tool'&&m.content.includes('owned recovery fixture')));assert.ok(b.messages.some(m=>m.role==='assistant'&&m.reasoning_content==='private tool state'));
   return answer('Recovered RECOVER-42 and read the owned file.','private final state');
  }});assert.equal(second.code,0,model+': '+second.err);assert.equal(invalid,0,model);assert.equal(requests,2,model);assert.match(second.out,/Recovered RECOVER-42/);assert.doesNotMatch(second.out,/private .*state/);
 }
});

test('official DeepSeek aliases receive practical thinking budgets without applying controls to proxies',()=>{
 for(const baseUrl of ['https://api.deepseek.com','https://api.deepseek.com/v1','https://api.deepseek.com/chat/completions']){
  const record=normalizeRecord({model:'deepseek-flash',baseUrl,apiKey:'synthetic'});assert.equal(record.contextWindow,1000000);assert.ok(record.maxOutput>=32768);assert.equal(record.reasoningEffort,'low');
 }
 const proxy=normalizeRecord({model:'deepseek-flash',baseUrl:'https://owned-proxy.invalid/v1',apiKey:'synthetic',maxOutput:1024});assert.equal(proxy.maxOutput,1024);assert.equal(proxy.spec,undefined);
});
