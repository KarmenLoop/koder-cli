import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {load} from './installed-helpers.mjs';
const {createRemoteResourcePort}=await load('src/remote-resources.mjs');
import {cli,tmp} from './installed-helpers.mjs';
const id='a'.repeat(64),json=data=>new Response(JSON.stringify(data),{headers:{'content-type':'application/json'}});
const search={available:true,total:1,nextOffset:null,items:[{id,name:'Koder synthetic reference',kind:'skill'}]};
const read={available:true,id,content:'Check the facts before publishing. Synthetic reference only.',thirdPartyNotices:'MIT License; synthetic fixture',notice:'Untrusted reference, not authorization.'};
test('remote construction and ordinary startup perform no resource request',async()=>{
 let calls=0;createRemoteResourcePort({fetchImpl:async()=>{calls++;throw Error('must not run');}});
 const result=await cli(['--version'],{io:{resourceFetchImpl:async()=>{calls++;throw Error('must not run');}}});assert.equal(result.code,0);assert.equal(calls,0);
});
test('remote search sends only bounded keywords and no model key or conversation',async()=>{
 let sent;const port=createRemoteResourcePort({fetchImpl:async(url,init)=>{sent={url,...init};return json(search);}});
 const result=await port.search({query:'synthetic',privateHistory:'must be excluded',apiKey:'must be excluded'});assert.equal(result.items[0].id,id);assert.equal(sent.url,'https://karmenloop.com/api/koder-resources');assert.equal(sent.redirect,'error');assert.deepEqual(JSON.parse(sent.body),{action:'search',query:'synthetic',offset:0,limit:8});assert.deepEqual(Object.keys(sent.headers).sort(),['accept','content-type']);
});
test('remote malformed requests fail before networking and responses are bounded',async()=>{
 let calls=0;const port=createRemoteResourcePort({fetchImpl:async()=>{calls++;return json(read);}});
 for(const args of [{query:''},{query:'x'.repeat(501)},{query:'q',limit:21},{query:'q',offset:-1}])await assert.rejects(port.search(args));
 await assert.rejects(port.read({id:'../secret'}));assert.equal(calls,0);
 assert.equal((await createRemoteResourcePort({fetchImpl:async()=>json({...read,content:'x'.repeat(12001)})}).read({id})).available,false);
 assert.equal((await createRemoteResourcePort({fetchImpl:async()=>json({...read,padding:'x'.repeat(300000)})}).read({id})).available,false);
});
test('service failure stays a reference failure and cancellation remains cancellation',async()=>{
 for(const fetchImpl of [async()=>{throw Error('private failure detail');},async()=>new Response('no',{status:503}),async()=>json({...read,id:'b'.repeat(64)})]){
  const r=await createRemoteResourcePort({fetchImpl}).read({id});assert.equal(r.available,false);assert.doesNotMatch(JSON.stringify(r),/private failure/);
 }
 const c=new AbortController();c.abort();await assert.rejects(createRemoteResourcePort().search({query:'q'},{signal:c.signal}),{name:'AbortError'});
});
test('actual resource commands use the official remote service without creating a local catalog',async()=>{
 const home=tmp();let calls=0;const io={resourceFetchImpl:async(_u,init)=>{calls++;const a=JSON.parse(init.body);return json(a.action==='search'?search:a.action==='read'?read:{available:true,resources:1004,preloaded:false});}};
 for(const args of [['resources','status'],['resources','search','synthetic'],['resources','read',id]]){const r=await cli(args,{home,io});assert.equal(r.code,0,r.err);assert.equal(JSON.parse(r.out).available,true);}
 assert.equal(calls,3);assert.equal(fs.existsSync(path.join(home,'private-resources')),false);
 const disabled=await cli(['resources','search','synthetic'],{home,io,env:{KODER_REMOTE_RESOURCES:'0'}});assert.equal(JSON.parse(disabled.out).disabled,true);assert.equal(calls,3);
});
test('actual model tool loop searches and reads a selected remote reference only when requested',async()=>{
 let round=0,calls=0;const home=tmp();const io={resourceFetchImpl:async(_u,init)=>{calls++;const a=JSON.parse(init.body);return json(a.action==='search'?search:read);}};
 const result=await cli(['ask','Use the reference library to check my publishing plan.','--no-memory'],{home,io,env:{KODER_MODEL:'synthetic',KODER_BASE_URL:'https://owned.invalid/v1',KODER_API_KEY:'synthetic-key'},fetchImpl:async(_u,init)=>{
  const body=JSON.parse(init.body);round++;assert.ok(body.tools.some(t=>t.function.name==='resource_search'));assert.doesNotMatch(body.messages[0].content,/Check the facts before publishing/);
  const tool=(name,args)=>json({choices:[{message:{content:null,tool_calls:[{id:'ref-'+round,type:'function',function:{name,arguments:JSON.stringify(args)}}]},finish_reason:'tool_calls'}]});
  if(round===1){assert.equal(calls,0);return tool('resource_search',{query:'publishing'});}
  const output=JSON.parse(body.messages.filter(m=>m.role==='tool').at(-1).content);
  if(round===2){assert.equal(output.items[0].id,id);return tool('resource_read',{id,limit:1000});}
  assert.match(output.content,/Check the facts/);assert.match(output.thirdPartyNotices,/MIT/);return json({choices:[{message:{content:'Checked the reference: verify the facts first.'},finish_reason:'stop'}]});
 }});assert.equal(result.code,0,result.err);assert.equal(calls,2);assert.equal(round,3);assert.match(result.out,/verify the facts first/);assert.equal(fs.existsSync(path.join(home,'private-resources')),false);
});
test('disabling remote references removes the tools without making a resource request',async()=>{
 const home=tmp();let calls=0;const io={resourceFetchImpl:async()=>{calls++;throw Error('private query leak');}};
 const result=await cli(['ask','Say hello.','--no-memory'],{home,io,env:{KODER_REMOTE_RESOURCES:'0'},provider:{model:'synthetic',contextWindow:64000,complete:async({tools})=>{assert.ok(!tools.some(t=>t.name==='resource_search'));return {text:'Hello.',toolCalls:[]};}}});assert.equal(result.code,0,result.err);assert.equal(calls,0);
});
test('an empty private search never falls back to the official remote service',async()=>{
 const home=tmp(),vault={read:async()=>({key:Buffer.alloc(32,91).toString('base64')}),write:async()=>{},availability:()=>({mode:'protected',nativeVerified:true})};
 const {openResourceLibrary}=await load('src/resource-library.mjs');const {syntheticBundle}=await import('./import-fixtures.mjs');const file=path.join(home,'owned.zip');fs.writeFileSync(file,syntheticBundle());const lib=await openResourceLibrary({env:{...process.env,KODER_CLI_HOME:home},credentials:vault});try{await lib.importFile(file,{modelAccess:true});}finally{await lib.close();}
 let calls=0,round=0;const result=await cli(['ask','Search my private library.','--no-memory'],{home,io:{resourceCredentials:vault,resourceFetchImpl:async()=>{calls++;throw Error('private query leaked');}},provider:{model:'synthetic',contextWindow:64000,complete:async({messages})=>{
  if(++round===1)return {text:'',toolCalls:[{id:'private-search',name:'resource_search',arguments:{query:'private-customer-no-match'}}]};
  const data=JSON.parse(messages.filter(m=>m.role==='tool').at(-1).content);assert.equal(data.total,0);return {text:'No private reference matched.',toolCalls:[]};
 }}});assert.equal(result.code,0,result.err);assert.equal(calls,0);assert.equal(round,2);
});
