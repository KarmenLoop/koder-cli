import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { cli, tmp, mockModel, textStep, scripted, toolStep } from './helpers.mjs';
import { projectContext } from '../src/context.mjs';
import { importKernel } from '../src/agent.mjs';
const helpers=await importKernel('fusion/tokens.mjs');
const textOf=messages=>messages.map(m=>m.content||'').join('\n');

test('known MiniMax model without explicit limits reaches API for input above legacy 8K',async()=>{
 const server=await mockModel([textStep('微信接入入口可用')]);
 try{
  const result=await cli(['ask','请接入微信。'+ '任务材料。'.repeat(2200)],{env:{KODER_MODEL:'MiniMax-M3',KODER_BASE_URL:server.url,KODER_AUTH:'none'}});
  assert.equal(result.code,0,result.err);assert.match(result.out,/微信接入入口可用/);assert.equal(server.requests.length,1);
 }finally{await server.close();}
});
test('changing model in an open chat actually refreshes endpoint and context window',async()=>{
 const home=tmp(),small=await mockModel([textStep('small reply')]),big=await mockModel([textStep('big reply')]);
 fs.mkdirSync(path.join(home,'models'));fs.writeFileSync(path.join(home,'provider.json'),JSON.stringify({model:'small',baseUrl:small.url,auth:'none',contextWindow:8192,maxOutput:512}));
 fs.writeFileSync(path.join(home,'models/big.json'),JSON.stringify({model:'big',baseUrl:big.url,auth:'none',contextWindow:128000,maxOutput:4096}));
 let inputs=['hello','/model use big','请接入微信。'+'任务材料。'.repeat(2200),'/exit'];
 try{
  const result=await cli(['chat'],{home,io:{prompter:{ask:async()=>inputs.shift()??null}}});
  assert.equal(small.requests.length,1,'old session/provider must stop receiving new prompts');assert.equal(big.requests.length,1,result.err);assert.match(result.out,/big reply/);
  assert.match(textOf(big.requests[0].body.messages),/hello/,'model switch retains prior conversation');
 }finally{await small.close();await big.close();}
});
test('large tool results within a single user turn are compacted without deleting saved originals',async()=>{
 const workspace=tmp(),home=tmp(),body='BEGIN-PROOF\n'+'检查记录。'.repeat(2400)+'\nEND-PROOF';
 fs.writeFileSync(path.join(workspace,'report.txt'),body);
 const model=scripted([toolStep('read_file',{path:'report.txt'}),({messages})=>{assert.match(textOf(messages),/BEGIN-PROOF/);assert.match(textOf(messages),/END-PROOF/);return textStep('resumed after result');}]);model.contextWindow=8192;model.maxOutput=1024;
 const result=await cli(['run','Read report.txt and continue the task.','--yes','-w',workspace],{home,provider:model});
 assert.equal(result.code,0,result.err);assert.match(result.out,/resumed after result/);assert.equal(model.calls.length,2);
 const {createMemory}=await import('../src/memory.mjs');const data=createMemory({workspace,env:{KODER_CLI_HOME:home}}).read();
 assert.ok(data.conversation.messages.some(m=>m.role==='tool'&&m.content.includes(body)),'full tool result stays in local history');
 assert.equal(model.calls[1].messages.filter(m=>m.role==='tool').length,1);assert.equal(model.calls[1].messages.find(m=>m.role==='tool').toolCallId,model.calls[1].messages.find(m=>m.toolCalls?.length).toolCalls[0].id);
});
test('local context validation is not reported as a network/API failure',async()=>{
 const model=scripted([textStep('must not run')]);model.contextWindow=2048;model.maxOutput=256;
 const result=await cli(['ask','中'.repeat(6000)],{provider:model});
 assert.notEqual(result.code,0);assert.equal(model.calls.length,0);assert.doesNotMatch(result.out,/目前无法连接到 API/);assert.match(result.err,/CONTEXT_BUDGET_EXCEEDED/);
});
test('HTTP 200 with invalid model reply gives a safe protocol diagnostic',async()=>{
 const result=await cli(['ask','hello'],{env:{KODER_MODEL:'fixture',KODER_BASE_URL:'http://127.0.0.1:9',KODER_AUTH:'none'},fetchImpl:async()=>new Response('{"private":"do-not-echo"}',{headers:{'content-type':'application/json'}})});
 assert.equal(result.code,2);assert.match(result.err,/MODEL_PROTOCOL|API_INVALID_RESPONSE/);assert.doesNotMatch(result.out+result.err,/do-not-echo/);
});
test('model context updates only limits, keeping saved credentials and model selection',async()=>{
 const home=tmp(),file=path.join(home,'provider.json'),raw={model:'custom',baseUrl:'https://example.invalid/v1',apiKey:'fixture-private-key',contextWindow:8192,maxOutput:4096};fs.writeFileSync(file,JSON.stringify(raw));
 const result=await cli(['model','context','--context-window','128000','--max-output','8192'],{home});
 assert.equal(result.code,0,result.err);const after=JSON.parse(fs.readFileSync(file));assert.equal(after.contextWindow,128000);assert.equal(after.maxOutput,8192);assert.equal(after.apiKey,raw.apiKey);assert.equal(after.baseUrl,raw.baseUrl);assert.doesNotMatch(result.out,/fixture-private-key/);
});
test('projection budgets include tools and model reasoning without altering source history',()=>{
 const history=[{role:'user',content:'Keep original request intact.'},{role:'assistant',content:'',providerReasoning:'思考。'.repeat(10000),toolCalls:[{id:'call1',name:'read_file',arguments:{path:'report.txt'}}]},{role:'tool',toolCallId:'call1',content:'HEAD\n'+'正文。'.repeat(5000)+'\nTAIL'}];const before=structuredClone(history);
 const projection=projectContext({system:{role:'system',content:'system'},history,tools:[],profile:{contextWindow:8192,maxOutput:1024},helpers});
 assert.ok(projection.estimated+projection.toolTokens+projection.outputBudget<=8192);assert.deepEqual(history,before);assert.equal(projection.messages.find(m=>m.role==='user').content,history[0].content);
});
test('many completed tool groups do not grow one user turn without a bound',()=>{
 const history=[{role:'user',content:'Keep task REQUEST-41 unchanged. Verify recorded results; do not replay.'}];
 for(let i=0;i<12;i++)history.push({role:'assistant',content:'',toolCalls:[{id:`c${i}`,name:'write_file',arguments:{path:`owned-${i}.txt`,content:'正文。'.repeat(1800)}}]},{role:'tool',toolCallId:`c${i}`,content:`Recorded result ${i}: succeeded`});
 const before=structuredClone(history);
 const result=projectContext({system:{role:'system',content:'system'},history,tools:[],profile:{contextWindow:8192,maxOutput:1024},helpers});
 assert.ok(result.estimated+result.toolTokens+result.outputBudget<=8192);assert.deepEqual(history,before);assert.match(textOf(result.messages),/REQUEST-41/);assert.match(textOf(result.messages),/Recorded result 11: succeeded/);
 const ids=new Set(result.messages.flatMap(m=>(m.toolCalls||[]).map(c=>c.id)));for(const m of result.messages.filter(m=>m.role==='tool'))assert.ok(ids.has(m.toolCallId));
});
test('chat /connect opens WeChat binding without any model request or context budget',async()=>{
 let lines=['/connect weixin --no-start','/exit'],qrShown=false;
 const result=await cli(['chat'],{io:{prompter:{ask:async()=>lines.shift()??null},weixinLogin:async({onQr})=>{onQr('https://example.invalid/owned-qr');qrShown=true;return {accountId:'fixture-bot',token:'fixture-token',userId:'fixture-owner'};},verifyPlatform:async()=>({detail:'fixture verified'})}});
 assert.equal(result.code,0,result.err);assert.ok(qrShown);assert.match(result.out,/https:\/\/example.invalid\/owned-qr/);assert.doesNotMatch(result.out,/目前无法连接到 API/);
});
test('an open chat notices context configuration edited by another CLI process',async()=>{
 const home=tmp(),server=await mockModel([textStep('first'),textStep('continued')]),file=path.join(home,'provider.json');
 const initial={model:'fixture',baseUrl:server.url,auth:'none',contextWindow:8192,maxOutput:512};fs.writeFileSync(file,JSON.stringify(initial));
 let step=0;
 try{
  const result=await cli(['chat'],{home,io:{prompter:{ask:async()=>{step++;if(step===1)return 'hello';if(step===2){fs.writeFileSync(file,JSON.stringify({...initial,contextWindow:128000}));return '请继续。'+'任务材料。'.repeat(2200);}return '/exit';}}}});
  assert.equal(server.requests.length,2,result.err);assert.match(result.out,/continued/);assert.match(textOf(server.requests[1].body.messages),/hello/);
 }finally{await server.close();}
});
test('history carry-over reserves input space instead of overflowing after trimming',()=>{
 const history=[{role:'user',content:'Original task ORCHID-KEEP: preserve public API.'},{role:'assistant',content:'旧内容。'.repeat(2500)},{role:'user',content:'当前请求。'.repeat(1000)}];
 const result=projectContext({system:{role:'system',content:'system'},history,tools:[],profile:{contextWindow:8192,maxOutput:4096},helpers});
 assert.ok(result.estimated+result.toolTokens+result.outputBudget<=8192);assert.match(textOf(result.messages),/ORCHID-KEEP/);assert.equal(result.messages.at(-1).content,history.at(-1).content);
});
