import assert from 'node:assert/strict';
import test from 'node:test';
import { routeFromHash } from '../src/routing.js';

test('route fragments decode known page and identifier values', () => {
  assert.deepEqual(routeFromHash('#/lesson/js-arrays'), { page: 'lesson', id: 'js-arrays' });
  assert.deepEqual(routeFromHash('#/lesson/hello%20world'), { page: 'lesson', id: 'hello world' });
  assert.deepEqual(routeFromHash('#/coding'), { page: 'coding', id: '' });
  assert.deepEqual(routeFromHash('#/coding/javascript'), { page: 'coding', id: 'javascript' });
  assert.deepEqual(routeFromHash('#/coding/problem/js-sum-coding'), { page: 'coding-problem', id: 'js-sum-coding' });
  assert.deepEqual(routeFromHash('#/foundations'), { page: 'foundations', id: '' });
  assert.deepEqual(routeFromHash('#/foundations/week-01'), { page: 'foundations', id: 'week-01' });
});

test('malformed fragments resolve to a safe empty identifier', () => {
  assert.deepEqual(routeFromHash('#/lesson/%E0%A4'), { page: 'lesson', id: '' });
  assert.deepEqual(routeFromHash('#/coding/problem/%E0%A4'), { page: 'coding-problem', id: '' });
  assert.deepEqual(routeFromHash('#/missing/%E0%A4'), { page: 'home', id: '' });
});
