import assert from 'node:assert/strict';import {performance} from 'node:perf_hooks';
const users=Array.from({length:500},(_,id)=>id),orders=Array.from({length:5000},(_,i)=>({user:i%500,cents:(i%7+1)*100}));
const slow=()=>users.map(id=>orders.filter(o=>o.user===id).reduce((s,o)=>s+o.cents,0));
const fast=()=>{const map=new Map();for(const o of orders)map.set(o.user,(map.get(o.user)||0)+o.cents);return users.map(id=>map.get(id)||0);};
const before=performance.now(),a=slow(),middle=performance.now(),b=fast(),end=performance.now();assert.deepEqual(a,b);
console.log(JSON.stringify({synthetic:true,users:users.length,orders:orders.length,equal:true,baselineMs:middle-before,indexedMs:end-middle,note:'Single local sample; repeat under comparable conditions. No product speed claim.'},null,2));
