import {createMemory} from '../../src/memory.mjs';
import {fixtureEnv} from '../windows-fixtures.mjs';
import crypto from 'node:crypto';
let memory;
process.on('message',message=>{
 if(message==='close'){memory.release();process.disconnect();return;}
 memory=createMemory({workspace:message.workspace,env:fixtureEnv(message.home)});memory.acquire();const data=memory.read();
 memory.write({...data,conversation:{id:crypto.randomUUID(),title:'Synthetic legacy task',createdAt:Date.now(),messages:[{id:crypto.randomUUID(),role:'user',content:'PRIVATE_LEGACY_TASK',at:Date.now()}]}});
 process.send({type:'ready'});
});
