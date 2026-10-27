import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {loadRelease} from './release.mjs';
const {LearningStore,document,hash}=await loadRelease('src/learning/store.mjs');

function fixture(t){
 const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'learning-durability-')));
 t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 return {root,store:new LearningStore(root)};
}
const put=(tx,n=12)=>{for(let i=0;i<n;i++)tx.put(`projects/p/n${i}.md`,document('memory',`n${i}`,{'content':`kept ${i}`}));};

test('a multi-document transaction syncs each leaf directory once per durable phase',async t=>{
 const {root,store}=fixture(t),dirs=[],sync=store.syncDir.bind(store);
 store.syncDir=dir=>{dirs.push(dir);return sync(dir);};
 await store.transact('batch',tx=>put(tx));
 const stage=path.join(root,'_ops/staging',hash('batch'),'projects/p');
 assert.equal(dirs.filter(d=>d===stage).length,1,'staging a batch must not repeat the same directory fsync for each document');
 assert.equal(dirs.filter(d=>d===path.join(root,'projects/p')).length,1,'publishing a batch must not repeat the same directory fsync');
 assert.equal((await store.snapshot()).size,12);
});

test('batching retains file syncs and durable prepare/publish/commit ordering',async t=>{
 const {root,store}=fixture(t),events=[],fds=new Map();
 const open=fs.openSync,close=fs.closeSync,sync=fs.fsyncSync,rename=fs.renameSync,syncDir=store.syncDir.bind(store);
 store.syncDir=dir=>{events.push({kind:'dir',path:dir});return syncDir(dir);};
 fs.openSync=function(p,...args){const fd=open.call(this,p,...args);fds.set(fd,String(p));return fd;};
 fs.closeSync=function(fd){const value=close.call(this,fd);fds.delete(fd);return value;};
 fs.fsyncSync=function(fd){if(!fs.fstatSync(fd).isDirectory())events.push({kind:'file',path:fds.get(fd)});return sync.call(this,fd);};
 fs.renameSync=function(a,b){const result=rename.call(this,a,b);events.push({kind:'rename',path:String(b)});return result;};
 try{await store.transact('ordered',tx=>put(tx,4));}
 finally{fs.openSync=open;fs.closeSync=close;fs.fsyncSync=sync;fs.renameSync=rename;store.syncDir=syncDir;}
 const journal=path.join(root,'_ops/transactions',hash('ordered')+'.md');
 const journalWrites=events.flatMap((e,i)=>e.kind==='rename'&&e.path===journal?[i]:[]);
 assert.equal(journalWrites.length,2);
 const [prepare,commit]=journalWrites;
 const finalDir=path.join(root,'projects/p');
 const firstPublish=events.findIndex(e=>e.kind==='rename'&&e.path.startsWith(finalDir+path.sep));
 assert.ok(events.some((e,i)=>i<prepare&&e.kind==='dir'&&e.path.endsWith(path.join('projects','p'))&&e.path.includes(path.sep+'_ops'+path.sep+'staging'+path.sep)));
 assert.ok(events.some((e,i)=>i>prepare&&i<firstPublish&&e.kind==='dir'&&e.path===path.dirname(journal)));
 assert.ok(events.some((e,i)=>i>prepare&&i<firstPublish&&e.kind==='dir'&&e.path===path.join(root,'_ops')), 'the newly created journal directory entry must be durable before output publication: '+JSON.stringify(events.filter(e=>e.kind==='dir')));
 assert.ok(events.some((e,i)=>i>firstPublish&&i<commit&&e.kind==='dir'&&e.path===finalDir));
 assert.equal(events.filter(e=>e.kind==='file').length,10,'four staging files, four outputs and both journal states must remain fsynced');
 for(let n=0;n<4;n++){
  const output=path.join(finalDir,`n${n}.md`),renamed=events.findIndex(e=>e.kind==='rename'&&e.path===output);
  assert.ok(events.some((e,i)=>i<renamed&&e.kind==='file'&&e.path.startsWith(output+'.')));
 }
});

test('an abandoned staging directory is made durable before a new prepared journal',async t=>{
 const {root,store}=fixture(t),rename=fs.renameSync;let interrupted=false;
 const stageRoot=path.join(root,'_ops/staging',hash('abandoned'));
 fs.renameSync=function(a,b){const result=rename.call(this,a,b);if(!interrupted&&String(b).startsWith(stageRoot+path.sep)){interrupted=true;throw new Error('TEST_STAGE_INTERRUPTED');}return result;};
 try{await assert.rejects(store.transact('abandoned',tx=>put(tx,2)),/TEST_STAGE_INTERRUPTED/);}
 finally{fs.renameSync=rename;}
 const resumed=new LearningStore(root),events=[],sync=resumed.syncDir.bind(resumed),write=resumed.write.bind(resumed);
 resumed.syncDir=dir=>{events.push({kind:'dir',path:dir});return sync(dir);};
 resumed.write=(rel,...args)=>{if(rel.startsWith('_ops/transactions/'))events.push({kind:'journal',path:rel});return write(rel,...args);};
 await resumed.transact('abandoned',tx=>put(tx,2));
 const prepared=events.findIndex(e=>e.kind==='journal');
 for(const dir of [stageRoot,path.join(stageRoot,'projects'),path.join(stageRoot,'projects/p')]){
  assert.ok(events.some((e,i)=>i<prepared&&e.kind==='dir'&&e.path===dir),dir);
 }
 assert.equal((await resumed.snapshot()).size,2);
});

test('interruption after publication preserves the journal and recovers without replaying a completed file',async t=>{
 const {root,store}=fixture(t),rename=fs.renameSync;
 let interrupted=false;
 fs.renameSync=function(a,b){const result=rename.call(this,a,b);if(!interrupted&&String(b)===path.join(root,'projects/p/n0.md')){interrupted=true;throw new Error('TEST_INTERRUPTED_AFTER_RENAME');}return result;};
 try{await assert.rejects(store.transact('interrupted',tx=>put(tx,3)),/TEST_INTERRUPTED/);}
 finally{fs.renameSync=rename;}
 const file=path.join(root,'projects/p/n0.md'),inode=fs.statSync(file).ino;
 const next=new LearningStore(root),dirs=[],sync=next.syncDir.bind(next);
 next.syncDir=dir=>{dirs.push(dir);return sync(dir);};
 const result=await next.snapshot();
 assert.equal(result.size,3);assert.equal(fs.statSync(file).ino,inode);
 assert.ok(dirs.includes(path.dirname(file)));
 assert.match(fs.readFileSync(path.join(root,'_ops/transactions',hash('interrupted')+'.md'),'utf8'),/committed/);
});

test('directory sync failure cannot mark a transaction committed and recovery flushes already visible outputs',async t=>{
 const {root,store}=fixture(t),sync=store.syncDir.bind(store);let failed=false;
 store.syncDir=dir=>{if(!failed&&dir===path.join(root,'projects/p')){failed=true;throw Object.assign(new Error('injected disk error'),{code:'EIO'});}return sync(dir);};
 await assert.rejects(store.transact('disk-error',tx=>put(tx,3)),{code:'EIO'});
 const journal=path.join(root,'_ops/transactions',hash('disk-error')+'.md');
 assert.match(fs.readFileSync(journal,'utf8'),/prepared/);
 const resumed=new LearningStore(root),dirs=[],syncAgain=resumed.syncDir.bind(resumed);
 resumed.syncDir=dir=>{dirs.push(dir);return syncAgain(dir);};
 await resumed.snapshot();
 assert.ok(dirs.includes(path.join(root,'projects/p')));
 assert.match(fs.readFileSync(journal,'utf8'),/committed/);
});


test('directory ancestry compares normalized paths before publishing the prepared journal',async t=>{
 const {root,store}=fixture(t),mkdir=fs.mkdirSync,dirs=[],sync=store.syncDir.bind(store);
 // Exercise the actual mkdir-to-write boundary with an equivalent pathname,
 // including the namespace prefix returned by Windows recursive mkdir.
 fs.mkdirSync=function(p,...args){const first=mkdir.call(this,p,...args);return first?path.toNamespacedPath(path.dirname(first)+path.sep+'.'+path.sep+path.basename(first)):first;};
 store.syncDir=dir=>{dirs.push(dir);return sync(dir);};
 try{await store.transact('normalized',tx=>put(tx,2));}finally{fs.mkdirSync=mkdir;}
 assert.ok(dirs.includes(path.join(root,'_ops')));
 assert.equal((await store.snapshot()).size,2);
});
