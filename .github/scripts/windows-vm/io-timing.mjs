// Diagnostic preload. Timings are inclusive; do not sum nested operations.
// No command arguments, file contents, credentials or user text are recorded.
import fs from 'node:fs';
import cp from 'node:child_process';
import path from 'node:path';
import {syncBuiltinESMExports} from 'node:module';
const write=fs.writeFileSync, rows=new Map();
function wrap(object,name) {
  const original=object[name];
  object[name]=function(...args){
    const before=performance.now();
    try{return Reflect.apply(original,this,args);}finally{
      const ms=performance.now()-before;
      const executable=object===cp?path.basename(String(args[0])):'';
      const key=name+':'+executable, row=rows.get(key)||{operation:name,executable,count:0,ms:0,maxMs:0,slowCallers:{}};
      row.count++;row.ms+=ms;row.maxMs=Math.max(row.maxMs,ms);
      if(ms>3){const caller=new Error().stack.split('\n').slice(2,6).join('\n');row.slowCallers[caller]=(row.slowCallers[caller]||0)+ms;}
      rows.set(key,row);
    }
  };
}
for(const name of ['fsyncSync','openSync','readFileSync','writeFileSync','renameSync','mkdirSync','lstatSync','statSync'])wrap(fs,name);
for(const name of ['spawnSync','execFileSync'])wrap(cp,name);
syncBuiltinESMExports();
process.on('exit',()=>{write(path.join(process.env.KODER_VM_EVIDENCE,`io-${process.pid}.json`),JSON.stringify({pid:process.pid,rows:[...rows.values()]},null,2)+'\n');});
