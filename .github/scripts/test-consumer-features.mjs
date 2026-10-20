import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import vm from 'node:vm';
import {PassThrough,Writable} from 'node:stream';
import {pathToFileURL} from 'node:url';
const root=process.env.KODER_ACCEPTANCE_PACKAGE;assert.ok(root);
const load=rel=>import(pathToFileURL(path.join(root,rel)));
const {runCli}=await load('src/cli.mjs'),{writeAcceptance}=await load('src/eula.mjs');
const {presets,presetRecord}=await load('src/commands/model.mjs');
const {normalizeRecord}=await load('src/provider.mjs');
const {withModelEndpoint}=await load('src/model-http.mjs');
const {importKernel}=await load('src/agent.mjs');
const {createProvider}=await importKernel('harness/providers.mjs',{}),tokens=await importKernel('fusion/tokens.mjs',{});
const {projectContext}=await load('src/context.mjs');
const {celebrationPreferences,lookupCountry}=await load('src/celebrations.mjs');
const {writePrivate}=await load('src/private-state.mjs');
const {birthdayMusic,birthdayPage}=await load('src/birthday-music.mjs');
const {birthdayMention,occasionsOn}=await load('src/occasions.mjs');
const {EFFECTS,renderCelebration}=await load('src/celebration-animation.mjs');
const {wantsFeedback,feedbackText}=await load('src/feedback.mjs');
const owned=[];const tmp=()=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'koder-consumer-'));owned.push(dir);return dir;};
process.on('exit',()=>{for(const dir of owned)try{fs.rmSync(dir,{recursive:true,force:true});}catch{}});
async function cli(argv,{home=tmp(),cwd=home,env={},fetchImpl,io={},accepted=true}={}) {
 let out='',err='';const stdout=new Writable({write(c,e,cb){out+=c;cb();}}),stderr=new Writable({write(c,e,cb){err+=c;cb();}}),stdin=new PassThrough();stdin.end();
 const childEnv={PATH:process.env.PATH,SystemRoot:process.env.SystemRoot,KODER_CLI_HOME:home,NO_COLOR:'1',...env};if(accepted)writeAcceptance(childEnv);
 const code=await runCli(argv,{cwd,env:childEnv,stdin,stdout,stderr,noTerminal:true,fetchImpl,...io});return {code,out,err,home};
}
const json=value=>new Response(JSON.stringify(value),{headers:{'content-type':'application/json'}});
test('installed full privacy originals retain their hashes and can be read without license acceptance',async()=>{
 const source=JSON.parse(fs.readFileSync(path.join(root,'docs/privacy/SOURCES.json'),'utf8'));for(const row of source.sources)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'docs/privacy',row.file))).digest('hex'),row.sha256);
 for(const lang of ['zh','en'])for(const name of ['consumer','statement','desktop','agreement']){const r=await cli(['privacy',name,'--lang',lang],{accepted:false});assert.equal(r.code,0,r.err);assert.ok(r.out.length>800);}
});
test('installed MiMo Pro accepts nullable streaming metadata through an actual file-tool continuation',async()=>{
 const cwd=tmp();fs.writeFileSync(path.join(cwd,'fixture.txt'),'owned MiMo fixture');let requests=0;
 const r=await cli(['run','Read fixture.txt and report the result.','--no-memory'],{cwd,env:{KODER_MODEL:'mimo-v2.6-pro',KODER_BASE_URL:'https://api.xiaomimimo.com/v1',KODER_API_KEY:'sk-synthetic-fixture'},fetchImpl:async(url,init)=>{
  assert.equal(url,'https://api.xiaomimimo.com/v1/chat/completions');const b=JSON.parse(init.body);requests++;
  if(requests===2){assert.ok(b.messages.some(m=>m.role==='tool'&&m.content.includes('owned MiMo fixture')));assert.ok(b.messages.some(m=>m.reasoning_content==='private fixture reasoning'));return json({choices:[{finish_reason:'stop',message:{content:'verified owned fixture'}}]});}
  const frames=[{reasoning_content:'private fixture reasoning'},{content:'Reading '},{tool_calls:[{index:0,id:'owned_mimo',function:{name:'read_file',arguments:'{"path":'}}]},{tool_calls:[{index:0,id:null,type:null,function:{name:null,arguments:'"fixture.txt"}'}}]},{tool_calls:[{index:0,id:null,function:{name:null,arguments:null}}]}];
  const data=frames.map(delta=>'data: '+JSON.stringify({choices:[{delta}]})+'\n\n').join('')+'data: '+JSON.stringify({choices:[{delta:{},finish_reason:'tool_calls'}]})+'\n\ndata: [DONE]\n\n';return new Response(data,{headers:{'content-type':'text/event-stream'}});
 }});assert.equal(r.code,0,r.err);assert.equal(requests,2);assert.match(r.out,/verified owned fixture/);assert.doesNotMatch(r.out,/private fixture reasoning|MODEL_PROTOCOL/);
});
test('a greeting isolates old task projection while an explicit continuation still sees saved history',()=>{
 const history=[{role:'user',content:'OLD-TASK-21 rewrite the website'},{role:'assistant',content:'I will write a script.'},{role:'user',content:'你好'}],before=structuredClone(history),args={system:{role:'system',content:'help'},history,profile:{contextWindow:8192,maxOutput:512},helpers:tokens};
 assert.doesNotMatch(JSON.stringify(projectContext({...args,query:'你好'}).messages),/OLD-TASK-21/);assert.deepEqual(history,before);
 assert.match(JSON.stringify(projectContext({...args,history:[...history,{role:'user',content:'继续之前的网站任务'}],query:'继续之前的网站任务'}).messages),/OLD-TASK-21/);
});
test('subscription presets retain exact billing paths and reject known credential mistakes',async()=>{
 const all=await presets({env:{}});assert.equal(all.length,35);assert.equal(all.reduce((n,p)=>n+(p.models?.length||0),0),94);
 for(const id of ['aliyun-token-plan','aliyun-coding-plan','volcano-coding-plan']){const p=all.find(p=>p.id===id);assert.ok(p);const r=normalizeRecord({...presetRecord(p),apiKey:'sk-sp-synthetic-plan'});const provider=createProvider({provider:r,fetchImpl:withModelEndpoint(async url=>{assert.equal(url,p.baseUrl+'/chat/completions');return json({choices:[{finish_reason:'stop',message:{content:'ready'}}]});},r)});assert.equal((await provider.complete({messages:[{role:'user',content:'hi'}],tools:[]})).text,'ready');}
 assert.throws(()=>normalizeRecord({model:'qwen3.8-max',baseUrl:'https://dashscope.aliyuncs.com/compatible-mode/v1',apiKey:'sk-sp-synthetic-plan'}),/PLAN_ENDPOINT_MISMATCH/);
});
test('birthday and music consent are separate and --yes grants neither',async()=>{
 const home=tmp(),env={KODER_CLI_HOME:home};await cli(['celebrate','birthday','--date','03-14','--yes'],{home});assert.equal(celebrationPreferences(env).birthday,null);
 await cli(['celebrate','birthday','--date','03-14','--confirm','BIRTHDAY'],{home});assert.equal(celebrationPreferences(env).birthday,'03-14');assert.equal(celebrationPreferences(env).musicEnabled,false);
 await cli(['celebrate','music','on','--yes'],{home});assert.equal(celebrationPreferences(env).musicEnabled,false);
});
test('forgetting birthday removes its page and markers without unrelated settings',async()=>{
 const home=tmp(),env={KODER_CLI_HOME:home};writePrivate('preferences.json',{birthday:'03-14',musicEnabled:true,language:'en'},env);writePrivate('birthday.html','owned page',env);
 const r=await cli(['celebrate','birthday','forget'],{home});assert.equal(r.code,0,r.err);assert.equal(celebrationPreferences(env).birthday,null);assert.equal(celebrationPreferences(env).language,'en');assert.equal(fs.existsSync(path.join(home,'delight/birthday.html')),false);
});
test('feedback offers a safe blank template and no automatic message',async()=>{
 assert.ok(wantsFeedback('我要反馈软件问题'));assert.equal(wantsFeedback('添加反馈按钮'),false);const t=feedbackText({lang:'en',version:'fixture',config:{apiKey:'private-sentinel'}});assert.match(t,/info@karmenloop.com/);assert.doesNotMatch(t,/private-sentinel/);
 const r=await cli(['feedback','--json'],{accepted:false});assert.equal(r.code,0,r.err);assert.equal(JSON.parse(r.out).automaticSending,false);
});
test('country lookup is explicitly confirmed and sends no model key',async()=>{
 let requests=0;const home=tmp(),countryFetch=async(url,init)=>{requests++;assert.equal(url,'https://ipapi.co/country/');assert.deepEqual(init.headers,{Accept:'text/plain'});return new Response('US');};
 await cli(['celebrate','locale','--ip','--yes'],{home,io:{countryFetch}});assert.equal(requests,0);
 await cli(['celebrate','locale','--ip','--confirm','IP'],{home,io:{countryFetch}});assert.equal(requests,1);assert.equal(celebrationPreferences({KODER_CLI_HOME:home}).country,'US');
 await assert.rejects(lookupCountry({io:{countryFetch:async()=>new Response('invalid'.repeat(30))}}),/REGION_LOOKUP_INVALID/);
});
test('each effect is bounded and script/JSON output has no terminal control stream',async()=>{
 for(const id of EFFECTS){const scene=renderCelebration(id,.45,{columns:60,rows:18});assert.ok(scene.split('\n').every(line=>line.length<=58));const r=await cli(['celebrate',id,'--json']);assert.equal(r.code,0,r.err);assert.equal(JSON.parse(r.out).skipped,true);assert.doesNotMatch(r.out,/\x1b\[/);}
});
test('birthday music opens once per day and its local page has no external script or network connection',async()=>{
 const home=tmp(),env={KODER_CLI_HOME:home};let urls=[];const ctx={env,lang:'en',io:{openBrowser:async url=>{urls.push(url);return true;}}},options={date:new Date(2026,9,20,12),preferences:{musicEnabled:true,resolvedLanguage:'en'}};
 assert.equal((await birthdayMusic(ctx)).state,'disabled');assert.equal((await birthdayMusic(ctx,options)).state,'browser-open-requested');assert.equal((await birthdayMusic(ctx,options)).state,'already-offered');assert.equal(urls.length,1);
 const page=fs.readFileSync(new URL(urls[0]),'utf8');assert.match(page,/lang="en"/);assert.match(page,/connect-src &#39;none&#39;/);assert.doesNotMatch(page,/<script[^>]*src=/);
});
test('blocked autoplay and a manual click schedule one melody, with a working Stop button',async()=>{
 const source=/<script>([\s\S]*?)<\/script>/.exec(birthdayPage('en'))[1],pending=[],handlers={};let notes=0;const button={addEventListener:(n,f)=>handlers.play=f},stop={addEventListener:(n,f)=>handlers.stop=f},status={};
 class Audio {state='suspended';currentTime=0;resume(){return new Promise(resolve=>pending.push(()=>{this.state='running';resolve();}));}createOscillator(){notes++;return{frequency:{},connect(){},start(){},stop(){}};}createGain(){return {connect(){},gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}}};}close(){}}
 vm.runInNewContext(source,{window:{AudioContext:Audio},document:{querySelector:s=>s==='button'?button:s==='#stop'?stop:status},setTimeout:()=>1,clearTimeout(){}});const manual=handlers.play();for(const done of pending)done();await manual;await Promise.resolve();assert.equal(notes,25);handlers.stop();assert.equal(button.disabled,false);
});
test('birthday and holiday detection never invent a date from another person or an example',()=>{
 assert.deepEqual(birthdayMention('记住我的生日是三月十四日'),{date:'03-14',explicit:true});assert.equal(birthdayMention('我朋友的生日是10月20日'),null);assert.equal(birthdayMention('My birthday is 10/20. Do not remember it.'),null);
 assert.ok(occasionsOn(new Date(2026,1,17,12),{country:'CN'}).some(o=>o.id==='spring-festival'));assert.ok(occasionsOn(new Date(2027,1,28,12),{birthday:'02-29'}).some(o=>o.id==='birthday'));
});
