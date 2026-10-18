import assert from 'node:assert/strict';
import http from 'node:http';
import net from 'node:net';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import test from 'node:test';
import {proxyBootstrapEnv} from '../src/network-bootstrap.mjs';
import {tmp} from './helpers.mjs';
const bin=fileURLToPath(new URL('../bin/koder.mjs',import.meta.url));
function run(env){return new Promise((resolve,reject)=>{
  const child=spawn(process.execPath,[bin,'model','test'],{env,stdio:['ignore','pipe','pipe']});let out='',err='';
  const timer=setTimeout(()=>child.kill('SIGTERM'),5000);
  child.stdout.on('data',v=>out+=v);child.stderr.on('data',v=>err+=v);child.on('error',reject);child.on('exit',code=>{clearTimeout(timer);resolve({code,out,err});});
});}
function fixtureResponse(_req,res){res.writeHead(200,{'content-type':'application/json'});res.end(JSON.stringify({choices:[{message:{content:'ready'},finish_reason:'stop'}]}));}
async function fixture(t){
  const sockets=new Set();const model=http.createServer(fixtureResponse);const proxy=http.createServer();let tunnels=0;
  proxy.on('connect',(req,client,head)=>{
    tunnels++;const upstream=net.connect(model.address().port,'127.0.0.1',()=>{client.write('HTTP/1.1 200 Connection Established\r\n\r\n');if(head.length)upstream.write(head);client.pipe(upstream);upstream.pipe(client);});
    sockets.add(client);sockets.add(upstream);client.on('error',()=>upstream.destroy());upstream.on('error',()=>client.destroy());client.on('close',()=>upstream.destroy());upstream.on('close',()=>client.destroy());
  });
  await Promise.all([new Promise(r=>model.listen(0,'127.0.0.1',r)),new Promise(r=>proxy.listen(0,'127.0.0.1',r))]);
  t.after(async()=>{for(const socket of sockets)socket.destroy();model.closeAllConnections();proxy.closeAllConnections();await Promise.all([new Promise(r=>model.close(r)),new Promise(r=>proxy.close(r))]);});
  return {url:`http://127.0.0.1:${model.address().port}/v1`,proxy:`http://127.0.0.1:${proxy.address().port}`,tunnels:()=>tunnels};
}
test('proxy bootstrap respects opt-out, unavailable runtime and lowercase proxy settings',()=>{
  assert.equal(proxyBootstrapEnv({HTTP_PROXY:'http://proxy',NODE_USE_ENV_PROXY:'0'},true),null);
  assert.equal(proxyBootstrapEnv({HTTP_PROXY:'http://proxy'},false),null);
  assert.equal(proxyBootstrapEnv({},true),null);
  assert.equal(proxyBootstrapEnv({https_proxy:'http://proxy'},true).NODE_USE_ENV_PROXY,'1');
});
test('actual launcher reaches a model through configured HTTP proxy',async t=>{
  const server=await fixture(t);
  const result=await run({PATH:process.env.PATH,KODER_CLI_HOME:tmp(),KODER_MODEL:'fixture',KODER_BASE_URL:'http://model.invalid/v1',KODER_AUTH:'none',HTTP_PROXY:server.proxy,HTTPS_PROXY:server.proxy,KODER_API_TIMEOUT_MS:'2000',KODER_API_RETRIES:'0'});
  assert.equal(result.code,0,result.err);assert.match(result.out,/已验证模型回复/);assert.equal(server.tunnels(),1);
});
test('actual launcher honours NO_PROXY for local model',async t=>{
  const server=await fixture(t);
  const result=await run({PATH:process.env.PATH,KODER_CLI_HOME:tmp(),KODER_MODEL:'fixture',KODER_BASE_URL:server.url,KODER_AUTH:'none',HTTP_PROXY:server.proxy,HTTPS_PROXY:server.proxy,NO_PROXY:'127.0.0.1',KODER_API_TIMEOUT_MS:'2000'});
  assert.equal(result.code,0,result.err);assert.equal(server.tunnels(),0);
});

test('proxy launcher preserves a single process-group SIGINT and async cleanup', {skip:process.platform==='win32'}, async t=>{
  const {writeFileSync}=await import('node:fs');
  const preload=`${tmp()}/signal-preload.mjs`;
  writeFileSync(preload,`if(process.env.NODE_USE_ENV_PROXY==='1'){
    const hold=setInterval(()=>{},1000);
    process.once('SIGINT',async()=>{console.log('cleanup-start');await new Promise(r=>setTimeout(r,80));console.log('cleanup-done');clearInterval(hold);});
    setTimeout(()=>console.log('signal-ready'),30);
  }`);
  const child=spawn(process.execPath,['--import',preload,bin,'version'],{env:{PATH:process.env.PATH,HTTP_PROXY:'http://127.0.0.1:1',KODER_CLI_HOME:tmp()},detached:true,stdio:['ignore','pipe','pipe']});
  let out='',err='',sent=false;
  const timer=setTimeout(()=>{try{process.kill(-child.pid,'SIGKILL');}catch{}},3000);
  t.after(()=>clearTimeout(timer));
  child.stdout.on('data',v=>{out+=v;if(out.includes('signal-ready')&&!sent){sent=true;process.kill(-child.pid,'SIGINT');}});
  child.stderr.on('data',v=>err+=v);
  const result=await new Promise(resolve=>child.once('exit',(code,signal)=>resolve({code,signal})));
  assert.equal(sent,true,err);assert.equal(result.code,0,`${JSON.stringify(result)}\n${out}\n${err}`);
  assert.equal((out.match(/cleanup-start/g)||[]).length,1);assert.match(out,/cleanup-done/);
});
