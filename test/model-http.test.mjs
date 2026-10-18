import assert from 'node:assert/strict';
import { getEventListeners } from 'node:events';
import http from 'node:http';
import test from 'node:test';
import { createModelFetch, modelEndpoint, transportOptions } from '../src/model-http.mjs';
import { normalizeRecord } from '../src/provider.mjs';
import { diagnosticFetch } from '../src/turn.mjs';
const options={env:{},timeoutMs:1000,connectTimeoutMs:100,idleTimeoutMs:100,retries:2};

test('abort before fetch prevents any request',async()=>{
  const controller=new AbortController();controller.abort();let calls=0;
  const fetch=createModelFetch(()=>{calls++;return new Response('{}');},options);
  await assert.rejects(fetch('http://model.invalid',{signal:controller.signal}),{code:'ABORT_ERR'});assert.equal(calls,0);
});
test('cancellation during backoff stops subsequent attempts',async()=>{
  const controller=new AbortController();let calls=0;
  const fetch=createModelFetch(()=>{calls++;setTimeout(()=>controller.abort(),10);return new Response('{}',{status:503,headers:{'retry-after':'1'}});}, {...options,timeoutMs:3000});
  await assert.rejects(fetch('http://model.invalid',{signal:controller.signal}),{code:'ABORT_ERR'});
  assert.equal(calls,1);assert.equal(getEventListeners(controller.signal,'abort').length,0);
});
test('header deadline aborts an uncooperative fetch and bounds retries by total time',async()=>{
  const signals=[];
  const fetch=createModelFetch((_url,init)=>{signals.push(init.signal);return new Promise(()=>{});},{...options,connectTimeoutMs:15,timeoutMs:80});
  await assert.rejects(fetch('http://model.invalid'),{code:'API_TIMEOUT'});
  assert.equal(signals.length,1);assert.equal(signals[0].aborted,true);
});
test('cancel after headers closes the body and releases caller listeners',async()=>{
  let cancelled=false;const parent=new AbortController();
  const fetch=createModelFetch(()=>new Response(new ReadableStream({cancel(){cancelled=true;}})),options);
  const response=await fetch('http://model.invalid',{signal:parent.signal});
  const read=response.text();parent.abort();
  await assert.rejects(read,{code:'ABORT_ERR'});assert.equal(cancelled,true);
  assert.equal(getEventListeners(parent.signal,'abort').length,0);
});
test('total deadline applies even while the response keeps streaming',async()=>{
  let interval;
  const fetch=createModelFetch(()=>new Response(new ReadableStream({start(control){interval=setInterval(()=>control.enqueue(new Uint8Array([120])),5);},cancel(){clearInterval(interval);}})),{...options,timeoutMs:45,idleTimeoutMs:30});
  const response=await fetch('http://model.invalid');
  await assert.rejects(response.text(),{code:'API_TIMEOUT'});
});
test('body cancellation clears timers, underlying stream and listeners',async()=>{
  const parent=new AbortController();let cancelled=0;
  const fetch=createModelFetch(()=>new Response(new ReadableStream({cancel(){cancelled++;}})),options);
  const response=await fetch('http://model.invalid',{signal:parent.signal});await response.body.cancel();
  assert.equal(cancelled,1);assert.equal(getEventListeners(parent.signal,'abort').length,0);
});
test('normal responses and repeated turns do not retain abort listeners',async()=>{
  const parent=new AbortController();const fetch=createModelFetch(()=>new Response('{}'),options);
  for(let i=0;i<25;i++){assert.deepEqual(await (await fetch('http://model.invalid',{signal:parent.signal})).json(),{});assert.equal(getEventListeners(parent.signal,'abort').length,0);}
});
for(const [code,diagnostic] of [['CERT_HAS_EXPIRED','API_TLS_ERROR'],['ENOTFOUND','API_DNS_ERROR']])test(`${code} is diagnosed without retries or raw error text`,async()=>{
  let count=0;const diag=diagnosticFetch(()=>{count++;throw new TypeError('private credential',{cause:{code}});},{env:{}});
  await assert.rejects(diag.fetch('https://model.invalid/v1'),error=>error.code===diagnostic && !error.message.includes('private'));
  assert.equal(count,1);assert.equal(diag.state.last.error,diagnostic);
});
test('retry waits for HTTP-date Retry-After, not immediate replay',async()=>{
  let count=0,first;
  const fetch=createModelFetch(()=>{count++;if(count===1){first=Date.now();return new Response('{}',{status:429,headers:{'retry-after':new Date(first+1500).toUTCString()}});}assert.ok(Date.now()-first>=450);return new Response('{}');},{...options,timeoutMs:3000});
  assert.deepEqual(await (await fetch('http://model.invalid')).json(),{});assert.equal(count,2);
});
test('transport options are bounded and invalid values fail explicitly',()=>{
  assert.equal(transportOptions({}).retries,2);
  for(const env of [{KODER_API_RETRIES:'3'},{KODER_API_RETRIES:'99'},{KODER_API_TIMEOUT_MS:'never'},{KODER_API_IDLE_TIMEOUT_MS:'0'}])assert.throws(()=>transportOptions(env));
});
test('URL validation rejects malformed and credential-bearing URLs',()=>{
  for(const baseUrl of ['https://','ftp://model.invalid','https://user:password@model.invalid','https://model.invalid/#token'])assert.throws(()=>normalizeRecord({model:'m',baseUrl,auth:'none'}));
  assert.equal(modelEndpoint({baseUrl:'https://model.invalid/v1/?api-version=x'}),'https://model.invalid/v1/chat/completions?api-version=x');
  assert.equal(modelEndpoint({baseUrl:'https://model.invalid/v1/messages/?version=x',protocol:'anthropic'}),'https://model.invalid/v1/messages?version=x');
});
