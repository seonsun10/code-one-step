import test from 'node:test';
import assert from 'node:assert/strict';
import { gradeAnswer } from '../src/grading.js';

test('choice and short answers are graded without accepting an empty answer', () => {
  assert.equal(gradeAnswer({ type: 'choice', answer: 'b' }, 'b'), true);
  assert.equal(gradeAnswer({ type: 'choice', answer: 'b' }, ''), false);
  assert.equal(gradeAnswer({ type: 'short-answer', acceptedAnswers: ['sum(scores) / len(scores)'] }, '  SUM(scores) / len(scores) '), true);
  assert.equal(gradeAnswer({ type: 'short-answer', acceptedAnswers: ['sum(scores) / len(scores)'] }, ''), false);
});

test('error-location and code-repair grading check exact expected changes', () => {
  const locate = { type: 'locate-error', answerLines: [2] };
  assert.equal(gradeAnswer(locate, [2]), true);
  assert.equal(gradeAnswer(locate, [1, 2]), false);
  const repair = { type: 'repair-code', requiredFragments: ['...profile', 'setProfile({'], forbiddenFragments: ['profile.name ='] };
  assert.equal(gradeAnswer(repair, ''), false);
  assert.equal(gradeAnswer(repair, 'setProfile({ ...profile, name: nextName });'), true);
  assert.equal(gradeAnswer(repair, 'profile.name = nextName; setProfile(profile);'), false);
});

test('coding exercise is correct only after every test passes', () => {
  assert.equal(gradeAnswer({ type: 'coding' }, { passed: true }), true);
  assert.equal(gradeAnswer({ type: 'coding' }, { passed: false }), false);
});
