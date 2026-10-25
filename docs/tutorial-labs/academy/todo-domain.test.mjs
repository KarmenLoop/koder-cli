import test from 'node:test';import assert from 'node:assert/strict';import {createStore} from './todo-domain.mjs';
test('create and read a synthetic item',()=>{const s=createStore(),x=s.create('A','  Read lesson 91  ');assert.equal(x.title,'Read lesson 91');assert.equal(s.read('A',x.id).done,false);});
test('reject empty, non-string and overlong titles',()=>{const s=createStore();for(const x of ['', ' ',null,42,'x'.repeat(121)])assert.throws(()=>s.create('A',x),/INVALID_TITLE/);});
test('require synthetic identity',()=>assert.throws(()=>createStore().create('','task'),/IDENTITY_REQUIRED/));
test('deny another owner both read and update',()=>{const s=createStore(),x=s.create('A','task');assert.throws(()=>s.read('B',x.id),/NOT_FOUND_OR_FORBIDDEN/);assert.throws(()=>s.complete('B',x.id),/NOT_FOUND_OR_FORBIDDEN/);assert.equal(s.read('A',x.id).done,false);});
test('list isolation and successful completion',()=>{const s=createStore(),a=s.create('A','A task');s.create('B','B task');assert.equal(s.list('A').length,1);assert.equal(s.complete('A',a.id).done,true);});
test('returned objects cannot mutate stored state',()=>{const s=createStore(),a=s.create('A','original');a.title='changed';s.list('A')[0].done=true;assert.equal(s.read('A',a.id).title,'original');assert.equal(s.read('A',a.id).done,false);});
