import assert from 'node:assert/strict';
import test from 'node:test';
import { formatExerciseValue, sameExerciseValue } from '../src/runner-values.js';

test('runner result comparison requires matching primitive types and values', () => {
  assert.equal(sameExerciseValue(3, 3), true);
  assert.equal(sameExerciseValue(-0, 0), true);
  assert.equal(sameExerciseValue('3', 3), false);
  assert.equal(sameExerciseValue(false, 0), false);
});

test('runner result comparison handles nested arrays and ignores object key order', () => {
  assert.equal(sameExerciseValue(
    { learner: { name: 'Mina', scores: [10, 20] }, active: true },
    { active: true, learner: { scores: [10, 20], name: 'Mina' } },
  ), true);
  assert.equal(sameExerciseValue([1, { value: 2 }], [1, { value: 2 }]), true);
  assert.equal(sameExerciseValue([1, 2], [2, 1]), false);
  assert.equal(sameExerciseValue({ value: 2 }, { value: '2' }), false);
  assert.equal(sameExerciseValue({ value: 2 }, { value: 2, extra: true }), false);
});

test('runner output formatting keeps strings readable and structures inspectable', () => {
  assert.equal(formatExerciseValue('hello'), 'hello');
  assert.equal(formatExerciseValue({ answer: 42 }), '{\n  "answer": 42\n}');
});
