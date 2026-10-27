// Real AT-SPI transport against one owned GTK process in an isolated desktop.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=path.resolve(process.env.KODER_TEST_RUNTIME),out=path.resolve(process.env.KODER_TEST_RESULTS);
const {createLinuxDesktopDriver,inspectLinuxDesktop}=await import(pathToFileURL(path.join(root,'src/linux-desktop.mjs')));
const {notifyNative}=await import(pathToFileURL(path.join(root,'src/agentd/notifications.mjs')));
const pid=(await fs.readFile(process.env.KODER_FIXTURE_PID,'utf8')).trim();
const inspection=await inspectLinuxDesktop();assert.equal(inspection.available,true,JSON.stringify(inspection));
let granted=false,authorizations=0;
const driver=createLinuxDesktopDriver({capabilities:{async authorize(){authorizations++;if(!granted)throw Object.assign(Error('not authorized'),{code:'COMPUTER_PERMISSION_REQUIRED'});}}});
const receipt={platform:process.platform,architecture:process.arch,inspection,scope:'Real AT-SPI with a synthetic GTK application and an injected grant. No real account, physical desktop or OS login/reboot acceptance.'};
try{
 await assert.rejects(driver.capture(),{code:'COMPUTER_PERMISSION_REQUIRED'});granted=true;
 let frame,found;
 for(let i=0;i<20;i++){
  frame=await driver.capture();found=frame.elements.find(e=>e.targetId?.startsWith('pid:'+pid+':'));
  if(found)break;await new Promise(r=>setTimeout(r,250));
 }
 assert.ok(found,'Owned GTK process must appear on the accessibility bus');
 frame=await driver.capture({app:found.targetId});
 assert.ok(!JSON.stringify(frame).includes('fixture-only-hidden-value'),'Password text must not leave the worker');
 assert.ok(frame.elements.some(e=>e.label==='[protected input]'&&e.actions.length===0));
 const entry=frame.elements.find(e=>e.label==='Koder fixture input'&&e.actions.includes('type'));assert.ok(entry,'EditableText must be exposed');
 const typed=await driver.act({snapshotId:frame.snapshotId,element:entry.id,action:'type',args:{text:'Ubuntu owned test'}});
 assert.equal(typed.ok,true);frame=typed.after;
 await assert.rejects(driver.act({snapshotId:typed.before.snapshotId,element:entry.id,action:'type',args:{text:'Do not repeat'}}),{code:'COMPUTER_SNAPSHOT_STALE'});
 const button=frame.elements.find(e=>e.label==='Apply fixture value'&&e.actions.includes('click'));assert.ok(button,'Native button action must be exposed');
 const clicked=await driver.act({snapshotId:frame.snapshotId,element:button.id,action:'click'});assert.equal(clicked.ok,true);
 // Some toolkit signals settle after the action response. Observe again; never replay.
 for(let i=0;i<10;i++){
  frame=await driver.capture({app:found.targetId});if(frame.elements.some(e=>e.label==='Fixture result: Ubuntu owned test'))break;
  await new Promise(r=>setTimeout(r,100));
 }
 assert.ok(frame.elements.some(e=>e.label==='Fixture result: Ubuntu owned test'),'Actual button callback must receive actual input');
 granted=false;await assert.rejects(driver.capture(),{code:'COMPUTER_PERMISSION_REQUIRED'});
 receipt.desktop={state:'PASS',typed:true,clicked:true,observedResult:true,passwordHidden:true,revocationChecked:true,staleNotReplayed:true,authorizations};
 const noDesktop=await notifyNative({kind:'task-done'},{env:{PATH:process.env.PATH}});assert.equal(noDesktop.state,'unavailable');assert.equal(noDesktop.reason,'NO_NOTIFICATION_SESSION');
 const notification=await notifyNative({kind:'task-done'});assert.equal(notification.state,'submitted',JSON.stringify(notification));
 receipt.notification={...notification,headless:noDesktop,physicalDisplay:'NOT_RUN'};
 receipt.passed=true;
} catch(error){receipt.passed=false;receipt.error={message:error.message,code:error.code};throw error;}
finally{await driver.close();await fs.mkdir(out,{recursive:true});await fs.writeFile(path.join(out,'desktop.json'),JSON.stringify(receipt,null,2)+'\n');}
