import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const {openComputerCapabilities,lazyAuthorizedFiles}=await import(pathToFileURL(path.join(process.env.KODER_TEST_RUNTIME,'src/computer.mjs')));

test('a read-only scope root permits writable descendants without granting OS privileges', {skip:process.platform==='win32'||process.getuid?.()===0}, async t=>{
 const dir=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'koder-scope-'))),root=path.join(dir,'scope'),child=path.join(root,'project');
 fs.mkdirSync(child,{recursive:true});fs.chmodSync(root,0o555);
 t.after(()=>{fs.chmodSync(root,0o755);fs.rmSync(dir,{recursive:true,force:true});});
 let grant=null;const ctx={env:{...process.env,KODER_CLI_HOME:dir},command:'run',opts:{},io:{computerConsentStore:{read:async()=>grant,write:async next=>{grant=next;},authorizeOwner:async()=>true}}};
 const {capabilities}=await openComputerCapabilities(ctx);
 await capabilities.request({capabilities:['files.read','files.write'],roots:[root]});
 const files=lazyAuthorizedFiles(ctx),file=path.join(child,'result.txt');
 await files.write({path:file,content:'owned descendant'});
 assert.equal(fs.readFileSync(file,'utf8'),'owned descendant');
 await assert.rejects(files.write({path:path.join(root,'blocked.txt'),content:'blocked'}),e=>['EACCES','EPERM'].includes(e.code));
 assert.equal(fs.existsSync(path.join(root,'blocked.txt')),false);
 await assert.rejects(files.write({path:path.join(dir,'outside.txt'),content:'outside'}),/COMPUTER_PATH_OUTSIDE_GRANT/);
 await capabilities.revoke();
 await assert.rejects(files.write({path:file,content:'revoked'}),/COMPUTER_PERMISSION_REQUIRED/);
 assert.equal(fs.readFileSync(file,'utf8'),'owned descendant');
});
