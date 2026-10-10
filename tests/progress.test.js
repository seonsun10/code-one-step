import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyProgress, makeBackup, normalizeProgress, parseBackup } from '../src/progress.js';

test('progress backups survive an export and restore round trip', () => {
  const progress = emptyProgress();
  progress.completedLessonIds.push('js-variables');
  progress.answers.push({ exerciseId: 'js-variables-choice', correct: true, response: 'b', answeredAt: '2026-10-09T00:00:00.000Z', note: '답을 맞혔어요.' });
  const backup = makeBackup(progress, '2026-10-09T00:00:00.000Z');
  assert.deepEqual(parseBackup(JSON.stringify(backup)), progress);
});

test('restore rejects malformed, unknown, and oversized backups', () => {
  assert.throws(() => parseBackup('{'), /JSON/);
  assert.throws(() => parseBackup(JSON.stringify({ format: 'other', version: 1, progress: {} })), /형식/);
  assert.throws(() => parseBackup(JSON.stringify({ format: 'study-web-progress', version: 2, progress: { completedLessonIds: [], answers: [] } })), /형식/);
  assert.throws(() => parseBackup(' '.repeat(1_000_001)), /1MB/);
  assert.throws(() => parseBackup(JSON.stringify({ format: 'study-web-progress', version: 1, progress: { completedLessonIds: null, answers: [] } })), /올바른 형식/);
});

test('import normalization bounds user-provided drafts and answer history', () => {
  const progress = emptyProgress();
  progress.drafts = { editor: '<script>alert(1)</script>' };
  progress.answers = [{ exerciseId: 'x', correct: false, response: 'attempt', answeredAt: 'not-a-date' }];
  const restored = parseBackup(JSON.stringify(makeBackup(progress)));
  assert.equal(restored.drafts.editor, '<script>alert(1)</script>');
  assert.equal(restored.answers.length, 1);
  assert.equal(restored.answers[0].exerciseId, 'x');
  assert.ok(Number.isFinite(Date.parse(restored.answers[0].answeredAt)));
  assert.ok(Number.isFinite(Date.parse(restored.updatedAt)));
});

test('invalid timestamps in imported progress become safe dates', () => {
  const restored = normalizeProgress({
    updatedAt: 'not-a-date',
    completedLessonIds: [],
    answers: [{ exerciseId: 'x', correct: false, answeredAt: 'not-a-date' }],
  });
  assert.ok(Number.isFinite(Date.parse(restored.updatedAt)));
  assert.ok(Number.isFinite(Date.parse(restored.answers[0].answeredAt)));
});
