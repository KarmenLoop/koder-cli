import {loadRelease} from "./release.mjs";
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {tmp} from './helpers.mjs';
import {fixtureEnv} from './windows-fixtures.mjs';
const {saveConfig} = await loadRelease("src/config.mjs");
const {createMailAssistant} = await loadRelease("src/mail-assistant.mjs");
const {runMailProactiveTick} = await loadRelease("src/mail-runtime.mjs");
const {createProactive} = await loadRelease("src/agentd/proactive.mjs");
const {readState,writeState,hash} = await loadRelease("src/agentd/state.mjs");

async function fixture(t){
 const home=fs.realpathSync(tmp()),env=fixtureEnv(home),data=new Map();
 let clock=Date.parse('2026-10-27T12:00:00Z');
 const message={id:'9:1',from:'Cassy <cassy@example.test>',replyTo:'cassy@example.test',subject:'Order choice',body:'Please choose exchange or refund for the damaged product. Is the packaging sufficient?'};
 const store={async readJson(k,d){return structuredClone(data.get(k)??d);},async writeJson(k,v){data.set(k,structuredClone(v));}};
 const account={async status(){return {connected:true,user:'user@example.test'};},async poll(){return {fresh:[message],mail:{messages:[message]}};},async readMessage(){return structuredClone(message);},async close(){}};
 const mail=createMailAssistant({account,store,now:()=>clock,confirm:async()=>true,proactiveContext:()=>({lang:'en',timezone:'UTC',quietHours:[]})});
 await mail.configure({modelReading:true,proactiveInquiry:true,notifyAll:false});
 saveConfig({agentd:{activated:true,visibility:{memory:false,mail:true},proactive:{enabled:true,quietHours:[],maxPushesPerDay:1}}},env);
 const ctx={env,io:{mailAssistant:mail},lang:'en'};
 const make=notify=>createProactive({env,now:()=>clock,notify,collect:async({signal})=>{
  const result=await runMailProactiveTick(ctx,{background:true,signal});
  return Object.assign((result.events||[]).map(item=>({id:item.eventId,source:'mail',kind:item.kind,urgency:.8,relevance:1,freshness:1,actionability:1})),{mailCheck:{skipped:result.skipped}});
 }});
 t.after(async()=>{await mail.close();fs.rmSync(home,{recursive:true,force:true});});
 return {env,mail,data,make,now:()=>clock,advance:ms=>{clock+=ms;}};
}

test('a persisted inquiry retries an unavailable notification after daemon restart, without another inquiry charge',async t=>{
 const f=await fixture(t);let attempts=0;
 const notify=async event=>{assert.equal(event.kind,'mail-inquiry');return {state:++attempts===1?'unavailable':'submitted',channels:[]};};
 const first=f.make(notify);await first.tick({sources:['mail']});await first.close();assert.equal(attempts,1);
 f.advance(61000);const restarted=f.make(notify);t.after(()=>restarted.close());await restarted.tick({sources:['mail']});
 assert.equal(attempts,2,'The durable inquiry must survive the unavailable delivery');
 f.advance(61000);await restarted.tick({sources:['mail']});assert.equal(attempts,2,'A submitted receipt prevents duplicate notification');
 assert.equal(Object.values(f.data.get('assistant.json').pushes).reduce((a,b)=>a+b,0),1,'Retry does not spend a second inquiry allowance');
 assert.equal(readState(f.env,'notifications').receipts[0].attempts,2);
});

test('an inquiry held by the shared daily push cap remains eligible on the following day',async t=>{
 const f=await fixture(t);let attempts=0;
 writeState(f.env,'notifications',{receipts:[{key:hash('earlier-follow-up'),date:new Date(f.now()).toLocaleDateString('en-CA'),at:f.now(),state:'submitted'}]});
 const worker=f.make(async()=>{attempts++;return {state:'submitted',channels:[]};});t.after(()=>worker.close());
 await worker.tick({sources:['mail']});assert.equal(attempts,0);
 f.advance(86400000);await worker.tick({sources:['mail']});assert.equal(attempts,1,'The shared budget must postpone, not consume, the pending inquiry');
});

test('an UNKNOWN notification is not automatically replayed and revoking reading suppresses pending inquiry recovery',async t=>{
 const f=await fixture(t);let attempts=0;
 const worker=f.make(async()=>{attempts++;return {state:'UNKNOWN',channels:[]};});t.after(()=>worker.close());
 await worker.tick({sources:['mail']});f.advance(61000);await worker.tick({sources:['mail']});assert.equal(attempts,1);
 await f.mail.configure({modelReading:false});
 const ctx={env:f.env,io:{mailAssistant:f.mail},lang:'en'};
 const result=await runMailProactiveTick(ctx,{background:true});assert.equal(result.events.filter(e=>e.kind==='mail-inquiry').length,0);
});
