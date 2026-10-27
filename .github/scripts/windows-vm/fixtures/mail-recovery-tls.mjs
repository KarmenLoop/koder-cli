import {loadRelease} from "../release.mjs";
// Synthetic accounts, process-local test CA and loopback TLS only.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import tls from 'node:tls';
const {importKernel} = await loadRelease("src/agent.mjs");
const {createMailAccount}=await importKernel('fusion/mail-account.mjs');
const {mailConnectionOptions}=await importKernel('fusion/mail-providers.mjs');
const {createPrivateStore,createPrivateFiles}=await importKernel('fusion/private-store.mjs');
const {createPersonalizationLock}=await importKernel('fusion/protected-lock.mjs');
const {createMailAssistant} = await loadRelease("src/mail-assistant.mjs");
const key=await fs.readFile(new URL('./mail-test-key.pem',import.meta.url)),cert=await fs.readFile(new URL('./mail-test-cert.pem',import.meta.url));
const outbound={to:'recipient@example.test',subject:'Synthetic meeting',text:'See you at noon.'};
async function fixture(t){
 const dir=await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(),'mail-recovery-'))),sockets=new Set(),servers=[],commands=[],received=[];
 const state={authReject:false,recipientReject:false,dataReject:false,requireDate:false,dropAck:false,holdAck:false,inboxReject:false,approvals:0,allow:true};
 let bodySeen;const afterBody=new Promise(r=>bodySeen=r);
 const raw='From: Ada <ada@example.test>\r\nTo: synthetic@163.com\r\nSubject: Lunch?\r\nMessage-ID: <lunch@example.test>\r\nContent-Type: text/plain; charset=utf-8\r\n\r\nSee you at noon?';
 async function start(kind){
  const server=tls.createServer({key,cert},socket=>{
   sockets.add(socket);socket.on('error',()=>{});socket.on('close',()=>sockets.delete(socket));
   socket.write(kind==='smtp'?'220 loopback\r\n':'* OK loopback\r\n');let buffer='',data=false,auth=0,identified=false;
   socket.on('data',chunk=>{buffer+=chunk.toString();for(;;){
    if(data){const at=buffer.indexOf('\r\n.\r\n');if(at<0)return;received.push(buffer.slice(0,at));buffer=buffer.slice(at+5);data=false;bodySeen();if(state.dropAck){socket.destroy();return;}const missingDate=state.requireDate&&!Number.isFinite(Date.parse(/^Date: (.+)\r?$/m.exec(received.at(-1))?.[1]));if(!state.holdAck)socket.write(state.dataReject||missingDate?'550 rejected PRIVATE_SERVER_DETAIL\r\n':'250 accepted\r\n');continue;}
    const at=buffer.indexOf('\r\n');if(at<0)return;const line=buffer.slice(0,at);buffer=buffer.slice(at+2);
    // Do not record credentials, even synthetic ones, in protocol traces.
    commands.push(auth?'AUTH_RESPONSE':line.startsWith('LOGIN LOGIN ')?'LOGIN LOGIN [redacted]':line);
    if(kind==='smtp'){
     if(auth){assert.equal(Buffer.from(line,'base64').toString(),auth===1?'synthetic@163.com':'SYNTHETIC_AUTHORIZATION_CODE');socket.write(auth===1?'334 UGFzc3dvcmQ6\r\n':state.authReject?'535 PRIVATE_SERVER_DETAIL\r\n':'235 authenticated\r\n');auth=auth===1?2:0;}
     else if(line==='EHLO koder')socket.write('250-loopback\r\n250 AUTH LOGIN\r\n');
     else if(line==='AUTH LOGIN'){auth=1;socket.write('334 VXNlcm5hbWU6\r\n');}
     else if(line.startsWith('MAIL FROM:'))socket.write('250 okay\r\n');
     else if(line.startsWith('RCPT TO:'))socket.write(state.recipientReject?'550 PRIVATE_SERVER_DETAIL\r\n':'250 okay\r\n');
     else if(line==='DATA'){data=true;socket.write('354 continue\r\n');}
     else if(line==='QUIT')socket.end('221 bye\r\n');
     else socket.write('500 unexpected\r\n');
    }else{
     const [tag,...parts]=line.split(' '),cmd=parts.join(' ');
     if(cmd.startsWith('LOGIN '))socket.write(`${tag} OK authenticated\r\n`);
     else if(cmd==='CAPABILITY')socket.write(`* CAPABILITY IMAP4rev1 ID\r\n${tag} OK\r\n`);
     else if(cmd.startsWith('ID ')){identified=true;socket.write(`${tag} OK\r\n`);}
     else if(cmd==='EXAMINE INBOX')socket.write(state.inboxReject||!identified?`${tag} NO unsafe login PRIVATE_SERVER_DETAIL\r\n`:`* 1 EXISTS\r\n* OK [UIDVALIDITY 9] valid\r\n* OK [UIDNEXT 2] next\r\n${tag} OK\r\n`);
     else if(cmd.startsWith('UID SEARCH '))socket.write(`* SEARCH 1\r\n${tag} OK\r\n`);
     else if(cmd.startsWith('UID FETCH 1 ')){const full=cmd.includes('BODY.PEEK[]'),body=Buffer.from(full?raw:raw.split('\r\n\r\n')[0]+'\r\n\r\n');socket.write(Buffer.concat([Buffer.from(`* 1 FETCH (UID 1 BODY[${full?'':'HEADER'}] {${body.length}}\r\n`),body,Buffer.from(`)\r\n${tag} OK\r\n`)]));}
     else if(cmd==='LOGOUT')socket.end(`* BYE\r\n${tag} OK\r\n`);
     else socket.write(`${tag} BAD unexpected\r\n`);
    }
   }});
  });servers.push(server);server.on('tlsClientError',()=>{});await new Promise(r=>server.listen(0,'127.0.0.1',r));return server.address().port;
 }
 let secret;const credentials={async read(){return secret;},async write(v){secret=v;},availability(){return {mode:'protected',nativeVerified:true};}};
 const lock=await createPersonalizationLock({credentials,scope:'mail-recovery-fixture'}),store=createPrivateStore({dir,lock}),storage=createPrivateFiles({dir,lock});
 const account=createMailAccount({storage,file:path.join(dir,'account.json'),lock,timeoutMs:3000});
 const assistant=createMailAssistant({account,store,confirm:async()=>{state.approvals++;return state.allow;}});
 t.after(async()=>{await assistant.close();lock.release();for(const socket of sockets)socket.destroy();await Promise.all(servers.map(server=>new Promise(r=>server.close(r))));await fs.rm(dir,{recursive:true,force:true});});
 const port=await start('imap'),smtpPort=await start('smtp');
 return {state,assistant,account,store,commands,received,afterBody,connect:()=>assistant.connect({providerId:'custom',user:'synthetic@163.com',password:'SYNTHETIC_AUTHORIZATION_CODE',custom:{host:'127.0.0.1',port,smtpHost:'127.0.0.1',smtpPort,smtpSecurity:'tls'}})};
}
test('163 preset keeps implicit TLS IMAP and SMTP with authorization-code credentials',()=>{
 const config=mailConnectionOptions({providerId:'163',user:'synthetic@163.com',password:'SYNTHETIC_AUTHORIZATION_CODE'});
 assert.deepEqual([config.host,config.port,config.smtpHost,config.smtpPort,config.smtpSecurity],['imap.163.com',993,'smtp.163.com',465,'tls']);
});
test('binding verifies readonly inbox access, not login alone',async t=>{
 const f=await fixture(t);f.state.inboxReject=true;await assert.rejects(f.connect(),{code:'PROTOCOL'});assert.equal((await f.account.status()).connected,false);assert.equal(f.commands.includes('AUTH LOGIN'),false);
});
test('163-style TLS LOGIN and ID support actual inbox reads and explicit approved sends',async t=>{
 const f=await fixture(t);await f.connect();assert.equal((await f.assistant.poll()).fresh[0].id,'9:1');assert.match((await f.assistant.read({id:'9:1'})).body,/noon/);
 assert.equal((await f.assistant.send(outbound)).acceptedBySmtp,true);assert.equal(f.state.approvals,1);assert.equal(f.received.length,1);assert.ok(f.commands.indexOf('ID ID ("name" "Koder" "version" "1")')<f.commands.indexOf('SELECT EXAMINE INBOX'));
});
test('outgoing mail includes the required RFC 5322 origination date',async t=>{
 const f=await fixture(t);await f.connect();f.state.requireDate=true;assert.equal((await f.assistant.send(outbound)).sent,true);assert.equal(f.received.length,1);assert.equal(f.received[0].match(/^Date: /gm)?.length,1);
});
for(const [mode,code]of [['authReject','AUTH_FAILED'],['recipientReject','PROTOCOL'],['dataReject','PROTOCOL']])test(`definite ${mode} permits only a fresh approved retry`,async t=>{
 const f=await fixture(t);await f.connect();f.state[mode]=true;
 await assert.rejects(f.assistant.send(outbound),e=>e.code===code&&!e.message.includes('PRIVATE_SERVER_DETAIL'));
 const failed=Object.values((await f.assistant.status()).deliveries)[0];assert.equal(failed.state,'not_submitted');assert.equal(f.state.approvals,1);
 f.state[mode]=false;f.state.allow=false;await assert.rejects(f.assistant.send(outbound),{code:'MAIL_SEND_CANCELLED'});assert.equal(f.state.approvals,2);assert.equal(f.received.length,mode==='dataReject'?1:0);
 f.state.allow=true;assert.equal((await f.assistant.send(outbound)).sent,true);assert.equal(f.state.approvals,3);assert.equal(f.received.length,mode==='dataReject'?2:1);
 const delivery=Object.values((await f.assistant.status()).deliveries)[0];assert.equal(delivery.attempts[0].state,'not_submitted');assert.equal(delivery.attempts[0].errorCode,code);
});
for(const cancel of [false,true])test(`${cancel?'cancel after DATA':'lost DATA acknowledgement'} stays unknown and cannot replay`,async t=>{
 const f=await fixture(t);await f.connect();f.state[cancel?'holdAck':'dropAck']=true;const controller=new AbortController();
 const sent=f.assistant.send({...outbound,signal:controller.signal});if(cancel){await f.afterBody;controller.abort();}
 await assert.rejects(sent,{code:'DELIVERY_UNCERTAIN'});assert.equal(f.received.length,1);assert.equal(Object.values((await f.assistant.status()).deliveries)[0].state,'uncertain');
 f.state.dropAck=false;f.state.holdAck=false;await assert.rejects(f.assistant.send(outbound),{code:'DELIVERY_UNCERTAIN'});assert.equal(f.received.length,1);assert.equal(f.state.approvals,1);
});
