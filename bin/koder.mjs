#!/usr/bin/env node
import module from 'node:module';
import { spawn } from 'node:child_process';
import { proxyBootstrapEnv } from '../src/network-bootstrap.mjs';

module.enableCompileCache?.();
const proxyEnv=proxyBootstrapEnv();
if(proxyEnv && process.platform !== 'win32' && typeof process.execve === 'function'){
  // Replace in place: preserve the foreground process group and receive one
  // terminal signal, with no forwarding parent to interrupt async cleanup.
  process.execve(process.execPath,[process.execPath,...process.execArgv,...process.argv.slice(1)],proxyEnv);
}else if(proxyEnv && process.platform === 'win32'){
  const child=spawn(process.execPath,[...process.execArgv,...process.argv.slice(1)],{env:proxyEnv,stdio:'inherit'});
  // Windows console Ctrl-C already reaches both processes.
  const handlers=new Map(['SIGTERM','SIGHUP'].map(signal=>[signal,()=>{if(child.exitCode===null && child.signalCode===null)child.kill(signal);} ]));
  for(const [signal,handler] of handlers)process.on(signal,handler);
  process.exitCode=await new Promise(resolve=>{
    child.once('error',()=>resolve(1));
    child.once('exit',(code,signal)=>resolve(code ?? (signal==='SIGINT'?130:signal==='SIGTERM'?143:1)));
  });
  for(const [signal,handler] of handlers)process.off(signal,handler);
}else{
  const { runCli }=await import('../src/cli.mjs');
  process.exitCode=await runCli(process.argv.slice(2));
}
