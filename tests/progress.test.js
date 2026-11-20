import test from 'node:test';
import assert from 'node:assert/strict';
import { getCurrentExerciseId, getExercise, lessons } from '../src/content.js';
import { codingProblems } from '../src/coding-problems.js';
import { emptyProgress, getCompletedLessonIds, latestCodingResults, latestExerciseResults, makeBackup, MAX_BACKUP_BYTES, migrateExerciseIds, normalizeProgress, parseBackup, PROGRESS_FORMAT, recordExerciseResult, separateCodingRecords } from '../src/progress.js';
import { gradeAnswer } from '../src/grading.js';

test('legacy exercise ids migrate saved answers, results, location, and drafts', () => {
  const progress = {
    answers: [
      { exerciseId: 'old-trace', correct: true, response: '0:a\n1:B', answeredAt: '2026-10-01T00:00:00.000Z' },
      { exerciseId: 'old-trace', correct: true, response: '0:A\n1:B', answeredAt: '2026-10-02T00:00:00.000Z' },
    ],
    exerciseResults: [
      { exerciseId: 'old-trace', correct: true, answeredAt: '2026-10-02T00:00:00.000Z' },
      { exerciseId: 'old-summary', correct: true, answeredAt: '2026-10-03T00:00:00.000Z' },
    ],
    lastExerciseId: 'old-trace',
    drafts: {
      'old-trace': 'older draft',
      'current-trace': 'current draft',
      'unrelated-exercise': 'unrelated draft',
    },
  };
  const currentIds = new Map([['old-trace', 'current-trace'], ['old-summary', 'current-summary']]);
  migrateExerciseIds(
    progress,
    (id) => currentIds.get(id) ?? id,
    (id, response) => id === 'current-trace' && response === '0:A\n1:B',
  );
  assert.equal(progress.answers[0].exerciseId, 'current-trace');
  assert.equal(progress.answers[0].correct, false);
  assert.equal(progress.answers[1].correct, true);
  assert.equal(progress.exerciseResults[0].exerciseId, 'current-trace');
  assert.equal(progress.exerciseResults[0].correct, true);
  assert.deepEqual(progress.exerciseResults[1], {
    exerciseId: 'current-summary',
    correct: false,
    answeredAt: '2026-10-03T00:00:00.000Z',
  });
  assert.equal(progress.lastExerciseId, 'current-trace');
  assert.deepEqual(progress.drafts, {
    'current-trace': 'current draft',
    'unrelated-exercise': 'unrelated draft',
  });
});

test('Python output-rule updates regrade and retain records under the current question id', () => {
  const oldExerciseId = 'py-w02-d4-trace-v2';
  const currentExercise = getExercise(oldExerciseId);
  assert.equal(currentExercise.id, 'py-w02-d4-trace-v3');
  const progress = {
    answers: [
      { exerciseId: oldExerciseId, correct: true, response: 'false', answeredAt: '2026-10-29T00:00:00.000Z' },
      { exerciseId: oldExerciseId, correct: true, response: 'False', answeredAt: '2026-10-29T00:01:00.000Z' },
    ],
    exerciseResults: [{ exerciseId: oldExerciseId, correct: true, answeredAt: '2026-10-29T00:01:00.000Z' }],
    lastExerciseId: oldExerciseId,
    drafts: { [oldExerciseId]: 'False' },
  };

  migrateExerciseIds(
    progress,
    getCurrentExerciseId,
    (id, response) => gradeAnswer(getExercise(id), response),
  );

  assert.equal(progress.answers[0].exerciseId, currentExercise.id);
  assert.equal(progress.answers[0].correct, false);
  assert.equal(progress.answers[1].correct, true);
  assert.equal(progress.exerciseResults[0].exerciseId, currentExercise.id);
  assert.equal(progress.exerciseResults[0].correct, true);
  assert.equal(progress.lastExerciseId, currentExercise.id);
  assert.deepEqual(progress.drafts, { [currentExercise.id]: 'False' });
});

test('Python shallow-copy trace updates preserve old ids and regrade the changed output', () => {
  const oldExerciseId = 'py-w05-d5-trace-v3';
  const currentExercise = getExercise(oldExerciseId);
  assert.equal(currentExercise.id, 'py-w05-d5-trace-v4');
  const progress = {
    answers: [{ exerciseId: oldExerciseId, correct: true, response: "[{'done': True}]", answeredAt: '2026-10-30T00:00:00.000Z' }],
    exerciseResults: [{ exerciseId: oldExerciseId, correct: true, answeredAt: '2026-10-30T00:00:00.000Z' }],
    lastExerciseId: oldExerciseId,
    drafts: { [oldExerciseId]: "[['done']]" },
  };

  migrateExerciseIds(
    progress,
    getCurrentExerciseId,
    (id, response) => gradeAnswer(getExercise(id), response),
  );

  assert.deepEqual(progress.answers[0], {
    exerciseId: currentExercise.id,
    correct: false,
    response: "[{'done': True}]",
    answeredAt: '2026-10-30T00:00:00.000Z',
  });
  assert.deepEqual(progress.exerciseResults[0], {
    exerciseId: currentExercise.id,
    correct: false,
    answeredAt: '2026-10-30T00:00:00.000Z',
  });
  assert.equal(progress.lastExerciseId, currentExercise.id);
  assert.deepEqual(progress.drafts, { [currentExercise.id]: "[['done']]" });
});

test('Python CPU workload trace updates retain and regrade saved progress', () => {
  const oldExerciseId = 'py-w11-d5-trace-v3';
  const currentExercise = getExercise(oldExerciseId);
  assert.equal(currentExercise.id, 'py-w11-d5-trace-v4');
  const progress = {
    answers: [{ exerciseId: oldExerciseId, correct: true, response: '16', answeredAt: '2026-10-30T00:00:00.000Z' }],
    exerciseResults: [{ exerciseId: oldExerciseId, correct: true, answeredAt: '2026-10-30T00:00:00.000Z' }],
    lastExerciseId: oldExerciseId,
    drafts: { [oldExerciseId]: '333332833333500000' },
  };

  migrateExerciseIds(
    progress,
    getCurrentExerciseId,
    (id, response) => gradeAnswer(getExercise(id), response),
  );

  assert.deepEqual(progress.answers[0], {
    exerciseId: currentExercise.id,
    correct: false,
    response: '16',
    answeredAt: '2026-10-30T00:00:00.000Z',
  });
  assert.deepEqual(progress.exerciseResults[0], {
    exerciseId: currentExercise.id,
    correct: false,
    answeredAt: '2026-10-30T00:00:00.000Z',
  });
  assert.equal(progress.lastExerciseId, currentExercise.id);
  assert.deepEqual(progress.drafts, { [currentExercise.id]: '333332833333500000' });
});

test('Python default_factory example updates preserve and regrade saved progress', () => {
  const oldExerciseId = 'py-w16-d2-trace-v2';
  const currentExercise = getExercise(oldExerciseId);
  assert.equal(currentExercise.id, 'py-w16-d2-trace-v3');
  const progress = {
    answers: [{ exerciseId: oldExerciseId, correct: true, response: '[]', answeredAt: '2026-10-30T00:00:00.000Z' }],
    exerciseResults: [{ exerciseId: oldExerciseId, correct: true, answeredAt: '2026-10-30T00:00:00.000Z' }],
    lastExerciseId: oldExerciseId,
    drafts: { [oldExerciseId]: "['Python'] []" },
  };

  migrateExerciseIds(
    progress,
    getCurrentExerciseId,
    (id, response) => gradeAnswer(getExercise(id), response),
  );

  assert.equal(progress.answers[0].exerciseId, currentExercise.id);
  assert.equal(progress.answers[0].correct, false);
  assert.equal(progress.answers[0].response, '[]');
  assert.equal(progress.exerciseResults[0].exerciseId, currentExercise.id);
  assert.equal(progress.exerciseResults[0].correct, false);
  assert.equal(progress.lastExerciseId, currentExercise.id);
  assert.deepEqual(progress.drafts, { [currentExercise.id]: "['Python'] []" });
});

test('Python requirement-order translation regrades and preserves earlier progress', () => {
  const oldExerciseId = 'py-w25-d1-trace-v3';
  const currentExercise = getExercise(oldExerciseId);
  assert.equal(currentExercise.id, 'py-w25-d1-trace-v4');
  assert.deepEqual(currentExercise.legacyIds, ['py-w25-d1-trace', 'py-w25-d1-trace-v2', oldExerciseId]);
  const progress = {
    answers: [{ exerciseId: oldExerciseId, correct: true, response: 'read -> validate -> apply', answeredAt: '2026-10-30T00:00:00.000Z' }],
    exerciseResults: [{ exerciseId: oldExerciseId, correct: true, answeredAt: '2026-10-30T00:00:00.000Z' }],
    lastExerciseId: oldExerciseId,
    drafts: { [oldExerciseId]: 'read -> validate -> apply' },
  };

  migrateExerciseIds(
    progress,
    getCurrentExerciseId,
    (id, response) => gradeAnswer(getExercise(id), response),
  );

  assert.deepEqual(progress.answers[0], {
    exerciseId: currentExercise.id,
    correct: false,
    response: 'read -> validate -> apply',
    answeredAt: '2026-10-30T00:00:00.000Z',
  });
  assert.deepEqual(progress.exerciseResults[0], {
    exerciseId: currentExercise.id,
    correct: false,
    answeredAt: '2026-10-30T00:00:00.000Z',
  });
  assert.equal(progress.lastExerciseId, currentExercise.id);
  assert.deepEqual(progress.drafts, { [currentExercise.id]: 'read -> validate -> apply' });
});

test('Java output-case updates regrade and retain records under the current question id', () => {
  const oldExerciseId = 'java-w18-d1-short-v2';
  const currentExercise = getExercise(oldExerciseId);
  assert.equal(currentExercise.id, 'java-w18-d1-short-v3');
  const progress = {
    answers: [
      { exerciseId: oldExerciseId, correct: true, response: 'java', answeredAt: '2026-10-29T00:00:00.000Z' },
      { exerciseId: oldExerciseId, correct: true, response: 'Java', answeredAt: '2026-10-29T00:01:00.000Z' },
    ],
    exerciseResults: [{ exerciseId: oldExerciseId, correct: true, answeredAt: '2026-10-29T00:01:00.000Z' }],
    lastExerciseId: oldExerciseId,
    drafts: { [oldExerciseId]: 'Java' },
  };

  migrateExerciseIds(
    progress,
    getCurrentExerciseId,
    (id, response) => gradeAnswer(getExercise(id), response),
  );

  assert.equal(progress.answers[0].exerciseId, currentExercise.id);
  assert.equal(progress.answers[0].correct, false);
  assert.equal(progress.answers[1].correct, true);
  assert.equal(progress.exerciseResults[0].exerciseId, currentExercise.id);
  assert.equal(progress.exerciseResults[0].correct, true);
  assert.equal(progress.lastExerciseId, currentExercise.id);
  assert.deepEqual(progress.drafts, { [currentExercise.id]: 'Java' });
});

test('PostgreSQL result-case updates regrade and retain records under the current question id', () => {
  const oldExerciseId = 'postgresql-week-10-day-1-v2-short';
  const currentExercise = getExercise(oldExerciseId);
  assert.equal(currentExercise.id, 'postgresql-week-10-day-1-v2-short-v2');
  const progress = {
    answers: [
      { exerciseId: oldExerciseId, correct: true, response: 'js, sql, sql', answeredAt: '2026-10-29T00:00:00.000Z' },
      { exerciseId: oldExerciseId, correct: true, response: 'JS, SQL, sql', answeredAt: '2026-10-29T00:01:00.000Z' },
    ],
    exerciseResults: [{ exerciseId: oldExerciseId, correct: true, answeredAt: '2026-10-29T00:01:00.000Z' }],
    lastExerciseId: oldExerciseId,
    drafts: { [oldExerciseId]: 'JS, SQL, sql' },
  };

  migrateExerciseIds(
    progress,
    getCurrentExerciseId,
    (id, response) => gradeAnswer(getExercise(id), response),
  );

  assert.equal(progress.answers[0].exerciseId, currentExercise.id);
  assert.equal(progress.answers[0].correct, false);
  assert.equal(progress.answers[1].correct, true);
  assert.equal(progress.exerciseResults[0].exerciseId, currentExercise.id);
  assert.equal(progress.exerciseResults[0].correct, true);
  assert.equal(progress.lastExerciseId, currentExercise.id);
  assert.deepEqual(progress.drafts, { [currentExercise.id]: 'JS, SQL, sql' });
});

test('React result-case updates regrade and retain records under the current question id', () => {
  const oldExerciseId = 'react-w13-d3-trace-v2';
  const currentExercise = getExercise(oldExerciseId);
  assert.equal(currentExercise.id, 'react-w13-d3-trace-v3');
  const progress = {
    answers: [
      { exerciseId: oldExerciseId, correct: true, response: 'EMPTY', answeredAt: '2026-10-29T00:00:00.000Z' },
      { exerciseId: oldExerciseId, correct: true, response: 'empty', answeredAt: '2026-10-29T00:01:00.000Z' },
    ],
    exerciseResults: [{ exerciseId: oldExerciseId, correct: true, answeredAt: '2026-10-29T00:01:00.000Z' }],
    lastExerciseId: oldExerciseId,
    drafts: { [oldExerciseId]: 'empty' },
  };

  migrateExerciseIds(
    progress,
    getCurrentExerciseId,
    (id, response) => gradeAnswer(getExercise(id), response),
  );

  assert.equal(progress.answers[0].exerciseId, currentExercise.id);
  assert.equal(progress.answers[0].correct, false);
  assert.equal(progress.answers[1].correct, true);
  assert.equal(progress.exerciseResults[0].exerciseId, currentExercise.id);
  assert.equal(progress.exerciseResults[0].correct, true);
  assert.equal(progress.lastExerciseId, currentExercise.id);
  assert.deepEqual(progress.drafts, { [currentExercise.id]: 'empty' });
});

test('JavaScript output rules regrade and retain records under the current question id', () => {
  const oldExerciseId = 'js-w22-d1-string-type-v2';
  const currentExercise = getExercise(oldExerciseId);
  assert.equal(currentExercise.id, 'js-w22-d1-string-type-v3');
  const progress = {
    answers: [
      { exerciseId: oldExerciseId, correct: true, response: 'STRING', answeredAt: '2026-10-29T00:00:00.000Z' },
      { exerciseId: oldExerciseId, correct: true, response: 'string', answeredAt: '2026-10-29T00:01:00.000Z' },
    ],
    exerciseResults: [{ exerciseId: oldExerciseId, correct: true, answeredAt: '2026-10-29T00:01:00.000Z' }],
    lastExerciseId: oldExerciseId,
    drafts: { [oldExerciseId]: 'string' },
  };

  migrateExerciseIds(
    progress,
    getCurrentExerciseId,
    (id, response) => gradeAnswer(getExercise(id), response),
  );

  assert.equal(progress.answers[0].exerciseId, currentExercise.id);
  assert.equal(progress.answers[0].correct, false);
  assert.equal(progress.answers[1].correct, true);
  assert.equal(progress.exerciseResults[0].exerciseId, currentExercise.id);
  assert.equal(progress.exerciseResults[0].correct, true);
  assert.equal(progress.lastExerciseId, currentExercise.id);
  assert.deepEqual(progress.drafts, { [currentExercise.id]: 'string' });
});

test('Next.js identifier updates regrade and retain records under the current question id', () => {
  const oldExerciseId = 'nextjs-w10-d4-reason-v2';
  const currentExercise = getExercise(oldExerciseId);
  assert.equal(currentExercise.id, 'nextjs-w10-d4-reason-v3');
  const progress = {
    answers: [
      { exerciseId: oldExerciseId, correct: true, response: 'promise.all', answeredAt: '2026-10-29T00:00:00.000Z' },
      { exerciseId: oldExerciseId, correct: true, response: 'Promise.all', answeredAt: '2026-10-29T00:01:00.000Z' },
    ],
    exerciseResults: [{ exerciseId: oldExerciseId, correct: true, answeredAt: '2026-10-29T00:01:00.000Z' }],
    lastExerciseId: oldExerciseId,
    drafts: { [oldExerciseId]: 'Promise.all' },
  };

  migrateExerciseIds(
    progress,
    getCurrentExerciseId,
    (id, response) => gradeAnswer(getExercise(id), response),
  );

  assert.equal(progress.answers[0].exerciseId, currentExercise.id);
  assert.equal(progress.answers[0].correct, false);
  assert.equal(progress.answers[1].correct, true);
  assert.equal(progress.exerciseResults[0].exerciseId, currentExercise.id);
  assert.equal(progress.exerciseResults[0].correct, true);
  assert.equal(progress.lastExerciseId, currentExercise.id);
  assert.deepEqual(progress.drafts, { [currentExercise.id]: 'Promise.all' });
});

test('Spring identifier updates regrade and retain records under the current question id', () => {
  const oldExerciseId = 'spring-w02-d2-short-v2';
  const currentExercise = getExercise(oldExerciseId);
  assert.equal(currentExercise.id, 'spring-w02-d2-short-v3');
  const progress = {
    answers: [
      { exerciseId: oldExerciseId, correct: true, response: 'EXISTSBYTITLE', answeredAt: '2026-10-29T00:00:00.000Z' },
      { exerciseId: oldExerciseId, correct: true, response: 'existsByTitle', answeredAt: '2026-10-29T00:01:00.000Z' },
    ],
    exerciseResults: [{ exerciseId: oldExerciseId, correct: true, answeredAt: '2026-10-29T00:01:00.000Z' }],
    lastExerciseId: oldExerciseId,
    drafts: { [oldExerciseId]: 'existsByTitle' },
  };

  migrateExerciseIds(
    progress,
    getCurrentExerciseId,
    (id, response) => gradeAnswer(getExercise(id), response),
  );

  assert.equal(progress.answers[0].exerciseId, currentExercise.id);
  assert.equal(progress.answers[0].correct, false);
  assert.equal(progress.answers[1].correct, true);
  assert.equal(progress.exerciseResults[0].exerciseId, currentExercise.id);
  assert.equal(progress.exerciseResults[0].correct, true);
  assert.equal(progress.lastExerciseId, currentExercise.id);
  assert.deepEqual(progress.drafts, { [currentExercise.id]: 'existsByTitle' });
});

test('Kotlin Android identifier updates regrade and retain records under the current question id', () => {
  const oldExerciseId = 'kotlin-w29-d5-v3-trace';
  const currentExercise = getExercise(oldExerciseId);
  assert.equal(currentExercise.id, 'kotlin-w29-d5-v4-trace');
  const correctAnswer = '지원되는 검색: 시스템 기기 선택 기능\n직접 검색·연결: ACCESS_LOCAL_NETWORK 권한';
  const progress = {
    answers: [
      { exerciseId: oldExerciseId, correct: true, response: '지원되는 검색: 시스템 기기 선택 기능\n직접 검색·연결: access_local_network 권한', answeredAt: '2026-10-29T00:00:00.000Z' },
      { exerciseId: oldExerciseId, correct: true, response: correctAnswer, answeredAt: '2026-10-29T00:01:00.000Z' },
    ],
    exerciseResults: [{ exerciseId: oldExerciseId, correct: true, answeredAt: '2026-10-29T00:01:00.000Z' }],
    lastExerciseId: oldExerciseId,
    drafts: { [oldExerciseId]: correctAnswer },
  };

  migrateExerciseIds(
    progress,
    getCurrentExerciseId,
    (id, response) => gradeAnswer(getExercise(id), response),
  );

  assert.equal(progress.answers[0].exerciseId, currentExercise.id);
  assert.equal(progress.answers[0].correct, false);
  assert.equal(progress.answers[1].correct, true);
  assert.equal(progress.exerciseResults[0].exerciseId, currentExercise.id);
  assert.equal(progress.exerciseResults[0].correct, true);
  assert.equal(progress.lastExerciseId, currentExercise.id);
  assert.deepEqual(progress.drafts, { [currentExercise.id]: correctAnswer });
});

test('progress backups survive an export and restore round trip', () => {
  const progress = emptyProgress();
  progress.completedLessonIds.push('js-variables');
  progress.answers.push({ exerciseId: 'js-variables-choice', correct: true, response: 'b', answeredAt: '2026-10-09T00:00:00.000Z', note: '답을 맞혔어요.' });
  const backup = makeBackup(progress, '2026-10-09T00:00:00.000Z');
  assert.deepEqual(parseBackup(JSON.stringify(backup)), normalizeProgress(progress));
  assert.deepEqual(backup.omittedFromSizeLimit, { answers: 0, drafts: 0, codingAnswers: 0, codingDrafts: 0 });
});

test('v2 backups keep coding progress separate and restore filters and location', () => {
  const progress = emptyProgress();
  progress.codingAnswers.push({
    exerciseId: 'js-sum-coding',
    correct: true,
    response: 'function sumNumbers(values) { return values.reduce((sum, value) => sum + value, 0); }',
    answeredAt: '2026-10-13T01:00:00.000Z',
    note: '6개 테스트 통과',
  });
  progress.codingResults = [{ exerciseId: 'js-sum-coding', correct: true, answeredAt: '2026-10-13T01:00:00.000Z' }];
  progress.codingDrafts = { 'js-sum-coding': 'function sumNumbers(values) { return 0; }' };
  progress.lastCodingProblemId = 'js-sum-coding';
  progress.lastActivity = 'coding';
  progress.codingFilters = { search: '합계', language: 'javascript', level: '입문', topic: 'js-data', status: 'in-progress' };

  const restored = parseBackup(JSON.stringify(makeBackup(progress)));

  assert.deepEqual(restored.codingAnswers, progress.codingAnswers);
  assert.deepEqual(restored.codingResults, progress.codingResults);
  assert.deepEqual(restored.codingDrafts, progress.codingDrafts);
  assert.equal(restored.lastCodingProblemId, 'js-sum-coding');
  assert.equal(restored.lastActivity, 'coding');
  assert.deepEqual(restored.codingFilters, progress.codingFilters);
  assert.deepEqual(restored.answers, []);
});

test('TypeScript coding drafts and results survive the separate local backup path', () => {
  const problem = codingProblems.find((item) => item.language === 'typescript');
  assert.ok(problem);
  const progress = emptyProgress();
  progress.codingAnswers.push({
    exerciseId: problem.id,
    correct: true,
    response: problem.solution.referenceImplementation,
    answeredAt: '2026-10-13T02:00:00.000Z',
    note: '300개 공개 사례를 확인한 문제 풀이',
  });
  progress.codingResults.push({ exerciseId: problem.id, correct: true, answeredAt: '2026-10-13T02:00:00.000Z' });
  progress.codingDrafts = { [problem.id]: problem.starterCode };
  progress.lastCodingProblemId = problem.id;
  progress.lastActivity = 'coding';
  progress.codingFilters = { search: '', language: 'typescript', level: problem.level, topic: 'js-data', status: 'solved' };

  const separated = separateCodingRecords(progress, codingProblems.map((item) => item.id));
  const restored = parseBackup(JSON.stringify(makeBackup(separated)));

  assert.deepEqual(restored.codingAnswers, progress.codingAnswers);
  assert.deepEqual(restored.codingResults, progress.codingResults);
  assert.deepEqual(restored.codingDrafts, progress.codingDrafts);
  assert.equal(restored.lastCodingProblemId, problem.id);
  assert.equal(restored.lastActivity, 'coding');
  assert.deepEqual(restored.codingFilters, progress.codingFilters);
  assert.deepEqual(restored.completedLessonIds, []);
  assert.deepEqual(restored.answers, []);
});

test('older combined coding records migrate once without deleting learning history', () => {
  const older = normalizeProgress({
    version: 1,
    completedLessonIds: [],
    answers: [
      { exerciseId: 'js-sum-coding', correct: false, response: 'old code', answeredAt: '2026-10-12T00:00:00.000Z' },
      { exerciseId: 'js-variables-choice', correct: true, response: 'b', answeredAt: '2026-10-12T00:01:00.000Z' },
    ],
    exerciseResults: [
      { exerciseId: 'js-sum-coding', correct: false, answeredAt: '2026-10-12T00:00:00.000Z' },
    ],
    drafts: { 'js-sum-coding': 'old draft' },
  });

  const migrated = separateCodingRecords(older, ['js-sum-coding']);
  const migratedAgain = separateCodingRecords(migrated, ['js-sum-coding']);

  assert.equal(migrated.codingAnswers.length, 1);
  assert.equal(latestCodingResults(migrated).find((result) => result.exerciseId === 'js-sum-coding').correct, false);
  assert.equal(migrated.codingDrafts['js-sum-coding'], 'old draft');
  assert.equal(migrated.answers.length, 2);
  assert.equal(migrated.drafts['js-sum-coding'], 'old draft');
  assert.equal(migratedAgain.codingAnswers.length, 1);
});

test('stored code execution details survive backup restore within output limits', () => {
  const progress = emptyProgress();
  progress.answers.push({
    exerciseId: 'js-sum-coding',
    correct: false,
    response: 'function sumNumbers(numbers) { return 0; }',
    answeredAt: '2026-10-13T00:00:00.000Z',
    note: '6개 테스트 중 1개를 통과했어요.',
    execution: {
      state: 'partial',
      passedCount: 1,
      total: 2,
      error: '',
      output: 'sum: 3',
      outputWasTruncated: false,
      results: [
        { passed: true, actualAvailable: true, actual: '3', output: 'sum: 3', error: '' },
        { passed: false, actualAvailable: true, actual: '0', output: '', error: '' },
      ],
    },
  });

  const restored = parseBackup(JSON.stringify(makeBackup(progress)));
  assert.deepEqual(restored.answers[0].execution, progress.answers[0].execution);
});

test('imported code execution details are restricted to supported status and bounded text', () => {
  const restored = normalizeProgress({
    answers: [{
      exerciseId: 'js-sum-coding',
      correct: false,
      execution: {
        state: 'unexpected',
        total: 1,
        output: 'x'.repeat(2_000),
        results: [],
      },
    }],
  });
  assert.equal('execution' in restored.answers[0], false);

  const bounded = normalizeProgress({
    answers: [{
      exerciseId: 'js-sum-coding',
      correct: false,
      execution: {
        state: 'partial',
        total: 1,
        passedCount: 0,
        output: 'x'.repeat(2_000),
        results: [{ actualAvailable: true, actual: 'y'.repeat(2_000) }],
      },
    }],
  });
  assert.equal(bounded.answers[0].execution.output.length, 1_800);
  assert.equal(bounded.answers[0].execution.results[0].actual.length, 1_800);
});

test('exercise mastery survives a capped attempt history', () => {
  const progress = emptyProgress();
  progress.exerciseResults = Array.from({ length: 180 }, (_, index) => ({
    exerciseId: `exercise-${index}`,
    correct: true,
    answeredAt: '2026-10-11T00:00:00.000Z',
  }));
  progress.answers = [
    { exerciseId: 'exercise-0', correct: true, response: 'first', answeredAt: '2026-10-10T00:00:00.000Z' },
    ...Array.from({ length: 500 }, (_, index) => ({
      exerciseId: 'exercise-179',
      correct: index < 499,
      response: 'retry',
      answeredAt: '2026-10-11T00:00:00.000Z',
    })),
  ];

  const restored = normalizeProgress(progress);
  const latest = new Map(latestExerciseResults(restored).map((result) => [result.exerciseId, result]));

  assert.equal(restored.answers.length, 500);
  assert.equal(restored.exerciseResults.length, 180);
  assert.equal(latest.get('exercise-0').correct, true);
  assert.equal(latest.get('exercise-179').correct, false);
});

test('dedicated coding results do not complete a learning lesson', () => {
  const lesson = lessons.find((item) => item.exercises.some((exercise) => exercise.id === 'js-sum-coding'));
  assert.ok(lesson);
  const progress = emptyProgress();
  progress.exerciseResults = lesson.exercises
    .filter((exercise) => exercise.id !== 'js-sum-coding')
    .map((exercise) => ({ exerciseId: exercise.id, correct: true, answeredAt: '2026-10-13T00:00:00.000Z' }));
  progress.codingResults = [{ exerciseId: 'js-sum-coding', correct: true, answeredAt: '2026-10-13T00:00:00.000Z' }];

  assert.ok(!getCompletedLessonIds(lessons, progress).includes(lesson.id));
  progress.exerciseResults.push({ exerciseId: 'js-sum-coding', correct: true, answeredAt: '2026-10-13T00:01:00.000Z' });
  assert.ok(getCompletedLessonIds(lessons, progress).includes(lesson.id));
});

test('completed lessons stay complete after repeated attempts exceed the answer history limit', () => {
  const progress = emptyProgress();
  const exercises = lessons.flatMap((lesson) => lesson.exercises);
  progress.exerciseResults = exercises.map((exercise) => ({
    exerciseId: exercise.id,
    correct: true,
    answeredAt: '2026-10-10T00:00:00.000Z',
  }));
  progress.answers = Array.from({ length: 501 }, (_, index) => ({
    exerciseId: exercises.at(-1).id,
    correct: false,
    response: 'retry',
    answeredAt: new Date(Date.UTC(2026, 9, 11, 0, 0, index)).toISOString(),
  }));

  const restored = normalizeProgress(progress);
  const completed = new Set(getCompletedLessonIds(lessons, restored));

  assert.equal(restored.exerciseResults.length, exercises.length);
  assert.equal(restored.exerciseResults[0].exerciseId, exercises[0].id);
  assert.ok(completed.has(lessons[0].id));
  assert.ok(!completed.has(lessons.at(-1).id));

  const imported = parseBackup(JSON.stringify(makeBackup(restored)));
  const importedCompleted = new Set(getCompletedLessonIds(lessons, imported));
  assert.equal(imported.exerciseResults.length, exercises.length);
  assert.ok(importedCompleted.has(lessons[0].id));
  assert.ok(!importedCompleted.has(lessons.at(-1).id));
});

test('legacy v1 answer history migrates into latest exercise results', () => {
  const legacy = emptyProgress();
  legacy.version = 1;
  delete legacy.exerciseResults;
  legacy.answers = [
    { exerciseId: 'exercise-1', correct: true, response: 'first', answeredAt: '2026-10-10T00:00:00.000Z' },
    { exerciseId: 'exercise-1', correct: false, response: 'retry', answeredAt: '2026-10-11T00:00:00.000Z' },
  ];

  const restored = parseBackup(JSON.stringify({ format: PROGRESS_FORMAT, version: 1, progress: legacy }));

  assert.deepEqual(restored.exerciseResults, [{
    exerciseId: 'exercise-1',
    correct: false,
    answeredAt: '2026-10-11T00:00:00.000Z',
  }]);
});

test('v1 completed lessons remain as separate history instead of claiming new three-question mastery', () => {
  const lesson = lessons[0];
  const legacy = emptyProgress();
  legacy.version = 1;
  legacy.completedLessonIds = [lesson.id];
  legacy.answers = [{
    exerciseId: lesson.exercises[0].id,
    correct: true,
    response: 'b',
    answeredAt: '2026-10-10T00:00:00.000Z',
  }];
  delete legacy.exerciseResults;
  delete legacy.legacyCompletedLessonIds;

  const restored = parseBackup(JSON.stringify({ format: PROGRESS_FORMAT, version: 1, progress: legacy }));

  assert.deepEqual(restored.legacyCompletedLessonIds, [lesson.id]);
  assert.deepEqual(getCompletedLessonIds(lessons, restored), []);
  assert.equal(latestExerciseResults(restored).find((result) => result.exerciseId === lesson.exercises[0].id).correct, true);
});

test('newer per-exercise summaries win over older retained attempt history', () => {
  const progress = emptyProgress();
  progress.exerciseResults = [{ exerciseId: 'exercise-1', correct: true, answeredAt: '2026-10-11T00:00:00.000Z' }];
  progress.answers = [{ exerciseId: 'exercise-1', correct: false, response: 'old retry', answeredAt: '2026-10-10T00:00:00.000Z' }];

  const restored = normalizeProgress(progress);
  const latest = latestExerciseResults(restored).find((result) => result.exerciseId === 'exercise-1');

  assert.equal(restored.exerciseResults[0].correct, true);
  assert.equal(latest.correct, true);
});

test('a newly submitted answer replaces a future-dated summary when the device clock moves backward', () => {
  const progress = emptyProgress();
  progress.exerciseResults = [{ exerciseId: 'exercise-1', correct: true, answeredAt: '2026-10-11T12:00:00.000Z' }];
  const newlySubmitted = {
    exerciseId: 'exercise-1',
    correct: false,
    response: 'retry',
    answeredAt: '2026-10-11T11:00:00.000Z',
  };
  progress.answers.push(newlySubmitted);
  progress.exerciseResults = recordExerciseResult(progress, newlySubmitted);

  const restored = normalizeProgress(progress);
  const latest = latestExerciseResults(restored).find((result) => result.exerciseId === 'exercise-1');

  assert.equal(restored.exerciseResults[0].correct, false);
  assert.equal(latest.correct, false);
  assert.equal(latest.answeredAt, newlySubmitted.answeredAt);
});

test('size-limited backups remain importable and keep per-exercise progress', () => {
  const progress = emptyProgress();
  progress.answers = Array.from({ length: 60 }, (_, index) => ({
    exerciseId: `exercise-${index}`,
    correct: true,
    response: 'x'.repeat(20_000),
    answeredAt: '2026-10-11T00:00:00.000Z',
    note: '',
  }));
  progress.exerciseResults = progress.answers.map(({ exerciseId, correct, answeredAt }) => ({ exerciseId, correct, answeredAt }));
  progress.drafts = Object.fromEntries(Array.from({ length: 80 }, (_, index) => [`draft-${index}`, 'y'.repeat(20_000)]));

  const backup = makeBackup(progress);
  const text = JSON.stringify(backup);
  const restored = parseBackup(text);

  assert.ok(new TextEncoder().encode(text).byteLength <= 1_000_000);
  assert.ok(backup.omittedFromSizeLimit.answers > 0);
  assert.ok(backup.omittedFromSizeLimit.drafts > 0);
  assert.equal(restored.exerciseResults.length, 60);
  assert.equal(latestExerciseResults(restored).filter((result) => result.correct).length, 60);
});

test('oversized coding answer backups keep the newest attempts and size bound', () => {
  const progress = emptyProgress();
  progress.codingAnswers = Array.from({ length: 60 }, (_, index) => ({
    exerciseId: 'js-sum-coding',
    correct: index % 2 === 0,
    response: 'x'.repeat(20_000),
    answeredAt: new Date(Date.UTC(2026, 9, 11, 0, 0, index)).toISOString(),
  }));
  const backup = makeBackup(progress);
  const restored = parseBackup(JSON.stringify(backup));

  assert.ok(new TextEncoder().encode(JSON.stringify(backup)).byteLength <= MAX_BACKUP_BYTES);
  assert.ok(backup.omittedFromSizeLimit.codingAnswers > 0);
  assert.ok(restored.codingAnswers.length > 0);
  assert.equal(restored.codingAnswers.at(-1).answeredAt, progress.codingAnswers.at(-1).answeredAt);
});

test('oversized coding draft backups keep recent drafts and size bound', () => {
  const progress = emptyProgress();
  progress.codingDrafts = Object.fromEntries(Array.from({ length: 80 }, (_, index) => [`coding-${index}`, 'y'.repeat(20_000)]));

  const backup = makeBackup(progress);
  const restored = parseBackup(JSON.stringify(backup));

  assert.ok(new TextEncoder().encode(JSON.stringify(backup)).byteLength <= MAX_BACKUP_BYTES);
  assert.ok(backup.omittedFromSizeLimit.codingDrafts > 0);
  assert.ok(Object.keys(restored.codingDrafts).length > 0);
  assert.equal(restored.codingDrafts['coding-79'], 'y'.repeat(20_000));
});

test('backup byte limit is recalculated after omission counters grow', () => {
  const progress = emptyProgress();
  progress.answers = Array.from({ length: 100 }, (_, index) => ({
    exerciseId: `exercise-${index}`,
    correct: true,
    response: 'x'.repeat(20_000),
    answeredAt: '2026-10-11T00:00:00.000Z',
    note: '',
  }));
  progress.exerciseResults = progress.answers.map(({ exerciseId, correct, answeredAt }) => ({ exerciseId, correct, answeredAt }));
  progress.drafts = { editor: 'y'.repeat(7_180) };

  const text = JSON.stringify(makeBackup(progress));
  const bytes = new TextEncoder().encode(text).byteLength;

  assert.ok(bytes <= 1_000_000);
  assert.doesNotThrow(() => parseBackup(text));
});

test('restore rejects malformed, unknown, and oversized backups', () => {
  assert.throws(() => parseBackup('{'), /JSON/);
  assert.throws(() => parseBackup(JSON.stringify({ format: 'other', version: 1, progress: {} })), /형식/);
  assert.throws(() => parseBackup(JSON.stringify({ format: 'study-web-progress', version: 3, progress: { completedLessonIds: [], answers: [] } })), /형식/);
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
