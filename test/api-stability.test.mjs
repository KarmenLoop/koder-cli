import assert from 'node:assert/strict';
import http from 'node:http';
import test from 'node:test';
import { cli, tmp } from './helpers.mjs';

const answer = JSON.stringify({choices:[{message:{content:'connection recovered'},finish_reason:'stop'}]});
async function endpoint(t, handle) {
  const requests=[];
  const server=http.createServer((req,res)=>{
    let body=''; req.on('data',c=>body+=c); req.on('end',()=>{
      requests.push({url:req.url,headers:req.headers,body:JSON.parse(body||'{}')});
      handle(req,res,requests.length);
    });
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  t.after(()=>{server.closeAllConnections();return new Promise(r=>server.close(r));});
  return {server,requests,url:`http://127.0.0.1:${server.address().port}/v1`};
}
const envFor = url => ({KODER_MODEL:'fixture',KODER_BASE_URL:url,KODER_AUTH:'none',KODER_API_RETRY_DELAY_MS:'1'});
for (const status of [408,429,500,502,503,504]) test(`model recovers from transient HTTP ${status}`,async t=>{
  const fixture=await endpoint(t,(_req,res,count)=>{
    res.writeHead(count===1?status:200,{'content-type':'application/json','retry-after':'0'});
    res.end(count===1?'{}':answer);
  });
  const result=await cli(['ask','hello'],{env:envFor(fixture.url)});
  assert.equal(result.code,0,result.err);
  assert.match(result.out,/connection recovered/);
  assert.equal(fixture.requests.length,2);
});
test('model recovers from a socket reset before headers',async t=>{
  const fixture=await endpoint(t,(req,res,count)=>{
    if(count===1)return req.socket.destroy();
    res.writeHead(200,{'content-type':'application/json'});res.end(answer);
  });
  const result=await cli(['ask','hello'],{env:envFor(fixture.url)});
  assert.equal(result.code,0,result.err);
  assert.match(result.out,/connection recovered/);
  assert.equal(fixture.requests.length,2);
});
for(const status of [400,401,403,404,422]) test(`HTTP ${status} gives an actionable failure without retry`,async t=>{
  const fixture=await endpoint(t,(_req,res)=>{res.writeHead(status,{'content-type':'application/json'});res.end('{"secret":"must-not-be-shown"}');});
  const result=await cli(['ask','hello'],{env:envFor(fixture.url)});
  assert.equal(result.code,2);
  assert.equal(fixture.requests.length,1);
  assert.match(result.err,new RegExp(`HTTP ${status}`));
  assert.doesNotMatch(result.err,/must-not-be-shown/);
});
test('idle response body times out with a diagnostic and is not replayed',async t=>{
  const fixture=await endpoint(t,(_req,res)=>{res.writeHead(200,{'content-type':'text/event-stream'});res.flushHeaders();});
  // Bounds the unfixed baseline as well; the repaired client must finish first.
  const emergency=setTimeout(()=>fixture.server.closeAllConnections(),500);
  t.after(()=>clearTimeout(emergency));
  const result=await cli(['ask','hello'],{env:{...envFor(fixture.url),KODER_API_IDLE_TIMEOUT_MS:'40',KODER_API_TIMEOUT_MS:'300'}});
  assert.equal(result.code,2);
  assert.match(result.err,/API_IDLE_TIMEOUT/);
  assert.equal(fixture.requests.length,1);
});
test('query parameters and full chat endpoint survive URL construction',async t=>{
  const fixture=await endpoint(t,(req,res)=>{
    const valid=req.url==='/v1/chat/completions?api-version=fixture';
    res.writeHead(valid?200:404,{'content-type':'application/json'});res.end(valid?answer:'{}');
  });
  const result=await cli(['ask','hello'],{env:envFor(`${fixture.url}/chat/completions?api-version=fixture`)});
  assert.equal(result.code,0,result.err);
  assert.equal(fixture.requests[0].url,'/v1/chat/completions?api-version=fixture');
});

test('persistent failures stop at three attempts and retries can be disabled',async t=>{
  const fixture=await endpoint(t,(_req,res)=>{res.writeHead(503,{'retry-after':'0'});res.end('{}');});
  const result=await cli(['ask','hello'],{env:envFor(fixture.url)});
  assert.equal(result.code,2);assert.equal(fixture.requests.length,3);
  const next=await cli(['ask','hello'],{env:{...envFor(fixture.url),KODER_API_RETRIES:'0'}});
  assert.equal(next.code,2);assert.equal(fixture.requests.length,4);
});
test('Retry-After beyond total budget is returned immediately',async t=>{
  const fixture=await endpoint(t,(_req,res)=>{res.writeHead(429,{'retry-after':'120'});res.end('{}');});
  const result=await cli(['ask','hello'],{env:{...envFor(fixture.url),KODER_API_TIMEOUT_MS:'100'}});
  assert.equal(result.code,2);assert.equal(fixture.requests.length,1);assert.match(result.err,/HTTP 429/);
});
test('partial streamed tool call is never retried or executed',async t=>{
  const dir=tmp();
  const fixture=await endpoint(t,(req,res)=>{
    res.writeHead(200,{'content-type':'text/event-stream'});
    res.write('data: '+JSON.stringify({choices:[{delta:{tool_calls:[{index:0,id:'call-1',function:{name:'write_file',arguments:'{"path":"wrong.txt","content":"x"}'}}]}}]})+'\n\n');
    setTimeout(()=>req.socket.destroy(),20);
  });
  const result=await cli(['run','write a file','--yes','-w',dir],{env:envFor(fixture.url)});
  assert.equal(result.code,2);assert.equal(fixture.requests.length,1);
  const {existsSync}=await import('node:fs');
  assert.equal(existsSync(`${dir}/wrong.txt`),false);
  assert.match(result.err,/UND_ERR_SOCKET|API_NETWORK/);
});
test('HTML from a wrong endpoint has a useful diagnostic',async t=>{
  const fixture=await endpoint(t,(_req,res)=>{res.writeHead(200,{'content-type':'text/html'});res.end('<html>not an API</html>');});
  const result=await cli(['ask','hello'],{env:envFor(fixture.url)});
  assert.equal(result.code,2);assert.match(result.err,/API_INVALID_RESPONSE/);assert.match(result.err,/API 路径/);assert.equal(fixture.requests.length,1);
});
test('model test validates a reply, doctor default does not claim a live check',async t=>{
  const fixture=await endpoint(t,(_req,res)=>{res.writeHead(200,{'content-type':'application/json'});res.end(answer);});
  const checked=await cli(['model','test'],{env:envFor(fixture.url)});
  assert.equal(checked.code,0,checked.err);assert.match(checked.out,/已验证模型回复/);
  const doctor=await cli(['doctor'],{env:envFor(fixture.url)});
  assert.equal(doctor.code,0);assert.match(doctor.out,/这里只检查配置/);assert.equal(fixture.requests.length,1);
  const live=await cli(['doctor','--api'],{env:envFor(fixture.url)});
  assert.equal(live.code,0,live.err);assert.equal(fixture.requests.length,2);
});
test('model test rejects invalid JSON without echoing the body',async t=>{
  const fixture=await endpoint(t,(_req,res)=>{res.writeHead(200,{'content-type':'application/json'});res.end('{credential-should-not-appear');});
  const result=await cli(['model','test'],{env:envFor(fixture.url)});
  assert.equal(result.code,2);assert.match(result.err,/API_INVALID_RESPONSE/);assert.doesNotMatch(result.err,/credential-should-not-appear/);
});
test('Anthropic endpoint query is preserved and transient failure recovers',async t=>{
  const fixture=await endpoint(t,(_req,res,count)=>{
    res.writeHead(count===1?503:200,{'content-type':'application/json','retry-after':'0'});
    res.end(count===1?'{}':JSON.stringify({content:[{type:'text',text:'ready'}],stop_reason:'end_turn'}));
  });
  const result=await cli(['model','test'],{env:{...envFor(`${fixture.url}/messages?version=fixture`),KODER_PROTOCOL:'anthropic',KODER_API_KEY:'fixture-only'}});
  assert.equal(result.code,0,result.err);assert.equal(fixture.requests.length,2);
  assert.equal(fixture.requests[0].url,'/v1/messages?version=fixture');
  assert.equal(fixture.requests[0].headers['x-api-key'],'fixture-only');
});

test('MoA reference and aggregator use recovery and preserve their own URL queries',async t=>{
  const {writeFileSync,mkdirSync}=await import('node:fs');const home=tmp();
  const fixture=await endpoint(t,(req,res,count)=>{
    res.writeHead(count===1?503:200,{'content-type':'application/json','retry-after':'0'});res.end(count===1?'{}':answer);
  });
  mkdirSync(`${home}/models`);
  writeFileSync(`${home}/models/ref.json`,JSON.stringify({model:'ref',baseUrl:`${fixture.url}/chat/completions?who=ref`,auth:'none'}));
  writeFileSync(`${home}/moa.json`,JSON.stringify({active:'default',presets:{default:{references:['ref']}}}));
  const result=await cli(['ask','hello','--moa'],{home,env:envFor(`${fixture.url}?who=aggregator`)});
  assert.equal(result.code,0,result.err);assert.equal(fixture.requests.length,3);
  assert.deepEqual(fixture.requests.map(r=>r.url),['/v1/chat/completions?who=ref','/v1/chat/completions?who=ref','/v1/chat/completions?who=aggregator']);
});
