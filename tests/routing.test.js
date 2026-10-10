import assert from 'node:assert/strict';
import test from 'node:test';
import { routeFromHash } from '../src/routing.js';

test('route fragments decode known page and identifier values', () => {
  assert.deepEqual(routeFromHash('#/lesson/js-arrays'), { page: 'lesson', id: 'js-arrays' });
  assert.deepEqual(routeFromHash('#/lesson/hello%20world'), { page: 'lesson', id: 'hello world' });
});

test('malformed fragments resolve to a safe empty identifier', () => {
  assert.deepEqual(routeFromHash('#/lesson/%E0%A4'), { page: 'lesson', id: '' });
  assert.deepEqual(routeFromHash('#/missing/%E0%A4'), { page: 'home', id: '' });
});
