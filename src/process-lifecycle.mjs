import {spawn} from 'node:child_process';
import {proxyBootstrapEnv} from './network-bootstrap.mjs';

const RESTART=75;
const send=(target,message)=>new Promise((resolve,reject)=>target.send(message,error=>error?reject(error):resolve()));

export async function runWorker(argv) {
  const shutdown=new AbortController(),waiters=new Set();
  const stop=()=>shutdown.abort(new Error('SUPERVISOR_STOP'));
  const receiveStop=message=>{if(message?.type==='koder:stop')stop();};
  // A lost owner is a stop request even when an inherited input pipe remains
  // open. Install this before imports/boot so disconnect cannot be missed.
  process.on('message',receiveStop);process.on('SIGTERM',stop);process.on('SIGHUP',stop);process.on('disconnect',stop);
  if(!process.connected)stop();
  function waitFor(type,timeoutCode){
    return new Promise((resolve,reject)=>{
      const cleanup=()=>{clearTimeout(timer);process.off('message',receive);shutdown.signal.removeEventListener('abort',cancel);waiters.delete(cleanup);};
      const cancel=()=>{cleanup();reject(shutdown.signal.reason);};
      function receive(message){if(message?.type!==type)return;cleanup();resolve(message);}
      const timer=setTimeout(()=>{cleanup();reject(new Error(timeoutCode));},15000);
      waiters.add(cleanup);process.on('message',receive);shutdown.signal.addEventListener('abort',cancel,{once:true});
      if(shutdown.signal.aborted)cancel();
    });
  }
  async function exchange(message,reply,timeoutCode){
    shutdown.signal.throwIfAborted();
    // Attach rejection handlers to both operations immediately; if send fails,
    // finally also removes the abandoned waiter and its 15-second timer.
    const [received]=await Promise.all([waitFor(reply,timeoutCode),send(process,message)]);
    return received;
  }
  try {
    const {runCli,VERSION}=await import('./cli.mjs');
    const {createRestartController}=await import('./update-lifecycle.mjs');
    // Transport availability is not command readiness. The saved conversation
    // remains eligible for fallback until a command admits input or effects.
    const startup=await exchange({type:'koder:hello',protocol:1},'koder:boot','UPDATE_SUPERVISOR_UNAVAILABLE');
    const restart=createRestartController({version:VERSION,blockedVersion:startup.blockedVersion});
    let ready=false,code;
    const onReady=async()=>{shutdown.signal.throwIfAborted();if(ready)return;await send(process,{type:'koder:ready',protocol:1});ready=true;};
    try {code=await runCli(argv,{restart,resume:startup.resume,stopSignal:shutdown.signal,onReady});}finally{restart.close();}
    if(code===0 && restart.pending && !shutdown.signal.aborted){
      restart.captureResume?.(); // All session/maintenance cleanup has finished.
      process.stdin.pause();
      await exchange({type:'koder:restart',protocol:1,target:restart.pending,resume:restart.resume || {argv:['version']}},'koder:accepted','UPDATE_HANDOFF_NOT_ACKNOWLEDGED');
      code=RESTART;
    }
    if(process.connected)process.disconnect();
    return code;
  } finally {
    for(const cleanup of [...waiters])cleanup();
    if(shutdown.signal.aborted)process.stdin.pause();
    process.off('message',receiveStop);process.off('SIGTERM',stop);process.off('SIGHUP',stop);process.off('disconnect',stop);
  }
}

// One supervisor owns successive workers and waits for close before replacing.
export async function supervise(entry,argv,{env=process.env}={}) {
  let current=null,stopping=false,boot={resume:null},fallback=null,stopTimer=null;
  function requestStop(child) {
    if(!child || child.exitCode!==null || child.signalCode!==null || stopTimer)return;
    // Node's Windows child.kill is forceful even for SIGINT/SIGTERM. Ask the
    // owned worker to cancel and release resources over IPC first.
    if(child.connected)void send(child,{type:'koder:stop'}).catch(()=>{});
    stopTimer=setTimeout(()=>{
      if(child.exitCode===null && child.signalCode===null){process.stderr.write('UPDATE_WORKER_STOP_TIMEOUT: 工作进程未按时退出。\n');child.kill('SIGKILL');}
    },5000);
  }
  const handlers=new Map(['SIGINT','SIGTERM','SIGHUP'].map(signal=>[signal,()=>{
    // Console Ctrl-C already reaches the foreground worker on both platforms.
    // Duplicating it would turn cooperative turn cancellation into termination.
    if(signal==='SIGINT')return;
    stopping=true;requestStop(current);
  }]));
  const parentStop=message=>{if(message?.type==='koder:stop'&&message.protocol===1){stopping=true;requestStop(current);}};
  process.on('message',parentStop);
  for(const [signal,handler] of handlers)process.on(signal,handler);
  try {
    for(;;){
      const child=spawn(process.execPath,[...process.execArgv,entry,...argv],{env:{...(proxyBootstrapEnv(env)||env),KODER_CLI_WORKER:'1',KODER_CLI_SUPERVISOR_PID:String(process.pid)},stdio:['inherit','inherit','inherit','ipc']});
      current=child;let replacement=null,hello=false,ready=false,startError=null;
      const startupTimer=setTimeout(()=>{startError=new Error('UPDATE_WORKER_START_TIMEOUT');requestStop(child);},15000);
      child.on('message',message=>{
        if(message?.type==='koder:hello' && message.protocol===1 && !hello){
          hello=true;
          void send(child,{type:'koder:boot',...boot}).catch(error=>{startError=error;requestStop(child);});
        }else if(message?.type==='koder:ready' && message.protocol===1 && hello && !ready){
          ready=true;clearTimeout(startupTimer);
        }else if(message?.type==='koder:restart' && message.protocol===1 && ready && !replacement && typeof message.target?.entry==='string' && Array.isArray(message.resume?.argv)){
          replacement={target:message.target,resume:message.resume};
          void send(child,{type:'koder:accepted'}).catch(error=>{startError=error;});
        }
      });
      child.once('error',error=>{startError=error;});
      const result=await new Promise(resolve=>child.once('close',(code,signal)=>resolve({code,signal})));
      clearTimeout(startupTimer);clearTimeout(stopTimer);stopTimer=null;current=null;
      if(!ready && fallback && !stopping){
        process.stderr.write('UPDATE_RESTART_FAILED: 新版未启动，正在恢复原会话。\n');
        ({entry,argv,boot}=fallback);fallback=null;continue;
      }
      if(startError || !hello){process.stderr.write('UPDATE_WORKER_FAILED: CLI 进程未正常启动，配置和记忆仍保留。\n');return 1;}
      if(result.code!==RESTART || !replacement || stopping)return result.code ?? (result.signal==='SIGINT'?130:result.signal==='SIGTERM'?143:1);
      fallback={entry,argv:replacement.resume.argv,boot:{resume:replacement.resume,blockedVersion:replacement.target.version}};
      entry=replacement.target.entry;argv=replacement.resume.argv;boot={resume:replacement.resume};
    }
  }finally{process.off('message',parentStop);clearTimeout(stopTimer);for(const [signal,handler] of handlers)process.off(signal,handler);}
}
