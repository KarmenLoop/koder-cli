import {loadRelease} from "./release.mjs";
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {cli,tmp,scripted,toolStep,textStep,write} from './helpers.mjs';
const {saveConfig} = await loadRelease("src/config.mjs");

for(const jitEnabled of [true,false])test(`an unfinished CLI task continues beyond sixteen model/tool rounds (JIT ${jitEnabled})`,async t=>{
 const home=tmp('koder-long-task-');t.after(()=>fs.rmSync(home,{recursive:true,force:true}));
 saveConfig({harnessJit:{enabled:jitEnabled}},{KODER_CLI_HOME:home});
 write(home,Object.fromEntries(Array.from({length:20},(_,i)=>[`part-${i}.txt`,`CHECKED-${i}`])));
 const provider=scripted([({index,messages})=>{
  if(index<20)return toolStep('read_file',{path:`part-${index}.txt`},'',`read-${index}`);
  assert.match(messages.findLast(m=>m.role==='tool').content,/CHECKED-19/);
  return textStep('All twenty diagnostic records checked. COMPLETE-20.');
 }]);
 const r=await cli(['run','Inspect the diagnostic records in this directory','--yes','--json','--no-memory'],{home,provider});
 assert.equal(r.code,0,`${r.err}\n${r.out.slice(-4000)}`);
 assert.equal(provider.calls.length,21);
 assert.match(r.out,/COMPLETE-20/);
 assert.doesNotMatch(r.out,/TASK_STEP_LIMIT|MAX_STEPS_EXHAUSTED/);
});

test('seventy distinct file approvals complete without a cumulative confirmation cap',async t=>{
 const home=tmp();t.after(()=>fs.rmSync(home,{recursive:true,force:true}));let approved=0;
 const provider=scripted([({index})=>index<70?toolStep('write_file',{path:`result-${index}.txt`,content:`RECEIPT-${index}`},'',`write-${index}`):textStep('All seventy files saved.')]);
 const r=await cli(['run','Save all diagnostic records','--approval','ask','--json','--no-memory'],{home,provider,decide:()=>{approved++;return {accept:true};}});
 assert.equal(r.code,0,`${r.err}\n${r.out.slice(-4000)}`);assert.equal(approved,70);assert.equal(provider.calls.length,71);
 for(let i=0;i<70;i++)assert.equal(fs.readFileSync(`${home}/result-${i}.txt`,'utf8'),`RECEIPT-${i}`);
 const result=r.out.trim().split('\n').map(JSON.parse).find(x=>x.type==='result');
 assert.equal(result.taskBudget.steps,71);assert.equal(result.taskBudget.maxSteps,null);
});

test('an explicit owner cap spans approval resumes and can be removed via CLI',async t=>{
 const home=tmp();t.after(()=>fs.rmSync(home,{recursive:true,force:true}));
 let r=await cli(['harness','steps','3','--json'],{home});assert.equal(r.code,0,r.err);assert.equal(JSON.parse(r.out).taskExecution.maxSteps,3);
 const provider=scripted([({index})=>toolStep('write_file',{path:`limited-${index}.txt`,content:'saved'},'',`limited-${index}`)]);
 r=await cli(['run','Save diagnostic records','--yes','--json','--no-memory'],{home,provider});assert.equal(r.code,1,r.err);assert.equal(provider.calls.length,3);assert.equal(fs.existsSync(`${home}/limited-3.txt`),false);
 r=await cli(['harness','steps','unlimited','--json'],{home});assert.equal(r.code,0,r.err);assert.equal(JSON.parse(r.out).taskExecution.maxSteps,null);
 for(const value of ['0','-1','NaN','1.5','9007199254740992']){
  r=await cli(['harness','steps',value,'--json'],{home});assert.equal(r.code,2,`${value}: ${r.err}`);
 }
});

test('one CLI task can create and edit a hundred Todo items',async t=>{
 const home=tmp();t.after(()=>fs.rmSync(home,{recursive:true,force:true}));
 const items=Array.from({length:100},(_,i)=>({id:`part-${i}`,title:`Review record ${i}`,status:'pending'}));
 const provider=scripted([toolStep('todo_set',{items}),toolStep('todo_set',{op:'upsert',revision:1,items:[{id:'part-99',status:'blocked',notes:'Awaiting input'}]}),({messages})=>{const result=JSON.parse(messages.findLast(m=>m.role==='tool').content);assert.equal(result.todo.items.length,100);assert.equal(result.todo.items[99].status,'blocked');return textStep('The full plan is saved.');}]);
 const r=await cli(['run','Plan review of the diagnostic records','--json','--no-memory'],{home,provider});assert.equal(r.code,0,r.err);
 assert.equal(r.out.trim().split('\n').map(JSON.parse).findLast(e=>e.type==='todo').todo.items.length,100);
});

test('CLI monetary budget is explicit, keeps prices by model and stops without resetting history',async t=>{
 const home=tmp();t.after(()=>fs.rmSync(home,{recursive:true,force:true}));
 let r=await cli(['harness','budget','0.08','USD','scripted','1','2','--json'],{home});assert.equal(r.code,0,r.err);assert.equal(JSON.parse(r.out).taskExecution.costBudget.limit,.08);
 const p=scripted([({index})=>({...toolStep('list_dir',{path:'.'},'',`cost-${index}`),usage:{prompt:2000,completion:0}})]);p.contextWindow=64000;p.maxOutput=1000;
 r=await cli(['run','Read diagnostic records','--yes','--json','--no-memory'],{home,provider:p});assert.equal(r.code,1,r.err);assert.equal(p.calls.length,8);assert.match(r.out,/TASK_COST_BUDGET_EXHAUSTED/);assert.doesNotMatch(r.out,/TASK_STEP_LIMIT/);
 r=await cli(['harness','budget','off','--json'],{home});assert.equal(r.code,0,r.err);assert.equal(JSON.parse(r.out).taskExecution.costBudget,undefined);
});
