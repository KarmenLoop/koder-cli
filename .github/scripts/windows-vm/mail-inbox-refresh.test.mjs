import {loadRelease} from "./release.mjs";
import test from 'node:test';
import assert from 'node:assert/strict';
const {assistantServices} = await loadRelease("src/assistant-services.mjs");
const {createMailAssistant} = await loadRelease("src/mail-assistant.mjs");

test('mail_inbox refreshes real mailbox port before reading cache and never auto-sends',async()=>{
 let refreshed=false;const signal=new AbortController().signal,calls=[];
 const mail={async poll(o){calls.push(o);assert.equal(o.automatic,false);assert.equal(o.signal,signal);refreshed=true;return {fresh:[{id:'9:1',body:'PRIVATE_BODY'}]};},async status(){return {mail:{connected:true},policy:{modelReading:false},messages:refreshed?[{id:'9:1',category:'personal',body:'PRIVATE_BODY',from:'PRIVATE_SENDER'}]:[]};}};
 const services=assistantServices({io:{mailAssistant:mail}},{workspace:process.cwd()});
 try{const result=await services.call('mail_inbox',{}, {signal});assert.equal(calls.length,1);assert.equal(result.counts.personal,1);assert.equal(result.refresh.state,'checked');assert.doesNotMatch(JSON.stringify(result),/PRIVATE_/);}finally{await services.close();}
});
test('failed refresh is not presented as a successful empty inbox',async()=>{
 const services=assistantServices({io:{mailAssistant:{async poll(){throw Object.assign(Error('network'),{code:'NETWORK'});},async status(){return {policy:{modelReading:false},messages:[]};}}}},{workspace:process.cwd()});
 try{await assert.rejects(services.call('mail_inbox',{},{}),{code:'NETWORK'});}finally{await services.close();}
});
test('explicit cached inbox inspection remains available and does not poll',async()=>{
 const services=assistantServices({io:{mailAssistant:{async poll(){assert.fail('cached request must not fetch');},async status(){return {policy:{modelReading:false},messages:[]};}}}},{workspace:process.cwd()});
 try{const result=await services.call('mail_inbox',{refresh:false},{});assert.equal(result.refresh.state,'cached');}finally{await services.close();}
});
test('foreground refresh leaves inquiry notifications and their budget for the notification owner',async()=>{
 const data=new Map(),messages=[1,2].map(uid=>({id:`9:${uid}`,from:'Cassy <cassy@example.test>',replyTo:'cassy@example.test',subject:`Company order ${uid}`,body:'Please choose exchange or refund for the damaged product. Is the packaging sufficient?'}));
 const store={async readJson(k,d){return structuredClone(data.get(k)??d);},async writeJson(k,v){data.set(k,structuredClone(v));},async remove(k){data.delete(k);}};
 const account={async status(){return {connected:true,user:'user@example.test'};},async poll(){return {fresh:messages,mail:{messages}};},async readMessage(id){return structuredClone(messages.find(m=>m.id===id));},async close(){}};
 const mail=createMailAssistant({account,store,confirm:async()=>true,now:()=>Date.parse('2026-10-24T12:00:00Z'),proactiveContext:()=>({lang:'en',timezone:'UTC'})});
 await mail.configure({modelReading:true,proactiveInquiry:true,maxInquiriesPerDay:1});
 const services=assistantServices({io:{mailAssistant:mail}},{workspace:process.cwd()});
 try{
  const result=await services.call('mail_inbox',{},{});assert.equal(result.refresh.state,'checked');
  const state=data.get('assistant.json');assert.equal(state.inquiries.length,2);assert(state.inquiries.every(i=>i.notifiedAt===null));assert.deepEqual(state.pushes,{});
  const background=await mail.poll({automatic:false,background:true});assert.equal(background.inquiries.length,1);assert.equal((await mail.poll({automatic:false,background:true})).inquiries.length,0);
  assert.equal(data.get('assistant.json').pushes['2026-10-24'],1);assert.equal(data.get('assistant.json').inquiries.filter(i=>i.notifiedAt===null).length,1);
 }finally{await services.close();await mail.close();}
});
