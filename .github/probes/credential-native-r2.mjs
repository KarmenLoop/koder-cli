// Native Windows acceptance: default helper first; legacy compatibility is explicitly warm.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';

const MAX=262144, HELPER_MS=10000, CASE_MS=100000;
const VALUE={marker:'KODER_SYNTHETIC_NATIVE_R2',label:'合成资料 🧪 café é',multiline:'first\nsecond',revision:1};
const NEXT={...VALUE,revision:2};
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
const require=(condition,code)=>{if(!condition)throw Object.assign(new Error(code),{code});};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const flags={};
for(let i=2;i<process.argv.length;i+=2){
 const name=process.argv[i];
 require(['--candidate-root','--manifest','--out','--read-worker','--vault'].includes(name),'UNKNOWN_OPTION');
 require(process.argv[i+1]&&!process.argv[i+1].startsWith('--'),'MISSING_OPTION_VALUE');
 require(!(name.slice(2) in flags),'DUPLICATE_OPTION');flags[name.slice(2)]=process.argv[i+1];
}
require(flags['candidate-root']&&flags.manifest&&flags.out,'REQUIRED_CANDIDATE_ROOT_MANIFEST_OUT');
const root=path.resolve(flags['candidate-root']), manifestFile=path.resolve(flags.manifest), out=path.resolve(flags.out);
const worker=flags['read-worker']==='1';
require(!flags['read-worker']||worker,'INVALID_WORKER_MODE');
require(!fs.existsSync(out),'NEW_OWNED_OUTPUT_DIRECTORY_REQUIRED');fs.mkdirSync(out,{recursive:true});
const receipt={status:'RUNNING',passed:false,nativeWindows:process.platform==='win32',worker,
 caseLimitMs:CASE_MS,productHelperDeadlineMs:HELPER_MS,coldBootClaim:false,
 firstDefaultNativeOperation:false,defaultSelectorFixture:'none',phases:[],processes:[]};
const save=()=>fs.writeFileSync(path.join(out,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');save();
const begun=performance.now(),children=new Set(),closures=[];
let phase='prepare',deadline=false,compatibilityHold=false;
let rejectDeadline;
const deadlinePromise=new Promise((_,reject)=>{rejectDeadline=reject;});
deadlinePromise.catch(()=>{});
const bounded=promise=>Promise.race([promise,deadlinePromise]);
const watchdog=setTimeout(()=>{
 deadline=true;receipt.deadlineExceeded=true;receipt.status='FAIL_CASE_DEADLINE';receipt.passed=false;save();
 for(const child of children)if(child.exitCode===null&&child.signalCode===null)child.kill();
 rejectDeadline(Object.assign(new Error('CASE_DEADLINE'),{code:'CASE_DEADLINE'}));
},CASE_MS);

function observe(kind,file,argv,options){
 const start=performance.now();
 const row={phase,kind,file,argsSha256:sha(JSON.stringify(argv)),environmentKeys:Object.keys(options.env||{}).sort(),
  events:[],stdoutBytes:0,stderrBytes:0,elapsedMs:null,exitCode:null,signal:null};
 receipt.processes.push(row);save();
 const child=spawn(file,argv,options);children.add(child);
 const outputHash=crypto.createHash('sha256'),errorHash=crypto.createHash('sha256');
 let errorText='';
 const event=(event,extra={})=>row.events.push({event,milliseconds:Number((performance.now()-start).toFixed(3)),...extra});
 child.on('spawn',()=>{row.pid=child.pid;event('spawn');save();});
 child.on('error',error=>{row.spawnError=error.code||error.name;event('error',{code:row.spawnError});save();});
 child.stdin?.on('error',error=>event('stdin-error',{code:error.code||error.name}));
 child.stdout.on('data',data=>{row.stdoutBytes+=data.length;outputHash.update(data);event('stdout',{bytes:data.length});});
 child.stderr.on('data',data=>{
  row.stderrBytes+=data.length;errorHash.update(data);event('stderr',{bytes:data.length});
  if(Buffer.byteLength(errorText)<65536)errorText+=data.toString('utf8');
 });
 child.stdout.once('end',()=>{row.stdoutEOF=true;event('stdout-eof');});
 child.stderr.once('end',()=>{row.stderrEOF=true;event('stderr-eof');});
 const closed=new Promise(resolve=>child.once('close',(code,signal)=>{
  row.exitCode=code;row.signal=signal;row.elapsedMs=Number((performance.now()-start).toFixed(3));
  row.stdoutSha256=outputHash.digest('hex');row.stderrSha256=errorHash.digest('hex');
  // Never persist decrypted stdout or arbitrary stderr. Only fixed diagnostic tokens are safe.
  row.safeDiagnostics=[...new Set(errorText.match(/\bMEMORY_CREDENTIALS_[A-Z_]+\b/g)||[])];errorText='';
  event('close',{code,signal});children.delete(child);save();resolve(row);
 }));
 row.closed=false;closed.then(()=>{row.closed=true;});closures.push(closed);
 return {child,row,closed};
}

async function step(name,body){
 phase=name;const record={name,status:'RUNNING',elapsedMs:null};receipt.phases.push(record);save();
 const start=performance.now();
 try{require(!deadline,'CASE_DEADLINE');await bounded(body(record));record.status='PASS';}
 catch(error){record.status='FAIL';record.error=error.code||error.message;throw error;}
 finally{record.elapsedMs=Number((performance.now()-start).toFixed(3));save();}
}

function protectedState(vault){
 const state=vault.availability();
 require(state.mode==='protected'&&state.kind==='dpapi-current-user'&&state.nativeVerified===true,'NOT_NATIVE_VERIFIED_PROTECTED');
 return state;
}

function cipherInfo(file){
 const bytes=fs.readFileSync(file);
 require(bytes.length>0&&bytes.length<=MAX,'CIPHER_SIZE_INVALID');
 require(!bytes.includes(Buffer.from(VALUE.marker))&&!bytes.includes(Buffer.from(VALUE.label)),'PLAINTEXT_ON_DISK');
 return {bytes:bytes.length,sha256:sha(bytes),plaintextAbsent:true};
}

try{
 require(process.platform==='win32','WINDOWS_NATIVE_REQUIRED');
 const manifestBytes=fs.readFileSync(manifestFile),manifest=JSON.parse(manifestBytes.toString('utf8'));
 receipt.manifestSha256=sha(manifestBytes);receipt.component={};
 for(const [kind,name] of [['module','native-credentials.mjs'],['helper','windows-credential-helper.exe']]){
  const item=manifest[kind];
  require(item&&item.file===`fusion/${name}`&&/^[a-f0-9]{64}$/.test(item.sha256),'INVALID_FROZEN_COMPONENT_MANIFEST');
  const file=path.join(root,item.file),stat=fs.lstatSync(file);
  require(stat.isFile()&&!stat.isSymbolicLink(),'COMPONENT_NOT_REGULAR_FILE');
  require(stat.size>0&&stat.size<=MAX,'COMPONENT_SIZE_INVALID');
  require(sha(fs.readFileSync(file))===item.sha256,'FROZEN_COMPONENT_SHA_MISMATCH');
  receipt.component[kind]={file,sha256:item.sha256,bytes:stat.size};
 }
 const moduleFile=receipt.component.module.file,helperFile=receipt.component.helper.file;
 const profile=path.join(out,'profile'),temp=path.join(out,'tmp'),cwd=path.join(out,'working');
 for(const dir of [profile,temp,cwd])fs.mkdirSync(dir);
 process.env.HOME=profile;process.env.USERPROFILE=profile;process.env.TEMP=temp;process.env.TMP=temp;
 delete process.env.NODE_OPTIONS;delete process.env.NODE_PATH;process.chdir(cwd);
 const system=process.env.SystemRoot||process.env.SYSTEMROOT||'C:\\Windows';
 const ps51=path.win32.join(system,'System32/WindowsPowerShell/v1.0/powershell.exe');
 const program=process.env.ProgramFiles||process.env.PROGRAMFILES;
 const ps7=program&&path.win32.isAbsolute(program)?path.win32.join(program,'PowerShell/7/pwsh.exe'):null;
 const equalPath=(a,b)=>path.win32.normalize(a).toLowerCase()===path.win32.normalize(b).toLowerCase();
 const nativeSpawn=(file,argv,options)=>{
  require(equalPath(file,helperFile),'DEFAULT_STARTED_NON_NATIVE_HELPER');
  require(argv.length===1&&['protect','unprotect'].includes(argv[0]),'INVALID_NATIVE_ARGV');
  const result=observe('default-native-helper',file,argv,options);result.row.action=argv[0];return result.child;
 };
 const native=await import(pathToFileURL(moduleFile).href);
 const coldDir=worker?path.resolve(flags.vault||''):path.join(out,'cold-vault');
 if(worker)require(flags.vault&&coldDir===path.join(path.dirname(out),'cold-vault'),'WORKER_REQUIRES_PARENT_OWNED_VAULT');
 else fs.mkdirSync(coldDir);
 const cold=native.openMemoryCredentials({dir:coldDir,namespace:'cold-native-r2',spawnImpl:nativeSpawn});
 const coldFile=path.join(coldDir,'cold-native-r2-credentials.dpapi');
 if(worker){
  await step('independent-default-native-read',async row=>{
   require(same(await cold.read(),VALUE),'INDEPENDENT_READ_MISMATCH');row.availability=protectedState(cold);
   row.cipher=cipherInfo(coldFile);await Promise.all(closures);
   require(receipt.processes.length===1&&receipt.processes[0].action==='unprotect','INDEPENDENT_READ_PROCESS_COUNT');
   const call=receipt.processes[0];require(call.exitCode===0&&call.elapsedMs<=HELPER_MS,'INDEPENDENT_HELPER_DEADLINE_OR_EXIT');
   require(call.stdoutEOF&&call.stderrEOF,'INDEPENDENT_HELPER_EOF_MISSING');
  });
  receipt.firstDefaultNativeOperation=true;
 }else{
  await step('first-default-native-cold-write',async row=>{
   require(receipt.processes.length===0,'COLD_WRITE_PREWARMED');await cold.write(VALUE);
   row.availability=protectedState(cold);row.cipher=cipherInfo(coldFile);await Promise.all(closures);
   require(receipt.processes.length===1&&receipt.processes[0].action==='protect','COLD_WRITE_PROCESS_COUNT');
   const call=receipt.processes[0];require(call.exitCode===0&&call.elapsedMs<=HELPER_MS,'COLD_HELPER_DEADLINE_OR_EXIT');
   require(call.stdoutEOF&&call.stderrEOF,'COLD_HELPER_EOF_MISSING');receipt.firstDefaultNativeOperation=true;
  });
  await step('independent-node-default-native-read',async row=>{
   const readOut=path.join(out,'read-process');
   const observedRead=observe('independent-node',process.execPath,[fileURLToPath(import.meta.url),
    '--candidate-root',root,'--manifest',manifestFile,'--out',readOut,'--read-worker','1','--vault',coldDir],
    {env:process.env,cwd,stdio:['ignore','pipe','pipe'],windowsHide:true});
   const result=await observedRead.closed;
   require(result.exitCode===0&&result.stdoutEOF&&result.stderrEOF,'INDEPENDENT_NODE_READ_FAILED');
   const readReceipt=JSON.parse(fs.readFileSync(path.join(readOut,'receipt.json'),'utf8'));
   require(readReceipt.passed&&readReceipt.firstDefaultNativeOperation,'INDEPENDENT_NATIVE_RECEIPT_FAILED');
   require(readReceipt.manifestSha256===receipt.manifestSha256,'INDEPENDENT_COMPONENT_DRIFT');
   require(readReceipt.processes.length===1&&readReceipt.processes[0].kind==='default-native-helper','INDEPENDENT_READ_USED_COMPATIBILITY');
   row.readProcessExitCode=result.exitCode;row.helperElapsedMs=readReceipt.processes[0].elapsedMs;
   row.cipher=readReceipt.phases[0].cipher;receipt.independentProcessRead=true;
  });

  // All following operations are warm. This fixture selects PS5.1 only here.
  const hidden=[];
  const legacyStat=file=>{
   if(ps7&&equalPath(file,ps7)){hidden.push(file);throw Object.assign(new Error('warm PS5.1 selector fixture'),{code:'ENOENT'});}
   return fs.lstatSync(file);
  };
  const legacySpawn=(file,argv,options)=>{
   require(equalPath(file,ps51),'WARM_LEGACY_DID_NOT_SELECT_SYSTEM_PS51');
   return observe('warm-legacy-ps51-helper',file,argv,options).child;
  };
  const compatDir=path.join(out,'compatibility-vault');fs.mkdirSync(compatDir);
  const compatibleNative=native.openMemoryCredentials({dir:compatDir,namespace:'compat-r2',spawnImpl:nativeSpawn});
  const legacy=native.openMemoryCredentials({dir:compatDir,namespace:'compat-r2',windowsBackend:'powershell',statImpl:legacyStat,spawnImpl:legacySpawn});
  receipt.warmCompatibility={status:'PREPARING',selectorFixture:'Only fixed PS7 candidate reports ENOENT; explicit powershell backend invokes real system PS5.1',hiddenCandidates:hidden,coldClaim:false};
  try{
   await step('explicit-ps51-readiness-warm-up',async row=>{
    row.limitMs=30000;row.productHelperPerformanceClaim=false;
    const env=Object.fromEntries(['PATH','HOME','USERPROFILE','SystemRoot','SYSTEMROOT','WINDIR','ProgramFiles','PROGRAMFILES','DBUS_SESSION_BUS_ADDRESS','XDG_RUNTIME_DIR']
     .filter(key=>typeof process.env[key]==='string').map(key=>[key,process.env[key]]));
    env.PSModulePath=[path.win32.join(system,'System32/WindowsPowerShell/v1.0/Modules'),program&&path.win32.join(program,'WindowsPowerShell/Modules')].filter(Boolean).join(';');
    const script="$ErrorActionPreference='Stop'; [Console]::Out.WriteLine('KODER_PS51_ENTERED'); Add-Type -AssemblyName System.Security; [Console]::Out.WriteLine('KODER_PS51_READY')";
    const warm=observe('ps51-readiness-warm-up',ps51,['-NoLogo','-NoProfile','-NonInteractive','-Command',script],{env,cwd,stdio:['ignore','pipe','pipe'],windowsHide:true});
    let text='',timedOut=false;
    warm.child.stdout.on('data',data=>{
     if(text.length<4096)text+=data.toString('utf8');
     if(row.firstStdoutLineMs===undefined&&text.includes('\n')){
      row.firstStdoutLineMs=warm.row.events.filter(event=>event.event==='stdout').at(-1).milliseconds;
      row.firstLineIsExpected=text.split(/\r?\n/)[0]==='KODER_PS51_ENTERED';
     }
    });
    let timeout;
    const timeoutPromise=new Promise((_,reject)=>{timeout=reject;});
    const timer=setTimeout(()=>{timedOut=true;warm.child.kill();timeout(Object.assign(new Error('PS51_READINESS_TIMEOUT'),{code:'PS51_READINESS_TIMEOUT'}));},30000);
    try{
     const result=await Promise.race([warm.closed,timeoutPromise]);row.exitCode=result.exitCode;row.timedOut=timedOut;
     require(!timedOut&&result.elapsedMs<=30000,'PS51_READINESS_TIMEOUT');
     require(result.exitCode===0&&result.stdoutEOF&&result.stderrEOF,'PS51_READINESS_FAILED');
     require(row.firstLineIsExpected&&text.trim()==='KODER_PS51_ENTERED\r\nKODER_PS51_READY','PS51_READINESS_MARKER_MISSING');
    }finally{row.timedOut=timedOut;clearTimeout(timer);}
   });
  }catch(error){
   compatibilityHold=true;receipt.warmCompatibility.status='NOT_RUN_HOLD';
   receipt.warmCompatibility.reason=error.code||error.message;
   receipt.warmCompatibility.formatFailureClaim=false;
  }
  if(!compatibilityHold){
   await step('warm-ps51-write-native-read',async row=>{
    await legacy.write(VALUE);row.legacyAvailability=protectedState(legacy);
    require(same(await compatibleNative.read(),VALUE),'PS51_TO_NATIVE_MISMATCH');row.nativeAvailability=protectedState(compatibleNative);
    row.cipher=cipherInfo(path.join(compatDir,'compat-r2-credentials.dpapi'));
   });
   await step('warm-native-write-ps51-read',async row=>{
    await compatibleNative.write(NEXT);row.nativeAvailability=protectedState(compatibleNative);
    require(same(await legacy.read(),NEXT),'NATIVE_TO_PS51_MISMATCH');row.legacyAvailability=protectedState(legacy);
    row.cipher=cipherInfo(path.join(compatDir,'compat-r2-credentials.dpapi'));
   });
   receipt.warmCompatibility.status='PASS';
  }

  async function invoke(name,action,input,expectedCode){
   const direct=observe('warm-direct-protocol',helperFile,[action],{env:process.env,cwd,stdio:['pipe','pipe','pipe'],windowsHide:true});
   direct.row.protocolCase=name;direct.row.expectedExitCode=expectedCode;
   let bytes=0;const chunks=[];
   direct.child.stdout.on('data',data=>{bytes+=data.length;if(bytes<=MAX)chunks.push(Buffer.from(data));else direct.child.kill();});
   let timedOut=false,timeout;
   const timeoutPromise=new Promise((_,reject)=>{timeout=reject;});
   const timer=setTimeout(()=>{timedOut=true;direct.row.timedOut=true;direct.child.kill();timeout(Object.assign(new Error('PROTOCOL_HELPER_DEADLINE'),{code:'PROTOCOL_HELPER_DEADLINE'}));},HELPER_MS);
   direct.child.stdin.end(input);
   try{
    const row=await Promise.race([direct.closed,timeoutPromise]);
    require(!timedOut&&row.elapsedMs<=HELPER_MS,'PROTOCOL_HELPER_DEADLINE');
    require(row.exitCode===expectedCode&&row.stdoutEOF&&row.stderrEOF,'PROTOCOL_EXIT_OR_EOF_MISMATCH');
    require(bytes<=MAX,'PROTOCOL_OUTPUT_OVERFLOW');
    if(expectedCode!==0){require(bytes===0,'INVALID_INPUT_PRODUCED_OUTPUT');require(row.safeDiagnostics.length===1,'INVALID_INPUT_DIAGNOSTIC_MISSING');}
    return Buffer.concat(chunks,bytes);
   }finally{clearTimeout(timer);for(const chunk of chunks)chunk.fill(0);}
  }

  await step('warm-unicode-protocol-roundtrip',async row=>{
   const value=Buffer.from(JSON.stringify(VALUE)),encrypted=await invoke('unicode-protect','protect',Buffer.concat([value,Buffer.from('\n')]),0);
   require(!encrypted.includes(Buffer.from(VALUE.marker)),'PROTOCOL_CIPHER_PLAINTEXT');
   const opened=await invoke('unicode-unprotect','unprotect',Buffer.concat([encrypted,Buffer.from('\n')]),0);
   require(opened.equals(value),'UNICODE_PROTOCOL_MISMATCH');row.inputBytes=value.length;row.roundtrip=true;
   value.fill(0);opened.fill(0);encrypted.fill(0);
  });
  await step('warm-invalid-cipher-read-preserves-file',async row=>{
   const dir=path.join(out,'invalid-vault');fs.mkdirSync(dir);
   const file=path.join(dir,'invalid-r2-credentials.dpapi');fs.writeFileSync(file,'U1lOVEhFVElD');
   const before=sha(fs.readFileSync(file)),vault=native.openMemoryCredentials({dir,namespace:'invalid-r2',spawnImpl:nativeSpawn});
   let rejected=false;try{await vault.read();}catch(error){require(error.code==='MEMORY_CREDENTIALS_UNAVAILABLE','WRONG_INVALID_CIPHER_ERROR');rejected=true;}
   require(rejected,'INVALID_CIPHER_ACCEPTED');require(sha(fs.readFileSync(file))===before,'INVALID_CIPHER_OVERWRITTEN');
   require(vault.availability().mode==='protected'&&vault.availability().nativeVerified===false,'INVALID_CIPHER_BECAME_FALLBACK');
   row.rejected=true;row.fileUnchanged=true;row.sha256=before;
  });
  await step('warm-invalid-json-read-preserves-file',async row=>{
   const cipher=await invoke('non-object-json-protect','protect',Buffer.from('[]\n'),0);
   const dir=path.join(out,'invalid-json-vault');fs.mkdirSync(dir);
   const file=path.join(dir,'invalid-json-r2-credentials.dpapi');fs.writeFileSync(file,cipher);cipher.fill(0);
   const before=sha(fs.readFileSync(file)),vault=native.openMemoryCredentials({dir,namespace:'invalid-json-r2',spawnImpl:nativeSpawn});
   let rejected=false;try{await vault.read();}catch(error){require(error.code==='MEMORY_CREDENTIALS_UNAVAILABLE','WRONG_INVALID_JSON_ERROR');rejected=true;}
   require(rejected&&sha(fs.readFileSync(file))===before,'INVALID_JSON_ACCEPTED_OR_OVERWRITTEN');
   require(vault.availability().nativeVerified===false,'INVALID_JSON_VERIFIED');row.rejected=true;row.fileUnchanged=true;
  });
  await step('warm-oversized-write-preserves-existing-cipher',async row=>{
   const before=sha(fs.readFileSync(coldFile)),calls=receipt.processes.length;
   let rejected=false;try{await cold.write({payload:'x'.repeat(MAX)});}catch(error){require(error.code==='MEMORY_CREDENTIALS_INVALID','WRONG_OVERSIZE_ERROR');rejected=true;}
   require(rejected&&receipt.processes.length===calls,'OVERSIZED_WRITE_STARTED_HELPER');
   require(sha(fs.readFileSync(coldFile))===before,'OVERSIZED_WRITE_REPLACED_CIPHER');row.rejectedBeforeSpawn=true;row.fileUnchanged=true;
  });
  await step('warm-malformed-input-and-bounds',async row=>{
   const cases=[
    ['empty','protect',Buffer.from('\n'),2],
    ['missing-lf','protect',Buffer.from('no-terminal-newline'),2],
    ['multi-frame','protect',Buffer.from('one\ntwo\n'),2],
    ['crlf','protect',Buffer.from('one\r\n'),2],
    ['invalid-utf8','protect',Buffer.from([0xff,10]),2],
    ['oversized-frame','protect',Buffer.concat([Buffer.alloc(MAX+1,65),Buffer.from('\n')]),2],
    ['max-input-exceeds-cipher-output-bound','protect',Buffer.concat([Buffer.alloc(MAX,65),Buffer.from('\n')]),2],
    ['invalid-base64','unprotect',Buffer.from('not-base64\n'),2],
    ['spaced-base64','unprotect',Buffer.from('Y Q==\n'),2],
    ['noncanonical-base64','unprotect',Buffer.from('YR==\n'),2],
    ['invalid-dpapi','unprotect',Buffer.from('U1lOVEhFVElD\n'),3],
    ['invalid-action','unknown',Buffer.from('input\n'),2],
   ];
   for(const [name,action,input,code] of cases){const output=await invoke(name,action,input,code);output.fill(0);input.fill(0);}
   const large=Buffer.alloc(65536,65),cipher=await invoke('bounded-large-protect','protect',Buffer.concat([large,Buffer.from('\n')]),0);
   const opened=await invoke('bounded-large-unprotect','unprotect',Buffer.concat([cipher,Buffer.from('\n')]),0);
   require(opened.equals(large),'BOUNDED_LARGE_ROUNDTRIP_MISMATCH');large.fill(0);cipher.fill(0);opened.fill(0);
   row.invalidCases=cases.length;row.positiveBytes=65536;
  });
 }
 await bounded(Promise.all(closures));
 require(!deadline&&performance.now()-begun<CASE_MS,'CASE_DEADLINE');
 require(receipt.processes.every(row=>row.closed&&row.stdoutEOF&&row.stderrEOF&&!row.spawnError),'PROCESS_CLOSE_EVIDENCE_MISSING');
 require(receipt.processes.filter(row=>row.kind.includes('helper')).every(row=>row.elapsedMs<=HELPER_MS),'HELPER_DEADLINE_EXCEEDED');
 require(receipt.component.module.sha256===sha(fs.readFileSync(receipt.component.module.file))&&receipt.component.helper.sha256===sha(fs.readFileSync(receipt.component.helper.file)),'COMPONENT_CHANGED_DURING_PROBE');
 require(!compatibilityHold,'WARM_COMPATIBILITY_NOT_RUN_HOLD');
 receipt.passed=true;receipt.status=worker?'PASS_INDEPENDENT_DEFAULT_NATIVE_READ':'PASS_DEFAULT_NATIVE_FIRST_AND_WARM_COMPATIBILITY';
}catch(error){
 receipt.passed=false;receipt.status='FAIL';receipt.error=error.code||error.message||error.name;save();
}finally{
 clearTimeout(watchdog);
 for(const child of children)if(child.exitCode===null&&child.signalCode===null)child.kill();
 let cleanupTimer;
 const closed=await Promise.race([Promise.all(closures).then(()=>true),new Promise(resolve=>{cleanupTimer=setTimeout(()=>resolve(false),2000);})]);
 clearTimeout(cleanupTimer);
 if(!closed||children.size){
  receipt.passed=false;receipt.status='FAIL_CLEANUP';receipt.cleanupIncomplete=true;
  for(const child of children){
   child.stdin?.destroy();child.stdout.destroy();child.stderr.destroy();child.unref();
  }
 }
 receipt.elapsedMs=Number((performance.now()-begun).toFixed(3));save();
 console.log(JSON.stringify({passed:receipt.passed,status:receipt.status,receipt:path.join(out,'receipt.json')}));
 process.exitCode=receipt.passed?0:1;
}
