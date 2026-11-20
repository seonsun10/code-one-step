import assert from 'node:assert/strict';
import test from 'node:test';
import { codingProblems } from '../src/coding-problems.js';
import { toCodingExercise } from '../src/coding-problem-adapter.js';
import { tracks } from '../src/content.js';
import { codingProblemLimits, validateCodingProblem, validateCodingProblemBank } from '../scripts/coding-problem-schema.mjs';

function problem(overrides = {}) {
  return {
    id: 'js-array-sum',
    title: '배열의 합',
    language: 'javascript',
    framework: null,
    versionContext: 'ECMAScript 2026',
    level: '입문',
    topicIds: ['arrays'],
    prerequisiteIds: [],
    estimatedMinutes: 15,
    objective: '배열 값을 누적해 결과를 반환합니다.',
    statement: '숫자 배열의 모든 값을 더해 반환하세요.',
    requirements: ['배열 값을 모두 더합니다.', '빈 배열은 0을 반환합니다.'],
    constraints: ['빈 배열의 합은 0입니다.'],
    contract: {
      kind: 'function',
      entryPoint: 'sumNumbers',
      inputDescription: '숫자 배열 한 개를 전달합니다.',
      outputDescription: '숫자 하나를 반환합니다.',
    },
    examples: [{ input: [[2, 3]], expected: 5, explanation: '2와 3을 더합니다.' }],
    starterCode: 'function sumNumbers(numbers) { return 0; }',
    runtime: { status: 'verified', mode: 'function-return', adapterId: 'javascript-function-v1' },
    grading: {
      mode: 'runtime-output',
      comparison: 'deep-value',
      tests: [{ input: [[2, 3]], expected: 5 }, { input: [[]], expected: 0 }],
    },
    hints: ['누적값을 0에서 시작해 보세요.'],
    solution: {
      explanation: '초기값 0으로 배열을 누적하면 빈 배열도 0을 반환합니다.',
      referenceImplementation: 'function sumNumbers(numbers) { return numbers.reduce((sum, value) => sum + value, 0); }',
      complexity: 'O(n) 시간, O(1) 추가 공간',
    },
    sources: [{ title: 'Array.prototype.reduce()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce', reviewedAt: '2026-10-13' }],
    review: { status: 'approved', reviewedAt: '2026-10-13' },
    ...overrides,
  };
}

test('validates a reviewed local JavaScript function problem', () => {
  const candidate = problem();
  assert.deepEqual(validateCodingProblem(candidate), []);
  assert.deepEqual(validateCodingProblemBank([candidate]), { valid: true, errors: [] });
});

test('the shipped problem bank passes its own content contract', () => {
  assert.equal(codingProblems.filter((problemItem) => problemItem.language === 'javascript').length, 50);
  assert.equal(codingProblems.filter((problemItem) => problemItem.language === 'typescript').length, 50);
  assert.deepEqual(
    Object.fromEntries(['입문', '기초', '중급', '고급', '실전'].map((level) => [
      level,
      codingProblems.filter((problemItem) => problemItem.language === 'javascript' && problemItem.level === level).length,
    ])),
    { 입문: 10, 기초: 10, 중급: 10, 고급: 10, 실전: 10 },
  );
  const knownTopicIds = new Set(tracks.flatMap((track) => track.topics.map((topic) => topic.id)));
  assert.deepEqual(validateCodingProblemBank(codingProblems, { knownTopicIds }), { valid: true, errors: [] });
});

test('the legacy learning exercise is derived from the canonical coding problem', () => {
  const source = codingProblems[0];
  const linked = tracks.flatMap((track) => track.lessons.flatMap((lesson) => lesson.exercises))
    .find((exercise) => exercise.id === source.id);
  assert.ok(linked);
  assert.equal(linked.title, source.title);
  assert.equal(linked.entryPoint, source.contract.entryPoint);
  assert.deepEqual(linked.tests, source.grading.tests);
  assert.deepEqual(linked.acceptanceCriteria.requirements, source.requirements);
});

test('the problem bank projects reviewed problems into the runner contract without a lesson lookup', () => {
  const exercise = toCodingExercise(codingProblems[0]);
  assert.equal(exercise.type, 'coding');
  assert.equal(exercise.language, 'JavaScript');
  assert.equal(exercise.entryPoint, 'sumNumbers');
  assert.deepEqual(exercise.tests, codingProblems[0].grading.tests);
  assert.throws(() => toCodingExercise({ ...codingProblems[0], runtime: { status: 'unsupported' } }), /실행 검수를 통과/);
});

test('the TypeScript bank projects to the bounded TypeScript runner adapter', () => {
  const source = codingProblems.find((problemItem) => problemItem.language === 'typescript');
  const exercise = toCodingExercise(source);
  assert.equal(exercise.language, 'TypeScript');
  assert.equal(exercise.adapterId, 'typescript-function-v1');
  assert.equal(exercise.entryPoint, source.contract.entryPoint);
  assert.deepEqual(exercise.tests, source.grading.tests);
});

test('the PostgreSQL bank projects database setup and SQL tests into the runner adapter', () => {
  const source = codingProblems.find((problemItem) => problemItem.language === 'postgresql');
  const exercise = toCodingExercise(source);
  assert.equal(exercise.language, 'SQL · PostgreSQL');
  assert.equal(exercise.adapterId, 'postgresql-query-v1');
  assert.equal(exercise.entryPoint, undefined);
  assert.deepEqual(exercise.database, source.database);
  assert.deepEqual(exercise.tests, source.grading.tests);
});

test('the FastAPI bank projects ASGI request tests without a function entry point', () => {
  const source = codingProblems.find((problemItem) => problemItem.language === 'fastapi');
  const exercise = toCodingExercise(source);
  assert.equal(exercise.language, 'FastAPI · Python');
  assert.equal(exercise.adapterId, 'fastapi-asgi-v1');
  assert.equal(exercise.entryPoint, undefined);
  assert.deepEqual(exercise.tests, source.grading.tests);
  assert.equal(exercise.tests.length, 6);
  assert.deepEqual(exercise.tests[0].expected, source.grading.tests[0].expected);
});

test('rejects missing learning fields, bad ids, invalid sources, and unsafe case values', () => {
  const candidate = problem({
    id: 'Bad ID',
    objective: '',
    examples: [{ input: [[1]], expected: Number.NaN }],
    sources: [{ title: 'Unknown', url: 'http://example.com', reviewedAt: 'not-a-date' }],
  });
  const errors = validateCodingProblem(candidate);
  assert.ok(errors.some((error) => error.startsWith('id:')));
  assert.ok(errors.some((error) => error.startsWith('objective:')));
  assert.ok(errors.some((error) => error.includes('examples[0].expected')));
  assert.ok(errors.some((error) => error.includes('sources[0].url')));
  assert.ok(errors.some((error) => error.includes('sources[0].reviewedAt')));
});

test('rejects unknown runtimes, missing tests, and tests beyond runner limits', () => {
  const unknown = problem({ runtime: { status: 'verified', mode: 'function-return', adapterId: 'remote-runner' } });
  const noTests = problem({ grading: { mode: 'runtime-output', comparison: 'deep-value', tests: [] } });
  const tooManyTests = problem({ grading: { mode: 'runtime-output', comparison: 'deep-value', tests: Array.from({ length: codingProblemLimits.cases + 1 }, () => ({ input: [[]], expected: 0 })) } });
  assert.ok(validateCodingProblem(unknown).some((error) => error.includes('검증된 로컬 어댑터')));
  assert.ok(validateCodingProblem(noTests).some((error) => error.startsWith('grading.tests:')));
  assert.ok(validateCodingProblem(tooManyTests).some((error) => error.startsWith('grading.tests:')));
});

test('public examples must be covered by matching cases and text output must compare strings', () => {
  const mismatchedExample = problem({ examples: [{ input: [[2, 3]], expected: 6 }] });
  assert.ok(validateCodingProblem(mismatchedExample).some((error) => error.includes('채점 사례에 포함')));

  const invalidTextComparison = problem({
    runtime: { status: 'verified', mode: 'stdin-stdout', adapterId: 'javascript-stdio-v1' },
    contract: { kind: 'stdin', inputDescription: '한 줄 입력을 읽습니다.', outputDescription: '합계를 문자열로 출력합니다.' },
    grading: { mode: 'runtime-output', comparison: 'exact-text', tests: [{ input: '2 3', expected: 5 }] },
  });
  assert.ok(validateCodingProblem(invalidTextComparison).some((error) => error.includes('문자열 기대값')));
});

test('guided exercises must disclose unsupported execution and a self-review rubric', () => {
  const candidate = problem({
    language: 'python',
    contract: { kind: 'scenario', inputDescription: '제공된 코드를 읽습니다.', outputDescription: '수정 내용을 설명합니다.' },
    runtime: { status: 'unavailable', mode: 'none', adapterId: null },
    grading: { mode: 'guided', criteria: ['빈 배열에서도 결과를 설명합니다.'] },
  });
  assert.deepEqual(validateCodingProblem(candidate), []);
  const misleading = problem({ ...candidate, runtime: { status: 'unavailable', mode: 'function-return', adapterId: 'javascript-function-v1' } });
  assert.ok(validateCodingProblem(misleading).some((error) => error.startsWith('runtime:')));
});

test('problem-bank validation rejects duplicate ids, missing prerequisites, and cycles', () => {
  assert.equal(validateCodingProblemBank([]).valid, false);

  const duplicate = validateCodingProblemBank([problem(), problem()]);
  assert.equal(duplicate.valid, false);
  assert.ok(duplicate.errors.some((error) => error.includes('중복된 문제 ID')));

  const missing = validateCodingProblemBank([problem({ prerequisiteIds: ['missing-prerequisite'] })]);
  assert.ok(missing.errors.some((error) => error.includes('선수 문제 missing-prerequisite')));

  const first = problem({ prerequisiteIds: ['js-array-map'] });
  const second = problem({ id: 'js-array-map', prerequisiteIds: ['js-array-sum'] });
  const cycle = validateCodingProblemBank([first, second]);
  assert.ok(cycle.errors.includes('선수 문제 관계에 순환 참조가 있습니다.'));

  const badTopic = validateCodingProblemBank([problem({ topicIds: ['misspelled-topic'] })], {
    knownTopicIds: new Set(['arrays']),
  });
  assert.ok(badTopic.errors.some((error) => error.includes('주제 misspelled-topic')));
});
