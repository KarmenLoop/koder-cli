// Published-helper acceptance. The selector fixture never replaces the native child or DPAPI.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';

const EXPECTED_HELPER='490b3a1f967b6a5b42d8461d2941f82f3eaf8208f0e500a22b4a41688e440de0';
const CASE_MS=100000;
const VALUE={marker:'KODER_SYNTHETIC_COLD_040',label:'合成资料'};
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const args={};
for(let i=2;i<process.argv.length;i+=2){
 const flag=process.argv[i];assert.ok(['--package-root','--out','--mode','--read-worker','--vault'].includes(flag),`Unknown option: ${flag}`);
 assert.ok(process.argv[i+1]&&!process.argv[i+1].startsWith('--'),`Missing ${flag}`);args[flag.slice(2)]=process.argv[i+1];
}
assert.ok(args.out&&args['package-root'],'Required: --package-root <unpacked koder-cli> --out <new directory> [--mode ps51|default]');
const mode=args.mode||'ps51';assert.ok(['ps51','default'].includes(mode));
const worker=args['read-worker']==='1',out=path.resolve(args.out),root=path.resolve(args['package-root']);
assert.ok(!fs.existsSync(out),'NEW_OWNED_OUTPUT_DIRECTORY_REQUIRED');fs.mkdirSync(out,{recursive:true});
const receipt={status:'RUNNING',passed:false,mode,worker,nativeWindows:process.platform==='win32',coldBootClaim:false,
 caseLimitMs:CASE_MS,productHelperDeadlineMs:10000,selectorFixture:mode==='ps51'?'Only fixed PS7 candidate reports ENOENT; real native PS5.1 execution':'none',helperCalls:[]};
const save=()=>fs.writeFileSync(path.join(out,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');save();
const children=new Set(),closures=[];
const started=performance.now();
const redact=s=>String(s).replaceAll(VALUE.marker,'[synthetic marker omitted]').replaceAll(VALUE.label,'[synthetic label omitted]');
const watchdog=setTimeout(()=>{
 receipt.status='FAIL_CASE_DEADLINE';receipt.passed=false;receipt.error='100-second case deadline exceeded';save();
 for(const child of children)if(child.exitCode===null&&child.signalCode===null)child.kill();
},CASE_MS);

try{
 assert.equal(process.platform,'win32','WINDOWS_NATIVE_REQUIRED');
 const moduleFile=path.join(root,'kernel/fusion/native-credentials.mjs');
 receipt.helperSha256=sha(fs.readFileSync(moduleFile));assert.equal(receipt.helperSha256,EXPECTED_HELPER,'PUBLISHED_HELPER_SHA_MISMATCH');
 const profile=path.join(out,'profile');fs.mkdirSync(profile);fs.mkdirSync(path.join(out,'tmp'));
 process.env.HOME=profile;process.env.USERPROFILE=profile;process.env.TEMP=path.join(out,'tmp');process.env.TMP=path.join(out,'tmp');
 const system=process.env.SystemRoot||process.env.SYSTEMROOT||'C:\\Windows';
 const program=process.env.ProgramFiles||process.env.PROGRAMFILES;
 const ps7=program&&path.win32.isAbsolute(program)?path.win32.join(program,'PowerShell/7/pwsh.exe'):null;
 const ps51=path.win32.join(system,'System32/WindowsPowerShell/v1.0/powershell.exe');
 const hidden=[];
 const statImpl=file=>{
  if(mode==='ps51'&&ps7&&path.win32.normalize(file).toLowerCase()===path.win32.normalize(ps7).toLowerCase()){
   hidden.push(file);throw Object.assign(new Error('PS7 selector fixture: absent'),{code:'ENOENT'});
  }
  return fs.lstatSync(file);
 };
 const observedSpawn=(file,argv,options)=>{
  if(mode==='ps51')assert.equal(path.win32.normalize(file).toLowerCase(),path.win32.normalize(ps51).toLowerCase());
  const begin=performance.now();
  const row={file,argsSha256:sha(JSON.stringify(argv)),environmentKeys:Object.keys(options.env).sort(),events:[],stdoutBytes:0,stderrBytes:0};
  const scriptAt=argv.indexOf('-EncodedCommand');
  row.scriptSha256=sha(Buffer.from(argv[scriptAt+1],'base64'));
  receipt.helperCalls.push(row);save();
  const child=spawn(file,argv,options);children.add(child);
  const stdoutHash=crypto.createHash('sha256'),stderrHash=crypto.createHash('sha256');
  const stderrFile=path.join(out,`helper-${receipt.helperCalls.length}.stderr.raw`);
  fs.writeFileSync(stderrFile,'',{flag:'wx'});
  const event=(event,extra={})=>row.events.push({event,milliseconds:Math.round(performance.now()-begin),...extra});
  child.on('spawn',()=>{row.pid=child.pid;event('spawn');save();});
  child.on('error',error=>{row.spawnError=error.code||error.name;event('error',{code:row.spawnError});save();});
  child.stdout.on('data',data=>{row.stdoutBytes+=data.length;stdoutHash.update(data);event('stdout',{bytes:data.length});});
  child.stderr.on('data',data=>{
   row.stderrBytes+=data.length;stderrHash.update(data);event('stderr',{bytes:data.length});
   if(row.stderrBytes<=65536)fs.appendFileSync(stderrFile,redact(data.toString('utf8')));
  });
  closures.push(new Promise(resolve=>child.once('close',(code,signal)=>{
   row.exitCode=code;row.signal=signal;row.elapsedMs=Math.round(performance.now()-begin);
   row.stdoutSha256=stdoutHash.digest('hex');row.stderrSha256=stderrHash.digest('hex');
   // Never persist unprotected stdout. Counts/digests establish native transport observations.
   event('close',{code,signal});children.delete(child);save();resolve();
  })));
  return child;
 };
 const native=await import(pathToFileURL(moduleFile).href);
 receipt.defaultShell=native.windowsCredentialShell(process.env);
 receipt.selectedShell=native.windowsCredentialShell(process.env,statImpl);
 receipt.ps7PhysicallyPresent=ps7?fs.existsSync(ps7):false;
 receipt.hiddenCandidates=hidden;
 const vaultDir=worker?path.resolve(args.vault||''):path.join(out,'vault');
 if(worker)assert.ok(args.vault,'READ_WORKER_REQUIRES_OWNED_VAULT');
 else fs.mkdirSync(vaultDir);
 const vault=native.openMemoryCredentials({dir:vaultDir,namespace:'cold-040',spawnImpl:observedSpawn,statImpl});
 if(worker){
  const read=await vault.read();assert.deepEqual(read,VALUE,'INDEPENDENT_PROCESS_DECRYPT_MISMATCH');
 }else{
  await vault.write(VALUE);
 }
 receipt.availability=vault.availability();save();
 assert.equal(receipt.availability.mode,'protected','NATIVE_WRITE_FELL_BACK_TO_PROCESS_ONLY');
 assert.equal(receipt.availability.kind,'dpapi-current-user');assert.equal(receipt.availability.nativeVerified,true);
 const cipher=path.join(vaultDir,'cold-040-credentials.dpapi');const bytes=fs.readFileSync(cipher);
 assert.ok(bytes.length>0);assert.ok(!bytes.includes(Buffer.from(VALUE.marker)));assert.ok(!bytes.includes(Buffer.from(VALUE.label)));
 receipt.cipher={bytes:bytes.length,sha256:sha(bytes),plaintextAbsent:true};
 await Promise.all(closures);
 assert.equal(receipt.helperCalls.length,1,'Exactly one native helper invocation per process');
 assert.equal(receipt.helperCalls[0].exitCode,0); // The unchanged product timer decides its 10-second deadline.
 if(!worker){
  const readOut=path.join(out,'read-process');
  const child=spawn(process.execPath,[fileURLToPath(import.meta.url),'--package-root',root,'--out',readOut,
   '--mode',mode,'--read-worker','1','--vault',vaultDir],{env:process.env,stdio:['ignore','pipe','pipe'],windowsHide:true});
  children.add(child);let workerOutput='',workerError='';
  child.stdout.on('data',data=>{if(workerOutput.length<65536)workerOutput+=data;});
  child.stderr.on('data',data=>{if(workerError.length<65536)workerError+=data;});
  const code=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('close',resolve);});children.delete(child);
  fs.writeFileSync(path.join(out,'read-process.stdout.raw'),redact(workerOutput));
  fs.writeFileSync(path.join(out,'read-process.stderr.raw'),redact(workerError));
  receipt.readProcessExitCode=code;assert.equal(code,0,'INDEPENDENT_PROCESS_READ_FAILED');
  const readReceipt=JSON.parse(fs.readFileSync(path.join(readOut,'receipt.json'),'utf8'));
  assert.equal(readReceipt.passed,true);assert.equal(readReceipt.availability.nativeVerified,true);
  receipt.independentProcessRead=true;
 }
 assert.ok(performance.now()-started<CASE_MS,'CASE_DEADLINE');
 receipt.passed=true;receipt.status=worker?'PASS_INDEPENDENT_NATIVE_READ':'PASS_NATIVE_CREDENTIAL_PERSISTENCE';
}catch(error){
 receipt.passed=false;receipt.status='FAIL';receipt.error=redact(error.stack||error);save();
}finally{
 clearTimeout(watchdog);
 for(const child of children)if(child.exitCode===null&&child.signalCode===null)child.kill();
 let cleanupTimer;const settled=await Promise.race([Promise.all(closures).then(()=>true),new Promise(resolve=>{cleanupTimer=setTimeout(()=>resolve(false),2000);})]);clearTimeout(cleanupTimer);
 if(!settled||children.size){receipt.passed=false;receipt.cleanupIncomplete=true;receipt.status='FAIL_CLEANUP';}
 receipt.elapsedMs=Math.round(performance.now()-started);save();
 console.log(JSON.stringify({passed:receipt.passed,status:receipt.status,receipt:path.join(out,'receipt.json')}));
 process.exitCode=receipt.passed?0:1;
}
