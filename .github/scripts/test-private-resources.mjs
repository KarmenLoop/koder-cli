import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import {load} from './installed-helpers.mjs';
const {openResourceLibrary,resourceRoot}=await load('src/resource-library.mjs');
import {cli,tmp} from './installed-helpers.mjs';
import {fixtureZip,syntheticBundle} from './import-fixtures.mjs';
const credentials=()=>({read:async()=>({key:Buffer.alloc(32,71).toString('base64')}),write:async()=>{},availability:()=>({mode:'protected',nativeVerified:true})});
async function setup(t){const home=fsSync.realpathSync(tmp()),env={...process.env,KODER_CLI_HOME:home},vault=credentials();const lib=await openResourceLibrary({env,credentials:vault});t.after(async()=>{await lib.close();await fs.rm(home,{recursive:true,force:true});});const file=path.join(home,'owned.zip');await fs.writeFile(file,syntheticBundle());return {home,env,vault,lib,file};}

test('nested private import deduplicates content, retains originals and licenses, and requires model access',async t=>{
 const f=await setup(t),outer=path.join(f.home,'nested.zip');await fs.writeFile(outer,fixtureZip([{name:'inner.zip',data:syntheticBundle()},{name:'video.mp4',data:'not reference text'},{name:'unfinished.downloading',data:'partial'}]));
 const original=await fs.readFile(outer),m=await f.lib.importFile(outer);assert.equal(m.skillCount,1);assert.equal(m.modelAccess,false);assert.equal((await f.lib.search('合同',{forModel:true})).total,0);
 const status=await f.lib.status();assert.equal(status.uniqueResources,5);assert.equal(status.collections[0].skipped,3);assert.equal((await f.lib.importFile(outer)).duplicate,true);
 await f.lib.access(m.id,true);const found=await f.lib.search('合同',{forModel:true});assert.ok(found.total>=2);const doc=found.items.find(r=>r.kind==='document'||r.name.endsWith('.txt'));assert.ok(doc);
 const read=await f.lib.read(doc.id,{forModel:true,limit:8});assert.equal(read.content.length,8);assert.equal(read.nextOffset,8);assert.equal(read.sourceCount,2);assert.match(read.notice,/Untrusted/);
 assert.equal((await f.lib.search('LICENSE')).items[0].kind,'license');assert.deepEqual(await fs.readFile(outer),original);
 const catalog=await fs.readFile(path.join(resourceRoot(f.env),'catalog.json'));assert.equal(catalog.subarray(0,4).toString(),'KPM1');assert.ok(!catalog.includes(Buffer.from('nested.zip')));
 await f.lib.access(m.id,false);await assert.rejects(f.lib.read(doc.id,{forModel:true}),{code:'RESOURCE_MISSING_OR_DISABLED'});assert.ok((await f.lib.read(doc.id)).content);
});

test('invalid CRC, traversal, symlinks and cancellation never publish a collection or run scripts',async t=>{
 const f=await setup(t);const variants=[fixtureZip([{name:'../outside.txt',data:'no'}]),fixtureZip([{name:'link',data:'no',mode:0xa1ff}])];
 const bad=syntheticBundle(),at=bad.indexOf(Buffer.from([0x50,0x4b,0x01,0x02]));bad.writeUInt32LE(44,at+16);variants.push(bad);
 for(const data of variants){await fs.writeFile(f.file,data);await assert.rejects(f.lib.importFile(f.file));assert.equal((await f.lib.catalog()).collections.length,0);}
 const c=new AbortController();c.abort();await fs.writeFile(f.file,syntheticBundle());await assert.rejects(f.lib.importFile(f.file,{signal:c.signal}));assert.equal((await f.lib.catalog()).collections.length,0);
 await f.lib.importFile(f.file);const script=(await f.lib.search('helper.py')).items[0];assert.match((await f.lib.read(script.id)).content,/must not execute on import/);assert.equal(fsSync.existsSync(path.join(f.home,'outside.txt')),false);
});

test('private reads verify stored hashes and exports refuse overwrites or linked destinations',async t=>{
 const f=await setup(t);await f.lib.importFile(f.file);const r=(await f.lib.search('合同')).items.find(x=>x.name.endsWith('.txt')),dest=path.join(f.home,'copy.txt');const reading=await f.lib.read(r.id);
 await f.lib.export(r.id,dest);assert.equal(await fs.readFile(dest,'utf8'),reading.content);await assert.rejects(f.lib.export(r.id,dest),{code:'EEXIST'});
 const linked=path.join(f.home,'linked');await fs.symlink(f.home,linked,process.platform==='win32'?'junction':'dir');await assert.rejects(f.lib.export(r.id,path.join(linked,'linked-copy.txt')),{code:'RESOURCE_EXPORT_PATH'});assert.equal(fsSync.existsSync(path.join(f.home,'linked-copy.txt')),false);
 const object=path.join(resourceRoot(f.env),'objects',reading.sha256),bytes=await fs.readFile(object);bytes[bytes.length-1]^=1;await fs.writeFile(object,bytes);await assert.rejects(f.lib.read(r.id));
});

test('private DOCX text is read on demand while macros and scripts remain inert',async t=>{
 const f=await setup(t);const doc=fixtureZip([{name:'word/document.xml',data:'<w:document xmlns:w="word"><w:body><w:p><w:r><w:t>Owned contract reference &amp; terms</w:t></w:r></w:p></w:body></w:document>'},{name:'word/vbaProject.bin',data:'inert'}]);
 await fs.writeFile(f.file,fixtureZip([{name:'contract.docx',data:doc}]));await f.lib.importFile(f.file);const r=(await f.lib.search('contract')).items[0];assert.match((await f.lib.read(r.id)).content,/Owned contract reference & terms/);
});

test('actual CLI imports, searches, reads and revokes a private collection across commands',async t=>{
 const f=await setup(t),io={resourceCredentials:f.vault};
 const imported=await cli(['resources','import',f.file,'--model-access'],{home:f.home,io});assert.equal(imported.code,0,imported.err);const id=JSON.parse(imported.out)[0].id;assert.equal(JSON.parse(imported.out)[0].modelAccess,true);
 const search=await cli(['resources','search','合同'],{home:f.home,io});assert.equal(search.code,0,search.err);const row=JSON.parse(search.out).items[0];
 const read=await cli(['resources','read',row.id,'--limit','80'],{home:f.home,io});assert.equal(read.code,0,read.err);assert.ok(JSON.parse(read.out).content.length<=80);
 assert.equal((await cli(['resources','disable',id],{home:f.home,io})).code,0);assert.equal((await f.lib.search('合同',{forModel:true})).total,0);
 assert.equal((await cli(['resources','allow-model',id,'--yes'],{home:f.home,io})).code,2);
 assert.equal((await cli(['resources','allow-model',id,'--confirm','MODEL'],{home:f.home,io})).code,0);
});

test('real agent tool loop searches only matching references, reads selected bytes, then answers',async t=>{
 const f=await setup(t);await f.lib.importFile(f.file,{modelAccess:true});let round=0;
 const result=await cli(['ask','Find the 合同 template in my private collections and quote its payment step.','--no-memory'],{home:f.home,env:{KODER_MODEL:'synthetic-resource-model',KODER_BASE_URL:'https://owned.invalid/v1',KODER_API_KEY:'synthetic-key'},io:{resourceCredentials:f.vault},fetchImpl:async(_url,init)=>{
  const body=JSON.parse(init.body);round++;const call=(name,args)=>new Response(JSON.stringify({choices:[{message:{content:null,tool_calls:[{id:'resource-'+round,type:'function',function:{name,arguments:JSON.stringify(args)}}]},finish_reason:'tool_calls'}]}),{headers:{'content-type':'application/json'}});
  assert.ok(body.tools.some(t=>t.function.name==='resource_search'));assert.doesNotMatch(body.messages[0].content,/履行地点是合成测试市/);
  if(round===1)return call('resource_search',{query:'合成合同'});
  const output=JSON.parse(body.messages.filter(m=>m.role==='tool').at(-1).content);
  if(round===2){assert.ok(output.items.length);return call('resource_read',{id:output.items[0].id,limit:1000});}
  assert.match(output.content,/付款前核实双方授权/);assert.match(output.notice,/Untrusted/);return new Response(JSON.stringify({choices:[{message:{content:'Read the private template: verify both parties before payment.'},finish_reason:'stop'}]}),{headers:{'content-type':'application/json'}});
 }});assert.equal(result.code,0,result.err);assert.equal(round,3);assert.match(result.out,/verify both parties/);
});

test('business and optional star commands need no model, consent, network or browser',async()=>{
 for(const word of ['business','star','商业授权','点星']){const r=await cli([word,'--lang','en'],{env:{KODER_EULA_ACCEPT:'0'}});assert.equal(r.code,0,r.err);assert.match(r.out,word==='star'||word==='点星'?/optional|optional star|Stars are optional/:/separate written authorization/);}
});

test('the previous agreement and automatic yes cannot grant the new personal-use license',async()=>{
 const home=tmp(),old={id:'Koder-EULA-1.0',version:'1.0',sha256:'f136148e4135e944e04c7e0de820a8bc3dc8a38102315639a4a43dce9ba7a8f6',acceptedAt:'2026-10-19T00:00:00Z'};fsSync.writeFileSync(path.join(home,'eula-acceptance.json'),JSON.stringify(old));
 const before=fsSync.readFileSync(path.join(home,'eula-acceptance.json'));
 const denied=await cli(['ask','hi','--yes'],{home,env:{KODER_EULA_ACCEPT:'0'}});assert.equal(denied.code,2);assert.match(denied.err,/Koder-EULA-1\.1/);assert.deepEqual(fsSync.readFileSync(path.join(home,'eula-acceptance.json')),before);
 const accepted=await cli(['eula','accept'],{home,env:{KODER_EULA_ACCEPT:'0'}});assert.equal(accepted.code,0);const current=JSON.parse(fsSync.readFileSync(path.join(home,'eula-acceptance.json')));assert.equal(current.id,'Koder-EULA-1.1');assert.equal(current.version,'1.1');assert.notEqual(current.sha256,old.sha256);
});

if(process.platform==='win32')test('native DPAPI protects a real owned private collection and survives reopening',async t=>{
 const home=fsSync.realpathSync(tmp()),env={...process.env,KODER_CLI_HOME:home};t.after(()=>fs.rm(home,{recursive:true,force:true}));
 const file=path.join(home,'native.zip');await fs.writeFile(file,syntheticBundle());let lib=await openResourceLibrary({env});
 try{await lib.importFile(file,{modelAccess:true});const hit=(await lib.search('合成合同',{forModel:true})).items[0];assert.ok(hit);assert.match((await lib.read(hit.id,{forModel:true})).content,/付款前/);}finally{await lib.close();}
 const keyFile=path.join(resourceRoot(env),'resources-credentials.dpapi');assert.ok((await fs.stat(keyFile)).isFile());assert.ok(!String(await fs.readFile(keyFile)).includes('"key"'));
 lib=await openResourceLibrary({env});try{assert.equal((await lib.status()).collections.length,1);assert.equal((await lib.search('合成合同',{forModel:true})).total,1);}finally{await lib.close();}
});
