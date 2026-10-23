import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {cliHome,memoryHome} from './config.mjs';

const activeSessions=new Map();
// One nonce per actual Node process, including modules loaded after an update.
// PID equality alone is not identity after the OS has recycled a process ID.
const instanceKey=Symbol.for('koder.memory.process-instance');
const processInstance=globalThis[instanceKey]||(globalThis[instanceKey]=crypto.randomUUID());
const MAX_BYTES=64*1024*1024;
const fail=(code,message)=>Object.assign(new Error(message),{code});
const busy=()=>fail('MEMORY_BUSY','MEMORY_BUSY: 此会话暂时无法独占，可能仍有任务运行或尚未释放。请用 --session <新名称> 启动独立任务；原会话与历史已保留。');
const corrupt=()=>fail('MEMORY_INVALID','会话记忆无法安全读取，已保留原文件。请检查 koder memory show 或使用独立 --session。');
const hash=value=>crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const uuid=value=>typeof value==='string'&&/^[0-9a-f-]{36}$/i.test(value);
export function sessionName(value='default') {
  if(typeof value!=='string'||!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$/.test(value))throw fail('MEMORY_NAME','会话名应为 1–64 位字母、数字、点、下划线或短横线。');
  return value;
}
function readJson(file,limit=MAX_BYTES) {
  let fd;
  try {
    fd=fs.openSync(file,fs.constants.O_RDONLY|(fs.constants.O_NOFOLLOW||0)|(fs.constants.O_NONBLOCK||0));
    const info=fs.fstatSync(fd);
    if(!info.isFile()||info.size>limit)throw corrupt();
    return JSON.parse(fs.readFileSync(fd,'utf8'));
  } catch(error){if(error.code==='ENOENT')return null;throw corrupt();}
  finally{if(fd!==undefined)fs.closeSync(fd);}
}
function directory(folder) {
  fs.mkdirSync(folder,{mode:0o700});
}
function ensureDirectory(folder) {
  try{directory(folder);}catch(error){if(error.code!=='EEXIST')throw error;}
  const info=fs.lstatSync(folder);
  if(!info.isDirectory()||info.isSymbolicLink())throw corrupt();
  fs.chmodSync(folder,0o700);
}
export function redactMemory(value,secrets=[]) {
  const clean=text=>{
    let result=text;
    for(const secret of secrets)if(typeof secret==='string'&&secret.length>=4)result=result.split(secret).join('[redacted]');
    return result.replace(/\b(?:sk-|ghp_|xox[baprs]-)[A-Za-z0-9_-]{12,}\b/g,'[redacted]')
      .replace(/(\bauthorization\s*:\s*)[^\r\n]+/gi,'$1[redacted]')
      .replace(/(["'](?:api[_ -]?key|password|authorization|access[_ -]?token|refresh[_ -]?token)["']\s*:\s*)(["'])(?:\\.|(?!\2)[^\r\n])*?\2/gi,'$1"[redacted]"')
      .replace(/(\b(?:api[_ -]?key|password|authorization|access[_ -]?token|refresh[_ -]?token)\s*[=:]\s*)[^\s,;]+/gi,'$1[redacted]');
  };
  if(typeof value==='string')return clean(value);
  if(Array.isArray(value))return value.map(item=>redactMemory(item,secrets));
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,/^(?:api[_-]?key|password|authorization|access[_-]?token|refresh[_-]?token)$/i.test(key)?'[redacted]':redactMemory(item,secrets)]));
  return value;
}
function messagesOf(messages,secrets) {
  return messages.filter(m=>['user','assistant','tool','notice'].includes(m.role)).map(m=>redactMemory({
    id:uuid(m.id)?m.id:crypto.randomUUID(),role:m.role,content:typeof m.content==='string'?m.content:'',at:Number(m.at)||Date.now(),
    ...(typeof m.display==='string'?{display:m.display}:{}),
    ...(Array.isArray(m.toolCalls)?{toolCalls:m.toolCalls.map(call=>({id:String(call.id),name:String(call.name),arguments:call.arguments||{}}))}:{}),
    ...(typeof m.toolCallId==='string'?{toolCallId:m.toolCallId}:{}),
    ...(typeof m.name==='string'?{name:m.name}:{}),
    ...(m.isError?{isError:true}:{}),
    ...(m.receipt?{receipt:m.receipt}:{}),
  },secrets));
}
export function createMemory({workspace,env=process.env,scope=['terminal'],name='default',secrets=[]}={}) {
  const identity={workspace:fs.realpathSync(workspace),scope,name:sessionName(name)};
  const key=hash(identity);
  const home=memoryHome(env),folder=path.join(home,'memory'),sessions=path.join(folder,'sessions');
  fs.mkdirSync(home,{recursive:true,mode:0o700});ensureDirectory(folder);ensureDirectory(sessions);
  const file=path.join(sessions,key+'.json'),lockFile=path.join(sessions,key+'.lock');
  let lease=null,revision=0;
  const blank=()=>({version:1,key,identity:{digest:key},revision:0,conversation:null,notes:[],interrupted:false});
  function read() {
    const data=readJson(file)||blank();
    const messageValid=m=>m&&['user','assistant','tool','notice'].includes(m.role)&&typeof m.content==='string'&&
      (m.toolCalls===undefined||(Array.isArray(m.toolCalls)&&m.toolCalls.length<=100&&m.toolCalls.every(call=>call&&typeof call.id==='string'&&typeof call.name==='string'&&call.arguments&&typeof call.arguments==='object'&&!Array.isArray(call.arguments))));
    if(data.version!==1||data.key!==key||data.identity?.digest!==key||!Number.isSafeInteger(data.revision)||data.revision<0||!Array.isArray(data.notes)||data.notes.length>32||data.notes.some(n=>!n||typeof n.id!=='string'||typeof n.text!=='string'||n.text.length>4096)||
      (data.sharedMemory!==undefined&&(!data.sharedMemory||typeof data.sharedMemory.spaceId!=='string'||!Number.isSafeInteger(data.sharedMemory.memoryEpoch)||data.sharedMemory.memoryEpoch<1))||
      (data.conversation&&(!uuid(data.conversation.id)||!Array.isArray(data.conversation.messages)||data.conversation.messages.some(m=>!messageValid(m)))))throw corrupt();
    revision=data.revision;
    return data;
  }
  function verifyLease(){
    if(!lease)throw busy();
    const info=fs.lstatSync(lockFile),data=readJson(lockFile,2048);
    if(info.ino!==lease.ino||data?.token!==lease.token||data.pid!==process.pid)throw busy();
  }
  function alive(owner) {
    if(owner.pid===process.pid&&owner.instance&&owner.instance!==processInstance)return false;
    try { process.kill(owner.pid,0); return true; }
    catch(error) { return error.code !== 'ESRCH'; }
  }
  function ownerAt(target) {
    try {
      const info=fs.lstatSync(target),owner=readJson(target,2048);
      if(owner===null)throw busy();
      if(!info.isFile()||info.isSymbolicLink()||!Number.isSafeInteger(owner.pid)||owner.pid<=0||!uuid(owner.token)||(owner.instance!==undefined&&!uuid(owner.instance)))throw corrupt();
      return {info,owner};
    }catch(error){if(error.code==='ENOENT')throw busy();throw error;}
  }
  // Link a complete owner record atomically: other processes never see an
  // empty/partially-written lock. Both paths are on the same local filesystem.
  function claim(target) {
    const token=crypto.randomUUID(),temp=path.join(sessions,`${key}.${token}.claim`);
    let fd;
    try {
      fd=fs.openSync(temp,'wx',0o600);fs.writeFileSync(fd,JSON.stringify({pid:process.pid,instance:processInstance,token}));fs.fsyncSync(fd);
      const ino=fs.fstatSync(fd).ino;fs.closeSync(fd);fd=undefined;
      fs.linkSync(temp,target);return {ino,token};
    } finally {if(fd!==undefined)fs.closeSync(fd);fs.rmSync(temp,{force:true});}
  }
  function claimReaper(token,depth=0) {
    if(depth>=16)throw busy();
    const target=path.join(sessions,`${key}.reap-${token}`);
    try { claim(target); }
    catch(error) {
      if(error.code!=='EEXIST')throw error;
      const {owner}=ownerAt(target);
      if(alive(owner))throw busy();
      claimReaper(owner.token,depth+1);
    }
    // Reaper claims are immutable and are never removed. Only one live process
    // can reclaim each dead lock generation. A dead reaper gets one exclusive
    // successor, so two stale readers cannot unlink a newer owner's lock.
  }
  function acquireOwned(target) {
    for(let attempt=0;attempt<2;attempt++){
      try {return claim(target);}
      catch(error) {
        if(error.code!=='EEXIST')throw error;
        const {info,owner}=ownerAt(target);
        if(alive(owner))throw busy();
        claimReaper(owner.token);
        const fresh=ownerAt(target);
        if(fresh.info.ino!==info.ino||fresh.owner.token!==owner.token)throw busy();
        fs.unlinkSync(target);
      }
    }
    throw busy();
  }
  function acquire(){if(lease)throw busy();lease=acquireOwned(lockFile);}
  function acquireSession(){
    const target=path.join(sessions,key+'.active');
    let state=activeSessions.get(target);
    if(state){const current=ownerAt(target);if(current.info.ino!==state.ino||current.owner.token!==state.token||current.owner.pid!==process.pid)throw busy();state.refs++;}
    else{
      state={...acquireOwned(target),refs:1};
      // Older runtimes only hold the turn lock. Detect that owner before any
      // history is read, so a new default window can choose its own session.
      try{if(!lease){acquire();release();}}
      catch(error){
        const current=ownerAt(target);
        if(current.info.ino===state.ino&&current.owner.token===state.token&&current.owner.pid===process.pid)fs.unlinkSync(target);
        throw error;
      }
      activeSessions.set(target,state);
    }
    let released=false;
    return ()=>{
      if(released)return;released=true;
      if(--state.refs>0)return;
      activeSessions.delete(target);
      const current=ownerAt(target);
      if(current.info.ino!==state.ino||current.owner.token!==state.token||current.owner.pid!==process.pid)throw busy();
      fs.unlinkSync(target);
    };
  }
  function release(){if(!lease)return;try{verifyLease();fs.unlinkSync(lockFile);}finally{lease=null;}}
  function write(data) {
    verifyLease();
    const current=readJson(file);
    if((current?.revision||0)!==revision)throw fail('MEMORY_CONFLICT','会话记忆已更新，请重新继续，未覆盖其它任务。');
    const next={version:1,key,identity:{digest:key},revision:revision+1,updatedAt:Date.now(),...redactMemory({conversation:data.conversation,notes:data.notes},secrets),interrupted:Boolean(data.interrupted),...(data.sharedMemory?{sharedMemory:{spaceId:data.sharedMemory.spaceId,memoryEpoch:data.sharedMemory.memoryEpoch}}:{})};
    const bytes=JSON.stringify(next);
    if(Buffer.byteLength(bytes)>MAX_BYTES)throw fail('MEMORY_FULL','此会话历史超过 64 MiB，请保留历史并使用 --session <新名称> 继续。');
    const temp=path.join(sessions,`${key}.${crypto.randomUUID()}.tmp`);
    let fd;
    try{
      fd=fs.openSync(temp,'wx',0o600);fs.writeFileSync(fd,bytes+'\n');fs.fsyncSync(fd);fs.closeSync(fd);fd=undefined;
      verifyLease();fs.renameSync(temp,file);
      if(process.platform!=='win32'){const dir=fs.openSync(sessions,'r');try{fs.fsyncSync(dir);}finally{fs.closeSync(dir);}}
      revision=next.revision;return next;
    }finally{if(fd!==undefined)fs.closeSync(fd);fs.rmSync(temp,{force:true});}
  }
  function checkpoint(thread,data) {
    return write({...data,interrupted:thread.status==='running'||String(thread.status).startsWith('waiting_'),conversation:{id:thread.id,title:thread.title,createdAt:thread.createdAt,messages:messagesOf(thread.messages,secrets),modelRecovery:thread.modelRecovery||null,effectPending:thread.effectPending||null,...(thread.deliveryEffects?{deliveryEffects:structuredClone(thread.deliveryEffects),seq:thread.seq||0}:{}),...(thread.appEffects?{appEffects:structuredClone(thread.appEffects)}:{})}});
  }
  function transact(fn){acquire();try{return fn(read());}finally{release();}}
  return {key,file,identity,read,acquire,acquireSession,release,write,checkpoint,transact,
    forget(data){
      const next=write({...data,conversation:null,notes:[],interrupted:false});
      const archive=path.join(folder,'archive');
      if(fs.existsSync(archive)){
        const info=fs.lstatSync(archive);if(!info.isDirectory()||info.isSymbolicLink())throw corrupt();
        for(const name of fs.readdirSync(archive))if(name.startsWith(key+'-')&&name.endsWith('.json'))fs.unlinkSync(path.join(archive,name));
      }
      for(const name of fs.readdirSync(sessions))if(name.startsWith(key+'.')&&name.endsWith('.tmp'))fs.unlinkSync(path.join(sessions,name));
      return next;
    },
    reset(data){
      if(data.conversation?.messages.length){
        const archive=path.join(folder,'archive');ensureDirectory(archive);
        const target=path.join(archive,`${key}-${data.conversation.id}-${data.revision}.json`);
        let fd;
        try { fd=fs.openSync(target,'wx',0o600);fs.writeFileSync(fd,JSON.stringify(data)+'\n');fs.fsyncSync(fd); }
        catch(error){if(error.code!=='EEXIST'||JSON.stringify(readJson(target))!==JSON.stringify(data))throw error;}
        finally{if(fd!==undefined)fs.closeSync(fd);} 
      }
      return write({...data,conversation:null,interrupted:false});
    },
  };
}

// A live CLI window reserves its history before reading it. Default contention
// starts a new named conversation; an explicit name always keeps its identity.
export function reserveSessionMemory(options,{forkDefault=false}={}) {
 let memory=createMemory(options);
 try{return {memory,release:memory.acquireSession(),forked:false};}
 catch(error){
  if(error.code!=='MEMORY_BUSY'||!forkDefault||memory.identity.name!=='default')throw error;
  memory=createMemory({...options,name:'window-'+crypto.randomUUID()});
  return {memory,release:memory.acquireSession(),forked:true};
 }
}
