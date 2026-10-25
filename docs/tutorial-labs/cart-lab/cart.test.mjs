import test from 'node:test';
import assert from 'node:assert/strict';
import {total} from './cart.mjs';
test('empty cart',()=>assert.equal(total([]),0));
test('one item',()=>assert.equal(total([{price:150,qty:1}]),150));
test('quantity counts',()=>assert.equal(total([{price:200,qty:3},{price:150,qty:1}]),750));
test('zero quantity',()=>assert.equal(total([{price:200,qty:0}]),0));
