import {loadRelease} from "../release.mjs";
import {PassThrough} from 'node:stream';
const {createContext} = await loadRelease("src/cli.mjs");
import {pathToFileURL} from 'node:url';
const {createSession}=await loadRelease("src/session.mjs");
import {fixtureEnv} from '../windows-fixtures.mjs';
let session,waiting,call=0;
process.on('message',async message=>{
 try{
 if(message.type==='init'){
  const sink=new PassThrough();sink.resume();
  const provider={model:'synthetic-local',contextWindow:32768,async complete({messages,signal}){const current=++call;process.send({type:'request',call:current,messages});await new Promise((resolve,reject)=>{waiting=resolve;signal?.addEventListener('abort',()=>reject(signal.reason||new Error('cancelled')),{once:true});});return {text:'SYNTHETIC_REPLY_'+current,toolCalls:[]};}};
  const ctx=createContext({command:'chat',argv:[],opts:{...(message.name?{session:message.name}:{}),new:false},positionals:[],io:{providerOverride:provider,env:fixtureEnv(message.home,{NO_COLOR:'1',KODER_AUTO_UPDATE:'0'}),stdin:new PassThrough(),stdout:sink,stderr:sink,cwd:message.workspace,noTerminal:true}});
  session=await createSession(ctx,{workspace:message.workspace});process.send({type:'ready',info:session.memoryInfo()});
 }else if(message.type==='turn'){const result=await session.turn(message.text);process.send({type:'idle',code:result.code,info:session.memoryInfo()});}
 else if(message.type==='allow'){const done=waiting;waiting=null;done?.();}
 else if(message.type==='cancel'){await session.cancel();process.send({type:'cancelled'});}
 else if(message.type==='close'){await session.close();process.send({type:'closed'});process.disconnect();}
 }catch(error){process.send({type:'error',code:error.code||'UNEXPECTED',message:error.message});await session?.close();process.disconnect();}
});
